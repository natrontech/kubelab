export enum DeploymentStatus {
    Running = "Running",
    Pending = "Pending",
    Failed = "Failed",
    Unknown = "Unknown"
}

export interface Deployment {
    id: string;
    name: string;
    status: DeploymentStatus;
    namespace: string;
}

export interface NavRoute {
    id: string;
    name: string;
    href: string;
    icon: any;
}
