# @starptech/hast-util-from-webparser

Produce [HAST](https://github.com/syntax-tree/hast) compatible AST from [Webparser](https://github.com/Prettyhtml/prettyhtml/tree/master/packages/webparser)

## Installation

```
@starptech/hast-util-from-webparser
```

## Usage

Say we have the following file, `example.html`:

```html
<!DOCTYPE html><title>Hello!</title>
<h1 id="world">World!<!--after--></h1>
```

And our script, `example.js`, looks as follows:

```javascript
const vfile = require('to-vfile')
const inspect = require('unist-util-inspect')
const HtmlParser = require('@starptech/webparser').HtmlParser
const fromWebparser = require('@starptech/hast-util-from-webparser')

const filepath = 'example.html'
const doc = vfile.readSync(filepath)
const result = new HtmlParser({
  ignoreFirstLf: false,
  decodeEntities: false,
  selfClosingCustomElements: true
}).parse(String(doc), filepath)

const hast = fromWebparser(result.rootNodes)
```

Now, running `node example` yields:

```text
root[3] [data={"selfClosing":false}]
├─ doctype (1:1-1:15, 0-15) [name="html"]
├─ element[1] (1:15-1:36, 15-36) [tagName="title"][data={"selfClosing":false}]
│  └─ text: "Hello!" (1:22-1:28, 22-28)
└─ element[2] [tagName="h1"][properties={"id":"world"}][data={"selfClosing":false}]
   ├─ text: "World!" (1:51-1:57, 51-57)
   └─ comment: "after" (1:57-1:61, 57-61)
```

## API

### `fromWebparser(rootNodes[, options])`

Transform an `Node` to a [**HAST Node**](https://github.com/syntax-tree/hast#ast).
