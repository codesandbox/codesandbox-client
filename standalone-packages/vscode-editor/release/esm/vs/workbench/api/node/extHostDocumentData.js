/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { ok } from '../../../base/common/assert.js';
import { Schemas } from '../../../base/common/network.js';
import { regExpLeadsToEndlessLoop } from '../../../base/common/strings.js';
import { MirrorTextModel } from '../../../editor/common/model/mirrorTextModel.js';
import { ensureValidWordDefinition, getWordAtText } from '../../../editor/common/model/wordHelper.js';
import { EndOfLine, Position, Range } from './extHostTypes.js';
var _modeId2WordDefinition = new Map();
export function setWordDefinitionFor(modeId, wordDefinition) {
    _modeId2WordDefinition.set(modeId, wordDefinition);
}
export function getWordDefinitionFor(modeId) {
    return _modeId2WordDefinition.get(modeId);
}
var ExtHostDocumentData = /** @class */ (function (_super) {
    __extends(ExtHostDocumentData, _super);
    function ExtHostDocumentData(proxy, uri, lines, eol, languageId, versionId, isDirty) {
        var _this = _super.call(this, uri, lines, eol, versionId) || this;
        _this._textLines = [];
        _this._isDisposed = false;
        _this._proxy = proxy;
        _this._languageId = languageId;
        _this._isDirty = isDirty;
        return _this;
    }
    ExtHostDocumentData.prototype.dispose = function () {
        // we don't really dispose documents but let
        // extensions still read from them. some
        // operations, live saving, will now error tho
        ok(!this._isDisposed);
        this._isDisposed = true;
        this._isDirty = false;
    };
    ExtHostDocumentData.prototype.equalLines = function (lines) {
        var len = lines.length;
        if (len !== this._lines.length) {
            return false;
        }
        for (var i = 0; i < len; i++) {
            if (lines[i] !== this._lines[i]) {
                return false;
            }
        }
        return true;
    };
    Object.defineProperty(ExtHostDocumentData.prototype, "document", {
        get: function () {
            if (!this._document) {
                var data_1 = this;
                this._document = {
                    get uri() { return data_1._uri; },
                    get fileName() { return data_1._uri.fsPath; },
                    get isUntitled() { return data_1._uri.scheme === Schemas.untitled; },
                    get languageId() { return data_1._languageId; },
                    get version() { return data_1._versionId; },
                    get isClosed() { return data_1._isDisposed; },
                    get isDirty() { return data_1._isDirty; },
                    save: function () { return data_1._save(); },
                    getText: function (range) { return range ? data_1._getTextInRange(range) : data_1.getText(); },
                    get eol() { return data_1._eol === '\n' ? EndOfLine.LF : EndOfLine.CRLF; },
                    get lineCount() { return data_1._lines.length; },
                    lineAt: function (lineOrPos) { return data_1._lineAt(lineOrPos); },
                    offsetAt: function (pos) { return data_1._offsetAt(pos); },
                    positionAt: function (offset) { return data_1._positionAt(offset); },
                    validateRange: function (ran) { return data_1._validateRange(ran); },
                    validatePosition: function (pos) { return data_1._validatePosition(pos); },
                    getWordRangeAtPosition: function (pos, regexp) { return data_1._getWordRangeAtPosition(pos, regexp); }
                };
            }
            return Object.freeze(this._document);
        },
        enumerable: true,
        configurable: true
    });
    ExtHostDocumentData.prototype._acceptLanguageId = function (newLanguageId) {
        ok(!this._isDisposed);
        this._languageId = newLanguageId;
    };
    ExtHostDocumentData.prototype._acceptIsDirty = function (isDirty) {
        ok(!this._isDisposed);
        this._isDirty = isDirty;
    };
    ExtHostDocumentData.prototype._save = function () {
        if (this._isDisposed) {
            return Promise.reject(new Error('Document has been closed'));
        }
        return this._proxy.$trySaveDocument(this._uri);
    };
    ExtHostDocumentData.prototype._getTextInRange = function (_range) {
        var range = this._validateRange(_range);
        if (range.isEmpty) {
            return '';
        }
        if (range.isSingleLine) {
            return this._lines[range.start.line].substring(range.start.character, range.end.character);
        }
        var lineEnding = this._eol, startLineIndex = range.start.line, endLineIndex = range.end.line, resultLines = [];
        resultLines.push(this._lines[startLineIndex].substring(range.start.character));
        for (var i = startLineIndex + 1; i < endLineIndex; i++) {
            resultLines.push(this._lines[i]);
        }
        resultLines.push(this._lines[endLineIndex].substring(0, range.end.character));
        return resultLines.join(lineEnding);
    };
    ExtHostDocumentData.prototype._lineAt = function (lineOrPosition) {
        var line;
        if (lineOrPosition instanceof Position) {
            line = lineOrPosition.line;
        }
        else if (typeof lineOrPosition === 'number') {
            line = lineOrPosition;
        }
        if (line < 0 || line >= this._lines.length) {
            throw new Error('Illegal value for `line`');
        }
        var result = this._textLines[line];
        if (!result || result.lineNumber !== line || result.text !== this._lines[line]) {
            var text = this._lines[line];
            var firstNonWhitespaceCharacterIndex = /^(\s*)/.exec(text)[1].length;
            var range = new Range(line, 0, line, text.length);
            var rangeIncludingLineBreak = line < this._lines.length - 1
                ? new Range(line, 0, line + 1, 0)
                : range;
            result = Object.freeze({
                lineNumber: line,
                range: range,
                rangeIncludingLineBreak: rangeIncludingLineBreak,
                text: text,
                firstNonWhitespaceCharacterIndex: firstNonWhitespaceCharacterIndex,
                isEmptyOrWhitespace: firstNonWhitespaceCharacterIndex === text.length
            });
            this._textLines[line] = result;
        }
        return result;
    };
    ExtHostDocumentData.prototype._offsetAt = function (position) {
        position = this._validatePosition(position);
        this._ensureLineStarts();
        return this._lineStarts.getAccumulatedValue(position.line - 1) + position.character;
    };
    ExtHostDocumentData.prototype._positionAt = function (offset) {
        offset = Math.floor(offset);
        offset = Math.max(0, offset);
        this._ensureLineStarts();
        var out = this._lineStarts.getIndexOf(offset);
        var lineLength = this._lines[out.index].length;
        // Ensure we return a valid position
        return new Position(out.index, Math.min(out.remainder, lineLength));
    };
    // ---- range math
    ExtHostDocumentData.prototype._validateRange = function (range) {
        if (!(range instanceof Range)) {
            throw new Error('Invalid argument');
        }
        var start = this._validatePosition(range.start);
        var end = this._validatePosition(range.end);
        if (start === range.start && end === range.end) {
            return range;
        }
        return new Range(start.line, start.character, end.line, end.character);
    };
    ExtHostDocumentData.prototype._validatePosition = function (position) {
        if (!(position instanceof Position)) {
            throw new Error('Invalid argument');
        }
        var line = position.line, character = position.character;
        var hasChanged = false;
        if (line < 0) {
            line = 0;
            character = 0;
            hasChanged = true;
        }
        else if (line >= this._lines.length) {
            line = this._lines.length - 1;
            character = this._lines[line].length;
            hasChanged = true;
        }
        else {
            var maxCharacter = this._lines[line].length;
            if (character < 0) {
                character = 0;
                hasChanged = true;
            }
            else if (character > maxCharacter) {
                character = maxCharacter;
                hasChanged = true;
            }
        }
        if (!hasChanged) {
            return position;
        }
        return new Position(line, character);
    };
    ExtHostDocumentData.prototype._getWordRangeAtPosition = function (_position, regexp) {
        var position = this._validatePosition(_position);
        if (!regexp) {
            // use default when custom-regexp isn't provided
            regexp = getWordDefinitionFor(this._languageId);
        }
        else if (regExpLeadsToEndlessLoop(regexp)) {
            // use default when custom-regexp is bad
            console.warn("[getWordRangeAtPosition]: ignoring custom regexp '" + regexp.source + "' because it matches the empty string.");
            regexp = getWordDefinitionFor(this._languageId);
        }
        var wordAtText = getWordAtText(position.character + 1, ensureValidWordDefinition(regexp), this._lines[position.line], 0);
        if (wordAtText) {
            return new Range(position.line, wordAtText.startColumn - 1, position.line, wordAtText.endColumn - 1);
        }
        return undefined;
    };
    return ExtHostDocumentData;
}(MirrorTextModel));
export { ExtHostDocumentData };
