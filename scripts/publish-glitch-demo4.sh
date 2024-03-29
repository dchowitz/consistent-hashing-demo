#!/bin/bash

glitch_dir=~/Dev/glitch/dchowitz-consistent-hashing-demo4

echo $glitch_dir

rm -rf $glitch_dir/*.*
cp -r ./dist/*.* $glitch_dir

pushd $glitch_dir
git checkout updates
git add -A
git commit -m "update"
git push
popd
