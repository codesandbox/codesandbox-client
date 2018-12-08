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
import { illegalArgument } from '../../../base/common/errors.js';
import * as arrays from '../../../base/common/arrays.js';
import { toDisposable } from '../../../base/common/lifecycle.js';
import { IStorageService } from '../../../platform/storage/common/storage.js';
import { IInstantiationService } from '../../../platform/instantiation/common/instantiation.js';
import { ActionBar, Separator } from '../../../base/browser/ui/actionbar/actionbar.js';
import { CompositeActionItem, CompositeOverflowActivityAction, CompositeOverflowActivityActionItem, DraggedCompositeIdentifier } from './compositeBarActions.js';
import { $, addDisposableListener, EventType, EventHelper } from '../../../base/browser/dom.js';
import { StandardMouseEvent } from '../../../base/browser/mouseEvent.js';
import { IContextMenuService } from '../../../platform/contextview/browser/contextView.js';
import { Widget } from '../../../base/browser/ui/widget.js';
import { isUndefinedOrNull } from '../../../base/common/types.js';
import { LocalSelectionTransfer } from '../dnd.js';
var CompositeBar = /** @class */ (function (_super) {
    __extends(CompositeBar, _super);
    function CompositeBar(options, instantiationService, storageService, contextMenuService) {
        var _this = _super.call(this) || this;
        _this.options = options;
        _this.instantiationService = instantiationService;
        _this.contextMenuService = contextMenuService;
        _this.model = new CompositeBarModel(options, storageService);
        _this.visibleComposites = [];
        _this.compositeSizeInBar = new Map();
        _this.compositeTransfer = LocalSelectionTransfer.getInstance();
        return _this;
    }
    CompositeBar.prototype.getComposites = function () {
        return this.model.items.slice();
    };
    CompositeBar.prototype.getPinnedComposites = function () {
        return this.model.pinnedItems;
    };
    CompositeBar.prototype.create = function (parent) {
        var _this = this;
        var actionBarDiv = parent.appendChild($('.composite-bar'));
        this.compositeSwitcherBar = this._register(new ActionBar(actionBarDiv, {
            actionItemProvider: function (action) {
                if (action instanceof CompositeOverflowActivityAction) {
                    return _this.compositeOverflowActionItem;
                }
                var item = _this.model.findItem(action.id);
                return item && _this.instantiationService.createInstance(CompositeActionItem, action, item.pinnedAction, function () { return _this.getContextMenuActions(); }, _this.options.colors, _this.options.icon, _this);
            },
            orientation: this.options.orientation,
            ariaLabel: nls.localize('activityBarAriaLabel', "Active View Switcher"),
            animated: false,
        }));
        // Contextmenu for composites
        this._register(addDisposableListener(parent, EventType.CONTEXT_MENU, function (e) { return _this.showContextMenu(e); }));
        // Allow to drop at the end to move composites to the end
        this._register(addDisposableListener(parent, EventType.DROP, function (e) {
            if (_this.compositeTransfer.hasData(DraggedCompositeIdentifier.prototype)) {
                EventHelper.stop(e, true);
                var draggedCompositeId = _this.compositeTransfer.getData(DraggedCompositeIdentifier.prototype)[0].id;
                _this.compositeTransfer.clearData(DraggedCompositeIdentifier.prototype);
                var targetItem = _this.model.visibleItems[_this.model.visibleItems.length - 1];
                if (targetItem && targetItem.id !== draggedCompositeId) {
                    _this.move(draggedCompositeId, targetItem.id);
                }
            }
        }));
        return actionBarDiv;
    };
    CompositeBar.prototype.layout = function (dimension) {
        this.dimension = dimension;
        if (dimension.height === 0 || dimension.width === 0) {
            // Do not layout if not visible. Otherwise the size measurment would be computed wrongly
            return;
        }
        if (this.compositeSizeInBar.size === 0) {
            // Compute size of each composite by getting the size from the css renderer
            // Size is later used for overflow computation
            this.computeSizes(this.model.visibleItems);
        }
        this.updateCompositeSwitcher();
    };
    CompositeBar.prototype.addComposite = function (_a) {
        var id = _a.id, name = _a.name, order = _a.order;
        // Add to the model
        if (this.model.add(id, name, order)) {
            this.computeSizes([this.model.findItem(id)]);
            this.updateCompositeSwitcher();
        }
    };
    CompositeBar.prototype.removeComposite = function (id) {
        // If it pinned, unpin it first
        if (this.isPinned(id)) {
            this.unpin(id);
        }
        // Remove from the model
        if (this.model.remove(id)) {
            this.updateCompositeSwitcher();
        }
    };
    CompositeBar.prototype.hideComposite = function (id) {
        if (this.model.hide(id)) {
            this.resetActiveComposite(id);
            this.updateCompositeSwitcher();
        }
    };
    CompositeBar.prototype.activateComposite = function (id) {
        var previousActiveItem = this.model.activeItem;
        if (this.model.activate(id)) {
            // Update if current composite is neither visible nor pinned
            // or previous active composite is not pinned
            if (this.visibleComposites.indexOf(id) === -1 || !this.model.activeItem.pinned || (previousActiveItem && !previousActiveItem.pinned)) {
                this.updateCompositeSwitcher();
            }
        }
    };
    CompositeBar.prototype.deactivateComposite = function (id) {
        var previousActiveItem = this.model.activeItem;
        if (this.model.deactivate()) {
            if (previousActiveItem && !previousActiveItem.pinned) {
                this.updateCompositeSwitcher();
            }
        }
    };
    CompositeBar.prototype.showActivity = function (compositeId, badge, clazz, priority) {
        var _this = this;
        if (!badge) {
            throw illegalArgument('badge');
        }
        if (typeof priority !== 'number') {
            priority = 0;
        }
        var activity = { badge: badge, clazz: clazz, priority: priority };
        this.model.addActivity(compositeId, activity);
        return toDisposable(function () { return _this.model.removeActivity(compositeId, activity); });
    };
    CompositeBar.prototype.pin = function (compositeId, open) {
        var _this = this;
        if (this.model.setPinned(compositeId, true)) {
            this.updateCompositeSwitcher();
            if (open) {
                this.options.openComposite(compositeId).then(function () { return _this.activateComposite(compositeId); }); // Activate after opening
            }
        }
    };
    CompositeBar.prototype.unpin = function (compositeId) {
        if (this.model.setPinned(compositeId, false)) {
            this.updateCompositeSwitcher();
            this.resetActiveComposite(compositeId);
        }
    };
    CompositeBar.prototype.resetActiveComposite = function (compositeId) {
        var defaultCompositeId = this.options.getDefaultCompositeId();
        // Case: composite is not the active one or the active one is a different one
        // Solv: we do nothing
        if (!this.model.activeItem || this.model.activeItem.id !== compositeId) {
            return;
        }
        // Deactivate itself
        this.deactivateComposite(compositeId);
        // Case: composite is not the default composite and default composite is still showing
        // Solv: we open the default composite
        if (defaultCompositeId !== compositeId && this.isPinned(defaultCompositeId)) {
            this.options.openComposite(defaultCompositeId);
        }
        // Case: we closed the last visible composite
        // Solv: we hide the part
        else if (this.visibleComposites.length === 1) {
            this.options.hidePart();
        }
        // Case: we closed the default composite
        // Solv: we open the next visible composite from top
        else {
            this.options.openComposite(this.visibleComposites.filter(function (cid) { return cid !== compositeId; })[0]);
        }
    };
    CompositeBar.prototype.isPinned = function (compositeId) {
        var item = this.model.findItem(compositeId);
        return item && item.pinned;
    };
    CompositeBar.prototype.move = function (compositeId, toCompositeId) {
        var _this = this;
        if (this.model.move(compositeId, toCompositeId)) {
            // timeout helps to prevent artifacts from showing up
            setTimeout(function () { return _this.updateCompositeSwitcher(); }, 0);
        }
    };
    CompositeBar.prototype.getAction = function (compositeId) {
        var item = this.model.findItem(compositeId);
        return item && item.activityAction;
    };
    CompositeBar.prototype.computeSizes = function (items) {
        var _this = this;
        var size = this.options.compositeSize;
        if (size) {
            items.forEach(function (composite) { return _this.compositeSizeInBar.set(composite.id, size); });
        }
        else {
            if (this.dimension && this.dimension.height !== 0 && this.dimension.width !== 0) {
                // Compute sizes only if visible. Otherwise the size measurment would be computed wrongly.
                var currentItemsLength_1 = this.compositeSwitcherBar.items.length;
                this.compositeSwitcherBar.push(items.map(function (composite) { return composite.activityAction; }));
                items.map(function (composite, index) { return _this.compositeSizeInBar.set(composite.id, _this.options.orientation === 2 /* VERTICAL */
                    ? _this.compositeSwitcherBar.getHeight(currentItemsLength_1 + index)
                    : _this.compositeSwitcherBar.getWidth(currentItemsLength_1 + index)); });
                items.forEach(function () { return _this.compositeSwitcherBar.pull(_this.compositeSwitcherBar.items.length - 1); });
            }
        }
    };
    CompositeBar.prototype.updateCompositeSwitcher = function () {
        var _this = this;
        if (!this.compositeSwitcherBar || !this.dimension) {
            return; // We have not been rendered yet so there is nothing to update.
        }
        var compositesToShow = this.model.visibleItems.filter(function (item) {
            return item.pinned
                || (_this.model.activeItem && _this.model.activeItem.id === item.id);
        } /* Show the active composite even if it is not pinned */).map(function (item) { return item.id; });
        // Ensure we are not showing more composites than we have height for
        var overflows = false;
        var maxVisible = compositesToShow.length;
        var size = 0;
        var limit = this.options.orientation === 2 /* VERTICAL */ ? this.dimension.height : this.dimension.width;
        for (var i = 0; i < compositesToShow.length && size <= limit; i++) {
            size += this.compositeSizeInBar.get(compositesToShow[i]);
            if (size > limit) {
                maxVisible = i;
            }
        }
        overflows = compositesToShow.length > maxVisible;
        if (overflows) {
            size -= this.compositeSizeInBar.get(compositesToShow[maxVisible]);
            compositesToShow = compositesToShow.slice(0, maxVisible);
            size += this.options.overflowActionSize;
        }
        // Check if we need to make extra room for the overflow action
        if (size > limit) {
            size -= this.compositeSizeInBar.get(compositesToShow.pop());
        }
        // We always try show the active composite
        if (this.model.activeItem && compositesToShow.every(function (compositeId) { return compositeId !== _this.model.activeItem.id; })) {
            var removedComposite = compositesToShow.pop();
            size = size - this.compositeSizeInBar.get(removedComposite) + this.compositeSizeInBar.get(this.model.activeItem.id);
            compositesToShow.push(this.model.activeItem.id);
        }
        // The active composite might have bigger size than the removed composite, check for overflow again
        if (size > limit) {
            compositesToShow.length ? compositesToShow.splice(compositesToShow.length - 2, 1) : compositesToShow.pop();
        }
        var visibleCompositesChange = !arrays.equals(compositesToShow, this.visibleComposites);
        // Pull out overflow action if there is a composite change so that we can add it to the end later
        if (this.compositeOverflowAction && visibleCompositesChange) {
            this.compositeSwitcherBar.pull(this.compositeSwitcherBar.length() - 1);
            this.compositeOverflowAction.dispose();
            this.compositeOverflowAction = null;
            this.compositeOverflowActionItem.dispose();
            this.compositeOverflowActionItem = null;
        }
        // Pull out composites that overflow or got hidden
        var compositesToRemove = [];
        this.visibleComposites.forEach(function (compositeId, index) {
            if (compositesToShow.indexOf(compositeId) === -1) {
                compositesToRemove.push(index);
            }
        });
        compositesToRemove.reverse().forEach(function (index) {
            var actionItem = _this.compositeSwitcherBar.items[index];
            _this.compositeSwitcherBar.pull(index);
            actionItem.dispose();
            _this.visibleComposites.splice(index, 1);
        });
        // Update the positions of the composites
        compositesToShow.forEach(function (compositeId, newIndex) {
            var currentIndex = _this.visibleComposites.indexOf(compositeId);
            if (newIndex !== currentIndex) {
                if (currentIndex !== -1) {
                    var actionItem = _this.compositeSwitcherBar.items[currentIndex];
                    _this.compositeSwitcherBar.pull(currentIndex);
                    actionItem.dispose();
                    _this.visibleComposites.splice(currentIndex, 1);
                }
                _this.compositeSwitcherBar.push(_this.model.findItem(compositeId).activityAction, { label: true, icon: _this.options.icon, index: newIndex });
                _this.visibleComposites.splice(newIndex, 0, compositeId);
            }
        });
        // Add overflow action as needed
        if ((visibleCompositesChange && overflows) || this.compositeSwitcherBar.length() === 0) {
            this.compositeOverflowAction = this.instantiationService.createInstance(CompositeOverflowActivityAction, function () { return _this.compositeOverflowActionItem.showMenu(); });
            this.compositeOverflowActionItem = this.instantiationService.createInstance(CompositeOverflowActivityActionItem, this.compositeOverflowAction, function () { return _this.getOverflowingComposites(); }, function () { return _this.model.activeItem ? _this.model.activeItem.id : void 0; }, function (compositeId) {
                var item = _this.model.findItem(compositeId);
                return item && item.activity[0] && item.activity[0].badge;
            }, this.options.getOnCompositeClickAction, this.options.colors);
            this.compositeSwitcherBar.push(this.compositeOverflowAction, { label: false, icon: true });
        }
        // Persist
        this.model.saveState();
    };
    CompositeBar.prototype.getOverflowingComposites = function () {
        var _this = this;
        var overflowingIds = this.model.visibleItems.filter(function (item) { return item.pinned; }).map(function (item) { return item.id; });
        // Show the active composite even if it is not pinned
        if (this.model.activeItem && !this.model.activeItem.pinned) {
            overflowingIds.push(this.model.activeItem.id);
        }
        overflowingIds = overflowingIds.filter(function (compositeId) { return _this.visibleComposites.indexOf(compositeId) === -1; });
        return this.model.visibleItems.filter(function (c) { return overflowingIds.indexOf(c.id) !== -1; });
    };
    CompositeBar.prototype.showContextMenu = function (e) {
        var _this = this;
        EventHelper.stop(e, true);
        var event = new StandardMouseEvent(e);
        this.contextMenuService.showContextMenu({
            getAnchor: function () { return { x: event.posx, y: event.posy }; },
            getActions: function () { return _this.getContextMenuActions(); }
        });
    };
    CompositeBar.prototype.getContextMenuActions = function () {
        var _this = this;
        var actions = this.model.visibleItems
            .map(function (_a) {
            var id = _a.id, name = _a.name, activityAction = _a.activityAction;
            return ({
                id: id,
                label: name || id,
                checked: _this.isPinned(id),
                enabled: activityAction.enabled,
                run: function () {
                    if (_this.isPinned(id)) {
                        _this.unpin(id);
                    }
                    else {
                        _this.pin(id, true);
                    }
                }
            });
        });
        var otherActions = this.options.getContextMenuActions();
        if (otherActions.length) {
            actions.push(new Separator());
            actions.push.apply(actions, otherActions);
        }
        return actions;
    };
    CompositeBar = __decorate([
        __param(1, IInstantiationService),
        __param(2, IStorageService),
        __param(3, IContextMenuService)
    ], CompositeBar);
    return CompositeBar;
}(Widget));
export { CompositeBar };
var CompositeBarModel = /** @class */ (function () {
    function CompositeBarModel(options, storageService) {
        this.storageService = storageService;
        this.options = options;
        this.items = this.loadItemStates();
    }
    Object.defineProperty(CompositeBarModel.prototype, "visibleItems", {
        get: function () {
            return this.items.filter(function (item) { return item.visible; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CompositeBarModel.prototype, "pinnedItems", {
        get: function () {
            return this.items.filter(function (item) { return item.visible && item.pinned; });
        },
        enumerable: true,
        configurable: true
    });
    CompositeBarModel.prototype.createCompositeBarItem = function (id, name, order, pinned, visible) {
        var options = this.options;
        return {
            id: id, name: name, pinned: pinned, order: order, visible: visible,
            activity: [],
            get activityAction() {
                return options.getActivityAction(id);
            },
            get pinnedAction() {
                return options.getCompositePinnedAction(id);
            }
        };
    };
    CompositeBarModel.prototype.add = function (id, name, order) {
        var item = this.findItem(id);
        if (item) {
            var changed = false;
            item.name = name;
            if (!isUndefinedOrNull(order)) {
                changed = item.order !== order;
                item.order = order;
            }
            if (!item.visible) {
                item.visible = true;
                changed = true;
            }
            return changed;
        }
        else {
            var item_1 = this.createCompositeBarItem(id, name, order, true, true);
            if (isUndefinedOrNull(order)) {
                this.items.push(item_1);
            }
            else {
                var index = 0;
                while (index < this.items.length && this.items[index].order < order) {
                    index++;
                }
                this.items.splice(index, 0, item_1);
            }
            return true;
        }
    };
    CompositeBarModel.prototype.remove = function (id) {
        for (var index = 0; index < this.items.length; index++) {
            if (this.items[index].id === id) {
                this.items.splice(index, 1);
                return true;
            }
        }
        return false;
    };
    CompositeBarModel.prototype.hide = function (id) {
        for (var _i = 0, _a = this.items; _i < _a.length; _i++) {
            var item = _a[_i];
            if (item.id === id) {
                if (item.visible) {
                    item.visible = false;
                    return true;
                }
                return false;
            }
        }
        return false;
    };
    CompositeBarModel.prototype.move = function (compositeId, toCompositeId) {
        var fromIndex = this.findIndex(compositeId);
        var toIndex = this.findIndex(toCompositeId);
        // Make sure both items are known to the model
        if (fromIndex === -1 || toIndex === -1) {
            return false;
        }
        var sourceItem = this.items.splice(fromIndex, 1)[0];
        this.items.splice(toIndex, 0, sourceItem);
        // Make sure a moved composite gets pinned
        sourceItem.pinned = true;
        return true;
    };
    CompositeBarModel.prototype.setPinned = function (id, pinned) {
        for (var index = 0; index < this.items.length; index++) {
            var item = this.items[index];
            if (item.id === id) {
                if (item.pinned !== pinned) {
                    item.pinned = pinned;
                    return true;
                }
                return false;
            }
        }
        return false;
    };
    CompositeBarModel.prototype.addActivity = function (id, activity) {
        var item = this.findItem(id);
        if (item) {
            var stack = item.activity;
            for (var i = 0; i <= stack.length; i++) {
                if (i === stack.length) {
                    stack.push(activity);
                    break;
                }
                else if (stack[i].priority <= activity.priority) {
                    stack.splice(i, 0, activity);
                    break;
                }
            }
            this.updateActivity(id);
            return true;
        }
        return false;
    };
    CompositeBarModel.prototype.removeActivity = function (id, activity) {
        var item = this.findItem(id);
        if (item) {
            var index = item.activity.indexOf(activity);
            if (index !== -1) {
                item.activity.splice(index, 1);
                this.updateActivity(id);
                return true;
            }
        }
        return false;
    };
    CompositeBarModel.prototype.updateActivity = function (id) {
        var item = this.findItem(id);
        if (item) {
            if (item.activity.length) {
                var _a = item.activity[0], badge = _a.badge, clazz = _a.clazz;
                item.activityAction.setBadge(badge, clazz);
            }
            else {
                item.activityAction.setBadge(undefined);
            }
        }
    };
    CompositeBarModel.prototype.activate = function (id) {
        if (!this.activeItem || this.activeItem.id !== id) {
            if (this.activeItem) {
                this.deactivate();
            }
            for (var index = 0; index < this.items.length; index++) {
                var item = this.items[index];
                if (item.id === id) {
                    this.activeItem = item;
                    this.activeItem.activityAction.activate();
                    return true;
                }
            }
        }
        return false;
    };
    CompositeBarModel.prototype.deactivate = function () {
        if (this.activeItem) {
            this.activeItem.activityAction.deactivate();
            this.activeItem = void 0;
            return true;
        }
        return false;
    };
    CompositeBarModel.prototype.findItem = function (id) {
        return this.items.filter(function (item) { return item.id === id; })[0];
    };
    CompositeBarModel.prototype.findIndex = function (id) {
        for (var index = 0; index < this.items.length; index++) {
            if (this.items[index].id === id) {
                return index;
            }
        }
        return -1;
    };
    CompositeBarModel.prototype.loadItemStates = function () {
        var _this = this;
        var storedStates = JSON.parse(this.storageService.get(this.options.storageId, 0 /* GLOBAL */, '[]'));
        return storedStates.map(function (c) {
            var serialized = typeof c === 'string' /* migration from pinned states to composites states */ ? { id: c, pinned: true, order: void 0, visible: true } : c;
            return _this.createCompositeBarItem(serialized.id, void 0, serialized.order, serialized.pinned, isUndefinedOrNull(serialized.visible) ? true : serialized.visible);
        });
    };
    CompositeBarModel.prototype.saveState = function () {
        var serialized = this.items.map(function (_a) {
            var id = _a.id, pinned = _a.pinned, order = _a.order, visible = _a.visible;
            return ({ id: id, pinned: pinned, order: order, visible: visible });
        });
        this.storageService.store(this.options.storageId, JSON.stringify(serialized), 0 /* GLOBAL */);
    };
    return CompositeBarModel;
}());
