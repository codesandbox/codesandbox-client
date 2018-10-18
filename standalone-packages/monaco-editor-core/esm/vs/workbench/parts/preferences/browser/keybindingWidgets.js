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
import './media/keybindings.css';
import * as nls from '../../../../nls';
import { OS } from '../../../../base/common/platform';
import { TPromise } from '../../../../base/common/winjs.base';
import { Disposable, dispose, toDisposable } from '../../../../base/common/lifecycle';
import { Emitter } from '../../../../base/common/event';
import { KeybindingLabel } from '../../../../base/browser/ui/keybindingLabel/keybindingLabel';
import { Widget } from '../../../../base/browser/ui/widget';
import * as dom from '../../../../base/browser/dom';
import { StandardKeyboardEvent } from '../../../../base/browser/keyboardEvent';
import { createFastDomNode } from '../../../../base/browser/fastDomNode';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding';
import { IContextViewService } from '../../../../platform/contextview/browser/contextView';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation';
import { attachInputBoxStyler, attachStylerCallback } from '../../../../platform/theme/common/styler';
import { IThemeService } from '../../../../platform/theme/common/themeService';
import { editorWidgetBackground, widgetShadow } from '../../../../platform/theme/common/colorRegistry';
import { SearchWidget } from './preferencesWidgets';
var KeybindingsSearchWidget = /** @class */ (function (_super) {
    __extends(KeybindingsSearchWidget, _super);
    function KeybindingsSearchWidget(parent, options, contextViewService, keybindingService, instantiationService, themeService) {
        var _this = _super.call(this, parent, options, contextViewService, instantiationService, themeService) || this;
        _this.keybindingService = keybindingService;
        _this.recordDisposables = [];
        _this._onKeybinding = _this._register(new Emitter());
        _this.onKeybinding = _this._onKeybinding.event;
        _this._onEnter = _this._register(new Emitter());
        _this.onEnter = _this._onEnter.event;
        _this._onEscape = _this._register(new Emitter());
        _this.onEscape = _this._onEscape.event;
        _this._onBlur = _this._register(new Emitter());
        _this.onBlur = _this._onBlur.event;
        _this._register(attachInputBoxStyler(_this.inputBox, themeService));
        _this._register(toDisposable(function () { return _this.stopRecordingKeys(); }));
        _this._reset();
        return _this;
    }
    KeybindingsSearchWidget.prototype.clear = function () {
        this._reset();
        _super.prototype.clear.call(this);
    };
    KeybindingsSearchWidget.prototype.startRecordingKeys = function () {
        var _this = this;
        this.recordDisposables.push(dom.addDisposableListener(this.inputBox.inputElement, dom.EventType.KEY_DOWN, function (e) { return _this._onKeyDown(new StandardKeyboardEvent(e)); }));
        this.recordDisposables.push(dom.addDisposableListener(this.inputBox.inputElement, dom.EventType.BLUR, function () { return _this._onBlur.fire(); }));
        this.recordDisposables.push(dom.addDisposableListener(this.inputBox.inputElement, dom.EventType.INPUT, function () {
            // Prevent other characters from showing up
            _this.setInputValue(_this._inputValue);
        }));
    };
    KeybindingsSearchWidget.prototype.stopRecordingKeys = function () {
        this._reset();
        dispose(this.recordDisposables);
    };
    KeybindingsSearchWidget.prototype.setInputValue = function (value) {
        this._inputValue = value;
        this.inputBox.value = this._inputValue;
    };
    KeybindingsSearchWidget.prototype.focus = function () {
        this.inputBox.focus();
    };
    KeybindingsSearchWidget.prototype._reset = function () {
        this._firstPart = null;
        this._chordPart = null;
    };
    KeybindingsSearchWidget.prototype._onKeyDown = function (keyboardEvent) {
        keyboardEvent.preventDefault();
        keyboardEvent.stopPropagation();
        var options = this.options;
        if (!options.recordEnter && keyboardEvent.equals(3 /* Enter */)) {
            this._onEnter.fire();
            return;
        }
        if (keyboardEvent.equals(9 /* Escape */)) {
            this._onEscape.fire();
            return;
        }
        this.printKeybinding(keyboardEvent);
    };
    KeybindingsSearchWidget.prototype.printKeybinding = function (keyboardEvent) {
        var keybinding = this.keybindingService.resolveKeyboardEvent(keyboardEvent);
        var info = "code: " + keyboardEvent.browserEvent.code + ", keyCode: " + keyboardEvent.browserEvent.keyCode + ", key: " + keyboardEvent.browserEvent.key + " => UI: " + keybinding.getAriaLabel() + ", user settings: " + keybinding.getUserSettingsLabel() + ", dispatch: " + keybinding.getDispatchParts()[0];
        var hasFirstPart = (this._firstPart && this._firstPart.getDispatchParts()[0] !== null);
        var hasChordPart = (this._chordPart && this._chordPart.getDispatchParts()[0] !== null);
        if (hasFirstPart && hasChordPart) {
            // Reset
            this._firstPart = keybinding;
            this._chordPart = null;
        }
        else if (!hasFirstPart) {
            this._firstPart = keybinding;
        }
        else {
            this._chordPart = keybinding;
        }
        var value = '';
        if (this._firstPart) {
            value = this._firstPart.getUserSettingsLabel();
        }
        if (this._chordPart) {
            value = value + ' ' + this._chordPart.getUserSettingsLabel();
        }
        this.setInputValue(value);
        this.inputBox.inputElement.title = info;
        this._onKeybinding.fire([this._firstPart, this._chordPart]);
    };
    KeybindingsSearchWidget = __decorate([
        __param(2, IContextViewService),
        __param(3, IKeybindingService),
        __param(4, IInstantiationService),
        __param(5, IThemeService)
    ], KeybindingsSearchWidget);
    return KeybindingsSearchWidget;
}(SearchWidget));
export { KeybindingsSearchWidget };
var DefineKeybindingWidget = /** @class */ (function (_super) {
    __extends(DefineKeybindingWidget, _super);
    function DefineKeybindingWidget(parent, instantiationService, themeService) {
        var _this = _super.call(this) || this;
        _this.instantiationService = instantiationService;
        _this.themeService = themeService;
        _this._firstPart = null;
        _this._chordPart = null;
        _this._isVisible = false;
        _this._onHide = _this._register(new Emitter());
        _this._onDidChange = _this._register(new Emitter());
        _this.onDidChange = _this._onDidChange.event;
        _this._onShowExistingKeybindings = _this._register(new Emitter());
        _this.onShowExistingKeybidings = _this._onShowExistingKeybindings.event;
        _this.create();
        if (parent) {
            dom.append(parent, _this._domNode.domNode);
        }
        return _this;
    }
    Object.defineProperty(DefineKeybindingWidget.prototype, "domNode", {
        get: function () {
            return this._domNode.domNode;
        },
        enumerable: true,
        configurable: true
    });
    DefineKeybindingWidget.prototype.define = function () {
        var _this = this;
        this._keybindingInputWidget.clear();
        return new TPromise(function (c, e) {
            if (!_this._isVisible) {
                _this._isVisible = true;
                _this._domNode.setDisplay('block');
                _this._firstPart = null;
                _this._chordPart = null;
                _this._keybindingInputWidget.setInputValue('');
                dom.clearNode(_this._outputNode);
                dom.clearNode(_this._showExistingKeybindingsNode);
                _this._keybindingInputWidget.focus();
            }
            var disposable = _this._onHide.event(function () {
                c(_this.getUserSettingsLabel());
                disposable.dispose();
            });
        });
    };
    DefineKeybindingWidget.prototype.layout = function (layout) {
        var top = Math.round((layout.height - DefineKeybindingWidget.HEIGHT) / 2);
        this._domNode.setTop(top);
        var left = Math.round((layout.width - DefineKeybindingWidget.WIDTH) / 2);
        this._domNode.setLeft(left);
    };
    DefineKeybindingWidget.prototype.printExisting = function (numberOfExisting) {
        var _this = this;
        if (numberOfExisting > 0) {
            var existingElement = dom.$('span.existingText');
            var text = numberOfExisting === 1 ? nls.localize('defineKeybinding.oneExists', "1 existing command has this keybinding", numberOfExisting) : nls.localize('defineKeybinding.existing', "{0} existing commands have this keybinding", numberOfExisting);
            dom.append(existingElement, document.createTextNode(text));
            this._showExistingKeybindingsNode.appendChild(existingElement);
            existingElement.onmousedown = function (e) { e.preventDefault(); };
            existingElement.onmouseup = function (e) { e.preventDefault(); };
            existingElement.onclick = function () { _this._onShowExistingKeybindings.fire(_this.getUserSettingsLabel()); };
        }
    };
    DefineKeybindingWidget.prototype.create = function () {
        var _this = this;
        this._domNode = createFastDomNode(document.createElement('div'));
        this._domNode.setDisplay('none');
        this._domNode.setClassName('defineKeybindingWidget');
        this._domNode.setWidth(DefineKeybindingWidget.WIDTH);
        this._domNode.setHeight(DefineKeybindingWidget.HEIGHT);
        var message = nls.localize('defineKeybinding.initial', "Press desired key combination and then press ENTER.");
        dom.append(this._domNode.domNode, dom.$('.message', null, message));
        this._register(attachStylerCallback(this.themeService, { editorWidgetBackground: editorWidgetBackground, widgetShadow: widgetShadow }, function (colors) {
            if (colors.editorWidgetBackground) {
                _this._domNode.domNode.style.backgroundColor = colors.editorWidgetBackground.toString();
            }
            else {
                _this._domNode.domNode.style.backgroundColor = null;
            }
            if (colors.widgetShadow) {
                _this._domNode.domNode.style.boxShadow = "0 2px 8px " + colors.widgetShadow;
            }
            else {
                _this._domNode.domNode.style.boxShadow = null;
            }
        }));
        this._keybindingInputWidget = this._register(this.instantiationService.createInstance(KeybindingsSearchWidget, this._domNode.domNode, { ariaLabel: message }));
        this._keybindingInputWidget.startRecordingKeys();
        this._register(this._keybindingInputWidget.onKeybinding(function (keybinding) { return _this.onKeybinding(keybinding); }));
        this._register(this._keybindingInputWidget.onEnter(function () { return _this.hide(); }));
        this._register(this._keybindingInputWidget.onEscape(function () { return _this.onCancel(); }));
        this._register(this._keybindingInputWidget.onBlur(function () { return _this.onCancel(); }));
        this._outputNode = dom.append(this._domNode.domNode, dom.$('.output'));
        this._showExistingKeybindingsNode = dom.append(this._domNode.domNode, dom.$('.existing'));
    };
    DefineKeybindingWidget.prototype.onKeybinding = function (keybinding) {
        var firstPart = keybinding[0], chordPart = keybinding[1];
        this._firstPart = firstPart;
        this._chordPart = chordPart;
        dom.clearNode(this._outputNode);
        dom.clearNode(this._showExistingKeybindingsNode);
        new KeybindingLabel(this._outputNode, OS).set(this._firstPart, null);
        if (this._chordPart) {
            this._outputNode.appendChild(document.createTextNode(nls.localize('defineKeybinding.chordsTo', "chord to")));
            new KeybindingLabel(this._outputNode, OS).set(this._chordPart, null);
        }
        var label = this.getUserSettingsLabel();
        if (label) {
            this._onDidChange.fire(label);
        }
    };
    DefineKeybindingWidget.prototype.getUserSettingsLabel = function () {
        var label = null;
        if (this._firstPart) {
            label = this._firstPart.getUserSettingsLabel();
            if (this._chordPart) {
                label = label + ' ' + this._chordPart.getUserSettingsLabel();
            }
        }
        return label;
    };
    DefineKeybindingWidget.prototype.onCancel = function () {
        this._firstPart = null;
        this._chordPart = null;
        this.hide();
    };
    DefineKeybindingWidget.prototype.hide = function () {
        this._domNode.setDisplay('none');
        this._isVisible = false;
        this._onHide.fire();
    };
    DefineKeybindingWidget.WIDTH = 400;
    DefineKeybindingWidget.HEIGHT = 110;
    DefineKeybindingWidget = __decorate([
        __param(1, IInstantiationService),
        __param(2, IThemeService)
    ], DefineKeybindingWidget);
    return DefineKeybindingWidget;
}(Widget));
export { DefineKeybindingWidget };
var DefineKeybindingOverlayWidget = /** @class */ (function (_super) {
    __extends(DefineKeybindingOverlayWidget, _super);
    function DefineKeybindingOverlayWidget(_editor, instantiationService) {
        var _this = _super.call(this) || this;
        _this._editor = _editor;
        _this._widget = instantiationService.createInstance(DefineKeybindingWidget, null);
        _this._editor.addOverlayWidget(_this);
        return _this;
    }
    DefineKeybindingOverlayWidget.prototype.getId = function () {
        return DefineKeybindingOverlayWidget.ID;
    };
    DefineKeybindingOverlayWidget.prototype.getDomNode = function () {
        return this._widget.domNode;
    };
    DefineKeybindingOverlayWidget.prototype.getPosition = function () {
        return {
            preference: null
        };
    };
    DefineKeybindingOverlayWidget.prototype.dispose = function () {
        this._editor.removeOverlayWidget(this);
        _super.prototype.dispose.call(this);
    };
    DefineKeybindingOverlayWidget.prototype.start = function () {
        this._editor.revealPositionInCenterIfOutsideViewport(this._editor.getPosition(), 0 /* Smooth */);
        var layoutInfo = this._editor.getLayoutInfo();
        this._widget.layout(new dom.Dimension(layoutInfo.width, layoutInfo.height));
        return this._widget.define();
    };
    DefineKeybindingOverlayWidget.ID = 'editor.contrib.defineKeybindingWidget';
    DefineKeybindingOverlayWidget = __decorate([
        __param(1, IInstantiationService)
    ], DefineKeybindingOverlayWidget);
    return DefineKeybindingOverlayWidget;
}(Disposable));
export { DefineKeybindingOverlayWidget };
