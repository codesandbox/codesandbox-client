"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const vscode = require("vscode");
const dispose_1 = require("../../utils/dispose");
const suggestTestHelpers_1 = require("../suggestTestHelpers");
const testUtils_1 = require("../testUtils");
const testDocumentUri = vscode.Uri.parse('untitled:test.ts');
suite('JSDoc Completions', () => {
    const _disposables = [];
    const configDefaults = Object.freeze({
        [testUtils_1.Config.snippetSuggestions]: 'inline',
    });
    let oldConfig = {};
    setup(async () => {
        // the tests assume that typescript features are registered
        await vscode.extensions.getExtension('vscode.typescript-language-features').activate();
        // Save off config and apply defaults
        oldConfig = await (0, testUtils_1.updateConfig)(testDocumentUri, configDefaults);
    });
    teardown(async () => {
        (0, dispose_1.disposeAll)(_disposables);
        // Restore config
        await (0, testUtils_1.updateConfig)(testDocumentUri, oldConfig);
        return vscode.commands.executeCommand('workbench.action.closeAllEditors');
    });
    test('Should complete jsdoc inside single line comment', async () => {
        await (0, testUtils_1.enumerateConfig)(testDocumentUri, testUtils_1.Config.insertMode, testUtils_1.insertModesValues, async (config) => {
            const editor = await (0, testUtils_1.createTestEditor)(testDocumentUri, `/**$0 */`, `function abcdef(x, y) { }`);
            await (0, suggestTestHelpers_1.acceptFirstSuggestion)(testDocumentUri, _disposables);
            (0, testUtils_1.assertEditorContents)(editor, (0, testUtils_1.joinLines)(`/**`, ` * `, ` * @param x ${testUtils_1.CURSOR}`, ` * @param y `, ` */`, `function abcdef(x, y) { }`), `Config: ${config}`);
        });
    });
});
//# sourceMappingURL=jsDocCompletions.test.js.map