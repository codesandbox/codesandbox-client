/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { Position } from '../../core/position.js';
import { Range } from '../../core/range.js';
import { leftest, righttest, updateTreeMetadata, rbDelete, fixInsert, SENTINEL, TreeNode } from './rbTreeBase.js';
import { isValidMatch, Searcher, createFindMatch } from '../textModelSearch.js';
import { FindMatch } from '../../model.js';
// const lfRegex = new RegExp(/\r\n|\r|\n/g);
export var AverageBufferSize = 65535;
export function createUintArray(arr) {
    var r;
    if (arr[arr.length - 1] < 65536) {
        r = new Uint16Array(arr.length);
    }
    else {
        r = new Uint32Array(arr.length);
    }
    r.set(arr, 0);
    return r;
}
var LineStarts = /** @class */ (function () {
    function LineStarts(lineStarts, cr, lf, crlf, isBasicASCII) {
        this.lineStarts = lineStarts;
        this.cr = cr;
        this.lf = lf;
        this.crlf = crlf;
        this.isBasicASCII = isBasicASCII;
    }
    return LineStarts;
}());
export { LineStarts };
export function createLineStartsFast(str, readonly) {
    if (readonly === void 0) { readonly = true; }
    var r = [0], rLength = 1;
    for (var i = 0, len = str.length; i < len; i++) {
        var chr = str.charCodeAt(i);
        if (chr === 13 /* CarriageReturn */) {
            if (i + 1 < len && str.charCodeAt(i + 1) === 10 /* LineFeed */) {
                // \r\n... case
                r[rLength++] = i + 2;
                i++; // skip \n
            }
            else {
                // \r... case
                r[rLength++] = i + 1;
            }
        }
        else if (chr === 10 /* LineFeed */) {
            r[rLength++] = i + 1;
        }
    }
    if (readonly) {
        return createUintArray(r);
    }
    else {
        return r;
    }
}
export function createLineStarts(r, str) {
    r.length = 0;
    r[0] = 0;
    var rLength = 1;
    var cr = 0, lf = 0, crlf = 0;
    var isBasicASCII = true;
    for (var i = 0, len = str.length; i < len; i++) {
        var chr = str.charCodeAt(i);
        if (chr === 13 /* CarriageReturn */) {
            if (i + 1 < len && str.charCodeAt(i + 1) === 10 /* LineFeed */) {
                // \r\n... case
                crlf++;
                r[rLength++] = i + 2;
                i++; // skip \n
            }
            else {
                cr++;
                // \r... case
                r[rLength++] = i + 1;
            }
        }
        else if (chr === 10 /* LineFeed */) {
            lf++;
            r[rLength++] = i + 1;
        }
        else {
            if (isBasicASCII) {
                if (chr !== 9 /* Tab */ && (chr < 32 || chr > 126)) {
                    isBasicASCII = false;
                }
            }
        }
    }
    var result = new LineStarts(createUintArray(r), cr, lf, crlf, isBasicASCII);
    r.length = 0;
    return result;
}
var Piece = /** @class */ (function () {
    function Piece(bufferIndex, start, end, lineFeedCnt, length) {
        this.bufferIndex = bufferIndex;
        this.start = start;
        this.end = end;
        this.lineFeedCnt = lineFeedCnt;
        this.length = length;
    }
    return Piece;
}());
export { Piece };
var StringBuffer = /** @class */ (function () {
    function StringBuffer(buffer, lineStarts) {
        this.buffer = buffer;
        this.lineStarts = lineStarts;
    }
    return StringBuffer;
}());
export { StringBuffer };
/**
 * Readonly snapshot for piece tree.
 * In a real multiple thread environment, to make snapshot reading always work correctly, we need to
 * 1. Make TreeNode.piece immutable, then reading and writing can run in parallel.
 * 2. TreeNode/Buffers normalization should not happen during snapshot reading.
 */
