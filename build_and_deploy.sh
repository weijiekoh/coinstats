#!/bin/sh

yarn build
git add -A .
git commit -m "${1}"
git push heroku master
