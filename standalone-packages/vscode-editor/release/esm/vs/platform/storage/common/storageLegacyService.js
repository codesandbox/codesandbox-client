/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as types from '../../../base/common/types.js';
import * as errors from '../../../base/common/errors.js';
import * as strings from '../../../base/common/strings.js';
import * as perf from '../../../base/common/performance.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
export var ID = 'storageLegacyService';
export var IStorageLegacyService = createDecorator(ID);
var StorageLegacyService = /** @class */ (function () {
    function StorageLegacyService(globalStorage, workspaceStorage, workspaceId, legacyWorkspaceId) {
        this._globalStorage = globalStorage;
        this._workspaceStorage = workspaceStorage || globalStorage;
        this.setWorkspaceId(workspaceId, legacyWorkspaceId);
    }
    Object.defineProperty(StorageLegacyService.prototype, "workspaceId", {
        get: function () {
            return this._workspaceId;
        },
        enumerable: true,
        configurable: true
    });
    StorageLegacyService.prototype.setWorkspaceId = function (workspaceId, legacyWorkspaceId) {
        this._workspaceId = workspaceId;
        // Calculate workspace storage key
        this.workspaceKey = this.getWorkspaceKey(workspaceId);
        // Make sure to delete all workspace storage if the workspace has been recreated meanwhile
        // which is only possible if a id property is provided that we can check on
        if (types.isNumber(legacyWorkspaceId)) {
            this.cleanupWorkspaceScope(legacyWorkspaceId);
        }
        else {
            // ensure that we always store a workspace identifier because this key
            // is used to migrate data out as needed
            var workspaceIdentifier = this.getInteger(StorageLegacyService.WORKSPACE_IDENTIFIER, 1 /* WORKSPACE */);
            if (!workspaceIdentifier) {
                this.store(StorageLegacyService.WORKSPACE_IDENTIFIER, 42, 1 /* WORKSPACE */);
            }
        }
    };
    Object.defineProperty(StorageLegacyService.prototype, "globalStorage", {
        get: function () {
            return this._globalStorage;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StorageLegacyService.prototype, "workspaceStorage", {
        get: function () {
            return this._workspaceStorage;
        },
        enumerable: true,
        configurable: true
    });
    StorageLegacyService.prototype.getWorkspaceKey = function (id) {
        if (!id) {
            return StorageLegacyService.NO_WORKSPACE_IDENTIFIER;
        }
        // Special case file:// URIs: strip protocol from key to produce shorter key
        var fileProtocol = 'file:///';
        if (id.indexOf(fileProtocol) === 0) {
            id = id.substr(fileProtocol.length);
        }
        // Always end with "/"
        return strings.rtrim(id, '/') + "/";
    };
    StorageLegacyService.prototype.cleanupWorkspaceScope = function (workspaceUid) {
        var _this = this;
        // Get stored identifier from storage
        perf.mark('willReadWorkspaceIdentifier');
        var id = this.getInteger(StorageLegacyService.WORKSPACE_IDENTIFIER, 1 /* WORKSPACE */);
        perf.mark('didReadWorkspaceIdentifier');
        // If identifier differs, assume the workspace got recreated and thus clean all storage for this workspace
        if (types.isNumber(id) && workspaceUid !== id) {
            var keyPrefix = this.toStorageKey('', 1 /* WORKSPACE */);
            var toDelete = [];
            var length_1 = this._workspaceStorage.length;
            for (var i = 0; i < length_1; i++) {
                var key = this._workspaceStorage.key(i);
                if (!key || key.indexOf(StorageLegacyService.WORKSPACE_PREFIX) < 0) {
                    continue; // ignore stored things that don't belong to storage service or are defined globally
                }
                // Check for match on prefix
                if (key.indexOf(keyPrefix) === 0) {
                    toDelete.push(key);
                }
            }
            // Run the delete
            toDelete.forEach(function (keyToDelete) {
                _this._workspaceStorage.removeItem(keyToDelete);
            });
        }
        // Store workspace identifier now
        if (workspaceUid !== id) {
            this.store(StorageLegacyService.WORKSPACE_IDENTIFIER, workspaceUid, 1 /* WORKSPACE */);
        }
    };
    StorageLegacyService.prototype.store = function (key, value, scope) {
        if (scope === void 0) { scope = 0 /* GLOBAL */; }
        var storage = (scope === 0 /* GLOBAL */) ? this._globalStorage : this._workspaceStorage;
        if (types.isUndefinedOrNull(value)) {
            this.remove(key, scope); // we cannot store null or undefined, in that case we remove the key
            return;
        }
        var storageKey = this.toStorageKey(key, scope);
        // Store
        try {
            storage.setItem(storageKey, value);
        }
        catch (error) {
            errors.onUnexpectedError(error);
        }
    };
    StorageLegacyService.prototype.get = function (key, scope, defaultValue) {
        if (scope === void 0) { scope = 0 /* GLOBAL */; }
        var storage = (scope === 0 /* GLOBAL */) ? this._globalStorage : this._workspaceStorage;
        var value = storage.getItem(this.toStorageKey(key, scope));
        if (types.isUndefinedOrNull(value)) {
            return defaultValue;
        }
        return value;
    };
    StorageLegacyService.prototype.getInteger = function (key, scope, defaultValue) {
        if (scope === void 0) { scope = 0 /* GLOBAL */; }
        if (defaultValue === void 0) { defaultValue = 0; }
        var value = this.get(key, scope, defaultValue);
        if (types.isUndefinedOrNull(value)) {
            return defaultValue;
        }
        return parseInt(value, 10);
    };
    StorageLegacyService.prototype.getBoolean = function (key, scope, defaultValue) {
        if (scope === void 0) { scope = 0 /* GLOBAL */; }
        if (defaultValue === void 0) { defaultValue = false; }
        var value = this.get(key, scope, defaultValue);
        if (types.isUndefinedOrNull(value)) {
            return defaultValue;
        }
        if (types.isString(value)) {
            return value.toLowerCase() === 'true' ? true : false;
        }
        return value ? true : false;
    };
    StorageLegacyService.prototype.remove = function (key, scope) {
        if (scope === void 0) { scope = 0 /* GLOBAL */; }
        var storage = (scope === 0 /* GLOBAL */) ? this._globalStorage : this._workspaceStorage;
        var storageKey = this.toStorageKey(key, scope);
        // Remove
        storage.removeItem(storageKey);
    };
    StorageLegacyService.prototype.toStorageKey = function (key, scope) {
        if (scope === 0 /* GLOBAL */) {
            return StorageLegacyService.GLOBAL_PREFIX + key.toLowerCase();
        }
        return StorageLegacyService.WORKSPACE_PREFIX + this.workspaceKey + key.toLowerCase();
    };
    StorageLegacyService.COMMON_PREFIX = 'storage://';
    StorageLegacyService.GLOBAL_PREFIX = StorageLegacyService.COMMON_PREFIX + "global/";
    StorageLegacyService.WORKSPACE_PREFIX = StorageLegacyService.COMMON_PREFIX + "workspace/";
    StorageLegacyService.WORKSPACE_IDENTIFIER = 'workspaceidentifier';
    StorageLegacyService.NO_WORKSPACE_IDENTIFIER = '__$noWorkspace__';
    return StorageLegacyService;
}());
export { StorageLegacyService };
var InMemoryLocalStorage = /** @class */ (function () {
    function InMemoryLocalStorage() {
        this.store = {};
    }
    Object.defineProperty(InMemoryLocalStorage.prototype, "length", {
        get: function () {
            return Object.keys(this.store).length;
        },
        enumerable: true,
        configurable: true
    });
    InMemoryLocalStorage.prototype.key = function (index) {
        var keys = Object.keys(this.store);
        if (keys.length > index) {
            return keys[index];
        }
        return null;
    };
    InMemoryLocalStorage.prototype.setItem = function (key, value) {
        this.store[key] = value.toString();
    };
    InMemoryLocalStorage.prototype.getItem = function (key) {
        var item = this.store[key];
        if (!types.isUndefinedOrNull(item)) {
            return item;
        }
        return null;
    };
    InMemoryLocalStorage.prototype.removeItem = function (key) {
        delete this.store[key];
    };
    return InMemoryLocalStorage;
}());
export { InMemoryLocalStorage };
export var inMemoryLocalStorageInstance = new InMemoryLocalStorage();
