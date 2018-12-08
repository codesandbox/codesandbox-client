/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { flatten } from '../../../base/common/arrays.js';
import { AsyncEmitter, Emitter } from '../../../base/common/event.js';
import { parse } from '../../../base/common/glob.js';
import { URI } from '../../../base/common/uri.js';
import { MainContext } from './extHost.protocol.js';
import * as typeConverter from './extHostTypeConverters.js';
import { Disposable, WorkspaceEdit } from './extHostTypes.js';
var FileSystemWatcher = /** @class */ (function () {
    function FileSystemWatcher(dispatcher, globPattern, ignoreCreateEvents, ignoreChangeEvents, ignoreDeleteEvents) {
        var _this = this;
        this._onDidCreate = new Emitter();
        this._onDidChange = new Emitter();
        this._onDidDelete = new Emitter();
        this._config = 0;
        if (ignoreCreateEvents) {
            this._config += 1;
        }
        if (ignoreChangeEvents) {
            this._config += 2;
        }
        if (ignoreDeleteEvents) {
            this._config += 4;
        }
        var parsedPattern = parse(globPattern);
        var subscription = dispatcher(function (events) {
            if (!ignoreCreateEvents) {
                for (var _i = 0, _a = events.created; _i < _a.length; _i++) {
                    var created = _a[_i];
                    var uri = URI.revive(created);
                    if (parsedPattern(uri.fsPath)) {
                        _this._onDidCreate.fire(uri);
                    }
                }
            }
            if (!ignoreChangeEvents) {
                for (var _b = 0, _c = events.changed; _b < _c.length; _b++) {
                    var changed = _c[_b];
                    var uri = URI.revive(changed);
                    if (parsedPattern(uri.fsPath)) {
                        _this._onDidChange.fire(uri);
                    }
                }
            }
            if (!ignoreDeleteEvents) {
                for (var _d = 0, _e = events.deleted; _d < _e.length; _d++) {
                    var deleted = _e[_d];
                    var uri = URI.revive(deleted);
                    if (parsedPattern(uri.fsPath)) {
                        _this._onDidDelete.fire(uri);
                    }
                }
            }
        });
        this._disposable = Disposable.from(this._onDidCreate, this._onDidChange, this._onDidDelete, subscription);
    }
    Object.defineProperty(FileSystemWatcher.prototype, "ignoreCreateEvents", {
        get: function () {
            return Boolean(this._config & 1);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FileSystemWatcher.prototype, "ignoreChangeEvents", {
        get: function () {
            return Boolean(this._config & 2);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FileSystemWatcher.prototype, "ignoreDeleteEvents", {
        get: function () {
            return Boolean(this._config & 4);
        },
        enumerable: true,
        configurable: true
    });
    FileSystemWatcher.prototype.dispose = function () {
        this._disposable.dispose();
    };
    Object.defineProperty(FileSystemWatcher.prototype, "onDidCreate", {
        get: function () {
            return this._onDidCreate.event;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FileSystemWatcher.prototype, "onDidChange", {
        get: function () {
            return this._onDidChange.event;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FileSystemWatcher.prototype, "onDidDelete", {
        get: function () {
            return this._onDidDelete.event;
        },
        enumerable: true,
        configurable: true
    });
    return FileSystemWatcher;
}());
var ExtHostFileSystemEventService = /** @class */ (function () {
    function ExtHostFileSystemEventService(mainContext, _extHostDocumentsAndEditors, _mainThreadTextEditors) {
        if (_mainThreadTextEditors === void 0) { _mainThreadTextEditors = mainContext.getProxy(MainContext.MainThreadTextEditors); }
        this._extHostDocumentsAndEditors = _extHostDocumentsAndEditors;
        this._mainThreadTextEditors = _mainThreadTextEditors;
        this._onFileEvent = new Emitter();
        this._onDidRenameFile = new Emitter();
        this._onWillRenameFile = new AsyncEmitter();
        this.onDidRenameFile = this._onDidRenameFile.event;
        //
    }
    ExtHostFileSystemEventService.prototype.createFileSystemWatcher = function (globPattern, ignoreCreateEvents, ignoreChangeEvents, ignoreDeleteEvents) {
        return new FileSystemWatcher(this._onFileEvent.event, globPattern, ignoreCreateEvents, ignoreChangeEvents, ignoreDeleteEvents);
    };
    ExtHostFileSystemEventService.prototype.$onFileEvent = function (events) {
        this._onFileEvent.fire(events);
    };
    ExtHostFileSystemEventService.prototype.$onFileRename = function (oldUri, newUri) {
        this._onDidRenameFile.fire(Object.freeze({ oldUri: URI.revive(oldUri), newUri: URI.revive(newUri) }));
    };
    ExtHostFileSystemEventService.prototype.getOnWillRenameFileEvent = function (extension) {
        var _this = this;
        return function (listener, thisArg, disposables) {
            var wrappedListener = function () {
                listener.apply(thisArg, arguments);
            };
            wrappedListener.extension = extension;
            return _this._onWillRenameFile.event(wrappedListener, undefined, disposables);
        };
    };
    ExtHostFileSystemEventService.prototype.$onWillRename = function (oldUriDto, newUriDto) {
        var _this = this;
        var oldUri = URI.revive(oldUriDto);
        var newUri = URI.revive(newUriDto);
        var edits = [];
        return Promise.resolve(this._onWillRenameFile.fireAsync(function (bucket, _listener) {
            return {
                oldUri: oldUri,
                newUri: newUri,
                waitUntil: function (thenable) {
                    if (Object.isFrozen(bucket)) {
                        throw new TypeError('waitUntil cannot be called async');
                    }
                    var index = bucket.length;
                    var wrappedThenable = Promise.resolve(thenable).then(function (result) {
                        // ignore all results except for WorkspaceEdits. Those
                        // are stored in a spare array
                        if (result instanceof WorkspaceEdit) {
                            edits[index] = result;
                        }
                    });
                    bucket.push(wrappedThenable);
                }
            };
        }).then(function () {
            if (edits.length === 0) {
                return undefined;
            }
            // flatten all WorkspaceEdits collected via waitUntil-call
            // and apply them in one go.
            var allEdits = new Array();
            for (var _i = 0, edits_1 = edits; _i < edits_1.length; _i++) {
                var edit = edits_1[_i];
                if (edit) { // sparse array
                    var edits_2 = typeConverter.WorkspaceEdit.from(edit, _this._extHostDocumentsAndEditors).edits;
                    allEdits.push(edits_2);
                }
            }
            return _this._mainThreadTextEditors.$tryApplyWorkspaceEdit({ edits: flatten(allEdits) });
        }));
    };
    return ExtHostFileSystemEventService;
}());
export { ExtHostFileSystemEventService };
