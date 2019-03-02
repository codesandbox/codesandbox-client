# Changelog

### 0.14.5 | 2019-01-02 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.14.5/vspackage)

- Update to eslint-plugin-vue@5. #1034.

### 0.14.4 | 2018-12-26 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.14.4/vspackage)

- Nuxt support. See also [nuxt/nuxt.js#4524](https://github.com/nuxt/nuxt.js/pull/4524). #870.

### 0.14.3 | 2018-11-29 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.14.3/vspackage)

- Remove `flatmap-stream` from Vetur's `devDependencies`. `flatmap-stream` has never been shipped to user.
- Fix a bug where Vetur cannot format `style` regions correctly when using `vetur.format.defaultFormatterOptions.prettier`. #997 and #998.

### 0.14.2 | 2018-11-26 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.14.2/vspackage)

- Allow `vetur.format.defaultFormatterOptions.prettier` as global prettier config. You do not need this if you have a global config such as `~/.prettierrc` at your home directory. #986

### 0.14.1 | 2018-11-26 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.14.1/vspackage)

- Fix a null pointer error when no local prettier config can be found.

### 0.14.0 | 2018-11-26 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.14.0/vspackage)

- Using `vscode-css-langaugeservice`'s latest data for Stylus langauge features. Thanks to contribution from [@DeltaEvo](https://github.com/DeltaEvo). #953.
- `.ts` and `.map` files has been removed from published extensions. Thanks to contributionf rom [@mjbvz](https://github.com/mjbvz). #955.
- [Quasar Framework](https://quasar-framework.org/) includes a `vetur` key in its [`package.json`](https://github.com/quasarframework/quasar/blob/057f0cd2a340c2b078dec814bd1947189b8707ee/package.json#L109-L112), and Vetur would read Quasar tag/attribute definitions for auto-completion and other language features. This feature is now available to any dependencies that contain a `vetur` key. [vuetypes](https://github.com/octref/vuetypes) is an attempt to standardize this format. Thanks to contribution from [@Zenser](https://github.com/Zenser). #941.

#### Formatter Changes

Read updated doc at: https://vuejs.github.io/vetur/formatting.html#formatters.

- Upgraded to latest versions of `prettier`, `prettier-eslint`, `prettyhtml` formatters.
- Formatters no longer inherit from `editor.insertSpaces` and `editor.tabSize`. Instead, Vetur now offers two options that are inherited by all formatters. This is because VS Code sets `editor.detectIndentation: true` by default, and the detected indentation for Vue files not always match the `editor.insertSpaces` and `editor.tabSize` settings. #982.

  ```json
  {
    "vetur.format.options.useTabs": false,
    "vetur.format.options.tabSize": 2
  }
  ```
- Vetur no longer reads settings from `prettier.*`. All settings must be specified in a local configuration file. #982.
- `prettier-eslint` is added as an option for `vetur.format.defaultFormatter.js`. #982.
- Various bug fixes for `prettier-eslint` not reading config correctly. Thanks to contribution form [@Coder-256](https://github.com/Coder-256). #934 and #942.
- `prettyhtml` becomes the default formatter for `<template>` section.
- `js-beautify-html` becomes more actively maintained and is no longer a deprecated option for HTML formatting.

### 0.13.0 | 2018-10-04 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.13.0/vspackage)

- Revert TS to 2.8.4, which is the same minor version as 0.12.6 release for perf issues. #913.
- [prettyhtml](https://github.com/Prettyhtml/prettyhtml) support. Thanks to contribution from [@StarpTech](https://github.com/StarpTech). #561 and #491.
- Default `unformatted` option to an empty array to accommodate js-beautify's new behavior. #921.
- Fix a stylus formatting error when stylus code contains comments. Thanks to contribution from [@ThisIsManta](https://github.com/ThisIsManta). #918.
- If local prettier exists in `node_modules`, prefer using it instead of bundled version of prettier. Thanks to contribution from [@maeldur](https://github.com/maeldur). #876.

### 0.12.7 | 2018-09-24 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.12.7/vspackage)

- Fix a oversized publish that's 200MB (normal publish should be around 30MB). #898.
- Add completion for [Quasar Framework](https://github.com/vuejs/vetur/pull/865). Thanks to contribution from [@rstoenescu](https://github.com/rstoenescu). #865.
- Many dependency upgrade, including `vscode-languageserver`, `vscode-languageclient` from V3 to V5, `js-beautify` to 1.8.6, `prettier` to 1.14.3, etc.
- More test coverage. #863.

### 0.12.6 | 2018-08-06 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.12.6/vspackage)

- Revert embedded pug languageId to jade, so Cmd+/ uses `//-` for comment. #840.
- Fix syntax highlight for `:snake_case` properties in HTML. Thanks to contribution from [@davidhewitt](https://github.com/davidhewitt). #830.
- Auto completion for [Buefy](https://buefy.github.io) framework. Thanks to contribution from [@jtommy](https://github.com/jtommy). #824.
- Fix description for `v-cloak`. Thanks to contribution by [@snkashis](https://github.com/snkashis). #816.

### 0.12.5 | 2018-06-06 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.12.5/vspackage)

- Use `source.js#expression` for Vue interpolation values. Fix #811 and #804
- Fix a pug syntax highlighting issue. #812

### 0.12.4 | 2018-06-05 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.12.4/vspackage)

- Improved file watching that updates completion and diagnostics in Vue files when TS/JS file changes. #355

### 0.12.3 | 2018-05-17 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.12.3/vspackage)

- Removed chokidar watcher.

### 0.12.2 | 2018-05-17 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.12.2/vspackage)

- Temporarily disable file watcher for perf problem & will bring it back in next version. #789.

### 0.12.1 | 2018-05-14 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.12.1/vspackage)

- Haml syntax highlighting. #739.
- Remove restricted file schemes for live share.
- Fix an issue where Vetur failed to read emmet configs and cause emmet and other completions to fail.

### 0.11.8 | 2018-05-14 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.11.8/vspackage)

- Update TypeScript Version to allow usage of `!` for definite assignment assertions.
- Add single quote as trigger character. Fix #743
- Add `arrowParens` option for Prettier
- Upgrade vscode-emmet-helper. Fix #412. Fix #426
- Add `vetur.completion.useScaffoldSnippets`. Fix #698
- Skip template completion trigger in script. Fix #705
- Fix script definition lookup position error. Fix #741
- Add a crude file watcher. Now Vetur will pick up text change in TS/JS. Note this feature is experimental. Partially fix #355

### 0.11.7 | 2018-01-28 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.11.7/vspackage)

- Better default scaffold template for TypeScript. #669.
- Partial support for quoteless attribute value in HTML5. #648.
- Fix a grammar error for custom blocks. #664.
- Mark the `/` as `tag.end.html` in self-closing component. #650.
- Fix a Stylus formatting issue where it adds extra parentheses. #638.

### 0.11.6 | 2018-01-16 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.11.6/vspackage)

- Basic Vuetify completion. #647.
- Add auto import. #606.
- Optimize vsix size to reduce bundle size by 33%.
- Only read parser option for using prettier for script section. #574.
- Fix syntax highlighting for single line, self-closing template/style/script. #591.
- Fix "Language client is not ready yet" error. #576.
- Fix dulplicate bracket in scaffold completion. #367.

### 0.11.5 | 2017-12-15 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.11.5/vspackage)

- Fix an error incorrectly reporting `<template>` should have end tag. #578.
- Change Vetur's template linting to use [`essential`](https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention) instead of [`recommended`](https://github.com/vuejs/eslint-plugin-vue#priority-c-recommended-minimizing-arbitrary-choices-and-cognitive-overhead) rule set of `eslint-plugin-vue`. #579.
- Nicer display of diagnostic error from `eslint-plugin-vue`.

### 0.11.4 | 2017-12-14 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.11.4/vspackage)

- Upgrade to latest prettier & prettier-eslint.
- Upgrade to latest vscode-css-languageservice that has css grid support. #437.
- Upgrade to latest eslint-plugin-vue.
  - Fix an error reporting "v-model directives don't support dynamic input types. #554.
  - Fix an error reporting "`key` must not be allowed in `<slot>`". #505.
- Include `/server` in distribution instead of downloading from NPM to a different location. Fix a issue where VS Code has trouble finding the Language Server. #568.
- Color Picker support. #559.
- Fix a bug with imprecise find definition. #549.
- Fix a vue-html grammar rule that does not highlight Vue templates after `</template>`. #548.
- Upgrade grammar so broken syntax in each region will not affect syntax highlighting outside that specific region. #174.
- Always ignore `end_with_newline` option in js-beautify so the template formats properly. #544.


### 0.11.3 | 2017-11-13 

- Hot fix for a bug in formatting `<template>` with js-beautify where it adds `</template>` to the end. #539.

### 0.11.2 | 2017-11-13 

- Workaround a js-beautify bug which indents multi-line comment. #535.
- Docs for generating grammar for custom blocks: https://vuejs.github.io/vetur/highlighting.html.
- Allow `php` as one of the custom block language. #536.
- Disallow longer version of `lang` in custom block setting (`js` over `javascript`, `md` over `markdown`).
- Pretty print generated gramamr so it's readable. (You can find it at `~/.vscode/extensions/octref.vetur-<version>./syntaxes/vue-generated.json`).

### 0.11.1 | 2017-11-10 

- Syntax highlighting for Custom Block. #210.
  - Added setting `vetur.grammar.customBlocks`.
  - Added command "Vetur: Generate grammar from `vetur.grammar.customBlocks`".

### 0.11.0 | 2017-11-06 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.11.0/vspackage)

- Better completion order in js/ts. #489.
- Fix some Stylus formatting issues. #471.
- prettier-eslint support. #478.
- Fix Vetur not correctly distinguishing js/ts regions. #504 and #476.
- Fix a bug where Vetur misses completion item details. #418.
- Prefer user jsconfig/tsconfig compilerOptions in Vue Language Server. #515 and #512.

### 0.10.1 | 2017-10-19 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.10.1/vspackage)

- Remove range formatter. #100.
- Remove onTypeFormat. #477.
- Upgrade TypeScript for better large workspace handling. #390.

### 0.10.0 | 2017-10-19 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.10.0/vspackage)

- :red_circle: Breaking change in `vetur.format.*` setting. See details below.
- Prettier as default formatter for css/scss/less/js/ts. #221.
- Load Vue dependency even if it's a `devDependency` to provide IntelliSense. #470.
- Updated IntelliSense for Vue tags change in 2.5.
- Disable non-functional postcss error-checking, since vscode-css-languageservice does not support it. #465.

#### Vetur Formatting Changes

See updated docs at: https://vuejs.github.io/vetur/formatting.html

- Vetur now uses prettier for formatting css/scss/less/js/ts.
- Vetur plans to use prettier for html formatting when it lands in prettier. Upstream issues [prettier/prettier#1882](https://github.com/prettier/prettier/issues/1882) [prettier/prettier#2097](https://github.com/prettier/prettier/issues/2097)
- `vetur.format.defaultFormatter` now allows you to set formatter based on language. The current default is:

  ```json
  "vetur.format.defaultFormatter": {
    "html": "none",
    "css": "prettier",
    "postcss": "prettier",
    "scss": "prettier",
    "less": "prettier",
    "js": "prettier",
    "ts": "prettier",
    "stylus": "stylus-supremacy"
  }
  ```

- Vetur now disables html formatting with js-beautify by default and plans to completely remove js-beautify once html support lands in prettier. You can still enable it by setting:

  ```json
  "vetur.format.defaultFormatter": {
    "html": "js-beautify-html"
  },
  "vetur.format.defaultFormatterOptions": {
    "js-beautify-html": {
      // js-beautify-html settings, see https://github.com/vuejs/vetur/blob/master/server/src/modes/template/services/htmlFormat.ts
    }
  }
  ```

- Vetur will close all html formatting issues. js-beautify issues should be reported to js-beautify. Our team will direct effort to build html / vue formatting in prettier.

### 0.9.11 | 2017-10-09 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.9.11/vspackage)

- Stylus formatter based on [Stylus Supremacy](https://thisismanta.github.io/stylus-supremacy/). Thanks to [@ThisIsManta](https://github.com/ThisIsManta)'s contribution. #457.
- Fix a bug where one-line tags with `src` could corrupt linting. #461.
- Region support for `<template>`, `<style>` and `<script>`. #459.

### 0.9.10 | 2017-09-22 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.9.10/vspackage)

- Fix Enter key not working correctly due to formatOnType. #448.

### 0.9.9 | 2017-09-21 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.9.9/vspackage)

- Fix a template highlight issue. #440.

### 0.9.8 | 2017-09-21 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.9.8/vspackage)

- Fix `this.$` completion.
- Support Vue 2.5+ types. #435.
- [bootstrap-vue](https://bootstrap-vue.js.org/) support. Thanks to [@alexsasharegan](https://github.com/alexsasharegan). #428.
- formatOnType support. #431.
- Make `editor.emmet.action.expandAbbreviation` available in `vue-html` region, so old-style emmet is usable.
- Upgrade Element UI and Onsen UI auto-completion tags & attributes.

### 0.9.7 | 2017-09-08 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.9.7/vspackage)

- Upgrade to newest TypeScript version with support for JSDoc cast and more. #419 and #420.
- Hotfix for the disappearing formatter. #421.

### 0.9.6 | 2017-09-07 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.9.6/vspackage)

- Handle unquoted attr values. #341.
- Exclude files based on gitignore file by default. #418.
- Fix opening single Vue file without workspace perf issue. #348.
- More tolerant parsing for template region, so IntelliSense would be available even when template is invalid. #413.
- Find Definition for Vue components in `<template>`. #411.
- Completion for component name and props in `<template>`. #393.
- Fix emmet not showing suggestions correctly for items with `-`. #398.
- Fix an ESLint error handling nested v-for. #400.

### 0.9.5 | 2017-08-22 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.9.5/vspackage)

- slm support. #366.
- Color Decorator support with `vetur.colorDecorators.enable`. #28.
- sass lang removed. Now recommend [sass extension](https://marketplace.visualstudio.com/items?itemName=robinbentley.sass-indented) for sass grammar.
- Fix the multicursor in `scaffold` snippet.
- Initial support for goto definition and find references.
- `vetur.format.js.InsertSpaceBeforeFunctionParenthesis` now control both space before named and anonymous functions. #226.

### 0.9.4 | 2017-08-16 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.9.4/vspackage)

- Integrate new Emmet support for html, css, scss, less and stylus. #232.
- Revamp doc on website.
- Fix formatter adding spaces to empty lines in `<template>`. #360.

### 0.9.3 | 2017-07-26 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.9.3/vspackage)

- Upgrade eslint-plugin-vue to 3.8.0. Fix false positives for `v-for`. #261.
- Make `vetur.validation.style` apply to postcss. #350.

### 0.9.2 | 2017-07-22 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.9.2/vspackage)

- Support tsx. #337.
- Initial support for postcss. #344.
- Add scaffold snippet for scoped style tag. #335.
- Enhanced support for closing backstick and comment in js. #329.
- Fix a syntax highlight issue for tags containing dashes. #328.

Special shoutout to [@HerringtonDarkholme](https://github.com/HerringtonDarkholme) who has been contributing to most of the improvements in Vetur for the last many versions.

Congrats to [@g-plane](https://github.com/g-plane) and [@armano2](https://github.com/armano2) who landed their first PR in Vetur!

### 0.9.1 | 2017-07-12 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.9.1/vspackage)

- Fix a crash for importing non-existing .vue.ts file. #321.

### 0.9.0 | 2017-07-08 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.9.0/vspackage)

- Onsen UI support. #308.
- Suppress all Vetur error logs (still accessible in output tab). #296.
- Fix an error for using `lang` http attributes in `<template>`. #293.
- Fix path mapping error. #301 and #213.
- Fix a bug where typing `import` at top of `<script>` causes VLS crash. #285.

### 0.8.7 | 2017-06-28 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.8.7/vspackage)

- Upgrade eslint-plugin-vue to address some template linting issues. #294.
- Skip template checking for empty template. #272.

### 0.8.6 | 2017-06-26 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.8.6/vspackage)

- Remove `vue-template-compiler` as dependency. Fix #250, #277 and #286.
- `@` IntelliSense in template and better IntelliSense ordering. #256.

### 0.8.5 | 2017-06-23 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.8.5/vspackage)

- Fix a Windows path handling issue that causes IntelliSense not to work. #265.

### 0.8.4 | 2017-06-23 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.8.4/vspackage)

- Fix an issue that removes space after taking IntelliSense suggestion. #244.
- Fix an issue that causes ESLint to report error on wrong line. #263.

### 0.8.3 | 2017-06-23 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.8.3/vspackage)

- Add `vetur.validation.template` option to toggle vue-html validation using `eslint-plugin-vue@beta`. #235 and #257.
- Fix a language server crash. #258.

### 0.8.2 | 2017-06-22 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.8.2/vspackage)

- Republishing with correct vue-language-server.

### 0.8.1 | 2017-06-22 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.8.1/vspackage)

- Published wrong veresion of vue-language-server in 0.8...oops.

### 0.8.0 | 2017-06-22 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.8.0/vspackage)

- eslint-plugin-vue support. #235.
- Initial stylus support. #227.
- Element UI support. #234.
- Let hover display code signature with syntax highlight. #247.

Shoutout to @HerringtonDarkholme who helped implementing many new features!

### 0.7.0 | 2017-06-04 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.7.0/vspackage)

- Correct syntax highlighting for longer directives such as `@click.capture.stop`. #79.
- Doc at https://octref.github.io/vetur/
- Disable js/ts language server to prevent crash when opening vue files without workspace. #160.
- Restrcit scaffold snippets to vue region (outside all other regions) strictly. #219.
- Fix a `textDocument/hover` error. #191.
- Incorporate [vls](https://github.com/octref/vls) into vetur's `/server`.

### 0.6.10 | 2017-06-01 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.6.10/vspackage)

- Fix a language service restart issue.
- Fix a `documentHighlight` error. #215.
- Fix a Windows path handling issue causing IntelliSense unusable. #205.

### 0.6.10 | 2017-05-16 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.6.10/vspackage)

- Add back symbol, highlight and signature provider. #194.

### 0.6.9 | 2017-05-14 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.6.9/vspackage)

- Update grammar to allow tags like `<template-component>` in vue-html. #189.
- Update grammar to allow html comments outside all regions. #195.
- Handle new file creation so vetur's IntelliSense work on it. #192.
- Enable breakpoints for vue files. Doc for debugging coming later in #201.
- Add `vetur.format.styleInitialIndent` and `vetur.format.scriptInitialIndent` to allow initial indent in these sections for formatting. #121.

### 0.6.8 | 2017-05-08 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.6.8/vspackage)

- Hot fix for a Windows crash caused by incorrect path handling.

### 0.6.7 | 2017-05-07 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.6.7/vspackage)

- Fix a bug of path handling on Windows. #183.
- Add top level scaffolding snippets, such as `scaffold`, `template with pug`, `style with less`.
- Add `vetur.validation.style` and `vetur.validation.script` to allow toggling validation.

### 0.6.6 | 2017-05-06 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.6.6/vspackage)

- Add back hover provider. #181.

### 0.6.5 | 2017-05-05 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.6.5/vspackage)

- Fix a formatting bug for vue-html. #99.
- Disable unused language features.
- Check file is included in tsconfig/jsconfig before providing language features to prevent TS crash.

### 0.6.4 | 2017-04-27 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.6.4/vspackage)

- When running Vue Language Server, do not use debug port. #162 and #148.
- Avoid module resolution in `node_modules`, so CPU and Memory usage won't spike. #131.

### 0.6.3 | 2017-04-26 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.6.3/vspackage)

- Include `vue-template-compiler` in vetur to avoid version mismatch. #135.

### 0.6.2 | 2017-04-24 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.6.2/vspackage)

- Fix various Vue Language Server crashes.

### 0.6.1 | 2017-04-20 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.6.1/vspackage)

- Fix a bug in module resolution that causes Vue Langauge Server to crash. #122 and #123.

### 0.6.0 | 2017-04-19 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.6.0/vspackage)

- Improve formatting support with [options](https://github.com/octref/vetur/blob/master/docs/formatting.md) to fine-tune formatting style in `js-beautify` and TypeScript's language service.
- Improve `sass` syntax highlighting based on grammar from [robinbentley/vscode-sass-indented](https://github.com/robinbentley/vscode-sass-indented). #41.

Thanks to [@sandersn](https://github.com/sandersn)'s [PR](https://github.com/octref/vetur/pull/94):
- Preliminary TypeScript support (try `<script lang="ts">`)
- Improved IntelliSense for `js/ts` in Vue SFC.
- Correct Module Resolution (try `npm i lodash @types/lodash` and use lodash in your Vue SFC).

### 0.5.6 | 2017-03-20 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.5.6/vspackage)

- Update js-beautify to include `preserve_newlines` options for css/scss/less.

### 0.5.5 | 2017-03-17 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.5.5/vspackage)

- Fix wrongly marked regions. #92.

### 0.5.4 | 2017-03-16 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.5.4/vspackage)

- Change default formatting options to preserve new lines in html.
- Change default formatting options for html to force-align attributes. #77.
- Re-enable scss/less error checking

### 0.5.3 | 2017-03-16 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.5.3/vspackage)

- Hotfix to include correct dependencies in LanguageClient.

### 0.5.2 | 2017-03-15 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.5.2/vspackage)

- Re-enable formatter based on js-beautify. #82.

### 0.5.1 | 2017-03-06 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.5.1/vspackage)

- Temporarily disable formatter. Will enable once #82 is addressed.

### 0.5.0 | 2017-03-06 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.5.0/vspackage)

- vetur now depends on https://github.com/octref/vls to provide some IntelliSense.
- Provide IntelliSense for all `v-` directives and `key`, `ref`, `slot`, #26.

### 0.4.1 | 2017-03-02 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.4.1/vspackage)

- Relax grammar to allow `<script type="text/babel">`. #70.
- Move `files.associations` setup in README, as vue file is not associated with html by default in VS Code.

### 0.4.0 | 2017-02-27 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.4.0/vspackage)

- Port new changes from VS Code's html extension, which fixes
  - Embedded formatter for html/css/scss/less/js
  - IntelliSense for html

### 0.3.8 | 2017-02-23 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.3.8/vspackage)

- Allow `<template lang="html">`. #52.

### 0.3.7 | 2017-02-23 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.3.7/vspackage)

- Syntax highlighting for coffee and postcss. #50 and #56.
- Various grammar fixes.

### 0.3.6 | 2017-02-21 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.3.6/vspackage)

- Support nested `<template>`. #48.
- Use vue-html grammar for vue-html lang. #45.

### 0.3.5 | 2017-02-20 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.3.5/vspackage)

- Add vue-html as a language. #44.
- Remove vue-js and use VS Code's javascript grammar.

### 0.3.4 | 2017-02-19 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.3.4/vspackage)

- Allow scope & module on css style tag. #43.

### 0.3.3 | 2017-02-19 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.3.3/vspackage)

- Split vue grammar into vue SFC and vue's html
- Tweak language region boundry that enables correct snippet in each region. #35 and #36.

### 0.3.2 | 2017-02-10 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.3.2/vspackage)

- Allow single quote for lang attr. #31.

### 0.3.1 | 2017-02-04 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.3.1/vspackage)

- Mark sass and stylus region so linting is disabled on them. #25.

### 0.3.0 | 2017-02-01 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.3.0/vspackage)

- Error-checking / linting for css/scss/less/js. #16 and #24.

### 0.2.2 | 2017-02-01 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.2.2/vspackage)

- Fix comment-toggling for embedded language. #18.

### 0.2.1 | 2017-01-16 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.2.1/vspackage)

- Adopt YAML for editing tmLanguage.
- Fix syntax highlighting for TS. #19.

### 0.2.0 | 2017-01-03 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.2.0/vspackage)

- Language server based on VS Code's html extension. #2.
- Basic SCSS and LESS language features.

### 0.1.2 | 2016-12-19 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.1.2/vspackage)

- Allow `pug` as an alternative to `jade` in template. #9.

### 0.1.1 | 2016-12-18 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.1.1/vspackage)

- Fix ternary operator syntax highlighting. #3 and #11.

### 0.1 | 2016-11-06 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.1/vspackage)

Initial release, including:

- Syntax highlighting for:
  - html/jade
  - css/sass/scss/less/stylus
  - js/ts
- emmet for `<template>`
