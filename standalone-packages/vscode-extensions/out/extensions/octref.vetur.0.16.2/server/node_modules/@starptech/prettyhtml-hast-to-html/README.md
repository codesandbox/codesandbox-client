# @starptech/prettyhtml-hast-to-html

[**Hast**](https://github.com/syntax-tree/hast) to HTML converter

## Installation

```
npm install --save @starptech/prettyhtml-hast-to-html
```

## Api

###### `node.data.ignore`

When this property `true` the node is skipped for attribute collapsing.

###### `node.data.preserveAttrWrapping`

When this property `true` the node is skipped for attribute collapsing.

## Caveats

The implementation is a modified version of [hast-util-to-html](https://github.com/syntax-tree/hast-util-to-html).

- Known html attributes aren't handled case-sensitively
- Consider `printWidth`
- Don't encode attribute values
- Don't escape special characters in text
- Don't omit value behind boolean attributes
