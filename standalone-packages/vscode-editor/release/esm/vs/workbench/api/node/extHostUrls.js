/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { MainContext } from './extHost.protocol.js';
import { URI } from '../../../base/common/uri.js';
import { toDisposable } from '../../../base/common/lifecycle.js';
import { onUnexpectedError } from '../../../base/common/errors.js';
var ExtHostUrls = /** @class */ (function () {
    function ExtHostUrls(mainContext) {
        this.handles = new Set();
        this.handlers = new Map();
        this._proxy = mainContext.getProxy(MainContext.MainThreadUrls);
    }
    ExtHostUrls.prototype.registerUriHandler = function (extensionId, handler) {
        var _this = this;
        if (this.handles.has(extensionId)) {
            throw new Error("Protocol handler already registered for extension " + extensionId);
        }
        var handle = ExtHostUrls.HandlePool++;
        this.handles.add(extensionId);
        this.handlers.set(handle, handler);
        this._proxy.$registerUriHandler(handle, extensionId);
        return toDisposable(function () {
            _this.handles.delete(extensionId);
            _this.handlers.delete(handle);
            _this._proxy.$unregisterUriHandler(handle);
        });
    };
    ExtHostUrls.prototype.$handleExternalUri = function (handle, uri) {
        var handler = this.handlers.get(handle);
        if (!handler) {
            return Promise.resolve(null);
        }
        try {
            handler.handleUri(URI.revive(uri));
        }
        catch (err) {
            onUnexpectedError(err);
        }
        return Promise.resolve(null);
    };
    ExtHostUrls.HandlePool = 0;
    return ExtHostUrls;
}());
export { ExtHostUrls };
