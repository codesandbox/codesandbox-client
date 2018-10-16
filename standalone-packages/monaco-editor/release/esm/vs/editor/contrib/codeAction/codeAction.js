/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { flatten, isFalsyOrEmpty, mergeSort } from '../../../base/common/arrays.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { illegalArgument, isPromiseCanceledError, onUnexpectedExternalError } from '../../../base/common/errors.js';
import { URI } from '../../../base/common/uri.js';
import { registerLanguageCommand } from '../../browser/editorExtensions.js';
import { Range } from '../../common/core/range.js';
import { CodeActionProviderRegistry } from '../../common/modes.js';
import { IModelService } from '../../common/services/modelService.js';
import { CodeActionKind } from './codeActionTrigger.js';
export function getCodeActions(model, rangeOrSelection, trigger, token) {
    if (token === void 0) { token = CancellationToken.None; }
    var codeActionContext = {
        only: trigger && trigger.filter && trigger.filter.kind ? trigger.filter.kind.value : undefined,
        trigger: trigger && trigger.type === 'manual' ? 2 /* Manual */ : 1 /* Automatic */
    };
    var promises = CodeActionProviderRegistry.all(model)
        .filter(function (provider) {
        // Avoid calling providers that we know will not return code actions of interest
        return !provider.providedCodeActionKinds || provider.providedCodeActionKinds.some(function (providedKind) { return isValidActionKind(trigger && trigger.filter, providedKind); });
    })
        .map(function (support) {
        return Promise.resolve(support.provideCodeActions(model, rangeOrSelection, codeActionContext, token)).then(function (providedCodeActions) {
            if (!Array.isArray(providedCodeActions)) {
                return [];
            }
            return providedCodeActions.filter(function (action) { return isValidAction(trigger && trigger.filter, action); });
        }, function (err) {
            if (isPromiseCanceledError(err)) {
                throw err;
            }
            onUnexpectedExternalError(err);
            return [];
        });
    });
    return Promise.all(promises)
        .then(flatten)
        .then(function (allCodeActions) { return mergeSort(allCodeActions, codeActionsComparator); });
}
function isValidAction(filter, action) {
    return action && isValidActionKind(filter, action.kind);
}
function isValidActionKind(filter, kind) {
    // Filter out actions by kind
    if (filter && filter.kind && (!kind || !filter.kind.contains(kind))) {
        return false;
    }
    // Don't return source actions unless they are explicitly requested
    if (kind && CodeActionKind.Source.contains(kind) && (!filter || !filter.includeSourceActions)) {
        return false;
    }
    return true;
}
function codeActionsComparator(a, b) {
    var aHasDiags = !isFalsyOrEmpty(a.diagnostics);
    var bHasDiags = !isFalsyOrEmpty(b.diagnostics);
    if (aHasDiags) {
        if (bHasDiags) {
            return a.diagnostics[0].message.localeCompare(b.diagnostics[0].message);
        }
        else {
            return -1;
        }
    }
    else if (bHasDiags) {
        return 1;
    }
    else {
        return 0; // both have no diagnostics
    }
}
registerLanguageCommand('_executeCodeActionProvider', function (accessor, args) {
    var resource = args.resource, range = args.range;
    if (!(resource instanceof URI) || !Range.isIRange(range)) {
        throw illegalArgument();
    }
    var model = accessor.get(IModelService).getModel(resource);
    if (!model) {
        throw illegalArgument();
    }
    return getCodeActions(model, model.validateRange(range), { type: 'manual', filter: { includeSourceActions: true } });
});
