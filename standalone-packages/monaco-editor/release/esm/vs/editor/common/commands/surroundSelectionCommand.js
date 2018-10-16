/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { Range } from '../core/range.js';
import { Selection } from '../core/selection.js';
var SurroundSelectionCommand = /** @class */ (function () {
    function SurroundSelectionCommand(range, charBeforeSelection, charAfterSelection) {
        this._range = range;
        this._charBeforeSelection = charBeforeSelection;
        this._charAfterSelection = charAfterSelection;
    }
    SurroundSelectionCommand.prototype.getEditOperations = function (model, builder) {
        builder.addTrackedEditOperation(new Range(this._range.startLineNumber, this._range.startColumn, this._range.startLineNumber, this._range.startColumn), this._charBeforeSelection);
        builder.addTrackedEditOperation(new Range(this._range.endLineNumber, this._range.endColumn, this._range.endLineNumber, this._range.endColumn), this._charAfterSelection);
    };
    SurroundSelectionCommand.prototype.computeCursorState = function (model, helper) {
        var inverseEditOperations = helper.getInverseEditOperations();
        var firstOperationRange = inverseEditOperations[0].range;
        var secondOperationRange = inverseEditOperations[1].range;
        return new Selection(firstOperationRange.endLineNumber, firstOperationRange.endColumn, secondOperationRange.endLineNumber, secondOperationRange.endColumn - this._charAfterSelection.length);
    };
    return SurroundSelectionCommand;
}());
export { SurroundSelectionCommand };
