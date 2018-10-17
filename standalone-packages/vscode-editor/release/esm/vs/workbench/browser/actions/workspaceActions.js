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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Action } from '../../../base/common/actions.js';
import * as nls from '../../../nls.js';
import { IWindowService } from '../../../platform/windows/common/windows.js';
import { IWorkspaceContextService } from '../../../platform/workspace/common/workspace.js';
import { IWorkspaceEditingService } from '../../services/workspace/common/workspaceEditing.js';
import { WORKSPACE_FILTER, IWorkspacesService } from '../../../platform/workspaces/common/workspaces.js';
import { mnemonicButtonLabel } from '../../../base/common/labels.js';
import { IEditorService } from '../../services/editor/common/editorService.js';
import { ICommandService } from '../../../platform/commands/common/commands.js';
import { ADD_ROOT_FOLDER_COMMAND_ID, ADD_ROOT_FOLDER_LABEL, PICK_WORKSPACE_FOLDER_COMMAND_ID } from './workspaceCommands.js';
import { URI } from '../../../base/common/uri.js';
import { Schemas } from '../../../base/common/network.js';
import { IFileDialogService } from '../../../platform/dialogs/common/dialogs.js';
var OpenFileAction = /** @class */ (function (_super) {
    __extends(OpenFileAction, _super);
    function OpenFileAction(id, label, dialogService) {
        var _this = _super.call(this, id, label) || this;
        _this.dialogService = dialogService;
        return _this;
    }
    OpenFileAction.prototype.run = function (event, data) {
        return this.dialogService.pickFileAndOpen({ forceNewWindow: false, telemetryExtraData: data });
    };
    OpenFileAction.ID = 'workbench.action.files.openFile';
    OpenFileAction.LABEL = nls.localize('openFile', "Open File...");
    OpenFileAction = __decorate([
        __param(2, IFileDialogService)
    ], OpenFileAction);
    return OpenFileAction;
}(Action));
export { OpenFileAction };
var OpenFolderAction = /** @class */ (function (_super) {
    __extends(OpenFolderAction, _super);
    function OpenFolderAction(id, label, dialogService) {
        var _this = _super.call(this, id, label) || this;
        _this.dialogService = dialogService;
        return _this;
    }
    OpenFolderAction.prototype.run = function (event, data) {
        return this.dialogService.pickFolderAndOpen({ forceNewWindow: false, telemetryExtraData: data });
    };
    OpenFolderAction.ID = 'workbench.action.files.openFolder';
    OpenFolderAction.LABEL = nls.localize('openFolder', "Open Folder...");
    OpenFolderAction = __decorate([
        __param(2, IFileDialogService)
    ], OpenFolderAction);
    return OpenFolderAction;
}(Action));
export { OpenFolderAction };
var OpenFileFolderAction = /** @class */ (function (_super) {
    __extends(OpenFileFolderAction, _super);
    function OpenFileFolderAction(id, label, dialogService) {
        var _this = _super.call(this, id, label) || this;
        _this.dialogService = dialogService;
        return _this;
    }
    OpenFileFolderAction.prototype.run = function (event, data) {
        return this.dialogService.pickFileFolderAndOpen({ forceNewWindow: false, telemetryExtraData: data });
    };
    OpenFileFolderAction.ID = 'workbench.action.files.openFileFolder';
    OpenFileFolderAction.LABEL = nls.localize('openFileFolder', "Open...");
    OpenFileFolderAction = __decorate([
        __param(2, IFileDialogService)
    ], OpenFileFolderAction);
    return OpenFileFolderAction;
}(Action));
export { OpenFileFolderAction };
var AddRootFolderAction = /** @class */ (function (_super) {
    __extends(AddRootFolderAction, _super);
    function AddRootFolderAction(id, label, commandService) {
        var _this = _super.call(this, id, label) || this;
        _this.commandService = commandService;
        return _this;
    }
    AddRootFolderAction.prototype.run = function () {
        return this.commandService.executeCommand(ADD_ROOT_FOLDER_COMMAND_ID);
    };
    AddRootFolderAction.ID = 'workbench.action.addRootFolder';
    AddRootFolderAction.LABEL = ADD_ROOT_FOLDER_LABEL;
    AddRootFolderAction = __decorate([
        __param(2, ICommandService)
    ], AddRootFolderAction);
    return AddRootFolderAction;
}(Action));
export { AddRootFolderAction };
var GlobalRemoveRootFolderAction = /** @class */ (function (_super) {
    __extends(GlobalRemoveRootFolderAction, _super);
    function GlobalRemoveRootFolderAction(id, label, workspaceEditingService, contextService, commandService) {
        var _this = _super.call(this, id, label) || this;
        _this.workspaceEditingService = workspaceEditingService;
        _this.contextService = contextService;
        _this.commandService = commandService;
        return _this;
    }
    GlobalRemoveRootFolderAction.prototype.run = function () {
        var _this = this;
        var state = this.contextService.getWorkbenchState();
        // Workspace / Folder
        if (state === 3 /* WORKSPACE */ || state === 2 /* FOLDER */) {
            return this.commandService.executeCommand(PICK_WORKSPACE_FOLDER_COMMAND_ID).then(function (folder) {
                if (folder) {
                    return _this.workspaceEditingService.removeFolders([folder.uri]).then(function () { return true; });
                }
                return true;
            });
        }
        return Promise.resolve(true);
    };
    GlobalRemoveRootFolderAction.ID = 'workbench.action.removeRootFolder';
    GlobalRemoveRootFolderAction.LABEL = nls.localize('globalRemoveFolderFromWorkspace', "Remove Folder from Workspace...");
    GlobalRemoveRootFolderAction = __decorate([
        __param(2, IWorkspaceEditingService),
        __param(3, IWorkspaceContextService),
        __param(4, ICommandService)
    ], GlobalRemoveRootFolderAction);
    return GlobalRemoveRootFolderAction;
}(Action));
export { GlobalRemoveRootFolderAction };
var SaveWorkspaceAsAction = /** @class */ (function (_super) {
    __extends(SaveWorkspaceAsAction, _super);
    function SaveWorkspaceAsAction(id, label, contextService, workspaceEditingService, dialogService) {
        var _this = _super.call(this, id, label) || this;
        _this.contextService = contextService;
        _this.workspaceEditingService = workspaceEditingService;
        _this.dialogService = dialogService;
        return _this;
    }
    SaveWorkspaceAsAction.prototype.run = function () {
        var _this = this;
        return this.getNewWorkspaceConfigPath().then(function (configPathUri) {
            if (configPathUri) {
                var configPath = configPathUri.fsPath;
                switch (_this.contextService.getWorkbenchState()) {
                    case 1 /* EMPTY */:
                    case 2 /* FOLDER */:
                        var folders = _this.contextService.getWorkspace().folders.map(function (folder) { return ({ uri: folder.uri }); });
                        return _this.workspaceEditingService.createAndEnterWorkspace(folders, configPath);
                    case 3 /* WORKSPACE */:
                        return _this.workspaceEditingService.saveAndEnterWorkspace(configPath);
                }
            }
            return null;
        });
    };
    SaveWorkspaceAsAction.prototype.getNewWorkspaceConfigPath = function () {
        return this.dialogService.showSaveDialog({
            buttonLabel: mnemonicButtonLabel(nls.localize({ key: 'save', comment: ['&& denotes a mnemonic'] }, "&&Save")),
            title: nls.localize('saveWorkspace', "Save Workspace"),
            filters: WORKSPACE_FILTER,
            defaultUri: this.dialogService.defaultWorkspacePath(Schemas.file)
        });
    };
    SaveWorkspaceAsAction.ID = 'workbench.action.saveWorkspaceAs';
    SaveWorkspaceAsAction.LABEL = nls.localize('saveWorkspaceAsAction', "Save Workspace As...");
    SaveWorkspaceAsAction = __decorate([
        __param(2, IWorkspaceContextService),
        __param(3, IWorkspaceEditingService),
        __param(4, IFileDialogService)
    ], SaveWorkspaceAsAction);
    return SaveWorkspaceAsAction;
}(Action));
export { SaveWorkspaceAsAction };
var OpenWorkspaceAction = /** @class */ (function (_super) {
    __extends(OpenWorkspaceAction, _super);
    function OpenWorkspaceAction(id, label, dialogService) {
        var _this = _super.call(this, id, label) || this;
        _this.dialogService = dialogService;
        return _this;
    }
    OpenWorkspaceAction.prototype.run = function (event, data) {
        return this.dialogService.pickWorkspaceAndOpen({ telemetryExtraData: data });
    };
    OpenWorkspaceAction.ID = 'workbench.action.openWorkspace';
    OpenWorkspaceAction.LABEL = nls.localize('openWorkspaceAction', "Open Workspace...");
    OpenWorkspaceAction = __decorate([
        __param(2, IFileDialogService)
    ], OpenWorkspaceAction);
    return OpenWorkspaceAction;
}(Action));
export { OpenWorkspaceAction };
var OpenWorkspaceConfigFileAction = /** @class */ (function (_super) {
    __extends(OpenWorkspaceConfigFileAction, _super);
    function OpenWorkspaceConfigFileAction(id, label, workspaceContextService, editorService) {
        var _this = _super.call(this, id, label) || this;
        _this.workspaceContextService = workspaceContextService;
        _this.editorService = editorService;
        _this.enabled = !!_this.workspaceContextService.getWorkspace().configuration;
        return _this;
    }
    OpenWorkspaceConfigFileAction.prototype.run = function () {
        return this.editorService.openEditor({ resource: this.workspaceContextService.getWorkspace().configuration });
    };
    OpenWorkspaceConfigFileAction.ID = 'workbench.action.openWorkspaceConfigFile';
    OpenWorkspaceConfigFileAction.LABEL = nls.localize('openWorkspaceConfigFile', "Open Workspace Configuration File");
    OpenWorkspaceConfigFileAction = __decorate([
        __param(2, IWorkspaceContextService),
        __param(3, IEditorService)
    ], OpenWorkspaceConfigFileAction);
    return OpenWorkspaceConfigFileAction;
}(Action));
export { OpenWorkspaceConfigFileAction };
var DuplicateWorkspaceInNewWindowAction = /** @class */ (function (_super) {
    __extends(DuplicateWorkspaceInNewWindowAction, _super);
    function DuplicateWorkspaceInNewWindowAction(id, label, workspaceContextService, workspaceEditingService, windowService, workspacesService) {
        var _this = _super.call(this, id, label) || this;
        _this.workspaceContextService = workspaceContextService;
        _this.workspaceEditingService = workspaceEditingService;
        _this.windowService = windowService;
        _this.workspacesService = workspacesService;
        return _this;
    }
    DuplicateWorkspaceInNewWindowAction.prototype.run = function () {
        var _this = this;
        var folders = this.workspaceContextService.getWorkspace().folders;
        return this.workspacesService.createWorkspace(folders).then(function (newWorkspace) {
            return _this.workspaceEditingService.copyWorkspaceSettings(newWorkspace).then(function () {
                return _this.windowService.openWindow([URI.file(newWorkspace.configPath)], { forceNewWindow: true });
            });
        });
    };
    DuplicateWorkspaceInNewWindowAction.ID = 'workbench.action.duplicateWorkspaceInNewWindow';
    DuplicateWorkspaceInNewWindowAction.LABEL = nls.localize('duplicateWorkspaceInNewWindow', "Duplicate Workspace in New Window");
    DuplicateWorkspaceInNewWindowAction = __decorate([
        __param(2, IWorkspaceContextService),
        __param(3, IWorkspaceEditingService),
        __param(4, IWindowService),
        __param(5, IWorkspacesService)
    ], DuplicateWorkspaceInNewWindowAction);
    return DuplicateWorkspaceInNewWindowAction;
}(Action));
export { DuplicateWorkspaceInNewWindowAction };
