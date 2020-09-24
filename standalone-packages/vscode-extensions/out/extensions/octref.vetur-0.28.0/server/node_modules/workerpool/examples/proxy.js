var workerpool = require('..');

// create a worker pool
var pool = workerpool.pool(__dirname + '/workers/nodeWorker.js');

// create a proxy
pool.proxy()
    .then(function (proxy) {
      // execute a function via the proxy
      return proxy.fibonacci(10)
    })
    .then(function (result) {
      console.log('Result: ' + result); // outputs 55
    })
    .catch(function (err) {
      console.error(err);
    })
    .then(function () {
      pool.terminate(); // terminate all workers when done
    });
