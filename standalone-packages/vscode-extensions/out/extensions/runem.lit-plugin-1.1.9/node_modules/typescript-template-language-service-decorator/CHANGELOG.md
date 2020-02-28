# Changelog

## 2.2.0 - November 16, 2018
- Don't mutate the decorated language service. This was the intent of the original API design but in practice we were
mutating the input language service. Now you must alway use the language service returned by `decorateWithTemplateLanguageService`.
- Add wrapper for `getJsxClosingTagAtPosition`.

## 2.1.3 - November 15, 2018
- Fix `getReferencesAtPosition` not being called when using TS 3.1+.

## 2.1.2 - November 13, 2018
- Fix signature help not annotating that you can return `undefined`.
- For `definitions` and `references`, don't delegate back to language service is plugin provides a empty response.

## 2.1.1 - November 12, 2018
- Fix `getReferencesAtPosition` not being marked as optional.

## 2.1.0 - November 12, 2018
- Added wrapper for `getDefinitionAtPosition`. Thanks @divyenduz!
- Added wrapper for `getReferencesAtPosition`.

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

## 1.0.2 - November 29, 2017
- Fix completion provider for TS 2.6.2 API changes.

## 1.0.1 - November 9, 2017
- Do not require a peer dependency on TypeScript.

## 1.0.0 - November 9, 2017
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