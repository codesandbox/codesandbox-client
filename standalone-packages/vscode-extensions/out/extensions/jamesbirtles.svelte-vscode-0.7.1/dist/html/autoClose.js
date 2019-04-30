// Original source: https://github.com/Microsoft/vscode/blob/master/extensions/html-language-features/client/src/tagClosing.ts
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
function activateTagClosing(tagProvider, supportedLanguages, configName) {
    let disposables = [];
    vscode_1.workspace.onDidChangeTextDocument(event => onDidChangeTextDocument(event.document, event.contentChanges), null, disposables);
    let isEnabled = false;
    updateEnabledState();
    vscode_1.window.onDidChangeActiveTextEditor(updateEnabledState, null, disposables);
    let timeout = void 0;
    function updateEnabledState() {
        isEnabled = false;
        let editor = vscode_1.window.activeTextEditor;
        if (!editor) {
            return;
        }
        let document = editor.document;
        if (!supportedLanguages[document.languageId]) {
            return;
        }
        if (!vscode_1.workspace.getConfiguration(void 0, document.uri).get(configName)) {
            return;
        }
        isEnabled = true;
    }
    function onDidChangeTextDocument(document, changes) {
        if (!isEnabled) {
            return;
        }
        let activeDocument = vscode_1.window.activeTextEditor && vscode_1.window.activeTextEditor.document;
        if (document !== activeDocument || changes.length === 0) {
            return;
        }
        if (typeof timeout !== 'undefined') {
            clearTimeout(timeout);
        }
        let lastChange = changes[changes.length - 1];
        let lastCharacter = lastChange.text[lastChange.text.length - 1];
        if (lastChange.rangeLength > 0 || (lastCharacter !== '>' && lastCharacter !== '/')) {
            return;
        }
        let rangeStart = lastChange.range.start;
        let version = document.version;
        timeout = setTimeout(() => {
            let position = new vscode_1.Position(rangeStart.line, rangeStart.character + lastChange.text.length);
            tagProvider(document, position).then(text => {
                if (text && isEnabled) {
                    let activeEditor = vscode_1.window.activeTextEditor;
                    if (activeEditor) {
                        let activeDocument = activeEditor.document;
                        if (document === activeDocument && activeDocument.version === version) {
                            let selections = activeEditor.selections;
                            if (selections.length &&
                                selections.some(s => s.active.isEqual(position))) {
                                activeEditor.insertSnippet(new vscode_1.SnippetString(text), selections.map(s => s.active));
                            }
                            else {
                                activeEditor.insertSnippet(new vscode_1.SnippetString(text), position);
                            }
                        }
                    }
                }
            });
            timeout = void 0;
        }, 100);
    }
    return vscode_1.Disposable.from(...disposables);
}
exports.activateTagClosing = activateTagClosing;
//# sourceMappingURL=autoClose.js.map