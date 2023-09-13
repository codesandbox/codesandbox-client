FROM nginx:1.16.1-alpine

COPY www env.sh .env.production .env.development /var/www/codesandbox/
