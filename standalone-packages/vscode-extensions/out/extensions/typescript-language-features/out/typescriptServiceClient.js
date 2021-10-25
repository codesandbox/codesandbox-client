"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const vscode = require("vscode");
const nls = require("vscode-nls");
const diagnostics_1 = require("./languageFeatures/diagnostics");
const protocol_const_1 = require("./protocol.const");
const bufferSyncSupport_1 = require("./tsServer/bufferSyncSupport");
const serverError_1 = require("./tsServer/serverError");
const spawner_1 = require("./tsServer/spawner");
const versionManager_1 = require("./tsServer/versionManager");
const typescriptService_1 = require("./typescriptService");
const api_1 = require("./utils/api");
const configuration_1 = require("./utils/configuration");
const dispose_1 = require("./utils/dispose");
const fileSchemes = require("./utils/fileSchemes");
const logger_1 = require("./utils/logger");
const platform_1 = require("./utils/platform");
const pluginPathsProvider_1 = require("./utils/pluginPathsProvider");
const telemetry_1 = require("./utils/telemetry");
const tracer_1 = require("./utils/tracer");
const tsconfig_1 = require("./utils/tsconfig");
const localize = nls.loadMessageBundle();
var ServerState;
(function (ServerState) {
    ServerState.None = { type: 0 /* None */ };
    class Running {
        constructor(server, 
        /**
         * API version obtained from the version picker after checking the corresponding path exists.
         */
        apiVersion, 
        /**
         * Version reported by currently-running tsserver.
         */
        tsserverVersion, languageServiceEnabled) {
            this.server = server;
            this.apiVersion = apiVersion;
            this.tsserverVersion = tsserverVersion;
            this.languageServiceEnabled = languageServiceEnabled;
            this.type = 1 /* Running */;
            this.toCancelOnResourceChange = new Set();
        }
        updateTsserverVersion(tsserverVersion) {
            this.tsserverVersion = tsserverVersion;
        }
        updateLanguageServiceEnabled(enabled) {
            this.languageServiceEnabled = enabled;
        }
    }
    ServerState.Running = Running;
    class Errored {
        constructor(error, tsServerLogFile) {
            this.error = error;
            this.tsServerLogFile = tsServerLogFile;
            this.type = 2 /* Errored */;
        }
    }
    ServerState.Errored = Errored;
})(ServerState || (ServerState = {}));
class TypeScriptServiceClient extends dispose_1.Disposable {
    constructor(context, onCaseInsenitiveFileSystem, services, allModeIds) {
        super();
        this.context = context;
        this.inMemoryResourcePrefix = '^';
        this.logger = new logger_1.Logger();
        this.tracer = new tracer_1.default(this.logger);
        this.serverState = ServerState.None;
        this._isPromptingAfterCrash = false;
        this.isRestarting = false;
        this.hasServerFatallyCrashedTooManyTimes = false;
        this.loadingIndicator = new ServerInitializingIndicator();
        this._onDidChangeCapabilities = this._register(new vscode.EventEmitter());
        this.onDidChangeCapabilities = this._onDidChangeCapabilities.event;
        this._onTsServerStarted = this._register(new vscode.EventEmitter());
        this.onTsServerStarted = this._onTsServerStarted.event;
        this._onDiagnosticsReceived = this._register(new vscode.EventEmitter());
        this.onDiagnosticsReceived = this._onDiagnosticsReceived.event;
        this._onConfigDiagnosticsReceived = this._register(new vscode.EventEmitter());
        this.onConfigDiagnosticsReceived = this._onConfigDiagnosticsReceived.event;
        this._onResendModelsRequested = this._register(new vscode.EventEmitter());
        this.onResendModelsRequested = this._onResendModelsRequested.event;
        this._onProjectLanguageServiceStateChanged = this._register(new vscode.EventEmitter());
        this.onProjectLanguageServiceStateChanged = this._onProjectLanguageServiceStateChanged.event;
        this._onDidBeginInstallTypings = this._register(new vscode.EventEmitter());
        this.onDidBeginInstallTypings = this._onDidBeginInstallTypings.event;
        this._onDidEndInstallTypings = this._register(new vscode.EventEmitter());
        this.onDidEndInstallTypings = this._onDidEndInstallTypings.event;
        this._onTypesInstallerInitializationFailed = this._register(new vscode.EventEmitter());
        this.onTypesInstallerInitializationFailed = this._onTypesInstallerInitializationFailed.event;
        this._onSurveyReady = this._register(new vscode.EventEmitter());
        this.onSurveyReady = this._onSurveyReady.event;
        this.token = 0;
        this.workspaceState = context.workspaceState;
        this.pluginManager = services.pluginManager;
        this.logDirectoryProvider = services.logDirectoryProvider;
        this.cancellerFactory = services.cancellerFactory;
        this.versionProvider = services.versionProvider;
        this.processFactory = services.processFactory;
        this.pathSeparator = path.sep;
        this.lastStart = Date.now();
        let resolve;
        let reject;
        const p = new Promise((res, rej) => {
            resolve = res;
            reject = rej;
        });
        this._onReady = { promise: p, resolve: resolve, reject: reject };
        this.numberRestarts = 0;
        this._configuration = services.serviceConfigurationProvider.loadFromWorkspace();
        this.versionProvider.updateConfiguration(this._configuration);
        this.pluginPathsProvider = new pluginPathsProvider_1.TypeScriptPluginPathsProvider(this._configuration);
        this._versionManager = this._register(new versionManager_1.TypeScriptVersionManager(this._configuration, this.versionProvider, this.workspaceState));
        this._register(this._versionManager.onDidPickNewVersion(() => {
            this.restartTsServer();
        }));
        this.bufferSyncSupport = new bufferSyncSupport_1.default(this, allModeIds, onCaseInsenitiveFileSystem);
        this.onReady(() => { this.bufferSyncSupport.listen(); });
        this.diagnosticsManager = new diagnostics_1.DiagnosticsManager('typescript', onCaseInsenitiveFileSystem);
        this.bufferSyncSupport.onDelete(resource => {
            this.cancelInflightRequestsForResource(resource);
            this.diagnosticsManager.delete(resource);
        }, null, this._disposables);
        this.bufferSyncSupport.onWillChange(resource => {
            this.cancelInflightRequestsForResource(resource);
        });
        vscode.workspace.onDidChangeConfiguration(() => {
            const oldConfiguration = this._configuration;
            this._configuration = services.serviceConfigurationProvider.loadFromWorkspace();
            this.versionProvider.updateConfiguration(this._configuration);
            this._versionManager.updateConfiguration(this._configuration);
            this.pluginPathsProvider.updateConfiguration(this._configuration);
            this.tracer.updateConfiguration();
            if (this.serverState.type === 1 /* Running */) {
                if (!this._configuration.implicitProjectConfiguration.isEqualTo(oldConfiguration.implicitProjectConfiguration)) {
                    this.setCompilerOptionsForInferredProjects(this._configuration);
                }
                if (!(0, configuration_1.areServiceConfigurationsEqual)(this._configuration, oldConfiguration)) {
                    this.restartTsServer();
                }
            }
        }, this, this._disposables);
        this.telemetryReporter = this._register(new telemetry_1.VSCodeTelemetryReporter(() => {
            if (this.serverState.type === 1 /* Running */) {
                if (this.serverState.tsserverVersion) {
                    return this.serverState.tsserverVersion;
                }
            }
            return this.apiVersion.fullVersionString;
        }));
        this.typescriptServerSpawner = new spawner_1.TypeScriptServerSpawner(this.versionProvider, this._versionManager, this.logDirectoryProvider, this.pluginPathsProvider, this.logger, this.telemetryReporter, this.tracer, this.processFactory);
        this._register(this.pluginManager.onDidUpdateConfig(update => {
            this.configurePlugin(update.pluginId, update.config);
        }));
        this._register(this.pluginManager.onDidChangePlugins(() => {
            this.restartTsServer();
        }));
    }
    get capabilities() {
        if (this._configuration.useSyntaxServer === 1 /* Always */) {
            return new typescriptService_1.ClientCapabilities(typescriptService_1.ClientCapability.Syntax, typescriptService_1.ClientCapability.EnhancedSyntax);
        }
        if ((0, platform_1.isWeb)()) {
            return new typescriptService_1.ClientCapabilities(typescriptService_1.ClientCapability.Syntax, typescriptService_1.ClientCapability.EnhancedSyntax);
        }
        if (this.apiVersion.gte(api_1.default.v400)) {
            return new typescriptService_1.ClientCapabilities(typescriptService_1.ClientCapability.Syntax, typescriptService_1.ClientCapability.EnhancedSyntax, typescriptService_1.ClientCapability.Semantic);
        }
        return new typescriptService_1.ClientCapabilities(typescriptService_1.ClientCapability.Syntax, typescriptService_1.ClientCapability.Semantic);
    }
    cancelInflightRequestsForResource(resource) {
        if (this.serverState.type !== 1 /* Running */) {
            return;
        }
        for (const request of this.serverState.toCancelOnResourceChange) {
            if (request.resource.toString() === resource.toString()) {
                request.cancel();
            }
        }
    }
    get configuration() {
        return this._configuration;
    }
    dispose() {
        super.dispose();
        this.bufferSyncSupport.dispose();
        if (this.serverState.type === 1 /* Running */) {
            this.serverState.server.kill();
        }
        this.loadingIndicator.reset();
    }
    restartTsServer() {
        if (this.serverState.type === 1 /* Running */) {
            this.info('Killing TS Server');
            this.isRestarting = true;
            this.serverState.server.kill();
        }
        this.serverState = this.startService(true);
    }
    get apiVersion() {
        if (this.serverState.type === 1 /* Running */) {
            return this.serverState.apiVersion;
        }
        return api_1.default.defaultVersion;
    }
    onReady(f) {
        return this._onReady.promise.then(f);
    }
    info(message, data) {
        this.logger.info(message, data);
    }
    error(message, data) {
        this.logger.error(message, data);
    }
    logTelemetry(eventName, properties) {
        this.telemetryReporter.logTelemetry(eventName, properties);
    }
    service() {
        if (this.serverState.type === 1 /* Running */) {
            return this.serverState;
        }
        if (this.serverState.type === 2 /* Errored */) {
            throw this.serverState.error;
        }
        const newState = this.startService();
        if (newState.type === 1 /* Running */) {
            return newState;
        }
        throw new Error(`Could not create TS service. Service state:${JSON.stringify(newState)}`);
    }
    ensureServiceStarted() {
        if (this.serverState.type !== 1 /* Running */) {
            this.startService();
        }
    }
    startService(resendModels = false) {
        this.info(`Starting TS Server `);
        if (this.isDisposed) {
            this.info(`Not starting server. Disposed `);
            return ServerState.None;
        }
        if (this.hasServerFatallyCrashedTooManyTimes) {
            this.info(`Not starting server. Too many crashes.`);
            return ServerState.None;
        }
        let version = this._versionManager.currentVersion;
        if (!version.isValid) {
            vscode.window.showWarningMessage(localize('noServerFound', 'The path {0} doesn\'t point to a valid tsserver install. Falling back to bundled TypeScript version.', version.path));
            this._versionManager.reset();
            version = this._versionManager.currentVersion;
        }
        this.info(`Using tsserver from: ${version.path}`);
        const apiVersion = version.apiVersion || api_1.default.defaultVersion;
        const mytoken = ++this.token;
        const handle = this.typescriptServerSpawner.spawn(version, this.capabilities, this.configuration, this.pluginManager, this.cancellerFactory, {
            onFatalError: (command, err) => this.fatalError(command, err),
        });
        this.serverState = new ServerState.Running(handle, apiVersion, undefined, true);
        this.lastStart = Date.now();
        /* __GDPR__
            "tsserver.spawned" : {
                "${include}": [
                    "${TypeScriptCommonProperties}"
                ],
                "localTypeScriptVersion": { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
                "typeScriptVersionSource": { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
            }
        */
        this.logTelemetry('tsserver.spawned', {
            localTypeScriptVersion: this.versionProvider.localVersion ? this.versionProvider.localVersion.displayName : '',
            typeScriptVersionSource: version.source,
        });
        handle.onError((err) => {
            if (this.token !== mytoken) {
                // this is coming from an old process
                return;
            }
            if (err) {
                vscode.window.showErrorMessage(localize('serverExitedWithError', 'TypeScript language server exited with error. Error message is: {0}', err.message || err.name));
            }
            this.serverState = new ServerState.Errored(err, handle.tsServerLogFile);
            this.error('TSServer errored with error.', err);
            if (handle.tsServerLogFile) {
                this.error(`TSServer log file: ${handle.tsServerLogFile}`);
            }
            /* __GDPR__
                "tsserver.error" : {
                    "${include}": [
                        "${TypeScriptCommonProperties}"
                    ]
                }
            */
            this.logTelemetry('tsserver.error');
            this.serviceExited(false);
        });
        handle.onExit((data) => {
            if (this.token !== mytoken) {
                // this is coming from an old process
                return;
            }
            const { code, signal } = data;
            if (code === null || typeof code === 'undefined') {
                this.info(`TSServer exited. Signal: ${signal}`);
            }
            else {
                // In practice, the exit code is an integer with no ties to any identity,
                // so it can be classified as SystemMetaData, rather than CallstackOrException.
                this.error(`TSServer exited with code: ${code}. Signal: ${signal}`);
                /* __GDPR__
                    "tsserver.exitWithCode" : {
                        "code" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth" },
                        "signal" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth" },
                        "${include}": [
                            "${TypeScriptCommonProperties}"
                        ]
                    }
                */
                this.logTelemetry('tsserver.exitWithCode', { code, signal: signal ?? undefined });
            }
            if (handle.tsServerLogFile) {
                this.info(`TSServer log file: ${handle.tsServerLogFile}`);
            }
            this.serviceExited(!this.isRestarting);
            this.isRestarting = false;
        });
        handle.onEvent(event => this.dispatchEvent(event));
        if (apiVersion.gte(api_1.default.v300) && this.capabilities.has(typescriptService_1.ClientCapability.Semantic)) {
            this.loadingIndicator.startedLoadingProject(undefined /* projectName */);
        }
        this.serviceStarted(resendModels);
        this._onReady.resolve();
        this._onTsServerStarted.fire({ version: version, usedApiVersion: apiVersion });
        this._onDidChangeCapabilities.fire();
        return this.serverState;
    }
    async showVersionPicker() {
        this._versionManager.promptUserForVersion();
    }
    async openTsServerLogFile() {
        if (this._configuration.tsServerLogLevel === configuration_1.TsServerLogLevel.Off) {
            vscode.window.showErrorMessage(localize('typescript.openTsServerLog.loggingNotEnabled', 'TS Server logging is off. Please set `typescript.tsserver.log` and restart the TS server to enable logging'), {
                title: localize('typescript.openTsServerLog.enableAndReloadOption', 'Enable logging and restart TS server'),
            })
                .then(selection => {
                if (selection) {
                    return vscode.workspace.getConfiguration().update('typescript.tsserver.log', 'verbose', true).then(() => {
                        this.restartTsServer();
                    });
                }
                return undefined;
            });
            return false;
        }
        if (this.serverState.type !== 1 /* Running */ || !this.serverState.server.tsServerLogFile) {
            vscode.window.showWarningMessage(localize('typescript.openTsServerLog.noLogFile', 'TS Server has not started logging.'));
            return false;
        }
        try {
            const doc = await vscode.workspace.openTextDocument(vscode.Uri.file(this.serverState.server.tsServerLogFile));
            await vscode.window.showTextDocument(doc);
            return true;
        }
        catch {
            // noop
        }
        try {
            await vscode.commands.executeCommand('revealFileInOS', vscode.Uri.file(this.serverState.server.tsServerLogFile));
            return true;
        }
        catch {
            vscode.window.showWarningMessage(localize('openTsServerLog.openFileFailedFailed', 'Could not open TS Server log file'));
            return false;
        }
    }
    serviceStarted(resendModels) {
        this.bufferSyncSupport.reset();
        const watchOptions = this.apiVersion.gte(api_1.default.v380)
            ? this.configuration.watchOptions
            : undefined;
        const configureOptions = {
            hostInfo: 'vscode',
            preferences: {
                providePrefixAndSuffixTextForRename: true,
                allowRenameOfImportPath: true,
                includePackageJsonAutoImports: this._configuration.includePackageJsonAutoImports,
            },
            watchOptions
        };
        this.executeWithoutWaitingForResponse('configure', configureOptions);
        this.setCompilerOptionsForInferredProjects(this._configuration);
        if (resendModels) {
            this._onResendModelsRequested.fire();
            this.bufferSyncSupport.reinitialize();
            this.bufferSyncSupport.requestAllDiagnostics();
        }
        // Reconfigure any plugins
        for (const [config, pluginName] of this.pluginManager.configurations()) {
            this.configurePlugin(config, pluginName);
        }
    }
    setCompilerOptionsForInferredProjects(configuration) {
        const args = {
            options: this.getCompilerOptionsForInferredProjects(configuration)
        };
        this.executeWithoutWaitingForResponse('compilerOptionsForInferredProjects', args);
    }
    getCompilerOptionsForInferredProjects(configuration) {
        return {
            ...(0, tsconfig_1.inferredProjectCompilerOptions)(0 /* TypeScript */, configuration),
            allowJs: true,
            allowSyntheticDefaultImports: true,
            allowNonTsExtensions: true,
            resolveJsonModule: true,
        };
    }
    serviceExited(restart) {
        this.loadingIndicator.reset();
        const previousState = this.serverState;
        this.serverState = ServerState.None;
        if (restart) {
            const diff = Date.now() - this.lastStart;
            this.numberRestarts++;
            let startService = true;
            const reportIssueItem = {
                title: localize('serverDiedReportIssue', 'Report Issue'),
            };
            let prompt = undefined;
            if (this.numberRestarts > 5) {
                this.numberRestarts = 0;
                if (diff < 10 * 1000 /* 10 seconds */) {
                    this.lastStart = Date.now();
                    startService = false;
                    this.hasServerFatallyCrashedTooManyTimes = true;
                    prompt = vscode.window.showErrorMessage(localize('serverDiedAfterStart', 'The TypeScript language service died 5 times right after it got started. The service will not be restarted.'), reportIssueItem);
                    /* __GDPR__
                        "serviceExited" : {
                            "${include}": [
                                "${TypeScriptCommonProperties}"
                            ]
                        }
                    */
                    this.logTelemetry('serviceExited');
                }
                else if (diff < 60 * 1000 * 5 /* 5 Minutes */) {
                    this.lastStart = Date.now();
                    prompt = vscode.window.showWarningMessage(localize('serverDied', 'The TypeScript language service died unexpectedly 5 times in the last 5 Minutes.'), reportIssueItem);
                }
            }
            else if (['vscode-insiders', 'code-oss'].includes(vscode.env.uriScheme)) {
                // Prompt after a single restart
                if (!this._isPromptingAfterCrash && previousState.type === 2 /* Errored */ && previousState.error instanceof serverError_1.TypeScriptServerError) {
                    this.numberRestarts = 0;
                    this._isPromptingAfterCrash = true;
                    prompt = vscode.window.showWarningMessage(localize('serverDiedOnce', 'The TypeScript language service died unexpectedly.'), reportIssueItem);
                }
            }
            prompt?.then(item => {
                this._isPromptingAfterCrash = false;
                if (item === reportIssueItem) {
                    const minModernTsVersion = this.versionProvider.bundledVersion.apiVersion;
                    if (minModernTsVersion && this.apiVersion.lt(minModernTsVersion)) {
                        vscode.window.showWarningMessage(localize('usingOldTsVersion.title', 'Please update your TypeScript version'), {
                            modal: true,
                            detail: localize('usingOldTsVersion.detail', 'The workspace is using an old version of TypeScript ({0}).\n\nBefore reporting an issue, please update the workspace to use the latest stable TypeScript release to make sure the bug has not already been fixed.', previousState.type === 2 /* Errored */ && previousState.error instanceof serverError_1.TypeScriptServerError ? previousState.error.version.apiVersion?.displayName : undefined),
                            useCustom: true
                        });
                    }
                    else {
                        const args = previousState.type === 2 /* Errored */ && previousState.error instanceof serverError_1.TypeScriptServerError
                            ? getReportIssueArgsForError(previousState.error, previousState.tsServerLogFile)
                            : undefined;
                        vscode.commands.executeCommand('workbench.action.openIssueReporter', args);
                    }
                }
            });
            if (startService) {
                this.startService(true);
            }
        }
    }
    normalizedPath(resource) {
        if (fileSchemes.disabledSchemes.has(resource.scheme)) {
            return undefined;
        }
        switch (resource.scheme) {
            case fileSchemes.file:
                {
                    let result = resource.fsPath;
                    if (!result) {
                        return undefined;
                    }
                    result = path.normalize(result);
                    // Both \ and / must be escaped in regular expressions
                    return result.replace(new RegExp('\\' + this.pathSeparator, 'g'), '/');
                }
            default:
                {
                    return this.inMemoryResourcePrefix + '/' + resource.scheme
                        + (resource.path.startsWith('/') ? resource.path : '/' + resource.path)
                        + (resource.fragment ? '#' + resource.fragment : '');
                }
        }
    }
    toPath(resource) {
        return this.normalizedPath(resource);
    }
    toOpenedFilePath(document, options = {}) {
        if (!this.bufferSyncSupport.ensureHasBuffer(document.uri)) {
            if (!options.suppressAlertOnFailure && !fileSchemes.disabledSchemes.has(document.uri.scheme)) {
                console.error(`Unexpected resource ${document.uri}`);
            }
            return undefined;
        }
        return this.toPath(document.uri);
    }
    hasCapabilityForResource(resource, capability) {
        if (!this.capabilities.has(capability)) {
            return false;
        }
        switch (capability) {
            case typescriptService_1.ClientCapability.Semantic:
                {
                    return fileSchemes.semanticSupportedSchemes.includes(resource.scheme);
                }
            case typescriptService_1.ClientCapability.Syntax:
            case typescriptService_1.ClientCapability.EnhancedSyntax:
                {
                    return true;
                }
        }
    }
    toResource(filepath) {
        if ((0, platform_1.isWeb)()) {
            // On web, the stdlib paths that TS return look like: '/lib.es2015.collection.d.ts'
            if (filepath.startsWith('/lib.') && filepath.endsWith('.d.ts')) {
                return vscode.Uri.joinPath(this.context.extensionUri, 'dist', 'browser', 'typescript', filepath.slice(1));
            }
        }
        if (filepath.startsWith(this.inMemoryResourcePrefix)) {
            const parts = filepath.match(/^\^\/([^\/]+)\/(.+)$/);
            if (parts) {
                const resource = vscode.Uri.parse(parts[1] + ':' + parts[2]);
                return this.bufferSyncSupport.toVsCodeResource(resource);
            }
        }
        return this.bufferSyncSupport.toResource(filepath);
    }
    getWorkspaceRootForResource(resource) {
        const roots = vscode.workspace.workspaceFolders ? Array.from(vscode.workspace.workspaceFolders) : undefined;
        if (!roots || !roots.length) {
            return undefined;
        }
        switch (resource.scheme) {
            case fileSchemes.file:
            case fileSchemes.untitled:
            case fileSchemes.vscodeNotebookCell:
            case fileSchemes.memFs:
            case fileSchemes.vscodeVfs:
                for (const root of roots.sort((a, b) => a.uri.fsPath.length - b.uri.fsPath.length)) {
                    if (resource.fsPath.startsWith(root.uri.fsPath + path.sep)) {
                        return root.uri.fsPath;
                    }
                }
                return roots[0].uri.fsPath;
            default:
                return undefined;
        }
    }
    execute(command, args, token, config) {
        let executions;
        if (config?.cancelOnResourceChange) {
            const runningServerState = this.service();
            const source = new vscode.CancellationTokenSource();
            token.onCancellationRequested(() => source.cancel());
            const inFlight = {
                resource: config.cancelOnResourceChange,
                cancel: () => source.cancel(),
            };
            runningServerState.toCancelOnResourceChange.add(inFlight);
            executions = this.executeImpl(command, args, {
                isAsync: false,
                token: source.token,
                expectsResult: true,
                ...config,
            });
            executions[0].finally(() => {
                runningServerState.toCancelOnResourceChange.delete(inFlight);
                source.dispose();
            });
        }
        else {
            executions = this.executeImpl(command, args, {
                isAsync: false,
                token,
                expectsResult: true,
                ...config,
            });
        }
        if (config?.nonRecoverable) {
            executions[0].catch(err => this.fatalError(command, err));
        }
        if (command === 'updateOpen') {
            // If update open has completed, consider that the project has loaded
            Promise.all(executions).then(() => {
                this.loadingIndicator.reset();
            });
        }
        return executions[0];
    }
    executeWithoutWaitingForResponse(command, args) {
        this.executeImpl(command, args, {
            isAsync: false,
            token: undefined,
            expectsResult: false
        });
    }
    executeAsync(command, args, token) {
        return this.executeImpl(command, args, {
            isAsync: true,
            token,
            expectsResult: true
        })[0];
    }
    executeImpl(command, args, executeInfo) {
        this.bufferSyncSupport.beforeCommand(command);
        const runningServerState = this.service();
        return runningServerState.server.executeImpl(command, args, executeInfo);
    }
    interruptGetErr(f) {
        return this.bufferSyncSupport.interruptGetErr(f);
    }
    fatalError(command, error) {
        /* __GDPR__
            "fatalError" : {
                "${include}": [
                    "${TypeScriptCommonProperties}",
                    "${TypeScriptRequestErrorProperties}"
                ],
                "command" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
            }
        */
        this.logTelemetry('fatalError', { ...(error instanceof serverError_1.TypeScriptServerError ? error.telemetry : { command }) });
        console.error(`A non-recoverable error occurred while executing tsserver command: ${command}`);
        if (error instanceof serverError_1.TypeScriptServerError && error.serverErrorText) {
            console.error(error.serverErrorText);
        }
        if (this.serverState.type === 1 /* Running */) {
            this.info('Killing TS Server');
            const logfile = this.serverState.server.tsServerLogFile;
            this.serverState.server.kill();
            if (error instanceof serverError_1.TypeScriptServerError) {
                this.serverState = new ServerState.Errored(error, logfile);
            }
        }
    }
    dispatchEvent(event) {
        switch (event.event) {
            case protocol_const_1.EventName.syntaxDiag:
            case protocol_const_1.EventName.semanticDiag:
            case protocol_const_1.EventName.suggestionDiag:
                // This event also roughly signals that projects have been loaded successfully (since the TS server is synchronous)
                this.loadingIndicator.reset();
                const diagnosticEvent = event;
                if (diagnosticEvent.body && diagnosticEvent.body.diagnostics) {
                    this._onDiagnosticsReceived.fire({
                        kind: getDignosticsKind(event),
                        resource: this.toResource(diagnosticEvent.body.file),
                        diagnostics: diagnosticEvent.body.diagnostics
                    });
                }
                break;
            case protocol_const_1.EventName.configFileDiag:
                this._onConfigDiagnosticsReceived.fire(event);
                break;
            case protocol_const_1.EventName.telemetry:
                {
                    const body = event.body;
                    this.dispatchTelemetryEvent(body);
                    break;
                }
            case protocol_const_1.EventName.projectLanguageServiceState:
                {
                    const body = event.body;
                    if (this.serverState.type === 1 /* Running */) {
                        this.serverState.updateLanguageServiceEnabled(body.languageServiceEnabled);
                    }
                    this._onProjectLanguageServiceStateChanged.fire(body);
                    break;
                }
            case protocol_const_1.EventName.projectsUpdatedInBackground:
                this.loadingIndicator.reset();
                const body = event.body;
                const resources = body.openFiles.map(file => this.toResource(file));
                this.bufferSyncSupport.getErr(resources);
                break;
            case protocol_const_1.EventName.beginInstallTypes:
                this._onDidBeginInstallTypings.fire(event.body);
                break;
            case protocol_const_1.EventName.endInstallTypes:
                this._onDidEndInstallTypings.fire(event.body);
                break;
            case protocol_const_1.EventName.typesInstallerInitializationFailed:
                this._onTypesInstallerInitializationFailed.fire(event.body);
                break;
            case protocol_const_1.EventName.surveyReady:
                this._onSurveyReady.fire(event.body);
                break;
            case protocol_const_1.EventName.projectLoadingStart:
                this.loadingIndicator.startedLoadingProject(event.body.projectName);
                break;
            case protocol_const_1.EventName.projectLoadingFinish:
                this.loadingIndicator.finishedLoadingProject(event.body.projectName);
                break;
        }
    }
    dispatchTelemetryEvent(telemetryData) {
        const properties = Object.create(null);
        switch (telemetryData.telemetryEventName) {
            case 'typingsInstalled':
                const typingsInstalledPayload = telemetryData.payload;
                properties['installedPackages'] = typingsInstalledPayload.installedPackages;
                if (typeof typingsInstalledPayload.installSuccess === 'boolean') {
                    properties['installSuccess'] = typingsInstalledPayload.installSuccess.toString();
                }
                if (typeof typingsInstalledPayload.typingsInstallerVersion === 'string') {
                    properties['typingsInstallerVersion'] = typingsInstalledPayload.typingsInstallerVersion;
                }
                break;
            default:
                const payload = telemetryData.payload;
                if (payload) {
                    Object.keys(payload).forEach((key) => {
                        try {
                            if (payload.hasOwnProperty(key)) {
                                properties[key] = typeof payload[key] === 'string' ? payload[key] : JSON.stringify(payload[key]);
                            }
                        }
                        catch (e) {
                            // noop
                        }
                    });
                }
                break;
        }
        if (telemetryData.telemetryEventName === 'projectInfo') {
            if (this.serverState.type === 1 /* Running */) {
                this.serverState.updateTsserverVersion(properties['version']);
            }
        }
        /* __GDPR__
            "typingsInstalled" : {
                "installedPackages" : { "classification": "PublicNonPersonalData", "purpose": "FeatureInsight" },
                "installSuccess": { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth" },
                "typingsInstallerVersion": { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth" },
                "${include}": [
                    "${TypeScriptCommonProperties}"
                ]
            }
        */
        // __GDPR__COMMENT__: Other events are defined by TypeScript.
        this.logTelemetry(telemetryData.telemetryEventName, properties);
    }
    configurePlugin(pluginName, configuration) {
        if (this.apiVersion.gte(api_1.default.v314)) {
            this.executeWithoutWaitingForResponse('configurePlugin', { pluginName, configuration });
        }
    }
}
exports.default = TypeScriptServiceClient;
function getReportIssueArgsForError(error, logPath) {
    if (!error.serverStack || !error.serverMessage) {
        return undefined;
    }
    // Note these strings are intentionally not localized
    // as we want users to file issues in english
    const sections = [
        `❗️❗️❗️ Please fill in the sections below to help us diagnose the issue ❗️❗️❗️`,
        `**TypeScript Version:** ${error.version.apiVersion?.fullVersionString}`,
        `**Steps to reproduce crash**

1.
2.
3.`,
    ];
    if (logPath) {
        sections.push(`**TS Server Log**

❗️ Please review and upload this log file to help us diagnose this crash:

\`${logPath}\`

The log file may contain personal data, including full paths and source code from your workspace. You can scrub the log file to remove paths or other personal information.
`);
    }
    else {
        sections.push(`**TS Server Log**

❗️Server logging disabled. To help us fix crashes like this, please enable logging by setting:

\`\`\`json
"typescript.tsserver.log": "verbose"
\`\`\`

After enabling this setting, future crash reports will include the server log.`);
    }
    sections.push(`**TS Server Error Stack**

Server: \`${error.serverId}\`

\`\`\`
${error.serverStack}
\`\`\``);
    return {
        extensionId: 'vscode.typescript-language-features',
        issueTitle: `TS Server fatal error:  ${error.serverMessage}`,
        issueBody: sections.join('\n\n')
    };
}
function getDignosticsKind(event) {
    switch (event.event) {
        case 'syntaxDiag': return 0 /* Syntax */;
        case 'semanticDiag': return 1 /* Semantic */;
        case 'suggestionDiag': return 2 /* Suggestion */;
    }
    throw new Error('Unknown dignostics kind');
}
class ServerInitializingIndicator extends dispose_1.Disposable {
    reset() {
        if (this._task) {
            this._task.reject();
            this._task = undefined;
        }
    }
    /**
     * Signal that a project has started loading.
     */
    startedLoadingProject(projectName) {
        // TS projects are loaded sequentially. Cancel existing task because it should always be resolved before
        // the incoming project loading task is.
        this.reset();
        vscode.window.withProgress({
            location: vscode.ProgressLocation.Window,
            title: localize('serverLoading.progress', "Initializing JS/TS language features"),
        }, () => new Promise((resolve, reject) => {
            this._task = { project: projectName, resolve, reject };
        }));
    }
    finishedLoadingProject(projectName) {
        if (this._task && this._task.project === projectName) {
            this._task.resolve();
            this._task = undefined;
        }
    }
}
//# sourceMappingURL=typescriptServiceClient.js.map