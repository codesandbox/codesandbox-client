# vscode-css-languageservice
Language services for CSS, LESS and SCSS

[![npm Package](https://img.shields.io/npm/v/vscode-css-languageservice.svg?style=flat-square)](https://www.npmjs.org/package/vscode-css-languageservice)
[![NPM Downloads](https://img.shields.io/npm/dm/vscode-css-languageservice.svg)](https://npmjs.org/package/vscode-css-languageservice)
[![Build Status](https://travis-ci.org/Microsoft/vscode-css-languageservice.svg?branch=master)](https://travis-ci.org/Microsoft/vscode-css-languageservice)

Why?
----
The _vscode-css-languageservice_ contains the language smarts behind the CSS, LESS and SCSS editing experience of Visual Studio Code
and the Monaco editor.
 - *doValidation* analyses an input string and returns syntax and lint errros.
 - *doComplete* provides completion proposals for a given location.
 - *doHover* provides a hover text for a given location.
 - *findDefinition* finds the definition of the symbol at the given location.
 - *findReferences* finds all references to the symbol at the given location.
 - *findDocumentHighlights* finds all symbols connected to the given location.
 - *findDocumentSymbols* provides all symbols in the given document
 - *doCodeActions* evaluats code actions for the given location, typically to fix a problem.
 - *findColorSymbols* evaluates all color symbols in the given document
 - *doRename* renames all symbols connected to the given location.

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
	doHover(document: TextDocument, position: Position, stylesheet: Stylesheet): Hover;
	findDefinition(document: TextDocument, position: Position, stylesheet: Stylesheet): Location;
	findReferences(document: TextDocument, position: Position, stylesheet: Stylesheet): Location[];
	findDocumentHighlights(document: TextDocument, position: Position, stylesheet: Stylesheet): DocumentHighlight[];
	findDocumentSymbols(document: TextDocument, stylesheet: Stylesheet): SymbolInformation[];
	doCodeActions(document: TextDocument, range: Range, context: CodeActionContext, stylesheet: Stylesheet): Command[];
	findColorSymbols(document: TextDocument, stylesheet: Stylesheet): Range[];
	doRename(document: TextDocument, position: Position, newName: string, stylesheet: Stylesheet): WorkspaceEdit;
}

export interface LanguageSettings {
	validate?: boolean;
	lint?: any;
}

```


License
-------

(MIT License)

Copyright 2016, Microsoft
