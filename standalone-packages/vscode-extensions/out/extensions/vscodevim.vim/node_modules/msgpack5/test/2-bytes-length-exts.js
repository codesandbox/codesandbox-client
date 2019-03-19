'use strict'

var Buffer = require('safe-buffer').Buffer
var test = require('tape').test
var msgpack = require('../')
var bl = require('bl')

test('encode/decode variable ext data up between 0x0100 and 0xffff', function (t) {
  var encoder = msgpack()
  var all = []

  function MyType (size, value) {
    this.value = value
    this.size = size
  }

  function mytipeEncode (obj) {
    var buf = Buffer.allocUnsafe(obj.size)
    buf.fill(obj.value)
    return buf
  }

  function mytipeDecode (data) {
    var result = new MyType(data.length, data.toString('utf8', 0, 1))

    for (var i = 0; i < data.length; i++) {
      if (data.readUInt8(0) !== data.readUInt8(i)) {
        throw new Error('should all be the same')
      }
    }

    return result
  }

  encoder.register(0x42, MyType, mytipeEncode, mytipeDecode)

  all.push(new MyType(0x0100, 'a'))
  all.push(new MyType(0x0101, 'a'))
  all.push(new MyType(0xffff, 'a'))

  all.forEach(function (orig) {
    t.test('encoding a custom obj of length ' + orig.size, function (t) {
      var buf = encoder.encode(orig)
      t.equal(buf.length, 4 + orig.size, 'must have the right length')
      t.equal(buf.readUInt8(0), 0xc8, 'must have the ext header')
      t.equal(buf.readUInt16BE(1), orig.size, 'must include the data length')
      t.equal(buf.readUInt8(3), 0x42, 'must include the custom type id')
      t.equal(buf.toString('utf8', 4, 5), orig.value, 'must decode correctly')
      t.end()
    })

    t.test('mirror test with a custom obj of length ' + orig.size, function (t) {
      t.deepEqual(encoder.decode(encoder.encode(orig)), orig, 'must stay the same')
      t.end()
    })
  })

  t.test('decoding an incomplete variable ext data up between 0x0100 and 0xffff', function (t) {
    var obj = encoder.encode(new MyType(0xfff0, 'a'))
    var buf = Buffer.allocUnsafe(obj.length)
    buf[0] = 0xc8
    buf.writeUInt16BE(obj.length + 2, 1) // set bigger size
    obj.copy(buf, 3, 3, obj.length)
    buf = bl().append(buf)
    var origLength = buf.length
    t.throws(function () {
      encoder.decode(buf)
    }, encoder.IncompleteBufferError, 'must throw IncompleteBufferError')
    t.equals(buf.length, origLength, 'must not consume any byte')
    t.end()
  })

  t.test('decoding an incomplete header of variable ext data up between 0x0100 and 0xffff', function (t) {
    var buf = Buffer.allocUnsafe(3)
    buf[0] = 0xc8
    buf = bl().append(buf)
    var origLength = buf.length
    t.throws(function () {
      encoder.decode(buf)
    }, encoder.IncompleteBufferError, 'must throw IncompleteBufferError')
    t.equals(buf.length, origLength, 'must not consume any byte')
    t.end()
  })

  t.end()
})
