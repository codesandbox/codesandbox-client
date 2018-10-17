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
import './viewCursors.css';
import { ViewPart } from '../../view/viewPart.js';
import { ViewCursor } from './viewCursor.js';
import { createFastDomNode } from '../../../../base/browser/fastDomNode.js';
import { TimeoutTimer, IntervalTimer } from '../../../../base/common/async.js';
import { registerThemingParticipant } from '../../../../platform/theme/common/themeService.js';
import { editorCursorForeground, editorCursorBackground } from '../../../common/view/editorColorRegistry.js';
import { TextEditorCursorBlinkingStyle, TextEditorCursorStyle } from '../../../common/config/editorOptions.js';
var ViewCursors = /** @class */ (function (_super) {
    __extends(ViewCursors, _super);
    function ViewCursors(context) {
        var _this = _super.call(this, context) || this;
        _this._readOnly = _this._context.configuration.editor.readOnly;
        _this._cursorBlinking = _this._context.configuration.editor.viewInfo.cursorBlinking;
        _this._cursorStyle = _this._context.configuration.editor.viewInfo.cursorStyle;
        _this._selectionIsEmpty = true;
        _this._primaryCursor = new ViewCursor(_this._context);
        _this._secondaryCursors = [];
        _this._renderData = [];
        _this._domNode = createFastDomNode(document.createElement('div'));
        _this._domNode.setAttribute('role', 'presentation');
        _this._domNode.setAttribute('aria-hidden', 'true');
        _this._updateDomClassName();
        _this._domNode.appendChild(_this._primaryCursor.getDomNode());
        _this._startCursorBlinkAnimation = new TimeoutTimer();
        _this._cursorFlatBlinkInterval = new IntervalTimer();
        _this._blinkingEnabled = false;
        _this._editorHasFocus = false;
        _this._updateBlinking();
        return _this;
    }
    ViewCursors.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this._startCursorBlinkAnimation.dispose();
        this._cursorFlatBlinkInterval.dispose();
    };
    ViewCursors.prototype.getDomNode = function () {
        return this._domNode;
    };
    // --- begin event handlers
    ViewCursors.prototype.onConfigurationChanged = function (e) {
        if (e.readOnly) {
            this._readOnly = this._context.configuration.editor.readOnly;
        }
        if (e.viewInfo) {
            this._cursorBlinking = this._context.configuration.editor.viewInfo.cursorBlinking;
            this._cursorStyle = this._context.configuration.editor.viewInfo.cursorStyle;
        }
        this._primaryCursor.onConfigurationChanged(e);
        this._updateBlinking();
        if (e.viewInfo) {
            this._updateDomClassName();
        }
        for (var i = 0, len = this._secondaryCursors.length; i < len; i++) {
            this._secondaryCursors[i].onConfigurationChanged(e);
        }
        return true;
    };
    ViewCursors.prototype._onCursorPositionChanged = function (position, secondaryPositions) {
        this._primaryCursor.onCursorPositionChanged(position);
        this._updateBlinking();
        if (this._secondaryCursors.length < secondaryPositions.length) {
            // Create new cursors
            var addCnt = secondaryPositions.length - this._secondaryCursors.length;
            for (var i = 0; i < addCnt; i++) {
                var newCursor = new ViewCursor(this._context);
                this._domNode.domNode.insertBefore(newCursor.getDomNode().domNode, this._primaryCursor.getDomNode().domNode.nextSibling);
                this._secondaryCursors.push(newCursor);
            }
        }
        else if (this._secondaryCursors.length > secondaryPositions.length) {
            // Remove some cursors
            var removeCnt = this._secondaryCursors.length - secondaryPositions.length;
            for (var i = 0; i < removeCnt; i++) {
                this._domNode.removeChild(this._secondaryCursors[0].getDomNode());
                this._secondaryCursors.splice(0, 1);
            }
        }
        for (var i = 0; i < secondaryPositions.length; i++) {
            this._secondaryCursors[i].onCursorPositionChanged(secondaryPositions[i]);
        }
    };
    ViewCursors.prototype.onCursorStateChanged = function (e) {
        var positions = [];
        for (var i = 0, len = e.selections.length; i < len; i++) {
            positions[i] = e.selections[i].getPosition();
        }
        this._onCursorPositionChanged(positions[0], positions.slice(1));
        var selectionIsEmpty = e.selections[0].isEmpty();
        if (this._selectionIsEmpty !== selectionIsEmpty) {
            this._selectionIsEmpty = selectionIsEmpty;
            this._updateDomClassName();
        }
        return true;
    };
    ViewCursors.prototype.onDecorationsChanged = function (e) {
        // true for inline decorations that can end up relayouting text
        return true;
    };
    ViewCursors.prototype.onFlushed = function (e) {
        return true;
    };
    ViewCursors.prototype.onFocusChanged = function (e) {
        this._editorHasFocus = e.isFocused;
        this._updateBlinking();
        return false;
    };
    ViewCursors.prototype.onLinesChanged = function (e) {
        return true;
    };
    ViewCursors.prototype.onLinesDeleted = function (e) {
        return true;
    };
    ViewCursors.prototype.onLinesInserted = function (e) {
        return true;
    };
    ViewCursors.prototype.onScrollChanged = function (e) {
        return true;
    };
    ViewCursors.prototype.onTokensChanged = function (e) {
        var shouldRender = function (position) {
            for (var i = 0, len = e.ranges.length; i < len; i++) {
                if (e.ranges[i].fromLineNumber <= position.lineNumber && position.lineNumber <= e.ranges[i].toLineNumber) {
                    return true;
                }
            }
            return false;
        };
        if (shouldRender(this._primaryCursor.getPosition())) {
            return true;
        }
        for (var i = 0; i < this._secondaryCursors.length; i++) {
            if (shouldRender(this._secondaryCursors[i].getPosition())) {
                return true;
            }
        }
        return false;
    };
    ViewCursors.prototype.onZonesChanged = function (e) {
        return true;
    };
    // --- end event handlers
    // ---- blinking logic
    ViewCursors.prototype._getCursorBlinking = function () {
        if (!this._editorHasFocus) {
            return TextEditorCursorBlinkingStyle.Hidden;
        }
        if (this._readOnly) {
            return TextEditorCursorBlinkingStyle.Solid;
        }
        return this._cursorBlinking;
    };
    ViewCursors.prototype._updateBlinking = function () {
        var _this = this;
        this._startCursorBlinkAnimation.cancel();
        this._cursorFlatBlinkInterval.cancel();
        var blinkingStyle = this._getCursorBlinking();
        // hidden and solid are special as they involve no animations
        var isHidden = (blinkingStyle === TextEditorCursorBlinkingStyle.Hidden);
        var isSolid = (blinkingStyle === TextEditorCursorBlinkingStyle.Solid);
        if (isHidden) {
            this._hide();
        }
        else {
            this._show();
        }
        this._blinkingEnabled = false;
        this._updateDomClassName();
        if (!isHidden && !isSolid) {
            if (blinkingStyle === TextEditorCursorBlinkingStyle.Blink) {
                // flat blinking is handled by JavaScript to save battery life due to Chromium step timing issue https://bugs.chromium.org/p/chromium/issues/detail?id=361587
                this._cursorFlatBlinkInterval.cancelAndSet(function () {
                    if (_this._isVisible) {
                        _this._hide();
                    }
                    else {
                        _this._show();
                    }
                }, ViewCursors.BLINK_INTERVAL);
            }
            else {
                this._startCursorBlinkAnimation.setIfNotSet(function () {
                    _this._blinkingEnabled = true;
                    _this._updateDomClassName();
                }, ViewCursors.BLINK_INTERVAL);
            }
        }
    };
    // --- end blinking logic
    ViewCursors.prototype._updateDomClassName = function () {
        this._domNode.setClassName(this._getClassName());
    };
    ViewCursors.prototype._getClassName = function () {
        var result = 'cursors-layer';
        if (!this._selectionIsEmpty) {
            result += ' has-selection';
        }
        switch (this._cursorStyle) {
            case TextEditorCursorStyle.Line:
                result += ' cursor-line-style';
                break;
            case TextEditorCursorStyle.Block:
                result += ' cursor-block-style';
                break;
            case TextEditorCursorStyle.Underline:
                result += ' cursor-underline-style';
                break;
            case TextEditorCursorStyle.LineThin:
                result += ' cursor-line-thin-style';
                break;
            case TextEditorCursorStyle.BlockOutline:
                result += ' cursor-block-outline-style';
                break;
            case TextEditorCursorStyle.UnderlineThin:
                result += ' cursor-underline-thin-style';
                break;
            default:
                result += ' cursor-line-style';
        }
        if (this._blinkingEnabled) {
            switch (this._getCursorBlinking()) {
                case TextEditorCursorBlinkingStyle.Blink:
                    result += ' cursor-blink';
                    break;
                case TextEditorCursorBlinkingStyle.Smooth:
                    result += ' cursor-smooth';
                    break;
                case TextEditorCursorBlinkingStyle.Phase:
                    result += ' cursor-phase';
                    break;
                case TextEditorCursorBlinkingStyle.Expand:
                    result += ' cursor-expand';
                    break;
                case TextEditorCursorBlinkingStyle.Solid:
                    result += ' cursor-solid';
                    break;
                default:
                    result += ' cursor-solid';
            }
        }
        else {
            result += ' cursor-solid';
        }
        return result;
    };
    ViewCursors.prototype._show = function () {
        this._primaryCursor.show();
        for (var i = 0, len = this._secondaryCursors.length; i < len; i++) {
            this._secondaryCursors[i].show();
        }
        this._isVisible = true;
    };
    ViewCursors.prototype._hide = function () {
        this._primaryCursor.hide();
        for (var i = 0, len = this._secondaryCursors.length; i < len; i++) {
            this._secondaryCursors[i].hide();
        }
        this._isVisible = false;
    };
    // ---- IViewPart implementation
    ViewCursors.prototype.prepareRender = function (ctx) {
        this._primaryCursor.prepareRender(ctx);
        for (var i = 0, len = this._secondaryCursors.length; i < len; i++) {
            this._secondaryCursors[i].prepareRender(ctx);
        }
    };
    ViewCursors.prototype.render = function (ctx) {
        var renderData = [], renderDataLen = 0;
        var primaryRenderData = this._primaryCursor.render(ctx);
        if (primaryRenderData) {
            renderData[renderDataLen++] = primaryRenderData;
        }
        for (var i = 0, len = this._secondaryCursors.length; i < len; i++) {
            var secondaryRenderData = this._secondaryCursors[i].render(ctx);
            if (secondaryRenderData) {
                renderData[renderDataLen++] = secondaryRenderData;
            }
        }
        this._renderData = renderData;
    };
    ViewCursors.prototype.getLastRenderData = function () {
        return this._renderData;
    };
    ViewCursors.BLINK_INTERVAL = 500;
    return ViewCursors;
}(ViewPart));
export { ViewCursors };
registerThemingParticipant(function (theme, collector) {
    var caret = theme.getColor(editorCursorForeground);
    if (caret) {
        var caretBackground = theme.getColor(editorCursorBackground);
        if (!caretBackground) {
            caretBackground = caret.opposite();
        }
        collector.addRule(".monaco-editor .cursor { background-color: " + caret + "; border-color: " + caret + "; color: " + caretBackground + "; }");
        if (theme.type === 'hc') {
            collector.addRule(".monaco-editor .cursors-layer.has-selection .cursor { border-left: 1px solid " + caretBackground + "; border-right: 1px solid " + caretBackground + "; }");
        }
    }
});
