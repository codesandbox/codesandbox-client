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
import { TPromise } from '../../../../base/common/winjs.base';
import * as nls from '../../../../nls';
import * as objects from '../../../../base/common/objects';
import * as types from '../../../../base/common/types';
import { BaseTextEditor } from './textEditor';
import { TEXT_DIFF_EDITOR_ID, Extensions as EditorInputExtensions } from '../../../common/editor';
import { ResourceEditorInput } from '../../../common/editor/resourceEditorInput';
import { DiffEditorInput } from '../../../common/editor/diffEditorInput';
import { DiffNavigator } from '../../../../editor/browser/widget/diffNavigator';
import { DiffEditorWidget } from '../../../../editor/browser/widget/diffEditorWidget';
import { TextDiffEditorModel } from '../../../common/editor/textDiffEditorModel';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry';
import { IStorageService } from '../../../../platform/storage/common/storage';
import { ITextResourceConfigurationService } from '../../../../editor/common/services/resourceConfiguration';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation';
import { IThemeService } from '../../../../platform/theme/common/themeService';
import { ITextFileService } from '../../../services/textfile/common/textfiles';
import { dispose } from '../../../../base/common/lifecycle';
import { Registry } from '../../../../platform/registry/common/platform';
import { URI } from '../../../../base/common/uri';
import { once } from '../../../../base/common/event';
import { IEditorGroupsService } from '../../../services/group/common/editorGroupsService';
import { IEditorService } from '../../../services/editor/common/editorService';
import { EditorMemento } from './baseEditor';
import { IWindowService } from '../../../../platform/windows/common/windows';
/**
 * The text editor that leverages the diff text editor for the editing experience.
 */
