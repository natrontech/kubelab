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
	"ganigeorgiev.com/pocketbase/pocketbase"
	"ganigeorgiev.com/pocketbase/pocketbase/apis"
	"ganigeorgiev.com/pocketbase/pocketbase/core"
	"ganigeorgiev.com/pocketbase/pocketbase/plugins/jsvm"
	"ganigeorgiev.com/pocketbase/pocketbase/plugins/migratecmd"
)

func defaultPublicDir() string {
	if strings.HasPrefix(os.Args[0], os.TempDir()) {
		return "./pb_public"
	}
	return filepath.Join(filepath.Dir(os.Args[0]), "pb_public")
}

func newApp(config pocketbase.Config) *pocketbase.PocketBase {
	// Register database migrations before bootstrap so existing installations retain their history
	app := pocketbase.NewWithConfig(config)
	var publicDir string
	app.RootCmd.PersistentFlags().StringVar(&publicDir, "publicDir", defaultPublicDir(), "the directory to serve static files")
	jsvm.MustRegister(app, jsvm.Config{MigrationsDir: "./pb_migrations"})
	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		TemplateLang: migratecmd.TemplateLangJS,
		Dir:          "./pb_migrations",
		Automigrate:  true,
	})

	// Initialize cluster access only when serving so migration commands work without Kubernetes credentials
	app.OnServe().BindFunc(func(e *core.ServeEvent) error {
		k8s.Init()
		hooks.PocketBaseInit(app)
		app.Cron().MustAdd("sessions_syncer", env.Config.CronTick, func() {
			if err := controller.AutoSessionSyncController(app); err != nil {
				log.Printf("Error syncing sessions: %v", err)
			}
		})
		e.Router.GET("/{path...}", apis.Static(os.DirFS(publicDir), true))
		return e.Next()
	})

	// Complete cluster changes before allowing the updated session record to be saved
	app.OnRecordUpdateRequest("lab_sessions", "exercise_sessions").BindFunc(func(e *core.RecordRequestEvent) error {
		// Request hooks now run before form validation, so reject invalid changes before provisioning
		if err := e.App.Validate(e.Record); err != nil {
			return e.BadRequestError("Failed to update session", err)
		}
		var err error
		switch e.Record.Collection().Name {
		case "lab_sessions":
			err = controller.HandleLabSessions(e, app)
		case "exercise_sessions":
			err = controller.HandleExerciseSessions(e, app)
		}
		if err != nil {
			return err
		}
		return e.Next()
	})

	return app
}

func main() {
	env.Init()
	app := newApp(pocketbase.Config{})
	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
