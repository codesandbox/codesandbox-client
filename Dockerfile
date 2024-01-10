FROM nginx:1.16.1-alpine

WORKDIR /var/www/codesandbox
COPY www ./
