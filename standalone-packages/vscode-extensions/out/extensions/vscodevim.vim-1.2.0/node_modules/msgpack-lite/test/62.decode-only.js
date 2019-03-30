#!/usr/bin/env mocha -R spec

var assert = require("assert");

var decode = require("../lib/decode").decode;
var ExtBuffer = require("../lib/ext-buffer").ExtBuffer;
var TITLE = __filename.replace(/^.*\//, "");

describe(TITLE, function() {
  it("decode", function() {
    // int
    assert.equal(decode([1]), 1);

    // str
    assert.equal(decode([161, 97]), "a");

    // ExtBuffer
    var ext = decode(new Buffer([212, 127, 1]));
    assert.ok(ext instanceof ExtBuffer);
    assert.equal(ext.buffer[0], 1);
    assert.equal(ext.type, 127);
  });
});
