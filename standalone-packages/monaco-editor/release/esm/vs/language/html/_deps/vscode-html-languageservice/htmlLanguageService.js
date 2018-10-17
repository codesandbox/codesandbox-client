/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { createScanner } from './parser/htmlScanner.js';
import { parse } from './parser/htmlParser.js';
import { HTMLCompletion } from './services/htmlCompletion.js';
import { doHover } from './services/htmlHover.js';
import { format } from './services/htmlFormatter.js';
import { findDocumentLinks } from './services/htmlLinks.js';
import { findDocumentHighlights } from './services/htmlHighlighting.js';
import { findDocumentSymbols } from './services/htmlSymbolsProvider.js';
import { TextDocument, Position, CompletionItem, CompletionList, Range, SymbolInformation, Diagnostic, TextEdit, DocumentHighlight, FormattingOptions, MarkedString, DocumentLink } from '../vscode-languageserver-types/main.js';
export { TextDocument, Position, CompletionItem, CompletionList, Range, SymbolInformation, Diagnostic, TextEdit, DocumentHighlight, FormattingOptions, MarkedString, DocumentLink };
export var TokenType;
(function (TokenType) {
    TokenType[TokenType["StartCommentTag"] = 0] = "StartCommentTag";
    TokenType[TokenType["Comment"] = 1] = "Comment";
    TokenType[TokenType["EndCommentTag"] = 2] = "EndCommentTag";
    TokenType[TokenType["StartTagOpen"] = 3] = "StartTagOpen";
    TokenType[TokenType["StartTagClose"] = 4] = "StartTagClose";
    TokenType[TokenType["StartTagSelfClose"] = 5] = "StartTagSelfClose";
    TokenType[TokenType["StartTag"] = 6] = "StartTag";
    TokenType[TokenType["EndTagOpen"] = 7] = "EndTagOpen";
    TokenType[TokenType["EndTagClose"] = 8] = "EndTagClose";
    TokenType[TokenType["EndTag"] = 9] = "EndTag";
    TokenType[TokenType["DelimiterAssign"] = 10] = "DelimiterAssign";
    TokenType[TokenType["AttributeName"] = 11] = "AttributeName";
    TokenType[TokenType["AttributeValue"] = 12] = "AttributeValue";
    TokenType[TokenType["StartDoctypeTag"] = 13] = "StartDoctypeTag";
    TokenType[TokenType["Doctype"] = 14] = "Doctype";
    TokenType[TokenType["EndDoctypeTag"] = 15] = "EndDoctypeTag";
    TokenType[TokenType["Content"] = 16] = "Content";
    TokenType[TokenType["Whitespace"] = 17] = "Whitespace";
    TokenType[TokenType["Unknown"] = 18] = "Unknown";
    TokenType[TokenType["Script"] = 19] = "Script";
    TokenType[TokenType["Styles"] = 20] = "Styles";
    TokenType[TokenType["EOS"] = 21] = "EOS";
})(TokenType || (TokenType = {}));
export var ScannerState;
(function (ScannerState) {
    ScannerState[ScannerState["WithinContent"] = 0] = "WithinContent";
    ScannerState[ScannerState["AfterOpeningStartTag"] = 1] = "AfterOpeningStartTag";
    ScannerState[ScannerState["AfterOpeningEndTag"] = 2] = "AfterOpeningEndTag";
    ScannerState[ScannerState["WithinDoctype"] = 3] = "WithinDoctype";
    ScannerState[ScannerState["WithinTag"] = 4] = "WithinTag";
    ScannerState[ScannerState["WithinEndTag"] = 5] = "WithinEndTag";
    ScannerState[ScannerState["WithinComment"] = 6] = "WithinComment";
    ScannerState[ScannerState["WithinScriptContent"] = 7] = "WithinScriptContent";
    ScannerState[ScannerState["WithinStyleContent"] = 8] = "WithinStyleContent";
    ScannerState[ScannerState["AfterAttributeName"] = 9] = "AfterAttributeName";
    ScannerState[ScannerState["BeforeAttributeValue"] = 10] = "BeforeAttributeValue";
})(ScannerState || (ScannerState = {}));
export function getLanguageService() {
    var htmlCompletion = new HTMLCompletion();
    return {
        createScanner: createScanner,
        parseHTMLDocument: function (document) { return parse(document.getText()); },
        doComplete: htmlCompletion.doComplete.bind(htmlCompletion),
        setCompletionParticipants: htmlCompletion.setCompletionParticipants.bind(htmlCompletion),
        doHover: doHover,
        format: format,
        findDocumentHighlights: findDocumentHighlights,
        findDocumentLinks: findDocumentLinks,
        findDocumentSymbols: findDocumentSymbols,
        doTagComplete: htmlCompletion.doTagComplete.bind(htmlCompletion),
    };
}
//# sourceMappingURL=htmlLanguageService.js.map