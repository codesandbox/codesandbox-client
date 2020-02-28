# Change Log

## 1.11.0 - December 19, 2018
- Fixed syntax highlighting of unquoted attributes. Thanks @csvn!
- Use TS api instead of command to sync settings with VS Code.
- Enable loading of plugin when using workspace version of TypeScript. Requires VS Code 1.31+

## 1.10.1 - November 16, 2018
- Fix bug that could cause incorrect overriding of `tsconfig` settings by VS Code settings. 

## 1.10.0 - November 16, 2018
- Auto closing tags.
- Prevent multiple copies of completions and other features from potentially showing up.

## 1.9.0 - November 16, 2018
- Allow configuring plugin using VS Code directly. Requires TS 3.2+ and VS Code 1.30+.

## 1.8.2 - November 15, 2018
- Add schema for `jsconfig` and `tsconfig` settings.

## 1.8.1 - November 15, 2018
- Fix tag highlighting when using TS 3.1+.

## 1.8.0 - November 13, 2018
- Fix some false positive reporting for styles. Thanks @csvn!
- Tag matching highlighting. Requires VS Code 1.30+
- Picked up new styled components version which includes some bug fixes and enhancements.

## 1.7.0 - October 15, 2018
- Pick up new html service version with bug fixes and features like vendor info.
- Pick up new decorator library version to fix a possible state corruption error.

## 1.6.2 - July 9, 2018
- Disable format for html that contains styled blocks to prevent an annoying bug.

## 1.6.1 - July 9, 2018
- Fix some false errors when placeholders are used in styled block.

## 1.6.0 - July 6, 2018
- Error reporting and quick fixes for css in style tags. Thanks @justinribeiro!

## 1.5.2 - July 5, 2018
- Use more consistent look for quick info hover. Thanks @justinribeiro!

## 1.5.1 - July 3, 2018
- Return css quickInfo inside styled blocks. Thanks @justinribeiro!

## 1.5.0 - July 3, 2018
- Added folding support.

## 1.4.3 - July 2, 2018
- Fix a few more cases where syntax highlighting was not working.

## 1.4.2 - July 2, 2018
- Use css comments in style blocks. Thanks @justinribeiro!
- Fix syntax highlighting not working in some cases.

## 1.4.1 - June 29, 2018
- Don't return signature help inside html template strings.

## 1.4.0 - June 29, 2018
- Added css IntelliSense inside of `<style>` tags. Thanks @justinribeiro!

## 1.3.0 - June 11, 2018
- Add support for syntax highlighting of lit-html `svg` blocks. Thanks @justinribeiro!

## 1.2.0 - January 29, 2018
- Yo I heard you like html so I added syntax highlighting for lit html templates inside of html script blocks

## 1.1.0 - January 12, 2018
- Pick up new plugin version that adds completion entry details and fixes some bugs.

## 1.0.0 - January 11, 2018
- Highlight JS substitutions in html string attributes
- Adds html language support: IntelliSense, hover, formatting. Requires VS Code 1.20

## 0.2.0 - December 13, 2017
- Support spaces after html tag. Thanks @mhoyer!
- Support `obj.html` style tags. Thanks @mhoyer!

## 0.1.0 - December 7, 2017
- Support spaces before html tag. Thanks @simonwjackson!
- Support for bel/choo `raw` tag. Thanks @simonwjackson!

## 0.0.4 - October 12, 2017
- Fix syntax highlighting kicking in inside of strings

## 0.0.1 - October 10, 2017
- Initial release