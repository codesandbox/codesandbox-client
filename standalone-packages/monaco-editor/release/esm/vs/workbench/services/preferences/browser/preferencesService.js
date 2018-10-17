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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Emitter } from '../../../../base/common/event.js';
import { parse } from '../../../../base/common/json.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import * as network from '../../../../base/common/network.js';
import { assign } from '../../../../base/common/objects.js';
import * as strings from '../../../../base/common/strings.js';
import { URI } from '../../../../base/common/uri.js';
import { TPromise } from '../../../../base/common/winjs.base.js';
import { getCodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { EditOperation } from '../../../../editor/common/core/editOperation.js';
import { Position } from '../../../../editor/common/core/position.js';
import { IModelService } from '../../../../editor/common/services/modelService.js';
import { IModeService } from '../../../../editor/common/services/modeService.js';
import { ITextModelService } from '../../../../editor/common/services/resolverService.js';
import * as nls from '../../../../nls.js';
import { IEnvironmentService } from '../../../../platform/environment/common/environment.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { IWorkspaceConfigurationService } from '../../configuration/common/configuration.js';
import { IJSONEditingService } from '../../configuration/common/jsonEditing.js';
import { IEditorService } from '../../editor/common/editorService.js';
import { IEditorGroupsService } from '../../group/common/editorGroupsService.js';
import { DEFAULT_SETTINGS_EDITOR_SETTING, FOLDER_SETTINGS_PATH, getSettingsTargetName, SettingsEditorOptions } from '../common/preferences.js';
import { DefaultPreferencesEditorInput, KeybindingsEditorInput, PreferencesEditorInput, SettingsEditor2Input } from '../common/preferencesEditorInput.js';
import { defaultKeybindingsContents, DefaultKeybindingsEditorModel, DefaultSettings, DefaultSettingsEditorModel, Settings2EditorModel, SettingsEditorModel, WorkspaceConfigurationEditorModel } from '../common/preferencesModels.js';
var emptyEditableSettingsContent = '{\n}';
var PreferencesService = /** @class */ (function (_super) {
    __extends(PreferencesService, _super);
    function PreferencesService(editorService, editorGroupService, fileService, configurationService, notificationService, contextService, instantiationService, environmentService, telemetryService, textModelResolverService, keybindingService, modelService, jsonEditingService, modeService, labelService) {
        var _this = _super.call(this) || this;
        _this.editorService = editorService;
        _this.editorGroupService = editorGroupService;
        _this.fileService = fileService;
        _this.configurationService = configurationService;
        _this.notificationService = notificationService;
        _this.contextService = contextService;
        _this.instantiationService = instantiationService;
        _this.environmentService = environmentService;
        _this.telemetryService = telemetryService;
        _this.textModelResolverService = textModelResolverService;
        _this.modelService = modelService;
        _this.jsonEditingService = jsonEditingService;
        _this.modeService = modeService;
        _this.labelService = labelService;
        _this.lastOpenedSettingsInput = null;
        _this._onDispose = new Emitter();
        _this._defaultUserSettingsUriCounter = 0;
        _this._defaultWorkspaceSettingsUriCounter = 0;
        _this._defaultFolderSettingsUriCounter = 0;
        _this.defaultKeybindingsResource = URI.from({ scheme: network.Schemas.vscode, authority: 'defaultsettings', path: '/keybindings.json' });
        _this.defaultSettingsRawResource = URI.from({ scheme: network.Schemas.vscode, authority: 'defaultsettings', path: '/defaultSettings.json' });
        // The default keybindings.json updates based on keyboard layouts, so here we make sure
        // if a model has been given out we update it accordingly.
        keybindingService.onDidUpdateKeybindings(function () {
            var model = modelService.getModel(_this.defaultKeybindingsResource);
            if (!model) {
                // model has not been given out => nothing to do
                return;
            }
            modelService.updateModel(model, defaultKeybindingsContents(keybindingService));
        });
        return _this;
    }
    Object.defineProperty(PreferencesService.prototype, "userSettingsResource", {
        get: function () {
            return this.getEditableSettingsURI(1 /* USER */);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PreferencesService.prototype, "workspaceSettingsResource", {
        get: function () {
            return this.getEditableSettingsURI(2 /* WORKSPACE */);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PreferencesService.prototype, "settingsEditor2Input", {
        get: function () {
            return this.instantiationService.createInstance(SettingsEditor2Input);
        },
        enumerable: true,
        configurable: true
    });
    PreferencesService.prototype.getFolderSettingsResource = function (resource) {
        return this.getEditableSettingsURI(3 /* WORKSPACE_FOLDER */, resource);
    };
    PreferencesService.prototype.resolveModel = function (uri) {
        var _this = this;
        if (this.isDefaultSettingsResource(uri)) {
            var target_1 = this.getConfigurationTargetFromDefaultSettingsResource(uri);
            var mode = this.modeService.getOrCreateMode('jsonc');
            var model = this._register(this.modelService.createModel('', mode, uri));
            var defaultSettings_1;
            this.configurationService.onDidChangeConfiguration(function (e) {
                if (e.source === 4 /* DEFAULT */) {
                    var model_1 = _this.modelService.getModel(uri);
                    if (!model_1) {
                        // model has not been given out => nothing to do
                        return;
                    }
                    defaultSettings_1 = _this.getDefaultSettings(target_1);
                    _this.modelService.updateModel(model_1, defaultSettings_1.getContent(true));
                    defaultSettings_1._onDidChange.fire();
                }
            });
            // Check if Default settings is already created and updated in above promise
            if (!defaultSettings_1) {
                defaultSettings_1 = this.getDefaultSettings(target_1);
                this.modelService.updateModel(model, defaultSettings_1.getContent(true));
            }
            return TPromise.as(model);
        }
        if (this.defaultSettingsRawResource.toString() === uri.toString()) {
            var defaultSettings = this.getDefaultSettings(1 /* USER */);
            var mode = this.modeService.getOrCreateMode('jsonc');
            var model = this._register(this.modelService.createModel(defaultSettings.raw, mode, uri));
            return TPromise.as(model);
        }
        if (this.defaultKeybindingsResource.toString() === uri.toString()) {
            var defaultKeybindingsEditorModel = this.instantiationService.createInstance(DefaultKeybindingsEditorModel, uri);
            var mode = this.modeService.getOrCreateMode('jsonc');
            var model = this._register(this.modelService.createModel(defaultKeybindingsEditorModel.content, mode, uri));
            return TPromise.as(model);
        }
        return TPromise.as(null);
    };
    PreferencesService.prototype.createPreferencesEditorModel = function (uri) {
        if (this.isDefaultSettingsResource(uri)) {
            return this.createDefaultSettingsEditorModel(uri);
        }
        if (this.getEditableSettingsURI(1 /* USER */).toString() === uri.toString()) {
            return this.createEditableSettingsEditorModel(1 /* USER */, uri);
        }
        var workspaceSettingsUri = this.getEditableSettingsURI(2 /* WORKSPACE */);
        if (workspaceSettingsUri && workspaceSettingsUri.toString() === uri.toString()) {
            return this.createEditableSettingsEditorModel(2 /* WORKSPACE */, workspaceSettingsUri);
        }
        if (this.contextService.getWorkbenchState() === 3 /* WORKSPACE */) {
            return this.createEditableSettingsEditorModel(3 /* WORKSPACE_FOLDER */, uri);
        }
        return TPromise.wrap(null);
    };
    PreferencesService.prototype.openRawDefaultSettings = function () {
        return this.editorService.openEditor({ resource: this.defaultSettingsRawResource });
    };
    PreferencesService.prototype.openRawUserSettings = function () {
        return this.editorService.openEditor({ resource: this.userSettingsResource });
    };
    PreferencesService.prototype.openSettings = function (jsonEditor) {
        jsonEditor = typeof jsonEditor === 'undefined' ?
            this.configurationService.getValue('workbench.settings.editor') === 'json' :
            jsonEditor;
        if (!jsonEditor) {
            return this.openSettings2();
        }
        var editorInput = this.getActiveSettingsEditorInput() || this.lastOpenedSettingsInput;
        var resource = editorInput ? editorInput.master.getResource() : this.userSettingsResource;
        var target = this.getConfigurationTargetFromSettingsResource(resource);
        return this.openOrSwitchSettings(target, resource);
    };
    PreferencesService.prototype.openSettings2 = function () {
        var _this = this;
        var input = this.settingsEditor2Input;
        return this.editorGroupService.activeGroup.openEditor(input)
            .then(function () { return _this.editorGroupService.activeGroup.activeControl; });
    };
    PreferencesService.prototype.openGlobalSettings = function (jsonEditor, options, group) {
        jsonEditor = typeof jsonEditor === 'undefined' ?
            this.configurationService.getValue('workbench.settings.editor') === 'json' :
            jsonEditor;
        return jsonEditor ?
            this.openOrSwitchSettings(1 /* USER */, this.userSettingsResource, options, group) :
            this.openOrSwitchSettings2(1 /* USER */, undefined, options, group);
    };
    PreferencesService.prototype.openWorkspaceSettings = function (jsonEditor, options, group) {
        jsonEditor = typeof jsonEditor === 'undefined' ?
            this.configurationService.getValue('workbench.settings.editor') === 'json' :
            jsonEditor;
        if (this.contextService.getWorkbenchState() === 1 /* EMPTY */) {
            this.notificationService.info(nls.localize('openFolderFirst', "Open a folder first to create workspace settings"));
            return TPromise.as(null);
        }
        return jsonEditor ?
            this.openOrSwitchSettings(2 /* WORKSPACE */, this.workspaceSettingsResource, options, group) :
            this.openOrSwitchSettings2(2 /* WORKSPACE */, undefined, options, group);
    };
    PreferencesService.prototype.openFolderSettings = function (folder, jsonEditor, options, group) {
        jsonEditor = typeof jsonEditor === 'undefined' ?
            this.configurationService.getValue('workbench.settings.editor') === 'json' :
            jsonEditor;
        return jsonEditor ?
            this.openOrSwitchSettings(3 /* WORKSPACE_FOLDER */, this.getEditableSettingsURI(3 /* WORKSPACE_FOLDER */, folder), options, group) :
            this.openOrSwitchSettings2(3 /* WORKSPACE_FOLDER */, folder, options, group);
    };
    PreferencesService.prototype.switchSettings = function (target, resource, jsonEditor) {
        if (!jsonEditor) {
            return this.doOpenSettings2(target, resource).then(function () { return null; });
        }
        var activeControl = this.editorService.activeControl;
        if (activeControl && activeControl.input instanceof PreferencesEditorInput) {
            return this.doSwitchSettings(target, resource, activeControl.input, activeControl.group).then(function () { return null; });
        }
        else {
            return this.doOpenSettings(target, resource).then(function () { return null; });
        }
    };
    PreferencesService.prototype.openGlobalKeybindingSettings = function (textual) {
        var _this = this;
        /* __GDPR__
            "openKeybindings" : {
                "textual" : { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true }
            }
        */
        this.telemetryService.publicLog('openKeybindings', { textual: textual });
        if (textual) {
            var emptyContents = '// ' + nls.localize('emptyKeybindingsHeader', "Place your key bindings in this file to overwrite the defaults") + '\n[\n]';
            var editableKeybindings_1 = URI.file(this.environmentService.appKeybindingsPath);
            var openDefaultKeybindings_1 = !!this.configurationService.getValue('workbench.settings.openDefaultKeybindings');
            // Create as needed and open in editor
            return this.createIfNotExists(editableKeybindings_1, emptyContents).then(function () {
                if (openDefaultKeybindings_1) {
                    var activeEditorGroup = _this.editorGroupService.activeGroup;
                    var sideEditorGroup = _this.editorGroupService.addGroup(activeEditorGroup.id, 3 /* RIGHT */);
                    return TPromise.join([
                        _this.editorService.openEditor({ resource: _this.defaultKeybindingsResource, options: { pinned: true, preserveFocus: true }, label: nls.localize('defaultKeybindings', "Default Keybindings"), description: '' }),
                        _this.editorService.openEditor({ resource: editableKeybindings_1, options: { pinned: true } }, sideEditorGroup.id)
                    ]).then(function (editors) { return void 0; });
                }
                else {
                    return _this.editorService.openEditor({ resource: editableKeybindings_1, options: { pinned: true } }).then(function () { return void 0; });
                }
            });
        }
        return this.editorService.openEditor(this.instantiationService.createInstance(KeybindingsEditorInput), { pinned: true }).then(function () { return null; });
    };
    PreferencesService.prototype.openDefaultKeybindingsFile = function () {
        return this.editorService.openEditor({ resource: this.defaultKeybindingsResource, label: nls.localize('defaultKeybindings', "Default Keybindings") });
    };
    PreferencesService.prototype.configureSettingsForLanguage = function (language) {
        var _this = this;
        this.openGlobalSettings()
            .then(function (editor) { return _this.createPreferencesEditorModel(_this.userSettingsResource)
            .then(function (settingsModel) {
            var codeEditor = getCodeEditor(editor.getControl());
            if (codeEditor) {
                _this.getPosition(language, settingsModel, codeEditor)
                    .then(function (position) {
                    if (codeEditor) {
                        codeEditor.setPosition(position);
                        codeEditor.focus();
                    }
                });
            }
        }); });
    };
    PreferencesService.prototype.openOrSwitchSettings = function (configurationTarget, resource, options, group) {
        if (group === void 0) { group = this.editorGroupService.activeGroup; }
        var editorInput = this.getActiveSettingsEditorInput(group);
        if (editorInput && editorInput.master.getResource().fsPath !== resource.fsPath) {
            return this.doSwitchSettings(configurationTarget, resource, editorInput, group, options);
        }
        return this.doOpenSettings(configurationTarget, resource, options, group);
    };
    PreferencesService.prototype.openOrSwitchSettings2 = function (configurationTarget, folderUri, options, group) {
        if (group === void 0) { group = this.editorGroupService.activeGroup; }
        return this.doOpenSettings2(configurationTarget, folderUri, options, group);
    };
    PreferencesService.prototype.doOpenSettings = function (configurationTarget, resource, options, group) {
        var _this = this;
        var openDefaultSettings = !!this.configurationService.getValue(DEFAULT_SETTINGS_EDITOR_SETTING);
        return this.getOrCreateEditableSettingsEditorInput(configurationTarget, resource)
            .then(function (editableSettingsEditorInput) {
            if (!options) {
                options = { pinned: true };
            }
            else {
                options = assign(options, { pinned: true });
            }
            if (openDefaultSettings) {
                var defaultPreferencesEditorInput = _this.instantiationService.createInstance(DefaultPreferencesEditorInput, _this.getDefaultSettingsResource(configurationTarget));
                var preferencesEditorInput = new PreferencesEditorInput(_this.getPreferencesEditorInputName(configurationTarget, resource), editableSettingsEditorInput.getDescription(), defaultPreferencesEditorInput, editableSettingsEditorInput);
                _this.lastOpenedSettingsInput = preferencesEditorInput;
                return _this.editorService.openEditor(preferencesEditorInput, SettingsEditorOptions.create(options), group);
            }
            return _this.editorService.openEditor(editableSettingsEditorInput, SettingsEditorOptions.create(options), group);
        });
    };
    PreferencesService.prototype.createSettings2EditorModel = function () {
        return this.instantiationService.createInstance(Settings2EditorModel, this.getDefaultSettings(1 /* USER */));
    };
    PreferencesService.prototype.doOpenSettings2 = function (target, folderUri, options, group) {
        var input = this.settingsEditor2Input;
        var settingsOptions = __assign({}, options, { target: target,
            folderUri: folderUri });
        return this.editorService.openEditor(input, SettingsEditorOptions.create(settingsOptions), group);
    };
    PreferencesService.prototype.doSwitchSettings = function (target, resource, input, group, options) {
        var _this = this;
        return this.getOrCreateEditableSettingsEditorInput(target, this.getEditableSettingsURI(target, resource))
            .then(function (toInput) {
            return group.openEditor(input).then(function () {
                var replaceWith = new PreferencesEditorInput(_this.getPreferencesEditorInputName(target, resource), toInput.getDescription(), _this.instantiationService.createInstance(DefaultPreferencesEditorInput, _this.getDefaultSettingsResource(target)), toInput);
                return group.replaceEditors([{
                        editor: input,
                        replacement: replaceWith,
                        options: SettingsEditorOptions.create(options)
                    }]).then(function () {
                    _this.lastOpenedSettingsInput = replaceWith;
                    return group.activeControl;
                });
            });
        });
    };
    PreferencesService.prototype.getActiveSettingsEditorInput = function (group) {
        if (group === void 0) { group = this.editorGroupService.activeGroup; }
        return group.editors.filter(function (e) { return e instanceof PreferencesEditorInput; })[0];
    };
    PreferencesService.prototype.getConfigurationTargetFromSettingsResource = function (resource) {
        if (this.userSettingsResource.toString() === resource.toString()) {
            return 1 /* USER */;
        }
        var workspaceSettingsResource = this.workspaceSettingsResource;
        if (workspaceSettingsResource && workspaceSettingsResource.toString() === resource.toString()) {
            return 2 /* WORKSPACE */;
        }
        var folder = this.contextService.getWorkspaceFolder(resource);
        if (folder) {
            return 3 /* WORKSPACE_FOLDER */;
        }
        return 1 /* USER */;
    };
    PreferencesService.prototype.getConfigurationTargetFromDefaultSettingsResource = function (uri) {
        return this.isDefaultWorkspaceSettingsResource(uri) ? 2 /* WORKSPACE */ : this.isDefaultFolderSettingsResource(uri) ? 3 /* WORKSPACE_FOLDER */ : 1 /* USER */;
    };
    PreferencesService.prototype.isDefaultSettingsResource = function (uri) {
        return this.isDefaultUserSettingsResource(uri) || this.isDefaultWorkspaceSettingsResource(uri) || this.isDefaultFolderSettingsResource(uri);
    };
    PreferencesService.prototype.isDefaultUserSettingsResource = function (uri) {
        return uri.authority === 'defaultsettings' && uri.scheme === network.Schemas.vscode && !!uri.path.match(/\/(\d+\/)?settings\.json$/);
    };
    PreferencesService.prototype.isDefaultWorkspaceSettingsResource = function (uri) {
        return uri.authority === 'defaultsettings' && uri.scheme === network.Schemas.vscode && !!uri.path.match(/\/(\d+\/)?workspaceSettings\.json$/);
    };
    PreferencesService.prototype.isDefaultFolderSettingsResource = function (uri) {
        return uri.authority === 'defaultsettings' && uri.scheme === network.Schemas.vscode && !!uri.path.match(/\/(\d+\/)?resourceSettings\.json$/);
    };
    PreferencesService.prototype.getDefaultSettingsResource = function (configurationTarget) {
        switch (configurationTarget) {
            case 2 /* WORKSPACE */:
                return URI.from({ scheme: network.Schemas.vscode, authority: 'defaultsettings', path: "/" + this._defaultWorkspaceSettingsUriCounter++ + "/workspaceSettings.json" });
            case 3 /* WORKSPACE_FOLDER */:
                return URI.from({ scheme: network.Schemas.vscode, authority: 'defaultsettings', path: "/" + this._defaultFolderSettingsUriCounter++ + "/resourceSettings.json" });
        }
        return URI.from({ scheme: network.Schemas.vscode, authority: 'defaultsettings', path: "/" + this._defaultUserSettingsUriCounter++ + "/settings.json" });
    };
    PreferencesService.prototype.getPreferencesEditorInputName = function (target, resource) {
        var name = getSettingsTargetName(target, resource, this.contextService);
        return target === 3 /* WORKSPACE_FOLDER */ ? nls.localize('folderSettingsName', "{0} (Folder Settings)", name) : name;
    };
    PreferencesService.prototype.getOrCreateEditableSettingsEditorInput = function (target, resource) {
        var _this = this;
        return this.createSettingsIfNotExists(target, resource)
            .then(function () { return _this.editorService.createInput({ resource: resource }); });
    };
    PreferencesService.prototype.createEditableSettingsEditorModel = function (configurationTarget, resource) {
        var _this = this;
        var settingsUri = this.getEditableSettingsURI(configurationTarget, resource);
        if (settingsUri) {
            var workspace = this.contextService.getWorkspace();
            if (workspace.configuration && workspace.configuration.toString() === settingsUri.toString()) {
                return this.textModelResolverService.createModelReference(settingsUri)
                    .then(function (reference) { return _this.instantiationService.createInstance(WorkspaceConfigurationEditorModel, reference, configurationTarget); });
            }
            return this.textModelResolverService.createModelReference(settingsUri)
                .then(function (reference) { return _this.instantiationService.createInstance(SettingsEditorModel, reference, configurationTarget); });
        }
        return TPromise.wrap(null);
    };
    PreferencesService.prototype.createDefaultSettingsEditorModel = function (defaultSettingsUri) {
        var _this = this;
        return this.textModelResolverService.createModelReference(defaultSettingsUri)
            .then(function (reference) {
            var target = _this.getConfigurationTargetFromDefaultSettingsResource(defaultSettingsUri);
            return _this.instantiationService.createInstance(DefaultSettingsEditorModel, defaultSettingsUri, reference, _this.getDefaultSettings(target));
        });
    };
    PreferencesService.prototype.getDefaultSettings = function (target) {
        if (target === 2 /* WORKSPACE */) {
            if (!this._defaultWorkspaceSettingsContentModel) {
                this._defaultWorkspaceSettingsContentModel = new DefaultSettings(this.getMostCommonlyUsedSettings(), target);
            }
            return this._defaultWorkspaceSettingsContentModel;
        }
        if (target === 3 /* WORKSPACE_FOLDER */) {
            if (!this._defaultFolderSettingsContentModel) {
                this._defaultFolderSettingsContentModel = new DefaultSettings(this.getMostCommonlyUsedSettings(), target);
            }
            return this._defaultFolderSettingsContentModel;
        }
        if (!this._defaultUserSettingsContentModel) {
            this._defaultUserSettingsContentModel = new DefaultSettings(this.getMostCommonlyUsedSettings(), target);
        }
        return this._defaultUserSettingsContentModel;
    };
    PreferencesService.prototype.getEditableSettingsURI = function (configurationTarget, resource) {
        switch (configurationTarget) {
            case 1 /* USER */:
                return URI.file(this.environmentService.appSettingsPath);
            case 2 /* WORKSPACE */:
                if (this.contextService.getWorkbenchState() === 1 /* EMPTY */) {
                    return null;
                }
                var workspace = this.contextService.getWorkspace();
                return workspace.configuration || workspace.folders[0].toResource(FOLDER_SETTINGS_PATH);
            case 3 /* WORKSPACE_FOLDER */:
                var folder = this.contextService.getWorkspaceFolder(resource);
                return folder ? folder.toResource(FOLDER_SETTINGS_PATH) : null;
        }
        return null;
    };
    PreferencesService.prototype.createSettingsIfNotExists = function (target, resource) {
        var _this = this;
        if (this.contextService.getWorkbenchState() === 3 /* WORKSPACE */ && target === 2 /* WORKSPACE */) {
            return this.fileService.resolveContent(this.contextService.getWorkspace().configuration)
                .then(function (content) {
                if (Object.keys(parse(content.value)).indexOf('settings') === -1) {
                    return _this.jsonEditingService.write(resource, { key: 'settings', value: {} }, true).then(null, function () { });
                }
                return null;
            });
        }
        return this.createIfNotExists(resource, emptyEditableSettingsContent).then(function () { });
    };
    PreferencesService.prototype.createIfNotExists = function (resource, contents) {
        var _this = this;
        return this.fileService.resolveContent(resource, { acceptTextOnly: true }).then(null, function (error) {
            if (error.fileOperationResult === 2 /* FILE_NOT_FOUND */) {
                return _this.fileService.updateContent(resource, contents).then(null, function (error) {
                    return TPromise.wrapError(new Error(nls.localize('fail.createSettings', "Unable to create '{0}' ({1}).", _this.labelService.getUriLabel(resource, { relative: true }), error)));
                });
            }
            return TPromise.wrapError(error);
        });
    };
    PreferencesService.prototype.getMostCommonlyUsedSettings = function () {
        return [
            'files.autoSave',
            'editor.fontSize',
            'editor.fontFamily',
            'editor.tabSize',
            'editor.renderWhitespace',
            'editor.cursorStyle',
            'editor.multiCursorModifier',
            'editor.insertSpaces',
            'editor.wordWrap',
            'files.exclude',
            'files.associations'
        ];
    };
    PreferencesService.prototype.getPosition = function (language, settingsModel, codeEditor) {
        var _this = this;
        var languageKey = "[" + language + "]";
        var setting = settingsModel.getPreference(languageKey);
        var model = codeEditor.getModel();
        var configuration = this.configurationService.getValue();
        var eol = configuration.files && configuration.files.eol;
        if (setting) {
            if (setting.overrides.length) {
                var lastSetting = setting.overrides[setting.overrides.length - 1];
                var content = void 0;
                if (lastSetting.valueRange.endLineNumber === setting.range.endLineNumber) {
                    content = ',' + eol + this.spaces(2, configuration.editor) + eol + this.spaces(1, configuration.editor);
                }
                else {
                    content = ',' + eol + this.spaces(2, configuration.editor);
                }
                var editOperation = EditOperation.insert(new Position(lastSetting.valueRange.endLineNumber, lastSetting.valueRange.endColumn), content);
                model.pushEditOperations([], [editOperation], function () { return []; });
                return TPromise.as({ lineNumber: lastSetting.valueRange.endLineNumber + 1, column: model.getLineMaxColumn(lastSetting.valueRange.endLineNumber + 1) });
            }
            return TPromise.as({ lineNumber: setting.valueRange.startLineNumber, column: setting.valueRange.startColumn + 1 });
        }
        return this.configurationService.updateValue(languageKey, {}, 1 /* USER */)
            .then(function () {
            setting = settingsModel.getPreference(languageKey);
            var content = eol + _this.spaces(2, configuration.editor) + eol + _this.spaces(1, configuration.editor);
            var editOperation = EditOperation.insert(new Position(setting.valueRange.endLineNumber, setting.valueRange.endColumn - 1), content);
            model.pushEditOperations([], [editOperation], function () { return []; });
            var lineNumber = setting.valueRange.endLineNumber + 1;
            settingsModel.dispose();
            return { lineNumber: lineNumber, column: model.getLineMaxColumn(lineNumber) };
        });
    };
    PreferencesService.prototype.spaces = function (count, _a) {
        var tabSize = _a.tabSize, insertSpaces = _a.insertSpaces;
        return insertSpaces ? strings.repeat(' ', tabSize * count) : strings.repeat('\t', count);
    };
    PreferencesService.prototype.dispose = function () {
        this._onDispose.fire();
        _super.prototype.dispose.call(this);
    };
    PreferencesService = __decorate([
        __param(0, IEditorService),
        __param(1, IEditorGroupsService),
        __param(2, IFileService),
        __param(3, IWorkspaceConfigurationService),
        __param(4, INotificationService),
        __param(5, IWorkspaceContextService),
        __param(6, IInstantiationService),
        __param(7, IEnvironmentService),
        __param(8, ITelemetryService),
        __param(9, ITextModelService),
        __param(10, IKeybindingService),
        __param(11, IModelService),
        __param(12, IJSONEditingService),
        __param(13, IModeService),
        __param(14, ILabelService)
    ], PreferencesService);
    return PreferencesService;
}(Disposable));
export { PreferencesService };
