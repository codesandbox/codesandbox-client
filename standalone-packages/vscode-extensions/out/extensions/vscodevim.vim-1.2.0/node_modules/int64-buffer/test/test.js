// #!/usr/bin/env mocha -R spec

assert.equal = equal;
assert.ok = assert;

var exported = ("undefined" !== typeof require) ? require("../int64-buffer") : window;
var Uint64LE = exported.Uint64LE;
var Int64LE = exported.Int64LE;
var Uint64BE = exported.Uint64BE;
var Int64BE = exported.Int64BE;
var reduce = Array.prototype.reduce;
var forEach = Array.prototype.forEach;
var BUFFER = ("undefined" !== typeof Buffer) && Buffer;
var ARRAYBUFFER = ("undefined" !== typeof ArrayBuffer) && ArrayBuffer;
var UINT8ARRAY = ("undefined" !== typeof Uint8Array) && Uint8Array;
var STORAGES = {array: Array, buffer: BUFFER, uint8array: UINT8ARRAY, arraybuffer: ARRAYBUFFER, arraylike: ArrayLike};
var itBuffer = BUFFER ? it : it.skip;
var itArrayBuffer = ARRAYBUFFER ? it : it.skip;

allTests("Uint64BE", "Int64BE");
allTests("Uint64LE", "Int64LE");
miscTests();

