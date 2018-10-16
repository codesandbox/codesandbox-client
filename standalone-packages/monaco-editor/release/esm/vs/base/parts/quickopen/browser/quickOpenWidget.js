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
import './quickopen.css';
import * as nls from '../../../../nls.js';
import * as platform from '../../../common/platform.js';
import * as types from '../../../common/types.js';
import { Filter, Renderer, DataSource, AccessibilityProvider } from './quickOpenViewer.js';
import { InputBox } from '../../../browser/ui/inputbox/inputBox.js';
import Severity from '../../../common/severity.js';
import { Tree } from '../../tree/browser/treeImpl.js';
import { ProgressBar } from '../../../browser/ui/progressbar/progressbar.js';
import { StandardKeyboardEvent } from '../../../browser/keyboardEvent.js';
import { DefaultController } from '../../tree/browser/treeDefaults.js';
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
    QuickOpenController.prototype.onMouseMiddleClick = function (tree, element, event) {
        return this.onLeftClick(tree, element, event);
    };
    return QuickOpenController;
}(DefaultController));
export { QuickOpenController };
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
        return this.element;
    };
    QuickOpenWidget.prototype.getModel = function () {
        return this.model;
    };
    QuickOpenWidget.prototype.setCallbacks = function (callbacks) {
        this.callbacks = callbacks;
    };
    QuickOpenWidget.prototype.create = function () {
        var _this = this;
        // Container
        this.element = document.createElement('div');
        DOM.addClass(this.element, 'monaco-quick-open-widget');
        this.container.appendChild(this.element);
        this._register(DOM.addDisposableListener(this.element, DOM.EventType.CONTEXT_MENU, function (e) { return DOM.EventHelper.stop(e, true); })); // Do this to fix an issue on Mac where the menu goes into the way
        this._register(DOM.addDisposableListener(this.element, DOM.EventType.FOCUS, function (e) { return _this.gainingFocus(); }, true));
        this._register(DOM.addDisposableListener(this.element, DOM.EventType.BLUR, function (e) { return _this.loosingFocus(e); }, true));
        this._register(DOM.addDisposableListener(this.element, DOM.EventType.KEY_DOWN, function (e) {
            var keyboardEvent = new StandardKeyboardEvent(e);
            if (keyboardEvent.keyCode === 9 /* Escape */) {
                DOM.EventHelper.stop(e, true);
                _this.hide(2 /* CANCELED */);
            }
            else if (keyboardEvent.keyCode === 2 /* Tab */ && !keyboardEvent.altKey && !keyboardEvent.ctrlKey && !keyboardEvent.metaKey) {
                var stops = e.currentTarget.querySelectorAll('input, .monaco-tree, .monaco-tree-row.focused .action-label.icon');
                if (keyboardEvent.shiftKey && keyboardEvent.target === stops[0]) {
                    DOM.EventHelper.stop(e, true);
                    stops[stops.length - 1].focus();
                }
                else if (!keyboardEvent.shiftKey && keyboardEvent.target === stops[stops.length - 1]) {
                    DOM.EventHelper.stop(e, true);
                    stops[0].focus();
                }
            }
        }));
        // Progress Bar
        this.progressBar = this._register(new ProgressBar(this.element, { progressBarBackground: this.styles.progressBarBackground }));
        this.progressBar.hide();
        // Input Field
        this.inputContainer = document.createElement('div');
        DOM.addClass(this.inputContainer, 'quick-open-input');
        this.element.appendChild(this.inputContainer);
        this.inputBox = this._register(new InputBox(this.inputContainer, null, {
            placeholder: this.options.inputPlaceHolder || '',
            ariaLabel: DEFAULT_INPUT_ARIA_LABEL,
            inputBackground: this.styles.inputBackground,
            inputForeground: this.styles.inputForeground,
            inputBorder: this.styles.inputBorder,
            inputValidationInfoBackground: this.styles.inputValidationInfoBackground,
            inputValidationInfoForeground: this.styles.inputValidationInfoForeground,
            inputValidationInfoBorder: this.styles.inputValidationInfoBorder,
            inputValidationWarningBackground: this.styles.inputValidationWarningBackground,
            inputValidationWarningForeground: this.styles.inputValidationWarningForeground,
            inputValidationWarningBorder: this.styles.inputValidationWarningBorder,
            inputValidationErrorBackground: this.styles.inputValidationErrorBackground,
            inputValidationErrorForeground: this.styles.inputValidationErrorForeground,
            inputValidationErrorBorder: this.styles.inputValidationErrorBorder
        }));
        this.inputElement = this.inputBox.inputElement;
        this.inputElement.setAttribute('role', 'combobox');
        this.inputElement.setAttribute('aria-haspopup', 'false');
        this.inputElement.setAttribute('aria-autocomplete', 'list');
        this._register(DOM.addDisposableListener(this.inputBox.inputElement, DOM.EventType.INPUT, function (e) { return _this.onType(); }));
        this._register(DOM.addDisposableListener(this.inputBox.inputElement, DOM.EventType.KEY_DOWN, function (e) {
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
                    _this.elementSelected(focus_1, e, shouldOpenInBackground ? 2 /* OPEN_IN_BACKGROUND */ : 1 /* OPEN */);
                }
            }
        }));
        // Result count for screen readers
        this.resultCount = document.createElement('div');
        DOM.addClass(this.resultCount, 'quick-open-result-count');
        this.resultCount.setAttribute('aria-live', 'polite');
        this.resultCount.setAttribute('aria-atomic', 'true');
        this.element.appendChild(this.resultCount);
        // Tree
        this.treeContainer = document.createElement('div');
        DOM.addClass(this.treeContainer, 'quick-open-tree');
        this.element.appendChild(this.treeContainer);
        var createTree = this.options.treeCreator || (function (container, config, opts) { return new Tree(container, config, opts); });
        this.tree = this._register(createTree(this.treeContainer, {
            dataSource: new DataSource(this),
            controller: new QuickOpenController({ clickBehavior: 1 /* ON_MOUSE_UP */, keyboardSupport: this.options.keyboardSupport }),
            renderer: (this.renderer = new Renderer(this, this.styles)),
            filter: new Filter(this),
            accessibilityProvider: new AccessibilityProvider(this)
        }, {
            twistiePixels: 11,
            indentPixels: 0,
            alwaysFocused: true,
            verticalScrollMode: ScrollbarVisibility.Visible,
            horizontalScrollMode: ScrollbarVisibility.Hidden,
            ariaLabel: nls.localize('treeAriaLabel', "Quick Picker"),
            keyboardSupport: this.options.keyboardSupport,
            preventRootFocus: false
        }));
        this.treeElement = this.tree.getHTMLElement();
        // Handle Focus and Selection event
        this._register(this.tree.onDidChangeFocus(function (event) {
            _this.elementFocused(event.focus, event);
        }));
        this._register(this.tree.onDidChangeSelection(function (event) {
            if (event.selection && event.selection.length > 0) {
                var mouseEvent = event.payload && event.payload.originalEvent instanceof StandardMouseEvent ? event.payload.originalEvent : void 0;
                var shouldOpenInBackground = mouseEvent ? _this.shouldOpenInBackground(mouseEvent) : false;
                _this.elementSelected(event.selection[0], event, shouldOpenInBackground ? 2 /* OPEN_IN_BACKGROUND */ : 1 /* OPEN */);
            }
        }));
        this._register(DOM.addDisposableListener(this.treeContainer, DOM.EventType.KEY_DOWN, function (e) {
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
        }));
        this._register(DOM.addDisposableListener(this.treeContainer, DOM.EventType.KEY_UP, function (e) {
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
        }));
        // Support layout
        if (this.layoutDimensions) {
            this.layout(this.layoutDimensions);
        }
        this.applyStyles();
        // Allows focus to switch to next/previous entry after tab into an actionbar item
        this._register(DOM.addDisposableListener(this.treeContainer, DOM.EventType.KEY_DOWN, function (e) {
            var keyboardEvent = new StandardKeyboardEvent(e);
            // Only handle when not in quick navigation mode
            if (_this.quickNavigateConfiguration) {
                return;
            }
            if (keyboardEvent.keyCode === 18 /* DownArrow */ || keyboardEvent.keyCode === 16 /* UpArrow */ || keyboardEvent.keyCode === 12 /* PageDown */ || keyboardEvent.keyCode === 11 /* PageUp */) {
                DOM.EventHelper.stop(e, true);
                _this.navigateInTree(keyboardEvent.keyCode, keyboardEvent.shiftKey);
                _this.treeElement.focus();
            }
        }));
        return this.element;
    };
    QuickOpenWidget.prototype.style = function (styles) {
        this.styles = styles;
        this.applyStyles();
    };
    QuickOpenWidget.prototype.applyStyles = function () {
        if (this.element) {
            var foreground = this.styles.foreground ? this.styles.foreground.toString() : null;
            var background = this.styles.background ? this.styles.background.toString() : null;
            var borderColor = this.styles.borderColor ? this.styles.borderColor.toString() : null;
            var widgetShadow = this.styles.widgetShadow ? this.styles.widgetShadow.toString() : null;
            this.element.style.color = foreground;
            this.element.style.backgroundColor = background;
            this.element.style.borderColor = borderColor;
            this.element.style.borderWidth = borderColor ? '1px' : null;
            this.element.style.borderStyle = borderColor ? 'solid' : null;
            this.element.style.boxShadow = widgetShadow ? "0 5px 8px " + widgetShadow : null;
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
                inputValidationInfoForeground: this.styles.inputValidationInfoForeground,
                inputValidationInfoBorder: this.styles.inputValidationInfoBorder,
                inputValidationWarningBackground: this.styles.inputValidationWarningBackground,
                inputValidationWarningForeground: this.styles.inputValidationWarningForeground,
                inputValidationWarningBorder: this.styles.inputValidationWarningBorder,
                inputValidationErrorBackground: this.styles.inputValidationErrorBackground,
                inputValidationErrorForeground: this.styles.inputValidationErrorForeground,
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
                DOM.hide(this.helpText);
            }
            else {
                DOM.show(this.helpText);
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
            this.tree.reveal(newFocus);
        }
    };
    QuickOpenWidget.prototype.elementFocused = function (value, event) {
        if (!value || !this.isVisible()) {
            return;
        }
        // ARIA
        this.inputElement.setAttribute('aria-activedescendant', this.treeElement.getAttribute('aria-activedescendant'));
        var context = { event: event, keymods: this.extractKeyMods(event), quickNavigateConfiguration: this.quickNavigateConfiguration };
        this.model.runner.run(value, 0 /* PREVIEW */, context);
    };
    QuickOpenWidget.prototype.elementSelected = function (value, event, preferredMode) {
        var hide = true;
        // Trigger open of element on selection
        if (this.isVisible()) {
            var mode = preferredMode || 1 /* OPEN */;
            var context = { event: event, keymods: this.extractKeyMods(event), quickNavigateConfiguration: this.quickNavigateConfiguration };
            hide = this.model.runner.run(value, mode, context);
        }
        // Hide if command was run successfully
        if (hide) {
            this.hide(0 /* ELEMENT_SELECTED */);
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
            DOM.hide(this.inputContainer);
            DOM.show(this.element);
            this.tree.domFocus();
        }
        // Otherwise use normal UI
        else {
            DOM.show(this.inputContainer);
            DOM.show(this.element);
            this.inputBox.focus();
        }
        // Adjust Help text for IE
        if (this.helpText) {
            if (this.quickNavigateConfiguration || types.isString(param)) {
                DOM.hide(this.helpText);
            }
            else {
                DOM.show(this.helpText);
            }
        }
        // Show based on param
        if (types.isString(param)) {
            this.doShowWithPrefix(param);
        }
        else {
            if (options.value) {
                this.restoreLastInput(options.value);
            }
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
    QuickOpenWidget.prototype.restoreLastInput = function (lastInput) {
        this.inputBox.value = lastInput;
        this.inputBox.select();
        this.callbacks.onType(lastInput);
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
        this.treeContainer.style.height = this.getHeight(input) + "px";
        this.tree.setInput(null).then(function () {
            _this.model = input;
            // ARIA
            _this.inputElement.setAttribute('aria-haspopup', String(input && input.entries && input.entries.length > 0));
            return _this.tree.setInput(input);
        }).then(function () {
            // Indicate entries to tree
            _this.tree.layout();
            var entries = input ? input.entries.filter(function (e) { return _this.isElementVisible(input, e); }) : [];
            _this.updateResultCount(entries.length);
            // Handle auto focus
            if (entries.length) {
                _this.autoFocus(input, entries, autoFocus);
            }
        });
    };
    QuickOpenWidget.prototype.isElementVisible = function (input, e) {
        if (!input.filter) {
            return true;
        }
        return input.filter.isVisible(e);
    };
    QuickOpenWidget.prototype.autoFocus = function (input, entries, autoFocus) {
        if (autoFocus === void 0) { autoFocus = {}; }
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
                this.tree.reveal(entryToFocus, 0.5);
                return;
            }
        }
        // Second check for auto focus of first entry
        if (autoFocus.autoFocusFirstEntry) {
            this.tree.focusFirst();
            this.tree.reveal(this.tree.getFocus());
        }
        // Third check for specific index option
        else if (typeof autoFocus.autoFocusIndex === 'number') {
            if (entries.length > autoFocus.autoFocusIndex) {
                this.tree.focusNth(autoFocus.autoFocusIndex);
                this.tree.reveal(this.tree.getFocus());
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
        this.treeContainer.style.height = this.getHeight(input) + "px";
        this.tree.refresh().then(function () {
            // Indicate entries to tree
            _this.tree.layout();
            var entries = input ? input.entries.filter(function (e) { return _this.isElementVisible(input, e); }) : [];
            _this.updateResultCount(entries.length);
            // Handle auto focus
            if (autoFocus) {
                if (entries.length) {
                    _this.autoFocus(input, entries, autoFocus);
                }
            }
        });
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
    QuickOpenWidget.prototype.updateResultCount = function (count) {
        this.resultCount.textContent = nls.localize({ key: 'quickInput.visibleCount', comment: ['This tells the user how many items are shown in a list of items to select from. The items can be anything. Currently not visible, but read by screen readers.'] }, "{0} Results", count);
    };
    QuickOpenWidget.prototype.hide = function (reason) {
        if (!this.isVisible()) {
            return;
        }
        this.visible = false;
        DOM.hide(this.element);
        this.element.blur();
        // Clear input field and clear tree
        this.inputBox.value = '';
        this.tree.setInput(null);
        // ARIA
        this.inputElement.setAttribute('aria-haspopup', 'false');
        // Reset Tree Height
        this.treeContainer.style.height = (this.options.minItemsToShow ? this.options.minItemsToShow * 22 : 0) + "px";
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
        if (reason === 0 /* ELEMENT_SELECTED */) {
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
        DOM.addClass(this.element, 'content-changing');
        this.inputChangingTimeoutHandle = setTimeout(function () {
            DOM.removeClass(_this.element, 'content-changing');
        }, 500);
    };
    QuickOpenWidget.prototype.getInput = function () {
        return this.tree.getInput();
    };
    QuickOpenWidget.prototype.showInputDecoration = function (decoration) {
        if (this.inputBox) {
            this.inputBox.showMessage({ type: decoration === Severity.Info ? 1 /* INFO */ : decoration === Severity.Warning ? 2 /* WARNING */ : 3 /* ERROR */, content: '' });
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
        var previousClass = this.element.getAttribute('quick-open-extra-class');
        if (previousClass) {
            DOM.removeClasses(this.element, previousClass);
        }
        if (clazz) {
            DOM.addClasses(this.element, clazz);
            this.element.setAttribute('quick-open-extra-class', clazz);
        }
        else if (previousClass) {
            this.element.removeAttribute('quick-open-extra-class');
        }
    };
    QuickOpenWidget.prototype.isVisible = function () {
        return this.visible;
    };
    QuickOpenWidget.prototype.layout = function (dimension) {
        this.layoutDimensions = dimension;
        // Apply to quick open width (height is dynamic by number of items to show)
        var quickOpenWidth = Math.min(this.layoutDimensions.width * 0.62 /* golden cut */, QuickOpenWidget.MAX_WIDTH);
        if (this.element) {
            // quick open
            this.element.style.width = quickOpenWidth + "px";
            this.element.style.marginLeft = "-" + quickOpenWidth / 2 + "px";
            // input field
            this.inputContainer.style.width = quickOpenWidth - 12 + "px";
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
        if (!this.quickNavigateConfiguration && DOM.isAncestor(relatedTarget, this.element)) {
            return; // user clicked somewhere into quick open widget, do not close thereby
        }
        this.isLoosingFocus = true;
        setTimeout(function () {
            if (!_this.isLoosingFocus || _this.isDisposed) {
                return;
            }
            var veto = _this.callbacks.onFocusLost && _this.callbacks.onFocusLost();
            if (!veto) {
                _this.hide(1 /* FOCUS_LOST */);
            }
        }, 0);
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
