package k8s

import (
	"strconv"
	"strings"

	"github.com/natrontech/kubelab/pkg/util"
	"github.com/pocketbase/pocketbase/models"
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

type NamespaceParams struct {
	Name       string
	UserRecord *models.Record
}

func CreateNamespace(params NamespaceParams) error {
	ns := &v1.Namespace{
		ObjectMeta: metav1.ObjectMeta{
			Name: params.Name,
			Labels: map[string]string{
				"kubelab.ch":             params.Name,
				"kubelab.ch/userId":      params.UserRecord.GetString("id"),
				"kubelab.ch/username":    params.UserRecord.GetString("username"),
				"kubelab.ch/displayName": util.StringParser(params.UserRecord.GetString("name")),
			},
		},
	}
	_, err := Clientset.CoreV1().Namespaces().Create(Ctx, ns, metav1.CreateOptions{})

	// if err already exists, update
	if err != nil && strings.Contains(err.Error(), "already exists") {
		_, err = Clientset.CoreV1().Namespaces().Update(Ctx, ns, metav1.UpdateOptions{})
	}

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
