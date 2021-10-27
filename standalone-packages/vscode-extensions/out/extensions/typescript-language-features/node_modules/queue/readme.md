```
   ____  __  _____  __  _____ 
  / __ `/ / / / _ \/ / / / _ \
 / /_/ / /_/ /  __/ /_/ /  __/
 \__, /\__,_/\___/\__,_/\___/ 
   /_/                        
```
Asynchronous function queue with adjustable concurrency.

[![npm](http://img.shields.io/npm/v/queue.svg?style=flat-square)](http://www.npmjs.org/queue)
[![tests](https://img.shields.io/travis/jessetane/queue.svg?style=flat-square&branch=master)](https://travis-ci.org/jessetane/queue)
[![coverage](https://img.shields.io/coveralls/jessetane/queue.svg?style=flat-square&branch=master)](https://coveralls.io/r/jessetane/queue)

## Why
[Async](https://github.com/caolan/async) is a big library offering various approaches to dealing with asynchrony; `queue` is a small library offering a single, flexible abstraction.

## How
This module exports a class `Queue` that implements most of the `Array` API. Pass async functions (ones that accept a callback) to an instance's additive array methods. Processing begins when you call `q.start()`.

## Install
`npm install queue`  

## Test
`npm test`  
`npm run test-browser`

## Example
`npm run example`
``` javascript
var queue = require('queue');

var q = queue();
var results = [];

// add jobs using the Array API

q.push(function(cb) {
  results.push('two');
  cb();
});

q.push(
  function(cb) {
    results.push('four');
    cb();
  },
  function(cb) {
    results.push('five');
    cb();
  }
);

q.unshift(function(cb) {
  results.push('one');
  cb();
});

q.splice(2, 0, function(cb) {
  results.push('three');
  cb();
});

// use the timeout feature to deal with jobs that 
// take too long or forget to execute a callback

q.timeout = 100;

q.on('timeout', function(next, job) {
  console.log('job timed out:', job.toString().replace(/\n/g, ''));
  next();
});

q.push(function(cb) {
  setTimeout(function() {
    console.log('slow job finished');
    cb();
  }, 200);
});

q.push(function(cb) {
  console.log('forgot to execute callback');
});

// get notified when jobs complete

q.on('success', function(result, job) {
  console.log('job finished processing:', job.toString().replace(/\n/g, ''));
});

// begin processing, get notified on end / failure

q.start(function(err) {
  console.log('all done:', results);
});
```

## Require
#### `var queue = require('queue')`

## Constructor
#### `var q = queue([opts])`
Where `opts` may contain inital values for:
* `q.concurrency`
* `q.timeout`

## Instance methods
#### `q.start([cb])`
cb, if passed, will be called when the queue empties or when an error occurs.

#### `q.stop()`
Stops the queue. can be resumed with `q.start()`.

#### `q.end([err])`
Stop and empty the queue immediately.

## Instance methods mixed in from `Array`
Mozilla has docs on how these methods work [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).
#### `q.push(element1, ..., elementN)`  
#### `q.unshift(element1, ..., elementN)`  
#### `q.splice(index , howMany[, element1[, ...[, elementN]]])`  
#### `q.pop()`  
#### `q.shift()`  
#### `q.slice(begin[, end])`  
#### `q.reverse()`  
#### `q.indexOf(searchElement[, fromIndex])`  
#### `q.lastIndexOf(searchElement[, fromIndex])`  

## Properties
#### `q.concurrency`
Max number of jobs the queue should process concurrently, defaults to `Infinity`.

#### `q.timeout`
Milliseconds to wait for a job to execute its callback.

#### `q.length`
Jobs pending + jobs to process (readonly).

## Events

#### `q.emit('success', result, job)`
After a job executes its callback.

#### `q.emit('error', err, job)`
After a job passes an error to its callback.

#### `q.emit('timeout', continue, job)`
After `q.timeout` milliseconds have elapsed and a job has not executed its callback.

#### `q.emit('end'[, err])`
After all jobs have been processed

## Releases
The latest stable release is published to [npm](http://npmjs.org/queue). Abbreviated changelog below:
* [3.1.x](https://github.com/jessetane/queue/archive/3.0.6.tar.gz)
 * Add .npmignore
* [3.0.x](https://github.com/jessetane/queue/archive/3.0.6.tar.gz)
 * Change the default concurrency to `Infinity`
 * Allow `q.start()` to accept an optional callback executed on `q.emit('end')`
* [2.x](https://github.com/jessetane/queue/archive/2.2.0.tar.gz)
 * Major api changes / not backwards compatible with 1.x
* [1.x](https://github.com/jessetane/queue/archive/1.0.2.tar.gz)
 * Early prototype

## License
Copyright © 2014 Jesse Tane <jesse.tane@gmail.com>

This work is free. You can redistribute it and/or modify it under the
terms of the [WTFPL](http://www.wtfpl.net/txt/copying).

No Warranty. The Software is provided "as is" without warranty of any kind, either express or implied, including without limitation any implied warranties of condition, uninterrupted use, merchantability, fitness for a particular purpose, or non-infringement.
