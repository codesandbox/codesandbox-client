'use strict'

var test = require('tape').test
var msgpack = require('../')

test('encode/compatibility mode', function (t) {
  var compatEncoder = msgpack({
    compatibilityMode: true
  })
  var defaultEncoder = msgpack({
    compatibilityMode: false
  })

  var oneBytesStr = Array(31 + 2).join('x')
  var twoBytesStr = Array(255 + 2).join('x')

  t.test('default encoding a string of length ' + oneBytesStr.length, function (t) {
    // Default: use 1 byte length string (str8)
    var buf = defaultEncoder.encode(oneBytesStr)
    t.equal(buf[0], 0xd9, 'must have the proper header (str8)')
    t.equal(buf.toString('utf8', 2, Buffer.byteLength(oneBytesStr) + 2), oneBytesStr, 'must decode correctly')
    t.end()
  })

  t.test('compat. encoding a string of length ' + oneBytesStr.length, function (t) {
    // Compat. mode: use 2 byte length string (str16)
    var buf = compatEncoder.encode(oneBytesStr)
    t.equal(buf[0], 0xda, 'must have the proper header (str16)')
    t.equal(buf.toString('utf8', 3, Buffer.byteLength(oneBytesStr) + 3), oneBytesStr, 'must decode correctly')
    t.end()
  })

  t.test('encoding for a string of length ' + twoBytesStr.length, function (t) {
    // Two byte strings: compat. mode should make no difference
    var buf1 = defaultEncoder.encode(twoBytesStr)
    var buf2 = compatEncoder.encode(twoBytesStr)
    t.deepEqual(buf1, buf2, 'must be equal for two byte strings')
    t.end()
  })
})
