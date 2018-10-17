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
import * as nls from '../../../../../nls.js';
import * as errors from '../../../../../base/common/errors.js';
import { toErrorMessage } from '../../../../../base/common/errorMessage.js';
import * as types from '../../../../../base/common/types.js';
import * as paths from '../../../../../base/common/paths.js';
import { Action } from '../../../../../base/common/actions.js';
import { VIEWLET_ID, TEXT_FILE_EDITOR_ID } from '../../common/files.js';
import { ITextFileService } from '../../../../services/textfile/common/textfiles.js';
import { BaseTextEditor } from '../../../../browser/parts/editor/textEditor.js';
import { BinaryEditorModel } from '../../../../common/editor/binaryEditorModel.js';
import { IViewletService } from '../../../../services/viewlet/browser/viewlet.js';
import { IFileService, FALLBACK_MAX_MEMORY_SIZE_MB, MIN_MAX_MEMORY_SIZE_MB } from '../../../../../platform/files/common/files.js';
import { ITelemetryService } from '../../../../../platform/telemetry/common/telemetry.js';
import { IWorkspaceContextService } from '../../../../../platform/workspace/common/workspace.js';
import { IStorageService } from '../../../../../platform/storage/common/storage.js';
import { ITextResourceConfigurationService } from '../../../../../editor/common/services/resourceConfiguration.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { IPreferencesService } from '../../../../services/preferences/common/preferences.js';
import { IThemeService } from '../../../../../platform/theme/common/themeService.js';
import { IWindowsService, IWindowService } from '../../../../../platform/windows/common/windows.js';
import { IEditorService } from '../../../../services/editor/common/editorService.js';
import { IEditorGroupsService } from '../../../../services/group/common/editorGroupsService.js';
/**
 * An implementation of editor for file system resources.
 */