function allTests(uint64Name, int64Name) {
  var LE = uint64Name.indexOf("LE") > -1;

  var ZERO = [0, 0, 0, 0, 0, 0, 0, 0];
  var POS1 = [0, 0, 0, 0, 0, 0, 0, 1];
  var NEG1 = [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF];
  var POSB = [0x12, 0x34, 0x56, 0x78, 0x9A, 0xBC, 0xDE, 0xF0];
  var NEGB = [0xFE, 0xDC, 0xBA, 0x98, 0x76, 0x54, 0x32, 0x10];
  var POS7 = [0x7F, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]; // INT64_MAX
  var NEG7 = [0x80, 0, 0, 0, 0, 0, 0, 1]; // -INT64_MAX
  var NEG8 = [0x80, 0, 0, 0, 0, 0, 0, 0]; // INT64_MIN
  var H0LF = [0, 0, 0, 0, 0xFF, 0xFF, 0xFF, 0xFF];
  var H1L0 = [0, 0, 0, 1, 0, 0, 0, 0];
  var H1LF = [0, 0, 0, 1, 0xFF, 0xFF, 0xFF, 0xFF];
  var HFL0 = [0xFF, 0xFF, 0xFF, 0xFF, 0, 0, 0, 0];
  var SAMPLES = [ZERO, POS1, NEG1, POSB, NEGB, POS7, NEG7, NEG8, H0LF, H1L0, H1LF, HFL0];
  var INPUT0 = [0, 0.5, "0", "-0", NaN, Infinity, null, "X"];
  var INPUT1 = [1, 1.5, "1", "1.5", true];
  var FLOAT_MAX = Math.pow(2, 53);

  // BE -> LE
  SAMPLES.forEach(function(array) {
    if (LE) array.reverse();
  });

  uint64BasicTests();
  int64BasicTests();
  uintMoreTests();
  intMoreTests();
  bufferTest(uint64Name);
  bufferTest(int64Name);

  function uint64BasicTests() {
    var Uint64Class = exported[uint64Name];
    describe(uint64Name, function() {
      it(uint64Name + "()", function() {
        assert.equal(Uint64Class() - 0, 0);
      });

      it(uint64Name + "(number)", function() {
        assert.equal(Uint64Class(123456789) - 0, 123456789);
      });

      it(uint64Name + "(high,low)", function() {
        assert.equal(Uint64Class(0x12345678, 0x90abcdef).toString(16), "1234567890abcdef");
        assert.equal(Uint64Class(0x90abcdef, 0x12345678).toString(16), "90abcdef12345678");
      });

      it(uint64Name + "(string,raddix)", function() {
        assert.equal(Uint64Class("1234567890123456").toString(), "1234567890123456");
        assert.equal(Uint64Class("1234567890123456", 10).toString(10), "1234567890123456");
        assert.equal(Uint64Class("1234567890abcdef", 16).toString(16), "1234567890abcdef");
      });

      it(uint64Name + "().toNumber()", function() {
        var val = Uint64Class(1).toNumber();
        assert.ok("number" === typeof val);
        assert.equal(val, 1);
      });

      it(uint64Name + "().toString()", function() {
        var val = Uint64Class(1).toString();
        assert.ok("string" === typeof val);
        assert.equal(val, "1");
      });

      it(uint64Name + "().toString(10)", function() {
        var col = 1;
        var val = 1;
        var str = "1";
        while (val < FLOAT_MAX) {
          assert.equal(Uint64Class(val).toString(10), str);
          col = (col + 1) % 10;
          val = val * 10 + col;
          str += col;
        }
      });

      it(uint64Name + "().toString(16)", function() {
        var val = 1;
        var col = 1;
        var str = "1";
        while (val < FLOAT_MAX) {
          assert.equal(Uint64Class(val).toString(16), str);
          col = (col + 1) % 10;
          val = val * 16 + col;
          str += col;
        }
      });

      it(uint64Name + "().toJSON()", function() {
        SAMPLES.forEach(function(array) {
          var c = Uint64Class(array);
          assert.equal(c.toJSON(), c.toString(10));
        });
      });

      it(uint64Name + "().toArray()", function() {
        var val = Uint64Class(1).toArray();
        assert.ok(val instanceof Array);
        assert.equal(toHex(val), toHex(POS1));
      });

      itBuffer(uint64Name + "().toBuffer()", function() {
        var val = Uint64Class(1).toBuffer();
        assert.ok(BUFFER.isBuffer(val));
        assert.equal(toHex(val), toHex(POS1));
      });

      itArrayBuffer(uint64Name + "().toArrayBuffer()", function() {
        var val = Uint64Class(1).toArrayBuffer();
        assert.ok(val instanceof ArrayBuffer);
        assert.equal(val.byteLength, 8);
        assert.equal(toHex(new Uint8Array(val)), toHex(POS1));
      });
    });
  }

  function int64BasicTests() {
    var Int64Class = exported[int64Name];

    describe(int64Name, function() {
      it(int64Name + "()", function() {
        assert.equal(Int64Class() - 0, 0);
      });

      it(int64Name + "(number)", function() {
        assert.equal(Int64Class(-123456789) - 0, -123456789);
      });

      it(int64Name + "(high,low)", function() {
        assert.equal(Int64Class(0x12345678, 0x90abcdef).toString(16), "1234567890abcdef");
        assert.equal(Int64Class(0xFFFFFFFF, 0xFFFFFFFF) - 0, -1);
      });

      it(int64Name + "(string,raddix)", function() {
        assert.equal(Int64Class("1234567890123456").toString(), "1234567890123456");
        assert.equal(Int64Class("1234567890123456", 10).toString(10), "1234567890123456");
        assert.equal(Int64Class("1234567890abcdef", 16).toString(16), "1234567890abcdef");
      });

      it(int64Name + "(array,offset)", function() {
        var buf = [].concat(NEG1, NEG1);
        var val = Int64Class(buf, 4, -2);
        assert.equal(val.toString(16), "-2");
        assert.equal(val.toNumber(), -2);
      });

      it(int64Name + "().toNumber()", function() {
        var val = Int64Class(-1).toNumber();
        assert.ok("number" === typeof val);
        assert.equal(val, -1);
      });

      it(int64Name + "().toString()", function() {
        var val = Int64Class(-1).toString();
        assert.ok("string" === typeof val);
        assert.equal(val, "-1");
      });

      it(int64Name + "().toString(10)", function() {
        var col = 1;
        var val = -1;
        var str = "-1";
        while (val > FLOAT_MAX) {
          assert.equal(Int64Class(val).toString(10), str);
          col = (col + 1) % 10;
          val = val * 10 - col;
          str += col;
        }
      });

      it(int64Name + "().toString(16)", function() {
        var col = 1;
        var val = -1;
        var str = "-1";
        while (val > FLOAT_MAX) {
          assert.equal(Int64Class(val).toString(16), str);
          col = (col + 1) % 10;
          val = val * 16 - col;
          str += col;
        }
      });

      it(int64Name + "().toJSON()", function() {
        SAMPLES.forEach(function(array) {
          var c = Int64Class(array);
          assert.equal(c.toJSON(), c.toString(10));
        });
      });

      it(int64Name + "().toArray()", function() {
        var val = Int64Class(-1).toArray();
        assert.ok(val instanceof Array);
        assert.equal(toHex(val), toHex(NEG1));

        val = Int64Class(val, 0, 1).toArray();
        assert.ok(val instanceof Array);
        assert.equal(toHex(val), toHex(POS1));
      });

      itBuffer(int64Name + "().toBuffer()", function() {
        var val = Int64Class(-1).toBuffer();
        assert.ok(BUFFER.isBuffer(val));
        assert.equal(toHex(val), toHex(NEG1));

        val = Int64Class(val, 0, 1).toBuffer();
        assert.ok(BUFFER.isBuffer(val));
        assert.equal(toHex(val), toHex(POS1));
      });

      itArrayBuffer(int64Name + "().toArrayBuffer()", function() {
        var val = Int64Class(-1).toArrayBuffer();
        assert.ok(val instanceof ArrayBuffer);
        assert.equal(val.byteLength, 8);
        assert.equal(toHex(new Uint8Array(val)), toHex(NEG1));

        val = Int64Class(val, 0, 1).toArrayBuffer();
        assert.ok(val instanceof ArrayBuffer);
        assert.equal(val.byteLength, 8);
        assert.equal(toHex(new Uint8Array(val)), toHex(POS1));
      });
    });
  }

  function bufferTest(className) {
    describe(className, function() {
      Object.keys(STORAGES).forEach(function(storageName) {
        storageTests(className, storageName);
      });

      Object.keys(STORAGES).forEach(function(storageName) {
        if (storageName === "array") return;
        storageSourceTests(className, storageName);
      });
    });
  }

  function storageTests(className, storageName) {
    var Int64Class = exported[className];
    var StorageClass = STORAGES[storageName];
    var itSkip = StorageClass ? it : it.skip;
    var highpos = LE ? 15 : 8;
    var lowpos = LE ? 8 : 15;

    itSkip(className + "(" + storageName + ",offset)", function() {
      var buffer = new StorageClass(24);
      var raw = buffer;
      if (isArrayBuffer(buffer)) buffer = (raw = new Uint8Array(buffer)).buffer;
      for (var i = 0; i < 24; i++) {
        raw[i] = i;
      }
      var val = new Int64Class(buffer, 8);
      var higher = LE ? 0x0f0e0d0c0b : 0x08090A0B0C;
      assert.equal(Math.round(val.toNumber() / 0x1000000), higher); // check only higher 48bits
      var hex = LE ? "f0e0d0c0b0a0908" : "8090a0b0c0d0e0f";
      assert.equal(val.toString(16), hex);
      var out = val.toArray();
      assert.equal(toHex(out), "08090a0b0c0d0e0f");
      assert.ok(out instanceof Array);
      if (BUFFER) {
        out = val.toBuffer();
        assert.equal(toHex(out), "08090a0b0c0d0e0f");
        assert.ok(BUFFER.isBuffer(out));
      }
      if (UINT8ARRAY) {
        out = val.toArrayBuffer();
        assert.equal(toHex(new Uint8Array(out)), "08090a0b0c0d0e0f");
        assert.ok(out instanceof ArrayBuffer);
      }
    });

    itSkip(className + "(" + storageName + ",offset,number)", function() {
      var buffer = new StorageClass(24);
      var val = new Int64Class(buffer, 8, 1234567890);
      assert.equal(val.toNumber(), 1234567890);
      assert.equal(val.toString(), "1234567890");
      assert.equal(val.toJSON(), "1234567890");
      if (isArrayBuffer(buffer)) buffer = new Uint8Array(buffer);
      assert.equal(buffer[highpos], 0);
      assert.equal(buffer[lowpos], 1234567890 & 255);
    });

    itSkip(className + "(" + storageName + ",offset,high,low)", function() {
      var buffer = new StorageClass(24);
      var val = new Int64Class(buffer, 8, 0x12345678, 0x90abcdef);
      assert.equal(val.toString(16), "1234567890abcdef");
      if (isArrayBuffer(buffer)) buffer = new Uint8Array(buffer);
      assert.equal(buffer[highpos], 0x12);
      assert.equal(buffer[lowpos], 0xef);
    });

    itSkip(className + "(" + storageName + ",offset,string,raddix)", function() {
      var buffer = new StorageClass(24);
      var val = new Int64Class(buffer, 8, "1234567890", 16);
      assert.equal(val.toNumber(), 0x1234567890);
      assert.equal(val.toString(16), "1234567890");
      assert.equal(val.toJSON(), (0x1234567890).toString());
      if (isArrayBuffer(buffer)) buffer = new Uint8Array(buffer);
      assert.equal(buffer[highpos], 0);
      assert.equal(buffer[lowpos], 0x1234567890 & 255);
    });

    itSkip(className + "(" + storageName + ",offset,array,offset)", function() {
      var buffer = new StorageClass(16);
      var src = LE ? [].concat(POSB, NEGB) : [].concat(NEGB, POSB);
      var val = Int64Class(buffer, 8, src, 4);
      assert.equal(val.toString(16), "7654321012345678");
      if (isArrayBuffer(buffer)) buffer = new Uint8Array(buffer);
      assert.equal(buffer[8], src[4]);
      assert.equal(buffer[15], src[11]);
    });
  }

  function storageSourceTests(className, storageName) {
    var Int64Class = exported[className];
    var StorageClass = STORAGES[storageName];
    var itSkip = StorageClass ? it : it.skip;

    itSkip(className + "(array,offset," + storageName + ",offset)", function() {
      var buffer = new Array(16);
      var src = LE ? [].concat(POSB, NEGB) : [].concat(NEGB, POSB);
      var copy = src.slice();
      if (storageName === "buffer") {
        src = new BUFFER(src);
      } else if (storageName === "uint8array") {
        src = new UINT8ARRAY(src);
      } else if (storageName === "arraybuffer") {
        src = (new UINT8ARRAY(src)).buffer;
      } else if (storageName === "arraylike") {
        src = new ArrayLike(src);
      }
      var val = Int64Class(buffer, 8, src, 4);
      assert.ok(val.buffer instanceof Array);
      assert.equal(val.toString(16), "7654321012345678");
      if (isArrayBuffer(buffer)) buffer = new Uint8Array(buffer);
      assert.equal(buffer[8], copy[4]);
      assert.equal(buffer[15], copy[11]);
    });
  }

  function uintMoreTests() {
    var Uint64Class = exported[uint64Name];

    describe(uint64Name + "(string)", function() {
      // rount-trip by string
      it(uint64Name + "(''+" + uint64Name + "())", function() {
        SAMPLES.forEach(function(array) {
          var c = "" + Uint64Class(array);
          var d = "" + Uint64Class(c);
          assert.equal(d, c);
        });
      });
    });

    describe(uint64Name + "(array)", function() {
      forEach.call([
        [0x0000000000000000, 0, 0, 0, 0, 0, 0, 0, 0], // 0
        [0x0000000000000001, 0, 0, 0, 0, 0, 0, 0, 1], // 1
        [0x00000000FFFFFFFF, 0, 0, 0, 0, 0xFF, 0xFF, 0xFF, 0xFF],
        [0x4000000000000000, 0x40, 0, 0, 0, 0, 0, 0, 0],
        [0x7FFFFFFF00000000, 0x7F, 0xFF, 0xFF, 0xFF, 0, 0, 0, 0],
        [0x8000000000000000, 0x80, 0, 0, 0, 0, 0, 0, 0],
        [0x8000000100000000, 0x80, 0, 0, 1, 0, 0, 0, 0],
        [0xFFFFFFFF00000000, 0xFF, 0xFF, 0xFF, 0xFF, 0, 0, 0, 0]
      ], function(exp) {
        var val = exp.shift();
        if (LE) exp.reverse();
        it(toHex(exp), function() {
          var c = new Uint64Class(exp);
          assert.equal(toHex(c.buffer), toHex(exp));
          assert.equal(c - 0, val);
          assert.equal(c.toNumber(), val);
          assert.equal(c.toString(16), toString16(val));
        });
      });
    });

    describe(uint64Name + "(high1)", function() {
      reduce.call([
        [0, 0, 0, 0, 0, 0, 0, 1], // 1
        [0, 0, 0, 0, 0, 0, 1, 0], // 256
        [0, 0, 0, 0, 0, 1, 0, 0], // 65536
        [0, 0, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0]
      ], function(val, exp) {
        if (LE) exp.reverse();
        it(toHex(exp), function() {
          var c = new Uint64Class(val);
          assert.equal(toHex(c.buffer), toHex(exp));
          assert.equal(c - 0, val);
          assert.equal(c.toNumber(), val);
          assert.equal(c.toString(16), toString16(val));
        });
        return val * 256;
      }, 1);
    });

    describe(uint64Name + "(high32)", function() {
      reduce.call([
        [0, 0, 0, 0, 0xFF, 0xFF, 0xFF, 0xFF],
        [0, 0, 0, 0xFF, 0xFF, 0xFF, 0xFF, 0],
        [0, 0, 0xFF, 0xFF, 0xFF, 0xFF, 0, 0],
        [0, 0xFF, 0xFF, 0xFF, 0xFF, 0, 0, 0],
        [0xFF, 0xFF, 0xFF, 0xFF, 0, 0, 0, 0]
      ], function(val, exp) {
        if (LE) exp.reverse();
        it(toHex(exp), function() {
          var c = new Uint64Class(val);
          assert.equal(toHex(c.buffer), toHex(exp));
          assert.equal(c - 0, val);
          assert.equal(c.toNumber(), val);
          assert.equal(c.toString(16), toString16(val));
        });
        return val * 256;
      }, 0xFFFFFFFF);
    });
  }

  function intMoreTests() {
    var Int64Class = exported[int64Name];

    describe(int64Name + "(array)", function() {
      forEach.call([
        [0x0000000000000000, 0, 0, 0, 0, 0, 0, 0, 0], // 0
        [0x0000000000000001, 0, 0, 0, 0, 0, 0, 0, 1], // 1
        [0x00000000FFFFFFFF, 0, 0, 0, 0, 0xFF, 0xFF, 0xFF, 0xFF],
        [-0x00000000FFFFFFFF, 0xFF, 0xFF, 0xFF, 0xFF, 0, 0, 0, 1],
        [0x4000000000000000, 0x40, 0, 0, 0, 0, 0, 0, 0],
        [-0x4000000000000000, 0xC0, 0, 0, 0, 0, 0, 0, 0],
        [0x7FFFFFFF00000000, 0x7F, 0xFF, 0xFF, 0xFF, 0, 0, 0, 0],
        [-0x7FFFFFFF00000000, 0x80, 0, 0, 1, 0, 0, 0, 0],
        [-1, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]
      ], function(exp) {
        var val = exp.shift();
        if (LE) exp.reverse();
        it(toHex(exp), function() {
          var c = new Int64Class(exp);
          assert.equal(toHex(c.buffer), toHex(exp));
          assert.equal(c - 0, val);
          assert.equal(c.toNumber(), val);
          assert.equal(c.toString(16), toString16(val));
        });
      });
    });

    describe(int64Name + "(low1)", function() {
      reduce.call([
        [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFE], // -2
        [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFE, 0xFF], // -257
        [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFE, 0xFF, 0xFF], // -65537
        [0xFF, 0xFF, 0xFF, 0xFF, 0xFE, 0xFF, 0xFF, 0xFF],
        [0xFF, 0xFF, 0xFF, 0xFE, 0xFF, 0xFF, 0xFF, 0xFF],
        [0xFF, 0xFF, 0xFE, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF],
        [0xFF, 0xFE, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF],
        [0xFE, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]
      ], function(val, exp) {
        if (LE) exp.reverse();
        it(toHex(exp), function() {
          var c = new Int64Class(val);
          assert.equal(toHex(c.buffer), toHex(exp));
          assert.equal(c - 0, val);
          assert.equal(c.toNumber(), val);
        });
        return (val * 256) + 255;
      }, -2);
    });

    describe(int64Name + "(low31)", function() {
      reduce.call([
        [0xFF, 0xFF, 0xFF, 0xFF, 0x80, 0, 0, 0],
        [0xFF, 0xFF, 0xFF, 0x80, 0, 0, 0, 0xFF],
        [0xFF, 0xFF, 0x80, 0, 0, 0, 0xFF, 0xFF],
        [0xFF, 0x80, 0, 0, 0, 0xFF, 0xFF, 0xFF],
        [0x80, 0, 0, 0, 0xFF, 0xFF, 0xFF, 0xFF]
      ], function(val, exp) {
        if (LE) exp.reverse();
        it(toHex(exp), function() {
          var c = new Int64Class(val);
          assert.equal(toHex(c.buffer), toHex(exp));
          assert.equal(c - 0, val);
          assert.equal(c.toNumber(), val);
        });
        return (val * 256) + 255;
      }, -2147483648);
    });

    describe(int64Name + "(0)", function() {
      INPUT0.forEach(function(val) {
        var view = ("string" === typeof val) ? '"' + val + '"' : val;
        var hex = toHex(ZERO);
        it(toHex(ZERO) + " = " + view, function() {
          var c = new Uint64LE(val);
          assert.equal(toHex(c.toArray()), hex);
          assert.equal(c.toString(), "0");
          assert.equal(c.toNumber(), 0);
        });
      });
    });

    describe(int64Name + "(array,offset,0)", function() {
      INPUT0.forEach(function(val) {
        var view = ("string" === typeof val) ? '"' + val + '"' : val;
        var hex = toHex(ZERO);
        var buf = [].concat(POSB, NEGB);
        it(toHex(ZERO) + " = " + view, function() {
          var c = new Int64Class(buf, 4, val);
          assert.equal(toHex(c.toArray()), hex);
          assert.equal(c.toString(), "0");
          assert.equal(c.toNumber(), 0);
        });
      });
    });

    describe(int64Name + "(1)", function() {
      INPUT1.forEach(function(val) {
        var view = ("string" === typeof val) ? '"' + val + '"' : val;
        var hex = toHex(POS1);
        it(toHex(POS1) + " = " + view, function() {
          var c = new Int64Class(val);
          assert.equal(toHex(c.toArray()), hex);
          assert.equal(c.toString(), "1");
          assert.equal(c.toNumber(), 1);
        });
      });
    });

    describe(int64Name + "(array,offset,1)", function() {
      INPUT1.forEach(function(val) {
        var view = ("string" === typeof val) ? '"' + val + '"' : val;
        var hex = toHex(POS1);
        var buf = [].concat(POSB, NEGB);
        it(toHex(POS1) + " = " + view, function() {
          var c = new Int64Class(buf, 4, val);
          assert.equal(toHex(c.toArray()), hex);
          assert.equal(c.toString(), "1");
          assert.equal(c.toNumber(), 1);
        });
      });
    });

    describe(int64Name + "(string)", function() {
      // rount-trip by string
      it(int64Name + "(''+" + int64Name + "())", function() {
        SAMPLES.forEach(function(array) {
          var c = "" + Int64Class(array);
          var d = "" + Int64Class(c);
          assert.equal(d, c);
        });
      });

      // round-trip with negative value
      it(int64Name + "('-'+" + int64Name + "())", function() {
        SAMPLES.forEach(function(array) {
          if (array === NEG8) return; // skip -INT64_MIN overflow
          var c = "" + Int64Class(array);
          var d = (c === "0") ? c : (c[0] === "-") ? c.substr(1) : "-" + c;
          var e = "" + Int64Class(d);
          var f = (e === "0") ? e : (e[0] === "-") ? e.substr(1) : "-" + e;
          assert.equal(f, c);
        });
      });
    });
  }
}

