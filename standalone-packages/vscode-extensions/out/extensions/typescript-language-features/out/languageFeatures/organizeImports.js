"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const vscode = require("vscode");
const nls = require("vscode-nls");
const typescriptService_1 = require("../typescriptService");
const api_1 = require("../utils/api");
const cancellation_1 = require("../utils/cancellation");
const dependentRegistration_1 = require("../utils/dependentRegistration");
const typeConverters = require("../utils/typeConverters");
const localize = nls.loadMessageBundle();
class OrganizeImportsCommand {
    constructor(client, telemetryReporter) {
        this.client = client;
        this.telemetryReporter = telemetryReporter;
        this.id = OrganizeImportsCommand.Id;
    }
    async execute(file, sortOnly = false) {
        /* __GDPR__
            "organizeImports.execute" : {
                "${include}": [
                    "${TypeScriptCommonProperties}"
                ]
            }
        */
        this.telemetryReporter.logTelemetry('organizeImports.execute', {});
        const args = {
            scope: {
                type: 'file',
                args: {
                    file
                }
            },
            skipDestructiveCodeActions: sortOnly,
        };
        const response = await this.client.interruptGetErr(() => this.client.execute('organizeImports', args, cancellation_1.nulToken));
        if (response.type !== 'response' || !response.body) {
            return;
        }
        if (response.body.length) {
            const edits = typeConverters.WorkspaceEdit.fromFileCodeEdits(this.client, response.body);
            return vscode.workspace.applyEdit(edits);
        }
    }
}
OrganizeImportsCommand.Id = '_typescript.organizeImports';
class ImportsCodeActionProvider {
    constructor(client, kind, title, sortOnly, commandManager, fileConfigManager, telemetryReporter) {
        this.client = client;
        this.kind = kind;
        this.title = title;
        this.sortOnly = sortOnly;
        this.fileConfigManager = fileConfigManager;
        commandManager.register(new OrganizeImportsCommand(client, telemetryReporter));
    }
    static register(client, minVersion, kind, title, sortOnly, commandManager, fileConfigurationManager, telemetryReporter, selector) {
        return (0, dependentRegistration_1.conditionalRegistration)([
            (0, dependentRegistration_1.requireMinVersion)(client, minVersion),
            (0, dependentRegistration_1.requireSomeCapability)(client, typescriptService_1.ClientCapability.Semantic),
        ], () => {
            const provider = new ImportsCodeActionProvider(client, kind, title, sortOnly, commandManager, fileConfigurationManager, telemetryReporter);
            return vscode.languages.registerCodeActionsProvider(selector.semantic, provider, {
                providedCodeActionKinds: [kind]
            });
        });
    }
    provideCodeActions(document, _range, context, token) {
        const file = this.client.toOpenedFilePath(document);
        if (!file) {
            return [];
        }
        if (!context.only || !context.only.contains(this.kind)) {
            return [];
        }
        this.fileConfigManager.ensureConfigurationForDocument(document, token);
        const action = new vscode.CodeAction(this.title, this.kind);
        action.command = { title: '', command: OrganizeImportsCommand.Id, arguments: [file, this.sortOnly] };
        return [action];
    }
}
function register(selector, client, commandManager, fileConfigurationManager, telemetryReporter) {
    return vscode.Disposable.from(ImportsCodeActionProvider.register(client, api_1.default.v280, vscode.CodeActionKind.SourceOrganizeImports, localize('organizeImportsAction.title', "Organize Imports"), false, commandManager, fileConfigurationManager, telemetryReporter, selector), ImportsCodeActionProvider.register(client, api_1.default.v430, vscode.CodeActionKind.Source.append('sortImports'), localize('sortImportsAction.title', "Sort Imports"), true, commandManager, fileConfigurationManager, telemetryReporter, selector));
}
exports.register = register;
//# sourceMappingURL=organizeImports.js.map