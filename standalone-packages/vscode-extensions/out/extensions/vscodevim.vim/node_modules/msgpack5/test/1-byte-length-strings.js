'use strict'

var Buffer = require('safe-buffer').Buffer
var test = require('tape').test
var msgpack = require('../')
var bl = require('bl')

test('encode/decode 32 <-> (2^8-1) bytes strings', function (t) {
  var encoder = msgpack()
  var all = []
  var i

  // build base
  for (i = 'a'; i.length < 32; i += 'a') {
  }

  for (; i.length < Math.pow(2, 8); i += 'aaaaa') {
    all.push(i)
  }

  all.forEach(function (str) {
    t.test('encoding a string of length ' + str.length, function (t) {
      var buf = encoder.encode(str)
      t.equal(buf.length, 2 + Buffer.byteLength(str), 'must be the proper length')
      t.equal(buf.readUInt8(0), 0xd9, 'must have the proper header')
      t.equal(buf.readUInt8(1), Buffer.byteLength(str), 'must include the str length')
      t.equal(buf.toString('utf8', 2, Buffer.byteLength(str) + 2), str, 'must decode correctly')
      t.end()
    })

    t.test('decoding a string of length ' + str.length, function (t) {
      var buf = Buffer.allocUnsafe(2 + Buffer.byteLength(str))
      buf[0] = 0xd9
      buf[1] = Buffer.byteLength(str)
      buf.write(str, 2)
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
  var str
  for (str = 'a'; str.length < 40; str += 'a') {
  }
  var buf = Buffer.allocUnsafe(2 + Buffer.byteLength(str))
  buf[0] = 0xd9
  buf[1] = Buffer.byteLength(str) + 10 // set bigger size
  buf.write(str, 2)
  buf = bl().append(buf)
  var origLength = buf.length
  t.throws(function () {
    encoder.decode(buf)
  }, encoder.IncompleteBufferError, 'must throw IncompleteBufferError')
  t.equals(buf.length, origLength, 'must not consume any byte')
  t.end()
})

test('decoding an incomplete header of a string', function (t) {
  var encoder = msgpack()
  var buf = Buffer.allocUnsafe(1)
  buf[0] = 0xd9
  buf = bl().append(buf)
  var origLength = buf.length
  t.throws(function () {
    encoder.decode(buf)
  }, encoder.IncompleteBufferError, 'must throw IncompleteBufferError')
  t.equals(buf.length, origLength, 'must not consume any byte')
  t.end()
})
