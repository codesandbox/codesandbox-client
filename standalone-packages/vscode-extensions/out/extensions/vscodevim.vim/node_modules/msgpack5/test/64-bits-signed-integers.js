'use strict'

var Buffer = require('safe-buffer').Buffer
var test = require('tape').test
var msgpack = require('../')
var bl = require('bl')

test('encoding/decoding 64-bits big-endian signed integers', function (t) {
  var encoder = msgpack()
  var table = [
    { num: -9007199254740991, hi: 0xffe00000, lo: 0x00000001 },
    { num: -4294967297, hi: 0xfffffffe, lo: 0xffffffff },
    { num: -4294967296, hi: 0xffffffff, lo: 0x00000000 },
    { num: -4294967295, hi: 0xffffffff, lo: 0x00000001 },
    { num: -214748365, hi: 0xffffffff, lo: 0xf3333333 }
  ]

  table.forEach(function (testCase) {
    t.test('encoding ' + testCase.num, function (t) {
      var buf = encoder.encode(testCase.num)
      t.equal(buf.length, 9, 'must have 9 bytes')
      t.equal(buf[0], 0xd3, 'must have the proper header')
      t.equal(buf.readUInt32BE(1), testCase.hi, 'hi word must be properly written')
      t.equal(buf.readUInt32BE(5), testCase.lo, 'lo word must be properly written')
      t.end()
    })

    t.test('mirror test ' + testCase.num, function (t) {
      t.equal(encoder.decode(encoder.encode(testCase.num)), testCase.num, 'must stay the same')
      t.end()
    })
  })

  t.end()
})

test('decoding an incomplete 64-bits big-endian signed integer', function (t) {
  var encoder = msgpack()
  var buf = Buffer.allocUnsafe(8)
  buf[0] = 0xd3
  buf = bl().append(buf)
  var origLength = buf.length
  t.throws(function () {
    encoder.decode(buf)
  }, encoder.IncompleteBufferError, 'must throw IncompleteBufferError')
  t.equals(buf.length, origLength, 'must not consume any byte')
  t.end()
})
