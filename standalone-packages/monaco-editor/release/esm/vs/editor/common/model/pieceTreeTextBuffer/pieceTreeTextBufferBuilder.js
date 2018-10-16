/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import * as strings from '../../../../base/common/strings.js';
import { DefaultEndOfLine } from '../../model.js';
import { PieceTreeTextBuffer } from './pieceTreeTextBuffer.js';
import { StringBuffer, createLineStarts, createLineStartsFast } from './pieceTreeBase.js';
var PieceTreeTextBufferFactory = /** @class */ (function () {
    function PieceTreeTextBufferFactory(_chunks, _bom, _cr, _lf, _crlf, _containsRTL, _isBasicASCII, _normalizeEOL) {
        this._chunks = _chunks;
        this._bom = _bom;
        this._cr = _cr;
        this._lf = _lf;
        this._crlf = _crlf;
        this._containsRTL = _containsRTL;
        this._isBasicASCII = _isBasicASCII;
        this._normalizeEOL = _normalizeEOL;
    }
    PieceTreeTextBufferFactory.prototype._getEOL = function (defaultEOL) {
        var totalEOLCount = this._cr + this._lf + this._crlf;
        var totalCRCount = this._cr + this._crlf;
        if (totalEOLCount === 0) {
            // This is an empty file or a file with precisely one line
            return (defaultEOL === DefaultEndOfLine.LF ? '\n' : '\r\n');
        }
        if (totalCRCount > totalEOLCount / 2) {
            // More than half of the file contains \r\n ending lines
            return '\r\n';
        }
        // At least one line more ends in \n
        return '\n';
    };
    PieceTreeTextBufferFactory.prototype.create = function (defaultEOL) {
        var eol = this._getEOL(defaultEOL);
        var chunks = this._chunks;
        if (this._normalizeEOL &&
            ((eol === '\r\n' && (this._cr > 0 || this._lf > 0))
                || (eol === '\n' && (this._cr > 0 || this._crlf > 0)))) {
            // Normalize pieces
            for (var i = 0, len = chunks.length; i < len; i++) {
                var str = chunks[i].buffer.replace(/\r\n|\r|\n/g, eol);
                var newLineStart = createLineStartsFast(str);
                chunks[i] = new StringBuffer(str, newLineStart);
            }
        }
        return new PieceTreeTextBuffer(chunks, this._bom, eol, this._containsRTL, this._isBasicASCII, this._normalizeEOL);
    };
    PieceTreeTextBufferFactory.prototype.getFirstLineText = function (lengthLimit) {
        return this._chunks[0].buffer.substr(0, 100).split(/\r\n|\r|\n/)[0];
    };
    return PieceTreeTextBufferFactory;
}());
export { PieceTreeTextBufferFactory };
var PieceTreeTextBufferBuilder = /** @class */ (function () {
    function PieceTreeTextBufferBuilder() {
        this.chunks = [];
        this.BOM = '';
        this._hasPreviousChar = false;
        this._previousChar = 0;
        this._tmpLineStarts = [];
        this.cr = 0;
        this.lf = 0;
        this.crlf = 0;
        this.containsRTL = false;
        this.isBasicASCII = true;
    }
    PieceTreeTextBufferBuilder.prototype.acceptChunk = function (chunk) {
        if (chunk.length === 0) {
            return;
        }
        if (this.chunks.length === 0) {
            if (strings.startsWithUTF8BOM(chunk)) {
                this.BOM = strings.UTF8_BOM_CHARACTER;
                chunk = chunk.substr(1);
            }
        }
        var lastChar = chunk.charCodeAt(chunk.length - 1);
        if (lastChar === 13 /* CarriageReturn */ || (lastChar >= 0xd800 && lastChar <= 0xdbff)) {
            // last character is \r or a high surrogate => keep it back
            this._acceptChunk1(chunk.substr(0, chunk.length - 1), false);
            this._hasPreviousChar = true;
            this._previousChar = lastChar;
        }
        else {
            this._acceptChunk1(chunk, false);
            this._hasPreviousChar = false;
            this._previousChar = lastChar;
        }
    };
    PieceTreeTextBufferBuilder.prototype._acceptChunk1 = function (chunk, allowEmptyStrings) {
        if (!allowEmptyStrings && chunk.length === 0) {
            // Nothing to do
            return;
        }
        if (this._hasPreviousChar) {
            this._acceptChunk2(String.fromCharCode(this._previousChar) + chunk);
        }
        else {
            this._acceptChunk2(chunk);
        }
    };
    PieceTreeTextBufferBuilder.prototype._acceptChunk2 = function (chunk) {
        var lineStarts = createLineStarts(this._tmpLineStarts, chunk);
        this.chunks.push(new StringBuffer(chunk, lineStarts.lineStarts));
        this.cr += lineStarts.cr;
        this.lf += lineStarts.lf;
        this.crlf += lineStarts.crlf;
        if (this.isBasicASCII) {
            this.isBasicASCII = lineStarts.isBasicASCII;
        }
        if (!this.isBasicASCII && !this.containsRTL) {
            // No need to check if is basic ASCII
            this.containsRTL = strings.containsRTL(chunk);
        }
    };
    PieceTreeTextBufferBuilder.prototype.finish = function (normalizeEOL) {
        if (normalizeEOL === void 0) { normalizeEOL = true; }
        this._finish();
        return new PieceTreeTextBufferFactory(this.chunks, this.BOM, this.cr, this.lf, this.crlf, this.containsRTL, this.isBasicASCII, normalizeEOL);
    };
    PieceTreeTextBufferBuilder.prototype._finish = function () {
        if (this.chunks.length === 0) {
            this._acceptChunk1('', true);
        }
        if (this._hasPreviousChar) {
            this._hasPreviousChar = false;
            // recreate last chunk
            var lastChunk = this.chunks[this.chunks.length - 1];
            lastChunk.buffer += String.fromCharCode(this._previousChar);
            var newLineStarts = createLineStartsFast(lastChunk.buffer);
            lastChunk.lineStarts = newLineStarts;
            if (this._previousChar === 13 /* CarriageReturn */) {
                this.cr++;
            }
        }
    };
    return PieceTreeTextBufferBuilder;
}());
export { PieceTreeTextBufferBuilder };
