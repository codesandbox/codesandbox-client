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
import * as nls from '../../../nls';
import { Action } from '../../../base/common/actions';
import { KeyChord } from '../../../base/common/keyCodes';
import { Registry } from '../../../platform/registry/common/platform';
import { SyncActionDescriptor, MenuRegistry, MenuId } from '../../../platform/actions/common/actions';
import { Extensions } from '../../common/actions';
import { IPartService } from '../../services/part/common/partService';
var ToggleZenMode = /** @class */ (function (_super) {
    __extends(ToggleZenMode, _super);
    function ToggleZenMode(id, label, partService) {
        var _this = _super.call(this, id, label) || this;
        _this.partService = partService;
        _this.enabled = !!_this.partService;
        return _this;
    }
    ToggleZenMode.prototype.run = function () {
        this.partService.toggleZenMode();
        return Promise.resolve(null);
    };
    ToggleZenMode.ID = 'workbench.action.toggleZenMode';
    ToggleZenMode.LABEL = nls.localize('toggleZenMode', "Toggle Zen Mode");
    ToggleZenMode = __decorate([
        __param(2, IPartService)
    ], ToggleZenMode);
    return ToggleZenMode;
}(Action));
var registry = Registry.as(Extensions.WorkbenchActions);
registry.registerWorkbenchAction(new SyncActionDescriptor(ToggleZenMode, ToggleZenMode.ID, ToggleZenMode.LABEL, { primary: KeyChord(2048 /* CtrlCmd */ | 41 /* KEY_K */, 56 /* KEY_Z */) }), 'View: Toggle Zen Mode', nls.localize('view', "View"));
MenuRegistry.appendMenuItem(MenuId.MenubarAppearanceMenu, {
    group: '1_toggle_view',
    command: {
        id: ToggleZenMode.ID,
        title: nls.localize('miToggleZenMode', "Toggle Zen Mode")
    },
    order: 2
});
