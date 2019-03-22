'use strict'

var Buffer = require('safe-buffer').Buffer
var test = require('tape').test
var msgpack = require('../')
var bl = require('bl')

function build (size) {
  var buf

  buf = Buffer.allocUnsafe(size)
  buf.fill('a')

  return buf
}

test('encode/decode 2^8-1 bytes buffers', function (t) {
  var encoder = msgpack()
  var all = []

  all.push(build(Math.pow(2, 8) - 1))
  all.push(build(Math.pow(2, 6) + 1))
  all.push(build(1))
  all.push(Buffer.allocUnsafe(0))

  all.forEach(function (orig) {
    t.test('encoding a buffer of length ' + orig.length, function (t) {
      var buf = encoder.encode(orig)
      t.equal(buf.length, 2 + orig.length, 'must have the right length')
      t.equal(buf.readUInt8(0), 0xc4, 'must have the proper header')
      t.equal(buf.readUInt8(1), orig.length, 'must include the buf length')
      t.equal(buf.toString('utf8', 2), orig.toString('utf8'), 'must decode correctly')
      t.end()
    })

    t.test('decoding a buffer of length ' + orig.length, function (t) {
      var buf = Buffer.allocUnsafe(2 + orig.length)
      buf[0] = 0xc4
      buf[1] = orig.length
      orig.copy(buf, 2)
      t.equal(encoder.decode(buf).toString('utf8'), orig.toString('utf8'), 'must decode correctly')
      t.end()
    })

    t.test('mirror test a buffer of length ' + orig.length, function (t) {
      t.equal(encoder.decode(encoder.encode(orig)).toString(), orig.toString(), 'must stay the same')
      t.end()
    })
  })

  t.end()
})

test('decoding a chopped 2^8-1 bytes buffer', function (t) {
  var encoder = msgpack()
  var orig = build(Math.pow(2, 6))
  var buf = Buffer.allocUnsafe(2 + orig.length)
  buf[0] = 0xc4
  buf[1] = Math.pow(2, 8) - 1 // set bigger size
  orig.copy(buf, 2)
  buf = bl().append(buf)
  var origLength = buf.length
  t.throws(function () {
    encoder.decode(buf)
  }, encoder.IncompleteBufferError, 'must throw IncompleteBufferError')
  t.equals(buf.length, origLength, 'must not consume any byte')
  t.end()
})

test('decoding an incomplete header of 2^8-1 bytes buffer', function (t) {
  var encoder = msgpack()
  var buf = Buffer.allocUnsafe(1)
  buf[0] = 0xc4
  buf = bl().append(buf)
  var origLength = buf.length
  t.throws(function () {
    encoder.decode(buf)
  }, encoder.IncompleteBufferError, 'must throw IncompleteBufferError')
  t.equals(buf.length, origLength, 'must not consume any byte')
  t.end()
})
