"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
require("mocha");
const vscode = require("vscode");
const jsDocCompletions_1 = require("../../languageFeatures/jsDocCompletions");
const testUtils_1 = require("../testUtils");
suite('typescript.jsDocSnippet', () => {
    setup(async () => {
        // the tests assume that typescript features are registered
        await vscode.extensions.getExtension('vscode.typescript-language-features').activate();
    });
    test('Should do nothing for single line input', async () => {
        const input = `/** */`;
        assert.strictEqual((0, jsDocCompletions_1.templateToSnippet)(input).value, input);
    });
    test('Should put cursor inside multiline line input', async () => {
        assert.strictEqual((0, jsDocCompletions_1.templateToSnippet)((0, testUtils_1.joinLines)('/**', ' * ', ' */')).value, (0, testUtils_1.joinLines)('/**', ' * $0', ' */'));
    });
    test('Should add placeholders after each parameter', async () => {
        assert.strictEqual((0, jsDocCompletions_1.templateToSnippet)((0, testUtils_1.joinLines)('/**', ' * @param a', ' * @param b', ' */')).value, (0, testUtils_1.joinLines)('/**', ' * @param a ${1}', ' * @param b ${2}', ' */'));
    });
    test('Should add placeholders for types', async () => {
        assert.strictEqual((0, jsDocCompletions_1.templateToSnippet)((0, testUtils_1.joinLines)('/**', ' * @param {*} a', ' * @param {*} b', ' */')).value, (0, testUtils_1.joinLines)('/**', ' * @param {${1:*}} a ${2}', ' * @param {${3:*}} b ${4}', ' */'));
    });
    test('Should properly escape dollars in parameter names', async () => {
        assert.strictEqual((0, jsDocCompletions_1.templateToSnippet)((0, testUtils_1.joinLines)('/**', ' * ', ' * @param $arg', ' */')).value, (0, testUtils_1.joinLines)('/**', ' * $0', ' * @param \\$arg ${1}', ' */'));
    });
});
//# sourceMappingURL=jsdocSnippet.test.js.map