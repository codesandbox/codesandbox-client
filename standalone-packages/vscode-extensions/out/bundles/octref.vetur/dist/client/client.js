"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const vscode_languageclient_1 = require("vscode-languageclient");
function initializeLanguageClient(serverModule) {
    const debugOptions = { execArgv: ['--nolazy', '--inspect=6005'] };
    const serverOptions = {
        run: { module: serverModule, transport: vscode_languageclient_1.TransportKind.ipc },
        debug: { module: serverModule, transport: vscode_languageclient_1.TransportKind.ipc, options: debugOptions }
    };
    const documentSelector = ['vue'];
    const config = vscode.workspace.getConfiguration();
    const clientOptions = {
        documentSelector,
        synchronize: {
            configurationSection: ['vetur', 'emmet', 'html', 'javascript', 'typescript', 'prettier', 'stylusSupremacy'],
            fileEvents: vscode.workspace.createFileSystemWatcher('{**/*.js,**/*.ts}', true, false, true)
        },
        initializationOptions: {
            config
        },
        revealOutputChannelOn: vscode_languageclient_1.RevealOutputChannelOn.Never
    };
    return new vscode_languageclient_1.LanguageClient('vetur', 'Vue Language Server', serverOptions, clientOptions);
}
exports.initializeLanguageClient = initializeLanguageClient;
//# sourceMappingURL=client.js.map