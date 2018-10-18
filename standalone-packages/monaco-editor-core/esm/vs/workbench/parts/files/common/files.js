/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { URI } from '../../../../base/common/uri';
import { IFileService } from '../../../../platform/files/common/files';
import { ExplorerItem, OpenEditor } from './explorerModel';
import { ContextKeyExpr, RawContextKey } from '../../../../platform/contextkey/common/contextkey';
import { dispose } from '../../../../base/common/lifecycle';
import { IModelService } from '../../../../editor/common/services/modelService';
import { IModeService } from '../../../../editor/common/services/modeService';
import { ITextFileService } from '../../../services/textfile/common/textfiles';
import { InputFocusedContextKey } from '../../../../platform/workbench/common/contextkeys';
import { Registry } from '../../../../platform/registry/common/platform';
import { Extensions as ViewContainerExtensions } from '../../../common/views';
/**
 * Explorer viewlet id.
 */
export var VIEWLET_ID = 'workbench.view.explorer';
/**
 * Explorer viewlet container.
 */
export var VIEW_CONTAINER = Registry.as(ViewContainerExtensions.ViewContainersRegistry).registerViewContainer(VIEWLET_ID);
/**
 * Context Keys to use with keybindings for the Explorer and Open Editors view
 */
var explorerViewletVisibleId = 'explorerViewletVisible';
var filesExplorerFocusId = 'filesExplorerFocus';
var openEditorsVisibleId = 'openEditorsVisible';
var openEditorsFocusId = 'openEditorsFocus';
var explorerViewletFocusId = 'explorerViewletFocus';
var explorerResourceIsFolderId = 'explorerResourceIsFolder';
var explorerResourceReadonly = 'explorerResourceReadonly';
var explorerResourceIsRootId = 'explorerResourceIsRoot';
export var ExplorerViewletVisibleContext = new RawContextKey(explorerViewletVisibleId, true);
export var ExplorerFolderContext = new RawContextKey(explorerResourceIsFolderId, false);
export var ExplorerResourceReadonlyContext = new RawContextKey(explorerResourceReadonly, false);
export var ExplorerResourceNotReadonlyContext = ExplorerResourceReadonlyContext.toNegated();
export var ExplorerRootContext = new RawContextKey(explorerResourceIsRootId, false);
export var FilesExplorerFocusedContext = new RawContextKey(filesExplorerFocusId, true);
export var OpenEditorsVisibleContext = new RawContextKey(openEditorsVisibleId, false);
export var OpenEditorsFocusedContext = new RawContextKey(openEditorsFocusId, true);
export var ExplorerFocusedContext = new RawContextKey(explorerViewletFocusId, true);
export var OpenEditorsVisibleCondition = ContextKeyExpr.has(openEditorsVisibleId);
export var FilesExplorerFocusCondition = ContextKeyExpr.and(ContextKeyExpr.has(explorerViewletVisibleId), ContextKeyExpr.has(filesExplorerFocusId), ContextKeyExpr.not(InputFocusedContextKey));
export var ExplorerFocusCondition = ContextKeyExpr.and(ContextKeyExpr.has(explorerViewletVisibleId), ContextKeyExpr.has(explorerViewletFocusId), ContextKeyExpr.not(InputFocusedContextKey));
/**
 * Preferences editor id.
 */
export var PREFERENCES_EDITOR_ID = 'workbench.editor.preferencesEditor';
/**
 * Text file editor id.
 */
export var TEXT_FILE_EDITOR_ID = 'workbench.editors.files.textFileEditor';
/**
 * File editor input id.
 */
export var FILE_EDITOR_INPUT_ID = 'workbench.editors.files.fileEditorInput';
/**
 * Binary file editor id.
 */
export var BINARY_FILE_EDITOR_ID = 'workbench.editors.files.binaryFileEditor';
/**
 * Helper to get an explorer item from an object.
 */
export function explorerItemToFileResource(obj) {
    if (obj instanceof ExplorerItem) {
        var stat = obj;
        return {
            resource: stat.resource,
            isDirectory: stat.isDirectory
        };
    }
    if (obj instanceof OpenEditor) {
        var editor = obj;
        var resource = editor.getResource();
        if (resource) {
            return {
                resource: resource
            };
        }
    }
    return null;
}
export var SortOrderConfiguration = {
    DEFAULT: 'default',
    MIXED: 'mixed',
    FILES_FIRST: 'filesFirst',
    TYPE: 'type',
    MODIFIED: 'modified'
};
var FileOnDiskContentProvider = /** @class */ (function () {
    function FileOnDiskContentProvider(textFileService, fileService, modeService, modelService) {
        this.textFileService = textFileService;
        this.fileService = fileService;
        this.modeService = modeService;
        this.modelService = modelService;
    }
    FileOnDiskContentProvider.prototype.provideTextContent = function (resource) {
        var _this = this;
        var fileOnDiskResource = URI.file(resource.fsPath);
        // Make sure our file from disk is resolved up to date
        return this.resolveEditorModel(resource).then(function (codeEditorModel) {
            // Make sure to keep contents on disk up to date when it changes
            if (!_this.fileWatcher) {
                _this.fileWatcher = _this.fileService.onFileChanges(function (changes) {
                    if (changes.contains(fileOnDiskResource, 0 /* UPDATED */)) {
                        _this.resolveEditorModel(resource, false /* do not create if missing */); // update model when resource changes
                    }
                });
                var disposeListener_1 = codeEditorModel.onWillDispose(function () {
                    disposeListener_1.dispose();
                    _this.fileWatcher = dispose(_this.fileWatcher);
                });
            }
            return codeEditorModel;
        });
    };
    FileOnDiskContentProvider.prototype.resolveEditorModel = function (resource, createAsNeeded) {
        var _this = this;
        if (createAsNeeded === void 0) { createAsNeeded = true; }
        var fileOnDiskResource = URI.file(resource.fsPath);
        return this.textFileService.resolveTextContent(fileOnDiskResource).then(function (content) {
            var codeEditorModel = _this.modelService.getModel(resource);
            if (codeEditorModel) {
                _this.modelService.updateModel(codeEditorModel, content.value);
            }
            else if (createAsNeeded) {
                var fileOnDiskModel = _this.modelService.getModel(fileOnDiskResource);
                var mode = void 0;
                if (fileOnDiskModel) {
                    mode = _this.modeService.getOrCreateMode(fileOnDiskModel.getModeId());
                }
                else {
                    mode = _this.modeService.getOrCreateModeByFilepathOrFirstLine(fileOnDiskResource.fsPath);
                }
                codeEditorModel = _this.modelService.createModel(content.value, mode, resource);
            }
            return codeEditorModel;
        });
    };
    FileOnDiskContentProvider.prototype.dispose = function () {
        this.fileWatcher = dispose(this.fileWatcher);
    };
    FileOnDiskContentProvider = __decorate([
        __param(0, ITextFileService),
        __param(1, IFileService),
        __param(2, IModeService),
        __param(3, IModelService)
    ], FileOnDiskContentProvider);
    return FileOnDiskContentProvider;
}());
export { FileOnDiskContentProvider };
