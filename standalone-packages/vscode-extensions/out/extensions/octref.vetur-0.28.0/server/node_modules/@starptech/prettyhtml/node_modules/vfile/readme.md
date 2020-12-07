# [![vfile][]][unified]

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

**vfile** is a virtual file format part of the [unified][] [collective][].

## Intro

**vfile** is a virtual file format used by [**unified**][unified], a text
processing umbrella (it powers [**retext**][retext] for natural language,
[**remark**][remark] for markdown, and [**rehype**][rehype] for HTML).
Each processors that parse, transform, and compile text, and need a virtual
representation of files and a place to store [messages][] about them.
Plus, they work in the browser.
**vfile** provides these requirements at a small size.

*   Visit [`unifiedjs.com`][website] and try its [guides][] for an overview
*   Read [unified][]’s readme for a technical intro
*   Follow us on [Medium][] and [Twitter][] to see what we’re up to
*   Check out [Contribute][] below to find out how to help out

> **vfile** is different from the excellent [**vinyl**][vinyl] in that it has
> a smaller API, a smaller size, and focuses on [messages][].

vfile can be used anywhere where files need a lightweight representation.
For example, it’s used in:

*   [`documentation`](https://github.com/documentationjs/documentation)
    — The documentation system for modern JavaScript
*   [`awoo`](https://github.com/awoojs/awoo)
    — Declarative small site generator
*   [`geojsonhint`](https://github.com/mapbox/geojsonhint)
    — Complete, fast, standards-based validation for geojson

## Sponsors

<!--lint ignore no-html maximum-line-length-->

<table>
  <tr valign="top">
    <td width="20%" align="center">
      <a href="https://zeit.co"><img src="https://avatars1.githubusercontent.com/u/14985020?s=400&v=4"></a>
      <br><br>🥇
      <a href="https://zeit.co">ZEIT</a>
    </td>
    <td width="20%" align="center">
      <a href="https://www.gatsbyjs.org"><img src="https://avatars1.githubusercontent.com/u/12551863?s=400&v=4"></a>
      <br><br>🥇
      <a href="https://www.gatsbyjs.org">Gatsby</a></td>
    <td width="20%" align="center">
      <a href="https://www.netlify.com"><img src="https://avatars1.githubusercontent.com/u/7892489?s=400&v=4"></a>
      <br><br>🥇
      <a href="https://www.netlify.com">Netlify</a>
    </td>
    <td width="20%" align="center">
      <a href="https://www.holloway.com"><img src="https://avatars1.githubusercontent.com/u/35904294?s=400&v=4"></a>
      <br><br>
      <a href="https://www.holloway.com">Holloway</a>
    </td>
    <td width="20%" align="center">
      <br><br><br><br>
      <a href="https://opencollective.com/unified"><strong>You?</strong>
    </td>
  </tr>
</table>

[**Read more about the unified collective on Medium »**][announcement]

## Install

[npm][]:

```sh
npm install vfile
```

## Table of Contents

*   [Usage](#usage)
*   [API](#api)
    *   [`VFile([options])`](#vfileoptions)
    *   [`vfile.contents`](#vfilecontents)
    *   [`vfile.cwd`](#vfilecwd)
    *   [`vfile.path`](#vfilepath)
    *   [`vfile.basename`](#vfilebasename)
    *   [`vfile.stem`](#vfilestem)
    *   [`vfile.extname`](#vfileextname)
    *   [`vfile.dirname`](#vfiledirname)
    *   [`vfile.history`](#vfilehistory)
    *   [`vfile.messages`](#vfilemessages)
    *   [`vfile.data`](#vfiledata)
    *   [`VFile#toString([encoding])`](#vfiletostringencoding)
    *   [`VFile#message(reason[, position][, origin])`](#vfilemessagereason-position-origin)
    *   [`VFile#info(reason[, position][, origin])`](#vfileinforeason-position-origin)
    *   [`VFile#fail(reason[, position][, origin])`](#vfilefailreason-position-origin)
*   [Utilities](#utilities)
*   [Reporters](#reporters)
*   [Contribute](#contribute)
*   [Acknowledgments](#acknowledgments)
*   [License](#license)

## Usage

```js
var vfile = require('vfile')

var file = vfile({path: '~/example.txt', contents: 'Alpha *braavo* charlie.'})

file.path // => '~/example.txt'
file.dirname // => '~'

file.extname = '.md'

file.basename // => 'example.md'

file.basename = 'index.text'

file.history // => ['~/example.txt', '~/example.md', '~/index.text']

file.message('`braavo` is misspelt; did you mean `bravo`?', {
  line: 1,
  column: 8
})

console.log(file.messages)
```

Yields:

```js
[ { [~/index.text:1:8: `braavo` is misspelt; did you mean `bravo`?]
    message: '`braavo` is misspelt; did you mean `bravo`?',
    name: '~/index.text:1:8',
    file: '~/index.text',
    reason: '`braavo` is misspelt; did you mean `bravo`?',
    line: 1,
    column: 8,
    location: { start: [Object], end: [Object] },
    ruleId: null,
    source: null,
    fatal: false } ]
```

## API

### `VFile([options])`

Create a new virtual file.
If `options` is `string` or `Buffer`, treats it as `{contents: options}`.
If `options` is a `VFile`, returns it.
All other options are set on the newly created `vfile`.

Path related properties are set in the following order (least specific to most
specific): `history`, `path`, `basename`, `stem`, `extname`, `dirname`.

It’s not possible to set either `dirname` or `extname` without setting either
`history`, `path`, `basename`, or `stem` as well.

###### Example

```js
vfile()
vfile('console.log("alpha");')
vfile(Buffer.from('exit 1'))
vfile({path: path.join(__dirname, 'readme.md')})
vfile({stem: 'readme', extname: '.md', dirname: __dirname})
vfile({other: 'properties', are: 'copied', ov: {e: 'r'}})
```

### `vfile.contents`

`Buffer`, `string`, `null` — Raw value.

### `vfile.cwd`

`string` — Base of `path`.
Defaults to `process.cwd()`.

### `vfile.path`

`string?` — Path of `vfile`.
Cannot be nullified.

### `vfile.basename`

`string?` — Current name (including extension) of `vfile`.
Cannot contain path separators.
Cannot be nullified either (use `file.path = file.dirname` instead).

### `vfile.stem`

`string?` — Name (without extension) of `vfile`.
Cannot be nullified, and cannot contain path separators.

### `vfile.extname`

`string?` — Extension (with dot) of `vfile`.
Cannot be set if there’s no `path` yet and cannot contain path separators.

### `vfile.dirname`

`string?` — Path to parent directory of `vfile`.
Cannot be set if there’s no `path` yet.

### `vfile.history`

`Array.<string>` — List of file-paths the file moved between.

### `vfile.messages`

[`Array.<VMessage>`][message] — List of messages associated with the file.

### `vfile.data`

`Object` — Place to store custom information.
It’s OK to store custom data directly on the `vfile`, moving it to `data` gives
a *little* more privacy.

### `VFile#toString([encoding])`

Convert contents of `vfile` to string.
If `contents` is a buffer, `encoding` is used to stringify buffers (default:
`'utf8'`).

### `VFile#message(reason[, position][, origin])`

Associates a message with the file, where `fatal` is set to `false`.
Constructs a new [`VMessage`][vmessage] and adds it to
[`vfile.messages`][messages].

##### Returns

[`VMessage`][vmessage].

### `VFile#info(reason[, position][, origin])`

Associates an informational message with the file, where `fatal` is set to
`null`.
Calls [`#message()`][message] internally.

##### Returns

[`VMessage`][vmessage].

### `VFile#fail(reason[, position][, origin])`

Associates a fatal message with the file, then immediately throws it.
Note: fatal errors mean a file is no longer processable.
Calls [`#message()`][message] internally.

##### Throws

[`VMessage`][vmessage].

## Utilities

The following list of projects includes tools for working with virtual files.
See **[unist][]** for projects working with nodes.

*   [`convert-vinyl-to-vfile`](https://github.com/dustinspecker/convert-vinyl-to-vfile)
    — Convert from [Vinyl][]
*   [`is-vfile-message`](https://github.com/shinnn/is-vfile-message)
    — Check if a value is a `VMessage` object
*   [`to-vfile`](https://github.com/vfile/to-vfile)
    — Create a virtual file from a file-path (and optionally read it)
*   [`vfile-find-down`](https://github.com/vfile/vfile-find-down)
    — Find files by searching the file system downwards
*   [`vfile-find-up`](https://github.com/vfile/vfile-find-up)
    — Find files by searching the file system upwards
*   [`vfile-glob`](https://github.com/shinnn/vfile-glob)
    — Find files by glob patterns
*   [`vfile-is`](https://github.com/vfile/vfile-is)
    — Check if a file passes a test
*   [`vfile-location`](https://github.com/vfile/vfile-location)
    — Convert between line/column- and range-based locations
*   [`vfile-message`](https://github.com/vfile/vfile-message)
    — Create a `VMessage` object (used in `vfile` itself)
*   [`vfile-messages-to-vscode-diagnostics`](https://github.com/shinnn/vfile-messages-to-vscode-diagnostics)
    — Convert to VS Code diagnostics
*   [`vfile-statistics`](https://github.com/vfile/vfile-statistics)
    — Count messages per category
*   [`vfile-sort`](https://github.com/vfile/vfile-sort)
    — Sort messages by line/column
*   [`vfile-to-eslint`](https://github.com/vfile/vfile-to-eslint)
    — Convert vfiles to ESLint formatter compatible output

## Reporters

The following list of projects show linting results for given virtual files.
Reporters *must* accept `Array.<VFile>` as their first argument, and return
`string`.
Reporters *may* accept other values too, in which case it’s suggested to stick
to `vfile-reporter`s interface.

*   [`vfile-reporter`][reporter]
    — Stylish reporter
*   [`vfile-reporter-json`](https://github.com/vfile/vfile-reporter-json)
    — JSON reporter
*   [`vfile-reporter-folder-json`](https://github.com/vfile/vfile-reporter-folder-json)
    — JSON reporter with a folder structure
*   [`vfile-reporter-pretty`](https://github.com/vfile/vfile-reporter-pretty)
    — Pretty reporter

## Contribute

See [`contributing.md`][contributing] in [`vfile/.github`][health] for ways to
get started.
See [`support.md`][support] for ways to get help.
Ideas for new utilities and tools can be posted in [`vfile/ideas`][ideas].

This project has a [Code of Conduct][coc].
By interacting with this repository, organisation, or community you agree to
abide by its terms.

## Acknowledgments

The initial release of this project was authored by
[**@wooorm**](https://github.com/wooorm).

Thanks to [**@contra**](https://github.com/contra),
[**@phated**](https://github.com/phated), and others for their work on
[Vinyl][], which was a huge inspiration.

Thanks to
[**@brendo**](https://github.com/brendo),
[**@shinnn**](https://github.com/shinnn),
[**@KyleAMathews**](https://github.com/KyleAMathews),
[**@sindresorhus**](https://github.com/sindresorhus), and
[**@denysdovhan**](https://github.com/denysdovhan)
for contributing commits since!

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/vfile/vfile.svg

[build]: https://travis-ci.org/vfile/vfile

[coverage-badge]: https://img.shields.io/codecov/c/github/vfile/vfile.svg

[coverage]: https://codecov.io/github/vfile/vfile

[downloads-badge]: https://img.shields.io/npm/dm/vfile.svg

[downloads]: https://www.npmjs.com/package/vfile

[size-badge]: https://img.shields.io/bundlephobia/minzip/vfile.svg

[size]: https://bundlephobia.com/result?p=vfile

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

[vfile]: https://raw.githubusercontent.com/vfile/vfile/7e1e6a6/logo.svg?sanitize=true

[unified]: https://github.com/unifiedjs/unified

[retext]: https://github.com/retextjs/retext

[remark]: https://github.com/remarkjs/remark

[rehype]: https://github.com/rehypejs/rehype

[vinyl]: https://github.com/gulpjs/vinyl

[unist]: https://github.com/syntax-tree/unist#list-of-utilities

[reporter]: https://github.com/vfile/vfile-reporter

[vmessage]: https://github.com/vfile/vfile-message

[messages]: #vfilemessages

[message]: #vfilemessagereason-position-origin

[website]: https://unifiedjs.com

[guides]: https://unifiedjs.com/#guides

[contribute]: #contribute

[ideas]: https://github.com/vfile/ideas

[medium]: https://medium.com/unifiedjs

[announcement]: https://medium.com/unifiedjs/collectively-evolving-through-crowdsourcing-22c359ea95cc

[twitter]: https://twitter.com/unifiedjs
