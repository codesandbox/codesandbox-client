/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var CombinedSpliceable = /** @class */ (function () {
    function CombinedSpliceable(spliceables) {
        this.spliceables = spliceables;
    }
    CombinedSpliceable.prototype.splice = function (start, deleteCount, elements) {
        this.spliceables.forEach(function (s) { return s.splice(start, deleteCount, elements); });
    };
    return CombinedSpliceable;
}());
export { CombinedSpliceable };
