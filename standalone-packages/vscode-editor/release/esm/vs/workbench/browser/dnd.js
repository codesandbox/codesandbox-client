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
import { WORKSPACE_EXTENSION, IWorkspacesService } from '../../platform/workspaces/common/workspaces.js';
import { extname, basename, normalize } from '../../base/common/paths.js';
import { IFileService } from '../../platform/files/common/files.js';
import { IWindowsService, IWindowService } from '../../platform/windows/common/windows.js';
import { URI } from '../../base/common/uri.js';
import { ITextFileService } from '../services/textfile/common/textfiles.js';
import { IBackupFileService } from '../services/backup/common/backup.js';
import { Schemas } from '../../base/common/network.js';
import { IUntitledEditorService } from '../services/untitled/common/untitledEditorService.js';
import { DefaultEndOfLine } from '../../editor/common/model.js';
import { IConfigurationService } from '../../platform/configuration/common/configuration.js';
import { DataTransfers } from '../../base/browser/dnd.js';
import { DefaultDragAndDrop } from '../../base/parts/tree/browser/treeDefaults.js';
import { normalizeDriveLetter } from '../../base/common/labels.js';
import { MIME_BINARY } from '../../base/common/mime.js';
import { isWindows } from '../../base/common/platform.js';
import { coalesce } from '../../base/common/arrays.js';
import { IInstantiationService } from '../../platform/instantiation/common/instantiation.js';
import { isCodeEditor } from '../../editor/browser/editorBrowser.js';
import { basenameOrAuthority } from '../../base/common/resources.js';
import { IEditorService } from '../services/editor/common/editorService.js';
import { Disposable } from '../../base/common/lifecycle.js';
import { addDisposableListener, EventType } from '../../base/browser/dom.js';
var DraggedEditorIdentifier = /** @class */ (function () {
    function DraggedEditorIdentifier(_identifier) {
        this._identifier = _identifier;
    }
    Object.defineProperty(DraggedEditorIdentifier.prototype, "identifier", {
        get: function () {
            return this._identifier;
        },
        enumerable: true,
        configurable: true
    });
    return DraggedEditorIdentifier;
}());
export { DraggedEditorIdentifier };
var DraggedEditorGroupIdentifier = /** @class */ (function () {
    function DraggedEditorGroupIdentifier(_identifier) {
        this._identifier = _identifier;
    }
    Object.defineProperty(DraggedEditorGroupIdentifier.prototype, "identifier", {
        get: function () {
            return this._identifier;
        },
        enumerable: true,
        configurable: true
    });
    return DraggedEditorGroupIdentifier;
}());
export { DraggedEditorGroupIdentifier };
export var CodeDataTransfers = {
    EDITORS: 'CodeEditors',
    FILES: 'CodeFiles'
};
export function extractResources(e, externalOnly) {
    var resources = [];
    if (e.dataTransfer.types.length > 0) {
        // Check for window-to-window DND
        if (!externalOnly) {
            // Data Transfer: Code Editors
            var rawEditorsData = e.dataTransfer.getData(CodeDataTransfers.EDITORS);
            if (rawEditorsData) {
                try {
                    var draggedEditors = JSON.parse(rawEditorsData);
                    draggedEditors.forEach(function (draggedEditor) {
                        resources.push({ resource: URI.parse(draggedEditor.resource), backupResource: draggedEditor.backupResource ? URI.parse(draggedEditor.backupResource) : void 0, viewState: draggedEditor.viewState, isExternal: false });
                    });
                }
                catch (error) {
                    // Invalid transfer
                }
            }
            // Data Transfer: Resources
            else {
                try {
                    var rawResourcesData = e.dataTransfer.getData(DataTransfers.RESOURCES);
                    if (rawResourcesData) {
                        var uriStrArray = JSON.parse(rawResourcesData);
                        resources.push.apply(resources, uriStrArray.map(function (uriStr) { return ({ resource: URI.parse(uriStr), isExternal: false }); }));
                    }
                }
                catch (error) {
                    // Invalid transfer
                }
            }
        }
        // Check for native file transfer
        if (e.dataTransfer && e.dataTransfer.files) {
            var _loop_1 = function (i) {
                // @ts-ignore
                var file = e.dataTransfer.files[i];
                if (file && file.path && !resources.some(function (r) { return r.resource.fsPath === file.path; }) /* prevent duplicates */) {
                    try {
                        resources.push({ resource: URI.file(file.path), isExternal: true });
                    }
                    catch (error) {
                        // Invalid URI
                    }
                }
            };
            for (var i = 0; i < e.dataTransfer.files.length; i++) {
                _loop_1(i);
            }
        }
        // Check for CodeFiles transfer
        var rawCodeFiles = e.dataTransfer.getData(CodeDataTransfers.FILES);
        if (rawCodeFiles) {
            try {
                var codeFiles = JSON.parse(rawCodeFiles);
                codeFiles.forEach(function (codeFile) {
                    if (!resources.some(function (r) { return r.resource.fsPath === codeFile; }) /* prevent duplicates */) {
                        resources.push({ resource: URI.file(codeFile), isExternal: true });
                    }
                });
            }
            catch (error) {
                // Invalid transfer
            }
        }
    }
    return resources;
}
/**
 * Shared function across some components to handle drag & drop of resources. E.g. of folders and workspace files
 * to open them in the window instead of the editor or to handle dirty editors being dropped between instances of Code.
 */
