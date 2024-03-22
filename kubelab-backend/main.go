package main

import (
	"log"
	"os"
	"path/filepath"
	"strings"

	"github.com/natrontech/kubelab/hooks"
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
	migrationsDir := "" // default to "pb_migrations" (for js) and "migrations" (for go)

	// load js files to allow loading external JavaScript migrations
	jsvm.MustRegister(app, jsvm.Config{
		// Dir: migrationsDir,
		MigrationsDir: migrationsDir,
	})

	// register the `migrate` command
	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		TemplateLang: migratecmd.TemplateLangJS, // or migratecmd.TemplateLangGo (default)
		Dir:          migrationsDir,
		Automigrate:  true,
	})

	// call this only if you want to use the configurable "hooks" functionality
	hooks.PocketBaseInit(app)

	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		// serves static files from the provided public dir (if exists)
		e.Router.GET("/*", apis.StaticDirectoryHandler(os.DirFS(publicDirFlag), true))

		return nil
	})

	app.OnRecordBeforeUpdateRequest().Add(func(e *core.RecordUpdateEvent) error {
		switch e.Collection.Name {
		case "lab_sessions":
			return controller.HandleLabSessions(e, app)
		case "exercise_sessions":
			return controller.HandleExerciseSessions(e, app)
		}
		return nil
	})

	// scheduler for syncing lab and exercise sessions
	app.OnBeforeBootstrap().Add(func(e *core.BootstrapEvent) error {
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
