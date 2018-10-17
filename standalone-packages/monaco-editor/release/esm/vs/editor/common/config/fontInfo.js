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
import * as platform from '../../../base/common/platform.js';
import { EditorZoom } from './editorZoom.js';
import { EDITOR_FONT_DEFAULTS } from './editorOptions.js';
/**
 * Determined from empirical observations.
 * @internal
 */
var GOLDEN_LINE_HEIGHT_RATIO = platform.isMacintosh ? 1.5 : 1.35;
/**
 * Font settings maximum and minimum limits
 */
var MINIMUM_FONT_SIZE = 8;
var MAXIMUM_FONT_SIZE = 100;
var MINIMUM_LINE_HEIGHT = 8;
var MAXIMUM_LINE_HEIGHT = 150;
var MINIMUM_LETTER_SPACING = -5;
var MAXIMUM_LETTER_SPACING = 20;
function safeParseFloat(n, defaultValue) {
    if (typeof n === 'number') {
        return n;
    }
    var r = parseFloat(n);
    if (isNaN(r)) {
        return defaultValue;
    }
    return r;
}
function safeParseInt(n, defaultValue) {
    if (typeof n === 'number') {
        return Math.round(n);
    }
    var r = parseInt(n);
    if (isNaN(r)) {
        return defaultValue;
    }
    return r;
}
function clamp(n, min, max) {
    if (n < min) {
        return min;
    }
    if (n > max) {
        return max;
    }
    return n;
}
function _string(value, defaultValue) {
    if (typeof value !== 'string') {
        return defaultValue;
    }
    return value;
}
var BareFontInfo = /** @class */ (function () {
    /**
     * @internal
     */
    function BareFontInfo(opts) {
        this.zoomLevel = opts.zoomLevel;
        this.fontFamily = String(opts.fontFamily);
        this.fontWeight = String(opts.fontWeight);
        this.fontSize = opts.fontSize;
        this.lineHeight = opts.lineHeight | 0;
        this.letterSpacing = opts.letterSpacing;
    }
    /**
     * @internal
     */
    BareFontInfo.createFromRawSettings = function (opts, zoomLevel) {
        var fontFamily = _string(opts.fontFamily, EDITOR_FONT_DEFAULTS.fontFamily);
        var fontWeight = _string(opts.fontWeight, EDITOR_FONT_DEFAULTS.fontWeight);
        var fontSize = safeParseFloat(opts.fontSize, EDITOR_FONT_DEFAULTS.fontSize);
        fontSize = clamp(fontSize, 0, MAXIMUM_FONT_SIZE);
        if (fontSize === 0) {
            fontSize = EDITOR_FONT_DEFAULTS.fontSize;
        }
        else if (fontSize < MINIMUM_FONT_SIZE) {
            fontSize = MINIMUM_FONT_SIZE;
        }
        var lineHeight = safeParseInt(opts.lineHeight, 0);
        lineHeight = clamp(lineHeight, 0, MAXIMUM_LINE_HEIGHT);
        if (lineHeight === 0) {
            lineHeight = Math.round(GOLDEN_LINE_HEIGHT_RATIO * fontSize);
        }
        else if (lineHeight < MINIMUM_LINE_HEIGHT) {
            lineHeight = MINIMUM_LINE_HEIGHT;
        }
        var letterSpacing = safeParseFloat(opts.letterSpacing, 0);
        letterSpacing = clamp(letterSpacing, MINIMUM_LETTER_SPACING, MAXIMUM_LETTER_SPACING);
        var editorZoomLevelMultiplier = 1 + (EditorZoom.getZoomLevel() * 0.1);
        fontSize *= editorZoomLevelMultiplier;
        lineHeight *= editorZoomLevelMultiplier;
        return new BareFontInfo({
            zoomLevel: zoomLevel,
            fontFamily: fontFamily,
            fontWeight: fontWeight,
            fontSize: fontSize,
            lineHeight: lineHeight,
            letterSpacing: letterSpacing
        });
    };
    /**
     * @internal
     */
    BareFontInfo.prototype.getId = function () {
        return this.zoomLevel + '-' + this.fontFamily + '-' + this.fontWeight + '-' + this.fontSize + '-' + this.lineHeight + '-' + this.letterSpacing;
    };
    return BareFontInfo;
}());
export { BareFontInfo };
var FontInfo = /** @class */ (function (_super) {
    __extends(FontInfo, _super);
    /**
     * @internal
     */
    function FontInfo(opts, isTrusted) {
        var _this = _super.call(this, opts) || this;
        _this.isTrusted = isTrusted;
        _this.isMonospace = opts.isMonospace;
        _this.typicalHalfwidthCharacterWidth = opts.typicalHalfwidthCharacterWidth;
        _this.typicalFullwidthCharacterWidth = opts.typicalFullwidthCharacterWidth;
        _this.spaceWidth = opts.spaceWidth;
        _this.maxDigitWidth = opts.maxDigitWidth;
        return _this;
    }
    /**
     * @internal
     */
    FontInfo.prototype.equals = function (other) {
        return (this.fontFamily === other.fontFamily
            && this.fontWeight === other.fontWeight
            && this.fontSize === other.fontSize
            && this.lineHeight === other.lineHeight
            && this.letterSpacing === other.letterSpacing
            && this.typicalHalfwidthCharacterWidth === other.typicalHalfwidthCharacterWidth
            && this.typicalFullwidthCharacterWidth === other.typicalFullwidthCharacterWidth
            && this.spaceWidth === other.spaceWidth
            && this.maxDigitWidth === other.maxDigitWidth);
    };
    return FontInfo;
}(BareFontInfo));
export { FontInfo };
