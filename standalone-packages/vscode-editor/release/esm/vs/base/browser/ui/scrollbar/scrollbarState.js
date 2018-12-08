/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
/**
 * The minimal size of the slider (such that it can still be clickable) -- it is artificially enlarged.
 */
var MINIMUM_SLIDER_SIZE = 20;
var ScrollbarState = /** @class */ (function () {
    function ScrollbarState(arrowSize, scrollbarSize, oppositeScrollbarSize) {
        this._scrollbarSize = Math.round(scrollbarSize);
        this._oppositeScrollbarSize = Math.round(oppositeScrollbarSize);
        this._arrowSize = Math.round(arrowSize);
        this._visibleSize = 0;
        this._scrollSize = 0;
        this._scrollPosition = 0;
        this._computedAvailableSize = 0;
        this._computedIsNeeded = false;
        this._computedSliderSize = 0;
        this._computedSliderRatio = 0;
        this._computedSliderPosition = 0;
        this._refreshComputedValues();
    }
    ScrollbarState.prototype.clone = function () {
        var r = new ScrollbarState(this._arrowSize, this._scrollbarSize, this._oppositeScrollbarSize);
        r.setVisibleSize(this._visibleSize);
        r.setScrollSize(this._scrollSize);
        r.setScrollPosition(this._scrollPosition);
        return r;
    };
    ScrollbarState.prototype.setVisibleSize = function (visibleSize) {
        var iVisibleSize = Math.round(visibleSize);
        if (this._visibleSize !== iVisibleSize) {
            this._visibleSize = iVisibleSize;
            this._refreshComputedValues();
            return true;
        }
        return false;
    };
    ScrollbarState.prototype.setScrollSize = function (scrollSize) {
        var iScrollSize = Math.round(scrollSize);
        if (this._scrollSize !== iScrollSize) {
            this._scrollSize = iScrollSize;
            this._refreshComputedValues();
            return true;
        }
        return false;
    };
    ScrollbarState.prototype.setScrollPosition = function (scrollPosition) {
        var iScrollPosition = Math.round(scrollPosition);
        if (this._scrollPosition !== iScrollPosition) {
            this._scrollPosition = iScrollPosition;
            this._refreshComputedValues();
            return true;
        }
        return false;
    };
    ScrollbarState._computeValues = function (oppositeScrollbarSize, arrowSize, visibleSize, scrollSize, scrollPosition) {
        var computedAvailableSize = Math.max(0, visibleSize - oppositeScrollbarSize);
        var computedRepresentableSize = Math.max(0, computedAvailableSize - 2 * arrowSize);
        var computedIsNeeded = (scrollSize > 0 && scrollSize > visibleSize);
        if (!computedIsNeeded) {
            // There is no need for a slider
            return {
                computedAvailableSize: Math.round(computedAvailableSize),
                computedIsNeeded: computedIsNeeded,
                computedSliderSize: Math.round(computedRepresentableSize),
                computedSliderRatio: 0,
                computedSliderPosition: 0,
            };
        }
        // We must artificially increase the size of the slider if needed, since the slider would be too small to grab with the mouse otherwise
        var computedSliderSize = Math.round(Math.max(MINIMUM_SLIDER_SIZE, Math.floor(visibleSize * computedRepresentableSize / scrollSize)));
        // The slider can move from 0 to `computedRepresentableSize` - `computedSliderSize`
        // in the same way `scrollPosition` can move from 0 to `scrollSize` - `visibleSize`.
        var computedSliderRatio = (computedRepresentableSize - computedSliderSize) / (scrollSize - visibleSize);
        var computedSliderPosition = (scrollPosition * computedSliderRatio);
        return {
            computedAvailableSize: Math.round(computedAvailableSize),
            computedIsNeeded: computedIsNeeded,
            computedSliderSize: Math.round(computedSliderSize),
            computedSliderRatio: computedSliderRatio,
            computedSliderPosition: Math.round(computedSliderPosition),
        };
    };
    ScrollbarState.prototype._refreshComputedValues = function () {
        var r = ScrollbarState._computeValues(this._oppositeScrollbarSize, this._arrowSize, this._visibleSize, this._scrollSize, this._scrollPosition);
        this._computedAvailableSize = r.computedAvailableSize;
        this._computedIsNeeded = r.computedIsNeeded;
        this._computedSliderSize = r.computedSliderSize;
        this._computedSliderRatio = r.computedSliderRatio;
        this._computedSliderPosition = r.computedSliderPosition;
    };
    ScrollbarState.prototype.getArrowSize = function () {
        return this._arrowSize;
    };
    ScrollbarState.prototype.getScrollPosition = function () {
        return this._scrollPosition;
    };
    ScrollbarState.prototype.getRectangleLargeSize = function () {
        return this._computedAvailableSize;
    };
    ScrollbarState.prototype.getRectangleSmallSize = function () {
        return this._scrollbarSize;
    };
    ScrollbarState.prototype.isNeeded = function () {
        return this._computedIsNeeded;
    };
    ScrollbarState.prototype.getSliderSize = function () {
        return this._computedSliderSize;
    };
    ScrollbarState.prototype.getSliderPosition = function () {
        return this._computedSliderPosition;
    };
    /**
     * Compute a desired `scrollPosition` such that `offset` ends up in the center of the slider.
     * `offset` is based on the same coordinate system as the `sliderPosition`.
     */
    ScrollbarState.prototype.getDesiredScrollPositionFromOffset = function (offset) {
        if (!this._computedIsNeeded) {
            // no need for a slider
            return 0;
        }
        var desiredSliderPosition = offset - this._arrowSize - this._computedSliderSize / 2;
        return Math.round(desiredSliderPosition / this._computedSliderRatio);
    };
    /**
     * Compute a desired `scrollPosition` such that the slider moves by `delta`.
     */
    ScrollbarState.prototype.getDesiredScrollPositionFromDelta = function (delta) {
        if (!this._computedIsNeeded) {
            // no need for a slider
            return 0;
        }
        var desiredSliderPosition = this._computedSliderPosition + delta;
        return Math.round(desiredSliderPosition / this._computedSliderRatio);
    };
    return ScrollbarState;
}());
export { ScrollbarState };
