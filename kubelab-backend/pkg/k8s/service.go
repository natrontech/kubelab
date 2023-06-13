package k8s

import (
	v1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

func CreateService(namespace string, name string, port int32) (*v1.Service, error) {
	service := &v1.Service{
		ObjectMeta: metav1.ObjectMeta{
			Name:      name,
			Namespace: namespace,
		},
		Spec: v1.ServiceSpec{
			Selector: map[string]string{
				"kubelab.natron.io": name,
			},
			Ports: []v1.ServicePort{
				{
					Port: port,
				},
			},
			Type: v1.ServiceTypeClusterIP,
		},
	}

	return Clientset.CoreV1().Services(namespace).Create(Ctx, service, metav1.CreateOptions{})
}

func DeleteService(namespace string, name string) error {
	return Clientset.CoreV1().Services(namespace).Delete(Ctx, name, metav1.DeleteOptions{})
}
