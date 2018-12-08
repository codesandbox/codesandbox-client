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
import { URI } from '../../../../base/common/uri.js';
import * as nls from '../../../../nls.js';
import { TPromise } from '../../../../base/common/winjs.base.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { IWindowService } from '../../../../platform/windows/common/windows.js';
import { IJSONEditingService } from '../../configuration/common/jsonEditing.js';
import { IWorkspaceConfigurationService } from '../../configuration/common/configuration.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { Extensions as ConfigurationExtensions } from '../../../../platform/configuration/common/configurationRegistry.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IExtensionService } from '../../extensions/common/extensions.js';
import { IBackupFileService } from '../../backup/common/backup.js';
import { BackupFileService } from '../../backup/node/backupFileService.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { distinct } from '../../../../base/common/arrays.js';
import { isLinux } from '../../../../base/common/platform.js';
import { isEqual } from '../../../../base/common/resources.js';
import { INotificationService, Severity } from '../../../../platform/notification/common/notification.js';
import { join } from '../../../../../path.js';
import { IEnvironmentService } from '../../../../platform/environment/common/environment.js';
import { mkdirp } from '../../../../base/node/pfs.js';
var WorkspaceEditingService = /** @class */ (function () {
    function WorkspaceEditingService(jsonEditingService, contextService, windowService, workspaceConfigurationService, storageService, extensionService, backupFileService, notificationService, commandService, environmentService) {
        this.jsonEditingService = jsonEditingService;
        this.contextService = contextService;
        this.windowService = windowService;
        this.workspaceConfigurationService = workspaceConfigurationService;
        this.storageService = storageService;
        this.extensionService = extensionService;
        this.backupFileService = backupFileService;
        this.notificationService = notificationService;
        this.commandService = commandService;
        this.environmentService = environmentService;
    }
    WorkspaceEditingService.prototype.updateFolders = function (index, deleteCount, foldersToAdd, donotNotifyError) {
        var folders = this.contextService.getWorkspace().folders;
        var foldersToDelete = [];
        if (typeof deleteCount === 'number') {
            foldersToDelete = folders.slice(index, index + deleteCount).map(function (f) { return f.uri; });
        }
        var wantsToDelete = foldersToDelete.length > 0;
        var wantsToAdd = Array.isArray(foldersToAdd) && foldersToAdd.length > 0;
        if (!wantsToAdd && !wantsToDelete) {
            return TPromise.as(void 0); // return early if there is nothing to do
        }
        // Add Folders
        if (wantsToAdd && !wantsToDelete) {
            return this.doAddFolders(foldersToAdd, index, donotNotifyError);
        }
        // Delete Folders
        if (wantsToDelete && !wantsToAdd) {
            return this.removeFolders(foldersToDelete);
        }
        // Add & Delete Folders
        else {
            // if we are in single-folder state and the folder is replaced with
            // other folders, we handle this specially and just enter workspace
            // mode with the folders that are being added.
            if (this.includesSingleFolderWorkspace(foldersToDelete)) {
                return this.createAndEnterWorkspace(foldersToAdd);
            }
            // if we are not in workspace-state, we just add the folders
            if (this.contextService.getWorkbenchState() !== 3 /* WORKSPACE */) {
                return this.doAddFolders(foldersToAdd, index, donotNotifyError);
            }
            // finally, update folders within the workspace
            return this.doUpdateFolders(foldersToAdd, foldersToDelete, index, donotNotifyError);
        }
    };
    WorkspaceEditingService.prototype.doUpdateFolders = function (foldersToAdd, foldersToDelete, index, donotNotifyError) {
        var _this = this;
        if (donotNotifyError === void 0) { donotNotifyError = false; }
        return this.contextService.updateFolders(foldersToAdd, foldersToDelete, index)
            .then(function () { return null; }, function (error) { return donotNotifyError ? TPromise.wrapError(error) : _this.handleWorkspaceConfigurationEditingError(error); });
    };
    WorkspaceEditingService.prototype.addFolders = function (foldersToAdd, donotNotifyError) {
        if (donotNotifyError === void 0) { donotNotifyError = false; }
        return this.doAddFolders(foldersToAdd, void 0, donotNotifyError);
    };
    WorkspaceEditingService.prototype.doAddFolders = function (foldersToAdd, index, donotNotifyError) {
        var _this = this;
        if (donotNotifyError === void 0) { donotNotifyError = false; }
        var state = this.contextService.getWorkbenchState();
        // If we are in no-workspace or single-folder workspace, adding folders has to
        // enter a workspace.
        if (state !== 3 /* WORKSPACE */) {
            var newWorkspaceFolders = this.contextService.getWorkspace().folders.map(function (folder) { return ({ uri: folder.uri }); });
            newWorkspaceFolders.splice.apply(newWorkspaceFolders, [typeof index === 'number' ? index : newWorkspaceFolders.length, 0].concat(foldersToAdd));
            newWorkspaceFolders = distinct(newWorkspaceFolders, function (folder) { return isLinux ? folder.uri.toString() : folder.uri.toString().toLowerCase(); });
            if (state === 1 /* EMPTY */ && newWorkspaceFolders.length === 0 || state === 2 /* FOLDER */ && newWorkspaceFolders.length === 1) {
                return TPromise.as(void 0); // return if the operation is a no-op for the current state
            }
            return this.createAndEnterWorkspace(newWorkspaceFolders);
        }
        // Delegate addition of folders to workspace service otherwise
        return this.contextService.addFolders(foldersToAdd, index)
            .then(function () { return null; }, function (error) { return donotNotifyError ? TPromise.wrapError(error) : _this.handleWorkspaceConfigurationEditingError(error); });
    };
    WorkspaceEditingService.prototype.removeFolders = function (foldersToRemove, donotNotifyError) {
        var _this = this;
        if (donotNotifyError === void 0) { donotNotifyError = false; }
        // If we are in single-folder state and the opened folder is to be removed,
        // we create an empty workspace and enter it.
        if (this.includesSingleFolderWorkspace(foldersToRemove)) {
            return this.createAndEnterWorkspace([]);
        }
        // Delegate removal of folders to workspace service otherwise
        return this.contextService.removeFolders(foldersToRemove)
            .then(function () { return null; }, function (error) { return donotNotifyError ? TPromise.wrapError(error) : _this.handleWorkspaceConfigurationEditingError(error); });
    };
    WorkspaceEditingService.prototype.includesSingleFolderWorkspace = function (folders) {
        if (this.contextService.getWorkbenchState() === 2 /* FOLDER */) {
            var workspaceFolder_1 = this.contextService.getWorkspace().folders[0];
            return (folders.some(function (folder) { return isEqual(folder, workspaceFolder_1.uri); }));
        }
        return false;
    };
    WorkspaceEditingService.prototype.enterWorkspace = function (path) {
        var _this = this;
        return this.doEnterWorkspace(function () { return _this.windowService.enterWorkspace(path); });
    };
    WorkspaceEditingService.prototype.createAndEnterWorkspace = function (folders, path) {
        var _this = this;
        return this.doEnterWorkspace(function () { return _this.windowService.createAndEnterWorkspace(folders, path); });
    };
    WorkspaceEditingService.prototype.saveAndEnterWorkspace = function (path) {
        var _this = this;
        return this.doEnterWorkspace(function () { return _this.windowService.saveAndEnterWorkspace(path); });
    };
    WorkspaceEditingService.prototype.handleWorkspaceConfigurationEditingError = function (error) {
        switch (error.code) {
            case 1 /* ERROR_INVALID_FILE */:
                this.onInvalidWorkspaceConfigurationFileError();
                return TPromise.as(void 0);
            case 0 /* ERROR_FILE_DIRTY */:
                this.onWorkspaceConfigurationFileDirtyError();
                return TPromise.as(void 0);
        }
        this.notificationService.error(error.message);
        return TPromise.as(void 0);
    };
    WorkspaceEditingService.prototype.onInvalidWorkspaceConfigurationFileError = function () {
        var message = nls.localize('errorInvalidTaskConfiguration', "Unable to write into workspace configuration file. Please open the file to correct errors/warnings in it and try again.");
        this.askToOpenWorkspaceConfigurationFile(message);
    };
    WorkspaceEditingService.prototype.onWorkspaceConfigurationFileDirtyError = function () {
        var message = nls.localize('errorWorkspaceConfigurationFileDirty', "Unable to write into workspace configuration file because the file is dirty. Please save it and try again.");
        this.askToOpenWorkspaceConfigurationFile(message);
    };
    WorkspaceEditingService.prototype.askToOpenWorkspaceConfigurationFile = function (message) {
        var _this = this;
        this.notificationService.prompt(Severity.Error, message, [{
                label: nls.localize('openWorkspaceConfigurationFile', "Open Workspace Configuration"),
                run: function () { return _this.commandService.executeCommand('workbench.action.openWorkspaceConfigFile'); }
            }]);
    };
    WorkspaceEditingService.prototype.doEnterWorkspace = function (mainSidePromise) {
        var _this = this;
        // Stop the extension host first to give extensions most time to shutdown
        this.extensionService.stopExtensionHost();
        var extensionHostStarted = false;
        var startExtensionHost = function () {
            _this.extensionService.startExtensionHost();
            extensionHostStarted = true;
        };
        return mainSidePromise().then(function (result) {
            // Migrate storage and settings if we are to enter a workspace
            if (result) {
                return _this.migrate(result.workspace).then(function () {
                    // Reinitialize backup service
                    if (_this.backupFileService instanceof BackupFileService) {
                        _this.backupFileService.initialize(result.backupPath);
                    }
                    // Reinitialize configuration service
                    var workspaceImpl = _this.contextService;
                    return workspaceImpl.initialize(result.workspace, startExtensionHost);
                });
            }
            return TPromise.as(void 0);
        }).then(null, function (error) {
            if (!extensionHostStarted) {
                startExtensionHost(); // start the extension host if not started
            }
            return TPromise.wrapError(error);
        });
    };
    WorkspaceEditingService.prototype.migrate = function (toWorkspace) {
        var _this = this;
        // Storage migration
        return this.migrateStorage(toWorkspace).then(function () {
            // Settings migration (only if we come from a folder workspace)
            if (_this.contextService.getWorkbenchState() === 2 /* FOLDER */) {
                return _this.migrateWorkspaceSettings(toWorkspace);
            }
            return void 0;
        });
    };
    WorkspaceEditingService.prototype.migrateStorage = function (toWorkspace) {
        var _this = this;
        var newWorkspaceStorageHome = join(this.environmentService.workspaceStorageHome, toWorkspace.id);
        return mkdirp(newWorkspaceStorageHome).then(function () {
            var storageImpl = _this.storageService;
            return storageImpl.storage.migrate(newWorkspaceStorageHome);
        });
    };
    WorkspaceEditingService.prototype.migrateWorkspaceSettings = function (toWorkspace) {
        return this.doCopyWorkspaceSettings(toWorkspace, function (setting) { return setting.scope === 2 /* WINDOW */; });
    };
    WorkspaceEditingService.prototype.copyWorkspaceSettings = function (toWorkspace) {
        return this.doCopyWorkspaceSettings(toWorkspace);
    };
    WorkspaceEditingService.prototype.doCopyWorkspaceSettings = function (toWorkspace, filter) {
        var configurationProperties = Registry.as(ConfigurationExtensions.Configuration).getConfigurationProperties();
        var targetWorkspaceConfiguration = {};
        for (var _i = 0, _a = this.workspaceConfigurationService.keys().workspace; _i < _a.length; _i++) {
            var key = _a[_i];
            if (configurationProperties[key]) {
                if (filter && !filter(configurationProperties[key])) {
                    continue;
                }
                targetWorkspaceConfiguration[key] = this.workspaceConfigurationService.inspect(key).workspace;
            }
        }
        return this.jsonEditingService.write(URI.file(toWorkspace.configPath), { key: 'settings', value: targetWorkspaceConfiguration }, true);
    };
    WorkspaceEditingService = __decorate([
        __param(0, IJSONEditingService),
        __param(1, IWorkspaceContextService),
        __param(2, IWindowService),
        __param(3, IWorkspaceConfigurationService),
        __param(4, IStorageService),
        __param(5, IExtensionService),
        __param(6, IBackupFileService),
        __param(7, INotificationService),
        __param(8, ICommandService),
        __param(9, IEnvironmentService)
    ], WorkspaceEditingService);
    return WorkspaceEditingService;
}());
export { WorkspaceEditingService };
