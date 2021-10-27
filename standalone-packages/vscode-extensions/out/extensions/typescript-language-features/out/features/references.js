"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const api_1 = require("../utils/api");
const typeConverters = require("../utils/typeConverters");
class TypeScriptReferenceSupport {
    constructor(client) {
        this.client = client;
    }
    async provideReferences(document, position, options, token) {
        const filepath = this.client.toOpenedFilePath(document);
        if (!filepath) {
            return [];
        }
        const args = typeConverters.Position.toFileLocationRequestArgs(filepath, position);
        const response = await this.client.execute('references', args, token);
        if (response.type !== 'response' || !response.body) {
            return [];
        }
        const result = [];
        const has203Features = this.client.apiVersion.gte(api_1.default.v203);
        for (const ref of response.body.refs) {
            if (!options.includeDeclaration && has203Features && ref.isDefinition) {
                continue;
            }
            const url = this.client.toResource(ref.file);
            const location = typeConverters.Location.fromTextSpan(url, ref);
            result.push(location);
        }
        return result;
    }
}
function register(selector, client) {
    return vscode.languages.registerReferenceProvider(selector, new TypeScriptReferenceSupport(client));
}
exports.register = register;
//# sourceMappingURL=references.js.map