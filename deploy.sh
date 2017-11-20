#!/bin/bash
set -e

rm -rf .deliver
mkdir .deliver
cp -R www .deliver
echo "Tarring build files"
tar -C .deliver -zcvf .deliver/code_sandbox_client.tar.gz www
echo "Cleaning remote tar"
ssh nginx@ssh.codesandbox.io "rm -f code_sandbox_client.tar.gz"
echo "Moving tar to server"
scp .deliver/code_sandbox_client.tar.gz nginx@ssh.codesandbox.io:./
echo "Untarring www files"
ssh nginx@ssh.codesandbox.io "tar -xzf ./code_sandbox_client.tar.gz"

