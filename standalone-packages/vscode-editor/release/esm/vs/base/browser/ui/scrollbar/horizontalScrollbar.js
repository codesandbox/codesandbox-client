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
import { StandardMouseWheelEvent } from '../../mouseEvent.js';
import { AbstractScrollbar } from './abstractScrollbar.js';
import { ARROW_IMG_SIZE } from './scrollbarArrow.js';
import { ScrollbarState } from './scrollbarState.js';
var HorizontalScrollbar = /** @class */ (function (_super) {
    __extends(HorizontalScrollbar, _super);
    function HorizontalScrollbar(scrollable, options, host) {
        var _this = _super.call(this, {
            lazyRender: options.lazyRender,
            host: host,
            scrollbarState: new ScrollbarState((options.horizontalHasArrows ? options.arrowSize : 0), (options.horizontal === 2 /* Hidden */ ? 0 : options.horizontalScrollbarSize), (options.vertical === 2 /* Hidden */ ? 0 : options.verticalScrollbarSize)),
            visibility: options.horizontal,
            extraScrollbarClassName: 'horizontal',
            scrollable: scrollable
        }) || this;
        if (options.horizontalHasArrows) {
            var arrowDelta = (options.arrowSize - ARROW_IMG_SIZE) / 2;
            var scrollbarDelta = (options.horizontalScrollbarSize - ARROW_IMG_SIZE) / 2;
            _this._createArrow({
                className: 'left-arrow',
                top: scrollbarDelta,
                left: arrowDelta,
                bottom: void 0,
                right: void 0,
                bgWidth: options.arrowSize,
                bgHeight: options.horizontalScrollbarSize,
                onActivate: function () { return _this._host.onMouseWheel(new StandardMouseWheelEvent(null, 1, 0)); },
            });
            _this._createArrow({
                className: 'right-arrow',
                top: scrollbarDelta,
                left: void 0,
                bottom: void 0,
                right: arrowDelta,
                bgWidth: options.arrowSize,
                bgHeight: options.horizontalScrollbarSize,
                onActivate: function () { return _this._host.onMouseWheel(new StandardMouseWheelEvent(null, -1, 0)); },
            });
        }
        _this._createSlider(Math.floor((options.horizontalScrollbarSize - options.horizontalSliderSize) / 2), 0, undefined, options.horizontalSliderSize);
        return _this;
    }
    HorizontalScrollbar.prototype._updateSlider = function (sliderSize, sliderPosition) {
        this.slider.setWidth(sliderSize);
        this.slider.setLeft(sliderPosition);
    };
    HorizontalScrollbar.prototype._renderDomNode = function (largeSize, smallSize) {
        this.domNode.setWidth(largeSize);
        this.domNode.setHeight(smallSize);
        this.domNode.setLeft(0);
        this.domNode.setBottom(0);
    };
    HorizontalScrollbar.prototype.onDidScroll = function (e) {
        this._shouldRender = this._onElementScrollSize(e.scrollWidth) || this._shouldRender;
        this._shouldRender = this._onElementScrollPosition(e.scrollLeft) || this._shouldRender;
        this._shouldRender = this._onElementSize(e.width) || this._shouldRender;
        return this._shouldRender;
    };
    HorizontalScrollbar.prototype._mouseDownRelativePosition = function (offsetX, offsetY) {
        return offsetX;
    };
    HorizontalScrollbar.prototype._sliderMousePosition = function (e) {
        return e.posx;
    };
    HorizontalScrollbar.prototype._sliderOrthogonalMousePosition = function (e) {
        return e.posy;
    };
    HorizontalScrollbar.prototype.writeScrollPosition = function (target, scrollPosition) {
        target.scrollLeft = scrollPosition;
    };
    return HorizontalScrollbar;
}(AbstractScrollbar));
export { HorizontalScrollbar };
