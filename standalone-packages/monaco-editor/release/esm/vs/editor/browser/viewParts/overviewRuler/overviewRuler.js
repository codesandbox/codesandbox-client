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
import { ViewEventHandler } from '../../../common/viewModel/viewEventHandler.js';
import { OverviewZoneManager } from '../../../common/view/overviewZoneManager.js';
import { createFastDomNode } from '../../../../base/browser/fastDomNode.js';
var OverviewRuler = /** @class */ (function (_super) {
    __extends(OverviewRuler, _super);
    function OverviewRuler(context, cssClassName) {
        var _this = _super.call(this) || this;
        _this._context = context;
        _this._domNode = createFastDomNode(document.createElement('canvas'));
        _this._domNode.setClassName(cssClassName);
        _this._domNode.setPosition('absolute');
        _this._domNode.setLayerHinting(true);
        _this._zoneManager = new OverviewZoneManager(function (lineNumber) { return _this._context.viewLayout.getVerticalOffsetForLineNumber(lineNumber); });
        _this._zoneManager.setDOMWidth(0);
        _this._zoneManager.setDOMHeight(0);
        _this._zoneManager.setOuterHeight(_this._context.viewLayout.getScrollHeight());
        _this._zoneManager.setLineHeight(_this._context.configuration.editor.lineHeight);
        _this._zoneManager.setPixelRatio(_this._context.configuration.editor.pixelRatio);
        _this._context.addEventHandler(_this);
        return _this;
    }
    OverviewRuler.prototype.dispose = function () {
        this._context.removeEventHandler(this);
        this._zoneManager = null;
        _super.prototype.dispose.call(this);
    };
    // ---- begin view event handlers
    OverviewRuler.prototype.onConfigurationChanged = function (e) {
        if (e.lineHeight) {
            this._zoneManager.setLineHeight(this._context.configuration.editor.lineHeight);
            this._render();
        }
        if (e.pixelRatio) {
            this._zoneManager.setPixelRatio(this._context.configuration.editor.pixelRatio);
            this._domNode.setWidth(this._zoneManager.getDOMWidth());
            this._domNode.setHeight(this._zoneManager.getDOMHeight());
            this._domNode.domNode.width = this._zoneManager.getCanvasWidth();
            this._domNode.domNode.height = this._zoneManager.getCanvasHeight();
            this._render();
        }
        return true;
    };
    OverviewRuler.prototype.onFlushed = function (e) {
        this._render();
        return true;
    };
    OverviewRuler.prototype.onScrollChanged = function (e) {
        if (e.scrollHeightChanged) {
            this._zoneManager.setOuterHeight(e.scrollHeight);
            this._render();
        }
        return true;
    };
    OverviewRuler.prototype.onZonesChanged = function (e) {
        this._render();
        return true;
    };
    // ---- end view event handlers
    OverviewRuler.prototype.getDomNode = function () {
        return this._domNode.domNode;
    };
    OverviewRuler.prototype.setLayout = function (position) {
        this._domNode.setTop(position.top);
        this._domNode.setRight(position.right);
        var hasChanged = false;
        hasChanged = this._zoneManager.setDOMWidth(position.width) || hasChanged;
        hasChanged = this._zoneManager.setDOMHeight(position.height) || hasChanged;
        if (hasChanged) {
            this._domNode.setWidth(this._zoneManager.getDOMWidth());
            this._domNode.setHeight(this._zoneManager.getDOMHeight());
            this._domNode.domNode.width = this._zoneManager.getCanvasWidth();
            this._domNode.domNode.height = this._zoneManager.getCanvasHeight();
            this._render();
        }
    };
    OverviewRuler.prototype.setZones = function (zones) {
        this._zoneManager.setZones(zones);
        this._render();
    };
    OverviewRuler.prototype._render = function () {
        if (this._zoneManager.getOuterHeight() === 0) {
            return false;
        }
        var width = this._zoneManager.getCanvasWidth();
        var height = this._zoneManager.getCanvasHeight();
        var colorZones = this._zoneManager.resolveColorZones();
        var id2Color = this._zoneManager.getId2Color();
        var ctx = this._domNode.domNode.getContext('2d');
        ctx.clearRect(0, 0, width, height);
        if (colorZones.length > 0) {
            this._renderOneLane(ctx, colorZones, id2Color, width);
        }
        return true;
    };
    OverviewRuler.prototype._renderOneLane = function (ctx, colorZones, id2Color, width) {
        var currentColorId = 0;
        var currentFrom = 0;
        var currentTo = 0;
        for (var i = 0, len = colorZones.length; i < len; i++) {
            var zone = colorZones[i];
            var zoneColorId = zone.colorId;
            var zoneFrom = zone.from;
            var zoneTo = zone.to;
            if (zoneColorId !== currentColorId) {
                ctx.fillRect(0, currentFrom, width, currentTo - currentFrom);
                currentColorId = zoneColorId;
                ctx.fillStyle = id2Color[currentColorId];
                currentFrom = zoneFrom;
                currentTo = zoneTo;
            }
            else {
                if (currentTo >= zoneFrom) {
                    currentTo = Math.max(currentTo, zoneTo);
                }
                else {
                    ctx.fillRect(0, currentFrom, width, currentTo - currentFrom);
                    currentFrom = zoneFrom;
                    currentTo = zoneTo;
                }
            }
        }
        ctx.fillRect(0, currentFrom, width, currentTo - currentFrom);
    };
    return OverviewRuler;
}(ViewEventHandler));
export { OverviewRuler };
