build:
	docker build -t zachlatta/public-notes-sync public-notes-sync/

test: build
	docker run --rm -it \
		-v ${HOME}/pokedex-synced/txt/obsidian:/md_src \
		-v ${HOME}/dev/zachlatta.com/tmp/public-notes:/md_dest \
		zachlatta/public-notes-sync \
		/bin/bash

run: build
	docker run --rm -it \
		-v ${HOME}/pokedex-synced/txt/obsidian:/md_src \
		-v ${HOME}/dev/zachlatta.com/tmp/public-notes:/md_dest \
		zachlatta/public-notes-sync
