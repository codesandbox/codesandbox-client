/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { TokenizationRegistry } from '../modes.js';
import { Emitter } from '../../../base/common/event.js';
import { RGBA8 } from '../core/rgba.js';
var MinimapTokensColorTracker = /** @class */ (function () {
    function MinimapTokensColorTracker() {
        var _this = this;
        this._onDidChange = new Emitter();
        this.onDidChange = this._onDidChange.event;
        this._updateColorMap();
        TokenizationRegistry.onDidChange(function (e) {
            if (e.changedColorMap) {
                _this._updateColorMap();
            }
        });
    }
    MinimapTokensColorTracker.getInstance = function () {
        if (!this._INSTANCE) {
            this._INSTANCE = new MinimapTokensColorTracker();
        }
        return this._INSTANCE;
    };
    MinimapTokensColorTracker.prototype._updateColorMap = function () {
        var colorMap = TokenizationRegistry.getColorMap();
        if (!colorMap) {
            this._colors = [null];
            this._backgroundIsLight = true;
            return;
        }
        this._colors = [null];
        for (var colorId = 1; colorId < colorMap.length; colorId++) {
            var source = colorMap[colorId].rgba;
            // Use a VM friendly data-type
            this._colors[colorId] = new RGBA8(source.r, source.g, source.b, Math.round(source.a * 255));
        }
        var backgroundLuminosity = colorMap[2 /* DefaultBackground */].getRelativeLuminance();
        this._backgroundIsLight = (backgroundLuminosity >= 0.5);
        this._onDidChange.fire(void 0);
    };
    MinimapTokensColorTracker.prototype.getColor = function (colorId) {
        if (colorId < 1 || colorId >= this._colors.length) {
            // background color (basically invisible)
            colorId = 2 /* DefaultBackground */;
        }
        return this._colors[colorId];
    };
    MinimapTokensColorTracker.prototype.backgroundIsLight = function () {
        return this._backgroundIsLight;
    };
    MinimapTokensColorTracker._INSTANCE = null;
    return MinimapTokensColorTracker;
}());
export { MinimapTokensColorTracker };
var MinimapCharRenderer = /** @class */ (function () {
    function MinimapCharRenderer(x2CharData, x1CharData) {
        var x2ExpectedLen = 4 /* x2_CHAR_HEIGHT */ * 2 /* x2_CHAR_WIDTH */ * 95 /* CHAR_COUNT */;
        if (x2CharData.length !== x2ExpectedLen) {
            throw new Error('Invalid x2CharData');
        }
        var x1ExpectedLen = 2 /* x1_CHAR_HEIGHT */ * 1 /* x1_CHAR_WIDTH */ * 95 /* CHAR_COUNT */;
        if (x1CharData.length !== x1ExpectedLen) {
            throw new Error('Invalid x1CharData');
        }
        this.x2charData = x2CharData;
        this.x1charData = x1CharData;
        this.x2charDataLight = MinimapCharRenderer.soften(x2CharData, 12 / 15);
        this.x1charDataLight = MinimapCharRenderer.soften(x1CharData, 50 / 60);
    }
    MinimapCharRenderer.soften = function (input, ratio) {
        var result = new Uint8ClampedArray(input.length);
        for (var i = 0, len = input.length; i < len; i++) {
            result[i] = input[i] * ratio;
        }
        return result;
    };
    MinimapCharRenderer._getChIndex = function (chCode) {
        chCode -= 32 /* START_CH_CODE */;
        if (chCode < 0) {
            chCode += 95 /* CHAR_COUNT */;
        }
        return (chCode % 95 /* CHAR_COUNT */);
    };
    MinimapCharRenderer.prototype.x2RenderChar = function (target, dx, dy, chCode, color, backgroundColor, useLighterFont) {
        if (dx + 2 /* x2_CHAR_WIDTH */ > target.width || dy + 4 /* x2_CHAR_HEIGHT */ > target.height) {
            console.warn('bad render request outside image data');
            return;
        }
        var x2CharData = useLighterFont ? this.x2charDataLight : this.x2charData;
        var chIndex = MinimapCharRenderer._getChIndex(chCode);
        var outWidth = target.width * 4 /* RGBA_CHANNELS_CNT */;
        var backgroundR = backgroundColor.r;
        var backgroundG = backgroundColor.g;
        var backgroundB = backgroundColor.b;
        var deltaR = color.r - backgroundR;
        var deltaG = color.g - backgroundG;
        var deltaB = color.b - backgroundB;
        var dest = target.data;
        var sourceOffset = chIndex * 4 /* x2_CHAR_HEIGHT */ * 2 /* x2_CHAR_WIDTH */;
        var destOffset = dy * outWidth + dx * 4 /* RGBA_CHANNELS_CNT */;
        {
            var c = x2CharData[sourceOffset] / 255;
            dest[destOffset + 0] = backgroundR + deltaR * c;
            dest[destOffset + 1] = backgroundG + deltaG * c;
            dest[destOffset + 2] = backgroundB + deltaB * c;
        }
        {
            var c = x2CharData[sourceOffset + 1] / 255;
            dest[destOffset + 4] = backgroundR + deltaR * c;
            dest[destOffset + 5] = backgroundG + deltaG * c;
            dest[destOffset + 6] = backgroundB + deltaB * c;
        }
        destOffset += outWidth;
        {
            var c = x2CharData[sourceOffset + 2] / 255;
            dest[destOffset + 0] = backgroundR + deltaR * c;
            dest[destOffset + 1] = backgroundG + deltaG * c;
            dest[destOffset + 2] = backgroundB + deltaB * c;
        }
        {
            var c = x2CharData[sourceOffset + 3] / 255;
            dest[destOffset + 4] = backgroundR + deltaR * c;
            dest[destOffset + 5] = backgroundG + deltaG * c;
            dest[destOffset + 6] = backgroundB + deltaB * c;
        }
        destOffset += outWidth;
        {
            var c = x2CharData[sourceOffset + 4] / 255;
            dest[destOffset + 0] = backgroundR + deltaR * c;
            dest[destOffset + 1] = backgroundG + deltaG * c;
            dest[destOffset + 2] = backgroundB + deltaB * c;
        }
        {
            var c = x2CharData[sourceOffset + 5] / 255;
            dest[destOffset + 4] = backgroundR + deltaR * c;
            dest[destOffset + 5] = backgroundG + deltaG * c;
            dest[destOffset + 6] = backgroundB + deltaB * c;
        }
        destOffset += outWidth;
        {
            var c = x2CharData[sourceOffset + 6] / 255;
            dest[destOffset + 0] = backgroundR + deltaR * c;
            dest[destOffset + 1] = backgroundG + deltaG * c;
            dest[destOffset + 2] = backgroundB + deltaB * c;
        }
        {
            var c = x2CharData[sourceOffset + 7] / 255;
            dest[destOffset + 4] = backgroundR + deltaR * c;
            dest[destOffset + 5] = backgroundG + deltaG * c;
            dest[destOffset + 6] = backgroundB + deltaB * c;
        }
    };
    MinimapCharRenderer.prototype.x1RenderChar = function (target, dx, dy, chCode, color, backgroundColor, useLighterFont) {
        if (dx + 1 /* x1_CHAR_WIDTH */ > target.width || dy + 2 /* x1_CHAR_HEIGHT */ > target.height) {
            console.warn('bad render request outside image data');
            return;
        }
        var x1CharData = useLighterFont ? this.x1charDataLight : this.x1charData;
        var chIndex = MinimapCharRenderer._getChIndex(chCode);
        var outWidth = target.width * 4 /* RGBA_CHANNELS_CNT */;
        var backgroundR = backgroundColor.r;
        var backgroundG = backgroundColor.g;
        var backgroundB = backgroundColor.b;
        var deltaR = color.r - backgroundR;
        var deltaG = color.g - backgroundG;
        var deltaB = color.b - backgroundB;
        var dest = target.data;
        var sourceOffset = chIndex * 2 /* x1_CHAR_HEIGHT */ * 1 /* x1_CHAR_WIDTH */;
        var destOffset = dy * outWidth + dx * 4 /* RGBA_CHANNELS_CNT */;
        {
            var c = x1CharData[sourceOffset] / 255;
            dest[destOffset + 0] = backgroundR + deltaR * c;
            dest[destOffset + 1] = backgroundG + deltaG * c;
            dest[destOffset + 2] = backgroundB + deltaB * c;
        }
        destOffset += outWidth;
        {
            var c = x1CharData[sourceOffset + 1] / 255;
            dest[destOffset + 0] = backgroundR + deltaR * c;
            dest[destOffset + 1] = backgroundG + deltaG * c;
            dest[destOffset + 2] = backgroundB + deltaB * c;
        }
    };
    MinimapCharRenderer.prototype.x2BlockRenderChar = function (target, dx, dy, color, backgroundColor, useLighterFont) {
        if (dx + 2 /* x2_CHAR_WIDTH */ > target.width || dy + 4 /* x2_CHAR_HEIGHT */ > target.height) {
            console.warn('bad render request outside image data');
            return;
        }
        var outWidth = target.width * 4 /* RGBA_CHANNELS_CNT */;
        var c = 0.5;
        var backgroundR = backgroundColor.r;
        var backgroundG = backgroundColor.g;
        var backgroundB = backgroundColor.b;
        var deltaR = color.r - backgroundR;
        var deltaG = color.g - backgroundG;
        var deltaB = color.b - backgroundB;
        var colorR = backgroundR + deltaR * c;
        var colorG = backgroundG + deltaG * c;
        var colorB = backgroundB + deltaB * c;
        var dest = target.data;
        var destOffset = dy * outWidth + dx * 4 /* RGBA_CHANNELS_CNT */;
        {
            dest[destOffset + 0] = colorR;
            dest[destOffset + 1] = colorG;
            dest[destOffset + 2] = colorB;
        }
        {
            dest[destOffset + 4] = colorR;
            dest[destOffset + 5] = colorG;
            dest[destOffset + 6] = colorB;
        }
        destOffset += outWidth;
        {
            dest[destOffset + 0] = colorR;
            dest[destOffset + 1] = colorG;
            dest[destOffset + 2] = colorB;
        }
        {
            dest[destOffset + 4] = colorR;
            dest[destOffset + 5] = colorG;
            dest[destOffset + 6] = colorB;
        }
        destOffset += outWidth;
        {
            dest[destOffset + 0] = colorR;
            dest[destOffset + 1] = colorG;
            dest[destOffset + 2] = colorB;
        }
        {
            dest[destOffset + 4] = colorR;
            dest[destOffset + 5] = colorG;
            dest[destOffset + 6] = colorB;
        }
        destOffset += outWidth;
        {
            dest[destOffset + 0] = colorR;
            dest[destOffset + 1] = colorG;
            dest[destOffset + 2] = colorB;
        }
        {
            dest[destOffset + 4] = colorR;
            dest[destOffset + 5] = colorG;
            dest[destOffset + 6] = colorB;
        }
    };
    MinimapCharRenderer.prototype.x1BlockRenderChar = function (target, dx, dy, color, backgroundColor, useLighterFont) {
        if (dx + 1 /* x1_CHAR_WIDTH */ > target.width || dy + 2 /* x1_CHAR_HEIGHT */ > target.height) {
            console.warn('bad render request outside image data');
            return;
        }
        var outWidth = target.width * 4 /* RGBA_CHANNELS_CNT */;
        var c = 0.5;
        var backgroundR = backgroundColor.r;
        var backgroundG = backgroundColor.g;
        var backgroundB = backgroundColor.b;
        var deltaR = color.r - backgroundR;
        var deltaG = color.g - backgroundG;
        var deltaB = color.b - backgroundB;
        var colorR = backgroundR + deltaR * c;
        var colorG = backgroundG + deltaG * c;
        var colorB = backgroundB + deltaB * c;
        var dest = target.data;
        var destOffset = dy * outWidth + dx * 4 /* RGBA_CHANNELS_CNT */;
        {
            dest[destOffset + 0] = colorR;
            dest[destOffset + 1] = colorG;
            dest[destOffset + 2] = colorB;
        }
        destOffset += outWidth;
        {
            dest[destOffset + 0] = colorR;
            dest[destOffset + 1] = colorG;
            dest[destOffset + 2] = colorB;
        }
    };
    return MinimapCharRenderer;
}());
export { MinimapCharRenderer };
