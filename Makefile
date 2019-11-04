###############################################################################
# Licensed Materials - Property of IBM Copyright IBM Corporation 2019. All Rights Reserved.
# U.S. Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
# Schedule Contract with IBM Corp.
#
# Contributors:
#  IBM Corporation - initial API and implementation
###############################################################################


# -include Configfile

GIT_REMOTE_URL = $(shell git config --get remote.origin.url)
GITHUB_USER ?= $(ARTIFACTORY_USER)
GITHUB_USER := $(shell echo $(GITHUB_USER) | sed 's/@/%40/g')
GITHUB_TOKEN ?= 

DOCKER_SCRATCH_REGISTRY ?= hyc-cloud-private-scratch-docker-local.artifactory.swg-devops.com
DOCKER_INTEGRATION_REGISTRY ?= hyc-cloud-private-integration-docker-local.artifactory.swg-devops.com

DOCKER_USER ?= $(ARTIFACTORY_USER)
DOCKER_PASS ?= $(ARTIFACTORY_TOKEN)

IMAGE_REPO ?= $(DOCKER_INTEGRATION_REGISTRY)/$(DOCKER_NAMESPACE)

DOCKER_IMAGE ?= mcm-kui-proxy

DOCKER_RUN_OPTS ?= -e NODE_ENV=development -e ICP_EXTERNAL_URL=$(ICP_EXTERNAL_URL) -e KUI_INGRESS_PATH="kui" -e AUTH_TOKEN=$(AUTH_TOKEN) -e DEBUG=* -e TEST_USER=$(TEST_USER) -e TEST_PASSWORD=$(TEST_PASSWORD) -d -v $(PWD)/testcerts:/etc/certs
DOCKER_BIND_PORT ?= 4020:4020

ARCH := $(shell uname -m)
OS ?= $(shell uname -r | cut -d '.' -f6)

# Default to scratch
PUSH_REPO ?= scratch
DOCKER_REGISTRY := $(DOCKER_SCRATCH_REGISTRY)
DOCKER_NAMESPACE := ibmcom

.PHONY: init\:
init::
	@mkdir -p variables
ifndef GITHUB_USER
	$(info GITHUB_USER not defined)
	exit -1
endif
	$(info Using GITHUB_USER=$(GITHUB_USER))
ifndef GITHUB_TOKEN
	$(info GITHUB_TOKEN not defined)
	exit -1
endif
ifndef ARTIFACTORY_TOKEN 
	$(info ARTIFACTORY_TOKEN not defined)
	exit -1
endif

-include $(shell curl -so .build-harness -H "Authorization: token ${GITHUB_TOKEN}" -H "Accept: application/vnd.github.v3.raw" "https://raw.github.ibm.com/ICP-DevOps/build-harness/master/templates/Makefile.build-harness"; echo .build-harness)


SHELL := /bin/bash

.PHONY: docker-logins 
docker-logins:
	$(SELF) docker:login DOCKER_REGISTRY=$(DOCKER_INTEGRATION_REGISTRY)
	$(SELF) docker:login DOCKER_REGISTRY=$(DOCKER_SCRATCH_REGISTRY)


# search-plugin build/test

.PHONY: install
install:
	npm install -g typescript
	npm install
	npm run buildCSS


.PHONY: package
package:
	tsc
	cp -r ./src/* ./
	ls -a
	npm pack
	mv kui-shell-plugin-search-0.0.0-semantically-released.tgz plugin-search.tgz


.PHONY: integrate-plugin
integrate-plugin:
	@cd build-tools; \
		./build-mcm-kui.sh

.PHONY: copyright-check
copyright-check:
	./build-tools/copyright-check.sh

.PHONY: plugin-tests
plugin-tests:
	#TODO


# Push docker image to artifactory
.PHONY: release
release:
	$(SELF) docker:tag-arch
	@echo "Tagged plugin-search image as $(DOCKER_ARCH_URI)"
	@echo "Pushing plugin-search image to $(DOCKER_ARCH_URI)..."
	$(SELF) docker:push-arch

