# Changelog

# 0.14.0 - February 26, 2019
- Pick up new language service version.
- Support for dynamically changing configuration.
- Only enable plugin for TS 3.0+ in order to support automatically enabling plugin for workspace TS versions.

# 0.13.0 - November 8, 2018
- Mark color completions with the `'color'` `kindModifier`. This allows editors to render the color previews inline.
- Fix more false positive errors.

# 0.12.0 - October 15, 2018
- Pick up new decorator library version to fix a possible state corruption error.

# 0.11.0 - September 11, 2018
- Fixed some false positive errors when using a placeholder in a contexual selector. Thanks @lukyth!
- Apply in `injectGlobal` or `createGlobalStyle` by default. Thanks @scf4!

# 0.10.0 - July 10, 2018
- Add folding support.

# 0.9.2 - July 9, 2018
- Remove TS as peerDep.

# 0.9.1 - July 9, 2018
- Allow language service to be consumed by other libraries.

# 0.8.1 - July 2, 2018
- Fix some false error reports around creative uses of placeholders.

# 0.8.0 - July 2, 2018
- Support for emotion style typescript declarations.

# 0.7.0 - June 25, 2018
- Picked up new CSS version. Brings improved suggestions and better documentation.

# 0.6.3 - April 20, 2018
- Fixed `width: ${1}%;` incorrectly reported as an error.

# 0.6.2 - April 18, 2018
- Fixed case where a placeholder that looked like a mixin was incorrectly reported as an error.

# 0.6.1 - April 16, 2018
- Fixed some cases where placeholder usage was incorrectly reported as an error.

# 0.6.0 - February 16, 2018
- Added emmet suggestions. Thanks @ramya-rao-a!

# 0.5.1 - February 13, 2018
- Small fix for suggestions inside of nested selectors.

# 0.5.0 - February 12, 2018
- Add quick fixes for misspelled property names.

# 0.4.1 - February 12, 2018
- Fixed false error when placeholder is used as a selector.

# 0.4.0 - January 16, 2018
- Fix suggestions inside of nested selectors. Thanks @aczekajski!

# 0.3.1 - January 11, 2018
- Cache completion entries so we don't recompute them as often.

# 0.3.0 - January 9, 2018
- Added basic support for completion entry details

# 0.2.2 - November 29, 2017
- Fix auto import completions not showing up when using plugin with TS 2.6.2+

# 0.2.1 - November 27, 2017
- Fix cases where placeholder is followed by a trailing semicolon. Thanks @kingdaro!

# 0.2.0 - November 9, 2017
- Do not take runtime dependecy on TypeScript.

# 0.1.2 — October 24, 2017
- Fix bug that could cause errors not to be reported when on the last line of a block.

# 0.1.1 — October 24, 2017
- Compile to ES5 to support regular Visual Studio

# 0.1.0
- Support for nested classes. Thanks @asvetliakov!
- Support for styled properties, such as `MyButton.extend...`. Thanks @asvetliakov!
- Fix a bug that could cause errors to stop being reported.

## 0.0.5 - September 29, 2017
- Fix empty value error being showing when using placeholder for value in multiline template strings.

## 0.0.4 - September 29, 2017
- Fix multiline strings with placeholders.

## 0.0.3 - September 29, 2017
- Initial support for strings with placeholders.

## 0.0.2 - September 29, 2017
- Disable empty ruleset lint error by default
- Fix styled completions showing on character immediately before start of string
- Supprt `css` tag by default.
- Remove a bunch of files from published npm package.

## 0.0.1 - September 28, 2017
- Initial release