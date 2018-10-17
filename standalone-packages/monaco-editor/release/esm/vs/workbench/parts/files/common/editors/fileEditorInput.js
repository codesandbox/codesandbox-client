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
import { localize } from '../../../../../nls.js';
import { memoize } from '../../../../../base/common/decorators.js';
import * as paths from '../../../../../base/common/paths.js';
import * as resources from '../../../../../base/common/resources.js';
import { EditorInput } from '../../../../common/editor.js';
import { BinaryEditorModel } from '../../../../common/editor/binaryEditorModel.js';
import { ITextFileService } from '../../../../services/textfile/common/textfiles.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { telemetryURIDescriptor } from '../../../../../platform/telemetry/common/telemetryUtils.js';
import { ITextModelService } from '../../../../../editor/common/services/resolverService.js';
import { IHashService } from '../../../../services/hash/common/hashService.js';
import { FILE_EDITOR_INPUT_ID, TEXT_FILE_EDITOR_ID, BINARY_FILE_EDITOR_ID } from '../files.js';
import { ILabelService } from '../../../../../platform/label/common/label.js';
/**
 * A file editor input is the input type for the file editor of file system resources.
 */
var FileEditorInput = /** @class */ (function (_super) {
    __extends(FileEditorInput, _super);
    /**
     * An editor input who's contents are retrieved from file services.
     */
    function FileEditorInput(resource, preferredEncoding, instantiationService, textFileService, textModelResolverService, hashService, labelService) {
        var _this = _super.call(this) || this;
        _this.resource = resource;
        _this.instantiationService = instantiationService;
        _this.textFileService = textFileService;
        _this.textModelResolverService = textModelResolverService;
        _this.hashService = hashService;
        _this.labelService = labelService;
        _this.setPreferredEncoding(preferredEncoding);
        _this.registerListeners();
        return _this;
    }
    FileEditorInput.prototype.registerListeners = function () {
        var _this = this;
        // Model changes
        this._register(this.textFileService.models.onModelDirty(function (e) { return _this.onDirtyStateChange(e); }));
        this._register(this.textFileService.models.onModelSaveError(function (e) { return _this.onDirtyStateChange(e); }));
        this._register(this.textFileService.models.onModelSaved(function (e) { return _this.onDirtyStateChange(e); }));
        this._register(this.textFileService.models.onModelReverted(function (e) { return _this.onDirtyStateChange(e); }));
        this._register(this.textFileService.models.onModelOrphanedChanged(function (e) { return _this.onModelOrphanedChanged(e); }));
    };
    FileEditorInput.prototype.onDirtyStateChange = function (e) {
        if (e.resource.toString() === this.resource.toString()) {
            this._onDidChangeDirty.fire();
        }
    };
    FileEditorInput.prototype.onModelOrphanedChanged = function (e) {
        if (e.resource.toString() === this.resource.toString()) {
            this._onDidChangeLabel.fire();
        }
    };
    FileEditorInput.prototype.getResource = function () {
        return this.resource;
    };
    FileEditorInput.prototype.getEncoding = function () {
        var textModel = this.textFileService.models.get(this.resource);
        if (textModel) {
            return textModel.getEncoding();
        }
        return this.preferredEncoding;
    };
    FileEditorInput.prototype.getPreferredEncoding = function () {
        return this.preferredEncoding;
    };
    FileEditorInput.prototype.setEncoding = function (encoding, mode) {
        this.preferredEncoding = encoding;
        var textModel = this.textFileService.models.get(this.resource);
        if (textModel) {
            textModel.setEncoding(encoding, mode);
        }
    };
    FileEditorInput.prototype.setPreferredEncoding = function (encoding) {
        this.preferredEncoding = encoding;
        if (encoding) {
            this.forceOpenAsText = true; // encoding is a good hint to open the file as text
        }
    };
    FileEditorInput.prototype.setForceOpenAsText = function () {
        this.forceOpenAsText = true;
        this.forceOpenAsBinary = false;
    };
    FileEditorInput.prototype.setForceOpenAsBinary = function () {
        this.forceOpenAsBinary = true;
        this.forceOpenAsText = false;
    };
    FileEditorInput.prototype.getTypeId = function () {
        return FILE_EDITOR_INPUT_ID;
    };
    FileEditorInput.prototype.getName = function () {
        if (!this.name) {
            this.name = resources.basenameOrAuthority(this.resource);
        }
        return this.decorateLabel(this.name);
    };
    Object.defineProperty(FileEditorInput.prototype, "shortDescription", {
        get: function () {
            return paths.basename(this.labelService.getUriLabel(resources.dirname(this.resource)));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FileEditorInput.prototype, "mediumDescription", {
        get: function () {
            return this.labelService.getUriLabel(resources.dirname(this.resource), { relative: true });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FileEditorInput.prototype, "longDescription", {
        get: function () {
            return this.labelService.getUriLabel(resources.dirname(this.resource), { relative: true });
        },
        enumerable: true,
        configurable: true
    });
    FileEditorInput.prototype.getDescription = function (verbosity) {
        if (verbosity === void 0) { verbosity = 1 /* MEDIUM */; }
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
    Object.defineProperty(FileEditorInput.prototype, "shortTitle", {
        get: function () {
            return this.getName();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FileEditorInput.prototype, "mediumTitle", {
        get: function () {
            return this.labelService.getUriLabel(this.resource, { relative: true });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FileEditorInput.prototype, "longTitle", {
        get: function () {
            return this.labelService.getUriLabel(this.resource);
        },
        enumerable: true,
        configurable: true
    });
    FileEditorInput.prototype.getTitle = function (verbosity) {
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
        return this.decorateLabel(title);
    };
    FileEditorInput.prototype.decorateLabel = function (label) {
        var model = this.textFileService.models.get(this.resource);
        if (model && model.hasState(4 /* ORPHAN */)) {
            return localize('orphanedFile', "{0} (deleted from disk)", label);
        }
        if (model && model.isReadonly()) {
            return localize('readonlyFile', "{0} (read-only)", label);
        }
        return label;
    };
    FileEditorInput.prototype.isDirty = function () {
        var model = this.textFileService.models.get(this.resource);
        if (!model) {
            return false;
        }
        if (model.hasState(3 /* CONFLICT */) || model.hasState(5 /* ERROR */)) {
            return true; // always indicate dirty state if we are in conflict or error state
        }
        if (this.textFileService.getAutoSaveMode() === 1 /* AFTER_SHORT_DELAY */) {
            return false; // fast auto save enabled so we do not declare dirty
        }
        return model.isDirty();
    };
    FileEditorInput.prototype.confirmSave = function () {
        return this.textFileService.confirmSave([this.resource]);
    };
    FileEditorInput.prototype.save = function () {
        return this.textFileService.save(this.resource);
    };
    FileEditorInput.prototype.revert = function (options) {
        return this.textFileService.revert(this.resource, options);
    };
    FileEditorInput.prototype.getPreferredEditorId = function (candidates) {
        return this.forceOpenAsBinary ? BINARY_FILE_EDITOR_ID : TEXT_FILE_EDITOR_ID;
    };
    FileEditorInput.prototype.resolve = function () {
        // Resolve as binary
        if (this.forceOpenAsBinary) {
            return this.doResolveAsBinary();
        }
        // Resolve as text
        return this.doResolveAsText();
    };
    FileEditorInput.prototype.doResolveAsText = function () {
        var _this = this;
        // Resolve as text
        return this.textFileService.models.loadOrCreate(this.resource, {
            encoding: this.preferredEncoding,
            reload: { async: true },
            allowBinary: this.forceOpenAsText,
            reason: 1 /* EDITOR */
        }).then(function (model) {
            // This is a bit ugly, because we first resolve the model and then resolve a model reference. the reason being that binary
            // or very large files do not resolve to a text file model but should be opened as binary files without text. First calling into
            // loadOrCreate ensures we are not creating model references for these kind of resources.
            // In addition we have a bit of payload to take into account (encoding, reload) that the text resolver does not handle yet.
            if (!_this.textModelReference) {
                _this.textModelReference = _this.textModelResolverService.createModelReference(_this.resource);
            }
            return _this.textModelReference.then(function (ref) { return ref.object; });
        }, function (error) {
            // In case of an error that indicates that the file is binary or too large, just return with the binary editor model
            if (error.fileOperationResult === 0 /* FILE_IS_BINARY */ || error.fileOperationResult === 8 /* FILE_TOO_LARGE */) {
                return _this.doResolveAsBinary();
            }
            // Bubble any other error up
            return Promise.reject(error);
        });
    };
    FileEditorInput.prototype.doResolveAsBinary = function () {
        return this.instantiationService.createInstance(BinaryEditorModel, this.resource, this.getName()).load().then(function (m) { return m; });
    };
    FileEditorInput.prototype.isResolved = function () {
        return !!this.textFileService.models.get(this.resource);
    };
    FileEditorInput.prototype.getTelemetryDescriptor = function () {
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
    FileEditorInput.prototype.dispose = function () {
        // Model reference
        if (this.textModelReference) {
            this.textModelReference.then(function (ref) { return ref.dispose(); });
            this.textModelReference = null;
        }
        _super.prototype.dispose.call(this);
    };
    FileEditorInput.prototype.matches = function (otherInput) {
        if (_super.prototype.matches.call(this, otherInput) === true) {
            return true;
        }
        if (otherInput) {
            return otherInput instanceof FileEditorInput && otherInput.resource.toString() === this.resource.toString();
        }
        return false;
    };
    __decorate([
        memoize
    ], FileEditorInput.prototype, "shortDescription", null);
    __decorate([
        memoize
    ], FileEditorInput.prototype, "mediumDescription", null);
    __decorate([
        memoize
    ], FileEditorInput.prototype, "longDescription", null);
    __decorate([
        memoize
    ], FileEditorInput.prototype, "shortTitle", null);
    __decorate([
        memoize
    ], FileEditorInput.prototype, "mediumTitle", null);
    __decorate([
        memoize
    ], FileEditorInput.prototype, "longTitle", null);
    FileEditorInput = __decorate([
        __param(2, IInstantiationService),
        __param(3, ITextFileService),
        __param(4, ITextModelService),
        __param(5, IHashService),
        __param(6, ILabelService)
    ], FileEditorInput);
    return FileEditorInput;
}(EditorInput));
export { FileEditorInput };
