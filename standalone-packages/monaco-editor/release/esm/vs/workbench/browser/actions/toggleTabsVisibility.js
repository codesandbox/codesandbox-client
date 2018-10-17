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
import { SyncActionDescriptor } from '../../../platform/actions/common/actions.js';
import { Extensions } from '../../common/actions.js';
import { IConfigurationService } from '../../../platform/configuration/common/configuration.js';
var ToggleTabsVisibilityAction = /** @class */ (function (_super) {
    __extends(ToggleTabsVisibilityAction, _super);
    function ToggleTabsVisibilityAction(id, label, configurationService) {
        var _this = _super.call(this, id, label) || this;
        _this.configurationService = configurationService;
        return _this;
    }
    ToggleTabsVisibilityAction.prototype.run = function () {
        var visibility = this.configurationService.getValue(ToggleTabsVisibilityAction.tabsVisibleKey);
        var newVisibilityValue = !visibility;
        return this.configurationService.updateValue(ToggleTabsVisibilityAction.tabsVisibleKey, newVisibilityValue);
    };
    ToggleTabsVisibilityAction.ID = 'workbench.action.toggleTabsVisibility';
    ToggleTabsVisibilityAction.LABEL = nls.localize('toggleTabs', "Toggle Tab Visibility");
    ToggleTabsVisibilityAction.tabsVisibleKey = 'workbench.editor.showTabs';
    ToggleTabsVisibilityAction = __decorate([
        __param(2, IConfigurationService)
    ], ToggleTabsVisibilityAction);
    return ToggleTabsVisibilityAction;
}(Action));
export { ToggleTabsVisibilityAction };
var registry = Registry.as(Extensions.WorkbenchActions);
registry.registerWorkbenchAction(new SyncActionDescriptor(ToggleTabsVisibilityAction, ToggleTabsVisibilityAction.ID, ToggleTabsVisibilityAction.LABEL, { primary: 2048 /* CtrlCmd */ | 256 /* WinCtrl */ | 53 /* KEY_W */ }), 'View: Toggle Tab Visibility', nls.localize('view', "View"));
