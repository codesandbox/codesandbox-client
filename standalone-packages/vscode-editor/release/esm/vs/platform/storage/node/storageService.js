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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Disposable, dispose } from '../../../base/common/lifecycle.js';
import { Emitter } from '../../../base/common/event.js';
import { ILogService, LogLevel } from '../../log/common/log.js';
import { IEnvironmentService } from '../../environment/common/environment.js';
import { IStorageService } from '../common/storage.js';
import { Storage, NullStorage } from '../../../base/node/storage.js';
import { startsWith } from '../../../base/common/strings.js';
import { Action } from '../../../base/common/actions.js';
import { IWindowService } from '../../windows/common/windows.js';
import { localize } from '../../../nls.js';
import { mark, getDuration } from '../../../base/common/performance.js';
import { join, basename } from '../../../../path.js';
import { copy } from '../../../base/node/pfs.js';
var StorageService = /** @class */ (function (_super) {
    __extends(StorageService, _super);
    function StorageService(workspaceStoragePath, disableGlobalStorage, logService, environmentService) {
        var _this = _super.call(this) || this;
        _this._onDidChangeStorage = _this._register(new Emitter());
        _this._onWillSaveState = _this._register(new Emitter());
        _this._hasErrors = false;
        _this.bufferedStorageErrors = [];
        _this._onStorageError = _this._register(new Emitter());
        _this.loggingOptions = {
            trace: logService.getLevel() === LogLevel.Trace,
            logTrace: function (msg) { return logService.trace(msg); },
            logError: function (error) {
                logService.error(error);
                _this._hasErrors = true;
                if (Array.isArray(_this.bufferedStorageErrors)) {
                    _this.bufferedStorageErrors.push(error);
                }
                else {
                    _this._onStorageError.fire(error);
                }
            }
        };
        _this.globalStorageWorkspacePath = workspaceStoragePath === StorageService.IN_MEMORY_PATH ? StorageService.IN_MEMORY_PATH : StorageService.IN_MEMORY_PATH;
        _this.globalStorage = disableGlobalStorage ? new NullStorage() : new Storage({ path: _this.globalStorageWorkspacePath, logging: _this.loggingOptions });
        _this._register(_this.globalStorage.onDidChangeStorage(function (key) { return _this.handleDidChangeStorage(key, 0 /* GLOBAL */); }));
        _this.createWorkspaceStorage(workspaceStoragePath);
        return _this;
    }
    Object.defineProperty(StorageService.prototype, "onDidChangeStorage", {
        get: function () { return this._onDidChangeStorage.event; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StorageService.prototype, "onWillSaveState", {
        get: function () { return this._onWillSaveState.event; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StorageService.prototype, "hasErrors", {
        get: function () { return this._hasErrors; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StorageService.prototype, "onStorageError", {
        get: function () {
            var _this = this;
            if (Array.isArray(this.bufferedStorageErrors)) {
                // todo@ben cleanup after a while
                if (this.bufferedStorageErrors.length > 0) {
                    var bufferedStorageErrors_1 = this.bufferedStorageErrors;
                    setTimeout(function () {
                        _this._onStorageError.fire("[startup errors] " + bufferedStorageErrors_1.join('\n'));
                    }, 0);
                }
                this.bufferedStorageErrors = void 0;
            }
            return this._onStorageError.event;
        },
        enumerable: true,
        configurable: true
    });
    StorageService.prototype.createWorkspaceStorage = function (workspaceStoragePath) {
        var _this = this;
        // Dispose old (if any)
        this.workspaceStorage = dispose(this.workspaceStorage);
        this.workspaceStorageListener = dispose(this.workspaceStorageListener);
        // Create new
        this.workspaceStoragePath = workspaceStoragePath;
        this.workspaceStorage = new Storage({ path: workspaceStoragePath, logging: this.loggingOptions });
        this.workspaceStorageListener = this.workspaceStorage.onDidChangeStorage(function (key) { return _this.handleDidChangeStorage(key, 1 /* WORKSPACE */); });
    };
    StorageService.prototype.handleDidChangeStorage = function (key, scope) {
        this._onDidChangeStorage.fire({ key: key, scope: scope });
    };
    StorageService.prototype.init = function () {
        var _this = this;
        mark('willInitWorkspaceStorage');
        return this.workspaceStorage.init().then(function () {
            mark('didInitWorkspaceStorage');
            mark('willInitGlobalStorage');
            return _this.globalStorage.init().then(function () {
                mark('didInitGlobalStorage');
            });
        });
    };
    StorageService.prototype.get = function (key, scope, fallbackValue) {
        return this.getStorage(scope).get(key, fallbackValue);
    };
    StorageService.prototype.getBoolean = function (key, scope, fallbackValue) {
        return this.getStorage(scope).getBoolean(key, fallbackValue);
    };
    StorageService.prototype.getInteger = function (key, scope, fallbackValue) {
        return this.getStorage(scope).getInteger(key, fallbackValue);
    };
    StorageService.prototype.store = function (key, value, scope) {
        this.getStorage(scope).set(key, value);
    };
    StorageService.prototype.remove = function (key, scope) {
        this.getStorage(scope).delete(key);
    };
    StorageService.prototype.close = function () {
        // Signal as event so that clients can still store data
        this._onWillSaveState.fire();
        // Do it
        return Promise.all([
            this.globalStorage.close(),
            this.workspaceStorage.close()
        ]).then(function () { return void 0; });
    };
    StorageService.prototype.getStorage = function (scope) {
        return scope === 0 /* GLOBAL */ ? this.globalStorage : this.workspaceStorage;
    };
    StorageService.prototype.getSize = function (scope) {
        return scope === 0 /* GLOBAL */ ? this.globalStorage.size : this.workspaceStorage.size;
    };
    StorageService.prototype.checkIntegrity = function (scope, full) {
        return scope === 0 /* GLOBAL */ ? this.globalStorage.checkIntegrity(full) : this.workspaceStorage.checkIntegrity(full);
    };
    StorageService.prototype.logStorage = function () {
        var _this = this;
        return Promise.all([
            this.globalStorage.getItems(),
            this.workspaceStorage.getItems(),
            this.globalStorage.checkIntegrity(true /* full */),
            this.workspaceStorage.checkIntegrity(true /* full */)
        ]).then(function (result) {
            var safeParse = function (value) {
                try {
                    return JSON.parse(value);
                }
                catch (error) {
                    return value;
                }
            };
            var globalItems = new Map();
            var globalItemsParsed = new Map();
            result[0].forEach(function (value, key) {
                globalItems.set(key, value);
                globalItemsParsed.set(key, safeParse(value));
            });
            var workspaceItems = new Map();
            var workspaceItemsParsed = new Map();
            result[1].forEach(function (value, key) {
                workspaceItems.set(key, value);
                workspaceItemsParsed.set(key, safeParse(value));
            });
            console.group("Storage: Global (integrity: " + result[2] + ", load: " + getDuration('willInitGlobalStorage', 'didInitGlobalStorage') + ", path: " + _this.globalStorageWorkspacePath + ")");
            var globalValues = [];
            globalItems.forEach(function (value, key) {
                globalValues.push({ key: key, value: value });
            });
            console.table(globalValues);
            console.groupEnd();
            console.log(globalItemsParsed);
            console.group("Storage: Workspace (integrity: " + result[3] + ", load: " + getDuration('willInitWorkspaceStorage', 'didInitWorkspaceStorage') + ", path: " + _this.workspaceStoragePath + ")");
            var workspaceValues = [];
            workspaceItems.forEach(function (value, key) {
                workspaceValues.push({ key: key, value: value });
            });
            console.table(workspaceValues);
            console.groupEnd();
            console.log(workspaceItemsParsed);
        });
    };
    StorageService.prototype.migrate = function (toWorkspaceStorageFolder) {
        var _this = this;
        if (this.workspaceStoragePath === StorageService.IN_MEMORY_PATH) {
            return Promise.resolve(); // no migration needed if running in memory
        }
        // Compute new workspace storage path based on workspace identifier
        var newWorkspaceStoragePath = join(toWorkspaceStorageFolder, basename(this.workspaceStoragePath));
        if (this.workspaceStoragePath === newWorkspaceStoragePath) {
            return Promise.resolve(); // guard against migrating to same path
        }
        // Close workspace DB to be able to copy
        return this.workspaceStorage.close().then(function () {
            return copy(_this.workspaceStoragePath, newWorkspaceStoragePath).then(function () {
                _this.createWorkspaceStorage(newWorkspaceStoragePath);
                return _this.workspaceStorage.init();
            });
        });
    };
    StorageService.IN_MEMORY_PATH = ':memory:';
    StorageService = __decorate([
        __param(2, ILogService),
        __param(3, IEnvironmentService)
    ], StorageService);
    return StorageService;
}(Disposable));
export { StorageService };
var LogStorageAction = /** @class */ (function (_super) {
    __extends(LogStorageAction, _super);
    function LogStorageAction(id, label, storageService, windowService) {
        var _this = _super.call(this, id, label) || this;
        _this.storageService = storageService;
        _this.windowService = windowService;
        return _this;
    }
    LogStorageAction.prototype.run = function () {
        this.storageService.storage.logStorage();
        return this.windowService.openDevTools();
    };
    LogStorageAction.ID = 'workbench.action.logStorage';
    LogStorageAction.LABEL = localize({ key: 'logStorage', comment: ['A developer only action to log the contents of the storage for the current window.'] }, "Log Storage Database Contents");
    LogStorageAction = __decorate([
        __param(2, IStorageService),
        __param(3, IWindowService)
    ], LogStorageAction);
    return LogStorageAction;
}(Action));
export { LogStorageAction };
var DelegatingStorageService = /** @class */ (function (_super) {
    __extends(DelegatingStorageService, _super);
    function DelegatingStorageService(storageService, storageLegacyService, logService, configurationService) {
        var _this = _super.call(this) || this;
        _this.storageService = storageService;
        _this.storageLegacyService = storageLegacyService;
        _this.logService = logService;
        _this._onDidChangeStorage = _this._register(new Emitter());
        _this._onWillSaveState = _this._register(new Emitter());
        _this.useLegacyWorkspaceStorage = configurationService.inspect('workbench.enableLegacyStorage').value === true;
        _this.registerListeners();
        return _this;
    }
    Object.defineProperty(DelegatingStorageService.prototype, "onDidChangeStorage", {
        get: function () { return this._onDidChangeStorage.event; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DelegatingStorageService.prototype, "onWillSaveState", {
        get: function () { return this._onWillSaveState.event; },
        enumerable: true,
        configurable: true
    });
    DelegatingStorageService.prototype.registerListeners = function () {
        var _this = this;
        this._register(this.storageService.onDidChangeStorage(function (e) { return _this._onDidChangeStorage.fire(e); }));
        this._register(this.storageService.onWillSaveState(function () { return _this._onWillSaveState.fire(); }));
        var globalKeyMarker = 'storage://global/';
        window.addEventListener('storage', function (e) {
            if (e.key && startsWith(e.key, globalKeyMarker)) {
                var key = e.key.substr(globalKeyMarker.length);
                _this._onDidChangeStorage.fire({ key: key, scope: 0 /* GLOBAL */ });
            }
        });
    };
    Object.defineProperty(DelegatingStorageService.prototype, "storage", {
        get: function () {
            return this.storageService;
        },
        enumerable: true,
        configurable: true
    });
    DelegatingStorageService.prototype.get = function (key, scope, fallbackValue) {
        if (scope === 1 /* WORKSPACE */ && !this.useLegacyWorkspaceStorage) {
            return this.storageService.get(key, scope, fallbackValue);
        }
        return this.storageLegacyService.get(key, this.convertScope(scope), fallbackValue);
    };
    DelegatingStorageService.prototype.getBoolean = function (key, scope, fallbackValue) {
        if (scope === 1 /* WORKSPACE */ && !this.useLegacyWorkspaceStorage) {
            return this.storageService.getBoolean(key, scope, fallbackValue);
        }
        return this.storageLegacyService.getBoolean(key, this.convertScope(scope), fallbackValue);
    };
    DelegatingStorageService.prototype.getInteger = function (key, scope, fallbackValue) {
        if (scope === 1 /* WORKSPACE */ && !this.useLegacyWorkspaceStorage) {
            return this.storageService.getInteger(key, scope, fallbackValue);
        }
        return this.storageLegacyService.getInteger(key, this.convertScope(scope), fallbackValue);
    };
    DelegatingStorageService.prototype.store = function (key, value, scope) {
        if (this.closed) {
            this.logService.warn("Unsupported write (store) access after close (key: " + key + ")");
            return; // prevent writing after close to detect late write access
        }
        this.storageLegacyService.store(key, value, this.convertScope(scope));
        this.storageService.store(key, value, scope);
    };
    DelegatingStorageService.prototype.remove = function (key, scope) {
        if (this.closed) {
            this.logService.warn("Unsupported write (remove) access after close (key: " + key + ")");
            return; // prevent writing after close to detect late write access
        }
        this.storageLegacyService.remove(key, this.convertScope(scope));
        this.storageService.remove(key, scope);
    };
    DelegatingStorageService.prototype.close = function () {
        var promise = this.storage.close();
        this.closed = true;
        return promise;
    };
    DelegatingStorageService.prototype.convertScope = function (scope) {
        return scope === 0 /* GLOBAL */ ? 0 /* GLOBAL */ : 1 /* WORKSPACE */;
    };
    return DelegatingStorageService;
}(Disposable));
export { DelegatingStorageService };
