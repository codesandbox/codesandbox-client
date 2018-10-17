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
import './media/notabstitlecontrol.css';
import { toResource } from '../../../common/editor.js';
import { TitleControl } from './titleControl.js';
import { ResourceLabel } from '../../labels.js';
import { TAB_ACTIVE_FOREGROUND, TAB_UNFOCUSED_ACTIVE_FOREGROUND } from '../../../common/theme.js';
import { EventType as TouchEventType, Gesture } from '../../../../base/browser/touch.js';
import { addDisposableListener, EventType, addClass, EventHelper, removeClass, toggleClass } from '../../../../base/browser/dom.js';
import { EDITOR_TITLE_HEIGHT } from './editor.js';
import { CLOSE_EDITOR_COMMAND_ID } from './editorCommands.js';
import { Color } from '../../../../base/common/color.js';
var NoTabsTitleControl = /** @class */ (function (_super) {
    __extends(NoTabsTitleControl, _super);
    function NoTabsTitleControl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.activeLabel = Object.create(null);
        return _this;
    }
    NoTabsTitleControl.prototype.create = function (parent) {
        var _this = this;
        this.titleContainer = parent;
        this.titleContainer.draggable = true;
        //Container listeners
        this.registerContainerListeners();
        // Gesture Support
        Gesture.addTarget(this.titleContainer);
        var labelContainer = document.createElement('div');
        addClass(labelContainer, 'label-container');
        this.titleContainer.appendChild(labelContainer);
        // Editor Label
        this.editorLabel = this._register(this.instantiationService.createInstance(ResourceLabel, labelContainer, void 0));
        this._register(this.editorLabel.onClick(function (e) { return _this.onTitleLabelClick(e); }));
        // Breadcrumbs
        this.createBreadcrumbsControl(labelContainer, { showFileIcons: false, showSymbolIcons: true, showDecorationColors: false, breadcrumbsBackground: function () { return Color.transparent; } });
        toggleClass(this.titleContainer, 'breadcrumbs', Boolean(this.breadcrumbsControl));
        this.toDispose.push({ dispose: function () { return removeClass(_this.titleContainer, 'breadcrumbs'); } }); // import to remove because the container is a shared dom node
        // Right Actions Container
        var actionsContainer = document.createElement('div');
        addClass(actionsContainer, 'title-actions');
        this.titleContainer.appendChild(actionsContainer);
        // Editor actions toolbar
        this.createEditorActionsToolBar(actionsContainer);
    };
    NoTabsTitleControl.prototype.registerContainerListeners = function () {
        var _this = this;
        // Group dragging
        this.enableGroupDragging(this.titleContainer);
        // Pin on double click
        this._register(addDisposableListener(this.titleContainer, EventType.DBLCLICK, function (e) { return _this.onTitleDoubleClick(e); }));
        // Detect mouse click
        this._register(addDisposableListener(this.titleContainer, EventType.CLICK, function (e) { return _this.onTitleClick(e); }));
        // Detect touch
        this._register(addDisposableListener(this.titleContainer, TouchEventType.Tap, function (e) { return _this.onTitleClick(e); }));
        // Context Menu
        this._register(addDisposableListener(this.titleContainer, EventType.CONTEXT_MENU, function (e) { return _this.onContextMenu(_this.group.activeEditor, e, _this.titleContainer); }));
        this._register(addDisposableListener(this.titleContainer, TouchEventType.Contextmenu, function (e) { return _this.onContextMenu(_this.group.activeEditor, e, _this.titleContainer); }));
    };
    NoTabsTitleControl.prototype.onTitleLabelClick = function (e) {
        var _this = this;
        EventHelper.stop(e, false);
        // delayed to let the onTitleClick() come first which can cause a focus change which can close quick open
        setTimeout(function () { return _this.quickOpenService.show(); });
    };
    NoTabsTitleControl.prototype.onTitleDoubleClick = function (e) {
        EventHelper.stop(e);
        this.group.pinEditor();
    };
    NoTabsTitleControl.prototype.onTitleClick = function (e) {
        // Close editor on middle mouse click
        if (e instanceof MouseEvent && e.button === 1 /* Middle Button */) {
            EventHelper.stop(e, true /* for https://github.com/Microsoft/vscode/issues/56715 */);
            this.group.closeEditor(this.group.activeEditor);
        }
    };
    NoTabsTitleControl.prototype.getPreferredHeight = function () {
        return EDITOR_TITLE_HEIGHT;
    };
    NoTabsTitleControl.prototype.openEditor = function (editor) {
        var _this = this;
        var activeEditorChanged = this.ifActiveEditorChanged(function () { return _this.redraw(); });
        if (!activeEditorChanged) {
            this.ifActiveEditorPropertiesChanged(function () { return _this.redraw(); });
        }
    };
    NoTabsTitleControl.prototype.closeEditor = function (editor) {
        var _this = this;
        this.ifActiveEditorChanged(function () { return _this.redraw(); });
    };
    NoTabsTitleControl.prototype.closeEditors = function (editors) {
        var _this = this;
        this.ifActiveEditorChanged(function () { return _this.redraw(); });
    };
    NoTabsTitleControl.prototype.closeAllEditors = function () {
        this.redraw();
    };
    NoTabsTitleControl.prototype.moveEditor = function (editor, fromIndex, targetIndex) {
        var _this = this;
        this.ifActiveEditorChanged(function () { return _this.redraw(); });
    };
    NoTabsTitleControl.prototype.pinEditor = function (editor) {
        var _this = this;
        this.ifEditorIsActive(editor, function () { return _this.redraw(); });
    };
    NoTabsTitleControl.prototype.setActive = function (isActive) {
        this.redraw();
    };
    NoTabsTitleControl.prototype.updateEditorLabel = function (editor) {
        var _this = this;
        this.ifEditorIsActive(editor, function () { return _this.redraw(); });
    };
    NoTabsTitleControl.prototype.updateEditorDirty = function (editor) {
        var _this = this;
        this.ifEditorIsActive(editor, function () {
            if (editor.isDirty()) {
                addClass(_this.titleContainer, 'dirty');
            }
            else {
                removeClass(_this.titleContainer, 'dirty');
            }
        });
    };
    NoTabsTitleControl.prototype.updateOptions = function (oldOptions, newOptions) {
        if (oldOptions.labelFormat !== newOptions.labelFormat) {
            this.redraw();
        }
    };
    NoTabsTitleControl.prototype.updateStyles = function () {
        this.redraw();
    };
    NoTabsTitleControl.prototype.handleBreadcrumbsEnablementChange = function () {
        toggleClass(this.titleContainer, 'breadcrumbs', Boolean(this.breadcrumbsControl));
        this.redraw();
    };
    NoTabsTitleControl.prototype.ifActiveEditorChanged = function (fn) {
        if (!this.activeLabel.editor && this.group.activeEditor || // active editor changed from null => editor
            this.activeLabel.editor && !this.group.activeEditor || // active editor changed from editor => null
            !this.group.isActive(this.activeLabel.editor) // active editor changed from editorA => editorB
        ) {
            fn();
            return true;
        }
        return false;
    };
    NoTabsTitleControl.prototype.ifActiveEditorPropertiesChanged = function (fn) {
        if (!this.activeLabel.editor || !this.group.activeEditor) {
            return; // need an active editor to check for properties changed
        }
        if (this.activeLabel.pinned !== this.group.isPinned(this.group.activeEditor)) {
            fn(); // only run if pinned state has changed
        }
    };
    NoTabsTitleControl.prototype.ifEditorIsActive = function (editor, fn) {
        if (this.group.isActive(editor)) {
            fn(); // only run if editor is current active
        }
    };
    NoTabsTitleControl.prototype.redraw = function () {
        var editor = this.group.activeEditor;
        var isEditorPinned = this.group.isPinned(this.group.activeEditor);
        var isGroupActive = this.accessor.activeGroup === this.group;
        this.activeLabel = { editor: editor, pinned: isEditorPinned };
        // Update Breadcrumbs
        if (this.breadcrumbsControl) {
            if (isGroupActive) {
                this.breadcrumbsControl.update();
                toggleClass(this.breadcrumbsControl.domNode, 'preview', !isEditorPinned);
            }
            else {
                this.breadcrumbsControl.hide();
            }
        }
        // Clear if there is no editor
        if (!editor) {
            removeClass(this.titleContainer, 'dirty');
            this.editorLabel.clear();
            this.clearEditorActionsToolbar();
        }
        // Otherwise render it
        else {
            // Dirty state
            this.updateEditorDirty(editor);
            // Editor Label
            var resource = toResource(editor, { supportSideBySide: true });
            var name_1 = editor.getName() || '';
            var labelFormat = this.accessor.partOptions.labelFormat;
            var description = void 0;
            if (this.breadcrumbsControl && !this.breadcrumbsControl.isHidden()) {
                description = ''; // hide description when showing breadcrumbs
            }
            else if (labelFormat === 'default' && !isGroupActive) {
                description = ''; // hide description when group is not active and style is 'default'
            }
            else {
                description = editor.getDescription(this.getVerbosity(labelFormat)) || '';
            }
            var title = editor.getTitle(2 /* LONG */);
            if (description === title) {
                title = ''; // dont repeat what is already shown
            }
            this.editorLabel.setLabel({ name: name_1, description: description, resource: resource }, { title: title, italic: !isEditorPinned, extraClasses: ['no-tabs', 'title-label'] });
            if (isGroupActive) {
                this.editorLabel.element.style.color = this.getColor(TAB_ACTIVE_FOREGROUND);
            }
            else {
                this.editorLabel.element.style.color = this.getColor(TAB_UNFOCUSED_ACTIVE_FOREGROUND);
            }
            // Update Editor Actions Toolbar
            this.updateEditorActionsToolbar();
        }
    };
    NoTabsTitleControl.prototype.getVerbosity = function (style) {
        switch (style) {
            case 'short': return 0 /* SHORT */;
            case 'long': return 2 /* LONG */;
            default: return 1 /* MEDIUM */;
        }
    };
    NoTabsTitleControl.prototype.prepareEditorActions = function (editorActions) {
        var isGroupActive = this.accessor.activeGroup === this.group;
        // Group active: show all actions
        if (isGroupActive) {
            return _super.prototype.prepareEditorActions.call(this, editorActions);
        }
        // Group inactive: only show close action
        return { primaryEditorActions: editorActions.primary.filter(function (action) { return action.id === CLOSE_EDITOR_COMMAND_ID; }), secondaryEditorActions: [] };
    };
    return NoTabsTitleControl;
}(TitleControl));
export { NoTabsTitleControl };
