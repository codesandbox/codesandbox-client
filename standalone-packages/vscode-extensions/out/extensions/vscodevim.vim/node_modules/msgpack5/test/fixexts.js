'use strict'

var Buffer = require('safe-buffer').Buffer
var test = require('tape').test
var msgpack = require('../')
var bl = require('bl')

test('encode/decode 1 byte fixext data', function (t) {
  var encoder = msgpack()
  var all = []

  function MyType (data) {
    this.data = data
  }

  function mytypeEncode (obj) {
    var buf = Buffer.allocUnsafe(1)
    buf.writeUInt8(obj.data, 0)
    return buf
  }

  function mytypeDecode (data) {
    return new MyType(data.readUInt8(0))
  }

  encoder.register(0x42, MyType, mytypeEncode, mytypeDecode)

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

test('encode/decode 2 bytes fixext data', function (t) {
  var encoder = msgpack()
  var all = []

  function MyType (data) {
    this.data = data
  }

  function mytypeEncode (obj) {
    var buf = Buffer.allocUnsafe(2)
    buf.writeUInt16BE(obj.data, 0)
    return buf
  }

  function mytypeDecode (data) {
    return new MyType(data.readUInt16BE(0))
  }

  encoder.register(0x42, MyType, mytypeEncode, mytypeDecode)

  all.push(new MyType(0))
  all.push(new MyType(1))
  all.push(new MyType(42))

  all.forEach(function (orig) {
    t.test('encoding a custom obj encoded as ' + orig.data, function (t) {
      var buf = encoder.encode(orig)
      t.equal(buf.length, 4, 'must have the right length')
      t.equal(buf.readUInt8(0), 0xd5, 'must have the fixext header')
      t.equal(buf.readUInt8(1), 0x42, 'must include the custom type id')
      t.equal(buf.readUInt16BE(2), orig.data, 'must decode correctly')
      t.end()
    })

    t.test('decoding a custom obj encoded as ' + orig.data, function (t) {
      var buf = Buffer.allocUnsafe(4)
      buf[0] = 0xd5
      buf[1] = 0x42
      buf.writeUInt16BE(orig.data, 2)
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

test('encode/decode 4 bytes fixext data', function (t) {
  var encoder = msgpack()
  var all = []

  function MyType (data) {
    this.data = data
  }

  function mytypeEncode (obj) {
    var buf = Buffer.allocUnsafe(4)
    buf.writeUInt32BE(obj.data, 0)
    return buf
  }

  function mytypeDecode (data) {
    return new MyType(data.readUInt32BE(0))
  }

  encoder.register(0x44, MyType, mytypeEncode, mytypeDecode)

  all.push(new MyType(0))
  all.push(new MyType(1))
  all.push(new MyType(42))

  all.forEach(function (orig) {
    t.test('encoding a custom obj encoded as ' + orig.data, function (t) {
      var buf = encoder.encode(orig)
      t.equal(buf.length, 6, 'must have the right length')
      t.equal(buf.readUInt8(0), 0xd6, 'must have the fixext header')
      t.equal(buf.readUInt8(1), 0x44, 'must include the custom type id')
      t.equal(buf.readUInt32BE(2), orig.data, 'must decode correctly')
      t.end()
    })

    t.test('decoding a custom obj encoded as ' + orig.data, function (t) {
      var buf = Buffer.allocUnsafe(6)
      buf[0] = 0xd6
      buf[1] = 0x44
      buf.writeUInt32BE(orig.data, 2)
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

test('encode/decode 8 bytes fixext data', function (t) {
  var encoder = msgpack()
  var all = []

  function MyType (data) {
    this.data = data
  }

  function mytypeEncode (obj) {
    var buf = Buffer.allocUnsafe(8)
    buf.writeUInt32BE(obj.data / 2, 0)
    buf.writeUInt32BE(obj.data / 2, 4)
    return buf
  }

  function mytypeDecode (data) {
    return new MyType(data.readUInt32BE(0) + data.readUInt32BE(4))
  }

  encoder.register(0x44, MyType, mytypeEncode, mytypeDecode)

  all.push(new MyType(2))
  all.push(new MyType(4))
  all.push(new MyType(42))

  all.forEach(function (orig) {
    t.test('encoding a custom obj encoded as ' + orig.data, function (t) {
      var buf = encoder.encode(orig)
      t.equal(buf.length, 10, 'must have the right length')
      t.equal(buf.readUInt8(0), 0xd7, 'must have the fixext header')
      t.equal(buf.readUInt8(1), 0x44, 'must include the custom type id')
      t.equal(buf.readUInt32BE(2) + buf.readUInt32BE(6), orig.data, 'must decode correctly')
      t.end()
    })

    t.test('decoding a custom obj encoded as ' + orig.data, function (t) {
      var buf = Buffer.allocUnsafe(10)
      buf[0] = 0xd7
      buf[1] = 0x44
      buf.writeUInt32BE(orig.data / 2, 2)
      buf.writeUInt32BE(orig.data / 2, 6)
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

test('encode/decode 16 bytes fixext data', function (t) {
  var encoder = msgpack()
  var all = []

  function MyType (data) {
    this.data = data
  }

  function mytypeEncode (obj) {
    var buf = Buffer.allocUnsafe(16)
    buf.writeUInt32BE(obj.data / 4, 0)
    buf.writeUInt32BE(obj.data / 4, 4)
    buf.writeUInt32BE(obj.data / 4, 8)
    buf.writeUInt32BE(obj.data / 4, 12)
    return buf
  }

  function mytypeDecode (data) {
    return new MyType(data.readUInt32BE(0) + data.readUInt32BE(4) + data.readUInt32BE(8) + data.readUInt32BE(12))
  }

  encoder.register(0x46, MyType, mytypeEncode, mytypeDecode)

  all.push(new MyType(4))
  all.push(new MyType(8))
  all.push(new MyType(44))

  all.forEach(function (orig) {
    t.test('encoding a custom obj encoded as ' + orig.data, function (t) {
      var buf = encoder.encode(orig)
      t.equal(buf.length, 18, 'must have the right length')
      t.equal(buf.readUInt8(0), 0xd8, 'must have the fixext header')
      t.equal(buf.readUInt8(1), 0x46, 'must include the custom type id')
      t.equal(buf.readUInt32BE(2) + buf.readUInt32BE(6) + buf.readUInt32BE(10) + buf.readUInt32BE(14), orig.data, 'must decode correctly')
      t.end()
    })

    t.test('decoding a custom obj encoded as ' + orig.data, function (t) {
      var buf = Buffer.allocUnsafe(18)
      buf[0] = 0xd8
      buf[1] = 0x46
      buf.writeUInt32BE(orig.data / 4, 2)
      buf.writeUInt32BE(orig.data / 4, 6)
      buf.writeUInt32BE(orig.data / 4, 10)
      buf.writeUInt32BE(orig.data / 4, 14)
      t.ok(encoder.decode(buf) instanceof MyType, 'must have the correct prototype')
      t.deepEqual(encoder.decode(buf), orig, 'must decode correctly')
      t.end()
    })

    t.test('mirror test with a custom obj containing ' + orig.data, function (t) {
      t.deepEqual(encoder.decode(encoder.encode(orig)), orig, 'must stay the same')
      t.end()
    })
  })

  t.end()
})

test('encode/decode fixext inside a map', function (t) {
  var encoder = msgpack()
  var all = []

  function MyType (data) {
    this.data = data
  }

  function mytypeEncode (obj) {
    var buf = Buffer.allocUnsafe(4)
    buf.writeUInt32BE(obj.data, 0)
    return buf
  }

  function mytypeDecode (data) {
    return new MyType(data.readUInt32BE(0))
  }

  encoder.register(0x42, MyType, mytypeEncode, mytypeDecode)

  all.push({ ret: new MyType(42) })
  all.push({ a: new MyType(42), b: new MyType(43) })

  all.push([1, 2, 3, 4, 5, 6].reduce(function (acc, key) {
    acc[key] = new MyType(key)
    return acc
  }, {}))

  all.forEach(function (orig) {
    t.test('mirror test with a custom obj inside a map', function (t) {
      var encoded = encoder.encode(orig)
      t.deepEqual(encoder.decode(encoded), orig, 'must stay the same')
      t.end()
    })
  })

  t.end()
})

test('encode/decode 8 bytes fixext data', function (t) {
  var encoder = msgpack()
  var all = []

  function MyType (data) {
    this.data = data
  }

  function mytypeEncode (obj) {
    var buf = Buffer.allocUnsafe(8)
    buf.writeUInt32BE(obj.data / 2, 0)
    buf.writeUInt32BE(obj.data / 2, 4)
    return buf
  }

  function mytypeDecode (data) {
    return new MyType(data.readUInt32BE(0) + data.readUInt32BE(4))
  }

  encoder.register(0x44, MyType, mytypeEncode, mytypeDecode)

  all.push(new MyType(2))
  all.push(new MyType(4))
  all.push(new MyType(42))

  all.forEach(function (orig) {
    t.test('encoding a custom obj encoded as ' + orig.data, function (t) {
      var buf = encoder.encode(orig)
      t.equal(buf.length, 10, 'must have the right length')
      t.equal(buf.readUInt8(0), 0xd7, 'must have the fixext header')
      t.equal(buf.readUInt8(1), 0x44, 'must include the custom type id')
      t.equal(buf.readUInt32BE(2) + buf.readUInt32BE(6), orig.data, 'must decode correctly')
      t.end()
    })

    t.test('decoding a custom obj encoded as ' + orig.data, function (t) {
      var buf = Buffer.allocUnsafe(10)
      buf[0] = 0xd7
      buf[1] = 0x44
      buf.writeUInt32BE(orig.data / 2, 2)
      buf.writeUInt32BE(orig.data / 2, 6)
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

test('encode/decode 16 bytes fixext data', function (t) {
  var encoder = msgpack()
  var all = []

  function MyType (data) {
    this.data = data
  }

  function mytypeEncode (obj) {
    var buf = Buffer.allocUnsafe(16)
    buf.writeUInt32BE(obj.data / 4, 0)
    buf.writeUInt32BE(obj.data / 4, 4)
    buf.writeUInt32BE(obj.data / 4, 8)
    buf.writeUInt32BE(obj.data / 4, 12)
    return buf
  }

  function mytypeDecode (data) {
    return new MyType(data.readUInt32BE(0) + data.readUInt32BE(4) + data.readUInt32BE(8) + data.readUInt32BE(12))
  }

  encoder.register(0x46, MyType, mytypeEncode, mytypeDecode)

  all.push(new MyType(4))
  all.push(new MyType(8))
  all.push(new MyType(44))

  all.forEach(function (orig) {
    t.test('encoding a custom obj encoded as ' + orig.data, function (t) {
      var buf = encoder.encode(orig)
      t.equal(buf.length, 18, 'must have the right length')
      t.equal(buf.readUInt8(0), 0xd8, 'must have the fixext header')
      t.equal(buf.readUInt8(1), 0x46, 'must include the custom type id')
      t.equal(buf.readUInt32BE(2) + buf.readUInt32BE(6) + buf.readUInt32BE(10) + buf.readUInt32BE(14), orig.data, 'must decode correctly')
      t.end()
    })

    t.test('decoding a custom obj encoded as ' + orig.data, function (t) {
      var buf = Buffer.allocUnsafe(18)
      buf[0] = 0xd8
      buf[1] = 0x46
      buf.writeUInt32BE(orig.data / 4, 2)
      buf.writeUInt32BE(orig.data / 4, 6)
      buf.writeUInt32BE(orig.data / 4, 10)
      buf.writeUInt32BE(orig.data / 4, 14)
      t.ok(encoder.decode(buf) instanceof MyType, 'must have the correct prototype')
      t.deepEqual(encoder.decode(buf), orig, 'must decode correctly')
      t.end()
    })

    t.test('mirror test with a custom obj containing ' + orig.data, function (t) {
      t.deepEqual(encoder.decode(encoder.encode(orig)), orig, 'must stay the same')
      t.end()
    })
  })

  t.test('decoding an incomplete 1 byte fixext data', function (t) {
    var encoder = msgpack()
    var buf = Buffer.allocUnsafe(2)
    buf[0] = 0xd4
    buf = bl().append(buf)
    var origLength = buf.length
    t.throws(function () {
      encoder.decode(buf)
    }, encoder.IncompleteBufferError, 'must throw IncompleteBufferError')
    t.equals(buf.length, origLength, 'must not consume any byte')
    t.end()
  })

  t.test('decoding an incomplete 2 byte fixext data', function (t) {
    var encoder = msgpack()
    var buf = Buffer.allocUnsafe(3)
    buf[0] = 0xd5
    buf = bl().append(buf)
    var origLength = buf.length
    t.throws(function () {
      encoder.decode(buf)
    }, encoder.IncompleteBufferError, 'must throw IncompleteBufferError')
    t.equals(buf.length, origLength, 'must not consume any byte')
    t.end()
  })

  t.test('decoding an incomplete 4 byte fixext data', function (t) {
    var encoder = msgpack()
    var buf = Buffer.allocUnsafe(5)
    buf[0] = 0xd6
    buf = bl().append(buf)
    var origLength = buf.length
    t.throws(function () {
      encoder.decode(buf)
    }, encoder.IncompleteBufferError, 'must throw IncompleteBufferError')
    t.equals(buf.length, origLength, 'must not consume any byte')
    t.end()
  })

  t.test('decoding an incomplete 8 byte fixext data', function (t) {
    var encoder = msgpack()
    var buf = Buffer.allocUnsafe(9)
    buf[0] = 0xd7
    buf = bl().append(buf)
    var origLength = buf.length
    t.throws(function () {
      encoder.decode(buf)
    }, encoder.IncompleteBufferError, 'must throw IncompleteBufferError')
    t.equals(buf.length, origLength, 'must not consume any byte')
    t.end()
  })

  t.test('decoding an incomplete 16 byte fixext data', function (t) {
    var encoder = msgpack()
    var buf = Buffer.allocUnsafe(17)
    buf[0] = 0xd8
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
