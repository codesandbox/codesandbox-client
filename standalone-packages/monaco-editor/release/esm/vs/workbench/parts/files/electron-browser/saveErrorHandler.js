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
import { toErrorMessage } from '../../../../base/common/errorMessage.js';
import * as paths from '../../../../base/common/paths.js';
import { Action } from '../../../../base/common/actions.js';
import { URI } from '../../../../base/common/uri.js';
import { ITextFileService } from '../../../services/textfile/common/textfiles.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { dispose, Disposable } from '../../../../base/common/lifecycle.js';
import { TextFileEditorModel } from '../../../services/textfile/common/textFileEditorModel.js';
import { ITextModelService } from '../../../../editor/common/services/resolverService.js';
import { ResourceMap } from '../../../../base/common/map.js';
import { DiffEditorInput } from '../../../common/editor/diffEditorInput.js';
import { ResourceEditorInput } from '../../../common/editor/resourceEditorInput.js';
import { IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { FileOnDiskContentProvider } from '../common/files.js';
import { FileEditorInput } from '../common/editors/fileEditorInput.js';
import { IModelService } from '../../../../editor/common/services/modelService.js';
import { SAVE_FILE_COMMAND_ID, REVERT_FILE_COMMAND_ID, SAVE_FILE_AS_COMMAND_ID, SAVE_FILE_AS_LABEL } from './fileCommands.js';
import { createTextBufferFactoryFromSnapshot } from '../../../../editor/common/model/textModel.js';
import { INotificationService, Severity } from '../../../../platform/notification/common/notification.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { ExecuteCommandAction } from '../../../../platform/actions/common/actions.js';
import { IEnvironmentService } from '../../../../platform/environment/common/environment.js';
import { once } from '../../../../base/common/event.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
export var CONFLICT_RESOLUTION_CONTEXT = 'saveConflictResolutionContext';
export var CONFLICT_RESOLUTION_SCHEME = 'conflictResolution';
var LEARN_MORE_DIRTY_WRITE_IGNORE_KEY = 'learnMoreDirtyWriteError';
var conflictEditorHelp = nls.localize('userGuide', "Use the actions in the editor tool bar to either undo your changes or overwrite the content on disk with your changes.");
// A handler for save error happening with conflict resolution actions
var SaveErrorHandler = /** @class */ (function (_super) {
    __extends(SaveErrorHandler, _super);
    function SaveErrorHandler(notificationService, textFileService, contextKeyService, editorService, textModelService, instantiationService, storageService) {
        var _this = _super.call(this) || this;
        _this.notificationService = notificationService;
        _this.textFileService = textFileService;
        _this.editorService = editorService;
        _this.instantiationService = instantiationService;
        _this.storageService = storageService;
        _this.messages = new ResourceMap();
        _this.conflictResolutionContext = new RawContextKey(CONFLICT_RESOLUTION_CONTEXT, false).bindTo(contextKeyService);
        var provider = _this._register(instantiationService.createInstance(FileOnDiskContentProvider));
        _this._register(textModelService.registerTextModelContentProvider(CONFLICT_RESOLUTION_SCHEME, provider));
        // Hook into model
        TextFileEditorModel.setSaveErrorHandler(_this);
        _this.registerListeners();
        return _this;
    }
    SaveErrorHandler.prototype.registerListeners = function () {
        var _this = this;
        this._register(this.textFileService.models.onModelSaved(function (e) { return _this.onFileSavedOrReverted(e.resource); }));
        this._register(this.textFileService.models.onModelReverted(function (e) { return _this.onFileSavedOrReverted(e.resource); }));
        this._register(this.editorService.onDidActiveEditorChange(function () { return _this.onActiveEditorChanged(); }));
    };
    SaveErrorHandler.prototype.onActiveEditorChanged = function () {
        var isActiveEditorSaveConflictResolution = false;
        var activeConflictResolutionResource;
        var activeInput = this.editorService.activeEditor;
        if (activeInput instanceof DiffEditorInput && activeInput.originalInput instanceof ResourceEditorInput && activeInput.modifiedInput instanceof FileEditorInput) {
            var resource = activeInput.originalInput.getResource();
            if (resource && resource.scheme === CONFLICT_RESOLUTION_SCHEME) {
                isActiveEditorSaveConflictResolution = true;
                activeConflictResolutionResource = activeInput.modifiedInput.getResource();
            }
        }
        this.conflictResolutionContext.set(isActiveEditorSaveConflictResolution);
        this.activeConflictResolutionResource = activeConflictResolutionResource;
    };
    SaveErrorHandler.prototype.onFileSavedOrReverted = function (resource) {
        var messageHandle = this.messages.get(resource);
        if (messageHandle) {
            messageHandle.close();
            this.messages.delete(resource);
        }
    };
    SaveErrorHandler.prototype.onSaveError = function (error, model) {
        var fileOperationError = error;
        var resource = model.getResource();
        var message;
        var actions = { primary: [], secondary: [] };
        // Dirty write prevention
        if (fileOperationError.fileOperationResult === 4 /* FILE_MODIFIED_SINCE */) {
            // If the user tried to save from the opened conflict editor, show its message again
            if (this.activeConflictResolutionResource && this.activeConflictResolutionResource.toString() === model.getResource().toString()) {
                if (this.storageService.getBoolean(LEARN_MORE_DIRTY_WRITE_IGNORE_KEY)) {
                    return; // return if this message is ignored
                }
                message = conflictEditorHelp;
                actions.primary.push(this.instantiationService.createInstance(ResolveConflictLearnMoreAction));
                actions.secondary.push(this.instantiationService.createInstance(DoNotShowResolveConflictLearnMoreAction));
            }
            // Otherwise show the message that will lead the user into the save conflict editor.
            else {
                message = nls.localize('staleSaveError', "Failed to save '{0}': The content on disk is newer. Please compare your version with the one on disk.", paths.basename(resource.fsPath));
                actions.primary.push(this.instantiationService.createInstance(ResolveSaveConflictAction, model));
            }
        }
        // Any other save error
        else {
            var isReadonly = fileOperationError.fileOperationResult === 6 /* FILE_READ_ONLY */;
            var triedToMakeWriteable = isReadonly && fileOperationError.options && fileOperationError.options.overwriteReadonly;
            var isPermissionDenied = fileOperationError.fileOperationResult === 7 /* FILE_PERMISSION_DENIED */;
            // Save Elevated
            if (isPermissionDenied || triedToMakeWriteable) {
                actions.primary.push(this.instantiationService.createInstance(SaveElevatedAction, model, triedToMakeWriteable));
            }
            // Overwrite
            else if (isReadonly) {
                actions.primary.push(this.instantiationService.createInstance(OverwriteReadonlyAction, model));
            }
            // Retry
            else {
                actions.primary.push(this.instantiationService.createInstance(ExecuteCommandAction, SAVE_FILE_COMMAND_ID, nls.localize('retry', "Retry")));
            }
            // Save As
            actions.primary.push(this.instantiationService.createInstance(ExecuteCommandAction, SAVE_FILE_AS_COMMAND_ID, SAVE_FILE_AS_LABEL));
            // Discard
            actions.primary.push(this.instantiationService.createInstance(ExecuteCommandAction, REVERT_FILE_COMMAND_ID, nls.localize('discard', "Discard")));
            if (isReadonly) {
                if (triedToMakeWriteable) {
                    message = nls.localize('readonlySaveErrorAdmin', "Failed to save '{0}': File is write protected. Select 'Overwrite as Admin' to retry as administrator.", paths.basename(resource.fsPath));
                }
                else {
                    message = nls.localize('readonlySaveError', "Failed to save '{0}': File is write protected. Select 'Overwrite' to attempt to remove protection.", paths.basename(resource.fsPath));
                }
            }
            else if (isPermissionDenied) {
                message = nls.localize('permissionDeniedSaveError', "Failed to save '{0}': Insufficient permissions. Select 'Retry as Admin' to retry as administrator.", paths.basename(resource.fsPath));
            }
            else {
                message = nls.localize('genericSaveError', "Failed to save '{0}': {1}", paths.basename(resource.fsPath), toErrorMessage(error, false));
            }
        }
        // Show message and keep function to hide in case the file gets saved/reverted
        var handle = this.notificationService.notify({ severity: Severity.Error, message: message, actions: actions });
        once(handle.onDidClose)(function () { return dispose.apply(void 0, actions.primary.concat(actions.secondary)); });
        this.messages.set(model.getResource(), handle);
    };
    SaveErrorHandler.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this.messages.clear();
    };
    SaveErrorHandler = __decorate([
        __param(0, INotificationService),
        __param(1, ITextFileService),
        __param(2, IContextKeyService),
        __param(3, IEditorService),
        __param(4, ITextModelService),
        __param(5, IInstantiationService),
        __param(6, IStorageService)
    ], SaveErrorHandler);
    return SaveErrorHandler;
}(Disposable));
export { SaveErrorHandler };
var pendingResolveSaveConflictMessages = [];
function clearPendingResolveSaveConflictMessages() {
    while (pendingResolveSaveConflictMessages.length > 0) {
        pendingResolveSaveConflictMessages.pop().close();
    }
}
var ResolveConflictLearnMoreAction = /** @class */ (function (_super) {
    __extends(ResolveConflictLearnMoreAction, _super);
    function ResolveConflictLearnMoreAction(openerService) {
        var _this = _super.call(this, 'workbench.files.action.resolveConflictLearnMore', nls.localize('learnMore', "Learn More")) || this;
        _this.openerService = openerService;
        return _this;
    }
    ResolveConflictLearnMoreAction.prototype.run = function () {
        return this.openerService.open(URI.parse('https://go.microsoft.com/fwlink/?linkid=868264'));
    };
    ResolveConflictLearnMoreAction = __decorate([
        __param(0, IOpenerService)
    ], ResolveConflictLearnMoreAction);
    return ResolveConflictLearnMoreAction;
}(Action));
var DoNotShowResolveConflictLearnMoreAction = /** @class */ (function (_super) {
    __extends(DoNotShowResolveConflictLearnMoreAction, _super);
    function DoNotShowResolveConflictLearnMoreAction(storageService) {
        var _this = _super.call(this, 'workbench.files.action.resolveConflictLearnMoreDoNotShowAgain', nls.localize('dontShowAgain', "Don't Show Again")) || this;
        _this.storageService = storageService;
        return _this;
    }
    DoNotShowResolveConflictLearnMoreAction.prototype.run = function (notification) {
        this.storageService.store(LEARN_MORE_DIRTY_WRITE_IGNORE_KEY, true);
        // Hide notification
        notification.dispose();
        return Promise.resolve(void 0);
    };
    DoNotShowResolveConflictLearnMoreAction = __decorate([
        __param(0, IStorageService)
    ], DoNotShowResolveConflictLearnMoreAction);
    return DoNotShowResolveConflictLearnMoreAction;
}(Action));
var ResolveSaveConflictAction = /** @class */ (function (_super) {
    __extends(ResolveSaveConflictAction, _super);
    function ResolveSaveConflictAction(model, editorService, notificationService, instantiationService, storageService, environmentService) {
        var _this = _super.call(this, 'workbench.files.action.resolveConflict', nls.localize('compareChanges', "Compare")) || this;
        _this.model = model;
        _this.editorService = editorService;
        _this.notificationService = notificationService;
        _this.instantiationService = instantiationService;
        _this.storageService = storageService;
        _this.environmentService = environmentService;
        return _this;
    }
    ResolveSaveConflictAction.prototype.run = function () {
        var _this = this;
        if (!this.model.isDisposed()) {
            var resource = this.model.getResource();
            var name_1 = paths.basename(resource.fsPath);
            var editorLabel = nls.localize('saveConflictDiffLabel', "{0} (on disk) ↔ {1} (in {2}) - Resolve save conflict", name_1, name_1, this.environmentService.appNameLong);
            return this.editorService.openEditor({
                leftResource: URI.from({ scheme: CONFLICT_RESOLUTION_SCHEME, path: resource.fsPath }),
                rightResource: resource,
                label: editorLabel,
                options: { pinned: true }
            }).then(function () {
                if (_this.storageService.getBoolean(LEARN_MORE_DIRTY_WRITE_IGNORE_KEY)) {
                    return; // return if this message is ignored
                }
                // Show additional help how to resolve the save conflict
                var actions = { primary: [], secondary: [] };
                actions.primary.push(_this.instantiationService.createInstance(ResolveConflictLearnMoreAction));
                actions.secondary.push(_this.instantiationService.createInstance(DoNotShowResolveConflictLearnMoreAction));
                var handle = _this.notificationService.notify({ severity: Severity.Info, message: conflictEditorHelp, actions: actions });
                once(handle.onDidClose)(function () { return dispose.apply(void 0, actions.primary.concat(actions.secondary)); });
                pendingResolveSaveConflictMessages.push(handle);
            });
        }
        return Promise.resolve(true);
    };
    ResolveSaveConflictAction = __decorate([
        __param(1, IEditorService),
        __param(2, INotificationService),
        __param(3, IInstantiationService),
        __param(4, IStorageService),
        __param(5, IEnvironmentService)
    ], ResolveSaveConflictAction);
    return ResolveSaveConflictAction;
}(Action));
var SaveElevatedAction = /** @class */ (function (_super) {
    __extends(SaveElevatedAction, _super);
    function SaveElevatedAction(model, triedToMakeWriteable) {
        var _this = _super.call(this, 'workbench.files.action.saveElevated', triedToMakeWriteable ? nls.localize('overwriteElevated', "Overwrite as Admin...") : nls.localize('saveElevated', "Retry as Admin...")) || this;
        _this.model = model;
        _this.triedToMakeWriteable = triedToMakeWriteable;
        return _this;
    }
    SaveElevatedAction.prototype.run = function () {
        if (!this.model.isDisposed()) {
            this.model.save({
                writeElevated: true,
                overwriteReadonly: this.triedToMakeWriteable
            });
        }
        return Promise.resolve(true);
    };
    return SaveElevatedAction;
}(Action));
var OverwriteReadonlyAction = /** @class */ (function (_super) {
    __extends(OverwriteReadonlyAction, _super);
    function OverwriteReadonlyAction(model) {
        var _this = _super.call(this, 'workbench.files.action.overwrite', nls.localize('overwrite', "Overwrite")) || this;
        _this.model = model;
        return _this;
    }
    OverwriteReadonlyAction.prototype.run = function () {
        if (!this.model.isDisposed()) {
            this.model.save({ overwriteReadonly: true });
        }
        return Promise.resolve(true);
    };
    return OverwriteReadonlyAction;
}(Action));
export var acceptLocalChangesCommand = function (accessor, resource) {
    var editorService = accessor.get(IEditorService);
    var resolverService = accessor.get(ITextModelService);
    var modelService = accessor.get(IModelService);
    var control = editorService.activeControl;
    var editor = control.input;
    var group = control.group;
    resolverService.createModelReference(resource).then(function (reference) {
        var model = reference.object;
        var localModelSnapshot = model.createSnapshot();
        clearPendingResolveSaveConflictMessages(); // hide any previously shown message about how to use these actions
        // Revert to be able to save
        return model.revert().then(function () {
            // Restore user value (without loosing undo stack)
            modelService.updateModel(model.textEditorModel, createTextBufferFactoryFromSnapshot(localModelSnapshot));
            // Trigger save
            return model.save().then(function () {
                // Reopen file input
                return editorService.openEditor({ resource: model.getResource() }, group).then(function () {
                    // Clean up
                    group.closeEditor(editor);
                    editor.dispose();
                    reference.dispose();
                });
            });
        });
    });
};
export var revertLocalChangesCommand = function (accessor, resource) {
    var editorService = accessor.get(IEditorService);
    var resolverService = accessor.get(ITextModelService);
    var control = editorService.activeControl;
    var editor = control.input;
    var group = control.group;
    resolverService.createModelReference(resource).then(function (reference) {
        var model = reference.object;
        clearPendingResolveSaveConflictMessages(); // hide any previously shown message about how to use these actions
        // Revert on model
        return model.revert().then(function () {
            // Reopen file input
            return editorService.openEditor({ resource: model.getResource() }, group).then(function () {
                // Clean up
                group.closeEditor(editor);
                editor.dispose();
                reference.dispose();
            });
        });
    });
};
