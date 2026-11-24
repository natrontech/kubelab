package k8s

import (
	"github.com/natrontech/kubelab/pkg/util"
	"github.com/pocketbase/pocketbase/models"
	v1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

type ServiceParams struct {
	Namespace  string
	Name       string
	Port       int32
	UserRecord *models.Record
}

func CreateService(params ServiceParams) (*v1.Service, error) {
	service := &v1.Service{
		ObjectMeta: metav1.ObjectMeta{
			Name:      params.Name,
			Namespace: params.Namespace,
			Labels: map[string]string{
				"kubelab.ch":             params.Name,
				"kubelab.ch/userId":      params.UserRecord.GetString("id"),
				"kubelab.ch/username":    params.UserRecord.GetString("username"),
				"kubelab.ch/displayName": util.StringParser(params.UserRecord.GetString("name")),
			},
		},
		Spec: v1.ServiceSpec{
			Selector: map[string]string{
				"kubelab.ch": params.Name,
			},
			Ports: []v1.ServicePort{
				{
					Name: "main-port", // You can name this appropriately
					Port: params.Port,
				},
				{
					Name: "code-server-port", // Name for the code-server port
					Port: 8443,               // Assuming code-server runs on port 8080
				},
			},
			Type: v1.ServiceTypeClusterIP,
		},
	}

	return Clientset.CoreV1().Services(params.Namespace).Create(Ctx, service, metav1.CreateOptions{})
}

func DeleteService(namespace string, name string) error {
	return Clientset.CoreV1().Services(namespace).Delete(Ctx, name, metav1.DeleteOptions{})
}
