'use strict'

var Buffer = require('safe-buffer').Buffer
var msgpack = require('./')() // namespace our extensions
var a = new MyType(2, 'a')
var encode = msgpack.encode
var decode = msgpack.decode

msgpack.register(0x42, MyType, mytipeEncode, mytipeDecode)

console.log(encode({ 'hello': 'world' }).toString('hex'))
// 81a568656c6c6fa5776f726c64
console.log(decode(encode({ 'hello': 'world' })))
// { hello: 'world' }
console.log(encode(a).toString('hex'))
// d5426161
console.log(decode(encode(a)) instanceof MyType)
// true
console.log(decode(encode(a)))
// { value: 'a', size: 2 }

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
  var i

  for (i = 0; i < data.length; i++) {
    if (data.readUInt8(0) != data.readUInt8(i)) { // eslint-disable-line
      throw new Error('should all be the same')
    }
  }

  return result
}
