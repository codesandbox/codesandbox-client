var arch = require('../')
var test = require('tape')

test('returns x86 or x64', function (t) {
  var str = arch()
  t.ok(str === 'x86' || str === 'x64')
  t.end()
})
