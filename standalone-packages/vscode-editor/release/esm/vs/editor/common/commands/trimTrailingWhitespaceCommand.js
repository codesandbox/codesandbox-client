/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import * as strings from '../../../base/common/strings.js';
import { EditOperation } from '../core/editOperation.js';
import { Range } from '../core/range.js';
var TrimTrailingWhitespaceCommand = /** @class */ (function () {
    function TrimTrailingWhitespaceCommand(selection, cursors) {
        this.selection = selection;
        this.cursors = cursors;
    }
    TrimTrailingWhitespaceCommand.prototype.getEditOperations = function (model, builder) {
        var ops = trimTrailingWhitespace(model, this.cursors);
        for (var i = 0, len = ops.length; i < len; i++) {
            var op = ops[i];
            builder.addEditOperation(op.range, op.text);
        }
        this.selectionId = builder.trackSelection(this.selection);
    };
    TrimTrailingWhitespaceCommand.prototype.computeCursorState = function (model, helper) {
        return helper.getTrackedSelection(this.selectionId);
    };
    return TrimTrailingWhitespaceCommand;
}());
export { TrimTrailingWhitespaceCommand };
/**
 * Generate commands for trimming trailing whitespace on a model and ignore lines on which cursors are sitting.
 */
export function trimTrailingWhitespace(model, cursors) {
    // Sort cursors ascending
    cursors.sort(function (a, b) {
        if (a.lineNumber === b.lineNumber) {
            return a.column - b.column;
        }
        return a.lineNumber - b.lineNumber;
    });
    // Reduce multiple cursors on the same line and only keep the last one on the line
    for (var i = cursors.length - 2; i >= 0; i--) {
        if (cursors[i].lineNumber === cursors[i + 1].lineNumber) {
            // Remove cursor at `i`
            cursors.splice(i, 1);
        }
    }
    var r = [];
    var rLen = 0;
    var cursorIndex = 0;
    var cursorLen = cursors.length;
    for (var lineNumber = 1, lineCount = model.getLineCount(); lineNumber <= lineCount; lineNumber++) {
        var lineContent = model.getLineContent(lineNumber);
        var maxLineColumn = lineContent.length + 1;
        var minEditColumn = 0;
        if (cursorIndex < cursorLen && cursors[cursorIndex].lineNumber === lineNumber) {
            minEditColumn = cursors[cursorIndex].column;
            cursorIndex++;
            if (minEditColumn === maxLineColumn) {
                // The cursor is at the end of the line => no edits for sure on this line
                continue;
            }
        }
        if (lineContent.length === 0) {
            continue;
        }
        var lastNonWhitespaceIndex = strings.lastNonWhitespaceIndex(lineContent);
        var fromColumn = 0;
        if (lastNonWhitespaceIndex === -1) {
            // Entire line is whitespace
            fromColumn = 1;
        }
        else if (lastNonWhitespaceIndex !== lineContent.length - 1) {
            // There is trailing whitespace
            fromColumn = lastNonWhitespaceIndex + 2;
        }
        else {
            // There is no trailing whitespace
            continue;
        }
        fromColumn = Math.max(minEditColumn, fromColumn);
        r[rLen++] = EditOperation.delete(new Range(lineNumber, fromColumn, lineNumber, maxLineColumn));
    }
    return r;
}
