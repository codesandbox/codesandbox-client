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
import { ActionRunner } from '../../base/common/actions';
import { Component } from '../common/component';
import { Emitter } from '../../base/common/event';
import { trackFocus } from '../../base/browser/dom';
/**
 * Composites are layed out in the sidebar and panel part of the workbench. At a time only one composite
 * can be open in the sidebar, and only one composite can be open in the panel.
 * Each composite has a minimized representation that is good enough to provide some
 * information about the state of the composite data.
 * The workbench will keep a composite alive after it has been created and show/hide it based on
 * user interaction. The lifecycle of a composite goes in the order create(), setVisible(true|false),
 * layout(), focus(), dispose(). During use of the workbench, a composite will often receive a setVisible,
 * layout and focus call, but only one create and dispose call.
 */
var Composite = /** @class */ (function (_super) {
    __extends(Composite, _super);
    /**
     * Create a new composite with the given ID and context.
     */
    function Composite(id, _telemetryService, themeService) {
        var _this = _super.call(this, id, themeService) || this;
        _this._telemetryService = _telemetryService;
        _this._onTitleAreaUpdate = _this._register(new Emitter());
        _this.visible = false;
        return _this;
    }
    Object.defineProperty(Composite.prototype, "onTitleAreaUpdate", {
        get: function () { return this._onTitleAreaUpdate.event; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Composite.prototype, "onDidFocus", {
        get: function () {
            if (!this._onDidFocus) {
                this._registerFocusTrackEvents();
            }
            return this._onDidFocus.event;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Composite.prototype, "onDidBlur", {
        get: function () {
            if (!this._onDidBlur) {
                this._registerFocusTrackEvents();
            }
            return this._onDidBlur.event;
        },
        enumerable: true,
        configurable: true
    });
    Composite.prototype._registerFocusTrackEvents = function () {
        var _this = this;
        this._onDidFocus = this._register(new Emitter());
        this._onDidBlur = this._register(new Emitter());
        var focusTracker = this._register(trackFocus(this.getContainer()));
        this._register(focusTracker.onDidFocus(function () { return _this._onDidFocus.fire(); }));
        this._register(focusTracker.onDidBlur(function () { return _this._onDidBlur.fire(); }));
    };
    Composite.prototype.getTitle = function () {
        return null;
    };
    Object.defineProperty(Composite.prototype, "telemetryService", {
        get: function () {
            return this._telemetryService;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Note: Clients should not call this method, the workbench calls this
     * method. Calling it otherwise may result in unexpected behavior.
     *
     * Called to create this composite on the provided parent. This method is only
     * called once during the lifetime of the workbench.
     * Note that DOM-dependent calculations should be performed from the setVisible()
     * call. Only then the composite will be part of the DOM.
     */
    Composite.prototype.create = function (parent) {
        this.parent = parent;
        return Promise.resolve(null);
    };
    Composite.prototype.updateStyles = function () {
        _super.prototype.updateStyles.call(this);
    };
    /**
     * Returns the container this composite is being build in.
     */
    Composite.prototype.getContainer = function () {
        return this.parent;
    };
    /**
     * Note: Clients should not call this method, the workbench calls this
     * method. Calling it otherwise may result in unexpected behavior.
     *
     * Called to indicate that the composite has become visible or hidden. This method
     * is called more than once during workbench lifecycle depending on the user interaction.
     * The composite will be on-DOM if visible is set to true and off-DOM otherwise.
     *
     * The returned promise is complete when the composite is visible. As such it is valid
     * to do a long running operation from this call. Typically this operation should be
     * fast though because setVisible might be called many times during a session.
     */
    Composite.prototype.setVisible = function (visible) {
        this.visible = visible;
        return Promise.resolve(null);
    };
    /**
     * Called when this composite should receive keyboard focus.
     */
    Composite.prototype.focus = function () {
        // Subclasses can implement
    };
    /**
     * Returns an array of actions to show in the action bar of the composite.
     */
    Composite.prototype.getActions = function () {
        return [];
    };
    /**
     * Returns an array of actions to show in the action bar of the composite
     * in a less prominent way then action from getActions.
     */
    Composite.prototype.getSecondaryActions = function () {
        return [];
    };
    /**
     * Returns an array of actions to show in the context menu of the composite
     */
    Composite.prototype.getContextMenuActions = function () {
        return [];
    };
    /**
     * For any of the actions returned by this composite, provide an IActionItem in
     * cases where the implementor of the composite wants to override the presentation
     * of an action. Returns null to indicate that the action is not rendered through
     * an action item.
     */
    Composite.prototype.getActionItem = function (action) {
        return null;
    };
    /**
     * Returns the instance of IActionRunner to use with this composite for the
     * composite tool bar.
     */
    Composite.prototype.getActionRunner = function () {
        if (!this.actionRunner) {
            this.actionRunner = new ActionRunner();
        }
        return this.actionRunner;
    };
    /**
     * Method for composite implementors to indicate to the composite container that the title or the actions
     * of the composite have changed. Calling this method will cause the container to ask for title (getTitle())
     * and actions (getActions(), getSecondaryActions()) if the composite is visible or the next time the composite
     * gets visible.
     */
    Composite.prototype.updateTitleArea = function () {
        this._onTitleAreaUpdate.fire();
    };
    /**
     * Returns true if this composite is currently visible and false otherwise.
     */
    Composite.prototype.isVisible = function () {
        return this.visible;
    };
    /**
     * Returns the underlying composite control or null if it is not accessible.
     */
    Composite.prototype.getControl = function () {
        return null;
    };
    return Composite;
}(Component));
export { Composite };
/**
 * A composite descriptor is a leightweight descriptor of a composite in the workbench.
 */
var CompositeDescriptor = /** @class */ (function () {
    function CompositeDescriptor(ctor, id, name, cssClass, order, keybindingId) {
        this.ctor = ctor;
        this.id = id;
        this.name = name;
        this.cssClass = cssClass;
        this.order = order;
        this.enabled = true;
        this.keybindingId = keybindingId;
    }
    CompositeDescriptor.prototype.instantiate = function (instantiationService) {
        return instantiationService.createInstance(this.ctor);
    };
    return CompositeDescriptor;
}());
export { CompositeDescriptor };
var CompositeRegistry = /** @class */ (function () {
    function CompositeRegistry() {
        this._onDidRegister = new Emitter();
        this.composites = [];
    }
    Object.defineProperty(CompositeRegistry.prototype, "onDidRegister", {
        get: function () { return this._onDidRegister.event; },
        enumerable: true,
        configurable: true
    });
    CompositeRegistry.prototype.registerComposite = function (descriptor) {
        if (this.compositeById(descriptor.id) !== null) {
            return;
        }
        this.composites.push(descriptor);
        this._onDidRegister.fire(descriptor);
    };
    CompositeRegistry.prototype.getComposite = function (id) {
        return this.compositeById(id);
    };
    CompositeRegistry.prototype.getComposites = function () {
        return this.composites.slice(0);
    };
    CompositeRegistry.prototype.compositeById = function (id) {
        for (var i = 0; i < this.composites.length; i++) {
            if (this.composites[i].id === id) {
                return this.composites[i];
            }
        }
        return null;
    };
    return CompositeRegistry;
}());
export { CompositeRegistry };
