# is-hidden

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]

Check if `filename` is hidden (starts with a dot).

## Installation

[npm][]:

```bash
npm install is-hidden
```

## Usage

```javascript
var hidden = require('is-hidden')

hidden('.git') // => true
hidden('readme.md') // => false
```

## API

### `hidden(filename)`

Check if `filename` is hidden (starts with a dot).

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/wooorm/is-hidden.svg

[build]: https://travis-ci.org/wooorm/is-hidden

[coverage-badge]: https://img.shields.io/codecov/c/github/wooorm/is-hidden.svg

[coverage]: https://codecov.io/github/wooorm/is-hidden

[downloads-badge]: https://img.shields.io/npm/dm/is-hidden.svg

[downloads]: https://www.npmjs.com/package/is-hidden

[size-badge]: https://img.shields.io/bundlephobia/minzip/is-hidden.svg

[size]: https://bundlephobia.com/result?p=is-hidden

[npm]: https://docs.npmjs.com/cli/install

[license]: license

[author]: https://wooorm.com
