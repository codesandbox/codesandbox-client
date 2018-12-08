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
import './viewLines.css';
import { RunOnceScheduler } from '../../../../base/common/async.js';
import { Configuration } from '../../config/configuration.js';
import { VisibleLinesCollection } from '../../view/viewLayer.js';
import { PartFingerprints, ViewPart } from '../../view/viewPart.js';
import { DomReadingContext, ViewLine, ViewLineOptions } from './viewLine.js';
import { Position } from '../../../common/core/position.js';
import { Range } from '../../../common/core/range.js';
import { LineVisibleRanges } from '../../../common/view/renderingContext.js';
var LastRenderedData = /** @class */ (function () {
    function LastRenderedData() {
        this._currentVisibleRange = new Range(1, 1, 1, 1);
    }
    LastRenderedData.prototype.getCurrentVisibleRange = function () {
        return this._currentVisibleRange;
    };
    LastRenderedData.prototype.setCurrentVisibleRange = function (currentVisibleRange) {
        this._currentVisibleRange = currentVisibleRange;
    };
    return LastRenderedData;
}());
var HorizontalRevealRequest = /** @class */ (function () {
    function HorizontalRevealRequest(lineNumber, startColumn, endColumn, startScrollTop, stopScrollTop, scrollType) {
        this.lineNumber = lineNumber;
        this.startColumn = startColumn;
        this.endColumn = endColumn;
        this.startScrollTop = startScrollTop;
        this.stopScrollTop = stopScrollTop;
        this.scrollType = scrollType;
    }
    return HorizontalRevealRequest;
}());
var ViewLines = /** @class */ (function (_super) {
    __extends(ViewLines, _super);
    function ViewLines(context, linesContent) {
        var _this = _super.call(this, context) || this;
        _this._linesContent = linesContent;
        _this._textRangeRestingSpot = document.createElement('div');
        _this._visibleLines = new VisibleLinesCollection(_this);
        _this.domNode = _this._visibleLines.domNode;
        var conf = _this._context.configuration;
        _this._lineHeight = conf.editor.lineHeight;
        _this._typicalHalfwidthCharacterWidth = conf.editor.fontInfo.typicalHalfwidthCharacterWidth;
        _this._isViewportWrapping = conf.editor.wrappingInfo.isViewportWrapping;
        _this._revealHorizontalRightPadding = conf.editor.viewInfo.revealHorizontalRightPadding;
        _this._canUseLayerHinting = conf.editor.canUseLayerHinting;
        _this._viewLineOptions = new ViewLineOptions(conf, _this._context.theme.type);
        PartFingerprints.write(_this.domNode, 7 /* ViewLines */);
        _this.domNode.setClassName('view-lines');
        Configuration.applyFontInfo(_this.domNode, conf.editor.fontInfo);
        // --- width & height
        _this._maxLineWidth = 0;
        _this._asyncUpdateLineWidths = new RunOnceScheduler(function () {
            _this._updateLineWidthsSlow();
        }, 200);
        _this._lastRenderedData = new LastRenderedData();
        _this._horizontalRevealRequest = null;
        return _this;
    }
    ViewLines.prototype.dispose = function () {
        this._asyncUpdateLineWidths.dispose();
        _super.prototype.dispose.call(this);
    };
    ViewLines.prototype.getDomNode = function () {
        return this.domNode;
    };
    // ---- begin IVisibleLinesHost
    ViewLines.prototype.createVisibleLine = function () {
        return new ViewLine(this._viewLineOptions);
    };
    // ---- end IVisibleLinesHost
    // ---- begin view event handlers
    ViewLines.prototype.onConfigurationChanged = function (e) {
        this._visibleLines.onConfigurationChanged(e);
        if (e.wrappingInfo) {
            this._maxLineWidth = 0;
        }
        var conf = this._context.configuration;
        if (e.lineHeight) {
            this._lineHeight = conf.editor.lineHeight;
        }
        if (e.fontInfo) {
            this._typicalHalfwidthCharacterWidth = conf.editor.fontInfo.typicalHalfwidthCharacterWidth;
        }
        if (e.wrappingInfo) {
            this._isViewportWrapping = conf.editor.wrappingInfo.isViewportWrapping;
        }
        if (e.viewInfo) {
            this._revealHorizontalRightPadding = conf.editor.viewInfo.revealHorizontalRightPadding;
        }
        if (e.canUseLayerHinting) {
            this._canUseLayerHinting = conf.editor.canUseLayerHinting;
        }
        if (e.fontInfo) {
            Configuration.applyFontInfo(this.domNode, conf.editor.fontInfo);
        }
        this._onOptionsMaybeChanged();
        if (e.layoutInfo) {
            this._maxLineWidth = 0;
        }
        return true;
    };
    ViewLines.prototype._onOptionsMaybeChanged = function () {
        var conf = this._context.configuration;
        var newViewLineOptions = new ViewLineOptions(conf, this._context.theme.type);
        if (!this._viewLineOptions.equals(newViewLineOptions)) {
            this._viewLineOptions = newViewLineOptions;
            var startLineNumber = this._visibleLines.getStartLineNumber();
            var endLineNumber = this._visibleLines.getEndLineNumber();
            for (var lineNumber = startLineNumber; lineNumber <= endLineNumber; lineNumber++) {
                var line = this._visibleLines.getVisibleLine(lineNumber);
                line.onOptionsChanged(this._viewLineOptions);
            }
            return true;
        }
        return false;
    };
    ViewLines.prototype.onCursorStateChanged = function (e) {
        var rendStartLineNumber = this._visibleLines.getStartLineNumber();
        var rendEndLineNumber = this._visibleLines.getEndLineNumber();
        var r = false;
        for (var lineNumber = rendStartLineNumber; lineNumber <= rendEndLineNumber; lineNumber++) {
            r = this._visibleLines.getVisibleLine(lineNumber).onSelectionChanged() || r;
        }
        return r;
    };
    ViewLines.prototype.onDecorationsChanged = function (e) {
        if (true /*e.inlineDecorationsChanged*/) {
            var rendStartLineNumber = this._visibleLines.getStartLineNumber();
            var rendEndLineNumber = this._visibleLines.getEndLineNumber();
            for (var lineNumber = rendStartLineNumber; lineNumber <= rendEndLineNumber; lineNumber++) {
                this._visibleLines.getVisibleLine(lineNumber).onDecorationsChanged();
            }
        }
        return true;
    };
    ViewLines.prototype.onFlushed = function (e) {
        var shouldRender = this._visibleLines.onFlushed(e);
        this._maxLineWidth = 0;
        return shouldRender;
    };
    ViewLines.prototype.onLinesChanged = function (e) {
        return this._visibleLines.onLinesChanged(e);
    };
    ViewLines.prototype.onLinesDeleted = function (e) {
        return this._visibleLines.onLinesDeleted(e);
    };
    ViewLines.prototype.onLinesInserted = function (e) {
        return this._visibleLines.onLinesInserted(e);
    };
    ViewLines.prototype.onRevealRangeRequest = function (e) {
        // Using the future viewport here in order to handle multiple
        // incoming reveal range requests that might all desire to be animated
        var desiredScrollTop = this._computeScrollTopToRevealRange(this._context.viewLayout.getFutureViewport(), e.range, e.verticalType);
        // validate the new desired scroll top
        var newScrollPosition = this._context.viewLayout.validateScrollPosition({ scrollTop: desiredScrollTop });
        if (e.revealHorizontal) {
            if (e.range.startLineNumber !== e.range.endLineNumber) {
                // Two or more lines? => scroll to base (That's how you see most of the two lines)
                newScrollPosition = {
                    scrollTop: newScrollPosition.scrollTop,
                    scrollLeft: 0
                };
            }
            else {
                // We don't necessarily know the horizontal offset of this range since the line might not be in the view...
                this._horizontalRevealRequest = new HorizontalRevealRequest(e.range.startLineNumber, e.range.startColumn, e.range.endColumn, this._context.viewLayout.getCurrentScrollTop(), newScrollPosition.scrollTop, e.scrollType);
            }
        }
        else {
            this._horizontalRevealRequest = null;
        }
        var scrollTopDelta = Math.abs(this._context.viewLayout.getCurrentScrollTop() - newScrollPosition.scrollTop);
        if (e.scrollType === 0 /* Smooth */ && scrollTopDelta > this._lineHeight) {
            this._context.viewLayout.setScrollPositionSmooth(newScrollPosition);
        }
        else {
            this._context.viewLayout.setScrollPositionNow(newScrollPosition);
        }
        return true;
    };
    ViewLines.prototype.onScrollChanged = function (e) {
        if (this._horizontalRevealRequest && e.scrollLeftChanged) {
            // cancel any outstanding horizontal reveal request if someone else scrolls horizontally.
            this._horizontalRevealRequest = null;
        }
        if (this._horizontalRevealRequest && e.scrollTopChanged) {
            var min = Math.min(this._horizontalRevealRequest.startScrollTop, this._horizontalRevealRequest.stopScrollTop);
            var max = Math.max(this._horizontalRevealRequest.startScrollTop, this._horizontalRevealRequest.stopScrollTop);
            if (e.scrollTop < min || e.scrollTop > max) {
                // cancel any outstanding horizontal reveal request if someone else scrolls vertically.
                this._horizontalRevealRequest = null;
            }
        }
        this.domNode.setWidth(e.scrollWidth);
        return this._visibleLines.onScrollChanged(e) || true;
    };
    ViewLines.prototype.onTokensChanged = function (e) {
        return this._visibleLines.onTokensChanged(e);
    };
    ViewLines.prototype.onZonesChanged = function (e) {
        this._context.viewLayout.onMaxLineWidthChanged(this._maxLineWidth);
        return this._visibleLines.onZonesChanged(e);
    };
    ViewLines.prototype.onThemeChanged = function (e) {
        return this._onOptionsMaybeChanged();
    };
    // ---- end view event handlers
    // ----------- HELPERS FOR OTHERS
    ViewLines.prototype.getPositionFromDOMInfo = function (spanNode, offset) {
        var viewLineDomNode = this._getViewLineDomNode(spanNode);
        if (viewLineDomNode === null) {
            // Couldn't find view line node
            return null;
        }
        var lineNumber = this._getLineNumberFor(viewLineDomNode);
        if (lineNumber === -1) {
            // Couldn't find view line node
            return null;
        }
        if (lineNumber < 1 || lineNumber > this._context.model.getLineCount()) {
            // lineNumber is outside range
            return null;
        }
        if (this._context.model.getLineMaxColumn(lineNumber) === 1) {
            // Line is empty
            return new Position(lineNumber, 1);
        }
        var rendStartLineNumber = this._visibleLines.getStartLineNumber();
        var rendEndLineNumber = this._visibleLines.getEndLineNumber();
        if (lineNumber < rendStartLineNumber || lineNumber > rendEndLineNumber) {
            // Couldn't find line
            return null;
        }
        var column = this._visibleLines.getVisibleLine(lineNumber).getColumnOfNodeOffset(lineNumber, spanNode, offset);
        var minColumn = this._context.model.getLineMinColumn(lineNumber);
        if (column < minColumn) {
            column = minColumn;
        }
        return new Position(lineNumber, column);
    };
    ViewLines.prototype._getViewLineDomNode = function (node) {
        while (node && node.nodeType === 1) {
            if (node.className === ViewLine.CLASS_NAME) {
                return node;
            }
            node = node.parentElement;
        }
        return null;
    };
    /**
     * @returns the line number of this view line dom node.
     */
    ViewLines.prototype._getLineNumberFor = function (domNode) {
        var startLineNumber = this._visibleLines.getStartLineNumber();
        var endLineNumber = this._visibleLines.getEndLineNumber();
        for (var lineNumber = startLineNumber; lineNumber <= endLineNumber; lineNumber++) {
            var line = this._visibleLines.getVisibleLine(lineNumber);
            if (domNode === line.getDomNode()) {
                return lineNumber;
            }
        }
        return -1;
    };
    ViewLines.prototype.getLineWidth = function (lineNumber) {
        var rendStartLineNumber = this._visibleLines.getStartLineNumber();
        var rendEndLineNumber = this._visibleLines.getEndLineNumber();
        if (lineNumber < rendStartLineNumber || lineNumber > rendEndLineNumber) {
            // Couldn't find line
            return -1;
        }
        return this._visibleLines.getVisibleLine(lineNumber).getWidth();
    };
    ViewLines.prototype.linesVisibleRangesForRange = function (_range, includeNewLines) {
        if (this.shouldRender()) {
            // Cannot read from the DOM because it is dirty
            // i.e. the model & the dom are out of sync, so I'd be reading something stale
            return null;
        }
        var originalEndLineNumber = _range.endLineNumber;
        var range = Range.intersectRanges(_range, this._lastRenderedData.getCurrentVisibleRange());
        if (!range) {
            return null;
        }
        var visibleRanges = [], visibleRangesLen = 0;
        var domReadingContext = new DomReadingContext(this.domNode.domNode, this._textRangeRestingSpot);
        var nextLineModelLineNumber = 0;
        if (includeNewLines) {
            nextLineModelLineNumber = this._context.model.coordinatesConverter.convertViewPositionToModelPosition(new Position(range.startLineNumber, 1)).lineNumber;
        }
        var rendStartLineNumber = this._visibleLines.getStartLineNumber();
        var rendEndLineNumber = this._visibleLines.getEndLineNumber();
        for (var lineNumber = range.startLineNumber; lineNumber <= range.endLineNumber; lineNumber++) {
            if (lineNumber < rendStartLineNumber || lineNumber > rendEndLineNumber) {
                continue;
            }
            var startColumn = lineNumber === range.startLineNumber ? range.startColumn : 1;
            var endColumn = lineNumber === range.endLineNumber ? range.endColumn : this._context.model.getLineMaxColumn(lineNumber);
            var visibleRangesForLine = this._visibleLines.getVisibleLine(lineNumber).getVisibleRangesForRange(startColumn, endColumn, domReadingContext);
            if (!visibleRangesForLine || visibleRangesForLine.length === 0) {
                continue;
            }
            if (includeNewLines && lineNumber < originalEndLineNumber) {
                var currentLineModelLineNumber = nextLineModelLineNumber;
                nextLineModelLineNumber = this._context.model.coordinatesConverter.convertViewPositionToModelPosition(new Position(lineNumber + 1, 1)).lineNumber;
                if (currentLineModelLineNumber !== nextLineModelLineNumber) {
                    visibleRangesForLine[visibleRangesForLine.length - 1].width += this._typicalHalfwidthCharacterWidth;
                }
            }
            visibleRanges[visibleRangesLen++] = new LineVisibleRanges(lineNumber, visibleRangesForLine);
        }
        if (visibleRangesLen === 0) {
            return null;
        }
        return visibleRanges;
    };
    ViewLines.prototype.visibleRangesForRange2 = function (_range) {
        if (this.shouldRender()) {
            // Cannot read from the DOM because it is dirty
            // i.e. the model & the dom are out of sync, so I'd be reading something stale
            return null;
        }
        var range = Range.intersectRanges(_range, this._lastRenderedData.getCurrentVisibleRange());
        if (!range) {
            return null;
        }
        var result = [];
        var domReadingContext = new DomReadingContext(this.domNode.domNode, this._textRangeRestingSpot);
        var rendStartLineNumber = this._visibleLines.getStartLineNumber();
        var rendEndLineNumber = this._visibleLines.getEndLineNumber();
        for (var lineNumber = range.startLineNumber; lineNumber <= range.endLineNumber; lineNumber++) {
            if (lineNumber < rendStartLineNumber || lineNumber > rendEndLineNumber) {
                continue;
            }
            var startColumn = lineNumber === range.startLineNumber ? range.startColumn : 1;
            var endColumn = lineNumber === range.endLineNumber ? range.endColumn : this._context.model.getLineMaxColumn(lineNumber);
            var visibleRangesForLine = this._visibleLines.getVisibleLine(lineNumber).getVisibleRangesForRange(startColumn, endColumn, domReadingContext);
            if (!visibleRangesForLine || visibleRangesForLine.length === 0) {
                continue;
            }
            result = result.concat(visibleRangesForLine);
        }
        if (result.length === 0) {
            return null;
        }
        return result;
    };
    ViewLines.prototype.visibleRangeForPosition = function (position) {
        var visibleRanges = this.visibleRangesForRange2(new Range(position.lineNumber, position.column, position.lineNumber, position.column));
        if (!visibleRanges) {
            return null;
        }
        return visibleRanges[0];
    };
    // --- implementation
    ViewLines.prototype.updateLineWidths = function () {
        this._updateLineWidths(false);
    };
    /**
     * Updates the max line width if it is fast to compute.
     * Returns true if all lines were taken into account.
     * Returns false if some lines need to be reevaluated (in a slow fashion).
     */
    ViewLines.prototype._updateLineWidthsFast = function () {
        return this._updateLineWidths(true);
    };
    ViewLines.prototype._updateLineWidthsSlow = function () {
        this._updateLineWidths(false);
    };
    ViewLines.prototype._updateLineWidths = function (fast) {
        var rendStartLineNumber = this._visibleLines.getStartLineNumber();
        var rendEndLineNumber = this._visibleLines.getEndLineNumber();
        var localMaxLineWidth = 1;
        var allWidthsComputed = true;
        for (var lineNumber = rendStartLineNumber; lineNumber <= rendEndLineNumber; lineNumber++) {
            var visibleLine = this._visibleLines.getVisibleLine(lineNumber);
            if (fast && !visibleLine.getWidthIsFast()) {
                // Cannot compute width in a fast way for this line
                allWidthsComputed = false;
                continue;
            }
            localMaxLineWidth = Math.max(localMaxLineWidth, visibleLine.getWidth());
        }
        if (allWidthsComputed && rendStartLineNumber === 1 && rendEndLineNumber === this._context.model.getLineCount()) {
            // we know the max line width for all the lines
            this._maxLineWidth = 0;
        }
        this._ensureMaxLineWidth(localMaxLineWidth);
        return allWidthsComputed;
    };
    ViewLines.prototype.prepareRender = function () {
        throw new Error('Not supported');
    };
    ViewLines.prototype.render = function () {
        throw new Error('Not supported');
    };
    ViewLines.prototype.renderText = function (viewportData) {
        // (1) render lines - ensures lines are in the DOM
        this._visibleLines.renderLines(viewportData);
        this._lastRenderedData.setCurrentVisibleRange(viewportData.visibleRange);
        this.domNode.setWidth(this._context.viewLayout.getScrollWidth());
        this.domNode.setHeight(Math.min(this._context.viewLayout.getScrollHeight(), 1000000));
        // (2) compute horizontal scroll position:
        //  - this must happen after the lines are in the DOM since it might need a line that rendered just now
        //  - it might change `scrollWidth` and `scrollLeft`
        if (this._horizontalRevealRequest) {
            var revealLineNumber = this._horizontalRevealRequest.lineNumber;
            var revealStartColumn = this._horizontalRevealRequest.startColumn;
            var revealEndColumn = this._horizontalRevealRequest.endColumn;
            var scrollType = this._horizontalRevealRequest.scrollType;
            // Check that we have the line that contains the horizontal range in the viewport
            if (viewportData.startLineNumber <= revealLineNumber && revealLineNumber <= viewportData.endLineNumber) {
                this._horizontalRevealRequest = null;
                // allow `visibleRangesForRange2` to work
                this.onDidRender();
                // compute new scroll position
                var newScrollLeft = this._computeScrollLeftToRevealRange(revealLineNumber, revealStartColumn, revealEndColumn);
                var isViewportWrapping = this._isViewportWrapping;
                if (!isViewportWrapping) {
                    // ensure `scrollWidth` is large enough
                    this._ensureMaxLineWidth(newScrollLeft.maxHorizontalOffset);
                }
                // set `scrollLeft`
                if (scrollType === 0 /* Smooth */) {
                    this._context.viewLayout.setScrollPositionSmooth({
                        scrollLeft: newScrollLeft.scrollLeft
                    });
                }
                else {
                    this._context.viewLayout.setScrollPositionNow({
                        scrollLeft: newScrollLeft.scrollLeft
                    });
                }
            }
        }
        // Update max line width (not so important, it is just so the horizontal scrollbar doesn't get too small)
        if (!this._updateLineWidthsFast()) {
            // Computing the width of some lines would be slow => delay it
            this._asyncUpdateLineWidths.schedule();
        }
        // (3) handle scrolling
        this._linesContent.setLayerHinting(this._canUseLayerHinting);
        var adjustedScrollTop = this._context.viewLayout.getCurrentScrollTop() - viewportData.bigNumbersDelta;
        this._linesContent.setTop(-adjustedScrollTop);
        this._linesContent.setLeft(-this._context.viewLayout.getCurrentScrollLeft());
    };
    // --- width
    ViewLines.prototype._ensureMaxLineWidth = function (lineWidth) {
        var iLineWidth = Math.ceil(lineWidth);
        if (this._maxLineWidth < iLineWidth) {
            this._maxLineWidth = iLineWidth;
            this._context.viewLayout.onMaxLineWidthChanged(this._maxLineWidth);
        }
    };
    ViewLines.prototype._computeScrollTopToRevealRange = function (viewport, range, verticalType) {
        var viewportStartY = viewport.top;
        var viewportHeight = viewport.height;
        var viewportEndY = viewportStartY + viewportHeight;
        var boxStartY;
        var boxEndY;
        // Have a box that includes one extra line height (for the horizontal scrollbar)
        boxStartY = this._context.viewLayout.getVerticalOffsetForLineNumber(range.startLineNumber);
        boxEndY = this._context.viewLayout.getVerticalOffsetForLineNumber(range.endLineNumber) + this._lineHeight;
        if (verticalType === 0 /* Simple */ || verticalType === 4 /* Bottom */) {
            // Reveal one line more when the last line would be covered by the scrollbar - arrow down case or revealing a line explicitly at bottom
            boxEndY += this._lineHeight;
        }
        var newScrollTop;
        if (verticalType === 1 /* Center */ || verticalType === 2 /* CenterIfOutsideViewport */) {
            if (verticalType === 2 /* CenterIfOutsideViewport */ && viewportStartY <= boxStartY && boxEndY <= viewportEndY) {
                // Box is already in the viewport... do nothing
                newScrollTop = viewportStartY;
            }
            else {
                // Box is outside the viewport... center it
                var boxMiddleY = (boxStartY + boxEndY) / 2;
                newScrollTop = Math.max(0, boxMiddleY - viewportHeight / 2);
            }
        }
        else {
            newScrollTop = this._computeMinimumScrolling(viewportStartY, viewportEndY, boxStartY, boxEndY, verticalType === 3 /* Top */, verticalType === 4 /* Bottom */);
        }
        return newScrollTop;
    };
    ViewLines.prototype._computeScrollLeftToRevealRange = function (lineNumber, startColumn, endColumn) {
        var maxHorizontalOffset = 0;
        var viewport = this._context.viewLayout.getCurrentViewport();
        var viewportStartX = viewport.left;
        var viewportEndX = viewportStartX + viewport.width;
        var visibleRanges = this.visibleRangesForRange2(new Range(lineNumber, startColumn, lineNumber, endColumn));
        var boxStartX = Number.MAX_VALUE;
        var boxEndX = 0;
        if (!visibleRanges) {
            // Unknown
            return {
                scrollLeft: viewportStartX,
                maxHorizontalOffset: maxHorizontalOffset
            };
        }
        for (var i = 0; i < visibleRanges.length; i++) {
            var visibleRange = visibleRanges[i];
            if (visibleRange.left < boxStartX) {
                boxStartX = visibleRange.left;
            }
            if (visibleRange.left + visibleRange.width > boxEndX) {
                boxEndX = visibleRange.left + visibleRange.width;
            }
        }
        maxHorizontalOffset = boxEndX;
        boxStartX = Math.max(0, boxStartX - ViewLines.HORIZONTAL_EXTRA_PX);
        boxEndX += this._revealHorizontalRightPadding;
        var newScrollLeft = this._computeMinimumScrolling(viewportStartX, viewportEndX, boxStartX, boxEndX);
        return {
            scrollLeft: newScrollLeft,
            maxHorizontalOffset: maxHorizontalOffset
        };
    };
    ViewLines.prototype._computeMinimumScrolling = function (viewportStart, viewportEnd, boxStart, boxEnd, revealAtStart, revealAtEnd) {
        viewportStart = viewportStart | 0;
        viewportEnd = viewportEnd | 0;
        boxStart = boxStart | 0;
        boxEnd = boxEnd | 0;
        revealAtStart = !!revealAtStart;
        revealAtEnd = !!revealAtEnd;
        var viewportLength = viewportEnd - viewportStart;
        var boxLength = boxEnd - boxStart;
        if (boxLength < viewportLength) {
            // The box would fit in the viewport
            if (revealAtStart) {
                return boxStart;
            }
            if (revealAtEnd) {
                return Math.max(0, boxEnd - viewportLength);
            }
            if (boxStart < viewportStart) {
                // The box is above the viewport
                return boxStart;
            }
            else if (boxEnd > viewportEnd) {
                // The box is below the viewport
                return Math.max(0, boxEnd - viewportLength);
            }
        }
        else {
            // The box would not fit in the viewport
            // Reveal the beginning of the box
            return boxStart;
        }
        return viewportStart;
    };
    /**
     * Adds this amount of pixels to the right of lines (no-one wants to type near the edge of the viewport)
     */
    ViewLines.HORIZONTAL_EXTRA_PX = 30;
    return ViewLines;
}(ViewPart));
export { ViewLines };
