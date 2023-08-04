package env

import (
	"log"

	"github.com/caarlos0/env/v8"
)

type config struct {
	Local        bool   `env:"LOCAL"`
	KubelabImage string `env:"KUBELAB_AGENT_IMAGE"`
	AllowedHosts string `env:"ALLOWED_HOSTS"`
	ResourceName string `env:"RESOURCE_NAME"`
	IngressClass string `env:"AGENT_INGRESS_CLASS"`
	PodsLimit    string `env:"PODS_LIMIT"`
	StorageLimit string `env:"STORAGE_LIMIT"`
}

var Config config

func Init() {
	if err := env.Parse(&Config); err != nil {
		log.Printf("%+v\n", err)
	}

	if Config.Local {
		log.Println("Running in local mode")
	}

	if Config.KubelabImage == "" {
		Config.KubelabImage = "ghcr.io/natrontech/kubelab-agent:latest"
	}

	if Config.AllowedHosts == "" {
		Config.AllowedHosts = "*"
	}

	if Config.ResourceName == "" {
		Config.ResourceName = "kubelab"
	}

	if Config.IngressClass == "" {
		Config.IngressClass = "nginx"
	}

	if Config.PodsLimit == "" {
		Config.PodsLimit = "70"
	}

	if Config.StorageLimit == "" {
		Config.StorageLimit = "50Gi"
	}

}
