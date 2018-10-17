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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import './media/views.css';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { IViewsService, ViewsRegistry, Extensions as ViewContainerExtensions, TEST_VIEW_CONTAINER_ID } from '../../../common/views.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { Extensions as ViewletExtensions } from '../../viewlet.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { ILifecycleService } from '../../../../platform/lifecycle/common/lifecycle.js';
import { IViewletService } from '../../../services/viewlet/browser/viewlet.js';
import { IContextKeyService, RawContextKey, ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { chain, filterEvent, Emitter } from '../../../../base/common/event.js';
import { sortedDiff, firstIndex, move } from '../../../../base/common/arrays.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { isUndefinedOrNull } from '../../../../base/common/types.js';
import { MenuId, MenuRegistry } from '../../../../platform/actions/common/actions.js';
import { CommandsRegistry } from '../../../../platform/commands/common/commands.js';
import { localize } from '../../../../nls.js';
import { KeybindingsRegistry } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
function filterViewEvent(container, event) {
    return chain(event)
        .map(function (views) { return views.filter(function (view) { return view.container === container; }); })
        .filter(function (views) { return views.length > 0; })
        .event;
}
var CounterSet = /** @class */ (function () {
    function CounterSet() {
        this.map = new Map();
    }
    CounterSet.prototype.add = function (value) {
        this.map.set(value, (this.map.get(value) || 0) + 1);
        return this;
    };
    CounterSet.prototype.delete = function (value) {
        var counter = this.map.get(value) || 0;
        if (counter === 0) {
            return false;
        }
        counter--;
        if (counter === 0) {
            this.map.delete(value);
        }
        else {
            this.map.set(value, counter);
        }
        return true;
    };
    CounterSet.prototype.has = function (value) {
        return this.map.has(value);
    };
    return CounterSet;
}());
var ViewDescriptorCollection = /** @class */ (function (_super) {
    __extends(ViewDescriptorCollection, _super);
    function ViewDescriptorCollection(container, contextKeyService) {
        var _this = _super.call(this) || this;
        _this.contextKeyService = contextKeyService;
        _this.contextKeys = new CounterSet();
        _this.items = [];
        _this._onDidChange = _this._register(new Emitter());
        _this.onDidChangeActiveViews = _this._onDidChange.event;
        var onRelevantViewsRegistered = filterViewEvent(container, ViewsRegistry.onViewsRegistered);
        _this._register(onRelevantViewsRegistered(_this.onViewsRegistered, _this));
        var onRelevantViewsDeregistered = filterViewEvent(container, ViewsRegistry.onViewsDeregistered);
        _this._register(onRelevantViewsDeregistered(_this.onViewsDeregistered, _this));
        var onRelevantContextChange = filterEvent(contextKeyService.onDidChangeContext, function (e) { return e.affectsSome(_this.contextKeys); });
        _this._register(onRelevantContextChange(_this.onContextChanged, _this));
        _this.onViewsRegistered(ViewsRegistry.getViews(container));
        return _this;
    }
    Object.defineProperty(ViewDescriptorCollection.prototype, "activeViewDescriptors", {
        get: function () {
            return this.items
                .filter(function (i) { return i.active; })
                .map(function (i) { return i.viewDescriptor; });
        },
        enumerable: true,
        configurable: true
    });
    ViewDescriptorCollection.prototype.onViewsRegistered = function (viewDescriptors) {
        var added = [];
        for (var _i = 0, viewDescriptors_1 = viewDescriptors; _i < viewDescriptors_1.length; _i++) {
            var viewDescriptor = viewDescriptors_1[_i];
            var item = {
                viewDescriptor: viewDescriptor,
                active: this.isViewDescriptorActive(viewDescriptor) // TODO: should read from some state?
            };
            this.items.push(item);
            if (viewDescriptor.when) {
                for (var _a = 0, _b = viewDescriptor.when.keys(); _a < _b.length; _a++) {
                    var key = _b[_a];
                    this.contextKeys.add(key);
                }
            }
            if (item.active) {
                added.push(viewDescriptor);
            }
        }
        if (added.length) {
            this._onDidChange.fire({ added: added, removed: [] });
        }
    };
    ViewDescriptorCollection.prototype.onViewsDeregistered = function (viewDescriptors) {
        var removed = [];
        var _loop_1 = function (viewDescriptor) {
            var index = firstIndex(this_1.items, function (i) { return i.viewDescriptor.id === viewDescriptor.id; });
            if (index === -1) {
                return "continue";
            }
            var item = this_1.items[index];
            this_1.items.splice(index, 1);
            if (viewDescriptor.when) {
                for (var _i = 0, _a = viewDescriptor.when.keys(); _i < _a.length; _i++) {
                    var key = _a[_i];
                    this_1.contextKeys.delete(key);
                }
            }
            if (item.active) {
                removed.push(viewDescriptor);
            }
        };
        var this_1 = this;
        for (var _i = 0, viewDescriptors_2 = viewDescriptors; _i < viewDescriptors_2.length; _i++) {
            var viewDescriptor = viewDescriptors_2[_i];
            _loop_1(viewDescriptor);
        }
        if (removed.length) {
            this._onDidChange.fire({ added: [], removed: removed });
        }
    };
    ViewDescriptorCollection.prototype.onContextChanged = function (event) {
        var removed = [];
        var added = [];
        for (var _i = 0, _a = this.items; _i < _a.length; _i++) {
            var item = _a[_i];
            var active = this.isViewDescriptorActive(item.viewDescriptor);
            if (item.active !== active) {
                if (active) {
                    added.push(item.viewDescriptor);
                }
                else {
                    removed.push(item.viewDescriptor);
                }
            }
            item.active = active;
        }
        if (added.length || removed.length) {
            this._onDidChange.fire({ added: added, removed: removed });
        }
    };
    ViewDescriptorCollection.prototype.isViewDescriptorActive = function (viewDescriptor) {
        return !viewDescriptor.when || this.contextKeyService.contextMatchesRules(viewDescriptor.when);
    };
    ViewDescriptorCollection = __decorate([
        __param(1, IContextKeyService)
    ], ViewDescriptorCollection);
    return ViewDescriptorCollection;
}(Disposable));
var ContributableViewsModel = /** @class */ (function (_super) {
    __extends(ContributableViewsModel, _super);
    function ContributableViewsModel(container, viewsService, viewStates) {
        if (viewStates === void 0) { viewStates = new Map(); }
        var _this = _super.call(this) || this;
        _this.viewStates = viewStates;
        _this.viewDescriptors = [];
        _this._onDidAdd = _this._register(new Emitter());
        _this.onDidAdd = _this._onDidAdd.event;
        _this._onDidRemove = _this._register(new Emitter());
        _this.onDidRemove = _this._onDidRemove.event;
        _this._onDidMove = _this._register(new Emitter());
        _this.onDidMove = _this._onDidMove.event;
        var viewDescriptorCollection = viewsService.getViewDescriptors(container);
        _this._register(viewDescriptorCollection.onDidChangeActiveViews(function () { return _this.onDidChangeViewDescriptors(viewDescriptorCollection.activeViewDescriptors); }));
        _this.onDidChangeViewDescriptors(viewDescriptorCollection.activeViewDescriptors);
        return _this;
    }
    Object.defineProperty(ContributableViewsModel.prototype, "visibleViewDescriptors", {
        get: function () {
            var _this = this;
            return this.viewDescriptors.filter(function (v) { return _this.viewStates.get(v.id).visible; });
        },
        enumerable: true,
        configurable: true
    });
    ContributableViewsModel.prototype.isVisible = function (id) {
        var state = this.viewStates.get(id);
        if (!state) {
            throw new Error("Unknown view " + id);
        }
        return state.visible;
    };
    ContributableViewsModel.prototype.setVisible = function (id, visible) {
        var _a = this.find(id), visibleIndex = _a.visibleIndex, viewDescriptor = _a.viewDescriptor, state = _a.state;
        if (!viewDescriptor.canToggleVisibility) {
            throw new Error("Can't toggle this view's visibility");
        }
        if (state.visible === visible) {
            return;
        }
        state.visible = visible;
        if (visible) {
            this._onDidAdd.fire([{ index: visibleIndex, viewDescriptor: viewDescriptor, size: state.size, collapsed: state.collapsed }]);
        }
        else {
            this._onDidRemove.fire([{ index: visibleIndex, viewDescriptor: viewDescriptor }]);
        }
    };
    ContributableViewsModel.prototype.isCollapsed = function (id) {
        var state = this.viewStates.get(id);
        if (!state) {
            throw new Error("Unknown view " + id);
        }
        return state.collapsed;
    };
    ContributableViewsModel.prototype.setCollapsed = function (id, collapsed) {
        var state = this.find(id).state;
        state.collapsed = collapsed;
    };
    ContributableViewsModel.prototype.getSize = function (id) {
        var state = this.viewStates.get(id);
        if (!state) {
            throw new Error("Unknown view " + id);
        }
        return state.size;
    };
    ContributableViewsModel.prototype.setSize = function (id, size) {
        var state = this.find(id).state;
        state.size = size;
    };
    ContributableViewsModel.prototype.move = function (from, to) {
        var fromIndex = firstIndex(this.viewDescriptors, function (v) { return v.id === from; });
        var toIndex = firstIndex(this.viewDescriptors, function (v) { return v.id === to; });
        var fromViewDescriptor = this.viewDescriptors[fromIndex];
        var toViewDescriptor = this.viewDescriptors[toIndex];
        move(this.viewDescriptors, fromIndex, toIndex);
        for (var index = 0; index < this.viewDescriptors.length; index++) {
            var state = this.viewStates.get(this.viewDescriptors[index].id);
            state.order = index;
        }
        this._onDidMove.fire({
            from: { index: fromIndex, viewDescriptor: fromViewDescriptor },
            to: { index: toIndex, viewDescriptor: toViewDescriptor }
        });
    };
    ContributableViewsModel.prototype.find = function (id) {
        for (var i = 0, visibleIndex = 0; i < this.viewDescriptors.length; i++) {
            var viewDescriptor = this.viewDescriptors[i];
            var state = this.viewStates.get(viewDescriptor.id);
            if (viewDescriptor.id === id) {
                return { index: i, visibleIndex: visibleIndex, viewDescriptor: viewDescriptor, state: state };
            }
            if (state.visible) {
                visibleIndex++;
            }
        }
        throw new Error("view descriptor " + id + " not found");
    };
    ContributableViewsModel.prototype.compareViewDescriptors = function (a, b) {
        if (a.id === b.id) {
            return 0;
        }
        return (this.getViewOrder(a) - this.getViewOrder(b)) || (a.id < b.id ? -1 : 1);
    };
    ContributableViewsModel.prototype.getViewOrder = function (viewDescriptor) {
        var viewState = this.viewStates.get(viewDescriptor.id);
        var viewOrder = viewState && typeof viewState.order === 'number' ? viewState.order : viewDescriptor.order;
        return typeof viewOrder === 'number' ? viewOrder : Number.MAX_VALUE;
    };
    ContributableViewsModel.prototype.onDidChangeViewDescriptors = function (viewDescriptors) {
        var _a;
        var ids = new Set();
        for (var _i = 0, _b = this.viewDescriptors; _i < _b.length; _i++) {
            var viewDescriptor = _b[_i];
            ids.add(viewDescriptor.id);
        }
        viewDescriptors = viewDescriptors.sort(this.compareViewDescriptors.bind(this));
        for (var _c = 0, viewDescriptors_3 = viewDescriptors; _c < viewDescriptors_3.length; _c++) {
            var viewDescriptor = viewDescriptors_3[_c];
            var viewState = this.viewStates.get(viewDescriptor.id);
            if (viewState) {
                // set defaults if not set
                viewState.visible = isUndefinedOrNull(viewState.visible) ? !viewDescriptor.hideByDefault : viewState.visible;
                viewState.collapsed = isUndefinedOrNull(viewState.collapsed) ? !!viewDescriptor.collapsed : viewState.collapsed;
            }
            else {
                this.viewStates.set(viewDescriptor.id, {
                    visible: !viewDescriptor.hideByDefault,
                    collapsed: viewDescriptor.collapsed
                });
            }
        }
        var splices = sortedDiff(this.viewDescriptors, viewDescriptors, this.compareViewDescriptors.bind(this)).reverse();
        var toRemove = [];
        var toAdd = [];
        for (var _d = 0, splices_1 = splices; _d < splices_1.length; _d++) {
            var splice = splices_1[_d];
            var startViewDescriptor = this.viewDescriptors[splice.start];
            var startIndex = startViewDescriptor ? this.find(startViewDescriptor.id).visibleIndex : this.viewDescriptors.length;
            for (var i = 0; i < splice.deleteCount; i++) {
                var viewDescriptor = this.viewDescriptors[splice.start + i];
                var state = this.find(viewDescriptor.id).state;
                if (state.visible) {
                    toRemove.push({ index: startIndex++, viewDescriptor: viewDescriptor });
                }
            }
            for (var i = 0; i < splice.toInsert.length; i++) {
                var viewDescriptor = splice.toInsert[i];
                var state = this.viewStates.get(viewDescriptor.id);
                if (state.visible) {
                    toAdd.push({ index: startIndex++, viewDescriptor: viewDescriptor, size: state.size, collapsed: state.collapsed });
                }
            }
        }
        (_a = this.viewDescriptors).splice.apply(_a, [0, this.viewDescriptors.length].concat(viewDescriptors));
        if (toRemove.length) {
            this._onDidRemove.fire(toRemove);
        }
        if (toAdd.length) {
            this._onDidAdd.fire(toAdd);
        }
    };
    return ContributableViewsModel;
}(Disposable));
export { ContributableViewsModel };
var PersistentContributableViewsModel = /** @class */ (function (_super) {
    __extends(PersistentContributableViewsModel, _super);
    function PersistentContributableViewsModel(container, viewletStateStorageId, viewsService, storageService, contextService) {
        var _this = this;
        var hiddenViewsStorageId = viewletStateStorageId + ".hidden";
        var viewStates = PersistentContributableViewsModel.loadViewsStates(viewletStateStorageId, hiddenViewsStorageId, storageService, contextService);
        _this = _super.call(this, container, viewsService, viewStates) || this;
        _this.viewletStateStorageId = viewletStateStorageId;
        _this.hiddenViewsStorageId = hiddenViewsStorageId;
        _this.storageService = storageService;
        _this.contextService = contextService;
        _this._register(_this.onDidAdd(function (viewDescriptorRefs) { return _this.saveVisibilityStates(viewDescriptorRefs.map(function (r) { return r.viewDescriptor; })); }));
        _this._register(_this.onDidRemove(function (viewDescriptorRefs) { return _this.saveVisibilityStates(viewDescriptorRefs.map(function (r) { return r.viewDescriptor; })); }));
        return _this;
    }
    PersistentContributableViewsModel.prototype.saveViewsStates = function () {
        var storedViewsStates = {};
        for (var _i = 0, _a = this.viewDescriptors; _i < _a.length; _i++) {
            var viewDescriptor = _a[_i];
            var viewState = this.viewStates.get(viewDescriptor.id);
            if (viewState) {
                storedViewsStates[viewDescriptor.id] = { collapsed: viewState.collapsed, size: viewState.size, order: viewState.order };
            }
        }
        this.storageService.store(this.viewletStateStorageId, JSON.stringify(storedViewsStates), this.contextService.getWorkbenchState() !== 1 /* EMPTY */ ? 1 /* WORKSPACE */ : 0 /* GLOBAL */);
    };
    PersistentContributableViewsModel.prototype.saveVisibilityStates = function (viewDescriptors) {
        var storedViewsVisibilityStates = PersistentContributableViewsModel.loadViewsVisibilityState(this.hiddenViewsStorageId, this.storageService, this.contextService);
        for (var _i = 0, viewDescriptors_4 = viewDescriptors; _i < viewDescriptors_4.length; _i++) {
            var viewDescriptor = viewDescriptors_4[_i];
            if (viewDescriptor.canToggleVisibility) {
                var viewState = this.viewStates.get(viewDescriptor.id);
                storedViewsVisibilityStates.push({ id: viewDescriptor.id, isHidden: viewState ? !viewState.visible : void 0 });
            }
        }
        this.storageService.store(this.hiddenViewsStorageId, JSON.stringify(storedViewsVisibilityStates), 0 /* GLOBAL */);
    };
    PersistentContributableViewsModel.loadViewsStates = function (viewletStateStorageId, hiddenViewsStorageId, storageService, contextService) {
        var viewStates = new Map();
        var storedViewsStates = JSON.parse(storageService.get(viewletStateStorageId, contextService.getWorkbenchState() !== 1 /* EMPTY */ ? 1 /* WORKSPACE */ : 0 /* GLOBAL */, '{}'));
        var viewsVisibilityStates = PersistentContributableViewsModel.loadViewsVisibilityState(hiddenViewsStorageId, storageService, contextService);
        for (var _i = 0, viewsVisibilityStates_1 = viewsVisibilityStates; _i < viewsVisibilityStates_1.length; _i++) {
            var _a = viewsVisibilityStates_1[_i], id = _a.id, isHidden = _a.isHidden;
            var viewState = storedViewsStates[id];
            if (viewState) {
                viewStates.set(id, __assign({}, viewState, { visible: !isHidden }));
            }
            else {
                // New workspace
                viewStates.set(id, __assign({ visible: !isHidden }));
            }
        }
        for (var _b = 0, _c = Object.keys(storedViewsStates); _b < _c.length; _b++) {
            var id = _c[_b];
            if (!viewStates.has(id)) {
                viewStates.set(id, __assign({}, storedViewsStates[id]));
            }
        }
        return viewStates;
    };
    PersistentContributableViewsModel.loadViewsVisibilityState = function (hiddenViewsStorageId, storageService, contextService) {
        var storedVisibilityStates = JSON.parse(storageService.get(hiddenViewsStorageId, 0 /* GLOBAL */, '[]'));
        return storedVisibilityStates.map(function (c) { return typeof c === 'string' /* migration */ ? { id: c, isHidden: true } : c; });
    };
    PersistentContributableViewsModel.prototype.dispose = function () {
        this.saveViewsStates();
        _super.prototype.dispose.call(this);
    };
    PersistentContributableViewsModel = __decorate([
        __param(2, IViewsService),
        __param(3, IStorageService),
        __param(4, IWorkspaceContextService)
    ], PersistentContributableViewsModel);
    return PersistentContributableViewsModel;
}(ContributableViewsModel));
export { PersistentContributableViewsModel };
var SCM_VIEWLET_ID = 'workbench.view.scm';
var ViewsService = /** @class */ (function (_super) {
    __extends(ViewsService, _super);
    function ViewsService(lifecycleService, viewletService, storageService, workspaceContextService, contextKeyService) {
        var _this = _super.call(this) || this;
        _this.lifecycleService = lifecycleService;
        _this.viewletService = viewletService;
        _this.storageService = storageService;
        _this.workspaceContextService = workspaceContextService;
        _this.contextKeyService = contextKeyService;
        _this.viewDescriptorCollections = new Map();
        _this.activeViewContextKeys = new Map();
        _this.onDidRegisterViews(ViewsRegistry.getAllViews());
        _this._register(ViewsRegistry.onViewsRegistered(function (views) { return _this.onDidRegisterViews(views); }));
        var viewContainersRegistry = Registry.as(ViewContainerExtensions.ViewContainersRegistry);
        viewContainersRegistry.all.forEach(function (viewContainer) { return _this.onDidRegisterViewContainer(viewContainer); });
        _this._register(viewContainersRegistry.onDidRegister(function (viewContainer) { return _this.onDidRegisterViewContainer(viewContainer); }));
        _this._register(Registry.as(ViewletExtensions.Viewlets).onDidRegister(function (viewlet) { return _this.viewletService.setViewletEnablement(viewlet.id, _this.storageService.getBoolean("viewservice." + viewlet.id + ".enablement", _this.getStorageScope(), viewlet.id !== TEST_VIEW_CONTAINER_ID)); }));
        return _this;
    }
    ViewsService.prototype.getViewDescriptors = function (container) {
        return this.viewDescriptorCollections.get(container);
    };
    ViewsService.prototype.openView = function (id, focus) {
        var viewDescriptor = ViewsRegistry.getView(id);
        if (viewDescriptor) {
            var viewletDescriptor = this.viewletService.getViewlet(viewDescriptor.container.id);
            if (viewletDescriptor) {
                return this.viewletService.openViewlet(viewletDescriptor.id)
                    .then(function (viewlet) {
                    if (viewlet && viewlet.openView) {
                        return viewlet.openView(id, focus);
                    }
                    return null;
                });
            }
        }
        return Promise.resolve(null);
    };
    ViewsService.prototype.onDidRegisterViewContainer = function (viewContainer) {
        var _this = this;
        var viewDescriptorCollection = this.registerViewDescriptorCollection(viewContainer);
        // TODO: @Joao Remove this after moving SCM Viewlet to ViewContainerViewlet - https://github.com/Microsoft/vscode/issues/49054
        if (viewContainer.id !== SCM_VIEWLET_ID) {
            this._register(viewDescriptorCollection.onDidChangeActiveViews(function () { return _this.updateViewletEnablement(viewContainer, viewDescriptorCollection); }));
            this.lifecycleService.when(4 /* Eventually */).then(function () { return _this.updateViewletEnablement(viewContainer, viewDescriptorCollection); });
        }
    };
    ViewsService.prototype.registerViewDescriptorCollection = function (viewContainer) {
        var _this = this;
        var viewDescriptorCollection = this._register(new ViewDescriptorCollection(viewContainer, this.contextKeyService));
        this.onDidChangeActiveViews({ added: viewDescriptorCollection.activeViewDescriptors, removed: [] });
        this._register(viewDescriptorCollection.onDidChangeActiveViews(function (changed) { return _this.onDidChangeActiveViews(changed); }));
        this.viewDescriptorCollections.set(viewContainer, viewDescriptorCollection);
        return viewDescriptorCollection;
    };
    ViewsService.prototype.onDidChangeActiveViews = function (_a) {
        var _this = this;
        var added = _a.added, removed = _a.removed;
        added.forEach(function (viewDescriptor) { return _this.getOrCreateActiveViewContextKey(viewDescriptor).set(true); });
        removed.forEach(function (viewDescriptor) { return _this.getOrCreateActiveViewContextKey(viewDescriptor).set(false); });
    };
    ViewsService.prototype.onDidRegisterViews = function (viewDescriptors) {
        var _this = this;
        var _loop_2 = function (viewDescriptor) {
            var viewlet = this_2.viewletService.getViewlet(viewDescriptor.container.id);
            var command = {
                id: viewDescriptor.focusCommand ? viewDescriptor.focusCommand.id : viewDescriptor.id + ".focus",
                title: { original: "Focus on " + viewDescriptor.name + " View", value: localize('focus view', "Focus on {0} View", viewDescriptor.name) },
                category: viewlet ? viewlet.name : localize('view category', "View"),
            };
            var when = ContextKeyExpr.has(viewDescriptor.id + ".active");
            CommandsRegistry.registerCommand(command.id, function () { return _this.openView(viewDescriptor.id, true); });
            MenuRegistry.appendMenuItem(MenuId.CommandPalette, {
                command: command,
                when: when
            });
            if (viewDescriptor.focusCommand && viewDescriptor.focusCommand.keybindings) {
                KeybindingsRegistry.registerKeybindingRule({
                    id: command.id,
                    when: when,
                    weight: 200 /* WorkbenchContrib */,
                    primary: viewDescriptor.focusCommand.keybindings.primary,
                    secondary: viewDescriptor.focusCommand.keybindings.secondary,
                    linux: viewDescriptor.focusCommand.keybindings.linux,
                    mac: viewDescriptor.focusCommand.keybindings.mac,
                    win: viewDescriptor.focusCommand.keybindings.win
                });
            }
        };
        var this_2 = this;
        for (var _i = 0, viewDescriptors_5 = viewDescriptors; _i < viewDescriptors_5.length; _i++) {
            var viewDescriptor = viewDescriptors_5[_i];
            _loop_2(viewDescriptor);
        }
    };
    ViewsService.prototype.getOrCreateActiveViewContextKey = function (viewDescriptor) {
        var activeContextKeyId = viewDescriptor.id + ".active";
        var contextKey = this.activeViewContextKeys.get(activeContextKeyId);
        if (!contextKey) {
            contextKey = new RawContextKey(activeContextKeyId, false).bindTo(this.contextKeyService);
            this.activeViewContextKeys.set(activeContextKeyId, contextKey);
        }
        return contextKey;
    };
    ViewsService.prototype.updateViewletEnablement = function (viewContainer, viewDescriptorCollection) {
        var enabled = viewDescriptorCollection.activeViewDescriptors.length > 0;
        this.viewletService.setViewletEnablement(viewContainer.id, enabled);
        this.storageService.store("viewservice." + viewContainer.id + ".enablement", enabled, this.getStorageScope());
    };
    ViewsService.prototype.getStorageScope = function () {
        return this.workspaceContextService.getWorkbenchState() === 1 /* EMPTY */ ? 0 /* GLOBAL */ : 1 /* WORKSPACE */;
    };
    ViewsService = __decorate([
        __param(0, ILifecycleService),
        __param(1, IViewletService),
        __param(2, IStorageService),
        __param(3, IWorkspaceContextService),
        __param(4, IContextKeyService)
    ], ViewsService);
    return ViewsService;
}(Disposable));
export { ViewsService };
