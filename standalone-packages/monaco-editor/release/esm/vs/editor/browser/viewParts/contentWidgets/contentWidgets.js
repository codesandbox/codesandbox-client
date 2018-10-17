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
import * as dom from '../../../../base/browser/dom.js';
import { createFastDomNode } from '../../../../base/browser/fastDomNode.js';
import { ContentWidgetPositionPreference } from '../../editorBrowser.js';
import { ViewPart, PartFingerprints } from '../../view/viewPart.js';
var Coordinate = /** @class */ (function () {
    function Coordinate(top, left) {
        this.top = top;
        this.left = left;
    }
    return Coordinate;
}());
var ViewContentWidgets = /** @class */ (function (_super) {
    __extends(ViewContentWidgets, _super);
    function ViewContentWidgets(context, viewDomNode) {
        var _this = _super.call(this, context) || this;
        _this._viewDomNode = viewDomNode;
        _this._widgets = {};
        _this.domNode = createFastDomNode(document.createElement('div'));
        PartFingerprints.write(_this.domNode, 1 /* ContentWidgets */);
        _this.domNode.setClassName('contentWidgets');
        _this.domNode.setPosition('absolute');
        _this.domNode.setTop(0);
        _this.overflowingContentWidgetsDomNode = createFastDomNode(document.createElement('div'));
        PartFingerprints.write(_this.overflowingContentWidgetsDomNode, 2 /* OverflowingContentWidgets */);
        _this.overflowingContentWidgetsDomNode.setClassName('overflowingContentWidgets');
        return _this;
    }
    ViewContentWidgets.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this._widgets = null;
        this.domNode = null;
    };
    // --- begin event handlers
    ViewContentWidgets.prototype.onConfigurationChanged = function (e) {
        var keys = Object.keys(this._widgets);
        for (var i = 0, len = keys.length; i < len; i++) {
            var widgetId = keys[i];
            this._widgets[widgetId].onConfigurationChanged(e);
        }
        return true;
    };
    ViewContentWidgets.prototype.onDecorationsChanged = function (e) {
        // true for inline decorations that can end up relayouting text
        return true;
    };
    ViewContentWidgets.prototype.onFlushed = function (e) {
        return true;
    };
    ViewContentWidgets.prototype.onLineMappingChanged = function (e) {
        var keys = Object.keys(this._widgets);
        for (var i = 0, len = keys.length; i < len; i++) {
            var widgetId = keys[i];
            this._widgets[widgetId].onLineMappingChanged(e);
        }
        return true;
    };
    ViewContentWidgets.prototype.onLinesChanged = function (e) {
        return true;
    };
    ViewContentWidgets.prototype.onLinesDeleted = function (e) {
        return true;
    };
    ViewContentWidgets.prototype.onLinesInserted = function (e) {
        return true;
    };
    ViewContentWidgets.prototype.onScrollChanged = function (e) {
        return true;
    };
    ViewContentWidgets.prototype.onZonesChanged = function (e) {
        return true;
    };
    // ---- end view event handlers
    ViewContentWidgets.prototype.addWidget = function (_widget) {
        var myWidget = new Widget(this._context, this._viewDomNode, _widget);
        this._widgets[myWidget.id] = myWidget;
        if (myWidget.allowEditorOverflow) {
            this.overflowingContentWidgetsDomNode.appendChild(myWidget.domNode);
        }
        else {
            this.domNode.appendChild(myWidget.domNode);
        }
        this.setShouldRender();
    };
    ViewContentWidgets.prototype.setWidgetPosition = function (widget, position, preference) {
        var myWidget = this._widgets[widget.getId()];
        myWidget.setPosition(position, preference);
        this.setShouldRender();
    };
    ViewContentWidgets.prototype.removeWidget = function (widget) {
        var widgetId = widget.getId();
        if (this._widgets.hasOwnProperty(widgetId)) {
            var myWidget = this._widgets[widgetId];
            delete this._widgets[widgetId];
            var domNode = myWidget.domNode.domNode;
            domNode.parentNode.removeChild(domNode);
            domNode.removeAttribute('monaco-visible-content-widget');
            this.setShouldRender();
        }
    };
    ViewContentWidgets.prototype.shouldSuppressMouseDownOnWidget = function (widgetId) {
        if (this._widgets.hasOwnProperty(widgetId)) {
            return this._widgets[widgetId].suppressMouseDown;
        }
        return false;
    };
    ViewContentWidgets.prototype.onBeforeRender = function (viewportData) {
        var keys = Object.keys(this._widgets);
        for (var i = 0, len = keys.length; i < len; i++) {
            var widgetId = keys[i];
            this._widgets[widgetId].onBeforeRender(viewportData);
        }
    };
    ViewContentWidgets.prototype.prepareRender = function (ctx) {
        var keys = Object.keys(this._widgets);
        for (var i = 0, len = keys.length; i < len; i++) {
            var widgetId = keys[i];
            this._widgets[widgetId].prepareRender(ctx);
        }
    };
    ViewContentWidgets.prototype.render = function (ctx) {
        var keys = Object.keys(this._widgets);
        for (var i = 0, len = keys.length; i < len; i++) {
            var widgetId = keys[i];
            this._widgets[widgetId].render(ctx);
        }
    };
    return ViewContentWidgets;
}(ViewPart));
export { ViewContentWidgets };
var Widget = /** @class */ (function () {
    function Widget(context, viewDomNode, actual) {
        this._context = context;
        this._viewDomNode = viewDomNode;
        this._actual = actual;
        this.domNode = createFastDomNode(this._actual.getDomNode());
        this.id = this._actual.getId();
        this.allowEditorOverflow = this._actual.allowEditorOverflow || false;
        this.suppressMouseDown = this._actual.suppressMouseDown || false;
        this._fixedOverflowWidgets = this._context.configuration.editor.viewInfo.fixedOverflowWidgets;
        this._contentWidth = this._context.configuration.editor.layoutInfo.contentWidth;
        this._contentLeft = this._context.configuration.editor.layoutInfo.contentLeft;
        this._lineHeight = this._context.configuration.editor.lineHeight;
        this._setPosition(null);
        this._preference = null;
        this._cachedDomNodeClientWidth = -1;
        this._cachedDomNodeClientHeight = -1;
        this._maxWidth = this._getMaxWidth();
        this._isVisible = false;
        this._renderData = null;
        this.domNode.setPosition((this._fixedOverflowWidgets && this.allowEditorOverflow) ? 'fixed' : 'absolute');
        this.domNode.setVisibility('hidden');
        this.domNode.setAttribute('widgetId', this.id);
        this.domNode.setMaxWidth(this._maxWidth);
    }
    Widget.prototype.onConfigurationChanged = function (e) {
        if (e.lineHeight) {
            this._lineHeight = this._context.configuration.editor.lineHeight;
        }
        if (e.layoutInfo) {
            this._contentLeft = this._context.configuration.editor.layoutInfo.contentLeft;
            this._contentWidth = this._context.configuration.editor.layoutInfo.contentWidth;
            this._maxWidth = this._getMaxWidth();
        }
    };
    Widget.prototype.onLineMappingChanged = function (e) {
        this._setPosition(this._position);
    };
    Widget.prototype._setPosition = function (position) {
        this._position = position;
        this._viewPosition = null;
        if (this._position) {
            // Do not trust that widgets give a valid position
            var validModelPosition = this._context.model.validateModelPosition(this._position);
            if (this._context.model.coordinatesConverter.modelPositionIsVisible(validModelPosition)) {
                this._viewPosition = this._context.model.coordinatesConverter.convertModelPositionToViewPosition(validModelPosition);
            }
        }
    };
    Widget.prototype._getMaxWidth = function () {
        return (this.allowEditorOverflow
            ? window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
            : this._contentWidth);
    };
    Widget.prototype.setPosition = function (position, preference) {
        this._setPosition(position);
        this._preference = preference;
        this._cachedDomNodeClientWidth = -1;
        this._cachedDomNodeClientHeight = -1;
    };
    Widget.prototype._layoutBoxInViewport = function (topLeft, width, height, ctx) {
        // Our visible box is split horizontally by the current line => 2 boxes
        // a) the box above the line
        var aboveLineTop = topLeft.top;
        var heightAboveLine = aboveLineTop;
        // b) the box under the line
        var underLineTop = topLeft.top + this._lineHeight;
        var heightUnderLine = ctx.viewportHeight - underLineTop;
        var aboveTop = aboveLineTop - height;
        var fitsAbove = (heightAboveLine >= height);
        var belowTop = underLineTop;
        var fitsBelow = (heightUnderLine >= height);
        // And its left
        var actualLeft = topLeft.left;
        if (actualLeft + width > ctx.scrollLeft + ctx.viewportWidth) {
            actualLeft = ctx.scrollLeft + ctx.viewportWidth - width;
        }
        if (actualLeft < ctx.scrollLeft) {
            actualLeft = ctx.scrollLeft;
        }
        return {
            aboveTop: aboveTop,
            fitsAbove: fitsAbove,
            belowTop: belowTop,
            fitsBelow: fitsBelow,
            left: actualLeft
        };
    };
    Widget.prototype._layoutBoxInPage = function (topLeft, width, height, ctx) {
        var left0 = topLeft.left - ctx.scrollLeft;
        if (left0 < 0 || left0 > this._contentWidth) {
            // Don't render if position is scrolled outside viewport
            return null;
        }
        var aboveTop = topLeft.top - height;
        var belowTop = topLeft.top + this._lineHeight;
        var left = left0 + this._contentLeft;
        var domNodePosition = dom.getDomNodePagePosition(this._viewDomNode.domNode);
        var absoluteAboveTop = domNodePosition.top + aboveTop - dom.StandardWindow.scrollY;
        var absoluteBelowTop = domNodePosition.top + belowTop - dom.StandardWindow.scrollY;
        var absoluteLeft = domNodePosition.left + left - dom.StandardWindow.scrollX;
        var INNER_WIDTH = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        var INNER_HEIGHT = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        // Leave some clearance to the bottom
        var TOP_PADDING = 22;
        var BOTTOM_PADDING = 22;
        var fitsAbove = (absoluteAboveTop >= TOP_PADDING), fitsBelow = (absoluteBelowTop + height <= INNER_HEIGHT - BOTTOM_PADDING);
        if (absoluteLeft + width + 20 > INNER_WIDTH) {
            var delta = absoluteLeft - (INNER_WIDTH - width - 20);
            absoluteLeft -= delta;
            left -= delta;
        }
        if (absoluteLeft < 0) {
            var delta = absoluteLeft;
            absoluteLeft -= delta;
            left -= delta;
        }
        if (this._fixedOverflowWidgets) {
            aboveTop = absoluteAboveTop;
            belowTop = absoluteBelowTop;
            left = absoluteLeft;
        }
        return { aboveTop: aboveTop, fitsAbove: fitsAbove, belowTop: belowTop, fitsBelow: fitsBelow, left: left };
    };
    Widget.prototype._prepareRenderWidgetAtExactPositionOverflowing = function (topLeft) {
        return new Coordinate(topLeft.top, topLeft.left + this._contentLeft);
    };
    /**
     * Compute `this._topLeft`
     */
    Widget.prototype._getTopLeft = function (ctx) {
        if (!this._viewPosition) {
            return null;
        }
        var visibleRange = ctx.visibleRangeForPosition(this._viewPosition);
        if (!visibleRange) {
            return null;
        }
        var top = ctx.getVerticalOffsetForLineNumber(this._viewPosition.lineNumber) - ctx.scrollTop;
        return new Coordinate(top, visibleRange.left);
    };
    Widget.prototype._prepareRenderWidget = function (topLeft, ctx) {
        var _this = this;
        if (!topLeft) {
            return null;
        }
        var placement = null;
        var fetchPlacement = function () {
            if (placement) {
                return;
            }
            if (_this._cachedDomNodeClientWidth === -1 || _this._cachedDomNodeClientHeight === -1) {
                var domNode = _this.domNode.domNode;
                _this._cachedDomNodeClientWidth = domNode.clientWidth;
                _this._cachedDomNodeClientHeight = domNode.clientHeight;
            }
            if (_this.allowEditorOverflow) {
                placement = _this._layoutBoxInPage(topLeft, _this._cachedDomNodeClientWidth, _this._cachedDomNodeClientHeight, ctx);
            }
            else {
                placement = _this._layoutBoxInViewport(topLeft, _this._cachedDomNodeClientWidth, _this._cachedDomNodeClientHeight, ctx);
            }
        };
        // Do two passes, first for perfect fit, second picks first option
        for (var pass = 1; pass <= 2; pass++) {
            for (var i = 0; i < this._preference.length; i++) {
                var pref = this._preference[i];
                if (pref === ContentWidgetPositionPreference.ABOVE) {
                    fetchPlacement();
                    if (!placement) {
                        // Widget outside of viewport
                        return null;
                    }
                    if (pass === 2 || placement.fitsAbove) {
                        return new Coordinate(placement.aboveTop, placement.left);
                    }
                }
                else if (pref === ContentWidgetPositionPreference.BELOW) {
                    fetchPlacement();
                    if (!placement) {
                        // Widget outside of viewport
                        return null;
                    }
                    if (pass === 2 || placement.fitsBelow) {
                        return new Coordinate(placement.belowTop, placement.left);
                    }
                }
                else {
                    if (this.allowEditorOverflow) {
                        return this._prepareRenderWidgetAtExactPositionOverflowing(topLeft);
                    }
                    else {
                        return topLeft;
                    }
                }
            }
        }
        return null;
    };
    /**
     * On this first pass, we ensure that the content widget (if it is in the viewport) has the max width set correctly.
     */
    Widget.prototype.onBeforeRender = function (viewportData) {
        if (!this._viewPosition || !this._preference) {
            return;
        }
        if (this._viewPosition.lineNumber < viewportData.startLineNumber || this._viewPosition.lineNumber > viewportData.endLineNumber) {
            // Outside of viewport
            return;
        }
        this.domNode.setMaxWidth(this._maxWidth);
    };
    Widget.prototype.prepareRender = function (ctx) {
        var topLeft = this._getTopLeft(ctx);
        this._renderData = this._prepareRenderWidget(topLeft, ctx);
    };
    Widget.prototype.render = function (ctx) {
        if (!this._renderData) {
            // This widget should be invisible
            if (this._isVisible) {
                this.domNode.removeAttribute('monaco-visible-content-widget');
                this._isVisible = false;
                this.domNode.setVisibility('hidden');
            }
            return;
        }
        // This widget should be visible
        if (this.allowEditorOverflow) {
            this.domNode.setTop(this._renderData.top);
            this.domNode.setLeft(this._renderData.left);
        }
        else {
            this.domNode.setTop(this._renderData.top + ctx.scrollTop - ctx.bigNumbersDelta);
            this.domNode.setLeft(this._renderData.left);
        }
        if (!this._isVisible) {
            this.domNode.setVisibility('inherit');
            this.domNode.setAttribute('monaco-visible-content-widget', 'true');
            this._isVisible = true;
        }
    };
    return Widget;
}());
