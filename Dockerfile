FROM alpine:3.14

EXPOSE 80

RUN apk add curl nginx go ruby

# install overmind, our Procfile runner
RUN apk add tmux
RUN /bin/ash -c 'set -ex && \
    ARCH_TO_DOWNLOAD="" && \
    ARCH=`uname -m` && \
    if [ "$ARCH" == "x86_64" ]; then \
       echo "x86_64" && \
       ARCH_TO_DOWNLOAD="amd64"; \
    elif [ "$ARCH" == "aarch64" ]; then \
       echo "aarch64" && \
       ARCH_TO_DOWNLOAD="arm64"; \
    else \
       echo "unknown arch" && \
       exit 1; \
    fi && \
    curl -L "https://github.com/DarthSim/overmind/releases/download/v2.2.2/overmind-v2.2.2-linux-${ARCH_TO_DOWNLOAD}.gz" > /tmp/overmind.gz'
RUN gunzip -d /tmp/overmind.gz && \
    mv /tmp/overmind* /usr/local/bin/overmind && \
    chmod +x /usr/local/bin/overmind

ENV BASEDIR /zachlatta.com
WORKDIR $BASEDIR

COPY . $BASEDIR/

RUN $BASEDIR/bin/build

ENTRYPOINT $BASEDIR/bin/start