#!/bin/bash
docker run -v $(pwd):/app/ --name test-container -t codesandbox/test yarn start:test && \
id=$(docker inspect --format="{{.Id}}" test-container) && \
docker exec $(id) yarn test:integrations
