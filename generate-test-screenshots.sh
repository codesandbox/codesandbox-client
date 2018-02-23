#!/bin/bash
docker run --rm --name test-container -v $(pwd):/home/circleci/codesandbox-client -w /home/circleci/codesandbox-client -d -t codesandbox/node-puppeteer yarn start:test && \
sleep 6 && docker exec -it test-container yarn test:integrations && \
docker stop test-container