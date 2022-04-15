#!/usr/bin/env mocha -R spec

var assert = require("assert");
var msgpackJS = "../index";
var isBrowser = ("undefined" !== typeof window);
var msgpack = isBrowser && window.msgpack || require(msgpackJS);
var TITLE = __filename.replace(/^.*\//, "");

describe(TITLE, function() {

  var skip = ("undefined" !== typeof Symbol) ? it : it.skip;
  skip("Symbol", function() {
    assert.deepEqual(toArray(msgpack.encode(Symbol("foo"))), [0xc0]);
  });

});

function toArray(buffer) {
  return Array.prototype.slice.call(buffer);
}
