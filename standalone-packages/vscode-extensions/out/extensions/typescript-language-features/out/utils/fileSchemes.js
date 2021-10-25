"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.disabledSchemes = exports.semanticSupportedSchemes = exports.vscodeVfs = exports.memFs = exports.vscodeNotebookCell = exports.walkThroughSnippet = exports.vsls = exports.git = exports.untitled = exports.file = void 0;
exports.file = 'file';
exports.untitled = 'untitled';
exports.git = 'git';
/** Live share scheme */
exports.vsls = 'vsls';
exports.walkThroughSnippet = 'walkThroughSnippet';
exports.vscodeNotebookCell = 'vscode-notebook-cell';
exports.memFs = 'memfs';
exports.vscodeVfs = 'vscode-vfs';
exports.semanticSupportedSchemes = [
    exports.file,
    exports.untitled,
    exports.walkThroughSnippet,
    exports.vscodeNotebookCell,
];
/**
 * File scheme for which JS/TS language feature should be disabled
 */
exports.disabledSchemes = new Set([
    exports.git,
    exports.vsls
]);
//# sourceMappingURL=fileSchemes.js.map