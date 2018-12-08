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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import * as arrays from '../common/arrays.js';
import { Disposable } from '../common/lifecycle.js';
import * as DomUtils from './dom.js';
import { memoize } from '../common/decorators.js';
export var EventType;
(function (EventType) {
    EventType.Tap = '-monaco-gesturetap';
    EventType.Change = '-monaco-gesturechange';
    EventType.Start = '-monaco-gesturestart';
    EventType.End = '-monaco-gesturesend';
    EventType.Contextmenu = '-monaco-gesturecontextmenu';
})(EventType || (EventType = {}));
var Gesture = /** @class */ (function (_super) {
    __extends(Gesture, _super);
    function Gesture() {
        var _this = _super.call(this) || this;
        _this.activeTouches = {};
        _this.handle = null;
        _this.targets = [];
        _this._register(DomUtils.addDisposableListener(document, 'touchstart', function (e) { return _this.onTouchStart(e); }));
        _this._register(DomUtils.addDisposableListener(document, 'touchend', function (e) { return _this.onTouchEnd(e); }));
        _this._register(DomUtils.addDisposableListener(document, 'touchmove', function (e) { return _this.onTouchMove(e); }));
        return _this;
    }
    Gesture.addTarget = function (element) {
        if (!Gesture.isTouchDevice()) {
            return;
        }
        if (!Gesture.INSTANCE) {
            Gesture.INSTANCE = new Gesture();
        }
        Gesture.INSTANCE.targets.push(element);
    };
    Gesture.isTouchDevice = function () {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.navigator.msMaxTouchPoints > 0;
    };
    Gesture.prototype.dispose = function () {
        if (this.handle) {
            this.handle.dispose();
            this.handle = null;
        }
        _super.prototype.dispose.call(this);
    };
    Gesture.prototype.onTouchStart = function (e) {
        var timestamp = Date.now(); // use Date.now() because on FF e.timeStamp is not epoch based.
        if (this.handle) {
            this.handle.dispose();
            this.handle = null;
        }
        for (var i = 0, len = e.targetTouches.length; i < len; i++) {
            var touch = e.targetTouches.item(i);
            this.activeTouches[touch.identifier] = {
                id: touch.identifier,
                initialTarget: touch.target,
                initialTimeStamp: timestamp,
                initialPageX: touch.pageX,
                initialPageY: touch.pageY,
                rollingTimestamps: [timestamp],
                rollingPageX: [touch.pageX],
                rollingPageY: [touch.pageY]
            };
            var evt = this.newGestureEvent(EventType.Start, touch.target);
            evt.pageX = touch.pageX;
            evt.pageY = touch.pageY;
            this.dispatchEvent(evt);
        }
        if (this.dispatched) {
            e.preventDefault();
            e.stopPropagation();
            this.dispatched = false;
        }
    };
    Gesture.prototype.onTouchEnd = function (e) {
        var timestamp = Date.now(); // use Date.now() because on FF e.timeStamp is not epoch based.
        var activeTouchCount = Object.keys(this.activeTouches).length;
        var _loop_1 = function (i, len) {
            var touch = e.changedTouches.item(i);
            if (!this_1.activeTouches.hasOwnProperty(String(touch.identifier))) {
                console.warn('move of an UNKNOWN touch', touch);
                return "continue";
            }
            var data = this_1.activeTouches[touch.identifier], holdTime = Date.now() - data.initialTimeStamp;
            if (holdTime < Gesture.HOLD_DELAY
                && Math.abs(data.initialPageX - arrays.tail(data.rollingPageX)) < 30
                && Math.abs(data.initialPageY - arrays.tail(data.rollingPageY)) < 30) {
                var evt = this_1.newGestureEvent(EventType.Tap, data.initialTarget);
                evt.pageX = arrays.tail(data.rollingPageX);
                evt.pageY = arrays.tail(data.rollingPageY);
                this_1.dispatchEvent(evt);
            }
            else if (holdTime >= Gesture.HOLD_DELAY
                && Math.abs(data.initialPageX - arrays.tail(data.rollingPageX)) < 30
                && Math.abs(data.initialPageY - arrays.tail(data.rollingPageY)) < 30) {
                var evt = this_1.newGestureEvent(EventType.Contextmenu, data.initialTarget);
                evt.pageX = arrays.tail(data.rollingPageX);
                evt.pageY = arrays.tail(data.rollingPageY);
                this_1.dispatchEvent(evt);
            }
            else if (activeTouchCount === 1) {
                var finalX = arrays.tail(data.rollingPageX);
                var finalY = arrays.tail(data.rollingPageY);
                var deltaT = arrays.tail(data.rollingTimestamps) - data.rollingTimestamps[0];
                var deltaX = finalX - data.rollingPageX[0];
                var deltaY = finalY - data.rollingPageY[0];
                // We need to get all the dispatch targets on the start of the inertia event
                var dispatchTo = this_1.targets.filter(function (t) { return data.initialTarget instanceof Node && t.contains(data.initialTarget); });
                this_1.inertia(dispatchTo, timestamp, // time now
                Math.abs(deltaX) / deltaT, // speed
                deltaX > 0 ? 1 : -1, // x direction
                finalX, // x now
                Math.abs(deltaY) / deltaT, // y speed
                deltaY > 0 ? 1 : -1, // y direction
                finalY // y now
                );
            }
            this_1.dispatchEvent(this_1.newGestureEvent(EventType.End, data.initialTarget));
            // forget about this touch
            delete this_1.activeTouches[touch.identifier];
        };
        var this_1 = this;
        for (var i = 0, len = e.changedTouches.length; i < len; i++) {
            _loop_1(i, len);
        }
        if (this.dispatched) {
            e.preventDefault();
            e.stopPropagation();
            this.dispatched = false;
        }
    };
    Gesture.prototype.newGestureEvent = function (type, intialTarget) {
        var event = document.createEvent('CustomEvent');
        event.initEvent(type, false, true);
        event.initialTarget = intialTarget;
        return event;
    };
    Gesture.prototype.dispatchEvent = function (event) {
        var _this = this;
        this.targets.forEach(function (target) {
            if (event.initialTarget instanceof Node && target.contains(event.initialTarget)) {
                target.dispatchEvent(event);
                _this.dispatched = true;
            }
        });
    };
    Gesture.prototype.inertia = function (dispatchTo, t1, vX, dirX, x, vY, dirY, y) {
        var _this = this;
        this.handle = DomUtils.scheduleAtNextAnimationFrame(function () {
            var now = Date.now();
            // velocity: old speed + accel_over_time
            var deltaT = now - t1, delta_pos_x = 0, delta_pos_y = 0, stopped = true;
            vX += Gesture.SCROLL_FRICTION * deltaT;
            vY += Gesture.SCROLL_FRICTION * deltaT;
            if (vX > 0) {
                stopped = false;
                delta_pos_x = dirX * vX * deltaT;
            }
            if (vY > 0) {
                stopped = false;
                delta_pos_y = dirY * vY * deltaT;
            }
            // dispatch translation event
            var evt = _this.newGestureEvent(EventType.Change);
            evt.translationX = delta_pos_x;
            evt.translationY = delta_pos_y;
            dispatchTo.forEach(function (d) { return d.dispatchEvent(evt); });
            if (!stopped) {
                _this.inertia(dispatchTo, now, vX, dirX, x + delta_pos_x, vY, dirY, y + delta_pos_y);
            }
        });
    };
    Gesture.prototype.onTouchMove = function (e) {
        var timestamp = Date.now(); // use Date.now() because on FF e.timeStamp is not epoch based.
        for (var i = 0, len = e.changedTouches.length; i < len; i++) {
            var touch = e.changedTouches.item(i);
            if (!this.activeTouches.hasOwnProperty(String(touch.identifier))) {
                console.warn('end of an UNKNOWN touch', touch);
                continue;
            }
            var data = this.activeTouches[touch.identifier];
            var evt = this.newGestureEvent(EventType.Change, data.initialTarget);
            evt.translationX = touch.pageX - arrays.tail(data.rollingPageX);
            evt.translationY = touch.pageY - arrays.tail(data.rollingPageY);
            evt.pageX = touch.pageX;
            evt.pageY = touch.pageY;
            this.dispatchEvent(evt);
            // only keep a few data points, to average the final speed
            if (data.rollingPageX.length > 3) {
                data.rollingPageX.shift();
                data.rollingPageY.shift();
                data.rollingTimestamps.shift();
            }
            data.rollingPageX.push(touch.pageX);
            data.rollingPageY.push(touch.pageY);
            data.rollingTimestamps.push(timestamp);
        }
        if (this.dispatched) {
            e.preventDefault();
            e.stopPropagation();
            this.dispatched = false;
        }
    };
    Gesture.SCROLL_FRICTION = -0.005;
    Gesture.HOLD_DELAY = 700;
    __decorate([
        memoize
    ], Gesture, "isTouchDevice", null);
    return Gesture;
}(Disposable));
export { Gesture };
