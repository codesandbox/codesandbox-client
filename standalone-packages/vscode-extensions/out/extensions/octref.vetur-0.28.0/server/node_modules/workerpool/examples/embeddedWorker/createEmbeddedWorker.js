var fs = require('fs');
var webpack = require('webpack');
var btoa = require('btoa');

var WORKER_FILE = './worker.js';
var WORKER_BUNDLE_FILE = './dist/worker.bundle.js';
var WORKER_EMBEDDED_FILE = './dist/worker.embedded.js';

create();

async function create () {
  try {
    console.log('\nWorker file ' + WORKER_FILE);

    await createWorkerBundle(WORKER_FILE, WORKER_BUNDLE_FILE)
    console.log('\nCreated worker bundle ' + WORKER_BUNDLE_FILE);

    createEmbeddedWorkerFromBundle(WORKER_BUNDLE_FILE, WORKER_EMBEDDED_FILE)
    console.log('\nCreated embedded worker ' + WORKER_EMBEDDED_FILE);
  } catch(err) {
    console.error(err);
  }
}

/**
 * Generate a bundle of the worker code using Webpack
 * @param {string} workerFile        For example 'worker.js'
 * @param {string} workerBundleFile  For example 'dist/worker.bundle.js'
 */
function createWorkerBundle(workerFile, workerBundleFile) {
  return new Promise(function (resolve, reject) {
    var config = {
      // target: 'node', // makes the worker working for node.js
      entry: workerFile,
      output: {
        filename: workerBundleFile,
        path: __dirname
      },
      mode: 'production'
    };

    webpack(config).run(function (err, stats) {
      if (err) {
        console.log(err);
      }

      process.stdout.write(stats.toString() + '\n');

      if (stats.hasErrors()) {
        reject(new Error('Webpack errors:\n' + stats.toJson().errors.join('\n')));
      }

      resolve();
    });
  });
}

/**
 * Create an embedded version of the worker code: a data url.
 * @param {string} workerBundleFile     For example 'dist/worker.bundle.js'
 * @param {string} workerEmbeddedFile   For example 'dist/worker.embedded.js'
 */
function createEmbeddedWorkerFromBundle (workerBundleFile, workerEmbeddedFile) {
  var workerScript = String(fs.readFileSync(workerBundleFile));

  var workerDataUrl = 'data:application/javascript;base64,' + btoa(workerScript);

  fs.writeFileSync(workerEmbeddedFile, 'module.exports = \'' + workerDataUrl + '\';\n');
}
