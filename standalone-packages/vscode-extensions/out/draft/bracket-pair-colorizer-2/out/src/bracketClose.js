"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bracket_1 = require("./bracket");
class BracketClose extends bracket_1.default {
    constructor(token, openBracket) {
        super(token, openBracket.color);
        this.openBracket = openBracket;
    }
}
exports.default = BracketClose;
//# sourceMappingURL=bracketClose.js.map