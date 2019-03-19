'use strict'

var Buffer = require('safe-buffer').Buffer
var test = require('tape').test
var msgpack = require('../')
var bl = require('bl')

test('encoding/decoding 64-bits big-endian unsigned integers', function (t) {
  var encoder = msgpack()
  var allNum = []

  allNum.push(0x0000000100000000)
  allNum.push(0xffffffffeeeee)

  allNum.forEach(function (num) {
    t.test('encoding ' + num, function (t) {
      var buf = encoder.encode(num)
      t.equal(buf.length, 9, 'must have 9 bytes')
      t.equal(buf[0], 0xcf, 'must have the proper header')
      var result = 0
      for (var k = 7; k >= 0; k--) {
        result += (buf.readUInt8(k + 1) * Math.pow(2, (8 * (7 - k))))
      }
      t.equal(result, num, 'must decode correctly')
      t.end()
    })

    t.test('mirror test ' + num, function (t) {
      t.equal(encoder.decode(encoder.encode(num)), num, 'must stay the same')
      t.end()
    })
  })

  t.end()
})

test('decoding an incomplete 64-bits big-endian unsigned integer', function (t) {
  var encoder = msgpack()
  var buf = Buffer.allocUnsafe(8)
  buf[0] = 0xcf
  buf = bl().append(buf)
  var origLength = buf.length
  t.throws(function () {
    encoder.decode(buf)
  }, encoder.IncompleteBufferError, 'must throw IncompleteBufferError')
  t.equals(buf.length, origLength, 'must not consume any byte')
  t.end()
})
