"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.equals = void 0;
const array = require("./arrays");
function equals(one, other) {
    if (one === other) {
        return true;
    }
    if (one === null || one === undefined || other === null || other === undefined) {
        return false;
    }
    if (typeof one !== typeof other) {
        return false;
    }
    if (typeof one !== 'object') {
        return false;
    }
    if (Array.isArray(one) !== Array.isArray(other)) {
        return false;
    }
    if (Array.isArray(one)) {
        return array.equals(one, other, equals);
    }
    else {
        const oneKeys = [];
        for (const key in one) {
            oneKeys.push(key);
        }
        oneKeys.sort();
        const otherKeys = [];
        for (const key in other) {
            otherKeys.push(key);
        }
        otherKeys.sort();
        if (!array.equals(oneKeys, otherKeys)) {
            return false;
        }
        return oneKeys.every(key => equals(one[key], other[key]));
    }
}
exports.equals = equals;
//# sourceMappingURL=objects.js.map