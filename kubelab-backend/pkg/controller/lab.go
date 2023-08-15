package controller

import (
	"log"
	"os"
	"time"

	"github.com/natrontech/kubelab/pkg/env"
	"github.com/natrontech/kubelab/pkg/helm"
	"github.com/natrontech/kubelab/pkg/k8s"
	"github.com/natrontech/kubelab/pkg/util"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)

func deployVCluster(e *core.RecordUpdateEvent, app *pocketbase.PocketBase) error {
	helmclient, err := helm.CreateHelmClient(e.Record.GetString("lab"), e.Record.GetString("user"))
	if err != nil {
		return logAndReturnErr(err)
	}

	user, err := app.Dao().FindRecordById("users", e.Record.GetString("user"))
	if err != nil {
		return err
	}

	if err = helm.AddHelmRepositoryToClient(helmclient, "loft-sh", "https://charts.loft.sh"); err != nil {
		return logAndReturnErr(err)
	}

	yamlValues, err := os.ReadFile(env.Config.VClusterValuesFilePath)
	if err != nil {
		return logAndReturnErr(err)
	}

	labels := map[string]string{
		"kubelab.ch":             e.Record.GetString("lab"),
		"kubelab.ch/userId":      e.Record.GetString("user"),
		"kubelab.ch/username":    user.GetString("username"),
		"kubelab.ch/displayName": util.StringParser(user.GetString("name")),
	}

	// add string at the end of yamlValues
	yamlValues = append(yamlValues, []byte("\nlabels:\n")...)
	for k, v := range labels {
		yamlValues = append(yamlValues, []byte("  "+k+": "+v+"\n")...)
	}

	// add string at the end of yamlValues
	yamlValues = append(yamlValues, []byte("\npodLabels:\n")...)
	for k, v := range labels {
		yamlValues = append(yamlValues, []byte("  "+k+": "+v+"\n")...)
	}

	// add string at the end of yamlValues
	yamlValues = append(yamlValues, []byte("\ncoredns:\n  podLabels:\n")...)
	for k, v := range labels {
		yamlValues = append(yamlValues, []byte("    "+k+": "+v+"\n")...)
	}

	if _, err = helm.CreateOrUpdateHelmRelease(
		helmclient,
		"loft-sh/vcluster",
		"vcluster",
		namespaceName(e, e.Record.GetString("lab")),
		env.Config.VClusterChartVersion,
		string(yamlValues),
	); err != nil {
		return logAndReturnErr(err)
	}

	if err = k8s.CreateResourceQuota(namespaceName(e, e.Record.GetString("lab")), env.Config.ResourceName, env.Config.PodsLimit, env.Config.StorageLimit); err != nil {
		return logAndReturnErr(err)
	}

	time.Sleep(15 * time.Second)
	return nil
}

func deleteClusterResources(e *core.RecordUpdateEvent, app *pocketbase.PocketBase) error {
	if err := k8s.DeleteNamespace(namespaceName(e, e.Record.GetString("lab"))); err != nil {
		log.Println(err)
	}
	time.Sleep(15 * time.Second)
	return nil
}
