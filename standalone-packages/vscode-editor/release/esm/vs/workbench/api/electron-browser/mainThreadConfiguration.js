/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { URI } from '../../../base/common/uri.js';
import { Registry } from '../../../platform/registry/common/platform.js';
import { Extensions as ConfigurationExtensions } from '../../../platform/configuration/common/configurationRegistry.js';
import { IWorkspaceContextService } from '../../../platform/workspace/common/workspace.js';
import { IWorkspaceConfigurationService } from '../../services/configuration/common/configuration.js';
import { MainContext, ExtHostContext } from '../node/extHost.protocol.js';
import { extHostNamedCustomer } from './extHostCustomers.js';
var MainThreadConfiguration = /** @class */ (function () {
    function MainThreadConfiguration(extHostContext, _workspaceContextService, configurationService) {
        var _this = this;
        this._workspaceContextService = _workspaceContextService;
        this.configurationService = configurationService;
        var proxy = extHostContext.getProxy(ExtHostContext.ExtHostConfiguration);
        this._configurationListener = configurationService.onDidChangeConfiguration(function (e) {
            proxy.$acceptConfigurationChanged(configurationService.getConfigurationData(), _this.toConfigurationChangeEventData(e));
        });
    }
    MainThreadConfiguration.prototype.dispose = function () {
        this._configurationListener.dispose();
    };
    MainThreadConfiguration.prototype.$updateConfigurationOption = function (target, key, value, resourceUriComponenets) {
        var resource = resourceUriComponenets ? URI.revive(resourceUriComponenets) : null;
        return this.writeConfiguration(target, key, value, resource);
    };
    MainThreadConfiguration.prototype.$removeConfigurationOption = function (target, key, resourceUriComponenets) {
        var resource = resourceUriComponenets ? URI.revive(resourceUriComponenets) : null;
        return this.writeConfiguration(target, key, undefined, resource);
    };
    MainThreadConfiguration.prototype.writeConfiguration = function (target, key, value, resource) {
        target = target !== null && target !== undefined ? target : this.deriveConfigurationTarget(key, resource);
        return this.configurationService.updateValue(key, value, { resource: resource }, target, true);
    };
    MainThreadConfiguration.prototype.deriveConfigurationTarget = function (key, resource) {
        if (resource && this._workspaceContextService.getWorkbenchState() === 3 /* WORKSPACE */) {
            var configurationProperties = Registry.as(ConfigurationExtensions.Configuration).getConfigurationProperties();
            if (configurationProperties[key] && configurationProperties[key].scope === 3 /* RESOURCE */) {
                return 3 /* WORKSPACE_FOLDER */;
            }
        }
        return 2 /* WORKSPACE */;
    };
    MainThreadConfiguration.prototype.toConfigurationChangeEventData = function (event) {
        var _this = this;
        return {
            changedConfiguration: this.toJSONConfiguration(event.changedConfiguration),
            changedConfigurationByResource: event.changedConfigurationByResource.keys().reduce(function (result, resource) {
                result[resource.toString()] = _this.toJSONConfiguration(event.changedConfigurationByResource.get(resource));
                return result;
            }, Object.create({}))
        };
    };
    MainThreadConfiguration.prototype.toJSONConfiguration = function (_a) {
        var _b = _a === void 0 ? { contents: {}, keys: [], overrides: [] } : _a, contents = _b.contents, keys = _b.keys, overrides = _b.overrides;
        return {
            contents: contents,
            keys: keys,
            overrides: overrides
        };
    };
    MainThreadConfiguration = __decorate([
        extHostNamedCustomer(MainContext.MainThreadConfiguration),
        __param(1, IWorkspaceContextService),
        __param(2, IWorkspaceConfigurationService)
    ], MainThreadConfiguration);
    return MainThreadConfiguration;
}());
export { MainThreadConfiguration };
