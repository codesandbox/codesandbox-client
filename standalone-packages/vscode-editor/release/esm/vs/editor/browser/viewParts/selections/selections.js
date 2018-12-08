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
import './selections.css';
import * as browser from '../../../../base/browser/browser.js';
import { DynamicViewOverlay } from '../../view/dynamicViewOverlay.js';
import { editorInactiveSelection, editorSelectionBackground, editorSelectionForeground } from '../../../../platform/theme/common/colorRegistry.js';
import { registerThemingParticipant } from '../../../../platform/theme/common/themeService.js';
var HorizontalRangeWithStyle = /** @class */ (function () {
    function HorizontalRangeWithStyle(other) {
        this.left = other.left;
        this.width = other.width;
        this.startStyle = null;
        this.endStyle = null;
    }
    return HorizontalRangeWithStyle;
}());
var LineVisibleRangesWithStyle = /** @class */ (function () {
    function LineVisibleRangesWithStyle(lineNumber, ranges) {
        this.lineNumber = lineNumber;
        this.ranges = ranges;
    }
    return LineVisibleRangesWithStyle;
}());
function toStyledRange(item) {
    return new HorizontalRangeWithStyle(item);
}
function toStyled(item) {
    return new LineVisibleRangesWithStyle(item.lineNumber, item.ranges.map(toStyledRange));
}
// TODO@Alex: Remove this once IE11 fixes Bug #524217
// The problem in IE11 is that it does some sort of auto-zooming to accomodate for displays with different pixel density.
// Unfortunately, this auto-zooming is buggy around dealing with rounded borders
var isIEWithZoomingIssuesNearRoundedBorders = browser.isEdgeOrIE;
var SelectionsOverlay = /** @class */ (function (_super) {
    __extends(SelectionsOverlay, _super);
    function SelectionsOverlay(context) {
        var _this = _super.call(this) || this;
        _this._previousFrameVisibleRangesWithStyle = [];
        _this._context = context;
        _this._lineHeight = _this._context.configuration.editor.lineHeight;
        _this._roundedSelection = _this._context.configuration.editor.viewInfo.roundedSelection;
        _this._typicalHalfwidthCharacterWidth = _this._context.configuration.editor.fontInfo.typicalHalfwidthCharacterWidth;
        _this._selections = [];
        _this._renderResult = null;
        _this._context.addEventHandler(_this);
        return _this;
    }
    SelectionsOverlay.prototype.dispose = function () {
        this._context.removeEventHandler(this);
        this._renderResult = null;
        _super.prototype.dispose.call(this);
    };
    // --- begin event handlers
    SelectionsOverlay.prototype.onConfigurationChanged = function (e) {
        if (e.lineHeight) {
            this._lineHeight = this._context.configuration.editor.lineHeight;
        }
        if (e.viewInfo) {
            this._roundedSelection = this._context.configuration.editor.viewInfo.roundedSelection;
        }
        if (e.fontInfo) {
            this._typicalHalfwidthCharacterWidth = this._context.configuration.editor.fontInfo.typicalHalfwidthCharacterWidth;
        }
        return true;
    };
    SelectionsOverlay.prototype.onCursorStateChanged = function (e) {
        this._selections = e.selections.slice(0);
        return true;
    };
    SelectionsOverlay.prototype.onDecorationsChanged = function (e) {
        // true for inline decorations that can end up relayouting text
        return true; //e.inlineDecorationsChanged;
    };
    SelectionsOverlay.prototype.onFlushed = function (e) {
        return true;
    };
    SelectionsOverlay.prototype.onLinesChanged = function (e) {
        return true;
    };
    SelectionsOverlay.prototype.onLinesDeleted = function (e) {
        return true;
    };
    SelectionsOverlay.prototype.onLinesInserted = function (e) {
        return true;
    };
    SelectionsOverlay.prototype.onScrollChanged = function (e) {
        return e.scrollTopChanged;
    };
    SelectionsOverlay.prototype.onZonesChanged = function (e) {
        return true;
    };
    // --- end event handlers
    SelectionsOverlay.prototype._visibleRangesHaveGaps = function (linesVisibleRanges) {
        for (var i = 0, len = linesVisibleRanges.length; i < len; i++) {
            var lineVisibleRanges = linesVisibleRanges[i];
            if (lineVisibleRanges.ranges.length > 1) {
                // There are two ranges on the same line
                return true;
            }
        }
        return false;
    };
    SelectionsOverlay.prototype._enrichVisibleRangesWithStyle = function (viewport, linesVisibleRanges, previousFrame) {
        var epsilon = this._typicalHalfwidthCharacterWidth / 4;
        var previousFrameTop = null;
        var previousFrameBottom = null;
        if (previousFrame && previousFrame.length > 0 && linesVisibleRanges.length > 0) {
            var topLineNumber = linesVisibleRanges[0].lineNumber;
            if (topLineNumber === viewport.startLineNumber) {
                for (var i = 0; !previousFrameTop && i < previousFrame.length; i++) {
                    if (previousFrame[i].lineNumber === topLineNumber) {
                        previousFrameTop = previousFrame[i].ranges[0];
                    }
                }
            }
            var bottomLineNumber = linesVisibleRanges[linesVisibleRanges.length - 1].lineNumber;
            if (bottomLineNumber === viewport.endLineNumber) {
                for (var i = previousFrame.length - 1; !previousFrameBottom && i >= 0; i--) {
                    if (previousFrame[i].lineNumber === bottomLineNumber) {
                        previousFrameBottom = previousFrame[i].ranges[0];
                    }
                }
            }
            if (previousFrameTop && !previousFrameTop.startStyle) {
                previousFrameTop = null;
            }
            if (previousFrameBottom && !previousFrameBottom.startStyle) {
                previousFrameBottom = null;
            }
        }
        for (var i = 0, len = linesVisibleRanges.length; i < len; i++) {
            // We know for a fact that there is precisely one range on each line
            var curLineRange = linesVisibleRanges[i].ranges[0];
            var curLeft = curLineRange.left;
            var curRight = curLineRange.left + curLineRange.width;
            var startStyle = {
                top: 0 /* EXTERN */,
                bottom: 0 /* EXTERN */
            };
            var endStyle = {
                top: 0 /* EXTERN */,
                bottom: 0 /* EXTERN */
            };
            if (i > 0) {
                // Look above
                var prevLeft = linesVisibleRanges[i - 1].ranges[0].left;
                var prevRight = linesVisibleRanges[i - 1].ranges[0].left + linesVisibleRanges[i - 1].ranges[0].width;
                if (abs(curLeft - prevLeft) < epsilon) {
                    startStyle.top = 2 /* FLAT */;
                }
                else if (curLeft > prevLeft) {
                    startStyle.top = 1 /* INTERN */;
                }
                if (abs(curRight - prevRight) < epsilon) {
                    endStyle.top = 2 /* FLAT */;
                }
                else if (prevLeft < curRight && curRight < prevRight) {
                    endStyle.top = 1 /* INTERN */;
                }
            }
            else if (previousFrameTop) {
                // Accept some hick-ups near the viewport edges to save on repaints
                startStyle.top = previousFrameTop.startStyle.top;
                endStyle.top = previousFrameTop.endStyle.top;
            }
            if (i + 1 < len) {
                // Look below
                var nextLeft = linesVisibleRanges[i + 1].ranges[0].left;
                var nextRight = linesVisibleRanges[i + 1].ranges[0].left + linesVisibleRanges[i + 1].ranges[0].width;
                if (abs(curLeft - nextLeft) < epsilon) {
                    startStyle.bottom = 2 /* FLAT */;
                }
                else if (nextLeft < curLeft && curLeft < nextRight) {
                    startStyle.bottom = 1 /* INTERN */;
                }
                if (abs(curRight - nextRight) < epsilon) {
                    endStyle.bottom = 2 /* FLAT */;
                }
                else if (curRight < nextRight) {
                    endStyle.bottom = 1 /* INTERN */;
                }
            }
            else if (previousFrameBottom) {
                // Accept some hick-ups near the viewport edges to save on repaints
                startStyle.bottom = previousFrameBottom.startStyle.bottom;
                endStyle.bottom = previousFrameBottom.endStyle.bottom;
            }
            curLineRange.startStyle = startStyle;
            curLineRange.endStyle = endStyle;
        }
    };
    SelectionsOverlay.prototype._getVisibleRangesWithStyle = function (selection, ctx, previousFrame) {
        var _linesVisibleRanges = ctx.linesVisibleRangesForRange(selection, true) || [];
        var linesVisibleRanges = _linesVisibleRanges.map(toStyled);
        var visibleRangesHaveGaps = this._visibleRangesHaveGaps(linesVisibleRanges);
        if (!isIEWithZoomingIssuesNearRoundedBorders && !visibleRangesHaveGaps && this._roundedSelection) {
            this._enrichVisibleRangesWithStyle(ctx.visibleRange, linesVisibleRanges, previousFrame);
        }
        // The visible ranges are sorted TOP-BOTTOM and LEFT-RIGHT
        return linesVisibleRanges;
    };
    SelectionsOverlay.prototype._createSelectionPiece = function (top, height, className, left, width) {
        return ('<div class="cslr '
            + className
            + '" style="top:'
            + top.toString()
            + 'px;left:'
            + left.toString()
            + 'px;width:'
            + width.toString()
            + 'px;height:'
            + height
            + 'px;"></div>');
    };
    SelectionsOverlay.prototype._actualRenderOneSelection = function (output2, visibleStartLineNumber, hasMultipleSelections, visibleRanges) {
        var visibleRangesHaveStyle = (visibleRanges.length > 0 && visibleRanges[0].ranges[0].startStyle);
        var fullLineHeight = (this._lineHeight).toString();
        var reducedLineHeight = (this._lineHeight - 1).toString();
        var firstLineNumber = (visibleRanges.length > 0 ? visibleRanges[0].lineNumber : 0);
        var lastLineNumber = (visibleRanges.length > 0 ? visibleRanges[visibleRanges.length - 1].lineNumber : 0);
        for (var i = 0, len = visibleRanges.length; i < len; i++) {
            var lineVisibleRanges = visibleRanges[i];
            var lineNumber = lineVisibleRanges.lineNumber;
            var lineIndex = lineNumber - visibleStartLineNumber;
            var lineHeight = hasMultipleSelections ? (lineNumber === lastLineNumber || lineNumber === firstLineNumber ? reducedLineHeight : fullLineHeight) : fullLineHeight;
            var top_1 = hasMultipleSelections ? (lineNumber === firstLineNumber ? 1 : 0) : 0;
            var lineOutput = '';
            for (var j = 0, lenJ = lineVisibleRanges.ranges.length; j < lenJ; j++) {
                var visibleRange = lineVisibleRanges.ranges[j];
                if (visibleRangesHaveStyle) {
                    var startStyle = visibleRange.startStyle;
                    var endStyle = visibleRange.endStyle;
                    if (startStyle.top === 1 /* INTERN */ || startStyle.bottom === 1 /* INTERN */) {
                        // Reverse rounded corner to the left
                        // First comes the selection (blue layer)
                        lineOutput += this._createSelectionPiece(top_1, lineHeight, SelectionsOverlay.SELECTION_CLASS_NAME, visibleRange.left - SelectionsOverlay.ROUNDED_PIECE_WIDTH, SelectionsOverlay.ROUNDED_PIECE_WIDTH);
                        // Second comes the background (white layer) with inverse border radius
                        var className_1 = SelectionsOverlay.EDITOR_BACKGROUND_CLASS_NAME;
                        if (startStyle.top === 1 /* INTERN */) {
                            className_1 += ' ' + SelectionsOverlay.SELECTION_TOP_RIGHT;
                        }
                        if (startStyle.bottom === 1 /* INTERN */) {
                            className_1 += ' ' + SelectionsOverlay.SELECTION_BOTTOM_RIGHT;
                        }
                        lineOutput += this._createSelectionPiece(top_1, lineHeight, className_1, visibleRange.left - SelectionsOverlay.ROUNDED_PIECE_WIDTH, SelectionsOverlay.ROUNDED_PIECE_WIDTH);
                    }
                    if (endStyle.top === 1 /* INTERN */ || endStyle.bottom === 1 /* INTERN */) {
                        // Reverse rounded corner to the right
                        // First comes the selection (blue layer)
                        lineOutput += this._createSelectionPiece(top_1, lineHeight, SelectionsOverlay.SELECTION_CLASS_NAME, visibleRange.left + visibleRange.width, SelectionsOverlay.ROUNDED_PIECE_WIDTH);
                        // Second comes the background (white layer) with inverse border radius
                        var className_2 = SelectionsOverlay.EDITOR_BACKGROUND_CLASS_NAME;
                        if (endStyle.top === 1 /* INTERN */) {
                            className_2 += ' ' + SelectionsOverlay.SELECTION_TOP_LEFT;
                        }
                        if (endStyle.bottom === 1 /* INTERN */) {
                            className_2 += ' ' + SelectionsOverlay.SELECTION_BOTTOM_LEFT;
                        }
                        lineOutput += this._createSelectionPiece(top_1, lineHeight, className_2, visibleRange.left + visibleRange.width, SelectionsOverlay.ROUNDED_PIECE_WIDTH);
                    }
                }
                var className = SelectionsOverlay.SELECTION_CLASS_NAME;
                if (visibleRangesHaveStyle) {
                    var startStyle = visibleRange.startStyle;
                    var endStyle = visibleRange.endStyle;
                    if (startStyle.top === 0 /* EXTERN */) {
                        className += ' ' + SelectionsOverlay.SELECTION_TOP_LEFT;
                    }
                    if (startStyle.bottom === 0 /* EXTERN */) {
                        className += ' ' + SelectionsOverlay.SELECTION_BOTTOM_LEFT;
                    }
                    if (endStyle.top === 0 /* EXTERN */) {
                        className += ' ' + SelectionsOverlay.SELECTION_TOP_RIGHT;
                    }
                    if (endStyle.bottom === 0 /* EXTERN */) {
                        className += ' ' + SelectionsOverlay.SELECTION_BOTTOM_RIGHT;
                    }
                }
                lineOutput += this._createSelectionPiece(top_1, lineHeight, className, visibleRange.left, visibleRange.width);
            }
            output2[lineIndex] += lineOutput;
        }
    };
    SelectionsOverlay.prototype.prepareRender = function (ctx) {
        var output = [];
        var visibleStartLineNumber = ctx.visibleRange.startLineNumber;
        var visibleEndLineNumber = ctx.visibleRange.endLineNumber;
        for (var lineNumber = visibleStartLineNumber; lineNumber <= visibleEndLineNumber; lineNumber++) {
            var lineIndex = lineNumber - visibleStartLineNumber;
            output[lineIndex] = '';
        }
        var thisFrameVisibleRangesWithStyle = [];
        for (var i = 0, len = this._selections.length; i < len; i++) {
            var selection = this._selections[i];
            if (selection.isEmpty()) {
                thisFrameVisibleRangesWithStyle[i] = null;
                continue;
            }
            var visibleRangesWithStyle = this._getVisibleRangesWithStyle(selection, ctx, this._previousFrameVisibleRangesWithStyle[i]);
            thisFrameVisibleRangesWithStyle[i] = visibleRangesWithStyle;
            this._actualRenderOneSelection(output, visibleStartLineNumber, this._selections.length > 1, visibleRangesWithStyle);
        }
        this._previousFrameVisibleRangesWithStyle = thisFrameVisibleRangesWithStyle;
        this._renderResult = output;
    };
    SelectionsOverlay.prototype.render = function (startLineNumber, lineNumber) {
        if (!this._renderResult) {
            return '';
        }
        var lineIndex = lineNumber - startLineNumber;
        if (lineIndex < 0 || lineIndex >= this._renderResult.length) {
            return '';
        }
        return this._renderResult[lineIndex];
    };
    SelectionsOverlay.SELECTION_CLASS_NAME = 'selected-text';
    SelectionsOverlay.SELECTION_TOP_LEFT = 'top-left-radius';
    SelectionsOverlay.SELECTION_BOTTOM_LEFT = 'bottom-left-radius';
    SelectionsOverlay.SELECTION_TOP_RIGHT = 'top-right-radius';
    SelectionsOverlay.SELECTION_BOTTOM_RIGHT = 'bottom-right-radius';
    SelectionsOverlay.EDITOR_BACKGROUND_CLASS_NAME = 'monaco-editor-background';
    SelectionsOverlay.ROUNDED_PIECE_WIDTH = 10;
    return SelectionsOverlay;
}(DynamicViewOverlay));
export { SelectionsOverlay };
registerThemingParticipant(function (theme, collector) {
    var editorSelectionColor = theme.getColor(editorSelectionBackground);
    if (editorSelectionColor) {
        collector.addRule(".monaco-editor .focused .selected-text { background-color: " + editorSelectionColor + "; }");
    }
    var editorInactiveSelectionColor = theme.getColor(editorInactiveSelection);
    if (editorInactiveSelectionColor) {
        collector.addRule(".monaco-editor .selected-text { background-color: " + editorInactiveSelectionColor + "; }");
    }
    var editorSelectionForegroundColor = theme.getColor(editorSelectionForeground);
    if (editorSelectionForegroundColor) {
        collector.addRule(".monaco-editor .view-line span.inline-selected-text { color: " + editorSelectionForegroundColor + "; }");
    }
});
function abs(n) {
    return n < 0 ? -n : n;
}
