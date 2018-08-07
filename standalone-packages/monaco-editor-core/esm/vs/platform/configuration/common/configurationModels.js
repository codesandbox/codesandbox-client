/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import * as json from '../../../base/common/json';
import { ResourceMap } from '../../../base/common/map';
import * as arrays from '../../../base/common/arrays';
import * as types from '../../../base/common/types';
import * as objects from '../../../base/common/objects';
import { OVERRIDE_PROPERTY_PATTERN } from './configurationRegistry';
import { overrideIdentifierFromKey, addToValueTree, toValuesTree, getConfigurationValue, getDefaultValues, getConfigurationKeys, removeFromValueTree, toOverrides } from './configuration';
var ConfigurationModel = /** @class */ (function () {
    function ConfigurationModel(_contents, _keys, _overrides) {
        if (_contents === void 0) { _contents = {}; }
        if (_keys === void 0) { _keys = []; }
        if (_overrides === void 0) { _overrides = []; }
        this._contents = _contents;
        this._keys = _keys;
        this._overrides = _overrides;
        this.isFrozen = false;
    }
    Object.defineProperty(ConfigurationModel.prototype, "contents", {
        get: function () {
            return this.checkAndFreeze(this._contents);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConfigurationModel.prototype, "overrides", {
        get: function () {
            return this.checkAndFreeze(this._overrides);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConfigurationModel.prototype, "keys", {
        get: function () {
            return this.checkAndFreeze(this._keys);
        },
        enumerable: true,
        configurable: true
    });
    ConfigurationModel.prototype.getValue = function (section) {
        return section ? getConfigurationValue(this.contents, section) : this.contents;
    };
    ConfigurationModel.prototype.override = function (identifier) {
        var overrideContents = this.getContentsForOverrideIdentifer(identifier);
        if (!overrideContents || typeof overrideContents !== 'object' || !Object.keys(overrideContents).length) {
            // If there are no valid overrides, return self
            return this;
        }
        var contents = {};
        for (var _i = 0, _a = arrays.distinct(Object.keys(this.contents).concat(Object.keys(overrideContents))); _i < _a.length; _i++) {
            var key = _a[_i];
            var contentsForKey = this.contents[key];
            var overrideContentsForKey = overrideContents[key];
            // If there are override contents for the key, clone and merge otherwise use base contents
            if (overrideContentsForKey) {
                // Clone and merge only if base contents and override contents are of type object otherwise just override
                if (typeof contentsForKey === 'object' && typeof overrideContentsForKey === 'object') {
                    contentsForKey = objects.deepClone(contentsForKey);
                    this.mergeContents(contentsForKey, overrideContentsForKey);
                }
                else {
                    contentsForKey = overrideContentsForKey;
                }
            }
            contents[key] = contentsForKey;
        }
        return new ConfigurationModel(contents);
    };
    ConfigurationModel.prototype.merge = function () {
        var others = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            others[_i] = arguments[_i];
        }
        var contents = objects.deepClone(this.contents);
        var overrides = objects.deepClone(this.overrides);
        var keys = this.keys.slice();
        for (var _a = 0, others_1 = others; _a < others_1.length; _a++) {
            var other = others_1[_a];
            this.mergeContents(contents, other.contents);
            var _loop_1 = function (otherOverride) {
                var override = overrides.filter(function (o) { return arrays.equals(o.identifiers, otherOverride.identifiers); })[0];
                if (override) {
                    this_1.mergeContents(override.contents, otherOverride.contents);
                }
                else {
                    overrides.push(objects.deepClone(otherOverride));
                }
            };
            var this_1 = this;
            for (var _b = 0, _c = other.overrides; _b < _c.length; _b++) {
                var otherOverride = _c[_b];
                _loop_1(otherOverride);
            }
            for (var _d = 0, _e = other.keys; _d < _e.length; _d++) {
                var key = _e[_d];
                if (keys.indexOf(key) === -1) {
                    keys.push(key);
                }
            }
        }
        return new ConfigurationModel(contents, keys, overrides);
    };
    ConfigurationModel.prototype.freeze = function () {
        this.isFrozen = true;
        return this;
    };
    ConfigurationModel.prototype.mergeContents = function (source, target) {
        for (var _i = 0, _a = Object.keys(target); _i < _a.length; _i++) {
            var key = _a[_i];
            if (key in source) {
                if (types.isObject(source[key]) && types.isObject(target[key])) {
                    this.mergeContents(source[key], target[key]);
                    continue;
                }
            }
            source[key] = objects.deepClone(target[key]);
        }
    };
    ConfigurationModel.prototype.checkAndFreeze = function (data) {
        if (this.isFrozen && !Object.isFrozen(data)) {
            return objects.deepFreeze(data);
        }
        return data;
    };
    ConfigurationModel.prototype.getContentsForOverrideIdentifer = function (identifier) {
        for (var _i = 0, _a = this.overrides; _i < _a.length; _i++) {
            var override = _a[_i];
            if (override.identifiers.indexOf(identifier) !== -1) {
                return override.contents;
            }
        }
        return null;
    };
    ConfigurationModel.prototype.toJSON = function () {
        return {
            contents: this.contents,
            overrides: this.overrides,
            keys: this.keys
        };
    };
    // Update methods
    ConfigurationModel.prototype.setValue = function (key, value) {
        this.addKey(key);
        addToValueTree(this.contents, key, value, function (e) { throw new Error(e); });
    };
    ConfigurationModel.prototype.removeValue = function (key) {
        if (this.removeKey(key)) {
            removeFromValueTree(this.contents, key);
        }
    };
    ConfigurationModel.prototype.addKey = function (key) {
        var index = this.keys.length;
        for (var i = 0; i < index; i++) {
            if (key.indexOf(this.keys[i]) === 0) {
                index = i;
            }
        }
        this.keys.splice(index, 1, key);
    };
    ConfigurationModel.prototype.removeKey = function (key) {
        var index = this.keys.indexOf(key);
        if (index !== -1) {
            this.keys.splice(index, 1);
            return true;
        }
        return false;
    };
    return ConfigurationModel;
}());
export { ConfigurationModel };
var DefaultConfigurationModel = /** @class */ (function (_super) {
    __extends(DefaultConfigurationModel, _super);
    function DefaultConfigurationModel() {
        var _this = this;
        var contents = getDefaultValues();
        var keys = getConfigurationKeys();
        var overrides = [];
        for (var _i = 0, _a = Object.keys(contents); _i < _a.length; _i++) {
            var key = _a[_i];
            if (OVERRIDE_PROPERTY_PATTERN.test(key)) {
                overrides.push({
                    identifiers: [overrideIdentifierFromKey(key).trim()],
                    contents: toValuesTree(contents[key], function (message) { return console.error("Conflict in default settings file: " + message); })
                });
            }
        }
        _this = _super.call(this, contents, keys, overrides) || this;
        return _this;
    }
    return DefaultConfigurationModel;
}(ConfigurationModel));
export { DefaultConfigurationModel };
var ConfigurationModelParser = /** @class */ (function () {
    function ConfigurationModelParser(_name) {
        this._name = _name;
        this._configurationModel = null;
        this._parseErrors = [];
    }
    Object.defineProperty(ConfigurationModelParser.prototype, "configurationModel", {
        get: function () {
            return this._configurationModel || new ConfigurationModel();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConfigurationModelParser.prototype, "errors", {
        get: function () {
            return this._parseErrors;
        },
        enumerable: true,
        configurable: true
    });
    ConfigurationModelParser.prototype.parse = function (content) {
        var raw = this.parseContent(content);
        var configurationModel = this.parseRaw(raw);
        this._configurationModel = new ConfigurationModel(configurationModel.contents, configurationModel.keys, configurationModel.overrides);
    };
    ConfigurationModelParser.prototype.parseContent = function (content) {
        var raw = {};
        var currentProperty = null;
        var currentParent = [];
        var previousParents = [];
        var parseErrors = [];
        function onValue(value) {
            if (Array.isArray(currentParent)) {
                currentParent.push(value);
            }
            else if (currentProperty) {
                currentParent[currentProperty] = value;
            }
        }
        var visitor = {
            onObjectBegin: function () {
                var object = {};
                onValue(object);
                previousParents.push(currentParent);
                currentParent = object;
                currentProperty = null;
            },
            onObjectProperty: function (name) {
                currentProperty = name;
            },
            onObjectEnd: function () {
                currentParent = previousParents.pop();
            },
            onArrayBegin: function () {
                var array = [];
                onValue(array);
                previousParents.push(currentParent);
                currentParent = array;
                currentProperty = null;
            },
            onArrayEnd: function () {
                currentParent = previousParents.pop();
            },
            onLiteralValue: onValue,
            onError: function (error) {
                parseErrors.push({ error: error });
            }
        };
        if (content) {
            try {
                json.visit(content, visitor);
                raw = currentParent[0] || {};
            }
            catch (e) {
                console.error("Error while parsing settings file " + this._name + ": " + e);
                this._parseErrors = [e];
            }
        }
        return raw;
    };
    ConfigurationModelParser.prototype.parseRaw = function (raw) {
        var _this = this;
        var contents = toValuesTree(raw, function (message) { return console.error("Conflict in settings file " + _this._name + ": " + message); });
        var keys = Object.keys(raw);
        var overrides = toOverrides(raw, function (message) { return console.error("Conflict in settings file " + _this._name + ": " + message); });
        return { contents: contents, keys: keys, overrides: overrides };
    };
    return ConfigurationModelParser;
}());
export { ConfigurationModelParser };
var Configuration = /** @class */ (function () {
    function Configuration(_defaultConfiguration, _userConfiguration, _workspaceConfiguration, _folderConfigurations, _memoryConfiguration, _memoryConfigurationByResource, _freeze) {
        if (_workspaceConfiguration === void 0) { _workspaceConfiguration = new ConfigurationModel(); }
        if (_folderConfigurations === void 0) { _folderConfigurations = new ResourceMap(); }
        if (_memoryConfiguration === void 0) { _memoryConfiguration = new ConfigurationModel(); }
        if (_memoryConfigurationByResource === void 0) { _memoryConfigurationByResource = new ResourceMap(); }
        if (_freeze === void 0) { _freeze = true; }
        this._defaultConfiguration = _defaultConfiguration;
        this._userConfiguration = _userConfiguration;
        this._workspaceConfiguration = _workspaceConfiguration;
        this._folderConfigurations = _folderConfigurations;
        this._memoryConfiguration = _memoryConfiguration;
        this._memoryConfigurationByResource = _memoryConfigurationByResource;
        this._freeze = _freeze;
        this._workspaceConsolidatedConfiguration = null;
        this._foldersConsolidatedConfigurations = new ResourceMap();
    }
    Configuration.prototype.getValue = function (section, overrides, workspace) {
        var consolidateConfigurationModel = this.getConsolidateConfigurationModel(overrides, workspace);
        return consolidateConfigurationModel.getValue(section);
    };
    Configuration.prototype.updateValue = function (key, value, overrides) {
        if (overrides === void 0) { overrides = {}; }
        var memoryConfiguration;
        if (overrides.resource) {
            memoryConfiguration = this._memoryConfigurationByResource.get(overrides.resource);
            if (!memoryConfiguration) {
                memoryConfiguration = new ConfigurationModel();
                this._memoryConfigurationByResource.set(overrides.resource, memoryConfiguration);
            }
        }
        else {
            memoryConfiguration = this._memoryConfiguration;
        }
        if (value === void 0) {
            memoryConfiguration.removeValue(key);
        }
        else {
            memoryConfiguration.setValue(key, value);
        }
        if (!overrides.resource) {
            this._workspaceConsolidatedConfiguration = null;
        }
    };
    Configuration.prototype.inspect = function (key, overrides, workspace) {
        var consolidateConfigurationModel = this.getConsolidateConfigurationModel(overrides, workspace);
        var folderConfigurationModel = this.getFolderConfigurationModelForResource(overrides.resource, workspace);
        var memoryConfigurationModel = overrides.resource ? this._memoryConfigurationByResource.get(overrides.resource) || this._memoryConfiguration : this._memoryConfiguration;
        return {
            default: overrides.overrideIdentifier ? this._defaultConfiguration.freeze().override(overrides.overrideIdentifier).getValue(key) : this._defaultConfiguration.freeze().getValue(key),
            user: overrides.overrideIdentifier ? this._userConfiguration.freeze().override(overrides.overrideIdentifier).getValue(key) : this._userConfiguration.freeze().getValue(key),
            workspace: workspace ? overrides.overrideIdentifier ? this._workspaceConfiguration.freeze().override(overrides.overrideIdentifier).getValue(key) : this._workspaceConfiguration.freeze().getValue(key) : void 0,
            workspaceFolder: folderConfigurationModel ? overrides.overrideIdentifier ? folderConfigurationModel.freeze().override(overrides.overrideIdentifier).getValue(key) : folderConfigurationModel.freeze().getValue(key) : void 0,
            memory: overrides.overrideIdentifier ? memoryConfigurationModel.freeze().override(overrides.overrideIdentifier).getValue(key) : memoryConfigurationModel.freeze().getValue(key),
            value: consolidateConfigurationModel.getValue(key)
        };
    };
    Configuration.prototype.keys = function (workspace) {
        var folderConfigurationModel = this.getFolderConfigurationModelForResource(null, workspace);
        return {
            default: this._defaultConfiguration.freeze().keys,
            user: this._userConfiguration.freeze().keys,
            workspace: this._workspaceConfiguration.freeze().keys,
            workspaceFolder: folderConfigurationModel ? folderConfigurationModel.freeze().keys : []
        };
    };
    Configuration.prototype.updateDefaultConfiguration = function (defaultConfiguration) {
        this._defaultConfiguration = defaultConfiguration;
        this._workspaceConsolidatedConfiguration = null;
        this._foldersConsolidatedConfigurations.clear();
    };
    Configuration.prototype.updateUserConfiguration = function (userConfiguration) {
        this._userConfiguration = userConfiguration;
        this._workspaceConsolidatedConfiguration = null;
        this._foldersConsolidatedConfigurations.clear();
    };
    Configuration.prototype.updateWorkspaceConfiguration = function (workspaceConfiguration) {
        this._workspaceConfiguration = workspaceConfiguration;
        this._workspaceConsolidatedConfiguration = null;
        this._foldersConsolidatedConfigurations.clear();
    };
    Configuration.prototype.updateFolderConfiguration = function (resource, configuration) {
        this._folderConfigurations.set(resource, configuration);
        this._foldersConsolidatedConfigurations.delete(resource);
    };
    Configuration.prototype.deleteFolderConfiguration = function (resource) {
        this.folders.delete(resource);
        this._foldersConsolidatedConfigurations.delete(resource);
    };
    Object.defineProperty(Configuration.prototype, "defaults", {
        get: function () {
            return this._defaultConfiguration;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Configuration.prototype, "user", {
        get: function () {
            return this._userConfiguration;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Configuration.prototype, "workspace", {
        get: function () {
            return this._workspaceConfiguration;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Configuration.prototype, "folders", {
        get: function () {
            return this._folderConfigurations;
        },
        enumerable: true,
        configurable: true
    });
    Configuration.prototype.getConsolidateConfigurationModel = function (overrides, workspace) {
        var configurationModel = this.getConsolidatedConfigurationModelForResource(overrides, workspace);
        return overrides.overrideIdentifier ? configurationModel.override(overrides.overrideIdentifier) : configurationModel;
    };
    Configuration.prototype.getConsolidatedConfigurationModelForResource = function (_a, workspace) {
        var resource = _a.resource;
        var consolidateConfiguration = this.getWorkspaceConsolidatedConfiguration();
        if (workspace && resource) {
            var root = workspace.getFolder(resource);
            if (root) {
                consolidateConfiguration = this.getFolderConsolidatedConfiguration(root.uri) || consolidateConfiguration;
            }
            var memoryConfigurationForResource = this._memoryConfigurationByResource.get(resource);
            if (memoryConfigurationForResource) {
                consolidateConfiguration = consolidateConfiguration.merge(memoryConfigurationForResource);
            }
        }
        return consolidateConfiguration;
    };
    Configuration.prototype.getWorkspaceConsolidatedConfiguration = function () {
        if (!this._workspaceConsolidatedConfiguration) {
            this._workspaceConsolidatedConfiguration = this._defaultConfiguration.merge(this._userConfiguration, this._workspaceConfiguration, this._memoryConfiguration);
            if (this._freeze) {
                this._workspaceConfiguration = this._workspaceConfiguration.freeze();
            }
        }
        return this._workspaceConsolidatedConfiguration;
    };
    Configuration.prototype.getFolderConsolidatedConfiguration = function (folder) {
        var folderConsolidatedConfiguration = this._foldersConsolidatedConfigurations.get(folder);
        if (!folderConsolidatedConfiguration) {
            var workspaceConsolidateConfiguration = this.getWorkspaceConsolidatedConfiguration();
            var folderConfiguration = this._folderConfigurations.get(folder);
            if (folderConfiguration) {
                folderConsolidatedConfiguration = workspaceConsolidateConfiguration.merge(folderConfiguration);
                if (this._freeze) {
                    folderConsolidatedConfiguration = folderConsolidatedConfiguration.freeze();
                }
                this._foldersConsolidatedConfigurations.set(folder, folderConsolidatedConfiguration);
            }
            else {
                folderConsolidatedConfiguration = workspaceConsolidateConfiguration;
            }
        }
        return folderConsolidatedConfiguration;
    };
    Configuration.prototype.getFolderConfigurationModelForResource = function (resource, workspace) {
        if (workspace && resource) {
            var root = workspace.getFolder(resource);
            if (root) {
                return this._folderConfigurations.get(root.uri);
            }
        }
        return null;
    };
    Configuration.prototype.toData = function () {
        var _this = this;
        return {
            defaults: {
                contents: this._defaultConfiguration.contents,
                overrides: this._defaultConfiguration.overrides,
                keys: this._defaultConfiguration.keys
            },
            user: {
                contents: this._userConfiguration.contents,
                overrides: this._userConfiguration.overrides,
                keys: this._userConfiguration.keys
            },
            workspace: {
                contents: this._workspaceConfiguration.contents,
                overrides: this._workspaceConfiguration.overrides,
                keys: this._workspaceConfiguration.keys
            },
            folders: this._folderConfigurations.keys().reduce(function (result, folder) {
                var _a = _this._folderConfigurations.get(folder), contents = _a.contents, overrides = _a.overrides, keys = _a.keys;
                result[folder.toString()] = { contents: contents, overrides: overrides, keys: keys };
                return result;
            }, Object.create({})),
            isComplete: true
        };
    };
    Configuration.prototype.allKeys = function (workspace) {
        var keys = this.keys(workspace);
        var all = keys.default.slice();
        var addKeys = function (keys) {
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var key = keys_1[_i];
                if (all.indexOf(key) === -1) {
                    all.push(key);
                }
            }
        };
        addKeys(keys.user);
        addKeys(keys.workspace);
        for (var _i = 0, _a = this.folders.keys(); _i < _a.length; _i++) {
            var resource = _a[_i];
            addKeys(this.folders.get(resource).keys);
        }
        return all;
    };
    return Configuration;
}());
export { Configuration };
var AbstractConfigurationChangeEvent = /** @class */ (function () {
    function AbstractConfigurationChangeEvent() {
    }
    AbstractConfigurationChangeEvent.prototype.doesConfigurationContains = function (configuration, config) {
        var _a;
        var changedKeysTree = configuration.contents;
        var requestedTree = toValuesTree((_a = {}, _a[config] = true, _a), function () { });
        var key;
        while (typeof requestedTree === 'object' && (key = Object.keys(requestedTree)[0])) { // Only one key should present, since we added only one property
            changedKeysTree = changedKeysTree[key];
            if (!changedKeysTree) {
                return false; // Requested tree is not found
            }
            requestedTree = requestedTree[key];
        }
        return true;
    };
    AbstractConfigurationChangeEvent.prototype.updateKeys = function (configuration, keys, resource) {
        for (var _i = 0, keys_2 = keys; _i < keys_2.length; _i++) {
            var key = keys_2[_i];
            configuration.setValue(key, {});
        }
    };
    return AbstractConfigurationChangeEvent;
}());
export { AbstractConfigurationChangeEvent };
var ConfigurationChangeEvent = /** @class */ (function (_super) {
    __extends(ConfigurationChangeEvent, _super);
    function ConfigurationChangeEvent(_changedConfiguration, _changedConfigurationByResource) {
        if (_changedConfiguration === void 0) { _changedConfiguration = new ConfigurationModel(); }
        if (_changedConfigurationByResource === void 0) { _changedConfigurationByResource = new ResourceMap(); }
        var _this = _super.call(this) || this;
        _this._changedConfiguration = _changedConfiguration;
        _this._changedConfigurationByResource = _changedConfigurationByResource;
        return _this;
    }
    Object.defineProperty(ConfigurationChangeEvent.prototype, "changedConfiguration", {
        get: function () {
            return this._changedConfiguration;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConfigurationChangeEvent.prototype, "changedConfigurationByResource", {
        get: function () {
            return this._changedConfigurationByResource;
        },
        enumerable: true,
        configurable: true
    });
    ConfigurationChangeEvent.prototype.change = function (arg1, arg2) {
        if (arg1 instanceof ConfigurationChangeEvent) {
            this._changedConfiguration = this._changedConfiguration.merge(arg1._changedConfiguration);
            for (var _i = 0, _a = arg1._changedConfigurationByResource.keys(); _i < _a.length; _i++) {
                var resource = _a[_i];
                var changedConfigurationByResource = this.getOrSetChangedConfigurationForResource(resource);
                changedConfigurationByResource = changedConfigurationByResource.merge(arg1._changedConfigurationByResource.get(resource));
                this._changedConfigurationByResource.set(resource, changedConfigurationByResource);
            }
        }
        else {
            this.changeWithKeys(arg1, arg2);
        }
        return this;
    };
    ConfigurationChangeEvent.prototype.telemetryData = function (source, sourceConfig) {
        this._source = source;
        this._sourceConfig = sourceConfig;
        return this;
    };
    Object.defineProperty(ConfigurationChangeEvent.prototype, "affectedKeys", {
        get: function () {
            var keys = this._changedConfiguration.keys.slice();
            this._changedConfigurationByResource.forEach(function (model) { return keys.push.apply(keys, model.keys); });
            return arrays.distinct(keys);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConfigurationChangeEvent.prototype, "source", {
        get: function () {
            return this._source;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConfigurationChangeEvent.prototype, "sourceConfig", {
        get: function () {
            return this._sourceConfig;
        },
        enumerable: true,
        configurable: true
    });
    ConfigurationChangeEvent.prototype.affectsConfiguration = function (config, resource) {
        var configurationModelsToSearch = [this._changedConfiguration];
        if (resource) {
            var model = this._changedConfigurationByResource.get(resource);
            if (model) {
                configurationModelsToSearch.push(model);
            }
        }
        else {
            configurationModelsToSearch.push.apply(configurationModelsToSearch, this._changedConfigurationByResource.values());
        }
        for (var _i = 0, configurationModelsToSearch_1 = configurationModelsToSearch; _i < configurationModelsToSearch_1.length; _i++) {
            var configuration = configurationModelsToSearch_1[_i];
            if (this.doesConfigurationContains(configuration, config)) {
                return true;
            }
        }
        return false;
    };
    ConfigurationChangeEvent.prototype.changeWithKeys = function (keys, resource) {
        var changedConfiguration = resource ? this.getOrSetChangedConfigurationForResource(resource) : this._changedConfiguration;
        this.updateKeys(changedConfiguration, keys);
    };
    ConfigurationChangeEvent.prototype.getOrSetChangedConfigurationForResource = function (resource) {
        var changedConfigurationByResource = this._changedConfigurationByResource.get(resource);
        if (!changedConfigurationByResource) {
            changedConfigurationByResource = new ConfigurationModel();
            this._changedConfigurationByResource.set(resource, changedConfigurationByResource);
        }
        return changedConfigurationByResource;
    };
    return ConfigurationChangeEvent;
}(AbstractConfigurationChangeEvent));
export { ConfigurationChangeEvent };
