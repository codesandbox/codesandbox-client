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
import * as nls from '../../../../../nls';
import * as objects from '../../../../../base/common/objects';
import * as DOM from '../../../../../base/browser/dom';
import * as path from '../../../../../../path';
import { URI } from '../../../../../base/common/uri';
import { once } from '../../../../../base/common/functional';
import * as paths from '../../../../../base/common/paths';
import * as resources from '../../../../../base/common/resources';
import * as errors from '../../../../../base/common/errors';
import { ActionRunner as BaseActionRunner } from '../../../../../base/common/actions';
import * as comparers from '../../../../../base/common/comparers';
import { InputBox } from '../../../../../base/browser/ui/inputbox/inputBox';
import { isMacintosh, isLinux } from '../../../../../base/common/platform';
import * as glob from '../../../../../base/common/glob';
import { FileLabel } from '../../../../browser/labels';
import { dispose, Disposable } from '../../../../../base/common/lifecycle';
import { ITextFileService } from '../../../../services/textfile/common/textfiles';
import { IFileService, FileKind } from '../../../../../platform/files/common/files';
import { DuplicateFileAction, AddFilesAction, FileCopiedContext } from '../fileActions';
import { DRAG_OVER_ACCEPT_BUBBLE_DOWN, DRAG_OVER_ACCEPT_BUBBLE_DOWN_COPY, DRAG_OVER_ACCEPT_BUBBLE_UP, DRAG_OVER_ACCEPT_BUBBLE_UP_COPY, DRAG_OVER_REJECT } from '../../../../../base/parts/tree/browser/tree';
import { DesktopDragAndDropData, ExternalElementsDragAndDropData } from '../../../../../base/parts/tree/browser/treeDnd';
import { ExplorerItem, NewStatPlaceholder, Model } from '../../common/explorerModel';
import { IPartService } from '../../../../services/part/common/partService';
import { IWorkspaceContextService } from '../../../../../platform/workspace/common/workspace';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey';
import { IContextViewService, IContextMenuService } from '../../../../../platform/contextview/browser/contextView';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation';
import { IProgressService } from '../../../../../platform/progress/common/progress';
import { ITelemetryService } from '../../../../../platform/telemetry/common/telemetry';
import { IMenuService, MenuId } from '../../../../../platform/actions/common/actions';
import { attachInputBoxStyler } from '../../../../../platform/theme/common/styler';
import { IThemeService } from '../../../../../platform/theme/common/themeService';
import { IWindowService } from '../../../../../platform/windows/common/windows';
import { IWorkspaceEditingService } from '../../../../services/workspace/common/workspaceEditing';
import { extractResources, SimpleFileResourceDragAndDrop, CodeDataTransfers, fillResourceDataTransfers } from '../../../../browser/dnd';
import { WorkbenchTreeController } from '../../../../../platform/list/browser/listService';
import { IClipboardService } from '../../../../../platform/clipboard/common/clipboardService';
import { DataTransfers } from '../../../../../base/browser/dnd';
import { Schemas } from '../../../../../base/common/network';
import { rtrim } from '../../../../../base/common/strings';
import { IDialogService, getConfirmMessage } from '../../../../../platform/dialogs/common/dialogs';
import { INotificationService } from '../../../../../platform/notification/common/notification';
import { IEditorService, SIDE_GROUP, ACTIVE_GROUP } from '../../../../services/editor/common/editorService';
import { fillInContextMenuActions } from '../../../../../platform/actions/browser/menuItemActionItem';
var FileDataSource = /** @class */ (function () {
    function FileDataSource(progressService, notificationService, fileService, partService) {
        this.progressService = progressService;
        this.notificationService = notificationService;
        this.fileService = fileService;
        this.partService = partService;
    }
    FileDataSource.prototype.getId = function (tree, stat) {
        if (stat instanceof Model) {
            return 'model';
        }
        return stat.root.resource.toString() + ":" + stat.getId();
    };
    FileDataSource.prototype.hasChildren = function (tree, stat) {
        return stat instanceof Model || (stat instanceof ExplorerItem && (stat.isDirectory || stat.isRoot));
    };
    FileDataSource.prototype.getChildren = function (tree, stat) {
        var _this = this;
        if (stat instanceof Model) {
            return Promise.resolve(stat.roots);
        }
        // Return early if stat is already resolved
        if (stat.isDirectoryResolved) {
            return Promise.resolve(stat.getChildrenArray());
        }
        // Resolve children and add to fileStat for future lookup
        else {
            // Resolve
            var promise = this.fileService.resolveFile(stat.resource, { resolveSingleChildDescendants: true }).then(function (dirStat) {
                // Convert to view model
                var modelDirStat = ExplorerItem.create(dirStat, stat.root);
                // Add children to folder
                var children = modelDirStat.getChildrenArray();
                if (children) {
                    children.forEach(function (child) {
                        stat.addChild(child);
                    });
                }
                stat.isDirectoryResolved = true;
                return stat.getChildrenArray();
            }, function (e) {
                // Do not show error for roots since we already use an explorer decoration to notify user
                if (!(stat instanceof ExplorerItem && stat.isRoot)) {
                    _this.notificationService.error(e);
                }
                return []; // we could not resolve any children because of an error
            });
            this.progressService.showWhile(promise, this.partService.isCreated() ? 800 : 3200 /* less ugly initial startup */);
            return promise;
        }
    };
    FileDataSource.prototype.getParent = function (tree, stat) {
        if (!stat) {
            return Promise.resolve(null); // can be null if nothing selected in the tree
        }
        // Return if root reached
        if (tree.getInput() === stat) {
            return Promise.resolve(null);
        }
        // Return if parent already resolved
        if (stat instanceof ExplorerItem && stat.parent) {
            return Promise.resolve(stat.parent);
        }
        // We never actually resolve the parent from the disk for performance reasons. It wouldnt make
        // any sense to resolve parent by parent with requests to walk up the chain. Instead, the explorer
        // makes sure to properly resolve a deep path to a specific file and merges the result with the model.
        return Promise.resolve(null);
    };
    FileDataSource = __decorate([
        __param(0, IProgressService),
        __param(1, INotificationService),
        __param(2, IFileService),
        __param(3, IPartService)
    ], FileDataSource);
    return FileDataSource;
}());
export { FileDataSource };
var FileViewletState = /** @class */ (function () {
    function FileViewletState() {
        this.editableStats = new Map();
    }
    FileViewletState.prototype.getEditableData = function (stat) {
        return this.editableStats.get(stat);
    };
    FileViewletState.prototype.setEditable = function (stat, editableData) {
        if (editableData) {
            this.editableStats.set(stat, editableData);
        }
    };
    FileViewletState.prototype.clearEditable = function (stat) {
        this.editableStats.delete(stat);
    };
    return FileViewletState;
}());
export { FileViewletState };
var ActionRunner = /** @class */ (function (_super) {
    __extends(ActionRunner, _super);
    function ActionRunner(state) {
        var _this = _super.call(this) || this;
        _this.viewletState = state;
        return _this;
    }
    ActionRunner.prototype.run = function (action, context) {
        return _super.prototype.run.call(this, action, { viewletState: this.viewletState });
    };
    return ActionRunner;
}(BaseActionRunner));
export { ActionRunner };
// Explorer Renderer
var FileRenderer = /** @class */ (function () {
    function FileRenderer(state, contextViewService, instantiationService, themeService, configurationService, contextService) {
        var _this = this;
        this.contextViewService = contextViewService;
        this.instantiationService = instantiationService;
        this.themeService = themeService;
        this.configurationService = configurationService;
        this.contextService = contextService;
        this.state = state;
        this.config = this.configurationService.getValue();
        this.configListener = this.configurationService.onDidChangeConfiguration(function (e) {
            if (e.affectsConfiguration('explorer')) {
                _this.config = _this.configurationService.getValue();
            }
        });
    }
    FileRenderer.prototype.dispose = function () {
        this.configListener.dispose();
    };
    FileRenderer.prototype.getHeight = function (tree, element) {
        return FileRenderer.ITEM_HEIGHT;
    };
    FileRenderer.prototype.getTemplateId = function (tree, element) {
        return FileRenderer.FILE_TEMPLATE_ID;
    };
    FileRenderer.prototype.disposeTemplate = function (tree, templateId, templateData) {
        templateData.elementDisposable.dispose();
        templateData.label.dispose();
    };
    FileRenderer.prototype.renderTemplate = function (tree, templateId, container) {
        var elementDisposable = Disposable.None;
        var label = this.instantiationService.createInstance(FileLabel, container, void 0);
        return { elementDisposable: elementDisposable, label: label, container: container };
    };
    FileRenderer.prototype.renderElement = function (tree, stat, templateId, templateData) {
        templateData.elementDisposable.dispose();
        var editableData = this.state.getEditableData(stat);
        // File Label
        if (!editableData) {
            templateData.label.element.style.display = 'flex';
            var extraClasses = ['explorer-item'];
            templateData.label.setFile(stat.resource, {
                hidePath: true,
                fileKind: stat.isRoot ? FileKind.ROOT_FOLDER : stat.isDirectory ? FileKind.FOLDER : FileKind.FILE,
                extraClasses: extraClasses,
                fileDecorations: this.config.explorer.decorations
            });
            templateData.elementDisposable = templateData.label.onDidRender(function () {
                tree.updateWidth(stat);
            });
        }
        // Input Box
        else {
            templateData.label.element.style.display = 'none';
            this.renderInputBox(templateData.container, tree, stat, editableData);
            templateData.elementDisposable = Disposable.None;
        }
    };
    FileRenderer.prototype.renderInputBox = function (container, tree, stat, editableData) {
        var _this = this;
        // Use a file label only for the icon next to the input box
        var label = this.instantiationService.createInstance(FileLabel, container, void 0);
        var extraClasses = ['explorer-item', 'explorer-item-edited'];
        var fileKind = stat.isRoot ? FileKind.ROOT_FOLDER : (stat.isDirectory || (stat instanceof NewStatPlaceholder && stat.isDirectoryPlaceholder())) ? FileKind.FOLDER : FileKind.FILE;
        var labelOptions = { hidePath: true, hideLabel: true, fileKind: fileKind, extraClasses: extraClasses };
        var parent = stat.name ? resources.dirname(stat.resource) : stat.resource;
        var value = stat.name || '';
        label.setFile(resources.joinPath(parent, value || ' '), labelOptions); // Use icon for ' ' if name is empty.
        // Input field for name
        var inputBox = new InputBox(label.element, this.contextViewService, {
            validationOptions: {
                validation: editableData.validator
            },
            ariaLabel: nls.localize('fileInputAriaLabel', "Type file name. Press Enter to confirm or Escape to cancel.")
        });
        var styler = attachInputBoxStyler(inputBox, this.themeService);
        inputBox.onDidChange(function (value) {
            label.setFile(resources.joinPath(parent, value || ' '), labelOptions); // update label icon while typing!
        });
        var lastDot = value.lastIndexOf('.');
        inputBox.value = value;
        inputBox.select({ start: 0, end: lastDot > 0 && !stat.isDirectory ? lastDot : value.length });
        inputBox.focus();
        var done = once(function (commit, blur) {
            tree.clearHighlight();
            label.element.style.display = 'none';
            if (commit && inputBox.value) {
                editableData.action.run({ value: inputBox.value });
            }
            setTimeout(function () {
                if (!blur) { // https://github.com/Microsoft/vscode/issues/20269
                    tree.domFocus();
                }
                dispose(toDispose);
                container.removeChild(label.element);
            }, 0);
        });
        var toDispose = [
            inputBox,
            DOM.addStandardDisposableListener(inputBox.inputElement, DOM.EventType.KEY_DOWN, function (e) {
                if (e.equals(3 /* Enter */)) {
                    if (inputBox.validate()) {
                        done(true, false);
                    }
                }
                else if (e.equals(9 /* Escape */)) {
                    done(false, false);
                }
            }),
            DOM.addStandardDisposableListener(inputBox.inputElement, DOM.EventType.KEY_UP, function (e) {
                var initialRelPath = path.relative(stat.root.resource.path, stat.parent.resource.path);
                var projectFolderName = '';
                if (_this.contextService.getWorkbenchState() === 3 /* WORKSPACE */) {
                    projectFolderName = paths.basename(stat.root.resource.path); // show root folder name in multi-folder project
                }
                _this.showInputMessage(inputBox, initialRelPath, projectFolderName, editableData.action.id);
            }),
            DOM.addDisposableListener(inputBox.inputElement, DOM.EventType.BLUR, function () {
                done(inputBox.isInputValid(), true);
            }),
            label,
            styler
        ];
    };
    FileRenderer.prototype.showInputMessage = function (inputBox, initialRelPath, projectFolderName, actionID) {
        if (projectFolderName === void 0) { projectFolderName = ''; }
        if (inputBox.validate()) {
            var value = inputBox.value;
            if (value && /.[\\/]./.test(value)) { // only show if there's at least one slash enclosed in the string
                var displayPath = path.normalize(path.join(projectFolderName, initialRelPath, value));
                displayPath = rtrim(displayPath, paths.nativeSep);
                var indexLastSlash = displayPath.lastIndexOf(paths.nativeSep);
                var name_1 = displayPath.substring(indexLastSlash + 1);
                var leadingPathPart = displayPath.substring(0, indexLastSlash);
                var msg = void 0;
                switch (actionID) {
                    case 'workbench.files.action.createFileFromExplorer':
                        msg = nls.localize('createFileFromExplorerInfoMessage', "Create file **{0}** in **{1}**", name_1, leadingPathPart);
                        break;
                    case 'workbench.files.action.renameFile':
                        msg = nls.localize('renameFileFromExplorerInfoMessage', "Move and rename to **{0}**", displayPath);
                        break;
                    case 'workbench.files.action.createFolderFromExplorer': // fallthrough
                    default:
                        msg = nls.localize('createFolderFromExplorerInfoMessage', "Create folder **{0}** in **{1}**", name_1, leadingPathPart);
                }
                inputBox.showMessage({
                    type: 1 /* INFO */,
                    content: msg,
                    formatContent: true
                });
            }
            else if (value && /^\s|\s$/.test(value)) {
                inputBox.showMessage({
                    content: nls.localize('whitespace', "Leading or trailing whitespace detected"),
                    formatContent: true,
                    type: 2 /* WARNING */
                });
            }
            else { // fixes #46744: inputbox hides again if all slashes are removed
                inputBox.hideMessage();
            }
        }
    };
    FileRenderer.ITEM_HEIGHT = 22;
    FileRenderer.FILE_TEMPLATE_ID = 'file';
    FileRenderer = __decorate([
        __param(1, IContextViewService),
        __param(2, IInstantiationService),
        __param(3, IThemeService),
        __param(4, IConfigurationService),
        __param(5, IWorkspaceContextService)
    ], FileRenderer);
    return FileRenderer;
}());
export { FileRenderer };
// Explorer Accessibility Provider
var FileAccessibilityProvider = /** @class */ (function () {
    function FileAccessibilityProvider() {
    }
    FileAccessibilityProvider.prototype.getAriaLabel = function (tree, stat) {
        return stat.name;
    };
    return FileAccessibilityProvider;
}());
export { FileAccessibilityProvider };
// Explorer Controller
var FileController = /** @class */ (function (_super) {
    __extends(FileController, _super);
    function FileController(editorService, contextMenuService, telemetryService, menuService, contextKeyService, clipboardService, configurationService) {
        var _this = _super.call(this, { clickBehavior: 1 /* ON_MOUSE_UP */ /* do not change to not break DND */ }, configurationService) || this;
        _this.editorService = editorService;
        _this.contextMenuService = contextMenuService;
        _this.telemetryService = telemetryService;
        _this.menuService = menuService;
        _this.clipboardService = clipboardService;
        _this.fileCopiedContextKey = FileCopiedContext.bindTo(contextKeyService);
        _this.toDispose = [];
        return _this;
    }
    FileController.prototype.onLeftClick = function (tree, stat, event, origin) {
        if (origin === void 0) { origin = 'mouse'; }
        var payload = { origin: origin };
        var isDoubleClick = (origin === 'mouse' && event.detail === 2);
        // Handle Highlight Mode
        if (tree.getHighlight()) {
            // Cancel Event
            event.preventDefault();
            event.stopPropagation();
            tree.clearHighlight(payload);
            return false;
        }
        // Handle root
        if (stat instanceof Model) {
            tree.clearFocus(payload);
            tree.clearSelection(payload);
            return false;
        }
        // Cancel Event
        var isMouseDown = event && event.browserEvent && event.browserEvent.type === 'mousedown';
        if (!isMouseDown) {
            event.preventDefault(); // we cannot preventDefault onMouseDown because this would break DND otherwise
        }
        event.stopPropagation();
        // Set DOM focus
        tree.domFocus();
        if (stat instanceof NewStatPlaceholder) {
            return true;
        }
        // Allow to multiselect
        if ((tree.useAltAsMultipleSelectionModifier && event.altKey) || !tree.useAltAsMultipleSelectionModifier && (event.ctrlKey || event.metaKey)) {
            var selection = tree.getSelection();
            this.previousSelectionRangeStop = undefined;
            if (selection.indexOf(stat) >= 0) {
                tree.setSelection(selection.filter(function (s) { return s !== stat; }));
            }
            else {
                tree.setSelection(selection.concat(stat));
                tree.setFocus(stat, payload);
            }
        }
        // Allow to unselect
        else if (event.shiftKey) {
            var focus_1 = tree.getFocus();
            if (focus_1) {
                if (this.previousSelectionRangeStop) {
                    tree.deselectRange(stat, this.previousSelectionRangeStop);
                }
                tree.selectRange(focus_1, stat, payload);
                this.previousSelectionRangeStop = stat;
            }
        }
        // Select, Focus and open files
        else {
            // Expand / Collapse
            if (isDoubleClick || this.openOnSingleClick || this.isClickOnTwistie(event)) {
                tree.toggleExpansion(stat, event.altKey);
                this.previousSelectionRangeStop = undefined;
            }
            var preserveFocus = !isDoubleClick;
            tree.setFocus(stat, payload);
            if (isDoubleClick) {
                event.preventDefault(); // focus moves to editor, we need to prevent default
            }
            tree.setSelection([stat], payload);
            if (!stat.isDirectory && (isDoubleClick || this.openOnSingleClick)) {
                var sideBySide = false;
                if (event) {
                    sideBySide = tree.useAltAsMultipleSelectionModifier ? (event.ctrlKey || event.metaKey) : event.altKey;
                }
                this.openEditor(stat, { preserveFocus: preserveFocus, sideBySide: sideBySide, pinned: isDoubleClick });
            }
        }
        return true;
    };
    FileController.prototype.onMouseMiddleClick = function (tree, element, event) {
        var sideBySide = false;
        if (event) {
            sideBySide = tree.useAltAsMultipleSelectionModifier ? (event.ctrlKey || event.metaKey) : event.altKey;
        }
        if (element instanceof ExplorerItem && !element.isDirectory) {
            this.openEditor(element, { preserveFocus: true, sideBySide: sideBySide, pinned: true });
        }
        return true;
    };
    FileController.prototype.onContextMenu = function (tree, stat, event) {
        var _this = this;
        if (event.target && event.target.tagName && event.target.tagName.toLowerCase() === 'input') {
            return false;
        }
        event.preventDefault();
        event.stopPropagation();
        tree.setFocus(stat);
        // update dynamic contexts
        this.fileCopiedContextKey.set(this.clipboardService.hasResources());
        if (!this.contributedContextMenu) {
            this.contributedContextMenu = this.menuService.createMenu(MenuId.ExplorerContext, tree.contextKeyService);
            this.toDispose.push(this.contributedContextMenu);
        }
        var anchor = { x: event.posx, y: event.posy };
        var selection = tree.getSelection();
        this.contextMenuService.showContextMenu({
            getAnchor: function () { return anchor; },
            getActions: function () {
                var actions = [];
                fillInContextMenuActions(_this.contributedContextMenu, { arg: stat instanceof ExplorerItem ? stat.resource : {}, shouldForwardArgs: true }, actions, _this.contextMenuService);
                return Promise.resolve(actions);
            },
            onHide: function (wasCancelled) {
                if (wasCancelled) {
                    tree.domFocus();
                }
            },
            getActionsContext: function () { return selection && selection.indexOf(stat) >= 0
                ? selection.map(function (fs) { return fs.resource; })
                : stat instanceof ExplorerItem ? [stat.resource] : []; }
        });
        return true;
    };
    FileController.prototype.openEditor = function (stat, options) {
        if (stat && !stat.isDirectory) {
            /* __GDPR__
                "workbenchActionExecuted" : {
                    "id" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
                    "from": { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
                }
            */
            this.telemetryService.publicLog('workbenchActionExecuted', { id: 'workbench.files.openFile', from: 'explorer' });
            this.editorService.openEditor({ resource: stat.resource, options: options }, options.sideBySide ? SIDE_GROUP : ACTIVE_GROUP);
        }
    };
    FileController.prototype.dispose = function () {
        this.toDispose = dispose(this.toDispose);
    };
    FileController = __decorate([
        __param(0, IEditorService),
        __param(1, IContextMenuService),
        __param(2, ITelemetryService),
        __param(3, IMenuService),
        __param(4, IContextKeyService),
        __param(5, IClipboardService),
        __param(6, IConfigurationService)
    ], FileController);
    return FileController;
}(WorkbenchTreeController));
export { FileController };
// Explorer Sorter
var FileSorter = /** @class */ (function () {
    function FileSorter(configurationService, contextService) {
        this.configurationService = configurationService;
        this.contextService = contextService;
        this.toDispose = [];
        this.updateSortOrder();
        this.registerListeners();
    }
    FileSorter.prototype.registerListeners = function () {
        var _this = this;
        this.toDispose.push(this.configurationService.onDidChangeConfiguration(function (e) { return _this.updateSortOrder(); }));
    };
    FileSorter.prototype.updateSortOrder = function () {
        this.sortOrder = this.configurationService.getValue('explorer.sortOrder') || 'default';
    };
    FileSorter.prototype.compare = function (tree, statA, statB) {
        // Do not sort roots
        if (statA.isRoot) {
            if (statB.isRoot) {
                return this.contextService.getWorkspaceFolder(statA.resource).index - this.contextService.getWorkspaceFolder(statB.resource).index;
            }
            return -1;
        }
        if (statB.isRoot) {
            return 1;
        }
        // Sort Directories
        switch (this.sortOrder) {
            case 'type':
                if (statA.isDirectory && !statB.isDirectory) {
                    return -1;
                }
                if (statB.isDirectory && !statA.isDirectory) {
                    return 1;
                }
                if (statA.isDirectory && statB.isDirectory) {
                    return comparers.compareFileNames(statA.name, statB.name);
                }
                break;
            case 'filesFirst':
                if (statA.isDirectory && !statB.isDirectory) {
                    return 1;
                }
                if (statB.isDirectory && !statA.isDirectory) {
                    return -1;
                }
                break;
            case 'mixed':
                break; // not sorting when "mixed" is on
            default: /* 'default', 'modified' */
                if (statA.isDirectory && !statB.isDirectory) {
                    return -1;
                }
                if (statB.isDirectory && !statA.isDirectory) {
                    return 1;
                }
                break;
        }
        // Sort "New File/Folder" placeholders
        if (statA instanceof NewStatPlaceholder) {
            return -1;
        }
        if (statB instanceof NewStatPlaceholder) {
            return 1;
        }
        // Sort Files
        switch (this.sortOrder) {
            case 'type':
                return comparers.compareFileExtensions(statA.name, statB.name);
            case 'modified':
                if (statA.mtime !== statB.mtime) {
                    return statA.mtime < statB.mtime ? 1 : -1;
                }
                return comparers.compareFileNames(statA.name, statB.name);
            default: /* 'default', 'mixed', 'filesFirst' */
                return comparers.compareFileNames(statA.name, statB.name);
        }
    };
    FileSorter.prototype.dispose = function () {
        this.toDispose = dispose(this.toDispose);
    };
    FileSorter = __decorate([
        __param(0, IConfigurationService),
        __param(1, IWorkspaceContextService)
    ], FileSorter);
    return FileSorter;
}());
export { FileSorter };
var FileFilter = /** @class */ (function () {
    function FileFilter(contextService, configurationService) {
        this.contextService = contextService;
        this.configurationService = configurationService;
        this.hiddenExpressionPerRoot = new Map();
        this.registerListeners();
    }
    FileFilter.prototype.registerListeners = function () {
        var _this = this;
        this.workspaceFolderChangeListener = this.contextService.onDidChangeWorkspaceFolders(function () { return _this.updateConfiguration(); });
    };
    FileFilter.prototype.updateConfiguration = function () {
        var _this = this;
        var needsRefresh = false;
        this.contextService.getWorkspace().folders.forEach(function (folder) {
            var configuration = _this.configurationService.getValue({ resource: folder.uri });
            var excludesConfig = (configuration && configuration.files && configuration.files.exclude) || Object.create(null);
            if (!needsRefresh) {
                var cached = _this.hiddenExpressionPerRoot.get(folder.uri.toString());
                needsRefresh = !cached || !objects.equals(cached.original, excludesConfig);
            }
            var excludesConfigCopy = objects.deepClone(excludesConfig); // do not keep the config, as it gets mutated under our hoods
            _this.hiddenExpressionPerRoot.set(folder.uri.toString(), { original: excludesConfigCopy, parsed: glob.parse(excludesConfigCopy) });
        });
        return needsRefresh;
    };
    FileFilter.prototype.isVisible = function (tree, stat) {
        return this.doIsVisible(stat);
    };
    FileFilter.prototype.doIsVisible = function (stat) {
        if (stat instanceof NewStatPlaceholder || stat.isRoot) {
            return true; // always visible
        }
        // Hide those that match Hidden Patterns
        var cached = this.hiddenExpressionPerRoot.get(stat.root.resource.toString());
        if (cached && cached.parsed(paths.normalize(path.relative(stat.root.resource.path, stat.resource.path), true), stat.name, function (name) { return !!stat.parent.getChild(name); })) {
            return false; // hidden through pattern
        }
        return true;
    };
    FileFilter.prototype.dispose = function () {
        this.workspaceFolderChangeListener = dispose(this.workspaceFolderChangeListener);
    };
    FileFilter = __decorate([
        __param(0, IWorkspaceContextService),
        __param(1, IConfigurationService)
    ], FileFilter);
    return FileFilter;
}());
export { FileFilter };
// Explorer Drag And Drop Controller
var FileDragAndDrop = /** @class */ (function (_super) {
    __extends(FileDragAndDrop, _super);
    function FileDragAndDrop(notificationService, dialogService, contextService, fileService, configurationService, instantiationService, textFileService, windowService, workspaceEditingService) {
        var _this = _super.call(this, function (stat) { return _this.statToResource(stat); }, instantiationService) || this;
        _this.notificationService = notificationService;
        _this.dialogService = dialogService;
        _this.contextService = contextService;
        _this.fileService = fileService;
        _this.configurationService = configurationService;
        _this.textFileService = textFileService;
        _this.windowService = windowService;
        _this.workspaceEditingService = workspaceEditingService;
        _this.toDispose = [];
        _this.updateDropEnablement();
        _this.registerListeners();
        return _this;
    }
    FileDragAndDrop.prototype.statToResource = function (stat) {
        if (stat.isDirectory) {
            return URI.from({ scheme: 'folder', path: stat.resource.path }); // indicates that we are dragging a folder
        }
        return stat.resource;
    };
    FileDragAndDrop.prototype.registerListeners = function () {
        var _this = this;
        this.toDispose.push(this.configurationService.onDidChangeConfiguration(function (e) { return _this.updateDropEnablement(); }));
    };
    FileDragAndDrop.prototype.updateDropEnablement = function () {
        this.dropEnabled = this.configurationService.getValue('explorer.enableDragAndDrop');
    };
    FileDragAndDrop.prototype.onDragStart = function (tree, data, originalEvent) {
        var sources = data.getData();
        if (sources && sources.length) {
            // When dragging folders, make sure to collapse them to free up some space
            sources.forEach(function (s) {
                if (s.isDirectory && tree.isExpanded(s)) {
                    tree.collapse(s, false);
                }
            });
            // Apply some datatransfer types to allow for dragging the element outside of the application
            this.instantiationService.invokeFunction(fillResourceDataTransfers, sources, originalEvent);
            // The only custom data transfer we set from the explorer is a file transfer
            // to be able to DND between multiple code file explorers across windows
            var fileResources = sources.filter(function (s) { return !s.isDirectory && s.resource.scheme === Schemas.file; }).map(function (r) { return r.resource.fsPath; });
            if (fileResources.length) {
                originalEvent.dataTransfer.setData(CodeDataTransfers.FILES, JSON.stringify(fileResources));
            }
        }
    };
    FileDragAndDrop.prototype.onDragOver = function (tree, data, target, originalEvent) {
        if (!this.dropEnabled) {
            return DRAG_OVER_REJECT;
        }
        var isCopy = originalEvent && ((originalEvent.ctrlKey && !isMacintosh) || (originalEvent.altKey && isMacintosh));
        var fromDesktop = data instanceof DesktopDragAndDropData;
        // Desktop DND
        if (fromDesktop) {
            var types = originalEvent.dataTransfer.types;
            var typesArray = [];
            for (var i = 0; i < types.length; i++) {
                typesArray.push(types[i].toLowerCase()); // somehow the types are lowercase
            }
            if (typesArray.indexOf(DataTransfers.FILES.toLowerCase()) === -1 && typesArray.indexOf(CodeDataTransfers.FILES.toLowerCase()) === -1) {
                return DRAG_OVER_REJECT;
            }
        }
        // Other-Tree DND
        else if (data instanceof ExternalElementsDragAndDropData) {
            return DRAG_OVER_REJECT;
        }
        // In-Explorer DND
        else {
            var sources = data.getData();
            if (target instanceof Model) {
                if (sources[0].isRoot) {
                    return DRAG_OVER_ACCEPT_BUBBLE_DOWN(false);
                }
                return DRAG_OVER_REJECT;
            }
            if (!Array.isArray(sources)) {
                return DRAG_OVER_REJECT;
            }
            if (sources.some(function (source) {
                if (source instanceof NewStatPlaceholder) {
                    return true; // NewStatPlaceholders can not be moved
                }
                if (source.isRoot && target instanceof ExplorerItem && !target.isRoot) {
                    return true; // Root folder can not be moved to a non root file stat.
                }
                if (source.resource.toString() === target.resource.toString()) {
                    return true; // Can not move anything onto itself
                }
                if (source.isRoot && target instanceof ExplorerItem && target.isRoot) {
                    // Disable moving workspace roots in one another
                    return false;
                }
                if (!isCopy && resources.dirname(source.resource).toString() === target.resource.toString()) {
                    return true; // Can not move a file to the same parent unless we copy
                }
                if (resources.isEqualOrParent(target.resource, source.resource, !isLinux /* ignorecase */)) {
                    return true; // Can not move a parent folder into one of its children
                }
                return false;
            })) {
                return DRAG_OVER_REJECT;
            }
        }
        // All (target = model)
        if (target instanceof Model) {
            return this.contextService.getWorkbenchState() === 3 /* WORKSPACE */ ? DRAG_OVER_ACCEPT_BUBBLE_DOWN_COPY(false) : DRAG_OVER_REJECT; // can only drop folders to workspace
        }
        // All (target = file/folder)
        else {
            if (target.isDirectory) {
                if (target.isReadonly) {
                    return DRAG_OVER_REJECT;
                }
                return fromDesktop || isCopy ? DRAG_OVER_ACCEPT_BUBBLE_DOWN_COPY(true) : DRAG_OVER_ACCEPT_BUBBLE_DOWN(true);
            }
            if (this.contextService.getWorkspace().folders.every(function (folder) { return folder.uri.toString() !== target.resource.toString(); })) {
                return fromDesktop || isCopy ? DRAG_OVER_ACCEPT_BUBBLE_UP_COPY : DRAG_OVER_ACCEPT_BUBBLE_UP;
            }
        }
        return DRAG_OVER_REJECT;
    };
    FileDragAndDrop.prototype.drop = function (tree, data, target, originalEvent) {
        // Desktop DND (Import file)
        if (data instanceof DesktopDragAndDropData) {
            this.handleExternalDrop(tree, data, target, originalEvent);
        }
        // In-Explorer DND (Move/Copy file)
        else {
            this.handleExplorerDrop(tree, data, target, originalEvent);
        }
    };
    FileDragAndDrop.prototype.handleExternalDrop = function (tree, data, target, originalEvent) {
        var _this = this;
        var droppedResources = extractResources(originalEvent.browserEvent, true);
        // Check for dropped external files to be folders
        return this.fileService.resolveFiles(droppedResources).then(function (result) {
            // Pass focus to window
            _this.windowService.focusWindow();
            // Handle folders by adding to workspace if we are in workspace context
            var folders = result.filter(function (r) { return r.success && r.stat.isDirectory; }).map(function (result) { return ({ uri: result.stat.resource }); });
            if (folders.length > 0) {
                // If we are in no-workspace context, ask for confirmation to create a workspace
                var confirmedPromise = Promise.resolve({ confirmed: true });
                if (_this.contextService.getWorkbenchState() !== 3 /* WORKSPACE */) {
                    confirmedPromise = _this.dialogService.confirm({
                        message: folders.length > 1 ? nls.localize('dropFolders', "Do you want to add the folders to the workspace?") : nls.localize('dropFolder', "Do you want to add the folder to the workspace?"),
                        type: 'question',
                        primaryButton: folders.length > 1 ? nls.localize('addFolders', "&&Add Folders") : nls.localize('addFolder', "&&Add Folder")
                    });
                }
                return confirmedPromise.then(function (res) {
                    if (res.confirmed) {
                        return _this.workspaceEditingService.addFolders(folders);
                    }
                    return void 0;
                });
            }
            // Handle dropped files (only support FileStat as target)
            else if (target instanceof ExplorerItem && !target.isReadonly) {
                var addFilesAction = _this.instantiationService.createInstance(AddFilesAction, tree, target, null);
                return addFilesAction.run(droppedResources.map(function (res) { return res.resource; }));
            }
            return void 0;
        });
    };
    FileDragAndDrop.prototype.handleExplorerDrop = function (tree, data, target, originalEvent) {
        var _this = this;
        var sources = resources.distinctParents(data.getData(), function (s) { return s.resource; });
        var isCopy = (originalEvent.ctrlKey && !isMacintosh) || (originalEvent.altKey && isMacintosh);
        var confirmPromise;
        // Handle confirm setting
        var confirmDragAndDrop = !isCopy && this.configurationService.getValue(FileDragAndDrop.CONFIRM_DND_SETTING_KEY);
        if (confirmDragAndDrop) {
            confirmPromise = this.dialogService.confirm({
                message: sources.length > 1 && sources.every(function (s) { return s.isRoot; }) ? nls.localize('confirmRootsMove', "Are you sure you want to change the order of multiple root folders in your workspace?")
                    : sources.length > 1 ? getConfirmMessage(nls.localize('confirmMultiMove', "Are you sure you want to move the following {0} files?", sources.length), sources.map(function (s) { return s.resource; }))
                        : sources[0].isRoot ? nls.localize('confirmRootMove', "Are you sure you want to change the order of root folder '{0}' in your workspace?", sources[0].name)
                            : nls.localize('confirmMove', "Are you sure you want to move '{0}'?", sources[0].name),
                checkbox: {
                    label: nls.localize('doNotAskAgain', "Do not ask me again")
                },
                type: 'question',
                primaryButton: nls.localize({ key: 'moveButtonLabel', comment: ['&& denotes a mnemonic'] }, "&&Move")
            });
        }
        else {
            confirmPromise = Promise.resolve({ confirmed: true });
        }
        return confirmPromise.then(function (res) {
            // Check for confirmation checkbox
            var updateConfirmSettingsPromise = Promise.resolve(void 0);
            if (res.confirmed && res.checkboxChecked === true) {
                updateConfirmSettingsPromise = _this.configurationService.updateValue(FileDragAndDrop.CONFIRM_DND_SETTING_KEY, false, 1 /* USER */);
            }
            return updateConfirmSettingsPromise.then(function () {
                if (res.confirmed) {
                    var rootDropPromise = _this.doHandleRootDrop(sources.filter(function (s) { return s.isRoot; }), target);
                    return Promise.all(sources.filter(function (s) { return !s.isRoot; }).map(function (source) { return _this.doHandleExplorerDrop(tree, source, target, isCopy); }).concat(rootDropPromise)).then(function () { return void 0; });
                }
                return Promise.resolve(void 0);
            });
        });
    };
    FileDragAndDrop.prototype.doHandleRootDrop = function (roots, target) {
        if (roots.length === 0) {
            return Promise.resolve(undefined);
        }
        var folders = this.contextService.getWorkspace().folders;
        var targetIndex;
        var workspaceCreationData = [];
        var rootsToMove = [];
        var _loop_1 = function (index) {
            var data = {
                uri: folders[index].uri
            };
            if (target instanceof ExplorerItem && folders[index].uri.toString() === target.resource.toString()) {
                targetIndex = workspaceCreationData.length;
            }
            if (roots.every(function (r) { return r.resource.toString() !== folders[index].uri.toString(); })) {
                workspaceCreationData.push(data);
            }
            else {
                rootsToMove.push(data);
            }
        };
        for (var index = 0; index < folders.length; index++) {
            _loop_1(index);
        }
        if (target instanceof Model) {
            targetIndex = workspaceCreationData.length;
        }
        workspaceCreationData.splice.apply(workspaceCreationData, [targetIndex, 0].concat(rootsToMove));
        return this.workspaceEditingService.updateFolders(0, workspaceCreationData.length, workspaceCreationData);
    };
    FileDragAndDrop.prototype.doHandleExplorerDrop = function (tree, source, target, isCopy) {
        var _this = this;
        if (!(target instanceof ExplorerItem)) {
            return Promise.resolve(void 0);
        }
        return tree.expand(target).then(function () {
            if (target.isReadonly) {
                return void 0;
            }
            // Reuse duplicate action if user copies
            if (isCopy) {
                return _this.instantiationService.createInstance(DuplicateFileAction, tree, source, target).run();
            }
            // Otherwise move
            var targetResource = resources.joinPath(target.resource, source.name);
            return _this.textFileService.move(source.resource, targetResource).then(null, function (error) {
                // Conflict
                if (error.fileOperationResult === 5 /* FILE_MOVE_CONFLICT */) {
                    var confirm_1 = {
                        message: nls.localize('confirmOverwriteMessage', "'{0}' already exists in the destination folder. Do you want to replace it?", source.name),
                        detail: nls.localize('irreversible', "This action is irreversible!"),
                        primaryButton: nls.localize({ key: 'replaceButtonLabel', comment: ['&& denotes a mnemonic'] }, "&&Replace"),
                        type: 'warning'
                    };
                    // Move with overwrite if the user confirms
                    return _this.dialogService.confirm(confirm_1).then(function (res) {
                        if (res.confirmed) {
                            return _this.textFileService.move(source.resource, targetResource, true /* overwrite */).then(null, function (error) { return _this.notificationService.error(error); });
                        }
                        return void 0;
                    });
                }
                // Any other error
                else {
                    _this.notificationService.error(error);
                }
                return void 0;
            });
        }, errors.onUnexpectedError);
    };
    FileDragAndDrop.CONFIRM_DND_SETTING_KEY = 'explorer.confirmDragAndDrop';
    FileDragAndDrop = __decorate([
        __param(0, INotificationService),
        __param(1, IDialogService),
        __param(2, IWorkspaceContextService),
        __param(3, IFileService),
        __param(4, IConfigurationService),
        __param(5, IInstantiationService),
        __param(6, ITextFileService),
        __param(7, IWindowService),
        __param(8, IWorkspaceEditingService)
    ], FileDragAndDrop);
    return FileDragAndDrop;
}(SimpleFileResourceDragAndDrop));
export { FileDragAndDrop };
