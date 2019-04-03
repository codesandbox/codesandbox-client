#!/usr/bin/env mocha -R spec

var assert = require("assert");
var msgpackJS = "../index";
var isBrowser = ("undefined" !== typeof window);
var HAS_MAP = ("undefined" !== typeof Map);
var msgpack = isBrowser && window.msgpack || require(msgpackJS);
var TITLE = __filename.replace(/^.*\//, "");

function pattern(min, max, offset) {
  var array = [];
  var check = {};
  var val = min - 1;
  while (val <= max) {
    if (min <= val && !check[val]) array.push(val);
    check[val++] = 1;
    if (val <= max && !check[val]) array.push(val);
    check[val++] = 1;
    if (val <= max && !check[val]) array.push(val);
    check[val--] = 1;
    val = val ? val * 2 - 1 : 1;
  }
  return array;
}

// Run these tests when Map is available
var describeSkip = HAS_MAP ? describe : describe.skip;

describeSkip(TITLE, function() {

  it("Map (small)", function() {
    pattern(0, 257).forEach(function(length) {
      var value = new Map();
      assert.equal(true, value instanceof Map);
      for (var i = 0; i < length; i++) {
        var key = String.fromCharCode(i);
        value.set(key, length);
      }
      assert.equal(value.size, length);
      var options = {codec: msgpack.createCodec({usemap: true})};
      var encoded = msgpack.encode(value, options);
      var decoded = msgpack.decode(encoded, options);
      assert.equal(true, decoded instanceof Map);
      assert.equal(decoded.size, length);
      assert.equal(decoded.get(String.fromCharCode(0)), value.get(String.fromCharCode(0)));
      assert.equal(decoded.get(String.fromCharCode(length - 1)), value.get(String.fromCharCode(length - 1)));
    });
  });

  it("Map (large)", function() {
    this.timeout(30000);
    pattern(65536, 65537).forEach(function(length) {
      var value = new Map();
      for (var i = 0; i < length; i++) {
        value.set(i, length);
      }
      assert.equal(value.size, length);
      var options = {codec: msgpack.createCodec({usemap: true})};
      var encoded = msgpack.encode(value, options);
      var decoded = msgpack.decode(encoded, options);
      assert.equal(decoded.size, length);
      assert.equal(decoded.get(0), value.get(0));
      assert.equal(decoded.get(length - 1), value.get(length - 1));
    });
  });
});
