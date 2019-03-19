"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const position_1 = require("./../common/motion/position");
const range_1 = require("./../common/motion/range");
const mode_1 = require("./../mode/mode");
const register_1 = require("./../register/register");
const textEditor_1 = require("./../textEditor");
const base_1 = require("./base");
const motion_1 = require("./motion");
const operator_1 = require("./operator");
class TextObjectMovement extends motion_1.BaseMovement {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal, mode_1.ModeName.Visual, mode_1.ModeName.VisualBlock];
    }
    execActionForOperator(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = (yield this.execAction(position, vimState));
            // Since we need to handle leading spaces, we cannot use MoveWordBegin.execActionForOperator
            // In normal mode, the character on the stop position will be the first character after the operator executed
            // and we do left-shifting in operator-pre-execution phase, here we need to right-shift the stop position accordingly.
            res.stop = new position_1.Position(res.stop.line, res.stop.character + 1);
            return res;
        });
    }
}
exports.TextObjectMovement = TextObjectMovement;
let SelectWord = class SelectWord extends TextObjectMovement {
    constructor() {
        super(...arguments);
        this.keys = ['a', 'w'];
    }
    execAction(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            let start;
            let stop;
            const currentChar = textEditor_1.TextEditor.getCharAt(position);
            if (/\s/.test(currentChar)) {
                start = position.getLastWordEnd().getRight();
                stop = position.getCurrentWordEnd();
            }
            else {
                stop = position.getWordRight();
                // If the next word is not at the beginning of the next line, we want to pretend it is.
                // This is because 'aw' has two fundamentally different behaviors distinguished by whether
                // the next word is directly after the current word, as described in the following comment.
                // The only case that's not true is in cases like #1350.
                if (stop.isEqual(stop.getFirstLineNonBlankChar())) {
                    stop = stop.getLineBegin();
                }
                stop = stop.getLeftThroughLineBreaks().getLeftIfEOL();
                // If we aren't separated from the next word by whitespace(like in "horse ca|t,dog" or at the end of the line)
                // then we delete the spaces to the left of the current word. Otherwise, we delete to the right.
                // Also, if the current word is the leftmost word, we only delete from the start of the word to the end.
                if (stop.isEqual(position.getCurrentWordEnd(true)) &&
                    !position.getWordLeft(true).isEqual(position.getFirstLineNonBlankChar()) &&
                    vimState.recordedState.count === 0) {
                    start = position.getLastWordEnd().getRight();
                }
                else {
                    start = position.getWordLeft(true);
                }
            }
            if (vimState.currentMode === mode_1.ModeName.Visual &&
                !vimState.cursorPosition.isEqual(vimState.cursorStartPosition)) {
                start = vimState.cursorStartPosition;
                if (vimState.cursorPosition.isBefore(vimState.cursorStartPosition)) {
                    // If current cursor postion is before cursor start position, we are selecting words in reverser order.
                    if (/\s/.test(currentChar)) {
                        stop = position.getWordLeft(true);
                    }
                    else {
                        stop = position.getLastWordEnd().getRight();
                    }
                }
            }
            return {
                start: start,
                stop: stop,
            };
        });
    }
};
SelectWord = __decorate([
    base_1.RegisterAction
], SelectWord);
exports.SelectWord = SelectWord;
let SelectABigWord = class SelectABigWord extends TextObjectMovement {
    constructor() {
        super(...arguments);
        this.keys = ['a', 'W'];
    }
    execAction(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            let start;
            let stop;
            const currentChar = textEditor_1.TextEditor.getLineAt(position).text[position.character];
            if (/\s/.test(currentChar)) {
                start = position.getLastBigWordEnd().getRight();
                stop = position.getCurrentBigWordEnd();
            }
            else {
                // Check 'aw' code for much of the reasoning behind this logic.
                const nextWord = position.getBigWordRight();
                if ((nextWord.line > position.line || nextWord.isAtDocumentEnd()) &&
                    vimState.recordedState.count === 0) {
                    if (position.getLastBigWordEnd().isLineBeginning()) {
                        start = position.getLastBigWordEnd();
                    }
                    else {
                        start = position.getLastBigWordEnd().getRight();
                    }
                    stop = position.getLineEnd();
                }
                else if ((nextWord.isEqual(nextWord.getFirstLineNonBlankChar()) || nextWord.isLineEnd()) &&
                    vimState.recordedState.count === 0) {
                    start = position.getLastWordEnd().getRight();
                    stop = position.getLineEnd();
                }
                else {
                    start = position.getBigWordLeft(true);
                    stop = position.getBigWordRight().getLeft();
                }
            }
            if (vimState.currentMode === mode_1.ModeName.Visual &&
                !vimState.cursorPosition.isEqual(vimState.cursorStartPosition)) {
                start = vimState.cursorStartPosition;
                if (vimState.cursorPosition.isBefore(vimState.cursorStartPosition)) {
                    // If current cursor postion is before cursor start position, we are selecting words in reverser order.
                    if (/\s/.test(currentChar)) {
                        stop = position.getBigWordLeft();
                    }
                    else {
                        stop = position.getLastBigWordEnd().getRight();
                    }
                }
            }
            return {
                start: start,
                stop: stop,
            };
        });
    }
};
SelectABigWord = __decorate([
    base_1.RegisterAction
], SelectABigWord);
exports.SelectABigWord = SelectABigWord;
/**
 * This is a custom action that I (johnfn) added. It selects procedurally
 * larger blocks. e.g. if you had "blah (foo [bar 'ba|z'])" then it would
 * select 'baz' first. If you pressed af again, it'd then select [bar 'baz'],
 * and if you did it a third time it would select "(foo [bar 'baz'])".
 */
