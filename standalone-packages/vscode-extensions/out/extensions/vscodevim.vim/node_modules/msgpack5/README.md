msgpack5&nbsp;&nbsp;[![Build Status](https://travis-ci.org/mcollina/msgpack5.png)](https://travis-ci.org/mcollina/msgpack5)
========

A msgpack v5 implementation for node.js and the browser, with extension point support.

Install
-------

```bash
npm install msgpack5 --save
```


Usage
-----

```js
var msgpack = require('msgpack5')() // namespace our extensions
  , a       = new MyType(2, 'a')
  , encode  = msgpack.encode
  , decode  = msgpack.decode

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

function MyType(size, value) {
  this.value = value
  this.size  = size
}

function mytipeEncode(obj) {
  var buf = new Buffer(obj.size)
  buf.fill(obj.value)
  return buf
}

function mytipeDecode(data) {
  var result = new MyType(data.length, data.toString('utf8', 0, 1))
    , i

  for (i = 0; i < data.length; i++) {
    if (data.readUInt8(0) != data.readUInt8(i)) {
      throw new Error('should all be the same')
    }
  }

  return result
}
```

In the Browser
-----------

This library is compatible with [Browserify](http://npm.im/browserify).

If you want to use standalone, grab the file in the `dist` folder of
this repo, and use in your own HTML page, the module will expose a
`msgpack5` global.


```
<script type="text/javascript"
        src="./msgpack5.min.js">
</script>
```

### To build

```
	npm run build
```

API
---

<a name="api"></a>

## API

  * <a href="#msgpack"><code><b>msgpack()</b></code></a>
  * <a href="#encode"><code>msgpack().<b>encode()</b></code></a>
  * <a href="#decode"><code>msgpack().<b>decode()</b></code></a>
  * <a href="#registerEncoder"><code>msgpack().<b>registerEncoder()</b></code></a>
  * <a href="#registerDecoder"><code>msgpack().<b>registerDecoder()</b></code></a>
  * <a href="#register"><code>msgpack().<b>register()</b></code></a>
  * <a href="#encoder"><code>msgpack().<b>encoder()</b></code></a>
  * <a href="#decoder"><code>msgpack().<b>decoder()</b></code></a>

-------------------------------------------------------
<a name="msgpack"></a>

### msgpack(options(obj))

Creates a new instance on which you can register new types for being
encoded.

options:

- `forceFloat64`, a boolean to that forces all floats to be encoded as 64-bits floats. Defaults to false.
- `compatibilityMode`, a boolean that enables "compatibility mode" which doesn't use str 8 format. Defaults to false.

-------------------------------------------------------
<a name="encode"></a>

### encode(object)

Encodes `object` in msgpack, returns a [bl](http://npm.im/bl).

-------------------------------------------------------
<a name="decode"></a>

### decode(buf)

Decodes buf from in msgpack. `buf` can be a `Buffer` or a [bl](http://npm.im/bl) instance.

In order to support a stream interface, a user must pass in a [bl](http://npm.im/bl) instance.

-------------------------------------------------------
<a name="registerEncoder"></a>

### registerEncoder(check(obj), encode(obj))

Register a new custom object type for being automatically encoded.
The arguments are:

- `check`, a function that will be called to check if the passed
  object should be encoded with the `encode` function
- `encode`, a function that will be called to encode an object in binary
  form; this function __must__ return a `Buffer` which include the same type
  for [registerDecoder](#registerDecoder).

-------------------------------------------------------
<a name="registerDecoder"></a>

### registerDecoder(type, decode(buf))

Register a new custom object type for being automatically decoded.
The arguments are:

- `type`, is a greater than zero integer identificating the type once serialized
- `decode`, a function that will be called to decode the object from
  the passed `Buffer`


-------------------------------------------------------
<a name="register"></a>

### register(type, constructor, encode(obj), decode(buf))

Register a new custom object type for being automatically encoded and
decoded. The arguments are:

- `type`, is a greater than zero integer identificating the type once serialized
- `constructor`, the function that will be used to match the objects
  with `instanceof`
- `encode`, a function that will be called to encode an object in binary
  form; this function __must__ return a `Buffer` that can be
  deserialized by the `decode` function
- `decode`, a function that will be called to decode the object from
  the passed `Buffer`

This is just a commodity that calls
[`registerEncoder`](#registerEncoder) and
[`registerDecoder`](#registerDecoder) internally.

-------------------------------------------------------
<a name="encoder"></a>

### encoder()

Builds a stream in object mode that encodes msgpack.

-------------------------------------------------------
<a name="decoder"></a>

### decoder()

Builds a stream in object mode that decodes msgpack.

LevelUp Support
---------------

__msgpack5__ can be used as a LevelUp
[`valueEncoding`](https://github.com/rvagg/node-levelup#leveluplocation-options-callback) straight away:

```js
var level = require('level')
  , pack  = msgpack()
  , db    = level('foo', {
      valueEncoding: pack
    })
  , obj   = { my: 'obj' }

db.put('hello', obj, function(err) {
  db.get('hello', function(err, result) {
    console.log(result)
    db.close()
  })
})

```

Related projects
----------------

- [msgpack5rpc](http://npmjs.com/package/msgpack5rpc): An implementation of the
  [msgpack-rpc spec](https://github.com/msgpack-rpc/msgpack-rpc/blob/master/spec.md)
  on top of this library.

Disclaimer
----------

This library is built fully on JS and on [bl](http://npm.im/bl) to
simplify the code. Every improvement that keeps the same API is welcome.

Acknowledgements
----------------

This project was kindly sponsored by [nearForm](http://nearform.com).


This library was originally built as the data format for
[JSChan](http://npm.im/jschan).

License
-------

MIT
