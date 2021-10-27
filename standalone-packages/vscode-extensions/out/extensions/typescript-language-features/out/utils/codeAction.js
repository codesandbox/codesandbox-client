"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const typeConverters = require("./typeConverters");
function getEditForCodeAction(client, action) {
    return action.changes && action.changes.length
        ? typeConverters.WorkspaceEdit.fromFileCodeEdits(client, action.changes)
        : undefined;
}
exports.getEditForCodeAction = getEditForCodeAction;
async function applyCodeAction(client, action, token) {
    const workspaceEdit = getEditForCodeAction(client, action);
    if (workspaceEdit) {
        if (!(await vscode.workspace.applyEdit(workspaceEdit))) {
            return false;
        }
    }
    return applyCodeActionCommands(client, action.commands, token);
}
exports.applyCodeAction = applyCodeAction;
async function applyCodeActionCommands(client, commands, token) {
    if (commands && commands.length) {
        for (const command of commands) {
            await client.execute('applyCodeActionCommand', { command }, token);
        }
    }
    return true;
}
exports.applyCodeActionCommands = applyCodeActionCommands;
//# sourceMappingURL=codeAction.js.map