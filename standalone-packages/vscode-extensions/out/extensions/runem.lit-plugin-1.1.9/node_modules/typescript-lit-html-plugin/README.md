# TypeScript lit-html Plugin

TypeScript server plugin that adds intellisense for [lit-html](https://github.com/PolymerLabs/lit-html) template strings

![](documentation/preview.gif)

[![Build Status](https://travis-ci.org/Microsoft/typescript-lit-html-plugin.svg?branch=master)](https://travis-ci.org/Microsoft/typescript-lit-html-plugin)

**Features**

- IntelliSense for html tags and attributes.
- Quick info hovers on tags.
- Formatting support.
- Auto closing tags.
- Folding html.
- CSS completions in style blocks.
- Works with literal html strings that contain placeholders.

## Usage
This plugin requires TypeScript 2.4 or later. It can provide intellisense in both JavaScript and TypeScript files within any editor that uses TypeScript to power their language features. This includes [VS Code](https://code.visualstudio.com), [Sublime with the TypeScript plugin](https://github.com/Microsoft/TypeScript-Sublime-Plugin), [Atom with the TypeScript plugin](https://atom.io/packages/atom-typescript), [Visual Studio](https://www.visualstudio.com), and others. 

### With VS Code
The simplest way to use this plugin is through the [lit-html](https://marketplace.visualstudio.com/items?itemName=bierner.lit-html) extension. This extension automatically enables the plugin, and also adds syntax highlighting for lit-html template strings and synchronization of settings between VS Code and the plugin.

To use a specific version of this plugin with VS Code, first install the plugin and a copy of TypeScript in your workspace:

```bash
npm install --save-dev typescript-lit-html-plugin typescript
```

Then add a `plugins` section to your [`tsconfig.json`](http://www.typescriptlang.org/docs/handbook/tsconfig-json.html) or [`jsconfig.json`](https://code.visualstudio.com/Docs/languages/javascript#_javascript-project-jsconfigjson)

```json
{
  "compilerOptions": {
    "plugins": [
      {
        "name": "typescript-lit-html-plugin"
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
npm install --save-dev typescript-lit-html-plugin typescript
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
        "name": "typescript-lit-html-plugin"
      }
    ]
  }
}
```

### With Atom
This plugin works with the [Atom TypeScript plugin](https://atom.io/packages/atom-typescript).

First install the plugin and a copy of TypeScript in your workspace:

```bash
npm install --save-dev typescript-lit-html-plugin typescript
```

Then add a `plugins` section to your [`tsconfig.json`](http://www.typescriptlang.org/docs/handbook/tsconfig-json.html) or [`jsconfig.json`](https://code.visualstudio.com/Docs/languages/javascript#_javascript-project-jsconfigjson) and restart Atom.

```json
{
  "compilerOptions": {
    "plugins": [
      {
        "name": "typescript-lit-html-plugin"
      }
    ]
  }
}
```

To get syntax highlighting for lit-html strings in Atom, consider installing the [language-babel](https://atom.io/packages/language-babel) extension.


### With Visual Studio
This plugin works [Visual Studio 2017](https://www.visualstudio.com) using the TypeScript 2.5+ SDK.

First install the plugin in your project:

```bash
npm install --save-dev typescript-lit-html-plugin
```

Then add a `plugins` section to your [`tsconfig.json`](http://www.typescriptlang.org/docs/handbook/tsconfig-json.html).

```json
{
  "compilerOptions": {
    "plugins": [
      {
        "name": "typescript-lit-html-plugin"
      }
    ]
  }
}
```

Then reload your project to make sure the plugin has been loaded properly. Note that `jsconfig.json` projects are currently not supported in VS.


## Configuration

You can configure the behavior of this plugin in `plugins` section of in your `tsconfig` or `jsconfig`.

If you are using [lit-html](https://marketplace.visualstudio.com/items?itemName=bierner.lit-html) extension for VS Code, you can configure these settings in the editor settings instead of using a `tsconfig` or `jsconfig`.

### Tags
This plugin adds html IntelliSense to any template literal [tagged](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) with `html` or `raw`:

```js
import {html} from 'lit-html'

html`
    <div></div>
`
```

You can enable IntelliSense for other tag names by configuring `"tags"`:

```json
{
  "compilerOptions": {
    "plugins": [
      {
        "name": "typescript-lit-html-plugin",
        "tags": [
          "html",
          "template"
        ]
      }
    ]
  }
}
```

### Formatting
The plugin formats html code by default. You can disable this by setting `"format.enabled": false`

```json
{
  "compilerOptions": {
    "plugins": [
      {
        "name": "typescript-lit-html-plugin",
        "format": { "enabled": false }
      }
    ]
  }
}
```


## Contributing

To build the typescript-lit-html-plugin, you'll need [Git](https://git-scm.com/downloads) and [Node.js](https://nodejs.org/).

First, [fork](https://help.github.com/articles/fork-a-repo/) the typescript-lit-html-plugin repo and clone your fork:

```bash
git clone https://github.com/YOUR_GITHUB_ACCOUNT_NAME/typescript-lit-html-plugin.git
cd typescript-lit-html-plugin
```

Then install dev dependencies:

```bash
npm install
```

The plugin is written in [TypeScript](http://www.typescriptlang.org). The source code is in the `src/` directory with the compiled JavaScript output to the `lib/` directory. Kick off a build using the `compile` script:

```bash
npm run compile
```

### Testing
Run the test using the `e2e` script:

```bash
(cd e2e && npm install)
npm run e2e
```

The repo also includes a vscode `launch.json` that you can use to debug the tests and the server. The `Mocha Tests` launch configuration starts the unit tests. Once a test is running and the TypeScript server for it has been started, use the `Attach To TS Server` launch configuration to debug the plugin itself. 

### Submitting PRS

You can submit bug fixes and features through [pull requests](https://help.github.com/articles/about-pull-requests/). To get started, first checkout a new feature branch on your local repo:

```bash
git checkout -b my-awesome-new-feature-branch
```

Make the desired code changes, commit them, and then push the changes up to your forked repository:

```bash
git push origin my-awesome-new-feature-branch
```

Then [submit a pull request](https://help.github.com/articles/creating-a-pull-request/
) against the Microsoft typescript-lit-html-plugin repository.

Please also see our [Code of Conduct](CODE_OF_CONDUCT.md).
