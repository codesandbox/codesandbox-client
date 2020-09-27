# @starptech/rehype-webparser

Parses HTML via [**Webparser**](https://github.com/Prettyhtml/prettyhtml/tree/master/packages/webparser) to a [**HAST**](https://github.com/syntax-tree/hast) syntax tree.

## Installation

```
npm install --save @starptech/rehype-webparser
```

## Usage

This example shows how we parse HTML with [**Webparser**](https://github.com/Prettyhtml/prettyhtml/blob/master/packages/webparser) transform it into [**HAST**](https://github.com/syntax-tree/hast) compatible structure and finally compile that data back to HTML with [hast-util-to-html](https://github.com/syntax-tree/hast-util-to-html).

Say we have the following file, `example.html`:

```html
<!DOCTYPE html>
<title>Hello!</title>
<h1 id="world">World!</h1>
```

And our script, `example.js`, looks as follows:

```javascript
const vfile = require('to-vfile')
const report = require('vfile-reporter')
const unified = require('unified')
const parse = require('@starptech/rehype-webparser')
const toHTML = require('hast-util-to-html')

// A compiler is needed to inform unified how to transform it back to HTML
function stringify() {
  this.Compiler = compiler

  function compiler(tree) {
    return toHTML(tree)
  }
}

unified()
  .use(parse)
  //.use(yourPlugin)
  .use(stringify)
  .process(vfile.readSync('example.html'), function(err, file) {
    console.error(report(err || file))
    console.log(String(file))
  })
```

Now, running `node example` yields:

```text
<!doctype html>
<title>Hello!</title>
<h1 id="world">World!</h1>
```

## API

### `processor.use(webparser[, options])`

Configure the `processor` to read HTML as input and process a
[**HAST**](https://github.com/syntax-tree/hast) syntax tree.

###### `options.*`

[**Webparser**](https://github.com/Prettyhtml/prettyhtml/blob/master/packages/webparser) options.
