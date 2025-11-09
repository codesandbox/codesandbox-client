FROM nginx:1.29.3-alpine

WORKDIR /var/www/codesandbox
COPY www ./
