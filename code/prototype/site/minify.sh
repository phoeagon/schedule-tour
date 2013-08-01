#!/bin/bash
cp -r public public.min
file=`find public/ | grep -P ".js$"`
for i in $file:
    do
        echo $i
        node minify.js $i;
    done
file=`find  public/ | grep -P ".css$"`
for i in $file:
    do
        echo $i
        node minify.js $i;
    done
