"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ColorTypes_1 = require("./ColorTypes");
var HandleSet_1 = require("./HandleSet");
var validators_1 = require("./validators");
var HandleGet_1 = require("./HandleGet");
var utils_1 = require("./utils");
/**
 * Takes an `RGBColor` and converts it to `HSVColor`
 */
function RGBToHSV(color, is255) {
    var isLong = is255 ? true : color.b > 1 || color.g > 1 || color.r > 1;
    if (isLong) {
        color = { a: color.a, b: color.b / 255, g: color.g / 255, r: color.r / 255 };
    }
    var cMax = Math.max(color.r, color.g, color.b);
    var cMin = Math.min(color.r, color.g, color.b);
    var diff = cMax - cMin;
    // Hue
    var hue = cMax === 1 && cMin === 1
        ? 0
        : cMax === 0 && cMin === 0
            ? 0
            : cMax === color.r
                ? (60 * ((color.g - color.b) / diff) + 360) % 360
                : cMax === color.g
                    ? (60 * ((color.b - color.r) / diff) + 120) % 360
                    : cMax === color.b
                        ? (60 * ((color.r - color.g) / diff) + 240) % 360
                        : 0;
    // Saturation
    var saturation;
    //
    if (cMax === 0) {
        saturation = 0;
    }
    else {
        saturation = (diff / cMax) * 100;
    }
    return new ColorTypes_1.HSVColor(hue ? hue : 0, saturation, cMax * 100, color.a);
}
exports.RGBToHSV = RGBToHSV;
/**
 * Takes an `HSVColor` and converts it to `RGBColor`
 */
function HSVToRGB(hsv, is100) {
    var isLong = is100 ? true : hsv.s > 1 || hsv.v > 1;
    if (isLong) {
        hsv = { a: hsv.a, h: hsv.h, s: hsv.s / 100, v: hsv.v / 100 };
    }
    var f = function (n, k) {
        if (k === void 0) { k = (n + hsv.h / 60) % 6; }
        return hsv.v - hsv.v * hsv.s * Math.max(Math.min(k, 4 - k, 1), 0);
    };
    if (isLong) {
        return new ColorTypes_1.RGBColor(f(5) * 255, f(3) * 255, f(1) * 255, hsv.a);
    }
    else {
        return new ColorTypes_1.RGBColor(f(5), f(3), f(1), hsv.a);
    }
}
exports.HSVToRGB = HSVToRGB;
/**
 * Takes an `StringColor` and converts it to `RGBColor`,
 * If input string is invalid `null` will be returned.
 */
function StringToRGB(input, return255, alpha255) {
    input = utils_1.convertCssColorToHex(input);
    if (validators_1.isValidStringColor(input)) {
        return HandleSet_1.ConvertString(input, return255, alpha255);
    }
    return null;
}
exports.StringToRGB = StringToRGB;
/**
 * Takes an `StringColor` and converts it to `HSVColor`,
 * If input string is invalid `null` will be returned.
 */
function StringToHVS(input, return255, alpha255) {
    input = utils_1.convertCssColorToHex(input);
    if (validators_1.isValidStringColor(input)) {
        return RGBToHSV(HandleSet_1.ConvertString(input, return255, alpha255));
    }
    return null;
}
exports.StringToHVS = StringToHVS;
/**
 * Takes an `HSVColor` and converts it to `String` (HEX Format)
 */
function HSVToHEX(hsv, options) {
    if (hsv.s > 1 || hsv.v > 1 || (options && options.isLong)) {
        hsv.s = hsv.s / 100;
        hsv.v = hsv.v / 100;
    }
    var f = function (n, k) {
        if (k === void 0) { k = (n + hsv.h / 60) % 6; }
        return hsv.v - hsv.v * hsv.s * Math.max(Math.min(k, 4 - k, 1), 0);
    };
    return HandleGet_1.HandleGetHex(options && options.type ? options.type : 'hex', {
        r: f(5),
        g: f(3),
        b: f(1),
        a: hsv.a
    });
}
exports.HSVToHEX = HSVToHEX;
/**
 * Takes an `RGBColor` and converts it to `String` (HEX Format)
 */
function RGBToHEX(color, type) {
    return HandleGet_1.HandleGetHex(type ? type : 'hex', {
        r: color.r,
        g: color.g,
        b: color.b,
        a: color.a
    });
}
exports.RGBToHEX = RGBToHEX;
