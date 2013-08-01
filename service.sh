#!/bin/bash
cd /home/dev/schedule-tour
git checkout master
git pull
cd /home/dev/schedule-tour/code/prototype/site
bash ./load.sh 5000 2
sleep 5
while (ps -e | grep -q 'node' );do sleep 2;done;
