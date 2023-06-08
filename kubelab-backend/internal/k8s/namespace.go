package k8s

import (
	"strconv"
	"strings"

	v1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

func GetTotalNamespaces() (string, error) {

	if Clientset != nil {
		namespaces, err := Clientset.CoreV1().Namespaces().List(Ctx, metav1.ListOptions{})
		if err != nil {
			return "", err
		}
		totalNamespaces := len(namespaces.Items)
		return strconv.Itoa(totalNamespaces), nil
	}

	return "unknown", nil
}

func CreateNamespace(namespace string) error {
	ns := &v1.Namespace{
		ObjectMeta: metav1.ObjectMeta{
			Name: namespace,
			Labels: map[string]string{
				"kubelab.natron.io/created-by": "kubelab",
			},
		},
	}
	_, err := Clientset.CoreV1().Namespaces().Create(Ctx, ns, metav1.CreateOptions{})
	return err
}

func DeleteNamespace(namespace string) error {
	return Clientset.CoreV1().Namespaces().Delete(Ctx, namespace, metav1.DeleteOptions{})
}

func GetTotalNamespacesByPrefix(prefix string) (int, error) {

	if Clientset != nil {
		namespaces, err := Clientset.CoreV1().Namespaces().List(Ctx, metav1.ListOptions{})
		if err != nil {
			return 0, err
		}

		var totalNamespaces int
		// check if prefix of namespace is prefix
		for _, namespace := range namespaces.Items {
			// get name of namespace
			name := namespace.GetName()
			// check if namespace contains prefix
			if strings.Contains(name, prefix) {
				totalNamespaces++
			}
		}
		return totalNamespaces, nil
	}

	return 0, nil
}
