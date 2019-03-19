'use strict'

var test = require('tape').test
var msgpack = require('../')

test('custom type registeration assertions', function (t) {
  var encoder = msgpack()

  function Type0 (value) {
    this.value = value
  }

  function type0Encode (value) {
    return new Type0(value)
  }

  function type0Decode (type0) {
    return type0.value
  }

  function TypeNeg (value) {
    this.value = value
  }

  function typeNegEncode (value) {
    return new TypeNeg(value)
  }

  function typeNegDecode (typeneg) {
    return typeneg.value
  }

  t.doesNotThrow(function () {
    encoder.register(0, Type0, type0Decode, type0Encode)
  }, undefined, 'A type registered at 0 should not throw.')
  t.throws(function () {
    encoder.register(-1, TypeNeg, typeNegEncode, typeNegDecode)
  }, undefined, 'A type registered as a negative value should throw')

  var encoded = encoder.encode(new Type0('hi'))
  var decoded
  t.equal(encoded.readUInt8(1), 0x0, 'must use the custom type assigned')
  t.doesNotThrow(function () {
    decoded = encoder.decode(encoded)
  }, undefined, 'decoding custom 0 type should not throw')
  t.equal(decoded instanceof Type0, true, 'must decode to custom type instance')

  t.end()
})
