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
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { EditorOptions } from '../../../common/editor.js';
import { join } from '../../../../base/common/paths.js';
import { localize } from '../../../../nls.js';
export var SettingValueType;
(function (SettingValueType) {
    SettingValueType["Null"] = "null";
    SettingValueType["Enum"] = "enum";
    SettingValueType["String"] = "string";
    SettingValueType["Integer"] = "integer";
    SettingValueType["Number"] = "number";
    SettingValueType["Boolean"] = "boolean";
    SettingValueType["Exclude"] = "exclude";
    SettingValueType["Complex"] = "complex";
    SettingValueType["NullableInteger"] = "nullable-integer";
    SettingValueType["NullableNumber"] = "nullable-number";
})(SettingValueType || (SettingValueType = {}));
/**
 * TODO Why do we need this class?
 */
var SettingsEditorOptions = /** @class */ (function (_super) {
    __extends(SettingsEditorOptions, _super);
    function SettingsEditorOptions() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SettingsEditorOptions.create = function (settings) {
        if (!settings) {
            return null;
        }
        var options = new SettingsEditorOptions();
        options.target = settings.target;
        options.folderUri = settings.folderUri;
        options.query = settings.query;
        // IEditorOptions
        options.preserveFocus = settings.preserveFocus;
        options.forceReload = settings.forceReload;
        options.revealIfVisible = settings.revealIfVisible;
        options.revealIfOpened = settings.revealIfOpened;
        options.pinned = settings.pinned;
        options.index = settings.index;
        options.inactive = settings.inactive;
        return options;
    };
    return SettingsEditorOptions;
}(EditorOptions));
export { SettingsEditorOptions };
export var IPreferencesService = createDecorator('preferencesService');
export function getSettingsTargetName(target, resource, workspaceContextService) {
    switch (target) {
        case 1 /* USER */:
            return localize('userSettingsTarget', "User Settings");
        case 2 /* WORKSPACE */:
            return localize('workspaceSettingsTarget', "Workspace Settings");
        case 3 /* WORKSPACE_FOLDER */:
            var folder = workspaceContextService.getWorkspaceFolder(resource);
            return folder ? folder.name : '';
    }
    return '';
}
export var FOLDER_SETTINGS_PATH = join('.vscode', 'settings.json');
export var DEFAULT_SETTINGS_EDITOR_SETTING = 'workbench.settings.openDefaultSettings';
