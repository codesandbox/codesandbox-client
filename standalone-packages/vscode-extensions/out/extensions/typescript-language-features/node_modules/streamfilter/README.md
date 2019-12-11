# streamfilter

`streamfilter` is a function based filter for streams inspired per gulp-filter
 but no limited to Gulp nor to objectMode streams.

[![NPM version](https://badge.fury.io/js/streamfilter.png)](https://npmjs.org/package/streamfilter) [![Build status](https://secure.travis-ci.org/nfroidure/streamfilter.png)](https://travis-ci.org/nfroidure/streamfilter) [![Dependency Status](https://david-dm.org/nfroidure/streamfilter.png)](https://david-dm.org/nfroidure/streamfilter) [![devDependency Status](https://david-dm.org/nfroidure/streamfilter/dev-status.png)](https://david-dm.org/nfroidure/streamfilter#info=devDependencies) [![Coverage Status](https://coveralls.io/repos/nfroidure/streamfilter/badge.png?branch=master)](https://coveralls.io/r/nfroidure/streamfilter?branch=master) [![Code Climate](https://codeclimate.com/github/nfroidure/streamfilter.png)](https://codeclimate.com/github/nfroidure/streamfilter)

## Installation

First install `streamfilter` in you project:
```sh
npm install --save streamfilter
```

## Getting started

There are 3 scenarios of use :

### Simple filter

```js
var FilterStream = require('streamfilter');

var filter = new FilterStream(function(chunk, encoding, cb) {
  if(itmustbefiltered) {
    cb(true);
  } else {
    cb(false);
  }
});

// Print to stdout a filtered stdin
process.stdin
  .pipe(filter)
  .pipe(process.stdout);
```

### Filter and restore

```js
var FilterStream = require('streamfilter');

var filter = new FilterStream(function(chunk, encoding, cb) {
    if(itmustbefiltered) {
      cb(true);
    } else {
      cb(false);
    }
}, {
  restore: true
});

// Print accepted chunks in stdout
filter.pipe(process.stdout);

// Print filtered one to stderr
filter.restore.pipe(process.stderr);
```

### Filter and restore as a passthrough stream
Let's be hype!

```js
var FilterStream = require('streamfilter');

// Filter values
var filter = new FilterStream(function(chunk, encoding, cb) {
    if(itmustbefiltered) {
      cb(true);
    } else {
      cb(false);
    }
}, {
  restore: true,
  passthrough: true
});

// Pipe stdin
process.stdin.pipe(filter)
  // Edit kept chunks
  .pipe(mySuperTransformStream)
  // Restore filtered chunks
  .pipe(filter.restore)
  // and output!
  .pipe(process.stdout)
```

Note that in this case, this is *your* responsibility to end the restore stream
 by piping in another stream or ending him manually.

## API

### stream:Stream FilterStream(filterCallback:Function, options:Object)

Filter piped in streams according to the given `filterCallback` that takes the
 following arguments: `chunk` the actual chunk, `encoding` the chunk encoding,
 `filterResultCallback` the function to call as the result of the filtering
 process with `true` in argument to filter her or `false` otherwise.

Options are passed in as is in the various stream instances spawned by this
 module. So, to use the objectMode, simply pass in the `options.objectMode`
 value set to `true`.

#### options.restore
Set to `true`, this option create a readable stream allowing you to use the
 filtered chunks elsewhere. The restore stream is exposed in the `FilterStream`
 instance as a `restore` named property.

#### options.passthrough
Set to `true`, this option change the restore stream nature from a readable
 stream to a passthrough one, allowing you to reuse the filtered chunks in an
 existing pipeline.

## Contribute

Feel free to submit us your improvements. To do so, you must accept to publish
 your code under the MIT license.

To start contributing, first run the following to setup the development
 environment:
```sh
git clone git@github.com:nfroidure/streamfilter.git
cd streamfilter
npm install
```

Then, run the tests:
```sh
npm test
```

## Stats
[![NPM](https://nodei.co/npm/streamfilter.png?downloads=true&stars=true)](https://nodei.co/npm/streamfilter/)
[![NPM](https://nodei.co/npm-dl/streamfilter.png)](https://nodei.co/npm/streamfilter/)

