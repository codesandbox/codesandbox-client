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
import './contextview.css';
import * as DOM from '../../dom';
import { dispose, toDisposable, combinedDisposable, Disposable } from '../../../common/lifecycle';
import { Range } from '../../../common/range';
/**
 * Lays out a one dimensional view next to an anchor in a viewport.
 *
 * @returns The view offset within the viewport.
 */
export function layout(viewportSize, viewSize, anchor) {
    var anchorEnd = anchor.offset + anchor.size;
    if (anchor.position === 0 /* Before */) {
        if (viewSize <= viewportSize - anchorEnd) {
            return anchorEnd + 8; // happy case, lay it out after the anchor
        }
        if (viewSize <= anchor.offset) {
            return anchor.offset - viewSize - 8; // ok case, lay it out before the anchor
        }
        return Math.max(viewportSize - viewSize, 0); // sad case, lay it over the anchor
    }
    else {
        if (viewSize <= anchor.offset) {
            return anchor.offset - viewSize; // happy case, lay it out before the anchor
        }
        if (viewSize <= viewportSize - anchorEnd) {
            return anchorEnd; // ok case, lay it out after the anchor
        }
        return 0; // sad case, lay it over the anchor
    }
}
var ContextView = /** @class */ (function (_super) {
    __extends(ContextView, _super);
    function ContextView(container) {
        var _this = _super.call(this) || this;
        _this.view = DOM.$('.context-view');
        DOM.hide(_this.view);
        _this.setContainer(container);
        _this._register(toDisposable(function () { return _this.setContainer(null); }));
        return _this;
    }
    ContextView.prototype.setContainer = function (container) {
        var _this = this;
        if (this.container) {
            this.toDisposeOnSetContainer = dispose(this.toDisposeOnSetContainer);
            this.container.removeChild(this.view);
            this.container = null;
        }
        if (container) {
            this.container = container;
            this.container.appendChild(this.view);
            var toDisposeOnSetContainer_1 = [];
            ContextView.BUBBLE_UP_EVENTS.forEach(function (event) {
                toDisposeOnSetContainer_1.push(DOM.addStandardDisposableListener(_this.container, event, function (e) {
                    _this.onDOMEvent(e, document.activeElement, false);
                }));
            });
            ContextView.BUBBLE_DOWN_EVENTS.forEach(function (event) {
                toDisposeOnSetContainer_1.push(DOM.addStandardDisposableListener(_this.container, event, function (e) {
                    _this.onDOMEvent(e, document.activeElement, true);
                }, true));
            });
            this.toDisposeOnSetContainer = combinedDisposable(toDisposeOnSetContainer_1);
        }
    };
    ContextView.prototype.show = function (delegate) {
        if (this.isVisible()) {
            this.hide();
        }
        // Show static box
        DOM.clearNode(this.view);
        this.view.className = 'context-view';
        this.view.style.top = '0px';
        this.view.style.left = '0px';
        DOM.show(this.view);
        // Render content
        this.toDisposeOnClean = delegate.render(this.view);
        // Set active delegate
        this.delegate = delegate;
        // Layout
        this.doLayout();
    };
    ContextView.prototype.layout = function () {
        if (!this.isVisible()) {
            return;
        }
        if (this.delegate.canRelayout === false) {
            this.hide();
            return;
        }
        if (this.delegate.layout) {
            this.delegate.layout();
        }
        this.doLayout();
    };
    ContextView.prototype.doLayout = function () {
        // Check that we still have a delegate - this.delegate.layout may have hidden
        if (!this.isVisible()) {
            return;
        }
        // Get anchor
        var anchor = this.delegate.getAnchor();
        // Compute around
        var around;
        // Get the element's position and size (to anchor the view)
        if (DOM.isHTMLElement(anchor)) {
            var elementPosition = DOM.getDomNodePagePosition(anchor);
            around = {
                top: elementPosition.top,
                left: elementPosition.left,
                width: elementPosition.width,
                height: elementPosition.height
            };
        }
        else {
            var realAnchor = anchor;
            around = {
                top: realAnchor.y,
                left: realAnchor.x,
                width: realAnchor.width || 0,
                height: realAnchor.height || 0
            };
        }
        var viewSizeWidth = DOM.getTotalWidth(this.view);
        var viewSizeHeight = DOM.getTotalHeight(this.view);
        var anchorPosition = this.delegate.anchorPosition || 0 /* BELOW */;
        var anchorAlignment = this.delegate.anchorAlignment || 0 /* LEFT */;
        var verticalAnchor = { offset: around.top, size: around.height, position: anchorPosition === 0 /* BELOW */ ? 0 /* Before */ : 1 /* After */ };
        var horizontalAnchor;
        if (anchorAlignment === 0 /* LEFT */) {
            horizontalAnchor = { offset: around.left, size: 0, position: 0 /* Before */ };
        }
        else {
            horizontalAnchor = { offset: around.left + around.width, size: 0, position: 1 /* After */ };
        }
        var top = layout(this.container.offsetHeight, viewSizeHeight, verticalAnchor);
        // if view intersects vertically with anchor, shift it horizontally
        if (Range.intersects({ start: top, end: top + viewSizeHeight }, { start: verticalAnchor.offset, end: verticalAnchor.offset + verticalAnchor.size })) {
            horizontalAnchor.size = around.width;
        }
        var left = layout(this.container.offsetWidth, viewSizeWidth, horizontalAnchor);
        DOM.removeClasses(this.view, 'top', 'bottom', 'left', 'right');
        DOM.addClass(this.view, anchorPosition === 0 /* BELOW */ ? 'bottom' : 'top');
        DOM.addClass(this.view, anchorAlignment === 0 /* LEFT */ ? 'left' : 'right');
        var containerPosition = DOM.getDomNodePagePosition(this.container);
        this.view.style.top = top - containerPosition.top + "px";
        this.view.style.left = left - containerPosition.left + "px";
        this.view.style.width = 'initial';
    };
    ContextView.prototype.hide = function (data) {
        if (this.delegate && this.delegate.onHide) {
            this.delegate.onHide(data);
        }
        this.delegate = null;
        if (this.toDisposeOnClean) {
            this.toDisposeOnClean.dispose();
            this.toDisposeOnClean = null;
        }
        DOM.hide(this.view);
    };
    ContextView.prototype.isVisible = function () {
        return !!this.delegate;
    };
    ContextView.prototype.onDOMEvent = function (e, element, onCapture) {
        if (this.delegate) {
            if (this.delegate.onDOMEvent) {
                this.delegate.onDOMEvent(e, document.activeElement);
            }
            else if (onCapture && !DOM.isAncestor(e.target, this.container)) {
                this.hide();
            }
        }
    };
    ContextView.prototype.dispose = function () {
        this.hide();
        _super.prototype.dispose.call(this);
    };
    ContextView.BUBBLE_UP_EVENTS = ['click', 'keydown', 'focus', 'blur'];
    ContextView.BUBBLE_DOWN_EVENTS = ['click'];
    return ContextView;
}(Disposable));
export { ContextView };
