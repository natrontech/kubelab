# Build stage
FROM golang:1.19 as build
WORKDIR /go/src/github.com/natrongmbh/kubelab-agent
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o kubelab-agent .

# Production build
FROM ubuntu:22.04

WORKDIR /app

# Adding group and user
RUN groupadd -g 1001 kubelab-agent
RUN useradd -s /bin/bash -u 1001 -g 1001 -m kubelab-agent

# Adding base utilities
RUN apt-get update && apt-get install -y --no-install-recommends \
        ca-certificates \
        bash \
        wget \
        curl \
        openssl \
        jq \
        vim \
        nano \
        dnsutils \
        openssh-client \
        build-essential \
        libffi-dev \
        libssl-dev \
        podman \
    && rm -rf /var/lib/apt/lists/*

# Installing kubectl
RUN curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl" && \
    chmod +x ./kubectl && \
    mv ./kubectl /usr/local/bin/kubectl

# Installing helm
RUN curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 && \
    chmod +x ./get_helm.sh && \
    ./get_helm.sh && \
    rm ./get_helm.sh

# Installing kustomize
RUN curl -s "https://raw.githubusercontent.com/kubernetes-sigs/kustomize/master/hack/install_kustomize.sh"  | bash && \
    mv ./kustomize /usr/local/bin/kustomize

# Installing cri-o
RUN curl https://raw.githubusercontent.com/cri-o/cri-o/main/scripts/get | bash

# Podman and CRI-O are not officially available for Ubuntu, it may be necessary to build them from source or use another base image if you need to use them.

COPY --from=build --chown=kubelab-agent:kubelab-agent /go/src/github.com/natrongmbh/kubelab-agent/kubelab-agent ./

EXPOSE 8090

CMD ["./kubelab-agent"]
