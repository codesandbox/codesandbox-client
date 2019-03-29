#!/usr/bin/env mocha -R spec

var assert = require("assert");
var msgpackJS = "../index";
var isBrowser = ("undefined" !== typeof window);
var msgpack = isBrowser && window.msgpack || require(msgpackJS);
var TITLE = __filename.replace(/^.*\//, "");

var HAS_UINT8ARRAY = ("undefined" !== typeof Uint8Array);

describe(TITLE, function() {
  it("createCodec()", function() {
    var codec = msgpack.createCodec();
    var options = {codec: codec};
    assert.ok(codec);

    // this codec does not have preset codec
    for (var i = 0; i < 256; i++) {
      test(i);
    }

    function test(type) {
      // fixext 1 -- 0xd4
      var source = new Buffer([0xd4, type, type]);
      var decoded = msgpack.decode(source, options);
      assert.equal(decoded.type, type);
      assert.equal(decoded.buffer.length, 1);
      var encoded = msgpack.encode(decoded, options);
      assert.deepEqual(toArray(encoded), toArray(source));
    }
  });

  it("addExtPacker()", function() {
    var codec = msgpack.createCodec();
    codec.addExtPacker(0, MyClass, myClassPacker);
    codec.addExtUnpacker(0, myClassUnpacker);
    var options = {codec: codec};
    [0, 1, 127, 255].forEach(test);

    function test(type) {
      var source = new MyClass(type);
      var encoded = msgpack.encode(source, options);
      var decoded = msgpack.decode(encoded, options);
      assert.ok(decoded instanceof MyClass);
      assert.equal(decoded.value, type);
    }
  });

  // The safe mode works as same as the default mode. It'd be hard for test it.
  it("createCodec({safe: true})", function() {
    var options = {codec: msgpack.createCodec({safe: true})};
    var source = 1;
    var encoded = msgpack.encode(source, options);
    var decoded = msgpack.decode(encoded, options);
    assert.equal(decoded, source);
  });

  it("createCodec({preset: true})", function() {
    var options1 = {codec: msgpack.createCodec({preset: true})};
    var options2 = {codec: msgpack.createCodec({preset: false})};

    var source = new Date();
    var encoded = msgpack.encode(source, options1);
    assert.equal(encoded[0], 0xC7, "preset ext format failure. (128 means map format)"); // ext 8
    assert.equal(encoded[1], 0x09); // 1+8
    assert.equal(encoded[2], 0x0D); // Date

    // decode as Boolean instance
    var decoded = msgpack.decode(encoded, options1);
    assert.equal(decoded - 0, source - 0);
    assert.ok(decoded instanceof Date);

    // decode as ExtBuffer
    decoded = msgpack.decode(encoded, options2);
    assert.ok(!(decoded instanceof Date));
    assert.equal(decoded.type, 0x0D);
  });
});

function MyClass(value) {
  this.value = value & 0xFF;
}

function myClassPacker(obj) {
  return new Buffer([obj.value]);
}

function myClassUnpacker(buffer) {
  return new MyClass(buffer[0]);
}

function toArray(array) {
  if (HAS_UINT8ARRAY && array instanceof ArrayBuffer) array = new Uint8Array(array);
  return Array.prototype.slice.call(array);
}
