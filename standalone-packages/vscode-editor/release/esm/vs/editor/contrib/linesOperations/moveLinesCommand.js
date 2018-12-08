/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as strings from '../../../base/common/strings.js';
import { ShiftCommand } from '../../common/commands/shiftCommand.js';
import { Range } from '../../common/core/range.js';
import { Selection } from '../../common/core/selection.js';
import { IndentAction } from '../../common/modes/languageConfiguration.js';
import { LanguageConfigurationRegistry } from '../../common/modes/languageConfigurationRegistry.js';
import * as indentUtils from '../indentation/indentUtils.js';
var MoveLinesCommand = /** @class */ (function () {
    function MoveLinesCommand(selection, isMovingDown, autoIndent) {
        this._selection = selection;
        this._isMovingDown = isMovingDown;
        this._autoIndent = autoIndent;
        this._moveEndLineSelectionShrink = false;
    }
    MoveLinesCommand.prototype.getEditOperations = function (model, builder) {
        var modelLineCount = model.getLineCount();
        if (this._isMovingDown && this._selection.endLineNumber === modelLineCount) {
            return;
        }
        if (!this._isMovingDown && this._selection.startLineNumber === 1) {
            return;
        }
        this._moveEndPositionDown = false;
        var s = this._selection;
        if (s.startLineNumber < s.endLineNumber && s.endColumn === 1) {
            this._moveEndPositionDown = true;
            s = s.setEndPosition(s.endLineNumber - 1, model.getLineMaxColumn(s.endLineNumber - 1));
        }
        var tabSize = model.getOptions().tabSize;
        var insertSpaces = model.getOptions().insertSpaces;
        var indentConverter = this.buildIndentConverter(tabSize);
        var virtualModel = {
            getLineTokens: function (lineNumber) {
                return model.getLineTokens(lineNumber);
            },
            getLanguageIdentifier: function () {
                return model.getLanguageIdentifier();
            },
            getLanguageIdAtPosition: function (lineNumber, column) {
                return model.getLanguageIdAtPosition(lineNumber, column);
            },
            getLineContent: null,
        };
        if (s.startLineNumber === s.endLineNumber && model.getLineMaxColumn(s.startLineNumber) === 1) {
            // Current line is empty
            var lineNumber = s.startLineNumber;
            var otherLineNumber = (this._isMovingDown ? lineNumber + 1 : lineNumber - 1);
            if (model.getLineMaxColumn(otherLineNumber) === 1) {
                // Other line number is empty too, so no editing is needed
                // Add a no-op to force running by the model
                builder.addEditOperation(new Range(1, 1, 1, 1), null);
            }
            else {
                // Type content from other line number on line number
                builder.addEditOperation(new Range(lineNumber, 1, lineNumber, 1), model.getLineContent(otherLineNumber));
                // Remove content from other line number
                builder.addEditOperation(new Range(otherLineNumber, 1, otherLineNumber, model.getLineMaxColumn(otherLineNumber)), null);
            }
            // Track selection at the other line number
            s = new Selection(otherLineNumber, 1, otherLineNumber, 1);
        }
        else {
            var movingLineNumber_1;
            var movingLineText = void 0;
            if (this._isMovingDown) {
                movingLineNumber_1 = s.endLineNumber + 1;
                movingLineText = model.getLineContent(movingLineNumber_1);
                // Delete line that needs to be moved
                builder.addEditOperation(new Range(movingLineNumber_1 - 1, model.getLineMaxColumn(movingLineNumber_1 - 1), movingLineNumber_1, model.getLineMaxColumn(movingLineNumber_1)), null);
                var insertingText_1 = movingLineText;
                if (this.shouldAutoIndent(model, s)) {
                    var movingLineMatchResult = this.matchEnterRule(model, indentConverter, tabSize, movingLineNumber_1, s.startLineNumber - 1);
                    // if s.startLineNumber - 1 matches onEnter rule, we still honor that.
                    if (movingLineMatchResult !== null) {
                        var oldIndentation = strings.getLeadingWhitespace(model.getLineContent(movingLineNumber_1));
                        var newSpaceCnt = movingLineMatchResult + indentUtils.getSpaceCnt(oldIndentation, tabSize);
                        var newIndentation = indentUtils.generateIndent(newSpaceCnt, tabSize, insertSpaces);
                        insertingText_1 = newIndentation + this.trimLeft(movingLineText);
                    }
                    else {
                        // no enter rule matches, let's check indentatin rules then.
                        virtualModel.getLineContent = function (lineNumber) {
                            if (lineNumber === s.startLineNumber) {
                                return model.getLineContent(movingLineNumber_1);
                            }
                            else {
                                return model.getLineContent(lineNumber);
                            }
                        };
                        var indentOfMovingLine = LanguageConfigurationRegistry.getGoodIndentForLine(virtualModel, model.getLanguageIdAtPosition(movingLineNumber_1, 1), s.startLineNumber, indentConverter);
                        if (indentOfMovingLine !== null) {
                            var oldIndentation = strings.getLeadingWhitespace(model.getLineContent(movingLineNumber_1));
                            var newSpaceCnt = indentUtils.getSpaceCnt(indentOfMovingLine, tabSize);
                            var oldSpaceCnt = indentUtils.getSpaceCnt(oldIndentation, tabSize);
                            if (newSpaceCnt !== oldSpaceCnt) {
                                var newIndentation = indentUtils.generateIndent(newSpaceCnt, tabSize, insertSpaces);
                                insertingText_1 = newIndentation + this.trimLeft(movingLineText);
                            }
                        }
                    }
                    // add edit operations for moving line first to make sure it's executed after we make indentation change
                    // to s.startLineNumber
                    builder.addEditOperation(new Range(s.startLineNumber, 1, s.startLineNumber, 1), insertingText_1 + '\n');
                    var ret = this.matchEnterRule(model, indentConverter, tabSize, s.startLineNumber, s.startLineNumber, insertingText_1);
                    // check if the line being moved before matches onEnter rules, if so let's adjust the indentation by onEnter rules.
                    if (ret !== null) {
                        if (ret !== 0) {
                            this.getIndentEditsOfMovingBlock(model, builder, s, tabSize, insertSpaces, ret);
                        }
                    }
                    else {
                        // it doesn't match onEnter rules, let's check indentation rules then.
                        virtualModel.getLineContent = function (lineNumber) {
                            if (lineNumber === s.startLineNumber) {
                                return insertingText_1;
                            }
                            else if (lineNumber >= s.startLineNumber + 1 && lineNumber <= s.endLineNumber + 1) {
                                return model.getLineContent(lineNumber - 1);
                            }
                            else {
                                return model.getLineContent(lineNumber);
                            }
                        };
                        var newIndentatOfMovingBlock = LanguageConfigurationRegistry.getGoodIndentForLine(virtualModel, model.getLanguageIdAtPosition(movingLineNumber_1, 1), s.startLineNumber + 1, indentConverter);
                        if (newIndentatOfMovingBlock !== null) {
                            var oldIndentation = strings.getLeadingWhitespace(model.getLineContent(s.startLineNumber));
                            var newSpaceCnt = indentUtils.getSpaceCnt(newIndentatOfMovingBlock, tabSize);
                            var oldSpaceCnt = indentUtils.getSpaceCnt(oldIndentation, tabSize);
                            if (newSpaceCnt !== oldSpaceCnt) {
                                var spaceCntOffset = newSpaceCnt - oldSpaceCnt;
                                this.getIndentEditsOfMovingBlock(model, builder, s, tabSize, insertSpaces, spaceCntOffset);
                            }
                        }
                    }
                }
                else {
                    // Insert line that needs to be moved before
                    builder.addEditOperation(new Range(s.startLineNumber, 1, s.startLineNumber, 1), insertingText_1 + '\n');
                }
            }
            else {
                movingLineNumber_1 = s.startLineNumber - 1;
                movingLineText = model.getLineContent(movingLineNumber_1);
                // Delete line that needs to be moved
                builder.addEditOperation(new Range(movingLineNumber_1, 1, movingLineNumber_1 + 1, 1), null);
                // Insert line that needs to be moved after
                builder.addEditOperation(new Range(s.endLineNumber, model.getLineMaxColumn(s.endLineNumber), s.endLineNumber, model.getLineMaxColumn(s.endLineNumber)), '\n' + movingLineText);
                if (this.shouldAutoIndent(model, s)) {
                    virtualModel.getLineContent = function (lineNumber) {
                        if (lineNumber === movingLineNumber_1) {
                            return model.getLineContent(s.startLineNumber);
                        }
                        else {
                            return model.getLineContent(lineNumber);
                        }
                    };
                    var ret = this.matchEnterRule(model, indentConverter, tabSize, s.startLineNumber, s.startLineNumber - 2);
                    // check if s.startLineNumber - 2 matches onEnter rules, if so adjust the moving block by onEnter rules.
                    if (ret !== null) {
                        if (ret !== 0) {
                            this.getIndentEditsOfMovingBlock(model, builder, s, tabSize, insertSpaces, ret);
                        }
                    }
                    else {
                        // it doesn't match any onEnter rule, let's check indentation rules then.
                        var indentOfFirstLine = LanguageConfigurationRegistry.getGoodIndentForLine(virtualModel, model.getLanguageIdAtPosition(s.startLineNumber, 1), movingLineNumber_1, indentConverter);
                        if (indentOfFirstLine !== null) {
                            // adjust the indentation of the moving block
                            var oldIndent = strings.getLeadingWhitespace(model.getLineContent(s.startLineNumber));
                            var newSpaceCnt = indentUtils.getSpaceCnt(indentOfFirstLine, tabSize);
                            var oldSpaceCnt = indentUtils.getSpaceCnt(oldIndent, tabSize);
                            if (newSpaceCnt !== oldSpaceCnt) {
                                var spaceCntOffset = newSpaceCnt - oldSpaceCnt;
                                this.getIndentEditsOfMovingBlock(model, builder, s, tabSize, insertSpaces, spaceCntOffset);
                            }
                        }
                    }
                }
            }
        }
        this._selectionId = builder.trackSelection(s);
    };
    MoveLinesCommand.prototype.buildIndentConverter = function (tabSize) {
        return {
            shiftIndent: function (indentation) {
                var desiredIndentCount = ShiftCommand.shiftIndentCount(indentation, indentation.length + 1, tabSize);
                var newIndentation = '';
                for (var i = 0; i < desiredIndentCount; i++) {
                    newIndentation += '\t';
                }
                return newIndentation;
            },
            unshiftIndent: function (indentation) {
                var desiredIndentCount = ShiftCommand.unshiftIndentCount(indentation, indentation.length + 1, tabSize);
                var newIndentation = '';
                for (var i = 0; i < desiredIndentCount; i++) {
                    newIndentation += '\t';
                }
                return newIndentation;
            }
        };
    };
    MoveLinesCommand.prototype.matchEnterRule = function (model, indentConverter, tabSize, line, oneLineAbove, oneLineAboveText) {
        var validPrecedingLine = oneLineAbove;
        while (validPrecedingLine >= 1) {
            // ship empty lines as empty lines just inherit indentation
            var lineContent = void 0;
            if (validPrecedingLine === oneLineAbove && oneLineAboveText !== undefined) {
                lineContent = oneLineAboveText;
            }
            else {
                lineContent = model.getLineContent(validPrecedingLine);
            }
            var nonWhitespaceIdx = strings.lastNonWhitespaceIndex(lineContent);
            if (nonWhitespaceIdx >= 0) {
                break;
            }
            validPrecedingLine--;
        }
        if (validPrecedingLine < 1 || line > model.getLineCount()) {
            return null;
        }
        var maxColumn = model.getLineMaxColumn(validPrecedingLine);
        var enter = LanguageConfigurationRegistry.getEnterAction(model, new Range(validPrecedingLine, maxColumn, validPrecedingLine, maxColumn));
        if (enter) {
            var enterPrefix = enter.indentation;
            var enterAction = enter.enterAction;
            if (enterAction.indentAction === IndentAction.None) {
                enterPrefix = enter.indentation + enterAction.appendText;
            }
            else if (enterAction.indentAction === IndentAction.Indent) {
                enterPrefix = enter.indentation + enterAction.appendText;
            }
            else if (enterAction.indentAction === IndentAction.IndentOutdent) {
                enterPrefix = enter.indentation;
            }
            else if (enterAction.indentAction === IndentAction.Outdent) {
                enterPrefix = indentConverter.unshiftIndent(enter.indentation) + enterAction.appendText;
            }
            var movingLineText = model.getLineContent(line);
            if (this.trimLeft(movingLineText).indexOf(this.trimLeft(enterPrefix)) >= 0) {
                var oldIndentation = strings.getLeadingWhitespace(model.getLineContent(line));
                var newIndentation = strings.getLeadingWhitespace(enterPrefix);
                var indentMetadataOfMovelingLine = LanguageConfigurationRegistry.getIndentMetadata(model, line);
                if (indentMetadataOfMovelingLine !== null && indentMetadataOfMovelingLine & 2 /* DECREASE_MASK */) {
                    newIndentation = indentConverter.unshiftIndent(newIndentation);
                }
                var newSpaceCnt = indentUtils.getSpaceCnt(newIndentation, tabSize);
                var oldSpaceCnt = indentUtils.getSpaceCnt(oldIndentation, tabSize);
                return newSpaceCnt - oldSpaceCnt;
            }
        }
        return null;
    };
    MoveLinesCommand.prototype.trimLeft = function (str) {
        return str.replace(/^\s+/, '');
    };
    MoveLinesCommand.prototype.shouldAutoIndent = function (model, selection) {
        if (!this._autoIndent) {
            return false;
        }
        // if it's not easy to tokenize, we stop auto indent.
        if (!model.isCheapToTokenize(selection.startLineNumber)) {
            return false;
        }
        var languageAtSelectionStart = model.getLanguageIdAtPosition(selection.startLineNumber, 1);
        var languageAtSelectionEnd = model.getLanguageIdAtPosition(selection.endLineNumber, 1);
        if (languageAtSelectionStart !== languageAtSelectionEnd) {
            return false;
        }
        if (LanguageConfigurationRegistry.getIndentRulesSupport(languageAtSelectionStart) === null) {
            return false;
        }
        return true;
    };
    MoveLinesCommand.prototype.getIndentEditsOfMovingBlock = function (model, builder, s, tabSize, insertSpaces, offset) {
        for (var i = s.startLineNumber; i <= s.endLineNumber; i++) {
            var lineContent = model.getLineContent(i);
            var originalIndent = strings.getLeadingWhitespace(lineContent);
            var originalSpacesCnt = indentUtils.getSpaceCnt(originalIndent, tabSize);
            var newSpacesCnt = originalSpacesCnt + offset;
            var newIndent = indentUtils.generateIndent(newSpacesCnt, tabSize, insertSpaces);
            if (newIndent !== originalIndent) {
                builder.addEditOperation(new Range(i, 1, i, originalIndent.length + 1), newIndent);
                if (i === s.endLineNumber && s.endColumn <= originalIndent.length + 1 && newIndent === '') {
                    // as users select part of the original indent white spaces
                    // when we adjust the indentation of endLine, we should adjust the cursor position as well.
                    this._moveEndLineSelectionShrink = true;
                }
            }
        }
    };
    MoveLinesCommand.prototype.computeCursorState = function (model, helper) {
        var result = helper.getTrackedSelection(this._selectionId);
        if (this._moveEndPositionDown) {
            result = result.setEndPosition(result.endLineNumber + 1, 1);
        }
        if (this._moveEndLineSelectionShrink && result.startLineNumber < result.endLineNumber) {
            result = result.setEndPosition(result.endLineNumber, 2);
        }
        return result;
    };
    return MoveLinesCommand;
}());
export { MoveLinesCommand };
