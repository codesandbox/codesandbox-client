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
import { EditorWorkerClient } from './editorWorkerServiceImpl.js';
/**
 * Create a new web worker that has model syncing capabilities built in.
 * Specify an AMD module to load that will `create` an object that will be proxied.
 */
export function createWebWorker(modelService, opts) {
    return new MonacoWebWorkerImpl(modelService, opts);
}
var MonacoWebWorkerImpl = /** @class */ (function (_super) {
    __extends(MonacoWebWorkerImpl, _super);
    function MonacoWebWorkerImpl(modelService, opts) {
        var _this = _super.call(this, modelService, opts.label) || this;
        _this._foreignModuleId = opts.moduleId;
        _this._foreignModuleCreateData = opts.createData || null;
        _this._foreignProxy = null;
        return _this;
    }
    MonacoWebWorkerImpl.prototype._getForeignProxy = function () {
        var _this = this;
        if (!this._foreignProxy) {
            this._foreignProxy = this._getProxy().then(function (proxy) {
                return proxy.loadForeignModule(_this._foreignModuleId, _this._foreignModuleCreateData).then(function (foreignMethods) {
                    _this._foreignModuleCreateData = null;
                    var proxyMethodRequest = function (method, args) {
                        return proxy.fmr(method, args);
                    };
                    var createProxyMethod = function (method, proxyMethodRequest) {
                        return function () {
                            var args = Array.prototype.slice.call(arguments, 0);
                            return proxyMethodRequest(method, args);
                        };
                    };
                    var foreignProxy = {};
                    for (var i = 0; i < foreignMethods.length; i++) {
                        foreignProxy[foreignMethods[i]] = createProxyMethod(foreignMethods[i], proxyMethodRequest);
                    }
                    return foreignProxy;
                });
            });
        }
        return this._foreignProxy;
    };
    MonacoWebWorkerImpl.prototype.getProxy = function () {
        return this._getForeignProxy();
    };
    MonacoWebWorkerImpl.prototype.withSyncedResources = function (resources) {
        var _this = this;
        return this._withSyncedResources(resources).then(function (_) { return _this.getProxy(); });
    };
    return MonacoWebWorkerImpl;
}(EditorWorkerClient));
