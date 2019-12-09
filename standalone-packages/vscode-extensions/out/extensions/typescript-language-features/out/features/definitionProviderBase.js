"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const typeConverters = require("../utils/typeConverters");
class TypeScriptDefinitionProviderBase {
    constructor(client) {
        this.client = client;
    }
    async getSymbolLocations(definitionType, document, position, token) {
        const file = this.client.toOpenedFilePath(document);
        if (!file) {
            return undefined;
        }
        const args = typeConverters.Position.toFileLocationRequestArgs(file, position);
        const response = await this.client.execute(definitionType, args, token);
        if (response.type !== 'response' || !response.body) {
            return undefined;
        }
        return response.body.map(location => typeConverters.Location.fromTextSpan(this.client.toResource(location.file), location));
    }
}
exports.default = TypeScriptDefinitionProviderBase;
//# sourceMappingURL=definitionProviderBase.js.map