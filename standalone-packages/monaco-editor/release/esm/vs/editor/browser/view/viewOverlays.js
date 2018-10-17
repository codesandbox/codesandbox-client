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
import { createFastDomNode } from '../../../base/browser/fastDomNode.js';
import { VisibleLinesCollection } from './viewLayer.js';
import { Configuration } from '../config/configuration.js';
import { ViewPart } from './viewPart.js';
var ViewOverlays = /** @class */ (function (_super) {
    __extends(ViewOverlays, _super);
    function ViewOverlays(context) {
        var _this = _super.call(this, context) || this;
        _this._visibleLines = new VisibleLinesCollection(_this);
        _this.domNode = _this._visibleLines.domNode;
        _this._dynamicOverlays = [];
        _this._isFocused = false;
        _this.domNode.setClassName('view-overlays');
        return _this;
    }
    ViewOverlays.prototype.shouldRender = function () {
        if (_super.prototype.shouldRender.call(this)) {
            return true;
        }
        for (var i = 0, len = this._dynamicOverlays.length; i < len; i++) {
            var dynamicOverlay = this._dynamicOverlays[i];
            if (dynamicOverlay.shouldRender()) {
                return true;
            }
        }
        return false;
    };
    ViewOverlays.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        for (var i = 0, len = this._dynamicOverlays.length; i < len; i++) {
            var dynamicOverlay = this._dynamicOverlays[i];
            dynamicOverlay.dispose();
        }
        this._dynamicOverlays = null;
    };
    ViewOverlays.prototype.getDomNode = function () {
        return this.domNode;
    };
    // ---- begin IVisibleLinesHost
    ViewOverlays.prototype.createVisibleLine = function () {
        return new ViewOverlayLine(this._context.configuration, this._dynamicOverlays);
    };
    // ---- end IVisibleLinesHost
    ViewOverlays.prototype.addDynamicOverlay = function (overlay) {
        this._dynamicOverlays.push(overlay);
    };
    // ----- event handlers
    ViewOverlays.prototype.onConfigurationChanged = function (e) {
        this._visibleLines.onConfigurationChanged(e);
        var startLineNumber = this._visibleLines.getStartLineNumber();
        var endLineNumber = this._visibleLines.getEndLineNumber();
        for (var lineNumber = startLineNumber; lineNumber <= endLineNumber; lineNumber++) {
            var line = this._visibleLines.getVisibleLine(lineNumber);
            line.onConfigurationChanged(e);
        }
        return true;
    };
    ViewOverlays.prototype.onFlushed = function (e) {
        return this._visibleLines.onFlushed(e);
    };
    ViewOverlays.prototype.onFocusChanged = function (e) {
        this._isFocused = e.isFocused;
        return true;
    };
    ViewOverlays.prototype.onLinesChanged = function (e) {
        return this._visibleLines.onLinesChanged(e);
    };
    ViewOverlays.prototype.onLinesDeleted = function (e) {
        return this._visibleLines.onLinesDeleted(e);
    };
    ViewOverlays.prototype.onLinesInserted = function (e) {
        return this._visibleLines.onLinesInserted(e);
    };
    ViewOverlays.prototype.onScrollChanged = function (e) {
        return this._visibleLines.onScrollChanged(e) || true;
    };
    ViewOverlays.prototype.onTokensChanged = function (e) {
        return this._visibleLines.onTokensChanged(e);
    };
    ViewOverlays.prototype.onZonesChanged = function (e) {
        return this._visibleLines.onZonesChanged(e);
    };
    // ----- end event handlers
    ViewOverlays.prototype.prepareRender = function (ctx) {
        var toRender = this._dynamicOverlays.filter(function (overlay) { return overlay.shouldRender(); });
        for (var i = 0, len = toRender.length; i < len; i++) {
            var dynamicOverlay = toRender[i];
            dynamicOverlay.prepareRender(ctx);
            dynamicOverlay.onDidRender();
        }
        return null;
    };
    ViewOverlays.prototype.render = function (ctx) {
        // Overwriting to bypass `shouldRender` flag
        this._viewOverlaysRender(ctx);
        this.domNode.toggleClassName('focused', this._isFocused);
    };
    ViewOverlays.prototype._viewOverlaysRender = function (ctx) {
        this._visibleLines.renderLines(ctx.viewportData);
    };
    return ViewOverlays;
}(ViewPart));
export { ViewOverlays };
var ViewOverlayLine = /** @class */ (function () {
    function ViewOverlayLine(configuration, dynamicOverlays) {
        this._configuration = configuration;
        this._lineHeight = this._configuration.editor.lineHeight;
        this._dynamicOverlays = dynamicOverlays;
        this._domNode = null;
        this._renderedContent = null;
    }
    ViewOverlayLine.prototype.getDomNode = function () {
        if (!this._domNode) {
            return null;
        }
        return this._domNode.domNode;
    };
    ViewOverlayLine.prototype.setDomNode = function (domNode) {
        this._domNode = createFastDomNode(domNode);
    };
    ViewOverlayLine.prototype.onContentChanged = function () {
        // Nothing
    };
    ViewOverlayLine.prototype.onTokensChanged = function () {
        // Nothing
    };
    ViewOverlayLine.prototype.onConfigurationChanged = function (e) {
        if (e.lineHeight) {
            this._lineHeight = this._configuration.editor.lineHeight;
        }
    };
    ViewOverlayLine.prototype.renderLine = function (lineNumber, deltaTop, viewportData, sb) {
        var result = '';
        for (var i = 0, len = this._dynamicOverlays.length; i < len; i++) {
            var dynamicOverlay = this._dynamicOverlays[i];
            result += dynamicOverlay.render(viewportData.startLineNumber, lineNumber);
        }
        if (this._renderedContent === result) {
            // No rendering needed
            return false;
        }
        this._renderedContent = result;
        sb.appendASCIIString('<div style="position:absolute;top:');
        sb.appendASCIIString(String(deltaTop));
        sb.appendASCIIString('px;width:100%;height:');
        sb.appendASCIIString(String(this._lineHeight));
        sb.appendASCIIString('px;">');
        sb.appendASCIIString(result);
        sb.appendASCIIString('</div>');
        return true;
    };
    ViewOverlayLine.prototype.layoutLine = function (lineNumber, deltaTop) {
        if (this._domNode) {
            this._domNode.setTop(deltaTop);
            this._domNode.setHeight(this._lineHeight);
        }
    };
    return ViewOverlayLine;
}());
export { ViewOverlayLine };
var ContentViewOverlays = /** @class */ (function (_super) {
    __extends(ContentViewOverlays, _super);
    function ContentViewOverlays(context) {
        var _this = _super.call(this, context) || this;
        _this._contentWidth = _this._context.configuration.editor.layoutInfo.contentWidth;
        _this.domNode.setHeight(0);
        return _this;
    }
    // --- begin event handlers
    ContentViewOverlays.prototype.onConfigurationChanged = function (e) {
        if (e.layoutInfo) {
            this._contentWidth = this._context.configuration.editor.layoutInfo.contentWidth;
        }
        return _super.prototype.onConfigurationChanged.call(this, e);
    };
    ContentViewOverlays.prototype.onScrollChanged = function (e) {
        return _super.prototype.onScrollChanged.call(this, e) || e.scrollWidthChanged;
    };
    // --- end event handlers
    ContentViewOverlays.prototype._viewOverlaysRender = function (ctx) {
        _super.prototype._viewOverlaysRender.call(this, ctx);
        this.domNode.setWidth(Math.max(ctx.scrollWidth, this._contentWidth));
    };
    return ContentViewOverlays;
}(ViewOverlays));
export { ContentViewOverlays };
var MarginViewOverlays = /** @class */ (function (_super) {
    __extends(MarginViewOverlays, _super);
    function MarginViewOverlays(context) {
        var _this = _super.call(this, context) || this;
        _this._contentLeft = _this._context.configuration.editor.layoutInfo.contentLeft;
        _this.domNode.setClassName('margin-view-overlays');
        _this.domNode.setWidth(1);
        Configuration.applyFontInfo(_this.domNode, _this._context.configuration.editor.fontInfo);
        return _this;
    }
    MarginViewOverlays.prototype.onConfigurationChanged = function (e) {
        var shouldRender = false;
        if (e.fontInfo) {
            Configuration.applyFontInfo(this.domNode, this._context.configuration.editor.fontInfo);
            shouldRender = true;
        }
        if (e.layoutInfo) {
            this._contentLeft = this._context.configuration.editor.layoutInfo.contentLeft;
            shouldRender = true;
        }
        return _super.prototype.onConfigurationChanged.call(this, e) || shouldRender;
    };
    MarginViewOverlays.prototype.onScrollChanged = function (e) {
        return _super.prototype.onScrollChanged.call(this, e) || e.scrollHeightChanged;
    };
    MarginViewOverlays.prototype._viewOverlaysRender = function (ctx) {
        _super.prototype._viewOverlaysRender.call(this, ctx);
        var height = Math.min(ctx.scrollHeight, 1000000);
        this.domNode.setHeight(height);
        this.domNode.setWidth(this._contentLeft);
    };
    return MarginViewOverlays;
}(ViewOverlays));
export { MarginViewOverlays };
