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
class TypeScriptImplementationProvider extends definitionProviderBase_1.default {
    provideImplementation(document, position, token) {
        return this.getSymbolLocations('implementation', document, position, token);
    }
}
TypeScriptImplementationProvider.minVersion = api_1.default.v220;
function register(selector, client) {
    return new dependentRegistration_1.VersionDependentRegistration(client, TypeScriptImplementationProvider.minVersion, () => {
        return vscode.languages.registerImplementationProvider(selector, new TypeScriptImplementationProvider(client));
    });
}
exports.register = register;
//# sourceMappingURL=implementations.js.map