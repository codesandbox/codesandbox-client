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
import * as browser from '../../../../base/browser/browser.js';
import { createFastDomNode } from '../../../../base/browser/fastDomNode.js';
import * as platform from '../../../../base/common/platform.js';
import { RangeUtil } from './rangeUtil.js';
import { HorizontalRange } from '../../../common/view/renderingContext.js';
import { LineDecoration } from '../../../common/viewLayout/lineDecorations.js';
import { CharacterMapping, RenderLineInput, renderViewLine } from '../../../common/viewLayout/viewLineRenderer.js';
import { HIGH_CONTRAST } from '../../../../platform/theme/common/themeService.js';
var canUseFastRenderedViewLine = (function () {
    if (platform.isNative) {
        // In VSCode we know very well when the zoom level changes
        return true;
    }
    if (platform.isLinux || browser.isFirefox || browser.isSafari) {
        // On Linux, it appears that zooming affects char widths (in pixels), which is unexpected.
        // --
        // Even though we read character widths correctly, having read them at a specific zoom level
        // does not mean they are the same at the current zoom level.
        // --
        // This could be improved if we ever figure out how to get an event when browsers zoom,
        // but until then we have to stick with reading client rects.
        // --
        // The same has been observed with Firefox on Windows7
        // --
        // The same has been oversved with Safari
        return false;
    }
    return true;
})();
var alwaysRenderInlineSelection = (browser.isEdgeOrIE);
var DomReadingContext = /** @class */ (function () {
    function DomReadingContext(domNode, endNode) {
        this._domNode = domNode;
        this._clientRectDeltaLeft = 0;
        this._clientRectDeltaLeftRead = false;
        this.endNode = endNode;
    }
    Object.defineProperty(DomReadingContext.prototype, "clientRectDeltaLeft", {
        get: function () {
            if (!this._clientRectDeltaLeftRead) {
                this._clientRectDeltaLeftRead = true;
                this._clientRectDeltaLeft = this._domNode.getBoundingClientRect().left;
            }
            return this._clientRectDeltaLeft;
        },
        enumerable: true,
        configurable: true
    });
    return DomReadingContext;
}());
export { DomReadingContext };
var ViewLineOptions = /** @class */ (function () {
    function ViewLineOptions(config, themeType) {
        this.themeType = themeType;
        this.renderWhitespace = config.editor.viewInfo.renderWhitespace;
        this.renderControlCharacters = config.editor.viewInfo.renderControlCharacters;
        this.spaceWidth = config.editor.fontInfo.spaceWidth;
        this.useMonospaceOptimizations = (config.editor.fontInfo.isMonospace
            && !config.editor.viewInfo.disableMonospaceOptimizations);
        this.canUseHalfwidthRightwardsArrow = config.editor.fontInfo.canUseHalfwidthRightwardsArrow;
        this.lineHeight = config.editor.lineHeight;
        this.stopRenderingLineAfter = config.editor.viewInfo.stopRenderingLineAfter;
        this.fontLigatures = config.editor.viewInfo.fontLigatures;
    }
    ViewLineOptions.prototype.equals = function (other) {
        return (this.themeType === other.themeType
            && this.renderWhitespace === other.renderWhitespace
            && this.renderControlCharacters === other.renderControlCharacters
            && this.spaceWidth === other.spaceWidth
            && this.useMonospaceOptimizations === other.useMonospaceOptimizations
            && this.canUseHalfwidthRightwardsArrow === other.canUseHalfwidthRightwardsArrow
            && this.lineHeight === other.lineHeight
            && this.stopRenderingLineAfter === other.stopRenderingLineAfter
            && this.fontLigatures === other.fontLigatures);
    };
    return ViewLineOptions;
}());
export { ViewLineOptions };
var ViewLine = /** @class */ (function () {
    function ViewLine(options) {
        this._options = options;
        this._isMaybeInvalid = true;
        this._renderedViewLine = null;
    }
    // --- begin IVisibleLineData
    ViewLine.prototype.getDomNode = function () {
        if (this._renderedViewLine && this._renderedViewLine.domNode) {
            return this._renderedViewLine.domNode.domNode;
        }
        return null;
    };
    ViewLine.prototype.setDomNode = function (domNode) {
        if (this._renderedViewLine) {
            this._renderedViewLine.domNode = createFastDomNode(domNode);
        }
        else {
            throw new Error('I have no rendered view line to set the dom node to...');
        }
    };
    ViewLine.prototype.onContentChanged = function () {
        this._isMaybeInvalid = true;
    };
    ViewLine.prototype.onTokensChanged = function () {
        this._isMaybeInvalid = true;
    };
    ViewLine.prototype.onDecorationsChanged = function () {
        this._isMaybeInvalid = true;
    };
    ViewLine.prototype.onOptionsChanged = function (newOptions) {
        this._isMaybeInvalid = true;
        this._options = newOptions;
    };
    ViewLine.prototype.onSelectionChanged = function () {
        if (alwaysRenderInlineSelection || this._options.themeType === HIGH_CONTRAST) {
            this._isMaybeInvalid = true;
            return true;
        }
        return false;
    };
    ViewLine.prototype.renderLine = function (lineNumber, deltaTop, viewportData, sb) {
        if (this._isMaybeInvalid === false) {
            // it appears that nothing relevant has changed
            return false;
        }
        this._isMaybeInvalid = false;
        var lineData = viewportData.getViewLineRenderingData(lineNumber);
        var options = this._options;
        var actualInlineDecorations = LineDecoration.filter(lineData.inlineDecorations, lineNumber, lineData.minColumn, lineData.maxColumn);
        if (alwaysRenderInlineSelection || options.themeType === HIGH_CONTRAST) {
            var selections = viewportData.selections;
            for (var i = 0, len = selections.length; i < len; i++) {
                var selection = selections[i];
                if (selection.endLineNumber < lineNumber || selection.startLineNumber > lineNumber) {
                    // Selection does not intersect line
                    continue;
                }
                var startColumn = (selection.startLineNumber === lineNumber ? selection.startColumn : lineData.minColumn);
                var endColumn = (selection.endLineNumber === lineNumber ? selection.endColumn : lineData.maxColumn);
                if (startColumn < endColumn) {
                    actualInlineDecorations.push(new LineDecoration(startColumn, endColumn, 'inline-selected-text', 0 /* Regular */));
                }
            }
        }
        var renderLineInput = new RenderLineInput(options.useMonospaceOptimizations, options.canUseHalfwidthRightwardsArrow, lineData.content, lineData.continuesWithWrappedLine, lineData.isBasicASCII, lineData.containsRTL, lineData.minColumn - 1, lineData.tokens, actualInlineDecorations, lineData.tabSize, options.spaceWidth, options.stopRenderingLineAfter, options.renderWhitespace, options.renderControlCharacters, options.fontLigatures);
        if (this._renderedViewLine && this._renderedViewLine.input.equals(renderLineInput)) {
            // no need to do anything, we have the same render input
            return false;
        }
        sb.appendASCIIString('<div style="top:');
        sb.appendASCIIString(String(deltaTop));
        sb.appendASCIIString('px;height:');
        sb.appendASCIIString(String(this._options.lineHeight));
        sb.appendASCIIString('px;" class="');
        sb.appendASCIIString(ViewLine.CLASS_NAME);
        sb.appendASCIIString('">');
        var output = renderViewLine(renderLineInput, sb);
        sb.appendASCIIString('</div>');
        var renderedViewLine = null;
        if (canUseFastRenderedViewLine && lineData.isBasicASCII && options.useMonospaceOptimizations && output.containsForeignElements === 0 /* None */) {
            if (lineData.content.length < 300 && renderLineInput.lineTokens.getCount() < 100) {
                // Browser rounding errors have been observed in Chrome and IE, so using the fast
                // view line only for short lines. Please test before removing the length check...
                // ---
                // Another rounding error has been observed on Linux in VSCode, where <span> width
                // rounding errors add up to an observable large number...
                // ---
                // Also see another example of rounding errors on Windows in
                // https://github.com/Microsoft/vscode/issues/33178
                renderedViewLine = new FastRenderedViewLine(this._renderedViewLine ? this._renderedViewLine.domNode : null, renderLineInput, output.characterMapping);
            }
        }
        if (!renderedViewLine) {
            renderedViewLine = createRenderedLine(this._renderedViewLine ? this._renderedViewLine.domNode : null, renderLineInput, output.characterMapping, output.containsRTL, output.containsForeignElements);
        }
        this._renderedViewLine = renderedViewLine;
        return true;
    };
    ViewLine.prototype.layoutLine = function (lineNumber, deltaTop) {
        if (this._renderedViewLine && this._renderedViewLine.domNode) {
            this._renderedViewLine.domNode.setTop(deltaTop);
            this._renderedViewLine.domNode.setHeight(this._options.lineHeight);
        }
    };
    // --- end IVisibleLineData
    ViewLine.prototype.getWidth = function () {
        if (!this._renderedViewLine) {
            return 0;
        }
        return this._renderedViewLine.getWidth();
    };
    ViewLine.prototype.getWidthIsFast = function () {
        if (!this._renderedViewLine) {
            return true;
        }
        return this._renderedViewLine.getWidthIsFast();
    };
    ViewLine.prototype.getVisibleRangesForRange = function (startColumn, endColumn, context) {
        if (!this._renderedViewLine) {
            return null;
        }
        startColumn = startColumn | 0; // @perf
        endColumn = endColumn | 0; // @perf
        startColumn = Math.min(this._renderedViewLine.input.lineContent.length + 1, Math.max(1, startColumn));
        endColumn = Math.min(this._renderedViewLine.input.lineContent.length + 1, Math.max(1, endColumn));
        var stopRenderingLineAfter = this._renderedViewLine.input.stopRenderingLineAfter | 0; // @perf
        if (stopRenderingLineAfter !== -1 && startColumn > stopRenderingLineAfter && endColumn > stopRenderingLineAfter) {
            // This range is obviously not visible
            return null;
        }
        if (stopRenderingLineAfter !== -1 && startColumn > stopRenderingLineAfter) {
            startColumn = stopRenderingLineAfter;
        }
        if (stopRenderingLineAfter !== -1 && endColumn > stopRenderingLineAfter) {
            endColumn = stopRenderingLineAfter;
        }
        return this._renderedViewLine.getVisibleRangesForRange(startColumn, endColumn, context);
    };
    ViewLine.prototype.getColumnOfNodeOffset = function (lineNumber, spanNode, offset) {
        if (!this._renderedViewLine) {
            return 1;
        }
        return this._renderedViewLine.getColumnOfNodeOffset(lineNumber, spanNode, offset);
    };
    ViewLine.CLASS_NAME = 'view-line';
    return ViewLine;
}());
export { ViewLine };
/**
 * A rendered line which is guaranteed to contain only regular ASCII and is rendered with a monospace font.
 */
