package controller

import (
	"log"
	"time"

	"github.com/natrontech/kubelab/pkg/env"
	"github.com/natrontech/kubelab/pkg/helm"
	"github.com/natrontech/kubelab/pkg/k8s"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)

func setupExerciseResources(e *core.RecordUpdateEvent, app *pocketbase.PocketBase) error {
	exercise, err := app.Dao().FindRecordById("exercises", e.Record.GetString("exercise"))
	if err != nil {
		return logAndReturnErr(err)
	}

	user, err := app.Dao().FindRecordById("users", e.Record.GetString("user"))
	if err != nil {
		return err
	}

	namespaceParams := k8s.NamespaceParams{
		Name:       namespaceName(e, exercise.GetString("lab")),
		UserRecord: user,
	}

	if err = k8s.CreateNamespace(namespaceParams); err != nil {
		log.Println(err)
	}

	if _, err = k8s.GetPodByName(namespaceName(e, exercise.GetString("lab")), "vcluster-0"); err != nil {
		return logAndReturnErr(err)
	}

	secret, err := k8s.GetSecretByName(namespaceName(e, exercise.GetString("lab")), "vc-vcluster")
	if err != nil {
		return logAndReturnErr(err)
	}

	bootstrapBody, err := fetchBodyFromURL(exercise.GetString("bootstrap"))
	if err != nil {
		return logAndReturnErr(err)
	}

	checkBody, err := fetchBodyFromURL(exercise.GetString("check"))
	if err != nil {
		return logAndReturnErr(err)
	}

	deploymentParams := k8s.DeploymentParams{
		Name:       "kubelab-agent-" + exercise.Id,
		Namespace:  helm.GetNamespaceName(exercise.GetString("lab"), e.Record.GetString("user")),
		Image:      env.Config.KubelabImage,
		Replicas:   1,
		Kubeconfig: string(secret.Data["config"]),
		Bootstrap:  string(bootstrapBody),
		Check:      string(checkBody),
		Host:       env.Config.AllowedHosts,
		UserRecord: user,
	}

	// create a new deployment
	_, err = k8s.CreateDeployment(deploymentParams)
	if err != nil {
		log.Println(err)
	}

	serviceParams := k8s.ServiceParams{
		Name:       "kubelab-agent-" + exercise.Id,
		Namespace:  helm.GetNamespaceName(exercise.GetString("lab"), e.Record.GetString("user")),
		Port:       8376,
		UserRecord: user,
	}

	// create a new service
	_, err = k8s.CreateService(serviceParams)
	if err != nil {
		log.Println(err)
	}

	ingressParams := k8s.IngressParams{
		Name:        "kubelab-agent-" + exercise.Id,
		Namespace:   helm.GetNamespaceName(exercise.GetString("lab"), e.Record.GetString("user")),
		ServiceName: "kubelab-agent-" + exercise.Id,
		Host:        env.Config.AllowedHosts,
		Path:        "kubelab-" + exercise.GetString("lab") + "-" + exercise.Id + "-" + e.Record.GetString("user"),
		UserRecord:  user,
	}

	// create a new ingress
	_, err = k8s.CreateIngress(ingressParams)
	if err != nil {
		log.Println(err)
	}

	// check if deployment is ready
	err = k8s.WaitForDeployment(helm.GetNamespaceName(exercise.GetString("lab"), e.Record.GetString("user")), "kubelab-agent-"+exercise.Id)
	if err != nil {
		log.Println(err)
	}

	// sleep for 5 seconds
	time.Sleep(5 * time.Second)
	return nil
}

func deleteExerciseResources(e *core.RecordUpdateEvent, app *pocketbase.PocketBase) error {
	exercise, err := app.Dao().FindRecordById("exercises", e.Record.GetString("exercise"))
	if err != nil {
		return logAndReturnErr(err)
	}

	deleteFuncs := []func(string, string) error{
		k8s.DeleteDeployment,
		k8s.DeleteService,
		k8s.DeleteIngress,
	}

	for _, fn := range deleteFuncs {
		if err = fn(namespaceName(e, exercise.GetString("lab")), "kubelab-agent-"+exercise.Id); err != nil {
			log.Println(err)
		}
	}

	return nil
}
