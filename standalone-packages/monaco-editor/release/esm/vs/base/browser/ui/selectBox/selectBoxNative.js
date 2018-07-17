/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { dispose } from '../../../common/lifecycle.js';
import { Emitter } from '../../../common/event.js';
import * as dom from '../../dom.js';
import * as arrays from '../../../common/arrays.js';
import { isMacintosh } from '../../../common/platform.js';
var SelectBoxNative = /** @class */ (function () {
    function SelectBoxNative(options, selected, styles) {
        this.toDispose = [];
        this.selectElement = document.createElement('select');
        this.selectElement.className = 'monaco-select-box';
        this._onDidSelect = new Emitter();
        this.styles = styles;
        this.registerListeners();
        this.setOptions(options, selected);
    }
    SelectBoxNative.prototype.registerListeners = function () {
        var _this = this;
        this.toDispose.push(dom.addStandardDisposableListener(this.selectElement, 'change', function (e) {
            _this.selectElement.title = e.target.value;
            _this._onDidSelect.fire({
                index: e.target.selectedIndex,
                selected: e.target.value
            });
        }));
        this.toDispose.push(dom.addStandardDisposableListener(this.selectElement, 'keydown', function (e) {
            var showSelect = false;
            if (isMacintosh) {
                if (e.keyCode === 18 /* DownArrow */ || e.keyCode === 16 /* UpArrow */ || e.keyCode === 10 /* Space */) {
                    showSelect = true;
                }
            }
            else {
                if (e.keyCode === 18 /* DownArrow */ && e.altKey || e.keyCode === 10 /* Space */ || e.keyCode === 3 /* Enter */) {
                    showSelect = true;
                }
            }
            if (showSelect) {
                // Space, Enter, is used to expand select box, do not propagate it (prevent action bar action run)
                e.stopPropagation();
            }
        }));
    };
    Object.defineProperty(SelectBoxNative.prototype, "onDidSelect", {
        get: function () {
            return this._onDidSelect.event;
        },
        enumerable: true,
        configurable: true
    });
    SelectBoxNative.prototype.setOptions = function (options, selected, disabled) {
        var _this = this;
        if (!this.options || !arrays.equals(this.options, options)) {
            this.options = options;
            this.selectElement.options.length = 0;
            var i_1 = 0;
            this.options.forEach(function (option) {
                _this.selectElement.add(_this.createOption(option, i_1, disabled === i_1++));
            });
        }
        if (selected !== undefined) {
            this.select(selected);
        }
    };
    SelectBoxNative.prototype.select = function (index) {
        if (index >= 0 && index < this.options.length) {
            this.selected = index;
        }
        else if (index > this.options.length - 1) {
            // Adjust index to end of list
            // This could make client out of sync with the select
            this.select(this.options.length - 1);
        }
        else if (this.selected < 0) {
            this.selected = 0;
        }
        this.selectElement.selectedIndex = this.selected;
        this.selectElement.title = this.options[this.selected];
    };
    SelectBoxNative.prototype.focus = function () {
        if (this.selectElement) {
            this.selectElement.focus();
        }
    };
    SelectBoxNative.prototype.blur = function () {
        if (this.selectElement) {
            this.selectElement.blur();
        }
    };
    SelectBoxNative.prototype.render = function (container) {
        dom.addClass(container, 'select-container');
        container.appendChild(this.selectElement);
        this.setOptions(this.options, this.selected);
        this.applyStyles();
    };
    SelectBoxNative.prototype.style = function (styles) {
        this.styles = styles;
        this.applyStyles();
    };
    SelectBoxNative.prototype.applyStyles = function () {
        // Style native select
        if (this.selectElement) {
            var background = this.styles.selectBackground ? this.styles.selectBackground.toString() : null;
            var foreground = this.styles.selectForeground ? this.styles.selectForeground.toString() : null;
            var border = this.styles.selectBorder ? this.styles.selectBorder.toString() : null;
            this.selectElement.style.backgroundColor = background;
            this.selectElement.style.color = foreground;
            this.selectElement.style.borderColor = border;
        }
    };
    SelectBoxNative.prototype.createOption = function (value, index, disabled) {
        var option = document.createElement('option');
        option.value = value;
        option.text = value;
        option.disabled = disabled;
        return option;
    };
    SelectBoxNative.prototype.dispose = function () {
        this.toDispose = dispose(this.toDispose);
    };
    return SelectBoxNative;
}());
export { SelectBoxNative };
