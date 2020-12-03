"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGlobalSnippetDir = void 0;
const os_1 = require("os");
const path_1 = require("path");
function getGlobalSnippetDir(isInsiders) {
    const appName = isInsiders ? 'Code - Insiders' : 'Code';
    if (process.platform === 'win32') {
        return path_1.resolve(process.env['APPDATA'] || '', appName, 'User/snippets/vetur');
    }
    else if (process.platform === 'darwin') {
        return path_1.resolve(os_1.homedir(), 'Library/Application Support', appName, 'User/snippets/vetur');
    }
    else {
        return path_1.resolve(os_1.homedir(), '.config', appName, 'User/snippets/vetur');
    }
}
exports.getGlobalSnippetDir = getGlobalSnippetDir;
//# sourceMappingURL=userSnippetDir.js.map