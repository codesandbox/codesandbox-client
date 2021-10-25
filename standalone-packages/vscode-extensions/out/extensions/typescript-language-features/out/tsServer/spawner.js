"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeScriptServerSpawner = void 0;
const path = require("path");
const vscode = require("vscode");
const typescriptService_1 = require("../typescriptService");
const api_1 = require("../utils/api");
const configuration_1 = require("../utils/configuration");
const platform_1 = require("../utils/platform");
const server_1 = require("./server");
class TypeScriptServerSpawner {
    constructor(_versionProvider, _versionManager, _logDirectoryProvider, _pluginPathsProvider, _logger, _telemetryReporter, _tracer, _factory) {
        this._versionProvider = _versionProvider;
        this._versionManager = _versionManager;
        this._logDirectoryProvider = _logDirectoryProvider;
        this._pluginPathsProvider = _pluginPathsProvider;
        this._logger = _logger;
        this._telemetryReporter = _telemetryReporter;
        this._tracer = _tracer;
        this._factory = _factory;
    }
    spawn(version, capabilities, configuration, pluginManager, cancellerFactory, delegate) {
        let primaryServer;
        const serverType = this.getCompositeServerType(version, capabilities, configuration);
        const shouldUseSeparateDiagnosticsServer = this.shouldUseSeparateDiagnosticsServer(configuration);
        switch (serverType) {
            case 1 /* SeparateSyntax */:
            case 2 /* DynamicSeparateSyntax */:
                {
                    const enableDynamicRouting = !shouldUseSeparateDiagnosticsServer && serverType === 2 /* DynamicSeparateSyntax */;
                    primaryServer = new server_1.SyntaxRoutingTsServer({
                        syntax: this.spawnTsServer("syntax" /* Syntax */, version, configuration, pluginManager, cancellerFactory),
                        semantic: this.spawnTsServer("semantic" /* Semantic */, version, configuration, pluginManager, cancellerFactory),
                    }, delegate, enableDynamicRouting);
                    break;
                }
            case 0 /* Single */:
                {
                    primaryServer = this.spawnTsServer("main" /* Main */, version, configuration, pluginManager, cancellerFactory);
                    break;
                }
            case 3 /* SyntaxOnly */:
                {
                    primaryServer = this.spawnTsServer("syntax" /* Syntax */, version, configuration, pluginManager, cancellerFactory);
                    break;
                }
        }
        if (shouldUseSeparateDiagnosticsServer) {
            return new server_1.GetErrRoutingTsServer({
                getErr: this.spawnTsServer("diagnostics" /* Diagnostics */, version, configuration, pluginManager, cancellerFactory),
                primary: primaryServer,
            }, delegate);
        }
        return primaryServer;
    }
    getCompositeServerType(version, capabilities, configuration) {
        if (!capabilities.has(typescriptService_1.ClientCapability.Semantic)) {
            return 3 /* SyntaxOnly */;
        }
        switch (configuration.useSyntaxServer) {
            case 1 /* Always */:
                return 3 /* SyntaxOnly */;
            case 0 /* Never */:
                return 0 /* Single */;
            case 2 /* Auto */:
                if (version.apiVersion?.gte(api_1.default.v340)) {
                    return version.apiVersion?.gte(api_1.default.v400)
                        ? 2 /* DynamicSeparateSyntax */
                        : 1 /* SeparateSyntax */;
                }
                return 0 /* Single */;
        }
    }
    shouldUseSeparateDiagnosticsServer(configuration) {
        return configuration.enableProjectDiagnostics;
    }
    spawnTsServer(kind, version, configuration, pluginManager, cancellerFactory) {
        const apiVersion = version.apiVersion || api_1.default.defaultVersion;
        const canceller = cancellerFactory.create(kind, this._tracer);
        const { args, tsServerLogFile, tsServerTraceDirectory } = this.getTsServerArgs(kind, configuration, version, apiVersion, pluginManager, canceller.cancellationPipeName);
        if (TypeScriptServerSpawner.isLoggingEnabled(configuration)) {
            if (tsServerLogFile) {
                this._logger.info(`<${kind}> Log file: ${tsServerLogFile}`);
            }
            else {
                this._logger.error(`<${kind}> Could not create log directory`);
            }
        }
        if (configuration.enableTsServerTracing) {
            if (tsServerTraceDirectory) {
                this._logger.info(`<${kind}> Trace directory: ${tsServerTraceDirectory}`);
            }
            else {
                this._logger.error(`<${kind}> Could not create trace directory`);
            }
        }
        this._logger.info(`<${kind}> Forking...`);
        const process = this._factory.fork(version.tsServerPath, args, kind, configuration, this._versionManager);
        this._logger.info(`<${kind}> Starting...`);
        return new server_1.ProcessBasedTsServer(kind, this.kindToServerType(kind), process, tsServerLogFile, canceller, version, this._telemetryReporter, this._tracer);
    }
    kindToServerType(kind) {
        switch (kind) {
            case "syntax" /* Syntax */:
                return typescriptService_1.ServerType.Syntax;
            case "main" /* Main */:
            case "semantic" /* Semantic */:
            case "diagnostics" /* Diagnostics */:
            default:
                return typescriptService_1.ServerType.Semantic;
        }
    }
    getTsServerArgs(kind, configuration, currentVersion, apiVersion, pluginManager, cancellationPipeName) {
        const args = [];
        let tsServerLogFile;
        let tsServerTraceDirectory;
        if (kind === "syntax" /* Syntax */) {
            if (apiVersion.gte(api_1.default.v401)) {
                args.push('--serverMode', 'partialSemantic');
            }
            else {
                args.push('--syntaxOnly');
            }
        }
        if (apiVersion.gte(api_1.default.v250)) {
            args.push('--useInferredProjectPerProjectRoot');
        }
        else {
            args.push('--useSingleInferredProject');
        }
        if (configuration.disableAutomaticTypeAcquisition || kind === "syntax" /* Syntax */ || kind === "diagnostics" /* Diagnostics */) {
            args.push('--disableAutomaticTypingAcquisition');
        }
        if (kind === "semantic" /* Semantic */ || kind === "main" /* Main */) {
            args.push('--enableTelemetry');
        }
        if (cancellationPipeName) {
            args.push('--cancellationPipeName', cancellationPipeName + '*');
        }
        if (TypeScriptServerSpawner.isLoggingEnabled(configuration)) {
            if ((0, platform_1.isWeb)()) {
                args.push('--logVerbosity', configuration_1.TsServerLogLevel.toString(configuration.tsServerLogLevel));
            }
            else {
                const logDir = this._logDirectoryProvider.getNewLogDirectory();
                if (logDir) {
                    tsServerLogFile = path.join(logDir, `tsserver.log`);
                    args.push('--logVerbosity', configuration_1.TsServerLogLevel.toString(configuration.tsServerLogLevel));
                    args.push('--logFile', tsServerLogFile);
                }
            }
        }
        if (configuration.enableTsServerTracing && !(0, platform_1.isWeb)()) {
            tsServerTraceDirectory = this._logDirectoryProvider.getNewLogDirectory();
            if (tsServerTraceDirectory) {
                args.push('--traceDirectory', tsServerTraceDirectory);
            }
        }
        if (!(0, platform_1.isWeb)()) {
            const pluginPaths = this._pluginPathsProvider.getPluginPaths();
            if (pluginManager.plugins.length) {
                args.push('--globalPlugins', pluginManager.plugins.map(x => x.name).join(','));
                const isUsingBundledTypeScriptVersion = currentVersion.path === this._versionProvider.defaultVersion.path;
                for (const plugin of pluginManager.plugins) {
                    if (isUsingBundledTypeScriptVersion || plugin.enableForWorkspaceTypeScriptVersions) {
                        pluginPaths.push(plugin.path);
                    }
                }
            }
            if (pluginPaths.length !== 0) {
                args.push('--pluginProbeLocations', pluginPaths.join(','));
            }
        }
        if (configuration.npmLocation) {
            args.push('--npmLocation', `"${configuration.npmLocation}"`);
        }
        if (apiVersion.gte(api_1.default.v260)) {
            args.push('--locale', TypeScriptServerSpawner.getTsLocale(configuration));
        }
        if (apiVersion.gte(api_1.default.v291)) {
            args.push('--noGetErrOnBackgroundUpdate');
        }
        if (apiVersion.gte(api_1.default.v345)) {
            args.push('--validateDefaultNpmLocation');
        }
        return { args, tsServerLogFile, tsServerTraceDirectory };
    }
    static isLoggingEnabled(configuration) {
        return configuration.tsServerLogLevel !== configuration_1.TsServerLogLevel.Off;
    }
    static getTsLocale(configuration) {
        return configuration.locale
            ? configuration.locale
            : vscode.env.language;
    }
}
exports.TypeScriptServerSpawner = TypeScriptServerSpawner;
//# sourceMappingURL=spawner.js.map