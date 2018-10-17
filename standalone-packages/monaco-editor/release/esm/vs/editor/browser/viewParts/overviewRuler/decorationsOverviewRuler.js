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
import { ViewPart } from '../../view/viewPart.js';
import { Position } from '../../../common/core/position.js';
import { TokenizationRegistry } from '../../../common/modes.js';
import { editorOverviewRulerBorder, editorCursorForeground } from '../../../common/view/editorColorRegistry.js';
import { Color } from '../../../../base/common/color.js';
import { createFastDomNode } from '../../../../base/browser/fastDomNode.js';
var Settings = /** @class */ (function () {
    function Settings(config, theme) {
        this.lineHeight = config.editor.lineHeight;
        this.pixelRatio = config.editor.pixelRatio;
        this.overviewRulerLanes = config.editor.viewInfo.overviewRulerLanes;
        this.renderBorder = config.editor.viewInfo.overviewRulerBorder;
        var borderColor = theme.getColor(editorOverviewRulerBorder);
        this.borderColor = borderColor ? borderColor.toString() : null;
        this.hideCursor = config.editor.viewInfo.hideCursorInOverviewRuler;
        var cursorColor = theme.getColor(editorCursorForeground);
        this.cursorColor = cursorColor ? cursorColor.transparent(0.7).toString() : null;
        this.themeType = theme.type;
        var minimapEnabled = config.editor.viewInfo.minimap.enabled;
        var minimapSide = config.editor.viewInfo.minimap.side;
        var backgroundColor = (minimapEnabled ? TokenizationRegistry.getDefaultBackground() : null);
        if (backgroundColor === null || minimapSide === 'left') {
            this.backgroundColor = null;
        }
        else {
            this.backgroundColor = Color.Format.CSS.formatHex(backgroundColor);
        }
        var position = config.editor.layoutInfo.overviewRuler;
        this.top = position.top;
        this.right = position.right;
        this.domWidth = position.width;
        this.domHeight = position.height;
        this.canvasWidth = (this.domWidth * this.pixelRatio) | 0;
        this.canvasHeight = (this.domHeight * this.pixelRatio) | 0;
        var _a = this._initLanes(1, this.canvasWidth, this.overviewRulerLanes), x = _a[0], w = _a[1];
        this.x = x;
        this.w = w;
    }
    Settings.prototype._initLanes = function (canvasLeftOffset, canvasWidth, laneCount) {
        var remainingWidth = canvasWidth - canvasLeftOffset;
        if (laneCount >= 3) {
            var leftWidth = Math.floor(remainingWidth / 3);
            var rightWidth = Math.floor(remainingWidth / 3);
            var centerWidth = remainingWidth - leftWidth - rightWidth;
            var leftOffset = canvasLeftOffset;
            var centerOffset = leftOffset + leftWidth;
            var rightOffset = leftOffset + leftWidth + centerWidth;
            return [
                [
                    0,
                    leftOffset,
                    centerOffset,
                    leftOffset,
                    rightOffset,
                    leftOffset,
                    centerOffset,
                    leftOffset,
                ], [
                    0,
                    leftWidth,
                    centerWidth,
                    leftWidth + centerWidth,
                    rightWidth,
                    leftWidth + centerWidth + rightWidth,
                    centerWidth + rightWidth,
                    leftWidth + centerWidth + rightWidth,
                ]
            ];
        }
        else if (laneCount === 2) {
            var leftWidth = Math.floor(remainingWidth / 2);
            var rightWidth = remainingWidth - leftWidth;
            var leftOffset = canvasLeftOffset;
            var rightOffset = leftOffset + leftWidth;
            return [
                [
                    0,
                    leftOffset,
                    leftOffset,
                    leftOffset,
                    rightOffset,
                    leftOffset,
                    leftOffset,
                    leftOffset,
                ], [
                    0,
                    leftWidth,
                    leftWidth,
                    leftWidth,
                    rightWidth,
                    leftWidth + rightWidth,
                    leftWidth + rightWidth,
                    leftWidth + rightWidth,
                ]
            ];
        }
        else {
            var offset = canvasLeftOffset;
            var width = remainingWidth;
            return [
                [
                    0,
                    offset,
                    offset,
                    offset,
                    offset,
                    offset,
                    offset,
                    offset,
                ], [
                    0,
                    width,
                    width,
                    width,
                    width,
                    width,
                    width,
                    width,
                ]
            ];
        }
    };
    Settings.prototype.equals = function (other) {
        return (this.lineHeight === other.lineHeight
            && this.pixelRatio === other.pixelRatio
            && this.overviewRulerLanes === other.overviewRulerLanes
            && this.renderBorder === other.renderBorder
            && this.borderColor === other.borderColor
            && this.hideCursor === other.hideCursor
            && this.cursorColor === other.cursorColor
            && this.themeType === other.themeType
            && this.backgroundColor === other.backgroundColor
            && this.top === other.top
            && this.right === other.right
            && this.domWidth === other.domWidth
            && this.domHeight === other.domHeight
            && this.canvasWidth === other.canvasWidth
            && this.canvasHeight === other.canvasHeight);
    };
    return Settings;
}());
var DecorationsOverviewRuler = /** @class */ (function (_super) {
    __extends(DecorationsOverviewRuler, _super);
    function DecorationsOverviewRuler(context) {
        var _this = _super.call(this, context) || this;
        _this._domNode = createFastDomNode(document.createElement('canvas'));
        _this._domNode.setClassName('decorationsOverviewRuler');
        _this._domNode.setPosition('absolute');
        _this._domNode.setLayerHinting(true);
        _this._domNode.setAttribute('aria-hidden', 'true');
        _this._settings = null;
        _this._updateSettings(false);
        _this._tokensColorTrackerListener = TokenizationRegistry.onDidChange(function (e) {
            if (e.changedColorMap) {
                _this._updateSettings(true);
            }
        });
        _this._cursorPositions = [];
        return _this;
    }
    DecorationsOverviewRuler.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this._tokensColorTrackerListener.dispose();
    };
    DecorationsOverviewRuler.prototype._updateSettings = function (renderNow) {
        var newSettings = new Settings(this._context.configuration, this._context.theme);
        if (this._settings !== null && this._settings.equals(newSettings)) {
            // nothing to do
            return false;
        }
        this._settings = newSettings;
        this._domNode.setTop(this._settings.top);
        this._domNode.setRight(this._settings.right);
        this._domNode.setWidth(this._settings.domWidth);
        this._domNode.setHeight(this._settings.domHeight);
        this._domNode.domNode.width = this._settings.canvasWidth;
        this._domNode.domNode.height = this._settings.canvasHeight;
        if (renderNow) {
            this._render();
        }
        return true;
    };
    // ---- begin view event handlers
    DecorationsOverviewRuler.prototype.onConfigurationChanged = function (e) {
        return this._updateSettings(false);
    };
    DecorationsOverviewRuler.prototype.onCursorStateChanged = function (e) {
        this._cursorPositions = [];
        for (var i = 0, len = e.selections.length; i < len; i++) {
            this._cursorPositions[i] = e.selections[i].getPosition();
        }
        this._cursorPositions.sort(Position.compare);
        return true;
    };
    DecorationsOverviewRuler.prototype.onDecorationsChanged = function (e) {
        return true;
    };
    DecorationsOverviewRuler.prototype.onFlushed = function (e) {
        return true;
    };
    DecorationsOverviewRuler.prototype.onScrollChanged = function (e) {
        return e.scrollHeightChanged;
    };
    DecorationsOverviewRuler.prototype.onZonesChanged = function (e) {
        return true;
    };
    DecorationsOverviewRuler.prototype.onThemeChanged = function (e) {
        // invalidate color cache
        this._context.model.invalidateOverviewRulerColorCache();
        return this._updateSettings(false);
    };
    // ---- end view event handlers
    DecorationsOverviewRuler.prototype.getDomNode = function () {
        return this._domNode.domNode;
    };
    DecorationsOverviewRuler.prototype.prepareRender = function (ctx) {
        // Nothing to read
    };
    DecorationsOverviewRuler.prototype.render = function (editorCtx) {
        this._render();
    };
    DecorationsOverviewRuler.prototype._render = function () {
        var canvasWidth = this._settings.canvasWidth;
        var canvasHeight = this._settings.canvasHeight;
        var lineHeight = this._settings.lineHeight;
        var viewLayout = this._context.viewLayout;
        var outerHeight = this._context.viewLayout.getScrollHeight();
        var heightRatio = canvasHeight / outerHeight;
        var decorations = this._context.model.getAllOverviewRulerDecorations(this._context.theme);
        var minDecorationHeight = (6 /* MIN_DECORATION_HEIGHT */ * this._settings.pixelRatio) | 0;
        var halfMinDecorationHeight = (minDecorationHeight / 2) | 0;
        var canvasCtx = this._domNode.domNode.getContext('2d');
        if (this._settings.backgroundColor === null) {
            canvasCtx.clearRect(0, 0, canvasWidth, canvasHeight);
        }
        else {
            canvasCtx.fillStyle = this._settings.backgroundColor;
            canvasCtx.fillRect(0, 0, canvasWidth, canvasHeight);
        }
        var x = this._settings.x;
        var w = this._settings.w;
        // Avoid flickering by always rendering the colors in the same order
        // colors that don't use transparency will be sorted last (they start with #)
        var colors = Object.keys(decorations);
        colors.sort();
        for (var cIndex = 0, cLen = colors.length; cIndex < cLen; cIndex++) {
            var color = colors[cIndex];
            var colorDecorations = decorations[color];
            canvasCtx.fillStyle = color;
            var prevLane = 0;
            var prevY1 = 0;
            var prevY2 = 0;
            for (var i = 0, len = colorDecorations.length; i < len; i++) {
                var lane = colorDecorations[3 * i];
                var startLineNumber = colorDecorations[3 * i + 1];
                var endLineNumber = colorDecorations[3 * i + 2];
                var y1 = (viewLayout.getVerticalOffsetForLineNumber(startLineNumber) * heightRatio) | 0;
                var y2 = ((viewLayout.getVerticalOffsetForLineNumber(endLineNumber) + lineHeight) * heightRatio) | 0;
                var height = y2 - y1;
                if (height < minDecorationHeight) {
                    var yCenter = ((y1 + y2) / 2) | 0;
                    if (yCenter < halfMinDecorationHeight) {
                        yCenter = halfMinDecorationHeight;
                    }
                    else if (yCenter + halfMinDecorationHeight > canvasHeight) {
                        yCenter = canvasHeight - halfMinDecorationHeight;
                    }
                    y1 = yCenter - halfMinDecorationHeight;
                    y2 = yCenter + halfMinDecorationHeight;
                }
                if (y1 > prevY2 + 1 || lane !== prevLane) {
                    // flush prev
                    if (i !== 0) {
                        canvasCtx.fillRect(x[prevLane], prevY1, w[prevLane], prevY2 - prevY1);
                    }
                    prevLane = lane;
                    prevY1 = y1;
                    prevY2 = y2;
                }
                else {
                    // merge into prev
                    if (y2 > prevY2) {
                        prevY2 = y2;
                    }
                }
            }
            canvasCtx.fillRect(x[prevLane], prevY1, w[prevLane], prevY2 - prevY1);
        }
        // Draw cursors
        if (!this._settings.hideCursor) {
            var cursorHeight = (2 * this._settings.pixelRatio) | 0;
            var halfCursorHeight = (cursorHeight / 2) | 0;
            var cursorX = this._settings.x[7 /* Full */];
            var cursorW = this._settings.w[7 /* Full */];
            canvasCtx.fillStyle = this._settings.cursorColor;
            var prevY1 = -100;
            var prevY2 = -100;
            for (var i = 0, len = this._cursorPositions.length; i < len; i++) {
                var cursor = this._cursorPositions[i];
                var yCenter = (viewLayout.getVerticalOffsetForLineNumber(cursor.lineNumber) * heightRatio) | 0;
                if (yCenter < halfCursorHeight) {
                    yCenter = halfCursorHeight;
                }
                else if (yCenter + halfCursorHeight > canvasHeight) {
                    yCenter = canvasHeight - halfCursorHeight;
                }
                var y1 = yCenter - halfCursorHeight;
                var y2 = y1 + cursorHeight;
                if (y1 > prevY2 + 1) {
                    // flush prev
                    if (i !== 0) {
                        canvasCtx.fillRect(cursorX, prevY1, cursorW, prevY2 - prevY1);
                    }
                    prevY1 = y1;
                    prevY2 = y2;
                }
                else {
                    // merge into prev
                    if (y2 > prevY2) {
                        prevY2 = y2;
                    }
                }
            }
            canvasCtx.fillRect(cursorX, prevY1, cursorW, prevY2 - prevY1);
        }
        if (this._settings.renderBorder && this._settings.borderColor && this._settings.overviewRulerLanes > 0) {
            canvasCtx.beginPath();
            canvasCtx.lineWidth = 1;
            canvasCtx.strokeStyle = this._settings.borderColor;
            canvasCtx.moveTo(0, 0);
            canvasCtx.lineTo(0, canvasHeight);
            canvasCtx.stroke();
            canvasCtx.moveTo(0, 0);
            canvasCtx.lineTo(canvasWidth, 0);
            canvasCtx.stroke();
        }
    };
    return DecorationsOverviewRuler;
}(ViewPart));
export { DecorationsOverviewRuler };
