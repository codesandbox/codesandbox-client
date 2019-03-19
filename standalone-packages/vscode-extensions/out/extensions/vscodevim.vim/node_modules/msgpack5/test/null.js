'use strict'

var Buffer = require('safe-buffer').Buffer
var test = require('tape').test
var msgpack = require('../')

test('encode/decode null', function (t) {
  var encoder = msgpack()

  t.equal(encoder.encode(null)[0], 0xc0, 'encode null as 0xc0')
  t.equal(encoder.encode(null).length, 1, 'encode a buffer of length 1')
  t.equal(encoder.decode(Buffer.from([0xc0])), null, 'decode 0xc0 as null')
  t.equal(encoder.decode(encoder.encode(null)), null, 'mirror test null')

  t.end()
})
