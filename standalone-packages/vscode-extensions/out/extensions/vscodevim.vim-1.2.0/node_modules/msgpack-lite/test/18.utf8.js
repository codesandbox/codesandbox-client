#!/usr/bin/env mocha -R spec

var assert = require("assert");
var msgpackJS = "../index";
var isBrowser = ("undefined" !== typeof window);
var msgpack = isBrowser && window.msgpack || require(msgpackJS);
var TITLE = __filename.replace(/^.*\//, "");

var OPTIONS = [{}, {safe: true}];

describe(TITLE, function() {
  OPTIONS.forEach(function(options) {
    var suffix = " " + JSON.stringify(options);
    it("string (ASCII)" + suffix, function() {
      var string = "a";
      var array = [0xa1, 0x61];
      var encoded = msgpack.encode(string, options);
      var decoded = msgpack.decode(array, options);
      assert.deepEqual(toArray(encoded), array);
      assert.equal(decoded, string);
    });

    it("string (Greek)" + suffix, function() {
      var string = "α";
      var array = [0xa2, 0xce, 0xb1];
      var encoded = msgpack.encode(string, options);
      var decoded = msgpack.decode(array, options);
      assert.deepEqual(toArray(encoded), array);
      assert.equal(decoded, string);
    });

    it("string (Asian)" + suffix, function() {
      var string = "亜";
      var array = [0xa3, 0xe4, 0xba, 0x9c];
      var encoded = msgpack.encode(string, options);
      var decoded = msgpack.decode(array, options);
      assert.deepEqual(toArray(encoded), array);
      assert.equal(decoded, string);
    });

    // U+1F426 "🐦" bird
    // http://unicode.org/emoji/charts/full-emoji-list.html#1f426
    it("string (Emoji)" + suffix, function() {
      var string = "\uD83D\uDC26"; // surrogate pair
      var array_utf8 = [0xa4, 0xf0, 0x9f, 0x90, 0xa6]; // UTF-8
      var array_cesu8 = [0xa6, 0xed, 0xa0, 0xbd, 0xed, 0xb0, 0xa6]; // CESU-8
      var encoded = msgpack.encode(string, options);
      var decoded_utf8 = msgpack.decode(array_utf8, options);
      var decoded_cesu8 = msgpack.decode(array_cesu8, options);
      assert.deepEqual(toArray(encoded), array_utf8);
      assert.equal(decoded_utf8, string);
      assert.equal(decoded_cesu8, string);
    });
  });
});

function toArray(buffer) {
  return Array.prototype.slice.call(buffer);
}
