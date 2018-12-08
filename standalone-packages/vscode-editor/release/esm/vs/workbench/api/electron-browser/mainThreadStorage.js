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
import { IStorageService } from '../../../platform/storage/common/storage.js';
import { MainContext, ExtHostContext } from '../node/extHost.protocol.js';
import { extHostNamedCustomer } from './extHostCustomers.js';
var MainThreadStorage = /** @class */ (function () {
    function MainThreadStorage(extHostContext, storageService) {
        var _this = this;
        this._sharedStorageKeysToWatch = new Map();
        this._storageService = storageService;
        this._proxy = extHostContext.getProxy(ExtHostContext.ExtHostStorage);
        this._storageListener = this._storageService.onDidChangeStorage(function (e) {
            var shared = e.scope === 0 /* GLOBAL */;
            if (shared && _this._sharedStorageKeysToWatch.has(e.key)) {
                try {
                    _this._proxy.$acceptValue(shared, e.key, _this._getValue(shared, e.key));
                }
                catch (error) {
                    // ignore parsing errors that can happen
                }
            }
        });
    }
    MainThreadStorage.prototype.dispose = function () {
        this._storageListener.dispose();
    };
    MainThreadStorage.prototype.$getValue = function (shared, key) {
        if (shared) {
            this._sharedStorageKeysToWatch.set(key, true);
        }
        try {
            return Promise.resolve(this._getValue(shared, key));
        }
        catch (error) {
            return Promise.reject(error);
        }
    };
    MainThreadStorage.prototype._getValue = function (shared, key) {
        var jsonValue = this._storageService.get(key, shared ? 0 /* GLOBAL */ : 1 /* WORKSPACE */);
        if (!jsonValue) {
            return undefined;
        }
        return JSON.parse(jsonValue);
    };
    MainThreadStorage.prototype.$setValue = function (shared, key, value) {
        var jsonValue;
        try {
            jsonValue = JSON.stringify(value);
            this._storageService.store(key, jsonValue, shared ? 0 /* GLOBAL */ : 1 /* WORKSPACE */);
        }
        catch (err) {
            return Promise.reject(err);
        }
        return undefined;
    };
    MainThreadStorage = __decorate([
        extHostNamedCustomer(MainContext.MainThreadStorage),
        __param(1, IStorageService)
    ], MainThreadStorage);
    return MainThreadStorage;
}());
export { MainThreadStorage };
