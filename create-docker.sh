#!/bin/bash
set -e

echo "Creating temp Dockerfile"
touch Dockerfile
cat > Dockerfile <<EOF
FROM busybox:1.28.1
WORKDIR /codesandbox
COPY www /codesandbox
EOF
echo "Building image"
docker build -t codesandbox/client:$CIRCLE_SHA1 .
echo "Pushing image"
docker push codesandbox/client:$CIRCLE_SHA1

