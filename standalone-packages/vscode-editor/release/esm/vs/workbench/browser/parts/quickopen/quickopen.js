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
import { Action } from '../../../../base/common/actions.js';
import { IQuickOpenService } from '../../../../platform/quickOpen/common/quickOpen.js';
import { IQuickInputService } from '../../../../platform/quickinput/common/quickInput.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { CommandsRegistry } from '../../../../platform/commands/common/commands.js';
export var inQuickOpenContext = ContextKeyExpr.has('inQuickOpen');
export var defaultQuickOpenContextKey = 'inFilesPicker';
export var defaultQuickOpenContext = ContextKeyExpr.and(inQuickOpenContext, ContextKeyExpr.has(defaultQuickOpenContextKey));
export var QUICKOPEN_ACTION_ID = 'workbench.action.quickOpen';
export var QUICKOPEN_ACION_LABEL = nls.localize('quickOpen', "Go to File...");
CommandsRegistry.registerCommand(QUICKOPEN_ACTION_ID, function (accessor, prefix) {
    if (prefix === void 0) { prefix = null; }
    var quickOpenService = accessor.get(IQuickOpenService);
    return quickOpenService.show(typeof prefix === 'string' ? prefix : null).then(function () {
        return void 0;
    });
});
export var QUICKOPEN_FOCUS_SECONDARY_ACTION_ID = 'workbench.action.quickOpenPreviousEditor';
CommandsRegistry.registerCommand(QUICKOPEN_FOCUS_SECONDARY_ACTION_ID, function (accessor, prefix) {
    if (prefix === void 0) { prefix = null; }
    var quickOpenService = accessor.get(IQuickOpenService);
    return quickOpenService.show(null, { autoFocus: { autoFocusSecondEntry: true } }).then(function () {
        return void 0;
    });
});
var BaseQuickOpenNavigateAction = /** @class */ (function (_super) {
    __extends(BaseQuickOpenNavigateAction, _super);
    function BaseQuickOpenNavigateAction(id, label, next, quickNavigate, quickOpenService, quickInputService, keybindingService) {
        var _this = _super.call(this, id, label) || this;
        _this.next = next;
        _this.quickNavigate = quickNavigate;
        _this.quickOpenService = quickOpenService;
        _this.quickInputService = quickInputService;
        _this.keybindingService = keybindingService;
        return _this;
    }
    BaseQuickOpenNavigateAction.prototype.run = function (event) {
        var keys = this.keybindingService.lookupKeybindings(this.id);
        var quickNavigate = this.quickNavigate ? { keybindings: keys } : void 0;
        this.quickOpenService.navigate(this.next, quickNavigate);
        this.quickInputService.navigate(this.next, quickNavigate);
        return Promise.resolve(true);
    };
    BaseQuickOpenNavigateAction = __decorate([
        __param(4, IQuickOpenService),
        __param(5, IQuickInputService),
        __param(6, IKeybindingService)
    ], BaseQuickOpenNavigateAction);
    return BaseQuickOpenNavigateAction;
}(Action));
export { BaseQuickOpenNavigateAction };
export function getQuickNavigateHandler(id, next) {
    return function (accessor) {
        var keybindingService = accessor.get(IKeybindingService);
        var quickOpenService = accessor.get(IQuickOpenService);
        var quickInputService = accessor.get(IQuickInputService);
        var keys = keybindingService.lookupKeybindings(id);
        var quickNavigate = { keybindings: keys };
        quickOpenService.navigate(next, quickNavigate);
        quickInputService.navigate(next, quickNavigate);
    };
}
var QuickOpenNavigateNextAction = /** @class */ (function (_super) {
    __extends(QuickOpenNavigateNextAction, _super);
    function QuickOpenNavigateNextAction(id, label, quickOpenService, quickInputService, keybindingService) {
        return _super.call(this, id, label, true, true, quickOpenService, quickInputService, keybindingService) || this;
    }
    QuickOpenNavigateNextAction.ID = 'workbench.action.quickOpenNavigateNext';
    QuickOpenNavigateNextAction.LABEL = nls.localize('quickNavigateNext', "Navigate Next in Quick Open");
    QuickOpenNavigateNextAction = __decorate([
        __param(2, IQuickOpenService),
        __param(3, IQuickInputService),
        __param(4, IKeybindingService)
    ], QuickOpenNavigateNextAction);
    return QuickOpenNavigateNextAction;
}(BaseQuickOpenNavigateAction));
export { QuickOpenNavigateNextAction };
var QuickOpenNavigatePreviousAction = /** @class */ (function (_super) {
    __extends(QuickOpenNavigatePreviousAction, _super);
    function QuickOpenNavigatePreviousAction(id, label, quickOpenService, quickInputService, keybindingService) {
        return _super.call(this, id, label, false, true, quickOpenService, quickInputService, keybindingService) || this;
    }
    QuickOpenNavigatePreviousAction.ID = 'workbench.action.quickOpenNavigatePrevious';
    QuickOpenNavigatePreviousAction.LABEL = nls.localize('quickNavigatePrevious', "Navigate Previous in Quick Open");
    QuickOpenNavigatePreviousAction = __decorate([
        __param(2, IQuickOpenService),
        __param(3, IQuickInputService),
        __param(4, IKeybindingService)
    ], QuickOpenNavigatePreviousAction);
    return QuickOpenNavigatePreviousAction;
}(BaseQuickOpenNavigateAction));
export { QuickOpenNavigatePreviousAction };
var QuickOpenSelectNextAction = /** @class */ (function (_super) {
    __extends(QuickOpenSelectNextAction, _super);
    function QuickOpenSelectNextAction(id, label, quickOpenService, quickInputService, keybindingService) {
        return _super.call(this, id, label, true, false, quickOpenService, quickInputService, keybindingService) || this;
    }
    QuickOpenSelectNextAction.ID = 'workbench.action.quickOpenSelectNext';
    QuickOpenSelectNextAction.LABEL = nls.localize('quickSelectNext', "Select Next in Quick Open");
    QuickOpenSelectNextAction = __decorate([
        __param(2, IQuickOpenService),
        __param(3, IQuickInputService),
        __param(4, IKeybindingService)
    ], QuickOpenSelectNextAction);
    return QuickOpenSelectNextAction;
}(BaseQuickOpenNavigateAction));
export { QuickOpenSelectNextAction };
var QuickOpenSelectPreviousAction = /** @class */ (function (_super) {
    __extends(QuickOpenSelectPreviousAction, _super);
    function QuickOpenSelectPreviousAction(id, label, quickOpenService, quickInputService, keybindingService) {
        return _super.call(this, id, label, false, false, quickOpenService, quickInputService, keybindingService) || this;
    }
    QuickOpenSelectPreviousAction.ID = 'workbench.action.quickOpenSelectPrevious';
    QuickOpenSelectPreviousAction.LABEL = nls.localize('quickSelectPrevious', "Select Previous in Quick Open");
    QuickOpenSelectPreviousAction = __decorate([
        __param(2, IQuickOpenService),
        __param(3, IQuickInputService),
        __param(4, IKeybindingService)
    ], QuickOpenSelectPreviousAction);
    return QuickOpenSelectPreviousAction;
}(BaseQuickOpenNavigateAction));
export { QuickOpenSelectPreviousAction };
