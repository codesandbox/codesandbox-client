FROM node:10
LABEL maintainer "Ives van Hoorne"

RUN mkdir /workspace
ADD .git /workspace/.git

WORKDIR /workspace
RUN git reset --hard