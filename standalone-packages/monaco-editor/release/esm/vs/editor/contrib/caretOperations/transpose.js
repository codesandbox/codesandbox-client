/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import * as nls from '../../../nls.js';
import { isLowSurrogate, isHighSurrogate } from '../../../base/common/strings.js';
import { Range } from '../../common/core/range.js';
import { Position } from '../../common/core/position.js';
import { EditorContextKeys } from '../../common/editorContextKeys.js';
import { registerEditorAction, EditorAction } from '../../browser/editorExtensions.js';
import { ReplaceCommand } from '../../common/commands/replaceCommand.js';
var TransposeLettersAction = /** @class */ (function (_super) {
    __extends(TransposeLettersAction, _super);
    function TransposeLettersAction() {
        return _super.call(this, {
            id: 'editor.action.transposeLetters',
            label: nls.localize('transposeLetters.label', "Transpose Letters"),
            alias: 'Transpose Letters',
            precondition: EditorContextKeys.writable,
            kbOpts: {
                kbExpr: EditorContextKeys.textInputFocus,
                primary: 0,
                mac: {
                    primary: 256 /* WinCtrl */ | 50 /* KEY_T */
                }
            }
        }) || this;
    }
    TransposeLettersAction.prototype.positionLeftOf = function (start, model) {
        var column = start.column;
        var lineNumber = start.lineNumber;
        if (column > model.getLineMinColumn(lineNumber)) {
            if (isLowSurrogate(model.getLineContent(lineNumber).charCodeAt(column - 2))) {
                // character before column is a low surrogate
                column = column - 2;
            }
            else {
                column = column - 1;
            }
        }
        else if (lineNumber > 1) {
            lineNumber = lineNumber - 1;
            column = model.getLineMaxColumn(lineNumber);
        }
        return new Position(lineNumber, column);
    };
    TransposeLettersAction.prototype.positionRightOf = function (start, model) {
        var column = start.column;
        var lineNumber = start.lineNumber;
        if (column < model.getLineMaxColumn(lineNumber)) {
            if (isHighSurrogate(model.getLineContent(lineNumber).charCodeAt(column - 1))) {
                // character after column is a high surrogate
                column = column + 2;
            }
            else {
                column = column + 1;
            }
        }
        else if (lineNumber < model.getLineCount()) {
            lineNumber = lineNumber + 1;
            column = 0;
        }
        return new Position(lineNumber, column);
    };
    TransposeLettersAction.prototype.run = function (accessor, editor) {
        var model = editor.getModel();
        var commands = [];
        var selections = editor.getSelections();
        for (var _i = 0, selections_1 = selections; _i < selections_1.length; _i++) {
            var selection = selections_1[_i];
            if (!selection.isEmpty()) {
                continue;
            }
            var lineNumber = selection.startLineNumber;
            var column = selection.startColumn;
            var lastColumn = model.getLineMaxColumn(lineNumber);
            if (lineNumber === 1 && (column === 1 || (column === 2 && lastColumn === 2))) {
                // at beginning of file, nothing to do
                continue;
            }
            // handle special case: when at end of line, transpose left two chars
            // otherwise, transpose left and right chars
            var endPosition = (column === lastColumn) ?
                selection.getPosition() :
                this.positionRightOf(selection.getPosition(), model);
            var middlePosition = this.positionLeftOf(endPosition, model);
            var beginPosition = this.positionLeftOf(middlePosition, model);
            var leftChar = model.getValueInRange(Range.fromPositions(beginPosition, middlePosition));
            var rightChar = model.getValueInRange(Range.fromPositions(middlePosition, endPosition));
            var replaceRange = Range.fromPositions(beginPosition, endPosition);
            commands.push(new ReplaceCommand(replaceRange, rightChar + leftChar));
        }
        if (commands.length > 0) {
            editor.pushUndoStop();
            editor.executeCommands(this.id, commands);
            editor.pushUndoStop();
        }
    };
    return TransposeLettersAction;
}(EditorAction));
registerEditorAction(TransposeLettersAction);
