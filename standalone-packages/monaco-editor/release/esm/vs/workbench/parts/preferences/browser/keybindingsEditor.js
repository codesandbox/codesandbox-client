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
import './media/keybindingsEditor.css';
import { localize } from '../../../../nls.js';
import { TPromise } from '../../../../base/common/winjs.base.js';
import { Delayer } from '../../../../base/common/async.js';
import * as DOM from '../../../../base/browser/dom.js';
import { OS } from '../../../../base/common/platform.js';
import { dispose } from '../../../../base/common/lifecycle.js';
import { CheckboxActionItem } from '../../../../base/browser/ui/checkbox/checkbox.js';
import { HighlightedLabel } from '../../../../base/browser/ui/highlightedlabel/highlightedLabel.js';
import { KeybindingLabel } from '../../../../base/browser/ui/keybindingLabel/keybindingLabel.js';
import { Action } from '../../../../base/common/actions.js';
import { ActionBar, Separator } from '../../../../base/browser/ui/actionbar/actionbar.js';
import { BaseEditor } from '../../../browser/parts/editor/baseEditor.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IClipboardService } from '../../../../platform/clipboard/common/clipboardService.js';
import { KEYBINDING_ENTRY_TEMPLATE_ID, KEYBINDING_HEADER_TEMPLATE_ID } from '../../../services/preferences/common/keybindingsEditorModel.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { DefineKeybindingWidget, KeybindingsSearchWidget } from './keybindingWidgets.js';
import { CONTEXT_KEYBINDING_FOCUS, CONTEXT_KEYBINDINGS_EDITOR, CONTEXT_KEYBINDINGS_SEARCH_FOCUS, KEYBINDINGS_EDITOR_COMMAND_REMOVE, KEYBINDINGS_EDITOR_COMMAND_COPY, KEYBINDINGS_EDITOR_COMMAND_RESET, KEYBINDINGS_EDITOR_COMMAND_COPY_COMMAND, KEYBINDINGS_EDITOR_COMMAND_DEFINE, KEYBINDINGS_EDITOR_COMMAND_SHOW_SIMILAR, KEYBINDINGS_EDITOR_COMMAND_RECORD_SEARCH_KEYS, KEYBINDINGS_EDITOR_COMMAND_SORTBY_PRECEDENCE, CONTEXT_KEYBINDINGS_SEARCH_VALUE } from '../common/preferences.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { IKeybindingEditingService } from '../../../services/keybinding/common/keybindingEditing.js';
import { IThemeService, registerThemingParticipant } from '../../../../platform/theme/common/themeService.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { StandardKeyboardEvent } from '../../../../base/browser/keyboardEvent.js';
import { listHighlightForeground, badgeBackground, contrastBorder, badgeForeground } from '../../../../platform/theme/common/colorRegistry.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { EditorExtensionsRegistry } from '../../../../editor/browser/editorExtensions.js';
import { WorkbenchList } from '../../../../platform/list/browser/listService.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { attachStylerCallback } from '../../../../platform/theme/common/styler.js';
var $ = DOM.$;
var KeybindingsEditor = /** @class */ (function (_super) {
    __extends(KeybindingsEditor, _super);
    function KeybindingsEditor(telemetryService, themeService, keybindingsService, contextMenuService, keybindingEditingService, contextKeyService, notificationService, clipboardService, instantiationService, editorService) {
        var _this = _super.call(this, KeybindingsEditor.ID, telemetryService, themeService) || this;
        _this.keybindingsService = keybindingsService;
        _this.contextMenuService = contextMenuService;
        _this.keybindingEditingService = keybindingEditingService;
        _this.contextKeyService = contextKeyService;
        _this.notificationService = notificationService;
        _this.clipboardService = clipboardService;
        _this.instantiationService = instantiationService;
        _this.editorService = editorService;
        _this.latestEmptyFilters = [];
        _this.delayedFiltering = new Delayer(300);
        _this._register(keybindingsService.onDidUpdateKeybindings(function () { return _this.render(false, CancellationToken.None); }));
        _this.keybindingsEditorContextKey = CONTEXT_KEYBINDINGS_EDITOR.bindTo(_this.contextKeyService);
        _this.searchFocusContextKey = CONTEXT_KEYBINDINGS_SEARCH_FOCUS.bindTo(_this.contextKeyService);
        _this.searchValueContextKey = CONTEXT_KEYBINDINGS_SEARCH_VALUE.bindTo(_this.contextKeyService);
        _this.keybindingFocusContextKey = CONTEXT_KEYBINDING_FOCUS.bindTo(_this.contextKeyService);
        _this.delayedFilterLogging = new Delayer(1000);
        return _this;
    }
    KeybindingsEditor.prototype.createEditor = function (parent) {
        var _this = this;
        var keybindingsEditorElement = DOM.append(parent, $('div', { class: 'keybindings-editor' }));
        this.createAriaLabelElement(keybindingsEditorElement);
        this.createOverlayContainer(keybindingsEditorElement);
        this.createHeader(keybindingsEditorElement);
        this.createBody(keybindingsEditorElement);
        var focusTracker = this._register(DOM.trackFocus(parent));
        this._register(focusTracker.onDidFocus(function () { return _this.keybindingsEditorContextKey.set(true); }));
        this._register(focusTracker.onDidBlur(function () { return _this.keybindingsEditorContextKey.reset(); }));
    };
    KeybindingsEditor.prototype.setInput = function (input, options, token) {
        var _this = this;
        return _super.prototype.setInput.call(this, input, options, token)
            .then(function () { return _this.render(options && options.preserveFocus, token); });
    };
    KeybindingsEditor.prototype.clearInput = function () {
        _super.prototype.clearInput.call(this);
        this.keybindingsEditorContextKey.reset();
        this.keybindingFocusContextKey.reset();
    };
    KeybindingsEditor.prototype.layout = function (dimension) {
        this.dimension = dimension;
        this.layoutSearchWidget(dimension);
        this.overlayContainer.style.width = dimension.width + 'px';
        this.overlayContainer.style.height = dimension.height + 'px';
        this.defineKeybindingWidget.layout(this.dimension);
        this.layoutKebindingsList();
    };
    KeybindingsEditor.prototype.focus = function () {
        var activeKeybindingEntry = this.activeKeybindingEntry;
        if (activeKeybindingEntry) {
            this.selectEntry(activeKeybindingEntry);
        }
        else {
            this.searchWidget.focus();
        }
    };
    Object.defineProperty(KeybindingsEditor.prototype, "activeKeybindingEntry", {
        get: function () {
            var focusedElement = this.keybindingsList.getFocusedElements()[0];
            return focusedElement && focusedElement.templateId === KEYBINDING_ENTRY_TEMPLATE_ID ? focusedElement : null;
        },
        enumerable: true,
        configurable: true
    });
    KeybindingsEditor.prototype.defineKeybinding = function (keybindingEntry) {
        var _this = this;
        this.selectEntry(keybindingEntry);
        this.showOverlayContainer();
        return this.defineKeybindingWidget.define().then(function (key) {
            if (key) {
                var currentKey = keybindingEntry.keybindingItem.keybinding ? keybindingEntry.keybindingItem.keybinding.getUserSettingsLabel() : '';
                if (currentKey !== key) {
                    _this.reportKeybindingAction(KEYBINDINGS_EDITOR_COMMAND_DEFINE, keybindingEntry.keybindingItem.command, key);
                    return _this.keybindingEditingService.editKeybinding(key, keybindingEntry.keybindingItem.keybindingItem)
                        .then(function () {
                        if (!keybindingEntry.keybindingItem.keybinding) { // reveal only if keybinding was added to unassinged. Because the entry will be placed in different position after rendering
                            _this.unAssignedKeybindingItemToRevealAndFocus = keybindingEntry;
                        }
                    });
                }
            }
            return null;
        }).then(function () {
            _this.hideOverlayContainer();
            _this.selectEntry(keybindingEntry);
        }, function (error) {
            _this.hideOverlayContainer();
            _this.onKeybindingEditingError(error);
            _this.selectEntry(keybindingEntry);
            return error;
        });
    };
    KeybindingsEditor.prototype.removeKeybinding = function (keybindingEntry) {
        var _this = this;
        this.selectEntry(keybindingEntry);
        if (keybindingEntry.keybindingItem.keybinding) { // This should be a pre-condition
            this.reportKeybindingAction(KEYBINDINGS_EDITOR_COMMAND_REMOVE, keybindingEntry.keybindingItem.command, keybindingEntry.keybindingItem.keybinding);
            return this.keybindingEditingService.removeKeybinding(keybindingEntry.keybindingItem.keybindingItem)
                .then(function () { return _this.focus(); }, function (error) {
                _this.onKeybindingEditingError(error);
                _this.selectEntry(keybindingEntry);
            });
        }
        return TPromise.as(null);
    };
    KeybindingsEditor.prototype.resetKeybinding = function (keybindingEntry) {
        var _this = this;
        this.selectEntry(keybindingEntry);
        this.reportKeybindingAction(KEYBINDINGS_EDITOR_COMMAND_RESET, keybindingEntry.keybindingItem.command, keybindingEntry.keybindingItem.keybinding);
        return this.keybindingEditingService.resetKeybinding(keybindingEntry.keybindingItem.keybindingItem)
            .then(function () {
            if (!keybindingEntry.keybindingItem.keybinding) { // reveal only if keybinding was added to unassinged. Because the entry will be placed in different position after rendering
                _this.unAssignedKeybindingItemToRevealAndFocus = keybindingEntry;
            }
            _this.selectEntry(keybindingEntry);
        }, function (error) {
            _this.onKeybindingEditingError(error);
            _this.selectEntry(keybindingEntry);
        });
    };
    KeybindingsEditor.prototype.copyKeybinding = function (keybinding) {
        this.selectEntry(keybinding);
        this.reportKeybindingAction(KEYBINDINGS_EDITOR_COMMAND_COPY, keybinding.keybindingItem.command, keybinding.keybindingItem.keybinding);
        var userFriendlyKeybinding = {
            key: keybinding.keybindingItem.keybinding ? keybinding.keybindingItem.keybinding.getUserSettingsLabel() : '',
            command: keybinding.keybindingItem.command
        };
        if (keybinding.keybindingItem.when) {
            userFriendlyKeybinding.when = keybinding.keybindingItem.when;
        }
        this.clipboardService.writeText(JSON.stringify(userFriendlyKeybinding, null, '  '));
        return TPromise.as(null);
    };
    KeybindingsEditor.prototype.copyKeybindingCommand = function (keybinding) {
        this.selectEntry(keybinding);
        this.reportKeybindingAction(KEYBINDINGS_EDITOR_COMMAND_COPY_COMMAND, keybinding.keybindingItem.command, keybinding.keybindingItem.keybinding);
        this.clipboardService.writeText(keybinding.keybindingItem.command);
        return TPromise.as(null);
    };
    KeybindingsEditor.prototype.focusSearch = function () {
        this.searchWidget.focus();
    };
    KeybindingsEditor.prototype.search = function (filter) {
        this.focusSearch();
        this.searchWidget.setValue(filter);
    };
    KeybindingsEditor.prototype.clearSearchResults = function () {
        this.searchWidget.clear();
    };
    KeybindingsEditor.prototype.showSimilarKeybindings = function (keybindingEntry) {
        var value = "\"" + keybindingEntry.keybindingItem.keybinding.getAriaLabel() + "\"";
        if (value !== this.searchWidget.getValue()) {
            this.searchWidget.setValue(value);
        }
        return TPromise.as(null);
    };
    KeybindingsEditor.prototype.createAriaLabelElement = function (parent) {
        this.ariaLabelElement = DOM.append(parent, DOM.$(''));
        this.ariaLabelElement.setAttribute('id', 'keybindings-editor-aria-label-element');
        this.ariaLabelElement.setAttribute('aria-live', 'assertive');
    };
    KeybindingsEditor.prototype.createOverlayContainer = function (parent) {
        var _this = this;
        this.overlayContainer = DOM.append(parent, $('.overlay-container'));
        this.overlayContainer.style.position = 'absolute';
        this.overlayContainer.style.zIndex = '10';
        this.defineKeybindingWidget = this._register(this.instantiationService.createInstance(DefineKeybindingWidget, this.overlayContainer));
        this._register(this.defineKeybindingWidget.onDidChange(function (keybindingStr) { return _this.defineKeybindingWidget.printExisting(_this.keybindingsEditorModel.fetch("\"" + keybindingStr + "\"").length); }));
        this._register(this.defineKeybindingWidget.onShowExistingKeybidings(function (keybindingStr) { return _this.searchWidget.setValue("\"" + keybindingStr + "\""); }));
        this.hideOverlayContainer();
    };
    KeybindingsEditor.prototype.showOverlayContainer = function () {
        this.overlayContainer.style.display = 'block';
    };
    KeybindingsEditor.prototype.hideOverlayContainer = function () {
        this.overlayContainer.style.display = 'none';
    };
    KeybindingsEditor.prototype.createHeader = function (parent) {
        var _this = this;
        this.headerContainer = DOM.append(parent, $('.keybindings-header'));
        var fullTextSearchPlaceholder = localize('SearchKeybindings.FullTextSearchPlaceholder', "Type to search in keybindings");
        var keybindingsSearchPlaceholder = localize('SearchKeybindings.KeybindingsSearchPlaceholder', "Recording Keys. Press Escape to exit");
        var searchContainer = DOM.append(this.headerContainer, $('.search-container'));
        this.searchWidget = this._register(this.instantiationService.createInstance(KeybindingsSearchWidget, searchContainer, {
            ariaLabel: fullTextSearchPlaceholder,
            placeholder: fullTextSearchPlaceholder,
            focusKey: this.searchFocusContextKey,
            ariaLabelledBy: 'keybindings-editor-aria-label-element',
            recordEnter: true
        }));
        this._register(this.searchWidget.onDidChange(function (searchValue) {
            _this.searchValueContextKey.set(!!searchValue);
            _this.delayedFiltering.trigger(function () { return _this.filterKeybindings(); });
        }));
        this._register(this.searchWidget.onEscape(function () { return _this.recordKeysAction.checked = false; }));
        var actionsContainer = DOM.append(searchContainer, DOM.$('.keybindings-search-actions-container'));
        var recordingBadge = this.createRecordingBadge(actionsContainer);
        var sortByPrecedenceActionKeybinding = this.keybindingsService.lookupKeybinding(KEYBINDINGS_EDITOR_COMMAND_SORTBY_PRECEDENCE);
        var sortByPrecedenceActionLabel = localize('sortByPrecedeneLabel', "Sort by Precedence");
        this.sortByPrecedenceAction = new Action('keybindings.editor.sortByPrecedence', sortByPrecedenceActionKeybinding ? localize('sortByPrecedeneLabelWithKeybinding', "{0} ({1})", sortByPrecedenceActionLabel, sortByPrecedenceActionKeybinding.getLabel()) : sortByPrecedenceActionLabel, 'sort-by-precedence');
        this.sortByPrecedenceAction.checked = false;
        this._register(this.sortByPrecedenceAction.onDidChange(function (e) {
            if (e.checked !== void 0) {
                _this.renderKeybindingsEntries(false);
            }
        }));
        var recordKeysActionKeybinding = this.keybindingsService.lookupKeybinding(KEYBINDINGS_EDITOR_COMMAND_RECORD_SEARCH_KEYS);
        var recordKeysActionLabel = localize('recordKeysLabel', "Record Keys");
        this.recordKeysAction = new Action(KEYBINDINGS_EDITOR_COMMAND_RECORD_SEARCH_KEYS, recordKeysActionKeybinding ? localize('recordKeysLabelWithKeybinding', "{0} ({1})", recordKeysActionLabel, recordKeysActionKeybinding.getLabel()) : recordKeysActionLabel, 'octicon octicon-keyboard');
        this.recordKeysAction.checked = false;
        this._register(this.recordKeysAction.onDidChange(function (e) {
            if (e.checked !== void 0) {
                DOM.toggleClass(recordingBadge, 'disabled', !e.checked);
                if (e.checked) {
                    _this.searchWidget.inputBox.setPlaceHolder(keybindingsSearchPlaceholder);
                    _this.searchWidget.inputBox.setAriaLabel(keybindingsSearchPlaceholder);
                    _this.searchWidget.startRecordingKeys();
                    _this.searchWidget.focus();
                }
                else {
                    _this.searchWidget.inputBox.setPlaceHolder(fullTextSearchPlaceholder);
                    _this.searchWidget.inputBox.setAriaLabel(fullTextSearchPlaceholder);
                    _this.searchWidget.stopRecordingKeys();
                    _this.searchWidget.focus();
                }
            }
        }));
        this.actionBar = this._register(new ActionBar(actionsContainer, {
            animated: false,
            actionItemProvider: function (action) {
                if (action.id === _this.sortByPrecedenceAction.id) {
                    return new CheckboxActionItem(null, action);
                }
                if (action.id === _this.recordKeysAction.id) {
                    return new CheckboxActionItem(null, action);
                }
                return null;
            }
        }));
        this.actionBar.push([this.recordKeysAction, this.sortByPrecedenceAction]);
    };
    KeybindingsEditor.prototype.createRecordingBadge = function (container) {
        var recordingBadge = DOM.append(container, DOM.$('.recording-badge.disabled'));
        recordingBadge.textContent = localize('recording', "Recording Keys");
        this._register(attachStylerCallback(this.themeService, { badgeBackground: badgeBackground, contrastBorder: contrastBorder, badgeForeground: badgeForeground }, function (colors) {
            var background = colors.badgeBackground ? colors.badgeBackground.toString() : null;
            var border = colors.contrastBorder ? colors.contrastBorder.toString() : null;
            var color = colors.badgeForeground ? colors.badgeForeground.toString() : null;
            recordingBadge.style.backgroundColor = background;
            recordingBadge.style.borderWidth = border ? '1px' : null;
            recordingBadge.style.borderStyle = border ? 'solid' : null;
            recordingBadge.style.borderColor = border;
            recordingBadge.style.color = color ? color.toString() : null;
        }));
        return recordingBadge;
    };
    KeybindingsEditor.prototype.layoutSearchWidget = function (dimension) {
        this.searchWidget.layout(dimension);
        DOM.toggleClass(this.headerContainer, 'small', dimension.width < 400);
        this.searchWidget.inputBox.inputElement.style.paddingRight = '60px';
        if (dimension.width > 400 && this.recordKeysAction.checked) {
            this.searchWidget.inputBox.inputElement.style.paddingRight = '180px';
        }
    };
    KeybindingsEditor.prototype.createBody = function (parent) {
        var bodyContainer = DOM.append(parent, $('.keybindings-body'));
        this.createList(bodyContainer);
    };
    KeybindingsEditor.prototype.createList = function (parent) {
        var _this = this;
        this.keybindingsListContainer = DOM.append(parent, $('.keybindings-list-container'));
        this.keybindingsList = this._register(this.instantiationService.createInstance(WorkbenchList, this.keybindingsListContainer, new Delegate(), [new KeybindingHeaderRenderer(), new KeybindingItemRenderer(this, this.keybindingsService)], { identityProvider: function (e) { return e.id; }, mouseSupport: true, ariaLabel: localize('keybindingsLabel', "Keybindings") }));
        this._register(this.keybindingsList.onContextMenu(function (e) { return _this.onContextMenu(e); }));
        this._register(this.keybindingsList.onFocusChange(function (e) { return _this.onFocusChange(e); }));
        this._register(this.keybindingsList.onDidFocus(function () {
            DOM.addClass(_this.keybindingsList.getHTMLElement(), 'focused');
        }));
        this._register(this.keybindingsList.onDidBlur(function () {
            DOM.removeClass(_this.keybindingsList.getHTMLElement(), 'focused');
            _this.keybindingFocusContextKey.reset();
        }));
        this._register(this.keybindingsList.onMouseDblClick(function () { return _this.defineKeybinding(_this.activeKeybindingEntry); }));
        this._register(this.keybindingsList.onKeyDown(function (e) {
            var event = new StandardKeyboardEvent(e);
            if (event.keyCode === 3 /* Enter */) {
                var keybindingEntry = _this.activeKeybindingEntry;
                if (keybindingEntry) {
                    _this.defineKeybinding(_this.activeKeybindingEntry);
                }
                e.stopPropagation();
            }
        }));
    };
    KeybindingsEditor.prototype.render = function (preserveFocus, token) {
        var _this = this;
        if (this.input) {
            return this.input.resolve()
                .then(function (keybindingsModel) {
                if (token.isCancellationRequested) {
                    return void 0;
                }
                _this.keybindingsEditorModel = keybindingsModel;
                var editorActionsLabels = EditorExtensionsRegistry.getEditorActions().reduce(function (editorActions, editorAction) {
                    editorActions[editorAction.id] = editorAction.label;
                    return editorActions;
                }, {});
                return _this.keybindingsEditorModel.resolve(editorActionsLabels);
            })
                .then(function () {
                if (token.isCancellationRequested) {
                    return void 0;
                }
                _this.renderKeybindingsEntries(false, preserveFocus);
            });
        }
        return TPromise.as(null);
    };
    KeybindingsEditor.prototype.filterKeybindings = function () {
        var _this = this;
        this.renderKeybindingsEntries(this.searchWidget.hasFocus());
        this.delayedFilterLogging.trigger(function () { return _this.reportFilteringUsed(_this.searchWidget.getValue()); });
    };
    KeybindingsEditor.prototype.renderKeybindingsEntries = function (reset, preserveFocus) {
        if (this.keybindingsEditorModel) {
            var filter = this.searchWidget.getValue();
            var keybindingsEntries = this.keybindingsEditorModel.fetch(filter, this.sortByPrecedenceAction.checked);
            this.ariaLabelElement.setAttribute('aria-label', this.getAriaLabel(keybindingsEntries));
            if (keybindingsEntries.length === 0) {
                this.latestEmptyFilters.push(filter);
            }
            var currentSelectedIndex = this.keybindingsList.getSelection()[0];
            this.listEntries = [{ id: 'keybinding-header-entry', templateId: KEYBINDING_HEADER_TEMPLATE_ID }].concat(keybindingsEntries);
            this.keybindingsList.splice(0, this.keybindingsList.length, this.listEntries);
            this.layoutKebindingsList();
            if (reset) {
                this.keybindingsList.setSelection([]);
                this.keybindingsList.setFocus([]);
            }
            else {
                if (this.unAssignedKeybindingItemToRevealAndFocus) {
                    var index = this.getNewIndexOfUnassignedKeybinding(this.unAssignedKeybindingItemToRevealAndFocus);
                    if (index !== -1) {
                        this.keybindingsList.reveal(index, 0.2);
                        this.selectEntry(index);
                    }
                    this.unAssignedKeybindingItemToRevealAndFocus = null;
                }
                else if (currentSelectedIndex !== -1 && currentSelectedIndex < this.listEntries.length) {
                    this.selectEntry(currentSelectedIndex);
                }
                else if (this.editorService.activeControl === this && !preserveFocus) {
                    this.focus();
                }
            }
        }
    };
    KeybindingsEditor.prototype.getAriaLabel = function (keybindingsEntries) {
        if (this.sortByPrecedenceAction.checked) {
            return localize('show sorted keybindings', "Showing {0} Keybindings in precedence order", keybindingsEntries.length);
        }
        else {
            return localize('show keybindings', "Showing {0} Keybindings in alphabetical order", keybindingsEntries.length);
        }
    };
    KeybindingsEditor.prototype.layoutKebindingsList = function () {
        var listHeight = this.dimension.height - (DOM.getDomNodePagePosition(this.headerContainer).height + 12 /*padding*/);
        this.keybindingsListContainer.style.height = listHeight + "px";
        this.keybindingsList.layout(listHeight);
    };
    KeybindingsEditor.prototype.getIndexOf = function (listEntry) {
        var index = this.listEntries.indexOf(listEntry);
        if (index === -1) {
            for (var i = 0; i < this.listEntries.length; i++) {
                if (this.listEntries[i].id === listEntry.id) {
                    return i;
                }
            }
        }
        return index;
    };
    KeybindingsEditor.prototype.getNewIndexOfUnassignedKeybinding = function (unassignedKeybinding) {
        for (var index = 0; index < this.listEntries.length; index++) {
            var entry = this.listEntries[index];
            if (entry.templateId === KEYBINDING_ENTRY_TEMPLATE_ID) {
                var keybindingItemEntry = entry;
                if (keybindingItemEntry.keybindingItem.command === unassignedKeybinding.keybindingItem.command) {
                    return index;
                }
            }
        }
        return -1;
    };
    KeybindingsEditor.prototype.selectEntry = function (keybindingItemEntry) {
        var index = typeof keybindingItemEntry === 'number' ? keybindingItemEntry : this.getIndexOf(keybindingItemEntry);
        if (index !== -1) {
            this.keybindingsList.getHTMLElement().focus();
            this.keybindingsList.setFocus([index]);
            this.keybindingsList.setSelection([index]);
        }
    };
    KeybindingsEditor.prototype.focusKeybindings = function () {
        this.keybindingsList.getHTMLElement().focus();
        var currentFocusIndices = this.keybindingsList.getFocus();
        this.keybindingsList.setFocus([currentFocusIndices.length ? currentFocusIndices[0] : 0]);
    };
    KeybindingsEditor.prototype.recordSearchKeys = function () {
        this.recordKeysAction.checked = true;
    };
    KeybindingsEditor.prototype.toggleSortByPrecedence = function () {
        this.sortByPrecedenceAction.checked = !this.sortByPrecedenceAction.checked;
    };
    KeybindingsEditor.prototype.onContextMenu = function (e) {
        var _this = this;
        if (e.element.templateId === KEYBINDING_ENTRY_TEMPLATE_ID) {
            this.selectEntry(e.element);
            this.contextMenuService.showContextMenu({
                getAnchor: function () { return e.anchor; },
                getActions: function () { return TPromise.as([
                    _this.createCopyAction(e.element),
                    _this.createCopyCommandAction(e.element),
                    new Separator(),
                    _this.createDefineAction(e.element),
                    _this.createRemoveAction(e.element),
                    _this.createResetAction(e.element),
                    new Separator(),
                    _this.createShowConflictsAction(e.element)
                ]); }
            });
        }
    };
    KeybindingsEditor.prototype.onFocusChange = function (e) {
        this.keybindingFocusContextKey.reset();
        var element = e.elements[0];
        if (!element) {
            return;
        }
        if (element.templateId === KEYBINDING_HEADER_TEMPLATE_ID) {
            this.keybindingsList.focusNext();
            return;
        }
        if (element.templateId === KEYBINDING_ENTRY_TEMPLATE_ID) {
            this.keybindingFocusContextKey.set(true);
        }
    };
    KeybindingsEditor.prototype.createDefineAction = function (keybindingItemEntry) {
        var _this = this;
        return {
            label: keybindingItemEntry.keybindingItem.keybinding ? localize('changeLabel', "Change Keybinding") : localize('addLabel', "Add Keybinding"),
            enabled: true,
            id: KEYBINDINGS_EDITOR_COMMAND_DEFINE,
            run: function () { return _this.defineKeybinding(keybindingItemEntry); }
        };
    };
    KeybindingsEditor.prototype.createRemoveAction = function (keybindingItem) {
        var _this = this;
        return {
            label: localize('removeLabel', "Remove Keybinding"),
            enabled: !!keybindingItem.keybindingItem.keybinding,
            id: KEYBINDINGS_EDITOR_COMMAND_REMOVE,
            run: function () { return _this.removeKeybinding(keybindingItem); }
        };
    };
    KeybindingsEditor.prototype.createResetAction = function (keybindingItem) {
        var _this = this;
        return {
            label: localize('resetLabel', "Reset Keybinding"),
            enabled: !keybindingItem.keybindingItem.keybindingItem.isDefault,
            id: KEYBINDINGS_EDITOR_COMMAND_RESET,
            run: function () { return _this.resetKeybinding(keybindingItem); }
        };
    };
    KeybindingsEditor.prototype.createShowConflictsAction = function (keybindingItem) {
        var _this = this;
        return {
            label: localize('showSameKeybindings', "Show Same Keybindings"),
            enabled: !!keybindingItem.keybindingItem.keybinding,
            id: KEYBINDINGS_EDITOR_COMMAND_SHOW_SIMILAR,
            run: function () { return _this.showSimilarKeybindings(keybindingItem); }
        };
    };
    KeybindingsEditor.prototype.createCopyAction = function (keybindingItem) {
        var _this = this;
        return {
            label: localize('copyLabel', "Copy"),
            enabled: true,
            id: KEYBINDINGS_EDITOR_COMMAND_COPY,
            run: function () { return _this.copyKeybinding(keybindingItem); }
        };
    };
    KeybindingsEditor.prototype.createCopyCommandAction = function (keybinding) {
        var _this = this;
        return {
            label: localize('copyCommandLabel', "Copy Command"),
            enabled: true,
            id: KEYBINDINGS_EDITOR_COMMAND_COPY_COMMAND,
            run: function () { return _this.copyKeybindingCommand(keybinding); }
        };
    };
    KeybindingsEditor.prototype.reportFilteringUsed = function (filter) {
        if (filter) {
            var data = {
                filter: filter,
                emptyFilters: this.getLatestEmptyFiltersForTelemetry()
            };
            this.latestEmptyFilters = [];
            /* __GDPR__
                "keybindings.filter" : {
                    "filter": { "classification": "CustomerContent", "purpose": "FeatureInsight" },
                    "emptyFilters" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
                }
            */
            this.telemetryService.publicLog('keybindings.filter', data);
        }
    };
    /**
     * Put a rough limit on the size of the telemetry data, since otherwise it could be an unbounded large amount
     * of data. 8192 is the max size of a property value. This is rough since that probably includes ""s, etc.
     */
    KeybindingsEditor.prototype.getLatestEmptyFiltersForTelemetry = function () {
        var cumulativeSize = 0;
        return this.latestEmptyFilters.filter(function (filterText) { return (cumulativeSize += filterText.length) <= 8192; });
    };
    KeybindingsEditor.prototype.reportKeybindingAction = function (action, command, keybinding) {
        // __GDPR__TODO__ Need to move off dynamic event names and properties as they cannot be registered statically
        this.telemetryService.publicLog(action, { command: command, keybinding: keybinding ? (typeof keybinding === 'string' ? keybinding : keybinding.getUserSettingsLabel()) : '' });
    };
    KeybindingsEditor.prototype.onKeybindingEditingError = function (error) {
        this.notificationService.error(typeof error === 'string' ? error : localize('error', "Error '{0}' while editing the keybinding. Please open 'keybindings.json' file and check for errors.", "" + error));
    };
    KeybindingsEditor.ID = 'workbench.editor.keybindings';
    KeybindingsEditor = __decorate([
        __param(0, ITelemetryService),
        __param(1, IThemeService),
        __param(2, IKeybindingService),
        __param(3, IContextMenuService),
        __param(4, IKeybindingEditingService),
        __param(5, IContextKeyService),
        __param(6, INotificationService),
        __param(7, IClipboardService),
        __param(8, IInstantiationService),
        __param(9, IEditorService)
    ], KeybindingsEditor);
    return KeybindingsEditor;
}(BaseEditor));
export { KeybindingsEditor };
var Delegate = /** @class */ (function () {
    function Delegate() {
    }
    Delegate.prototype.getHeight = function (element) {
        if (element.templateId === KEYBINDING_ENTRY_TEMPLATE_ID) {
            var commandIdMatched = element.keybindingItem.commandLabel && element.commandIdMatches;
            var commandDefaultLabelMatched = !!element.commandDefaultLabelMatches;
            if (commandIdMatched && commandDefaultLabelMatched) {
                return 60;
            }
            if (commandIdMatched || commandDefaultLabelMatched) {
                return 40;
            }
        }
        if (element.templateId === KEYBINDING_HEADER_TEMPLATE_ID) {
            return 30;
        }
        return 24;
    };
    Delegate.prototype.getTemplateId = function (element) {
        return element.templateId;
    };
    return Delegate;
}());
var KeybindingHeaderRenderer = /** @class */ (function () {
    function KeybindingHeaderRenderer() {
    }
    Object.defineProperty(KeybindingHeaderRenderer.prototype, "templateId", {
        get: function () { return KEYBINDING_HEADER_TEMPLATE_ID; },
        enumerable: true,
        configurable: true
    });
    KeybindingHeaderRenderer.prototype.renderTemplate = function (container) {
        DOM.addClass(container, 'keybindings-list-header');
        DOM.append(container, $('.header.actions'), $('.header.command', null, localize('command', "Command")), $('.header.keybinding', null, localize('keybinding', "Keybinding")), $('.header.source', null, localize('source', "Source")), $('.header.when', null, localize('when', "When")));
        return {};
    };
    KeybindingHeaderRenderer.prototype.renderElement = function (entry, index, template) {
    };
    KeybindingHeaderRenderer.prototype.disposeElement = function () {
    };
    KeybindingHeaderRenderer.prototype.disposeTemplate = function (template) {
    };
    return KeybindingHeaderRenderer;
}());
var KeybindingItemRenderer = /** @class */ (function () {
    function KeybindingItemRenderer(keybindingsEditor, keybindingsService) {
        this.keybindingsEditor = keybindingsEditor;
        this.keybindingsService = keybindingsService;
    }
    Object.defineProperty(KeybindingItemRenderer.prototype, "templateId", {
        get: function () { return KEYBINDING_ENTRY_TEMPLATE_ID; },
        enumerable: true,
        configurable: true
    });
    KeybindingItemRenderer.prototype.renderTemplate = function (container) {
        DOM.addClass(container, 'keybinding-item');
        var actions = new ActionsColumn(container, this.keybindingsEditor, this.keybindingsService);
        var command = new CommandColumn(container, this.keybindingsEditor);
        var keybinding = new KeybindingColumn(container, this.keybindingsEditor);
        var source = new SourceColumn(container, this.keybindingsEditor);
        var when = new WhenColumn(container, this.keybindingsEditor);
        container.setAttribute('aria-labelledby', [command.id, keybinding.id, source.id, when.id].join(' '));
        return {
            parent: container,
            actions: actions,
            command: command,
            keybinding: keybinding,
            source: source,
            when: when
        };
    };
    KeybindingItemRenderer.prototype.renderElement = function (keybindingEntry, index, template) {
        DOM.toggleClass(template.parent, 'odd', index % 2 === 1);
        template.actions.render(keybindingEntry);
        template.command.render(keybindingEntry);
        template.keybinding.render(keybindingEntry);
        template.source.render(keybindingEntry);
        template.when.render(keybindingEntry);
    };
    KeybindingItemRenderer.prototype.disposeElement = function () { };
    KeybindingItemRenderer.prototype.disposeTemplate = function (template) {
        template.actions.dispose();
    };
    return KeybindingItemRenderer;
}());
var Column = /** @class */ (function () {
    function Column(parent, keybindingsEditor) {
        this.parent = parent;
        this.keybindingsEditor = keybindingsEditor;
        this.element = this.create(parent);
        this.id = this.element.getAttribute('id');
    }
    Column.COUNTER = 0;
    return Column;
}());
var ActionsColumn = /** @class */ (function (_super) {
    __extends(ActionsColumn, _super);
    function ActionsColumn(parent, keybindingsEditor, keybindingsService) {
        var _this = _super.call(this, parent, keybindingsEditor) || this;
        _this.keybindingsService = keybindingsService;
        return _this;
    }
    ActionsColumn.prototype.create = function (parent) {
        var actionsContainer = DOM.append(parent, $('.column.actions', { id: 'actions_' + ++Column.COUNTER }));
        this.actionBar = new ActionBar(actionsContainer, { animated: false });
        return actionsContainer;
    };
    ActionsColumn.prototype.render = function (keybindingItemEntry) {
        this.actionBar.clear();
        var actions = [];
        if (keybindingItemEntry.keybindingItem.keybinding) {
            actions.push(this.createEditAction(keybindingItemEntry));
        }
        else {
            actions.push(this.createAddAction(keybindingItemEntry));
        }
        this.actionBar.push(actions, { icon: true });
    };
    ActionsColumn.prototype.createEditAction = function (keybindingItemEntry) {
        var _this = this;
        var keybinding = this.keybindingsService.lookupKeybinding(KEYBINDINGS_EDITOR_COMMAND_DEFINE);
        return {
            class: 'edit',
            enabled: true,
            id: 'editKeybinding',
            tooltip: keybinding ? localize('editKeybindingLabelWithKey', "Change Keybinding {0}", "(" + keybinding.getLabel() + ")") : localize('editKeybindingLabel', "Change Keybinding"),
            run: function () { return _this.keybindingsEditor.defineKeybinding(keybindingItemEntry); }
        };
    };
    ActionsColumn.prototype.createAddAction = function (keybindingItemEntry) {
        var _this = this;
        var keybinding = this.keybindingsService.lookupKeybinding(KEYBINDINGS_EDITOR_COMMAND_DEFINE);
        return {
            class: 'add',
            enabled: true,
            id: 'addKeybinding',
            tooltip: keybinding ? localize('addKeybindingLabelWithKey', "Add Keybinding {0}", "(" + keybinding.getLabel() + ")") : localize('addKeybindingLabel', "Add Keybinding"),
            run: function () { return _this.keybindingsEditor.defineKeybinding(keybindingItemEntry); }
        };
    };
    ActionsColumn.prototype.dispose = function () {
        this.actionBar = dispose(this.actionBar);
    };
    return ActionsColumn;
}(Column));
var CommandColumn = /** @class */ (function (_super) {
    __extends(CommandColumn, _super);
    function CommandColumn() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CommandColumn.prototype.create = function (parent) {
        this.commandColumn = DOM.append(parent, $('.column.command', { id: 'command_' + ++Column.COUNTER }));
        return this.commandColumn;
    };
    CommandColumn.prototype.render = function (keybindingItemEntry) {
        DOM.clearNode(this.commandColumn);
        var keybindingItem = keybindingItemEntry.keybindingItem;
        var commandIdMatched = !!(keybindingItem.commandLabel && keybindingItemEntry.commandIdMatches);
        var commandDefaultLabelMatched = !!keybindingItemEntry.commandDefaultLabelMatches;
        DOM.toggleClass(this.commandColumn, 'vertical-align-column', commandIdMatched || commandDefaultLabelMatched);
        this.commandColumn.setAttribute('aria-label', this.getAriaLabel(keybindingItemEntry));
        var commandLabel;
        if (keybindingItem.commandLabel) {
            commandLabel = new HighlightedLabel(this.commandColumn);
            commandLabel.set(keybindingItem.commandLabel, keybindingItemEntry.commandLabelMatches);
        }
        if (keybindingItemEntry.commandDefaultLabelMatches) {
            commandLabel = new HighlightedLabel(DOM.append(this.commandColumn, $('.command-default-label')));
            commandLabel.set(keybindingItem.commandDefaultLabel, keybindingItemEntry.commandDefaultLabelMatches);
        }
        if (keybindingItemEntry.commandIdMatches || !keybindingItem.commandLabel) {
            commandLabel = new HighlightedLabel(DOM.append(this.commandColumn, $('.code')));
            commandLabel.set(keybindingItem.command, keybindingItemEntry.commandIdMatches);
        }
        if (commandLabel) {
            commandLabel.element.title = keybindingItem.commandLabel ? localize('title', "{0} ({1})", keybindingItem.commandLabel, keybindingItem.command) : keybindingItem.command;
        }
    };
    CommandColumn.prototype.getAriaLabel = function (keybindingItemEntry) {
        return localize('commandAriaLabel', "Command is {0}.", keybindingItemEntry.keybindingItem.commandLabel ? keybindingItemEntry.keybindingItem.commandLabel : keybindingItemEntry.keybindingItem.command);
    };
    return CommandColumn;
}(Column));
var KeybindingColumn = /** @class */ (function (_super) {
    __extends(KeybindingColumn, _super);
    function KeybindingColumn() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    KeybindingColumn.prototype.create = function (parent) {
        this.keybindingColumn = DOM.append(parent, $('.column.keybinding', { id: 'keybinding_' + ++Column.COUNTER }));
        return this.keybindingColumn;
    };
    KeybindingColumn.prototype.render = function (keybindingItemEntry) {
        DOM.clearNode(this.keybindingColumn);
        this.keybindingColumn.setAttribute('aria-label', this.getAriaLabel(keybindingItemEntry));
        if (keybindingItemEntry.keybindingItem.keybinding) {
            new KeybindingLabel(this.keybindingColumn, OS).set(keybindingItemEntry.keybindingItem.keybinding, keybindingItemEntry.keybindingMatches);
        }
    };
    KeybindingColumn.prototype.getAriaLabel = function (keybindingItemEntry) {
        return keybindingItemEntry.keybindingItem.keybinding ? localize('keybindingAriaLabel', "Keybinding is {0}.", keybindingItemEntry.keybindingItem.keybinding.getAriaLabel()) : localize('noKeybinding', "No Keybinding assigned.");
    };
    return KeybindingColumn;
}(Column));
var SourceColumn = /** @class */ (function (_super) {
    __extends(SourceColumn, _super);
    function SourceColumn() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SourceColumn.prototype.create = function (parent) {
        this.sourceColumn = DOM.append(parent, $('.column.source', { id: 'source_' + ++Column.COUNTER }));
        return this.sourceColumn;
    };
    SourceColumn.prototype.render = function (keybindingItemEntry) {
        DOM.clearNode(this.sourceColumn);
        this.sourceColumn.setAttribute('aria-label', this.getAriaLabel(keybindingItemEntry));
        new HighlightedLabel(this.sourceColumn).set(keybindingItemEntry.keybindingItem.source, keybindingItemEntry.sourceMatches);
    };
    SourceColumn.prototype.getAriaLabel = function (keybindingItemEntry) {
        return localize('sourceAriaLabel', "Source is {0}.", keybindingItemEntry.keybindingItem.source);
    };
    return SourceColumn;
}(Column));
var WhenColumn = /** @class */ (function (_super) {
    __extends(WhenColumn, _super);
    function WhenColumn() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WhenColumn.prototype.create = function (parent) {
        var column = DOM.append(parent, $('.column.when'));
        this.whenColumn = DOM.append(column, $('div', { id: 'when_' + ++Column.COUNTER }));
        return this.whenColumn;
    };
    WhenColumn.prototype.render = function (keybindingItemEntry) {
        DOM.clearNode(this.whenColumn);
        this.whenColumn.setAttribute('aria-label', this.getAriaLabel(keybindingItemEntry));
        DOM.toggleClass(this.whenColumn, 'code', !!keybindingItemEntry.keybindingItem.when);
        DOM.toggleClass(this.whenColumn, 'empty', !keybindingItemEntry.keybindingItem.when);
        if (keybindingItemEntry.keybindingItem.when) {
            var whenLabel = new HighlightedLabel(this.whenColumn);
            whenLabel.set(keybindingItemEntry.keybindingItem.when, keybindingItemEntry.whenMatches);
            this.whenColumn.title = keybindingItemEntry.keybindingItem.when;
            whenLabel.element.title = keybindingItemEntry.keybindingItem.when;
        }
        else {
            this.whenColumn.textContent = '—';
        }
    };
    WhenColumn.prototype.getAriaLabel = function (keybindingItemEntry) {
        return keybindingItemEntry.keybindingItem.when ? localize('whenAriaLabel', "When is {0}.", keybindingItemEntry.keybindingItem.when) : localize('noWhen', "No when context.");
    };
    return WhenColumn;
}(Column));
registerThemingParticipant(function (theme, collector) {
    var listHighlightForegroundColor = theme.getColor(listHighlightForeground);
    if (listHighlightForegroundColor) {
        collector.addRule(".keybindings-editor > .keybindings-body > .keybindings-list-container .monaco-list-row > .column .highlight { color: " + listHighlightForegroundColor + "; }");
    }
});
