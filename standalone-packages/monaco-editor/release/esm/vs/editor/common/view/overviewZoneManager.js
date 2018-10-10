/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var ColorZone = /** @class */ (function () {
    function ColorZone(from, to, colorId) {
        this.from = from | 0;
        this.to = to | 0;
        this.colorId = colorId | 0;
    }
    ColorZone.compare = function (a, b) {
        if (a.colorId === b.colorId) {
            if (a.from === b.from) {
                return a.to - b.to;
            }
            return a.from - b.from;
        }
        return a.colorId - b.colorId;
    };
    return ColorZone;
}());
export { ColorZone };
/**
 * A zone in the overview ruler
 */
var OverviewRulerZone = /** @class */ (function () {
    function OverviewRulerZone(startLineNumber, endLineNumber, color) {
        this.startLineNumber = startLineNumber;
        this.endLineNumber = endLineNumber;
        this.color = color;
        this._colorZone = null;
    }
    OverviewRulerZone.compare = function (a, b) {
        if (a.color === b.color) {
            if (a.startLineNumber === b.startLineNumber) {
                return a.endLineNumber - b.endLineNumber;
            }
            return a.startLineNumber - b.startLineNumber;
        }
        return a.color < b.color ? -1 : 1;
    };
    OverviewRulerZone.prototype.setColorZone = function (colorZone) {
        this._colorZone = colorZone;
    };
    OverviewRulerZone.prototype.getColorZones = function () {
        return this._colorZone;
    };
    return OverviewRulerZone;
}());
export { OverviewRulerZone };
var OverviewZoneManager = /** @class */ (function () {
    function OverviewZoneManager(getVerticalOffsetForLine) {
        this._getVerticalOffsetForLine = getVerticalOffsetForLine;
        this._zones = [];
        this._colorZonesInvalid = false;
        this._lineHeight = 0;
        this._domWidth = 0;
        this._domHeight = 0;
        this._outerHeight = 0;
        this._pixelRatio = 1;
        this._lastAssignedId = 0;
        this._color2Id = Object.create(null);
        this._id2Color = [];
    }
    OverviewZoneManager.prototype.getId2Color = function () {
        return this._id2Color;
    };
    OverviewZoneManager.prototype.setZones = function (newZones) {
        this._zones = newZones;
        this._zones.sort(OverviewRulerZone.compare);
    };
    OverviewZoneManager.prototype.setLineHeight = function (lineHeight) {
        if (this._lineHeight === lineHeight) {
            return false;
        }
        this._lineHeight = lineHeight;
        this._colorZonesInvalid = true;
        return true;
    };
    OverviewZoneManager.prototype.setPixelRatio = function (pixelRatio) {
        this._pixelRatio = pixelRatio;
        this._colorZonesInvalid = true;
    };
    OverviewZoneManager.prototype.getDOMWidth = function () {
        return this._domWidth;
    };
    OverviewZoneManager.prototype.getCanvasWidth = function () {
        return this._domWidth * this._pixelRatio;
    };
    OverviewZoneManager.prototype.setDOMWidth = function (width) {
        if (this._domWidth === width) {
            return false;
        }
        this._domWidth = width;
        this._colorZonesInvalid = true;
        return true;
    };
    OverviewZoneManager.prototype.getDOMHeight = function () {
        return this._domHeight;
    };
    OverviewZoneManager.prototype.getCanvasHeight = function () {
        return this._domHeight * this._pixelRatio;
    };
    OverviewZoneManager.prototype.setDOMHeight = function (height) {
        if (this._domHeight === height) {
            return false;
        }
        this._domHeight = height;
        this._colorZonesInvalid = true;
        return true;
    };
    OverviewZoneManager.prototype.getOuterHeight = function () {
        return this._outerHeight;
    };
    OverviewZoneManager.prototype.setOuterHeight = function (outerHeight) {
        if (this._outerHeight === outerHeight) {
            return false;
        }
        this._outerHeight = outerHeight;
        this._colorZonesInvalid = true;
        return true;
    };
    OverviewZoneManager.prototype.resolveColorZones = function () {
        var colorZonesInvalid = this._colorZonesInvalid;
        var lineHeight = Math.floor(this._lineHeight); // @perf
        var totalHeight = Math.floor(this.getCanvasHeight()); // @perf
        var outerHeight = Math.floor(this._outerHeight); // @perf
        var heightRatio = totalHeight / outerHeight;
        var halfMinimumHeight = Math.floor(4 /* MINIMUM_HEIGHT */ * this._pixelRatio / 2);
        var allColorZones = [];
        for (var i = 0, len = this._zones.length; i < len; i++) {
            var zone = this._zones[i];
            if (!colorZonesInvalid) {
                var colorZone_1 = zone.getColorZones();
                if (colorZone_1) {
                    allColorZones.push(colorZone_1);
                    continue;
                }
            }
            var y1 = Math.floor(heightRatio * (this._getVerticalOffsetForLine(zone.startLineNumber)));
            var y2 = Math.floor(heightRatio * (this._getVerticalOffsetForLine(zone.endLineNumber) + lineHeight));
            var ycenter = Math.floor((y1 + y2) / 2);
            var halfHeight = (y2 - ycenter);
            if (halfHeight < halfMinimumHeight) {
                halfHeight = halfMinimumHeight;
            }
            if (ycenter - halfHeight < 0) {
                ycenter = halfHeight;
            }
            if (ycenter + halfHeight > totalHeight) {
                ycenter = totalHeight - halfHeight;
            }
            var color = zone.color;
            var colorId = this._color2Id[color];
            if (!colorId) {
                colorId = (++this._lastAssignedId);
                this._color2Id[color] = colorId;
                this._id2Color[colorId] = color;
            }
            var colorZone = new ColorZone(ycenter - halfHeight, ycenter + halfHeight, colorId);
            zone.setColorZone(colorZone);
            allColorZones.push(colorZone);
        }
        this._colorZonesInvalid = false;
        allColorZones.sort(ColorZone.compare);
        return allColorZones;
    };
    return OverviewZoneManager;
}());
export { OverviewZoneManager };
