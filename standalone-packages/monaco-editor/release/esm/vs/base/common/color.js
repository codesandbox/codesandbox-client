/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
function roundFloat(number, decimalPoints) {
    var decimal = Math.pow(10, decimalPoints);
    return Math.round(number * decimal) / decimal;
}
var RGBA = /** @class */ (function () {
    function RGBA(r, g, b, a) {
        if (a === void 0) { a = 1; }
        this.r = Math.min(255, Math.max(0, r)) | 0;
        this.g = Math.min(255, Math.max(0, g)) | 0;
        this.b = Math.min(255, Math.max(0, b)) | 0;
        this.a = roundFloat(Math.max(Math.min(1, a), 0), 3);
    }
    RGBA.equals = function (a, b) {
        return a.r === b.r && a.g === b.g && a.b === b.b && a.a === b.a;
    };
    return RGBA;
}());
export { RGBA };
var HSLA = /** @class */ (function () {
    function HSLA(h, s, l, a) {
        this.h = Math.max(Math.min(360, h), 0) | 0;
        this.s = roundFloat(Math.max(Math.min(1, s), 0), 3);
        this.l = roundFloat(Math.max(Math.min(1, l), 0), 3);
        this.a = roundFloat(Math.max(Math.min(1, a), 0), 3);
    }
    HSLA.equals = function (a, b) {
        return a.h === b.h && a.s === b.s && a.l === b.l && a.a === b.a;
    };
    /**
     * Converts an RGB color value to HSL. Conversion formula
     * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
     * Assumes r, g, and b are contained in the set [0, 255] and
     * returns h in the set [0, 360], s, and l in the set [0, 1].
     */
    HSLA.fromRGBA = function (rgba) {
        var r = rgba.r / 255;
        var g = rgba.g / 255;
        var b = rgba.b / 255;
        var a = rgba.a;
        var max = Math.max(r, g, b);
        var min = Math.min(r, g, b);
        var h = 0;
        var s = 0;
        var l = (min + max) / 2;
        var chroma = max - min;
        if (chroma > 0) {
            s = Math.min((l <= 0.5 ? chroma / (2 * l) : chroma / (2 - (2 * l))), 1);
            switch (max) {
                case r:
                    h = (g - b) / chroma + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / chroma + 2;
                    break;
                case b:
                    h = (r - g) / chroma + 4;
                    break;
            }
            h *= 60;
            h = Math.round(h);
        }
        return new HSLA(h, s, l, a);
    };
    HSLA._hue2rgb = function (p, q, t) {
        if (t < 0) {
            t += 1;
        }
        if (t > 1) {
            t -= 1;
        }
        if (t < 1 / 6) {
            return p + (q - p) * 6 * t;
        }
        if (t < 1 / 2) {
            return q;
        }
        if (t < 2 / 3) {
            return p + (q - p) * (2 / 3 - t) * 6;
        }
        return p;
    };
    /**
     * Converts an HSL color value to RGB. Conversion formula
     * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
     * Assumes h in the set [0, 360] s, and l are contained in the set [0, 1] and
     * returns r, g, and b in the set [0, 255].
     */
    HSLA.toRGBA = function (hsla) {
        var h = hsla.h / 360;
        var s = hsla.s, l = hsla.l, a = hsla.a;
        var r, g, b;
        if (s === 0) {
            r = g = b = l; // achromatic
        }
        else {
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = HSLA._hue2rgb(p, q, h + 1 / 3);
            g = HSLA._hue2rgb(p, q, h);
            b = HSLA._hue2rgb(p, q, h - 1 / 3);
        }
        return new RGBA(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), a);
    };
    return HSLA;
}());
export { HSLA };
var HSVA = /** @class */ (function () {
    function HSVA(h, s, v, a) {
        this.h = Math.max(Math.min(360, h), 0) | 0;
        this.s = roundFloat(Math.max(Math.min(1, s), 0), 3);
        this.v = roundFloat(Math.max(Math.min(1, v), 0), 3);
        this.a = roundFloat(Math.max(Math.min(1, a), 0), 3);
    }
    HSVA.equals = function (a, b) {
        return a.h === b.h && a.s === b.s && a.v === b.v && a.a === b.a;
    };
    // from http://www.rapidtables.com/convert/color/rgb-to-hsv.htm
    HSVA.fromRGBA = function (rgba) {
        var r = rgba.r / 255;
        var g = rgba.g / 255;
        var b = rgba.b / 255;
        var cmax = Math.max(r, g, b);
        var cmin = Math.min(r, g, b);
        var delta = cmax - cmin;
        var s = cmax === 0 ? 0 : (delta / cmax);
        var m;
        if (delta === 0) {
            m = 0;
        }
        else if (cmax === r) {
            m = ((((g - b) / delta) % 6) + 6) % 6;
        }
        else if (cmax === g) {
            m = ((b - r) / delta) + 2;
        }
        else {
            m = ((r - g) / delta) + 4;
        }
        return new HSVA(Math.round(m * 60), s, cmax, rgba.a);
    };
    // from http://www.rapidtables.com/convert/color/hsv-to-rgb.htm
    HSVA.toRGBA = function (hsva) {
        var h = hsva.h, s = hsva.s, v = hsva.v, a = hsva.a;
        var c = v * s;
        var x = c * (1 - Math.abs((h / 60) % 2 - 1));
        var m = v - c;
        var _a = [0, 0, 0], r = _a[0], g = _a[1], b = _a[2];
        if (h < 60) {
            r = c;
            g = x;
        }
        else if (h < 120) {
            r = x;
            g = c;
        }
        else if (h < 180) {
            g = c;
            b = x;
        }
        else if (h < 240) {
            g = x;
            b = c;
        }
        else if (h < 300) {
            r = x;
            b = c;
        }
        else if (h < 360) {
            r = c;
            b = x;
        }
        r = Math.round((r + m) * 255);
        g = Math.round((g + m) * 255);
        b = Math.round((b + m) * 255);
        return new RGBA(r, g, b, a);
    };
    return HSVA;
}());
export { HSVA };
var Color = /** @class */ (function () {
    function Color(arg) {
        if (!arg) {
            throw new Error('Color needs a value');
        }
        else if (arg instanceof RGBA) {
            this.rgba = arg;
        }
        else if (arg instanceof HSLA) {
            this._hsla = arg;
            this.rgba = HSLA.toRGBA(arg);
        }
        else if (arg instanceof HSVA) {
            this._hsva = arg;
            this.rgba = HSVA.toRGBA(arg);
        }
        else {
            throw new Error('Invalid color ctor argument');
        }
    }
    Color.fromHex = function (hex) {
        return Color.Format.CSS.parseHex(hex) || Color.red;
    };
    Object.defineProperty(Color.prototype, "hsla", {
        get: function () {
            if (this._hsla) {
                return this._hsla;
            }
            else {
                return HSLA.fromRGBA(this.rgba);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "hsva", {
        get: function () {
            if (this._hsva) {
                return this._hsva;
            }
            return HSVA.fromRGBA(this.rgba);
        },
        enumerable: true,
        configurable: true
    });
    Color.prototype.equals = function (other) {
        return !!other && RGBA.equals(this.rgba, other.rgba) && HSLA.equals(this.hsla, other.hsla) && HSVA.equals(this.hsva, other.hsva);
    };
    /**
     * http://www.w3.org/TR/WCAG20/#relativeluminancedef
     * Returns the number in the set [0, 1]. O => Darkest Black. 1 => Lightest white.
     */
    Color.prototype.getRelativeLuminance = function () {
        var R = Color._relativeLuminanceForComponent(this.rgba.r);
        var G = Color._relativeLuminanceForComponent(this.rgba.g);
        var B = Color._relativeLuminanceForComponent(this.rgba.b);
        var luminance = 0.2126 * R + 0.7152 * G + 0.0722 * B;
        return roundFloat(luminance, 4);
    };
    Color._relativeLuminanceForComponent = function (color) {
        var c = color / 255;
        return (c <= 0.03928) ? c / 12.92 : Math.pow(((c + 0.055) / 1.055), 2.4);
    };
    /**
     * http://www.w3.org/TR/WCAG20/#contrast-ratiodef
     * Returns the contrast ration number in the set [1, 21].
     */
    Color.prototype.getContrastRatio = function (another) {
        var lum1 = this.getRelativeLuminance();
        var lum2 = another.getRelativeLuminance();
        return lum1 > lum2 ? (lum1 + 0.05) / (lum2 + 0.05) : (lum2 + 0.05) / (lum1 + 0.05);
    };
    /**
     *	http://24ways.org/2010/calculating-color-contrast
     *  Return 'true' if darker color otherwise 'false'
     */
    Color.prototype.isDarker = function () {
        var yiq = (this.rgba.r * 299 + this.rgba.g * 587 + this.rgba.b * 114) / 1000;
        return yiq < 128;
    };
    /**
     *	http://24ways.org/2010/calculating-color-contrast
     *  Return 'true' if lighter color otherwise 'false'
     */
    Color.prototype.isLighter = function () {
        var yiq = (this.rgba.r * 299 + this.rgba.g * 587 + this.rgba.b * 114) / 1000;
        return yiq >= 128;
    };
    Color.prototype.isLighterThan = function (another) {
        var lum1 = this.getRelativeLuminance();
        var lum2 = another.getRelativeLuminance();
        return lum1 > lum2;
    };
    Color.prototype.isDarkerThan = function (another) {
        var lum1 = this.getRelativeLuminance();
        var lum2 = another.getRelativeLuminance();
        return lum1 < lum2;
    };
    Color.prototype.lighten = function (factor) {
        return new Color(new HSLA(this.hsla.h, this.hsla.s, this.hsla.l + this.hsla.l * factor, this.hsla.a));
    };
    Color.prototype.darken = function (factor) {
        return new Color(new HSLA(this.hsla.h, this.hsla.s, this.hsla.l - this.hsla.l * factor, this.hsla.a));
    };
    Color.prototype.transparent = function (factor) {
        var _a = this.rgba, r = _a.r, g = _a.g, b = _a.b, a = _a.a;
        return new Color(new RGBA(r, g, b, a * factor));
    };
    Color.prototype.isTransparent = function () {
        return this.rgba.a === 0;
    };
    Color.prototype.isOpaque = function () {
        return this.rgba.a === 1;
    };
    Color.prototype.opposite = function () {
        return new Color(new RGBA(255 - this.rgba.r, 255 - this.rgba.g, 255 - this.rgba.b, this.rgba.a));
    };
    Color.prototype.blend = function (c) {
        var rgba = c.rgba;
        // Convert to 0..1 opacity
        var thisA = this.rgba.a;
        var colorA = rgba.a;
        var a = thisA + colorA * (1 - thisA);
        if (a < 1.0e-6) {
            return Color.transparent;
        }
        var r = this.rgba.r * thisA / a + rgba.r * colorA * (1 - thisA) / a;
        var g = this.rgba.g * thisA / a + rgba.g * colorA * (1 - thisA) / a;
        var b = this.rgba.b * thisA / a + rgba.b * colorA * (1 - thisA) / a;
        return new Color(new RGBA(r, g, b, a));
    };
    Color.prototype.flatten = function () {
        var backgrounds = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            backgrounds[_i] = arguments[_i];
        }
        var background = backgrounds.reduceRight(function (accumulator, color) {
            return Color._flatten(color, accumulator);
        });
        return Color._flatten(this, background);
    };
    Color._flatten = function (foreground, background) {
        var backgroundAlpha = 1 - foreground.rgba.a;
        return new Color(new RGBA(backgroundAlpha * background.rgba.r + foreground.rgba.a * foreground.rgba.r, backgroundAlpha * background.rgba.g + foreground.rgba.a * foreground.rgba.g, backgroundAlpha * background.rgba.b + foreground.rgba.a * foreground.rgba.b));
    };
    Color.prototype.toString = function () {
        return Color.Format.CSS.format(this);
    };
    Color.getLighterColor = function (of, relative, factor) {
        if (of.isLighterThan(relative)) {
            return of;
        }
        factor = factor ? factor : 0.5;
        var lum1 = of.getRelativeLuminance();
        var lum2 = relative.getRelativeLuminance();
        factor = factor * (lum2 - lum1) / lum2;
        return of.lighten(factor);
    };
    Color.getDarkerColor = function (of, relative, factor) {
        if (of.isDarkerThan(relative)) {
            return of;
        }
        factor = factor ? factor : 0.5;
        var lum1 = of.getRelativeLuminance();
        var lum2 = relative.getRelativeLuminance();
        factor = factor * (lum1 - lum2) / lum1;
        return of.darken(factor);
    };
    Color.white = new Color(new RGBA(255, 255, 255, 1));
    Color.black = new Color(new RGBA(0, 0, 0, 1));
    Color.red = new Color(new RGBA(255, 0, 0, 1));
    Color.blue = new Color(new RGBA(0, 0, 255, 1));
    Color.green = new Color(new RGBA(0, 255, 0, 1));
    Color.cyan = new Color(new RGBA(0, 255, 255, 1));
    Color.lightgrey = new Color(new RGBA(211, 211, 211, 1));
    Color.transparent = new Color(new RGBA(0, 0, 0, 0));
    return Color;
}());
export { Color };
(function (Color) {
    var Format;
    (function (Format) {
        var CSS;
        (function (CSS) {
            function formatRGB(color) {
                if (color.rgba.a === 1) {
                    return "rgb(" + color.rgba.r + ", " + color.rgba.g + ", " + color.rgba.b + ")";
                }
                return Color.Format.CSS.formatRGBA(color);
            }
            CSS.formatRGB = formatRGB;
            function formatRGBA(color) {
                return "rgba(" + color.rgba.r + ", " + color.rgba.g + ", " + color.rgba.b + ", " + +(color.rgba.a).toFixed(2) + ")";
            }
            CSS.formatRGBA = formatRGBA;
            function formatHSL(color) {
                if (color.hsla.a === 1) {
                    return "hsl(" + color.hsla.h + ", " + (color.hsla.s * 100).toFixed(2) + "%, " + (color.hsla.l * 100).toFixed(2) + "%)";
                }
                return Color.Format.CSS.formatHSLA(color);
            }
            CSS.formatHSL = formatHSL;
            function formatHSLA(color) {
                return "hsla(" + color.hsla.h + ", " + (color.hsla.s * 100).toFixed(2) + "%, " + (color.hsla.l * 100).toFixed(2) + "%, " + color.hsla.a.toFixed(2) + ")";
            }
            CSS.formatHSLA = formatHSLA;
            function _toTwoDigitHex(n) {
                var r = n.toString(16);
                return r.length !== 2 ? '0' + r : r;
            }
            /**
             * Formats the color as #RRGGBB
             */
            function formatHex(color) {
                return "#" + _toTwoDigitHex(color.rgba.r) + _toTwoDigitHex(color.rgba.g) + _toTwoDigitHex(color.rgba.b);
            }
            CSS.formatHex = formatHex;
            /**
             * Formats the color as #RRGGBBAA
             * If 'compact' is set, colors without transparancy will be printed as #RRGGBB
             */
            function formatHexA(color, compact) {
                if (compact === void 0) { compact = false; }
                if (compact && color.rgba.a === 1) {
                    return Color.Format.CSS.formatHex(color);
                }
                return "#" + _toTwoDigitHex(color.rgba.r) + _toTwoDigitHex(color.rgba.g) + _toTwoDigitHex(color.rgba.b) + _toTwoDigitHex(Math.round(color.rgba.a * 255));
            }
            CSS.formatHexA = formatHexA;
            /**
             * The default format will use HEX if opaque and RGBA otherwise.
             */
            function format(color) {
                if (!color) {
                    return null;
                }
                if (color.isOpaque()) {
                    return Color.Format.CSS.formatHex(color);
                }
                return Color.Format.CSS.formatRGBA(color);
            }
            CSS.format = format;
            /**
             * Converts an Hex color value to a Color.
             * returns r, g, and b are contained in the set [0, 255]
             * @param hex string (#RGB, #RGBA, #RRGGBB or #RRGGBBAA).
             */
            function parseHex(hex) {
                if (!hex) {
                    // Invalid color
                    return null;
                }
                var length = hex.length;
                if (length === 0) {
                    // Invalid color
                    return null;
                }
                if (hex.charCodeAt(0) !== 35 /* Hash */) {
                    // Does not begin with a #
                    return null;
                }
                if (length === 7) {
                    // #RRGGBB format
                    var r = 16 * _parseHexDigit(hex.charCodeAt(1)) + _parseHexDigit(hex.charCodeAt(2));
                    var g = 16 * _parseHexDigit(hex.charCodeAt(3)) + _parseHexDigit(hex.charCodeAt(4));
                    var b = 16 * _parseHexDigit(hex.charCodeAt(5)) + _parseHexDigit(hex.charCodeAt(6));
                    return new Color(new RGBA(r, g, b, 1));
                }
                if (length === 9) {
                    // #RRGGBBAA format
                    var r = 16 * _parseHexDigit(hex.charCodeAt(1)) + _parseHexDigit(hex.charCodeAt(2));
                    var g = 16 * _parseHexDigit(hex.charCodeAt(3)) + _parseHexDigit(hex.charCodeAt(4));
                    var b = 16 * _parseHexDigit(hex.charCodeAt(5)) + _parseHexDigit(hex.charCodeAt(6));
                    var a = 16 * _parseHexDigit(hex.charCodeAt(7)) + _parseHexDigit(hex.charCodeAt(8));
                    return new Color(new RGBA(r, g, b, a / 255));
                }
                if (length === 4) {
                    // #RGB format
                    var r = _parseHexDigit(hex.charCodeAt(1));
                    var g = _parseHexDigit(hex.charCodeAt(2));
                    var b = _parseHexDigit(hex.charCodeAt(3));
                    return new Color(new RGBA(16 * r + r, 16 * g + g, 16 * b + b));
                }
                if (length === 5) {
                    // #RGBA format
                    var r = _parseHexDigit(hex.charCodeAt(1));
                    var g = _parseHexDigit(hex.charCodeAt(2));
                    var b = _parseHexDigit(hex.charCodeAt(3));
                    var a = _parseHexDigit(hex.charCodeAt(4));
                    return new Color(new RGBA(16 * r + r, 16 * g + g, 16 * b + b, (16 * a + a) / 255));
                }
                // Invalid color
                return null;
            }
            CSS.parseHex = parseHex;
            function _parseHexDigit(charCode) {
                switch (charCode) {
                    case 48 /* Digit0 */: return 0;
                    case 49 /* Digit1 */: return 1;
                    case 50 /* Digit2 */: return 2;
                    case 51 /* Digit3 */: return 3;
                    case 52 /* Digit4 */: return 4;
                    case 53 /* Digit5 */: return 5;
                    case 54 /* Digit6 */: return 6;
                    case 55 /* Digit7 */: return 7;
                    case 56 /* Digit8 */: return 8;
                    case 57 /* Digit9 */: return 9;
                    case 97 /* a */: return 10;
                    case 65 /* A */: return 10;
                    case 98 /* b */: return 11;
                    case 66 /* B */: return 11;
                    case 99 /* c */: return 12;
                    case 67 /* C */: return 12;
                    case 100 /* d */: return 13;
                    case 68 /* D */: return 13;
                    case 101 /* e */: return 14;
                    case 69 /* E */: return 14;
                    case 102 /* f */: return 15;
                    case 70 /* F */: return 15;
                }
                return 0;
            }
        })(CSS = Format.CSS || (Format.CSS = {}));
    })(Format = Color.Format || (Color.Format = {}));
})(Color || (Color = {}));
