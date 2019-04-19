/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageserver_1 = require("vscode-languageserver");
const Strings = require("../utils/strings");
const nls = require("vscode-nls");
const localize = nls.loadMessageBundle();
let globProperties = [
    { kind: vscode_languageserver_1.CompletionItemKind.Value, label: localize('fileLabel', "Files by Extension"), insertText: '"**/*.{{extension}}": true', documentation: localize('fileDescription', "Match all files of a specific file extension.") },
    { kind: vscode_languageserver_1.CompletionItemKind.Value, label: localize('filesLabel', "Files with Multiple Extensions"), insertText: '"**/*.{ext1,ext2,ext3}": true', documentation: localize('filesDescription', "Match all files with any of the file extensions.") },
    { kind: vscode_languageserver_1.CompletionItemKind.Value, label: localize('derivedLabel', "Files with Siblings by Name"), insertText: '"**/*.{{source-extension}}": { "when": "$(basename).{{target-extension}}" }', documentation: localize('derivedDescription', "Match files that have siblings with the same name but a different extension.") },
    { kind: vscode_languageserver_1.CompletionItemKind.Value, label: localize('topFolderLabel', "Folder by Name (Top Level)"), insertText: '"{{name}}": true', documentation: localize('topFolderDescription', "Match a top level folder with a specific name.") },
    { kind: vscode_languageserver_1.CompletionItemKind.Value, label: localize('topFoldersLabel', "Folders with Multiple Names (Top Level)"), insertText: '"{folder1,folder2,folder3}": true', documentation: localize('topFoldersDescription', "Match multiple top level folders.") },
    { kind: vscode_languageserver_1.CompletionItemKind.Value, label: localize('folderLabel', "Folder by Name (Any Location)"), insertText: '"**/{{name}}": true', documentation: localize('folderDescription', "Match a folder with a specific name in any location.") },
];
let globValues = [
    { kind: vscode_languageserver_1.CompletionItemKind.Value, label: localize('trueLabel', "true"), insertText: 'true', documentation: localize('trueDescription', "Enable the pattern.") },
    { kind: vscode_languageserver_1.CompletionItemKind.Value, label: localize('falseLabel', "false"), insertText: 'false', documentation: localize('falseDescription', "Disable the pattern.") },
    { kind: vscode_languageserver_1.CompletionItemKind.Value, label: localize('derivedLabel', "Files with Siblings by Name"), insertText: '{ "when": "$(basename).{{extension}}" }', documentation: localize('siblingsDescription', "Match files that have siblings with the same name but a different extension.") }
];
class GlobPatternContribution {
    constructor() {
    }
    isSettingsFile(resource) {
        return Strings.endsWith(resource, '/settings.json');
    }
    collectDefaultCompletions(resource, result) {
        return null;
    }
    collectPropertyCompletions(resource, location, currentWord, addValue, isLast, result) {
        if (this.isSettingsFile(resource) && location.length === 1 && ((location[0] === 'files.exclude') || (location[0] === 'search.exclude'))) {
            globProperties.forEach(e => {
                e.filterText = e.insertText;
                result.add(e);
            });
        }
        return null;
    }
    collectValueCompletions(resource, location, currentKey, result) {
        if (this.isSettingsFile(resource) && location.length === 1 && ((location[0] === 'files.exclude') || (location[0] === 'search.exclude'))) {
            globValues.forEach(e => {
                e.filterText = e.insertText;
                result.add(e);
            });
        }
        return null;
    }
    getInfoContribution(resource, location) {
        return null;
    }
}
exports.GlobPatternContribution = GlobPatternContribution;
//# sourceMappingURL=globPatternContribution.js.map