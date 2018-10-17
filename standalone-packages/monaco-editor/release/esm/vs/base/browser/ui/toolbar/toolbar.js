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
import './toolbar.css';
import * as nls from '../../../../nls.js';
import { TPromise } from '../../../common/winjs.base.js';
import { Action } from '../../../common/actions.js';
import { ActionBar } from '../actionbar/actionbar.js';
import { DropdownMenuActionItem } from '../dropdown/dropdown.js';
import { Disposable } from '../../../common/lifecycle.js';
export var CONTEXT = 'context.toolbar';
/**
 * A widget that combines an action bar for primary actions and a dropdown for secondary actions.
 */
var ToolBar = /** @class */ (function (_super) {
    __extends(ToolBar, _super);
    function ToolBar(container, contextMenuProvider, options) {
        if (options === void 0) { options = { orientation: 0 /* HORIZONTAL */ }; }
        var _this = _super.call(this) || this;
        _this.options = options;
        _this.lookupKeybindings = typeof _this.options.getKeyBinding === 'function';
        _this.toggleMenuAction = _this._register(new ToggleMenuAction(function () { return _this.toggleMenuActionItem && _this.toggleMenuActionItem.show(); }, options.toggleMenuTitle));
        var element = document.createElement('div');
        element.className = 'monaco-toolbar';
        container.appendChild(element);
        _this.actionBar = _this._register(new ActionBar(element, {
            orientation: options.orientation,
            ariaLabel: options.ariaLabel,
            actionRunner: options.actionRunner,
            actionItemProvider: function (action) {
                // Return special action item for the toggle menu action
                if (action.id === ToggleMenuAction.ID) {
                    // Dispose old
                    if (_this.toggleMenuActionItem) {
                        _this.toggleMenuActionItem.dispose();
                    }
                    // Create new
                    _this.toggleMenuActionItem = new DropdownMenuActionItem(action, action.menuActions, contextMenuProvider, _this.options.actionItemProvider, _this.actionRunner, _this.options.getKeyBinding, 'toolbar-toggle-more');
                    _this.toggleMenuActionItem.setActionContext(_this.actionBar.context);
                    return _this.toggleMenuActionItem;
                }
                return options.actionItemProvider ? options.actionItemProvider(action) : null;
            }
        }));
        return _this;
    }
    Object.defineProperty(ToolBar.prototype, "actionRunner", {
        get: function () {
            return this.actionBar.actionRunner;
        },
        set: function (actionRunner) {
            this.actionBar.actionRunner = actionRunner;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToolBar.prototype, "context", {
        set: function (context) {
            this.actionBar.context = context;
            if (this.toggleMenuActionItem) {
                this.toggleMenuActionItem.setActionContext(context);
            }
        },
        enumerable: true,
        configurable: true
    });
    ToolBar.prototype.getContainer = function () {
        return this.actionBar.getContainer();
    };
    ToolBar.prototype.getItemsWidth = function () {
        var itemsWidth = 0;
        for (var i = 0; i < this.actionBar.length(); i++) {
            itemsWidth += this.actionBar.getWidth(i);
        }
        return itemsWidth;
    };
    ToolBar.prototype.setAriaLabel = function (label) {
        this.actionBar.setAriaLabel(label);
    };
    ToolBar.prototype.setActions = function (primaryActions, secondaryActions) {
        var _this = this;
        return function () {
            var primaryActionsToSet = primaryActions ? primaryActions.slice(0) : [];
            // Inject additional action to open secondary actions if present
            _this.hasSecondaryActions = secondaryActions && secondaryActions.length > 0;
            if (_this.hasSecondaryActions) {
                _this.toggleMenuAction.menuActions = secondaryActions.slice(0);
                primaryActionsToSet.push(_this.toggleMenuAction);
            }
            _this.actionBar.clear();
            primaryActionsToSet.forEach(function (action) {
                _this.actionBar.push(action, { icon: true, label: false, keybinding: _this.getKeybindingLabel(action) });
            });
        };
    };
    ToolBar.prototype.getKeybindingLabel = function (action) {
        var key = this.lookupKeybindings ? this.options.getKeyBinding(action) : void 0;
        return key ? key.getLabel() : void 0;
    };
    ToolBar.prototype.addPrimaryAction = function (primaryAction) {
        var _this = this;
        return function () {
            // Add after the "..." action if we have secondary actions
            if (_this.hasSecondaryActions) {
                var itemCount = _this.actionBar.length();
                _this.actionBar.push(primaryAction, { icon: true, label: false, index: itemCount, keybinding: _this.getKeybindingLabel(primaryAction) });
            }
            // Otherwise just add to the end
            else {
                _this.actionBar.push(primaryAction, { icon: true, label: false, keybinding: _this.getKeybindingLabel(primaryAction) });
            }
        };
    };
    ToolBar.prototype.dispose = function () {
        if (this.toggleMenuActionItem) {
            this.toggleMenuActionItem.dispose();
            this.toggleMenuActionItem = void 0;
        }
        _super.prototype.dispose.call(this);
    };
    return ToolBar;
}(Disposable));
export { ToolBar };
var ToggleMenuAction = /** @class */ (function (_super) {
    __extends(ToggleMenuAction, _super);
    function ToggleMenuAction(toggleDropdownMenu, title) {
        var _this = this;
        title = title || nls.localize('moreActions', "More Actions...");
        _this = _super.call(this, ToggleMenuAction.ID, title, null, true) || this;
        _this.toggleDropdownMenu = toggleDropdownMenu;
        return _this;
    }
    ToggleMenuAction.prototype.run = function () {
        this.toggleDropdownMenu();
        return TPromise.as(true);
    };
    Object.defineProperty(ToggleMenuAction.prototype, "menuActions", {
        get: function () {
            return this._menuActions;
        },
        set: function (actions) {
            this._menuActions = actions;
        },
        enumerable: true,
        configurable: true
    });
    ToggleMenuAction.ID = 'toolbar.toggle.more';
    return ToggleMenuAction;
}(Action));
