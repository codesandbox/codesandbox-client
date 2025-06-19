FROM nginx:1.27.5-alpine

WORKDIR /var/www/codesandbox
COPY www ./
