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
import './glyphMargin.css';
import { DynamicViewOverlay } from '../../view/dynamicViewOverlay.js';
var DecorationToRender = /** @class */ (function () {
    function DecorationToRender(startLineNumber, endLineNumber, className) {
        this.startLineNumber = +startLineNumber;
        this.endLineNumber = +endLineNumber;
        this.className = String(className);
    }
    return DecorationToRender;
}());
export { DecorationToRender };
var DedupOverlay = /** @class */ (function (_super) {
    __extends(DedupOverlay, _super);
    function DedupOverlay() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DedupOverlay.prototype._render = function (visibleStartLineNumber, visibleEndLineNumber, decorations) {
        var output = [];
        for (var lineNumber = visibleStartLineNumber; lineNumber <= visibleEndLineNumber; lineNumber++) {
            var lineIndex = lineNumber - visibleStartLineNumber;
            output[lineIndex] = [];
        }
        if (decorations.length === 0) {
            return output;
        }
        decorations.sort(function (a, b) {
            if (a.className === b.className) {
                if (a.startLineNumber === b.startLineNumber) {
                    return a.endLineNumber - b.endLineNumber;
                }
                return a.startLineNumber - b.startLineNumber;
            }
            return (a.className < b.className ? -1 : 1);
        });
        var prevClassName = null;
        var prevEndLineIndex = 0;
        for (var i = 0, len = decorations.length; i < len; i++) {
            var d = decorations[i];
            var className = d.className;
            var startLineIndex = Math.max(d.startLineNumber, visibleStartLineNumber) - visibleStartLineNumber;
            var endLineIndex = Math.min(d.endLineNumber, visibleEndLineNumber) - visibleStartLineNumber;
            if (prevClassName === className) {
                startLineIndex = Math.max(prevEndLineIndex + 1, startLineIndex);
                prevEndLineIndex = Math.max(prevEndLineIndex, endLineIndex);
            }
            else {
                prevClassName = className;
                prevEndLineIndex = endLineIndex;
            }
            for (var i_1 = startLineIndex; i_1 <= prevEndLineIndex; i_1++) {
                output[i_1].push(prevClassName);
            }
        }
        return output;
    };
    return DedupOverlay;
}(DynamicViewOverlay));
export { DedupOverlay };
var GlyphMarginOverlay = /** @class */ (function (_super) {
    __extends(GlyphMarginOverlay, _super);
    function GlyphMarginOverlay(context) {
        var _this = _super.call(this) || this;
        _this._context = context;
        _this._lineHeight = _this._context.configuration.editor.lineHeight;
        _this._glyphMargin = _this._context.configuration.editor.viewInfo.glyphMargin;
        _this._glyphMarginLeft = _this._context.configuration.editor.layoutInfo.glyphMarginLeft;
        _this._glyphMarginWidth = _this._context.configuration.editor.layoutInfo.glyphMarginWidth;
        _this._renderResult = null;
        _this._context.addEventHandler(_this);
        return _this;
    }
    GlyphMarginOverlay.prototype.dispose = function () {
        this._context.removeEventHandler(this);
        this._renderResult = null;
        _super.prototype.dispose.call(this);
    };
    // --- begin event handlers
    GlyphMarginOverlay.prototype.onConfigurationChanged = function (e) {
        if (e.lineHeight) {
            this._lineHeight = this._context.configuration.editor.lineHeight;
        }
        if (e.viewInfo) {
            this._glyphMargin = this._context.configuration.editor.viewInfo.glyphMargin;
        }
        if (e.layoutInfo) {
            this._glyphMarginLeft = this._context.configuration.editor.layoutInfo.glyphMarginLeft;
            this._glyphMarginWidth = this._context.configuration.editor.layoutInfo.glyphMarginWidth;
        }
        return true;
    };
    GlyphMarginOverlay.prototype.onDecorationsChanged = function (e) {
        return true;
    };
    GlyphMarginOverlay.prototype.onFlushed = function (e) {
        return true;
    };
    GlyphMarginOverlay.prototype.onLinesChanged = function (e) {
        return true;
    };
    GlyphMarginOverlay.prototype.onLinesDeleted = function (e) {
        return true;
    };
    GlyphMarginOverlay.prototype.onLinesInserted = function (e) {
        return true;
    };
    GlyphMarginOverlay.prototype.onScrollChanged = function (e) {
        return e.scrollTopChanged;
    };
    GlyphMarginOverlay.prototype.onZonesChanged = function (e) {
        return true;
    };
    // --- end event handlers
    GlyphMarginOverlay.prototype._getDecorations = function (ctx) {
        var decorations = ctx.getDecorationsInViewport();
        var r = [], rLen = 0;
        for (var i = 0, len = decorations.length; i < len; i++) {
            var d = decorations[i];
            var glyphMarginClassName = d.options.glyphMarginClassName;
            if (glyphMarginClassName) {
                r[rLen++] = new DecorationToRender(d.range.startLineNumber, d.range.endLineNumber, glyphMarginClassName);
            }
        }
        return r;
    };
    GlyphMarginOverlay.prototype.prepareRender = function (ctx) {
        if (!this._glyphMargin) {
            this._renderResult = null;
            return;
        }
        var visibleStartLineNumber = ctx.visibleRange.startLineNumber;
        var visibleEndLineNumber = ctx.visibleRange.endLineNumber;
        var toRender = this._render(visibleStartLineNumber, visibleEndLineNumber, this._getDecorations(ctx));
        var lineHeight = this._lineHeight.toString();
        var left = this._glyphMarginLeft.toString();
        var width = this._glyphMarginWidth.toString();
        var common = '" style="left:' + left + 'px;width:' + width + 'px' + ';height:' + lineHeight + 'px;"></div>';
        var output = [];
        for (var lineNumber = visibleStartLineNumber; lineNumber <= visibleEndLineNumber; lineNumber++) {
            var lineIndex = lineNumber - visibleStartLineNumber;
            var classNames = toRender[lineIndex];
            if (classNames.length === 0) {
                output[lineIndex] = '';
            }
            else {
                output[lineIndex] = ('<div class="cgmr '
                    + classNames.join(' ')
                    + common);
            }
        }
        this._renderResult = output;
    };
    GlyphMarginOverlay.prototype.render = function (startLineNumber, lineNumber) {
        if (!this._renderResult) {
            return '';
        }
        var lineIndex = lineNumber - startLineNumber;
        if (lineIndex < 0 || lineIndex >= this._renderResult.length) {
            return '';
        }
        return this._renderResult[lineIndex];
    };
    return GlyphMarginOverlay;
}(DedupOverlay));
export { GlyphMarginOverlay };
