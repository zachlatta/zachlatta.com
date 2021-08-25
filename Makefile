IMAGE=zachlatta/zachlatta.com

build:
	docker build -t $(IMAGE) .

shell:
	docker run -it --rm --volume $(PWD):/zachlatta.com --entrypoint /bin/sh $(IMAGE)

default: build