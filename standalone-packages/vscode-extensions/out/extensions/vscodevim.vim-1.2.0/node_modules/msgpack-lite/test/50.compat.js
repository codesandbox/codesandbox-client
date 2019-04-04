#!/usr/bin/env mocha -R spec

var assert = require("assert");

var msgpack = require("../index");
var TITLE = __filename.replace(/^.*\//, "");

var data = require("./example.json");

describe(TITLE, function() {
  test("msgpack", function(they) {
    assert.deepEqual(they.unpack(msgpack.encode(data)), data);
    assert.deepEqual(msgpack.decode(Buffer(they.pack(data))), data);
  });

  test("msgpack-js", function(they) {
    assert.deepEqual(they.decode(msgpack.encode(data)), data);
    assert.deepEqual(msgpack.decode(Buffer(they.encode(data))), data);
  });

  test("msgpack-js-v5", function(they) {
    assert.deepEqual(they.decode(msgpack.encode(data)), data);
    assert.deepEqual(msgpack.decode(Buffer(they.encode(data))), data);
  });

  test("msgpack5", function(they) {
    they = they();
    assert.deepEqual(they.decode(msgpack.encode(data)), data);
    assert.deepEqual(msgpack.decode(Buffer(they.encode(data))), data);
  });

  test("notepack", function(they) {
    assert.deepEqual(they.decode(msgpack.encode(data)), data);
    assert.deepEqual(msgpack.decode(Buffer(they.encode(data))), data);
  });

  test("msgpack-unpack", function(they) {
    assert.deepEqual(they(msgpack.encode(data)), data);
  });

  test("msgpack.codec", function(they) {
    they = they.msgpack;
    assert.deepEqual(they.unpack(msgpack.encode(data)), data);
    assert.deepEqual(msgpack.decode(Buffer(they.pack(data))), data);
  });
});

function test(name, func) {
  var they;
  var method = it;
  try {
    they = require(name);
  } catch (e) {
    method = it.skip;
    name += ": " + e;
  }
  method(name, func.bind(null, they));
}
