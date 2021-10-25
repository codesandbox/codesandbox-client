"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
require("mocha");
const vscode = require("vscode");
const testUtils_1 = require("../../test/testUtils");
const dispose_1 = require("../../utils/dispose");
const testDocumentUri = vscode.Uri.parse('untitled:test.ts');
const emptyRange = new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 0));
suite.skip('TypeScript Fix All', () => {
    const _disposables = [];
    setup(async () => {
        // the tests assume that typescript features are registered
        await vscode.extensions.getExtension('vscode.typescript-language-features').activate();
    });
    teardown(async () => {
        (0, dispose_1.disposeAll)(_disposables);
        await vscode.commands.executeCommand('workbench.action.closeAllEditors');
    });
    test('Fix all should remove unreachable code', async () => {
        const editor = await (0, testUtils_1.createTestEditor)(testDocumentUri, `function foo() {`, `    return 1;`, `    return 2;`, `};`, `function boo() {`, `    return 3;`, `    return 4;`, `};`);
        await (0, testUtils_1.wait)(2000);
        const fixes = await vscode.commands.executeCommand('vscode.executeCodeActionProvider', testDocumentUri, emptyRange, vscode.CodeActionKind.SourceFixAll);
        await vscode.workspace.applyEdit(fixes[0].edit);
        assert.strictEqual(editor.document.getText(), (0, testUtils_1.joinLines)(`function foo() {`, `    return 1;`, `};`, `function boo() {`, `    return 3;`, `};`));
    });
    test('Fix all should implement interfaces', async () => {
        const editor = await (0, testUtils_1.createTestEditor)(testDocumentUri, `interface I {`, `    x: number;`, `}`, `class A implements I {}`, `class B implements I {}`);
        await (0, testUtils_1.wait)(2000);
        const fixes = await vscode.commands.executeCommand('vscode.executeCodeActionProvider', testDocumentUri, emptyRange, vscode.CodeActionKind.SourceFixAll);
        await vscode.workspace.applyEdit(fixes[0].edit);
        assert.strictEqual(editor.document.getText(), (0, testUtils_1.joinLines)(`interface I {`, `    x: number;`, `}`, `class A implements I {`, `    x: number;`, `}`, `class B implements I {`, `    x: number;`, `}`));
    });
    test('Remove unused should handle nested ununused', async () => {
        const editor = await (0, testUtils_1.createTestEditor)(testDocumentUri, `export const _ = 1;`, `function unused() {`, `    const a = 1;`, `}`, `function used() {`, `    const a = 1;`, `}`, `used();`);
        await (0, testUtils_1.wait)(2000);
        const fixes = await vscode.commands.executeCommand('vscode.executeCodeActionProvider', testDocumentUri, emptyRange, vscode.CodeActionKind.Source.append('removeUnused'));
        await vscode.workspace.applyEdit(fixes[0].edit);
        assert.strictEqual(editor.document.getText(), (0, testUtils_1.joinLines)(`export const _ = 1;`, `function used() {`, `}`, `used();`));
    });
    test('Remove unused should remove unused interfaces', async () => {
        const editor = await (0, testUtils_1.createTestEditor)(testDocumentUri, `export const _ = 1;`, `interface Foo {}`);
        await (0, testUtils_1.wait)(2000);
        const fixes = await vscode.commands.executeCommand('vscode.executeCodeActionProvider', testDocumentUri, emptyRange, vscode.CodeActionKind.Source.append('removeUnused'));
        await vscode.workspace.applyEdit(fixes[0].edit);
        assert.strictEqual(editor.document.getText(), (0, testUtils_1.joinLines)(`export const _ = 1;`, ``));
    });
});
//# sourceMappingURL=fixAll.test.js.map