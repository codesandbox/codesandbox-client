FROM nginx:1.30.6-alpine3.24

WORKDIR /var/www/codesandbox
COPY www ./
