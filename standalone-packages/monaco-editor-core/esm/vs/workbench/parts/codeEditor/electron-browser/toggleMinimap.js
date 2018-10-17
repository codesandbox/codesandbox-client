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
import * as nls from '../../../../nls';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration';
import { Registry } from '../../../../platform/registry/common/platform';
import { Extensions as ActionExtensions } from '../../../common/actions';
import { Action } from '../../../../base/common/actions';
import { SyncActionDescriptor, MenuRegistry, MenuId } from '../../../../platform/actions/common/actions';
var ToggleMinimapAction = /** @class */ (function (_super) {
    __extends(ToggleMinimapAction, _super);
    function ToggleMinimapAction(id, label, _configurationService) {
        var _this = _super.call(this, id, label) || this;
        _this._configurationService = _configurationService;
        return _this;
    }
    ToggleMinimapAction.prototype.run = function () {
        var newValue = !this._configurationService.getValue('editor.minimap.enabled');
        return this._configurationService.updateValue('editor.minimap.enabled', newValue, 1 /* USER */);
    };
    ToggleMinimapAction.ID = 'editor.action.toggleMinimap';
    ToggleMinimapAction.LABEL = nls.localize('toggleMinimap', "View: Toggle Minimap");
    ToggleMinimapAction = __decorate([
        __param(2, IConfigurationService)
    ], ToggleMinimapAction);
    return ToggleMinimapAction;
}(Action));
export { ToggleMinimapAction };
var registry = Registry.as(ActionExtensions.WorkbenchActions);
registry.registerWorkbenchAction(new SyncActionDescriptor(ToggleMinimapAction, ToggleMinimapAction.ID, ToggleMinimapAction.LABEL), 'View: Toggle Minimap');
MenuRegistry.appendMenuItem(MenuId.MenubarViewMenu, {
    group: '5_editor',
    command: {
        id: ToggleMinimapAction.ID,
        title: nls.localize({ key: 'miToggleMinimap', comment: ['&& denotes a mnemonic'] }, "Toggle &&Minimap")
    },
    order: 2
});
