'use strict'

var Buffer = require('safe-buffer').Buffer
var test = require('tape').test
var msgpack = require('../')
var bl = require('bl')

test('encode/decode strings with max 31 of length', function (t) {
  var encoder = msgpack()
  var all = []

  // build base
  for (var i = ''; i.length < 32; i += 'a') {
    all.push(i)
  }

  all.forEach(function (str) {
    t.test('encoding a string of length ' + str.length, function (t) {
      var buf = encoder.encode(str)
      t.equal(buf.length, 1 + Buffer.byteLength(str), 'must be the proper length')
      t.equal(buf.readUInt8(0) & 0xe0, 0xa0, 'must have the proper header')
      t.equal(buf.readUInt8(0) & 0x1f, Buffer.byteLength(str), 'must include the str length')
      t.equal(buf.toString('utf8', 1, Buffer.byteLength(str) + 2), str, 'must decode correctly')
      t.end()
    })

    t.test('decoding a string of length ' + str.length, function (t) {
      var buf = Buffer.allocUnsafe(1 + Buffer.byteLength(str))
      buf[0] = 0xa0 | Buffer.byteLength(str)
      if (str.length > 0) {
        buf.write(str, 1)
      }
      t.equal(encoder.decode(buf), str, 'must decode correctly')
      t.end()
    })

    t.test('mirror test a string of length ' + str.length, function (t) {
      t.equal(encoder.decode(encoder.encode(str)), str, 'must stay the same')
      t.end()
    })
  })

  t.end()
})

test('decoding a chopped string', function (t) {
  var encoder = msgpack()
  var str = 'aaa'
  var buf = Buffer.allocUnsafe(1 + Buffer.byteLength(str))
  buf[0] = 0xa0 | Buffer.byteLength(str) + 2 // set bigger size
  buf.write(str, 1)
  buf = bl().append(buf)
  var origLength = buf.length
  t.throws(function () {
    encoder.decode(buf)
  }, encoder.IncompleteBufferError, 'must throw IncompleteBufferError')
  t.equals(buf.length, origLength, 'must not consume any byte')
  t.end()
})
