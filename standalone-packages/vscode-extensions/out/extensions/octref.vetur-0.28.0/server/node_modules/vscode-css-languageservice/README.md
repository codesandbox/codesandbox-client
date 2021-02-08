# vscode-css-languageservice
Language services for CSS, LESS and SCSS

[![npm Package](https://img.shields.io/npm/v/vscode-css-languageservice.svg?style=flat-square)](https://www.npmjs.org/package/vscode-css-languageservice)
[![NPM Downloads](https://img.shields.io/npm/dm/vscode-css-languageservice.svg)](https://npmjs.org/package/vscode-css-languageservice)
[![Azure DevOps Build Status](https://img.shields.io/azure-devops/build/vscode/2377f926-a00b-46ed-9fb1-79465b3e998b/20.svg?label=Azure%20DevOps)](https://dev.azure.com/vscode/vscode-css-languageservice/_build?definitionId=20)
[![Travis Build Status](https://img.shields.io/travis/microsoft/vscode-css-languageservice.svg?label=Travis)](https://travis-ci.org/Microsoft/vscode-css-languageservice)

Why?
----
The _vscode-css-languageservice_ contains the language smarts behind the CSS, LESS and SCSS editing experience of Visual Studio Code
and the Monaco editor.
 - *doValidation* analyses an input string and returns syntax and lint errors.
 - *doComplete* provides completion proposals for a given location.
 - *doHover* provides a hover text for a given location.
 - *findDefinition* finds the definition of the symbol at the given location.
 - *findReferences* finds all references to the symbol at the given location.
 - *findDocumentHighlights* finds all symbols connected to the given location.
 - *findDocumentSymbols* provides all symbols in the given document
 - *doCodeActions* evaluates code actions for the given location, typically to fix a problem.
 - *findColorSymbols* evaluates all color symbols in the given document
 - *doRename* renames all symbols connected to the given location.
  - *getFoldingRanges* returns folding ranges in the given document.

Installation
------------

    npm install --save vscode-css-languageservice
    
    
API
---

```typescript

export interface LanguageService {
	configure(raw: LanguageSettings): void;
	doValidation(document: TextDocument, stylesheet: Stylesheet, documentSettings?: LanguageSettings): Diagnostic[];
	parseStylesheet(document: TextDocument): Stylesheet;
	doComplete(document: TextDocument, position: Position, stylesheet: Stylesheet): CompletionList;
	setCompletionParticipants(registeredCompletionParticipants: ICompletionParticipant[]): void;
	doHover(document: TextDocument, position: Position, stylesheet: Stylesheet): Hover | null;
	findDefinition(document: TextDocument, position: Position, stylesheet: Stylesheet): Location | null;
	findReferences(document: TextDocument, position: Position, stylesheet: Stylesheet): Location[];
	findDocumentHighlights(document: TextDocument, position: Position, stylesheet: Stylesheet): DocumentHighlight[];
	findDocumentSymbols(document: TextDocument, stylesheet: Stylesheet): SymbolInformation[];
	doCodeActions(document: TextDocument, range: Range, context: CodeActionContext, stylesheet: Stylesheet): Command[];
	doCodeActions2(document: TextDocument, range: Range, context: CodeActionContext, stylesheet: Stylesheet): CodeAction[];
	findDocumentColors(document: TextDocument, stylesheet: Stylesheet): ColorInformation[];
	getColorPresentations(document: TextDocument, stylesheet: Stylesheet, color: Color, range: Range): ColorPresentation[];
	doRename(document: TextDocument, position: Position, newName: string, stylesheet: Stylesheet): WorkspaceEdit;
	getFoldingRanges(document: TextDocument, context?: { rangeLimit?: number; }): FoldingRange[];
	getSelectionRanges(document: TextDocument, positions: Position[], stylesheet: Stylesheet): SelectionRange[];
}

export interface LanguageSettings {
	validate?: boolean;
	lint?: any;
}

```

Development
-----------

**Note: All CSS entites (properties, at-rules, etc) are sourced from https://github.com/microsoft/vscode-custom-data/tree/master/web-data and transpiled here. For adding new property or fixing existing properties' completion/hover description, please open PR there).**

How can I run and debug this node module?

- clone, npm install
- open the folder in VSCode.
- set breakpoints, e.g. in `cssCompletion.ts`
- run JUnit tests from the debug viewlet and wait until a breakpoint is hit:
![image](https://user-images.githubusercontent.com/6461412/47481279-5cffcd80-d833-11e8-8c03-18c6e7a28053.png)


In VSCode:
- run VSCode out of sources as described here: https://github.com/Microsoft/vscode/wiki/How-to-Contribute
  - in the instance run from sources open a `.css` file
- open a VSCode on the VSCode source
  - run command `Debug: Attach to Node process` and pick the process with the `css-language-features` path
  - Set a breakpoint in `extensions/css-language-features/server/node_modules/vscode-css-languageservice/lib/umd/services/cssCompletion.js`
- in the instance run from sources invoke code completion in the .css file
- use `yarn link vscode-css-languageservice` in `extensions/css-language-features/server` to run VSCode with your changes to `vscode-css-languageservice`



License
-------

(MIT License)

Copyright 2016, 2019 Microsoft

With the exceptions of `build/mdn-documentation.js`, which is built upon content from [Mozilla Developer Network](https://developer.mozilla.org/en-US/docs/Web)
and distributed under CC BY-SA 2.5.
