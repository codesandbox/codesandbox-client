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
import { addClasses, createCSSRule, removeClasses } from '../../../base/browser/dom';
import { domEvent } from '../../../base/browser/event';
import { ActionItem, Separator } from '../../../base/browser/ui/actionbar/actionbar';
import { Emitter } from '../../../base/common/event';
import { IdGenerator } from '../../../base/common/idGenerator';
import { dispose, toDisposable } from '../../../base/common/lifecycle';
import { isLinux, isWindows } from '../../../base/common/platform';
import { localize } from '../../../nls';
import { MenuItemAction } from '../common/actions';
import { IContextMenuService } from '../../contextview/browser/contextView';
import { IKeybindingService } from '../../keybinding/common/keybinding';
import { INotificationService } from '../../notification/common/notification';
// The alternative key on all platforms is alt. On windows we also support shift as an alternative key #44136
var AlternativeKeyEmitter = /** @class */ (function (_super) {
    __extends(AlternativeKeyEmitter, _super);
    function AlternativeKeyEmitter(contextMenuService) {
        var _this = _super.call(this) || this;
        _this._subscriptions = [];
        _this._suppressAltKeyUp = false;
        _this._subscriptions.push(domEvent(document.body, 'keydown')(function (e) {
            _this.isPressed = e.altKey || ((isWindows || isLinux) && e.shiftKey);
        }));
        _this._subscriptions.push(domEvent(document.body, 'keyup')(function (e) {
            if (_this.isPressed) {
                if (_this._suppressAltKeyUp) {
                    e.preventDefault();
                }
            }
            _this._suppressAltKeyUp = false;
            _this.isPressed = false;
        }));
        _this._subscriptions.push(domEvent(document.body, 'mouseleave')(function (e) { return _this.isPressed = false; }));
        _this._subscriptions.push(domEvent(document.body, 'blur')(function (e) { return _this.isPressed = false; }));
        // Workaround since we do not get any events while a context menu is shown
        _this._subscriptions.push(contextMenuService.onDidContextMenu(function () { return _this.isPressed = false; }));
        return _this;
    }
    Object.defineProperty(AlternativeKeyEmitter.prototype, "isPressed", {
        get: function () {
            return this._isPressed;
        },
        set: function (value) {
            this._isPressed = value;
            this.fire(this._isPressed);
        },
        enumerable: true,
        configurable: true
    });
    AlternativeKeyEmitter.prototype.suppressAltKeyUp = function () {
        // Sometimes the native alt behavior needs to be suppresed since the alt was already used as an alternative key
        // Example: windows behavior to toggle tha top level menu #44396
        this._suppressAltKeyUp = true;
    };
    AlternativeKeyEmitter.getInstance = function (contextMenuService) {
        if (!AlternativeKeyEmitter.instance) {
            AlternativeKeyEmitter.instance = new AlternativeKeyEmitter(contextMenuService);
        }
        return AlternativeKeyEmitter.instance;
    };
    AlternativeKeyEmitter.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this._subscriptions = dispose(this._subscriptions);
    };
    return AlternativeKeyEmitter;
}(Emitter));
export function fillInContextMenuActions(menu, options, target, contextMenuService, isPrimaryGroup) {
    var groups = menu.getActions(options);
    var getAlternativeActions = AlternativeKeyEmitter.getInstance(contextMenuService).isPressed;
    fillInActions(groups, target, getAlternativeActions, isPrimaryGroup);
}
export function fillInActionBarActions(menu, options, target, isPrimaryGroup) {
    var groups = menu.getActions(options);
    // Action bars handle alternative actions on their own so the alternative actions should be ignored
    fillInActions(groups, target, false, isPrimaryGroup);
}
function fillInActions(groups, target, getAlternativeActions, isPrimaryGroup) {
    if (isPrimaryGroup === void 0) { isPrimaryGroup = function (group) { return group === 'navigation'; }; }
    for (var _i = 0, groups_1 = groups; _i < groups_1.length; _i++) {
        var tuple = groups_1[_i];
        var group = tuple[0], actions = tuple[1];
        if (getAlternativeActions) {
            actions = actions.map(function (a) { return (a instanceof MenuItemAction) && !!a.alt ? a.alt : a; });
        }
        if (isPrimaryGroup(group)) {
            var to = Array.isArray(target) ? target : target.primary;
            to.unshift.apply(to, actions);
        }
        else {
            var to = Array.isArray(target) ? target : target.secondary;
            if (to.length > 0) {
                to.push(new Separator());
            }
            to.push.apply(to, actions);
        }
    }
}
export function createActionItem(action, keybindingService, notificationService, contextMenuService) {
    if (action instanceof MenuItemAction) {
        return new MenuItemActionItem(action, keybindingService, notificationService, contextMenuService);
    }
    return undefined;
}
var ids = new IdGenerator('menu-item-action-item-icon-');
var MenuItemActionItem = /** @class */ (function (_super) {
    __extends(MenuItemActionItem, _super);
    function MenuItemActionItem(_action, _keybindingService, _notificationService, _contextMenuService) {
        var _this = _super.call(this, undefined, _action, { icon: !!(_action.class || _action.item.iconLocation), label: !_action.class && !_action.item.iconLocation }) || this;
        _this._action = _action;
        _this._keybindingService = _keybindingService;
        _this._notificationService = _notificationService;
        _this._contextMenuService = _contextMenuService;
        return _this;
    }
    Object.defineProperty(MenuItemActionItem.prototype, "_commandAction", {
        get: function () {
            return this._wantsAltCommand && this._action.alt || this._action;
        },
        enumerable: true,
        configurable: true
    });
    MenuItemActionItem.prototype.onClick = function (event) {
        var _this = this;
        event.preventDefault();
        event.stopPropagation();
        var altKey = AlternativeKeyEmitter.getInstance(this._contextMenuService);
        if (altKey.isPressed) {
            altKey.suppressAltKeyUp();
        }
        this.actionRunner.run(this._commandAction)
            .then(undefined, function (err) { return _this._notificationService.error(err); });
    };
    MenuItemActionItem.prototype.render = function (container) {
        var _this = this;
        _super.prototype.render.call(this, container);
        this._updateItemClass(this._action.item);
        var mouseOver = false;
        var alternativeKeyEmitter = AlternativeKeyEmitter.getInstance(this._contextMenuService);
        var alternativeKeyDown = alternativeKeyEmitter.isPressed;
        var updateAltState = function () {
            var wantsAltCommand = mouseOver && alternativeKeyDown;
            if (wantsAltCommand !== _this._wantsAltCommand) {
                _this._wantsAltCommand = wantsAltCommand;
                _this.updateLabel();
                _this.updateTooltip();
                _this.updateClass();
            }
        };
        this._register(alternativeKeyEmitter.event(function (value) {
            alternativeKeyDown = value;
            updateAltState();
        }));
        this._register(domEvent(container, 'mouseleave')(function (_) {
            mouseOver = false;
            updateAltState();
        }));
        this._register(domEvent(container, 'mouseenter')(function (e) {
            mouseOver = true;
            updateAltState();
        }));
    };
    MenuItemActionItem.prototype.updateLabel = function () {
        if (this.options.label) {
            this.label.textContent = this._commandAction.label;
        }
    };
    MenuItemActionItem.prototype.updateTooltip = function () {
        var element = this.label;
        var keybinding = this._keybindingService.lookupKeybinding(this._commandAction.id);
        var keybindingLabel = keybinding && keybinding.getLabel();
        element.title = keybindingLabel
            ? localize('titleAndKb', "{0} ({1})", this._commandAction.label, keybindingLabel)
            : this._commandAction.label;
    };
    MenuItemActionItem.prototype.updateClass = function () {
        if (this.options.icon) {
            if (this._commandAction !== this._action) {
                this._updateItemClass(this._action.alt.item);
            }
            else if (this._action.alt) {
                this._updateItemClass(this._action.item);
            }
        }
    };
    MenuItemActionItem.prototype._updateItemClass = function (item) {
        var _this = this;
        dispose(this._itemClassDispose);
        this._itemClassDispose = undefined;
        if (item.iconLocation) {
            var iconClass_1;
            var iconPathMapKey = item.iconLocation.dark.toString();
            if (MenuItemActionItem.ICON_PATH_TO_CSS_RULES.has(iconPathMapKey)) {
                iconClass_1 = MenuItemActionItem.ICON_PATH_TO_CSS_RULES.get(iconPathMapKey);
            }
            else {
                iconClass_1 = ids.nextId();
                createCSSRule(".icon." + iconClass_1, "background-image: url(\"" + (item.iconLocation.light || item.iconLocation.dark).toString() + "\")");
                createCSSRule(".vs-dark .icon." + iconClass_1 + ", .hc-black .icon." + iconClass_1, "background-image: url(\"" + item.iconLocation.dark.toString() + "\")");
                MenuItemActionItem.ICON_PATH_TO_CSS_RULES.set(iconPathMapKey, iconClass_1);
            }
            addClasses(this.label, 'icon', iconClass_1);
            this._itemClassDispose = toDisposable(function () { return removeClasses(_this.label, 'icon', iconClass_1); });
        }
    };
    MenuItemActionItem.prototype.dispose = function () {
        if (this._itemClassDispose) {
            dispose(this._itemClassDispose);
            this._itemClassDispose = undefined;
        }
        _super.prototype.dispose.call(this);
    };
    MenuItemActionItem.ICON_PATH_TO_CSS_RULES = new Map();
    MenuItemActionItem = __decorate([
        __param(1, IKeybindingService),
        __param(2, INotificationService),
        __param(3, IContextMenuService)
    ], MenuItemActionItem);
    return MenuItemActionItem;
}(ActionItem));
export { MenuItemActionItem };
// Need to subclass MenuItemActionItem in order to respect
// the action context coming from any action bar, without breaking
// existing users
var ContextAwareMenuItemActionItem = /** @class */ (function (_super) {
    __extends(ContextAwareMenuItemActionItem, _super);
    function ContextAwareMenuItemActionItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ContextAwareMenuItemActionItem.prototype.onClick = function (event) {
        var _this = this;
        event.preventDefault();
        event.stopPropagation();
        this.actionRunner.run(this._commandAction, this._context)
            .then(undefined, function (err) { return _this._notificationService.error(err); });
    };
    return ContextAwareMenuItemActionItem;
}(MenuItemActionItem));
export { ContextAwareMenuItemActionItem };
