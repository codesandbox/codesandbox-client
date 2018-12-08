/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { onUnexpectedError } from '../../../base/common/errors.js';
import * as strings from '../../../base/common/strings.js';
import { Position } from '../core/position.js';
import { Range } from '../core/range.js';
import { Selection } from '../core/selection.js';
import { TextModel } from '../model/textModel.js';
import { LanguageConfigurationRegistry } from '../modes/languageConfigurationRegistry.js';
var autoCloseAlways = function (_) { return true; };
var autoCloseNever = function (_) { return false; };
var autoCloseBeforeWhitespace = function (chr) { return (chr === ' ' || chr === '\t'); };
var CursorConfiguration = /** @class */ (function () {
    function CursorConfiguration(languageIdentifier, oneIndent, modelOptions, configuration) {
        this._languageIdentifier = languageIdentifier;
        var c = configuration.editor;
        this.readOnly = c.readOnly;
        this.tabSize = modelOptions.tabSize;
        this.insertSpaces = modelOptions.insertSpaces;
        this.oneIndent = oneIndent;
        this.pageSize = Math.max(1, Math.floor(c.layoutInfo.height / c.fontInfo.lineHeight) - 2);
        this.lineHeight = c.lineHeight;
        this.useTabStops = c.useTabStops;
        this.wordSeparators = c.wordSeparators;
        this.emptySelectionClipboard = c.emptySelectionClipboard;
        this.copyWithSyntaxHighlighting = c.copyWithSyntaxHighlighting;
        this.multiCursorMergeOverlapping = c.multiCursorMergeOverlapping;
        this.autoClosingBrackets = c.autoClosingBrackets;
        this.autoClosingQuotes = c.autoClosingQuotes;
        this.autoSurround = c.autoSurround;
        this.autoIndent = c.autoIndent;
        this.autoClosingPairsOpen = {};
        this.autoClosingPairsClose = {};
        this.surroundingPairs = {};
        this._electricChars = null;
        this.shouldAutoCloseBefore = {
            quote: CursorConfiguration._getShouldAutoClose(languageIdentifier, this.autoClosingQuotes),
            bracket: CursorConfiguration._getShouldAutoClose(languageIdentifier, this.autoClosingBrackets)
        };
        var autoClosingPairs = CursorConfiguration._getAutoClosingPairs(languageIdentifier);
        if (autoClosingPairs) {
            for (var i = 0; i < autoClosingPairs.length; i++) {
                this.autoClosingPairsOpen[autoClosingPairs[i].open] = autoClosingPairs[i].close;
                this.autoClosingPairsClose[autoClosingPairs[i].close] = autoClosingPairs[i].open;
            }
        }
        var surroundingPairs = CursorConfiguration._getSurroundingPairs(languageIdentifier);
        if (surroundingPairs) {
            for (var i = 0; i < surroundingPairs.length; i++) {
                this.surroundingPairs[surroundingPairs[i].open] = surroundingPairs[i].close;
            }
        }
    }
    CursorConfiguration.shouldRecreate = function (e) {
        return (e.layoutInfo
            || e.wordSeparators
            || e.emptySelectionClipboard
            || e.multiCursorMergeOverlapping
            || e.autoClosingBrackets
            || e.autoClosingQuotes
            || e.autoSurround
            || e.useTabStops
            || e.lineHeight
            || e.readOnly);
    };
    Object.defineProperty(CursorConfiguration.prototype, "electricChars", {
        get: function () {
            if (!this._electricChars) {
                this._electricChars = {};
                var electricChars = CursorConfiguration._getElectricCharacters(this._languageIdentifier);
                if (electricChars) {
                    for (var i = 0; i < electricChars.length; i++) {
                        this._electricChars[electricChars[i]] = true;
                    }
                }
            }
            return this._electricChars;
        },
        enumerable: true,
        configurable: true
    });
    CursorConfiguration.prototype.normalizeIndentation = function (str) {
        return TextModel.normalizeIndentation(str, this.tabSize, this.insertSpaces);
    };
    CursorConfiguration._getElectricCharacters = function (languageIdentifier) {
        try {
            return LanguageConfigurationRegistry.getElectricCharacters(languageIdentifier.id);
        }
        catch (e) {
            onUnexpectedError(e);
            return null;
        }
    };
    CursorConfiguration._getAutoClosingPairs = function (languageIdentifier) {
        try {
            return LanguageConfigurationRegistry.getAutoClosingPairs(languageIdentifier.id);
        }
        catch (e) {
            onUnexpectedError(e);
            return null;
        }
    };
    CursorConfiguration._getShouldAutoClose = function (languageIdentifier, autoCloseConfig) {
        switch (autoCloseConfig) {
            case 'beforeWhitespace':
                return autoCloseBeforeWhitespace;
            case 'languageDefined':
                return CursorConfiguration._getLanguageDefinedShouldAutoClose(languageIdentifier);
            case 'always':
                return autoCloseAlways;
            case 'never':
                return autoCloseNever;
        }
    };
    CursorConfiguration._getLanguageDefinedShouldAutoClose = function (languageIdentifier) {
        try {
            var autoCloseBeforeSet_1 = LanguageConfigurationRegistry.getAutoCloseBeforeSet(languageIdentifier.id);
            return function (c) { return autoCloseBeforeSet_1.indexOf(c) !== -1; };
        }
        catch (e) {
            onUnexpectedError(e);
            return autoCloseNever;
        }
    };
    CursorConfiguration._getSurroundingPairs = function (languageIdentifier) {
        try {
            return LanguageConfigurationRegistry.getSurroundingPairs(languageIdentifier.id);
        }
        catch (e) {
            onUnexpectedError(e);
            return null;
        }
    };
    return CursorConfiguration;
}());
export { CursorConfiguration };
/**
 * Represents the cursor state on either the model or on the view model.
 */
