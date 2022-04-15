"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isValidHex(text) {
    return /^#[a-fA-F\d]{3,4}$|^#[a-fA-F\d]{6}$|^#[a-fA-F\d]{8}$/.test(text);
}
exports.isValidHex = isValidHex;
function isValidRGB(text) {
    return /rgba?\([\d. ]+[, ][\d. ]+[, ][\d. ]+([, ][\d. ]+)?\)/.test(text);
}
exports.isValidRGB = isValidRGB;
