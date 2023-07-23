# KubeLab: The Ultimate Kubernetes Learning Platform 

<p align="center">
    <a href="https://kubelab.natron.io">
        <img height="130px" src="assets/kubelab-logo.png" />
    </a>
</p>

<p align="center">
  <strong>
    <a href="https://kubelab.natron.io/">KubeLab</a>
    <br />
    Embark on your Kubernetes Journey through Hands-on Practice
  </strong>
</p>

<p align="center">
  <a href="https://github.com/natrontech/kubelab/issues"><img
    src="https://img.shields.io/github/issues/natrontech/kubelab"
    alt="Build"
  /></a>
  <a href="https://github.com/natrontech/kubelab"><img
    src="https://img.shields.io/github/license/natrontech/kubelab"
    alt="License"
  /></a>
  <img alt="GitHub go.mod Go version" src="https://img.shields.io/github/go-mod/go-version/natrontech/kubelab/main/kubelab-backend?label=Go%20Version" />
  <img alt="GitHub Workflow Status" src="https://img.shields.io/github/actions/workflow/status/natrontech/kubelab/ci.yml?label=CI" />
  <img alt="GitHub Workflow Status" src="https://img.shields.io/github/actions/workflow/status/natrontech/kubelab/codeql.yml?label=CodeQL" />
  <img alt="GitHub Workflow Status" src="https://img.shields.io/github/actions/workflow/status/natrontech/kubelab/docker-release.yml?label=Docker%20Release" />
</p>

<h2></h2>

Welcome to KubeLab! Our advanced web-based platform offers a rich set of interactive labs, specifically crafted for Kubernetes workshops. We aim to revolutionize your learning experience by making it more interactive, engaging, and practical. Our labs will help you grasp and apply complex Kubernetes concepts in a real-world context.

KubeLab is a proud offering by [Natron Tech](https://natron.io), and if you're interested in a tailor-made Kubernetes workshop for your company, do not hesitate to reach out to us!

KubeLab is built using:
- [kubelab-agent](https://github.com/natrontech/kubelab-agent)
- [xterm.js](https://xtermjs.org/)
- [pocketbase](https://pocketbase.io)

<p align="center">
	<img height="400px" src="assets/screenshots/terminal.png" />
</p>

**Please note:** This project is still in its early stages, and we're diligently working to enhance your experience. However, bugs might appear, and your patience and feedback will be greatly appreciated.

---

## Features

### Web Terminal
KubeLab features a smooth in-browser terminal, letting you execute commands and interact with your Kubernetes cluster in real-time, without needing any additional setup or software.

### Dedicated Cluster Per Session
Every learning session on KubeLab has its own isolated Kubernetes cluster. This design ensures a secure and dedicated learning environment, enabling you to experiment with Kubernetes without impacting others.

### Custom Kubernetes Labs
With KubeLab, you can define your own labs and exercises. Check out our workshops [here](https://github.com/natrontech/kubelab-workshops).

## Getting Started
To get started, ensure that you have a Kubernetes cluster (v1.23+). More information on installation and documentation will be provided soon.

---

## Development
Interested in contributing to KubeLab? Please make sure you have the following prerequisites:
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/en/download/) (v20+)
- [Go](https://golang.org/doc/install) (v1.20+)
- [modd](https://github.com/cortesi/modd/releases)

Please refer to our detailed development guides for the [backend](./kubelab-backend/README.md) and [frontend](./kubelab-ui/README.md) to get started. For contributing, please read our [CONTRIBUTING.md](CONTRIBUTING.md) for information on code conduct and the process for submitting pull requests.

---

Begin your Kubernetes journey with KubeLab today!
