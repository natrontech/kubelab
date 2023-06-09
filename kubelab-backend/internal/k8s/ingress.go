package k8s

import (
	networkingv1 "k8s.io/api/networking/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

// create a ingress with a hostpath with the namespace name pointed to a service
func CreateIngress(namespace string, name string, host string, serviceName string) (*networkingv1.Ingress, error) {

	ingress := &networkingv1.Ingress{
		ObjectMeta: metav1.ObjectMeta{
			Name:      name,
			Namespace: namespace,
		},
		Spec: networkingv1.IngressSpec{
			Rules: []networkingv1.IngressRule{
				{
					Host: host,
					IngressRuleValue: networkingv1.IngressRuleValue{
						HTTP: &networkingv1.HTTPIngressRuleValue{
							Paths: []networkingv1.HTTPIngressPath{
								{
									Path:     "/" + namespace,
									PathType: func() *networkingv1.PathType { p := networkingv1.PathTypePrefix; return &p }(),
									Backend: networkingv1.IngressBackend{
										Service: &networkingv1.IngressServiceBackend{
											Name: serviceName,
											Port: networkingv1.ServiceBackendPort{
												Number: 8376,
											},
										},
									},
								},
							},
						},
					},
				},
			},
		},
	}

	return Clientset.NetworkingV1().Ingresses(namespace).Create(Ctx, ingress, metav1.CreateOptions{})

}

func DeleteIngress(namespace string, name string) error {
	return Clientset.NetworkingV1().Ingresses(namespace).Delete(Ctx, name, metav1.DeleteOptions{})
}
