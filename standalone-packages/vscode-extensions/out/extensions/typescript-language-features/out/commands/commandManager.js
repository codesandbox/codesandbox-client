"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandManager = void 0;
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
        if (!this.commands.has(command.id)) {
            this.commands.set(command.id, vscode.commands.registerCommand(command.id, command.execute, command));
        }
        return command;
    }
}
exports.CommandManager = CommandManager;
//# sourceMappingURL=commandManager.js.map