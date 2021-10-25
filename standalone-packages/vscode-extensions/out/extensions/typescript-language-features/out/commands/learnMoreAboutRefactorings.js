"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.LearnMoreAboutRefactoringsCommand = void 0;
const vscode = require("vscode");
const languageModeIds_1 = require("../utils/languageModeIds");
class LearnMoreAboutRefactoringsCommand {
    constructor() {
        this.id = LearnMoreAboutRefactoringsCommand.id;
    }
    execute() {
        const docUrl = vscode.window.activeTextEditor && (0, languageModeIds_1.isTypeScriptDocument)(vscode.window.activeTextEditor.document)
            ? 'https://go.microsoft.com/fwlink/?linkid=2114477'
            : 'https://go.microsoft.com/fwlink/?linkid=2116761';
        vscode.env.openExternal(vscode.Uri.parse(docUrl));
    }
}
exports.LearnMoreAboutRefactoringsCommand = LearnMoreAboutRefactoringsCommand;
LearnMoreAboutRefactoringsCommand.id = '_typescript.learnMoreAboutRefactorings';
//# sourceMappingURL=learnMoreAboutRefactorings.js.map