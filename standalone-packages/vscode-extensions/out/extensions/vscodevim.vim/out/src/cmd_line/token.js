"use strict";
// Tokens for the Vim command line.
Object.defineProperty(exports, "__esModule", { value: true });
var TokenType;
(function (TokenType) {
    TokenType[TokenType["Unknown"] = 0] = "Unknown";
    TokenType[TokenType["Eof"] = 1] = "Eof";
    TokenType[TokenType["LineNumber"] = 2] = "LineNumber";
    TokenType[TokenType["Dot"] = 3] = "Dot";
    TokenType[TokenType["Dollar"] = 4] = "Dollar";
    TokenType[TokenType["Percent"] = 5] = "Percent";
    TokenType[TokenType["Comma"] = 6] = "Comma";
    TokenType[TokenType["Plus"] = 7] = "Plus";
    TokenType[TokenType["Minus"] = 8] = "Minus";
    TokenType[TokenType["CommandName"] = 9] = "CommandName";
    TokenType[TokenType["CommandArgs"] = 10] = "CommandArgs";
    TokenType[TokenType["ForwardSearch"] = 11] = "ForwardSearch";
    TokenType[TokenType["ReverseSearch"] = 12] = "ReverseSearch";
    TokenType[TokenType["Offset"] = 13] = "Offset";
    /**
     * Marks
     *
     */
    TokenType[TokenType["SelectionFirstLine"] = 14] = "SelectionFirstLine";
    TokenType[TokenType["SelectionLastLine"] = 15] = "SelectionLastLine";
    TokenType[TokenType["Mark"] = 16] = "Mark";
})(TokenType = exports.TokenType || (exports.TokenType = {}));
class Token {
    constructor(type, content) {
        this.type = type;
        this.content = content;
    }
}
exports.Token = Token;

//# sourceMappingURL=token.js.map
