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
import { Action } from '../../../../base/common/actions';
import { dispose } from '../../../../base/common/lifecycle';
import { URI } from '../../../../base/common/uri';
import { IModelService } from '../../../../editor/common/services/modelService';
import { IModeService } from '../../../../editor/common/services/modeService';
import * as nls from '../../../../nls';
import { ICommandService } from '../../../../platform/commands/common/commands';
import { IQuickInputService } from '../../../../platform/quickinput/common/quickInput';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace';
import { PICK_WORKSPACE_FOLDER_COMMAND_ID } from '../../../browser/actions/workspaceCommands';
import { getIconClasses } from '../../../browser/labels';
import { IPreferencesService } from '../../../services/preferences/common/preferences';
var OpenRawDefaultSettingsAction = /** @class */ (function (_super) {
    __extends(OpenRawDefaultSettingsAction, _super);
    function OpenRawDefaultSettingsAction(id, label, preferencesService) {
        var _this = _super.call(this, id, label) || this;
        _this.preferencesService = preferencesService;
        return _this;
    }
    OpenRawDefaultSettingsAction.prototype.run = function (event) {
        return this.preferencesService.openRawDefaultSettings();
    };
    OpenRawDefaultSettingsAction.ID = 'workbench.action.openRawDefaultSettings';
    OpenRawDefaultSettingsAction.LABEL = nls.localize('openRawDefaultSettings', "Open Raw Default Settings");
    OpenRawDefaultSettingsAction = __decorate([
        __param(2, IPreferencesService)
    ], OpenRawDefaultSettingsAction);
    return OpenRawDefaultSettingsAction;
}(Action));
export { OpenRawDefaultSettingsAction };
var OpenSettings2Action = /** @class */ (function (_super) {
    __extends(OpenSettings2Action, _super);
    function OpenSettings2Action(id, label, preferencesService) {
        var _this = _super.call(this, id, label) || this;
        _this.preferencesService = preferencesService;
        return _this;
    }
    OpenSettings2Action.prototype.run = function (event) {
        return this.preferencesService.openSettings(false);
    };
    OpenSettings2Action.ID = 'workbench.action.openSettings2';
    OpenSettings2Action.LABEL = nls.localize('openSettings2', "Open Settings (UI)");
    OpenSettings2Action = __decorate([
        __param(2, IPreferencesService)
    ], OpenSettings2Action);
    return OpenSettings2Action;
}(Action));
export { OpenSettings2Action };
var OpenSettingsAction = /** @class */ (function (_super) {
    __extends(OpenSettingsAction, _super);
    function OpenSettingsAction(id, label, preferencesService) {
        var _this = _super.call(this, id, label) || this;
        _this.preferencesService = preferencesService;
        return _this;
    }
    OpenSettingsAction.prototype.run = function (event) {
        return this.preferencesService.openSettings();
    };
    OpenSettingsAction.ID = 'workbench.action.openSettings';
    OpenSettingsAction.LABEL = nls.localize('openSettings', "Open Settings");
    OpenSettingsAction = __decorate([
        __param(2, IPreferencesService)
    ], OpenSettingsAction);
    return OpenSettingsAction;
}(Action));
export { OpenSettingsAction };
var OpenSettingsJsonAction = /** @class */ (function (_super) {
    __extends(OpenSettingsJsonAction, _super);
    function OpenSettingsJsonAction(id, label, preferencesService) {
        var _this = _super.call(this, id, label) || this;
        _this.preferencesService = preferencesService;
        return _this;
    }
    OpenSettingsJsonAction.prototype.run = function (event) {
        return this.preferencesService.openSettings(true);
    };
    OpenSettingsJsonAction.ID = 'workbench.action.openSettingsJson';
    OpenSettingsJsonAction.LABEL = nls.localize('openSettingsJson', "Open Settings (JSON)");
    OpenSettingsJsonAction = __decorate([
        __param(2, IPreferencesService)
    ], OpenSettingsJsonAction);
    return OpenSettingsJsonAction;
}(Action));
export { OpenSettingsJsonAction };
var OpenGlobalSettingsAction = /** @class */ (function (_super) {
    __extends(OpenGlobalSettingsAction, _super);
    function OpenGlobalSettingsAction(id, label, preferencesService) {
        var _this = _super.call(this, id, label) || this;
        _this.preferencesService = preferencesService;
        return _this;
    }
    OpenGlobalSettingsAction.prototype.run = function (event) {
        return this.preferencesService.openGlobalSettings();
    };
    OpenGlobalSettingsAction.ID = 'workbench.action.openGlobalSettings';
    OpenGlobalSettingsAction.LABEL = nls.localize('openGlobalSettings', "Open User Settings");
    OpenGlobalSettingsAction = __decorate([
        __param(2, IPreferencesService)
    ], OpenGlobalSettingsAction);
    return OpenGlobalSettingsAction;
}(Action));
export { OpenGlobalSettingsAction };
var OpenGlobalKeybindingsAction = /** @class */ (function (_super) {
    __extends(OpenGlobalKeybindingsAction, _super);
    function OpenGlobalKeybindingsAction(id, label, preferencesService) {
        var _this = _super.call(this, id, label) || this;
        _this.preferencesService = preferencesService;
        return _this;
    }
    OpenGlobalKeybindingsAction.prototype.run = function (event) {
        return this.preferencesService.openGlobalKeybindingSettings(false);
    };
    OpenGlobalKeybindingsAction.ID = 'workbench.action.openGlobalKeybindings';
    OpenGlobalKeybindingsAction.LABEL = nls.localize('openGlobalKeybindings', "Open Keyboard Shortcuts");
    OpenGlobalKeybindingsAction = __decorate([
        __param(2, IPreferencesService)
    ], OpenGlobalKeybindingsAction);
    return OpenGlobalKeybindingsAction;
}(Action));
export { OpenGlobalKeybindingsAction };
var OpenGlobalKeybindingsFileAction = /** @class */ (function (_super) {
    __extends(OpenGlobalKeybindingsFileAction, _super);
    function OpenGlobalKeybindingsFileAction(id, label, preferencesService) {
        var _this = _super.call(this, id, label) || this;
        _this.preferencesService = preferencesService;
        return _this;
    }
    OpenGlobalKeybindingsFileAction.prototype.run = function (event) {
        return this.preferencesService.openGlobalKeybindingSettings(true);
    };
    OpenGlobalKeybindingsFileAction.ID = 'workbench.action.openGlobalKeybindingsFile';
    OpenGlobalKeybindingsFileAction.LABEL = nls.localize('openGlobalKeybindingsFile', "Open Keyboard Shortcuts File");
    OpenGlobalKeybindingsFileAction = __decorate([
        __param(2, IPreferencesService)
    ], OpenGlobalKeybindingsFileAction);
    return OpenGlobalKeybindingsFileAction;
}(Action));
export { OpenGlobalKeybindingsFileAction };
var OpenDefaultKeybindingsFileAction = /** @class */ (function (_super) {
    __extends(OpenDefaultKeybindingsFileAction, _super);
    function OpenDefaultKeybindingsFileAction(id, label, preferencesService) {
        var _this = _super.call(this, id, label) || this;
        _this.preferencesService = preferencesService;
        return _this;
    }
    OpenDefaultKeybindingsFileAction.prototype.run = function (event) {
        return this.preferencesService.openDefaultKeybindingsFile();
    };
    OpenDefaultKeybindingsFileAction.ID = 'workbench.action.openDefaultKeybindingsFile';
    OpenDefaultKeybindingsFileAction.LABEL = nls.localize('openDefaultKeybindingsFile', "Open Default Keyboard Shortcuts File");
    OpenDefaultKeybindingsFileAction = __decorate([
        __param(2, IPreferencesService)
    ], OpenDefaultKeybindingsFileAction);
    return OpenDefaultKeybindingsFileAction;
}(Action));
export { OpenDefaultKeybindingsFileAction };
var OpenWorkspaceSettingsAction = /** @class */ (function (_super) {
    __extends(OpenWorkspaceSettingsAction, _super);
    function OpenWorkspaceSettingsAction(id, label, preferencesService, workspaceContextService) {
        var _this = _super.call(this, id, label) || this;
        _this.preferencesService = preferencesService;
        _this.workspaceContextService = workspaceContextService;
        _this.disposables = [];
        _this.update();
        _this.workspaceContextService.onDidChangeWorkbenchState(function () { return _this.update(); }, _this, _this.disposables);
        return _this;
    }
    OpenWorkspaceSettingsAction.prototype.update = function () {
        this.enabled = this.workspaceContextService.getWorkbenchState() !== 1 /* EMPTY */;
    };
    OpenWorkspaceSettingsAction.prototype.run = function (event) {
        return this.preferencesService.openWorkspaceSettings();
    };
    OpenWorkspaceSettingsAction.prototype.dispose = function () {
        this.disposables = dispose(this.disposables);
        _super.prototype.dispose.call(this);
    };
    OpenWorkspaceSettingsAction.ID = 'workbench.action.openWorkspaceSettings';
    OpenWorkspaceSettingsAction.LABEL = nls.localize('openWorkspaceSettings', "Open Workspace Settings");
    OpenWorkspaceSettingsAction = __decorate([
        __param(2, IPreferencesService),
        __param(3, IWorkspaceContextService)
    ], OpenWorkspaceSettingsAction);
    return OpenWorkspaceSettingsAction;
}(Action));
export { OpenWorkspaceSettingsAction };
export var OPEN_FOLDER_SETTINGS_COMMAND = '_workbench.action.openFolderSettings';
export var OPEN_FOLDER_SETTINGS_LABEL = nls.localize('openFolderSettings', "Open Folder Settings");
var OpenFolderSettingsAction = /** @class */ (function (_super) {
    __extends(OpenFolderSettingsAction, _super);
    function OpenFolderSettingsAction(id, label, workspaceContextService, preferencesService, commandService) {
        var _this = _super.call(this, id, label) || this;
        _this.workspaceContextService = workspaceContextService;
        _this.preferencesService = preferencesService;
        _this.commandService = commandService;
        _this.disposables = [];
        _this.update();
        _this.workspaceContextService.onDidChangeWorkbenchState(function () { return _this.update(); }, _this, _this.disposables);
        _this.workspaceContextService.onDidChangeWorkspaceFolders(function () { return _this.update(); }, _this, _this.disposables);
        return _this;
    }
    OpenFolderSettingsAction.prototype.update = function () {
        this.enabled = this.workspaceContextService.getWorkbenchState() === 3 /* WORKSPACE */ && this.workspaceContextService.getWorkspace().folders.length > 0;
    };
    OpenFolderSettingsAction.prototype.run = function () {
        var _this = this;
        return this.commandService.executeCommand(PICK_WORKSPACE_FOLDER_COMMAND_ID)
            .then(function (workspaceFolder) {
            if (workspaceFolder) {
                return _this.preferencesService.openFolderSettings(workspaceFolder.uri);
            }
            return null;
        });
    };
    OpenFolderSettingsAction.prototype.dispose = function () {
        this.disposables = dispose(this.disposables);
        _super.prototype.dispose.call(this);
    };
    OpenFolderSettingsAction.ID = 'workbench.action.openFolderSettings';
    OpenFolderSettingsAction.LABEL = OPEN_FOLDER_SETTINGS_LABEL;
    OpenFolderSettingsAction = __decorate([
        __param(2, IWorkspaceContextService),
        __param(3, IPreferencesService),
        __param(4, ICommandService)
    ], OpenFolderSettingsAction);
    return OpenFolderSettingsAction;
}(Action));
export { OpenFolderSettingsAction };
var ConfigureLanguageBasedSettingsAction = /** @class */ (function (_super) {
    __extends(ConfigureLanguageBasedSettingsAction, _super);
    function ConfigureLanguageBasedSettingsAction(id, label, modelService, modeService, quickInputService, preferencesService) {
        var _this = _super.call(this, id, label) || this;
        _this.modelService = modelService;
        _this.modeService = modeService;
        _this.quickInputService = quickInputService;
        _this.preferencesService = preferencesService;
        return _this;
    }
    ConfigureLanguageBasedSettingsAction.prototype.run = function () {
        var _this = this;
        var languages = this.modeService.getRegisteredLanguageNames();
        var picks = languages.sort().map(function (lang, index) {
            var description = nls.localize('languageDescriptionConfigured', "({0})", _this.modeService.getModeIdForLanguageName(lang.toLowerCase()));
            // construct a fake resource to be able to show nice icons if any
            var fakeResource;
            var extensions = _this.modeService.getExtensions(lang);
            if (extensions && extensions.length) {
                fakeResource = URI.file(extensions[0]);
            }
            else {
                var filenames = _this.modeService.getFilenames(lang);
                if (filenames && filenames.length) {
                    fakeResource = URI.file(filenames[0]);
                }
            }
            return {
                label: lang,
                iconClasses: getIconClasses(_this.modelService, _this.modeService, fakeResource),
                description: description
            };
        });
        return this.quickInputService.pick(picks, { placeHolder: nls.localize('pickLanguage', "Select Language") })
            .then(function (pick) {
            if (pick) {
                return _this.modeService.getOrCreateModeByLanguageName(pick.label)
                    .then(function (mode) { return _this.preferencesService.configureSettingsForLanguage(mode.getLanguageIdentifier().language); });
            }
            return undefined;
        });
    };
    ConfigureLanguageBasedSettingsAction.ID = 'workbench.action.configureLanguageBasedSettings';
    ConfigureLanguageBasedSettingsAction.LABEL = nls.localize('configureLanguageBasedSettings', "Configure Language Specific Settings...");
    ConfigureLanguageBasedSettingsAction = __decorate([
        __param(2, IModelService),
        __param(3, IModeService),
        __param(4, IQuickInputService),
        __param(5, IPreferencesService)
    ], ConfigureLanguageBasedSettingsAction);
    return ConfigureLanguageBasedSettingsAction;
}(Action));
export { ConfigureLanguageBasedSettingsAction };
