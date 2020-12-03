# is-set <sup>[![Version Badge][2]][1]</sup>

[![Build Status][3]][4]
[![dependency status][5]][6]
[![dev dependency status][7]][8]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

[![npm badge][11]][1]

Is this value a JS Map? This module works cross-realm/iframe, and despite ES6 @@toStringTag.

## Example

```js
var isSet = require('is-set');
assert(!isSet(function () {}));
assert(!isSet(null));
assert(!isSet(function* () { yield 42; return Infinity; });
assert(!isSet(Symbol('foo')));
assert(!isSet(1n));
assert(!isSet(Object(1n)));

assert(!isSet(new Map()));
assert(!isSet(new WeakSet()));
assert(!isSet(new WeakMap()));

assert(isSet(new Set()));

class MySet extends Set {}
assert(isSet(new MySet()));
```

## Tests
Simply clone the repo, `npm install`, and run `npm test`

[1]: https://npmjs.org/package/is-set
[2]: http://versionbadg.es/inspect-js/is-set.svg
[3]: https://travis-ci.org/inspect-js/is-set.svg
[4]: https://travis-ci.org/inspect-js/is-set
[5]: https://david-dm.org/inspect-js/is-set.svg
[6]: https://david-dm.org/inspect-js/is-set
[7]: https://david-dm.org/inspect-js/is-set/dev-status.svg
[8]: https://david-dm.org/inspect-js/is-set#info=devDependencies
[11]: https://nodei.co/npm/is-set.png?downloads=true&stars=true
[license-image]: http://img.shields.io/npm/l/is-set.svg
[license-url]: LICENSE
[downloads-image]: http://img.shields.io/npm/dm/is-set.svg
[downloads-url]: http://npm-stat.com/charts.html?package=is-set
