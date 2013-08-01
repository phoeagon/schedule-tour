#!/bin/bash
echo "default nginx setting: 5000~5001"
echo "Run this as: >bash load.sh"
let port=$1
for ((i=0; i < $2; i++))
    do
        let j=$i+$port;
        ( export PORT=$j; node app.js & )
    done;
