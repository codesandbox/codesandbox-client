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
import { TPromise } from '../../../../base/common/winjs.base';
import * as DOM from '../../../../base/browser/dom';
import { dispose, combinedDisposable, toDisposable } from '../../../../base/common/lifecycle';
import { Separator } from '../../../../base/browser/ui/actionbar/actionbar';
import { firstIndex } from '../../../../base/common/arrays';
import { IExtensionService } from '../../../services/extensions/common/extensions';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView';
import { Extensions as ViewContainerExtensions } from '../../../common/views';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry';
import { IThemeService } from '../../../../platform/theme/common/themeService';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation';
import { IStorageService } from '../../../../platform/storage/common/storage';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey';
import { StandardMouseEvent } from '../../../../base/browser/mouseEvent';
import { PanelViewlet, ViewletPanel } from './panelViewlet';
import { DefaultPanelDndController } from '../../../../base/browser/ui/splitview/panelview';
import { WorkbenchTree, IListService } from '../../../../platform/list/browser/listService';
import { latch, mapEvent } from '../../../../base/common/event';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration';
import { IPartService } from '../../../services/part/common/partService';
import { localize } from '../../../../nls';
import { PersistentContributableViewsModel } from './views';
import { Registry } from '../../../../platform/registry/common/platform';
var TreeViewsViewletPanel = /** @class */ (function (_super) {
    __extends(TreeViewsViewletPanel, _super);
    function TreeViewsViewletPanel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TreeViewsViewletPanel.prototype.setExpanded = function (expanded) {
        if (this.isExpanded() !== expanded) {
            this.updateTreeVisibility(this.tree, expanded);
            _super.prototype.setExpanded.call(this, expanded);
        }
    };
    TreeViewsViewletPanel.prototype.setVisible = function (visible) {
        var _this = this;
        if (this.isVisible() !== visible) {
            return _super.prototype.setVisible.call(this, visible)
                .then(function () { return _this.updateTreeVisibility(_this.tree, visible && _this.isExpanded()); });
        }
        return TPromise.wrap(null);
    };
    TreeViewsViewletPanel.prototype.focus = function () {
        _super.prototype.focus.call(this);
        this.focusTree();
    };
    TreeViewsViewletPanel.prototype.layoutBody = function (size) {
        if (this.tree) {
            this.tree.layout(size);
        }
    };
    TreeViewsViewletPanel.prototype.updateTreeVisibility = function (tree, isVisible) {
        if (!tree) {
            return;
        }
        if (isVisible) {
            DOM.show(tree.getHTMLElement());
        }
        else {
            DOM.hide(tree.getHTMLElement()); // make sure the tree goes out of the tabindex world by hiding it
        }
        if (isVisible) {
            tree.onVisible();
        }
        else {
            tree.onHidden();
        }
    };
    TreeViewsViewletPanel.prototype.focusTree = function () {
        if (!this.tree) {
            return; // return early if viewlet has not yet been created
        }
        // Make sure the current selected element is revealed
        var selectedElement = this.tree.getSelection()[0];
        if (selectedElement) {
            this.tree.reveal(selectedElement, 0.5);
        }
        // Pass Focus to Viewer
        this.tree.domFocus();
    };
    TreeViewsViewletPanel.prototype.dispose = function () {
        if (this.tree) {
            this.tree.dispose();
        }
        _super.prototype.dispose.call(this);
    };
    return TreeViewsViewletPanel;
}(ViewletPanel));
export { TreeViewsViewletPanel };
var ViewContainerViewlet = /** @class */ (function (_super) {
    __extends(ViewContainerViewlet, _super);
    function ViewContainerViewlet(id, viewletStateStorageId, showHeaderInTitleWhenSingleView, configurationService, partService, telemetryService, storageService, instantiationService, themeService, contextMenuService, extensionService, contextService) {
        var _this = _super.call(this, id, { showHeaderInTitleWhenSingleView: showHeaderInTitleWhenSingleView, dnd: new DefaultPanelDndController() }, configurationService, partService, contextMenuService, telemetryService, themeService) || this;
        _this.storageService = storageService;
        _this.instantiationService = instantiationService;
        _this.contextMenuService = contextMenuService;
        _this.extensionService = extensionService;
        _this.contextService = contextService;
        _this.didLayout = false;
        _this.areExtensionsReady = false;
        _this.viewDisposables = [];
        var container = Registry.as(ViewContainerExtensions.ViewContainersRegistry).get(id);
        _this.viewsModel = _this._register(_this.instantiationService.createInstance(PersistentContributableViewsModel, container, viewletStateStorageId));
        _this.viewletSettings = _this.getMemento(storageService, 1 /* WORKSPACE */);
        _this.visibleViewsStorageId = id + ".numberOfVisibleViews";
        _this.visibleViewsCountFromCache = _this.storageService.getInteger(_this.visibleViewsStorageId, _this.contextService.getWorkbenchState() === 1 /* EMPTY */ ? 0 /* GLOBAL */ : 1 /* WORKSPACE */, 0);
        _this._register(toDisposable(function () { return _this.viewDisposables = dispose(_this.viewDisposables); }));
        return _this;
    }
    ViewContainerViewlet.prototype.create = function (parent) {
        var _this = this;
        return _super.prototype.create.call(this, parent).then(function () {
            _this._register(_this.onDidSashChange(function () { return _this.saveViewSizes(); }));
            _this.viewsModel.onDidAdd(function (added) { return _this.onDidAddViews(added); });
            _this.viewsModel.onDidRemove(function (removed) { return _this.onDidRemoveViews(removed); });
            var addedViews = _this.viewsModel.visibleViewDescriptors.map(function (viewDescriptor, index) {
                var size = _this.viewsModel.getSize(viewDescriptor.id);
                var collapsed = _this.viewsModel.isCollapsed(viewDescriptor.id);
                return ({ viewDescriptor: viewDescriptor, index: index, size: size, collapsed: collapsed });
            });
            if (addedViews.length) {
                _this.onDidAddViews(addedViews);
            }
            // Update headers after and title contributed views after available, since we read from cache in the beginning to know if the viewlet has single view or not. Ref #29609
            _this.extensionService.whenInstalledExtensionsRegistered().then(function () {
                _this.areExtensionsReady = true;
                if (_this.panels.length) {
                    _this.updateTitleArea();
                    _this.updateViewHeaders();
                }
            });
            _this.focus();
        });
    };
    ViewContainerViewlet.prototype.getContextMenuActions = function () {
        var _this = this;
        var result = [];
        var viewToggleActions = this.viewsModel.viewDescriptors.map(function (viewDescriptor) { return ({
            id: viewDescriptor.id + ".toggleVisibility",
            label: viewDescriptor.name,
            checked: _this.viewsModel.isVisible(viewDescriptor.id),
            enabled: viewDescriptor.canToggleVisibility,
            run: function () { return _this.toggleViewVisibility(viewDescriptor.id); }
        }); });
        result.push.apply(result, viewToggleActions);
        var parentActions = _super.prototype.getContextMenuActions.call(this);
        if (viewToggleActions.length && parentActions.length) {
            result.push(new Separator());
        }
        result.push.apply(result, parentActions);
        return result;
    };
    ViewContainerViewlet.prototype.setVisible = function (visible) {
        var _this = this;
        return _super.prototype.setVisible.call(this, visible)
            .then(function () { return Promise.all(_this.panels.filter(function (view) { return view.isVisible() !== visible; })
            .map(function (view) { return view.setVisible(visible); })); })
            .then(function () { return void 0; });
    };
    ViewContainerViewlet.prototype.openView = function (id, focus) {
        if (focus) {
            this.focus();
        }
        var view = this.getView(id);
        if (!view) {
            this.toggleViewVisibility(id);
        }
        view = this.getView(id);
        view.setExpanded(true);
        if (focus) {
            view.focus();
        }
        return Promise.resolve(view);
    };
    ViewContainerViewlet.prototype.movePanel = function (from, to) {
        var fromIndex = firstIndex(this.panels, function (panel) { return panel === from; });
        var toIndex = firstIndex(this.panels, function (panel) { return panel === to; });
        var fromViewDescriptor = this.viewsModel.visibleViewDescriptors[fromIndex];
        var toViewDescriptor = this.viewsModel.visibleViewDescriptors[toIndex];
        _super.prototype.movePanel.call(this, from, to);
        this.viewsModel.move(fromViewDescriptor.id, toViewDescriptor.id);
    };
    ViewContainerViewlet.prototype.layout = function (dimension) {
        _super.prototype.layout.call(this, dimension);
        this.dimension = dimension;
        if (this.didLayout) {
            this.saveViewSizes();
        }
        else {
            this.didLayout = true;
            this.restoreViewSizes();
        }
    };
    ViewContainerViewlet.prototype.getOptimalWidth = function () {
        var additionalMargin = 16;
        var optimalWidth = Math.max.apply(Math, this.panels.map(function (view) { return view.getOptimalWidth() || 0; }));
        return optimalWidth + additionalMargin;
    };
    ViewContainerViewlet.prototype.shutdown = function () {
        this.panels.forEach(function (view) { return view.shutdown(); });
        this.storageService.store(this.visibleViewsStorageId, this.length, this.contextService.getWorkbenchState() !== 1 /* EMPTY */ ? 1 /* WORKSPACE */ : 0 /* GLOBAL */);
        this.viewsModel.saveViewsStates();
        _super.prototype.shutdown.call(this);
    };
    ViewContainerViewlet.prototype.isSingleView = function () {
        if (!_super.prototype.isSingleView.call(this)) {
            return false;
        }
        if (!this.areExtensionsReady) {
            // Check in cache so that view do not jump. See #29609
            return this.visibleViewsCountFromCache === 1;
        }
        return true;
    };
    ViewContainerViewlet.prototype.createView = function (viewDescriptor, options) {
        return this.instantiationService.createInstance(viewDescriptor.ctor, options);
    };
    ViewContainerViewlet.prototype.getView = function (id) {
        return this.panels.filter(function (view) { return view.id === id; })[0];
    };
    ViewContainerViewlet.prototype.onDidAddViews = function (added) {
        var _this = this;
        var panelsToAdd = [];
        var _loop_1 = function (viewDescriptor, collapsed, index, size) {
            var panel = this_1.createView(viewDescriptor, {
                id: viewDescriptor.id,
                title: viewDescriptor.name,
                actionRunner: this_1.getActionRunner(),
                expanded: !collapsed,
                viewletSettings: this_1.viewletSettings
            });
            panel.render();
            panel.setVisible(true);
            var contextMenuDisposable = DOM.addDisposableListener(panel.draggableElement, 'contextmenu', function (e) {
                e.stopPropagation();
                e.preventDefault();
                _this.onContextMenu(new StandardMouseEvent(e), viewDescriptor);
            });
            var collapseDisposable = latch(mapEvent(panel.onDidChange, function () { return !panel.isExpanded(); }))(function (collapsed) {
                _this.viewsModel.setCollapsed(viewDescriptor.id, collapsed);
            });
            this_1.viewDisposables.splice(index, 0, combinedDisposable([contextMenuDisposable, collapseDisposable]));
            panelsToAdd.push({ panel: panel, size: size || panel.minimumSize, index: index });
        };
        var this_1 = this;
        for (var _i = 0, added_1 = added; _i < added_1.length; _i++) {
            var _a = added_1[_i], viewDescriptor = _a.viewDescriptor, collapsed = _a.collapsed, index = _a.index, size = _a.size;
            _loop_1(viewDescriptor, collapsed, index, size);
        }
        this.addPanels(panelsToAdd);
        this.restoreViewSizes();
        return panelsToAdd.map(function (_a) {
            var panel = _a.panel;
            return panel;
        });
    };
    ViewContainerViewlet.prototype.onDidRemoveViews = function (removed) {
        removed = removed.sort(function (a, b) { return b.index - a.index; });
        var panelsToRemove = [];
        for (var _i = 0, removed_1 = removed; _i < removed_1.length; _i++) {
            var index = removed_1[_i].index;
            var disposable = this.viewDisposables.splice(index, 1)[0];
            disposable.dispose();
            panelsToRemove.push(this.panels[index]);
        }
        this.removePanels(panelsToRemove);
        dispose(panelsToRemove);
    };
    ViewContainerViewlet.prototype.onContextMenu = function (event, viewDescriptor) {
        var _this = this;
        event.stopPropagation();
        event.preventDefault();
        var actions = [];
        actions.push({
            id: viewDescriptor.id + ".removeView",
            label: localize('hideView', "Hide"),
            enabled: viewDescriptor.canToggleVisibility,
            run: function () { return _this.toggleViewVisibility(viewDescriptor.id); }
        });
        var otherActions = this.getContextMenuActions();
        if (otherActions.length) {
            actions.push.apply(actions, [new Separator()].concat(otherActions));
        }
        var anchor = { x: event.posx, y: event.posy };
        this.contextMenuService.showContextMenu({
            getAnchor: function () { return anchor; },
            getActions: function () { return Promise.resolve(actions); }
        });
    };
    ViewContainerViewlet.prototype.toggleViewVisibility = function (viewId) {
        var visible = !this.viewsModel.isVisible(viewId);
        /* __GDPR__
            "views.toggleVisibility" : {
                "viewId" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
                "visible": { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
            }
        */
        this.telemetryService.publicLog('views.toggledVisibility', { viewId: viewId, visible: visible });
        this.viewsModel.setVisible(viewId, visible);
    };
    ViewContainerViewlet.prototype.saveViewSizes = function () {
        // Save size only when the layout has happened
        if (this.didLayout) {
            for (var _i = 0, _a = this.panels; _i < _a.length; _i++) {
                var view = _a[_i];
                this.viewsModel.setSize(view.id, this.getPanelSize(view));
            }
        }
    };
    ViewContainerViewlet.prototype.restoreViewSizes = function () {
        // Restore sizes only when the layout has happened
        if (this.didLayout) {
            var initialSizes = void 0;
            for (var i = 0; i < this.viewsModel.visibleViewDescriptors.length; i++) {
                var panel = this.panels[i];
                var viewDescriptor = this.viewsModel.visibleViewDescriptors[i];
                var size = this.viewsModel.getSize(viewDescriptor.id);
                if (typeof size === 'number') {
                    this.resizePanel(panel, size);
                }
                else {
                    initialSizes = initialSizes ? initialSizes : this.computeInitialSizes();
                    this.resizePanel(panel, initialSizes[panel.id] || 200);
                }
            }
        }
    };
    ViewContainerViewlet.prototype.computeInitialSizes = function () {
        var sizes = {};
        if (this.dimension) {
            var totalWeight = this.viewsModel.visibleViewDescriptors.reduce(function (totalWeight, _a) {
                var weight = _a.weight;
                return totalWeight + (weight || 20);
            }, 0);
            for (var _i = 0, _a = this.viewsModel.visibleViewDescriptors; _i < _a.length; _i++) {
                var viewDescriptor = _a[_i];
                sizes[viewDescriptor.id] = this.dimension.height * (viewDescriptor.weight || 20) / totalWeight;
            }
        }
        return sizes;
    };
    ViewContainerViewlet = __decorate([
        __param(3, IConfigurationService),
        __param(4, IPartService),
        __param(5, ITelemetryService),
        __param(6, IStorageService),
        __param(7, IInstantiationService),
        __param(8, IThemeService),
        __param(9, IContextMenuService),
        __param(10, IExtensionService),
        __param(11, IWorkspaceContextService)
    ], ViewContainerViewlet);
    return ViewContainerViewlet;
}(PanelViewlet));
export { ViewContainerViewlet };
var FileIconThemableWorkbenchTree = /** @class */ (function (_super) {
    __extends(FileIconThemableWorkbenchTree, _super);
    function FileIconThemableWorkbenchTree(container, configuration, options, contextKeyService, listService, themeService, configurationService, instantiationService) {
        var _this = _super.call(this, container, configuration, __assign({}, options, { showTwistie: false, twistiePixels: 12 }), contextKeyService, listService, themeService, instantiationService, configurationService) || this;
        DOM.addClass(container, 'file-icon-themable-tree');
        DOM.addClass(container, 'show-file-icons');
        var onFileIconThemeChange = function (fileIconTheme) {
            DOM.toggleClass(container, 'align-icons-and-twisties', fileIconTheme.hasFileIcons && !fileIconTheme.hasFolderIcons);
            DOM.toggleClass(container, 'hide-arrows', fileIconTheme.hidesExplorerArrows === true);
        };
        _this.disposables.push(themeService.onDidFileIconThemeChange(onFileIconThemeChange));
        onFileIconThemeChange(themeService.getFileIconTheme());
        return _this;
    }
    FileIconThemableWorkbenchTree = __decorate([
        __param(3, IContextKeyService),
        __param(4, IListService),
        __param(5, IThemeService),
        __param(6, IConfigurationService),
        __param(7, IInstantiationService)
    ], FileIconThemableWorkbenchTree);
    return FileIconThemableWorkbenchTree;
}(WorkbenchTree));
export { FileIconThemableWorkbenchTree };
