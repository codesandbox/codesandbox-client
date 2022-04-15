#!/usr/bin/env mocha -R spec

/*jshint -W053 */

var assert = require("assert");
var msgpackJS = "../index";
var isBrowser = ("undefined" !== typeof window);
var msgpack = isBrowser && window.msgpack || require(msgpackJS);
var TITLE = __filename.replace(/^.*\//, "");

var HAS_UINT8ARRAY = ("undefined" !== typeof Uint8Array);

describe(TITLE, function() {
  it("ExtBuffer (0x00)", function() {
    testExtBuffer(0);
  });

  it("ExtBuffer (0x20-0xFF)", function() {
    for (var i = 32; i < 256; i++) {
      testExtBuffer(i);
    }
  });

  it("ExtBuffer Array (0x20-0xFF)", function() {
    for (var i = 32; i < 256; i++) {
      testExtBufferArray(i);
    }
  });

  function testExtBuffer(type) {
    // fixext 8 -- 0xd7
    var header = new Buffer([0xd7, type]);
    var content = new Buffer(8);
    for (var i = 0; i < 8; i++) {
      content[i] = (type + i) & 0x7F;
    }
    var source = Buffer.concat([header, content]);
    var decoded = msgpack.decode(source);
    assert.equal(decoded.type, type);
    assert.equal(decoded.buffer.length, content.length);
    assert.deepEqual(toArray(decoded.buffer), toArray(content));
    var encoded = msgpack.encode(decoded);
    assert.deepEqual(toArray(encoded), toArray(source));
  }

  // Unpack and re-pack an array of extension types.
  // Tests, among other things, that the right number of bytes are
  // consumed with each ext type read.
  function testExtBufferArray(type) {
    function content(j) {
        var x = j * type;
        return Buffer([x & 0x7F, (x + 1) & 0x7F]);
    }
    // fixarray len 10
    var arrayHeader = new Buffer([0x9a]);
    var fullBuffer = arrayHeader;
    for (var j = 0; j < 10; j++) {
      // fixext 2 -- 0xd5
      var header = new Buffer([0xd5, type]);
      fullBuffer = Buffer.concat([fullBuffer, header, content(j)]);
    }
    var decoded = msgpack.decode(fullBuffer);
    assert.equal(true, decoded instanceof Array);
    assert.equal(decoded.length, 10);
    for (j = 0; j < 10; j++) {
      assert.equal(decoded[j].type, type);
      assert.equal(decoded[j].buffer.length, 2);
      assert.deepEqual(decoded[j].buffer, content(j));
    }
    var encoded = msgpack.encode(decoded);
    assert.deepEqual(encoded, fullBuffer);
  }

});

function toArray(array) {
  if (HAS_UINT8ARRAY && array instanceof ArrayBuffer) array = new Uint8Array(array);
  return Array.prototype.slice.call(array);
}