var PieceTreeSnapshot = /** @class */ (function () {
    function PieceTreeSnapshot(tree, BOM) {
        var _this = this;
        this._pieces = [];
        this._tree = tree;
        this._BOM = BOM;
        this._index = 0;
        if (tree.root !== SENTINEL) {
            tree.iterate(tree.root, function (node) {
                if (node !== SENTINEL) {
                    _this._pieces.push(node.piece);
                }
                return true;
            });
        }
    }
    PieceTreeSnapshot.prototype.read = function () {
        if (this._pieces.length === 0) {
            if (this._index === 0) {
                this._index++;
                return this._BOM;
            }
            else {
                return null;
            }
        }
        if (this._index > this._pieces.length - 1) {
            return null;
        }
        if (this._index === 0) {
            return this._BOM + this._tree.getPieceContent(this._pieces[this._index++]);
        }
        return this._tree.getPieceContent(this._pieces[this._index++]);
    };
    return PieceTreeSnapshot;
}());
var PieceTreeSearchCache = /** @class */ (function () {
    function PieceTreeSearchCache(limit) {
        this._limit = limit;
        this._cache = [];
    }
    PieceTreeSearchCache.prototype.get = function (offset) {
        for (var i = this._cache.length - 1; i >= 0; i--) {
            var nodePos = this._cache[i];
            if (nodePos.nodeStartOffset <= offset && nodePos.nodeStartOffset + nodePos.node.piece.length >= offset) {
                return nodePos;
            }
        }
        return null;
    };
    PieceTreeSearchCache.prototype.get2 = function (lineNumber) {
        for (var i = this._cache.length - 1; i >= 0; i--) {
            var nodePos = this._cache[i];
            if (nodePos.nodeStartLineNumber && nodePos.nodeStartLineNumber < lineNumber && nodePos.nodeStartLineNumber + nodePos.node.piece.lineFeedCnt >= lineNumber) {
                return nodePos;
            }
        }
        return null;
    };
    PieceTreeSearchCache.prototype.set = function (nodePosition) {
        if (this._cache.length >= this._limit) {
            this._cache.shift();
        }
        this._cache.push(nodePosition);
    };
    PieceTreeSearchCache.prototype.valdiate = function (offset) {
        var hasInvalidVal = false;
        for (var i = 0; i < this._cache.length; i++) {
            var nodePos = this._cache[i];
            if (nodePos.node.parent === null || nodePos.nodeStartOffset >= offset) {
                this._cache[i] = null;
                hasInvalidVal = true;
                continue;
            }
        }
        if (hasInvalidVal) {
            var newArr = [];
            for (var i = 0; i < this._cache.length; i++) {
                if (this._cache[i] !== null) {
                    newArr.push(this._cache[i]);
                }
            }
            this._cache = newArr;
        }
    };
    return PieceTreeSearchCache;
}());
var PieceTreeBase = /** @class */ (function () {
    function PieceTreeBase(chunks, eol, eolNormalized) {
        this.create(chunks, eol, eolNormalized);
    }
    PieceTreeBase.prototype.create = function (chunks, eol, eolNormalized) {
        this._buffers = [
            new StringBuffer('', [0])
        ];
        this._lastChangeBufferPos = { line: 0, column: 0 };
        this.root = SENTINEL;
        this._lineCnt = 1;
        this._length = 0;
        this._EOL = eol;
        this._EOLLength = eol.length;
        this._EOLNormalized = eolNormalized;
        var lastNode = null;
        for (var i = 0, len = chunks.length; i < len; i++) {
            if (chunks[i].buffer.length > 0) {
                if (!chunks[i].lineStarts) {
                    chunks[i].lineStarts = createLineStartsFast(chunks[i].buffer);
                }
                var piece = new Piece(i + 1, { line: 0, column: 0 }, { line: chunks[i].lineStarts.length - 1, column: chunks[i].buffer.length - chunks[i].lineStarts[chunks[i].lineStarts.length - 1] }, chunks[i].lineStarts.length - 1, chunks[i].buffer.length);
                this._buffers.push(chunks[i]);
                lastNode = this.rbInsertRight(lastNode, piece);
            }
        }
        this._searchCache = new PieceTreeSearchCache(1);
        this._lastVisitedLine = { lineNumber: 0, value: null };
        this.computeBufferMetadata();
    };
    PieceTreeBase.prototype.normalizeEOL = function (eol) {
        var _this = this;
        var averageBufferSize = AverageBufferSize;
        var min = averageBufferSize - Math.floor(averageBufferSize / 3);
        var max = min * 2;
        var tempChunk = '';
        var tempChunkLen = 0;
        var chunks = [];
        this.iterate(this.root, function (node) {
            var str = _this.getNodeContent(node);
            var len = str.length;
            if (tempChunkLen <= min || tempChunkLen + len < max) {
                tempChunk += str;
                tempChunkLen += len;
                return true;
            }
            // flush anyways
            var text = tempChunk.replace(/\r\n|\r|\n/g, eol);
            chunks.push(new StringBuffer(text, createLineStartsFast(text)));
            tempChunk = str;
            tempChunkLen = len;
            return true;
        });
        if (tempChunkLen > 0) {
            var text = tempChunk.replace(/\r\n|\r|\n/g, eol);
            chunks.push(new StringBuffer(text, createLineStartsFast(text)));
        }
        this.create(chunks, eol, true);
    };
    // #region Buffer API
    PieceTreeBase.prototype.getEOL = function () {
        return this._EOL;
    };
    PieceTreeBase.prototype.setEOL = function (newEOL) {
        this._EOL = newEOL;
        this._EOLLength = this._EOL.length;
        this.normalizeEOL(newEOL);
    };
    PieceTreeBase.prototype.createSnapshot = function (BOM) {
        return new PieceTreeSnapshot(this, BOM);
    };
    PieceTreeBase.prototype.equal = function (other) {
        var _this = this;
        if (this.getLength() !== other.getLength()) {
            return false;
        }
        if (this.getLineCount() !== other.getLineCount()) {
            return false;
        }
        var offset = 0;
        var ret = this.iterate(this.root, function (node) {
            if (node === SENTINEL) {
                return true;
            }
            var str = _this.getNodeContent(node);
            var len = str.length;
            var startPosition = other.nodeAt(offset);
            var endPosition = other.nodeAt(offset + len);
            var val = other.getValueInRange2(startPosition, endPosition);
            return str === val;
        });
        return ret;
    };
    PieceTreeBase.prototype.getOffsetAt = function (lineNumber, column) {
        var leftLen = 0; // inorder
        var x = this.root;
        while (x !== SENTINEL) {
            if (x.left !== SENTINEL && x.lf_left + 1 >= lineNumber) {
                x = x.left;
            }
            else if (x.lf_left + x.piece.lineFeedCnt + 1 >= lineNumber) {
                leftLen += x.size_left;
                // lineNumber >= 2
                var accumualtedValInCurrentIndex = this.getAccumulatedValue(x, lineNumber - x.lf_left - 2);
                return leftLen += accumualtedValInCurrentIndex + column - 1;
            }
            else {
                lineNumber -= x.lf_left + x.piece.lineFeedCnt;
                leftLen += x.size_left + x.piece.length;
                x = x.right;
            }
        }
        return leftLen;
    };
    PieceTreeBase.prototype.getPositionAt = function (offset) {
        offset = Math.floor(offset);
        offset = Math.max(0, offset);
        var x = this.root;
        var lfCnt = 0;
        var originalOffset = offset;
        while (x !== SENTINEL) {
            if (x.size_left !== 0 && x.size_left >= offset) {
                x = x.left;
            }
            else if (x.size_left + x.piece.length >= offset) {
                var out = this.getIndexOf(x, offset - x.size_left);
                lfCnt += x.lf_left + out.index;
                if (out.index === 0) {
                    var lineStartOffset = this.getOffsetAt(lfCnt + 1, 1);
                    var column = originalOffset - lineStartOffset;
                    return new Position(lfCnt + 1, column + 1);
                }
                return new Position(lfCnt + 1, out.remainder + 1);
            }
            else {
                offset -= x.size_left + x.piece.length;
                lfCnt += x.lf_left + x.piece.lineFeedCnt;
                if (x.right === SENTINEL) {
                    // last node
                    var lineStartOffset = this.getOffsetAt(lfCnt + 1, 1);
                    var column = originalOffset - offset - lineStartOffset;
                    return new Position(lfCnt + 1, column + 1);
                }
                else {
                    x = x.right;
                }
            }
        }
        return new Position(1, 1);
    };
    PieceTreeBase.prototype.getValueInRange = function (range, eol) {
        if (range.startLineNumber === range.endLineNumber && range.startColumn === range.endColumn) {
            return '';
        }
        var startPosition = this.nodeAt2(range.startLineNumber, range.startColumn);
        var endPosition = this.nodeAt2(range.endLineNumber, range.endColumn);
        var value = this.getValueInRange2(startPosition, endPosition);
        if (eol) {
            if (eol !== this._EOL || !this._EOLNormalized) {
                return value.replace(/\r\n|\r|\n/g, eol);
            }
            if (eol === this.getEOL() && this._EOLNormalized) {
                if (eol === '\r\n') {
                }
                return value;
            }
            return value.replace(/\r\n|\r|\n/g, eol);
        }
        return value;
    };
    PieceTreeBase.prototype.getValueInRange2 = function (startPosition, endPosition) {
        if (startPosition.node === endPosition.node) {
            var node = startPosition.node;
            var buffer_1 = this._buffers[node.piece.bufferIndex].buffer;
            var startOffset_1 = this.offsetInBuffer(node.piece.bufferIndex, node.piece.start);
            return buffer_1.substring(startOffset_1 + startPosition.remainder, startOffset_1 + endPosition.remainder);
        }
        var x = startPosition.node;
        var buffer = this._buffers[x.piece.bufferIndex].buffer;
        var startOffset = this.offsetInBuffer(x.piece.bufferIndex, x.piece.start);
        var ret = buffer.substring(startOffset + startPosition.remainder, startOffset + x.piece.length);
        x = x.next();
        while (x !== SENTINEL) {
            var buffer_2 = this._buffers[x.piece.bufferIndex].buffer;
            var startOffset_2 = this.offsetInBuffer(x.piece.bufferIndex, x.piece.start);
            if (x === endPosition.node) {
                ret += buffer_2.substring(startOffset_2, startOffset_2 + endPosition.remainder);
                break;
            }
            else {
                ret += buffer_2.substr(startOffset_2, x.piece.length);
            }
            x = x.next();
        }
        return ret;
    };
    PieceTreeBase.prototype.getLinesContent = function () {
        return this.getContentOfSubTree(this.root).split(/\r\n|\r|\n/);
    };
    PieceTreeBase.prototype.getLength = function () {
        return this._length;
    };
    PieceTreeBase.prototype.getLineCount = function () {
        return this._lineCnt;
    };
    PieceTreeBase.prototype.getLineContent = function (lineNumber) {
        if (this._lastVisitedLine.lineNumber === lineNumber) {
            return this._lastVisitedLine.value;
        }
        this._lastVisitedLine.lineNumber = lineNumber;
        if (lineNumber === this._lineCnt) {
            this._lastVisitedLine.value = this.getLineRawContent(lineNumber);
        }
        else if (this._EOLNormalized) {
            this._lastVisitedLine.value = this.getLineRawContent(lineNumber, this._EOLLength);
        }
        else {
            this._lastVisitedLine.value = this.getLineRawContent(lineNumber).replace(/(\r\n|\r|\n)$/, '');
        }
        return this._lastVisitedLine.value;
    };
    PieceTreeBase.prototype.getLineCharCode = function (lineNumber, index) {
        var nodePos = this.nodeAt2(lineNumber, index + 1);
        if (nodePos.remainder === nodePos.node.piece.length) {
            // the char we want to fetch is at the head of next node.
            var matchingNode = nodePos.node.next();
            if (!matchingNode) {
                return 0;
            }
            var buffer = this._buffers[matchingNode.piece.bufferIndex];
            var startOffset = this.offsetInBuffer(matchingNode.piece.bufferIndex, matchingNode.piece.start);
            return buffer.buffer.charCodeAt(startOffset);
        }
        else {
            var buffer = this._buffers[nodePos.node.piece.bufferIndex];
            var startOffset = this.offsetInBuffer(nodePos.node.piece.bufferIndex, nodePos.node.piece.start);
            var targetOffset = startOffset + nodePos.remainder;
            return buffer.buffer.charCodeAt(targetOffset);
        }
    };
    PieceTreeBase.prototype.getLineLength = function (lineNumber) {
        if (lineNumber === this.getLineCount()) {
            var startOffset = this.getOffsetAt(lineNumber, 1);
            return this.getLength() - startOffset;
        }
        return this.getOffsetAt(lineNumber + 1, 1) - this.getOffsetAt(lineNumber, 1) - this._EOLLength;
    };
    PieceTreeBase.prototype.findMatchesInNode = function (node, searcher, startLineNumber, startColumn, startCursor, endCursor, searchData, captureMatches, limitResultCount, resultLen, result) {
        var buffer = this._buffers[node.piece.bufferIndex];
        var startOffsetInBuffer = this.offsetInBuffer(node.piece.bufferIndex, node.piece.start);
        var start = this.offsetInBuffer(node.piece.bufferIndex, startCursor);
        var end = this.offsetInBuffer(node.piece.bufferIndex, endCursor);
        var m;
        // Reset regex to search from the beginning
        searcher.reset(start);
        var ret = { line: 0, column: 0 };
        do {
            m = searcher.next(buffer.buffer);
            if (m) {
                if (m.index >= end) {
                    return resultLen;
                }
                this.positionInBuffer(node, m.index - startOffsetInBuffer, ret);
                var lineFeedCnt = this.getLineFeedCnt(node.piece.bufferIndex, startCursor, ret);
                var retStartColumn = ret.line === startCursor.line ? ret.column - startCursor.column + startColumn : ret.column + 1;
                var retEndColumn = retStartColumn + m[0].length;
                result[resultLen++] = createFindMatch(new Range(startLineNumber + lineFeedCnt, retStartColumn, startLineNumber + lineFeedCnt, retEndColumn), m, captureMatches);
                if (m.index + m[0].length >= end) {
                    return resultLen;
                }
                if (resultLen >= limitResultCount) {
                    return resultLen;
                }
            }
        } while (m);
        return resultLen;
    };
    PieceTreeBase.prototype.findMatchesLineByLine = function (searchRange, searchData, captureMatches, limitResultCount) {
        var result = [];
        var resultLen = 0;
        var searcher = new Searcher(searchData.wordSeparators, searchData.regex);
        var startPostion = this.nodeAt2(searchRange.startLineNumber, searchRange.startColumn);
        if (startPostion === null) {
            return [];
        }
        var endPosition = this.nodeAt2(searchRange.endLineNumber, searchRange.endColumn);
        if (endPosition === null) {
            return [];
        }
        var start = this.positionInBuffer(startPostion.node, startPostion.remainder);
        var end = this.positionInBuffer(endPosition.node, endPosition.remainder);
        if (startPostion.node === endPosition.node) {
            this.findMatchesInNode(startPostion.node, searcher, searchRange.startLineNumber, searchRange.startColumn, start, end, searchData, captureMatches, limitResultCount, resultLen, result);
            return result;
        }
        var startLineNumber = searchRange.startLineNumber;
        var currentNode = startPostion.node;
        while (currentNode !== endPosition.node) {
            var lineBreakCnt = this.getLineFeedCnt(currentNode.piece.bufferIndex, start, currentNode.piece.end);
            if (lineBreakCnt >= 1) {
                // last line break position
                var lineStarts = this._buffers[currentNode.piece.bufferIndex].lineStarts;
                var startOffsetInBuffer = this.offsetInBuffer(currentNode.piece.bufferIndex, currentNode.piece.start);
                var nextLineStartOffset = lineStarts[start.line + lineBreakCnt];
                var startColumn_1 = startLineNumber === searchRange.startLineNumber ? searchRange.startColumn : 1;
                resultLen = this.findMatchesInNode(currentNode, searcher, startLineNumber, startColumn_1, start, this.positionInBuffer(currentNode, nextLineStartOffset - startOffsetInBuffer), searchData, captureMatches, limitResultCount, resultLen, result);
                if (resultLen >= limitResultCount) {
                    return result;
                }
                startLineNumber += lineBreakCnt;
            }
            var startColumn_2 = startLineNumber === searchRange.startLineNumber ? searchRange.startColumn - 1 : 0;
            // search for the remaining content
            if (startLineNumber === searchRange.endLineNumber) {
                var text = this.getLineContent(startLineNumber).substring(startColumn_2, searchRange.endColumn - 1);
                resultLen = this._findMatchesInLine(searchData, searcher, text, searchRange.endLineNumber, startColumn_2, resultLen, result, captureMatches, limitResultCount);
                return result;
            }
            resultLen = this._findMatchesInLine(searchData, searcher, this.getLineContent(startLineNumber).substr(startColumn_2), startLineNumber, startColumn_2, resultLen, result, captureMatches, limitResultCount);
            if (resultLen >= limitResultCount) {
                return result;
            }
            startLineNumber++;
            startPostion = this.nodeAt2(startLineNumber, 1);
            currentNode = startPostion.node;
            start = this.positionInBuffer(startPostion.node, startPostion.remainder);
        }
        if (startLineNumber === searchRange.endLineNumber) {
            var startColumn_3 = startLineNumber === searchRange.startLineNumber ? searchRange.startColumn - 1 : 0;
            var text = this.getLineContent(startLineNumber).substring(startColumn_3, searchRange.endColumn - 1);
            resultLen = this._findMatchesInLine(searchData, searcher, text, searchRange.endLineNumber, startColumn_3, resultLen, result, captureMatches, limitResultCount);
            return result;
        }
        var startColumn = startLineNumber === searchRange.startLineNumber ? searchRange.startColumn : 1;
        resultLen = this.findMatchesInNode(endPosition.node, searcher, startLineNumber, startColumn, start, end, searchData, captureMatches, limitResultCount, resultLen, result);
        return result;
    };
    PieceTreeBase.prototype._findMatchesInLine = function (searchData, searcher, text, lineNumber, deltaOffset, resultLen, result, captureMatches, limitResultCount) {
        var wordSeparators = searchData.wordSeparators;
        if (!captureMatches && searchData.simpleSearch) {
            var searchString = searchData.simpleSearch;
            var searchStringLen = searchString.length;
            var textLength = text.length;
            var lastMatchIndex = -searchStringLen;
            while ((lastMatchIndex = text.indexOf(searchString, lastMatchIndex + searchStringLen)) !== -1) {
                if (!wordSeparators || isValidMatch(wordSeparators, text, textLength, lastMatchIndex, searchStringLen)) {
                    result[resultLen++] = new FindMatch(new Range(lineNumber, lastMatchIndex + 1 + deltaOffset, lineNumber, lastMatchIndex + 1 + searchStringLen + deltaOffset), null);
                    if (resultLen >= limitResultCount) {
                        return resultLen;
                    }
                }
            }
            return resultLen;
        }
        var m;
        // Reset regex to search from the beginning
        searcher.reset(0);
        do {
            m = searcher.next(text);
            if (m) {
                result[resultLen++] = createFindMatch(new Range(lineNumber, m.index + 1 + deltaOffset, lineNumber, m.index + 1 + m[0].length + deltaOffset), m, captureMatches);
                if (resultLen >= limitResultCount) {
                    return resultLen;
                }
            }
        } while (m);
        return resultLen;
    };
    // #endregion
    // #region Piece Table
    PieceTreeBase.prototype.insert = function (offset, value, eolNormalized) {
        if (eolNormalized === void 0) { eolNormalized = false; }
        this._EOLNormalized = this._EOLNormalized && eolNormalized;
        this._lastVisitedLine.lineNumber = 0;
        this._lastVisitedLine.value = null;
        if (this.root !== SENTINEL) {
            var _a = this.nodeAt(offset), node = _a.node, remainder = _a.remainder, nodeStartOffset = _a.nodeStartOffset;
            var piece = node.piece;
            var bufferIndex = piece.bufferIndex;
            var insertPosInBuffer = this.positionInBuffer(node, remainder);
            if (node.piece.bufferIndex === 0 &&
                piece.end.line === this._lastChangeBufferPos.line &&
                piece.end.column === this._lastChangeBufferPos.column &&
                (nodeStartOffset + piece.length === offset) &&
                value.length < AverageBufferSize) {
                // changed buffer
                this.appendToNode(node, value);
                this.computeBufferMetadata();
                return;
            }
            if (nodeStartOffset === offset) {
                this.insertContentToNodeLeft(value, node);
                this._searchCache.valdiate(offset);
            }
            else if (nodeStartOffset + node.piece.length > offset) {
                // we are inserting into the middle of a node.
                var nodesToDel = [];
                var newRightPiece = new Piece(piece.bufferIndex, insertPosInBuffer, piece.end, this.getLineFeedCnt(piece.bufferIndex, insertPosInBuffer, piece.end), this.offsetInBuffer(bufferIndex, piece.end) - this.offsetInBuffer(bufferIndex, insertPosInBuffer));
                if (this.shouldCheckCRLF() && this.endWithCR(value)) {
                    var headOfRight = this.nodeCharCodeAt(node, remainder);
                    if (headOfRight === 10 /** \n */) {
                        var newStart = { line: newRightPiece.start.line + 1, column: 0 };
                        newRightPiece = new Piece(newRightPiece.bufferIndex, newStart, newRightPiece.end, this.getLineFeedCnt(newRightPiece.bufferIndex, newStart, newRightPiece.end), newRightPiece.length - 1);
                        value += '\n';
                    }
                }
                // reuse node for content before insertion point.
                if (this.shouldCheckCRLF() && this.startWithLF(value)) {
                    var tailOfLeft = this.nodeCharCodeAt(node, remainder - 1);
                    if (tailOfLeft === 13 /** \r */) {
                        var previousPos = this.positionInBuffer(node, remainder - 1);
                        this.deleteNodeTail(node, previousPos);
                        value = '\r' + value;
                        if (node.piece.length === 0) {
                            nodesToDel.push(node);
                        }
                    }
                    else {
                        this.deleteNodeTail(node, insertPosInBuffer);
                    }
                }
                else {
                    this.deleteNodeTail(node, insertPosInBuffer);
                }
                var newPieces = this.createNewPieces(value);
                if (newRightPiece.length > 0) {
                    this.rbInsertRight(node, newRightPiece);
                }
                var tmpNode = node;
                for (var k = 0; k < newPieces.length; k++) {
                    tmpNode = this.rbInsertRight(tmpNode, newPieces[k]);
                }
                this.deleteNodes(nodesToDel);
            }
            else {
                this.insertContentToNodeRight(value, node);
            }
        }
        else {
            // insert new node
            var pieces = this.createNewPieces(value);
            var node = this.rbInsertLeft(null, pieces[0]);
            for (var k = 1; k < pieces.length; k++) {
                node = this.rbInsertRight(node, pieces[k]);
            }
        }
        // todo, this is too brutal. Total line feed count should be updated the same way as lf_left.
        this.computeBufferMetadata();
    };
    PieceTreeBase.prototype.delete = function (offset, cnt) {
        this._lastVisitedLine.lineNumber = 0;
        this._lastVisitedLine.value = null;
        if (cnt <= 0 || this.root === SENTINEL) {
            return;
        }
        var startPosition = this.nodeAt(offset);
        var endPosition = this.nodeAt(offset + cnt);
        var startNode = startPosition.node;
        var endNode = endPosition.node;
        if (startNode === endNode) {
            var startSplitPosInBuffer_1 = this.positionInBuffer(startNode, startPosition.remainder);
            var endSplitPosInBuffer_1 = this.positionInBuffer(startNode, endPosition.remainder);
            if (startPosition.nodeStartOffset === offset) {
                if (cnt === startNode.piece.length) { // delete node
                    var next = startNode.next();
                    rbDelete(this, startNode);
                    this.validateCRLFWithPrevNode(next);
                    this.computeBufferMetadata();
                    return;
                }
                this.deleteNodeHead(startNode, endSplitPosInBuffer_1);
                this._searchCache.valdiate(offset);
                this.validateCRLFWithPrevNode(startNode);
                this.computeBufferMetadata();
                return;
            }
            if (startPosition.nodeStartOffset + startNode.piece.length === offset + cnt) {
                this.deleteNodeTail(startNode, startSplitPosInBuffer_1);
                this.validateCRLFWithNextNode(startNode);
                this.computeBufferMetadata();
                return;
            }
            // delete content in the middle, this node will be splitted to nodes
            this.shrinkNode(startNode, startSplitPosInBuffer_1, endSplitPosInBuffer_1);
            this.computeBufferMetadata();
            return;
        }
        var nodesToDel = [];
        var startSplitPosInBuffer = this.positionInBuffer(startNode, startPosition.remainder);
        this.deleteNodeTail(startNode, startSplitPosInBuffer);
        this._searchCache.valdiate(offset);
        if (startNode.piece.length === 0) {
            nodesToDel.push(startNode);
        }
        // update last touched node
        var endSplitPosInBuffer = this.positionInBuffer(endNode, endPosition.remainder);
        this.deleteNodeHead(endNode, endSplitPosInBuffer);
        if (endNode.piece.length === 0) {
            nodesToDel.push(endNode);
        }
        // delete nodes in between
        var secondNode = startNode.next();
        for (var node = secondNode; node !== SENTINEL && node !== endNode; node = node.next()) {
            nodesToDel.push(node);
        }
        var prev = startNode.piece.length === 0 ? startNode.prev() : startNode;
        this.deleteNodes(nodesToDel);
        this.validateCRLFWithNextNode(prev);
        this.computeBufferMetadata();
    };
    PieceTreeBase.prototype.insertContentToNodeLeft = function (value, node) {
        // we are inserting content to the beginning of node
        var nodesToDel = [];
        if (this.shouldCheckCRLF() && this.endWithCR(value) && this.startWithLF(node)) {
            // move `\n` to new node.
            var piece = node.piece;
            var newStart = { line: piece.start.line + 1, column: 0 };
            var nPiece = new Piece(piece.bufferIndex, newStart, piece.end, this.getLineFeedCnt(piece.bufferIndex, newStart, piece.end), piece.length - 1);
            node.piece = nPiece;
            value += '\n';
            updateTreeMetadata(this, node, -1, -1);
            if (node.piece.length === 0) {
                nodesToDel.push(node);
            }
        }
        var newPieces = this.createNewPieces(value);
        var newNode = this.rbInsertLeft(node, newPieces[newPieces.length - 1]);
        for (var k = newPieces.length - 2; k >= 0; k--) {
            newNode = this.rbInsertLeft(newNode, newPieces[k]);
        }
        this.validateCRLFWithPrevNode(newNode);
        this.deleteNodes(nodesToDel);
    };
    PieceTreeBase.prototype.insertContentToNodeRight = function (value, node) {
        // we are inserting to the right of this node.
        if (this.adjustCarriageReturnFromNext(value, node)) {
            // move \n to the new node.
            value += '\n';
        }
        var newPieces = this.createNewPieces(value);
        var newNode = this.rbInsertRight(node, newPieces[0]);
        var tmpNode = newNode;
        for (var k = 1; k < newPieces.length; k++) {
            tmpNode = this.rbInsertRight(tmpNode, newPieces[k]);
        }
        this.validateCRLFWithPrevNode(newNode);
    };
    PieceTreeBase.prototype.positionInBuffer = function (node, remainder, ret) {
        var piece = node.piece;
        var bufferIndex = node.piece.bufferIndex;
        var lineStarts = this._buffers[bufferIndex].lineStarts;
        var startOffset = lineStarts[piece.start.line] + piece.start.column;
        var offset = startOffset + remainder;
        // binary search offset between startOffset and endOffset
        var low = piece.start.line;
        var high = piece.end.line;
        var mid;
        var midStop;
        var midStart;
        while (low <= high) {
            mid = low + ((high - low) / 2) | 0;
            midStart = lineStarts[mid];
            if (mid === high) {
                break;
            }
            midStop = lineStarts[mid + 1];
            if (offset < midStart) {
                high = mid - 1;
            }
            else if (offset >= midStop) {
                low = mid + 1;
            }
            else {
                break;
            }
        }
        if (ret) {
            ret.line = mid;
            ret.column = offset - midStart;
            return null;
        }
        return {
            line: mid,
            column: offset - midStart
        };
    };
    PieceTreeBase.prototype.getLineFeedCnt = function (bufferIndex, start, end) {
        // we don't need to worry about start: abc\r|\n, or abc|\r, or abc|\n, or abc|\r\n doesn't change the fact that, there is one line break after start.
        // now let's take care of end: abc\r|\n, if end is in between \r and \n, we need to add line feed count by 1
        if (end.column === 0) {
            return end.line - start.line;
        }
        var lineStarts = this._buffers[bufferIndex].lineStarts;
        if (end.line === lineStarts.length - 1) { // it means, there is no \n after end, otherwise, there will be one more lineStart.
            return end.line - start.line;
        }
        var nextLineStartOffset = lineStarts[end.line + 1];
        var endOffset = lineStarts[end.line] + end.column;
        if (nextLineStartOffset > endOffset + 1) { // there are more than 1 character after end, which means it can't be \n
            return end.line - start.line;
        }
        // endOffset + 1 === nextLineStartOffset
        // character at endOffset is \n, so we check the character before first
        // if character at endOffset is \r, end.column is 0 and we can't get here.
        var previousCharOffset = endOffset - 1; // end.column > 0 so it's okay.
        var buffer = this._buffers[bufferIndex].buffer;
        if (buffer.charCodeAt(previousCharOffset) === 13) {
            return end.line - start.line + 1;
        }
        else {
            return end.line - start.line;
        }
    };
    PieceTreeBase.prototype.offsetInBuffer = function (bufferIndex, cursor) {
        var lineStarts = this._buffers[bufferIndex].lineStarts;
        return lineStarts[cursor.line] + cursor.column;
    };
    PieceTreeBase.prototype.deleteNodes = function (nodes) {
        for (var i = 0; i < nodes.length; i++) {
            rbDelete(this, nodes[i]);
        }
    };
    PieceTreeBase.prototype.createNewPieces = function (text) {
        if (text.length > AverageBufferSize) {
            // the content is large, operations like substring, charCode becomes slow
            // so here we split it into smaller chunks, just like what we did for CR/LF normalization
            var newPieces = [];
            while (text.length > AverageBufferSize) {
                var lastChar = text.charCodeAt(AverageBufferSize - 1);
                var splitText = void 0;
                if (lastChar === 13 /* CarriageReturn */ || (lastChar >= 0xd800 && lastChar <= 0xdbff)) {
                    // last character is \r or a high surrogate => keep it back
                    splitText = text.substring(0, AverageBufferSize - 1);
                    text = text.substring(AverageBufferSize - 1);
                }
                else {
                    splitText = text.substring(0, AverageBufferSize);
                    text = text.substring(AverageBufferSize);
                }
                var lineStarts_1 = createLineStartsFast(splitText);
                newPieces.push(new Piece(this._buffers.length, /* buffer index */ { line: 0, column: 0 }, { line: lineStarts_1.length - 1, column: splitText.length - lineStarts_1[lineStarts_1.length - 1] }, lineStarts_1.length - 1, splitText.length));
                this._buffers.push(new StringBuffer(splitText, lineStarts_1));
            }
            var lineStarts_2 = createLineStartsFast(text);
            newPieces.push(new Piece(this._buffers.length, /* buffer index */ { line: 0, column: 0 }, { line: lineStarts_2.length - 1, column: text.length - lineStarts_2[lineStarts_2.length - 1] }, lineStarts_2.length - 1, text.length));
            this._buffers.push(new StringBuffer(text, lineStarts_2));
            return newPieces;
        }
        var startOffset = this._buffers[0].buffer.length;
        var lineStarts = createLineStartsFast(text, false);
        var start = this._lastChangeBufferPos;
        if (this._buffers[0].lineStarts[this._buffers[0].lineStarts.length - 1] === startOffset
            && startOffset !== 0
            && this.startWithLF(text)
            && this.endWithCR(this._buffers[0].buffer) // todo, we can check this._lastChangeBufferPos's column as it's the last one
        ) {
            this._lastChangeBufferPos = { line: this._lastChangeBufferPos.line, column: this._lastChangeBufferPos.column + 1 };
            start = this._lastChangeBufferPos;
            for (var i = 0; i < lineStarts.length; i++) {
                lineStarts[i] += startOffset + 1;
            }
            this._buffers[0].lineStarts = this._buffers[0].lineStarts.concat(lineStarts.slice(1));
            this._buffers[0].buffer += '_' + text;
            startOffset += 1;
        }
        else {
            if (startOffset !== 0) {
                for (var i = 0; i < lineStarts.length; i++) {
                    lineStarts[i] += startOffset;
                }
            }
            this._buffers[0].lineStarts = this._buffers[0].lineStarts.concat(lineStarts.slice(1));
            this._buffers[0].buffer += text;
        }
        var endOffset = this._buffers[0].buffer.length;
        var endIndex = this._buffers[0].lineStarts.length - 1;
        var endColumn = endOffset - this._buffers[0].lineStarts[endIndex];
        var endPos = { line: endIndex, column: endColumn };
        var newPiece = new Piece(0, /** todo */ start, endPos, this.getLineFeedCnt(0, start, endPos), endOffset - startOffset);
        this._lastChangeBufferPos = endPos;
        return [newPiece];
    };
    PieceTreeBase.prototype.getLinesRawContent = function () {
        return this.getContentOfSubTree(this.root);
    };
    PieceTreeBase.prototype.getLineRawContent = function (lineNumber, endOffset) {
        if (endOffset === void 0) { endOffset = 0; }
        var x = this.root;
        var ret = '';
        var cache = this._searchCache.get2(lineNumber);
        if (cache) {
            x = cache.node;
            var prevAccumualtedValue = this.getAccumulatedValue(x, lineNumber - cache.nodeStartLineNumber - 1);
            var buffer = this._buffers[x.piece.bufferIndex].buffer;
            var startOffset = this.offsetInBuffer(x.piece.bufferIndex, x.piece.start);
            if (cache.nodeStartLineNumber + x.piece.lineFeedCnt === lineNumber) {
                ret = buffer.substring(startOffset + prevAccumualtedValue, startOffset + x.piece.length);
            }
            else {
                var accumualtedValue = this.getAccumulatedValue(x, lineNumber - cache.nodeStartLineNumber);
                return buffer.substring(startOffset + prevAccumualtedValue, startOffset + accumualtedValue - endOffset);
            }
        }
        else {
            var nodeStartOffset = 0;
            var originalLineNumber = lineNumber;
            while (x !== SENTINEL) {
                if (x.left !== SENTINEL && x.lf_left >= lineNumber - 1) {
                    x = x.left;
                }
                else if (x.lf_left + x.piece.lineFeedCnt > lineNumber - 1) {
                    var prevAccumualtedValue = this.getAccumulatedValue(x, lineNumber - x.lf_left - 2);
                    var accumualtedValue = this.getAccumulatedValue(x, lineNumber - x.lf_left - 1);
                    var buffer = this._buffers[x.piece.bufferIndex].buffer;
                    var startOffset = this.offsetInBuffer(x.piece.bufferIndex, x.piece.start);
                    nodeStartOffset += x.size_left;
                    this._searchCache.set({
                        node: x,
                        nodeStartOffset: nodeStartOffset,
                        nodeStartLineNumber: originalLineNumber - (lineNumber - 1 - x.lf_left)
                    });
                    return buffer.substring(startOffset + prevAccumualtedValue, startOffset + accumualtedValue - endOffset);
                }
                else if (x.lf_left + x.piece.lineFeedCnt === lineNumber - 1) {
                    var prevAccumualtedValue = this.getAccumulatedValue(x, lineNumber - x.lf_left - 2);
                    var buffer = this._buffers[x.piece.bufferIndex].buffer;
                    var startOffset = this.offsetInBuffer(x.piece.bufferIndex, x.piece.start);
                    ret = buffer.substring(startOffset + prevAccumualtedValue, startOffset + x.piece.length);
                    break;
                }
                else {
                    lineNumber -= x.lf_left + x.piece.lineFeedCnt;
                    nodeStartOffset += x.size_left + x.piece.length;
                    x = x.right;
                }
            }
        }
        // search in order, to find the node contains end column
        x = x.next();
        while (x !== SENTINEL) {
            var buffer = this._buffers[x.piece.bufferIndex].buffer;
            if (x.piece.lineFeedCnt > 0) {
                var accumualtedValue = this.getAccumulatedValue(x, 0);
                var startOffset = this.offsetInBuffer(x.piece.bufferIndex, x.piece.start);
                ret += buffer.substring(startOffset, startOffset + accumualtedValue - endOffset);
                return ret;
            }
            else {
                var startOffset = this.offsetInBuffer(x.piece.bufferIndex, x.piece.start);
                ret += buffer.substr(startOffset, x.piece.length);
            }
            x = x.next();
        }
        return ret;
    };
    PieceTreeBase.prototype.computeBufferMetadata = function () {
        var x = this.root;
        var lfCnt = 1;
        var len = 0;
        while (x !== SENTINEL) {
            lfCnt += x.lf_left + x.piece.lineFeedCnt;
            len += x.size_left + x.piece.length;
            x = x.right;
        }
        this._lineCnt = lfCnt;
        this._length = len;
        this._searchCache.valdiate(this._length);
    };
    // #region node operations
    PieceTreeBase.prototype.getIndexOf = function (node, accumulatedValue) {
        var piece = node.piece;
        var pos = this.positionInBuffer(node, accumulatedValue);
        var lineCnt = pos.line - piece.start.line;
        if (this.offsetInBuffer(piece.bufferIndex, piece.end) - this.offsetInBuffer(piece.bufferIndex, piece.start) === accumulatedValue) {
            // we are checking the end of this node, so a CRLF check is necessary.
            var realLineCnt = this.getLineFeedCnt(node.piece.bufferIndex, piece.start, pos);
            if (realLineCnt !== lineCnt) {
                // aha yes, CRLF
                return { index: realLineCnt, remainder: 0 };
            }
        }
        return { index: lineCnt, remainder: pos.column };
    };
    PieceTreeBase.prototype.getAccumulatedValue = function (node, index) {
        if (index < 0) {
            return 0;
        }
        var piece = node.piece;
        var lineStarts = this._buffers[piece.bufferIndex].lineStarts;
        var expectedLineStartIndex = piece.start.line + index + 1;
        if (expectedLineStartIndex > piece.end.line) {
            return lineStarts[piece.end.line] + piece.end.column - lineStarts[piece.start.line] - piece.start.column;
        }
        else {
            return lineStarts[expectedLineStartIndex] - lineStarts[piece.start.line] - piece.start.column;
        }
    };
    PieceTreeBase.prototype.deleteNodeTail = function (node, pos) {
        var piece = node.piece;
        var originalLFCnt = piece.lineFeedCnt;
        var originalEndOffset = this.offsetInBuffer(piece.bufferIndex, piece.end);
        var newEnd = pos;
        var newEndOffset = this.offsetInBuffer(piece.bufferIndex, newEnd);
        var newLineFeedCnt = this.getLineFeedCnt(piece.bufferIndex, piece.start, newEnd);
        var lf_delta = newLineFeedCnt - originalLFCnt;
        var size_delta = newEndOffset - originalEndOffset;
        var newLength = piece.length + size_delta;
        node.piece = new Piece(piece.bufferIndex, piece.start, newEnd, newLineFeedCnt, newLength);
        updateTreeMetadata(this, node, size_delta, lf_delta);
    };
    PieceTreeBase.prototype.deleteNodeHead = function (node, pos) {
        var piece = node.piece;
        var originalLFCnt = piece.lineFeedCnt;
        var originalStartOffset = this.offsetInBuffer(piece.bufferIndex, piece.start);
        var newStart = pos;
        var newLineFeedCnt = this.getLineFeedCnt(piece.bufferIndex, newStart, piece.end);
        var newStartOffset = this.offsetInBuffer(piece.bufferIndex, newStart);
        var lf_delta = newLineFeedCnt - originalLFCnt;
        var size_delta = originalStartOffset - newStartOffset;
        var newLength = piece.length + size_delta;
        node.piece = new Piece(piece.bufferIndex, newStart, piece.end, newLineFeedCnt, newLength);
        updateTreeMetadata(this, node, size_delta, lf_delta);
    };
    PieceTreeBase.prototype.shrinkNode = function (node, start, end) {
        var piece = node.piece;
        var originalStartPos = piece.start;
        var originalEndPos = piece.end;
        // old piece, originalStartPos, start
        var oldLength = piece.length;
        var oldLFCnt = piece.lineFeedCnt;
        var newEnd = start;
        var newLineFeedCnt = this.getLineFeedCnt(piece.bufferIndex, piece.start, newEnd);
        var newLength = this.offsetInBuffer(piece.bufferIndex, start) - this.offsetInBuffer(piece.bufferIndex, originalStartPos);
        node.piece = new Piece(piece.bufferIndex, piece.start, newEnd, newLineFeedCnt, newLength);
        updateTreeMetadata(this, node, newLength - oldLength, newLineFeedCnt - oldLFCnt);
        // new right piece, end, originalEndPos
        var newPiece = new Piece(piece.bufferIndex, end, originalEndPos, this.getLineFeedCnt(piece.bufferIndex, end, originalEndPos), this.offsetInBuffer(piece.bufferIndex, originalEndPos) - this.offsetInBuffer(piece.bufferIndex, end));
        var newNode = this.rbInsertRight(node, newPiece);
        this.validateCRLFWithPrevNode(newNode);
    };
    PieceTreeBase.prototype.appendToNode = function (node, value) {
        if (this.adjustCarriageReturnFromNext(value, node)) {
            value += '\n';
        }
        var hitCRLF = this.shouldCheckCRLF() && this.startWithLF(value) && this.endWithCR(node);
        var startOffset = this._buffers[0].buffer.length;
        this._buffers[0].buffer += value;
        var lineStarts = createLineStartsFast(value, false);
        for (var i = 0; i < lineStarts.length; i++) {
            lineStarts[i] += startOffset;
        }
        if (hitCRLF) {
            var prevStartOffset = this._buffers[0].lineStarts[this._buffers[0].lineStarts.length - 2];
            this._buffers[0].lineStarts.pop();
            // _lastChangeBufferPos is already wrong
            this._lastChangeBufferPos = { line: this._lastChangeBufferPos.line - 1, column: startOffset - prevStartOffset };
        }
        this._buffers[0].lineStarts = this._buffers[0].lineStarts.concat(lineStarts.slice(1));
        var endIndex = this._buffers[0].lineStarts.length - 1;
        var endColumn = this._buffers[0].buffer.length - this._buffers[0].lineStarts[endIndex];
        var newEnd = { line: endIndex, column: endColumn };
        var newLength = node.piece.length + value.length;
        var oldLineFeedCnt = node.piece.lineFeedCnt;
        var newLineFeedCnt = this.getLineFeedCnt(0, node.piece.start, newEnd);
        var lf_delta = newLineFeedCnt - oldLineFeedCnt;
        node.piece = new Piece(node.piece.bufferIndex, node.piece.start, newEnd, newLineFeedCnt, newLength);
        this._lastChangeBufferPos = newEnd;
        updateTreeMetadata(this, node, value.length, lf_delta);
    };
    PieceTreeBase.prototype.nodeAt = function (offset) {
        var x = this.root;
        var cache = this._searchCache.get(offset);
        if (cache) {
            return {
                node: cache.node,
                nodeStartOffset: cache.nodeStartOffset,
                remainder: offset - cache.nodeStartOffset
            };
        }
        var nodeStartOffset = 0;
        while (x !== SENTINEL) {
            if (x.size_left > offset) {
                x = x.left;
            }
            else if (x.size_left + x.piece.length >= offset) {
                nodeStartOffset += x.size_left;
                var ret = {
                    node: x,
                    remainder: offset - x.size_left,
                    nodeStartOffset: nodeStartOffset
                };
                this._searchCache.set(ret);
                return ret;
            }
            else {
                offset -= x.size_left + x.piece.length;
                nodeStartOffset += x.size_left + x.piece.length;
                x = x.right;
            }
        }
        return null;
    };
    PieceTreeBase.prototype.nodeAt2 = function (lineNumber, column) {
        var x = this.root;
        var nodeStartOffset = 0;
        while (x !== SENTINEL) {
            if (x.left !== SENTINEL && x.lf_left >= lineNumber - 1) {
                x = x.left;
            }
            else if (x.lf_left + x.piece.lineFeedCnt > lineNumber - 1) {
                var prevAccumualtedValue = this.getAccumulatedValue(x, lineNumber - x.lf_left - 2);
                var accumualtedValue = this.getAccumulatedValue(x, lineNumber - x.lf_left - 1);
                nodeStartOffset += x.size_left;
                return {
                    node: x,
                    remainder: Math.min(prevAccumualtedValue + column - 1, accumualtedValue),
                    nodeStartOffset: nodeStartOffset
                };
            }
            else if (x.lf_left + x.piece.lineFeedCnt === lineNumber - 1) {
                var prevAccumualtedValue = this.getAccumulatedValue(x, lineNumber - x.lf_left - 2);
                if (prevAccumualtedValue + column - 1 <= x.piece.length) {
                    return {
                        node: x,
                        remainder: prevAccumualtedValue + column - 1,
                        nodeStartOffset: nodeStartOffset
                    };
                }
                else {
                    column -= x.piece.length - prevAccumualtedValue;
                    break;
                }
            }
            else {
                lineNumber -= x.lf_left + x.piece.lineFeedCnt;
                nodeStartOffset += x.size_left + x.piece.length;
                x = x.right;
            }
        }
        // search in order, to find the node contains position.column
        x = x.next();
        while (x !== SENTINEL) {
            if (x.piece.lineFeedCnt > 0) {
                var accumualtedValue = this.getAccumulatedValue(x, 0);
                var nodeStartOffset_1 = this.offsetOfNode(x);
                return {
                    node: x,
                    remainder: Math.min(column - 1, accumualtedValue),
                    nodeStartOffset: nodeStartOffset_1
                };
            }
            else {
                if (x.piece.length >= column - 1) {
                    var nodeStartOffset_2 = this.offsetOfNode(x);
                    return {
                        node: x,
                        remainder: column - 1,
                        nodeStartOffset: nodeStartOffset_2
                    };
                }
                else {
                    column -= x.piece.length;
                }
            }
            x = x.next();
        }
        return null;
    };
    PieceTreeBase.prototype.nodeCharCodeAt = function (node, offset) {
        if (node.piece.lineFeedCnt < 1) {
            return -1;
        }
        var buffer = this._buffers[node.piece.bufferIndex];
        var newOffset = this.offsetInBuffer(node.piece.bufferIndex, node.piece.start) + offset;
        return buffer.buffer.charCodeAt(newOffset);
    };
    PieceTreeBase.prototype.offsetOfNode = function (node) {
        if (!node) {
            return 0;
        }
        var pos = node.size_left;
        while (node !== this.root) {
            if (node.parent.right === node) {
                pos += node.parent.size_left + node.parent.piece.length;
            }
            node = node.parent;
        }
        return pos;
    };
    // #endregion
    // #region CRLF
    PieceTreeBase.prototype.shouldCheckCRLF = function () {
        return !(this._EOLNormalized && this._EOL === '\n');
    };
    PieceTreeBase.prototype.startWithLF = function (val) {
        if (typeof val === 'string') {
            return val.charCodeAt(0) === 10;
        }
        if (val === SENTINEL || val.piece.lineFeedCnt === 0) {
            return false;
        }
        var piece = val.piece;
        var lineStarts = this._buffers[piece.bufferIndex].lineStarts;
        var line = piece.start.line;
        var startOffset = lineStarts[line] + piece.start.column;
        if (line === lineStarts.length - 1) {
            // last line, so there is no line feed at the end of this line
            return false;
        }
        var nextLineOffset = lineStarts[line + 1];
        if (nextLineOffset > startOffset + 1) {
            return false;
        }
        return this._buffers[piece.bufferIndex].buffer.charCodeAt(startOffset) === 10;
    };
    PieceTreeBase.prototype.endWithCR = function (val) {
        if (typeof val === 'string') {
            return val.charCodeAt(val.length - 1) === 13;
        }
        if (val === SENTINEL || val.piece.lineFeedCnt === 0) {
            return false;
        }
        return this.nodeCharCodeAt(val, val.piece.length - 1) === 13;
    };
    PieceTreeBase.prototype.validateCRLFWithPrevNode = function (nextNode) {
        if (this.shouldCheckCRLF() && this.startWithLF(nextNode)) {
            var node = nextNode.prev();
            if (this.endWithCR(node)) {
                this.fixCRLF(node, nextNode);
            }
        }
    };
    PieceTreeBase.prototype.validateCRLFWithNextNode = function (node) {
        if (this.shouldCheckCRLF() && this.endWithCR(node)) {
            var nextNode = node.next();
            if (this.startWithLF(nextNode)) {
                this.fixCRLF(node, nextNode);
            }
        }
    };
    PieceTreeBase.prototype.fixCRLF = function (prev, next) {
        var nodesToDel = [];
        // update node
        var lineStarts = this._buffers[prev.piece.bufferIndex].lineStarts;
        var newEnd;
        if (prev.piece.end.column === 0) {
            // it means, last line ends with \r, not \r\n
            newEnd = { line: prev.piece.end.line - 1, column: lineStarts[prev.piece.end.line] - lineStarts[prev.piece.end.line - 1] - 1 };
        }
        else {
            // \r\n
            newEnd = { line: prev.piece.end.line, column: prev.piece.end.column - 1 };
        }
        var prevNewLength = prev.piece.length - 1;
        var prevNewLFCnt = prev.piece.lineFeedCnt - 1;
        prev.piece = new Piece(prev.piece.bufferIndex, prev.piece.start, newEnd, prevNewLFCnt, prevNewLength);
        updateTreeMetadata(this, prev, -1, -1);
        if (prev.piece.length === 0) {
            nodesToDel.push(prev);
        }
        // update nextNode
        var newStart = { line: next.piece.start.line + 1, column: 0 };
        var newLength = next.piece.length - 1;
        var newLineFeedCnt = this.getLineFeedCnt(next.piece.bufferIndex, newStart, next.piece.end);
        next.piece = new Piece(next.piece.bufferIndex, newStart, next.piece.end, newLineFeedCnt, newLength);
        updateTreeMetadata(this, next, -1, -1);
        if (next.piece.length === 0) {
            nodesToDel.push(next);
        }
        // create new piece which contains \r\n
        var pieces = this.createNewPieces('\r\n');
        this.rbInsertRight(prev, pieces[0]);
        // delete empty nodes
        for (var i = 0; i < nodesToDel.length; i++) {
            rbDelete(this, nodesToDel[i]);
        }
    };
    PieceTreeBase.prototype.adjustCarriageReturnFromNext = function (value, node) {
        if (this.shouldCheckCRLF() && this.endWithCR(value)) {
            var nextNode = node.next();
            if (this.startWithLF(nextNode)) {
                // move `\n` forward
                value += '\n';
                if (nextNode.piece.length === 1) {
                    rbDelete(this, nextNode);
                }
                else {
                    var piece = nextNode.piece;
                    var newStart = { line: piece.start.line + 1, column: 0 };
                    var newLength = piece.length - 1;
                    var newLineFeedCnt = this.getLineFeedCnt(piece.bufferIndex, newStart, piece.end);
                    nextNode.piece = new Piece(piece.bufferIndex, newStart, piece.end, newLineFeedCnt, newLength);
                    updateTreeMetadata(this, nextNode, -1, -1);
                }
                return true;
            }
        }
        return false;
    };
    // #endregion
    // #endregion
    // #region Tree operations
    PieceTreeBase.prototype.iterate = function (node, callback) {
        if (node === SENTINEL) {
            return callback(SENTINEL);
        }
        var leftRet = this.iterate(node.left, callback);
        if (!leftRet) {
            return leftRet;
        }
        return callback(node) && this.iterate(node.right, callback);
    };
    PieceTreeBase.prototype.getNodeContent = function (node) {
        if (node === SENTINEL) {
            return '';
        }
        var buffer = this._buffers[node.piece.bufferIndex];
        var currentContent;
        var piece = node.piece;
        var startOffset = this.offsetInBuffer(piece.bufferIndex, piece.start);
        var endOffset = this.offsetInBuffer(piece.bufferIndex, piece.end);
        currentContent = buffer.buffer.substring(startOffset, endOffset);
        return currentContent;
    };
    PieceTreeBase.prototype.getPieceContent = function (piece) {
        var buffer = this._buffers[piece.bufferIndex];
        var startOffset = this.offsetInBuffer(piece.bufferIndex, piece.start);
        var endOffset = this.offsetInBuffer(piece.bufferIndex, piece.end);
        var currentContent = buffer.buffer.substring(startOffset, endOffset);
        return currentContent;
    };
    /**
     *      node              node
     *     /  \              /  \
     *    a   b    <----   a    b
     *                         /
     *                        z
     */
    PieceTreeBase.prototype.rbInsertRight = function (node, p) {
        var z = new TreeNode(p, 1 /* Red */);
        z.left = SENTINEL;
        z.right = SENTINEL;
        z.parent = SENTINEL;
        z.size_left = 0;
        z.lf_left = 0;
        var x = this.root;
        if (x === SENTINEL) {
            this.root = z;
            z.color = 0 /* Black */;
        }
        else if (node.right === SENTINEL) {
            node.right = z;
            z.parent = node;
        }
        else {
            var nextNode = leftest(node.right);
            nextNode.left = z;
            z.parent = nextNode;
        }
        fixInsert(this, z);
        return z;
    };
    /**
     *      node              node
     *     /  \              /  \
     *    a   b     ---->   a    b
     *                       \
     *                        z
     */
    PieceTreeBase.prototype.rbInsertLeft = function (node, p) {
        var z = new TreeNode(p, 1 /* Red */);
        z.left = SENTINEL;
        z.right = SENTINEL;
        z.parent = SENTINEL;
        z.size_left = 0;
        z.lf_left = 0;
        var x = this.root;
        if (x === SENTINEL) {
            this.root = z;
            z.color = 0 /* Black */;
        }
        else if (node.left === SENTINEL) {
            node.left = z;
            z.parent = node;
        }
        else {
            var prevNode = righttest(node.left); // a
            prevNode.right = z;
            z.parent = prevNode;
        }
        fixInsert(this, z);
        return z;
    };
    PieceTreeBase.prototype.getContentOfSubTree = function (node) {
        var _this = this;
        var str = '';
        this.iterate(node, function (node) {
            str += _this.getNodeContent(node);
            return true;
        });
        return str;
    };
    return PieceTreeBase;
}());
export { PieceTreeBase };
