/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { URI } from '../../../base/common/uri.js';
import { MainContext } from './extHost.protocol.js';
import { Disposable } from './extHostTypes.js';
var ExtHostDecorations = /** @class */ (function () {
    function ExtHostDecorations(mainContext) {
        this._provider = new Map();
        this._proxy = mainContext.getProxy(MainContext.MainThreadDecorations);
    }
    ExtHostDecorations.prototype.registerDecorationProvider = function (provider, extensionId) {
        var _this = this;
        var handle = ExtHostDecorations._handlePool++;
        this._provider.set(handle, { provider: provider, extensionId: extensionId });
        this._proxy.$registerDecorationProvider(handle, extensionId);
        var listener = provider.onDidChangeDecorations(function (e) {
            _this._proxy.$onDidChange(handle, !e ? null : Array.isArray(e) ? e : [e]);
        });
        return new Disposable(function () {
            listener.dispose();
            _this._proxy.$unregisterDecorationProvider(handle);
            _this._provider.delete(handle);
        });
    };
    ExtHostDecorations.prototype.$provideDecorations = function (requests, token) {
        var _this = this;
        var result = Object.create(null);
        return Promise.all(requests.map(function (request) {
            var handle = request.handle, uri = request.uri, id = request.id;
            if (!_this._provider.has(handle)) {
                // might have been unregistered in the meantime
                return void 0;
            }
            var _a = _this._provider.get(handle), provider = _a.provider, extensionId = _a.extensionId;
            return Promise.resolve(provider.provideDecoration(URI.revive(uri), token)).then(function (data) {
                if (data && data.letter && data.letter.length !== 1) {
                    console.warn("INVALID decoration from extension '" + extensionId + "'. The 'letter' must be set and be one character, not '" + data.letter + "'.");
                }
                result[id] = data && [data.priority, data.bubble, data.title, data.letter, data.color, data.source];
            }, function (err) {
                console.error(err);
            });
        })).then(function () {
            return result;
        });
    };
    ExtHostDecorations._handlePool = 0;
    return ExtHostDecorations;
}());
export { ExtHostDecorations };