var ResourcesDropHandler = /** @class */ (function () {
    function ResourcesDropHandler(options, fileService, windowsService, windowService, workspacesService, textFileService, backupFileService, untitledEditorService, editorService, configurationService) {
        this.options = options;
        this.fileService = fileService;
        this.windowsService = windowsService;
        this.windowService = windowService;
        this.workspacesService = workspacesService;
        this.textFileService = textFileService;
        this.backupFileService = backupFileService;
        this.untitledEditorService = untitledEditorService;
        this.editorService = editorService;
        this.configurationService = configurationService;
    }
    ResourcesDropHandler.prototype.handleDrop = function (event, resolveTargetGroup, afterDrop, targetIndex) {
        var _this = this;
        var untitledOrFileResources = extractResources(event).filter(function (r) { return _this.fileService.canHandleResource(r.resource) || r.resource.scheme === Schemas.untitled; });
        if (!untitledOrFileResources.length) {
            return;
        }
        // Make the window active to handle the drop properly within
        this.windowService.focusWindow().then(function () {
            // Check for special things being dropped
            return _this.doHandleDrop(untitledOrFileResources).then(function (isWorkspaceOpening) {
                if (isWorkspaceOpening) {
                    return void 0; // return early if the drop operation resulted in this window changing to a workspace
                }
                // Add external ones to recently open list unless dropped resource is a workspace
                var filesToAddToHistory = untitledOrFileResources.filter(function (d) { return d.isExternal && d.resource.scheme === Schemas.file; }).map(function (d) { return d.resource; });
                if (filesToAddToHistory.length) {
                    _this.windowsService.addRecentlyOpened(filesToAddToHistory);
                }
                var editors = untitledOrFileResources.map(function (untitledOrFileResource) { return ({
                    resource: untitledOrFileResource.resource,
                    options: {
                        pinned: true,
                        index: targetIndex,
                        viewState: untitledOrFileResource.viewState
                    }
                }); });
                // Open in Editor
                var targetGroup = resolveTargetGroup();
                return _this.editorService.openEditors(editors, targetGroup).then(function () {
                    // Finish with provided function
                    afterDrop(targetGroup);
                });
            });
        });
    };
    ResourcesDropHandler.prototype.doHandleDrop = function (untitledOrFileResources) {
        var _this = this;
        // Check for dirty editors being dropped
        var resourcesWithBackups = untitledOrFileResources.filter(function (resource) { return !resource.isExternal && !!resource.backupResource; });
        if (resourcesWithBackups.length > 0) {
            return Promise.all(resourcesWithBackups.map(function (resourceWithBackup) { return _this.handleDirtyEditorDrop(resourceWithBackup); })).then(function () { return false; });
        }
        // Check for workspace file being dropped if we are allowed to do so
        if (this.options.allowWorkspaceOpen) {
            var externalFileOnDiskResources = untitledOrFileResources.filter(function (d) { return d.isExternal && d.resource.scheme === Schemas.file; }).map(function (d) { return d.resource; });
            if (externalFileOnDiskResources.length > 0) {
                return this.handleWorkspaceFileDrop(externalFileOnDiskResources);
            }
        }
        return Promise.resolve(false);
    };
    ResourcesDropHandler.prototype.handleDirtyEditorDrop = function (droppedDirtyEditor) {
        var _this = this;
        // Untitled: always ensure that we open a new untitled for each file we drop
        if (droppedDirtyEditor.resource.scheme === Schemas.untitled) {
            droppedDirtyEditor.resource = this.untitledEditorService.createOrGet().getResource();
        }
        // Return early if the resource is already dirty in target or opened already
        if (this.textFileService.isDirty(droppedDirtyEditor.resource) || this.editorService.isOpen({ resource: droppedDirtyEditor.resource })) {
            return Promise.resolve(false);
        }
        // Resolve the contents of the dropped dirty resource from source
        return this.backupFileService.resolveBackupContent(droppedDirtyEditor.backupResource).then(function (content) {
            // Set the contents of to the resource to the target
            return _this.backupFileService.backupResource(droppedDirtyEditor.resource, content.create(_this.getDefaultEOL()).createSnapshot(true));
        }).then(function () { return false; }, function () { return false; } /* ignore any error */);
    };
    ResourcesDropHandler.prototype.getDefaultEOL = function () {
        var eol = this.configurationService.getValue('files.eol');
        if (eol === '\r\n') {
            return DefaultEndOfLine.CRLF;
        }
        return DefaultEndOfLine.LF;
    };
    ResourcesDropHandler.prototype.handleWorkspaceFileDrop = function (fileOnDiskResources) {
        var _this = this;
        var workspaceResources = {
            workspaces: [],
            folders: []
        };
        return Promise.all(fileOnDiskResources.map(function (fileOnDiskResource) {
            // Check for Workspace
            if (extname(fileOnDiskResource.fsPath) === "." + WORKSPACE_EXTENSION) {
                workspaceResources.workspaces.push(fileOnDiskResource);
                return void 0;
            }
            // Check for Folder
            return _this.fileService.resolveFile(fileOnDiskResource).then(function (stat) {
                if (stat.isDirectory) {
                    workspaceResources.folders.push(stat.resource);
                }
            }, function (error) { return void 0; });
        })).then(function (_) {
            var workspaces = workspaceResources.workspaces, folders = workspaceResources.folders;
            // Return early if no external resource is a folder or workspace
            if (workspaces.length === 0 && folders.length === 0) {
                return false;
            }
            // Pass focus to window
            _this.windowService.focusWindow();
            var workspacesToOpen;
            // Open in separate windows if we drop workspaces or just one folder
            if (workspaces.length > 0 || folders.length === 1) {
                workspacesToOpen = Promise.resolve(workspaces.concat(folders).map(function (resources) { return resources; }));
            }
            // Multiple folders: Create new workspace with folders and open
            else if (folders.length > 1) {
                workspacesToOpen = _this.workspacesService.createWorkspace(folders.map(function (folder) { return ({ uri: folder }); })).then(function (workspace) { return [URI.file(workspace.configPath)]; });
            }
            // Open
            workspacesToOpen.then(function (workspaces) {
                _this.windowService.openWindow(workspaces, { forceReuseWindow: true });
            });
            return true;
        });
    };
    ResourcesDropHandler = __decorate([
        __param(1, IFileService),
        __param(2, IWindowsService),
        __param(3, IWindowService),
        __param(4, IWorkspacesService),
        __param(5, ITextFileService),
        __param(6, IBackupFileService),
        __param(7, IUntitledEditorService),
        __param(8, IEditorService),
        __param(9, IConfigurationService)
    ], ResourcesDropHandler);
    return ResourcesDropHandler;
}());
export { ResourcesDropHandler };
var SimpleFileResourceDragAndDrop = /** @class */ (function (_super) {
    __extends(SimpleFileResourceDragAndDrop, _super);
    function SimpleFileResourceDragAndDrop(toResource, instantiationService) {
        var _this = _super.call(this) || this;
        _this.toResource = toResource;
        _this.instantiationService = instantiationService;
        return _this;
    }
    SimpleFileResourceDragAndDrop.prototype.getDragURI = function (tree, obj) {
        var resource = this.toResource(obj);
        if (resource) {
            return resource.toString();
        }
        return void 0;
    };
    SimpleFileResourceDragAndDrop.prototype.getDragLabel = function (tree, elements) {
        if (elements.length > 1) {
            return String(elements.length);
        }
        var resource = this.toResource(elements[0]);
        if (resource) {
            return basenameOrAuthority(resource);
        }
        return void 0;
    };
    SimpleFileResourceDragAndDrop.prototype.onDragStart = function (tree, data, originalEvent) {
        var _this = this;
        // Apply some datatransfer types to allow for dragging the element outside of the application
        var resources = data.getData().map(function (source) { return _this.toResource(source); });
        if (resources) {
            this.instantiationService.invokeFunction(fillResourceDataTransfers, coalesce(resources), originalEvent);
        }
    };
    SimpleFileResourceDragAndDrop = __decorate([
        __param(1, IInstantiationService)
    ], SimpleFileResourceDragAndDrop);
    return SimpleFileResourceDragAndDrop;
}(DefaultDragAndDrop));
export { SimpleFileResourceDragAndDrop };
export function fillResourceDataTransfers(accessor, resources, event) {
    if (resources.length === 0) {
        return;
    }
    var sources = resources.map(function (obj) {
        if (URI.isUri(obj)) {
            return { resource: obj, isDirectory: false /* assume resource is not a directory */ };
        }
        return obj;
    });
    var firstSource = sources[0];
    // Text: allows to paste into text-capable areas
    var lineDelimiter = isWindows ? '\r\n' : '\n';
    event.dataTransfer.setData(DataTransfers.TEXT, sources.map(function (source) { return source.resource.scheme === Schemas.file ? normalize(normalizeDriveLetter(source.resource.fsPath), true) : source.resource.toString(); }).join(lineDelimiter));
    // Download URL: enables support to drag a tab as file to desktop (only single file supported)
    if (firstSource.resource.scheme === Schemas.file) {
        event.dataTransfer.setData(DataTransfers.DOWNLOAD_URL, [MIME_BINARY, basename(firstSource.resource.fsPath), firstSource.resource.toString()].join(':'));
    }
    // Resource URLs: allows to drop multiple resources to a target in VS Code (not directories)
    var files = sources.filter(function (s) { return !s.isDirectory; });
    if (files.length) {
        event.dataTransfer.setData(DataTransfers.RESOURCES, JSON.stringify(files.map(function (f) { return f.resource.toString(); })));
    }
    // Editors: enables cross window DND of tabs into the editor area
    var textFileService = accessor.get(ITextFileService);
    var backupFileService = accessor.get(IBackupFileService);
    var editorService = accessor.get(IEditorService);
    var draggedEditors = [];
    files.forEach(function (file) {
        // Try to find editor view state from the visible editors that match given resource
        var viewState;
        var textEditorWidgets = editorService.visibleTextEditorWidgets;
        for (var i = 0; i < textEditorWidgets.length; i++) {
            var textEditorWidget = textEditorWidgets[i];
            if (isCodeEditor(textEditorWidget)) {
                var model = textEditorWidget.getModel();
                if (model && model.uri && model.uri.toString() === file.resource.toString()) {
                    viewState = textEditorWidget.saveViewState();
                    break;
                }
            }
        }
        // Add as dragged editor
        draggedEditors.push({
            resource: file.resource.toString(),
            backupResource: textFileService.isDirty(file.resource) ? backupFileService.toBackupResource(file.resource).toString() : void 0,
            viewState: viewState
        });
    });
    if (draggedEditors.length) {
        event.dataTransfer.setData(CodeDataTransfers.EDITORS, JSON.stringify(draggedEditors));
    }
}
/**
 * A singleton to store transfer data during drag & drop operations that are only valid within the application.
 */
