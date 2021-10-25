"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const vscode = require("vscode");
const typescriptService_1 = require("../typescriptService");
const api_1 = require("../utils/api");
const dependentRegistration_1 = require("../utils/dependentRegistration");
const typeConverters = require("../utils/typeConverters");
const definitionProviderBase_1 = require("./definitionProviderBase");
class TypeScriptDefinitionProvider extends definitionProviderBase_1.default {
    constructor(client) {
        super(client);
    }
    async provideDefinition(document, position, token) {
        if (this.client.apiVersion.gte(api_1.default.v270)) {
            const filepath = this.client.toOpenedFilePath(document);
            if (!filepath) {
                return undefined;
            }
            const args = typeConverters.Position.toFileLocationRequestArgs(filepath, position);
            const response = await this.client.execute('definitionAndBoundSpan', args, token);
            if (response.type !== 'response' || !response.body) {
                return undefined;
            }
            const span = response.body.textSpan ? typeConverters.Range.fromTextSpan(response.body.textSpan) : undefined;
            return response.body.definitions
                .map((location) => {
                const target = typeConverters.Location.fromTextSpan(this.client.toResource(location.file), location);
                if (location.contextStart && location.contextEnd) {
                    return {
                        originSelectionRange: span,
                        targetRange: typeConverters.Range.fromLocations(location.contextStart, location.contextEnd),
                        targetUri: target.uri,
                        targetSelectionRange: target.range,
                    };
                }
                return {
                    originSelectionRange: span,
                    targetRange: target.range,
                    targetUri: target.uri
                };
            });
        }
        return this.getSymbolLocations('definition', document, position, token);
    }
}
exports.default = TypeScriptDefinitionProvider;
function register(selector, client) {
    return (0, dependentRegistration_1.conditionalRegistration)([
        (0, dependentRegistration_1.requireSomeCapability)(client, typescriptService_1.ClientCapability.EnhancedSyntax, typescriptService_1.ClientCapability.Semantic),
    ], () => {
        return vscode.languages.registerDefinitionProvider(selector.syntax, new TypeScriptDefinitionProvider(client));
    });
}
exports.register = register;
//# sourceMappingURL=definitions.js.map