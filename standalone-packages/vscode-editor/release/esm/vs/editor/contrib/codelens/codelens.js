/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { mergeSort } from '../../../base/common/arrays.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { illegalArgument, onUnexpectedExternalError } from '../../../base/common/errors.js';
import { URI } from '../../../base/common/uri.js';
import { registerLanguageCommand } from '../../browser/editorExtensions.js';
import { CodeLensProviderRegistry } from '../../common/modes.js';
import { IModelService } from '../../common/services/modelService.js';
export function getCodeLensData(model, token) {
    var symbols = [];
    var provider = CodeLensProviderRegistry.ordered(model);
    var promises = provider.map(function (provider) { return Promise.resolve(provider.provideCodeLenses(model, token)).then(function (result) {
        if (Array.isArray(result)) {
            for (var _i = 0, result_1 = result; _i < result_1.length; _i++) {
                var symbol = result_1[_i];
                symbols.push({ symbol: symbol, provider: provider });
            }
        }
    }).catch(onUnexpectedExternalError); });
    return Promise.all(promises).then(function () {
        return mergeSort(symbols, function (a, b) {
            // sort by lineNumber, provider-rank, and column
            if (a.symbol.range.startLineNumber < b.symbol.range.startLineNumber) {
                return -1;
            }
            else if (a.symbol.range.startLineNumber > b.symbol.range.startLineNumber) {
                return 1;
            }
            else if (provider.indexOf(a.provider) < provider.indexOf(b.provider)) {
                return -1;
            }
            else if (provider.indexOf(a.provider) > provider.indexOf(b.provider)) {
                return 1;
            }
            else if (a.symbol.range.startColumn < b.symbol.range.startColumn) {
                return -1;
            }
            else if (a.symbol.range.startColumn > b.symbol.range.startColumn) {
                return 1;
            }
            else {
                return 0;
            }
        });
    });
}
registerLanguageCommand('_executeCodeLensProvider', function (accessor, args) {
    var resource = args.resource, itemResolveCount = args.itemResolveCount;
    if (!(resource instanceof URI)) {
        throw illegalArgument();
    }
    var model = accessor.get(IModelService).getModel(resource);
    if (!model) {
        throw illegalArgument();
    }
    var result = [];
    return getCodeLensData(model, CancellationToken.None).then(function (value) {
        var resolve = [];
        var _loop_1 = function (item) {
            if (typeof itemResolveCount === 'undefined' || Boolean(item.symbol.command)) {
                result.push(item.symbol);
            }
            else if (itemResolveCount-- > 0 && item.provider.resolveCodeLens) {
                resolve.push(Promise.resolve(item.provider.resolveCodeLens(model, item.symbol, CancellationToken.None)).then(function (symbol) { return result.push(symbol || item.symbol); }));
            }
        };
        for (var _i = 0, value_1 = value; _i < value_1.length; _i++) {
            var item = value_1[_i];
            _loop_1(item);
        }
        return Promise.all(resolve);
    }).then(function () {
        return result;
    });
});
