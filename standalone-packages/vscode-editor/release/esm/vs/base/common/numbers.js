/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
export function rot(index, modulo) {
    return (modulo + (index % modulo)) % modulo;
}
var Counter = /** @class */ (function () {
    function Counter() {
        this._next = 0;
    }
    Counter.prototype.getNext = function () {
        return this._next++;
    };
    return Counter;
}());
export { Counter };
