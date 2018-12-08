/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as dom from '../../../../base/browser/dom.js';
import { createFastDomNode } from '../../../../base/browser/fastDomNode.js';
import * as strings from '../../../../base/common/strings.js';
import { Configuration } from '../../config/configuration.js';
import { TextEditorCursorStyle } from '../../../common/config/editorOptions.js';
import { Position } from '../../../common/core/position.js';
import { Range } from '../../../common/core/range.js';
var ViewCursorRenderData = /** @class */ (function () {
    function ViewCursorRenderData(top, left, width, height, textContent, textContentClassName) {
        this.top = top;
        this.left = left;
        this.width = width;
        this.height = height;
        this.textContent = textContent;
        this.textContentClassName = textContentClassName;
    }
    return ViewCursorRenderData;
}());
var ViewCursor = /** @class */ (function () {
    function ViewCursor(context) {
        this._context = context;
        this._cursorStyle = this._context.configuration.editor.viewInfo.cursorStyle;
        this._lineHeight = this._context.configuration.editor.lineHeight;
        this._typicalHalfwidthCharacterWidth = this._context.configuration.editor.fontInfo.typicalHalfwidthCharacterWidth;
        this._lineCursorWidth = Math.min(this._context.configuration.editor.viewInfo.cursorWidth, this._typicalHalfwidthCharacterWidth);
        this._isVisible = true;
        // Create the dom node
        this._domNode = createFastDomNode(document.createElement('div'));
        this._domNode.setClassName('cursor');
        this._domNode.setHeight(this._lineHeight);
        this._domNode.setTop(0);
        this._domNode.setLeft(0);
        Configuration.applyFontInfo(this._domNode, this._context.configuration.editor.fontInfo);
        this._domNode.setDisplay('none');
        this.updatePosition(new Position(1, 1));
        this._lastRenderedContent = '';
        this._renderData = null;
    }
    ViewCursor.prototype.getDomNode = function () {
        return this._domNode;
    };
    ViewCursor.prototype.getPosition = function () {
        return this._position;
    };
    ViewCursor.prototype.show = function () {
        if (!this._isVisible) {
            this._domNode.setVisibility('inherit');
            this._isVisible = true;
        }
    };
    ViewCursor.prototype.hide = function () {
        if (this._isVisible) {
            this._domNode.setVisibility('hidden');
            this._isVisible = false;
        }
    };
    ViewCursor.prototype.onConfigurationChanged = function (e) {
        if (e.lineHeight) {
            this._lineHeight = this._context.configuration.editor.lineHeight;
        }
        if (e.fontInfo) {
            Configuration.applyFontInfo(this._domNode, this._context.configuration.editor.fontInfo);
            this._typicalHalfwidthCharacterWidth = this._context.configuration.editor.fontInfo.typicalHalfwidthCharacterWidth;
        }
        if (e.viewInfo) {
            this._cursorStyle = this._context.configuration.editor.viewInfo.cursorStyle;
            this._lineCursorWidth = Math.min(this._context.configuration.editor.viewInfo.cursorWidth, this._typicalHalfwidthCharacterWidth);
        }
        return true;
    };
    ViewCursor.prototype.onCursorPositionChanged = function (position) {
        this.updatePosition(position);
        return true;
    };
    ViewCursor.prototype._prepareRender = function (ctx) {
        var textContent = '';
        var textContentClassName = '';
        if (this._cursorStyle === TextEditorCursorStyle.Line || this._cursorStyle === TextEditorCursorStyle.LineThin) {
            var visibleRange = ctx.visibleRangeForPosition(this._position);
            if (!visibleRange) {
                // Outside viewport
                return null;
            }
            var width_1;
            if (this._cursorStyle === TextEditorCursorStyle.Line) {
                width_1 = dom.computeScreenAwareSize(this._lineCursorWidth > 0 ? this._lineCursorWidth : 2);
                if (width_1 > 2) {
                    var lineContent = this._context.model.getLineContent(this._position.lineNumber);
                    textContent = lineContent.charAt(this._position.column - 1);
                }
            }
            else {
                width_1 = dom.computeScreenAwareSize(1);
            }
            var left = visibleRange.left;
            if (width_1 >= 2 && left >= 1) {
                // try to center cursor
                left -= 1;
            }
            var top_1 = ctx.getVerticalOffsetForLineNumber(this._position.lineNumber) - ctx.bigNumbersDelta;
            return new ViewCursorRenderData(top_1, left, width_1, this._lineHeight, textContent, textContentClassName);
        }
        var visibleRangeForCharacter = ctx.linesVisibleRangesForRange(new Range(this._position.lineNumber, this._position.column, this._position.lineNumber, this._position.column + 1), false);
        if (!visibleRangeForCharacter || visibleRangeForCharacter.length === 0 || visibleRangeForCharacter[0].ranges.length === 0) {
            // Outside viewport
            return null;
        }
        var range = visibleRangeForCharacter[0].ranges[0];
        var width = range.width < 1 ? this._typicalHalfwidthCharacterWidth : range.width;
        if (this._cursorStyle === TextEditorCursorStyle.Block) {
            var lineData = this._context.model.getViewLineData(this._position.lineNumber);
            textContent = lineData.content.charAt(this._position.column - 1);
            if (strings.isHighSurrogate(lineData.content.charCodeAt(this._position.column - 1))) {
                textContent += lineData.content.charAt(this._position.column);
            }
            var tokenIndex = lineData.tokens.findTokenIndexAtOffset(this._position.column - 1);
            textContentClassName = lineData.tokens.getClassName(tokenIndex);
        }
        var top = ctx.getVerticalOffsetForLineNumber(this._position.lineNumber) - ctx.bigNumbersDelta;
        var height = this._lineHeight;
        // Underline might interfere with clicking
        if (this._cursorStyle === TextEditorCursorStyle.Underline || this._cursorStyle === TextEditorCursorStyle.UnderlineThin) {
            top += this._lineHeight - 2;
            height = 2;
        }
        return new ViewCursorRenderData(top, range.left, width, height, textContent, textContentClassName);
    };
    ViewCursor.prototype.prepareRender = function (ctx) {
        this._renderData = this._prepareRender(ctx);
    };
    ViewCursor.prototype.render = function (ctx) {
        if (!this._renderData) {
            this._domNode.setDisplay('none');
            return null;
        }
        if (this._lastRenderedContent !== this._renderData.textContent) {
            this._lastRenderedContent = this._renderData.textContent;
            this._domNode.domNode.textContent = this._lastRenderedContent;
        }
        this._domNode.setClassName('cursor ' + this._renderData.textContentClassName);
        this._domNode.setDisplay('block');
        this._domNode.setTop(this._renderData.top);
        this._domNode.setLeft(this._renderData.left);
        this._domNode.setWidth(this._renderData.width);
        this._domNode.setLineHeight(this._renderData.height);
        this._domNode.setHeight(this._renderData.height);
        return {
            domNode: this._domNode.domNode,
            position: this._position,
            contentLeft: this._renderData.left,
            height: this._renderData.height,
            width: 2
        };
    };
    ViewCursor.prototype.updatePosition = function (newPosition) {
        this._position = newPosition;
    };
    return ViewCursor;
}());
export { ViewCursor };
