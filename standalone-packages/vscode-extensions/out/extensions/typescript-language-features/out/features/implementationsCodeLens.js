"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const nls = require("vscode-nls");
const PConst = require("../protocol.const");
const api_1 = require("../utils/api");
const dependentRegistration_1 = require("../utils/dependentRegistration");
const baseCodeLensProvider_1 = require("./baseCodeLensProvider");
const typeConverters = require("../utils/typeConverters");
const localize = nls.loadMessageBundle();
class TypeScriptImplementationsCodeLensProvider extends baseCodeLensProvider_1.TypeScriptBaseCodeLensProvider {
    async resolveCodeLens(inputCodeLens, token) {
        const codeLens = inputCodeLens;
        const args = typeConverters.Position.toFileLocationRequestArgs(codeLens.file, codeLens.range.start);
        const response = await this.client.execute('implementation', args, token, { lowPriority: true });
        if (response.type !== 'response' || !response.body) {
            codeLens.command = response.type === 'cancelled'
                ? baseCodeLensProvider_1.TypeScriptBaseCodeLensProvider.cancelledCommand
                : baseCodeLensProvider_1.TypeScriptBaseCodeLensProvider.errorCommand;
            return codeLens;
        }
        const locations = response.body
            .map(reference => 
        // Only take first line on implementation: https://github.com/Microsoft/vscode/issues/23924
        new vscode.Location(this.client.toResource(reference.file), reference.start.line === reference.end.line
            ? typeConverters.Range.fromTextSpan(reference)
            : new vscode.Range(typeConverters.Position.fromLocation(reference.start), new vscode.Position(reference.start.line, 0))))
            // Exclude original from implementations
            .filter(location => !(location.uri.toString() === codeLens.document.toString() &&
            location.range.start.line === codeLens.range.start.line &&
            location.range.start.character === codeLens.range.start.character));
        codeLens.command = this.getCommand(locations, codeLens);
        return codeLens;
    }
    getCommand(locations, codeLens) {
        return {
            title: this.getTitle(locations),
            command: locations.length ? 'editor.action.showReferences' : '',
            arguments: [codeLens.document, codeLens.range.start, locations]
        };
    }
    getTitle(locations) {
        return locations.length === 1
            ? localize('oneImplementationLabel', '1 implementation')
            : localize('manyImplementationLabel', '{0} implementations', locations.length);
    }
    extractSymbol(document, item, _parent) {
        switch (item.kind) {
            case PConst.Kind.interface:
                return baseCodeLensProvider_1.getSymbolRange(document, item);
            case PConst.Kind.class:
            case PConst.Kind.memberFunction:
            case PConst.Kind.memberVariable:
            case PConst.Kind.memberGetAccessor:
            case PConst.Kind.memberSetAccessor:
                if (item.kindModifiers.match(/\babstract\b/g)) {
                    return baseCodeLensProvider_1.getSymbolRange(document, item);
                }
                break;
        }
        return null;
    }
}
TypeScriptImplementationsCodeLensProvider.minVersion = api_1.default.v220;
exports.default = TypeScriptImplementationsCodeLensProvider;
function register(selector, modeId, client, cachedResponse) {
    return new dependentRegistration_1.VersionDependentRegistration(client, TypeScriptImplementationsCodeLensProvider.minVersion, () => new dependentRegistration_1.ConfigurationDependentRegistration(modeId, 'implementationsCodeLens.enabled', () => {
        return vscode.languages.registerCodeLensProvider(selector, new TypeScriptImplementationsCodeLensProvider(client, cachedResponse));
    }));
}
exports.register = register;
//# sourceMappingURL=implementationsCodeLens.js.map