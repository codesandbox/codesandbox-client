'use strict'

var test = require('tape').test
var msgpack = require('../')
var noop = function () {}

test('encode a function inside a map', function (t) {
  var encoder = msgpack()
  var expected = {
    hello: 'world'
  }
  var toEncode = {
    hello: 'world',
    func: noop
  }

  t.deepEqual(encoder.decode(encoder.encode(toEncode)), expected, 'remove the function from the map')
  t.end()
})
