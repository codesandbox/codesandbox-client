/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { createDecorator } from '../../instantiation/common/instantiation';
import { localize } from '../../../nls';
import { URI } from '../../../base/common/uri';
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
export function isSingleFolderWorkspaceIdentifier(obj) {
    return obj instanceof URI;
}
export function isWorkspaceIdentifier(obj) {
    var workspaceIdentifier = obj;
    return workspaceIdentifier && typeof workspaceIdentifier.id === 'string' && typeof workspaceIdentifier.configPath === 'string';
}
export function toWorkspaceIdentifier(workspace) {
    if (workspace.configuration) {
        return {
            configPath: workspace.configuration.fsPath,
            id: workspace.id
        };
    }
    if (workspace.folders.length === 1) {
        return workspace.folders[0].uri;
    }
    // Empty workspace
    return undefined;
}
