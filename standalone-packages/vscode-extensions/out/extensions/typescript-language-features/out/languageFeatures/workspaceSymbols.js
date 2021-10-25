"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const vscode = require("vscode");
const PConst = require("../protocol.const");
const api_1 = require("../utils/api");
const fileSchemes = require("../utils/fileSchemes");
const languageDescription_1 = require("../utils/languageDescription");
const modifiers_1 = require("../utils/modifiers");
const typeConverters = require("../utils/typeConverters");
function getSymbolKind(item) {
    switch (item.kind) {
        case PConst.Kind.method: return vscode.SymbolKind.Method;
        case PConst.Kind.enum: return vscode.SymbolKind.Enum;
        case PConst.Kind.enumMember: return vscode.SymbolKind.EnumMember;
        case PConst.Kind.function: return vscode.SymbolKind.Function;
        case PConst.Kind.class: return vscode.SymbolKind.Class;
        case PConst.Kind.interface: return vscode.SymbolKind.Interface;
        case PConst.Kind.type: return vscode.SymbolKind.Class;
        case PConst.Kind.memberVariable: return vscode.SymbolKind.Field;
        case PConst.Kind.memberGetAccessor: return vscode.SymbolKind.Field;
        case PConst.Kind.memberSetAccessor: return vscode.SymbolKind.Field;
        case PConst.Kind.variable: return vscode.SymbolKind.Variable;
        default: return vscode.SymbolKind.Variable;
    }
}
class TypeScriptWorkspaceSymbolProvider {
    constructor(client, modeIds) {
        this.client = client;
        this.modeIds = modeIds;
    }
    async provideWorkspaceSymbols(search, token) {
        let file;
        if (this.searchAllOpenProjects) {
            file = undefined;
        }
        else {
            const document = this.getDocument();
            file = document ? await this.toOpenedFiledPath(document) : undefined;
            if (!file && this.client.apiVersion.lt(api_1.default.v390)) {
                return [];
            }
        }
        const args = {
            file,
            searchValue: search,
            maxResultCount: 256,
        };
        const response = await this.client.execute('navto', args, token);
        if (response.type !== 'response' || !response.body) {
            return [];
        }
        return response.body
            .filter(item => item.containerName || item.kind !== 'alias')
            .map(item => this.toSymbolInformation(item));
    }
    get searchAllOpenProjects() {
        return this.client.apiVersion.gte(api_1.default.v390)
            && vscode.workspace.getConfiguration('typescript').get('workspaceSymbols.scope', 'allOpenProjects') === 'allOpenProjects';
    }
    async toOpenedFiledPath(document) {
        if (document.uri.scheme === fileSchemes.git) {
            try {
                const path = vscode.Uri.file(JSON.parse(document.uri.query)?.path);
                if ((0, languageDescription_1.doesResourceLookLikeATypeScriptFile)(path) || (0, languageDescription_1.doesResourceLookLikeAJavaScriptFile)(path)) {
                    const document = await vscode.workspace.openTextDocument(path);
                    return this.client.toOpenedFilePath(document);
                }
            }
            catch {
                // noop
            }
        }
        return this.client.toOpenedFilePath(document);
    }
    toSymbolInformation(item) {
        const label = TypeScriptWorkspaceSymbolProvider.getLabel(item);
        const info = new vscode.SymbolInformation(label, getSymbolKind(item), item.containerName || '', typeConverters.Location.fromTextSpan(this.client.toResource(item.file), item));
        const kindModifiers = item.kindModifiers ? (0, modifiers_1.parseKindModifier)(item.kindModifiers) : undefined;
        if (kindModifiers?.has(PConst.KindModifiers.deprecated)) {
            info.tags = [vscode.SymbolTag.Deprecated];
        }
        return info;
    }
    static getLabel(item) {
        const label = item.name;
        if (item.kind === 'method' || item.kind === 'function') {
            return label + '()';
        }
        return label;
    }
    getDocument() {
        // typescript wants to have a resource even when asking
        // general questions so we check the active editor. If this
        // doesn't match we take the first TS document.
        const activeDocument = vscode.window.activeTextEditor?.document;
        if (activeDocument) {
            if (this.modeIds.includes(activeDocument.languageId)) {
                return activeDocument;
            }
        }
        const documents = vscode.workspace.textDocuments;
        for (const document of documents) {
            if (this.modeIds.includes(document.languageId)) {
                return document;
            }
        }
        return undefined;
    }
}
function register(client, modeIds) {
    return vscode.languages.registerWorkspaceSymbolProvider(new TypeScriptWorkspaceSymbolProvider(client, modeIds));
}
exports.register = register;
//# sourceMappingURL=workspaceSymbols.js.map