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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import './media/quickopen.css';
import { TPromise } from '../../../../base/common/winjs.base.js';
import * as nls from '../../../../nls.js';
import * as browser from '../../../../base/browser/browser.js';
import * as strings from '../../../../base/common/strings.js';
import * as resources from '../../../../base/common/resources.js';
import * as types from '../../../../base/common/types.js';
import { Action } from '../../../../base/common/actions.js';
import { QuickOpenModel, QuickOpenEntryGroup, QuickOpenItemAccessorClass } from '../../../../base/parts/quickopen/browser/quickOpenModel.js';
import { QuickOpenWidget } from '../../../../base/parts/quickopen/browser/quickOpenWidget.js';
import { ContributableActionProvider } from '../../actions.js';
import { ITextFileService } from '../../../services/textfile/common/textfiles.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IModeService } from '../../../../editor/common/services/modeService.js';
import { getIconClasses } from '../../labels.js';
import { IModelService } from '../../../../editor/common/services/modelService.js';
import { EditorInput } from '../../../common/editor.js';
import { Component } from '../../../common/component.js';
import { Emitter } from '../../../../base/common/event.js';
import { IPartService } from '../../../services/part/common/partService.js';
import { Extensions, EditorQuickOpenEntry, CLOSE_ON_FOCUS_LOST_CONFIG, SEARCH_EDITOR_HISTORY, PREFILL_CONFIG } from '../../quickopen.js';
import * as errors from '../../../../base/common/errors.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { IHistoryService } from '../../../services/history/common/history.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { SIDE_BAR_BACKGROUND, SIDE_BAR_FOREGROUND } from '../../../common/theme.js';
import { attachQuickOpenStyler } from '../../../../platform/theme/common/styler.js';
import { IEnvironmentService } from '../../../../platform/environment/common/environment.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { scoreItem, compareItemsByScore, prepareQuery } from '../../../../base/parts/quickopen/common/quickOpenScorer.js';
import { WorkbenchTree } from '../../../../platform/list/browser/listService.js';
import { Schemas } from '../../../../base/common/network.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { addClass } from '../../../../base/browser/dom.js';
import { IEditorService, ACTIVE_GROUP, SIDE_GROUP } from '../../../services/editor/common/editorService.js';
import { IEditorGroupsService } from '../../../services/group/common/editorGroupsService.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { timeout } from '../../../../base/common/async.js';
import { IQuickInputService } from '../../../../platform/quickinput/common/quickInput.js';
import { CancellationTokenSource } from '../../../../base/common/cancellation.js';
var HELP_PREFIX = '?';
var QuickOpenController = /** @class */ (function (_super) {
    __extends(QuickOpenController, _super);
    function QuickOpenController(editorGroupService, notificationService, contextKeyService, configurationService, instantiationService, partService, environmentService, themeService) {
        var _this = _super.call(this, QuickOpenController.ID, themeService) || this;
        _this.editorGroupService = editorGroupService;
        _this.notificationService = notificationService;
        _this.contextKeyService = contextKeyService;
        _this.configurationService = configurationService;
        _this.instantiationService = instantiationService;
        _this.partService = partService;
        _this.environmentService = environmentService;
        _this._onShow = _this._register(new Emitter());
        _this._onHide = _this._register(new Emitter());
        _this.mapResolvedHandlersToPrefix = Object.create(null);
        _this.mapContextKeyToContext = Object.create(null);
        _this.handlerOnOpenCalled = Object.create(null);
        _this.promisesToCompleteOnHide = [];
        _this.actionProvider = new ContributableActionProvider();
        _this.editorHistoryHandler = _this.instantiationService.createInstance(EditorHistoryHandler);
        _this.updateConfiguration();
        _this.registerListeners();
        return _this;
    }
    Object.defineProperty(QuickOpenController.prototype, "onShow", {
        get: function () { return this._onShow.event; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QuickOpenController.prototype, "onHide", {
        get: function () { return this._onHide.event; },
        enumerable: true,
        configurable: true
    });
    QuickOpenController.prototype.registerListeners = function () {
        var _this = this;
        this._register(this.configurationService.onDidChangeConfiguration(function () { return _this.updateConfiguration(); }));
        this._register(this.partService.onTitleBarVisibilityChange(function () { return _this.positionQuickOpenWidget(); }));
        this._register(browser.onDidChangeZoomLevel(function () { return _this.positionQuickOpenWidget(); }));
    };
    QuickOpenController.prototype.updateConfiguration = function () {
        if (this.environmentService.args['sticky-quickopen']) {
            this.closeOnFocusLost = false;
        }
        else {
            this.closeOnFocusLost = this.configurationService.getValue(CLOSE_ON_FOCUS_LOST_CONFIG);
        }
        this.prefill = this.configurationService.getValue(PREFILL_CONFIG);
        this.searchInEditorHistory = this.configurationService.getValue(SEARCH_EDITOR_HISTORY);
    };
    QuickOpenController.prototype.navigate = function (next, quickNavigate) {
        if (this.quickOpenWidget) {
            this.quickOpenWidget.navigate(next, quickNavigate);
        }
    };
    QuickOpenController.prototype.accept = function () {
        if (this.quickOpenWidget && this.quickOpenWidget.isVisible()) {
            this.quickOpenWidget.accept();
        }
    };
    QuickOpenController.prototype.focus = function () {
        if (this.quickOpenWidget && this.quickOpenWidget.isVisible()) {
            this.quickOpenWidget.focus();
        }
    };
    QuickOpenController.prototype.close = function () {
        if (this.quickOpenWidget && this.quickOpenWidget.isVisible()) {
            this.quickOpenWidget.hide(2 /* CANCELED */);
        }
    };
    QuickOpenController.prototype.emitQuickOpenVisibilityChange = function (isVisible) {
        if (isVisible) {
            this._onShow.fire();
        }
        else {
            this._onHide.fire();
        }
    };
    QuickOpenController.prototype.show = function (prefix, options) {
        var _this = this;
        var quickNavigateConfiguration = options ? options.quickNavigateConfiguration : void 0;
        var inputSelection = options ? options.inputSelection : void 0;
        var autoFocus = options ? options.autoFocus : void 0;
        var promiseCompletedOnHide = new TPromise(function (c) {
            _this.promisesToCompleteOnHide.push(c);
        });
        // Telemetry: log that quick open is shown and log the mode
        var registry = Registry.as(Extensions.Quickopen);
        var handlerDescriptor = registry.getQuickOpenHandler(prefix) || registry.getDefaultQuickOpenHandler();
        // Trigger onOpen
        this.resolveHandler(handlerDescriptor);
        // Create upon first open
        if (!this.quickOpenWidget) {
            this.quickOpenWidget = this._register(new QuickOpenWidget(this.partService.getWorkbenchElement(), {
                onOk: function () { return _this.onOk(); },
                onCancel: function () { },
                onType: function (value) { return _this.onType(value || ''); },
                onShow: function () { return _this.handleOnShow(); },
                onHide: function (reason) { return _this.handleOnHide(reason); },
                onFocusLost: function () { return !_this.closeOnFocusLost; }
            }, {
                inputPlaceHolder: this.hasHandler(HELP_PREFIX) ? nls.localize('quickOpenInput', "Type '?' to get help on the actions you can take from here") : '',
                keyboardSupport: false,
                treeCreator: function (container, config, opts) { return _this.instantiationService.createInstance(WorkbenchTree, container, config, opts); }
            }));
            this._register(attachQuickOpenStyler(this.quickOpenWidget, this.themeService, { background: SIDE_BAR_BACKGROUND, foreground: SIDE_BAR_FOREGROUND }));
            var quickOpenContainer = this.quickOpenWidget.create();
            addClass(quickOpenContainer, 'show-file-icons');
            this.positionQuickOpenWidget();
        }
        // Layout
        if (this.dimension) {
            this.quickOpenWidget.layout(this.dimension);
        }
        // Show quick open with prefix or editor history
        if (!this.quickOpenWidget.isVisible() || quickNavigateConfiguration) {
            if (prefix) {
                this.quickOpenWidget.show(prefix, { quickNavigateConfiguration: quickNavigateConfiguration, inputSelection: inputSelection, autoFocus: autoFocus });
            }
            else {
                var editorHistory = this.getEditorHistoryWithGroupLabel();
                if (editorHistory.getEntries().length < 2) {
                    quickNavigateConfiguration = null; // If no entries can be shown, default to normal quick open mode
                }
                // Compute auto focus
                if (!autoFocus) {
                    if (!quickNavigateConfiguration) {
                        autoFocus = { autoFocusFirstEntry: true };
                    }
                    else {
                        var autoFocusFirstEntry = this.editorGroupService.activeGroup.count === 0;
                        autoFocus = { autoFocusFirstEntry: autoFocusFirstEntry, autoFocusSecondEntry: !autoFocusFirstEntry };
                    }
                }
                // Update context
                var registry_1 = Registry.as(Extensions.Quickopen);
                this.setQuickOpenContextKey(registry_1.getDefaultQuickOpenHandler().contextKey);
                if (this.prefill) {
                    this.quickOpenWidget.show(editorHistory, { value: this.lastSubmittedInputValue, quickNavigateConfiguration: quickNavigateConfiguration, autoFocus: autoFocus, inputSelection: inputSelection });
                }
                else {
                    this.quickOpenWidget.show(editorHistory, { quickNavigateConfiguration: quickNavigateConfiguration, autoFocus: autoFocus, inputSelection: inputSelection });
                }
            }
        }
        // Otherwise reset the widget to the prefix that is passed in
        else {
            this.quickOpenWidget.show(prefix || '', { inputSelection: inputSelection });
        }
        return promiseCompletedOnHide;
    };
    QuickOpenController.prototype.positionQuickOpenWidget = function () {
        var titlebarOffset = this.partService.getTitleBarOffset();
        if (this.quickOpenWidget) {
            this.quickOpenWidget.getElement().style.top = titlebarOffset + "px";
        }
    };
    QuickOpenController.prototype.handleOnShow = function () {
        this.emitQuickOpenVisibilityChange(true);
    };
    QuickOpenController.prototype.handleOnHide = function (reason) {
        var _this = this;
        // Clear state
        this.previousActiveHandlerDescriptor = null;
        // Cancel pending results calls
        this.cancelPendingGetResultsInvocation();
        var _loop_1 = function (prefix) {
            var promise = this_1.mapResolvedHandlersToPrefix[prefix];
            promise.then(function (handler) {
                _this.handlerOnOpenCalled[prefix] = false;
                handler.onClose(reason === 2 /* CANCELED */); // Don't check if onOpen was called to preserve old behaviour for now
            });
        };
        var this_1 = this;
        // Pass to handlers
        for (var prefix in this.mapResolvedHandlersToPrefix) {
            _loop_1(prefix);
        }
        // Complete promises that are waiting
        while (this.promisesToCompleteOnHide.length) {
            this.promisesToCompleteOnHide.pop()(true);
        }
        if (reason !== 1 /* FOCUS_LOST */) {
            this.editorGroupService.activeGroup.focus(); // focus back to editor group unless user clicked somewhere else
        }
        // Reset context keys
        this.resetQuickOpenContextKeys();
        // Events
        this.emitQuickOpenVisibilityChange(false);
    };
    QuickOpenController.prototype.cancelPendingGetResultsInvocation = function () {
        if (this.pendingGetResultsInvocation) {
            this.pendingGetResultsInvocation.cancel();
            this.pendingGetResultsInvocation.dispose();
            this.pendingGetResultsInvocation = null;
        }
    };
    QuickOpenController.prototype.resetQuickOpenContextKeys = function () {
        var _this = this;
        Object.keys(this.mapContextKeyToContext).forEach(function (k) { return _this.mapContextKeyToContext[k].reset(); });
    };
    QuickOpenController.prototype.setQuickOpenContextKey = function (id) {
        var key;
        if (id) {
            key = this.mapContextKeyToContext[id];
            if (!key) {
                key = new RawContextKey(id, false).bindTo(this.contextKeyService);
                this.mapContextKeyToContext[id] = key;
            }
        }
        if (key && key.get()) {
            return; // already active context
        }
        this.resetQuickOpenContextKeys();
        if (key) {
            key.set(true);
        }
    };
    QuickOpenController.prototype.hasHandler = function (prefix) {
        return !!Registry.as(Extensions.Quickopen).getQuickOpenHandler(prefix);
    };
    QuickOpenController.prototype.getEditorHistoryWithGroupLabel = function () {
        var entries = this.editorHistoryHandler.getResults();
        // Apply label to first entry
        if (entries.length > 0) {
            entries[0] = new EditorHistoryEntryGroup(entries[0], nls.localize('historyMatches', "recently opened"), false);
        }
        return new QuickOpenModel(entries, this.actionProvider);
    };
    QuickOpenController.prototype.onOk = function () {
        if (this.isQuickOpen) {
            this.lastSubmittedInputValue = this.lastInputValue;
        }
    };
    QuickOpenController.prototype.onType = function (value) {
        var _this = this;
        // cancel any pending get results invocation and create new
        this.cancelPendingGetResultsInvocation();
        var pendingResultsInvocationTokenSource = new CancellationTokenSource();
        var pendingResultsInvocationToken = pendingResultsInvocationTokenSource.token;
        this.pendingGetResultsInvocation = pendingResultsInvocationTokenSource;
        // look for a handler
        var registry = Registry.as(Extensions.Quickopen);
        var handlerDescriptor = registry.getQuickOpenHandler(value);
        var defaultHandlerDescriptor = registry.getDefaultQuickOpenHandler();
        var instantProgress = handlerDescriptor && handlerDescriptor.instantProgress;
        var contextKey = handlerDescriptor ? handlerDescriptor.contextKey : defaultHandlerDescriptor.contextKey;
        // Reset Progress
        if (!instantProgress) {
            this.quickOpenWidget.getProgressBar().stop().hide();
        }
        // Reset Extra Class
        this.quickOpenWidget.setExtraClass(null);
        // Update context
        this.setQuickOpenContextKey(contextKey);
        // Remove leading and trailing whitespace
        var trimmedValue = strings.trim(value);
        // If no value provided, default to editor history
        if (!trimmedValue) {
            // Trigger onOpen
            this.resolveHandler(handlerDescriptor || defaultHandlerDescriptor);
            this.quickOpenWidget.setInput(this.getEditorHistoryWithGroupLabel(), { autoFocusFirstEntry: true });
            // If quickOpen entered empty we have to clear the prefill-cache
            this.lastInputValue = '';
            this.isQuickOpen = true;
            return;
        }
        var resultPromise;
        var resultPromiseDone = false;
        if (handlerDescriptor) {
            this.isQuickOpen = false;
            resultPromise = this.handleSpecificHandler(handlerDescriptor, value, pendingResultsInvocationToken);
        }
        // Otherwise handle default handlers if no specific handler present
        else {
            this.isQuickOpen = true;
            // Cache the value for prefilling the quickOpen next time is opened
            this.lastInputValue = trimmedValue;
            resultPromise = this.handleDefaultHandler(defaultHandlerDescriptor, value, pendingResultsInvocationToken);
        }
        // Remember as the active one
        this.previousActiveHandlerDescriptor = handlerDescriptor;
        // Progress if task takes a long time
        setTimeout(function () {
            if (!resultPromiseDone && !pendingResultsInvocationToken.isCancellationRequested) {
                _this.quickOpenWidget.getProgressBar().infinite().show();
            }
        }, instantProgress ? 0 : 800);
        // Promise done handling
        resultPromise.then(function () {
            resultPromiseDone = true;
            if (!pendingResultsInvocationToken.isCancellationRequested) {
                _this.quickOpenWidget.getProgressBar().hide();
            }
            pendingResultsInvocationTokenSource.dispose();
        }, function (error) {
            resultPromiseDone = true;
            pendingResultsInvocationTokenSource.dispose();
            errors.onUnexpectedError(error);
            _this.notificationService.error(types.isString(error) ? new Error(error) : error);
        });
    };
    QuickOpenController.prototype.handleDefaultHandler = function (handler, value, token) {
        var _this = this;
        // Fill in history results if matching and we are configured to search in history
        var matchingHistoryEntries;
        if (value && !this.searchInEditorHistory) {
            matchingHistoryEntries = [];
        }
        else {
            matchingHistoryEntries = this.editorHistoryHandler.getResults(value, token);
        }
        if (matchingHistoryEntries.length > 0) {
            matchingHistoryEntries[0] = new EditorHistoryEntryGroup(matchingHistoryEntries[0], nls.localize('historyMatches', "recently opened"), false);
        }
        // Resolve
        return this.resolveHandler(handler).then(function (resolvedHandler) {
            var quickOpenModel = new QuickOpenModel(matchingHistoryEntries, _this.actionProvider);
            var inputSet = false;
            // If we have matching entries from history we want to show them directly and not wait for the other results to come in
            // This also applies when we used to have entries from a previous run and now there are no more history results matching
            var previousInput = _this.quickOpenWidget.getInput();
            var wasShowingHistory = previousInput && previousInput.entries && previousInput.entries.some(function (e) { return e instanceof EditorHistoryEntry || e instanceof EditorHistoryEntryGroup; });
            if (wasShowingHistory || matchingHistoryEntries.length > 0) {
                var responseDelay = void 0;
                if (resolvedHandler.hasShortResponseTime()) {
                    responseDelay = timeout(QuickOpenController.MAX_SHORT_RESPONSE_TIME);
                }
                else {
                    responseDelay = Promise.resolve(void 0);
                }
                responseDelay.then(function () {
                    if (!token.isCancellationRequested && !inputSet) {
                        _this.quickOpenWidget.setInput(quickOpenModel, { autoFocusFirstEntry: true });
                        inputSet = true;
                    }
                });
            }
            // Get results
            return resolvedHandler.getResults(value, token).then(function (result) {
                if (!token.isCancellationRequested) {
                    // now is the time to show the input if we did not have set it before
                    if (!inputSet) {
                        _this.quickOpenWidget.setInput(quickOpenModel, { autoFocusFirstEntry: true });
                        inputSet = true;
                    }
                    // merge history and default handler results
                    var handlerResults = (result && result.entries) || [];
                    _this.mergeResults(quickOpenModel, handlerResults, resolvedHandler.getGroupLabel());
                }
            });
        });
    };
    QuickOpenController.prototype.mergeResults = function (quickOpenModel, handlerResults, groupLabel) {
        // Remove results already showing by checking for a "resource" property
        var mapEntryToResource = this.mapEntriesToResource(quickOpenModel);
        var additionalHandlerResults = [];
        for (var i = 0; i < handlerResults.length; i++) {
            var result = handlerResults[i];
            var resource = result.getResource();
            if (!result.mergeWithEditorHistory() || !resource || !mapEntryToResource[resource.toString()]) {
                additionalHandlerResults.push(result);
            }
        }
        // Show additional handler results below any existing results
        if (additionalHandlerResults.length > 0) {
            var autoFocusFirstEntry = (quickOpenModel.getEntries().length === 0); // the user might have selected another entry meanwhile in local history (see https://github.com/Microsoft/vscode/issues/20828)
            var useTopBorder = quickOpenModel.getEntries().length > 0;
            additionalHandlerResults[0] = new QuickOpenEntryGroup(additionalHandlerResults[0], groupLabel, useTopBorder);
            quickOpenModel.addEntries(additionalHandlerResults);
            this.quickOpenWidget.refresh(quickOpenModel, { autoFocusFirstEntry: autoFocusFirstEntry });
        }
        // Otherwise if no results are present (even from histoy) indicate this to the user
        else if (quickOpenModel.getEntries().length === 0) {
            quickOpenModel.addEntries([new PlaceholderQuickOpenEntry(nls.localize('noResultsFound1', "No results found"))]);
            this.quickOpenWidget.refresh(quickOpenModel, { autoFocusFirstEntry: true });
        }
    };
    QuickOpenController.prototype.handleSpecificHandler = function (handlerDescriptor, value, token) {
        var _this = this;
        return this.resolveHandler(handlerDescriptor).then(function (resolvedHandler) {
            // Remove handler prefix from search value
            value = value.substr(handlerDescriptor.prefix.length);
            // Return early if the handler can not run in the current environment and inform the user
            var canRun = resolvedHandler.canRun();
            if (types.isUndefinedOrNull(canRun) || (typeof canRun === 'boolean' && !canRun) || typeof canRun === 'string') {
                var placeHolderLabel = (typeof canRun === 'string') ? canRun : nls.localize('canNotRunPlaceholder', "This quick open handler can not be used in the current context");
                var model = new QuickOpenModel([new PlaceholderQuickOpenEntry(placeHolderLabel)], _this.actionProvider);
                _this.showModel(model, resolvedHandler.getAutoFocus(value, { model: model, quickNavigateConfiguration: _this.quickOpenWidget.getQuickNavigateConfiguration() }), resolvedHandler.getAriaLabel());
                return Promise.resolve(null);
            }
            // Support extra class from handler
            var extraClass = resolvedHandler.getClass();
            if (extraClass) {
                _this.quickOpenWidget.setExtraClass(extraClass);
            }
            // When handlers change, clear the result list first before loading the new results
            if (_this.previousActiveHandlerDescriptor !== handlerDescriptor) {
                _this.clearModel();
            }
            // Receive Results from Handler and apply
            return resolvedHandler.getResults(value, token).then(function (result) {
                if (!token.isCancellationRequested) {
                    if (!result || !result.entries.length) {
                        var model = new QuickOpenModel([new PlaceholderQuickOpenEntry(resolvedHandler.getEmptyLabel(value))]);
                        _this.showModel(model, resolvedHandler.getAutoFocus(value, { model: model, quickNavigateConfiguration: _this.quickOpenWidget.getQuickNavigateConfiguration() }), resolvedHandler.getAriaLabel());
                    }
                    else {
                        _this.showModel(result, resolvedHandler.getAutoFocus(value, { model: result, quickNavigateConfiguration: _this.quickOpenWidget.getQuickNavigateConfiguration() }), resolvedHandler.getAriaLabel());
                    }
                }
            });
        });
    };
    QuickOpenController.prototype.showModel = function (model, autoFocus, ariaLabel) {
        // If the given model is already set in the widget, refresh and return early
        if (this.quickOpenWidget.getInput() === model) {
            this.quickOpenWidget.refresh(model, autoFocus);
            return;
        }
        // Otherwise just set it
        this.quickOpenWidget.setInput(model, autoFocus, ariaLabel);
    };
    QuickOpenController.prototype.clearModel = function () {
        this.showModel(new QuickOpenModel(), null);
    };
    QuickOpenController.prototype.mapEntriesToResource = function (model) {
        var entries = model.getEntries();
        var mapEntryToPath = {};
        entries.forEach(function (entry) {
            if (entry.getResource()) {
                mapEntryToPath[entry.getResource().toString()] = entry;
            }
        });
        return mapEntryToPath;
    };
    QuickOpenController.prototype.resolveHandler = function (handler) {
        var _this = this;
        var result = this._resolveHandler(handler);
        var id = handler.getId();
        if (!this.handlerOnOpenCalled[id]) {
            var original_1 = result;
            this.handlerOnOpenCalled[id] = true;
            result = this.mapResolvedHandlersToPrefix[id] = original_1.then(function (resolved) {
                _this.mapResolvedHandlersToPrefix[id] = original_1;
                resolved.onOpen();
                return resolved;
            });
        }
        return result.then(null, function (error) {
            delete _this.mapResolvedHandlersToPrefix[id];
            return TPromise.wrapError(new Error("Unable to instantiate quick open handler " + handler.getId() + ": " + JSON.stringify(error)));
        });
    };
    QuickOpenController.prototype._resolveHandler = function (handler) {
        var id = handler.getId();
        // Return Cached
        if (this.mapResolvedHandlersToPrefix[id]) {
            return this.mapResolvedHandlersToPrefix[id];
        }
        // Otherwise load and create
        return this.mapResolvedHandlersToPrefix[id] = Promise.resolve(handler.instantiate(this.instantiationService));
    };
    QuickOpenController.prototype.layout = function (dimension) {
        this.dimension = dimension;
        if (this.quickOpenWidget) {
            this.quickOpenWidget.layout(this.dimension);
        }
    };
    QuickOpenController.MAX_SHORT_RESPONSE_TIME = 500;
    QuickOpenController.ID = 'workbench.component.quickopen';
    QuickOpenController = __decorate([
        __param(0, IEditorGroupsService),
        __param(1, INotificationService),
        __param(2, IContextKeyService),
        __param(3, IConfigurationService),
        __param(4, IInstantiationService),
        __param(5, IPartService),
        __param(6, IEnvironmentService),
        __param(7, IThemeService)
    ], QuickOpenController);
    return QuickOpenController;
}(Component));
export { QuickOpenController };
var PlaceholderQuickOpenEntry = /** @class */ (function (_super) {
    __extends(PlaceholderQuickOpenEntry, _super);
    function PlaceholderQuickOpenEntry(placeHolderLabel) {
        var _this = _super.call(this) || this;
        _this.placeHolderLabel = placeHolderLabel;
        return _this;
    }
    PlaceholderQuickOpenEntry.prototype.getLabel = function () {
        return this.placeHolderLabel;
    };
    return PlaceholderQuickOpenEntry;
}(QuickOpenEntryGroup));
var EditorHistoryHandler = /** @class */ (function () {
    function EditorHistoryHandler(historyService, instantiationService, fileService) {
        this.historyService = historyService;
        this.instantiationService = instantiationService;
        this.fileService = fileService;
        this.scorerCache = Object.create(null);
    }
    EditorHistoryHandler.prototype.getResults = function (searchValue, token) {
        var _this = this;
        // Massage search for scoring
        var query = prepareQuery(searchValue);
        // Just return all if we are not searching
        var history = this.historyService.getHistory();
        if (!query.value) {
            return history.map(function (input) { return _this.instantiationService.createInstance(EditorHistoryEntry, input); });
        }
        // Otherwise filter by search value and sort by score. Include matches on description
        // in case the user is explicitly including path separators.
        var accessor = query.containsPathSeparator ? MatchOnDescription : DoNotMatchOnDescription;
        return history
            // For now, only support to match on inputs that provide resource information
            .filter(function (input) {
            var resource;
            if (input instanceof EditorInput) {
                resource = resourceForEditorHistory(input, _this.fileService);
            }
            else {
                resource = input.resource;
            }
            return !!resource;
        })
            // Conver to quick open entries
            .map(function (input) { return _this.instantiationService.createInstance(EditorHistoryEntry, input); })
            // Make sure the search value is matching
            .filter(function (e) {
            var itemScore = scoreItem(e, query, false, accessor, _this.scorerCache);
            if (!itemScore.score) {
                return false;
            }
            e.setHighlights(itemScore.labelMatch, itemScore.descriptionMatch);
            return true;
        })
            // Sort by score and provide a fallback sorter that keeps the
            // recency of items in case the score for items is the same
            .sort(function (e1, e2) { return compareItemsByScore(e1, e2, query, false, accessor, _this.scorerCache, function () { return -1; }); });
    };
    EditorHistoryHandler = __decorate([
        __param(0, IHistoryService),
        __param(1, IInstantiationService),
        __param(2, IFileService)
    ], EditorHistoryHandler);
    return EditorHistoryHandler;
}());
var EditorHistoryItemAccessorClass = /** @class */ (function (_super) {
    __extends(EditorHistoryItemAccessorClass, _super);
    function EditorHistoryItemAccessorClass(allowMatchOnDescription) {
        var _this = _super.call(this) || this;
        _this.allowMatchOnDescription = allowMatchOnDescription;
        return _this;
    }
    EditorHistoryItemAccessorClass.prototype.getItemDescription = function (entry) {
        return this.allowMatchOnDescription ? entry.getDescription() : void 0;
    };
    return EditorHistoryItemAccessorClass;
}(QuickOpenItemAccessorClass));
var MatchOnDescription = new EditorHistoryItemAccessorClass(true);
var DoNotMatchOnDescription = new EditorHistoryItemAccessorClass(false);
var EditorHistoryEntryGroup = /** @class */ (function (_super) {
    __extends(EditorHistoryEntryGroup, _super);
    function EditorHistoryEntryGroup() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return EditorHistoryEntryGroup;
}(QuickOpenEntryGroup));
export { EditorHistoryEntryGroup };
var EditorHistoryEntry = /** @class */ (function (_super) {
    __extends(EditorHistoryEntry, _super);
    function EditorHistoryEntry(input, editorService, modeService, modelService, textFileService, configurationService, labelService, fileService) {
        var _this = _super.call(this, editorService) || this;
        _this.modeService = modeService;
        _this.modelService = modelService;
        _this.textFileService = textFileService;
        _this.configurationService = configurationService;
        _this.input = input;
        if (input instanceof EditorInput) {
            _this.resource = resourceForEditorHistory(input, fileService);
            _this.label = input.getName();
            _this.description = input.getDescription();
            _this.dirty = input.isDirty();
        }
        else {
            var resourceInput = input;
            _this.resource = resourceInput.resource;
            _this.label = resources.basenameOrAuthority(resourceInput.resource);
            _this.description = labelService.getUriLabel(resources.dirname(_this.resource), { relative: true });
            _this.dirty = _this.resource && _this.textFileService.isDirty(_this.resource);
            if (_this.dirty && _this.textFileService.getAutoSaveMode() === 1 /* AFTER_SHORT_DELAY */) {
                _this.dirty = false; // no dirty decoration if auto save is on with a short timeout
            }
        }
        return _this;
    }
    EditorHistoryEntry.prototype.getIcon = function () {
        return this.dirty ? 'dirty' : '';
    };
    EditorHistoryEntry.prototype.getLabel = function () {
        return this.label;
    };
    EditorHistoryEntry.prototype.getLabelOptions = function () {
        return {
            extraClasses: getIconClasses(this.modelService, this.modeService, this.resource)
        };
    };
    EditorHistoryEntry.prototype.getAriaLabel = function () {
        return nls.localize('entryAriaLabel', "{0}, recently opened", this.getLabel());
    };
    EditorHistoryEntry.prototype.getDescription = function () {
        return this.description;
    };
    EditorHistoryEntry.prototype.getResource = function () {
        return this.resource;
    };
    EditorHistoryEntry.prototype.getInput = function () {
        return this.input;
    };
    EditorHistoryEntry.prototype.run = function (mode, context) {
        if (mode === 1 /* OPEN */) {
            var sideBySide = !context.quickNavigateConfiguration && (context.keymods.alt || context.keymods.ctrlCmd);
            var pinned = !this.configurationService.getValue().workbench.editor.enablePreviewFromQuickOpen || context.keymods.alt;
            if (this.input instanceof EditorInput) {
                this.editorService.openEditor(this.input, { pinned: pinned }, sideBySide ? SIDE_GROUP : ACTIVE_GROUP);
            }
            else {
                this.editorService.openEditor({ resource: this.input.resource, options: { pinned: pinned } }, sideBySide ? SIDE_GROUP : ACTIVE_GROUP);
            }
            return true;
        }
        return _super.prototype.run.call(this, mode, context);
    };
    EditorHistoryEntry = __decorate([
        __param(1, IEditorService),
        __param(2, IModeService),
        __param(3, IModelService),
        __param(4, ITextFileService),
        __param(5, IConfigurationService),
        __param(6, ILabelService),
        __param(7, IFileService)
    ], EditorHistoryEntry);
    return EditorHistoryEntry;
}(EditorQuickOpenEntry));
export { EditorHistoryEntry };
function resourceForEditorHistory(input, fileService) {
    var resource = input ? input.getResource() : void 0;
    // For the editor history we only prefer resources that are either untitled or
    // can be handled by the file service which indicates they are editable resources.
    if (resource && (fileService.canHandleResource(resource) || resource.scheme === Schemas.untitled)) {
        return resource;
    }
    return void 0;
}
var RemoveFromEditorHistoryAction = /** @class */ (function (_super) {
    __extends(RemoveFromEditorHistoryAction, _super);
    function RemoveFromEditorHistoryAction(id, label, quickInputService, modelService, modeService, instantiationService, historyService) {
        var _this = _super.call(this, id, label) || this;
        _this.quickInputService = quickInputService;
        _this.modelService = modelService;
        _this.modeService = modeService;
        _this.instantiationService = instantiationService;
        _this.historyService = historyService;
        return _this;
    }
    RemoveFromEditorHistoryAction.prototype.run = function () {
        var _this = this;
        var history = this.historyService.getHistory();
        var picks = history.map(function (h) {
            var entry = _this.instantiationService.createInstance(EditorHistoryEntry, h);
            return {
                input: h,
                iconClasses: getIconClasses(_this.modelService, _this.modeService, entry.getResource()),
                label: entry.getLabel(),
                description: entry.getDescription()
            };
        });
        return this.quickInputService.pick(picks, { placeHolder: nls.localize('pickHistory', "Select an editor entry to remove from history"), matchOnDescription: true }).then(function (pick) {
            if (pick) {
                _this.historyService.remove(pick.input);
            }
        });
    };
    RemoveFromEditorHistoryAction.ID = 'workbench.action.removeFromEditorHistory';
    RemoveFromEditorHistoryAction.LABEL = nls.localize('removeFromEditorHistory', "Remove From History");
    RemoveFromEditorHistoryAction = __decorate([
        __param(2, IQuickInputService),
        __param(3, IModelService),
        __param(4, IModeService),
        __param(5, IInstantiationService),
        __param(6, IHistoryService)
    ], RemoveFromEditorHistoryAction);
    return RemoveFromEditorHistoryAction;
}(Action));
export { RemoveFromEditorHistoryAction };
