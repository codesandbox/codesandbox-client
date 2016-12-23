#!/bin/bash

docker build -t codesandbox/prod/client --file Dockerfile.prod .
id=$(docker create codesandbox/prod/client)
rm -rf .deliver
mkdir .deliver
mkdir .deliver/www
docker cp $id:/app/www/ ./.deliver/
docker rm -v $id


echo "Tarring build files"
tar -C .deliver -zcvf .deliver/code_sandbox_client.tar.gz www

echo "Cleaning remote tar"
ssh nginx@codesandbox.io "rm -f code_sandbox_client.tar.gz"

echo "Moving tar to server"
scp .deliver/code_sandbox_client.tar.gz nginx@codesandbox.io:./

echo "Untarring www files"
ssh nginx@codesandbox.io "tar -xzf ./code_sandbox_client.tar.gz"
