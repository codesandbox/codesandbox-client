"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.openProjectConfigForFile = exports.openProjectConfigOrPromptToCreate = exports.openOrCreateConfig = exports.inferredProjectCompilerOptions = exports.isImplicitProjectConfigFile = void 0;
const path = require("path");
const vscode = require("vscode");
const nls = require("vscode-nls");
const cancellation_1 = require("../utils/cancellation");
const localize = nls.loadMessageBundle();
function isImplicitProjectConfigFile(configFileName) {
    return configFileName.startsWith('/dev/null/');
}
exports.isImplicitProjectConfigFile = isImplicitProjectConfigFile;
function inferredProjectCompilerOptions(projectType, serviceConfig) {
    const projectConfig = {
        module: 'commonjs',
        target: 'es2020',
        jsx: 'preserve',
    };
    if (serviceConfig.implicitProjectConfiguration.checkJs) {
        projectConfig.checkJs = true;
        if (projectType === 0 /* TypeScript */) {
            projectConfig.allowJs = true;
        }
    }
    if (serviceConfig.implicitProjectConfiguration.experimentalDecorators) {
        projectConfig.experimentalDecorators = true;
    }
    if (serviceConfig.implicitProjectConfiguration.strictNullChecks) {
        projectConfig.strictNullChecks = true;
    }
    if (serviceConfig.implicitProjectConfiguration.strictFunctionTypes) {
        projectConfig.strictFunctionTypes = true;
    }
    if (projectType === 0 /* TypeScript */) {
        projectConfig.sourceMap = true;
    }
    return projectConfig;
}
exports.inferredProjectCompilerOptions = inferredProjectCompilerOptions;
function inferredProjectConfigSnippet(projectType, config) {
    const baseConfig = inferredProjectCompilerOptions(projectType, config);
    const compilerOptions = Object.keys(baseConfig).map(key => `"${key}": ${JSON.stringify(baseConfig[key])}`);
    return new vscode.SnippetString(`{
	"compilerOptions": {
		${compilerOptions.join(',\n\t\t')}$0
	},
	"exclude": [
		"node_modules",
		"**/node_modules/*"
	]
}`);
}
async function openOrCreateConfig(projectType, rootPath, configuration) {
    const configFile = vscode.Uri.file(path.join(rootPath, projectType === 0 /* TypeScript */ ? 'tsconfig.json' : 'jsconfig.json'));
    const col = vscode.window.activeTextEditor?.viewColumn;
    try {
        const doc = await vscode.workspace.openTextDocument(configFile);
        return vscode.window.showTextDocument(doc, col);
    }
    catch {
        const doc = await vscode.workspace.openTextDocument(configFile.with({ scheme: 'untitled' }));
        const editor = await vscode.window.showTextDocument(doc, col);
        if (editor.document.getText().length === 0) {
            await editor.insertSnippet(inferredProjectConfigSnippet(projectType, configuration));
        }
        return editor;
    }
}
exports.openOrCreateConfig = openOrCreateConfig;
async function openProjectConfigOrPromptToCreate(projectType, client, rootPath, configFileName) {
    if (!isImplicitProjectConfigFile(configFileName)) {
        const doc = await vscode.workspace.openTextDocument(configFileName);
        vscode.window.showTextDocument(doc, vscode.window.activeTextEditor?.viewColumn);
        return;
    }
    const CreateConfigItem = {
        title: projectType === 0 /* TypeScript */
            ? localize('typescript.configureTsconfigQuickPick', 'Configure tsconfig.json')
            : localize('typescript.configureJsconfigQuickPick', 'Configure jsconfig.json'),
    };
    const selected = await vscode.window.showInformationMessage((projectType === 0 /* TypeScript */
        ? localize('typescript.noTypeScriptProjectConfig', 'File is not part of a TypeScript project. Click [here]({0}) to learn more.', 'https://go.microsoft.com/fwlink/?linkid=841896')
        : localize('typescript.noJavaScriptProjectConfig', 'File is not part of a JavaScript project Click [here]({0}) to learn more.', 'https://go.microsoft.com/fwlink/?linkid=759670')), CreateConfigItem);
    switch (selected) {
        case CreateConfigItem:
            openOrCreateConfig(projectType, rootPath, client.configuration);
            return;
    }
}
exports.openProjectConfigOrPromptToCreate = openProjectConfigOrPromptToCreate;
async function openProjectConfigForFile(projectType, client, resource) {
    const rootPath = client.getWorkspaceRootForResource(resource);
    if (!rootPath) {
        vscode.window.showInformationMessage(localize('typescript.projectConfigNoWorkspace', 'Please open a folder in VS Code to use a TypeScript or JavaScript project'));
        return;
    }
    const file = client.toPath(resource);
    // TSServer errors when 'projectInfo' is invoked on a non js/ts file
    if (!file || !await client.toPath(resource)) {
        vscode.window.showWarningMessage(localize('typescript.projectConfigUnsupportedFile', 'Could not determine TypeScript or JavaScript project. Unsupported file type'));
        return;
    }
    let res;
    try {
        res = await client.execute('projectInfo', { file, needFileNameList: false }, cancellation_1.nulToken);
    }
    catch {
        // noop
    }
    if (res?.type !== 'response' || !res.body) {
        vscode.window.showWarningMessage(localize('typescript.projectConfigCouldNotGetInfo', 'Could not determine TypeScript or JavaScript project'));
        return;
    }
    return openProjectConfigOrPromptToCreate(projectType, client, rootPath, res.body.configFileName);
}
exports.openProjectConfigForFile = openProjectConfigForFile;
//# sourceMappingURL=tsconfig.js.map