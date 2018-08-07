/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import './sash.css';
import { dispose } from '../../../common/lifecycle';
import { isIPad } from '../../browser';
import { isMacintosh } from '../../../common/platform';
import * as types from '../../../common/types';
import { EventType, Gesture } from '../../touch';
import { StandardMouseEvent } from '../../mouseEvent';
import { Emitter } from '../../../common/event';
import { getElementsByTagName, EventHelper, createStyleSheet, addDisposableListener, append, $, addClass, removeClass, toggleClass } from '../../dom';
import { domEvent } from '../../event';
var DEBUG = false;
export var Orientation;
(function (Orientation) {
    Orientation[Orientation["VERTICAL"] = 0] = "VERTICAL";
    Orientation[Orientation["HORIZONTAL"] = 1] = "HORIZONTAL";
})(Orientation || (Orientation = {}));
export var SashState;
(function (SashState) {
    SashState[SashState["Disabled"] = 0] = "Disabled";
    SashState[SashState["Minimum"] = 1] = "Minimum";
    SashState[SashState["Maximum"] = 2] = "Maximum";
    SashState[SashState["Enabled"] = 3] = "Enabled";
})(SashState || (SashState = {}));
var Sash = /** @class */ (function () {
    function Sash(container, layoutProvider, options) {
        if (options === void 0) { options = {}; }
        this.disposables = [];
        this._state = SashState.Enabled;
        this._onDidEnablementChange = new Emitter();
        this.onDidEnablementChange = this._onDidEnablementChange.event;
        this._onDidStart = new Emitter();
        this.onDidStart = this._onDidStart.event;
        this._onDidChange = new Emitter();
        this.onDidChange = this._onDidChange.event;
        this._onDidReset = new Emitter();
        this.onDidReset = this._onDidReset.event;
        this._onDidEnd = new Emitter();
        this.onDidEnd = this._onDidEnd.event;
        this.linkedSash = undefined;
        this.orthogonalStartSashDisposables = [];
        this.orthogonalEndSashDisposables = [];
        this.el = append(container, $('.monaco-sash'));
        if (isMacintosh) {
            addClass(this.el, 'mac');
        }
        domEvent(this.el, 'mousedown')(this.onMouseDown, this, this.disposables);
        domEvent(this.el, 'dblclick')(this.onMouseDoubleClick, this, this.disposables);
        Gesture.addTarget(this.el);
        domEvent(this.el, EventType.Start)(this.onTouchStart, this, this.disposables);
        if (isIPad) {
            // see also http://ux.stackexchange.com/questions/39023/what-is-the-optimum-button-size-of-touch-screen-applications
            addClass(this.el, 'touch');
        }
        this.setOrientation(options.orientation || Orientation.VERTICAL);
        this.hidden = false;
        this.layoutProvider = layoutProvider;
        this.orthogonalStartSash = options.orthogonalStartSash;
        this.orthogonalEndSash = options.orthogonalEndSash;
        toggleClass(this.el, 'debug', DEBUG);
    }
    Object.defineProperty(Sash.prototype, "state", {
        get: function () { return this._state; },
        set: function (state) {
            if (this._state === state) {
                return;
            }
            toggleClass(this.el, 'disabled', state === SashState.Disabled);
            toggleClass(this.el, 'minimum', state === SashState.Minimum);
            toggleClass(this.el, 'maximum', state === SashState.Maximum);
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
                this.onOrthogonalStartSashEnablementChange(SashState.Disabled);
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
                this.onOrthogonalEndSashEnablementChange(SashState.Disabled);
            }
            this._orthogonalEndSash = sash;
        },
        enumerable: true,
        configurable: true
    });
    Sash.prototype.setOrientation = function (orientation) {
        this.orientation = orientation;
        if (this.orientation === Orientation.HORIZONTAL) {
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
            if (this.orientation === Orientation.VERTICAL) {
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
            else if (_this.orientation === Orientation.HORIZONTAL) {
                if (_this.state === SashState.Minimum) {
                    cursor = 's-resize';
                }
                else if (_this.state === SashState.Maximum) {
                    cursor = 'n-resize';
                }
                else {
                    cursor = isMacintosh ? 'row-resize' : 'ns-resize';
                }
            }
            else {
                if (_this.state === SashState.Minimum) {
                    cursor = 'e-resize';
                }
                else if (_this.state === SashState.Maximum) {
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
        if (this.orientation === Orientation.VERTICAL) {
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
        toggleClass(this.el, 'orthogonal-start', state !== SashState.Disabled);
    };
    Sash.prototype.onOrthogonalEndSashEnablementChange = function (state) {
        toggleClass(this.el, 'orthogonal-end', state !== SashState.Disabled);
    };
    Sash.prototype.dispose = function () {
        this.orthogonalStartSashDisposables = dispose(this.orthogonalStartSashDisposables);
        this.orthogonalEndSashDisposables = dispose(this.orthogonalEndSashDisposables);
        if (this.el && this.el.parentElement) {
            this.el.parentElement.removeChild(this.el);
        }
        this.el = null;
        this.disposables = dispose(this.disposables);
    };
    return Sash;
}());
export { Sash };
