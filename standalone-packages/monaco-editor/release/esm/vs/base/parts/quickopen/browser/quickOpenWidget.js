/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import './quickopen.css';
import * as nls from '../../../../nls.js';
import { TPromise } from '../../../common/winjs.base.js';
import * as platform from '../../../common/platform.js';
import * as types from '../../../common/types.js';
import * as errors from '../../../common/errors.js';
import { Mode } from '../common/quickOpen.js';
import { Filter, Renderer, DataSource, AccessibilityProvider } from './quickOpenViewer.js';
import { $ } from '../../../browser/builder.js';
import { InputBox, MessageType } from '../../../browser/ui/inputbox/inputBox.js';
import Severity from '../../../common/severity.js';
import { Tree } from '../../tree/browser/treeImpl.js';
import { ProgressBar } from '../../../browser/ui/progressbar/progressbar.js';
import { StandardKeyboardEvent } from '../../../browser/keyboardEvent.js';
import { DefaultController, ClickBehavior } from '../../tree/browser/treeDefaults.js';
import * as DOM from '../../../browser/dom.js';
import { Disposable } from '../../../common/lifecycle.js';
import { ScrollbarVisibility } from '../../../common/scrollable.js';
import { Color } from '../../../common/color.js';
import { mixin } from '../../../common/objects.js';
import { StandardMouseEvent } from '../../../browser/mouseEvent.js';
var QuickOpenController = /** @class */ (function (_super) {
    __extends(QuickOpenController, _super);
    function QuickOpenController() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    QuickOpenController.prototype.onContextMenu = function (tree, element, event) {
        if (platform.isMacintosh) {
            return this.onLeftClick(tree, element, event); // https://github.com/Microsoft/vscode/issues/1011
        }
        return _super.prototype.onContextMenu.call(this, tree, element, event);
    };
    return QuickOpenController;
}(DefaultController));
export { QuickOpenController };
export var HideReason;
(function (HideReason) {
    HideReason[HideReason["ELEMENT_SELECTED"] = 0] = "ELEMENT_SELECTED";
    HideReason[HideReason["FOCUS_LOST"] = 1] = "FOCUS_LOST";
    HideReason[HideReason["CANCELED"] = 2] = "CANCELED";
})(HideReason || (HideReason = {}));
var defaultStyles = {
    background: Color.fromHex('#1E1E1E'),
    foreground: Color.fromHex('#CCCCCC'),
    pickerGroupForeground: Color.fromHex('#0097FB'),
    pickerGroupBorder: Color.fromHex('#3F3F46'),
    widgetShadow: Color.fromHex('#000000'),
    progressBarBackground: Color.fromHex('#0E70C0')
};
var DEFAULT_INPUT_ARIA_LABEL = nls.localize('quickOpenAriaLabel', "Quick picker. Type to narrow down results.");
var QuickOpenWidget = /** @class */ (function (_super) {
    __extends(QuickOpenWidget, _super);
    function QuickOpenWidget(container, callbacks, options) {
        var _this = _super.call(this) || this;
        _this.isDisposed = false;
        _this.container = container;
        _this.callbacks = callbacks;
        _this.options = options;
        _this.styles = options || Object.create(null);
        mixin(_this.styles, defaultStyles, false);
        _this.model = null;
        return _this;
    }
    QuickOpenWidget.prototype.getElement = function () {
        return $(this.builder).getHTMLElement();
    };
    QuickOpenWidget.prototype.getModel = function () {
        return this.model;
    };
    QuickOpenWidget.prototype.setCallbacks = function (callbacks) {
        this.callbacks = callbacks;
    };
    QuickOpenWidget.prototype.create = function () {
        var _this = this;
        this.builder = $().div(function (div) {
            // Eventing
            div.on(DOM.EventType.KEY_DOWN, function (e) {
                var keyboardEvent = new StandardKeyboardEvent(e);
                if (keyboardEvent.keyCode === 9 /* Escape */) {
                    DOM.EventHelper.stop(e, true);
                    _this.hide(HideReason.CANCELED);
                }
            })
                .on(DOM.EventType.CONTEXT_MENU, function (e) { return DOM.EventHelper.stop(e, true); }) // Do this to fix an issue on Mac where the menu goes into the way
                .on(DOM.EventType.FOCUS, function (e) { return _this.gainingFocus(); }, null, true)
                .on(DOM.EventType.BLUR, function (e) { return _this.loosingFocus(e); }, null, true);
            // Progress Bar
            _this.progressBar = _this._register(new ProgressBar(div.clone(), { progressBarBackground: _this.styles.progressBarBackground }));
            _this.progressBar.hide();
            // Input Field
            div.div({ 'class': 'quick-open-input' }, function (inputContainer) {
                _this.inputContainer = inputContainer;
                _this.inputBox = _this._register(new InputBox(inputContainer.getHTMLElement(), null, {
                    placeholder: _this.options.inputPlaceHolder || '',
                    ariaLabel: DEFAULT_INPUT_ARIA_LABEL,
                    inputBackground: _this.styles.inputBackground,
                    inputForeground: _this.styles.inputForeground,
                    inputBorder: _this.styles.inputBorder,
                    inputValidationInfoBackground: _this.styles.inputValidationInfoBackground,
                    inputValidationInfoBorder: _this.styles.inputValidationInfoBorder,
                    inputValidationWarningBackground: _this.styles.inputValidationWarningBackground,
                    inputValidationWarningBorder: _this.styles.inputValidationWarningBorder,
                    inputValidationErrorBackground: _this.styles.inputValidationErrorBackground,
                    inputValidationErrorBorder: _this.styles.inputValidationErrorBorder
                }));
                // ARIA
                _this.inputElement = _this.inputBox.inputElement;
                _this.inputElement.setAttribute('role', 'combobox');
                _this.inputElement.setAttribute('aria-haspopup', 'false');
                _this.inputElement.setAttribute('aria-autocomplete', 'list');
                DOM.addDisposableListener(_this.inputBox.inputElement, DOM.EventType.KEY_DOWN, function (e) {
                    var keyboardEvent = new StandardKeyboardEvent(e);
                    var shouldOpenInBackground = _this.shouldOpenInBackground(keyboardEvent);
                    // Do not handle Tab: It is used to navigate between elements without mouse
                    if (keyboardEvent.keyCode === 2 /* Tab */) {
                        return;
                    }
                    // Pass tree navigation keys to the tree but leave focus in input field
                    else if (keyboardEvent.keyCode === 18 /* DownArrow */ || keyboardEvent.keyCode === 16 /* UpArrow */ || keyboardEvent.keyCode === 12 /* PageDown */ || keyboardEvent.keyCode === 11 /* PageUp */) {
                        DOM.EventHelper.stop(e, true);
                        _this.navigateInTree(keyboardEvent.keyCode, keyboardEvent.shiftKey);
                        // Position cursor at the end of input to allow right arrow (open in background)
                        // to function immediately unless the user has made a selection
                        if (_this.inputBox.inputElement.selectionStart === _this.inputBox.inputElement.selectionEnd) {
                            _this.inputBox.inputElement.selectionStart = _this.inputBox.value.length;
                        }
                    }
                    // Select element on Enter or on Arrow-Right if we are at the end of the input
                    else if (keyboardEvent.keyCode === 3 /* Enter */ || shouldOpenInBackground) {
                        DOM.EventHelper.stop(e, true);
                        var focus_1 = _this.tree.getFocus();
                        if (focus_1) {
                            _this.elementSelected(focus_1, e, shouldOpenInBackground ? Mode.OPEN_IN_BACKGROUND : Mode.OPEN);
                        }
                    }
                });
                DOM.addDisposableListener(_this.inputBox.inputElement, DOM.EventType.INPUT, function (e) {
                    _this.onType();
                });
            });
            // Tree
            _this.treeContainer = div.div({
                'class': 'quick-open-tree'
            }, function (div) {
                var createTree = _this.options.treeCreator || (function (container, config, opts) { return new Tree(container, config, opts); });
                _this.tree = _this._register(createTree(div.getHTMLElement(), {
                    dataSource: new DataSource(_this),
                    controller: new QuickOpenController({ clickBehavior: ClickBehavior.ON_MOUSE_UP, keyboardSupport: _this.options.keyboardSupport }),
                    renderer: (_this.renderer = new Renderer(_this, _this.styles)),
                    filter: new Filter(_this),
                    accessibilityProvider: new AccessibilityProvider(_this)
                }, {
                    twistiePixels: 11,
                    indentPixels: 0,
                    alwaysFocused: true,
                    verticalScrollMode: ScrollbarVisibility.Visible,
                    horizontalScrollMode: ScrollbarVisibility.Hidden,
                    ariaLabel: nls.localize('treeAriaLabel', "Quick Picker"),
                    keyboardSupport: _this.options.keyboardSupport,
                    preventRootFocus: true
                }));
                _this.treeElement = _this.tree.getHTMLElement();
                // Handle Focus and Selection event
                _this._register(_this.tree.onDidChangeFocus(function (event) {
                    _this.elementFocused(event.focus, event);
                }));
                _this._register(_this.tree.onDidChangeSelection(function (event) {
                    if (event.selection && event.selection.length > 0) {
                        var mouseEvent = event.payload && event.payload.originalEvent instanceof StandardMouseEvent ? event.payload.originalEvent : void 0;
                        var shouldOpenInBackground = mouseEvent ? _this.shouldOpenInBackground(mouseEvent) : false;
                        _this.elementSelected(event.selection[0], event, shouldOpenInBackground ? Mode.OPEN_IN_BACKGROUND : Mode.OPEN);
                    }
                }));
            }).
                on(DOM.EventType.KEY_DOWN, function (e) {
                var keyboardEvent = new StandardKeyboardEvent(e);
                // Only handle when in quick navigation mode
                if (!_this.quickNavigateConfiguration) {
                    return;
                }
                // Support keyboard navigation in quick navigation mode
                if (keyboardEvent.keyCode === 18 /* DownArrow */ || keyboardEvent.keyCode === 16 /* UpArrow */ || keyboardEvent.keyCode === 12 /* PageDown */ || keyboardEvent.keyCode === 11 /* PageUp */) {
                    DOM.EventHelper.stop(e, true);
                    _this.navigateInTree(keyboardEvent.keyCode);
                }
            }).
                on(DOM.EventType.KEY_UP, function (e) {
                var keyboardEvent = new StandardKeyboardEvent(e);
                var keyCode = keyboardEvent.keyCode;
                // Only handle when in quick navigation mode
                if (!_this.quickNavigateConfiguration) {
                    return;
                }
                // Select element when keys are pressed that signal it
                var quickNavKeys = _this.quickNavigateConfiguration.keybindings;
                var wasTriggerKeyPressed = keyCode === 3 /* Enter */ || quickNavKeys.some(function (k) {
                    var _a = k.getParts(), firstPart = _a[0], chordPart = _a[1];
                    if (chordPart) {
                        return false;
                    }
                    if (firstPart.shiftKey && keyCode === 4 /* Shift */) {
                        if (keyboardEvent.ctrlKey || keyboardEvent.altKey || keyboardEvent.metaKey) {
                            return false; // this is an optimistic check for the shift key being used to navigate back in quick open
                        }
                        return true;
                    }
                    if (firstPart.altKey && keyCode === 6 /* Alt */) {
                        return true;
                    }
                    if (firstPart.ctrlKey && keyCode === 5 /* Ctrl */) {
                        return true;
                    }
                    if (firstPart.metaKey && keyCode === 57 /* Meta */) {
                        return true;
                    }
                    return false;
                });
                if (wasTriggerKeyPressed) {
                    var focus_2 = _this.tree.getFocus();
                    if (focus_2) {
                        _this.elementSelected(focus_2, e);
                    }
                }
            }).
                clone();
        })
            // Widget Attributes
            .addClass('monaco-quick-open-widget')
            .build(this.container);
        // Support layout
        if (this.layoutDimensions) {
            this.layout(this.layoutDimensions);
        }
        this.applyStyles();
        // Allows focus to switch to next/previous entry after tab into an actionbar item
        DOM.addDisposableListener(this.treeContainer.getHTMLElement(), DOM.EventType.KEY_DOWN, function (e) {
            var keyboardEvent = new StandardKeyboardEvent(e);
            // Only handle when not in quick navigation mode
            if (_this.quickNavigateConfiguration) {
                return;
            }
            if (keyboardEvent.keyCode === 18 /* DownArrow */ || keyboardEvent.keyCode === 16 /* UpArrow */ || keyboardEvent.keyCode === 12 /* PageDown */ || keyboardEvent.keyCode === 11 /* PageUp */) {
                DOM.EventHelper.stop(e, true);
                _this.navigateInTree(keyboardEvent.keyCode, keyboardEvent.shiftKey);
                _this.inputBox.inputElement.focus();
            }
        });
        return this.builder.getHTMLElement();
    };
    QuickOpenWidget.prototype.style = function (styles) {
        this.styles = styles;
        this.applyStyles();
    };
    QuickOpenWidget.prototype.applyStyles = function () {
        if (this.builder) {
            var foreground = this.styles.foreground ? this.styles.foreground.toString() : null;
            var background = this.styles.background ? this.styles.background.toString() : null;
            var borderColor = this.styles.borderColor ? this.styles.borderColor.toString() : null;
            var widgetShadow = this.styles.widgetShadow ? this.styles.widgetShadow.toString() : null;
            this.builder.style('color', foreground);
            this.builder.style('background-color', background);
            this.builder.style('border-color', borderColor);
            this.builder.style('border-width', borderColor ? '1px' : null);
            this.builder.style('border-style', borderColor ? 'solid' : null);
            this.builder.style('box-shadow', widgetShadow ? "0 5px 8px " + widgetShadow : null);
        }
        if (this.progressBar) {
            this.progressBar.style({
                progressBarBackground: this.styles.progressBarBackground
            });
        }
        if (this.inputBox) {
            this.inputBox.style({
                inputBackground: this.styles.inputBackground,
                inputForeground: this.styles.inputForeground,
                inputBorder: this.styles.inputBorder,
                inputValidationInfoBackground: this.styles.inputValidationInfoBackground,
                inputValidationInfoBorder: this.styles.inputValidationInfoBorder,
                inputValidationWarningBackground: this.styles.inputValidationWarningBackground,
                inputValidationWarningBorder: this.styles.inputValidationWarningBorder,
                inputValidationErrorBackground: this.styles.inputValidationErrorBackground,
                inputValidationErrorBorder: this.styles.inputValidationErrorBorder
            });
        }
        if (this.tree && !this.options.treeCreator) {
            this.tree.style(this.styles);
        }
        if (this.renderer) {
            this.renderer.updateStyles(this.styles);
        }
    };
    QuickOpenWidget.prototype.shouldOpenInBackground = function (e) {
        // Keyboard
        if (e instanceof StandardKeyboardEvent) {
            if (e.keyCode !== 17 /* RightArrow */) {
                return false; // only for right arrow
            }
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
                return false; // no modifiers allowed
            }
            // validate the cursor is at the end of the input and there is no selection,
            // and if not prevent opening in the background such as the selection can be changed
            var element = this.inputBox.inputElement;
            return element.selectionEnd === this.inputBox.value.length && element.selectionStart === element.selectionEnd;
        }
        // Mouse
        return e.middleButton;
    };
    QuickOpenWidget.prototype.onType = function () {
        var value = this.inputBox.value;
        // Adjust help text as needed if present
        if (this.helpText) {
            if (value) {
                this.helpText.hide();
            }
            else {
                this.helpText.show();
            }
        }
        // Send to callbacks
        this.callbacks.onType(value);
    };
    QuickOpenWidget.prototype.navigate = function (next, quickNavigate) {
        if (this.isVisible()) {
            // Transition into quick navigate mode if not yet done
            if (!this.quickNavigateConfiguration && quickNavigate) {
                this.quickNavigateConfiguration = quickNavigate;
                this.tree.domFocus();
            }
            // Navigate
            this.navigateInTree(next ? 18 /* DownArrow */ : 16 /* UpArrow */);
        }
    };
    QuickOpenWidget.prototype.navigateInTree = function (keyCode, isShift) {
        var model = this.tree.getInput();
        var entries = model ? model.entries : [];
        var oldFocus = this.tree.getFocus();
        // Normal Navigation
        switch (keyCode) {
            case 18 /* DownArrow */:
                this.tree.focusNext();
                break;
            case 16 /* UpArrow */:
                this.tree.focusPrevious();
                break;
            case 12 /* PageDown */:
                this.tree.focusNextPage();
                break;
            case 11 /* PageUp */:
                this.tree.focusPreviousPage();
                break;
            case 2 /* Tab */:
                if (isShift) {
                    this.tree.focusPrevious();
                }
                else {
                    this.tree.focusNext();
                }
                break;
        }
        var newFocus = this.tree.getFocus();
        // Support cycle-through navigation if focus did not change
        if (entries.length > 1 && oldFocus === newFocus) {
            // Up from no entry or first entry goes down to last
            if (keyCode === 16 /* UpArrow */ || (keyCode === 2 /* Tab */ && isShift)) {
                this.tree.focusLast();
            }
            // Down from last entry goes to up to first
            else if (keyCode === 18 /* DownArrow */ || keyCode === 2 /* Tab */ && !isShift) {
                this.tree.focusFirst();
            }
        }
        // Reveal
        newFocus = this.tree.getFocus();
        if (newFocus) {
            this.tree.reveal(newFocus).done(null, errors.onUnexpectedError);
        }
    };
    QuickOpenWidget.prototype.elementFocused = function (value, event) {
        if (!value || !this.isVisible()) {
            return;
        }
        // ARIA
        this.inputElement.setAttribute('aria-activedescendant', this.treeElement.getAttribute('aria-activedescendant'));
        var context = { event: event, keymods: this.extractKeyMods(event), quickNavigateConfiguration: this.quickNavigateConfiguration };
        this.model.runner.run(value, Mode.PREVIEW, context);
    };
    QuickOpenWidget.prototype.elementSelected = function (value, event, preferredMode) {
        var hide = true;
        // Trigger open of element on selection
        if (this.isVisible()) {
            var mode = preferredMode || Mode.OPEN;
            var context = { event: event, keymods: this.extractKeyMods(event), quickNavigateConfiguration: this.quickNavigateConfiguration };
            hide = this.model.runner.run(value, mode, context);
        }
        // Hide if command was run successfully
        if (hide) {
            this.hide(HideReason.ELEMENT_SELECTED);
        }
    };
    QuickOpenWidget.prototype.extractKeyMods = function (event) {
        return {
            ctrlCmd: event && (event.ctrlKey || event.metaKey || (event.payload && event.payload.originalEvent && (event.payload.originalEvent.ctrlKey || event.payload.originalEvent.metaKey))),
            alt: event && (event.altKey || (event.payload && event.payload.originalEvent && event.payload.originalEvent.altKey))
        };
    };
    QuickOpenWidget.prototype.show = function (param, options) {
        this.visible = true;
        this.isLoosingFocus = false;
        this.quickNavigateConfiguration = options ? options.quickNavigateConfiguration : void 0;
        // Adjust UI for quick navigate mode
        if (this.quickNavigateConfiguration) {
            this.inputContainer.hide();
            this.builder.show();
            this.tree.domFocus();
        }
        // Otherwise use normal UI
        else {
            this.inputContainer.show();
            this.builder.show();
            this.inputBox.focus();
        }
        // Adjust Help text for IE
        if (this.helpText) {
            if (this.quickNavigateConfiguration || types.isString(param)) {
                this.helpText.hide();
            }
            else {
                this.helpText.show();
            }
        }
        // Show based on param
        if (types.isString(param)) {
            this.doShowWithPrefix(param);
        }
        else {
            this.doShowWithInput(param, options && options.autoFocus ? options.autoFocus : {});
        }
        // Respect selectAll option
        if (options && options.inputSelection && !this.quickNavigateConfiguration) {
            this.inputBox.select(options.inputSelection);
        }
        if (this.callbacks.onShow) {
            this.callbacks.onShow();
        }
    };
    QuickOpenWidget.prototype.doShowWithPrefix = function (prefix) {
        this.inputBox.value = prefix;
        this.callbacks.onType(prefix);
    };
    QuickOpenWidget.prototype.doShowWithInput = function (input, autoFocus) {
        this.setInput(input, autoFocus);
    };
    QuickOpenWidget.prototype.setInputAndLayout = function (input, autoFocus) {
        var _this = this;
        this.treeContainer.style({ height: this.getHeight(input) + "px" });
        this.tree.setInput(null).then(function () {
            _this.model = input;
            // ARIA
            _this.inputElement.setAttribute('aria-haspopup', String(input && input.entries && input.entries.length > 0));
            return _this.tree.setInput(input);
        }).done(function () {
            // Indicate entries to tree
            _this.tree.layout();
            // Handle auto focus
            if (input && input.entries.some(function (e) { return _this.isElementVisible(input, e); })) {
                _this.autoFocus(input, autoFocus);
            }
        }, errors.onUnexpectedError);
    };
    QuickOpenWidget.prototype.isElementVisible = function (input, e) {
        if (!input.filter) {
            return true;
        }
        return input.filter.isVisible(e);
    };
    QuickOpenWidget.prototype.autoFocus = function (input, autoFocus) {
        var _this = this;
        if (autoFocus === void 0) { autoFocus = {}; }
        var entries = input.entries.filter(function (e) { return _this.isElementVisible(input, e); });
        // First check for auto focus of prefix matches
        if (autoFocus.autoFocusPrefixMatch) {
            var caseSensitiveMatch = void 0;
            var caseInsensitiveMatch = void 0;
            var prefix = autoFocus.autoFocusPrefixMatch;
            var lowerCasePrefix = prefix.toLowerCase();
            for (var i = 0; i < entries.length; i++) {
                var entry = entries[i];
                var label = input.dataSource.getLabel(entry);
                if (!caseSensitiveMatch && label.indexOf(prefix) === 0) {
                    caseSensitiveMatch = entry;
                }
                else if (!caseInsensitiveMatch && label.toLowerCase().indexOf(lowerCasePrefix) === 0) {
                    caseInsensitiveMatch = entry;
                }
                if (caseSensitiveMatch && caseInsensitiveMatch) {
                    break;
                }
            }
            var entryToFocus = caseSensitiveMatch || caseInsensitiveMatch;
            if (entryToFocus) {
                this.tree.setFocus(entryToFocus);
                this.tree.reveal(entryToFocus, 0.5).done(null, errors.onUnexpectedError);
                return;
            }
        }
        // Second check for auto focus of first entry
        if (autoFocus.autoFocusFirstEntry) {
            this.tree.focusFirst();
            this.tree.reveal(this.tree.getFocus()).done(null, errors.onUnexpectedError);
        }
        // Third check for specific index option
        else if (typeof autoFocus.autoFocusIndex === 'number') {
            if (entries.length > autoFocus.autoFocusIndex) {
                this.tree.focusNth(autoFocus.autoFocusIndex);
                this.tree.reveal(this.tree.getFocus()).done(null, errors.onUnexpectedError);
            }
        }
        // Check for auto focus of second entry
        else if (autoFocus.autoFocusSecondEntry) {
            if (entries.length > 1) {
                this.tree.focusNth(1);
            }
        }
        // Finally check for auto focus of last entry
        else if (autoFocus.autoFocusLastEntry) {
            if (entries.length > 1) {
                this.tree.focusLast();
            }
        }
    };
    QuickOpenWidget.prototype.refresh = function (input, autoFocus) {
        var _this = this;
        if (!this.isVisible()) {
            return;
        }
        if (!input) {
            input = this.tree.getInput();
        }
        if (!input) {
            return;
        }
        // Apply height & Refresh
        this.treeContainer.style({ height: this.getHeight(input) + "px" });
        this.tree.refresh().done(function () {
            // Indicate entries to tree
            _this.tree.layout();
            // Handle auto focus
            if (autoFocus) {
                var doAutoFocus = autoFocus && input && input.entries.some(function (e) { return _this.isElementVisible(input, e); });
                if (doAutoFocus) {
                    _this.autoFocus(input, autoFocus);
                }
            }
        }, errors.onUnexpectedError);
    };
    QuickOpenWidget.prototype.getHeight = function (input) {
        var _this = this;
        var renderer = input.renderer;
        if (!input) {
            var itemHeight = renderer.getHeight(null);
            return this.options.minItemsToShow ? this.options.minItemsToShow * itemHeight : 0;
        }
        var height = 0;
        var preferredItemsHeight;
        if (this.layoutDimensions && this.layoutDimensions.height) {
            preferredItemsHeight = (this.layoutDimensions.height - 50 /* subtract height of input field (30px) and some spacing (drop shadow) to fit */) * 0.40 /* max 40% of screen */;
        }
        if (!preferredItemsHeight || preferredItemsHeight > QuickOpenWidget.MAX_ITEMS_HEIGHT) {
            preferredItemsHeight = QuickOpenWidget.MAX_ITEMS_HEIGHT;
        }
        var entries = input.entries.filter(function (e) { return _this.isElementVisible(input, e); });
        var maxEntries = this.options.maxItemsToShow || entries.length;
        for (var i = 0; i < maxEntries && i < entries.length; i++) {
            var entryHeight = renderer.getHeight(entries[i]);
            if (height + entryHeight <= preferredItemsHeight) {
                height += entryHeight;
            }
            else {
                break;
            }
        }
        return height;
    };
    QuickOpenWidget.prototype.hide = function (reason) {
        if (!this.isVisible()) {
            return;
        }
        this.visible = false;
        this.builder.hide();
        this.builder.domBlur();
        // Clear input field and clear tree
        this.inputBox.value = '';
        this.tree.setInput(null);
        // ARIA
        this.inputElement.setAttribute('aria-haspopup', 'false');
        // Reset Tree Height
        this.treeContainer.style({ height: (this.options.minItemsToShow ? this.options.minItemsToShow * 22 : 0) + 'px' });
        // Clear any running Progress
        this.progressBar.stop().hide();
        // Clear Focus
        if (this.tree.isDOMFocused()) {
            this.tree.domBlur();
        }
        else if (this.inputBox.hasFocus()) {
            this.inputBox.blur();
        }
        // Callbacks
        if (reason === HideReason.ELEMENT_SELECTED) {
            this.callbacks.onOk();
        }
        else {
            this.callbacks.onCancel();
        }
        if (this.callbacks.onHide) {
            this.callbacks.onHide(reason);
        }
    };
    QuickOpenWidget.prototype.getQuickNavigateConfiguration = function () {
        return this.quickNavigateConfiguration;
    };
    QuickOpenWidget.prototype.setPlaceHolder = function (placeHolder) {
        if (this.inputBox) {
            this.inputBox.setPlaceHolder(placeHolder);
        }
    };
    QuickOpenWidget.prototype.setValue = function (value, selectionOrStableHint) {
        if (this.inputBox) {
            this.inputBox.value = value;
            if (selectionOrStableHint === null) {
                // null means stable-selection
            }
            else if (Array.isArray(selectionOrStableHint)) {
                var start = selectionOrStableHint[0], end = selectionOrStableHint[1];
                this.inputBox.select({ start: start, end: end });
            }
            else {
                this.inputBox.select();
            }
        }
    };
    QuickOpenWidget.prototype.setPassword = function (isPassword) {
        if (this.inputBox) {
            this.inputBox.inputElement.type = isPassword ? 'password' : 'text';
        }
    };
    QuickOpenWidget.prototype.setInput = function (input, autoFocus, ariaLabel) {
        if (!this.isVisible()) {
            return;
        }
        // If the input changes, indicate this to the tree
        if (!!this.getInput()) {
            this.onInputChanging();
        }
        // Adapt tree height to entries and apply input
        this.setInputAndLayout(input, autoFocus);
        // Apply ARIA
        if (this.inputBox) {
            this.inputBox.setAriaLabel(ariaLabel || DEFAULT_INPUT_ARIA_LABEL);
        }
    };
    QuickOpenWidget.prototype.onInputChanging = function () {
        var _this = this;
        if (this.inputChangingTimeoutHandle) {
            clearTimeout(this.inputChangingTimeoutHandle);
            this.inputChangingTimeoutHandle = null;
        }
        // when the input is changing in quick open, we indicate this as CSS class to the widget
        // for a certain timeout. this helps reducing some hectic UI updates when input changes quickly
        this.builder.addClass('content-changing');
        this.inputChangingTimeoutHandle = setTimeout(function () {
            _this.builder.removeClass('content-changing');
        }, 500);
    };
    QuickOpenWidget.prototype.getInput = function () {
        return this.tree.getInput();
    };
    QuickOpenWidget.prototype.showInputDecoration = function (decoration) {
        if (this.inputBox) {
            this.inputBox.showMessage({ type: decoration === Severity.Info ? MessageType.INFO : decoration === Severity.Warning ? MessageType.WARNING : MessageType.ERROR, content: '' });
        }
    };
    QuickOpenWidget.prototype.clearInputDecoration = function () {
        if (this.inputBox) {
            this.inputBox.hideMessage();
        }
    };
    QuickOpenWidget.prototype.focus = function () {
        if (this.isVisible() && this.inputBox) {
            this.inputBox.focus();
        }
    };
    QuickOpenWidget.prototype.accept = function () {
        if (this.isVisible()) {
            var focus_3 = this.tree.getFocus();
            if (focus_3) {
                this.elementSelected(focus_3);
            }
        }
    };
    QuickOpenWidget.prototype.getProgressBar = function () {
        return this.progressBar;
    };
    QuickOpenWidget.prototype.getInputBox = function () {
        return this.inputBox;
    };
    QuickOpenWidget.prototype.setExtraClass = function (clazz) {
        var previousClass = this.builder.getProperty('extra-class');
        if (previousClass) {
            this.builder.removeClass(previousClass);
        }
        if (clazz) {
            this.builder.addClass(clazz);
            this.builder.setProperty('extra-class', clazz);
        }
        else if (previousClass) {
            this.builder.removeProperty('extra-class');
        }
    };
    QuickOpenWidget.prototype.isVisible = function () {
        return this.visible;
    };
    QuickOpenWidget.prototype.layout = function (dimension) {
        this.layoutDimensions = dimension;
        // Apply to quick open width (height is dynamic by number of items to show)
        var quickOpenWidth = Math.min(this.layoutDimensions.width * 0.62 /* golden cut */, QuickOpenWidget.MAX_WIDTH);
        if (this.builder) {
            // quick open
            this.builder.style({
                width: quickOpenWidth + 'px',
                marginLeft: '-' + (quickOpenWidth / 2) + 'px'
            });
            // input field
            this.inputContainer.style({
                width: (quickOpenWidth - 12) + 'px'
            });
        }
    };
    QuickOpenWidget.prototype.gainingFocus = function () {
        this.isLoosingFocus = false;
    };
    QuickOpenWidget.prototype.loosingFocus = function (e) {
        var _this = this;
        if (!this.isVisible()) {
            return;
        }
        var relatedTarget = e.relatedTarget;
        if (!this.quickNavigateConfiguration && DOM.isAncestor(relatedTarget, this.builder.getHTMLElement())) {
            return; // user clicked somewhere into quick open widget, do not close thereby
        }
        this.isLoosingFocus = true;
        TPromise.timeout(0).then(function () {
            if (!_this.isLoosingFocus) {
                return;
            }
            if (_this.isDisposed) {
                return;
            }
            var veto = _this.callbacks.onFocusLost && _this.callbacks.onFocusLost();
            if (!veto) {
                _this.hide(HideReason.FOCUS_LOST);
            }
        });
    };
    QuickOpenWidget.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this.isDisposed = true;
    };
    QuickOpenWidget.MAX_WIDTH = 600; // Max total width of quick open widget
    QuickOpenWidget.MAX_ITEMS_HEIGHT = 20 * 22; // Max height of item list below input field
    return QuickOpenWidget;
}(Disposable));
export { QuickOpenWidget };
