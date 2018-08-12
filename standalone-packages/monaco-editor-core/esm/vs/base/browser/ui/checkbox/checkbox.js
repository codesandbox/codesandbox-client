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
import './checkbox.css';
import * as DOM from '../../dom';
import { Widget } from '../widget';
import { Color } from '../../../common/color';
import { Emitter } from '../../../common/event';
import * as objects from '../../../common/objects';
var defaultOpts = {
    inputActiveOptionBorder: Color.fromHex('#007ACC')
};
var Checkbox = /** @class */ (function (_super) {
    __extends(Checkbox, _super);
    function Checkbox(opts) {
        var _this = _super.call(this) || this;
        _this._onChange = _this._register(new Emitter());
        _this._onKeyDown = _this._register(new Emitter());
        _this._opts = objects.deepClone(opts);
        objects.mixin(_this._opts, defaultOpts, false);
        _this._checked = _this._opts.isChecked;
        _this.domNode = document.createElement('div');
        _this.domNode.title = _this._opts.title;
        _this.domNode.className = 'monaco-custom-checkbox ' + _this._opts.actionClassName + ' ' + (_this._checked ? 'checked' : 'unchecked');
        _this.domNode.tabIndex = 0;
        _this.domNode.setAttribute('role', 'checkbox');
        _this.domNode.setAttribute('aria-checked', String(_this._checked));
        _this.domNode.setAttribute('aria-label', _this._opts.title);
        _this.applyStyles();
        _this.onclick(_this.domNode, function (ev) {
            _this.checked = !_this._checked;
            _this._onChange.fire(false);
            ev.preventDefault();
        });
        _this.onkeydown(_this.domNode, function (keyboardEvent) {
            if (keyboardEvent.keyCode === 10 /* Space */ || keyboardEvent.keyCode === 3 /* Enter */) {
                _this.checked = !_this._checked;
                _this._onChange.fire(true);
                keyboardEvent.preventDefault();
                return;
            }
            _this._onKeyDown.fire(keyboardEvent);
        });
        return _this;
    }
    Object.defineProperty(Checkbox.prototype, "onChange", {
        get: function () { return this._onChange.event; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Checkbox.prototype, "onKeyDown", {
        get: function () { return this._onKeyDown.event; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Checkbox.prototype, "enabled", {
        get: function () {
            return this.domNode.getAttribute('aria-disabled') !== 'true';
        },
        enumerable: true,
        configurable: true
    });
    Checkbox.prototype.focus = function () {
        this.domNode.focus();
    };
    Object.defineProperty(Checkbox.prototype, "checked", {
        get: function () {
            return this._checked;
        },
        set: function (newIsChecked) {
            this._checked = newIsChecked;
            this.domNode.setAttribute('aria-checked', String(this._checked));
            if (this._checked) {
                this.domNode.classList.add('checked');
            }
            else {
                this.domNode.classList.remove('checked');
            }
            this.applyStyles();
        },
        enumerable: true,
        configurable: true
    });
    Checkbox.prototype.width = function () {
        return 2 /*marginleft*/ + 2 /*border*/ + 2 /*padding*/ + 16 /* icon width */;
    };
    Checkbox.prototype.style = function (styles) {
        if (styles.inputActiveOptionBorder) {
            this._opts.inputActiveOptionBorder = styles.inputActiveOptionBorder;
        }
        this.applyStyles();
    };
    Checkbox.prototype.applyStyles = function () {
        if (this.domNode) {
            this.domNode.style.borderColor = this._checked && this._opts.inputActiveOptionBorder ? this._opts.inputActiveOptionBorder.toString() : 'transparent';
        }
    };
    Checkbox.prototype.enable = function () {
        this.domNode.tabIndex = 0;
        this.domNode.setAttribute('aria-disabled', String(false));
    };
    Checkbox.prototype.disable = function () {
        DOM.removeTabIndexAndUpdateFocus(this.domNode);
        this.domNode.setAttribute('aria-disabled', String(true));
    };
    return Checkbox;
}(Widget));
export { Checkbox };
