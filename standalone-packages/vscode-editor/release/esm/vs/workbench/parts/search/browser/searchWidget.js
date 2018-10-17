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
import * as browser from '../../../../base/browser/browser.js';
import * as dom from '../../../../base/browser/dom.js';
import { ActionBar } from '../../../../base/browser/ui/actionbar/actionbar.js';
import { Button } from '../../../../base/browser/ui/button/button.js';
import { Widget } from '../../../../base/browser/ui/widget.js';
import { Action } from '../../../../base/common/actions.js';
import { Delayer } from '../../../../base/common/async.js';
import { Emitter } from '../../../../base/common/event.js';
import * as strings from '../../../../base/common/strings.js';
import { TPromise } from '../../../../base/common/winjs.base.js';
import { CONTEXT_FIND_WIDGET_NOT_VISIBLE } from '../../../../editor/contrib/find/findModel.js';
import * as nls from '../../../../nls.js';
import { IClipboardService } from '../../../../platform/clipboard/common/clipboardService.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ContextKeyExpr, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IContextViewService } from '../../../../platform/contextview/browser/contextView.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { KeybindingsRegistry } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { attachFindInputBoxStyler, attachInputBoxStyler } from '../../../../platform/theme/common/styler.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { ContextScopedFindInput, ContextScopedHistoryInputBox } from '../../../../platform/widget/browser/contextScopedHistoryWidget.js';
import { appendKeyBindingLabel, isSearchViewFocused } from './searchActions.js';
import * as Constants from '../common/constants.js';
import { IPanelService } from '../../../services/panel/common/panelService.js';
import { IViewletService } from '../../../services/viewlet/browser/viewlet.js';
var ReplaceAllAction = /** @class */ (function (_super) {
    __extends(ReplaceAllAction, _super);
    function ReplaceAllAction() {
        var _this = _super.call(this, ReplaceAllAction.ID, '', 'action-replace-all', false) || this;
        _this._searchWidget = null;
        return _this;
    }
    Object.defineProperty(ReplaceAllAction, "INSTANCE", {
        get: function () {
            if (ReplaceAllAction.fgInstance === null) {
                ReplaceAllAction.fgInstance = new ReplaceAllAction();
            }
            return ReplaceAllAction.fgInstance;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReplaceAllAction.prototype, "searchWidget", {
        set: function (searchWidget) {
            this._searchWidget = searchWidget;
        },
        enumerable: true,
        configurable: true
    });
    ReplaceAllAction.prototype.run = function () {
        if (this._searchWidget) {
            return this._searchWidget.triggerReplaceAll();
        }
        return TPromise.as(null);
    };
    ReplaceAllAction.fgInstance = null;
    ReplaceAllAction.ID = 'search.action.replaceAll';
    return ReplaceAllAction;
}(Action));
var SearchWidget = /** @class */ (function (_super) {
    __extends(SearchWidget, _super);
    function SearchWidget(container, options, contextViewService, themeService, contextKeyService, keyBindingService, clipboardServce, configurationService) {
        var _this = _super.call(this) || this;
        _this.contextViewService = contextViewService;
        _this.themeService = themeService;
        _this.contextKeyService = contextKeyService;
        _this.keyBindingService = keyBindingService;
        _this.clipboardServce = clipboardServce;
        _this.configurationService = configurationService;
        _this.ignoreGlobalFindBufferOnNextFocus = false;
        _this._onSearchSubmit = _this._register(new Emitter());
        _this.onSearchSubmit = _this._onSearchSubmit.event;
        _this._onSearchCancel = _this._register(new Emitter());
        _this.onSearchCancel = _this._onSearchCancel.event;
        _this._onReplaceToggled = _this._register(new Emitter());
        _this.onReplaceToggled = _this._onReplaceToggled.event;
        _this._onReplaceStateChange = _this._register(new Emitter());
        _this.onReplaceStateChange = _this._onReplaceStateChange.event;
        _this._onReplaceValueChanged = _this._register(new Emitter());
        _this.onReplaceValueChanged = _this._onReplaceValueChanged.event;
        _this._onReplaceAll = _this._register(new Emitter());
        _this.onReplaceAll = _this._onReplaceAll.event;
        _this._onBlur = _this._register(new Emitter());
        _this.onBlur = _this._onBlur.event;
        _this.replaceActive = Constants.ReplaceActiveKey.bindTo(_this.contextKeyService);
        _this.searchInputBoxFocused = Constants.SearchInputBoxFocusedKey.bindTo(_this.contextKeyService);
        _this.replaceInputBoxFocused = Constants.ReplaceInputBoxFocusedKey.bindTo(_this.contextKeyService);
        _this._replaceHistoryDelayer = new Delayer(500);
        _this.render(container, options);
        _this.configurationService.onDidChangeConfiguration(function (e) {
            if (e.affectsConfiguration('editor.accessibilitySupport')) {
                _this.updateAccessibilitySupport();
            }
        });
        browser.onDidChangeAccessibilitySupport(function () { return _this.updateAccessibilitySupport(); });
        _this.updateAccessibilitySupport();
        return _this;
    }
    SearchWidget.prototype.focus = function (select, focusReplace, suppressGlobalSearchBuffer) {
        if (select === void 0) { select = true; }
        if (focusReplace === void 0) { focusReplace = false; }
        if (suppressGlobalSearchBuffer === void 0) { suppressGlobalSearchBuffer = false; }
        this.ignoreGlobalFindBufferOnNextFocus = suppressGlobalSearchBuffer;
        if (focusReplace && this.isReplaceShown()) {
            this.replaceInput.focus();
            if (select) {
                this.replaceInput.select();
            }
        }
        else {
            this.searchInput.focus();
            if (select) {
                this.searchInput.select();
            }
        }
    };
    SearchWidget.prototype.setWidth = function (width) {
        this.searchInput.setWidth(width);
        this.replaceInput.width = width - 28;
    };
    SearchWidget.prototype.clear = function () {
        this.searchInput.clear();
        this.replaceInput.value = '';
        this.setReplaceAllActionState(false);
    };
    SearchWidget.prototype.isReplaceShown = function () {
        return !dom.hasClass(this.replaceContainer, 'disabled');
    };
    SearchWidget.prototype.isReplaceActive = function () {
        return this.replaceActive.get();
    };
    SearchWidget.prototype.getReplaceValue = function () {
        return this.replaceInput.value;
    };
    SearchWidget.prototype.toggleReplace = function (show) {
        if (show === void 0 || show !== this.isReplaceShown()) {
            this.onToggleReplaceButton();
        }
    };
    SearchWidget.prototype.getSearchHistory = function () {
        return this.searchInput.inputBox.getHistory();
    };
    SearchWidget.prototype.getReplaceHistory = function () {
        return this.replaceInput.getHistory();
    };
    SearchWidget.prototype.clearHistory = function () {
        this.searchInput.inputBox.clearHistory();
    };
    SearchWidget.prototype.showNextSearchTerm = function () {
        this.searchInput.inputBox.showNextValue();
    };
    SearchWidget.prototype.showPreviousSearchTerm = function () {
        this.searchInput.inputBox.showPreviousValue();
    };
    SearchWidget.prototype.showNextReplaceTerm = function () {
        this.replaceInput.showNextValue();
    };
    SearchWidget.prototype.showPreviousReplaceTerm = function () {
        this.replaceInput.showPreviousValue();
    };
    SearchWidget.prototype.searchInputHasFocus = function () {
        return this.searchInputBoxFocused.get();
    };
    SearchWidget.prototype.replaceInputHasFocus = function () {
        return this.replaceInput.hasFocus();
    };
    SearchWidget.prototype.focusReplaceAllAction = function () {
        this.replaceActionBar.focus(true);
    };
    SearchWidget.prototype.focusRegexAction = function () {
        this.searchInput.focusOnRegex();
    };
    SearchWidget.prototype.render = function (container, options) {
        this.domNode = dom.append(container, dom.$('.search-widget'));
        this.domNode.style.position = 'relative';
        this.renderToggleReplaceButton(this.domNode);
        this.renderSearchInput(this.domNode, options);
        this.renderReplaceInput(this.domNode, options);
    };
    SearchWidget.prototype.isScreenReaderOptimized = function () {
        var detected = browser.getAccessibilitySupport() === 2 /* Enabled */;
        var config = this.configurationService.getValue('editor').accessibilitySupport;
        return config === 'on' || (config === 'auto' && detected);
    };
    SearchWidget.prototype.updateAccessibilitySupport = function () {
        this.searchInput.setFocusInputOnOptionClick(!this.isScreenReaderOptimized());
    };
    SearchWidget.prototype.renderToggleReplaceButton = function (parent) {
        var _this = this;
        var opts = {
            buttonBackground: null,
            buttonBorder: null,
            buttonForeground: null,
            buttonHoverBackground: null
        };
        this.toggleReplaceButton = this._register(new Button(parent, opts));
        this.toggleReplaceButton.element.setAttribute('aria-expanded', 'false');
        this.toggleReplaceButton.element.classList.add('collapse');
        this.toggleReplaceButton.icon = 'toggle-replace-button';
        // TODO@joh need to dispose this listener eventually
        this.toggleReplaceButton.onDidClick(function () { return _this.onToggleReplaceButton(); });
        this.toggleReplaceButton.element.title = nls.localize('search.replace.toggle.button.title', "Toggle Replace");
    };
    SearchWidget.prototype.renderSearchInput = function (parent, options) {
        var _this = this;
        var inputOptions = {
            label: nls.localize('label.Search', 'Search: Type Search Term and press Enter to search or Escape to cancel'),
            validation: function (value) { return _this.validateSearchInput(value); },
            placeholder: nls.localize('search.placeHolder', "Search"),
            appendCaseSensitiveLabel: appendKeyBindingLabel('', this.keyBindingService.lookupKeybinding(Constants.ToggleCaseSensitiveCommandId), this.keyBindingService),
            appendWholeWordsLabel: appendKeyBindingLabel('', this.keyBindingService.lookupKeybinding(Constants.ToggleWholeWordCommandId), this.keyBindingService),
            appendRegexLabel: appendKeyBindingLabel('', this.keyBindingService.lookupKeybinding(Constants.ToggleRegexCommandId), this.keyBindingService),
            history: options.searchHistory
        };
        var searchInputContainer = dom.append(parent, dom.$('.search-container.input-box'));
        this.searchInput = this._register(new ContextScopedFindInput(searchInputContainer, this.contextViewService, inputOptions, this.contextKeyService, true));
        this._register(attachFindInputBoxStyler(this.searchInput, this.themeService));
        this.searchInput.onKeyDown(function (keyboardEvent) { return _this.onSearchInputKeyDown(keyboardEvent); });
        this.searchInput.setValue(options.value || '');
        this.searchInput.setRegex(!!options.isRegex);
        this.searchInput.setCaseSensitive(!!options.isCaseSensitive);
        this.searchInput.setWholeWords(!!options.isWholeWords);
        this._register(this.onSearchSubmit(function () {
            _this.searchInput.inputBox.addToHistory();
        }));
        this.searchInput.onCaseSensitiveKeyDown(function (keyboardEvent) { return _this.onCaseSensitiveKeyDown(keyboardEvent); });
        this.searchInput.onRegexKeyDown(function (keyboardEvent) { return _this.onRegexKeyDown(keyboardEvent); });
        this._register(this.onReplaceValueChanged(function () {
            _this._replaceHistoryDelayer.trigger(function () { return _this.replaceInput.addToHistory(); });
        }));
        this.searchInputFocusTracker = this._register(dom.trackFocus(this.searchInput.inputBox.inputElement));
        this._register(this.searchInputFocusTracker.onDidFocus(function () {
            _this.searchInputBoxFocused.set(true);
            var useGlobalFindBuffer = _this.configurationService.getValue('search').globalFindClipboard;
            if (!_this.ignoreGlobalFindBufferOnNextFocus && useGlobalFindBuffer) {
                var globalBufferText = _this.clipboardServce.readFindText();
                if (_this.previousGlobalFindBufferValue !== globalBufferText) {
                    _this.searchInput.inputBox.addToHistory();
                    _this.searchInput.setValue(globalBufferText);
                    _this.searchInput.select();
                }
                _this.previousGlobalFindBufferValue = globalBufferText;
            }
            _this.ignoreGlobalFindBufferOnNextFocus = false;
        }));
        this._register(this.searchInputFocusTracker.onDidBlur(function () { return _this.searchInputBoxFocused.set(false); }));
    };
    SearchWidget.prototype.renderReplaceInput = function (parent, options) {
        var _this = this;
        this.replaceContainer = dom.append(parent, dom.$('.replace-container.disabled'));
        var replaceBox = dom.append(this.replaceContainer, dom.$('.input-box'));
        this.replaceInput = this._register(new ContextScopedHistoryInputBox(replaceBox, this.contextViewService, {
            ariaLabel: nls.localize('label.Replace', 'Replace: Type replace term and press Enter to preview or Escape to cancel'),
            placeholder: nls.localize('search.replace.placeHolder', "Replace"),
            history: options.replaceHistory || []
        }, this.contextKeyService));
        this._register(attachInputBoxStyler(this.replaceInput, this.themeService));
        this.onkeydown(this.replaceInput.inputElement, function (keyboardEvent) { return _this.onReplaceInputKeyDown(keyboardEvent); });
        this.replaceInput.onDidChange(function () { return _this._onReplaceValueChanged.fire(); });
        this.searchInput.inputBox.onDidChange(function () { return _this.onSearchInputChanged(); });
        this.replaceAllAction = ReplaceAllAction.INSTANCE;
        this.replaceAllAction.searchWidget = this;
        this.replaceAllAction.label = SearchWidget.REPLACE_ALL_DISABLED_LABEL;
        this.replaceActionBar = this._register(new ActionBar(this.replaceContainer));
        this.replaceActionBar.push([this.replaceAllAction], { icon: true, label: false });
        this.onkeydown(this.replaceActionBar.domNode, function (keyboardEvent) { return _this.onReplaceActionbarKeyDown(keyboardEvent); });
        this.replaceInputFocusTracker = this._register(dom.trackFocus(this.replaceInput.inputElement));
        this._register(this.replaceInputFocusTracker.onDidFocus(function () { return _this.replaceInputBoxFocused.set(true); }));
        this._register(this.replaceInputFocusTracker.onDidBlur(function () { return _this.replaceInputBoxFocused.set(false); }));
    };
    SearchWidget.prototype.triggerReplaceAll = function () {
        this._onReplaceAll.fire();
        return TPromise.as(null);
    };
    SearchWidget.prototype.onToggleReplaceButton = function () {
        dom.toggleClass(this.replaceContainer, 'disabled');
        dom.toggleClass(this.toggleReplaceButton.element, 'collapse');
        dom.toggleClass(this.toggleReplaceButton.element, 'expand');
        this.toggleReplaceButton.element.setAttribute('aria-expanded', this.isReplaceShown() ? 'true' : 'false');
        this.updateReplaceActiveState();
        this._onReplaceToggled.fire();
    };
    SearchWidget.prototype.setReplaceAllActionState = function (enabled) {
        if (this.replaceAllAction.enabled !== enabled) {
            this.replaceAllAction.enabled = enabled;
            this.replaceAllAction.label = enabled ? SearchWidget.REPLACE_ALL_ENABLED_LABEL(this.keyBindingService) : SearchWidget.REPLACE_ALL_DISABLED_LABEL;
            this.updateReplaceActiveState();
        }
    };
    SearchWidget.prototype.updateReplaceActiveState = function () {
        var currentState = this.isReplaceActive();
        var newState = this.isReplaceShown() && this.replaceAllAction.enabled;
        if (currentState !== newState) {
            this.replaceActive.set(newState);
            this._onReplaceStateChange.fire(newState);
        }
    };
    SearchWidget.prototype.validateSearchInput = function (value) {
        if (value.length === 0) {
            return null;
        }
        if (!this.searchInput.getRegex()) {
            return null;
        }
        var regExp;
        try {
            regExp = new RegExp(value);
        }
        catch (e) {
            return { content: e.message };
        }
        if (strings.regExpLeadsToEndlessLoop(regExp)) {
            return { content: nls.localize('regexp.validationFailure', "Expression matches everything") };
        }
        if (strings.regExpContainsBackreference(value)) {
            return { content: nls.localize('regexp.backreferenceValidationFailure', "Backreferences are not supported") };
        }
        return null;
    };
    SearchWidget.prototype.onSearchInputChanged = function () {
        this.searchInput.clearMessage();
        this.setReplaceAllActionState(false);
    };
    SearchWidget.prototype.onSearchInputKeyDown = function (keyboardEvent) {
        if (keyboardEvent.equals(3 /* Enter */)) {
            this.submitSearch();
            keyboardEvent.preventDefault();
        }
        else if (keyboardEvent.equals(9 /* Escape */)) {
            this._onSearchCancel.fire();
            keyboardEvent.preventDefault();
        }
        else if (keyboardEvent.equals(2 /* Tab */)) {
            if (this.isReplaceShown()) {
                this.replaceInput.focus();
            }
            else {
                this.searchInput.focusOnCaseSensitive();
            }
            keyboardEvent.preventDefault();
        }
    };
    SearchWidget.prototype.onCaseSensitiveKeyDown = function (keyboardEvent) {
        if (keyboardEvent.equals(1024 /* Shift */ | 2 /* Tab */)) {
            if (this.isReplaceShown()) {
                this.replaceInput.focus();
                keyboardEvent.preventDefault();
            }
        }
    };
    SearchWidget.prototype.onRegexKeyDown = function (keyboardEvent) {
        if (keyboardEvent.equals(2 /* Tab */)) {
            if (this.isReplaceActive()) {
                this.focusReplaceAllAction();
            }
            else {
                this._onBlur.fire();
            }
            keyboardEvent.preventDefault();
        }
    };
    SearchWidget.prototype.onReplaceInputKeyDown = function (keyboardEvent) {
        if (keyboardEvent.equals(3 /* Enter */)) {
            this.submitSearch();
            keyboardEvent.preventDefault();
        }
        else if (keyboardEvent.equals(2 /* Tab */)) {
            this.searchInput.focusOnCaseSensitive();
            keyboardEvent.preventDefault();
        }
        else if (keyboardEvent.equals(1024 /* Shift */ | 2 /* Tab */)) {
            this.searchInput.focus();
            keyboardEvent.preventDefault();
        }
    };
    SearchWidget.prototype.onReplaceActionbarKeyDown = function (keyboardEvent) {
        if (keyboardEvent.equals(1024 /* Shift */ | 2 /* Tab */)) {
            this.focusRegexAction();
            keyboardEvent.preventDefault();
        }
    };
    SearchWidget.prototype.submitSearch = function () {
        var value = this.searchInput.getValue();
        var useGlobalFindBuffer = this.configurationService.getValue('search').globalFindClipboard;
        if (value) {
            if (useGlobalFindBuffer) {
                this.clipboardServce.writeFindText(value);
            }
            this._onSearchSubmit.fire();
        }
    };
    SearchWidget.prototype.dispose = function () {
        this.setReplaceAllActionState(false);
        this.replaceAllAction.searchWidget = null;
        this.replaceActionBar = null;
        _super.prototype.dispose.call(this);
    };
    SearchWidget.REPLACE_ALL_DISABLED_LABEL = nls.localize('search.action.replaceAll.disabled.label', "Replace All (Submit Search to Enable)");
    SearchWidget.REPLACE_ALL_ENABLED_LABEL = function (keyBindingService2) {
        var kb = keyBindingService2.lookupKeybinding(ReplaceAllAction.ID);
        return appendKeyBindingLabel(nls.localize('search.action.replaceAll.enabled.label', "Replace All"), kb, keyBindingService2);
    };
    SearchWidget = __decorate([
        __param(2, IContextViewService),
        __param(3, IThemeService),
        __param(4, IContextKeyService),
        __param(5, IKeybindingService),
        __param(6, IClipboardService),
        __param(7, IConfigurationService)
    ], SearchWidget);
    return SearchWidget;
}(Widget));
export { SearchWidget };
export function registerContributions() {
    KeybindingsRegistry.registerCommandAndKeybindingRule({
        id: ReplaceAllAction.ID,
        weight: 200 /* WorkbenchContrib */,
        when: ContextKeyExpr.and(Constants.SearchViewVisibleKey, Constants.ReplaceActiveKey, CONTEXT_FIND_WIDGET_NOT_VISIBLE),
        primary: 512 /* Alt */ | 2048 /* CtrlCmd */ | 3 /* Enter */,
        handler: function (accessor) {
            if (isSearchViewFocused(accessor.get(IViewletService), accessor.get(IPanelService))) {
                ReplaceAllAction.INSTANCE.run();
            }
        }
    });
}
