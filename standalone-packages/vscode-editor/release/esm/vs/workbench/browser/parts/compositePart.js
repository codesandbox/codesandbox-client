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
import './media/compositepart.css';
import * as nls from '../../../nls.js';
import { defaultGenerator } from '../../../base/common/idGenerator.js';
import { dispose } from '../../../base/common/lifecycle.js';
import * as strings from '../../../base/common/strings.js';
import { Emitter } from '../../../base/common/event.js';
import * as errors from '../../../base/common/errors.js';
import { ToolBar } from '../../../base/browser/ui/toolbar/toolbar.js';
import { ProgressBar } from '../../../base/browser/ui/progressbar/progressbar.js';
import { prepareActions } from '../actions.js';
import { Part } from '../part.js';
import { ScopedProgressService } from '../../services/progress/browser/progressService.js';
import { ServiceCollection } from '../../../platform/instantiation/common/serviceCollection.js';
import { IProgressService } from '../../../platform/progress/common/progress.js';
import { attachProgressBarStyler } from '../../../platform/theme/common/styler.js';
import { append, $, addClass, hide, show, addClasses } from '../../../base/browser/dom.js';
var CompositePart = /** @class */ (function (_super) {
    __extends(CompositePart, _super);
    function CompositePart(notificationService, storageService, telemetryService, contextMenuService, partService, keybindingService, instantiationService, themeService, registry, activeCompositeSettingsKey, defaultCompositeId, nameForTelemetry, compositeCSSClass, titleForegroundColor, id, options) {
        var _this = _super.call(this, id, options, themeService, storageService) || this;
        _this.notificationService = notificationService;
        _this.storageService = storageService;
        _this.telemetryService = telemetryService;
        _this.contextMenuService = contextMenuService;
        _this.partService = partService;
        _this.keybindingService = keybindingService;
        _this.instantiationService = instantiationService;
        _this.registry = registry;
        _this.activeCompositeSettingsKey = activeCompositeSettingsKey;
        _this.defaultCompositeId = defaultCompositeId;
        _this.nameForTelemetry = nameForTelemetry;
        _this.compositeCSSClass = compositeCSSClass;
        _this.titleForegroundColor = titleForegroundColor;
        _this._onDidCompositeOpen = _this._register(new Emitter());
        _this._onDidCompositeClose = _this._register(new Emitter());
        _this.instantiatedCompositeListeners = [];
        _this.mapCompositeToCompositeContainer = {};
        _this.mapActionsBindingToComposite = {};
        _this.mapProgressServiceToComposite = {};
        _this.activeComposite = null;
        _this.instantiatedComposites = [];
        _this.lastActiveCompositeId = storageService.get(activeCompositeSettingsKey, 1 /* WORKSPACE */, _this.defaultCompositeId);
        return _this;
    }
    CompositePart.prototype.openComposite = function (id, focus) {
        // Check if composite already visible and just focus in that case
        if (this.activeComposite && this.activeComposite.getId() === id) {
            if (focus) {
                this.activeComposite.focus();
            }
            // Fullfill promise with composite that is being opened
            return this.activeComposite;
        }
        // Open
        return this.doOpenComposite(id, focus);
    };
    CompositePart.prototype.doOpenComposite = function (id, focus) {
        // Use a generated token to avoid race conditions from long running promises
        var currentCompositeOpenToken = defaultGenerator.nextId();
        this.currentCompositeOpenToken = currentCompositeOpenToken;
        // Hide current
        if (this.activeComposite) {
            this.hideActiveComposite();
        }
        // Update Title
        this.updateTitle(id);
        // Create composite
        var composite = this.createComposite(id, true);
        // Check if another composite opened meanwhile and return in that case
        if ((this.currentCompositeOpenToken !== currentCompositeOpenToken) || (this.activeComposite && this.activeComposite.getId() !== composite.getId())) {
            return undefined;
        }
        // Check if composite already visible and just focus in that case
        if (this.activeComposite && this.activeComposite.getId() === composite.getId()) {
            if (focus) {
                composite.focus();
            }
            this._onDidCompositeOpen.fire({ composite: composite, focus: focus });
            return composite;
        }
        // Show Composite and Focus
        this.showComposite(composite);
        if (focus) {
            composite.focus();
        }
        // Return with the composite that is being opened
        if (composite) {
            this._onDidCompositeOpen.fire({ composite: composite, focus: focus });
        }
        return composite;
    };
    CompositePart.prototype.createComposite = function (id, isActive) {
        var _this = this;
        // Check if composite is already created
        for (var i = 0; i < this.instantiatedComposites.length; i++) {
            if (this.instantiatedComposites[i].getId() === id) {
                return this.instantiatedComposites[i];
            }
        }
        // Instantiate composite from registry otherwise
        var compositeDescriptor = this.registry.getComposite(id);
        if (compositeDescriptor) {
            var progressService = this.instantiationService.createInstance(ScopedProgressService, this.progressBar, compositeDescriptor.id, isActive);
            var compositeInstantiationService = this.instantiationService.createChild(new ServiceCollection([IProgressService, progressService]));
            var composite_1 = compositeDescriptor.instantiate(compositeInstantiationService);
            this.mapProgressServiceToComposite[composite_1.getId()] = progressService;
            // Remember as Instantiated
            this.instantiatedComposites.push(composite_1);
            // Register to title area update events from the composite
            this.instantiatedCompositeListeners.push(composite_1.onTitleAreaUpdate(function () { return _this.onTitleAreaUpdate(composite_1.getId()); }));
            return composite_1;
        }
        throw new Error(strings.format('Unable to find composite with id {0}', id));
    };
    CompositePart.prototype.showComposite = function (composite) {
        var _this = this;
        // Remember Composite
        this.activeComposite = composite;
        // Store in preferences
        var id = this.activeComposite.getId();
        if (id !== this.defaultCompositeId) {
            this.storageService.store(this.activeCompositeSettingsKey, id, 1 /* WORKSPACE */);
        }
        else {
            this.storageService.remove(this.activeCompositeSettingsKey, 1 /* WORKSPACE */);
        }
        // Remember
        this.lastActiveCompositeId = this.activeComposite.getId();
        // Composites created for the first time
        var compositeContainer = this.mapCompositeToCompositeContainer[composite.getId()];
        if (!compositeContainer) {
            // Build Container off-DOM
            compositeContainer = $('.composite');
            addClasses(compositeContainer, this.compositeCSSClass);
            compositeContainer.id = composite.getId();
            composite.create(compositeContainer);
            composite.updateStyles();
            // Remember composite container
            this.mapCompositeToCompositeContainer[composite.getId()] = compositeContainer;
        }
        // Report progress for slow loading composites (but only if we did not create the composites before already)
        var progressService = this.mapProgressServiceToComposite[composite.getId()];
        if (progressService && !compositeContainer) {
            this.mapProgressServiceToComposite[composite.getId()].showWhile(Promise.resolve(), this.partService.isCreated() ? 800 : 3200 /* less ugly initial startup */);
        }
        // Fill Content and Actions
        // Make sure that the user meanwhile did not open another composite or closed the part containing the composite
        if (!this.activeComposite || composite.getId() !== this.activeComposite.getId()) {
            return void 0;
        }
        // Take Composite on-DOM and show
        this.getContentArea().appendChild(compositeContainer);
        show(compositeContainer);
        // Setup action runner
        this.toolBar.actionRunner = composite.getActionRunner();
        // Update title with composite title if it differs from descriptor
        var descriptor = this.registry.getComposite(composite.getId());
        if (descriptor && descriptor.name !== composite.getTitle()) {
            this.updateTitle(composite.getId(), composite.getTitle());
        }
        // Handle Composite Actions
        var actionsBinding = this.mapActionsBindingToComposite[composite.getId()];
        if (!actionsBinding) {
            actionsBinding = this.collectCompositeActions(composite);
            this.mapActionsBindingToComposite[composite.getId()] = actionsBinding;
        }
        actionsBinding();
        if (this.telemetryActionsListener) {
            this.telemetryActionsListener.dispose();
            this.telemetryActionsListener = null;
        }
        // Action Run Handling
        this.telemetryActionsListener = this.toolBar.actionRunner.onDidRun(function (e) {
            // Check for Error
            if (e.error && !errors.isPromiseCanceledError(e.error)) {
                _this.notificationService.error(e.error);
            }
            // Log in telemetry
            if (_this.telemetryService) {
                /* __GDPR__
                    "workbenchActionExecuted" : {
                        "id" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
                        "from": { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
                    }
                */
                _this.telemetryService.publicLog('workbenchActionExecuted', { id: e.action.id, from: _this.nameForTelemetry });
            }
        });
        // Indicate to composite that it is now visible
        composite.setVisible(true);
        // Make sure that the user meanwhile did not open another composite or closed the part containing the composite
        if (!this.activeComposite || composite.getId() !== this.activeComposite.getId()) {
            return;
        }
        // Make sure the composite is layed out
        if (this.contentAreaSize) {
            composite.layout(this.contentAreaSize);
        }
    };
    CompositePart.prototype.onTitleAreaUpdate = function (compositeId) {
        // Active Composite
        if (this.activeComposite && this.activeComposite.getId() === compositeId) {
            // Title
            this.updateTitle(this.activeComposite.getId(), this.activeComposite.getTitle());
            // Actions
            var actionsBinding = this.collectCompositeActions(this.activeComposite);
            this.mapActionsBindingToComposite[this.activeComposite.getId()] = actionsBinding;
            actionsBinding();
        }
        // Otherwise invalidate actions binding for next time when the composite becomes visible
        else {
            delete this.mapActionsBindingToComposite[compositeId];
        }
    };
    CompositePart.prototype.updateTitle = function (compositeId, compositeTitle) {
        var compositeDescriptor = this.registry.getComposite(compositeId);
        if (!compositeDescriptor || !this.titleLabel) {
            return;
        }
        if (!compositeTitle) {
            compositeTitle = compositeDescriptor.name;
        }
        var keybinding = this.keybindingService.lookupKeybinding(compositeId);
        this.titleLabel.updateTitle(compositeId, compositeTitle, keybinding ? keybinding.getLabel() : undefined);
        this.toolBar.setAriaLabel(nls.localize('ariaCompositeToolbarLabel', "{0} actions", compositeTitle));
    };
    CompositePart.prototype.collectCompositeActions = function (composite) {
        // From Composite
        var primaryActions = composite.getActions().slice(0);
        var secondaryActions = composite.getSecondaryActions().slice(0);
        // From Part
        primaryActions.push.apply(primaryActions, this.getActions());
        secondaryActions.push.apply(secondaryActions, this.getSecondaryActions());
        // Return fn to set into toolbar
        return this.toolBar.setActions(prepareActions(primaryActions), prepareActions(secondaryActions));
    };
    CompositePart.prototype.getActiveComposite = function () {
        return this.activeComposite;
    };
    CompositePart.prototype.getLastActiveCompositetId = function () {
        return this.lastActiveCompositeId;
    };
    CompositePart.prototype.hideActiveComposite = function () {
        if (!this.activeComposite) {
            return undefined; // Nothing to do
        }
        var composite = this.activeComposite;
        this.activeComposite = null;
        var compositeContainer = this.mapCompositeToCompositeContainer[composite.getId()];
        // Indicate to Composite
        composite.setVisible(false);
        // Take Container Off-DOM and hide
        compositeContainer.remove();
        hide(compositeContainer);
        // Clear any running Progress
        this.progressBar.stop().hide();
        // Empty Actions
        this.toolBar.setActions([])();
        this._onDidCompositeClose.fire(composite);
        return composite;
    };
    CompositePart.prototype.createTitleArea = function (parent) {
        var _this = this;
        // Title Area Container
        var titleArea = append(parent, $('.composite'));
        addClass(titleArea, 'title');
        // Left Title Label
        this.titleLabel = this.createTitleLabel(titleArea);
        // Right Actions Container
        var titleActionsContainer = append(titleArea, $('.title-actions'));
        // Toolbar
        this.toolBar = this._register(new ToolBar(titleActionsContainer, this.contextMenuService, {
            actionItemProvider: function (action) { return _this.actionItemProvider(action); },
            orientation: 0 /* HORIZONTAL */,
            getKeyBinding: function (action) { return _this.keybindingService.lookupKeybinding(action.id); }
        }));
        return titleArea;
    };
    CompositePart.prototype.createTitleLabel = function (parent) {
        var titleContainer = append(parent, $('.title-label'));
        var titleLabel = append(titleContainer, $('h2'));
        var $this = this;
        return {
            updateTitle: function (id, title, keybinding) {
                titleLabel.innerHTML = strings.escape(title);
                titleLabel.title = keybinding ? nls.localize('titleTooltip', "{0} ({1})", title, keybinding) : title;
            },
            updateStyles: function () {
                titleLabel.style.color = $this.getColor($this.titleForegroundColor);
            }
        };
    };
    CompositePart.prototype.updateStyles = function () {
        _super.prototype.updateStyles.call(this);
        // Forward to title label
        this.titleLabel.updateStyles();
    };
    CompositePart.prototype.actionItemProvider = function (action) {
        // Check Active Composite
        if (this.activeComposite) {
            return this.activeComposite.getActionItem(action);
        }
        return undefined;
    };
    CompositePart.prototype.createContentArea = function (parent) {
        var contentContainer = append(parent, $('.content'));
        this.progressBar = this._register(new ProgressBar(contentContainer));
        this._register(attachProgressBarStyler(this.progressBar, this.themeService));
        this.progressBar.hide();
        return contentContainer;
    };
    CompositePart.prototype.getProgressIndicator = function (id) {
        return this.mapProgressServiceToComposite[id];
    };
    CompositePart.prototype.getActions = function () {
        return [];
    };
    CompositePart.prototype.getSecondaryActions = function () {
        return [];
    };
    CompositePart.prototype.layout = function (dimension) {
        // Pass to super
        var sizes = _super.prototype.layout.call(this, dimension);
        // Pass Contentsize to composite
        this.contentAreaSize = sizes[1];
        if (this.activeComposite) {
            this.activeComposite.layout(this.contentAreaSize);
        }
        return sizes;
    };
    CompositePart.prototype.dispose = function () {
        this.mapCompositeToCompositeContainer = null;
        this.mapProgressServiceToComposite = null;
        this.mapActionsBindingToComposite = null;
        for (var i = 0; i < this.instantiatedComposites.length; i++) {
            this.instantiatedComposites[i].dispose();
        }
        this.instantiatedComposites = [];
        this.instantiatedCompositeListeners = dispose(this.instantiatedCompositeListeners);
        _super.prototype.dispose.call(this);
    };
    return CompositePart;
}(Part));
export { CompositePart };
