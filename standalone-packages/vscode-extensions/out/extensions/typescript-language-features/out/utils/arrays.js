"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.empty = Object.freeze([]);
function equals(a, b, itemEquals = (a, b) => a === b) {
    if (a === b) {
        return true;
    }
    if (a.length !== b.length) {
        return false;
    }
    return a.every((x, i) => itemEquals(x, b[i]));
}
exports.equals = equals;
function flatten(arr) {
    return Array.prototype.concat.apply([], arr);
}
exports.flatten = flatten;
//# sourceMappingURL=arrays.js.map