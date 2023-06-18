package k8s

import (
	v1 "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/api/resource"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

func CreateResourceQuota(namespace string, name string, pods string, storage string) error {
	resourceQuota := &v1.ResourceQuota{
		ObjectMeta: metav1.ObjectMeta{
			Name:      name,
			Namespace: namespace,
		},
		Spec: v1.ResourceQuotaSpec{
			Hard: v1.ResourceList{
				v1.ResourcePods:            resource.MustParse(pods),
				v1.ResourceRequestsStorage: resource.MustParse(storage),
			},
		},
	}

	_, err := Clientset.CoreV1().ResourceQuotas(namespace).Create(Ctx, resourceQuota, metav1.CreateOptions{})
	return err
}
