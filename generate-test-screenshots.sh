#!/bin/bash
docker run --rm --name test-container -v $(pwd):/home/circleci/codesandbox-client -w /home/circleci/codesandbox-client -t codesandbox/node-puppeteer node packages/app/integration-tests/tests/generate-sandboxes.js
