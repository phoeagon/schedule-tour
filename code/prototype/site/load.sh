#!/bin/bash
########################################################
#
#  Usage : ./load.sh $FIRST_PORT $NUM_OF_WEB_INSTANCES
#
#######################################################3
echo "default nginx setting: 5000~5001"
echo "Run this as: >bash load.sh $FIRST_PORT $NUM_OF_WEB_INSTANCES"
let port=$1

# run web service

for ((i=0; i < $2; i++))
    do
        let j=$i+$port;
        ( export PORT=$j; supervisor `pwd`/app.js  >`pwd`/server$i.log & )
    done;

# run GCM server

supervisor `pwd`/push_server.js &
