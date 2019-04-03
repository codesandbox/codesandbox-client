# MDX for Visual Studio Code

Adds language support for [MDX](https://github.com/mdx-js/mdx).

## Installation

You can install this extension from the [Marketplace](https://marketplace.visualstudio.com/items?itemName=silvenon.mdx).

## What about `.md` files?

By default the MDX language is applied only to `.mdx` files. If MDX files in your project end with `.md`, you can tell VS Code that by adding the following to your workspace settings:

```json
"files.associations": {
  "*.md": "mdx"
},
```
