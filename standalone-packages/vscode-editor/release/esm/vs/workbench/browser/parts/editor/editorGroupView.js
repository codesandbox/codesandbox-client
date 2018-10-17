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
import './media/editorgroupview.css';
import { TPromise } from '../../../../base/common/winjs.base.js';
import { EditorGroup, isSerializedEditorGroup } from '../../../common/editor/editorGroup.js';
import { EditorOptions, SideBySideEditorInput, EditorGroupActiveEditorDirtyContext } from '../../../common/editor.js';
import { Emitter, once, Relay } from '../../../../base/common/event.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { addClass, addClasses, Dimension, trackFocus, toggleClass, removeClass, addDisposableListener, EventType, EventHelper, findParentWithClass, clearNode, isAncestor } from '../../../../base/browser/dom.js';
import { ServiceCollection } from '../../../../platform/instantiation/common/serviceCollection.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { ProgressBar } from '../../../../base/browser/ui/progressbar/progressbar.js';
import { attachProgressBarStyler } from '../../../../platform/theme/common/styler.js';
import { IThemeService, registerThemingParticipant } from '../../../../platform/theme/common/themeService.js';
import { editorBackground, contrastBorder } from '../../../../platform/theme/common/colorRegistry.js';
import { Themable, EDITOR_GROUP_HEADER_TABS_BORDER, EDITOR_GROUP_HEADER_TABS_BACKGROUND, EDITOR_GROUP_HEADER_NO_TABS_BACKGROUND, EDITOR_GROUP_EMPTY_BACKGROUND, EDITOR_GROUP_FOCUSED_EMPTY_BORDER } from '../../../common/theme.js';
import { TabsTitleControl } from './tabsTitleControl.js';
import { EditorControl } from './editorControl.js';
import { IProgressService } from '../../../../platform/progress/common/progress.js';
import { ProgressService } from '../../../services/progress/browser/progressService.js';
import { localize } from '../../../../nls.js';
import { isPromiseCanceledError, isErrorWithActions } from '../../../../base/common/errors.js';
import { dispose } from '../../../../base/common/lifecycle.js';
import { Severity, INotificationService } from '../../../../platform/notification/common/notification.js';
import { toErrorMessage } from '../../../../base/common/errorMessage.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { RunOnceWorker } from '../../../../base/common/async.js';
import { EventType as TouchEventType } from '../../../../base/browser/touch.js';
import { getActiveTextEditorOptions } from './editor.js';
import { IUntitledEditorService } from '../../../services/untitled/common/untitledEditorService.js';
import { join } from '../../../../base/common/paths.js';
import { ActionBar } from '../../../../base/browser/ui/actionbar/actionbar.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { ActionRunner, Action } from '../../../../base/common/actions.js';
import { CLOSE_EDITOR_GROUP_COMMAND_ID } from './editorCommands.js';
import { NoTabsTitleControl } from './noTabsTitleControl.js';
import { IMenuService, MenuId } from '../../../../platform/actions/common/actions.js';
import { StandardMouseEvent } from '../../../../base/browser/mouseEvent.js';
import { fillInContextMenuActions } from '../../../../platform/actions/browser/menuItemActionItem.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
var EditorGroupView = /** @class */ (function (_super) {
    __extends(EditorGroupView, _super);
    function EditorGroupView(accessor, from, _label, instantiationService, contextKeyService, themeService, notificationService, telemetryService, untitledEditorService, keybindingService, menuService, contextMenuService) {
        var _this = _super.call(this, themeService) || this;
        _this.accessor = accessor;
        _this._label = _label;
        _this.instantiationService = instantiationService;
        _this.contextKeyService = contextKeyService;
        _this.notificationService = notificationService;
        _this.telemetryService = telemetryService;
        _this.untitledEditorService = untitledEditorService;
        _this.keybindingService = keybindingService;
        _this.menuService = menuService;
        _this.contextMenuService = contextMenuService;
        //#endregion
        //#region events
        _this._onDidFocus = _this._register(new Emitter());
        _this._onWillDispose = _this._register(new Emitter());
        _this._onDidGroupChange = _this._register(new Emitter());
        _this._onWillOpenEditor = _this._register(new Emitter());
        _this._onDidOpenEditorFail = _this._register(new Emitter());
        _this._onWillCloseEditor = _this._register(new Emitter());
        _this._onDidCloseEditor = _this._register(new Emitter());
        _this.mapEditorToPendingConfirmation = new Map();
        //#endregion
        //#region ISerializableView
        _this.element = document.createElement('div');
        _this._onDidChange = _this._register(new Relay());
        _this.onDidChange = _this._onDidChange.event;
        if (from instanceof EditorGroupView) {
            _this._group = _this._register(from.group.clone());
        }
        else if (isSerializedEditorGroup(from)) {
            _this._group = _this._register(instantiationService.createInstance(EditorGroup, from));
        }
        else {
            _this._group = _this._register(instantiationService.createInstance(EditorGroup, void 0));
        }
        _this.disposedEditorsWorker = _this._register(new RunOnceWorker(function (editors) { return _this.handleDisposedEditors(editors); }, 0));
        _this.create();
        _this._whenRestored = _this.restoreEditors(from);
        _this._whenRestored.then(function () { return _this.isRestored = true; });
        _this.registerListeners();
        return _this;
    }
    //#region factory
    EditorGroupView.createNew = function (accessor, label, instantiationService) {
        return instantiationService.createInstance(EditorGroupView, accessor, null, label);
    };
    EditorGroupView.createFromSerialized = function (serialized, accessor, label, instantiationService) {
        return instantiationService.createInstance(EditorGroupView, accessor, serialized, label);
    };
    EditorGroupView.createCopy = function (copyFrom, accessor, label, instantiationService) {
        return instantiationService.createInstance(EditorGroupView, accessor, copyFrom, label);
    };
    Object.defineProperty(EditorGroupView.prototype, "onDidFocus", {
        get: function () { return this._onDidFocus.event; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorGroupView.prototype, "onWillDispose", {
        get: function () { return this._onWillDispose.event; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorGroupView.prototype, "onDidGroupChange", {
        get: function () { return this._onDidGroupChange.event; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorGroupView.prototype, "onWillOpenEditor", {
        get: function () { return this._onWillOpenEditor.event; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorGroupView.prototype, "onDidOpenEditorFail", {
        get: function () { return this._onDidOpenEditorFail.event; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorGroupView.prototype, "onWillCloseEditor", {
        get: function () { return this._onWillCloseEditor.event; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorGroupView.prototype, "onDidCloseEditor", {
        get: function () { return this._onDidCloseEditor.event; },
        enumerable: true,
        configurable: true
    });
    EditorGroupView.prototype.create = function () {
        // Container
        addClasses(this.element, 'editor-group-container');
        // Container listeners
        this.registerContainerListeners();
        // Container toolbar
        this.createContainerToolbar();
        // Container context menu
        this.createContainerContextMenu();
        // Letterpress container
        var letterpressContainer = document.createElement('div');
        addClass(letterpressContainer, 'editor-group-letterpress');
        this.element.appendChild(letterpressContainer);
        // Progress bar
        this.progressBar = this._register(new ProgressBar(this.element));
        this._register(attachProgressBarStyler(this.progressBar, this.themeService));
        this.progressBar.hide();
        // Scoped services
        var scopedContextKeyService = this._register(this.contextKeyService.createScoped(this.element));
        this.scopedInstantiationService = this.instantiationService.createChild(new ServiceCollection([IContextKeyService, scopedContextKeyService], [IProgressService, new ProgressService(this.progressBar)]));
        // Context keys
        this.handleGroupContextKeys(scopedContextKeyService);
        // Title container
        this.titleContainer = document.createElement('div');
        addClass(this.titleContainer, 'title');
        this.element.appendChild(this.titleContainer);
        // Title control
        this.createTitleAreaControl();
        // Editor container
        this.editorContainer = document.createElement('div');
        addClass(this.editorContainer, 'editor-container');
        this.element.appendChild(this.editorContainer);
        // Editor control
        this.editorControl = this._register(this.scopedInstantiationService.createInstance(EditorControl, this.editorContainer, this));
        this._onDidChange.input = this.editorControl.onDidSizeConstraintsChange;
        // Track Focus
        this.doTrackFocus();
        // Update containers
        this.updateTitleContainer();
        this.updateContainer();
        // Update styles
        this.updateStyles();
    };
    EditorGroupView.prototype.handleGroupContextKeys = function (contextKeyServcie) {
        var _this = this;
        var groupActiveEditorDirtyContextKey = EditorGroupActiveEditorDirtyContext.bindTo(contextKeyServcie);
        var activeEditorListener;
        var observeActiveEditor = function () {
            activeEditorListener = dispose(activeEditorListener);
            var activeEditor = _this._group.activeEditor;
            if (activeEditor) {
                groupActiveEditorDirtyContextKey.set(activeEditor.isDirty());
                activeEditorListener = activeEditor.onDidChangeDirty(function () { return groupActiveEditorDirtyContextKey.set(activeEditor.isDirty()); });
            }
            else {
                groupActiveEditorDirtyContextKey.set(false);
            }
        };
        // Track the active editor and update context key that reflects
        // the dirty state of this editor
        this._register(this.onDidGroupChange(function (e) {
            if (e.kind === 5 /* EDITOR_ACTIVE */) {
                observeActiveEditor();
            }
        }));
        observeActiveEditor();
    };
    EditorGroupView.prototype.registerContainerListeners = function () {
        var _this = this;
        // Open new file via doubleclick on empty container
        this._register(addDisposableListener(this.element, EventType.DBLCLICK, function (e) {
            if (_this.isEmpty()) {
                EventHelper.stop(e);
                _this.openEditor(_this.untitledEditorService.createOrGet(), EditorOptions.create({ pinned: true }));
            }
        }));
        // Close empty editor group via middle mouse click
        this._register(addDisposableListener(this.element, EventType.MOUSE_UP, function (e) {
            if (_this.isEmpty() && e.button === 1 /* Middle Button */) {
                EventHelper.stop(e);
                _this.accessor.removeGroup(_this);
            }
        }));
    };
    EditorGroupView.prototype.createContainerToolbar = function () {
        var _this = this;
        // Toolbar Container
        var toolbarContainer = document.createElement('div');
        addClass(toolbarContainer, 'editor-group-container-toolbar');
        this.element.appendChild(toolbarContainer);
        // Toolbar
        var groupId = this._group.id;
        var containerToolbar = new ActionBar(toolbarContainer, {
            ariaLabel: localize('araLabelGroupActions', "Editor group actions"), actionRunner: this._register(new /** @class */ (function (_super) {
                __extends(class_1, _super);
                function class_1() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                class_1.prototype.run = function (action) {
                    return action.run(groupId);
                };
                return class_1;
            }(ActionRunner)))
        });
        // Toolbar actions
        var removeGroupAction = this._register(new Action(CLOSE_EDITOR_GROUP_COMMAND_ID, localize('closeGroupAction', "Close"), 'close-editor-group', true, function () { _this.accessor.removeGroup(_this); return TPromise.as(true); }));
        var keybinding = this.keybindingService.lookupKeybinding(removeGroupAction.id);
        containerToolbar.push(removeGroupAction, { icon: true, label: false, keybinding: keybinding ? keybinding.getLabel() : void 0 });
    };
    EditorGroupView.prototype.createContainerContextMenu = function () {
        var _this = this;
        var menu = this._register(this.menuService.createMenu(MenuId.EmptyEditorGroupContext, this.contextKeyService));
        this._register(addDisposableListener(this.element, EventType.CONTEXT_MENU, function (event) { return _this.onShowContainerContextMenu(menu, event); }));
        this._register(addDisposableListener(this.element, TouchEventType.Contextmenu, function (event) { return _this.onShowContainerContextMenu(menu); }));
    };
    EditorGroupView.prototype.onShowContainerContextMenu = function (menu, e) {
        var _this = this;
        if (!this.isEmpty()) {
            return; // only for empty editor groups
        }
        // Find target anchor
        var anchor = this.element;
        if (e instanceof MouseEvent) {
            var event_1 = new StandardMouseEvent(e);
            anchor = { x: event_1.posx, y: event_1.posy };
        }
        // Fill in contributed actions
        var actions = [];
        fillInContextMenuActions(menu, void 0, actions, this.contextMenuService);
        // Show it
        this.contextMenuService.showContextMenu({
            getAnchor: function () { return anchor; },
            getActions: function () { return TPromise.as(actions); },
            onHide: function () { return _this.focus(); }
        });
    };
    EditorGroupView.prototype.doTrackFocus = function () {
        var _this = this;
        // Container
        var containerFocusTracker = this._register(trackFocus(this.element));
        this._register(containerFocusTracker.onDidFocus(function () {
            if (_this.isEmpty()) {
                _this._onDidFocus.fire(); // only when empty to prevent accident focus
            }
        }));
        // Title Container
        var handleTitleClickOrTouch = function (e) {
            var target;
            if (e instanceof MouseEvent) {
                if (e.button !== 0) {
                    return void 0; // only for left mouse click
                }
                target = e.target;
            }
            else {
                target = e.initialTarget;
            }
            if (findParentWithClass(target, 'monaco-action-bar', _this.titleContainer) ||
                findParentWithClass(target, 'monaco-breadcrumb-item', _this.titleContainer)) {
                return; // not when clicking on actions or breadcrumbs
            }
            // timeout to keep focus in editor after mouse up
            setTimeout(function () {
                _this.focus();
            });
        };
        this._register(addDisposableListener(this.titleContainer, EventType.MOUSE_DOWN, function (e) { return handleTitleClickOrTouch(e); }));
        this._register(addDisposableListener(this.titleContainer, TouchEventType.Tap, function (e) { return handleTitleClickOrTouch(e); }));
        // Editor Container
        this._register(this.editorControl.onDidFocus(function () {
            _this._onDidFocus.fire();
        }));
    };
    EditorGroupView.prototype.updateContainer = function () {
        // Empty Container: add some empty container attributes
        if (this.isEmpty()) {
            addClass(this.element, 'empty');
            this.element.tabIndex = 0;
            this.element.setAttribute('aria-label', localize('emptyEditorGroup', "{0} (empty)", this.label));
        }
        // Non-Empty Container: revert empty container attributes
        else {
            removeClass(this.element, 'empty');
            this.element.removeAttribute('tabIndex');
            this.element.removeAttribute('aria-label');
        }
        // Update styles
        this.updateStyles();
    };
    EditorGroupView.prototype.updateTitleContainer = function () {
        toggleClass(this.titleContainer, 'tabs', this.accessor.partOptions.showTabs);
        toggleClass(this.titleContainer, 'show-file-icons', this.accessor.partOptions.showIcons);
    };
    EditorGroupView.prototype.createTitleAreaControl = function () {
        // Clear old if existing
        if (this.titleAreaControl) {
            this.titleAreaControl.dispose();
            clearNode(this.titleContainer);
        }
        // Create new based on options
        if (this.accessor.partOptions.showTabs) {
            this.titleAreaControl = this.scopedInstantiationService.createInstance(TabsTitleControl, this.titleContainer, this.accessor, this);
        }
        else {
            this.titleAreaControl = this.scopedInstantiationService.createInstance(NoTabsTitleControl, this.titleContainer, this.accessor, this);
        }
    };
    EditorGroupView.prototype.restoreEditors = function (from) {
        var _this = this;
        if (this._group.count === 0) {
            return TPromise.as(void 0); // nothing to show
        }
        // Determine editor options
        var options;
        if (from instanceof EditorGroupView) {
            options = getActiveTextEditorOptions(from); // if we copy from another group, ensure to copy its active editor viewstate
        }
        else {
            options = new EditorOptions();
        }
        var activeEditor = this._group.activeEditor;
        options.pinned = this._group.isPinned(activeEditor); // preserve pinned state
        options.preserveFocus = true; // handle focus after editor is opened
        // Show active editor
        return this.doShowEditor(activeEditor, true, options).then(function () {
            // Set focused now if this is the active group
            if (_this.accessor.activeGroup === _this) {
                _this.focus();
            }
        });
    };
    //#region event handling
    EditorGroupView.prototype.registerListeners = function () {
        var _this = this;
        // Model Events
        this._register(this._group.onDidEditorPin(function (editor) { return _this.onDidEditorPin(editor); }));
        this._register(this._group.onDidEditorOpen(function (editor) { return _this.onDidEditorOpen(editor); }));
        this._register(this._group.onDidEditorClose(function (editor) { return _this.onDidEditorClose(editor); }));
        this._register(this._group.onDidEditorDispose(function (editor) { return _this.onDidEditorDispose(editor); }));
        this._register(this._group.onDidEditorBecomeDirty(function (editor) { return _this.onDidEditorBecomeDirty(editor); }));
        this._register(this._group.onDidEditorLabelChange(function (editor) { return _this.onDidEditorLabelChange(editor); }));
        // Option Changes
        this._register(this.accessor.onDidEditorPartOptionsChange(function (e) { return _this.onDidEditorPartOptionsChange(e); }));
    };
    EditorGroupView.prototype.onDidEditorPin = function (editor) {
        // Event
        this._onDidGroupChange.fire({ kind: 7 /* EDITOR_PIN */, editor: editor });
    };
    EditorGroupView.prototype.onDidEditorOpen = function (editor) {
        /* __GDPR__
            "editorOpened" : {
                "${include}": [
                    "${EditorTelemetryDescriptor}"
                ]
            }
        */
        this.telemetryService.publicLog('editorOpened', editor.getTelemetryDescriptor());
        // Update container
        this.updateContainer();
        // Event
        this._onDidGroupChange.fire({ kind: 2 /* EDITOR_OPEN */, editor: editor });
    };
    EditorGroupView.prototype.onDidEditorClose = function (event) {
        var _this = this;
        // Before close
        this._onWillCloseEditor.fire(event);
        // Handle event
        var editor = event.editor;
        var editorsToClose = [editor];
        // Include both sides of side by side editors when being closed and not opened multiple times
        if (editor instanceof SideBySideEditorInput && !this.accessor.groups.some(function (groupView) { return groupView.group.contains(editor); })) {
            editorsToClose.push(editor.master, editor.details);
        }
        // Close the editor when it is no longer open in any group including diff editors
        editorsToClose.forEach(function (editorToClose) {
            var resource = editorToClose ? editorToClose.getResource() : void 0; // prefer resource to not close right-hand side editors of a diff editor
            if (!_this.accessor.groups.some(function (groupView) { return groupView.group.contains(resource || editorToClose); })) {
                editorToClose.close();
            }
        });
        /* __GDPR__
            "editorClosed" : {
                "${include}": [
                    "${EditorTelemetryDescriptor}"
                ]
            }
        */
        this.telemetryService.publicLog('editorClosed', event.editor.getTelemetryDescriptor());
        // Update container
        this.updateContainer();
        // Event
        this._onDidCloseEditor.fire(event);
        this._onDidGroupChange.fire({ kind: 3 /* EDITOR_CLOSE */, editor: editor, editorIndex: event.index });
    };
    EditorGroupView.prototype.onDidEditorDispose = function (editor) {
        // To prevent race conditions, we handle disposed editors in our worker with a timeout
        // because it can happen that an input is being disposed with the intent to replace
        // it with some other input right after.
        this.disposedEditorsWorker.work(editor);
    };
    EditorGroupView.prototype.handleDisposedEditors = function (editors) {
        var _this = this;
        // Split between visible and hidden editors
        var activeEditor;
        var inactiveEditors = [];
        editors.forEach(function (editor) {
            if (_this._group.isActive(editor)) {
                activeEditor = editor;
            }
            else if (_this._group.contains(editor)) {
                inactiveEditors.push(editor);
            }
        });
        // Close all inactive editors first to prevent UI flicker
        inactiveEditors.forEach(function (hidden) { return _this.doCloseEditor(hidden, false); });
        // Close active one last
        if (activeEditor) {
            this.doCloseEditor(activeEditor, false);
        }
    };
    EditorGroupView.prototype.onDidEditorPartOptionsChange = function (event) {
        // Title container
        this.updateTitleContainer();
        // Title control Switch between showing tabs <=> not showing tabs
        if (event.oldPartOptions.showTabs !== event.newPartOptions.showTabs) {
            this.createTitleAreaControl();
            if (this._group.activeEditor) {
                this.titleAreaControl.openEditor(this._group.activeEditor);
            }
        }
        // Just update title control
        else {
            this.titleAreaControl.updateOptions(event.oldPartOptions, event.newPartOptions);
        }
        // Styles
        this.updateStyles();
        // Pin preview editor once user disables preview
        if (event.oldPartOptions.enablePreview && !event.newPartOptions.enablePreview) {
            this.pinEditor(this._group.previewEditor);
        }
    };
    EditorGroupView.prototype.onDidEditorBecomeDirty = function (editor) {
        // Always show dirty editors pinned
        this.pinEditor(editor);
        // Forward to title control
        this.titleAreaControl.updateEditorDirty(editor);
        // Event
        this._onDidGroupChange.fire({ kind: 8 /* EDITOR_DIRTY */, editor: editor });
    };
    EditorGroupView.prototype.onDidEditorLabelChange = function (editor) {
        // Forward to title control
        this.titleAreaControl.updateEditorLabel(editor);
        // Event
        this._onDidGroupChange.fire({ kind: 6 /* EDITOR_LABEL */, editor: editor });
    };
    Object.defineProperty(EditorGroupView.prototype, "group", {
        //#endregion
        //region IEditorGroupView
        get: function () {
            return this._group;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorGroupView.prototype, "label", {
        get: function () {
            return this._label;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorGroupView.prototype, "disposed", {
        get: function () {
            return this._disposed;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorGroupView.prototype, "whenRestored", {
        get: function () {
            return this._whenRestored;
        },
        enumerable: true,
        configurable: true
    });
    EditorGroupView.prototype.setLabel = function (label) {
        if (this._label !== label) {
            this._label = label;
            this._onDidGroupChange.fire({ kind: 1 /* GROUP_LABEL */ });
        }
    };
    EditorGroupView.prototype.setActive = function (isActive) {
        this.active = isActive;
        // Update container
        toggleClass(this.element, 'active', isActive);
        toggleClass(this.element, 'inactive', !isActive);
        // Update title control
        this.titleAreaControl.setActive(isActive);
        // Update styles
        this.updateStyles();
        // Event
        this._onDidGroupChange.fire({ kind: 0 /* GROUP_ACTIVE */ });
    };
    EditorGroupView.prototype.isEmpty = function () {
        return this._group.count === 0;
    };
    Object.defineProperty(EditorGroupView.prototype, "id", {
        //#endregion
        //#region IEditorGroup
        //#region basics()
        get: function () {
            return this._group.id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorGroupView.prototype, "editors", {
        get: function () {
            return this._group.getEditors();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorGroupView.prototype, "count", {
        get: function () {
            return this._group.count;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorGroupView.prototype, "activeControl", {
        get: function () {
            return this.editorControl ? this.editorControl.activeControl : void 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorGroupView.prototype, "activeEditor", {
        get: function () {
            return this._group.activeEditor;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorGroupView.prototype, "previewEditor", {
        get: function () {
            return this._group.previewEditor;
        },
        enumerable: true,
        configurable: true
    });
    EditorGroupView.prototype.isPinned = function (editor) {
        return this._group.isPinned(editor);
    };
    EditorGroupView.prototype.isActive = function (editor) {
        return this._group.isActive(editor);
    };
    EditorGroupView.prototype.getEditors = function (order) {
        if (order === 0 /* MOST_RECENTLY_ACTIVE */) {
            return this._group.getEditors(true);
        }
        return this.editors;
    };
    EditorGroupView.prototype.getEditor = function (index) {
        return this._group.getEditor(index);
    };
    EditorGroupView.prototype.getIndexOfEditor = function (editor) {
        return this._group.indexOf(editor);
    };
    EditorGroupView.prototype.isOpened = function (editor) {
        return this._group.contains(editor);
    };
    EditorGroupView.prototype.focus = function () {
        // Pass focus to widgets
        if (this.activeControl) {
            this.activeControl.focus();
        }
        else {
            this.element.focus();
        }
        // Event
        this._onDidFocus.fire();
    };
    EditorGroupView.prototype.pinEditor = function (editor) {
        if (editor === void 0) { editor = this.activeEditor; }
        if (editor && !this._group.isPinned(editor)) {
            // Update model
            this._group.pin(editor);
            // Forward to title control
            this.titleAreaControl.pinEditor(editor);
        }
    };
    EditorGroupView.prototype.invokeWithinContext = function (fn) {
        return this.scopedInstantiationService.invokeFunction(fn);
    };
    //#endregion
    //#region openEditor()
    EditorGroupView.prototype.openEditor = function (editor, options) {
        // Guard against invalid inputs
        if (!editor) {
            return TPromise.as(void 0);
        }
        // Editor opening event allows for prevention
        var event = new EditorOpeningEvent(this._group.id, editor, options);
        this._onWillOpenEditor.fire(event);
        var prevented = event.isPrevented();
        if (prevented) {
            return prevented();
        }
        // Proceed with opening
        return this.doOpenEditor(editor, options);
    };
    EditorGroupView.prototype.doOpenEditor = function (editor, options) {
        // Determine options
        var openEditorOptions = {
            index: options ? options.index : void 0,
            pinned: !this.accessor.partOptions.enablePreview || editor.isDirty() || (options && options.pinned) || (options && typeof options.index === 'number'),
            active: this._group.count === 0 || !options || !options.inactive
        };
        if (!openEditorOptions.active && !openEditorOptions.pinned && this._group.isPreview(this._group.activeEditor)) {
            // Special case: we are to open an editor inactive and not pinned, but the current active
            // editor is also not pinned, which means it will get replaced with this one. As such,
            // the editor can only be active.
            openEditorOptions.active = true;
        }
        // Set group active unless we open inactive or preserve focus
        // Do this before we open the editor in the group to prevent a false
        // active editor change event before the editor is loaded
        // (see https://github.com/Microsoft/vscode/issues/51679)
        if (openEditorOptions.active && (!options || !options.preserveFocus)) {
            this.accessor.activateGroup(this);
        }
        // Update model
        this._group.openEditor(editor, openEditorOptions);
        // Show editor
        var showEditorResult = this.doShowEditor(editor, openEditorOptions.active, options);
        return showEditorResult;
    };
    EditorGroupView.prototype.doShowEditor = function (editor, active, options) {
        var _this = this;
        // Show in editor control if the active editor changed
        var openEditorPromise;
        if (active) {
            openEditorPromise = this.editorControl.openEditor(editor, options).then(function (result) {
                // Editor change event
                if (result.editorChanged) {
                    _this._onDidGroupChange.fire({ kind: 5 /* EDITOR_ACTIVE */, editor: editor });
                }
            }, function (error) {
                // Handle errors but do not bubble them up
                _this.doHandleOpenEditorError(error, editor, options);
            });
        }
        else {
            openEditorPromise = TPromise.as(void 0);
        }
        // Show in title control after editor control because some actions depend on it
        this.titleAreaControl.openEditor(editor);
        return openEditorPromise;
    };
    EditorGroupView.prototype.doHandleOpenEditorError = function (error, editor, options) {
        // Report error only if this was not us restoring previous error state or
        // we are told to ignore errors that occur from opening an editor
        if (this.isRestored && !isPromiseCanceledError(error) && !this.ignoreOpenEditorErrors) {
            var actions_1 = { primary: [] };
            if (isErrorWithActions(error)) {
                actions_1.primary = error.actions;
            }
            var handle = this.notificationService.notify({
                severity: Severity.Error,
                message: localize('editorOpenError', "Unable to open '{0}': {1}.", editor.getName(), toErrorMessage(error)),
                actions: actions_1
            });
            once(handle.onDidClose)(function () { return dispose(actions_1.primary); });
        }
        // Event
        this._onDidOpenEditorFail.fire(editor);
        // Recover by closing the active editor (if the input is still the active one)
        if (this.activeEditor === editor) {
            var focusNext = !options || !options.preserveFocus;
            this.doCloseEditor(editor, focusNext, true /* from error */);
        }
    };
    //#endregion
    //#region openEditors()
    EditorGroupView.prototype.openEditors = function (editors) {
        var _this = this;
        if (!editors.length) {
            return TPromise.as(void 0);
        }
        // Do not modify original array
        editors = editors.slice(0);
        // Use the first editor as active editor
        var _a = editors.shift(), editor = _a.editor, options = _a.options;
        return this.openEditor(editor, options).then(function () {
            var startingIndex = _this.getIndexOfEditor(editor) + 1;
            // Open the other ones inactive
            return Promise.all(editors.map(function (_a, index) {
                var editor = _a.editor, options = _a.options;
                var adjustedEditorOptions = options || new EditorOptions();
                adjustedEditorOptions.inactive = true;
                adjustedEditorOptions.pinned = true;
                adjustedEditorOptions.index = startingIndex + index;
                return _this.openEditor(editor, adjustedEditorOptions);
            })).then(function () { return void 0; });
        });
    };
    //#endregion
    //#region moveEditor()
    EditorGroupView.prototype.moveEditor = function (editor, target, options) {
        // Move within same group
        if (this === target) {
            this.doMoveEditorInsideGroup(editor, options);
        }
        // Move across groups
        else {
            this.doMoveOrCopyEditorAcrossGroups(editor, target, options);
        }
    };
    EditorGroupView.prototype.doMoveEditorInsideGroup = function (editor, moveOptions) {
        var moveToIndex = moveOptions ? moveOptions.index : void 0;
        if (typeof moveToIndex !== 'number') {
            return; // do nothing if we move into same group without index
        }
        var currentIndex = this._group.indexOf(editor);
        if (currentIndex === moveToIndex) {
            return; // do nothing if editor is already at the given index
        }
        // Update model
        this._group.moveEditor(editor, moveToIndex);
        this._group.pin(editor);
        // Forward to title area
        this.titleAreaControl.moveEditor(editor, currentIndex, moveToIndex);
        this.titleAreaControl.pinEditor(editor);
        // Event
        this._onDidGroupChange.fire({ kind: 4 /* EDITOR_MOVE */, editor: editor });
    };
    EditorGroupView.prototype.doMoveOrCopyEditorAcrossGroups = function (editor, target, moveOptions, keepCopy) {
        if (moveOptions === void 0) { moveOptions = Object.create(null); }
        // When moving an editor, try to preserve as much view state as possible by checking
        // for the editor to be a text editor and creating the options accordingly if so
        var options = getActiveTextEditorOptions(this, editor, EditorOptions.create(moveOptions));
        options.pinned = true; // always pin moved editor
        // A move to another group is an open first...
        target.openEditor(editor, options);
        // ...and a close afterwards (unless we copy)
        if (!keepCopy) {
            this.doCloseEditor(editor, false /* do not focus next one behind if any */);
        }
    };
    //#endregion
    //#region copyEditor()
    EditorGroupView.prototype.copyEditor = function (editor, target, options) {
        // Move within same group because we do not support to show the same editor
        // multiple times in the same group
        if (this === target) {
            this.doMoveEditorInsideGroup(editor, options);
        }
        // Copy across groups
        else {
            this.doMoveOrCopyEditorAcrossGroups(editor, target, options, true);
        }
    };
    //#endregion
    //#region closeEditor()
    EditorGroupView.prototype.closeEditor = function (editor) {
        var _this = this;
        if (editor === void 0) { editor = this.activeEditor; }
        if (!editor) {
            return TPromise.as(void 0);
        }
        // Check for dirty and veto
        return this.handleDirty([editor]).then(function (veto) {
            if (veto) {
                return;
            }
            // Do close
            _this.doCloseEditor(editor);
        });
    };
    EditorGroupView.prototype.doCloseEditor = function (editor, focusNext, fromError) {
        if (focusNext === void 0) { focusNext = this.accessor.activeGroup === this; }
        // Closing the active editor of the group is a bit more work
        if (this._group.isActive(editor)) {
            this.doCloseActiveEditor(focusNext, fromError);
        }
        // Closing inactive editor is just a model update
        else {
            this.doCloseInactiveEditor(editor);
        }
        // Forward to title control
        this.titleAreaControl.closeEditor(editor);
    };
    EditorGroupView.prototype.doCloseActiveEditor = function (focusNext, fromError) {
        var _this = this;
        if (focusNext === void 0) { focusNext = this.accessor.activeGroup === this; }
        var editorToClose = this.activeEditor;
        var editorHasFocus = isAncestor(document.activeElement, this.element);
        // Optimization: if we are about to close the last editor in this group and settings
        // are configured to close the group since it will be empty, we first set the last
        // active group as empty before closing the editor. This reduces the amount of editor
        // change events that this operation emits and will reduce flicker. Without this
        // optimization, this group (if active) would first trigger a active editor change
        // event because it became empty, only to then trigger another one when the next
        // group gets active.
        var closeEmptyGroup = this.accessor.partOptions.closeEmptyGroups;
        if (closeEmptyGroup && this.active && this._group.count === 1) {
            var mostRecentlyActiveGroups = this.accessor.getGroups(1 /* MOST_RECENTLY_ACTIVE */);
            var nextActiveGroup = mostRecentlyActiveGroups[1]; // [0] will be the current one, so take [1]
            if (nextActiveGroup) {
                if (editorHasFocus) {
                    nextActiveGroup.focus();
                }
                else {
                    this.accessor.activateGroup(nextActiveGroup);
                }
            }
        }
        // Update model
        this._group.closeEditor(editorToClose);
        // Open next active if there are more to show
        var nextActiveEditor = this._group.activeEditor;
        if (nextActiveEditor) {
            // When closing an editor due to an error we can end up in a loop where we continue closing
            // editors that fail to open (e.g. when the file no longer exists). We do not want to show
            // repeated errors in this case to the user. As such, if we open the next editor and we are
            // in a scope of a previous editor failing, we silence the input errors until the editor is
            // opened.
            if (fromError) {
                this.ignoreOpenEditorErrors = true;
            }
            var options = !focusNext ? EditorOptions.create({ preserveFocus: true }) : void 0;
            this.openEditor(nextActiveEditor, options).then(function () {
                _this.ignoreOpenEditorErrors = false;
            });
        }
        // Otherwise we are empty, so clear from editor control and send event
        else {
            // Forward to editor control
            this.editorControl.closeEditor(editorToClose);
            // Restore focus to group container as needed unless group gets closed
            if (editorHasFocus && !closeEmptyGroup) {
                this.focus();
            }
            // Events
            this._onDidGroupChange.fire({ kind: 5 /* EDITOR_ACTIVE */ });
            // Remove empty group if we should
            if (closeEmptyGroup) {
                this.accessor.removeGroup(this);
            }
        }
    };
    EditorGroupView.prototype.doCloseInactiveEditor = function (editor) {
        // Update model
        this._group.closeEditor(editor);
    };
    EditorGroupView.prototype.handleDirty = function (editors) {
        var _this = this;
        if (!editors.length) {
            return TPromise.as(false); // no veto
        }
        var editor = editors.shift();
        // To prevent multiple confirmation dialogs from showing up one after the other
        // we check if a pending confirmation is currently showing and if so, join that
        var handleDirtyPromise = this.mapEditorToPendingConfirmation.get(editor);
        if (!handleDirtyPromise) {
            handleDirtyPromise = this.doHandleDirty(editor);
            this.mapEditorToPendingConfirmation.set(editor, handleDirtyPromise);
        }
        return handleDirtyPromise.then(function (veto) {
            // Make sure to remove from our map of cached pending confirmations
            _this.mapEditorToPendingConfirmation.delete(editor);
            // Return for the first veto we got
            if (veto) {
                return veto;
            }
            // Otherwise continue with the remainders
            return _this.handleDirty(editors);
        });
    };
    EditorGroupView.prototype.doHandleDirty = function (editor) {
        var _this = this;
        if (!editor.isDirty() || // editor must be dirty
            this.accessor.groups.some(function (groupView) { return groupView !== _this && groupView.group.contains(editor, true /* support side by side */); }) || // editor is opened in other group
            editor instanceof SideBySideEditorInput && this.isOpened(editor.master) // side by side editor master is still opened
        ) {
            return TPromise.as(false);
        }
        // Switch to editor that we want to handle and confirm to save/revert
        return this.openEditor(editor).then(function () { return editor.confirmSave().then(function (res) {
            // It could be that the editor saved meanwhile, so we check again
            // to see if anything needs to happen before closing for good.
            // This can happen for example if autoSave: onFocusChange is configured
            // so that the save happens when the dialog opens.
            if (!editor.isDirty()) {
                return res === 2 /* CANCEL */ ? true : false;
            }
            // Otherwise, handle accordingly
            switch (res) {
                case 0 /* SAVE */:
                    return editor.save().then(function (ok) { return !ok; });
                case 1 /* DONT_SAVE */:
                    // first try a normal revert where the contents of the editor are restored
                    return editor.revert().then(function (ok) { return !ok; }, function (error) {
                        // if that fails, since we are about to close the editor, we accept that
                        // the editor cannot be reverted and instead do a soft revert that just
                        // enables us to close the editor. With this, a user can always close a
                        // dirty editor even when reverting fails.
                        return editor.revert({ soft: true }).then(function (ok) { return !ok; });
                    });
                case 2 /* CANCEL */:
                    return true; // veto
            }
        }); });
    };
    //#endregion
    //#region closeEditors()
    EditorGroupView.prototype.closeEditors = function (args) {
        var _this = this;
        if (this.isEmpty()) {
            return TPromise.as(void 0);
        }
        var editors = this.getEditorsToClose(args);
        // Check for dirty and veto
        return this.handleDirty(editors.slice(0)).then(function (veto) {
            if (veto) {
                return;
            }
            // Do close
            _this.doCloseEditors(editors);
        });
    };
    EditorGroupView.prototype.getEditorsToClose = function (editors) {
        if (Array.isArray(editors)) {
            return editors;
        }
        var filter = editors;
        var hasDirection = typeof filter.direction === 'number';
        var editorsToClose = this._group.getEditors(!hasDirection /* in MRU order only if direction is not specified */);
        // Filter: saved only
        if (filter.savedOnly) {
            editorsToClose = editorsToClose.filter(function (e) { return !e.isDirty(); });
        }
        // Filter: direction (left / right)
        else if (hasDirection) {
            editorsToClose = (filter.direction === 0 /* LEFT */) ?
                editorsToClose.slice(0, this._group.indexOf(filter.except)) :
                editorsToClose.slice(this._group.indexOf(filter.except) + 1);
        }
        // Filter: except
        else if (filter.except) {
            editorsToClose = editorsToClose.filter(function (e) { return !e.matches(filter.except); });
        }
        return editorsToClose;
    };
    EditorGroupView.prototype.doCloseEditors = function (editors) {
        var _this = this;
        // Close all inactive editors first
        var closeActiveEditor = false;
        editors.forEach(function (editor) {
            if (!_this.isActive(editor)) {
                _this.doCloseInactiveEditor(editor);
            }
            else {
                closeActiveEditor = true;
            }
        });
        // Close active editor last if contained in editors list to close
        if (closeActiveEditor) {
            this.doCloseActiveEditor();
        }
        // Forward to title control
        this.titleAreaControl.closeEditors(editors);
    };
    //#endregion
    //#region closeAllEditors()
    EditorGroupView.prototype.closeAllEditors = function () {
        var _this = this;
        if (this.isEmpty()) {
            // If the group is empty and the request is to close all editors, we still close
            // the editor group is the related setting to close empty groups is enabled for
            // a convinient way of removing empty editor groups for the user.
            if (this.accessor.partOptions.closeEmptyGroups) {
                this.accessor.removeGroup(this);
            }
            return TPromise.as(void 0);
        }
        // Check for dirty and veto
        var editors = this._group.getEditors(true);
        return this.handleDirty(editors.slice(0)).then(function (veto) {
            if (veto) {
                return;
            }
            // Do close
            _this.doCloseAllEditors();
        });
    };
    EditorGroupView.prototype.doCloseAllEditors = function () {
        var _this = this;
        // Close all inactive editors first
        this.editors.forEach(function (editor) {
            if (!_this.isActive(editor)) {
                _this.doCloseInactiveEditor(editor);
            }
        });
        // Close active editor last
        this.doCloseActiveEditor();
        // Forward to title control
        this.titleAreaControl.closeAllEditors();
    };
    //#endregion
    //#region replaceEditors()
    EditorGroupView.prototype.replaceEditors = function (editors) {
        var _this = this;
        // Extract active vs. inactive replacements
        var activeReplacement;
        var inactiveReplacements = [];
        editors.forEach(function (_a) {
            var editor = _a.editor, replacement = _a.replacement, options = _a.options;
            if (editor.isDirty()) {
                return; // we do not handle dirty in this method, so ignore all dirty
            }
            var index = _this.getIndexOfEditor(editor);
            if (index >= 0) {
                var isActiveEditor = _this.isActive(editor);
                // make sure we respect the index of the editor to replace
                if (options) {
                    options.index = index;
                }
                else {
                    options = EditorOptions.create({ index: index });
                }
                options.inactive = !isActiveEditor;
                options.pinned = true;
                var editorToReplace = { editor: editor, replacement: replacement, options: options };
                if (isActiveEditor) {
                    activeReplacement = editorToReplace;
                }
                else {
                    inactiveReplacements.push(editorToReplace);
                }
            }
        });
        // Handle inactive first
        inactiveReplacements.forEach(function (_a) {
            var editor = _a.editor, replacement = _a.replacement, options = _a.options;
            // Open inactive editor
            _this.doOpenEditor(replacement, options);
            // Close replaced inactive edior
            _this.doCloseInactiveEditor(editor);
            // Forward to title control
            _this.titleAreaControl.closeEditor(editor);
        });
        // Handle active last
        if (activeReplacement) {
            // Open replacement as active editor
            var openEditorResult = this.doOpenEditor(activeReplacement.replacement, activeReplacement.options);
            // Close previous active editor
            this.doCloseInactiveEditor(activeReplacement.editor);
            // Forward to title control
            this.titleAreaControl.closeEditor(activeReplacement.editor);
            return openEditorResult;
        }
        return TPromise.as(void 0);
    };
    //#endregion
    //#endregion
    //#region Themable
    EditorGroupView.prototype.updateStyles = function () {
        var isEmpty = this.isEmpty();
        // Container
        if (isEmpty) {
            this.element.style.backgroundColor = this.getColor(EDITOR_GROUP_EMPTY_BACKGROUND);
        }
        else {
            this.element.style.backgroundColor = null;
        }
        // Title control
        var showTabs = this.accessor.partOptions.showTabs;
        var borderColor = this.getColor(EDITOR_GROUP_HEADER_TABS_BORDER) || this.getColor(contrastBorder);
        if (!isEmpty && showTabs && borderColor) {
            addClass(this.titleContainer, 'title-border-bottom');
            this.titleContainer.style.setProperty('--title-border-bottom-color', borderColor.toString());
        }
        else {
            removeClass(this.titleContainer, 'title-border-bottom');
            this.titleContainer.style.removeProperty('--title-border-bottom-color');
        }
        this.titleContainer.style.backgroundColor = this.getColor(showTabs ? EDITOR_GROUP_HEADER_TABS_BACKGROUND : EDITOR_GROUP_HEADER_NO_TABS_BACKGROUND);
        // Editor container
        this.editorContainer.style.backgroundColor = this.getColor(editorBackground);
    };
    Object.defineProperty(EditorGroupView.prototype, "minimumWidth", {
        get: function () { return this.editorControl.minimumWidth; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorGroupView.prototype, "minimumHeight", {
        get: function () { return this.editorControl.minimumHeight; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorGroupView.prototype, "maximumWidth", {
        get: function () { return this.editorControl.maximumWidth; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorGroupView.prototype, "maximumHeight", {
        get: function () { return this.editorControl.maximumHeight; },
        enumerable: true,
        configurable: true
    });
    EditorGroupView.prototype.layout = function (width, height) {
        this.dimension = new Dimension(width, height);
        // Forward to controls
        this.titleAreaControl.layout(new Dimension(this.dimension.width, this.titleAreaControl.getPreferredHeight()));
        this.editorControl.layout(new Dimension(this.dimension.width, this.dimension.height - this.titleAreaControl.getPreferredHeight()));
    };
    EditorGroupView.prototype.relayout = function () {
        if (this.dimension) {
            var _a = this.dimension, width = _a.width, height = _a.height;
            this.layout(width, height);
        }
    };
    EditorGroupView.prototype.toJSON = function () {
        return this._group.serialize();
    };
    //#endregion
    EditorGroupView.prototype.shutdown = function () {
        this.editorControl.shutdown();
    };
    EditorGroupView.prototype.dispose = function () {
        this._disposed = true;
        this._onWillDispose.fire();
        this.titleAreaControl.dispose();
        // this.editorControl = null;
        _super.prototype.dispose.call(this);
    };
    EditorGroupView = __decorate([
        __param(3, IInstantiationService),
        __param(4, IContextKeyService),
        __param(5, IThemeService),
        __param(6, INotificationService),
        __param(7, ITelemetryService),
        __param(8, IUntitledEditorService),
        __param(9, IKeybindingService),
        __param(10, IMenuService),
        __param(11, IContextMenuService)
    ], EditorGroupView);
    return EditorGroupView;
}(Themable));
export { EditorGroupView };
var EditorOpeningEvent = /** @class */ (function () {
    function EditorOpeningEvent(_group, _editor, _options) {
        this._group = _group;
        this._editor = _editor;
        this._options = _options;
    }
    Object.defineProperty(EditorOpeningEvent.prototype, "groupId", {
        get: function () {
            return this._group;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorOpeningEvent.prototype, "editor", {
        get: function () {
            return this._editor;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorOpeningEvent.prototype, "options", {
        get: function () {
            return this._options;
        },
        enumerable: true,
        configurable: true
    });
    EditorOpeningEvent.prototype.prevent = function (callback) {
        this.override = callback;
    };
    EditorOpeningEvent.prototype.isPrevented = function () {
        return this.override;
    };
    return EditorOpeningEvent;
}());
registerThemingParticipant(function (theme, collector, environment) {
    // Letterpress
    var letterpress = "resources/letterpress" + (theme.type === 'dark' ? '-dark' : theme.type === 'hc' ? '-hc' : '') + ".svg";
    collector.addRule("\n\t\t.monaco-workbench > .part.editor > .content .editor-group-container.empty .editor-group-letterpress {\n\t\t\tbackground-image: url('" + join(environment.appRoot, letterpress) + "')\n\t\t}\n\t");
    // Focused Empty Group Border
    var focusedEmptyGroupBorder = theme.getColor(EDITOR_GROUP_FOCUSED_EMPTY_BORDER);
    if (focusedEmptyGroupBorder) {
        collector.addRule("\n\t\t\t.monaco-workbench > .part.editor > .content:not(.empty) .editor-group-container.empty.active:focus {\n\t\t\t\toutline-width: 1px;\n\t\t\t\toutline-color: " + focusedEmptyGroupBorder + ";\n\t\t\t\toutline-offset: -2px;\n\t\t\t\toutline-style: solid;\n\t\t\t}\n\n\t\t\t.monaco-workbench > .part.editor > .content.empty .editor-group-container.empty.active:focus {\n\t\t\t\toutline: none; /* never show outline for empty group if it is the last */\n\t\t\t}\n\t\t");
    }
    else {
        collector.addRule("\n\t\t\t.monaco-workbench > .part.editor > .content .editor-group-container.empty.active:focus {\n\t\t\t\toutline: none; /* disable focus outline unless active empty group border is defined */\n\t\t\t}\n\t\t");
    }
});
