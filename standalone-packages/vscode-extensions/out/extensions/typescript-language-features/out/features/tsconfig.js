"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const jsonc = require("jsonc-parser");
const path_1 = require("path");
const vscode = require("vscode");
const arrays_1 = require("../utils/arrays");
function mapChildren(node, f) {
    return node && node.type === 'array' && node.children
        ? node.children.map(f)
        : [];
}
class TsconfigLinkProvider {
    provideDocumentLinks(document, _token) {
        const root = jsonc.parseTree(document.getText());
        if (!root) {
            return null;
        }
        return [
            this.getExtendsLink(document, root),
            ...this.getFilesLinks(document, root),
            ...this.getReferencesLinks(document, root)
        ].filter(x => !!x);
    }
    getExtendsLink(document, root) {
        const extendsNode = jsonc.findNodeAtLocation(root, ['extends']);
        if (!this.isPathValue(extendsNode)) {
            return undefined;
        }
        if (extendsNode.value.startsWith('.')) {
            return new vscode.DocumentLink(this.getRange(document, extendsNode), vscode.Uri.file(path_1.join(path_1.dirname(document.uri.fsPath), extendsNode.value + (extendsNode.value.endsWith('.json') ? '' : '.json'))));
        }
        const workspaceFolderPath = vscode.workspace.getWorkspaceFolder(document.uri).uri.fsPath;
        return new vscode.DocumentLink(this.getRange(document, extendsNode), vscode.Uri.file(path_1.join(workspaceFolderPath, 'node_modules', extendsNode.value + (extendsNode.value.endsWith('.json') ? '' : '.json'))));
    }
    getFilesLinks(document, root) {
        return mapChildren(jsonc.findNodeAtLocation(root, ['files']), child => this.pathNodeToLink(document, child));
    }
    getReferencesLinks(document, root) {
        return mapChildren(jsonc.findNodeAtLocation(root, ['references']), child => {
            const pathNode = jsonc.findNodeAtLocation(child, ['path']);
            if (!this.isPathValue(pathNode)) {
                return undefined;
            }
            return new vscode.DocumentLink(this.getRange(document, pathNode), path_1.basename(pathNode.value).match('.json$')
                ? this.getFileTarget(document, pathNode)
                : this.getFolderTarget(document, pathNode));
        });
    }
    pathNodeToLink(document, node) {
        return this.isPathValue(node)
            ? new vscode.DocumentLink(this.getRange(document, node), this.getFileTarget(document, node))
            : undefined;
    }
    isPathValue(extendsNode) {
        return extendsNode
            && extendsNode.type === 'string'
            && extendsNode.value
            && !extendsNode.value.includes('*'); // don't treat globs as links.
    }
    getFileTarget(document, node) {
        return vscode.Uri.file(path_1.join(path_1.dirname(document.uri.fsPath), node.value));
    }
    getFolderTarget(document, node) {
        return vscode.Uri.file(path_1.join(path_1.dirname(document.uri.fsPath), node.value, 'tsconfig.json'));
    }
    getRange(document, node) {
        const offset = node.offset;
        const start = document.positionAt(offset + 1);
        const end = document.positionAt(offset + (node.length - 1));
        return new vscode.Range(start, end);
    }
}
function register() {
    const patterns = [
        '**/[jt]sconfig.json',
        '**/[jt]sconfig.*.json',
    ];
    const languages = ['json', 'jsonc'];
    const selector = arrays_1.flatten(languages.map(language => patterns.map((pattern) => ({ language, pattern }))));
    return vscode.languages.registerDocumentLinkProvider(selector, new TsconfigLinkProvider());
}
exports.register = register;
//# sourceMappingURL=tsconfig.js.map