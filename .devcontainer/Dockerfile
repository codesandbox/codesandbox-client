FROM node:16-bullseye

# Update packages and install security updates
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y --no-install-recommends zstd && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
