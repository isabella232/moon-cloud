#!/bin/bash

WD=$(pwd)
CLONE_DIR="${GITHUB_WORKSPACE}/moon"
git clone -b gh-pages https://${GITHUB_TOKEN}@github.com/aerokube/moon.git ${CLONE_DIR}
cd ${CLONE_DIR}
git config user.name "${GITHUB_REPOSITORY}"
git config user.email "aerokube@aerokube.github.com"
git rm ${CLONE_DIR}/main.*.css
git rm ${CLONE_DIR}/main.*.js
cp -R ${WD}/dist/* ${CLONE_DIR}
git add --all
git commit -am "Updated website"
git push origin HEAD:gh-pages
