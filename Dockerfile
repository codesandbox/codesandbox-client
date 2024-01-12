FROM nginx:1.25.3-alpine

WORKDIR /var/www/codesandbox
COPY www ./
