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
import { Disposable } from '../../../base/common/lifecycle.js';
import { Scrollable } from '../../../base/common/scrollable.js';
import { LinesLayout } from './linesLayout.js';
import { Viewport } from '../viewModel/viewModel.js';
var SMOOTH_SCROLLING_TIME = 125;
var ViewLayout = /** @class */ (function (_super) {
    __extends(ViewLayout, _super);
    function ViewLayout(configuration, lineCount, scheduleAtNextAnimationFrame) {
        var _this = _super.call(this) || this;
        _this._configuration = configuration;
        _this._linesLayout = new LinesLayout(lineCount, _this._configuration.editor.lineHeight);
        _this.scrollable = _this._register(new Scrollable(0, scheduleAtNextAnimationFrame));
        _this._configureSmoothScrollDuration();
        _this.scrollable.setScrollDimensions({
            width: configuration.editor.layoutInfo.contentWidth,
            height: configuration.editor.layoutInfo.contentHeight
        });
        _this.onDidScroll = _this.scrollable.onScroll;
        _this._updateHeight();
        return _this;
    }
    ViewLayout.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
    };
    ViewLayout.prototype.onHeightMaybeChanged = function () {
        this._updateHeight();
    };
    ViewLayout.prototype._configureSmoothScrollDuration = function () {
        this.scrollable.setSmoothScrollDuration(this._configuration.editor.viewInfo.smoothScrolling ? SMOOTH_SCROLLING_TIME : 0);
    };
    // ---- begin view event handlers
    ViewLayout.prototype.onConfigurationChanged = function (e) {
        if (e.lineHeight) {
            this._linesLayout.setLineHeight(this._configuration.editor.lineHeight);
        }
        if (e.layoutInfo) {
            this.scrollable.setScrollDimensions({
                width: this._configuration.editor.layoutInfo.contentWidth,
                height: this._configuration.editor.layoutInfo.contentHeight
            });
        }
        if (e.viewInfo) {
            this._configureSmoothScrollDuration();
        }
        this._updateHeight();
    };
    ViewLayout.prototype.onFlushed = function (lineCount) {
        this._linesLayout.onFlushed(lineCount);
    };
    ViewLayout.prototype.onLinesDeleted = function (fromLineNumber, toLineNumber) {
        this._linesLayout.onLinesDeleted(fromLineNumber, toLineNumber);
    };
    ViewLayout.prototype.onLinesInserted = function (fromLineNumber, toLineNumber) {
        this._linesLayout.onLinesInserted(fromLineNumber, toLineNumber);
    };
    // ---- end view event handlers
    ViewLayout.prototype._getHorizontalScrollbarHeight = function (scrollDimensions) {
        if (this._configuration.editor.viewInfo.scrollbar.horizontal === 2 /* Hidden */) {
            // horizontal scrollbar not visible
            return 0;
        }
        if (scrollDimensions.width >= scrollDimensions.scrollWidth) {
            // horizontal scrollbar not visible
            return 0;
        }
        return this._configuration.editor.viewInfo.scrollbar.horizontalScrollbarSize;
    };
    ViewLayout.prototype._getTotalHeight = function () {
        var scrollDimensions = this.scrollable.getScrollDimensions();
        var result = this._linesLayout.getLinesTotalHeight();
        if (this._configuration.editor.viewInfo.scrollBeyondLastLine) {
            result += scrollDimensions.height - this._configuration.editor.lineHeight;
        }
        else {
            result += this._getHorizontalScrollbarHeight(scrollDimensions);
        }
        return Math.max(scrollDimensions.height, result);
    };
    ViewLayout.prototype._updateHeight = function () {
        this.scrollable.setScrollDimensions({
            scrollHeight: this._getTotalHeight()
        });
    };
    // ---- Layouting logic
    ViewLayout.prototype.getCurrentViewport = function () {
        var scrollDimensions = this.scrollable.getScrollDimensions();
        var currentScrollPosition = this.scrollable.getCurrentScrollPosition();
        return new Viewport(currentScrollPosition.scrollTop, currentScrollPosition.scrollLeft, scrollDimensions.width, scrollDimensions.height);
    };
    ViewLayout.prototype.getFutureViewport = function () {
        var scrollDimensions = this.scrollable.getScrollDimensions();
        var currentScrollPosition = this.scrollable.getFutureScrollPosition();
        return new Viewport(currentScrollPosition.scrollTop, currentScrollPosition.scrollLeft, scrollDimensions.width, scrollDimensions.height);
    };
    ViewLayout.prototype._computeScrollWidth = function (maxLineWidth, viewportWidth) {
        var isViewportWrapping = this._configuration.editor.wrappingInfo.isViewportWrapping;
        if (!isViewportWrapping) {
            var extraHorizontalSpace = this._configuration.editor.viewInfo.scrollBeyondLastColumn * this._configuration.editor.fontInfo.typicalHalfwidthCharacterWidth;
            var whitespaceMinWidth = this._linesLayout.getWhitespaceMinWidth();
            return Math.max(maxLineWidth + extraHorizontalSpace, viewportWidth, whitespaceMinWidth);
        }
        return Math.max(maxLineWidth, viewportWidth);
    };
    ViewLayout.prototype.onMaxLineWidthChanged = function (maxLineWidth) {
        var newScrollWidth = this._computeScrollWidth(maxLineWidth, this.getCurrentViewport().width);
        this.scrollable.setScrollDimensions({
            scrollWidth: newScrollWidth
        });
        // The height might depend on the fact that there is a horizontal scrollbar or not
        this._updateHeight();
    };
    // ---- view state
    ViewLayout.prototype.saveState = function () {
        var currentScrollPosition = this.scrollable.getFutureScrollPosition();
        var scrollTop = currentScrollPosition.scrollTop;
        var firstLineNumberInViewport = this._linesLayout.getLineNumberAtOrAfterVerticalOffset(scrollTop);
        var whitespaceAboveFirstLine = this._linesLayout.getWhitespaceAccumulatedHeightBeforeLineNumber(firstLineNumberInViewport);
        return {
            scrollTop: scrollTop,
            scrollTopWithoutViewZones: scrollTop - whitespaceAboveFirstLine,
            scrollLeft: currentScrollPosition.scrollLeft
        };
    };
    // ---- IVerticalLayoutProvider
    ViewLayout.prototype.addWhitespace = function (afterLineNumber, ordinal, height, minWidth) {
        return this._linesLayout.insertWhitespace(afterLineNumber, ordinal, height, minWidth);
    };
    ViewLayout.prototype.changeWhitespace = function (id, newAfterLineNumber, newHeight) {
        return this._linesLayout.changeWhitespace(id, newAfterLineNumber, newHeight);
    };
    ViewLayout.prototype.removeWhitespace = function (id) {
        return this._linesLayout.removeWhitespace(id);
    };
    ViewLayout.prototype.getVerticalOffsetForLineNumber = function (lineNumber) {
        return this._linesLayout.getVerticalOffsetForLineNumber(lineNumber);
    };
    ViewLayout.prototype.isAfterLines = function (verticalOffset) {
        return this._linesLayout.isAfterLines(verticalOffset);
    };
    ViewLayout.prototype.getLineNumberAtVerticalOffset = function (verticalOffset) {
        return this._linesLayout.getLineNumberAtOrAfterVerticalOffset(verticalOffset);
    };
    ViewLayout.prototype.getWhitespaceAtVerticalOffset = function (verticalOffset) {
        return this._linesLayout.getWhitespaceAtVerticalOffset(verticalOffset);
    };
    ViewLayout.prototype.getLinesViewportData = function () {
        var visibleBox = this.getCurrentViewport();
        return this._linesLayout.getLinesViewportData(visibleBox.top, visibleBox.top + visibleBox.height);
    };
    ViewLayout.prototype.getLinesViewportDataAtScrollTop = function (scrollTop) {
        // do some minimal validations on scrollTop
        var scrollDimensions = this.scrollable.getScrollDimensions();
        if (scrollTop + scrollDimensions.height > scrollDimensions.scrollHeight) {
            scrollTop = scrollDimensions.scrollHeight - scrollDimensions.height;
        }
        if (scrollTop < 0) {
            scrollTop = 0;
        }
        return this._linesLayout.getLinesViewportData(scrollTop, scrollTop + scrollDimensions.height);
    };
    ViewLayout.prototype.getWhitespaceViewportData = function () {
        var visibleBox = this.getCurrentViewport();
        return this._linesLayout.getWhitespaceViewportData(visibleBox.top, visibleBox.top + visibleBox.height);
    };
    ViewLayout.prototype.getWhitespaces = function () {
        return this._linesLayout.getWhitespaces();
    };
    // ---- IScrollingProvider
    ViewLayout.prototype.getScrollWidth = function () {
        var scrollDimensions = this.scrollable.getScrollDimensions();
        return scrollDimensions.scrollWidth;
    };
    ViewLayout.prototype.getScrollHeight = function () {
        var scrollDimensions = this.scrollable.getScrollDimensions();
        return scrollDimensions.scrollHeight;
    };
    ViewLayout.prototype.getCurrentScrollLeft = function () {
        var currentScrollPosition = this.scrollable.getCurrentScrollPosition();
        return currentScrollPosition.scrollLeft;
    };
    ViewLayout.prototype.getCurrentScrollTop = function () {
        var currentScrollPosition = this.scrollable.getCurrentScrollPosition();
        return currentScrollPosition.scrollTop;
    };
    ViewLayout.prototype.validateScrollPosition = function (scrollPosition) {
        return this.scrollable.validateScrollPosition(scrollPosition);
    };
    ViewLayout.prototype.setScrollPositionNow = function (position) {
        this.scrollable.setScrollPositionNow(position);
    };
    ViewLayout.prototype.setScrollPositionSmooth = function (position) {
        this.scrollable.setScrollPositionSmooth(position);
    };
    ViewLayout.prototype.deltaScrollNow = function (deltaScrollLeft, deltaScrollTop) {
        var currentScrollPosition = this.scrollable.getCurrentScrollPosition();
        this.scrollable.setScrollPositionNow({
            scrollLeft: currentScrollPosition.scrollLeft + deltaScrollLeft,
            scrollTop: currentScrollPosition.scrollTop + deltaScrollTop
        });
    };
    return ViewLayout;
}(Disposable));
export { ViewLayout };
