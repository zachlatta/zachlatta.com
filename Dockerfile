FROM alpine:3.14

EXPOSE 1337

RUN apk add nginx go

# install overmind, our Procfile runner
RUN apk add tmux
ADD https://github.com/DarthSim/overmind/releases/download/v2.2.2/overmind-v2.2.2-linux-amd64.gz /tmp/
RUN gunzip -d /tmp/overmind-v2.2.2-linux-amd64.gz && \
    mv /tmp/overmind-v2.2.2-linux-amd64 /usr/local/bin/overmind && \
    chmod +x /usr/local/bin/overmind

ENV BASEDIR /zachlatta.com

COPY . $BASEDIR/

RUN $BASEDIR/bin/build.sh

ENTRYPOINT $BASEDIR/bin/start.sh