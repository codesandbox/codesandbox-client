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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import * as nls from '../../../../nls.js';
import { URI } from '../../../../base/common/uri.js';
import * as json from '../../../../base/common/json.js';
import * as encoding from '../../../../base/node/encoding.js';
import * as strings from '../../../../base/common/strings.js';
import { setProperty } from '../../../../base/common/jsonEdit.js';
import { Queue } from '../../../../base/common/async.js';
import { EditOperation } from '../../../../editor/common/core/editOperation.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { Range } from '../../../../editor/common/core/range.js';
import { Selection } from '../../../../editor/common/core/selection.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { IEnvironmentService } from '../../../../platform/environment/common/environment.js';
import { ITextFileService } from '../../textfile/common/textfiles.js';
import { IConfigurationService, keyFromOverrideIdentifier } from '../../../../platform/configuration/common/configuration.js';
import { FOLDER_SETTINGS_PATH, WORKSPACE_STANDALONE_CONFIGURATIONS, TASKS_CONFIGURATION_KEY, LAUNCH_CONFIGURATION_KEY } from '../common/configuration.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { ITextModelService } from '../../../../editor/common/services/resolverService.js';
import { OVERRIDE_PROPERTY_PATTERN, Extensions as ConfigurationExtensions } from '../../../../platform/configuration/common/configurationRegistry.js';
import { IEditorService } from '../../editor/common/editorService.js';
import { INotificationService, Severity } from '../../../../platform/notification/common/notification.js';
import { IPreferencesService } from '../../preferences/common/preferences.js';
var ConfigurationEditingError = /** @class */ (function (_super) {
    __extends(ConfigurationEditingError, _super);
    function ConfigurationEditingError(message, code) {
        var _this = _super.call(this, message) || this;
        _this.code = code;
        return _this;
    }
    return ConfigurationEditingError;
}(Error));
export { ConfigurationEditingError };
var ConfigurationEditingService = /** @class */ (function () {
    function ConfigurationEditingService(configurationService, contextService, environmentService, fileService, textModelResolverService, textFileService, notificationService, preferencesService, editorService) {
        this.configurationService = configurationService;
        this.contextService = contextService;
        this.environmentService = environmentService;
        this.fileService = fileService;
        this.textModelResolverService = textModelResolverService;
        this.textFileService = textFileService;
        this.notificationService = notificationService;
        this.preferencesService = preferencesService;
        this.editorService = editorService;
        this.queue = new Queue();
    }
    ConfigurationEditingService.prototype.writeConfiguration = function (target, value, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        var operation = this.getConfigurationEditOperation(target, value, options.scopes || {});
        return Promise.resolve(this.queue.queue(function () { return _this.doWriteConfiguration(operation, options) // queue up writes to prevent race conditions
            .then(function () { return null; }, function (error) {
            if (!options.donotNotifyError) {
                _this.onError(error, operation, options.scopes);
            }
            return Promise.reject(error);
        }); }));
    };
    ConfigurationEditingService.prototype.doWriteConfiguration = function (operation, options) {
        var _this = this;
        var checkDirtyConfiguration = !(options.force || options.donotSave);
        var saveConfiguration = options.force || !options.donotSave;
        return this.resolveAndValidate(operation.target, operation, checkDirtyConfiguration, options.scopes || {})
            .then(function (reference) { return _this.writeToBuffer(reference.object.textEditorModel, operation, saveConfiguration)
            .then(function () { return reference.dispose(); }); });
    };
    ConfigurationEditingService.prototype.writeToBuffer = function (model, operation, save) {
        return __awaiter(this, void 0, void 0, function () {
            var edit;
            return __generator(this, function (_a) {
                edit = this.getEdits(model, operation)[0];
                if (edit && this.applyEditsToBuffer(edit, model) && save) {
                    return [2 /*return*/, this.textFileService.save(operation.resource, { skipSaveParticipants: true /* programmatic change */ })];
                }
                return [2 /*return*/];
            });
        });
    };
    ConfigurationEditingService.prototype.applyEditsToBuffer = function (edit, model) {
        var startPosition = model.getPositionAt(edit.offset);
        var endPosition = model.getPositionAt(edit.offset + edit.length);
        var range = new Range(startPosition.lineNumber, startPosition.column, endPosition.lineNumber, endPosition.column);
        var currentText = model.getValueInRange(range);
        if (edit.content !== currentText) {
            var editOperation = currentText ? EditOperation.replace(range, edit.content) : EditOperation.insert(startPosition, edit.content);
            model.pushEditOperations([new Selection(startPosition.lineNumber, startPosition.column, startPosition.lineNumber, startPosition.column)], [editOperation], function () { return []; });
            return true;
        }
        return false;
    };
    ConfigurationEditingService.prototype.onError = function (error, operation, scopes) {
        switch (error.code) {
            case 8 /* ERROR_INVALID_CONFIGURATION */:
                this.onInvalidConfigurationError(error, operation);
                break;
            case 7 /* ERROR_CONFIGURATION_FILE_DIRTY */:
                this.onConfigurationFileDirtyError(error, operation, scopes);
                break;
            default:
                this.notificationService.error(error.message);
        }
    };
    ConfigurationEditingService.prototype.onInvalidConfigurationError = function (error, operation) {
        var _this = this;
        var openStandAloneConfigurationActionLabel = operation.workspaceStandAloneConfigurationKey === TASKS_CONFIGURATION_KEY ? nls.localize('openTasksConfiguration', "Open Tasks Configuration")
            : operation.workspaceStandAloneConfigurationKey === LAUNCH_CONFIGURATION_KEY ? nls.localize('openLaunchConfiguration', "Open Launch Configuration")
                : null;
        if (openStandAloneConfigurationActionLabel) {
            this.notificationService.prompt(Severity.Error, error.message, [{
                    label: openStandAloneConfigurationActionLabel,
                    run: function () { return _this.openFile(operation.resource); }
                }]);
        }
        else {
            this.notificationService.prompt(Severity.Error, error.message, [{
                    label: nls.localize('open', "Open Settings"),
                    run: function () { return _this.openSettings(operation); }
                }]);
        }
    };
    ConfigurationEditingService.prototype.onConfigurationFileDirtyError = function (error, operation, scopes) {
        var _this = this;
        var openStandAloneConfigurationActionLabel = operation.workspaceStandAloneConfigurationKey === TASKS_CONFIGURATION_KEY ? nls.localize('openTasksConfiguration', "Open Tasks Configuration")
            : operation.workspaceStandAloneConfigurationKey === LAUNCH_CONFIGURATION_KEY ? nls.localize('openLaunchConfiguration', "Open Launch Configuration")
                : null;
        if (openStandAloneConfigurationActionLabel) {
            this.notificationService.prompt(Severity.Error, error.message, [{
                    label: nls.localize('saveAndRetry', "Save and Retry"),
                    run: function () {
                        var key = operation.key ? operation.workspaceStandAloneConfigurationKey + "." + operation.key : operation.workspaceStandAloneConfigurationKey;
                        _this.writeConfiguration(operation.target, { key: key, value: operation.value }, { force: true, scopes: scopes });
                    }
                },
                {
                    label: openStandAloneConfigurationActionLabel,
                    run: function () { return _this.openFile(operation.resource); }
                }]);
        }
        else {
            this.notificationService.prompt(Severity.Error, error.message, [{
                    label: nls.localize('saveAndRetry', "Save and Retry"),
                    run: function () { return _this.writeConfiguration(operation.target, { key: operation.key, value: operation.value }, { force: true, scopes: scopes }); }
                },
                {
                    label: nls.localize('open', "Open Settings"),
                    run: function () { return _this.openSettings(operation); }
                }]);
        }
    };
    ConfigurationEditingService.prototype.openSettings = function (operation) {
        switch (operation.target) {
            case 1 /* USER */:
                this.preferencesService.openGlobalSettings(true);
                break;
            case 2 /* WORKSPACE */:
                this.preferencesService.openWorkspaceSettings(true);
                break;
            case 3 /* WORKSPACE_FOLDER */:
                if (operation.resource) {
                    var workspaceFolder = this.contextService.getWorkspaceFolder(operation.resource);
                    if (workspaceFolder) {
                        this.preferencesService.openFolderSettings(workspaceFolder.uri, true);
                    }
                }
                break;
        }
    };
    ConfigurationEditingService.prototype.openFile = function (resource) {
        this.editorService.openEditor({ resource: resource });
    };
    ConfigurationEditingService.prototype.wrapError = function (code, target, operation) {
        var message = this.toErrorMessage(code, target, operation);
        return Promise.reject(new ConfigurationEditingError(message, code));
    };
    ConfigurationEditingService.prototype.toErrorMessage = function (error, target, operation) {
        switch (error) {
            // API constraints
            case 0 /* ERROR_UNKNOWN_KEY */: return nls.localize('errorUnknownKey', "Unable to write to {0} because {1} is not a registered configuration.", this.stringifyTarget(target), operation.key);
            case 1 /* ERROR_INVALID_WORKSPACE_CONFIGURATION_APPLICATION */: return nls.localize('errorInvalidWorkspaceConfigurationApplication', "Unable to write {0} to Workspace Settings. This setting can be written only into User settings.", operation.key);
            case 2 /* ERROR_INVALID_FOLDER_CONFIGURATION */: return nls.localize('errorInvalidFolderConfiguration', "Unable to write to Folder Settings because {0} does not support the folder resource scope.", operation.key);
            case 3 /* ERROR_INVALID_USER_TARGET */: return nls.localize('errorInvalidUserTarget', "Unable to write to User Settings because {0} does not support for global scope.", operation.key);
            case 4 /* ERROR_INVALID_WORKSPACE_TARGET */: return nls.localize('errorInvalidWorkspaceTarget', "Unable to write to Workspace Settings because {0} does not support for workspace scope in a multi folder workspace.", operation.key);
            case 5 /* ERROR_INVALID_FOLDER_TARGET */: return nls.localize('errorInvalidFolderTarget', "Unable to write to Folder Settings because no resource is provided.");
            case 6 /* ERROR_NO_WORKSPACE_OPENED */: return nls.localize('errorNoWorkspaceOpened', "Unable to write to {0} because no workspace is opened. Please open a workspace first and try again.", this.stringifyTarget(target));
            // User issues
            case 8 /* ERROR_INVALID_CONFIGURATION */: {
                if (operation.workspaceStandAloneConfigurationKey === TASKS_CONFIGURATION_KEY) {
                    return nls.localize('errorInvalidTaskConfiguration', "Unable to write into the tasks configuration file. Please open it to correct errors/warnings in it and try again.");
                }
                if (operation.workspaceStandAloneConfigurationKey === LAUNCH_CONFIGURATION_KEY) {
                    return nls.localize('errorInvalidLaunchConfiguration', "Unable to write into the launch configuration file. Please open it to correct errors/warnings in it and try again.");
                }
                switch (target) {
                    case 1 /* USER */:
                        return nls.localize('errorInvalidConfiguration', "Unable to write into user settings. Please open the user settings to correct errors/warnings in it and try again.");
                    case 2 /* WORKSPACE */:
                        return nls.localize('errorInvalidConfigurationWorkspace', "Unable to write into workspace settings. Please open the workspace settings to correct errors/warnings in the file and try again.");
                    case 3 /* WORKSPACE_FOLDER */:
                        var workspaceFolderName = this.contextService.getWorkspaceFolder(operation.resource).name;
                        return nls.localize('errorInvalidConfigurationFolder', "Unable to write into folder settings. Please open the '{0}' folder settings to correct errors/warnings in it and try again.", workspaceFolderName);
                }
                return '';
            }
            case 7 /* ERROR_CONFIGURATION_FILE_DIRTY */: {
                if (operation.workspaceStandAloneConfigurationKey === TASKS_CONFIGURATION_KEY) {
                    return nls.localize('errorTasksConfigurationFileDirty', "Unable to write into tasks configuration file because the file is dirty. Please save it first and then try again.");
                }
                if (operation.workspaceStandAloneConfigurationKey === LAUNCH_CONFIGURATION_KEY) {
                    return nls.localize('errorLaunchConfigurationFileDirty', "Unable to write into launch configuration file because the file is dirty. Please save it first and then try again.");
                }
                switch (target) {
                    case 1 /* USER */:
                        return nls.localize('errorConfigurationFileDirty', "Unable to write into user settings because the file is dirty. Please save the user settings file first and then try again.");
                    case 2 /* WORKSPACE */:
                        return nls.localize('errorConfigurationFileDirtyWorkspace', "Unable to write into workspace settings because the file is dirty. Please save the workspace settings file first and then try again.");
                    case 3 /* WORKSPACE_FOLDER */:
                        var workspaceFolderName = this.contextService.getWorkspaceFolder(operation.resource).name;
                        return nls.localize('errorConfigurationFileDirtyFolder', "Unable to write into folder settings because the file is dirty. Please save the '{0}' folder settings file first and then try again.", workspaceFolderName);
                }
                return '';
            }
        }
    };
    ConfigurationEditingService.prototype.stringifyTarget = function (target) {
        switch (target) {
            case 1 /* USER */:
                return nls.localize('userTarget', "User Settings");
            case 2 /* WORKSPACE */:
                return nls.localize('workspaceTarget', "Workspace Settings");
            case 3 /* WORKSPACE_FOLDER */:
                return nls.localize('folderTarget', "Folder Settings");
        }
        return '';
    };
    ConfigurationEditingService.prototype.getEdits = function (model, edit) {
        var _a = model.getOptions(), tabSize = _a.tabSize, insertSpaces = _a.insertSpaces;
        var eol = model.getEOL();
        var value = edit.value, jsonPath = edit.jsonPath;
        // Without jsonPath, the entire configuration file is being replaced, so we just use JSON.stringify
        if (!jsonPath.length) {
            var content = JSON.stringify(value, null, insertSpaces ? strings.repeat(' ', tabSize) : '\t');
            return [{
                    content: content,
                    length: model.getValue().length,
                    offset: 0
                }];
        }
        return setProperty(model.getValue(), jsonPath, value, { tabSize: tabSize, insertSpaces: insertSpaces, eol: eol });
    };
    ConfigurationEditingService.prototype.resolveModelReference = function (resource) {
        return __awaiter(this, void 0, void 0, function () {
            var exists;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fileService.existsFile(resource)];
                    case 1:
                        exists = _a.sent();
                        if (!!exists) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.fileService.updateContent(resource, '{}', { encoding: encoding.UTF8 })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, this.textModelResolverService.createModelReference(resource)];
                }
            });
        });
    };
    ConfigurationEditingService.prototype.hasParseErrors = function (model, operation) {
        // If we write to a workspace standalone file and replace the entire contents (no key provided)
        // we can return here because any parse errors can safely be ignored since all contents are replaced
        if (operation.workspaceStandAloneConfigurationKey && !operation.key) {
            return false;
        }
        var parseErrors = [];
        json.parse(model.getValue(), parseErrors);
        return parseErrors.length > 0;
    };
    ConfigurationEditingService.prototype.resolveAndValidate = function (target, operation, checkDirty, overrides) {
        var _this = this;
        // Any key must be a known setting from the registry (unless this is a standalone config)
        if (!operation.workspaceStandAloneConfigurationKey) {
            var validKeys = this.configurationService.keys().default;
            if (validKeys.indexOf(operation.key) < 0 && !OVERRIDE_PROPERTY_PATTERN.test(operation.key)) {
                return this.wrapError(0 /* ERROR_UNKNOWN_KEY */, target, operation);
            }
        }
        if (operation.workspaceStandAloneConfigurationKey) {
            // Global tasks and launches are not supported
            if (target === 1 /* USER */) {
                return this.wrapError(3 /* ERROR_INVALID_USER_TARGET */, target, operation);
            }
            // Workspace tasks are not supported
            if (operation.workspaceStandAloneConfigurationKey === TASKS_CONFIGURATION_KEY && this.contextService.getWorkbenchState() === 3 /* WORKSPACE */ && operation.target === 2 /* WORKSPACE */) {
                return this.wrapError(4 /* ERROR_INVALID_WORKSPACE_TARGET */, target, operation);
            }
        }
        // Target cannot be workspace or folder if no workspace opened
        if ((target === 2 /* WORKSPACE */ || target === 3 /* WORKSPACE_FOLDER */) && this.contextService.getWorkbenchState() === 1 /* EMPTY */) {
            return this.wrapError(6 /* ERROR_NO_WORKSPACE_OPENED */, target, operation);
        }
        if (target === 2 /* WORKSPACE */) {
            if (!operation.workspaceStandAloneConfigurationKey) {
                var configurationProperties = Registry.as(ConfigurationExtensions.Configuration).getConfigurationProperties();
                if (configurationProperties[operation.key].scope === 1 /* APPLICATION */) {
                    return this.wrapError(1 /* ERROR_INVALID_WORKSPACE_CONFIGURATION_APPLICATION */, target, operation);
                }
            }
        }
        if (target === 3 /* WORKSPACE_FOLDER */) {
            if (!operation.resource) {
                return this.wrapError(5 /* ERROR_INVALID_FOLDER_TARGET */, target, operation);
            }
            if (!operation.workspaceStandAloneConfigurationKey) {
                var configurationProperties = Registry.as(ConfigurationExtensions.Configuration).getConfigurationProperties();
                if (configurationProperties[operation.key].scope !== 3 /* RESOURCE */) {
                    return this.wrapError(2 /* ERROR_INVALID_FOLDER_CONFIGURATION */, target, operation);
                }
            }
        }
        return this.resolveModelReference(operation.resource)
            .then(function (reference) {
            var model = reference.object.textEditorModel;
            if (_this.hasParseErrors(model, operation)) {
                return _this.wrapError(8 /* ERROR_INVALID_CONFIGURATION */, target, operation);
            }
            // Target cannot be dirty if not writing into buffer
            if (checkDirty && _this.textFileService.isDirty(operation.resource)) {
                return _this.wrapError(7 /* ERROR_CONFIGURATION_FILE_DIRTY */, target, operation);
            }
            return reference;
        });
    };
    ConfigurationEditingService.prototype.getConfigurationEditOperation = function (target, config, overrides) {
        // Check for standalone workspace configurations
        if (config.key) {
            var standaloneConfigurationKeys = Object.keys(WORKSPACE_STANDALONE_CONFIGURATIONS);
            for (var i = 0; i < standaloneConfigurationKeys.length; i++) {
                var key_1 = standaloneConfigurationKeys[i];
                var resource_1 = this.getConfigurationFileResource(target, WORKSPACE_STANDALONE_CONFIGURATIONS[key_1], overrides.resource);
                // Check for prefix
                if (config.key === key_1) {
                    var jsonPath_1 = this.isWorkspaceConfigurationResource(resource_1) ? [key_1] : [];
                    return { key: jsonPath_1[jsonPath_1.length - 1], jsonPath: jsonPath_1, value: config.value, resource: resource_1, workspaceStandAloneConfigurationKey: key_1, target: target };
                }
                // Check for prefix.<setting>
                var keyPrefix = key_1 + ".";
                if (config.key.indexOf(keyPrefix) === 0) {
                    var jsonPath_2 = this.isWorkspaceConfigurationResource(resource_1) ? [key_1, config.key.substr(keyPrefix.length)] : [config.key.substr(keyPrefix.length)];
                    return { key: jsonPath_2[jsonPath_2.length - 1], jsonPath: jsonPath_2, value: config.value, resource: resource_1, workspaceStandAloneConfigurationKey: key_1, target: target };
                }
            }
        }
        var key = config.key;
        var jsonPath = overrides.overrideIdentifier ? [keyFromOverrideIdentifier(overrides.overrideIdentifier), key] : [key];
        if (target === 1 /* USER */) {
            return { key: key, jsonPath: jsonPath, value: config.value, resource: URI.file(this.environmentService.appSettingsPath), target: target };
        }
        var resource = this.getConfigurationFileResource(target, FOLDER_SETTINGS_PATH, overrides.resource);
        if (this.isWorkspaceConfigurationResource(resource)) {
            jsonPath = ['settings'].concat(jsonPath);
        }
        return { key: key, jsonPath: jsonPath, value: config.value, resource: resource, target: target };
    };
    ConfigurationEditingService.prototype.isWorkspaceConfigurationResource = function (resource) {
        var workspace = this.contextService.getWorkspace();
        return workspace.configuration && resource && workspace.configuration.fsPath === resource.fsPath;
    };
    ConfigurationEditingService.prototype.getConfigurationFileResource = function (target, relativePath, resource) {
        if (target === 1 /* USER */) {
            return URI.file(this.environmentService.appSettingsPath);
        }
        var workbenchState = this.contextService.getWorkbenchState();
        if (workbenchState !== 1 /* EMPTY */) {
            var workspace = this.contextService.getWorkspace();
            if (target === 2 /* WORKSPACE */) {
                if (workbenchState === 3 /* WORKSPACE */) {
                    return workspace.configuration;
                }
                if (workbenchState === 2 /* FOLDER */) {
                    return workspace.folders[0].toResource(relativePath);
                }
            }
            if (target === 3 /* WORKSPACE_FOLDER */) {
                if (resource) {
                    var folder = this.contextService.getWorkspaceFolder(resource);
                    if (folder) {
                        return folder.toResource(relativePath);
                    }
                }
            }
        }
        return null;
    };
    ConfigurationEditingService = __decorate([
        __param(0, IConfigurationService),
        __param(1, IWorkspaceContextService),
        __param(2, IEnvironmentService),
        __param(3, IFileService),
        __param(4, ITextModelService),
        __param(5, ITextFileService),
        __param(6, INotificationService),
        __param(7, IPreferencesService),
        __param(8, IEditorService)
    ], ConfigurationEditingService);
    return ConfigurationEditingService;
}());
export { ConfigurationEditingService };
