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

test('encode/decode 2^16-1 bytes buffers', function (t) {
  var encoder = msgpack()
  var all = []

  all.push(build(Math.pow(2, 8)))
  all.push(build(Math.pow(2, 8) + 1))
  all.push(build(Math.pow(2, 12) + 1))
  all.push(build(Math.pow(2, 16) - 1))

  all.forEach(function (orig) {
    t.test('encoding a buffer of length ' + orig.length, function (t) {
      var buf = encoder.encode(orig)
      t.equal(buf.length, 3 + orig.length, 'must have the right length')
      t.equal(buf.readUInt8(0), 0xc5, 'must have the proper header')
      t.equal(buf.readUInt16BE(1), orig.length, 'must include the buf length')
      t.equal(buf.toString('utf8', 3), orig.toString('utf8'), 'must decode correctly')
      t.end()
    })

    t.test('decoding a buffer of length ' + orig.length, function (t) {
      var buf = Buffer.allocUnsafe(3 + orig.length)
      buf[0] = 0xc5
      buf.writeUInt16BE(orig.length, 1)
      orig.copy(buf, 3)
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

test('decoding a chopped 2^16-1 bytes buffer', function (t) {
  var encoder = msgpack()
  var orig = build(Math.pow(2, 12))
  var buf = Buffer.allocUnsafe(3 + orig.length)
  buf[0] = 0xc5
  buf[1] = Math.pow(2, 16) - 1 // set bigger size
  orig.copy(buf, 3)
  buf = bl().append(buf)
  var origLength = buf.length
  t.throws(function () {
    encoder.decode(buf)
  }, encoder.IncompleteBufferError, 'must throw IncompleteBufferError')
  t.equals(buf.length, origLength, 'must not consume any byte')
  t.end()
})

test('decoding an incomplete header of 2^16-1 bytes buffer', function (t) {
  var encoder = msgpack()
  var buf = Buffer.allocUnsafe(2)
  buf[0] = 0xc5
  buf = bl().append(buf)
  var origLength = buf.length
  t.throws(function () {
    encoder.decode(buf)
  }, encoder.IncompleteBufferError, 'must throw IncompleteBufferError')
  t.equals(buf.length, origLength, 'must not consume any byte')
  t.end()
})
