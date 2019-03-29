#!/usr/bin/env mocha -R spec

var assert = require("assert");
var Bufferish = require("../lib/bufferish");
var msgpackJS = "../index";
var isBrowser = ("undefined" !== typeof window);
var msgpack = isBrowser && window.msgpack || require(msgpackJS);
var TITLE = __filename.replace(/^.*\//, "");

var HAS_UINT8ARRAY = ("undefined" !== typeof Uint8Array);

describe(TITLE, function() {
  it("{}", function() {
    var encoded = msgpack.encode(1);
    assert.ok(Buffer.isBuffer(encoded));
    // assert.ok(!ArrayBuffer.isView(encoded));
  });

  var it_Uint8Array = HAS_UINT8ARRAY ? it : it.skip;
  var codecopt = {uint8array: true};

  it_Uint8Array(JSON.stringify(codecopt), function() {
    var codec = msgpack.createCodec(codecopt);
    assert.ok(codec);
    var options = {codec: codec};

    // small data
    var encoded = msgpack.encode(1, options);
    if (ArrayBuffer.isView) assert.ok(ArrayBuffer.isView(encoded));
    assert.ok(Bufferish.isView(encoded));
    assert.ok(!Buffer.isBuffer(encoded));

    // bigger data
    var big = new Buffer(8192); // 8KB
    big[big.length - 1] = 99;
    var source = [big, big, big, big, big, big, big, big]; // 64KB
    encoded = msgpack.encode(source, options);
    if (ArrayBuffer.isView) assert.ok(ArrayBuffer.isView(encoded));
    assert.ok(Bufferish.isView(encoded));
    assert.ok(!Buffer.isBuffer(encoded));
    assert.equal(encoded[encoded.length - 1], 99); // last byte
  });
});
