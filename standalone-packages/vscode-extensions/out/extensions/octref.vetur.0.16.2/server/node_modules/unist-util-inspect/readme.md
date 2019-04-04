# unist-util-inspect [![Build Status][build-badge]][build-page] [![Coverage Status][coverage-badge]][coverage-page]

[Unist][] node inspector.

## Installation

[npm][]:

```bash
npm install unist-util-inspect
```

## Usage

```javascript
var unified = require('unified')
var inspect = require('unist-util-inspect')
var parse = require('rehype-parse')

var tree = unified()
  .use(parse)
  .parse('<h2>Hello, world!</h2>')

console.log(inspect(tree))
```

Yields:

```text
root[1] (1:1-1:23, 0-22) [data={"quirksMode":true}]
└─ element[2] [tagName="html"]
   ├─ element[0] [tagName="head"]
   └─ element[1] [tagName="body"]
      └─ element[1] (1:1-1:23, 0-22) [tagName="h2"]
         └─ text: "Hello, world!" (1:5-1:18, 4-17)
```

## API

### `inspect(node)`

By default, color support is enabled on Node.js and turned off anywhere else.
See below on how to change that.

###### Parameters

*   `node` ([`Node`][node]).

###### Returns

`string` — String representing `node`.

### `inspect.<style>[.<style>...](node)`

Where `<style>` is either `color` or `noColor`.

To explicitly add or remove ANSI sequences, use either `inspect.color(node)`
or `inspect.noColor(node)`.

## Contribute

See [`contributing.md` in `syntax-tree/unist`][contributing] for ways to get
started.

This organisation has a [Code of Conduct][coc].  By interacting with this
repository, organisation, or community you agree to abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definition -->

[build-badge]: https://img.shields.io/travis/syntax-tree/unist-util-inspect.svg

[build-page]: https://travis-ci.org/syntax-tree/unist-util-inspect

[coverage-badge]: https://img.shields.io/codecov/c/github/syntax-tree/unist-util-inspect.svg

[coverage-page]: https://codecov.io/github/syntax-tree/unist-util-inspect?branch=master

[unist]: https://github.com/syntax-tree/unist

[npm]: https://docs.npmjs.com/cli/install

[node]: https://github.com/syntax-tree/unist#node

[license]: LICENSE

[author]: http://wooorm.com

[contributing]: https://github.com/syntax-tree/unist/blob/master/contributing.md

[coc]: https://github.com/syntax-tree/unist/blob/master/code-of-conduct.md
