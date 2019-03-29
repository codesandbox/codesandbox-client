#!/usr/bin/env mocha -R spec

var assert = require("assert");
var msgpackJS = "../index";
var isBrowser = ("undefined" !== typeof window);
var msgpack = isBrowser && window.msgpack || require(msgpackJS);
var TITLE = __filename.replace(/^.*\//, "");

var TESTS = [0, 1, 31, 32, 255, 256, 65535, 65536];

function toArray(array) {
  return Array.prototype.slice.call(array);
}

describe(TITLE, function() {
  var options;

  it("useraw (decode)", function() {
    options = {codec: msgpack.createCodec({useraw: true})};

    // raw
    assert.deepEqual(toArray(msgpack.decode(new Buffer([0xa1, 65]), options)), [65]);

    // str
    assert.equal(msgpack.decode(new Buffer([0xa1, 65])), "A");
  });

  it("useraw (encode)", function() {
    // raw (String)
    assert.deepEqual(toArray(msgpack.encode("A", options)), [0xa1, 65]);

    // raw (Buffer)
    assert.deepEqual(toArray(msgpack.encode(new Buffer([65]), options)), [0xa1, 65]);

    // str
    assert.deepEqual(toArray(msgpack.encode("A")), [0xa1, 65]);
  });

  it("useraw (String)", function() {
    TESTS.forEach(test);

    function test(length) {
      var source = "";
      for (var i = 0; i < length; i++) {
        source += "a";
      }

      // encode as raw
      var encoded = msgpack.encode(source, options);
      assert.ok(encoded.length);

      // decode as raw (Buffer)
      var buffer = msgpack.decode(encoded, options);
      assert.ok(Buffer.isBuffer(buffer));
      assert.equal(buffer.length, length);
      if (length) assert.equal(buffer[0], 97);

      // decode as str (String)
      var string = msgpack.decode(encoded);
      assert.equal(typeof string, "string");
      assert.equal(string.length, length);
      assert.equal(string, source);
    }
  });

  it("useraw (Buffer)", function() {
    TESTS.forEach(test);

    function test(length) {
      var source = new Buffer(length);
      for (var i = 0; i < length; i++) {
        source[i] = 65; // "A"
      }

      // encode as raw
      var encoded = msgpack.encode(source, options);
      assert.ok(encoded.length);

      // decode as raw (Buffer)
      var buffer = msgpack.decode(encoded, options);
      assert.ok(Buffer.isBuffer(buffer));
      assert.equal(buffer.length, length);
      if (length) assert.equal(buffer[0], 65);

      // decode as str (String)
      var string = msgpack.decode(encoded);
      assert.equal(typeof string, "string");
      assert.equal(string.length, length);
      if (length) assert.equal(string[0], "A");
    }
  });
});
