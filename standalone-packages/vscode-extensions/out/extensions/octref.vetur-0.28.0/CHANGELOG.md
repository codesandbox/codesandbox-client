# Changelog

### 0.28.0 | 2020-09-23 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.28.0/vspackage)

- Fix completing prop name completes with extra `:`. [#2304](https://github.com/vuejs/vetur/issues/2304).
- Add `vetur.languageFeatures.codeActions` option to disable codeAction. [#2150](https://github.com/vuejs/vetur/issues/2150)
- Let VTI load default VLS config. [#2274](https://github.com/vuejs/vetur/issues/2274).
- Make `prettier` default formatter for HTML as prettyhtml is no longer actively maintained. [#2291](https://github.com/vuejs/vetur/issues/2291).
- Load prettier plugin from VLS if not present in workspace folder. [#2014](https://github.com/vuejs/vetur/issues/2014).
- Cross file template type checking - check that components are passed props with the correct types. [#1596](https://github.com/vuejs/vetur/issues/1596) and [#2294](https://github.com/vuejs/vetur/issues/2294).

### 0.27.3 | 2020-09-13 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.27.3/vspackage)

- 🙌 Fix corner case when analyzing class component. Thanks to contribution from [@yoyo930021](https://github.com/yoyo930021). [#2254](https://github.com/vuejs/vetur/issues/2254) and [#2260](https://github.com/vuejs/vetur/issues/2260).
- 🙌 Ignore no implicitly any error in v-slot with destructuring. Thanks to contribution from [@yoyo930021](https://github.com/yoyo930021). [#2258](https://github.com/vuejs/vetur/issues/2258) and [#2259](https://github.com/vuejs/vetur/issues/2259).

### 0.27.2 | 2020-09-06 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.27.2/vspackage)

- Add a config `vetur.validation.props` to toggle props validation. Default to false. [#2249](https://github.com/vuejs/vetur/issues/2249).
- 🙌 Add HTML folding. Thanks to contribution from [@yoyo930021](https://github.com/yoyo930021). [#2234](https://github.com/vuejs/vetur/issues/2234) and [#2244](https://github.com/vuejs/vetur/issues/2244).
- 🙌 Fix array get error type in v-for. Thanks to contribution from [@yoyo930021](https://github.com/yoyo930021). [#1790](https://github.com/vuejs/vetur/issues/1790) and [#2248](https://github.com/vuejs/vetur/issues/2248).
- 🙌 Fix corner case and add v-model support when prop validation. Thanks to contribution from [@yoyo930021](https://github.com/yoyo930021). [#2241](https://github.com/vuejs/vetur/issues/2241).

### 0.27.1 | 2020-09-04 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.27.1/vspackage)

- Only enable interpolation diagnostics when both `vetur.experimental.templateInterpolationService` and `vetur.validation.interpolation` are set to `true`.

### 0.27.0 | 2020-09-03 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.27.0/vspackage)

- Add `foldingRange` support to support dynamic folding ranges such as `#region`. [#899](https://github.com/vuejs/vetur/issues/899).
- Add setting `vetur.validation.interpolation` so interpolation diagnostics and `eslint-plugin-vue` diagnostics can be configed separately. [#2131](https://github.com/vuejs/vetur/issues/2131).
- Fix VLS crash for *.vue files in node_modules. [#2006](https://github.com/vuejs/vetur/issues/2006).
- Upgrade to TypeScript 4.0.2 and fix symbol outline issue. [#1849](https://github.com/vuejs/vetur/issues/1849).
- Improve JSDoc presentation in hover/completion in interpolation mode. [#1337](https://github.com/vuejs/vetur/issues/1337).
- Improve JSDoc presentation in hover/completion/signatureHelp. [#2193](https://github.com/vuejs/vetur/issues/2193).
- `<PascalCase>` component should get highlighted like JSX/TSX when embedding other tags. [#2146](https://github.com/vuejs/vetur/issues/2146).
- Improve cross-file completion when declaring simple props with `props: ['foo']`. [#2143](https://github.com/vuejs/vetur/issues/2143).
- Completing child component should trigger props with `:` by default. [#2140](https://github.com/vuejs/vetur/issues/2140).
- Space should trigger completion only in HTML mode. [#2139](https://github.com/vuejs/vetur/issues/2139).
- Self-closing `<PascalCase>` component should get highlighted like JSX/TSX. [#2136](https://github.com/vuejs/vetur/issues/2136)
- [Cross file template type checking](https://vuejs.github.io/vetur/interpolation.html#prop-validation) - check that components are passed all declared props. [#2135](https://github.com/vuejs/vetur/issues/2135).
- Linkify all vue/vue-router tags to their API doc. [#2133](https://github.com/vuejs/vetur/issues/2133).
- Component Data - `type: 'boolean'` should trigger completion without `=""`. [#2127](https://github.com/vuejs/vetur/issues/2127).
- Component Data doesn't work if it comes from devDependencies. [#2132](https://github.com/vuejs/vetur/issues/2132).
- 🙌 Fix Emmet didn't work after curly parentheses. Thanks to contribution from [@cereschen](https://github.com/cereschen). [#2173](https://github.com/vuejs/vetur/issues/2173).
- 🙌 Fix no CSS completions in `style` attribute inside `<template>` region. Thanks to contribution from [@cereschen](https://github.com/cereschen). [#1678](https://github.com/vuejs/vetur/issues/1678).
- 🙌 Validate props of `<PascalCase>` components in templates. Thanks to contribution from [Michał Wilski](https://github.com/triforcely). [#2168](https://github.com/vuejs/vetur/issues/2168).
- 🙌 Add yarn@berry support and use `typescript.tsdk` setting for loading TypeScript in VLS. Thanks to contribution from [Alexandre Bonaventure Geissmann](https://github.com/AlexandreBonaventure). [#1711](https://github.com/vuejs/vetur/issues/1711), [#1737](https://github.com/vuejs/vetur/issues/1737) and [#1996](https://github.com/vuejs/vetur/issues/1996).
- 🙌 Add support for analyzing vue-class-component and vue-property-decorator. Thanks to contribution from [@yoyo930021](https://github.com/yoyo930021). [#864](https://github.com/vuejs/vetur/issues/864), [#1105](https://github.com/vuejs/vetur/issues/1105) and [#1323](https://github.com/vuejs/vetur/issues/1323).
- 🙌 Remove lsp client-side commands to improve integration with third party lsp client. Thanks to contribution from [@yoyo930021](https://github.com/yoyo930021). [#2137](https://github.com/vuejs/vetur/issues/2137).
- 🙌 Fix "Go to definition" for methods/computed does not work in the template. Thanks to contribution from [@cereschen](https://github.com/cereschen). [#1484](https://github.com/vuejs/vetur/issues/1484) and [#2161](https://github.com/vuejs/vetur/issues/2161).
- 🙌 Prop with `required: false` or default value should not trigger prop validation error when not provided. Thanks to contribution from [@yoyo930021](https://github.com/yoyo930021). [#2141](https://github.com/vuejs/vetur/issues/2141).
- 🙌 Show slot-related tag attributes in symbol search. Thanks to contribution from [@3nuc](https://github.com/3nuc). [#2169](https://github.com/vuejs/vetur/issues/2169)
- 🙌 Fix JSDoc presentation had no line breaks. Thanks to contribution from [@sapphi-red](https://github.com/sapphi-red). [#2214](https://github.com/vuejs/vetur/issues/2214).

### 0.26.1 | 2020-08-07 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.26.1/vspackage)

- Turning off `vetur.validation.template` will no longer turn off template interpolation validation. [#1293](https://github.com/vuejs/vetur/issues/1293).
- 🙌 Fix prettier-eslint error when formatting. Thanks to contribution from [@yoyo930021](https://github.com/yoyo930021). [#2117](https://github.com/vuejs/vetur/issues/2117).

### 0.26.0 | 2020-08-04 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.26.0/vspackage)

- Load different `eslint-plugin-vue` rulesets depending on workspace vue version. [#2015](https://github.com/vuejs/vetur/issues/2015).
- Remove leading empty line in diagnostic errors. [#2067](https://github.com/vuejs/vetur/issues/2067).
- `"vetur.completion.tagCasing": "initial"` causes double tag completion. [#2053](https://github.com/vuejs/vetur/issues/2053).
- Allow `xml` in `vetur.grammar.customBlocks`. [#2091](https://github.com/vuejs/vetur/issues/2091).
- Mark `<PascalCase>` components with `support.class.component.html` to have consistent highlighting with JSX/TSX. [#1963](https://github.com/vuejs/vetur/issues/1963).
- 🙌 Listen to JSON file changes for TypeScript resolveJsonModule support. Thanks to contribution from [@yoyo930021](https://github.com/yoyo930021). [#2095](https://github.com/vuejs/vetur/issues/2095).
- 🙌 Follow user's config while resolving autoImport path. Thanks to contribution from [@hikerpig](https://github.com/hikerpig). [#1177](https://github.com/vuejs/vetur/issues/1177) and [#1753](https://github.com/vuejs/vetur/issues/1753).
- 🙌 Handle different tag casing when doing html definition. Thanks to contribution from [@yoyo930021](https://github.com/yoyo930021). [#2096](https://github.com/vuejs/vetur/issues/2096).
- 🙌 Allow analyzing Vue files in `node_modules`. Thanks to contribution from [Tiago Roldão](https://github.com/tiagoroldao). [#1127](https://github.com/vuejs/vetur/issues/1127) and [#1979](https://github.com/vuejs/vetur/issues/1979).
- 🙌 Fix markdown rendering for library documentation. Thanks to contribution from [Albert Kaaman](https://github.com/nekosaur). [#1775](https://github.com/vuejs/vetur/issues/1775) and [#1791](https://github.com/vuejs/vetur/issues/1791).
- 🙌 Fix no props completion when child component `export default {}` ends with `;`. Thanks to contribution from [@yoyo930021](https://github.com/yoyo930021). [#1775](https://github.com/vuejs/vetur/issues/1775) and [#1791](https://github.com/vuejs/vetur/issues/1791).
- 🙌 Fix object property completion when have hyphen. Thanks to contribution from [@yoyo930021](https://github.com/yoyo930021). [#1804](https://github.com/vuejs/vetur/issues/1804) and [#1808](https://github.com/vuejs/vetur/issues/1808).
- 🙌 SFC without a script tag show an error when trying to import. Thanks to contribution from [@yoyo930021](https://github.com/yoyo930021). [#1187](https://github.com/vuejs/vetur/issues/1187) and [#1806](https://github.com/vuejs/vetur/issues/1806).
- 🙌 Fix initializationOptions: Cannot read property 'config' of undefined. Thanks to contribution from [Dawid Pakuła](https://github.com/zulus). [#1897](https://github.com/vuejs/vetur/issues/1897) and [#1341](https://github.com/vuejs/vetur/issues/1341).
- 🙌 Component props auto-completion doesn't work when using PascalCase. Thanks to contribution from [@yoyo930021](https://github.com/yoyo930021). [#2049](https://github.com/vuejs/vetur/issues/2049) and [#2056](https://github.com/vuejs/vetur/issues/2056).
- 🙌 When passing incorrect first arg to vti, show help message. Thanks to contribution from [Rafal Tynski](https://github.com/rafalt). [#1841](https://github.com/vuejs/vetur/issues/1841).
- 🙌 Use CodeAction over command. Thanks to contribution from [Matt Bierner](https://github.com/mjbvz). [#1704](https://github.com/vuejs/vetur/issues/1704).

### 0.25.0 | 2020-07-22 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.25.0/vspackage)

- Publish `vls@0.3.0` and `vti@0.0.4`.
- `vls` now only supports Node `>=10`, as Prettier 2.0 drops support for Node 8.
- Upgrade to prettier 2.0. [#1925](https://github.com/vuejs/vetur/issues/1925) and [#1794](https://github.com/vuejs/vetur/issues/1794).
- Add [prettier/plugin-pug](https://github.com/prettier/plugin-pug) as default formatter for `pug`. [#527](https://github.com/vuejs/vetur/issues/527).
- 🙌 Cusom tags IntelliSense for local `tags.json`/`attributes.json`. [Usage Docs](https://vuejs.github.io/vetur/framework.html#workspace-custom-tags). Thanks to contribution from [Carlos Rodrigues](https://github.com/pikax). [#1364](https://github.com/vuejs/vetur/issues/1364) and [#2018](https://github.com/vuejs/vetur/issues/2018).
- 🙌 Detect tags from @nuxt/components. Thanks to contribution from [pooya parsa](https://github.com/pi0). [#1921](https://github.com/vuejs/vetur/issues/1921).
- 🙌 Fix VTI crash by passing correct PID to language server. Thanks to contribution from [Daniil Yastremskiy](https://github.com/TheBeastOfCaerbannog). [#1699](https://github.com/vuejs/vetur/issues/1699) and [#1805](https://github.com/vuejs/vetur/issues/1805).
- 🙌 Fix template interpolation hover info of v-for readonly array item. Thanks to contribution from [@yoyo930021](https://github.com/yoyo930021). [#1788](https://github.com/vuejs/vetur/issues/1788).
- 🙌 Improve performance while using template interpolation service. Thanks to contribution from [@IWANABETHATGUY](https://github.com/IWANABETHATGUY). [#1839](https://github.com/vuejs/vetur/issues/1839).

### 0.24.0 | 2020-03-04 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.24.0/vspackage)

- **`vue-language-server` deprecated and will be published as `vls`**.
- Support Vue 3 interface with `defineComponent`. [#1638](https://github.com/vuejs/vetur/issues/1638).
- Update to TS 3.7.5 to avoid TypeScript issues with files not stored in C: drives on Windows. [#1589](https://github.com/vuejs/vetur/issues/1589).
- Vetur will now print the prettier configuration it loaded in Output -> Vue Language Server, when `"vetur.dev.logLevel": "DEBUG"` is set. [#1407](https://github.com/vuejs/vetur/issues/1407).
- Enable Windows CI with Azure DevOps. [#1266](https://github.com/vuejs/vetur/issues/1266).
- Upgrade to `vscode-languageclient`/`vscode-languageserver` V6. [#1719](https://github.com/vuejs/vetur/issues/1719).
  - Fix a file lock issue on asar files. [#1474](https://github.com/vuejs/vetur/issues/1474).
  - MDN links on CSS completion. [#1751](https://github.com/vuejs/vetur/issues/1751).
  - Fix an error on VTI not able to load `vscode-css-languageservice/lib/umd/data/browsers`. [#1732](https://github.com/vuejs/vetur/issues/1732).
  - Pull latest [web data](https://www.npmjs.com/package/vscode-web-custom-data) for Stylus support.
  - Use Markdown documentation for Stylus completion description.
- 🙌 Better template interpolation auto completion. Thanks to contribution from [@ktsn](https://github.com/ktsn). [#1129](https://github.com/vuejs/vetur/issues/1129) and [#1446](https://github.com/vuejs/vetur/issues/1446).
- 🙌 Fix syntax highlighting when `</template` and `>` are not on the same line. Thanks to contribution from [Ross Allen](https://github.com/ssorallen). [#1211](https://github.com/vuejs/vetur/issues/1211).
- 🙌 Add [`sass-formatter`](https://github.com/TheRealSyler/sass-formatter) as a formatter for SASS region. Thanks to contribution from [@TheRealSyler](https://github.com/TheRealSyler). [#1433](https://github.com/vuejs/vetur/issues/1433).
- 🙌 Provide Quasar support when `quasar` is in `devDependencies`. Thanks to contribution from [@moander](https://github.com/moander). [#1504](https://github.com/vuejs/vetur/issues/1504).
- 🙌 Fix Windows path handling. Thanks to contribution from [@mattn](https://github.com/mattn). [#1662](https://github.com/vuejs/vetur/issues/1662).

### 0.23.0 | 2020-01-12 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.23.0/vspackage)

- VTI (Vetur Terminal Interface). [#1149](https://github.com/vuejs/vetur/issues/1149).
- Provide default VLS config and do not crash when no config is provided. [#977](https://github.com/vuejs/vetur/issues/977).
- Upgrade to TypeScript 3.7 with Optional Chaining and Nullish Coalescing. [#1510](https://github.com/vuejs/vetur/issues/1510).
- 🙌 Fix syntax highlighting for interpolation in attributes with numbers (such as `x1`). Thanks to contribution from [Niklas Higi](https://github.com/shroudedcode). [#1465](https://github.com/vuejs/vetur/issues/1465).
- 🙌 Fix syntax highlighting for backticked vue code block in Markdown file. Thanks to contribution from [Abdelrahman Awad](https://github.com/logaretm). [#1024](https://github.com/vuejs/vetur/issues/1024) and [#1485](https://github.com/vuejs/vetur/issues/1485).

### 0.22.6 | 2019-10-23 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.22.6/vspackage)

- Fix path handling issues that causes TypeScript language features to stop working. [#1476](https://github.com/vuejs/vetur/issues/1476).

### 0.22.5 | 2019-10-21 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.22.5/vspackage)

- Support analyzing invalid template interpolation expression. [#1448](https://github.com/vuejs/vetur/issues/1448).
- 🙌 Fix a TypeScript integration issue that cuases completions to fail. Thanks to contribution from [@yoyo930021](https://github.com/yoyo930021). [#1449](https://github.com/vuejs/vetur/issues/1449).

### 0.22.4 | 2019-10-01 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.22.4/vspackage)

- Improve performance by caching module resolution results. [#1442](https://github.com/vuejs/vetur/issues/1442).
- Load Vetur built-in snippets and workspace snippets even when `globalSnippetDir` is unset. [#1421](https://github.com/vuejs/vetur/issues/1421).

### 0.22.3 | 2019-09-12 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.22.3/vspackage)

- Upgrade `element-helper-json` dependency for correct auto-completion. [#1391](https://github.com/vuejs/vetur/issues/1391).
- 🙌 Fix VLS fail to start when `globalSnippetDir` is undefined. Thanks to contribution from [@demsking](https://github.com/demsking). [#1402](https://github.com/vuejs/vetur/issues/1402).
- Improve source map for better handling of interpolation expression containing whitespace trivia. [#1335](https://github.com/vuejs/vetur/issues/1335).
- Show hover info for v-for variables. [#1374](https://github.com/vuejs/vetur/issues/1374).
- Update TypeScript to 3.6.3 for VLS. [#1425](https://github.com/vuejs/vetur/issues/1425).

### 0.22.2 | 2019-08-15 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.22.2/vspackage)

- Update to TypeScript 3.5.3. [#1389](https://github.com/vuejs/vetur/issues/1389).
- Relax `$event` type to avoid type error on `@` events. Thanks to contribution from [@ktsn](https://github.com/ktsn). [#1306](https://github.com/vuejs/vetur/issues/1306).
- Fix a bug that causes scaffold snippets to show twice. [#1386](https://github.com/vuejs/vetur/issues/1386).

### 0.22.1 | 2019-08-13 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.22.1/vspackage)

- Fix command "Open user scaffold snippet folder" failure when the global snippet dir doens't exist yet. [#1383](https://github.com/vuejs/vetur/issues/1383).
- Add back sass/postcss/stylus scaffold snippet into the new snippet system. [#1386](https://github.com/vuejs/vetur/issues/1386).

### 0.22.0 | 2019-08-09 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.22.0/vspackage)

- New Scaffold Snippets system that allows system / workspace level customizable snippets. See details in [snippet docs](https://vuejs.github.io/vetur/snippet.html). [#1151](https://github.com/vuejs/vetur/issues/1151).
- 🙌 `prettier-tslint` formatter option for TS region. Thanks to contribution from [@NickeyLin](https://github.com/NickeyLin). [#1354](https://github.com/vuejs/vetur/issues/1354).
- 🙌 Replaced bundled Vuetify support with official tag/attribute definition from Vuetify@2.0. Thanks to contribution from [@nekosaur](https://github.com/nekosaur). [#1365](https://github.com/vuejs/vetur/issues/1365).
- 🙌 Avoid template diagnostic error on empty v-on. Thanks to contribution from [@ktsn](https://github.com/ktsn). [#1371](https://github.com/vuejs/vetur/issues/1371).
- 🙌 Read `.prettierrc` config for prettyhtml formatting. Thanks to contributino from [@bolasblack](https://github.com/bolasblack). [#1036](https://github.com/vuejs/vetur/issues/1036).

### 0.21.1 | 2019-06-28 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.21.1/vspackage)

- Completion for event modifiers. Thanks to contribution from [@yoyo930021](https://github.com/yoyo930021). [#780](https://github.com/vuejs/vetur/issues/780) and [#1326](https://github.com/vuejs/vetur/issues/1326).
- Make `vetur.dev.vlsPath` a [`machine`](https://code.visualstudio.com/updates/v1_34#_machinespecific-settings) scoped config. [#1334](https://github.com/vuejs/vetur/issues/1334).
- Fix wrong template interpolation diagnostics on `new` statement. Thanks to contribution from [@ktsn](https://github.com/ktsn). [#1308](https://github.com/vuejs/vetur/issues/1308).
- Upgrade prettier to 1.18.2.
- Upgrade prettyhtml to 0.9.0. [#1321](https://github.com/vuejs/vetur/issues/1321).
- Upgrade js-beautify to 1.10.0. [#1312](https://github.com/vuejs/vetur/issues/1312).

### 0.21.0 | 2019-05-15 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.21.0/vspackage)

- Path completion for `import ... from ''`. Fix [#822](https://github.com/vuejs/vetur/issues/822).
- 🙌 More accurate inferrence of `$event` types. Thanks to contribution from [@ktsn](https://github.com/ktsn). [#1287](https://github.com/vuejs/vetur/issues/1287).
- Enable `experimentalDecorator` by default in the case no jsconfig/tsconfig is found. [#1289](https://github.com/vuejs/vetur/issues/1289).
- Use installed `node_modules/vue` to determine Vue version in case `vue` is added as a transitive dependency. [#799](https://github.com/vuejs/vetur/issues/799).
- Fix syntax highlighting for single line template import such as `<template src="./index.html" />`. [#813](https://github.com/vuejs/vetur/issues/813).
- Update to latest `vscode-css-languageservice` for update CSS completion properties. [#1274](https://github.com/vuejs/vetur/issues/1274).

### 0.20.0 | 2019-05-07 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.20.0/vspackage)

- Improve file system access to reduce memory / cpu usage. [#1277](https://github.com/vuejs/vetur/issues/1277).
- 🙌 Support arrow function in interpolation, such as `@click="() => { foo + 1 }"`. Thanks to contribution from [@ktsn](https://github.com/ktsn). [#1267](https://github.com/vuejs/vetur/issues/1267).

### 0.19.5 | 2019-05-04 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.19.5/vspackage)

- 🙌 Re-add Quasar (pre v1) support. Thanks to PR from [@rstoenescu](https://github.com/rstoenescu) [#1273](https://github.com/vuejs/vetur/issues/1273).

### 0.19.4 | 2019-05-02 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.19.4/vspackage)

- Fix a regex performance issue. Thanks to help from [petternordholm](https://github.com/petternordholm). [#1264](https://github.com/vuejs/vetur/issues/1264).
- Add some logging for diagnosing performance issue, and a setting `vls.dev.logLevel`. [#922](https://github.com/vuejs/vetur/issues/922).
- Fix Windows path handling issue that causes diagnostics in template region not mapped correctly. [#1235](https://github.com/vuejs/vetur/issues/1235). Thanks to help from [trixnz](https://github.com/trixnz).

### 0.19.3 | 2019-04-30 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.19.3/vspackage)

- 🙌 Various improvements to template interpolation. Thanks to [@ktsn](https://github.com/ktsn) for providing fixes.
  - Support for `<script src="...">` in SFC for defining component. [#1254](https://github.com/vuejs/vetur/issues/1254) and [#1255](https://github.com/vuejs/vetur/issues/1255).
  - Support for `v-if` type narrowing. [#1204](https://github.com/vuejs/vetur/issues/1204) and [#1208](https://github.com/vuejs/vetur/issues/1208).
  - Support for `v-slot` and `slot-scope` (for Vue < 2.5). [#1203](https://github.com/vuejs/vetur/issues/1203) and [#1255](https://github.com/vuejs/vetur/issues/1255).
- 🙌 Upgrade gridsome-helper-json definition for better gridsome support. Thanks to [tyankatsu](https://github.com/tyankatsu0105). [#1258](https://github.com/vuejs/vetur/issues/1258).
- Liquid template syntax highlighting support for `<template lang="liquid">`. [#1259](https://github.com/vuejs/vetur/issues/1259) and [#1081](https://github.com/vuejs/vetur/issues/1081).
- New config `vetur.dev.vlsPort` to allow debugging/profiling Vue Language Server. [#1180](https://github.com/vuejs/vetur/issues/1180).
- [Performance issue reporting guideline](https://github.com/vuejs/vetur/blob/master/.github/PERF_ISSUE.md). [#1180](https://github.com/vuejs/vetur/issues/1180).

### 0.19.2 | 2019-04-25 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.19.2/vspackage)

- 🙌 Various bug fixes for template interpolation. Thanks to [@ktsn](https://github.com/ktsn) for providing fixes.
  - Bug for transformating string templates inside template interpolations. [#1230](https://github.com/vuejs/vetur/issues/1230).
  - Error showing private/protected members not accessible from template. [#1224](https://github.com/vuejs/vetur/issues/1224).
  - Ignore filters in template transformation. [#1206](https://github.com/vuejs/vetur/issues/1206).
- Fix double color indicator in document with multiple `<style>` blocks. [#1219](https://github.com/vuejs/vetur/issues/1219).
- Disables `vetur.experimental.templateInterpolationService` by default. You need to enable Diagnostics / Hover / jump to definition / find references for template manually. [#1246](https://github.com/vuejs/vetur/issues/1246).

### 0.19.1 | 2019-04-24 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.19.1/vspackage)

- Fix a server crash on failed attribute transformation for any attribute with dash such as `:prop-test`. [#1220](https://github.com/vuejs/vetur/issues/1220) and [#1222](https://github.com/vuejs/vetur/issues/1222).
- Fix a server crash on failed v-on transformation such as `@click="() => foo = 123"`. [#1227](https://github.com/vuejs/vetur/issues/1227) and [#1228](https://github.com/vuejs/vetur/issues/1228).
- Server now will gracefully fallback in cases of failed transformations.
- Add a command `Vetur: Show corresponding virtual file and sourcemap" to help diagnose template interpolation related issues. [#1233](https://github.com/vuejs/vetur/issues/1233).

### 0.19.0 | 2019-04-23 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.19.0/vspackage)

- Hover / jump to definition / find references for template interpolations. [#1215](https://github.com/vuejs/vetur/issues/1215).
- 🙌 Diagnostics / type-checking for template interpolations. [#209](https://github.com/vuejs/vetur/issues/209). [#681](https://github.com/vuejs/vetur/issues/681). Thanks to amazing contribution from [Katashin](https://github.com/ktsn)! More details in [Vue Template Interpolation Language Features](#vue-template-interpolation-language-features)
- Fix pug comment togglign bug. [#1199](https://github.com/vuejs/vetur/issues/1199).
- Fix a grammar bug for `#` slot syntax. [#1192](https://github.com/vuejs/vetur/issues/1192).
- 🙌 Fix a crash when VLS initialization option is not passed. [#1188](https://github.com/vuejs/vetur/issues/1188). Thanks to contribution from [Louis Bourque](https://github.com/louisbourque).

#### Vue Template Interpolation Language Features

- Documentation: https://vuejs.github.io/vetur/interpolation.html
- Blog Post: http://blog.matsu.io/generic-vue-template-interpolation-language-features

### 0.18.1 | 2019-04-04 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.18.1/vspackage)

- Improve embedded language support to fix second style block having no auto completion bug. [#430](https://github.com/vuejs/vetur/issues/430) and [#852](https://github.com/vuejs/vetur/issues/852).
- Fix a Stylus formatting bug where it wrongly formats multiple Stylus blocks. [#499](https://github.com/vuejs/vetur/issues/499).
- 🙌 Fix a bug where Vetur doesn't clear document for diagnostics. Thanks to contribution from [James Lave](https://github.com/jlave-dev). [#1181](https://github.com/vuejs/vetur/issues/1181) and [#1147](https://github.com/vuejs/vetur/issues/1147).

### 0.18.0 | 2019-04-01 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.18.0/vspackage)

- Vetur now bundles TypeScript 3.3.4000. This fixes many TS/JS related issues. See more in [#1163](https://github.com/vuejs/vetur/issues/1163).
- Vetur falls back to using bundled TS if workspace TS is not found. [#1164](https://github.com/vuejs/vetur/issues/1164).
- 🙌 Syntax highlighting for `#` shorthand for `v-slot`. Thanks to contribution from [Patrick](https://github.com/Patcher56). [#1108](https://github.com/vuejs/vetur/issues/1108).
- Greyed-out unused varibles in `*.vue` files. (For plain `<script>`, you need to set `checkJs: true` in `jsconfig.json`) [#1063](https://github.com/vuejs/vetur/issues/1063).
- 🙌 Code actions (autofixes, refactors) are now available in `*.vue` files. Thanks to contribution from [Daniel Rosenwasser](https://github.com/DanielRosenwasser). [#907](https://github.com/vuejs/vetur/issues/907).
- Auto import now works for variables / methods exported from `JS/TS` files. [#1170](https://github.com/vuejs/vetur/issues/1170).

### 0.17.1 | 2019-03-25 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.17.1/vspackage)

- `vetur.format.enable` option and dynamic formatter registration so Vetur works better with other Vue document formatters. [#1121](https://github.com/vuejs/vetur/issues/1121).

### 0.17.0 | 2019-03-20 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.17.0/vspackage)

- Allow using workspace TS version. See below for details. [#682](https://github.com/vuejs/vetur/issues/682).
- Switch PostCSS grammar to base on [hudochenkov/Syntax-highlighting-for-PostCSS](https://github.com/hudochenkov/Syntax-highlighting-for-PostCSS). [#1115](https://github.com/vuejs/vetur/issues/1115).
- Fix a bug where Vetur does not update language features for newly created files. [#1091](https://github.com/vuejs/vetur/issues/1091).
- Use `text.jade.slm` instead of `text.pug.slm` for proper SLM syntax highlighting. [#1134](https://github.com/vuejs/vetur/issues/1134).
- Fix a bug where Vetur fails to resolve links in `<script src="">` correctly. [#991](https://github.com/vuejs/vetur/issues/991) and [#1150](https://github.com/vuejs/vetur/issues/1150).
- Add Gridsome support. Thanks to contribution from [@tyankatsu0105](https://github.com/tyankatsu0105). [#1101](https://github.com/vuejs/vetur/issues/1101).

#### Using Workspace TypeScript version

Vetur depends on TypeScript's Language Server for its JavaScript/TypeScript capabilities. Previously Vetur bundles TS 2.8.4,
but now Vetur can run on any TypeScript > 2.8 from workspace `node_modules/typescript`. Use `vetur.useWorkspaceDependencies`
to enable this behavior.

Note that `vetur.useWorkspaceDependencies` can only be configured in user settings (no workspace setting) and defaults to `false`
because Vetur should not run 3rd party code without user's explicit approval.

Currently this setting does not affect `prettier` and other formatters, where workspace dependencies is preferred, but this will change in the future.

### 0.16.2 | 2019-02-20 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.16.2/vspackage)

- Prettier as an option for `vetur.format.defaultFormatter.html`. [#950](https://github.com/vuejs/vetur/issues/950).
- Fix a syntax highlighting bug with custom block that begins with `<template>`. [#1088](https://github.com/vuejs/vetur/issues/1088).
- Fix a bug where Vetur fails to provide props completion when using `"vetur.completion.tagCasing": "initial"`. [#1102](https://github.com/vuejs/vetur/issues/1102).

### 0.16.1 | 2019-02-18 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.16.1/vspackage)

- `vetur.completion.tagCasing` option to choose between forcing all tag completion to kebab-case like `<my-tag>`, or leave tag naming as initially declared in `components`. [#1102](https://github.com/vuejs/vetur/issues/1102).

### 0.16.0 | 2019-02-18 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.16.0/vspackage)

- Template interpolation completion. See below for details. [#1083](https://github.com/vuejs/vetur/issues/1083).
- Improved child component completion. See below for details.

See https://github.com/vuejs/vetur/issues/1083#issuecomment-464877917 for the demo.

#### Template Interpolation Completion

Vetur now offers auto completion inside Vue interpolations, that is, `{{ }}` block, `v-if` / `@click` `:prop` and other attributes.

The completion items are sourced from `props`, `data`, `computed` and `methods`.
The JSDocs block right before each property, and the property assignment expression will be used as documentation.

For example, in this Vue file:

```vue
<script>
export default {
  props: {
    /**
     * Initial counter value
     */
    start: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      /**
       * My msg
       */
      msg: 'Vetur get much better completion',
    }
  }
}
</script>
```

In the HTML interpolation regions, `start` and `msg` will be completed. Their documentation will be the Markdown below:

````
Initial counter value

```js
start: {
  type: Number,
  default: 0
}
```

---

My msg

```js
msg: 'Vetur get much better completion',
```
````

#### Child Component Completion

If you have child components in a parent component:

```vue
<script>
import Counter from './Counter.vue'

export default {
  components: {
    Counter,
  }
}
```

Vetur will show tag completion for `<counter>`. The JSDoc right before the `export default {}` declaration in `Counter.vue` file will be used as the completion documentation.

Vetur will also read all props of `<counter>` and provide them as HTML attribute completions.

### 0.15.1 | 2019-02-13 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.15.1/vspackage)

- Fix a grammar problem with pug interpolation. Thanks to contribution from [@Patcher56](https://github.com/Patcher56). [#1082](https://github.com/vuejs/vetur/issues/1082).

### 0.15.0 | 2019-02-07 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.15.0/vspackage)

- Graphql custom block syntax highlighting. [#975](https://github.com/vuejs/vetur/issues/975).
- Inline Graphql syntax highlighting. [#701](https://github.com/vuejs/vetur/issues/701).
- `vetur.dev.vlsPath`. [#1045](https://github.com/vuejs/vetur/issues/1045).
- Allow `<!-- -->` in Vue source. Thanks to contribution from [@dsanders11](https://github.com/dsanders11). [#1023](https://github.com/vuejs/vetur/issues/1023).
- Pug interpolation syntax highlighting. Thanks to contribution from [@Patcher56](https://github.com/Patcher56). [#552](https://github.com/vuejs/vetur/issues/552).

### 0.14.5 | 2019-01-02 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.14.5/vspackage)

- Update to eslint-plugin-vue@5. [#1034](https://github.com/vuejs/vetur/issues/1034).

### 0.14.4 | 2018-12-26 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.14.4/vspackage)

- Nuxt support. See also [nuxt/nuxt.js#4524](https://github.com/nuxt/nuxt.js/pull/4524). [#870](https://github.com/vuejs/vetur/issues/870).

### 0.14.3 | 2018-11-29 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.14.3/vspackage)

- Remove `flatmap-stream` from Vetur's `devDependencies`. `flatmap-stream` has never been shipped to user.
- Fix a bug where Vetur cannot format `style` regions correctly when using `vetur.format.defaultFormatterOptions.prettier`. [#997](https://github.com/vuejs/vetur/issues/997) and [#998](https://github.com/vuejs/vetur/issues/998).

### 0.14.2 | 2018-11-26 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.14.2/vspackage)

- Allow `vetur.format.defaultFormatterOptions.prettier` as global prettier config. You do not need this if you have a global config such as `~/.prettierrc` at your home directory. [#986](https://github.com/vuejs/vetur/issues/986)

### 0.14.1 | 2018-11-26 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.14.1/vspackage)

- Fix a null pointer error when no local prettier config can be found.

### 0.14.0 | 2018-11-26 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.14.0/vspackage)

- Using `vscode-css-langaugeservice`'s latest data for Stylus langauge features. Thanks to contribution from [@DeltaEvo](https://github.com/DeltaEvo). [#953](https://github.com/vuejs/vetur/issues/953).
- `.ts` and `.map` files has been removed from published extensions. Thanks to contributionf rom [@mjbvz](https://github.com/mjbvz). [#955](https://github.com/vuejs/vetur/issues/955).
- [Quasar Framework](https://quasar-framework.org/) includes a `vetur` key in its [`package.json`](https://github.com/quasarframework/quasar/blob/057f0cd2a340c2b078dec814bd1947189b8707ee/package.json#L109-L112), and Vetur would read Quasar tag/attribute definitions for auto-completion and other language features. This feature is now available to any dependencies that contain a `vetur` key. [vuetypes](https://github.com/octref/vuetypes) is an attempt to standardize this format. Thanks to contribution from [@Zenser](https://github.com/Zenser). [#941](https://github.com/vuejs/vetur/issues/941).

#### Formatter Changes

Read updated doc at: https://vuejs.github.io/vetur/formatting.html#formatters.

- Upgraded to latest versions of `prettier`, `prettier-eslint`, `prettyhtml` formatters.
- Formatters no longer inherit from `editor.insertSpaces` and `editor.tabSize`. Instead, Vetur now offers two options that are inherited by all formatters. This is because VS Code sets `editor.detectIndentation: true` by default, and the detected indentation for Vue files not always match the `editor.insertSpaces` and `editor.tabSize` settings. [#982](https://github.com/vuejs/vetur/issues/982).

  ```json
  {
    "vetur.format.options.useTabs": false,
    "vetur.format.options.tabSize": 2
  }
  ```
- Vetur no longer reads settings from `prettier.*`. All settings must be specified in a local configuration file. [#982](https://github.com/vuejs/vetur/issues/982).
- `prettier-eslint` is added as an option for `vetur.format.defaultFormatter.js`. [#982](https://github.com/vuejs/vetur/issues/982).
- Various bug fixes for `prettier-eslint` not reading config correctly. Thanks to contribution form [@Coder-256](https://github.com/Coder-256). [#934](https://github.com/vuejs/vetur/issues/934) and [#942](https://github.com/vuejs/vetur/issues/942).
- `prettyhtml` becomes the default formatter for `<template>` section.
- `js-beautify-html` becomes more actively maintained and is no longer a deprecated option for HTML formatting.

### 0.13.0 | 2018-10-04 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.13.0/vspackage)

- Revert TS to 2.8.4, which is the same minor version as 0.12.6 release for perf issues. [#913](https://github.com/vuejs/vetur/issues/913).
- [prettyhtml](https://github.com/Prettyhtml/prettyhtml) support. Thanks to contribution from [@StarpTech](https://github.com/StarpTech). [#561](https://github.com/vuejs/vetur/issues/561) and [#491](https://github.com/vuejs/vetur/issues/491).
- Default `unformatted` option to an empty array to accommodate js-beautify's new behavior. [#921](https://github.com/vuejs/vetur/issues/921).
- Fix a stylus formatting error when stylus code contains comments. Thanks to contribution from [@ThisIsManta](https://github.com/ThisIsManta). [#918](https://github.com/vuejs/vetur/issues/918).
- If local prettier exists in `node_modules`, prefer using it instead of bundled version of prettier. Thanks to contribution from [@maeldur](https://github.com/maeldur). [#876](https://github.com/vuejs/vetur/issues/876).

### 0.12.7 | 2018-09-24 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.12.7/vspackage)

- Fix a oversized publish that's 200MB (normal publish should be around 30MB). [#898](https://github.com/vuejs/vetur/issues/898).
- Add completion for [Quasar Framework](https://github.com/vuejs/vetur/pull/865). Thanks to contribution from [@rstoenescu](https://github.com/rstoenescu). [#865](https://github.com/vuejs/vetur/issues/865).
- Many dependency upgrade, including `vscode-languageserver`, `vscode-languageclient` from V3 to V5, `js-beautify` to 1.8.6, `prettier` to 1.14.3, etc.
- More test coverage. [#863](https://github.com/vuejs/vetur/issues/863).

### 0.12.6 | 2018-08-06 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.12.6/vspackage)

- Revert embedded pug languageId to jade, so Cmd+/ uses `//-` for comment. [#840](https://github.com/vuejs/vetur/issues/840).
- Fix syntax highlight for `:snake_case` properties in HTML. Thanks to contribution from [@davidhewitt](https://github.com/davidhewitt). [#830](https://github.com/vuejs/vetur/issues/830).
- Auto completion for [Buefy](https://buefy.github.io) framework. Thanks to contribution from [@jtommy](https://github.com/jtommy). [#824](https://github.com/vuejs/vetur/issues/824).
- Fix description for `v-cloak`. Thanks to contribution by [@snkashis](https://github.com/snkashis). [#816](https://github.com/vuejs/vetur/issues/816).

### 0.12.5 | 2018-06-06 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.12.5/vspackage)

- Use `source.js#expression` for Vue interpolation values. Fix [#811](https://github.com/vuejs/vetur/issues/811) and [#804](https://github.com/vuejs/vetur/issues/804)
- Fix a pug syntax highlighting issue. [#812](https://github.com/vuejs/vetur/issues/812)

### 0.12.4 | 2018-06-05 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.12.4/vspackage)

- Improved file watching that updates completion and diagnostics in Vue files when TS/JS file changes. [#355](https://github.com/vuejs/vetur/issues/355)

### 0.12.3 | 2018-05-17 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.12.3/vspackage)

- Removed chokidar watcher.

### 0.12.2 | 2018-05-17 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.12.2/vspackage)

- Temporarily disable file watcher for perf problem & will bring it back in next version. [#789](https://github.com/vuejs/vetur/issues/789).

### 0.12.1 | 2018-05-14 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.12.1/vspackage)

- Haml syntax highlighting. [#739](https://github.com/vuejs/vetur/issues/739).
- Remove restricted file schemes for live share.
- Fix an issue where Vetur failed to read emmet configs and cause emmet and other completions to fail.

### 0.11.8 | 2018-05-14 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.11.8/vspackage)

- Update TypeScript Version to allow usage of `!` for definite assignment assertions.
- Add single quote as trigger character. Fix [#743](https://github.com/vuejs/vetur/issues/743)
- Add `arrowParens` option for Prettier
- Upgrade vscode-emmet-helper. Fix [#412](https://github.com/vuejs/vetur/issues/412). Fix [#426](https://github.com/vuejs/vetur/issues/426)
- Add `vetur.completion.useScaffoldSnippets`. Fix [#698](https://github.com/vuejs/vetur/issues/698)
- Skip template completion trigger in script. Fix [#705](https://github.com/vuejs/vetur/issues/705)
- Fix script definition lookup position error. Fix [#741](https://github.com/vuejs/vetur/issues/741)
- Add a crude file watcher. Now Vetur will pick up text change in TS/JS. Note this feature is experimental. Partially fix [#355](https://github.com/vuejs/vetur/issues/355)

### 0.11.7 | 2018-01-28 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.11.7/vspackage)

- Better default scaffold template for TypeScript. [#669](https://github.com/vuejs/vetur/issues/669).
- Partial support for quoteless attribute value in HTML5. [#648](https://github.com/vuejs/vetur/issues/648).
- Fix a grammar error for custom blocks. [#664](https://github.com/vuejs/vetur/issues/664).
- Mark the `/` as `tag.end.html` in self-closing component. [#650](https://github.com/vuejs/vetur/issues/650).
- Fix a Stylus formatting issue where it adds extra parentheses. [#638](https://github.com/vuejs/vetur/issues/638).

### 0.11.6 | 2018-01-16 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.11.6/vspackage)

- Basic Vuetify completion. [#647](https://github.com/vuejs/vetur/issues/647).
- Add auto import. [#606](https://github.com/vuejs/vetur/issues/606).
- Optimize vsix size to reduce bundle size by 33%.
- Only read parser option for using prettier for script section. [#574](https://github.com/vuejs/vetur/issues/574).
- Fix syntax highlighting for single line, self-closing template/style/script. [#591](https://github.com/vuejs/vetur/issues/591).
- Fix "Language client is not ready yet" error. [#576](https://github.com/vuejs/vetur/issues/576).
- Fix dulplicate bracket in scaffold completion. [#367](https://github.com/vuejs/vetur/issues/367).

### 0.11.5 | 2017-12-15 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.11.5/vspackage)

- Fix an error incorrectly reporting `<template>` should have end tag. [#578](https://github.com/vuejs/vetur/issues/578).
- Change Vetur's template linting to use [`essential`](https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention) instead of [`recommended`](https://github.com/vuejs/eslint-plugin-vue#priority-c-recommended-minimizing-arbitrary-choices-and-cognitive-overhead) rule set of `eslint-plugin-vue`. [#579](https://github.com/vuejs/vetur/issues/579).
- Nicer display of diagnostic error from `eslint-plugin-vue`.

### 0.11.4 | 2017-12-14 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.11.4/vspackage)

- Upgrade to latest prettier & prettier-eslint.
- Upgrade to latest vscode-css-languageservice that has css grid support. [#437](https://github.com/vuejs/vetur/issues/437).
- Upgrade to latest eslint-plugin-vue.
  - Fix an error reporting "v-model directives don't support dynamic input types. [#554](https://github.com/vuejs/vetur/issues/554).
  - Fix an error reporting "`key` must not be allowed in `<slot>`". [#505](https://github.com/vuejs/vetur/issues/505).
- Include `/server` in distribution instead of downloading from NPM to a different location. Fix a issue where VS Code has trouble finding the Language Server. [#568](https://github.com/vuejs/vetur/issues/568).
- Color Picker support. [#559](https://github.com/vuejs/vetur/issues/559).
- Fix a bug with imprecise find definition. [#549](https://github.com/vuejs/vetur/issues/549).
- Fix a vue-html grammar rule that does not highlight Vue templates after `</template>`. [#548](https://github.com/vuejs/vetur/issues/548).
- Upgrade grammar so broken syntax in each region will not affect syntax highlighting outside that specific region. [#174](https://github.com/vuejs/vetur/issues/174).
- Always ignore `end_with_newline` option in js-beautify so the template formats properly. [#544](https://github.com/vuejs/vetur/issues/544).


### 0.11.3 | 2017-11-13 

- Hot fix for a bug in formatting `<template>` with js-beautify where it adds `</template>` to the end. [#539](https://github.com/vuejs/vetur/issues/539).

### 0.11.2 | 2017-11-13 

- Workaround a js-beautify bug which indents multi-line comment. [#535](https://github.com/vuejs/vetur/issues/535).
- Docs for generating grammar for custom blocks: https://vuejs.github.io/vetur/highlighting.html.
- Allow `php` as one of the custom block language. [#536](https://github.com/vuejs/vetur/issues/536).
- Disallow longer version of `lang` in custom block setting (`js` over `javascript`, `md` over `markdown`).
- Pretty print generated gramamr so it's readable. (You can find it at `~/.vscode/extensions/octref.vetur-<version>./syntaxes/vue-generated.json`).

### 0.11.1 | 2017-11-10 

- Syntax highlighting for Custom Block. [#210](https://github.com/vuejs/vetur/issues/210).
  - Added setting `vetur.grammar.customBlocks`.
  - Added command "Vetur: Generate grammar from `vetur.grammar.customBlocks`".

### 0.11.0 | 2017-11-06 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.11.0/vspackage)

- Better completion order in js/ts. [#489](https://github.com/vuejs/vetur/issues/489).
- Fix some Stylus formatting issues. [#471](https://github.com/vuejs/vetur/issues/471).
- prettier-eslint support. [#478](https://github.com/vuejs/vetur/issues/478).
- Fix Vetur not correctly distinguishing js/ts regions. [#504](https://github.com/vuejs/vetur/issues/504) and [#476](https://github.com/vuejs/vetur/issues/476).
- Fix a bug where Vetur misses completion item details. [#418](https://github.com/vuejs/vetur/issues/418).
- Prefer user jsconfig/tsconfig compilerOptions in Vue Language Server. [#515](https://github.com/vuejs/vetur/issues/515) and [#512](https://github.com/vuejs/vetur/issues/512).

### 0.10.1 | 2017-10-19 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.10.1/vspackage)

- Remove range formatter. [#100](https://github.com/vuejs/vetur/issues/100).
- Remove onTypeFormat. [#477](https://github.com/vuejs/vetur/issues/477).
- Upgrade TypeScript for better large workspace handling. [#390](https://github.com/vuejs/vetur/issues/390).

### 0.10.0 | 2017-10-19 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.10.0/vspackage)

- :red_circle: Breaking change in `vetur.format.*` setting. See details below.
- Prettier as default formatter for css/scss/less/js/ts. [#221](https://github.com/vuejs/vetur/issues/221).
- Load Vue dependency even if it's a `devDependency` to provide IntelliSense. [#470](https://github.com/vuejs/vetur/issues/470).
- Updated IntelliSense for Vue tags change in 2.5.
- Disable non-functional postcss error-checking, since vscode-css-languageservice does not support it. [#465](https://github.com/vuejs/vetur/issues/465).

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

- Stylus formatter based on [Stylus Supremacy](https://thisismanta.github.io/stylus-supremacy/). Thanks to [@ThisIsManta](https://github.com/ThisIsManta)'s contribution. [#457](https://github.com/vuejs/vetur/issues/457).
- Fix a bug where one-line tags with `src` could corrupt linting. [#461](https://github.com/vuejs/vetur/issues/461).
- Region support for `<template>`, `<style>` and `<script>`. [#459](https://github.com/vuejs/vetur/issues/459).

### 0.9.10 | 2017-09-22 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.9.10/vspackage)

- Fix Enter key not working correctly due to formatOnType. [#448](https://github.com/vuejs/vetur/issues/448).

### 0.9.9 | 2017-09-21 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.9.9/vspackage)

- Fix a template highlight issue. [#440](https://github.com/vuejs/vetur/issues/440).

### 0.9.8 | 2017-09-21 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.9.8/vspackage)

- Fix `this.$` completion.
- Support Vue 2.5+ types. [#435](https://github.com/vuejs/vetur/issues/435).
- [bootstrap-vue](https://bootstrap-vue.js.org/) support. Thanks to [@alexsasharegan](https://github.com/alexsasharegan). [#428](https://github.com/vuejs/vetur/issues/428).
- formatOnType support. [#431](https://github.com/vuejs/vetur/issues/431).
- Make `editor.emmet.action.expandAbbreviation` available in `vue-html` region, so old-style emmet is usable.
- Upgrade Element UI and Onsen UI auto-completion tags & attributes.

### 0.9.7 | 2017-09-08 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.9.7/vspackage)

- Upgrade to newest TypeScript version with support for JSDoc cast and more. [#419](https://github.com/vuejs/vetur/issues/419) and [#420](https://github.com/vuejs/vetur/issues/420).
- Hotfix for the disappearing formatter. [#421](https://github.com/vuejs/vetur/issues/421).

### 0.9.6 | 2017-09-07 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.9.6/vspackage)

- Handle unquoted attr values. [#341](https://github.com/vuejs/vetur/issues/341).
- Exclude files based on gitignore file by default. [#418](https://github.com/vuejs/vetur/issues/418).
- Fix opening single Vue file without workspace perf issue. [#348](https://github.com/vuejs/vetur/issues/348).
- More tolerant parsing for template region, so IntelliSense would be available even when template is invalid. [#413](https://github.com/vuejs/vetur/issues/413).
- Find Definition for Vue components in `<template>`. [#411](https://github.com/vuejs/vetur/issues/411).
- Completion for component name and props in `<template>`. [#393](https://github.com/vuejs/vetur/issues/393).
- Fix emmet not showing suggestions correctly for items with `-`. [#398](https://github.com/vuejs/vetur/issues/398).
- Fix an ESLint error handling nested v-for. [#400](https://github.com/vuejs/vetur/issues/400).

### 0.9.5 | 2017-08-22 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.9.5/vspackage)

- slm support. [#366](https://github.com/vuejs/vetur/issues/366).
- Color Decorator support with `vetur.colorDecorators.enable`. [#28](https://github.com/vuejs/vetur/issues/28).
- sass lang removed. Now recommend [sass extension](https://marketplace.visualstudio.com/items?itemName=robinbentley.sass-indented) for sass grammar.
- Fix the multicursor in `scaffold` snippet.
- Initial support for goto definition and find references.
- `vetur.format.js.InsertSpaceBeforeFunctionParenthesis` now control both space before named and anonymous functions. [#226](https://github.com/vuejs/vetur/issues/226).

### 0.9.4 | 2017-08-16 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.9.4/vspackage)

- Integrate new Emmet support for html, css, scss, less and stylus. [#232](https://github.com/vuejs/vetur/issues/232).
- Revamp doc on website.
- Fix formatter adding spaces to empty lines in `<template>`. [#360](https://github.com/vuejs/vetur/issues/360).

### 0.9.3 | 2017-07-26 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.9.3/vspackage)

- Upgrade eslint-plugin-vue to 3.8.0. Fix false positives for `v-for`. [#261](https://github.com/vuejs/vetur/issues/261).
- Make `vetur.validation.style` apply to postcss. [#350](https://github.com/vuejs/vetur/issues/350).

### 0.9.2 | 2017-07-22 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.9.2/vspackage)

- Support tsx. [#337](https://github.com/vuejs/vetur/issues/337).
- Initial support for postcss. [#344](https://github.com/vuejs/vetur/issues/344).
- Add scaffold snippet for scoped style tag. [#335](https://github.com/vuejs/vetur/issues/335).
- Enhanced support for closing backstick and comment in js. [#329](https://github.com/vuejs/vetur/issues/329).
- Fix a syntax highlight issue for tags containing dashes. [#328](https://github.com/vuejs/vetur/issues/328).

Special shoutout to [@HerringtonDarkholme](https://github.com/HerringtonDarkholme) who has been contributing to most of the improvements in Vetur for the last many versions.

Congrats to [@g-plane](https://github.com/g-plane) and [@armano2](https://github.com/armano2) who landed their first PR in Vetur!

### 0.9.1 | 2017-07-12 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.9.1/vspackage)

- Fix a crash for importing non-existing .vue.ts file. [#321](https://github.com/vuejs/vetur/issues/321).

### 0.9.0 | 2017-07-08 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.9.0/vspackage)

- Onsen UI support. [#308](https://github.com/vuejs/vetur/issues/308).
- Suppress all Vetur error logs (still accessible in output tab). [#296](https://github.com/vuejs/vetur/issues/296).
- Fix an error for using `lang` http attributes in `<template>`. [#293](https://github.com/vuejs/vetur/issues/293).
- Fix path mapping error. [#301](https://github.com/vuejs/vetur/issues/301) and [#213](https://github.com/vuejs/vetur/issues/213).
- Fix a bug where typing `import` at top of `<script>` causes VLS crash. [#285](https://github.com/vuejs/vetur/issues/285).

### 0.8.7 | 2017-06-28 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.8.7/vspackage)

- Upgrade eslint-plugin-vue to address some template linting issues. [#294](https://github.com/vuejs/vetur/issues/294).
- Skip template checking for empty template. [#272](https://github.com/vuejs/vetur/issues/272).

### 0.8.6 | 2017-06-26 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.8.6/vspackage)

- Remove `vue-template-compiler` as dependency. Fix [#250](https://github.com/vuejs/vetur/issues/250), [#277](https://github.com/vuejs/vetur/issues/277) and [#286](https://github.com/vuejs/vetur/issues/286).
- `@` IntelliSense in template and better IntelliSense ordering. [#256](https://github.com/vuejs/vetur/issues/256).

### 0.8.5 | 2017-06-23 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.8.5/vspackage)

- Fix a Windows path handling issue that causes IntelliSense not to work. [#265](https://github.com/vuejs/vetur/issues/265).

### 0.8.4 | 2017-06-23 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.8.4/vspackage)

- Fix an issue that removes space after taking IntelliSense suggestion. [#244](https://github.com/vuejs/vetur/issues/244).
- Fix an issue that causes ESLint to report error on wrong line. [#263](https://github.com/vuejs/vetur/issues/263).

### 0.8.3 | 2017-06-23 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.8.3/vspackage)

- Add `vetur.validation.template` option to toggle vue-html validation using `eslint-plugin-vue@beta`. [#235](https://github.com/vuejs/vetur/issues/235) and [#257](https://github.com/vuejs/vetur/issues/257).
- Fix a language server crash. [#258](https://github.com/vuejs/vetur/issues/258).

### 0.8.2 | 2017-06-22 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.8.2/vspackage)

- Republishing with correct vue-language-server.

### 0.8.1 | 2017-06-22 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.8.1/vspackage)

- Published wrong veresion of vue-language-server in 0.8...oops.

### 0.8.0 | 2017-06-22 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.8.0/vspackage)

- eslint-plugin-vue support. [#235](https://github.com/vuejs/vetur/issues/235).
- Initial stylus support. [#227](https://github.com/vuejs/vetur/issues/227).
- Element UI support. [#234](https://github.com/vuejs/vetur/issues/234).
- Let hover display code signature with syntax highlight. [#247](https://github.com/vuejs/vetur/issues/247).

Shoutout to @HerringtonDarkholme who helped implementing many new features!

### 0.7.0 | 2017-06-04 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.7.0/vspackage)

- Correct syntax highlighting for longer directives such as `@click.capture.stop`. [#79](https://github.com/vuejs/vetur/issues/79).
- Doc at https://octref.github.io/vetur/
- Disable js/ts language server to prevent crash when opening vue files without workspace. [#160](https://github.com/vuejs/vetur/issues/160).
- Restrcit scaffold snippets to vue region (outside all other regions) strictly. [#219](https://github.com/vuejs/vetur/issues/219).
- Fix a `textDocument/hover` error. [#191](https://github.com/vuejs/vetur/issues/191).
- Incorporate [vls](https://github.com/octref/vls) into vetur's `/server`.

### 0.6.10 | 2017-06-01 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.6.10/vspackage)

- Fix a language service restart issue.
- Fix a `documentHighlight` error. [#215](https://github.com/vuejs/vetur/issues/215).
- Fix a Windows path handling issue causing IntelliSense unusable. [#205](https://github.com/vuejs/vetur/issues/205).

### 0.6.10 | 2017-05-16 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.6.10/vspackage)

- Add back symbol, highlight and signature provider. [#194](https://github.com/vuejs/vetur/issues/194).

### 0.6.9 | 2017-05-14 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.6.9/vspackage)

- Update grammar to allow tags like `<template-component>` in vue-html. [#189](https://github.com/vuejs/vetur/issues/189).
- Update grammar to allow html comments outside all regions. [#195](https://github.com/vuejs/vetur/issues/195).
- Handle new file creation so vetur's IntelliSense work on it. [#192](https://github.com/vuejs/vetur/issues/192).
- Enable breakpoints for vue files. Doc for debugging coming later in [#201](https://github.com/vuejs/vetur/issues/201).
- Add `vetur.format.styleInitialIndent` and `vetur.format.scriptInitialIndent` to allow initial indent in these sections for formatting. [#121](https://github.com/vuejs/vetur/issues/121).

### 0.6.8 | 2017-05-08 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.6.8/vspackage)

- Hot fix for a Windows crash caused by incorrect path handling.

### 0.6.7 | 2017-05-07 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.6.7/vspackage)

- Fix a bug of path handling on Windows. [#183](https://github.com/vuejs/vetur/issues/183).
- Add top level scaffolding snippets, such as `scaffold`, `template with pug`, `style with less`.
- Add `vetur.validation.style` and `vetur.validation.script` to allow toggling validation.

### 0.6.6 | 2017-05-06 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.6.6/vspackage)

- Add back hover provider. [#181](https://github.com/vuejs/vetur/issues/181).

### 0.6.5 | 2017-05-05 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.6.5/vspackage)

- Fix a formatting bug for vue-html. [#99](https://github.com/vuejs/vetur/issues/99).
- Disable unused language features.
- Check file is included in tsconfig/jsconfig before providing language features to prevent TS crash.

### 0.6.4 | 2017-04-27 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.6.4/vspackage)

- When running Vue Language Server, do not use debug port. [#162](https://github.com/vuejs/vetur/issues/162) and [#148](https://github.com/vuejs/vetur/issues/148).
- Avoid module resolution in `node_modules`, so CPU and Memory usage won't spike. [#131](https://github.com/vuejs/vetur/issues/131).

### 0.6.3 | 2017-04-26 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.6.3/vspackage)

- Include `vue-template-compiler` in vetur to avoid version mismatch. [#135](https://github.com/vuejs/vetur/issues/135).

### 0.6.2 | 2017-04-24 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.6.2/vspackage)

- Fix various Vue Language Server crashes.

### 0.6.1 | 2017-04-20 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.6.1/vspackage)

- Fix a bug in module resolution that causes Vue Langauge Server to crash. [#122](https://github.com/vuejs/vetur/issues/122) and [#123](https://github.com/vuejs/vetur/issues/123).

### 0.6.0 | 2017-04-19 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.6.0/vspackage)

- Improve formatting support with [options](https://github.com/octref/vetur/blob/master/docs/formatting.md) to fine-tune formatting style in `js-beautify` and TypeScript's language service.
- Improve `sass` syntax highlighting based on grammar from [robinbentley/vscode-sass-indented](https://github.com/robinbentley/vscode-sass-indented). [#41](https://github.com/vuejs/vetur/issues/41).

Thanks to [@sandersn](https://github.com/sandersn)'s [PR](https://github.com/octref/vetur/pull/94):
- Preliminary TypeScript support (try `<script lang="ts">`)
- Improved IntelliSense for `js/ts` in Vue SFC.
- Correct Module Resolution (try `npm i lodash @types/lodash` and use lodash in your Vue SFC).

### 0.5.6 | 2017-03-20 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.5.6/vspackage)

- Update js-beautify to include `preserve_newlines` options for css/scss/less.

### 0.5.5 | 2017-03-17 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.5.5/vspackage)

- Fix wrongly marked regions. [#92](https://github.com/vuejs/vetur/issues/92).

### 0.5.4 | 2017-03-16 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.5.4/vspackage)

- Change default formatting options to preserve new lines in html.
- Change default formatting options for html to force-align attributes. [#77](https://github.com/vuejs/vetur/issues/77).
- Re-enable scss/less error checking

### 0.5.3 | 2017-03-16 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.5.3/vspackage)

- Hotfix to include correct dependencies in LanguageClient.

### 0.5.2 | 2017-03-15 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.5.2/vspackage)

- Re-enable formatter based on js-beautify. [#82](https://github.com/vuejs/vetur/issues/82).

### 0.5.1 | 2017-03-06 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.5.1/vspackage)

- Temporarily disable formatter. Will enable once [#82](https://github.com/vuejs/vetur/issues/82) is addressed.

### 0.5.0 | 2017-03-06 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.5.0/vspackage)

- vetur now depends on https://github.com/octref/vls to provide some IntelliSense.
- Provide IntelliSense for all `v-` directives and `key`, `ref`, `slot`, [#26](https://github.com/vuejs/vetur/issues/26).

### 0.4.1 | 2017-03-02 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.4.1/vspackage)

- Relax grammar to allow `<script type="text/babel">`. [#70](https://github.com/vuejs/vetur/issues/70).
- Move `files.associations` setup in README, as vue file is not associated with html by default in VS Code.

### 0.4.0 | 2017-02-27 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.4.0/vspackage)

- Port new changes from VS Code's html extension, which fixes
  - Embedded formatter for html/css/scss/less/js
  - IntelliSense for html

### 0.3.8 | 2017-02-23 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.3.8/vspackage)

- Allow `<template lang="html">`. [#52](https://github.com/vuejs/vetur/issues/52).

### 0.3.7 | 2017-02-23 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.3.7/vspackage)

- Syntax highlighting for coffee and postcss. [#50](https://github.com/vuejs/vetur/issues/50) and [#56](https://github.com/vuejs/vetur/issues/56).
- Various grammar fixes.

### 0.3.6 | 2017-02-21 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.3.6/vspackage)

- Support nested `<template>`. [#48](https://github.com/vuejs/vetur/issues/48).
- Use vue-html grammar for vue-html lang. [#45](https://github.com/vuejs/vetur/issues/45).

### 0.3.5 | 2017-02-20 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.3.5/vspackage)

- Add vue-html as a language. [#44](https://github.com/vuejs/vetur/issues/44).
- Remove vue-js and use VS Code's javascript grammar.

### 0.3.4 | 2017-02-19 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.3.4/vspackage)

- Allow scope & module on css style tag. [#43](https://github.com/vuejs/vetur/issues/43).

### 0.3.3 | 2017-02-19 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.3.3/vspackage)

- Split vue grammar into vue SFC and vue's html
- Tweak language region boundry that enables correct snippet in each region. [#35](https://github.com/vuejs/vetur/issues/35) and [#36](https://github.com/vuejs/vetur/issues/36).

### 0.3.2 | 2017-02-10 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.3.2/vspackage)

- Allow single quote for lang attr. [#31](https://github.com/vuejs/vetur/issues/31).

### 0.3.1 | 2017-02-04 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.3.1/vspackage)

- Mark sass and stylus region so linting is disabled on them. [#25](https://github.com/vuejs/vetur/issues/25).

### 0.3.0 | 2017-02-01 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.3.0/vspackage)

- Error-checking / linting for css/scss/less/js. [#16](https://github.com/vuejs/vetur/issues/16) and [#24](https://github.com/vuejs/vetur/issues/24).

### 0.2.2 | 2017-02-01 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.2.2/vspackage)

- Fix comment-toggling for embedded language. [#18](https://github.com/vuejs/vetur/issues/18).

### 0.2.1 | 2017-01-16 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.2.1/vspackage)

- Adopt YAML for editing tmLanguage.
- Fix syntax highlighting for TS. [#19](https://github.com/vuejs/vetur/issues/19).

### 0.2.0 | 2017-01-03 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.2.0/vspackage)

- Language server based on VS Code's html extension. [#2](https://github.com/vuejs/vetur/issues/2).
- Basic SCSS and LESS language features.

### 0.1.2 | 2016-12-19 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.1.2/vspackage)

- Allow `pug` as an alternative to `jade` in template. [#9](https://github.com/vuejs/vetur/issues/9).

### 0.1.1 | 2016-12-18 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.1.1/vspackage)

- Fix ternary operator syntax highlighting. [#3](https://github.com/vuejs/vetur/issues/3) and [#11](https://github.com/vuejs/vetur/issues/11).

### 0.1 | 2016-11-06 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/octref/vsextensions/vetur/0.1/vspackage)

Initial release, including:

- Syntax highlighting for:
  - html/jade
  - css/sass/scss/less/stylus
  - js/ts
- emmet for `<template>`
