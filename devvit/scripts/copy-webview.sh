#!/usr/bin/env bash
set -e
rm -rf webroot/dist
cp -r ../app/dist webroot/dist
