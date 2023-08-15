package helm

import (
	"context"
	"strings"
	"time"

	helmclient "github.com/mittwald/go-helm-client"
	"github.com/natrontech/kubelab/pkg/util"
	"helm.sh/helm/v3/pkg/release"
	"helm.sh/helm/v3/pkg/repo"
)

const Prefix = "kubelab"

func GetNamespaceName(labName, username string) string {
	return Prefix + "-" + util.StringParser(labName) + "-" + util.StringParser(username)
}

func CreateHelmClient(labName, username string) (helmclient.Client, error) {
	opt := &helmclient.Options{
		Namespace: GetNamespaceName(labName, username),
		Debug:     true,
		Linting:   true,
		DebugLog:  func(format string, v ...interface{}) {},
	}

	return helmclient.New(opt)
}

func AddHelmRepositoryToClient(helmClient helmclient.Client, repositoryName, repositoryURL string) error {
	chartRepo := repo.Entry{
		Name: strings.ToLower(repositoryName),
		URL:  repositoryURL,
	}

	return helmClient.AddOrUpdateChartRepo(chartRepo)
}

func CreateOrUpdateHelmRelease(helmClient helmclient.Client, chartName, releaseName, namespace, version, valuesYaml string) (rel *release.Release, err error) {
	chartSpec := helmclient.ChartSpec{
		ChartName:       strings.ToLower(chartName),
		ReleaseName:     strings.ToLower(releaseName),
		Namespace:       namespace,
		CreateNamespace: true,
		Timeout:         32 * time.Second,
		Version:         version,
		ValuesYaml:      valuesYaml,
	}

	rel, err = helmClient.InstallOrUpgradeChart(context.Background(), &chartSpec, nil)
	return
}

func GetHelmRelease(helmClient helmclient.Client, releaseName string) (*release.Release, error) {
	return helmClient.GetRelease(releaseName)
}
