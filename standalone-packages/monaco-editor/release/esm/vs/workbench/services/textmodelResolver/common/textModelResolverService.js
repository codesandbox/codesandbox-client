/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { TPromise } from '../../../../base/common/winjs.base.js';
import { URI } from '../../../../base/common/uri.js';
import { first } from '../../../../base/common/async.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { toDisposable, ReferenceCollection, ImmortalReference } from '../../../../base/common/lifecycle.js';
import { IModelService } from '../../../../editor/common/services/modelService.js';
import { ResourceEditorModel } from '../../../common/editor/resourceEditorModel.js';
import { ITextFileService } from '../../textfile/common/textfiles.js';
import * as network from '../../../../base/common/network.js';
import { IUntitledEditorService } from '../../untitled/common/untitledEditorService.js';
import { TextFileEditorModel } from '../../textfile/common/textFileEditorModel.js';
import { IFileService } from '../../../../platform/files/common/files.js';
var ResourceModelCollection = /** @class */ (function (_super) {
    __extends(ResourceModelCollection, _super);
    function ResourceModelCollection(instantiationService, textFileService, fileService) {
        var _this = _super.call(this) || this;
        _this.instantiationService = instantiationService;
        _this.textFileService = textFileService;
        _this.fileService = fileService;
        _this.providers = Object.create(null);
        return _this;
    }
    ResourceModelCollection.prototype.createReferencedObject = function (key) {
        var _this = this;
        var resource = URI.parse(key);
        if (this.fileService.canHandleResource(resource)) {
            return this.textFileService.models.loadOrCreate(resource, { reason: 2 /* REFERENCE */ });
        }
        return this.resolveTextModelContent(key).then(function () { return _this.instantiationService.createInstance(ResourceEditorModel, resource); });
    };
    ResourceModelCollection.prototype.destroyReferencedObject = function (modelPromise) {
        var _this = this;
        modelPromise.then(function (model) {
            if (model instanceof TextFileEditorModel) {
                _this.textFileService.models.disposeModel(model);
            }
            else {
                model.dispose();
            }
        }, function (err) {
            // ignore
        });
    };
    ResourceModelCollection.prototype.registerTextModelContentProvider = function (scheme, provider) {
        var registry = this.providers;
        var providers = registry[scheme] || (registry[scheme] = []);
        providers.unshift(provider);
        return toDisposable(function () {
            var array = registry[scheme];
            if (!array) {
                return;
            }
            var index = array.indexOf(provider);
            if (index === -1) {
                return;
            }
            array.splice(index, 1);
            if (array.length === 0) {
                delete registry[scheme];
            }
        });
    };
    ResourceModelCollection.prototype.resolveTextModelContent = function (key) {
        var resource = URI.parse(key);
        var providers = this.providers[resource.scheme] || [];
        var factories = providers.map(function (p) { return function () { return TPromise.wrap(p.provideTextContent(resource)); }; });
        return first(factories).then(function (model) {
            if (!model) {
                return TPromise.wrapError(new Error('resource is not available'));
            }
            return model;
        });
    };
    ResourceModelCollection = __decorate([
        __param(0, IInstantiationService),
        __param(1, ITextFileService),
        __param(2, IFileService)
    ], ResourceModelCollection);
    return ResourceModelCollection;
}(ReferenceCollection));
var TextModelResolverService = /** @class */ (function () {
    function TextModelResolverService(untitledEditorService, instantiationService, modelService) {
        this.untitledEditorService = untitledEditorService;
        this.instantiationService = instantiationService;
        this.modelService = modelService;
        this.resourceModelCollection = instantiationService.createInstance(ResourceModelCollection);
    }
    TextModelResolverService.prototype.createModelReference = function (resource) {
        return this._createModelReference(resource);
    };
    TextModelResolverService.prototype._createModelReference = function (resource) {
        // Untitled Schema: go through cached input
        if (resource.scheme === network.Schemas.untitled) {
            return this.untitledEditorService.loadOrCreate({ resource: resource }).then(function (model) { return new ImmortalReference(model); });
        }
        // InMemory Schema: go through model service cache
        if (resource.scheme === network.Schemas.inMemory) {
            var cachedModel = this.modelService.getModel(resource);
            if (!cachedModel) {
                return TPromise.wrapError(new Error('Cant resolve inmemory resource'));
            }
            return TPromise.as(new ImmortalReference(this.instantiationService.createInstance(ResourceEditorModel, resource)));
        }
        var ref = this.resourceModelCollection.acquire(resource.toString());
        return ref.object.then(function (model) { return ({ object: model, dispose: function () { return ref.dispose(); } }); }, function (err) {
            ref.dispose();
            return TPromise.wrapError(err);
        });
    };
    TextModelResolverService.prototype.registerTextModelContentProvider = function (scheme, provider) {
        return this.resourceModelCollection.registerTextModelContentProvider(scheme, provider);
    };
    TextModelResolverService = __decorate([
        __param(0, IUntitledEditorService),
        __param(1, IInstantiationService),
        __param(2, IModelService)
    ], TextModelResolverService);
    return TextModelResolverService;
}());
export { TextModelResolverService };
