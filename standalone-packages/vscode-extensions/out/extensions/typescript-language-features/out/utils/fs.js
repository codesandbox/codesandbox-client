"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.exists = void 0;
const vscode = require("vscode");
const exists = async (resource) => {
    try {
        const stat = await vscode.workspace.fs.stat(resource);
        // stat.type is an enum flag
        return !!(stat.type & vscode.FileType.File);
    }
    catch {
        return false;
    }
};
exports.exists = exists;
//# sourceMappingURL=fs.js.map