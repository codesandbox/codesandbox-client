'use strict'

var Buffer = require('safe-buffer').Buffer
var test = require('tape').test
var msgpack = require('../')

function build (size) {
  var array = []
  var i

  for (i = 0; i < size; i++) {
    array.push(42)
  }

  return new Uint8Array(array)
}

test('encode/decode 2^8-1 Uint8Arrays', function (t) {
  var encoder = msgpack()
  var all = []

  all.push(build(Math.pow(2, 16)))
  all.push(build(Math.pow(2, 16) + 1))
  all.push(build(Math.pow(2, 18) + 1))

  all.forEach(function (array) {
    t.test('encoding Uint8Array of length ' + array.byteLength + ' bytes', function (t) {
      var buf = encoder.encode(array)
      t.equal(buf.length, 5 + array.byteLength, 'must have the right length')
      t.equal(buf.readUInt8(0), 0xc6, 'must have the proper header')
      t.equal(buf.readUInt32BE(1), array.byteLength, 'must include the buf length')
      t.end()
    })

    t.test('mirror test for an Uint8Array of length ' + array.byteLength + ' bytes', function (t) {
      t.deepEqual(encoder.decode(encoder.encode(array)), new Buffer(array), 'must stay the same')
      t.end()
    })
  })

  t.end()
})
