FROM nginx:1.26.3-alpine

WORKDIR /var/www/codesandbox
COPY www ./
