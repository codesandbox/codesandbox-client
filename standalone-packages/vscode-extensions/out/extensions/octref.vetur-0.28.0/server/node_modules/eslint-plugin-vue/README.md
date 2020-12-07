# eslint-plugin-vue

[![NPM version](https://img.shields.io/npm/v/eslint-plugin-vue.svg?style=flat)](https://npmjs.org/package/eslint-plugin-vue)
[![NPM downloads](https://img.shields.io/npm/dm/eslint-plugin-vue.svg?style=flat)](https://npmjs.org/package/eslint-plugin-vue)
[![CircleCI](https://img.shields.io/circleci/project/github/vuejs/eslint-plugin-vue/master.svg?style=flat)](https://circleci.com/gh/vuejs/eslint-plugin-vue)
[![License](https://img.shields.io/github/license/vuejs/eslint-plugin-vue.svg?style=flat)](https://github.com/vuejs/eslint-plugin-vue/blob/master/LICENSE.md)

> Official ESLint plugin for Vue.js

## :book: Documentation

See [the official website](https://eslint.vuejs.org).

> :exclamation: Attention - this is documentation for version `7.x` :exclamation:
>
> This branch contains `eslint-plugin-vue@next` which is a pre-released `7.0`, but it's not the default version that you get with `npm install eslint-plugin-vue`. In order to install this you need to specify either `"eslint-plugin-vue": "next"` in `package.json` or do `npm install eslint-plugin-vue@next`.
>
> Please try it and report any issues that you might have encountered.
>
> If you want to check previous releases [go here](https://github.com/vuejs/eslint-plugin-vue/releases).

## :anchor: Versioning Policy

This plugin is following [Semantic Versioning](https://semver.org/) and [ESLint's Semantic Versioning Policy](https://github.com/eslint/eslint#semantic-versioning-policy).

## :newspaper: Changelog

This project uses [GitHub Releases](https://github.com/vuejs/eslint-plugin-vue/releases).

## :beers: Contribution Guide

Contribution is welcome!

See [The ESLint Vue Plugin Developer Guide](https://eslint.vuejs.org/developer-guide/).

### Working with Rules

Before you start writing a new rule, please read [the official ESLint guide](https://eslint.org/docs/developer-guide/working-with-rules).

Next, in order to get an idea how does the AST of the code that you want to check looks like, use the [astexplorer.net].
The [astexplorer.net] is a great tool to inspect ASTs, also Vue templates are supported.

After opening [astexplorer.net], select `Vue` as the syntax and `vue-eslint-parser` as the parser.

[astexplorer.net]: https://astexplorer.net/

Since single file components in Vue are not plain JavaScript, the default parser couldn't be used, so a new one was introduced. `vue-eslint-parser` generates enhanced AST with nodes that represent specific parts of the template syntax, as well as what's inside the `<script>` tag.

To know more about certain nodes in produced ASTs, go here:
- [ESTree docs](https://github.com/estree/estree)
- [vue-eslint-parser AST docs](https://github.com/mysticatea/vue-eslint-parser/blob/master/docs/ast.md)

The `vue-eslint-parser` provides a few useful parser services that help traverse the produced AST and access tokens of the template:
- `context.parserServices.defineTemplateBodyVisitor(visitor, scriptVisitor)`
- `context.parserServices.getTemplateBodyTokenStore()`

Check out [an example rule](https://github.com/vuejs/eslint-plugin-vue/blob/master/lib/rules/mustache-interpolation-spacing.js) to get a better understanding of how these work.

Please be aware that regarding what kind of code examples you'll write in tests, you'll have to accordingly set up the parser in `RuleTester` (you can do it on a per test case basis). See an example [here](https://github.com/vuejs/eslint-plugin-vue/blob/master/tests/lib/rules/attribute-hyphenation.js#L19).

If you'll stuck, remember there are plenty of rules you can learn from already. If you can't find the right solution, don't hesitate to reach out in [issues](https://github.com/vuejs/eslint-plugin-vue/issues) – we're happy to help!

## :lock: License

See the [LICENSE](LICENSE) file for license rights and limitations (MIT).
