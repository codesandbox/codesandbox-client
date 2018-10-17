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
import * as nls from '../../nls.js';
import * as DOM from '../../base/browser/dom.js';
import { Registry } from '../../platform/registry/common/platform.js';
import { Action } from '../../base/common/actions.js';
import { IViewletService } from '../services/viewlet/browser/viewlet.js';
import { Composite, CompositeDescriptor, CompositeRegistry } from './composite.js';
import { ToggleSidebarVisibilityAction } from './actions/toggleSidebarVisibility.js';
import { IPartService } from '../services/part/common/partService.js';
import { IEditorGroupsService } from '../services/group/common/editorGroupsService.js';
import { ToggleSidebarPositionAction } from './actions/toggleSidebarPosition.js';
var Viewlet = /** @class */ (function (_super) {
    __extends(Viewlet, _super);
    function Viewlet(id, configurationService, partService, telemetryService, themeService) {
        var _this = _super.call(this, id, telemetryService, themeService) || this;
        _this.configurationService = configurationService;
        _this.partService = partService;
        return _this;
    }
    Viewlet.prototype.getOptimalWidth = function () {
        return null;
    };
    Viewlet.prototype.getContextMenuActions = function () {
        var _this = this;
        var toggleSidebarPositionAction = new ToggleSidebarPositionAction(ToggleSidebarPositionAction.ID, ToggleSidebarPositionAction.getLabel(this.partService), this.partService, this.configurationService);
        return [toggleSidebarPositionAction,
            {
                id: ToggleSidebarVisibilityAction.ID,
                label: nls.localize('compositePart.hideSideBarLabel', "Hide Side Bar"),
                enabled: true,
                run: function () { return _this.partService.setSideBarHidden(true); }
            }];
    };
    return Viewlet;
}(Composite));
export { Viewlet };
/**
 * A viewlet descriptor is a leightweight descriptor of a viewlet in the workbench.
 */
var ViewletDescriptor = /** @class */ (function (_super) {
    __extends(ViewletDescriptor, _super);
    function ViewletDescriptor(ctor, id, name, cssClass, order, _iconUrl) {
        var _this = _super.call(this, ctor, id, name, cssClass, order, id) || this;
        _this._iconUrl = _iconUrl;
        return _this;
    }
    Object.defineProperty(ViewletDescriptor.prototype, "iconUrl", {
        get: function () {
            return this._iconUrl;
        },
        enumerable: true,
        configurable: true
    });
    return ViewletDescriptor;
}(CompositeDescriptor));
export { ViewletDescriptor };
export var Extensions = {
    Viewlets: 'workbench.contributions.viewlets'
};
var ViewletRegistry = /** @class */ (function (_super) {
    __extends(ViewletRegistry, _super);
    function ViewletRegistry() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Registers a viewlet to the platform.
     */
    ViewletRegistry.prototype.registerViewlet = function (descriptor) {
        _super.prototype.registerComposite.call(this, descriptor);
    };
    /**
     * Returns the viewlet descriptor for the given id or null if none.
     */
    ViewletRegistry.prototype.getViewlet = function (id) {
        return this.getComposite(id);
    };
    /**
     * Returns an array of registered viewlets known to the platform.
     */
    ViewletRegistry.prototype.getViewlets = function () {
        return this.getComposites();
    };
    /**
     * Sets the id of the viewlet that should open on startup by default.
     */
    ViewletRegistry.prototype.setDefaultViewletId = function (id) {
        this.defaultViewletId = id;
    };
    /**
     * Gets the id of the viewlet that should open on startup by default.
     */
    ViewletRegistry.prototype.getDefaultViewletId = function () {
        return this.defaultViewletId;
    };
    return ViewletRegistry;
}(CompositeRegistry));
export { ViewletRegistry };
Registry.add(Extensions.Viewlets, new ViewletRegistry());
/**
 * A reusable action to show a viewlet with a specific id.
 */
var ShowViewletAction = /** @class */ (function (_super) {
    __extends(ShowViewletAction, _super);
    function ShowViewletAction(id, name, viewletId, viewletService, editorGroupService, partService) {
        var _this = _super.call(this, id, name) || this;
        _this.viewletService = viewletService;
        _this.editorGroupService = editorGroupService;
        _this.partService = partService;
        _this.viewletId = viewletId;
        _this.enabled = !!_this.viewletService && !!_this.editorGroupService;
        return _this;
    }
    ShowViewletAction.prototype.run = function () {
        // Pass focus to viewlet if not open or focused
        if (this.otherViewletShowing() || !this.sidebarHasFocus()) {
            return this.viewletService.openViewlet(this.viewletId, true);
        }
        // Otherwise pass focus to editor group
        this.editorGroupService.activeGroup.focus();
        return Promise.resolve(true);
    };
    ShowViewletAction.prototype.otherViewletShowing = function () {
        var activeViewlet = this.viewletService.getActiveViewlet();
        return !activeViewlet || activeViewlet.getId() !== this.viewletId;
    };
    ShowViewletAction.prototype.sidebarHasFocus = function () {
        var activeViewlet = this.viewletService.getActiveViewlet();
        var activeElement = document.activeElement;
        return activeViewlet && activeElement && DOM.isAncestor(activeElement, this.partService.getContainer(1 /* SIDEBAR_PART */));
    };
    ShowViewletAction = __decorate([
        __param(3, IViewletService),
        __param(4, IEditorGroupsService),
        __param(5, IPartService)
    ], ShowViewletAction);
    return ShowViewletAction;
}(Action));
export { ShowViewletAction };
// Collapse All action
var CollapseAction = /** @class */ (function (_super) {
    __extends(CollapseAction, _super);
    function CollapseAction(viewer, enabled, clazz) {
        return _super.call(this, 'workbench.action.collapse', nls.localize('collapse', "Collapse All"), clazz, enabled, function (context) {
            if (viewer.getHighlight()) {
                return Promise.resolve(null); // Global action disabled if user is in edit mode from another action
            }
            viewer.collapseAll();
            viewer.clearSelection();
            viewer.clearFocus();
            viewer.domFocus();
            viewer.focusFirst();
            return Promise.resolve(null);
        }) || this;
    }
    return CollapseAction;
}(Action));
export { CollapseAction };
