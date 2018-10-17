/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { canceled } from './errors';
import { TPromise } from './winjs.base';
/**
 * Returns the last element of an array.
 * @param array The array.
 * @param n Which element from the end (default is zero).
 */
export function tail(array, n) {
    if (n === void 0) { n = 0; }
    return array[array.length - (1 + n)];
}
export function tail2(arr) {
    if (arr.length === 0) {
        throw new Error('Invalid tail call');
    }
    return [arr.slice(0, arr.length - 1), arr[arr.length - 1]];
}
export function equals(one, other, itemEquals) {
    if (itemEquals === void 0) { itemEquals = function (a, b) { return a === b; }; }
    if (one === other) {
        return true;
    }
    if (!one || !other) {
        return false;
    }
    if (one.length !== other.length) {
        return false;
    }
    for (var i = 0, len = one.length; i < len; i++) {
        if (!itemEquals(one[i], other[i])) {
            return false;
        }
    }
    return true;
}
export function binarySearch(array, key, comparator) {
    var low = 0, high = array.length - 1;
    while (low <= high) {
        var mid = ((low + high) / 2) | 0;
        var comp = comparator(array[mid], key);
        if (comp < 0) {
            low = mid + 1;
        }
        else if (comp > 0) {
            high = mid - 1;
        }
        else {
            return mid;
        }
    }
    return -(low + 1);
}
/**
 * Takes a sorted array and a function p. The array is sorted in such a way that all elements where p(x) is false
 * are located before all elements where p(x) is true.
 * @returns the least x for which p(x) is true or array.length if no element fullfills the given function.
 */
export function findFirstInSorted(array, p) {
    var low = 0, high = array.length;
    if (high === 0) {
        return 0; // no children
    }
    while (low < high) {
        var mid = Math.floor((low + high) / 2);
        if (p(array[mid])) {
            high = mid;
        }
        else {
            low = mid + 1;
        }
    }
    return low;
}
/**
 * Like `Array#sort` but always stable. Usually runs a little slower `than Array#sort`
 * so only use this when actually needing stable sort.
 */
export function mergeSort(data, compare) {
    _sort(data, compare, 0, data.length - 1, []);
    return data;
}
function _merge(a, compare, lo, mid, hi, aux) {
    var leftIdx = lo, rightIdx = mid + 1;
    for (var i = lo; i <= hi; i++) {
        aux[i] = a[i];
    }
    for (var i = lo; i <= hi; i++) {
        if (leftIdx > mid) {
            // left side consumed
            a[i] = aux[rightIdx++];
        }
        else if (rightIdx > hi) {
            // right side consumed
            a[i] = aux[leftIdx++];
        }
        else if (compare(aux[rightIdx], aux[leftIdx]) < 0) {
            // right element is less -> comes first
            a[i] = aux[rightIdx++];
        }
        else {
            // left element comes first (less or equal)
            a[i] = aux[leftIdx++];
        }
    }
}
function _sort(a, compare, lo, hi, aux) {
    if (hi <= lo) {
        return;
    }
    var mid = lo + ((hi - lo) / 2) | 0;
    _sort(a, compare, lo, mid, aux);
    _sort(a, compare, mid + 1, hi, aux);
    if (compare(a[mid], a[mid + 1]) <= 0) {
        // left and right are sorted and if the last-left element is less
        // or equals than the first-right element there is nothing else
        // to do
        return;
    }
    _merge(a, compare, lo, mid, hi, aux);
}
export function groupBy(data, compare) {
    var result = [];
    var currentGroup;
    for (var _i = 0, _a = mergeSort(data.slice(0), compare); _i < _a.length; _i++) {
        var element = _a[_i];
        if (!currentGroup || compare(currentGroup[0], element) !== 0) {
            currentGroup = [element];
            result.push(currentGroup);
        }
        else {
            currentGroup.push(element);
        }
    }
    return result;
}
/**
 * Diffs two *sorted* arrays and computes the splices which apply the diff.
 */
