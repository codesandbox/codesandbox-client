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
import './media/editordroptarget.css';
import { LocalSelectionTransfer, DraggedEditorIdentifier, ResourcesDropHandler, DraggedEditorGroupIdentifier, DragAndDropObserver } from '../../dnd';
import { addDisposableListener, EventType, EventHelper, isAncestor, toggleClass, addClass, removeClass } from '../../../../base/browser/dom';
import { EDITOR_TITLE_HEIGHT, getActiveTextEditorOptions } from './editor';
import { EDITOR_DRAG_AND_DROP_BACKGROUND, Themable } from '../../../common/theme';
import { IThemeService } from '../../../../platform/theme/common/themeService';
import { activeContrastBorder } from '../../../../platform/theme/common/colorRegistry';
import { EditorOptions } from '../../../common/editor';
import { isMacintosh } from '../../../../base/common/platform';
import { toDisposable } from '../../../../base/common/lifecycle';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation';
import { RunOnceScheduler } from '../../../../base/common/async';
var DropOverlay = /** @class */ (function (_super) {
    __extends(DropOverlay, _super);
    function DropOverlay(accessor, groupView, themeService, instantiationService) {
        var _this = _super.call(this, themeService) || this;
        _this.accessor = accessor;
        _this.groupView = groupView;
        _this.instantiationService = instantiationService;
        _this.editorTransfer = LocalSelectionTransfer.getInstance();
        _this.groupTransfer = LocalSelectionTransfer.getInstance();
        _this.cleanupOverlayScheduler = _this._register(new RunOnceScheduler(function () { return _this.dispose(); }, 300));
        _this.create();
        return _this;
    }
    Object.defineProperty(DropOverlay.prototype, "disposed", {
        get: function () {
            return this._disposed;
        },
        enumerable: true,
        configurable: true
    });
    DropOverlay.prototype.create = function () {
        var _this = this;
        var overlayOffsetHeight = this.getOverlayOffsetHeight();
        // Container
        this.container = document.createElement('div');
        this.container.id = DropOverlay.OVERLAY_ID;
        this.container.style.top = overlayOffsetHeight + "px";
        // Parent
        this.groupView.element.appendChild(this.container);
        addClass(this.groupView.element, 'dragged-over');
        this._register(toDisposable(function () {
            _this.groupView.element.removeChild(_this.container);
            removeClass(_this.groupView.element, 'dragged-over');
        }));
        // Overlay
        this.overlay = document.createElement('div');
        addClass(this.overlay, 'editor-group-overlay-indicator');
        this.container.appendChild(this.overlay);
        // Overlay Event Handling
        this.registerListeners();
        // Styles
        this.updateStyles();
    };
    DropOverlay.prototype.updateStyles = function () {
        // Overlay drop background
        this.overlay.style.backgroundColor = this.getColor(EDITOR_DRAG_AND_DROP_BACKGROUND);
        // Overlay contrast border (if any)
        var activeContrastBorderColor = this.getColor(activeContrastBorder);
        this.overlay.style.outlineColor = activeContrastBorderColor;
        this.overlay.style.outlineOffset = activeContrastBorderColor ? '-2px' : null;
        this.overlay.style.outlineStyle = activeContrastBorderColor ? 'dashed' : null;
        this.overlay.style.outlineWidth = activeContrastBorderColor ? '2px' : null;
    };
    DropOverlay.prototype.registerListeners = function () {
        var _this = this;
        this._register(new DragAndDropObserver(this.container, {
            onDragEnter: function (e) { return void 0; },
            onDragOver: function (e) {
                var isDraggingGroup = _this.groupTransfer.hasData(DraggedEditorGroupIdentifier.prototype);
                var isDraggingEditor = _this.editorTransfer.hasData(DraggedEditorIdentifier.prototype);
                // Update the dropEffect to "copy" if there is no local data to be dragged because
                // in that case we can only copy the data into and not move it from its source
                if (!isDraggingEditor && !isDraggingGroup) {
                    e.dataTransfer.dropEffect = 'copy';
                }
                // Find out if operation is valid
                var isCopy = isDraggingGroup ? _this.isCopyOperation(e) : isDraggingEditor ? _this.isCopyOperation(e, _this.editorTransfer.getData(DraggedEditorIdentifier.prototype)[0].identifier) : true;
                if (!isCopy) {
                    var sourceGroupView = _this.findSourceGroupView();
                    if (sourceGroupView === _this.groupView) {
                        if (isDraggingGroup || (isDraggingEditor && sourceGroupView.count < 2)) {
                            _this.hideOverlay();
                            return; // do not allow to drop group/editor on itself if this results in an empty group
                        }
                    }
                }
                // Position overlay
                _this.positionOverlay(e.offsetX, e.offsetY, isDraggingGroup);
                // Make sure to stop any running cleanup scheduler to remove the overlay
                if (_this.cleanupOverlayScheduler.isScheduled()) {
                    _this.cleanupOverlayScheduler.cancel();
                }
            },
            onDragLeave: function (e) { return _this.dispose(); },
            onDragEnd: function (e) { return _this.dispose(); },
            onDrop: function (e) {
                EventHelper.stop(e, true);
                // Dispose overlay
                _this.dispose();
                // Handle drop if we have a valid operation
                if (_this.currentDropOperation) {
                    _this.handleDrop(e, _this.currentDropOperation.splitDirection);
                }
            }
        }));
        this._register(addDisposableListener(this.container, EventType.MOUSE_OVER, function () {
            // Under some circumstances we have seen reports where the drop overlay is not being
            // cleaned up and as such the editor area remains under the overlay so that you cannot
            // type into the editor anymore. This seems related to using VMs and DND via host and
            // guest OS, though some users also saw it without VMs.
            // To protect against this issue we always destroy the overlay as soon as we detect a
            // mouse event over it. The delay is used to guarantee we are not interfering with the
            // actual DROP event that can also trigger a mouse over event.
            if (!_this.cleanupOverlayScheduler.isScheduled()) {
                _this.cleanupOverlayScheduler.schedule();
            }
        }));
    };
    DropOverlay.prototype.findSourceGroupView = function () {
        // Check for group transfer
        if (this.groupTransfer.hasData(DraggedEditorGroupIdentifier.prototype)) {
            return this.accessor.getGroup(this.groupTransfer.getData(DraggedEditorGroupIdentifier.prototype)[0].identifier);
        }
        // Check for editor transfer
        else if (this.editorTransfer.hasData(DraggedEditorIdentifier.prototype)) {
            return this.accessor.getGroup(this.editorTransfer.getData(DraggedEditorIdentifier.prototype)[0].identifier.groupId);
        }
        return void 0;
    };
    DropOverlay.prototype.handleDrop = function (event, splitDirection) {
        var _this = this;
        // Determine target group
        var ensureTargetGroup = function () {
            var targetGroup;
            if (typeof splitDirection === 'number') {
                targetGroup = _this.accessor.addGroup(_this.groupView, splitDirection);
            }
            else {
                targetGroup = _this.groupView;
            }
            return targetGroup;
        };
        // Check for group transfer
        if (this.groupTransfer.hasData(DraggedEditorGroupIdentifier.prototype)) {
            var draggedEditorGroup = this.groupTransfer.getData(DraggedEditorGroupIdentifier.prototype)[0].identifier;
            // Return if the drop is a no-op
            var sourceGroup = this.accessor.getGroup(draggedEditorGroup);
            if (typeof splitDirection !== 'number' && sourceGroup === this.groupView) {
                return;
            }
            // Split to new group
            var targetGroup = void 0;
            if (typeof splitDirection === 'number') {
                if (this.isCopyOperation(event)) {
                    targetGroup = this.accessor.copyGroup(sourceGroup, this.groupView, splitDirection);
                }
                else {
                    targetGroup = this.accessor.moveGroup(sourceGroup, this.groupView, splitDirection);
                }
            }
            // Merge into existing group
            else {
                if (this.isCopyOperation(event)) {
                    targetGroup = this.accessor.mergeGroup(sourceGroup, this.groupView, { mode: 0 /* COPY_EDITORS */ });
                }
                else {
                    targetGroup = this.accessor.mergeGroup(sourceGroup, this.groupView);
                }
            }
            this.accessor.activateGroup(targetGroup);
            this.groupTransfer.clearData(DraggedEditorGroupIdentifier.prototype);
        }
        // Check for editor transfer
        else if (this.editorTransfer.hasData(DraggedEditorIdentifier.prototype)) {
            var draggedEditor = this.editorTransfer.getData(DraggedEditorIdentifier.prototype)[0].identifier;
            var targetGroup = ensureTargetGroup();
            // Return if the drop is a no-op
            var sourceGroup = this.accessor.getGroup(draggedEditor.groupId);
            if (sourceGroup === targetGroup) {
                return;
            }
            // Open in target group
            var options = getActiveTextEditorOptions(sourceGroup, draggedEditor.editor, EditorOptions.create({ pinned: true }));
            targetGroup.openEditor(draggedEditor.editor, options);
            // Ensure target has focus
            targetGroup.focus();
            // Close in source group unless we copy
            var copyEditor = this.isCopyOperation(event, draggedEditor);
            if (!copyEditor) {
                sourceGroup.closeEditor(draggedEditor.editor);
            }
            this.editorTransfer.clearData(DraggedEditorIdentifier.prototype);
        }
        // Check for URI transfer
        else {
            var dropHandler = this.instantiationService.createInstance(ResourcesDropHandler, { allowWorkspaceOpen: true /* open workspace instead of file if dropped */ });
            dropHandler.handleDrop(event, function () { return ensureTargetGroup(); }, function (targetGroup) { return targetGroup.focus(); });
        }
    };
    DropOverlay.prototype.isCopyOperation = function (e, draggedEditor) {
        if (draggedEditor && !draggedEditor.editor.supportsSplitEditor()) {
            return false;
        }
        return (e.ctrlKey && !isMacintosh) || (e.altKey && isMacintosh);
    };
    DropOverlay.prototype.positionOverlay = function (mousePosX, mousePosY, isDraggingGroup) {
        var _this = this;
        var preferSplitVertically = this.accessor.partOptions.openSideBySideDirection === 'right';
        var editorControlWidth = this.groupView.element.clientWidth;
        var editorControlHeight = this.groupView.element.clientHeight - this.getOverlayOffsetHeight();
        var edgeWidthThresholdFactor;
        if (isDraggingGroup) {
            edgeWidthThresholdFactor = preferSplitVertically ? 0.3 : 0.1; // give larger threshold when dragging group depending on preferred split direction
        }
        else {
            edgeWidthThresholdFactor = 0.1; // 10% threshold to split if dragging editors
        }
        var edgeHeightThresholdFactor;
        if (isDraggingGroup) {
            edgeHeightThresholdFactor = preferSplitVertically ? 0.1 : 0.3; // give larger threshold when dragging group depending on preferred split direction
        }
        else {
            edgeHeightThresholdFactor = 0.1; // 10% threshold to split if dragging editors
        }
        var edgeWidthThreshold = editorControlWidth * edgeWidthThresholdFactor;
        var edgeHeightThreshold = editorControlHeight * edgeHeightThresholdFactor;
        var splitWidthThreshold = editorControlWidth / 3; // offer to split left/right at 33%
        var splitHeightThreshold = editorControlHeight / 3; // offer to split up/down at 33%
        // Enable to debug the drop threshold square
        // let child = this.overlay.children.item(0) as HTMLElement || this.overlay.appendChild(document.createElement('div'));
        // child.style.backgroundColor = 'red';
        // child.style.position = 'absolute';
        // child.style.width = (groupViewWidth - (2 * edgeWidthThreshold)) + 'px';
        // child.style.height = (groupViewHeight - (2 * edgeHeightThreshold)) + 'px';
        // child.style.left = edgeWidthThreshold + 'px';
        // child.style.top = edgeHeightThreshold + 'px';
        // No split if mouse is above certain threshold in the center of the view
        var splitDirection;
        if (mousePosX > edgeWidthThreshold && mousePosX < editorControlWidth - edgeWidthThreshold &&
            mousePosY > edgeHeightThreshold && mousePosY < editorControlHeight - edgeHeightThreshold) {
            splitDirection = void 0;
        }
        // Offer to split otherwise
        else {
            // User prefers to split vertically: offer a larger hitzone
            // for this direction like so:
            // ----------------------------------------------
            // |		|		SPLIT UP		|			|
            // | SPLIT 	|-----------------------|	SPLIT	|
            // |		|		  MERGE			|			|
            // | LEFT	|-----------------------|	RIGHT	|
            // |		|		SPLIT DOWN		|			|
            // ----------------------------------------------
            if (preferSplitVertically) {
                if (mousePosX < splitWidthThreshold) {
                    splitDirection = 2 /* LEFT */;
                }
                else if (mousePosX > splitWidthThreshold * 2) {
                    splitDirection = 3 /* RIGHT */;
                }
                else if (mousePosY < editorControlHeight / 2) {
                    splitDirection = 0 /* UP */;
                }
                else {
                    splitDirection = 1 /* DOWN */;
                }
            }
            // User prefers to split horizontally: offer a larger hitzone
            // for this direction like so:
            // ----------------------------------------------
            // |				SPLIT UP					|
            // |--------------------------------------------|
            // |  SPLIT LEFT  |	   MERGE	|  SPLIT RIGHT  |
            // |--------------------------------------------|
            // |				SPLIT DOWN					|
            // ----------------------------------------------
            else {
                if (mousePosY < splitHeightThreshold) {
                    splitDirection = 0 /* UP */;
                }
                else if (mousePosY > splitHeightThreshold * 2) {
                    splitDirection = 1 /* DOWN */;
                }
                else if (mousePosX < editorControlWidth / 2) {
                    splitDirection = 2 /* LEFT */;
                }
                else {
                    splitDirection = 3 /* RIGHT */;
                }
            }
        }
        // Draw overlay based on split direction
        switch (splitDirection) {
            case 0 /* UP */:
                this.doPositionOverlay({ top: '0', left: '0', width: '100%', height: '50%' });
                break;
            case 1 /* DOWN */:
                this.doPositionOverlay({ top: '50%', left: '0', width: '100%', height: '50%' });
                break;
            case 2 /* LEFT */:
                this.doPositionOverlay({ top: '0', left: '0', width: '50%', height: '100%' });
                break;
            case 3 /* RIGHT */:
                this.doPositionOverlay({ top: '0', left: '50%', width: '50%', height: '100%' });
                break;
            default:
                this.doPositionOverlay({ top: '0', left: '0', width: '100%', height: '100%' });
        }
        // Make sure the overlay is visible now
        this.overlay.style.opacity = '1';
        // Enable transition after a timeout to prevent initial animation
        setTimeout(function () { return addClass(_this.overlay, 'overlay-move-transition'); }, 0);
        // Remember as current split direction
        this.currentDropOperation = { splitDirection: splitDirection };
    };
    DropOverlay.prototype.doPositionOverlay = function (options) {
        // Container
        var offsetHeight = this.getOverlayOffsetHeight();
        if (offsetHeight) {
            this.container.style.height = "calc(100% - " + offsetHeight + "px)";
        }
        else {
            this.container.style.height = '100%';
        }
        // Overlay
        this.overlay.style.top = options.top;
        this.overlay.style.left = options.left;
        this.overlay.style.width = options.width;
        this.overlay.style.height = options.height;
    };
    DropOverlay.prototype.getOverlayOffsetHeight = function () {
        if (!this.groupView.isEmpty() && this.accessor.partOptions.showTabs) {
            return EDITOR_TITLE_HEIGHT; // show overlay below title if group shows tabs
        }
        return 0;
    };
    DropOverlay.prototype.hideOverlay = function () {
        // Reset overlay
        this.doPositionOverlay({ top: '0', left: '0', width: '100%', height: '100%' });
        this.overlay.style.opacity = '0';
        removeClass(this.overlay, 'overlay-move-transition');
        // Reset current operation
        this.currentDropOperation = void 0;
    };
    DropOverlay.prototype.contains = function (element) {
        return element === this.container || element === this.overlay;
    };
    DropOverlay.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this._disposed = true;
    };
    DropOverlay.OVERLAY_ID = 'monaco-workbench-editor-drop-overlay';
    return DropOverlay;
}(Themable));
var EditorDropTarget = /** @class */ (function (_super) {
    __extends(EditorDropTarget, _super);
    function EditorDropTarget(accessor, container, themeService, instantiationService) {
        var _this = _super.call(this, themeService) || this;
        _this.accessor = accessor;
        _this.container = container;
        _this.instantiationService = instantiationService;
        _this.counter = 0;
        _this.editorTransfer = LocalSelectionTransfer.getInstance();
        _this.groupTransfer = LocalSelectionTransfer.getInstance();
        _this.registerListeners();
        return _this;
    }
    Object.defineProperty(EditorDropTarget.prototype, "overlay", {
        get: function () {
            if (this._overlay && !this._overlay.disposed) {
                return this._overlay;
            }
            return void 0;
        },
        enumerable: true,
        configurable: true
    });
    EditorDropTarget.prototype.registerListeners = function () {
        var _this = this;
        this._register(addDisposableListener(this.container, EventType.DRAG_ENTER, function (e) { return _this.onDragEnter(e); }));
        this._register(addDisposableListener(this.container, EventType.DRAG_LEAVE, function () { return _this.onDragLeave(); }));
        [this.container, window].forEach(function (node) { return _this._register(addDisposableListener(node, EventType.DRAG_END, function () { return _this.onDragEnd(); })); });
    };
    EditorDropTarget.prototype.onDragEnter = function (event) {
        this.counter++;
        // Validate transfer
        if (!this.editorTransfer.hasData(DraggedEditorIdentifier.prototype) &&
            !this.groupTransfer.hasData(DraggedEditorGroupIdentifier.prototype) &&
            !event.dataTransfer.types.length // see https://github.com/Microsoft/vscode/issues/25789
        ) {
            event.dataTransfer.dropEffect = 'none';
            return; // unsupported transfer
        }
        // Signal DND start
        this.updateContainer(true);
        var target = event.target;
        if (target) {
            // Somehow we managed to move the mouse quickly out of the current overlay, so destroy it
            if (this.overlay && !this.overlay.contains(target)) {
                this.disposeOverlay();
            }
            // Create overlay over target
            if (!this.overlay) {
                var targetGroupView = this.findTargetGroupView(target);
                if (targetGroupView) {
                    this._overlay = new DropOverlay(this.accessor, targetGroupView, this.themeService, this.instantiationService);
                }
            }
        }
    };
    EditorDropTarget.prototype.onDragLeave = function () {
        this.counter--;
        if (this.counter === 0) {
            this.updateContainer(false);
        }
    };
    EditorDropTarget.prototype.onDragEnd = function () {
        this.counter = 0;
        this.updateContainer(false);
        this.disposeOverlay();
    };
    EditorDropTarget.prototype.findTargetGroupView = function (child) {
        var groups = this.accessor.groups;
        for (var i = 0; i < groups.length; i++) {
            var groupView = groups[i];
            if (isAncestor(child, groupView.element)) {
                return groupView;
            }
        }
        return void 0;
    };
    EditorDropTarget.prototype.updateContainer = function (isDraggedOver) {
        toggleClass(this.container, 'dragged-over', isDraggedOver);
    };
    EditorDropTarget.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this.disposeOverlay();
    };
    EditorDropTarget.prototype.disposeOverlay = function () {
        if (this.overlay) {
            this.overlay.dispose();
            this._overlay = void 0;
        }
    };
    EditorDropTarget = __decorate([
        __param(2, IThemeService),
        __param(3, IInstantiationService)
    ], EditorDropTarget);
    return EditorDropTarget;
}(Themable));
export { EditorDropTarget };
