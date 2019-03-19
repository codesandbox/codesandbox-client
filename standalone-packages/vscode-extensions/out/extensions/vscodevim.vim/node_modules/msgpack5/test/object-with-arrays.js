'use strict'

var test = require('tape').test
var msgpack = require('../')
var bl = require('bl')

function build (size) {
  var array = []
  var i

  for (i = 0; i < size; i++) {
    array.push(42)
  }

  return array
}

test('decoding a map with multiple big arrays', function (t) {
  var map = {
    first: build(0xffff + 42),
    second: build(0xffff + 42)
  }
  var pack = msgpack()

  t.deepEqual(pack.decode(pack.encode(map)), map)
  t.end()
})

test('decoding a map with multiple big arrays. First one is incomplete', function (t) {
  var array = build(0xffff + 42)
  var map = {
    first: array,
    second: build(0xffff + 42)
  }
  var pack = msgpack()

  var buf = pack.encode(map)
  // 1 (fixmap's header 0x82) + first key's length + 1 (first array's 0xdd)
  var sizePosOfFirstArray = 1 + pack.encode('first').length + 1
  buf.writeUInt32BE(array.length + 10, sizePosOfFirstArray) // set first array's size bigger than its actual size
  buf = bl().append(buf)
  var origLength = buf.length
  t.throws(function () {
    pack.decode(buf)
  }, pack.IncompleteBufferError, 'must throw IncompleteBufferError')
  t.equals(buf.length, origLength, 'must not consume any byte')
  t.end()
})

test('decoding a map with multiple big arrays. Second one is incomplete', function (t) {
  var array = build(0xffff + 42)
  var map = {
    first: array,
    second: build(0xffff + 42)
  }
  var pack = msgpack()

  var buf = pack.encode(map)
  // 1 (fixmap's header 0x82) + first key-value pair's length + second key's length + 1 (second array's 0xdd)
  var sizePosOfSecondArray = 1 + pack.encode('first').length + pack.encode(array).length + pack.encode('second').length + 1
  buf.writeUInt32BE(array.length + 10, sizePosOfSecondArray) // set second array's size bigger than its actual size
  buf = bl().append(buf)
  var origLength = buf.length
  t.throws(function () {
    pack.decode(buf)
  }, pack.IncompleteBufferError, 'must throw IncompleteBufferError')
  t.equals(buf.length, origLength, 'must not consume any byte')
  t.end()
})
