"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const vscode = require('vscode');
const provider_1 = require('./provider');
const path = require('path');
const fs = require('fs');
const install_1 = require('./install');
const lint_1 = require('./lint');
const exec_path = path.join(__dirname, '../prisma-fmt');
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!fs.existsSync(exec_path)) {
            try {
                yield install_1.default(exec_path);
                vscode.window.showInformationMessage("Prisma plugin installation succeeded.");
            }
            catch (err) {
            }
        }
        if (fs.existsSync(exec_path)) {
            // This registers our formatter, prisma-fmt
            vscode.languages.registerDocumentFormattingEditProvider('prisma', new provider_1.default(exec_path));
            // This registers our linter, also prisma-fmt for now.
            const collection = vscode.languages.createDiagnosticCollection('prisma');
            vscode.workspace.onDidChangeTextDocument((e) => __awaiter(this, void 0, void 0, function* () {
                yield updatePrismaDiagnostics(e.document, collection);
            }));
            if (vscode.window.activeTextEditor) {
                yield updatePrismaDiagnostics(vscode.window.activeTextEditor.document, collection);
            }
            context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor((editor) => __awaiter(this, void 0, void 0, function* () {
                if (editor) {
                    yield updatePrismaDiagnostics(editor.document, collection);
                }
            })));
        }
    });
}
exports.activate = activate;
function updatePrismaDiagnostics(document, collection) {
    return __awaiter(this, void 0, void 0, function* () {
        if (document && document.languageId === 'prisma') {
            const text = document.getText(provider_1.fullDocumentRange(document));
            const res = yield lint_1.default(exec_path, text);
            const errors = [];
            for (const error of res) {
                errors.push({
                    code: '',
                    message: error.text,
                    range: new vscode.Range(document.positionAt(error.start), document.positionAt(error.end)),
                    severity: vscode.DiagnosticSeverity.Error,
                    source: '',
                    relatedInformation: []
                });
            }
            collection.set(document.uri, errors);
        }
        else {
            collection.clear();
        }
    });
}
//# sourceMappingURL=extension.js.map