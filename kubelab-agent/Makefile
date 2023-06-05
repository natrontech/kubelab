changes ?= $(shell git status --porcelain --untracked-files=no | wc -l)
version ?= $(shell git rev-parse HEAD | head -c 8)
ifeq ($(shell test $(changes) -gt 0; echo $$?),0)
version := $(version)-dev
endif
export_path ?= ./images

# use this to override/set settings
-include Makefile.properties

# image_namespace specifies THIS_PART/namespace/image:tag of the Docker image path
image_registry ?= docker.io
# image_namespace specifies docker.io/THIS_PART/image:tag of the Docker image path
image_namespace ?= zephinzer
# image_name specifies docker.io/namespace/THIS_PART:tag of the Docker image path
image_name ?= kubelab-agent
# image_name specifies docker.io/namespace/image:THIS_PART of the Docker image path
image_tag ?= $(version)

image_url := $(image_registry)/$(image_namespace)/$(image_name)

binary_name := $(image_name)-${GOOS}-${GOARCH}${BIN_EXT}

# initialises the project (run this before all else)
init:
	go mod vendor

# start the application (use this in development)
start:
	go run ./cmd/kubelab-agent

# runs the application in packaged form
run: package
	docker run -it -p 8376:8376 $(image_url):latest

# builds the application binary
build:
	CGO_ENABLED=0 \
	go build -a -v \
		-ldflags " \
			-s -w \
			-extldflags 'static' \
			-X main.VersionInfo='$(version)' \
		" \
		-o ./bin/$(binary_name) ./cmd/kubelab-agent

# compresses the application binary
compress:
	ls -lah ./bin/$(binary_name)
	upx -9 -v -o ./bin/.$(binary_name) \
		./bin/$(binary_name)
	upx -t ./bin/.$(binary_name)
	rm -rf ./bin/$(binary_name)
	mv ./bin/.$(binary_name) \
		./bin/$(binary_name)
	sha256sum -b ./bin/$(binary_name) \
		| cut -f 1 -d ' ' > ./bin/$(binary_name).sha256
	ls -lah ./bin/$(binary_name)

# lints this image for best-practices
lint:
	hadolint ./Dockerfile

# tests this iamge for structure integrity
test: package
	container-structure-test test --config ./.Dockerfile.yaml --image $(image_url):latest

# scans this image for known vulnerabilities
scan: package
	trivy image \
		--output trivy.json \
		--format json \
		$(image_url):$(version)
	trivy image $(image_url):$(version)

# packages project into a docker image
package:
	docker build ${build_args} \
		--build-arg VERSION_INFO=$(version) \
		--tag $(image_url):latest \
		.
	docker tag $(image_url):latest \
		$(image_url):$(version)

# packages example project in this project into a docker image using the docker build cache
package-example: package
	if [ "${id}" = "" ]; then \
		printf -- '\033[1m\033[31m$${id} was not specified\033[0m\n'; \
		exit 1; \
	fi
	docker build \
		--build-arg IMAGE_NAMESPACE=$(image_registry)/$(image_namespace) \
		--build-arg IMAGE_NAME=$(image_name) \
		--build-arg IMAGE_TAG=$(version) \
		--tag $(image_url)-${id}:latest \
		--file ./examples/${id}/Dockerfile \
		.
	docker tag $(image_url)-${id}:latest \
		$(image_url)-${id}:$(version)

# publishes primary docker image of this project
publish:
	@$(MAKE) package
	@$(MAKE) publish-ci

# publishes primary docker image of this project without running package
publish-ci:
	-docker push $(image_url):latest
	docker push $(image_url):$(version)

# publishes example docker image of this project
publish-example:
	@$(MAKE) package-example id=${id}
	@$(MAKE) publish-example-ci id=${id}

# publishes example docker image of this project without running package
publish-example-ci:
	-docker push $(image_url)-${id}:latest
	docker push $(image_url)-${id}:$(version)

# exports this image into a tarball (use in ci cache)
export: package
	mkdir -p $(export_path)
	docker save $(image_namespace)/$(image_name):latest -o $(export_path)/$(image_namespace)-$(image_name).tar.gz

# exports the example image into a tarball (use in ci cache)
export-example: package-example
	mkdir -p $(export_path)
	docker save $(image_namespace)/$(image_name)-${id}:latest -o $(export_path)/$(image_namespace)-$(image_name)-${id}.tar.gz

# import this image from a tarball (use in ci cache)
import:
	mkdir -p $(export_path)
	-docker load -i $(export_path)/$(image_namespace)-$(image_name).tar.gz

# import the example image into a tarball (use in ci cache)
import-example:
	mkdir -p $(export_path)
	-docker load -i $(export_path)/$(image_namespace)-$(image_name)-${id}.tar.gz

.ssh:
	mkdir -p ./.ssh
	ssh-keygen -t rsa -b 8192 -f ./.ssh/id_rsa -q -N ""
	cat ./.ssh/id_rsa | base64 -w 0 > ./.ssh/id_rsa.base64
