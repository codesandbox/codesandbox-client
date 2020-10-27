"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toSymbolKind = exports.toCompletionItemKind = exports.findNodeByOffset = exports.isVirtualVueTemplateFile = exports.isVirtualVueFile = exports.isVueFile = void 0;
const vscode_languageserver_1 = require("vscode-languageserver");
function isVueFile(path) {
    return path.endsWith('.vue');
}
exports.isVueFile = isVueFile;
/**
 * If the path ends with `.vue.ts`, it's a `.vue` file pre-processed by Vetur
 * to be used in TS Language Service
 *
 * Note: all files outside any node_modules folder are considered,
 * EXCEPT if they are added to tsconfig via 'files' or 'include' properties
 */
function isVirtualVueFile(path, projectFiles) {
    return path.endsWith('.vue.ts') && (!path.includes('node_modules') || projectFiles.has(path.slice(0, -'.ts'.length)));
}
exports.isVirtualVueFile = isVirtualVueFile;
/**
 * If the path ends with `.vue.template`, it's a `.vue` file's template part
 * pre-processed by Vetur to calculate template diagnostics in TS Language Service
 */
function isVirtualVueTemplateFile(path) {
    return path.endsWith('.vue.template');
}
exports.isVirtualVueTemplateFile = isVirtualVueTemplateFile;
function findNodeByOffset(root, offset) {
    if (offset < root.getStart() || root.getEnd() < offset) {
        return undefined;
    }
    const childMatch = root.getChildren().reduce((matched, child) => {
        return matched || findNodeByOffset(child, offset);
    }, undefined);
    return childMatch ? childMatch : root;
}
exports.findNodeByOffset = findNodeByOffset;
function toCompletionItemKind(kind) {
    switch (kind) {
        case 'primitive type':
        case 'keyword':
            return vscode_languageserver_1.CompletionItemKind.Keyword;
        case 'var':
        case 'local var':
            return vscode_languageserver_1.CompletionItemKind.Variable;
        case 'property':
        case 'getter':
        case 'setter':
            return vscode_languageserver_1.CompletionItemKind.Field;
        case 'function':
        case 'method':
        case 'construct':
        case 'call':
        case 'index':
            return vscode_languageserver_1.CompletionItemKind.Function;
        case 'enum':
            return vscode_languageserver_1.CompletionItemKind.Enum;
        case 'module':
            return vscode_languageserver_1.CompletionItemKind.Module;
        case 'class':
            return vscode_languageserver_1.CompletionItemKind.Class;
        case 'interface':
            return vscode_languageserver_1.CompletionItemKind.Interface;
        case 'warning':
            return vscode_languageserver_1.CompletionItemKind.File;
        case 'script':
            return vscode_languageserver_1.CompletionItemKind.File;
        case 'directory':
            return vscode_languageserver_1.CompletionItemKind.Folder;
    }
    return vscode_languageserver_1.CompletionItemKind.Property;
}
exports.toCompletionItemKind = toCompletionItemKind;
function toSymbolKind(kind) {
    switch (kind) {
        case 'var':
        case 'local var':
        case 'const':
            return vscode_languageserver_1.SymbolKind.Variable;
        case 'function':
        case 'local function':
            return vscode_languageserver_1.SymbolKind.Function;
        case 'enum':
            return vscode_languageserver_1.SymbolKind.Enum;
        case 'module':
            return vscode_languageserver_1.SymbolKind.Module;
        case 'class':
            return vscode_languageserver_1.SymbolKind.Class;
        case 'interface':
            return vscode_languageserver_1.SymbolKind.Interface;
        case 'method':
            return vscode_languageserver_1.SymbolKind.Method;
        case 'property':
        case 'getter':
        case 'setter':
            return vscode_languageserver_1.SymbolKind.Property;
    }
    return vscode_languageserver_1.SymbolKind.Variable;
}
exports.toSymbolKind = toSymbolKind;
//# sourceMappingURL=util.js.map