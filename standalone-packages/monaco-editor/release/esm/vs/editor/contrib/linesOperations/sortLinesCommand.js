/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { EditOperation } from '../../common/core/editOperation.js';
import { Range } from '../../common/core/range.js';
var SortLinesCommand = /** @class */ (function () {
    function SortLinesCommand(selection, descending) {
        this.selection = selection;
        this.descending = descending;
    }
    SortLinesCommand.prototype.getEditOperations = function (model, builder) {
        var op = sortLines(model, this.selection, this.descending);
        if (op) {
            builder.addEditOperation(op.range, op.text);
        }
        this.selectionId = builder.trackSelection(this.selection);
    };
    SortLinesCommand.prototype.computeCursorState = function (model, helper) {
        return helper.getTrackedSelection(this.selectionId);
    };
    SortLinesCommand.canRun = function (model, selection, descending) {
        var data = getSortData(model, selection, descending);
        if (!data) {
            return false;
        }
        for (var i = 0, len = data.before.length; i < len; i++) {
            if (data.before[i] !== data.after[i]) {
                return true;
            }
        }
        return false;
    };
    return SortLinesCommand;
}());
export { SortLinesCommand };
function getSortData(model, selection, descending) {
    var startLineNumber = selection.startLineNumber;
    var endLineNumber = selection.endLineNumber;
    if (selection.endColumn === 1) {
        endLineNumber--;
    }
    // Nothing to sort if user didn't select anything.
    if (startLineNumber >= endLineNumber) {
        return null;
    }
    var linesToSort = [];
    // Get the contents of the selection to be sorted.
    for (var lineNumber = startLineNumber; lineNumber <= endLineNumber; lineNumber++) {
        linesToSort.push(model.getLineContent(lineNumber));
    }
    var sorted = linesToSort.slice(0);
    sorted.sort(function (a, b) {
        return a.toLowerCase().localeCompare(b.toLowerCase());
    });
    // If descending, reverse the order.
    if (descending === true) {
        sorted = sorted.reverse();
    }
    return {
        startLineNumber: startLineNumber,
        endLineNumber: endLineNumber,
        before: linesToSort,
        after: sorted
    };
}
/**
 * Generate commands for sorting lines on a model.
 */
function sortLines(model, selection, descending) {
    var data = getSortData(model, selection, descending);
    if (!data) {
        return null;
    }
    return EditOperation.replace(new Range(data.startLineNumber, 1, data.endLineNumber, model.getLineMaxColumn(data.endLineNumber)), data.after.join('\n'));
}
