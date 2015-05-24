#!/bin/bash
DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
cd $DIR
/usr/local/bin/node createdb.js
if [ ! -d "../../$1" ]; then
    mkdir ../../$1
fi
cp data.json ../../$1
