"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var HandleGet_1 = require("./HandleGet");
var HandleSet_1 = require("./HandleSet");
var ColorTypes_1 = require("./ColorTypes");
var ColorConverters_1 = require("./ColorConverters");
__export(require("./ColorTypes"));
__export(require("./ColorConverters"));
__export(require("./regex"));
__export(require("./validators"));
__export(require("./utils"));
var Color = /** @class */ (function () {
    function Color(input) {
        this.Set(input);
    }
    Color.prototype.Get = function (type, options) {
        if (type !== undefined) {
            if (type.startsWith('hex')) {
                return HandleGet_1.HandleGetHex(type, this.color, options);
            }
            else {
                switch (type) {
                    case 'rgb':
                        return "rgb(" + Math.round(this.color.r * 255) + ", " + Math.round(this.color.g * 255) + ", " + Math.round(this.color.b * 255) + ")";
                    case 'rgba':
                        return "rgba(" + Math.round(this.color.r * 255) + ", " + Math.round(this.color.g * 255) + ", " + Math.round(this.color.b * 255) + ", " + this.color.a.toFixed(2).toString() + ")";
                    case 'object':
                        return this.color;
                    case 'hsv':
                        return ColorConverters_1.RGBToHSV(this.color);
                }
            }
        }
        else {
            return this.color;
        }
    };
    Color.prototype.Set = function (input) {
        if (typeof input === 'object') {
            this.color = new ColorTypes_1.RGBColor(input.r === undefined ? 1 : input.r > 1 ? input.r / 255 : input.r, input.g === undefined ? 1 : input.g > 1 ? input.g / 255 : input.g, input.b === undefined ? 1 : input.b > 1 ? input.b / 255 : input.b, input.a === undefined ? 1 : input.a > 1 ? input.a / 255 : input.a);
        }
        else if (typeof input === 'string') {
            var tempColor = HandleSet_1.ConvertString(input);
            this.color = tempColor === null ? this.color : tempColor;
        }
        else {
            this.color = new ColorTypes_1.RGBColor(0, 0, 0, 0);
        }
    };
    return Color;
}());
exports.default = Color;
