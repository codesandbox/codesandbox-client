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
import * as nls from '../../../../../nls.js';
import * as errors from '../../../../../base/common/errors.js';
import * as env from '../../../../../base/common/platform.js';
import * as DOM from '../../../../../base/browser/dom.js';
import { Button } from '../../../../../base/browser/ui/button/button.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { OpenFolderAction, OpenFileFolderAction, AddRootFolderAction } from '../../../../browser/actions/workspaceActions.js';
import { attachButtonStyler } from '../../../../../platform/theme/common/styler.js';
import { IThemeService } from '../../../../../platform/theme/common/themeService.js';
import { IKeybindingService } from '../../../../../platform/keybinding/common/keybinding.js';
import { IContextMenuService } from '../../../../../platform/contextview/browser/contextView.js';
import { IWorkspaceContextService } from '../../../../../platform/workspace/common/workspace.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { ViewletPanel } from '../../../../browser/parts/views/panelViewlet.js';
import { ResourcesDropHandler, DragAndDropObserver } from '../../../../browser/dnd.js';
import { listDropBackground } from '../../../../../platform/theme/common/colorRegistry.js';
import { SIDE_BAR_BACKGROUND } from '../../../../common/theme.js';
var EmptyView = /** @class */ (function (_super) {
    __extends(EmptyView, _super);
    function EmptyView(options, themeService, instantiationService, keybindingService, contextMenuService, contextService, configurationService) {
        var _this = _super.call(this, __assign({}, options, { ariaHeaderLabel: nls.localize('explorerSection', "Files Explorer Section") }), keybindingService, contextMenuService, configurationService) || this;
        _this.themeService = themeService;
        _this.instantiationService = instantiationService;
        _this.contextService = contextService;
        _this.contextService.onDidChangeWorkbenchState(function () { return _this.setLabels(); });
        return _this;
    }
    EmptyView.prototype.renderHeader = function (container) {
        var titleContainer = document.createElement('div');
        DOM.addClass(titleContainer, 'title');
        container.appendChild(titleContainer);
        this.titleElement = document.createElement('span');
        this.titleElement.textContent = name;
        titleContainer.appendChild(this.titleElement);
    };
    EmptyView.prototype.renderBody = function (container) {
        var _this = this;
        DOM.addClass(container, 'explorer-empty-view');
        var messageContainer = document.createElement('div');
        DOM.addClass(messageContainer, 'section');
        container.appendChild(messageContainer);
        this.messageElement = document.createElement('p');
        messageContainer.appendChild(this.messageElement);
        this.button = new Button(messageContainer);
        attachButtonStyler(this.button, this.themeService);
        this.disposables.push(this.button.onDidClick(function () {
            var actionClass = _this.contextService.getWorkbenchState() === 3 /* WORKSPACE */ ? AddRootFolderAction : env.isMacintosh ? OpenFileFolderAction : OpenFolderAction;
            var action = _this.instantiationService.createInstance(actionClass, actionClass.ID, actionClass.LABEL);
            _this.actionRunner.run(action).then(function () {
                action.dispose();
            }, function (err) {
                action.dispose();
                errors.onUnexpectedError(err);
            });
        }));
        this.disposables.push(new DragAndDropObserver(container, {
            onDrop: function (e) {
                container.style.backgroundColor = _this.themeService.getTheme().getColor(SIDE_BAR_BACKGROUND).toString();
                var dropHandler = _this.instantiationService.createInstance(ResourcesDropHandler, { allowWorkspaceOpen: true });
                dropHandler.handleDrop(e, function () { return undefined; }, function (targetGroup) { return undefined; });
            },
            onDragEnter: function (e) {
                container.style.backgroundColor = _this.themeService.getTheme().getColor(listDropBackground).toString();
            },
            onDragEnd: function () {
                container.style.backgroundColor = _this.themeService.getTheme().getColor(SIDE_BAR_BACKGROUND).toString();
            },
            onDragLeave: function () {
                container.style.backgroundColor = _this.themeService.getTheme().getColor(SIDE_BAR_BACKGROUND).toString();
            },
            onDragOver: function (e) {
                e.dataTransfer.dropEffect = 'copy';
            }
        }));
        this.setLabels();
    };
    EmptyView.prototype.setLabels = function () {
        if (this.contextService.getWorkbenchState() === 3 /* WORKSPACE */) {
            this.messageElement.textContent = nls.localize('noWorkspaceHelp', "You have not yet added a folder to the workspace.");
            if (this.button) {
                this.button.label = nls.localize('addFolder', "Add Folder");
            }
            this.titleElement.textContent = EmptyView.NAME;
        }
        else {
            this.messageElement.textContent = nls.localize('noFolderHelp', "You have not yet opened a folder.");
            if (this.button) {
                this.button.label = nls.localize('openFolder', "Open Folder");
            }
            this.titleElement.textContent = this.title;
        }
    };
    EmptyView.prototype.layoutBody = function (size) {
        // no-op
    };
    EmptyView.prototype.setVisible = function (visible) {
        return Promise.resolve(null);
    };
    EmptyView.prototype.focusBody = function () {
        if (this.button) {
            this.button.element.focus();
        }
    };
    EmptyView.prototype.reveal = function (element, relativeTop) {
        return Promise.resolve(null);
    };
    EmptyView.prototype.getActions = function () {
        return [];
    };
    EmptyView.prototype.getSecondaryActions = function () {
        return [];
    };
    EmptyView.prototype.getActionItem = function (action) {
        return null;
    };
    EmptyView.prototype.shutdown = function () {
        // Subclass to implement
    };
    EmptyView.ID = 'workbench.explorer.emptyView';
    EmptyView.NAME = nls.localize('noWorkspace', "No Folder Opened");
    EmptyView = __decorate([
        __param(1, IThemeService),
        __param(2, IInstantiationService),
        __param(3, IKeybindingService),
        __param(4, IContextMenuService),
        __param(5, IWorkspaceContextService),
        __param(6, IConfigurationService)
    ], EmptyView);
    return EmptyView;
}(ViewletPanel));
export { EmptyView };
