# @starptech/webparser

Optimized html parser for HTML5 Web Components.
The parser supports features which are very useful if you want to implement a HTML formatter or anything else where a less strict parser is needed to keep all informations in the ast.

## Installation

```
npm install --save @starptech/webparser
```

## Usage

This example shows how we parse HTML

```js
const parser = new HtmlParser(options)
const result = parser.parse('<div></div>')
```

## Representation

There are four different types of nodes

- Doctype

```js
{
  value: '<!doctype html>',
  sourceSpan: null
}
```

- Element

```js
{
  name: 'div',
  attrs: [],
  children: [],
  implicitNs: false,
  sourceSpan: null,
  startSourceSpan: null,
  endSourceSpan
}
```

Void or self-closing elements can be checked when the `startSourceSpan` is equals the `endSourceSpan`.

- Attribute

```js
{
  name: 'div',
  value: 'foo',
  children: [],
  implicitNs: false,
  sourceSpan:null,
  valueSpan: null
}
```

- Comment

```js
{
  value: 'foo comment',
  sourceSpan: null
}
```

## API

##### `HtmlParser.parse(doc: string): ParseTreeResult`

Parse a document and returns a `ParseTreeResult` result.

###### `options.decodeEntities` (enabled by default)

Decode html entities in text and attributes according to HTML5 specification.

###### `options.ignoreFirstLf` (enabled by default)

Ignore first line feed of `pre`, `textarea` and `listing` tags according to HTML5 specification.

###### `options.selfClosingCustomElements` (disabled by default)

Allow custom self-closing elements.

###### `options.selfClosingElements` (disabled by default)

Allow custom and known self closing HTML elements.

###### `options.insertRequiredParents` (disabled by default)

Insert the required parent element according to the HTML5 specification.

## Credits

The parser is a modificated version of [Angular 6](https://github.com/angular/angular) template parser.