var SingleCursorState = /** @class */ (function () {
    function SingleCursorState(selectionStart, selectionStartLeftoverVisibleColumns, position, leftoverVisibleColumns) {
        this.selectionStart = selectionStart;
        this.selectionStartLeftoverVisibleColumns = selectionStartLeftoverVisibleColumns;
        this.position = position;
        this.leftoverVisibleColumns = leftoverVisibleColumns;
        this.selection = SingleCursorState._computeSelection(this.selectionStart, this.position);
    }
    SingleCursorState.prototype.equals = function (other) {
        return (this.selectionStartLeftoverVisibleColumns === other.selectionStartLeftoverVisibleColumns
            && this.leftoverVisibleColumns === other.leftoverVisibleColumns
            && this.position.equals(other.position)
            && this.selectionStart.equalsRange(other.selectionStart));
    };
    SingleCursorState.prototype.hasSelection = function () {
        return (!this.selection.isEmpty() || !this.selectionStart.isEmpty());
    };
    SingleCursorState.prototype.move = function (inSelectionMode, lineNumber, column, leftoverVisibleColumns) {
        if (inSelectionMode) {
            // move just position
            return new SingleCursorState(this.selectionStart, this.selectionStartLeftoverVisibleColumns, new Position(lineNumber, column), leftoverVisibleColumns);
        }
        else {
            // move everything
            return new SingleCursorState(new Range(lineNumber, column, lineNumber, column), leftoverVisibleColumns, new Position(lineNumber, column), leftoverVisibleColumns);
        }
    };
    SingleCursorState._computeSelection = function (selectionStart, position) {
        var startLineNumber, startColumn, endLineNumber, endColumn;
        if (selectionStart.isEmpty()) {
            startLineNumber = selectionStart.startLineNumber;
            startColumn = selectionStart.startColumn;
            endLineNumber = position.lineNumber;
            endColumn = position.column;
        }
        else {
            if (position.isBeforeOrEqual(selectionStart.getStartPosition())) {
                startLineNumber = selectionStart.endLineNumber;
                startColumn = selectionStart.endColumn;
                endLineNumber = position.lineNumber;
                endColumn = position.column;
            }
            else {
                startLineNumber = selectionStart.startLineNumber;
                startColumn = selectionStart.startColumn;
                endLineNumber = position.lineNumber;
                endColumn = position.column;
            }
        }
        return new Selection(startLineNumber, startColumn, endLineNumber, endColumn);
    };
    return SingleCursorState;
}());
export { SingleCursorState };
var CursorContext = /** @class */ (function () {
    function CursorContext(configuration, model, viewModel) {
        this.model = model;
        this.viewModel = viewModel;
        this.config = new CursorConfiguration(this.model.getLanguageIdentifier(), this.model.getOneIndent(), this.model.getOptions(), configuration);
    }
    CursorContext.prototype.validateViewPosition = function (viewPosition, modelPosition) {
        return this.viewModel.coordinatesConverter.validateViewPosition(viewPosition, modelPosition);
    };
    CursorContext.prototype.validateViewRange = function (viewRange, expectedModelRange) {
        return this.viewModel.coordinatesConverter.validateViewRange(viewRange, expectedModelRange);
    };
    CursorContext.prototype.convertViewRangeToModelRange = function (viewRange) {
        return this.viewModel.coordinatesConverter.convertViewRangeToModelRange(viewRange);
    };
    CursorContext.prototype.convertViewPositionToModelPosition = function (lineNumber, column) {
        return this.viewModel.coordinatesConverter.convertViewPositionToModelPosition(new Position(lineNumber, column));
    };
    CursorContext.prototype.convertModelPositionToViewPosition = function (modelPosition) {
        return this.viewModel.coordinatesConverter.convertModelPositionToViewPosition(modelPosition);
    };
    CursorContext.prototype.convertModelRangeToViewRange = function (modelRange) {
        return this.viewModel.coordinatesConverter.convertModelRangeToViewRange(modelRange);
    };
    CursorContext.prototype.getCurrentScrollTop = function () {
        return this.viewModel.viewLayout.getCurrentScrollTop();
    };
    CursorContext.prototype.getCompletelyVisibleViewRange = function () {
        return this.viewModel.getCompletelyVisibleViewRange();
    };
    CursorContext.prototype.getCompletelyVisibleModelRange = function () {
        var viewRange = this.viewModel.getCompletelyVisibleViewRange();
        return this.viewModel.coordinatesConverter.convertViewRangeToModelRange(viewRange);
    };
    CursorContext.prototype.getCompletelyVisibleViewRangeAtScrollTop = function (scrollTop) {
        return this.viewModel.getCompletelyVisibleViewRangeAtScrollTop(scrollTop);
    };
    CursorContext.prototype.getVerticalOffsetForViewLine = function (viewLineNumber) {
        return this.viewModel.viewLayout.getVerticalOffsetForLineNumber(viewLineNumber);
    };
    return CursorContext;
}());
export { CursorContext };
var PartialModelCursorState = /** @class */ (function () {
    function PartialModelCursorState(modelState) {
        this.modelState = modelState;
        this.viewState = null;
    }
    return PartialModelCursorState;
}());
export { PartialModelCursorState };
var PartialViewCursorState = /** @class */ (function () {
    function PartialViewCursorState(viewState) {
        this.modelState = null;
        this.viewState = viewState;
    }
    return PartialViewCursorState;
}());
export { PartialViewCursorState };
var CursorState = /** @class */ (function () {
    function CursorState(modelState, viewState) {
        this.modelState = modelState;
        this.viewState = viewState;
    }
    CursorState.fromModelState = function (modelState) {
        return new PartialModelCursorState(modelState);
    };
    CursorState.fromViewState = function (viewState) {
        return new PartialViewCursorState(viewState);
    };
    CursorState.fromModelSelection = function (modelSelection) {
        var selectionStartLineNumber = modelSelection.selectionStartLineNumber;
        var selectionStartColumn = modelSelection.selectionStartColumn;
        var positionLineNumber = modelSelection.positionLineNumber;
        var positionColumn = modelSelection.positionColumn;
        var modelState = new SingleCursorState(new Range(selectionStartLineNumber, selectionStartColumn, selectionStartLineNumber, selectionStartColumn), 0, new Position(positionLineNumber, positionColumn), 0);
        return CursorState.fromModelState(modelState);
    };
    CursorState.fromModelSelections = function (modelSelections) {
        var states = [];
        for (var i = 0, len = modelSelections.length; i < len; i++) {
            states[i] = this.fromModelSelection(modelSelections[i]);
        }
        return states;
    };
    CursorState.prototype.equals = function (other) {
        return (this.viewState.equals(other.viewState) && this.modelState.equals(other.modelState));
    };
    return CursorState;
}());
export { CursorState };
var EditOperationResult = /** @class */ (function () {
    function EditOperationResult(type, commands, opts) {
        this.type = type;
        this.commands = commands;
        this.shouldPushStackElementBefore = opts.shouldPushStackElementBefore;
        this.shouldPushStackElementAfter = opts.shouldPushStackElementAfter;
    }
    return EditOperationResult;
}());
export { EditOperationResult };
/**
 * Common operations that work and make sense both on the model and on the view model.
 */
