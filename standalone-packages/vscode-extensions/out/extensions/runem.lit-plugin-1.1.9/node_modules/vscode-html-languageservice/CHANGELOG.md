2.1.3 / 2018-04-16
==================
  * Added API `htmlLanguageService.getFoldingRanges` returning folding ranges for the given document

2.1.0 / 2018-03-08
==================
  * Added API `htmlLanguageService.setCompletionParticipants` that allows participation in code completion
  * provide ES modules in lib/esm

2.0.6 / 2017-08-25
==================
  * Added new API `htmlLanguageService.doTagComplete`. Called behind a `>` or `\`, `doTagComplete` will compute a closing tag. The result is a snippet string that can be inserted behind the position, or null, if no tag completion should be performed.
  * New settings `CompletionConfiguration.hideAutoCompleteProposals`. If set, `doComplete` will not propose a closing tag proposals on `>`.
  * These APIs are experimental and might be improved.

2.0.3 / 2017-03-21
==================
  * Fix indentation issues when formatting a range

2.0.1 / 2017-02-21
==================
  * Support for [base URLs](https://developer.mozilla.org/de/docs/Web/HTML/Element/base). `DocumentContext.resolveReference` now gets the base URI to take into account when resolving a reference. Refer to [links.test.ts](https://github.com/Microsoft/vscode-html-languageservice/blob/master/src/test/links.test.ts) for guidance on how to implement a `DocumentContext`.
  * Added `htmlLanguageService.findDocumentSymbols`: Returns a symbol for each tag in the document. Symbol name is in the form `tag(#id)?(.class)+`.

2.0.0 / 2017-02-17
==================
  * Updating to [language server type 3.0](https://github.com/Microsoft/vscode-languageserver-node/tree/master/types) API
