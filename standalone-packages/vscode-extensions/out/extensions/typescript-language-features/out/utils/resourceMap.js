"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceMap = void 0;
const fileSchemes = require("../utils/fileSchemes");
/**
 * Maps of file resources
 *
 * Attempts to handle correct mapping on both case sensitive and case in-sensitive
 * file systems.
 */
class ResourceMap {
    constructor(_normalizePath = ResourceMap.defaultPathNormalizer, config) {
        this._normalizePath = _normalizePath;
        this.config = config;
        this._map = new Map();
    }
    get size() {
        return this._map.size;
    }
    has(resource) {
        const file = this.toKey(resource);
        return !!file && this._map.has(file);
    }
    get(resource) {
        const file = this.toKey(resource);
        if (!file) {
            return undefined;
        }
        const entry = this._map.get(file);
        return entry ? entry.value : undefined;
    }
    set(resource, value) {
        const file = this.toKey(resource);
        if (!file) {
            return;
        }
        const entry = this._map.get(file);
        if (entry) {
            entry.value = value;
        }
        else {
            this._map.set(file, { resource, value });
        }
    }
    delete(resource) {
        const file = this.toKey(resource);
        if (file) {
            this._map.delete(file);
        }
    }
    clear() {
        this._map.clear();
    }
    get values() {
        return Array.from(this._map.values(), x => x.value);
    }
    get entries() {
        return this._map.values();
    }
    toKey(resource) {
        const key = this._normalizePath(resource);
        if (!key) {
            return key;
        }
        return this.isCaseInsensitivePath(key) ? key.toLowerCase() : key;
    }
    isCaseInsensitivePath(path) {
        if (isWindowsPath(path)) {
            return true;
        }
        return path[0] === '/' && this.config.onCaseInsensitiveFileSystem;
    }
}
exports.ResourceMap = ResourceMap;
ResourceMap.defaultPathNormalizer = (resource) => {
    if (resource.scheme === fileSchemes.file) {
        return resource.fsPath;
    }
    return resource.toString(true);
};
function isWindowsPath(path) {
    return /^[a-zA-Z]:[\/\\]/.test(path);
}
//# sourceMappingURL=resourceMap.js.map