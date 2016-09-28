#!/usr/bin/env bash
export NODE_PATH=../src/
export NODE_ENV=production

if ! mkdir _release; then
  echo "The _release directory already exists. Please move or delete it to build a release."
  exit 1
fi

git clone -b release git@github.com:gfny/reframe _release
cd _release

# Delete the source files
find . -maxdepth 1 ! -name '.*' -type d -exec rm -rf {} +

cp -f ../package.json ./package.json
if (../node_modules/babel-cli/bin/babel.js -d ./ ../src/); then
  sass -Cq --scss --compass --sourcemap=none ../src/reframe.scss ./reframe.css

  # Why?
  cp ./reframe.css ./reframe.scss

  VER=`cat package.json | sed -n 's/.*"version": "\(.*\)".*/\1/p'`

  if (git tag | grep $VER); then
      echo "Error: release $VER already exists"; exit 1
  fi

  git add .
  git commit -m "Release $VER" -e
  git tag "$VER"
  git push --tags
else
  echo " "
  echo "There were errors compiling your code. "
  echo "Please fix these problems before publishing a release."
  exit 1
fi

# Clean up
cd ../
rm -rf _release
