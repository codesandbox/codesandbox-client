/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { MainContext } from './extHost.protocol.js';
var ExtHostClipboard = /** @class */ (function () {
    function ExtHostClipboard(mainContext) {
        this._proxy = mainContext.getProxy(MainContext.MainThreadClipboard);
    }
    ExtHostClipboard.prototype.readText = function () {
        return this._proxy.$readText();
    };
    ExtHostClipboard.prototype.writeText = function (value) {
        return this._proxy.$writeText(value);
    };
    return ExtHostClipboard;
}());
export { ExtHostClipboard };
