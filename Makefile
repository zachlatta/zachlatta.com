IMAGE=zachlatta/zachlatta.github.io
RUN_ARGS=-it --rm -v $(shell pwd):/usr/src/app $(IMAGE)
JEKYLL=bundle exec jekyll

.PHONY: all build compile serve shell

all: compile

build:
	docker build -t $(IMAGE) .

compile: build
	docker run $(RUN_ARGS) $(JEKYLL) build

serve: build
	docker run -p 8080:8080 -p 8081:8081 $(RUN_ARGS) $(JEKYLL) serve \
		--host '0.0.0.0' \
		--port 8080 \
		--livereload \
		--livereload-port 8081

shell: build
	docker run $(RUN_ARGS) /bin/bash
