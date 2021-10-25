"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInlayHintsPreferences = exports.InlayHintSettingNames = void 0;
const vscode = require("vscode");
const api_1 = require("../utils/api");
const dispose_1 = require("../utils/dispose");
const fileSchemes = require("../utils/fileSchemes");
const languageModeIds_1 = require("../utils/languageModeIds");
const objects_1 = require("../utils/objects");
const resourceMap_1 = require("../utils/resourceMap");
function areFileConfigurationsEqual(a, b) {
    return (0, objects_1.equals)(a, b);
}
class FileConfigurationManager extends dispose_1.Disposable {
    constructor(client, onCaseInsensitiveFileSystem) {
        super();
        this.client = client;
        this.formatOptions = new resourceMap_1.ResourceMap(undefined, { onCaseInsensitiveFileSystem });
        vscode.workspace.onDidCloseTextDocument(textDocument => {
            // When a document gets closed delete the cached formatting options.
            // This is necessary since the tsserver now closed a project when its
            // last file in it closes which drops the stored formatting options
            // as well.
            this.formatOptions.delete(textDocument.uri);
        }, undefined, this._disposables);
    }
    async ensureConfigurationForDocument(document, token) {
        const formattingOptions = this.getFormattingOptions(document);
        if (formattingOptions) {
            return this.ensureConfigurationOptions(document, formattingOptions, token);
        }
    }
    getFormattingOptions(document) {
        const editor = vscode.window.visibleTextEditors.find(editor => editor.document.fileName === document.fileName);
        return editor
            ? {
                tabSize: editor.options.tabSize,
                insertSpaces: editor.options.insertSpaces
            }
            : undefined;
    }
    async ensureConfigurationOptions(document, options, token) {
        const file = this.client.toOpenedFilePath(document);
        if (!file) {
            return;
        }
        const currentOptions = this.getFileOptions(document, options);
        const cachedOptions = this.formatOptions.get(document.uri);
        if (cachedOptions) {
            const cachedOptionsValue = await cachedOptions;
            if (cachedOptionsValue && areFileConfigurationsEqual(cachedOptionsValue, currentOptions)) {
                return;
            }
        }
        let resolve;
        this.formatOptions.set(document.uri, new Promise(r => resolve = r));
        const args = {
            file,
            ...currentOptions,
        };
        try {
            const response = await this.client.execute('configure', args, token);
            resolve(response.type === 'response' ? currentOptions : undefined);
        }
        finally {
            resolve(undefined);
        }
    }
    async setGlobalConfigurationFromDocument(document, token) {
        const formattingOptions = this.getFormattingOptions(document);
        if (!formattingOptions) {
            return;
        }
        const args = {
            file: undefined /*global*/,
            ...this.getFileOptions(document, formattingOptions),
        };
        await this.client.execute('configure', args, token);
    }
    reset() {
        this.formatOptions.clear();
    }
    getFileOptions(document, options) {
        return {
            formatOptions: this.getFormatOptions(document, options),
            preferences: this.getPreferences(document)
        };
    }
    getFormatOptions(document, options) {
        const config = vscode.workspace.getConfiguration((0, languageModeIds_1.isTypeScriptDocument)(document) ? 'typescript.format' : 'javascript.format', document.uri);
        return {
            tabSize: options.tabSize,
            indentSize: options.tabSize,
            convertTabsToSpaces: options.insertSpaces,
            // We can use \n here since the editor normalizes later on to its line endings.
            newLineCharacter: '\n',
            insertSpaceAfterCommaDelimiter: config.get('insertSpaceAfterCommaDelimiter'),
            insertSpaceAfterConstructor: config.get('insertSpaceAfterConstructor'),
            insertSpaceAfterSemicolonInForStatements: config.get('insertSpaceAfterSemicolonInForStatements'),
            insertSpaceBeforeAndAfterBinaryOperators: config.get('insertSpaceBeforeAndAfterBinaryOperators'),
            insertSpaceAfterKeywordsInControlFlowStatements: config.get('insertSpaceAfterKeywordsInControlFlowStatements'),
            insertSpaceAfterFunctionKeywordForAnonymousFunctions: config.get('insertSpaceAfterFunctionKeywordForAnonymousFunctions'),
            insertSpaceBeforeFunctionParenthesis: config.get('insertSpaceBeforeFunctionParenthesis'),
            insertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis: config.get('insertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis'),
            insertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets: config.get('insertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets'),
            insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces: config.get('insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces'),
            insertSpaceAfterOpeningAndBeforeClosingEmptyBraces: config.get('insertSpaceAfterOpeningAndBeforeClosingEmptyBraces'),
            insertSpaceAfterOpeningAndBeforeClosingTemplateStringBraces: config.get('insertSpaceAfterOpeningAndBeforeClosingTemplateStringBraces'),
            insertSpaceAfterOpeningAndBeforeClosingJsxExpressionBraces: config.get('insertSpaceAfterOpeningAndBeforeClosingJsxExpressionBraces'),
            insertSpaceAfterTypeAssertion: config.get('insertSpaceAfterTypeAssertion'),
            placeOpenBraceOnNewLineForFunctions: config.get('placeOpenBraceOnNewLineForFunctions'),
            placeOpenBraceOnNewLineForControlBlocks: config.get('placeOpenBraceOnNewLineForControlBlocks'),
            semicolons: config.get('semicolons'),
        };
    }
    getPreferences(document) {
        if (this.client.apiVersion.lt(api_1.default.v290)) {
            return {};
        }
        const config = vscode.workspace.getConfiguration((0, languageModeIds_1.isTypeScriptDocument)(document) ? 'typescript' : 'javascript', document.uri);
        const preferencesConfig = vscode.workspace.getConfiguration((0, languageModeIds_1.isTypeScriptDocument)(document) ? 'typescript.preferences' : 'javascript.preferences', document.uri);
        const preferences = {
            quotePreference: this.getQuoteStylePreference(preferencesConfig),
            importModuleSpecifierPreference: getImportModuleSpecifierPreference(preferencesConfig),
            importModuleSpecifierEnding: getImportModuleSpecifierEndingPreference(preferencesConfig),
            // @ts-expect-error until TS 4.5 protocol update
            jsxAttributeCompletionStyle: getJsxAttributeCompletionStyle(preferencesConfig),
            allowTextChangesInNewFiles: document.uri.scheme === fileSchemes.file,
            providePrefixAndSuffixTextForRename: preferencesConfig.get('renameShorthandProperties', true) === false ? false : preferencesConfig.get('useAliasesForRenames', true),
            allowRenameOfImportPath: true,
            includeAutomaticOptionalChainCompletions: config.get('suggest.includeAutomaticOptionalChainCompletions', true),
            provideRefactorNotApplicableReason: true,
            generateReturnInDocTemplate: config.get('suggest.jsdoc.generateReturns', true),
            includeCompletionsForImportStatements: config.get('suggest.includeCompletionsForImportStatements', true),
            includeCompletionsWithSnippetText: config.get('suggest.includeCompletionsWithSnippetText', true),
            allowIncompleteCompletions: true,
            displayPartsForJSDoc: true,
            ...getInlayHintsPreferences(config),
        };
        return preferences;
    }
    getQuoteStylePreference(config) {
        switch (config.get('quoteStyle')) {
            case 'single': return 'single';
            case 'double': return 'double';
            default: return this.client.apiVersion.gte(api_1.default.v333) ? 'auto' : undefined;
        }
    }
}
exports.default = FileConfigurationManager;
class InlayHintSettingNames {
}
exports.InlayHintSettingNames = InlayHintSettingNames;
InlayHintSettingNames.parameterNamesSuppressWhenArgumentMatchesName = 'inlayHints.parameterNames.suppressWhenArgumentMatchesName';
InlayHintSettingNames.parameterNamesEnabled = 'inlayHints.parameterTypes.enabled';
InlayHintSettingNames.variableTypesEnabled = 'inlayHints.variableTypes.enabled';
InlayHintSettingNames.propertyDeclarationTypesEnabled = 'inlayHints.propertyDeclarationTypes.enabled';
InlayHintSettingNames.functionLikeReturnTypesEnabled = 'inlayHints.functionLikeReturnTypes.enabled';
InlayHintSettingNames.enumMemberValuesEnabled = 'inlayHints.enumMemberValues.enabled';
function getInlayHintsPreferences(config) {
    return {
        includeInlayParameterNameHints: getInlayParameterNameHintsPreference(config),
        includeInlayParameterNameHintsWhenArgumentMatchesName: !config.get(InlayHintSettingNames.parameterNamesSuppressWhenArgumentMatchesName, true),
        includeInlayFunctionParameterTypeHints: config.get(InlayHintSettingNames.parameterNamesEnabled, false),
        includeInlayVariableTypeHints: config.get(InlayHintSettingNames.variableTypesEnabled, false),
        includeInlayPropertyDeclarationTypeHints: config.get(InlayHintSettingNames.propertyDeclarationTypesEnabled, false),
        includeInlayFunctionLikeReturnTypeHints: config.get(InlayHintSettingNames.functionLikeReturnTypesEnabled, false),
        includeInlayEnumMemberValueHints: config.get(InlayHintSettingNames.enumMemberValuesEnabled, false),
    };
}
exports.getInlayHintsPreferences = getInlayHintsPreferences;
function getInlayParameterNameHintsPreference(config) {
    switch (config.get('inlayHints.parameterNames.enabled')) {
        case 'none': return 'none';
        case 'literals': return 'literals';
        case 'all': return 'all';
        default: return undefined;
    }
}
function getImportModuleSpecifierPreference(config) {
    switch (config.get('importModuleSpecifier')) {
        case 'project-relative': return 'project-relative';
        case 'relative': return 'relative';
        case 'non-relative': return 'non-relative';
        default: return undefined;
    }
}
function getImportModuleSpecifierEndingPreference(config) {
    switch (config.get('importModuleSpecifierEnding')) {
        case 'minimal': return 'minimal';
        case 'index': return 'index';
        case 'js': return 'js';
        default: return 'auto';
    }
}
function getJsxAttributeCompletionStyle(config) {
    switch (config.get('jsxAttributeCompletionStyle')) {
        case 'braces': return 'braces';
        case 'none': return 'none';
        default: return 'auto';
    }
}
//# sourceMappingURL=fileConfigurationManager.js.map