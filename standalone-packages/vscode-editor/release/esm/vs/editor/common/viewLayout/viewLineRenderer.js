/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as strings from '../../../base/common/strings.js';
import { createStringBuilder } from '../core/stringBuilder.js';
import { LineDecoration, LineDecorationsNormalizer } from './lineDecorations.js';
var LinePart = /** @class */ (function () {
    function LinePart(endIndex, type) {
        this.endIndex = endIndex;
        this.type = type;
    }
    return LinePart;
}());
var RenderLineInput = /** @class */ (function () {
    function RenderLineInput(useMonospaceOptimizations, canUseHalfwidthRightwardsArrow, lineContent, continuesWithWrappedLine, isBasicASCII, containsRTL, fauxIndentLength, lineTokens, lineDecorations, tabSize, spaceWidth, stopRenderingLineAfter, renderWhitespace, renderControlCharacters, fontLigatures) {
        this.useMonospaceOptimizations = useMonospaceOptimizations;
        this.canUseHalfwidthRightwardsArrow = canUseHalfwidthRightwardsArrow;
        this.lineContent = lineContent;
        this.continuesWithWrappedLine = continuesWithWrappedLine;
        this.isBasicASCII = isBasicASCII;
        this.containsRTL = containsRTL;
        this.fauxIndentLength = fauxIndentLength;
        this.lineTokens = lineTokens;
        this.lineDecorations = lineDecorations;
        this.tabSize = tabSize;
        this.spaceWidth = spaceWidth;
        this.stopRenderingLineAfter = stopRenderingLineAfter;
        this.renderWhitespace = (renderWhitespace === 'all'
            ? 2 /* All */
            : renderWhitespace === 'boundary'
                ? 1 /* Boundary */
                : 0 /* None */);
        this.renderControlCharacters = renderControlCharacters;
        this.fontLigatures = fontLigatures;
    }
    RenderLineInput.prototype.equals = function (other) {
        return (this.useMonospaceOptimizations === other.useMonospaceOptimizations
            && this.canUseHalfwidthRightwardsArrow === other.canUseHalfwidthRightwardsArrow
            && this.lineContent === other.lineContent
            && this.continuesWithWrappedLine === other.continuesWithWrappedLine
            && this.isBasicASCII === other.isBasicASCII
            && this.containsRTL === other.containsRTL
            && this.fauxIndentLength === other.fauxIndentLength
            && this.tabSize === other.tabSize
            && this.spaceWidth === other.spaceWidth
            && this.stopRenderingLineAfter === other.stopRenderingLineAfter
            && this.renderWhitespace === other.renderWhitespace
            && this.renderControlCharacters === other.renderControlCharacters
            && this.fontLigatures === other.fontLigatures
            && LineDecoration.equalsArr(this.lineDecorations, other.lineDecorations)
            && this.lineTokens.equals(other.lineTokens));
    };
    return RenderLineInput;
}());
export { RenderLineInput };
/**
 * Provides a both direction mapping between a line's character and its rendered position.
 */
