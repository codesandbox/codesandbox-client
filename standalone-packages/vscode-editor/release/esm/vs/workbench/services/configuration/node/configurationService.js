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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { URI } from '../../../../base/common/uri.js';
import { dirname } from '../../../../../path.js';
import * as assert from '../../../../base/common/assert.js';
import { Emitter } from '../../../../base/common/event.js';
import { ResourceMap } from '../../../../base/common/map.js';
import { equals, deepClone } from '../../../../base/common/objects.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { Queue } from '../../../../base/common/async.js';
import { writeFile } from '../../../../base/node/pfs.js';
import { Extensions as JSONExtensions } from '../../../../platform/jsonschemas/common/jsonContributionRegistry.js';
import { Workspace, toWorkspaceFolders } from '../../../../platform/workspace/common/workspace.js';
import { isLinux } from '../../../../base/common/platform.js';
import { IEnvironmentService } from '../../../../platform/environment/common/environment.js';
import { ConfigurationChangeEvent, ConfigurationModel, DefaultConfigurationModel } from '../../../../platform/configuration/common/configurationModels.js';
import { keyFromOverrideIdentifier, isConfigurationOverrides } from '../../../../platform/configuration/common/configuration.js';
import { Configuration, WorkspaceConfigurationChangeEvent, AllKeysConfigurationChangeEvent } from '../common/configurationModels.js';
import { FOLDER_CONFIG_FOLDER_NAME, defaultSettingsSchemaId, userSettingsSchemaId, workspaceSettingsSchemaId, folderSettingsSchemaId } from '../common/configuration.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { Extensions, allSettings, windowSettings, resourceSettings, applicationSettings } from '../../../../platform/configuration/common/configurationRegistry.js';
import { isWorkspaceIdentifier, isStoredWorkspaceFolder, isSingleFolderWorkspaceIdentifier } from '../../../../platform/workspaces/common/workspaces.js';
import { IExtensionService } from '../../extensions/common/extensions.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import product from '../../../../platform/node/product.js';
import { ConfigurationEditingService } from './configurationEditingService.js';
import { WorkspaceConfiguration, FolderConfiguration } from './configuration.js';
import { JSONEditingService } from './jsonEditingService.js';
import { Schemas } from '../../../../base/common/network.js';
import { massageFolderPathForWorkspace } from '../../../../platform/workspaces/node/workspaces.js';
import { UserConfiguration } from '../../../../platform/configuration/node/configuration.js';
import { localize } from '../../../../nls.js';
import { isEqual } from '../../../../base/common/resources.js';
export function isSingleFolderWorkspaceInitializationPayload(obj) {
    return isSingleFolderWorkspaceIdentifier(obj.folder);
}
var WorkspaceService = /** @class */ (function (_super) {
    __extends(WorkspaceService, _super);
    function WorkspaceService(environmentService, workspaceSettingsRootFolder) {
        if (workspaceSettingsRootFolder === void 0) { workspaceSettingsRootFolder = FOLDER_CONFIG_FOLDER_NAME; }
        var _this = _super.call(this) || this;
        _this.environmentService = environmentService;
        _this.workspaceSettingsRootFolder = workspaceSettingsRootFolder;
        _this._onDidChangeConfiguration = _this._register(new Emitter());
        _this.onDidChangeConfiguration = _this._onDidChangeConfiguration.event;
        _this._onDidChangeWorkspaceFolders = _this._register(new Emitter());
        _this.onDidChangeWorkspaceFolders = _this._onDidChangeWorkspaceFolders.event;
        _this._onDidChangeWorkspaceName = _this._register(new Emitter());
        _this.onDidChangeWorkspaceName = _this._onDidChangeWorkspaceName.event;
        _this._onDidChangeWorkbenchState = _this._register(new Emitter());
        _this.onDidChangeWorkbenchState = _this._onDidChangeWorkbenchState.event;
        _this.defaultConfiguration = new DefaultConfigurationModel();
        _this.userConfiguration = _this._register(new UserConfiguration(environmentService.appSettingsPath));
        _this.workspaceConfiguration = _this._register(new WorkspaceConfiguration());
        _this._register(_this.userConfiguration.onDidChangeConfiguration(function () { return _this.onUserConfigurationChanged(); }));
        _this._register(_this.workspaceConfiguration.onDidUpdateConfiguration(function () { return _this.onWorkspaceConfigurationChanged(); }));
        _this._register(Registry.as(Extensions.Configuration).onDidSchemaChange(function (e) { return _this.registerConfigurationSchemas(); }));
        _this._register(Registry.as(Extensions.Configuration).onDidRegisterConfiguration(function (configurationProperties) { return _this.onDefaultConfigurationChanged(configurationProperties); }));
        _this.workspaceEditingQueue = new Queue();
        return _this;
    }
    // Workspace Context Service Impl
    WorkspaceService.prototype.getWorkspace = function () {
        return this.workspace;
    };
    WorkspaceService.prototype.getWorkbenchState = function () {
        // Workspace has configuration file
        if (this.workspace.configuration) {
            return 3 /* WORKSPACE */;
        }
        // Folder has single root
        if (this.workspace.folders.length === 1) {
            return 2 /* FOLDER */;
        }
        // Empty
        return 1 /* EMPTY */;
    };
    WorkspaceService.prototype.getWorkspaceFolder = function (resource) {
        return this.workspace.getFolder(resource);
    };
    WorkspaceService.prototype.addFolders = function (foldersToAdd, index) {
        return this.updateFolders(foldersToAdd, [], index);
    };
    WorkspaceService.prototype.removeFolders = function (foldersToRemove) {
        return this.updateFolders([], foldersToRemove);
    };
    WorkspaceService.prototype.updateFolders = function (foldersToAdd, foldersToRemove, index) {
        var _this = this;
        assert.ok(this.jsonEditingService, 'Workbench is not initialized yet');
        return Promise.resolve(this.workspaceEditingQueue.queue(function () { return _this.doUpdateFolders(foldersToAdd, foldersToRemove, index); }));
    };
    WorkspaceService.prototype.isInsideWorkspace = function (resource) {
        return !!this.getWorkspaceFolder(resource);
    };
    WorkspaceService.prototype.isCurrentWorkspace = function (workspaceIdentifier) {
        switch (this.getWorkbenchState()) {
            case 2 /* FOLDER */:
                return isSingleFolderWorkspaceIdentifier(workspaceIdentifier) && isEqual(workspaceIdentifier, this.workspace.folders[0].uri);
            case 3 /* WORKSPACE */:
                return isWorkspaceIdentifier(workspaceIdentifier) && this.workspace.id === workspaceIdentifier.id;
        }
        return false;
    };
    WorkspaceService.prototype.doUpdateFolders = function (foldersToAdd, foldersToRemove, index) {
        var _this = this;
        if (this.getWorkbenchState() !== 3 /* WORKSPACE */) {
            return Promise.resolve(void 0); // we need a workspace to begin with
        }
        if (foldersToAdd.length + foldersToRemove.length === 0) {
            return Promise.resolve(void 0); // nothing to do
        }
        var foldersHaveChanged = false;
        // Remove first (if any)
        var currentWorkspaceFolders = this.getWorkspace().folders;
        var newStoredFolders = currentWorkspaceFolders.map(function (f) { return f.raw; }).filter(function (folder, index) {
            if (!isStoredWorkspaceFolder(folder)) {
                return true; // keep entries which are unrelated
            }
            return !_this.contains(foldersToRemove, currentWorkspaceFolders[index].uri); // keep entries which are unrelated
        });
        foldersHaveChanged = currentWorkspaceFolders.length !== newStoredFolders.length;
        // Add afterwards (if any)
        if (foldersToAdd.length) {
            // Recompute current workspace folders if we have folders to add
            var workspaceConfigFolder_1 = dirname(this.getWorkspace().configuration.fsPath);
            currentWorkspaceFolders = toWorkspaceFolders(newStoredFolders, URI.file(workspaceConfigFolder_1));
            var currentWorkspaceFolderUris_1 = currentWorkspaceFolders.map(function (folder) { return folder.uri; });
            var storedFoldersToAdd_1 = [];
            foldersToAdd.forEach(function (folderToAdd) {
                if (_this.contains(currentWorkspaceFolderUris_1, folderToAdd.uri)) {
                    return; // already existing
                }
                var storedFolder;
                // File resource: use "path" property
                if (folderToAdd.uri.scheme === Schemas.file) {
                    storedFolder = {
                        path: massageFolderPathForWorkspace(folderToAdd.uri.fsPath, workspaceConfigFolder_1, newStoredFolders)
                    };
                }
                // Any other resource: use "uri" property
                else {
                    storedFolder = {
                        uri: folderToAdd.uri.toString(true)
                    };
                }
                if (folderToAdd.name) {
                    storedFolder.name = folderToAdd.name;
                }
                storedFoldersToAdd_1.push(storedFolder);
            });
            // Apply to array of newStoredFolders
            if (storedFoldersToAdd_1.length > 0) {
                foldersHaveChanged = true;
                if (typeof index === 'number' && index >= 0 && index < newStoredFolders.length) {
                    newStoredFolders = newStoredFolders.slice(0);
                    newStoredFolders.splice.apply(newStoredFolders, [index, 0].concat(storedFoldersToAdd_1));
                }
                else {
                    newStoredFolders = newStoredFolders.concat(storedFoldersToAdd_1);
                }
            }
        }
        // Set folders if we recorded a change
        if (foldersHaveChanged) {
            return this.setFolders(newStoredFolders);
        }
        return Promise.resolve(void 0);
    };
    WorkspaceService.prototype.setFolders = function (folders) {
        var _this = this;
        return this.workspaceConfiguration.setFolders(folders, this.jsonEditingService)
            .then(function () { return _this.onWorkspaceConfigurationChanged(); });
    };
    WorkspaceService.prototype.contains = function (resources, toCheck) {
        return resources.some(function (resource) {
            if (isLinux) {
                return resource.toString() === toCheck.toString();
            }
            return resource.toString().toLowerCase() === toCheck.toString().toLowerCase();
        });
    };
    // Workspace Configuration Service Impl
    WorkspaceService.prototype.getConfigurationData = function () {
        var configurationData = this._configuration.toData();
        configurationData.isComplete = this.cachedFolderConfigs.values().every(function (c) { return c.loaded; });
        return configurationData;
    };
    WorkspaceService.prototype.getValue = function (arg1, arg2) {
        var section = typeof arg1 === 'string' ? arg1 : void 0;
        var overrides = isConfigurationOverrides(arg1) ? arg1 : isConfigurationOverrides(arg2) ? arg2 : void 0;
        return this._configuration.getValue(section, overrides);
    };
    WorkspaceService.prototype.updateValue = function (key, value, arg3, arg4, donotNotifyError) {
        assert.ok(this.configurationEditingService, 'Workbench is not initialized yet');
        var overrides = isConfigurationOverrides(arg3) ? arg3 : void 0;
        var target = this.deriveConfigurationTarget(key, value, overrides, overrides ? arg4 : arg3);
        return target ? this.writeConfigurationValue(key, value, target, overrides, donotNotifyError)
            : Promise.resolve(null);
    };
    WorkspaceService.prototype.reloadConfiguration = function (folder, key) {
        var _this = this;
        if (folder) {
            return this.reloadWorkspaceFolderConfiguration(folder, key);
        }
        return this.reloadUserConfiguration()
            .then(function () { return _this.reloadWorkspaceConfiguration(); })
            .then(function () { return _this.loadConfiguration(); });
    };
    WorkspaceService.prototype.inspect = function (key, overrides) {
        return this._configuration.inspect(key, overrides);
    };
    WorkspaceService.prototype.keys = function () {
        return this._configuration.keys();
    };
    WorkspaceService.prototype.initialize = function (arg, postInitialisationTask) {
        var _this = this;
        if (postInitialisationTask === void 0) { postInitialisationTask = function () { return null; }; }
        return this.createWorkspace(arg)
            .then(function (workspace) { return _this.updateWorkspaceAndInitializeConfiguration(workspace, postInitialisationTask); });
    };
    WorkspaceService.prototype.acquireFileService = function (fileService) {
        var _this = this;
        this.fileService = fileService;
        var changedWorkspaceFolders = [];
        Promise.all(this.cachedFolderConfigs.values()
            .map(function (folderConfiguration) { return folderConfiguration.adopt(fileService)
            .then(function (result) {
            if (result) {
                changedWorkspaceFolders.push(folderConfiguration.workspaceFolder);
            }
        }); }))
            .then(function () {
            for (var _i = 0, changedWorkspaceFolders_1 = changedWorkspaceFolders; _i < changedWorkspaceFolders_1.length; _i++) {
                var workspaceFolder = changedWorkspaceFolders_1[_i];
                _this.onWorkspaceFolderConfigurationChanged(workspaceFolder);
            }
        });
    };
    WorkspaceService.prototype.acquireInstantiationService = function (instantiationService) {
        this.configurationEditingService = instantiationService.createInstance(ConfigurationEditingService);
        this.jsonEditingService = instantiationService.createInstance(JSONEditingService);
    };
    WorkspaceService.prototype.createWorkspace = function (arg) {
        if (isWorkspaceIdentifier(arg)) {
            return this.createMultiFolderWorkspace(arg);
        }
        if (isSingleFolderWorkspaceInitializationPayload(arg)) {
            return this.createSingleFolderWorkspace(arg);
        }
        return this.createEmptyWorkspace(arg);
    };
    WorkspaceService.prototype.createMultiFolderWorkspace = function (workspaceIdentifier) {
        var _this = this;
        var workspaceConfigPath = URI.file(workspaceIdentifier.configPath);
        return this.workspaceConfiguration.load(workspaceConfigPath)
            .then(function () {
            var workspaceFolders = toWorkspaceFolders(_this.workspaceConfiguration.getFolders(), URI.file(dirname(workspaceConfigPath.fsPath)));
            var workspaceId = workspaceIdentifier.id;
            return new Workspace(workspaceId, workspaceFolders, workspaceConfigPath);
        });
    };
    WorkspaceService.prototype.createSingleFolderWorkspace = function (singleFolder) {
        var folder = singleFolder.folder;
        var configuredFolders;
        if (folder.scheme === 'file') {
            configuredFolders = [{ path: folder.fsPath }];
        }
        else {
            configuredFolders = [{ uri: folder.toString() }];
        }
        return Promise.resolve(new Workspace(singleFolder.id, toWorkspaceFolders(configuredFolders)));
    };
    WorkspaceService.prototype.createEmptyWorkspace = function (emptyWorkspace) {
        return Promise.resolve(new Workspace(emptyWorkspace.id));
    };
    WorkspaceService.prototype.updateWorkspaceAndInitializeConfiguration = function (workspace, postInitialisationTask) {
        var _this = this;
        var hasWorkspaceBefore = !!this.workspace;
        var previousState;
        var previousWorkspacePath;
        var previousFolders;
        if (hasWorkspaceBefore) {
            previousState = this.getWorkbenchState();
            previousWorkspacePath = this.workspace.configuration ? this.workspace.configuration.fsPath : void 0;
            previousFolders = this.workspace.folders;
            this.workspace.update(workspace);
        }
        else {
            this.workspace = workspace;
        }
        return this.initializeConfiguration().then(function () {
            postInitialisationTask(); // Post initialisation task should be run before triggering events.
            // Trigger changes after configuration initialization so that configuration is up to date.
            if (hasWorkspaceBefore) {
                var newState = _this.getWorkbenchState();
                if (previousState && newState !== previousState) {
                    _this._onDidChangeWorkbenchState.fire(newState);
                }
                var newWorkspacePath = _this.workspace.configuration ? _this.workspace.configuration.fsPath : void 0;
                if (previousWorkspacePath && newWorkspacePath !== previousWorkspacePath || newState !== previousState) {
                    _this._onDidChangeWorkspaceName.fire();
                }
                var folderChanges = _this.compareFolders(previousFolders, _this.workspace.folders);
                if (folderChanges && (folderChanges.added.length || folderChanges.removed.length || folderChanges.changed.length)) {
                    _this._onDidChangeWorkspaceFolders.fire(folderChanges);
                }
            }
        });
    };
    WorkspaceService.prototype.compareFolders = function (currentFolders, newFolders) {
        var result = { added: [], removed: [], changed: [] };
        result.added = newFolders.filter(function (newFolder) { return !currentFolders.some(function (currentFolder) { return newFolder.uri.toString() === currentFolder.uri.toString(); }); });
        for (var currentIndex = 0; currentIndex < currentFolders.length; currentIndex++) {
            var currentFolder = currentFolders[currentIndex];
            var newIndex = 0;
            for (newIndex = 0; newIndex < newFolders.length && currentFolder.uri.toString() !== newFolders[newIndex].uri.toString(); newIndex++) { }
            if (newIndex < newFolders.length) {
                if (currentIndex !== newIndex || currentFolder.name !== newFolders[newIndex].name) {
                    result.changed.push(currentFolder);
                }
            }
            else {
                result.removed.push(currentFolder);
            }
        }
        return result;
    };
    WorkspaceService.prototype.initializeConfiguration = function () {
        this.registerConfigurationSchemas();
        return this.loadConfiguration();
    };
    WorkspaceService.prototype.reloadUserConfiguration = function (key) {
        return this.userConfiguration.reload();
    };
    WorkspaceService.prototype.reloadWorkspaceConfiguration = function (key) {
        var _this = this;
        var workbenchState = this.getWorkbenchState();
        if (workbenchState === 2 /* FOLDER */) {
            return this.onWorkspaceFolderConfigurationChanged(this.workspace.folders[0], key);
        }
        if (workbenchState === 3 /* WORKSPACE */) {
            return this.workspaceConfiguration.reload().then(function () { return _this.onWorkspaceConfigurationChanged(); });
        }
        return Promise.resolve(null);
    };
    WorkspaceService.prototype.reloadWorkspaceFolderConfiguration = function (folder, key) {
        return this.onWorkspaceFolderConfigurationChanged(folder, key);
    };
    WorkspaceService.prototype.loadConfiguration = function () {
        var _this = this;
        // reset caches
        this.cachedFolderConfigs = new ResourceMap();
        var folders = this.workspace.folders;
        return this.loadFolderConfigurations(folders)
            .then(function (folderConfigurations) {
            var workspaceConfiguration = _this.getWorkspaceConfigurationModel(folderConfigurations);
            var folderConfigurationModels = new ResourceMap();
            folderConfigurations.forEach(function (folderConfiguration, index) { return folderConfigurationModels.set(folders[index].uri, folderConfiguration); });
            var currentConfiguration = _this._configuration;
            _this._configuration = new Configuration(_this.defaultConfiguration, _this.userConfiguration.configurationModel, workspaceConfiguration, folderConfigurationModels, new ConfigurationModel(), new ResourceMap(), _this.getWorkbenchState() !== 1 /* EMPTY */ ? _this.workspace : null); //TODO: Sandy Avoid passing null
            if (currentConfiguration) {
                var changedKeys = _this._configuration.compare(currentConfiguration);
                _this.triggerConfigurationChange(new ConfigurationChangeEvent().change(changedKeys), 2 /* WORKSPACE */);
            }
            else {
                _this._onDidChangeConfiguration.fire(new AllKeysConfigurationChangeEvent(_this._configuration, 2 /* WORKSPACE */, _this.getTargetConfiguration(2 /* WORKSPACE */)));
            }
        });
    };
    WorkspaceService.prototype.getWorkspaceConfigurationModel = function (folderConfigurations) {
        switch (this.getWorkbenchState()) {
            case 2 /* FOLDER */:
                return folderConfigurations[0];
            case 3 /* WORKSPACE */:
                return this.workspaceConfiguration.getConfiguration();
            default:
                return new ConfigurationModel();
        }
    };
    WorkspaceService.prototype.onDefaultConfigurationChanged = function (keys) {
        var _this = this;
        this.defaultConfiguration = new DefaultConfigurationModel();
        this.registerConfigurationSchemas();
        if (this.workspace && this._configuration) {
            this._configuration.updateDefaultConfiguration(this.defaultConfiguration);
            if (this.getWorkbenchState() === 2 /* FOLDER */) {
                this._configuration.updateWorkspaceConfiguration(this.cachedFolderConfigs.get(this.workspace.folders[0].uri).reprocess());
            }
            else {
                this._configuration.updateWorkspaceConfiguration(this.workspaceConfiguration.reprocessWorkspaceSettings());
                this.workspace.folders.forEach(function (folder) { return _this._configuration.updateFolderConfiguration(folder.uri, _this.cachedFolderConfigs.get(folder.uri).reprocess()); });
            }
            this.triggerConfigurationChange(new ConfigurationChangeEvent().change(keys), 4 /* DEFAULT */);
        }
    };
    WorkspaceService.prototype.registerConfigurationSchemas = function () {
        if (this.workspace) {
            var jsonRegistry = Registry.as(JSONExtensions.JSONContribution);
            var convertToNotSuggestedProperties = function (properties, errorMessage) {
                return Object.keys(properties).reduce(function (result, property) {
                    result[property] = deepClone(properties[property]);
                    result[property].deprecationMessage = errorMessage;
                    return result;
                }, {});
            };
            var allSettingsSchema = { properties: allSettings.properties, patternProperties: allSettings.patternProperties, additionalProperties: false, errorMessage: 'Unknown configuration setting' };
            var unsupportedApplicationSettings = convertToNotSuggestedProperties(applicationSettings.properties, localize('unsupportedApplicationSetting', "This setting can be applied only in User Settings"));
            var workspaceSettingsSchema = { properties: __assign({}, unsupportedApplicationSettings, windowSettings.properties, resourceSettings.properties), patternProperties: allSettings.patternProperties, additionalProperties: false, errorMessage: 'Unknown configuration setting' };
            jsonRegistry.registerSchema(defaultSettingsSchemaId, allSettingsSchema);
            jsonRegistry.registerSchema(userSettingsSchemaId, allSettingsSchema);
            if (3 /* WORKSPACE */ === this.getWorkbenchState()) {
                var unsupportedWindowSettings = convertToNotSuggestedProperties(windowSettings.properties, localize('unsupportedWindowSetting', "This setting cannot be applied now. It will be applied when you open this folder directly."));
                var folderSettingsSchema = { properties: __assign({}, unsupportedApplicationSettings, unsupportedWindowSettings, resourceSettings.properties), patternProperties: allSettings.patternProperties, additionalProperties: false, errorMessage: 'Unknown configuration setting' };
                jsonRegistry.registerSchema(workspaceSettingsSchemaId, workspaceSettingsSchema);
                jsonRegistry.registerSchema(folderSettingsSchemaId, folderSettingsSchema);
            }
            else {
                jsonRegistry.registerSchema(workspaceSettingsSchemaId, workspaceSettingsSchema);
                jsonRegistry.registerSchema(folderSettingsSchemaId, workspaceSettingsSchema);
            }
        }
    };
    WorkspaceService.prototype.onUserConfigurationChanged = function () {
        var keys = this._configuration.compareAndUpdateUserConfiguration(this.userConfiguration.configurationModel);
        this.triggerConfigurationChange(keys, 1 /* USER */);
    };
    WorkspaceService.prototype.onWorkspaceConfigurationChanged = function () {
        var _this = this;
        if (this.workspace && this.workspace.configuration && this._configuration) {
            var workspaceConfigurationChangeEvent_1 = this._configuration.compareAndUpdateWorkspaceConfiguration(this.workspaceConfiguration.getConfiguration());
            var configuredFolders = toWorkspaceFolders(this.workspaceConfiguration.getFolders(), URI.file(dirname(this.workspace.configuration.fsPath)));
            var changes_1 = this.compareFolders(this.workspace.folders, configuredFolders);
            if (changes_1.added.length || changes_1.removed.length || changes_1.changed.length) {
                this.workspace.folders = configuredFolders;
                return this.onFoldersChanged()
                    .then(function (foldersConfigurationChangeEvent) {
                    _this.triggerConfigurationChange(foldersConfigurationChangeEvent.change(workspaceConfigurationChangeEvent_1), 3 /* WORKSPACE_FOLDER */);
                    _this._onDidChangeWorkspaceFolders.fire(changes_1);
                });
            }
            else {
                this.triggerConfigurationChange(workspaceConfigurationChangeEvent_1, 2 /* WORKSPACE */);
            }
        }
        return Promise.resolve(null);
    };
    WorkspaceService.prototype.onWorkspaceFolderConfigurationChanged = function (folder, key) {
        var _this = this;
        return this.loadFolderConfigurations([folder])
            .then(function (_a) {
            var folderConfiguration = _a[0];
            var folderChangedKeys = _this._configuration.compareAndUpdateFolderConfiguration(folder.uri, folderConfiguration);
            if (_this.getWorkbenchState() === 2 /* FOLDER */) {
                var workspaceChangedKeys = _this._configuration.compareAndUpdateWorkspaceConfiguration(folderConfiguration);
                _this.triggerConfigurationChange(workspaceChangedKeys, 2 /* WORKSPACE */);
            }
            else {
                _this.triggerConfigurationChange(folderChangedKeys, 3 /* WORKSPACE_FOLDER */);
            }
        });
    };
    WorkspaceService.prototype.onFoldersChanged = function () {
        var _this = this;
        var changeEvent = new ConfigurationChangeEvent();
        var _loop_1 = function (key) {
            if (!this_1.workspace.folders.filter(function (folder) { return folder.uri.toString() === key.toString(); })[0]) {
                var folderConfiguration = this_1.cachedFolderConfigs.get(key);
                folderConfiguration.dispose();
                this_1.cachedFolderConfigs.delete(key);
                changeEvent = changeEvent.change(this_1._configuration.compareAndDeleteFolderConfiguration(key));
            }
        };
        var this_1 = this;
        // Remove the configurations of deleted folders
        for (var _i = 0, _a = this.cachedFolderConfigs.keys(); _i < _a.length; _i++) {
            var key = _a[_i];
            _loop_1(key);
        }
        var toInitialize = this.workspace.folders.filter(function (folder) { return !_this.cachedFolderConfigs.has(folder.uri); });
        if (toInitialize.length) {
            return this.loadFolderConfigurations(toInitialize)
                .then(function (folderConfigurations) {
                folderConfigurations.forEach(function (folderConfiguration, index) {
                    changeEvent = changeEvent.change(_this._configuration.compareAndUpdateFolderConfiguration(toInitialize[index].uri, folderConfiguration));
                });
                return changeEvent;
            });
        }
        return Promise.resolve(changeEvent);
    };
    WorkspaceService.prototype.loadFolderConfigurations = function (folders) {
        var _this = this;
        return Promise.all(folders.map(function (folder) {
            var folderConfiguration = _this.cachedFolderConfigs.get(folder.uri);
            if (!folderConfiguration) {
                folderConfiguration = new FolderConfiguration(folder, _this.workspaceSettingsRootFolder, _this.getWorkbenchState(), _this.environmentService, _this.fileService);
                _this._register(folderConfiguration.onDidChange(function () { return _this.onWorkspaceFolderConfigurationChanged(folder); }));
                _this.cachedFolderConfigs.set(folder.uri, _this._register(folderConfiguration));
            }
            return folderConfiguration.loadConfiguration();
        }).slice());
    };
    WorkspaceService.prototype.writeConfigurationValue = function (key, value, target, overrides, donotNotifyError) {
        var _this = this;
        if (target === 4 /* DEFAULT */) {
            return Promise.reject(new Error('Invalid configuration target'));
        }
        if (target === 5 /* MEMORY */) {
            this._configuration.updateValue(key, value, overrides);
            this.triggerConfigurationChange(new ConfigurationChangeEvent().change(overrides.overrideIdentifier ? [keyFromOverrideIdentifier(overrides.overrideIdentifier)] : [key], overrides.resource), target);
            return Promise.resolve(null);
        }
        return this.configurationEditingService.writeConfiguration(target, { key: key, value: value }, { scopes: overrides, donotNotifyError: donotNotifyError })
            .then(function () {
            switch (target) {
                case 1 /* USER */:
                    return _this.reloadUserConfiguration();
                case 2 /* WORKSPACE */:
                    return _this.reloadWorkspaceConfiguration();
                case 3 /* WORKSPACE_FOLDER */:
                    var workspaceFolder = overrides && overrides.resource ? _this.workspace.getFolder(overrides.resource) : null;
                    if (workspaceFolder) {
                        return _this.reloadWorkspaceFolderConfiguration(_this.workspace.getFolder(overrides.resource), key);
                    }
            }
            return null;
        });
    };
    WorkspaceService.prototype.deriveConfigurationTarget = function (key, value, overrides, target) {
        if (target) {
            return target;
        }
        if (value === void 0) {
            // Ignore. But expected is to remove the value from all targets
            return void 0;
        }
        var inspect = this.inspect(key, overrides);
        if (equals(value, inspect.value)) {
            // No change. So ignore.
            return void 0;
        }
        if (inspect.workspaceFolder !== void 0) {
            return 3 /* WORKSPACE_FOLDER */;
        }
        if (inspect.workspace !== void 0) {
            return 2 /* WORKSPACE */;
        }
        return 1 /* USER */;
    };
    WorkspaceService.prototype.triggerConfigurationChange = function (configurationEvent, target) {
        if (configurationEvent.affectedKeys.length) {
            configurationEvent.telemetryData(target, this.getTargetConfiguration(target));
            this._onDidChangeConfiguration.fire(new WorkspaceConfigurationChangeEvent(configurationEvent, this.workspace));
        }
    };
    WorkspaceService.prototype.getTargetConfiguration = function (target) {
        switch (target) {
            case 4 /* DEFAULT */:
                return this._configuration.defaults.contents;
            case 1 /* USER */:
                return this._configuration.user.contents;
            case 2 /* WORKSPACE */:
                return this._configuration.workspace.contents;
        }
        return {};
    };
    return WorkspaceService;
}(Disposable));
export { WorkspaceService };
var DefaultConfigurationExportHelper = /** @class */ (function () {
    function DefaultConfigurationExportHelper(environmentService, extensionService, commandService) {
        this.extensionService = extensionService;
        this.commandService = commandService;
        if (environmentService.args['export-default-configuration']) {
            this.writeConfigModelAndQuit(environmentService.args['export-default-configuration']);
        }
    }
    DefaultConfigurationExportHelper.prototype.writeConfigModelAndQuit = function (targetPath) {
        var _this = this;
        return Promise.resolve(this.extensionService.whenInstalledExtensionsRegistered())
            .then(function () { return _this.writeConfigModel(targetPath); })
            .then(function () { return _this.commandService.executeCommand('workbench.action.quit'); })
            .then(function () { });
    };
    DefaultConfigurationExportHelper.prototype.writeConfigModel = function (targetPath) {
        var config = this.getConfigModel();
        var resultString = JSON.stringify(config, undefined, '  ');
        return writeFile(targetPath, resultString);
    };
    DefaultConfigurationExportHelper.prototype.getConfigModel = function () {
        var configRegistry = Registry.as(Extensions.Configuration);
        var configurations = configRegistry.getConfigurations().slice();
        var settings = [];
        var processProperty = function (name, prop) {
            var propDetails = {
                name: name,
                description: prop.description || prop.markdownDescription || '',
                default: prop.default,
                type: prop.type
            };
            if (prop.enum) {
                propDetails.enum = prop.enum;
            }
            if (prop.enumDescriptions || prop.markdownEnumDescriptions) {
                propDetails.enumDescriptions = prop.enumDescriptions || prop.markdownEnumDescriptions;
            }
            settings.push(propDetails);
        };
        var processConfig = function (config) {
            if (config.properties) {
                for (var name_1 in config.properties) {
                    processProperty(name_1, config.properties[name_1]);
                }
            }
            if (config.allOf) {
                config.allOf.forEach(processConfig);
            }
        };
        configurations.forEach(processConfig);
        var excludedProps = configRegistry.getExcludedConfigurationProperties();
        for (var name_2 in excludedProps) {
            processProperty(name_2, excludedProps[name_2]);
        }
        var result = {
            settings: settings.sort(function (a, b) { return a.name.localeCompare(b.name); }),
            buildTime: Date.now(),
            commit: product.commit,
            buildNumber: product.settingsSearchBuildId
        };
        return result;
    };
    DefaultConfigurationExportHelper = __decorate([
        __param(0, IEnvironmentService),
        __param(1, IExtensionService),
        __param(2, ICommandService)
    ], DefaultConfigurationExportHelper);
    return DefaultConfigurationExportHelper;
}());
export { DefaultConfigurationExportHelper };
