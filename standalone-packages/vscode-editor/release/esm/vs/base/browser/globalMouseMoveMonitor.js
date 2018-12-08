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
import * as dom from './dom.js';
import { IframeUtils } from './iframe.js';
import { StandardMouseEvent } from './mouseEvent.js';
import { Disposable, dispose } from '../common/lifecycle.js';
export function standardMouseMoveMerger(lastEvent, currentEvent) {
    var ev = new StandardMouseEvent(currentEvent);
    ev.preventDefault();
    return {
        leftButton: ev.leftButton,
        posx: ev.posx,
        posy: ev.posy
    };
}
var GlobalMouseMoveMonitor = /** @class */ (function (_super) {
    __extends(GlobalMouseMoveMonitor, _super);
    function GlobalMouseMoveMonitor() {
        var _this = _super.call(this) || this;
        _this.hooks = [];
        _this.mouseMoveEventMerger = null;
        _this.mouseMoveCallback = null;
        _this.onStopCallback = null;
        return _this;
    }
    GlobalMouseMoveMonitor.prototype.dispose = function () {
        this.stopMonitoring(false);
        _super.prototype.dispose.call(this);
    };
    GlobalMouseMoveMonitor.prototype.stopMonitoring = function (invokeStopCallback) {
        if (!this.isMonitoring()) {
            // Not monitoring
            return;
        }
        // Unhook
        this.hooks = dispose(this.hooks);
        this.mouseMoveEventMerger = null;
        this.mouseMoveCallback = null;
        var onStopCallback = this.onStopCallback;
        this.onStopCallback = null;
        if (invokeStopCallback && onStopCallback) {
            onStopCallback();
        }
    };
    GlobalMouseMoveMonitor.prototype.isMonitoring = function () {
        return this.hooks.length > 0;
    };
    GlobalMouseMoveMonitor.prototype.startMonitoring = function (mouseMoveEventMerger, mouseMoveCallback, onStopCallback) {
        var _this = this;
        if (this.isMonitoring()) {
            // I am already hooked
            return;
        }
        this.mouseMoveEventMerger = mouseMoveEventMerger;
        this.mouseMoveCallback = mouseMoveCallback;
        this.onStopCallback = onStopCallback;
        var windowChain = IframeUtils.getSameOriginWindowChain();
        for (var i = 0; i < windowChain.length; i++) {
            this.hooks.push(dom.addDisposableThrottledListener(windowChain[i].window.document, 'mousemove', function (data) { return _this.mouseMoveCallback(data); }, function (lastEvent, currentEvent) { return _this.mouseMoveEventMerger(lastEvent, currentEvent); }));
            this.hooks.push(dom.addDisposableListener(windowChain[i].window.document, 'mouseup', function (e) { return _this.stopMonitoring(true); }));
        }
        if (IframeUtils.hasDifferentOriginAncestor()) {
            var lastSameOriginAncestor = windowChain[windowChain.length - 1];
            // We might miss a mouse up if it happens outside the iframe
            // This one is for Chrome
            this.hooks.push(dom.addDisposableListener(lastSameOriginAncestor.window.document, 'mouseout', function (browserEvent) {
                var e = new StandardMouseEvent(browserEvent);
                if (e.target.tagName.toLowerCase() === 'html') {
                    _this.stopMonitoring(true);
                }
            }));
            // This one is for FF
            this.hooks.push(dom.addDisposableListener(lastSameOriginAncestor.window.document, 'mouseover', function (browserEvent) {
                var e = new StandardMouseEvent(browserEvent);
                if (e.target.tagName.toLowerCase() === 'html') {
                    _this.stopMonitoring(true);
                }
            }));
            // This one is for IE
            this.hooks.push(dom.addDisposableListener(lastSameOriginAncestor.window.document.body, 'mouseleave', function (browserEvent) {
                _this.stopMonitoring(true);
            }));
        }
    };
    return GlobalMouseMoveMonitor;
}(Disposable));
export { GlobalMouseMoveMonitor };
