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
import './dropdown.css';
import { TPromise } from '../../../common/winjs.base.js';
import { Gesture, EventType as GestureEventType } from '../../touch.js';
import { ActionRunner } from '../../../common/actions.js';
import { BaseActionItem } from '../actionbar/actionbar.js';
import { EventHelper, EventType, removeClass, addClass, append, $, addDisposableListener, addClasses } from '../../dom.js';
import { StandardKeyboardEvent } from '../../keyboardEvent.js';
var BaseDropdown = /** @class */ (function (_super) {
    __extends(BaseDropdown, _super);
    function BaseDropdown(container, options) {
        var _this = _super.call(this) || this;
        _this._element = append(container, $('.monaco-dropdown'));
        _this._label = append(_this._element, $('.dropdown-label'));
        var labelRenderer = options.labelRenderer;
        if (!labelRenderer) {
            labelRenderer = function (container) {
                container.textContent = options.label || '';
                return null;
            };
        }
        [EventType.CLICK, EventType.MOUSE_DOWN, GestureEventType.Tap].forEach(function (event) {
            _this._register(addDisposableListener(_this._label, event, function (e) { return EventHelper.stop(e, true); })); // prevent default click behaviour to trigger
        });
        [EventType.MOUSE_DOWN, GestureEventType.Tap].forEach(function (event) {
            _this._register(addDisposableListener(_this._label, event, function (e) {
                if (e instanceof MouseEvent && e.detail > 1) {
                    return; // prevent multiple clicks to open multiple context menus (https://github.com/Microsoft/vscode/issues/41363)
                }
                if (_this.visible) {
                    _this.hide();
                }
                else {
                    _this.show();
                }
            }));
        });
        _this._register(addDisposableListener(_this._label, EventType.KEY_UP, function (e) {
            var event = new StandardKeyboardEvent(e);
            if (event.equals(3 /* Enter */) || event.equals(10 /* Space */)) {
                EventHelper.stop(e, true); // https://github.com/Microsoft/vscode/issues/57997
                if (_this.visible) {
                    _this.hide();
                }
                else {
                    _this.show();
                }
            }
        }));
        var cleanupFn = labelRenderer(_this._label);
        if (cleanupFn) {
            _this._register(cleanupFn);
        }
        Gesture.addTarget(_this._label);
        return _this;
    }
    Object.defineProperty(BaseDropdown.prototype, "element", {
        get: function () {
            return this._element;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseDropdown.prototype, "label", {
        get: function () {
            return this._label;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseDropdown.prototype, "tooltip", {
        set: function (tooltip) {
            this._label.title = tooltip;
        },
        enumerable: true,
        configurable: true
    });
    BaseDropdown.prototype.show = function () {
        this.visible = true;
    };
    BaseDropdown.prototype.hide = function () {
        this.visible = false;
    };
    BaseDropdown.prototype.onEvent = function (e, activeElement) {
        this.hide();
    };
    BaseDropdown.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this.hide();
        if (this.boxContainer) {
            this.boxContainer.remove();
            this.boxContainer = null;
        }
        if (this.contents) {
            this.contents.remove();
            this.contents = null;
        }
        if (this._label) {
            this._label.remove();
            this._label = null;
        }
    };
    return BaseDropdown;
}(ActionRunner));
export { BaseDropdown };
var Dropdown = /** @class */ (function (_super) {
    __extends(Dropdown, _super);
    function Dropdown(container, options) {
        var _this = _super.call(this, container, options) || this;
        _this.contextViewProvider = options.contextViewProvider;
        return _this;
    }
    Dropdown.prototype.show = function () {
        var _this = this;
        _super.prototype.show.call(this);
        addClass(this.element, 'active');
        this.contextViewProvider.showContextView({
            getAnchor: function () { return _this.getAnchor(); },
            render: function (container) {
                return _this.renderContents(container);
            },
            onDOMEvent: function (e, activeElement) {
                _this.onEvent(e, activeElement);
            },
            onHide: function () { return _this.onHide(); }
        });
    };
    Dropdown.prototype.getAnchor = function () {
        return this.element;
    };
    Dropdown.prototype.onHide = function () {
        removeClass(this.element, 'active');
    };
    Dropdown.prototype.hide = function () {
        _super.prototype.hide.call(this);
        if (this.contextViewProvider) {
            this.contextViewProvider.hideContextView();
        }
    };
    Dropdown.prototype.renderContents = function (container) {
        return null;
    };
    return Dropdown;
}(BaseDropdown));
export { Dropdown };
var DropdownMenu = /** @class */ (function (_super) {
    __extends(DropdownMenu, _super);
    function DropdownMenu(container, options) {
        var _this = _super.call(this, container, options) || this;
        _this._contextMenuProvider = options.contextMenuProvider;
        _this.actions = options.actions || [];
        _this.actionProvider = options.actionProvider;
        _this.menuClassName = options.menuClassName || '';
        return _this;
    }
    Object.defineProperty(DropdownMenu.prototype, "menuOptions", {
        get: function () {
            return this._menuOptions;
        },
        set: function (options) {
            this._menuOptions = options;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DropdownMenu.prototype, "actions", {
        get: function () {
            if (this.actionProvider) {
                return this.actionProvider.getActions();
            }
            return this._actions;
        },
        set: function (actions) {
            this._actions = actions;
        },
        enumerable: true,
        configurable: true
    });
    DropdownMenu.prototype.show = function () {
        var _this = this;
        _super.prototype.show.call(this);
        addClass(this.element, 'active');
        this._contextMenuProvider.showContextMenu({
            getAnchor: function () { return _this.element; },
            getActions: function () { return TPromise.as(_this.actions); },
            getActionsContext: function () { return _this.menuOptions ? _this.menuOptions.context : null; },
            getActionItem: function (action) { return _this.menuOptions && _this.menuOptions.actionItemProvider ? _this.menuOptions.actionItemProvider(action) : null; },
            getKeyBinding: function (action) { return _this.menuOptions && _this.menuOptions.getKeyBinding ? _this.menuOptions.getKeyBinding(action) : null; },
            getMenuClassName: function () { return _this.menuClassName; },
            onHide: function () { return _this.onHide(); },
            actionRunner: this.menuOptions ? this.menuOptions.actionRunner : null
        });
    };
    DropdownMenu.prototype.hide = function () {
        _super.prototype.hide.call(this);
    };
    DropdownMenu.prototype.onHide = function () {
        this.hide();
        removeClass(this.element, 'active');
    };
    return DropdownMenu;
}(BaseDropdown));
export { DropdownMenu };
var DropdownMenuActionItem = /** @class */ (function (_super) {
    __extends(DropdownMenuActionItem, _super);
    function DropdownMenuActionItem(action, menuActionsOrProvider, contextMenuProvider, actionItemProvider, actionRunner, keybindings, clazz) {
        var _this = _super.call(this, null, action) || this;
        _this.menuActionsOrProvider = menuActionsOrProvider;
        _this.contextMenuProvider = contextMenuProvider;
        _this.actionItemProvider = actionItemProvider;
        _this.actionRunner = actionRunner;
        _this.keybindings = keybindings;
        _this.clazz = clazz;
        return _this;
    }
    DropdownMenuActionItem.prototype.render = function (container) {
        var _this = this;
        var labelRenderer = function (el) {
            _this.element = append(el, $('a.action-label.icon'));
            addClasses(_this.element, _this.clazz);
            _this.element.tabIndex = 0;
            _this.element.setAttribute('role', 'button');
            _this.element.setAttribute('aria-haspopup', 'true');
            _this.element.title = _this._action.label || '';
            return null;
        };
        var options = {
            contextMenuProvider: this.contextMenuProvider,
            labelRenderer: labelRenderer
        };
        // Render the DropdownMenu around a simple action to toggle it
        if (Array.isArray(this.menuActionsOrProvider)) {
            options.actions = this.menuActionsOrProvider;
        }
        else {
            options.actionProvider = this.menuActionsOrProvider;
        }
        this.dropdownMenu = this._register(new DropdownMenu(container, options));
        this.dropdownMenu.menuOptions = {
            actionItemProvider: this.actionItemProvider,
            actionRunner: this.actionRunner,
            getKeyBinding: this.keybindings,
            context: this._context
        };
    };
    DropdownMenuActionItem.prototype.setActionContext = function (newContext) {
        _super.prototype.setActionContext.call(this, newContext);
        if (this.dropdownMenu) {
            this.dropdownMenu.menuOptions.context = newContext;
        }
    };
    DropdownMenuActionItem.prototype.show = function () {
        if (this.dropdownMenu) {
            this.dropdownMenu.show();
        }
    };
    return DropdownMenuActionItem;
}(BaseActionItem));
export { DropdownMenuActionItem };
