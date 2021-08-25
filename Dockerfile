FROM alpine:3.14

EXPOSE 1337

RUN apk add nginx

COPY . /zachlatta.com/

RUN /zachlatta.com/bin/build.sh

ENTRYPOINT /zachlatta/bin/start.sh