package k8s

import (
	"context"
	"flag"
	"path/filepath"

	"github.com/natrontech/kubelab/pkg/env"
	"k8s.io/client-go/discovery"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/clientcmd"
	"k8s.io/client-go/util/homedir"
)

var (
	Clientset       *kubernetes.Clientset
	Kubeconfig      *rest.Config
	DiscoveryClient *discovery.DiscoveryClient
	Ctx             context.Context
)

func Init() {
	var err error
	if env.Config.Local {
		var kubeconfig *string
		if home := homedir.HomeDir(); home != "" {
			kubeconfig = flag.String("kubeconfig", filepath.Join(home, ".kube", "config"), "(optional) absolute path to the kubeconfig file")
		} else {
			kubeconfig = flag.String("kubeconfig", "", "absolute path to the kubeconfig file")
		}
		flag.Parse()

		Kubeconfig, err = clientcmd.BuildConfigFromFlags("", *kubeconfig)
		if err != nil {
			panic(err)
		}

		DiscoveryClient, err = discovery.NewDiscoveryClientForConfig(Kubeconfig)
		if err != nil {
			panic(err)
		}

		Clientset, err = kubernetes.NewForConfig(Kubeconfig)
		if err != nil {
			panic(err)
		}

		Ctx = context.Background()
	} else {
		Kubeconfig, err = rest.InClusterConfig()
		if err != nil {
			panic(err.Error())
		}

		DiscoveryClient, err = discovery.NewDiscoveryClientForConfig(Kubeconfig)
		if err != nil {
			panic(err)
		}

		Clientset, err = kubernetes.NewForConfig(Kubeconfig)
		if err != nil {
			panic(err)
		}

		Ctx = context.Background()
	}
}

func GetClusterVersion() (string, error) {
	if DiscoveryClient != nil {
		clusterVersion, err := DiscoveryClient.ServerVersion()
		if err != nil {
			return "", err
		}
		return clusterVersion.GitVersion, nil
	}

	return "unknown", nil
}

func GetClusterApi() (string, error) {
	var clusterName string

	if Kubeconfig != nil {
		clusterName = Kubeconfig.Host
	} else {
		clusterName = "unknown"
	}

	return clusterName, nil
}
