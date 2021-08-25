#!/bin/sh

cd $BASEDIR

mkdir -p db/ # create db/ in $BASEDIR if it doesn't exist

overmind start --no-port