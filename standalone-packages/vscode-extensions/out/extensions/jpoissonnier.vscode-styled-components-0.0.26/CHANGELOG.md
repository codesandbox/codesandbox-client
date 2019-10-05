# Release Notes

## 0.0.26

- Enable plugin with workspace version by default, thanks to @mjbvz 
- Add support for TypeScript type parameters, thansk to @antoinerousseau

## 0.0.25

- Fix [#137](https://github.com/styled-components/vscode-styled-components/issues/137), thanks to @jbm1991

## 0.0.24

- Upgrade to typescript-styled-plugin 0.13.0, thanks to @mjbvz

## 0.0.23

- Upgrade to typescript-styled-plugin 0.12.0, thanks to @mjbvz

## 0.0.22

- Upgrade to typescript-styled-plugin 0.11.0, thanks to @mjbvz
- Add support for new createGlobalStyle API, thanks to @probablyup
- Add support for .vue file extension, thanks to @jaxx2104

## 0.0.21

- Upgrade to typescript-styled-plugin 0.10.0
- Try making highlighting of template tag more consistent with other tagged templates

## 0.0.20

- Fix language mode inside js expression, thanks to @mjbvz

## 0.0.19

- Upgrade to typescript-styled-plugin 0.8.1

## 0.0.18

- Update to styled plugin 0.6.3, thansk to @mjbvz

## 0.0.17

- Add support for emotion-style TypeScript declarations, thanks to @dstaley
- Fix highlighting after `withComponent`, thanks to @Cu3PO42
- Enable highlighting after `Component.extend.attrs`, thanks to @Cu3PO42
- Don't inject highlighting grammar into strings, thanks to @Cu3PO42

## 0.0.16

- Add Emmet CSS Suggestions, thanks to @mjbvz and @ramya-rao-a and the awesome [TypeScript Styled Plugin](https://github.com/Microsoft/typescript-styled-plugin)

## 0.0.15

- Support @import rules in injectGlobal, thanks to @Cu3PO42
- Update typescript-styled-plugin to 0.5.1, adding quick fixes for misspelled properties, thanks to @mbjvz

## 0.0.14

- Replace the CSS grammar by one built on language-sass and language-css to ensure syntax highlighting works as in (S)CSS files, thanks to @Cu3PO42
- Rewrites the injection grammar to utilise the built-in highlighting for the JS/TS parts, thanks to @Cu3PO42
- Only change language mode to CSS inside of a template literal, thanks to @Cu3PO42

## 0.0.13

- Add support attrs support, thanks to @bsutt123

## 0.0.12

- Support highlighting in media templates, thanks to @trevorwright

## 0.0.11

- Detailed CSS IntelliSense while working in styled strings and syntax error reporting, thanks to @matb. Note that this requires VSCode 1.20+

## 0.0.10

- Fix highlighting in VS Code 1.18, thanks to @mbjvz
- Fix highlighting of display: flex, thanks to @chinclubi

## 0.0.9

- Styled string contents are now marked as CSS embeddedLanguage, enabling proper CSS comments and better bracket matching, thanks to @mjbvz

## 0.0.8

- Add support for Typescript, thanks to @misantronic

## 0.0.7

- Add support for `.withComponent()`, thanks to @bessey
- Add support for `.extend`

## 0.0.6

- Allow space before `in the styled regex`

## 0.0.5

- Fix `styled` regex

## 0.0.4

- Update CSS grammar to latest version from https://github.com/gandm/language-babel
- Make styled-components default export matching case insensitive, fixes #10

## 0.0.3

Don't highlight inside comments, thanks to @wmertens and @alpyre

## 0.0.2

Add suport for string tagnames, injectGlobal and keyframes

## 0.0.1

Initial release of vscode-styled-components