var CharacterMapping = /** @class */ (function () {
    function CharacterMapping(length, partCount) {
        this.length = length;
        this._data = new Uint32Array(this.length);
        this._absoluteOffsets = new Uint32Array(this.length);
    }
    CharacterMapping.getPartIndex = function (partData) {
        return (partData & 4294901760 /* PART_INDEX_MASK */) >>> 16 /* PART_INDEX_OFFSET */;
    };
    CharacterMapping.getCharIndex = function (partData) {
        return (partData & 65535 /* CHAR_INDEX_MASK */) >>> 0 /* CHAR_INDEX_OFFSET */;
    };
    CharacterMapping.prototype.setPartData = function (charOffset, partIndex, charIndex, partAbsoluteOffset) {
        var partData = ((partIndex << 16 /* PART_INDEX_OFFSET */)
            | (charIndex << 0 /* CHAR_INDEX_OFFSET */)) >>> 0;
        this._data[charOffset] = partData;
        this._absoluteOffsets[charOffset] = partAbsoluteOffset + charIndex;
    };
    CharacterMapping.prototype.getAbsoluteOffsets = function () {
        return this._absoluteOffsets;
    };
    CharacterMapping.prototype.charOffsetToPartData = function (charOffset) {
        if (this.length === 0) {
            return 0;
        }
        if (charOffset < 0) {
            return this._data[0];
        }
        if (charOffset >= this.length) {
            return this._data[this.length - 1];
        }
        return this._data[charOffset];
    };
    CharacterMapping.prototype.partDataToCharOffset = function (partIndex, partLength, charIndex) {
        if (this.length === 0) {
            return 0;
        }
        var searchEntry = ((partIndex << 16 /* PART_INDEX_OFFSET */)
            | (charIndex << 0 /* CHAR_INDEX_OFFSET */)) >>> 0;
        var min = 0;
        var max = this.length - 1;
        while (min + 1 < max) {
            var mid = ((min + max) >>> 1);
            var midEntry = this._data[mid];
            if (midEntry === searchEntry) {
                return mid;
            }
            else if (midEntry > searchEntry) {
                max = mid;
            }
            else {
                min = mid;
            }
        }
        if (min === max) {
            return min;
        }
        var minEntry = this._data[min];
        var maxEntry = this._data[max];
        if (minEntry === searchEntry) {
            return min;
        }
        if (maxEntry === searchEntry) {
            return max;
        }
        var minPartIndex = CharacterMapping.getPartIndex(minEntry);
        var minCharIndex = CharacterMapping.getCharIndex(minEntry);
        var maxPartIndex = CharacterMapping.getPartIndex(maxEntry);
        var maxCharIndex;
        if (minPartIndex !== maxPartIndex) {
            // sitting between parts
            maxCharIndex = partLength;
        }
        else {
            maxCharIndex = CharacterMapping.getCharIndex(maxEntry);
        }
        var minEntryDistance = charIndex - minCharIndex;
        var maxEntryDistance = maxCharIndex - charIndex;
        if (minEntryDistance <= maxEntryDistance) {
            return min;
        }
        return max;
    };
    return CharacterMapping;
}());
export { CharacterMapping };
var RenderLineOutput = /** @class */ (function () {
    function RenderLineOutput(characterMapping, containsRTL, containsForeignElements) {
        this.characterMapping = characterMapping;
        this.containsRTL = containsRTL;
        this.containsForeignElements = containsForeignElements;
    }
    return RenderLineOutput;
}());
export { RenderLineOutput };
export function renderViewLine(input, sb) {
    if (input.lineContent.length === 0) {
        var containsForeignElements = 0 /* None */;
        // This is basically for IE's hit test to work
        var content = '<span><span>\u00a0</span></span>';
        if (input.lineDecorations.length > 0) {
            // This line is empty, but it contains inline decorations
            var classNames = [];
            for (var i = 0, len = input.lineDecorations.length; i < len; i++) {
                var lineDecoration = input.lineDecorations[i];
                if (lineDecoration.type === 1 /* Before */) {
                    classNames.push(input.lineDecorations[i].className);
                    containsForeignElements |= 1 /* Before */;
                }
                if (lineDecoration.type === 2 /* After */) {
                    classNames.push(input.lineDecorations[i].className);
                    containsForeignElements |= 2 /* After */;
                }
            }
            if (containsForeignElements !== 0 /* None */) {
                content = "<span><span class=\"" + classNames.join(' ') + "\"></span></span>";
            }
        }
        sb.appendASCIIString(content);
        return new RenderLineOutput(new CharacterMapping(0, 0), false, containsForeignElements);
    }
    return _renderLine(resolveRenderLineInput(input), sb);
}
var RenderLineOutput2 = /** @class */ (function () {
    function RenderLineOutput2(characterMapping, html, containsRTL, containsForeignElements) {
        this.characterMapping = characterMapping;
        this.html = html;
        this.containsRTL = containsRTL;
        this.containsForeignElements = containsForeignElements;
    }
    return RenderLineOutput2;
}());
export { RenderLineOutput2 };
export function renderViewLine2(input) {
    var sb = createStringBuilder(10000);
    var out = renderViewLine(input, sb);
    return new RenderLineOutput2(out.characterMapping, sb.build(), out.containsRTL, out.containsForeignElements);
}
var ResolvedRenderLineInput = /** @class */ (function () {
    function ResolvedRenderLineInput(fontIsMonospace, canUseHalfwidthRightwardsArrow, lineContent, len, isOverflowing, parts, containsForeignElements, tabSize, containsRTL, spaceWidth, renderWhitespace, renderControlCharacters) {
        this.fontIsMonospace = fontIsMonospace;
        this.canUseHalfwidthRightwardsArrow = canUseHalfwidthRightwardsArrow;
        this.lineContent = lineContent;
        this.len = len;
        this.isOverflowing = isOverflowing;
        this.parts = parts;
        this.containsForeignElements = containsForeignElements;
        this.tabSize = tabSize;
        this.containsRTL = containsRTL;
        this.spaceWidth = spaceWidth;
        this.renderWhitespace = renderWhitespace;
        this.renderControlCharacters = renderControlCharacters;
        //
    }
    return ResolvedRenderLineInput;
}());
function resolveRenderLineInput(input) {
    var useMonospaceOptimizations = input.useMonospaceOptimizations;
    var lineContent = input.lineContent;
    var isOverflowing;
    var len;
    if (input.stopRenderingLineAfter !== -1 && input.stopRenderingLineAfter < lineContent.length) {
        isOverflowing = true;
        len = input.stopRenderingLineAfter;
    }
    else {
        isOverflowing = false;
        len = lineContent.length;
    }
    var tokens = transformAndRemoveOverflowing(input.lineTokens, input.fauxIndentLength, len);
    if (input.renderWhitespace === 2 /* All */ || input.renderWhitespace === 1 /* Boundary */) {
        tokens = _applyRenderWhitespace(lineContent, len, input.continuesWithWrappedLine, tokens, input.fauxIndentLength, input.tabSize, useMonospaceOptimizations, input.renderWhitespace === 1 /* Boundary */);
    }
    var containsForeignElements = 0 /* None */;
    if (input.lineDecorations.length > 0) {
        for (var i = 0, len_1 = input.lineDecorations.length; i < len_1; i++) {
            var lineDecoration = input.lineDecorations[i];
            if (lineDecoration.type === 3 /* RegularAffectingLetterSpacing */) {
                // Pretend there are foreign elements... although not 100% accurate.
                containsForeignElements |= 1 /* Before */;
            }
            else if (lineDecoration.type === 1 /* Before */) {
                containsForeignElements |= 1 /* Before */;
            }
            else if (lineDecoration.type === 2 /* After */) {
                containsForeignElements |= 2 /* After */;
            }
        }
        tokens = _applyInlineDecorations(lineContent, len, tokens, input.lineDecorations);
    }
    if (!input.containsRTL) {
        // We can never split RTL text, as it ruins the rendering
        tokens = splitLargeTokens(lineContent, tokens, !input.isBasicASCII || input.fontLigatures);
    }
    return new ResolvedRenderLineInput(useMonospaceOptimizations, input.canUseHalfwidthRightwardsArrow, lineContent, len, isOverflowing, tokens, containsForeignElements, input.tabSize, input.containsRTL, input.spaceWidth, input.renderWhitespace, input.renderControlCharacters);
}
/**
 * In the rendering phase, characters are always looped until token.endIndex.
 * Ensure that all tokens end before `len` and the last one ends precisely at `len`.
 */
