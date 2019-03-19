'use strict'

var Buffer = require('safe-buffer').Buffer
var test = require('tape').test
var msgpack = require('../')

test('encoding/decoding 7-bits positive ints', function (t) {
  var encoder = msgpack()
  var allNum = []

  for (var i = 0; i < 126; i++) {
    allNum.push(i)
  }

  allNum.forEach(function (num) {
    t.test('encoding ' + num, function (t) {
      var buf = encoder.encode(num)
      t.equal(buf.length, 1, 'must have 1 byte')
      t.equal(buf[0], num, 'must decode correctly')
      t.end()
    })

    t.test('decoding ' + num, function (t) {
      var buf = Buffer.from([num])
      t.equal(encoder.decode(buf), num, 'must decode correctly')
      t.end()
    })

    t.test('mirror test' + num, function (t) {
      t.equal(encoder.decode(encoder.encode(num)), num, 'must stay the same')
      t.end()
    })
  })

  t.end()
})
