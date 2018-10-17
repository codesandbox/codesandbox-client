/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import * as fs from '../../../fs.js';
import { dirname, basename } from '../../../path.js';
import * as objects from '../common/objects.js';
import { dispose } from '../common/lifecycle.js';
import { Emitter } from '../common/event.js';
import * as json from '../common/json.js';
import * as extfs from './extfs.js';
import { isWindows } from '../common/platform.js';
/**
 * A simple helper to watch a configured file for changes and process its contents as JSON object.
 * Supports:
 * - comments in JSON files and errors
 * - symlinks for the config file itself
 * - delayed processing of changes to accomodate for lots of changes
 * - configurable defaults
 */
var ConfigWatcher = /** @class */ (function () {
    function ConfigWatcher(_path, options) {
        if (options === void 0) { options = { changeBufferDelay: 0, defaultConfig: Object.create(null), onError: function (error) { return console.error(error); } }; }
        this._path = _path;
        this.options = options;
        this.disposables = [];
        this.configName = basename(this._path);
        this._onDidUpdateConfiguration = new Emitter();
        this.disposables.push(this._onDidUpdateConfiguration);
        this.registerWatcher();
        this.initAsync();
    }
    Object.defineProperty(ConfigWatcher.prototype, "path", {
        get: function () {
            return this._path;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConfigWatcher.prototype, "hasParseErrors", {
        get: function () {
            return this.parseErrors && this.parseErrors.length > 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConfigWatcher.prototype, "onDidUpdateConfiguration", {
        get: function () {
            return this._onDidUpdateConfiguration.event;
        },
        enumerable: true,
        configurable: true
    });
    ConfigWatcher.prototype.initAsync = function () {
        var _this = this;
        this.loadAsync(function (config) {
            if (!_this.loaded) {
                _this.updateCache(config); // prevent race condition if config was loaded sync already
            }
            if (_this.options.initCallback) {
                _this.options.initCallback(_this.getConfig());
            }
        });
    };
    ConfigWatcher.prototype.updateCache = function (value) {
        this.cache = value;
        this.loaded = true;
    };
    ConfigWatcher.prototype.loadSync = function () {
        try {
            return this.parse(fs.readFileSync(this._path).toString());
        }
        catch (error) {
            return this.options.defaultConfig;
        }
    };
    ConfigWatcher.prototype.loadAsync = function (callback) {
        var _this = this;
        fs.readFile(this._path, function (error, raw) {
            if (error) {
                return callback(_this.options.defaultConfig);
            }
            return callback(_this.parse(raw.toString()));
        });
    };
    ConfigWatcher.prototype.parse = function (raw) {
        var res;
        try {
            this.parseErrors = [];
            res = this.options.parse ? this.options.parse(raw, this.parseErrors) : json.parse(raw, this.parseErrors);
        }
        catch (error) {
            // Ignore parsing errors
        }
        return res || this.options.defaultConfig;
    };
    ConfigWatcher.prototype.registerWatcher = function () {
        var _this = this;
        // Watch the parent of the path so that we detect ADD and DELETES
        var parentFolder = dirname(this._path);
        this.watch(parentFolder, true);
        // Check if the path is a symlink and watch its target if so
        fs.lstat(this._path, function (err, stat) {
            if (err || stat.isDirectory()) {
                return; // path is not a valid file
            }
            // We found a symlink
            if (stat.isSymbolicLink()) {
                fs.readlink(_this._path, function (err, realPath) {
                    if (err) {
                        return; // path is not a valid symlink
                    }
                    _this.watch(realPath, false);
                });
            }
        });
    };
    ConfigWatcher.prototype.watch = function (path, isParentFolder) {
        var _this = this;
        if (this.disposed) {
            return; // avoid watchers that will never get disposed by checking for being disposed
        }
        this.disposables.push(extfs.watch(path, function (type, file) { return _this.onConfigFileChange(type, file, isParentFolder); }, function (error) { return _this.options.onError(error); }));
    };
    ConfigWatcher.prototype.onConfigFileChange = function (eventType, filename, isParentFolder) {
        var _this = this;
        if (isParentFolder) {
            // Windows: in some cases the filename contains artifacts from the absolute path
            // see https://github.com/nodejs/node/issues/19170
            // As such, we have to ensure that the filename basename is used for comparison.
            if (isWindows && filename && filename !== this.configName) {
                filename = basename(filename);
            }
            if (filename !== this.configName) {
                return; // a change to a sibling file that is not our config file
            }
        }
        if (this.timeoutHandle) {
            global.clearTimeout(this.timeoutHandle);
            this.timeoutHandle = null;
        }
        // we can get multiple change events for one change, so we buffer through a timeout
        this.timeoutHandle = global.setTimeout(function () { return _this.reload(); }, this.options.changeBufferDelay);
    };
    ConfigWatcher.prototype.reload = function (callback) {
        var _this = this;
        this.loadAsync(function (currentConfig) {
            if (!objects.equals(currentConfig, _this.cache)) {
                _this.updateCache(currentConfig);
                _this._onDidUpdateConfiguration.fire({ config: _this.cache });
            }
            if (callback) {
                return callback(currentConfig);
            }
        });
    };
    ConfigWatcher.prototype.getConfig = function () {
        this.ensureLoaded();
        return this.cache;
    };
    ConfigWatcher.prototype.getValue = function (key, fallback) {
        this.ensureLoaded();
        if (!key) {
            return fallback;
        }
        var value = this.cache ? this.cache[key] : void 0;
        return typeof value !== 'undefined' ? value : fallback;
    };
    ConfigWatcher.prototype.ensureLoaded = function () {
        if (!this.loaded) {
            this.updateCache(this.loadSync());
        }
    };
    ConfigWatcher.prototype.dispose = function () {
        this.disposed = true;
        this.disposables = dispose(this.disposables);
    };
    return ConfigWatcher;
}());
export { ConfigWatcher };
