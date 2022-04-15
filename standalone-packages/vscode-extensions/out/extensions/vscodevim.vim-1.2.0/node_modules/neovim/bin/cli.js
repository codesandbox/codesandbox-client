#!/usr/bin/env node
const Host = require('../lib/host').Host;
const logger = require('../lib/utils/logger').logger;

// node <current script> <rest of args>
const [, , ...args] = process.argv;

if (args[0] === '--version') {
  // eslint-disable-next-line global-require
  const pkg = require('../package.json');
  // eslint-disable-next-line no-console
  console.log(pkg.version);
  process.exit(0);
}

try {
  const host = new Host(args);
  host.start({ proc: process });
} catch (err) {
  logger.error(err);
}

process.on('unhandledRejection', (reason, p) => {
  logger.info('Unhandled Rejection at:', p, 'reason:', reason);
});
