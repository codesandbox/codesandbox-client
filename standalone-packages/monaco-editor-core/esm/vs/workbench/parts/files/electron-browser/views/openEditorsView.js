/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
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
import * as nls from '../../../../../nls';
import { RunOnceScheduler } from '../../../../../base/common/async';
import { ActionRunner } from '../../../../../base/common/actions';
import * as dom from '../../../../../base/browser/dom';
import { IContextMenuService } from '../../../../../platform/contextview/browser/contextView';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation';
import { IEditorGroupsService } from '../../../../services/group/common/editorGroupsService';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration';
import { IKeybindingService } from '../../../../../platform/keybinding/common/keybinding';
import { SaveAllAction, SaveAllInGroupAction, CloseGroupAction } from '../fileActions';
import { OpenEditorsFocusedContext, ExplorerFocusedContext } from '../../common/files';
import { ITextFileService } from '../../../../services/textfile/common/textfiles';
import { OpenEditor } from '../../common/explorerModel';
import { IUntitledEditorService } from '../../../../services/untitled/common/untitledEditorService';
import { CloseAllEditorsAction, CloseEditorAction } from '../../../../browser/parts/editor/editorActions';
import { ToggleEditorLayoutAction } from '../../../../browser/actions/toggleEditorLayout';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey';
import { attachStylerCallback } from '../../../../../platform/theme/common/styler';
import { IThemeService } from '../../../../../platform/theme/common/themeService';
import { badgeBackground, badgeForeground, contrastBorder } from '../../../../../platform/theme/common/colorRegistry';
import { WorkbenchList } from '../../../../../platform/list/browser/listService';
import { EditorLabel } from '../../../../browser/labels';
import { ActionBar } from '../../../../../base/browser/ui/actionbar/actionbar';
import { ITelemetryService } from '../../../../../platform/telemetry/common/telemetry';
import { IEditorService, SIDE_GROUP, ACTIVE_GROUP } from '../../../../services/editor/common/editorService';
import { dispose } from '../../../../../base/common/lifecycle';
import { fillInContextMenuActions } from '../../../../../platform/actions/browser/menuItemActionItem';
import { IMenuService, MenuId } from '../../../../../platform/actions/common/actions';
import { DirtyEditorContext, OpenEditorsGroupContext } from '../fileCommands';
import { ResourceContextKey } from '../../../../common/resources';
import { fillResourceDataTransfers, ResourcesDropHandler, LocalSelectionTransfer, CodeDataTransfers } from '../../../../browser/dnd';
import { ViewletPanel } from '../../../../browser/parts/views/panelViewlet';
var $ = dom.$;
var OpenEditorsView = /** @class */ (function (_super) {
    __extends(OpenEditorsView, _super);
    function OpenEditorsView(options, instantiationService, contextMenuService, textFileService, editorService, editorGroupService, configurationService, keybindingService, untitledEditorService, contextKeyService, themeService, telemetryService, menuService) {
        var _this = _super.call(this, __assign({}, options, { ariaHeaderLabel: nls.localize({ key: 'openEditosrSection', comment: ['Open is an adjective'] }, "Open Editors Section") }), keybindingService, contextMenuService, configurationService) || this;
        _this.instantiationService = instantiationService;
        _this.textFileService = textFileService;
        _this.editorService = editorService;
        _this.editorGroupService = editorGroupService;
        _this.untitledEditorService = untitledEditorService;
        _this.contextKeyService = contextKeyService;
        _this.themeService = themeService;
        _this.telemetryService = telemetryService;
        _this.menuService = menuService;
        _this.structuralRefreshDelay = 0;
        _this.listRefreshScheduler = new RunOnceScheduler(function () {
            var previousLength = _this.list.length;
            _this.list.splice(0, _this.list.length, _this.elements);
            _this.focusActiveEditor();
            if (previousLength !== _this.list.length) {
                _this.updateSize();
            }
            _this.needsRefresh = false;
        }, _this.structuralRefreshDelay);
        _this.registerUpdateEvents();
        // Also handle configuration updates
        _this.disposables.push(_this.configurationService.onDidChangeConfiguration(function (e) { return _this.onConfigurationChange(e); }));
        // Handle dirty counter
        _this.disposables.push(_this.untitledEditorService.onDidChangeDirty(function () { return _this.updateDirtyIndicator(); }));
        _this.disposables.push(_this.textFileService.models.onModelsDirty(function () { return _this.updateDirtyIndicator(); }));
        _this.disposables.push(_this.textFileService.models.onModelsSaved(function () { return _this.updateDirtyIndicator(); }));
        _this.disposables.push(_this.textFileService.models.onModelsSaveError(function () { return _this.updateDirtyIndicator(); }));
        _this.disposables.push(_this.textFileService.models.onModelsReverted(function () { return _this.updateDirtyIndicator(); }));
        return _this;
    }
    OpenEditorsView.prototype.registerUpdateEvents = function () {
        var _this = this;
        var updateWholeList = function () {
            if (!_this.isVisible() || !_this.list || !_this.isExpanded()) {
                _this.needsRefresh = true;
                return;
            }
            _this.listRefreshScheduler.schedule(_this.structuralRefreshDelay);
        };
        var groupDisposables = new Map();
        var addGroupListener = function (group) {
            groupDisposables.set(group.id, group.onDidGroupChange(function (e) {
                if (_this.listRefreshScheduler.isScheduled()) {
                    return;
                }
                if (!_this.isVisible() || !_this.list || !_this.isExpanded()) {
                    _this.needsRefresh = true;
                    return;
                }
                var index = _this.getIndex(group, e.editor);
                switch (e.kind) {
                    case 1 /* GROUP_LABEL */: {
                        if (_this.showGroups) {
                            _this.list.splice(index, 1, [group]);
                        }
                        break;
                    }
                    case 0 /* GROUP_ACTIVE */:
                    case 5 /* EDITOR_ACTIVE */: {
                        _this.focusActiveEditor();
                        break;
                    }
                    case 8 /* EDITOR_DIRTY */:
                    case 6 /* EDITOR_LABEL */:
                    case 7 /* EDITOR_PIN */: {
                        _this.list.splice(index, 1, [new OpenEditor(e.editor, group)]);
                        break;
                    }
                    case 2 /* EDITOR_OPEN */: {
                        _this.list.splice(index, 0, [new OpenEditor(e.editor, group)]);
                        setTimeout(function () { return _this.updateSize(); }, _this.structuralRefreshDelay);
                        break;
                    }
                    case 3 /* EDITOR_CLOSE */: {
                        var previousIndex = _this.getIndex(group, undefined) + e.editorIndex + (_this.showGroups ? 1 : 0);
                        _this.list.splice(previousIndex, 1);
                        _this.updateSize();
                        break;
                    }
                    case 4 /* EDITOR_MOVE */: {
                        _this.listRefreshScheduler.schedule();
                        break;
                    }
                }
            }));
            _this.disposables.push(groupDisposables.get(group.id));
        };
        this.editorGroupService.groups.forEach(function (g) { return addGroupListener(g); });
        this.disposables.push(this.editorGroupService.onDidAddGroup(function (group) {
            addGroupListener(group);
            updateWholeList();
        }));
        this.disposables.push(this.editorGroupService.onDidMoveGroup(function () { return updateWholeList(); }));
        this.disposables.push(this.editorGroupService.onDidRemoveGroup(function (group) {
            dispose(groupDisposables.get(group.id));
            updateWholeList();
        }));
    };
    OpenEditorsView.prototype.renderHeaderTitle = function (container) {
        var _this = this;
        _super.prototype.renderHeaderTitle.call(this, container, this.title);
        var count = dom.append(container, $('.count'));
        this.dirtyCountElement = dom.append(count, $('.monaco-count-badge'));
        this.disposables.push((attachStylerCallback(this.themeService, { badgeBackground: badgeBackground, badgeForeground: badgeForeground, contrastBorder: contrastBorder }, function (colors) {
            var background = colors.badgeBackground ? colors.badgeBackground.toString() : null;
            var foreground = colors.badgeForeground ? colors.badgeForeground.toString() : null;
            var border = colors.contrastBorder ? colors.contrastBorder.toString() : null;
            _this.dirtyCountElement.style.backgroundColor = background;
            _this.dirtyCountElement.style.color = foreground;
            _this.dirtyCountElement.style.borderWidth = border ? '1px' : null;
            _this.dirtyCountElement.style.borderStyle = border ? 'solid' : null;
            _this.dirtyCountElement.style.borderColor = border;
        })));
        this.updateDirtyIndicator();
    };
    OpenEditorsView.prototype.renderBody = function (container) {
        var _this = this;
        dom.addClass(container, 'explorer-open-editors');
        dom.addClass(container, 'show-file-icons');
        var delegate = new OpenEditorsDelegate();
        var getSelectedElements = function () {
            var selected = _this.list.getSelectedElements();
            var focused = _this.list.getFocusedElements();
            if (focused.length && selected.indexOf(focused[0]) >= 0) {
                return selected;
            }
            return focused;
        };
        if (this.list) {
            this.list.dispose();
        }
        this.list = this.instantiationService.createInstance(WorkbenchList, container, delegate, [
            new EditorGroupRenderer(this.keybindingService, this.instantiationService, this.editorGroupService),
            new OpenEditorRenderer(getSelectedElements, this.instantiationService, this.keybindingService, this.configurationService, this.editorGroupService)
        ], {
            identityProvider: function (element) { return element instanceof OpenEditor ? element.getId() : element.id.toString(); },
            selectOnMouseDown: false /* disabled to better support DND */
        });
        this.disposables.push(this.list);
        this.contributedContextMenu = this.menuService.createMenu(MenuId.OpenEditorsContext, this.list.contextKeyService);
        this.disposables.push(this.contributedContextMenu);
        this.updateSize();
        // Bind context keys
        OpenEditorsFocusedContext.bindTo(this.list.contextKeyService);
        ExplorerFocusedContext.bindTo(this.list.contextKeyService);
        this.resourceContext = this.instantiationService.createInstance(ResourceContextKey);
        this.disposables.push(this.resourceContext);
        this.groupFocusedContext = OpenEditorsGroupContext.bindTo(this.contextKeyService);
        this.dirtyEditorFocusedContext = DirtyEditorContext.bindTo(this.contextKeyService);
        this.disposables.push(this.list.onContextMenu(function (e) { return _this.onListContextMenu(e); }));
        this.list.onFocusChange(function (e) {
            _this.resourceContext.reset();
            _this.groupFocusedContext.reset();
            _this.dirtyEditorFocusedContext.reset();
            var element = e.elements.length ? e.elements[0] : undefined;
            if (element instanceof OpenEditor) {
                _this.dirtyEditorFocusedContext.set(_this.textFileService.isDirty(element.getResource()));
                _this.resourceContext.set(element.getResource());
            }
            else if (!!element) {
                _this.groupFocusedContext.set(true);
            }
        });
        // Open when selecting via keyboard
        this.disposables.push(this.list.onMouseMiddleClick(function (e) {
            if (e && e.element instanceof OpenEditor) {
                e.element.group.closeEditor(e.element.editor);
            }
        }));
        this.disposables.push(this.list.onOpen(function (e) {
            var browserEvent = e.browserEvent;
            var openToSide = false;
            var isSingleClick = false;
            var isDoubleClick = false;
            if (browserEvent instanceof MouseEvent) {
                isSingleClick = browserEvent.detail === 1;
                isDoubleClick = browserEvent.detail === 2;
                openToSide = _this.list.useAltAsMultipleSelectionModifier ? (browserEvent.ctrlKey || browserEvent.metaKey) : browserEvent.altKey;
            }
            var focused = _this.list.getFocusedElements();
            var element = focused.length ? focused[0] : undefined;
            if (element instanceof OpenEditor) {
                _this.openEditor(element, { preserveFocus: isSingleClick, pinned: isDoubleClick, sideBySide: openToSide });
            }
            else {
                _this.editorGroupService.activateGroup(element);
            }
        }));
        this.listRefreshScheduler.schedule(0);
    };
    OpenEditorsView.prototype.getActions = function () {
        return [
            this.instantiationService.createInstance(ToggleEditorLayoutAction, ToggleEditorLayoutAction.ID, ToggleEditorLayoutAction.LABEL),
            this.instantiationService.createInstance(SaveAllAction, SaveAllAction.ID, SaveAllAction.LABEL),
            this.instantiationService.createInstance(CloseAllEditorsAction, CloseAllEditorsAction.ID, CloseAllEditorsAction.LABEL)
        ];
    };
    OpenEditorsView.prototype.setExpanded = function (expanded) {
        _super.prototype.setExpanded.call(this, expanded);
        this.updateListVisibility(expanded);
        if (expanded && this.needsRefresh) {
            this.listRefreshScheduler.schedule(0);
        }
    };
    OpenEditorsView.prototype.setVisible = function (visible) {
        var _this = this;
        return _super.prototype.setVisible.call(this, visible).then(function () {
            _this.updateListVisibility(visible && _this.isExpanded());
            if (visible && _this.needsRefresh) {
                _this.listRefreshScheduler.schedule(0);
            }
        });
    };
    OpenEditorsView.prototype.focus = function () {
        _super.prototype.focus.call(this);
        this.list.domFocus();
    };
    OpenEditorsView.prototype.getList = function () {
        return this.list;
    };
    OpenEditorsView.prototype.layoutBody = function (size) {
        if (this.list) {
            this.list.layout(size);
        }
    };
    OpenEditorsView.prototype.updateListVisibility = function (isVisible) {
        if (this.list) {
            if (isVisible) {
                dom.show(this.list.getHTMLElement());
            }
            else {
                dom.hide(this.list.getHTMLElement()); // make sure the list goes out of the tabindex world by hiding it
            }
        }
    };
    Object.defineProperty(OpenEditorsView.prototype, "showGroups", {
        get: function () {
            return this.editorGroupService.groups.length > 1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OpenEditorsView.prototype, "elements", {
        get: function () {
            var _this = this;
            var result = [];
            this.editorGroupService.getGroups(2 /* GRID_APPEARANCE */).forEach(function (g) {
                if (_this.showGroups) {
                    result.push(g);
                }
                result.push.apply(result, g.editors.map(function (ei) { return new OpenEditor(ei, g); }));
            });
            return result;
        },
        enumerable: true,
        configurable: true
    });
    OpenEditorsView.prototype.getIndex = function (group, editor) {
        var index = editor ? group.getIndexOfEditor(editor) : 0;
        if (!this.showGroups) {
            return index;
        }
        for (var _i = 0, _a = this.editorGroupService.getGroups(2 /* GRID_APPEARANCE */); _i < _a.length; _i++) {
            var g = _a[_i];
            if (g.id === group.id) {
                return index + (!!editor ? 1 : 0);
            }
            else {
                index += g.count + 1;
            }
        }
        return -1;
    };
    OpenEditorsView.prototype.openEditor = function (element, options) {
        var _this = this;
        if (element) {
            /* __GDPR__
                "workbenchActionExecuted" : {
                    "id" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
                    "from": { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
                }
            */
            this.telemetryService.publicLog('workbenchActionExecuted', { id: 'workbench.files.openFile', from: 'openEditors' });
            var preserveActivateGroup_1 = options.sideBySide && options.preserveFocus; // needed for https://github.com/Microsoft/vscode/issues/42399
            if (!preserveActivateGroup_1) {
                this.editorGroupService.activateGroup(element.groupId); // needed for https://github.com/Microsoft/vscode/issues/6672
            }
            this.editorService.openEditor(element.editor, options, options.sideBySide ? SIDE_GROUP : ACTIVE_GROUP).then(function (editor) {
                if (!preserveActivateGroup_1) {
                    _this.editorGroupService.activateGroup(editor.group);
                }
            });
        }
    };
    OpenEditorsView.prototype.onListContextMenu = function (e) {
        var _this = this;
        var element = e.element;
        this.contextMenuService.showContextMenu({
            getAnchor: function () { return e.anchor; },
            getActions: function () {
                var actions = [];
                fillInContextMenuActions(_this.contributedContextMenu, { shouldForwardArgs: true, arg: element instanceof OpenEditor ? element.editor.getResource() : {} }, actions, _this.contextMenuService);
                return Promise.resolve(actions);
            },
            getActionsContext: function () { return element instanceof OpenEditor ? { groupId: element.groupId, editorIndex: element.editorIndex } : { groupId: element.id }; }
        });
    };
    OpenEditorsView.prototype.focusActiveEditor = function () {
        if (this.list.length && this.editorGroupService.activeGroup) {
            var index = this.getIndex(this.editorGroupService.activeGroup, this.editorGroupService.activeGroup.activeEditor);
            this.list.setFocus([index]);
            this.list.setSelection([index]);
            this.list.reveal(index);
        }
        else {
            this.list.setFocus([]);
            this.list.setSelection([]);
        }
    };
    OpenEditorsView.prototype.onConfigurationChange = function (event) {
        if (event.affectsConfiguration('explorer.openEditors')) {
            this.updateSize();
        }
        // Trigger a 'repaint' when decoration settings change
        if (event.affectsConfiguration('explorer.decorations')) {
            this.listRefreshScheduler.schedule();
        }
    };
    OpenEditorsView.prototype.updateSize = function () {
        // Adjust expanded body size
        this.minimumBodySize = this.getMinExpandedBodySize();
        this.maximumBodySize = this.getMaxExpandedBodySize();
    };
    OpenEditorsView.prototype.updateDirtyIndicator = function () {
        var dirty = this.textFileService.getAutoSaveMode() !== 1 /* AFTER_SHORT_DELAY */ ? this.textFileService.getDirty().length
            : this.untitledEditorService.getDirty().length;
        if (dirty === 0) {
            dom.addClass(this.dirtyCountElement, 'hidden');
        }
        else {
            this.dirtyCountElement.textContent = nls.localize('dirtyCounter', "{0} unsaved", dirty);
            dom.removeClass(this.dirtyCountElement, 'hidden');
        }
    };
    Object.defineProperty(OpenEditorsView.prototype, "elementCount", {
        get: function () {
            return this.editorGroupService.groups.map(function (g) { return g.count; })
                .reduce(function (first, second) { return first + second; }, this.showGroups ? this.editorGroupService.groups.length : 0);
        },
        enumerable: true,
        configurable: true
    });
    OpenEditorsView.prototype.getMaxExpandedBodySize = function () {
        return this.elementCount * OpenEditorsDelegate.ITEM_HEIGHT;
    };
    OpenEditorsView.prototype.getMinExpandedBodySize = function () {
        var visibleOpenEditors = this.configurationService.getValue('explorer.openEditors.visible');
        if (typeof visibleOpenEditors !== 'number') {
            visibleOpenEditors = OpenEditorsView.DEFAULT_VISIBLE_OPEN_EDITORS;
        }
        return this.computeMinExpandedBodySize(visibleOpenEditors);
    };
    OpenEditorsView.prototype.computeMinExpandedBodySize = function (visibleOpenEditors) {
        if (visibleOpenEditors === void 0) { visibleOpenEditors = OpenEditorsView.DEFAULT_VISIBLE_OPEN_EDITORS; }
        var itemsToShow = Math.min(Math.max(visibleOpenEditors, 1), this.elementCount);
        return itemsToShow * OpenEditorsDelegate.ITEM_HEIGHT;
    };
    OpenEditorsView.prototype.setStructuralRefreshDelay = function (delay) {
        this.structuralRefreshDelay = delay;
    };
    OpenEditorsView.prototype.getOptimalWidth = function () {
        var parentNode = this.list.getHTMLElement();
        var childNodes = [].slice.call(parentNode.querySelectorAll('.open-editor > a'));
        return dom.getLargestChildWidth(parentNode, childNodes);
    };
    OpenEditorsView.DEFAULT_VISIBLE_OPEN_EDITORS = 9;
    OpenEditorsView.ID = 'workbench.explorer.openEditorsView';
    OpenEditorsView.NAME = nls.localize({ key: 'openEditors', comment: ['Open is an adjective'] }, "Open Editors");
    OpenEditorsView = __decorate([
        __param(1, IInstantiationService),
        __param(2, IContextMenuService),
        __param(3, ITextFileService),
        __param(4, IEditorService),
        __param(5, IEditorGroupsService),
        __param(6, IConfigurationService),
        __param(7, IKeybindingService),
        __param(8, IUntitledEditorService),
        __param(9, IContextKeyService),
        __param(10, IThemeService),
        __param(11, ITelemetryService),
        __param(12, IMenuService)
    ], OpenEditorsView);
    return OpenEditorsView;
}(ViewletPanel));
export { OpenEditorsView };
var OpenEditorActionRunner = /** @class */ (function (_super) {
    __extends(OpenEditorActionRunner, _super);
    function OpenEditorActionRunner() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OpenEditorActionRunner.prototype.run = function (action, context) {
        return _super.prototype.run.call(this, action, { groupId: this.editor.groupId, editorIndex: this.editor.editorIndex });
    };
    return OpenEditorActionRunner;
}(ActionRunner));
var OpenEditorsDelegate = /** @class */ (function () {
    function OpenEditorsDelegate() {
    }
    OpenEditorsDelegate.prototype.getHeight = function (element) {
        return OpenEditorsDelegate.ITEM_HEIGHT;
    };
    OpenEditorsDelegate.prototype.getTemplateId = function (element) {
        if (element instanceof OpenEditor) {
            return OpenEditorRenderer.ID;
        }
        return EditorGroupRenderer.ID;
    };
    OpenEditorsDelegate.ITEM_HEIGHT = 22;
    return OpenEditorsDelegate;
}());
/**
 * Check if the item being dragged is one of the supported types that can be dropped on an
 * open editor or editor group. Fixes https://github.com/Microsoft/vscode/issues/52344.
 * @param e
 * @returns true if dropping is supported.
 */
function dropOnEditorSupported(e) {
    // DataTransfer types are automatically converted to lower case, except Files.
    var supportedTransferTypes = {
        openEditor: CodeDataTransfers.EDITORS.toLowerCase(),
        externalFile: 'Files',
        codeFile: CodeDataTransfers.FILES.toLowerCase()
    };
    if (e.dataTransfer.types.indexOf(supportedTransferTypes.openEditor) !== -1 ||
        e.dataTransfer.types.indexOf(supportedTransferTypes.externalFile) !== -1 ||
        // All Code files should already register as normal files, but just to be safe:
        e.dataTransfer.types.indexOf(supportedTransferTypes.codeFile) !== -1) {
        return true;
    }
    else {
        return false;
    }
}
var EditorGroupRenderer = /** @class */ (function () {
    function EditorGroupRenderer(keybindingService, instantiationService, editorGroupService) {
        this.keybindingService = keybindingService;
        this.instantiationService = instantiationService;
        this.editorGroupService = editorGroupService;
        this.transfer = LocalSelectionTransfer.getInstance();
        // noop
    }
    Object.defineProperty(EditorGroupRenderer.prototype, "templateId", {
        get: function () {
            return EditorGroupRenderer.ID;
        },
        enumerable: true,
        configurable: true
    });
    EditorGroupRenderer.prototype.renderTemplate = function (container) {
        var _this = this;
        var editorGroupTemplate = Object.create(null);
        editorGroupTemplate.root = dom.append(container, $('.editor-group'));
        editorGroupTemplate.name = dom.append(editorGroupTemplate.root, $('span.name'));
        editorGroupTemplate.actionBar = new ActionBar(container);
        var saveAllInGroupAction = this.instantiationService.createInstance(SaveAllInGroupAction, SaveAllInGroupAction.ID, SaveAllInGroupAction.LABEL);
        var saveAllInGroupKey = this.keybindingService.lookupKeybinding(saveAllInGroupAction.id);
        editorGroupTemplate.actionBar.push(saveAllInGroupAction, { icon: true, label: false, keybinding: saveAllInGroupKey ? saveAllInGroupKey.getLabel() : void 0 });
        var closeGroupAction = this.instantiationService.createInstance(CloseGroupAction, CloseGroupAction.ID, CloseGroupAction.LABEL);
        var closeGroupActionKey = this.keybindingService.lookupKeybinding(closeGroupAction.id);
        editorGroupTemplate.actionBar.push(closeGroupAction, { icon: true, label: false, keybinding: closeGroupActionKey ? closeGroupActionKey.getLabel() : void 0 });
        editorGroupTemplate.toDispose = [];
        editorGroupTemplate.toDispose.push(dom.addDisposableListener(container, dom.EventType.DRAG_OVER, function (e) {
            if (dropOnEditorSupported(e)) {
                dom.addClass(container, 'focused');
            }
        }));
        editorGroupTemplate.toDispose.push(dom.addDisposableListener(container, dom.EventType.DRAG_LEAVE, function () {
            dom.removeClass(container, 'focused');
        }));
        editorGroupTemplate.toDispose.push(dom.addDisposableListener(container, dom.EventType.DROP, function (e) {
            dom.removeClass(container, 'focused');
            if (_this.transfer.hasData(OpenEditor.prototype)) {
                _this.transfer.getData(OpenEditor.prototype).forEach(function (oe) {
                    return oe.group.moveEditor(oe.editor, editorGroupTemplate.editorGroup, { preserveFocus: true });
                });
                _this.editorGroupService.activateGroup(editorGroupTemplate.editorGroup);
            }
            else {
                var dropHandler = _this.instantiationService.createInstance(ResourcesDropHandler, { allowWorkspaceOpen: false });
                dropHandler.handleDrop(e, function () { return editorGroupTemplate.editorGroup; }, function () { return editorGroupTemplate.editorGroup.focus(); });
            }
        }));
        return editorGroupTemplate;
    };
    EditorGroupRenderer.prototype.renderElement = function (editorGroup, index, templateData) {
        templateData.editorGroup = editorGroup;
        templateData.name.textContent = editorGroup.label;
        templateData.actionBar.context = { groupId: editorGroup.id };
    };
    EditorGroupRenderer.prototype.disposeElement = function () {
        // noop
    };
    EditorGroupRenderer.prototype.disposeTemplate = function (templateData) {
        templateData.actionBar.dispose();
        dispose(templateData.toDispose);
    };
    EditorGroupRenderer.ID = 'editorgroup';
    return EditorGroupRenderer;
}());
var OpenEditorRenderer = /** @class */ (function () {
    function OpenEditorRenderer(getSelectedElements, instantiationService, keybindingService, configurationService, editorGroupService) {
        this.getSelectedElements = getSelectedElements;
        this.instantiationService = instantiationService;
        this.keybindingService = keybindingService;
        this.configurationService = configurationService;
        this.editorGroupService = editorGroupService;
        this.transfer = LocalSelectionTransfer.getInstance();
        // noop
    }
    Object.defineProperty(OpenEditorRenderer.prototype, "templateId", {
        get: function () {
            return OpenEditorRenderer.ID;
        },
        enumerable: true,
        configurable: true
    });
    OpenEditorRenderer.prototype.renderTemplate = function (container) {
        var _this = this;
        var editorTemplate = Object.create(null);
        editorTemplate.container = container;
        editorTemplate.actionRunner = new OpenEditorActionRunner();
        editorTemplate.actionBar = new ActionBar(container, { actionRunner: editorTemplate.actionRunner });
        container.draggable = true;
        var closeEditorAction = this.instantiationService.createInstance(CloseEditorAction, CloseEditorAction.ID, CloseEditorAction.LABEL);
        var key = this.keybindingService.lookupKeybinding(closeEditorAction.id);
        editorTemplate.actionBar.push(closeEditorAction, { icon: true, label: false, keybinding: key ? key.getLabel() : void 0 });
        editorTemplate.root = this.instantiationService.createInstance(EditorLabel, container, void 0);
        editorTemplate.toDispose = [];
        editorTemplate.toDispose.push(dom.addDisposableListener(container, dom.EventType.DRAG_START, function (e) {
            var dragged = _this.getSelectedElements().filter(function (e) { return e instanceof OpenEditor && !!e.getResource(); });
            var dragImage = document.createElement('div');
            e.dataTransfer.effectAllowed = 'copyMove';
            dragImage.className = 'monaco-tree-drag-image';
            dragImage.textContent = dragged.length === 1 ? editorTemplate.openEditor.editor.getName() : String(dragged.length);
            document.body.appendChild(dragImage);
            e.dataTransfer.setDragImage(dragImage, -10, -10);
            setTimeout(function () { return document.body.removeChild(dragImage); }, 0);
            _this.transfer.setData(dragged, OpenEditor.prototype);
            if (editorTemplate.openEditor && editorTemplate.openEditor.editor) {
                _this.instantiationService.invokeFunction(fillResourceDataTransfers, dragged.map(function (d) { return d.getResource(); }), e);
            }
        }));
        editorTemplate.toDispose.push(dom.addDisposableListener(container, dom.EventType.DRAG_OVER, function (e) {
            if (dropOnEditorSupported(e)) {
                dom.addClass(container, 'focused');
            }
        }));
        editorTemplate.toDispose.push(dom.addDisposableListener(container, dom.EventType.DRAG_LEAVE, function () {
            dom.removeClass(container, 'focused');
        }));
        editorTemplate.toDispose.push(dom.addDisposableListener(container, dom.EventType.DROP, function (e) {
            dom.removeClass(container, 'focused');
            var index = editorTemplate.openEditor.group.getIndexOfEditor(editorTemplate.openEditor.editor);
            if (_this.transfer.hasData(OpenEditor.prototype)) {
                _this.transfer.getData(OpenEditor.prototype).forEach(function (oe, offset) {
                    return oe.group.moveEditor(oe.editor, editorTemplate.openEditor.group, { index: index + offset, preserveFocus: true });
                });
                _this.editorGroupService.activateGroup(editorTemplate.openEditor.group);
            }
            else {
                var dropHandler = _this.instantiationService.createInstance(ResourcesDropHandler, { allowWorkspaceOpen: false });
                dropHandler.handleDrop(e, function () { return editorTemplate.openEditor.group; }, function () { return editorTemplate.openEditor.group.focus(); }, index);
            }
        }));
        editorTemplate.toDispose.push(dom.addDisposableListener(container, dom.EventType.DRAG_END, function () {
            _this.transfer.clearData(OpenEditor.prototype);
        }));
        return editorTemplate;
    };
    OpenEditorRenderer.prototype.renderElement = function (editor, index, templateData) {
        templateData.openEditor = editor;
        templateData.actionRunner.editor = editor;
        editor.isDirty() ? dom.addClass(templateData.container, 'dirty') : dom.removeClass(templateData.container, 'dirty');
        templateData.root.setEditor(editor.editor, {
            italic: editor.isPreview(),
            extraClasses: ['open-editor'],
            fileDecorations: this.configurationService.getValue().explorer.decorations
        });
    };
    OpenEditorRenderer.prototype.disposeElement = function () {
        // noop
    };
    OpenEditorRenderer.prototype.disposeTemplate = function (templateData) {
        templateData.actionBar.dispose();
        templateData.root.dispose();
        templateData.actionRunner.dispose();
        dispose(templateData.toDispose);
    };
    OpenEditorRenderer.ID = 'openeditor';
    return OpenEditorRenderer;
}());
