"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeCommitCharacter = exports.acceptFirstSuggestion = void 0;
require("mocha");
const vscode = require("vscode");
const testUtils_1 = require("./testUtils");
async function acceptFirstSuggestion(uri, _disposables) {
    return (0, testUtils_1.retryUntilDocumentChanges)(uri, { retries: 10, timeout: 0 }, _disposables, async () => {
        await vscode.commands.executeCommand('editor.action.triggerSuggest');
        await (0, testUtils_1.wait)(1000);
        await vscode.commands.executeCommand('acceptSelectedSuggestion');
    });
}
exports.acceptFirstSuggestion = acceptFirstSuggestion;
async function typeCommitCharacter(uri, character, _disposables) {
    const didChangeDocument = (0, testUtils_1.onChangedDocument)(uri, _disposables);
    await vscode.commands.executeCommand('editor.action.triggerSuggest');
    await (0, testUtils_1.wait)(3000); // Give time for suggestions to show
    await vscode.commands.executeCommand('type', { text: character });
    return await didChangeDocument;
}
exports.typeCommitCharacter = typeCommitCharacter;
//# sourceMappingURL=suggestTestHelpers.js.map