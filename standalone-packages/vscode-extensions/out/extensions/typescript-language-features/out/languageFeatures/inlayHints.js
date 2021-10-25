"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.requireInlayHintsConfiguration = void 0;
const vscode = require("vscode");
const typescriptService_1 = require("../typescriptService");
const api_1 = require("../utils/api");
const dependentRegistration_1 = require("../utils/dependentRegistration");
const dispose_1 = require("../utils/dispose");
const typeConverters_1 = require("../utils/typeConverters");
const fileConfigurationManager_1 = require("./fileConfigurationManager");
const inlayHintSettingNames = [
    fileConfigurationManager_1.InlayHintSettingNames.parameterNamesSuppressWhenArgumentMatchesName,
    fileConfigurationManager_1.InlayHintSettingNames.parameterNamesEnabled,
    fileConfigurationManager_1.InlayHintSettingNames.variableTypesEnabled,
    fileConfigurationManager_1.InlayHintSettingNames.propertyDeclarationTypesEnabled,
    fileConfigurationManager_1.InlayHintSettingNames.functionLikeReturnTypesEnabled,
    fileConfigurationManager_1.InlayHintSettingNames.enumMemberValuesEnabled,
];
class TypeScriptInlayHintsProvider extends dispose_1.Disposable {
    constructor(modeId, languageIds, client, fileConfigurationManager) {
        super();
        this.client = client;
        this.fileConfigurationManager = fileConfigurationManager;
        this._onDidChangeInlayHints = new vscode.EventEmitter();
        this.onDidChangeInlayHints = this._onDidChangeInlayHints.event;
        this._register(vscode.workspace.onDidChangeConfiguration(e => {
            if (inlayHintSettingNames.some(settingName => e.affectsConfiguration(modeId + '.' + settingName))) {
                this._onDidChangeInlayHints.fire();
            }
        }));
        // When a JS/TS file changes, change inlay hints for all visible editors
        // since changes in one file can effect the hints the others.
        this._register(vscode.workspace.onDidChangeTextDocument(e => {
            if (languageIds.includes(e.document.languageId)) {
                this._onDidChangeInlayHints.fire();
            }
        }));
    }
    async provideInlayHints(model, range, token) {
        const filepath = this.client.toOpenedFilePath(model);
        if (!filepath) {
            return [];
        }
        const start = model.offsetAt(range.start);
        const length = model.offsetAt(range.end) - start;
        await this.fileConfigurationManager.ensureConfigurationForDocument(model, token);
        const response = await this.client.execute('provideInlayHints', { file: filepath, start, length }, token);
        if (response.type !== 'response' || !response.success || !response.body) {
            return [];
        }
        return response.body.map(hint => {
            const result = new vscode.InlayHint(hint.text, typeConverters_1.Position.fromLocation(hint.position), hint.kind && fromProtocolInlayHintKind(hint.kind));
            result.whitespaceBefore = hint.whitespaceBefore;
            result.whitespaceAfter = hint.whitespaceAfter;
            return result;
        });
    }
}
TypeScriptInlayHintsProvider.minVersion = api_1.default.v440;
function fromProtocolInlayHintKind(kind) {
    switch (kind) {
        case 'Parameter': return vscode.InlayHintKind.Parameter;
        case 'Type': return vscode.InlayHintKind.Type;
        case 'Enum': return vscode.InlayHintKind.Other;
        default: return vscode.InlayHintKind.Other;
    }
}
function requireInlayHintsConfiguration(language) {
    return new dependentRegistration_1.Condition(() => {
        const config = vscode.workspace.getConfiguration(language, null);
        const preferences = (0, fileConfigurationManager_1.getInlayHintsPreferences)(config);
        return preferences.includeInlayParameterNameHints === 'literals' ||
            preferences.includeInlayParameterNameHints === 'all' ||
            preferences.includeInlayEnumMemberValueHints ||
            preferences.includeInlayFunctionLikeReturnTypeHints ||
            preferences.includeInlayFunctionParameterTypeHints ||
            preferences.includeInlayPropertyDeclarationTypeHints ||
            preferences.includeInlayVariableTypeHints;
    }, vscode.workspace.onDidChangeConfiguration);
}
exports.requireInlayHintsConfiguration = requireInlayHintsConfiguration;
function register(selector, modeId, languageIds, client, fileConfigurationManager) {
    return (0, dependentRegistration_1.conditionalRegistration)([
        requireInlayHintsConfiguration(modeId),
        (0, dependentRegistration_1.requireMinVersion)(client, TypeScriptInlayHintsProvider.minVersion),
        (0, dependentRegistration_1.requireSomeCapability)(client, typescriptService_1.ClientCapability.Semantic),
    ], () => {
        const provider = new TypeScriptInlayHintsProvider(modeId, languageIds, client, fileConfigurationManager);
        return vscode.languages.registerInlayHintsProvider(selector.semantic, provider);
    });
}
exports.register = register;
//# sourceMappingURL=inlayHints.js.map