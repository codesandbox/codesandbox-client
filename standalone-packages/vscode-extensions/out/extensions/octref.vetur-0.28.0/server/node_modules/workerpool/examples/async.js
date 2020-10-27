var workerpool = require('..');

// create a worker pool using an the asyncWorker. This worker contains
// asynchronous functions.
var pool = workerpool.pool(__dirname + '/workers/asyncWorker.js');


pool.proxy()
    .then(function (worker) {
      return worker.asyncAdd(3, 4.1);
    })
    .then(function (result) {
      console.log(result);
    })
    .catch(function (err) {
      console.error(err);
    })
    .then(function () {
      pool.terminate(); // terminate all workers when done
    });
