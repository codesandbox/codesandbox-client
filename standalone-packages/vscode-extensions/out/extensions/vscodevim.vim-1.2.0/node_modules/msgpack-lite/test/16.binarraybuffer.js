#!/usr/bin/env mocha -R spec

var assert = require("assert");
var msgpackJS = "../index";
var isBrowser = ("undefined" !== typeof window);
var msgpack = isBrowser && window.msgpack || require(msgpackJS);
var TITLE = __filename.replace(/^.*\//, "");
var HAS_UINT8ARRAY = ("undefined" !== typeof Uint8Array);

var TESTS = [0, 1, 31, 32, 255, 256, 65535, 65536];

function toArray(array) {
  if (array instanceof ArrayBuffer) array = new Uint8Array(array);
  return Array.prototype.slice.call(array);
}

// run this test when Uint8Array is available
var describeSkip = HAS_UINT8ARRAY ? describe : describe.skip;

describeSkip(TITLE, function() {
  var options;

  it("binarraybuffer (decode)", function() {
    var decoded;
    options = {codec: msgpack.createCodec({binarraybuffer: true, preset: true})};

    // bin (Buffer)
    decoded = msgpack.decode(new Buffer([0xc4, 2, 65, 66]), options);
    assert.ok(decoded instanceof ArrayBuffer);
    assert.ok(!Buffer.isBuffer(decoded));
    assert.deepEqual(toArray(decoded), [65, 66]);

    // bin (Uint8Array)
    decoded = msgpack.decode(new Uint8Array([0xc4, 2, 97, 98]), options);
    assert.ok(decoded instanceof ArrayBuffer);
    assert.ok(!Buffer.isBuffer(decoded));
    assert.deepEqual(toArray(decoded), [97, 98]);

    // bin (Array)
    decoded = msgpack.decode([0xc4, 2, 65, 66], options);
    assert.ok(decoded instanceof ArrayBuffer);
    assert.ok(!Buffer.isBuffer(decoded));
    assert.deepEqual(toArray(decoded), [65, 66]);
  });

  it("binarraybuffer (encode)", function() {
    // bin (ArrayBuffer)
    var encoded = msgpack.encode(new Uint8Array([65, 66]).buffer, options);
    assert.deepEqual(toArray(encoded), [0xc4, 2, 65, 66]);
  });

  it("binarraybuffer (large)", function() {
    TESTS.forEach(test);

    function test(length) {
      var source = new Uint8Array(length);
      for (var i = 0; i < length; i++) {
        source[i] = 65; // "A"
      }

      var encoded = msgpack.encode(source.buffer, options);
      assert.ok(encoded.length);

      var decoded = msgpack.decode(encoded, options);
      assert.ok(decoded instanceof ArrayBuffer);
      assert.ok(!Buffer.isBuffer(decoded));
      decoded = new Uint8Array(decoded);
      assert.equal(decoded.length, length);
      if (length) assert.equal(decoded[0], 65);
    }
  });

  // addExtPacker() and getExtPacker() methods need a valid constructor name.
  // IE10 and iOS7 Safari may give another constructor name than Buffer.
  // At those cases, below will be encoded as Uint8Array: [0xd5, 0x12, 97, 98]
  var b = new Buffer(1);
  var c = b.constructor;
  var d = (c && c.name === "Buffer") ? it : it.skip;
  d("encode Buffer ext format 0x1B", function() {
    // fixext 2 (Buffer)
    var encoded = msgpack.encode(new Buffer([97, 98]), options);
    assert.deepEqual(toArray(encoded), [0xd5, 0x1b, 97, 98]);
  });

  it("decode Buffer ext format 0x1B", function() {
    // fixext 2 (Buffer)
    var decoded = msgpack.decode([0xd5, 0x1b, 65, 66], options);
    assert.ok(Buffer.isBuffer(decoded));
    assert.deepEqual(toArray(decoded), [65, 66]);
  });
});
