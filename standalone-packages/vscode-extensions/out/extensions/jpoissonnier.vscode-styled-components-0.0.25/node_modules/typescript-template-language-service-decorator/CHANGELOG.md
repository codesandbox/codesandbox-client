# Changelog

## 2.0.0 - October 15, 2018
- Require project object to be passed to top level api.

## 1.7.1 - July 25, 2018
- Make sure correct `this` is bound for delegate calls.

## 1.7.0 - July 9, 2018
- Added `rawText` that returns the raw contents of a template literal.
- Memoize some properties. 
- Correctly mark some arrays as readonly in API.

## 1.6.1 - July 3, 2018
- `getOutliningSpans` should be optional like other wrappers.

## 1.6.0 - July 3, 2018
- Added wrapper for `getOutliningSpans`.

## 1.5.0 - July 2, 2018
- Added a `getSubstitutions` method on the settings. This method takes the raw template string
and a list of all placeholder spans and returns the string with all placeholders removed. 

## 1.4.0 - July 2, 2018
- Allow `getCodeFixesAtPosition` to return `CodeFixAction`.
- Fixed templated tags not being detected.

## 1.3.0 - June 29, 2018
- Add wrapper for `getSignatureHelpItems`.

## 1.2.0 - February 12, 2018
- Add wrapper for `getCodeFixesAtPosition`.

## 1.1.0 - January 9, 2018
- Add wrapper for `completionEntryDetails`.

## 1.0.2 - Novermber 29, 2017
- Fix completion provider for TS 2.6.2 API changes.

## 1.0.1 - Novermber 9, 2017
- Do not require a peer depdency on TypeScript.

## 1.0.0 - Novermber 9, 2017
- Do not take runtime dependency on TypeScript.

## 0.1.3
- Allow spaces after tag names

## 0.1.2 - October 24, 2017
- Compile to target es5 for VS support.

## 0.1.1 - October 11, 2017
- Ensure `getFormattingEditsForRange` also gets editorSettings.

## 0.1.0 - October 10, 2017
- Added `getFormattingEditsForRange` to language service.

## 0.0.1 - October 10, 2017
- Fix path case issue for case sensitive file systems.

## 0.0.1 - October 10, 2017
- Initial release