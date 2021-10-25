"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntellisenseStatus = void 0;
const vscode = require("vscode");
const nls = require("vscode-nls");
const typescriptService_1 = require("../typescriptService");
const dispose_1 = require("../utils/dispose");
const languageModeIds_1 = require("../utils/languageModeIds");
const tsconfig_1 = require("../utils/tsconfig");
const localize = nls.loadMessageBundle();
var IntellisenseState;
(function (IntellisenseState) {
    IntellisenseState.None = Object.freeze({ type: 0 /* None */ });
    IntellisenseState.SyntaxOnly = Object.freeze({ type: 3 /* SyntaxOnly */ });
    class Pending {
        constructor(resource, projectType) {
            this.resource = resource;
            this.projectType = projectType;
            this.type = 1 /* Pending */;
            this.cancellation = new vscode.CancellationTokenSource();
        }
    }
    IntellisenseState.Pending = Pending;
    class Resolved {
        constructor(resource, projectType, configFile) {
            this.resource = resource;
            this.projectType = projectType;
            this.configFile = configFile;
            this.type = 2 /* Resolved */;
        }
    }
    IntellisenseState.Resolved = Resolved;
})(IntellisenseState || (IntellisenseState = {}));
class IntellisenseStatus extends dispose_1.Disposable {
    constructor(_client, commandManager, _activeTextEditorManager) {
        super();
        this._client = _client;
        this._activeTextEditorManager = _activeTextEditorManager;
        this.openOpenConfigCommandId = '_typescript.openConfig';
        this.createConfigCommandId = '_typescript.createConfig';
        this._ready = false;
        this._state = IntellisenseState.None;
        commandManager.register({
            id: this.openOpenConfigCommandId,
            execute: async (rootPath, projectType) => {
                if (this._state.type === 2 /* Resolved */) {
                    await (0, tsconfig_1.openProjectConfigOrPromptToCreate)(projectType, this._client, rootPath, this._state.configFile);
                }
                else if (this._state.type === 1 /* Pending */) {
                    await (0, tsconfig_1.openProjectConfigForFile)(projectType, this._client, this._state.resource);
                }
            },
        });
        commandManager.register({
            id: this.createConfigCommandId,
            execute: async (rootPath, projectType) => {
                await (0, tsconfig_1.openOrCreateConfig)(projectType, rootPath, this._client.configuration);
            },
        });
        _activeTextEditorManager.onDidChangeActiveJsTsEditor(this.updateStatus, this, this._disposables);
        this._client.onReady(() => {
            this._ready = true;
            this.updateStatus();
        });
    }
    dispose() {
        super.dispose();
        this._statusItem?.dispose();
    }
    async updateStatus() {
        const doc = this._activeTextEditorManager.activeJsTsEditor?.document;
        if (!doc || !(0, languageModeIds_1.isSupportedLanguageMode)(doc)) {
            this.updateState(IntellisenseState.None);
            return;
        }
        if (!this._client.hasCapabilityForResource(doc.uri, typescriptService_1.ClientCapability.Semantic)) {
            this.updateState(IntellisenseState.SyntaxOnly);
            return;
        }
        const file = this._client.toOpenedFilePath(doc, { suppressAlertOnFailure: true });
        if (!file) {
            this.updateState(IntellisenseState.None);
            return;
        }
        if (!this._ready) {
            return;
        }
        const projectType = (0, languageModeIds_1.isTypeScriptDocument)(doc) ? 0 /* TypeScript */ : 1 /* JavaScript */;
        const pendingState = new IntellisenseState.Pending(doc.uri, projectType);
        this.updateState(pendingState);
        const response = await this._client.execute('projectInfo', { file, needFileNameList: false }, pendingState.cancellation.token);
        if (response.type === 'response' && response.body) {
            if (this._state === pendingState) {
                this.updateState(new IntellisenseState.Resolved(doc.uri, projectType, response.body.configFileName));
            }
        }
    }
    updateState(newState) {
        if (this._state === newState) {
            return;
        }
        if (this._state.type === 1 /* Pending */) {
            this._state.cancellation.cancel();
            this._state.cancellation.dispose();
        }
        this._state = newState;
        switch (this._state.type) {
            case 0 /* None */:
                this._statusItem?.dispose();
                this._statusItem = undefined;
                break;
            case 1 /* Pending */:
                {
                    const statusItem = this.ensureStatusItem();
                    statusItem.severity = vscode.LanguageStatusSeverity.Information;
                    statusItem.text = '$(loading~spin)';
                    statusItem.detail = localize('pending.detail', 'Loading IntelliSense status');
                    statusItem.command = undefined;
                    break;
                }
            case 2 /* Resolved */:
                {
                    const rootPath = this._client.getWorkspaceRootForResource(this._state.resource);
                    if (!rootPath) {
                        return;
                    }
                    const statusItem = this.ensureStatusItem();
                    statusItem.severity = vscode.LanguageStatusSeverity.Information;
                    if ((0, tsconfig_1.isImplicitProjectConfigFile)(this._state.configFile)) {
                        statusItem.text = this._state.projectType === 0 /* TypeScript */
                            ? localize('resolved.detail.noTsConfig', "No tsconfig")
                            : localize('resolved.detail.noJsConfig', "No jsconfig");
                        statusItem.detail = undefined;
                        statusItem.command = {
                            command: this.createConfigCommandId,
                            title: this._state.projectType === 0 /* TypeScript */
                                ? localize('resolved.command.title.createTsconfig', "Create tsconfig")
                                : localize('resolved.command.title.createJsconfig', "Create jsconfig"),
                            arguments: [rootPath],
                        };
                    }
                    else {
                        statusItem.text = vscode.workspace.asRelativePath(this._state.configFile);
                        statusItem.detail = undefined;
                        statusItem.command = {
                            command: this.openOpenConfigCommandId,
                            title: localize('resolved.command.title.open', "Open config file"),
                            arguments: [rootPath],
                        };
                    }
                }
                break;
            case 3 /* SyntaxOnly */:
                {
                    const statusItem = this.ensureStatusItem();
                    statusItem.severity = vscode.LanguageStatusSeverity.Warning;
                    statusItem.text = localize('syntaxOnly.text', 'Partial Mode');
                    statusItem.detail = localize('syntaxOnly.detail', 'Project Wide IntelliSense not available');
                    statusItem.command = {
                        title: localize('syntaxOnly.command.title.learnMore', "Learn More"),
                        command: 'vscode.open',
                        arguments: [
                            vscode.Uri.parse('https://aka.ms/vscode/jsts/partial-mode'),
                        ]
                    };
                    break;
                }
        }
    }
    ensureStatusItem() {
        if (!this._statusItem) {
            this._statusItem = vscode.languages.createLanguageStatusItem('typescript.projectStatus', languageModeIds_1.jsTsLanguageModes);
            this._statusItem.name = localize('statusItem.name', "JS/TS IntelliSense Status");
        }
        return this._statusItem;
    }
}
exports.IntellisenseStatus = IntellisenseStatus;
//# sourceMappingURL=intellisenseStatus.js.map