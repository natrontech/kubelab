package k8s

import (
	"github.com/natrontech/kubelab/pkg/env"
	"github.com/natrontech/kubelab/pkg/util"
	"github.com/pocketbase/pocketbase/models"
	networkingv1 "k8s.io/api/networking/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

type IngressParams struct {
	Namespace    string
	Name         string
	Host         string
	ServiceName  string
	Path         string
	UserRecord   *models.Record
	UseFirstRule bool
}

// create a ingress with a hostpath with the namespace name pointed to a service
func CreateIngress(params IngressParams) (*networkingv1.Ingress, error) {

	// Annotations common to both rules
	annotations := map[string]string{
		"nginx.ingress.kubernetes.io/affinity":                    "cookie",
		"nginx.ingress.kubernetes.io/proxy-connect-timeout":       "3600",
		"nginx.ingress.kubernetes.io/proxy-next-upstream-timeout": "3600",
		"nginx.ingress.kubernetes.io/proxy-read-timeout":          "3600",
		"nginx.ingress.kubernetes.io/proxy-send-timeout":          "3600",
		"nginx.ingress.kubernetes.io/session-cookie-expires":      "172800",
		"nginx.ingress.kubernetes.io/session-cookie-max-age":      "172800",
		"nginx.ingress.kubernetes.io/session-cookie-name":         "route",
		"nginx.ingress.kubernetes.io/websocket-services":          params.ServiceName,
		"nginx.org/websocket-services":                            params.ServiceName,
	}

	var rules []networkingv1.IngressRule
	if params.UseFirstRule {
		annotations["nginx.ingress.kubernetes.io/rewrite-target"] = "/$2"
		rules = append(rules, networkingv1.IngressRule{
			Host: params.Host,
			IngressRuleValue: networkingv1.IngressRuleValue{
				HTTP: &networkingv1.HTTPIngressRuleValue{
					Paths: []networkingv1.HTTPIngressPath{
						{
							Path:     "/" + params.Path + "(/|$)(.*)",
							PathType: func() *networkingv1.PathType { p := networkingv1.PathTypeImplementationSpecific; return &p }(),
							Backend: networkingv1.IngressBackend{
								Service: &networkingv1.IngressServiceBackend{
									Name: params.ServiceName,
									Port: networkingv1.ServiceBackendPort{
										Number: 8376,
									},
								},
							},
						},
					},
				},
			},
		})
	} else {
		rules = append(rules, networkingv1.IngressRule{
			Host: params.Path + "." + params.Host,
			IngressRuleValue: networkingv1.IngressRuleValue{
				HTTP: &networkingv1.HTTPIngressRuleValue{
					Paths: []networkingv1.HTTPIngressPath{
						{
							Path:     "/",
							PathType: func() *networkingv1.PathType { p := networkingv1.PathTypePrefix; return &p }(),
							Backend: networkingv1.IngressBackend{
								Service: &networkingv1.IngressServiceBackend{
									Name: params.ServiceName,
									Port: networkingv1.ServiceBackendPort{
										Number: 8443,
									},
								},
							},
						},
					},
				},
			},
		})
	}

	ingress := &networkingv1.Ingress{
		ObjectMeta: metav1.ObjectMeta{
			Name: params.Name + (func() string {
				if params.UseFirstRule {
					return "-first-rule"
				} else {
					return "-second-rule"
				}
			})(),
			Namespace:   params.Namespace,
			Annotations: annotations,
			Labels: map[string]string{
				"kubelab.ch":             params.Name,
				"kubelab.ch/userId":      params.UserRecord.GetString("id"),
				"kubelab.ch/username":    params.UserRecord.GetString("username"),
				"kubelab.ch/displayName": util.StringParser(params.UserRecord.GetString("name")),
			},
		},
		Spec: networkingv1.IngressSpec{
			IngressClassName: func() *string { s := env.Config.IngressClass; return &s }(),
			TLS: []networkingv1.IngressTLS{
				{
					SecretName: env.Config.TlsSecretName,
				},
			},
			Rules: rules,
		},
	}

	return Clientset.NetworkingV1().Ingresses(params.Namespace).Create(Ctx, ingress, metav1.CreateOptions{})
}

func DeleteIngress(namespace string, name string) error {
	// Delete the ingress for the first rule
	err := Clientset.NetworkingV1().Ingresses(namespace).Delete(Ctx, name+"-first-rule", metav1.DeleteOptions{})
	if err != nil {
		return err
	}

	// Delete the ingress for the second rule
	err = Clientset.NetworkingV1().Ingresses(namespace).Delete(Ctx, name+"-second-rule", metav1.DeleteOptions{})
	if err != nil {
		return err
	}

	return nil
}
