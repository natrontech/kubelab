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
			Annotations: map[string]string{
				"cert-manager.io/cluster-issuer":                 "letsencrypt-prod-natron-cloud",
				"cert-manager.io/private-key-rotation-policy":    "Always",
				"nginx.ingress.kubernetes.io/proxy-read-timeout": "3600",
				"nginx.ingress.kubernetes.io/proxy-send-timeout": "3600",
				"nginx.ingress.kubernetes.io/rewrite-target":     "/$2",
			},
		},
		Spec: networkingv1.IngressSpec{
			IngressClassName: func() *string { s := "nginx"; return &s }(),
			TLS: []networkingv1.IngressTLS{
				{
					Hosts:      []string{host},
					SecretName: func() string { s := host + "-tls"; return s }(),
				},
			},
			Rules: []networkingv1.IngressRule{
				{
					Host: host,
					IngressRuleValue: networkingv1.IngressRuleValue{
						HTTP: &networkingv1.HTTPIngressRuleValue{
							Paths: []networkingv1.HTTPIngressPath{
								{
									Path:     "/" + namespace + "(/|$)(.*)",
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
