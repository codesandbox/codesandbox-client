/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Emitter } from '../../../base/common/event';
import { dispose } from '../../../base/common/lifecycle';
import { IContextKeyService } from '../../contextkey/common/contextkey';
import { MenuRegistry, MenuItemAction, SubmenuItemAction, isIMenuItem } from './actions';
import { ICommandService } from '../../commands/common/commands';
var Menu = /** @class */ (function () {
    function Menu(id, startupSignal, _commandService, _contextKeyService) {
        var _this = this;
        this._commandService = _commandService;
        this._contextKeyService = _contextKeyService;
        this._menuGroups = [];
        this._disposables = [];
        this._onDidChange = new Emitter();
        startupSignal.then(function (_) {
            var menuItems = MenuRegistry.getMenuItems(id);
            var keysFilter = new Set();
            var group;
            menuItems.sort(Menu._compareMenuItems);
            for (var _i = 0, menuItems_1 = menuItems; _i < menuItems_1.length; _i++) {
                var item = menuItems_1[_i];
                // group by groupId
                var groupName = item.group;
                if (!group || group[0] !== groupName) {
                    group = [groupName, []];
                    _this._menuGroups.push(group);
                }
                group[1].push(item);
                // keep keys for eventing
                Menu._fillInKbExprKeys(item.when, keysFilter);
            }
            // subscribe to context changes
            _this._disposables.push(_this._contextKeyService.onDidChangeContext(function (event) {
                if (event.affectsSome(keysFilter)) {
                    _this._onDidChange.fire();
                }
            }));
            _this._onDidChange.fire(_this);
        });
    }
    Menu.prototype.dispose = function () {
        this._disposables = dispose(this._disposables);
        this._onDidChange.dispose();
    };
    Object.defineProperty(Menu.prototype, "onDidChange", {
        get: function () {
            return this._onDidChange.event;
        },
        enumerable: true,
        configurable: true
    });
    Menu.prototype.getActions = function (options) {
        var result = [];
        for (var _i = 0, _a = this._menuGroups; _i < _a.length; _i++) {
            var group = _a[_i];
            var id = group[0], items = group[1];
            var activeActions = [];
            for (var _b = 0, items_1 = items; _b < items_1.length; _b++) {
                var item = items_1[_b];
                if (this._contextKeyService.contextMatchesRules(item.when)) {
                    var action = isIMenuItem(item) ? new MenuItemAction(item.command, item.alt, options, this._contextKeyService, this._commandService) : new SubmenuItemAction(item);
                    action.order = item.order; //TODO@Ben order is menu item property, not an action property
                    activeActions.push(action);
                }
            }
            if (activeActions.length > 0) {
                result.push([id, activeActions]);
            }
        }
        return result;
    };
    Menu._fillInKbExprKeys = function (exp, set) {
        if (exp) {
            for (var _i = 0, _a = exp.keys(); _i < _a.length; _i++) {
                var key = _a[_i];
                set.add(key);
            }
        }
    };
    Menu._compareMenuItems = function (a, b) {
        var aGroup = a.group;
        var bGroup = b.group;
        if (aGroup !== bGroup) {
            // Falsy groups come last
            if (!aGroup) {
                return 1;
            }
            else if (!bGroup) {
                return -1;
            }
            // 'navigation' group comes first
            if (aGroup === 'navigation') {
                return -1;
            }
            else if (bGroup === 'navigation') {
                return 1;
            }
            // lexical sort for groups
            var value = aGroup.localeCompare(bGroup);
            if (value !== 0) {
                return value;
            }
        }
        // sort on priority - default is 0
        var aPrio = a.order || 0;
        var bPrio = b.order || 0;
        if (aPrio < bPrio) {
            return -1;
        }
        else if (aPrio > bPrio) {
            return 1;
        }
        // sort on titles
        var aTitle = typeof a.command.title === 'string' ? a.command.title : a.command.title.value;
        var bTitle = typeof b.command.title === 'string' ? b.command.title : b.command.title.value;
        return aTitle.localeCompare(bTitle);
    };
    Menu = __decorate([
        __param(2, ICommandService),
        __param(3, IContextKeyService)
    ], Menu);
    return Menu;
}());
export { Menu };
