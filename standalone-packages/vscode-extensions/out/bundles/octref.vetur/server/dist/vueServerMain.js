"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageserver_1 = require("vscode-languageserver");
const vls_1 = require("./services/vls");
// Create a connection for the server
const connection = process.argv.length <= 2
    ? vscode_languageserver_1.createConnection(process.stdin, process.stdout) // no arg specified
    : vscode_languageserver_1.createConnection();
console.log = connection.console.log.bind(connection.console);
console.error = connection.console.error.bind(connection.console);
// After the server has started the client sends an initilize request. The server receives
// in the passed params the rootPath of the workspace plus the client capabilites
connection.onInitialize((params) => {
    const initializationOptions = params.initializationOptions;
    const workspacePath = params.rootPath;
    if (!workspacePath) {
        console.error('No workspace path found. Vetur initialization failed');
        return {
            capabilities: {}
        };
    }
    console.log('Vetur initialized');
    const vls = new vls_1.VLS(workspacePath, connection);
    if (initializationOptions && initializationOptions.config) {
        vls.configure(initializationOptions.config);
    }
    return {
        capabilities: {
            textDocumentSync: vscode_languageserver_1.TextDocumentSyncKind.Full,
            completionProvider: { resolveProvider: true, triggerCharacters: ['.', ':', '<', '"', "'", '/', '@', '*'] },
            signatureHelpProvider: { triggerCharacters: ['('] },
            documentFormattingProvider: true,
            hoverProvider: true,
            documentHighlightProvider: true,
            documentLinkProvider: {
                resolveProvider: false
            },
            documentSymbolProvider: true,
            definitionProvider: true,
            referencesProvider: true,
            colorProvider: true
        }
    };
});
connection.listen();
//# sourceMappingURL=vueServerMain.js.map