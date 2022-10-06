#!/usr/bin/env bash

./filter-and-sync.sh

while true; do
    echo
    echo "##############################################"
    echo "## Waiting to run filter-and-sync.sh again! ##"
    echo "##############################################"
    echo

    # repeat every 15 seconds, change this number to change interval
    for i in {15..01}
    do
        echo "$i"
        sleep 1
    done

    echo

    ./filter-and-sync.sh
done