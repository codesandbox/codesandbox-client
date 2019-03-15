'use strict'

var Buffer = require('safe-buffer').Buffer
var test = require('tape').test
var msgpack = require('../')

test('encode/decode ext with a custom object check', function (t) {
  var encoder = msgpack()
  var all = []

  function MyType (data) {
    this.data = data
  }

  function checkForMyType (obj) {
    return obj instanceof MyType
  }

  function mytypeEncode (obj) {
    var buf = Buffer.allocUnsafe(2)
    buf.writeUInt8(0x42, 0)
    buf.writeUInt8(obj.data, 1)
    return buf
  }

  function mytypeDecode (data) {
    return new MyType(data.readUInt8(0))
  }

  encoder.registerEncoder(checkForMyType, mytypeEncode)
  encoder.registerDecoder(0x42, mytypeDecode)

  all.push(new MyType(0))
  all.push(new MyType(1))
  all.push(new MyType(42))

  all.forEach(function (orig) {
    t.test('encoding a custom obj encoded as ' + orig.data, function (t) {
      var buf = encoder.encode(orig)
      t.equal(buf.length, 3, 'must have the right length')
      t.equal(buf.readUInt8(0), 0xd4, 'must have the fixext header')
      t.equal(buf.readUInt8(1), 0x42, 'must include the custom type id')
      t.equal(buf.readUInt8(2), orig.data, 'must decode correctly')
      t.end()
    })

    t.test('decoding a custom obj encoded as ' + orig.data, function (t) {
      var buf = Buffer.allocUnsafe(3)
      buf[0] = 0xd4
      buf[1] = 0x42
      buf.writeUInt8(orig.data, 2)
      t.deepEqual(encoder.decode(buf), orig, 'must decode correctly')
      t.ok(encoder.decode(buf) instanceof MyType, 'must have the correct prototype')
      t.end()
    })

    t.test('mirror test with a custom obj containing ' + orig.data, function (t) {
      t.deepEqual(encoder.decode(encoder.encode(orig)), orig, 'must stay the same')
      t.end()
    })
  })

  t.end()
})