function transformAndRemoveOverflowing(tokens, fauxIndentLength, len) {
    var result = [], resultLen = 0;
    // The faux indent part of the line should have no token type
    if (fauxIndentLength > 0) {
        result[resultLen++] = new LinePart(fauxIndentLength, '');
    }
    for (var tokenIndex = 0, tokensLen = tokens.getCount(); tokenIndex < tokensLen; tokenIndex++) {
        var endIndex = tokens.getEndOffset(tokenIndex);
        if (endIndex <= fauxIndentLength) {
            // The faux indent part of the line should have no token type
            continue;
        }
        var type = tokens.getClassName(tokenIndex);
        if (endIndex >= len) {
            result[resultLen++] = new LinePart(len, type);
            break;
        }
        result[resultLen++] = new LinePart(endIndex, type);
    }
    return result;
}
/**
 * See https://github.com/Microsoft/vscode/issues/6885.
 * It appears that having very large spans causes very slow reading of character positions.
 * So here we try to avoid that.
 */
function splitLargeTokens(lineContent, tokens, onlyAtSpaces) {
    var lastTokenEndIndex = 0;
    var result = [], resultLen = 0;
    if (onlyAtSpaces) {
        // Split only at spaces => we need to walk each character
        for (var i = 0, len = tokens.length; i < len; i++) {
            var token = tokens[i];
            var tokenEndIndex = token.endIndex;
            if (lastTokenEndIndex + 50 /* LongToken */ < tokenEndIndex) {
                var tokenType = token.type;
                var lastSpaceOffset = -1;
                var currTokenStart = lastTokenEndIndex;
                for (var j = lastTokenEndIndex; j < tokenEndIndex; j++) {
                    if (lineContent.charCodeAt(j) === 32 /* Space */) {
                        lastSpaceOffset = j;
                    }
                    if (lastSpaceOffset !== -1 && j - currTokenStart >= 50 /* LongToken */) {
                        // Split at `lastSpaceOffset` + 1
                        result[resultLen++] = new LinePart(lastSpaceOffset + 1, tokenType);
                        currTokenStart = lastSpaceOffset + 1;
                        lastSpaceOffset = -1;
                    }
                }
                if (currTokenStart !== tokenEndIndex) {
                    result[resultLen++] = new LinePart(tokenEndIndex, tokenType);
                }
            }
            else {
                result[resultLen++] = token;
            }
            lastTokenEndIndex = tokenEndIndex;
        }
    }
    else {
        // Split anywhere => we don't need to walk each character
        for (var i = 0, len = tokens.length; i < len; i++) {
            var token = tokens[i];
            var tokenEndIndex = token.endIndex;
            var diff = (tokenEndIndex - lastTokenEndIndex);
            if (diff > 50 /* LongToken */) {
                var tokenType = token.type;
                var piecesCount = Math.ceil(diff / 50 /* LongToken */);
                for (var j = 1; j < piecesCount; j++) {
                    var pieceEndIndex = lastTokenEndIndex + (j * 50 /* LongToken */);
                    result[resultLen++] = new LinePart(pieceEndIndex, tokenType);
                }
                result[resultLen++] = new LinePart(tokenEndIndex, tokenType);
            }
            else {
                result[resultLen++] = token;
            }
            lastTokenEndIndex = tokenEndIndex;
        }
    }
    return result;
}
/**
 * Whitespace is rendered by "replacing" tokens with a special-purpose `vs-whitespace` type that is later recognized in the rendering phase.
 * Moreover, a token is created for every visual indent because on some fonts the glyphs used for rendering whitespace (&rarr; or &middot;) do not have the same width as &nbsp;.
 * The rendering phase will generate `style="width:..."` for these tokens.
 */
