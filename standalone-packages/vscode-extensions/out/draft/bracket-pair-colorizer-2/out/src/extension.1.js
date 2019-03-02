"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const documentDecorationManager_1 = require("./documentDecorationManager");
function activate(context) {
    let documentDecorationManager = new documentDecorationManager_1.default();
    context.subscriptions.push(vscode_1.commands.registerCommand("bracket-pair-colorizer-2.expandBracketSelection", () => {
        const editor = vscode_1.window.activeTextEditor;
        if (!editor) {
            return;
        }
        documentDecorationManager.expandBracketSelection(editor);
    }), vscode_1.commands.registerCommand("bracket-pair-colorizer-2.undoBracketSelection", () => {
        const editor = vscode_1.window.activeTextEditor;
        if (!editor) {
            return;
        }
        documentDecorationManager.undoBracketSelection(editor);
    }), vscode_1.workspace.onDidChangeConfiguration((event) => {
        if (event.affectsConfiguration("bracket-pair-colorizer-2") ||
            event.affectsConfiguration("editor.lineHeight") ||
            event.affectsConfiguration("editor.fontSize")) {
            documentDecorationManager.Dispose();
            documentDecorationManager = new documentDecorationManager_1.default();
            documentDecorationManager.updateAllDocuments();
        }
    }), vscode_1.window.onDidChangeVisibleTextEditors(() => {
        documentDecorationManager.updateAllDocuments();
    }), vscode_1.workspace.onDidChangeTextDocument((event) => {
        if (event.contentChanges.length > 0) {
            documentDecorationManager.onDidChangeTextDocument(event);
        }
    }), vscode_1.workspace.onDidCloseTextDocument((event) => {
        documentDecorationManager.onDidCloseTextDocument(event);
    }), vscode_1.workspace.onDidOpenTextDocument((event) => {
        documentDecorationManager.onDidOpenTextDocument(event);
    }), vscode_1.window.onDidChangeTextEditorSelection((event) => {
        documentDecorationManager.onDidChangeSelection(event);
    }));
    documentDecorationManager.updateAllDocuments();
}
exports.activate = activate;
// tslint:disable-next-line:no-empty
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map