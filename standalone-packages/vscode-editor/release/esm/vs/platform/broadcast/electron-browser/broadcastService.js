/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { Emitter } from '../../../base/common/event.js';
import { ipcRenderer as ipc } from '../../../../electron.js';
import { ILogService } from '../../log/common/log.js';
export var IBroadcastService = createDecorator('broadcastService');
var BroadcastService = /** @class */ (function () {
    function BroadcastService(windowId, logService) {
        this.windowId = windowId;
        this.logService = logService;
        this._onBroadcast = new Emitter();
        this.registerListeners();
    }
    BroadcastService.prototype.registerListeners = function () {
        var _this = this;
        ipc.on('vscode:broadcast', function (event, b) {
            _this.logService.trace("Received broadcast from main in window " + _this.windowId + ": ", b);
            _this._onBroadcast.fire(b);
        });
    };
    Object.defineProperty(BroadcastService.prototype, "onBroadcast", {
        get: function () {
            return this._onBroadcast.event;
        },
        enumerable: true,
        configurable: true
    });
    BroadcastService.prototype.broadcast = function (b) {
        this.logService.trace("Sending broadcast to main from window " + this.windowId + ": ", b);
        ipc.send('vscode:broadcast', this.windowId, {
            channel: b.channel,
            payload: b.payload
        });
    };
    BroadcastService = __decorate([
        __param(1, ILogService)
    ], BroadcastService);
    return BroadcastService;
}());
export { BroadcastService };
