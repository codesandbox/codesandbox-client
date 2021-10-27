"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const nls = require("vscode-nls");
const api_1 = require("../utils/api");
const dependentRegistration_1 = require("../utils/dependentRegistration");
const typeConverters = require("../utils/typeConverters");
const localize = nls.loadMessageBundle();
const autoFixableDiagnosticCodes = new Set([
    2420,
    2552,
]);
class TypeScriptAutoFixProvider {
    constructor(client, fileConfigurationManager, diagnosticsManager) {
        this.client = client;
        this.fileConfigurationManager = fileConfigurationManager;
        this.diagnosticsManager = diagnosticsManager;
    }
    async provideCodeActions(document, _range, context, token) {
        if (!context.only || !vscode.CodeActionKind.SourceFixAll.intersects(context.only)) {
            return undefined;
        }
        const file = this.client.toOpenedFilePath(document);
        if (!file) {
            return undefined;
        }
        const autoFixableDiagnostics = this.getAutoFixableDiagnostics(document);
        if (!autoFixableDiagnostics.length) {
            return undefined;
        }
        const fixAllAction = await this.getFixAllCodeAction(document, file, autoFixableDiagnostics, token);
        return fixAllAction ? [fixAllAction] : undefined;
    }
    getAutoFixableDiagnostics(document) {
        if (this.client.bufferSyncSupport.hasPendingDiagnostics(document.uri)) {
            return [];
        }
        return this.diagnosticsManager.getDiagnostics(document.uri)
            .filter(x => autoFixableDiagnosticCodes.has(x.code));
    }
    async getFixAllCodeAction(document, file, diagnostics, token) {
        await this.fileConfigurationManager.ensureConfigurationForDocument(document, token);
        const autoFixResponse = await this.getAutoFixEdit(file, diagnostics, token);
        if (!autoFixResponse) {
            return undefined;
        }
        const { edit, fixedDiagnostics } = autoFixResponse;
        const codeAction = new vscode.CodeAction(localize('autoFix.label', 'Auto fix'), vscode.CodeActionKind.SourceFixAll);
        codeAction.edit = edit;
        codeAction.diagnostics = fixedDiagnostics;
        return codeAction;
    }
    async getAutoFixEdit(file, diagnostics, token) {
        const edit = new vscode.WorkspaceEdit();
        const fixedDiagnostics = [];
        for (const diagnostic of diagnostics) {
            const args = {
                ...typeConverters.Range.toFileRangeRequestArgs(file, diagnostic.range),
                errorCodes: [+(diagnostic.code)]
            };
            const response = await this.client.execute('getCodeFixes', args, token);
            if (response.type !== 'response' || !response.body || response.body.length > 1) {
                return undefined;
            }
            const fix = response.body[0];
            if (new Set(['fixClassIncorrectlyImplementsInterface', 'spelling']).has(fix.fixName)) {
                typeConverters.WorkspaceEdit.withFileCodeEdits(edit, this.client, fix.changes);
                fixedDiagnostics.push(diagnostic);
            }
        }
        if (!fixedDiagnostics.length) {
            return undefined;
        }
        return { edit, fixedDiagnostics };
    }
}
TypeScriptAutoFixProvider.metadata = {
    providedCodeActionKinds: [vscode.CodeActionKind.SourceFixAll]
};
function register(selector, client, fileConfigurationManager, diagnosticsManager) {
    return new dependentRegistration_1.VersionDependentRegistration(client, api_1.default.v300, () => new dependentRegistration_1.ConfigurationDependentRegistration('typescript', 'experimental.autoFix.enabled', () => vscode.languages.registerCodeActionsProvider(selector, new TypeScriptAutoFixProvider(client, fileConfigurationManager, diagnosticsManager), TypeScriptAutoFixProvider.metadata)));
}
exports.register = register;
//# sourceMappingURL=fixAll.js.map