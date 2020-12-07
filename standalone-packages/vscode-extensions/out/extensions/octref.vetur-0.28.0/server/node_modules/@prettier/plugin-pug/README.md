<p align="center">
  &nbsp;&nbsp;<a href="https://prettier.io">
    <img alt="Prettier" src="https://cdn.rawgit.com/prettier/prettier-logo/master/images/prettier-icon-light.svg"><!--
  --></a>&nbsp;&nbsp;
  &nbsp;&nbsp;<a href="https://pugjs.org">
    <img alt="Pug" src="https://cdn.rawgit.com/pugjs/pug-logo/eec436cee8fd9d1726d7839cbe99d1f694692c0c/SVG/pug-final-logo-_-colour-128.svg" height="210"><!--
  --></a>&nbsp;&nbsp;
</p>

<h2 align="center">Prettier Pug plugin</h2>

<p align="center">
  <a href="https://github.com/prettier/plugin-pug/blob/master/LICENSE">
    <img alt="license: MIT" src="https://img.shields.io/github/license/prettier/plugin-pug.svg?style=flat-square"><!--
  --></a>
  <a href="https://www.npmjs.com/package/@prettier/plugin-pug">
    <img alt="NPM package" src="https://img.shields.io/npm/v/@prettier/plugin-pug.svg?style=flat-square"><!--
  --></a>
  <a href="https://www.npmjs.com/package/@prettier/plugin-pug">
    <img alt="downloads" src="https://img.shields.io/npm/dt/@prettier/plugin-pug.svg?style=flat-square"><!--
   --></a>
  <a href="#badge">
    <img alt="code style: Prettier" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square"><!--
  --></a>
  <a href="https://github.com/prettier/plugin-pug/actions?query=branch%3Amaster+workflow%3ACI">
    <img alt="Build Status" src="https://github.com/prettier/plugin-pug/workflows/CI/badge.svg?branch=master"><!--
  --></a>
</p>

