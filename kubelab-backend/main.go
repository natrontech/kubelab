package main

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"

	hooks "pocketbase/hooks"
	"pocketbase/internal/env"
	"pocketbase/internal/helm"
	"pocketbase/internal/k8s"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/plugins/jsvm"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"
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
	jsvm.MustRegisterMigrations(app, &jsvm.MigrationsOptions{
		Dir: migrationsDir,
	})

	// register the `migrate` command
	migratecmd.MustRegister(app, app.RootCmd, &migratecmd.Options{
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
		log.Println(e.Collection.Name)
		// check collection name
		if e.Collection.Name == "sessions" {
			log.Println(e.Record.GetString("title"))
			if e.Record.GetBool("clusterRunning") {
				// deploy a new vcluster
				helmclient, err := helm.CreateHelmClient(e.Record.GetString("title"), e.Record.GetString("user"))
				if err != nil {
					log.Println(err)
				}

				err = helm.AddHelmRepositoryToClient(helmclient, "loft-sh", "https://charts.loft.sh")
				if err != nil {
					log.Println(err)
				}

				_, err = helm.CreateOrUpdateHelmRelease(
					helmclient,
					"loft-sh/vluster",
					"vluster",
					helm.GetNamespaceName(e.Record.GetString("title"), e.Record.GetString("user")),
					"0.15.1",
					"",
				)
				if err != nil {
					log.Println(err)
				}

			} else {
				fmt.Println("cluster not running")
			}
		}

		return nil
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
