/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
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
import './media/editor.css';
import './media/tokens.css';
import * as nls from '../../../nls.js';
import * as dom from '../../../base/browser/dom.js';
import { onUnexpectedError } from '../../../base/common/errors.js';
import { Emitter } from '../../../base/common/event.js';
import { Disposable, dispose } from '../../../base/common/lifecycle.js';
import { TPromise } from '../../../base/common/winjs.base.js';
import { IInstantiationService } from '../../../platform/instantiation/common/instantiation.js';
import { ServiceCollection } from '../../../platform/instantiation/common/serviceCollection.js';
import { IContextKeyService } from '../../../platform/contextkey/common/contextkey.js';
import { Configuration } from '../config/configuration.js';
import { Cursor } from '../../common/controller/cursor.js';
import { CursorColumns } from '../../common/controller/cursorCommon.js';
import { Position } from '../../common/core/position.js';
import { Range } from '../../common/core/range.js';
import { Selection } from '../../common/core/selection.js';
import * as editorCommon from '../../common/editorCommon.js';
import { ViewModel } from '../../common/viewModel/viewModelImpl.js';
import { hash } from '../../../base/common/hash.js';
import { EditorContextKeys } from '../../common/editorContextKeys.js';
import { ModelDecorationOptions } from '../../common/model/textModel.js';
import * as modes from '../../common/modes.js';
import { Schemas } from '../../../base/common/network.js';
import { EndOfLinePreference } from '../../common/model.js';
import { INotificationService } from '../../../platform/notification/common/notification.js';
import { ICodeEditorService } from '../services/codeEditorService.js';
import { ICommandService } from '../../../platform/commands/common/commands.js';
import { IThemeService, registerThemingParticipant } from '../../../platform/theme/common/themeService.js';
import { View } from '../view/viewImpl.js';
import { EditorExtensionsRegistry } from '../editorExtensions.js';
import { InternalEditorAction } from '../../common/editorAction.js';
import { editorErrorForeground, editorErrorBorder, editorWarningForeground, editorWarningBorder, editorInfoBorder, editorInfoForeground, editorHintForeground, editorHintBorder, editorUnnecessaryCodeOpacity, editorUnnecessaryCodeBorder } from '../../common/view/editorColorRegistry.js';
import { ClassName } from '../../common/model/intervalTree.js';
var EDITOR_ID = 0;
var SHOW_UNUSED_ENABLED_CLASS = 'showUnused';
var CodeEditorWidget = /** @class */ (function (_super) {
    __extends(CodeEditorWidget, _super);
    function CodeEditorWidget(domElement, options, codeEditorWidgetOptions, instantiationService, codeEditorService, commandService, contextKeyService, themeService, notificationService) {
        var _this = _super.call(this) || this;
        //#region Eventing
        _this._onDidDispose = _this._register(new Emitter());
        _this.onDidDispose = _this._onDidDispose.event;
        _this._onDidChangeModelContent = _this._register(new Emitter());
        _this.onDidChangeModelContent = _this._onDidChangeModelContent.event;
        _this._onDidChangeModelLanguage = _this._register(new Emitter());
        _this.onDidChangeModelLanguage = _this._onDidChangeModelLanguage.event;
        _this._onDidChangeModelLanguageConfiguration = _this._register(new Emitter());
        _this.onDidChangeModelLanguageConfiguration = _this._onDidChangeModelLanguageConfiguration.event;
        _this._onDidChangeModelOptions = _this._register(new Emitter());
        _this.onDidChangeModelOptions = _this._onDidChangeModelOptions.event;
        _this._onDidChangeModelDecorations = _this._register(new Emitter());
        _this.onDidChangeModelDecorations = _this._onDidChangeModelDecorations.event;
        _this._onDidChangeConfiguration = _this._register(new Emitter());
        _this.onDidChangeConfiguration = _this._onDidChangeConfiguration.event;
        _this._onDidChangeModel = _this._register(new Emitter());
        _this.onDidChangeModel = _this._onDidChangeModel.event;
        _this._onDidChangeCursorPosition = _this._register(new Emitter());
        _this.onDidChangeCursorPosition = _this._onDidChangeCursorPosition.event;
        _this._onDidChangeCursorSelection = _this._register(new Emitter());
        _this.onDidChangeCursorSelection = _this._onDidChangeCursorSelection.event;
        _this._onDidAttemptReadOnlyEdit = _this._register(new Emitter());
        _this.onDidAttemptReadOnlyEdit = _this._onDidAttemptReadOnlyEdit.event;
        _this._onDidLayoutChange = _this._register(new Emitter());
        _this.onDidLayoutChange = _this._onDidLayoutChange.event;
        _this._editorTextFocus = _this._register(new BooleanEventEmitter());
        _this.onDidFocusEditorText = _this._editorTextFocus.onDidChangeToTrue;
        _this.onDidBlurEditorText = _this._editorTextFocus.onDidChangeToFalse;
        _this._editorWidgetFocus = _this._register(new BooleanEventEmitter());
        _this.onDidFocusEditorWidget = _this._editorWidgetFocus.onDidChangeToTrue;
        _this.onDidBlurEditorWidget = _this._editorWidgetFocus.onDidChangeToFalse;
        _this._onWillType = _this._register(new Emitter());
        _this.onWillType = _this._onWillType.event;
        _this._onDidType = _this._register(new Emitter());
        _this.onDidType = _this._onDidType.event;
        _this._onDidPaste = _this._register(new Emitter());
        _this.onDidPaste = _this._onDidPaste.event;
        _this._onMouseUp = _this._register(new Emitter());
        _this.onMouseUp = _this._onMouseUp.event;
        _this._onMouseDown = _this._register(new Emitter());
        _this.onMouseDown = _this._onMouseDown.event;
        _this._onMouseDrag = _this._register(new Emitter());
        _this.onMouseDrag = _this._onMouseDrag.event;
        _this._onMouseDrop = _this._register(new Emitter());
        _this.onMouseDrop = _this._onMouseDrop.event;
        _this._onContextMenu = _this._register(new Emitter());
        _this.onContextMenu = _this._onContextMenu.event;
        _this._onMouseMove = _this._register(new Emitter());
        _this.onMouseMove = _this._onMouseMove.event;
        _this._onMouseLeave = _this._register(new Emitter());
        _this.onMouseLeave = _this._onMouseLeave.event;
        _this._onKeyUp = _this._register(new Emitter());
        _this.onKeyUp = _this._onKeyUp.event;
        _this._onKeyDown = _this._register(new Emitter());
        _this.onKeyDown = _this._onKeyDown.event;
        _this._onDidScrollChange = _this._register(new Emitter());
        _this.onDidScrollChange = _this._onDidScrollChange.event;
        _this._onDidChangeViewZones = _this._register(new Emitter());
        _this.onDidChangeViewZones = _this._onDidChangeViewZones.event;
        _this.domElement = domElement;
        _this.id = (++EDITOR_ID);
        _this._decorationTypeKeysToIds = {};
        _this._decorationTypeSubtypes = {};
        _this.isSimpleWidget = codeEditorWidgetOptions.isSimpleWidget || false;
        _this._telemetryData = codeEditorWidgetOptions.telemetryData || null;
        options = options || {};
        _this._configuration = _this._register(_this._createConfiguration(options));
        _this._register(_this._configuration.onDidChange(function (e) {
            _this._onDidChangeConfiguration.fire(e);
            if (e.layoutInfo) {
                _this._onDidLayoutChange.fire(_this._configuration.editor.layoutInfo);
            }
            if (_this._configuration.editor.showUnused) {
                _this.domElement.classList.add(SHOW_UNUSED_ENABLED_CLASS);
            }
            else {
                _this.domElement.classList.remove(SHOW_UNUSED_ENABLED_CLASS);
            }
        }));
        _this._contextKeyService = _this._register(contextKeyService.createScoped(_this.domElement));
        _this._notificationService = notificationService;
        _this._codeEditorService = codeEditorService;
        _this._commandService = commandService;
        _this._themeService = themeService;
        _this._register(new EditorContextKeysManager(_this, _this._contextKeyService));
        _this._register(new EditorModeContext(_this, _this._contextKeyService));
        _this._instantiationService = instantiationService.createChild(new ServiceCollection([IContextKeyService, _this._contextKeyService]));
        _this._attachModel(null);
        _this._contributions = {};
        _this._actions = {};
        _this._focusTracker = new CodeEditorWidgetFocusTracker(domElement);
        _this._focusTracker.onChange(function () {
            _this._editorWidgetFocus.setValue(_this._focusTracker.hasFocus());
        });
        _this.contentWidgets = {};
        _this.overlayWidgets = {};
        var contributions = codeEditorWidgetOptions.contributions;
        if (!Array.isArray(contributions)) {
            contributions = EditorExtensionsRegistry.getEditorContributions();
        }
        for (var i = 0, len = contributions.length; i < len; i++) {
            var ctor = contributions[i];
            try {
                var contribution = _this._instantiationService.createInstance(ctor, _this);
                _this._contributions[contribution.getId()] = contribution;
            }
            catch (err) {
                onUnexpectedError(err);
            }
        }
        EditorExtensionsRegistry.getEditorActions().forEach(function (action) {
            var internalAction = new InternalEditorAction(action.id, action.label, action.alias, action.precondition, function () {
                return _this._instantiationService.invokeFunction(function (accessor) {
                    return action.runEditorCommand(accessor, _this, null);
                });
            }, _this._contextKeyService);
            _this._actions[internalAction.id] = internalAction;
        });
        _this._codeEditorService.addCodeEditor(_this);
        return _this;
    }
    CodeEditorWidget.prototype._createConfiguration = function (options) {
        return new Configuration(options, this.domElement);
    };
    CodeEditorWidget.prototype.getId = function () {
        return this.getEditorType() + ':' + this.id;
    };
    CodeEditorWidget.prototype.getEditorType = function () {
        return editorCommon.EditorType.ICodeEditor;
    };
    CodeEditorWidget.prototype.dispose = function () {
        this._codeEditorService.removeCodeEditor(this);
        this.contentWidgets = {};
        this.overlayWidgets = {};
        this._focusTracker.dispose();
        var keys = Object.keys(this._contributions);
        for (var i = 0, len = keys.length; i < len; i++) {
            var contributionId = keys[i];
            this._contributions[contributionId].dispose();
        }
        this._contributions = {};
        // editor actions don't need to be disposed
        this._actions = {};
        this._removeDecorationTypes();
        this._postDetachModelCleanup(this._detachModel());
        this._onDidDispose.fire();
        _super.prototype.dispose.call(this);
    };
    CodeEditorWidget.prototype.invokeWithinContext = function (fn) {
        return this._instantiationService.invokeFunction(fn);
    };
    CodeEditorWidget.prototype.updateOptions = function (newOptions) {
        this._configuration.updateOptions(newOptions);
    };
    CodeEditorWidget.prototype.getConfiguration = function () {
        return this._configuration.editor;
    };
    CodeEditorWidget.prototype.getRawConfiguration = function () {
        return this._configuration.getRawOptions();
    };
    CodeEditorWidget.prototype.getValue = function (options) {
        if (options === void 0) { options = null; }
        if (this.model) {
            var preserveBOM = (options && options.preserveBOM) ? true : false;
            var eolPreference = EndOfLinePreference.TextDefined;
            if (options && options.lineEnding && options.lineEnding === '\n') {
                eolPreference = EndOfLinePreference.LF;
            }
            else if (options && options.lineEnding && options.lineEnding === '\r\n') {
                eolPreference = EndOfLinePreference.CRLF;
            }
            return this.model.getValue(eolPreference, preserveBOM);
        }
        return '';
    };
    CodeEditorWidget.prototype.setValue = function (newValue) {
        if (this.model) {
            this.model.setValue(newValue);
        }
    };
    CodeEditorWidget.prototype.getModel = function () {
        return this.model;
    };
    CodeEditorWidget.prototype.setModel = function (model) {
        if (model === void 0) { model = null; }
        if (this.model === model) {
            // Current model is the new model
            return;
        }
        var detachedModel = this._detachModel();
        this._attachModel(model);
        var e = {
            oldModelUrl: detachedModel ? detachedModel.uri : null,
            newModelUrl: model ? model.uri : null
        };
        this._removeDecorationTypes();
        this._onDidChangeModel.fire(e);
        this._postDetachModelCleanup(detachedModel);
    };
    CodeEditorWidget.prototype._removeDecorationTypes = function () {
        this._decorationTypeKeysToIds = {};
        if (this._decorationTypeSubtypes) {
            for (var decorationType in this._decorationTypeSubtypes) {
                var subTypes = this._decorationTypeSubtypes[decorationType];
                for (var subType in subTypes) {
                    this._removeDecorationType(decorationType + '-' + subType);
                }
            }
            this._decorationTypeSubtypes = {};
        }
    };
    CodeEditorWidget.prototype.getVisibleRanges = function () {
        if (!this.hasView) {
            return [];
        }
        return this.viewModel.getVisibleRanges();
    };
    CodeEditorWidget.prototype.getWhitespaces = function () {
        if (!this.hasView) {
            return [];
        }
        return this.viewModel.viewLayout.getWhitespaces();
    };
    CodeEditorWidget.prototype._getVerticalOffsetForPosition = function (modelLineNumber, modelColumn) {
        var modelPosition = this.model.validatePosition({
            lineNumber: modelLineNumber,
            column: modelColumn
        });
        var viewPosition = this.viewModel.coordinatesConverter.convertModelPositionToViewPosition(modelPosition);
        return this.viewModel.viewLayout.getVerticalOffsetForLineNumber(viewPosition.lineNumber);
    };
    CodeEditorWidget.prototype.getTopForLineNumber = function (lineNumber) {
        if (!this.hasView) {
            return -1;
        }
        return this._getVerticalOffsetForPosition(lineNumber, 1);
    };
    CodeEditorWidget.prototype.getTopForPosition = function (lineNumber, column) {
        if (!this.hasView) {
            return -1;
        }
        return this._getVerticalOffsetForPosition(lineNumber, column);
    };
    CodeEditorWidget.prototype.setHiddenAreas = function (ranges) {
        if (this.viewModel) {
            this.viewModel.setHiddenAreas(ranges.map(function (r) { return Range.lift(r); }));
        }
    };
    CodeEditorWidget.prototype.getVisibleColumnFromPosition = function (rawPosition) {
        if (!this.model) {
            return rawPosition.column;
        }
        var position = this.model.validatePosition(rawPosition);
        var tabSize = this.model.getOptions().tabSize;
        return CursorColumns.visibleColumnFromColumn(this.model.getLineContent(position.lineNumber), position.column, tabSize) + 1;
    };
    CodeEditorWidget.prototype.getPosition = function () {
        if (!this.cursor) {
            return null;
        }
        return this.cursor.getPosition().clone();
    };
    CodeEditorWidget.prototype.setPosition = function (position) {
        if (!this.cursor) {
            return;
        }
        if (!Position.isIPosition(position)) {
            throw new Error('Invalid arguments');
        }
        this.cursor.setSelections('api', [{
                selectionStartLineNumber: position.lineNumber,
                selectionStartColumn: position.column,
                positionLineNumber: position.lineNumber,
                positionColumn: position.column
            }]);
    };
    CodeEditorWidget.prototype._sendRevealRange = function (modelRange, verticalType, revealHorizontal, scrollType) {
        if (!this.model || !this.cursor) {
            return;
        }
        if (!Range.isIRange(modelRange)) {
            throw new Error('Invalid arguments');
        }
        var validatedModelRange = this.model.validateRange(modelRange);
        var viewRange = this.viewModel.coordinatesConverter.convertModelRangeToViewRange(validatedModelRange);
        this.cursor.emitCursorRevealRange(viewRange, verticalType, revealHorizontal, scrollType);
    };
    CodeEditorWidget.prototype.revealLine = function (lineNumber, scrollType) {
        if (scrollType === void 0) { scrollType = 0 /* Smooth */; }
        this._revealLine(lineNumber, 0 /* Simple */, scrollType);
    };
    CodeEditorWidget.prototype.revealLineInCenter = function (lineNumber, scrollType) {
        if (scrollType === void 0) { scrollType = 0 /* Smooth */; }
        this._revealLine(lineNumber, 1 /* Center */, scrollType);
    };
    CodeEditorWidget.prototype.revealLineInCenterIfOutsideViewport = function (lineNumber, scrollType) {
        if (scrollType === void 0) { scrollType = 0 /* Smooth */; }
        this._revealLine(lineNumber, 2 /* CenterIfOutsideViewport */, scrollType);
    };
    CodeEditorWidget.prototype._revealLine = function (lineNumber, revealType, scrollType) {
        if (typeof lineNumber !== 'number') {
            throw new Error('Invalid arguments');
        }
        this._sendRevealRange(new Range(lineNumber, 1, lineNumber, 1), revealType, false, scrollType);
    };
    CodeEditorWidget.prototype.revealPosition = function (position, scrollType) {
        if (scrollType === void 0) { scrollType = 0 /* Smooth */; }
        this._revealPosition(position, 0 /* Simple */, true, scrollType);
    };
    CodeEditorWidget.prototype.revealPositionInCenter = function (position, scrollType) {
        if (scrollType === void 0) { scrollType = 0 /* Smooth */; }
        this._revealPosition(position, 1 /* Center */, true, scrollType);
    };
    CodeEditorWidget.prototype.revealPositionInCenterIfOutsideViewport = function (position, scrollType) {
        if (scrollType === void 0) { scrollType = 0 /* Smooth */; }
        this._revealPosition(position, 2 /* CenterIfOutsideViewport */, true, scrollType);
    };
    CodeEditorWidget.prototype._revealPosition = function (position, verticalType, revealHorizontal, scrollType) {
        if (!Position.isIPosition(position)) {
            throw new Error('Invalid arguments');
        }
        this._sendRevealRange(new Range(position.lineNumber, position.column, position.lineNumber, position.column), verticalType, revealHorizontal, scrollType);
    };
    CodeEditorWidget.prototype.getSelection = function () {
        if (!this.cursor) {
            return null;
        }
        return this.cursor.getSelection().clone();
    };
    CodeEditorWidget.prototype.getSelections = function () {
        if (!this.cursor) {
            return null;
        }
        var selections = this.cursor.getSelections();
        var result = [];
        for (var i = 0, len = selections.length; i < len; i++) {
            result[i] = selections[i].clone();
        }
        return result;
    };
    CodeEditorWidget.prototype.setSelection = function (something) {
        var isSelection = Selection.isISelection(something);
        var isRange = Range.isIRange(something);
        if (!isSelection && !isRange) {
            throw new Error('Invalid arguments');
        }
        if (isSelection) {
            this._setSelectionImpl(something);
        }
        else if (isRange) {
            // act as if it was an IRange
            var selection = {
                selectionStartLineNumber: something.startLineNumber,
                selectionStartColumn: something.startColumn,
                positionLineNumber: something.endLineNumber,
                positionColumn: something.endColumn
            };
            this._setSelectionImpl(selection);
        }
    };
    CodeEditorWidget.prototype._setSelectionImpl = function (sel) {
        if (!this.cursor) {
            return;
        }
        var selection = new Selection(sel.selectionStartLineNumber, sel.selectionStartColumn, sel.positionLineNumber, sel.positionColumn);
        this.cursor.setSelections('api', [selection]);
    };
    CodeEditorWidget.prototype.revealLines = function (startLineNumber, endLineNumber, scrollType) {
        if (scrollType === void 0) { scrollType = 0 /* Smooth */; }
        this._revealLines(startLineNumber, endLineNumber, 0 /* Simple */, scrollType);
    };
    CodeEditorWidget.prototype.revealLinesInCenter = function (startLineNumber, endLineNumber, scrollType) {
        if (scrollType === void 0) { scrollType = 0 /* Smooth */; }
        this._revealLines(startLineNumber, endLineNumber, 1 /* Center */, scrollType);
    };
    CodeEditorWidget.prototype.revealLinesInCenterIfOutsideViewport = function (startLineNumber, endLineNumber, scrollType) {
        if (scrollType === void 0) { scrollType = 0 /* Smooth */; }
        this._revealLines(startLineNumber, endLineNumber, 2 /* CenterIfOutsideViewport */, scrollType);
    };
    CodeEditorWidget.prototype._revealLines = function (startLineNumber, endLineNumber, verticalType, scrollType) {
        if (typeof startLineNumber !== 'number' || typeof endLineNumber !== 'number') {
            throw new Error('Invalid arguments');
        }
        this._sendRevealRange(new Range(startLineNumber, 1, endLineNumber, 1), verticalType, false, scrollType);
    };
    CodeEditorWidget.prototype.revealRange = function (range, scrollType, revealVerticalInCenter, revealHorizontal) {
        if (scrollType === void 0) { scrollType = 0 /* Smooth */; }
        if (revealVerticalInCenter === void 0) { revealVerticalInCenter = false; }
        if (revealHorizontal === void 0) { revealHorizontal = true; }
        this._revealRange(range, revealVerticalInCenter ? 1 /* Center */ : 0 /* Simple */, revealHorizontal, scrollType);
    };
    CodeEditorWidget.prototype.revealRangeInCenter = function (range, scrollType) {
        if (scrollType === void 0) { scrollType = 0 /* Smooth */; }
        this._revealRange(range, 1 /* Center */, true, scrollType);
    };
    CodeEditorWidget.prototype.revealRangeInCenterIfOutsideViewport = function (range, scrollType) {
        if (scrollType === void 0) { scrollType = 0 /* Smooth */; }
        this._revealRange(range, 2 /* CenterIfOutsideViewport */, true, scrollType);
    };
    CodeEditorWidget.prototype.revealRangeAtTop = function (range, scrollType) {
        if (scrollType === void 0) { scrollType = 0 /* Smooth */; }
        this._revealRange(range, 3 /* Top */, true, scrollType);
    };
    CodeEditorWidget.prototype._revealRange = function (range, verticalType, revealHorizontal, scrollType) {
        if (!Range.isIRange(range)) {
            throw new Error('Invalid arguments');
        }
        this._sendRevealRange(Range.lift(range), verticalType, revealHorizontal, scrollType);
    };
    CodeEditorWidget.prototype.setSelections = function (ranges) {
        if (!this.cursor) {
            return;
        }
        if (!ranges || ranges.length === 0) {
            throw new Error('Invalid arguments');
        }
        for (var i = 0, len = ranges.length; i < len; i++) {
            if (!Selection.isISelection(ranges[i])) {
                throw new Error('Invalid arguments');
            }
        }
        this.cursor.setSelections('api', ranges);
    };
    CodeEditorWidget.prototype.getScrollWidth = function () {
        if (!this.hasView) {
            return -1;
        }
        return this.viewModel.viewLayout.getScrollWidth();
    };
    CodeEditorWidget.prototype.getScrollLeft = function () {
        if (!this.hasView) {
            return -1;
        }
        return this.viewModel.viewLayout.getCurrentScrollLeft();
    };
    CodeEditorWidget.prototype.getScrollHeight = function () {
        if (!this.hasView) {
            return -1;
        }
        return this.viewModel.viewLayout.getScrollHeight();
    };
    CodeEditorWidget.prototype.getScrollTop = function () {
        if (!this.hasView) {
            return -1;
        }
        return this.viewModel.viewLayout.getCurrentScrollTop();
    };
    CodeEditorWidget.prototype.setScrollLeft = function (newScrollLeft) {
        if (!this.hasView) {
            return;
        }
        if (typeof newScrollLeft !== 'number') {
            throw new Error('Invalid arguments');
        }
        this.viewModel.viewLayout.setScrollPositionNow({
            scrollLeft: newScrollLeft
        });
    };
    CodeEditorWidget.prototype.setScrollTop = function (newScrollTop) {
        if (!this.hasView) {
            return;
        }
        if (typeof newScrollTop !== 'number') {
            throw new Error('Invalid arguments');
        }
        this.viewModel.viewLayout.setScrollPositionNow({
            scrollTop: newScrollTop
        });
    };
    CodeEditorWidget.prototype.setScrollPosition = function (position) {
        if (!this.hasView) {
            return;
        }
        this.viewModel.viewLayout.setScrollPositionNow(position);
    };
    CodeEditorWidget.prototype.saveViewState = function () {
        if (!this.cursor || !this.hasView) {
            return null;
        }
        var contributionsState = {};
        var keys = Object.keys(this._contributions);
        for (var i = 0, len = keys.length; i < len; i++) {
            var id = keys[i];
            var contribution = this._contributions[id];
            if (typeof contribution.saveViewState === 'function') {
                contributionsState[id] = contribution.saveViewState();
            }
        }
        var cursorState = this.cursor.saveState();
        var viewState = this.viewModel.saveState();
        return {
            cursorState: cursorState,
            viewState: viewState,
            contributionsState: contributionsState
        };
    };
    CodeEditorWidget.prototype.restoreViewState = function (s) {
        if (!this.cursor || !this.hasView) {
            return;
        }
        if (s && s.cursorState && s.viewState) {
            var codeEditorState = s;
            var cursorState = codeEditorState.cursorState;
            if (Array.isArray(cursorState)) {
                this.cursor.restoreState(cursorState);
            }
            else {
                // Backwards compatibility
                this.cursor.restoreState([cursorState]);
            }
            var contributionsState = s.contributionsState || {};
            var keys = Object.keys(this._contributions);
            for (var i = 0, len = keys.length; i < len; i++) {
                var id = keys[i];
                var contribution = this._contributions[id];
                if (typeof contribution.restoreViewState === 'function') {
                    contribution.restoreViewState(contributionsState[id]);
                }
            }
            var reducedState = this.viewModel.reduceRestoreState(s.viewState);
            var linesViewportData = this.viewModel.viewLayout.getLinesViewportDataAtScrollTop(reducedState.scrollTop);
            var startPosition = this.viewModel.coordinatesConverter.convertViewPositionToModelPosition(new Position(linesViewportData.startLineNumber, 1));
            var endPosition = this.viewModel.coordinatesConverter.convertViewPositionToModelPosition(new Position(linesViewportData.endLineNumber, 1));
            this.model.tokenizeViewport(startPosition.lineNumber, endPosition.lineNumber);
            this._view.restoreState(reducedState);
        }
    };
    CodeEditorWidget.prototype.onVisible = function () {
    };
    CodeEditorWidget.prototype.onHide = function () {
    };
    CodeEditorWidget.prototype.getContribution = function (id) {
        return (this._contributions[id] || null);
    };
    CodeEditorWidget.prototype.getActions = function () {
        var result = [];
        var keys = Object.keys(this._actions);
        for (var i = 0, len = keys.length; i < len; i++) {
            var id = keys[i];
            result.push(this._actions[id]);
        }
        return result;
    };
    CodeEditorWidget.prototype.getSupportedActions = function () {
        var result = this.getActions();
        result = result.filter(function (action) { return action.isSupported(); });
        return result;
    };
    CodeEditorWidget.prototype.getAction = function (id) {
        return this._actions[id] || null;
    };
    CodeEditorWidget.prototype.trigger = function (source, handlerId, payload) {
        payload = payload || {};
        // Special case for typing
        if (handlerId === editorCommon.Handler.Type) {
            if (!this.cursor || typeof payload.text !== 'string' || payload.text.length === 0) {
                // nothing to do
                return;
            }
            if (source === 'keyboard') {
                this._onWillType.fire(payload.text);
            }
            this.cursor.trigger(source, handlerId, payload);
            if (source === 'keyboard') {
                this._onDidType.fire(payload.text);
            }
            return;
        }
        // Special case for pasting
        if (handlerId === editorCommon.Handler.Paste) {
            if (!this.cursor || typeof payload.text !== 'string' || payload.text.length === 0) {
                // nothing to do
                return;
            }
            var startPosition = this.cursor.getSelection().getStartPosition();
            this.cursor.trigger(source, handlerId, payload);
            var endPosition = this.cursor.getSelection().getStartPosition();
            if (source === 'keyboard') {
                this._onDidPaste.fire(new Range(startPosition.lineNumber, startPosition.column, endPosition.lineNumber, endPosition.column));
            }
            return;
        }
        var action = this.getAction(handlerId);
        if (action) {
            TPromise.as(action.run()).then(null, onUnexpectedError);
            return;
        }
        if (!this.cursor) {
            return;
        }
        if (this._triggerEditorCommand(source, handlerId, payload)) {
            return;
        }
        this.cursor.trigger(source, handlerId, payload);
    };
    CodeEditorWidget.prototype._triggerEditorCommand = function (source, handlerId, payload) {
        var command = EditorExtensionsRegistry.getEditorCommand(handlerId);
        if (command) {
            payload = payload || {};
            payload.source = source;
            TPromise.as(command.runEditorCommand(null, this, payload)).done(null, onUnexpectedError);
            return true;
        }
        return false;
    };
    CodeEditorWidget.prototype._getCursors = function () {
        return this.cursor;
    };
    CodeEditorWidget.prototype._getCursorConfiguration = function () {
        return this.cursor.context.config;
    };
    CodeEditorWidget.prototype.pushUndoStop = function () {
        if (!this.model) {
            return false;
        }
        if (this._configuration.editor.readOnly) {
            // read only editor => sorry!
            return false;
        }
        this.model.pushStackElement();
        return true;
    };
    CodeEditorWidget.prototype.executeEdits = function (source, edits, endCursorState) {
        if (!this.cursor) {
            // no view, no cursor
            return false;
        }
        if (this._configuration.editor.readOnly) {
            // read only editor => sorry!
            return false;
        }
        this.model.pushEditOperations(this.cursor.getSelections(), edits, function () {
            return endCursorState ? endCursorState : null;
        });
        if (endCursorState) {
            this.cursor.setSelections(source, endCursorState);
        }
        return true;
    };
    CodeEditorWidget.prototype.executeCommand = function (source, command) {
        if (!this.cursor) {
            return;
        }
        this.cursor.trigger(source, editorCommon.Handler.ExecuteCommand, command);
    };
    CodeEditorWidget.prototype.executeCommands = function (source, commands) {
        if (!this.cursor) {
            return;
        }
        this.cursor.trigger(source, editorCommon.Handler.ExecuteCommands, commands);
    };
    CodeEditorWidget.prototype.changeDecorations = function (callback) {
        if (!this.model) {
            //			console.warn('Cannot change decorations on editor that is not attached to a model');
            // callback will not be called
            return null;
        }
        return this.model.changeDecorations(callback, this.id);
    };
    CodeEditorWidget.prototype.getLineDecorations = function (lineNumber) {
        if (!this.model) {
            return null;
        }
        return this.model.getLineDecorations(lineNumber, this.id, this._configuration.editor.readOnly);
    };
    CodeEditorWidget.prototype.deltaDecorations = function (oldDecorations, newDecorations) {
        if (!this.model) {
            return [];
        }
        if (oldDecorations.length === 0 && newDecorations.length === 0) {
            return oldDecorations;
        }
        return this.model.deltaDecorations(oldDecorations, newDecorations, this.id);
    };
    CodeEditorWidget.prototype.setDecorations = function (decorationTypeKey, decorationOptions) {
        var newDecorationsSubTypes = {};
        var oldDecorationsSubTypes = this._decorationTypeSubtypes[decorationTypeKey] || {};
        this._decorationTypeSubtypes[decorationTypeKey] = newDecorationsSubTypes;
        var newModelDecorations = [];
        for (var _i = 0, decorationOptions_1 = decorationOptions; _i < decorationOptions_1.length; _i++) {
            var decorationOption = decorationOptions_1[_i];
            var typeKey = decorationTypeKey;
            if (decorationOption.renderOptions) {
                // identify custom reder options by a hash code over all keys and values
                // For custom render options register a decoration type if necessary
                var subType = hash(decorationOption.renderOptions).toString(16);
                // The fact that `decorationTypeKey` appears in the typeKey has no influence
                // it is just a mechanism to get predictable and unique keys (repeatable for the same options and unique across clients)
                typeKey = decorationTypeKey + '-' + subType;
                if (!oldDecorationsSubTypes[subType] && !newDecorationsSubTypes[subType]) {
                    // decoration type did not exist before, register new one
                    this._registerDecorationType(typeKey, decorationOption.renderOptions, decorationTypeKey);
                }
                newDecorationsSubTypes[subType] = true;
            }
            var opts = this._resolveDecorationOptions(typeKey, !!decorationOption.hoverMessage);
            if (decorationOption.hoverMessage) {
                opts.hoverMessage = decorationOption.hoverMessage;
            }
            newModelDecorations.push({ range: decorationOption.range, options: opts });
        }
        // remove decoration sub types that are no longer used, deregister decoration type if necessary
        for (var subType in oldDecorationsSubTypes) {
            if (!newDecorationsSubTypes[subType]) {
                this._removeDecorationType(decorationTypeKey + '-' + subType);
            }
        }
        // update all decorations
        var oldDecorationsIds = this._decorationTypeKeysToIds[decorationTypeKey] || [];
        this._decorationTypeKeysToIds[decorationTypeKey] = this.deltaDecorations(oldDecorationsIds, newModelDecorations);
    };
    CodeEditorWidget.prototype.setDecorationsFast = function (decorationTypeKey, ranges) {
        // remove decoration sub types that are no longer used, deregister decoration type if necessary
        var oldDecorationsSubTypes = this._decorationTypeSubtypes[decorationTypeKey] || {};
        for (var subType in oldDecorationsSubTypes) {
            this._removeDecorationType(decorationTypeKey + '-' + subType);
        }
        this._decorationTypeSubtypes[decorationTypeKey] = {};
        var opts = ModelDecorationOptions.createDynamic(this._resolveDecorationOptions(decorationTypeKey, false));
        var newModelDecorations = new Array(ranges.length);
        for (var i = 0, len = ranges.length; i < len; i++) {
            newModelDecorations[i] = { range: ranges[i], options: opts };
        }
        // update all decorations
        var oldDecorationsIds = this._decorationTypeKeysToIds[decorationTypeKey] || [];
        this._decorationTypeKeysToIds[decorationTypeKey] = this.deltaDecorations(oldDecorationsIds, newModelDecorations);
    };
    CodeEditorWidget.prototype.removeDecorations = function (decorationTypeKey) {
        // remove decorations for type and sub type
        var oldDecorationsIds = this._decorationTypeKeysToIds[decorationTypeKey];
        if (oldDecorationsIds) {
            this.deltaDecorations(oldDecorationsIds, []);
        }
        if (this._decorationTypeKeysToIds.hasOwnProperty(decorationTypeKey)) {
            delete this._decorationTypeKeysToIds[decorationTypeKey];
        }
        if (this._decorationTypeSubtypes.hasOwnProperty(decorationTypeKey)) {
            delete this._decorationTypeSubtypes[decorationTypeKey];
        }
    };
    CodeEditorWidget.prototype.getLayoutInfo = function () {
        return this._configuration.editor.layoutInfo;
    };
    CodeEditorWidget.prototype.createOverviewRuler = function (cssClassName) {
        return this._view.createOverviewRuler(cssClassName);
    };
    CodeEditorWidget.prototype.getDomNode = function () {
        if (!this.hasView) {
            return null;
        }
        return this._view.domNode.domNode;
    };
    CodeEditorWidget.prototype.delegateVerticalScrollbarMouseDown = function (browserEvent) {
        if (!this.hasView) {
            return;
        }
        this._view.delegateVerticalScrollbarMouseDown(browserEvent);
    };
    CodeEditorWidget.prototype.layout = function (dimension) {
        this._configuration.observeReferenceElement(dimension);
        this.render();
    };
    CodeEditorWidget.prototype.focus = function () {
        if (!this.hasView) {
            return;
        }
        this._view.focus();
    };
    CodeEditorWidget.prototype.hasTextFocus = function () {
        return this.hasView && this._view.isFocused();
    };
    CodeEditorWidget.prototype.hasWidgetFocus = function () {
        return this._focusTracker && this._focusTracker.hasFocus();
    };
    CodeEditorWidget.prototype.addContentWidget = function (widget) {
        var widgetData = {
            widget: widget,
            position: widget.getPosition()
        };
        if (this.contentWidgets.hasOwnProperty(widget.getId())) {
            console.warn('Overwriting a content widget with the same id.');
        }
        this.contentWidgets[widget.getId()] = widgetData;
        if (this.hasView) {
            this._view.addContentWidget(widgetData);
        }
    };
    CodeEditorWidget.prototype.layoutContentWidget = function (widget) {
        var widgetId = widget.getId();
        if (this.contentWidgets.hasOwnProperty(widgetId)) {
            var widgetData = this.contentWidgets[widgetId];
            widgetData.position = widget.getPosition();
            if (this.hasView) {
                this._view.layoutContentWidget(widgetData);
            }
        }
    };
    CodeEditorWidget.prototype.removeContentWidget = function (widget) {
        var widgetId = widget.getId();
        if (this.contentWidgets.hasOwnProperty(widgetId)) {
            var widgetData = this.contentWidgets[widgetId];
            delete this.contentWidgets[widgetId];
            if (this.hasView) {
                this._view.removeContentWidget(widgetData);
            }
        }
    };
    CodeEditorWidget.prototype.addOverlayWidget = function (widget) {
        var widgetData = {
            widget: widget,
            position: widget.getPosition()
        };
        if (this.overlayWidgets.hasOwnProperty(widget.getId())) {
            console.warn('Overwriting an overlay widget with the same id.');
        }
        this.overlayWidgets[widget.getId()] = widgetData;
        if (this.hasView) {
            this._view.addOverlayWidget(widgetData);
        }
    };
    CodeEditorWidget.prototype.layoutOverlayWidget = function (widget) {
        var widgetId = widget.getId();
        if (this.overlayWidgets.hasOwnProperty(widgetId)) {
            var widgetData = this.overlayWidgets[widgetId];
            widgetData.position = widget.getPosition();
            if (this.hasView) {
                this._view.layoutOverlayWidget(widgetData);
            }
        }
    };
    CodeEditorWidget.prototype.removeOverlayWidget = function (widget) {
        var widgetId = widget.getId();
        if (this.overlayWidgets.hasOwnProperty(widgetId)) {
            var widgetData = this.overlayWidgets[widgetId];
            delete this.overlayWidgets[widgetId];
            if (this.hasView) {
                this._view.removeOverlayWidget(widgetData);
            }
        }
    };
    CodeEditorWidget.prototype.changeViewZones = function (callback) {
        if (!this.hasView) {
            return;
        }
        var hasChanges = this._view.change(callback);
        if (hasChanges) {
            this._onDidChangeViewZones.fire();
        }
    };
    CodeEditorWidget.prototype.getTargetAtClientPoint = function (clientX, clientY) {
        if (!this.hasView) {
            return null;
        }
        return this._view.getTargetAtClientPoint(clientX, clientY);
    };
    CodeEditorWidget.prototype.getScrolledVisiblePosition = function (rawPosition) {
        if (!this.hasView) {
            return null;
        }
        var position = this.model.validatePosition(rawPosition);
        var layoutInfo = this._configuration.editor.layoutInfo;
        var top = this._getVerticalOffsetForPosition(position.lineNumber, position.column) - this.getScrollTop();
        var left = this._view.getOffsetForColumn(position.lineNumber, position.column) + layoutInfo.glyphMarginWidth + layoutInfo.lineNumbersWidth + layoutInfo.decorationsWidth - this.getScrollLeft();
        return {
            top: top,
            left: left,
            height: this._configuration.editor.lineHeight
        };
    };
    CodeEditorWidget.prototype.getOffsetForColumn = function (lineNumber, column) {
        if (!this.hasView) {
            return -1;
        }
        return this._view.getOffsetForColumn(lineNumber, column);
    };
    CodeEditorWidget.prototype.render = function () {
        if (!this.hasView) {
            return;
        }
        this._view.render(true, false);
    };
    CodeEditorWidget.prototype.applyFontInfo = function (target) {
        Configuration.applyFontInfoSlow(target, this._configuration.editor.fontInfo);
    };
    CodeEditorWidget.prototype._attachModel = function (model) {
        var _this = this;
        this._view = null;
        this.model = model ? model : null;
        this.listenersToRemove = [];
        this.viewModel = null;
        this.cursor = null;
        if (this.model) {
            this.domElement.setAttribute('data-mode-id', this.model.getLanguageIdentifier().language);
            this._configuration.setIsDominatedByLongLines(this.model.isDominatedByLongLines());
            this._configuration.setMaxLineNumber(this.model.getLineCount());
            this.model.onBeforeAttached();
            this.viewModel = new ViewModel(this.id, this._configuration, this.model, function (callback) { return dom.scheduleAtNextAnimationFrame(callback); });
            this.listenersToRemove.push(this.model.onDidChangeDecorations(function (e) { return _this._onDidChangeModelDecorations.fire(e); }));
            this.listenersToRemove.push(this.model.onDidChangeLanguage(function (e) {
                if (!_this.model) {
                    return;
                }
                _this.domElement.setAttribute('data-mode-id', _this.model.getLanguageIdentifier().language);
                _this._onDidChangeModelLanguage.fire(e);
            }));
            this.listenersToRemove.push(this.model.onDidChangeLanguageConfiguration(function (e) { return _this._onDidChangeModelLanguageConfiguration.fire(e); }));
            this.listenersToRemove.push(this.model.onDidChangeContent(function (e) { return _this._onDidChangeModelContent.fire(e); }));
            this.listenersToRemove.push(this.model.onDidChangeOptions(function (e) { return _this._onDidChangeModelOptions.fire(e); }));
            // Someone might destroy the model from under the editor, so prevent any exceptions by setting a null model
            this.listenersToRemove.push(this.model.onWillDispose(function () { return _this.setModel(null); }));
            this.cursor = new Cursor(this._configuration, this.model, this.viewModel);
            this._createView();
            this.listenersToRemove.push(this.cursor.onDidReachMaxCursorCount(function () {
                _this._notificationService.warn(nls.localize('cursors.maximum', "The number of cursors has been limited to {0}.", Cursor.MAX_CURSOR_COUNT));
            }));
            this.listenersToRemove.push(this.cursor.onDidAttemptReadOnlyEdit(function () {
                _this._onDidAttemptReadOnlyEdit.fire(void 0);
            }));
            this.listenersToRemove.push(this.cursor.onDidChange(function (e) {
                var positions = [];
                for (var i = 0, len = e.selections.length; i < len; i++) {
                    positions[i] = e.selections[i].getPosition();
                }
                var e1 = {
                    position: positions[0],
                    secondaryPositions: positions.slice(1),
                    reason: e.reason,
                    source: e.source
                };
                _this._onDidChangeCursorPosition.fire(e1);
                var e2 = {
                    selection: e.selections[0],
                    secondarySelections: e.selections.slice(1),
                    source: e.source,
                    reason: e.reason
                };
                _this._onDidChangeCursorSelection.fire(e2);
            }));
        }
        else {
            this.hasView = false;
        }
        if (this._view) {
            this.domElement.appendChild(this._view.domNode.domNode);
            var keys = Object.keys(this.contentWidgets);
            for (var i = 0, len = keys.length; i < len; i++) {
                var widgetId = keys[i];
                this._view.addContentWidget(this.contentWidgets[widgetId]);
            }
            keys = Object.keys(this.overlayWidgets);
            for (var i = 0, len = keys.length; i < len; i++) {
                var widgetId = keys[i];
                this._view.addOverlayWidget(this.overlayWidgets[widgetId]);
            }
            this._view.render(false, true);
            this.hasView = true;
            this._view.domNode.domNode.setAttribute('data-uri', model.uri.toString());
        }
    };
    CodeEditorWidget.prototype._createView = function () {
        var _this = this;
        var commandDelegate;
        if (this.isSimpleWidget) {
            commandDelegate = {
                paste: function (source, text, pasteOnNewLine, multicursorText) {
                    _this.cursor.trigger(source, editorCommon.Handler.Paste, { text: text, pasteOnNewLine: pasteOnNewLine, multicursorText: multicursorText });
                },
                type: function (source, text) {
                    _this.cursor.trigger(source, editorCommon.Handler.Type, { text: text });
                },
                replacePreviousChar: function (source, text, replaceCharCnt) {
                    _this.cursor.trigger(source, editorCommon.Handler.ReplacePreviousChar, { text: text, replaceCharCnt: replaceCharCnt });
                },
                compositionStart: function (source) {
                    _this.cursor.trigger(source, editorCommon.Handler.CompositionStart, undefined);
                },
                compositionEnd: function (source) {
                    _this.cursor.trigger(source, editorCommon.Handler.CompositionEnd, undefined);
                },
                cut: function (source) {
                    _this.cursor.trigger(source, editorCommon.Handler.Cut, undefined);
                }
            };
        }
        else {
            commandDelegate = {
                paste: function (source, text, pasteOnNewLine, multicursorText) {
                    _this._commandService.executeCommand(editorCommon.Handler.Paste, {
                        text: text,
                        pasteOnNewLine: pasteOnNewLine,
                        multicursorText: multicursorText
                    });
                },
                type: function (source, text) {
                    _this._commandService.executeCommand(editorCommon.Handler.Type, {
                        text: text
                    });
                },
                replacePreviousChar: function (source, text, replaceCharCnt) {
                    _this._commandService.executeCommand(editorCommon.Handler.ReplacePreviousChar, {
                        text: text,
                        replaceCharCnt: replaceCharCnt
                    });
                },
                compositionStart: function (source) {
                    _this._commandService.executeCommand(editorCommon.Handler.CompositionStart, {});
                },
                compositionEnd: function (source) {
                    _this._commandService.executeCommand(editorCommon.Handler.CompositionEnd, {});
                },
                cut: function (source) {
                    _this._commandService.executeCommand(editorCommon.Handler.Cut, {});
                }
            };
        }
        this._view = new View(commandDelegate, this._configuration, this._themeService, this.viewModel, this.cursor, function (editorCommand, args) {
            if (!_this.cursor) {
                return;
            }
            editorCommand.runCoreEditorCommand(_this.cursor, args);
        });
        var viewEventBus = this._view.getInternalEventBus();
        viewEventBus.onDidGainFocus = function () {
            _this._editorTextFocus.setValue(true);
            // In IE, the focus is not synchronous, so we give it a little help
            _this._editorWidgetFocus.setValue(true);
        };
        viewEventBus.onDidScroll = function (e) { return _this._onDidScrollChange.fire(e); };
        viewEventBus.onDidLoseFocus = function () { return _this._editorTextFocus.setValue(false); };
        viewEventBus.onContextMenu = function (e) { return _this._onContextMenu.fire(e); };
        viewEventBus.onMouseDown = function (e) { return _this._onMouseDown.fire(e); };
        viewEventBus.onMouseUp = function (e) { return _this._onMouseUp.fire(e); };
        viewEventBus.onMouseDrag = function (e) { return _this._onMouseDrag.fire(e); };
        viewEventBus.onMouseDrop = function (e) { return _this._onMouseDrop.fire(e); };
        viewEventBus.onKeyUp = function (e) { return _this._onKeyUp.fire(e); };
        viewEventBus.onMouseMove = function (e) { return _this._onMouseMove.fire(e); };
        viewEventBus.onMouseLeave = function (e) { return _this._onMouseLeave.fire(e); };
        viewEventBus.onKeyDown = function (e) { return _this._onKeyDown.fire(e); };
    };
    CodeEditorWidget.prototype._postDetachModelCleanup = function (detachedModel) {
        if (detachedModel) {
            detachedModel.removeAllDecorationsWithOwnerId(this.id);
        }
    };
    CodeEditorWidget.prototype._detachModel = function () {
        var removeDomNode = null;
        if (this._view) {
            this._view.dispose();
            removeDomNode = this._view.domNode.domNode;
            this._view = null;
        }
        if (this.model) {
            this.model.onBeforeDetached();
        }
        this.hasView = false;
        this.listenersToRemove = dispose(this.listenersToRemove);
        if (this.cursor) {
            this.cursor.dispose();
            this.cursor = null;
        }
        if (this.viewModel) {
            this.viewModel.dispose();
            this.viewModel = null;
        }
        var result = this.model;
        this.model = null;
        this.domElement.removeAttribute('data-mode-id');
        if (removeDomNode) {
            this.domElement.removeChild(removeDomNode);
        }
        return result;
    };
    CodeEditorWidget.prototype._registerDecorationType = function (key, options, parentTypeKey) {
        this._codeEditorService.registerDecorationType(key, options, parentTypeKey);
    };
    CodeEditorWidget.prototype._removeDecorationType = function (key) {
        this._codeEditorService.removeDecorationType(key);
    };
    CodeEditorWidget.prototype._resolveDecorationOptions = function (typeKey, writable) {
        return this._codeEditorService.resolveDecorationOptions(typeKey, writable);
    };
    /* __GDPR__FRAGMENT__
        "EditorTelemetryData" : {}
    */
    CodeEditorWidget.prototype.getTelemetryData = function () {
        return this._telemetryData;
    };
    CodeEditorWidget = __decorate([
        __param(3, IInstantiationService),
        __param(4, ICodeEditorService),
        __param(5, ICommandService),
        __param(6, IContextKeyService),
        __param(7, IThemeService),
        __param(8, INotificationService)
    ], CodeEditorWidget);
    return CodeEditorWidget;
}(Disposable));
export { CodeEditorWidget };
var BooleanEventEmitter = /** @class */ (function (_super) {
    __extends(BooleanEventEmitter, _super);
    function BooleanEventEmitter() {
        var _this = _super.call(this) || this;
        _this._onDidChangeToTrue = _this._register(new Emitter());
        _this.onDidChangeToTrue = _this._onDidChangeToTrue.event;
        _this._onDidChangeToFalse = _this._register(new Emitter());
        _this.onDidChangeToFalse = _this._onDidChangeToFalse.event;
        _this._value = 0 /* NotSet */;
        return _this;
    }
    BooleanEventEmitter.prototype.setValue = function (_value) {
        var value = (_value ? 2 /* True */ : 1 /* False */);
        if (this._value === value) {
            return;
        }
        this._value = value;
        if (this._value === 2 /* True */) {
            this._onDidChangeToTrue.fire();
        }
        else if (this._value === 1 /* False */) {
            this._onDidChangeToFalse.fire();
        }
    };
    return BooleanEventEmitter;
}(Disposable));
export { BooleanEventEmitter };
var EditorContextKeysManager = /** @class */ (function (_super) {
    __extends(EditorContextKeysManager, _super);
    function EditorContextKeysManager(editor, contextKeyService) {
        var _this = _super.call(this) || this;
        _this._editor = editor;
        contextKeyService.createKey('editorId', editor.getId());
        _this._editorFocus = EditorContextKeys.focus.bindTo(contextKeyService);
        _this._textInputFocus = EditorContextKeys.textInputFocus.bindTo(contextKeyService);
        _this._editorTextFocus = EditorContextKeys.editorTextFocus.bindTo(contextKeyService);
        _this._editorTabMovesFocus = EditorContextKeys.tabMovesFocus.bindTo(contextKeyService);
        _this._editorReadonly = EditorContextKeys.readOnly.bindTo(contextKeyService);
        _this._hasMultipleSelections = EditorContextKeys.hasMultipleSelections.bindTo(contextKeyService);
        _this._hasNonEmptySelection = EditorContextKeys.hasNonEmptySelection.bindTo(contextKeyService);
        _this._register(_this._editor.onDidChangeConfiguration(function () { return _this._updateFromConfig(); }));
        _this._register(_this._editor.onDidChangeCursorSelection(function () { return _this._updateFromSelection(); }));
        _this._register(_this._editor.onDidFocusEditorWidget(function () { return _this._updateFromFocus(); }));
        _this._register(_this._editor.onDidBlurEditorWidget(function () { return _this._updateFromFocus(); }));
        _this._register(_this._editor.onDidFocusEditorText(function () { return _this._updateFromFocus(); }));
        _this._register(_this._editor.onDidBlurEditorText(function () { return _this._updateFromFocus(); }));
        _this._updateFromConfig();
        _this._updateFromSelection();
        _this._updateFromFocus();
        return _this;
    }
    EditorContextKeysManager.prototype._updateFromConfig = function () {
        var config = this._editor.getConfiguration();
        this._editorTabMovesFocus.set(config.tabFocusMode);
        this._editorReadonly.set(config.readOnly);
    };
    EditorContextKeysManager.prototype._updateFromSelection = function () {
        var selections = this._editor.getSelections();
        if (!selections) {
            this._hasMultipleSelections.reset();
            this._hasNonEmptySelection.reset();
        }
        else {
            this._hasMultipleSelections.set(selections.length > 1);
            this._hasNonEmptySelection.set(selections.some(function (s) { return !s.isEmpty(); }));
        }
    };
    EditorContextKeysManager.prototype._updateFromFocus = function () {
        this._editorFocus.set(this._editor.hasWidgetFocus() && !this._editor.isSimpleWidget);
        this._editorTextFocus.set(this._editor.hasTextFocus() && !this._editor.isSimpleWidget);
        this._textInputFocus.set(this._editor.hasTextFocus());
    };
    return EditorContextKeysManager;
}(Disposable));
var EditorModeContext = /** @class */ (function (_super) {
    __extends(EditorModeContext, _super);
    function EditorModeContext(editor, contextKeyService) {
        var _this = _super.call(this) || this;
        _this._editor = editor;
        _this._langId = EditorContextKeys.languageId.bindTo(contextKeyService);
        _this._hasCompletionItemProvider = EditorContextKeys.hasCompletionItemProvider.bindTo(contextKeyService);
        _this._hasCodeActionsProvider = EditorContextKeys.hasCodeActionsProvider.bindTo(contextKeyService);
        _this._hasCodeLensProvider = EditorContextKeys.hasCodeLensProvider.bindTo(contextKeyService);
        _this._hasDefinitionProvider = EditorContextKeys.hasDefinitionProvider.bindTo(contextKeyService);
        _this._hasImplementationProvider = EditorContextKeys.hasImplementationProvider.bindTo(contextKeyService);
        _this._hasTypeDefinitionProvider = EditorContextKeys.hasTypeDefinitionProvider.bindTo(contextKeyService);
        _this._hasHoverProvider = EditorContextKeys.hasHoverProvider.bindTo(contextKeyService);
        _this._hasDocumentHighlightProvider = EditorContextKeys.hasDocumentHighlightProvider.bindTo(contextKeyService);
        _this._hasDocumentSymbolProvider = EditorContextKeys.hasDocumentSymbolProvider.bindTo(contextKeyService);
        _this._hasReferenceProvider = EditorContextKeys.hasReferenceProvider.bindTo(contextKeyService);
        _this._hasRenameProvider = EditorContextKeys.hasRenameProvider.bindTo(contextKeyService);
        _this._hasDocumentFormattingProvider = EditorContextKeys.hasDocumentFormattingProvider.bindTo(contextKeyService);
        _this._hasDocumentSelectionFormattingProvider = EditorContextKeys.hasDocumentSelectionFormattingProvider.bindTo(contextKeyService);
        _this._hasSignatureHelpProvider = EditorContextKeys.hasSignatureHelpProvider.bindTo(contextKeyService);
        _this._isInWalkThrough = EditorContextKeys.isInEmbeddedEditor.bindTo(contextKeyService);
        var update = function () { return _this._update(); };
        // update when model/mode changes
        _this._register(editor.onDidChangeModel(update));
        _this._register(editor.onDidChangeModelLanguage(update));
        // update when registries change
        _this._register(modes.SuggestRegistry.onDidChange(update));
        _this._register(modes.CodeActionProviderRegistry.onDidChange(update));
        _this._register(modes.CodeLensProviderRegistry.onDidChange(update));
        _this._register(modes.DefinitionProviderRegistry.onDidChange(update));
        _this._register(modes.ImplementationProviderRegistry.onDidChange(update));
        _this._register(modes.TypeDefinitionProviderRegistry.onDidChange(update));
        _this._register(modes.HoverProviderRegistry.onDidChange(update));
        _this._register(modes.DocumentHighlightProviderRegistry.onDidChange(update));
        _this._register(modes.DocumentSymbolProviderRegistry.onDidChange(update));
        _this._register(modes.ReferenceProviderRegistry.onDidChange(update));
        _this._register(modes.RenameProviderRegistry.onDidChange(update));
        _this._register(modes.DocumentFormattingEditProviderRegistry.onDidChange(update));
        _this._register(modes.DocumentRangeFormattingEditProviderRegistry.onDidChange(update));
        _this._register(modes.SignatureHelpProviderRegistry.onDidChange(update));
        update();
        return _this;
    }
    EditorModeContext.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
    };
    EditorModeContext.prototype.reset = function () {
        this._langId.reset();
        this._hasCompletionItemProvider.reset();
        this._hasCodeActionsProvider.reset();
        this._hasCodeLensProvider.reset();
        this._hasDefinitionProvider.reset();
        this._hasImplementationProvider.reset();
        this._hasTypeDefinitionProvider.reset();
        this._hasHoverProvider.reset();
        this._hasDocumentHighlightProvider.reset();
        this._hasDocumentSymbolProvider.reset();
        this._hasReferenceProvider.reset();
        this._hasRenameProvider.reset();
        this._hasDocumentFormattingProvider.reset();
        this._hasDocumentSelectionFormattingProvider.reset();
        this._hasSignatureHelpProvider.reset();
        this._isInWalkThrough.reset();
    };
    EditorModeContext.prototype._update = function () {
        var model = this._editor.getModel();
        if (!model) {
            this.reset();
            return;
        }
        this._langId.set(model.getLanguageIdentifier().language);
        this._hasCompletionItemProvider.set(modes.SuggestRegistry.has(model));
        this._hasCodeActionsProvider.set(modes.CodeActionProviderRegistry.has(model));
        this._hasCodeLensProvider.set(modes.CodeLensProviderRegistry.has(model));
        this._hasDefinitionProvider.set(modes.DefinitionProviderRegistry.has(model));
        this._hasImplementationProvider.set(modes.ImplementationProviderRegistry.has(model));
        this._hasTypeDefinitionProvider.set(modes.TypeDefinitionProviderRegistry.has(model));
        this._hasHoverProvider.set(modes.HoverProviderRegistry.has(model));
        this._hasDocumentHighlightProvider.set(modes.DocumentHighlightProviderRegistry.has(model));
        this._hasDocumentSymbolProvider.set(modes.DocumentSymbolProviderRegistry.has(model));
        this._hasReferenceProvider.set(modes.ReferenceProviderRegistry.has(model));
        this._hasRenameProvider.set(modes.RenameProviderRegistry.has(model));
        this._hasSignatureHelpProvider.set(modes.SignatureHelpProviderRegistry.has(model));
        this._hasDocumentFormattingProvider.set(modes.DocumentFormattingEditProviderRegistry.has(model) || modes.DocumentRangeFormattingEditProviderRegistry.has(model));
        this._hasDocumentSelectionFormattingProvider.set(modes.DocumentRangeFormattingEditProviderRegistry.has(model));
        this._isInWalkThrough.set(model.uri.scheme === Schemas.walkThroughSnippet);
    };
    return EditorModeContext;
}(Disposable));
export { EditorModeContext };
var CodeEditorWidgetFocusTracker = /** @class */ (function (_super) {
    __extends(CodeEditorWidgetFocusTracker, _super);
    function CodeEditorWidgetFocusTracker(domElement) {
        var _this = _super.call(this) || this;
        _this._onChange = _this._register(new Emitter());
        _this.onChange = _this._onChange.event;
        _this._hasFocus = false;
        _this._domFocusTracker = _this._register(dom.trackFocus(domElement));
        _this._register(_this._domFocusTracker.onDidFocus(function () {
            _this._hasFocus = true;
            _this._onChange.fire(void 0);
        }));
        _this._register(_this._domFocusTracker.onDidBlur(function () {
            _this._hasFocus = false;
            _this._onChange.fire(void 0);
        }));
        return _this;
    }
    CodeEditorWidgetFocusTracker.prototype.hasFocus = function () {
        return this._hasFocus;
    };
    return CodeEditorWidgetFocusTracker;
}(Disposable));
var squigglyStart = encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 6 3' enable-background='new 0 0 6 3' height='3' width='6'><g fill='");
var squigglyEnd = encodeURIComponent("'><polygon points='5.5,0 2.5,3 1.1,3 4.1,0'/><polygon points='4,0 6,2 6,0.6 5.4,0'/><polygon points='0,2 1,3 2.4,3 0,0.6'/></g></svg>");
function getSquigglySVGData(color) {
    return squigglyStart + encodeURIComponent(color.toString()) + squigglyEnd;
}
var dotdotdotStart = encodeURIComponent("<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"3\" width=\"12\"><g fill=\"");
var dotdotdotEnd = encodeURIComponent("\"><circle cx=\"1\" cy=\"1\" r=\"1\"/><circle cx=\"5\" cy=\"1\" r=\"1\"/><circle cx=\"9\" cy=\"1\" r=\"1\"/></g></svg>");
function getDotDotDotSVGData(color) {
    return dotdotdotStart + encodeURIComponent(color.toString()) + dotdotdotEnd;
}
registerThemingParticipant(function (theme, collector) {
    var errorBorderColor = theme.getColor(editorErrorBorder);
    if (errorBorderColor) {
        collector.addRule(".monaco-editor ." + ClassName.EditorErrorDecoration + " { border-bottom: 4px double " + errorBorderColor + "; }");
    }
    var errorForeground = theme.getColor(editorErrorForeground);
    if (errorForeground) {
        collector.addRule(".monaco-editor ." + ClassName.EditorErrorDecoration + " { background: url(\"data:image/svg+xml," + getSquigglySVGData(errorForeground) + "\") repeat-x bottom left; }");
    }
    var warningBorderColor = theme.getColor(editorWarningBorder);
    if (warningBorderColor) {
        collector.addRule(".monaco-editor ." + ClassName.EditorWarningDecoration + " { border-bottom: 4px double " + warningBorderColor + "; }");
    }
    var warningForeground = theme.getColor(editorWarningForeground);
    if (warningForeground) {
        collector.addRule(".monaco-editor ." + ClassName.EditorWarningDecoration + " { background: url(\"data:image/svg+xml," + getSquigglySVGData(warningForeground) + "\") repeat-x bottom left; }");
    }
    var infoBorderColor = theme.getColor(editorInfoBorder);
    if (infoBorderColor) {
        collector.addRule(".monaco-editor ." + ClassName.EditorInfoDecoration + " { border-bottom: 4px double " + infoBorderColor + "; }");
    }
    var infoForeground = theme.getColor(editorInfoForeground);
    if (infoForeground) {
        collector.addRule(".monaco-editor ." + ClassName.EditorInfoDecoration + " { background: url(\"data:image/svg+xml," + getSquigglySVGData(infoForeground) + "\") repeat-x bottom left; }");
    }
    var hintBorderColor = theme.getColor(editorHintBorder);
    if (hintBorderColor) {
        collector.addRule(".monaco-editor ." + ClassName.EditorHintDecoration + " { border-bottom: 2px dotted " + hintBorderColor + "; }");
    }
    var hintForeground = theme.getColor(editorHintForeground);
    if (hintForeground) {
        collector.addRule(".monaco-editor ." + ClassName.EditorHintDecoration + " { background: url(\"data:image/svg+xml," + getDotDotDotSVGData(hintForeground) + "\") no-repeat bottom left; }");
    }
    var unnecessaryForeground = theme.getColor(editorUnnecessaryCodeOpacity);
    if (unnecessaryForeground) {
        collector.addRule("." + SHOW_UNUSED_ENABLED_CLASS + " .monaco-editor ." + ClassName.EditorUnnecessaryInlineDecoration + " { opacity: " + unnecessaryForeground.rgba.a + "; }");
    }
    var unnecessaryBorder = theme.getColor(editorUnnecessaryCodeBorder);
    if (unnecessaryBorder) {
        collector.addRule("." + SHOW_UNUSED_ENABLED_CLASS + " .monaco-editor ." + ClassName.EditorUnnecessaryDecoration + " { border-bottom: 2px dashed " + unnecessaryBorder + "; }");
    }
});