function _applyRenderWhitespace(lineContent, len, continuesWithWrappedLine, tokens, fauxIndentLength, tabSize, useMonospaceOptimizations, onlyBoundary) {
    var result = [], resultLen = 0;
    var tokenIndex = 0;
    var tokenType = tokens[tokenIndex].type;
    var tokenEndIndex = tokens[tokenIndex].endIndex;
    var tokensLength = tokens.length;
    var firstNonWhitespaceIndex = strings.firstNonWhitespaceIndex(lineContent);
    var lastNonWhitespaceIndex;
    if (firstNonWhitespaceIndex === -1) {
        // The entire line is whitespace
        firstNonWhitespaceIndex = len;
        lastNonWhitespaceIndex = len;
    }
    else {
        lastNonWhitespaceIndex = strings.lastNonWhitespaceIndex(lineContent);
    }
    var tmpIndent = 0;
    for (var charIndex = 0; charIndex < fauxIndentLength; charIndex++) {
        var chCode = lineContent.charCodeAt(charIndex);
        if (chCode === 9 /* Tab */) {
            tmpIndent = tabSize;
        }
        else if (strings.isFullWidthCharacter(chCode)) {
            tmpIndent += 2;
        }
        else {
            tmpIndent++;
        }
    }
    tmpIndent = tmpIndent % tabSize;
    var wasInWhitespace = false;
    for (var charIndex = fauxIndentLength; charIndex < len; charIndex++) {
        var chCode = lineContent.charCodeAt(charIndex);
        var isInWhitespace = void 0;
        if (charIndex < firstNonWhitespaceIndex || charIndex > lastNonWhitespaceIndex) {
            // in leading or trailing whitespace
            isInWhitespace = true;
        }
        else if (chCode === 9 /* Tab */) {
            // a tab character is rendered both in all and boundary cases
            isInWhitespace = true;
        }
        else if (chCode === 32 /* Space */) {
            // hit a space character
            if (onlyBoundary) {
                // rendering only boundary whitespace
                if (wasInWhitespace) {
                    isInWhitespace = true;
                }
                else {
                    var nextChCode = (charIndex + 1 < len ? lineContent.charCodeAt(charIndex + 1) : 0 /* Null */);
                    isInWhitespace = (nextChCode === 32 /* Space */ || nextChCode === 9 /* Tab */);
                }
            }
            else {
                isInWhitespace = true;
            }
        }
        else {
            isInWhitespace = false;
        }
        if (wasInWhitespace) {
            // was in whitespace token
            if (!isInWhitespace || (!useMonospaceOptimizations && tmpIndent >= tabSize)) {
                // leaving whitespace token or entering a new indent
                result[resultLen++] = new LinePart(charIndex, 'vs-whitespace');
                tmpIndent = tmpIndent % tabSize;
            }
        }
        else {
            // was in regular token
            if (charIndex === tokenEndIndex || (isInWhitespace && charIndex > fauxIndentLength)) {
                result[resultLen++] = new LinePart(charIndex, tokenType);
                tmpIndent = tmpIndent % tabSize;
            }
        }
        if (chCode === 9 /* Tab */) {
            tmpIndent = tabSize;
        }
        else if (strings.isFullWidthCharacter(chCode)) {
            tmpIndent += 2;
        }
        else {
            tmpIndent++;
        }
        wasInWhitespace = isInWhitespace;
        if (charIndex === tokenEndIndex) {
            tokenIndex++;
            if (tokenIndex < tokensLength) {
                tokenType = tokens[tokenIndex].type;
                tokenEndIndex = tokens[tokenIndex].endIndex;
            }
        }
    }
    var generateWhitespace = false;
    if (wasInWhitespace) {
        // was in whitespace token
        if (continuesWithWrappedLine && onlyBoundary) {
            var lastCharCode = (len > 0 ? lineContent.charCodeAt(len - 1) : 0 /* Null */);
            var prevCharCode = (len > 1 ? lineContent.charCodeAt(len - 2) : 0 /* Null */);
            var isSingleTrailingSpace = (lastCharCode === 32 /* Space */ && (prevCharCode !== 32 /* Space */ && prevCharCode !== 9 /* Tab */));
            if (!isSingleTrailingSpace) {
                generateWhitespace = true;
            }
        }
        else {
            generateWhitespace = true;
        }
    }
    result[resultLen++] = new LinePart(len, generateWhitespace ? 'vs-whitespace' : tokenType);
    return result;
}
/**
 * Inline decorations are "merged" on top of tokens.
 * Special care must be taken when multiple inline decorations are at play and they overlap.
 */
