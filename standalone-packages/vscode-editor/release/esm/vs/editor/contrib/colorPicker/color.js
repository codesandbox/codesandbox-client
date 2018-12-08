/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { CancellationToken } from '../../../base/common/cancellation.js';
import { illegalArgument } from '../../../base/common/errors.js';
import { URI } from '../../../base/common/uri.js';
import { registerLanguageCommand } from '../../browser/editorExtensions.js';
import { Range } from '../../common/core/range.js';
import { ColorProviderRegistry } from '../../common/modes.js';
import { IModelService } from '../../common/services/modelService.js';
export function getColors(model, token) {
    var colors = [];
    var providers = ColorProviderRegistry.ordered(model).reverse();
    var promises = providers.map(function (provider) { return Promise.resolve(provider.provideDocumentColors(model, token)).then(function (result) {
        if (Array.isArray(result)) {
            for (var _i = 0, result_1 = result; _i < result_1.length; _i++) {
                var colorInfo = result_1[_i];
                colors.push({ colorInfo: colorInfo, provider: provider });
            }
        }
    }); });
    return Promise.all(promises).then(function () { return colors; });
}
export function getColorPresentations(model, colorInfo, provider, token) {
    return Promise.resolve(provider.provideColorPresentations(model, colorInfo, token));
}
registerLanguageCommand('_executeDocumentColorProvider', function (accessor, args) {
    var resource = args.resource;
    if (!(resource instanceof URI)) {
        throw illegalArgument();
    }
    var model = accessor.get(IModelService).getModel(resource);
    if (!model) {
        throw illegalArgument();
    }
    var rawCIs = [];
    var providers = ColorProviderRegistry.ordered(model).reverse();
    var promises = providers.map(function (provider) { return Promise.resolve(provider.provideDocumentColors(model, CancellationToken.None)).then(function (result) {
        if (Array.isArray(result)) {
            for (var _i = 0, result_2 = result; _i < result_2.length; _i++) {
                var ci = result_2[_i];
                rawCIs.push({ range: ci.range, color: [ci.color.red, ci.color.green, ci.color.blue, ci.color.alpha] });
            }
        }
    }); });
    return Promise.all(promises).then(function () { return rawCIs; });
});
registerLanguageCommand('_executeColorPresentationProvider', function (accessor, args) {
    var resource = args.resource, color = args.color, range = args.range;
    if (!(resource instanceof URI) || !Array.isArray(color) || color.length !== 4 || !Range.isIRange(range)) {
        throw illegalArgument();
    }
    var red = color[0], green = color[1], blue = color[2], alpha = color[3];
    var model = accessor.get(IModelService).getModel(resource);
    if (!model) {
        throw illegalArgument();
    }
    var colorInfo = {
        range: range,
        color: { red: red, green: green, blue: blue, alpha: alpha }
    };
    var presentations = [];
    var providers = ColorProviderRegistry.ordered(model).reverse();
    var promises = providers.map(function (provider) { return Promise.resolve(provider.provideColorPresentations(model, colorInfo, CancellationToken.None)).then(function (result) {
        if (Array.isArray(result)) {
            presentations.push.apply(presentations, result);
        }
    }); });
    return Promise.all(promises).then(function () { return presentations; });
});
