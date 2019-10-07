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
  * Updating to [language server type 3.0](https://github.com/Microsoft/vscode-languageserver-node/tree/master/types) API