/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { createDecorator } from '../../../../platform/instantiation/common/instantiation';
export var FOLDER_CONFIG_FOLDER_NAME = '.vscode';
export var FOLDER_SETTINGS_NAME = 'settings';
export var FOLDER_SETTINGS_PATH = FOLDER_CONFIG_FOLDER_NAME + "/" + FOLDER_SETTINGS_NAME + ".json";
export var IWorkspaceConfigurationService = createDecorator('configurationService');
export var defaultSettingsSchemaId = 'vscode://schemas/settings/default';
export var userSettingsSchemaId = 'vscode://schemas/settings/user';
export var workspaceSettingsSchemaId = 'vscode://schemas/settings/workspace';
export var folderSettingsSchemaId = 'vscode://schemas/settings/folder';
export var launchSchemaId = 'vscode://schemas/launch';
export var TASKS_CONFIGURATION_KEY = 'tasks';
export var LAUNCH_CONFIGURATION_KEY = 'launch';
export var WORKSPACE_STANDALONE_CONFIGURATIONS = Object.create(null);
WORKSPACE_STANDALONE_CONFIGURATIONS[TASKS_CONFIGURATION_KEY] = FOLDER_CONFIG_FOLDER_NAME + "/" + TASKS_CONFIGURATION_KEY + ".json";
WORKSPACE_STANDALONE_CONFIGURATIONS[LAUNCH_CONFIGURATION_KEY] = FOLDER_CONFIG_FOLDER_NAME + "/" + LAUNCH_CONFIGURATION_KEY + ".json";
