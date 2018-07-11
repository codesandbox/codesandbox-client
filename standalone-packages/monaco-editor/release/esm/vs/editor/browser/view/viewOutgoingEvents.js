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
import { MouseTarget } from '../controller/mouseTarget.js';
var ViewOutgoingEvents = /** @class */ (function (_super) {
    __extends(ViewOutgoingEvents, _super);
    function ViewOutgoingEvents(viewModel) {
        var _this = _super.call(this) || this;
        _this.onDidScroll = null;
        _this.onDidGainFocus = null;
        _this.onDidLoseFocus = null;
        _this.onKeyDown = null;
        _this.onKeyUp = null;
        _this.onContextMenu = null;
        _this.onMouseMove = null;
        _this.onMouseLeave = null;
        _this.onMouseUp = null;
        _this.onMouseDown = null;
        _this.onMouseDrag = null;
        _this.onMouseDrop = null;
        _this._viewModel = viewModel;
        return _this;
    }
    ViewOutgoingEvents.prototype.emitScrollChanged = function (e) {
        if (this.onDidScroll) {
            this.onDidScroll(e);
        }
    };
    ViewOutgoingEvents.prototype.emitViewFocusGained = function () {
        if (this.onDidGainFocus) {
            this.onDidGainFocus(void 0);
        }
    };
    ViewOutgoingEvents.prototype.emitViewFocusLost = function () {
        if (this.onDidLoseFocus) {
            this.onDidLoseFocus(void 0);
        }
    };
    ViewOutgoingEvents.prototype.emitKeyDown = function (e) {
        if (this.onKeyDown) {
            this.onKeyDown(e);
        }
    };
    ViewOutgoingEvents.prototype.emitKeyUp = function (e) {
        if (this.onKeyUp) {
            this.onKeyUp(e);
        }
    };
    ViewOutgoingEvents.prototype.emitContextMenu = function (e) {
        if (this.onContextMenu) {
            this.onContextMenu(this._convertViewToModelMouseEvent(e));
        }
    };
    ViewOutgoingEvents.prototype.emitMouseMove = function (e) {
        if (this.onMouseMove) {
            this.onMouseMove(this._convertViewToModelMouseEvent(e));
        }
    };
    ViewOutgoingEvents.prototype.emitMouseLeave = function (e) {
        if (this.onMouseLeave) {
            this.onMouseLeave(this._convertViewToModelMouseEvent(e));
        }
    };
    ViewOutgoingEvents.prototype.emitMouseUp = function (e) {
        if (this.onMouseUp) {
            this.onMouseUp(this._convertViewToModelMouseEvent(e));
        }
    };
    ViewOutgoingEvents.prototype.emitMouseDown = function (e) {
        if (this.onMouseDown) {
            this.onMouseDown(this._convertViewToModelMouseEvent(e));
        }
    };
    ViewOutgoingEvents.prototype.emitMouseDrag = function (e) {
        if (this.onMouseDrag) {
            this.onMouseDrag(this._convertViewToModelMouseEvent(e));
        }
    };
    ViewOutgoingEvents.prototype.emitMouseDrop = function (e) {
        if (this.onMouseDrop) {
            this.onMouseDrop(this._convertViewToModelMouseEvent(e));
        }
    };
    ViewOutgoingEvents.prototype._convertViewToModelMouseEvent = function (e) {
        if (e.target) {
            return {
                event: e.event,
                target: this._convertViewToModelMouseTarget(e.target)
            };
        }
        return e;
    };
    ViewOutgoingEvents.prototype._convertViewToModelMouseTarget = function (target) {
        return new ExternalMouseTarget(target.element, target.type, target.mouseColumn, target.position ? this._convertViewToModelPosition(target.position) : null, target.range ? this._convertViewToModelRange(target.range) : null, target.detail);
    };
    ViewOutgoingEvents.prototype._convertViewToModelPosition = function (viewPosition) {
        return this._viewModel.coordinatesConverter.convertViewPositionToModelPosition(viewPosition);
    };
    ViewOutgoingEvents.prototype._convertViewToModelRange = function (viewRange) {
        return this._viewModel.coordinatesConverter.convertViewRangeToModelRange(viewRange);
    };
    return ViewOutgoingEvents;
}(Disposable));
export { ViewOutgoingEvents };
var ExternalMouseTarget = /** @class */ (function () {
    function ExternalMouseTarget(element, type, mouseColumn, position, range, detail) {
        this.element = element;
        this.type = type;
        this.mouseColumn = mouseColumn;
        this.position = position;
        this.range = range;
        this.detail = detail;
    }
    ExternalMouseTarget.prototype.toString = function () {
        return MouseTarget.toString(this);
    };
    return ExternalMouseTarget;
}());
