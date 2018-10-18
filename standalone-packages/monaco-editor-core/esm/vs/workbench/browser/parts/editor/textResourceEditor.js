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
import * as types from '../../../../base/common/types';
import { ResourceEditorInput } from '../../../common/editor/resourceEditorInput';
import { BaseTextEditorModel } from '../../../common/editor/textEditorModel';
import { UntitledEditorInput } from '../../../common/editor/untitledEditorInput';
import { BaseTextEditor } from './textEditor';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry';
import { IStorageService } from '../../../../platform/storage/common/storage';
import { ITextResourceConfigurationService } from '../../../../editor/common/services/resourceConfiguration';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation';
import { IThemeService } from '../../../../platform/theme/common/themeService';
import { ITextFileService } from '../../../services/textfile/common/textfiles';
import { once } from '../../../../base/common/event';
import { IEditorGroupsService } from '../../../services/group/common/editorGroupsService';
import { IEditorService } from '../../../services/editor/common/editorService';
import { IWindowService } from '../../../../platform/windows/common/windows';
/**
 * An editor implementation that is capable of showing the contents of resource inputs. Uses
 * the TextEditor widget to show the contents.
 */
var AbstractTextResourceEditor = /** @class */ (function (_super) {
    __extends(AbstractTextResourceEditor, _super);
    function AbstractTextResourceEditor(id, telemetryService, instantiationService, storageService, configurationService, themeService, editorGroupService, textFileService, editorService, windowService) {
        return _super.call(this, id, telemetryService, instantiationService, storageService, configurationService, themeService, textFileService, editorService, editorGroupService, windowService) || this;
    }
    AbstractTextResourceEditor.prototype.getTitle = function () {
        if (this.input) {
            return this.input.getName();
        }
        return nls.localize('textEditor', "Text Editor");
    };
    AbstractTextResourceEditor.prototype.setInput = function (input, options, token) {
        var _this = this;
        // Remember view settings if input changes
        this.saveTextResourceEditorViewState(this.input);
        // Set input and resolve
        return _super.prototype.setInput.call(this, input, options, token).then(function () {
            return input.resolve().then(function (resolvedModel) {
                // Check for cancellation
                if (token.isCancellationRequested) {
                    return void 0;
                }
                // Assert Model instance
                if (!(resolvedModel instanceof BaseTextEditorModel)) {
                    return TPromise.wrapError(new Error('Unable to open file as text'));
                }
                // Set Editor Model
                var textEditor = _this.getControl();
                var textEditorModel = resolvedModel.textEditorModel;
                textEditor.setModel(textEditorModel);
                // Apply Options from TextOptions
                var optionsGotApplied = false;
                var textOptions = options;
                if (textOptions && types.isFunction(textOptions.apply)) {
                    optionsGotApplied = textOptions.apply(textEditor, 1 /* Immediate */);
                }
                // Otherwise restore View State
                if (!optionsGotApplied) {
                    _this.restoreTextResourceEditorViewState(input);
                }
                return void 0;
            });
        });
    };
    AbstractTextResourceEditor.prototype.restoreTextResourceEditorViewState = function (input) {
        if (input instanceof UntitledEditorInput || input instanceof ResourceEditorInput) {
            var viewState = this.loadTextEditorViewState(input.getResource());
            if (viewState) {
                this.getControl().restoreViewState(viewState);
            }
        }
    };
    AbstractTextResourceEditor.prototype.setOptions = function (options) {
        var textOptions = options;
        if (textOptions && types.isFunction(textOptions.apply)) {
            textOptions.apply(this.getControl(), 0 /* Smooth */);
        }
    };
    AbstractTextResourceEditor.prototype.getConfigurationOverrides = function () {
        var options = _super.prototype.getConfigurationOverrides.call(this);
        options.readOnly = !(this.input instanceof UntitledEditorInput); // all resource editors are readonly except for the untitled one;
        return options;
    };
    AbstractTextResourceEditor.prototype.getAriaLabel = function () {
        var input = this.input;
        var isReadonly = !(this.input instanceof UntitledEditorInput);
        var ariaLabel;
        var inputName = input && input.getName();
        if (isReadonly) {
            ariaLabel = inputName ? nls.localize('readonlyEditorWithInputAriaLabel', "{0}. Readonly text editor.", inputName) : nls.localize('readonlyEditorAriaLabel', "Readonly text editor.");
        }
        else {
            ariaLabel = inputName ? nls.localize('untitledFileEditorWithInputAriaLabel', "{0}. Untitled file text editor.", inputName) : nls.localize('untitledFileEditorAriaLabel', "Untitled file text editor.");
        }
        return ariaLabel;
    };
    /**
     * Reveals the last line of this editor if it has a model set.
     * When smart is true only scroll if the cursor is currently on the last line of the output panel.
     * This allows users to click on the output panel to stop scrolling when they see something of interest.
     * To resume, they should scroll to the end of the output panel again.
     */
    AbstractTextResourceEditor.prototype.revealLastLine = function (smart) {
        var codeEditor = this.getControl();
        var model = codeEditor.getModel();
        if (model) {
            var lastLine = model.getLineCount();
            if (!smart || codeEditor.getPosition().lineNumber === lastLine) {
                codeEditor.revealPosition({ lineNumber: lastLine, column: model.getLineMaxColumn(lastLine) }, 0 /* Smooth */);
            }
        }
    };
    AbstractTextResourceEditor.prototype.clearInput = function () {
        // Keep editor view state in settings to restore when coming back
        this.saveTextResourceEditorViewState(this.input);
        // Clear Model
        this.getControl().setModel(null);
        _super.prototype.clearInput.call(this);
    };
    AbstractTextResourceEditor.prototype.shutdown = function () {
        // Save View State (only for untitled)
        if (this.input instanceof UntitledEditorInput) {
            this.saveTextResourceEditorViewState(this.input);
        }
        // Call Super
        _super.prototype.shutdown.call(this);
    };
    AbstractTextResourceEditor.prototype.saveTextResourceEditorViewState = function (input) {
        var _this = this;
        if (!(input instanceof UntitledEditorInput) && !(input instanceof ResourceEditorInput)) {
            return; // only enabled for untitled and resource inputs
        }
        var resource = input.getResource();
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
    AbstractTextResourceEditor = __decorate([
        __param(1, ITelemetryService),
        __param(2, IInstantiationService),
        __param(3, IStorageService),
        __param(4, ITextResourceConfigurationService),
        __param(5, IThemeService),
        __param(6, IEditorGroupsService),
        __param(7, ITextFileService),
        __param(8, IEditorService),
        __param(9, IWindowService)
    ], AbstractTextResourceEditor);
    return AbstractTextResourceEditor;
}(BaseTextEditor));
export { AbstractTextResourceEditor };
var TextResourceEditor = /** @class */ (function (_super) {
    __extends(TextResourceEditor, _super);
    function TextResourceEditor(telemetryService, instantiationService, storageService, configurationService, themeService, textFileService, editorService, editorGroupService, windowService) {
        return _super.call(this, TextResourceEditor.ID, telemetryService, instantiationService, storageService, configurationService, themeService, editorGroupService, textFileService, editorService, windowService) || this;
    }
    TextResourceEditor.ID = 'workbench.editors.textResourceEditor';
    TextResourceEditor = __decorate([
        __param(0, ITelemetryService),
        __param(1, IInstantiationService),
        __param(2, IStorageService),
        __param(3, ITextResourceConfigurationService),
        __param(4, IThemeService),
        __param(5, ITextFileService),
        __param(6, IEditorService),
        __param(7, IEditorGroupsService),
        __param(8, IWindowService)
    ], TextResourceEditor);
    return TextResourceEditor;
}(AbstractTextResourceEditor));
export { TextResourceEditor };
