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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import * as nls from '../../../nls.js';
import { Action } from '../../../base/common/actions.js';
import * as dom from '../../../base/browser/dom.js';
import { BaseActionItem, Separator } from '../../../base/browser/ui/actionbar/actionbar.js';
import { ICommandService } from '../../../platform/commands/common/commands.js';
import { dispose, Disposable, toDisposable } from '../../../base/common/lifecycle.js';
import { IContextMenuService } from '../../../platform/contextview/browser/contextView.js';
import { IThemeService } from '../../../platform/theme/common/themeService.js';
import { TextBadge, NumberBadge, IconBadge, ProgressBadge } from '../../services/activity/common/activity.js';
import { IInstantiationService } from '../../../platform/instantiation/common/instantiation.js';
import { contrastBorder } from '../../../platform/theme/common/colorRegistry.js';
import { DelayedDragHandler } from '../../../base/browser/dnd.js';
import { IKeybindingService } from '../../../platform/keybinding/common/keybinding.js';
import { Emitter } from '../../../base/common/event.js';
import { DragAndDropObserver, LocalSelectionTransfer } from '../dnd.js';
var ActivityAction = /** @class */ (function (_super) {
    __extends(ActivityAction, _super);
    function ActivityAction(_activity) {
        var _this = _super.call(this, _activity.id, _activity.name, _activity.cssClass) || this;
        _this._activity = _activity;
        _this._onDidChangeActivity = new Emitter();
        _this._onDidChangeBadge = new Emitter();
        _this.badge = null;
        return _this;
    }
    Object.defineProperty(ActivityAction.prototype, "onDidChangeActivity", {
        get: function () { return this._onDidChangeActivity.event; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivityAction.prototype, "onDidChangeBadge", {
        get: function () { return this._onDidChangeBadge.event; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivityAction.prototype, "activity", {
        get: function () {
            return this._activity;
        },
        set: function (activity) {
            this._activity = activity;
            this._onDidChangeActivity.fire(this);
        },
        enumerable: true,
        configurable: true
    });
    ActivityAction.prototype.activate = function () {
        if (!this.checked) {
            this._setChecked(true);
        }
    };
    ActivityAction.prototype.deactivate = function () {
        if (this.checked) {
            this._setChecked(false);
        }
    };
    ActivityAction.prototype.getBadge = function () {
        return this.badge;
    };
    ActivityAction.prototype.getClass = function () {
        return this.clazz;
    };
    ActivityAction.prototype.setBadge = function (badge, clazz) {
        this.badge = badge;
        this.clazz = clazz;
        this._onDidChangeBadge.fire(this);
    };
    ActivityAction.prototype.dispose = function () {
        this._onDidChangeActivity.dispose();
        this._onDidChangeBadge.dispose();
        _super.prototype.dispose.call(this);
    };
    return ActivityAction;
}(Action));
export { ActivityAction };
var ActivityActionItem = /** @class */ (function (_super) {
    __extends(ActivityActionItem, _super);
    function ActivityActionItem(action, options, themeService) {
        var _this = _super.call(this, null, action, options) || this;
        _this.themeService = themeService;
        _this.badgeDisposable = Disposable.None;
        _this._register(_this.themeService.onThemeChange(_this.onThemeChange, _this));
        _this._register(action.onDidChangeActivity(_this.updateActivity, _this));
        _this._register(action.onDidChangeBadge(_this.updateBadge, _this));
        return _this;
    }
    Object.defineProperty(ActivityActionItem.prototype, "activity", {
        get: function () {
            return this._action.activity;
        },
        enumerable: true,
        configurable: true
    });
    ActivityActionItem.prototype.updateStyles = function () {
        var theme = this.themeService.getTheme();
        var colors = this.options.colors(theme);
        if (this.label) {
            if (this.options.icon) {
                var foreground = this._action.checked ? colors.activeBackgroundColor || colors.activeForegroundColor : colors.inactiveBackgroundColor || colors.inactiveForegroundColor;
                this.label.style.backgroundColor = foreground ? foreground.toString() : null;
            }
            else {
                var foreground = this._action.checked ? colors.activeForegroundColor : colors.inactiveForegroundColor;
                var borderBottomColor = this._action.checked ? colors.activeBorderBottomColor : null;
                this.label.style.color = foreground ? foreground.toString() : null;
                this.label.style.borderBottomColor = borderBottomColor ? borderBottomColor.toString() : null;
            }
        }
        // Badge
        if (this.badgeContent) {
            var badgeForeground = colors.badgeForeground;
            var badgeBackground = colors.badgeBackground;
            var contrastBorderColor = theme.getColor(contrastBorder);
            this.badgeContent.style.color = badgeForeground ? badgeForeground.toString() : null;
            this.badgeContent.style.backgroundColor = badgeBackground ? badgeBackground.toString() : null;
            this.badgeContent.style.borderStyle = contrastBorderColor ? 'solid' : null;
            this.badgeContent.style.borderWidth = contrastBorderColor ? '1px' : null;
            this.badgeContent.style.borderColor = contrastBorderColor ? contrastBorderColor.toString() : null;
        }
    };
    ActivityActionItem.prototype.render = function (container) {
        var _this = this;
        _super.prototype.render.call(this, container);
        this.container = container;
        // Make the container tab-able for keyboard navigation
        this.container.tabIndex = 0;
        this.container.setAttribute('role', this.options.icon ? 'button' : 'tab');
        // Try hard to prevent keyboard only focus feedback when using mouse
        this._register(dom.addDisposableListener(this.container, dom.EventType.MOUSE_DOWN, function () {
            dom.addClass(_this.container, 'clicked');
        }));
        this._register(dom.addDisposableListener(this.container, dom.EventType.MOUSE_UP, function () {
            if (_this.mouseUpTimeout) {
                clearTimeout(_this.mouseUpTimeout);
            }
            _this.mouseUpTimeout = setTimeout(function () {
                dom.removeClass(_this.container, 'clicked');
            }, 800); // delayed to prevent focus feedback from showing on mouse up
        }));
        // Label
        this.label = dom.append(this.element, dom.$('a.action-label'));
        // Badge
        this.badge = dom.append(this.element, dom.$('.badge'));
        this.badgeContent = dom.append(this.badge, dom.$('.badge-content'));
        dom.hide(this.badge);
        this.updateActivity();
        this.updateStyles();
    };
    ActivityActionItem.prototype.onThemeChange = function (theme) {
        this.updateStyles();
    };
    ActivityActionItem.prototype.updateActivity = function () {
        this.updateLabel();
        this.updateTitle(this.activity.name);
        this.updateBadge();
    };
    ActivityActionItem.prototype.updateBadge = function () {
        var _this = this;
        var action = this.getAction();
        if (!this.badge || !this.badgeContent || !(action instanceof ActivityAction)) {
            return;
        }
        var badge = action.getBadge();
        var clazz = action.getClass();
        this.badgeDisposable.dispose();
        this.badgeDisposable = Disposable.None;
        dom.clearNode(this.badgeContent);
        dom.hide(this.badge);
        if (badge) {
            // Number
            if (badge instanceof NumberBadge) {
                if (badge.number) {
                    var number = badge.number.toString();
                    if (badge.number > 999) {
                        var noOfThousands = badge.number / 1000;
                        var floor = Math.floor(noOfThousands);
                        if (noOfThousands > floor) {
                            number = nls.localize('largeNumberBadge1', '{0}k+', floor);
                        }
                        else {
                            number = nls.localize('largeNumberBadge2', '{0}k', noOfThousands);
                        }
                    }
                    this.badgeContent.textContent = number;
                    dom.show(this.badge);
                }
            }
            // Text
            else if (badge instanceof TextBadge) {
                this.badgeContent.textContent = badge.text;
                dom.show(this.badge);
            }
            // Text
            else if (badge instanceof IconBadge) {
                dom.show(this.badge);
            }
            // Progress
            else if (badge instanceof ProgressBadge) {
                dom.show(this.badge);
            }
            if (clazz) {
                dom.addClasses(this.badge, clazz);
                this.badgeDisposable = toDisposable(function () { return dom.removeClasses(_this.badge, clazz); });
            }
        }
        // Title
        var title;
        if (badge && badge.getDescription()) {
            if (this.activity.name) {
                title = nls.localize('badgeTitle', "{0} - {1}", this.activity.name, badge.getDescription());
            }
            else {
                title = badge.getDescription();
            }
        }
        else {
            title = this.activity.name;
        }
        this.updateTitle(title);
    };
    ActivityActionItem.prototype.updateLabel = function () {
        if (this.activity.cssClass) {
            dom.addClasses(this.label, this.activity.cssClass);
        }
        if (!this.options.icon) {
            this.label.textContent = this.getAction().label;
        }
    };
    ActivityActionItem.prototype.updateTitle = function (title) {
        [this.label, this.badge, this.container].forEach(function (element) {
            if (element) {
                element.setAttribute('aria-label', title);
                element.title = title;
            }
        });
    };
    ActivityActionItem.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        if (this.mouseUpTimeout) {
            clearTimeout(this.mouseUpTimeout);
        }
        this.badge.remove();
    };
    ActivityActionItem = __decorate([
        __param(2, IThemeService)
    ], ActivityActionItem);
    return ActivityActionItem;
}(BaseActionItem));
export { ActivityActionItem };
var CompositeOverflowActivityAction = /** @class */ (function (_super) {
    __extends(CompositeOverflowActivityAction, _super);
    function CompositeOverflowActivityAction(showMenu) {
        var _this = _super.call(this, {
            id: 'additionalComposites.action',
            name: nls.localize('additionalViews', "Additional Views"),
            cssClass: 'toggle-more'
        }) || this;
        _this.showMenu = showMenu;
        return _this;
    }
    CompositeOverflowActivityAction.prototype.run = function (event) {
        this.showMenu();
        return Promise.resolve(true);
    };
    return CompositeOverflowActivityAction;
}(ActivityAction));
export { CompositeOverflowActivityAction };
var CompositeOverflowActivityActionItem = /** @class */ (function (_super) {
    __extends(CompositeOverflowActivityActionItem, _super);
    function CompositeOverflowActivityActionItem(action, getOverflowingComposites, getActiveCompositeId, getBadge, getCompositeOpenAction, colors, contextMenuService, themeService) {
        var _this = _super.call(this, action, { icon: true, colors: colors }, themeService) || this;
        _this.getOverflowingComposites = getOverflowingComposites;
        _this.getActiveCompositeId = getActiveCompositeId;
        _this.getBadge = getBadge;
        _this.getCompositeOpenAction = getCompositeOpenAction;
        _this.contextMenuService = contextMenuService;
        return _this;
    }
    CompositeOverflowActivityActionItem.prototype.showMenu = function () {
        var _this = this;
        if (this.actions) {
            dispose(this.actions);
        }
        this.actions = this.getActions();
        this.contextMenuService.showContextMenu({
            getAnchor: function () { return _this.element; },
            getActions: function () { return _this.actions; },
            onHide: function () { return dispose(_this.actions); }
        });
    };
    CompositeOverflowActivityActionItem.prototype.getActions = function () {
        var _this = this;
        return this.getOverflowingComposites().map(function (composite) {
            var action = _this.getCompositeOpenAction(composite.id);
            action.radio = _this.getActiveCompositeId() === action.id;
            var badge = _this.getBadge(composite.id);
            var suffix;
            if (badge instanceof NumberBadge) {
                suffix = badge.number;
            }
            else if (badge instanceof TextBadge) {
                suffix = badge.text;
            }
            if (suffix) {
                action.label = nls.localize('numberBadge', "{0} ({1})", composite.name, suffix);
            }
            else {
                action.label = composite.name;
            }
            return action;
        });
    };
    CompositeOverflowActivityActionItem.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this.actions = dispose(this.actions);
    };
    CompositeOverflowActivityActionItem = __decorate([
        __param(6, IContextMenuService),
        __param(7, IThemeService)
    ], CompositeOverflowActivityActionItem);
    return CompositeOverflowActivityActionItem;
}(ActivityActionItem));
export { CompositeOverflowActivityActionItem };
var ManageExtensionAction = /** @class */ (function (_super) {
    __extends(ManageExtensionAction, _super);
    function ManageExtensionAction(commandService) {
        var _this = _super.call(this, 'activitybar.manage.extension', nls.localize('manageExtension', "Manage Extension")) || this;
        _this.commandService = commandService;
        return _this;
    }
    ManageExtensionAction.prototype.run = function (id) {
        return this.commandService.executeCommand('_extensions.manage', id);
    };
    ManageExtensionAction = __decorate([
        __param(0, ICommandService)
    ], ManageExtensionAction);
    return ManageExtensionAction;
}(Action));
var DraggedCompositeIdentifier = /** @class */ (function () {
    function DraggedCompositeIdentifier(_compositeId) {
        this._compositeId = _compositeId;
    }
    Object.defineProperty(DraggedCompositeIdentifier.prototype, "id", {
        get: function () {
            return this._compositeId;
        },
        enumerable: true,
        configurable: true
    });
    return DraggedCompositeIdentifier;
}());
export { DraggedCompositeIdentifier };
var CompositeActionItem = /** @class */ (function (_super) {
    __extends(CompositeActionItem, _super);
    function CompositeActionItem(compositeActivityAction, toggleCompositePinnedAction, contextMenuActionsProvider, colors, icon, compositeBar, contextMenuService, keybindingService, instantiationService, themeService) {
        var _this = _super.call(this, compositeActivityAction, { draggable: true, colors: colors, icon: icon }, themeService) || this;
        _this.compositeActivityAction = compositeActivityAction;
        _this.toggleCompositePinnedAction = toggleCompositePinnedAction;
        _this.contextMenuActionsProvider = contextMenuActionsProvider;
        _this.compositeBar = compositeBar;
        _this.contextMenuService = contextMenuService;
        _this.keybindingService = keybindingService;
        _this.cssClass = compositeActivityAction.class;
        _this.compositeTransfer = LocalSelectionTransfer.getInstance();
        if (!CompositeActionItem.manageExtensionAction) {
            CompositeActionItem.manageExtensionAction = instantiationService.createInstance(ManageExtensionAction);
        }
        _this._register(compositeActivityAction.onDidChangeActivity(function () { _this.compositeActivity = null; _this.updateActivity(); }, _this));
        return _this;
    }
    Object.defineProperty(CompositeActionItem.prototype, "activity", {
        get: function () {
            if (!this.compositeActivity) {
                var activityName = void 0;
                var keybinding = this.getKeybindingLabel(this.compositeActivityAction.activity.keybindingId);
                if (keybinding) {
                    activityName = nls.localize('titleKeybinding', "{0} ({1})", this.compositeActivityAction.activity.name, keybinding);
                }
                else {
                    activityName = this.compositeActivityAction.activity.name;
                }
                this.compositeActivity = {
                    id: this.compositeActivityAction.activity.id,
                    cssClass: this.cssClass,
                    name: activityName
                };
            }
            return this.compositeActivity;
        },
        enumerable: true,
        configurable: true
    });
    CompositeActionItem.prototype.getKeybindingLabel = function (id) {
        var kb = this.keybindingService.lookupKeybinding(id);
        if (kb) {
            return kb.getLabel();
        }
        return null;
    };
    CompositeActionItem.prototype.render = function (container) {
        var _this = this;
        _super.prototype.render.call(this, container);
        this.updateChecked();
        this.updateEnabled();
        this._register(dom.addDisposableListener(this.container, dom.EventType.CONTEXT_MENU, function (e) {
            dom.EventHelper.stop(e, true);
            _this.showContextMenu(container);
        }));
        // Allow to drag
        this._register(dom.addDisposableListener(this.container, dom.EventType.DRAG_START, function (e) {
            e.dataTransfer.effectAllowed = 'move';
            // Registe as dragged to local transfer
            _this.compositeTransfer.setData([new DraggedCompositeIdentifier(_this.activity.id)], DraggedCompositeIdentifier.prototype);
            // Trigger the action even on drag start to prevent clicks from failing that started a drag
            if (!_this.getAction().checked) {
                _this.getAction().run();
            }
        }));
        this._register(new DragAndDropObserver(this.container, {
            onDragEnter: function (e) {
                if (_this.compositeTransfer.hasData(DraggedCompositeIdentifier.prototype) && _this.compositeTransfer.getData(DraggedCompositeIdentifier.prototype)[0].id !== _this.activity.id) {
                    _this.updateFromDragging(container, true);
                }
            },
            onDragLeave: function (e) {
                if (_this.compositeTransfer.hasData(DraggedCompositeIdentifier.prototype)) {
                    _this.updateFromDragging(container, false);
                }
            },
            onDragEnd: function (e) {
                if (_this.compositeTransfer.hasData(DraggedCompositeIdentifier.prototype)) {
                    _this.updateFromDragging(container, false);
                    _this.compositeTransfer.clearData(DraggedCompositeIdentifier.prototype);
                }
            },
            onDrop: function (e) {
                dom.EventHelper.stop(e, true);
                if (_this.compositeTransfer.hasData(DraggedCompositeIdentifier.prototype)) {
                    var draggedCompositeId = _this.compositeTransfer.getData(DraggedCompositeIdentifier.prototype)[0].id;
                    if (draggedCompositeId !== _this.activity.id) {
                        _this.updateFromDragging(container, false);
                        _this.compositeTransfer.clearData(DraggedCompositeIdentifier.prototype);
                        _this.compositeBar.move(draggedCompositeId, _this.activity.id);
                    }
                }
            }
        }));
        // Activate on drag over to reveal targets
        [this.badge, this.label].forEach(function (b) { return new DelayedDragHandler(b, function () {
            if (!_this.compositeTransfer.hasData(DraggedCompositeIdentifier.prototype) && !_this.getAction().checked) {
                _this.getAction().run();
            }
        }); });
        this.updateStyles();
    };
    CompositeActionItem.prototype.updateFromDragging = function (element, isDragging) {
        var theme = this.themeService.getTheme();
        var dragBackground = this.options.colors(theme).dragAndDropBackground;
        element.style.backgroundColor = isDragging && dragBackground ? dragBackground.toString() : null;
    };
    CompositeActionItem.prototype.showContextMenu = function (container) {
        var _this = this;
        var actions = [this.toggleCompositePinnedAction];
        if (this.compositeActivityAction.activity.extensionId) {
            actions.push(new Separator());
            actions.push(CompositeActionItem.manageExtensionAction);
        }
        var isPinned = this.compositeBar.isPinned(this.activity.id);
        if (isPinned) {
            this.toggleCompositePinnedAction.label = nls.localize('hide', "Hide");
            this.toggleCompositePinnedAction.checked = false;
        }
        else {
            this.toggleCompositePinnedAction.label = nls.localize('keep', "Keep");
        }
        var otherActions = this.contextMenuActionsProvider();
        if (otherActions.length) {
            actions.push(new Separator());
            actions.push.apply(actions, otherActions);
        }
        var elementPosition = dom.getDomNodePagePosition(container);
        var anchor = {
            x: Math.floor(elementPosition.left + (elementPosition.width / 2)),
            y: elementPosition.top + elementPosition.height
        };
        this.contextMenuService.showContextMenu({
            getAnchor: function () { return anchor; },
            getActionsContext: function () { return _this.activity.id; },
            getActions: function () { return actions; }
        });
    };
    CompositeActionItem.prototype.focus = function () {
        this.container.focus();
    };
    CompositeActionItem.prototype.updateClass = function () {
        if (this.cssClass) {
            dom.removeClasses(this.label, this.cssClass);
        }
        this.cssClass = this.getAction().class;
        if (this.cssClass) {
            dom.addClasses(this.label, this.cssClass);
        }
    };
    CompositeActionItem.prototype.updateChecked = function () {
        if (this.getAction().checked) {
            dom.addClass(this.container, 'checked');
            this.container.setAttribute('aria-label', nls.localize('compositeActive', "{0} active", this.container.title));
        }
        else {
            dom.removeClass(this.container, 'checked');
            this.container.setAttribute('aria-label', this.container.title);
        }
        this.updateStyles();
    };
    CompositeActionItem.prototype.updateEnabled = function () {
        if (this.getAction().enabled) {
            dom.removeClass(this.element, 'disabled');
        }
        else {
            dom.addClass(this.element, 'disabled');
        }
    };
    CompositeActionItem.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this.compositeTransfer.clearData(DraggedCompositeIdentifier.prototype);
        this.label.remove();
    };
    CompositeActionItem = __decorate([
        __param(6, IContextMenuService),
        __param(7, IKeybindingService),
        __param(8, IInstantiationService),
        __param(9, IThemeService)
    ], CompositeActionItem);
    return CompositeActionItem;
}(ActivityActionItem));
export { CompositeActionItem };
var ToggleCompositePinnedAction = /** @class */ (function (_super) {
    __extends(ToggleCompositePinnedAction, _super);
    function ToggleCompositePinnedAction(activity, compositeBar) {
        var _this = _super.call(this, 'show.toggleCompositePinned', activity ? activity.name : nls.localize('toggle', "Toggle View Pinned")) || this;
        _this.activity = activity;
        _this.compositeBar = compositeBar;
        _this.checked = _this.activity && _this.compositeBar.isPinned(_this.activity.id);
        return _this;
    }
    ToggleCompositePinnedAction.prototype.run = function (context) {
        var id = this.activity ? this.activity.id : context;
        if (this.compositeBar.isPinned(id)) {
            this.compositeBar.unpin(id);
        }
        else {
            this.compositeBar.pin(id);
        }
        return Promise.resolve(true);
    };
    return ToggleCompositePinnedAction;
}(Action));
export { ToggleCompositePinnedAction };
