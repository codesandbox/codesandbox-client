/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { mixin, deepClone } from '../../../base/common/objects.js';
import { URI } from '../../../base/common/uri.js';
import { Emitter } from '../../../base/common/event.js';
import { ConfigurationTarget as ExtHostConfigurationTarget } from './extHostTypes.js';
import { Configuration, ConfigurationChangeEvent, ConfigurationModel } from '../../../platform/configuration/common/configurationModels.js';
import { WorkspaceConfigurationChangeEvent } from '../../services/configuration/common/configurationModels.js';
import { ResourceMap } from '../../../base/common/map.js';
import { OVERRIDE_PROPERTY_PATTERN } from '../../../platform/configuration/common/configurationRegistry.js';
import { isObject } from '../../../base/common/types.js';
function lookUp(tree, key) {
    if (key) {
        var parts = key.split('.');
        var node = tree;
        for (var i = 0; node && i < parts.length; i++) {
            node = node[parts[i]];
        }
        return node;
    }
}
var ExtHostConfiguration = /** @class */ (function () {
    function ExtHostConfiguration(proxy, extHostWorkspace, data) {
        this._onDidChangeConfiguration = new Emitter();
        this._proxy = proxy;
        this._extHostWorkspace = extHostWorkspace;
        this._configuration = ExtHostConfiguration.parse(data);
        this._configurationScopes = data.configurationScopes;
    }
    Object.defineProperty(ExtHostConfiguration.prototype, "onDidChangeConfiguration", {
        get: function () {
            return this._onDidChangeConfiguration && this._onDidChangeConfiguration.event;
        },
        enumerable: true,
        configurable: true
    });
    ExtHostConfiguration.prototype.$acceptConfigurationChanged = function (data, eventData) {
        this._configuration = ExtHostConfiguration.parse(data);
        this._onDidChangeConfiguration.fire(this._toConfigurationChangeEvent(eventData));
    };
    ExtHostConfiguration.prototype.getConfiguration = function (section, resource, extensionId) {
        var _this = this;
        var config = this._toReadonlyValue(section
            ? lookUp(this._configuration.getValue(null, { resource: resource }, this._extHostWorkspace.workspace), section)
            : this._configuration.getValue(null, { resource: resource }, this._extHostWorkspace.workspace));
        if (section) {
            this._validateConfigurationAccess(section, resource, extensionId);
        }
        function parseConfigurationTarget(arg) {
            if (arg === void 0 || arg === null) {
                return null;
            }
            if (typeof arg === 'boolean') {
                return arg ? 1 /* USER */ : 2 /* WORKSPACE */;
            }
            switch (arg) {
                case ExtHostConfigurationTarget.Global: return 1 /* USER */;
                case ExtHostConfigurationTarget.Workspace: return 2 /* WORKSPACE */;
                case ExtHostConfigurationTarget.WorkspaceFolder: return 3 /* WORKSPACE_FOLDER */;
            }
        }
        var result = {
            has: function (key) {
                return typeof lookUp(config, key) !== 'undefined';
            },
            get: function (key, defaultValue) {
                _this._validateConfigurationAccess(section ? section + "." + key : key, resource, extensionId);
                var result = lookUp(config, key);
                if (typeof result === 'undefined') {
                    result = defaultValue;
                }
                else {
                    var clonedConfig_1 = void 0;
                    var cloneOnWriteProxy_1 = function (target, accessor) {
                        var clonedTarget = void 0;
                        var cloneTarget = function () {
                            clonedConfig_1 = clonedConfig_1 ? clonedConfig_1 : deepClone(config);
                            clonedTarget = clonedTarget ? clonedTarget : lookUp(clonedConfig_1, accessor);
                        };
                        return isObject(target) ?
                            new Proxy(target, {
                                get: function (target, property) {
                                    if (typeof property === 'string' && property.toLowerCase() === 'tojson') {
                                        cloneTarget();
                                        return function () { return clonedTarget; };
                                    }
                                    if (clonedConfig_1) {
                                        clonedTarget = clonedTarget ? clonedTarget : lookUp(clonedConfig_1, accessor);
                                        return clonedTarget[property];
                                    }
                                    var result = target[property];
                                    if (typeof property === 'string') {
                                        return cloneOnWriteProxy_1(result, accessor + "." + property);
                                    }
                                    return result;
                                },
                                set: function (_target, property, value) {
                                    cloneTarget();
                                    clonedTarget[property] = value;
                                    return true;
                                },
                                deleteProperty: function (_target, property) {
                                    cloneTarget();
                                    delete clonedTarget[property];
                                    return true;
                                },
                                defineProperty: function (_target, property, descriptor) {
                                    cloneTarget();
                                    Object.defineProperty(clonedTarget, property, descriptor);
                                    return true;
                                }
                            }) : target;
                    };
                    result = cloneOnWriteProxy_1(result, key);
                }
                return result;
            },
            update: function (key, value, arg) {
                key = section ? section + "." + key : key;
                var target = parseConfigurationTarget(arg);
                if (value !== void 0) {
                    return _this._proxy.$updateConfigurationOption(target, key, value, resource);
                }
                else {
                    return _this._proxy.$removeConfigurationOption(target, key, resource);
                }
            },
            inspect: function (key) {
                key = section ? section + "." + key : key;
                var config = deepClone(_this._configuration.inspect(key, { resource: resource }, _this._extHostWorkspace.workspace));
                if (config) {
                    return {
                        key: key,
                        defaultValue: config.default,
                        globalValue: config.user,
                        workspaceValue: config.workspace,
                        workspaceFolderValue: config.workspaceFolder
                    };
                }
                return undefined;
            }
        };
        if (typeof config === 'object') {
            mixin(result, config, false);
        }
        return Object.freeze(result);
    };
    ExtHostConfiguration.prototype._toReadonlyValue = function (result) {
        var readonlyProxy = function (target) {
            return isObject(target) ?
                new Proxy(target, {
                    get: function (target, property) { return readonlyProxy(target[property]); },
                    set: function (_target, property, _value) { throw new Error("TypeError: Cannot assign to read only property '" + property + "' of object"); },
                    deleteProperty: function (_target, property) { throw new Error("TypeError: Cannot delete read only property '" + property + "' of object"); },
                    defineProperty: function (_target, property) { throw new Error("TypeError: Cannot define property '" + property + "' for a readonly object"); },
                    setPrototypeOf: function (_target) { throw new Error("TypeError: Cannot set prototype for a readonly object"); },
                    isExtensible: function () { return false; },
                    preventExtensions: function () { return true; }
                }) : target;
        };
        return readonlyProxy(result);
    };
    ExtHostConfiguration.prototype._validateConfigurationAccess = function (key, resource, extensionId) {
        var scope = OVERRIDE_PROPERTY_PATTERN.test(key) ? 3 /* RESOURCE */ : this._configurationScopes[key];
        var extensionIdText = extensionId ? "[" + extensionId + "] " : '';
        if (3 /* RESOURCE */ === scope) {
            if (resource === void 0) {
                console.warn(extensionIdText + "Accessing a resource scoped configuration without providing a resource is not expected. To get the effective value for '" + key + "', provide the URI of a resource or 'null' for any resource.");
            }
            return;
        }
        if (2 /* WINDOW */ === scope) {
            if (resource) {
                console.warn(extensionIdText + "Accessing a window scoped configuration for a resource is not expected. To associate '" + key + "' to a resource, define its scope to 'resource' in configuration contributions in 'package.json'.");
            }
            return;
        }
    };
    ExtHostConfiguration.prototype._toConfigurationChangeEvent = function (data) {
        var changedConfiguration = new ConfigurationModel(data.changedConfiguration.contents, data.changedConfiguration.keys, data.changedConfiguration.overrides);
        var changedConfigurationByResource = new ResourceMap();
        for (var _i = 0, _a = Object.keys(data.changedConfigurationByResource); _i < _a.length; _i++) {
            var key = _a[_i];
            var resource = URI.parse(key);
            var model = data.changedConfigurationByResource[key];
            changedConfigurationByResource.set(resource, new ConfigurationModel(model.contents, model.keys, model.overrides));
        }
        var event = new WorkspaceConfigurationChangeEvent(new ConfigurationChangeEvent(changedConfiguration, changedConfigurationByResource), this._extHostWorkspace.workspace);
        return Object.freeze({
            affectsConfiguration: function (section, resource) { return event.affectsConfiguration(section, resource); }
        });
    };
    ExtHostConfiguration.parse = function (data) {
        var defaultConfiguration = ExtHostConfiguration.parseConfigurationModel(data.defaults);
        var userConfiguration = ExtHostConfiguration.parseConfigurationModel(data.user);
        var workspaceConfiguration = ExtHostConfiguration.parseConfigurationModel(data.workspace);
        var folders = Object.keys(data.folders).reduce(function (result, key) {
            result.set(URI.parse(key), ExtHostConfiguration.parseConfigurationModel(data.folders[key]));
            return result;
        }, new ResourceMap());
        return new Configuration(defaultConfiguration, userConfiguration, workspaceConfiguration, folders, new ConfigurationModel(), new ResourceMap(), false);
    };
    ExtHostConfiguration.parseConfigurationModel = function (model) {
        return new ConfigurationModel(model.contents, model.keys, model.overrides).freeze();
    };
    return ExtHostConfiguration;
}());
export { ExtHostConfiguration };
