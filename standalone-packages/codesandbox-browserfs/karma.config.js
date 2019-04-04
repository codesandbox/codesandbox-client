'use strict';
const express = require('express');
const detectBrowsers = require('detect-browsers');
const seenBrowsers = {};
const isTravis = process.env.TRAVIS;
const execSync = require('child_process').execSync;
const path = require('path');
// Browser detection does not work properly on Travis.
const installedBrowsers = isTravis ? ['Firefox'] : detectBrowsers.getInstalledBrowsers()
  // XXX: Browsers with spaces in their name (e.g. Chrome Canary) need to have the space removed
  .map(function(browser) { return browser.name.replace(/ /, ''); })
  .filter(function(browser) {
    if (seenBrowsers[browser]) {
      return false;
    } else {
      seenBrowsers[browser] = true;
      return true;
    }
  });

let dropbox = false;
let continuous = false;
let coverage = false;
let karmaFiles = [
  // Main module and fixtures loader
  'test/harness/test.js',
  // WebWorker script.
  { pattern: 'test/harness/factories/workerfs_worker.js', included: false, watched: true },
  // Source map support
  { pattern: 'src/**/*', included: false, watched: false },
  { pattern: 'test/**/*', included: false, watched: false }
];

// The presence of the Dropbox library dynamically toggles the tests.
if (dropbox) {
  karmaFiles.unshift('node_modules/dropbox/dist/Dropbox-sdk.min.js');
  // Generate token.
  execSync(`node ${path.resolve(__dirname, './build/scripts/get_db_credentials.js')} ${path.resolve(__dirname, './test/fixtures/dropbox/token.json')}`, {
    stdio: 'inherit'
  });
}

module.exports = function(configSetter) {
  let config = {
    basePath: __dirname,
    frameworks: ['mocha'],
    files: karmaFiles,
    exclude: [],
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: 'INFO',
    autoWatch: true,
    concurrency: 1,
    browsers: installedBrowsers,
    captureTimeout: 60000,
    singleRun: !continuous,
    urlRoot: '/',
    // Dropbox tests are slow.
    browserNoActivityTimeout: 60000,
    browserDisconnectTimeout: 10000,
    browserDisconnectTolerance: 3,
    preprocessors: {},
    coverageReporter: undefined,
    client: {
      mocha: {
        // Stop tests after first failure.
        // Our tests have some global state (e.g. # of pending callbacks). Once those get messed up by a failing test,
        // subsequent tests are likely to fail.
        bail: true
      }
    },
    middleware: ['static'],
    plugins: [
      'karma-*',
      {
        'middleware:static': ['factory', function() {
          return express.static(__dirname);
        }]
      }
    ]
  };
  if (coverage) {
    config.reporters.push('coverage');
    config.preprocessors = {
      './test/harness/**/*.js': ['coverage']
    };
    config.coverageReporter = { type: 'json', dir: 'coverage/' };
  }
  configSetter.set(config);
};
