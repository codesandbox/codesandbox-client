"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseServiceConfigurationProvider = exports.areServiceConfigurationsEqual = exports.ImplicitProjectConfiguration = exports.TsServerLogLevel = void 0;
const vscode = require("vscode");
const objects = require("../utils/objects");
var TsServerLogLevel;
(function (TsServerLogLevel) {
    TsServerLogLevel[TsServerLogLevel["Off"] = 0] = "Off";
    TsServerLogLevel[TsServerLogLevel["Normal"] = 1] = "Normal";
    TsServerLogLevel[TsServerLogLevel["Terse"] = 2] = "Terse";
    TsServerLogLevel[TsServerLogLevel["Verbose"] = 3] = "Verbose";
})(TsServerLogLevel = exports.TsServerLogLevel || (exports.TsServerLogLevel = {}));
(function (TsServerLogLevel) {
    function fromString(value) {
        switch (value && value.toLowerCase()) {
            case 'normal':
                return TsServerLogLevel.Normal;
            case 'terse':
                return TsServerLogLevel.Terse;
            case 'verbose':
                return TsServerLogLevel.Verbose;
            case 'off':
            default:
                return TsServerLogLevel.Off;
        }
    }
    TsServerLogLevel.fromString = fromString;
    function toString(value) {
        switch (value) {
            case TsServerLogLevel.Normal:
                return 'normal';
            case TsServerLogLevel.Terse:
                return 'terse';
            case TsServerLogLevel.Verbose:
                return 'verbose';
            case TsServerLogLevel.Off:
            default:
                return 'off';
        }
    }
    TsServerLogLevel.toString = toString;
})(TsServerLogLevel = exports.TsServerLogLevel || (exports.TsServerLogLevel = {}));
class ImplicitProjectConfiguration {
    constructor(configuration) {
        this.checkJs = ImplicitProjectConfiguration.readCheckJs(configuration);
        this.experimentalDecorators = ImplicitProjectConfiguration.readExperimentalDecorators(configuration);
        this.strictNullChecks = ImplicitProjectConfiguration.readImplicitStrictNullChecks(configuration);
        this.strictFunctionTypes = ImplicitProjectConfiguration.readImplicitStrictFunctionTypes(configuration);
    }
    isEqualTo(other) {
        return objects.equals(this, other);
    }
    static readCheckJs(configuration) {
        return configuration.get('js/ts.implicitProjectConfig.checkJs')
            ?? configuration.get('javascript.implicitProjectConfig.checkJs', false);
    }
    static readExperimentalDecorators(configuration) {
        return configuration.get('js/ts.implicitProjectConfig.experimentalDecorators')
            ?? configuration.get('javascript.implicitProjectConfig.experimentalDecorators', false);
    }
    static readImplicitStrictNullChecks(configuration) {
        return configuration.get('js/ts.implicitProjectConfig.strictNullChecks', false);
    }
    static readImplicitStrictFunctionTypes(configuration) {
        return configuration.get('js/ts.implicitProjectConfig.strictFunctionTypes', true);
    }
}
exports.ImplicitProjectConfiguration = ImplicitProjectConfiguration;
function areServiceConfigurationsEqual(a, b) {
    return objects.equals(a, b);
}
exports.areServiceConfigurationsEqual = areServiceConfigurationsEqual;
class BaseServiceConfigurationProvider {
    loadFromWorkspace() {
        const configuration = vscode.workspace.getConfiguration();
        return {
            locale: this.extractLocale(configuration),
            globalTsdk: this.extractGlobalTsdk(configuration),
            localTsdk: this.extractLocalTsdk(configuration),
            npmLocation: this.readNpmLocation(configuration),
            tsServerLogLevel: this.readTsServerLogLevel(configuration),
            tsServerPluginPaths: this.readTsServerPluginPaths(configuration),
            implicitProjectConfiguration: new ImplicitProjectConfiguration(configuration),
            disableAutomaticTypeAcquisition: this.readDisableAutomaticTypeAcquisition(configuration),
            useSyntaxServer: this.readUseSyntaxServer(configuration),
            enableProjectDiagnostics: this.readEnableProjectDiagnostics(configuration),
            maxTsServerMemory: this.readMaxTsServerMemory(configuration),
            enablePromptUseWorkspaceTsdk: this.readEnablePromptUseWorkspaceTsdk(configuration),
            watchOptions: this.readWatchOptions(configuration),
            includePackageJsonAutoImports: this.readIncludePackageJsonAutoImports(configuration),
            enableTsServerTracing: this.readEnableTsServerTracing(configuration),
        };
    }
    readTsServerLogLevel(configuration) {
        const setting = configuration.get('typescript.tsserver.log', 'off');
        return TsServerLogLevel.fromString(setting);
    }
    readTsServerPluginPaths(configuration) {
        return configuration.get('typescript.tsserver.pluginPaths', []);
    }
    readNpmLocation(configuration) {
        return configuration.get('typescript.npm', null);
    }
    readDisableAutomaticTypeAcquisition(configuration) {
        return configuration.get('typescript.disableAutomaticTypeAcquisition', false);
    }
    extractLocale(configuration) {
        return configuration.get('typescript.locale', null);
    }
    readUseSyntaxServer(configuration) {
        const value = configuration.get('typescript.tsserver.useSyntaxServer');
        switch (value) {
            case 'never': return 0 /* Never */;
            case 'always': return 1 /* Always */;
            case 'auto': return 2 /* Auto */;
        }
        // Fallback to deprecated setting
        const deprecatedValue = configuration.get('typescript.tsserver.useSeparateSyntaxServer', true);
        if (deprecatedValue === 'forAllRequests') { // Undocumented setting
            return 1 /* Always */;
        }
        if (deprecatedValue === true) {
            return 2 /* Auto */;
        }
        return 0 /* Never */;
    }
    readEnableProjectDiagnostics(configuration) {
        return configuration.get('typescript.tsserver.experimental.enableProjectDiagnostics', false);
    }
    readWatchOptions(configuration) {
        return configuration.get('typescript.tsserver.watchOptions');
    }
    readIncludePackageJsonAutoImports(configuration) {
        return configuration.get('typescript.preferences.includePackageJsonAutoImports');
    }
    readMaxTsServerMemory(configuration) {
        const defaultMaxMemory = 3072;
        const minimumMaxMemory = 128;
        const memoryInMB = configuration.get('typescript.tsserver.maxTsServerMemory', defaultMaxMemory);
        if (!Number.isSafeInteger(memoryInMB)) {
            return defaultMaxMemory;
        }
        return Math.max(memoryInMB, minimumMaxMemory);
    }
    readEnablePromptUseWorkspaceTsdk(configuration) {
        return configuration.get('typescript.enablePromptUseWorkspaceTsdk', false);
    }
    readEnableTsServerTracing(configuration) {
        return configuration.get('typescript.tsserver.enableTracing', false);
    }
}
exports.BaseServiceConfigurationProvider = BaseServiceConfigurationProvider;
//# sourceMappingURL=configuration.js.map