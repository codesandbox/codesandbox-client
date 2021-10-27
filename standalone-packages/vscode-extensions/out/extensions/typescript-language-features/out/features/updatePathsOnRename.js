"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const vscode = require("vscode");
const nls = require("vscode-nls");
const api_1 = require("../utils/api");
const cancellation_1 = require("../utils/cancellation");
const dependentRegistration_1 = require("../utils/dependentRegistration");
const dispose_1 = require("../utils/dispose");
const fileSchemes = require("../utils/fileSchemes");
const languageModeIds_1 = require("../utils/languageModeIds");
const typeConverters = require("../utils/typeConverters");
const localize = nls.loadMessageBundle();
const updateImportsOnFileMoveName = 'updateImportsOnFileMove.enabled';
function isDirectory(path) {
    return new Promise((resolve, reject) => {
        fs.stat(path, (err, stat) => {
            if (err) {
                return reject(err);
            }
            return resolve(stat.isDirectory());
        });
    });
}
class UpdateImportsOnFileRenameHandler extends dispose_1.Disposable {
    constructor(client, fileConfigurationManager, _handles) {
        super();
        this.client = client;
        this.fileConfigurationManager = fileConfigurationManager;
        this._handles = _handles;
        this._register(vscode.workspace.onDidRenameFile(e => {
            vscode.window.withProgress({
                location: vscode.ProgressLocation.Window,
                title: localize('renameProgress.title', "Checking for update of JS/TS imports")
            }, () => {
                return this.doRename(e.oldUri, e.newUri);
            });
        }));
    }
    async doRename(oldResource, newResource) {
        // Try to get a js/ts file that is being moved
        // For directory moves, this returns a js/ts file under the directory.
        const jsTsFileThatIsBeingMoved = await this.getJsTsFileBeingMoved(newResource);
        if (!jsTsFileThatIsBeingMoved || !this.client.toPath(jsTsFileThatIsBeingMoved)) {
            return;
        }
        const newFile = this.client.toPath(newResource);
        if (!newFile) {
            return;
        }
        const oldFile = this.client.toPath(oldResource);
        if (!oldFile) {
            return;
        }
        const document = await vscode.workspace.openTextDocument(jsTsFileThatIsBeingMoved);
        const config = this.getConfiguration(document);
        const setting = config.get(updateImportsOnFileMoveName);
        if (setting === "never" /* Never */) {
            return;
        }
        // Make sure TS knows about file
        this.client.bufferSyncSupport.closeResource(oldResource);
        this.client.bufferSyncSupport.openTextDocument(document);
        const edits = await this.getEditsForFileRename(document, oldFile, newFile);
        if (!edits || !edits.size) {
            return;
        }
        if (await this.confirmActionWithUser(newResource, document)) {
            await vscode.workspace.applyEdit(edits);
        }
    }
    async confirmActionWithUser(newResource, newDocument) {
        const config = this.getConfiguration(newDocument);
        const setting = config.get(updateImportsOnFileMoveName);
        switch (setting) {
            case "always" /* Always */:
                return true;
            case "never" /* Never */:
                return false;
            case "prompt" /* Prompt */:
            default:
                return this.promptUser(newResource, newDocument);
        }
    }
    getConfiguration(newDocument) {
        return vscode.workspace.getConfiguration(languageModeIds_1.isTypeScriptDocument(newDocument) ? 'typescript' : 'javascript', newDocument.uri);
    }
    async promptUser(newResource, newDocument) {
        const response = await vscode.window.showInformationMessage(localize('prompt', "Update imports for moved file: '{0}'?", path.basename(newResource.fsPath)), {
            modal: true,
        }, {
            title: localize('reject.title', "No"),
            choice: 2 /* Reject */,
            isCloseAffordance: true,
        }, {
            title: localize('accept.title', "Yes"),
            choice: 1 /* Accept */,
        }, {
            title: localize('always.title', "Always automatically update imports"),
            choice: 3 /* Always */,
        }, {
            title: localize('never.title', "Never automatically update imports"),
            choice: 4 /* Never */,
        });
        if (!response) {
            return false;
        }
        switch (response.choice) {
            case 1 /* Accept */:
                {
                    return true;
                }
            case 2 /* Reject */:
                {
                    return false;
                }
            case 3 /* Always */:
                {
                    const config = this.getConfiguration(newDocument);
                    config.update(updateImportsOnFileMoveName, "always" /* Always */, vscode.ConfigurationTarget.Global);
                    return true;
                }
            case 4 /* Never */:
                {
                    const config = this.getConfiguration(newDocument);
                    config.update(updateImportsOnFileMoveName, "never" /* Never */, vscode.ConfigurationTarget.Global);
                    return false;
                }
        }
        return false;
    }
    async getJsTsFileBeingMoved(resource) {
        if (resource.scheme !== fileSchemes.file) {
            return undefined;
        }
        if (await isDirectory(resource.fsPath)) {
            const files = await vscode.workspace.findFiles({
                base: resource.fsPath,
                pattern: '**/*.{ts,tsx,js,jsx}',
            }, '**/node_modules/**', 1);
            return files[0];
        }
        return (await this._handles(resource)) ? resource : undefined;
    }
    async getEditsForFileRename(document, oldFile, newFile) {
        const response = await this.client.interruptGetErr(() => {
            this.fileConfigurationManager.setGlobalConfigurationFromDocument(document, cancellation_1.nulToken);
            const args = {
                oldFilePath: oldFile,
                newFilePath: newFile,
            };
            return this.client.execute('getEditsForFileRename', args, cancellation_1.nulToken);
        });
        if (response.type !== 'response' || !response.body) {
            return;
        }
        return typeConverters.WorkspaceEdit.fromFileCodeEdits(this.client, response.body);
    }
}
UpdateImportsOnFileRenameHandler.minVersion = api_1.default.v300;
function register(client, fileConfigurationManager, handles) {
    return new dependentRegistration_1.VersionDependentRegistration(client, UpdateImportsOnFileRenameHandler.minVersion, () => new UpdateImportsOnFileRenameHandler(client, fileConfigurationManager, handles));
}
exports.register = register;
//# sourceMappingURL=updatePathsOnRename.js.map