export function sortedDiff(before, after, compare) {
    var result = [];
    function pushSplice(start, deleteCount, toInsert) {
        var _a;
        if (deleteCount === 0 && toInsert.length === 0) {
            return;
        }
        var latest = result[result.length - 1];
        if (latest && latest.start + latest.deleteCount === start) {
            latest.deleteCount += deleteCount;
            (_a = latest.toInsert).push.apply(_a, toInsert);
        }
        else {
            result.push({ start: start, deleteCount: deleteCount, toInsert: toInsert });
        }
    }
    var beforeIdx = 0;
    var afterIdx = 0;
    while (true) {
        if (beforeIdx === before.length) {
            pushSplice(beforeIdx, 0, after.slice(afterIdx));
            break;
        }
        if (afterIdx === after.length) {
            pushSplice(beforeIdx, before.length - beforeIdx, []);
            break;
        }
        var beforeElement = before[beforeIdx];
        var afterElement = after[afterIdx];
        var n = compare(beforeElement, afterElement);
        if (n === 0) {
            // equal
            beforeIdx += 1;
            afterIdx += 1;
        }
        else if (n < 0) {
            // beforeElement is smaller -> before element removed
            pushSplice(beforeIdx, 1, []);
            beforeIdx += 1;
        }
        else if (n > 0) {
            // beforeElement is greater -> after element added
            pushSplice(beforeIdx, 0, [afterElement]);
            afterIdx += 1;
        }
    }
    return result;
}
/**
 * Takes two *sorted* arrays and computes their delta (removed, added elements).
 * Finishes in `Math.min(before.length, after.length)` steps.
 * @param before
 * @param after
 * @param compare
 */
export function delta(before, after, compare) {
    var splices = sortedDiff(before, after, compare);
    var removed = [];
    var added = [];
    for (var _i = 0, splices_1 = splices; _i < splices_1.length; _i++) {
        var splice = splices_1[_i];
        removed.push.apply(removed, before.slice(splice.start, splice.start + splice.deleteCount));
        added.push.apply(added, splice.toInsert);
    }
    return { removed: removed, added: added };
}
/**
 * Returns the top N elements from the array.
 *
 * Faster than sorting the entire array when the array is a lot larger than N.
 *
 * @param array The unsorted array.
 * @param compare A sort function for the elements.
 * @param n The number of elements to return.
 * @return The first n elemnts from array when sorted with compare.
 */
export function top(array, compare, n) {
    if (n === 0) {
        return [];
    }
    var result = array.slice(0, n).sort(compare);
    topStep(array, compare, result, n, array.length);
    return result;
}
/**
 * Asynchronous variant of `top()` allowing for splitting up work in batches between which the event loop can run.
 *
 * Returns the top N elements from the array.
 *
 * Faster than sorting the entire array when the array is a lot larger than N.
 *
 * @param array The unsorted array.
 * @param compare A sort function for the elements.
 * @param n The number of elements to return.
 * @param batch The number of elements to examine before yielding to the event loop.
 * @return The first n elemnts from array when sorted with compare.
 */
export function topAsync(array, compare, n, batch, token) {
    var _this = this;
    if (n === 0) {
        return TPromise.as([]);
    }
    return new TPromise(function (resolve, reject) {
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var o, result, i, m;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        o = array.length;
                        result = array.slice(0, n).sort(compare);
                        i = n, m = Math.min(n + batch, o);
                        _a.label = 1;
                    case 1:
                        if (!(i < o)) return [3 /*break*/, 5];
                        if (!(i > n)) return [3 /*break*/, 3];
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve); })];
                    case 2:
                        _a.sent(); // nextTick() would starve I/O.
                        _a.label = 3;
                    case 3:
                        if (token && token.isCancellationRequested) {
                            throw canceled();
                        }
                        topStep(array, compare, result, i, m);
                        _a.label = 4;
                    case 4:
                        i = m, m = Math.min(m + batch, o);
                        return [3 /*break*/, 1];
                    case 5: return [2 /*return*/, result];
                }
            });
        }); })()
            .then(resolve, reject);
    });
}
function topStep(array, compare, result, i, m) {
    var _loop_1 = function (n) {
        var element = array[i];
        if (compare(element, result[n - 1]) < 0) {
            result.pop();
            var j = findFirstInSorted(result, function (e) { return compare(element, e) < 0; });
            result.splice(j, 0, element);
        }
    };
    for (var n = result.length; i < m; i++) {
        _loop_1(n);
    }
}
export function coalesce(array, inplace) {
    if (!array) {
        if (!inplace) {
            return array;
        }
    }
    if (!inplace) {
        return array.filter(function (e) { return !!e; });
    }
    else {
        var to = 0;
        for (var i = 0; i < array.length; i++) {
            if (!!array[i]) {
                array[to] = array[i];
                to += 1;
            }
        }
        array.length = to;
    }
}
/**
 * Moves the element in the array for the provided positions.
 */
