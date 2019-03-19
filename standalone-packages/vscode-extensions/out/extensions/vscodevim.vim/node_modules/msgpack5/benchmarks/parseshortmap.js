var msgpack = require('../')()
var bl = require('bl')
var msg = bl(msgpack.encode({ hello: 'world' }))
var decode = msgpack.decode
var max = 1000000
var start
var stop
var i

function run () {
  for (i = 0; i < max; i++) {
    decode(msg.duplicate())
  }
}

// preheat
run()

start = Date.now()
run()
stop = Date.now()
console.log('time', stop - start)
console.log('decode/s', max / (stop - start) * 1000)
