/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as strings from '../../../base/common/strings.js';
var Viewport = /** @class */ (function () {
    function Viewport(top, left, width, height) {
        this.top = top | 0;
        this.left = left | 0;
        this.width = width | 0;
        this.height = height | 0;
    }
    return Viewport;
}());
export { Viewport };
var MinimapLinesRenderingData = /** @class */ (function () {
    function MinimapLinesRenderingData(tabSize, data) {
        this.tabSize = tabSize;
        this.data = data;
    }
    return MinimapLinesRenderingData;
}());
export { MinimapLinesRenderingData };
var ViewLineData = /** @class */ (function () {
    function ViewLineData(content, continuesWithWrappedLine, minColumn, maxColumn, tokens) {
        this.content = content;
        this.continuesWithWrappedLine = continuesWithWrappedLine;
        this.minColumn = minColumn;
        this.maxColumn = maxColumn;
        this.tokens = tokens;
    }
    return ViewLineData;
}());
export { ViewLineData };
var ViewLineRenderingData = /** @class */ (function () {
    function ViewLineRenderingData(minColumn, maxColumn, content, continuesWithWrappedLine, mightContainRTL, mightContainNonBasicASCII, tokens, inlineDecorations, tabSize) {
        this.minColumn = minColumn;
        this.maxColumn = maxColumn;
        this.content = content;
        this.continuesWithWrappedLine = continuesWithWrappedLine;
        this.isBasicASCII = ViewLineRenderingData.isBasicASCII(content, mightContainNonBasicASCII);
        this.containsRTL = ViewLineRenderingData.containsRTL(content, this.isBasicASCII, mightContainRTL);
        this.tokens = tokens;
        this.inlineDecorations = inlineDecorations;
        this.tabSize = tabSize;
    }
    ViewLineRenderingData.isBasicASCII = function (lineContent, mightContainNonBasicASCII) {
        if (mightContainNonBasicASCII) {
            return strings.isBasicASCII(lineContent);
        }
        return true;
    };
    ViewLineRenderingData.containsRTL = function (lineContent, isBasicASCII, mightContainRTL) {
        if (!isBasicASCII && mightContainRTL) {
            return strings.containsRTL(lineContent);
        }
        return false;
    };
    return ViewLineRenderingData;
}());
export { ViewLineRenderingData };
var InlineDecoration = /** @class */ (function () {
    function InlineDecoration(range, inlineClassName, type) {
        this.range = range;
        this.inlineClassName = inlineClassName;
        this.type = type;
    }
    return InlineDecoration;
}());
export { InlineDecoration };
var ViewModelDecoration = /** @class */ (function () {
    function ViewModelDecoration(range, options) {
        this.range = range;
        this.options = options;
    }
    return ViewModelDecoration;
}());
export { ViewModelDecoration };
