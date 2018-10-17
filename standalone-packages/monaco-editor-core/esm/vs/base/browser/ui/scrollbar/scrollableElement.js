/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
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
import './media/scrollbars.css';
import * as DomUtils from '../../dom';
import * as Platform from '../../../common/platform';
import { StandardMouseWheelEvent } from '../../mouseEvent';
import { HorizontalScrollbar } from './horizontalScrollbar';
import { VerticalScrollbar } from './verticalScrollbar';
import { dispose } from '../../../common/lifecycle';
import { Scrollable, ScrollbarVisibility } from '../../../common/scrollable';
import { Widget } from '../widget';
import { TimeoutTimer } from '../../../common/async';
import { createFastDomNode } from '../../fastDomNode';
import { Emitter } from '../../../common/event';
var HIDE_TIMEOUT = 500;
var SCROLL_WHEEL_SENSITIVITY = 50;
var SCROLL_WHEEL_SMOOTH_SCROLL_ENABLED = true;
var MouseWheelClassifierItem = /** @class */ (function () {
    function MouseWheelClassifierItem(timestamp, deltaX, deltaY) {
        this.timestamp = timestamp;
        this.deltaX = deltaX;
        this.deltaY = deltaY;
        this.score = 0;
    }
    return MouseWheelClassifierItem;
}());
var MouseWheelClassifier = /** @class */ (function () {
    function MouseWheelClassifier() {
        this._capacity = 5;
        this._memory = [];
        this._front = -1;
        this._rear = -1;
    }
    MouseWheelClassifier.prototype.isPhysicalMouseWheel = function () {
        if (this._front === -1 && this._rear === -1) {
            // no elements
            return false;
        }
        // 0.5 * last + 0.25 * before last + 0.125 * before before last + ...
        var remainingInfluence = 1;
        var score = 0;
        var iteration = 1;
        var index = this._rear;
        do {
            var influence = (index === this._front ? remainingInfluence : Math.pow(2, -iteration));
            remainingInfluence -= influence;
            score += this._memory[index].score * influence;
            if (index === this._front) {
                break;
            }
            index = (this._capacity + index - 1) % this._capacity;
            iteration++;
        } while (true);
        return (score <= 0.5);
    };
    MouseWheelClassifier.prototype.accept = function (timestamp, deltaX, deltaY) {
        var item = new MouseWheelClassifierItem(timestamp, deltaX, deltaY);
        item.score = this._computeScore(item);
        if (this._front === -1 && this._rear === -1) {
            this._memory[0] = item;
            this._front = 0;
            this._rear = 0;
        }
        else {
            this._rear = (this._rear + 1) % this._capacity;
            if (this._rear === this._front) {
                // Drop oldest
                this._front = (this._front + 1) % this._capacity;
            }
            this._memory[this._rear] = item;
        }
    };
    /**
     * A score between 0 and 1 for `item`.
     *  - a score towards 0 indicates that the source appears to be a physical mouse wheel
     *  - a score towards 1 indicates that the source appears to be a touchpad or magic mouse, etc.
     */
    MouseWheelClassifier.prototype._computeScore = function (item) {
        if (Math.abs(item.deltaX) > 0 && Math.abs(item.deltaY) > 0) {
            // both axes exercised => definitely not a physical mouse wheel
            return 1;
        }
        var score = 0.5;
        var prev = (this._front === -1 && this._rear === -1 ? null : this._memory[this._rear]);
        if (prev) {
            // const deltaT = item.timestamp - prev.timestamp;
            // if (deltaT < 1000 / 30) {
            // 	// sooner than X times per second => indicator that this is not a physical mouse wheel
            // 	score += 0.25;
            // }
            // if (item.deltaX === prev.deltaX && item.deltaY === prev.deltaY) {
            // 	// equal amplitude => indicator that this is a physical mouse wheel
            // 	score -= 0.25;
            // }
        }
        if (Math.abs(item.deltaX - Math.round(item.deltaX)) > 0 || Math.abs(item.deltaY - Math.round(item.deltaY)) > 0) {
            // non-integer deltas => indicator that this is not a physical mouse wheel
            score += 0.25;
        }
        return Math.min(Math.max(score, 0), 1);
    };
    MouseWheelClassifier.INSTANCE = new MouseWheelClassifier();
    return MouseWheelClassifier;
}());
export { MouseWheelClassifier };
var AbstractScrollableElement = /** @class */ (function (_super) {
    __extends(AbstractScrollableElement, _super);
    function AbstractScrollableElement(element, options, scrollable) {
        var _this = _super.call(this) || this;
        _this._onScroll = _this._register(new Emitter());
        _this.onScroll = _this._onScroll.event;
        element.style.overflow = 'hidden';
        _this._options = resolveOptions(options);
        _this._scrollable = scrollable;
        _this._register(_this._scrollable.onScroll(function (e) {
            _this._onDidScroll(e);
            _this._onScroll.fire(e);
        }));
        var scrollbarHost = {
            onMouseWheel: function (mouseWheelEvent) { return _this._onMouseWheel(mouseWheelEvent); },
            onDragStart: function () { return _this._onDragStart(); },
            onDragEnd: function () { return _this._onDragEnd(); },
        };
        _this._verticalScrollbar = _this._register(new VerticalScrollbar(_this._scrollable, _this._options, scrollbarHost));
        _this._horizontalScrollbar = _this._register(new HorizontalScrollbar(_this._scrollable, _this._options, scrollbarHost));
        _this._domNode = document.createElement('div');
        _this._domNode.className = 'monaco-scrollable-element ' + _this._options.className;
        _this._domNode.setAttribute('role', 'presentation');
        _this._domNode.style.position = 'relative';
        _this._domNode.style.overflow = 'hidden';
        _this._domNode.appendChild(element);
        _this._domNode.appendChild(_this._horizontalScrollbar.domNode.domNode);
        _this._domNode.appendChild(_this._verticalScrollbar.domNode.domNode);
        if (_this._options.useShadows) {
            _this._leftShadowDomNode = createFastDomNode(document.createElement('div'));
            _this._leftShadowDomNode.setClassName('shadow');
            _this._domNode.appendChild(_this._leftShadowDomNode.domNode);
            _this._topShadowDomNode = createFastDomNode(document.createElement('div'));
            _this._topShadowDomNode.setClassName('shadow');
            _this._domNode.appendChild(_this._topShadowDomNode.domNode);
            _this._topLeftShadowDomNode = createFastDomNode(document.createElement('div'));
            _this._topLeftShadowDomNode.setClassName('shadow top-left-corner');
            _this._domNode.appendChild(_this._topLeftShadowDomNode.domNode);
        }
        _this._listenOnDomNode = _this._options.listenOnDomNode || _this._domNode;
        _this._mouseWheelToDispose = [];
        _this._setListeningToMouseWheel(_this._options.handleMouseWheel);
        _this.onmouseover(_this._listenOnDomNode, function (e) { return _this._onMouseOver(e); });
        _this.onnonbubblingmouseout(_this._listenOnDomNode, function (e) { return _this._onMouseOut(e); });
        _this._hideTimeout = _this._register(new TimeoutTimer());
        _this._isDragging = false;
        _this._mouseIsOver = false;
        _this._shouldRender = true;
        _this._revealOnScroll = true;
        return _this;
    }
    AbstractScrollableElement.prototype.dispose = function () {
        this._mouseWheelToDispose = dispose(this._mouseWheelToDispose);
        _super.prototype.dispose.call(this);
    };
    /**
     * Get the generated 'scrollable' dom node
     */
    AbstractScrollableElement.prototype.getDomNode = function () {
        return this._domNode;
    };
    AbstractScrollableElement.prototype.getOverviewRulerLayoutInfo = function () {
        return {
            parent: this._domNode,
            insertBefore: this._verticalScrollbar.domNode.domNode,
        };
    };
    /**
     * Delegate a mouse down event to the vertical scrollbar.
     * This is to help with clicking somewhere else and having the scrollbar react.
     */
    AbstractScrollableElement.prototype.delegateVerticalScrollbarMouseDown = function (browserEvent) {
        this._verticalScrollbar.delegateMouseDown(browserEvent);
    };
    AbstractScrollableElement.prototype.getScrollDimensions = function () {
        return this._scrollable.getScrollDimensions();
    };
    AbstractScrollableElement.prototype.setScrollDimensions = function (dimensions) {
        this._scrollable.setScrollDimensions(dimensions);
    };
    /**
     * Update the class name of the scrollable element.
     */
    AbstractScrollableElement.prototype.updateClassName = function (newClassName) {
        this._options.className = newClassName;
        // Defaults are different on Macs
        if (Platform.isMacintosh) {
            this._options.className += ' mac';
        }
        this._domNode.className = 'monaco-scrollable-element ' + this._options.className;
    };
    /**
     * Update configuration options for the scrollbar.
     * Really this is Editor.IEditorScrollbarOptions, but base shouldn't
     * depend on Editor.
     */
    AbstractScrollableElement.prototype.updateOptions = function (newOptions) {
        var massagedOptions = resolveOptions(newOptions);
        this._options.handleMouseWheel = massagedOptions.handleMouseWheel;
        this._options.mouseWheelScrollSensitivity = massagedOptions.mouseWheelScrollSensitivity;
        this._setListeningToMouseWheel(this._options.handleMouseWheel);
        if (!this._options.lazyRender) {
            this._render();
        }
    };
    AbstractScrollableElement.prototype.setRevealOnScroll = function (value) {
        this._revealOnScroll = value;
    };
    // -------------------- mouse wheel scrolling --------------------
    AbstractScrollableElement.prototype._setListeningToMouseWheel = function (shouldListen) {
        var _this = this;
        var isListening = (this._mouseWheelToDispose.length > 0);
        if (isListening === shouldListen) {
            // No change
            return;
        }
        // Stop listening (if necessary)
        this._mouseWheelToDispose = dispose(this._mouseWheelToDispose);
        // Start listening (if necessary)
        if (shouldListen) {
            var onMouseWheel = function (browserEvent) {
                var e = new StandardMouseWheelEvent(browserEvent);
                _this._onMouseWheel(e);
            };
            this._mouseWheelToDispose.push(DomUtils.addDisposableListener(this._listenOnDomNode, 'mousewheel', onMouseWheel));
            this._mouseWheelToDispose.push(DomUtils.addDisposableListener(this._listenOnDomNode, 'DOMMouseScroll', onMouseWheel));
        }
    };
    AbstractScrollableElement.prototype._onMouseWheel = function (e) {
        var _a;
        var classifier = MouseWheelClassifier.INSTANCE;
        if (SCROLL_WHEEL_SMOOTH_SCROLL_ENABLED) {
            classifier.accept(Date.now(), e.deltaX, e.deltaY);
        }
        // console.log(`${Date.now()}, ${e.deltaY}, ${e.deltaX}`);
        if (e.deltaY || e.deltaX) {
            var deltaY = e.deltaY * this._options.mouseWheelScrollSensitivity;
            var deltaX = e.deltaX * this._options.mouseWheelScrollSensitivity;
            if (this._options.flipAxes) {
                _a = [deltaX, deltaY], deltaY = _a[0], deltaX = _a[1];
            }
            // Convert vertical scrolling to horizontal if shift is held, this
            // is handled at a higher level on Mac
            var shiftConvert = !Platform.isMacintosh && e.browserEvent && e.browserEvent.shiftKey;
            if ((this._options.scrollYToX || shiftConvert) && !deltaX) {
                deltaX = deltaY;
                deltaY = 0;
            }
            var futureScrollPosition = this._scrollable.getFutureScrollPosition();
            var desiredScrollPosition = {};
            if (deltaY) {
                var desiredScrollTop = futureScrollPosition.scrollTop - SCROLL_WHEEL_SENSITIVITY * deltaY;
                this._verticalScrollbar.writeScrollPosition(desiredScrollPosition, desiredScrollTop);
            }
            if (deltaX) {
                var desiredScrollLeft = futureScrollPosition.scrollLeft - SCROLL_WHEEL_SENSITIVITY * deltaX;
                this._horizontalScrollbar.writeScrollPosition(desiredScrollPosition, desiredScrollLeft);
            }
            // Check that we are scrolling towards a location which is valid
            desiredScrollPosition = this._scrollable.validateScrollPosition(desiredScrollPosition);
            if (futureScrollPosition.scrollLeft !== desiredScrollPosition.scrollLeft || futureScrollPosition.scrollTop !== desiredScrollPosition.scrollTop) {
                var canPerformSmoothScroll = (SCROLL_WHEEL_SMOOTH_SCROLL_ENABLED
                    && this._options.mouseWheelSmoothScroll
                    && classifier.isPhysicalMouseWheel());
                if (canPerformSmoothScroll) {
                    this._scrollable.setScrollPositionSmooth(desiredScrollPosition);
                }
                else {
                    this._scrollable.setScrollPositionNow(desiredScrollPosition);
                }
                this._shouldRender = true;
            }
        }
        if (this._options.alwaysConsumeMouseWheel || this._shouldRender) {
            e.preventDefault();
            e.stopPropagation();
        }
    };
    AbstractScrollableElement.prototype._onDidScroll = function (e) {
        this._shouldRender = this._horizontalScrollbar.onDidScroll(e) || this._shouldRender;
        this._shouldRender = this._verticalScrollbar.onDidScroll(e) || this._shouldRender;
        if (this._options.useShadows) {
            this._shouldRender = true;
        }
        if (this._revealOnScroll) {
            this._reveal();
        }
        if (!this._options.lazyRender) {
            this._render();
        }
    };
    /**
     * Render / mutate the DOM now.
     * Should be used together with the ctor option `lazyRender`.
     */
    AbstractScrollableElement.prototype.renderNow = function () {
        if (!this._options.lazyRender) {
            throw new Error('Please use `lazyRender` together with `renderNow`!');
        }
        this._render();
    };
    AbstractScrollableElement.prototype._render = function () {
        if (!this._shouldRender) {
            return;
        }
        this._shouldRender = false;
        this._horizontalScrollbar.render();
        this._verticalScrollbar.render();
        if (this._options.useShadows) {
            var scrollState = this._scrollable.getCurrentScrollPosition();
            var enableTop = scrollState.scrollTop > 0;
            var enableLeft = scrollState.scrollLeft > 0;
            this._leftShadowDomNode.setClassName('shadow' + (enableLeft ? ' left' : ''));
            this._topShadowDomNode.setClassName('shadow' + (enableTop ? ' top' : ''));
            this._topLeftShadowDomNode.setClassName('shadow top-left-corner' + (enableTop ? ' top' : '') + (enableLeft ? ' left' : ''));
        }
    };
    // -------------------- fade in / fade out --------------------
    AbstractScrollableElement.prototype._onDragStart = function () {
        this._isDragging = true;
        this._reveal();
    };
    AbstractScrollableElement.prototype._onDragEnd = function () {
        this._isDragging = false;
        this._hide();
    };
    AbstractScrollableElement.prototype._onMouseOut = function (e) {
        this._mouseIsOver = false;
        this._hide();
    };
    AbstractScrollableElement.prototype._onMouseOver = function (e) {
        this._mouseIsOver = true;
        this._reveal();
    };
    AbstractScrollableElement.prototype._reveal = function () {
        this._verticalScrollbar.beginReveal();
        this._horizontalScrollbar.beginReveal();
        this._scheduleHide();
    };
    AbstractScrollableElement.prototype._hide = function () {
        if (!this._mouseIsOver && !this._isDragging) {
            this._verticalScrollbar.beginHide();
            this._horizontalScrollbar.beginHide();
        }
    };
    AbstractScrollableElement.prototype._scheduleHide = function () {
        var _this = this;
        if (!this._mouseIsOver && !this._isDragging) {
            this._hideTimeout.cancelAndSet(function () { return _this._hide(); }, HIDE_TIMEOUT);
        }
    };
    return AbstractScrollableElement;
}(Widget));
export { AbstractScrollableElement };
var ScrollableElement = /** @class */ (function (_super) {
    __extends(ScrollableElement, _super);
    function ScrollableElement(element, options) {
        var _this = this;
        options = options || {};
        options.mouseWheelSmoothScroll = false;
        var scrollable = new Scrollable(0, function (callback) { return DomUtils.scheduleAtNextAnimationFrame(callback); });
        _this = _super.call(this, element, options, scrollable) || this;
        _this._register(scrollable);
        return _this;
    }
    ScrollableElement.prototype.setScrollPosition = function (update) {
        this._scrollable.setScrollPositionNow(update);
    };
    ScrollableElement.prototype.getScrollPosition = function () {
        return this._scrollable.getCurrentScrollPosition();
    };
    return ScrollableElement;
}(AbstractScrollableElement));
export { ScrollableElement };
var SmoothScrollableElement = /** @class */ (function (_super) {
    __extends(SmoothScrollableElement, _super);
    function SmoothScrollableElement(element, options, scrollable) {
        return _super.call(this, element, options, scrollable) || this;
    }
    return SmoothScrollableElement;
}(AbstractScrollableElement));
export { SmoothScrollableElement };
var DomScrollableElement = /** @class */ (function (_super) {
    __extends(DomScrollableElement, _super);
    function DomScrollableElement(element, options) {
        var _this = _super.call(this, element, options) || this;
        _this._element = element;
        _this.onScroll(function (e) {
            if (e.scrollTopChanged) {
                _this._element.scrollTop = e.scrollTop;
            }
            if (e.scrollLeftChanged) {
                _this._element.scrollLeft = e.scrollLeft;
            }
        });
        _this.scanDomNode();
        return _this;
    }
    DomScrollableElement.prototype.scanDomNode = function () {
        // widh, scrollLeft, scrollWidth, height, scrollTop, scrollHeight
        this.setScrollDimensions({
            width: this._element.clientWidth,
            scrollWidth: this._element.scrollWidth,
            height: this._element.clientHeight,
            scrollHeight: this._element.scrollHeight
        });
        this.setScrollPosition({
            scrollLeft: this._element.scrollLeft,
            scrollTop: this._element.scrollTop,
        });
    };
    return DomScrollableElement;
}(ScrollableElement));
export { DomScrollableElement };
function resolveOptions(opts) {
    var result = {
        lazyRender: (typeof opts.lazyRender !== 'undefined' ? opts.lazyRender : false),
        className: (typeof opts.className !== 'undefined' ? opts.className : ''),
        useShadows: (typeof opts.useShadows !== 'undefined' ? opts.useShadows : true),
        handleMouseWheel: (typeof opts.handleMouseWheel !== 'undefined' ? opts.handleMouseWheel : true),
        flipAxes: (typeof opts.flipAxes !== 'undefined' ? opts.flipAxes : false),
        alwaysConsumeMouseWheel: (typeof opts.alwaysConsumeMouseWheel !== 'undefined' ? opts.alwaysConsumeMouseWheel : false),
        scrollYToX: (typeof opts.scrollYToX !== 'undefined' ? opts.scrollYToX : false),
        mouseWheelScrollSensitivity: (typeof opts.mouseWheelScrollSensitivity !== 'undefined' ? opts.mouseWheelScrollSensitivity : 1),
        mouseWheelSmoothScroll: (typeof opts.mouseWheelSmoothScroll !== 'undefined' ? opts.mouseWheelSmoothScroll : true),
        arrowSize: (typeof opts.arrowSize !== 'undefined' ? opts.arrowSize : 11),
        listenOnDomNode: (typeof opts.listenOnDomNode !== 'undefined' ? opts.listenOnDomNode : null),
        horizontal: (typeof opts.horizontal !== 'undefined' ? opts.horizontal : ScrollbarVisibility.Auto),
        horizontalScrollbarSize: (typeof opts.horizontalScrollbarSize !== 'undefined' ? opts.horizontalScrollbarSize : 10),
        horizontalSliderSize: (typeof opts.horizontalSliderSize !== 'undefined' ? opts.horizontalSliderSize : 0),
        horizontalHasArrows: (typeof opts.horizontalHasArrows !== 'undefined' ? opts.horizontalHasArrows : false),
        vertical: (typeof opts.vertical !== 'undefined' ? opts.vertical : ScrollbarVisibility.Auto),
        verticalScrollbarSize: (typeof opts.verticalScrollbarSize !== 'undefined' ? opts.verticalScrollbarSize : 10),
        verticalHasArrows: (typeof opts.verticalHasArrows !== 'undefined' ? opts.verticalHasArrows : false),
        verticalSliderSize: (typeof opts.verticalSliderSize !== 'undefined' ? opts.verticalSliderSize : 0)
    };
    result.horizontalSliderSize = (typeof opts.horizontalSliderSize !== 'undefined' ? opts.horizontalSliderSize : result.horizontalScrollbarSize);
    result.verticalSliderSize = (typeof opts.verticalSliderSize !== 'undefined' ? opts.verticalSliderSize : result.verticalScrollbarSize);
    // Defaults are different on Macs
    if (Platform.isMacintosh) {
        result.className += ' mac';
    }
    return result;
}
