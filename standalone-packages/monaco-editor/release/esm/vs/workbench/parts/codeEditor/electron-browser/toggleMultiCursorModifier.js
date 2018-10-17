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
import * as nls from '../../../../nls.js';
import * as platform from '../../../../base/common/platform.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { Action } from '../../../../base/common/actions.js';
import { SyncActionDescriptor, MenuRegistry, MenuId } from '../../../../platform/actions/common/actions.js';
import { Extensions } from '../../../common/actions.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { Extensions as WorkbenchExtensions } from '../../../common/contributions.js';
import { RawContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
var ToggleMultiCursorModifierAction = /** @class */ (function (_super) {
    __extends(ToggleMultiCursorModifierAction, _super);
    function ToggleMultiCursorModifierAction(id, label, configurationService) {
        var _this = _super.call(this, id, label) || this;
        _this.configurationService = configurationService;
        return _this;
    }
    ToggleMultiCursorModifierAction.prototype.run = function () {
        var editorConf = this.configurationService.getValue('editor');
        var newValue = (editorConf.multiCursorModifier === 'ctrlCmd' ? 'alt' : 'ctrlCmd');
        return this.configurationService.updateValue(ToggleMultiCursorModifierAction.multiCursorModifierConfigurationKey, newValue, 1 /* USER */);
    };
    ToggleMultiCursorModifierAction.ID = 'workbench.action.toggleMultiCursorModifier';
    ToggleMultiCursorModifierAction.LABEL = nls.localize('toggleLocation', "Toggle Multi-Cursor Modifier");
    ToggleMultiCursorModifierAction.multiCursorModifierConfigurationKey = 'editor.multiCursorModifier';
    ToggleMultiCursorModifierAction = __decorate([
        __param(2, IConfigurationService)
    ], ToggleMultiCursorModifierAction);
    return ToggleMultiCursorModifierAction;
}(Action));
export { ToggleMultiCursorModifierAction };
var multiCursorModifier = new RawContextKey('multiCursorModifier', 'altKey');
var MultiCursorModifierContextKeyController = /** @class */ (function () {
    function MultiCursorModifierContextKeyController(configurationService, contextKeyService) {
        var _this = this;
        this.configurationService = configurationService;
        this._multiCursorModifier = multiCursorModifier.bindTo(contextKeyService);
        configurationService.onDidChangeConfiguration(function (e) {
            if (e.affectsConfiguration('editor.multiCursorModifier')) {
                _this._update();
            }
        });
    }
    MultiCursorModifierContextKeyController.prototype._update = function () {
        var editorConf = this.configurationService.getValue('editor');
        var value = (editorConf.multiCursorModifier === 'ctrlCmd' ? 'ctrlCmd' : 'altKey');
        this._multiCursorModifier.set(value);
    };
    MultiCursorModifierContextKeyController = __decorate([
        __param(0, IConfigurationService),
        __param(1, IContextKeyService)
    ], MultiCursorModifierContextKeyController);
    return MultiCursorModifierContextKeyController;
}());
Registry.as(WorkbenchExtensions.Workbench).registerWorkbenchContribution(MultiCursorModifierContextKeyController, 3 /* Running */);
var registry = Registry.as(Extensions.WorkbenchActions);
registry.registerWorkbenchAction(new SyncActionDescriptor(ToggleMultiCursorModifierAction, ToggleMultiCursorModifierAction.ID, ToggleMultiCursorModifierAction.LABEL), 'Toggle Multi-Cursor Modifier');
MenuRegistry.appendMenuItem(MenuId.MenubarSelectionMenu, {
    group: '3_multi',
    command: {
        id: ToggleMultiCursorModifierAction.ID,
        title: nls.localize('miMultiCursorAlt', "Switch to Alt+Click for Multi-Cursor")
    },
    when: multiCursorModifier.isEqualTo('ctrlCmd'),
    order: 1
});
MenuRegistry.appendMenuItem(MenuId.MenubarSelectionMenu, {
    group: '3_multi',
    command: {
        id: ToggleMultiCursorModifierAction.ID,
        title: (platform.isMacintosh
            ? nls.localize('miMultiCursorCmd', "Switch to Cmd+Click for Multi-Cursor")
            : nls.localize('miMultiCursorCtrl', "Switch to Ctrl+Click for Multi-Cursor"))
    },
    when: multiCursorModifier.isEqualTo('altKey'),
    order: 1
});
