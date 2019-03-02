"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TextLine {
    constructor(ruleStack, lineState, index) {
        this.lineState = lineState;
        this.ruleStack = ruleStack;
        this.index = index;
    }
    getRuleStack() {
        return this.ruleStack;
    }
    // Return a copy of the line while mantaining bracket state. colorRanges is not mantained.
    cloneState() {
        return this.lineState.cloneState();
    }
    getBracketHash() {
        return this.lineState.getBracketHash();
    }
    AddToken(currentChar, index, key, open) {
        this.lineState.addBracket(key, currentChar, index, this.index, open);
    }
    getClosingBracket(position) {
        return this.lineState.getClosingBracket(position);
    }
    offset(startIndex, amount) {
        this.lineState.offset(startIndex, amount);
    }
    getAllBrackets() {
        return this.lineState.getAllBrackets();
    }
}
exports.default = TextLine;
//# sourceMappingURL=textLine.js.map