function _applyInlineDecorations(lineContent, len, tokens, _lineDecorations) {
    _lineDecorations.sort(LineDecoration.compare);
    var lineDecorations = LineDecorationsNormalizer.normalize(lineContent, _lineDecorations);
    var lineDecorationsLen = lineDecorations.length;
    var lineDecorationIndex = 0;
    var result = [], resultLen = 0, lastResultEndIndex = 0;
    for (var tokenIndex = 0, len_2 = tokens.length; tokenIndex < len_2; tokenIndex++) {
        var token = tokens[tokenIndex];
        var tokenEndIndex = token.endIndex;
        var tokenType = token.type;
        while (lineDecorationIndex < lineDecorationsLen && lineDecorations[lineDecorationIndex].startOffset < tokenEndIndex) {
            var lineDecoration = lineDecorations[lineDecorationIndex];
            if (lineDecoration.startOffset > lastResultEndIndex) {
                lastResultEndIndex = lineDecoration.startOffset;
                result[resultLen++] = new LinePart(lastResultEndIndex, tokenType);
            }
            if (lineDecoration.endOffset + 1 <= tokenEndIndex) {
                // This line decoration ends before this token ends
                lastResultEndIndex = lineDecoration.endOffset + 1;
                result[resultLen++] = new LinePart(lastResultEndIndex, tokenType + ' ' + lineDecoration.className);
                lineDecorationIndex++;
            }
            else {
                // This line decoration continues on to the next token
                lastResultEndIndex = tokenEndIndex;
                result[resultLen++] = new LinePart(lastResultEndIndex, tokenType + ' ' + lineDecoration.className);
                break;
            }
        }
        if (tokenEndIndex > lastResultEndIndex) {
            lastResultEndIndex = tokenEndIndex;
            result[resultLen++] = new LinePart(lastResultEndIndex, tokenType);
        }
    }
    var lastTokenEndIndex = tokens[tokens.length - 1].endIndex;
    if (lineDecorationIndex < lineDecorationsLen && lineDecorations[lineDecorationIndex].startOffset === lastTokenEndIndex) {
        var classNames = [];
        while (lineDecorationIndex < lineDecorationsLen && lineDecorations[lineDecorationIndex].startOffset === lastTokenEndIndex) {
            classNames.push(lineDecorations[lineDecorationIndex].className);
            lineDecorationIndex++;
        }
        result[resultLen++] = new LinePart(lastResultEndIndex, classNames.join(' '));
    }
    return result;
}
/**
 * This function is on purpose not split up into multiple functions to allow runtime type inference (i.e. performance reasons).
 * Notice how all the needed data is fully resolved and passed in (i.e. no other calls).
 */
