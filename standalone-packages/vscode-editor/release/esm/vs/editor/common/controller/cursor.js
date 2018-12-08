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
import * as nls from '../../../nls.js';
import { onUnexpectedError } from '../../../base/common/errors.js';
import { Emitter } from '../../../base/common/event.js';
import * as strings from '../../../base/common/strings.js';
import { CursorCollection } from './cursorCollection.js';
import { CursorColumns, CursorConfiguration, CursorContext, CursorState, EditOperationResult } from './cursorCommon.js';
import { DeleteOperations } from './cursorDeleteOperations.js';
import { TypeOperations } from './cursorTypeOperations.js';
import { Range } from '../core/range.js';
import { Selection } from '../core/selection.js';
import * as editorCommon from '../editorCommon.js';
import * as viewEvents from '../view/viewEvents.js';
function containsLineMappingChanged(events) {
    for (var i = 0, len = events.length; i < len; i++) {
        if (events[i].type === 6 /* ViewLineMappingChanged */) {
            return true;
        }
    }
    return false;
}
var CursorStateChangedEvent = /** @class */ (function () {
    function CursorStateChangedEvent(selections, source, reason) {
        this.selections = selections;
        this.source = source;
        this.reason = reason;
    }
    return CursorStateChangedEvent;
}());
export { CursorStateChangedEvent };
/**
 * A snapshot of the cursor and the model state
 */