var LocalSelectionTransfer = /** @class */ (function () {
    function LocalSelectionTransfer() {
        // protect against external instantiation
    }
    LocalSelectionTransfer.getInstance = function () {
        return LocalSelectionTransfer.INSTANCE;
    };
    LocalSelectionTransfer.prototype.hasData = function (proto) {
        return proto && proto === this.proto;
    };
    LocalSelectionTransfer.prototype.clearData = function (proto) {
        if (this.hasData(proto)) {
            this.proto = void 0;
            this.data = void 0;
        }
    };
    LocalSelectionTransfer.prototype.getData = function (proto) {
        if (this.hasData(proto)) {
            return this.data;
        }
        return void 0;
    };
    LocalSelectionTransfer.prototype.setData = function (data, proto) {
        if (proto) {
            this.data = data;
            this.proto = proto;
        }
    };
    LocalSelectionTransfer.INSTANCE = new LocalSelectionTransfer();
    return LocalSelectionTransfer;
}());
export { LocalSelectionTransfer };
var DragAndDropObserver = /** @class */ (function (_super) {
    __extends(DragAndDropObserver, _super);
    function DragAndDropObserver(element, callbacks) {
        var _this = _super.call(this) || this;
        _this.element = element;
        _this.callbacks = callbacks;
        // A helper to fix issues with repeated DRAG_ENTER / DRAG_LEAVE
        // calls see https://github.com/Microsoft/vscode/issues/14470
        // when the element has child elements where the events are fired
        // repeadedly.
        _this.counter = 0;
        _this.registerListeners();
        return _this;
    }
    DragAndDropObserver.prototype.registerListeners = function () {
        var _this = this;
        this._register(addDisposableListener(this.element, EventType.DRAG_ENTER, function (e) {
            _this.counter++;
            _this.callbacks.onDragEnter(e);
        }));
        this._register(addDisposableListener(this.element, EventType.DRAG_OVER, function (e) {
            // Do this to fix chrome behaviour
            e.preventDefault();
            e.stopPropagation();
            if (_this.callbacks.onDragOver) {
                _this.callbacks.onDragOver(e);
            }
        }));
        this._register(addDisposableListener(this.element, EventType.DRAG_LEAVE, function (e) {
            _this.counter--;
            if (_this.counter === 0) {
                _this.callbacks.onDragLeave(e);
            }
        }));
        this._register(addDisposableListener(this.element, EventType.DRAG_END, function (e) {
            _this.counter = 0;
            _this.callbacks.onDragEnd(e);
        }));
        this._register(addDisposableListener(this.element, EventType.DROP, function (e) {
            _this.counter = 0;
            _this.callbacks.onDrop(e);
        }));
    };
    return DragAndDropObserver;
}(Disposable));
export { DragAndDropObserver };
