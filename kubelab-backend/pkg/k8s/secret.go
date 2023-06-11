package k8s

import (
	v1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

func GetSecretByName(namespace string, name string) (*v1.Secret, error) {
	if Clientset != nil {
		secret, err := Clientset.CoreV1().Secrets(namespace).Get(Ctx, name, metav1.GetOptions{})
		if err != nil {
			return nil, err
		}
		return secret, nil
	}
	return nil, nil
}
