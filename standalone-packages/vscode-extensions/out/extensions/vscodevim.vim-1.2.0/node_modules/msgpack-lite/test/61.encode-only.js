#!/usr/bin/env mocha -R spec

var assert = require("assert");

var encode = require("../lib/encode").encode;
var ExtBuffer = require("../lib/ext-buffer").ExtBuffer;
var TITLE = __filename.replace(/^.*\//, "");

describe(TITLE, function() {
  it("encode", function() {
    // int
    assert.deepEqual(toArray(encode(1)), [1]);

    // str
    assert.deepEqual(toArray(encode("a")), [161, 97]);

    // ExtBuffer
    var ext = new ExtBuffer(new Buffer([1]), 127);
    assert.ok(ext instanceof ExtBuffer);
    assert.deepEqual(toArray(encode(ext)), [212, 127, 1]);
  });
});

function toArray(buffer) {
  return Array.prototype.slice.call(buffer);
}