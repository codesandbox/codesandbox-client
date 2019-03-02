"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getRegexForBrackets(input) {
    const pieces = [];
    input.forEach((b) => {
        pieces.push(b.open);
        pieces.push(b.close);
    });
    return createBracketOrRegExp(pieces);
}
exports.getRegexForBrackets = getRegexForBrackets;
function createBracketOrRegExp(pieces) {
    const regexStr = `(${pieces.map(prepareBracketForRegExp).join(")|(")})`;
    return createRegExp(regexStr, true, { global: true });
}
function prepareBracketForRegExp(str) {
    // This bracket pair uses letters like e.g. "begin" - "end"
    const insertWordBoundaries = (/^[\w]+$/.test(str));
    str = escapeRegExpCharacters(str);
    return (insertWordBoundaries ? `\\b${str}\\b` : str);
}
function escapeRegExpCharacters(value) {
    return value.replace(/[\-\\\{\}\*\+\?\|\^\$\.\[\]\(\)\#]/g, "\\$&");
}
function createRegExp(searchString, isRegex, options = {}) {
    if (!searchString) {
        throw new Error("Cannot create regex from empty string");
    }
    if (!isRegex) {
        searchString = escapeRegExpCharacters(searchString);
    }
    if (options.wholeWord) {
        if (!/\B/.test(searchString.charAt(0))) {
            searchString = "\\b" + searchString;
        }
        if (!/\B/.test(searchString.charAt(searchString.length - 1))) {
            searchString = searchString + "\\b";
        }
    }
    let modifiers = "";
    if (options.global) {
        modifiers += "g";
    }
    if (!options.matchCase) {
        modifiers += "i";
    }
    if (options.multiline) {
        modifiers += "m";
    }
    return new RegExp(searchString, modifiers);
}
//# sourceMappingURL=bracketUtil.js.map