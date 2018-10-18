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
import * as nls from '../../../../nls';
import * as objects from '../../../../base/common/objects';
import * as types from '../../../../base/common/types';
import { CodeEditorWidget } from '../../../../editor/browser/widget/codeEditorWidget';
import { BaseEditor } from './baseEditor';
import { IStorageService } from '../../../../platform/storage/common/storage';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry';
import { IThemeService } from '../../../../platform/theme/common/themeService';
import { ITextFileService } from '../../../services/textfile/common/textfiles';
import { ITextResourceConfigurationService } from '../../../../editor/common/services/resourceConfiguration';
import { isDiffEditor, isCodeEditor, getCodeEditor } from '../../../../editor/browser/editorBrowser';
import { IEditorGroupsService } from '../../../services/group/common/editorGroupsService';
import { IEditorService } from '../../../services/editor/common/editorService';
import { IWindowService } from '../../../../platform/windows/common/windows';
var TEXT_EDITOR_VIEW_STATE_PREFERENCE_KEY = 'textEditorViewState';
/**
 * The base class of editors that leverage the text editor for the editing experience. This class is only intended to
 * be subclassed and not instantiated.
 */
var BaseTextEditor = /** @class */ (function (_super) {
    __extends(BaseTextEditor, _super);
    function BaseTextEditor(id, telemetryService, _instantiationService, storageService, _configurationService, themeService, _textFileService, editorService, editorGroupService, windowService) {
        var _this = _super.call(this, id, telemetryService, themeService) || this;
        _this._instantiationService = _instantiationService;
        _this._configurationService = _configurationService;
        _this.themeService = themeService;
        _this._textFileService = _textFileService;
        _this.editorService = editorService;
        _this.editorGroupService = editorGroupService;
        _this.windowService = windowService;
        _this.editorMemento = _this.getEditorMemento(storageService, editorGroupService, TEXT_EDITOR_VIEW_STATE_PREFERENCE_KEY, 100);
        _this._register(_this.configurationService.onDidChangeConfiguration(function (e) { return _this.handleConfigurationChangeEvent(_this.configurationService.getValue(_this.getResource())); }));
        return _this;
    }
    Object.defineProperty(BaseTextEditor.prototype, "instantiationService", {
        get: function () {
            return this._instantiationService;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseTextEditor.prototype, "configurationService", {
        get: function () {
            return this._configurationService;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseTextEditor.prototype, "textFileService", {
        get: function () {
            return this._textFileService;
        },
        enumerable: true,
        configurable: true
    });
    BaseTextEditor.prototype.handleConfigurationChangeEvent = function (configuration) {
        if (this.isVisible()) {
            this.updateEditorConfiguration(configuration);
        }
        else {
            this.hasPendingConfigurationChange = true;
        }
    };
    BaseTextEditor.prototype.consumePendingConfigurationChangeEvent = function () {
        if (this.hasPendingConfigurationChange) {
            this.updateEditorConfiguration();
            this.hasPendingConfigurationChange = false;
        }
    };
    BaseTextEditor.prototype.computeConfiguration = function (configuration) {
        // Specific editor options always overwrite user configuration
        var editorConfiguration = types.isObject(configuration.editor) ? objects.deepClone(configuration.editor) : Object.create(null);
        objects.assign(editorConfiguration, this.getConfigurationOverrides());
        // ARIA label
        editorConfiguration.ariaLabel = this.computeAriaLabel();
        return editorConfiguration;
    };
    BaseTextEditor.prototype.computeAriaLabel = function () {
        var ariaLabel = this.getAriaLabel();
        // Apply group information to help identify in which group we are
        if (ariaLabel) {
            if (this.group) {
                ariaLabel = nls.localize('editorLabelWithGroup', "{0}, {1}.", ariaLabel, this.group.label);
            }
        }
        return ariaLabel;
    };
    BaseTextEditor.prototype.getConfigurationOverrides = function () {
        var overrides = {};
        objects.assign(overrides, {
            overviewRulerLanes: 3,
            lineNumbersMinChars: 3,
            fixedOverflowWidgets: true
        });
        return overrides;
    };
    BaseTextEditor.prototype.createEditor = function (parent) {
        var _this = this;
        // Editor for Text
        this._editorContainer = parent;
        this.editorControl = this._register(this.createEditorControl(parent, this.computeConfiguration(this.configurationService.getValue(this.getResource()))));
        // Model & Language changes
        var codeEditor = getCodeEditor(this.editorControl);
        if (codeEditor) {
            this._register(codeEditor.onDidChangeModelLanguage(function (e) { return _this.updateEditorConfiguration(); }));
            this._register(codeEditor.onDidChangeModel(function (e) { return _this.updateEditorConfiguration(); }));
        }
        // Application & Editor focus change to respect auto save settings
        if (isCodeEditor(this.editorControl)) {
            this._register(this.editorControl.onDidBlurEditorWidget(function () { return _this.onEditorFocusLost(); }));
        }
        else if (isDiffEditor(this.editorControl)) {
            this._register(this.editorControl.getOriginalEditor().onDidBlurEditorWidget(function () { return _this.onEditorFocusLost(); }));
            this._register(this.editorControl.getModifiedEditor().onDidBlurEditorWidget(function () { return _this.onEditorFocusLost(); }));
        }
        this._register(this.editorService.onDidActiveEditorChange(function () { return _this.onEditorFocusLost(); }));
        this._register(this.windowService.onDidChangeFocus(function (focused) { return _this.onWindowFocusChange(focused); }));
    };
    BaseTextEditor.prototype.onEditorFocusLost = function () {
        this.maybeTriggerSaveAll(3 /* FOCUS_CHANGE */);
    };
    BaseTextEditor.prototype.onWindowFocusChange = function (focused) {
        if (!focused) {
            this.maybeTriggerSaveAll(4 /* WINDOW_CHANGE */);
        }
    };
    BaseTextEditor.prototype.maybeTriggerSaveAll = function (reason) {
        var mode = this.textFileService.getAutoSaveMode();
        // Determine if we need to save all. In case of a window focus change we also save if auto save mode
        // is configured to be ON_FOCUS_CHANGE (editor focus change)
        if ((reason === 4 /* WINDOW_CHANGE */ && (mode === 3 /* ON_FOCUS_CHANGE */ || mode === 4 /* ON_WINDOW_CHANGE */)) ||
            (reason === 3 /* FOCUS_CHANGE */ && mode === 3 /* ON_FOCUS_CHANGE */)) {
            if (this.textFileService.isDirty()) {
                this.textFileService.saveAll(void 0, { reason: reason });
            }
        }
    };
    /**
     * This method creates and returns the text editor control to be used. Subclasses can override to
     * provide their own editor control that should be used (e.g. a DiffEditor).
     *
     * The passed in configuration object should be passed to the editor control when creating it.
     */
    BaseTextEditor.prototype.createEditorControl = function (parent, configuration) {
        // Use a getter for the instantiation service since some subclasses might use scoped instantiation services
        return this.instantiationService.createInstance(CodeEditorWidget, parent, configuration, {});
    };
    BaseTextEditor.prototype.setInput = function (input, options, token) {
        var _this = this;
        return _super.prototype.setInput.call(this, input, options, token).then(function () {
            // Update editor options after having set the input. We do this because there can be
            // editor input specific options (e.g. an ARIA label depending on the input showing)
            _this.updateEditorConfiguration();
            _this._editorContainer.setAttribute('aria-label', _this.computeAriaLabel());
        });
    };
    BaseTextEditor.prototype.setEditorVisible = function (visible, group) {
        // Pass on to Editor
        if (visible) {
            this.consumePendingConfigurationChangeEvent();
            this.editorControl.onVisible();
        }
        else {
            this.editorControl.onHide();
        }
        _super.prototype.setEditorVisible.call(this, visible, group);
    };
    BaseTextEditor.prototype.focus = function () {
        this.editorControl.focus();
    };
    BaseTextEditor.prototype.layout = function (dimension) {
        // Pass on to Editor
        this.editorControl.layout(dimension);
    };
    BaseTextEditor.prototype.getControl = function () {
        return this.editorControl;
    };
    /**
     * Saves the text editor view state for the given resource.
     */
    BaseTextEditor.prototype.saveTextEditorViewState = function (resource) {
        var editorViewState = this.retrieveTextEditorViewState(resource);
        if (!editorViewState) {
            return;
        }
        this.editorMemento.saveState(this.group, resource, editorViewState);
    };
    BaseTextEditor.prototype.retrieveTextEditorViewState = function (resource) {
        var control = this.getControl();
        var model = control.getModel();
        if (!model) {
            return null; // view state always needs a model
        }
        var modelUri = model.uri;
        if (!modelUri) {
            return null; // model URI is needed to make sure we save the view state correctly
        }
        if (modelUri.toString() !== resource.toString()) {
            return null; // prevent saving view state for a model that is not the expected one
        }
        return control.saveViewState();
    };
    /**
     * Clears the text editor view state for the given resources.
     */
    BaseTextEditor.prototype.clearTextEditorViewState = function (resources, group) {
        var _this = this;
        resources.forEach(function (resource) {
            _this.editorMemento.clearState(resource, group);
        });
    };
    /**
     * Loads the text editor view state for the given resource and returns it.
     */
    BaseTextEditor.prototype.loadTextEditorViewState = function (resource) {
        return this.editorMemento.loadState(this.group, resource);
    };
    BaseTextEditor.prototype.updateEditorConfiguration = function (configuration) {
        if (configuration === void 0) { configuration = this.configurationService.getValue(this.getResource()); }
        if (!this.editorControl) {
            return;
        }
        var editorConfiguration = this.computeConfiguration(configuration);
        // Try to figure out the actual editor options that changed from the last time we updated the editor.
        // We do this so that we are not overwriting some dynamic editor settings (e.g. word wrap) that might
        // have been applied to the editor directly.
        var editorSettingsToApply = editorConfiguration;
        if (this.lastAppliedEditorOptions) {
            editorSettingsToApply = objects.distinct(this.lastAppliedEditorOptions, editorSettingsToApply);
        }
        if (Object.keys(editorSettingsToApply).length > 0) {
            this.lastAppliedEditorOptions = editorConfiguration;
            this.editorControl.updateOptions(editorSettingsToApply);
        }
    };
    BaseTextEditor.prototype.getResource = function () {
        var codeEditor = getCodeEditor(this.editorControl);
        if (codeEditor) {
            var model = codeEditor.getModel();
            if (model) {
                return model.uri;
            }
        }
        if (this.input) {
            return this.input.getResource();
        }
        return null;
    };
    BaseTextEditor.prototype.dispose = function () {
        this.lastAppliedEditorOptions = void 0;
        _super.prototype.dispose.call(this);
    };
    BaseTextEditor = __decorate([
        __param(1, ITelemetryService),
        __param(2, IInstantiationService),
        __param(3, IStorageService),
        __param(4, ITextResourceConfigurationService),
        __param(5, IThemeService),
        __param(6, ITextFileService),
        __param(7, IEditorService),
        __param(8, IEditorGroupsService),
        __param(9, IWindowService)
    ], BaseTextEditor);
    return BaseTextEditor;
}(BaseEditor));
export { BaseTextEditor };
