/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
export function createDecorator(mapFn) {
    return function (target, key, descriptor) {
        var fnKey = null;
        var fn = null;
        if (typeof descriptor.value === 'function') {
            fnKey = 'value';
            fn = descriptor.value;
        }
        else if (typeof descriptor.get === 'function') {
            fnKey = 'get';
            fn = descriptor.get;
        }
        if (!fn) {
            throw new Error('not supported');
        }
        descriptor[fnKey] = mapFn(fn, key);
    };
}
export function memoize(target, key, descriptor) {
    var fnKey = null;
    var fn = null;
    if (typeof descriptor.value === 'function') {
        fnKey = 'value';
        fn = descriptor.value;
        if (fn.length !== 0) {
            console.warn('Memoize should only be used in functions with zero parameters');
        }
    }
    else if (typeof descriptor.get === 'function') {
        fnKey = 'get';
        fn = descriptor.get;
    }
    if (!fn) {
        throw new Error('not supported');
    }
    var memoizeKey = "$memoize$" + key;
    descriptor[fnKey] = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!this.hasOwnProperty(memoizeKey)) {
            Object.defineProperty(this, memoizeKey, {
                configurable: false,
                enumerable: false,
                writable: false,
                value: fn.apply(this, args)
            });
        }
        return this[memoizeKey];
    };
}
export function debounce(delay, reducer, initialValueProvider) {
    return createDecorator(function (fn, key) {
        var timerKey = "$debounce$" + key;
        var resultKey = "$debounce$result$" + key;
        return function () {
            var _this = this;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (!this[resultKey]) {
                this[resultKey] = initialValueProvider ? initialValueProvider() : void 0;
            }
            clearTimeout(this[timerKey]);
            if (reducer) {
                this[resultKey] = reducer.apply(void 0, [this[resultKey]].concat(args));
                args = [this[resultKey]];
            }
            this[timerKey] = setTimeout(function () {
                fn.apply(_this, args);
                _this[resultKey] = initialValueProvider ? initialValueProvider() : void 0;
            }, delay);
        };
    });
}