var TextDiffEditor = /** @class */ (function (_super) {
    __extends(TextDiffEditor, _super);
    function TextDiffEditor(telemetryService, instantiationService, storageService, configurationService, editorService, themeService, editorGroupService, textFileService, windowService) {
        var _this = _super.call(this, TextDiffEditor.ID, telemetryService, instantiationService, storageService, configurationService, themeService, textFileService, editorService, editorGroupService, windowService) || this;
        _this.diffNavigatorDisposables = [];
        return _this;
    }
    TextDiffEditor.prototype.getEditorMemento = function (storageService, editorGroupService, key, limit) {
        if (limit === void 0) { limit = 10; }
        return new EditorMemento(this.getId(), key, Object.create(null), limit, editorGroupService); // do not persist in storage as diff editors are never persisted
    };
    TextDiffEditor.prototype.getTitle = function () {
        if (this.input) {
            return this.input.getName();
        }
        return nls.localize('textDiffEditor', "Text Diff Editor");
    };
    TextDiffEditor.prototype.createEditorControl = function (parent, configuration) {
        return this.instantiationService.createInstance(DiffEditorWidget, parent, configuration);
    };
    TextDiffEditor.prototype.setInput = function (input, options, token) {
        var _this = this;
        // Dispose previous diff navigator
        this.diffNavigatorDisposables = dispose(this.diffNavigatorDisposables);
        // Remember view settings if input changes
        this.saveTextDiffEditorViewState(this.input);
        // Set input and resolve
        return _super.prototype.setInput.call(this, input, options, token).then(function () {
            return input.resolve().then(function (resolvedModel) {
                // Check for cancellation
                if (token.isCancellationRequested) {
                    return void 0;
                }
                // Assert Model Instance
                if (!(resolvedModel instanceof TextDiffEditorModel) && _this.openAsBinary(input, options)) {
                    return void 0;
                }
                // Set Editor Model
                var diffEditor = _this.getControl();
                var resolvedDiffEditorModel = resolvedModel;
                diffEditor.setModel(resolvedDiffEditorModel.textDiffEditorModel);
                // Apply Options from TextOptions
                var optionsGotApplied = false;
                if (options && types.isFunction(options.apply)) {
                    optionsGotApplied = options.apply(diffEditor, 1 /* Immediate */);
                }
                // Otherwise restore View State
                var hasPreviousViewState = false;
                if (!optionsGotApplied) {
                    hasPreviousViewState = _this.restoreTextDiffEditorViewState(input);
                }
                // Diff navigator
                _this.diffNavigator = new DiffNavigator(diffEditor, {
                    alwaysRevealFirst: !optionsGotApplied && !hasPreviousViewState // only reveal first change if we had no options or viewstate
                });
                _this.diffNavigatorDisposables.push(_this.diffNavigator);
                // Readonly flag
                diffEditor.updateOptions({ readOnly: resolvedDiffEditorModel.isReadonly() });
            }, function (error) {
                // In case we tried to open a file and the response indicates that this is not a text file, fallback to binary diff.
                if (_this.isFileBinaryError(error) && _this.openAsBinary(input, options)) {
                    return null;
                }
                // Otherwise make sure the error bubbles up
                return TPromise.wrapError(error);
            });
        });
    };
    TextDiffEditor.prototype.setOptions = function (options) {
        var textOptions = options;
        if (textOptions && types.isFunction(textOptions.apply)) {
            textOptions.apply(this.getControl(), 0 /* Smooth */);
        }
    };
    TextDiffEditor.prototype.restoreTextDiffEditorViewState = function (input) {
        if (input instanceof DiffEditorInput) {
            var resource = this.toDiffEditorViewStateResource(input);
            if (resource) {
                var viewState = this.loadTextEditorViewState(resource);
                if (viewState) {
                    this.getControl().restoreViewState(viewState);
                    return true;
                }
            }
        }
        return false;
    };
    TextDiffEditor.prototype.openAsBinary = function (input, options) {
        if (input instanceof DiffEditorInput) {
            var originalInput = input.originalInput;
            var modifiedInput = input.modifiedInput;
            var binaryDiffInput = new DiffEditorInput(input.getName(), input.getDescription(), originalInput, modifiedInput, true);
            // Forward binary flag to input if supported
            var fileInputFactory = Registry.as(EditorInputExtensions.EditorInputFactories).getFileInputFactory();
            if (fileInputFactory.isFileInput(originalInput)) {
                originalInput.setForceOpenAsBinary();
            }
            if (fileInputFactory.isFileInput(modifiedInput)) {
                modifiedInput.setForceOpenAsBinary();
            }
            this.editorService.openEditor(binaryDiffInput, options, this.group);
            return true;
        }
        return false;
    };
    TextDiffEditor.prototype.computeConfiguration = function (configuration) {
        var editorConfiguration = _super.prototype.computeConfiguration.call(this, configuration);
        // Handle diff editor specially by merging in diffEditor configuration
        if (types.isObject(configuration.diffEditor)) {
            objects.mixin(editorConfiguration, configuration.diffEditor);
        }
        return editorConfiguration;
    };
    TextDiffEditor.prototype.getConfigurationOverrides = function () {
        var options = _super.prototype.getConfigurationOverrides.call(this);
        options.readOnly = this.isReadOnly();
        options.lineDecorationsWidth = '2ch';
        return options;
    };
    TextDiffEditor.prototype.getAriaLabel = function () {
        var ariaLabel;
        var inputName = this.input && this.input.getName();
        if (this.isReadOnly()) {
            ariaLabel = inputName ? nls.localize('readonlyEditorWithInputAriaLabel', "{0}. Readonly text compare editor.", inputName) : nls.localize('readonlyEditorAriaLabel', "Readonly text compare editor.");
        }
        else {
            ariaLabel = inputName ? nls.localize('editableEditorWithInputAriaLabel', "{0}. Text file compare editor.", inputName) : nls.localize('editableEditorAriaLabel', "Text file compare editor.");
        }
        return ariaLabel;
    };
    TextDiffEditor.prototype.isReadOnly = function () {
        var input = this.input;
        if (input instanceof DiffEditorInput) {
            var modifiedInput = input.modifiedInput;
            return modifiedInput instanceof ResourceEditorInput;
        }
        return false;
    };
    TextDiffEditor.prototype.isFileBinaryError = function (error) {
        var _this = this;
        if (types.isArray(error)) {
            var errors = error;
            return errors.some(function (e) { return _this.isFileBinaryError(e); });
        }
        return error.fileOperationResult === 0 /* FILE_IS_BINARY */;
    };
    TextDiffEditor.prototype.clearInput = function () {
        // Dispose previous diff navigator
        this.diffNavigatorDisposables = dispose(this.diffNavigatorDisposables);
        // Keep editor view state in settings to restore when coming back
        this.saveTextDiffEditorViewState(this.input);
        // Clear Model
        this.getControl().setModel(null);
        // Pass to super
        _super.prototype.clearInput.call(this);
    };
    TextDiffEditor.prototype.getDiffNavigator = function () {
        return this.diffNavigator;
    };
    TextDiffEditor.prototype.getControl = function () {
        return _super.prototype.getControl.call(this);
    };
    TextDiffEditor.prototype.loadTextEditorViewState = function (resource) {
        return _super.prototype.loadTextEditorViewState.call(this, resource); // overridden for text diff editor support
    };
    TextDiffEditor.prototype.saveTextDiffEditorViewState = function (input) {
        var _this = this;
        if (!(input instanceof DiffEditorInput)) {
            return; // only supported for diff editor inputs
        }
        var resource = this.toDiffEditorViewStateResource(input);
        if (!resource) {
            return; // unable to retrieve input resource
        }
        // Clear view state if input is disposed
        if (input.isDisposed()) {
            _super.prototype.clearTextEditorViewState.call(this, [resource]);
        }
        // Otherwise save it
        else {
            _super.prototype.saveTextEditorViewState.call(this, resource);
            // Make sure to clean up when the input gets disposed
            once(input.onDispose)(function () {
                _super.prototype.clearTextEditorViewState.call(_this, [resource]);
            });
        }
    };
    TextDiffEditor.prototype.retrieveTextEditorViewState = function (resource) {
        return this.retrieveTextDiffEditorViewState(resource); // overridden for text diff editor support
    };
    TextDiffEditor.prototype.retrieveTextDiffEditorViewState = function (resource) {
        var control = this.getControl();
        var model = control.getModel();
        if (!model || !model.modified || !model.original) {
            return null; // view state always needs a model
        }
        var modelUri = this.toDiffEditorViewStateResource(model);
        if (!modelUri) {
            return null; // model URI is needed to make sure we save the view state correctly
        }
        if (modelUri.toString() !== resource.toString()) {
            return null; // prevent saving view state for a model that is not the expected one
        }
        return control.saveViewState();
    };
    TextDiffEditor.prototype.toDiffEditorViewStateResource = function (modelOrInput) {
        var original;
        var modified;
        if (modelOrInput instanceof DiffEditorInput) {
            original = modelOrInput.originalInput.getResource();
            modified = modelOrInput.modifiedInput.getResource();
        }
        else {
            original = modelOrInput.original.uri;
            modified = modelOrInput.modified.uri;
        }
        if (!original || !modified) {
            return null;
        }
        // create a URI that is the Base64 concatenation of original + modified resource
        return URI.from({ scheme: 'diff', path: "" + btoa(original.toString()) + btoa(modified.toString()) });
    };
    TextDiffEditor.prototype.dispose = function () {
        this.diffNavigatorDisposables = dispose(this.diffNavigatorDisposables);
        _super.prototype.dispose.call(this);
    };
    TextDiffEditor.ID = TEXT_DIFF_EDITOR_ID;
    TextDiffEditor = __decorate([
        __param(0, ITelemetryService),
        __param(1, IInstantiationService),
        __param(2, IStorageService),
        __param(3, ITextResourceConfigurationService),
        __param(4, IEditorService),
        __param(5, IThemeService),
        __param(6, IEditorGroupsService),
        __param(7, ITextFileService),
        __param(8, IWindowService)
    ], TextDiffEditor);
    return TextDiffEditor;
}(BaseTextEditor));
export { TextDiffEditor };
