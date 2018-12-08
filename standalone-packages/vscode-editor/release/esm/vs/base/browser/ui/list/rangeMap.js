/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Range } from '../../../common/range.js';
/**
 * Returns the intersection between a ranged group and a range.
 * Returns `[]` if the intersection is empty.
 */
export function groupIntersect(range, groups) {
    var result = [];
    for (var _i = 0, groups_1 = groups; _i < groups_1.length; _i++) {
        var r = groups_1[_i];
        if (range.start >= r.range.end) {
            continue;
        }
        if (range.end < r.range.start) {
            break;
        }
        var intersection = Range.intersect(range, r.range);
        if (Range.isEmpty(intersection)) {
            continue;
        }
        result.push({
            range: intersection,
            size: r.size
        });
    }
    return result;
}
/**
 * Shifts a range by that `much`.
 */
export function shift(_a, much) {
    var start = _a.start, end = _a.end;
    return { start: start + much, end: end + much };
}
/**
 * Consolidates a collection of ranged groups.
 *
 * Consolidation is the process of merging consecutive ranged groups
 * that share the same `size`.
 */
export function consolidate(groups) {
    var result = [];
    var previousGroup = null;
    for (var _i = 0, groups_2 = groups; _i < groups_2.length; _i++) {
        var group = groups_2[_i];
        var start = group.range.start;
        var end = group.range.end;
        var size = group.size;
        if (previousGroup && size === previousGroup.size) {
            previousGroup.range.end = end;
            continue;
        }
        previousGroup = { range: { start: start, end: end }, size: size };
        result.push(previousGroup);
    }
    return result;
}
/**
 * Concatenates several collections of ranged groups into a single
 * collection.
 */
function concat() {
    var groups = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        groups[_i] = arguments[_i];
    }
    return consolidate(groups.reduce(function (r, g) { return r.concat(g); }, []));
}
var RangeMap = /** @class */ (function () {
    function RangeMap() {
        this.groups = [];
        this._size = 0;
    }
    RangeMap.prototype.splice = function (index, deleteCount, items) {
        if (items === void 0) { items = []; }
        var diff = items.length - deleteCount;
        var before = groupIntersect({ start: 0, end: index }, this.groups);
        var after = groupIntersect({ start: index + deleteCount, end: Number.POSITIVE_INFINITY }, this.groups)
            .map(function (g) { return ({ range: shift(g.range, diff), size: g.size }); });
        var middle = items.map(function (item, i) { return ({
            range: { start: index + i, end: index + i + 1 },
            size: item.size
        }); });
        this.groups = concat(before, middle, after);
        this._size = this.groups.reduce(function (t, g) { return t + (g.size * (g.range.end - g.range.start)); }, 0);
    };
    Object.defineProperty(RangeMap.prototype, "count", {
        /**
         * Returns the number of items in the range map.
         */
        get: function () {
            var len = this.groups.length;
            if (!len) {
                return 0;
            }
            return this.groups[len - 1].range.end;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RangeMap.prototype, "size", {
        /**
         * Returns the sum of the sizes of all items in the range map.
         */
        get: function () {
            return this._size;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns the index of the item at the given position.
     */
    RangeMap.prototype.indexAt = function (position) {
        if (position < 0) {
            return -1;
        }
        var index = 0;
        var size = 0;
        for (var _i = 0, _a = this.groups; _i < _a.length; _i++) {
            var group = _a[_i];
            var count = group.range.end - group.range.start;
            var newSize = size + (count * group.size);
            if (position < newSize) {
                return index + Math.floor((position - size) / group.size);
            }
            index += count;
            size = newSize;
        }
        return index;
    };
    /**
     * Returns the index of the item right after the item at the
     * index of the given position.
     */
    RangeMap.prototype.indexAfter = function (position) {
        return Math.min(this.indexAt(position) + 1, this.count);
    };
    /**
     * Returns the start position of the item at the given index.
     */
    RangeMap.prototype.positionAt = function (index) {
        if (index < 0) {
            return -1;
        }
        var position = 0;
        var count = 0;
        for (var _i = 0, _a = this.groups; _i < _a.length; _i++) {
            var group = _a[_i];
            var groupCount = group.range.end - group.range.start;
            var newCount = count + groupCount;
            if (index < newCount) {
                return position + ((index - count) * group.size);
            }
            position += groupCount * group.size;
            count = newCount;
        }
        return -1;
    };
    RangeMap.prototype.dispose = function () {
        this.groups = null; // StrictNullOverride: nulling out ok in dispose
    };
    return RangeMap;
}());
export { RangeMap };
