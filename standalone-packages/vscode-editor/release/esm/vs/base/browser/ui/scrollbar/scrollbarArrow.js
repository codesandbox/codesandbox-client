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
import { GlobalMouseMoveMonitor, standardMouseMoveMerger } from '../../globalMouseMoveMonitor.js';
import { Widget } from '../widget.js';
import { IntervalTimer, TimeoutTimer } from '../../../common/async.js';
/**
 * The arrow image size.
 */
export var ARROW_IMG_SIZE = 11;
var ScrollbarArrow = /** @class */ (function (_super) {
    __extends(ScrollbarArrow, _super);
    function ScrollbarArrow(opts) {
        var _this = _super.call(this) || this;
        _this._onActivate = opts.onActivate;
        _this.bgDomNode = document.createElement('div');
        _this.bgDomNode.className = 'arrow-background';
        _this.bgDomNode.style.position = 'absolute';
        _this.bgDomNode.style.width = opts.bgWidth + 'px';
        _this.bgDomNode.style.height = opts.bgHeight + 'px';
        if (typeof opts.top !== 'undefined') {
            _this.bgDomNode.style.top = '0px';
        }
        if (typeof opts.left !== 'undefined') {
            _this.bgDomNode.style.left = '0px';
        }
        if (typeof opts.bottom !== 'undefined') {
            _this.bgDomNode.style.bottom = '0px';
        }
        if (typeof opts.right !== 'undefined') {
            _this.bgDomNode.style.right = '0px';
        }
        _this.domNode = document.createElement('div');
        _this.domNode.className = opts.className;
        _this.domNode.style.position = 'absolute';
        _this.domNode.style.width = ARROW_IMG_SIZE + 'px';
        _this.domNode.style.height = ARROW_IMG_SIZE + 'px';
        if (typeof opts.top !== 'undefined') {
            _this.domNode.style.top = opts.top + 'px';
        }
        if (typeof opts.left !== 'undefined') {
            _this.domNode.style.left = opts.left + 'px';
        }
        if (typeof opts.bottom !== 'undefined') {
            _this.domNode.style.bottom = opts.bottom + 'px';
        }
        if (typeof opts.right !== 'undefined') {
            _this.domNode.style.right = opts.right + 'px';
        }
        _this._mouseMoveMonitor = _this._register(new GlobalMouseMoveMonitor());
        _this.onmousedown(_this.bgDomNode, function (e) { return _this._arrowMouseDown(e); });
        _this.onmousedown(_this.domNode, function (e) { return _this._arrowMouseDown(e); });
        _this._mousedownRepeatTimer = _this._register(new IntervalTimer());
        _this._mousedownScheduleRepeatTimer = _this._register(new TimeoutTimer());
        return _this;
    }
    ScrollbarArrow.prototype._arrowMouseDown = function (e) {
        var _this = this;
        var scheduleRepeater = function () {
            _this._mousedownRepeatTimer.cancelAndSet(function () { return _this._onActivate(); }, 1000 / 24);
        };
        this._onActivate();
        this._mousedownRepeatTimer.cancel();
        this._mousedownScheduleRepeatTimer.cancelAndSet(scheduleRepeater, 200);
        this._mouseMoveMonitor.startMonitoring(standardMouseMoveMerger, function (mouseMoveData) {
            /* Intentional empty */
        }, function () {
            _this._mousedownRepeatTimer.cancel();
            _this._mousedownScheduleRepeatTimer.cancel();
        });
        e.preventDefault();
    };
    return ScrollbarArrow;
}(Widget));
export { ScrollbarArrow };
