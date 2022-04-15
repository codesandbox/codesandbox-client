#!/usr/bin/env mocha -R spec

var assert = require("assert");
var Stream = require("stream");
var concat = require("concat-stream");

var msgpack = require("../index");
var TITLE = __filename.replace(/^.*\//, "");
var example = require("./example.json");

var src = [
  ["foo"],
  ["bar"],
  ["baz"]
];

var encoded = [
  msgpack.encode(src[0]),
  msgpack.encode(src[1]),
  msgpack.encode(src[2])
];

var encodeall = Buffer.concat(encoded);

describe(TITLE, function() {

  it("msgpack.createEncodeStream()", function(done) {
    var encoder = msgpack.createEncodeStream();
    encoder.pipe(concat(onEnd));
    encoder.write(src[0]);
    encoder.write(src[1]);
    encoder.write(src[2]);
    encoder.end();

    function onEnd(data) {
      assert.deepEqual(data, encodeall);
      done();
    }
  });

  it("msgpack.createDecodeStream()", function(done) {
    var count = 0;
    var decoder = msgpack.createDecodeStream();

    decoder.on("data", onData);
    decoder.write(encoded[0]);
    decoder.write(encoded[1]);
    decoder.write(encoded[2]);
    decoder.end();

    function onData(data) {
      assert.deepEqual(data, src[count++]);
      if (count === 3) done();
    }
  });

  it("pipe(encoder).pipe(decoder)", function(done) {
    var count = 0;
    var inputStream = new Stream.PassThrough({objectMode: true});
    var encoder = msgpack.createEncodeStream();
    var passThrough = new Stream.PassThrough();
    var decoder = msgpack.createDecodeStream();
    var outputStream = new Stream.PassThrough({objectMode: true});

    inputStream.pipe(encoder).pipe(passThrough).pipe(decoder).pipe(outputStream);
    outputStream.on("data", onData);
    inputStream.write(src[0]);
    inputStream.write(src[1]);
    inputStream.write(src[2]);
    inputStream.end();

    function onData(data) {
      assert.deepEqual(data, src[count++]);
      if (count === 3) done();
    }
  });

  it("pipe(decoder).pipe(encoder)", function(done) {
    var inputStream = new Stream.PassThrough();
    var decoder = msgpack.createDecodeStream();
    var passThrough = new Stream.PassThrough({objectMode: true});
    var encoder = msgpack.createEncodeStream();

    inputStream.pipe(decoder).pipe(passThrough).pipe(encoder).pipe(concat(onEnd));
    inputStream.write(encoded[0]);
    inputStream.write(encoded[1]);
    inputStream.write(encoded[2]);
    inputStream.end();

    function onEnd(data) {
      assert.deepEqual(data, encodeall);
      done();
    }
  });

  it("write()", function(done) {
    var count = 0;
    var buf = msgpack.encode(example);
    var decoder = msgpack.createDecodeStream();
    decoder.on("data", onData);

    for (var i = 0; i < 3; i++) {
      Array.prototype.forEach.call(buf, each);
    }

    // decode stream should be closed
    decoder.end();

    // write a single byte into the decode stream
    function each(x) {
      decoder.write(Buffer([x]));
    }

    function onData(data) {
      assert.deepEqual(data, example);
      if (++count === 3) done();
    }
  });
});
