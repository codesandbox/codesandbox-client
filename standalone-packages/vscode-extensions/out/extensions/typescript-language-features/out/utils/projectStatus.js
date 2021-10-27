"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const vscode_nls_1 = require("vscode-nls");
const tsconfig_1 = require("./tsconfig");
const localize = vscode_nls_1.loadMessageBundle();
class ExcludeHintItem {
    constructor(telemetryReporter) {
        this.telemetryReporter = telemetryReporter;
        this._item = vscode.window.createStatusBarItem({
            id: 'status.typescript.exclude',
            name: localize('statusExclude', "TypeScript: Configure Excludes"),
            alignment: vscode.StatusBarAlignment.Right,
            priority: 98 /* to the right of typescript version status (99) */
        });
        this._item.command = 'js.projectStatus.command';
    }
    getCurrentHint() {
        return this._currentHint;
    }
    hide() {
        this._item.hide();
    }
    show(largeRoots) {
        this._currentHint = {
            message: largeRoots
                ? localize('hintExclude', "To enable project-wide JavaScript/TypeScript language features, exclude folders with many files, like: {0}", largeRoots)
                : localize('hintExclude.generic', "To enable project-wide JavaScript/TypeScript language features, exclude large folders with source files that you do not work on.")
        };
        this._item.tooltip = this._currentHint.message;
        this._item.text = localize('large.label', "Configure Excludes");
        this._item.tooltip = localize('hintExclude.tooltip', "To enable project-wide JavaScript/TypeScript language features, exclude large folders with source files that you do not work on.");
        this._item.color = '#A5DF3B';
        this._item.show();
        /* __GDPR__
            "js.hintProjectExcludes" : {
                "${include}": [
                    "${TypeScriptCommonProperties}"
                ]
            }
        */
        this.telemetryReporter.logTelemetry('js.hintProjectExcludes');
    }
}
function createLargeProjectMonitorFromTypeScript(item, client) {
    return client.onProjectLanguageServiceStateChanged(body => {
        if (body.languageServiceEnabled) {
            item.hide();
        }
        else {
            item.show();
            const configFileName = body.projectName;
            if (configFileName) {
                item.configFileName = configFileName;
                vscode.window.showWarningMessage(item.getCurrentHint().message, {
                    title: localize('large.label', "Configure Excludes"),
                    index: 0
                }).then(selected => {
                    if (selected && selected.index === 0) {
                        onConfigureExcludesSelected(client, configFileName);
                    }
                });
            }
        }
    });
}
function onConfigureExcludesSelected(client, configFileName) {
    if (!tsconfig_1.isImplicitProjectConfigFile(configFileName)) {
        vscode.workspace.openTextDocument(configFileName)
            .then(vscode.window.showTextDocument);
    }
    else {
        const root = client.getWorkspaceRootForResource(vscode.Uri.file(configFileName));
        if (root) {
            tsconfig_1.openOrCreateConfigFile(configFileName.match(/tsconfig\.?.*\.json/) !== null, root, client.configuration);
        }
    }
}
function create(client, telemetryReporter) {
    const toDispose = [];
    const item = new ExcludeHintItem(telemetryReporter);
    toDispose.push(vscode.commands.registerCommand('js.projectStatus.command', () => {
        if (item.configFileName) {
            onConfigureExcludesSelected(client, item.configFileName);
        }
        let { message } = item.getCurrentHint();
        return vscode.window.showInformationMessage(message);
    }));
    toDispose.push(createLargeProjectMonitorFromTypeScript(item, client));
    return vscode.Disposable.from(...toDispose);
}
exports.create = create;
//# sourceMappingURL=projectStatus.js.map