var FastRenderedViewLine = /** @class */ (function () {
    function FastRenderedViewLine(domNode, renderLineInput, characterMapping) {
        this.domNode = domNode;
        this.input = renderLineInput;
        this._characterMapping = characterMapping;
        this._charWidth = renderLineInput.spaceWidth;
    }
    FastRenderedViewLine.prototype.getWidth = function () {
        return this._getCharPosition(this._characterMapping.length);
    };
    FastRenderedViewLine.prototype.getWidthIsFast = function () {
        return true;
    };
    FastRenderedViewLine.prototype.getVisibleRangesForRange = function (startColumn, endColumn, context) {
        var startPosition = this._getCharPosition(startColumn);
        var endPosition = this._getCharPosition(endColumn);
        return [new HorizontalRange(startPosition, endPosition - startPosition)];
    };
    FastRenderedViewLine.prototype._getCharPosition = function (column) {
        var charOffset = this._characterMapping.getAbsoluteOffsets();
        if (charOffset.length === 0) {
            // No characters on this line
            return 0;
        }
        return Math.round(this._charWidth * charOffset[column - 1]);
    };
    FastRenderedViewLine.prototype.getColumnOfNodeOffset = function (lineNumber, spanNode, offset) {
        var spanNodeTextContentLength = spanNode.textContent.length;
        var spanIndex = -1;
        while (spanNode) {
            spanNode = spanNode.previousSibling;
            spanIndex++;
        }
        var charOffset = this._characterMapping.partDataToCharOffset(spanIndex, spanNodeTextContentLength, offset);
        return charOffset + 1;
    };
    return FastRenderedViewLine;
}());
/**
 * Every time we render a line, we save what we have rendered in an instance of this class.
 */
