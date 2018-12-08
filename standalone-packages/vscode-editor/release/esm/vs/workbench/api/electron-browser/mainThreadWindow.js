/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { IWindowService } from '../../../platform/windows/common/windows.js';
import { ExtHostContext, MainContext } from '../node/extHost.protocol.js';
import { dispose } from '../../../base/common/lifecycle.js';
import { extHostNamedCustomer } from './extHostCustomers.js';
var MainThreadWindow = /** @class */ (function () {
    function MainThreadWindow(extHostContext, windowService) {
        this.windowService = windowService;
        this.disposables = [];
        this.proxy = extHostContext.getProxy(ExtHostContext.ExtHostWindow);
        // TODO:UNDO
        // latch(windowService.onDidChangeFocus)
        // 	(this.proxy.$onDidChangeWindowFocus, this.proxy, this.disposables);
    }
    MainThreadWindow.prototype.$getWindowVisibility = function () {
        return this.windowService.isFocused();
    };
    MainThreadWindow.prototype.dispose = function () {
        this.disposables = dispose(this.disposables);
    };
    MainThreadWindow = __decorate([
        extHostNamedCustomer(MainContext.MainThreadWindow),
        __param(1, IWindowService)
    ], MainThreadWindow);
    return MainThreadWindow;
}());
export { MainThreadWindow };
