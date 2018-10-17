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
import * as nls from '../../../../nls.js';
import { VIEWLET_ID } from './files.js';
import { ITextFileService } from '../../../services/textfile/common/textfiles.js';
import { platform } from '../../../../base/common/platform.js';
import { IWindowService } from '../../../../platform/windows/common/windows.js';
import { ILifecycleService } from '../../../../platform/lifecycle/common/lifecycle.js';
import { dispose, Disposable } from '../../../../base/common/lifecycle.js';
import { IActivityService, NumberBadge } from '../../../services/activity/common/activity.js';
import { IUntitledEditorService } from '../../../services/untitled/common/untitledEditorService.js';
import * as arrays from '../../../../base/common/arrays.js';
import { IEditorService, ACTIVE_GROUP } from '../../../services/editor/common/editorService.js';
var DirtyFilesTracker = /** @class */ (function (_super) {
    __extends(DirtyFilesTracker, _super);
    function DirtyFilesTracker(textFileService, lifecycleService, editorService, activityService, windowService, untitledEditorService) {
        var _this = _super.call(this) || this;
        _this.textFileService = textFileService;
        _this.lifecycleService = lifecycleService;
        _this.editorService = editorService;
        _this.activityService = activityService;
        _this.windowService = windowService;
        _this.untitledEditorService = untitledEditorService;
        _this.isDocumentedEdited = false;
        _this.registerListeners();
        return _this;
    }
    DirtyFilesTracker.prototype.registerListeners = function () {
        var _this = this;
        // Local text file changes
        this._register(this.untitledEditorService.onDidChangeDirty(function (e) { return _this.onUntitledDidChangeDirty(e); }));
        this._register(this.textFileService.models.onModelsDirty(function (e) { return _this.onTextFilesDirty(e); }));
        this._register(this.textFileService.models.onModelsSaved(function (e) { return _this.onTextFilesSaved(e); }));
        this._register(this.textFileService.models.onModelsSaveError(function (e) { return _this.onTextFilesSaveError(e); }));
        this._register(this.textFileService.models.onModelsReverted(function (e) { return _this.onTextFilesReverted(e); }));
        // Lifecycle
        this.lifecycleService.onShutdown(this.dispose, this);
    };
    DirtyFilesTracker.prototype.onUntitledDidChangeDirty = function (resource) {
        var gotDirty = this.untitledEditorService.isDirty(resource);
        if ((!this.isDocumentedEdited && gotDirty) || (this.isDocumentedEdited && !gotDirty)) {
            this.updateDocumentEdited();
        }
        if (gotDirty || this.lastDirtyCount > 0) {
            this.updateActivityBadge();
        }
    };
    DirtyFilesTracker.prototype.onTextFilesDirty = function (e) {
        var _this = this;
        if ((this.textFileService.getAutoSaveMode() !== 1 /* AFTER_SHORT_DELAY */) && !this.isDocumentedEdited) {
            this.updateDocumentEdited(); // no indication needed when auto save is enabled for short delay
        }
        if (this.textFileService.getAutoSaveMode() !== 1 /* AFTER_SHORT_DELAY */) {
            this.updateActivityBadge(); // no indication needed when auto save is enabled for short delay
        }
        // If files become dirty but are not opened, we open it in the background unless there are pending to be saved
        this.doOpenDirtyResources(arrays.distinct(e.filter(function (e) {
            // Only dirty models that are not PENDING_SAVE
            var model = _this.textFileService.models.get(e.resource);
            var shouldOpen = model && model.isDirty() && !model.hasState(2 /* PENDING_SAVE */);
            // Only if not open already
            return shouldOpen && !_this.editorService.isOpen({ resource: e.resource });
        }).map(function (e) { return e.resource; }), function (r) { return r.toString(); }));
    };
    DirtyFilesTracker.prototype.doOpenDirtyResources = function (resources) {
        var activeEditor = this.editorService.activeControl;
        // Open
        this.editorService.openEditors(resources.map(function (resource) {
            return {
                resource: resource,
                options: { inactive: true, pinned: true, preserveFocus: true }
            };
        }), activeEditor ? activeEditor.group : ACTIVE_GROUP);
    };
    DirtyFilesTracker.prototype.onTextFilesSaved = function (e) {
        if (this.isDocumentedEdited) {
            this.updateDocumentEdited();
        }
        if (this.lastDirtyCount > 0) {
            this.updateActivityBadge();
        }
    };
    DirtyFilesTracker.prototype.onTextFilesSaveError = function (e) {
        if (!this.isDocumentedEdited) {
            this.updateDocumentEdited();
        }
        this.updateActivityBadge();
    };
    DirtyFilesTracker.prototype.onTextFilesReverted = function (e) {
        if (this.isDocumentedEdited) {
            this.updateDocumentEdited();
        }
        if (this.lastDirtyCount > 0) {
            this.updateActivityBadge();
        }
    };
    DirtyFilesTracker.prototype.updateActivityBadge = function () {
        var dirtyCount = this.textFileService.getDirty().length;
        this.lastDirtyCount = dirtyCount;
        dispose(this.badgeHandle);
        if (dirtyCount > 0) {
            this.badgeHandle = this.activityService.showActivity(VIEWLET_ID, new NumberBadge(dirtyCount, function (num) { return num === 1 ? nls.localize('dirtyFile', "1 unsaved file") : nls.localize('dirtyFiles', "{0} unsaved files", dirtyCount); }), 'explorer-viewlet-label');
        }
    };
    DirtyFilesTracker.prototype.updateDocumentEdited = function () {
        if (platform === 1 /* Mac */) {
            var hasDirtyFiles = this.textFileService.isDirty();
            this.isDocumentedEdited = hasDirtyFiles;
            this.windowService.setDocumentEdited(hasDirtyFiles);
        }
    };
    DirtyFilesTracker = __decorate([
        __param(0, ITextFileService),
        __param(1, ILifecycleService),
        __param(2, IEditorService),
        __param(3, IActivityService),
        __param(4, IWindowService),
        __param(5, IUntitledEditorService)
    ], DirtyFilesTracker);
    return DirtyFilesTracker;
}(Disposable));
export { DirtyFilesTracker };
