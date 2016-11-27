FROM node:latest
MAINTAINER Ives van Hoorne

RUN npm install -g yarn

RUN mkdir /usr/src/app

WORKDIR /usr/src/app
