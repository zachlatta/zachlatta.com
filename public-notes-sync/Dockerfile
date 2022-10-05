FROM alpine:3.16

RUN apk add --no-cache bash grep coreutils sed yq>4.26 git

# Mount Obsidian repo here
VOLUME /md_dest
# Mount public git repo for subset of notes here
VOLUME /md_src

ENV MD_SRC=/md_src
ENV MD_DEST=/md_dest

ENV GIT_NAME="Zach Latta"
ENV GIT_EMAIL="zach@zachlatta.com"

RUN git config --global user.email "$GIT_EMAIL" && git config --global user.name "$GIT_NAME"
# git will throw errors when trying to commit to a repo on a volume unless we
# mark $MD_DEST as safe
RUN git config --global --add safe.directory $MD_DEST

COPY filter-and-sync.sh /filter-and-sync.sh
COPY timer.sh /timer.sh

CMD [ "/timer.sh" ]