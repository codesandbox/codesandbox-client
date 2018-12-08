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
import { extHostNamedCustomer } from './extHostCustomers.js';
import { MainContext } from '../node/extHost.protocol.js';
import { IExtensionService } from '../../services/extensions/common/extensions.js';
import { ExtensionService } from '../../services/extensions/electron-browser/extensionService.js';
var MainThreadExtensionService = /** @class */ (function () {
    function MainThreadExtensionService(extHostContext, extensionService) {
        if (extensionService instanceof ExtensionService) {
            this._extensionService = extensionService;
        }
    }
    MainThreadExtensionService.prototype.dispose = function () {
    };
    MainThreadExtensionService.prototype.$localShowMessage = function (severity, msg) {
        this._extensionService._logOrShowMessage(severity, msg);
    };
    MainThreadExtensionService.prototype.$onExtensionActivated = function (extensionId, startup, codeLoadingTime, activateCallTime, activateResolvedTime, activationEvent) {
        this._extensionService._onExtensionActivated(extensionId, startup, codeLoadingTime, activateCallTime, activateResolvedTime, activationEvent);
    };
    MainThreadExtensionService.prototype.$onExtensionRuntimeError = function (extensionId, data) {
        var error = new Error();
        error.name = data.name;
        error.message = data.message;
        error.stack = data.stack;
        this._extensionService._onExtensionRuntimeError(extensionId, error);
        console.error("[" + extensionId + "]" + error.message);
        console.error(error.stack);
    };
    MainThreadExtensionService.prototype.$onExtensionActivationFailed = function (extensionId) {
    };
    MainThreadExtensionService.prototype.$addMessage = function (extensionId, severity, message) {
        this._extensionService._addMessage(extensionId, severity, message);
    };
    MainThreadExtensionService = __decorate([
        extHostNamedCustomer(MainContext.MainThreadExtensionService),
        __param(1, IExtensionService)
    ], MainThreadExtensionService);
    return MainThreadExtensionService;
}());
export { MainThreadExtensionService };
