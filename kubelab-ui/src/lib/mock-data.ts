import { DeploymentStatus, type Deployment } from "./types";

export const mockDeployments: Deployment[] = [
    {
        id: "1",
        name: "nginx-deployment",
        status: DeploymentStatus.Running,
        namespace: "default"
    },
    {
        id: "2",
        name: "nginx-deployment",
        status: DeploymentStatus.Failed,
        namespace: "kube-system"
    },
    {
        id: "3",
        name: "nginx-deployment",
        status: DeploymentStatus.Pending,
        namespace: "kube-system"
    },
    {
        id: "4",
        name: "nginx-deployment",
        status: DeploymentStatus.Unknown,
        namespace: "kube-system"
    }
];

export const mockDeploymentData = {
    id: "1",
    name: "deployment1-test",
    base: {
        _values: {
            replicas: 3,
            image: {
                registry: "docker.io",
                repository: "bitnami/nginx",
                tag: "1.24.0-debian-11-r6"
            },
            ingress: {
                enabled: true
            }
        },
        _secrets: {},
        test: {
            values: {
                ingress: {
                    hostname: "test.example.com",
                    path: "/"
                }
            },
            _secrets: {}
        }
    }
};
