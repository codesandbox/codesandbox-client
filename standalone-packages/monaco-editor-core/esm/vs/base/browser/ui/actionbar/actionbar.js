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
import './actionbar.css';
import * as platform from '../../../common/platform';
import * as nls from '../../../../nls';
import { Disposable, dispose } from '../../../common/lifecycle';
import { SelectBox } from '../selectBox/selectBox';
import { Action, ActionRunner } from '../../../common/actions';
import * as DOM from '../../dom';
import * as types from '../../../common/types';
import { EventType, Gesture } from '../../touch';
import { StandardKeyboardEvent } from '../../keyboardEvent';
import { Emitter } from '../../../common/event';
var BaseActionItem = /** @class */ (function (_super) {
    __extends(BaseActionItem, _super);
    function BaseActionItem(context, action, options) {
        var _this = _super.call(this) || this;
        _this.options = options;
        _this._context = context || _this;
        _this._action = action;
        if (action instanceof Action) {
            _this._register(action.onDidChange(function (event) {
                if (!_this.element) {
                    // we have not been rendered yet, so there
                    // is no point in updating the UI
                    return;
                }
                _this.handleActionChangeEvent(event);
            }));
        }
        return _this;
    }
    BaseActionItem.prototype.handleActionChangeEvent = function (event) {
        if (event.enabled !== void 0) {
            this.updateEnabled();
        }
        if (event.checked !== void 0) {
            this.updateChecked();
        }
        if (event.class !== void 0) {
            this.updateClass();
        }
        if (event.label !== void 0) {
            this.updateLabel();
            this.updateTooltip();
        }
        if (event.tooltip !== void 0) {
            this.updateTooltip();
        }
    };
    Object.defineProperty(BaseActionItem.prototype, "actionRunner", {
        get: function () {
            return this._actionRunner;
        },
        set: function (actionRunner) {
            this._actionRunner = actionRunner;
        },
        enumerable: true,
        configurable: true
    });
    BaseActionItem.prototype.getAction = function () {
        return this._action;
    };
    BaseActionItem.prototype.isEnabled = function () {
        return this._action.enabled;
    };
    BaseActionItem.prototype.setActionContext = function (newContext) {
        this._context = newContext;
    };
    BaseActionItem.prototype.render = function (container) {
        var _this = this;
        this.element = container;
        Gesture.addTarget(container);
        var enableDragging = this.options && this.options.draggable;
        if (enableDragging) {
            container.draggable = true;
        }
        this._register(DOM.addDisposableListener(this.element, EventType.Tap, function (e) { return _this.onClick(e); }));
        this._register(DOM.addDisposableListener(this.element, DOM.EventType.MOUSE_DOWN, function (e) {
            if (!enableDragging) {
                DOM.EventHelper.stop(e, true); // do not run when dragging is on because that would disable it
            }
            var mouseEvent = e;
            if (_this._action.enabled && mouseEvent.button === 0) {
                DOM.addClass(_this.element, 'active');
            }
        }));
        this._register(DOM.addDisposableListener(this.element, DOM.EventType.CLICK, function (e) {
            DOM.EventHelper.stop(e, true);
            // See https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Interact_with_the_clipboard
            // > Writing to the clipboard
            // > You can use the "cut" and "copy" commands without any special
            // permission if you are using them in a short-lived event handler
            // for a user action (for example, a click handler).
            // => to get the Copy and Paste context menu actions working on Firefox,
            // there should be no timeout here
            if (_this.options && _this.options.isMenu) {
                _this.onClick(e);
            }
            else {
                platform.setImmediate(function () { return _this.onClick(e); });
            }
        }));
        this._register(DOM.addDisposableListener(this.element, DOM.EventType.DBLCLICK, function (e) {
            DOM.EventHelper.stop(e, true);
        }));
        [DOM.EventType.MOUSE_UP, DOM.EventType.MOUSE_OUT].forEach(function (event) {
            _this._register(DOM.addDisposableListener(_this.element, event, function (e) {
                DOM.EventHelper.stop(e);
                DOM.removeClass(_this.element, 'active');
            }));
        });
    };
    BaseActionItem.prototype.onClick = function (event) {
        DOM.EventHelper.stop(event, true);
        var context;
        if (types.isUndefinedOrNull(this._context)) {
            context = event;
        }
        else {
            context = this._context;
            if (types.isObject(context)) {
                context.event = event;
            }
        }
        this._actionRunner.run(this._action, context);
    };
    BaseActionItem.prototype.focus = function () {
        if (this.element) {
            this.element.focus();
            DOM.addClass(this.element, 'focused');
        }
    };
    BaseActionItem.prototype.blur = function () {
        if (this.element) {
            this.element.blur();
            DOM.removeClass(this.element, 'focused');
        }
    };
    BaseActionItem.prototype.updateEnabled = function () {
        // implement in subclass
    };
    BaseActionItem.prototype.updateLabel = function () {
        // implement in subclass
    };
    BaseActionItem.prototype.updateTooltip = function () {
        // implement in subclass
    };
    BaseActionItem.prototype.updateClass = function () {
        // implement in subclass
    };
    BaseActionItem.prototype.updateChecked = function () {
        // implement in subclass
    };
    BaseActionItem.prototype.dispose = function () {
        if (this.element) {
            this.element.remove();
            this.element = null;
        }
        _super.prototype.dispose.call(this);
    };
    return BaseActionItem;
}(Disposable));
export { BaseActionItem };
var Separator = /** @class */ (function (_super) {
    __extends(Separator, _super);
    function Separator(label) {
        var _this = _super.call(this, Separator.ID, label, label ? 'separator text' : 'separator') || this;
        _this.checked = false;
        _this.radio = false;
        _this.enabled = false;
        return _this;
    }
    Separator.ID = 'vs.actions.separator';
    return Separator;
}(Action));
export { Separator };
var ActionItem = /** @class */ (function (_super) {
    __extends(ActionItem, _super);
    function ActionItem(context, action, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, context, action, options) || this;
        _this.options = options;
        _this.options.icon = options.icon !== undefined ? options.icon : false;
        _this.options.label = options.label !== undefined ? options.label : true;
        _this.cssClass = '';
        return _this;
    }
    ActionItem.prototype.render = function (container) {
        _super.prototype.render.call(this, container);
        this.label = DOM.append(this.element, DOM.$('a.action-label'));
        if (this._action.id === Separator.ID) {
            this.label.setAttribute('role', 'presentation'); // A separator is a presentation item
        }
        else {
            if (this.options.isMenu) {
                this.label.setAttribute('role', 'menuitem');
            }
            else {
                this.label.setAttribute('role', 'button');
            }
        }
        if (this.options.label && this.options.keybinding) {
            DOM.append(this.element, DOM.$('span.keybinding')).textContent = this.options.keybinding;
        }
        this.updateClass();
        this.updateLabel();
        this.updateTooltip();
        this.updateEnabled();
        this.updateChecked();
    };
    ActionItem.prototype.focus = function () {
        _super.prototype.focus.call(this);
        this.label.focus();
    };
    ActionItem.prototype.updateLabel = function () {
        if (this.options.label) {
            this.label.textContent = this.getAction().label;
        }
    };
    ActionItem.prototype.updateTooltip = function () {
        var title = null;
        if (this.getAction().tooltip) {
            title = this.getAction().tooltip;
        }
        else if (!this.options.label && this.getAction().label && this.options.icon) {
            title = this.getAction().label;
            if (this.options.keybinding) {
                title = nls.localize({ key: 'titleLabel', comment: ['action title', 'action keybinding'] }, "{0} ({1})", title, this.options.keybinding);
            }
        }
        if (title) {
            this.label.title = title;
        }
    };
    ActionItem.prototype.updateClass = function () {
        if (this.cssClass) {
            DOM.removeClasses(this.label, this.cssClass);
        }
        if (this.options.icon) {
            this.cssClass = this.getAction().class;
            DOM.addClass(this.label, 'icon');
            if (this.cssClass) {
                DOM.addClasses(this.label, this.cssClass);
            }
            this.updateEnabled();
        }
        else {
            DOM.removeClass(this.label, 'icon');
        }
    };
    ActionItem.prototype.updateEnabled = function () {
        if (this.getAction().enabled) {
            this.label.removeAttribute('aria-disabled');
            DOM.removeClass(this.element, 'disabled');
            DOM.removeClass(this.label, 'disabled');
            this.label.tabIndex = 0;
        }
        else {
            this.label.setAttribute('aria-disabled', 'true');
            DOM.addClass(this.element, 'disabled');
            DOM.addClass(this.label, 'disabled');
            DOM.removeTabIndexAndUpdateFocus(this.label);
        }
    };
    ActionItem.prototype.updateChecked = function () {
        if (this.getAction().checked) {
            DOM.addClass(this.label, 'checked');
        }
        else {
            DOM.removeClass(this.label, 'checked');
        }
    };
    return ActionItem;
}(BaseActionItem));
export { ActionItem };
var defaultOptions = {
    orientation: 0 /* HORIZONTAL */,
    context: null
};
var ActionBar = /** @class */ (function (_super) {
    __extends(ActionBar, _super);
    function ActionBar(container, options) {
        if (options === void 0) { options = defaultOptions; }
        var _this = _super.call(this) || this;
        _this._onDidBlur = _this._register(new Emitter());
        _this._onDidCancel = _this._register(new Emitter());
        _this._onDidRun = _this._register(new Emitter());
        _this._onDidBeforeRun = _this._register(new Emitter());
        _this.options = options;
        _this._context = options.context;
        _this._actionRunner = _this.options.actionRunner;
        if (!_this._actionRunner) {
            _this._actionRunner = new ActionRunner();
            _this._register(_this._actionRunner);
        }
        _this._register(_this._actionRunner.onDidRun(function (e) { return _this._onDidRun.fire(e); }));
        _this._register(_this._actionRunner.onDidBeforeRun(function (e) { return _this._onDidBeforeRun.fire(e); }));
        _this.items = [];
        _this.focusedItem = undefined;
        _this.domNode = document.createElement('div');
        _this.domNode.className = 'monaco-action-bar';
        if (options.animated !== false) {
            DOM.addClass(_this.domNode, 'animated');
        }
        var previousKey;
        var nextKey;
        switch (_this.options.orientation) {
            case 0 /* HORIZONTAL */:
                previousKey = 15 /* LeftArrow */;
                nextKey = 17 /* RightArrow */;
                break;
            case 1 /* HORIZONTAL_REVERSE */:
                previousKey = 17 /* RightArrow */;
                nextKey = 15 /* LeftArrow */;
                _this.domNode.className += ' reverse';
                break;
            case 2 /* VERTICAL */:
                previousKey = 16 /* UpArrow */;
                nextKey = 18 /* DownArrow */;
                _this.domNode.className += ' vertical';
                break;
            case 3 /* VERTICAL_REVERSE */:
                previousKey = 18 /* DownArrow */;
                nextKey = 16 /* UpArrow */;
                _this.domNode.className += ' vertical reverse';
                break;
        }
        _this._register(DOM.addDisposableListener(_this.domNode, DOM.EventType.KEY_DOWN, function (e) {
            var event = new StandardKeyboardEvent(e);
            var eventHandled = true;
            if (event.equals(previousKey)) {
                _this.focusPrevious();
            }
            else if (event.equals(nextKey)) {
                _this.focusNext();
            }
            else if (event.equals(9 /* Escape */)) {
                _this.cancel();
            }
            else if (event.equals(3 /* Enter */) || event.equals(10 /* Space */)) {
                // Nothing, just staying out of the else branch
            }
            else {
                eventHandled = false;
            }
            if (eventHandled) {
                event.preventDefault();
                event.stopPropagation();
            }
        }));
        _this._register(DOM.addDisposableListener(_this.domNode, DOM.EventType.KEY_UP, function (e) {
            var event = new StandardKeyboardEvent(e);
            // Run action on Enter/Space
            if (event.equals(3 /* Enter */) || event.equals(10 /* Space */)) {
                _this.doTrigger(event);
                event.preventDefault();
                event.stopPropagation();
            }
            // Recompute focused item
            else if (event.equals(2 /* Tab */) || event.equals(1024 /* Shift */ | 2 /* Tab */)) {
                _this.updateFocusedItem();
            }
        }));
        _this.focusTracker = _this._register(DOM.trackFocus(_this.domNode));
        _this._register(_this.focusTracker.onDidBlur(function () {
            if (document.activeElement === _this.domNode || !DOM.isAncestor(document.activeElement, _this.domNode)) {
                _this._onDidBlur.fire();
                _this.focusedItem = undefined;
            }
        }));
        _this._register(_this.focusTracker.onDidFocus(function () { return _this.updateFocusedItem(); }));
        _this.actionsList = document.createElement('ul');
        _this.actionsList.className = 'actions-container';
        _this.actionsList.setAttribute('role', 'toolbar');
        if (_this.options.ariaLabel) {
            _this.actionsList.setAttribute('aria-label', _this.options.ariaLabel);
        }
        _this.domNode.appendChild(_this.actionsList);
        container.appendChild(_this.domNode);
        return _this;
    }
    Object.defineProperty(ActionBar.prototype, "onDidBlur", {
        get: function () { return this._onDidBlur.event; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActionBar.prototype, "onDidCancel", {
        get: function () { return this._onDidCancel.event; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActionBar.prototype, "onDidRun", {
        get: function () { return this._onDidRun.event; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActionBar.prototype, "onDidBeforeRun", {
        get: function () { return this._onDidBeforeRun.event; },
        enumerable: true,
        configurable: true
    });
    ActionBar.prototype.setAriaLabel = function (label) {
        if (label) {
            this.actionsList.setAttribute('aria-label', label);
        }
        else {
            this.actionsList.removeAttribute('aria-label');
        }
    };
    ActionBar.prototype.updateFocusedItem = function () {
        for (var i = 0; i < this.actionsList.children.length; i++) {
            var elem = this.actionsList.children[i];
            if (DOM.isAncestor(document.activeElement, elem)) {
                this.focusedItem = i;
                break;
            }
        }
    };
    Object.defineProperty(ActionBar.prototype, "context", {
        get: function () {
            return this._context;
        },
        set: function (context) {
            this._context = context;
            this.items.forEach(function (i) { return i.setActionContext(context); });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActionBar.prototype, "actionRunner", {
        get: function () {
            return this._actionRunner;
        },
        set: function (actionRunner) {
            if (actionRunner) {
                this._actionRunner = actionRunner;
                this.items.forEach(function (item) { return item.actionRunner = actionRunner; });
            }
        },
        enumerable: true,
        configurable: true
    });
    ActionBar.prototype.getContainer = function () {
        return this.domNode;
    };
    ActionBar.prototype.push = function (arg, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        var actions = !Array.isArray(arg) ? [arg] : arg;
        var index = types.isNumber(options.index) ? options.index : null;
        actions.forEach(function (action) {
            var actionItemElement = document.createElement('li');
            actionItemElement.className = 'action-item';
            actionItemElement.setAttribute('role', 'presentation');
            // Prevent native context menu on actions
            _this._register(DOM.addDisposableListener(actionItemElement, DOM.EventType.CONTEXT_MENU, function (e) {
                e.preventDefault();
                e.stopPropagation();
            }));
            var item = null;
            if (_this.options.actionItemProvider) {
                item = _this.options.actionItemProvider(action);
            }
            if (!item) {
                item = new ActionItem(_this.context, action, options);
            }
            item.actionRunner = _this._actionRunner;
            item.setActionContext(_this.context);
            item.render(actionItemElement);
            if (index === null || index < 0 || index >= _this.actionsList.children.length) {
                _this.actionsList.appendChild(actionItemElement);
                _this.items.push(item);
            }
            else {
                _this.actionsList.insertBefore(actionItemElement, _this.actionsList.children[index]);
                _this.items.splice(index, 0, item);
                index++;
            }
        });
    };
    ActionBar.prototype.getWidth = function (index) {
        if (index >= 0 && index < this.actionsList.children.length) {
            return this.actionsList.children.item(index).clientWidth;
        }
        return 0;
    };
    ActionBar.prototype.getHeight = function (index) {
        if (index >= 0 && index < this.actionsList.children.length) {
            return this.actionsList.children.item(index).clientHeight;
        }
        return 0;
    };
    ActionBar.prototype.pull = function (index) {
        if (index >= 0 && index < this.items.length) {
            this.items.splice(index, 1);
            this.actionsList.removeChild(this.actionsList.childNodes[index]);
        }
    };
    ActionBar.prototype.clear = function () {
        this.items = dispose(this.items);
        DOM.clearNode(this.actionsList);
    };
    ActionBar.prototype.length = function () {
        return this.items.length;
    };
    ActionBar.prototype.isEmpty = function () {
        return this.items.length === 0;
    };
    ActionBar.prototype.focus = function (selectFirst) {
        if (selectFirst && typeof this.focusedItem === 'undefined') {
            // Focus the first enabled item
            this.focusedItem = this.items.length - 1;
            this.focusNext();
        }
        else {
            this.updateFocus();
        }
    };
    ActionBar.prototype.focusNext = function () {
        if (typeof this.focusedItem === 'undefined') {
            this.focusedItem = this.items.length - 1;
        }
        var startIndex = this.focusedItem;
        var item;
        do {
            this.focusedItem = (this.focusedItem + 1) % this.items.length;
            item = this.items[this.focusedItem];
        } while (this.focusedItem !== startIndex && !item.isEnabled());
        if (this.focusedItem === startIndex && !item.isEnabled()) {
            this.focusedItem = undefined;
        }
        this.updateFocus();
    };
    ActionBar.prototype.focusPrevious = function () {
        if (typeof this.focusedItem === 'undefined') {
            this.focusedItem = 0;
        }
        var startIndex = this.focusedItem;
        var item;
        do {
            this.focusedItem = this.focusedItem - 1;
            if (this.focusedItem < 0) {
                this.focusedItem = this.items.length - 1;
            }
            item = this.items[this.focusedItem];
        } while (this.focusedItem !== startIndex && !item.isEnabled());
        if (this.focusedItem === startIndex && !item.isEnabled()) {
            this.focusedItem = undefined;
        }
        this.updateFocus(true);
    };
    ActionBar.prototype.updateFocus = function (fromRight) {
        if (typeof this.focusedItem === 'undefined') {
            this.actionsList.focus();
        }
        for (var i = 0; i < this.items.length; i++) {
            var item = this.items[i];
            var actionItem = item;
            if (i === this.focusedItem) {
                if (types.isFunction(actionItem.isEnabled)) {
                    if (actionItem.isEnabled() && types.isFunction(actionItem.focus)) {
                        actionItem.focus(fromRight);
                    }
                    else {
                        this.actionsList.focus();
                    }
                }
            }
            else {
                if (types.isFunction(actionItem.blur)) {
                    actionItem.blur();
                }
            }
        }
    };
    ActionBar.prototype.doTrigger = function (event) {
        if (typeof this.focusedItem === 'undefined') {
            return; //nothing to focus
        }
        // trigger action
        var actionItem = this.items[this.focusedItem];
        if (actionItem instanceof BaseActionItem) {
            var context = (actionItem._context === null || actionItem._context === undefined) ? event : actionItem._context;
            this.run(actionItem._action, context);
        }
    };
    ActionBar.prototype.cancel = function () {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur(); // remove focus from focused action
        }
        this._onDidCancel.fire();
    };
    ActionBar.prototype.run = function (action, context) {
        return this._actionRunner.run(action, context);
    };
    ActionBar.prototype.dispose = function () {
        if (this.items !== null) {
            dispose(this.items);
        }
        this.items = null;
        this.getContainer().remove();
        _super.prototype.dispose.call(this);
    };
    return ActionBar;
}(Disposable));
export { ActionBar };
var SelectActionItem = /** @class */ (function (_super) {
    __extends(SelectActionItem, _super);
    function SelectActionItem(ctx, action, options, selected, contextViewProvider, selectBoxOptions) {
        var _this = _super.call(this, ctx, action) || this;
        _this.selectBox = new SelectBox(options, selected, contextViewProvider, null, selectBoxOptions);
        _this._register(_this.selectBox);
        _this.registerListeners();
        return _this;
    }
    SelectActionItem.prototype.setOptions = function (options, selected, disabled) {
        this.selectBox.setOptions(options, selected, disabled);
    };
    SelectActionItem.prototype.select = function (index) {
        this.selectBox.select(index);
    };
    SelectActionItem.prototype.registerListeners = function () {
        var _this = this;
        this._register(this.selectBox.onDidSelect(function (e) {
            _this.actionRunner.run(_this._action, _this.getActionContext(e.selected, e.index));
        }));
    };
    SelectActionItem.prototype.getActionContext = function (option, index) {
        return option;
    };
    SelectActionItem.prototype.focus = function () {
        if (this.selectBox) {
            this.selectBox.focus();
        }
    };
    SelectActionItem.prototype.blur = function () {
        if (this.selectBox) {
            this.selectBox.blur();
        }
    };
    SelectActionItem.prototype.render = function (container) {
        this.selectBox.render(container);
    };
    return SelectActionItem;
}(BaseActionItem));
export { SelectActionItem };
