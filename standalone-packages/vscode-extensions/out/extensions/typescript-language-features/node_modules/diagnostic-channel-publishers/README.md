# Diagnostic Channel Publishers
Provides a set of patches for common Node.js modules to publish instrumentation
data to the [diagnostic-channel](https://github.com/Microsoft/node-diagnostic-channel) channel.

## Currently-supported modules
* [`redis`](https://github.com/NodeRedis/node_redis) v2.x
* [`mysql`](https://github.com/mysqljs/mysql) v2.0.0 -> v2.14.x
* [`mongodb`](https://github.com/mongodb/node-mongodb-native) v2.0.0 -> v2.3.0
* [`pg`](https://github.com/brianc/node-postgres) v6.x
* [`pg-pool`](https://github.com/brianc/node-pg-pool) v1.x
* [`bunyan`](https://github.com/trentm/node-bunyan) v1.x
* [`winston`](https://github.com/winstonjs/winston) v2.x

## Release notes
### 0.2.0 - August 18th, 2017
* Added patching for `pg`, `pg-pool`, and `winston` modules
* Updated build output to use `dist/` folder instead of `.dist/`
(fixes [#256](https://github.com/Microsoft/ApplicationInsights-node.js/issues/256))