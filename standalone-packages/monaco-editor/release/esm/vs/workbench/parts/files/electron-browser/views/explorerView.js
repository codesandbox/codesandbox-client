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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import * as nls from '../../../../../nls.js';
import { URI } from '../../../../../base/common/uri.js';
import { ThrottledDelayer, Delayer } from '../../../../../base/common/async.js';
import * as paths from '../../../../../base/common/paths.js';
import * as resources from '../../../../../base/common/resources.js';
import { memoize } from '../../../../../base/common/decorators.js';
import { ExplorerFolderContext, FilesExplorerFocusedContext, ExplorerFocusedContext, SortOrderConfiguration, ExplorerRootContext, ExplorerResourceReadonlyContext } from '../../common/files.js';
import { FileChangesEvent, IFileService, FILES_EXCLUDE_CONFIG } from '../../../../../platform/files/common/files.js';
import { RefreshViewExplorerAction, NewFolderAction, NewFileAction } from '../fileActions.js';
import { FileDragAndDrop, FileFilter, FileSorter, FileController, FileRenderer, FileDataSource, FileAccessibilityProvider } from './explorerViewer.js';
import { toResource } from '../../../../common/editor.js';
import { DiffEditorInput } from '../../../../common/editor/diffEditorInput.js';
import * as DOM from '../../../../../base/browser/dom.js';
import { CollapseAction } from '../../../../browser/viewlet.js';
import { TreeViewsViewletPanel, FileIconThemableWorkbenchTree } from '../../../../browser/parts/views/viewsViewlet.js';
import { ExplorerItem, Model } from '../../common/explorerModel.js';
import { IPartService } from '../../../../services/part/common/partService.js';
import { ExplorerDecorationsProvider } from './explorerDecorationsProvider.js';
import { IWorkspaceContextService } from '../../../../../platform/workspace/common/workspace.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IKeybindingService } from '../../../../../platform/keybinding/common/keybinding.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { IProgressService } from '../../../../../platform/progress/common/progress.js';
import { IContextMenuService } from '../../../../../platform/contextview/browser/contextView.js';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { ResourceContextKey } from '../../../../common/resources.js';
import { ResourceGlobMatcher } from '../../../../electron-browser/resources.js';
import { isLinux } from '../../../../../base/common/platform.js';
import { IDecorationsService } from '../../../../services/decorations/browser/decorations.js';
import { DelayedDragHandler } from '../../../../../base/browser/dnd.js';
import { Schemas } from '../../../../../base/common/network.js';
import { INotificationService } from '../../../../../platform/notification/common/notification.js';
import { IEditorService } from '../../../../services/editor/common/editorService.js';
import { ILabelService } from '../../../../../platform/label/common/label.js';
var ExplorerView = /** @class */ (function (_super) {
    __extends(ExplorerView, _super);
    function ExplorerView(options, notificationService, contextMenuService, instantiationService, contextService, progressService, editorService, fileService, partService, keybindingService, contextKeyService, configurationService, decorationService, labelService) {
        var _this = _super.call(this, __assign({}, options, { ariaHeaderLabel: nls.localize('explorerSection', "Files Explorer Section") }), keybindingService, contextMenuService, configurationService) || this;
        _this.notificationService = notificationService;
        _this.instantiationService = instantiationService;
        _this.contextService = contextService;
        _this.progressService = progressService;
        _this.editorService = editorService;
        _this.fileService = fileService;
        _this.partService = partService;
        _this.labelService = labelService;
        _this.id = ExplorerView.ID;
        _this.settings = options.viewletSettings;
        _this.viewletState = options.viewletState;
        _this.autoReveal = true;
        _this.explorerRefreshDelayer = new ThrottledDelayer(ExplorerView.EXPLORER_FILE_CHANGES_REFRESH_DELAY);
        _this.resourceContext = instantiationService.createInstance(ResourceContextKey);
        _this.folderContext = ExplorerFolderContext.bindTo(contextKeyService);
        _this.readonlyContext = ExplorerResourceReadonlyContext.bindTo(contextKeyService);
        _this.rootContext = ExplorerRootContext.bindTo(contextKeyService);
        _this.fileEventsFilter = instantiationService.createInstance(ResourceGlobMatcher, function (root) { return _this.getFileEventsExcludes(root); }, function (event) { return event.affectsConfiguration(FILES_EXCLUDE_CONFIG); });
        _this.decorationProvider = new ExplorerDecorationsProvider(_this.model, contextService);
        decorationService.registerDecorationsProvider(_this.decorationProvider);
        _this.disposables.push(_this.decorationProvider);
        _this.disposables.push(_this.resourceContext);
        return _this;
    }
    ExplorerView.prototype.getFileEventsExcludes = function (root) {
        var scope = root ? { resource: root } : void 0;
        var configuration = this.configurationService.getValue(scope);
        return (configuration && configuration.files && configuration.files.exclude) || Object.create(null);
    };
    ExplorerView.prototype.renderHeader = function (container) {
        var _this = this;
        _super.prototype.renderHeader.call(this, container);
        // Expand on drag over
        this.dragHandler = new DelayedDragHandler(container, function () { return _this.setExpanded(true); });
        var titleElement = container.querySelector('.title');
        var setHeader = function () {
            var workspace = _this.contextService.getWorkspace();
            var title = workspace.folders.map(function (folder) { return folder.name; }).join();
            titleElement.textContent = _this.name;
            titleElement.title = title;
        };
        this.disposables.push(this.contextService.onDidChangeWorkspaceName(setHeader));
        this.disposables.push(this.labelService.onDidRegisterFormatter(setHeader));
        setHeader();
    };
    Object.defineProperty(ExplorerView.prototype, "name", {
        get: function () {
            return this.labelService.getWorkspaceLabel(this.contextService.getWorkspace());
        },
        set: function (value) {
            // noop
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExplorerView.prototype, "title", {
        get: function () {
            return this.name;
        },
        set: function (value) {
            // noop
        },
        enumerable: true,
        configurable: true
    });
    ExplorerView.prototype.render = function () {
        var _this = this;
        _super.prototype.render.call(this);
        // Update configuration
        var configuration = this.configurationService.getValue();
        this.onConfigurationUpdated(configuration);
        // Load and Fill Viewer
        var targetsToExpand = [];
        if (this.settings[ExplorerView.MEMENTO_EXPANDED_FOLDER_RESOURCES]) {
            targetsToExpand = this.settings[ExplorerView.MEMENTO_EXPANDED_FOLDER_RESOURCES].map(function (e) { return URI.parse(e); });
        }
        this.doRefresh(targetsToExpand).then(function () {
            // When the explorer viewer is loaded, listen to changes to the editor input
            _this.disposables.push(_this.editorService.onDidActiveEditorChange(function () { return _this.revealActiveFile(); }));
            // Also handle configuration updates
            _this.disposables.push(_this.configurationService.onDidChangeConfiguration(function (e) { return _this.onConfigurationUpdated(_this.configurationService.getValue(), e); }));
            _this.revealActiveFile();
        });
    };
    ExplorerView.prototype.renderBody = function (container) {
        var _this = this;
        this.treeContainer = DOM.append(container, DOM.$('.explorer-folders-view'));
        this.tree = this.createViewer(this.treeContainer);
        if (this.toolbar) {
            this.toolbar.setActions(this.getActions(), this.getSecondaryActions())();
        }
        this.disposables.push(this.contextService.onDidChangeWorkspaceFolders(function (e) { return _this.refreshFromEvent(e.added); }));
        this.disposables.push(this.contextService.onDidChangeWorkbenchState(function (e) { return _this.refreshFromEvent(); }));
        this.disposables.push(this.fileService.onDidChangeFileSystemProviderRegistrations(function () { return _this.refreshFromEvent(); }));
        this.disposables.push(this.labelService.onDidRegisterFormatter(function () {
            _this._onDidChangeTitleArea.fire();
            _this.refreshFromEvent();
        }));
    };
    ExplorerView.prototype.layoutBody = function (size) {
        if (this.treeContainer) {
            this.treeContainer.style.height = size + 'px';
        }
        _super.prototype.layoutBody.call(this, size);
    };
    ExplorerView.prototype.getActions = function () {
        var actions = [];
        actions.push(this.instantiationService.createInstance(NewFileAction, this.getViewer(), null));
        actions.push(this.instantiationService.createInstance(NewFolderAction, this.getViewer(), null));
        actions.push(this.instantiationService.createInstance(RefreshViewExplorerAction, this, 'explorer-action refresh-explorer'));
        actions.push(this.instantiationService.createInstance(CollapseAction, this.getViewer(), true, 'explorer-action collapse-explorer'));
        return actions;
    };
    ExplorerView.prototype.revealActiveFile = function () {
        if (!this.autoReveal) {
            return; // do not touch selection or focus if autoReveal === false
        }
        var clearSelection = true;
        var clearFocus = false;
        // Handle files
        var activeFile = this.getActiveFile();
        if (activeFile) {
            // Always remember last opened file
            this.settings[ExplorerView.MEMENTO_LAST_ACTIVE_FILE_RESOURCE] = activeFile.toString();
            // Select file if input is inside workspace
            if (this.isVisible() && !this.isDisposed && this.contextService.isInsideWorkspace(activeFile)) {
                var selection = this.hasSingleSelection(activeFile);
                if (!selection) {
                    this.select(activeFile);
                }
                clearSelection = false;
            }
        }
        // Handle closed or untitled file (convince explorer to not reopen any file when getting visible)
        var activeInput = this.editorService.activeEditor;
        if (!activeInput || toResource(activeInput, { supportSideBySide: true, filter: Schemas.untitled })) {
            this.settings[ExplorerView.MEMENTO_LAST_ACTIVE_FILE_RESOURCE] = void 0;
            clearFocus = true;
        }
        // Otherwise clear
        if (clearSelection) {
            this.explorerViewer.clearSelection();
        }
        if (clearFocus) {
            this.explorerViewer.clearFocus();
        }
    };
    ExplorerView.prototype.onConfigurationUpdated = function (configuration, event) {
        if (this.isDisposed) {
            return; // guard against possible race condition when config change causes recreate of views
        }
        this.autoReveal = configuration && configuration.explorer && configuration.explorer.autoReveal;
        // Push down config updates to components of viewer
        var needsRefresh = false;
        if (this.filter) {
            needsRefresh = this.filter.updateConfiguration();
        }
        var configSortOrder = configuration && configuration.explorer && configuration.explorer.sortOrder || 'default';
        if (this.sortOrder !== configSortOrder) {
            this.sortOrder = configSortOrder;
            needsRefresh = true;
        }
        if (event && !needsRefresh) {
            needsRefresh = event.affectsConfiguration('explorer.decorations.colors')
                || event.affectsConfiguration('explorer.decorations.badges');
        }
        // Refresh viewer as needed if this originates from a config event
        if (event && needsRefresh) {
            this.doRefresh();
        }
    };
    ExplorerView.prototype.focus = function () {
        _super.prototype.focus.call(this);
        var keepFocus = false;
        // Make sure the current selected element is revealed
        if (this.explorerViewer) {
            if (this.autoReveal) {
                var selection = this.explorerViewer.getSelection();
                if (selection.length > 0) {
                    this.reveal(selection[0], 0.5);
                }
            }
            // Pass Focus to Viewer
            this.explorerViewer.domFocus();
            keepFocus = true;
        }
        // Open the focused element in the editor if there is currently no file opened
        var activeFile = this.getActiveFile();
        if (!activeFile) {
            this.openFocusedElement(keepFocus);
        }
    };
    ExplorerView.prototype.setVisible = function (visible) {
        var _this = this;
        return _super.prototype.setVisible.call(this, visible).then(function () {
            // Show
            if (visible) {
                // If a refresh was requested and we are now visible, run it
                var refreshPromise = Promise.resolve(null);
                if (_this.shouldRefresh) {
                    refreshPromise = _this.doRefresh();
                    _this.shouldRefresh = false; // Reset flag
                }
                if (!_this.autoReveal) {
                    return refreshPromise; // do not react to setVisible call if autoReveal === false
                }
                // Always select the current navigated file in explorer if input is file editor input
                // unless autoReveal is set to false
                var activeFile_1 = _this.getActiveFile();
                if (activeFile_1) {
                    return refreshPromise.then(function () {
                        return _this.select(activeFile_1);
                    });
                }
                // Return now if the workbench has not yet been created - in this case the workbench takes care of restoring last used editors
                if (!_this.partService.isCreated()) {
                    return Promise.resolve(null);
                }
                // Otherwise restore last used file: By lastActiveFileResource
                var lastActiveFileResource = void 0;
                if (_this.settings[ExplorerView.MEMENTO_LAST_ACTIVE_FILE_RESOURCE]) {
                    lastActiveFileResource = URI.parse(_this.settings[ExplorerView.MEMENTO_LAST_ACTIVE_FILE_RESOURCE]);
                }
                if (lastActiveFileResource && _this.isCreated && _this.model.findClosest(lastActiveFileResource)) {
                    _this.editorService.openEditor({ resource: lastActiveFileResource, options: { revealIfVisible: true } });
                    return refreshPromise;
                }
                // Otherwise restore last used file: By Explorer selection
                return refreshPromise.then(function () {
                    _this.openFocusedElement();
                });
            }
            return void 0;
        });
    };
    ExplorerView.prototype.openFocusedElement = function (preserveFocus) {
        var stat = this.explorerViewer.getFocus();
        if (stat && !stat.isDirectory) {
            this.editorService.openEditor({ resource: stat.resource, options: { preserveFocus: preserveFocus, revealIfVisible: true } });
        }
    };
    ExplorerView.prototype.getActiveFile = function () {
        var input = this.editorService.activeEditor;
        // ignore diff editor inputs (helps to get out of diffing when returning to explorer)
        if (input instanceof DiffEditorInput) {
            return null;
        }
        // check for files
        return toResource(input, { supportSideBySide: true });
    };
    Object.defineProperty(ExplorerView.prototype, "isCreated", {
        get: function () {
            return !!(this.explorerViewer && this.explorerViewer.getInput());
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExplorerView.prototype, "model", {
        get: function () {
            var model = this.instantiationService.createInstance(Model);
            this.disposables.push(model);
            return model;
        },
        enumerable: true,
        configurable: true
    });
    ExplorerView.prototype.createViewer = function (container) {
        var _this = this;
        var dataSource = this.instantiationService.createInstance(FileDataSource);
        var renderer = this.instantiationService.createInstance(FileRenderer, this.viewletState);
        var controller = this.instantiationService.createInstance(FileController);
        this.disposables.push(controller);
        var sorter = this.instantiationService.createInstance(FileSorter);
        this.disposables.push(sorter);
        this.filter = this.instantiationService.createInstance(FileFilter);
        this.disposables.push(this.filter);
        var dnd = this.instantiationService.createInstance(FileDragAndDrop);
        var accessibilityProvider = this.instantiationService.createInstance(FileAccessibilityProvider);
        this.explorerViewer = this.instantiationService.createInstance(FileIconThemableWorkbenchTree, container, {
            dataSource: dataSource,
            renderer: renderer,
            controller: controller,
            sorter: sorter,
            filter: this.filter,
            dnd: dnd,
            accessibilityProvider: accessibilityProvider
        }, {
            autoExpandSingleChildren: true,
            ariaLabel: nls.localize('treeAriaLabel', "Files Explorer")
        });
        // Bind context keys
        FilesExplorerFocusedContext.bindTo(this.explorerViewer.contextKeyService);
        ExplorerFocusedContext.bindTo(this.explorerViewer.contextKeyService);
        // Update Viewer based on File Change Events
        this.disposables.push(this.fileService.onAfterOperation(function (e) { return _this.onFileOperation(e); }));
        this.disposables.push(this.fileService.onFileChanges(function (e) { return _this.onFileChanges(e); }));
        // Update resource context based on focused element
        this.disposables.push(this.explorerViewer.onDidChangeFocus(function (e) {
            var isSingleFolder = _this.contextService.getWorkbenchState() === 2 /* FOLDER */;
            var resource = e.focus ? e.focus.resource : isSingleFolder ? _this.contextService.getWorkspace().folders[0].uri : undefined;
            _this.resourceContext.set(resource);
            _this.folderContext.set((isSingleFolder && !e.focus) || e.focus && e.focus.isDirectory);
            _this.readonlyContext.set(e.focus && e.focus.isReadonly);
            _this.rootContext.set(!e.focus || (e.focus && e.focus.isRoot));
        }));
        // Open when selecting via keyboard
        this.disposables.push(this.explorerViewer.onDidChangeSelection(function (event) {
            if (event && event.payload && event.payload.origin === 'keyboard') {
                var element = _this.tree.getSelection();
                if (Array.isArray(element) && element[0] instanceof ExplorerItem) {
                    if (element[0].isDirectory) {
                        _this.explorerViewer.toggleExpansion(element[0]);
                    }
                    controller.openEditor(element[0], { pinned: false, sideBySide: false, preserveFocus: false });
                }
            }
        }));
        return this.explorerViewer;
    };
    ExplorerView.prototype.getViewer = function () {
        return this.tree;
    };
    ExplorerView.prototype.getOptimalWidth = function () {
        var parentNode = this.explorerViewer.getHTMLElement();
        var childNodes = [].slice.call(parentNode.querySelectorAll('.explorer-item .label-name')); // select all file labels
        return DOM.getLargestChildWidth(parentNode, childNodes);
    };
    ExplorerView.prototype.onFileOperation = function (e) {
        var _this = this;
        if (!this.isCreated) {
            return; // ignore if not yet created
        }
        // Add
        if (e.operation === 0 /* CREATE */ || e.operation === 3 /* COPY */) {
            var addedElement_1 = e.target;
            var parentResource = resources.dirname(addedElement_1.resource);
            var parents = this.model.findAll(parentResource);
            if (parents.length) {
                // Add the new file to its parent (Model)
                parents.forEach(function (p) {
                    // We have to check if the parent is resolved #29177
                    var thenable = p.isDirectoryResolved ? Promise.resolve(null) : _this.fileService.resolveFile(p.resource);
                    thenable.then(function (stat) {
                        if (stat) {
                            var modelStat = ExplorerItem.create(stat, p.root);
                            ExplorerItem.mergeLocalWithDisk(modelStat, p);
                        }
                        var childElement = ExplorerItem.create(addedElement_1, p.root);
                        p.removeChild(childElement); // make sure to remove any previous version of the file if any
                        p.addChild(childElement);
                        // Refresh the Parent (View)
                        _this.explorerViewer.refresh(p).then(function () {
                            return _this.reveal(childElement, 0.5).then(function () {
                                // Focus new element
                                _this.explorerViewer.setFocus(childElement);
                            });
                        });
                    });
                });
            }
        }
        // Move (including Rename)
        else if (e.operation === 2 /* MOVE */) {
            var oldResource = e.resource;
            var newElement_1 = e.target;
            var oldParentResource = resources.dirname(oldResource);
            var newParentResource = resources.dirname(newElement_1.resource);
            // Only update focus if renamed/moved element is selected
            var restoreFocus_1 = false;
            var focus_1 = this.explorerViewer.getFocus();
            if (focus_1 && focus_1.resource && focus_1.resource.toString() === oldResource.toString()) {
                restoreFocus_1 = true;
            }
            var isExpanded_1 = false;
            // Handle Rename
            if (oldParentResource && newParentResource && oldParentResource.toString() === newParentResource.toString()) {
                var modelElements = this.model.findAll(oldResource);
                modelElements.forEach(function (modelElement) {
                    //Check if element is expanded
                    isExpanded_1 = _this.explorerViewer.isExpanded(modelElement);
                    // Rename File (Model)
                    modelElement.rename(newElement_1);
                    // Update Parent (View)
                    _this.explorerViewer.refresh(modelElement.parent).then(function () {
                        // Select in Viewer if set
                        if (restoreFocus_1) {
                            _this.explorerViewer.setFocus(modelElement);
                        }
                        //Expand the element again
                        if (isExpanded_1) {
                            _this.explorerViewer.expand(modelElement);
                        }
                    });
                });
            }
            // Handle Move
            else if (oldParentResource && newParentResource) {
                var newParents_1 = this.model.findAll(newParentResource);
                var modelElements = this.model.findAll(oldResource);
                if (newParents_1.length && modelElements.length) {
                    // Move in Model
                    modelElements.forEach(function (modelElement, index) {
                        var oldParent = modelElement.parent;
                        modelElement.move(newParents_1[index], function (callback) {
                            // Update old parent
                            _this.explorerViewer.refresh(oldParent).then(callback);
                        }, function () {
                            // Update new parent
                            _this.explorerViewer.refresh(newParents_1[index], true).then(function () { return _this.explorerViewer.expand(newParents_1[index]); });
                        });
                    });
                }
            }
        }
        // Delete
        else if (e.operation === 1 /* DELETE */) {
            var modelElements = this.model.findAll(e.resource);
            modelElements.forEach(function (element) {
                if (element.parent) {
                    var parent_1 = element.parent;
                    // Remove Element from Parent (Model)
                    parent_1.removeChild(element);
                    // Refresh Parent (View)
                    var restoreFocus_2 = _this.explorerViewer.isDOMFocused();
                    _this.explorerViewer.refresh(parent_1).then(function () {
                        // Ensure viewer has keyboard focus if event originates from viewer
                        if (restoreFocus_2) {
                            _this.explorerViewer.domFocus();
                        }
                    });
                }
            });
        }
    };
    ExplorerView.prototype.onFileChanges = function (e) {
        var _this = this;
        // Ensure memento state does not capture a deleted file (we run this from a timeout because
        // delete events can result in UI activity that will fill the memento again when multiple
        // editors are closing)
        setTimeout(function () {
            var lastActiveResource = _this.settings[ExplorerView.MEMENTO_LAST_ACTIVE_FILE_RESOURCE];
            if (lastActiveResource && e.contains(URI.parse(lastActiveResource), 2 /* DELETED */)) {
                _this.settings[ExplorerView.MEMENTO_LAST_ACTIVE_FILE_RESOURCE] = null;
            }
        });
        // Check if an explorer refresh is necessary (delayed to give internal events a chance to react first)
        // Note: there is no guarantee when the internal events are fired vs real ones. Code has to deal with the fact that one might
        // be fired first over the other or not at all.
        setTimeout(function () {
            if (!_this.shouldRefresh && _this.shouldRefreshFromEvent(e)) {
                _this.refreshFromEvent();
            }
        }, ExplorerView.EXPLORER_FILE_CHANGES_REACT_DELAY);
    };
    ExplorerView.prototype.shouldRefreshFromEvent = function (e) {
        if (!this.isCreated) {
            return false;
        }
        // Filter to the ones we care
        e = this.filterToViewRelevantEvents(e);
        // Handle added files/folders
        var added = e.getAdded();
        if (added.length) {
            // Check added: Refresh if added file/folder is not part of resolved root and parent is part of it
            var ignoredPaths = {};
            for (var i = 0; i < added.length; i++) {
                var change = added[i];
                // Find parent
                var parent_2 = resources.dirname(change.resource);
                // Continue if parent was already determined as to be ignored
                if (ignoredPaths[parent_2.toString()]) {
                    continue;
                }
                // Compute if parent is visible and added file not yet part of it
                var parentStat = this.model.findClosest(parent_2);
                if (parentStat && parentStat.isDirectoryResolved && !this.model.findClosest(change.resource)) {
                    return true;
                }
                // Keep track of path that can be ignored for faster lookup
                if (!parentStat || !parentStat.isDirectoryResolved) {
                    ignoredPaths[parent_2.toString()] = true;
                }
            }
        }
        // Handle deleted files/folders
        var deleted = e.getDeleted();
        if (deleted.length) {
            // Check deleted: Refresh if deleted file/folder part of resolved root
            for (var j = 0; j < deleted.length; j++) {
                var del = deleted[j];
                if (this.model.findClosest(del.resource)) {
                    return true;
                }
            }
        }
        // Handle updated files/folders if we sort by modified
        if (this.sortOrder === SortOrderConfiguration.MODIFIED) {
            var updated = e.getUpdated();
            // Check updated: Refresh if updated file/folder part of resolved root
            for (var j = 0; j < updated.length; j++) {
                var upd = updated[j];
                if (this.model.findClosest(upd.resource)) {
                    return true;
                }
            }
        }
        return false;
    };
    ExplorerView.prototype.filterToViewRelevantEvents = function (e) {
        var _this = this;
        return new FileChangesEvent(e.changes.filter(function (change) {
            if (change.type === 0 /* UPDATED */ && _this.sortOrder !== SortOrderConfiguration.MODIFIED) {
                return false; // we only are about updated if we sort by modified time
            }
            if (!_this.contextService.isInsideWorkspace(change.resource)) {
                return false; // exclude changes for resources outside of workspace
            }
            if (_this.fileEventsFilter.matches(change.resource)) {
                return false; // excluded via files.exclude setting
            }
            return true;
        }));
    };
    ExplorerView.prototype.refreshFromEvent = function (newRoots) {
        var _this = this;
        if (newRoots === void 0) { newRoots = []; }
        if (this.isVisible() && !this.isDisposed) {
            this.explorerRefreshDelayer.trigger(function () {
                if (!_this.explorerViewer.getHighlight()) {
                    return _this.doRefresh(newRoots.map(function (r) { return r.uri; })).then(function () {
                        if (newRoots.length === 1) {
                            return _this.reveal(_this.model.findClosest(newRoots[0].uri), 0.5);
                        }
                        return undefined;
                    });
                }
                return Promise.resolve(null);
            });
        }
        else {
            this.shouldRefresh = true;
        }
    };
    /**
     * Refresh the contents of the explorer to get up to date data from the disk about the file structure.
     */
    ExplorerView.prototype.refresh = function () {
        var _this = this;
        if (!this.explorerViewer || this.explorerViewer.getHighlight()) {
            return Promise.resolve(null);
        }
        // Focus
        this.explorerViewer.domFocus();
        // Find resource to focus from active editor input if set
        var resourceToFocus;
        if (this.autoReveal) {
            resourceToFocus = this.getActiveFile();
            if (!resourceToFocus) {
                var selection = this.explorerViewer.getSelection();
                if (selection && selection.length === 1) {
                    resourceToFocus = selection[0].resource;
                }
            }
        }
        return this.doRefresh().then(function () {
            if (resourceToFocus) {
                return _this.select(resourceToFocus, true);
            }
            return Promise.resolve(null);
        });
    };
    ExplorerView.prototype.doRefresh = function (targetsToExpand) {
        var _this = this;
        if (targetsToExpand === void 0) { targetsToExpand = []; }
        var targetsToResolve = this.model.roots.map(function (root) { return ({ root: root, resource: root.resource, options: { resolveTo: [] } }); });
        // First time refresh: Receive target through active editor input or selection and also include settings from previous session
        if (!this.isCreated) {
            var activeFile = this.getActiveFile();
            if (activeFile) {
                var workspaceFolder_1 = this.contextService.getWorkspaceFolder(activeFile);
                if (workspaceFolder_1) {
                    var found = targetsToResolve.filter(function (t) { return t.root.resource.toString() === workspaceFolder_1.uri.toString(); }).pop();
                    found.options.resolveTo.push(activeFile);
                }
            }
            targetsToExpand.forEach(function (toExpand) {
                var workspaceFolder = _this.contextService.getWorkspaceFolder(toExpand);
                if (workspaceFolder) {
                    var found = targetsToResolve.filter(function (ttr) { return ttr.resource.toString() === workspaceFolder.uri.toString(); }).pop();
                    found.options.resolveTo.push(toExpand);
                }
            });
        }
        // Subsequent refresh: Receive targets through expanded folders in tree
        else {
            targetsToResolve.forEach(function (t) {
                _this.getResolvedDirectories(t.root, t.options.resolveTo);
            });
        }
        var promise = this.resolveRoots(targetsToResolve, targetsToExpand).then(function (result) {
            _this.decorationProvider.changed(targetsToResolve.map(function (t) { return t.root.resource; }));
            return result;
        });
        this.progressService.showWhile(promise, this.partService.isCreated() ? 800 : 1200 /* less ugly initial startup */);
        return promise;
    };
    ExplorerView.prototype.resolveRoots = function (targetsToResolve, targetsToExpand) {
        var _this = this;
        // Display roots only when multi folder workspace
        var input = this.contextService.getWorkbenchState() === 2 /* FOLDER */ ? this.model.roots[0] : this.model;
        var errorRoot = function (resource, root) {
            if (input === _this.model.roots[0]) {
                input = _this.model;
            }
            return ExplorerItem.create({
                resource: resource,
                name: paths.basename(resource.fsPath),
                mtime: 0,
                etag: undefined,
                isDirectory: true
            }, root, undefined, true);
        };
        var setInputAndExpand = function (input, statsToExpand) {
            // Make sure to expand all folders that where expanded in the previous session
            // Special case: we are switching to multi workspace view, thus expand all the roots (they might just be added)
            if (input === _this.model && statsToExpand.every(function (fs) { return fs && !fs.isRoot; })) {
                statsToExpand = _this.model.roots.concat(statsToExpand);
            }
            return _this.explorerViewer.setInput(input).then(function () { return _this.explorerViewer.expandAll(statsToExpand); });
        };
        if (targetsToResolve.every(function (t) { return t.root.resource.scheme === 'file'; })) {
            // All the roots are local, resolve them in parallel
            return this.fileService.resolveFiles(targetsToResolve).then(function (results) {
                // Convert to model
                var modelStats = results.map(function (result, index) {
                    if (result.success && result.stat.isDirectory) {
                        return ExplorerItem.create(result.stat, targetsToResolve[index].root, targetsToResolve[index].options.resolveTo);
                    }
                    return errorRoot(targetsToResolve[index].resource, targetsToResolve[index].root);
                });
                // Subsequent refresh: Merge stat into our local model and refresh tree
                modelStats.forEach(function (modelStat, index) {
                    if (index < _this.model.roots.length) {
                        ExplorerItem.mergeLocalWithDisk(modelStat, _this.model.roots[index]);
                    }
                });
                var statsToExpand = _this.explorerViewer.getExpandedElements().concat(targetsToExpand.map(function (expand) { return _this.model.findClosest(expand); }));
                if (input === _this.explorerViewer.getInput()) {
                    return _this.explorerViewer.refresh().then(function () { return _this.explorerViewer.expandAll(statsToExpand); });
                }
                return setInputAndExpand(input, statsToExpand);
            });
        }
        // There is a remote root, resolve the roots sequantally
        var statsToExpand = [];
        var delayer = new Delayer(100);
        var delayerPromise;
        return Promise.all(targetsToResolve.map(function (target, index) { return _this.fileService.resolveFile(target.resource, target.options)
            .then(function (result) { return result.isDirectory ? ExplorerItem.create(result, target.root, target.options.resolveTo) : errorRoot(target.resource, target.root); }, function () { return errorRoot(target.resource, target.root); })
            .then(function (modelStat) {
            // Subsequent refresh: Merge stat into our local model and refresh tree
            if (index < _this.model.roots.length) {
                ExplorerItem.mergeLocalWithDisk(modelStat, _this.model.roots[index]);
            }
            var toExpand = _this.explorerViewer.getExpandedElements().concat(targetsToExpand.map(function (target) { return _this.model.findClosest(target); }));
            if (input === _this.explorerViewer.getInput()) {
                statsToExpand = statsToExpand.concat(toExpand);
                if (!delayer.isTriggered()) {
                    delayerPromise = delayer.trigger(function () { return _this.explorerViewer.refresh()
                        .then(function () { return _this.explorerViewer.expandAll(statsToExpand); })
                        .then(function () { return statsToExpand = []; }); });
                }
                return delayerPromise;
            }
            return setInputAndExpand(input, statsToExpand);
        }); }));
    };
    /**
     * Given a stat, fills an array of path that make all folders below the stat that are resolved directories.
     */
    ExplorerView.prototype.getResolvedDirectories = function (stat, resolvedDirectories) {
        var _this = this;
        if (stat.isDirectoryResolved) {
            if (!stat.isRoot) {
                // Drop those path which are parents of the current one
                for (var i = resolvedDirectories.length - 1; i >= 0; i--) {
                    var resource = resolvedDirectories[i];
                    if (resources.isEqualOrParent(stat.resource, resource, !isLinux /* ignorecase */)) {
                        resolvedDirectories.splice(i);
                    }
                }
                // Add to the list of path to resolve
                resolvedDirectories.push(stat.resource);
            }
            // Recurse into children
            stat.getChildrenArray().forEach(function (child) {
                _this.getResolvedDirectories(child, resolvedDirectories);
            });
        }
    };
    /**
     * Selects and reveal the file element provided by the given resource if its found in the explorer. Will try to
     * resolve the path from the disk in case the explorer is not yet expanded to the file yet.
     */
    ExplorerView.prototype.select = function (resource, reveal) {
        var _this = this;
        if (reveal === void 0) { reveal = this.autoReveal; }
        // Require valid path
        if (!resource) {
            return Promise.resolve(null);
        }
        // If path already selected, just reveal and return
        var selection = this.hasSingleSelection(resource);
        if (selection) {
            return reveal ? this.reveal(selection, 0.5) : Promise.resolve(null);
        }
        // First try to get the stat object from the input to avoid a roundtrip
        if (!this.isCreated) {
            return Promise.resolve(null);
        }
        var fileStat = this.model.findClosest(resource);
        if (fileStat) {
            return this.doSelect(fileStat, reveal);
        }
        // Stat needs to be resolved first and then revealed
        var options = { resolveTo: [resource] };
        var workspaceFolder = this.contextService.getWorkspaceFolder(resource);
        var rootUri = workspaceFolder ? workspaceFolder.uri : this.model.roots[0].resource;
        return this.fileService.resolveFile(rootUri, options).then(function (stat) {
            // Convert to model
            var root = _this.model.roots.filter(function (r) { return r.resource.toString() === rootUri.toString(); }).pop();
            var modelStat = ExplorerItem.create(stat, root, options.resolveTo);
            // Update Input with disk Stat
            ExplorerItem.mergeLocalWithDisk(modelStat, root);
            // Select and Reveal
            return _this.explorerViewer.refresh(root).then(function () { return _this.doSelect(root.find(resource), reveal); });
        }, function (e) { _this.notificationService.error(e); });
    };
    ExplorerView.prototype.hasSingleSelection = function (resource) {
        var currentSelection = this.explorerViewer.getSelection();
        return currentSelection.length === 1 && currentSelection[0].resource.toString() === resource.toString()
            ? currentSelection[0]
            : undefined;
    };
    ExplorerView.prototype.doSelect = function (fileStat, reveal) {
        var _this = this;
        if (!fileStat) {
            return Promise.resolve(null);
        }
        // Special case: we are asked to reveal and select an element that is not visible
        // In this case we take the parent element so that we are at least close to it.
        if (!this.filter.isVisible(this.tree, fileStat)) {
            fileStat = fileStat.parent;
            if (!fileStat) {
                return Promise.resolve(null);
            }
        }
        // Reveal depending on flag
        var revealPromise;
        if (reveal) {
            revealPromise = this.reveal(fileStat, 0.5);
        }
        else {
            revealPromise = Promise.resolve(null);
        }
        return revealPromise.then(function () {
            if (!fileStat.isDirectory) {
                _this.explorerViewer.setSelection([fileStat]); // Since folders can not be opened, only select files
            }
            _this.explorerViewer.setFocus(fileStat);
        });
    };
    ExplorerView.prototype.reveal = function (element, relativeTop) {
        if (!this.tree) {
            return Promise.resolve(null); // return early if viewlet has not yet been created
        }
        return this.tree.reveal(element, relativeTop);
    };
    ExplorerView.prototype.shutdown = function () {
        // Keep list of expanded folders to restore on next load
        if (this.isCreated) {
            var expanded = this.explorerViewer.getExpandedElements()
                .filter(function (e) { return e instanceof ExplorerItem; })
                .map(function (e) { return e.resource.toString(); });
            if (expanded.length) {
                this.settings[ExplorerView.MEMENTO_EXPANDED_FOLDER_RESOURCES] = expanded;
            }
            else {
                delete this.settings[ExplorerView.MEMENTO_EXPANDED_FOLDER_RESOURCES];
            }
        }
        // Clean up last focused if not set
        if (!this.settings[ExplorerView.MEMENTO_LAST_ACTIVE_FILE_RESOURCE]) {
            delete this.settings[ExplorerView.MEMENTO_LAST_ACTIVE_FILE_RESOURCE];
        }
        _super.prototype.shutdown.call(this);
    };
    ExplorerView.prototype.dispose = function () {
        this.isDisposed = true;
        if (this.dragHandler) {
            this.dragHandler.dispose();
        }
        _super.prototype.dispose.call(this);
    };
    ExplorerView.ID = 'workbench.explorer.fileView';
    ExplorerView.EXPLORER_FILE_CHANGES_REACT_DELAY = 500; // delay in ms to react to file changes to give our internal events a chance to react first
    ExplorerView.EXPLORER_FILE_CHANGES_REFRESH_DELAY = 100; // delay in ms to refresh the explorer from disk file changes
    ExplorerView.MEMENTO_LAST_ACTIVE_FILE_RESOURCE = 'explorer.memento.lastActiveFileResource';
    ExplorerView.MEMENTO_EXPANDED_FOLDER_RESOURCES = 'explorer.memento.expandedFolderResources';
    __decorate([
        memoize
    ], ExplorerView.prototype, "model", null);
    ExplorerView = __decorate([
        __param(1, INotificationService),
        __param(2, IContextMenuService),
        __param(3, IInstantiationService),
        __param(4, IWorkspaceContextService),
        __param(5, IProgressService),
        __param(6, IEditorService),
        __param(7, IFileService),
        __param(8, IPartService),
        __param(9, IKeybindingService),
        __param(10, IContextKeyService),
        __param(11, IConfigurationService),
        __param(12, IDecorationsService),
        __param(13, ILabelService)
    ], ExplorerView);
    return ExplorerView;
}(TreeViewsViewletPanel));
export { ExplorerView };