Please note that the [plugin ecosystem in Prettier](https://prettier.io/docs/en/plugins.html) is still beta, which may make <nobr>`@prettier/plugin-pug`</nobr> not ready for production use yet.

---

Plugin for Prettier to format pug code

You can disable code formatting for a particular code block by adding <nobr>`<!-- prettier-ignore -->`</nobr> before ` ```pug `.

````markdown
Pug code with custom formatting:

<!-- prettier-ignore -->
```pug
div.text( color =   "primary",  disabled  ="true"  )
```

Prettified code:

```pug
.text(color="primary", disabled)
```
````

## Getting started

Simply install `prettier` and `@prettier/plugin-pug` as your project’s npm devDependencies:

```bash
cd /path/to/project

## initialise an npm project if you haven’t done it yet
npm init
## or
yarn init

## add Prettier and its Pug plugin to project’s dev dependencies
npm install --dev prettier @prettier/plugin-pug
## or
yarn add --dev prettier @prettier/plugin-pug
```

## Usage

```bash
## format all pug files in your project
./node_modules/.bin/prettier --write "**/*.pug"
## or
yarn prettier --write "**/*.pug"
```

### Prettier Options

- `bracketSpacing`  
  If you want to configure different bracketSpacing for pug than for js code, you can use prettier's override.
  ```json
  {
    "bracketSpacing": true,
    "overrides": [
      {
        "files": "*.pug",
        "options": {
          "parser": "pug",
          "bracketSpacing": false
        }
      }
    ]
  }
  ```
- `printWidth`  
  _Currently not very accurate, but works_
- `semi`  
  If you want to configure different semi for pug than for js code, you can use prettier's override.
  ```json
  {
    "semi": false,
    "overrides": [
      {
        "files": "*.pug",
        "options": {
          "parser": "pug",
          "semi": true
        }
      }
    ]
  }
  ```
- `singleQuote`  
  If you want to configure different quotes for pug than for js code, you can use prettier's override.
  ```json
  {
    "singleQuote": true,
    "overrides": [
      {
        "files": "*.pug",
        "options": {
          "parser": "pug",
          "singleQuote": false
        }
      }
    ]
  }
  ```
- `tabWidth`  
  Use spaces for indentation
- `useTabs`  
  Use tab for indentation
  Overrides `tabWidth`

> All these six Prettier options have an alias e.g. `pugSingleQuote`  
> You can force override pug formatting with them e.g. when using `pug` embedded in `vue` files

See [changelog 1.6.0](https://github.com/prettier/plugin-pug/blob/master/CHANGELOG.md#160) for more

#### prettier-pug specific options

These are specific options only for prettier-pug  
They should be set via `Prettier`'s `overrides` option

- `attributeSeparator`  
  Change when attributes are separated by commas in tags.

  Choices:

  - `'always'` _default_ -> Always separate attributes with commas.  
    Example: `button(type="submit", (click)="play()", disabled)`
  - `'as-needed'` -> Only add commas between attributes where required.  
    Example: `button(type="submit", (click)="play()" disabled)`

- `closingBracketPosition`  
  Position of closing bracket of attributes.

  Choices:

  - `'new-line'` _default_ -> Closing bracket ends with a new line.  
    Example:

    ```pug
    input(
      type="text",
      value="my_value",
      name="my_name",
      alt="my_alt",
      autocomplete="on"
    )
    ```

  - `'last-line'` -> Closing bracket remains with last attribute's line.  
    Example:

    ```pug
    input(
      type="text",
      value="my_value",
      name="my_name",
      alt="my_alt",
      autocomplete="on")
    ```

- `commentPreserveSpaces`  
  Change behavior of spaces within comments.

  Choices:

  - `'keep-all'` _default_ -> Keep all spaces within comments.  
    Example: `// ___this _is __a __comment_`
  - `'keep-leading'` -> Keep leading spaces within comments.  
    Example: `// ___this is a comment`
  - `'trim-all'` -> Trim all spaces within comments.  
    Example: `// this is a comment`

The definitions for these options can be found in [src/options/index.ts](https://github.com/prettier/plugin-pug/blob/master/src/options/index.ts)

## Some workarounds

There are some code examples that are not formatted well with this plugin and can damage your code.  
But there are workarounds for it. These generate even better pug code!

### Examples

[Issue 53](https://github.com/prettier/plugin-pug/issues/53)

```pug
input(onClick="methodname(\"" + variable + "\", this)")
// transforms to
input(onClick="methodname(\"\" + variable + \"\", this)")

// In most cases ES6 template strings are a good solution
input(onClick=`methodname("${variable}", this)`)
```

As mentioned in [pugjs.org Attribute Interpolation](https://pugjs.org/language/attributes.html#attribute-interpolation) (2.),
you should prefere ES2015 template strings to simplify your attributes.

[Issue 54](https://github.com/prettier/plugin-pug/issues/54)

```pug
- const id = 42
- const collapsed = true

div(id=id, class='collapse' + (collapsed ? '' : ' show') + ' cardcontent')
// transforms to
.cardcontent(id=id, class="collapse' + (collapsed ? '' : ' show') + '")

// better write
.cardcontent.collapse(id=id, class=collapsed ? '' : 'show')
// Now your js logic is extracted from the plain logic
```

## Integration with editors

If you are using a text editor that supports Prettier integration (e.g. [Atom](https://atom.io/packages/prettier-atom)), you can have all Prettier perks for your Pug code too!

Use [VSCode extension](https://github.com/prettier/prettier-vscode) to get support for [VSCode](https://code.visualstudio.com).

In order to get `@prettier/plugin-pug` working in projects that do not have local npm dependencies, you can install this plugin globally:

```bash
npm install --global prettier @prettier/plugin-pug
```

In this case, you might need to check the settings of your editor’s Prettier extension to make sure that a globally installed Prettier is used when it is not found in project dependencies (i.e. `package.json`).

Nevertheless, it is recommended to rely on local copies of `prettier` and `@prettier/plugin-pug` as this reduces the chance of formatting conflicts between project collaborators.
This may happen if different global versions of Prettier or its Pug plugin are used.

Installing `@prettier/plugin-pug` either locally or globally may require you to restart the editor if formatting does not work right away.

## Implementation details

This plugin is written in TypeScript and its quality is maintained using Prettier and [Jest](https://jestjs.io).

## Contributing

If you’re interested in contributing to the development of Prettier for Pug, you can follow the [CONTRIBUTING guide from Prettier](https://github.com/prettier/prettier/blob/master/CONTRIBUTING.md), as it all applies to this repository too.

To run `@prettier/plugin-pug` locally:

- Clone this repository.
- Execute `yarn install`.
- Execute `yarn lint` to make sure that the code passes formatting and linting.
- Execute `yarn test` to make sure that TypeScript successfully compiles into JavaScript and and all unit tests pass.

## Credits

This project was inspired by https://github.com/gicentre/prettier-plugin-elm.  
Many thanks also to [@j-f1](https://github.com/j-f1), [@lipis](https://github.com/lipis) and [@azz](https://github.com/azz) for the help in transferring this repos to the prettier orga.

Thanks to [@Peilonrayz](https://github.com/Peilonrayz), who gave me the [idea](https://codereview.stackexchange.com/a/236031/128216) to rewrite the printer into a [class](https://github.com/prettier/plugin-pug/commit/a6e3a4b776ce67f0d5d763aaf1f88c0c860c6ed3) and thus make the code a lot more maintainable.
