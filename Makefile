IMAGE=zachlatta/zachlatta.com

build:
	docker build -t $(IMAGE) .

default: build