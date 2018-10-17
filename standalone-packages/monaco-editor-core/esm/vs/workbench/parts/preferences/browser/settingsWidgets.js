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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import * as DOM from '../../../../base/browser/dom';
import { ActionBar } from '../../../../base/browser/ui/actionbar/actionbar';
import { Button } from '../../../../base/browser/ui/button/button';
import { InputBox } from '../../../../base/browser/ui/inputbox/inputBox';
import { Color, RGBA } from '../../../../base/common/color';
import { Emitter } from '../../../../base/common/event';
import { Disposable, dispose } from '../../../../base/common/lifecycle';
import './media/settingsWidgets.css';
import { localize } from '../../../../nls';
import { IContextViewService } from '../../../../platform/contextview/browser/contextView';
import { foreground, inputBackground, inputBorder, inputForeground, listActiveSelectionBackground, listActiveSelectionForeground, listHoverBackground, listHoverForeground, listInactiveSelectionBackground, listInactiveSelectionForeground, registerColor, selectBackground, selectBorder, selectForeground, textLinkForeground, textPreformatForeground, editorWidgetBorder } from '../../../../platform/theme/common/colorRegistry';
import { attachButtonStyler, attachInputBoxStyler } from '../../../../platform/theme/common/styler';
import { IThemeService, registerThemingParticipant } from '../../../../platform/theme/common/themeService';
var $ = DOM.$;
export var settingsHeaderForeground = registerColor('settings.headerForeground', { light: '#444444', dark: '#e7e7e7', hc: '#ffffff' }, localize('headerForeground', "(For settings editor preview) The foreground color for a section header or active title."));
export var modifiedItemIndicator = registerColor('settings.modifiedItemIndicator', {
    light: new Color(new RGBA(102, 175, 224)),
    dark: new Color(new RGBA(12, 125, 157)),
    hc: new Color(new RGBA(0, 73, 122))
}, localize('modifiedItemForeground', "(For settings editor preview) The color of the modified setting indicator."));
// Enum control colors
export var settingsSelectBackground = registerColor('settings.dropdownBackground', { dark: selectBackground, light: selectBackground, hc: selectBackground }, localize('settingsDropdownBackground', "(For settings editor preview) Settings editor dropdown background."));
export var settingsSelectForeground = registerColor('settings.dropdownForeground', { dark: selectForeground, light: selectForeground, hc: selectForeground }, localize('settingsDropdownForeground', "(For settings editor preview) Settings editor dropdown foreground."));
export var settingsSelectBorder = registerColor('settings.dropdownBorder', { dark: selectBorder, light: selectBorder, hc: selectBorder }, localize('settingsDropdownBorder', "(For settings editor preview) Settings editor dropdown border."));
export var settingsSelectListBorder = registerColor('settings.dropdownListBorder', { dark: editorWidgetBorder, light: editorWidgetBorder, hc: editorWidgetBorder }, localize('settingsDropdownListBorder', "(For settings editor preview) Settings editor dropdown list border. This surrounds the options and separates the options from the description."));
// Bool control colors
export var settingsCheckboxBackground = registerColor('settings.checkboxBackground', { dark: selectBackground, light: selectBackground, hc: selectBackground }, localize('settingsCheckboxBackground', "(For settings editor preview) Settings editor checkbox background."));
export var settingsCheckboxForeground = registerColor('settings.checkboxForeground', { dark: selectForeground, light: selectForeground, hc: selectForeground }, localize('settingsCheckboxForeground', "(For settings editor preview) Settings editor checkbox foreground."));
export var settingsCheckboxBorder = registerColor('settings.checkboxBorder', { dark: selectBorder, light: selectBorder, hc: selectBorder }, localize('settingsCheckboxBorder', "(For settings editor preview) Settings editor checkbox border."));
// Text control colors
export var settingsTextInputBackground = registerColor('settings.textInputBackground', { dark: inputBackground, light: inputBackground, hc: inputBackground }, localize('textInputBoxBackground', "(For settings editor preview) Settings editor text input box background."));
export var settingsTextInputForeground = registerColor('settings.textInputForeground', { dark: inputForeground, light: inputForeground, hc: inputForeground }, localize('textInputBoxForeground', "(For settings editor preview) Settings editor text input box foreground."));
export var settingsTextInputBorder = registerColor('settings.textInputBorder', { dark: inputBorder, light: inputBorder, hc: inputBorder }, localize('textInputBoxBorder', "(For settings editor preview) Settings editor text input box border."));
// Number control colors
export var settingsNumberInputBackground = registerColor('settings.numberInputBackground', { dark: inputBackground, light: inputBackground, hc: inputBackground }, localize('numberInputBoxBackground', "(For settings editor preview) Settings editor number input box background."));
export var settingsNumberInputForeground = registerColor('settings.numberInputForeground', { dark: inputForeground, light: inputForeground, hc: inputForeground }, localize('numberInputBoxForeground', "(For settings editor preview) Settings editor number input box foreground."));
export var settingsNumberInputBorder = registerColor('settings.numberInputBorder', { dark: inputBorder, light: inputBorder, hc: inputBorder }, localize('numberInputBoxBorder', "(For settings editor preview) Settings editor number input box border."));
registerThemingParticipant(function (theme, collector) {
    var checkboxBackgroundColor = theme.getColor(settingsCheckboxBackground);
    if (checkboxBackgroundColor) {
        collector.addRule(".settings-editor > .settings-body > .settings-tree-container .setting-item-bool .setting-value-checkbox { background-color: " + checkboxBackgroundColor + " !important; }");
    }
    var checkboxBorderColor = theme.getColor(settingsCheckboxBorder);
    if (checkboxBorderColor) {
        collector.addRule(".settings-editor > .settings-body > .settings-tree-container .setting-item-bool .setting-value-checkbox { border-color: " + checkboxBorderColor + " !important; }");
    }
    var link = theme.getColor(textLinkForeground);
    if (link) {
        collector.addRule(".settings-editor > .settings-body > .settings-tree-container .setting-item .setting-item-description-markdown a { color: " + link + "; }");
        collector.addRule(".settings-editor > .settings-body > .settings-tree-container .setting-item .setting-item-description-markdown a > code { color: " + link + "; }");
        collector.addRule(".monaco-select-box-dropdown-container > .select-box-details-pane > .select-box-description-markdown a { color: " + link + "; }");
        collector.addRule(".monaco-select-box-dropdown-container > .select-box-details-pane > .select-box-description-markdown a > code { color: " + link + "; }");
    }
    var headerForegroundColor = theme.getColor(settingsHeaderForeground);
    if (headerForegroundColor) {
        collector.addRule(".settings-editor > .settings-header > .settings-header-controls .settings-tabs-widget .action-label.checked { color: " + headerForegroundColor + "; border-bottom-color: " + headerForegroundColor + "; }");
    }
    var foregroundColor = theme.getColor(foreground);
    if (foregroundColor) {
        collector.addRule(".settings-editor > .settings-header > .settings-header-controls .settings-tabs-widget .action-label { color: " + foregroundColor + "; }");
    }
    // Exclude control
    var listHoverBackgroundColor = theme.getColor(listHoverBackground);
    if (listHoverBackgroundColor) {
        collector.addRule(".settings-editor > .settings-body > .settings-tree-container .setting-item.setting-item-exclude .setting-exclude-row:hover { background-color: " + listHoverBackgroundColor + "; }");
    }
    var listHoverForegroundColor = theme.getColor(listHoverForeground);
    if (listHoverForegroundColor) {
        collector.addRule(".settings-editor > .settings-body > .settings-tree-container .setting-item.setting-item-exclude .setting-exclude-row:hover { color: " + listHoverForegroundColor + "; }");
    }
    var listSelectBackgroundColor = theme.getColor(listActiveSelectionBackground);
    if (listSelectBackgroundColor) {
        collector.addRule(".settings-editor > .settings-body > .settings-tree-container .setting-item.setting-item-exclude .setting-exclude-row.selected:focus { background-color: " + listSelectBackgroundColor + "; }");
    }
    var listInactiveSelectionBackgroundColor = theme.getColor(listInactiveSelectionBackground);
    if (listInactiveSelectionBackgroundColor) {
        collector.addRule(".settings-editor > .settings-body > .settings-tree-container .setting-item.setting-item-exclude .setting-exclude-row.selected:not(:focus) { background-color: " + listInactiveSelectionBackgroundColor + "; }");
    }
    var listInactiveSelectionForegroundColor = theme.getColor(listInactiveSelectionForeground);
    if (listInactiveSelectionForegroundColor) {
        collector.addRule(".settings-editor > .settings-body > .settings-tree-container .setting-item.setting-item-exclude .setting-exclude-row.selected:not(:focus) { color: " + listInactiveSelectionForegroundColor + "; }");
    }
    var listSelectForegroundColor = theme.getColor(listActiveSelectionForeground);
    if (listSelectForegroundColor) {
        collector.addRule(".settings-editor > .settings-body > .settings-tree-container .setting-item.setting-item-exclude .setting-exclude-row.selected:focus { color: " + listSelectForegroundColor + "; }");
    }
    var codeTextForegroundColor = theme.getColor(textPreformatForeground);
    if (codeTextForegroundColor) {
        collector.addRule(".settings-editor > .settings-body > .settings-tree-container .setting-item .setting-item-description-markdown code { color: " + codeTextForegroundColor + " }");
        collector.addRule(".monaco-select-box-dropdown-container > .select-box-details-pane > .select-box-description-markdown code { color: " + codeTextForegroundColor + " }");
    }
    var modifiedItemIndicatorColor = theme.getColor(modifiedItemIndicator);
    if (modifiedItemIndicatorColor) {
        collector.addRule(".settings-editor > .settings-body > .settings-tree-container .setting-item > .setting-item-modified-indicator { border-color: " + modifiedItemIndicatorColor + "; }");
    }
});
var ExcludeSettingListModel = /** @class */ (function () {
    function ExcludeSettingListModel() {
        this._dataItems = [];
    }
    Object.defineProperty(ExcludeSettingListModel.prototype, "items", {
        get: function () {
            var _this = this;
            var items = this._dataItems.map(function (item, i) {
                var editing = item.pattern === _this._editKey;
                return __assign({}, item, { editing: editing, selected: i === _this._selectedIdx || editing });
            });
            if (this._editKey === '') {
                items.push({
                    editing: true,
                    selected: true,
                    pattern: '',
                    sibling: ''
                });
            }
            return items;
        },
        enumerable: true,
        configurable: true
    });
    ExcludeSettingListModel.prototype.setEditKey = function (key) {
        this._editKey = key;
    };
    ExcludeSettingListModel.prototype.setValue = function (excludeData) {
        this._dataItems = excludeData;
    };
    ExcludeSettingListModel.prototype.select = function (idx) {
        this._selectedIdx = idx;
    };
    ExcludeSettingListModel.prototype.getSelected = function () {
        return this._selectedIdx;
    };
    ExcludeSettingListModel.prototype.selectNext = function () {
        if (typeof this._selectedIdx === 'number') {
            this._selectedIdx = Math.min(this._selectedIdx + 1, this._dataItems.length - 1);
        }
        else {
            this._selectedIdx = 0;
        }
    };
    ExcludeSettingListModel.prototype.selectPrevious = function () {
        if (typeof this._selectedIdx === 'number') {
            this._selectedIdx = Math.max(this._selectedIdx - 1, 0);
        }
        else {
            this._selectedIdx = 0;
        }
    };
    return ExcludeSettingListModel;
}());
export { ExcludeSettingListModel };
var ExcludeSettingWidget = /** @class */ (function (_super) {
    __extends(ExcludeSettingWidget, _super);
    function ExcludeSettingWidget(container, themeService, contextViewService) {
        var _this = _super.call(this) || this;
        _this.container = container;
        _this.themeService = themeService;
        _this.contextViewService = contextViewService;
        _this.listDisposables = [];
        _this.model = new ExcludeSettingListModel();
        _this._onDidChangeExclude = new Emitter();
        _this.onDidChangeExclude = _this._onDidChangeExclude.event;
        _this.listElement = DOM.append(container, $('.setting-exclude-widget'));
        _this.listElement.setAttribute('tabindex', '0');
        DOM.append(container, _this.renderAddButton());
        _this.renderList();
        _this._register(DOM.addDisposableListener(_this.listElement, DOM.EventType.CLICK, function (e) { return _this.onListClick(e); }));
        _this._register(DOM.addDisposableListener(_this.listElement, DOM.EventType.DBLCLICK, function (e) { return _this.onListDoubleClick(e); }));
        _this._register(DOM.addStandardDisposableListener(_this.listElement, 'keydown', function (e) {
            if (e.keyCode === 16 /* UpArrow */) {
                _this.model.selectPrevious();
                _this.renderList();
                e.preventDefault();
                e.stopPropagation();
            }
            else if (e.keyCode === 18 /* DownArrow */) {
                _this.model.selectNext();
                _this.renderList();
                e.preventDefault();
                e.stopPropagation();
            }
        }));
        return _this;
    }
    Object.defineProperty(ExcludeSettingWidget.prototype, "domNode", {
        get: function () {
            return this.listElement;
        },
        enumerable: true,
        configurable: true
    });
    ExcludeSettingWidget.prototype.setValue = function (excludeData) {
        this.model.setValue(excludeData);
        this.renderList();
    };
    ExcludeSettingWidget.prototype.onListClick = function (e) {
        var targetIdx = this.getClickedItemIndex(e);
        if (targetIdx < 0) {
            return;
        }
        if (this.model.getSelected() === targetIdx) {
            return;
        }
        this.model.select(targetIdx);
        this.renderList();
        e.preventDefault();
        e.stopPropagation();
    };
    ExcludeSettingWidget.prototype.onListDoubleClick = function (e) {
        var targetIdx = this.getClickedItemIndex(e);
        if (targetIdx < 0) {
            return;
        }
        var item = this.model.items[targetIdx];
        if (item) {
            this.editSetting(item.pattern);
            e.preventDefault();
            e.stopPropagation();
        }
    };
    ExcludeSettingWidget.prototype.getClickedItemIndex = function (e) {
        if (!e.target) {
            return -1;
        }
        var actionbar = DOM.findParentWithClass(e.target, 'monaco-action-bar');
        if (actionbar) {
            // Don't handle doubleclicks inside the action bar
            return -1;
        }
        var element = DOM.findParentWithClass(e.target, 'setting-exclude-row');
        if (!element) {
            return -1;
        }
        var targetIdxStr = element.getAttribute('data-index');
        if (!targetIdxStr) {
            return -1;
        }
        var targetIdx = parseInt(targetIdxStr);
        return targetIdx;
    };
    ExcludeSettingWidget.prototype.renderList = function () {
        var _this = this;
        var focused = DOM.isAncestor(document.activeElement, this.listElement);
        DOM.clearNode(this.listElement);
        this.listDisposables = dispose(this.listDisposables);
        var newMode = this.model.items.some(function (item) { return item.editing && !item.pattern; });
        DOM.toggleClass(this.container, 'setting-exclude-new-mode', newMode);
        this.model.items
            .map(function (item, i) { return _this.renderItem(item, i, focused); })
            .forEach(function (itemElement) { return _this.listElement.appendChild(itemElement); });
        var listHeight = 22 * this.model.items.length;
        this.listElement.style.height = listHeight + 'px';
    };
    ExcludeSettingWidget.prototype.createDeleteAction = function (key) {
        var _this = this;
        return {
            class: 'setting-excludeAction-remove',
            enabled: true,
            id: 'workbench.action.removeExcludeItem',
            tooltip: localize('removeExcludeItem', "Remove Exclude Item"),
            run: function () { return _this._onDidChangeExclude.fire({ originalPattern: key, pattern: undefined }); }
        };
    };
    ExcludeSettingWidget.prototype.createEditAction = function (key) {
        var _this = this;
        return {
            class: 'setting-excludeAction-edit',
            enabled: true,
            id: 'workbench.action.editExcludeItem',
            tooltip: localize('editExcludeItem', "Edit Exclude Item"),
            run: function () {
                _this.editSetting(key);
            }
        };
    };
    ExcludeSettingWidget.prototype.editSetting = function (key) {
        this.model.setEditKey(key);
        this.renderList();
    };
    ExcludeSettingWidget.prototype.renderItem = function (item, idx, listFocused) {
        return item.editing ?
            this.renderEditItem(item) :
            this.renderDataItem(item, idx, listFocused);
    };
    ExcludeSettingWidget.prototype.renderDataItem = function (item, idx, listFocused) {
        var rowElement = $('.setting-exclude-row');
        rowElement.setAttribute('data-index', idx + '');
        rowElement.setAttribute('tabindex', item.selected ? '0' : '-1');
        DOM.toggleClass(rowElement, 'selected', item.selected);
        var actionBar = new ActionBar(rowElement);
        this.listDisposables.push(actionBar);
        var patternElement = DOM.append(rowElement, $('.setting-exclude-pattern'));
        var siblingElement = DOM.append(rowElement, $('.setting-exclude-sibling'));
        patternElement.textContent = item.pattern;
        siblingElement.textContent = item.sibling && ('when: ' + item.sibling);
        actionBar.push([
            this.createEditAction(item.pattern),
            this.createDeleteAction(item.pattern)
        ], { icon: true, label: false });
        rowElement.title = item.sibling ?
            localize('excludeSiblingHintLabel', "Exclude files matching `{0}`, only when a file matching `{1}` is present", item.pattern, item.sibling) :
            localize('excludePatternHintLabel', "Exclude files matching `{0}`", item.pattern);
        if (item.selected) {
            if (listFocused) {
                setTimeout(function () {
                    rowElement.focus();
                }, 10);
            }
        }
        return rowElement;
    };
    ExcludeSettingWidget.prototype.renderAddButton = function () {
        var _this = this;
        var rowElement = $('.setting-exclude-new-row');
        var startAddButton = this._register(new Button(rowElement));
        startAddButton.label = localize('addPattern', "Add Pattern");
        startAddButton.element.classList.add('setting-exclude-addButton');
        this._register(attachButtonStyler(startAddButton, this.themeService));
        this._register(startAddButton.onDidClick(function () {
            _this.model.setEditKey('');
            _this.renderList();
        }));
        return rowElement;
    };
    ExcludeSettingWidget.prototype.renderEditItem = function (item) {
        var _this = this;
        var rowElement = $('.setting-exclude-edit-row');
        var onSubmit = function (edited) {
            _this.model.setEditKey(null);
            var pattern = patternInput.value.trim();
            if (edited && pattern) {
                _this._onDidChangeExclude.fire({
                    originalPattern: item.pattern,
                    pattern: pattern,
                    sibling: siblingInput && siblingInput.value.trim()
                });
            }
            _this.renderList();
        };
        var onKeydown = function (e) {
            if (e.equals(3 /* Enter */)) {
                onSubmit(true);
            }
            else if (e.equals(9 /* Escape */)) {
                onSubmit(false);
                e.preventDefault();
            }
        };
        var patternInput = new InputBox(rowElement, this.contextViewService, {
            placeholder: localize('excludePatternInputPlaceholder', "Exclude Pattern...")
        });
        patternInput.element.classList.add('setting-exclude-patternInput');
        this.listDisposables.push(attachInputBoxStyler(patternInput, this.themeService, {
            inputBackground: settingsTextInputBackground,
            inputForeground: settingsTextInputForeground,
            inputBorder: settingsTextInputBorder
        }));
        this.listDisposables.push(patternInput);
        patternInput.value = item.pattern;
        this.listDisposables.push(DOM.addStandardDisposableListener(patternInput.inputElement, DOM.EventType.KEY_DOWN, onKeydown));
        var siblingInput;
        if (item.sibling) {
            siblingInput = new InputBox(rowElement, this.contextViewService, {
                placeholder: localize('excludeSiblingInputPlaceholder', "When Pattern Is Present...")
            });
            siblingInput.element.classList.add('setting-exclude-siblingInput');
            this.listDisposables.push(siblingInput);
            this.listDisposables.push(attachInputBoxStyler(siblingInput, this.themeService, {
                inputBackground: settingsTextInputBackground,
                inputForeground: settingsTextInputForeground,
                inputBorder: settingsTextInputBorder
            }));
            siblingInput.value = item.sibling;
            this.listDisposables.push(DOM.addStandardDisposableListener(siblingInput.inputElement, DOM.EventType.KEY_DOWN, onKeydown));
        }
        var okButton = this._register(new Button(rowElement));
        okButton.label = localize('okButton', "OK");
        okButton.element.classList.add('setting-exclude-okButton');
        this.listDisposables.push(attachButtonStyler(okButton, this.themeService));
        this.listDisposables.push(okButton.onDidClick(function () { return onSubmit(true); }));
        var cancelButton = this._register(new Button(rowElement));
        cancelButton.label = localize('cancelButton', "Cancel");
        cancelButton.element.classList.add('setting-exclude-cancelButton');
        this.listDisposables.push(attachButtonStyler(cancelButton, this.themeService));
        this.listDisposables.push(cancelButton.onDidClick(function () { return onSubmit(false); }));
        setTimeout(function () {
            patternInput.focus();
            patternInput.select();
        }, 0);
        return rowElement;
    };
    ExcludeSettingWidget.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this.listDisposables = dispose(this.listDisposables);
    };
    ExcludeSettingWidget = __decorate([
        __param(1, IThemeService),
        __param(2, IContextViewService)
    ], ExcludeSettingWidget);
    return ExcludeSettingWidget;
}(Disposable));
export { ExcludeSettingWidget };
