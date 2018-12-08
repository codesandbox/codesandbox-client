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
import { toErrorMessage } from '../../../base/common/errorMessage.js';
import { dispose } from '../../../base/common/lifecycle.js';
import { Schemas } from '../../../base/common/network.js';
import { URI } from '../../../base/common/uri.js';
import { IModeService } from '../../../editor/common/services/modeService.js';
import { IModelService, shouldSynchronizeModel } from '../../../editor/common/services/modelService.js';
import { ITextModelService } from '../../../editor/common/services/resolverService.js';
import { IFileService } from '../../../platform/files/common/files.js';
import { ExtHostContext } from '../node/extHost.protocol.js';
import { ITextFileService } from '../../services/textfile/common/textfiles.js';
import { IUntitledEditorService } from '../../services/untitled/common/untitledEditorService.js';
var BoundModelReferenceCollection = /** @class */ (function () {
    function BoundModelReferenceCollection(_maxAge, _maxLength) {
        if (_maxAge === void 0) { _maxAge = 1000 * 60 * 3; }
        if (_maxLength === void 0) { _maxLength = 1024 * 1024 * 80; }
        this._maxAge = _maxAge;
        this._maxLength = _maxLength;
        this._data = new Array();
        this._length = 0;
        //
    }
    BoundModelReferenceCollection.prototype.dispose = function () {
        this._data = dispose(this._data);
    };
    BoundModelReferenceCollection.prototype.add = function (ref) {
        var _this = this;
        var length = ref.object.textEditorModel.getValueLength();
        var handle;
        var entry;
        var dispose = function () {
            var idx = _this._data.indexOf(entry);
            if (idx >= 0) {
                _this._length -= length;
                ref.dispose();
                clearTimeout(handle);
                _this._data.splice(idx, 1);
            }
        };
        handle = setTimeout(dispose, this._maxAge);
        entry = { length: length, dispose: dispose };
        this._data.push(entry);
        this._length += length;
        this._cleanup();
    };
    BoundModelReferenceCollection.prototype._cleanup = function () {
        while (this._length > this._maxLength) {
            this._data[0].dispose();
        }
    };
    return BoundModelReferenceCollection;
}());
export { BoundModelReferenceCollection };
var MainThreadDocuments = /** @class */ (function () {
    function MainThreadDocuments(documentsAndEditors, extHostContext, modelService, modeService, textFileService, fileService, textModelResolverService, untitledEditorService) {
        var _this = this;
        this._modelReferenceCollection = new BoundModelReferenceCollection();
        this._modelService = modelService;
        this._textModelResolverService = textModelResolverService;
        this._textFileService = textFileService;
        this._fileService = fileService;
        this._untitledEditorService = untitledEditorService;
        this._proxy = extHostContext.getProxy(ExtHostContext.ExtHostDocuments);
        this._modelIsSynced = {};
        this._toDispose = [];
        this._toDispose.push(documentsAndEditors.onDocumentAdd(function (models) { return models.forEach(_this._onModelAdded, _this); }));
        this._toDispose.push(documentsAndEditors.onDocumentRemove(function (urls) { return urls.forEach(_this._onModelRemoved, _this); }));
        this._toDispose.push(this._modelReferenceCollection);
        this._toDispose.push(modelService.onModelModeChanged(this._onModelModeChanged, this));
        this._toDispose.push(textFileService.models.onModelSaved(function (e) {
            if (_this._shouldHandleFileEvent(e)) {
                _this._proxy.$acceptModelSaved(e.resource);
            }
        }));
        this._toDispose.push(textFileService.models.onModelReverted(function (e) {
            if (_this._shouldHandleFileEvent(e)) {
                _this._proxy.$acceptDirtyStateChanged(e.resource, false);
            }
        }));
        this._toDispose.push(textFileService.models.onModelDirty(function (e) {
            if (_this._shouldHandleFileEvent(e)) {
                _this._proxy.$acceptDirtyStateChanged(e.resource, true);
            }
        }));
        this._modelToDisposeMap = Object.create(null);
    }
    MainThreadDocuments.prototype.dispose = function () {
        var _this = this;
        Object.keys(this._modelToDisposeMap).forEach(function (modelUrl) {
            _this._modelToDisposeMap[modelUrl].dispose();
        });
        this._modelToDisposeMap = Object.create(null);
        this._toDispose = dispose(this._toDispose);
    };
    MainThreadDocuments.prototype._shouldHandleFileEvent = function (e) {
        var model = this._modelService.getModel(e.resource);
        return model && shouldSynchronizeModel(model);
    };
    MainThreadDocuments.prototype._onModelAdded = function (model) {
        var _this = this;
        // Same filter as in mainThreadEditorsTracker
        if (!shouldSynchronizeModel(model)) {
            // don't synchronize too large models
            return null;
        }
        var modelUrl = model.uri;
        this._modelIsSynced[modelUrl.toString()] = true;
        this._modelToDisposeMap[modelUrl.toString()] = model.onDidChangeContent(function (e) {
            _this._proxy.$acceptModelChanged(modelUrl, e, _this._textFileService.isDirty(modelUrl));
        });
    };
    MainThreadDocuments.prototype._onModelModeChanged = function (event) {
        var model = event.model, oldModeId = event.oldModeId;
        var modelUrl = model.uri;
        if (!this._modelIsSynced[modelUrl.toString()]) {
            return;
        }
        this._proxy.$acceptModelModeChanged(model.uri, oldModeId, model.getLanguageIdentifier().language);
    };
    MainThreadDocuments.prototype._onModelRemoved = function (modelUrl) {
        var strModelUrl = modelUrl.toString();
        if (!this._modelIsSynced[strModelUrl]) {
            return;
        }
        delete this._modelIsSynced[strModelUrl];
        this._modelToDisposeMap[strModelUrl].dispose();
        delete this._modelToDisposeMap[strModelUrl];
    };
    // --- from extension host process
    MainThreadDocuments.prototype.$trySaveDocument = function (uri) {
        return this._textFileService.save(URI.revive(uri));
    };
    MainThreadDocuments.prototype.$tryOpenDocument = function (_uri) {
        var _this = this;
        var uri = URI.revive(_uri);
        if (!uri.scheme || !(uri.fsPath || uri.authority)) {
            return Promise.reject(new Error("Invalid uri. Scheme and authority or path must be set."));
        }
        var promise;
        switch (uri.scheme) {
            case Schemas.untitled:
                promise = this._handleUnititledScheme(uri);
                break;
            case Schemas.file:
            default:
                promise = this._handleAsResourceInput(uri);
                break;
        }
        return promise.then(function (success) {
            if (!success) {
                return Promise.reject(new Error('cannot open ' + uri.toString()));
            }
            else if (!_this._modelIsSynced[uri.toString()]) {
                return Promise.reject(new Error('cannot open ' + uri.toString() + '. Detail: Files above 50MB cannot be synchronized with extensions.'));
            }
            else {
                return undefined;
            }
        }, function (err) {
            return Promise.reject(new Error('cannot open ' + uri.toString() + '. Detail: ' + toErrorMessage(err)));
        });
    };
    MainThreadDocuments.prototype.$tryCreateDocument = function (options) {
        return this._doCreateUntitled(void 0, options ? options.language : void 0, options ? options.content : void 0);
    };
    MainThreadDocuments.prototype._handleAsResourceInput = function (uri) {
        var _this = this;
        return this._textModelResolverService.createModelReference(uri).then(function (ref) {
            _this._modelReferenceCollection.add(ref);
            var result = !!ref.object;
            return result;
        });
    };
    MainThreadDocuments.prototype._handleUnititledScheme = function (uri) {
        var _this = this;
        var asFileUri = uri.with({ scheme: Schemas.file });
        return this._fileService.resolveFile(asFileUri).then(function (stats) {
            // don't create a new file ontop of an existing file
            return Promise.reject(new Error('file already exists on disk'));
        }, function (err) {
            return _this._doCreateUntitled(uri).then(function (resource) { return !!resource; });
        });
    };
    MainThreadDocuments.prototype._doCreateUntitled = function (resource, modeId, initialValue) {
        var _this = this;
        return this._untitledEditorService.loadOrCreate({
            resource: resource,
            modeId: modeId,
            initialValue: initialValue,
            useResourcePath: Boolean(resource && resource.path)
        }).then(function (model) {
            var resource = model.getResource();
            if (!_this._modelIsSynced[resource.toString()]) {
                throw new Error("expected URI " + resource.toString() + " to have come to LIFE");
            }
            _this._proxy.$acceptDirtyStateChanged(resource, true); // mark as dirty
            return resource;
        });
    };
    MainThreadDocuments = __decorate([
        __param(2, IModelService),
        __param(3, IModeService),
        __param(4, ITextFileService),
        __param(5, IFileService),
        __param(6, ITextModelService),
        __param(7, IUntitledEditorService)
    ], MainThreadDocuments);
    return MainThreadDocuments;
}());
export { MainThreadDocuments };
