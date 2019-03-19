"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const vscode_languageclient_1 = require("vscode-languageclient");
const path_1 = require("path");
const fs_1 = require("fs");
function initializeLanguageClient(vlsModulePath) {
    const debugOptions = { execArgv: ['--nolazy', '--inspect=6005'] };
    const documentSelector = ['vue'];
    const config = vscode.workspace.getConfiguration();
    let serverPath;
    const devVlsPackagePath = config.get('vetur.dev.vlsPath', '');
    if (devVlsPackagePath && devVlsPackagePath !== '' && fs_1.existsSync(devVlsPackagePath)) {
        serverPath = path_1.resolve(devVlsPackagePath, 'dist/vueServerMain.js');
    }
    else {
        serverPath = vlsModulePath;
    }
    const serverOptions = {
        run: { module: serverPath, transport: vscode_languageclient_1.TransportKind.ipc },
        debug: { module: serverPath, transport: vscode_languageclient_1.TransportKind.ipc, options: debugOptions }
    };
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