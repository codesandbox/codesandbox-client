"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const bracket_1 = require("./bracket");
const bracketClose_1 = require("./bracketClose");
class MultipleBracketGroups {
    constructor(settings, languageConfig, previousState) {
        this.allLinesOpenBracketStack = [];
        this.allBracketsOnLine = [];
        this.bracketsHash = "";
        this.previousOpenBracketColorIndexes = [];
        this.settings = settings;
        this.languageConfig = languageConfig;
        if (previousState !== undefined) {
            this.allLinesOpenBracketStack = previousState.currentOpenBracketColorIndexes;
            this.previousOpenBracketColorIndexes = previousState.previousOpenBracketColorIndexes;
        }
        else {
            for (const value of languageConfig.bracketToId.values()) {
                this.allLinesOpenBracketStack[value.key] = [];
                this.previousOpenBracketColorIndexes[value.key] = 0;
            }
        }
    }
    getPreviousIndex(type) {
        return this.previousOpenBracketColorIndexes[type];
    }
    addOpenBracket(token, colorIndex) {
        const openBracket = new bracket_1.default(token, this.settings.colors[colorIndex]);
        this.allBracketsOnLine.push(openBracket);
        this.bracketsHash += openBracket.token.character;
        this.allLinesOpenBracketStack[token.type].push(openBracket);
        this.previousOpenBracketColorIndexes[token.type] = colorIndex;
    }
    GetAmountOfOpenBrackets(type) {
        return this.allLinesOpenBracketStack[type].length;
    }
    addCloseBracket(token) {
        const openStack = this.allLinesOpenBracketStack[token.type];
        if (openStack.length > 0) {
            if (openStack[openStack.length - 1].token.type === token.type) {
                const openBracket = openStack.pop();
                const closeBracket = new bracketClose_1.default(token, openBracket);
                this.allBracketsOnLine.push(closeBracket);
                this.bracketsHash += closeBracket.token.character;
                return;
            }
        }
        const orphan = new bracket_1.default(token, this.settings.unmatchedScopeColor);
        this.allBracketsOnLine.push(orphan);
        this.bracketsHash += orphan.token.character;
    }
    getClosingBracket(position) {
        for (const bracket of this.allBracketsOnLine) {
            if (!(bracket instanceof bracketClose_1.default)) {
                continue;
            }
            const closeBracket = bracket;
            const openBracket = closeBracket.openBracket;
            const range = new vscode_1.Range(openBracket.token.range.start.translate(0, 1), closeBracket.token.range.end.translate(0, -1));
            if (range.contains(position)) {
                return closeBracket;
            }
        }
    }
    getAllBrackets() {
        return this.allBracketsOnLine;
    }
    getHash() {
        return this.bracketsHash;
    }
    offset(startIndex, amount) {
        for (const bracket of this.allBracketsOnLine) {
            if (bracket.token.range.start.character >= startIndex) {
                bracket.token.offset(amount);
            }
        }
    }
    copyCumulativeState() {
        const clone = [];
        for (const value of this.allLinesOpenBracketStack) {
            clone.push(value.slice());
        }
        return new MultipleBracketGroups(this.settings, this.languageConfig, {
            currentOpenBracketColorIndexes: clone,
            previousOpenBracketColorIndexes: this.previousOpenBracketColorIndexes.slice(),
        });
    }
}
exports.default = MultipleBracketGroups;
//# sourceMappingURL=multipleIndexes.js.map