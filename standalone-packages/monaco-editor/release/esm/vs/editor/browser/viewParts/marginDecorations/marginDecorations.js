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
import './marginDecorations.css';
import { DecorationToRender, DedupOverlay } from '../glyphMargin/glyphMargin.js';
var MarginViewLineDecorationsOverlay = /** @class */ (function (_super) {
    __extends(MarginViewLineDecorationsOverlay, _super);
    function MarginViewLineDecorationsOverlay(context) {
        var _this = _super.call(this) || this;
        _this._context = context;
        _this._renderResult = null;
        _this._context.addEventHandler(_this);
        return _this;
    }
    MarginViewLineDecorationsOverlay.prototype.dispose = function () {
        this._context.removeEventHandler(this);
        this._context = null;
        this._renderResult = null;
        _super.prototype.dispose.call(this);
    };
    // --- begin event handlers
    MarginViewLineDecorationsOverlay.prototype.onConfigurationChanged = function (e) {
        return true;
    };
    MarginViewLineDecorationsOverlay.prototype.onDecorationsChanged = function (e) {
        return true;
    };
    MarginViewLineDecorationsOverlay.prototype.onFlushed = function (e) {
        return true;
    };
    MarginViewLineDecorationsOverlay.prototype.onLinesChanged = function (e) {
        return true;
    };
    MarginViewLineDecorationsOverlay.prototype.onLinesDeleted = function (e) {
        return true;
    };
    MarginViewLineDecorationsOverlay.prototype.onLinesInserted = function (e) {
        return true;
    };
    MarginViewLineDecorationsOverlay.prototype.onScrollChanged = function (e) {
        return e.scrollTopChanged;
    };
    MarginViewLineDecorationsOverlay.prototype.onZonesChanged = function (e) {
        return true;
    };
    // --- end event handlers
    MarginViewLineDecorationsOverlay.prototype._getDecorations = function (ctx) {
        var decorations = ctx.getDecorationsInViewport();
        var r = [], rLen = 0;
        for (var i = 0, len = decorations.length; i < len; i++) {
            var d = decorations[i];
            var marginClassName = d.options.marginClassName;
            if (marginClassName) {
                r[rLen++] = new DecorationToRender(d.range.startLineNumber, d.range.endLineNumber, marginClassName);
            }
        }
        return r;
    };
    MarginViewLineDecorationsOverlay.prototype.prepareRender = function (ctx) {
        var visibleStartLineNumber = ctx.visibleRange.startLineNumber;
        var visibleEndLineNumber = ctx.visibleRange.endLineNumber;
        var toRender = this._render(visibleStartLineNumber, visibleEndLineNumber, this._getDecorations(ctx));
        var output = [];
        for (var lineNumber = visibleStartLineNumber; lineNumber <= visibleEndLineNumber; lineNumber++) {
            var lineIndex = lineNumber - visibleStartLineNumber;
            var classNames = toRender[lineIndex];
            var lineOutput = '';
            for (var i = 0, len = classNames.length; i < len; i++) {
                lineOutput += '<div class="cmdr ' + classNames[i] + '" style=""></div>';
            }
            output[lineIndex] = lineOutput;
        }
        this._renderResult = output;
    };
    MarginViewLineDecorationsOverlay.prototype.render = function (startLineNumber, lineNumber) {
        if (!this._renderResult) {
            return '';
        }
        return this._renderResult[lineNumber - startLineNumber];
    };
    return MarginViewLineDecorationsOverlay;
}(DedupOverlay));
export { MarginViewLineDecorationsOverlay };
