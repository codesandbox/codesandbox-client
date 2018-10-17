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
import { applyDragImage } from '../../../../base/browser/dnd';
import { addDisposableListener, EventType } from '../../../../base/browser/dom';
import { StandardMouseEvent } from '../../../../base/browser/mouseEvent';
import { ToolBar } from '../../../../base/browser/ui/toolbar/toolbar';
import * as arrays from '../../../../base/common/arrays';
import { dispose } from '../../../../base/common/lifecycle';
import './media/titlecontrol.css';
import { getCodeEditor } from '../../../../editor/browser/editorBrowser';
import { localize } from '../../../../nls';
import { createActionItem, fillInActionBarActions, fillInContextMenuActions } from '../../../../platform/actions/browser/menuItemActionItem';
import { ExecuteCommandAction, IMenuService, MenuId } from '../../../../platform/actions/common/actions';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding';
import { INotificationService } from '../../../../platform/notification/common/notification';
import { IQuickOpenService } from '../../../../platform/quickOpen/common/quickOpen';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry';
import { listActiveSelectionBackground, listActiveSelectionForeground } from '../../../../platform/theme/common/colorRegistry';
import { IThemeService, registerThemingParticipant } from '../../../../platform/theme/common/themeService';
import { prepareActions } from '../../actions';
import { DraggedEditorGroupIdentifier, fillResourceDataTransfers, LocalSelectionTransfer } from '../../dnd';
import { BaseEditor } from './baseEditor';
import { BreadcrumbsConfig } from './breadcrumbs';
import { BreadcrumbsControl } from './breadcrumbsControl';
import { EDITOR_TITLE_HEIGHT } from './editor';
import { EditorCommandsContextActionRunner, toResource } from '../../../common/editor';
import { ResourceContextKey } from '../../../common/resources';
import { Themable } from '../../../common/theme';
import { IExtensionService } from '../../../services/extensions/common/extensions';
var TitleControl = /** @class */ (function (_super) {
    __extends(TitleControl, _super);
    function TitleControl(parent, accessor, group, contextMenuService, instantiationService, contextKeyService, keybindingService, telemetryService, notificationService, menuService, quickOpenService, themeService, extensionService, configurationService) {
        var _this = _super.call(this, themeService) || this;
        _this.accessor = accessor;
        _this.group = group;
        _this.contextMenuService = contextMenuService;
        _this.instantiationService = instantiationService;
        _this.contextKeyService = contextKeyService;
        _this.keybindingService = keybindingService;
        _this.telemetryService = telemetryService;
        _this.notificationService = notificationService;
        _this.menuService = menuService;
        _this.quickOpenService = quickOpenService;
        _this.extensionService = extensionService;
        _this.configurationService = configurationService;
        _this.groupTransfer = LocalSelectionTransfer.getInstance();
        _this.editorTransfer = LocalSelectionTransfer.getInstance();
        _this.currentPrimaryEditorActionIds = [];
        _this.currentSecondaryEditorActionIds = [];
        _this.editorToolBarMenuDisposables = [];
        _this.resourceContext = instantiationService.createInstance(ResourceContextKey);
        _this.contextMenu = _this._register(_this.menuService.createMenu(MenuId.EditorTitleContext, _this.contextKeyService));
        _this.create(parent);
        _this.registerListeners();
        return _this;
    }
    TitleControl.prototype.registerListeners = function () {
        var _this = this;
        this._register(this.extensionService.onDidRegisterExtensions(function () { return _this.updateEditorActionsToolbar(); }));
    };
    TitleControl.prototype.createBreadcrumbsControl = function (container, options) {
        var _this = this;
        var config = this._register(BreadcrumbsConfig.IsEnabled.bindTo(this.configurationService));
        this._register(config.onDidChange(function () {
            var value = config.getValue();
            if (!value && _this.breadcrumbsControl) {
                _this.breadcrumbsControl.dispose();
                _this.breadcrumbsControl = undefined;
                _this.handleBreadcrumbsEnablementChange();
            }
            else if (value && !_this.breadcrumbsControl) {
                _this.breadcrumbsControl = _this.instantiationService.createInstance(BreadcrumbsControl, container, options, _this.group);
                _this.breadcrumbsControl.update();
                _this.handleBreadcrumbsEnablementChange();
            }
        }));
        if (config.getValue()) {
            this.breadcrumbsControl = this.instantiationService.createInstance(BreadcrumbsControl, container, options, this.group);
        }
    };
    TitleControl.prototype.createEditorActionsToolBar = function (container) {
        var _this = this;
        var context = { groupId: this.group.id };
        this.editorActionsToolbar = this._register(new ToolBar(container, this.contextMenuService, {
            actionItemProvider: function (action) { return _this.actionItemProvider(action); },
            orientation: 0 /* HORIZONTAL */,
            ariaLabel: localize('araLabelEditorActions', "Editor actions"),
            getKeyBinding: function (action) { return _this.getKeybinding(action); },
            actionRunner: this._register(new EditorCommandsContextActionRunner(context))
        }));
        // Context
        this.editorActionsToolbar.context = context;
        // Action Run Handling
        this._register(this.editorActionsToolbar.actionRunner.onDidRun(function (e) {
            // Notify for Error
            _this.notificationService.error(e.error);
            // Log in telemetry
            if (_this.telemetryService) {
                /* __GDPR__
                    "workbenchActionExecuted" : {
                        "id" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
                        "from": { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
                    }
                */
                _this.telemetryService.publicLog('workbenchActionExecuted', { id: e.action.id, from: 'editorPart' });
            }
        }));
    };
    TitleControl.prototype.actionItemProvider = function (action) {
        var activeControl = this.group.activeControl;
        // Check Active Editor
        var actionItem;
        if (activeControl instanceof BaseEditor) {
            actionItem = activeControl.getActionItem(action);
        }
        // Check extensions
        if (!actionItem) {
            actionItem = createActionItem(action, this.keybindingService, this.notificationService, this.contextMenuService);
        }
        return actionItem;
    };
    TitleControl.prototype.updateEditorActionsToolbar = function () {
        // Update Editor Actions Toolbar
        var _a = this.prepareEditorActions(this.getEditorActions()), primaryEditorActions = _a.primaryEditorActions, secondaryEditorActions = _a.secondaryEditorActions;
        // Only update if something actually has changed
        var primaryEditorActionIds = primaryEditorActions.map(function (a) { return a.id; });
        var secondaryEditorActionIds = secondaryEditorActions.map(function (a) { return a.id; });
        if (!arrays.equals(primaryEditorActionIds, this.currentPrimaryEditorActionIds) ||
            !arrays.equals(secondaryEditorActionIds, this.currentSecondaryEditorActionIds) ||
            primaryEditorActions.some(function (action) { return action instanceof ExecuteCommandAction; }) || // execute command actions can have the same ID but different arguments
            secondaryEditorActions.some(function (action) { return action instanceof ExecuteCommandAction; }) // see also https://github.com/Microsoft/vscode/issues/16298
        ) {
            this.editorActionsToolbar.setActions(primaryEditorActions, secondaryEditorActions)();
            this.currentPrimaryEditorActionIds = primaryEditorActionIds;
            this.currentSecondaryEditorActionIds = secondaryEditorActionIds;
        }
    };
    TitleControl.prototype.prepareEditorActions = function (editorActions) {
        var primaryEditorActions;
        var secondaryEditorActions;
        // Primary actions only for the active group
        if (this.accessor.activeGroup === this.group) {
            primaryEditorActions = prepareActions(editorActions.primary);
        }
        else {
            primaryEditorActions = [];
        }
        // Secondary actions for all groups
        secondaryEditorActions = prepareActions(editorActions.secondary);
        return { primaryEditorActions: primaryEditorActions, secondaryEditorActions: secondaryEditorActions };
    };
    TitleControl.prototype.getEditorActions = function () {
        var _this = this;
        var primary = [];
        var secondary = [];
        // Dispose previous listeners
        this.editorToolBarMenuDisposables = dispose(this.editorToolBarMenuDisposables);
        // Update the resource context
        this.resourceContext.set(toResource(this.group.activeEditor, { supportSideBySide: true }));
        // Editor actions require the editor control to be there, so we retrieve it via service
        var activeControl = this.group.activeControl;
        if (activeControl instanceof BaseEditor) {
            var codeEditor = getCodeEditor(activeControl.getControl());
            var scopedContextKeyService = codeEditor && codeEditor.invokeWithinContext(function (accessor) { return accessor.get(IContextKeyService); }) || this.contextKeyService;
            var titleBarMenu = this.menuService.createMenu(MenuId.EditorTitle, scopedContextKeyService);
            this.editorToolBarMenuDisposables.push(titleBarMenu);
            this.editorToolBarMenuDisposables.push(titleBarMenu.onDidChange(function () {
                _this.updateEditorActionsToolbar(); // Update editor toolbar whenever contributed actions change
            }));
            fillInActionBarActions(titleBarMenu, { arg: this.resourceContext.get(), shouldForwardArgs: true }, { primary: primary, secondary: secondary });
        }
        return { primary: primary, secondary: secondary };
    };
    TitleControl.prototype.clearEditorActionsToolbar = function () {
        this.editorActionsToolbar.setActions([], [])();
        this.currentPrimaryEditorActionIds = [];
        this.currentSecondaryEditorActionIds = [];
    };
    TitleControl.prototype.enableGroupDragging = function (element) {
        var _this = this;
        // Drag start
        this._register(addDisposableListener(element, EventType.DRAG_START, function (e) {
            if (e.target !== element) {
                return; // only if originating from tabs container
            }
            // Set editor group as transfer
            _this.groupTransfer.setData([new DraggedEditorGroupIdentifier(_this.group.id)], DraggedEditorGroupIdentifier.prototype);
            e.dataTransfer.effectAllowed = 'copyMove';
            // If tabs are disabled, treat dragging as if an editor tab was dragged
            if (!_this.accessor.partOptions.showTabs) {
                var resource = toResource(_this.group.activeEditor, { supportSideBySide: true });
                if (resource) {
                    _this.instantiationService.invokeFunction(fillResourceDataTransfers, [resource], e);
                }
            }
            // Drag Image
            var label = _this.group.activeEditor.getName();
            if (_this.accessor.partOptions.showTabs && _this.group.count > 1) {
                label = localize('draggedEditorGroup', "{0} (+{1})", label, _this.group.count - 1);
            }
            applyDragImage(e, label, 'monaco-editor-group-drag-image');
        }));
        // Drag end
        this._register(addDisposableListener(element, EventType.DRAG_END, function () {
            _this.groupTransfer.clearData(DraggedEditorGroupIdentifier.prototype);
        }));
    };
    TitleControl.prototype.onContextMenu = function (editor, e, node) {
        var _this = this;
        // Update the resource context
        var currentContext = this.resourceContext.get();
        this.resourceContext.set(toResource(editor, { supportSideBySide: true }));
        // Find target anchor
        var anchor = node;
        if (e instanceof MouseEvent) {
            var event_1 = new StandardMouseEvent(e);
            anchor = { x: event_1.posx, y: event_1.posy };
        }
        // Fill in contributed actions
        var actions = [];
        fillInContextMenuActions(this.contextMenu, { shouldForwardArgs: true, arg: this.resourceContext.get() }, actions, this.contextMenuService);
        // Show it
        this.contextMenuService.showContextMenu({
            getAnchor: function () { return anchor; },
            getActions: function () { return Promise.resolve(actions); },
            getActionsContext: function () { return ({ groupId: _this.group.id, editorIndex: _this.group.getIndexOfEditor(editor) }); },
            getKeyBinding: function (action) { return _this.getKeybinding(action); },
            onHide: function () {
                // restore previous context
                _this.resourceContext.set(currentContext);
                // restore focus to active group
                _this.accessor.activeGroup.focus();
            }
        });
    };
    TitleControl.prototype.getKeybinding = function (action) {
        return this.keybindingService.lookupKeybinding(action.id);
    };
    TitleControl.prototype.getKeybindingLabel = function (action) {
        var keybinding = this.getKeybinding(action);
        return keybinding ? keybinding.getLabel() : void 0;
    };
    TitleControl.prototype.layout = function (dimension) {
        // Optionally implemented in subclasses
        if (this.breadcrumbsControl) {
            this.breadcrumbsControl.layout(undefined);
        }
    };
    TitleControl.prototype.getPreferredHeight = function () {
        return EDITOR_TITLE_HEIGHT + (this.breadcrumbsControl && !this.breadcrumbsControl.isHidden() ? BreadcrumbsControl.HEIGHT : 0);
    };
    TitleControl.prototype.dispose = function () {
        this.breadcrumbsControl = dispose(this.breadcrumbsControl);
        this.editorToolBarMenuDisposables = dispose(this.editorToolBarMenuDisposables);
        _super.prototype.dispose.call(this);
    };
    TitleControl = __decorate([
        __param(3, IContextMenuService),
        __param(4, IInstantiationService),
        __param(5, IContextKeyService),
        __param(6, IKeybindingService),
        __param(7, ITelemetryService),
        __param(8, INotificationService),
        __param(9, IMenuService),
        __param(10, IQuickOpenService),
        __param(11, IThemeService),
        __param(12, IExtensionService),
        __param(13, IConfigurationService)
    ], TitleControl);
    return TitleControl;
}(Themable));
export { TitleControl };
registerThemingParticipant(function (theme, collector) {
    // Drag Feedback
    var dragImageBackground = theme.getColor(listActiveSelectionBackground);
    var dragImageForeground = theme.getColor(listActiveSelectionForeground);
    collector.addRule("\n\t\t.monaco-editor-group-drag-image {\n\t\t\tbackground: " + dragImageBackground + ";\n\t\t\tcolor: " + dragImageForeground + ";\n\t\t}\n\t");
});
