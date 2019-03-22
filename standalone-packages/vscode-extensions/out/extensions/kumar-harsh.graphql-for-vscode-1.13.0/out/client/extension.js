/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const vscode_1 = require("vscode");
const vscode_languageclient_1 = require("vscode-languageclient");
const helpers_1 = require("../server/helpers");
var Status;
(function (Status) {
    Status[Status["init"] = 1] = "init";
    Status[Status["ok"] = 2] = "ok";
    Status[Status["error"] = 3] = "error";
})(Status || (Status = {}));
const extName = 'graphqlForVSCode';
const statusBarText = 'GQL';
const statusBarUIElements = {
    [Status.init]: {
        icon: 'sync',
        color: 'yellow',
        tooltip: 'Graphql language server is initializing',
    },
    [Status.ok]: {
        icon: 'plug',
        color: 'white',
        tooltip: 'Graphql language server is running',
    },
    [Status.error]: {
        icon: 'stop',
        color: 'red',
        tooltip: 'Graphql language server has stopped',
    },
};
const statusBarItem = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Right, 0);
let extensionStatus = Status.ok;
let serverRunning = false;
const statusBarActivationLanguageIds = [
    'graphql',
    'javascript',
    'javascriptreact',
    'typescript',
    'typescriptreact',
    'vue',
    'feature',
    'ruby',
    'ocaml',
    'reason',
];
function activate(context) {
    // The server is implemented in node
    const serverModule = context.asAbsolutePath(path.join('out', 'server', 'server.js'));
    // The debug options for the server
    const debugOptions = { execArgv: ['--nolazy', '--debug=6004'] };
    // If the extension is launched in debug mode then the debug server options are used
    // Otherwise the run options are used
    const serverOptions = {
        run: { module: serverModule, transport: vscode_languageclient_1.TransportKind.ipc },
        debug: {
            module: serverModule,
            transport: vscode_languageclient_1.TransportKind.ipc,
            options: debugOptions,
        },
    };
    // Options to control the language client
    const clientOptions = {
        diagnosticCollectionName: 'graphql',
        initializationOptions: () => {
            const configuration = vscode_1.workspace.getConfiguration(extName);
            return {
                nodePath: configuration
                    ? configuration.get('nodePath', undefined)
                    : undefined,
                debug: configuration ? configuration.get('debug', false) : false,
            };
        },
        initializationFailedHandler: error => {
            vscode_1.window.showErrorMessage("VSCode for Graphql couldn't start. See output channel for more details.");
            client.error('Server initialization failed:', error.message);
            client.outputChannel.show(true);
            return false;
        },
    };
    // Create the language client and start the client.
    const client = new vscode_languageclient_1.LanguageClient('Graphql For VSCode', serverOptions, clientOptions);
    // Push the disposable to the context's subscriptions so that the
    // client can be deactivated on extension deactivation
    context.subscriptions.push(client.start(), vscode_1.commands.registerCommand('graphqlForVSCode.showOutputChannel', () => {
        client.outputChannel.show(true);
    }), statusBarItem);
    client.onReady().then(() => {
        initializeStatusBar(context, client);
    });
}
exports.activate = activate;
const serverInitialized = new vscode_languageclient_1.NotificationType(helpers_1.commonNotifications.serverInitialized);
const serverExited = new vscode_languageclient_1.NotificationType(helpers_1.commonNotifications.serverExited);
function initializeStatusBar(context, client) {
    extensionStatus = Status.init;
    client.onNotification(serverInitialized, params => {
        extensionStatus = Status.ok;
        serverRunning = true;
        updateStatusBar(vscode_1.window.activeTextEditor);
    });
    client.onNotification(serverExited, params => {
        extensionStatus = Status.error;
        serverRunning = false;
        updateStatusBar(vscode_1.window.activeTextEditor);
    });
    client.onDidChangeState(event => {
        if (event.newState === vscode_languageclient_1.State.Running) {
            extensionStatus = Status.ok;
            serverRunning = true;
        }
        else {
            extensionStatus = Status.error;
            client.info('The graphql server has stopped');
            serverRunning = false;
        }
        updateStatusBar(vscode_1.window.activeTextEditor);
    });
    vscode_1.window.onDidChangeActiveTextEditor((editor) => {
        // update the status if the server is running
        updateStatusBar(editor);
    });
    updateStatusBar(vscode_1.window.activeTextEditor);
}
function updateStatusBar(editor) {
    extensionStatus = serverRunning ? Status.ok : Status.error;
    const statusUI = statusBarUIElements[extensionStatus];
    statusBarItem.text = `$(${statusUI.icon}) ${statusBarText}`;
    statusBarItem.tooltip = statusUI.tooltip;
    statusBarItem.command = 'graphqlForVSCode.showOutputChannel';
    statusBarItem.color = statusUI.color;
    if ((editor &&
        statusBarActivationLanguageIds.indexOf(editor.document.languageId) >
            -1) ||
        editor.document.uri.scheme === 'output') {
        statusBarItem.show();
    }
    else {
        statusBarItem.hide();
    }
}
//# sourceMappingURL=extension.js.map