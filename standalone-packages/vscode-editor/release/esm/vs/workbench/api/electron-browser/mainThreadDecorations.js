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
import { URI } from '../../../base/common/uri.js';
import { Emitter } from '../../../base/common/event.js';
import { dispose } from '../../../base/common/lifecycle.js';
import { ExtHostContext, MainContext } from '../node/extHost.protocol.js';
import { extHostNamedCustomer } from './extHostCustomers.js';
import { IDecorationsService } from '../../services/decorations/browser/decorations.js';
import { values } from '../../../base/common/collections.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
var DecorationRequestsQueue = /** @class */ (function () {
    function DecorationRequestsQueue(_proxy) {
        this._proxy = _proxy;
        this._idPool = 0;
        this._requests = Object.create(null);
        this._resolver = Object.create(null);
        //
    }
    DecorationRequestsQueue.prototype.enqueue = function (handle, uri, token) {
        var _this = this;
        var id = ++this._idPool;
        var result = new Promise(function (resolve) {
            _this._requests[id] = { id: id, handle: handle, uri: uri };
            _this._resolver[id] = resolve;
            _this._processQueue();
        });
        token.onCancellationRequested(function () {
            delete _this._requests[id];
            delete _this._resolver[id];
        });
        return result;
    };
    DecorationRequestsQueue.prototype._processQueue = function () {
        var _this = this;
        if (typeof this._timer === 'number') {
            // already queued
            return;
        }
        this._timer = setTimeout(function () {
            // make request
            var requests = _this._requests;
            var resolver = _this._resolver;
            _this._proxy.$provideDecorations(values(requests), CancellationToken.None).then(function (data) {
                for (var id in resolver) {
                    resolver[id](data[id]);
                }
            });
            // reset
            _this._requests = [];
            _this._resolver = [];
            _this._timer = void 0;
        }, 0);
    };
    return DecorationRequestsQueue;
}());
var MainThreadDecorations = /** @class */ (function () {
    function MainThreadDecorations(context, _decorationsService) {
        this._decorationsService = _decorationsService;
        this._provider = new Map();
        this._proxy = context.getProxy(ExtHostContext.ExtHostDecorations);
        this._requestQueue = new DecorationRequestsQueue(this._proxy);
    }
    MainThreadDecorations.prototype.dispose = function () {
        this._provider.forEach(function (value) { return dispose(value); });
        this._provider.clear();
    };
    MainThreadDecorations.prototype.$registerDecorationProvider = function (handle, label) {
        var _this = this;
        var emitter = new Emitter();
        var registration = this._decorationsService.registerDecorationsProvider({
            label: label,
            onDidChange: emitter.event,
            provideDecorations: function (uri, token) {
                return _this._requestQueue.enqueue(handle, uri, token).then(function (data) {
                    if (!data) {
                        return undefined;
                    }
                    var weight = data[0], bubble = data[1], tooltip = data[2], letter = data[3], themeColor = data[4], source = data[5];
                    return {
                        weight: weight || 0,
                        bubble: bubble || false,
                        color: themeColor && themeColor.id,
                        tooltip: tooltip,
                        letter: letter,
                        source: source,
                    };
                });
            }
        });
        this._provider.set(handle, [emitter, registration]);
    };
    MainThreadDecorations.prototype.$onDidChange = function (handle, resources) {
        var emitter = this._provider.get(handle)[0];
        emitter.fire(resources && resources.map(URI.revive));
    };
    MainThreadDecorations.prototype.$unregisterDecorationProvider = function (handle) {
        if (this._provider.has(handle)) {
            dispose(this._provider.get(handle));
            this._provider.delete(handle);
        }
    };
    MainThreadDecorations = __decorate([
        extHostNamedCustomer(MainContext.MainThreadDecorations),
        __param(1, IDecorationsService)
    ], MainThreadDecorations);
    return MainThreadDecorations;
}());
export { MainThreadDecorations };
