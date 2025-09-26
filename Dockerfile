FROM nginx:1.29.1-alpine

WORKDIR /var/www/codesandbox
COPY www ./
