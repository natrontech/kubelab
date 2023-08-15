package controller

import (
	"log"
	"os"
	"time"

	"github.com/natrontech/kubelab/pkg/env"
	"github.com/natrontech/kubelab/pkg/helm"
	"github.com/natrontech/kubelab/pkg/k8s"
	"github.com/pocketbase/pocketbase/core"
)

func deployVCluster(e *core.RecordUpdateEvent) error {
	helmclient, err := helm.CreateHelmClient(e.Record.GetString("lab"), e.Record.GetString("user"))
	if err != nil {
		return logAndReturnErr(err)
	}

	if err = helm.AddHelmRepositoryToClient(helmclient, "loft-sh", "https://charts.loft.sh"); err != nil {
		return logAndReturnErr(err)
	}

	yamlValues, err := os.ReadFile(env.Config.VClusterValuesFilePath)
	if err != nil {
		return logAndReturnErr(err)
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

func deleteClusterResources(e *core.RecordUpdateEvent) error {
	if err := k8s.DeleteNamespace(namespaceName(e, e.Record.GetString("lab"))); err != nil {
		log.Println(err)
	}
	time.Sleep(15 * time.Second)
	return nil
}
