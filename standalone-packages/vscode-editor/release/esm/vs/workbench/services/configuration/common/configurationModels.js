/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
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
import { equals } from '../../../../base/common/objects.js';
import { compare, toValuesTree } from '../../../../platform/configuration/common/configuration.js';
import { Configuration as BaseConfiguration, ConfigurationModelParser, ConfigurationChangeEvent, ConfigurationModel, AbstractConfigurationChangeEvent } from '../../../../platform/configuration/common/configurationModels.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { Extensions, OVERRIDE_PROPERTY_PATTERN } from '../../../../platform/configuration/common/configurationRegistry.js';
import { ResourceMap } from '../../../../base/common/map.js';
var WorkspaceConfigurationModelParser = /** @class */ (function (_super) {
    __extends(WorkspaceConfigurationModelParser, _super);
    function WorkspaceConfigurationModelParser(name) {
        var _this = _super.call(this, name) || this;
        _this._folders = [];
        _this._settingsModelParser = new FolderSettingsModelParser(name, [2 /* WINDOW */, 3 /* RESOURCE */]);
        _this._launchModel = new ConfigurationModel();
        return _this;
    }
    Object.defineProperty(WorkspaceConfigurationModelParser.prototype, "folders", {
        get: function () {
            return this._folders;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkspaceConfigurationModelParser.prototype, "settingsModel", {
        get: function () {
            return this._settingsModelParser.configurationModel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkspaceConfigurationModelParser.prototype, "launchModel", {
        get: function () {
            return this._launchModel;
        },
        enumerable: true,
        configurable: true
    });
    WorkspaceConfigurationModelParser.prototype.reprocessWorkspaceSettings = function () {
        this._settingsModelParser.reprocess();
    };
    WorkspaceConfigurationModelParser.prototype.parseRaw = function (raw) {
        this._folders = (raw['folders'] || []);
        this._settingsModelParser.parse(raw['settings']);
        this._launchModel = this.createConfigurationModelFrom(raw, 'launch');
        return _super.prototype.parseRaw.call(this, raw);
    };
    WorkspaceConfigurationModelParser.prototype.createConfigurationModelFrom = function (raw, key) {
        var _this = this;
        var data = raw[key];
        if (data) {
            var contents = toValuesTree(data, function (message) { return console.error("Conflict in settings file " + _this._name + ": " + message); });
            var scopedContents = Object.create(null);
            scopedContents[key] = contents;
            var keys = Object.keys(data).map(function (k) { return key + "." + k; });
            return new ConfigurationModel(scopedContents, keys, []);
        }
        return new ConfigurationModel();
    };
    return WorkspaceConfigurationModelParser;
}(ConfigurationModelParser));
export { WorkspaceConfigurationModelParser };
var StandaloneConfigurationModelParser = /** @class */ (function (_super) {
    __extends(StandaloneConfigurationModelParser, _super);
    function StandaloneConfigurationModelParser(name, scope) {
        var _this = _super.call(this, name) || this;
        _this.scope = scope;
        return _this;
    }
    StandaloneConfigurationModelParser.prototype.parseRaw = function (raw) {
        var _this = this;
        var contents = toValuesTree(raw, function (message) { return console.error("Conflict in settings file " + _this._name + ": " + message); });
        var scopedContents = Object.create(null);
        scopedContents[this.scope] = contents;
        var keys = Object.keys(raw).map(function (key) { return _this.scope + "." + key; });
        return { contents: scopedContents, keys: keys, overrides: [] };
    };
    return StandaloneConfigurationModelParser;
}(ConfigurationModelParser));
export { StandaloneConfigurationModelParser };
var FolderSettingsModelParser = /** @class */ (function (_super) {
    __extends(FolderSettingsModelParser, _super);
    function FolderSettingsModelParser(name, scopes) {
        var _this = _super.call(this, name) || this;
        _this.scopes = scopes;
        return _this;
    }
    FolderSettingsModelParser.prototype.parse = function (content) {
        this._raw = typeof content === 'string' ? this.parseContent(content) : content;
        this.parseWorkspaceSettings(this._raw);
    };
    Object.defineProperty(FolderSettingsModelParser.prototype, "configurationModel", {
        get: function () {
            return this._settingsModel || new ConfigurationModel();
        },
        enumerable: true,
        configurable: true
    });
    FolderSettingsModelParser.prototype.reprocess = function () {
        this.parse(this._raw);
    };
    FolderSettingsModelParser.prototype.parseWorkspaceSettings = function (rawSettings) {
        var configurationProperties = Registry.as(Extensions.Configuration).getConfigurationProperties();
        var rawWorkspaceSettings = this.filterByScope(rawSettings, configurationProperties, true);
        var configurationModel = this.parseRaw(rawWorkspaceSettings);
        this._settingsModel = new ConfigurationModel(configurationModel.contents, configurationModel.keys, configurationModel.overrides);
    };
    FolderSettingsModelParser.prototype.filterByScope = function (properties, configurationProperties, filterOverriddenProperties) {
        var result = {};
        for (var key in properties) {
            if (OVERRIDE_PROPERTY_PATTERN.test(key) && filterOverriddenProperties) {
                result[key] = this.filterByScope(properties[key], configurationProperties, false);
            }
            else {
                var scope = this.getScope(key, configurationProperties);
                if (this.scopes.indexOf(scope) !== -1) {
                    result[key] = properties[key];
                }
            }
        }
        return result;
    };
    FolderSettingsModelParser.prototype.getScope = function (key, configurationProperties) {
        var propertySchema = configurationProperties[key];
        return propertySchema ? propertySchema.scope : 2 /* WINDOW */;
    };
    return FolderSettingsModelParser;
}(ConfigurationModelParser));
export { FolderSettingsModelParser };
var Configuration = /** @class */ (function (_super) {
    __extends(Configuration, _super);
    function Configuration(defaults, user, workspaceConfiguration, folders, memoryConfiguration, memoryConfigurationByResource, _workspace) {
        var _this = _super.call(this, defaults, user, workspaceConfiguration, folders, memoryConfiguration, memoryConfigurationByResource) || this;
        _this._workspace = _workspace;
        return _this;
    }
    Configuration.prototype.getValue = function (key, overrides) {
        if (overrides === void 0) { overrides = {}; }
        return _super.prototype.getValue.call(this, key, overrides, this._workspace);
    };
    Configuration.prototype.inspect = function (key, overrides) {
        if (overrides === void 0) { overrides = {}; }
        return _super.prototype.inspect.call(this, key, overrides, this._workspace);
    };
    Configuration.prototype.keys = function () {
        return _super.prototype.keys.call(this, this._workspace);
    };
    Configuration.prototype.compareAndUpdateUserConfiguration = function (user) {
        var _a = compare(this.user, user), added = _a.added, updated = _a.updated, removed = _a.removed;
        var changedKeys = added.concat(updated, removed);
        if (changedKeys.length) {
            _super.prototype.updateUserConfiguration.call(this, user);
        }
        return new ConfigurationChangeEvent().change(changedKeys);
    };
    Configuration.prototype.compareAndUpdateWorkspaceConfiguration = function (workspaceConfiguration) {
        var _a = compare(this.workspace, workspaceConfiguration), added = _a.added, updated = _a.updated, removed = _a.removed;
        var changedKeys = added.concat(updated, removed);
        if (changedKeys.length) {
            _super.prototype.updateWorkspaceConfiguration.call(this, workspaceConfiguration);
        }
        return new ConfigurationChangeEvent().change(changedKeys);
    };
    Configuration.prototype.compareAndUpdateFolderConfiguration = function (resource, folderConfiguration) {
        var currentFolderConfiguration = this.folders.get(resource);
        if (currentFolderConfiguration) {
            var _a = compare(currentFolderConfiguration, folderConfiguration), added = _a.added, updated = _a.updated, removed = _a.removed;
            var changedKeys = added.concat(updated, removed);
            if (changedKeys.length) {
                _super.prototype.updateFolderConfiguration.call(this, resource, folderConfiguration);
            }
            return new ConfigurationChangeEvent().change(changedKeys, resource);
        }
        else {
            _super.prototype.updateFolderConfiguration.call(this, resource, folderConfiguration);
            return new ConfigurationChangeEvent().change(folderConfiguration.keys, resource);
        }
    };
    Configuration.prototype.compareAndDeleteFolderConfiguration = function (folder) {
        if (this._workspace && this._workspace.folders.length > 0 && this._workspace.folders[0].uri.toString() === folder.toString()) {
            // Do not remove workspace configuration
            return new ConfigurationChangeEvent();
        }
        var keys = this.folders.get(folder).keys;
        _super.prototype.deleteFolderConfiguration.call(this, folder);
        return new ConfigurationChangeEvent().change(keys, folder);
    };
    Configuration.prototype.compare = function (other) {
        var _this = this;
        var result = [];
        var _loop_1 = function (key) {
            if (!equals(this_1.getValue(key), other.getValue(key))
                || (this_1._workspace && this_1._workspace.folders.some(function (folder) { return !equals(_this.getValue(key, { resource: folder.uri }), other.getValue(key, { resource: folder.uri })); }))) {
                result.push(key);
            }
        };
        var this_1 = this;
        for (var _i = 0, _a = this.allKeys(); _i < _a.length; _i++) {
            var key = _a[_i];
            _loop_1(key);
        }
        return result;
    };
    Configuration.prototype.allKeys = function () {
        return _super.prototype.allKeys.call(this, this._workspace);
    };
    return Configuration;
}(BaseConfiguration));
export { Configuration };
var AllKeysConfigurationChangeEvent = /** @class */ (function (_super) {
    __extends(AllKeysConfigurationChangeEvent, _super);
    function AllKeysConfigurationChangeEvent(_configuration, source, sourceConfig) {
        var _this = _super.call(this) || this;
        _this._configuration = _configuration;
        _this.source = source;
        _this.sourceConfig = sourceConfig;
        _this._changedConfiguration = null;
        return _this;
    }
    Object.defineProperty(AllKeysConfigurationChangeEvent.prototype, "changedConfiguration", {
        get: function () {
            if (!this._changedConfiguration) {
                this._changedConfiguration = new ConfigurationModel();
                this.updateKeys(this._changedConfiguration, this.affectedKeys);
            }
            return this._changedConfiguration;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AllKeysConfigurationChangeEvent.prototype, "changedConfigurationByResource", {
        get: function () {
            return new ResourceMap();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AllKeysConfigurationChangeEvent.prototype, "affectedKeys", {
        get: function () {
            return this._configuration.allKeys();
        },
        enumerable: true,
        configurable: true
    });
    AllKeysConfigurationChangeEvent.prototype.affectsConfiguration = function (config, resource) {
        return this.doesConfigurationContains(this.changedConfiguration, config);
    };
    return AllKeysConfigurationChangeEvent;
}(AbstractConfigurationChangeEvent));
export { AllKeysConfigurationChangeEvent };
var WorkspaceConfigurationChangeEvent = /** @class */ (function () {
    function WorkspaceConfigurationChangeEvent(configurationChangeEvent, workspace) {
        this.configurationChangeEvent = configurationChangeEvent;
        this.workspace = workspace;
    }
    Object.defineProperty(WorkspaceConfigurationChangeEvent.prototype, "changedConfiguration", {
        get: function () {
            return this.configurationChangeEvent.changedConfiguration;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkspaceConfigurationChangeEvent.prototype, "changedConfigurationByResource", {
        get: function () {
            return this.configurationChangeEvent.changedConfigurationByResource;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkspaceConfigurationChangeEvent.prototype, "affectedKeys", {
        get: function () {
            return this.configurationChangeEvent.affectedKeys;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkspaceConfigurationChangeEvent.prototype, "source", {
        get: function () {
            return this.configurationChangeEvent.source;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorkspaceConfigurationChangeEvent.prototype, "sourceConfig", {
        get: function () {
            return this.configurationChangeEvent.sourceConfig;
        },
        enumerable: true,
        configurable: true
    });
    WorkspaceConfigurationChangeEvent.prototype.affectsConfiguration = function (config, resource) {
        if (this.configurationChangeEvent.affectsConfiguration(config, resource)) {
            return true;
        }
        if (resource && this.workspace) {
            var workspaceFolder = this.workspace.getFolder(resource);
            if (workspaceFolder) {
                return this.configurationChangeEvent.affectsConfiguration(config, workspaceFolder.uri);
            }
        }
        return false;
    };
    return WorkspaceConfigurationChangeEvent;
}());
export { WorkspaceConfigurationChangeEvent };
