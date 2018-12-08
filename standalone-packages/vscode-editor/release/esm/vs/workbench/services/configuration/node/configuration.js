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
import { URI } from '../../../../base/common/uri.js';
import { createHash } from '../../../../../crypto.js';
import * as paths from '../../../../base/common/paths.js';
import * as resources from '../../../../base/common/resources.js';
import { Emitter } from '../../../../base/common/event.js';
import * as pfs from '../../../../base/node/pfs.js';
import * as errors from '../../../../base/common/errors.js';
import * as collections from '../../../../base/common/collections.js';
import { Disposable, dispose } from '../../../../base/common/lifecycle.js';
import { RunOnceScheduler, Delayer } from '../../../../base/common/async.js';
import { isLinux } from '../../../../base/common/platform.js';
import { ConfigWatcher } from '../../../../base/node/config.js';
import { ConfigurationModel } from '../../../../platform/configuration/common/configurationModels.js';
import { WorkspaceConfigurationModelParser, FolderSettingsModelParser, StandaloneConfigurationModelParser } from '../common/configurationModels.js';
import { FOLDER_SETTINGS_PATH, TASKS_CONFIGURATION_KEY, FOLDER_SETTINGS_NAME, LAUNCH_CONFIGURATION_KEY } from '../common/configuration.js';
import * as extfs from '../../../../base/node/extfs.js';
import { relative } from '../../../../../path.js';
import { equals } from '../../../../base/common/objects.js';
import { Schemas } from '../../../../base/common/network.js';
var WorkspaceConfiguration = /** @class */ (function (_super) {
    __extends(WorkspaceConfiguration, _super);
    function WorkspaceConfiguration() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._workspaceConfigurationWatcherDisposables = [];
        _this._onDidUpdateConfiguration = _this._register(new Emitter());
        _this.onDidUpdateConfiguration = _this._onDidUpdateConfiguration.event;
        _this._workspaceConfigurationModelParser = new WorkspaceConfigurationModelParser(_this._workspaceConfigPath ? _this._workspaceConfigPath.fsPath : '');
        _this._cache = new ConfigurationModel();
        return _this;
    }
    WorkspaceConfiguration.prototype.load = function (workspaceConfigPath) {
        var _this = this;
        if (this._workspaceConfigPath && this._workspaceConfigPath.fsPath === workspaceConfigPath.fsPath) {
            return this.reload();
        }
        this._workspaceConfigPath = workspaceConfigPath;
        return new Promise(function (c, e) {
            var defaultConfig = new WorkspaceConfigurationModelParser(_this._workspaceConfigPath.fsPath);
            defaultConfig.parse(JSON.stringify({ folders: [] }, null, '\t'));
            if (_this._workspaceConfigurationWatcher) {
                _this.disposeConfigurationWatcher();
            }
            _this._workspaceConfigurationWatcher = new ConfigWatcher(_this._workspaceConfigPath.fsPath, {
                changeBufferDelay: 300,
                onError: function (error) { return errors.onUnexpectedError(error); },
                defaultConfig: defaultConfig,
                parse: function (content, parseErrors) {
                    _this._workspaceConfigurationModelParser = new WorkspaceConfigurationModelParser(_this._workspaceConfigPath.fsPath);
                    _this._workspaceConfigurationModelParser.parse(content);
                    parseErrors = _this._workspaceConfigurationModelParser.errors.slice();
                    _this.consolidate();
                    return _this._workspaceConfigurationModelParser;
                }, initCallback: function () { return c(null); }
            });
            _this.listenToWatcher();
        });
    };
    WorkspaceConfiguration.prototype.reload = function () {
        var _this = this;
        this.stopListeningToWatcher();
        return new Promise(function (c) { return _this._workspaceConfigurationWatcher.reload(function () {
            _this.listenToWatcher();
            c(null);
        }); });
    };
    WorkspaceConfiguration.prototype.getFolders = function () {
        return this._workspaceConfigurationModelParser.folders;
    };
    WorkspaceConfiguration.prototype.setFolders = function (folders, jsonEditingService) {
        var _this = this;
        return jsonEditingService.write(this._workspaceConfigPath, { key: 'folders', value: folders }, true)
            .then(function () { return _this.reload(); });
    };
    WorkspaceConfiguration.prototype.getConfiguration = function () {
        return this._cache;
    };
    WorkspaceConfiguration.prototype.reprocessWorkspaceSettings = function () {
        this._workspaceConfigurationModelParser.reprocessWorkspaceSettings();
        this.consolidate();
        return this.getConfiguration();
    };
    WorkspaceConfiguration.prototype.listenToWatcher = function () {
        var _this = this;
        this._workspaceConfigurationWatcher.onDidUpdateConfiguration(function () { return _this._onDidUpdateConfiguration.fire(); }, this, this._workspaceConfigurationWatcherDisposables);
    };
    WorkspaceConfiguration.prototype.stopListeningToWatcher = function () {
        this._workspaceConfigurationWatcherDisposables = dispose(this._workspaceConfigurationWatcherDisposables);
    };
    WorkspaceConfiguration.prototype.consolidate = function () {
        this._cache = this._workspaceConfigurationModelParser.settingsModel.merge(this._workspaceConfigurationModelParser.launchModel);
    };
    WorkspaceConfiguration.prototype.disposeConfigurationWatcher = function () {
        this.stopListeningToWatcher();
        if (this._workspaceConfigurationWatcher) {
            this._workspaceConfigurationWatcher.dispose();
        }
    };
    WorkspaceConfiguration.prototype.dispose = function () {
        this.disposeConfigurationWatcher();
        _super.prototype.dispose.call(this);
    };
    return WorkspaceConfiguration;
}(Disposable));
export { WorkspaceConfiguration };
function isFolderConfigurationFile(resource) {
    var configurationNameResource = URI.from({ scheme: resource.scheme, path: resources.basename(resource) });
    return [FOLDER_SETTINGS_NAME + ".json", TASKS_CONFIGURATION_KEY + ".json", LAUNCH_CONFIGURATION_KEY + ".json"].some(function (configurationFileName) {
        return resources.isEqual(configurationNameResource, URI.from({ scheme: resource.scheme, path: configurationFileName }));
    }); // only workspace config files
}
function isFolderSettingsConfigurationFile(resource) {
    return resources.isEqual(URI.from({ scheme: resource.scheme, path: resources.basename(resource) }), URI.from({ scheme: resource.scheme, path: FOLDER_SETTINGS_NAME + ".json" }));
}
var AbstractFolderConfiguration = /** @class */ (function (_super) {
    __extends(AbstractFolderConfiguration, _super);
    function AbstractFolderConfiguration(folder, workbenchState, from) {
        var _this = _super.call(this) || this;
        _this.folder = folder;
        _this._loaded = false;
        _this._onDidChange = _this._register(new Emitter());
        _this.onDidChange = _this._onDidChange.event;
        _this._folderSettingsModelParser = from ? from._folderSettingsModelParser : new FolderSettingsModelParser(FOLDER_SETTINGS_PATH, 3 /* WORKSPACE */ === workbenchState ? [3 /* RESOURCE */] : [2 /* WINDOW */, 3 /* RESOURCE */]);
        _this._standAloneConfigurations = from ? from._standAloneConfigurations : [];
        _this._cache = from ? from._cache : new ConfigurationModel();
        return _this;
    }
    Object.defineProperty(AbstractFolderConfiguration.prototype, "loaded", {
        get: function () {
            return this._loaded;
        },
        enumerable: true,
        configurable: true
    });
    AbstractFolderConfiguration.prototype.loadConfiguration = function () {
        var _this = this;
        return this.loadFolderConfigurationContents()
            .then(function (contents) {
            // reset
            _this._standAloneConfigurations = [];
            _this._folderSettingsModelParser.parse('');
            // parse
            _this.parseContents(contents);
            // Consolidate (support *.json files in the workspace settings folder)
            _this.consolidate();
            _this._loaded = true;
            return _this._cache;
        });
    };
    AbstractFolderConfiguration.prototype.reprocess = function () {
        var oldContents = this._folderSettingsModelParser.configurationModel.contents;
        this._folderSettingsModelParser.reprocess();
        if (!equals(oldContents, this._folderSettingsModelParser.configurationModel.contents)) {
            this.consolidate();
        }
        return this._cache;
    };
    AbstractFolderConfiguration.prototype.consolidate = function () {
        var _a;
        this._cache = (_a = this._folderSettingsModelParser.configurationModel).merge.apply(_a, this._standAloneConfigurations);
    };
    AbstractFolderConfiguration.prototype.parseContents = function (contents) {
        for (var _i = 0, contents_1 = contents; _i < contents_1.length; _i++) {
            var content = contents_1[_i];
            if (isFolderSettingsConfigurationFile(content.resource)) {
                this._folderSettingsModelParser.parse(content.value);
            }
            else {
                var name_1 = resources.basename(content.resource);
                var matches = /([^\.]*)*\.json/.exec(name_1);
                if (matches && matches[1]) {
                    var standAloneConfigurationModelParser = new StandaloneConfigurationModelParser(content.resource.toString(), matches[1]);
                    standAloneConfigurationModelParser.parse(content.value);
                    this._standAloneConfigurations.push(standAloneConfigurationModelParser.configurationModel);
                }
            }
        }
    };
    return AbstractFolderConfiguration;
}(Disposable));
export { AbstractFolderConfiguration };
var NodeBasedFolderConfiguration = /** @class */ (function (_super) {
    __extends(NodeBasedFolderConfiguration, _super);
    function NodeBasedFolderConfiguration(folder, configFolderRelativePath, workbenchState) {
        var _this = _super.call(this, folder, workbenchState) || this;
        _this.folderConfigurationPath = resources.joinPath(folder, configFolderRelativePath);
        return _this;
    }
    NodeBasedFolderConfiguration.prototype.loadFolderConfigurationContents = function () {
        var _this = this;
        return this.resolveStat(this.folderConfigurationPath).then(function (stat) {
            if (!stat.isDirectory) {
                return Promise.resolve([]);
            }
            return _this.resolveContents(stat.children.filter(function (stat) { return isFolderConfigurationFile(stat.resource); })
                .map(function (stat) { return stat.resource; }));
        }, function (err) { return []; } /* never fail this call */)
            .then(null, errors.onUnexpectedError);
    };
    NodeBasedFolderConfiguration.prototype.resolveContents = function (resources) {
        return Promise.all(resources.map(function (resource) {
            return pfs.readFile(resource.fsPath)
                .then(function (contents) { return ({ resource: resource, value: contents.toString() }); });
        }));
    };
    NodeBasedFolderConfiguration.prototype.resolveStat = function (resource) {
        return new Promise(function (c, e) {
            extfs.readdir(resource.fsPath, function (error, children) {
                if (error) {
                    if (error.code === 'ENOTDIR') {
                        c({ resource: resource });
                    }
                    else {
                        e(error);
                    }
                }
                else {
                    c({
                        resource: resource,
                        isDirectory: true,
                        children: children.map(function (child) { return { resource: resources.joinPath(resource, child) }; })
                    });
                }
            });
        });
    };
    return NodeBasedFolderConfiguration;
}(AbstractFolderConfiguration));
export { NodeBasedFolderConfiguration };
var FileServiceBasedFolderConfiguration = /** @class */ (function (_super) {
    __extends(FileServiceBasedFolderConfiguration, _super);
    function FileServiceBasedFolderConfiguration(folder, configFolderRelativePath, workbenchState, fileService, from) {
        var _this = _super.call(this, folder, workbenchState, from) || this;
        _this.configFolderRelativePath = configFolderRelativePath;
        _this.fileService = fileService;
        _this.loadConfigurationDelayer = new Delayer(50);
        _this.folderConfigurationPath = resources.joinPath(folder, configFolderRelativePath);
        _this.reloadConfigurationScheduler = _this._register(new RunOnceScheduler(function () { return _this._onDidChange.fire(); }, 50));
        _this._register(fileService.onFileChanges(function (e) { return _this.handleWorkspaceFileEvents(e); }));
        return _this;
    }
    FileServiceBasedFolderConfiguration.prototype.loadFolderConfigurationContents = function () {
        var _this = this;
        return Promise.resolve(this.loadConfigurationDelayer.trigger(function () { return _this.doLoadFolderConfigurationContents(); }));
    };
    FileServiceBasedFolderConfiguration.prototype.doLoadFolderConfigurationContents = function () {
        var _this = this;
        var workspaceFilePathToConfiguration = Object.create(null);
        var bulkContentFetchromise = Promise.resolve(this.fileService.resolveFile(this.folderConfigurationPath))
            .then(function (stat) {
            if (stat.isDirectory && stat.children) {
                stat.children
                    .filter(function (child) { return isFolderConfigurationFile(child.resource); })
                    .forEach(function (child) { return workspaceFilePathToConfiguration[_this.toFolderRelativePath(child.resource)] = Promise.resolve(_this.fileService.resolveContent(child.resource)).then(null, errors.onUnexpectedError); });
            }
        }).then(null, function (err) { return []; } /* never fail this call */);
        return bulkContentFetchromise.then(function () { return Promise.all(collections.values(workspaceFilePathToConfiguration)); });
    };
    FileServiceBasedFolderConfiguration.prototype.handleWorkspaceFileEvents = function (event) {
        var events = event.changes;
        var affectedByChanges = false;
        // Find changes that affect workspace configuration files
        for (var i = 0, len = events.length; i < len; i++) {
            var resource = events[i].resource;
            var basename = resources.basename(resource);
            var isJson = paths.extname(basename) === '.json';
            var isDeletedSettingsFolder = (events[i].type === 2 /* DELETED */ && basename === this.configFolderRelativePath);
            if (!isJson && !isDeletedSettingsFolder) {
                continue; // only JSON files or the actual settings folder
            }
            var folderRelativePath = this.toFolderRelativePath(resource);
            if (!folderRelativePath) {
                continue; // event is not inside folder
            }
            // Handle case where ".vscode" got deleted
            if (isDeletedSettingsFolder) {
                affectedByChanges = true;
            }
            // only valid workspace config files
            if (!isFolderConfigurationFile(resource)) {
                continue;
            }
            switch (events[i].type) {
                case 2 /* DELETED */:
                case 0 /* UPDATED */:
                case 1 /* ADDED */:
                    affectedByChanges = true;
            }
        }
        if (affectedByChanges) {
            this.reloadConfigurationScheduler.schedule();
        }
    };
    FileServiceBasedFolderConfiguration.prototype.toFolderRelativePath = function (resource) {
        if (resource.scheme === Schemas.file) {
            if (paths.isEqualOrParent(resource.fsPath, this.folderConfigurationPath.fsPath, !isLinux /* ignorecase */)) {
                return paths.normalize(relative(this.folderConfigurationPath.fsPath, resource.fsPath));
            }
        }
        else {
            if (resources.isEqualOrParent(resource, this.folderConfigurationPath)) {
                return paths.normalize(relative(this.folderConfigurationPath.path, resource.path));
            }
        }
        return null;
    };
    return FileServiceBasedFolderConfiguration;
}(AbstractFolderConfiguration));
export { FileServiceBasedFolderConfiguration };
var CachedFolderConfiguration = /** @class */ (function (_super) {
    __extends(CachedFolderConfiguration, _super);
    function CachedFolderConfiguration(folder, configFolderRelativePath, environmentService) {
        var _this = _super.call(this) || this;
        _this._onDidChange = _this._register(new Emitter());
        _this.onDidChange = _this._onDidChange.event;
        _this.loaded = false;
        _this.cachedFolderPath = paths.join(environmentService.appSettingsHome, createHash('md5').update(paths.join(folder.path, configFolderRelativePath)).digest('hex'));
        _this.cachedConfigurationPath = paths.join(_this.cachedFolderPath, 'configuration.json');
        _this.configurationModel = new ConfigurationModel();
        return _this;
    }
    CachedFolderConfiguration.prototype.loadConfiguration = function () {
        var _this = this;
        return pfs.readFile(this.cachedConfigurationPath)
            .then(function (contents) {
            var parsed = JSON.parse(contents.toString());
            _this.configurationModel = new ConfigurationModel(parsed.contents, parsed.keys, parsed.overrides);
            _this.loaded = true;
            return _this.configurationModel;
        }, function () { return _this.configurationModel; });
    };
    CachedFolderConfiguration.prototype.updateConfiguration = function (configurationModel) {
        var _this = this;
        var raw = JSON.stringify(configurationModel.toJSON());
        return this.createCachedFolder().then(function (created) {
            if (created) {
                return configurationModel.keys.length ? pfs.writeFile(_this.cachedConfigurationPath, raw) : pfs.rimraf(_this.cachedFolderPath);
            }
            return null;
        });
    };
    CachedFolderConfiguration.prototype.reprocess = function () {
        return this.configurationModel;
    };
    CachedFolderConfiguration.prototype.getUnsupportedKeys = function () {
        return [];
    };
    CachedFolderConfiguration.prototype.createCachedFolder = function () {
        var _this = this;
        return Promise.resolve(pfs.exists(this.cachedFolderPath))
            .then(null, function () { return false; })
            .then(function (exists) { return exists ? exists : pfs.mkdirp(_this.cachedFolderPath).then(function () { return true; }, function () { return false; }); });
    };
    return CachedFolderConfiguration;
}(Disposable));
export { CachedFolderConfiguration };
var FolderConfiguration = /** @class */ (function (_super) {
    __extends(FolderConfiguration, _super);
    function FolderConfiguration(workspaceFolder, configFolderRelativePath, workbenchState, environmentService, fileService) {
        var _this = _super.call(this) || this;
        _this.workspaceFolder = workspaceFolder;
        _this.configFolderRelativePath = configFolderRelativePath;
        _this.workbenchState = workbenchState;
        _this.environmentService = environmentService;
        _this._onDidChange = _this._register(new Emitter());
        _this.onDidChange = _this._onDidChange.event;
        _this._loaded = false;
        _this.cachedFolderConfiguration = new CachedFolderConfiguration(_this.workspaceFolder.uri, _this.configFolderRelativePath, _this.environmentService);
        _this.folderConfiguration = _this.cachedFolderConfiguration;
        if (fileService) {
            _this.folderConfiguration = new FileServiceBasedFolderConfiguration(_this.workspaceFolder.uri, _this.configFolderRelativePath, _this.workbenchState, fileService);
        }
        else if (_this.workspaceFolder.uri.scheme === Schemas.file) {
            _this.folderConfiguration = new NodeBasedFolderConfiguration(_this.workspaceFolder.uri, _this.configFolderRelativePath, _this.workbenchState);
        }
        _this._register(_this.folderConfiguration.onDidChange(function (e) { return _this.onDidFolderConfigurationChange(); }));
        return _this;
    }
    FolderConfiguration.prototype.loadConfiguration = function () {
        var _this = this;
        return this.folderConfiguration.loadConfiguration()
            .then(function (model) {
            _this._loaded = _this.folderConfiguration.loaded;
            return model;
        });
    };
    FolderConfiguration.prototype.reprocess = function () {
        return this.folderConfiguration.reprocess();
    };
    Object.defineProperty(FolderConfiguration.prototype, "loaded", {
        get: function () {
            return this._loaded;
        },
        enumerable: true,
        configurable: true
    });
    FolderConfiguration.prototype.adopt = function (fileService) {
        if (fileService) {
            if (this.folderConfiguration instanceof CachedFolderConfiguration) {
                return this.adoptFromCachedConfiguration(fileService);
            }
            if (this.folderConfiguration instanceof NodeBasedFolderConfiguration) {
                return this.adoptFromNodeBasedConfiguration(fileService);
            }
        }
        return Promise.resolve(false);
    };
    FolderConfiguration.prototype.adoptFromCachedConfiguration = function (fileService) {
        var _this = this;
        var folderConfiguration = new FileServiceBasedFolderConfiguration(this.workspaceFolder.uri, this.configFolderRelativePath, this.workbenchState, fileService);
        return folderConfiguration.loadConfiguration()
            .then(function () {
            _this.folderConfiguration = folderConfiguration;
            _this._register(_this.folderConfiguration.onDidChange(function (e) { return _this.onDidFolderConfigurationChange(); }));
            _this.updateCache();
            return true;
        });
    };
    FolderConfiguration.prototype.adoptFromNodeBasedConfiguration = function (fileService) {
        var _this = this;
        var oldFolderConfiguration = this.folderConfiguration;
        this.folderConfiguration = new FileServiceBasedFolderConfiguration(this.workspaceFolder.uri, this.configFolderRelativePath, this.workbenchState, fileService, oldFolderConfiguration);
        oldFolderConfiguration.dispose();
        this._register(this.folderConfiguration.onDidChange(function (e) { return _this.onDidFolderConfigurationChange(); }));
        return Promise.resolve(false);
    };
    FolderConfiguration.prototype.onDidFolderConfigurationChange = function () {
        this.updateCache();
        this._onDidChange.fire();
    };
    FolderConfiguration.prototype.updateCache = function () {
        var _this = this;
        if (this.workspaceFolder.uri.scheme !== Schemas.file && this.folderConfiguration instanceof FileServiceBasedFolderConfiguration) {
            return this.folderConfiguration.loadConfiguration()
                .then(function (configurationModel) { return _this.cachedFolderConfiguration.updateConfiguration(configurationModel); });
        }
        return Promise.resolve(null);
    };
    return FolderConfiguration;
}(Disposable));
export { FolderConfiguration };
