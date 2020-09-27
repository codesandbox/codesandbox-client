# vfile-statistics

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Chat][chat-badge]][chat]

Count [vfile][] messages per category (fatal, warn, info, nonfatal and total).

## Installation

[npm][]:

```bash
npm install vfile-statistics
```

## Usage

```js
var vfile = require('vfile')
var statistics = require('vfile-statistics')

var file = vfile({path: '~/example.md'})

file.message('This could be better')
file.message('That could be better')

try {
  file.fail('This is terribly wrong')
} catch (err) {}

file.info('This is perfect')

console.log(statistics(file))
```

Yields:

```js
{ fatal: 1, nonfatal: 3, warn: 2, info: 1, total: 4 }
```

## API

### `statistics(file)`

Pass a [vfile][], list of vfiles, or a list of messages
(`file.messages`), get counts per category.

###### Returns

`Object`:

*   `fatal`: fatal errors (`fatal: true`)
*   `warn`: warning messages (`fatal: false`)
*   `info`: informational messages (`fatal: null` or `fatal: undefined`)
*   `nonfatal`: warning or info messages
*   `total`: all messages

## Contribute

See [`contributing.md` in `vfile/vfile`][contributing] for ways to get started.

This organisation has a [Code of Conduct][coc].  By interacting with this
repository, organisation, or community you agree to abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/vfile/vfile-statistics.svg

[build]: https://travis-ci.org/vfile/vfile-statistics

[coverage-badge]: https://img.shields.io/codecov/c/github/vfile/vfile-statistics.svg

[coverage]: https://codecov.io/github/vfile/vfile-statistics

[downloads-badge]: https://img.shields.io/npm/dm/vfile-statistics.svg

[downloads]: https://www.npmjs.com/package/vfile-statistics

[chat-badge]: https://img.shields.io/badge/join%20the%20community-on%20spectrum-7b16ff.svg

[chat]: https://spectrum.chat/unified/vfile

[npm]: https://docs.npmjs.com/cli/install

[license]: license

[author]: https://wooorm.com

[vfile]: https://github.com/vfile/vfile

[contributing]: https://github.com/vfile/vfile/blob/master/contributing.md

[coc]: https://github.com/vfile/vfile/blob/master/code-of-conduct.md
