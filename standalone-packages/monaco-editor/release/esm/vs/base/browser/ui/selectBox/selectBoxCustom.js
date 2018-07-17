/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import './selectBoxCustom.css';
import * as nls from '../../../../nls.js';
import { dispose } from '../../../common/lifecycle.js';
import { Emitter, chain } from '../../../common/event.js';
import { KeyCodeUtils } from '../../../common/keyCodes.js';
import { StandardKeyboardEvent } from '../../keyboardEvent.js';
import * as dom from '../../dom.js';
import * as arrays from '../../../common/arrays.js';
import { List } from '../list/listWidget.js';
import { domEvent } from '../../event.js';
import { ScrollbarVisibility } from '../../../common/scrollable.js';
import { isMacintosh } from '../../../common/platform.js';
var $ = dom.$;
var SELECT_OPTION_ENTRY_TEMPLATE_ID = 'selectOption.entry.template';
var SelectListRenderer = /** @class */ (function () {
    function SelectListRenderer() {
    }
    Object.defineProperty(SelectListRenderer.prototype, "templateId", {
        get: function () { return SELECT_OPTION_ENTRY_TEMPLATE_ID; },
        enumerable: true,
        configurable: true
    });
    SelectListRenderer.prototype.renderTemplate = function (container) {
        var data = Object.create(null);
        data.disposables = [];
        data.root = container;
        data.optionText = dom.append(container, $('.option-text'));
        return data;
    };
    SelectListRenderer.prototype.renderElement = function (element, index, templateData) {
        var data = templateData;
        var optionText = element.optionText;
        var optionDisabled = element.optionDisabled;
        data.optionText.textContent = optionText;
        data.root.setAttribute('aria-label', nls.localize('selectAriaOption', "{0}", optionText));
        // pseudo-select disabled option
        if (optionDisabled) {
            dom.addClass(data.root, 'option-disabled');
        }
        else {
            // Make sure we do class removal from prior template rendering
            dom.removeClass(data.root, 'option-disabled');
        }
    };
    SelectListRenderer.prototype.disposeTemplate = function (templateData) {
        templateData.disposables = dispose(templateData.disposables);
    };
    return SelectListRenderer;
}());
var SelectBoxList = /** @class */ (function () {
    function SelectBoxList(options, selected, contextViewProvider, styles, selectBoxOptions) {
        this.toDispose = [];
        this._isVisible = false;
        this.selectBoxOptions = selectBoxOptions || Object.create(null);
        if (typeof this.selectBoxOptions.minBottomMargin !== 'number') {
            this.selectBoxOptions.minBottomMargin = SelectBoxList.DEFAULT_DROPDOWN_MINIMUM_BOTTOM_MARGIN;
        }
        else if (this.selectBoxOptions.minBottomMargin < 0) {
            this.selectBoxOptions.minBottomMargin = 0;
        }
        this.selectElement = document.createElement('select');
        this.selectElement.className = 'monaco-select-box';
        this._onDidSelect = new Emitter();
        this.styles = styles;
        this.registerListeners();
        this.constructSelectDropDown(contextViewProvider);
        this.setOptions(options, selected);
    }
    // IDelegate - List renderer
    SelectBoxList.prototype.getHeight = function () {
        return 18;
    };
    SelectBoxList.prototype.getTemplateId = function () {
        return SELECT_OPTION_ENTRY_TEMPLATE_ID;
    };
    SelectBoxList.prototype.constructSelectDropDown = function (contextViewProvider) {
        // SetUp ContextView container to hold select Dropdown
        this.contextViewProvider = contextViewProvider;
        this.selectDropDownContainer = dom.$('.monaco-select-box-dropdown-container');
        // Setup list for drop-down select
        this.createSelectList(this.selectDropDownContainer);
        // Create span flex box item/div we can measure and control
        var widthControlOuterDiv = dom.append(this.selectDropDownContainer, $('.select-box-dropdown-container-width-control'));
        var widthControlInnerDiv = dom.append(widthControlOuterDiv, $('.width-control-div'));
        this.widthControlElement = document.createElement('span');
        this.widthControlElement.className = 'option-text-width-control';
        dom.append(widthControlInnerDiv, this.widthControlElement);
        // Inline stylesheet for themes
        this.styleElement = dom.createStyleSheet(this.selectDropDownContainer);
    };
    SelectBoxList.prototype.registerListeners = function () {
        // Parent native select keyboard listeners
        var _this = this;
        this.toDispose.push(dom.addStandardDisposableListener(this.selectElement, 'change', function (e) {
            _this.selectElement.title = e.target.value;
            _this._onDidSelect.fire({
                index: e.target.selectedIndex,
                selected: e.target.value
            });
        }));
        // Have to implement both keyboard and mouse controllers to handle disabled options
        // Intercept mouse events to override normal select actions on parents
        this.toDispose.push(dom.addDisposableListener(this.selectElement, dom.EventType.CLICK, function (e) {
            dom.EventHelper.stop(e);
            if (_this._isVisible) {
                _this.hideSelectDropDown(true);
            }
            else {
                _this.showSelectDropDown();
            }
        }));
        this.toDispose.push(dom.addDisposableListener(this.selectElement, dom.EventType.MOUSE_DOWN, function (e) {
            dom.EventHelper.stop(e);
        }));
        // Intercept keyboard handling
        this.toDispose.push(dom.addDisposableListener(this.selectElement, dom.EventType.KEY_DOWN, function (e) {
            var event = new StandardKeyboardEvent(e);
            var showDropDown = false;
            // Create and drop down select list on keyboard select
            if (isMacintosh) {
                if (event.keyCode === 18 /* DownArrow */ || event.keyCode === 16 /* UpArrow */ || event.keyCode === 10 /* Space */ || event.keyCode === 3 /* Enter */) {
                    showDropDown = true;
                }
            }
            else {
                if (event.keyCode === 18 /* DownArrow */ && event.altKey || event.keyCode === 16 /* UpArrow */ && event.altKey || event.keyCode === 10 /* Space */ || event.keyCode === 3 /* Enter */) {
                    showDropDown = true;
                }
            }
            if (showDropDown) {
                _this.showSelectDropDown();
                dom.EventHelper.stop(e);
            }
        }));
    };
    Object.defineProperty(SelectBoxList.prototype, "onDidSelect", {
        get: function () {
            return this._onDidSelect.event;
        },
        enumerable: true,
        configurable: true
    });
    SelectBoxList.prototype.setOptions = function (options, selected, disabled) {
        var _this = this;
        if (!this.options || !arrays.equals(this.options, options)) {
            this.options = options;
            this.selectElement.options.length = 0;
            var i_1 = 0;
            this.options.forEach(function (option) {
                _this.selectElement.add(_this.createOption(option, i_1, disabled === i_1++));
            });
            // Mirror options in drop-down
            // Populate select list for non-native select mode
            if (this.selectList && !!this.options) {
                var listEntries = void 0;
                listEntries = [];
                if (disabled !== undefined) {
                    this.disabledOptionIndex = disabled;
                }
                for (var index = 0; index < this.options.length; index++) {
                    var element = this.options[index];
                    var optionDisabled = void 0;
                    index === this.disabledOptionIndex ? optionDisabled = true : optionDisabled = false;
                    listEntries.push({ optionText: element, optionDisabled: optionDisabled });
                }
                this.selectList.splice(0, this.selectList.length, listEntries);
            }
        }
        if (selected !== undefined) {
            this.select(selected);
        }
    };
    SelectBoxList.prototype.select = function (index) {
        if (index >= 0 && index < this.options.length) {
            this.selected = index;
        }
        else if (index > this.options.length - 1) {
            // Adjust index to end of list
            // This could make client out of sync with the select
            this.select(this.options.length - 1);
        }
        else if (this.selected < 0) {
            this.selected = 0;
        }
        this.selectElement.selectedIndex = this.selected;
        this.selectElement.title = this.options[this.selected];
    };
    SelectBoxList.prototype.focus = function () {
        if (this.selectElement) {
            this.selectElement.focus();
        }
    };
    SelectBoxList.prototype.blur = function () {
        if (this.selectElement) {
            this.selectElement.blur();
        }
    };
    SelectBoxList.prototype.render = function (container) {
        dom.addClass(container, 'select-container');
        container.appendChild(this.selectElement);
        this.setOptions(this.options, this.selected);
        this.applyStyles();
    };
    SelectBoxList.prototype.style = function (styles) {
        var content = [];
        this.styles = styles;
        // Style non-native select mode
        if (this.styles.listFocusBackground) {
            content.push(".monaco-select-box-dropdown-container > .select-box-dropdown-list-container .monaco-list .monaco-list-row.focused { background-color: " + this.styles.listFocusBackground + " !important; }");
        }
        if (this.styles.listFocusForeground) {
            content.push(".monaco-select-box-dropdown-container > .select-box-dropdown-list-container .monaco-list .monaco-list-row.focused:not(:hover) { color: " + this.styles.listFocusForeground + " !important; }");
        }
        // Hover foreground - ignore for disabled options
        if (this.styles.listHoverForeground) {
            content.push(".monaco-select-box-dropdown-container > .select-box-dropdown-list-container .monaco-list .monaco-list-row:hover { color: " + this.styles.listHoverForeground + " !important; }");
            content.push(".monaco-select-box-dropdown-container > .select-box-dropdown-list-container .monaco-list .monaco-list-row.option-disabled:hover { background-color: " + this.styles.listActiveSelectionForeground + " !important; }");
        }
        // Hover background - ignore for disabled options
        if (this.styles.listHoverBackground) {
            content.push(".monaco-select-box-dropdown-container > .select-box-dropdown-list-container .monaco-list .monaco-list-row:not(.option-disabled):not(.focused):hover { background-color: " + this.styles.listHoverBackground + " !important; }");
            content.push(".monaco-select-box-dropdown-container > .select-box-dropdown-list-container .monaco-list .monaco-list-row.option-disabled:hover { background-color: " + this.styles.selectBackground + " !important; }");
        }
        // Match quickOpen outline styles - ignore for disabled options
        if (this.styles.listFocusOutline) {
            content.push(".monaco-select-box-dropdown-container > .select-box-dropdown-list-container .monaco-list .monaco-list-row.focused { outline: 1.6px dotted " + this.styles.listFocusOutline + " !important; outline-offset: -1.6px !important; }");
        }
        if (this.styles.listHoverOutline) {
            content.push(".monaco-select-box-dropdown-container > .select-box-dropdown-list-container .monaco-list .monaco-list-row:hover:not(.focused) { outline: 1.6px dashed " + this.styles.listHoverOutline + " !important; outline-offset: -1.6px !important; }");
            content.push(".monaco-select-box-dropdown-container > .select-box-dropdown-list-container .monaco-list .monaco-list-row.option-disabled:hover { outline: none !important; }");
        }
        this.styleElement.innerHTML = content.join('\n');
        this.applyStyles();
    };
    SelectBoxList.prototype.applyStyles = function () {
        // Style parent select
        var background = null;
        if (this.selectElement) {
            background = this.styles.selectBackground ? this.styles.selectBackground.toString() : null;
            var foreground = this.styles.selectForeground ? this.styles.selectForeground.toString() : null;
            var border = this.styles.selectBorder ? this.styles.selectBorder.toString() : null;
            this.selectElement.style.backgroundColor = background;
            this.selectElement.style.color = foreground;
            this.selectElement.style.borderColor = border;
        }
        // Style drop down select list (non-native mode only)
        if (this.selectList) {
            this.selectList.style({});
            var listBackground = this.styles.selectListBackground ? this.styles.selectListBackground.toString() : background;
            this.selectDropDownListContainer.style.backgroundColor = listBackground;
            var optionsBorder = this.styles.focusBorder ? this.styles.focusBorder.toString() : null;
            this.selectDropDownContainer.style.outlineColor = optionsBorder;
            this.selectDropDownContainer.style.outlineOffset = '-1px';
        }
    };
    SelectBoxList.prototype.createOption = function (value, index, disabled) {
        var option = document.createElement('option');
        option.value = value;
        option.text = value;
        option.disabled = disabled;
        return option;
    };
    // Non-native select list handling
    // ContextView dropdown methods
    SelectBoxList.prototype.showSelectDropDown = function () {
        var _this = this;
        if (!this.contextViewProvider || this._isVisible) {
            return;
        }
        this._isVisible = true;
        this.cloneElementFont(this.selectElement, this.selectDropDownContainer);
        this.contextViewProvider.showContextView({
            getAnchor: function () { return _this.selectElement; },
            render: function (container) { return _this.renderSelectDropDown(container); },
            layout: function () { return _this.layoutSelectDropDown(); },
            onHide: function () {
                dom.toggleClass(_this.selectDropDownContainer, 'visible', false);
                dom.toggleClass(_this.selectElement, 'synthetic-focus', false);
            }
        });
        this._currentSelection = this.selected;
    };
    SelectBoxList.prototype.hideSelectDropDown = function (focusSelect) {
        if (!this.contextViewProvider || !this._isVisible) {
            return;
        }
        this._isVisible = false;
        if (focusSelect) {
            this.selectElement.focus();
        }
        this.contextViewProvider.hideContextView();
    };
    SelectBoxList.prototype.renderSelectDropDown = function (container) {
        var _this = this;
        container.appendChild(this.selectDropDownContainer);
        this.layoutSelectDropDown();
        return {
            dispose: function () { return container.removeChild(_this.selectDropDownContainer); } // remove to take out the CSS rules we add
        };
    };
    SelectBoxList.prototype.layoutSelectDropDown = function () {
        // Layout ContextView drop down select list and container
        // Have to manage our vertical overflow, sizing
        // Need to be visible to measure
        dom.toggleClass(this.selectDropDownContainer, 'visible', true);
        var selectWidth = dom.getTotalWidth(this.selectElement);
        var selectPosition = dom.getDomNodePagePosition(this.selectElement);
        // Set container height to max from select bottom to margin (default/minBottomMargin)
        var maxSelectDropDownHeight = (window.innerHeight - selectPosition.top - selectPosition.height - this.selectBoxOptions.minBottomMargin);
        if (maxSelectDropDownHeight < 0) {
            maxSelectDropDownHeight = 0;
        }
        // SetUp list dimensions and layout - account for container padding
        if (this.selectList) {
            this.selectList.layout();
            var listHeight = this.selectList.contentHeight;
            var listContainerHeight = dom.getTotalHeight(this.selectDropDownListContainer);
            var totalVerticalListPadding = listContainerHeight - listHeight;
            // Always show complete list items - never more than Max available vertical height
            if (listContainerHeight > maxSelectDropDownHeight) {
                listHeight = ((Math.floor((maxSelectDropDownHeight - totalVerticalListPadding) / this.getHeight())) * this.getHeight());
            }
            this.selectList.layout(listHeight);
            this.selectList.domFocus();
            // Finally set focus on selected item
            if (this.selectList.length > 0) {
                this.selectList.setFocus([this.selected || 0]);
                this.selectList.reveal(this.selectList.getFocus()[0] || 0);
            }
            // Set final container height after adjustments
            this.selectDropDownContainer.style.height = (listHeight + totalVerticalListPadding) + 'px';
            // Determine optimal width - min(longest option), opt(parent select), max(ContextView controlled)
            var selectMinWidth = this.setWidthControlElement(this.widthControlElement);
            var selectOptimalWidth = Math.max(selectMinWidth, Math.round(selectWidth)).toString() + 'px';
            this.selectDropDownContainer.style.minWidth = selectOptimalWidth;
            // Maintain focus outline on parent select as well as list container - tabindex for focus
            this.selectDropDownListContainer.setAttribute('tabindex', '0');
            dom.toggleClass(this.selectElement, 'synthetic-focus', true);
            dom.toggleClass(this.selectDropDownContainer, 'synthetic-focus', true);
        }
    };
    SelectBoxList.prototype.setWidthControlElement = function (container) {
        var elementWidth = 0;
        if (container && !!this.options) {
            var longest = 0;
            for (var index = 0; index < this.options.length; index++) {
                if (this.options[index].length > this.options[longest].length) {
                    longest = index;
                }
            }
            container.innerHTML = this.options[longest];
            elementWidth = dom.getTotalWidth(container);
        }
        return elementWidth;
    };
    SelectBoxList.prototype.cloneElementFont = function (source, target) {
        var fontSize = window.getComputedStyle(source, null).getPropertyValue('font-size');
        var fontFamily = window.getComputedStyle(source, null).getPropertyValue('font-family');
        target.style.fontFamily = fontFamily;
        target.style.fontSize = fontSize;
    };
    SelectBoxList.prototype.createSelectList = function (parent) {
        var _this = this;
        // SetUp container for list
        this.selectDropDownListContainer = dom.append(parent, $('.select-box-dropdown-list-container'));
        this.listRenderer = new SelectListRenderer();
        this.selectList = new List(this.selectDropDownListContainer, this, [this.listRenderer], {
            useShadows: false,
            selectOnMouseDown: false,
            verticalScrollMode: ScrollbarVisibility.Visible,
            keyboardSupport: false,
            mouseSupport: false
        });
        // SetUp list keyboard controller - control navigation, disabled items, focus
        var onSelectDropDownKeyDown = chain(domEvent(this.selectDropDownListContainer, 'keydown'))
            .filter(function () { return _this.selectList.length > 0; })
            .map(function (e) { return new StandardKeyboardEvent(e); });
        onSelectDropDownKeyDown.filter(function (e) { return e.keyCode === 3 /* Enter */; }).on(function (e) { return _this.onEnter(e); }, this, this.toDispose);
        onSelectDropDownKeyDown.filter(function (e) { return e.keyCode === 9 /* Escape */; }).on(function (e) { return _this.onEscape(e); }, this, this.toDispose);
        onSelectDropDownKeyDown.filter(function (e) { return e.keyCode === 16 /* UpArrow */; }).on(this.onUpArrow, this, this.toDispose);
        onSelectDropDownKeyDown.filter(function (e) { return e.keyCode === 18 /* DownArrow */; }).on(this.onDownArrow, this, this.toDispose);
        onSelectDropDownKeyDown.filter(function (e) { return e.keyCode === 12 /* PageDown */; }).on(this.onPageDown, this, this.toDispose);
        onSelectDropDownKeyDown.filter(function (e) { return e.keyCode === 11 /* PageUp */; }).on(this.onPageUp, this, this.toDispose);
        onSelectDropDownKeyDown.filter(function (e) { return e.keyCode === 14 /* Home */; }).on(this.onHome, this, this.toDispose);
        onSelectDropDownKeyDown.filter(function (e) { return e.keyCode === 13 /* End */; }).on(this.onEnd, this, this.toDispose);
        onSelectDropDownKeyDown.filter(function (e) { return (e.keyCode >= 21 /* KEY_0 */ && e.keyCode <= 56 /* KEY_Z */) || (e.keyCode >= 80 /* US_SEMICOLON */ && e.keyCode <= 108 /* NUMPAD_DIVIDE */); }).on(this.onCharacter, this, this.toDispose);
        // SetUp list mouse controller - control navigation, disabled items, focus
        chain(domEvent(this.selectList.getHTMLElement(), 'mouseup'))
            .filter(function () { return _this.selectList.length > 0; })
            .on(function (e) { return _this.onMouseUp(e); }, this, this.toDispose);
        this.toDispose.push(this.selectList.onDidBlur(function (e) { return _this.onListBlur(); }));
    };
    // List methods
    // List mouse controller - active exit, select option, fire onDidSelect, return focus to parent select
    SelectBoxList.prototype.onMouseUp = function (e) {
        // Check our mouse event is on an option (not scrollbar)
        if (!e.toElement.classList.contains('option-text')) {
            return;
        }
        var listRowElement = e.toElement.parentElement;
        var index = Number(listRowElement.getAttribute('data-index'));
        var disabled = listRowElement.classList.contains('option-disabled');
        // Ignore mouse selection of disabled options
        if (index >= 0 && index < this.options.length && !disabled) {
            this.selected = index;
            this.select(this.selected);
            this.selectList.setFocus([this.selected]);
            this.selectList.reveal(this.selectList.getFocus()[0]);
            this._onDidSelect.fire({
                index: this.selectElement.selectedIndex,
                selected: this.selectElement.title
            });
            // Reset Selection Handler
            this._currentSelection = -1;
            this.hideSelectDropDown(true);
        }
        dom.EventHelper.stop(e);
    };
    // List Exit - passive - hide drop-down, fire onDidSelect
    SelectBoxList.prototype.onListBlur = function () {
        if (this._currentSelection >= 0) {
            this.select(this._currentSelection);
        }
        this._onDidSelect.fire({
            index: this.selectElement.selectedIndex,
            selected: this.selectElement.title
        });
        this.hideSelectDropDown(false);
    };
    // List keyboard controller
    // List exit - active - hide ContextView dropdown, return focus to parent select, fire onDidSelect
    SelectBoxList.prototype.onEscape = function (e) {
        dom.EventHelper.stop(e);
        this.select(this._currentSelection);
        this.hideSelectDropDown(true);
        this._onDidSelect.fire({
            index: this.selectElement.selectedIndex,
            selected: this.selectElement.title
        });
    };
    // List exit - active - hide ContextView dropdown, return focus to parent select, fire onDidSelect
    SelectBoxList.prototype.onEnter = function (e) {
        dom.EventHelper.stop(e);
        // Reset current selection
        this._currentSelection = -1;
        this.hideSelectDropDown(true);
        this._onDidSelect.fire({
            index: this.selectElement.selectedIndex,
            selected: this.selectElement.title
        });
    };
    // List navigation - have to handle a disabled option (jump over)
    SelectBoxList.prototype.onDownArrow = function () {
        if (this.selected < this.options.length - 1) {
            // Skip disabled options
            if ((this.selected + 1) === this.disabledOptionIndex && this.options.length > this.selected + 2) {
                this.selected += 2;
            }
            else {
                this.selected++;
            }
            // Set focus/selection - only fire event when closing drop-down or on blur
            this.select(this.selected);
            this.selectList.setFocus([this.selected]);
            this.selectList.reveal(this.selectList.getFocus()[0]);
        }
    };
    SelectBoxList.prototype.onUpArrow = function () {
        if (this.selected > 0) {
            // Skip disabled options
            if ((this.selected - 1) === this.disabledOptionIndex && this.selected > 1) {
                this.selected -= 2;
            }
            else {
                this.selected--;
            }
            // Set focus/selection - only fire event when closing drop-down or on blur
            this.select(this.selected);
            this.selectList.setFocus([this.selected]);
            this.selectList.reveal(this.selectList.getFocus()[0]);
        }
    };
    SelectBoxList.prototype.onPageUp = function (e) {
        var _this = this;
        dom.EventHelper.stop(e);
        this.selectList.focusPreviousPage();
        // Allow scrolling to settle
        setTimeout(function () {
            _this.selected = _this.selectList.getFocus()[0];
            // Shift selection down if we land on a disabled option
            if (_this.selected === _this.disabledOptionIndex && _this.selected < _this.options.length - 1) {
                _this.selected++;
                _this.selectList.setFocus([_this.selected]);
            }
            _this.selectList.reveal(_this.selected);
            _this.select(_this.selected);
        }, 1);
    };
    SelectBoxList.prototype.onPageDown = function (e) {
        var _this = this;
        dom.EventHelper.stop(e);
        this.selectList.focusNextPage();
        // Allow scrolling to settle
        setTimeout(function () {
            _this.selected = _this.selectList.getFocus()[0];
            // Shift selection up if we land on a disabled option
            if (_this.selected === _this.disabledOptionIndex && _this.selected > 0) {
                _this.selected--;
                _this.selectList.setFocus([_this.selected]);
            }
            _this.selectList.reveal(_this.selected);
            _this.select(_this.selected);
        }, 1);
    };
    SelectBoxList.prototype.onHome = function (e) {
        dom.EventHelper.stop(e);
        if (this.options.length < 2) {
            return;
        }
        this.selected = 0;
        if (this.selected === this.disabledOptionIndex && this.selected > 1) {
            this.selected++;
        }
        this.selectList.setFocus([this.selected]);
        this.selectList.reveal(this.selected);
        this.select(this.selected);
    };
    SelectBoxList.prototype.onEnd = function (e) {
        dom.EventHelper.stop(e);
        if (this.options.length < 2) {
            return;
        }
        this.selected = this.options.length - 1;
        if (this.selected === this.disabledOptionIndex && this.selected > 1) {
            this.selected--;
        }
        this.selectList.setFocus([this.selected]);
        this.selectList.reveal(this.selected);
        this.select(this.selected);
    };
    // Mimic option first character navigation of native select
    SelectBoxList.prototype.onCharacter = function (e) {
        var ch = KeyCodeUtils.toString(e.keyCode);
        var optionIndex = -1;
        for (var i = 0; i < this.options.length - 1; i++) {
            optionIndex = (i + this.selected + 1) % this.options.length;
            if (this.options[optionIndex].charAt(0).toUpperCase() === ch) {
                this.select(optionIndex);
                this.selectList.setFocus([optionIndex]);
                this.selectList.reveal(this.selectList.getFocus()[0]);
                dom.EventHelper.stop(e);
                break;
            }
        }
    };
    SelectBoxList.prototype.dispose = function () {
        this.hideSelectDropDown(false);
        this.toDispose = dispose(this.toDispose);
    };
    SelectBoxList.DEFAULT_DROPDOWN_MINIMUM_BOTTOM_MARGIN = 32;
    return SelectBoxList;
}());
export { SelectBoxList };
