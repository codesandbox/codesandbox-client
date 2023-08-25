# build sandbox
FROM node:16 AS builder

WORKDIR /app
COPY . /app
RUN npx yarn install
RUN npx yarn build:deps
RUN npx yarn build:sandpack

# serve static files with caddy
FROM caddy:2.7.4-alpine

WORKDIR /app
COPY --from=builder /app/www/ /app/www/
COPY --from=builder /app/Caddyfile /etc/caddy/Caddyfile
