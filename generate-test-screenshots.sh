#!/bin/bash
docker run -v $(pwd):/home/circleci/codesandbox-client -w /home/circleci/codesandbox-client --name test-container -t codesandbox/node-puppeteer yarn start:test && \
id=$(docker inspect --format="{{.Id}}" test-container) && \
docker exec $(id) yarn test:integrations
