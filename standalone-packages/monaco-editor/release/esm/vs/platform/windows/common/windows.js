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
import { TPromise } from '../../../base/common/winjs.base.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { latch, anyEvent } from '../../../base/common/event.js';
import { dispose } from '../../../base/common/lifecycle.js';
export var IWindowsService = createDecorator('windowsService');
export var IWindowService = createDecorator('windowService');
var ActiveWindowManager = /** @class */ (function () {
    function ActiveWindowManager(windowsService) {
        var _this = this;
        this.disposables = [];
        var onActiveWindowChange = latch(anyEvent(windowsService.onWindowOpen, windowsService.onWindowFocus));
        onActiveWindowChange(this.setActiveWindow, this, this.disposables);
        this.firstActiveWindowIdPromise = windowsService.getActiveWindowId()
            .then(function (id) { return (typeof _this._activeWindowId === 'undefined') && _this.setActiveWindow(id); });
    }
    ActiveWindowManager.prototype.setActiveWindow = function (windowId) {
        if (this.firstActiveWindowIdPromise) {
            this.firstActiveWindowIdPromise = null;
        }
        this._activeWindowId = windowId;
    };
    ActiveWindowManager.prototype.getActiveClientId = function () {
        if (this.firstActiveWindowIdPromise) {
            return this.firstActiveWindowIdPromise;
        }
        return TPromise.as("window:" + this._activeWindowId);
    };
    ActiveWindowManager.prototype.dispose = function () {
        this.disposables = dispose(this.disposables);
    };
    ActiveWindowManager = __decorate([
        __param(0, IWindowsService)
    ], ActiveWindowManager);
    return ActiveWindowManager;
}());
export { ActiveWindowManager };
