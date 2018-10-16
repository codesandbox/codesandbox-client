/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { IModelService } from '../../../../editor/common/services/modelService';
import { IModeService } from '../../../../editor/common/services/modeService';
import { URI } from '../../../../base/common/uri';
import { TPromise } from '../../../../base/common/winjs.base';
import * as JSONContributionRegistry from '../../../../platform/jsonschemas/common/jsonContributionRegistry';
import { Registry } from '../../../../platform/registry/common/platform';
import { ITextModelService } from '../../../../editor/common/services/resolverService';
import { IPreferencesService, FOLDER_SETTINGS_PATH, DEFAULT_SETTINGS_EDITOR_SETTING } from '../../../services/preferences/common/preferences';
import { dispose } from '../../../../base/common/lifecycle';
import { IEditorService } from '../../../services/editor/common/editorService';
import { endsWith } from '../../../../base/common/strings';
import { IEnvironmentService } from '../../../../platform/environment/common/environment';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration';
import { isLinux } from '../../../../base/common/platform';
import { isEqual } from '../../../../base/common/resources';
var schemaRegistry = Registry.as(JSONContributionRegistry.Extensions.JSONContribution);
var PreferencesContribution = /** @class */ (function () {
    function PreferencesContribution(modelService, textModelResolverService, preferencesService, modeService, editorService, environmentService, workspaceService, configurationService) {
        var _this = this;
        this.modelService = modelService;
        this.textModelResolverService = textModelResolverService;
        this.preferencesService = preferencesService;
        this.modeService = modeService;
        this.editorService = editorService;
        this.environmentService = environmentService;
        this.workspaceService = workspaceService;
        this.configurationService = configurationService;
        this.settingsListener = this.configurationService.onDidChangeConfiguration(function (e) {
            if (e.affectsConfiguration(DEFAULT_SETTINGS_EDITOR_SETTING)) {
                _this.handleSettingsEditorOverride();
            }
        });
        this.handleSettingsEditorOverride();
        this.start();
    }
    PreferencesContribution.prototype.handleSettingsEditorOverride = function () {
        var _this = this;
        // dispose any old listener we had
        this.editorOpeningListener = dispose(this.editorOpeningListener);
        // install editor opening listener unless user has disabled this
        if (!!this.configurationService.getValue(DEFAULT_SETTINGS_EDITOR_SETTING)) {
            this.editorOpeningListener = this.editorService.overrideOpenEditor(function (editor, options, group) { return _this.onEditorOpening(editor, options, group); });
        }
    };
    PreferencesContribution.prototype.onEditorOpening = function (editor, options, group) {
        var resource = editor.getResource();
        if (!resource ||
            !endsWith(resource.path, 'settings.json') || // resource must end in settings.json
            !this.configurationService.getValue(DEFAULT_SETTINGS_EDITOR_SETTING) // user has not disabled default settings editor
        ) {
            return void 0;
        }
        // If the resource was already opened before in the group, do not prevent
        // the opening of that resource. Otherwise we would have the same settings
        // opened twice (https://github.com/Microsoft/vscode/issues/36447)
        if (group.isOpened(editor)) {
            return void 0;
        }
        // Global User Settings File
        if (isEqual(resource, URI.file(this.environmentService.appSettingsPath), !isLinux)) {
            return { override: this.preferencesService.openGlobalSettings(true, options, group) };
        }
        // Single Folder Workspace Settings File
        var state = this.workspaceService.getWorkbenchState();
        if (state === 2 /* FOLDER */) {
            var folders = this.workspaceService.getWorkspace().folders;
            if (isEqual(resource, folders[0].toResource(FOLDER_SETTINGS_PATH))) {
                return { override: this.preferencesService.openWorkspaceSettings(true, options, group) };
            }
        }
        // Multi Folder Workspace Settings File
        else if (state === 3 /* WORKSPACE */) {
            var folders = this.workspaceService.getWorkspace().folders;
            for (var i = 0; i < folders.length; i++) {
                if (isEqual(resource, folders[i].toResource(FOLDER_SETTINGS_PATH))) {
                    return { override: this.preferencesService.openFolderSettings(folders[i].uri, true, options, group) };
                }
            }
        }
        return void 0;
    };
    PreferencesContribution.prototype.start = function () {
        var _this = this;
        this.textModelResolverService.registerTextModelContentProvider('vscode', {
            provideTextContent: function (uri) {
                if (uri.scheme !== 'vscode') {
                    return null;
                }
                if (uri.authority === 'schemas') {
                    var schemaModel = _this.getSchemaModel(uri);
                    if (schemaModel) {
                        return TPromise.as(schemaModel);
                    }
                }
                return _this.preferencesService.resolveModel(uri);
            }
        });
    };
    PreferencesContribution.prototype.getSchemaModel = function (uri) {
        var schema = schemaRegistry.getSchemaContributions().schemas[uri.toString()];
        if (schema) {
            var modelContent = JSON.stringify(schema);
            var mode = this.modeService.getOrCreateMode('jsonc');
            var model_1 = this.modelService.createModel(modelContent, mode, uri);
            var disposables_1 = [];
            disposables_1.push(schemaRegistry.onDidChangeSchema(function (schemaUri) {
                if (schemaUri === uri.toString()) {
                    schema = schemaRegistry.getSchemaContributions().schemas[uri.toString()];
                    model_1.setValue(JSON.stringify(schema));
                }
            }));
            disposables_1.push(model_1.onWillDispose(function () { return dispose(disposables_1); }));
            return model_1;
        }
        return null;
    };
    PreferencesContribution.prototype.dispose = function () {
        this.editorOpeningListener = dispose(this.editorOpeningListener);
        this.settingsListener = dispose(this.settingsListener);
    };
    PreferencesContribution = __decorate([
        __param(0, IModelService),
        __param(1, ITextModelService),
        __param(2, IPreferencesService),
        __param(3, IModeService),
        __param(4, IEditorService),
        __param(5, IEnvironmentService),
        __param(6, IWorkspaceContextService),
        __param(7, IConfigurationService)
    ], PreferencesContribution);
    return PreferencesContribution;
}());
export { PreferencesContribution };
