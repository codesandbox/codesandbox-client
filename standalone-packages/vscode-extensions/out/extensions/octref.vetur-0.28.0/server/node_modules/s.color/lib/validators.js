"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var regex_1 = require("./regex");
function isValidStringColor(input) {
    if (regex_1.isValidHex(input) || regex_1.isValidRGB(input)) {
        return input;
    }
    else {
        console.warn('[S.Color] Invalid String Input:', input);
        return null;
    }
}
exports.isValidStringColor = isValidStringColor;
