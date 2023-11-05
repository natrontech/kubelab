package k8s

import (
	"log"
	"strings"
	"time"

	"github.com/natrontech/kubelab/pkg/env"
	"github.com/natrontech/kubelab/pkg/util"
	"github.com/pocketbase/pocketbase/models"
	appsv1 "k8s.io/api/apps/v1"
	v1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/utils/pointer"
)

type DeploymentParams struct {
	Name       string
	Namespace  string
	Image      string
	Replicas   int32
	Kubeconfig string
	Bootstrap  string
	Check      string
	Host       string
	UserRecord *models.Record
}

func CreateDeployment(params DeploymentParams) (*appsv1.Deployment, error) {
	params.Kubeconfig = strings.Replace(params.Kubeconfig, "localhost:8443", "vcluster:443", -1)

	createConfigMap(params.Namespace, "kubeconfig", map[string]string{"config": params.Kubeconfig})
	createConfigMap(params.Namespace, "scripts-"+params.Name, map[string]string{
		"check.sh":     params.Check,
		"bootstrap.sh": params.Bootstrap,
	})

	deployment := constructDeployment(params.Name, params.Namespace, params.Image, params.Replicas, params.Host, params.UserRecord)
	deployed, err := Clientset.AppsV1().Deployments(params.Namespace).Create(Ctx, deployment, metav1.CreateOptions{})
	if err != nil {
		log.Println(err)
	}
	return deployed, nil
}

func createConfigMap(namespace, name string, data map[string]string) {
	configMap := &v1.ConfigMap{
		ObjectMeta: metav1.ObjectMeta{Name: name},
		Data:       data,
	}
	if _, err := Clientset.CoreV1().ConfigMaps(namespace).Create(Ctx, configMap, metav1.CreateOptions{}); err != nil {
		log.Println(err)
	}
}

func constructDeployment(name, namespace, image string, replicas int32, host string, userRecord *models.Record) *appsv1.Deployment {
	scriptVolumeName := "scripts-" + name
	return &appsv1.Deployment{
		ObjectMeta: metav1.ObjectMeta{
			Name:      name,
			Namespace: namespace,
		},
		Spec: appsv1.DeploymentSpec{
			Replicas: &replicas,
			Selector: &metav1.LabelSelector{
				MatchLabels: map[string]string{
					"kubelab.ch":             name,
					"kubelab.ch/userId":      userRecord.GetString("id"),
					"kubelab.ch/username":    userRecord.GetString("username"),
					"kubelab.ch/displayName": util.StringParser(userRecord.GetString("name")),
				},
			},
			Template: v1.PodTemplateSpec{
				ObjectMeta: metav1.ObjectMeta{
					Labels: map[string]string{
						"kubelab.ch":                  name,
						"kubelab.ch/userId":           userRecord.GetString("id"),
						"kubelab.ch/username":         userRecord.GetString("username"),
						"kubelab.ch/displayName":      util.StringParser(userRecord.GetString("name")),
						"vcluster.loft.sh/managed-by": "vcluster",
					},
				},
				Spec: v1.PodSpec{
					InitContainers: []v1.Container{
						{
							Name:    "init-copy-chmod-chown",
							Image:   "busybox",
							Command: []string{"sh", "-c", "cp /config/config /config-writable/kubeconfig && chmod 0600 /config-writable/kubeconfig && chown 1001:1001 /config-writable/kubeconfig && cp /scripts-source/* /scripts-writable && chmod 0700 /scripts-writable/* && chown 1001:1001 /scripts-writable/*"},
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
									Name:      scriptVolumeName,  // The name of the ConfigMap volume
									MountPath: "/scripts-source", // Source directory for the scripts
								},
								{
									Name:      scriptVolumeName + "-writable", // The writable directory
									MountPath: "/scripts-writable",
								},
							},
						},
						{
							Name:    "init-kubelab-agent-home",
							Image:   image, // using the same image as kubelab-container
							Command: []string{"sh", "-c", "mkdir -p /shared-kubelab-agent-home && cp -r /home/kubelab-agent/. /shared-kubelab-agent-home/"},
							SecurityContext: &v1.SecurityContext{
								RunAsUser:  pointer.Int64(1001),
								RunAsGroup: pointer.Int64(1001),
							},
							VolumeMounts: []v1.VolumeMount{
								{
									Name:      "kubelab-agent-home",
									MountPath: "/shared-kubelab-agent-home",
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
							// --allowed-hostnames
							Args: []string{"--allowed-hostnames", "*," + host},
							VolumeMounts: []v1.VolumeMount{
								{
									Name:      "kubeconfig-writable",
									MountPath: "/home/kubelab-agent/.kube/config",
									SubPath:   "kubeconfig",
									ReadOnly:  true,
								},
								{
									Name:      scriptVolumeName + "-writable",
									MountPath: "/scripts",
									ReadOnly:  true,
								},
								{
									Name:      "kubelab-agent-home",
									MountPath: "/home/kubelab-agent",
								},
							},
						},
						{
							Name:  "code-server",
							Image: env.Config.CodeServerImage,
							Env: []v1.EnvVar{
								{
									Name:  "PUID",
									Value: "1001",
								},
								{
									Name:  "PGID",
									Value: "1001",
								},
								{
									Name:  "DEFAULT_WORKSPACE",
									Value: "/home/kubelab-agent",
								},
							},
							Ports: []v1.ContainerPort{
								{
									ContainerPort: 8443,
								},
							},
							VolumeMounts: []v1.VolumeMount{
								{
									Name:      "kubeconfig-writable",
									MountPath: "/home/kubelab-agent/.kube/config",
									SubPath:   "kubeconfig",
									ReadOnly:  true,
								},
								{
									Name:      scriptVolumeName + "-writable",
									MountPath: "/scripts",
									ReadOnly:  true,
								},
								{
									Name:      "kubelab-agent-home",
									MountPath: "/home/kubelab-agent",
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
							Name: scriptVolumeName,
							VolumeSource: v1.VolumeSource{
								ConfigMap: &v1.ConfigMapVolumeSource{
									LocalObjectReference: v1.LocalObjectReference{
										Name: scriptVolumeName,
									},
								},
							},
						},
						{
							Name: scriptVolumeName + "-writable",
							VolumeSource: v1.VolumeSource{
								EmptyDir: &v1.EmptyDirVolumeSource{},
							},
						},
						{
							Name: "kubelab-agent-home",
							VolumeSource: v1.VolumeSource{
								EmptyDir: &v1.EmptyDirVolumeSource{},
							},
						},
					},
				},
			},
		},
	}
}

func DeleteDeployment(namespace, name string) error {
	deleteConfigMap(namespace, "kubeconfig")
	deleteConfigMap(namespace, "scripts-"+name)

	return Clientset.AppsV1().Deployments(namespace).Delete(Ctx, name, metav1.DeleteOptions{})
}

func deleteConfigMap(namespace, name string) {
	if err := Clientset.CoreV1().ConfigMaps(namespace).Delete(Ctx, name, metav1.DeleteOptions{}); err != nil {
		log.Println(err)
	}
}

func WaitForDeployment(namespace, name string) error {
	for {
		deployment, err := Clientset.AppsV1().Deployments(namespace).Get(Ctx, name, metav1.GetOptions{})
		if err != nil {
			return err
		}
		if deployment.Status.ReadyReplicas == *deployment.Spec.Replicas {
			return nil
		}
		time.Sleep(1 * time.Second)
	}
}
