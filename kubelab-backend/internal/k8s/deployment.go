package k8s

import (
	appsv1 "k8s.io/api/apps/v1"
	v1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

func CreateDeployment(namespace string, image string, replicas int32) (*appsv1.Deployment, error) {
	deployment := &appsv1.Deployment{
		ObjectMeta: metav1.ObjectMeta{
			Name:      "kubelab-agent",
			Namespace: namespace,
		},
		Spec: appsv1.DeploymentSpec{
			Replicas: &replicas,
			Selector: &metav1.LabelSelector{
				MatchLabels: map[string]string{
					"kubelab.natron.io": "kubelab",
				},
			},
			Template: v1.PodTemplateSpec{
				ObjectMeta: metav1.ObjectMeta{
					Labels: map[string]string{
						"kubelab.natron.io": "kubelab",
					},
				},
				Spec: v1.PodSpec{
					Containers: []v1.Container{
						{
							Name:  "kubelab-container",
							Image: image,
							Ports: []v1.ContainerPort{
								{
									ContainerPort: 8376,
								},
							},
						},
					},
				},
			},
		},
	}

	return Clientset.AppsV1().Deployments(namespace).Create(Ctx, deployment, metav1.CreateOptions{})
}

func DeleteDeployment(namespace string, name string) error {
	return Clientset.AppsV1().Deployments(namespace).Delete(Ctx, name, metav1.DeleteOptions{})
}
