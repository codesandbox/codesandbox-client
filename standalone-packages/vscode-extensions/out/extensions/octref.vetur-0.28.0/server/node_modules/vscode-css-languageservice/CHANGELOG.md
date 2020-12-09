

4.3.0 - 2020-06-26
===================
  * module resolving in urls (`~foo/hello.html`) when using `LanguageService.findDocumentLinks2` and if `fileSystemProvider` is provided.
  * new API `LanguageService.doComplete2`. Support path completion if `fileSystemProvider.readDirectory` is provided.
  * `DocumentContext.resolveReference` can also return undefined (if the ref is invalid)

4.2.0 - 2020-05-14
===================
  * new API `LanguageServiceOptions.useDefaultDataProvider` to control whether the default data provider is used. Defaults to true
  * new API `LanguageService.setDataProviders` to update the data providers.

4.1.0 - 2020-02-23
===================
  * markdown descriptions in completions and hover
    * new API `LanguageServiceOptions.clientCapabilities` with `ClientCapabilities` for completion documentationFormat and hover content
    * extended format of CustomData (version 1.1) with MarkupContent contents and reference links
  * dynamically resolved links for scss include statements
    * new API `LanguageService.findDocumentLinks2`: Also returns dynamically resolved links if `fileSystemProvider` is provided
    * new API `LanguageServiceOptions.fileSystemProvider` with `FileSystemProvider` to query the file system (currently used to resolve the location of included files)
  * new API `CompletionSettings.completePropertyWithSemicolon`
  * new API `ICompletionParticipant.onCssMixinReference`
  * Switch to `TextDocument` from `vscode-languageserver-textdocument` (reexported from the main module)

4.0.0 / 2019-06-12
===================
  * `LanguageServiceOptions.customDataProviders` allows you to use custom datasets for properties, at-properties, pseudo-classes and pseudo-elements.
  * New API `LanguageService.getSelectionRanges`

3.0.12 / 2018-10-29
===================
  * Selector hover shows specificity
  * New linter setting `validProperties`: a comma separated list of all properties not to be included in validation checking.

3.0.10 / 2018-08-27
===================
  * New API `ICompletionParticipant.onCssImportPath` to participate on @import statement.
  * New API `LanguageService.doCodeActions2` returning code actions as `CodeAction[]`.

3.0.9 / 2018-07-25
==================
  * Use MDN data for to enhance CSS properties definition. See [#91](https://github.com/Microsoft/vscode-css-languageservice/pull/91).
  * New API `LanguageService.getFoldingRanges` returning folding ranges in the given document.

3.0.8 / 2018-03-08
==================
  * Provide ems modules in lib/esm

3.0.0 / 2017-01-11
==================
  * Changed API `LanguageService.getColorPresentations`: separate parameters `range` and `color` (to match LS API)

2.1.7 / 2017-09-21
==================
  * New API `LanguageService.getColorPresentations` returning presentations for a given color. 
  * New API type `ColorPresentation` added.

2.1.4 / 2017-08-28
==================
  * New API `LanguageService.findDocumentColors` returning the location and value of all colors in a document. 
  * New API types `ColorInformation` and `Color` added.
  * Deprecated `LanguageService.findColorSymbols`. Use `LanguageService.findDocumentColors` instead.
  
2.1.3 / 2017-08-15
==================
  * New argument `documentSettings` to `LanguageService.doValidation` to support resource specific settings. If present, document settings are used instead of the options passed in configure.

2.0.0 / 2017-02-17
==================
  * Updating to [language server type 3.0](https://github.com/Microsoft/vscode-languageserver-node/tree/master/types) API.