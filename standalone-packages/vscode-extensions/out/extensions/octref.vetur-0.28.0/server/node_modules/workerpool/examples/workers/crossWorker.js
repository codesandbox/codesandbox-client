// a simple worker which can be used both in node.js and in the browser
// only the load process differs for node.js and web workers

// load workerpool
if (typeof importScripts === 'function') {
  // web worker
  importScripts('../../dist/workerpool.js');
}
else {
  // node.js
  var workerpool = require('../../dist/workerpool.js');
}

// a deliberately inefficient implementation of the fibonacci sequence
function fibonacci(n) {
  if (n < 2) return n;
  return fibonacci(n - 2) + fibonacci(n - 1);
}

// create a worker and register public functions
workerpool.worker({
  fibonacci: fibonacci
});
