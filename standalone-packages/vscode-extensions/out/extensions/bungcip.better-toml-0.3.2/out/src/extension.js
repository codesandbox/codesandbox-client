'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const path = require("path");
const vscode = require("vscode");
const vscode_languageclient_1 = require("vscode-languageclient");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // The server is implemented in node
    let serverModule = context.asAbsolutePath(path.join('out', 'server', 'tomlServerMain.js'));
    // The debug options for the server
    let debugOptions = { execArgv: ["--nolazy", "--debug=6004"] };
    // If the extension is launched in debug mode then the debug server options are used
    // Otherwise the run options are used
    let serverOptions = {
        run: { module: serverModule, transport: vscode_languageclient_1.TransportKind.ipc },
        debug: { module: serverModule, transport: vscode_languageclient_1.TransportKind.ipc, options: debugOptions }
    };
    // Options to control the language client
    let clientOptions = {
        // Register the server for plain text documents
        documentSelector: ['toml'],
        synchronize: {
            // Synchronize the setting section 'toml' and 'http' to the server
            configurationSection: ['toml.schemas', 'http.proxy', 'http.proxyStrictSSL'],
            // Notify the server about file changes to '.toml files contain in the workspace
            fileEvents: vscode.workspace.createFileSystemWatcher('**/*.toml')
        }
    };
    // Create the language client and start the client.
    let disposable = new vscode_languageclient_1.LanguageClient('TOML Language Server', serverOptions, clientOptions).start();
    // Push the disposable to the context's subscriptions so that the 
    // client can be deactivated on extension deactivation
    context.subscriptions.push(disposable);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map