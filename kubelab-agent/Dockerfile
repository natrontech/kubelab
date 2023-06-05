FROM golang:1.20-alpine AS backend
WORKDIR /go/src/kubelab-agent
COPY ./cmd ./cmd
COPY ./internal ./internal
COPY ./pkg ./pkg
COPY ./go.mod .
COPY ./go.sum .
ENV CGO_ENABLED=0
RUN go mod vendor
ARG VERSION_INFO=dev-build
RUN go build -a -v \
  -ldflags " \
  -s -w \
  -extldflags 'static' \
  -X main.VersionInfo='${VERSION_INFO}' \
  " \
  -o ./bin/kubelab-agent \
  ./cmd/kubelab-agent

FROM ubuntu:22.04
WORKDIR /app
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

COPY --from=backend /go/src/kubelab-agent/bin/kubelab-agent /app/kubelab-agent
RUN ln -s /app/kubelab-agent /usr/bin/kubelab-agent
RUN groupadd -g 1001 kubelab-agent
RUN useradd -s /bin/bash -u 1001 -g 1001 -m kubelab-agent
RUN mkdir -p /home/kubelab-agent
RUN chown kubelab-agent:kubelab-agent /app -R
WORKDIR /
ENV WORKDIR=/app
USER kubelab-agent
ENTRYPOINT ["/app/kubelab-agent"]