function miscTests() {
  describe("Misc", function() {
    it("Uint64BE.isUint64BE(Uint64BE())", function() {
      assert.ok(Uint64BE.isUint64BE(Uint64BE()));
      assert.ok(!Uint64BE.isUint64BE(Int64BE()));
    });

    it("Int64BE.isInt64BE(Int64BE())", function() {
      assert.ok(Int64BE.isInt64BE(Int64BE()));
      assert.ok(!Int64BE.isInt64BE(Uint64BE()));
    });

    it("Uint64LE.isUint64LE(Uint64LE())", function() {
      assert.ok(Uint64LE.isUint64LE(Uint64LE()));
      assert.ok(!Uint64LE.isUint64LE(Int64LE()));
    });

    it("Int64LE.isInt64LE(Int64LE())", function() {
      assert.ok(Int64LE.isInt64LE(Int64LE()));
      assert.ok(!Int64LE.isInt64LE(Uint64LE()));
    });
  });
}

function ArrayLike(arg) {
  if (!(this instanceof ArrayLike)) return new ArrayLike(arg);
  var i;
  if (arg && arg.length) {
    this.length = arg.length;
    for (i = 0; i < this.length; i++) this[i] = arg[i];
  } else {
    this.length = arg;
    for (i = 0; i < this.length; i++) this[i] = 0;
  }
}

function isArrayBuffer(buffer) {
  return (ARRAYBUFFER && buffer instanceof ArrayBuffer);
}

function toHex(array) {
  return Array.prototype.map.call(array, function(val) {
    return val > 15 ? val.toString(16) : "0" + val.toString(16);
  }).join("");
}

function toString16(val) {
  var str = val.toString(16);
  if (str.indexOf("e+") < 0) return str;
  // IE8-10 may return "4(e+15)" style of string
  return Math.floor(val / 0x100000000).toString(16) + lpad((val % 0x100000000).toString(16), 8);
}

function lpad(str, len) {
  return "00000000".substr(0, len - str.length) + str;
}

function assert(value) {
  if (!value) throw new Error(value + " = " + true);
}

function equal(actual, expected) {
  if (actual != expected) throw new Error(actual + " = " + expected);
}
