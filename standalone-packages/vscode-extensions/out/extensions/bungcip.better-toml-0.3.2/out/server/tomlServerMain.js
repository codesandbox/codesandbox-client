/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageserver_1 = require("vscode-languageserver");
const toml = require("toml");
// Create a connection for the server. The connection uses Node's IPC as a transport
let connection = vscode_languageserver_1.createConnection(new vscode_languageserver_1.IPCMessageReader(process), new vscode_languageserver_1.IPCMessageWriter(process));
// Create a simple text document manager. The text document manager
// supports full document sync only
let documents = new vscode_languageserver_1.TextDocuments();
// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);
// After the server has started the client sends an initialize request. The server receives
// in the passed params the rootPath of the workspace plus the client capabilities. 
let workspaceRoot;
connection.onInitialize((params) => {
    workspaceRoot = params.rootPath;
    return {
        capabilities: {
            // Tell the client that the server works in FULL text document sync mode
            textDocumentSync: documents.syncKind,
        }
    };
});
// The content of a text document has changed. This event is emitted
// when the text document first opened or when its content has changed.
documents.onDidChangeContent((change) => {
    let diagnostics = [];
    let input = change.document.getText();
    try {
        let output = toml.parse(input);
    }
    catch (e) {
        // workaround for typescript limitation
        const ex = e;
        // content has invalid toml, send diagnostic to client
        // toml parser give position in one based, but languageserver used zero based
        // so we must convert it before send the position
        const startPosition = { line: ex.line - 1, character: ex.column };
        const endPosition = { line: ex.line - 1, character: ex.column + 1 };
        diagnostics.push({
            severity: 1 /* Error */,
            range: {
                start: startPosition,
                end: endPosition
            },
            message: ex.message,
            source: 'Toml Parser'
        });
    }
    // Send the computed diagnostics to VS Code.
    connection.sendDiagnostics({
        uri: change.document.uri,
        diagnostics
    });
});
// Listen on the connection
connection.listen();
//# sourceMappingURL=tomlServerMain.js.map