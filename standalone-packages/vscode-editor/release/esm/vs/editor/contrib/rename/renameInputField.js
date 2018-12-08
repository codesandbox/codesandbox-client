/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import './renameInputField.css';
import { localize } from '../../../nls.js';
import { dispose } from '../../../base/common/lifecycle.js';
import { Range } from '../../common/core/range.js';
import { IThemeService } from '../../../platform/theme/common/themeService.js';
import { inputBackground, inputBorder, inputForeground, widgetShadow } from '../../../platform/theme/common/colorRegistry.js';
import { Position } from '../../common/core/position.js';
var RenameInputField = /** @class */ (function () {
    function RenameInputField(editor, themeService) {
        var _this = this;
        this.themeService = themeService;
        this._disposables = [];
        // Editor.IContentWidget.allowEditorOverflow
        this.allowEditorOverflow = true;
        this._currentAcceptInput = null;
        this._currentCancelInput = null;
        this._editor = editor;
        this._editor.addContentWidget(this);
        this._disposables.push(editor.onDidChangeConfiguration(function (e) {
            if (e.fontInfo) {
                _this.updateFont();
            }
        }));
        this._disposables.push(themeService.onThemeChange(function (theme) { return _this.onThemeChange(theme); }));
    }
    RenameInputField.prototype.onThemeChange = function (theme) {
        this.updateStyles(theme);
    };
    RenameInputField.prototype.dispose = function () {
        this._disposables = dispose(this._disposables);
        this._editor.removeContentWidget(this);
    };
    RenameInputField.prototype.getId = function () {
        return '__renameInputWidget';
    };
    RenameInputField.prototype.getDomNode = function () {
        if (!this._domNode) {
            this._inputField = document.createElement('input');
            this._inputField.className = 'rename-input';
            this._inputField.type = 'text';
            this._inputField.setAttribute('aria-label', localize('renameAriaLabel', "Rename input. Type new name and press Enter to commit."));
            this._domNode = document.createElement('div');
            this._domNode.style.height = this._editor.getConfiguration().lineHeight + "px";
            this._domNode.className = 'monaco-editor rename-box';
            this._domNode.appendChild(this._inputField);
            this.updateFont();
            this.updateStyles(this.themeService.getTheme());
        }
        return this._domNode;
    };
    RenameInputField.prototype.updateStyles = function (theme) {
        if (!this._inputField) {
            return;
        }
        var background = theme.getColor(inputBackground);
        var foreground = theme.getColor(inputForeground);
        var widgetShadowColor = theme.getColor(widgetShadow);
        var border = theme.getColor(inputBorder);
        this._inputField.style.backgroundColor = background ? background.toString() : null;
        this._inputField.style.color = foreground ? foreground.toString() : null;
        this._inputField.style.borderWidth = border ? '1px' : '0px';
        this._inputField.style.borderStyle = border ? 'solid' : 'none';
        this._inputField.style.borderColor = border ? border.toString() : 'none';
        this._domNode.style.boxShadow = widgetShadowColor ? " 0 2px 8px " + widgetShadowColor : null;
    };
    RenameInputField.prototype.updateFont = function () {
        if (!this._inputField) {
            return;
        }
        var fontInfo = this._editor.getConfiguration().fontInfo;
        this._inputField.style.fontFamily = fontInfo.fontFamily;
        this._inputField.style.fontWeight = fontInfo.fontWeight;
        this._inputField.style.fontSize = fontInfo.fontSize + "px";
    };
    RenameInputField.prototype.getPosition = function () {
        return this._visible
            ? { position: this._position, preference: [2 /* BELOW */, 1 /* ABOVE */] }
            : null;
    };
    RenameInputField.prototype.acceptInput = function () {
        if (this._currentAcceptInput) {
            this._currentAcceptInput();
        }
    };
    RenameInputField.prototype.cancelInput = function (focusEditor) {
        if (this._currentCancelInput) {
            this._currentCancelInput(focusEditor);
        }
    };
    RenameInputField.prototype.getInput = function (where, value, selectionStart, selectionEnd) {
        var _this = this;
        this._position = new Position(where.startLineNumber, where.startColumn);
        this._inputField.value = value;
        this._inputField.setAttribute('selectionStart', selectionStart.toString());
        this._inputField.setAttribute('selectionEnd', selectionEnd.toString());
        this._inputField.size = Math.max((where.endColumn - where.startColumn) * 1.1, 20);
        var disposeOnDone = [], always;
        always = function () {
            dispose(disposeOnDone);
            _this._hide();
        };
        return new Promise(function (resolve) {
            _this._currentCancelInput = function (focusEditor) {
                _this._currentAcceptInput = null;
                _this._currentCancelInput = null;
                resolve(focusEditor);
                return true;
            };
            _this._currentAcceptInput = function () {
                if (_this._inputField.value.trim().length === 0 || _this._inputField.value === value) {
                    // empty or whitespace only or not changed
                    _this.cancelInput(true);
                    return;
                }
                _this._currentAcceptInput = null;
                _this._currentCancelInput = null;
                resolve(_this._inputField.value);
            };
            var onCursorChanged = function () {
                var editorPosition = _this._editor.getPosition();
                if (!editorPosition || !Range.containsPosition(where, editorPosition)) {
                    _this.cancelInput(true);
                }
            };
            disposeOnDone.push(_this._editor.onDidChangeCursorSelection(onCursorChanged));
            disposeOnDone.push(_this._editor.onDidBlurEditorWidget(function () { return _this.cancelInput(false); }));
            _this._show();
        }).then(function (newValue) {
            always();
            return newValue;
        }, function (err) {
            always();
            return Promise.reject(err);
        });
    };
    RenameInputField.prototype._show = function () {
        var _this = this;
        this._editor.revealLineInCenterIfOutsideViewport(this._position.lineNumber, 0 /* Smooth */);
        this._visible = true;
        this._editor.layoutContentWidget(this);
        setTimeout(function () {
            _this._inputField.focus();
            _this._inputField.setSelectionRange(parseInt(_this._inputField.getAttribute('selectionStart')), parseInt(_this._inputField.getAttribute('selectionEnd')));
        }, 100);
    };
    RenameInputField.prototype._hide = function () {
        this._visible = false;
        this._editor.layoutContentWidget(this);
    };
    RenameInputField = __decorate([
        __param(1, IThemeService)
    ], RenameInputField);
    return RenameInputField;
}());
export default RenameInputField;
