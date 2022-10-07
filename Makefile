build:
	docker build -t zachlatta/public-notes-sync:latest public-notes-sync/

push: build
	docker push zachlatta/public-notes-sync:latest

test: build
	docker run --rm -it \
		-v ${HOME}/pokedex-synced/txt/obsidian:/md_src \
		-v ${HOME}/dev/zachlatta.com/tmp/public-notes:/md_dest \
		-v ${HOME}/dev/zachlatta.com/tmp/ssh-key:/ssh_key \
		-e GIT_SSH_KEY_PATH=/ssh_key/ssh_key \
		zachlatta/public-notes-sync \
		/bin/bash

run: build
	docker run --rm -it \
		-v ${HOME}/pokedex-synced/txt/obsidian:/md_src \
		-v ${HOME}/dev/zachlatta.com/tmp/public-notes:/md_dest \
		-v ${HOME}/dev/zachlatta.com/tmp/ssh-key:/ssh_key \
		-e GIT_SSH_KEY_PATH=/ssh_key/ssh_key \
		zachlatta/public-notes-sync
