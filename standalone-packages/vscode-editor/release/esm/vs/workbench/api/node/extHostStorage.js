/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { MainContext } from './extHost.protocol.js';
import { Emitter } from '../../../base/common/event.js';
var ExtHostStorage = /** @class */ (function () {
    function ExtHostStorage(mainContext) {
        this._onDidChangeStorage = new Emitter();
        this.onDidChangeStorage = this._onDidChangeStorage.event;
        this._proxy = mainContext.getProxy(MainContext.MainThreadStorage);
    }
    ExtHostStorage.prototype.getValue = function (shared, key, defaultValue) {
        return this._proxy.$getValue(shared, key).then(function (value) { return value || defaultValue; });
    };
    ExtHostStorage.prototype.setValue = function (shared, key, value) {
        return this._proxy.$setValue(shared, key, value);
    };
    ExtHostStorage.prototype.$acceptValue = function (shared, key, value) {
        this._onDidChangeStorage.fire({ shared: shared, key: key, value: value });
    };
    return ExtHostStorage;
}());
export { ExtHostStorage };
