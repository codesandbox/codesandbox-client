"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageserver_1 = require("vscode-languageserver");
const vscode_uri_1 = require("vscode-uri");
function resolveModule(moduleName, nodePath, tracer) {
    return vscode_languageserver_1.Files.resolve(moduleName, nodePath, nodePath, tracer).then(modulePath => {
        const _module = require(modulePath);
        if (tracer) {
            tracer(`Module '${moduleName}' loaded from: ${modulePath}`);
        }
        return _module;
    }, error => {
        return Promise.reject(new Error(`Couldn't find module '${moduleName}' in path '${nodePath}'.`));
    });
}
exports.resolveModule = resolveModule;
function makeDiagnostic(error, position) {
    const startPosition = mapPosition(position);
    return {
        severity: mapSeverity(error.severity),
        message: error.message,
        source: 'graphql',
        range: {
            start: startPosition,
            end: startPosition,
        },
        code: 'syntax',
    };
}
exports.makeDiagnostic = makeDiagnostic;
// map gql location to vscode location
function mapPosition(gqlPosition) {
    return vscode_languageserver_1.Position.create(gqlPosition.line - 1, gqlPosition.column - 1);
}
exports.mapPosition = mapPosition;
function mapLocation(gqlLocation) {
    return vscode_languageserver_1.Location.create(filePathToURI(gqlLocation.path), vscode_languageserver_1.Range.create(mapPosition(gqlLocation.start), mapPosition(gqlLocation.end)));
}
exports.mapLocation = mapLocation;
// gql (one-based) while vscode (zero-based)
function toGQLPosition(position) {
    return {
        line: position.line + 1,
        column: position.character + 1,
    };
}
exports.toGQLPosition = toGQLPosition;
// map gql severity to vscode severity
function mapSeverity(severity) {
    switch (severity) {
        case 'error':
            return vscode_languageserver_1.DiagnosticSeverity.Error;
        case 'warn':
            return vscode_languageserver_1.DiagnosticSeverity.Warning;
        default:
            return vscode_languageserver_1.DiagnosticSeverity.Hint;
    }
}
exports.mapSeverity = mapSeverity;
function filePathToURI(filePath) {
    return vscode_uri_1.default.file(filePath).toString();
}
exports.filePathToURI = filePathToURI;
function uriToFilePath(uri) {
    return vscode_languageserver_1.Files.uriToFilePath(uri);
}
exports.uriToFilePath = uriToFilePath;
// commonNotifications are shared between server and client
exports.commonNotifications = {
    serverInitialized: 'graphqlForVSCode/serverInitialized',
    serverExited: 'graphqlForVSCode/serverExited',
};
//# sourceMappingURL=helpers.js.map