let SelectAnExpandingBlock = class SelectAnExpandingBlock extends motion_1.ExpandingSelection {
    /**
     * This is a custom action that I (johnfn) added. It selects procedurally
     * larger blocks. e.g. if you had "blah (foo [bar 'ba|z'])" then it would
     * select 'baz' first. If you pressed af again, it'd then select [bar 'baz'],
     * and if you did it a third time it would select "(foo [bar 'baz'])".
     */
    constructor() {
        super(...arguments);
        this.keys = ['a', 'f'];
        this.modes = [mode_1.ModeName.Visual, mode_1.ModeName.VisualLine];
    }
    execAction(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            const blocks = [
                new motion_1.MoveADoubleQuotes(),
                new motion_1.MoveASingleQuotes(),
                new motion_1.MoveABacktick(),
                new motion_1.MoveAClosingCurlyBrace(),
                new motion_1.MoveAParentheses(),
                new motion_1.MoveASquareBracket(),
                new motion_1.MoveAroundTag(),
            ];
            // ideally no state would change as we test each of the possible expansions
            // a deep copy of vimState could work here but may be expensive
            let ranges = [];
            for (const block of blocks) {
                const cursorPos = new position_1.Position(position.line, position.character);
                const cursorStartPos = new position_1.Position(vimState.cursorStartPosition.line, vimState.cursorStartPosition.character);
                ranges.push(yield block.execAction(cursorPos, vimState));
                vimState.cursorStartPosition = cursorStartPos;
            }
            ranges = ranges.filter(range => {
                return !range.failed;
            });
            let smallestRange = undefined;
            for (const iMotion of ranges) {
                const currentSelectedRange = new range_1.Range(vimState.cursorStartPosition, vimState.cursorPosition);
                if (iMotion.failed) {
                    continue;
                }
                const range = range_1.Range.FromIMovement(iMotion);
                let contender = undefined;
                if (range.start.isBefore(currentSelectedRange.start) &&
                    range.stop.isAfter(currentSelectedRange.stop)) {
                    if (!smallestRange) {
                        contender = range;
                    }
                    else {
                        if (range.start.isAfter(smallestRange.start) && range.stop.isBefore(smallestRange.stop)) {
                            contender = range;
                        }
                    }
                }
                if (contender) {
                    const areTheyEqual = contender.equals(new range_1.Range(vimState.cursorStartPosition, vimState.cursorPosition)) ||
                        (vimState.currentMode === mode_1.ModeName.VisualLine &&
                            contender.start.line === vimState.cursorStartPosition.line &&
                            contender.stop.line === vimState.cursorPosition.line);
                    if (!areTheyEqual) {
                        smallestRange = contender;
                    }
                }
            }
            if (!smallestRange) {
                return {
                    start: vimState.cursorStartPosition,
                    stop: vimState.cursorPosition,
                };
            }
            else {
                // revert relevant state changes
                vimState.cursorStartPosition = new position_1.Position(smallestRange.start.line, smallestRange.start.character);
                vimState.cursorPosition = new position_1.Position(smallestRange.stop.line, smallestRange.stop.character);
                vimState.recordedState.operatorPositionDiff = undefined;
                return {
                    start: smallestRange.start,
                    stop: smallestRange.stop,
                };
            }
        });
    }
};
SelectAnExpandingBlock = __decorate([
    base_1.RegisterAction
], SelectAnExpandingBlock);
exports.SelectAnExpandingBlock = SelectAnExpandingBlock;
let SelectInnerWord = class SelectInnerWord extends TextObjectMovement {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal, mode_1.ModeName.Visual];
        this.keys = ['i', 'w'];
    }
    execAction(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            let start;
            let stop;
            const currentChar = textEditor_1.TextEditor.getLineAt(position).text[position.character];
            if (/\s/.test(currentChar)) {
                start = position.getLastWordEnd().getRight();
                stop = position.getWordRight().getLeftThroughLineBreaks();
            }
            else {
                start = position.getWordLeft(true);
                stop = position.getCurrentWordEnd(true);
            }
            if (vimState.currentMode === mode_1.ModeName.Visual &&
                !vimState.cursorPosition.isEqual(vimState.cursorStartPosition)) {
                start = vimState.cursorStartPosition;
                if (vimState.cursorPosition.isBefore(vimState.cursorStartPosition)) {
                    // If current cursor postion is before cursor start position, we are selecting words in reverser order.
                    if (/\s/.test(currentChar)) {
                        stop = position.getLastWordEnd().getRight();
                    }
                    else {
                        stop = position.getWordLeft(true);
                    }
                }
            }
            return {
                start: start,
                stop: stop,
            };
        });
    }
};
SelectInnerWord = __decorate([
    base_1.RegisterAction
], SelectInnerWord);
exports.SelectInnerWord = SelectInnerWord;
let SelectInnerBigWord = class SelectInnerBigWord extends TextObjectMovement {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal, mode_1.ModeName.Visual];
        this.keys = ['i', 'W'];
    }
    execAction(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            let start;
            let stop;
            const currentChar = textEditor_1.TextEditor.getLineAt(position).text[position.character];
            if (/\s/.test(currentChar)) {
                start = position.getLastBigWordEnd().getRight();
                stop = position.getBigWordRight().getLeft();
            }
            else {
                start = position.getBigWordLeft(true);
                stop = position.getCurrentBigWordEnd(true);
            }
            if (vimState.currentMode === mode_1.ModeName.Visual &&
                !vimState.cursorPosition.isEqual(vimState.cursorStartPosition)) {
                start = vimState.cursorStartPosition;
                if (vimState.cursorPosition.isBefore(vimState.cursorStartPosition)) {
                    // If current cursor postion is before cursor start position, we are selecting words in reverser order.
                    if (/\s/.test(currentChar)) {
                        stop = position.getLastBigWordEnd().getRight();
                    }
                    else {
                        stop = position.getBigWordLeft();
                    }
                }
            }
            return {
                start: start,
                stop: stop,
            };
        });
    }
};
SelectInnerBigWord = __decorate([
    base_1.RegisterAction
], SelectInnerBigWord);
exports.SelectInnerBigWord = SelectInnerBigWord;
let SelectSentence = class SelectSentence extends TextObjectMovement {
    constructor() {
        super(...arguments);
        this.keys = ['a', 's'];
    }
    execAction(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            let start;
            let stop;
            const currentSentenceBegin = position.getSentenceBegin({ forward: false });
            const currentSentenceNonWhitespaceEnd = currentSentenceBegin.getCurrentSentenceEnd();
            if (currentSentenceNonWhitespaceEnd.isBefore(position)) {
                // The cursor is on a trailing white space.
                start = currentSentenceNonWhitespaceEnd.getRight();
                stop = currentSentenceBegin.getSentenceBegin({ forward: true }).getCurrentSentenceEnd();
            }
            else {
                const nextSentenceBegin = currentSentenceBegin.getSentenceBegin({ forward: true });
                // If the sentence has no trailing white spaces, `as` should include its leading white spaces.
                if (nextSentenceBegin.isEqual(currentSentenceBegin.getCurrentSentenceEnd())) {
                    start = currentSentenceBegin
                        .getSentenceBegin({ forward: false })
                        .getCurrentSentenceEnd()
                        .getRight();
                    stop = nextSentenceBegin;
                }
                else {
                    start = currentSentenceBegin;
                    stop = nextSentenceBegin.getLeft();
                }
            }
            if (vimState.currentMode === mode_1.ModeName.Visual &&
                !vimState.cursorPosition.isEqual(vimState.cursorStartPosition)) {
                start = vimState.cursorStartPosition;
                if (vimState.cursorPosition.isBefore(vimState.cursorStartPosition)) {
                    // If current cursor postion is before cursor start position, we are selecting sentences in reverser order.
                    if (currentSentenceNonWhitespaceEnd.isAfter(vimState.cursorPosition)) {
                        stop = currentSentenceBegin
                            .getSentenceBegin({ forward: false })
                            .getCurrentSentenceEnd()
                            .getRight();
                    }
                    else {
                        stop = currentSentenceBegin;
                    }
                }
            }
            return {
                start: start,
                stop: stop,
            };
        });
    }
};
SelectSentence = __decorate([
    base_1.RegisterAction
], SelectSentence);
exports.SelectSentence = SelectSentence;
let SelectInnerSentence = class SelectInnerSentence extends TextObjectMovement {
    constructor() {
        super(...arguments);
        this.keys = ['i', 's'];
    }
    execAction(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            let start;
            let stop;
            const currentSentenceBegin = position.getSentenceBegin({ forward: false });
            const currentSentenceNonWhitespaceEnd = currentSentenceBegin.getCurrentSentenceEnd();
            if (currentSentenceNonWhitespaceEnd.isBefore(position)) {
                // The cursor is on a trailing white space.
                start = currentSentenceNonWhitespaceEnd.getRight();
                stop = currentSentenceBegin.getSentenceBegin({ forward: true }).getLeft();
            }
            else {
                start = currentSentenceBegin;
                stop = currentSentenceNonWhitespaceEnd;
            }
            if (vimState.currentMode === mode_1.ModeName.Visual &&
                !vimState.cursorPosition.isEqual(vimState.cursorStartPosition)) {
                start = vimState.cursorStartPosition;
                if (vimState.cursorPosition.isBefore(vimState.cursorStartPosition)) {
                    // If current cursor postion is before cursor start position, we are selecting sentences in reverser order.
                    if (currentSentenceNonWhitespaceEnd.isAfter(vimState.cursorPosition)) {
                        stop = currentSentenceBegin;
                    }
                    else {
                        stop = currentSentenceNonWhitespaceEnd.getRight();
                    }
                }
            }
            return {
                start: start,
                stop: stop,
            };
        });
    }
};
SelectInnerSentence = __decorate([
    base_1.RegisterAction
], SelectInnerSentence);
exports.SelectInnerSentence = SelectInnerSentence;
let SelectParagraph = class SelectParagraph extends TextObjectMovement {
    constructor() {
        super(...arguments);
        this.keys = ['a', 'p'];
    }
    execAction(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            vimState.currentRegisterMode = register_1.RegisterMode.LineWise;
            let start;
            const currentParagraphBegin = position.getCurrentParagraphBeginning(true);
            if (position.isLineWhite()) {
                // The cursor is at an empty line, it can be both the start of next paragraph and the end of previous paragraph
                start = position.getCurrentParagraphBeginning(true).getCurrentParagraphEnd(true);
            }
            else {
                if (currentParagraphBegin.isLineBeginning() && currentParagraphBegin.isLineEnd()) {
                    start = currentParagraphBegin.getRightThroughLineBreaks();
                }
                else {
                    start = currentParagraphBegin;
                }
            }
            // Include additional blank lines.
            let stop = position.getCurrentParagraphEnd(true);
            while (stop.line < textEditor_1.TextEditor.getLineCount() - 1 && stop.getDown(0).isLineWhite()) {
                stop = stop.getDown(0);
            }
            return {
                start: start,
                stop: stop,
            };
        });
    }
};
SelectParagraph = __decorate([
    base_1.RegisterAction
], SelectParagraph);
exports.SelectParagraph = SelectParagraph;
let SelectInnerParagraph = class SelectInnerParagraph extends TextObjectMovement {
    constructor() {
        super(...arguments);
        this.keys = ['i', 'p'];
    }
    execAction(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            vimState.currentRegisterMode = register_1.RegisterMode.LineWise;
            let start;
            let stop;
            if (position.isLineWhite()) {
                // The cursor is at an empty line, so white lines are the paragraph.
                start = position.getLineBegin();
                stop = position.getLineEnd();
                while (start.line > 0 && start.getUp(0).isLineWhite()) {
                    start = start.getUp(0);
                }
                while (stop.line < textEditor_1.TextEditor.getLineCount() - 1 && stop.getDown(0).isLineWhite()) {
                    stop = stop.getDown(0);
                }
            }
            else {
                const currentParagraphBegin = position.getCurrentParagraphBeginning(true);
                stop = position.getCurrentParagraphEnd(true);
                if (currentParagraphBegin.isLineWhite()) {
                    start = currentParagraphBegin.getRightThroughLineBreaks();
                }
                else {
                    start = currentParagraphBegin;
                }
                // Exclude additional blank lines.
                while (stop.line > 0 && stop.isLineWhite()) {
                    stop = stop.getUp(0).getLineEnd();
                }
            }
            return {
                start: start,
                stop: stop,
            };
        });
    }
};
SelectInnerParagraph = __decorate([
    base_1.RegisterAction
], SelectInnerParagraph);
exports.SelectInnerParagraph = SelectInnerParagraph;
class IndentObjectMatch extends TextObjectMovement {
    constructor() {
        super(...arguments);
        this.setsDesiredColumnToEOL = true;
        this.includeLineAbove = false;
        this.includeLineBelow = false;
    }
    execAction(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            const isChangeOperator = vimState.recordedState.operator instanceof operator_1.ChangeOperator;
            const firstValidLineNumber = IndentObjectMatch.findFirstValidLine(position);
            const firstValidLine = textEditor_1.TextEditor.getLineAt(new position_1.Position(firstValidLineNumber, 0));
            const cursorIndent = firstValidLine.firstNonWhitespaceCharacterIndex;
            // let startLineNumber = findRangeStart(firstValidLineNumber, cursorIndent);
            let startLineNumber = IndentObjectMatch.findRangeStartOrEnd(firstValidLineNumber, cursorIndent, -1);
            let endLineNumber = IndentObjectMatch.findRangeStartOrEnd(firstValidLineNumber, cursorIndent, 1);
            // Adjust the start line as needed.
            if (this.includeLineAbove) {
                startLineNumber -= 1;
            }
            // Check for OOB.
            if (startLineNumber < 0) {
                startLineNumber = 0;
            }
            // Adjust the end line as needed.
            if (this.includeLineBelow) {
                endLineNumber += 1;
            }
            // Check for OOB.
            if (endLineNumber > textEditor_1.TextEditor.getLineCount() - 1) {
                endLineNumber = textEditor_1.TextEditor.getLineCount() - 1;
            }
            // If initiated by a change operation, adjust the cursor to the indent level
            // of the block.
            let startCharacter = 0;
            if (isChangeOperator) {
                startCharacter = textEditor_1.TextEditor.getLineAt(new position_1.Position(startLineNumber, 0))
                    .firstNonWhitespaceCharacterIndex;
            }
            // TextEditor.getLineMaxColumn throws when given line 0, which we don't
            // care about here since it just means this text object wouldn't work on a
            // single-line document.
            let endCharacter;
            if (endLineNumber === textEditor_1.TextEditor.getLineCount() - 1 ||
                vimState.currentMode === mode_1.ModeName.Visual) {
                endCharacter = textEditor_1.TextEditor.getLineMaxColumn(endLineNumber);
            }
            else {
                endCharacter = 0;
                endLineNumber++;
            }
            return {
                start: new position_1.Position(startLineNumber, startCharacter),
                stop: new position_1.Position(endLineNumber, endCharacter),
            };
        });
    }
    execActionForOperator(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.execAction(position, vimState);
        });
    }
    /**
     * Searches up from the cursor for the first non-empty line.
     */
    static findFirstValidLine(cursorPosition) {
        for (let i = cursorPosition.line; i >= 0; i--) {
            const line = textEditor_1.TextEditor.getLineAt(new position_1.Position(i, 0));
            if (!line.isEmptyOrWhitespace) {
                return i;
            }
        }
        return cursorPosition.line;
    }
    /**
     * Searches up or down from a line finding the first with a lower indent level.
     */
    static findRangeStartOrEnd(startIndex, cursorIndent, step) {
        let i = startIndex;
        let ret = startIndex;
        const end = step === 1 ? textEditor_1.TextEditor.getLineCount() : -1;
        for (; i !== end; i += step) {
            const line = textEditor_1.TextEditor.getLineAt(new position_1.Position(i, 0));
            const isLineEmpty = line.isEmptyOrWhitespace;
            const lineIndent = line.firstNonWhitespaceCharacterIndex;
            if (lineIndent < cursorIndent && !isLineEmpty) {
                break;
            }
            ret = i;
        }
        return ret;
    }
}
let InsideIndentObject = class InsideIndentObject extends IndentObjectMatch {
    constructor() {
        super(...arguments);
        this.keys = ['i', 'i'];
    }
};
InsideIndentObject = __decorate([
    base_1.RegisterAction
], InsideIndentObject);
let InsideIndentObjectAbove = class InsideIndentObjectAbove extends IndentObjectMatch {
    constructor() {
        super(...arguments);
        this.keys = ['a', 'i'];
        this.includeLineAbove = true;
    }
};
InsideIndentObjectAbove = __decorate([
    base_1.RegisterAction
], InsideIndentObjectAbove);
let InsideIndentObjectBoth = class InsideIndentObjectBoth extends IndentObjectMatch {
    constructor() {
        super(...arguments);
        this.keys = ['a', 'I'];
        this.includeLineAbove = true;
        this.includeLineBelow = true;
    }
};
InsideIndentObjectBoth = __decorate([
    base_1.RegisterAction
], InsideIndentObjectBoth);

//# sourceMappingURL=textobject.js.map
