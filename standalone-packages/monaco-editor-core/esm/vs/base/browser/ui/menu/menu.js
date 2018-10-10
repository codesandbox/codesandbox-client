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
import './menu.css';
import { Action } from '../../../common/actions';
import { ActionBar, ActionsOrientation, Separator, ActionItem } from '../actionbar/actionbar';
import { addClass, EventType, EventHelper } from '../../dom';
import { StandardKeyboardEvent } from '../../keyboardEvent';
import { $ } from '../../builder';
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
var Menu = /** @class */ (function () {
    function Menu(container, actions, options) {
        if (options === void 0) { options = {}; }
        var _this = this;
        addClass(container, 'monaco-menu-container');
        container.setAttribute('role', 'presentation');
        var menuContainer = document.createElement('div');
        addClass(menuContainer, 'monaco-menu');
        menuContainer.setAttribute('role', 'presentation');
        container.appendChild(menuContainer);
        var parentData = {
            parent: this
        };
        this.actionBar = new ActionBar(menuContainer, {
            orientation: ActionsOrientation.VERTICAL,
            actionItemProvider: function (action) { return _this.doGetActionItem(action, options, parentData); },
            context: options.context,
            actionRunner: options.actionRunner,
            isMenu: true,
            ariaLabel: options.ariaLabel
        });
        this.actionBar.push(actions, { icon: true, label: true, isMenu: true });
    }
    Menu.prototype.doGetActionItem = function (action, options, parentData) {
        if (action instanceof Separator) {
            return new ActionItem(options.context, action, { icon: true });
        }
        else if (action instanceof SubmenuAction) {
            return new SubmenuActionItem(action, action.entries, parentData, options);
        }
        else {
            var menuItemOptions = {};
            if (options.getKeyBinding) {
                var keybinding = options.getKeyBinding(action);
                if (keybinding) {
                    menuItemOptions.keybinding = keybinding.getLabel();
                }
            }
            return new MenuActionItem(options.context, action, menuItemOptions);
        }
    };
    Object.defineProperty(Menu.prototype, "onDidCancel", {
        get: function () {
            return this.actionBar.onDidCancel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Menu.prototype, "onDidBlur", {
        get: function () {
            return this.actionBar.onDidBlur;
        },
        enumerable: true,
        configurable: true
    });
    Menu.prototype.focus = function () {
        if (this.actionBar) {
            this.actionBar.focus(true);
        }
    };
    Menu.prototype.dispose = function () {
        if (this.actionBar) {
            this.actionBar.dispose();
            this.actionBar = null;
        }
        if (this.listener) {
            this.listener.dispose();
            this.listener = null;
        }
    };
    return Menu;
}());
export { Menu };
var MenuActionItem = /** @class */ (function (_super) {
    __extends(MenuActionItem, _super);
    function MenuActionItem(ctx, action, options) {
        if (options === void 0) { options = {}; }
        var _this = this;
        options.isMenu = true;
        _this = _super.call(this, action, action, options) || this;
        return _this;
    }
    MenuActionItem.prototype._addMnemonic = function (action, actionItemElement) {
        var matches = MenuActionItem.MNEMONIC_REGEX.exec(action.label);
        if (matches && matches.length === 2) {
            var mnemonic = matches[1];
            var ariaLabel = action.label.replace(MenuActionItem.MNEMONIC_REGEX, mnemonic);
            actionItemElement.accessKey = mnemonic.toLocaleLowerCase();
            this.$e.attr('aria-label', ariaLabel);
        }
        else {
            this.$e.attr('aria-label', action.label);
        }
    };
    MenuActionItem.prototype.render = function (container) {
        _super.prototype.render.call(this, container);
        this._addMnemonic(this.getAction(), container);
        this.$e.attr('role', 'menuitem');
    };
    MenuActionItem.prototype._updateLabel = function () {
        if (this.options.label) {
            var label = this.getAction().label;
            if (label && this.options.isMenu) {
                label = label.replace(MenuActionItem.MNEMONIC_REGEX, '$1\u0332');
            }
            this.$e.text(label);
        }
    };
    MenuActionItem.MNEMONIC_REGEX = /&&(.)/g;
    return MenuActionItem;
}(ActionItem));
var SubmenuActionItem = /** @class */ (function (_super) {
    __extends(SubmenuActionItem, _super);
    function SubmenuActionItem(action, submenuActions, parentData, submenuOptions) {
        var _this = _super.call(this, action, action, { label: true, isMenu: true }) || this;
        _this.submenuActions = submenuActions;
        _this.parentData = parentData;
        _this.submenuOptions = submenuOptions;
        return _this;
    }
    SubmenuActionItem.prototype.render = function (container) {
        var _this = this;
        _super.prototype.render.call(this, container);
        this.builder = $(container);
        $(this.builder).addClass('monaco-submenu-item');
        $('span.submenu-indicator').text('\u25B6').appendTo(this.builder);
        this.$e.attr('role', 'menu');
        $(this.builder).on(EventType.KEY_UP, function (e) {
            var event = new StandardKeyboardEvent(e);
            if (event.equals(17 /* RightArrow */)) {
                EventHelper.stop(e, true);
                _this.createSubmenu();
            }
        });
        $(this.builder).on(EventType.KEY_DOWN, function (e) {
            var event = new StandardKeyboardEvent(e);
            if (event.equals(17 /* RightArrow */)) {
                EventHelper.stop(e, true);
            }
        });
        $(this.builder).on(EventType.MOUSE_OVER, function (e) {
            if (!_this.mouseOver) {
                _this.mouseOver = true;
                setTimeout(function () {
                    if (_this.mouseOver) {
                        _this.cleanupExistingSubmenu(false);
                        _this.createSubmenu();
                    }
                }, 250);
            }
        });
        $(this.builder).on(EventType.MOUSE_LEAVE, function (e) {
            _this.mouseOver = false;
            setTimeout(function () {
                if (!_this.mouseOver && _this.parentData.submenu === _this.mysubmenu) {
                    _this.parentData.parent.focus();
                    _this.cleanupExistingSubmenu(true);
                }
            }, 750);
        });
    };
    SubmenuActionItem.prototype.onClick = function (e) {
        // stop clicking from trying to run an action
        EventHelper.stop(e, true);
    };
    SubmenuActionItem.prototype.cleanupExistingSubmenu = function (force) {
        if (this.parentData.submenu && (force || (this.parentData.submenu !== this.mysubmenu))) {
            this.parentData.submenu.dispose();
            this.parentData.submenu = null;
            if (this.submenuContainer) {
                this.submenuContainer.dispose();
                this.submenuContainer = null;
            }
        }
    };
    SubmenuActionItem.prototype.createSubmenu = function () {
        var _this = this;
        if (!this.parentData.submenu) {
            this.submenuContainer = $(this.builder).div({ class: 'monaco-submenu menubar-menu-items-holder context-view' });
            $(this.submenuContainer).style({
                'left': $(this.builder).getClientArea().width + "px"
            });
            $(this.submenuContainer).on(EventType.KEY_UP, function (e) {
                var event = new StandardKeyboardEvent(e);
                if (event.equals(15 /* LeftArrow */)) {
                    EventHelper.stop(e, true);
                    _this.parentData.parent.focus();
                    _this.parentData.submenu.dispose();
                    _this.parentData.submenu = null;
                    _this.submenuContainer.dispose();
                    _this.submenuContainer = null;
                }
            });
            $(this.submenuContainer).on(EventType.KEY_DOWN, function (e) {
                var event = new StandardKeyboardEvent(e);
                if (event.equals(15 /* LeftArrow */)) {
                    EventHelper.stop(e, true);
                }
            });
            this.parentData.submenu = new Menu(this.submenuContainer.getHTMLElement(), this.submenuActions, this.submenuOptions);
            this.parentData.submenu.focus();
            this.mysubmenu = this.parentData.submenu;
        }
    };
    SubmenuActionItem.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        if (this.mysubmenu) {
            this.mysubmenu.dispose();
            this.mysubmenu = null;
        }
        if (this.submenuContainer) {
            this.submenuContainer.dispose();
            this.submenuContainer = null;
        }
    };
    return SubmenuActionItem;
}(MenuActionItem));
