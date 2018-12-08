/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { localize } from '../../../nls.js';
import { MarkerSeverity } from '../../../platform/markers/common/markers.js';
import { URI } from '../../../base/common/uri.js';
import { MainContext } from './extHost.protocol.js';
import { DiagnosticSeverity, Diagnostic } from './extHostTypes.js';
import * as converter from './extHostTypeConverters.js';
import { mergeSort, equals } from '../../../base/common/arrays.js';
import { Emitter, debounceEvent, mapEvent } from '../../../base/common/event.js';
import { keys } from '../../../base/common/map.js';
var DiagnosticCollection = /** @class */ (function () {
    function DiagnosticCollection(name, owner, maxDiagnosticsPerFile, proxy, onDidChangeDiagnostics) {
        this._isDisposed = false;
        this._data = new Map();
        this._name = name;
        this._owner = owner;
        this._maxDiagnosticsPerFile = maxDiagnosticsPerFile;
        this._proxy = proxy;
        this._onDidChangeDiagnostics = onDidChangeDiagnostics;
    }
    DiagnosticCollection.prototype.dispose = function () {
        if (!this._isDisposed) {
            this._onDidChangeDiagnostics.fire(keys(this._data));
            this._proxy.$clear(this._owner);
            this._data = undefined;
            this._isDisposed = true;
        }
    };
    Object.defineProperty(DiagnosticCollection.prototype, "name", {
        get: function () {
            this._checkDisposed();
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    DiagnosticCollection.prototype.set = function (first, diagnostics) {
        var _a;
        if (!first) {
            // this set-call is a clear-call
            this.clear();
            return;
        }
        // the actual implementation for #set
        this._checkDisposed();
        var toSync;
        var hasChanged = true;
        if (first instanceof URI) {
            // check if this has actually changed
            hasChanged = hasChanged && !equals(diagnostics, this.get(first), Diagnostic.isEqual);
            if (!diagnostics) {
                // remove this entry
                this.delete(first);
                return;
            }
            // update single row
            this._data.set(first.toString(), diagnostics.slice());
            toSync = [first];
        }
        else if (Array.isArray(first)) {
            // update many rows
            toSync = [];
            var lastUri = void 0;
            // ensure stable-sort
            mergeSort(first, DiagnosticCollection._compareIndexedTuplesByUri);
            for (var _i = 0, first_1 = first; _i < first_1.length; _i++) {
                var tuple = first_1[_i];
                var uri = tuple[0], diagnostics_2 = tuple[1];
                if (!lastUri || uri.toString() !== lastUri.toString()) {
                    if (lastUri && this._data.get(lastUri.toString()).length === 0) {
                        this._data.delete(lastUri.toString());
                    }
                    lastUri = uri;
                    toSync.push(uri);
                    this._data.set(uri.toString(), []);
                }
                if (!diagnostics_2) {
                    // [Uri, undefined] means clear this
                    this._data.get(uri.toString()).length = 0;
                }
                else {
                    (_a = this._data.get(uri.toString())).push.apply(_a, diagnostics_2);
                }
            }
        }
        // send event for extensions
        this._onDidChangeDiagnostics.fire(toSync);
        // if nothing has changed then there is nothing else to do
        // we have updated the diagnostics but we don't send a message
        // to the renderer. tho we have still send an event for other
        // extensions because the diagnostic might carry more information
        // than known to us
        if (!hasChanged) {
            return;
        }
        // compute change and send to main side
        var entries = [];
        for (var _b = 0, toSync_1 = toSync; _b < toSync_1.length; _b++) {
            var uri = toSync_1[_b];
            var marker = void 0;
            var diagnostics_3 = this._data.get(uri.toString());
            if (diagnostics_3) {
                // no more than N diagnostics per file
                if (diagnostics_3.length > this._maxDiagnosticsPerFile) {
                    marker = [];
                    var order = [DiagnosticSeverity.Error, DiagnosticSeverity.Warning, DiagnosticSeverity.Information, DiagnosticSeverity.Hint];
                    orderLoop: for (var i = 0; i < 4; i++) {
                        for (var _c = 0, diagnostics_1 = diagnostics_3; _c < diagnostics_1.length; _c++) {
                            var diagnostic = diagnostics_1[_c];
                            if (diagnostic.severity === order[i]) {
                                var len = marker.push(converter.Diagnostic.from(diagnostic));
                                if (len === this._maxDiagnosticsPerFile) {
                                    break orderLoop;
                                }
                            }
                        }
                    }
                    // add 'signal' marker for showing omitted errors/warnings
                    marker.push({
                        severity: MarkerSeverity.Info,
                        message: localize({ key: 'limitHit', comment: ['amount of errors/warning skipped due to limits'] }, "Not showing {0} further errors and warnings.", diagnostics_3.length - this._maxDiagnosticsPerFile),
                        startLineNumber: marker[marker.length - 1].startLineNumber,
                        startColumn: marker[marker.length - 1].startColumn,
                        endLineNumber: marker[marker.length - 1].endLineNumber,
                        endColumn: marker[marker.length - 1].endColumn
                    });
                }
                else {
                    marker = diagnostics_3.map(converter.Diagnostic.from);
                }
            }
            entries.push([uri, marker]);
        }
        this._proxy.$changeMany(this._owner, entries);
    };
    DiagnosticCollection.prototype.delete = function (uri) {
        this._checkDisposed();
        this._onDidChangeDiagnostics.fire([uri]);
        this._data.delete(uri.toString());
        this._proxy.$changeMany(this._owner, [[uri, undefined]]);
    };
    DiagnosticCollection.prototype.clear = function () {
        this._checkDisposed();
        this._onDidChangeDiagnostics.fire(keys(this._data));
        this._data.clear();
        this._proxy.$clear(this._owner);
    };
    DiagnosticCollection.prototype.forEach = function (callback, thisArg) {
        var _this = this;
        this._checkDisposed();
        this._data.forEach(function (value, key) {
            var uri = URI.parse(key);
            callback.apply(thisArg, [uri, _this.get(uri), _this]);
        });
    };
    DiagnosticCollection.prototype.get = function (uri) {
        this._checkDisposed();
        var result = this._data.get(uri.toString());
        if (Array.isArray(result)) {
            return Object.freeze(result.slice(0));
        }
        return undefined;
    };
    DiagnosticCollection.prototype.has = function (uri) {
        this._checkDisposed();
        return Array.isArray(this._data.get(uri.toString()));
    };
    DiagnosticCollection.prototype._checkDisposed = function () {
        if (this._isDisposed) {
            throw new Error('illegal state - object is disposed');
        }
    };
    DiagnosticCollection._compareIndexedTuplesByUri = function (a, b) {
        if (a[0].toString() < b[0].toString()) {
            return -1;
        }
        else if (a[0].toString() > b[0].toString()) {
            return 1;
        }
        else {
            return 0;
        }
    };
    return DiagnosticCollection;
}());
export { DiagnosticCollection };
var ExtHostDiagnostics = /** @class */ (function () {
    function ExtHostDiagnostics(mainContext) {
        this._collections = new Map();
        this._onDidChangeDiagnostics = new Emitter();
        this.onDidChangeDiagnostics = mapEvent(debounceEvent(this._onDidChangeDiagnostics.event, ExtHostDiagnostics._debouncer, 50), ExtHostDiagnostics._mapper);
        this._proxy = mainContext.getProxy(MainContext.MainThreadDiagnostics);
    }
    ExtHostDiagnostics._debouncer = function (last, current) {
        if (!last) {
            return current;
        }
        else {
            return last.concat(current);
        }
    };
    ExtHostDiagnostics._mapper = function (last) {
        var uris = [];
        var map = new Set();
        for (var _i = 0, last_1 = last; _i < last_1.length; _i++) {
            var uri = last_1[_i];
            if (typeof uri === 'string') {
                if (!map.has(uri)) {
                    map.add(uri);
                    uris.push(URI.parse(uri));
                }
            }
            else {
                if (!map.has(uri.toString())) {
                    map.add(uri.toString());
                    uris.push(uri);
                }
            }
        }
        Object.freeze(uris);
        return { uris: uris };
    };
    ExtHostDiagnostics.prototype.createDiagnosticCollection = function (name) {
        var _a = this, _collections = _a._collections, _proxy = _a._proxy, _onDidChangeDiagnostics = _a._onDidChangeDiagnostics;
        var owner;
        if (!name) {
            name = '_generated_diagnostic_collection_name_#' + ExtHostDiagnostics._idPool++;
            owner = name;
        }
        else if (!_collections.has(name)) {
            owner = name;
        }
        else {
            console.warn("DiagnosticCollection with name '" + name + "' does already exist.");
            do {
                owner = name + ExtHostDiagnostics._idPool++;
            } while (_collections.has(owner));
        }
        var result = new /** @class */ (function (_super) {
            __extends(class_1, _super);
            function class_1() {
                var _this = _super.call(this, name, owner, ExtHostDiagnostics._maxDiagnosticsPerFile, _proxy, _onDidChangeDiagnostics) || this;
                _collections.set(owner, _this);
                return _this;
            }
            class_1.prototype.dispose = function () {
                _super.prototype.dispose.call(this);
                _collections.delete(owner);
            };
            return class_1;
        }(DiagnosticCollection));
        return result;
    };
    ExtHostDiagnostics.prototype.getDiagnostics = function (resource) {
        if (resource) {
            return this._getDiagnostics(resource);
        }
        else {
            var index_1 = new Map();
            var res_1 = [];
            this._collections.forEach(function (collection) {
                collection.forEach(function (uri, diagnostics) {
                    var _a;
                    var idx = index_1.get(uri.toString());
                    if (typeof idx === 'undefined') {
                        idx = res_1.length;
                        index_1.set(uri.toString(), idx);
                        res_1.push([uri, []]);
                    }
                    res_1[idx][1] = (_a = res_1[idx][1]).concat.apply(_a, diagnostics);
                });
            });
            return res_1;
        }
    };
    ExtHostDiagnostics.prototype._getDiagnostics = function (resource) {
        var res = [];
        this._collections.forEach(function (collection) {
            if (collection.has(resource)) {
                res = res.concat(collection.get(resource));
            }
        });
        return res;
    };
    ExtHostDiagnostics._idPool = 0;
    ExtHostDiagnostics._maxDiagnosticsPerFile = 1000;
    return ExtHostDiagnostics;
}());
export { ExtHostDiagnostics };
