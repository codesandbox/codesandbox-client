FROM node:18-bullseye
LABEL maintainer "Ives van Hoorne"

RUN mkdir /workspace
ADD .git /workspace/.git

WORKDIR /workspace
RUN git reset --hard
RUN apt update
RUN apt install -y nano less tmux zsh vim
