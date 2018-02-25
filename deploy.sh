#!/bin/bash
set -e

ssh nginx@ssh.codesandbox.io "echo test; ls"