function _renderLine(input, sb) {
    var fontIsMonospace = input.fontIsMonospace;
    var canUseHalfwidthRightwardsArrow = input.canUseHalfwidthRightwardsArrow;
    var containsForeignElements = input.containsForeignElements;
    var lineContent = input.lineContent;
    var len = input.len;
    var isOverflowing = input.isOverflowing;
    var parts = input.parts;
    var tabSize = input.tabSize;
    var containsRTL = input.containsRTL;
    var spaceWidth = input.spaceWidth;
    var renderWhitespace = input.renderWhitespace;
    var renderControlCharacters = input.renderControlCharacters;
    var characterMapping = new CharacterMapping(len + 1, parts.length);
    var charIndex = 0;
    var tabsCharDelta = 0;
    var charOffsetInPart = 0;
    var prevPartContentCnt = 0;
    var partAbsoluteOffset = 0;
    sb.appendASCIIString('<span>');
    for (var partIndex = 0, tokensLen = parts.length; partIndex < tokensLen; partIndex++) {
        partAbsoluteOffset += prevPartContentCnt;
        var part = parts[partIndex];
        var partEndIndex = part.endIndex;
        var partType = part.type;
        var partRendersWhitespace = (renderWhitespace !== 0 /* None */ && (partType.indexOf('vs-whitespace') >= 0));
        charOffsetInPart = 0;
        sb.appendASCIIString('<span class="');
        sb.appendASCIIString(partType);
        sb.appendASCII(34 /* DoubleQuote */);
        if (partRendersWhitespace) {
            var partContentCnt = 0;
            {
                var _charIndex = charIndex;
                var _tabsCharDelta = tabsCharDelta;
                for (; _charIndex < partEndIndex; _charIndex++) {
                    var charCode = lineContent.charCodeAt(_charIndex);
                    if (charCode === 9 /* Tab */) {
                        var insertSpacesCount = tabSize - (_charIndex + _tabsCharDelta) % tabSize;
                        _tabsCharDelta += insertSpacesCount - 1;
                        partContentCnt += insertSpacesCount;
                    }
                    else {
                        // must be CharCode.Space
                        partContentCnt++;
                    }
                }
            }
            if (!fontIsMonospace) {
                var partIsOnlyWhitespace = (partType === 'vs-whitespace');
                if (partIsOnlyWhitespace || !containsForeignElements) {
                    sb.appendASCIIString(' style="width:');
                    sb.appendASCIIString(String(spaceWidth * partContentCnt));
                    sb.appendASCIIString('px"');
                }
            }
            sb.appendASCII(62 /* GreaterThan */);
            for (; charIndex < partEndIndex; charIndex++) {
                characterMapping.setPartData(charIndex, partIndex, charOffsetInPart, partAbsoluteOffset);
                var charCode = lineContent.charCodeAt(charIndex);
                if (charCode === 9 /* Tab */) {
                    var insertSpacesCount = tabSize - (charIndex + tabsCharDelta) % tabSize;
                    tabsCharDelta += insertSpacesCount - 1;
                    charOffsetInPart += insertSpacesCount - 1;
                    if (insertSpacesCount > 0) {
                        if (!canUseHalfwidthRightwardsArrow || insertSpacesCount > 1) {
                            sb.write1(0x2192); // RIGHTWARDS ARROW
                        }
                        else {
                            sb.write1(0xffeb); // HALFWIDTH RIGHTWARDS ARROW
                        }
                        insertSpacesCount--;
                    }
                    while (insertSpacesCount > 0) {
                        sb.write1(0xA0); // &nbsp;
                        insertSpacesCount--;
                    }
                }
                else {
                    // must be CharCode.Space
                    sb.write1(0xb7); // &middot;
                }
                charOffsetInPart++;
            }
            prevPartContentCnt = partContentCnt;
        }
        else {
            var partContentCnt = 0;
            if (containsRTL) {
                sb.appendASCIIString(' dir="ltr"');
            }
            sb.appendASCII(62 /* GreaterThan */);
            for (; charIndex < partEndIndex; charIndex++) {
                characterMapping.setPartData(charIndex, partIndex, charOffsetInPart, partAbsoluteOffset);
                var charCode = lineContent.charCodeAt(charIndex);
                switch (charCode) {
                    case 9 /* Tab */:
                        var insertSpacesCount = tabSize - (charIndex + tabsCharDelta) % tabSize;
                        tabsCharDelta += insertSpacesCount - 1;
                        charOffsetInPart += insertSpacesCount - 1;
                        while (insertSpacesCount > 0) {
                            sb.write1(0xA0); // &nbsp;
                            partContentCnt++;
                            insertSpacesCount--;
                        }
                        break;
                    case 32 /* Space */:
                        sb.write1(0xA0); // &nbsp;
                        partContentCnt++;
                        break;
                    case 60 /* LessThan */:
                        sb.appendASCIIString('&lt;');
                        partContentCnt++;
                        break;
                    case 62 /* GreaterThan */:
                        sb.appendASCIIString('&gt;');
                        partContentCnt++;
                        break;
                    case 38 /* Ampersand */:
                        sb.appendASCIIString('&amp;');
                        partContentCnt++;
                        break;
                    case 0 /* Null */:
                        sb.appendASCIIString('&#00;');
                        partContentCnt++;
                        break;
                    case 65279 /* UTF8_BOM */:
                    case 8232 /* LINE_SEPARATOR_2028 */:
                        sb.write1(0xfffd);
                        partContentCnt++;
                        break;
                    default:
                        if (strings.isFullWidthCharacter(charCode)) {
                            tabsCharDelta++;
                        }
                        if (renderControlCharacters && charCode < 32) {
                            sb.write1(9216 + charCode);
                            partContentCnt++;
                        }
                        else {
                            sb.write1(charCode);
                            partContentCnt++;
                        }
                }
                charOffsetInPart++;
            }
            prevPartContentCnt = partContentCnt;
        }
        sb.appendASCIIString('</span>');
    }
    // When getting client rects for the last character, we will position the
    // text range at the end of the span, insteaf of at the beginning of next span
    characterMapping.setPartData(len, parts.length - 1, charOffsetInPart, partAbsoluteOffset);
    if (isOverflowing) {
        sb.appendASCIIString('<span>&hellip;</span>');
    }
    sb.appendASCIIString('</span>');
    return new RenderLineOutput(characterMapping, containsRTL, containsForeignElements);
}
