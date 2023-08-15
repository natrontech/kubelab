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

	if err = k8s.CreateNamespace(namespaceName(e, exercise.GetString("lab"))); err != nil {
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
