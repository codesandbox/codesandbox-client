#!/bin/bash

yarn
NODE_OPTIONS=--max_old_space_size=8192 yarn run start:dev_api
