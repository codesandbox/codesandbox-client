/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { flatten, coalesce } from '../../../base/common/arrays';
import { CancellationToken } from '../../../base/common/cancellation';
import { onUnexpectedExternalError } from '../../../base/common/errors';
import { registerDefaultLanguageCommand } from '../../browser/editorExtensions';
import { DefinitionProviderRegistry, ImplementationProviderRegistry, TypeDefinitionProviderRegistry } from '../../common/modes';
function getDefinitions(model, position, registry, provide) {
    var provider = registry.ordered(model);
    // get results
    var promises = provider.map(function (provider) {
        return Promise.resolve(provide(provider, model, position)).then(undefined, function (err) {
            onUnexpectedExternalError(err);
            return null;
        });
    });
    return Promise.all(promises)
        .then(flatten)
        .then(function (references) { return coalesce(references); });
}
export function getDefinitionsAtPosition(model, position, token) {
    return getDefinitions(model, position, DefinitionProviderRegistry, function (provider, model, position) {
        return provider.provideDefinition(model, position, token);
    });
}
export function getImplementationsAtPosition(model, position, token) {
    return getDefinitions(model, position, ImplementationProviderRegistry, function (provider, model, position) {
        return provider.provideImplementation(model, position, token);
    });
}
export function getTypeDefinitionsAtPosition(model, position, token) {
    return getDefinitions(model, position, TypeDefinitionProviderRegistry, function (provider, model, position) {
        return provider.provideTypeDefinition(model, position, token);
    });
}
registerDefaultLanguageCommand('_executeDefinitionProvider', function (model, position) { return getDefinitionsAtPosition(model, position, CancellationToken.None); });
registerDefaultLanguageCommand('_executeImplementationProvider', function (model, position) { return getImplementationsAtPosition(model, position, CancellationToken.None); });
registerDefaultLanguageCommand('_executeTypeDefinitionProvider', function (model, position) { return getTypeDefinitionsAtPosition(model, position, CancellationToken.None); });
