"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
/* --------------------------------------------------------------------------------------------
 * Includes code from typescript-sublime-plugin project, obtained from
 * https://github.com/Microsoft/TypeScript-Sublime-Plugin/blob/master/TypeScript%20Indent.tmPreferences
 * ------------------------------------------------------------------------------------------ */
const vscode = require("vscode");
const fileConfigurationManager_1 = require("./features/fileConfigurationManager");
const languageProvider_1 = require("./languageProvider");
const PConst = require("./protocol.const");
const typescriptServiceClient_1 = require("./typescriptServiceClient");
const api_1 = require("./utils/api");
const dispose_1 = require("./utils/dispose");
const typeConverters = require("./utils/typeConverters");
const typingsStatus_1 = require("./utils/typingsStatus");
const versionStatus_1 = require("./utils/versionStatus");
const arrays_1 = require("./utils/arrays");
// Style check diagnostics that can be reported as warnings
const styleCheckDiagnostics = [
    6133,
    6138,
    6192,
    7027,
    7028,
    7029,
    7030 // not all code paths return a value
];
class TypeScriptServiceClientHost extends dispose_1.Disposable {
    constructor(descriptions, workspaceState, pluginManager, commandManager, logDirectoryProvider, onCompletionAccepted) {
        super();
        this.commandManager = commandManager;
        this.languages = [];
        this.languagePerId = new Map();
        this.reportStyleCheckAsWarnings = true;
        const handleProjectCreateOrDelete = () => {
            this.triggerAllDiagnostics();
        };
        const handleProjectChange = () => {
            setTimeout(() => {
                this.triggerAllDiagnostics();
            }, 1500);
        };
        const configFileWatcher = this._register(vscode.workspace.createFileSystemWatcher('**/[tj]sconfig.json'));
        configFileWatcher.onDidCreate(handleProjectCreateOrDelete, this, this._disposables);
        configFileWatcher.onDidDelete(handleProjectCreateOrDelete, this, this._disposables);
        configFileWatcher.onDidChange(handleProjectChange, this, this._disposables);
        const allModeIds = this.getAllModeIds(descriptions, pluginManager);
        this.client = this._register(new typescriptServiceClient_1.default(workspaceState, version => this.versionStatus.onDidChangeTypeScriptVersion(version), pluginManager, logDirectoryProvider, allModeIds));
        this.client.onDiagnosticsReceived(({ kind, resource, diagnostics }) => {
            this.diagnosticsReceived(kind, resource, diagnostics);
        }, null, this._disposables);
        this.client.onConfigDiagnosticsReceived(diag => this.configFileDiagnosticsReceived(diag), null, this._disposables);
        this.client.onResendModelsRequested(() => this.populateService(), null, this._disposables);
        this.versionStatus = this._register(new versionStatus_1.default(resource => this.client.toPath(resource)));
        this._register(new typingsStatus_1.AtaProgressReporter(this.client));
        this.typingsStatus = this._register(new typingsStatus_1.default(this.client));
        this.fileConfigurationManager = this._register(new fileConfigurationManager_1.default(this.client));
        for (const description of descriptions) {
            const manager = new languageProvider_1.default(this.client, description, this.commandManager, this.client.telemetryReporter, this.typingsStatus, this.fileConfigurationManager, onCompletionAccepted);
            this.languages.push(manager);
            this._register(manager);
            this.languagePerId.set(description.id, manager);
        }
        Promise.resolve().then(() => require('./features/updatePathsOnRename')).then(module => this._register(module.register(this.client, this.fileConfigurationManager, uri => this.handles(uri))));
        Promise.resolve().then(() => require('./features/workspaceSymbols')).then(module => this._register(module.register(this.client, allModeIds)));
        this.client.ensureServiceStarted();
        this.client.onReady(() => {
            if (this.client.apiVersion.lt(api_1.default.v230)) {
                return;
            }
            const languages = new Set();
            for (const plugin of pluginManager.plugins) {
                for (const language of plugin.languages) {
                    languages.add(language);
                }
            }
            if (languages.size) {
                const description = {
                    id: 'typescript-plugins',
                    modeIds: Array.from(languages.values()),
                    diagnosticSource: 'ts-plugin',
                    diagnosticLanguage: 1 /* TypeScript */,
                    diagnosticOwner: 'typescript',
                    isExternal: true
                };
                const manager = new languageProvider_1.default(this.client, description, this.commandManager, this.client.telemetryReporter, this.typingsStatus, this.fileConfigurationManager, onCompletionAccepted);
                this.languages.push(manager);
                this._register(manager);
                this.languagePerId.set(description.id, manager);
            }
        });
        this.client.onTsServerStarted(() => {
            this.triggerAllDiagnostics();
        });
        vscode.workspace.onDidChangeConfiguration(this.configurationChanged, this, this._disposables);
        this.configurationChanged();
    }
    getAllModeIds(descriptions, pluginManager) {
        const allModeIds = arrays_1.flatten([
            ...descriptions.map(x => x.modeIds),
            ...pluginManager.plugins.map(x => x.languages)
        ]);
        return allModeIds;
    }
    get serviceClient() {
        return this.client;
    }
    reloadProjects() {
        this.client.executeWithoutWaitingForResponse('reloadProjects', null);
        this.triggerAllDiagnostics();
    }
    async handles(resource) {
        const provider = await this.findLanguage(resource);
        if (provider) {
            return true;
        }
        return this.client.bufferSyncSupport.handles(resource);
    }
    configurationChanged() {
        const typescriptConfig = vscode.workspace.getConfiguration('typescript');
        this.reportStyleCheckAsWarnings = typescriptConfig.get('reportStyleChecksAsWarnings', true);
    }
    async findLanguage(resource) {
        try {
            const doc = await vscode.workspace.openTextDocument(resource);
            return this.languages.find(language => language.handles(resource, doc));
        }
        catch (_a) {
            return undefined;
        }
    }
    triggerAllDiagnostics() {
        for (const language of this.languagePerId.values()) {
            language.triggerAllDiagnostics();
        }
    }
    populateService() {
        this.fileConfigurationManager.reset();
        this.client.bufferSyncSupport.reOpenDocuments();
        this.client.bufferSyncSupport.requestAllDiagnostics();
        // See https://github.com/Microsoft/TypeScript/issues/5530
        vscode.workspace.saveAll(false).then(() => {
            for (const language of this.languagePerId.values()) {
                language.reInitialize();
            }
        });
    }
    async diagnosticsReceived(kind, resource, diagnostics) {
        const language = await this.findLanguage(resource);
        if (language) {
            language.diagnosticsReceived(kind, resource, this.createMarkerDatas(diagnostics, language.diagnosticSource));
        }
    }
    configFileDiagnosticsReceived(event) {
        // See https://github.com/Microsoft/TypeScript/issues/10384
        const body = event.body;
        if (!body || !body.diagnostics || !body.configFile) {
            return;
        }
        this.findLanguage(this.client.toResource(body.configFile)).then(language => {
            if (!language) {
                return;
            }
            language.configFileDiagnosticsReceived(this.client.toResource(body.configFile), body.diagnostics.map(tsDiag => {
                const range = tsDiag.start && tsDiag.end ? typeConverters.Range.fromTextSpan(tsDiag) : new vscode.Range(0, 0, 0, 1);
                const diagnostic = new vscode.Diagnostic(range, body.diagnostics[0].text, this.getDiagnosticSeverity(tsDiag));
                diagnostic.source = language.diagnosticSource;
                return diagnostic;
            }));
        });
    }
    createMarkerDatas(diagnostics, source) {
        return diagnostics.map(tsDiag => this.tsDiagnosticToVsDiagnostic(tsDiag, source));
    }
    tsDiagnosticToVsDiagnostic(diagnostic, source) {
        const { start, end, text } = diagnostic;
        const range = new vscode.Range(typeConverters.Position.fromLocation(start), typeConverters.Position.fromLocation(end));
        const converted = new vscode.Diagnostic(range, text, this.getDiagnosticSeverity(diagnostic));
        converted.source = diagnostic.source || source;
        if (diagnostic.code) {
            converted.code = diagnostic.code;
        }
        const relatedInformation = diagnostic.relatedInformation;
        if (relatedInformation) {
            converted.relatedInformation = relatedInformation.map((info) => {
                let span = info.span;
                if (!span) {
                    return undefined;
                }
                return new vscode.DiagnosticRelatedInformation(typeConverters.Location.fromTextSpan(this.client.toResource(span.file), span), info.message);
            }).filter((x) => !!x);
        }
        if (diagnostic.reportsUnnecessary) {
            converted.tags = [vscode.DiagnosticTag.Unnecessary];
        }
        converted.reportUnnecessary = diagnostic.reportsUnnecessary;
        return converted;
    }
    getDiagnosticSeverity(diagnostic) {
        if (this.reportStyleCheckAsWarnings
            && this.isStyleCheckDiagnostic(diagnostic.code)
            && diagnostic.category === PConst.DiagnosticCategory.error) {
            return vscode.DiagnosticSeverity.Warning;
        }
        switch (diagnostic.category) {
            case PConst.DiagnosticCategory.error:
                return vscode.DiagnosticSeverity.Error;
            case PConst.DiagnosticCategory.warning:
                return vscode.DiagnosticSeverity.Warning;
            case PConst.DiagnosticCategory.suggestion:
                return vscode.DiagnosticSeverity.Hint;
            default:
                return vscode.DiagnosticSeverity.Error;
        }
    }
    isStyleCheckDiagnostic(code) {
        return code ? styleCheckDiagnostics.indexOf(code) !== -1 : false;
    }
}
exports.default = TypeScriptServiceClientHost;
//# sourceMappingURL=typeScriptServiceClientHost.js.map