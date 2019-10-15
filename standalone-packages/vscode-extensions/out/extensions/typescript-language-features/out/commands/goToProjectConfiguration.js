"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const nls = require("vscode-nls");
const cancellation_1 = require("../utils/cancellation");
const tsconfig_1 = require("../utils/tsconfig");
const localize = nls.loadMessageBundle();
class TypeScriptGoToProjectConfigCommand {
    constructor(lazyClientHost) {
        this.lazyClientHost = lazyClientHost;
        this.id = 'typescript.goToProjectConfig';
    }
    execute() {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            goToProjectConfig(this.lazyClientHost.value, true, editor.document.uri);
        }
    }
}
exports.TypeScriptGoToProjectConfigCommand = TypeScriptGoToProjectConfigCommand;
class JavaScriptGoToProjectConfigCommand {
    constructor(lazyClientHost) {
        this.lazyClientHost = lazyClientHost;
        this.id = 'javascript.goToProjectConfig';
    }
    execute() {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            goToProjectConfig(this.lazyClientHost.value, false, editor.document.uri);
        }
    }
}
exports.JavaScriptGoToProjectConfigCommand = JavaScriptGoToProjectConfigCommand;
async function goToProjectConfig(clientHost, isTypeScriptProject, resource) {
    const client = clientHost.serviceClient;
    const rootPath = client.getWorkspaceRootForResource(resource);
    if (!rootPath) {
        vscode.window.showInformationMessage(localize('typescript.projectConfigNoWorkspace', 'Please open a folder in VS Code to use a TypeScript or JavaScript project'));
        return;
    }
    const file = client.toPath(resource);
    // TSServer errors when 'projectInfo' is invoked on a non js/ts file
    if (!file || !await clientHost.handles(resource)) {
        vscode.window.showWarningMessage(localize('typescript.projectConfigUnsupportedFile', 'Could not determine TypeScript or JavaScript project. Unsupported file type'));
        return;
    }
    let res;
    try {
        res = await client.execute('projectInfo', { file, needFileNameList: false }, cancellation_1.nulToken);
    }
    catch (_a) {
        // noop
    }
    if (!res || res.type !== 'response' || !res.body) {
        vscode.window.showWarningMessage(localize('typescript.projectConfigCouldNotGetInfo', 'Could not determine TypeScript or JavaScript project'));
        return;
    }
    const { configFileName } = res.body;
    if (configFileName && !tsconfig_1.isImplicitProjectConfigFile(configFileName)) {
        const doc = await vscode.workspace.openTextDocument(configFileName);
        vscode.window.showTextDocument(doc, vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined);
        return;
    }
    let ProjectConfigAction;
    (function (ProjectConfigAction) {
        ProjectConfigAction[ProjectConfigAction["None"] = 0] = "None";
        ProjectConfigAction[ProjectConfigAction["CreateConfig"] = 1] = "CreateConfig";
        ProjectConfigAction[ProjectConfigAction["LearnMore"] = 2] = "LearnMore";
    })(ProjectConfigAction || (ProjectConfigAction = {}));
    const selected = await vscode.window.showInformationMessage((isTypeScriptProject
        ? localize('typescript.noTypeScriptProjectConfig', 'File is not part of a TypeScript project. Click [here]({0}) to learn more.', 'https://go.microsoft.com/fwlink/?linkid=841896')
        : localize('typescript.noJavaScriptProjectConfig', 'File is not part of a JavaScript project Click [here]({0}) to learn more.', 'https://go.microsoft.com/fwlink/?linkid=759670')), {
        title: isTypeScriptProject
            ? localize('typescript.configureTsconfigQuickPick', 'Configure tsconfig.json')
            : localize('typescript.configureJsconfigQuickPick', 'Configure jsconfig.json'),
        id: ProjectConfigAction.CreateConfig,
    });
    switch (selected && selected.id) {
        case ProjectConfigAction.CreateConfig:
            tsconfig_1.openOrCreateConfigFile(isTypeScriptProject, rootPath, client.configuration);
            return;
    }
}
//# sourceMappingURL=goToProjectConfiguration.js.map