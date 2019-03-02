"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TokenMatch {
    constructor(startsWith, suffix) {
        this.startsWith = startsWith;
        if (suffix) {
            this.type = startsWith + suffix;
        }
        else {
            this.type = startsWith;
        }
    }
}
exports.default = TokenMatch;
//# sourceMappingURL=tokenMatch.js.map