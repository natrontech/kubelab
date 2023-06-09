package k8s

import (
	v1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

func GetPodByName(namespace string, name string) (*v1.Pod, error) {
	if Clientset != nil {
		pod, err := Clientset.CoreV1().Pods(namespace).Get(Ctx, name, metav1.GetOptions{})
		if err != nil {
			return nil, err
		}
		return pod, nil
	}
	return nil, nil
}
