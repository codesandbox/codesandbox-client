"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
class CommandManager {
    constructor() {
        this.commands = new Map();
    }
    dispose() {
        for (const registration of this.commands.values()) {
            registration.dispose();
        }
        this.commands.clear();
    }
    register(command) {
        for (const id of Array.isArray(command.id) ? command.id : [command.id]) {
            this.registerCommand(id, command.execute, command);
        }
        return command;
    }
    registerCommand(id, impl, thisArg) {
        if (this.commands.has(id)) {
            return;
        }
        this.commands.set(id, vscode.commands.registerCommand(id, impl, thisArg));
    }
}
exports.CommandManager = CommandManager;
//# sourceMappingURL=commandManager.js.map