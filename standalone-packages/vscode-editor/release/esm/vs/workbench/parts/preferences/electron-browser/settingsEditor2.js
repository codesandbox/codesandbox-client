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
import * as DOM from '../../../../base/browser/dom.js';
import { Separator } from '../../../../base/browser/ui/actionbar/actionbar.js';
import { ToolBar } from '../../../../base/browser/ui/toolbar/toolbar.js';
import { Action } from '../../../../base/common/actions.js';
import * as arrays from '../../../../base/common/arrays.js';
import { isArray } from '../../../../base/common/types.js';
import { Delayer, ThrottledDelayer } from '../../../../base/common/async.js';
import { CancellationTokenSource } from '../../../../base/common/cancellation.js';
import * as collections from '../../../../base/common/collections.js';
import { getErrorMessage, isPromiseCanceledError } from '../../../../base/common/errors.js';
import { URI } from '../../../../base/common/uri.js';
import { TPromise } from '../../../../base/common/winjs.base.js';
import { collapseAll, expandAll } from '../../../../base/parts/tree/browser/treeUtils.js';
import './media/settingsEditor2.css';
import { localize } from '../../../../nls.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { IEnvironmentService } from '../../../../platform/environment/common/environment.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { badgeBackground, badgeForeground, contrastBorder, editorForeground } from '../../../../platform/theme/common/colorRegistry.js';
import { attachStylerCallback } from '../../../../platform/theme/common/styler.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { BaseEditor } from '../../../browser/parts/editor/baseEditor.js';
import { attachSuggestEnabledInputBoxStyler, SuggestEnabledInput } from '../../codeEditor/electron-browser/suggestEnabledInput.js';
import { PreferencesEditor } from '../browser/preferencesEditor.js';
import { SettingsTargetsWidget } from '../browser/preferencesWidgets.js';
import { commonlyUsedData, tocData } from '../browser/settingsLayout.js';
import { resolveExtensionsSettings, resolveSettingsTree, SettingsDataSource, SettingsRenderer, SettingsTree, SimplePagedDataSource } from '../browser/settingsTree.js';
import { MODIFIED_SETTING_TAG, ONLINE_SERVICES_SETTING_TAG, parseQuery, SearchResultModel, SettingsTreeGroupElement, SettingsTreeModel, SettingsTreeSettingElement } from '../browser/settingsTreeModels.js';
import { settingsTextInputBorder } from '../browser/settingsWidgets.js';
import { TOCRenderer, TOCTree, TOCTreeModel } from '../browser/tocTree.js';
import { CONTEXT_SETTINGS_EDITOR, CONTEXT_SETTINGS_SEARCH_FOCUS, CONTEXT_TOC_ROW_FOCUS, IPreferencesSearchService, SETTINGS_EDITOR_COMMAND_SHOW_CONTEXT_MENU } from '../common/preferences.js';
import { IPreferencesService, SettingsEditorOptions, SettingValueType } from '../../../services/preferences/common/preferences.js';
var $ = DOM.$;
var SettingsEditor2 = /** @class */ (function (_super) {
    __extends(SettingsEditor2, _super);
    function SettingsEditor2(telemetryService, configurationService, themeService, preferencesService, instantiationService, preferencesSearchService, logService, environmentService, contextKeyService, contextMenuService, storageService, notificationService, keybindingService) {
        var _this = _super.call(this, SettingsEditor2.ID, telemetryService, themeService) || this;
        _this.configurationService = configurationService;
        _this.preferencesService = preferencesService;
        _this.instantiationService = instantiationService;
        _this.preferencesSearchService = preferencesSearchService;
        _this.logService = logService;
        _this.environmentService = environmentService;
        _this.contextMenuService = contextMenuService;
        _this.storageService = storageService;
        _this.notificationService = notificationService;
        _this.keybindingService = keybindingService;
        _this.delayedFilterLogging = new Delayer(1000);
        _this.localSearchDelayer = new Delayer(300);
        _this.remoteSearchThrottle = new ThrottledDelayer(200);
        _this.viewState = { settingsTarget: 1 /* USER */ };
        _this.delayRefreshOnLayout = new Delayer(100);
        _this.settingFastUpdateDelayer = new Delayer(SettingsEditor2.SETTING_UPDATE_FAST_DEBOUNCE);
        _this.settingSlowUpdateDelayer = new Delayer(SettingsEditor2.SETTING_UPDATE_SLOW_DEBOUNCE);
        _this.inSettingsEditorContextKey = CONTEXT_SETTINGS_EDITOR.bindTo(contextKeyService);
        _this.searchFocusContextKey = CONTEXT_SETTINGS_SEARCH_FOCUS.bindTo(contextKeyService);
        _this.tocRowFocused = CONTEXT_TOC_ROW_FOCUS.bindTo(contextKeyService);
        _this.scheduledRefreshes = new Map();
        _this._register(configurationService.onDidChangeConfiguration(function (e) {
            if (e.source !== 4 /* DEFAULT */) {
                _this.onConfigUpdate(e.affectedKeys);
            }
        }));
        return _this;
    }
    SettingsEditor2.shouldSettingUpdateFast = function (type) {
        if (isArray(type)) {
            // nullable integer/number or complex
            return false;
        }
        return type === SettingValueType.Enum || type === SettingValueType.Complex;
    };
    Object.defineProperty(SettingsEditor2.prototype, "currentSettingsModel", {
        get: function () {
            return this.searchResultModel || this.settingsTreeModel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SettingsEditor2.prototype, "searchResultModel", {
        get: function () {
            return this._searchResultModel;
        },
        set: function (value) {
            this._searchResultModel = value;
            DOM.toggleClass(this.rootElement, 'search-mode', !!this._searchResultModel);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SettingsEditor2.prototype, "currentSettingsContextMenuKeyBindingLabel", {
        get: function () {
            return this.keybindingService.lookupKeybinding(SETTINGS_EDITOR_COMMAND_SHOW_CONTEXT_MENU).getAriaLabel();
        },
        enumerable: true,
        configurable: true
    });
    SettingsEditor2.prototype.createEditor = function (parent) {
        parent.setAttribute('tabindex', '-1');
        this.rootElement = DOM.append(parent, $('.settings-editor'));
        this.createHeader(this.rootElement);
        this.createBody(this.rootElement);
        this.updateStyles();
    };
    SettingsEditor2.prototype.setInput = function (input, options, token) {
        var _this = this;
        this.inSettingsEditorContextKey.set(true);
        return _super.prototype.setInput.call(this, input, options, token)
            .then(function () { return new Promise(process.nextTick); }) // Force setInput to be async
            .then(function () {
            if (!options) {
                if (!_this.viewState.settingsTarget) {
                    // Persist?
                    options = SettingsEditorOptions.create({ target: 1 /* USER */ });
                }
            }
            else if (!options.target) {
                options.target = 1 /* USER */;
            }
            _this._setOptions(options);
            _this.render(token);
        })
            .then(function () {
            // Init TOC selection
            _this.updateTreeScrollSync();
        });
    };
    SettingsEditor2.prototype.setOptions = function (options) {
        _super.prototype.setOptions.call(this, options);
        this._setOptions(options);
    };
    SettingsEditor2.prototype._setOptions = function (options) {
        if (!options) {
            return;
        }
        if (options.query) {
            this.searchWidget.setValue(options.query);
        }
        var target = options.folderUri || options.target;
        this.settingsTargetsWidget.settingsTarget = target;
        this.viewState.settingsTarget = target;
    };
    SettingsEditor2.prototype.clearInput = function () {
        this.inSettingsEditorContextKey.set(false);
        _super.prototype.clearInput.call(this);
    };
    SettingsEditor2.prototype.layout = function (dimension) {
        var _this = this;
        var firstEl = this.settingsTree.getFirstVisibleElement();
        var firstElTop = this.settingsTree.getRelativeTop(firstEl);
        this.layoutTrees(dimension);
        var innerWidth = dimension.width - 24 * 2; // 24px padding on left and right
        var monacoWidth = (innerWidth > 1000 ? 1000 : innerWidth) - 10;
        this.searchWidget.layout({ height: 20, width: monacoWidth });
        DOM.toggleClass(this.rootElement, 'narrow', dimension.width < 600);
        // #56185
        if (dimension.width !== this.lastLayedoutWidth) {
            this.lastLayedoutWidth = dimension.width;
            this.delayRefreshOnLayout.trigger(function () {
                _this.renderTree(undefined, true).then(function () {
                    _this.settingsTree.reveal(firstEl, firstElTop);
                });
            });
        }
    };
    SettingsEditor2.prototype.focus = function () {
        if (this.lastFocusedSettingElement) {
            var elements = this.settingsTreeRenderer.getDOMElementsForSettingKey(this.settingsTree.getHTMLElement(), this.lastFocusedSettingElement);
            if (elements.length) {
                var control = elements[0].querySelector(SettingsRenderer.CONTROL_SELECTOR);
                if (control) {
                    control.focus();
                    return;
                }
            }
        }
        this.focusSearch();
    };
    SettingsEditor2.prototype.focusSettings = function () {
        // Update ARIA global labels
        var labelElement = this.settingsAriaExtraLabelsContainer.querySelector('#settings_aria_more_actions_shortcut_label');
        if (labelElement) {
            var settingsContextMenuShortcut = this.currentSettingsContextMenuKeyBindingLabel;
            if (settingsContextMenuShortcut) {
                labelElement.setAttribute('aria-label', localize('settingsContextMenuAriaShortcut', "For more actions, Press {0}.", settingsContextMenuShortcut));
            }
        }
        var firstFocusable = this.settingsTree.getHTMLElement().querySelector(SettingsRenderer.CONTROL_SELECTOR);
        if (firstFocusable) {
            firstFocusable.focus();
        }
    };
    SettingsEditor2.prototype.showContextMenu = function () {
        var settingDOMElement = this.settingsTreeRenderer.getSettingDOMElementForDOMElement(this.getActiveElementInSettingsTree());
        if (!settingDOMElement) {
            return;
        }
        var focusedKey = this.settingsTreeRenderer.getKeyForDOMElementInSetting(settingDOMElement);
        if (!focusedKey) {
            return;
        }
        var elements = this.currentSettingsModel.getElementsByName(focusedKey);
        if (elements && elements[0]) {
            this.settingsTreeRenderer.showContextMenu(elements[0], settingDOMElement);
        }
    };
    SettingsEditor2.prototype.focusSearch = function (filter, selectAll) {
        if (selectAll === void 0) { selectAll = true; }
        if (filter && this.searchWidget) {
            this.searchWidget.setValue(filter);
        }
        this.searchWidget.focus(selectAll);
    };
    SettingsEditor2.prototype.clearSearchResults = function () {
        this.searchWidget.setValue('');
    };
    SettingsEditor2.prototype.createHeader = function (parent) {
        var _this = this;
        this.headerContainer = DOM.append(parent, $('.settings-header'));
        var searchContainer = DOM.append(this.headerContainer, $('.search-container'));
        var searchBoxLabel = localize('SearchSettings.AriaLabel', "Search settings");
        this.searchWidget = this._register(this.instantiationService.createInstance(SuggestEnabledInput, SettingsEditor2.ID + ".searchbox", searchContainer, {
            triggerCharacters: ['@'],
            provideResults: function (query) {
                return SettingsEditor2.SUGGESTIONS.filter(function (tag) { return query.indexOf(tag) === -1; }).map(function (tag) { return tag + ' '; });
            }
        }, searchBoxLabel, 'settingseditor:searchinput' + SettingsEditor2.NUM_INSTANCES++, {
            placeholderText: searchBoxLabel,
            focusContextKey: this.searchFocusContextKey,
        }));
        this._register(attachSuggestEnabledInputBoxStyler(this.searchWidget, this.themeService, {
            inputBorder: settingsTextInputBorder
        }));
        this.countElement = DOM.append(searchContainer, DOM.$('.settings-count-widget'));
        this._register(attachStylerCallback(this.themeService, { badgeBackground: badgeBackground, contrastBorder: contrastBorder, badgeForeground: badgeForeground }, function (colors) {
            var background = colors.badgeBackground ? colors.badgeBackground.toString() : null;
            var border = colors.contrastBorder ? colors.contrastBorder.toString() : null;
            _this.countElement.style.backgroundColor = background;
            _this.countElement.style.color = colors.badgeForeground.toString();
            _this.countElement.style.borderWidth = border ? '1px' : null;
            _this.countElement.style.borderStyle = border ? 'solid' : null;
            _this.countElement.style.borderColor = border;
        }));
        this._register(this.searchWidget.onInputDidChange(function () { return _this.onSearchInputChanged(); }));
        var headerControlsContainer = DOM.append(this.headerContainer, $('.settings-header-controls'));
        var targetWidgetContainer = DOM.append(headerControlsContainer, $('.settings-target-container'));
        this.settingsTargetsWidget = this._register(this.instantiationService.createInstance(SettingsTargetsWidget, targetWidgetContainer));
        this.settingsTargetsWidget.settingsTarget = 1 /* USER */;
        this.settingsTargetsWidget.onDidTargetChange(function (target) { return _this.onDidSettingsTargetChange(target); });
        this.createHeaderControls(headerControlsContainer);
    };
    SettingsEditor2.prototype.onDidSettingsTargetChange = function (target) {
        this.viewState.settingsTarget = target;
        // TODO Instead of rebuilding the whole model, refresh and uncache the inspected setting value
        this.onConfigUpdate(undefined, true);
    };
    SettingsEditor2.prototype.createHeaderControls = function (parent) {
        var _this = this;
        var headerControlsContainerRight = DOM.append(parent, $('.settings-header-controls-right'));
        this.toolbar = this._register(new ToolBar(headerControlsContainerRight, this.contextMenuService, {
            ariaLabel: localize('settingsToolbarLabel', "Settings Editor Actions"),
            actionRunner: this.actionRunner
        }));
        var actions = [
            this.instantiationService.createInstance(FilterByTagAction, localize('filterModifiedLabel', "Show modified settings"), MODIFIED_SETTING_TAG, this)
        ];
        if (this.environmentService.appQuality !== 'stable') {
            actions.push(this.instantiationService.createInstance(FilterByTagAction, localize('filterOnlineServicesLabel', "Show settings for online services"), ONLINE_SERVICES_SETTING_TAG, this));
            actions.push(new Separator());
        }
        actions.push(new Action('settings.openSettingsJson', localize('openSettingsJsonLabel', "Open settings.json"), undefined, undefined, function () {
            return _this.openSettingsFile().then(function (editor) {
                var currentQuery = parseQuery(_this.searchWidget.getValue());
                if (editor instanceof PreferencesEditor && currentQuery) {
                    editor.focusSearch(currentQuery.query);
                }
            });
        }));
        this.toolbar.setActions([], actions)();
        this.toolbar.context = { target: this.settingsTargetsWidget.settingsTarget };
    };
    SettingsEditor2.prototype.onDidClickSetting = function (evt, recursed) {
        var _this = this;
        var elements = this.currentSettingsModel.getElementsByName(evt.targetKey);
        if (elements && elements[0]) {
            var sourceTop = this.settingsTree.getRelativeTop(evt.source);
            if (sourceTop < 0) {
                // e.g. clicked a searched element, now the search has been cleared
                sourceTop = .5;
            }
            this.settingsTree.reveal(elements[0], sourceTop);
            var domElements = this.settingsTreeRenderer.getDOMElementsForSettingKey(this.settingsTree.getHTMLElement(), evt.targetKey);
            if (domElements && domElements[0]) {
                var control = domElements[0].querySelector(SettingsRenderer.CONTROL_SELECTOR);
                if (control) {
                    control.focus();
                }
            }
        }
        else if (!recursed) {
            var p = this.triggerSearch('');
            p.then(function () {
                _this.searchWidget.setValue('');
                _this.onDidClickSetting(evt, true);
            });
        }
    };
    SettingsEditor2.prototype.openSettingsFile = function (query) {
        var currentSettingsTarget = this.settingsTargetsWidget.settingsTarget;
        var options = { query: query };
        if (currentSettingsTarget === 1 /* USER */) {
            return this.preferencesService.openGlobalSettings(true, options);
        }
        else if (currentSettingsTarget === 2 /* WORKSPACE */) {
            return this.preferencesService.openWorkspaceSettings(true, options);
        }
        else {
            return this.preferencesService.openFolderSettings(currentSettingsTarget, true, options);
        }
    };
    SettingsEditor2.prototype.createBody = function (parent) {
        var _this = this;
        var bodyContainer = DOM.append(parent, $('.settings-body'));
        this.noResultsMessage = DOM.append(bodyContainer, $('.no-results'));
        this.noResultsMessage.innerText = localize('noResults', "No Settings Found");
        this._register(attachStylerCallback(this.themeService, { editorForeground: editorForeground }, function (colors) {
            _this.noResultsMessage.style.color = colors.editorForeground ? colors.editorForeground.toString() : null;
        }));
        this.createTOC(bodyContainer);
        this.createFocusSink(bodyContainer, function (e) {
            if (DOM.findParentWithClass(e.relatedTarget, 'settings-editor-tree')) {
                if (_this.settingsTree.getScrollPosition() > 0) {
                    var firstElement = _this.settingsTree.getFirstVisibleElement();
                    _this.settingsTree.reveal(firstElement, 0.1);
                    return true;
                }
            }
            else {
                var firstControl = _this.settingsTree.getHTMLElement().querySelector(SettingsRenderer.CONTROL_SELECTOR);
                if (firstControl) {
                    firstControl.focus();
                }
            }
            return false;
        }, 'settings list focus helper');
        this.createSettingsTree(bodyContainer);
        this.createFocusSink(bodyContainer, function (e) {
            if (DOM.findParentWithClass(e.relatedTarget, 'settings-editor-tree')) {
                if (_this.settingsTree.getScrollPosition() < 1) {
                    var lastElement = _this.settingsTree.getLastVisibleElement();
                    _this.settingsTree.reveal(lastElement, 0.9);
                    return true;
                }
            }
            return false;
        }, 'settings list focus helper');
    };
    SettingsEditor2.prototype.createFocusSink = function (container, callback, label) {
        var listFocusSink = DOM.append(container, $('.settings-tree-focus-sink'));
        listFocusSink.setAttribute('aria-label', label);
        listFocusSink.tabIndex = 0;
        this._register(DOM.addDisposableListener(listFocusSink, 'focus', function (e) {
            if (e.relatedTarget && callback(e)) {
                e.relatedTarget.focus();
            }
        }));
        return listFocusSink;
    };
    SettingsEditor2.prototype.createTOC = function (parent) {
        var _this = this;
        this.tocTreeModel = new TOCTreeModel(this.viewState);
        this.tocTreeContainer = DOM.append(parent, $('.settings-toc-container'));
        var tocRenderer = this.instantiationService.createInstance(TOCRenderer);
        this.tocTree = this._register(this.instantiationService.createInstance(TOCTree, DOM.append(this.tocTreeContainer, $('.settings-toc-wrapper')), this.viewState, {
            renderer: tocRenderer
        }));
        this._register(this.tocTree.onDidChangeFocus(function (e) {
            var element = e.focus;
            if (_this.searchResultModel) {
                _this.viewState.filterToCategory = element;
                _this.renderTree();
            }
            if (element && (!e.payload || !e.payload.fromScroll)) {
                var refreshP = TPromise.wrap(null);
                if (_this.settingsTreeDataSource.pageTo(element.index, true)) {
                    refreshP = _this.renderTree();
                }
                refreshP.then(function () { return _this.settingsTree.reveal(element, 0); });
            }
        }));
        this._register(this.tocTree.onDidFocus(function () {
            _this.tocRowFocused.set(true);
        }));
        this._register(this.tocTree.onDidBlur(function () {
            _this.tocRowFocused.set(false);
        }));
    };
    SettingsEditor2.prototype.createSettingsTree = function (parent) {
        var _this = this;
        this.settingsTreeContainer = DOM.append(parent, $('.settings-tree-container'));
        // Add  ARIA extra labels div
        this.settingsAriaExtraLabelsContainer = DOM.append(this.settingsTreeContainer, $('.settings-aria-extra-labels'));
        this.settingsAriaExtraLabelsContainer.id = 'settings_aria_extra_labels';
        // Add global labels here
        var labelDiv = DOM.append(this.settingsAriaExtraLabelsContainer, $('.settings-aria-extra-label'));
        labelDiv.id = 'settings_aria_more_actions_shortcut_label';
        labelDiv.setAttribute('aria-label', '');
        this.settingsTreeRenderer = this.instantiationService.createInstance(SettingsRenderer, this.settingsTreeContainer);
        this._register(this.settingsTreeRenderer.onDidChangeSetting(function (e) { return _this.onDidChangeSetting(e.key, e.value, e.type); }));
        this._register(this.settingsTreeRenderer.onDidOpenSettings(function (settingKey) {
            _this.openSettingsFile(settingKey);
        }));
        this._register(this.settingsTreeRenderer.onDidClickSettingLink(function (settingName) { return _this.onDidClickSetting(settingName); }));
        this._register(this.settingsTreeRenderer.onDidFocusSetting(function (element) {
            _this.lastFocusedSettingElement = element.setting.key;
            _this.settingsTree.reveal(element);
        }));
        this.settingsTreeDataSource = this.instantiationService.createInstance(SimplePagedDataSource, this.instantiationService.createInstance(SettingsDataSource, this.viewState));
        this.settingsTree = this._register(this.instantiationService.createInstance(SettingsTree, this.settingsTreeContainer, this.viewState, {
            renderer: this.settingsTreeRenderer,
            dataSource: this.settingsTreeDataSource
        }));
        this.settingsTree.getHTMLElement().attributes.removeNamedItem('tabindex');
        // Have to redefine role of the tree widget to form for input elements
        // TODO:CDL make this an option for tree
        this.settingsTree.getHTMLElement().setAttribute('role', 'form');
        this._register(this.settingsTree.onDidScroll(function () {
            _this.updateTreeScrollSync();
        }));
    };
    SettingsEditor2.prototype.notifyNoSaveNeeded = function (force) {
        if (force === void 0) { force = true; }
        if (force || !this.storageService.getBoolean('hasNotifiedOfSettingsAutosave', 0 /* GLOBAL */, false)) {
            this.storageService.store('hasNotifiedOfSettingsAutosave', true, 0 /* GLOBAL */);
            this.notificationService.info(localize('settingsNoSaveNeeded', "Your changes are automatically saved as you edit."));
        }
    };
    SettingsEditor2.prototype.onDidChangeSetting = function (key, value, type) {
        var _this = this;
        this.notifyNoSaveNeeded(false);
        if (this.pendingSettingUpdate && this.pendingSettingUpdate.key !== key) {
            this.updateChangedSetting(key, value);
        }
        this.pendingSettingUpdate = { key: key, value: value };
        if (SettingsEditor2.shouldSettingUpdateFast(type)) {
            this.settingFastUpdateDelayer.trigger(function () { return _this.updateChangedSetting(key, value); });
        }
        else {
            this.settingSlowUpdateDelayer.trigger(function () { return _this.updateChangedSetting(key, value); });
        }
    };
    SettingsEditor2.prototype.updateTreeScrollSync = function () {
        this.settingsTreeRenderer.cancelSuggesters();
        if (this.searchResultModel) {
            return;
        }
        if (!this.tocTree.getInput()) {
            return;
        }
        this.updateTreePagingByScroll();
        var elementToSync = this.settingsTree.getFirstVisibleElement();
        var element = elementToSync instanceof SettingsTreeSettingElement ? elementToSync.parent :
            elementToSync instanceof SettingsTreeGroupElement ? elementToSync :
                null;
        if (element && this.tocTree.getSelection()[0] !== element) {
            this.tocTree.reveal(element);
            var elementTop = this.tocTree.getRelativeTop(element);
            collapseAll(this.tocTree, element);
            if (elementTop < 0 || elementTop > 1) {
                this.tocTree.reveal(element);
            }
            else {
                this.tocTree.reveal(element, elementTop);
            }
            this.tocTree.expand(element);
            this.tocTree.setSelection([element]);
            this.tocTree.setFocus(element, { fromScroll: true });
        }
    };
    SettingsEditor2.prototype.updateTreePagingByScroll = function () {
        var lastVisibleElement = this.settingsTree.getLastVisibleElement();
        if (lastVisibleElement && this.settingsTreeDataSource.pageTo(lastVisibleElement.index)) {
            this.renderTree();
        }
    };
    SettingsEditor2.prototype.updateChangedSetting = function (key, value) {
        var _this = this;
        // ConfigurationService displays the error if this fails.
        // Force a render afterwards because onDidConfigurationUpdate doesn't fire if the update doesn't result in an effective setting value change
        var settingsTarget = this.settingsTargetsWidget.settingsTarget;
        var resource = URI.isUri(settingsTarget) ? settingsTarget : undefined;
        var configurationTarget = (resource ? 3 /* WORKSPACE_FOLDER */ : settingsTarget);
        var overrides = { resource: resource };
        var isManualReset = value === undefined;
        // If the user is changing the value back to the default, do a 'reset' instead
        var inspected = this.configurationService.inspect(key, overrides);
        if (inspected.default === value) {
            value = undefined;
        }
        return this.configurationService.updateValue(key, value, overrides, configurationTarget)
            .then(function () { return _this.renderTree(key, isManualReset); })
            .then(function () {
            var reportModifiedProps = {
                key: key,
                query: _this.searchWidget.getValue(),
                searchResults: _this.searchResultModel && _this.searchResultModel.getUniqueResults(),
                rawResults: _this.searchResultModel && _this.searchResultModel.getRawResults(),
                showConfiguredOnly: _this.viewState.tagFilters && _this.viewState.tagFilters.has(MODIFIED_SETTING_TAG),
                isReset: typeof value === 'undefined',
                settingsTarget: _this.settingsTargetsWidget.settingsTarget
            };
            return _this.reportModifiedSetting(reportModifiedProps);
        });
    };
    SettingsEditor2.prototype.reportModifiedSetting = function (props) {
        this.pendingSettingUpdate = null;
        var remoteResult = props.searchResults && props.searchResults[1 /* Remote */];
        var localResult = props.searchResults && props.searchResults[0 /* Local */];
        var groupId = undefined;
        var nlpIndex = undefined;
        var displayIndex = undefined;
        if (props.searchResults) {
            var localIndex = arrays.firstIndex(localResult.filterMatches, function (m) { return m.setting.key === props.key; });
            groupId = localIndex >= 0 ?
                'local' :
                'remote';
            displayIndex = localIndex >= 0 ?
                localIndex :
                remoteResult && (arrays.firstIndex(remoteResult.filterMatches, function (m) { return m.setting.key === props.key; }) + localResult.filterMatches.length);
            if (this.searchResultModel) {
                var rawResults = this.searchResultModel.getRawResults();
                if (rawResults[1 /* Remote */]) {
                    var _nlpIndex = arrays.firstIndex(rawResults[1 /* Remote */].filterMatches, function (m) { return m.setting.key === props.key; });
                    nlpIndex = _nlpIndex >= 0 ? _nlpIndex : undefined;
                }
            }
        }
        var reportedTarget = props.settingsTarget === 1 /* USER */ ? 'user' :
            props.settingsTarget === 2 /* WORKSPACE */ ? 'workspace' :
                'folder';
        var data = {
            key: props.key,
            query: props.query,
            groupId: groupId,
            nlpIndex: nlpIndex,
            displayIndex: displayIndex,
            showConfiguredOnly: props.showConfiguredOnly,
            isReset: props.isReset,
            target: reportedTarget
        };
        /* __GDPR__
            "settingsEditor.settingModified" : {
                "key" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
                "query" : { "classification": "CustomerContent", "purpose": "FeatureInsight" },
                "groupId" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
                "nlpIndex" : { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true },
                "displayIndex" : { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true },
                "showConfiguredOnly" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
                "isReset" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
                "target" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
            }
        */
        this.telemetryService.publicLog('settingsEditor.settingModified', data);
        var data2 = {
            key: props.key,
            groupId: groupId,
            nlpIndex: nlpIndex,
            displayIndex: displayIndex,
            showConfiguredOnly: props.showConfiguredOnly,
            isReset: props.isReset,
            target: reportedTarget
        };
        /* __GDPR__
            "settingsEditor.settingModified<NUMBER>" : {
                "key" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
                "groupId" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
                "nlpIndex" : { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true },
                "displayIndex" : { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true },
                "showConfiguredOnly" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
                "isReset" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
                "target" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
            }
        */
        this.telemetryService.publicLog('settingsEditor.settingModified2', data2);
    };
    SettingsEditor2.prototype.render = function (token) {
        var _this = this;
        if (this.input) {
            return this.input.resolve()
                .then(function (model) {
                if (token.isCancellationRequested) {
                    return void 0;
                }
                _this._register(model.onDidChangeGroups(function () { return _this.onConfigUpdate(); }));
                _this.defaultSettingsEditorModel = model;
                return _this.onConfigUpdate();
            });
        }
        return TPromise.as(null);
    };
    SettingsEditor2.prototype.onSearchModeToggled = function () {
        DOM.removeClass(this.rootElement, 'no-toc-search');
        if (this.configurationService.getValue('workbench.settings.settingsSearchTocBehavior') === 'hide') {
            DOM.toggleClass(this.rootElement, 'no-toc-search', !!this.searchResultModel);
        }
        if (this.searchResultModel) {
            this.settingsTreeDataSource.pageTo(Number.MAX_VALUE);
        }
        else {
            this.settingsTreeDataSource.reset();
        }
    };
    SettingsEditor2.prototype.scheduleRefresh = function (element, key) {
        var _this = this;
        if (key === void 0) { key = ''; }
        if (key && this.scheduledRefreshes.has(key)) {
            return;
        }
        if (!key) {
            this.scheduledRefreshes.forEach(function (r) { return r.dispose(); });
            this.scheduledRefreshes.clear();
        }
        var scheduledRefreshTracker = DOM.trackFocus(element);
        this.scheduledRefreshes.set(key, scheduledRefreshTracker);
        scheduledRefreshTracker.onDidBlur(function () {
            scheduledRefreshTracker.dispose();
            _this.scheduledRefreshes.delete(key);
            _this.onConfigUpdate([key]);
        });
    };
    SettingsEditor2.prototype.onConfigUpdate = function (keys, forceRefresh) {
        if (forceRefresh === void 0) { forceRefresh = false; }
        if (keys && this.settingsTreeModel) {
            return this.updateElementsByKey(keys);
        }
        var groups = this.defaultSettingsEditorModel.settingsGroups.slice(1); // Without commonlyUsed
        var dividedGroups = collections.groupBy(groups, function (g) { return g.contributedByExtension ? 'extension' : 'core'; });
        var settingsResult = resolveSettingsTree(tocData, dividedGroups.core);
        var resolvedSettingsRoot = settingsResult.tree;
        // Warn for settings not included in layout
        if (settingsResult.leftoverSettings.size && !this.hasWarnedMissingSettings) {
            var settingKeyList_1 = [];
            settingsResult.leftoverSettings.forEach(function (s) {
                settingKeyList_1.push(s.key);
            });
            this.logService.warn("SettingsEditor2: Settings not included in settingsLayout.ts: " + settingKeyList_1.join(', '));
            this.hasWarnedMissingSettings = true;
        }
        var commonlyUsed = resolveSettingsTree(commonlyUsedData, dividedGroups.core);
        resolvedSettingsRoot.children.unshift(commonlyUsed.tree);
        resolvedSettingsRoot.children.push(resolveExtensionsSettings(dividedGroups.extension || []));
        if (this.searchResultModel) {
            this.searchResultModel.updateChildren();
        }
        if (this.settingsTreeModel) {
            this.settingsTreeModel.update(resolvedSettingsRoot);
            return this.renderTree(undefined, forceRefresh);
        }
        else {
            this.settingsTreeModel = this.instantiationService.createInstance(SettingsTreeModel, this.viewState);
            this.settingsTreeModel.update(resolvedSettingsRoot);
            this.settingsTree.setInput(this.settingsTreeModel.root);
            this.tocTreeModel.settingsTreeRoot = this.settingsTreeModel.root;
            if (this.tocTree.getInput()) {
                this.tocTree.refresh();
            }
            else {
                this.tocTree.setInput(this.tocTreeModel);
            }
        }
        return TPromise.wrap(null);
    };
    SettingsEditor2.prototype.updateElementsByKey = function (keys) {
        var _this = this;
        if (keys.length) {
            if (this.searchResultModel) {
                keys.forEach(function (key) { return _this.searchResultModel.updateElementsByName(key); });
            }
            if (this.settingsTreeModel) {
                keys.forEach(function (key) { return _this.settingsTreeModel.updateElementsByName(key); });
            }
            return TPromise.join(keys.map(function (key) { return _this.renderTree(key); }))
                .then(function () { });
        }
        else {
            return this.renderTree();
        }
    };
    SettingsEditor2.prototype.getActiveElementInSettingsTree = function () {
        return (document.activeElement && DOM.isAncestor(document.activeElement, this.settingsTree.getHTMLElement())) ?
            document.activeElement :
            null;
    };
    SettingsEditor2.prototype.renderTree = function (key, force) {
        var _this = this;
        if (force === void 0) { force = false; }
        if (!force && key && this.scheduledRefreshes.has(key)) {
            this.updateModifiedLabelForKey(key);
            return TPromise.wrap(null);
        }
        // If a setting control is currently focused, schedule a refresh for later
        var focusedSetting = this.settingsTreeRenderer.getSettingDOMElementForDOMElement(this.getActiveElementInSettingsTree());
        if (focusedSetting && !force) {
            // If a single setting is being refreshed, it's ok to refresh now if that is not the focused setting
            if (key) {
                var focusedKey = focusedSetting.getAttribute(SettingsRenderer.SETTING_KEY_ATTR);
                if (focusedKey === key &&
                    !DOM.hasClass(focusedSetting, 'setting-item-exclude')) { // update `exclude`s live, as they have a separate "submit edit" step built in before this
                    this.updateModifiedLabelForKey(key);
                    this.scheduleRefresh(focusedSetting, key);
                    return TPromise.wrap(null);
                }
            }
            else {
                this.scheduleRefresh(focusedSetting);
                return TPromise.wrap(null);
            }
        }
        var refreshP;
        if (key) {
            var elements = this.currentSettingsModel.getElementsByName(key);
            if (elements && elements.length) {
                // TODO https://github.com/Microsoft/vscode/issues/57360
                // refreshP = TPromise.join(elements.map(e => this.settingsTree.refresh(e)));
                refreshP = this.settingsTree.refresh();
            }
            else {
                // Refresh requested for a key that we don't know about
                return TPromise.wrap(null);
            }
        }
        else {
            refreshP = this.settingsTree.refresh();
        }
        return refreshP.then(function () {
            _this.tocTreeModel.update();
            _this.renderResultCountMessages();
            // if (this.searchResultModel) {
            // 	expandAll(this.tocTree);
            // }
            return _this.tocTree.refresh();
        }).then(function () { });
    };
    SettingsEditor2.prototype.updateModifiedLabelForKey = function (key) {
        var dataElements = this.currentSettingsModel.getElementsByName(key);
        var isModified = dataElements && dataElements[0] && dataElements[0].isConfigured; // all elements are either configured or not
        var elements = this.settingsTreeRenderer.getDOMElementsForSettingKey(this.settingsTree.getHTMLElement(), key);
        if (elements && elements[0]) {
            DOM.toggleClass(elements[0], 'is-configured', isModified);
        }
    };
    SettingsEditor2.prototype.onSearchInputChanged = function () {
        var _this = this;
        var query = this.searchWidget.getValue().trim();
        this.delayedFilterLogging.cancel();
        this.triggerSearch(query.replace(/›/g, ' ')).then(function () {
            if (query && _this.searchResultModel) {
                _this.delayedFilterLogging.trigger(function () { return _this.reportFilteringUsed(query, _this.searchResultModel.getUniqueResults()); });
            }
        });
    };
    SettingsEditor2.prototype.parseSettingFromJSON = function (query) {
        var match = query.match(/"([a-zA-Z.]+)": /);
        return match && match[1];
    };
    SettingsEditor2.prototype.triggerSearch = function (query) {
        var _this = this;
        this.viewState.tagFilters = new Set();
        if (query) {
            var parsedQuery = parseQuery(query);
            query = parsedQuery.query;
            parsedQuery.tags.forEach(function (tag) { return _this.viewState.tagFilters.add(tag); });
        }
        if (query && query !== '@') {
            query = this.parseSettingFromJSON(query) || query;
            return this.triggerFilterPreferences(query);
        }
        else {
            if (this.viewState.tagFilters && this.viewState.tagFilters.size) {
                this.searchResultModel = this.createFilterModel();
            }
            else {
                this.searchResultModel = null;
            }
            this.localSearchDelayer.cancel();
            this.remoteSearchThrottle.cancel();
            if (this.searchInProgress) {
                this.searchInProgress.cancel();
                this.searchInProgress.dispose();
                this.searchInProgress = null;
            }
            this.viewState.filterToCategory = null;
            this.tocTreeModel.currentSearchModel = this.searchResultModel;
            this.tocTree.refresh();
            this.onSearchModeToggled();
            if (this.searchResultModel) {
                // Added a filter model
                this.tocTree.setSelection([]);
                expandAll(this.tocTree);
                return this.settingsTree.setInput(this.searchResultModel.root).then(function () {
                    _this.renderResultCountMessages();
                });
            }
            else {
                // Leaving search mode
                collapseAll(this.tocTree);
                return this.settingsTree.setInput(this.settingsTreeModel.root).then(function () { return _this.renderResultCountMessages(); });
            }
        }
    };
    /**
     * Return a fake SearchResultModel which can hold a flat list of all settings, to be filtered (@modified etc)
     */
    SettingsEditor2.prototype.createFilterModel = function () {
        var filterModel = this.instantiationService.createInstance(SearchResultModel, this.viewState);
        var fullResult = {
            filterMatches: []
        };
        for (var _i = 0, _a = this.defaultSettingsEditorModel.settingsGroups.slice(1); _i < _a.length; _i++) {
            var g = _a[_i];
            for (var _b = 0, _c = g.sections; _b < _c.length; _b++) {
                var sect = _c[_b];
                for (var _d = 0, _e = sect.settings; _d < _e.length; _d++) {
                    var setting = _e[_d];
                    fullResult.filterMatches.push({ setting: setting, matches: [], score: 0 });
                }
            }
        }
        filterModel.setResult(0, fullResult);
        return filterModel;
    };
    SettingsEditor2.prototype.reportFilteringUsed = function (query, results) {
        var nlpResult = results[1 /* Remote */];
        var nlpMetadata = nlpResult && nlpResult.metadata;
        var durations = {};
        durations['nlpResult'] = nlpMetadata && nlpMetadata.duration;
        // Count unique results
        var counts = {};
        var filterResult = results[0 /* Local */];
        if (filterResult) {
            counts['filterResult'] = filterResult.filterMatches.length;
        }
        if (nlpResult) {
            counts['nlpResult'] = nlpResult.filterMatches.length;
        }
        var requestCount = nlpMetadata && nlpMetadata.requestCount;
        var data = {
            query: query,
            durations: durations,
            counts: counts,
            requestCount: requestCount
        };
        /* __GDPR__
            "settingsEditor.filter" : {
                "query": { "classification": "CustomerContent", "purpose": "FeatureInsight" },
                "durations.nlpResult" : { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true },
                "counts.nlpResult" : { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true },
                "counts.filterResult" : { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true },
                "requestCount" : { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true }
            }
        */
        this.telemetryService.publicLog('settingsEditor.filter', data);
        var data2 = {
            durations: durations,
            counts: counts,
            requestCount: requestCount
        };
        /* __GDPR__
            "settingsEditor.filter<NUMBER>" : {
                "durations.nlpResult" : { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true },
                "counts.nlpResult" : { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true },
                "counts.filterResult" : { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true },
                "requestCount" : { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true }
            }
        */
        this.telemetryService.publicLog('settingsEditor.filter2', data2);
    };
    SettingsEditor2.prototype.triggerFilterPreferences = function (query) {
        var _this = this;
        if (this.searchInProgress) {
            this.searchInProgress.cancel();
            this.searchInProgress = null;
        }
        // Trigger the local search. If it didn't find an exact match, trigger the remote search.
        var searchInProgress = this.searchInProgress = new CancellationTokenSource();
        return this.localSearchDelayer.trigger(function () {
            if (searchInProgress && !searchInProgress.token.isCancellationRequested) {
                return _this.localFilterPreferences(query).then(function (result) {
                    if (!result.exactMatch) {
                        _this.remoteSearchThrottle.trigger(function () {
                            return searchInProgress && !searchInProgress.token.isCancellationRequested ?
                                _this.remoteSearchPreferences(query, _this.searchInProgress.token) :
                                TPromise.wrap(null);
                        });
                    }
                });
            }
            else {
                return TPromise.wrap(null);
            }
        });
    };
    SettingsEditor2.prototype.localFilterPreferences = function (query, token) {
        var localSearchProvider = this.preferencesSearchService.getLocalSearchProvider(query);
        return this.filterOrSearchPreferences(query, 0 /* Local */, localSearchProvider, token);
    };
    SettingsEditor2.prototype.remoteSearchPreferences = function (query, token) {
        var _this = this;
        var remoteSearchProvider = this.preferencesSearchService.getRemoteSearchProvider(query);
        var newExtSearchProvider = this.preferencesSearchService.getRemoteSearchProvider(query, true);
        return TPromise.join([
            this.filterOrSearchPreferences(query, 1 /* Remote */, remoteSearchProvider, token),
            this.filterOrSearchPreferences(query, 2 /* NewExtensions */, newExtSearchProvider, token)
        ]).then(function () {
            _this.renderResultCountMessages();
        });
    };
    SettingsEditor2.prototype.filterOrSearchPreferences = function (query, type, searchProvider, token) {
        var _this = this;
        return this._filterOrSearchPreferencesModel(query, this.defaultSettingsEditorModel, searchProvider, token).then(function (result) {
            if (token && token.isCancellationRequested) {
                // Handle cancellation like this because cancellation is lost inside the search provider due to async/await
                return null;
            }
            if (!_this.searchResultModel) {
                _this.searchResultModel = _this.instantiationService.createInstance(SearchResultModel, _this.viewState);
                _this.searchResultModel.setResult(type, result);
                _this.tocTreeModel.currentSearchModel = _this.searchResultModel;
                _this.onSearchModeToggled();
                _this.settingsTree.setInput(_this.searchResultModel.root);
            }
            else {
                _this.searchResultModel.setResult(type, result);
                _this.tocTreeModel.update();
            }
            _this.tocTree.setSelection([]);
            _this.viewState.filterToCategory = null;
            expandAll(_this.tocTree);
            return _this.renderTree().then(function () { return result; });
        });
    };
    SettingsEditor2.prototype.renderResultCountMessages = function () {
        if (!this.settingsTree.getInput()) {
            return;
        }
        if (this.tocTreeModel && this.tocTreeModel.settingsTreeRoot) {
            var count = this.tocTreeModel.settingsTreeRoot.count;
            switch (count) {
                case 0:
                    this.countElement.innerText = localize('noResults', "No Settings Found");
                    break;
                case 1:
                    this.countElement.innerText = localize('oneResult', "1 Setting Found");
                    break;
                default: this.countElement.innerText = localize('moreThanOneResult', "{0} Settings Found", count);
            }
            this.countElement.style.display = 'block';
            this.noResultsMessage.style.display = count === 0 ? 'block' : 'none';
        }
    };
    SettingsEditor2.prototype._filterOrSearchPreferencesModel = function (filter, model, provider, token) {
        var _this = this;
        var searchP = provider ? provider.searchModel(model, token) : TPromise.wrap(null);
        return searchP
            .then(null, function (err) {
            if (isPromiseCanceledError(err)) {
                return TPromise.wrapError(err);
            }
            else {
                /* __GDPR__
                    "settingsEditor.searchError" : {
                        "message": { "classification": "CallstackOrException", "purpose": "FeatureInsight" },
                        "filter": { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
                    }
                */
                var message = getErrorMessage(err).trim();
                if (message && message !== 'Error') {
                    // "Error" = any generic network error
                    _this.telemetryService.publicLog('settingsEditor.searchError', { message: message, filter: filter });
                    _this.logService.info('Setting search error: ' + message);
                }
                return null;
            }
        });
    };
    SettingsEditor2.prototype.layoutTrees = function (dimension) {
        var listHeight = dimension.height - (76 + 11 /* header height + padding*/);
        var settingsTreeHeight = listHeight - 14;
        this.settingsTreeContainer.style.height = settingsTreeHeight + "px";
        this.settingsTree.layout(settingsTreeHeight, 800);
        var tocTreeHeight = listHeight - 16;
        this.tocTreeContainer.style.height = tocTreeHeight + "px";
        this.tocTree.layout(tocTreeHeight, 175);
        this.settingsTreeRenderer.updateWidth(dimension.width);
    };
    SettingsEditor2.ID = 'workbench.editor.settings2';
    SettingsEditor2.NUM_INSTANCES = 0;
    SettingsEditor2.SETTING_UPDATE_FAST_DEBOUNCE = 200;
    SettingsEditor2.SETTING_UPDATE_SLOW_DEBOUNCE = 1000;
    SettingsEditor2.SUGGESTIONS = [
        '@modified', '@tag:usesOnlineServices'
    ];
    SettingsEditor2 = __decorate([
        __param(0, ITelemetryService),
        __param(1, IConfigurationService),
        __param(2, IThemeService),
        __param(3, IPreferencesService),
        __param(4, IInstantiationService),
        __param(5, IPreferencesSearchService),
        __param(6, ILogService),
        __param(7, IEnvironmentService),
        __param(8, IContextKeyService),
        __param(9, IContextMenuService),
        __param(10, IStorageService),
        __param(11, INotificationService),
        __param(12, IKeybindingService)
    ], SettingsEditor2);
    return SettingsEditor2;
}(BaseEditor));
export { SettingsEditor2 };
var FilterByTagAction = /** @class */ (function (_super) {
    __extends(FilterByTagAction, _super);
    function FilterByTagAction(label, tag, settingsEditor) {
        var _this = _super.call(this, FilterByTagAction.ID, label, 'toggle-filter-tag') || this;
        _this.tag = tag;
        _this.settingsEditor = settingsEditor;
        return _this;
    }
    FilterByTagAction.prototype.run = function () {
        this.settingsEditor.focusSearch(this.tag === MODIFIED_SETTING_TAG ? "@" + this.tag + " " : "@tag:" + this.tag + " ", false);
        return TPromise.as(null);
    };
    FilterByTagAction.ID = 'settings.filterByTag';
    return FilterByTagAction;
}(Action));
