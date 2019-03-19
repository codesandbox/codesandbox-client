'use strict'

var Buffer = require('safe-buffer').Buffer
var test = require('tape').test
var fs = require('fs')
var p = require('path')
var msgpack = require('../')

test('encode/decode map with multiple short buffers', function (t) {
  var map = {
    first: Buffer.from('first'),
    second: Buffer.from('second'),
    third: Buffer.from('third')
  }
  var pack = msgpack()

  t.deepEqual(pack.decode(pack.encode(map)), map)
  t.end()
})

if (process.title !== 'browser') {
  test('encode/decode map with all files in this directory', function (t) {
    var files = fs.readdirSync(__dirname)
    var map = files.reduce(function (acc, file) {
      acc[file] = fs.readFileSync(p.join(__dirname, file))
      return acc
    }, {})
    var pack = msgpack()

    t.deepEqual(pack.decode(pack.encode(map)), map)
    t.end()
  })
}
