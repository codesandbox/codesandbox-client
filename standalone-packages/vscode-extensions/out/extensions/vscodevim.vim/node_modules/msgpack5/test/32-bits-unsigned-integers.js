'use strict'

var Buffer = require('safe-buffer').Buffer
var test = require('tape').test
var msgpack = require('../')
var bl = require('bl')

test('encoding/decoding 32-bits big-endian unsigned integers', function (t) {
  var encoder = msgpack()
  var allNum = []

  for (var i = 65536; i < 0xffffffff; i += 102350237) {
    allNum.push(i)
  }

  allNum.push(0xfffffffe)
  allNum.push(0xffffffff)

  allNum.forEach(function (num) {
    t.test('encoding ' + num, function (t) {
      var buf = encoder.encode(num)
      t.equal(buf.length, 5, 'must have 5 bytes')
      t.equal(buf[0], 0xce, 'must have the proper header')
      t.equal(buf.readUInt32BE(1), num, 'must decode correctly')
      t.end()
    })

    t.test('decoding ' + num, function (t) {
      var buf = Buffer.allocUnsafe(5)
      buf[0] = 0xce
      buf.writeUInt32BE(num, 1)
      t.equal(encoder.decode(buf), num, 'must decode correctly')
      t.end()
    })

    t.test('mirror test ' + num, function (t) {
      t.equal(encoder.decode(encoder.encode(num)), num, 'must stay the same')
      t.end()
    })
  })

  t.end()
})

test('decoding an incomplete 32-bits big-endian unsigned integer', function (t) {
  var encoder = msgpack()
  var buf = Buffer.allocUnsafe(4)
  buf[0] = 0xce
  buf = bl().append(buf)
  var origLength = buf.length
  t.throws(function () {
    encoder.decode(buf)
  }, encoder.IncompleteBufferError, 'must throw IncompleteBufferError')
  t.equals(buf.length, origLength, 'must not consume any byte')
  t.end()
})
