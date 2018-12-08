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
import './linesDecorations.css';
import { DecorationToRender, DedupOverlay } from '../glyphMargin/glyphMargin.js';
var LinesDecorationsOverlay = /** @class */ (function (_super) {
    __extends(LinesDecorationsOverlay, _super);
    function LinesDecorationsOverlay(context) {
        var _this = _super.call(this) || this;
        _this._context = context;
        _this._decorationsLeft = _this._context.configuration.editor.layoutInfo.decorationsLeft;
        _this._decorationsWidth = _this._context.configuration.editor.layoutInfo.decorationsWidth;
        _this._renderResult = null;
        _this._context.addEventHandler(_this);
        return _this;
    }
    LinesDecorationsOverlay.prototype.dispose = function () {
        this._context.removeEventHandler(this);
        this._renderResult = null;
        _super.prototype.dispose.call(this);
    };
    // --- begin event handlers
    LinesDecorationsOverlay.prototype.onConfigurationChanged = function (e) {
        if (e.layoutInfo) {
            this._decorationsLeft = this._context.configuration.editor.layoutInfo.decorationsLeft;
            this._decorationsWidth = this._context.configuration.editor.layoutInfo.decorationsWidth;
        }
        return true;
    };
    LinesDecorationsOverlay.prototype.onDecorationsChanged = function (e) {
        return true;
    };
    LinesDecorationsOverlay.prototype.onFlushed = function (e) {
        return true;
    };
    LinesDecorationsOverlay.prototype.onLinesChanged = function (e) {
        return true;
    };
    LinesDecorationsOverlay.prototype.onLinesDeleted = function (e) {
        return true;
    };
    LinesDecorationsOverlay.prototype.onLinesInserted = function (e) {
        return true;
    };
    LinesDecorationsOverlay.prototype.onScrollChanged = function (e) {
        return e.scrollTopChanged;
    };
    LinesDecorationsOverlay.prototype.onZonesChanged = function (e) {
        return true;
    };
    // --- end event handlers
    LinesDecorationsOverlay.prototype._getDecorations = function (ctx) {
        var decorations = ctx.getDecorationsInViewport();
        var r = [], rLen = 0;
        for (var i = 0, len = decorations.length; i < len; i++) {
            var d = decorations[i];
            var linesDecorationsClassName = d.options.linesDecorationsClassName;
            if (linesDecorationsClassName) {
                r[rLen++] = new DecorationToRender(d.range.startLineNumber, d.range.endLineNumber, linesDecorationsClassName);
            }
        }
        return r;
    };
    LinesDecorationsOverlay.prototype.prepareRender = function (ctx) {
        var visibleStartLineNumber = ctx.visibleRange.startLineNumber;
        var visibleEndLineNumber = ctx.visibleRange.endLineNumber;
        var toRender = this._render(visibleStartLineNumber, visibleEndLineNumber, this._getDecorations(ctx));
        var left = this._decorationsLeft.toString();
        var width = this._decorationsWidth.toString();
        var common = '" style="left:' + left + 'px;width:' + width + 'px;"></div>';
        var output = [];
        for (var lineNumber = visibleStartLineNumber; lineNumber <= visibleEndLineNumber; lineNumber++) {
            var lineIndex = lineNumber - visibleStartLineNumber;
            var classNames = toRender[lineIndex];
            var lineOutput = '';
            for (var i = 0, len = classNames.length; i < len; i++) {
                lineOutput += '<div class="cldr ' + classNames[i] + common;
            }
            output[lineIndex] = lineOutput;
        }
        this._renderResult = output;
    };
    LinesDecorationsOverlay.prototype.render = function (startLineNumber, lineNumber) {
        if (!this._renderResult) {
            return '';
        }
        return this._renderResult[lineNumber - startLineNumber];
    };
    return LinesDecorationsOverlay;
}(DedupOverlay));
export { LinesDecorationsOverlay };
