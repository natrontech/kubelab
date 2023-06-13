package k8s

import (
	"strings"

	appsv1 "k8s.io/api/apps/v1"
	v1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

func CreateDeployment(namespace string, image string, replicas int32, kubeconfig string, bootstrap string, check string, host string) (*appsv1.Deployment, error) {

	// search in string kubeconfig for 'localhost' and replace it with 'vcluster'
	newKubeconfig := strings.Replace(kubeconfig, "localhost:8443", "vcluster:443", -1)

	configMap := &v1.ConfigMap{
		ObjectMeta: metav1.ObjectMeta{
			Name: "kubeconfig",
		},
		Data: map[string]string{
			"config": newKubeconfig,
		},
	}
	if _, err := Clientset.CoreV1().ConfigMaps(namespace).Create(Ctx, configMap, metav1.CreateOptions{}); err != nil {
		return nil, err
	}

	// create config maps for scripts
	scriptsConfigMap := &v1.ConfigMap{
		ObjectMeta: metav1.ObjectMeta{
			Name: "scripts",
		},
		Data: map[string]string{
			"check.sh":     check,
			"bootstrap.sh": bootstrap,
		},
	}

	if _, err := Clientset.CoreV1().ConfigMaps(namespace).Create(Ctx, scriptsConfigMap, metav1.CreateOptions{}); err != nil {
		return nil, err
	}

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
					InitContainers: []v1.Container{
						{
							Name:    "init-copy-chmod-chown",
							Image:   "busybox",
							Command: []string{"sh", "-c", "cp /config/config /config-writable/kubeconfig && chmod 0600 /config-writable/kubeconfig && chown 1001:1001 /config-writable/kubeconfig && cp /scripts/* /scripts-writable && chmod 0700 /scripts-writable/* && chown 1001:1001 /scripts-writable/*"},
							VolumeMounts: []v1.VolumeMount{
								{
									Name:      "kubeconfig",
									MountPath: "/config",
								},
								{
									Name:      "kubeconfig-writable",
									MountPath: "/config-writable",
								},
								{
									Name:      "scripts",
									MountPath: "/scripts",
								},
								{
									Name:      "scripts-writable",
									MountPath: "/scripts-writable",
								},
							},
						},
					},
					Containers: []v1.Container{
						{
							Name:  "kubelab-container",
							Image: image,
							Ports: []v1.ContainerPort{
								{
									ContainerPort: 8376,
								},
							},
							// --allowed-hostnames and --max-buffer-size-bytes
							Args: []string{"--allowed-hostnames", host},
							VolumeMounts: []v1.VolumeMount{
								{
									Name:      "kubeconfig-writable",
									MountPath: "/home/kubelab-agent/.kube/config",
									SubPath:   "kubeconfig",
									ReadOnly:  true,
								},
								{
									Name:      "scripts-writable",
									MountPath: "/home/kubelab-agent/.kubelab",
									ReadOnly:  true,
								},
							},
						},
					},
					Volumes: []v1.Volume{
						{
							Name: "kubeconfig",
							VolumeSource: v1.VolumeSource{
								ConfigMap: &v1.ConfigMapVolumeSource{
									LocalObjectReference: v1.LocalObjectReference{
										Name: "kubeconfig",
									},
								},
							},
						},
						{
							Name: "kubeconfig-writable",
							VolumeSource: v1.VolumeSource{
								EmptyDir: &v1.EmptyDirVolumeSource{},
							},
						},
						{
							Name: "scripts",
							VolumeSource: v1.VolumeSource{
								ConfigMap: &v1.ConfigMapVolumeSource{
									LocalObjectReference: v1.LocalObjectReference{
										Name: "scripts",
									},
								},
							},
						},
						{
							Name: "scripts-writable",
							VolumeSource: v1.VolumeSource{
								EmptyDir: &v1.EmptyDirVolumeSource{},
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
	// Delete the configmap first
	if err := Clientset.CoreV1().ConfigMaps(namespace).Delete(Ctx, "kubeconfig", metav1.DeleteOptions{}); err != nil {
		return err
	}

	if err := Clientset.CoreV1().ConfigMaps(namespace).Delete(Ctx, "scripts", metav1.DeleteOptions{}); err != nil {
		return err
	}

	return Clientset.AppsV1().Deployments(namespace).Delete(Ctx, name, metav1.DeleteOptions{})
}
