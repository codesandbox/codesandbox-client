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
import { Disposable } from '../common/lifecycle.js';
import { Emitter, Event } from '../common/event.js';
import { ThrottledDelayer, timeout } from '../common/async.js';
import { isUndefinedOrNull } from '../common/types.js';
import { mapToString, setToString } from '../common/map.js';
import { basename } from '../../../path.js';
import { mark } from '../common/performance.js';
import { rename } from './pfs.js';
var StorageState;
(function (StorageState) {
    StorageState[StorageState["None"] = 0] = "None";
    StorageState[StorageState["Initialized"] = 1] = "Initialized";
    StorageState[StorageState["Closed"] = 2] = "Closed";
})(StorageState || (StorageState = {}));
var Storage = /** @class */ (function (_super) {
    __extends(Storage, _super);
    function Storage(options) {
        var _this = _super.call(this) || this;
        _this._onDidChangeStorage = _this._register(new Emitter());
        _this.state = StorageState.None;
        _this.cache = new Map();
        _this.pendingDeletes = new Set();
        _this.pendingInserts = new Map();
        _this.storage = new SQLiteStorageImpl(options);
        _this.flushDelayer = _this._register(new ThrottledDelayer(Storage.FLUSH_DELAY));
        return _this;
    }
    Object.defineProperty(Storage.prototype, "onDidChangeStorage", {
        get: function () { return this._onDidChangeStorage.event; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Storage.prototype, "size", {
        get: function () {
            return this.cache.size;
        },
        enumerable: true,
        configurable: true
    });
    Storage.prototype.init = function () {
        var _this = this;
        if (this.state !== StorageState.None) {
            return Promise.resolve(); // either closed or already initialized
        }
        this.state = StorageState.Initialized;
        return this.storage.getItems().then(function (items) {
            _this.cache = items;
        });
    };
    Storage.prototype.get = function (key, fallbackValue) {
        var value = this.cache.get(key);
        if (isUndefinedOrNull(value)) {
            return fallbackValue;
        }
        return value;
    };
    Storage.prototype.getBoolean = function (key, fallbackValue) {
        var value = this.get(key);
        if (isUndefinedOrNull(value)) {
            return fallbackValue;
        }
        return value === 'true';
    };
    Storage.prototype.getInteger = function (key, fallbackValue) {
        var value = this.get(key);
        if (isUndefinedOrNull(value)) {
            return fallbackValue;
        }
        return parseInt(value, 10);
    };
    Storage.prototype.set = function (key, value) {
        var _this = this;
        if (this.state === StorageState.Closed) {
            return Promise.resolve(); // Return early if we are already closed
        }
        // We remove the key for undefined/null values
        if (isUndefinedOrNull(value)) {
            return this.delete(key);
        }
        // Otherwise, convert to String and store
        var valueStr = String(value);
        // Return early if value already set
        var currentValue = this.cache.get(key);
        if (currentValue === valueStr) {
            return Promise.resolve();
        }
        // Update in cache and pending
        this.cache.set(key, valueStr);
        this.pendingInserts.set(key, valueStr);
        this.pendingDeletes.delete(key);
        // Event
        this._onDidChangeStorage.fire(key);
        // Accumulate work by scheduling after timeout
        return this.flushDelayer.trigger(function () { return _this.flushPending(); });
    };
    Storage.prototype.delete = function (key) {
        var _this = this;
        if (this.state === StorageState.Closed) {
            return Promise.resolve(); // Return early if we are already closed
        }
        // Remove from cache and add to pending
        var wasDeleted = this.cache.delete(key);
        if (!wasDeleted) {
            return Promise.resolve(); // Return early if value already deleted
        }
        if (!this.pendingDeletes.has(key)) {
            this.pendingDeletes.add(key);
        }
        this.pendingInserts.delete(key);
        // Event
        this._onDidChangeStorage.fire(key);
        // Accumulate work by scheduling after timeout
        return this.flushDelayer.trigger(function () { return _this.flushPending(); });
    };
    Storage.prototype.close = function () {
        var _this = this;
        if (this.state === StorageState.Closed) {
            return Promise.resolve(); // return if already closed
        }
        // Update state
        this.state = StorageState.Closed;
        // Trigger new flush to ensure data is persisted and then close
        // even if there is an error flushing. We must always ensure
        // the DB is closed to avoid corruption.
        var onDone = function () { return _this.storage.close(); };
        return this.flushDelayer.trigger(function () { return _this.flushPending(); }, 0 /* immediately */).then(onDone, onDone);
    };
    Storage.prototype.flushPending = function () {
        // Get pending data
        var updateRequest = { insert: this.pendingInserts, delete: this.pendingDeletes };
        // Reset pending data for next run
        this.pendingDeletes = new Set();
        this.pendingInserts = new Map();
        // Update in storage
        return this.storage.updateItems(updateRequest);
    };
    Storage.prototype.getItems = function () {
        return this.storage.getItems();
    };
    Storage.prototype.checkIntegrity = function (full) {
        return this.storage.checkIntegrity(full);
    };
    Storage.FLUSH_DELAY = 100;
    return Storage;
}(Disposable));
export { Storage };
var SQLiteStorageImpl = /** @class */ (function () {
    function SQLiteStorageImpl(options) {
        this.options = options;
        this.name = basename(options.path);
        this.logger = new SQLiteStorageLogger(options.logging);
        this.db = this.open();
    }
    SQLiteStorageImpl.prototype.getItems = function () {
        var _this = this;
        return this.db.then(function (db) {
            var items = new Map();
            return _this.all(db, 'SELECT * FROM ItemTable').then(function (rows) {
                rows.forEach(function (row) { return items.set(row.key, row.value); });
                if (_this.logger.isTracing) {
                    _this.logger.trace("[storage " + _this.name + "] getItems(): " + mapToString(items));
                }
                return items;
            });
        });
    };
    SQLiteStorageImpl.prototype.updateItems = function (request) {
        var _this = this;
        var updateCount = 0;
        if (request.insert) {
            updateCount += request.insert.size;
        }
        if (request.delete) {
            updateCount += request.delete.size;
        }
        if (updateCount === 0) {
            return Promise.resolve();
        }
        if (this.logger.isTracing) {
            this.logger.trace("[storage " + this.name + "] updateItems(): insert(" + (request.insert ? mapToString(request.insert) : '0') + "), delete(" + (request.delete ? setToString(request.delete) : '0') + ")");
        }
        return this.db.then(function (db) {
            return _this.transaction(db, function () {
                if (request.insert && request.insert.size > 0) {
                    _this.prepare(db, 'INSERT INTO ItemTable VALUES (?,?)', function (stmt) {
                        request.insert.forEach(function (value, key) {
                            stmt.run([key, value]);
                        });
                    });
                }
                if (request.delete && request.delete.size) {
                    _this.prepare(db, 'DELETE FROM ItemTable WHERE key=?', function (stmt) {
                        request.delete.forEach(function (key) {
                            stmt.run(key);
                        });
                    });
                }
            });
        });
    };
    SQLiteStorageImpl.prototype.close = function () {
        var _this = this;
        this.logger.trace("[storage " + this.name + "] close()");
        return this.db.then(function (db) {
            return new Promise(function (resolve, reject) {
                db.close(function (error) {
                    if (error) {
                        _this.logger.error("[storage " + _this.name + "] close(): " + error);
                        return reject(error);
                    }
                    return resolve();
                });
            });
        });
    };
    SQLiteStorageImpl.prototype.checkIntegrity = function (full) {
        var _this = this;
        this.logger.trace("[storage " + this.name + "] checkIntegrity(full: " + full + ")");
        return this.db.then(function (db) {
            return _this.get(db, full ? 'PRAGMA integrity_check' : 'PRAGMA quick_check').then(function (row) {
                return full ? row['integrity_check'] : row['quick_check'];
            });
        });
    };
    SQLiteStorageImpl.prototype.open = function () {
        var _this = this;
        this.logger.trace("[storage " + this.name + "] open()");
        return new Promise(function (resolve, reject) {
            var fallbackToInMemoryDatabase = function (error) {
                _this.logger.error("[storage " + _this.name + "] open(): Error (open DB): " + error);
                _this.logger.error("[storage " + _this.name + "] open(): Falling back to in-memory DB");
                // In case of any error to open the DB, use an in-memory
                // DB so that we always have a valid DB to talk to.
                _this.doOpen(':memory:').then(resolve, reject);
            };
            _this.doOpen(_this.options.path).then(resolve, function (error) {
                // TODO@Ben check if this is still happening. This error code should only arise if
                // another process is locking the same DB we want to open at that time. This typically
                // never happens because a DB connection is limited per window. However, in the event
                // of a window reload, it may be possible that the previous connection was not properly
                // closed while the new connection is already established.
                if (error.code === 'SQLITE_BUSY') {
                    _this.logger.error("[storage " + _this.name + "] open(): Retrying after " + SQLiteStorageImpl.BUSY_OPEN_TIMEOUT + "ms due to SQLITE_BUSY");
                    // Retry after 2s if the DB is busy
                    timeout(SQLiteStorageImpl.BUSY_OPEN_TIMEOUT).then(function () { return _this.doOpen(_this.options.path).then(resolve, fallbackToInMemoryDatabase); });
                }
                // This error code indicates that even though the DB file exists,
                // SQLite cannot open it and signals it is corrupt or not a DB.
                else if (error.code === 'SQLITE_CORRUPT' || error.code === 'SQLITE_NOTADB') {
                    _this.logger.error("[storage " + _this.name + "] open(): Recreating DB due to " + error.code);
                    // Move corrupt DB to different filename and start fresh
                    var randomSuffix = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 4);
                    rename(_this.options.path, _this.options.path + "." + randomSuffix + ".corrupt")
                        .then(function () { return _this.doOpen(_this.options.path); }).then(resolve, fallbackToInMemoryDatabase);
                }
                // Otherwise give up and fallback to in-memory DB
                else {
                    fallbackToInMemoryDatabase(error);
                }
            });
        });
    };
    SQLiteStorageImpl.prototype.doOpen = function (path) {
        var _this = this;
        // TODO@Ben clean up performance markers
        return new Promise(function (resolve, reject) {
            var measureRequireDuration = false;
            if (!SQLiteStorageImpl.measuredRequireDuration) {
                SQLiteStorageImpl.measuredRequireDuration = true;
                measureRequireDuration = true;
                mark('willRequireSQLite');
            }
            import('vscode-sqlite3.js').then(function (sqlite3) {
                if (measureRequireDuration) {
                    mark('didRequireSQLite');
                }
                var db = new (_this.logger.isTracing ? sqlite3.verbose().Database : sqlite3.Database)(path, function (error) {
                    if (error) {
                        return reject(error);
                    }
                    // The following exec() statement serves two purposes:
                    // - create the DB if it does not exist yet
                    // - validate that the DB is not corrupt (the open() call does not throw otherwise)
                    mark('willSetupSQLiteSchema');
                    _this.exec(db, [
                        'PRAGMA user_version = 1;',
                        'CREATE TABLE IF NOT EXISTS ItemTable (key TEXT UNIQUE ON CONFLICT REPLACE, value BLOB)'
                    ].join('')).then(function () {
                        mark('didSetupSQLiteSchema');
                        resolve(db);
                    }, function (error) {
                        mark('didSetupSQLiteSchema');
                        reject(error);
                    });
                });
                // Errors
                db.on('error', function (error) { return _this.logger.error("[storage " + _this.name + "] Error (event): " + error); });
                // Tracing
                if (_this.logger.isTracing) {
                    db.on('trace', function (sql) { return _this.logger.trace("[storage " + _this.name + "] Trace (event): " + sql); });
                }
            });
        });
    };
    SQLiteStorageImpl.prototype.exec = function (db, sql) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            db.exec(sql, function (error) {
                if (error) {
                    _this.logger.error("[storage " + _this.name + "] exec(): " + error);
                    return reject(error);
                }
                return resolve();
            });
        });
    };
    SQLiteStorageImpl.prototype.get = function (db, sql) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            db.get(sql, function (error, row) {
                if (error) {
                    _this.logger.error("[storage " + _this.name + "] get(): " + error);
                    return reject(error);
                }
                return resolve(row);
            });
        });
    };
    SQLiteStorageImpl.prototype.all = function (db, sql) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            db.all(sql, function (error, rows) {
                if (error) {
                    _this.logger.error("[storage " + _this.name + "] all(): " + error);
                    return reject(error);
                }
                return resolve(rows);
            });
        });
    };
    SQLiteStorageImpl.prototype.transaction = function (db, transactions) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            db.serialize(function () {
                db.run('BEGIN TRANSACTION');
                transactions();
                db.run('END TRANSACTION', function (error) {
                    if (error) {
                        _this.logger.error("[storage " + _this.name + "] transaction(): " + error);
                        return reject(error);
                    }
                    return resolve();
                });
            });
        });
    };
    SQLiteStorageImpl.prototype.prepare = function (db, sql, runCallback) {
        var _this = this;
        var stmt = db.prepare(sql);
        var statementErrorListener = function (error) {
            _this.logger.error("[storage " + _this.name + "] prepare(): " + error + " (" + sql + ")");
        };
        stmt.on('error', statementErrorListener);
        runCallback(stmt);
        stmt.finalize(function (error) {
            if (error) {
                statementErrorListener(error);
            }
            stmt.removeListener('error', statementErrorListener);
        });
    };
    SQLiteStorageImpl.BUSY_OPEN_TIMEOUT = 2000; // timeout in ms to retry when opening DB fails with SQLITE_BUSY
    return SQLiteStorageImpl;
}());
export { SQLiteStorageImpl };
var SQLiteStorageLogger = /** @class */ (function () {
    function SQLiteStorageLogger(options) {
        this.options = options;
        this.logTrace = !!(options && options.logTrace);
        this.logError = !!(options && options.logError);
    }
    Object.defineProperty(SQLiteStorageLogger.prototype, "isTracing", {
        get: function () {
            return this.logTrace;
        },
        enumerable: true,
        configurable: true
    });
    SQLiteStorageLogger.prototype.trace = function (msg) {
        if (this.logTrace && this.options && this.options.logTrace) {
            this.options.logTrace(msg);
        }
    };
    SQLiteStorageLogger.prototype.error = function (error) {
        if (this.logError && this.options && this.options.logError) {
            this.options.logError(error);
        }
    };
    return SQLiteStorageLogger;
}());
var NullStorage = /** @class */ (function (_super) {
    __extends(NullStorage, _super);
    function NullStorage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.size = 0;
        _this.onDidChangeStorage = Event.None;
        _this.items = new Map();
        return _this;
    }
    NullStorage.prototype.init = function () { return Promise.resolve(); };
    NullStorage.prototype.get = function (key, fallbackValue) {
        return void 0;
    };
    NullStorage.prototype.getBoolean = function (key, fallbackValue) {
        return void 0;
    };
    NullStorage.prototype.getInteger = function (key, fallbackValue) {
        return void 0;
    };
    NullStorage.prototype.set = function (key, value) {
        return Promise.resolve();
    };
    NullStorage.prototype.delete = function (key) {
        return Promise.resolve();
    };
    NullStorage.prototype.close = function () {
        return Promise.resolve();
    };
    NullStorage.prototype.getItems = function () {
        return Promise.resolve(this.items);
    };
    NullStorage.prototype.checkIntegrity = function (full) {
        return Promise.resolve('ok');
    };
    return NullStorage;
}(Disposable));
export { NullStorage };
