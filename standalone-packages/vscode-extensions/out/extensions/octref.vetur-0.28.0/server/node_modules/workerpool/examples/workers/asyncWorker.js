// This example worker runs asynchronous tasks. In practice, this could be
// interacting with a database or a web service. The asynchronous function
// returns a promise which resolves with the task's result.

var workerpool = require('../..');

// an async function returning a promise
function asyncAdd (a, b) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve(a + b);
    }, 1000);
  });
}

// an async function returning a promise
function asyncMultiply (a, b) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve(a * b);
    }, 1000);
  });
}

// create a worker and register public functions
workerpool.worker({
  asyncAdd: asyncAdd,
  asyncMultiply: asyncMultiply
});
