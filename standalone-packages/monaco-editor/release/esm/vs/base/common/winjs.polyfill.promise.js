/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Promise as WinJSPromise } from './winjs.base.js';
import * as platform from './platform.js';
import { isThenable } from './async.js';
function isWinJSPromise(candidate) {
    return isThenable(candidate) && typeof candidate.done === 'function';
}
/**
 * A polyfill for the native promises. The implementation is based on
 * WinJS promises but tries to gap differences between winjs promises
 * and native promises.
 */
var PolyfillPromise = /** @class */ (function () {
    function PolyfillPromise(initOrPromise) {
        if (isWinJSPromise(initOrPromise)) {
            this._winjsPromise = initOrPromise;
        }
        else {
            this._winjsPromise = new WinJSPromise(function (resolve, reject) {
                var initializing = true;
                initOrPromise(function (value) {
                    if (!initializing) {
                        resolve(value);
                    }
                    else {
                        platform.setImmediate(function () { return resolve(value); });
                    }
                }, function (err) {
                    if (!initializing) {
                        reject(err);
                    }
                    else {
                        platform.setImmediate(function () { return reject(err); });
                    }
                });
                initializing = false;
            });
        }
    }
    PolyfillPromise.all = function (thenables) {
        return new PolyfillPromise(WinJSPromise.join(thenables).then(null, function (values) {
            // WinJSPromise returns a sparse array whereas
            // native promises return the *first* error
            for (var key in values) {
                if (values.hasOwnProperty(key)) {
                    return values[key];
                }
            }
        }));
    };
    PolyfillPromise.race = function (thenables) {
        // WinJSPromise returns `{ key: <index/key>, value: <promise> }`
        // from the `any` call and Promise.race just wants the value
        return new PolyfillPromise(WinJSPromise.any(thenables).then(function (entry) { return entry.value; }, function (err) { return err.value; }));
    };
    PolyfillPromise.resolve = function (value) {
        return new PolyfillPromise(WinJSPromise.wrap(value));
    };
    PolyfillPromise.reject = function (value) {
        return new PolyfillPromise(WinJSPromise.wrapError(value));
    };
    PolyfillPromise.prototype.then = function (onFulfilled, onRejected) {
        var sync = true;
        // To support chaining, we need to return the value of the
        // onFulfilled and onRejected callback.
        // WinJSPromise supports a flat-map style #then, ie. the callbacks
        // passed to WinJSPromise#then can return a Promise.
        var promise = new PolyfillPromise(this._winjsPromise.then(onFulfilled && function (value) {
            if (!sync) {
                return onFulfilled(value);
            }
            else {
                return new WinJSPromise(function (resolve, reject) {
                    platform.setImmediate(function () {
                        var result;
                        try {
                            result = onFulfilled(value);
                        }
                        catch (err2) {
                            reject(err2);
                            return;
                        }
                        resolve(result);
                    });
                });
            }
        }, onRejected && function (err) {
            if (!sync) {
                return onRejected(err);
            }
            else {
                return new WinJSPromise(function (resolve, reject) {
                    platform.setImmediate(function () {
                        var result;
                        try {
                            result = onRejected(err);
                        }
                        catch (err2) {
                            reject(err2);
                            return;
                        }
                        resolve(result);
                    });
                });
            }
        }));
        sync = false;
        return promise;
    };
    PolyfillPromise.prototype.catch = function (onRejected) {
        return this.then(null, onRejected);
    };
    return PolyfillPromise;
}());
export { PolyfillPromise };
