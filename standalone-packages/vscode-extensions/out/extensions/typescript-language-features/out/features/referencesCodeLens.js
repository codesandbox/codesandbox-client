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
const typeConverters = require("../utils/typeConverters");
const baseCodeLensProvider_1 = require("./baseCodeLensProvider");
const localize = nls.loadMessageBundle();
class TypeScriptReferencesCodeLensProvider extends baseCodeLensProvider_1.TypeScriptBaseCodeLensProvider {
    async resolveCodeLens(inputCodeLens, token) {
        const codeLens = inputCodeLens;
        const args = typeConverters.Position.toFileLocationRequestArgs(codeLens.file, codeLens.range.start);
        const response = await this.client.execute('references', args, token, { lowPriority: true });
        if (response.type !== 'response' || !response.body) {
            codeLens.command = response.type === 'cancelled'
                ? baseCodeLensProvider_1.TypeScriptBaseCodeLensProvider.cancelledCommand
                : baseCodeLensProvider_1.TypeScriptBaseCodeLensProvider.errorCommand;
            return codeLens;
        }
        const locations = response.body.refs
            .map(reference => typeConverters.Location.fromTextSpan(this.client.toResource(reference.file), reference))
            .filter(location => 
        // Exclude original definition from references
        !(location.uri.toString() === codeLens.document.toString() &&
            location.range.start.isEqual(codeLens.range.start)));
        codeLens.command = {
            title: this.getCodeLensLabel(locations),
            command: locations.length ? 'editor.action.showReferences' : '',
            arguments: [codeLens.document, codeLens.range.start, locations]
        };
        return codeLens;
    }
    getCodeLensLabel(locations) {
        return locations.length === 1
            ? localize('oneReferenceLabel', '1 reference')
            : localize('manyReferenceLabel', '{0} references', locations.length);
    }
    extractSymbol(document, item, parent) {
        if (parent && parent.kind === PConst.Kind.enum) {
            return baseCodeLensProvider_1.getSymbolRange(document, item);
        }
        switch (item.kind) {
            case PConst.Kind.const:
            case PConst.Kind.let:
            case PConst.Kind.variable:
            case PConst.Kind.function:
                // Only show references for exported variables
                if (!item.kindModifiers.match(/\bexport\b/)) {
                    break;
                }
            // fallthrough
            case PConst.Kind.class:
                if (item.text === '<class>') {
                    break;
                }
            // fallthrough
            case PConst.Kind.memberFunction:
            case PConst.Kind.memberVariable:
            case PConst.Kind.memberGetAccessor:
            case PConst.Kind.memberSetAccessor:
            case PConst.Kind.constructorImplementation:
            case PConst.Kind.interface:
            case PConst.Kind.type:
            case PConst.Kind.enum:
                return baseCodeLensProvider_1.getSymbolRange(document, item);
        }
        return null;
    }
}
TypeScriptReferencesCodeLensProvider.minVersion = api_1.default.v206;
function register(selector, modeId, client, cachedResponse) {
    return new dependentRegistration_1.VersionDependentRegistration(client, TypeScriptReferencesCodeLensProvider.minVersion, () => new dependentRegistration_1.ConfigurationDependentRegistration(modeId, 'referencesCodeLens.enabled', () => {
        return vscode.languages.registerCodeLensProvider(selector, new TypeScriptReferencesCodeLensProvider(client, cachedResponse));
    }));
}
exports.register = register;
//# sourceMappingURL=referencesCodeLens.js.map