"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = require("os");
const vscode_uri_1 = require("vscode-uri");
function getFileFsPath(documentUri) {
    return vscode_uri_1.default.parse(documentUri).fsPath;
}
exports.getFileFsPath = getFileFsPath;
function getFilePath(documentUri) {
    const IS_WINDOWS = os_1.platform() === 'win32';
    if (IS_WINDOWS) {
        // Windows have a leading slash like /C:/Users/pine
        return vscode_uri_1.default.parse(documentUri).path.slice(1);
    }
    else {
        return vscode_uri_1.default.parse(documentUri).path;
    }
}
exports.getFilePath = getFilePath;
//# sourceMappingURL=paths.js.map