var workerpool = require('..');

// create a worker pool
var pool = workerpool.pool();

// create a static function
function add(a, b) {
  return a + b;
}

// offload execution of a function to the worker pool
pool.exec(add, [3, 4])
    .then(function (result) {
      console.log('result', result); // outputs 7
    })
    .catch(function (err) {
      console.error(err);
    })
    .then(function () {
      pool.terminate(); // terminate all workers when done
    });
