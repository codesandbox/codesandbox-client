/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Disposable } from '../../../base/common/lifecycle.js';
import * as platform from '../../../base/common/platform.js';
import * as browser from '../../../base/browser/browser.js';
import * as dom from '../../../base/browser/dom.js';
import { Position } from '../../common/core/position.js';
import { Selection } from '../../common/core/selection.js';
import { ViewEventHandler } from '../../common/viewModel/viewEventHandler.js';
import { MouseTarget, MouseTargetFactory, HitTestContext } from './mouseTarget.js';
import * as editorBrowser from '../editorBrowser.js';
import { TimeoutTimer, RunOnceScheduler } from '../../../base/common/async.js';
import { EditorMouseEventFactory, GlobalEditorMouseMoveMonitor, createEditorPagePosition, ClientCoordinates } from '../editorDom.js';
import { StandardMouseWheelEvent } from '../../../base/browser/mouseEvent.js';
import { EditorZoom } from '../../common/config/editorZoom.js';
/**
 * Merges mouse events when mouse move events are throttled
 */
function createMouseMoveEventMerger(mouseTargetFactory) {
    return function (lastEvent, currentEvent) {
        var targetIsWidget = false;
        if (mouseTargetFactory) {
            targetIsWidget = mouseTargetFactory.mouseTargetIsWidget(currentEvent);
        }
        if (!targetIsWidget) {
            currentEvent.preventDefault();
        }
        return currentEvent;
    };
}
var MouseHandler = /** @class */ (function (_super) {
    __extends(MouseHandler, _super);
    function MouseHandler(context, viewController, viewHelper) {
        var _this = _super.call(this) || this;
        _this._isFocused = false;
        _this._context = context;
        _this.viewController = viewController;
        _this.viewHelper = viewHelper;
        _this.mouseTargetFactory = new MouseTargetFactory(_this._context, viewHelper);
        _this._mouseDownOperation = _this._register(new MouseDownOperation(_this._context, _this.viewController, _this.viewHelper, function (e, testEventTarget) { return _this._createMouseTarget(e, testEventTarget); }, function (e) { return _this._getMouseColumn(e); }));
        _this._asyncFocus = _this._register(new RunOnceScheduler(function () { return _this.viewHelper.focusTextArea(); }, 0));
        _this.lastMouseLeaveTime = -1;
        var mouseEvents = new EditorMouseEventFactory(_this.viewHelper.viewDomNode);
        _this._register(mouseEvents.onContextMenu(_this.viewHelper.viewDomNode, function (e) { return _this._onContextMenu(e, true); }));
        _this._register(mouseEvents.onMouseMoveThrottled(_this.viewHelper.viewDomNode, function (e) { return _this._onMouseMove(e); }, createMouseMoveEventMerger(_this.mouseTargetFactory), MouseHandler.MOUSE_MOVE_MINIMUM_TIME));
        _this._register(mouseEvents.onMouseUp(_this.viewHelper.viewDomNode, function (e) { return _this._onMouseUp(e); }));
        _this._register(mouseEvents.onMouseLeave(_this.viewHelper.viewDomNode, function (e) { return _this._onMouseLeave(e); }));
        _this._register(mouseEvents.onMouseDown(_this.viewHelper.viewDomNode, function (e) { return _this._onMouseDown(e); }));
        var onMouseWheel = function (browserEvent) {
            if (!_this._context.configuration.editor.viewInfo.mouseWheelZoom) {
                return;
            }
            var e = new StandardMouseWheelEvent(browserEvent);
            if (e.browserEvent.ctrlKey || e.browserEvent.metaKey) {
                var zoomLevel = EditorZoom.getZoomLevel();
                var delta = e.deltaY > 0 ? 1 : -1;
                EditorZoom.setZoomLevel(zoomLevel + delta);
                e.preventDefault();
                e.stopPropagation();
            }
        };
        _this._register(dom.addDisposableListener(_this.viewHelper.viewDomNode, 'mousewheel', onMouseWheel, true));
        _this._register(dom.addDisposableListener(_this.viewHelper.viewDomNode, 'DOMMouseScroll', onMouseWheel, true));
        _this._context.addEventHandler(_this);
        return _this;
    }
    MouseHandler.prototype.dispose = function () {
        this._context.removeEventHandler(this);
        _super.prototype.dispose.call(this);
    };
    // --- begin event handlers
    MouseHandler.prototype.onCursorStateChanged = function (e) {
        this._mouseDownOperation.onCursorStateChanged(e);
        return false;
    };
    MouseHandler.prototype.onFocusChanged = function (e) {
        this._isFocused = e.isFocused;
        return false;
    };
    MouseHandler.prototype.onScrollChanged = function (e) {
        this._mouseDownOperation.onScrollChanged();
        return false;
    };
    // --- end event handlers
    MouseHandler.prototype.getTargetAtClientPoint = function (clientX, clientY) {
        var clientPos = new ClientCoordinates(clientX, clientY);
        var pos = clientPos.toPageCoordinates();
        var editorPos = createEditorPagePosition(this.viewHelper.viewDomNode);
        if (pos.y < editorPos.y || pos.y > editorPos.y + editorPos.height || pos.x < editorPos.x || pos.x > editorPos.x + editorPos.width) {
            return null;
        }
        var lastViewCursorsRenderData = this.viewHelper.getLastViewCursorsRenderData();
        return this.mouseTargetFactory.createMouseTarget(lastViewCursorsRenderData, editorPos, pos, null);
    };
    MouseHandler.prototype._createMouseTarget = function (e, testEventTarget) {
        var lastViewCursorsRenderData = this.viewHelper.getLastViewCursorsRenderData();
        return this.mouseTargetFactory.createMouseTarget(lastViewCursorsRenderData, e.editorPos, e.pos, testEventTarget ? e.target : null);
    };
    MouseHandler.prototype._getMouseColumn = function (e) {
        return this.mouseTargetFactory.getMouseColumn(e.editorPos, e.pos);
    };
    MouseHandler.prototype._onContextMenu = function (e, testEventTarget) {
        this.viewController.emitContextMenu({
            event: e,
            target: this._createMouseTarget(e, testEventTarget)
        });
    };
    MouseHandler.prototype._onMouseMove = function (e) {
        if (this._mouseDownOperation.isActive()) {
            // In selection/drag operation
            return;
        }
        var actualMouseMoveTime = e.timestamp;
        if (actualMouseMoveTime < this.lastMouseLeaveTime) {
            // Due to throttling, this event occurred before the mouse left the editor, therefore ignore it.
            return;
        }
        this.viewController.emitMouseMove({
            event: e,
            target: this._createMouseTarget(e, true)
        });
    };
    MouseHandler.prototype._onMouseLeave = function (e) {
        this.lastMouseLeaveTime = (new Date()).getTime();
        this.viewController.emitMouseLeave({
            event: e,
            target: null
        });
    };
    MouseHandler.prototype._onMouseUp = function (e) {
        this.viewController.emitMouseUp({
            event: e,
            target: this._createMouseTarget(e, true)
        });
    };
    MouseHandler.prototype._onMouseDown = function (e) {
        var _this = this;
        var t = this._createMouseTarget(e, true);
        var targetIsContent = (t.type === editorBrowser.MouseTargetType.CONTENT_TEXT || t.type === editorBrowser.MouseTargetType.CONTENT_EMPTY);
        var targetIsGutter = (t.type === editorBrowser.MouseTargetType.GUTTER_GLYPH_MARGIN || t.type === editorBrowser.MouseTargetType.GUTTER_LINE_NUMBERS || t.type === editorBrowser.MouseTargetType.GUTTER_LINE_DECORATIONS);
        var targetIsLineNumbers = (t.type === editorBrowser.MouseTargetType.GUTTER_LINE_NUMBERS);
        var selectOnLineNumbers = this._context.configuration.editor.viewInfo.selectOnLineNumbers;
        var targetIsViewZone = (t.type === editorBrowser.MouseTargetType.CONTENT_VIEW_ZONE || t.type === editorBrowser.MouseTargetType.GUTTER_VIEW_ZONE);
        var targetIsWidget = (t.type === editorBrowser.MouseTargetType.CONTENT_WIDGET);
        var shouldHandle = e.leftButton || e.middleButton;
        if (platform.isMacintosh && e.leftButton && e.ctrlKey) {
            shouldHandle = false;
        }
        var focus = function () {
            // In IE11, if the focus is in the browser's address bar and
            // then you click in the editor, calling preventDefault()
            // will not move focus properly (focus remains the address bar)
            if (browser.isIE && !_this._isFocused) {
                _this._asyncFocus.schedule();
            }
            else {
                e.preventDefault();
                _this.viewHelper.focusTextArea();
            }
        };
        if (shouldHandle && (targetIsContent || (targetIsLineNumbers && selectOnLineNumbers))) {
            focus();
            this._mouseDownOperation.start(t.type, e);
        }
        else if (targetIsGutter) {
            // Do not steal focus
            e.preventDefault();
        }
        else if (targetIsViewZone) {
            var viewZoneData = t.detail;
            if (this.viewHelper.shouldSuppressMouseDownOnViewZone(viewZoneData.viewZoneId)) {
                focus();
                this._mouseDownOperation.start(t.type, e);
                e.preventDefault();
            }
        }
        else if (targetIsWidget && this.viewHelper.shouldSuppressMouseDownOnWidget(t.detail)) {
            focus();
            e.preventDefault();
        }
        this.viewController.emitMouseDown({
            event: e,
            target: t
        });
    };
    MouseHandler.MOUSE_MOVE_MINIMUM_TIME = 100; // ms
    return MouseHandler;
}(ViewEventHandler));
export { MouseHandler };
var MouseDownOperation = /** @class */ (function (_super) {
    __extends(MouseDownOperation, _super);
    function MouseDownOperation(context, viewController, viewHelper, createMouseTarget, getMouseColumn) {
        var _this = _super.call(this) || this;
        _this._context = context;
        _this._viewController = viewController;
        _this._viewHelper = viewHelper;
        _this._createMouseTarget = createMouseTarget;
        _this._getMouseColumn = getMouseColumn;
        _this._mouseMoveMonitor = _this._register(new GlobalEditorMouseMoveMonitor(_this._viewHelper.viewDomNode));
        _this._onScrollTimeout = _this._register(new TimeoutTimer());
        _this._mouseState = new MouseDownState();
        _this._currentSelection = new Selection(1, 1, 1, 1);
        _this._isActive = false;
        _this._lastMouseEvent = null;
        return _this;
    }
    MouseDownOperation.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
    };
    MouseDownOperation.prototype.isActive = function () {
        return this._isActive;
    };
    MouseDownOperation.prototype._onMouseDownThenMove = function (e) {
        this._lastMouseEvent = e;
        this._mouseState.setModifiers(e);
        var position = this._findMousePosition(e, true);
        if (!position) {
            // Ignoring because position is unknown
            return;
        }
        if (this._mouseState.isDragAndDrop) {
            this._viewController.emitMouseDrag({
                event: e,
                target: position
            });
        }
        else {
            this._dispatchMouse(position, true);
        }
    };
    MouseDownOperation.prototype.start = function (targetType, e) {
        var _this = this;
        this._lastMouseEvent = e;
        this._mouseState.setStartedOnLineNumbers(targetType === editorBrowser.MouseTargetType.GUTTER_LINE_NUMBERS);
        this._mouseState.setStartButtons(e);
        this._mouseState.setModifiers(e);
        var position = this._findMousePosition(e, true);
        if (!position) {
            // Ignoring because position is unknown
            return;
        }
        this._mouseState.trySetCount(e.detail, position.position);
        // Overwrite the detail of the MouseEvent, as it will be sent out in an event and contributions might rely on it.
        e.detail = this._mouseState.count;
        if (!this._context.configuration.editor.readOnly
            && this._context.configuration.editor.dragAndDrop
            && !this._mouseState.altKey // we don't support multiple mouse
            && e.detail < 2 // only single click on a selection can work
            && !this._isActive // the mouse is not down yet
            && !this._currentSelection.isEmpty() // we don't drag single cursor
            && this._currentSelection.containsPosition(position.position) // single click on a selection
        ) {
            this._mouseState.isDragAndDrop = true;
            this._isActive = true;
            this._mouseMoveMonitor.startMonitoring(createMouseMoveEventMerger(null), function (e) { return _this._onMouseDownThenMove(e); }, function () {
                var position = _this._findMousePosition(_this._lastMouseEvent, true);
                _this._viewController.emitMouseDrop({
                    event: _this._lastMouseEvent,
                    target: position ? _this._createMouseTarget(_this._lastMouseEvent, true) : null // Ignoring because position is unknown, e.g., Content View Zone
                });
                _this._stop();
            });
            return;
        }
        this._mouseState.isDragAndDrop = false;
        this._dispatchMouse(position, e.shiftKey);
        if (!this._isActive) {
            this._isActive = true;
            this._mouseMoveMonitor.startMonitoring(createMouseMoveEventMerger(null), function (e) { return _this._onMouseDownThenMove(e); }, function () { return _this._stop(); });
        }
    };
    MouseDownOperation.prototype._stop = function () {
        this._isActive = false;
        this._onScrollTimeout.cancel();
    };
    MouseDownOperation.prototype.onScrollChanged = function () {
        var _this = this;
        if (!this._isActive) {
            return;
        }
        this._onScrollTimeout.setIfNotSet(function () {
            var position = _this._findMousePosition(_this._lastMouseEvent, false);
            if (!position) {
                // Ignoring because position is unknown
                return;
            }
            if (_this._mouseState.isDragAndDrop) {
                // Ignoring because users are dragging the text
                return;
            }
            _this._dispatchMouse(position, true);
        }, 10);
    };
    MouseDownOperation.prototype.onCursorStateChanged = function (e) {
        this._currentSelection = e.selections[0];
    };
    MouseDownOperation.prototype._getPositionOutsideEditor = function (e) {
        var editorContent = e.editorPos;
        var model = this._context.model;
        var viewLayout = this._context.viewLayout;
        var mouseColumn = this._getMouseColumn(e);
        if (e.posy < editorContent.y) {
            var verticalOffset = Math.max(viewLayout.getCurrentScrollTop() - (editorContent.y - e.posy), 0);
            var viewZoneData = HitTestContext.getZoneAtCoord(this._context, verticalOffset);
            if (viewZoneData) {
                var newPosition = this._helpPositionJumpOverViewZone(viewZoneData);
                if (newPosition) {
                    return new MouseTarget(null, editorBrowser.MouseTargetType.OUTSIDE_EDITOR, mouseColumn, newPosition);
                }
            }
            var aboveLineNumber = viewLayout.getLineNumberAtVerticalOffset(verticalOffset);
            return new MouseTarget(null, editorBrowser.MouseTargetType.OUTSIDE_EDITOR, mouseColumn, new Position(aboveLineNumber, 1));
        }
        if (e.posy > editorContent.y + editorContent.height) {
            var verticalOffset = viewLayout.getCurrentScrollTop() + (e.posy - editorContent.y);
            var viewZoneData = HitTestContext.getZoneAtCoord(this._context, verticalOffset);
            if (viewZoneData) {
                var newPosition = this._helpPositionJumpOverViewZone(viewZoneData);
                if (newPosition) {
                    return new MouseTarget(null, editorBrowser.MouseTargetType.OUTSIDE_EDITOR, mouseColumn, newPosition);
                }
            }
            var belowLineNumber = viewLayout.getLineNumberAtVerticalOffset(verticalOffset);
            return new MouseTarget(null, editorBrowser.MouseTargetType.OUTSIDE_EDITOR, mouseColumn, new Position(belowLineNumber, model.getLineMaxColumn(belowLineNumber)));
        }
        var possibleLineNumber = viewLayout.getLineNumberAtVerticalOffset(viewLayout.getCurrentScrollTop() + (e.posy - editorContent.y));
        if (e.posx < editorContent.x) {
            return new MouseTarget(null, editorBrowser.MouseTargetType.OUTSIDE_EDITOR, mouseColumn, new Position(possibleLineNumber, 1));
        }
        if (e.posx > editorContent.x + editorContent.width) {
            return new MouseTarget(null, editorBrowser.MouseTargetType.OUTSIDE_EDITOR, mouseColumn, new Position(possibleLineNumber, model.getLineMaxColumn(possibleLineNumber)));
        }
        return null;
    };
    MouseDownOperation.prototype._findMousePosition = function (e, testEventTarget) {
        var positionOutsideEditor = this._getPositionOutsideEditor(e);
        if (positionOutsideEditor) {
            return positionOutsideEditor;
        }
        var t = this._createMouseTarget(e, testEventTarget);
        var hintedPosition = t.position;
        if (!hintedPosition) {
            return null;
        }
        if (t.type === editorBrowser.MouseTargetType.CONTENT_VIEW_ZONE || t.type === editorBrowser.MouseTargetType.GUTTER_VIEW_ZONE) {
            var newPosition = this._helpPositionJumpOverViewZone(t.detail);
            if (newPosition) {
                return new MouseTarget(t.element, t.type, t.mouseColumn, newPosition, null, t.detail);
            }
        }
        return t;
    };
    MouseDownOperation.prototype._helpPositionJumpOverViewZone = function (viewZoneData) {
        // Force position on view zones to go above or below depending on where selection started from
        var selectionStart = new Position(this._currentSelection.selectionStartLineNumber, this._currentSelection.selectionStartColumn);
        var positionBefore = viewZoneData.positionBefore;
        var positionAfter = viewZoneData.positionAfter;
        if (positionBefore && positionAfter) {
            if (positionBefore.isBefore(selectionStart)) {
                return positionBefore;
            }
            else {
                return positionAfter;
            }
        }
        return null;
    };
    MouseDownOperation.prototype._dispatchMouse = function (position, inSelectionMode) {
        this._viewController.dispatchMouse({
            position: position.position,
            mouseColumn: position.mouseColumn,
            startedOnLineNumbers: this._mouseState.startedOnLineNumbers,
            inSelectionMode: inSelectionMode,
            mouseDownCount: this._mouseState.count,
            altKey: this._mouseState.altKey,
            ctrlKey: this._mouseState.ctrlKey,
            metaKey: this._mouseState.metaKey,
            shiftKey: this._mouseState.shiftKey,
            leftButton: this._mouseState.leftButton,
            middleButton: this._mouseState.middleButton,
        });
    };
    return MouseDownOperation;
}(Disposable));
var MouseDownState = /** @class */ (function () {
    function MouseDownState() {
        this._altKey = false;
        this._ctrlKey = false;
        this._metaKey = false;
        this._shiftKey = false;
        this._leftButton = false;
        this._middleButton = false;
        this._startedOnLineNumbers = false;
        this._lastMouseDownPosition = null;
        this._lastMouseDownPositionEqualCount = 0;
        this._lastMouseDownCount = 0;
        this._lastSetMouseDownCountTime = 0;
        this.isDragAndDrop = false;
    }
    Object.defineProperty(MouseDownState.prototype, "altKey", {
        get: function () { return this._altKey; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MouseDownState.prototype, "ctrlKey", {
        get: function () { return this._ctrlKey; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MouseDownState.prototype, "metaKey", {
        get: function () { return this._metaKey; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MouseDownState.prototype, "shiftKey", {
        get: function () { return this._shiftKey; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MouseDownState.prototype, "leftButton", {
        get: function () { return this._leftButton; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MouseDownState.prototype, "middleButton", {
        get: function () { return this._middleButton; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MouseDownState.prototype, "startedOnLineNumbers", {
        get: function () { return this._startedOnLineNumbers; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MouseDownState.prototype, "count", {
        get: function () {
            return this._lastMouseDownCount;
        },
        enumerable: true,
        configurable: true
    });
    MouseDownState.prototype.setModifiers = function (source) {
        this._altKey = source.altKey;
        this._ctrlKey = source.ctrlKey;
        this._metaKey = source.metaKey;
        this._shiftKey = source.shiftKey;
    };
    MouseDownState.prototype.setStartButtons = function (source) {
        this._leftButton = source.leftButton;
        this._middleButton = source.middleButton;
    };
    MouseDownState.prototype.setStartedOnLineNumbers = function (startedOnLineNumbers) {
        this._startedOnLineNumbers = startedOnLineNumbers;
    };
    MouseDownState.prototype.trySetCount = function (setMouseDownCount, newMouseDownPosition) {
        // a. Invalidate multiple clicking if too much time has passed (will be hit by IE because the detail field of mouse events contains garbage in IE10)
        var currentTime = (new Date()).getTime();
        if (currentTime - this._lastSetMouseDownCountTime > MouseDownState.CLEAR_MOUSE_DOWN_COUNT_TIME) {
            setMouseDownCount = 1;
        }
        this._lastSetMouseDownCountTime = currentTime;
        // b. Ensure that we don't jump from single click to triple click in one go (will be hit by IE because the detail field of mouse events contains garbage in IE10)
        if (setMouseDownCount > this._lastMouseDownCount + 1) {
            setMouseDownCount = this._lastMouseDownCount + 1;
        }
        // c. Invalidate multiple clicking if the logical position is different
        if (this._lastMouseDownPosition && this._lastMouseDownPosition.equals(newMouseDownPosition)) {
            this._lastMouseDownPositionEqualCount++;
        }
        else {
            this._lastMouseDownPositionEqualCount = 1;
        }
        this._lastMouseDownPosition = newMouseDownPosition;
        // Finally set the lastMouseDownCount
        this._lastMouseDownCount = Math.min(setMouseDownCount, this._lastMouseDownPositionEqualCount);
    };
    MouseDownState.CLEAR_MOUSE_DOWN_COUNT_TIME = 400; // ms
    return MouseDownState;
}());
