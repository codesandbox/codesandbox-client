/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Emitter } from '../../../base/common/event.js';
import { dispose } from '../../../base/common/lifecycle.js';
import { TextEditorCursorStyle, cursorStyleToString } from '../../../editor/common/config/editorOptions.js';
import { Range } from '../../../editor/common/core/range.js';
import { Selection } from '../../../editor/common/core/selection.js';
import { SnippetController2 } from '../../../editor/contrib/snippet/snippetController2.js';
import { TextEditorRevealType } from '../node/extHost.protocol.js';
import { EndOfLine, TextEditorLineNumbersStyle } from '../node/extHostTypes.js';
var MainThreadTextEditorProperties = /** @class */ (function () {
    function MainThreadTextEditorProperties(selections, options, visibleRanges) {
        this.selections = selections;
        this.options = options;
        this.visibleRanges = visibleRanges;
    }
    MainThreadTextEditorProperties.readFromEditor = function (previousProperties, model, codeEditor) {
        var selections = MainThreadTextEditorProperties._readSelectionsFromCodeEditor(previousProperties, codeEditor);
        var options = MainThreadTextEditorProperties._readOptionsFromCodeEditor(previousProperties, model, codeEditor);
        var visibleRanges = MainThreadTextEditorProperties._readVisibleRangesFromCodeEditor(previousProperties, codeEditor);
        return new MainThreadTextEditorProperties(selections, options, visibleRanges);
    };
    MainThreadTextEditorProperties._readSelectionsFromCodeEditor = function (previousProperties, codeEditor) {
        var result = null;
        if (codeEditor) {
            result = codeEditor.getSelections();
        }
        if (!result && previousProperties) {
            result = previousProperties.selections;
        }
        if (!result) {
            result = [new Selection(1, 1, 1, 1)];
        }
        return result;
    };
    MainThreadTextEditorProperties._readOptionsFromCodeEditor = function (previousProperties, model, codeEditor) {
        if (model.isDisposed()) {
            // shutdown time
            return previousProperties.options;
        }
        var cursorStyle;
        var lineNumbers;
        if (codeEditor) {
            var codeEditorOpts = codeEditor.getConfiguration();
            cursorStyle = codeEditorOpts.viewInfo.cursorStyle;
            switch (codeEditorOpts.viewInfo.renderLineNumbers) {
                case 0 /* Off */:
                    lineNumbers = TextEditorLineNumbersStyle.Off;
                    break;
                case 2 /* Relative */:
                    lineNumbers = TextEditorLineNumbersStyle.Relative;
                    break;
                default:
                    lineNumbers = TextEditorLineNumbersStyle.On;
                    break;
            }
        }
        else if (previousProperties) {
            cursorStyle = previousProperties.options.cursorStyle;
            lineNumbers = previousProperties.options.lineNumbers;
        }
        else {
            cursorStyle = TextEditorCursorStyle.Line;
            lineNumbers = TextEditorLineNumbersStyle.On;
        }
        var modelOptions = model.getOptions();
        return {
            insertSpaces: modelOptions.insertSpaces,
            tabSize: modelOptions.tabSize,
            cursorStyle: cursorStyle,
            lineNumbers: lineNumbers
        };
    };
    MainThreadTextEditorProperties._readVisibleRangesFromCodeEditor = function (previousProperties, codeEditor) {
        if (codeEditor) {
            return codeEditor.getVisibleRanges();
        }
        return [];
    };
    MainThreadTextEditorProperties.prototype.generateDelta = function (oldProps, selectionChangeSource) {
        var delta = {
            options: null,
            selections: null,
            visibleRanges: null
        };
        if (!oldProps || !MainThreadTextEditorProperties._selectionsEqual(oldProps.selections, this.selections)) {
            delta.selections = {
                selections: this.selections,
                source: selectionChangeSource
            };
        }
        if (!oldProps || !MainThreadTextEditorProperties._optionsEqual(oldProps.options, this.options)) {
            delta.options = this.options;
        }
        if (!oldProps || !MainThreadTextEditorProperties._rangesEqual(oldProps.visibleRanges, this.visibleRanges)) {
            delta.visibleRanges = this.visibleRanges;
        }
        if (delta.selections || delta.options || delta.visibleRanges) {
            // something changed
            return delta;
        }
        // nothing changed
        return null;
    };
    MainThreadTextEditorProperties._selectionsEqual = function (a, b) {
        if (a.length !== b.length) {
            return false;
        }
        for (var i = 0; i < a.length; i++) {
            if (!a[i].equalsSelection(b[i])) {
                return false;
            }
        }
        return true;
    };
    MainThreadTextEditorProperties._rangesEqual = function (a, b) {
        if (a.length !== b.length) {
            return false;
        }
        for (var i = 0; i < a.length; i++) {
            if (!a[i].equalsRange(b[i])) {
                return false;
            }
        }
        return true;
    };
    MainThreadTextEditorProperties._optionsEqual = function (a, b) {
        if (a && !b || !a && b) {
            return false;
        }
        if (!a && !b) {
            return true;
        }
        return (a.tabSize === b.tabSize
            && a.insertSpaces === b.insertSpaces
            && a.cursorStyle === b.cursorStyle
            && a.lineNumbers === b.lineNumbers);
    };
    return MainThreadTextEditorProperties;
}());
export { MainThreadTextEditorProperties };
/**
 * Text Editor that is permanently bound to the same model.
 * It can be bound or not to a CodeEditor.
 */
