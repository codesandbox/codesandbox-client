/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { isObject, isUndefinedOrNull, isArray } from './types';
export function deepClone(obj) {
    if (!obj || typeof obj !== 'object') {
        return obj;
    }
    if (obj instanceof RegExp) {
        // See https://github.com/Microsoft/TypeScript/issues/10990
        return obj;
    }
    var result = Array.isArray(obj) ? [] : {};
    Object.keys(obj).forEach(function (key) {
        if (obj[key] && typeof obj[key] === 'object') {
            result[key] = deepClone(obj[key]);
        }
        else {
            result[key] = obj[key];
        }
    });
    return result;
}
export function deepFreeze(obj) {
    if (!obj || typeof obj !== 'object') {
        return obj;
    }
    var stack = [obj];
    while (stack.length > 0) {
        var obj_1 = stack.shift();
        Object.freeze(obj_1);
        for (var key in obj_1) {
            if (_hasOwnProperty.call(obj_1, key)) {
                var prop = obj_1[key];
                if (typeof prop === 'object' && !Object.isFrozen(prop)) {
                    stack.push(prop);
                }
            }
        }
    }
    return obj;
}
var _hasOwnProperty = Object.prototype.hasOwnProperty;
export function cloneAndChange(obj, changer) {
    return _cloneAndChange(obj, changer, []);
}
function _cloneAndChange(obj, changer, encounteredObjects) {
    if (isUndefinedOrNull(obj)) {
        return obj;
    }
    var changed = changer(obj);
    if (typeof changed !== 'undefined') {
        return changed;
    }
    if (isArray(obj)) {
        var r1 = [];
        for (var i1 = 0; i1 < obj.length; i1++) {
            r1.push(_cloneAndChange(obj[i1], changer, encounteredObjects));
        }
        return r1;
    }
    if (isObject(obj)) {
        if (encounteredObjects.indexOf(obj) >= 0) {
            throw new Error('Cannot clone recursive data-structure');
        }
        encounteredObjects.push(obj);
        var r2 = {};
        for (var i2 in obj) {
            if (_hasOwnProperty.call(obj, i2)) {
                r2[i2] = _cloneAndChange(obj[i2], changer, encounteredObjects);
            }
        }
        encounteredObjects.pop();
        return r2;
    }
    return obj;
}
/**
 * Copies all properties of source into destination. The optional parameter "overwrite" allows to control
 * if existing properties on the destination should be overwritten or not. Defaults to true (overwrite).
 */
export function mixin(destination, source, overwrite) {
    if (overwrite === void 0) { overwrite = true; }
    if (!isObject(destination)) {
        return source;
    }
    if (isObject(source)) {
        Object.keys(source).forEach(function (key) {
            if (key in destination) {
                if (overwrite) {
                    if (isObject(destination[key]) && isObject(source[key])) {
                        mixin(destination[key], source[key], overwrite);
                    }
                    else {
                        destination[key] = source[key];
                    }
                }
            }
            else {
                destination[key] = source[key];
            }
        });
    }
    return destination;
}
export function assign(destination) {
    var sources = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        sources[_i - 1] = arguments[_i];
    }
    sources.forEach(function (source) { return Object.keys(source).forEach(function (key) { return destination[key] = source[key]; }); });
    return destination;
}
export function equals(one, other) {
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
    if ((Array.isArray(one)) !== (Array.isArray(other))) {
        return false;
    }
    var i;
    var key;
    if (Array.isArray(one)) {
        if (one.length !== other.length) {
            return false;
        }
        for (i = 0; i < one.length; i++) {
            if (!equals(one[i], other[i])) {
                return false;
            }
        }
    }
    else {
        var oneKeys = [];
        for (key in one) {
            oneKeys.push(key);
        }
        oneKeys.sort();
        var otherKeys = [];
        for (key in other) {
            otherKeys.push(key);
        }
        otherKeys.sort();
        if (!equals(oneKeys, otherKeys)) {
            return false;
        }
        for (i = 0; i < oneKeys.length; i++) {
            if (!equals(one[oneKeys[i]], other[oneKeys[i]])) {
                return false;
            }
        }
    }
    return true;
}
export function arrayToHash(array) {
    var result = {};
    for (var i = 0; i < array.length; ++i) {
        result[array[i]] = true;
    }
    return result;
}
/**
 * Given an array of strings, returns a function which, given a string
 * returns true or false whether the string is in that array.
 */
export function createKeywordMatcher(arr, caseInsensitive) {
    if (caseInsensitive === void 0) { caseInsensitive = false; }
    if (caseInsensitive) {
        arr = arr.map(function (x) { return x.toLowerCase(); });
    }
    var hash = arrayToHash(arr);
    if (caseInsensitive) {
        return function (word) {
            return hash[word.toLowerCase()] !== undefined && hash.hasOwnProperty(word.toLowerCase());
        };
    }
    else {
        return function (word) {
            return hash[word] !== undefined && hash.hasOwnProperty(word);
        };
    }
}
/**
 * Calls JSON.Stringify with a replacer to break apart any circular references.
 * This prevents JSON.stringify from throwing the exception
 *  "Uncaught TypeError: Converting circular structure to JSON"
 */
export function safeStringify(obj) {
    var seen = [];
    return JSON.stringify(obj, function (key, value) {
        if (isObject(value) || Array.isArray(value)) {
            if (seen.indexOf(value) !== -1) {
                return '[Circular]';
            }
            else {
                seen.push(value);
            }
        }
        return value;
    });
}
export function getOrDefault(obj, fn, defaultValue) {
    if (defaultValue === void 0) { defaultValue = null; }
    var result = fn(obj);
    return typeof result === 'undefined' ? defaultValue : result;
}
/**
 * Returns an object that has keys for each value that is different in the base object. Keys
 * that do not exist in the target but in the base object are not considered.
 *
 * Note: This is not a deep-diffing method, so the values are strictly taken into the resulting
 * object if they differ.
 *
 * @param base the object to diff against
 * @param obj the object to use for diffing
 */
export function distinct(base, target) {
    var result = Object.create(null);
    if (!base || !target) {
        return result;
    }
    var targetKeys = Object.keys(target);
    targetKeys.forEach(function (k) {
        var baseValue = base[k];
        var targetValue = target[k];
        if (!equals(baseValue, targetValue)) {
            result[k] = targetValue;
        }
    });
    return result;
}
