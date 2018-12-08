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
import { IContextKeyService, ContextKeyDefinedExpr, ContextKeyExpr, ContextKeyAndExpr, ContextKeyEqualsExpr, RawContextKey } from '../../contextkey/common/contextkey.js';
import { HistoryInputBox } from '../../../base/browser/ui/inputbox/inputBox.js';
import { FindInput } from '../../../base/browser/ui/findinput/findInput.js';
import { getContextScopedWidget, createWidgetScopedContextKeyService, bindContextScopedWidget } from '../common/contextScopedWidget.js';
import { KeybindingsRegistry } from '../../keybinding/common/keybindingsRegistry.js';
export var HistoryNavigationWidgetContext = 'historyNavigationWidget';
export var HistoryNavigationEnablementContext = 'historyNavigationEnabled';
export function createAndBindHistoryNavigationWidgetScopedContextKeyService(contextKeyService, widget) {
    var scopedContextKeyService = createWidgetScopedContextKeyService(contextKeyService, widget);
    bindContextScopedWidget(scopedContextKeyService, widget, HistoryNavigationWidgetContext);
    var historyNavigationEnablement = new RawContextKey(HistoryNavigationEnablementContext, true).bindTo(scopedContextKeyService);
    return { scopedContextKeyService: scopedContextKeyService, historyNavigationEnablement: historyNavigationEnablement };
}
var ContextScopedHistoryInputBox = /** @class */ (function (_super) {
    __extends(ContextScopedHistoryInputBox, _super);
    function ContextScopedHistoryInputBox(container, contextViewProvider, options, contextKeyService) {
        var _this = _super.call(this, container, contextViewProvider, options) || this;
        _this._register(createAndBindHistoryNavigationWidgetScopedContextKeyService(contextKeyService, { target: _this.element, historyNavigator: _this }).scopedContextKeyService);
        return _this;
    }
    ContextScopedHistoryInputBox = __decorate([
        __param(3, IContextKeyService)
    ], ContextScopedHistoryInputBox);
    return ContextScopedHistoryInputBox;
}(HistoryInputBox));
export { ContextScopedHistoryInputBox };
var ContextScopedFindInput = /** @class */ (function (_super) {
    __extends(ContextScopedFindInput, _super);
    function ContextScopedFindInput(container, contextViewProvider, options, contextKeyService, showFindOptions) {
        if (showFindOptions === void 0) { showFindOptions = false; }
        var _this = _super.call(this, container, contextViewProvider, showFindOptions, options) || this;
        _this._register(createAndBindHistoryNavigationWidgetScopedContextKeyService(contextKeyService, { target: _this.inputBox.element, historyNavigator: _this.inputBox }).scopedContextKeyService);
        return _this;
    }
    ContextScopedFindInput = __decorate([
        __param(3, IContextKeyService)
    ], ContextScopedFindInput);
    return ContextScopedFindInput;
}(FindInput));
export { ContextScopedFindInput };
KeybindingsRegistry.registerCommandAndKeybindingRule({
    id: 'history.showPrevious',
    weight: 200 /* WorkbenchContrib */,
    when: ContextKeyExpr.and(new ContextKeyDefinedExpr(HistoryNavigationWidgetContext), new ContextKeyEqualsExpr(HistoryNavigationEnablementContext, true)),
    primary: 16 /* UpArrow */,
    secondary: [512 /* Alt */ | 16 /* UpArrow */],
    handler: function (accessor, arg2) {
        var historyInputBox = getContextScopedWidget(accessor.get(IContextKeyService), HistoryNavigationWidgetContext).historyNavigator;
        historyInputBox.showPreviousValue();
    }
});
KeybindingsRegistry.registerCommandAndKeybindingRule({
    id: 'history.showNext',
    weight: 200 /* WorkbenchContrib */,
    when: new ContextKeyAndExpr([new ContextKeyDefinedExpr(HistoryNavigationWidgetContext), new ContextKeyEqualsExpr(HistoryNavigationEnablementContext, true)]),
    primary: 18 /* DownArrow */,
    secondary: [512 /* Alt */ | 18 /* DownArrow */],
    handler: function (accessor, arg2) {
        var historyInputBox = getContextScopedWidget(accessor.get(IContextKeyService), HistoryNavigationWidgetContext).historyNavigator;
        historyInputBox.showNextValue();
    }
});
