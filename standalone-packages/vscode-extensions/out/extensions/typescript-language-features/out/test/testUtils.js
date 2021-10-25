"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.retryUntilDocumentChanges = exports.onChangedDocument = exports.enumerateConfig = exports.insertModesValues = exports.Config = exports.updateConfig = exports.assertEditorContents = exports.createTestEditor = exports.joinLines = exports.wait = exports.withRandomFileEditor = exports.CURSOR = exports.deleteFile = exports.createRandomFile = void 0;
const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path_1 = require("path");
const vscode = require("vscode");
function rndName() {
    return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10);
}
function createRandomFile(contents = '', fileExtension = 'txt') {
    return new Promise((resolve, reject) => {
        const tmpFile = (0, path_1.join)(os.tmpdir(), rndName() + '.' + fileExtension);
        fs.writeFile(tmpFile, contents, (error) => {
            if (error) {
                return reject(error);
            }
            resolve(vscode.Uri.file(tmpFile));
        });
    });
}
exports.createRandomFile = createRandomFile;
function deleteFile(file) {
    return new Promise((resolve, reject) => {
        fs.unlink(file.fsPath, (err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(true);
            }
        });
    });
}
exports.deleteFile = deleteFile;
exports.CURSOR = '$$CURSOR$$';
function withRandomFileEditor(contents, fileExtension, run) {
    const cursorIndex = contents.indexOf(exports.CURSOR);
    return createRandomFile(contents.replace(exports.CURSOR, ''), fileExtension).then(file => {
        return vscode.workspace.openTextDocument(file).then(doc => {
            return vscode.window.showTextDocument(doc).then((editor) => {
                if (cursorIndex >= 0) {
                    const pos = doc.positionAt(cursorIndex);
                    editor.selection = new vscode.Selection(pos, pos);
                }
                return run(editor, doc).then(_ => {
                    if (doc.isDirty) {
                        return doc.save().then(() => {
                            return deleteFile(file);
                        });
                    }
                    else {
                        return deleteFile(file);
                    }
                });
            });
        });
    });
}
exports.withRandomFileEditor = withRandomFileEditor;
const wait = (ms) => new Promise(resolve => setTimeout(() => resolve(), ms));
exports.wait = wait;
const joinLines = (...args) => args.join(os.platform() === 'win32' ? '\r\n' : '\n');
exports.joinLines = joinLines;
async function createTestEditor(uri, ...lines) {
    const document = await vscode.workspace.openTextDocument(uri);
    const editor = await vscode.window.showTextDocument(document);
    await editor.insertSnippet(new vscode.SnippetString((0, exports.joinLines)(...lines)), new vscode.Range(0, 0, 1000, 0));
    return editor;
}
exports.createTestEditor = createTestEditor;
function assertEditorContents(editor, expectedDocContent, message) {
    const cursorIndex = expectedDocContent.indexOf(exports.CURSOR);
    assert.strictEqual(editor.document.getText(), expectedDocContent.replace(exports.CURSOR, ''), message);
    if (cursorIndex >= 0) {
        const expectedCursorPos = editor.document.positionAt(cursorIndex);
        assert.deepStrictEqual({ line: editor.selection.active.line, character: editor.selection.active.line }, { line: expectedCursorPos.line, character: expectedCursorPos.line }, 'Cursor position');
    }
}
exports.assertEditorContents = assertEditorContents;
async function updateConfig(documentUri, newConfig) {
    const oldConfig = {};
    const config = vscode.workspace.getConfiguration(undefined, documentUri);
    for (const configKey of Object.keys(newConfig)) {
        oldConfig[configKey] = config.get(configKey);
        await new Promise((resolve, reject) => config.update(configKey, newConfig[configKey], vscode.ConfigurationTarget.Global)
            .then(() => resolve(), reject));
    }
    return oldConfig;
}
exports.updateConfig = updateConfig;
exports.Config = Object.freeze({
    autoClosingBrackets: 'editor.autoClosingBrackets',
    typescriptCompleteFunctionCalls: 'typescript.suggest.completeFunctionCalls',
    insertMode: 'editor.suggest.insertMode',
    snippetSuggestions: 'editor.snippetSuggestions',
    suggestSelection: 'editor.suggestSelection',
    javascriptQuoteStyle: 'javascript.preferences.quoteStyle',
    typescriptQuoteStyle: 'typescript.preferences.quoteStyle',
});
exports.insertModesValues = Object.freeze(['insert', 'replace']);
async function enumerateConfig(documentUri, configKey, values, f) {
    for (const value of values) {
        const newConfig = { [configKey]: value };
        await updateConfig(documentUri, newConfig);
        await f(JSON.stringify(newConfig));
    }
}
exports.enumerateConfig = enumerateConfig;
function onChangedDocument(documentUri, disposables) {
    return new Promise(resolve => vscode.workspace.onDidChangeTextDocument(e => {
        if (e.document.uri.toString() === documentUri.toString()) {
            resolve(e.document);
        }
    }, undefined, disposables));
}
exports.onChangedDocument = onChangedDocument;
async function retryUntilDocumentChanges(documentUri, options, disposables, exec) {
    const didChangeDocument = onChangedDocument(documentUri, disposables);
    let done = false;
    const result = await Promise.race([
        didChangeDocument,
        (async () => {
            for (let i = 0; i < options.retries; ++i) {
                await (0, exports.wait)(options.timeout);
                if (done) {
                    return;
                }
                await exec();
            }
        })(),
    ]);
    done = true;
    return result;
}
exports.retryUntilDocumentChanges = retryUntilDocumentChanges;
//# sourceMappingURL=testUtils.js.map