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
import * as dom from '../dom.js';
import { StandardKeyboardEvent } from '../keyboardEvent.js';
import { StandardMouseEvent } from '../mouseEvent.js';
import { Disposable } from '../../common/lifecycle.js';
var Widget = /** @class */ (function (_super) {
    __extends(Widget, _super);
    function Widget() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Widget.prototype.onclick = function (domNode, listener) {
        this._register(dom.addDisposableListener(domNode, dom.EventType.CLICK, function (e) { return listener(new StandardMouseEvent(e)); }));
    };
    Widget.prototype.onmousedown = function (domNode, listener) {
        this._register(dom.addDisposableListener(domNode, dom.EventType.MOUSE_DOWN, function (e) { return listener(new StandardMouseEvent(e)); }));
    };
    Widget.prototype.onmouseover = function (domNode, listener) {
        this._register(dom.addDisposableListener(domNode, dom.EventType.MOUSE_OVER, function (e) { return listener(new StandardMouseEvent(e)); }));
    };
    Widget.prototype.onnonbubblingmouseout = function (domNode, listener) {
        this._register(dom.addDisposableNonBubblingMouseOutListener(domNode, function (e) { return listener(new StandardMouseEvent(e)); }));
    };
    Widget.prototype.onkeydown = function (domNode, listener) {
        this._register(dom.addDisposableListener(domNode, dom.EventType.KEY_DOWN, function (e) { return listener(new StandardKeyboardEvent(e)); }));
    };
    Widget.prototype.onkeyup = function (domNode, listener) {
        this._register(dom.addDisposableListener(domNode, dom.EventType.KEY_UP, function (e) { return listener(new StandardKeyboardEvent(e)); }));
    };
    Widget.prototype.oninput = function (domNode, listener) {
        this._register(dom.addDisposableListener(domNode, dom.EventType.INPUT, listener));
    };
    Widget.prototype.onblur = function (domNode, listener) {
        this._register(dom.addDisposableListener(domNode, dom.EventType.BLUR, listener));
    };
    Widget.prototype.onfocus = function (domNode, listener) {
        this._register(dom.addDisposableListener(domNode, dom.EventType.FOCUS, listener));
    };
    Widget.prototype.onchange = function (domNode, listener) {
        this._register(dom.addDisposableListener(domNode, dom.EventType.CHANGE, listener));
    };
    return Widget;
}(Disposable));
export { Widget };
