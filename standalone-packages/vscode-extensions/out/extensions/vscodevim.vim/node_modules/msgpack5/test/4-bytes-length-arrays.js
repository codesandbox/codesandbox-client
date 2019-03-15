'use strict'

var Buffer = require('safe-buffer').Buffer
var test = require('tape').test
var msgpack = require('../')
var bl = require('bl')

function build (size) {
  var array = []

  for (var i = 0; i < size; i++) {
    array.push(42)
  }

  return array
}

test('encode/decode arrays up to 0xffffffff elements', function (t) {
  var encoder = msgpack()

  function doTest (array) {
    t.test('encoding an array with ' + array.length + ' elements', function (t) {
      var buf = encoder.encode(array)
      // the array is full of 1-byte integers
      t.equal(buf.length, 5 + array.length, 'must have the right length')
      t.equal(buf.readUInt8(0), 0xdd, 'must have the proper header')
      t.equal(buf.readUInt32BE(1), array.length, 'must include the array length')
      t.end()
    })

    t.test('mirror test for an array of length ' + array.length, function (t) {
      t.deepEqual(encoder.decode(encoder.encode(array)), array, 'must stay the same')
      t.end()
    })
  }

  doTest(build(0xffff + 1))
  doTest(build(0xffff + 42))
  // unable to test bigger arrays do to out of memory errors

  t.end()
})

test('decoding an incomplete array', function (t) {
  var encoder = msgpack()

  var array = build(0xffff + 42)
  var buf = Buffer.allocUnsafe(5 + array.length)
  buf[0] = 0xdd
  buf.writeUInt32BE(array.length + 10, 1) // set bigger size
  var pos = 5
  for (var i = 0; i < array.length; i++) {
    var obj = encoder.encode(array[i], true)
    obj.copy(buf, pos)
    pos += obj.length
  }
  buf = bl().append(buf)
  var origLength = buf.length
  t.throws(function () {
    encoder.decode(buf)
  }, encoder.IncompleteBufferError, 'must throw IncompleteBufferError')
  t.equals(buf.length, origLength, 'must not consume any byte')
  t.end()
})

test('decoding an incomplete header', function (t) {
  var encoder = msgpack()

  var buf = Buffer.allocUnsafe(4)
  buf[0] = 0xdd
  buf = bl().append(buf)
  var origLength = buf.length
  t.throws(function () {
    encoder.decode(buf)
  }, encoder.IncompleteBufferError, 'must throw IncompleteBufferError')
  t.equals(buf.length, origLength, 'must not consume any byte')
  t.end()
})
