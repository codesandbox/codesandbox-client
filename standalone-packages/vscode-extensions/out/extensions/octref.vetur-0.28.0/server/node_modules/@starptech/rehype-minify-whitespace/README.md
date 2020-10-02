# @starptech/rehype-minify-whitespace

Collapse whitespace.

Normally, collapses to a single space. If `newlines: true`,
collapses white-space containing newlines to `'\n'` instead
of `' '`.

## Installation

```
npm install --save @starptech/rehype-minify-whitespace
```

## Usage

##### In

```html
<h1>Heading</h1>
···→ →···foo···→
<p><strong>This</strong> and <em>that</em></p>
```

##### Out

```html
<h1>Heading</h1>
foo
<p><strong>This</strong> and <em>that</em></p>
```

## Api

###### `node.data.ignore`

When this property is `true` the node is skipped for whitespace handling.

###### `node.data.preserveWhitespace`

When this property is `true` the node is skipped for whitespace handling.

## Caveats

The implementation is a modified version of [**Rehype rehype-minify-whitespace 2.0.3**](https://github.com/rehypejs/rehype-minify/tree/master/packages/rehype-minify-whitespace)
