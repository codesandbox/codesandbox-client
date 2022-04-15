#!/bin/sh

OUTPUT="${1%.*}.js"
emcc --memory-init-file 1 --pre-js ../../harness/emscripten/pre.js --post-js ../../harness/emscripten/post.js -O1 $1 -o $OUTPUT
