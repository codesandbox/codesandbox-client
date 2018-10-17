/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import * as Platform from '../../../common/platform.js';
import * as DomUtils from '../../dom.js';
import { GlobalMouseMoveMonitor, standardMouseMoveMerger } from '../../globalMouseMoveMonitor.js';
import { Widget } from '../widget.js';
import { createFastDomNode } from '../../fastDomNode.js';
import { ScrollbarArrow } from './scrollbarArrow.js';
import { ScrollbarVisibilityController } from './scrollbarVisibilityController.js';
/**
 * The orthogonal distance to the slider at which dragging "resets". This implements "snapping"
 */
var MOUSE_DRAG_RESET_DISTANCE = 140;
var AbstractScrollbar = /** @class */ (function (_super) {
    __extends(AbstractScrollbar, _super);
    function AbstractScrollbar(opts) {
        var _this = _super.call(this) || this;
        _this._lazyRender = opts.lazyRender;
        _this._host = opts.host;
        _this._scrollable = opts.scrollable;
        _this._scrollbarState = opts.scrollbarState;
        _this._visibilityController = _this._register(new ScrollbarVisibilityController(opts.visibility, 'visible scrollbar ' + opts.extraScrollbarClassName, 'invisible scrollbar ' + opts.extraScrollbarClassName));
        _this._mouseMoveMonitor = _this._register(new GlobalMouseMoveMonitor());
        _this._shouldRender = true;
        _this.domNode = createFastDomNode(document.createElement('div'));
        _this.domNode.setAttribute('role', 'presentation');
        _this.domNode.setAttribute('aria-hidden', 'true');
        _this._visibilityController.setDomNode(_this.domNode);
        _this.domNode.setPosition('absolute');
        _this.onmousedown(_this.domNode.domNode, function (e) { return _this._domNodeMouseDown(e); });
        return _this;
    }
    // ----------------- creation
    /**
     * Creates the dom node for an arrow & adds it to the container
     */
    AbstractScrollbar.prototype._createArrow = function (opts) {
        var arrow = this._register(new ScrollbarArrow(opts));
        this.domNode.domNode.appendChild(arrow.bgDomNode);
        this.domNode.domNode.appendChild(arrow.domNode);
    };
    /**
     * Creates the slider dom node, adds it to the container & hooks up the events
     */
    AbstractScrollbar.prototype._createSlider = function (top, left, width, height) {
        var _this = this;
        this.slider = createFastDomNode(document.createElement('div'));
        this.slider.setClassName('slider');
        this.slider.setPosition('absolute');
        this.slider.setTop(top);
        this.slider.setLeft(left);
        this.slider.setWidth(width);
        this.slider.setHeight(height);
        this.slider.setLayerHinting(true);
        this.domNode.domNode.appendChild(this.slider.domNode);
        this.onmousedown(this.slider.domNode, function (e) {
            if (e.leftButton) {
                e.preventDefault();
                _this._sliderMouseDown(e, function () { });
            }
        });
    };
    // ----------------- Update state
    AbstractScrollbar.prototype._onElementSize = function (visibleSize) {
        if (this._scrollbarState.setVisibleSize(visibleSize)) {
            this._visibilityController.setIsNeeded(this._scrollbarState.isNeeded());
            this._shouldRender = true;
            if (!this._lazyRender) {
                this.render();
            }
        }
        return this._shouldRender;
    };
    AbstractScrollbar.prototype._onElementScrollSize = function (elementScrollSize) {
        if (this._scrollbarState.setScrollSize(elementScrollSize)) {
            this._visibilityController.setIsNeeded(this._scrollbarState.isNeeded());
            this._shouldRender = true;
            if (!this._lazyRender) {
                this.render();
            }
        }
        return this._shouldRender;
    };
    AbstractScrollbar.prototype._onElementScrollPosition = function (elementScrollPosition) {
        if (this._scrollbarState.setScrollPosition(elementScrollPosition)) {
            this._visibilityController.setIsNeeded(this._scrollbarState.isNeeded());
            this._shouldRender = true;
            if (!this._lazyRender) {
                this.render();
            }
        }
        return this._shouldRender;
    };
    // ----------------- rendering
    AbstractScrollbar.prototype.beginReveal = function () {
        this._visibilityController.setShouldBeVisible(true);
    };
    AbstractScrollbar.prototype.beginHide = function () {
        this._visibilityController.setShouldBeVisible(false);
    };
    AbstractScrollbar.prototype.render = function () {
        if (!this._shouldRender) {
            return;
        }
        this._shouldRender = false;
        this._renderDomNode(this._scrollbarState.getRectangleLargeSize(), this._scrollbarState.getRectangleSmallSize());
        this._updateSlider(this._scrollbarState.getSliderSize(), this._scrollbarState.getArrowSize() + this._scrollbarState.getSliderPosition());
    };
    // ----------------- DOM events
    AbstractScrollbar.prototype._domNodeMouseDown = function (e) {
        if (e.target !== this.domNode.domNode) {
            return;
        }
        this._onMouseDown(e);
    };
    AbstractScrollbar.prototype.delegateMouseDown = function (e) {
        var domTop = this.domNode.domNode.getClientRects()[0].top;
        var sliderStart = domTop + this._scrollbarState.getSliderPosition();
        var sliderStop = domTop + this._scrollbarState.getSliderPosition() + this._scrollbarState.getSliderSize();
        var mousePos = this._sliderMousePosition(e);
        if (sliderStart <= mousePos && mousePos <= sliderStop) {
            // Act as if it was a mouse down on the slider
            if (e.leftButton) {
                e.preventDefault();
                this._sliderMouseDown(e, function () { });
            }
        }
        else {
            // Act as if it was a mouse down on the scrollbar
            this._onMouseDown(e);
        }
    };
    AbstractScrollbar.prototype._onMouseDown = function (e) {
        var offsetX;
        var offsetY;
        if (e.target === this.domNode.domNode && typeof e.browserEvent.offsetX === 'number' && typeof e.browserEvent.offsetY === 'number') {
            offsetX = e.browserEvent.offsetX;
            offsetY = e.browserEvent.offsetY;
        }
        else {
            var domNodePosition = DomUtils.getDomNodePagePosition(this.domNode.domNode);
            offsetX = e.posx - domNodePosition.left;
            offsetY = e.posy - domNodePosition.top;
        }
        this._setDesiredScrollPositionNow(this._scrollbarState.getDesiredScrollPositionFromOffset(this._mouseDownRelativePosition(offsetX, offsetY)));
        if (e.leftButton) {
            e.preventDefault();
            this._sliderMouseDown(e, function () { });
        }
    };
    AbstractScrollbar.prototype._sliderMouseDown = function (e, onDragFinished) {
        var _this = this;
        var initialMousePosition = this._sliderMousePosition(e);
        var initialMouseOrthogonalPosition = this._sliderOrthogonalMousePosition(e);
        var initialScrollbarState = this._scrollbarState.clone();
        this.slider.toggleClassName('active', true);
        this._mouseMoveMonitor.startMonitoring(standardMouseMoveMerger, function (mouseMoveData) {
            var mouseOrthogonalPosition = _this._sliderOrthogonalMousePosition(mouseMoveData);
            var mouseOrthogonalDelta = Math.abs(mouseOrthogonalPosition - initialMouseOrthogonalPosition);
            if (Platform.isWindows && mouseOrthogonalDelta > MOUSE_DRAG_RESET_DISTANCE) {
                // The mouse has wondered away from the scrollbar => reset dragging
                _this._setDesiredScrollPositionNow(initialScrollbarState.getScrollPosition());
                return;
            }
            var mousePosition = _this._sliderMousePosition(mouseMoveData);
            var mouseDelta = mousePosition - initialMousePosition;
            _this._setDesiredScrollPositionNow(initialScrollbarState.getDesiredScrollPositionFromDelta(mouseDelta));
        }, function () {
            _this.slider.toggleClassName('active', false);
            _this._host.onDragEnd();
            onDragFinished();
        });
        this._host.onDragStart();
    };
    AbstractScrollbar.prototype._setDesiredScrollPositionNow = function (_desiredScrollPosition) {
        var desiredScrollPosition = {};
        this.writeScrollPosition(desiredScrollPosition, _desiredScrollPosition);
        this._scrollable.setScrollPositionNow(desiredScrollPosition);
    };
    return AbstractScrollbar;
}(Widget));
export { AbstractScrollbar };
