package main

import (
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/natrontech/kubelab/hooks"
	"github.com/natrontech/kubelab/pkg/env"
	"github.com/natrontech/kubelab/pkg/helm"
	"github.com/natrontech/kubelab/pkg/k8s"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/models"
	"github.com/pocketbase/pocketbase/plugins/jsvm"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"
	"gopkg.in/yaml.v2"
	v1 "k8s.io/api/core/v1"
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
		// check collection name
		if e.Collection.Name == "lab_sessions" {
			if e.Record.GetBool("clusterRunning") {

				// deploy a new vcluster
				helmclient, err := helm.CreateHelmClient(e.Record.GetString("lab"), e.Record.GetString("user"))
				if err != nil {
					log.Println(err)
					return err
				}

				err = helm.AddHelmRepositoryToClient(helmclient, "loft-sh", "https://charts.loft.sh")
				if err != nil {
					log.Println(err)
					return err
				}

				// create yaml struct
				yamlValues := struct {
					Sync struct {
						PersistentVolumes struct {
							Enabled bool `yaml:"enabled"`
						} `yaml:"persistentvolumes"`
						StorageClasses struct {
							Enabled bool `yaml:"enabled"`
						} `yaml:"storageclasses"`
						Ingresses struct {
							Enabled bool `yaml:"enabled"`
						} `yaml:"ingresses"`
						HostStorageClasses struct {
							Enabled bool `yaml:"enabled"`
						} `yaml:"hoststorageclasses"`
					} `yaml:"sync"`
					Storage struct {
						Persistence bool `yaml:"persistence"`
					} `yaml:"storage"`
					Isolation struct {
						Enabled             bool   `yaml:"enabled"`
						PodSecurityStandard string `yaml:"podSecurityStandard"`
						NodeProxyPermission struct {
							Enabled bool `yaml:"enabled"`
						} `yaml:"nodeProxyPermission"`
						ResourceQuota struct {
							Enabled bool `yaml:"enabled"`
						} `yaml:"resourceQuota"`
						LimitRange struct {
							Enabled        bool              `yaml:"enabled"`
							Default        map[string]string `yaml:"default"`
							DefaultRequest map[string]string `yaml:"defaultRequest"`
						} `yaml:"limitRange"`
						NetworkPolicy struct {
							Enabled             bool `yaml:"enabled"`
							OutgoingConnections struct {
								IPBlock struct {
									CIDR   string   `yaml:"cidr"`
									Except []string `yaml:"except"`
								} `yaml:"ipBlock"`
							} `yaml:"outgoingConnections"`
						} `yaml:"networkPolicy"`
					} `yaml:"isolation"`
				}{}

				// set values
				yamlValues.Sync.PersistentVolumes.Enabled = true
				yamlValues.Sync.StorageClasses.Enabled = false
				yamlValues.Sync.Ingresses.Enabled = true
				yamlValues.Sync.HostStorageClasses.Enabled = true
				yamlValues.Storage.Persistence = false
				yamlValues.Isolation.Enabled = true
				yamlValues.Isolation.PodSecurityStandard = "baseline"
				yamlValues.Isolation.NodeProxyPermission.Enabled = false
				yamlValues.Isolation.ResourceQuota.Enabled = false
				yamlValues.Isolation.LimitRange.Enabled = true
				yamlValues.Isolation.LimitRange.Default = map[string]string{
					"ephemeral-storage": "8Gi",
					"memory":            "512Mi",
					"cpu":               "1",
				}
				yamlValues.Isolation.LimitRange.DefaultRequest = map[string]string{
					"ephemeral-storage": "3Gi",
					"memory":            "128Mi",
					"cpu":               "100m",
				}
				yamlValues.Isolation.NetworkPolicy.Enabled = true
				yamlValues.Isolation.NetworkPolicy.OutgoingConnections.IPBlock.CIDR = "8.8.8.8/32"

				// convert to yaml
				yamlValuesBytes, err := yaml.Marshal(yamlValues)
				if err != nil {
					log.Println(err)
					return err
				}

				_, err = helm.CreateOrUpdateHelmRelease(
					helmclient,
					"loft-sh/vcluster",
					"vcluster",
					helm.GetNamespaceName(e.Record.GetString("lab"), e.Record.GetString("user")),
					"0.15.2",
					string(string(yamlValuesBytes)),
				)
				if err != nil {
					log.Println(err)
					return err
				}

				err = k8s.CreateResourceQuota(helm.GetNamespaceName(e.Record.GetString("lab"), e.Record.GetString("user")), env.Config.ResourceName, env.Config.PodsLimit, env.Config.StorageLimit)
				if err != nil {
					log.Println(err)
					return err
				}

				time.Sleep(15 * time.Second)

			} else {
				// delete the namespace
				err := k8s.DeleteNamespace(helm.GetNamespaceName(e.Record.GetString("lab"), e.Record.GetString("user")))
				if err != nil {
					log.Println(err)
				}

				time.Sleep(15 * time.Second)
			}
		}

		if e.Collection.Name == "exercise_sessions" {
			if e.Record.GetBool("agentRunning") {
				var err error
				var exercise *models.Record
				// retrieve the exercise
				exercise, err = app.Dao().FindRecordById("exercises", e.Record.GetString("exercise"))
				if err != nil {
					log.Println(err)
					return err
				}

				// check if the namespace exists
				err = k8s.CreateNamespace(helm.GetNamespaceName(exercise.GetString("lab"), e.Record.GetString("user")))
				if err != nil {
					log.Println(err)
				} else {
					return err
				}

				// check if vcluster pod exists 'vcluster-0'
				_, err = k8s.GetPodByName(helm.GetNamespaceName(exercise.GetString("lab"), e.Record.GetString("user")), "vcluster-0")
				if err != nil {
					log.Println(err)
					return err
				}

				// get kubeconfig secret called 'vc-vcluster'
				var secret *v1.Secret
				secret, err = k8s.GetSecretByName(helm.GetNamespaceName(exercise.GetString("lab"), e.Record.GetString("user")), "vc-vcluster")
				if err != nil {
					log.Println(err)
					return err
				}

				// get exercise.GetString("bootstrap") this is a url to a bootstrap script over https github raw
				bootstrap, err := http.Get(exercise.GetString("bootstrap"))
				if err != nil {
					log.Println(err)
					return err
				}

				defer bootstrap.Body.Close()

				// read the body
				bootstrapBody, err := io.ReadAll(bootstrap.Body)
				if err != nil {
					log.Println(err)
					return err
				}

				check, err := http.Get(exercise.GetString("check"))
				if err != nil {
					log.Println(err)
					return err
				}

				defer check.Body.Close()

				// read the body
				checkBody, err := io.ReadAll(check.Body)
				if err != nil {
					log.Println(err)
					return err
				}

				// create a new deployment
				_, err = k8s.CreateDeployment(
					"kubelab-agent-"+exercise.Id,
					helm.GetNamespaceName(exercise.GetString("lab"), e.Record.GetString("user")),
					env.Config.KubelabImage,
					1,
					string(secret.Data["config"]),
					string(bootstrapBody),
					string(checkBody),
					env.Config.AllowedHosts,
				)
				if err != nil {
					log.Println(err)
				}

				// create a new service
				_, err = k8s.CreateService(
					helm.GetNamespaceName(exercise.GetString("lab"), e.Record.GetString("user")),
					"kubelab-agent-"+exercise.Id,
					8376,
				)
				if err != nil {
					log.Println(err)
				}

				// create a new ingress
				_, err = k8s.CreateIngress(
					helm.GetNamespaceName(exercise.GetString("lab"), e.Record.GetString("user")),
					"kubelab-"+exercise.GetString("lab")+"-"+exercise.Id+"-"+e.Record.GetString("user"),
					env.Config.AllowedHosts,
					"kubelab-agent-"+exercise.Id,
					"kubelab-"+exercise.GetString("lab")+"-"+exercise.Id+"-"+e.Record.GetString("user"),
				)

				// check if deployment is ready
				err = k8s.WaitForDeployment(helm.GetNamespaceName(exercise.GetString("lab"), e.Record.GetString("user")), "kubelab-agent-"+exercise.Id)
				if err != nil {
					log.Println(err)
				}

				// sleep for 5 seconds
				time.Sleep(5 * time.Second)

			} else {
				var err error
				var exercise *models.Record
				// retrieve the exercise
				exercise, err = app.Dao().FindRecordById("exercises", e.Record.GetString("exercise"))
				if err != nil {
					log.Println(err)
					return err
				}
				// delete the deployment
				err = k8s.DeleteDeployment(helm.GetNamespaceName(exercise.GetString("lab"), e.Record.GetString("user")), "kubelab-agent-"+exercise.Id)
				if err != nil {
					log.Println(err)
					// return err
				}

				// delete the service
				err = k8s.DeleteService(helm.GetNamespaceName(exercise.GetString("lab"), e.Record.GetString("user")), "kubelab-agent-"+exercise.Id)
				if err != nil {
					log.Println(err)
					// return err
				}

				// delete the ingress
				err = k8s.DeleteIngress(helm.GetNamespaceName(exercise.GetString("lab"), e.Record.GetString("user")), "kubelab-"+exercise.GetString("lab")+"-"+exercise.Id+"-"+e.Record.GetString("user"))
				if err != nil {
					log.Println(err)
					// return err
				}
			}
		}

		return nil
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