export function move(array, from, to) {
    array.splice(to, 0, array.splice(from, 1)[0]);
}
/**
 * @returns {{false}} if the provided object is an array
 * 	and not empty.
 */
export function isFalsyOrEmpty(obj) {
    return !Array.isArray(obj) || obj.length === 0;
}
/**
 * Removes duplicates from the given array. The optional keyFn allows to specify
 * how elements are checked for equalness by returning a unique string for each.
 */
export function distinct(array, keyFn) {
    if (!keyFn) {
        return array.filter(function (element, position) {
            return array.indexOf(element) === position;
        });
    }
    var seen = Object.create(null);
    return array.filter(function (elem) {
        var key = keyFn(elem);
        if (seen[key]) {
            return false;
        }
        seen[key] = true;
        return true;
    });
}
export function uniqueFilter(keyFn) {
    var seen = Object.create(null);
    return function (element) {
        var key = keyFn(element);
        if (seen[key]) {
            return false;
        }
        seen[key] = true;
        return true;
    };
}
export function firstIndex(array, fn) {
    for (var i = 0; i < array.length; i++) {
        var element = array[i];
        if (fn(element)) {
            return i;
        }
    }
    return -1;
}
export function first(array, fn, notFoundValue) {
    if (notFoundValue === void 0) { notFoundValue = null; }
    var index = firstIndex(array, fn);
    return index < 0 ? notFoundValue : array[index];
}
export function commonPrefixLength(one, other, equals) {
    if (equals === void 0) { equals = function (a, b) { return a === b; }; }
    var result = 0;
    for (var i = 0, len = Math.min(one.length, other.length); i < len && equals(one[i], other[i]); i++) {
        result++;
    }
    return result;
}
export function flatten(arr) {
    return [].concat.apply([], arr);
}
export function range(arg, to) {
    var from = typeof to === 'number' ? arg : 0;
    if (typeof to === 'number') {
        from = arg;
    }
    else {
        from = 0;
        to = arg;
    }
    var result = [];
    if (from <= to) {
        for (var i = from; i < to; i++) {
            result.push(i);
        }
    }
    else {
        for (var i = from; i > to; i--) {
            result.push(i);
        }
    }
    return result;
}
export function fill(num, valueFn, arr) {
    if (arr === void 0) { arr = []; }
    for (var i = 0; i < num; i++) {
        arr[i] = valueFn();
    }
    return arr;
}
export function index(array, indexer, merger) {
    if (merger === void 0) { merger = function (t) { return t; }; }
    return array.reduce(function (r, t) {
        var key = indexer(t);
        r[key] = merger(t, r[key]);
        return r;
    }, Object.create(null));
}
/**
 * Inserts an element into an array. Returns a function which, when
 * called, will remove that element from the array.
 */
export function insert(array, element) {
    array.push(element);
    return function () {
        var index = array.indexOf(element);
        if (index > -1) {
            array.splice(index, 1);
        }
    };
}
/**
 * Insert `insertArr` inside `target` at `insertIndex`.
 * Please don't touch unless you understand https://jsperf.com/inserting-an-array-within-an-array
 */
export function arrayInsert(target, insertIndex, insertArr) {
    var before = target.slice(0, insertIndex);
    var after = target.slice(insertIndex);
    return before.concat(insertArr, after);
}
/**
 * Uses Fisher-Yates shuffle to shuffle the given array
 * @param array
 */
export function shuffle(array, seed) {
    // Seeded random number generator in JS. Modified from:
    // https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
    var random = function () {
        var x = Math.sin(seed++) * 179426549; // throw away most significant digits and reduce any potential bias
        return x - Math.floor(x);
    };
    var rand = typeof seed === 'number' ? random : Math.random;
    for (var i = array.length - 1; i > 0; i -= 1) {
        var j = Math.floor(rand() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
/**
 * Pushes an element to the start of the array, if found.
 */
export function pushToStart(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
        arr.unshift(value);
    }
}
/**
 * Pushes an element to the end of the array, if found.
 */
export function pushToEnd(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
        arr.push(value);
    }
}
export function find(arr, predicate) {
    for (var i = 0; i < arr.length; i++) {
        var element = arr[i];
        if (predicate(element, i, arr)) {
            return element;
        }
    }
    return undefined;
}