var TextFileEditor = /** @class */ (function (_super) {
    __extends(TextFileEditor, _super);
    function TextFileEditor(telemetryService, fileService, viewletService, instantiationService, contextService, storageService, configurationService, editorService, themeService, editorGroupService, textFileService, windowsService, preferencesService, windowService) {
        var _this = _super.call(this, TextFileEditor.ID, telemetryService, instantiationService, storageService, configurationService, themeService, textFileService, editorService, editorGroupService, windowService) || this;
        _this.fileService = fileService;
        _this.viewletService = viewletService;
        _this.contextService = contextService;
        _this.windowsService = windowsService;
        _this.preferencesService = preferencesService;
        _this.updateRestoreViewStateConfiguration();
        // Clear view state for deleted files
        _this._register(_this.fileService.onFileChanges(function (e) { return _this.onFilesChanged(e); }));
        return _this;
    }
    TextFileEditor.prototype.onFilesChanged = function (e) {
        var deleted = e.getDeleted();
        if (deleted && deleted.length) {
            this.clearTextEditorViewState(deleted.map(function (d) { return d.resource; }));
        }
    };
    TextFileEditor.prototype.handleConfigurationChangeEvent = function (configuration) {
        _super.prototype.handleConfigurationChangeEvent.call(this, configuration);
        this.updateRestoreViewStateConfiguration();
    };
    TextFileEditor.prototype.updateRestoreViewStateConfiguration = function () {
        this.restoreViewState = this.configurationService.getValue(null, 'workbench.editor.restoreViewState');
    };
    TextFileEditor.prototype.getTitle = function () {
        return this.input ? this.input.getName() : nls.localize('textFileEditor', "Text File Editor");
    };
    Object.defineProperty(TextFileEditor.prototype, "input", {
        get: function () {
            return this._input;
        },
        enumerable: true,
        configurable: true
    });
    TextFileEditor.prototype.setEditorVisible = function (visible, group) {
        var _this = this;
        _super.prototype.setEditorVisible.call(this, visible, group);
        // React to editors closing to preserve or clear view state. This needs to happen
        // in the onWillCloseEditor because at that time the editor has not yet
        // been disposed and we can safely persist the view state still as needed.
        this._register(group.onWillCloseEditor(function (e) {
            if (e.editor === _this.input) {
                _this.doSaveOrClearTextEditorViewState(_this.input);
            }
        }));
    };
    TextFileEditor.prototype.setOptions = function (options) {
        var textOptions = options;
        if (textOptions && types.isFunction(textOptions.apply)) {
            textOptions.apply(this.getControl(), 0 /* Smooth */);
        }
    };
    TextFileEditor.prototype.setInput = function (input, options, token) {
        var _this = this;
        // Update/clear view settings if input changes
        this.doSaveOrClearTextEditorViewState(this.input);
        // Set input and resolve
        return _super.prototype.setInput.call(this, input, options, token).then(function () {
            return input.resolve().then(function (resolvedModel) {
                // Check for cancellation
                if (token.isCancellationRequested) {
                    return void 0;
                }
                // There is a special case where the text editor has to handle binary file editor input: if a binary file
                // has been resolved and cached before, it maybe an actual instance of BinaryEditorModel. In this case our text
                // editor has to open this model using the binary editor. We return early in this case.
                if (resolvedModel instanceof BinaryEditorModel) {
                    return _this.openAsBinary(input, options);
                }
                // Check Model state
                var textFileModel = resolvedModel;
                var hasInput = !!_this.input;
                var modelDisposed = textFileModel.isDisposed();
                var inputChanged = hasInput && _this.input.getResource().toString() !== textFileModel.getResource().toString();
                if (!hasInput || // editor got hidden meanwhile
                    modelDisposed || // input got disposed meanwhile
                    inputChanged // a different input was set meanwhile
                ) {
                    return void 0;
                }
                // Editor
                var textEditor = _this.getControl();
                textEditor.setModel(textFileModel.textEditorModel);
                // Always restore View State if any associated
                var editorViewState = _this.loadTextEditorViewState(_this.input.getResource());
                if (editorViewState) {
                    textEditor.restoreViewState(editorViewState);
                }
                // TextOptions (avoiding instanceof here for a reason, do not change!)
                if (options && types.isFunction(options.apply)) {
                    options.apply(textEditor, 1 /* Immediate */);
                }
                // Readonly flag
                textEditor.updateOptions({ readOnly: textFileModel.isReadonly() });
            }, function (error) {
                // In case we tried to open a file inside the text editor and the response
                // indicates that this is not a text file, reopen the file through the binary
                // editor.
                if (error.fileOperationResult === 0 /* FILE_IS_BINARY */) {
                    return _this.openAsBinary(input, options);
                }
                // Similar, handle case where we were asked to open a folder in the text editor.
                if (error.fileOperationResult === 1 /* FILE_IS_DIRECTORY */) {
                    _this.openAsFolder(input);
                    return Promise.reject(new Error(nls.localize('openFolderError', "File is a directory")));
                }
                // Offer to create a file from the error if we have a file not found and the name is valid
                if (error.fileOperationResult === 2 /* FILE_NOT_FOUND */ && paths.isValidBasename(paths.basename(input.getResource().fsPath))) {
                    return Promise.reject(errors.create(toErrorMessage(error), {
                        actions: [
                            new Action('workbench.files.action.createMissingFile', nls.localize('createFile', "Create File"), null, true, function () {
                                return _this.fileService.updateContent(input.getResource(), '').then(function () { return _this.editorService.openEditor({
                                    resource: input.getResource(),
                                    options: {
                                        pinned: true // new file gets pinned by default
                                    }
                                }); });
                            })
                        ]
                    }));
                }
                if (error.fileOperationResult === 10 /* FILE_EXCEED_MEMORY_LIMIT */) {
                    var memoryLimit_1 = Math.max(MIN_MAX_MEMORY_SIZE_MB, +_this.configurationService.getValue(null, 'files.maxMemoryForLargeFilesMB') || FALLBACK_MAX_MEMORY_SIZE_MB);
                    return Promise.reject(errors.create(toErrorMessage(error), {
                        actions: [
                            new Action('workbench.window.action.relaunchWithIncreasedMemoryLimit', nls.localize('relaunchWithIncreasedMemoryLimit', "Restart with {0} MB", memoryLimit_1), null, true, function () {
                                return _this.windowsService.relaunch({
                                    addArgs: [
                                        "--max-memory=" + memoryLimit_1
                                    ]
                                });
                            }),
                            new Action('workbench.window.action.configureMemoryLimit', nls.localize('configureMemoryLimit', 'Configure Memory Limit'), null, true, function () {
                                return _this.preferencesService.openGlobalSettings(undefined, { query: 'files.maxMemoryForLargeFilesMB' });
                            })
                        ]
                    }));
                }
                // Otherwise make sure the error bubbles up
                return Promise.reject(error);
            });
        });
    };
    TextFileEditor.prototype.openAsBinary = function (input, options) {
        input.setForceOpenAsBinary();
        this.editorService.openEditor(input, options, this.group);
    };
    TextFileEditor.prototype.openAsFolder = function (input) {
        var _this = this;
        // Since we cannot open a folder, we have to restore the previous input if any and close the editor
        this.group.closeEditor(this.input).then(function () {
            // Best we can do is to reveal the folder in the explorer
            if (_this.contextService.isInsideWorkspace(input.getResource())) {
                _this.viewletService.openViewlet(VIEWLET_ID, true).then(function (viewlet) {
                    return viewlet.getExplorerView().select(input.getResource(), true);
                });
            }
        });
    };
    TextFileEditor.prototype.getAriaLabel = function () {
        var input = this.input;
        var inputName = input && input.getName();
        var ariaLabel;
        if (inputName) {
            ariaLabel = nls.localize('fileEditorWithInputAriaLabel', "{0}. Text file editor.", inputName);
        }
        else {
            ariaLabel = nls.localize('fileEditorAriaLabel', "Text file editor.");
        }
        return ariaLabel;
    };
    TextFileEditor.prototype.clearInput = function () {
        // Update/clear editor view state in settings
        this.doSaveOrClearTextEditorViewState(this.input);
        // Clear Model
        this.getControl().setModel(null);
        // Pass to super
        _super.prototype.clearInput.call(this);
    };
    TextFileEditor.prototype.shutdown = function () {
        // Update/clear editor view State
        this.doSaveOrClearTextEditorViewState(this.input);
        // Call Super
        _super.prototype.shutdown.call(this);
    };
    TextFileEditor.prototype.doSaveOrClearTextEditorViewState = function (input) {
        if (!input) {
            return; // ensure we have an input to handle view state for
        }
        // If the user configured to not restore view state, we clear the view
        // state unless the editor is still opened in the group.
        if (!this.restoreViewState && (!this.group || !this.group.isOpened(input))) {
            this.clearTextEditorViewState([input.getResource()], this.group);
        }
        // Otherwise we save the view state to restore it later
        else if (!input.isDisposed()) {
            this.saveTextEditorViewState(input.getResource());
        }
    };
    TextFileEditor.ID = TEXT_FILE_EDITOR_ID;
    TextFileEditor = __decorate([
        __param(0, ITelemetryService),
        __param(1, IFileService),
        __param(2, IViewletService),
        __param(3, IInstantiationService),
        __param(4, IWorkspaceContextService),
        __param(5, IStorageService),
        __param(6, ITextResourceConfigurationService),
        __param(7, IEditorService),
        __param(8, IThemeService),
        __param(9, IEditorGroupsService),
        __param(10, ITextFileService),
        __param(11, IWindowsService),
        __param(12, IPreferencesService),
        __param(13, IWindowService)
    ], TextFileEditor);
    return TextFileEditor;
}(BaseTextEditor));
export { TextFileEditor };
