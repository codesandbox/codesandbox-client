'use strict'

var Buffer = require('safe-buffer').Buffer
var test = require('tape').test
var msgpack = require('../')
var BufferList = require('bl')

test('must send an object through', function (t) {
  t.plan(1)

  var pack = msgpack()
  var encoder = pack.encoder()
  var decoder = pack.decoder()
  var data = { hello: 'world' }

  encoder.pipe(decoder)

  decoder.on('data', function (chunk) {
    t.deepEqual(chunk, data)
  })

  encoder.end(data)
})

test('must send three objects through', function (t) {
  var pack = msgpack()
  var encoder = pack.encoder()
  var decoder = pack.decoder()
  var data = [
    { hello: 1 },
    { hello: 2 },
    { hello: 3 }
  ]

  t.plan(data.length)

  decoder.on('data', function (chunk) {
    t.deepEqual(chunk, data.shift())
  })

  data.forEach(encoder.write.bind(encoder))

  encoder.pipe(decoder)

  encoder.end()
})

test('end-to-end', function (t) {
  var pack = msgpack()
  var encoder = pack.encoder()
  var decoder = pack.decoder()
  var data = [
    { hello: 1 },
    { hello: 2 },
    { hello: 3 }
  ]

  t.plan(data.length)

  decoder.on('data', function (chunk) {
    t.deepEqual(chunk, data.shift())
  })

  data.forEach(encoder.write.bind(encoder))

  encoder.end()

  encoder.pipe(decoder)
})

test('encoding error wrapped', function (t) {
  t.plan(1)

  var pack = msgpack()
  var encoder = pack.encoder()
  var data = new MyType()

  function MyType () {
  }

  function mytypeEncode () {
    throw new Error('muahha')
  }

  function mytypeDecode () {
  }

  pack.register(0x42, MyType, mytypeEncode, mytypeDecode)

  encoder.on('error', function (err) {
    t.equal(err.message, 'muahha')
  })

  encoder.end(data)
})

test('decoding error wrapped', function (t) {
  t.plan(1)

  var pack = msgpack()
  var encoder = pack.encoder()
  var decoder = pack.decoder()
  var data = new MyType()

  function MyType () {
  }

  function mytypeEncode () {
    return Buffer.allocUnsafe(0)
  }

  function mytypeDecode () {
    throw new Error('muahha')
  }

  pack.register(0x42, MyType, mytypeEncode, mytypeDecode)

  decoder.on('error', function (err) {
    t.equal(err.message, 'muahha')
  })

  encoder.end(data)

  encoder.pipe(decoder)
})

test('decoding error wrapped', function (t) {
  t.plan(1)

  var pack = msgpack()
  var encoder = pack.encoder({ header: false })
  var decoder = pack.decoder({ header: false })
  var data = new MyType()

  function MyType () {
  }

  function mytypeEncode () {
    return Buffer.allocUnsafe(0)
  }

  function mytypeDecode () {
    throw new Error('muahha')
  }

  pack.register(0x42, MyType, mytypeEncode, mytypeDecode)

  decoder.on('error', function (err) {
    t.equal(err.message, 'muahha')
  })

  encoder.end(data)

  encoder.pipe(decoder)
})

test('concatenated buffers work', function (t) {
  var pack = msgpack()
  var encoder = pack.encoder()
  var decoder = pack.decoder()
  var data = [
    { hello: 1 },
    { hello: 2 },
    { hello: 3 }
  ]

  t.plan(data.length)

  var bl = new BufferList()
  encoder.on('data', bl.append.bind(bl))

  data.forEach(encoder.write.bind(encoder))

  decoder.on('data', function (d) {
    t.deepEqual(d, data.shift())
  })

  encoder.once('finish', function () {
    var buf = bl.slice()
    decoder.write(buf)
  })

  encoder.end()
})
