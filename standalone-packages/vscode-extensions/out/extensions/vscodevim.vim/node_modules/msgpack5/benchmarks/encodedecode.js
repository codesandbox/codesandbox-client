var msgpack = require('../')()
var msg = { hello: 'world' }
var encode = msgpack.encode
var decode = msgpack.decode
var max = 100000
var start
var stop
var i

function run () {
  for (i = 0; i < max; i++) {
    decode(encode(msg))
  }
}

// preheat
run()

start = Date.now()
run()
stop = Date.now()
console.log('time', stop - start)
console.log('decode/s', max / (stop - start) * 1000)
