/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { Selection } from '../core/selection.js';
var ReplaceCommand = /** @class */ (function () {
    function ReplaceCommand(range, text, insertsAutoWhitespace) {
        if (insertsAutoWhitespace === void 0) { insertsAutoWhitespace = false; }
        this._range = range;
        this._text = text;
        this.insertsAutoWhitespace = insertsAutoWhitespace;
    }
    ReplaceCommand.prototype.getEditOperations = function (model, builder) {
        builder.addTrackedEditOperation(this._range, this._text);
    };
    ReplaceCommand.prototype.computeCursorState = function (model, helper) {
        var inverseEditOperations = helper.getInverseEditOperations();
        var srcRange = inverseEditOperations[0].range;
        return new Selection(srcRange.endLineNumber, srcRange.endColumn, srcRange.endLineNumber, srcRange.endColumn);
    };
    return ReplaceCommand;
}());
export { ReplaceCommand };
var ReplaceCommandWithoutChangingPosition = /** @class */ (function () {
    function ReplaceCommandWithoutChangingPosition(range, text, insertsAutoWhitespace) {
        if (insertsAutoWhitespace === void 0) { insertsAutoWhitespace = false; }
        this._range = range;
        this._text = text;
        this.insertsAutoWhitespace = insertsAutoWhitespace;
    }
    ReplaceCommandWithoutChangingPosition.prototype.getEditOperations = function (model, builder) {
        builder.addTrackedEditOperation(this._range, this._text);
    };
    ReplaceCommandWithoutChangingPosition.prototype.computeCursorState = function (model, helper) {
        var inverseEditOperations = helper.getInverseEditOperations();
        var srcRange = inverseEditOperations[0].range;
        return new Selection(srcRange.startLineNumber, srcRange.startColumn, srcRange.startLineNumber, srcRange.startColumn);
    };
    return ReplaceCommandWithoutChangingPosition;
}());
export { ReplaceCommandWithoutChangingPosition };
var ReplaceCommandWithOffsetCursorState = /** @class */ (function () {
    function ReplaceCommandWithOffsetCursorState(range, text, lineNumberDeltaOffset, columnDeltaOffset, insertsAutoWhitespace) {
        if (insertsAutoWhitespace === void 0) { insertsAutoWhitespace = false; }
        this._range = range;
        this._text = text;
        this._columnDeltaOffset = columnDeltaOffset;
        this._lineNumberDeltaOffset = lineNumberDeltaOffset;
        this.insertsAutoWhitespace = insertsAutoWhitespace;
    }
    ReplaceCommandWithOffsetCursorState.prototype.getEditOperations = function (model, builder) {
        builder.addTrackedEditOperation(this._range, this._text);
    };
    ReplaceCommandWithOffsetCursorState.prototype.computeCursorState = function (model, helper) {
        var inverseEditOperations = helper.getInverseEditOperations();
        var srcRange = inverseEditOperations[0].range;
        return new Selection(srcRange.endLineNumber + this._lineNumberDeltaOffset, srcRange.endColumn + this._columnDeltaOffset, srcRange.endLineNumber + this._lineNumberDeltaOffset, srcRange.endColumn + this._columnDeltaOffset);
    };
    return ReplaceCommandWithOffsetCursorState;
}());
export { ReplaceCommandWithOffsetCursorState };
var ReplaceCommandThatPreservesSelection = /** @class */ (function () {
    function ReplaceCommandThatPreservesSelection(editRange, text, initialSelection) {
        this._range = editRange;
        this._text = text;
        this._initialSelection = initialSelection;
    }
    ReplaceCommandThatPreservesSelection.prototype.getEditOperations = function (model, builder) {
        builder.addEditOperation(this._range, this._text);
        this._selectionId = builder.trackSelection(this._initialSelection);
    };
    ReplaceCommandThatPreservesSelection.prototype.computeCursorState = function (model, helper) {
        return helper.getTrackedSelection(this._selectionId);
    };
    return ReplaceCommandThatPreservesSelection;
}());
export { ReplaceCommandThatPreservesSelection };