var MainThreadTextEditor = /** @class */ (function () {
    function MainThreadTextEditor(id, model, codeEditor, focusTracker, modelService) {
        var _this = this;
        this._id = id;
        this._model = model;
        this._codeEditor = null;
        this._focusTracker = focusTracker;
        this._modelService = modelService;
        this._codeEditorListeners = [];
        this._properties = null;
        this._onPropertiesChanged = new Emitter();
        this._modelListeners = [];
        this._modelListeners.push(this._model.onDidChangeOptions(function (e) {
            _this._updatePropertiesNow(null);
        }));
        this.setCodeEditor(codeEditor);
        this._updatePropertiesNow(null);
    }
    MainThreadTextEditor.prototype.dispose = function () {
        this._model = null;
        this._modelListeners = dispose(this._modelListeners);
        this._codeEditor = null;
        this._codeEditorListeners = dispose(this._codeEditorListeners);
    };
    MainThreadTextEditor.prototype._updatePropertiesNow = function (selectionChangeSource) {
        this._setProperties(MainThreadTextEditorProperties.readFromEditor(this._properties, this._model, this._codeEditor), selectionChangeSource);
    };
    MainThreadTextEditor.prototype._setProperties = function (newProperties, selectionChangeSource) {
        var delta = newProperties.generateDelta(this._properties, selectionChangeSource);
        this._properties = newProperties;
        if (delta) {
            this._onPropertiesChanged.fire(delta);
        }
    };
    MainThreadTextEditor.prototype.getId = function () {
        return this._id;
    };
    MainThreadTextEditor.prototype.getModel = function () {
        return this._model;
    };
    MainThreadTextEditor.prototype.getCodeEditor = function () {
        return this._codeEditor;
    };
    MainThreadTextEditor.prototype.hasCodeEditor = function (codeEditor) {
        return (this._codeEditor === codeEditor);
    };
    MainThreadTextEditor.prototype.setCodeEditor = function (codeEditor) {
        var _this = this;
        if (this.hasCodeEditor(codeEditor)) {
            // Nothing to do...
            return;
        }
        this._codeEditorListeners = dispose(this._codeEditorListeners);
        this._codeEditor = codeEditor;
        if (this._codeEditor) {
            // Catch early the case that this code editor gets a different model set and disassociate from this model
            this._codeEditorListeners.push(this._codeEditor.onDidChangeModel(function () {
                _this.setCodeEditor(null);
            }));
            this._codeEditorListeners.push(this._codeEditor.onDidFocusEditorWidget(function () {
                _this._focusTracker.onGainedFocus();
            }));
            this._codeEditorListeners.push(this._codeEditor.onDidBlurEditorWidget(function () {
                _this._focusTracker.onLostFocus();
            }));
            this._codeEditorListeners.push(this._codeEditor.onDidChangeCursorSelection(function (e) {
                // selection
                _this._updatePropertiesNow(e.source);
            }));
            this._codeEditorListeners.push(this._codeEditor.onDidChangeConfiguration(function () {
                // options
                _this._updatePropertiesNow(null);
            }));
            this._codeEditorListeners.push(this._codeEditor.onDidLayoutChange(function () {
                // visibleRanges
                _this._updatePropertiesNow(null);
            }));
            this._codeEditorListeners.push(this._codeEditor.onDidScrollChange(function () {
                // visibleRanges
                _this._updatePropertiesNow(null);
            }));
            this._updatePropertiesNow(null);
        }
    };
    MainThreadTextEditor.prototype.isVisible = function () {
        return !!this._codeEditor;
    };
    MainThreadTextEditor.prototype.getProperties = function () {
        return this._properties;
    };
    Object.defineProperty(MainThreadTextEditor.prototype, "onPropertiesChanged", {
        get: function () {
            return this._onPropertiesChanged.event;
        },
        enumerable: true,
        configurable: true
    });
    MainThreadTextEditor.prototype.setSelections = function (selections) {
        if (this._codeEditor) {
            this._codeEditor.setSelections(selections);
            return;
        }
        var newSelections = selections.map(Selection.liftSelection);
        this._setProperties(new MainThreadTextEditorProperties(newSelections, this._properties.options, this._properties.visibleRanges), null);
    };
    MainThreadTextEditor.prototype._setIndentConfiguration = function (newConfiguration) {
        if (newConfiguration.tabSize === 'auto' || newConfiguration.insertSpaces === 'auto') {
            // one of the options was set to 'auto' => detect indentation
            var creationOpts = this._modelService.getCreationOptions(this._model.getLanguageIdentifier().language, this._model.uri, this._model.isForSimpleWidget);
            var insertSpaces = creationOpts.insertSpaces;
            var tabSize = creationOpts.tabSize;
            if (newConfiguration.insertSpaces !== 'auto' && typeof newConfiguration.insertSpaces !== 'undefined') {
                insertSpaces = newConfiguration.insertSpaces;
            }
            if (newConfiguration.tabSize !== 'auto' && typeof newConfiguration.tabSize !== 'undefined') {
                tabSize = newConfiguration.tabSize;
            }
            this._model.detectIndentation(insertSpaces, tabSize);
            return;
        }
        var newOpts = {};
        if (typeof newConfiguration.insertSpaces !== 'undefined') {
            newOpts.insertSpaces = newConfiguration.insertSpaces;
        }
        if (typeof newConfiguration.tabSize !== 'undefined') {
            newOpts.tabSize = newConfiguration.tabSize;
        }
        this._model.updateOptions(newOpts);
    };
    MainThreadTextEditor.prototype.setConfiguration = function (newConfiguration) {
        this._setIndentConfiguration(newConfiguration);
        if (!this._codeEditor) {
            return;
        }
        if (newConfiguration.cursorStyle) {
            var newCursorStyle = cursorStyleToString(newConfiguration.cursorStyle);
            this._codeEditor.updateOptions({
                cursorStyle: newCursorStyle
            });
        }
        if (typeof newConfiguration.lineNumbers !== 'undefined') {
            var lineNumbers = void 0;
            switch (newConfiguration.lineNumbers) {
                case TextEditorLineNumbersStyle.On:
                    lineNumbers = 'on';
                    break;
                case TextEditorLineNumbersStyle.Relative:
                    lineNumbers = 'relative';
                    break;
                default:
                    lineNumbers = 'off';
            }
            this._codeEditor.updateOptions({
                lineNumbers: lineNumbers
            });
        }
    };
    MainThreadTextEditor.prototype.setDecorations = function (key, ranges) {
        if (!this._codeEditor) {
            return;
        }
        this._codeEditor.setDecorations(key, ranges);
    };
    MainThreadTextEditor.prototype.setDecorationsFast = function (key, _ranges) {
        if (!this._codeEditor) {
            return;
        }
        var ranges = [];
        for (var i = 0, len = Math.floor(_ranges.length / 4); i < len; i++) {
            ranges[i] = new Range(_ranges[4 * i], _ranges[4 * i + 1], _ranges[4 * i + 2], _ranges[4 * i + 3]);
        }
        this._codeEditor.setDecorationsFast(key, ranges);
    };
    MainThreadTextEditor.prototype.revealRange = function (range, revealType) {
        if (!this._codeEditor) {
            return;
        }
        switch (revealType) {
            case TextEditorRevealType.Default:
                this._codeEditor.revealRange(range, 0 /* Smooth */);
                break;
            case TextEditorRevealType.InCenter:
                this._codeEditor.revealRangeInCenter(range, 0 /* Smooth */);
                break;
            case TextEditorRevealType.InCenterIfOutsideViewport:
                this._codeEditor.revealRangeInCenterIfOutsideViewport(range, 0 /* Smooth */);
                break;
            case TextEditorRevealType.AtTop:
                this._codeEditor.revealRangeAtTop(range, 0 /* Smooth */);
                break;
            default:
                console.warn("Unknown revealType: " + revealType);
                break;
        }
    };
    MainThreadTextEditor.prototype.isFocused = function () {
        if (this._codeEditor) {
            return this._codeEditor.hasTextFocus();
        }
        return false;
    };
    MainThreadTextEditor.prototype.matches = function (editor) {
        if (!editor) {
            return false;
        }
        return editor.getControl() === this._codeEditor;
    };
    MainThreadTextEditor.prototype.applyEdits = function (versionIdCheck, edits, opts) {
        if (this._model.getVersionId() !== versionIdCheck) {
            // throw new Error('Model has changed in the meantime!');
            // model changed in the meantime
            return false;
        }
        if (!this._codeEditor) {
            // console.warn('applyEdits on invisible editor');
            return false;
        }
        if (opts.setEndOfLine === EndOfLine.CRLF) {
            this._model.pushEOL(1 /* CRLF */);
        }
        else if (opts.setEndOfLine === EndOfLine.LF) {
            this._model.pushEOL(0 /* LF */);
        }
        var transformedEdits = edits.map(function (edit) {
            return {
                range: Range.lift(edit.range),
                text: edit.text,
                forceMoveMarkers: edit.forceMoveMarkers
            };
        });
        if (opts.undoStopBefore) {
            this._codeEditor.pushUndoStop();
        }
        this._codeEditor.executeEdits('MainThreadTextEditor', transformedEdits);
        if (opts.undoStopAfter) {
            this._codeEditor.pushUndoStop();
        }
        return true;
    };
    MainThreadTextEditor.prototype.insertSnippet = function (template, ranges, opts) {
        if (!this._codeEditor) {
            return false;
        }
        var snippetController = SnippetController2.get(this._codeEditor);
        // // cancel previous snippet mode
        // snippetController.leaveSnippet();
        // set selection, focus editor
        var selections = ranges.map(function (r) { return new Selection(r.startLineNumber, r.startColumn, r.endLineNumber, r.endColumn); });
        this._codeEditor.setSelections(selections);
        this._codeEditor.focus();
        // make modifications
        snippetController.insert(template, 0, 0, opts.undoStopBefore, opts.undoStopAfter);
        return true;
    };
    return MainThreadTextEditor;
}());
export { MainThreadTextEditor };
