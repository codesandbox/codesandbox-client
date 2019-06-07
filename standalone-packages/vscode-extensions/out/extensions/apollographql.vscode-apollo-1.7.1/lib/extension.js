"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const vscode_1 = require("vscode");
const statusBar_1 = __importDefault(require("./statusBar"));
const languageServerClient_1 = require("./languageServerClient");
const utils_1 = require("./utils");
const { version } = require("../package.json");
let client;
let clientDisposable;
let statusBar;
let outputChannel;
let schemaTagItems = [];
function isError(response) {
    return (typeof response === "object" &&
        response !== null &&
        "message" in response &&
        "stack" in response);
}
function activate(context) {
    const serverModule = context.asAbsolutePath(path_1.join("node_modules/apollo-language-server/lib", "server.js"));
    client = languageServerClient_1.getLanguageServerClient(serverModule, outputChannel);
    client.registerProposedFeatures();
    statusBar = new statusBar_1.default({
        hasActiveTextEditor: Boolean(vscode_1.window.activeTextEditor)
    });
    outputChannel = vscode_1.window.createOutputChannel("Apollo GraphQL");
    clientDisposable = client.start();
    context.subscriptions.push(statusBar, outputChannel, clientDisposable);
    client.onReady().then(() => {
        vscode_1.commands.registerCommand("apollographql/showStats", () => {
            const fileUri = vscode_1.window.activeTextEditor
                ? vscode_1.window.activeTextEditor.document.uri.fsPath
                : null;
            const fileOpen = fileUri && /[\/\\]/.test(fileUri);
            if (fileOpen) {
                client.sendNotification("apollographql/getStats", { uri: fileUri });
                return;
            }
            utils_1.printNoFileOpenMessage(client, version);
            client.outputChannel.show();
        });
        client.onNotification("apollographql/statsLoaded", params => {
            utils_1.printStatsToClientOutputChannel(client, params, version);
            client.outputChannel.show();
        });
        client.onNotification("apollographql/configFilesFound", (params) => {
            const response = JSON.parse(params);
            const hasActiveTextEditor = Boolean(vscode_1.window.activeTextEditor);
            if (isError(response)) {
                statusBar.showWarningState({
                    hasActiveTextEditor,
                    tooltip: "Configuration Error"
                });
                outputChannel.append(response.stack);
                const infoButtonText = "More Info";
                vscode_1.window
                    .showInformationMessage(response.message, infoButtonText)
                    .then(clicked => {
                    if (clicked === infoButtonText) {
                        outputChannel.show();
                    }
                });
            }
            else if (Array.isArray(response)) {
                if (response.length === 0) {
                    statusBar.showWarningState({
                        hasActiveTextEditor,
                        tooltip: "No apollo.config.js file found"
                    });
                }
                else {
                    statusBar.showLoadedState({ hasActiveTextEditor });
                }
            }
            else {
                throw TypeError(`Invalid response type in message apollographql/configFilesFound:\n${JSON.stringify(response)}`);
            }
        });
        vscode_1.commands.registerCommand("apollographql/reloadService", () => {
            schemaTagItems = [];
            client.sendNotification("apollographql/reloadService");
        });
        client.onNotification("apollographql/tagsLoaded", params => {
            const [serviceID, tags] = JSON.parse(params);
            const items = tags.map(tag => ({
                label: tag,
                description: "",
                detail: serviceID
            }));
            schemaTagItems = [...items, ...schemaTagItems];
        });
        vscode_1.commands.registerCommand("apollographql/selectSchemaTag", async () => {
            const selection = await vscode_1.window.showQuickPick(schemaTagItems);
            if (selection) {
                client.sendNotification("apollographql/tagSelected", selection);
            }
        });
        let currentLoadingResolve = new Map();
        client.onNotification("apollographql/loadingComplete", token => {
            statusBar.showLoadedState({
                hasActiveTextEditor: Boolean(vscode_1.window.activeTextEditor)
            });
            const inMap = currentLoadingResolve.get(token);
            if (inMap) {
                inMap();
                currentLoadingResolve.delete(token);
            }
        });
        client.onNotification("apollographql/loading", ({ message, token }) => {
            vscode_1.window.withProgress({
                location: vscode_1.ProgressLocation.Notification,
                title: message,
                cancellable: false
            }, () => {
                return new Promise(resolve => {
                    currentLoadingResolve.set(token, resolve);
                });
            });
        });
        const engineDecoration = vscode_1.window.createTextEditorDecorationType({});
        let latestDecs = undefined;
        const updateDecorations = () => {
            if (vscode_1.window.activeTextEditor && latestDecs) {
                const editor = vscode_1.window.activeTextEditor;
                const decorations = latestDecs
                    .filter(d => d.document === vscode_1.window.activeTextEditor.document.uri.toString())
                    .map(dec => {
                    return {
                        range: editor.document.lineAt(dec.range.start.line).range,
                        renderOptions: {
                            after: {
                                contentText: `${dec.message}`,
                                textDecoration: "none; padding-left: 15px; opacity: .5"
                            }
                        }
                    };
                });
                vscode_1.window.activeTextEditor.setDecorations(engineDecoration, decorations);
            }
        };
        client.onNotification("apollographql/engineDecorations", (...decs) => {
            latestDecs = decs;
            updateDecorations();
        });
        vscode_1.window.onDidChangeActiveTextEditor(() => {
            updateDecorations();
        });
        vscode_1.workspace.registerTextDocumentContentProvider("graphql-schema", {
            provideTextDocumentContent(uri) {
                return uri.query;
            }
        });
    });
}
exports.activate = activate;
function deactivate() {
    if (client) {
        return client.stop();
    }
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map