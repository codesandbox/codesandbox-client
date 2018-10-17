/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { isParent } from '../../files/common/files.js';
import { localize } from '../../../nls.js';
import { basename, dirname, join } from '../../../base/common/paths.js';
import { isLinux } from '../../../base/common/platform.js';
import { tildify, getPathLabel } from '../../../base/common/labels.js';
export var IWorkspacesMainService = createDecorator('workspacesMainService');
export var IWorkspacesService = createDecorator('workspacesService');
export var WORKSPACE_EXTENSION = 'code-workspace';
export var WORKSPACE_FILTER = [{ name: localize('codeWorkspace', "Code Workspace"), extensions: [WORKSPACE_EXTENSION] }];
export var UNTITLED_WORKSPACE_NAME = 'workspace.json';
export function isStoredWorkspaceFolder(thing) {
    return isRawFileWorkspaceFolder(thing) || isRawUriWorkspaceFolder(thing);
}
export function isRawFileWorkspaceFolder(thing) {
    return thing
        && typeof thing === 'object'
        && typeof thing.path === 'string'
        && (!thing.name || typeof thing.name === 'string');
}
export function isRawUriWorkspaceFolder(thing) {
    return thing
        && typeof thing === 'object'
        && typeof thing.uri === 'string'
        && (!thing.name || typeof thing.name === 'string');
}
export function getWorkspaceLabel(workspace, environmentService, options) {
    // Workspace: Single Folder
    if (isSingleFolderWorkspaceIdentifier(workspace)) {
        return tildify(workspace, environmentService.userHome);
    }
    // Workspace: Untitled
    if (isParent(workspace.configPath, environmentService.workspacesHome, !isLinux /* ignore case */)) {
        return localize('untitledWorkspace', "Untitled (Workspace)");
    }
    // Workspace: Saved
    var filename = basename(workspace.configPath);
    var workspaceName = filename.substr(0, filename.length - WORKSPACE_EXTENSION.length - 1);
    if (options && options.verbose) {
        return localize('workspaceNameVerbose', "{0} (Workspace)", getPathLabel(join(dirname(workspace.configPath), workspaceName), environmentService));
    }
    return localize('workspaceName', "{0} (Workspace)", workspaceName);
}
export function isSingleFolderWorkspaceIdentifier(obj) {
    return typeof obj === 'string';
}
export function isWorkspaceIdentifier(obj) {
    var workspaceIdentifier = obj;
    return workspaceIdentifier && typeof workspaceIdentifier.id === 'string' && typeof workspaceIdentifier.configPath === 'string';
}
