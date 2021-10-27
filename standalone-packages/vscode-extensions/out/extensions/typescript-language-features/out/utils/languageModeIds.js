"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
exports.typescript = 'typescript';
exports.typescriptreact = 'typescriptreact';
exports.javascript = 'javascript';
exports.javascriptreact = 'javascriptreact';
exports.jsxTags = 'jsx-tags';
function isSupportedLanguageMode(doc) {
    return vscode.languages.match([exports.typescript, exports.typescriptreact, exports.javascript, exports.javascriptreact], doc) > 0;
}
exports.isSupportedLanguageMode = isSupportedLanguageMode;
function isTypeScriptDocument(doc) {
    return vscode.languages.match([exports.typescript, exports.typescriptreact], doc) > 0;
}
exports.isTypeScriptDocument = isTypeScriptDocument;
//# sourceMappingURL=languageModeIds.js.map