# @starptech/prettyhtml-hastscript

Hyperscript compatible DSL for creating virtual HAST trees

## Installation

```
npm install --save @starptech/prettyhtml-hastscript
```

## Caveats

The implementation is a modified version of [**Hastscript Version 4.0.0**](https://github.com/syntax-tree/hastscript)

- Known html attributes aren't handled case-sensitively
- Don't coerce or optimize attribute values
- Don't house `<template>` node through `content` property. Handle it like any other element.