var RenderedViewLine = /** @class */ (function () {
    function RenderedViewLine(domNode, renderLineInput, characterMapping, containsRTL, containsForeignElements) {
        this.domNode = domNode;
        this.input = renderLineInput;
        this._characterMapping = characterMapping;
        this._isWhitespaceOnly = /^\s*$/.test(renderLineInput.lineContent);
        this._containsForeignElements = containsForeignElements;
        this._cachedWidth = -1;
        this._pixelOffsetCache = null;
        if (!containsRTL || this._characterMapping.length === 0 /* the line is empty */) {
            this._pixelOffsetCache = new Int32Array(Math.max(2, this._characterMapping.length + 1));
            for (var column = 0, len = this._characterMapping.length; column <= len; column++) {
                this._pixelOffsetCache[column] = -1;
            }
        }
    }
    // --- Reading from the DOM methods
    RenderedViewLine.prototype._getReadingTarget = function () {
        return this.domNode.domNode.firstChild;
    };
    /**
     * Width of the line in pixels
     */
    RenderedViewLine.prototype.getWidth = function () {
        if (this._cachedWidth === -1) {
            this._cachedWidth = this._getReadingTarget().offsetWidth;
        }
        return this._cachedWidth;
    };
    RenderedViewLine.prototype.getWidthIsFast = function () {
        if (this._cachedWidth === -1) {
            return false;
        }
        return true;
    };
    /**
     * Visible ranges for a model range
     */
    RenderedViewLine.prototype.getVisibleRangesForRange = function (startColumn, endColumn, context) {
        if (this._pixelOffsetCache !== null) {
            // the text is LTR
            var startOffset = this._readPixelOffset(startColumn, context);
            if (startOffset === -1) {
                return null;
            }
            var endOffset = this._readPixelOffset(endColumn, context);
            if (endOffset === -1) {
                return null;
            }
            return [new HorizontalRange(startOffset, endOffset - startOffset)];
        }
        return this._readVisibleRangesForRange(startColumn, endColumn, context);
    };
    RenderedViewLine.prototype._readVisibleRangesForRange = function (startColumn, endColumn, context) {
        if (startColumn === endColumn) {
            var pixelOffset = this._readPixelOffset(startColumn, context);
            if (pixelOffset === -1) {
                return null;
            }
            else {
                return [new HorizontalRange(pixelOffset, 0)];
            }
        }
        else {
            return this._readRawVisibleRangesForRange(startColumn, endColumn, context);
        }
    };
    RenderedViewLine.prototype._readPixelOffset = function (column, context) {
        if (this._characterMapping.length === 0) {
            // This line has no content
            if (this._containsForeignElements === 0 /* None */) {
                // We can assume the line is really empty
                return 0;
            }
            if (this._containsForeignElements === 2 /* After */) {
                // We have foreign elements after the (empty) line
                return 0;
            }
            if (this._containsForeignElements === 1 /* Before */) {
                // We have foreign element before the (empty) line
                return this.getWidth();
            }
        }
        if (this._pixelOffsetCache !== null) {
            // the text is LTR
            var cachedPixelOffset = this._pixelOffsetCache[column];
            if (cachedPixelOffset !== -1) {
                return cachedPixelOffset;
            }
            var result = this._actualReadPixelOffset(column, context);
            this._pixelOffsetCache[column] = result;
            return result;
        }
        return this._actualReadPixelOffset(column, context);
    };
    RenderedViewLine.prototype._actualReadPixelOffset = function (column, context) {
        if (this._characterMapping.length === 0) {
            // This line has no content
            var r_1 = RangeUtil.readHorizontalRanges(this._getReadingTarget(), 0, 0, 0, 0, context.clientRectDeltaLeft, context.endNode);
            if (!r_1 || r_1.length === 0) {
                return -1;
            }
            return r_1[0].left;
        }
        if (column === this._characterMapping.length && this._isWhitespaceOnly && this._containsForeignElements === 0 /* None */) {
            // This branch helps in the case of whitespace only lines which have a width set
            return this.getWidth();
        }
        var partData = this._characterMapping.charOffsetToPartData(column - 1);
        var partIndex = CharacterMapping.getPartIndex(partData);
        var charOffsetInPart = CharacterMapping.getCharIndex(partData);
        var r = RangeUtil.readHorizontalRanges(this._getReadingTarget(), partIndex, charOffsetInPart, partIndex, charOffsetInPart, context.clientRectDeltaLeft, context.endNode);
        if (!r || r.length === 0) {
            return -1;
        }
        return r[0].left;
    };
    RenderedViewLine.prototype._readRawVisibleRangesForRange = function (startColumn, endColumn, context) {
        if (startColumn === 1 && endColumn === this._characterMapping.length) {
            // This branch helps IE with bidi text & gives a performance boost to other browsers when reading visible ranges for an entire line
            return [new HorizontalRange(0, this.getWidth())];
        }
        var startPartData = this._characterMapping.charOffsetToPartData(startColumn - 1);
        var startPartIndex = CharacterMapping.getPartIndex(startPartData);
        var startCharOffsetInPart = CharacterMapping.getCharIndex(startPartData);
        var endPartData = this._characterMapping.charOffsetToPartData(endColumn - 1);
        var endPartIndex = CharacterMapping.getPartIndex(endPartData);
        var endCharOffsetInPart = CharacterMapping.getCharIndex(endPartData);
        return RangeUtil.readHorizontalRanges(this._getReadingTarget(), startPartIndex, startCharOffsetInPart, endPartIndex, endCharOffsetInPart, context.clientRectDeltaLeft, context.endNode);
    };
    /**
     * Returns the column for the text found at a specific offset inside a rendered dom node
     */
    RenderedViewLine.prototype.getColumnOfNodeOffset = function (lineNumber, spanNode, offset) {
        var spanNodeTextContentLength = spanNode.textContent.length;
        var spanIndex = -1;
        while (spanNode) {
            spanNode = spanNode.previousSibling;
            spanIndex++;
        }
        var charOffset = this._characterMapping.partDataToCharOffset(spanIndex, spanNodeTextContentLength, offset);
        return charOffset + 1;
    };
    return RenderedViewLine;
}());
var WebKitRenderedViewLine = /** @class */ (function (_super) {
    __extends(WebKitRenderedViewLine, _super);
    function WebKitRenderedViewLine() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WebKitRenderedViewLine.prototype._readVisibleRangesForRange = function (startColumn, endColumn, context) {
        var output = _super.prototype._readVisibleRangesForRange.call(this, startColumn, endColumn, context);
        if (!output || output.length === 0 || startColumn === endColumn || (startColumn === 1 && endColumn === this._characterMapping.length)) {
            return output;
        }
        // WebKit is buggy and returns an expanded range (to contain words in some cases)
        // The last client rect is enlarged (I think)
        if (!this.input.containsRTL) {
            // This is an attempt to patch things up
            // Find position of last column
            var endPixelOffset = this._readPixelOffset(endColumn, context);
            if (endPixelOffset !== -1) {
                var lastRange = output[output.length - 1];
                if (lastRange.left < endPixelOffset) {
                    // Trim down the width of the last visible range to not go after the last column's position
                    lastRange.width = endPixelOffset - lastRange.left;
                }
            }
        }
        return output;
    };
    return WebKitRenderedViewLine;
}(RenderedViewLine));
var createRenderedLine = (function () {
    if (browser.isWebKit) {
        return createWebKitRenderedLine;
    }
    return createNormalRenderedLine;
})();
function createWebKitRenderedLine(domNode, renderLineInput, characterMapping, containsRTL, containsForeignElements) {
    return new WebKitRenderedViewLine(domNode, renderLineInput, characterMapping, containsRTL, containsForeignElements);
}
function createNormalRenderedLine(domNode, renderLineInput, characterMapping, containsRTL, containsForeignElements) {
    return new RenderedViewLine(domNode, renderLineInput, characterMapping, containsRTL, containsForeignElements);
}
