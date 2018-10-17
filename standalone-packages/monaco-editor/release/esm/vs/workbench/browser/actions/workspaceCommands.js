/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import * as nls from '../../../nls.js';
import { IWorkspaceContextService } from '../../../platform/workspace/common/workspace.js';
import { IWorkspaceEditingService } from '../../services/workspace/common/workspaceEditing.js';
import * as resources from '../../../base/common/resources.js';
import { IViewletService } from '../../services/viewlet/browser/viewlet.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { mnemonicButtonLabel } from '../../../base/common/labels.js';
import { CommandsRegistry } from '../../../platform/commands/common/commands.js';
import { FileKind } from '../../../platform/files/common/files.js';
import { ILabelService } from '../../../platform/label/common/label.js';
import { IQuickInputService } from '../../../platform/quickinput/common/quickInput.js';
import { getIconClasses } from '../labels.js';
import { IModelService } from '../../../editor/common/services/modelService.js';
import { IModeService } from '../../../editor/common/services/modeService.js';
import { Schemas } from '../../../base/common/network.js';
import { IFileDialogService } from '../../../platform/dialogs/common/dialogs.js';
export var ADD_ROOT_FOLDER_COMMAND_ID = 'addRootFolder';
export var ADD_ROOT_FOLDER_LABEL = nls.localize('addFolderToWorkspace', "Add Folder to Workspace...");
export var PICK_WORKSPACE_FOLDER_COMMAND_ID = '_workbench.pickWorkspaceFolder';
// Command registration
CommandsRegistry.registerCommand({
    id: 'workbench.action.files.openFileFolderInNewWindow',
    handler: function (accessor) { return accessor.get(IFileDialogService).pickFileFolderAndOpen({ forceNewWindow: true }); }
});
CommandsRegistry.registerCommand({
    id: '_files.pickFolderAndOpen',
    handler: function (accessor, forceNewWindow) { return accessor.get(IFileDialogService).pickFolderAndOpen({ forceNewWindow: forceNewWindow }); }
});
CommandsRegistry.registerCommand({
    id: 'workbench.action.files.openFolderInNewWindow',
    handler: function (accessor) { return accessor.get(IFileDialogService).pickFolderAndOpen({ forceNewWindow: true }); }
});
CommandsRegistry.registerCommand({
    id: 'workbench.action.files.openFileInNewWindow',
    handler: function (accessor) { return accessor.get(IFileDialogService).pickFileAndOpen({ forceNewWindow: true }); }
});
CommandsRegistry.registerCommand({
    id: 'workbench.action.openWorkspaceInNewWindow',
    handler: function (accessor) { return accessor.get(IFileDialogService).pickWorkspaceAndOpen({ forceNewWindow: true }); }
});
CommandsRegistry.registerCommand({
    id: ADD_ROOT_FOLDER_COMMAND_ID,
    handler: function (accessor) {
        var viewletService = accessor.get(IViewletService);
        var workspaceEditingService = accessor.get(IWorkspaceEditingService);
        var dialogsService = accessor.get(IFileDialogService);
        return dialogsService.showOpenDialog({
            openLabel: mnemonicButtonLabel(nls.localize({ key: 'add', comment: ['&& denotes a mnemonic'] }, "&&Add")),
            title: nls.localize('addFolderToWorkspaceTitle', "Add Folder to Workspace"),
            canSelectFolders: true,
            canSelectMany: true,
            defaultUri: dialogsService.defaultFolderPath(Schemas.file)
        }).then(function (folders) {
            if (!folders || !folders.length) {
                return null;
            }
            // Add and show Files Explorer viewlet
            return workspaceEditingService.addFolders(folders.map(function (folder) { return ({ uri: folder }); }))
                .then(function () { return viewletService.openViewlet(viewletService.getDefaultViewletId(), true); })
                .then(function () { return void 0; });
        });
    }
});
CommandsRegistry.registerCommand(PICK_WORKSPACE_FOLDER_COMMAND_ID, function (accessor, args) {
    var quickInputService = accessor.get(IQuickInputService);
    var labelService = accessor.get(ILabelService);
    var contextService = accessor.get(IWorkspaceContextService);
    var modelService = accessor.get(IModelService);
    var modeService = accessor.get(IModeService);
    var folders = contextService.getWorkspace().folders;
    if (!folders.length) {
        return void 0;
    }
    var folderPicks = folders.map(function (folder) {
        return {
            label: folder.name,
            description: labelService.getUriLabel(resources.dirname(folder.uri), { relative: true }),
            folder: folder,
            iconClasses: getIconClasses(modelService, modeService, folder.uri, FileKind.ROOT_FOLDER)
        };
    });
    var options;
    if (args) {
        options = args[0];
    }
    if (!options) {
        options = Object.create(null);
    }
    if (!options.activeItem) {
        options.activeItem = folderPicks[0];
    }
    if (!options.placeHolder) {
        options.placeHolder = nls.localize('workspaceFolderPickerPlaceholder', "Select workspace folder");
    }
    if (typeof options.matchOnDescription !== 'boolean') {
        options.matchOnDescription = true;
    }
    var token;
    if (args) {
        token = args[1];
    }
    if (!token) {
        token = CancellationToken.None;
    }
    return quickInputService.pick(folderPicks, options, token).then(function (pick) {
        if (!pick) {
            return void 0;
        }
        return folders[folderPicks.indexOf(pick)];
    });
});
