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
import './button.css';
import * as DOM from '../../dom';
import { StandardKeyboardEvent } from '../../keyboardEvent';
import { Color } from '../../../common/color';
import { mixin } from '../../../common/objects';
import { Emitter } from '../../../common/event';
import { Disposable } from '../../../common/lifecycle';
import { Gesture } from '../../touch';
var defaultOptions = {
    buttonBackground: Color.fromHex('#0E639C'),
    buttonHoverBackground: Color.fromHex('#006BB3'),
    buttonForeground: Color.white
};
var Button = /** @class */ (function (_super) {
    __extends(Button, _super);
    function Button(container, options) {
        var _this = _super.call(this) || this;
        _this._onDidClick = _this._register(new Emitter());
        _this.options = options || Object.create(null);
        mixin(_this.options, defaultOptions, false);
        _this.buttonBackground = _this.options.buttonBackground;
        _this.buttonHoverBackground = _this.options.buttonHoverBackground;
        _this.buttonForeground = _this.options.buttonForeground;
        _this.buttonBorder = _this.options.buttonBorder;
        _this._element = document.createElement('a');
        DOM.addClass(_this._element, 'monaco-button');
        _this._element.tabIndex = 0;
        _this._element.setAttribute('role', 'button');
        container.appendChild(_this._element);
        Gesture.addTarget(_this._element);
        _this._register(DOM.addDisposableListener(_this._element, DOM.EventType.CLICK, function (e) {
            if (!_this.enabled) {
                DOM.EventHelper.stop(e);
                return;
            }
            _this._onDidClick.fire(e);
        }));
        _this._register(DOM.addDisposableListener(_this._element, DOM.EventType.KEY_DOWN, function (e) {
            var event = new StandardKeyboardEvent(e);
            var eventHandled = false;
            if (_this.enabled && event.equals(3 /* Enter */) || event.equals(10 /* Space */)) {
                _this._onDidClick.fire(e);
                eventHandled = true;
            }
            else if (event.equals(9 /* Escape */)) {
                _this._element.blur();
                eventHandled = true;
            }
            if (eventHandled) {
                DOM.EventHelper.stop(event, true);
            }
        }));
        _this._register(DOM.addDisposableListener(_this._element, DOM.EventType.MOUSE_OVER, function (e) {
            if (!DOM.hasClass(_this._element, 'disabled')) {
                _this.setHoverBackground();
            }
        }));
        _this._register(DOM.addDisposableListener(_this._element, DOM.EventType.MOUSE_OUT, function (e) {
            _this.applyStyles(); // restore standard styles
        }));
        // Also set hover background when button is focused for feedback
        _this.focusTracker = _this._register(DOM.trackFocus(_this._element));
        _this._register(_this.focusTracker.onDidFocus(function () { return _this.setHoverBackground(); }));
        _this._register(_this.focusTracker.onDidBlur(function () { return _this.applyStyles(); })); // restore standard styles
        _this.applyStyles();
        return _this;
    }
    Object.defineProperty(Button.prototype, "onDidClick", {
        get: function () { return this._onDidClick.event; },
        enumerable: true,
        configurable: true
    });
    Button.prototype.setHoverBackground = function () {
        var hoverBackground = this.buttonHoverBackground ? this.buttonHoverBackground.toString() : null;
        if (hoverBackground) {
            this._element.style.backgroundColor = hoverBackground;
        }
    };
    Button.prototype.style = function (styles) {
        this.buttonForeground = styles.buttonForeground;
        this.buttonBackground = styles.buttonBackground;
        this.buttonHoverBackground = styles.buttonHoverBackground;
        this.buttonBorder = styles.buttonBorder;
        this.applyStyles();
    };
    Button.prototype.applyStyles = function () {
        if (this._element) {
            var background = this.buttonBackground ? this.buttonBackground.toString() : null;
            var foreground = this.buttonForeground ? this.buttonForeground.toString() : null;
            var border = this.buttonBorder ? this.buttonBorder.toString() : null;
            this._element.style.color = foreground;
            this._element.style.backgroundColor = background;
            this._element.style.borderWidth = border ? '1px' : null;
            this._element.style.borderStyle = border ? 'solid' : null;
            this._element.style.borderColor = border;
        }
    };
    Object.defineProperty(Button.prototype, "element", {
        get: function () {
            return this._element;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Button.prototype, "label", {
        set: function (value) {
            if (!DOM.hasClass(this._element, 'monaco-text-button')) {
                DOM.addClass(this._element, 'monaco-text-button');
            }
            this._element.textContent = value;
            if (this.options.title) {
                this._element.title = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Button.prototype, "icon", {
        set: function (iconClassName) {
            DOM.addClass(this._element, iconClassName);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Button.prototype, "enabled", {
        get: function () {
            return !DOM.hasClass(this._element, 'disabled');
        },
        set: function (value) {
            if (value) {
                DOM.removeClass(this._element, 'disabled');
                this._element.setAttribute('aria-disabled', String(false));
                this._element.tabIndex = 0;
            }
            else {
                DOM.addClass(this._element, 'disabled');
                this._element.setAttribute('aria-disabled', String(true));
                DOM.removeTabIndexAndUpdateFocus(this._element);
            }
        },
        enumerable: true,
        configurable: true
    });
    Button.prototype.focus = function () {
        this._element.focus();
    };
    return Button;
}(Disposable));
export { Button };
var ButtonGroup = /** @class */ (function (_super) {
    __extends(ButtonGroup, _super);
    function ButtonGroup(container, count, options) {
        var _this = _super.call(this) || this;
        _this._buttons = [];
        _this.create(container, count, options);
        return _this;
    }
    Object.defineProperty(ButtonGroup.prototype, "buttons", {
        get: function () {
            return this._buttons;
        },
        enumerable: true,
        configurable: true
    });
    ButtonGroup.prototype.create = function (container, count, options) {
        var _this = this;
        var _loop_1 = function (index) {
            var button = this_1._register(new Button(container, options));
            this_1._buttons.push(button);
            // Implement keyboard access in buttons if there are multiple
            if (count > 1) {
                this_1._register(DOM.addDisposableListener(button.element, DOM.EventType.KEY_DOWN, function (e) {
                    var event = new StandardKeyboardEvent(e);
                    var eventHandled = true;
                    // Next / Previous Button
                    var buttonIndexToFocus;
                    if (event.equals(15 /* LeftArrow */)) {
                        buttonIndexToFocus = index > 0 ? index - 1 : _this._buttons.length - 1;
                    }
                    else if (event.equals(17 /* RightArrow */)) {
                        buttonIndexToFocus = index === _this._buttons.length - 1 ? 0 : index + 1;
                    }
                    else {
                        eventHandled = false;
                    }
                    if (eventHandled) {
                        _this._buttons[buttonIndexToFocus].focus();
                        DOM.EventHelper.stop(e, true);
                    }
                }));
            }
        };
        var this_1 = this;
        for (var index = 0; index < count; index++) {
            _loop_1(index);
        }
    };
    return ButtonGroup;
}(Disposable));
export { ButtonGroup };
