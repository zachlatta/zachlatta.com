IMAGE=zachlatta/zachlatta.github.io

.PHONY: build default

all: compile

build:
	docker build -t $(IMAGE) .

compile: build
	docker run -it --rm $(IMAGE) /bin/bash

shell: build
	docker run -it --rm -v $(shell pwd):/usr/src/app $(IMAGE) /bin/bash
