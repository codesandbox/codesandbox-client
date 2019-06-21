# Module Parser for the Elm Programming Language

Built using PEG.js to parse module declaration, import statements, type names, and function names. Parsing is done synchronously and errors are thrown indicating parse errors.

Installation:

```
npm install elm-module-parser
```

Usage (TypeScript):

```typescript
import { ModuleParser, Module } from 'elm-module-parser'

const result: Module = ModuleParser.parse('module Foo exposing (Bar)')

...

```
# Goals

* Work with incomplete or invalid Elm programs
* Provide a simple interface for parsing Elm programs

# Contributing

Please open an issue to begin discussion.

# Future

Parse more of the Elm programming language.