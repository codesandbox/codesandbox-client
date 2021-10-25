"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const vscode = require("vscode");
const cachedResponse_1 = require("./tsServer/cachedResponse");
const typescriptService_1 = require("./typescriptService");
const dispose_1 = require("./utils/dispose");
const fileSchemes = require("./utils/fileSchemes");
const validateSetting = 'validate.enable';
const suggestionSetting = 'suggestionActions.enabled';
class LanguageProvider extends dispose_1.Disposable {
    constructor(client, description, commandManager, telemetryReporter, typingsStatus, fileConfigurationManager, onCompletionAccepted) {
        super();
        this.client = client;
        this.description = description;
        this.commandManager = commandManager;
        this.telemetryReporter = telemetryReporter;
        this.typingsStatus = typingsStatus;
        this.fileConfigurationManager = fileConfigurationManager;
        this.onCompletionAccepted = onCompletionAccepted;
        vscode.workspace.onDidChangeConfiguration(this.configurationChanged, this, this._disposables);
        this.configurationChanged();
        client.onReady(() => this.registerProviders());
    }
    get documentSelector() {
        const semantic = [];
        const syntax = [];
        for (const language of this.description.modeIds) {
            syntax.push({ language });
            for (const scheme of fileSchemes.semanticSupportedSchemes) {
                semantic.push({ language, scheme });
            }
        }
        return { semantic, syntax };
    }
    async registerProviders() {
        const selector = this.documentSelector;
        const cachedResponse = new cachedResponse_1.CachedResponse();
        await Promise.all([
            Promise.resolve().then(() => require('./languageFeatures/callHierarchy')).then(provider => this._register(provider.register(selector, this.client))),
            Promise.resolve().then(() => require('./languageFeatures/codeLens/implementationsCodeLens')).then(provider => this._register(provider.register(selector, this.description.id, this.client, cachedResponse))),
            Promise.resolve().then(() => require('./languageFeatures/codeLens/referencesCodeLens')).then(provider => this._register(provider.register(selector, this.description.id, this.client, cachedResponse))),
            Promise.resolve().then(() => require('./languageFeatures/completions')).then(provider => this._register(provider.register(selector, this.description.id, this.client, this.typingsStatus, this.fileConfigurationManager, this.commandManager, this.telemetryReporter, this.onCompletionAccepted))),
            Promise.resolve().then(() => require('./languageFeatures/definitions')).then(provider => this._register(provider.register(selector, this.client))),
            Promise.resolve().then(() => require('./languageFeatures/directiveCommentCompletions')).then(provider => this._register(provider.register(selector, this.client))),
            Promise.resolve().then(() => require('./languageFeatures/documentHighlight')).then(provider => this._register(provider.register(selector, this.client))),
            Promise.resolve().then(() => require('./languageFeatures/documentSymbol')).then(provider => this._register(provider.register(selector, this.client, cachedResponse))),
            Promise.resolve().then(() => require('./languageFeatures/fileReferences')).then(provider => this._register(provider.register(this.client, this.commandManager))),
            Promise.resolve().then(() => require('./languageFeatures/fixAll')).then(provider => this._register(provider.register(selector, this.client, this.fileConfigurationManager, this.client.diagnosticsManager))),
            Promise.resolve().then(() => require('./languageFeatures/folding')).then(provider => this._register(provider.register(selector, this.client))),
            Promise.resolve().then(() => require('./languageFeatures/formatting')).then(provider => this._register(provider.register(selector, this.description.id, this.client, this.fileConfigurationManager))),
            Promise.resolve().then(() => require('./languageFeatures/hover')).then(provider => this._register(provider.register(selector, this.client, this.fileConfigurationManager))),
            Promise.resolve().then(() => require('./languageFeatures/implementations')).then(provider => this._register(provider.register(selector, this.client))),
            Promise.resolve().then(() => require('./languageFeatures/jsDocCompletions')).then(provider => this._register(provider.register(selector, this.description.id, this.client, this.fileConfigurationManager))),
            Promise.resolve().then(() => require('./languageFeatures/organizeImports')).then(provider => this._register(provider.register(selector, this.client, this.commandManager, this.fileConfigurationManager, this.telemetryReporter))),
            Promise.resolve().then(() => require('./languageFeatures/quickFix')).then(provider => this._register(provider.register(selector, this.client, this.fileConfigurationManager, this.commandManager, this.client.diagnosticsManager, this.telemetryReporter))),
            Promise.resolve().then(() => require('./languageFeatures/refactor')).then(provider => this._register(provider.register(selector, this.client, this.fileConfigurationManager, this.commandManager, this.telemetryReporter))),
            Promise.resolve().then(() => require('./languageFeatures/references')).then(provider => this._register(provider.register(selector, this.client))),
            Promise.resolve().then(() => require('./languageFeatures/rename')).then(provider => this._register(provider.register(selector, this.client, this.fileConfigurationManager))),
            Promise.resolve().then(() => require('./languageFeatures/semanticTokens')).then(provider => this._register(provider.register(selector, this.client))),
            Promise.resolve().then(() => require('./languageFeatures/signatureHelp')).then(provider => this._register(provider.register(selector, this.client))),
            Promise.resolve().then(() => require('./languageFeatures/smartSelect')).then(provider => this._register(provider.register(selector, this.client))),
            Promise.resolve().then(() => require('./languageFeatures/tagClosing')).then(provider => this._register(provider.register(selector, this.description.id, this.client))),
            Promise.resolve().then(() => require('./languageFeatures/typeDefinitions')).then(provider => this._register(provider.register(selector, this.client))),
            Promise.resolve().then(() => require('./languageFeatures/inlayHints')).then(provider => this._register(provider.register(selector, this.description.id, this.description.modeIds, this.client, this.fileConfigurationManager))),
        ]);
    }
    configurationChanged() {
        const config = vscode.workspace.getConfiguration(this.id, null);
        this.updateValidate(config.get(validateSetting, true));
        this.updateSuggestionDiagnostics(config.get(suggestionSetting, true));
    }
    handlesUri(resource) {
        const ext = (0, path_1.extname)(resource.path).slice(1).toLowerCase();
        return this.description.standardFileExtensions.includes(ext) || this.handlesConfigFile(resource);
    }
    handlesDocument(doc) {
        return this.description.modeIds.includes(doc.languageId) || this.handlesConfigFile(doc.uri);
    }
    handlesConfigFile(resource) {
        const base = (0, path_1.basename)(resource.fsPath);
        return !!base && (!!this.description.configFilePattern && this.description.configFilePattern.test(base));
    }
    get id() {
        return this.description.id;
    }
    get diagnosticSource() {
        return this.description.diagnosticSource;
    }
    updateValidate(value) {
        this.client.diagnosticsManager.setValidate(this._diagnosticLanguage, value);
    }
    updateSuggestionDiagnostics(value) {
        this.client.diagnosticsManager.setEnableSuggestions(this._diagnosticLanguage, value);
    }
    reInitialize() {
        this.client.diagnosticsManager.reInitialize();
    }
    triggerAllDiagnostics() {
        this.client.bufferSyncSupport.requestAllDiagnostics();
    }
    diagnosticsReceived(diagnosticsKind, file, diagnostics) {
        if (diagnosticsKind !== 0 /* Syntax */ && !this.client.hasCapabilityForResource(file, typescriptService_1.ClientCapability.Semantic)) {
            return;
        }
        const config = vscode.workspace.getConfiguration(this.id, file);
        const reportUnnecessary = config.get('showUnused', true);
        const reportDeprecated = config.get('showDeprecated', true);
        this.client.diagnosticsManager.updateDiagnostics(file, this._diagnosticLanguage, diagnosticsKind, diagnostics.filter(diag => {
            // Don't bother reporting diagnostics we know will not be rendered
            if (!reportUnnecessary) {
                if (diag.reportUnnecessary && diag.severity === vscode.DiagnosticSeverity.Hint) {
                    return false;
                }
            }
            if (!reportDeprecated) {
                if (diag.reportDeprecated && diag.severity === vscode.DiagnosticSeverity.Hint) {
                    return false;
                }
            }
            return true;
        }));
    }
    configFileDiagnosticsReceived(file, diagnostics) {
        this.client.diagnosticsManager.configFileDiagnosticsReceived(file, diagnostics);
    }
    get _diagnosticLanguage() {
        return this.description.diagnosticLanguage;
    }
}
exports.default = LanguageProvider;
//# sourceMappingURL=languageProvider.js.map