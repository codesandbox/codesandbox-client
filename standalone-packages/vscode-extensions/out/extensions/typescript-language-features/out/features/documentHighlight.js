"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const arrays_1 = require("../utils/arrays");
const typeConverters = require("../utils/typeConverters");
class TypeScriptDocumentHighlightProvider {
    constructor(client) {
        this.client = client;
    }
    async provideDocumentHighlights(document, position, token) {
        const file = this.client.toOpenedFilePath(document);
        if (!file) {
            return [];
        }
        const args = {
            ...typeConverters.Position.toFileLocationRequestArgs(file, position),
            filesToSearch: [file]
        };
        const response = await this.client.execute('documentHighlights', args, token);
        if (response.type !== 'response' || !response.body) {
            return [];
        }
        return arrays_1.flatten(response.body
            .filter(highlight => highlight.file === file)
            .map(convertDocumentHighlight));
    }
}
function convertDocumentHighlight(highlight) {
    return highlight.highlightSpans.map(span => new vscode.DocumentHighlight(typeConverters.Range.fromTextSpan(span), span.kind === 'writtenReference' ? vscode.DocumentHighlightKind.Write : vscode.DocumentHighlightKind.Read));
}
function register(selector, client) {
    return vscode.languages.registerDocumentHighlightProvider(selector, new TypeScriptDocumentHighlightProvider(client));
}
exports.register = register;
//# sourceMappingURL=documentHighlight.js.map