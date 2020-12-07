"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ColorConverters_1 = require("./ColorConverters");
var ColorTypes_1 = require("./ColorTypes");
function GetReadableTextColor(color) {
    if (typeof color === 'string') {
        var rgb = ColorConverters_1.StringToRGB(color);
        return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000 > 0.5 ? '#000' : '#fff';
    }
    else if (color instanceof ColorTypes_1.StringColor) {
        var rgb = ColorConverters_1.StringToRGB(color.color);
        return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000 > 0.5 ? '#000' : '#fff';
    }
    else if (color instanceof ColorTypes_1.RGBColor) {
        var isLong = color.b > 1 || color.g > 1 || color.r > 1;
        var v = isLong ? 255 : 1;
        return (color.r * 299 + color.g * 587 + color.b * 114) / 1000 > 0.5 ? new ColorTypes_1.RGBColor(0, 0, 0) : new ColorTypes_1.RGBColor(v, v, v);
    }
    else if (color instanceof ColorTypes_1.HSVColor) {
        var rgb = ColorConverters_1.HSVToRGB(color);
        return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000 > 0.5
            ? new ColorTypes_1.HSVColor(0, 0, 0)
            : new ColorTypes_1.HSVColor(0, 0, color.s > 1 || color.v > 1 ? 100 : 1);
    }
}
exports.GetReadableTextColor = GetReadableTextColor;
/**
 * Shifts the hue of the `HSVColor` by the Value
 */
function ShiftHue(hsv, value) {
    if (value > 360)
        value = value % 360;
    else if (value < 0)
        value = -(Math.abs(value) % 360);
    hsv.h = hsv.h + value <= 360 ? hsv.h + value : hsv.h + value - 360;
    return hsv;
}
exports.ShiftHue = ShiftHue;
