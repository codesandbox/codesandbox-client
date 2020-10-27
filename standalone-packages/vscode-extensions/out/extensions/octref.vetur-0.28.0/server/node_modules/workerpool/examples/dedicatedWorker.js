var workerpool = require('..');

// create a worker pool using an external worker script
var pool = workerpool.pool(__dirname + '/workers/crossWorker.js');

// run functions on the worker via exec
pool.exec('fibonacci', [10])
    .then(function (result) {
      console.log('Result: ' + result); // outputs 55
    })
    .catch(function (err) {
      console.error(err);
    })
    .then(function () {
      pool.terminate(); // terminate all workers when done
    });
