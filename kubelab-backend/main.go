package main

import (
	"log"
	"os"
	"path/filepath"
	"strings"

	"github.com/natrontech/kubelab/hooks"
	"github.com/natrontech/kubelab/pkg/collections"
	"github.com/natrontech/kubelab/pkg/controller"
	"github.com/natrontech/kubelab/pkg/env"
	"github.com/natrontech/kubelab/pkg/k8s"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/plugins/jsvm"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"
	"github.com/pocketbase/pocketbase/tools/cron"
)

func defaultPublicDir() string {
	if strings.HasPrefix(os.Args[0], os.TempDir()) {
		// most likely ran with go run
		return "./pb_public"
	}

	return filepath.Join(os.Args[0], "../pb_public")
}

func init() {
	// set the default public dir
	env.Init()
	k8s.Init()
}

func main() {
	app := pocketbase.New()

	var publicDirFlag string

	// add "--publicDir" option flag
	app.RootCmd.PersistentFlags().StringVar(
		&publicDirFlag,
		"publicDir",
		defaultPublicDir(),
		"the directory to serve static files",
	)
	// Migrations are now handled programmatically via collections package
	// Keep jsvm and migratecmd registered for compatibility
	jsvm.MustRegister(app, jsvm.Config{})
	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		Automigrate: false,
	})

	// call this only if you want to use the configurable "hooks" functionality
	hooks.PocketBaseInit(app)

	app.OnServe().BindFunc(func(e *core.ServeEvent) error {
		// Call e.Next() first to initialize the serve listener
		if err := e.Next(); err != nil {
			return err
		}

		// serves static files from the provided public dir (if exists)
		e.Router.GET("/"+apis.StaticWildcardParam, apis.Static(os.DirFS(publicDirFlag), true))

		return nil
	})

	app.OnRecordUpdateRequest().BindFunc(func(e *core.RecordRequestEvent) error {
		switch e.Collection.Name {
		case "lab_sessions":
			return controller.HandleLabSessions(e, app)
		case "exercise_sessions":
			return controller.HandleExerciseSessions(e, app)
		default:
			return e.Next()
		}
	})

	// scheduler for syncing lab and exercise sessions
	app.OnBootstrap().BindFunc(func(e *core.BootstrapEvent) error {
		// Call e.Next() first to continue the bootstrap process
		if err := e.Next(); err != nil {
			return err
		}

		// Initialize collections
		log.Println("Initializing collections...")
		if err := collections.InitializeCollections(app); err != nil {
			log.Printf("Error initializing collections: %v\n", err)
			return err
		}
		log.Println("Collections initialized successfully")

		scheduler := cron.New()

		// Run sync every minute
		scheduler.MustAdd("sessions_syncer", env.Config.CronTick, func() {
			err := controller.AutoSessionSyncController(app)
			if err != nil {
				log.Printf("Error syncing sessions: %v\n", err)
			}
		})

		scheduler.Start()
		return nil
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
