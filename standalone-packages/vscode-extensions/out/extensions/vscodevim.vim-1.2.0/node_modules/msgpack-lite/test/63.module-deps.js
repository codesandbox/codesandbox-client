#!/usr/bin/env mocha -R spec

var TITLE = __filename.replace(/^.*\//, "");

describe(TITLE, function() {
  var mdeps;
  var itSkip = it;

  try {
    mdeps = require("browserify/node_modules/module-deps");
  } catch (e) {
    itSkip = it.skip;
  }

  // index.js should not require stream modules

  itSkip("index.js dependencies", function(next) {
    var opt = {file: __dirname + "/../index.js"};
    var list = [];
    mdeps().on("data", onData).on("end", onEnd).end(opt);

    function onData(data) {
      list.push(data.file);
    }

    function onEnd() {
      var hit = list.filter(check)[0];
      next(hit && new Error(hit));
    }

    function check(value) {
      return value.match(/stream/) && !value.match(/node_modules/);
    }
  });

  // decode.js should not require encode|write modules

  itSkip("decode.js dependencies", function(next) {
    var opt = {file: __dirname + "/../lib/decode.js"};
    var list = [];
    mdeps().on("data", onData).on("end", onEnd).end(opt);

    function onData(data) {
      list.push(data.file);
    }

    function onEnd() {
      var hit = list.filter(check)[0];
      next(hit && new Error(hit));
    }

    function check(value) {
      return value.match(/encode|write/) && !value.match(/node_modules/);
    }
  });

  // encode.js should not require decode|read modules

  itSkip("encode.js dependencies", function(next) {
    var opt = {file: __dirname + "/../lib/encode.js"};
    var list = [];
    mdeps().on("data", onData).on("end", onEnd).end(opt);

    function onData(data) {
      list.push(data.file);
    }

    function onEnd() {
      var hit = list.filter(check)[0];
      next(hit && new Error(hit));
    }

    function check(value) {
      return value.match(/decode|read/) && !value.match(/node_modules/);
    }
  });
});
