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
import './media/panelviewlet.css';
import * as nls from '../../../../nls.js';
import { TPromise } from '../../../../base/common/winjs.base.js';
import { Emitter, filterEvent } from '../../../../base/common/event.js';
import { attachStyler } from '../../../../platform/theme/common/styler.js';
import { SIDE_BAR_DRAG_AND_DROP_BACKGROUND, SIDE_BAR_SECTION_HEADER_FOREGROUND, SIDE_BAR_SECTION_HEADER_BACKGROUND, SIDE_BAR_SECTION_HEADER_BORDER } from '../../../common/theme.js';
import { append, $, trackFocus, toggleClass, EventType, isAncestor, addDisposableListener } from '../../../../base/browser/dom.js';
import { combinedDisposable } from '../../../../base/common/lifecycle.js';
import { firstIndex } from '../../../../base/common/arrays.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { prepareActions } from '../../actions.js';
import { Viewlet, Extensions } from '../../viewlet.js';
import { ToolBar } from '../../../../base/browser/ui/toolbar/toolbar.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { PanelView, Panel } from '../../../../base/browser/ui/splitview/panelview.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IPartService } from '../../../services/part/common/partService.js';
import { StandardMouseEvent } from '../../../../base/browser/mouseEvent.js';
var ViewletPanel = /** @class */ (function (_super) {
    __extends(ViewletPanel, _super);
    function ViewletPanel(options, keybindingService, contextMenuService, configurationService) {
        var _this = _super.call(this, options) || this;
        _this.keybindingService = keybindingService;
        _this.contextMenuService = contextMenuService;
        _this.configurationService = configurationService;
        _this._onDidFocus = new Emitter();
        _this.onDidFocus = _this._onDidFocus.event;
        _this._onDidBlur = new Emitter();
        _this.onDidBlur = _this._onDidBlur.event;
        _this._onDidChangeTitleArea = new Emitter();
        _this.onDidChangeTitleArea = _this._onDidChangeTitleArea.event;
        _this.id = options.id;
        _this.title = options.title;
        _this.actionRunner = options.actionRunner;
        return _this;
    }
    ViewletPanel.prototype.setVisible = function (visible) {
        if (this._isVisible !== visible) {
            this._isVisible = visible;
        }
        return TPromise.wrap(null);
    };
    ViewletPanel.prototype.isVisible = function () {
        return this._isVisible;
    };
    ViewletPanel.prototype.render = function () {
        var _this = this;
        _super.prototype.render.call(this);
        var focusTracker = trackFocus(this.element);
        this.disposables.push(focusTracker);
        this.disposables.push(focusTracker.onDidFocus(function () { return _this._onDidFocus.fire(); }));
        this.disposables.push(focusTracker.onDidBlur(function () { return _this._onDidBlur.fire(); }));
    };
    ViewletPanel.prototype.renderHeader = function (container) {
        var _this = this;
        this.headerContainer = container;
        this.renderHeaderTitle(container, this.title);
        var actions = append(container, $('.actions'));
        this.toolbar = new ToolBar(actions, this.contextMenuService, {
            orientation: 0 /* HORIZONTAL */,
            actionItemProvider: function (action) { return _this.getActionItem(action); },
            ariaLabel: nls.localize('viewToolbarAriaLabel', "{0} actions", this.title),
            getKeyBinding: function (action) { return _this.keybindingService.lookupKeybinding(action.id); },
            actionRunner: this.actionRunner
        });
        this.disposables.push(this.toolbar);
        this.setActions();
        var onDidRelevantConfigurationChange = filterEvent(this.configurationService.onDidChangeConfiguration, function (e) { return e.affectsConfiguration(ViewletPanel.AlwaysShowActionsConfig); });
        onDidRelevantConfigurationChange(this.updateActionsVisibility, this, this.disposables);
        this.updateActionsVisibility();
    };
    ViewletPanel.prototype.renderHeaderTitle = function (container, title) {
        append(container, $('h3.title', null, title));
    };
    ViewletPanel.prototype.focus = function () {
        if (this.element) {
            this.element.focus();
            this._onDidFocus.fire();
        }
    };
    ViewletPanel.prototype.setActions = function () {
        this.toolbar.setActions(prepareActions(this.getActions()), prepareActions(this.getSecondaryActions()))();
        this.toolbar.context = this.getActionsContext();
    };
    ViewletPanel.prototype.updateActionsVisibility = function () {
        var shouldAlwaysShowActions = this.configurationService.getValue('workbench.view.alwaysShowHeaderActions');
        toggleClass(this.headerContainer, 'actions-always-visible', shouldAlwaysShowActions);
    };
    ViewletPanel.prototype.updateActions = function () {
        this.setActions();
        this._onDidChangeTitleArea.fire();
    };
    ViewletPanel.prototype.getActions = function () {
        return [];
    };
    ViewletPanel.prototype.getSecondaryActions = function () {
        return [];
    };
    ViewletPanel.prototype.getActionItem = function (action) {
        return null;
    };
    ViewletPanel.prototype.getActionsContext = function () {
        return undefined;
    };
    ViewletPanel.prototype.getOptimalWidth = function () {
        return 0;
    };
    ViewletPanel.prototype.shutdown = function () {
    };
    ViewletPanel.AlwaysShowActionsConfig = 'workbench.view.alwaysShowHeaderActions';
    ViewletPanel = __decorate([
        __param(1, IKeybindingService),
        __param(2, IContextMenuService),
        __param(3, IConfigurationService)
    ], ViewletPanel);
    return ViewletPanel;
}(Panel));
export { ViewletPanel };
var PanelViewlet = /** @class */ (function (_super) {
    __extends(PanelViewlet, _super);
    function PanelViewlet(id, options, configurationService, partService, contextMenuService, telemetryService, themeService) {
        var _this = _super.call(this, id, configurationService, partService, telemetryService, themeService) || this;
        _this.options = options;
        _this.contextMenuService = contextMenuService;
        _this.panelItems = [];
        return _this;
    }
    Object.defineProperty(PanelViewlet.prototype, "onDidSashChange", {
        get: function () {
            return this.panelview.onDidSashChange;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PanelViewlet.prototype, "panels", {
        get: function () {
            return this.panelItems.map(function (i) { return i.panel; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PanelViewlet.prototype, "length", {
        get: function () {
            return this.panelItems.length;
        },
        enumerable: true,
        configurable: true
    });
    PanelViewlet.prototype.create = function (parent) {
        var _this = this;
        return _super.prototype.create.call(this, parent).then(function () {
            _this.panelview = _this._register(new PanelView(parent, _this.options));
            _this._register(_this.panelview.onDidDrop(function (_a) {
                var from = _a.from, to = _a.to;
                return _this.movePanel(from, to);
            }));
            _this._register(addDisposableListener(parent, EventType.CONTEXT_MENU, function (e) { return _this.showContextMenu(new StandardMouseEvent(e)); }));
        });
    };
    PanelViewlet.prototype.showContextMenu = function (event) {
        var _this = this;
        for (var _i = 0, _a = this.panelItems; _i < _a.length; _i++) {
            var panelItem = _a[_i];
            // Do not show context menu if target is coming from inside panel views
            if (isAncestor(event.target, panelItem.panel.element)) {
                return;
            }
        }
        event.stopPropagation();
        event.preventDefault();
        var anchor = { x: event.posx, y: event.posy };
        this.contextMenuService.showContextMenu({
            getAnchor: function () { return anchor; },
            getActions: function () { return Promise.resolve(_this.getContextMenuActions()); }
        });
    };
    PanelViewlet.prototype.getTitle = function () {
        var title = Registry.as(Extensions.Viewlets).getViewlet(this.getId()).name;
        if (this.isSingleView()) {
            title += ': ' + this.panelItems[0].panel.title;
        }
        return title;
    };
    PanelViewlet.prototype.getActions = function () {
        if (this.isSingleView()) {
            return this.panelItems[0].panel.getActions();
        }
        return [];
    };
    PanelViewlet.prototype.getSecondaryActions = function () {
        if (this.isSingleView()) {
            return this.panelItems[0].panel.getSecondaryActions();
        }
        return [];
    };
    PanelViewlet.prototype.getActionItem = function (action) {
        if (this.isSingleView()) {
            return this.panelItems[0].panel.getActionItem(action);
        }
        return _super.prototype.getActionItem.call(this, action);
    };
    PanelViewlet.prototype.focus = function () {
        _super.prototype.focus.call(this);
        if (this.lastFocusedPanel) {
            this.lastFocusedPanel.focus();
        }
        else if (this.panelItems.length > 0) {
            for (var _i = 0, _a = this.panelItems; _i < _a.length; _i++) {
                var panel = _a[_i].panel;
                if (panel.isExpanded()) {
                    panel.focus();
                    return;
                }
            }
        }
    };
    PanelViewlet.prototype.layout = function (dimension) {
        this.panelview.layout(dimension.height);
    };
    PanelViewlet.prototype.getOptimalWidth = function () {
        var sizes = this.panelItems
            .map(function (panelItem) { return panelItem.panel.getOptimalWidth() || 0; });
        return Math.max.apply(Math, sizes);
    };
    PanelViewlet.prototype.addPanels = function (panels) {
        var wasSingleView = this.isSingleView();
        for (var _i = 0, panels_1 = panels; _i < panels_1.length; _i++) {
            var _a = panels_1[_i], panel = _a.panel, size = _a.size, index = _a.index;
            this.addPanel(panel, size, index);
        }
        this.updateViewHeaders();
        if (this.isSingleView() !== wasSingleView) {
            this.updateTitleArea();
        }
    };
    PanelViewlet.prototype.addPanel = function (panel, size, index) {
        var _this = this;
        if (index === void 0) { index = this.panelItems.length - 1; }
        var disposables = [];
        var onDidFocus = panel.onDidFocus(function () { return _this.lastFocusedPanel = panel; }, null, disposables);
        var onDidChangeTitleArea = panel.onDidChangeTitleArea(function () {
            if (_this.isSingleView()) {
                _this.updateTitleArea();
            }
        }, null, disposables);
        var onDidChange = panel.onDidChange(function () {
            if (panel === _this.lastFocusedPanel && !panel.isExpanded()) {
                _this.lastFocusedPanel = undefined;
            }
        }, null, disposables);
        var panelStyler = attachStyler(this.themeService, {
            headerForeground: SIDE_BAR_SECTION_HEADER_FOREGROUND,
            headerBackground: SIDE_BAR_SECTION_HEADER_BACKGROUND,
            headerBorder: index === 0 ? null : SIDE_BAR_SECTION_HEADER_BORDER,
            dropBackground: SIDE_BAR_DRAG_AND_DROP_BACKGROUND
        }, panel);
        var disposable = combinedDisposable([onDidFocus, onDidChangeTitleArea, panelStyler, onDidChange]);
        var panelItem = { panel: panel, disposable: disposable };
        this.panelItems.splice(index, 0, panelItem);
        this.panelview.addPanel(panel, size, index);
    };
    PanelViewlet.prototype.removePanels = function (panels) {
        var _this = this;
        var wasSingleView = this.isSingleView();
        panels.forEach(function (panel) { return _this.removePanel(panel); });
        this.updateViewHeaders();
        if (wasSingleView !== this.isSingleView()) {
            this.updateTitleArea();
        }
    };
    PanelViewlet.prototype.removePanel = function (panel) {
        var index = firstIndex(this.panelItems, function (i) { return i.panel === panel; });
        if (index === -1) {
            return;
        }
        if (this.lastFocusedPanel === panel) {
            this.lastFocusedPanel = undefined;
        }
        this.panelview.removePanel(panel);
        var panelItem = this.panelItems.splice(index, 1)[0];
        panelItem.disposable.dispose();
    };
    PanelViewlet.prototype.movePanel = function (from, to) {
        var fromIndex = firstIndex(this.panelItems, function (item) { return item.panel === from; });
        var toIndex = firstIndex(this.panelItems, function (item) { return item.panel === to; });
        if (fromIndex < 0 || fromIndex >= this.panelItems.length) {
            return;
        }
        if (toIndex < 0 || toIndex >= this.panelItems.length) {
            return;
        }
        var panelItem = this.panelItems.splice(fromIndex, 1)[0];
        this.panelItems.splice(toIndex, 0, panelItem);
        this.panelview.movePanel(from, to);
    };
    PanelViewlet.prototype.resizePanel = function (panel, size) {
        this.panelview.resizePanel(panel, size);
    };
    PanelViewlet.prototype.getPanelSize = function (panel) {
        return this.panelview.getPanelSize(panel);
    };
    PanelViewlet.prototype.updateViewHeaders = function () {
        if (this.isSingleView()) {
            this.panelItems[0].panel.setExpanded(true);
            this.panelItems[0].panel.headerVisible = false;
        }
        else {
            this.panelItems.forEach(function (i) { return i.panel.headerVisible = true; });
        }
    };
    PanelViewlet.prototype.isSingleView = function () {
        return this.options.showHeaderInTitleWhenSingleView && this.panelItems.length === 1;
    };
    PanelViewlet.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this.panelItems.forEach(function (i) { return i.disposable.dispose(); });
        this.panelview.dispose();
    };
    PanelViewlet = __decorate([
        __param(2, IConfigurationService),
        __param(3, IPartService),
        __param(4, IContextMenuService),
        __param(5, ITelemetryService),
        __param(6, IThemeService)
    ], PanelViewlet);
    return PanelViewlet;
}(Viewlet));
export { PanelViewlet };
