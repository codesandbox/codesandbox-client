/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var hasOwnProperty = Object.prototype.hasOwnProperty;
/**
 * Returns an array which contains all values that reside
 * in the given set.
 */
export function values(from) {
    var result = [];
    for (var key in from) {
        if (hasOwnProperty.call(from, key)) {
            result.push(from[key]);
        }
    }
    return result;
}
export function size(from) {
    var count = 0;
    for (var key in from) {
        if (hasOwnProperty.call(from, key)) {
            count += 1;
        }
    }
    return count;
}
export function first(from) {
    for (var key in from) {
        if (hasOwnProperty.call(from, key)) {
            return from[key];
        }
    }
    return undefined;
}
/**
 * Iterates over each entry in the provided set. The iterator allows
 * to remove elements and will stop when the callback returns {{false}}.
 */
export function forEach(from, callback) {
    var _loop_1 = function (key) {
        if (hasOwnProperty.call(from, key)) {
            var result = callback({ key: key, value: from[key] }, function () {
                delete from[key];
            });
            if (result === false) {
                return { value: void 0 };
            }
        }
    };
    for (var key in from) {
        var state_1 = _loop_1(key);
        if (typeof state_1 === "object")
            return state_1.value;
    }
}
/**
 * Removes an element from the dictionary. Returns {{false}} if the property
 * does not exists.
 */
export function remove(from, key) {
    if (!hasOwnProperty.call(from, key)) {
        return false;
    }
    delete from[key];
    return true;
}
/**
 * Groups the collection into a dictionary based on the provided
 * group function.
 */
export function groupBy(data, groupFn) {
    var result = Object.create(null);
    for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
        var element = data_1[_i];
        var key = groupFn(element);
        var target = result[key];
        if (!target) {
            target = result[key] = [];
        }
        target.push(element);
    }
    return result;
}
