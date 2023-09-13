FROM nginx:1.16.1-alpine

COPY www /var/www/codesandbox
COPY env.sh /var/www/codesandbox
