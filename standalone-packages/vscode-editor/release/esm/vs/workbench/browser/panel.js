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
import { Registry } from '../../platform/registry/common/platform.js';
import { Composite, CompositeDescriptor, CompositeRegistry } from './composite.js';
import { Action } from '../../base/common/actions.js';
import { isAncestor } from '../../base/browser/dom.js';
var Panel = /** @class */ (function (_super) {
    __extends(Panel, _super);
    function Panel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Panel;
}(Composite));
export { Panel };
/**
 * A panel descriptor is a leightweight descriptor of a panel in the workbench.
 */
var PanelDescriptor = /** @class */ (function (_super) {
    __extends(PanelDescriptor, _super);
    function PanelDescriptor(ctor, id, name, cssClass, order, _commandId) {
        return _super.call(this, ctor, id, name, cssClass, order, _commandId) || this;
    }
    return PanelDescriptor;
}(CompositeDescriptor));
export { PanelDescriptor };
var PanelRegistry = /** @class */ (function (_super) {
    __extends(PanelRegistry, _super);
    function PanelRegistry() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Registers a panel to the platform.
     */
    PanelRegistry.prototype.registerPanel = function (descriptor) {
        _super.prototype.registerComposite.call(this, descriptor);
    };
    /**
     * Returns an array of registered panels known to the platform.
     */
    PanelRegistry.prototype.getPanels = function () {
        return this.getComposites();
    };
    /**
     * Sets the id of the panel that should open on startup by default.
     */
    PanelRegistry.prototype.setDefaultPanelId = function (id) {
        this.defaultPanelId = id;
    };
    /**
     * Gets the id of the panel that should open on startup by default.
     */
    PanelRegistry.prototype.getDefaultPanelId = function () {
        return this.defaultPanelId;
    };
    return PanelRegistry;
}(CompositeRegistry));
export { PanelRegistry };
/**
 * A reusable action to toggle a panel with a specific id depending on focus.
 */
var TogglePanelAction = /** @class */ (function (_super) {
    __extends(TogglePanelAction, _super);
    function TogglePanelAction(id, label, panelId, panelService, partService, cssClass) {
        var _this = _super.call(this, id, label, cssClass) || this;
        _this.panelService = panelService;
        _this.partService = partService;
        _this.panelId = panelId;
        return _this;
    }
    TogglePanelAction.prototype.run = function () {
        if (this.isPanelFocused()) {
            return this.partService.setPanelHidden(true);
        }
        return this.panelService.openPanel(this.panelId, true);
    };
    TogglePanelAction.prototype.isPanelActive = function () {
        var activePanel = this.panelService.getActivePanel();
        return activePanel && activePanel.getId() === this.panelId;
    };
    TogglePanelAction.prototype.isPanelFocused = function () {
        var activeElement = document.activeElement;
        return this.isPanelActive() && activeElement && isAncestor(activeElement, this.partService.getContainer(2 /* PANEL_PART */));
    };
    return TogglePanelAction;
}(Action));
export { TogglePanelAction };
export var Extensions = {
    Panels: 'workbench.contributions.panels'
};
Registry.add(Extensions.Panels, new PanelRegistry());
