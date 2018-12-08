/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { CursorState } from './cursorCommon.js';
import { OneCursor } from './oneCursor.js';
import { Selection } from '../core/selection.js';
var CursorCollection = /** @class */ (function () {
    function CursorCollection(context) {
        this.context = context;
        this.primaryCursor = new OneCursor(context);
        this.secondaryCursors = [];
        this.lastAddedCursorIndex = 0;
    }
    CursorCollection.prototype.dispose = function () {
        this.primaryCursor.dispose(this.context);
        this.killSecondaryCursors();
    };
    CursorCollection.prototype.startTrackingSelections = function () {
        this.primaryCursor.startTrackingSelection(this.context);
        for (var i = 0, len = this.secondaryCursors.length; i < len; i++) {
            this.secondaryCursors[i].startTrackingSelection(this.context);
        }
    };
    CursorCollection.prototype.stopTrackingSelections = function () {
        this.primaryCursor.stopTrackingSelection(this.context);
        for (var i = 0, len = this.secondaryCursors.length; i < len; i++) {
            this.secondaryCursors[i].stopTrackingSelection(this.context);
        }
    };
    CursorCollection.prototype.updateContext = function (context) {
        this.context = context;
    };
    CursorCollection.prototype.ensureValidState = function () {
        this.primaryCursor.ensureValidState(this.context);
        for (var i = 0, len = this.secondaryCursors.length; i < len; i++) {
            this.secondaryCursors[i].ensureValidState(this.context);
        }
    };
    CursorCollection.prototype.readSelectionFromMarkers = function () {
        var result = [];
        result[0] = this.primaryCursor.readSelectionFromMarkers(this.context);
        for (var i = 0, len = this.secondaryCursors.length; i < len; i++) {
            result[i + 1] = this.secondaryCursors[i].readSelectionFromMarkers(this.context);
        }
        return result;
    };
    CursorCollection.prototype.getAll = function () {
        var result = [];
        result[0] = this.primaryCursor.asCursorState();
        for (var i = 0, len = this.secondaryCursors.length; i < len; i++) {
            result[i + 1] = this.secondaryCursors[i].asCursorState();
        }
        return result;
    };
    CursorCollection.prototype.getViewPositions = function () {
        var result = [];
        result[0] = this.primaryCursor.viewState.position;
        for (var i = 0, len = this.secondaryCursors.length; i < len; i++) {
            result[i + 1] = this.secondaryCursors[i].viewState.position;
        }
        return result;
    };
    CursorCollection.prototype.getSelections = function () {
        var result = [];
        result[0] = this.primaryCursor.modelState.selection;
        for (var i = 0, len = this.secondaryCursors.length; i < len; i++) {
            result[i + 1] = this.secondaryCursors[i].modelState.selection;
        }
        return result;
    };
    CursorCollection.prototype.getViewSelections = function () {
        var result = [];
        result[0] = this.primaryCursor.viewState.selection;
        for (var i = 0, len = this.secondaryCursors.length; i < len; i++) {
            result[i + 1] = this.secondaryCursors[i].viewState.selection;
        }
        return result;
    };
    CursorCollection.prototype.setSelections = function (selections) {
        this.setStates(CursorState.fromModelSelections(selections));
    };
    CursorCollection.prototype.getPrimaryCursor = function () {
        return this.primaryCursor.asCursorState();
    };
    CursorCollection.prototype.setStates = function (states) {
        if (states === null) {
            return;
        }
        this.primaryCursor.setState(this.context, states[0].modelState, states[0].viewState);
        this._setSecondaryStates(states.slice(1));
    };
    /**
     * Creates or disposes secondary cursors as necessary to match the number of `secondarySelections`.
     */
    CursorCollection.prototype._setSecondaryStates = function (secondaryStates) {
        var secondaryCursorsLength = this.secondaryCursors.length;
        var secondaryStatesLength = secondaryStates.length;
        if (secondaryCursorsLength < secondaryStatesLength) {
            var createCnt = secondaryStatesLength - secondaryCursorsLength;
            for (var i = 0; i < createCnt; i++) {
                this._addSecondaryCursor();
            }
        }
        else if (secondaryCursorsLength > secondaryStatesLength) {
            var removeCnt = secondaryCursorsLength - secondaryStatesLength;
            for (var i = 0; i < removeCnt; i++) {
                this._removeSecondaryCursor(this.secondaryCursors.length - 1);
            }
        }
        for (var i = 0; i < secondaryStatesLength; i++) {
            this.secondaryCursors[i].setState(this.context, secondaryStates[i].modelState, secondaryStates[i].viewState);
        }
    };
    CursorCollection.prototype.killSecondaryCursors = function () {
        this._setSecondaryStates([]);
    };
    CursorCollection.prototype._addSecondaryCursor = function () {
        this.secondaryCursors.push(new OneCursor(this.context));
        this.lastAddedCursorIndex = this.secondaryCursors.length;
    };
    CursorCollection.prototype.getLastAddedCursorIndex = function () {
        if (this.secondaryCursors.length === 0 || this.lastAddedCursorIndex === 0) {
            return 0;
        }
        return this.lastAddedCursorIndex;
    };
    CursorCollection.prototype._removeSecondaryCursor = function (removeIndex) {
        if (this.lastAddedCursorIndex >= removeIndex + 1) {
            this.lastAddedCursorIndex--;
        }
        this.secondaryCursors[removeIndex].dispose(this.context);
        this.secondaryCursors.splice(removeIndex, 1);
    };
    CursorCollection.prototype._getAll = function () {
        var result = [];
        result[0] = this.primaryCursor;
        for (var i = 0, len = this.secondaryCursors.length; i < len; i++) {
            result[i + 1] = this.secondaryCursors[i];
        }
        return result;
    };
    CursorCollection.prototype.normalize = function () {
        if (this.secondaryCursors.length === 0) {
            return;
        }
        var cursors = this._getAll();
        var sortedCursors = [];
        for (var i = 0, len = cursors.length; i < len; i++) {
            sortedCursors.push({
                index: i,
                selection: cursors[i].modelState.selection,
            });
        }
        sortedCursors.sort(function (a, b) {
            if (a.selection.startLineNumber === b.selection.startLineNumber) {
                return a.selection.startColumn - b.selection.startColumn;
            }
            return a.selection.startLineNumber - b.selection.startLineNumber;
        });
        for (var sortedCursorIndex = 0; sortedCursorIndex < sortedCursors.length - 1; sortedCursorIndex++) {
            var current = sortedCursors[sortedCursorIndex];
            var next = sortedCursors[sortedCursorIndex + 1];
            var currentSelection = current.selection;
            var nextSelection = next.selection;
            if (!this.context.config.multiCursorMergeOverlapping) {
                continue;
            }
            var shouldMergeCursors = void 0;
            if (nextSelection.isEmpty() || currentSelection.isEmpty()) {
                // Merge touching cursors if one of them is collapsed
                shouldMergeCursors = nextSelection.getStartPosition().isBeforeOrEqual(currentSelection.getEndPosition());
            }
            else {
                // Merge only overlapping cursors (i.e. allow touching ranges)
                shouldMergeCursors = nextSelection.getStartPosition().isBefore(currentSelection.getEndPosition());
            }
            if (shouldMergeCursors) {
                var winnerSortedCursorIndex = current.index < next.index ? sortedCursorIndex : sortedCursorIndex + 1;
                var looserSortedCursorIndex = current.index < next.index ? sortedCursorIndex + 1 : sortedCursorIndex;
                var looserIndex = sortedCursors[looserSortedCursorIndex].index;
                var winnerIndex = sortedCursors[winnerSortedCursorIndex].index;
                var looserSelection = sortedCursors[looserSortedCursorIndex].selection;
                var winnerSelection = sortedCursors[winnerSortedCursorIndex].selection;
                if (!looserSelection.equalsSelection(winnerSelection)) {
                    var resultingRange = looserSelection.plusRange(winnerSelection);
                    var looserSelectionIsLTR = (looserSelection.selectionStartLineNumber === looserSelection.startLineNumber && looserSelection.selectionStartColumn === looserSelection.startColumn);
                    var winnerSelectionIsLTR = (winnerSelection.selectionStartLineNumber === winnerSelection.startLineNumber && winnerSelection.selectionStartColumn === winnerSelection.startColumn);
                    // Give more importance to the last added cursor (think Ctrl-dragging + hitting another cursor)
                    var resultingSelectionIsLTR = void 0;
                    if (looserIndex === this.lastAddedCursorIndex) {
                        resultingSelectionIsLTR = looserSelectionIsLTR;
                        this.lastAddedCursorIndex = winnerIndex;
                    }
                    else {
                        // Winner takes it all
                        resultingSelectionIsLTR = winnerSelectionIsLTR;
                    }
                    var resultingSelection = void 0;
                    if (resultingSelectionIsLTR) {
                        resultingSelection = new Selection(resultingRange.startLineNumber, resultingRange.startColumn, resultingRange.endLineNumber, resultingRange.endColumn);
                    }
                    else {
                        resultingSelection = new Selection(resultingRange.endLineNumber, resultingRange.endColumn, resultingRange.startLineNumber, resultingRange.startColumn);
                    }
                    sortedCursors[winnerSortedCursorIndex].selection = resultingSelection;
                    var resultingState = CursorState.fromModelSelection(resultingSelection);
                    cursors[winnerIndex].setState(this.context, resultingState.modelState, resultingState.viewState);
                }
                for (var j = 0; j < sortedCursors.length; j++) {
                    if (sortedCursors[j].index > looserIndex) {
                        sortedCursors[j].index--;
                    }
                }
                cursors.splice(looserIndex, 1);
                sortedCursors.splice(looserSortedCursorIndex, 1);
                this._removeSecondaryCursor(looserIndex - 1);
                sortedCursorIndex--;
            }
        }
    };
    return CursorCollection;
}());
export { CursorCollection };
