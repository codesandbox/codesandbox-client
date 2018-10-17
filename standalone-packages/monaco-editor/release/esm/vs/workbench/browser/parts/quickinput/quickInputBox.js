/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import './quickInput.css';
import * as dom from '../../../../base/browser/dom.js';
import { InputBox } from '../../../../base/browser/ui/inputbox/inputBox.js';
import { inputBackground, inputForeground, inputBorder, inputValidationInfoBackground, inputValidationInfoForeground, inputValidationInfoBorder, inputValidationWarningBackground, inputValidationWarningForeground, inputValidationWarningBorder, inputValidationErrorBackground, inputValidationErrorForeground, inputValidationErrorBorder } from '../../../../platform/theme/common/colorRegistry.js';
import { dispose } from '../../../../base/common/lifecycle.js';
import { StandardKeyboardEvent } from '../../../../base/browser/keyboardEvent.js';
import Severity from '../../../../base/common/severity.js';
var $ = dom.$;
var QuickInputBox = /** @class */ (function () {
    function QuickInputBox(parent) {
        var _this = this;
        this.parent = parent;
        this.disposables = [];
        this.onKeyDown = function (handler) {
            return dom.addDisposableListener(_this.inputBox.inputElement, dom.EventType.KEY_DOWN, function (e) {
                handler(new StandardKeyboardEvent(e));
            });
        };
        this.onDidChange = function (handler) {
            return _this.inputBox.onDidChange(handler);
        };
        this.container = dom.append(this.parent, $('.quick-input-box'));
        this.inputBox = new InputBox(this.container, null);
        this.disposables.push(this.inputBox);
    }
    Object.defineProperty(QuickInputBox.prototype, "value", {
        get: function () {
            return this.inputBox.value;
        },
        set: function (value) {
            this.inputBox.value = value;
        },
        enumerable: true,
        configurable: true
    });
    QuickInputBox.prototype.select = function (range) {
        if (range === void 0) { range = null; }
        this.inputBox.select(range);
    };
    QuickInputBox.prototype.setPlaceholder = function (placeholder) {
        this.inputBox.setPlaceHolder(placeholder);
    };
    Object.defineProperty(QuickInputBox.prototype, "placeholder", {
        get: function () {
            return this.inputBox.inputElement.getAttribute('placeholder');
        },
        set: function (placeholder) {
            this.inputBox.setPlaceHolder(placeholder);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QuickInputBox.prototype, "password", {
        get: function () {
            return this.inputBox.inputElement.type === 'password';
        },
        set: function (password) {
            this.inputBox.inputElement.type = password ? 'password' : 'text';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QuickInputBox.prototype, "enabled", {
        set: function (enabled) {
            this.inputBox.setEnabled(enabled);
        },
        enumerable: true,
        configurable: true
    });
    QuickInputBox.prototype.setAttribute = function (name, value) {
        this.inputBox.inputElement.setAttribute(name, value);
    };
    QuickInputBox.prototype.removeAttribute = function (name) {
        this.inputBox.inputElement.removeAttribute(name);
    };
    QuickInputBox.prototype.showDecoration = function (decoration) {
        if (decoration === Severity.Ignore) {
            this.inputBox.hideMessage();
        }
        else {
            this.inputBox.showMessage({ type: decoration === Severity.Info ? 1 /* INFO */ : decoration === Severity.Warning ? 2 /* WARNING */ : 3 /* ERROR */, content: '' });
        }
    };
    QuickInputBox.prototype.setFocus = function () {
        this.inputBox.focus();
    };
    QuickInputBox.prototype.layout = function () {
        this.inputBox.layout();
    };
    QuickInputBox.prototype.style = function (theme) {
        this.inputBox.style({
            inputForeground: theme.getColor(inputForeground),
            inputBackground: theme.getColor(inputBackground),
            inputBorder: theme.getColor(inputBorder),
            inputValidationInfoBackground: theme.getColor(inputValidationInfoBackground),
            inputValidationInfoForeground: theme.getColor(inputValidationInfoForeground),
            inputValidationInfoBorder: theme.getColor(inputValidationInfoBorder),
            inputValidationWarningBackground: theme.getColor(inputValidationWarningBackground),
            inputValidationWarningForeground: theme.getColor(inputValidationWarningForeground),
            inputValidationWarningBorder: theme.getColor(inputValidationWarningBorder),
            inputValidationErrorBackground: theme.getColor(inputValidationErrorBackground),
            inputValidationErrorForeground: theme.getColor(inputValidationErrorForeground),
            inputValidationErrorBorder: theme.getColor(inputValidationErrorBorder),
        });
    };
    QuickInputBox.prototype.dispose = function () {
        this.disposables = dispose(this.disposables);
    };
    return QuickInputBox;
}());
export { QuickInputBox };
