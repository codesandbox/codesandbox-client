# vscode-nls


CommonJS module to support externalization and localization. The module only depends on Node.js however its
primary use case is for VSCode extensions.

[![Build Status](https://travis-ci.org/Microsoft/vscode-nls.svg?branch=master)](https://travis-ci.org/Microsoft/vscode-nls)
[![NPM Version](https://img.shields.io/npm/v/vscode-nls.svg)](https://npmjs.org/package/vscode-nls)
[![NPM Downloads](https://img.shields.io/npm/dm/vscode-nls.svg)](https://npmjs.org/package/vscode-nls)

## Usage

```typescript
import * as nls from 'vscode-nls';

let localize = nls.config({ locale: 'de-DE' })();

console.log(localize('keyOne', "Hello World"));
console.log(localize('keyTwo', "Current Date {0}", Date.now()));
```

The `config` call configures the nls module and should only be called once in the applications entry point. You pass in the locale you want to use and whether the resolved locale should be cached for all further calls. The config call returns a function which is used to load a message bundle. During development time the argument should stay empty. There is another tool that helps extracting the message from your sources and it creates the message bundles autmatically for you. The tool is available [here](https://github.com/Microsoft/vscode-nls-dev).

In secondary modules loaded from the 'main' module no configuration is necessary. However you still need to load the nls module and load the message bundle. This looks like this:

```typescript
import * as nls from 'vscode-nls';

let localize = nls.loadMessageBundle();

console.log(localize('keyOne', "Hello World"));
```

During development time the strings in the code are presented to the user. If the locale is set to 'pseudo' the messages are modified in the following form:

* vowels are doubled
* the string is prefixed with '\uFF3B' (Unicode zenkaku representation for [) and postfixed with '\uFF3D' (Unicode zenkaku representation for ])

## History

### 4.1.1

* Fixes [Bundled nls doesn't work](https://github.com/microsoft/vscode-nls/issues/23)

### 4.1.0

* support language and locale when resolving options from `VSCODE_NLS_CONFIG` setting.

### 4.0.0

* make vscode-nls webpack friendly (removal of require calls)
* narrow type for var args in `localize` function to `string | number | boolean | null | undefined`

### 3.0.0:

* added support to bundle the strings into a single `nls.bundle(.${locale})?.json` file.
* added support for VS Code language packs.

### 2.0.2:

* moved to TypeScript 2.1.5. Adapted to @types d.ts files instead of including typings directly into the repository.

### 2.0.1:

* based on TypeScritp 2.0. Since TS changed the shape of the d.ts files for 2.0.x a major version number got introduce to not
  break existing clients using TypeScript 1.8.x.

## LICENSE
[MIT](LICENSE)