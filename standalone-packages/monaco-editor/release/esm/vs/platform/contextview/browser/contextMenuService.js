/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { ContextMenuHandler } from './contextMenuHandler.js';
import { Emitter } from '../../../base/common/event.js';
var ContextMenuService = /** @class */ (function () {
    function ContextMenuService(container, telemetryService, notificationService, contextViewService) {
        this._onDidContextMenu = new Emitter();
        this.contextMenuHandler = new ContextMenuHandler(container, contextViewService, telemetryService, notificationService);
    }
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
    Object.defineProperty(ContextMenuService.prototype, "onDidContextMenu", {
        get: function () {
            return this._onDidContextMenu.event;
        },
        enumerable: true,
        configurable: true
    });
    return ContextMenuService;
}());
export { ContextMenuService };
