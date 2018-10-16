/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var _empty = {
    next: function () {
        return { done: true, value: undefined };
    }
};
export function empty() {
    return _empty;
}
export function iter(array, index, length) {
    if (index === void 0) { index = 0; }
    if (length === void 0) { length = array.length; }
    return {
        next: function () {
            if (index >= length) {
                return { done: true, value: undefined };
            }
            return { done: false, value: array[index++] };
        }
    };
}
export function map(iterator, fn) {
    return {
        next: function () {
            var _a = iterator.next(), done = _a.done, value = _a.value;
            return { done: done, value: done ? undefined : fn(value) };
        }
    };
}
export function filter(iterator, fn) {
    return {
        next: function () {
            while (true) {
                var _a = iterator.next(), done = _a.done, value = _a.value;
                if (done) {
                    return { done: done, value: undefined };
                }
                if (fn(value)) {
                    return { done: done, value: value };
                }
            }
        }
    };
}
export function forEach(iterator, fn) {
    for (var next = iterator.next(); !next.done; next = iterator.next()) {
        fn(next.value);
    }
}
export function collect(iterator) {
    var result = [];
    forEach(iterator, function (value) { return result.push(value); });
    return result;
}
var ArrayIterator = /** @class */ (function () {
    function ArrayIterator(items, start, end, index) {
        if (start === void 0) { start = 0; }
        if (end === void 0) { end = items.length; }
        if (index === void 0) { index = start - 1; }
        this.items = items;
        this.start = start;
        this.end = end;
        this.index = index;
    }
    ArrayIterator.prototype.first = function () {
        this.index = this.start;
        return this.current();
    };
    ArrayIterator.prototype.next = function () {
        this.index = Math.min(this.index + 1, this.end);
        return this.current();
    };
    ArrayIterator.prototype.current = function () {
        if (this.index === this.start - 1 || this.index === this.end) {
            return null;
        }
        return this.items[this.index];
    };
    return ArrayIterator;
}());
export { ArrayIterator };
var ArrayNavigator = /** @class */ (function (_super) {
    __extends(ArrayNavigator, _super);
    function ArrayNavigator(items, start, end, index) {
        if (start === void 0) { start = 0; }
        if (end === void 0) { end = items.length; }
        if (index === void 0) { index = start - 1; }
        return _super.call(this, items, start, end, index) || this;
    }
    ArrayNavigator.prototype.current = function () {
        return _super.prototype.current.call(this);
    };
    ArrayNavigator.prototype.previous = function () {
        this.index = Math.max(this.index - 1, this.start - 1);
        return this.current();
    };
    ArrayNavigator.prototype.first = function () {
        this.index = this.start;
        return this.current();
    };
    ArrayNavigator.prototype.last = function () {
        this.index = this.end - 1;
        return this.current();
    };
    ArrayNavigator.prototype.parent = function () {
        return null;
    };
    return ArrayNavigator;
}(ArrayIterator));
export { ArrayNavigator };
var MappedIterator = /** @class */ (function () {
    function MappedIterator(iterator, fn) {
        this.iterator = iterator;
        this.fn = fn;
        // noop
    }
    MappedIterator.prototype.next = function () { return this.fn(this.iterator.next()); };
    return MappedIterator;
}());
export { MappedIterator };
var MappedNavigator = /** @class */ (function (_super) {
    __extends(MappedNavigator, _super);
    function MappedNavigator(navigator, fn) {
        var _this = _super.call(this, navigator, fn) || this;
        _this.navigator = navigator;
        return _this;
    }
    MappedNavigator.prototype.current = function () { return this.fn(this.navigator.current()); };
    MappedNavigator.prototype.previous = function () { return this.fn(this.navigator.previous()); };
    MappedNavigator.prototype.parent = function () { return this.fn(this.navigator.parent()); };
    MappedNavigator.prototype.first = function () { return this.fn(this.navigator.first()); };
    MappedNavigator.prototype.last = function () { return this.fn(this.navigator.last()); };
    MappedNavigator.prototype.next = function () { return this.fn(this.navigator.next()); };
    return MappedNavigator;
}(MappedIterator));
export { MappedNavigator };
