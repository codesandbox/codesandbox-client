# TypeScript Styled Plugin

TypeScript server plugin that adds intellisense to [styled component](https://styled-components.com) css strings

![](documentation/preview.gif)

[![Build Status](https://travis-ci.org/Microsoft/typescript-styled-plugin.svg?branch=master)](https://travis-ci.org/Microsoft/typescript-styled-plugin)

**Features**

- IntelliSense for CSS property names and values.
- Syntax error reporting.
- Quick fixes for misspelled property names.

## Usage
This plugin requires TypeScript 2.4 or later. It can provide intellisense in both JavaScript and TypeScript files within any editor that uses TypeScript to power their language features. This includes [VS Code](https://code.visualstudio.com), [Sublime with the TypeScript plugin](https://github.com/Microsoft/TypeScript-Sublime-Plugin), [Atom with the TypeScript plugin](https://atom.io/packages/atom-typescript), [Visual Studio](https://www.visualstudio.com), and others. 

### With VS Code
Just install the [VS Code Styled Components extension](https://github.com/styled-components/vscode-styled-components). This extension adds syntax highlighting and IntelliSense for styled components in JavaScript and TypeScript files. 

If you are using a [workspace version of TypeScript]((https://code.visualstudio.com/Docs/languages/typescript#_using-newer-typescript-versions)) however, you must manually install the plugin along side the version of TypeScript in your workspace:

```bash
npm install --save-dev typescript-styled-plugin typescript
```

Then add a `plugins` section to your [`tsconfig.json`](http://www.typescriptlang.org/docs/handbook/tsconfig-json.html) or [`jsconfig.json`](https://code.visualstudio.com/Docs/languages/javascript#_javascript-project-jsconfigjson)

```json
{
  "compilerOptions": {
    "plugins": [
      {
        "name": "typescript-styled-plugin"
      }
    ]
  }
}
```

Finally, run the `Select TypeScript version` command in VS Code to switch to use the workspace version of TypeScript for VS Code's JavaScript and TypeScript language support. You can find more information about managing typescript versions [in the VS Code documentation](https://code.visualstudio.com/Docs/languages/typescript#_using-newer-typescript-versions).

### With Sublime
This plugin works with the [Sublime TypeScript plugin](https://github.com/Microsoft/TypeScript-Sublime-Plugin).

First install the plugin and a copy of TypeScript in your workspace:

```bash
npm install --save-dev typescript-styled-plugin typescript
```

And configure Sublime to use the workspace version of TypeScript by [setting the `typescript_tsdk`](https://github.com/Microsoft/TypeScript-Sublime-Plugin#note-using-different-versions-of-typescript) setting in Sublime:

```json
{
	"typescript_tsdk": "/Users/matb/my-amazing-project/node_modules/typescript/lib"
}
```

Finally add a `plugins` section to your [`tsconfig.json`](http://www.typescriptlang.org/docs/handbook/tsconfig-json.html) or [`jsconfig.json`](https://code.visualstudio.com/Docs/languages/javascript#_javascript-project-jsconfigjson) and restart Sublime.

```json
{
  "compilerOptions": {
    "plugins": [
      {
        "name": "typescript-styled-plugin"
      }
    ]
  }
}
```

### With Atom
This plugin works with the [Atom TypeScript plugin](https://atom.io/packages/atom-typescript).

First install the plugin and a copy of TypeScript in your workspace:

```bash
npm install --save-dev typescript-styled-plugin typescript
```

Then add a `plugins` section to your [`tsconfig.json`](http://www.typescriptlang.org/docs/handbook/tsconfig-json.html) or [`jsconfig.json`](https://code.visualstudio.com/Docs/languages/javascript#_javascript-project-jsconfigjson) and restart Atom.

```json
{
  "compilerOptions": {
    "plugins": [
      {
        "name": "typescript-styled-plugin"
      }
    ]
  }
}
```

To get sytnax highlighting for styled strings in Atom, consider installing the [language-babel](https://atom.io/packages/language-babel) extension.


### With Visual Studio
This plugin works [Visual Studio 2017](https://www.visualstudio.com) using the TypeScript 2.5+ SDK.

First install the plugin in your project:

```bash
npm install --save-dev typescript-styled-plugin
```

Then add a `plugins` section to your [`tsconfig.json`](http://www.typescriptlang.org/docs/handbook/tsconfig-json.html).

```json
{
  "compilerOptions": {
    "plugins": [
      {
        "name": "typescript-styled-plugin"
      }
    ]
  }
}
```

Then reload your project to make sure the plugin has been loaded properly. Note that `jsconfig.json` projects are currently not supported in VS.


## Configuration

### Tags
This plugin adds styled component IntelliSense to any template literal [tagged](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) with `styled`, `css`, `injectGlobal` or `createGlobalStyle`:

```js
import styled from 'styled-components'

styled.button`
    color: blue;
`
```

You can enable IntelliSense for other tag names by configuring `"tags"`:

```json
{
  "compilerOptions": {
    "plugins": [
      {
        "name": "typescript-styled-plugin",
        "tags": [
          "styled",
          "css",
          "sty"
        ]
      }
    ]
  }
}
```

Now strings tagged with either `styled`, `css`, or `sty` will have styled component IntelliSense:

```js
import sty from 'styled-components'

sty.button`
    color: blue;
`
```

Tags also apply to methods on styled components. This is enabled for `extend` by default:

```js
import sty from 'styled-components'

const BlueButton = sty.button`
    color: blue;
`

const MyFancyBlueButton = BlueButton.extend`
    border: 10px solid hotpink;
`
```

### Linting

To disable error reporting, set `"validate": false` in the plugin configuration:

```json
{
  "compilerOptions": {
    "plugins": [
      {
        "name": "typescript-styled-plugin",
        "validate": false
      }
    ]
  }
}
```

You can also configure how errors are reported using linter settings. 

```json
{
  "compilerOptions": {
    "plugins": [
      {
        "name": "typescript-styled-plugin",
        "lint": {
          "vendorPrefix": "error",
          "zeroUnits": "ignore"
        }
      }
    ]
  }
}
```

The following lint options are supported:

#### compatibleVendorPrefixes
```
"ignore" | "warning" | "error"
```

When using a vendor-specific prefix make sure to also include all other vendor-specific properties. Default is `"ignore"`.

#### vendorPrefix
```
"ignore" | "warning" | "error"
```

When using a vendor-specific prefix also include the standard property. Default is `"warning"`.

#### duplicateProperties
```
"ignore" | "warning" | "error"
```

Do not use duplicate style definitions. Default is `"ignore"`.

#### emptyRules
```
"ignore" | "warning" | "error"
```

Do not use empty rulesets. Default is `"ignore"`.

#### importStatement
```
"ignore" | "warning" | "error"
```

Import statements do not load in parallel. Default is `"ignore"`.

#### boxModel
```
"ignore" | "warning" | "error"
```

Do not use width or height when using padding or border.  Default is `"ignore"`.

#### universalSelector
```
"ignore" | "warning" | "error"
```

The universal selector (*) is known to be slow. Default is `"ignore"`.

#### zeroUnits
```
"ignore" | "warning" | "error"
```

No unit for zero needed. Default is `"ignore"`.

#### fontFaceProperties
```
"ignore" | "warning" | "error"
```

@font-face rule must define 'src' and 'font-family' properties. Default is `"warning"`.

#### hexColorLength
```
"ignore" | "warning" | "error"
```

Hex colors must consist of three or six hex numbers. Default is `"error"`.

#### argumentsInColorFunction
```
"ignore" | "warning" | "error"
```

Invalid number of parameters. Default is `"error"`.

#### unknownProperties
```
"ignore" | "warning" | "error"
```

Unknown property. Default is `"warning"`.

#### ieHack
```
"ignore" | "warning" | "error"
```

IE hacks are only necessary when supporting IE7 and older. Default is `"ignore"`.

#### unknownVendorSpecificProperties
```
"ignore" | "warning" | "error"
```

Unknown vendor specific property. Default is `"ignore"`.

#### propertyIgnoredDueToDisplay
```
"ignore" | "warning" | "error"
```

Property is ignored due to the display. E.g. with 'display: inline', the width, height, margin-top, margin-bottom, and float properties have no effect. Default is `"warning"`

#### important
```
"ignore" | "warning" | "error"
```

Avoid using !important. It is an indication that the specificity of the entire CSS has gotten out of control and needs to be refactored. Default is `"ignore"`.

#### float
```
"ignore" | "warning" | "error"
```

Avoid using 'float'. Floats lead to fragile CSS that is easy to break if one aspect of the layout changes. Default is `"ignore"`.

#### idSelector
```
"ignore" | "warning" | "error"
```

Selectors should not contain IDs because these rules are too tightly coupled with the HTML. Default is `"ignore"`.

### Emmet in completion list

You can now see your Emmet abbreviations expanded and included in the completion list. 
An [upstream issue](https://github.com/Microsoft/TypeScript/issues/21999) with typescript blocks the Emmet entry in the completion list to get updated as you type. 
So for now you will have to press `Ctrl+Space` after typing out the abbreviation.

The below settings which are in sync with general Emmet settings in VS Code control the expanded Emmet abbreviations in the auto-completion list. 

#### showExpandedAbbreviation
```
"always" | "never"
```

Controls whether or not expanded Emmet abbreviations should show up in the completion list

#### showSuggestionsAsSnippets
```
`true` | `false`
```

If true, then Emmet suggestions will show up as snippets allowing you to order them as per editor.snippetSuggestions setting.

#### preferences

Preferences used to modify behavior of some actions and resolvers of Emmet.


## Contributing

To build the typescript-styled-plugin, you'll need [Git](https://git-scm.com/downloads) and [Node.js](https://nodejs.org/).

First, [fork](https://help.github.com/articles/fork-a-repo/) the typescript-styled-plugin repo and clone your fork:

```bash
git clone https://github.com/YOUR_GITHUB_ACCOUNT_NAME/typescript-styled-plugin.git
cd typescript-styled-plugin
```

Then install dev dependencies:

```bash
npm install
```

The plugin is written in [TypeScript](http://www.typescriptlang.org). The source code is in the `src/` directory with the compiled JavaScript output to the `lib/` directory. Kick off a build using the `compile` script:

```bash
npm run compile
```

switch to `e2` to install or update test dependencies:

```bash
(cd e2e && npm install)
```

and then navigate back to the project root and run the end to end tests with the `e2e` script:

```bash
cd ..
npm run e2e
```

You can submit bug fixes and features through [pull requests](https://help.github.com/articles/about-pull-requests/). To get started, first checkout a new feature branch on your local repo:

```bash
git checkout -b my-awesome-new-feature-branch
```

Make the desired code changes, commit them, and then push the changes up to your forked repository:

```bash
git push origin my-awesome-new-feature-branch
```

Then [submit a pull request](https://help.github.com/articles/creating-a-pull-request/
) against the Microsoft typescript-styled-plugin repository.

Please also see our [Code of Conduct](CODE_OF_CONDUCT.md).


## Credits

Code originally forked from: https://github.com/Quramy/ts-graphql-plugin