var CursorColumns = /** @class */ (function () {
    function CursorColumns() {
    }
    CursorColumns.isLowSurrogate = function (model, lineNumber, charOffset) {
        var lineContent = model.getLineContent(lineNumber);
        if (charOffset < 0 || charOffset >= lineContent.length) {
            return false;
        }
        return strings.isLowSurrogate(lineContent.charCodeAt(charOffset));
    };
    CursorColumns.isHighSurrogate = function (model, lineNumber, charOffset) {
        var lineContent = model.getLineContent(lineNumber);
        if (charOffset < 0 || charOffset >= lineContent.length) {
            return false;
        }
        return strings.isHighSurrogate(lineContent.charCodeAt(charOffset));
    };
    CursorColumns.isInsideSurrogatePair = function (model, lineNumber, column) {
        return this.isHighSurrogate(model, lineNumber, column - 2);
    };
    CursorColumns.visibleColumnFromColumn = function (lineContent, column, tabSize) {
        var endOffset = lineContent.length;
        if (endOffset > column - 1) {
            endOffset = column - 1;
        }
        var result = 0;
        for (var i = 0; i < endOffset; i++) {
            var charCode = lineContent.charCodeAt(i);
            if (charCode === 9 /* Tab */) {
                result = this.nextTabStop(result, tabSize);
            }
            else if (strings.isFullWidthCharacter(charCode)) {
                result = result + 2;
            }
            else {
                result = result + 1;
            }
        }
        return result;
    };
    CursorColumns.visibleColumnFromColumn2 = function (config, model, position) {
        return this.visibleColumnFromColumn(model.getLineContent(position.lineNumber), position.column, config.tabSize);
    };
    CursorColumns.columnFromVisibleColumn = function (lineContent, visibleColumn, tabSize) {
        if (visibleColumn <= 0) {
            return 1;
        }
        var lineLength = lineContent.length;
        var beforeVisibleColumn = 0;
        for (var i = 0; i < lineLength; i++) {
            var charCode = lineContent.charCodeAt(i);
            var afterVisibleColumn = void 0;
            if (charCode === 9 /* Tab */) {
                afterVisibleColumn = this.nextTabStop(beforeVisibleColumn, tabSize);
            }
            else if (strings.isFullWidthCharacter(charCode)) {
                afterVisibleColumn = beforeVisibleColumn + 2;
            }
            else {
                afterVisibleColumn = beforeVisibleColumn + 1;
            }
            if (afterVisibleColumn >= visibleColumn) {
                var prevDelta = visibleColumn - beforeVisibleColumn;
                var afterDelta = afterVisibleColumn - visibleColumn;
                if (afterDelta < prevDelta) {
                    return i + 2;
                }
                else {
                    return i + 1;
                }
            }
            beforeVisibleColumn = afterVisibleColumn;
        }
        // walked the entire string
        return lineLength + 1;
    };
    CursorColumns.columnFromVisibleColumn2 = function (config, model, lineNumber, visibleColumn) {
        var result = this.columnFromVisibleColumn(model.getLineContent(lineNumber), visibleColumn, config.tabSize);
        var minColumn = model.getLineMinColumn(lineNumber);
        if (result < minColumn) {
            return minColumn;
        }
        var maxColumn = model.getLineMaxColumn(lineNumber);
        if (result > maxColumn) {
            return maxColumn;
        }
        return result;
    };
    /**
     * ATTENTION: This works with 0-based columns (as oposed to the regular 1-based columns)
     */
    CursorColumns.nextTabStop = function (visibleColumn, tabSize) {
        return visibleColumn + tabSize - visibleColumn % tabSize;
    };
    /**
     * ATTENTION: This works with 0-based columns (as oposed to the regular 1-based columns)
     */
    CursorColumns.prevTabStop = function (column, tabSize) {
        return column - 1 - (column - 1) % tabSize;
    };
    return CursorColumns;
}());
export { CursorColumns };
export function isQuote(ch) {
    return (ch === '\'' || ch === '"' || ch === '`');
}
