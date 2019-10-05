"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const api_1 = require("../utils/api");
const dependentRegistration_1 = require("../utils/dependentRegistration");
const dispose_1 = require("../utils/dispose");
const typeConverters = require("../utils/typeConverters");
class TagClosing extends dispose_1.Disposable {
    constructor(client) {
        super();
        this.client = client;
        this._disposed = false;
        this._timeout = undefined;
        this._cancel = undefined;
        vscode.workspace.onDidChangeTextDocument(event => this.onDidChangeTextDocument(event.document, event.contentChanges), null, this._disposables);
    }
    dispose() {
        super.dispose();
        this._disposed = true;
        if (this._timeout) {
            clearTimeout(this._timeout);
            this._timeout = undefined;
        }
        if (this._cancel) {
            this._cancel.cancel();
            this._cancel.dispose();
            this._cancel = undefined;
        }
    }
    onDidChangeTextDocument(document, changes) {
        const activeDocument = vscode.window.activeTextEditor && vscode.window.activeTextEditor.document;
        if (document !== activeDocument || changes.length === 0) {
            return;
        }
        const filepath = this.client.toOpenedFilePath(document);
        if (!filepath) {
            return;
        }
        if (typeof this._timeout !== 'undefined') {
            clearTimeout(this._timeout);
        }
        if (this._cancel) {
            this._cancel.cancel();
            this._cancel.dispose();
            this._cancel = undefined;
        }
        const lastChange = changes[changes.length - 1];
        const lastCharacter = lastChange.text[lastChange.text.length - 1];
        if (lastChange.rangeLength > 0 || lastCharacter !== '>' && lastCharacter !== '/') {
            return;
        }
        const priorCharacter = lastChange.range.start.character > 0
            ? document.getText(new vscode.Range(lastChange.range.start.translate({ characterDelta: -1 }), lastChange.range.start))
            : '';
        if (priorCharacter === '>') {
            return;
        }
        const version = document.version;
        this._timeout = setTimeout(async () => {
            this._timeout = undefined;
            if (this._disposed) {
                return;
            }
            const addedLines = lastChange.text.split(/\r\n|\n/g);
            const position = addedLines.length <= 1
                ? lastChange.range.start.translate({ characterDelta: lastChange.text.length })
                : new vscode.Position(lastChange.range.start.line + addedLines.length - 1, addedLines[addedLines.length - 1].length);
            const args = typeConverters.Position.toFileLocationRequestArgs(filepath, position);
            this._cancel = new vscode.CancellationTokenSource();
            const response = await this.client.execute('jsxClosingTag', args, this._cancel.token);
            if (response.type !== 'response' || !response.body) {
                return;
            }
            if (this._disposed) {
                return;
            }
            const activeEditor = vscode.window.activeTextEditor;
            if (!activeEditor) {
                return;
            }
            const insertion = response.body;
            const activeDocument = activeEditor.document;
            if (document === activeDocument && activeDocument.version === version) {
                activeEditor.insertSnippet(this.getTagSnippet(insertion), this.getInsertionPositions(activeEditor, position));
            }
        }, 100);
    }
    getTagSnippet(closingTag) {
        const snippet = new vscode.SnippetString();
        snippet.appendPlaceholder('', 0);
        snippet.appendText(closingTag.newText);
        return snippet;
    }
    getInsertionPositions(editor, position) {
        const activeSelectionPositions = editor.selections.map(s => s.active);
        return activeSelectionPositions.some(p => p.isEqual(position))
            ? activeSelectionPositions
            : position;
    }
}
TagClosing.minVersion = api_1.default.v300;
class ActiveDocumentDependentRegistration extends dispose_1.Disposable {
    constructor(selector, register) {
        super();
        this.selector = selector;
        this._registration = this._register(new dependentRegistration_1.ConditionalRegistration(register));
        vscode.window.onDidChangeActiveTextEditor(this.update, this, this._disposables);
        vscode.workspace.onDidOpenTextDocument(this.onDidOpenDocument, this, this._disposables);
        this.update();
    }
    update() {
        const editor = vscode.window.activeTextEditor;
        const enabled = !!(editor && vscode.languages.match(this.selector, editor.document));
        this._registration.update(enabled);
    }
    onDidOpenDocument(openedDocument) {
        if (vscode.window.activeTextEditor && vscode.window.activeTextEditor.document === openedDocument) {
            // The active document's language may have changed
            this.update();
        }
    }
}
exports.ActiveDocumentDependentRegistration = ActiveDocumentDependentRegistration;
function register(selector, modeId, client) {
    return new dependentRegistration_1.VersionDependentRegistration(client, TagClosing.minVersion, () => new dependentRegistration_1.ConfigurationDependentRegistration(modeId, 'autoClosingTags', () => new ActiveDocumentDependentRegistration(selector, () => new TagClosing(client))));
}
exports.register = register;
//# sourceMappingURL=tagClosing.js.map