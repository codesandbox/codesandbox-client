/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { EditOperation } from '../../common/core/editOperation.js';
import { Position } from '../../common/core/position.js';
import { Range } from '../../common/core/range.js';
import { Selection } from '../../common/core/selection.js';
import { LanguageConfigurationRegistry } from '../../common/modes/languageConfigurationRegistry.js';
var BlockCommentCommand = /** @class */ (function () {
    function BlockCommentCommand(selection) {
        this._selection = selection;
        this._usedEndToken = null;
    }
    BlockCommentCommand._haystackHasNeedleAtOffset = function (haystack, needle, offset) {
        if (offset < 0) {
            return false;
        }
        var needleLength = needle.length;
        var haystackLength = haystack.length;
        if (offset + needleLength > haystackLength) {
            return false;
        }
        for (var i = 0; i < needleLength; i++) {
            var codeA = haystack.charCodeAt(offset + i);
            var codeB = needle.charCodeAt(i);
            if (codeA === codeB) {
                continue;
            }
            if (codeA >= 65 /* A */ && codeA <= 90 /* Z */ && codeA + 32 === codeB) {
                // codeA is upper-case variant of codeB
                continue;
            }
            if (codeB >= 65 /* A */ && codeB <= 90 /* Z */ && codeB + 32 === codeA) {
                // codeB is upper-case variant of codeA
                continue;
            }
            return false;
        }
        return true;
    };
    BlockCommentCommand.prototype._createOperationsForBlockComment = function (selection, startToken, endToken, model, builder) {
        var startLineNumber = selection.startLineNumber;
        var startColumn = selection.startColumn;
        var endLineNumber = selection.endLineNumber;
        var endColumn = selection.endColumn;
        var startLineText = model.getLineContent(startLineNumber);
        var endLineText = model.getLineContent(endLineNumber);
        var startTokenIndex = startLineText.lastIndexOf(startToken, startColumn - 1 + startToken.length);
        var endTokenIndex = endLineText.indexOf(endToken, endColumn - 1 - endToken.length);
        if (startTokenIndex !== -1 && endTokenIndex !== -1) {
            if (startLineNumber === endLineNumber) {
                var lineBetweenTokens = startLineText.substring(startTokenIndex + startToken.length, endTokenIndex);
                if (lineBetweenTokens.indexOf(endToken) >= 0) {
                    // force to add a block comment
                    startTokenIndex = -1;
                    endTokenIndex = -1;
                }
            }
            else {
                var startLineAfterStartToken = startLineText.substring(startTokenIndex + startToken.length);
                var endLineBeforeEndToken = endLineText.substring(0, endTokenIndex);
                if (startLineAfterStartToken.indexOf(endToken) >= 0 || endLineBeforeEndToken.indexOf(endToken) >= 0) {
                    // force to add a block comment
                    startTokenIndex = -1;
                    endTokenIndex = -1;
                }
            }
        }
        var ops;
        if (startTokenIndex !== -1 && endTokenIndex !== -1) {
            // Consider spaces as part of the comment tokens
            if (startTokenIndex + startToken.length < startLineText.length) {
                if (startLineText.charCodeAt(startTokenIndex + startToken.length) === 32 /* Space */) {
                    // Pretend the start token contains a trailing space
                    startToken = startToken + ' ';
                }
            }
            if (endTokenIndex > 0) {
                if (endLineText.charCodeAt(endTokenIndex - 1) === 32 /* Space */) {
                    // Pretend the end token contains a leading space
                    endToken = ' ' + endToken;
                    endTokenIndex -= 1;
                }
            }
            ops = BlockCommentCommand._createRemoveBlockCommentOperations(new Range(startLineNumber, startTokenIndex + startToken.length + 1, endLineNumber, endTokenIndex + 1), startToken, endToken);
        }
        else {
            ops = BlockCommentCommand._createAddBlockCommentOperations(selection, startToken, endToken);
            this._usedEndToken = ops.length === 1 ? endToken : null;
        }
        for (var i = 0; i < ops.length; i++) {
            builder.addTrackedEditOperation(ops[i].range, ops[i].text);
        }
    };
    BlockCommentCommand._createRemoveBlockCommentOperations = function (r, startToken, endToken) {
        var res = [];
        if (!Range.isEmpty(r)) {
            // Remove block comment start
            res.push(EditOperation.delete(new Range(r.startLineNumber, r.startColumn - startToken.length, r.startLineNumber, r.startColumn)));
            // Remove block comment end
            res.push(EditOperation.delete(new Range(r.endLineNumber, r.endColumn, r.endLineNumber, r.endColumn + endToken.length)));
        }
        else {
            // Remove both continuously
            res.push(EditOperation.delete(new Range(r.startLineNumber, r.startColumn - startToken.length, r.endLineNumber, r.endColumn + endToken.length)));
        }
        return res;
    };
    BlockCommentCommand._createAddBlockCommentOperations = function (r, startToken, endToken) {
        var res = [];
        if (!Range.isEmpty(r)) {
            // Insert block comment start
            res.push(EditOperation.insert(new Position(r.startLineNumber, r.startColumn), startToken + ' '));
            // Insert block comment end
            res.push(EditOperation.insert(new Position(r.endLineNumber, r.endColumn), ' ' + endToken));
        }
        else {
            // Insert both continuously
            res.push(EditOperation.replace(new Range(r.startLineNumber, r.startColumn, r.endLineNumber, r.endColumn), startToken + '  ' + endToken));
        }
        return res;
    };
    BlockCommentCommand.prototype.getEditOperations = function (model, builder) {
        var startLineNumber = this._selection.startLineNumber;
        var startColumn = this._selection.startColumn;
        model.tokenizeIfCheap(startLineNumber);
        var languageId = model.getLanguageIdAtPosition(startLineNumber, startColumn);
        var config = LanguageConfigurationRegistry.getComments(languageId);
        if (!config || !config.blockCommentStartToken || !config.blockCommentEndToken) {
            // Mode does not support block comments
            return;
        }
        this._createOperationsForBlockComment(this._selection, config.blockCommentStartToken, config.blockCommentEndToken, model, builder);
    };
    BlockCommentCommand.prototype.computeCursorState = function (model, helper) {
        var inverseEditOperations = helper.getInverseEditOperations();
        if (inverseEditOperations.length === 2) {
            var startTokenEditOperation = inverseEditOperations[0];
            var endTokenEditOperation = inverseEditOperations[1];
            return new Selection(startTokenEditOperation.range.endLineNumber, startTokenEditOperation.range.endColumn, endTokenEditOperation.range.startLineNumber, endTokenEditOperation.range.startColumn);
        }
        else {
            var srcRange = inverseEditOperations[0].range;
            var deltaColumn = this._usedEndToken ? -this._usedEndToken.length - 1 : 0; // minus 1 space before endToken
            return new Selection(srcRange.endLineNumber, srcRange.endColumn + deltaColumn, srcRange.endLineNumber, srcRange.endColumn + deltaColumn);
        }
    };
    return BlockCommentCommand;
}());
export { BlockCommentCommand };
