"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActiveJsTsEditorTracker = void 0;
const vscode = require("vscode");
const dispose_1 = require("./dispose");
const languageDescription_1 = require("./languageDescription");
const languageModeIds_1 = require("./languageModeIds");
/**
 * Tracks the active JS/TS editor.
 *
 * This tries to handle the case where the user focuses in the output view / debug console.
 * When this happens, we want to treat the last real focused editor as the active editor,
 * instead of using `vscode.window.activeTextEditor`
 */
class ActiveJsTsEditorTracker extends dispose_1.Disposable {
    constructor() {
        super();
        this._onDidChangeActiveJsTsEditor = this._register(new vscode.EventEmitter());
        this.onDidChangeActiveJsTsEditor = this._onDidChangeActiveJsTsEditor.event;
        vscode.window.onDidChangeActiveTextEditor(this.onDidChangeActiveTextEditor, this, this._disposables);
        vscode.window.onDidChangeVisibleTextEditors(() => {
            // Make sure the active editor is still in the visible set.
            // This can happen if the output view is focused and the last active TS file is closed
            if (this._activeJsTsEditor) {
                if (!vscode.window.visibleTextEditors.some(visibleEditor => visibleEditor === this._activeJsTsEditor)) {
                    this.onDidChangeActiveTextEditor(undefined);
                }
            }
        }, this, this._disposables);
        this.onDidChangeActiveTextEditor(vscode.window.activeTextEditor);
    }
    get activeJsTsEditor() {
        return this._activeJsTsEditor;
    }
    onDidChangeActiveTextEditor(editor) {
        if (editor === this._activeJsTsEditor) {
            return;
        }
        if (editor && !editor.viewColumn) {
            // viewColumn is undefined for the debug/output panel, but we still want
            // to show the version info for the previous editor
            return;
        }
        if (editor && this.isManagedFile(editor)) {
            this._activeJsTsEditor = editor;
        }
        else {
            this._activeJsTsEditor = undefined;
        }
        this._onDidChangeActiveJsTsEditor.fire(this._activeJsTsEditor);
    }
    isManagedFile(editor) {
        return this.isManagedScriptFile(editor) || this.isManagedConfigFile(editor);
    }
    isManagedScriptFile(editor) {
        return (0, languageModeIds_1.isSupportedLanguageMode)(editor.document);
    }
    isManagedConfigFile(editor) {
        return (0, languageDescription_1.isJsConfigOrTsConfigFileName)(editor.document.fileName);
    }
}
exports.ActiveJsTsEditorTracker = ActiveJsTsEditorTracker;
//# sourceMappingURL=activeJsTsEditorTracker.js.map