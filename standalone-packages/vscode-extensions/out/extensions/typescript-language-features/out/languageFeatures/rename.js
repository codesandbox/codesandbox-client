"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const path = require("path");
const vscode = require("vscode");
const nls = require("vscode-nls");
const typescriptService_1 = require("../typescriptService");
const api_1 = require("../utils/api");
const dependentRegistration_1 = require("../utils/dependentRegistration");
const typeConverters = require("../utils/typeConverters");
const localize = nls.loadMessageBundle();
class TypeScriptRenameProvider {
    constructor(client, fileConfigurationManager) {
        this.client = client;
        this.fileConfigurationManager = fileConfigurationManager;
    }
    async prepareRename(document, position, token) {
        if (this.client.apiVersion.lt(api_1.default.v310)) {
            return null;
        }
        const response = await this.execRename(document, position, token);
        if (response?.type !== 'response' || !response.body) {
            return null;
        }
        const renameInfo = response.body.info;
        if (!renameInfo.canRename) {
            return Promise.reject(renameInfo.localizedErrorMessage);
        }
        return typeConverters.Range.fromTextSpan(renameInfo.triggerSpan);
    }
    async provideRenameEdits(document, position, newName, token) {
        const response = await this.execRename(document, position, token);
        if (!response || response.type !== 'response' || !response.body) {
            return null;
        }
        const renameInfo = response.body.info;
        if (!renameInfo.canRename) {
            return Promise.reject(renameInfo.localizedErrorMessage);
        }
        if (renameInfo.fileToRename) {
            const edits = await this.renameFile(renameInfo.fileToRename, newName, token);
            if (edits) {
                return edits;
            }
            else {
                return Promise.reject(localize('fileRenameFail', "An error occurred while renaming file"));
            }
        }
        return this.updateLocs(response.body.locs, newName);
    }
    async execRename(document, position, token) {
        const file = this.client.toOpenedFilePath(document);
        if (!file) {
            return undefined;
        }
        const args = {
            ...typeConverters.Position.toFileLocationRequestArgs(file, position),
            findInStrings: false,
            findInComments: false
        };
        return this.client.interruptGetErr(() => {
            this.fileConfigurationManager.ensureConfigurationForDocument(document, token);
            return this.client.execute('rename', args, token);
        });
    }
    updateLocs(locations, newName) {
        const edit = new vscode.WorkspaceEdit();
        for (const spanGroup of locations) {
            const resource = this.client.toResource(spanGroup.file);
            for (const textSpan of spanGroup.locs) {
                edit.replace(resource, typeConverters.Range.fromTextSpan(textSpan), (textSpan.prefixText || '') + newName + (textSpan.suffixText || ''));
            }
        }
        return edit;
    }
    async renameFile(fileToRename, newName, token) {
        // Make sure we preserve file extension if none provided
        if (!path.extname(newName)) {
            newName += path.extname(fileToRename);
        }
        const dirname = path.dirname(fileToRename);
        const newFilePath = path.join(dirname, newName);
        const args = {
            file: fileToRename,
            oldFilePath: fileToRename,
            newFilePath: newFilePath,
        };
        const response = await this.client.execute('getEditsForFileRename', args, token);
        if (response.type !== 'response' || !response.body) {
            return undefined;
        }
        const edits = typeConverters.WorkspaceEdit.fromFileCodeEdits(this.client, response.body);
        edits.renameFile(vscode.Uri.file(fileToRename), vscode.Uri.file(newFilePath));
        return edits;
    }
}
function register(selector, client, fileConfigurationManager) {
    return (0, dependentRegistration_1.conditionalRegistration)([
        (0, dependentRegistration_1.requireSomeCapability)(client, typescriptService_1.ClientCapability.Semantic),
    ], () => {
        return vscode.languages.registerRenameProvider(selector.semantic, new TypeScriptRenameProvider(client, fileConfigurationManager));
    });
}
exports.register = register;
//# sourceMappingURL=rename.js.map