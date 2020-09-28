"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
const generateGrammarCommand_1 = require("./commands/generateGrammarCommand");
const languages_1 = require("./languages");
const client_1 = require("./client");
const path_1 = require("path");
const virtualFileCommand_1 = require("./commands/virtualFileCommand");
const userSnippetDir_1 = require("./userSnippetDir");
const openUserScaffoldSnippetFolderCommand_1 = require("./commands/openUserScaffoldSnippetFolderCommand");
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const isInsiders = vscode.env.appName.includes('Insiders');
        const globalSnippetDir = userSnippetDir_1.getGlobalSnippetDir(isInsiders);
        /**
         * Virtual file display command for debugging template interpolation
         */
        context.subscriptions.push(yield virtualFileCommand_1.registerVeturTextDocumentProviders());
        /**
         * Custom Block Grammar generation command
         */
        context.subscriptions.push(vscode.commands.registerCommand('vetur.generateGrammar', generateGrammarCommand_1.generateGrammarCommandHandler(context.extensionPath)));
        /**
         * Open custom snippet folder
         */
        context.subscriptions.push(vscode.commands.registerCommand('vetur.openUserScaffoldSnippetFolder', openUserScaffoldSnippetFolderCommand_1.generateOpenUserScaffoldSnippetFolderCommand(globalSnippetDir)));
        languages_1.registerLanguageConfigurations();
        /**
         * Vue Language Server Initialization
         */
        const serverModule = context.asAbsolutePath(path_1.join('server', 'dist', 'vueServerMain.js'));
        const client = client_1.initializeLanguageClient(serverModule, globalSnippetDir);
        context.subscriptions.push(client.start());
        const promise = client
            .onReady()
            .then(() => {
            registerCustomClientNotificationHandlers(client);
            registerCustomLSPCommands(context, client);
        })
            .catch(e => {
            console.log('Client initialization failed');
        });
        return vscode.window.withProgress({
            title: 'Vetur initialization',
            location: vscode.ProgressLocation.Window
        }, () => promise);
    });
}
exports.activate = activate;
function registerCustomClientNotificationHandlers(client) {
    client.onNotification('$/displayInfo', (msg) => {
        vscode.window.showInformationMessage(msg);
    });
    client.onNotification('$/displayWarning', (msg) => {
        vscode.window.showWarningMessage(msg);
    });
    client.onNotification('$/displayError', (msg) => {
        vscode.window.showErrorMessage(msg);
    });
    client.onNotification('$/showVirtualFile', (virtualFileSource, prettySourceMap) => {
        virtualFileCommand_1.setVirtualContents(virtualFileSource, prettySourceMap);
    });
}
function registerCustomLSPCommands(context, client) {
    context.subscriptions.push(vscode.commands.registerCommand('vetur.showCorrespondingVirtualFile', virtualFileCommand_1.generateShowVirtualFileCommand(client)));
}
//# sourceMappingURL=vueMain.js.map