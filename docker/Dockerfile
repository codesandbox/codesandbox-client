FROM node:16-bullseye
LABEL maintainer "Ives van Hoorne"

# Update packages and install security updates
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y --no-install-recommends nano less tmux zsh vim && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN mkdir /workspace
ADD .git /workspace/.git

WORKDIR /workspace
RUN git reset --hard
