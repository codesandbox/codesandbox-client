/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { once } from './functional';
export function isDisposable(thing) {
    return typeof thing.dispose === 'function'
        && thing.dispose.length === 0;
}
export function dispose(first) {
    var rest = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        rest[_i - 1] = arguments[_i];
    }
    if (Array.isArray(first)) {
        first.forEach(function (d) { return d && d.dispose(); });
        return [];
    }
    else if (rest.length === 0) {
        if (first) {
            first.dispose();
            return first;
        }
        return undefined;
    }
    else {
        dispose(first);
        dispose(rest);
        return [];
    }
}
export function combinedDisposable(disposables) {
    return { dispose: function () { return dispose(disposables); } };
}
export function toDisposable(fn) {
    return { dispose: function () { fn(); } };
}
var Disposable = /** @class */ (function () {
    function Disposable() {
        this._toDispose = [];
    }
    Object.defineProperty(Disposable.prototype, "toDispose", {
        get: function () { return this._toDispose; },
        enumerable: true,
        configurable: true
    });
    Disposable.prototype.dispose = function () {
        this._toDispose = dispose(this._toDispose);
    };
    Disposable.prototype._register = function (t) {
        this._toDispose.push(t);
        return t;
    };
    Disposable.None = Object.freeze({ dispose: function () { } });
    return Disposable;
}());
export { Disposable };
var ReferenceCollection = /** @class */ (function () {
    function ReferenceCollection() {
        this.references = Object.create(null);
    }
    ReferenceCollection.prototype.acquire = function (key) {
        var _this = this;
        var reference = this.references[key];
        if (!reference) {
            reference = this.references[key] = { counter: 0, object: this.createReferencedObject(key) };
        }
        var object = reference.object;
        var dispose = once(function () {
            if (--reference.counter === 0) {
                _this.destroyReferencedObject(reference.object);
                delete _this.references[key];
            }
        });
        reference.counter++;
        return { object: object, dispose: dispose };
    };
    return ReferenceCollection;
}());
export { ReferenceCollection };
var ImmortalReference = /** @class */ (function () {
    function ImmortalReference(object) {
        this.object = object;
    }
    ImmortalReference.prototype.dispose = function () { };
    return ImmortalReference;
}());
export { ImmortalReference };
