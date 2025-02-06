#!/bin/bash

if [ -d "current" ]
then
    rm -rf current;
fi

mkdir current;

if [ ! -d "releases" ]
then
    mkdir releases;
fi

if [ -d "releases/swiftboard-react" ]
then
    rm -rf releases/swiftboard-react;
fi

(cd releases && git clone https://ssnigdho:yWYJsbnPLa7394ZbZskG@bitbucket.org/ssnigdho/swiftboard-react.git)

cd releases/swiftboard-react

npm install
npm run build

cd ../../current

ln -sf ../releases/swiftboard-react public
