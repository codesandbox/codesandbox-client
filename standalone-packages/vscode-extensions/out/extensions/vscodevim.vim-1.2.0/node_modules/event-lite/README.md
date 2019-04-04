# event-lite.js [![npm version](https://badge.fury.io/js/event-lite.svg)](http://badge.fury.io/js/event-lite) [![Build Status](https://travis-ci.org/kawanet/event-lite.svg?branch=master)](https://travis-ci.org/kawanet/event-lite)

Light-weight EventEmitter (less than 1KB when gzipped)

### Usage

```js
var EventLite = require("event-lite");

function MyClass() {...}             // your class

EventLite.mixin(MyClass.prototype);  // import event methods

var obj = new MyClass();
obj.on("foo", function(v) {...});    // add event listener
obj.once("bar", function(v) {...});  // add one-time event listener
obj.emit("foo", v);                  // dispatch event
obj.emit("bar", v);                  // dispatch another event
obj.off("foo");                      // remove event listener
```

### Node.js

```sh
npm install event-lite --save
```

### Browsers

```html
<script src="https://raw.githubusercontent.com/kawanet/event-lite/master/dist/event-lite.min.js"></script>
```

### TypeScript

```typescript
import EventLite = require("event-lite");

class MyClass() extends EventLite {
    // your class
}

const obj = new MyClass();
obj.on("foo", v => {...});           // add event listener
obj.once("bar", v => {...});         // add one-time event listener
obj.emit("foo", v);                  // dispatch event
obj.emit("bar", v);                  // dispatch another event
obj.off("foo");                      // remove event listener
```

### Repository

- https://github.com/kawanet/event-lite

### Documentation

- http://kawanet.github.io/event-lite/EventLite.html

### See Also

- https://nodejs.org/api/events.html

### License

The MIT License (MIT)

Copyright (c) 2015-2018 Yusuke Kawasaki

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
