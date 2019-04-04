# set-blocking

[![Build Status](https://travis-ci.org/yargs/set-blocking.svg)](https://travis-ci.org/yargs/set-blocking)
[![NPM version](https://img.shields.io/npm/v/set-blocking.svg)](https://www.npmjs.com/package/set-blocking)
[![Coverage Status](https://coveralls.io/repos/yargs/set-blocking/badge.svg?branch=)](https://coveralls.io/r/yargs/set-blocking?branch=master)
[![Standard Version](https://img.shields.io/badge/release-standard%20version-brightgreen.svg)](https://github.com/conventional-changelog/standard-version)

set blocking `stdio` and `stderr` ensuring that terminal output does not truncate.

```js
const setBlocking = require('set-blocking')
setBlocking(true)
console.log(someLargeStringToOutput)
```

## License

ISC
