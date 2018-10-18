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
import * as resources from '../../../../../base/common/resources';
import { toResource, SideBySideEditorInput } from '../../../../common/editor';
import { ITextFileService } from '../../../../services/textfile/common/textfiles';
import { IFileService, FileChangesEvent } from '../../../../../platform/files/common/files';
import { FileEditorInput } from '../../common/editors/fileEditorInput';
import { ILifecycleService } from '../../../../../platform/lifecycle/common/lifecycle';
import { Disposable } from '../../../../../base/common/lifecycle';
import { distinct } from '../../../../../base/common/arrays';
import { IEnvironmentService } from '../../../../../platform/environment/common/environment';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration';
import { isLinux } from '../../../../../base/common/platform';
import { ResourceMap } from '../../../../../base/common/map';
import { IWorkspaceContextService } from '../../../../../platform/workspace/common/workspace';
import { isCodeEditor } from '../../../../../editor/browser/editorBrowser';
import { SideBySideEditor } from '../../../../browser/parts/editor/sideBySideEditor';
import { IWindowService } from '../../../../../platform/windows/common/windows';
import { BINARY_FILE_EDITOR_ID } from '../../common/files';
import { IEditorService } from '../../../../services/editor/common/editorService';
import { IEditorGroupsService } from '../../../../services/group/common/editorGroupsService';
import { ResourceQueue, timeout } from '../../../../../base/common/async';
import { onUnexpectedError } from '../../../../../base/common/errors';
var FileEditorTracker = /** @class */ (function (_super) {
    __extends(FileEditorTracker, _super);
    function FileEditorTracker(editorService, textFileService, lifecycleService, editorGroupService, fileService, environmentService, configurationService, contextService, windowService) {
        var _this = _super.call(this) || this;
        _this.editorService = editorService;
        _this.textFileService = textFileService;
        _this.lifecycleService = lifecycleService;
        _this.editorGroupService = editorGroupService;
        _this.fileService = fileService;
        _this.environmentService = environmentService;
        _this.configurationService = configurationService;
        _this.contextService = contextService;
        _this.windowService = windowService;
        _this.modelLoadQueue = new ResourceQueue();
        _this.activeOutOfWorkspaceWatchers = new ResourceMap();
        _this.onConfigurationUpdated(configurationService.getValue());
        _this.registerListeners();
        return _this;
    }
    FileEditorTracker.prototype.registerListeners = function () {
        var _this = this;
        // Update editors from operation changes
        this._register(this.fileService.onAfterOperation(function (e) { return _this.onFileOperation(e); }));
        // Update editors from disk changes
        this._register(this.fileService.onFileChanges(function (e) { return _this.onFileChanges(e); }));
        // Editor changing
        this._register(this.editorService.onDidVisibleEditorsChange(function () { return _this.handleOutOfWorkspaceWatchers(); }));
        // Update visible editors when focus is gained
        this._register(this.windowService.onDidChangeFocus(function (e) { return _this.onWindowFocusChange(e); }));
        // Lifecycle
        this.lifecycleService.onShutdown(this.dispose, this);
        // Configuration
        this._register(this.configurationService.onDidChangeConfiguration(function (e) { return _this.onConfigurationUpdated(_this.configurationService.getValue()); }));
    };
    FileEditorTracker.prototype.onConfigurationUpdated = function (configuration) {
        if (configuration.workbench && configuration.workbench.editor && typeof configuration.workbench.editor.closeOnFileDelete === 'boolean') {
            this.closeOnFileDelete = configuration.workbench.editor.closeOnFileDelete;
        }
        else {
            this.closeOnFileDelete = false; // default
        }
    };
    FileEditorTracker.prototype.onWindowFocusChange = function (focused) {
        var _this = this;
        if (focused) {
            // the window got focus and we use this as a hint that files might have been changed outside
            // of this window. since file events can be unreliable, we queue a load for models that
            // are visible in any editor. since this is a fast operation in the case nothing has changed,
            // we tolerate the additional work.
            distinct(this.editorService.visibleEditors
                .map(function (editorInput) {
                var resource = toResource(editorInput, { supportSideBySide: true });
                return resource ? _this.textFileService.models.get(resource) : void 0;
            })
                .filter(function (model) { return model && !model.isDirty(); }), function (m) { return m.getResource().toString(); }).forEach(function (model) { return _this.queueModelLoad(model); });
        }
    };
    // Note: there is some duplication with the other file event handler below. Since we cannot always rely on the disk events
    // carrying all necessary data in all environments, we also use the file operation events to make sure operations are handled.
    // In any case there is no guarantee if the local event is fired first or the disk one. Thus, code must handle the case
    // that the event ordering is random as well as might not carry all information needed.
    FileEditorTracker.prototype.onFileOperation = function (e) {
        // Handle moves specially when file is opened
        if (e.operation === 2 /* MOVE */) {
            this.handleMovedFileInOpenedEditors(e.resource, e.target.resource);
        }
        // Handle deletes
        if (e.operation === 1 /* DELETE */ || e.operation === 2 /* MOVE */) {
            this.handleDeletes(e.resource, false, e.target ? e.target.resource : void 0);
        }
    };
    FileEditorTracker.prototype.onFileChanges = function (e) {
        // Handle updates
        if (e.gotAdded() || e.gotUpdated()) {
            this.handleUpdates(e);
        }
        // Handle deletes
        if (e.gotDeleted()) {
            this.handleDeletes(e, true);
        }
    };
    FileEditorTracker.prototype.handleDeletes = function (arg1, isExternal, movedTo) {
        var _this = this;
        var nonDirtyFileEditors = this.getOpenedFileEditors(false /* non-dirty only */);
        nonDirtyFileEditors.forEach(function (editor) {
            var resource = editor.getResource();
            // Handle deletes in opened editors depending on:
            // - the user has not disabled the setting closeOnFileDelete
            // - the file change is local or external
            // - the input is not resolved (we need to dispose because we cannot restore otherwise since we do not have the contents)
            if (_this.closeOnFileDelete || !isExternal || !editor.isResolved()) {
                // Do NOT close any opened editor that matches the resource path (either equal or being parent) of the
                // resource we move to (movedTo). Otherwise we would close a resource that has been renamed to the same
                // path but different casing.
                if (movedTo && resources.isEqualOrParent(resource, movedTo)) {
                    return;
                }
                var matches = false;
                if (arg1 instanceof FileChangesEvent) {
                    matches = arg1.contains(resource, 2 /* DELETED */);
                }
                else {
                    matches = resources.isEqualOrParent(resource, arg1);
                }
                if (!matches) {
                    return;
                }
                // We have received reports of users seeing delete events even though the file still
                // exists (network shares issue: https://github.com/Microsoft/vscode/issues/13665).
                // Since we do not want to close an editor without reason, we have to check if the
                // file is really gone and not just a faulty file event.
                // This only applies to external file events, so we need to check for the isExternal
                // flag.
                var checkExists = void 0;
                if (isExternal) {
                    checkExists = timeout(100).then(function () { return _this.fileService.existsFile(resource); });
                }
                else {
                    checkExists = Promise.resolve(false);
                }
                checkExists.then(function (exists) {
                    if (!exists && !editor.isDisposed()) {
                        editor.dispose();
                    }
                    else if (_this.environmentService.verbose) {
                        console.warn("File exists even though we received a delete event: " + resource.toString());
                    }
                });
            }
        });
    };
    FileEditorTracker.prototype.getOpenedFileEditors = function (dirtyState) {
        var editors = [];
        this.editorService.editors.forEach(function (editor) {
            if (editor instanceof FileEditorInput) {
                if (!!editor.isDirty() === dirtyState) {
                    editors.push(editor);
                }
            }
            else if (editor instanceof SideBySideEditorInput) {
                var master = editor.master;
                var details = editor.details;
                if (master instanceof FileEditorInput) {
                    if (!!master.isDirty() === dirtyState) {
                        editors.push(master);
                    }
                }
                if (details instanceof FileEditorInput) {
                    if (!!details.isDirty() === dirtyState) {
                        editors.push(details);
                    }
                }
            }
        });
        return editors;
    };
    FileEditorTracker.prototype.handleMovedFileInOpenedEditors = function (oldResource, newResource) {
        var _this = this;
        this.editorGroupService.groups.forEach(function (group) {
            group.editors.forEach(function (editor) {
                if (editor instanceof FileEditorInput) {
                    var resource = editor.getResource();
                    // Update Editor if file (or any parent of the input) got renamed or moved
                    if (resources.isEqualOrParent(resource, oldResource)) {
                        var reopenFileResource = void 0;
                        if (oldResource.toString() === resource.toString()) {
                            reopenFileResource = newResource; // file got moved
                        }
                        else {
                            var index = _this.getIndexOfPath(resource.path, oldResource.path);
                            reopenFileResource = resources.joinPath(newResource, resource.path.substr(index + oldResource.path.length + 1)); // parent folder got moved
                        }
                        _this.editorService.replaceEditors([{
                                editor: { resource: resource },
                                replacement: {
                                    resource: reopenFileResource,
                                    options: {
                                        preserveFocus: true,
                                        pinned: group.isPinned(editor),
                                        index: group.getIndexOfEditor(editor),
                                        inactive: !group.isActive(editor),
                                        viewState: _this.getViewStateFor(oldResource, group)
                                    }
                                },
                            }], group);
                    }
                }
            });
        });
    };
    FileEditorTracker.prototype.getIndexOfPath = function (path, candidate) {
        if (candidate.length > path.length) {
            return -1;
        }
        if (path === candidate) {
            return 0;
        }
        if (!isLinux /* ignore case */) {
            path = path.toLowerCase();
            candidate = candidate.toLowerCase();
        }
        return path.indexOf(candidate);
    };
    FileEditorTracker.prototype.getViewStateFor = function (resource, group) {
        var editors = this.editorService.visibleControls;
        for (var i = 0; i < editors.length; i++) {
            var editor = editors[i];
            if (editor && editor.input && editor.group === group) {
                var editorResource = editor.input.getResource();
                if (editorResource && resource.toString() === editorResource.toString()) {
                    var control = editor.getControl();
                    if (isCodeEditor(control)) {
                        return control.saveViewState();
                    }
                }
            }
        }
        return void 0;
    };
    FileEditorTracker.prototype.handleUpdates = function (e) {
        // Handle updates to text models
        this.handleUpdatesToTextModels(e);
        // Handle updates to visible binary editors
        this.handleUpdatesToVisibleBinaryEditors(e);
    };
    FileEditorTracker.prototype.handleUpdatesToTextModels = function (e) {
        var _this = this;
        // Collect distinct (saved) models to update.
        //
        // Note: we also consider the added event because it could be that a file was added
        // and updated right after.
        distinct(e.getUpdated().concat(e.getAdded()).map(function (u) { return _this.textFileService.models.get(u.resource); })
            .filter(function (model) { return model && !model.isDirty(); }), function (m) { return m.getResource().toString(); })
            .forEach(function (model) { return _this.queueModelLoad(model); });
    };
    FileEditorTracker.prototype.queueModelLoad = function (model) {
        // Load model to update (use a queue to prevent accumulation of loads
        // when the load actually takes long. At most we only want the queue
        // to have a size of 2 (1 running load and 1 queued load).
        var queue = this.modelLoadQueue.queueFor(model.getResource());
        if (queue.size <= 1) {
            queue.queue(function () { return model.load().then(null, onUnexpectedError); });
        }
    };
    FileEditorTracker.prototype.handleUpdatesToVisibleBinaryEditors = function (e) {
        var _this = this;
        var editors = this.editorService.visibleControls;
        editors.forEach(function (editor) {
            var resource = toResource(editor.input, { supportSideBySide: true });
            // Support side-by-side binary editors too
            var isBinaryEditor = false;
            if (editor instanceof SideBySideEditor) {
                isBinaryEditor = editor.getMasterEditor().getId() === BINARY_FILE_EDITOR_ID;
            }
            else {
                isBinaryEditor = editor.getId() === BINARY_FILE_EDITOR_ID;
            }
            // Binary editor that should reload from event
            if (resource && isBinaryEditor && (e.contains(resource, 0 /* UPDATED */) || e.contains(resource, 1 /* ADDED */))) {
                _this.editorService.openEditor(editor.input, { forceReload: true, preserveFocus: true }, editor.group);
            }
        });
    };
    FileEditorTracker.prototype.handleOutOfWorkspaceWatchers = function () {
        var _this = this;
        var visibleOutOfWorkspacePaths = new ResourceMap();
        this.editorService.visibleEditors.map(function (editorInput) {
            return toResource(editorInput, { supportSideBySide: true });
        }).filter(function (resource) {
            return !!resource && _this.fileService.canHandleResource(resource) && !_this.contextService.isInsideWorkspace(resource);
        }).forEach(function (resource) {
            visibleOutOfWorkspacePaths.set(resource, resource);
        });
        // Handle no longer visible out of workspace resources
        this.activeOutOfWorkspaceWatchers.forEach(function (resource) {
            if (!visibleOutOfWorkspacePaths.get(resource)) {
                _this.fileService.unwatchFileChanges(resource);
                _this.activeOutOfWorkspaceWatchers.delete(resource);
            }
        });
        // Handle newly visible out of workspace resources
        visibleOutOfWorkspacePaths.forEach(function (resource) {
            if (!_this.activeOutOfWorkspaceWatchers.get(resource)) {
                _this.fileService.watchFileChanges(resource);
                _this.activeOutOfWorkspaceWatchers.set(resource, resource);
            }
        });
    };
    FileEditorTracker.prototype.dispose = function () {
        var _this = this;
        _super.prototype.dispose.call(this);
        // Dispose watchers if any
        this.activeOutOfWorkspaceWatchers.forEach(function (resource) { return _this.fileService.unwatchFileChanges(resource); });
        this.activeOutOfWorkspaceWatchers.clear();
    };
    FileEditorTracker = __decorate([
        __param(0, IEditorService),
        __param(1, ITextFileService),
        __param(2, ILifecycleService),
        __param(3, IEditorGroupsService),
        __param(4, IFileService),
        __param(5, IEnvironmentService),
        __param(6, IConfigurationService),
        __param(7, IWorkspaceContextService),
        __param(8, IWindowService)
    ], FileEditorTracker);
    return FileEditorTracker;
}(Disposable));
export { FileEditorTracker };
