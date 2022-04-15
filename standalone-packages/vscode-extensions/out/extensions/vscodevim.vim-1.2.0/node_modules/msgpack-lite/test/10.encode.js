#!/usr/bin/env mocha -R spec

var assert = require("assert");
var msgpackJS = "../index";
var isBrowser = ("undefined" !== typeof window);
var msgpack = isBrowser && window.msgpack || require(msgpackJS);
var TITLE = __filename.replace(/^.*\//, "");

var HAS_UINT8ARRAY = ("undefined" !== typeof Uint8Array);

describe(TITLE, function() {
  describe("Buffer", function() {
    run_tests();
  });

  var describe_Uint8Array = HAS_UINT8ARRAY ? describe : describe.skip;
  describe_Uint8Array("Uint8Array", function() {
    run_tests({uint8array: true});
  });
});

function run_tests(codecopt) {
  var options;

  if (codecopt) it(JSON.stringify(codecopt), function() {
    var codec = msgpack.createCodec(codecopt);
    assert.ok(codec);
    options = {codec: codec};
  });

  // positive fixint -- 0x00 - 0x7f
  it("00-7f: positive fixint", function() {
    for (var i = 0; i <= 0x7F; i++) {
      assert.deepEqual(toArray(msgpack.encode(i, options)), [i]);
    }
  });

  // fixmap -- 0x80 - 0x8f
  it("80-8f: fixmap", function() {
    var map = {a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 10, k: 11, l: 12, m: 13, n: 14, o: 15, p: 16};
    var src = {};
    var exp = [0x80];
    Object.keys(map).forEach(function(key) {
      assert.deepEqual(toArray(msgpack.encode(src, options)), exp);
      src[key] = map[key];
      exp[0]++;
      exp.push(0xa1);
      exp.push(key.charCodeAt(0));
      exp.push(map[key]);
    });
  });

  // fixarray -- 0x90 - 0x9f
  it("90-9f: fixarray", function() {
    var array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    var src = [];
    var exp = [0x90];
    for (var i = 0; i < 16; i++) {
      assert.deepEqual(toArray(msgpack.encode(src, options)), exp);
      src.push(array[i]);
      exp[0]++;
      exp.push(array[i]);
    }
  });

  // fixstr -- 0xa0 - 0xbf
  it("a0-bf: fixstr", function() {
    assert.deepEqual(toArray(msgpack.encode("", options)), [0xa0]);

    var str = "0123456789abcdefghijklmnopqrstu";
    var exp = [0xa0];
    for (var i = 0; i < 32; i++) {
      var src = str.substr(0, i);
      assert.deepEqual(toArray(msgpack.encode(src, options)), exp);
      exp[0]++;
      exp.push(str.charCodeAt(i));
    }
  });

  // nil -- 0xc0
  it("c0: nil (null)", function() {
    assert.deepEqual(toArray(msgpack.encode(null, options)), [0xc0]);
  });
  it("c0: nil (undefined)", function() {
    assert.deepEqual(toArray(msgpack.encode(undefined, options)), [0xc0]);
  });
  it("c0: nil (Function)", function() {
    assert.deepEqual(toArray(msgpack.encode(NOP, options)), [0xc0]);
  });

  // false -- 0xc2
  // true -- 0xc3
  it("c2-c3: boolean", function() {
    assert.deepEqual(toArray(msgpack.encode(false, options)), [0xc2]);
    assert.deepEqual(toArray(msgpack.encode(true, options)), [0xc3]);
  });

  // bin 8 -- 0xc4
  // bin 16 -- 0xc5
  // bin 32 -- 0xc6
  it("c4-c6: bin 8/16/32", function() {
    this.timeout(30000);
    var bin;
    bin = Buffer(1);
    bin.fill(0);
    assert.deepEqual(toArray(msgpack.encode(bin, options)), concat([0xc4, 1], bin));

    bin = Buffer(256);
    bin.fill(0);
    assert.deepEqual(toArray(msgpack.encode(bin, options)), concat([0xc5, 1, 0], bin));

    bin = Buffer(65536);
    bin.fill(0);
    assert.deepEqual(toArray(msgpack.encode(bin, options)), concat([0xc6, 0, 1, 0, 0], bin));
  });

  // float 32 -- 0xca -- NOT SUPPORTED
  // float 64 -- 0xcb
  it("ca-cb: float 32/64", function() {
    assert.deepEqual(toArray(msgpack.encode(0.5, options)), [0xcb, 63, 224, 0, 0, 0, 0, 0, 0]);
  });

  // uint 8 -- 0xcc
  // uint 16 -- 0xcd
  // uint 32 -- 0xce
  // uint 64 -- 0xcf -- NOT SUPPORTED
  it("cc-cf: uint 8/16/32/64", function() {
    assert.deepEqual(toArray(msgpack.encode(0xFF, options)), [0xcc, 0xFF]);
    assert.deepEqual(toArray(msgpack.encode(0xFFFF, options)), [0xcd, 0xFF, 0xFF]);
    assert.deepEqual(toArray(msgpack.encode(0x7FFFFFFF, options)), [0xce, 0x7F, 0xFF, 0xFF, 0xFF]);
  });

  // int 8 -- 0xd0
  // int 16 -- 0xd1
  // int 32 -- 0xd2
  // int 64 -- 0xd3 -- NOT SUPPORTED
  it("d0-d3: int 8/16/32/64", function() {
    assert.deepEqual(toArray(msgpack.encode(-0x80, options)), [0xd0, 0x80]);
    assert.deepEqual(toArray(msgpack.encode(-0x8000, options)), [0xd1, 0x80, 0x00]);
    assert.deepEqual(toArray(msgpack.encode(-0x80000000, options)), [0xd2, 0x80, 0x00, 0x00, 0x00]);
  });

  // str 8 -- 0xd9
  // str 16 -- 0xda
  // str 32 -- 0xdb
  it("d9-db: str 8/16/32", function() {
    this.timeout(30000);
    var str, src = "a";
    for (var i = 0; i < 17; i++) src += src;

    str = src.substr(0, 0xFF);
    assert.deepEqual(toArray(msgpack.encode(str, options)), concat([0xd9, 0xFF], Buffer(str)));

    str = src.substr(0, 0x0100);
    assert.deepEqual(toArray(msgpack.encode(str, options)), concat([0xda, 0x01, 0x00], Buffer(str)));

    str = src.substr(0, 0xFFFF);
    assert.deepEqual(toArray(msgpack.encode(str, options)), concat([0xda, 0xFF, 0xFF], Buffer(str)));

    str = src.substr(0, 0x010000);
    assert.deepEqual(toArray(msgpack.encode(str, options)), concat([0xdb, 0x00, 0x01, 0x00, 0x00], Buffer(str)));
  });

  // array 16 -- 0xdc
  // array 32 -- 0xdd
  it("dc-dd: array 16/32", function() {
    this.timeout(30000);
    var i, exp;
    var src = new Array(256);
    for (i = 0; i < 256; i++) src[i] = i & 0x7F;
    exp = [0xdc, 0x01, 0x00].concat(src);
    assert.deepEqual(toArray(msgpack.encode(src, options)), exp);

    for (i = 0; i < 8; i++) src = src.concat(src);
    exp = [0xdd, 0x00, 0x01, 0x00, 0x00].concat(src);
    assert.deepEqual(toArray(msgpack.encode(src, options)), exp);
  });

  // map 16 -- 0xde
  // map 32 -- 0xdf
  it("de-df: map 16/32", function() {
    this.timeout(30000);
    var i, actual;
    var map = {};
    for (i = 0; i < 256; i++) map[i] = i;
    actual = msgpack.encode(map, options);
    // check only headers because order may vary
    assert.equal(actual[0], 0xde);
    assert.equal(actual[1], 1);
    assert.equal(actual[2], 0);

    for (i = 256; i < 65536; i++) map[i] = i;
    actual = msgpack.encode(map, options);
    assert.equal(actual[0], 0xdf);
    assert.equal(actual[1], 0);
    assert.equal(actual[2], 1);
    assert.equal(actual[3], 0);
    assert.equal(actual[4], 0);
  });

  // negative fixint -- 0xe0 - 0xff
  it("e0-ff: negative fixint", function() {
    for (var i = -32; i <= -1; i++) {
      assert.deepEqual(toArray(msgpack.encode(i, options)), [i & 0xFF]);
    }
  });
}

function toArray(buffer) {
  return Array.prototype.slice.call(buffer);
}

function concat(buf) {
  return Array.prototype.concat.apply([], Array.prototype.map.call(arguments, toArray));
}

function NOP() {
}