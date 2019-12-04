"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const api_1 = require("../utils/api");
const languageModeIds_1 = require("../utils/languageModeIds");
const resourceMap_1 = require("../utils/resourceMap");
const dispose_1 = require("../utils/dispose");
function objsAreEqual(a, b) {
    let keys = Object.keys(a);
    for (const key of keys) {
        if (a[key] !== b[key]) {
            return false;
        }
    }
    return true;
}
function areFileConfigurationsEqual(a, b) {
    return (objsAreEqual(a.formatOptions, b.formatOptions)
        && objsAreEqual(a.preferences, b.preferences));
}
class FileConfigurationManager extends dispose_1.Disposable {
    constructor(client) {
        super();
        this.client = client;
        this.formatOptions = new resourceMap_1.ResourceMap();
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
        const config = vscode.workspace.getConfiguration(languageModeIds_1.isTypeScriptDocument(document) ? 'typescript.format' : 'javascript.format', document.uri);
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
            insertSpaceAfterOpeningAndBeforeClosingTemplateStringBraces: config.get('insertSpaceAfterOpeningAndBeforeClosingTemplateStringBraces'),
            insertSpaceAfterOpeningAndBeforeClosingJsxExpressionBraces: config.get('insertSpaceAfterOpeningAndBeforeClosingJsxExpressionBraces'),
            insertSpaceAfterTypeAssertion: config.get('insertSpaceAfterTypeAssertion'),
            placeOpenBraceOnNewLineForFunctions: config.get('placeOpenBraceOnNewLineForFunctions'),
            placeOpenBraceOnNewLineForControlBlocks: config.get('placeOpenBraceOnNewLineForControlBlocks'),
        };
    }
    getPreferences(document) {
        if (this.client.apiVersion.lt(api_1.default.v290)) {
            return {};
        }
        const config = vscode.workspace.getConfiguration(languageModeIds_1.isTypeScriptDocument(document) ? 'typescript.preferences' : 'javascript.preferences', document.uri);
        return {
            quotePreference: this.getQuoteStylePreference(config),
            importModuleSpecifierPreference: getImportModuleSpecifierPreference(config),
            allowTextChangesInNewFiles: document.uri.scheme === 'file',
            providePrefixAndSuffixTextForRename: config.get('renameShorthandProperties', true),
            allowRenameOfImportPath: true,
        };
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
function getImportModuleSpecifierPreference(config) {
    switch (config.get('importModuleSpecifier')) {
        case 'relative': return 'relative';
        case 'non-relative': return 'non-relative';
        default: return undefined;
    }
}
//# sourceMappingURL=fileConfigurationManager.js.map