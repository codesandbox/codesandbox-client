/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { HorizontalRange } from '../../../common/view/renderingContext.js';
var FloatHorizontalRange = /** @class */ (function () {
    function FloatHorizontalRange(left, width) {
        this.left = left;
        this.width = width;
    }
    FloatHorizontalRange.prototype.toString = function () {
        return "[" + this.left + "," + this.width + "]";
    };
    FloatHorizontalRange.compare = function (a, b) {
        return a.left - b.left;
    };
    return FloatHorizontalRange;
}());
var RangeUtil = /** @class */ (function () {
    function RangeUtil() {
    }
    RangeUtil._createRange = function () {
        if (!this._handyReadyRange) {
            this._handyReadyRange = document.createRange();
        }
        return this._handyReadyRange;
    };
    RangeUtil._detachRange = function (range, endNode) {
        // Move range out of the span node, IE doesn't like having many ranges in
        // the same spot and will act badly for lines containing dashes ('-')
        range.selectNodeContents(endNode);
    };
    RangeUtil._readClientRects = function (startElement, startOffset, endElement, endOffset, endNode) {
        var range = this._createRange();
        try {
            range.setStart(startElement, startOffset);
            range.setEnd(endElement, endOffset);
            return range.getClientRects();
        }
        catch (e) {
            // This is life ...
            return null;
        }
        finally {
            this._detachRange(range, endNode);
        }
    };
    RangeUtil._mergeAdjacentRanges = function (ranges) {
        if (ranges.length === 1) {
            // There is nothing to merge
            return [new HorizontalRange(ranges[0].left, ranges[0].width)];
        }
        ranges.sort(FloatHorizontalRange.compare);
        var result = [], resultLen = 0;
        var prevLeft = ranges[0].left;
        var prevWidth = ranges[0].width;
        for (var i = 1, len = ranges.length; i < len; i++) {
            var range = ranges[i];
            var myLeft = range.left;
            var myWidth = range.width;
            if (prevLeft + prevWidth + 0.9 /* account for browser's rounding errors*/ >= myLeft) {
                prevWidth = Math.max(prevWidth, myLeft + myWidth - prevLeft);
            }
            else {
                result[resultLen++] = new HorizontalRange(prevLeft, prevWidth);
                prevLeft = myLeft;
                prevWidth = myWidth;
            }
        }
        result[resultLen++] = new HorizontalRange(prevLeft, prevWidth);
        return result;
    };
    RangeUtil._createHorizontalRangesFromClientRects = function (clientRects, clientRectDeltaLeft) {
        if (!clientRects || clientRects.length === 0) {
            return null;
        }
        // We go through FloatHorizontalRange because it has been observed in bi-di text
        // that the clientRects are not coming in sorted from the browser
        var result = [];
        for (var i = 0, len = clientRects.length; i < len; i++) {
            var clientRect = clientRects[i];
            result[i] = new FloatHorizontalRange(Math.max(0, clientRect.left - clientRectDeltaLeft), clientRect.width);
        }
        return this._mergeAdjacentRanges(result);
    };
    RangeUtil.readHorizontalRanges = function (domNode, startChildIndex, startOffset, endChildIndex, endOffset, clientRectDeltaLeft, endNode) {
        // Panic check
        var min = 0;
        var max = domNode.children.length - 1;
        if (min > max) {
            return null;
        }
        startChildIndex = Math.min(max, Math.max(min, startChildIndex));
        endChildIndex = Math.min(max, Math.max(min, endChildIndex));
        // If crossing over to a span only to select offset 0, then use the previous span's maximum offset
        // Chrome is buggy and doesn't handle 0 offsets well sometimes.
        if (startChildIndex !== endChildIndex) {
            if (endChildIndex > 0 && endOffset === 0) {
                endChildIndex--;
                endOffset = Number.MAX_VALUE;
            }
        }
        var startElement = domNode.children[startChildIndex].firstChild;
        var endElement = domNode.children[endChildIndex].firstChild;
        if (!startElement || !endElement) {
            // When having an empty <span> (without any text content), try to move to the previous <span>
            if (!startElement && startOffset === 0 && startChildIndex > 0) {
                startElement = domNode.children[startChildIndex - 1].firstChild;
                startOffset = 1073741824 /* MAX_SAFE_SMALL_INTEGER */;
            }
            if (!endElement && endOffset === 0 && endChildIndex > 0) {
                endElement = domNode.children[endChildIndex - 1].firstChild;
                endOffset = 1073741824 /* MAX_SAFE_SMALL_INTEGER */;
            }
        }
        if (!startElement || !endElement) {
            return null;
        }
        startOffset = Math.min(startElement.textContent.length, Math.max(0, startOffset));
        endOffset = Math.min(endElement.textContent.length, Math.max(0, endOffset));
        var clientRects = this._readClientRects(startElement, startOffset, endElement, endOffset, endNode);
        return this._createHorizontalRangesFromClientRects(clientRects, clientRectDeltaLeft);
    };
    return RangeUtil;
}());
export { RangeUtil };
