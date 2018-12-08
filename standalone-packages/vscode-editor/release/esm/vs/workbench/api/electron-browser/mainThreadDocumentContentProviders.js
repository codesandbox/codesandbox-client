/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { onUnexpectedError } from '../../../base/common/errors.js';
import { URI } from '../../../base/common/uri.js';
import { EditOperation } from '../../../editor/common/core/editOperation.js';
import { Range } from '../../../editor/common/core/range.js';
import { IEditorWorkerService } from '../../../editor/common/services/editorWorkerService.js';
import { IModelService } from '../../../editor/common/services/modelService.js';
import { IModeService } from '../../../editor/common/services/modeService.js';
import { ITextModelService } from '../../../editor/common/services/resolverService.js';
import { extHostNamedCustomer } from './extHostCustomers.js';
import { ExtHostContext, MainContext } from '../node/extHost.protocol.js';
import { CancellationTokenSource } from '../../../base/common/cancellation.js';
var MainThreadDocumentContentProviders = /** @class */ (function () {
    function MainThreadDocumentContentProviders(extHostContext, _textModelResolverService, _modeService, _modelService, _editorWorkerService) {
        this._textModelResolverService = _textModelResolverService;
        this._modeService = _modeService;
        this._modelService = _modelService;
        this._editorWorkerService = _editorWorkerService;
        this._resourceContentProvider = new Map();
        this._pendingUpdate = new Map();
        this._proxy = extHostContext.getProxy(ExtHostContext.ExtHostDocumentContentProviders);
    }
    MainThreadDocumentContentProviders.prototype.dispose = function () {
        this._resourceContentProvider.forEach(function (p) { return p.dispose(); });
        this._pendingUpdate.forEach(function (source) { return source.dispose(); });
    };
    MainThreadDocumentContentProviders.prototype.$registerTextContentProvider = function (handle, scheme) {
        var _this = this;
        var registration = this._textModelResolverService.registerTextModelContentProvider(scheme, {
            provideTextContent: function (uri) {
                return _this._proxy.$provideTextDocumentContent(handle, uri).then(function (value) {
                    if (typeof value === 'string') {
                        var firstLineText = value.substr(0, 1 + value.search(/\r?\n/));
                        var languageSelection = _this._modeService.createByFilepathOrFirstLine(uri.fsPath, firstLineText);
                        return _this._modelService.createModel(value, languageSelection, uri);
                    }
                    return undefined;
                });
            }
        });
        this._resourceContentProvider.set(handle, registration);
    };
    MainThreadDocumentContentProviders.prototype.$unregisterTextContentProvider = function (handle) {
        var registration = this._resourceContentProvider.get(handle);
        if (registration) {
            registration.dispose();
            this._resourceContentProvider.delete(handle);
        }
    };
    MainThreadDocumentContentProviders.prototype.$onVirtualDocumentChange = function (uri, value) {
        var _this = this;
        var model = this._modelService.getModel(URI.revive(uri));
        if (!model) {
            return;
        }
        // cancel and dispose an existing update
        if (this._pendingUpdate.has(model.id)) {
            this._pendingUpdate.get(model.id).cancel();
        }
        // create and keep update token
        var myToken = new CancellationTokenSource();
        this._pendingUpdate.set(model.id, myToken);
        this._editorWorkerService.computeMoreMinimalEdits(model.uri, [{ text: value, range: model.getFullModelRange() }]).then(function (edits) {
            // remove token
            _this._pendingUpdate.delete(model.id);
            if (myToken.token.isCancellationRequested) {
                // ignore this
                return;
            }
            if (edits.length > 0) {
                // use the evil-edit as these models show in readonly-editor only
                model.applyEdits(edits.map(function (edit) { return EditOperation.replace(Range.lift(edit.range), edit.text); }));
            }
        }).catch(onUnexpectedError);
    };
    MainThreadDocumentContentProviders = __decorate([
        extHostNamedCustomer(MainContext.MainThreadDocumentContentProviders),
        __param(1, ITextModelService),
        __param(2, IModeService),
        __param(3, IModelService),
        __param(4, IEditorWorkerService)
    ], MainThreadDocumentContentProviders);
    return MainThreadDocumentContentProviders;
}());
export { MainThreadDocumentContentProviders };
