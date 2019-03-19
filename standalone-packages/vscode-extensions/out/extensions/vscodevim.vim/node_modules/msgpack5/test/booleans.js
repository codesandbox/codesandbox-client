'use strict'

var Buffer = require('safe-buffer').Buffer
var test = require('tape').test
var msgpack = require('../')

test('encode/decode booleans', function (t) {
  var encoder = msgpack()

  t.equal(encoder.encode(true)[0], 0xc3, 'encode true as 0xc3')
  t.equal(encoder.encode(true).length, 1, 'encode true as a buffer of length 1')
  t.equal(encoder.decode(Buffer.from([0xc3])), true, 'decode 0xc3 as true')
  t.equal(encoder.decode(encoder.encode(true)), true, 'mirror test true')

  t.equal(encoder.encode(false)[0], 0xc2, 'encode false as 0xc2')
  t.equal(encoder.encode(false).length, 1, 'encode false as a buffer of length 1')
  t.equal(encoder.decode(Buffer.from([0xc2])), false, 'decode 0xc2 as false')
  t.equal(encoder.decode(encoder.encode(false)), false, 'mirror test false')

  t.end()
})
