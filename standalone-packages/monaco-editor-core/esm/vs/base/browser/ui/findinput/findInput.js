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
import './findInput.css';
import * as nls from '../../../../nls';
import * as dom from '../../dom';
import { HistoryInputBox } from '../inputbox/inputBox';
import { Widget } from '../widget';
import { Emitter } from '../../../common/event';
import { CaseSensitiveCheckbox, WholeWordsCheckbox, RegexCheckbox } from './findInputCheckboxes';
var NLS_DEFAULT_LABEL = nls.localize('defaultLabel', "input");
var FindInput = /** @class */ (function (_super) {
    __extends(FindInput, _super);
    function FindInput(parent, contextViewProvider, options) {
        var _this = _super.call(this) || this;
        _this._onDidOptionChange = _this._register(new Emitter());
        _this.onDidOptionChange = _this._onDidOptionChange.event;
        _this._onKeyDown = _this._register(new Emitter());
        _this.onKeyDown = _this._onKeyDown.event;
        _this._onMouseDown = _this._register(new Emitter());
        _this.onMouseDown = _this._onMouseDown.event;
        _this._onInput = _this._register(new Emitter());
        _this.onInput = _this._onInput.event;
        _this._onKeyUp = _this._register(new Emitter());
        _this.onKeyUp = _this._onKeyUp.event;
        _this._onCaseSensitiveKeyDown = _this._register(new Emitter());
        _this.onCaseSensitiveKeyDown = _this._onCaseSensitiveKeyDown.event;
        _this._onRegexKeyDown = _this._register(new Emitter());
        _this.onRegexKeyDown = _this._onRegexKeyDown.event;
        _this._lastHighlightFindOptions = 0;
        _this.contextViewProvider = contextViewProvider;
        _this.width = options.width || 100;
        _this.placeholder = options.placeholder || '';
        _this.validation = options.validation;
        _this.label = options.label || NLS_DEFAULT_LABEL;
        _this.inputActiveOptionBorder = options.inputActiveOptionBorder;
        _this.inputBackground = options.inputBackground;
        _this.inputForeground = options.inputForeground;
        _this.inputBorder = options.inputBorder;
        _this.inputValidationInfoBorder = options.inputValidationInfoBorder;
        _this.inputValidationInfoBackground = options.inputValidationInfoBackground;
        _this.inputValidationWarningBorder = options.inputValidationWarningBorder;
        _this.inputValidationWarningBackground = options.inputValidationWarningBackground;
        _this.inputValidationErrorBorder = options.inputValidationErrorBorder;
        _this.inputValidationErrorBackground = options.inputValidationErrorBackground;
        _this.regex = null;
        _this.wholeWords = null;
        _this.caseSensitive = null;
        _this.domNode = null;
        _this.inputBox = null;
        _this.buildDomNode(options.appendCaseSensitiveLabel || '', options.appendWholeWordsLabel || '', options.appendRegexLabel || '', options.history);
        if (Boolean(parent)) {
            parent.appendChild(_this.domNode);
        }
        _this.onkeydown(_this.inputBox.inputElement, function (e) { return _this._onKeyDown.fire(e); });
        _this.onkeyup(_this.inputBox.inputElement, function (e) { return _this._onKeyUp.fire(e); });
        _this.oninput(_this.inputBox.inputElement, function (e) { return _this._onInput.fire(); });
        _this.onmousedown(_this.inputBox.inputElement, function (e) { return _this._onMouseDown.fire(e); });
        return _this;
    }
    FindInput.prototype.enable = function () {
        dom.removeClass(this.domNode, 'disabled');
        this.inputBox.enable();
        this.regex.enable();
        this.wholeWords.enable();
        this.caseSensitive.enable();
    };
    FindInput.prototype.disable = function () {
        dom.addClass(this.domNode, 'disabled');
        this.inputBox.disable();
        this.regex.disable();
        this.wholeWords.disable();
        this.caseSensitive.disable();
    };
    FindInput.prototype.setEnabled = function (enabled) {
        if (enabled) {
            this.enable();
        }
        else {
            this.disable();
        }
    };
    FindInput.prototype.clear = function () {
        this.clearValidation();
        this.setValue('');
        this.focus();
    };
    FindInput.prototype.setWidth = function (newWidth) {
        this.width = newWidth;
        this.domNode.style.width = this.width + 'px';
        this.contextViewProvider.layout();
        this.setInputWidth();
    };
    FindInput.prototype.getValue = function () {
        return this.inputBox.value;
    };
    FindInput.prototype.setValue = function (value) {
        if (this.inputBox.value !== value) {
            this.inputBox.value = value;
        }
    };
    FindInput.prototype.style = function (styles) {
        this.inputActiveOptionBorder = styles.inputActiveOptionBorder;
        this.inputBackground = styles.inputBackground;
        this.inputForeground = styles.inputForeground;
        this.inputBorder = styles.inputBorder;
        this.inputValidationInfoBackground = styles.inputValidationInfoBackground;
        this.inputValidationInfoBorder = styles.inputValidationInfoBorder;
        this.inputValidationWarningBackground = styles.inputValidationWarningBackground;
        this.inputValidationWarningBorder = styles.inputValidationWarningBorder;
        this.inputValidationErrorBackground = styles.inputValidationErrorBackground;
        this.inputValidationErrorBorder = styles.inputValidationErrorBorder;
        this.applyStyles();
    };
    FindInput.prototype.applyStyles = function () {
        if (this.domNode) {
            var checkBoxStyles = {
                inputActiveOptionBorder: this.inputActiveOptionBorder,
            };
            this.regex.style(checkBoxStyles);
            this.wholeWords.style(checkBoxStyles);
            this.caseSensitive.style(checkBoxStyles);
            var inputBoxStyles = {
                inputBackground: this.inputBackground,
                inputForeground: this.inputForeground,
                inputBorder: this.inputBorder,
                inputValidationInfoBackground: this.inputValidationInfoBackground,
                inputValidationInfoBorder: this.inputValidationInfoBorder,
                inputValidationWarningBackground: this.inputValidationWarningBackground,
                inputValidationWarningBorder: this.inputValidationWarningBorder,
                inputValidationErrorBackground: this.inputValidationErrorBackground,
                inputValidationErrorBorder: this.inputValidationErrorBorder
            };
            this.inputBox.style(inputBoxStyles);
        }
    };
    FindInput.prototype.select = function () {
        this.inputBox.select();
    };
    FindInput.prototype.focus = function () {
        this.inputBox.focus();
    };
    FindInput.prototype.getCaseSensitive = function () {
        return this.caseSensitive.checked;
    };
    FindInput.prototype.setCaseSensitive = function (value) {
        this.caseSensitive.checked = value;
        this.setInputWidth();
    };
    FindInput.prototype.getWholeWords = function () {
        return this.wholeWords.checked;
    };
    FindInput.prototype.setWholeWords = function (value) {
        this.wholeWords.checked = value;
        this.setInputWidth();
    };
    FindInput.prototype.getRegex = function () {
        return this.regex.checked;
    };
    FindInput.prototype.setRegex = function (value) {
        this.regex.checked = value;
        this.setInputWidth();
        this.validate();
    };
    FindInput.prototype.focusOnCaseSensitive = function () {
        this.caseSensitive.focus();
    };
    FindInput.prototype.focusOnRegex = function () {
        this.regex.focus();
    };
    FindInput.prototype.highlightFindOptions = function () {
        dom.removeClass(this.domNode, 'highlight-' + (this._lastHighlightFindOptions));
        this._lastHighlightFindOptions = 1 - this._lastHighlightFindOptions;
        dom.addClass(this.domNode, 'highlight-' + (this._lastHighlightFindOptions));
    };
    FindInput.prototype.setInputWidth = function () {
        var w = this.width - this.caseSensitive.width() - this.wholeWords.width() - this.regex.width();
        this.inputBox.width = w;
    };
    FindInput.prototype.buildDomNode = function (appendCaseSensitiveLabel, appendWholeWordsLabel, appendRegexLabel, history) {
        var _this = this;
        this.domNode = document.createElement('div');
        this.domNode.style.width = this.width + 'px';
        dom.addClass(this.domNode, 'monaco-findInput');
        this.inputBox = this._register(new HistoryInputBox(this.domNode, this.contextViewProvider, {
            placeholder: this.placeholder || '',
            ariaLabel: this.label || '',
            validationOptions: {
                validation: this.validation || null
            },
            inputBackground: this.inputBackground,
            inputForeground: this.inputForeground,
            inputBorder: this.inputBorder,
            inputValidationInfoBackground: this.inputValidationInfoBackground,
            inputValidationInfoBorder: this.inputValidationInfoBorder,
            inputValidationWarningBackground: this.inputValidationWarningBackground,
            inputValidationWarningBorder: this.inputValidationWarningBorder,
            inputValidationErrorBackground: this.inputValidationErrorBackground,
            inputValidationErrorBorder: this.inputValidationErrorBorder,
            history: history
        }));
        this.regex = this._register(new RegexCheckbox({
            appendTitle: appendRegexLabel,
            isChecked: false,
            inputActiveOptionBorder: this.inputActiveOptionBorder
        }));
        this._register(this.regex.onChange(function (viaKeyboard) {
            _this._onDidOptionChange.fire(viaKeyboard);
            if (!viaKeyboard) {
                _this.inputBox.focus();
            }
            _this.setInputWidth();
            _this.validate();
        }));
        this._register(this.regex.onKeyDown(function (e) {
            _this._onRegexKeyDown.fire(e);
        }));
        this.wholeWords = this._register(new WholeWordsCheckbox({
            appendTitle: appendWholeWordsLabel,
            isChecked: false,
            inputActiveOptionBorder: this.inputActiveOptionBorder
        }));
        this._register(this.wholeWords.onChange(function (viaKeyboard) {
            _this._onDidOptionChange.fire(viaKeyboard);
            if (!viaKeyboard) {
                _this.inputBox.focus();
            }
            _this.setInputWidth();
            _this.validate();
        }));
        this.caseSensitive = this._register(new CaseSensitiveCheckbox({
            appendTitle: appendCaseSensitiveLabel,
            isChecked: false,
            inputActiveOptionBorder: this.inputActiveOptionBorder
        }));
        this._register(this.caseSensitive.onChange(function (viaKeyboard) {
            _this._onDidOptionChange.fire(viaKeyboard);
            if (!viaKeyboard) {
                _this.inputBox.focus();
            }
            _this.setInputWidth();
            _this.validate();
        }));
        this._register(this.caseSensitive.onKeyDown(function (e) {
            _this._onCaseSensitiveKeyDown.fire(e);
        }));
        // Arrow-Key support to navigate between options
        var indexes = [this.caseSensitive.domNode, this.wholeWords.domNode, this.regex.domNode];
        this.onkeydown(this.domNode, function (event) {
            if (event.equals(15 /* LeftArrow */) || event.equals(17 /* RightArrow */) || event.equals(9 /* Escape */)) {
                var index = indexes.indexOf(document.activeElement);
                if (index >= 0) {
                    var newIndex = void 0;
                    if (event.equals(17 /* RightArrow */)) {
                        newIndex = (index + 1) % indexes.length;
                    }
                    else if (event.equals(15 /* LeftArrow */)) {
                        if (index === 0) {
                            newIndex = indexes.length - 1;
                        }
                        else {
                            newIndex = index - 1;
                        }
                    }
                    if (event.equals(9 /* Escape */)) {
                        indexes[index].blur();
                    }
                    else if (newIndex >= 0) {
                        indexes[newIndex].focus();
                    }
                    dom.EventHelper.stop(event, true);
                }
            }
        });
        this.setInputWidth();
        var controls = document.createElement('div');
        controls.className = 'controls';
        controls.appendChild(this.caseSensitive.domNode);
        controls.appendChild(this.wholeWords.domNode);
        controls.appendChild(this.regex.domNode);
        this.domNode.appendChild(controls);
    };
    FindInput.prototype.validate = function () {
        this.inputBox.validate();
    };
    FindInput.prototype.showMessage = function (message) {
        this.inputBox.showMessage(message);
    };
    FindInput.prototype.clearMessage = function () {
        this.inputBox.hideMessage();
    };
    FindInput.prototype.clearValidation = function () {
        this.inputBox.hideMessage();
    };
    FindInput.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
    };
    FindInput.OPTION_CHANGE = 'optionChange';
    return FindInput;
}(Widget));
export { FindInput };
