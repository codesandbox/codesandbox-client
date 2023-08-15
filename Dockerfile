# build sandbox
FROM node:16 AS builder

WORKDIR /app
COPY . /app
RUN npx yarn install
RUN npx yarn build:deps
RUN npx yarn build:sandpack

# serve static files with caddy
FROM caddy:2.1.1-alpine

COPY --from=builder /app/www/ /usr/share/caddy/
COPY --from=builder /app/Caddyfile /etc/caddy/Caddyfile
