# @starptech/expression-parser

Framework agnostic template expression parser

## Installation

```
npm install --save @starptech/expression-parser
```

## Usage

This example shows how we parse HTML

```js
const parse = require('@starptech/expression-parser')
const result = parse(`{ a + /<g></g> b }`, { brackets: ['{', '}'] })
```

## Representation

- `unescape`: Indentify a template marker as escaped. This information is useful to understand why a marker was skipped
- `expressions`: A list of template expressions
  - `start`: Start position
  - `end`: End position
  - `text`: The content of the expression

```json
{
  "unescape": "",
  "expressions": [
    {
      "start": 1,
      "end": 19,
      "text": " a + /<g></g> b "
    }
  ]
}
```

## Details

There may be more than one expression as part of one attribute value or text node, or only one replacing the entire value or node.

When used as the whole attribute value, there's no need to enclose the expression inside quotes, even if the expression contains whitespace.

Single and double quotes can be nested inside the expression.

To emit opening (left) brackets as literal text wherever an opening bracket is expected, the bracket must be prefixed with a backslash (the JS escape char '\'). This character is preserved in the output, but the parser will add a replace property for the attribute or node containing the escaped bracket, whose value is the bracket itself.

## Credits

The parser is a modificated version of [Riot](https://github.com/riot/parser) template expression parser.
