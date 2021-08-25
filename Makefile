IMAGE=zachlatta/zachlatta.com

.PHONY: build
build: Dockerfile
	docker build -t $(IMAGE) .

.PHONY: push
push: build
	docker push $(IMAGE)

.PHONY: shell
shell: build
	docker run -it --rm \
		--volume $(PWD):/zachlatta.com \
		-p 1337:80 \
		--entrypoint /bin/sh \
		$(IMAGE)

.PHONY: run
run: build
	docker run -it --rm \
		--volume $(PWD)/db:/zachlatta.com/db \
		-p 1337:80 \
		$(IMAGE)

default: build