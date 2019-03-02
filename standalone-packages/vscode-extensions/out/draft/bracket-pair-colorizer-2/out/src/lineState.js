"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colorMode_1 = require("./colorMode");
const multipleIndexes_1 = require("./multipleIndexes");
const singularIndex_1 = require("./singularIndex");
const token_1 = require("./token");
class LineState {
    constructor(settings, languageConfig, previousState) {
        this.settings = settings;
        this.languageConfig = languageConfig;
        if (previousState !== undefined) {
            this.bracketManager = previousState.colorIndexes;
            this.previousBracketColor = previousState.previousBracketColor;
        }
        else {
            switch (settings.colorMode) {
                case colorMode_1.default.Consecutive:
                    this.bracketManager = new singularIndex_1.default(settings);
                    break;
                case colorMode_1.default.Independent:
                    this.bracketManager = new multipleIndexes_1.default(settings, languageConfig);
                    break;
                default: throw new RangeError("Not implemented enum value");
            }
        }
    }
    getBracketHash() {
        return this.bracketManager.getHash();
    }
    cloneState() {
        const clone = {
            colorIndexes: this.bracketManager.copyCumulativeState(),
            previousBracketColor: this.previousBracketColor,
        };
        return new LineState(this.settings, this.languageConfig, clone);
    }
    getClosingBracket(position) {
        return this.bracketManager.getClosingBracket(position);
    }
    offset(startIndex, amount) {
        this.bracketManager.offset(startIndex, amount);
    }
    addBracket(type, character, beginIndex, lineIndex, open) {
        const token = new token_1.default(type, character, beginIndex, lineIndex);
        if (open) {
            this.addOpenBracket(token);
        }
        else {
            this.addCloseBracket(token);
        }
    }
    getAllBrackets() {
        return this.bracketManager.getAllBrackets();
    }
    addOpenBracket(token) {
        let colorIndex;
        if (this.settings.forceIterationColorCycle) {
            colorIndex = (this.bracketManager.getPreviousIndex(token.type) + 1) % this.settings.colors.length;
        }
        else {
            colorIndex = this.bracketManager.GetAmountOfOpenBrackets(token.type) % this.settings.colors.length;
        }
        let color = this.settings.colors[colorIndex];
        if (this.settings.forceUniqueOpeningColor && color === this.previousBracketColor) {
            colorIndex = (colorIndex + 1) % this.settings.colors.length;
            color = this.settings.colors[colorIndex];
        }
        this.previousBracketColor = color;
        this.bracketManager.addOpenBracket(token, colorIndex);
    }
    ;
    addCloseBracket(token) {
        this.bracketManager.addCloseBracket(token);
    }
}
exports.default = LineState;
//# sourceMappingURL=lineState.js.map