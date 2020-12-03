# vfile-reporter

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

Format [**vfile**][vfile]s using a stylish reporter.

![Example screenshot of **vfile-reporter**][screenshot]

## Features

*   [x] Ranges (`3:2` and `3:2-3:6`)
*   [x] Stack-traces to show where awful stuff occurs
*   [x] Successful files (configurable)
*   [x] All of [**VFile**][vfile]’s awesomeness

## Install

[npm][]:

```sh
npm install vfile-reporter
```

## Usage

Say `example.js` contains:

```js
var vfile = require('vfile')
var reporter = require('vfile-reporter')

var one = vfile({path: 'test/fixture/1.js'})
var two = vfile({path: 'test/fixture/2.js'})

one.message('Warning!', {line: 2, column: 4})

console.error(reporter([one, two]))
```

Now, running `node example` yields:

```txt
test/fixture/1.js
  2:4  warning  Warning!

test/fixture/2.js: no issues found

⚠ 1 warning
```

## API

### `reporter(files[, options])`

Generate a stylish report from the given [`vfile`][vfile], `Array.<VFile>`,
or `Error`.

##### `options`

###### `options.quiet`

Do not output anything for a file which has no warnings or errors (`boolean`,
default: `false`).  The default behaviour is to show a success message.

###### `options.silent`

Do not output messages without `fatal` set to true (`boolean`, default:
`false`).  Also sets `quiet` to `true`.

###### `options.color`

Whether to use colour (`boolean`, default: depends).  The default behaviour
is the check if [colour is supported][supports-color].

###### `options.defaultName`

Label to use for files without file-path (`string`, default: `'<stdin>'`).
If one file and no `defaultName` is given, no name will show up in the report.

## Related

*   [`vfile-reporter-json`](https://github.com/vfile/vfile-reporter-json)
    — JSON reporter
*   [`vfile-reporter-pretty`](https://github.com/vfile/vfile-reporter-pretty)
    — Pretty reporter
*   [`convert-vinyl-to-vfile`](https://github.com/dustinspecker/convert-vinyl-to-vfile)
    — Convert from [Vinyl][]
*   [`vfile-statistics`](https://github.com/vfile/vfile-statistics)
    — Count messages per category
*   [`vfile-sort`](https://github.com/vfile/vfile-sort)
    — Sort messages by line/column

## Contribute

See [`contributing.md`][contributing] in [`vfile/.github`][health] for ways to
get started.
See [`support.md`][support] for ways to get help.

This project has a [Code of Conduct][coc].
By interacting with this repository, organisation, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

Forked from [ESLint][]’s stylish reporter
(originally created by Sindre Sorhus), which is Copyright (c) 2013
Nicholas C. Zakas, and licensed under MIT.

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/vfile/vfile-reporter.svg

[build]: https://travis-ci.org/vfile/vfile-reporter

[coverage-badge]: https://img.shields.io/codecov/c/github/vfile/vfile-reporter.svg

[coverage]: https://codecov.io/github/vfile/vfile-reporter

[downloads-badge]: https://img.shields.io/npm/dm/vfile-reporter.svg

[downloads]: https://www.npmjs.com/package/vfile-reporter

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/join%20the%20community-on%20spectrum-7b16ff.svg

[chat]: https://spectrum.chat/unified/vfile

[npm]: https://docs.npmjs.com/cli/install

[contributing]: https://github.com/vfile/.github/blob/master/contributing.md

[support]: https://github.com/vfile/.github/blob/master/support.md

[health]: https://github.com/vfile/.github

[coc]: https://github.com/vfile/.github/blob/master/code-of-conduct.md

[license]: license

[author]: https://wooorm.com

[eslint]: https://github.com/eslint/eslint

[vfile]: https://github.com/vfile/vfile

[screenshot]: ./screenshot.png

[supports-color]: https://github.com/chalk/supports-color

[vinyl]: https://github.com/gulpjs/vinyl
