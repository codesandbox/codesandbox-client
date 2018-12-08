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
import { ExtHostContext, MainContext } from '../node/extHost.protocol.js';
import { extHostNamedCustomer } from './extHostCustomers.js';
import { IURLService } from '../../../platform/url/common/url.js';
import { IExtensionUrlHandler } from '../../services/extensions/electron-browser/inactiveExtensionUrlHandler.js';
var ExtensionUrlHandler = /** @class */ (function () {
    function ExtensionUrlHandler(proxy, handle, extensionId) {
        this.proxy = proxy;
        this.handle = handle;
        this.extensionId = extensionId;
    }
    ExtensionUrlHandler.prototype.handleURL = function (uri) {
        if (uri.authority !== this.extensionId) {
            return Promise.resolve(false);
        }
        return Promise.resolve(this.proxy.$handleExternalUri(this.handle, uri)).then(function () { return true; });
    };
    return ExtensionUrlHandler;
}());
var MainThreadUrls = /** @class */ (function () {
    function MainThreadUrls(context, urlService, inactiveExtensionUrlHandler) {
        this.urlService = urlService;
        this.inactiveExtensionUrlHandler = inactiveExtensionUrlHandler;
        this.handlers = new Map();
        this.proxy = context.getProxy(ExtHostContext.ExtHostUrls);
    }
    MainThreadUrls.prototype.$registerUriHandler = function (handle, extensionId) {
        var handler = new ExtensionUrlHandler(this.proxy, handle, extensionId);
        var disposable = this.urlService.registerHandler(handler);
        this.handlers.set(handle, { extensionId: extensionId, disposable: disposable });
        this.inactiveExtensionUrlHandler.registerExtensionHandler(extensionId, handler);
        return Promise.resolve(null);
    };
    MainThreadUrls.prototype.$unregisterUriHandler = function (handle) {
        var tuple = this.handlers.get(handle);
        if (!tuple) {
            return Promise.resolve(null);
        }
        var extensionId = tuple.extensionId, disposable = tuple.disposable;
        this.inactiveExtensionUrlHandler.unregisterExtensionHandler(extensionId);
        this.handlers.delete(handle);
        disposable.dispose();
        return Promise.resolve(null);
    };
    MainThreadUrls.prototype.dispose = function () {
        this.handlers.forEach(function (_a) {
            var disposable = _a.disposable;
            return disposable.dispose();
        });
        this.handlers.clear();
    };
    MainThreadUrls = __decorate([
        extHostNamedCustomer(MainContext.MainThreadUrls),
        __param(1, IURLService),
        __param(2, IExtensionUrlHandler)
    ], MainThreadUrls);
    return MainThreadUrls;
}());
export { MainThreadUrls };