var CursorModelState = /** @class */ (function () {
    function CursorModelState(model, cursor) {
        this.modelVersionId = model.getVersionId();
        this.cursorState = cursor.getAll();
    }
    CursorModelState.prototype.equals = function (other) {
        if (!other) {
            return false;
        }
        if (this.modelVersionId !== other.modelVersionId) {
            return false;
        }
        if (this.cursorState.length !== other.cursorState.length) {
            return false;
        }
        for (var i = 0, len = this.cursorState.length; i < len; i++) {
            if (!this.cursorState[i].equals(other.cursorState[i])) {
                return false;
            }
        }
        return true;
    };
    return CursorModelState;
}());
export { CursorModelState };
var Cursor = /** @class */ (function (_super) {
    __extends(Cursor, _super);
    function Cursor(configuration, model, viewModel) {
        var _this = _super.call(this) || this;
        _this._onDidReachMaxCursorCount = _this._register(new Emitter());
        _this.onDidReachMaxCursorCount = _this._onDidReachMaxCursorCount.event;
        _this._onDidAttemptReadOnlyEdit = _this._register(new Emitter());
        _this.onDidAttemptReadOnlyEdit = _this._onDidAttemptReadOnlyEdit.event;
        _this._onDidChange = _this._register(new Emitter());
        _this.onDidChange = _this._onDidChange.event;
        _this._configuration = configuration;
        _this._model = model;
        _this._knownModelVersionId = _this._model.getVersionId();
        _this._viewModel = viewModel;
        _this.context = new CursorContext(_this._configuration, _this._model, _this._viewModel);
        _this._cursors = new CursorCollection(_this.context);
        _this._isHandling = false;
        _this._isDoingComposition = false;
        _this._columnSelectData = null;
        _this._prevEditOperationType = 0 /* Other */;
        _this._register(_this._model.onDidChangeRawContent(function (e) {
            _this._knownModelVersionId = e.versionId;
            if (_this._isHandling) {
                return;
            }
            var hadFlushEvent = e.containsEvent(1 /* Flush */);
            _this._onModelContentChanged(hadFlushEvent);
        }));
        _this._register(viewModel.addEventListener(function (events) {
            if (!containsLineMappingChanged(events)) {
                return;
            }
            if (_this._knownModelVersionId !== _this._model.getVersionId()) {
                // There are model change events that I didn't yet receive.
                //
                // This can happen when editing the model, and the view model receives the change events first,
                // and the view model emits line mapping changed events, all before the cursor gets a chance to
                // recover from markers.
                //
                // The model change listener above will be called soon and we'll ensure a valid cursor state there.
                return;
            }
            // Ensure valid state
            _this.setStates('viewModel', 0 /* NotSet */, _this.getAll());
        }));
        var updateCursorContext = function () {
            _this.context = new CursorContext(_this._configuration, _this._model, _this._viewModel);
            _this._cursors.updateContext(_this.context);
        };
        _this._register(_this._model.onDidChangeLanguage(function (e) {
            updateCursorContext();
        }));
        _this._register(_this._model.onDidChangeLanguageConfiguration(function () {
            updateCursorContext();
        }));
        _this._register(_this._model.onDidChangeOptions(function () {
            updateCursorContext();
        }));
        _this._register(_this._configuration.onDidChange(function (e) {
            if (CursorConfiguration.shouldRecreate(e)) {
                updateCursorContext();
            }
        }));
        return _this;
    }
    Cursor.prototype.dispose = function () {
        this._cursors.dispose();
        _super.prototype.dispose.call(this);
    };
    // ------ some getters/setters
    Cursor.prototype.getPrimaryCursor = function () {
        return this._cursors.getPrimaryCursor();
    };
    Cursor.prototype.getLastAddedCursorIndex = function () {
        return this._cursors.getLastAddedCursorIndex();
    };
    Cursor.prototype.getAll = function () {
        return this._cursors.getAll();
    };
    Cursor.prototype.setStates = function (source, reason, states) {
        if (states !== null && states.length > Cursor.MAX_CURSOR_COUNT) {
            states = states.slice(0, Cursor.MAX_CURSOR_COUNT);
            this._onDidReachMaxCursorCount.fire(void 0);
        }
        var oldState = new CursorModelState(this._model, this);
        this._cursors.setStates(states);
        this._cursors.normalize();
        this._columnSelectData = null;
        this._emitStateChangedIfNecessary(source, reason, oldState);
    };
    Cursor.prototype.setColumnSelectData = function (columnSelectData) {
        this._columnSelectData = columnSelectData;
    };
    Cursor.prototype.reveal = function (horizontal, target, scrollType) {
        this._revealRange(target, 0 /* Simple */, horizontal, scrollType);
    };
    Cursor.prototype.revealRange = function (revealHorizontal, viewRange, verticalType, scrollType) {
        this.emitCursorRevealRange(viewRange, verticalType, revealHorizontal, scrollType);
    };
    Cursor.prototype.scrollTo = function (desiredScrollTop) {
        this._viewModel.viewLayout.setScrollPositionSmooth({
            scrollTop: desiredScrollTop
        });
    };
    Cursor.prototype.saveState = function () {
        var result = [];
        var selections = this._cursors.getSelections();
        for (var i = 0, len = selections.length; i < len; i++) {
            var selection = selections[i];
            result.push({
                inSelectionMode: !selection.isEmpty(),
                selectionStart: {
                    lineNumber: selection.selectionStartLineNumber,
                    column: selection.selectionStartColumn,
                },
                position: {
                    lineNumber: selection.positionLineNumber,
                    column: selection.positionColumn,
                }
            });
        }
        return result;
    };
    Cursor.prototype.restoreState = function (states) {
        var desiredSelections = [];
        for (var i = 0, len = states.length; i < len; i++) {
            var state = states[i];
            var positionLineNumber = 1;
            var positionColumn = 1;
            // Avoid missing properties on the literal
            if (state.position && state.position.lineNumber) {
                positionLineNumber = state.position.lineNumber;
            }
            if (state.position && state.position.column) {
                positionColumn = state.position.column;
            }
            var selectionStartLineNumber = positionLineNumber;
            var selectionStartColumn = positionColumn;
            // Avoid missing properties on the literal
            if (state.selectionStart && state.selectionStart.lineNumber) {
                selectionStartLineNumber = state.selectionStart.lineNumber;
            }
            if (state.selectionStart && state.selectionStart.column) {
                selectionStartColumn = state.selectionStart.column;
            }
            desiredSelections.push({
                selectionStartLineNumber: selectionStartLineNumber,
                selectionStartColumn: selectionStartColumn,
                positionLineNumber: positionLineNumber,
                positionColumn: positionColumn
            });
        }
        this.setStates('restoreState', 0 /* NotSet */, CursorState.fromModelSelections(desiredSelections));
        this.reveal(true, 0 /* Primary */, 1 /* Immediate */);
    };
    Cursor.prototype._onModelContentChanged = function (hadFlushEvent) {
        this._prevEditOperationType = 0 /* Other */;
        if (hadFlushEvent) {
            // a model.setValue() was called
            this._cursors.dispose();
            this._cursors = new CursorCollection(this.context);
            this._emitStateChangedIfNecessary('model', 1 /* ContentFlush */, null);
        }
        else {
            var selectionsFromMarkers = this._cursors.readSelectionFromMarkers();
            this.setStates('modelChange', 2 /* RecoverFromMarkers */, CursorState.fromModelSelections(selectionsFromMarkers));
        }
    };
    Cursor.prototype.getSelection = function () {
        return this._cursors.getPrimaryCursor().modelState.selection;
    };
    Cursor.prototype.getColumnSelectData = function () {
        if (this._columnSelectData) {
            return this._columnSelectData;
        }
        var primaryCursor = this._cursors.getPrimaryCursor();
        var primaryPos = primaryCursor.viewState.position;
        return {
            toViewLineNumber: primaryPos.lineNumber,
            toViewVisualColumn: CursorColumns.visibleColumnFromColumn2(this.context.config, this.context.viewModel, primaryPos)
        };
    };
    Cursor.prototype.getSelections = function () {
        return this._cursors.getSelections();
    };
    Cursor.prototype.getViewSelections = function () {
        return this._cursors.getViewSelections();
    };
    Cursor.prototype.getPosition = function () {
        return this._cursors.getPrimaryCursor().modelState.position;
    };
    Cursor.prototype.setSelections = function (source, selections) {
        this.setStates(source, 0 /* NotSet */, CursorState.fromModelSelections(selections));
    };
    Cursor.prototype.getPrevEditOperationType = function () {
        return this._prevEditOperationType;
    };
    Cursor.prototype.setPrevEditOperationType = function (type) {
        this._prevEditOperationType = type;
    };
    // ------ auxiliary handling logic
    Cursor.prototype._executeEditOperation = function (opResult) {
        if (!opResult) {
            // Nothing to execute
            return;
        }
        if (opResult.shouldPushStackElementBefore) {
            this._model.pushStackElement();
        }
        var result = CommandExecutor.executeCommands(this._model, this._cursors.getSelections(), opResult.commands);
        if (result) {
            // The commands were applied correctly
            this._interpretCommandResult(result);
            this._prevEditOperationType = opResult.type;
        }
        if (opResult.shouldPushStackElementAfter) {
            this._model.pushStackElement();
        }
    };
    Cursor.prototype._interpretCommandResult = function (cursorState) {
        if (!cursorState || cursorState.length === 0) {
            cursorState = this._cursors.readSelectionFromMarkers();
        }
        this._columnSelectData = null;
        this._cursors.setSelections(cursorState);
        this._cursors.normalize();
    };
    // -----------------------------------------------------------------------------------------------------------
    // ----- emitting events
    Cursor.prototype._emitStateChangedIfNecessary = function (source, reason, oldState) {
        var newState = new CursorModelState(this._model, this);
        if (newState.equals(oldState)) {
            return false;
        }
        var selections = this._cursors.getSelections();
        var viewSelections = this._cursors.getViewSelections();
        // Let the view get the event first.
        try {
            var eventsCollector = this._beginEmit();
            eventsCollector.emit(new viewEvents.ViewCursorStateChangedEvent(viewSelections));
        }
        finally {
            this._endEmit();
        }
        // Only after the view has been notified, let the rest of the world know...
        if (!oldState
            || oldState.cursorState.length !== newState.cursorState.length
            || newState.cursorState.some(function (newCursorState, i) { return !newCursorState.modelState.equals(oldState.cursorState[i].modelState); })) {
            this._onDidChange.fire(new CursorStateChangedEvent(selections, source || 'keyboard', reason));
        }
        return true;
    };
    Cursor.prototype._revealRange = function (revealTarget, verticalType, revealHorizontal, scrollType) {
        var viewPositions = this._cursors.getViewPositions();
        var viewPosition = viewPositions[0];
        if (revealTarget === 1 /* TopMost */) {
            for (var i = 1; i < viewPositions.length; i++) {
                if (viewPositions[i].isBefore(viewPosition)) {
                    viewPosition = viewPositions[i];
                }
            }
        }
        else if (revealTarget === 2 /* BottomMost */) {
            for (var i = 1; i < viewPositions.length; i++) {
                if (viewPosition.isBeforeOrEqual(viewPositions[i])) {
                    viewPosition = viewPositions[i];
                }
            }
        }
        else {
            if (viewPositions.length > 1) {
                // no revealing!
                return;
            }
        }
        var viewRange = new Range(viewPosition.lineNumber, viewPosition.column, viewPosition.lineNumber, viewPosition.column);
        this.emitCursorRevealRange(viewRange, verticalType, revealHorizontal, scrollType);
    };
    Cursor.prototype.emitCursorRevealRange = function (viewRange, verticalType, revealHorizontal, scrollType) {
        try {
            var eventsCollector = this._beginEmit();
            eventsCollector.emit(new viewEvents.ViewRevealRangeRequestEvent(viewRange, verticalType, revealHorizontal, scrollType));
        }
        finally {
            this._endEmit();
        }
    };
    // -----------------------------------------------------------------------------------------------------------
    // ----- handlers beyond this point
    Cursor.prototype.trigger = function (source, handlerId, payload) {
        var H = editorCommon.Handler;
        if (handlerId === H.CompositionStart) {
            this._isDoingComposition = true;
            return;
        }
        if (handlerId === H.CompositionEnd) {
            this._isDoingComposition = false;
        }
        if (this._configuration.editor.readOnly) {
            // All the remaining handlers will try to edit the model,
            // but we cannot edit when read only...
            this._onDidAttemptReadOnlyEdit.fire(void 0);
            return;
        }
        var oldState = new CursorModelState(this._model, this);
        var cursorChangeReason = 0 /* NotSet */;
        if (handlerId !== H.Undo && handlerId !== H.Redo) {
            // TODO@Alex: if the undo/redo stack contains non-null selections
            // it would also be OK to stop tracking selections here
            this._cursors.stopTrackingSelections();
        }
        // ensure valid state on all cursors
        this._cursors.ensureValidState();
        this._isHandling = true;
        try {
            switch (handlerId) {
                case H.Type:
                    this._type(source, payload.text);
                    break;
                case H.ReplacePreviousChar:
                    this._replacePreviousChar(payload.text, payload.replaceCharCnt);
                    break;
                case H.Paste:
                    cursorChangeReason = 4 /* Paste */;
                    this._paste(payload.text, payload.pasteOnNewLine, payload.multicursorText);
                    break;
                case H.Cut:
                    this._cut();
                    break;
                case H.Undo:
                    cursorChangeReason = 5 /* Undo */;
                    this._interpretCommandResult(this._model.undo());
                    break;
                case H.Redo:
                    cursorChangeReason = 6 /* Redo */;
                    this._interpretCommandResult(this._model.redo());
                    break;
                case H.ExecuteCommand:
                    this._externalExecuteCommand(payload);
                    break;
                case H.ExecuteCommands:
                    this._externalExecuteCommands(payload);
                    break;
                case H.CompositionEnd:
                    this._interpretCompositionEnd(source);
                    break;
            }
        }
        catch (err) {
            onUnexpectedError(err);
        }
        this._isHandling = false;
        if (handlerId !== H.Undo && handlerId !== H.Redo) {
            this._cursors.startTrackingSelections();
        }
        if (this._emitStateChangedIfNecessary(source, cursorChangeReason, oldState)) {
            this._revealRange(0 /* Primary */, 0 /* Simple */, true, 0 /* Smooth */);
        }
    };
    Cursor.prototype._interpretCompositionEnd = function (source) {
        if (!this._isDoingComposition && source === 'keyboard') {
            // composition finishes, let's check if we need to auto complete if necessary.
            this._executeEditOperation(TypeOperations.compositionEndWithInterceptors(this._prevEditOperationType, this.context.config, this.context.model, this.getSelections()));
        }
    };
    Cursor.prototype._type = function (source, text) {
        if (!this._isDoingComposition && source === 'keyboard') {
            // If this event is coming straight from the keyboard, look for electric characters and enter
            for (var i = 0, len = text.length; i < len; i++) {
                var charCode = text.charCodeAt(i);
                var chr = void 0;
                if (strings.isHighSurrogate(charCode) && i + 1 < len) {
                    chr = text.charAt(i) + text.charAt(i + 1);
                    i++;
                }
                else {
                    chr = text.charAt(i);
                }
                // Here we must interpret each typed character individually, that's why we create a new context
                this._executeEditOperation(TypeOperations.typeWithInterceptors(this._prevEditOperationType, this.context.config, this.context.model, this.getSelections(), chr));
            }
        }
        else {
            this._executeEditOperation(TypeOperations.typeWithoutInterceptors(this._prevEditOperationType, this.context.config, this.context.model, this.getSelections(), text));
        }
    };
    Cursor.prototype._replacePreviousChar = function (text, replaceCharCnt) {
        this._executeEditOperation(TypeOperations.replacePreviousChar(this._prevEditOperationType, this.context.config, this.context.model, this.getSelections(), text, replaceCharCnt));
    };
    Cursor.prototype._paste = function (text, pasteOnNewLine, multicursorText) {
        this._executeEditOperation(TypeOperations.paste(this.context.config, this.context.model, this.getSelections(), text, pasteOnNewLine, multicursorText));
    };
    Cursor.prototype._cut = function () {
        this._executeEditOperation(DeleteOperations.cut(this.context.config, this.context.model, this.getSelections()));
    };
    Cursor.prototype._externalExecuteCommand = function (command) {
        this._cursors.killSecondaryCursors();
        this._executeEditOperation(new EditOperationResult(0 /* Other */, [command], {
            shouldPushStackElementBefore: false,
            shouldPushStackElementAfter: false
        }));
    };
    Cursor.prototype._externalExecuteCommands = function (commands) {
        this._executeEditOperation(new EditOperationResult(0 /* Other */, commands, {
            shouldPushStackElementBefore: false,
            shouldPushStackElementAfter: false
        }));
    };
    Cursor.MAX_CURSOR_COUNT = 10000;
    return Cursor;
}(viewEvents.ViewEventEmitter));
export { Cursor };
var CommandExecutor = /** @class */ (function () {
    function CommandExecutor() {
    }
    CommandExecutor.executeCommands = function (model, selectionsBefore, commands) {
        var ctx = {
            model: model,
            selectionsBefore: selectionsBefore,
            trackedRanges: [],
            trackedRangesDirection: []
        };
        var result = this._innerExecuteCommands(ctx, commands);
        for (var i = 0, len = ctx.trackedRanges.length; i < len; i++) {
            ctx.model._setTrackedRange(ctx.trackedRanges[i], null, 0 /* AlwaysGrowsWhenTypingAtEdges */);
        }
        return result;
    };
    CommandExecutor._innerExecuteCommands = function (ctx, commands) {
        if (this._arrayIsEmpty(commands)) {
            return null;
        }
        var commandsData = this._getEditOperations(ctx, commands);
        if (commandsData.operations.length === 0) {
            return null;
        }
        var rawOperations = commandsData.operations;
        var loserCursorsMap = this._getLoserCursorMap(rawOperations);
        if (loserCursorsMap.hasOwnProperty('0')) {
            // These commands are very messed up
            console.warn('Ignoring commands');
            return null;
        }
        // Remove operations belonging to losing cursors
        var filteredOperations = [];
        for (var i = 0, len = rawOperations.length; i < len; i++) {
            if (!loserCursorsMap.hasOwnProperty(rawOperations[i].identifier.major.toString())) {
                filteredOperations.push(rawOperations[i]);
            }
        }
        // TODO@Alex: find a better way to do this.
        // give the hint that edit operations are tracked to the model
        if (commandsData.hadTrackedEditOperation && filteredOperations.length > 0) {
            filteredOperations[0]._isTracked = true;
        }
        var selectionsAfter = ctx.model.pushEditOperations(ctx.selectionsBefore, filteredOperations, function (inverseEditOperations) {
            var groupedInverseEditOperations = [];
            for (var i = 0; i < ctx.selectionsBefore.length; i++) {
                groupedInverseEditOperations[i] = [];
            }
            for (var i = 0; i < inverseEditOperations.length; i++) {
                var op = inverseEditOperations[i];
                if (!op.identifier) {
                    // perhaps auto whitespace trim edits
                    continue;
                }
                groupedInverseEditOperations[op.identifier.major].push(op);
            }
            var minorBasedSorter = function (a, b) {
                return a.identifier.minor - b.identifier.minor;
            };
            var cursorSelections = [];
            var _loop_1 = function (i) {
                if (groupedInverseEditOperations[i].length > 0) {
                    groupedInverseEditOperations[i].sort(minorBasedSorter);
                    cursorSelections[i] = commands[i].computeCursorState(ctx.model, {
                        getInverseEditOperations: function () {
                            return groupedInverseEditOperations[i];
                        },
                        getTrackedSelection: function (id) {
                            var idx = parseInt(id, 10);
                            var range = ctx.model._getTrackedRange(ctx.trackedRanges[idx]);
                            if (ctx.trackedRangesDirection[idx] === 0 /* LTR */) {
                                return new Selection(range.startLineNumber, range.startColumn, range.endLineNumber, range.endColumn);
                            }
                            return new Selection(range.endLineNumber, range.endColumn, range.startLineNumber, range.startColumn);
                        }
                    });
                }
                else {
                    cursorSelections[i] = ctx.selectionsBefore[i];
                }
            };
            for (var i = 0; i < ctx.selectionsBefore.length; i++) {
                _loop_1(i);
            }
            return cursorSelections;
        });
        if (!selectionsAfter) {
            selectionsAfter = ctx.selectionsBefore;
        }
        // Extract losing cursors
        var losingCursors = [];
        for (var losingCursorIndex in loserCursorsMap) {
            if (loserCursorsMap.hasOwnProperty(losingCursorIndex)) {
                losingCursors.push(parseInt(losingCursorIndex, 10));
            }
        }
        // Sort losing cursors descending
        losingCursors.sort(function (a, b) {
            return b - a;
        });
        // Remove losing cursors
        for (var i = 0; i < losingCursors.length; i++) {
            selectionsAfter.splice(losingCursors[i], 1);
        }
        return selectionsAfter;
    };
    CommandExecutor._arrayIsEmpty = function (commands) {
        for (var i = 0, len = commands.length; i < len; i++) {
            if (commands[i]) {
                return false;
            }
        }
        return true;
    };
    CommandExecutor._getEditOperations = function (ctx, commands) {
        var operations = [];
        var hadTrackedEditOperation = false;
        for (var i = 0, len = commands.length; i < len; i++) {
            var command = commands[i];
            if (command) {
                var r = this._getEditOperationsFromCommand(ctx, i, command);
                operations = operations.concat(r.operations);
                hadTrackedEditOperation = hadTrackedEditOperation || r.hadTrackedEditOperation;
            }
        }
        return {
            operations: operations,
            hadTrackedEditOperation: hadTrackedEditOperation
        };
    };
    CommandExecutor._getEditOperationsFromCommand = function (ctx, majorIdentifier, command) {
        // This method acts as a transaction, if the command fails
        // everything it has done is ignored
        var operations = [];
        var operationMinor = 0;
        var addEditOperation = function (selection, text) {
            if (selection.isEmpty() && text === '') {
                // This command wants to add a no-op => no thank you
                return;
            }
            operations.push({
                identifier: {
                    major: majorIdentifier,
                    minor: operationMinor++
                },
                range: selection,
                text: text,
                forceMoveMarkers: false,
                isAutoWhitespaceEdit: command.insertsAutoWhitespace
            });
        };
        var hadTrackedEditOperation = false;
        var addTrackedEditOperation = function (selection, text) {
            hadTrackedEditOperation = true;
            addEditOperation(selection, text);
        };
        var trackSelection = function (selection, trackPreviousOnEmpty) {
            var stickiness;
            if (selection.isEmpty()) {
                if (typeof trackPreviousOnEmpty === 'boolean') {
                    if (trackPreviousOnEmpty) {
                        stickiness = 2 /* GrowsOnlyWhenTypingBefore */;
                    }
                    else {
                        stickiness = 3 /* GrowsOnlyWhenTypingAfter */;
                    }
                }
                else {
                    // Try to lock it with surrounding text
                    var maxLineColumn = ctx.model.getLineMaxColumn(selection.startLineNumber);
                    if (selection.startColumn === maxLineColumn) {
                        stickiness = 2 /* GrowsOnlyWhenTypingBefore */;
                    }
                    else {
                        stickiness = 3 /* GrowsOnlyWhenTypingAfter */;
                    }
                }
            }
            else {
                stickiness = 1 /* NeverGrowsWhenTypingAtEdges */;
            }
            var l = ctx.trackedRanges.length;
            var id = ctx.model._setTrackedRange(null, selection, stickiness);
            ctx.trackedRanges[l] = id;
            ctx.trackedRangesDirection[l] = selection.getDirection();
            return l.toString();
        };
        var editOperationBuilder = {
            addEditOperation: addEditOperation,
            addTrackedEditOperation: addTrackedEditOperation,
            trackSelection: trackSelection
        };
        try {
            command.getEditOperations(ctx.model, editOperationBuilder);
        }
        catch (e) {
            e.friendlyMessage = nls.localize('corrupt.commands', "Unexpected exception while executing command.");
            onUnexpectedError(e);
            return {
                operations: [],
                hadTrackedEditOperation: false
            };
        }
        return {
            operations: operations,
            hadTrackedEditOperation: hadTrackedEditOperation
        };
    };
    CommandExecutor._getLoserCursorMap = function (operations) {
        // This is destructive on the array
        operations = operations.slice(0);
        // Sort operations with last one first
        operations.sort(function (a, b) {
            // Note the minus!
            return -(Range.compareRangesUsingEnds(a.range, b.range));
        });
        // Operations can not overlap!
        var loserCursorsMap = {};
        for (var i = 1; i < operations.length; i++) {
            var previousOp = operations[i - 1];
            var currentOp = operations[i];
            if (previousOp.range.getStartPosition().isBefore(currentOp.range.getEndPosition())) {
                var loserMajor = void 0;
                if (previousOp.identifier.major > currentOp.identifier.major) {
                    // previousOp loses the battle
                    loserMajor = previousOp.identifier.major;
                }
                else {
                    loserMajor = currentOp.identifier.major;
                }
                loserCursorsMap[loserMajor.toString()] = true;
                for (var j = 0; j < operations.length; j++) {
                    if (operations[j].identifier.major === loserMajor) {
                        operations.splice(j, 1);
                        if (j < i) {
                            i--;
                        }
                        j--;
                    }
                }
                if (i > 0) {
                    i--;
                }
            }
        }
        return loserCursorsMap;
    };
    return CommandExecutor;
}());
