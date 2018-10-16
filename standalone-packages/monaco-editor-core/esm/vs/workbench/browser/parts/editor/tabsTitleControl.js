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
import './media/tabstitlecontrol.css';
import { isMacintosh } from '../../../../base/common/platform';
import { shorten } from '../../../../base/common/labels';
import { toResource, EditorCommandsContextActionRunner } from '../../../common/editor';
import { StandardKeyboardEvent } from '../../../../base/browser/keyboardEvent';
import { EventType as TouchEventType, Gesture } from '../../../../base/browser/touch';
import { ResourceLabel } from '../../labels';
import { ActionBar } from '../../../../base/browser/ui/actionbar/actionbar';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey';
import { IMenuService } from '../../../../platform/actions/common/actions';
import { TitleControl } from './titleControl';
import { IQuickOpenService } from '../../../../platform/quickOpen/common/quickOpen';
import { dispose, combinedDisposable } from '../../../../base/common/lifecycle';
import { ScrollableElement } from '../../../../base/browser/ui/scrollbar/scrollableElement';
import { ScrollbarVisibility } from '../../../../base/common/scrollable';
import { getOrSet } from '../../../../base/common/map';
import { IThemeService, registerThemingParticipant } from '../../../../platform/theme/common/themeService';
import { TAB_INACTIVE_BACKGROUND, TAB_ACTIVE_BACKGROUND, TAB_ACTIVE_FOREGROUND, TAB_INACTIVE_FOREGROUND, TAB_BORDER, EDITOR_DRAG_AND_DROP_BACKGROUND, TAB_UNFOCUSED_ACTIVE_FOREGROUND, TAB_UNFOCUSED_INACTIVE_FOREGROUND, TAB_UNFOCUSED_ACTIVE_BORDER, TAB_ACTIVE_BORDER, TAB_HOVER_BACKGROUND, TAB_HOVER_BORDER, TAB_UNFOCUSED_HOVER_BACKGROUND, TAB_UNFOCUSED_HOVER_BORDER, EDITOR_GROUP_HEADER_TABS_BACKGROUND, WORKBENCH_BACKGROUND, TAB_ACTIVE_BORDER_TOP, TAB_UNFOCUSED_ACTIVE_BORDER_TOP } from '../../../common/theme';
import { activeContrastBorder, contrastBorder, editorBackground, breadcrumbsBackground } from '../../../../platform/theme/common/colorRegistry';
import { ResourcesDropHandler, fillResourceDataTransfers, DraggedEditorIdentifier, DraggedEditorGroupIdentifier, DragAndDropObserver } from '../../dnd';
import { INotificationService } from '../../../../platform/notification/common/notification';
import { IExtensionService } from '../../../services/extensions/common/extensions';
import { IUntitledEditorService } from '../../../services/untitled/common/untitledEditorService';
import { addClass, addDisposableListener, hasClass, EventType, EventHelper, removeClass, scheduleAtNextAnimationFrame, findParentWithClass, clearNode } from '../../../../base/browser/dom';
import { localize } from '../../../../nls';
import { CloseOneEditorAction } from './editorActions';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration';
import { BreadcrumbsControl } from './breadcrumbsControl';
var TabsTitleControl = /** @class */ (function (_super) {
    __extends(TabsTitleControl, _super);
    function TabsTitleControl(parent, accessor, group, contextMenuService, instantiationService, untitledEditorService, contextKeyService, keybindingService, telemetryService, notificationService, menuService, quickOpenService, themeService, extensionService, configurationService) {
        var _this = _super.call(this, parent, accessor, group, contextMenuService, instantiationService, contextKeyService, keybindingService, telemetryService, notificationService, menuService, quickOpenService, themeService, extensionService, configurationService) || this;
        _this.untitledEditorService = untitledEditorService;
        _this.tabLabelWidgets = [];
        _this.tabLabels = [];
        _this.tabDisposeables = [];
        return _this;
    }
    TabsTitleControl.prototype.create = function (parent) {
        this.titleContainer = parent;
        // Tabs Container
        this.tabsContainer = document.createElement('div');
        this.tabsContainer.setAttribute('role', 'tablist');
        this.tabsContainer.draggable = true;
        addClass(this.tabsContainer, 'tabs-container');
        // Tabs Container listeners
        this.registerContainerListeners();
        // Scrollbar
        this.createScrollbar();
        // Editor Toolbar Container
        this.editorToolbarContainer = document.createElement('div');
        addClass(this.editorToolbarContainer, 'editor-actions');
        this.titleContainer.appendChild(this.editorToolbarContainer);
        // Editor Actions Toolbar
        this.createEditorActionsToolBar(this.editorToolbarContainer);
        // Close Action
        this.closeOneEditorAction = this._register(this.instantiationService.createInstance(CloseOneEditorAction, CloseOneEditorAction.ID, CloseOneEditorAction.LABEL));
        // Breadcrumbs
        var breadcrumbsContainer = document.createElement('div');
        addClass(breadcrumbsContainer, 'tabs-breadcrumbs');
        this.titleContainer.appendChild(breadcrumbsContainer);
        this.createBreadcrumbsControl(breadcrumbsContainer, { showFileIcons: true, showSymbolIcons: true, showDecorationColors: false, breadcrumbsBackground: breadcrumbsBackground });
    };
    TabsTitleControl.prototype.createScrollbar = function () {
        var _this = this;
        // Custom Scrollbar
        this.scrollbar = new ScrollableElement(this.tabsContainer, {
            horizontal: ScrollbarVisibility.Auto,
            vertical: ScrollbarVisibility.Hidden,
            scrollYToX: true,
            useShadows: false,
            horizontalScrollbarSize: 3
        });
        this.scrollbar.onScroll(function (e) {
            _this.tabsContainer.scrollLeft = e.scrollLeft;
        });
        this.titleContainer.appendChild(this.scrollbar.getDomNode());
    };
    TabsTitleControl.prototype.updateBreadcrumbsControl = function () {
        if (this.breadcrumbsControl && this.breadcrumbsControl.update()) {
            // relayout when we have a breadcrumbs and when update changed
            // its hidden-status
            this.group.relayout();
        }
    };
    TabsTitleControl.prototype.handleBreadcrumbsEnablementChange = function () {
        // relayout when breadcrumbs are enable/disabled
        this.group.relayout();
    };
    TabsTitleControl.prototype.registerContainerListeners = function () {
        var _this = this;
        // Group dragging
        this.enableGroupDragging(this.tabsContainer);
        // Forward scrolling inside the container to our custom scrollbar
        this._register(addDisposableListener(this.tabsContainer, EventType.SCROLL, function () {
            if (hasClass(_this.tabsContainer, 'scroll')) {
                _this.scrollbar.setScrollPosition({
                    scrollLeft: _this.tabsContainer.scrollLeft // during DND the  container gets scrolled so we need to update the custom scrollbar
                });
            }
        }));
        // New file when double clicking on tabs container (but not tabs)
        this._register(addDisposableListener(this.tabsContainer, EventType.DBLCLICK, function (e) {
            if (e.target === _this.tabsContainer) {
                EventHelper.stop(e);
                _this.group.openEditor(_this.untitledEditorService.createOrGet(), { pinned: true /* untitled is always pinned */, index: _this.group.count /* always at the end */ });
            }
        }));
        // Prevent auto-scrolling (https://github.com/Microsoft/vscode/issues/16690)
        this._register(addDisposableListener(this.tabsContainer, EventType.MOUSE_DOWN, function (e) {
            if (e.button === 1) {
                e.preventDefault();
            }
        }));
        // Drop support
        this._register(new DragAndDropObserver(this.tabsContainer, {
            onDragEnter: function (e) {
                // Always enable support to scroll while dragging
                addClass(_this.tabsContainer, 'scroll');
                // Return if the target is not on the tabs container
                if (e.target !== _this.tabsContainer) {
                    _this.updateDropFeedback(_this.tabsContainer, false); // fixes https://github.com/Microsoft/vscode/issues/52093
                    return;
                }
                // Return if transfer is unsupported
                if (!_this.isSupportedDropTransfer(e)) {
                    e.dataTransfer.dropEffect = 'none';
                    return;
                }
                // Return if dragged editor is last tab because then this is a no-op
                var isLocalDragAndDrop = false;
                if (_this.editorTransfer.hasData(DraggedEditorIdentifier.prototype)) {
                    isLocalDragAndDrop = true;
                    var localDraggedEditor = _this.editorTransfer.getData(DraggedEditorIdentifier.prototype)[0].identifier;
                    if (_this.group.id === localDraggedEditor.groupId && _this.group.getIndexOfEditor(localDraggedEditor.editor) === _this.group.count - 1) {
                        e.dataTransfer.dropEffect = 'none';
                        return;
                    }
                }
                // Update the dropEffect to "copy" if there is no local data to be dragged because
                // in that case we can only copy the data into and not move it from its source
                if (!isLocalDragAndDrop) {
                    e.dataTransfer.dropEffect = 'copy';
                }
                _this.updateDropFeedback(_this.tabsContainer, true);
            },
            onDragLeave: function (e) {
                _this.updateDropFeedback(_this.tabsContainer, false);
                removeClass(_this.tabsContainer, 'scroll');
            },
            onDragEnd: function (e) {
                _this.updateDropFeedback(_this.tabsContainer, false);
                removeClass(_this.tabsContainer, 'scroll');
            },
            onDrop: function (e) {
                _this.updateDropFeedback(_this.tabsContainer, false);
                removeClass(_this.tabsContainer, 'scroll');
                if (e.target === _this.tabsContainer) {
                    _this.onDrop(e, _this.group.count);
                }
            }
        }));
    };
    TabsTitleControl.prototype.updateEditorActionsToolbar = function () {
        _super.prototype.updateEditorActionsToolbar.call(this);
        // Changing the actions in the toolbar can have an impact on the size of the
        // tab container, so we need to layout the tabs to make sure the active is visible
        this.layout(this.dimension);
    };
    TabsTitleControl.prototype.openEditor = function (editor) {
        // Create tabs as needed
        for (var i = this.tabsContainer.children.length; i < this.group.count; i++) {
            this.tabsContainer.appendChild(this.createTab(i));
        }
        // An add of a tab requires to recompute all labels
        this.computeTabLabels();
        // Redraw all tabs
        this.redraw();
        // Update Breadcrumbs
        this.updateBreadcrumbsControl();
    };
    TabsTitleControl.prototype.closeEditor = function (editor) {
        this.handleClosedEditors();
    };
    TabsTitleControl.prototype.closeEditors = function (editors) {
        this.handleClosedEditors();
    };
    TabsTitleControl.prototype.closeAllEditors = function () {
        this.handleClosedEditors();
    };
    TabsTitleControl.prototype.handleClosedEditors = function () {
        // There are tabs to show
        if (this.group.activeEditor) {
            // Remove tabs that got closed
            while (this.tabsContainer.children.length > this.group.count) {
                // Remove one tab from container (must be the last to keep indexes in order!)
                this.tabsContainer.lastChild.remove();
                // Remove associated tab label and widget
                this.tabLabelWidgets.pop();
                this.tabDisposeables.pop().dispose();
            }
            // A removal of a label requires to recompute all labels
            this.computeTabLabels();
            // Redraw all tabs
            this.redraw();
        }
        // No tabs to show
        else {
            clearNode(this.tabsContainer);
            this.tabDisposeables = dispose(this.tabDisposeables);
            this.tabLabelWidgets = [];
            this.tabLabels = [];
            this.clearEditorActionsToolbar();
        }
        // Update Breadcrumbs
        this.updateBreadcrumbsControl();
    };
    TabsTitleControl.prototype.moveEditor = function (editor, fromIndex, targetIndex) {
        var _this = this;
        // Swap the editor label
        var editorLabel = this.tabLabels[fromIndex];
        this.tabLabels.splice(fromIndex, 1);
        this.tabLabels.splice(targetIndex, 0, editorLabel);
        // As such we need to redraw each tab
        this.forEachTab(function (editor, index, tabContainer, tabLabelWidget, tabLabel) {
            _this.redrawTab(editor, index, tabContainer, tabLabelWidget, tabLabel);
        });
        // Moving an editor requires a layout to keep the active editor visible
        this.layout(this.dimension);
    };
    TabsTitleControl.prototype.pinEditor = function (editor) {
        var _this = this;
        this.withTab(editor, function (tabContainer, tabLabelWidget, tabLabel) { return _this.redrawLabel(editor, tabContainer, tabLabelWidget, tabLabel); });
    };
    TabsTitleControl.prototype.setActive = function (isGroupActive) {
        var _this = this;
        // Activity has an impact on each tab
        this.forEachTab(function (editor, index, tabContainer, tabLabelWidget, tabLabel) {
            _this.redrawEditorActive(isGroupActive, editor, tabContainer, tabLabelWidget);
        });
        // Activity has an impact on the toolbar, so we need to update and layout
        this.updateEditorActionsToolbar();
        this.layout(this.dimension);
    };
    TabsTitleControl.prototype.updateEditorLabel = function (editor) {
        var _this = this;
        // A change to a label requires to recompute all labels
        this.computeTabLabels();
        // As such we need to redraw each label
        this.forEachTab(function (editor, index, tabContainer, tabLabelWidget, tabLabel) {
            _this.redrawLabel(editor, tabContainer, tabLabelWidget, tabLabel);
        });
        // A change to a label requires a layout to keep the active editor visible
        this.layout(this.dimension);
    };
    TabsTitleControl.prototype.updateEditorDirty = function (editor) {
        var _this = this;
        this.withTab(editor, function (tabContainer) { return _this.redrawEditorDirty(editor, tabContainer); });
    };
    TabsTitleControl.prototype.updateOptions = function (oldOptions, newOptions) {
        // A change to a label format options requires to recompute all labels
        if (oldOptions.labelFormat !== newOptions.labelFormat) {
            this.computeTabLabels();
        }
        // Apply new options if something of interest changed
        if (oldOptions.labelFormat !== newOptions.labelFormat ||
            oldOptions.tabCloseButton !== newOptions.tabCloseButton ||
            oldOptions.tabSizing !== newOptions.tabSizing ||
            oldOptions.showIcons !== newOptions.showIcons ||
            oldOptions.iconTheme !== newOptions.iconTheme) {
            this.redraw();
        }
    };
    TabsTitleControl.prototype.updateStyles = function () {
        this.redraw();
    };
    TabsTitleControl.prototype.withTab = function (editor, fn) {
        var editorIndex = this.group.getIndexOfEditor(editor);
        var tabContainer = this.tabsContainer.children[editorIndex];
        if (tabContainer) {
            fn(tabContainer, this.tabLabelWidgets[editorIndex], this.tabLabels[editorIndex]);
        }
    };
    TabsTitleControl.prototype.createTab = function (index) {
        var _this = this;
        // Tab Container
        var tabContainer = document.createElement('div');
        tabContainer.draggable = true;
        tabContainer.tabIndex = 0;
        tabContainer.setAttribute('role', 'presentation'); // cannot use role "tab" here due to https://github.com/Microsoft/vscode/issues/8659
        addClass(tabContainer, 'tab');
        // Gesture Support
        Gesture.addTarget(tabContainer);
        // Tab Border Top
        var tabBorderTopContainer = document.createElement('div');
        addClass(tabBorderTopContainer, 'tab-border-top-container');
        tabContainer.appendChild(tabBorderTopContainer);
        // Tab Editor Label
        var editorLabel = this.instantiationService.createInstance(ResourceLabel, tabContainer, void 0);
        this.tabLabelWidgets.push(editorLabel);
        // Tab Close Button
        var tabCloseContainer = document.createElement('div');
        addClass(tabCloseContainer, 'tab-close');
        tabContainer.appendChild(tabCloseContainer);
        // Tab Border Bottom
        var tabBorderBottomContainer = document.createElement('div');
        addClass(tabBorderBottomContainer, 'tab-border-bottom-container');
        tabContainer.appendChild(tabBorderBottomContainer);
        var tabActionRunner = new EditorCommandsContextActionRunner({ groupId: this.group.id, editorIndex: index });
        var tabActionBar = new ActionBar(tabCloseContainer, { ariaLabel: localize('araLabelTabActions', "Tab actions"), actionRunner: tabActionRunner });
        tabActionBar.push(this.closeOneEditorAction, { icon: true, label: false, keybinding: this.getKeybindingLabel(this.closeOneEditorAction) });
        tabActionBar.onDidBeforeRun(function () { return _this.blockRevealActiveTabOnce(); });
        // Eventing
        var eventsDisposable = this.registerTabListeners(tabContainer, index);
        this.tabDisposeables.push(combinedDisposable([eventsDisposable, tabActionBar, tabActionRunner, editorLabel]));
        return tabContainer;
    };
    TabsTitleControl.prototype.registerTabListeners = function (tab, index) {
        var _this = this;
        var disposables = [];
        var handleClickOrTouch = function (e) {
            tab.blur();
            if (e instanceof MouseEvent && e.button !== 0) {
                if (e.button === 1) {
                    e.preventDefault(); // required to prevent auto-scrolling (https://github.com/Microsoft/vscode/issues/16690)
                }
                return void 0; // only for left mouse click
            }
            if (_this.originatesFromTabActionBar(e)) {
                return; // not when clicking on actions
            }
            // Open tabs editor
            _this.group.openEditor(_this.group.getEditor(index));
            return void 0;
        };
        var showContextMenu = function (e) {
            EventHelper.stop(e);
            _this.onContextMenu(_this.group.getEditor(index), e, tab);
        };
        // Open on Click / Touch
        disposables.push(addDisposableListener(tab, EventType.MOUSE_DOWN, function (e) { return handleClickOrTouch(e); }));
        disposables.push(addDisposableListener(tab, TouchEventType.Tap, function (e) { return handleClickOrTouch(e); }));
        // Touch Scroll Support
        disposables.push(addDisposableListener(tab, TouchEventType.Change, function (e) {
            _this.scrollbar.setScrollPosition({ scrollLeft: _this.scrollbar.getScrollPosition().scrollLeft - e.translationX });
        }));
        // Close on mouse middle click
        disposables.push(addDisposableListener(tab, EventType.MOUSE_UP, function (e) {
            EventHelper.stop(e);
            tab.blur();
            if (e.button === 1 /* Middle Button*/ && !_this.originatesFromTabActionBar(e)) {
                e.stopPropagation(); // for https://github.com/Microsoft/vscode/issues/56715
                _this.blockRevealActiveTabOnce();
                _this.closeOneEditorAction.run({ groupId: _this.group.id, editorIndex: index });
            }
        }));
        // Context menu on Shift+F10
        disposables.push(addDisposableListener(tab, EventType.KEY_DOWN, function (e) {
            var event = new StandardKeyboardEvent(e);
            if (event.shiftKey && event.keyCode === 68 /* F10 */) {
                showContextMenu(e);
            }
        }));
        // Context menu on touch context menu gesture
        disposables.push(addDisposableListener(tab, TouchEventType.Contextmenu, function (e) {
            showContextMenu(e);
        }));
        // Keyboard accessibility
        disposables.push(addDisposableListener(tab, EventType.KEY_UP, function (e) {
            var event = new StandardKeyboardEvent(e);
            var handled = false;
            // Run action on Enter/Space
            if (event.equals(3 /* Enter */) || event.equals(10 /* Space */)) {
                handled = true;
                _this.group.openEditor(_this.group.getEditor(index));
            }
            // Navigate in editors
            else if ([15 /* LeftArrow */, 17 /* RightArrow */, 16 /* UpArrow */, 18 /* DownArrow */, 14 /* Home */, 13 /* End */].some(function (kb) { return event.equals(kb); })) {
                var targetIndex = void 0;
                if (event.equals(15 /* LeftArrow */) || event.equals(16 /* UpArrow */)) {
                    targetIndex = index - 1;
                }
                else if (event.equals(17 /* RightArrow */) || event.equals(18 /* DownArrow */)) {
                    targetIndex = index + 1;
                }
                else if (event.equals(14 /* Home */)) {
                    targetIndex = 0;
                }
                else {
                    targetIndex = _this.group.count - 1;
                }
                var target = _this.group.getEditor(targetIndex);
                if (target) {
                    handled = true;
                    _this.group.openEditor(target, { preserveFocus: true });
                    _this.tabsContainer.childNodes[targetIndex].focus();
                }
            }
            if (handled) {
                EventHelper.stop(e, true);
            }
            // moving in the tabs container can have an impact on scrolling position, so we need to update the custom scrollbar
            _this.scrollbar.setScrollPosition({
                scrollLeft: _this.tabsContainer.scrollLeft
            });
        }));
        // Pin on double click
        disposables.push(addDisposableListener(tab, EventType.DBLCLICK, function (e) {
            EventHelper.stop(e);
            _this.group.pinEditor(_this.group.getEditor(index));
        }));
        // Context menu
        disposables.push(addDisposableListener(tab, EventType.CONTEXT_MENU, function (e) {
            EventHelper.stop(e, true);
            _this.onContextMenu(_this.group.getEditor(index), e, tab);
        }, true /* use capture to fix https://github.com/Microsoft/vscode/issues/19145 */));
        // Drag support
        disposables.push(addDisposableListener(tab, EventType.DRAG_START, function (e) {
            var editor = _this.group.getEditor(index);
            _this.editorTransfer.setData([new DraggedEditorIdentifier({ editor: editor, groupId: _this.group.id })], DraggedEditorIdentifier.prototype);
            e.dataTransfer.effectAllowed = 'copyMove';
            // Apply some datatransfer types to allow for dragging the element outside of the application
            var resource = toResource(editor, { supportSideBySide: true });
            if (resource) {
                _this.instantiationService.invokeFunction(fillResourceDataTransfers, [resource], e);
            }
            // Fixes https://github.com/Microsoft/vscode/issues/18733
            addClass(tab, 'dragged');
            scheduleAtNextAnimationFrame(function () { return removeClass(tab, 'dragged'); });
        }));
        // Drop support
        disposables.push(new DragAndDropObserver(tab, {
            onDragEnter: function (e) {
                // Update class to signal drag operation
                addClass(tab, 'dragged-over');
                // Return if transfer is unsupported
                if (!_this.isSupportedDropTransfer(e)) {
                    e.dataTransfer.dropEffect = 'none';
                    return;
                }
                // Return if dragged editor is the current tab dragged over
                var isLocalDragAndDrop = false;
                if (_this.editorTransfer.hasData(DraggedEditorIdentifier.prototype)) {
                    isLocalDragAndDrop = true;
                    var localDraggedEditor = _this.editorTransfer.getData(DraggedEditorIdentifier.prototype)[0].identifier;
                    if (localDraggedEditor.editor === _this.group.getEditor(index) && localDraggedEditor.groupId === _this.group.id) {
                        e.dataTransfer.dropEffect = 'none';
                        return;
                    }
                }
                // Update the dropEffect to "copy" if there is no local data to be dragged because
                // in that case we can only copy the data into and not move it from its source
                if (!isLocalDragAndDrop) {
                    e.dataTransfer.dropEffect = 'copy';
                }
                _this.updateDropFeedback(tab, true, index);
            },
            onDragLeave: function (e) {
                removeClass(tab, 'dragged-over');
                _this.updateDropFeedback(tab, false, index);
            },
            onDragEnd: function (e) {
                removeClass(tab, 'dragged-over');
                _this.updateDropFeedback(tab, false, index);
                _this.editorTransfer.clearData(DraggedEditorIdentifier.prototype);
            },
            onDrop: function (e) {
                removeClass(tab, 'dragged-over');
                _this.updateDropFeedback(tab, false, index);
                _this.onDrop(e, index);
            }
        }));
        return combinedDisposable(disposables);
    };
    TabsTitleControl.prototype.isSupportedDropTransfer = function (e) {
        if (this.groupTransfer.hasData(DraggedEditorGroupIdentifier.prototype)) {
            var group = this.groupTransfer.getData(DraggedEditorGroupIdentifier.prototype)[0];
            if (group.identifier === this.group.id) {
                return false; // groups cannot be dropped on title area it originates from
            }
            return true;
        }
        if (this.editorTransfer.hasData(DraggedEditorIdentifier.prototype)) {
            return true; // (local) editors can always be dropped
        }
        if (e.dataTransfer.types.length > 0) {
            return true; // optimistically allow external data (// see https://github.com/Microsoft/vscode/issues/25789)
        }
        return false;
    };
    TabsTitleControl.prototype.updateDropFeedback = function (element, isDND, index) {
        var isTab = (typeof index === 'number');
        var isActiveTab = isTab && this.group.isActive(this.group.getEditor(index));
        // Background
        var noDNDBackgroundColor = isTab ? this.getColor(isActiveTab ? TAB_ACTIVE_BACKGROUND : TAB_INACTIVE_BACKGROUND) : null;
        element.style.backgroundColor = isDND ? this.getColor(EDITOR_DRAG_AND_DROP_BACKGROUND) : noDNDBackgroundColor;
        // Outline
        var activeContrastBorderColor = this.getColor(activeContrastBorder);
        if (activeContrastBorderColor && isDND) {
            element.style.outlineWidth = '2px';
            element.style.outlineStyle = 'dashed';
            element.style.outlineColor = activeContrastBorderColor;
            element.style.outlineOffset = isTab ? '-5px' : '-3px';
        }
        else {
            element.style.outlineWidth = null;
            element.style.outlineStyle = null;
            element.style.outlineColor = activeContrastBorderColor;
            element.style.outlineOffset = null;
        }
    };
    TabsTitleControl.prototype.computeTabLabels = function () {
        var labelFormat = this.accessor.partOptions.labelFormat;
        var _a = this.getLabelConfigFlags(labelFormat), verbosity = _a.verbosity, shortenDuplicates = _a.shortenDuplicates;
        // Build labels and descriptions for each editor
        var labels = this.group.editors.map(function (editor) { return ({
            editor: editor,
            name: editor.getName(),
            description: editor.getDescription(verbosity),
            title: editor.getTitle(2 /* LONG */)
        }); });
        // Shorten labels as needed
        if (shortenDuplicates) {
            this.shortenTabLabels(labels);
        }
        this.tabLabels = labels;
    };
    TabsTitleControl.prototype.shortenTabLabels = function (labels) {
        // Gather duplicate titles, while filtering out invalid descriptions
        var mapTitleToDuplicates = new Map();
        for (var _i = 0, labels_1 = labels; _i < labels_1.length; _i++) {
            var label = labels_1[_i];
            if (typeof label.description === 'string') {
                getOrSet(mapTitleToDuplicates, label.name, []).push(label);
            }
            else {
                label.description = '';
            }
        }
        // Identify duplicate titles and shorten descriptions
        mapTitleToDuplicates.forEach(function (duplicateTitles) {
            // Remove description if the title isn't duplicated
            if (duplicateTitles.length === 1) {
                duplicateTitles[0].description = '';
                return;
            }
            // Identify duplicate descriptions
            var mapDescriptionToDuplicates = new Map();
            for (var _i = 0, duplicateTitles_1 = duplicateTitles; _i < duplicateTitles_1.length; _i++) {
                var label = duplicateTitles_1[_i];
                getOrSet(mapDescriptionToDuplicates, label.description, []).push(label);
            }
            // For editors with duplicate descriptions, check whether any long descriptions differ
            var useLongDescriptions = false;
            mapDescriptionToDuplicates.forEach(function (duplicateDescriptions, name) {
                if (!useLongDescriptions && duplicateDescriptions.length > 1) {
                    var _a = duplicateDescriptions.map(function (_a) {
                        var editor = _a.editor;
                        return editor.getDescription(2 /* LONG */);
                    }), first_1 = _a[0], rest = _a.slice(1);
                    useLongDescriptions = rest.some(function (description) { return description !== first_1; });
                }
            });
            // If so, replace all descriptions with long descriptions
            if (useLongDescriptions) {
                mapDescriptionToDuplicates.clear();
                duplicateTitles.forEach(function (label) {
                    label.description = label.editor.getDescription(2 /* LONG */);
                    getOrSet(mapDescriptionToDuplicates, label.description, []).push(label);
                });
            }
            // Obtain final set of descriptions
            var descriptions = [];
            mapDescriptionToDuplicates.forEach(function (_, description) { return descriptions.push(description); });
            // Remove description if all descriptions are identical
            if (descriptions.length === 1) {
                for (var _a = 0, _b = mapDescriptionToDuplicates.get(descriptions[0]); _a < _b.length; _a++) {
                    var label = _b[_a];
                    label.description = '';
                }
                return;
            }
            // Shorten descriptions
            var shortenedDescriptions = shorten(descriptions);
            descriptions.forEach(function (description, i) {
                for (var _i = 0, _a = mapDescriptionToDuplicates.get(description); _i < _a.length; _i++) {
                    var label = _a[_i];
                    label.description = shortenedDescriptions[i];
                }
            });
        });
    };
    TabsTitleControl.prototype.getLabelConfigFlags = function (value) {
        switch (value) {
            case 'short':
                return { verbosity: 0 /* SHORT */, shortenDuplicates: false };
            case 'medium':
                return { verbosity: 1 /* MEDIUM */, shortenDuplicates: false };
            case 'long':
                return { verbosity: 2 /* LONG */, shortenDuplicates: false };
            default:
                return { verbosity: 1 /* MEDIUM */, shortenDuplicates: true };
        }
    };
    TabsTitleControl.prototype.redraw = function () {
        var _this = this;
        // For each tab
        this.forEachTab(function (editor, index, tabContainer, tabLabelWidget, tabLabel) {
            _this.redrawTab(editor, index, tabContainer, tabLabelWidget, tabLabel);
        });
        // Update Editor Actions Toolbar
        this.updateEditorActionsToolbar();
        // Ensure the active tab is always revealed
        this.layout(this.dimension);
    };
    TabsTitleControl.prototype.forEachTab = function (fn) {
        var _this = this;
        this.group.editors.forEach(function (editor, index) {
            var tabContainer = _this.tabsContainer.children[index];
            if (tabContainer) {
                fn(editor, index, tabContainer, _this.tabLabelWidgets[index], _this.tabLabels[index]);
            }
        });
    };
    TabsTitleControl.prototype.redrawTab = function (editor, index, tabContainer, tabLabelWidget, tabLabel) {
        // Label
        this.redrawLabel(editor, tabContainer, tabLabelWidget, tabLabel);
        // Borders / Outline
        var borderRightColor = (this.getColor(TAB_BORDER) || this.getColor(contrastBorder));
        tabContainer.style.borderRight = borderRightColor ? "1px solid " + borderRightColor : null;
        tabContainer.style.outlineColor = this.getColor(activeContrastBorder);
        // Settings
        var options = this.accessor.partOptions;
        ['off', 'left', 'right'].forEach(function (option) {
            var domAction = options.tabCloseButton === option ? addClass : removeClass;
            domAction(tabContainer, "close-button-" + option);
        });
        ['fit', 'shrink'].forEach(function (option) {
            var domAction = options.tabSizing === option ? addClass : removeClass;
            domAction(tabContainer, "sizing-" + option);
        });
        if (options.showIcons && !!options.iconTheme) {
            addClass(tabContainer, 'has-icon-theme');
        }
        else {
            removeClass(tabContainer, 'has-icon-theme');
        }
        // Active state
        this.redrawEditorActive(this.accessor.activeGroup === this.group, editor, tabContainer, tabLabelWidget);
        // Dirty State
        this.redrawEditorDirty(editor, tabContainer);
    };
    TabsTitleControl.prototype.redrawLabel = function (editor, tabContainer, tabLabelWidget, tabLabel) {
        var name = tabLabel.name;
        var description = tabLabel.description || '';
        var title = tabLabel.title || '';
        // Container
        tabContainer.setAttribute('aria-label', name + ", tab");
        tabContainer.title = title;
        // Label
        tabLabelWidget.setLabel({ name: name, description: description, resource: toResource(editor, { supportSideBySide: true }) }, { title: title, extraClasses: ['tab-label'], italic: !this.group.isPinned(editor) });
    };
    TabsTitleControl.prototype.redrawEditorActive = function (isGroupActive, editor, tabContainer, tabLabelWidget) {
        // Tab is active
        if (this.group.isActive(editor)) {
            // Container
            addClass(tabContainer, 'active');
            tabContainer.setAttribute('aria-selected', 'true');
            tabContainer.style.backgroundColor = this.getColor(TAB_ACTIVE_BACKGROUND);
            var activeTabBorderColorBottom = this.getColor(isGroupActive ? TAB_ACTIVE_BORDER : TAB_UNFOCUSED_ACTIVE_BORDER);
            if (activeTabBorderColorBottom) {
                addClass(tabContainer, 'tab-border-bottom');
                tabContainer.style.setProperty('--tab-border-bottom-color', activeTabBorderColorBottom.toString());
            }
            else {
                removeClass(tabContainer, 'tab-border-bottom');
                tabContainer.style.removeProperty('--tab-border-bottom-color');
            }
            var activeTabBorderColorTop = this.getColor(isGroupActive ? TAB_ACTIVE_BORDER_TOP : TAB_UNFOCUSED_ACTIVE_BORDER_TOP);
            if (activeTabBorderColorTop) {
                addClass(tabContainer, 'tab-border-top');
                tabContainer.style.setProperty('--tab-border-top-color', activeTabBorderColorTop.toString());
            }
            else {
                removeClass(tabContainer, 'tab-border-top');
                tabContainer.style.removeProperty('--tab-border-top-color');
            }
            // Label
            tabLabelWidget.element.style.color = this.getColor(isGroupActive ? TAB_ACTIVE_FOREGROUND : TAB_UNFOCUSED_ACTIVE_FOREGROUND);
        }
        // Tab is inactive
        else {
            // Containr
            removeClass(tabContainer, 'active');
            tabContainer.setAttribute('aria-selected', 'false');
            tabContainer.style.backgroundColor = this.getColor(TAB_INACTIVE_BACKGROUND);
            tabContainer.style.boxShadow = null;
            // Label
            tabLabelWidget.element.style.color = this.getColor(isGroupActive ? TAB_INACTIVE_FOREGROUND : TAB_UNFOCUSED_INACTIVE_FOREGROUND);
        }
    };
    TabsTitleControl.prototype.redrawEditorDirty = function (editor, tabContainer) {
        if (editor.isDirty()) {
            addClass(tabContainer, 'dirty');
        }
        else {
            removeClass(tabContainer, 'dirty');
        }
    };
    TabsTitleControl.prototype.layout = function (dimension) {
        var _this = this;
        var activeTab = this.getTab(this.group.activeEditor);
        if (!activeTab || !dimension) {
            return;
        }
        this.dimension = dimension;
        // The layout of tabs can be an expensive operation because we access DOM properties
        // that can result in the browser doing a full page layout to validate them. To buffer
        // this a little bit we try at least to schedule this work on the next animation frame.
        if (!this.layoutScheduled) {
            this.layoutScheduled = scheduleAtNextAnimationFrame(function () {
                _this.doLayout(_this.dimension);
                _this.layoutScheduled = void 0;
            });
        }
    };
    TabsTitleControl.prototype.doLayout = function (dimension) {
        var activeTab = this.getTab(this.group.activeEditor);
        if (!activeTab) {
            return;
        }
        if (this.breadcrumbsControl && !this.breadcrumbsControl.isHidden()) {
            this.breadcrumbsControl.layout({ width: dimension.width, height: BreadcrumbsControl.HEIGHT });
            this.scrollbar.getDomNode().style.height = dimension.height - BreadcrumbsControl.HEIGHT + "px";
        }
        var visibleContainerWidth = this.tabsContainer.offsetWidth;
        var totalContainerWidth = this.tabsContainer.scrollWidth;
        var activeTabPosX;
        var activeTabWidth;
        if (!this.blockRevealActiveTab) {
            activeTabPosX = activeTab.offsetLeft;
            activeTabWidth = activeTab.offsetWidth;
        }
        // Update scrollbar
        this.scrollbar.setScrollDimensions({
            width: visibleContainerWidth,
            scrollWidth: totalContainerWidth
        });
        // Return now if we are blocked to reveal the active tab and clear flag
        if (this.blockRevealActiveTab) {
            this.blockRevealActiveTab = false;
            return;
        }
        // Reveal the active one
        var containerScrollPosX = this.scrollbar.getScrollPosition().scrollLeft;
        var activeTabFits = activeTabWidth <= visibleContainerWidth;
        // Tab is overflowing to the right: Scroll minimally until the element is fully visible to the right
        // Note: only try to do this if we actually have enough width to give to show the tab fully!
        if (activeTabFits && containerScrollPosX + visibleContainerWidth < activeTabPosX + activeTabWidth) {
            this.scrollbar.setScrollPosition({
                scrollLeft: containerScrollPosX + ((activeTabPosX + activeTabWidth) /* right corner of tab */ - (containerScrollPosX + visibleContainerWidth) /* right corner of view port */)
            });
        }
        // Tab is overlflowng to the left or does not fit: Scroll it into view to the left
        else if (containerScrollPosX > activeTabPosX || !activeTabFits) {
            this.scrollbar.setScrollPosition({
                scrollLeft: activeTabPosX
            });
        }
    };
    TabsTitleControl.prototype.getTab = function (editor) {
        var editorIndex = this.group.getIndexOfEditor(editor);
        if (editorIndex >= 0) {
            return this.tabsContainer.children[editorIndex];
        }
        return void 0;
    };
    TabsTitleControl.prototype.blockRevealActiveTabOnce = function () {
        // When closing tabs through the tab close button or gesture, the user
        // might want to rapidly close tabs in sequence and as such revealing
        // the active tab after each close would be annoying. As such we block
        // the automated revealing of the active tab once after the close is
        // triggered.
        this.blockRevealActiveTab = true;
    };
    TabsTitleControl.prototype.originatesFromTabActionBar = function (e) {
        var element;
        if (e instanceof MouseEvent) {
            element = (e.target || e.srcElement);
        }
        else {
            element = e.initialTarget;
        }
        return !!findParentWithClass(element, 'monaco-action-bar', 'tab');
    };
    TabsTitleControl.prototype.onDrop = function (e, targetIndex) {
        var _this = this;
        EventHelper.stop(e, true);
        this.updateDropFeedback(this.tabsContainer, false);
        removeClass(this.tabsContainer, 'scroll');
        // Local Editor DND
        if (this.editorTransfer.hasData(DraggedEditorIdentifier.prototype)) {
            var draggedEditor = this.editorTransfer.getData(DraggedEditorIdentifier.prototype)[0].identifier;
            var sourceGroup = this.accessor.getGroup(draggedEditor.groupId);
            // Move editor to target position and index
            if (this.isMoveOperation(e, draggedEditor.groupId)) {
                sourceGroup.moveEditor(draggedEditor.editor, this.group, { index: targetIndex });
            }
            // Copy editor to target position and index
            else {
                sourceGroup.copyEditor(draggedEditor.editor, this.group, { index: targetIndex });
            }
            this.group.focus();
            this.editorTransfer.clearData(DraggedEditorIdentifier.prototype);
        }
        // Local Editor Group DND
        else if (this.groupTransfer.hasData(DraggedEditorGroupIdentifier.prototype)) {
            var sourceGroup = this.accessor.getGroup(this.groupTransfer.getData(DraggedEditorGroupIdentifier.prototype)[0].identifier);
            var mergeGroupOptions = { index: targetIndex };
            if (!this.isMoveOperation(e, sourceGroup.id)) {
                mergeGroupOptions.mode = 0 /* COPY_EDITORS */;
            }
            this.accessor.mergeGroup(sourceGroup, this.group, mergeGroupOptions);
            this.group.focus();
            this.groupTransfer.clearData(DraggedEditorGroupIdentifier.prototype);
        }
        // External DND
        else {
            var dropHandler = this.instantiationService.createInstance(ResourcesDropHandler, { allowWorkspaceOpen: false /* open workspace file as file if dropped */ });
            dropHandler.handleDrop(e, function () { return _this.group; }, function () { return _this.group.focus(); }, targetIndex);
        }
    };
    TabsTitleControl.prototype.isMoveOperation = function (e, source) {
        var isCopy = (e.ctrlKey && !isMacintosh) || (e.altKey && isMacintosh);
        return !isCopy || source === this.group.id;
    };
    TabsTitleControl.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this.layoutScheduled = dispose(this.layoutScheduled);
    };
    TabsTitleControl = __decorate([
        __param(3, IContextMenuService),
        __param(4, IInstantiationService),
        __param(5, IUntitledEditorService),
        __param(6, IContextKeyService),
        __param(7, IKeybindingService),
        __param(8, ITelemetryService),
        __param(9, INotificationService),
        __param(10, IMenuService),
        __param(11, IQuickOpenService),
        __param(12, IThemeService),
        __param(13, IExtensionService),
        __param(14, IConfigurationService)
    ], TabsTitleControl);
    return TabsTitleControl;
}(TitleControl));
export { TabsTitleControl };
registerThemingParticipant(function (theme, collector) {
    // Styling with Outline color (e.g. high contrast theme)
    var activeContrastBorderColor = theme.getColor(activeContrastBorder);
    if (activeContrastBorderColor) {
        collector.addRule("\n\t\t\t.monaco-workbench > .part.editor > .content .editor-group-container > .title .tabs-container > .tab.active,\n\t\t\t.monaco-workbench > .part.editor > .content .editor-group-container > .title .tabs-container > .tab.active:hover  {\n\t\t\t\toutline: 1px solid;\n\t\t\t\toutline-offset: -5px;\n\t\t\t}\n\n\t\t\t.monaco-workbench > .part.editor > .content .editor-group-container > .title .tabs-container > .tab:hover  {\n\t\t\t\toutline: 1px dashed;\n\t\t\t\toutline-offset: -5px;\n\t\t\t}\n\n\t\t\t.monaco-workbench > .part.editor > .content .editor-group-container > .title .tabs-container > .tab.active > .tab-close .action-label,\n\t\t\t.monaco-workbench > .part.editor > .content .editor-group-container > .title .tabs-container > .tab.active:hover > .tab-close .action-label,\n\t\t\t.monaco-workbench > .part.editor > .content .editor-group-container > .title .tabs-container > .tab.dirty > .tab-close .action-label,\n\t\t\t.monaco-workbench > .part.editor > .content .editor-group-container > .title .tabs-container > .tab:hover > .tab-close .action-label {\n\t\t\t\topacity: 1 !important;\n\t\t\t}\n\t\t");
    }
    // Hover Background
    var tabHoverBackground = theme.getColor(TAB_HOVER_BACKGROUND);
    if (tabHoverBackground) {
        collector.addRule("\n\t\t\t.monaco-workbench > .part.editor > .content .editor-group-container.active > .title .tabs-container > .tab:hover  {\n\t\t\t\tbackground-color: " + tabHoverBackground + " !important;\n\t\t\t}\n\t\t");
    }
    var tabUnfocusedHoverBackground = theme.getColor(TAB_UNFOCUSED_HOVER_BACKGROUND);
    if (tabUnfocusedHoverBackground) {
        collector.addRule("\n\t\t\t.monaco-workbench > .part.editor > .content .editor-group-container > .title .tabs-container > .tab:hover  {\n\t\t\t\tbackground-color: " + tabUnfocusedHoverBackground + " !important;\n\t\t\t}\n\t\t");
    }
    // Hover Border
    var tabHoverBorder = theme.getColor(TAB_HOVER_BORDER);
    if (tabHoverBorder) {
        collector.addRule("\n\t\t\t.monaco-workbench > .part.editor > .content .editor-group-container.active > .title .tabs-container > .tab:hover  {\n\t\t\t\tbox-shadow: " + tabHoverBorder + " 0 -1px inset !important;\n\t\t\t}\n\t\t");
    }
    var tabUnfocusedHoverBorder = theme.getColor(TAB_UNFOCUSED_HOVER_BORDER);
    if (tabUnfocusedHoverBorder) {
        collector.addRule("\n\t\t\t.monaco-workbench > .part.editor > .content .editor-group-container > .title .tabs-container > .tab:hover  {\n\t\t\t\tbox-shadow: " + tabUnfocusedHoverBorder + " 0 -1px inset !important;\n\t\t\t}\n\t\t");
    }
    // Fade out styles via linear gradient (when tabs are set to shrink)
    if (theme.type !== 'hc') {
        var workbenchBackground = WORKBENCH_BACKGROUND(theme);
        var editorBackgroundColor = theme.getColor(editorBackground);
        var editorGroupHeaderTabsBackground = theme.getColor(EDITOR_GROUP_HEADER_TABS_BACKGROUND);
        var editorDragAndDropBackground = theme.getColor(EDITOR_DRAG_AND_DROP_BACKGROUND);
        var adjustedTabBackground = void 0;
        if (editorGroupHeaderTabsBackground && editorBackgroundColor) {
            adjustedTabBackground = editorGroupHeaderTabsBackground.flatten(editorBackgroundColor, editorBackgroundColor, workbenchBackground);
        }
        var adjustedTabDragBackground = void 0;
        if (editorGroupHeaderTabsBackground && editorBackgroundColor && editorDragAndDropBackground && editorBackgroundColor) {
            adjustedTabDragBackground = editorGroupHeaderTabsBackground.flatten(editorBackgroundColor, editorDragAndDropBackground, editorBackgroundColor, workbenchBackground);
        }
        // Adjust gradient for (focused) hover background
        if (tabHoverBackground && adjustedTabBackground && adjustedTabDragBackground) {
            var adjustedColor = tabHoverBackground.flatten(adjustedTabBackground);
            var adjustedColorDrag = tabHoverBackground.flatten(adjustedTabDragBackground);
            collector.addRule("\n\t\t\t\t.monaco-workbench > .part.editor > .content:not(.dragged-over) .editor-group-container.active > .title .tabs-container > .tab.sizing-shrink:not(.dragged):hover > .tab-label::after {\n\t\t\t\t\tbackground: linear-gradient(to left, " + adjustedColor + ", transparent) !important;\n\t\t\t\t}\n\n\n\t\t\t\t.monaco-workbench > .part.editor > .content.dragged-over .editor-group-container.active > .title .tabs-container > .tab.sizing-shrink:not(.dragged):hover > .tab-label::after {\n\t\t\t\t\tbackground: linear-gradient(to left, " + adjustedColorDrag + ", transparent) !important;\n\t\t\t\t}\n\t\t\t");
        }
        // Adjust gradient for unfocused hover background
        if (tabUnfocusedHoverBackground && adjustedTabBackground && adjustedTabDragBackground) {
            var adjustedColor = tabUnfocusedHoverBackground.flatten(adjustedTabBackground);
            var adjustedColorDrag = tabUnfocusedHoverBackground.flatten(adjustedTabDragBackground);
            collector.addRule("\n\t\t\t\t.monaco-workbench > .part.editor > .content:not(.dragged-over) .editor-group-container > .title .tabs-container > .tab.sizing-shrink:not(.dragged):hover > .tab-label::after {\n\t\t\t\t\tbackground: linear-gradient(to left, " + adjustedColor + ", transparent) !important;\n\t\t\t\t}\n\n\t\t\t\t.monaco-workbench > .part.editor > .content.dragged-over .editor-group-container > .title .tabs-container > .tab.sizing-shrink:not(.dragged):hover > .tab-label::after {\n\t\t\t\t\tbackground: linear-gradient(to left, " + adjustedColorDrag + ", transparent) !important;\n\t\t\t\t}\n\t\t\t");
        }
        // Adjust gradient for drag and drop background
        if (editorDragAndDropBackground && adjustedTabDragBackground) {
            var adjustedColorDrag = editorDragAndDropBackground.flatten(adjustedTabDragBackground);
            collector.addRule("\n\t\t\t.monaco-workbench > .part.editor > .content.dragged-over .editor-group-container.active > .title .tabs-container > .tab.sizing-shrink.dragged-over:not(.active):not(.dragged) > .tab-label::after,\n\t\t\t.monaco-workbench > .part.editor > .content.dragged-over .editor-group-container:not(.active) > .title .tabs-container > .tab.sizing-shrink.dragged-over:not(.dragged) > .tab-label::after {\n\t\t\t\tbackground: linear-gradient(to left, " + adjustedColorDrag + ", transparent) !important;\n\t\t\t}\n\t\t");
        }
        // Adjust gradient for active tab background
        var tabActiveBackground = theme.getColor(TAB_ACTIVE_BACKGROUND);
        if (tabActiveBackground && adjustedTabBackground && adjustedTabDragBackground) {
            var adjustedColor = tabActiveBackground.flatten(adjustedTabBackground);
            var adjustedColorDrag = tabActiveBackground.flatten(adjustedTabDragBackground);
            collector.addRule("\n\t\t\t\t.monaco-workbench > .part.editor > .content:not(.dragged-over) .editor-group-container > .title .tabs-container > .tab.sizing-shrink.active:not(.dragged) > .tab-label::after {\n\t\t\t\t\tbackground: linear-gradient(to left, " + adjustedColor + ", transparent);\n\t\t\t\t}\n\n\t\t\t\t.monaco-workbench > .part.editor > .content.dragged-over .editor-group-container > .title .tabs-container > .tab.sizing-shrink.active:not(.dragged) > .tab-label::after {\n\t\t\t\t\tbackground: linear-gradient(to left, " + adjustedColorDrag + ", transparent);\n\t\t\t\t}\n\t\t\t");
        }
        // Adjust gradient for inactive tab background
        var tabInactiveBackground = theme.getColor(TAB_INACTIVE_BACKGROUND);
        if (tabInactiveBackground && adjustedTabBackground && adjustedTabDragBackground) {
            var adjustedColor = tabInactiveBackground.flatten(adjustedTabBackground);
            var adjustedColorDrag = tabInactiveBackground.flatten(adjustedTabDragBackground);
            collector.addRule("\n\t\t\t.monaco-workbench > .part.editor > .content:not(.dragged-over) .editor-group-container > .title .tabs-container > .tab.sizing-shrink:not(.dragged) > .tab-label::after {\n\t\t\t\tbackground: linear-gradient(to left, " + adjustedColor + ", transparent);\n\t\t\t}\n\n\t\t\t.monaco-workbench > .part.editor > .content.dragged-over .editor-group-container > .title .tabs-container > .tab.sizing-shrink:not(.dragged) > .tab-label::after {\n\t\t\t\tbackground: linear-gradient(to left, " + adjustedColorDrag + ", transparent);\n\t\t\t}\n\t\t");
        }
    }
});
