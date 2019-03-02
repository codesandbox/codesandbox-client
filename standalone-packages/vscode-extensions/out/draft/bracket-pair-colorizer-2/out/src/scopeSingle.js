"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ScopeType;
(function (ScopeType) {
    ScopeType[ScopeType["Ambiguous"] = 0] = "Ambiguous";
    ScopeType[ScopeType["Open"] = 1] = "Open";
    ScopeType[ScopeType["Close"] = 2] = "Close";
})(ScopeType = exports.ScopeType || (exports.ScopeType = {}));
class ScopeSingle {
    constructor(tokenName, type, key) {
        this.tokenName = tokenName;
        this.type = type;
        this.key = key;
    }
}
exports.default = ScopeSingle;
//# sourceMappingURL=scopeSingle.js.map