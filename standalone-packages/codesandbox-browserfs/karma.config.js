'use strict';
const express = require('express');
const detectBrowsers = require('detect-browsers');
const seenBrowsers = {};
const isTravis = process.env.TRAVIS;
const execSync = require('child_process').execSync;
const path = require('path');
// Browser detection does not work properly on Travis.
const installedBrowsers = isTravis ? ['Firefox'] : detectBrowsers.getInstalledBrowsers()
  // XXX: В браузерах, в названии которых есть пробелы (например, Chrome Canary), необходимо удалить пробел.
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
  // Загрузчик основного модуля и приспособлений
  'test/harness/test.js',
  // Скрипт WebWorker.
  { pattern: 'test/harness/factories/workerfs_worker.js', included: false, watched: true },
  // Поддержка исходной карты
  { pattern: 'src/**/*', included: false, watched: false },
  { pattern: 'test/**/*', included: false, watched: false }
];

// Наличие библиотеки Dropbox динамически переключает тесты.
if (dropbox) {
  karmaFiles.unshift('node_modules/dropbox/dist/Dropbox-sdk.min.js');
  // Создать токен.
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
        // Остановите тесты после первого сбоя.
        // Наши тесты имеют некоторое глобальное состояние (например, количество ожидающих обратных вызовов). 
        // Как только они запутаются из-за неудачного теста, последующие тесты, скорее всего, не пройдут.
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
