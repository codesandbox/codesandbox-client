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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import * as nls from '../../../nls.js';
import { Registry } from '../../../platform/registry/common/platform.js';
import { Action } from '../../../base/common/actions.js';
import { SyncActionDescriptor, MenuRegistry, MenuId } from '../../../platform/actions/common/actions.js';
import { Extensions } from '../../common/actions.js';
import { IPartService } from '../../services/part/common/partService.js';
import { IConfigurationService } from '../../../platform/configuration/common/configuration.js';
var ToggleSidebarPositionAction = /** @class */ (function (_super) {
    __extends(ToggleSidebarPositionAction, _super);
    function ToggleSidebarPositionAction(id, label, partService, configurationService) {
        var _this = _super.call(this, id, label) || this;
        _this.partService = partService;
        _this.configurationService = configurationService;
        _this.enabled = !!_this.partService && !!_this.configurationService;
        return _this;
    }
    ToggleSidebarPositionAction.prototype.run = function () {
        var position = this.partService.getSideBarPosition();
        var newPositionValue = (position === 0 /* LEFT */) ? 'right' : 'left';
        return this.configurationService.updateValue(ToggleSidebarPositionAction.sidebarPositionConfigurationKey, newPositionValue, 1 /* USER */);
    };
    ToggleSidebarPositionAction.getLabel = function (partService) {
        return partService.getSideBarPosition() === 0 /* LEFT */ ? nls.localize('moveSidebarRight', "Move Side Bar Right") : nls.localize('moveSidebarLeft', "Move Side Bar Left");
    };
    ToggleSidebarPositionAction.ID = 'workbench.action.toggleSidebarPosition';
    ToggleSidebarPositionAction.LABEL = nls.localize('toggleSidebarPosition', "Toggle Side Bar Position");
    ToggleSidebarPositionAction.sidebarPositionConfigurationKey = 'workbench.sideBar.location';
    ToggleSidebarPositionAction = __decorate([
        __param(2, IPartService),
        __param(3, IConfigurationService)
    ], ToggleSidebarPositionAction);
    return ToggleSidebarPositionAction;
}(Action));
export { ToggleSidebarPositionAction };
var registry = Registry.as(Extensions.WorkbenchActions);
registry.registerWorkbenchAction(new SyncActionDescriptor(ToggleSidebarPositionAction, ToggleSidebarPositionAction.ID, ToggleSidebarPositionAction.LABEL), 'View: Toggle Side Bar Position', nls.localize('view', "View"));
MenuRegistry.appendMenuItem(MenuId.MenubarAppearanceMenu, {
    group: '2_workbench_layout',
    command: {
        id: ToggleSidebarPositionAction.ID,
        title: nls.localize({ key: 'miMoveSidebarLeftRight', comment: ['&& denotes a mnemonic'] }, "&&Move Side Bar Left/Right")
    },
    order: 2
});
