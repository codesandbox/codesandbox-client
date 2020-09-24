"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function HandleGetHex(type, color, options) {
    var isLong = color.b > 1 || color.g > 1 || color.r > 1;
    var alpha = Math.round(color.a > 1 ? color.a : color.a * 255).toString(16);
    var red = Math.round(isLong ? color.r : color.r * 255).toString(16);
    var green = Math.round(isLong ? color.g : color.g * 255).toString(16);
    var blue = Math.round(isLong ? color.b : color.b * 255).toString(16);
    if (options && options.UpperCaseHex) {
        alpha = alpha.toUpperCase();
        red = red.toUpperCase();
        green = green.toUpperCase();
        blue = blue.toUpperCase();
    }
    switch (type) {
        case 'hex':
            return "#" + (red.length === 1 ? '0' + red : red)
                .concat(green.length === 1 ? '0' + green : green)
                .concat(blue.length === 1 ? '0' + blue : blue)
                .concat(alpha.length === 1 ? '0' + alpha : alpha);
        case 'hex-short':
            return "#" + red
                .substring(0, 1)
                .concat(green.substring(0, 1))
                .concat(blue.substring(0, 1))
                .concat(alpha.substring(0, 1));
        case 'hex-without-alpha':
            return "#" + (red.length === 1 ? '0' + red : red)
                .concat(green.length === 1 ? '0' + green : green)
                .concat(blue.length === 1 ? '0' + blue : blue);
        case 'hex-without-alpha-short':
            return "#" + red
                .substring(0, 1)
                .concat(green.substring(0, 1))
                .concat(blue.substring(0, 1));
    }
}
exports.HandleGetHex = HandleGetHex;
