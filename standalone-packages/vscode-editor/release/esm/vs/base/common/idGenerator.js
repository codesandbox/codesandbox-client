/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var IdGenerator = /** @class */ (function () {
    function IdGenerator(prefix) {
        this._prefix = prefix;
        this._lastId = 0;
    }
    IdGenerator.prototype.nextId = function () {
        return this._prefix + (++this._lastId);
    };
    return IdGenerator;
}());
export { IdGenerator };
export var defaultGenerator = new IdGenerator('id#');
