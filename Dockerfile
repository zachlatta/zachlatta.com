FROM ruby:2.5
MAINTAINER Zach Latta <zach@zachlatta.com>

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ADD Gemfile /usr/src/app/Gemfile
ADD Gemfile.lock /usr/src/app/Gemfile.lock

ENV BUNDLE_GEMFILE=Gemfile \
  BUNDLE_JOBS=4

RUN bundle install

ADD . /usr/src/app
