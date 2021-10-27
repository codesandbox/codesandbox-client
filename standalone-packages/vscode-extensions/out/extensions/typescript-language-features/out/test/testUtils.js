"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const fs = require("fs");
const os = require("os");
const path_1 = require("path");
function rndName() {
    return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10);
}
function createRandomFile(contents = '', fileExtension = 'txt') {
    return new Promise((resolve, reject) => {
        const tmpFile = path_1.join(os.tmpdir(), rndName() + '.' + fileExtension);
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
//# sourceMappingURL=testUtils.js.map