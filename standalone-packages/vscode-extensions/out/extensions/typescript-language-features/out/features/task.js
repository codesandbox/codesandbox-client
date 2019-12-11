"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const jsonc = require("jsonc-parser");
const path = require("path");
const vscode = require("vscode");
const nls = require("vscode-nls");
const languageDescription_1 = require("../utils/languageDescription");
const tsconfig_1 = require("../utils/tsconfig");
const tsconfigProvider_1 = require("../utils/tsconfigProvider");
const localize = nls.loadMessageBundle();
const exists = (file) => new Promise((resolve, _reject) => {
    fs.exists(file, (value) => {
        resolve(value);
    });
});
/**
 * Provides tasks for building `tsconfig.json` files in a project.
 */
class TscTaskProvider {
    constructor(client) {
        this.client = client;
        this.autoDetect = 'on';
        this.disposables = [];
        this.tsconfigProvider = new tsconfigProvider_1.default();
        vscode.workspace.onDidChangeConfiguration(this.onConfigurationChanged, this, this.disposables);
        this.onConfigurationChanged();
    }
    dispose() {
        this.disposables.forEach(x => x.dispose());
    }
    async provideTasks(token) {
        const folders = vscode.workspace.workspaceFolders;
        if ((this.autoDetect === 'off') || !folders || !folders.length) {
            return [];
        }
        const configPaths = new Set();
        const tasks = [];
        for (const project of await this.getAllTsConfigs(token)) {
            if (!configPaths.has(project.path)) {
                configPaths.add(project.path);
                tasks.push(...(await this.getTasksForProject(project)));
            }
        }
        return tasks;
    }
    async resolveTask(_task) {
        const definition = _task.definition;
        const badTsconfig = /\\tsconfig.*\.json/;
        if (badTsconfig.exec(definition.tsconfig) !== null) {
            // Warn that the task has the wrong slash type
            vscode.window.showWarningMessage(localize('badTsConfig', "Typescript Task in tasks.json contains \"\\\\\". Typescript tasks tsconfig must use \"/\""));
            return undefined;
        }
        const typescriptTask = _task.definition.tsconfig;
        if (typescriptTask) {
            if (_task.scope === undefined || _task.scope === vscode.TaskScope.Global || _task.scope === vscode.TaskScope.Workspace) {
                // scope is required to be a WorkspaceFolder for resolveTask
                return undefined;
            }
            const kind = _task.definition;
            const tsconfigUri = _task.scope.uri.with({ path: _task.scope.uri.path + '/' + kind.tsconfig });
            const tsconfig = {
                path: tsconfigUri.fsPath,
                posixPath: tsconfigUri.path,
                workspaceFolder: _task.scope
            };
            return this.getTasksForProjectAndDefinition(tsconfig, kind);
        }
        return undefined;
    }
    async getAllTsConfigs(token) {
        const out = new Set();
        const configs = [
            ...await this.getTsConfigForActiveFile(token),
            ...await this.getTsConfigsInWorkspace()
        ];
        for (const config of configs) {
            if (await exists(config.path)) {
                out.add(config);
            }
        }
        return Array.from(out);
    }
    async getTsConfigForActiveFile(token) {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            if (languageDescription_1.isTsConfigFileName(editor.document.fileName)) {
                const uri = editor.document.uri;
                return [{
                        path: uri.fsPath,
                        posixPath: uri.path,
                        workspaceFolder: vscode.workspace.getWorkspaceFolder(uri)
                    }];
            }
        }
        const file = this.getActiveTypeScriptFile();
        if (!file) {
            return [];
        }
        const response = await this.client.value.execute('projectInfo', { file, needFileNameList: false }, token);
        if (response.type !== 'response' || !response.body) {
            return [];
        }
        const { configFileName } = response.body;
        if (configFileName && !tsconfig_1.isImplicitProjectConfigFile(configFileName)) {
            const normalizedConfigPath = path.normalize(configFileName);
            const uri = vscode.Uri.file(normalizedConfigPath);
            const folder = vscode.workspace.getWorkspaceFolder(uri);
            return [{
                    path: normalizedConfigPath,
                    posixPath: uri.path,
                    workspaceFolder: folder
                }];
        }
        return [];
    }
    async getTsConfigsInWorkspace() {
        return Array.from(await this.tsconfigProvider.getConfigsForWorkspace());
    }
    static async getCommand(project) {
        if (project.workspaceFolder) {
            const localTsc = await TscTaskProvider.getLocalTscAtPath(path.dirname(project.path));
            if (localTsc) {
                return localTsc;
            }
            const workspaceTsc = await TscTaskProvider.getLocalTscAtPath(project.workspaceFolder.uri.fsPath);
            if (workspaceTsc) {
                return workspaceTsc;
            }
        }
        // Use global tsc version
        return 'tsc';
    }
    static async getLocalTscAtPath(folderPath) {
        const platform = process.platform;
        const bin = path.join(folderPath, 'node_modules', '.bin');
        if (platform === 'win32' && await exists(path.join(bin, 'tsc.cmd'))) {
            return path.join(bin, 'tsc.cmd');
        }
        else if ((platform === 'linux' || platform === 'darwin') && await exists(path.join(bin, 'tsc'))) {
            return path.join(bin, 'tsc');
        }
        return undefined;
    }
    getActiveTypeScriptFile() {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            if (document && (document.languageId === 'typescript' || document.languageId === 'typescriptreact')) {
                return this.client.value.toPath(document.uri);
            }
        }
        return undefined;
    }
    getBuildTask(workspaceFolder, label, command, args, buildTaskidentifier) {
        const buildTask = new vscode.Task(buildTaskidentifier, workspaceFolder || vscode.TaskScope.Workspace, localize('buildTscLabel', 'build - {0}', label), 'tsc', new vscode.ShellExecution(command, args), '$tsc');
        buildTask.group = vscode.TaskGroup.Build;
        buildTask.isBackground = false;
        return buildTask;
    }
    getWatchTask(workspaceFolder, label, command, args, watchTaskidentifier) {
        const watchTask = new vscode.Task(watchTaskidentifier, workspaceFolder || vscode.TaskScope.Workspace, localize('buildAndWatchTscLabel', 'watch - {0}', label), 'tsc', new vscode.ShellExecution(command, [...args, '--watch']), '$tsc-watch');
        watchTask.group = vscode.TaskGroup.Build;
        watchTask.isBackground = true;
        return watchTask;
    }
    async getTasksForProject(project) {
        const command = await TscTaskProvider.getCommand(project);
        const args = await this.getBuildShellArgs(project);
        const label = this.getLabelForTasks(project);
        const tasks = [];
        if (this.autoDetect === 'build' || this.autoDetect === 'on') {
            tasks.push(this.getBuildTask(project.workspaceFolder, label, command, args, { type: 'typescript', tsconfig: label }));
        }
        if (this.autoDetect === 'watch' || this.autoDetect === 'on') {
            tasks.push(this.getWatchTask(project.workspaceFolder, label, command, args, { type: 'typescript', tsconfig: label, option: 'watch' }));
        }
        return tasks;
    }
    async getTasksForProjectAndDefinition(project, definition) {
        const command = await TscTaskProvider.getCommand(project);
        const args = await this.getBuildShellArgs(project);
        const label = this.getLabelForTasks(project);
        let task;
        if (definition.option === undefined) {
            task = this.getBuildTask(project.workspaceFolder, label, command, args, definition);
        }
        else if (definition.option === 'watch') {
            task = this.getWatchTask(project.workspaceFolder, label, command, args, definition);
        }
        return task;
    }
    getBuildShellArgs(project) {
        const defaultArgs = ['-p', project.path];
        return new Promise((resolve) => {
            fs.readFile(project.path, (error, result) => {
                if (error) {
                    return resolve(defaultArgs);
                }
                try {
                    const tsconfig = jsonc.parse(result.toString());
                    if (tsconfig.references) {
                        return resolve(['-b', project.path]);
                    }
                }
                catch (_a) {
                    // noop
                }
                return resolve(defaultArgs);
            });
        });
    }
    getLabelForTasks(project) {
        if (project.workspaceFolder) {
            const workspaceNormalizedUri = vscode.Uri.file(path.normalize(project.workspaceFolder.uri.fsPath)); // Make sure the drive letter is lowercase
            return path.posix.relative(workspaceNormalizedUri.path, project.posixPath);
        }
        return project.posixPath;
    }
    onConfigurationChanged() {
        const type = vscode.workspace.getConfiguration('typescript.tsc').get('autoDetect');
        this.autoDetect = typeof type === 'undefined' ? 'on' : type;
    }
}
exports.default = TscTaskProvider;
//# sourceMappingURL=task.js.map