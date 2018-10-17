/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
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
import './media/explorerviewlet.css';
import { localize } from '../../../../nls.js';
import * as DOM from '../../../../base/browser/dom.js';
import { VIEWLET_ID, ExplorerViewletVisibleContext, OpenEditorsVisibleContext, OpenEditorsVisibleCondition, VIEW_CONTAINER } from '../common/files.js';
import { ViewContainerViewlet } from '../../../browser/parts/views/viewsViewlet.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ActionRunner, FileViewletState } from './views/explorerViewer.js';
import { ExplorerView } from './views/explorerView.js';
import { EmptyView } from './views/emptyView.js';
import { OpenEditorsView } from './views/openEditorsView.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { ServiceCollection } from '../../../../platform/instantiation/common/serviceCollection.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { ViewsRegistry } from '../../../common/views.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { IPartService } from '../../../services/part/common/partService.js';
import { DelegatingEditorService } from '../../../services/editor/browser/editorService.js';
import { IEditorGroupsService } from '../../../services/group/common/editorGroupsService.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { KeyChord } from '../../../../base/common/keyCodes.js';
var ExplorerViewletViewsContribution = /** @class */ (function (_super) {
    __extends(ExplorerViewletViewsContribution, _super);
    function ExplorerViewletViewsContribution(workspaceContextService, configurationService, contextKeyService) {
        var _this = _super.call(this) || this;
        _this.workspaceContextService = workspaceContextService;
        _this.configurationService = configurationService;
        _this.registerViews();
        _this.openEditorsVisibleContextKey = OpenEditorsVisibleContext.bindTo(contextKeyService);
        _this.updateOpenEditorsVisibility();
        _this._register(workspaceContextService.onDidChangeWorkbenchState(function () { return _this.registerViews(); }));
        _this._register(workspaceContextService.onDidChangeWorkspaceFolders(function () { return _this.registerViews(); }));
        _this._register(_this.configurationService.onDidChangeConfiguration(function (e) { return _this.onConfigurationUpdated(e); }));
        return _this;
    }
    ExplorerViewletViewsContribution.prototype.registerViews = function () {
        var viewDescriptors = ViewsRegistry.getViews(VIEW_CONTAINER);
        var viewDescriptorsToRegister = [];
        var viewDescriptorsToDeregister = [];
        var openEditorsViewDescriptor = this.createOpenEditorsViewDescriptor();
        var openEditorsViewDescriptorExists = viewDescriptors.some(function (v) { return v.id === openEditorsViewDescriptor.id; });
        var explorerViewDescriptor = this.createExplorerViewDescriptor();
        var explorerViewDescriptorExists = viewDescriptors.some(function (v) { return v.id === explorerViewDescriptor.id; });
        var emptyViewDescriptor = this.createEmptyViewDescriptor();
        var emptyViewDescriptorExists = viewDescriptors.some(function (v) { return v.id === emptyViewDescriptor.id; });
        if (!openEditorsViewDescriptorExists) {
            viewDescriptorsToRegister.push(openEditorsViewDescriptor);
        }
        if (this.workspaceContextService.getWorkbenchState() === 1 /* EMPTY */ || this.workspaceContextService.getWorkspace().folders.length === 0) {
            if (explorerViewDescriptorExists) {
                viewDescriptorsToDeregister.push(explorerViewDescriptor.id);
            }
            if (!emptyViewDescriptorExists) {
                viewDescriptorsToRegister.push(emptyViewDescriptor);
            }
        }
        else {
            if (emptyViewDescriptorExists) {
                viewDescriptorsToDeregister.push(emptyViewDescriptor.id);
            }
            if (!explorerViewDescriptorExists) {
                viewDescriptorsToRegister.push(explorerViewDescriptor);
            }
        }
        if (viewDescriptorsToRegister.length) {
            ViewsRegistry.registerViews(viewDescriptorsToRegister);
        }
        if (viewDescriptorsToDeregister.length) {
            ViewsRegistry.deregisterViews(viewDescriptorsToDeregister, VIEW_CONTAINER);
        }
    };
    ExplorerViewletViewsContribution.prototype.createOpenEditorsViewDescriptor = function () {
        return {
            id: OpenEditorsView.ID,
            name: OpenEditorsView.NAME,
            container: VIEW_CONTAINER,
            ctor: OpenEditorsView,
            order: 0,
            when: OpenEditorsVisibleCondition,
            canToggleVisibility: true,
            focusCommand: {
                id: 'workbench.files.action.focusOpenEditorsView',
                keybindings: { primary: KeyChord(2048 /* CtrlCmd */ | 41 /* KEY_K */, 35 /* KEY_E */) }
            }
        };
    };
    ExplorerViewletViewsContribution.prototype.createEmptyViewDescriptor = function () {
        return {
            id: EmptyView.ID,
            name: EmptyView.NAME,
            container: VIEW_CONTAINER,
            ctor: EmptyView,
            order: 1,
            canToggleVisibility: false
        };
    };
    ExplorerViewletViewsContribution.prototype.createExplorerViewDescriptor = function () {
        return {
            id: ExplorerView.ID,
            name: localize('folders', "Folders"),
            container: VIEW_CONTAINER,
            ctor: ExplorerView,
            order: 1,
            canToggleVisibility: false
        };
    };
    ExplorerViewletViewsContribution.prototype.onConfigurationUpdated = function (e) {
        if (e.affectsConfiguration('explorer.openEditors.visible')) {
            this.updateOpenEditorsVisibility();
        }
    };
    ExplorerViewletViewsContribution.prototype.updateOpenEditorsVisibility = function () {
        this.openEditorsVisibleContextKey.set(this.workspaceContextService.getWorkbenchState() === 1 /* EMPTY */ || this.configurationService.getValue('explorer.openEditors.visible') !== 0);
    };
    ExplorerViewletViewsContribution = __decorate([
        __param(0, IWorkspaceContextService),
        __param(1, IConfigurationService),
        __param(2, IContextKeyService)
    ], ExplorerViewletViewsContribution);
    return ExplorerViewletViewsContribution;
}(Disposable));
export { ExplorerViewletViewsContribution };
var ExplorerViewlet = /** @class */ (function (_super) {
    __extends(ExplorerViewlet, _super);
    function ExplorerViewlet(partService, telemetryService, contextService, storageService, editorService, editorGroupService, configurationService, instantiationService, contextKeyService, themeService, contextMenuService, extensionService) {
        var _this = _super.call(this, VIEWLET_ID, ExplorerViewlet.EXPLORER_VIEWS_STATE, true, configurationService, partService, telemetryService, storageService, instantiationService, themeService, contextMenuService, extensionService, contextService) || this;
        _this.contextService = contextService;
        _this.storageService = storageService;
        _this.editorService = editorService;
        _this.editorGroupService = editorGroupService;
        _this.instantiationService = instantiationService;
        _this.viewletState = new FileViewletState();
        _this.viewletVisibleContextKey = ExplorerViewletVisibleContext.bindTo(contextKeyService);
        _this._register(_this.contextService.onDidChangeWorkspaceName(function (e) { return _this.updateTitleArea(); }));
        return _this;
    }
    ExplorerViewlet.prototype.create = function (parent) {
        return _super.prototype.create.call(this, parent).then(function () {
            DOM.addClass(parent, 'explorer-viewlet');
        });
    };
    ExplorerViewlet.prototype.createView = function (viewDescriptor, options) {
        var _this = this;
        if (viewDescriptor.id === ExplorerView.ID) {
            // Create a delegating editor service for the explorer to be able to delay the refresh in the opened
            // editors view above. This is a workaround for being able to double click on a file to make it pinned
            // without causing the animation in the opened editors view to kick in and change scroll position.
            // We try to be smart and only use the delay if we recognize that the user action is likely to cause
            // a new entry in the opened editors view.
            var delegatingEditorService = this.instantiationService.createInstance(DelegatingEditorService);
            delegatingEditorService.setEditorOpenHandler(function (group, editor, options) {
                var openEditorsView = _this.getOpenEditorsView();
                if (openEditorsView) {
                    var delay = 0;
                    var config = _this.configurationService.getValue();
                    var delayEditorOpeningInOpenedEditors = !!config.workbench.editor.enablePreview; // No need to delay if preview is disabled
                    var activeGroup = _this.editorGroupService.activeGroup;
                    if (delayEditorOpeningInOpenedEditors && group === activeGroup && !activeGroup.previewEditor) {
                        delay = 250; // a new editor entry is likely because there is either no group or no preview in group
                    }
                    openEditorsView.setStructuralRefreshDelay(delay);
                }
                var onSuccessOrError = function (editor) {
                    var openEditorsView = _this.getOpenEditorsView();
                    if (openEditorsView) {
                        openEditorsView.setStructuralRefreshDelay(0);
                    }
                    return editor;
                };
                return _this.editorService.openEditor(editor, options, group).then(onSuccessOrError, onSuccessOrError);
            });
            var explorerInstantiator = this.instantiationService.createChild(new ServiceCollection([IEditorService, delegatingEditorService]));
            return explorerInstantiator.createInstance(ExplorerView, __assign({}, options, { viewletState: this.viewletState }));
        }
        return _super.prototype.createView.call(this, viewDescriptor, options);
    };
    ExplorerViewlet.prototype.getExplorerView = function () {
        return this.getView(ExplorerView.ID);
    };
    ExplorerViewlet.prototype.getOpenEditorsView = function () {
        return this.getView(OpenEditorsView.ID);
    };
    ExplorerViewlet.prototype.getEmptyView = function () {
        return this.getView(EmptyView.ID);
    };
    ExplorerViewlet.prototype.setVisible = function (visible) {
        this.viewletVisibleContextKey.set(visible);
        return _super.prototype.setVisible.call(this, visible);
    };
    ExplorerViewlet.prototype.getActionRunner = function () {
        if (!this.actionRunner) {
            this.actionRunner = new ActionRunner(this.viewletState);
        }
        return this.actionRunner;
    };
    ExplorerViewlet.prototype.getViewletState = function () {
        return this.viewletState;
    };
    ExplorerViewlet.prototype.focus = function () {
        var explorerView = this.getExplorerView();
        if (explorerView && explorerView.isExpanded()) {
            explorerView.focus();
        }
        else {
            _super.prototype.focus.call(this);
        }
    };
    ExplorerViewlet.EXPLORER_VIEWS_STATE = 'workbench.explorer.views.state';
    ExplorerViewlet = __decorate([
        __param(0, IPartService),
        __param(1, ITelemetryService),
        __param(2, IWorkspaceContextService),
        __param(3, IStorageService),
        __param(4, IEditorService),
        __param(5, IEditorGroupsService),
        __param(6, IConfigurationService),
        __param(7, IInstantiationService),
        __param(8, IContextKeyService),
        __param(9, IThemeService),
        __param(10, IContextMenuService),
        __param(11, IExtensionService)
    ], ExplorerViewlet);
    return ExplorerViewlet;
}(ViewContainerViewlet));
export { ExplorerViewlet };
