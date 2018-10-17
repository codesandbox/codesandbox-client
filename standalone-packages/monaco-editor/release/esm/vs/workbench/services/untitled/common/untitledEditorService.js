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
import { URI } from '../../../../base/common/uri.js';
import { createDecorator, IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import * as arrays from '../../../../base/common/arrays.js';
import { UntitledEditorInput } from '../../../common/editor/untitledEditorInput.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { Emitter, once } from '../../../../base/common/event.js';
import { ResourceMap } from '../../../../base/common/map.js';
import { Schemas } from '../../../../base/common/network.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
export var IUntitledEditorService = createDecorator('untitledEditorService');
var UntitledEditorService = /** @class */ (function (_super) {
    __extends(UntitledEditorService, _super);
    function UntitledEditorService(instantiationService, configurationService) {
        var _this = _super.call(this) || this;
        _this.instantiationService = instantiationService;
        _this.configurationService = configurationService;
        _this.mapResourceToInput = new ResourceMap();
        _this.mapResourceToAssociatedFilePath = new ResourceMap();
        _this._onDidChangeContent = _this._register(new Emitter());
        _this._onDidChangeDirty = _this._register(new Emitter());
        _this._onDidChangeEncoding = _this._register(new Emitter());
        _this._onDidDisposeModel = _this._register(new Emitter());
        return _this;
    }
    Object.defineProperty(UntitledEditorService.prototype, "onDidChangeContent", {
        get: function () { return this._onDidChangeContent.event; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UntitledEditorService.prototype, "onDidChangeDirty", {
        get: function () { return this._onDidChangeDirty.event; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UntitledEditorService.prototype, "onDidChangeEncoding", {
        get: function () { return this._onDidChangeEncoding.event; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UntitledEditorService.prototype, "onDidDisposeModel", {
        get: function () { return this._onDidDisposeModel.event; },
        enumerable: true,
        configurable: true
    });
    UntitledEditorService.prototype.get = function (resource) {
        return this.mapResourceToInput.get(resource);
    };
    UntitledEditorService.prototype.getAll = function (resources) {
        var _this = this;
        if (resources) {
            return arrays.coalesce(resources.map(function (r) { return _this.get(r); }));
        }
        return this.mapResourceToInput.values();
    };
    UntitledEditorService.prototype.exists = function (resource) {
        return this.mapResourceToInput.has(resource);
    };
    UntitledEditorService.prototype.revertAll = function (resources, force) {
        var reverted = [];
        var untitledInputs = this.getAll(resources);
        untitledInputs.forEach(function (input) {
            if (input) {
                input.revert();
                input.dispose();
                reverted.push(input.getResource());
            }
        });
        return reverted;
    };
    UntitledEditorService.prototype.isDirty = function (resource) {
        var input = this.get(resource);
        return input && input.isDirty();
    };
    UntitledEditorService.prototype.getDirty = function (resources) {
        var _this = this;
        var inputs;
        if (resources) {
            inputs = resources.map(function (r) { return _this.get(r); }).filter(function (i) { return !!i; });
        }
        else {
            inputs = this.mapResourceToInput.values();
        }
        return inputs
            .filter(function (i) { return i.isDirty(); })
            .map(function (i) { return i.getResource(); });
    };
    UntitledEditorService.prototype.loadOrCreate = function (options) {
        if (options === void 0) { options = Object.create(null); }
        return this.createOrGet(options.resource, options.modeId, options.initialValue, options.encoding, options.useResourcePath).resolve();
    };
    UntitledEditorService.prototype.createOrGet = function (resource, modeId, initialValue, encoding, hasAssociatedFilePath) {
        if (hasAssociatedFilePath === void 0) { hasAssociatedFilePath = false; }
        if (resource) {
            // Massage resource if it comes with a file:// scheme
            if (resource.scheme === Schemas.file) {
                hasAssociatedFilePath = true;
                resource = resource.with({ scheme: Schemas.untitled }); // ensure we have the right scheme
            }
            if (hasAssociatedFilePath) {
                this.mapResourceToAssociatedFilePath.set(resource, true); // remember for future lookups
            }
        }
        // Return existing instance if asked for it
        if (resource && this.mapResourceToInput.has(resource)) {
            return this.mapResourceToInput.get(resource);
        }
        // Create new otherwise
        return this.doCreate(resource, hasAssociatedFilePath, modeId, initialValue, encoding);
    };
    UntitledEditorService.prototype.doCreate = function (resource, hasAssociatedFilePath, modeId, initialValue, encoding) {
        var _this = this;
        if (!resource) {
            // Create new taking a resource URI that is not already taken
            var counter = this.mapResourceToInput.size + 1;
            do {
                resource = URI.from({ scheme: Schemas.untitled, path: "Untitled-" + counter });
                counter++;
            } while (this.mapResourceToInput.has(resource));
        }
        // Look up default language from settings if any
        if (!modeId && !hasAssociatedFilePath) {
            var configuration = this.configurationService.getValue();
            if (configuration.files && configuration.files.defaultLanguage) {
                modeId = configuration.files.defaultLanguage;
            }
        }
        var input = this.instantiationService.createInstance(UntitledEditorInput, resource, hasAssociatedFilePath, modeId, initialValue, encoding);
        var contentListener = input.onDidModelChangeContent(function () {
            _this._onDidChangeContent.fire(resource);
        });
        var dirtyListener = input.onDidChangeDirty(function () {
            _this._onDidChangeDirty.fire(resource);
        });
        var encodingListener = input.onDidModelChangeEncoding(function () {
            _this._onDidChangeEncoding.fire(resource);
        });
        var disposeListener = input.onDispose(function () {
            _this._onDidDisposeModel.fire(resource);
        });
        // Remove from cache on dispose
        var onceDispose = once(input.onDispose);
        onceDispose(function () {
            _this.mapResourceToInput.delete(input.getResource());
            _this.mapResourceToAssociatedFilePath.delete(input.getResource());
            contentListener.dispose();
            dirtyListener.dispose();
            encodingListener.dispose();
            disposeListener.dispose();
        });
        // Add to cache
        this.mapResourceToInput.set(resource, input);
        return input;
    };
    UntitledEditorService.prototype.hasAssociatedFilePath = function (resource) {
        return this.mapResourceToAssociatedFilePath.has(resource);
    };
    UntitledEditorService.prototype.suggestFileName = function (resource) {
        var input = this.get(resource);
        return input ? input.suggestFileName() : void 0;
    };
    UntitledEditorService.prototype.getEncoding = function (resource) {
        var input = this.get(resource);
        return input ? input.getEncoding() : void 0;
    };
    UntitledEditorService = __decorate([
        __param(0, IInstantiationService),
        __param(1, IConfigurationService)
    ], UntitledEditorService);
    return UntitledEditorService;
}(Disposable));
export { UntitledEditorService };
