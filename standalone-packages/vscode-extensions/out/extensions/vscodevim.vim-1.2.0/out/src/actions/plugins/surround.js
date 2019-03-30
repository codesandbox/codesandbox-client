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
var CommandSurroundAddToReplacement_1;
"use strict";
const matcher_1 = require("./../../common/matching/matcher");
const range_1 = require("./../../common/motion/range");
const configuration_1 = require("./../../configuration/configuration");
const mode_1 = require("./../../mode/mode");
const textEditor_1 = require("./../../textEditor");
const base_1 = require("./../base");
const actions_1 = require("./../commands/actions");
const motion_1 = require("./../motion");
const motion_2 = require("./../motion");
const operator_1 = require("./../operator");
const textobject_1 = require("./../textobject");
let CommandSurroundAddTarget = class CommandSurroundAddTarget extends actions_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.SurroundInputMode];
        this.keys = [
            ['('],
            [')'],
            ['{'],
            ['}'],
            ['['],
            [']'],
            ['<'],
            ['>'],
            ["'"],
            ['"'],
            ['`'],
            ['t'],
            ['w'],
            ['W'],
            ['s'],
            ['p'],
            ['b'],
            ['B'],
            ['r'],
            ['a'],
        ];
        this.isCompleteAction = false;
    }
    runsOnceForEveryCursor() {
        return false;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!vimState.surround) {
                return vimState;
            }
            vimState.surround.target = this.keysPressed[this.keysPressed.length - 1];
            if (vimState.surround.target === 'b') {
                vimState.surround.target = ')';
            }
            if (vimState.surround.target === 'B') {
                vimState.surround.target = '}';
            }
            if (vimState.surround.target === 'r') {
                vimState.surround.target = ']';
            }
            if (vimState.surround.target === 'a') {
                vimState.surround.target = '>';
            }
            // It's possible we're already done, e.g. dst
            if (yield CommandSurroundAddToReplacement.TryToExecuteSurround(vimState, position)) {
                this.isCompleteAction = true;
            }
            return vimState;
        });
    }
    doesActionApply(vimState, keysPressed) {
        return (super.doesActionApply(vimState, keysPressed) &&
            !!(vimState.surround &&
                vimState.surround.active &&
                !vimState.surround.target &&
                !vimState.surround.range));
    }
    couldActionApply(vimState, keysPressed) {
        return (super.doesActionApply(vimState, keysPressed) &&
            !!(vimState.surround &&
                vimState.surround.active &&
                !vimState.surround.target &&
                !vimState.surround.range));
    }
};
CommandSurroundAddTarget = __decorate([
    base_1.RegisterAction
], CommandSurroundAddTarget);
// Aaaaagghhhh. I tried so hard to make surround an operator to make use of our
// sick new operator repeat structure, but there's just no clean way to do it.
// In the future, if somebody wants to refactor Surround, the big problem for
// why it's so weird is that typing `ys` loads up the Yank operator first,
// which prevents us from making a surround operator that's `ys` or something.
// You'd need to refactor our keybinding handling to "give up" keystrokes if it
// can't find a match.
let CommandSurroundModeRepeat = class CommandSurroundModeRepeat extends motion_1.BaseMovement {
    // Aaaaagghhhh. I tried so hard to make surround an operator to make use of our
    // sick new operator repeat structure, but there's just no clean way to do it.
    // In the future, if somebody wants to refactor Surround, the big problem for
    // why it's so weird is that typing `ys` loads up the Yank operator first,
    // which prevents us from making a surround operator that's `ys` or something.
    // You'd need to refactor our keybinding handling to "give up" keystrokes if it
    // can't find a match.
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal];
        this.keys = ['s'];
        this.isCompleteAction = false;
    }
    runsOnceForEveryCursor() {
        return false;
    }
    execAction(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                start: position.getLineBeginRespectingIndent(),
                stop: position
                    .getLineEnd()
                    .getLastWordEnd()
                    .getRight(),
            };
        });
    }
    doesActionApply(vimState, keysPressed) {
        return super.doesActionApply(vimState, keysPressed) && vimState.surround !== undefined;
    }
};
CommandSurroundModeRepeat = __decorate([
    base_1.RegisterAction
], CommandSurroundModeRepeat);
let CommandSurroundModeStart = class CommandSurroundModeStart extends actions_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal];
        this.keys = ['s'];
        this.isCompleteAction = false;
    }
    runsOnceForEveryCursor() {
        return false;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            // Only execute the action if the configuration is set
            if (!configuration_1.configuration.surround) {
                return vimState;
            }
            const operator = vimState.recordedState.operator;
            let operatorString;
            if (operator instanceof operator_1.ChangeOperator) {
                operatorString = 'change';
            }
            if (operator instanceof operator_1.DeleteOperator) {
                operatorString = 'delete';
            }
            if (operator instanceof operator_1.YankOperator) {
                operatorString = 'yank';
            }
            if (!operatorString) {
                return vimState;
            }
            // Start to record the keys to store for playback of surround using dot
            vimState.recordedState.surroundKeys.push(vimState.keyHistory[vimState.keyHistory.length - 2]);
            vimState.recordedState.surroundKeys.push('s');
            vimState.recordedState.surroundKeyIndexStart = vimState.keyHistory.length;
            vimState.surround = {
                active: true,
                target: undefined,
                operator: operatorString,
                replacement: undefined,
                range: undefined,
                isVisualLine: false,
            };
            if (operatorString !== 'yank') {
                yield vimState.setCurrentMode(mode_1.ModeName.SurroundInputMode);
            }
            return vimState;
        });
    }
    doesActionApply(vimState, keysPressed) {
        const hasSomeOperator = !!vimState.recordedState.operator;
        return super.doesActionApply(vimState, keysPressed) && hasSomeOperator;
    }
    couldActionApply(vimState, keysPressed) {
        const hasSomeOperator = !!vimState.recordedState.operator;
        return super.doesActionApply(vimState, keysPressed) && hasSomeOperator;
    }
};
CommandSurroundModeStart = __decorate([
    base_1.RegisterAction
], CommandSurroundModeStart);
let CommandSurroundModeStartVisual = class CommandSurroundModeStartVisual extends actions_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Visual, mode_1.ModeName.VisualLine];
        this.keys = ['S'];
        this.isCompleteAction = false;
    }
    runsOnceForEveryCursor() {
        return false;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            // Only execute the action if the configuration is set
            if (!configuration_1.configuration.surround) {
                return vimState;
            }
            // Start to record the keys to store for playback of surround using dot
            vimState.recordedState.surroundKeys.push('S');
            vimState.recordedState.surroundKeyIndexStart = vimState.keyHistory.length;
            // Make sure cursor positions are ordered correctly for top->down or down->top selection
            if (vimState.cursorStartPosition.line > vimState.cursorStopPosition.line) {
                [vimState.cursorStopPosition, vimState.cursorStartPosition] = [
                    vimState.cursorStartPosition,
                    vimState.cursorStopPosition,
                ];
            }
            // Make sure start/end cursor positions are in order
            if (vimState.cursorStopPosition.line < vimState.cursorStopPosition.line ||
                (vimState.cursorStopPosition.line === vimState.cursorStartPosition.line &&
                    vimState.cursorStopPosition.character < vimState.cursorStartPosition.character)) {
                [vimState.cursorStopPosition, vimState.cursorStartPosition] = [
                    vimState.cursorStartPosition,
                    vimState.cursorStopPosition,
                ];
            }
            vimState.surround = {
                active: true,
                target: undefined,
                operator: 'yank',
                replacement: undefined,
                range: new range_1.Range(vimState.cursorStartPosition, vimState.cursorStopPosition),
                isVisualLine: false,
            };
            if (vimState.currentMode === mode_1.ModeName.VisualLine) {
                vimState.surround.isVisualLine = true;
            }
            yield vimState.setCurrentMode(mode_1.ModeName.SurroundInputMode);
            vimState.cursorStopPosition = vimState.cursorStartPosition;
            return vimState;
        });
    }
};
CommandSurroundModeStartVisual = __decorate([
    base_1.RegisterAction
], CommandSurroundModeStartVisual);
let CommandSurroundAddToReplacement = CommandSurroundAddToReplacement_1 = class CommandSurroundAddToReplacement extends actions_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.SurroundInputMode];
        this.keys = ['<any>'];
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!vimState.surround) {
                return vimState;
            }
            // Backspace modifies the tag entry
            if (vimState.surround.replacement !== undefined) {
                if (this.keysPressed[this.keysPressed.length - 1] === '<BS>' &&
                    vimState.surround.replacement[0] === '<') {
                    // Only allow backspace up until the < character
                    if (vimState.surround.replacement.length > 1) {
                        vimState.surround.replacement = vimState.surround.replacement.slice(0, vimState.surround.replacement.length - 1);
                    }
                    return vimState;
                }
            }
            if (!vimState.surround.replacement) {
                vimState.surround.replacement = '';
            }
            let stringToAdd = this.keysPressed[this.keysPressed.length - 1];
            // t should start creation of a tag
            if (this.keysPressed[0] === 't' && vimState.surround.replacement.length === 0) {
                stringToAdd = '<';
            }
            // Convert a few shortcuts to the correct surround characters when NOT entering a tag
            if (vimState.surround.replacement.length === 0) {
                if (stringToAdd === 'b') {
                    stringToAdd = '(';
                }
                if (stringToAdd === 'B') {
                    stringToAdd = '{';
                }
                if (stringToAdd === 'r') {
                    stringToAdd = '[';
                }
            }
            vimState.surround.replacement += stringToAdd;
            if (yield CommandSurroundAddToReplacement_1.TryToExecuteSurround(vimState, position)) {
                this.isCompleteAction = true;
            }
            return vimState;
        });
    }
    static Finish(vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            vimState.recordedState.hasRunOperator = false;
            vimState.recordedState.actionsRun = [];
            vimState.recordedState.hasRunSurround = true;
            vimState.surround = undefined;
            yield vimState.setCurrentMode(mode_1.ModeName.Normal);
            // Record keys that were pressed since surround started
            for (let i = vimState.recordedState.surroundKeyIndexStart; i < vimState.keyHistory.length; i++) {
                vimState.recordedState.surroundKeys.push(vimState.keyHistory[i]);
            }
            return true;
        });
    }
    // we assume that we start directly on the characters we're operating over
    // e.g. cs{' starts us with start on { end on }.
    static RemoveWhitespace(vimState, start, stop) {
        const firstRangeStart = start.getRight();
        let firstRangeEnd = start.getRight();
        let secondRangeStart = stop.getLeftThroughLineBreaks();
        let secondRangeEnd = stop.getLeftThroughLineBreaks().getRight();
        if (stop.isLineBeginning()) {
            secondRangeStart = stop;
            secondRangeEnd = stop.getRight();
        }
        if (firstRangeEnd.isEqual(secondRangeStart)) {
            return;
        }
        while (!firstRangeEnd.isEqual(stop) &&
            !firstRangeEnd.isLineEnd() &&
            textEditor_1.TextEditor.getCharAt(firstRangeEnd).match(/[ \t]/)) {
            firstRangeEnd = firstRangeEnd.getRight();
        }
        while (!secondRangeStart.isEqual(firstRangeEnd) &&
            textEditor_1.TextEditor.getCharAt(secondRangeStart).match(/[ \t]/) &&
            !secondRangeStart.isLineBeginning()) {
            secondRangeStart = secondRangeStart.getLeftThroughLineBreaks(false);
        }
        // Adjust range start based on found position
        secondRangeStart = secondRangeStart.getRight();
        const firstRange = new range_1.Range(firstRangeStart, firstRangeEnd);
        const secondRange = new range_1.Range(secondRangeStart, secondRangeEnd);
        vimState.recordedState.transformations.push({ type: 'deleteRange', range: firstRange });
        vimState.recordedState.transformations.push({ type: 'deleteRange', range: secondRange });
    }
    static GetStartAndEndReplacements(replacement) {
        if (!replacement) {
            return { startReplace: '', endReplace: '' };
        }
        let startReplace = replacement;
        let endReplace = replacement;
        if (startReplace[0] === '<') {
            let tagName = /([-\w.]+)/.exec(startReplace);
            if (tagName) {
                endReplace = `</${tagName[1]}>`;
            }
            else {
                endReplace = '</' + startReplace.slice(1);
            }
        }
        if (startReplace.length === 1 && startReplace in matcher_1.PairMatcher.pairings) {
            endReplace = matcher_1.PairMatcher.pairings[startReplace].match;
            if (!matcher_1.PairMatcher.pairings[startReplace].isNextMatchForward) {
                [startReplace, endReplace] = [endReplace, startReplace];
            }
            else {
                startReplace = startReplace + ' ';
                endReplace = ' ' + endReplace;
            }
        }
        return { startReplace, endReplace };
    }
    // Returns true if it could actually find something to run surround on.
    static TryToExecuteSurround(vimState, position) {
        return __awaiter(this, void 0, void 0, function* () {
            const { target, operator } = vimState.surround;
            let replacement = vimState.surround.replacement;
            // Flag of whether or not html attributes should be retained
            let retainAttributes = false;
            if (operator === 'change' || operator === 'yank') {
                if (!replacement) {
                    return false;
                }
                // This is currently an incomplete tag. Check if we should finish it.
                if (replacement[0] === '<') {
                    // If enter is used, retain the html attributes if possible and consider this tag done
                    // if neither > or <enter> were pressed, this is not a complete tag so return false
                    if (replacement[replacement.length - 1] === '\n') {
                        replacement = replacement.slice(0, replacement.length - 1);
                        retainAttributes = true;
                    }
                    else if (replacement[replacement.length - 1] !== '>') {
                        return false;
                    }
                }
            }
            let { startReplace, endReplace } = this.GetStartAndEndReplacements(replacement);
            if (operator === 'yank') {
                if (!vimState.surround) {
                    return false;
                }
                if (!vimState.surround.range) {
                    return false;
                }
                let start = vimState.surround.range.start;
                let stop = vimState.surround.range.stop;
                if (textEditor_1.TextEditor.getCharAt(stop) !== ' ') {
                    stop = stop.getRight();
                }
                if (vimState.surround.isVisualLine) {
                    startReplace = startReplace + '\n';
                    endReplace = '\n' + endReplace;
                }
                vimState.recordedState.transformations.push({
                    type: 'insertText',
                    text: startReplace,
                    position: start,
                });
                vimState.recordedState.transformations.push({
                    type: 'insertText',
                    text: endReplace,
                    position: stop,
                });
                return CommandSurroundAddToReplacement_1.Finish(vimState);
            }
            let startReplaceRange;
            let endReplaceRange;
            let startDeleteRange;
            let endDeleteRange;
            const quoteMatches = [
                { char: "'", movement: () => new motion_2.MoveASingleQuotes() },
                { char: '"', movement: () => new motion_2.MoveADoubleQuotes() },
                { char: '`', movement: () => new motion_2.MoveABacktick() },
            ];
            for (const { char, movement } of quoteMatches) {
                if (char !== target) {
                    continue;
                }
                const { start, stop, failed } = yield movement().execAction(position, vimState);
                if (failed) {
                    return CommandSurroundAddToReplacement_1.Finish(vimState);
                }
                startReplaceRange = new range_1.Range(start, start.getRight());
                endReplaceRange = new range_1.Range(stop, stop.getRight());
            }
            const pairedMatchings = [
                { open: '{', close: '}', movement: () => new motion_2.MoveACurlyBrace() },
                { open: '[', close: ']', movement: () => new motion_2.MoveASquareBracket() },
                { open: '(', close: ')', movement: () => new motion_2.MoveAParentheses() },
                { open: '<', close: '>', movement: () => new motion_2.MoveACaret() },
            ];
            for (const { open, close, movement } of pairedMatchings) {
                if (target !== open && target !== close) {
                    continue;
                }
                let { start, stop, failed } = yield movement().execAction(position, vimState);
                if (failed) {
                    return CommandSurroundAddToReplacement_1.Finish(vimState);
                }
                stop = stop.getLeft();
                startReplaceRange = new range_1.Range(start, start.getRight());
                endReplaceRange = new range_1.Range(stop, stop.getRight());
                if (target === open) {
                    CommandSurroundAddToReplacement_1.RemoveWhitespace(vimState, start, stop);
                }
            }
            if (target === 't') {
                // `MoveInsideTag` must be run first as otherwise the search will
                // look for the next enclosing tag after having selected the first
                let innerTagContent = yield new motion_2.MoveInsideTag().execAction(position, vimState);
                let { start, stop, failed } = yield new motion_2.MoveAroundTag().execAction(position, vimState);
                if (failed || innerTagContent.failed) {
                    return CommandSurroundAddToReplacement_1.Finish(vimState);
                }
                stop = stop.getRight();
                innerTagContent.stop = innerTagContent.stop.getRight();
                if (failed) {
                    return CommandSurroundAddToReplacement_1.Finish(vimState);
                }
                startReplaceRange = new range_1.Range(start, start.getRight());
                endReplaceRange = new range_1.Range(innerTagContent.stop, innerTagContent.stop.getRight());
                if (retainAttributes) {
                    // Don't remove the attributes, just the tag name (one WORD)
                    const tagNameEnd = start.getCurrentBigWordEnd().getRight();
                    startDeleteRange = new range_1.Range(start.getRight(), tagNameEnd);
                }
                else {
                    startDeleteRange = new range_1.Range(start.getRight(), innerTagContent.start);
                }
                endDeleteRange = new range_1.Range(innerTagContent.stop.getRight(), stop);
            }
            if (operator === 'change') {
                if (!replacement) {
                    return false;
                }
                const wordMatchings = [
                    { char: 'w', movement: () => new textobject_1.SelectInnerWord(), addNewline: 'no' },
                    { char: 'p', movement: () => new textobject_1.SelectInnerParagraph(), addNewline: 'both' },
                    { char: 's', movement: () => new textobject_1.SelectInnerSentence(), addNewline: 'end-only' },
                    { char: 'W', movement: () => new textobject_1.SelectInnerBigWord(), addNewline: 'no' },
                ];
                for (const { char, movement, addNewline } of wordMatchings) {
                    if (target !== char) {
                        continue;
                    }
                    let { stop, start, failed } = (yield movement().execAction(position, vimState));
                    stop = stop.getRight();
                    if (failed) {
                        return CommandSurroundAddToReplacement_1.Finish(vimState);
                    }
                    if (addNewline === 'end-only' || addNewline === 'both') {
                        endReplace = '\n' + endReplace;
                    }
                    if (addNewline === 'both') {
                        startReplace += '\n';
                    }
                    vimState.recordedState.transformations.push({
                        type: 'insertText',
                        text: startReplace,
                        position: start,
                    });
                    vimState.recordedState.transformations.push({
                        type: 'insertText',
                        text: endReplace,
                        position: stop,
                    });
                    return CommandSurroundAddToReplacement_1.Finish(vimState);
                }
            }
            // We've got our ranges. Run the surround command with the appropriate operator.
            if (!startReplaceRange && !endReplaceRange && !startDeleteRange && !endDeleteRange) {
                return false;
            }
            if (operator === 'change') {
                if (!replacement) {
                    return false;
                }
                if (startReplaceRange) {
                    vimState.recordedState.transformations.push({
                        type: 'replaceText',
                        text: startReplace,
                        start: startReplaceRange.start,
                        end: startReplaceRange.stop,
                    });
                }
                if (endReplaceRange) {
                    vimState.recordedState.transformations.push({
                        type: 'replaceText',
                        text: endReplace,
                        start: endReplaceRange.start,
                        end: endReplaceRange.stop,
                    });
                }
                if (startDeleteRange) {
                    vimState.recordedState.transformations.push({
                        type: 'deleteRange',
                        range: startDeleteRange,
                    });
                }
                if (endDeleteRange) {
                    vimState.recordedState.transformations.push({ type: 'deleteRange', range: endDeleteRange });
                }
                return CommandSurroundAddToReplacement_1.Finish(vimState);
            }
            if (operator === 'delete') {
                if (startReplaceRange) {
                    vimState.recordedState.transformations.push({
                        type: 'deleteRange',
                        range: startReplaceRange,
                    });
                }
                if (endReplaceRange) {
                    vimState.recordedState.transformations.push({
                        type: 'deleteRange',
                        range: endReplaceRange,
                    });
                }
                if (startDeleteRange) {
                    vimState.recordedState.transformations.push({
                        type: 'deleteRange',
                        range: startDeleteRange,
                    });
                }
                if (endDeleteRange) {
                    vimState.recordedState.transformations.push({ type: 'deleteRange', range: endDeleteRange });
                }
                return CommandSurroundAddToReplacement_1.Finish(vimState);
            }
            return false;
        });
    }
};
CommandSurroundAddToReplacement = CommandSurroundAddToReplacement_1 = __decorate([
    base_1.RegisterAction
], CommandSurroundAddToReplacement);
exports.CommandSurroundAddToReplacement = CommandSurroundAddToReplacement;

//# sourceMappingURL=surround.js.map
