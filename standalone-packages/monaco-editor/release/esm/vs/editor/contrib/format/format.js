/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { illegalArgument, onUnexpectedExternalError } from '../../../base/common/errors.js';
import URI from '../../../base/common/uri.js';
import { isFalsyOrEmpty } from '../../../base/common/arrays.js';
import { TPromise } from '../../../base/common/winjs.base.js';
import { Range } from '../../common/core/range.js';
import { registerDefaultLanguageCommand, registerLanguageCommand } from '../../browser/editorExtensions.js';
import { DocumentFormattingEditProviderRegistry, DocumentRangeFormattingEditProviderRegistry, OnTypeFormattingEditProviderRegistry } from '../../common/modes.js';
import { IModelService } from '../../common/services/modelService.js';
import { asWinJsPromise, first } from '../../../base/common/async.js';
var NoProviderError = /** @class */ (function (_super) {
    __extends(NoProviderError, _super);
    function NoProviderError(message) {
        var _this = _super.call(this) || this;
        _this.name = NoProviderError.Name;
        _this.message = message;
        return _this;
    }
    NoProviderError.Name = 'NOPRO';
    return NoProviderError;
}(Error));
export { NoProviderError };
export function getDocumentRangeFormattingEdits(model, range, options) {
    var providers = DocumentRangeFormattingEditProviderRegistry.ordered(model);
    if (providers.length === 0) {
        return TPromise.wrapError(new NoProviderError());
    }
    return first(providers.map(function (provider) { return function () {
        return asWinJsPromise(function (token) { return provider.provideDocumentRangeFormattingEdits(model, range, options, token); })
            .then(undefined, onUnexpectedExternalError);
    }; }), function (result) { return !isFalsyOrEmpty(result); });
}
export function getDocumentFormattingEdits(model, options) {
    var providers = DocumentFormattingEditProviderRegistry.ordered(model);
    // try range formatters when no document formatter is registered
    if (providers.length === 0) {
        return getDocumentRangeFormattingEdits(model, model.getFullModelRange(), options);
    }
    return first(providers.map(function (provider) { return function () {
        return asWinJsPromise(function (token) { return provider.provideDocumentFormattingEdits(model, options, token); })
            .then(undefined, onUnexpectedExternalError);
    }; }), function (result) { return !isFalsyOrEmpty(result); });
}
export function getOnTypeFormattingEdits(model, position, ch, options) {
    var support = OnTypeFormattingEditProviderRegistry.ordered(model)[0];
    if (!support) {
        return TPromise.as(undefined);
    }
    if (support.autoFormatTriggerCharacters.indexOf(ch) < 0) {
        return TPromise.as(undefined);
    }
    return asWinJsPromise(function (token) {
        return support.provideOnTypeFormattingEdits(model, position, ch, options, token);
    }).then(function (r) { return r; }, onUnexpectedExternalError);
}
registerLanguageCommand('_executeFormatRangeProvider', function (accessor, args) {
    var resource = args.resource, range = args.range, options = args.options;
    if (!(resource instanceof URI) || !Range.isIRange(range)) {
        throw illegalArgument();
    }
    var model = accessor.get(IModelService).getModel(resource);
    if (!model) {
        throw illegalArgument('resource');
    }
    return getDocumentRangeFormattingEdits(model, Range.lift(range), options);
});
registerLanguageCommand('_executeFormatDocumentProvider', function (accessor, args) {
    var resource = args.resource, options = args.options;
    if (!(resource instanceof URI)) {
        throw illegalArgument('resource');
    }
    var model = accessor.get(IModelService).getModel(resource);
    if (!model) {
        throw illegalArgument('resource');
    }
    return getDocumentFormattingEdits(model, options);
});
registerDefaultLanguageCommand('_executeFormatOnTypeProvider', function (model, position, args) {
    var ch = args.ch, options = args.options;
    if (typeof ch !== 'string') {
        throw illegalArgument('ch');
    }
    return getOnTypeFormattingEdits(model, position, ch, options);
});
