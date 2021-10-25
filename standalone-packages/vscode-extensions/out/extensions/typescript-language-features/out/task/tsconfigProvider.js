"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.TsConfigProvider = void 0;
const vscode = require("vscode");
class TsConfigProvider {
    async getConfigsForWorkspace(token) {
        if (!vscode.workspace.workspaceFolders) {
            return [];
        }
        const configs = new Map();
        for (const config of await this.findConfigFiles(token)) {
            const root = vscode.workspace.getWorkspaceFolder(config);
            if (root) {
                configs.set(config.fsPath, {
                    uri: config,
                    fsPath: config.fsPath,
                    posixPath: config.path,
                    workspaceFolder: root
                });
            }
        }
        return configs.values();
    }
    async findConfigFiles(token) {
        return await vscode.workspace.findFiles('**/tsconfig*.json', '**/{node_modules,.*}/**', undefined, token);
    }
}
exports.TsConfigProvider = TsConfigProvider;
//# sourceMappingURL=tsconfigProvider.js.map