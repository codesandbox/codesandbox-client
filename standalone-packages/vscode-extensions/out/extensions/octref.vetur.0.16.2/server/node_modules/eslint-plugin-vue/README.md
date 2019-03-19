# eslint-plugin-vue

[![NPM version](https://img.shields.io/npm/v/eslint-plugin-vue.svg?style=flat)](https://npmjs.org/package/eslint-plugin-vue)
[![NPM downloads](https://img.shields.io/npm/dm/eslint-plugin-vue.svg?style=flat)](https://npmjs.org/package/eslint-plugin-vue)
[![CircleCI](https://img.shields.io/circleci/project/github/vuejs/eslint-plugin-vue/master.svg?style=flat)](https://circleci.com/gh/vuejs/eslint-plugin-vue)
[![License](https://img.shields.io/github/license/vuejs/eslint-plugin-vue.svg?style=flat)](https://github.com/vuejs/eslint-plugin-vue/blob/master/LICENSE.md)

> Official ESLint plugin for Vue.js

## :book: Documentation

See https://vuejs.github.io/eslint-plugin-vue/

## :anchor: Versioning Policy

This plugin is following [Semantic Versioning](http://semver.org/) and [ESLint's Semantic Versioning Policy](https://github.com/eslint/eslint#semantic-versioning-policy).

## :newspaper: Changelog

We're using [GitHub Releases](https://github.com/vuejs/eslint-plugin-vue/releases).

## :beers: Contribution guide

Contributing is welcome!

See https://vuejs.github.io/eslint-plugin-vue/developer-guide/

### Working with rules

Before you start writing new rule, please read the [official ESLint guide](https://eslint.org/docs/developer-guide/working-with-rules).

Next in order to get an idea how does the AST of the code that you want to check looks like, you can use one of the following applications:
- [astexplorer.net](http://astexplorer.net/) - best tool to inspect ASTs, but it doesn't support Vue templates yet
- [ast.js.org](https://ast.js.org/) - not fully featured, but supports Vue templates syntax

Since single file components in Vue are not plain JavaScript, we can't use the default parser, and we had to introduce additional one: `vue-eslint-parser`, that generates enhanced AST with nodes that represent specific parts of the template syntax, as well as what's inside the `<script>` tag.

To know more about certain nodes in produced ASTs, go here:
- [ESTree docs](https://github.com/estree/estree)
- [vue-eslint-parser AST docs](https://github.com/mysticatea/vue-eslint-parser/blob/master/docs/ast.md)

The `vue-eslint-parser` provides few useful parser services, to help traverse the produced AST and access tokens of the template:
- `context.parserServices.defineTemplateBodyVisitor(visitor, scriptVisitor)`
- `context.parserServices.getTemplateBodyTokenStore()`

Check out an [example rule](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/mustache-interpolation-spacing.js) to get a better understanding of how these work.

Please be aware that regarding what kind of code examples you'll write in tests, you'll have to accordingly setup the parser in `RuleTester` (you can do it on per test case basis though). [See an example here](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/attribute-hyphenation.js#L19)

If you'll stuck, remember there are plenty of rules you can learn from already, and if you can't find the right solution - don't hesitate to reach out in issues. We're happy to help!

## :lock: License

See the [LICENSE](LICENSE) file for license rights and limitations (MIT).
