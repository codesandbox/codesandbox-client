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
    { kind: vscode_languageserver_1.CompletionItemKind.Value, label: localize('assocLabelFile', "Files with Extension"), insertText: '"*.{{extension}}": "{{language}}"', documentation: localize('assocDescriptionFile', "Map all files matching the glob pattern in their filename to the language with the given identifier.") },
    { kind: vscode_languageserver_1.CompletionItemKind.Value, label: localize('assocLabelPath', "Files with Path"), insertText: '"/{{path to file}}/*.{{extension}}": "{{language}}"', documentation: localize('assocDescriptionPath', "Map all files matching the absolute path glob pattern in their path to the language with the given identifier.") }
];
class FileAssociationContribution {
    constructor() {
    }
    setLanguageIds(ids) {
        this.languageIds = ids;
    }
    isSettingsFile(resource) {
        return Strings.endsWith(resource, '/settings.json');
    }
    collectDefaultCompletions(resource, result) {
        return null;
    }
    collectPropertyCompletions(resource, location, currentWord, addValue, isLast, result) {
        if (this.isSettingsFile(resource) && location.length === 1 && location[0] === 'files.associations') {
            globProperties.forEach(e => {
                e.filterText = e.insertText;
                result.add(e);
            });
        }
        return null;
    }
    collectValueCompletions(resource, location, currentKey, result) {
        if (this.isSettingsFile(resource) && location.length === 1 && location[0] === 'files.associations') {
            this.languageIds.forEach(l => {
                result.add({
                    kind: vscode_languageserver_1.CompletionItemKind.Value,
                    label: l,
                    insertText: JSON.stringify('{{' + l + '}}'),
                    filterText: JSON.stringify(l)
                });
            });
        }
        return null;
    }
    getInfoContribution(resource, location) {
        return null;
    }
}
exports.FileAssociationContribution = FileAssociationContribution;
//# sourceMappingURL=fileAssociationContribution.js.map