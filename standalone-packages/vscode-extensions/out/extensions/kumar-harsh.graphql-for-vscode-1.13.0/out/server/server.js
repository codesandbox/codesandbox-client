'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var semver = require("semver");
var vscode_languageserver_1 = require("vscode-languageserver");
var helpers_1 = require("./helpers");
var moduleName = '@playlyfe/gql';
// Create a connection for the server. The connection uses Node's IPC as a transport
var connection = vscode_languageserver_1.createConnection(new vscode_languageserver_1.IPCMessageReader(process), new vscode_languageserver_1.IPCMessageWriter(process));
// Create a simple text document manager. The text document manager
// supports full document sync only
var documents = new vscode_languageserver_1.TextDocuments();
// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);
// Define server notifications to be sent to the client
var serverInitialized = new vscode_languageserver_1.NotificationType0(helpers_1.commonNotifications.serverInitialized);
var serverExited = new vscode_languageserver_1.NotificationType0(helpers_1.commonNotifications.serverExited);
// After the server has started the client sends an initilize request. The server receives
// in the passed params the rootPath of the workspace plus the client capabilites.
var gqlService;
connection.onInitialize(function (params) {
    var initOptions = params.initializationOptions;
    var workspaceRoot = params.rootPath;
    var nodePath = toAbsolutePath(initOptions.nodePath || '', workspaceRoot);
    var debug = initOptions.debug;
    return helpers_1.resolveModule(moduleName, nodePath, trace) // loading gql from project
        .then(function (gqlModule) {
        if (!semver.satisfies(gqlModule.version, '2.x')) {
            connection.sendNotification(serverExited);
            return Promise.reject(new vscode_languageserver_1.ResponseError(0, 'Plugin requires `@playlyfe/gql v2.x`. Please upgrade the `@playlyfe/gql` package and restart vscode.'));
        }
        gqlService = createGQLService(gqlModule, workspaceRoot, debug);
        var result = {
            capabilities: {},
        };
        return result;
    });
});
connection.onInitialized(function () {
    registerLanguages(gqlService.getFileExtensions());
});
connection.onExit(function () {
    connection.sendNotification(serverExited);
});
function registerLanguages(extensions) {
    // tslint:disable-next-line no-console
    console.info('[vscode] File extensions registered: ', extensions);
    var registration = vscode_languageserver_1.BulkRegistration.create();
    var documentOptions = {
        documentSelector: [
            {
                scheme: 'file',
                pattern: "**/*.{" + extensions.join(',') + "}",
            },
        ],
    };
    registration.add(vscode_languageserver_1.DidOpenTextDocumentNotification.type, documentOptions);
    registration.add(vscode_languageserver_1.DidChangeTextDocumentNotification.type, {
        documentSelector: documentOptions.documentSelector,
        syncKind: vscode_languageserver_1.TextDocumentSyncKind.Full,
    });
    registration.add(vscode_languageserver_1.DidCloseTextDocumentNotification.type, documentOptions);
    registration.add(vscode_languageserver_1.CompletionRequest.type, documentOptions);
    registration.add(vscode_languageserver_1.HoverRequest.type, documentOptions);
    registration.add(vscode_languageserver_1.DefinitionRequest.type, documentOptions);
    registration.add(vscode_languageserver_1.ReferencesRequest.type, documentOptions);
    connection.client.register(registration);
}
function toAbsolutePath(nodePath, workspaceRoot) {
    if (!path.isAbsolute(nodePath)) {
        return path.join(workspaceRoot, nodePath);
    }
    return nodePath;
}
function trace(message) {
    // tslint:disable-next-line no-console
    connection.console.info(message);
}
function createGQLService(gqlModule, workspaceRoot, debug) {
    var lastSendDiagnostics = [];
    var hasNotifiedClient = false;
    return new gqlModule.GQLService({
        cwd: workspaceRoot,
        debug: debug,
        onChange: function () {
            // @todo: move this it an `onInit()` function when implemented in @playlyfe/gql
            if (gqlService._isInitialized && !hasNotifiedClient) {
                hasNotifiedClient = true;
                connection.sendNotification(serverInitialized);
            }
            var errors = gqlService.status();
            var SCHEMA_FILE = '__schema__';
            var diagnosticsMap = {};
            errors.map(function (error) {
                var locations = error.locations;
                if (!locations) {
                    // global error will be grouped under __schema__
                    if (!diagnosticsMap[SCHEMA_FILE]) {
                        diagnosticsMap[SCHEMA_FILE] = {
                            uri: SCHEMA_FILE,
                            diagnostics: [],
                        };
                    }
                    diagnosticsMap[SCHEMA_FILE].diagnostics.push(helpers_1.makeDiagnostic(error, { line: 1, column: 1 }));
                }
                else {
                    locations.forEach(function (loc) {
                        if (!diagnosticsMap[loc.path]) {
                            diagnosticsMap[loc.path] = {
                                uri: helpers_1.filePathToURI(loc.path),
                                diagnostics: [],
                            };
                        }
                        diagnosticsMap[loc.path].diagnostics.push(helpers_1.makeDiagnostic(error, loc));
                    });
                }
            });
            var sendDiagnostics = [];
            // report new errors
            Object.keys(diagnosticsMap).forEach(function (file) {
                sendDiagnostics.push({ file: file, diagnostic: diagnosticsMap[file] });
                connection.sendDiagnostics(diagnosticsMap[file]);
            });
            // clear old errors
            lastSendDiagnostics.forEach(function (_a) {
                var file = _a.file, diagnostic = _a.diagnostic;
                if (diagnosticsMap[file]) {
                    return;
                } // already reported error above
                connection.sendDiagnostics({ uri: diagnostic.uri, diagnostics: [] });
            });
            lastSendDiagnostics = sendDiagnostics;
        },
    });
}
connection.onDefinition(function (textDocumentPosition, token) {
    if (token.isCancellationRequested) {
        return;
    }
    var defLocation = gqlService.getDef({
        sourceText: documents
            .get(textDocumentPosition.textDocument.uri)
            .getText(),
        sourcePath: helpers_1.uriToFilePath(textDocumentPosition.textDocument.uri),
        position: helpers_1.toGQLPosition(textDocumentPosition.position),
    });
    if (defLocation) {
        return helpers_1.mapLocation(defLocation);
    }
});
// show symbol info onHover
connection.onHover(function (textDocumentPosition, token) {
    if (token.isCancellationRequested) {
        return;
    }
    var info = gqlService.getInfo({
        sourceText: documents
            .get(textDocumentPosition.textDocument.uri)
            .getText(),
        sourcePath: helpers_1.uriToFilePath(textDocumentPosition.textDocument.uri),
        position: helpers_1.toGQLPosition(textDocumentPosition.position),
    });
    if (info) {
        return {
            contents: info.contents.map(function (content) { return ({
                language: 'graphql',
                value: content,
            }); }),
        };
    }
});
// This handler provides the initial list of the completion items.
connection.onCompletion(function (textDocumentPosition, token) {
    if (token.isCancellationRequested) {
        return;
    }
    var results = gqlService.autocomplete({
        sourceText: documents
            .get(textDocumentPosition.textDocument.uri)
            .getText(),
        sourcePath: helpers_1.uriToFilePath(textDocumentPosition.textDocument.uri),
        position: helpers_1.toGQLPosition(textDocumentPosition.position),
    });
    return results.map(function (_a) {
        var text = _a.text, type = _a.type, description = _a.description;
        return ({
            label: text,
            detail: type,
            documentation: description,
        });
    });
});
// This handler resolve additional information for the item selected in
// the completion list.
connection.onCompletionResolve(function (item) {
    return item;
});
// Find all references
connection.onReferences(function (textDocumentPosition, token) {
    if (token.isCancellationRequested) {
        return;
    }
    var refLocations = gqlService.findRefs({
        sourceText: documents
            .get(textDocumentPosition.textDocument.uri)
            .getText(),
        sourcePath: helpers_1.uriToFilePath(textDocumentPosition.textDocument.uri),
        position: helpers_1.toGQLPosition(textDocumentPosition.position),
    });
    return refLocations.map(helpers_1.mapLocation);
});
// Listen on the connection
connection.listen();
//# sourceMappingURL=server.js.map