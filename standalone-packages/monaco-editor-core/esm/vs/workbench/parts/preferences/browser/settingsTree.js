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
import { renderMarkdown } from '../../../../base/browser/htmlContentRenderer';
import { Separator } from '../../../../base/browser/ui/actionbar/actionbar';
import { alert as ariaAlert } from '../../../../base/browser/ui/aria/aria';
import { Button } from '../../../../base/browser/ui/button/button';
import { Checkbox } from '../../../../base/browser/ui/checkbox/checkbox';
import { InputBox } from '../../../../base/browser/ui/inputbox/inputBox';
import { SelectBox } from '../../../../base/browser/ui/selectBox/selectBox';
import { ToolBar } from '../../../../base/browser/ui/toolbar/toolbar';
import { Action } from '../../../../base/common/actions';
import * as arrays from '../../../../base/common/arrays';
import { Color, RGBA } from '../../../../base/common/color';
import { onUnexpectedError } from '../../../../base/common/errors';
import { Emitter } from '../../../../base/common/event';
import { dispose } from '../../../../base/common/lifecycle';
import { escapeRegExpCharacters, startsWith } from '../../../../base/common/strings';
import { URI } from '../../../../base/common/uri';
import { TPromise } from '../../../../base/common/winjs.base';
import { DefaultTreestyler } from '../../../../base/parts/tree/browser/treeDefaults';
import { Tree } from '../../../../base/parts/tree/browser/treeImpl';
import { localize } from '../../../../nls';
import { IClipboardService } from '../../../../platform/clipboard/common/clipboardService';
import { ICommandService } from '../../../../platform/commands/common/commands';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration';
import { IContextMenuService, IContextViewService } from '../../../../platform/contextview/browser/contextView';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding';
import { WorkbenchTreeController } from '../../../../platform/list/browser/listService';
import { IOpenerService } from '../../../../platform/opener/common/opener';
import { editorBackground, errorForeground, focusBorder, foreground, inputValidationErrorBackground, inputValidationErrorForeground, inputValidationErrorBorder } from '../../../../platform/theme/common/colorRegistry';
import { attachButtonStyler, attachInputBoxStyler, attachSelectBoxStyler, attachStyler } from '../../../../platform/theme/common/styler';
import { IThemeService, registerThemingParticipant } from '../../../../platform/theme/common/themeService';
import { isExcludeSetting, settingKeyToDisplayFormat, SettingsTreeGroupElement, SettingsTreeNewExtensionsElement, SettingsTreeSettingElement } from './settingsTreeModels';
import { ExcludeSettingWidget, settingsHeaderForeground, settingsNumberInputBackground, settingsNumberInputBorder, settingsNumberInputForeground, settingsSelectBackground, settingsSelectBorder, settingsSelectForeground, settingsSelectListBorder, settingsTextInputBackground, settingsTextInputBorder, settingsTextInputForeground } from './settingsWidgets';
import { SETTINGS_EDITOR_COMMAND_SHOW_CONTEXT_MENU } from '../common/preferences';
var $ = DOM.$;
function getExcludeDisplayValue(element) {
    var data = element.isConfigured ? __assign({}, element.defaultValue, element.scopeValue) :
        element.defaultValue;
    return Object.keys(data)
        .filter(function (key) { return !!data[key]; })
        .map(function (key) {
        var value = data[key];
        var sibling = typeof value === 'boolean' ? undefined : value.when;
        return {
            id: key,
            pattern: key,
            sibling: sibling
        };
    });
}
export function resolveSettingsTree(tocData, coreSettingsGroups) {
    var allSettings = getFlatSettings(coreSettingsGroups);
    return {
        tree: _resolveSettingsTree(tocData, allSettings),
        leftoverSettings: allSettings
    };
}
export function resolveExtensionsSettings(groups) {
    var settingsGroupToEntry = function (group) {
        var flatSettings = arrays.flatten(group.sections.map(function (section) { return section.settings; }));
        return {
            id: group.id,
            label: group.title,
            settings: flatSettings
        };
    };
    var extGroups = groups
        .sort(function (a, b) { return a.title.localeCompare(b.title); })
        .map(function (g) { return settingsGroupToEntry(g); });
    return {
        id: 'extensions',
        label: localize('extensions', "Extensions"),
        children: extGroups
    };
}
function _resolveSettingsTree(tocData, allSettings) {
    var children;
    if (tocData.children) {
        children = tocData.children
            .map(function (child) { return _resolveSettingsTree(child, allSettings); })
            .filter(function (child) { return (child.children && child.children.length) || (child.settings && child.settings.length); });
    }
    var settings;
    if (tocData.settings) {
        settings = arrays.flatten(tocData.settings.map(function (pattern) { return getMatchingSettings(allSettings, pattern); }));
    }
    if (!children && !settings) {
        return null;
    }
    return {
        id: tocData.id,
        label: tocData.label,
        children: children,
        settings: settings
    };
}
function getMatchingSettings(allSettings, pattern) {
    var result = [];
    allSettings.forEach(function (s) {
        if (settingMatches(s, pattern)) {
            result.push(s);
            allSettings.delete(s);
        }
    });
    return result.sort(function (a, b) { return a.key.localeCompare(b.key); });
}
var settingPatternCache = new Map();
function createSettingMatchRegExp(pattern) {
    pattern = escapeRegExpCharacters(pattern)
        .replace(/\\\*/g, '.*');
    return new RegExp("^" + pattern, 'i');
}
function settingMatches(s, pattern) {
    var regExp = settingPatternCache.get(pattern);
    if (!regExp) {
        regExp = createSettingMatchRegExp(pattern);
        settingPatternCache.set(pattern, regExp);
    }
    return regExp.test(s.key);
}
function getFlatSettings(settingsGroups) {
    var result = new Set();
    for (var _i = 0, settingsGroups_1 = settingsGroups; _i < settingsGroups_1.length; _i++) {
        var group = settingsGroups_1[_i];
        for (var _a = 0, _b = group.sections; _a < _b.length; _a++) {
            var section = _b[_a];
            for (var _c = 0, _d = section.settings; _c < _d.length; _c++) {
                var s = _d[_c];
                if (!s.overrides || !s.overrides.length) {
                    result.add(s);
                }
            }
        }
    }
    return result;
}
var SettingsDataSource = /** @class */ (function () {
    function SettingsDataSource() {
    }
    SettingsDataSource.prototype.getId = function (tree, element) {
        return element.id;
    };
    SettingsDataSource.prototype.hasChildren = function (tree, element) {
        if (element instanceof SettingsTreeGroupElement) {
            return true;
        }
        return false;
    };
    SettingsDataSource.prototype.getChildren = function (tree, element) {
        return TPromise.as(this._getChildren(element));
    };
    SettingsDataSource.prototype._getChildren = function (element) {
        if (element instanceof SettingsTreeGroupElement) {
            return element.children;
        }
        else {
            // No children...
            return null;
        }
    };
    SettingsDataSource.prototype.getParent = function (tree, element) {
        return TPromise.wrap(element && element.parent);
    };
    SettingsDataSource.prototype.shouldAutoexpand = function () {
        return true;
    };
    return SettingsDataSource;
}());
export { SettingsDataSource };
var SimplePagedDataSource = /** @class */ (function () {
    function SimplePagedDataSource(realDataSource) {
        this.realDataSource = realDataSource;
        this.reset();
    }
    SimplePagedDataSource.prototype.reset = function () {
        this.loadedToIndex = SimplePagedDataSource.SETTINGS_PER_PAGE;
    };
    SimplePagedDataSource.prototype.pageTo = function (index, top) {
        if (top === void 0) { top = false; }
        var buffer = top ? SimplePagedDataSource.SETTINGS_PER_PAGE : SimplePagedDataSource.BUFFER;
        if (index > this.loadedToIndex - buffer) {
            this.loadedToIndex = (Math.ceil(index / SimplePagedDataSource.SETTINGS_PER_PAGE) + 1) * SimplePagedDataSource.SETTINGS_PER_PAGE;
            return true;
        }
        else {
            return false;
        }
    };
    SimplePagedDataSource.prototype.getId = function (tree, element) {
        return this.realDataSource.getId(tree, element);
    };
    SimplePagedDataSource.prototype.hasChildren = function (tree, element) {
        return this.realDataSource.hasChildren(tree, element);
    };
    SimplePagedDataSource.prototype.getChildren = function (tree, element) {
        var _this = this;
        return this.realDataSource.getChildren(tree, element).then(function (realChildren) {
            return _this._getChildren(realChildren);
        });
    };
    SimplePagedDataSource.prototype._getChildren = function (realChildren) {
        var _this = this;
        var lastChild = realChildren[realChildren.length - 1];
        if (lastChild && lastChild.index > this.loadedToIndex) {
            return realChildren.filter(function (child) {
                return child.index < _this.loadedToIndex;
            });
        }
        else {
            return realChildren;
        }
    };
    SimplePagedDataSource.prototype.getParent = function (tree, element) {
        return this.realDataSource.getParent(tree, element);
    };
    SimplePagedDataSource.prototype.shouldAutoexpand = function (tree, element) {
        return this.realDataSource.shouldAutoexpand(tree, element);
    };
    SimplePagedDataSource.SETTINGS_PER_PAGE = 30;
    SimplePagedDataSource.BUFFER = 5;
    return SimplePagedDataSource;
}());
export { SimplePagedDataSource };
var SETTINGS_TEXT_TEMPLATE_ID = 'settings.text.template';
var SETTINGS_NUMBER_TEMPLATE_ID = 'settings.number.template';
var SETTINGS_ENUM_TEMPLATE_ID = 'settings.enum.template';
var SETTINGS_BOOL_TEMPLATE_ID = 'settings.bool.template';
var SETTINGS_EXCLUDE_TEMPLATE_ID = 'settings.exclude.template';
var SETTINGS_COMPLEX_TEMPLATE_ID = 'settings.complex.template';
var SETTINGS_NEW_EXTENSIONS_TEMPLATE_ID = 'settings.newExtensions.template';
var SETTINGS_GROUP_ELEMENT_TEMPLATE_ID = 'settings.group.template';
var SettingsRenderer = /** @class */ (function () {
    function SettingsRenderer(_measureParent, themeService, contextViewService, openerService, instantiationService, commandService, contextMenuService, keybindingService) {
        var _this = this;
        this.themeService = themeService;
        this.contextViewService = contextViewService;
        this.openerService = openerService;
        this.instantiationService = instantiationService;
        this.commandService = commandService;
        this.contextMenuService = contextMenuService;
        this.keybindingService = keybindingService;
        this._onDidChangeSetting = new Emitter();
        this.onDidChangeSetting = this._onDidChangeSetting.event;
        this._onDidOpenSettings = new Emitter();
        this.onDidOpenSettings = this._onDidOpenSettings.event;
        this._onDidClickSettingLink = new Emitter();
        this.onDidClickSettingLink = this._onDidClickSettingLink.event;
        this._onDidFocusSetting = new Emitter();
        this.onDidFocusSetting = this._onDidFocusSetting.event;
        this.longestSingleLineDescription = 0;
        this.rowHeightCache = new Map();
        this.descriptionMeasureContainer = $('.setting-item-description');
        DOM.append(_measureParent, $('.setting-measure-container.monaco-tree.settings-editor-tree', undefined, $('.monaco-scrollable-element', undefined, $('.monaco-tree-wrapper', undefined, $('.monaco-tree-rows', undefined, $('.monaco-tree-row', undefined, $('.setting-item', undefined, this.descriptionMeasureContainer)))))));
        this.settingActions = [
            new Action('settings.resetSetting', localize('resetSettingLabel', "Reset Setting"), undefined, undefined, function (context) {
                if (context) {
                    _this._onDidChangeSetting.fire({ key: context.setting.key, value: undefined, type: context.setting.type });
                }
                return TPromise.wrap(null);
            }),
            new Separator(),
            this.instantiationService.createInstance(CopySettingIdAction),
            this.instantiationService.createInstance(CopySettingAsJSONAction),
        ];
    }
    SettingsRenderer.prototype.showContextMenu = function (element, settingDOMElement) {
        var _this = this;
        var toolbarElement = settingDOMElement.querySelector('.toolbar-toggle-more');
        if (toolbarElement) {
            this.contextMenuService.showContextMenu({
                getActions: function () { return TPromise.wrap(_this.settingActions); },
                getAnchor: function () { return toolbarElement; },
                getActionsContext: function () { return element; }
            });
        }
    };
    SettingsRenderer.prototype.updateWidth = function (width) {
        if (this.lastRenderedWidth !== width) {
            this.rowHeightCache = new Map();
        }
        this.longestSingleLineDescription = 0;
        this.lastRenderedWidth = width;
    };
    SettingsRenderer.prototype.getHeight = function (tree, element) {
        if (this.rowHeightCache.has(element.id) && !(element instanceof SettingsTreeSettingElement && isExcludeSetting(element.setting))) {
            return this.rowHeightCache.get(element.id);
        }
        var h = this._getHeight(tree, element);
        this.rowHeightCache.set(element.id, h);
        return h;
    };
    SettingsRenderer.prototype._getHeight = function (tree, element) {
        if (element instanceof SettingsTreeGroupElement) {
            if (element.isFirstGroup) {
                return 31;
            }
            return 40 + (7 * element.level);
        }
        if (element instanceof SettingsTreeSettingElement) {
            if (isExcludeSetting(element.setting)) {
                return this._getExcludeSettingHeight(element);
            }
            else {
                return this.measureSettingElementHeight(tree, element);
            }
        }
        if (element instanceof SettingsTreeNewExtensionsElement) {
            return 40;
        }
        return 0;
    };
    SettingsRenderer.prototype._getExcludeSettingHeight = function (element) {
        var displayValue = getExcludeDisplayValue(element);
        return (displayValue.length + 1) * 22 + 66 + this.measureSettingDescription(element);
    };
    SettingsRenderer.prototype.measureSettingElementHeight = function (tree, element) {
        var heightExcludingDescription = 86;
        if (element.valueType === 'boolean') {
            heightExcludingDescription = 60;
        }
        return heightExcludingDescription + this.measureSettingDescription(element);
    };
    SettingsRenderer.prototype.measureSettingDescription = function (element) {
        if (element.description.length < this.longestSingleLineDescription * .8) {
            // Most setting descriptions are one short line, so try to avoid measuring them.
            // If the description is less than 80% of the longest single line description, assume this will also render to be one line.
            return 18;
        }
        var boolMeasureClass = 'measure-bool-description';
        if (element.valueType === 'boolean') {
            this.descriptionMeasureContainer.classList.add(boolMeasureClass);
        }
        else if (this.descriptionMeasureContainer.classList.contains(boolMeasureClass)) {
            this.descriptionMeasureContainer.classList.remove(boolMeasureClass);
        }
        var shouldRenderMarkdown = element.setting.descriptionIsMarkdown && element.description.indexOf('\n- ') >= 0;
        while (this.descriptionMeasureContainer.firstChild) {
            this.descriptionMeasureContainer.removeChild(this.descriptionMeasureContainer.firstChild);
        }
        if (shouldRenderMarkdown) {
            var text = fixSettingLinks(element.description);
            var rendered = renderMarkdown({ value: text });
            rendered.classList.add('setting-item-description-markdown');
            this.descriptionMeasureContainer.appendChild(rendered);
            return this.descriptionMeasureContainer.offsetHeight;
        }
        else {
            // Remove markdown links, setting links, backticks
            var measureText = element.setting.descriptionIsMarkdown ?
                fixSettingLinks(element.description)
                    .replace(/\[(.*)\]\(.*\)/g, '$1')
                    .replace(/`([^`]*)`/g, '$1') :
                element.description;
            this.descriptionMeasureContainer.innerText = measureText;
            var h = this.descriptionMeasureContainer.offsetHeight;
            if (h < 20 && measureText.length > this.longestSingleLineDescription) {
                this.longestSingleLineDescription = measureText.length;
            }
            return h;
        }
    };
    SettingsRenderer.prototype.getTemplateId = function (tree, element) {
        if (element instanceof SettingsTreeGroupElement) {
            return SETTINGS_GROUP_ELEMENT_TEMPLATE_ID;
        }
        if (element instanceof SettingsTreeSettingElement) {
            if (element.valueType === 'boolean') {
                return SETTINGS_BOOL_TEMPLATE_ID;
            }
            if (element.valueType === 'integer' || element.valueType === 'number' || element.valueType === 'nullable-integer' || element.valueType === 'nullable-number') {
                return SETTINGS_NUMBER_TEMPLATE_ID;
            }
            if (element.valueType === 'string') {
                return SETTINGS_TEXT_TEMPLATE_ID;
            }
            if (element.valueType === 'enum') {
                return SETTINGS_ENUM_TEMPLATE_ID;
            }
            if (element.valueType === 'exclude') {
                return SETTINGS_EXCLUDE_TEMPLATE_ID;
            }
            return SETTINGS_COMPLEX_TEMPLATE_ID;
        }
        if (element instanceof SettingsTreeNewExtensionsElement) {
            return SETTINGS_NEW_EXTENSIONS_TEMPLATE_ID;
        }
        return '';
    };
    SettingsRenderer.prototype.renderTemplate = function (tree, templateId, container) {
        if (templateId === SETTINGS_GROUP_ELEMENT_TEMPLATE_ID) {
            return this.renderGroupTitleTemplate(container);
        }
        if (templateId === SETTINGS_TEXT_TEMPLATE_ID) {
            return this.renderSettingTextTemplate(tree, container);
        }
        if (templateId === SETTINGS_NUMBER_TEMPLATE_ID) {
            return this.renderSettingNumberTemplate(tree, container);
        }
        if (templateId === SETTINGS_BOOL_TEMPLATE_ID) {
            return this.renderSettingBoolTemplate(tree, container);
        }
        if (templateId === SETTINGS_ENUM_TEMPLATE_ID) {
            return this.renderSettingEnumTemplate(tree, container);
        }
        if (templateId === SETTINGS_EXCLUDE_TEMPLATE_ID) {
            return this.renderSettingExcludeTemplate(tree, container);
        }
        if (templateId === SETTINGS_COMPLEX_TEMPLATE_ID) {
            return this.renderSettingComplexTemplate(tree, container);
        }
        if (templateId === SETTINGS_NEW_EXTENSIONS_TEMPLATE_ID) {
            return this.renderNewExtensionsTemplate(container);
        }
        return null;
    };
    SettingsRenderer.prototype.renderGroupTitleTemplate = function (container) {
        DOM.addClass(container, 'group-title');
        var toDispose = [];
        var template = {
            parent: container,
            toDispose: toDispose
        };
        return template;
    };
    SettingsRenderer.prototype.renderCommonTemplate = function (tree, container, typeClass) {
        DOM.addClass(container, 'setting-item');
        DOM.addClass(container, 'setting-item-' + typeClass);
        var titleElement = DOM.append(container, $('.setting-item-title'));
        var labelCategoryContainer = DOM.append(titleElement, $('.setting-item-cat-label-container'));
        var categoryElement = DOM.append(labelCategoryContainer, $('span.setting-item-category'));
        var labelElement = DOM.append(labelCategoryContainer, $('span.setting-item-label'));
        var otherOverridesElement = DOM.append(titleElement, $('span.setting-item-overrides'));
        var descriptionElement = DOM.append(container, $('.setting-item-description'));
        var modifiedIndicatorElement = DOM.append(container, $('.setting-item-modified-indicator'));
        modifiedIndicatorElement.title = localize('modified', "Modified");
        var valueElement = DOM.append(container, $('.setting-item-value'));
        var controlElement = DOM.append(valueElement, $('div.setting-item-control'));
        var deprecationWarningElement = DOM.append(container, $('.setting-item-deprecation-message'));
        var toDispose = [];
        var toolbarContainer = DOM.append(container, $('.setting-toolbar-container'));
        var toolbar = this.renderSettingToolbar(toolbarContainer);
        var template = {
            toDispose: toDispose,
            containerElement: container,
            categoryElement: categoryElement,
            labelElement: labelElement,
            descriptionElement: descriptionElement,
            controlElement: controlElement,
            deprecationWarningElement: deprecationWarningElement,
            otherOverridesElement: otherOverridesElement,
            toolbar: toolbar
        };
        // Prevent clicks from being handled by list
        toDispose.push(DOM.addDisposableListener(controlElement, 'mousedown', function (e) { return e.stopPropagation(); }));
        toDispose.push(DOM.addStandardDisposableListener(valueElement, 'keydown', function (e) {
            if (e.keyCode === 9 /* Escape */) {
                tree.domFocus();
                e.browserEvent.stopPropagation();
            }
        }));
        return template;
    };
    SettingsRenderer.prototype.addSettingElementFocusHandler = function (template) {
        var _this = this;
        var focusTracker = DOM.trackFocus(template.containerElement);
        template.toDispose.push(focusTracker);
        focusTracker.onDidBlur(function () {
            if (template.containerElement.classList.contains('focused')) {
                template.containerElement.classList.remove('focused');
            }
        });
        focusTracker.onDidFocus(function () {
            template.containerElement.classList.add('focused');
            if (template.context) {
                _this._onDidFocusSetting.fire(template.context);
            }
        });
    };
    SettingsRenderer.prototype.renderSettingTextTemplate = function (tree, container, type) {
        if (type === void 0) { type = 'text'; }
        var common = this.renderCommonTemplate(tree, container, 'text');
        var validationErrorMessageElement = DOM.append(container, $('.setting-item-validation-message'));
        var inputBox = new InputBox(common.controlElement, this.contextViewService);
        common.toDispose.push(inputBox);
        common.toDispose.push(attachInputBoxStyler(inputBox, this.themeService, {
            inputBackground: settingsTextInputBackground,
            inputForeground: settingsTextInputForeground,
            inputBorder: settingsTextInputBorder
        }));
        common.toDispose.push(inputBox.onDidChange(function (e) {
            if (template.onChange) {
                template.onChange(e);
            }
        }));
        common.toDispose.push(inputBox);
        inputBox.inputElement.classList.add(SettingsRenderer.CONTROL_CLASS);
        var template = __assign({}, common, { inputBox: inputBox,
            validationErrorMessageElement: validationErrorMessageElement });
        this.addSettingElementFocusHandler(template);
        return template;
    };
    SettingsRenderer.prototype.renderSettingNumberTemplate = function (tree, container) {
        var common = this.renderCommonTemplate(tree, container, 'number');
        var validationErrorMessageElement = DOM.append(container, $('.setting-item-validation-message'));
        var inputBox = new InputBox(common.controlElement, this.contextViewService, { type: 'number' });
        common.toDispose.push(inputBox);
        common.toDispose.push(attachInputBoxStyler(inputBox, this.themeService, {
            inputBackground: settingsNumberInputBackground,
            inputForeground: settingsNumberInputForeground,
            inputBorder: settingsNumberInputBorder
        }));
        common.toDispose.push(inputBox.onDidChange(function (e) {
            if (template.onChange) {
                template.onChange(e);
            }
        }));
        common.toDispose.push(inputBox);
        inputBox.inputElement.classList.add(SettingsRenderer.CONTROL_CLASS);
        var template = __assign({}, common, { inputBox: inputBox,
            validationErrorMessageElement: validationErrorMessageElement });
        this.addSettingElementFocusHandler(template);
        return template;
    };
    SettingsRenderer.prototype.renderSettingToolbar = function (container) {
        var toggleMenuKeybinding = this.keybindingService.lookupKeybinding(SETTINGS_EDITOR_COMMAND_SHOW_CONTEXT_MENU);
        var toggleMenuTitle = localize('settingsContextMenuTitle', "More Actions... ");
        if (toggleMenuKeybinding) {
            toggleMenuTitle += " (" + (toggleMenuKeybinding && toggleMenuKeybinding.getLabel()) + ")";
        }
        var toolbar = new ToolBar(container, this.contextMenuService, {
            toggleMenuTitle: toggleMenuTitle
        });
        toolbar.setActions([], this.settingActions)();
        var button = container.querySelector('.toolbar-toggle-more');
        if (button) {
            button.tabIndex = -1;
        }
        return toolbar;
    };
    SettingsRenderer.prototype.renderSettingBoolTemplate = function (tree, container) {
        DOM.addClass(container, 'setting-item');
        DOM.addClass(container, 'setting-item-bool');
        var titleElement = DOM.append(container, $('.setting-item-title'));
        var categoryElement = DOM.append(titleElement, $('span.setting-item-category'));
        var labelElement = DOM.append(titleElement, $('span.setting-item-label'));
        var otherOverridesElement = DOM.append(titleElement, $('span.setting-item-overrides'));
        var descriptionAndValueElement = DOM.append(container, $('.setting-item-value-description'));
        var controlElement = DOM.append(descriptionAndValueElement, $('.setting-item-bool-control'));
        var descriptionElement = DOM.append(descriptionAndValueElement, $('.setting-item-description'));
        var modifiedIndicatorElement = DOM.append(container, $('.setting-item-modified-indicator'));
        modifiedIndicatorElement.title = localize('modified', "Modified");
        var deprecationWarningElement = DOM.append(container, $('.setting-item-deprecation-message'));
        var toDispose = [];
        var checkbox = new Checkbox({ actionClassName: 'setting-value-checkbox', isChecked: true, title: '', inputActiveOptionBorder: null });
        controlElement.appendChild(checkbox.domNode);
        toDispose.push(checkbox);
        toDispose.push(checkbox.onChange(function () {
            if (template.onChange) {
                template.onChange(checkbox.checked);
            }
        }));
        // Need to listen for mouse clicks on description and toggle checkbox - use target ID for safety
        // Also have to ignore embedded links - too buried to stop propagation
        toDispose.push(DOM.addDisposableListener(descriptionElement, DOM.EventType.MOUSE_DOWN, function (e) {
            var targetElement = e.toElement;
            var targetId = descriptionElement.getAttribute('checkbox_label_target_id');
            // Make sure we are not a link and the target ID matches
            // Toggle target checkbox
            if (targetElement.tagName.toLowerCase() !== 'a' && targetId === template.checkbox.domNode.id) {
                template.checkbox.checked = template.checkbox.checked ? false : true;
                template.onChange(checkbox.checked);
            }
            DOM.EventHelper.stop(e);
        }));
        checkbox.domNode.classList.add(SettingsRenderer.CONTROL_CLASS);
        var toolbarContainer = DOM.append(container, $('.setting-toolbar-container'));
        var toolbar = this.renderSettingToolbar(toolbarContainer);
        toDispose.push(toolbar);
        var template = {
            toDispose: toDispose,
            containerElement: container,
            categoryElement: categoryElement,
            labelElement: labelElement,
            controlElement: controlElement,
            checkbox: checkbox,
            descriptionElement: descriptionElement,
            deprecationWarningElement: deprecationWarningElement,
            otherOverridesElement: otherOverridesElement,
            toolbar: toolbar
        };
        this.addSettingElementFocusHandler(template);
        // Prevent clicks from being handled by list
        toDispose.push(DOM.addDisposableListener(controlElement, 'mousedown', function (e) { return e.stopPropagation(); }));
        toDispose.push(DOM.addStandardDisposableListener(controlElement, 'keydown', function (e) {
            if (e.keyCode === 9 /* Escape */) {
                tree.domFocus();
                e.browserEvent.stopPropagation();
            }
        }));
        return template;
    };
    SettingsRenderer.prototype.cancelSuggesters = function () {
        this.contextViewService.hideContextView();
    };
    SettingsRenderer.prototype.renderSettingEnumTemplate = function (tree, container) {
        var common = this.renderCommonTemplate(tree, container, 'enum');
        var selectBox = new SelectBox([], undefined, this.contextViewService, undefined, {
            hasDetails: true
        });
        common.toDispose.push(selectBox);
        common.toDispose.push(attachSelectBoxStyler(selectBox, this.themeService, {
            selectBackground: settingsSelectBackground,
            selectForeground: settingsSelectForeground,
            selectBorder: settingsSelectBorder,
            selectListBorder: settingsSelectListBorder
        }));
        selectBox.render(common.controlElement);
        var selectElement = common.controlElement.querySelector('select');
        if (selectElement) {
            selectElement.classList.add(SettingsRenderer.CONTROL_CLASS);
        }
        common.toDispose.push(selectBox.onDidSelect(function (e) {
            if (template.onChange) {
                template.onChange(e.index);
            }
        }));
        var enumDescriptionElement = common.containerElement.insertBefore($('.setting-item-enumDescription'), common.descriptionElement.nextSibling);
        var template = __assign({}, common, { selectBox: selectBox,
            enumDescriptionElement: enumDescriptionElement });
        this.addSettingElementFocusHandler(template);
        return template;
    };
    SettingsRenderer.prototype.renderSettingExcludeTemplate = function (tree, container) {
        var _this = this;
        var common = this.renderCommonTemplate(tree, container, 'exclude');
        var excludeWidget = this.instantiationService.createInstance(ExcludeSettingWidget, common.controlElement);
        excludeWidget.domNode.classList.add(SettingsRenderer.CONTROL_CLASS);
        common.toDispose.push(excludeWidget);
        var template = __assign({}, common, { excludeWidget: excludeWidget });
        this.addSettingElementFocusHandler(template);
        common.toDispose.push(excludeWidget.onDidChangeExclude(function (e) {
            if (template.context) {
                var newValue = __assign({}, template.context.scopeValue);
                // first delete the existing entry, if present
                if (e.originalPattern) {
                    if (e.originalPattern in template.context.defaultValue) {
                        // delete a default by overriding it
                        newValue[e.originalPattern] = false;
                    }
                    else {
                        delete newValue[e.originalPattern];
                    }
                }
                // then add the new or updated entry, if present
                if (e.pattern) {
                    if (e.pattern in template.context.defaultValue && !e.sibling) {
                        // add a default by deleting its override
                        delete newValue[e.pattern];
                    }
                    else {
                        newValue[e.pattern] = e.sibling ? { when: e.sibling } : true;
                    }
                }
                var sortKeys = function (obj) {
                    var keyArray = Object.keys(obj)
                        .map(function (key) { return ({ key: key, val: obj[key] }); })
                        .sort(function (a, b) { return a.key.localeCompare(b.key); });
                    var retVal = {};
                    keyArray.forEach(function (pair) {
                        retVal[pair.key] = pair.val;
                    });
                    return retVal;
                };
                _this._onDidChangeSetting.fire({
                    key: template.context.setting.key,
                    value: Object.keys(newValue).length === 0 ? undefined : sortKeys(newValue),
                    type: template.context.valueType
                });
            }
        }));
        return template;
    };
    SettingsRenderer.prototype.renderSettingComplexTemplate = function (tree, container) {
        var common = this.renderCommonTemplate(tree, container, 'complex');
        var openSettingsButton = new Button(common.controlElement, { title: true, buttonBackground: null, buttonHoverBackground: null });
        common.toDispose.push(openSettingsButton);
        common.toDispose.push(openSettingsButton.onDidClick(function () { return template.onChange(null); }));
        openSettingsButton.label = localize('editInSettingsJson', "Edit in settings.json");
        openSettingsButton.element.classList.add('edit-in-settings-button');
        common.toDispose.push(attachButtonStyler(openSettingsButton, this.themeService, {
            buttonBackground: Color.transparent.toString(),
            buttonHoverBackground: Color.transparent.toString(),
            buttonForeground: 'foreground'
        }));
        var template = __assign({}, common, { button: openSettingsButton });
        this.addSettingElementFocusHandler(template);
        return template;
    };
    SettingsRenderer.prototype.renderNewExtensionsTemplate = function (container) {
        var _this = this;
        var toDispose = [];
        container.classList.add('setting-item-new-extensions');
        var button = new Button(container, { title: true, buttonBackground: null, buttonHoverBackground: null });
        toDispose.push(button);
        toDispose.push(button.onDidClick(function () {
            if (template.context) {
                _this.commandService.executeCommand('workbench.extensions.action.showExtensionsWithIds', template.context.extensionIds);
            }
        }));
        button.label = localize('newExtensionsButtonLabel', "Show matching extensions");
        button.element.classList.add('settings-new-extensions-button');
        toDispose.push(attachButtonStyler(button, this.themeService));
        var template = {
            button: button,
            toDispose: toDispose
        };
        // this.addSettingElementFocusHandler(template);
        return template;
    };
    SettingsRenderer.prototype.renderElement = function (tree, element, templateId, template) {
        if (templateId === SETTINGS_GROUP_ELEMENT_TEMPLATE_ID) {
            return this.renderGroupElement(element, template);
        }
        if (templateId === SETTINGS_NEW_EXTENSIONS_TEMPLATE_ID) {
            return this.renderNewExtensionsElement(element, template);
        }
        return this.renderSettingElement(tree, element, templateId, template);
    };
    SettingsRenderer.prototype.renderGroupElement = function (element, template) {
        template.parent.innerHTML = '';
        var labelElement = DOM.append(template.parent, $('div.settings-group-title-label'));
        labelElement.classList.add("settings-group-level-" + element.level);
        labelElement.textContent = element.label;
        if (element.isFirstGroup) {
            labelElement.classList.add('settings-group-first');
        }
    };
    SettingsRenderer.prototype.renderNewExtensionsElement = function (element, template) {
        template.context = element;
    };
    SettingsRenderer.prototype.getSettingDOMElementForDOMElement = function (domElement) {
        var parent = DOM.findParentWithClass(domElement, 'setting-item');
        if (parent) {
            return parent;
        }
        return null;
    };
    SettingsRenderer.prototype.getDOMElementsForSettingKey = function (treeContainer, key) {
        return treeContainer.querySelectorAll("[" + SettingsRenderer.SETTING_KEY_ATTR + "=\"" + key + "\"]");
    };
    SettingsRenderer.prototype.getKeyForDOMElementInSetting = function (element) {
        var settingElement = this.getSettingDOMElementForDOMElement(element);
        return settingElement && settingElement.getAttribute(SettingsRenderer.SETTING_KEY_ATTR);
    };
    SettingsRenderer.prototype.renderSettingElement = function (tree, element, templateId, template) {
        template.context = element;
        template.toolbar.context = element;
        var setting = element.setting;
        DOM.toggleClass(template.containerElement, 'is-configured', element.isConfigured);
        DOM.toggleClass(template.containerElement, 'is-expanded', true);
        template.containerElement.setAttribute(SettingsRenderer.SETTING_KEY_ATTR, element.setting.key);
        var titleTooltip = setting.key + (element.isConfigured ? ' - Modified' : '');
        template.categoryElement.textContent = element.displayCategory && (element.displayCategory + ': ');
        template.categoryElement.title = titleTooltip;
        template.labelElement.textContent = element.displayLabel;
        template.labelElement.title = titleTooltip;
        this.renderValue(element, templateId, template);
        template.descriptionElement.innerHTML = '';
        if (element.setting.descriptionIsMarkdown) {
            var renderedDescription = this.renderDescriptionMarkdown(element, element.description, template.toDispose);
            template.descriptionElement.appendChild(renderedDescription);
        }
        else {
            template.descriptionElement.innerText = element.description;
        }
        var baseId = (element.displayCategory + '_' + element.displayLabel).replace(/ /g, '_').toLowerCase();
        template.descriptionElement.id = baseId + '_setting_description';
        if (templateId === SETTINGS_BOOL_TEMPLATE_ID) {
            // Add checkbox target to description clickable and able to toggle checkbox
            template.descriptionElement.setAttribute('checkbox_label_target_id', baseId + '_setting_item');
        }
        if (element.overriddenScopeList.length) {
            var otherOverridesLabel = element.isConfigured ?
                localize('alsoConfiguredIn', "Also modified in") :
                localize('configuredIn', "Modified in");
            template.otherOverridesElement.textContent = "(" + otherOverridesLabel + ": " + element.overriddenScopeList.join(', ') + ")";
        }
        else {
            template.otherOverridesElement.textContent = '';
        }
        // Remove tree attributes - sometimes overridden by tree - should be managed there
        template.containerElement.parentElement.removeAttribute('role');
        template.containerElement.parentElement.removeAttribute('aria-level');
        template.containerElement.parentElement.removeAttribute('aria-posinset');
        template.containerElement.parentElement.removeAttribute('aria-setsize');
    };
    SettingsRenderer.prototype.renderDescriptionMarkdown = function (element, text, disposeables) {
        var _this = this;
        // Rewrite `#editor.fontSize#` to link format
        text = fixSettingLinks(text);
        var renderedMarkdown = renderMarkdown({ value: text }, {
            actionHandler: {
                callback: function (content) {
                    if (startsWith(content, '#')) {
                        var e = {
                            source: element,
                            targetKey: content.substr(1)
                        };
                        _this._onDidClickSettingLink.fire(e);
                    }
                    else {
                        var uri = void 0;
                        try {
                            uri = URI.parse(content);
                        }
                        catch (err) {
                            // ignore
                        }
                        if (uri) {
                            _this.openerService.open(uri).catch(onUnexpectedError);
                        }
                    }
                },
                disposeables: disposeables
            }
        });
        renderedMarkdown.classList.add('setting-item-description-markdown');
        cleanRenderedMarkdown(renderedMarkdown);
        return renderedMarkdown;
    };
    SettingsRenderer.prototype.renderValue = function (element, templateId, template) {
        var _this = this;
        var onChange = function (value) { return _this._onDidChangeSetting.fire({ key: element.setting.key, value: value, type: template.context.valueType }); };
        template.deprecationWarningElement.innerText = element.setting.deprecationMessage || '';
        if (templateId === SETTINGS_ENUM_TEMPLATE_ID) {
            this.renderEnum(element, template, onChange);
        }
        else if (templateId === SETTINGS_TEXT_TEMPLATE_ID) {
            this.renderText(element, template, onChange);
        }
        else if (templateId === SETTINGS_NUMBER_TEMPLATE_ID) {
            this.renderNumber(element, template, onChange);
        }
        else if (templateId === SETTINGS_BOOL_TEMPLATE_ID) {
            this.renderBool(element, template, onChange);
        }
        else if (templateId === SETTINGS_EXCLUDE_TEMPLATE_ID) {
            this.renderExcludeSetting(element, template);
        }
        else if (templateId === SETTINGS_COMPLEX_TEMPLATE_ID) {
            this.renderComplexSetting(element, template);
        }
    };
    SettingsRenderer.prototype.renderBool = function (dataElement, template, onChange) {
        template.onChange = null;
        template.checkbox.checked = dataElement.value;
        template.onChange = onChange;
        // Setup and add ARIA attributes
        // Create id and label for control/input element - parent is wrapper div
        var baseId = (dataElement.displayCategory + '_' + dataElement.displayLabel).replace(/ /g, '_').toLowerCase();
        var modifiedText = dataElement.isConfigured ? 'Modified' : '';
        var label = dataElement.displayCategory + ' ' + dataElement.displayLabel + ' ' + modifiedText;
        // We use the parent control div for the aria-labelledby target
        // Does not appear you can use the direct label on the element itself within a tree
        template.checkbox.domNode.parentElement.id = baseId + '_setting_label';
        template.checkbox.domNode.parentElement.setAttribute('aria-label', label);
        // Labels will not be read on descendent input elements of the parent treeitem
        // unless defined as role=treeitem and indirect aria-labelledby approach
        template.checkbox.domNode.id = baseId + '_setting_item';
        template.checkbox.domNode.setAttribute('role', 'checkbox');
        template.checkbox.domNode.setAttribute('aria-labelledby', baseId + '_setting_label');
        template.checkbox.domNode.setAttribute('aria-describedby', baseId + '_setting_description');
    };
    SettingsRenderer.prototype.renderEnum = function (dataElement, template, onChange) {
        var displayOptions = dataElement.setting.enum
            .map(String)
            .map(escapeInvisibleChars);
        template.selectBox.setOptions(displayOptions);
        var enumDescriptions = dataElement.setting.enumDescriptions;
        var enumDescriptionsAreMarkdown = dataElement.setting.enumDescriptionsAreMarkdown;
        template.selectBox.setDetailsProvider(function (index) {
            return ({
                details: enumDescriptions && enumDescriptions[index] && (enumDescriptionsAreMarkdown ? fixSettingLinks(enumDescriptions[index], false) : enumDescriptions[index]),
                isMarkdown: enumDescriptionsAreMarkdown
            });
        });
        var modifiedText = dataElement.isConfigured ? 'Modified' : '';
        // Use ',.' as reader pause
        var label = dataElement.displayCategory + ' ' + dataElement.displayLabel + ',. ' + modifiedText;
        var baseId = (dataElement.displayCategory + '_' + dataElement.displayLabel).replace(/ /g, '_').toLowerCase();
        template.selectBox.setAriaLabel(label);
        var idx = dataElement.setting.enum.indexOf(dataElement.value);
        template.onChange = null;
        template.selectBox.select(idx);
        template.onChange = function (idx) { return onChange(dataElement.setting.enum[idx]); };
        if (template.controlElement.firstElementChild) {
            // SelectBox needs to have treeitem changed to combobox to read correctly within tree
            template.controlElement.firstElementChild.setAttribute('role', 'combobox');
            template.controlElement.firstElementChild.setAttribute('aria-describedby', baseId + '_setting_description settings_aria_more_actions_shortcut_label');
        }
        template.enumDescriptionElement.innerHTML = '';
    };
    SettingsRenderer.prototype.renderText = function (dataElement, template, onChange) {
        var modifiedText = dataElement.isConfigured ? 'Modified' : '';
        // Use ',.' as reader pause
        var label = dataElement.displayCategory + ' ' + dataElement.displayLabel + ',. ' + modifiedText;
        template.onChange = null;
        template.inputBox.value = dataElement.value;
        template.onChange = function (value) { renderValidations(dataElement, template, false, label); onChange(value); };
        // Setup and add ARIA attributes
        // Create id and label for control/input element - parent is wrapper div
        var baseId = (dataElement.displayCategory + '_' + dataElement.displayLabel).replace(/ /g, '_').toLowerCase();
        // We use the parent control div for the aria-labelledby target
        // Does not appear you can use the direct label on the element itself within a tree
        template.inputBox.inputElement.parentElement.id = baseId + '_setting_label';
        template.inputBox.inputElement.parentElement.setAttribute('aria-label', label);
        // Labels will not be read on descendent input elements of the parent treeitem
        // unless defined as role=treeitem and indirect aria-labelledby approach
        template.inputBox.inputElement.id = baseId + '_setting_item';
        template.inputBox.inputElement.setAttribute('role', 'textbox');
        template.inputBox.inputElement.setAttribute('aria-labelledby', baseId + '_setting_label');
        template.inputBox.inputElement.setAttribute('aria-describedby', baseId + '_setting_description settings_aria_more_actions_shortcut_label');
        renderValidations(dataElement, template, true, label);
    };
    SettingsRenderer.prototype.renderNumber = function (dataElement, template, onChange) {
        var modifiedText = dataElement.isConfigured ? 'Modified' : '';
        // Use ',.' as reader pause
        var label = dataElement.displayCategory + ' ' + dataElement.displayLabel + ' number,. ' + modifiedText;
        var numParseFn = (dataElement.valueType === 'integer' || dataElement.valueType === 'nullable-integer')
            ? parseInt : parseFloat;
        var nullNumParseFn = (dataElement.valueType === 'nullable-integer' || dataElement.valueType === 'nullable-number')
            ? (function (v) { return v === '' ? null : numParseFn(v); }) : numParseFn;
        template.onChange = null;
        template.inputBox.value = dataElement.value;
        template.onChange = function (value) { renderValidations(dataElement, template, false, label); onChange(nullNumParseFn(value)); };
        // Setup and add ARIA attributes
        // Create id and label for control/input element - parent is wrapper div
        var baseId = (dataElement.displayCategory + '_' + dataElement.displayLabel).replace(/ /g, '_').toLowerCase();
        // We use the parent control div for the aria-labelledby target
        // Does not appear you can use the direct label on the element itself within a tree
        template.inputBox.inputElement.parentElement.id = baseId + '_setting_label';
        template.inputBox.inputElement.parentElement.setAttribute('aria-label', label);
        // Labels will not be read on descendent input elements of the parent treeitem
        // unless defined as role=treeitem and indirect aria-labelledby approach
        template.inputBox.inputElement.id = baseId + '_setting_item';
        template.inputBox.inputElement.setAttribute('role', 'textbox');
        template.inputBox.inputElement.setAttribute('aria-labelledby', baseId + '_setting_label');
        template.inputBox.inputElement.setAttribute('aria-describedby', baseId + '_setting_description settings_aria_more_actions_shortcut_label');
        renderValidations(dataElement, template, true, label);
    };
    SettingsRenderer.prototype.renderExcludeSetting = function (dataElement, template) {
        var value = getExcludeDisplayValue(dataElement);
        template.excludeWidget.setValue(value);
        template.context = dataElement;
    };
    SettingsRenderer.prototype.renderComplexSetting = function (dataElement, template) {
        var _this = this;
        template.onChange = function () { return _this._onDidOpenSettings.fire(dataElement.setting.key); };
    };
    SettingsRenderer.prototype.disposeTemplate = function (tree, templateId, template) {
        dispose(template.toDispose);
    };
    SettingsRenderer.CONTROL_CLASS = 'setting-control-focus-target';
    SettingsRenderer.CONTROL_SELECTOR = '.' + SettingsRenderer.CONTROL_CLASS;
    SettingsRenderer.SETTING_KEY_ATTR = 'data-key';
    SettingsRenderer = __decorate([
        __param(1, IThemeService),
        __param(2, IContextViewService),
        __param(3, IOpenerService),
        __param(4, IInstantiationService),
        __param(5, ICommandService),
        __param(6, IContextMenuService),
        __param(7, IKeybindingService)
    ], SettingsRenderer);
    return SettingsRenderer;
}());
export { SettingsRenderer };
function renderValidations(dataElement, template, calledOnStartup, originalAriaLabel) {
    if (dataElement.setting.validator) {
        var errMsg = dataElement.setting.validator(template.inputBox.value);
        if (errMsg) {
            DOM.addClass(template.containerElement, 'invalid-input');
            template.validationErrorMessageElement.innerText = errMsg;
            var validationError = localize('validationError', "Validation Error.");
            template.inputBox.inputElement.parentElement.setAttribute('aria-label', [originalAriaLabel, validationError, errMsg].join(' '));
            if (!calledOnStartup) {
                ariaAlert(validationError + ' ' + errMsg);
            }
            return;
        }
        else {
            template.inputBox.inputElement.parentElement.setAttribute('aria-label', originalAriaLabel);
        }
    }
    DOM.removeClass(template.containerElement, 'invalid-input');
}
function cleanRenderedMarkdown(element) {
    for (var i = 0; i < element.childNodes.length; i++) {
        var child = element.childNodes.item(i);
        var tagName = child.tagName && child.tagName.toLowerCase();
        if (tagName === 'img') {
            element.removeChild(child);
        }
        else {
            cleanRenderedMarkdown(child);
        }
    }
}
function fixSettingLinks(text, linkify) {
    if (linkify === void 0) { linkify = true; }
    return text.replace(/`#([^#]*)#`/g, function (match, settingKey) {
        var targetDisplayFormat = settingKeyToDisplayFormat(settingKey);
        var targetName = targetDisplayFormat.category + ": " + targetDisplayFormat.label;
        return linkify ?
            "[" + targetName + "](#" + settingKey + ")" :
            "\"" + targetName + "\"";
    });
}
function escapeInvisibleChars(enumValue) {
    return enumValue && enumValue
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r');
}
var SettingsTreeFilter = /** @class */ (function () {
    function SettingsTreeFilter(viewState) {
        this.viewState = viewState;
    }
    SettingsTreeFilter.prototype.isVisible = function (tree, element) {
        var _this = this;
        // Filter during search
        if (this.viewState.filterToCategory && element instanceof SettingsTreeSettingElement) {
            if (!this.settingContainedInGroup(element.setting, this.viewState.filterToCategory)) {
                return false;
            }
        }
        // Non-user scope selected
        if (element instanceof SettingsTreeSettingElement && this.viewState.settingsTarget !== 1 /* USER */) {
            if (!element.matchesScope(this.viewState.settingsTarget)) {
                return false;
            }
        }
        // @modified or tag
        if (element instanceof SettingsTreeSettingElement && this.viewState.tagFilters) {
            if (!element.matchesAllTags(this.viewState.tagFilters)) {
                return false;
            }
        }
        // Group with no visible children
        if (element instanceof SettingsTreeGroupElement) {
            if (typeof element.count === 'number') {
                return element.count > 0;
            }
            return element.children.some(function (child) { return _this.isVisible(tree, child); });
        }
        // Filtered "new extensions" button
        if (element instanceof SettingsTreeNewExtensionsElement) {
            if ((this.viewState.tagFilters && this.viewState.tagFilters.size) || this.viewState.filterToCategory) {
                return false;
            }
        }
        return true;
    };
    SettingsTreeFilter.prototype.settingContainedInGroup = function (setting, group) {
        var _this = this;
        return group.children.some(function (child) {
            if (child instanceof SettingsTreeGroupElement) {
                return _this.settingContainedInGroup(setting, child);
            }
            else if (child instanceof SettingsTreeSettingElement) {
                return child.setting.key === setting.key;
            }
            else {
                return false;
            }
        });
    };
    return SettingsTreeFilter;
}());
export { SettingsTreeFilter };
var SettingsTreeController = /** @class */ (function (_super) {
    __extends(SettingsTreeController, _super);
    function SettingsTreeController(configurationService) {
        return _super.call(this, {}, configurationService) || this;
    }
    SettingsTreeController.prototype.onLeftClick = function (tree, element, eventish, origin) {
        var isLink = eventish.target.tagName.toLowerCase() === 'a' ||
            eventish.target.parentElement.tagName.toLowerCase() === 'a'; // <code> inside <a>
        if (isLink && (DOM.findParentWithClass(eventish.target, 'setting-item-description-markdown', tree.getHTMLElement()) || DOM.findParentWithClass(eventish.target, 'select-box-description-markdown'))) {
            return true;
        }
        return false;
    };
    SettingsTreeController = __decorate([
        __param(0, IConfigurationService)
    ], SettingsTreeController);
    return SettingsTreeController;
}(WorkbenchTreeController));
export { SettingsTreeController };
var SettingsAccessibilityProvider = /** @class */ (function () {
    function SettingsAccessibilityProvider() {
    }
    SettingsAccessibilityProvider.prototype.getAriaLabel = function (tree, element) {
        if (!element) {
            return '';
        }
        if (element instanceof SettingsTreeSettingElement) {
            return localize('settingRowAriaLabel', "{0} {1}, Setting", element.displayCategory, element.displayLabel);
        }
        if (element instanceof SettingsTreeGroupElement) {
            return localize('groupRowAriaLabel', "{0}, group", element.label);
        }
        return '';
    };
    return SettingsAccessibilityProvider;
}());
export { SettingsAccessibilityProvider };
var NonExpandableOrSelectableTree = /** @class */ (function (_super) {
    __extends(NonExpandableOrSelectableTree, _super);
    function NonExpandableOrSelectableTree() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NonExpandableOrSelectableTree.prototype.expand = function () {
        return TPromise.wrap(null);
    };
    NonExpandableOrSelectableTree.prototype.collapse = function () {
        return TPromise.wrap(null);
    };
    NonExpandableOrSelectableTree.prototype.setFocus = function (element, eventPayload) {
        return;
    };
    NonExpandableOrSelectableTree.prototype.focusNext = function (count, eventPayload) {
        return;
    };
    NonExpandableOrSelectableTree.prototype.focusPrevious = function (count, eventPayload) {
        return;
    };
    NonExpandableOrSelectableTree.prototype.focusParent = function (eventPayload) {
        return;
    };
    NonExpandableOrSelectableTree.prototype.focusFirstChild = function (eventPayload) {
        return;
    };
    NonExpandableOrSelectableTree.prototype.focusFirst = function (eventPayload, from) {
        return;
    };
    NonExpandableOrSelectableTree.prototype.focusNth = function (index, eventPayload) {
        return;
    };
    NonExpandableOrSelectableTree.prototype.focusLast = function (eventPayload, from) {
        return;
    };
    NonExpandableOrSelectableTree.prototype.focusNextPage = function (eventPayload) {
        return;
    };
    NonExpandableOrSelectableTree.prototype.focusPreviousPage = function (eventPayload) {
        return;
    };
    NonExpandableOrSelectableTree.prototype.select = function (element, eventPayload) {
        return;
    };
    NonExpandableOrSelectableTree.prototype.selectRange = function (fromElement, toElement, eventPayload) {
        return;
    };
    NonExpandableOrSelectableTree.prototype.selectAll = function (elements, eventPayload) {
        return;
    };
    NonExpandableOrSelectableTree.prototype.setSelection = function (elements, eventPayload) {
        return;
    };
    NonExpandableOrSelectableTree.prototype.toggleSelection = function (element, eventPayload) {
        return;
    };
    return NonExpandableOrSelectableTree;
}(Tree));
var SettingsTree = /** @class */ (function (_super) {
    __extends(SettingsTree, _super);
    function SettingsTree(container, viewState, configuration, themeService, instantiationService) {
        var _this = this;
        var treeClass = 'settings-editor-tree';
        var controller = instantiationService.createInstance(SettingsTreeController);
        var fullConfiguration = __assign({ controller: controller, accessibilityProvider: instantiationService.createInstance(SettingsAccessibilityProvider), filter: instantiationService.createInstance(SettingsTreeFilter, viewState), styler: new DefaultTreestyler(DOM.createStyleSheet(container), treeClass) }, configuration);
        var options = {
            ariaLabel: localize('treeAriaLabel', "Settings"),
            showLoading: false,
            indentPixels: 0,
            twistiePixels: 20,
        };
        _this = _super.call(this, container, fullConfiguration, options) || this;
        _this.disposables = [];
        _this.disposables.push(controller);
        _this.disposables.push(registerThemingParticipant(function (theme, collector) {
            var activeBorderColor = theme.getColor(focusBorder);
            if (activeBorderColor) {
                // TODO@rob - why isn't this applied when added to the stylesheet from tocTree.ts? Seems like a chromium glitch.
                collector.addRule(".settings-editor > .settings-body > .settings-toc-container .monaco-tree:focus .monaco-tree-row.focused {outline: solid 1px " + activeBorderColor + "; outline-offset: -1px;  }");
            }
            var foregroundColor = theme.getColor(foreground);
            if (foregroundColor) {
                // Links appear inside other elements in markdown. CSS opacity acts like a mask. So we have to dynamically compute the description color to avoid
                // applying an opacity to the link color.
                var fgWithOpacity = new Color(new RGBA(foregroundColor.rgba.r, foregroundColor.rgba.g, foregroundColor.rgba.b, .9));
                collector.addRule(".settings-editor > .settings-body > .settings-tree-container .setting-item .setting-item-description { color: " + fgWithOpacity + "; }");
            }
            var errorColor = theme.getColor(errorForeground);
            if (errorColor) {
                collector.addRule(".settings-editor > .settings-body > .settings-tree-container .setting-item .setting-item-deprecation-message { color: " + errorColor + "; }");
            }
            var invalidInputBackground = theme.getColor(inputValidationErrorBackground);
            if (invalidInputBackground) {
                collector.addRule(".settings-editor > .settings-body > .settings-tree-container .setting-item .setting-item-validation-message { background-color: " + invalidInputBackground + "; }");
            }
            var invalidInputForeground = theme.getColor(inputValidationErrorForeground);
            if (invalidInputForeground) {
                collector.addRule(".settings-editor > .settings-body > .settings-tree-container .setting-item .setting-item-validation-message { color: " + invalidInputForeground + "; }");
            }
            var invalidInputBorder = theme.getColor(inputValidationErrorBorder);
            if (invalidInputBorder) {
                collector.addRule(".settings-editor > .settings-body > .settings-tree-container .setting-item .setting-item-validation-message { border-style:solid; border-width: 1px; border-color: " + invalidInputBorder + "; }");
                collector.addRule(".settings-editor > .settings-body > .settings-tree-container .setting-item.invalid-input .setting-item-control .monaco-inputbox.idle { outline-width: 0; border-style:solid; border-width: 1px; border-color: " + invalidInputBorder + "; }");
            }
            var headerForegroundColor = theme.getColor(settingsHeaderForeground);
            if (headerForegroundColor) {
                collector.addRule(".settings-editor > .settings-body > .settings-tree-container .settings-group-title-label { color: " + headerForegroundColor + "; }");
                collector.addRule(".settings-editor > .settings-body > .settings-tree-container .setting-item-label { color: " + headerForegroundColor + "; }");
            }
            var focusBorderColor = theme.getColor(focusBorder);
            if (focusBorderColor) {
                collector.addRule(".settings-editor > .settings-body > .settings-tree-container .setting-item .setting-item-description-markdown a:focus { outline-color: " + focusBorderColor + " }");
            }
        }));
        _this.getHTMLElement().classList.add(treeClass);
        _this.disposables.push(attachStyler(themeService, {
            listActiveSelectionBackground: editorBackground,
            listActiveSelectionForeground: foreground,
            listFocusAndSelectionBackground: editorBackground,
            listFocusAndSelectionForeground: foreground,
            listFocusBackground: editorBackground,
            listFocusForeground: foreground,
            listHoverForeground: foreground,
            listHoverBackground: editorBackground,
            listHoverOutline: editorBackground,
            listFocusOutline: editorBackground,
            listInactiveSelectionBackground: editorBackground,
            listInactiveSelectionForeground: foreground
        }, function (colors) {
            _this.style(colors);
        }));
        return _this;
    }
    SettingsTree.prototype.dispose = function () {
        this.disposables = dispose(this.disposables);
    };
    SettingsTree = __decorate([
        __param(3, IThemeService),
        __param(4, IInstantiationService)
    ], SettingsTree);
    return SettingsTree;
}(NonExpandableOrSelectableTree));
export { SettingsTree };
var CopySettingIdAction = /** @class */ (function (_super) {
    __extends(CopySettingIdAction, _super);
    function CopySettingIdAction(clipboardService) {
        var _this = _super.call(this, CopySettingIdAction.ID, CopySettingIdAction.LABEL) || this;
        _this.clipboardService = clipboardService;
        return _this;
    }
    CopySettingIdAction.prototype.run = function (context) {
        if (context) {
            this.clipboardService.writeText(context.setting.key);
        }
        return TPromise.as(null);
    };
    CopySettingIdAction.ID = 'settings.copySettingId';
    CopySettingIdAction.LABEL = localize('copySettingIdLabel', "Copy Setting ID");
    CopySettingIdAction = __decorate([
        __param(0, IClipboardService)
    ], CopySettingIdAction);
    return CopySettingIdAction;
}(Action));
var CopySettingAsJSONAction = /** @class */ (function (_super) {
    __extends(CopySettingAsJSONAction, _super);
    function CopySettingAsJSONAction(clipboardService) {
        var _this = _super.call(this, CopySettingAsJSONAction.ID, CopySettingAsJSONAction.LABEL) || this;
        _this.clipboardService = clipboardService;
        return _this;
    }
    CopySettingAsJSONAction.prototype.run = function (context) {
        if (context) {
            var jsonResult = "\"" + context.setting.key + "\": " + JSON.stringify(context.value, undefined, '  ');
            this.clipboardService.writeText(jsonResult);
        }
        return TPromise.as(null);
    };
    CopySettingAsJSONAction.ID = 'settings.copySettingAsJSON';
    CopySettingAsJSONAction.LABEL = localize('copySettingAsJSONLabel', "Copy Setting as JSON");
    CopySettingAsJSONAction = __decorate([
        __param(0, IClipboardService)
    ], CopySettingAsJSONAction);
    return CopySettingAsJSONAction;
}(Action));
