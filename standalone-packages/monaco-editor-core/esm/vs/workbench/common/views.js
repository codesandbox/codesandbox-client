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
import { Emitter } from '../../base/common/event';
import { localize } from '../../nls';
import { createDecorator } from '../../platform/instantiation/common/instantiation';
import { values } from '../../base/common/map';
import { Registry } from '../../platform/registry/common/platform';
export var TEST_VIEW_CONTAINER_ID = 'workbench.view.extension.test';
export var Extensions;
(function (Extensions) {
    Extensions.ViewContainersRegistry = 'workbench.registry.view.containers';
})(Extensions || (Extensions = {}));
var ViewContainer = /** @class */ (function () {
    function ViewContainer(id, extensionId) {
        this.id = id;
        this.extensionId = extensionId;
    }
    return ViewContainer;
}());
export { ViewContainer };
var ViewContainersRegistryImpl = /** @class */ (function () {
    function ViewContainersRegistryImpl() {
        this._onDidRegister = new Emitter();
        this.onDidRegister = this._onDidRegister.event;
        this.viewContainers = new Map();
    }
    Object.defineProperty(ViewContainersRegistryImpl.prototype, "all", {
        get: function () {
            return values(this.viewContainers);
        },
        enumerable: true,
        configurable: true
    });
    ViewContainersRegistryImpl.prototype.registerViewContainer = function (id, extensionId) {
        if (!this.viewContainers.has(id)) {
            var viewContainer = new /** @class */ (function (_super) {
                __extends(class_1, _super);
                function class_1() {
                    return _super.call(this, id, extensionId) || this;
                }
                return class_1;
            }(ViewContainer));
            this.viewContainers.set(id, viewContainer);
            this._onDidRegister.fire(viewContainer);
        }
        return this.get(id);
    };
    ViewContainersRegistryImpl.prototype.get = function (id) {
        return this.viewContainers.get(id);
    };
    return ViewContainersRegistryImpl;
}());
Registry.add(Extensions.ViewContainersRegistry, new ViewContainersRegistryImpl());
export var ViewsRegistry = new /** @class */ (function () {
    function class_2() {
        this._onViewsRegistered = new Emitter();
        this.onViewsRegistered = this._onViewsRegistered.event;
        this._onViewsDeregistered = new Emitter();
        this.onViewsDeregistered = this._onViewsDeregistered.event;
        this._viewContainer = [];
        this._views = new Map();
    }
    class_2.prototype.registerViews = function (viewDescriptors) {
        if (viewDescriptors.length) {
            var _loop_1 = function (viewDescriptor) {
                var views = this_1._views.get(viewDescriptor.container);
                if (!views) {
                    views = [];
                    this_1._views.set(viewDescriptor.container, views);
                    this_1._viewContainer.push(viewDescriptor.container);
                }
                if (views.some(function (v) { return v.id === viewDescriptor.id; })) {
                    throw new Error(localize('duplicateId', "A view with id '{0}' is already registered in the container '{1}'", viewDescriptor.id, viewDescriptor.container.id));
                }
                views.push(viewDescriptor);
            };
            var this_1 = this;
            for (var _i = 0, viewDescriptors_1 = viewDescriptors; _i < viewDescriptors_1.length; _i++) {
                var viewDescriptor = viewDescriptors_1[_i];
                _loop_1(viewDescriptor);
            }
            this._onViewsRegistered.fire(viewDescriptors);
        }
    };
    class_2.prototype.deregisterViews = function (ids, container) {
        var views = this._views.get(container);
        if (!views) {
            return;
        }
        var viewsToDeregister = views.filter(function (view) { return ids.indexOf(view.id) !== -1; });
        if (viewsToDeregister.length) {
            var remaningViews = views.filter(function (view) { return ids.indexOf(view.id) === -1; });
            if (remaningViews.length) {
                this._views.set(container, remaningViews);
            }
            else {
                this._views.delete(container);
                this._viewContainer.splice(this._viewContainer.indexOf(container), 1);
            }
            this._onViewsDeregistered.fire(viewsToDeregister);
        }
    };
    class_2.prototype.getViews = function (loc) {
        return this._views.get(loc) || [];
    };
    class_2.prototype.getView = function (id) {
        for (var _i = 0, _a = this._viewContainer; _i < _a.length; _i++) {
            var viewContainer = _a[_i];
            var viewDescriptor = (this._views.get(viewContainer) || []).filter(function (v) { return v.id === id; })[0];
            if (viewDescriptor) {
                return viewDescriptor;
            }
        }
        return null;
    };
    class_2.prototype.getAllViews = function () {
        var allViews = [];
        this._views.forEach(function (views) { return allViews.push.apply(allViews, views); });
        return allViews;
    };
    return class_2;
}());
export var IViewsService = createDecorator('viewsService');
export var TreeItemCollapsibleState;
(function (TreeItemCollapsibleState) {
    TreeItemCollapsibleState[TreeItemCollapsibleState["None"] = 0] = "None";
    TreeItemCollapsibleState[TreeItemCollapsibleState["Collapsed"] = 1] = "Collapsed";
    TreeItemCollapsibleState[TreeItemCollapsibleState["Expanded"] = 2] = "Expanded";
})(TreeItemCollapsibleState || (TreeItemCollapsibleState = {}));
