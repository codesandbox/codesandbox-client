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
import './menu.css';
import * as nls from '../../../../nls.js';
import * as strings from '../../../common/strings.js';
import { Action } from '../../../common/actions.js';
import { ActionBar, Separator, ActionItem, BaseActionItem } from '../actionbar/actionbar.js';
import { KeyCodeUtils } from '../../../common/keyCodes.js';
import { addClass, EventType, EventHelper, removeTabIndexAndUpdateFocus, isAncestor, hasClass, addDisposableListener, removeClass, append, $, addClasses, getClientArea, removeClasses } from '../../dom.js';
import { StandardKeyboardEvent } from '../../keyboardEvent.js';
import { RunOnceScheduler } from '../../../common/async.js';
import { dispose } from '../../../common/lifecycle.js';
export var MENU_MNEMONIC_REGEX = /\(&{1,2}(.)\)|&{1,2}(.)/;
export var MENU_ESCAPED_MNEMONIC_REGEX = /(?:&amp;){1,2}(.)/;
var SubmenuAction = /** @class */ (function (_super) {
    __extends(SubmenuAction, _super);
    function SubmenuAction(label, entries, cssClass) {
        var _this = _super.call(this, !!cssClass ? cssClass : 'submenu', label, '', true) || this;
        _this.entries = entries;
        return _this;
    }
    return SubmenuAction;
}(Action));
export { SubmenuAction };
var Menu = /** @class */ (function (_super) {
    __extends(Menu, _super);
    function Menu(container, actions, options) {
        if (options === void 0) { options = {}; }
        var _this = this;
        addClass(container, 'monaco-menu-container');
        container.setAttribute('role', 'presentation');
        var menuContainer = document.createElement('div');
        addClass(menuContainer, 'monaco-menu');
        menuContainer.setAttribute('role', 'presentation');
        container.appendChild(menuContainer);
        _this = _super.call(this, menuContainer, {
            orientation: 2 /* VERTICAL */,
            actionItemProvider: function (action) { return _this.doGetActionItem(action, options, parentData); },
            context: options.context,
            actionRunner: options.actionRunner,
            ariaLabel: options.ariaLabel,
            triggerKeys: { keys: [3 /* Enter */], keyDown: true }
        }) || this;
        _this.actionsList.setAttribute('role', 'menu');
        _this.actionsList.tabIndex = 0;
        _this.menuDisposables = [];
        if (options.enableMnemonics) {
            _this.menuDisposables.push(addDisposableListener(menuContainer, EventType.KEY_DOWN, function (e) {
                var key = KeyCodeUtils.fromString(e.key);
                if (_this.mnemonics.has(key)) {
                    EventHelper.stop(e, true);
                    var actions_1 = _this.mnemonics.get(key);
                    if (actions_1.length === 1) {
                        if (actions_1[0] instanceof SubmenuActionItem) {
                            _this.focusItemByElement(actions_1[0].container);
                        }
                        actions_1[0].onClick(event);
                    }
                    if (actions_1.length > 1) {
                        var action = actions_1.shift();
                        _this.focusItemByElement(action.container);
                        actions_1.push(action);
                        _this.mnemonics.set(key, actions_1);
                    }
                }
            }));
        }
        _this._register(addDisposableListener(_this.domNode, EventType.MOUSE_OUT, function (e) {
            var relatedTarget = e.relatedTarget;
            if (!isAncestor(relatedTarget, _this.domNode)) {
                _this.focusedItem = undefined;
                _this.updateFocus();
                e.stopPropagation();
            }
        }));
        _this._register(addDisposableListener(_this.actionsList, EventType.MOUSE_OVER, function (e) {
            var target = e.target;
            if (!target || !isAncestor(target, _this.actionsList) || target === _this.actionsList) {
                return;
            }
            while (target.parentElement !== _this.actionsList) {
                target = target.parentElement;
            }
            if (hasClass(target, 'action-item')) {
                var lastFocusedItem = _this.focusedItem;
                _this.setFocusedItem(target);
                if (lastFocusedItem !== _this.focusedItem) {
                    _this.updateFocus();
                }
            }
        }));
        var parentData = {
            parent: _this
        };
        _this.mnemonics = new Map();
        _this.push(actions, { icon: true, label: true, isMenu: true });
        return _this;
    }
    Menu.prototype.style = function (style) {
        var container = this.getContainer();
        var fgColor = style.foregroundColor ? "" + style.foregroundColor : null;
        var bgColor = style.backgroundColor ? "" + style.backgroundColor : null;
        var border = style.borderColor ? "2px solid " + style.borderColor : null;
        var shadow = style.shadowColor ? "0 2px 4px " + style.shadowColor : null;
        container.style.border = border;
        this.domNode.style.color = fgColor;
        this.domNode.style.backgroundColor = bgColor;
        container.style.boxShadow = shadow;
        if (this.items) {
            this.items.forEach(function (item) {
                if (item instanceof MenuActionItem || item instanceof MenuSeparatorActionItem) {
                    item.style(style);
                }
            });
        }
    };
    Menu.prototype.focusItemByElement = function (element) {
        var lastFocusedItem = this.focusedItem;
        this.setFocusedItem(element);
        if (lastFocusedItem !== this.focusedItem) {
            this.updateFocus();
        }
    };
    Menu.prototype.setFocusedItem = function (element) {
        for (var i = 0; i < this.actionsList.children.length; i++) {
            var elem = this.actionsList.children[i];
            if (element === elem) {
                this.focusedItem = i;
                break;
            }
        }
    };
    Menu.prototype.doGetActionItem = function (action, options, parentData) {
        if (action instanceof Separator) {
            return new MenuSeparatorActionItem(options.context, action, { icon: true });
        }
        else if (action instanceof SubmenuAction) {
            var menuActionItem = new SubmenuActionItem(action, action.entries, parentData, options);
            if (options.enableMnemonics) {
                var mnemonic = menuActionItem.getMnemonic();
                if (mnemonic && menuActionItem.isEnabled()) {
                    var actionItems = [];
                    if (this.mnemonics.has(mnemonic)) {
                        actionItems = this.mnemonics.get(mnemonic);
                    }
                    actionItems.push(menuActionItem);
                    this.mnemonics.set(mnemonic, actionItems);
                }
            }
            return menuActionItem;
        }
        else {
            var menuItemOptions = { enableMnemonics: options.enableMnemonics };
            if (options.getKeyBinding) {
                var keybinding = options.getKeyBinding(action);
                if (keybinding) {
                    menuItemOptions.keybinding = keybinding.getLabel();
                }
            }
            var menuActionItem = new MenuActionItem(options.context, action, menuItemOptions);
            if (options.enableMnemonics) {
                var mnemonic = menuActionItem.getMnemonic();
                if (mnemonic && menuActionItem.isEnabled()) {
                    var actionItems = [];
                    if (this.mnemonics.has(mnemonic)) {
                        actionItems = this.mnemonics.get(mnemonic);
                    }
                    actionItems.push(menuActionItem);
                    this.mnemonics.set(mnemonic, actionItems);
                }
            }
            return menuActionItem;
        }
    };
    Menu.prototype.focus = function (selectFirst) {
        if (selectFirst === void 0) { selectFirst = true; }
        _super.prototype.focus.call(this, selectFirst);
    };
    return Menu;
}(ActionBar));
export { Menu };
var MenuActionItem = /** @class */ (function (_super) {
    __extends(MenuActionItem, _super);
    function MenuActionItem(ctx, action, options) {
        if (options === void 0) { options = {}; }
        var _this = this;
        options.isMenu = true;
        _this = _super.call(this, action, action, options) || this;
        _this.options = options;
        _this.options.icon = options.icon !== undefined ? options.icon : false;
        _this.options.label = options.label !== undefined ? options.label : true;
        _this.cssClass = '';
        // Set mnemonic
        if (_this.options.label && options.enableMnemonics) {
            var label = _this.getAction().label;
            if (label) {
                var matches = MENU_MNEMONIC_REGEX.exec(label);
                if (matches) {
                    _this.mnemonic = KeyCodeUtils.fromString((!!matches[1] ? matches[1] : matches[2]).toLocaleLowerCase());
                }
            }
        }
        return _this;
    }
    MenuActionItem.prototype.render = function (container) {
        var _this = this;
        _super.prototype.render.call(this, container);
        this.container = container;
        this.item = append(this.element, $('a.action-menu-item'));
        if (this._action.id === Separator.ID) {
            // A separator is a presentation item
            this.item.setAttribute('role', 'presentation');
        }
        else {
            this.item.setAttribute('role', 'menuitem');
            if (this.mnemonic) {
                this.item.setAttribute('aria-keyshortcuts', "" + this.mnemonic);
            }
        }
        this.check = append(this.item, $('span.menu-item-check'));
        this.check.setAttribute('role', 'none');
        this.label = append(this.item, $('span.action-label'));
        if (this.options.label && this.options.keybinding) {
            append(this.item, $('span.keybinding')).textContent = this.options.keybinding;
        }
        this._register(addDisposableListener(this.element, EventType.MOUSE_UP, function (e) {
            EventHelper.stop(e, true);
            _this.onClick(e);
        }));
        this.updateClass();
        this.updateLabel();
        this.updateTooltip();
        this.updateEnabled();
        this.updateChecked();
    };
    MenuActionItem.prototype.blur = function () {
        _super.prototype.blur.call(this);
        this.applyStyle();
    };
    MenuActionItem.prototype.focus = function () {
        _super.prototype.focus.call(this);
        this.item.focus();
        this.applyStyle();
    };
    MenuActionItem.prototype.updateLabel = function () {
        if (this.options.label) {
            var label = this.getAction().label;
            if (label) {
                var cleanLabel = cleanMnemonic(label);
                if (!this.options.enableMnemonics) {
                    label = cleanLabel;
                }
                this.label.setAttribute('aria-label', cleanLabel);
                var matches = MENU_MNEMONIC_REGEX.exec(label);
                if (matches) {
                    label = strings.escape(label).replace(MENU_ESCAPED_MNEMONIC_REGEX, '<u aria-hidden="true">$1</u>');
                    this.item.setAttribute('aria-keyshortcuts', (!!matches[1] ? matches[1] : matches[2]).toLocaleLowerCase());
                }
            }
            this.label.innerHTML = label.trim();
        }
    };
    MenuActionItem.prototype.updateTooltip = function () {
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
            this.item.title = title;
        }
    };
    MenuActionItem.prototype.updateClass = function () {
        if (this.cssClass) {
            removeClasses(this.item, this.cssClass);
        }
        if (this.options.icon) {
            this.cssClass = this.getAction().class;
            addClass(this.label, 'icon');
            if (this.cssClass) {
                addClasses(this.label, this.cssClass);
            }
            this.updateEnabled();
        }
        else {
            removeClass(this.label, 'icon');
        }
    };
    MenuActionItem.prototype.updateEnabled = function () {
        if (this.getAction().enabled) {
            removeClass(this.element, 'disabled');
            removeClass(this.item, 'disabled');
            this.item.tabIndex = 0;
        }
        else {
            addClass(this.element, 'disabled');
            addClass(this.item, 'disabled');
            removeTabIndexAndUpdateFocus(this.item);
        }
    };
    MenuActionItem.prototype.updateChecked = function () {
        if (this.getAction().checked) {
            addClass(this.item, 'checked');
            this.item.setAttribute('role', 'menuitemcheckbox');
            this.item.setAttribute('aria-checked', 'true');
        }
        else {
            removeClass(this.item, 'checked');
            this.item.setAttribute('role', 'menuitem');
            this.item.setAttribute('aria-checked', 'false');
        }
    };
    MenuActionItem.prototype.getMnemonic = function () {
        return this.mnemonic;
    };
    MenuActionItem.prototype.applyStyle = function () {
        var isSelected = hasClass(this.element, 'focused');
        var fgColor = isSelected && this.menuStyle.selectionForegroundColor ? this.menuStyle.selectionForegroundColor : this.menuStyle.foregroundColor;
        var bgColor = isSelected && this.menuStyle.selectionBackgroundColor ? this.menuStyle.selectionBackgroundColor : this.menuStyle.backgroundColor;
        var border = isSelected && this.menuStyle.selectionBorderColor ? "1px solid " + this.menuStyle.selectionBorderColor : null;
        this.item.style.color = fgColor ? "" + fgColor : null;
        this.check.style.backgroundColor = fgColor ? "" + fgColor : null;
        this.item.style.backgroundColor = bgColor ? "" + bgColor : null;
        this.container.style.border = border;
    };
    MenuActionItem.prototype.style = function (style) {
        this.menuStyle = style;
        this.applyStyle();
    };
    return MenuActionItem;
}(BaseActionItem));
var SubmenuActionItem = /** @class */ (function (_super) {
    __extends(SubmenuActionItem, _super);
    function SubmenuActionItem(action, submenuActions, parentData, submenuOptions) {
        var _this = _super.call(this, action, action, submenuOptions) || this;
        _this.submenuActions = submenuActions;
        _this.parentData = parentData;
        _this.submenuOptions = submenuOptions;
        _this.submenuDisposables = [];
        _this.showScheduler = new RunOnceScheduler(function () {
            if (_this.mouseOver) {
                _this.cleanupExistingSubmenu(false);
                _this.createSubmenu(false);
            }
        }, 250);
        _this.hideScheduler = new RunOnceScheduler(function () {
            if ((!isAncestor(document.activeElement, _this.element) && _this.parentData.submenu === _this.mysubmenu)) {
                _this.parentData.parent.focus(false);
                _this.cleanupExistingSubmenu(true);
            }
        }, 750);
        return _this;
    }
    SubmenuActionItem.prototype.render = function (container) {
        var _this = this;
        _super.prototype.render.call(this, container);
        addClass(this.item, 'monaco-submenu-item');
        this.item.setAttribute('aria-haspopup', 'true');
        this.submenuIndicator = append(this.item, $('span.submenu-indicator'));
        this.submenuIndicator.setAttribute('aria-hidden', 'true');
        this._register(addDisposableListener(this.element, EventType.KEY_UP, function (e) {
            var event = new StandardKeyboardEvent(e);
            if (event.equals(17 /* RightArrow */) || event.equals(3 /* Enter */)) {
                EventHelper.stop(e, true);
                _this.createSubmenu(true);
            }
        }));
        this._register(addDisposableListener(this.element, EventType.KEY_DOWN, function (e) {
            var event = new StandardKeyboardEvent(e);
            if (event.equals(17 /* RightArrow */) || event.equals(3 /* Enter */)) {
                EventHelper.stop(e, true);
            }
        }));
        this._register(addDisposableListener(this.element, EventType.MOUSE_OVER, function (e) {
            if (!_this.mouseOver) {
                _this.mouseOver = true;
                _this.showScheduler.schedule();
            }
        }));
        this._register(addDisposableListener(this.element, EventType.MOUSE_LEAVE, function (e) {
            _this.mouseOver = false;
        }));
        this._register(addDisposableListener(this.element, EventType.FOCUS_OUT, function (e) {
            if (!isAncestor(document.activeElement, _this.element)) {
                _this.hideScheduler.schedule();
            }
        }));
    };
    SubmenuActionItem.prototype.onClick = function (e) {
        // stop clicking from trying to run an action
        EventHelper.stop(e, true);
        this.cleanupExistingSubmenu(false);
        this.createSubmenu(false);
    };
    SubmenuActionItem.prototype.cleanupExistingSubmenu = function (force) {
        if (this.parentData.submenu && (force || (this.parentData.submenu !== this.mysubmenu))) {
            this.parentData.submenu.dispose();
            this.parentData.submenu = null;
            if (this.submenuContainer) {
                this.submenuDisposables = dispose(this.submenuDisposables);
                this.submenuContainer = null;
            }
        }
    };
    SubmenuActionItem.prototype.createSubmenu = function (selectFirstItem) {
        var _this = this;
        if (selectFirstItem === void 0) { selectFirstItem = true; }
        if (!this.parentData.submenu) {
            this.submenuContainer = append(this.element, $('div.monaco-submenu'));
            addClasses(this.submenuContainer, 'menubar-menu-items-holder', 'context-view');
            this.submenuContainer.style.left = getClientArea(this.element).width + "px";
            this.submenuDisposables.push(addDisposableListener(this.submenuContainer, EventType.KEY_UP, function (e) {
                var event = new StandardKeyboardEvent(e);
                if (event.equals(15 /* LeftArrow */)) {
                    EventHelper.stop(e, true);
                    _this.parentData.parent.focus();
                    _this.parentData.submenu.dispose();
                    _this.parentData.submenu = null;
                    _this.submenuDisposables = dispose(_this.submenuDisposables);
                    _this.submenuContainer = null;
                }
            }));
            this.submenuDisposables.push(addDisposableListener(this.submenuContainer, EventType.KEY_DOWN, function (e) {
                var event = new StandardKeyboardEvent(e);
                if (event.equals(15 /* LeftArrow */)) {
                    EventHelper.stop(e, true);
                }
            }));
            this.parentData.submenu = new Menu(this.submenuContainer, this.submenuActions, this.submenuOptions);
            if (this.menuStyle) {
                this.parentData.submenu.style(this.menuStyle);
            }
            this.submenuDisposables.push(this.parentData.submenu.onDidCancel(function () {
                _this.parentData.parent.focus();
                _this.parentData.submenu.dispose();
                _this.parentData.submenu = null;
                _this.submenuDisposables = dispose(_this.submenuDisposables);
                _this.submenuContainer = null;
            }));
            this.parentData.submenu.focus(selectFirstItem);
            this.mysubmenu = this.parentData.submenu;
        }
        else {
            this.parentData.submenu.focus(false);
        }
    };
    SubmenuActionItem.prototype.applyStyle = function () {
        _super.prototype.applyStyle.call(this);
        var isSelected = hasClass(this.element, 'focused');
        var fgColor = isSelected && this.menuStyle.selectionForegroundColor ? this.menuStyle.selectionForegroundColor : this.menuStyle.foregroundColor;
        this.submenuIndicator.style.backgroundColor = fgColor ? "" + fgColor : null;
        if (this.parentData.submenu) {
            this.parentData.submenu.style(this.menuStyle);
        }
    };
    SubmenuActionItem.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this.hideScheduler.dispose();
        if (this.mysubmenu) {
            this.mysubmenu.dispose();
            this.mysubmenu = null;
        }
        if (this.submenuContainer) {
            this.submenuDisposables = dispose(this.submenuDisposables);
            this.submenuContainer = null;
        }
    };
    return SubmenuActionItem;
}(MenuActionItem));
var MenuSeparatorActionItem = /** @class */ (function (_super) {
    __extends(MenuSeparatorActionItem, _super);
    function MenuSeparatorActionItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MenuSeparatorActionItem.prototype.style = function (style) {
        this.label.style.borderBottomColor = style.separatorColor ? "" + style.separatorColor : null;
    };
    return MenuSeparatorActionItem;
}(ActionItem));
export function cleanMnemonic(label) {
    var regex = MENU_MNEMONIC_REGEX;
    var matches = regex.exec(label);
    if (!matches) {
        return label;
    }
    var mnemonicInText = matches[0].charAt(0) === '&';
    return label.replace(regex, mnemonicInText ? '$2' : '').trim();
}
