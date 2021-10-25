"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
require("mocha");
const vscode = require("vscode");
const testUtils_1 = require("../testUtils");
const onDocumentChange = (doc) => {
    return new Promise(resolve => {
        const sub = vscode.workspace.onDidChangeTextDocument(e => {
            if (e.document !== doc) {
                return;
            }
            sub.dispose();
            resolve(e.document);
        });
    });
};
const type = async (document, text) => {
    const onChange = onDocumentChange(document);
    await vscode.commands.executeCommand('type', { text });
    await onChange;
    return document;
};
suite.skip('OnEnter', () => {
    setup(async () => {
        // the tests make the assumption that language rules are registered
        await vscode.extensions.getExtension('vscode.typescript-language-features').activate();
    });
    test('should indent after if block with braces', () => {
        return (0, testUtils_1.withRandomFileEditor)(`if (true) {${testUtils_1.CURSOR}`, 'js', async (_editor, document) => {
            await type(document, '\nx');
            assert.strictEqual(document.getText(), (0, testUtils_1.joinLines)(`if (true) {`, `    x`));
        });
    });
    test('should indent within empty object literal', () => {
        return (0, testUtils_1.withRandomFileEditor)(`({${testUtils_1.CURSOR}})`, 'js', async (_editor, document) => {
            await type(document, '\nx');
            await (0, testUtils_1.wait)(500);
            assert.strictEqual(document.getText(), (0, testUtils_1.joinLines)(`({`, `    x`, `})`));
        });
    });
    test('should indent after simple jsx tag with attributes', () => {
        return (0, testUtils_1.withRandomFileEditor)(`const a = <div onclick={bla}>${testUtils_1.CURSOR}`, 'jsx', async (_editor, document) => {
            await type(document, '\nx');
            assert.strictEqual(document.getText(), (0, testUtils_1.joinLines)(`const a = <div onclick={bla}>`, `    x`));
        });
    });
    test('should not indent after a multi-line comment block 1', () => {
        return (0, testUtils_1.withRandomFileEditor)(`/*-----\n * line 1\n * line 2\n *-----*/\n${testUtils_1.CURSOR}`, 'js', async (_editor, document) => {
            await type(document, '\nx');
            assert.strictEqual(document.getText(), (0, testUtils_1.joinLines)(`/*-----`, ` * line 1`, ` * line 2`, ` *-----*/`, ``, `x`));
        });
    });
    test('should not indent after a multi-line comment block 2', () => {
        return (0, testUtils_1.withRandomFileEditor)(`/*-----\n * line 1\n * line 2\n */\n${testUtils_1.CURSOR}`, 'js', async (_editor, document) => {
            await type(document, '\nx');
            assert.strictEqual(document.getText(), (0, testUtils_1.joinLines)(`/*-----`, ` * line 1`, ` * line 2`, ` */`, ``, `x`));
        });
    });
    test('should indent within a multi-line comment block', () => {
        return (0, testUtils_1.withRandomFileEditor)(`/*-----\n * line 1\n * line 2${testUtils_1.CURSOR}`, 'js', async (_editor, document) => {
            await type(document, '\nx');
            assert.strictEqual(document.getText(), (0, testUtils_1.joinLines)(`/*-----`, ` * line 1`, ` * line 2`, ` * x`));
        });
    });
    test('should indent after if block followed by comment with quote', () => {
        return (0, testUtils_1.withRandomFileEditor)(`if (true) { // '${testUtils_1.CURSOR}`, 'js', async (_editor, document) => {
            await type(document, '\nx');
            assert.strictEqual(document.getText(), (0, testUtils_1.joinLines)(`if (true) { // '`, `    x`));
        });
    });
});
//# sourceMappingURL=onEnter.test.js.map