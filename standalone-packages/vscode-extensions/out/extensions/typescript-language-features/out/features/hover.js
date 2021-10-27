"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const previewer_1 = require("../utils/previewer");
const typeConverters = require("../utils/typeConverters");
class TypeScriptHoverProvider {
    constructor(client) {
        this.client = client;
    }
    async provideHover(document, position, token) {
        const filepath = this.client.toOpenedFilePath(document);
        if (!filepath) {
            return undefined;
        }
        const args = typeConverters.Position.toFileLocationRequestArgs(filepath, position);
        const response = await this.client.interruptGetErr(() => this.client.execute('quickinfo', args, token));
        if (response.type !== 'response' || !response.body) {
            return undefined;
        }
        return new vscode.Hover(TypeScriptHoverProvider.getContents(response.body), typeConverters.Range.fromTextSpan(response.body));
    }
    static getContents(data) {
        const parts = [];
        if (data.displayString) {
            parts.push({ language: 'typescript', value: data.displayString });
        }
        const tags = previewer_1.tagsMarkdownPreview(data.tags);
        parts.push(data.documentation + (tags ? '\n\n' + tags : ''));
        return parts;
    }
}
function register(selector, client) {
    return vscode.languages.registerHoverProvider(selector, new TypeScriptHoverProvider(client));
}
exports.register = register;
//# sourceMappingURL=hover.js.map