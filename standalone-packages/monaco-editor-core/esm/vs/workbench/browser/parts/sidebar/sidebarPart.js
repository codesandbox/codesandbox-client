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
import './media/sidebarpart.css';
import { TPromise } from '../../../../base/common/winjs.base';
import * as nls from '../../../../nls';
import { Registry } from '../../../../platform/registry/common/platform';
import { Action } from '../../../../base/common/actions';
import { CompositePart } from '../compositePart';
import { Extensions as ViewletExtensions } from '../../viewlet';
import { Extensions as ActionExtensions } from '../../../common/actions';
import { SyncActionDescriptor } from '../../../../platform/actions/common/actions';
import { IViewletService } from '../../../services/viewlet/browser/viewlet';
import { IPartService } from '../../../services/part/common/partService';
import { IStorageService } from '../../../../platform/storage/common/storage';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation';
import { IThemeService } from '../../../../platform/theme/common/themeService';
import { contrastBorder } from '../../../../platform/theme/common/colorRegistry';
import { SIDE_BAR_TITLE_FOREGROUND, SIDE_BAR_BACKGROUND, SIDE_BAR_FOREGROUND, SIDE_BAR_BORDER } from '../../../common/theme';
import { INotificationService } from '../../../../platform/notification/common/notification';
import { EventType, addDisposableListener } from '../../../../base/browser/dom';
import { StandardMouseEvent } from '../../../../base/browser/mouseEvent';
var SidebarPart = /** @class */ (function (_super) {
    __extends(SidebarPart, _super);
    function SidebarPart(id, notificationService, storageService, telemetryService, contextMenuService, partService, keybindingService, instantiationService, themeService) {
        var _this = _super.call(this, notificationService, storageService, telemetryService, contextMenuService, partService, keybindingService, instantiationService, themeService, Registry.as(ViewletExtensions.Viewlets), SidebarPart.activeViewletSettingsKey, Registry.as(ViewletExtensions.Viewlets).getDefaultViewletId(), 'sideBar', 'viewlet', SIDE_BAR_TITLE_FOREGROUND, id, { hasTitle: true, borderWidth: function () { return (_this.getColor(SIDE_BAR_BORDER) || _this.getColor(contrastBorder)) ? 1 : 0; } }) || this;
        return _this;
    }
    Object.defineProperty(SidebarPart.prototype, "onDidViewletOpen", {
        get: function () {
            return this._onDidCompositeOpen.event;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SidebarPart.prototype, "onDidViewletClose", {
        get: function () {
            return this._onDidCompositeClose.event;
        },
        enumerable: true,
        configurable: true
    });
    SidebarPart.prototype.createTitleArea = function (parent) {
        var _this = this;
        var titleArea = _super.prototype.createTitleArea.call(this, parent);
        this._register(addDisposableListener(titleArea, EventType.CONTEXT_MENU, function (e) {
            _this.onTitleAreaContextMenu(new StandardMouseEvent(e));
        }));
        return titleArea;
    };
    SidebarPart.prototype.updateStyles = function () {
        _super.prototype.updateStyles.call(this);
        // Part container
        var container = this.getContainer();
        container.style.backgroundColor = this.getColor(SIDE_BAR_BACKGROUND);
        container.style.color = this.getColor(SIDE_BAR_FOREGROUND);
        var borderColor = this.getColor(SIDE_BAR_BORDER) || this.getColor(contrastBorder);
        var isPositionLeft = this.partService.getSideBarPosition() === 0 /* LEFT */;
        container.style.borderRightWidth = borderColor && isPositionLeft ? '1px' : null;
        container.style.borderRightStyle = borderColor && isPositionLeft ? 'solid' : null;
        container.style.borderRightColor = isPositionLeft ? borderColor : null;
        container.style.borderLeftWidth = borderColor && !isPositionLeft ? '1px' : null;
        container.style.borderLeftStyle = borderColor && !isPositionLeft ? 'solid' : null;
        container.style.borderLeftColor = !isPositionLeft ? borderColor : null;
    };
    SidebarPart.prototype.openViewlet = function (id, focus) {
        var _this = this;
        if (this.blockOpeningViewlet) {
            return Promise.resolve(null); // Workaround against a potential race condition
        }
        // First check if sidebar is hidden and show if so
        var promise = TPromise.wrap(null);
        if (!this.partService.isVisible(1 /* SIDEBAR_PART */)) {
            try {
                this.blockOpeningViewlet = true;
                promise = this.partService.setSideBarHidden(false);
            }
            finally {
                this.blockOpeningViewlet = false;
            }
        }
        return promise.then(function () { return _this.openComposite(id, focus); });
    };
    SidebarPart.prototype.getActiveViewlet = function () {
        return this.getActiveComposite();
    };
    SidebarPart.prototype.getLastActiveViewletId = function () {
        return this.getLastActiveCompositetId();
    };
    SidebarPart.prototype.hideActiveViewlet = function () {
        return this.hideActiveComposite().then(function (composite) { return void 0; });
    };
    SidebarPart.prototype.layout = function (dimension) {
        if (!this.partService.isVisible(1 /* SIDEBAR_PART */)) {
            return [dimension];
        }
        return _super.prototype.layout.call(this, dimension);
    };
    SidebarPart.prototype.onTitleAreaContextMenu = function (event) {
        var _this = this;
        var activeViewlet = this.getActiveViewlet();
        if (activeViewlet) {
            var contextMenuActions_1 = activeViewlet ? activeViewlet.getContextMenuActions() : [];
            if (contextMenuActions_1.length) {
                var anchor_1 = { x: event.posx, y: event.posy };
                this.contextMenuService.showContextMenu({
                    getAnchor: function () { return anchor_1; },
                    getActions: function () { return Promise.resolve(contextMenuActions_1); },
                    getActionItem: function (action) { return _this.actionItemProvider(action); },
                    actionRunner: activeViewlet.getActionRunner()
                });
            }
        }
    };
    SidebarPart.activeViewletSettingsKey = 'workbench.sidebar.activeviewletid';
    SidebarPart = __decorate([
        __param(1, INotificationService),
        __param(2, IStorageService),
        __param(3, ITelemetryService),
        __param(4, IContextMenuService),
        __param(5, IPartService),
        __param(6, IKeybindingService),
        __param(7, IInstantiationService),
        __param(8, IThemeService)
    ], SidebarPart);
    return SidebarPart;
}(CompositePart));
export { SidebarPart };
var FocusSideBarAction = /** @class */ (function (_super) {
    __extends(FocusSideBarAction, _super);
    function FocusSideBarAction(id, label, viewletService, partService) {
        var _this = _super.call(this, id, label) || this;
        _this.viewletService = viewletService;
        _this.partService = partService;
        return _this;
    }
    FocusSideBarAction.prototype.run = function () {
        // Show side bar
        if (!this.partService.isVisible(1 /* SIDEBAR_PART */)) {
            return this.partService.setSideBarHidden(false);
        }
        // Focus into active viewlet
        var viewlet = this.viewletService.getActiveViewlet();
        if (viewlet) {
            viewlet.focus();
        }
        return Promise.resolve(true);
    };
    FocusSideBarAction.ID = 'workbench.action.focusSideBar';
    FocusSideBarAction.LABEL = nls.localize('focusSideBar', "Focus into Side Bar");
    FocusSideBarAction = __decorate([
        __param(2, IViewletService),
        __param(3, IPartService)
    ], FocusSideBarAction);
    return FocusSideBarAction;
}(Action));
var registry = Registry.as(ActionExtensions.WorkbenchActions);
registry.registerWorkbenchAction(new SyncActionDescriptor(FocusSideBarAction, FocusSideBarAction.ID, FocusSideBarAction.LABEL, {
    primary: 2048 /* CtrlCmd */ | 21 /* KEY_0 */
}), 'View: Focus into Side Bar', nls.localize('viewCategory', "View"));
