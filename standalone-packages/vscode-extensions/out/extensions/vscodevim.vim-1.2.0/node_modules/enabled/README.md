# enabled

[![From bigpipe.io][from]](http://bigpipe.io)[![Version npm][version]](http://browsenpm.org/package/enabled)[![Build Status][build]](https://travis-ci.org/bigpipe/enabled)[![Dependencies][david]](https://david-dm.org/bigpipe/enabled)[![Coverage Status][cover]](https://coveralls.io/r/bigpipe/enabled?branch=master)

[from]: https://img.shields.io/badge/from-bigpipe.io-9d8dff.svg?style=flat-square
[version]: http://img.shields.io/npm/v/enabled.svg?style=flat-square
[build]: http://img.shields.io/travis/bigpipe/enabled/master.svg?style=flat-square
[david]: https://img.shields.io/david/bigpipe/enabled.svg?style=flat-square
[cover]: http://img.shields.io/coveralls/bigpipe/enabled/master.svg?style=flat-square

Enabled is a small utility that can check if certain namespace are enabled by
environment variables which are automatically transformed to regular expressions
for matching.

## Installation

The module is release in the public npm registry and can be used in browsers and
servers as it uses plain ol ES3 to make the magic work.

```
npm install --save enabled
```

## Usage

First of all make sure you've required the module using:

```js
'use strict';

var enabled = require('enabled');
```

The returned `enabled` function accepts 2 arguments.

1. `name` **string**, The namespace that should match.
2. `variables` **array**, **optional**, Names of the `env` variable that it
   should use for matching. If no argument is supplied it will default to
   `diagnostics` and `debug`.

#### Examples

```js
process.env.DEBUG = 'foo';
enabled('foo') // true;
enabled('bar') // false;

// can use wildcards
process.env.DEBUG = 'foob*';

enabled('foobar') // true;
enabled('barfoo') // false;

process.env.DEBUG = 'foobar,-shizzle,nizzle';

enabled('foobar') // true;
enabled('shizzle-my-nizzle') // false;
enabled('nizzle') // true;
```

## License

MIT
