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
import './sash.css';
import { dispose, Disposable } from '../../../common/lifecycle.js';
import { isIPad } from '../../browser.js';
import { isMacintosh } from '../../../common/platform.js';
import * as types from '../../../common/types.js';
import { EventType, Gesture } from '../../touch.js';
import { StandardMouseEvent } from '../../mouseEvent.js';
import { Emitter } from '../../../common/event.js';
import { getElementsByTagName, EventHelper, createStyleSheet, addDisposableListener, append, $, addClass, removeClass, toggleClass } from '../../dom.js';
import { domEvent } from '../../event.js';
var DEBUG = false;
var Sash = /** @class */ (function (_super) {
    __extends(Sash, _super);
    function Sash(container, layoutProvider, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this) || this;
        _this._state = 3 /* Enabled */;
        _this._onDidEnablementChange = _this._register(new Emitter());
        _this.onDidEnablementChange = _this._onDidEnablementChange.event;
        _this._onDidStart = _this._register(new Emitter());
        _this.onDidStart = _this._onDidStart.event;
        _this._onDidChange = _this._register(new Emitter());
        _this.onDidChange = _this._onDidChange.event;
        _this._onDidReset = _this._register(new Emitter());
        _this.onDidReset = _this._onDidReset.event;
        _this._onDidEnd = _this._register(new Emitter());
        _this.onDidEnd = _this._onDidEnd.event;
        _this.linkedSash = undefined;
        _this.orthogonalStartSashDisposables = [];
        _this.orthogonalEndSashDisposables = [];
        _this.el = append(container, $('.monaco-sash'));
        if (isMacintosh) {
            addClass(_this.el, 'mac');
        }
        _this._register(domEvent(_this.el, 'mousedown')(_this.onMouseDown, _this));
        _this._register(domEvent(_this.el, 'dblclick')(_this.onMouseDoubleClick, _this));
        Gesture.addTarget(_this.el);
        _this._register(domEvent(_this.el, EventType.Start)(_this.onTouchStart, _this));
        if (isIPad) {
            // see also http://ux.stackexchange.com/questions/39023/what-is-the-optimum-button-size-of-touch-screen-applications
            addClass(_this.el, 'touch');
        }
        _this.setOrientation(options.orientation || 0 /* VERTICAL */);
        _this.hidden = false;
        _this.layoutProvider = layoutProvider;
        _this.orthogonalStartSash = options.orthogonalStartSash;
        _this.orthogonalEndSash = options.orthogonalEndSash;
        toggleClass(_this.el, 'debug', DEBUG);
        return _this;
    }
    Object.defineProperty(Sash.prototype, "state", {
        get: function () { return this._state; },
        set: function (state) {
            if (this._state === state) {
                return;
            }
            toggleClass(this.el, 'disabled', state === 0 /* Disabled */);
            toggleClass(this.el, 'minimum', state === 1 /* Minimum */);
            toggleClass(this.el, 'maximum', state === 2 /* Maximum */);
            this._state = state;
            this._onDidEnablementChange.fire(state);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sash.prototype, "orthogonalStartSash", {
        get: function () { return this._orthogonalStartSash; },
        set: function (sash) {
            this.orthogonalStartSashDisposables = dispose(this.orthogonalStartSashDisposables);
            if (sash) {
                sash.onDidEnablementChange(this.onOrthogonalStartSashEnablementChange, this, this.orthogonalStartSashDisposables);
                this.onOrthogonalStartSashEnablementChange(sash.state);
            }
            else {
                this.onOrthogonalStartSashEnablementChange(0 /* Disabled */);
            }
            this._orthogonalStartSash = sash;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sash.prototype, "orthogonalEndSash", {
        get: function () { return this._orthogonalEndSash; },
        set: function (sash) {
            this.orthogonalEndSashDisposables = dispose(this.orthogonalEndSashDisposables);
            if (sash) {
                sash.onDidEnablementChange(this.onOrthogonalEndSashEnablementChange, this, this.orthogonalEndSashDisposables);
                this.onOrthogonalEndSashEnablementChange(sash.state);
            }
            else {
                this.onOrthogonalEndSashEnablementChange(0 /* Disabled */);
            }
            this._orthogonalEndSash = sash;
        },
        enumerable: true,
        configurable: true
    });
    Sash.prototype.setOrientation = function (orientation) {
        this.orientation = orientation;
        if (this.orientation === 1 /* HORIZONTAL */) {
            addClass(this.el, 'horizontal');
            removeClass(this.el, 'vertical');
        }
        else {
            removeClass(this.el, 'horizontal');
            addClass(this.el, 'vertical');
        }
        if (this.layoutProvider) {
            this.layout();
        }
    };
    Sash.prototype.onMouseDown = function (e) {
        var _this = this;
        EventHelper.stop(e, false);
        var isMultisashResize = false;
        if (this.linkedSash && !e.__linkedSashEvent) {
            e.__linkedSashEvent = true;
            this.linkedSash.onMouseDown(e);
        }
        if (!e.__orthogonalSashEvent) {
            var orthogonalSash = void 0;
            if (this.orientation === 0 /* VERTICAL */) {
                if (e.offsetY <= 4) {
                    orthogonalSash = this.orthogonalStartSash;
                }
                else if (e.offsetY >= this.el.clientHeight - 4) {
                    orthogonalSash = this.orthogonalEndSash;
                }
            }
            else {
                if (e.offsetX <= 4) {
                    orthogonalSash = this.orthogonalStartSash;
                }
                else if (e.offsetX >= this.el.clientWidth - 4) {
                    orthogonalSash = this.orthogonalEndSash;
                }
            }
            if (orthogonalSash) {
                isMultisashResize = true;
                e.__orthogonalSashEvent = true;
                orthogonalSash.onMouseDown(e);
            }
        }
        if (!this.state) {
            return;
        }
        var iframes = getElementsByTagName('iframe');
        for (var _i = 0, iframes_1 = iframes; _i < iframes_1.length; _i++) {
            var iframe = iframes_1[_i];
            iframe.style.pointerEvents = 'none'; // disable mouse events on iframes as long as we drag the sash
        }
        var mouseDownEvent = new StandardMouseEvent(e);
        var startX = mouseDownEvent.posx;
        var startY = mouseDownEvent.posy;
        var altKey = mouseDownEvent.altKey;
        var startEvent = { startX: startX, currentX: startX, startY: startY, currentY: startY, altKey: altKey };
        addClass(this.el, 'active');
        this._onDidStart.fire(startEvent);
        // fix https://github.com/Microsoft/vscode/issues/21675
        var style = createStyleSheet(this.el);
        var updateStyle = function () {
            var cursor = '';
            if (isMultisashResize) {
                cursor = 'all-scroll';
            }
            else if (_this.orientation === 1 /* HORIZONTAL */) {
                if (_this.state === 1 /* Minimum */) {
                    cursor = 's-resize';
                }
                else if (_this.state === 2 /* Maximum */) {
                    cursor = 'n-resize';
                }
                else {
                    cursor = isMacintosh ? 'row-resize' : 'ns-resize';
                }
            }
            else {
                if (_this.state === 1 /* Minimum */) {
                    cursor = 'e-resize';
                }
                else if (_this.state === 2 /* Maximum */) {
                    cursor = 'w-resize';
                }
                else {
                    cursor = isMacintosh ? 'col-resize' : 'ew-resize';
                }
            }
            style.innerHTML = "* { cursor: " + cursor + " !important; }";
        };
        var disposables = [];
        updateStyle();
        if (!isMultisashResize) {
            this.onDidEnablementChange(updateStyle, null, disposables);
        }
        var onMouseMove = function (e) {
            EventHelper.stop(e, false);
            var mouseMoveEvent = new StandardMouseEvent(e);
            var event = { startX: startX, currentX: mouseMoveEvent.posx, startY: startY, currentY: mouseMoveEvent.posy, altKey: altKey };
            _this._onDidChange.fire(event);
        };
        var onMouseUp = function (e) {
            EventHelper.stop(e, false);
            _this.el.removeChild(style);
            removeClass(_this.el, 'active');
            _this._onDidEnd.fire();
            dispose(disposables);
            var iframes = getElementsByTagName('iframe');
            for (var _i = 0, iframes_2 = iframes; _i < iframes_2.length; _i++) {
                var iframe = iframes_2[_i];
                iframe.style.pointerEvents = 'auto';
            }
        };
        domEvent(window, 'mousemove')(onMouseMove, null, disposables);
        domEvent(window, 'mouseup')(onMouseUp, null, disposables);
    };
    Sash.prototype.onMouseDoubleClick = function (event) {
        this._onDidReset.fire();
    };
    Sash.prototype.onTouchStart = function (event) {
        var _this = this;
        EventHelper.stop(event);
        var listeners = [];
        var startX = event.pageX;
        var startY = event.pageY;
        var altKey = event.altKey;
        this._onDidStart.fire({
            startX: startX,
            currentX: startX,
            startY: startY,
            currentY: startY,
            altKey: altKey
        });
        listeners.push(addDisposableListener(this.el, EventType.Change, function (event) {
            if (types.isNumber(event.pageX) && types.isNumber(event.pageY)) {
                _this._onDidChange.fire({
                    startX: startX,
                    currentX: event.pageX,
                    startY: startY,
                    currentY: event.pageY,
                    altKey: altKey
                });
            }
        }));
        listeners.push(addDisposableListener(this.el, EventType.End, function (event) {
            _this._onDidEnd.fire();
            dispose(listeners);
        }));
    };
    Sash.prototype.layout = function () {
        var size = isIPad ? 20 : 4;
        if (this.orientation === 0 /* VERTICAL */) {
            var verticalProvider = this.layoutProvider;
            this.el.style.left = verticalProvider.getVerticalSashLeft(this) - (size / 2) + 'px';
            if (verticalProvider.getVerticalSashTop) {
                this.el.style.top = verticalProvider.getVerticalSashTop(this) + 'px';
            }
            if (verticalProvider.getVerticalSashHeight) {
                this.el.style.height = verticalProvider.getVerticalSashHeight(this) + 'px';
            }
        }
        else {
            var horizontalProvider = this.layoutProvider;
            this.el.style.top = horizontalProvider.getHorizontalSashTop(this) - (size / 2) + 'px';
            if (horizontalProvider.getHorizontalSashLeft) {
                this.el.style.left = horizontalProvider.getHorizontalSashLeft(this) + 'px';
            }
            if (horizontalProvider.getHorizontalSashWidth) {
                this.el.style.width = horizontalProvider.getHorizontalSashWidth(this) + 'px';
            }
        }
    };
    Sash.prototype.show = function () {
        this.hidden = false;
        this.el.style.removeProperty('display');
        this.el.setAttribute('aria-hidden', 'false');
    };
    Sash.prototype.hide = function () {
        this.hidden = true;
        this.el.style.display = 'none';
        this.el.setAttribute('aria-hidden', 'true');
    };
    Sash.prototype.isHidden = function () {
        return this.hidden;
    };
    Sash.prototype.onOrthogonalStartSashEnablementChange = function (state) {
        toggleClass(this.el, 'orthogonal-start', state !== 0 /* Disabled */);
    };
    Sash.prototype.onOrthogonalEndSashEnablementChange = function (state) {
        toggleClass(this.el, 'orthogonal-end', state !== 0 /* Disabled */);
    };
    Sash.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this.orthogonalStartSashDisposables = dispose(this.orthogonalStartSashDisposables);
        this.orthogonalEndSashDisposables = dispose(this.orthogonalEndSashDisposables);
        if (this.el && this.el.parentElement) {
            this.el.parentElement.removeChild(this.el);
        }
        this.el = null;
    };
    return Sash;
}(Disposable));
export { Sash };
