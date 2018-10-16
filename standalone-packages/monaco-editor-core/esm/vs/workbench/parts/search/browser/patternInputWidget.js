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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import * as nls from '../../../../nls';
import * as dom from '../../../../base/browser/dom';
import { Widget } from '../../../../base/browser/ui/widget';
import { Checkbox } from '../../../../base/browser/ui/checkbox/checkbox';
import { Emitter } from '../../../../base/common/event';
import { IThemeService } from '../../../../platform/theme/common/themeService';
import { attachInputBoxStyler, attachCheckboxStyler } from '../../../../platform/theme/common/styler';
import { ContextScopedHistoryInputBox } from '../../../../platform/widget/browser/contextScopedHistoryWidget';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey';
var PatternInputWidget = /** @class */ (function (_super) {
    __extends(PatternInputWidget, _super);
    function PatternInputWidget(parent, contextViewProvider, options, themeService, contextKeyService) {
        if (options === void 0) { options = Object.create(null); }
        var _this = _super.call(this) || this;
        _this.contextViewProvider = contextViewProvider;
        _this.themeService = themeService;
        _this.contextKeyService = contextKeyService;
        _this._onSubmit = _this._register(new Emitter());
        _this.onSubmit = _this._onSubmit.event;
        _this._onCancel = _this._register(new Emitter());
        _this.onCancel = _this._onCancel.event;
        _this.onOptionChange = null;
        _this.width = options.width || 100;
        _this.placeholder = options.placeholder || '';
        _this.ariaLabel = options.ariaLabel || nls.localize('defaultLabel', "input");
        _this.domNode = null;
        _this.inputBox = null;
        _this.render(options);
        parent.appendChild(_this.domNode);
        return _this;
    }
    PatternInputWidget.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        if (this.inputFocusTracker) {
            this.inputFocusTracker.dispose();
        }
    };
    PatternInputWidget.prototype.on = function (eventType, handler) {
        switch (eventType) {
            case 'keydown':
            case 'keyup':
                this._register(dom.addDisposableListener(this.inputBox.inputElement, eventType, handler));
                break;
            case PatternInputWidget.OPTION_CHANGE:
                this.onOptionChange = handler;
                break;
        }
        return this;
    };
    PatternInputWidget.prototype.setWidth = function (newWidth) {
        this.width = newWidth;
        this.domNode.style.width = this.width + 'px';
        this.contextViewProvider.layout();
        this.setInputWidth();
    };
    PatternInputWidget.prototype.getValue = function () {
        return this.inputBox.value;
    };
    PatternInputWidget.prototype.setValue = function (value) {
        if (this.inputBox.value !== value) {
            this.inputBox.value = value;
        }
    };
    PatternInputWidget.prototype.select = function () {
        this.inputBox.select();
    };
    PatternInputWidget.prototype.focus = function () {
        this.inputBox.focus();
    };
    PatternInputWidget.prototype.inputHasFocus = function () {
        return this.inputBox.hasFocus();
    };
    PatternInputWidget.prototype.setInputWidth = function () {
        this.inputBox.width = this.width - this.getSubcontrolsWidth() - 2; // 2 for input box border
    };
    PatternInputWidget.prototype.getSubcontrolsWidth = function () {
        return 0;
    };
    PatternInputWidget.prototype.getHistory = function () {
        return this.inputBox.getHistory();
    };
    PatternInputWidget.prototype.clearHistory = function () {
        this.inputBox.clearHistory();
    };
    PatternInputWidget.prototype.onSearchSubmit = function () {
        this.inputBox.addToHistory();
    };
    PatternInputWidget.prototype.showNextTerm = function () {
        this.inputBox.showNextValue();
    };
    PatternInputWidget.prototype.showPreviousTerm = function () {
        this.inputBox.showPreviousValue();
    };
    PatternInputWidget.prototype.render = function (options) {
        var _this = this;
        this.domNode = document.createElement('div');
        this.domNode.style.width = this.width + 'px';
        dom.addClass(this.domNode, 'monaco-findInput');
        this.inputBox = new ContextScopedHistoryInputBox(this.domNode, this.contextViewProvider, {
            placeholder: this.placeholder || '',
            ariaLabel: this.ariaLabel || '',
            validationOptions: {
                validation: null
            },
            history: options.history || []
        }, this.contextKeyService);
        this._register(attachInputBoxStyler(this.inputBox, this.themeService));
        this.inputFocusTracker = dom.trackFocus(this.inputBox.inputElement);
        this.onkeyup(this.inputBox.inputElement, function (keyboardEvent) { return _this.onInputKeyUp(keyboardEvent); });
        var controls = document.createElement('div');
        controls.className = 'controls';
        this.renderSubcontrols(controls);
        this.domNode.appendChild(controls);
        this.setInputWidth();
    };
    PatternInputWidget.prototype.renderSubcontrols = function (controlsDiv) {
    };
    PatternInputWidget.prototype.onInputKeyUp = function (keyboardEvent) {
        switch (keyboardEvent.keyCode) {
            case 3 /* Enter */:
                this._onSubmit.fire();
                return;
            case 9 /* Escape */:
                this._onCancel.fire();
                return;
            default:
                return;
        }
    };
    PatternInputWidget.OPTION_CHANGE = 'optionChange';
    PatternInputWidget = __decorate([
        __param(3, IThemeService),
        __param(4, IContextKeyService)
    ], PatternInputWidget);
    return PatternInputWidget;
}(Widget));
export { PatternInputWidget };
var ExcludePatternInputWidget = /** @class */ (function (_super) {
    __extends(ExcludePatternInputWidget, _super);
    function ExcludePatternInputWidget(parent, contextViewProvider, options, themeService, contextKeyService) {
        if (options === void 0) { options = Object.create(null); }
        return _super.call(this, parent, contextViewProvider, options, themeService, contextKeyService) || this;
    }
    ExcludePatternInputWidget.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this.useExcludesAndIgnoreFilesBox.dispose();
    };
    ExcludePatternInputWidget.prototype.useExcludesAndIgnoreFiles = function () {
        return this.useExcludesAndIgnoreFilesBox.checked;
    };
    ExcludePatternInputWidget.prototype.setUseExcludesAndIgnoreFiles = function (value) {
        this.useExcludesAndIgnoreFilesBox.checked = value;
    };
    ExcludePatternInputWidget.prototype.getSubcontrolsWidth = function () {
        return _super.prototype.getSubcontrolsWidth.call(this) + this.useExcludesAndIgnoreFilesBox.width();
    };
    ExcludePatternInputWidget.prototype.renderSubcontrols = function (controlsDiv) {
        var _this = this;
        this.useExcludesAndIgnoreFilesBox = this._register(new Checkbox({
            actionClassName: 'useExcludesAndIgnoreFiles',
            title: nls.localize('useExcludesAndIgnoreFilesDescription', "Use Exclude Settings and Ignore Files"),
            isChecked: true,
        }));
        this._register(this.useExcludesAndIgnoreFilesBox.onChange(function (viaKeyboard) {
            _this.onOptionChange(null);
            if (!viaKeyboard) {
                _this.inputBox.focus();
            }
        }));
        this._register(attachCheckboxStyler(this.useExcludesAndIgnoreFilesBox, this.themeService));
        controlsDiv.appendChild(this.useExcludesAndIgnoreFilesBox.domNode);
        _super.prototype.renderSubcontrols.call(this, controlsDiv);
    };
    ExcludePatternInputWidget = __decorate([
        __param(3, IThemeService),
        __param(4, IContextKeyService)
    ], ExcludePatternInputWidget);
    return ExcludePatternInputWidget;
}(PatternInputWidget));
export { ExcludePatternInputWidget };
