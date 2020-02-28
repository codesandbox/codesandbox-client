# Changelog

## 0.9.0 - November 16, 2018
- Add auto closing tags.
- Prevent potential double decoration of a language service.

## 0.8.0 - November 16, 2018
- Allow editors to configure plugin. Requires TS 3.1.4+ and editor support.

## 0.7.1 - November 13, 2018
- Fix tag highlighting when using TS 3.1+.

## 0.7.0 - November 13, 2018
- Fix some false positive reporting for styles. Thanks @csvn!
- Tag matching highlighting. Requires VS Code 1.30+
- Picked up new styled components version which includes some important fixes and additions.

## 0.6.0 - October 15, 2018
- Pick up new html service version with bug fixes and features like vendor info.
- Pick up new decorator library version to fix a possible state corruption error.

## 0.5.3 - July 9, 2018
- Disable formatting in html that contains a style block. There is an annoying bug that may corrupt the html when running format on these blocks. Better to disable formatting in them for now. 

## 0.5.2 - July 9, 2018
- Remove TS as peerDep.

## 0.5.1 - July 9, 2018
- Fixing false errors when using placeholders in style block.

## 0.5.0 - July 6, 2018
- Error reporting and quick fixes for css in style blocks. Thanks @justinribeiro!

## 0.4.2 - July 5, 2018
- Use more consistent look for quick info hover. Thanks @justinribeiro!

## 0.4.1 - July 3, 2018
- Return css quickInfo inside styled blocks. Thanks @justinribeiro!

## 0.4.0 - July 3, 2018
- Added folding support.

## 0.3.1 - June 29, 2018
- Don't return signature help inside html template strings.

## 0.3.0 - June 29, 2018
- Added css IntelliSense inside of `<style>` tags. Thanks @justinribeiro!

## 0.2.0 - January 11, 2018
- Add completion entry details for tag completions.
- Support `raw` tag by default as well.
- Don't remove newlines in empty html block.

## 0.1.1 - January 9, 2018
- Also make sure we don't have a runtime dep on TS for hover.

## 0.1.0 - January 9, 2018
- Make sure we don't have a runtime dep on TS for completion items

## 0.0.3 - Novermber 30, 2017
- Do not take run time dependency on TS.
- Fix auto import completions not showing up when using plugin with TS 2.6.2+

## 0.0.2 - October 27, 2017
- Support for VS 2017

## 0.0.1 - October 10, 2017
- Initial release