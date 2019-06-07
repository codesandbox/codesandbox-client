"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const rimraf = require("rimraf");
const utils = require("./elmUtils");
const vscode = require("vscode");
function runClean(editor) {
    try {
        const cwd = editor.document
            ? utils.detectProjectRoot(editor.document.fileName)
            : vscode.workspace.rootPath;
        const elmStuffDir = path.join(cwd, 'elm-stuff', 'build-artifacts');
        rimraf(elmStuffDir, error => {
            if (error) {
                vscode.window.showErrorMessage('Running Elm Clean failed');
            }
            else {
                vscode.window.showInformationMessage('Successfully deleted the build-artifacts folder');
            }
        });
    }
    catch (e) {
        vscode.window.showErrorMessage('Running Elm Clean failed');
    }
}
function activateClean() {
    return [vscode.commands.registerCommand('elm.clean', runClean)];
}
exports.activateClean = activateClean;
//# sourceMappingURL=elmClean.js.map