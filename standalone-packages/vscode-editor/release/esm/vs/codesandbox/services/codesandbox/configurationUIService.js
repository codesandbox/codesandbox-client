var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { DEFAULT_SETTINGS_EDITOR_SETTING } from "../../../workbench/services/preferences/common/preferences.js";
import { IEditorService } from "../../../workbench/services/editor/common/editorService.js";
import { IConfigurationService } from "../../../platform/configuration/common/configuration.js";
import { dispose } from "../../../base/common/lifecycle.js";
import { ReactEditorInput } from "./inputs/ReactEditorInput.js";
import { IInstantiationService } from "../../../platform/instantiation/common/instantiation.js";
var CodeSandboxConfigurationUIService = /** @class */ (function () {
    function CodeSandboxConfigurationUIService(customEditorAPI, editorService, configurationService, instantiationService) {
        this.customEditorAPI = customEditorAPI;
        this.editorService = editorService;
        this.configurationService = configurationService;
        this.instantiationService = instantiationService;
        this.handleSettingsEditorOverride();
    }
    CodeSandboxConfigurationUIService.prototype.handleSettingsEditorOverride = function () {
        var _this = this;
        // dispose any old listener we had
        this.editorOpeningListener = dispose(this.editorOpeningListener);
        // install editor opening listener unless user has disabled this
        if (!!this.configurationService.getValue(DEFAULT_SETTINGS_EDITOR_SETTING)) {
            this.editorOpeningListener = this.editorService.overrideOpenEditor(function (editor, options, group) { return _this.onEditorOpening(editor, options, group); });
        }
    };
    CodeSandboxConfigurationUIService.prototype.openReactEditor = function (resource, Editor) {
        return this.editorService.openEditor(this.instantiationService.createInstance(ReactEditorInput, resource, Editor));
    };
    CodeSandboxConfigurationUIService.prototype.onEditorOpening = function (editor, options, group) {
        var resource = editor.getResource();
        if (resource === null) {
            return void 0;
        }
        if (editor instanceof ReactEditorInput) {
            return void 0;
        }
        var normalizedPath = resource.fsPath.replace(/^\/sandbox/, '');
        var Editor = this.customEditorAPI.getCustomEditor(normalizedPath);
        if (Editor) {
            return { override: this.openReactEditor(resource, Editor) };
        }
        return void 0;
    };
    CodeSandboxConfigurationUIService = __decorate([
        __param(1, IEditorService),
        __param(2, IConfigurationService),
        __param(3, IInstantiationService)
    ], CodeSandboxConfigurationUIService);
    return CodeSandboxConfigurationUIService;
}());
export { CodeSandboxConfigurationUIService };
