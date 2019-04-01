#!/usr/bin/env mocha -R spec

/*jshint -W053 */

var assert = require("assert");
var msgpackJS = "../index";
var isBrowser = ("undefined" !== typeof window);
var msgpack = isBrowser && window.msgpack || require(msgpackJS);
var TITLE = __filename.replace(/^.*\//, "");

var TYPED_ARRAY = {
  "Int8Array": [0, 1, 2, 126, 127, -128, -127, -2, -1],
  "Uint8Array": [0, 1, 2, 253, 254, 255],
  "Uint8ClampedArray": [0, 1, 2, 253, 254, 255],
  "Int16Array": [0, 1, 2, 32766, 32767, -32768, -32767, -2, -1],
  "Uint16Array": [0, 1, 2, 65534, 65535],
  "Int32Array": [0, 1, 2, 2147483646, 2147483647],
  "Uint32Array": [0, 1, 2, 4294967294, 4294967295],
  "Float32Array": [0, 1, 0.5, 0.25, -0.25, -0.5, -1],
  "Float64Array": [0, 1, 0.5, 0.25, -0.25, -0.5, -1]
};

var ARRAY_BUFFER = {
  "ArrayBuffer": [0, 1, 2, 253, 254, 255]
};

var DATA_VIEW = {
  "DataView": [0, 1, 2, 253, 254, 255]
};

describe(TITLE, function() {
  Object.keys(TYPED_ARRAY).forEach(function(name) {
    var Class = global[name];
    var skip = Class ? it : it.skip;
    skip(name, function() {
      var sample = TYPED_ARRAY[name];
      var source = new Class(sample);
      assert.ok(source instanceof Class);
      assert.equal(source.length, sample.length);
      var encoded = msgpack.encode(source);
      var decoded = msgpack.decode(encoded);
      var actual = Array.prototype.slice.call(decoded);
      assert.deepEqual(actual, sample);
      assert.ok(decoded instanceof Class);
    });
  });

  Object.keys(ARRAY_BUFFER).forEach(function(name) {
    var Class = global[name];
    var skip = Class ? it : it.skip;
    skip(name, function() {
      var sample = ARRAY_BUFFER[name];
      var source = (new Uint8Array(sample)).buffer;
      assert.ok(source instanceof Class);
      assert.equal(source.byteLength, sample.length);
      var encoded = msgpack.encode(source);
      var decoded = msgpack.decode(encoded);
      var actual = Array.prototype.slice.call(new Uint8Array(decoded));
      assert.deepEqual(actual, sample);
      assert.ok(decoded instanceof Class);
    });
  });

  Object.keys(DATA_VIEW).forEach(function(name) {
    var Class = global[name];
    var skip = Class ? it : it.skip;
    skip(name, function() {
      var sample = DATA_VIEW[name];
      var source = new DataView((new Uint8Array(sample)).buffer);
      assert.ok(source instanceof Class);
      assert.equal(source.byteLength, sample.length);
      var encoded = msgpack.encode(source);
      var decoded = msgpack.decode(encoded);
      var actual = Array.prototype.slice.call(new Uint8Array(decoded.buffer));
      assert.deepEqual(actual, sample);
      assert.ok(decoded instanceof Class);
    });
  });
});
