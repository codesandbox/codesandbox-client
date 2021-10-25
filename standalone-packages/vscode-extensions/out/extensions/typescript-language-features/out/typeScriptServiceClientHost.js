"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
/* --------------------------------------------------------------------------------------------
 * Includes code from typescript-sublime-plugin project, obtained from
 * https://github.com/microsoft/TypeScript-Sublime-Plugin/blob/master/TypeScript%20Indent.tmPreferences
 * ------------------------------------------------------------------------------------------ */
const vscode = require("vscode");
const fileConfigurationManager_1 = require("./languageFeatures/fileConfigurationManager");
const languageProvider_1 = require("./languageProvider");
const PConst = require("./protocol.const");
const typescriptServiceClient_1 = require("./typescriptServiceClient");
const intellisenseStatus_1 = require("./ui/intellisenseStatus");
const versionStatus_1 = require("./ui/versionStatus");
const arrays_1 = require("./utils/arrays");
const dispose_1 = require("./utils/dispose");
const errorCodes = require("./utils/errorCodes");
const LargeProjectStatus = require("./utils/largeProjectStatus");
const logLevelMonitor_1 = require("./utils/logLevelMonitor");
const typeConverters = require("./utils/typeConverters");
const typingsStatus_1 = require("./utils/typingsStatus");
// Style check diagnostics that can be reported as warnings
const styleCheckDiagnostics = new Set([
    ...errorCodes.variableDeclaredButNeverUsed,
    ...errorCodes.propertyDeclaretedButNeverUsed,
    ...errorCodes.allImportsAreUnused,
    ...errorCodes.unreachableCode,
    ...errorCodes.unusedLabel,
    ...errorCodes.fallThroughCaseInSwitch,
    ...errorCodes.notAllCodePathsReturnAValue,
]);
class TypeScriptServiceClientHost extends dispose_1.Disposable {
    constructor(descriptions, context, onCaseInsenitiveFileSystem, services, onCompletionAccepted) {
        super();
        this.languages = [];
        this.languagePerId = new Map();
        this.reportStyleCheckAsWarnings = true;
        this.commandManager = services.commandManager;
        const allModeIds = this.getAllModeIds(descriptions, services.pluginManager);
        this.client = this._register(new typescriptServiceClient_1.default(context, onCaseInsenitiveFileSystem, services, allModeIds));
        this.client.onDiagnosticsReceived(({ kind, resource, diagnostics }) => {
            this.diagnosticsReceived(kind, resource, diagnostics);
        }, null, this._disposables);
        this.client.onConfigDiagnosticsReceived(diag => this.configFileDiagnosticsReceived(diag), null, this._disposables);
        this.client.onResendModelsRequested(() => this.populateService(), null, this._disposables);
        this._register(new versionStatus_1.VersionStatus(this.client));
        this._register(new intellisenseStatus_1.IntellisenseStatus(this.client, services.commandManager, services.activeJsTsEditorTracker));
        this._register(new typingsStatus_1.AtaProgressReporter(this.client));
        this.typingsStatus = this._register(new typingsStatus_1.default(this.client));
        this._register(LargeProjectStatus.create(this.client));
        this.fileConfigurationManager = this._register(new fileConfigurationManager_1.default(this.client, onCaseInsenitiveFileSystem));
        for (const description of descriptions) {
            const manager = new languageProvider_1.default(this.client, description, this.commandManager, this.client.telemetryReporter, this.typingsStatus, this.fileConfigurationManager, onCompletionAccepted);
            this.languages.push(manager);
            this._register(manager);
            this.languagePerId.set(description.id, manager);
        }
        Promise.resolve().then(() => require('./languageFeatures/updatePathsOnRename')).then(module => this._register(module.register(this.client, this.fileConfigurationManager, uri => this.handles(uri))));
        Promise.resolve().then(() => require('./languageFeatures/workspaceSymbols')).then(module => this._register(module.register(this.client, allModeIds)));
        this.client.ensureServiceStarted();
        this.client.onReady(() => {
            const languages = new Set();
            for (const plugin of services.pluginManager.plugins) {
                if (plugin.configNamespace && plugin.languages.length) {
                    this.registerExtensionLanguageProvider({
                        id: plugin.configNamespace,
                        modeIds: Array.from(plugin.languages),
                        diagnosticSource: 'ts-plugin',
                        diagnosticLanguage: 1 /* TypeScript */,
                        diagnosticOwner: 'typescript',
                        isExternal: true,
                        standardFileExtensions: [],
                    }, onCompletionAccepted);
                }
                else {
                    for (const language of plugin.languages) {
                        languages.add(language);
                    }
                }
            }
            if (languages.size) {
                this.registerExtensionLanguageProvider({
                    id: 'typescript-plugins',
                    modeIds: Array.from(languages.values()),
                    diagnosticSource: 'ts-plugin',
                    diagnosticLanguage: 1 /* TypeScript */,
                    diagnosticOwner: 'typescript',
                    isExternal: true,
                    standardFileExtensions: [],
                }, onCompletionAccepted);
            }
        });
        this.client.onTsServerStarted(() => {
            this.triggerAllDiagnostics();
        });
        vscode.workspace.onDidChangeConfiguration(this.configurationChanged, this, this._disposables);
        this.configurationChanged();
        this._register(new logLevelMonitor_1.LogLevelMonitor(context));
    }
    registerExtensionLanguageProvider(description, onCompletionAccepted) {
        const manager = new languageProvider_1.default(this.client, description, this.commandManager, this.client.telemetryReporter, this.typingsStatus, this.fileConfigurationManager, onCompletionAccepted);
        this.languages.push(manager);
        this._register(manager);
        this.languagePerId.set(description.id, manager);
    }
    getAllModeIds(descriptions, pluginManager) {
        const allModeIds = (0, arrays_1.flatten)([
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
            // First try finding language just based on the resource.
            // This is not strictly correct but should be in the vast majority of cases
            // (except when someone goes and maps `.js` to `typescript` or something...)
            for (const language of this.languages) {
                if (language.handlesUri(resource)) {
                    return language;
                }
            }
            // If that doesn't work, fallback to using a text document language mode.
            // This is not ideal since we have to open the document but should always
            // be correct
            const doc = await vscode.workspace.openTextDocument(resource);
            return this.languages.find(language => language.handlesDocument(doc));
        }
        catch {
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
        for (const language of this.languagePerId.values()) {
            language.reInitialize();
        }
    }
    async diagnosticsReceived(kind, resource, diagnostics) {
        const language = await this.findLanguage(resource);
        if (language) {
            language.diagnosticsReceived(kind, resource, this.createMarkerDatas(diagnostics, language.diagnosticSource));
        }
    }
    configFileDiagnosticsReceived(event) {
        // See https://github.com/microsoft/TypeScript/issues/10384
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
            converted.relatedInformation = (0, arrays_1.coalesce)(relatedInformation.map((info) => {
                const span = info.span;
                if (!span) {
                    return undefined;
                }
                return new vscode.DiagnosticRelatedInformation(typeConverters.Location.fromTextSpan(this.client.toResource(span.file), span), info.message);
            }));
        }
        const tags = [];
        if (diagnostic.reportsUnnecessary) {
            tags.push(vscode.DiagnosticTag.Unnecessary);
        }
        if (diagnostic.reportsDeprecated) {
            tags.push(vscode.DiagnosticTag.Deprecated);
        }
        converted.tags = tags.length ? tags : undefined;
        const resultConverted = converted;
        resultConverted.reportUnnecessary = diagnostic.reportsUnnecessary;
        resultConverted.reportDeprecated = diagnostic.reportsDeprecated;
        return resultConverted;
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
        return typeof code === 'number' && styleCheckDiagnostics.has(code);
    }
}
exports.default = TypeScriptServiceClientHost;
//# sourceMappingURL=typeScriptServiceClientHost.js.map