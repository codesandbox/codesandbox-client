# Changelog

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