/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { CursorState, SingleCursorState } from './cursorCommon.js';
import { Position } from '../core/position.js';
import { Range } from '../core/range.js';
import { Selection } from '../core/selection.js';
var OneCursor = /** @class */ (function () {
    function OneCursor(context) {
        this._selTrackedRange = null;
        this._trackSelection = true;
        this._setState(context, new SingleCursorState(new Range(1, 1, 1, 1), 0, new Position(1, 1), 0), new SingleCursorState(new Range(1, 1, 1, 1), 0, new Position(1, 1), 0));
    }
    OneCursor.prototype.dispose = function (context) {
        this._removeTrackedRange(context);
    };
    OneCursor.prototype.startTrackingSelection = function (context) {
        this._trackSelection = true;
        this._updateTrackedRange(context);
    };
    OneCursor.prototype.stopTrackingSelection = function (context) {
        this._trackSelection = false;
        this._removeTrackedRange(context);
    };
    OneCursor.prototype._updateTrackedRange = function (context) {
        if (!this._trackSelection) {
            // don't track the selection
            return;
        }
        this._selTrackedRange = context.model._setTrackedRange(this._selTrackedRange, this.modelState.selection, 0 /* AlwaysGrowsWhenTypingAtEdges */);
    };
    OneCursor.prototype._removeTrackedRange = function (context) {
        this._selTrackedRange = context.model._setTrackedRange(this._selTrackedRange, null, 0 /* AlwaysGrowsWhenTypingAtEdges */);
    };
    OneCursor.prototype.asCursorState = function () {
        return new CursorState(this.modelState, this.viewState);
    };
    OneCursor.prototype.readSelectionFromMarkers = function (context) {
        var range = context.model._getTrackedRange(this._selTrackedRange);
        if (this.modelState.selection.getDirection() === 0 /* LTR */) {
            return new Selection(range.startLineNumber, range.startColumn, range.endLineNumber, range.endColumn);
        }
        return new Selection(range.endLineNumber, range.endColumn, range.startLineNumber, range.startColumn);
    };
    OneCursor.prototype.ensureValidState = function (context) {
        this._setState(context, this.modelState, this.viewState);
    };
    OneCursor.prototype.setState = function (context, modelState, viewState) {
        this._setState(context, modelState, viewState);
    };
    OneCursor.prototype._setState = function (context, modelState, viewState) {
        if (!modelState) {
            if (!viewState) {
                return;
            }
            // We only have the view state => compute the model state
            var selectionStart = context.model.validateRange(context.convertViewRangeToModelRange(viewState.selectionStart));
            var position = context.model.validatePosition(context.convertViewPositionToModelPosition(viewState.position.lineNumber, viewState.position.column));
            modelState = new SingleCursorState(selectionStart, viewState.selectionStartLeftoverVisibleColumns, position, viewState.leftoverVisibleColumns);
        }
        else {
            // Validate new model state
            var selectionStart = context.model.validateRange(modelState.selectionStart);
            var selectionStartLeftoverVisibleColumns = modelState.selectionStart.equalsRange(selectionStart) ? modelState.selectionStartLeftoverVisibleColumns : 0;
            var position = context.model.validatePosition(modelState.position);
            var leftoverVisibleColumns = modelState.position.equals(position) ? modelState.leftoverVisibleColumns : 0;
            modelState = new SingleCursorState(selectionStart, selectionStartLeftoverVisibleColumns, position, leftoverVisibleColumns);
        }
        if (!viewState) {
            // We only have the model state => compute the view state
            var viewSelectionStart1 = context.convertModelPositionToViewPosition(new Position(modelState.selectionStart.startLineNumber, modelState.selectionStart.startColumn));
            var viewSelectionStart2 = context.convertModelPositionToViewPosition(new Position(modelState.selectionStart.endLineNumber, modelState.selectionStart.endColumn));
            var viewSelectionStart = new Range(viewSelectionStart1.lineNumber, viewSelectionStart1.column, viewSelectionStart2.lineNumber, viewSelectionStart2.column);
            var viewPosition = context.convertModelPositionToViewPosition(modelState.position);
            viewState = new SingleCursorState(viewSelectionStart, modelState.selectionStartLeftoverVisibleColumns, viewPosition, modelState.leftoverVisibleColumns);
        }
        else {
            // Validate new view state
            var viewSelectionStart = context.validateViewRange(viewState.selectionStart, modelState.selectionStart);
            var viewPosition = context.validateViewPosition(viewState.position, modelState.position);
            viewState = new SingleCursorState(viewSelectionStart, modelState.selectionStartLeftoverVisibleColumns, viewPosition, modelState.leftoverVisibleColumns);
        }
        this.modelState = modelState;
        this.viewState = viewState;
        this._updateTrackedRange(context);
    };
    return OneCursor;
}());
export { OneCursor };
