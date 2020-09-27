"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var validators_1 = require("./validators");
/**
 * Represents a color in the rgb(a) format.
 *
 *
 * Range `[0 - 1]`
 */
var RGBColor = /** @class */ (function () {
    function RGBColor(r, g, b, a) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a !== undefined ? a : 1;
    }
    return RGBColor;
}());
exports.RGBColor = RGBColor;
/**
 * Represents a color in the hsv(a) format.
 *
 *
 * Range `[h 0 - 360, v/s/a 0 - 1]`
 */
var HSVColor = /** @class */ (function () {
    function HSVColor(h, s, v, a) {
        this.h = h;
        this.s = s;
        this.v = v;
        this.a = a !== undefined ? a : 1;
    }
    return HSVColor;
}());
exports.HSVColor = HSVColor;
/**
 * Represents a color in a string format.
 * Valid strings are `#000 | #0000 | #000000 | #00000000`
 * Or `rgb(0, 0, 0, 0) | rgba(0, 0, 0, 0, 0)` Range [rgb 0-255, a: 0-1]
 *
 */
var StringColor = /** @class */ (function () {
    function StringColor(color) {
        var newColor = validators_1.isValidStringColor(color);
        this.color = newColor !== null ? newColor : '#0000';
    }
    return StringColor;
}());
exports.StringColor = StringColor;
