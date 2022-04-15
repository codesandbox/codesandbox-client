"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var validators_1 = require("./validators");
var ColorTypes_1 = require("./ColorTypes");
function ConvertString(input, return255, alpha255) {
    if (validators_1.isValidStringColor(input)) {
        if (input.startsWith('#')) {
            return HandleConvertHexString(input, return255, alpha255);
        }
        else if (input.startsWith('rgb')) {
            return HandleConvertRgbString(input, return255);
        }
    }
}
exports.ConvertString = ConvertString;
/**
 * **assumes that the input is valid**
 */
function HandleConvertHexString(text, return255, alpha255) {
    var color = { red: 0, green: 0, blue: 0, alpha: 0 };
    var raw = text.replace('#', '');
    var length = raw.length;
    var modulo = length % 3;
    color.red =
        length > 4 ? parseInt(raw.substring(0, 2), 16) : parseInt(raw.substring(0, 1).concat(raw.substring(0, 1)), 16);
    color.green =
        length > 4 ? parseInt(raw.substring(2, 4), 16) : parseInt(raw.substring(1, 2).concat(raw.substring(1, 2)), 16);
    color.blue =
        length > 4 ? parseInt(raw.substring(4, 6), 16) : parseInt(raw.substring(2, 3).concat(raw.substring(2, 3)), 16);
    if (modulo) {
        color.alpha =
            length > 4
                ? parseInt(raw.substring(length - modulo, length), 16)
                : parseInt(raw.substring(length - modulo, length).concat(raw.substring(length - modulo, length)), 16);
        color.alpha = alpha255 ? color.alpha : color.alpha / 255;
    }
    else {
        color.alpha = 1;
    }
    return new ColorTypes_1.RGBColor(return255 ? color.red : color.red / 255, return255 ? color.green : color.green / 255, return255 ? color.blue : color.blue / 255, color.alpha);
}
exports.HandleConvertHexString = HandleConvertHexString;
/**
 * **assumes that the input is valid**
 */
function HandleConvertRgbString(text, return255) {
    var split = text.split(/,|\b /g);
    return new ColorTypes_1.RGBColor(parseInt(split[0].replace(/\D/g, '')) / (return255 ? 1 : 255), parseInt(split[1].replace(/\D/g, '')) / (return255 ? 1 : 255), parseInt(split[2].replace(/\D/g, '')) / (return255 ? 1 : 255), split[3] ? parseFloat(split[3].replace(/[^\.\d]/g, '')) : 1);
}
