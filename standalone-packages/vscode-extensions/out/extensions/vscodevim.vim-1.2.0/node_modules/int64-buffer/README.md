# int64-buffer

64bit Long Integer on Buffer/Array/ArrayBuffer in Pure JavaScript

[![npm version](https://badge.fury.io/js/int64-buffer.svg)](http://badge.fury.io/js/int64-buffer) [![Build Status](https://travis-ci.org/kawanet/int64-buffer.svg?branch=master)](https://travis-ci.org/kawanet/int64-buffer)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/int64-buffer.svg)](https://saucelabs.com/u/int64-buffer)

JavaScript's number based on IEEE-754 could only handle [53 bits](https://en.wikipedia.org/wiki/Double-precision_floating-point_format) precision.
This module provides two pair of classes: `Int64BE`/`Uint64BE` and `Int64LE`/`Uint64LE` which could hold 64 bits long integer and loose no bit.

### Features

- `Int64BE`/`Int64LE` for signed integer, `Uint64BE`/`Uint64LE` for unsigned.
- `Int64BE`/`Uint64BE` for big-endian, `Uint64BE`/`Uint64LE` for little-endian.
- `Buffer`/`Uint8Array`/`Array`/`Array`-like storage of 8 bytes length with offset.
- No mathematical methods provided, such as `add()`, `sub()`, `mul()`, `div()` etc.
- Optimized only for 64 bits. If you need Int128, use [bignum](https://www.npmjs.com/package/bignum) etc.
- Small. 3KB when minified. No other module required. Portable pure JavaScript.
- [Tested](https://travis-ci.org/kawanet/int64-buffer) on node.js v4, v6, v8 and [Web browsers](https://saucelabs.com/u/int64-buffer).

### Usage

`Int64BE` is the class to host a 64 bit signed long integer `int64_t`.

```js
var Int64BE = require("int64-buffer").Int64BE;

var big = new Int64BE(-1);

console.log(big - 0); // -1

console.log(big.toBuffer()); // <Buffer ff ff ff ff ff ff ff ff>
```

It uses `Buffer` on Node.js and `Uint8Array` on modern Web browsers.

`Uint64BE` is the class to host a 64 bit unsigned positive long integer `uint64_t`.

```js
var Uint64BE = require("int64-buffer").Uint64BE;

var big = new Uint64BE(Math.pow(2, 63)); // a big number with 64 bits

console.log(big - 0); // 9223372036854776000 = IEEE-754 loses last bits

console.log(big + ""); // "9223372036854775808" = perfectly correct
```

`Int64LE` and `Uint64LE` work as same as above but with little-endian storage.

### Input Constructor

- new Uint64BE(number)

```js
var big = new Uint64BE(1234567890);
console.log(big - 0); // 1234567890
```

- new Uint64BE(high, low)

```js
var big = new Uint64BE(0x12345678, 0x9abcdef0);
console.log(big.toString(16)); // "123456789abcdef0"
```

- new Uint64BE(string, radix)

```js
var big = new Uint64BE("123456789abcdef0", 16);
console.log(big.toString(16)); // "123456789abcdef0"
```

- new Uint64BE(buffer)

```js
var buffer = new Buffer([1,2,3,4,5,6,7,8]);
var big = new Uint64BE(buffer);
console.log(big.toString(16)); // "102030405060708"
```

- new Uint64BE(uint8array)

```js
var uint8array = new Uint8Array([1,2,3,4,5,6,7,8]);
var big = new Uint64BE(uint8array);
console.log(big.toString(16)); // "102030405060708"
```

- new Uint64BE(arraybuffer)

```js
var arraybuffer = (new Uint8Array([1,2,3,4,5,6,7,8])).buffer;
var big = new Uint64BE(arraybuffer);
console.log(big.toString(16)); // "102030405060708"
```

- new Uint64BE(array)

```js
var array = [1,2,3,4,5,6,7,8];
var big = new Uint64BE(array);
console.log(big.toString(16)); // "102030405060708"
```

- new Uint64BE(buffer, offset)

```js
var buffer = new Buffer([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]);
var big = new Uint64BE(buffer, 8);
console.log(big.toString(16)); // "90a0b0c0d0e0f10"
```

- new Uint64BE(buffer, offset, number)

```js
var buffer = new Buffer(16);
var big = new Uint64BE(buffer, 8, 0x1234567890);
console.log(big.toString(16)); // "1234567890"
console.log(buffer[15].toString(16)); // "90"
```

- new Uint64BE(buffer, offset, high, low)

```js
var buffer = new Uint8Array(16);
var big = new Uint64BE(buffer, 8, 0x12345678, 0x9abcdef0);
console.log(big.toString(16)); // "123456789abcdef0"
console.log(buffer[15].toString(16)); // "f0"
```

- new Uint64BE(buffer, offset, string, radix)

```js
var buffer = new Array(16);
var big = new Uint64BE(buffer, 8, "123456789abcdef0", 16);
console.log(big.toString(16)); // "123456789abcdef0"
console.log(buffer[15].toString(16)); // "f0"
```

### Output Methods

- Number context

```js
var big = Uint64BE(1234567890);
console.log(big - 0); // 1234567890
```

- String context

```js
var big = Uint64BE(1234567890);
console.log(big + ""); // "1234567890"
```

- JSON context

```js
var big = Uint64BE();
console.log(JSON.stringify({big: big})); // {"big":1234567890}
```

- toNumber()

```js
var big = Uint64BE(1234567890);
console.log(big.toNumber()); // 1234567890
```

- toString(radix)

```js
var big = Uint64BE(0x1234567890);
console.log(big.toString()); // "78187493520"
console.log(big.toString(16)); // "1234567890"
```

- toBuffer()

```js
var big = Uint64BE([1,2,3,4,5,6,7,8]);
console.log(big.toBuffer()); // <Buffer 01 02 03 04 05 06 07 08>
```

- toArrayBuffer()

```js
var big = Uint64BE(0);
var buf = new Int8Array(big.toArrayBuffer());
console.log(buf); // Int8Array { '0': 1, '1': 2, '2': 3, '3': 4, '4': 5, '5': 6, '6': 7, '7': 8 }
```

- toArray()

```js
var big = Uint64BE([1,2,3,4,5,6,7,8]);
console.log(big.toArray()); // [ 1, 2, 3, 4, 5, 6, 7, 8 ]
```

### Browsers Build

[int64-buffer.min.js](https://rawgit.com/kawanet/int64-buffer/master/dist/int64-buffer.min.js) is [tested](https://saucelabs.com/u/int64-buffer) on major Web browsers.

```html
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<script src="https://rawgit.com/kawanet/int64-buffer/master/dist/int64-buffer.min.js"></script>
<script>

  var i = Int64BE("1234567890123456789");
  console.log(i.toString(10)); // "1234567890123456789"
  
  var u = new Uint64BE([0x01, 0x23, 0x45, 0x67, 0x89, 0xAB, 0xCD, 0xEF]);
  console.log(u.toString(16)); // "123456789abcdef"

</script>
```

### Installation

```sh
npm install int64-buffer --save
```

### GitHub

- [https://github.com/kawanet/int64-buffer](https://github.com/kawanet/int64-buffer)

### The MIT License (MIT)

Copyright (c) 2015-2017 Yusuke Kawasaki

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
