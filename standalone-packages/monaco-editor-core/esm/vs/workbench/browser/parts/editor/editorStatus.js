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
import './media/editorstatus.css';
import * as nls from '../../../../nls';
import { TPromise } from '../../../../base/common/winjs.base';
import { $, append, runAtThisOrScheduleAtNextAnimationFrame } from '../../../../base/browser/dom';
import * as strings from '../../../../base/common/strings';
import * as paths from '../../../../base/common/paths';
import * as types from '../../../../base/common/types';
import { URI as uri } from '../../../../base/common/uri';
import { Action } from '../../../../base/common/actions';
import { language, LANGUAGE_DEFAULT } from '../../../../base/common/platform';
import * as browser from '../../../../base/browser/browser';
import { UntitledEditorInput } from '../../../common/editor/untitledEditorInput';
import { toResource, SideBySideEditorInput } from '../../../common/editor';
import { combinedDisposable, dispose } from '../../../../base/common/lifecycle';
import { IUntitledEditorService } from '../../../services/untitled/common/untitledEditorService';
import { EndOfLineSequence } from '../../../../editor/common/model';
import { TrimTrailingWhitespaceAction } from '../../../../editor/contrib/linesOperations/linesOperations';
import { IndentUsingSpaces, IndentUsingTabs, DetectIndentation, IndentationToSpacesAction, IndentationToTabsAction } from '../../../../editor/contrib/indentation/indentation';
import { BaseBinaryResourceEditor } from './binaryEditor';
import { BinaryResourceDiffEditor } from './binaryDiffEditor';
import { IEditorService } from '../../../services/editor/common/editorService';
import { IQuickOpenService } from '../../../../platform/quickOpen/common/quickOpen';
import { IWorkspaceConfigurationService } from '../../../services/configuration/common/configuration';
import { SUPPORTED_ENCODINGS, IFileService, FILES_ASSOCIATIONS_CONFIG } from '../../../../platform/files/common/files';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation';
import { IModeService } from '../../../../editor/common/services/modeService';
import { IModelService } from '../../../../editor/common/services/modelService';
import { Range } from '../../../../editor/common/core/range';
import { Selection } from '../../../../editor/common/core/selection';
import { TabFocus } from '../../../../editor/common/config/commonEditorConfig';
import { ICommandService } from '../../../../platform/commands/common/commands';
import { IExtensionGalleryService } from '../../../../platform/extensionManagement/common/extensionManagement';
import { ITextFileService } from '../../../services/textfile/common/textfiles';
import { ITextResourceConfigurationService } from '../../../../editor/common/services/resourceConfiguration';
import { deepClone } from '../../../../base/common/objects';
import { isCodeEditor, isDiffEditor, getCodeEditor } from '../../../../editor/browser/editorBrowser';
import { Schemas } from '../../../../base/common/network';
import { IPreferencesService } from '../../../services/preferences/common/preferences';
import { IQuickInputService } from '../../../../platform/quickinput/common/quickInput';
import { getIconClasses } from '../../labels';
import { timeout } from '../../../../base/common/async';
import { INotificationService, Severity } from '../../../../platform/notification/common/notification';
import { once } from '../../../../base/common/event';
var SideBySideEditorEncodingSupport = /** @class */ (function () {
    function SideBySideEditorEncodingSupport(master, details) {
        this.master = master;
        this.details = details;
    }
    SideBySideEditorEncodingSupport.prototype.getEncoding = function () {
        return this.master.getEncoding(); // always report from modified (right hand) side
    };
    SideBySideEditorEncodingSupport.prototype.setEncoding = function (encoding, mode) {
        [this.master, this.details].forEach(function (s) { return s.setEncoding(encoding, mode); });
    };
    return SideBySideEditorEncodingSupport;
}());
function toEditorWithEncodingSupport(input) {
    // Untitled Editor
    if (input instanceof UntitledEditorInput) {
        return input;
    }
    // Side by Side (diff) Editor
    if (input instanceof SideBySideEditorInput) {
        var masterEncodingSupport = toEditorWithEncodingSupport(input.master);
        var detailsEncodingSupport = toEditorWithEncodingSupport(input.details);
        if (masterEncodingSupport && detailsEncodingSupport) {
            return new SideBySideEditorEncodingSupport(masterEncodingSupport, detailsEncodingSupport);
        }
        return masterEncodingSupport;
    }
    // File or Resource Editor
    var encodingSupport = input;
    if (types.areFunctions(encodingSupport.setEncoding, encodingSupport.getEncoding)) {
        return encodingSupport;
    }
    // Unsupported for any other editor
    return null;
}
var StateChange = /** @class */ (function () {
    function StateChange() {
        this.indentation = false;
        this.selectionStatus = false;
        this.mode = false;
        this.encoding = false;
        this.EOL = false;
        this.tabFocusMode = false;
        this.screenReaderMode = false;
        this.metadata = false;
    }
    StateChange.prototype.combine = function (other) {
        this.indentation = this.indentation || other.indentation;
        this.selectionStatus = this.selectionStatus || other.selectionStatus;
        this.mode = this.mode || other.mode;
        this.encoding = this.encoding || other.encoding;
        this.EOL = this.EOL || other.EOL;
        this.tabFocusMode = this.tabFocusMode || other.tabFocusMode;
        this.screenReaderMode = this.screenReaderMode || other.screenReaderMode;
        this.metadata = this.metadata || other.metadata;
    };
    return StateChange;
}());
var State = /** @class */ (function () {
    function State() {
        this._selectionStatus = null;
        this._mode = null;
        this._encoding = null;
        this._EOL = null;
        this._tabFocusMode = false;
        this._screenReaderMode = false;
        this._metadata = null;
    }
    Object.defineProperty(State.prototype, "selectionStatus", {
        get: function () { return this._selectionStatus; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(State.prototype, "mode", {
        get: function () { return this._mode; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(State.prototype, "encoding", {
        get: function () { return this._encoding; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(State.prototype, "EOL", {
        get: function () { return this._EOL; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(State.prototype, "indentation", {
        get: function () { return this._indentation; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(State.prototype, "tabFocusMode", {
        get: function () { return this._tabFocusMode; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(State.prototype, "screenReaderMode", {
        get: function () { return this._screenReaderMode; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(State.prototype, "metadata", {
        get: function () { return this._metadata; },
        enumerable: true,
        configurable: true
    });
    State.prototype.update = function (update) {
        var e = new StateChange();
        var somethingChanged = false;
        if (typeof update.selectionStatus !== 'undefined') {
            if (this._selectionStatus !== update.selectionStatus) {
                this._selectionStatus = update.selectionStatus;
                somethingChanged = true;
                e.selectionStatus = true;
            }
        }
        if (typeof update.indentation !== 'undefined') {
            if (this._indentation !== update.indentation) {
                this._indentation = update.indentation;
                somethingChanged = true;
                e.indentation = true;
            }
        }
        if (typeof update.mode !== 'undefined') {
            if (this._mode !== update.mode) {
                this._mode = update.mode;
                somethingChanged = true;
                e.mode = true;
            }
        }
        if (typeof update.encoding !== 'undefined') {
            if (this._encoding !== update.encoding) {
                this._encoding = update.encoding;
                somethingChanged = true;
                e.encoding = true;
            }
        }
        if (typeof update.EOL !== 'undefined') {
            if (this._EOL !== update.EOL) {
                this._EOL = update.EOL;
                somethingChanged = true;
                e.EOL = true;
            }
        }
        if (typeof update.tabFocusMode !== 'undefined') {
            if (this._tabFocusMode !== update.tabFocusMode) {
                this._tabFocusMode = update.tabFocusMode;
                somethingChanged = true;
                e.tabFocusMode = true;
            }
        }
        if (typeof update.screenReaderMode !== 'undefined') {
            if (this._screenReaderMode !== update.screenReaderMode) {
                this._screenReaderMode = update.screenReaderMode;
                somethingChanged = true;
                e.screenReaderMode = true;
            }
        }
        if (typeof update.metadata !== 'undefined') {
            if (this._metadata !== update.metadata) {
                this._metadata = update.metadata;
                somethingChanged = true;
                e.metadata = true;
            }
        }
        if (somethingChanged) {
            return e;
        }
        return null;
    };
    return State;
}());
var nlsSingleSelectionRange = nls.localize('singleSelectionRange', "Ln {0}, Col {1} ({2} selected)");
var nlsSingleSelection = nls.localize('singleSelection', "Ln {0}, Col {1}");
var nlsMultiSelectionRange = nls.localize('multiSelectionRange', "{0} selections ({1} characters selected)");
var nlsMultiSelection = nls.localize('multiSelection', "{0} selections");
var nlsEOLLF = nls.localize('endOfLineLineFeed', "LF");
var nlsEOLCRLF = nls.localize('endOfLineCarriageReturnLineFeed', "CRLF");
var nlsTabFocusMode = nls.localize('tabFocusModeEnabled', "Tab Moves Focus");
var nlsScreenReaderDetected = nls.localize('screenReaderDetected', "Screen Reader Optimized");
var nlsScreenReaderDetectedTitle = nls.localize('screenReaderDetectedExtra', "If you are not using a Screen Reader, please change the setting `editor.accessibilitySupport` to \"off\".");
function setDisplay(el, desiredValue) {
    if (el.style.display !== desiredValue) {
        el.style.display = desiredValue;
    }
}
function show(el) {
    setDisplay(el, '');
}
function hide(el) {
    setDisplay(el, 'none');
}
var EditorStatus = /** @class */ (function () {
    function EditorStatus(editorService, quickOpenService, instantiationService, untitledEditorService, modeService, textFileService, configurationService, notificationService) {
        this.editorService = editorService;
        this.quickOpenService = quickOpenService;
        this.instantiationService = instantiationService;
        this.untitledEditorService = untitledEditorService;
        this.modeService = modeService;
        this.textFileService = textFileService;
        this.configurationService = configurationService;
        this.notificationService = notificationService;
        this._promptedScreenReader = false;
        this.toDispose = [];
        this.activeEditorListeners = [];
        this.state = new State();
    }
    EditorStatus.prototype.render = function (container) {
        var _this = this;
        this.element = append(container, $('.editor-statusbar-item'));
        this.tabFocusModeElement = append(this.element, $('a.editor-status-tabfocusmode.status-bar-info'));
        this.tabFocusModeElement.title = nls.localize('disableTabMode', "Disable Accessibility Mode");
        this.tabFocusModeElement.onclick = function () { return _this.onTabFocusModeClick(); };
        this.tabFocusModeElement.textContent = nlsTabFocusMode;
        hide(this.tabFocusModeElement);
        this.screenRedearModeElement = append(this.element, $('a.editor-status-screenreadermode.status-bar-info'));
        this.screenRedearModeElement.textContent = nlsScreenReaderDetected;
        this.screenRedearModeElement.title = nlsScreenReaderDetectedTitle;
        this.screenRedearModeElement.onclick = function () { return _this.onScreenReaderModeClick(); };
        hide(this.screenRedearModeElement);
        this.selectionElement = append(this.element, $('a.editor-status-selection'));
        this.selectionElement.title = nls.localize('gotoLine', "Go to Line");
        this.selectionElement.onclick = function () { return _this.onSelectionClick(); };
        hide(this.selectionElement);
        this.indentationElement = append(this.element, $('a.editor-status-indentation'));
        this.indentationElement.title = nls.localize('selectIndentation', "Select Indentation");
        this.indentationElement.onclick = function () { return _this.onIndentationClick(); };
        hide(this.indentationElement);
        this.encodingElement = append(this.element, $('a.editor-status-encoding'));
        this.encodingElement.title = nls.localize('selectEncoding', "Select Encoding");
        this.encodingElement.onclick = function () { return _this.onEncodingClick(); };
        hide(this.encodingElement);
        this.eolElement = append(this.element, $('a.editor-status-eol'));
        this.eolElement.title = nls.localize('selectEOL', "Select End of Line Sequence");
        this.eolElement.onclick = function () { return _this.onEOLClick(); };
        hide(this.eolElement);
        this.modeElement = append(this.element, $('a.editor-status-mode'));
        this.modeElement.title = nls.localize('selectLanguageMode', "Select Language Mode");
        this.modeElement.onclick = function () { return _this.onModeClick(); };
        hide(this.modeElement);
        this.metadataElement = append(this.element, $('span.editor-status-metadata'));
        this.metadataElement.title = nls.localize('fileInfo', "File Information");
        hide(this.metadataElement);
        this.delayedRender = null;
        this.toRender = null;
        this.toDispose.push({
            dispose: function () {
                if (_this.delayedRender) {
                    _this.delayedRender.dispose();
                    _this.delayedRender = null;
                }
            }
        }, this.editorService.onDidActiveEditorChange(function () { return _this.updateStatusBar(); }), this.untitledEditorService.onDidChangeEncoding(function (r) { return _this.onResourceEncodingChange(r); }), this.textFileService.models.onModelEncodingChanged(function (e) { return _this.onResourceEncodingChange(e.resource); }), TabFocus.onDidChangeTabFocus(function (e) { return _this.onTabFocusModeChange(); }));
        return combinedDisposable(this.toDispose);
    };
    EditorStatus.prototype.updateState = function (update) {
        var _this = this;
        var changed = this.state.update(update);
        if (!changed) {
            // Nothing really changed
            return;
        }
        if (!this.toRender) {
            this.toRender = changed;
            this.delayedRender = runAtThisOrScheduleAtNextAnimationFrame(function () {
                _this.delayedRender = null;
                var toRender = _this.toRender;
                _this.toRender = null;
                _this._renderNow(toRender);
            });
        }
        else {
            this.toRender.combine(changed);
        }
    };
    EditorStatus.prototype._renderNow = function (changed) {
        if (changed.tabFocusMode) {
            if (this.state.tabFocusMode && this.state.tabFocusMode === true) {
                show(this.tabFocusModeElement);
            }
            else {
                hide(this.tabFocusModeElement);
            }
        }
        if (changed.screenReaderMode) {
            if (this.state.screenReaderMode && this.state.screenReaderMode === true) {
                show(this.screenRedearModeElement);
            }
            else {
                hide(this.screenRedearModeElement);
            }
        }
        if (changed.indentation) {
            if (this.state.indentation) {
                this.indentationElement.textContent = this.state.indentation;
                show(this.indentationElement);
            }
            else {
                hide(this.indentationElement);
            }
        }
        if (changed.selectionStatus) {
            if (this.state.selectionStatus && !this.state.screenReaderMode) {
                this.selectionElement.textContent = this.state.selectionStatus;
                show(this.selectionElement);
            }
            else {
                hide(this.selectionElement);
            }
        }
        if (changed.encoding) {
            if (this.state.encoding) {
                this.encodingElement.textContent = this.state.encoding;
                show(this.encodingElement);
            }
            else {
                hide(this.encodingElement);
            }
        }
        if (changed.EOL) {
            if (this.state.EOL) {
                this.eolElement.textContent = this.state.EOL === '\r\n' ? nlsEOLCRLF : nlsEOLLF;
                show(this.eolElement);
            }
            else {
                hide(this.eolElement);
            }
        }
        if (changed.mode) {
            if (this.state.mode) {
                this.modeElement.textContent = this.state.mode;
                show(this.modeElement);
            }
            else {
                hide(this.modeElement);
            }
        }
        if (changed.metadata) {
            if (this.state.metadata) {
                this.metadataElement.textContent = this.state.metadata;
                show(this.metadataElement);
            }
            else {
                hide(this.metadataElement);
            }
        }
    };
    EditorStatus.prototype.getSelectionLabel = function (info) {
        if (!info || !info.selections) {
            return null;
        }
        if (info.selections.length === 1) {
            if (info.charactersSelected) {
                return strings.format(nlsSingleSelectionRange, info.selections[0].positionLineNumber, info.selections[0].positionColumn, info.charactersSelected);
            }
            return strings.format(nlsSingleSelection, info.selections[0].positionLineNumber, info.selections[0].positionColumn);
        }
        if (info.charactersSelected) {
            return strings.format(nlsMultiSelectionRange, info.selections.length, info.charactersSelected);
        }
        if (info.selections.length > 0) {
            return strings.format(nlsMultiSelection, info.selections.length);
        }
        return null;
    };
    EditorStatus.prototype.onModeClick = function () {
        var action = this.instantiationService.createInstance(ChangeModeAction, ChangeModeAction.ID, ChangeModeAction.LABEL);
        action.run();
        action.dispose();
    };
    EditorStatus.prototype.onIndentationClick = function () {
        var action = this.instantiationService.createInstance(ChangeIndentationAction, ChangeIndentationAction.ID, ChangeIndentationAction.LABEL);
        action.run();
        action.dispose();
    };
    EditorStatus.prototype.onScreenReaderModeClick = function () {
        var _this = this;
        if (!this.screenReaderNotification) {
            this.screenReaderNotification = this.notificationService.prompt(Severity.Info, nls.localize('screenReaderDetectedExplanation.question', "Are you using a screen reader to operate VS Code?"), [{
                    label: nls.localize('screenReaderDetectedExplanation.answerYes', "Yes"),
                    run: function () {
                        _this.configurationService.updateValue('editor.accessibilitySupport', 'on', 1 /* USER */);
                    }
                }, {
                    label: nls.localize('screenReaderDetectedExplanation.answerNo', "No"),
                    run: function () {
                        _this.configurationService.updateValue('editor.accessibilitySupport', 'off', 1 /* USER */);
                    }
                }]);
            once(this.screenReaderNotification.onDidClose)(function () {
                _this.screenReaderNotification = null;
            });
        }
    };
    EditorStatus.prototype.onSelectionClick = function () {
        this.quickOpenService.show(':'); // "Go to line"
    };
    EditorStatus.prototype.onEOLClick = function () {
        var action = this.instantiationService.createInstance(ChangeEOLAction, ChangeEOLAction.ID, ChangeEOLAction.LABEL);
        action.run();
        action.dispose();
    };
    EditorStatus.prototype.onEncodingClick = function () {
        var action = this.instantiationService.createInstance(ChangeEncodingAction, ChangeEncodingAction.ID, ChangeEncodingAction.LABEL);
        action.run();
        action.dispose();
    };
    EditorStatus.prototype.onTabFocusModeClick = function () {
        TabFocus.setTabFocusMode(false);
    };
    EditorStatus.prototype.updateStatusBar = function () {
        var _this = this;
        var activeControl = this.editorService.activeControl;
        var activeCodeEditor = activeControl ? getCodeEditor(activeControl.getControl()) : void 0;
        // Update all states
        this.onScreenReaderModeChange(activeCodeEditor);
        this.onSelectionChange(activeCodeEditor);
        this.onModeChange(activeCodeEditor);
        this.onEOLChange(activeCodeEditor);
        this.onEncodingChange(activeControl);
        this.onIndentationChange(activeCodeEditor);
        this.onMetadataChange(activeControl);
        // Dispose old active editor listeners
        dispose(this.activeEditorListeners);
        // Attach new listeners to active editor
        if (activeCodeEditor) {
            // Hook Listener for Configuration changes
            this.activeEditorListeners.push(activeCodeEditor.onDidChangeConfiguration(function (event) {
                if (event.accessibilitySupport) {
                    _this.onScreenReaderModeChange(activeCodeEditor);
                }
            }));
            // Hook Listener for Selection changes
            this.activeEditorListeners.push(activeCodeEditor.onDidChangeCursorPosition(function (event) {
                _this.onSelectionChange(activeCodeEditor);
            }));
            // Hook Listener for mode changes
            this.activeEditorListeners.push(activeCodeEditor.onDidChangeModelLanguage(function (event) {
                _this.onModeChange(activeCodeEditor);
            }));
            // Hook Listener for content changes
            this.activeEditorListeners.push(activeCodeEditor.onDidChangeModelContent(function (e) {
                _this.onEOLChange(activeCodeEditor);
                var selections = activeCodeEditor.getSelections();
                var _loop_1 = function (i) {
                    if (selections.some(function (selection) { return Range.areIntersecting(selection, e.changes[i].range); })) {
                        _this.onSelectionChange(activeCodeEditor);
                        return "break";
                    }
                };
                for (var i = 0; i < e.changes.length; i++) {
                    var state_1 = _loop_1(i);
                    if (state_1 === "break")
                        break;
                }
            }));
            // Hook Listener for content options changes
            this.activeEditorListeners.push(activeCodeEditor.onDidChangeModelOptions(function (event) {
                _this.onIndentationChange(activeCodeEditor);
            }));
        }
        // Handle binary editors
        else if (activeControl instanceof BaseBinaryResourceEditor || activeControl instanceof BinaryResourceDiffEditor) {
            var binaryEditors = [];
            if (activeControl instanceof BinaryResourceDiffEditor) {
                var details = activeControl.getDetailsEditor();
                if (details instanceof BaseBinaryResourceEditor) {
                    binaryEditors.push(details);
                }
                var master = activeControl.getMasterEditor();
                if (master instanceof BaseBinaryResourceEditor) {
                    binaryEditors.push(master);
                }
            }
            else {
                binaryEditors.push(activeControl);
            }
            binaryEditors.forEach(function (editor) {
                _this.activeEditorListeners.push(editor.onMetadataChanged(function (metadata) {
                    _this.onMetadataChange(activeControl);
                }));
            });
        }
    };
    EditorStatus.prototype.onModeChange = function (editorWidget) {
        var info = { mode: null };
        // We only support text based editors
        if (editorWidget) {
            var textModel = editorWidget.getModel();
            if (textModel) {
                // Compute mode
                var modeId = textModel.getLanguageIdentifier().language;
                info = { mode: this.modeService.getLanguageName(modeId) };
            }
        }
        this.updateState(info);
    };
    EditorStatus.prototype.onIndentationChange = function (editorWidget) {
        var update = { indentation: null };
        if (editorWidget) {
            var model = editorWidget.getModel();
            if (model) {
                var modelOpts = model.getOptions();
                update.indentation = (modelOpts.insertSpaces
                    ? nls.localize('spacesSize', "Spaces: {0}", modelOpts.tabSize)
                    : nls.localize({ key: 'tabSize', comment: ['Tab corresponds to the tab key'] }, "Tab Size: {0}", modelOpts.tabSize));
            }
        }
        this.updateState(update);
    };
    EditorStatus.prototype.onMetadataChange = function (editor) {
        var update = { metadata: null };
        if (editor instanceof BaseBinaryResourceEditor || editor instanceof BinaryResourceDiffEditor) {
            update.metadata = editor.getMetadata();
        }
        this.updateState(update);
    };
    EditorStatus.prototype.onScreenReaderModeChange = function (editorWidget) {
        var _this = this;
        var screenReaderMode = false;
        // We only support text based editors
        if (editorWidget) {
            var screenReaderDetected = (browser.getAccessibilitySupport() === 2 /* Enabled */);
            if (screenReaderDetected) {
                var screenReaderConfiguration = this.configurationService.getValue('editor').accessibilitySupport;
                if (screenReaderConfiguration === 'auto') {
                    // show explanation
                    if (!this._promptedScreenReader) {
                        this._promptedScreenReader = true;
                        setTimeout(function () {
                            _this.onScreenReaderModeClick();
                        }, 100);
                    }
                }
            }
            screenReaderMode = (editorWidget.getConfiguration().accessibilitySupport === 2 /* Enabled */);
        }
        if (screenReaderMode === false && this.screenReaderNotification) {
            this.screenReaderNotification.close();
        }
        this.updateState({ screenReaderMode: screenReaderMode });
    };
    EditorStatus.prototype.onSelectionChange = function (editorWidget) {
        var info = {};
        // We only support text based editors
        if (editorWidget) {
            // Compute selection(s)
            info.selections = editorWidget.getSelections() || [];
            // Compute selection length
            info.charactersSelected = 0;
            var textModel_1 = editorWidget.getModel();
            if (textModel_1) {
                info.selections.forEach(function (selection) {
                    info.charactersSelected += textModel_1.getValueLengthInRange(selection);
                });
            }
            // Compute the visible column for one selection. This will properly handle tabs and their configured widths
            if (info.selections.length === 1) {
                var visibleColumn = editorWidget.getVisibleColumnFromPosition(editorWidget.getPosition());
                var selectionClone = info.selections[0].clone(); // do not modify the original position we got from the editor
                selectionClone = new Selection(selectionClone.selectionStartLineNumber, selectionClone.selectionStartColumn, selectionClone.positionLineNumber, visibleColumn);
                info.selections[0] = selectionClone;
            }
        }
        this.updateState({ selectionStatus: this.getSelectionLabel(info) });
    };
    EditorStatus.prototype.onEOLChange = function (editorWidget) {
        var info = { EOL: null };
        if (editorWidget && !editorWidget.getConfiguration().readOnly) {
            var codeEditorModel = editorWidget.getModel();
            if (codeEditorModel) {
                info.EOL = codeEditorModel.getEOL();
            }
        }
        this.updateState(info);
    };
    EditorStatus.prototype.onEncodingChange = function (e) {
        if (e && !this.isActiveEditor(e)) {
            return;
        }
        var info = { encoding: null };
        // We only support text based editors
        if (e && (isCodeEditor(e.getControl()) || isDiffEditor(e.getControl()))) {
            var encodingSupport = toEditorWithEncodingSupport(e.input);
            if (encodingSupport) {
                var rawEncoding = encodingSupport.getEncoding();
                var encodingInfo = SUPPORTED_ENCODINGS[rawEncoding];
                if (encodingInfo) {
                    info.encoding = encodingInfo.labelShort; // if we have a label, take it from there
                }
                else {
                    info.encoding = rawEncoding; // otherwise use it raw
                }
            }
        }
        this.updateState(info);
    };
    EditorStatus.prototype.onResourceEncodingChange = function (resource) {
        var activeControl = this.editorService.activeControl;
        if (activeControl) {
            var activeResource = toResource(activeControl.input, { supportSideBySide: true });
            if (activeResource && activeResource.toString() === resource.toString()) {
                return this.onEncodingChange(activeControl); // only update if the encoding changed for the active resource
            }
        }
    };
    EditorStatus.prototype.onTabFocusModeChange = function () {
        var info = { tabFocusMode: TabFocus.getTabFocusMode() };
        this.updateState(info);
    };
    EditorStatus.prototype.isActiveEditor = function (control) {
        var activeControl = this.editorService.activeControl;
        return activeControl && activeControl === control;
    };
    EditorStatus = __decorate([
        __param(0, IEditorService),
        __param(1, IQuickOpenService),
        __param(2, IInstantiationService),
        __param(3, IUntitledEditorService),
        __param(4, IModeService),
        __param(5, ITextFileService),
        __param(6, IWorkspaceConfigurationService),
        __param(7, INotificationService)
    ], EditorStatus);
    return EditorStatus;
}());
export { EditorStatus };
function isWritableCodeEditor(codeEditor) {
    if (!codeEditor) {
        return false;
    }
    var config = codeEditor.getConfiguration();
    return (!config.readOnly);
}
function isWritableBaseEditor(e) {
    return e && isWritableCodeEditor(getCodeEditor(e.getControl()));
}
var ShowLanguageExtensionsAction = /** @class */ (function (_super) {
    __extends(ShowLanguageExtensionsAction, _super);
    function ShowLanguageExtensionsAction(fileExtension, commandService, galleryService) {
        var _this = _super.call(this, ShowLanguageExtensionsAction.ID, nls.localize('showLanguageExtensions', "Search Marketplace Extensions for '{0}'...", fileExtension)) || this;
        _this.fileExtension = fileExtension;
        _this.commandService = commandService;
        _this.enabled = galleryService.isEnabled();
        return _this;
    }
    ShowLanguageExtensionsAction.prototype.run = function () {
        return this.commandService.executeCommand('workbench.extensions.action.showExtensionsForLanguage', this.fileExtension).then(function () { return void 0; });
    };
    ShowLanguageExtensionsAction.ID = 'workbench.action.showLanguageExtensions';
    ShowLanguageExtensionsAction = __decorate([
        __param(1, ICommandService),
        __param(2, IExtensionGalleryService)
    ], ShowLanguageExtensionsAction);
    return ShowLanguageExtensionsAction;
}(Action));
export { ShowLanguageExtensionsAction };
var ChangeModeAction = /** @class */ (function (_super) {
    __extends(ChangeModeAction, _super);
    function ChangeModeAction(actionId, actionLabel, modeService, modelService, editorService, configurationService, quickInputService, preferencesService, instantiationService, untitledEditorService) {
        var _this = _super.call(this, actionId, actionLabel) || this;
        _this.modeService = modeService;
        _this.modelService = modelService;
        _this.editorService = editorService;
        _this.configurationService = configurationService;
        _this.quickInputService = quickInputService;
        _this.preferencesService = preferencesService;
        _this.instantiationService = instantiationService;
        _this.untitledEditorService = untitledEditorService;
        return _this;
    }
    ChangeModeAction.prototype.run = function () {
        var _this = this;
        var activeTextEditorWidget = getCodeEditor(this.editorService.activeTextEditorWidget);
        if (!activeTextEditorWidget) {
            return this.quickInputService.pick([{ label: nls.localize('noEditor', "No text editor active at this time") }]);
        }
        var textModel = activeTextEditorWidget.getModel();
        var resource = toResource(this.editorService.activeEditor, { supportSideBySide: true });
        var hasLanguageSupport = !!resource;
        if (resource.scheme === Schemas.untitled && !this.untitledEditorService.hasAssociatedFilePath(resource)) {
            hasLanguageSupport = false; // no configuration for untitled resources (e.g. "Untitled-1")
        }
        // Compute mode
        var currentModeId;
        var modeId;
        if (textModel) {
            modeId = textModel.getLanguageIdentifier().language;
            currentModeId = this.modeService.getLanguageName(modeId);
        }
        // All languages are valid picks
        var languages = this.modeService.getRegisteredLanguageNames();
        var picks = languages.sort().map(function (lang, index) {
            var description;
            if (currentModeId === lang) {
                description = nls.localize('languageDescription', "({0}) - Configured Language", _this.modeService.getModeIdForLanguageName(lang.toLowerCase()));
            }
            else {
                description = nls.localize('languageDescriptionConfigured', "({0})", _this.modeService.getModeIdForLanguageName(lang.toLowerCase()));
            }
            // construct a fake resource to be able to show nice icons if any
            var fakeResource;
            var extensions = _this.modeService.getExtensions(lang);
            if (extensions && extensions.length) {
                fakeResource = uri.file(extensions[0]);
            }
            else {
                var filenames = _this.modeService.getFilenames(lang);
                if (filenames && filenames.length) {
                    fakeResource = uri.file(filenames[0]);
                }
            }
            return {
                label: lang,
                iconClasses: getIconClasses(_this.modelService, _this.modeService, fakeResource),
                description: description
            };
        });
        if (hasLanguageSupport) {
            picks.unshift({ type: 'separator', label: nls.localize('languagesPicks', "languages (identifier)") });
        }
        // Offer action to configure via settings
        var configureModeAssociations;
        var configureModeSettings;
        var galleryAction;
        if (hasLanguageSupport) {
            var ext = paths.extname(resource.fsPath) || paths.basename(resource.fsPath);
            galleryAction = this.instantiationService.createInstance(ShowLanguageExtensionsAction, ext);
            if (galleryAction.enabled) {
                picks.unshift(galleryAction);
            }
            configureModeSettings = { label: nls.localize('configureModeSettings', "Configure '{0}' language based settings...", currentModeId) };
            picks.unshift(configureModeSettings);
            configureModeAssociations = { label: nls.localize('configureAssociationsExt', "Configure File Association for '{0}'...", ext) };
            picks.unshift(configureModeAssociations);
        }
        // Offer to "Auto Detect"
        var autoDetectMode = {
            label: nls.localize('autoDetect', "Auto Detect")
        };
        if (hasLanguageSupport) {
            picks.unshift(autoDetectMode);
        }
        return this.quickInputService.pick(picks, { placeHolder: nls.localize('pickLanguage', "Select Language Mode"), matchOnDescription: true }).then(function (pick) {
            if (!pick) {
                return;
            }
            if (pick === galleryAction) {
                galleryAction.run();
                return;
            }
            // User decided to permanently configure associations, return right after
            if (pick === configureModeAssociations) {
                _this.configureFileAssociation(resource);
                return;
            }
            // User decided to configure settings for current language
            if (pick === configureModeSettings) {
                _this.preferencesService.configureSettingsForLanguage(modeId);
                return;
            }
            // Change mode for active editor
            var activeEditor = _this.editorService.activeEditor;
            var activeTextEditorWidget = _this.editorService.activeTextEditorWidget;
            var models = [];
            if (isCodeEditor(activeTextEditorWidget)) {
                var codeEditorModel = activeTextEditorWidget.getModel();
                if (codeEditorModel) {
                    models.push(codeEditorModel);
                }
            }
            else if (isDiffEditor(activeTextEditorWidget)) {
                var diffEditorModel = activeTextEditorWidget.getModel();
                if (diffEditorModel) {
                    if (diffEditorModel.original) {
                        models.push(diffEditorModel.original);
                    }
                    if (diffEditorModel.modified) {
                        models.push(diffEditorModel.modified);
                    }
                }
            }
            // Find mode
            var mode;
            if (pick === autoDetectMode) {
                mode = _this.modeService.getOrCreateModeByFilepathOrFirstLine(toResource(activeEditor, { supportSideBySide: true }).fsPath, textModel.getLineContent(1));
            }
            else {
                mode = _this.modeService.getOrCreateModeByLanguageName(pick.label);
            }
            // Change mode
            models.forEach(function (textModel) {
                _this.modelService.setMode(textModel, mode);
            });
        });
    };
    ChangeModeAction.prototype.configureFileAssociation = function (resource) {
        var _this = this;
        var extension = paths.extname(resource.fsPath);
        var basename = paths.basename(resource.fsPath);
        var currentAssociation = this.modeService.getModeIdByFilepathOrFirstLine(basename);
        var languages = this.modeService.getRegisteredLanguageNames();
        var picks = languages.sort().map(function (lang, index) {
            var id = _this.modeService.getModeIdForLanguageName(lang.toLowerCase());
            return {
                id: id,
                label: lang,
                description: (id === currentAssociation) ? nls.localize('currentAssociation', "Current Association") : void 0
            };
        });
        setTimeout(function () {
            _this.quickInputService.pick(picks, { placeHolder: nls.localize('pickLanguageToConfigure', "Select Language Mode to Associate with '{0}'", extension || basename) }).then(function (language) {
                if (language) {
                    var fileAssociationsConfig = _this.configurationService.inspect(FILES_ASSOCIATIONS_CONFIG);
                    var associationKey = void 0;
                    if (extension && basename[0] !== '.') {
                        associationKey = "*" + extension; // only use "*.ext" if the file path is in the form of <name>.<ext>
                    }
                    else {
                        associationKey = basename; // otherwise use the basename (e.g. .gitignore, Dockerfile)
                    }
                    // If the association is already being made in the workspace, make sure to target workspace settings
                    var target = 1 /* USER */;
                    if (fileAssociationsConfig.workspace && !!fileAssociationsConfig.workspace[associationKey]) {
                        target = 2 /* WORKSPACE */;
                    }
                    // Make sure to write into the value of the target and not the merged value from USER and WORKSPACE config
                    var currentAssociations = deepClone((target === 2 /* WORKSPACE */) ? fileAssociationsConfig.workspace : fileAssociationsConfig.user);
                    if (!currentAssociations) {
                        currentAssociations = Object.create(null);
                    }
                    currentAssociations[associationKey] = language.id;
                    _this.configurationService.updateValue(FILES_ASSOCIATIONS_CONFIG, currentAssociations, target);
                }
            });
        }, 50 /* quick open is sensitive to being opened so soon after another */);
    };
    ChangeModeAction.ID = 'workbench.action.editor.changeLanguageMode';
    ChangeModeAction.LABEL = nls.localize('changeMode', "Change Language Mode");
    ChangeModeAction = __decorate([
        __param(2, IModeService),
        __param(3, IModelService),
        __param(4, IEditorService),
        __param(5, IWorkspaceConfigurationService),
        __param(6, IQuickInputService),
        __param(7, IPreferencesService),
        __param(8, IInstantiationService),
        __param(9, IUntitledEditorService)
    ], ChangeModeAction);
    return ChangeModeAction;
}(Action));
export { ChangeModeAction };
var ChangeIndentationAction = /** @class */ (function (_super) {
    __extends(ChangeIndentationAction, _super);
    function ChangeIndentationAction(actionId, actionLabel, editorService, quickInputService) {
        var _this = _super.call(this, actionId, actionLabel) || this;
        _this.editorService = editorService;
        _this.quickInputService = quickInputService;
        return _this;
    }
    ChangeIndentationAction.prototype.run = function () {
        var activeTextEditorWidget = getCodeEditor(this.editorService.activeTextEditorWidget);
        if (!activeTextEditorWidget) {
            return this.quickInputService.pick([{ label: nls.localize('noEditor', "No text editor active at this time") }]);
        }
        if (!isWritableCodeEditor(activeTextEditorWidget)) {
            return this.quickInputService.pick([{ label: nls.localize('noWritableCodeEditor', "The active code editor is read-only.") }]);
        }
        var picks = [
            activeTextEditorWidget.getAction(IndentUsingSpaces.ID),
            activeTextEditorWidget.getAction(IndentUsingTabs.ID),
            activeTextEditorWidget.getAction(DetectIndentation.ID),
            activeTextEditorWidget.getAction(IndentationToSpacesAction.ID),
            activeTextEditorWidget.getAction(IndentationToTabsAction.ID),
            activeTextEditorWidget.getAction(TrimTrailingWhitespaceAction.ID)
        ].map(function (a) {
            return {
                id: a.id,
                label: a.label,
                detail: (language === LANGUAGE_DEFAULT) ? null : a.alias,
                run: function () {
                    activeTextEditorWidget.focus();
                    a.run();
                }
            };
        });
        picks.splice(3, 0, { type: 'separator', label: nls.localize('indentConvert', "convert file") });
        picks.unshift({ type: 'separator', label: nls.localize('indentView', "change view") });
        return this.quickInputService.pick(picks, { placeHolder: nls.localize('pickAction', "Select Action"), matchOnDetail: true }).then(function (action) { return action && action.run(); });
    };
    ChangeIndentationAction.ID = 'workbench.action.editor.changeIndentation';
    ChangeIndentationAction.LABEL = nls.localize('changeIndentation', "Change Indentation");
    ChangeIndentationAction = __decorate([
        __param(2, IEditorService),
        __param(3, IQuickInputService)
    ], ChangeIndentationAction);
    return ChangeIndentationAction;
}(Action));
var ChangeEOLAction = /** @class */ (function (_super) {
    __extends(ChangeEOLAction, _super);
    function ChangeEOLAction(actionId, actionLabel, editorService, quickInputService) {
        var _this = _super.call(this, actionId, actionLabel) || this;
        _this.editorService = editorService;
        _this.quickInputService = quickInputService;
        return _this;
    }
    ChangeEOLAction.prototype.run = function () {
        var _this = this;
        var activeTextEditorWidget = getCodeEditor(this.editorService.activeTextEditorWidget);
        if (!activeTextEditorWidget) {
            return this.quickInputService.pick([{ label: nls.localize('noEditor', "No text editor active at this time") }]);
        }
        if (!isWritableCodeEditor(activeTextEditorWidget)) {
            return this.quickInputService.pick([{ label: nls.localize('noWritableCodeEditor', "The active code editor is read-only.") }]);
        }
        var textModel = activeTextEditorWidget.getModel();
        var EOLOptions = [
            { label: nlsEOLLF, eol: EndOfLineSequence.LF },
            { label: nlsEOLCRLF, eol: EndOfLineSequence.CRLF },
        ];
        var selectedIndex = (textModel && textModel.getEOL() === '\n') ? 0 : 1;
        return this.quickInputService.pick(EOLOptions, { placeHolder: nls.localize('pickEndOfLine', "Select End of Line Sequence"), activeItem: EOLOptions[selectedIndex] }).then(function (eol) {
            if (eol) {
                var activeCodeEditor = getCodeEditor(_this.editorService.activeTextEditorWidget);
                if (activeCodeEditor && isWritableCodeEditor(activeCodeEditor)) {
                    var textModel_2 = activeCodeEditor.getModel();
                    textModel_2.pushEOL(eol.eol);
                }
            }
        });
    };
    ChangeEOLAction.ID = 'workbench.action.editor.changeEOL';
    ChangeEOLAction.LABEL = nls.localize('changeEndOfLine', "Change End of Line Sequence");
    ChangeEOLAction = __decorate([
        __param(2, IEditorService),
        __param(3, IQuickInputService)
    ], ChangeEOLAction);
    return ChangeEOLAction;
}(Action));
export { ChangeEOLAction };
var ChangeEncodingAction = /** @class */ (function (_super) {
    __extends(ChangeEncodingAction, _super);
    function ChangeEncodingAction(actionId, actionLabel, editorService, quickInputService, textResourceConfigurationService, fileService) {
        var _this = _super.call(this, actionId, actionLabel) || this;
        _this.editorService = editorService;
        _this.quickInputService = quickInputService;
        _this.textResourceConfigurationService = textResourceConfigurationService;
        _this.fileService = fileService;
        return _this;
    }
    ChangeEncodingAction.prototype.run = function () {
        var _this = this;
        if (!getCodeEditor(this.editorService.activeTextEditorWidget)) {
            return this.quickInputService.pick([{ label: nls.localize('noEditor', "No text editor active at this time") }]);
        }
        var activeControl = this.editorService.activeControl;
        var encodingSupport = toEditorWithEncodingSupport(activeControl.input);
        if (!encodingSupport) {
            return this.quickInputService.pick([{ label: nls.localize('noFileEditor', "No file active at this time") }]);
        }
        var pickActionPromise;
        var saveWithEncodingPick;
        var reopenWithEncodingPick;
        if (language === LANGUAGE_DEFAULT) {
            saveWithEncodingPick = { label: nls.localize('saveWithEncoding', "Save with Encoding") };
            reopenWithEncodingPick = { label: nls.localize('reopenWithEncoding', "Reopen with Encoding") };
        }
        else {
            saveWithEncodingPick = { label: nls.localize('saveWithEncoding', "Save with Encoding"), detail: 'Save with Encoding', };
            reopenWithEncodingPick = { label: nls.localize('reopenWithEncoding', "Reopen with Encoding"), detail: 'Reopen with Encoding' };
        }
        if (encodingSupport instanceof UntitledEditorInput) {
            pickActionPromise = TPromise.as(saveWithEncodingPick);
        }
        else if (!isWritableBaseEditor(activeControl)) {
            pickActionPromise = TPromise.as(reopenWithEncodingPick);
        }
        else {
            pickActionPromise = this.quickInputService.pick([reopenWithEncodingPick, saveWithEncodingPick], { placeHolder: nls.localize('pickAction', "Select Action"), matchOnDetail: true });
        }
        return pickActionPromise.then(function (action) {
            if (!action) {
                return void 0;
            }
            var resource = toResource(activeControl.input, { supportSideBySide: true });
            return timeout(50 /* quick open is sensitive to being opened so soon after another */)
                .then(function () {
                if (!resource || !_this.fileService.canHandleResource(resource)) {
                    return TPromise.as(null); // encoding detection only possible for resources the file service can handle
                }
                return _this.fileService.resolveContent(resource, { autoGuessEncoding: true, acceptTextOnly: true }).then(function (content) { return content.encoding; }, function (err) { return null; });
            })
                .then(function (guessedEncoding) {
                var isReopenWithEncoding = (action === reopenWithEncodingPick);
                var configuredEncoding = _this.textResourceConfigurationService.getValue(resource, 'files.encoding');
                var directMatchIndex;
                var aliasMatchIndex;
                // All encodings are valid picks
                var picks = Object.keys(SUPPORTED_ENCODINGS)
                    .sort(function (k1, k2) {
                    if (k1 === configuredEncoding) {
                        return -1;
                    }
                    else if (k2 === configuredEncoding) {
                        return 1;
                    }
                    return SUPPORTED_ENCODINGS[k1].order - SUPPORTED_ENCODINGS[k2].order;
                })
                    .filter(function (k) {
                    if (k === guessedEncoding && guessedEncoding !== configuredEncoding) {
                        return false; // do not show encoding if it is the guessed encoding that does not match the configured
                    }
                    return !isReopenWithEncoding || !SUPPORTED_ENCODINGS[k].encodeOnly; // hide those that can only be used for encoding if we are about to decode
                })
                    .map(function (key, index) {
                    if (key === encodingSupport.getEncoding()) {
                        directMatchIndex = index;
                    }
                    else if (SUPPORTED_ENCODINGS[key].alias === encodingSupport.getEncoding()) {
                        aliasMatchIndex = index;
                    }
                    return { id: key, label: SUPPORTED_ENCODINGS[key].labelLong, description: key };
                });
                // If we have a guessed encoding, show it first unless it matches the configured encoding
                if (guessedEncoding && configuredEncoding !== guessedEncoding && SUPPORTED_ENCODINGS[guessedEncoding]) {
                    picks.unshift({ type: 'separator' });
                    picks.unshift({ id: guessedEncoding, label: SUPPORTED_ENCODINGS[guessedEncoding].labelLong, description: nls.localize('guessedEncoding', "Guessed from content") });
                }
                var items = picks.filter(function (p) { return p.type !== 'separator'; });
                return _this.quickInputService.pick(picks, {
                    placeHolder: isReopenWithEncoding ? nls.localize('pickEncodingForReopen', "Select File Encoding to Reopen File") : nls.localize('pickEncodingForSave', "Select File Encoding to Save with"),
                    activeItem: items[typeof directMatchIndex === 'number' ? directMatchIndex : typeof aliasMatchIndex === 'number' ? aliasMatchIndex : -1]
                }).then(function (encoding) {
                    if (encoding) {
                        activeControl = _this.editorService.activeControl;
                        encodingSupport = toEditorWithEncodingSupport(activeControl.input);
                        if (encodingSupport && encodingSupport.getEncoding() !== encoding.id) {
                            encodingSupport.setEncoding(encoding.id, isReopenWithEncoding ? 1 /* Decode */ : 0 /* Encode */); // Set new encoding
                        }
                    }
                });
            });
        });
    };
    ChangeEncodingAction.ID = 'workbench.action.editor.changeEncoding';
    ChangeEncodingAction.LABEL = nls.localize('changeEncoding', "Change File Encoding");
    ChangeEncodingAction = __decorate([
        __param(2, IEditorService),
        __param(3, IQuickInputService),
        __param(4, ITextResourceConfigurationService),
        __param(5, IFileService)
    ], ChangeEncodingAction);
    return ChangeEncodingAction;
}(Action));
export { ChangeEncodingAction };
