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
import { BaseTextEditorModel } from './textEditorModel.js';
import { PLAINTEXT_MODE_ID } from '../../../editor/common/modes/modesRegistry.js';
import { CONTENT_CHANGE_EVENT_BUFFER_DELAY } from '../../../platform/files/common/files.js';
import { IModeService } from '../../../editor/common/services/modeService.js';
import { IModelService } from '../../../editor/common/services/modelService.js';
import { Emitter } from '../../../base/common/event.js';
import { RunOnceScheduler } from '../../../base/common/async.js';
import { IBackupFileService } from '../../services/backup/common/backup.js';
import { ITextResourceConfigurationService } from '../../../editor/common/services/resourceConfiguration.js';
import { createTextBufferFactory } from '../../../editor/common/model/textModel.js';
var UntitledEditorModel = /** @class */ (function (_super) {
    __extends(UntitledEditorModel, _super);
    function UntitledEditorModel(modeId, resource, hasAssociatedFilePath, initialValue, preferredEncoding, modeService, modelService, backupFileService, configurationService) {
        var _this = _super.call(this, modelService, modeService) || this;
        _this.modeId = modeId;
        _this.resource = resource;
        _this.hasAssociatedFilePath = hasAssociatedFilePath;
        _this.initialValue = initialValue;
        _this.preferredEncoding = preferredEncoding;
        _this.backupFileService = backupFileService;
        _this.configurationService = configurationService;
        _this._onDidChangeContent = _this._register(new Emitter());
        _this._onDidChangeDirty = _this._register(new Emitter());
        _this._onDidChangeEncoding = _this._register(new Emitter());
        _this.dirty = false;
        _this.versionId = 0;
        _this.contentChangeEventScheduler = _this._register(new RunOnceScheduler(function () { return _this._onDidChangeContent.fire(); }, UntitledEditorModel.DEFAULT_CONTENT_CHANGE_BUFFER_DELAY));
        _this.registerListeners();
        return _this;
    }
    Object.defineProperty(UntitledEditorModel.prototype, "onDidChangeContent", {
        get: function () { return this._onDidChangeContent.event; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UntitledEditorModel.prototype, "onDidChangeDirty", {
        get: function () { return this._onDidChangeDirty.event; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UntitledEditorModel.prototype, "onDidChangeEncoding", {
        get: function () { return this._onDidChangeEncoding.event; },
        enumerable: true,
        configurable: true
    });
    UntitledEditorModel.prototype.getOrCreateMode = function (modeService, modeId, firstLineText) {
        if (!modeId || modeId === PLAINTEXT_MODE_ID) {
            return modeService.getOrCreateModeByFilepathOrFirstLine(this.resource.fsPath, firstLineText); // lookup mode via resource path if the provided modeId is unspecific
        }
        return _super.prototype.getOrCreateMode.call(this, modeService, modeId, firstLineText);
    };
    UntitledEditorModel.prototype.registerListeners = function () {
        var _this = this;
        // Config Changes
        this._register(this.configurationService.onDidChangeConfiguration(function (e) { return _this.onConfigurationChange(); }));
    };
    UntitledEditorModel.prototype.onConfigurationChange = function () {
        var configuredEncoding = this.configurationService.getValue(this.resource, 'files.encoding');
        if (this.configuredEncoding !== configuredEncoding) {
            this.configuredEncoding = configuredEncoding;
            if (!this.preferredEncoding) {
                this._onDidChangeEncoding.fire(); // do not fire event if we have a preferred encoding set
            }
        }
    };
    UntitledEditorModel.prototype.getVersionId = function () {
        return this.versionId;
    };
    UntitledEditorModel.prototype.getModeId = function () {
        if (this.textEditorModel) {
            return this.textEditorModel.getLanguageIdentifier().language;
        }
        return null;
    };
    UntitledEditorModel.prototype.getEncoding = function () {
        return this.preferredEncoding || this.configuredEncoding;
    };
    UntitledEditorModel.prototype.setEncoding = function (encoding) {
        var oldEncoding = this.getEncoding();
        this.preferredEncoding = encoding;
        // Emit if it changed
        if (oldEncoding !== this.preferredEncoding) {
            this._onDidChangeEncoding.fire();
        }
    };
    UntitledEditorModel.prototype.isDirty = function () {
        return this.dirty;
    };
    UntitledEditorModel.prototype.setDirty = function (dirty) {
        if (this.dirty === dirty) {
            return;
        }
        this.dirty = dirty;
        this._onDidChangeDirty.fire();
    };
    UntitledEditorModel.prototype.getResource = function () {
        return this.resource;
    };
    UntitledEditorModel.prototype.revert = function () {
        this.setDirty(false);
        // Handle content change event buffered
        this.contentChangeEventScheduler.schedule();
    };
    UntitledEditorModel.prototype.load = function () {
        var _this = this;
        // Check for backups first
        return this.backupFileService.loadBackupResource(this.resource).then(function (backupResource) {
            if (backupResource) {
                return _this.backupFileService.resolveBackupContent(backupResource);
            }
            return null;
        }).then(function (backupTextBufferFactory) {
            var hasBackup = !!backupTextBufferFactory;
            // untitled associated to file path are dirty right away as well as untitled with content
            _this.setDirty(_this.hasAssociatedFilePath || hasBackup);
            var untitledContents;
            if (backupTextBufferFactory) {
                untitledContents = backupTextBufferFactory;
            }
            else {
                untitledContents = createTextBufferFactory(_this.initialValue || '');
            }
            return _this.doLoad(untitledContents).then(function (model) {
                // Encoding
                _this.configuredEncoding = _this.configurationService.getValue(_this.resource, 'files.encoding');
                // Listen to content changes
                _this._register(_this.textEditorModel.onDidChangeContent(function () { return _this.onModelContentChanged(); }));
                // Listen to mode changes
                _this._register(_this.textEditorModel.onDidChangeLanguage(function () { return _this.onConfigurationChange(); })); // mode change can have impact on config
                return model;
            });
        });
    };
    UntitledEditorModel.prototype.doLoad = function (content) {
        var _this = this;
        // Create text editor model if not yet done
        if (!this.textEditorModel) {
            return this.createTextEditorModel(content, this.resource, this.modeId).then(function (model) { return _this; });
        }
        // Otherwise update
        else {
            this.updateTextEditorModel(content);
        }
        return TPromise.as(this);
    };
    UntitledEditorModel.prototype.onModelContentChanged = function () {
        this.versionId++;
        // mark the untitled editor as non-dirty once its content becomes empty and we do
        // not have an associated path set. we never want dirty indicator in that case.
        if (!this.hasAssociatedFilePath && this.textEditorModel.getLineCount() === 1 && this.textEditorModel.getLineContent(1) === '') {
            this.setDirty(false);
        }
        // turn dirty otherwise
        else {
            this.setDirty(true);
        }
        // Handle content change event buffered
        this.contentChangeEventScheduler.schedule();
    };
    UntitledEditorModel.prototype.isReadonly = function () {
        return false;
    };
    UntitledEditorModel.DEFAULT_CONTENT_CHANGE_BUFFER_DELAY = CONTENT_CHANGE_EVENT_BUFFER_DELAY;
    UntitledEditorModel = __decorate([
        __param(5, IModeService),
        __param(6, IModelService),
        __param(7, IBackupFileService),
        __param(8, ITextResourceConfigurationService)
    ], UntitledEditorModel);
    return UntitledEditorModel;
}(BaseTextEditorModel));
export { UntitledEditorModel };
