/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { URI } from '../../../base/common/uri.js';
import { MainContext } from './extHost.protocol.js';
var ExtHostDialogs = /** @class */ (function () {
    function ExtHostDialogs(mainContext) {
        this._proxy = mainContext.getProxy(MainContext.MainThreadDialogs);
    }
    ExtHostDialogs.prototype.showOpenDialog = function (options) {
        return this._proxy.$showOpenDialog(options).then(function (filepaths) {
            return filepaths && filepaths.map(URI.revive);
        });
    };
    ExtHostDialogs.prototype.showSaveDialog = function (options) {
        return this._proxy.$showSaveDialog(options).then(function (filepath) {
            return filepath && URI.revive(filepath);
        });
    };
    return ExtHostDialogs;
}());
export { ExtHostDialogs };
