/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { onUnexpectedError } from '../../../base/common/errors.js';
import { URI } from '../../../base/common/uri.js';
import { Disposable } from './extHostTypes.js';
import { MainContext } from './extHost.protocol.js';
import { Schemas } from '../../../base/common/network.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
var ExtHostDocumentContentProvider = /** @class */ (function () {
    function ExtHostDocumentContentProvider(mainContext, _documentsAndEditors, _logService) {
        this._documentsAndEditors = _documentsAndEditors;
        this._logService = _logService;
        this._documentContentProviders = new Map();
        this._proxy = mainContext.getProxy(MainContext.MainThreadDocumentContentProviders);
    }
    ExtHostDocumentContentProvider.prototype.dispose = function () {
        // todo@joh
    };
    ExtHostDocumentContentProvider.prototype.registerTextDocumentContentProvider = function (scheme, provider) {
        var _this = this;
        // todo@remote
        // check with scheme from fs-providers!
        if (scheme === Schemas.file || scheme === Schemas.untitled) {
            throw new Error("scheme '" + scheme + "' already registered");
        }
        var handle = ExtHostDocumentContentProvider._handlePool++;
        this._documentContentProviders.set(handle, provider);
        this._proxy.$registerTextContentProvider(handle, scheme);
        var subscription;
        if (typeof provider.onDidChange === 'function') {
            subscription = provider.onDidChange(function (uri) {
                if (uri.scheme !== scheme) {
                    _this._logService.warn("Provider for scheme '" + scheme + "' is firing event for schema '" + uri.scheme + "' which will be IGNORED");
                    return;
                }
                if (_this._documentsAndEditors.getDocument(uri.toString())) {
                    _this.$provideTextDocumentContent(handle, uri).then(function (value) {
                        var document = _this._documentsAndEditors.getDocument(uri.toString());
                        if (!document) {
                            // disposed in the meantime
                            return;
                        }
                        // create lines and compare
                        var lines = value.split(/\r\n|\r|\n/);
                        // broadcast event when content changed
                        if (!document.equalLines(lines)) {
                            return _this._proxy.$onVirtualDocumentChange(uri, value);
                        }
                    }, onUnexpectedError);
                }
            });
        }
        return new Disposable(function () {
            if (_this._documentContentProviders.delete(handle)) {
                _this._proxy.$unregisterTextContentProvider(handle);
            }
            if (subscription) {
                subscription.dispose();
                subscription = undefined;
            }
        });
    };
    ExtHostDocumentContentProvider.prototype.$provideTextDocumentContent = function (handle, uri) {
        var provider = this._documentContentProviders.get(handle);
        if (!provider) {
            return Promise.reject(new Error("unsupported uri-scheme: " + uri.scheme));
        }
        return Promise.resolve(provider.provideTextDocumentContent(URI.revive(uri), CancellationToken.None));
    };
    ExtHostDocumentContentProvider._handlePool = 0;
    return ExtHostDocumentContentProvider;
}());
export { ExtHostDocumentContentProvider };
