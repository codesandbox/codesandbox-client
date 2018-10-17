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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Action } from '../../../base/common/actions.js';
import { createSyncDescriptor } from '../../instantiation/common/descriptors.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { IContextKeyService } from '../../contextkey/common/contextkey.js';
import { ICommandService } from '../../commands/common/commands.js';
export function isIMenuItem(item) {
    return item.command !== undefined;
}
export function isISubmenuItem(item) {
    return item.submenu !== undefined;
}
var MenuId = /** @class */ (function () {
    function MenuId() {
        this.id = String(MenuId.ID++);
    }
    MenuId.ID = 1;
    MenuId.EditorTitle = new MenuId();
    MenuId.EditorTitleContext = new MenuId();
    MenuId.EditorContext = new MenuId();
    MenuId.EmptyEditorGroupContext = new MenuId();
    MenuId.ExplorerContext = new MenuId();
    MenuId.OpenEditorsContext = new MenuId();
    MenuId.ProblemsPanelContext = new MenuId();
    MenuId.DebugVariablesContext = new MenuId();
    MenuId.DebugWatchContext = new MenuId();
    MenuId.DebugCallStackContext = new MenuId();
    MenuId.DebugBreakpointsContext = new MenuId();
    MenuId.DebugConsoleContext = new MenuId();
    MenuId.SCMTitle = new MenuId();
    MenuId.SCMSourceControl = new MenuId();
    MenuId.SCMResourceGroupContext = new MenuId();
    MenuId.SCMResourceContext = new MenuId();
    MenuId.SCMChangeContext = new MenuId();
    MenuId.CommandPalette = new MenuId();
    MenuId.ViewTitle = new MenuId();
    MenuId.ViewItemContext = new MenuId();
    MenuId.TouchBarContext = new MenuId();
    MenuId.SearchContext = new MenuId();
    MenuId.MenubarFileMenu = new MenuId();
    MenuId.MenubarEditMenu = new MenuId();
    MenuId.MenubarRecentMenu = new MenuId();
    MenuId.MenubarSelectionMenu = new MenuId();
    MenuId.MenubarViewMenu = new MenuId();
    MenuId.MenubarLayoutMenu = new MenuId();
    MenuId.MenubarGoMenu = new MenuId();
    MenuId.MenubarDebugMenu = new MenuId();
    MenuId.MenubarTasksMenu = new MenuId();
    MenuId.MenubarWindowMenu = new MenuId();
    MenuId.MenubarPreferencesMenu = new MenuId();
    MenuId.MenubarHelpMenu = new MenuId();
    MenuId.MenubarTerminalMenu = new MenuId();
    return MenuId;
}());
export { MenuId };
export var IMenuService = createDecorator('menuService');
export var MenuRegistry = new /** @class */ (function () {
    function class_1() {
        this._commands = Object.create(null);
        this._menuItems = Object.create(null);
    }
    class_1.prototype.addCommand = function (command) {
        var old = this._commands[command.id];
        this._commands[command.id] = command;
        return old !== void 0;
    };
    class_1.prototype.getCommand = function (id) {
        return this._commands[id];
    };
    class_1.prototype.appendMenuItem = function (_a, item) {
        var id = _a.id;
        var array = this._menuItems[id];
        if (!array) {
            this._menuItems[id] = array = [item];
        }
        else {
            array.push(item);
        }
        return {
            dispose: function () {
                var idx = array.indexOf(item);
                if (idx >= 0) {
                    array.splice(idx, 1);
                }
            }
        };
    };
    class_1.prototype.getMenuItems = function (_a) {
        var id = _a.id;
        var result = this._menuItems[id] || [];
        if (id === MenuId.CommandPalette.id) {
            // CommandPalette is special because it shows
            // all commands by default
            this._appendImplicitItems(result);
        }
        return result;
    };
    class_1.prototype._appendImplicitItems = function (result) {
        var set = new Set();
        var temp = result.filter(function (item) { return isIMenuItem(item); });
        for (var _i = 0, temp_1 = temp; _i < temp_1.length; _i++) {
            var _a = temp_1[_i], command = _a.command, alt = _a.alt;
            set.add(command.id);
            if (alt) {
                set.add(alt.id);
            }
        }
        for (var id in this._commands) {
            if (!set.has(id)) {
                result.push({ command: this._commands[id] });
            }
        }
    };
    return class_1;
}());
var ExecuteCommandAction = /** @class */ (function (_super) {
    __extends(ExecuteCommandAction, _super);
    function ExecuteCommandAction(id, label, _commandService) {
        var _this = _super.call(this, id, label) || this;
        _this._commandService = _commandService;
        return _this;
    }
    ExecuteCommandAction.prototype.run = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _a;
        return (_a = this._commandService).executeCommand.apply(_a, [this.id].concat(args));
    };
    ExecuteCommandAction = __decorate([
        __param(2, ICommandService)
    ], ExecuteCommandAction);
    return ExecuteCommandAction;
}(Action));
export { ExecuteCommandAction };
var SubmenuItemAction = /** @class */ (function (_super) {
    __extends(SubmenuItemAction, _super);
    function SubmenuItemAction(item) {
        var _this = this;
        typeof item.title === 'string' ? _this = _super.call(this, '', item.title, 'submenu') || this : _this = _super.call(this, '', item.title.value, 'submenu') || this;
        _this.item = item;
        return _this;
    }
    return SubmenuItemAction;
}(Action));
export { SubmenuItemAction };
var MenuItemAction = /** @class */ (function (_super) {
    __extends(MenuItemAction, _super);
    function MenuItemAction(item, alt, options, contextKeyService, commandService) {
        var _this = this;
        typeof item.title === 'string' ? _this = _super.call(this, item.id, item.title, commandService) || this : _this = _super.call(this, item.id, item.title.value, commandService) || this;
        _this._cssClass = undefined;
        _this._enabled = !item.precondition || contextKeyService.contextMatchesRules(item.precondition);
        _this._options = options || {};
        _this.item = item;
        _this.alt = alt ? new MenuItemAction(alt, undefined, _this._options, contextKeyService, commandService) : undefined;
        return _this;
    }
    MenuItemAction.prototype.run = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var runArgs = [];
        if (this._options.arg) {
            runArgs = runArgs.concat([this._options.arg]);
        }
        if (this._options.shouldForwardArgs) {
            runArgs = runArgs.concat(args);
        }
        return _super.prototype.run.apply(this, runArgs);
    };
    MenuItemAction = __decorate([
        __param(3, IContextKeyService),
        __param(4, ICommandService)
    ], MenuItemAction);
    return MenuItemAction;
}(ExecuteCommandAction));
export { MenuItemAction };
var SyncActionDescriptor = /** @class */ (function () {
    function SyncActionDescriptor(ctor, id, label, keybindings, keybindingContext, keybindingWeight) {
        this._id = id;
        this._label = label;
        this._keybindings = keybindings;
        this._keybindingContext = keybindingContext;
        this._keybindingWeight = keybindingWeight;
        this._descriptor = createSyncDescriptor(ctor, this._id, this._label);
    }
    Object.defineProperty(SyncActionDescriptor.prototype, "syncDescriptor", {
        get: function () {
            return this._descriptor;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SyncActionDescriptor.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SyncActionDescriptor.prototype, "label", {
        get: function () {
            return this._label;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SyncActionDescriptor.prototype, "keybindings", {
        get: function () {
            return this._keybindings;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SyncActionDescriptor.prototype, "keybindingContext", {
        get: function () {
            return this._keybindingContext;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SyncActionDescriptor.prototype, "keybindingWeight", {
        get: function () {
            return this._keybindingWeight;
        },
        enumerable: true,
        configurable: true
    });
    return SyncActionDescriptor;
}());
export { SyncActionDescriptor };
