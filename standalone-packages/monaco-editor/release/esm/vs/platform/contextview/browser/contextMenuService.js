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
import { ContextMenuHandler } from './contextMenuHandler.js';
import { IContextViewService } from './contextView.js';
import { ITelemetryService } from '../../telemetry/common/telemetry.js';
import { Emitter } from '../../../base/common/event.js';
import { INotificationService } from '../../notification/common/notification.js';
import { IThemeService } from '../../theme/common/themeService.js';
import { IKeybindingService } from '../../keybinding/common/keybinding.js';
import { Disposable } from '../../../base/common/lifecycle.js';
var ContextMenuService = /** @class */ (function (_super) {
    __extends(ContextMenuService, _super);
    function ContextMenuService(container, telemetryService, notificationService, contextViewService, keybindingService, themeService) {
        var _this = _super.call(this) || this;
        _this._onDidContextMenu = _this._register(new Emitter());
        _this.contextMenuHandler = _this._register(new ContextMenuHandler(container, contextViewService, telemetryService, notificationService, keybindingService, themeService));
        return _this;
    }
    Object.defineProperty(ContextMenuService.prototype, "onDidContextMenu", {
        get: function () { return this._onDidContextMenu.event; },
        enumerable: true,
        configurable: true
    });
    ContextMenuService.prototype.dispose = function () {
        this.contextMenuHandler.dispose();
    };
    ContextMenuService.prototype.setContainer = function (container) {
        this.contextMenuHandler.setContainer(container);
    };
    // ContextMenu
    ContextMenuService.prototype.showContextMenu = function (delegate) {
        this.contextMenuHandler.showContextMenu(delegate);
        this._onDidContextMenu.fire();
    };
    ContextMenuService = __decorate([
        __param(1, ITelemetryService),
        __param(2, INotificationService),
        __param(3, IContextViewService),
        __param(4, IKeybindingService),
        __param(5, IThemeService)
    ], ContextMenuService);
    return ContextMenuService;
}(Disposable));
export { ContextMenuService };
