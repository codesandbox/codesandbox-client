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
import { Disposable } from '../../base/common/lifecycle.js';
import { StandardMouseEvent } from '../../base/browser/mouseEvent.js';
import * as dom from '../../base/browser/dom.js';
import { GlobalMouseMoveMonitor } from '../../base/browser/globalMouseMoveMonitor.js';
/**
 * Coordinates relative to the whole document (e.g. mouse event's pageX and pageY)
 */
var PageCoordinates = /** @class */ (function () {
    function PageCoordinates(x, y) {
        this.x = x;
        this.y = y;
    }
    PageCoordinates.prototype.toClientCoordinates = function () {
        return new ClientCoordinates(this.x - dom.StandardWindow.scrollX, this.y - dom.StandardWindow.scrollY);
    };
    return PageCoordinates;
}());
export { PageCoordinates };
/**
 * Coordinates within the application's client area (i.e. origin is document's scroll position).
 *
 * For example, clicking in the top-left corner of the client area will
 * always result in a mouse event with a client.x value of 0, regardless
 * of whether the page is scrolled horizontally.
 */
var ClientCoordinates = /** @class */ (function () {
    function ClientCoordinates(clientX, clientY) {
        this.clientX = clientX;
        this.clientY = clientY;
    }
    ClientCoordinates.prototype.toPageCoordinates = function () {
        return new PageCoordinates(this.clientX + dom.StandardWindow.scrollX, this.clientY + dom.StandardWindow.scrollY);
    };
    return ClientCoordinates;
}());
export { ClientCoordinates };
/**
 * The position of the editor in the page.
 */
var EditorPagePosition = /** @class */ (function () {
    function EditorPagePosition(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    return EditorPagePosition;
}());
export { EditorPagePosition };
export function createEditorPagePosition(editorViewDomNode) {
    var editorPos = dom.getDomNodePagePosition(editorViewDomNode);
    return new EditorPagePosition(editorPos.left, editorPos.top, editorPos.width, editorPos.height);
}
var EditorMouseEvent = /** @class */ (function (_super) {
    __extends(EditorMouseEvent, _super);
    function EditorMouseEvent(e, editorViewDomNode) {
        var _this = _super.call(this, e) || this;
        _this.pos = new PageCoordinates(_this.posx, _this.posy);
        _this.editorPos = createEditorPagePosition(editorViewDomNode);
        return _this;
    }
    return EditorMouseEvent;
}(StandardMouseEvent));
export { EditorMouseEvent };
var EditorMouseEventFactory = /** @class */ (function () {
    function EditorMouseEventFactory(editorViewDomNode) {
        this._editorViewDomNode = editorViewDomNode;
    }
    EditorMouseEventFactory.prototype._create = function (e) {
        return new EditorMouseEvent(e, this._editorViewDomNode);
    };
    EditorMouseEventFactory.prototype.onContextMenu = function (target, callback) {
        var _this = this;
        return dom.addDisposableListener(target, 'contextmenu', function (e) {
            callback(_this._create(e));
        });
    };
    EditorMouseEventFactory.prototype.onMouseUp = function (target, callback) {
        var _this = this;
        return dom.addDisposableListener(target, 'mouseup', function (e) {
            callback(_this._create(e));
        });
    };
    EditorMouseEventFactory.prototype.onMouseDown = function (target, callback) {
        var _this = this;
        return dom.addDisposableListener(target, 'mousedown', function (e) {
            callback(_this._create(e));
        });
    };
    EditorMouseEventFactory.prototype.onMouseLeave = function (target, callback) {
        var _this = this;
        return dom.addDisposableNonBubblingMouseOutListener(target, function (e) {
            callback(_this._create(e));
        });
    };
    EditorMouseEventFactory.prototype.onMouseMoveThrottled = function (target, callback, merger, minimumTimeMs) {
        var _this = this;
        var myMerger = function (lastEvent, currentEvent) {
            return merger(lastEvent, _this._create(currentEvent));
        };
        return dom.addDisposableThrottledListener(target, 'mousemove', callback, myMerger, minimumTimeMs);
    };
    return EditorMouseEventFactory;
}());
export { EditorMouseEventFactory };
var GlobalEditorMouseMoveMonitor = /** @class */ (function (_super) {
    __extends(GlobalEditorMouseMoveMonitor, _super);
    function GlobalEditorMouseMoveMonitor(editorViewDomNode) {
        var _this = _super.call(this) || this;
        _this._editorViewDomNode = editorViewDomNode;
        _this._globalMouseMoveMonitor = _this._register(new GlobalMouseMoveMonitor());
        _this._keydownListener = null;
        return _this;
    }
    GlobalEditorMouseMoveMonitor.prototype.startMonitoring = function (merger, mouseMoveCallback, onStopCallback) {
        var _this = this;
        // Add a <<capture>> keydown event listener that will cancel the monitoring
        // if something other than a modifier key is pressed
        this._keydownListener = dom.addStandardDisposableListener(document, 'keydown', function (e) {
            var kb = e.toKeybinding();
            if (kb.isModifierKey()) {
                // Allow modifier keys
                return;
            }
            _this._globalMouseMoveMonitor.stopMonitoring(true);
        }, true);
        var myMerger = function (lastEvent, currentEvent) {
            return merger(lastEvent, new EditorMouseEvent(currentEvent, _this._editorViewDomNode));
        };
        this._globalMouseMoveMonitor.startMonitoring(myMerger, mouseMoveCallback, function () {
            _this._keydownListener.dispose();
            onStopCallback();
        });
    };
    return GlobalEditorMouseMoveMonitor;
}(Disposable));
export { GlobalEditorMouseMoveMonitor };
