"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const elmCodeAction_1 = require("./elmCodeAction");
const elmFormat_1 = require("./elmFormat");
const elmFormat_2 = require("./elmFormat");
const elmReactor_1 = require("./elmReactor");
const elmAutocomplete_1 = require("./elmAutocomplete");
const elmLinter_1 = require("./elmLinter");
const elmRepl_1 = require("./elmRepl");
const elmMake_1 = require("./elmMake");
// import {activateMakeWarn} from './elmMakeWarn';
const elmPackage_1 = require("./elmPackage");
const elmClean_1 = require("./elmClean");
const elmAnalyse_1 = require("./elmAnalyse");
const elmDefinition_1 = require("./elmDefinition");
const elmInfo_1 = require("./elmInfo");
const elmSymbol_1 = require("./elmSymbol");
const elmWorkspaceSymbols_1 = require("./elmWorkspaceSymbols");
const elmConfiguration_1 = require("./elmConfiguration");
const ELM_MODE = { language: 'elm', scheme: 'file' };
const config = vscode.workspace.getConfiguration('elm');
const disableLinter = config.get('disableLinting');
const elmAnalyseIssues = [];
const elmAnalyse = new elmAnalyse_1.ElmAnalyse(elmAnalyseIssues);
// this method is called when your extension is activated
function activate(ctx) {
    const elmFormatStatusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    if (!disableLinter) {
        ctx.subscriptions.push(vscode.workspace.onDidSaveTextDocument((document) => {
            elmLinter_1.runLinter(document, elmAnalyse);
        }));
    }
    elmRepl_1.activateRepl().forEach((d) => ctx.subscriptions.push(d));
    elmReactor_1.activateReactor().forEach((d) => ctx.subscriptions.push(d));
    elmMake_1.activateMake().forEach((d) => ctx.subscriptions.push(d));
    elmPackage_1.activatePackage().forEach((d) => ctx.subscriptions.push(d));
    elmClean_1.activateClean().forEach((d) => ctx.subscriptions.push(d));
    elmCodeAction_1.activateCodeActions().forEach((d) => ctx.subscriptions.push(d));
    elmAnalyse
        .activateAnalyse()
        .forEach((d) => ctx.subscriptions.push(d));
    let workspaceProvider = new elmWorkspaceSymbols_1.ElmWorkspaceSymbolProvider(ELM_MODE);
    ctx.subscriptions.push(vscode.languages.setLanguageConfiguration('elm', elmConfiguration_1.configuration));
    ctx.subscriptions.push(vscode.languages.registerHoverProvider(ELM_MODE, new elmInfo_1.ElmHoverProvider()));
    ctx.subscriptions.push(vscode.languages.registerCompletionItemProvider(ELM_MODE, new elmAutocomplete_1.ElmCompletionProvider(), '.'));
    ctx.subscriptions.push(vscode.languages.registerDocumentSymbolProvider(ELM_MODE, new elmSymbol_1.ElmSymbolProvider()));
    ctx.subscriptions.push(vscode.languages.registerDefinitionProvider(ELM_MODE, new elmDefinition_1.ElmDefinitionProvider(ELM_MODE, workspaceProvider)));
    ctx.subscriptions.push(vscode.languages.registerCodeActionsProvider(ELM_MODE, new elmCodeAction_1.ElmCodeActionProvider()));
    ctx.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider(ELM_MODE, new elmFormat_1.ElmFormatProvider(elmFormatStatusBar)));
    ctx.subscriptions.push(vscode.languages.registerDocumentRangeFormattingEditProvider(ELM_MODE, new elmFormat_2.ElmRangeFormatProvider(elmFormatStatusBar)));
    ctx.subscriptions.push(vscode.languages.registerWorkspaceSymbolProvider(workspaceProvider));
    vscode.workspace.onDidSaveTextDocument((document) => {
        if (document === vscode.window.activeTextEditor.document &&
            document.languageId === ELM_MODE.language &&
            document.uri.scheme === ELM_MODE.scheme) {
            workspaceProvider.update(document);
        }
    });
}
exports.activate = activate;
function deactivate() {
    elmReactor_1.deactivateReactor();
    elmAnalyse.deactivateAnalyse();
}
exports.deactivate = deactivate;
//# sourceMappingURL=elmMain.js.map