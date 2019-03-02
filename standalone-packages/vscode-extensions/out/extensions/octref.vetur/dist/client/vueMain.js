"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const vscode = require("vscode");
const grammar_1 = require("./grammar");
const languages_1 = require("./languages");
const client_1 = require("./client");
function activate(context) {
    /**
     * Custom Block Grammar generation command
     */
    context.subscriptions.push(vscode.commands.registerCommand('vetur.generateGrammar', grammar_1.generateGrammarCommandHandler(context.extensionPath)));
    languages_1.registerLanguageConfigurations();
    /**
     * Vue Language Server Initialization
     */
    const serverModule = context.asAbsolutePath(path.join('server', 'dist', 'vueServerMain.js'));
    const client = client_1.initializeLanguageClient(serverModule);
    context.subscriptions.push(client.start());
    client.onReady().then(() => {
        registerCustomClientNotificationHandlers(client);
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
}
//# sourceMappingURL=vueMain.js.map