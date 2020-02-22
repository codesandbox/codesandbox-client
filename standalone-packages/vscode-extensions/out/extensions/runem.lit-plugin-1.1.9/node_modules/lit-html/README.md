[![](https://vsmarketplacebadge.apphb.com/version/bierner.lit-html.svg)](https://marketplace.visualstudio.com/items?itemName=bierner.lit-html) [![Build Status](https://travis-ci.org/mjbvz/vscode-lit-html.svg?branch=master)](https://travis-ci.org/mjbvz/vscode-lit-html)

Adds syntax highlighting and language support for html inside of JavaScript and TypeScript tagged template strings, such as used in [lit-html](https://github.com/PolymerLabs/lit-html) and other frameworks.

![](https://github.com/mjbvz/vscode-lit-html/raw/master/docs/example.gif)


## Features

- Syntax highlighting of inline html blocks.
- IntelliSense for html tags and attributes.
- Quick info hovers on tags.
- Formatting support.
- Auto closing tags.
- Folding html.
- CSS completions in style blocks.
- Works with literal html strings that contain placeholders.

## Usage
The lit-html extension adds highlighting and IntelliSense for lit-html template strings in JavaScript and TypeScript. It works out of the box when you use VS Code's built-in version of TypeScript.

If you are using VS Code 1.30 or older and are [using a workspace version of typescript](https://code.visualstudio.com/Docs/languages/typescript#_using-newer-typescript-versions), you must currently configure the TS Server plugin manually by following [these instructions](https://github.com/Microsoft/typescript-lit-html-plugin#usage)

## Configuration

You can either configure this plugin using a `tsconfig` or `jsconfig` as described [here](https://github.com/Microsoft/typescript-lit-html-plugin#configuration), or configure the plugin using VS Code. This requires VS Code 1.30+ and TS 3.2+. Note the VS Code based configuration override the `tsconfig` or `jsconfig` configuration.

### Tags
This extension adds html IntelliSense to any template literal [tagged](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) with `html` or `raw`:

```js
import {html} from 'lit-html'

const a = html`
    <div></div>
`
```

You can enable IntelliSense for other tag names by settings `"lit-html.tags"`:

```json
"lit-html.tags": [
    "html",
    "template"
]
```

### Formatting
The plugin formats html code by default. You can disable this by setting `"lit-html.format.enabled": false`:

```json
"lit-html.format.enabled": false
```
