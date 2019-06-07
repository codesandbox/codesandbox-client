"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageclient_1 = require("vscode-languageclient");
const vscode_1 = require("vscode");
const { version, referenceID } = require("../package.json");
function getLanguageServerClient(serverModule, outputChannel) {
    const env = {
        APOLLO_CLIENT_NAME: "Apollo VS Code",
        APOLLO_CLIENT_VERSION: version,
        APOLLO_CLIENT_REFERENCE_ID: referenceID,
        NODE_TLS_REJECT_UNAUTHORIZED: 0
    };
    const debugOptions = {
        execArgv: ["--nolazy", "--inspect=6009"],
        env
    };
    const serverOptions = {
        run: {
            module: serverModule,
            transport: vscode_languageclient_1.TransportKind.ipc,
            options: {
                env
            }
        },
        debug: {
            module: serverModule,
            transport: vscode_languageclient_1.TransportKind.ipc,
            options: debugOptions
        }
    };
    const clientOptions = {
        documentSelector: [
            "graphql",
            "javascript",
            "typescript",
            "javascriptreact",
            "typescriptreact",
            "vue",
            "python"
        ],
        synchronize: {
            fileEvents: [
                vscode_1.workspace.createFileSystemWatcher("**/.env"),
                vscode_1.workspace.createFileSystemWatcher("**/*.{graphql,js,ts,jsx,tsx,vue,py}")
            ]
        },
        outputChannel
    };
    return new vscode_languageclient_1.LanguageClient("apollographql", "Apollo GraphQL", serverOptions, clientOptions);
}
exports.getLanguageServerClient = getLanguageServerClient;
//# sourceMappingURL=languageServerClient.js.map