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
import { TPromise } from '../../../base/common/winjs.base.js';
import { suggestFilename } from '../../../base/common/mime.js';
import { memoize } from '../../../base/common/decorators.js';
import { PLAINTEXT_MODE_ID } from '../../../editor/common/modes/modesRegistry.js';
import * as paths from '../../../base/common/paths.js';
import * as resources from '../../../base/common/resources.js';
import { EditorInput } from '../editor.js';
import { UntitledEditorModel } from './untitledEditorModel.js';
import { IInstantiationService } from '../../../platform/instantiation/common/instantiation.js';
import { Emitter } from '../../../base/common/event.js';
import { ITextFileService } from '../../services/textfile/common/textfiles.js';
import { telemetryURIDescriptor } from '../../../platform/telemetry/common/telemetryUtils.js';
import { IHashService } from '../../services/hash/common/hashService.js';
import { ILabelService } from '../../../platform/label/common/label.js';
/**
 * An editor input to be used for untitled text buffers.
 */
var UntitledEditorInput = /** @class */ (function (_super) {
    __extends(UntitledEditorInput, _super);
    function UntitledEditorInput(resource, hasAssociatedFilePath, modeId, initialValue, preferredEncoding, instantiationService, textFileService, hashService, labelService) {
        var _this = _super.call(this) || this;
        _this.resource = resource;
        _this.modeId = modeId;
        _this.initialValue = initialValue;
        _this.preferredEncoding = preferredEncoding;
        _this.instantiationService = instantiationService;
        _this.textFileService = textFileService;
        _this.hashService = hashService;
        _this.labelService = labelService;
        _this._onDidModelChangeContent = _this._register(new Emitter());
        _this._onDidModelChangeEncoding = _this._register(new Emitter());
        _this._hasAssociatedFilePath = hasAssociatedFilePath;
        return _this;
    }
    Object.defineProperty(UntitledEditorInput.prototype, "onDidModelChangeContent", {
        get: function () { return this._onDidModelChangeContent.event; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UntitledEditorInput.prototype, "onDidModelChangeEncoding", {
        get: function () { return this._onDidModelChangeEncoding.event; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UntitledEditorInput.prototype, "hasAssociatedFilePath", {
        get: function () {
            return this._hasAssociatedFilePath;
        },
        enumerable: true,
        configurable: true
    });
    UntitledEditorInput.prototype.getTypeId = function () {
        return UntitledEditorInput.ID;
    };
    UntitledEditorInput.prototype.getResource = function () {
        return this.resource;
    };
    UntitledEditorInput.prototype.getModeId = function () {
        if (this.cachedModel) {
            return this.cachedModel.getModeId();
        }
        return this.modeId;
    };
    UntitledEditorInput.prototype.getName = function () {
        return this.hasAssociatedFilePath ? resources.basenameOrAuthority(this.resource) : this.resource.path;
    };
    Object.defineProperty(UntitledEditorInput.prototype, "shortDescription", {
        get: function () {
            return paths.basename(this.labelService.getUriLabel(resources.dirname(this.resource)));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UntitledEditorInput.prototype, "mediumDescription", {
        get: function () {
            return this.labelService.getUriLabel(resources.dirname(this.resource), { relative: true });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UntitledEditorInput.prototype, "longDescription", {
        get: function () {
            return this.labelService.getUriLabel(resources.dirname(this.resource));
        },
        enumerable: true,
        configurable: true
    });
    UntitledEditorInput.prototype.getDescription = function (verbosity) {
        if (verbosity === void 0) { verbosity = 1 /* MEDIUM */; }
        if (!this.hasAssociatedFilePath) {
            return null;
        }
        var description;
        switch (verbosity) {
            case 0 /* SHORT */:
                description = this.shortDescription;
                break;
            case 2 /* LONG */:
                description = this.longDescription;
                break;
            case 1 /* MEDIUM */:
            default:
                description = this.mediumDescription;
                break;
        }
        return description;
    };
    Object.defineProperty(UntitledEditorInput.prototype, "shortTitle", {
        get: function () {
            return this.getName();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UntitledEditorInput.prototype, "mediumTitle", {
        get: function () {
            return this.labelService.getUriLabel(this.resource, { relative: true });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UntitledEditorInput.prototype, "longTitle", {
        get: function () {
            return this.labelService.getUriLabel(this.resource);
        },
        enumerable: true,
        configurable: true
    });
    UntitledEditorInput.prototype.getTitle = function (verbosity) {
        if (!this.hasAssociatedFilePath) {
            return this.getName();
        }
        var title;
        switch (verbosity) {
            case 0 /* SHORT */:
                title = this.shortTitle;
                break;
            case 1 /* MEDIUM */:
                title = this.mediumTitle;
                break;
            case 2 /* LONG */:
                title = this.longTitle;
                break;
        }
        return title;
    };
    UntitledEditorInput.prototype.isDirty = function () {
        if (this.cachedModel) {
            return this.cachedModel.isDirty();
        }
        // A disposed input is never dirty, even if it was restored from backup
        if (this.isDisposed()) {
            return false;
        }
        // untitled files with an associated path or associated resource
        return this.hasAssociatedFilePath;
    };
    UntitledEditorInput.prototype.confirmSave = function () {
        return this.textFileService.confirmSave([this.resource]);
    };
    UntitledEditorInput.prototype.save = function () {
        return this.textFileService.save(this.resource);
    };
    UntitledEditorInput.prototype.revert = function () {
        if (this.cachedModel) {
            this.cachedModel.revert();
        }
        this.dispose(); // a reverted untitled editor is no longer valid, so we dispose it
        return TPromise.as(true);
    };
    UntitledEditorInput.prototype.suggestFileName = function () {
        if (!this.hasAssociatedFilePath) {
            if (this.cachedModel) {
                var modeId = this.cachedModel.getModeId();
                if (modeId !== PLAINTEXT_MODE_ID) { // do not suggest when the mode ID is simple plain text
                    return suggestFilename(modeId, this.getName());
                }
            }
        }
        return this.getName();
    };
    UntitledEditorInput.prototype.getEncoding = function () {
        if (this.cachedModel) {
            return this.cachedModel.getEncoding();
        }
        return this.preferredEncoding;
    };
    UntitledEditorInput.prototype.setEncoding = function (encoding, mode /* ignored, we only have Encode */) {
        this.preferredEncoding = encoding;
        if (this.cachedModel) {
            this.cachedModel.setEncoding(encoding);
        }
    };
    UntitledEditorInput.prototype.resolve = function () {
        // Join a model resolve if we have had one before
        if (this.modelResolve) {
            return this.modelResolve;
        }
        // Otherwise Create Model and load
        this.cachedModel = this.createModel();
        this.modelResolve = this.cachedModel.load();
        return this.modelResolve;
    };
    UntitledEditorInput.prototype.createModel = function () {
        var _this = this;
        var model = this._register(this.instantiationService.createInstance(UntitledEditorModel, this.modeId, this.resource, this.hasAssociatedFilePath, this.initialValue, this.preferredEncoding));
        // re-emit some events from the model
        this._register(model.onDidChangeContent(function () { return _this._onDidModelChangeContent.fire(); }));
        this._register(model.onDidChangeDirty(function () { return _this._onDidChangeDirty.fire(); }));
        this._register(model.onDidChangeEncoding(function () { return _this._onDidModelChangeEncoding.fire(); }));
        return model;
    };
    UntitledEditorInput.prototype.getTelemetryDescriptor = function () {
        var _this = this;
        var descriptor = _super.prototype.getTelemetryDescriptor.call(this);
        descriptor['resource'] = telemetryURIDescriptor(this.getResource(), function (path) { return _this.hashService.createSHA1(path); });
        /* __GDPR__FRAGMENT__
            "EditorTelemetryDescriptor" : {
                "resource": { "${inline}": [ "${URIDescriptor}" ] }
            }
        */
        return descriptor;
    };
    UntitledEditorInput.prototype.matches = function (otherInput) {
        if (_super.prototype.matches.call(this, otherInput) === true) {
            return true;
        }
        if (otherInput instanceof UntitledEditorInput) {
            var otherUntitledEditorInput = otherInput;
            // Otherwise compare by properties
            return otherUntitledEditorInput.resource.toString() === this.resource.toString();
        }
        return false;
    };
    UntitledEditorInput.prototype.dispose = function () {
        this.modelResolve = void 0;
        _super.prototype.dispose.call(this);
    };
    UntitledEditorInput.ID = 'workbench.editors.untitledEditorInput';
    __decorate([
        memoize
    ], UntitledEditorInput.prototype, "shortDescription", null);
    __decorate([
        memoize
    ], UntitledEditorInput.prototype, "mediumDescription", null);
    __decorate([
        memoize
    ], UntitledEditorInput.prototype, "longDescription", null);
    __decorate([
        memoize
    ], UntitledEditorInput.prototype, "shortTitle", null);
    __decorate([
        memoize
    ], UntitledEditorInput.prototype, "mediumTitle", null);
    __decorate([
        memoize
    ], UntitledEditorInput.prototype, "longTitle", null);
    UntitledEditorInput = __decorate([
        __param(5, IInstantiationService),
        __param(6, ITextFileService),
        __param(7, IHashService),
        __param(8, ILabelService)
    ], UntitledEditorInput);
    return UntitledEditorInput;
}(EditorInput));
export { UntitledEditorInput };
