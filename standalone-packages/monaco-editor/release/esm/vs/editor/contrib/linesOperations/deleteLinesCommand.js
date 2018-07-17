/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { Range } from '../../common/core/range.js';
import { Selection } from '../../common/core/selection.js';
var DeleteLinesCommand = /** @class */ (function () {
    function DeleteLinesCommand(startLineNumber, endLineNumber, restoreCursorToColumn) {
        this.startLineNumber = startLineNumber;
        this.endLineNumber = endLineNumber;
        this.restoreCursorToColumn = restoreCursorToColumn;
    }
    DeleteLinesCommand.prototype.getEditOperations = function (model, builder) {
        if (model.getLineCount() === 1 && model.getLineMaxColumn(1) === 1) {
            // Model is empty
            return;
        }
        var startLineNumber = this.startLineNumber;
        var endLineNumber = this.endLineNumber;
        var startColumn = 1;
        var endColumn = model.getLineMaxColumn(endLineNumber);
        if (endLineNumber < model.getLineCount()) {
            endLineNumber += 1;
            endColumn = 1;
        }
        else if (startLineNumber > 1) {
            startLineNumber -= 1;
            startColumn = model.getLineMaxColumn(startLineNumber);
        }
        builder.addTrackedEditOperation(new Range(startLineNumber, startColumn, endLineNumber, endColumn), null);
    };
    DeleteLinesCommand.prototype.computeCursorState = function (model, helper) {
        var inverseEditOperations = helper.getInverseEditOperations();
        var srcRange = inverseEditOperations[0].range;
        return new Selection(srcRange.endLineNumber, this.restoreCursorToColumn, srcRange.endLineNumber, this.restoreCursorToColumn);
    };
    return DeleteLinesCommand;
}());
export { DeleteLinesCommand };
