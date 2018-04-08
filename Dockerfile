FROM node as builder
WORKDIR /codesandbox
COPY . .
RUN yarn && yarn build

FROM busybox:1.28.1
COPY --from=builder /codesandbox/www /codesandbox
