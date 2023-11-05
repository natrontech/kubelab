package env

import (
	"log"

	"github.com/caarlos0/env/v8"
)

type config struct {
	Local                  bool   `env:"LOCAL"`
	KubelabImage           string `env:"KUBELAB_AGENT_IMAGE" envDefault:"ghcr.io/natrontech/kubelab-agent:latest"`
	CodeServerImage        string `env:"CODE_SERVER_IMAGE" envDefault:"lscr.io/linuxserver/code-server:latest"`
	AllowedHosts           string `env:"ALLOWED_HOSTS" envDefault:"*"`
	ResourceName           string `env:"RESOURCE_NAME" envDefault:"kubelab"`
	IngressClass           string `env:"AGENT_INGRESS_CLASS" envDefault:"nginx"`
	PodsLimit              string `env:"PODS_LIMIT" envDefault:"70"`
	StorageLimit           string `env:"STORAGE_LIMIT" envDefault:"50Gi"`
	VClusterChartVersion   string `env:"VCLUSTER_CHART_VERSION" envDefault:"0.15.5"`
	VClusterValuesFilePath string `env:"VCLUSTER_VALUES_FILE_PATH" envDefault:"./vcluster-values.yaml"`
}

var Config config

func Init() {
	if err := env.Parse(&Config); err != nil {
		log.Printf("%+v\n", err)
	}

	if Config.Local {
		log.Println("Running in local mode")
	}
}
