"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const textEditor_1 = require("./../../textEditor");
const position_1 = require("./../motion/position");
const configuration_1 = require("../../configuration/configuration");
/**
 * PairMatcher finds the position matching the given character, respecting nested
 * instances of the pair.
 */
class PairMatcher {
    static findPairedChar(position, charToFind, charToStack, stackHeight, isNextMatchForward, vimState) {
        let lineNumber = position.line;
        let linePosition = position.character;
        let lineCount = textEditor_1.TextEditor.getLineCount();
        let cursorChar = textEditor_1.TextEditor.getCharAt(position);
        if (vimState) {
            let startPos = vimState.cursorStartPosition;
            let endPos = vimState.cursorPosition;
            if (startPos.isEqual(endPos) && cursorChar === charToFind) {
                return position;
            }
        }
        while (PairMatcher.keepSearching(lineNumber, lineCount, isNextMatchForward)) {
            let lineText = textEditor_1.TextEditor.getLineAt(new position_1.Position(lineNumber, 0)).text.split('');
            const originalLineLength = lineText.length;
            if (lineNumber === position.line) {
                if (isNextMatchForward) {
                    lineText = lineText.slice(linePosition + 1, originalLineLength);
                }
                else {
                    lineText = lineText.slice(0, linePosition);
                }
            }
            while (true) {
                if (lineText.length <= 0 || stackHeight <= -1) {
                    break;
                }
                let nextChar;
                if (isNextMatchForward) {
                    nextChar = lineText.shift();
                }
                else {
                    nextChar = lineText.pop();
                }
                if (nextChar === charToStack) {
                    stackHeight++;
                }
                else if (nextChar === charToFind) {
                    stackHeight--;
                }
                else {
                    continue;
                }
            }
            if (stackHeight <= -1) {
                let pairMemberChar;
                if (isNextMatchForward) {
                    pairMemberChar = Math.max(0, originalLineLength - lineText.length - 1);
                }
                else {
                    pairMemberChar = lineText.length;
                }
                return new position_1.Position(lineNumber, pairMemberChar);
            }
            if (isNextMatchForward) {
                lineNumber++;
            }
            else {
                lineNumber--;
            }
        }
        return undefined;
    }
    static keepSearching(lineNumber, lineCount, isNextMatchForward) {
        if (isNextMatchForward) {
            return lineNumber <= lineCount - 1;
        }
        else {
            return lineNumber >= 0;
        }
    }
    static nextPairedChar(position, charToMatch, vimState) {
        /**
         * We do a fairly basic implementation that only tracks the state of the type of
         * character you're over and its pair (e.g. "[" and "]"). This is similar to
         * what Vim does.
         *
         * It can't handle strings very well - something like "|( ')' )" where | is the
         * cursor will cause it to go to the ) in the quotes, even though it should skip over it.
         *
         * PRs welcomed! (TODO)
         * Though ideally VSC implements https://github.com/Microsoft/vscode/issues/7177
         */
        const pairing = this.pairings[charToMatch];
        if (pairing === undefined || pairing.directionless) {
            return undefined;
        }
        const stackHeight = 0;
        let matchedPos;
        const charToFind = pairing.match;
        const charToStack = charToMatch;
        matchedPos = PairMatcher.findPairedChar(position, charToFind, charToStack, stackHeight, pairing.isNextMatchForward, vimState);
        if (matchedPos) {
            return matchedPos;
        }
        // TODO(bell)
        return undefined;
    }
    /**
     * Given a current position, find an immediate following bracket and return the range. If
     * no matching bracket is found immediately following the opening bracket, return undefined.
     */
    static immediateMatchingBracket(currentPosition) {
        // Don't delete bracket unless autoClosingBrackets is set
        if (!configuration_1.configuration.getConfiguration().get('editor.autoClosingBrackets')) {
            return undefined;
        }
        const deleteRange = new vscode.Range(currentPosition, currentPosition.getLeftThroughLineBreaks());
        const deleteText = vscode.window.activeTextEditor.document.getText(deleteRange);
        let matchRange;
        let isNextMatch = false;
        if ('{[("\'`'.indexOf(deleteText) > -1) {
            const matchPosition = currentPosition.add(new position_1.PositionDiff(0, 1));
            matchRange = new vscode.Range(matchPosition, matchPosition.getLeftThroughLineBreaks());
            isNextMatch =
                vscode.window.activeTextEditor.document.getText(matchRange) ===
                    PairMatcher.pairings[deleteText].match;
        }
        if (isNextMatch && matchRange) {
            return matchRange;
        }
        return undefined;
    }
}
PairMatcher.pairings = {
    '(': { match: ')', isNextMatchForward: true, matchesWithPercentageMotion: true },
    '{': { match: '}', isNextMatchForward: true, matchesWithPercentageMotion: true },
    '[': { match: ']', isNextMatchForward: true, matchesWithPercentageMotion: true },
    ')': { match: '(', isNextMatchForward: false, matchesWithPercentageMotion: true },
    '}': { match: '{', isNextMatchForward: false, matchesWithPercentageMotion: true },
    ']': { match: '[', isNextMatchForward: false, matchesWithPercentageMotion: true },
    // These characters can't be used for "%"-based matching, but are still
    // useful for text objects.
    '<': { match: '>', isNextMatchForward: true },
    '>': { match: '<', isNextMatchForward: false },
    // These are useful for deleting closing and opening quotes, but don't seem to negatively
    // affect how text objects such as `ci"` work, which was my worry.
    '"': { match: '"', isNextMatchForward: false, directionless: true },
    "'": { match: "'", isNextMatchForward: false, directionless: true },
    '`': { match: '`', isNextMatchForward: false, directionless: true },
};
exports.PairMatcher = PairMatcher;

//# sourceMappingURL=matcher.js.map
