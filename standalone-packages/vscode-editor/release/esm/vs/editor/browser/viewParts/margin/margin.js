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
import { createFastDomNode } from '../../../../base/browser/fastDomNode.js';
import { ViewPart } from '../../view/viewPart.js';
var Margin = /** @class */ (function (_super) {
    __extends(Margin, _super);
    function Margin(context) {
        var _this = _super.call(this, context) || this;
        _this._canUseLayerHinting = _this._context.configuration.editor.canUseLayerHinting;
        _this._contentLeft = _this._context.configuration.editor.layoutInfo.contentLeft;
        _this._glyphMarginLeft = _this._context.configuration.editor.layoutInfo.glyphMarginLeft;
        _this._glyphMarginWidth = _this._context.configuration.editor.layoutInfo.glyphMarginWidth;
        _this._domNode = _this._createDomNode();
        return _this;
    }
    Margin.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
    };
    Margin.prototype.getDomNode = function () {
        return this._domNode;
    };
    Margin.prototype._createDomNode = function () {
        var domNode = createFastDomNode(document.createElement('div'));
        domNode.setClassName(Margin.OUTER_CLASS_NAME);
        domNode.setPosition('absolute');
        domNode.setAttribute('role', 'presentation');
        domNode.setAttribute('aria-hidden', 'true');
        this._glyphMarginBackgroundDomNode = createFastDomNode(document.createElement('div'));
        this._glyphMarginBackgroundDomNode.setClassName(Margin.CLASS_NAME);
        domNode.appendChild(this._glyphMarginBackgroundDomNode);
        return domNode;
    };
    // --- begin event handlers
    Margin.prototype.onConfigurationChanged = function (e) {
        if (e.canUseLayerHinting) {
            this._canUseLayerHinting = this._context.configuration.editor.canUseLayerHinting;
        }
        if (e.layoutInfo) {
            this._contentLeft = this._context.configuration.editor.layoutInfo.contentLeft;
            this._glyphMarginLeft = this._context.configuration.editor.layoutInfo.glyphMarginLeft;
            this._glyphMarginWidth = this._context.configuration.editor.layoutInfo.glyphMarginWidth;
        }
        return true;
    };
    Margin.prototype.onScrollChanged = function (e) {
        return _super.prototype.onScrollChanged.call(this, e) || e.scrollTopChanged;
    };
    // --- end event handlers
    Margin.prototype.prepareRender = function (ctx) {
        // Nothing to read
    };
    Margin.prototype.render = function (ctx) {
        this._domNode.setLayerHinting(this._canUseLayerHinting);
        var adjustedScrollTop = ctx.scrollTop - ctx.bigNumbersDelta;
        this._domNode.setTop(-adjustedScrollTop);
        var height = Math.min(ctx.scrollHeight, 1000000);
        this._domNode.setHeight(height);
        this._domNode.setWidth(this._contentLeft);
        this._glyphMarginBackgroundDomNode.setLeft(this._glyphMarginLeft);
        this._glyphMarginBackgroundDomNode.setWidth(this._glyphMarginWidth);
        this._glyphMarginBackgroundDomNode.setHeight(height);
    };
    Margin.CLASS_NAME = 'glyph-margin';
    Margin.OUTER_CLASS_NAME = 'margin';
    return Margin;
}(ViewPart));
export { Margin };
