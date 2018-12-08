/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { illegalArgument, onUnexpectedExternalError } from '../../../base/common/errors.js';
import { URI } from '../../../base/common/uri.js';
import { Range } from '../../common/core/range.js';
import { registerLanguageCommand } from '../../browser/editorExtensions.js';
import { DocumentSymbolProviderRegistry } from '../../common/modes.js';
import { IModelService } from '../../common/services/modelService.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
export function getDocumentSymbols(model, flat, token) {
    var roots = [];
    var promises = DocumentSymbolProviderRegistry.all(model).map(function (support) {
        return Promise.resolve(support.provideDocumentSymbols(model, token)).then(function (result) {
            if (Array.isArray(result)) {
                roots.push.apply(roots, result);
            }
        }, function (err) {
            onUnexpectedExternalError(err);
        });
    });
    return Promise.all(promises).then(function () {
        var flatEntries = [];
        if (token.isCancellationRequested) {
            return flatEntries;
        }
        if (flat) {
            flatten(flatEntries, roots, '');
        }
        else {
            flatEntries = roots;
        }
        flatEntries.sort(compareEntriesUsingStart);
        return flatEntries;
    });
}
function compareEntriesUsingStart(a, b) {
    return Range.compareRangesUsingStarts(a.range, b.range);
}
function flatten(bucket, entries, overrideContainerLabel) {
    for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
        var entry = entries_1[_i];
        bucket.push({
            kind: entry.kind,
            name: entry.name,
            detail: entry.detail,
            containerName: entry.containerName || overrideContainerLabel,
            range: entry.range,
            selectionRange: entry.selectionRange,
            children: undefined,
        });
        if (entry.children) {
            flatten(bucket, entry.children, entry.name);
        }
    }
}
registerLanguageCommand('_executeDocumentSymbolProvider', function (accessor, args) {
    var resource = args.resource;
    if (!(resource instanceof URI)) {
        throw illegalArgument('resource');
    }
    var model = accessor.get(IModelService).getModel(resource);
    if (!model) {
        throw illegalArgument('resource');
    }
    return getDocumentSymbols(model, false, CancellationToken.None);
});
