"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const api_1 = require("../utils/api");
const dependentRegistration_1 = require("../utils/dependentRegistration");
const definitionProviderBase_1 = require("./definitionProviderBase");
class TypeScriptTypeDefinitionProvider extends definitionProviderBase_1.default {
    provideTypeDefinition(document, position, token) {
        return this.getSymbolLocations('typeDefinition', document, position, token);
    }
}
TypeScriptTypeDefinitionProvider.minVersion = api_1.default.v213;
exports.default = TypeScriptTypeDefinitionProvider;
function register(selector, client) {
    return new dependentRegistration_1.VersionDependentRegistration(client, TypeScriptTypeDefinitionProvider.minVersion, () => {
        return vscode.languages.registerTypeDefinitionProvider(selector, new TypeScriptTypeDefinitionProvider(client));
    });
}
exports.register = register;
//# sourceMappingURL=typeDefinitions.js.map