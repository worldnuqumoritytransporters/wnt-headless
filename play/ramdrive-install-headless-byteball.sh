#!/usr/bin/env bash

# only tested on ubuntu 16.4LTS with 32GB RAM
# don't forget to chmod a+x this file

sudo mkdir -p /media/ramdrive
mkdir -p ~/wnt
sudo mount -t tmpfs -o size=31G tmpfs /media/ramdrive/
cd /media/ramdrive
mkdir /media/ramdrive/wnt_app_storage

rm -rf ./wnt-headless
git clone https://github.com/worldnuqumoritytransporters/wnt-headless.git
cd wnt-headless
yarn

rm -rf ~/.config/wnt-headless
ln -s /media/ramdrive/wnt_app_storage ~/.config/wnt-headless

echo "exports.LOG_FILENAME = '/dev/null';" >> conf.js

node start.js

function finish {
  rsync -rue --info=progress2 /media/ramdrive ~/wnt
}

trap finish EXIT
