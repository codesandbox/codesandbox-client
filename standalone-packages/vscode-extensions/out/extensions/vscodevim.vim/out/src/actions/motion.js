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
var MoveFindForward_1, MoveFindBackward_1, MoveTilForward_1, MoveTilBackward_1, MoveToMatchingBracket_1;
"use strict";
const vscode = require("vscode");
const matcher_1 = require("./../common/matching/matcher");
const quoteMatcher_1 = require("./../common/matching/quoteMatcher");
const tagMatcher_1 = require("./../common/matching/tagMatcher");
const position_1 = require("./../common/motion/position");
const configuration_1 = require("./../configuration/configuration");
const mode_1 = require("./../mode/mode");
const register_1 = require("./../register/register");
const replaceState_1 = require("./../state/replaceState");
const vimState_1 = require("./../state/vimState");
const textEditor_1 = require("./../textEditor");
const base_1 = require("./base");
const base_2 = require("./base");
const operator_1 = require("./operator");
const wrapping_1 = require("./wrapping");
function isIMovement(o) {
    return o.start !== undefined && o.stop !== undefined;
}
exports.isIMovement = isIMovement;
var SelectionType;
(function (SelectionType) {
    SelectionType[SelectionType["Concatenating"] = 0] = "Concatenating";
    SelectionType[SelectionType["Expanding"] = 1] = "Expanding";
})(SelectionType || (SelectionType = {}));
/**
 * A movement is something like 'h', 'k', 'w', 'b', 'gg', etc.
 */
class BaseMovement extends base_1.BaseAction {
    constructor(keysPressed, isRepeat) {
        super();
        this.modes = [mode_1.ModeName.Normal, mode_1.ModeName.Visual, mode_1.ModeName.VisualLine, mode_1.ModeName.VisualBlock];
        this.isMotion = true;
        /**
         * If isJump is true, then the cursor position will be added to the jump list on completion.
         *
         * Default to false, as many motions operate on a single line and do not count as a jump.
         */
        this.isJump = false;
        /**
         * If movement can be repeated with semicolon or comma this will be true when
         * running the repetition.
         */
        this.isRepeat = false;
        /**
         * Whether we should change desiredColumn in VimState.
         */
        this.doesntChangeDesiredColumn = false;
        /**
         * This is for commands like $ which force the desired column to be at
         * the end of even the longest line.
         */
        this.setsDesiredColumnToEOL = false;
        this.minCount = 1;
        this.maxCount = 99999;
        this.selectionType = SelectionType.Concatenating;
        if (keysPressed) {
            this.keysPressed = keysPressed;
        }
        if (isRepeat) {
            this.isRepeat = isRepeat;
        }
    }
    /**
     * Run the movement a single time.
     *
     * Generally returns a new Position. If necessary, it can return an IMovement instead.
     * Note: If returning an IMovement, make sure that repeated actions on a
     * visual selection work. For example, V}}
     */
    execAction(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('Not implemented!');
        });
    }
    /**
     * Run the movement in an operator context a single time.
     *
     * Some movements operate over different ranges when used for operators.
     */
    execActionForOperator(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.execAction(position, vimState);
        });
    }
    /**
     * Run a movement count times.
     *
     * count: the number prefix the user entered, or 0 if they didn't enter one.
     */
    execActionWithCount(position, vimState, count) {
        return __awaiter(this, void 0, void 0, function* () {
            let recordedState = vimState.recordedState;
            let result = new position_1.Position(0, 0); // bogus init to satisfy typechecker
            let prevResult = undefined;
            let firstMovementStart = new position_1.Position(position.line, position.character);
            count = this.clampCount(count);
            for (let i = 0; i < count; i++) {
                const firstIteration = i === 0;
                const lastIteration = i === count - 1;
                result = yield this.createMovementResult(position, vimState, recordedState, lastIteration);
                if (result instanceof position_1.Position) {
                    position = result;
                }
                else if (isIMovement(result)) {
                    if (prevResult && result.failed) {
                        return prevResult;
                    }
                    if (firstIteration) {
                        firstMovementStart = new position_1.Position(result.start.line, result.start.character);
                    }
                    position = this.adjustPosition(position, result, lastIteration);
                    prevResult = result;
                }
            }
            if (this.selectionType === SelectionType.Concatenating && isIMovement(result)) {
                result.start = firstMovementStart;
            }
            return result;
        });
    }
    clampCount(count) {
        count = Math.max(count, this.minCount);
        count = Math.min(count, this.maxCount);
        return count;
    }
    createMovementResult(position, vimState, recordedState, lastIteration) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = recordedState.operator && lastIteration
                ? yield this.execActionForOperator(position, vimState)
                : yield this.execAction(position, vimState);
            return result;
        });
    }
    adjustPosition(position, result, lastIteration) {
        if (!lastIteration) {
            position = result.stop.getRightThroughLineBreaks();
        }
        return position;
    }
}
exports.BaseMovement = BaseMovement;
class ExpandingSelection extends BaseMovement {
    constructor() {
        super(...arguments);
        this.selectionType = SelectionType.Expanding;
    }
    adjustPosition(position, result, lastIteration) {
        if (!lastIteration) {
            position = result.stop;
        }
        return position;
    }
}
exports.ExpandingSelection = ExpandingSelection;
class MoveByScreenLine extends BaseMovement {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal, mode_1.ModeName.Visual, mode_1.ModeName.VisualLine];
        this.value = 1;
    }
    execAction(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            yield vscode.commands.executeCommand('cursorMove', {
                to: this.movementType,
                select: vimState.currentMode !== mode_1.ModeName.Normal,
                by: this.by,
                value: this.value,
            });
            if (vimState.currentMode === mode_1.ModeName.Normal) {
                return position_1.Position.FromVSCodePosition(vimState.editor.selection.active);
            }
            else {
                /**
                 * cursorMove command is handling the selection for us.
                 * So we are not following our design principal (do no real movement inside an action) here.
                 */
                let start = position_1.Position.FromVSCodePosition(vimState.editor.selection.start);
                let stop = position_1.Position.FromVSCodePosition(vimState.editor.selection.end);
                let curPos = position_1.Position.FromVSCodePosition(vimState.editor.selection.active);
                // We want to swap the cursor start stop positions based on which direction we are moving, up or down
                if (start.isEqual(curPos)) {
                    position = start;
                    [start, stop] = [stop, start];
                    start = start.getLeft();
                }
                return { start, stop };
            }
        });
    }
    execActionForOperator(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            yield vscode.commands.executeCommand('cursorMove', {
                to: this.movementType,
                select: true,
                by: this.by,
                value: this.value,
            });
            return {
                start: position_1.Position.FromVSCodePosition(vimState.editor.selection.start),
                stop: position_1.Position.FromVSCodePosition(vimState.editor.selection.end),
            };
        });
    }
}
class MoveByScreenLineMaintainDesiredColumn extends MoveByScreenLine {
    constructor() {
        super(...arguments);
        this.doesntChangeDesiredColumn = true;
    }
    execAction(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            let prevDesiredColumn = vimState.desiredColumn;
            let prevLine = vimState.editor.selection.active.line;
            yield vscode.commands.executeCommand('cursorMove', {
                to: this.movementType,
                select: vimState.currentMode !== mode_1.ModeName.Normal,
                by: this.by,
                value: this.value,
            });
            if (vimState.currentMode === mode_1.ModeName.Normal) {
                let returnedPos = position_1.Position.FromVSCodePosition(vimState.editor.selection.active);
                if (prevLine !== returnedPos.line) {
                    returnedPos = returnedPos.setLocation(returnedPos.line, prevDesiredColumn);
                }
                return returnedPos;
            }
            else {
                /**
                 * cursorMove command is handling the selection for us.
                 * So we are not following our design principal (do no real movement inside an action) here.
                 */
                let start = position_1.Position.FromVSCodePosition(vimState.editor.selection.start);
                let stop = position_1.Position.FromVSCodePosition(vimState.editor.selection.end);
                let curPos = position_1.Position.FromVSCodePosition(vimState.editor.selection.active);
                // We want to swap the cursor start stop positions based on which direction we are moving, up or down
                if (start.isEqual(curPos)) {
                    position = start;
                    [start, stop] = [stop, start];
                    start = start.getLeft();
                }
                return { start, stop };
            }
        });
    }
}
class MoveDownByScreenLineMaintainDesiredColumn extends MoveByScreenLineMaintainDesiredColumn {
    constructor() {
        super(...arguments);
        this.movementType = 'down';
        this.by = 'wrappedLine';
        this.value = 1;
    }
}
class MoveDownFoldFix extends MoveByScreenLineMaintainDesiredColumn {
    constructor() {
        super(...arguments);
        this.movementType = 'down';
        this.by = 'line';
        this.value = 1;
    }
    execAction(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            if (position.line >= textEditor_1.TextEditor.getLineCount() - 1) {
                return position;
            }
            let t;
            let prevLine = position.line;
            let prevChar = position.character;
            const prevDesiredColumn = vimState.desiredColumn;
            const moveDownByScreenLine = new MoveDownByScreenLine();
            do {
                t = (yield moveDownByScreenLine.execAction(position, vimState));
                t = t instanceof position_1.Position ? t : t.stop;
                const lineChanged = prevLine !== t.line;
                // wrappedLine movement goes to eol character only when at the last line
                // thus a column change on wrappedLine movement represents a visual last line
                const colChanged = prevChar !== t.character;
                if (lineChanged || !colChanged) {
                    break;
                }
                prevChar = t.character;
                prevLine = t.line;
            } while (t.line === position.line);
            // fix column change at last line caused by wrappedLine movement
            // causes cursor lag and flicker if a large repeat prefix is given to movement
            if (t.character !== prevDesiredColumn) {
                t = new position_1.Position(t.line, prevDesiredColumn);
            }
            return t;
        });
    }
}
let MoveDown = class MoveDown extends BaseMovement {
    constructor() {
        super(...arguments);
        this.keys = ['j'];
        this.doesntChangeDesiredColumn = true;
    }
    execAction(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            if (configuration_1.configuration.foldfix && vimState.currentMode !== mode_1.ModeName.VisualBlock) {
                return new MoveDownFoldFix().execAction(position, vimState);
            }
            return position.getDown(vimState.desiredColumn);
        });
    }
    execActionForOperator(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            vimState.currentRegisterMode = register_1.RegisterMode.LineWise;
            return position.getDown(position.getLineEnd().character);
        });
    }
};
MoveDown = __decorate([
    base_2.RegisterAction
], MoveDown);
let MoveDownArrow = class MoveDownArrow extends MoveDown {
    constructor() {
        super(...arguments);
        this.keys = ['<down>'];
    }
};
MoveDownArrow = __decorate([
    base_2.RegisterAction
], MoveDownArrow);
class MoveUpByScreenLineMaintainDesiredColumn extends MoveByScreenLineMaintainDesiredColumn {
    constructor() {
        super(...arguments);
        this.movementType = 'up';
        this.by = 'wrappedLine';
        this.value = 1;
    }
}
let MoveUp = class MoveUp extends BaseMovement {
    constructor() {
        super(...arguments);
        this.keys = ['k'];
        this.doesntChangeDesiredColumn = true;
    }
    execAction(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            if (configuration_1.configuration.foldfix && vimState.currentMode !== mode_1.ModeName.VisualBlock) {
                return new MoveUpFoldFix().execAction(position, vimState);
            }
            return position.getUp(vimState.desiredColumn);
        });
    }
    execActionForOperator(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            vimState.currentRegisterMode = register_1.RegisterMode.LineWise;
            return position.getUp(position.getLineEnd().character);
        });
    }
};
MoveUp = __decorate([
    base_2.RegisterAction
], MoveUp);
let MoveUpFoldFix = class MoveUpFoldFix extends MoveByScreenLineMaintainDesiredColumn {
    constructor() {
        super(...arguments);
        this.movementType = 'up';
        this.by = 'line';
        this.value = 1;
    }
    execAction(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            if (position.line === 0) {
                return position;
            }
            let t;
            const prevDesiredColumn = vimState.desiredColumn;
            const moveUpByScreenLine = new MoveUpByScreenLine();
            do {
                t = (yield moveUpByScreenLine.execAction(position, vimState));
                t = t instanceof position_1.Position ? t : t.stop;
            } while (t.line === position.line);
            // fix column change at last line caused by wrappedLine movement
            // causes cursor lag and flicker if a large repeat prefix is given to movement
            if (t.character !== prevDesiredColumn) {
                t = new position_1.Position(t.line, prevDesiredColumn);
            }
            return t;
        });
    }
};
MoveUpFoldFix = __decorate([
    base_2.RegisterAction
], MoveUpFoldFix);
let MoveUpArrow = class MoveUpArrow extends MoveUp {
    constructor() {
        super(...arguments);
        this.keys = ['<up>'];
    }
};
MoveUpArrow = __decorate([
    base_2.RegisterAction
], MoveUpArrow);
let ArrowsInReplaceMode = class ArrowsInReplaceMode extends BaseMovement {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Replace];
        this.keys = [['<up>'], ['<down>'], ['<left>'], ['<right>']];
    }
    execAction(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            let newPosition = position;
            switch (this.keysPressed[0]) {
                case '<up>':
                    newPosition = (yield new MoveUpArrow().execAction(position, vimState));
                    break;
                case '<down>':
                    newPosition = (yield new MoveDownArrow().execAction(position, vimState));
                    break;
                case '<left>':
                    newPosition = yield new MoveLeftArrow().execAction(position, vimState);
                    break;
                case '<right>':
                    newPosition = yield new MoveRightArrow().execAction(position, vimState);
                    break;
                default:
                    break;
            }
            vimState.replaceState = new replaceState_1.ReplaceState(newPosition);
            return newPosition;
        });
    }
};
ArrowsInReplaceMode = __decorate([
    base_2.RegisterAction
], ArrowsInReplaceMode);
let UpArrowInReplaceMode = class UpArrowInReplaceMode extends ArrowsInReplaceMode {
    constructor() {
        super(...arguments);
        this.keys = [['<up>']];
    }
};
UpArrowInReplaceMode = __decorate([
    base_2.RegisterAction
], UpArrowInReplaceMode);
let DownArrowInReplaceMode = class DownArrowInReplaceMode extends ArrowsInReplaceMode {
    constructor() {
        super(...arguments);
        this.keys = [['<down>']];
    }
};
DownArrowInReplaceMode = __decorate([
    base_2.RegisterAction
], DownArrowInReplaceMode);
let LeftArrowInReplaceMode = class LeftArrowInReplaceMode extends ArrowsInReplaceMode {
    constructor() {
        super(...arguments);
        this.keys = [['<left>']];
    }
};
LeftArrowInReplaceMode = __decorate([
    base_2.RegisterAction
], LeftArrowInReplaceMode);
let RightArrowInReplaceMode = class RightArrowInReplaceMode extends ArrowsInReplaceMode {
    constructor() {
        super(...arguments);
        this.keys = [['<right>']];
    }
};
RightArrowInReplaceMode = __decorate([
    base_2.RegisterAction
], RightArrowInReplaceMode);
let CommandNextSearchMatch = class CommandNextSearchMatch extends BaseMovement {
    constructor() {
        super(...arguments);
        this.keys = ['n'];
        this.isJump = true;
    }
    execAction(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchState = vimState.globalState.searchState;
            if (!searchState || searchState.searchString === '') {
                return position;
            }
            // Turn one of the highlighting flags back on (turned off with :nohl)
            vimState.globalState.hl = true;
            if (position.getRight().isEqual(position.getLineEnd())) {
                return searchState.getNextSearchMatchPosition(position.getRight()).pos;
            }
            // Turn one of the highlighting flags back on (turned off with :nohl)
            return searchState.getNextSearchMatchPosition(position).pos;
        });
    }
};
CommandNextSearchMatch = __decorate([
    base_2.RegisterAction
], CommandNextSearchMatch);
let CommandPreviousSearchMatch = class CommandPreviousSearchMatch extends BaseMovement {
    constructor() {
        super(...arguments);
        this.keys = ['N'];
        this.isJump = true;
    }
    execAction(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchState = vimState.globalState.searchState;
            if (!searchState || searchState.searchString === '') {
                return position;
            }
            // Turn one of the highlighting flags back on (turned off with :nohl)
            vimState.globalState.hl = true;
            return searchState.getNextSearchMatchPosition(position, -1).pos;
        });
    }
};
CommandPreviousSearchMatch = __decorate([
    base_2.RegisterAction
], CommandPreviousSearchMatch);
let MarkMovementBOL = class MarkMovementBOL extends BaseMovement {
    constructor() {
        super(...arguments);
        this.keys = ["'", '<character>'];
        this.isJump = true;
    }
    execAction(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            const markName = this.keysPressed[1];
            const mark = vimState.historyTracker.getMark(markName);
            vimState.currentRegisterMode = register_1.RegisterMode.LineWise;
            return mark.position.getFirstLineNonBlankChar();
        });
    }
};
MarkMovementBOL = __decorate([
    base_2.RegisterAction
], MarkMovementBOL);
exports.MarkMovementBOL = MarkMovementBOL;
let MarkMovement = class MarkMovement extends BaseMovement {
    constructor() {
        super(...arguments);
        this.keys = ['`', '<character>'];
        this.isJump = true;
    }
    execAction(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            const markName = this.keysPressed[1];
            const mark = vimState.historyTracker.getMark(markName);
            return mark.position;
        });
    }
};
MarkMovement = __decorate([
    base_2.RegisterAction
], MarkMovement);
exports.MarkMovement = MarkMovement;
let MoveLeft = class MoveLeft extends BaseMovement {
    constructor() {
        super(...arguments);
        this.keys = ['h'];
    }
    execAction(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            if (wrapping_1.shouldWrapKey(vimState, this.keysPressed)) {
                return position.getLeftThroughLineBreaks();
            }
            return position.getLeft();
        });
    }
};
MoveLeft = __decorate([
    base_2.RegisterAction
], MoveLeft);
exports.MoveLeft = MoveLeft;
let MoveLeftArrow = class MoveLeftArrow extends MoveLeft {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal, mode_1.ModeName.Visual, mode_1.ModeName.VisualLine, mode_1.ModeName.VisualBlock];
        this.keys = ['<left>'];
    }
};
MoveLeftArrow = __decorate([
    base_2.RegisterAction
], MoveLeftArrow);
let BackSpaceInNormalMode = class BackSpaceInNormalMode extends BaseMovement {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal];
        this.keys = ['<BS>'];
    }
    execAction(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            return position.getLeftThroughLineBreaks();
        });
    }
};
BackSpaceInNormalMode = __decorate([
    base_2.RegisterAction
], BackSpaceInNormalMode);
let MoveRight = class MoveRight extends BaseMovement {
    constructor() {
        super(...arguments);
        this.keys = ['l'];
    }
    execAction(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            if (wrapping_1.shouldWrapKey(vimState, this.keysPressed)) {
                const includeEol = vimState.currentMode === mode_1.ModeName.Insert;
                return position.getRightThroughLineBreaks(includeEol);
            }
            return position.getRight();
        });
    }
};
MoveRight = __decorate([
    base_2.RegisterAction
], MoveRight);
let MoveRightArrow = class MoveRightArrow extends MoveRight {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal, mode_1.ModeName.Visual, mode_1.ModeName.VisualLine, mode_1.ModeName.VisualBlock];
        this.keys = ['<right>'];
    }
};
MoveRightArrow = __decorate([
    base_2.RegisterAction
], MoveRightArrow);
let MoveRightWithSpace = class MoveRightWithSpace extends BaseMovement {
    constructor() {
        super(...arguments);
        this.keys = [' '];
    }
    execAction(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            return position.getRightThroughLineBreaks();
        });
    }
};
MoveRightWithSpace = __decorate([
    base_2.RegisterAction
], MoveRightWithSpace);
let MoveDownNonBlank = class MoveDownNonBlank extends BaseMovement {
    constructor() {
        super(...arguments);
        this.keys = ['+'];
    }
    execActionWithCount(position, vimState, count) {
        return __awaiter(this, void 0, void 0, function* () {
            vimState.currentRegisterMode = register_1.RegisterMode.LineWise;
            return position.getDownByCount(Math.max(count, 1)).getFirstLineNonBlankChar();
        });
    }
};
MoveDownNonBlank = __decorate([
    base_2.RegisterAction
], MoveDownNonBlank);
let MoveUpNonBlank = class MoveUpNonBlank extends BaseMovement {
    constructor() {
        super(...arguments);
        this.keys = ['-'];
    }
    execActionWithCount(position, vimState, count) {
        return __awaiter(this, void 0, void 0, function* () {
            vimState.currentRegisterMode = register_1.RegisterMode.LineWise;
            return position.getUpByCount(Math.max(count, 1)).getFirstLineNonBlankChar();
        });
    }
};
MoveUpNonBlank = __decorate([
    base_2.RegisterAction
], MoveUpNonBlank);
let MoveDownUnderscore = class MoveDownUnderscore extends BaseMovement {
    constructor() {
        super(...arguments);
        this.keys = ['_'];
    }
    execActionWithCount(position, vimState, count) {
        return __awaiter(this, void 0, void 0, function* () {
            return position.getDownByCount(Math.max(count - 1, 0)).getFirstLineNonBlankChar();
        });
    }
};
MoveDownUnderscore = __decorate([
    base_2.RegisterAction
], MoveDownUnderscore);
let MoveToColumn = class MoveToColumn extends BaseMovement {
    constructor() {
        super(...arguments);
        this.keys = ['|'];
    }
    execActionWithCount(position, vimState, count) {
        return __awaiter(this, void 0, void 0, function* () {
            return new position_1.Position(position.line, Math.max(0, count - 1));
        });
    }
};
MoveToColumn = __decorate([
    base_2.RegisterAction
], MoveToColumn);
let MoveFindForward = MoveFindForward_1 = class MoveFindForward extends BaseMovement {
    constructor() {
        super(...arguments);
        this.keys = ['f', '<character>'];
    }
    execActionWithCount(position, vimState, count) {
        return __awaiter(this, void 0, void 0, function* () {
            count = count || 1;
            const toFind = this.keysPressed[1];
            let result = position.findForwards(toFind, count);
            if (!result) {
                return { start: position, stop: position, failed: true };
            }
            if (vimState.recordedState.operator) {
                result = result.getRight();
            }
            if (!this.isRepeat &&
                (!vimState.recordedState.operator || !(isIMovement(result) && result.failed))) {
                vimState_1.VimState.lastSemicolonRepeatableMovement = new MoveFindForward_1(this.keysPressed, true);
                vimState_1.VimState.lastCommaRepeatableMovement = new MoveFindBackward(this.keysPressed, true);
            }
            return result;
        });
    }
};
MoveFindForward = MoveFindForward_1 = __decorate([
    base_2.RegisterAction
], MoveFindForward);
let MoveFindBackward = MoveFindBackward_1 = class MoveFindBackward extends BaseMovement {
    constructor() {
        super(...arguments);
        this.keys = ['F', '<character>'];
    }
    execActionWithCount(position, vimState, count) {
        return __awaiter(this, void 0, void 0, function* () {
            count = count || 1;
            const toFind = this.keysPressed[1];
            let result = position.findBackwards(toFind, count);
            if (!result) {
                return { start: position, stop: position, failed: true };
            }
            if (!this.isRepeat &&
                (!vimState.recordedState.operator || !(isIMovement(result) && result.failed))) {
                vimState_1.VimState.lastSemicolonRepeatableMovement = new MoveFindBackward_1(this.keysPressed, true);
                vimState_1.VimState.lastCommaRepeatableMovement = new MoveFindForward(this.keysPressed, true);
            }
            return result;
        });
    }
};
MoveFindBackward = MoveFindBackward_1 = __decorate([
    base_2.RegisterAction
], MoveFindBackward);
let MoveTilForward = MoveTilForward_1 = class MoveTilForward extends BaseMovement {
    constructor() {
        super(...arguments);
        this.keys = ['t', '<character>'];
    }
    execActionWithCount(position, vimState, count) {
        return __awaiter(this, void 0, void 0, function* () {
            count = count || 1;
            const toFind = this.keysPressed[1];
            let result = position.tilForwards(toFind, count);
            // For t<character> vim executes ; as 2; and , as 2,
            if (result && this.isRepeat && position.isEqual(result) && count === 1) {
                result = position.tilForwards(toFind, 2);
            }
            if (!result) {
                return { start: position, stop: position, failed: true };
            }
            if (vimState.recordedState.operator) {
                result = result.getRight();
            }
            if (!this.isRepeat &&
                (!vimState.recordedState.operator || !(isIMovement(result) && result.failed))) {
                vimState_1.VimState.lastSemicolonRepeatableMovement = new MoveTilForward_1(this.keysPressed, true);
                vimState_1.VimState.lastCommaRepeatableMovement = new MoveTilBackward(this.keysPressed, true);
            }
            return result;
        });
    }
};
MoveTilForward = MoveTilForward_1 = __decorate([
    base_2.RegisterAction
], MoveTilForward);
let MoveTilBackward = MoveTilBackward_1 = class MoveTilBackward extends BaseMovement {
    constructor() {
        super(...arguments);
        this.keys = ['T', '<character>'];
    }
    execActionWithCount(position, vimState, count) {
        return __awaiter(this, void 0, void 0, function* () {
            count = count || 1;
            const toFind = this.keysPressed[1];
            let result = position.tilBackwards(toFind, count);
            // For T<character> vim executes ; as 2; and , as 2,
            if (result && this.isRepeat && position.isEqual(result) && count === 1) {
                result = position.tilBackwards(toFind, 2);
            }
            if (!result) {
                return { start: position, stop: position, failed: true };
            }
            if (!this.isRepeat &&
                (!vimState.recordedState.operator || !(isIMovement(result) && result.failed))) {
                vimState_1.VimState.lastSemicolonRepeatableMovement = new MoveTilBackward_1(this.keysPressed, true);
                vimState_1.VimState.lastCommaRepeatableMovement = new MoveTilForward(this.keysPressed, true);
            }
            return result;
        });
    }
};
MoveTilBackward = MoveTilBackward_1 = __decorate([
    base_2.RegisterAction
], MoveTilBackward);
let MoveRepeat = class MoveRepeat extends BaseMovement {
    constructor() {
        super(...arguments);
        this.keys = [';'];
    }
    execActionWithCount(position, vimState, count) {
        return __awaiter(this, void 0, void 0, function* () {
            const movement = vimState_1.VimState.lastSemicolonRepeatableMovement;
            if (movement) {
                return yield movement.execActionWithCount(position, vimState, count);
            }
            return position;
        });
    }
};
MoveRepeat = __decorate([
    base_2.RegisterAction
], MoveRepeat);
let MoveRepeatReversed = class MoveRepeatReversed extends BaseMovement {
    constructor() {
        super(...arguments);
        this.keys = [','];
    }
    execActionWithCount(position, vimState, count) {
        return __awaiter(this, void 0, void 0, function* () {
            const movement = vimState_1.VimState.lastCommaRepeatableMovement;
            if (movement) {
                return yield movement.execActionWithCount(position, vimState, count);
            }
            return position;
        });
    }
};
MoveRepeatReversed = __decorate([
    base_2.RegisterAction
], MoveRepeatReversed);
let MoveLineEnd = class MoveLineEnd extends BaseMovement {
    constructor() {
        super(...arguments);
        this.keys = [['$'], ['<end>'], ['<D-right>']];
        this.setsDesiredColumnToEOL = true;
    }
    execActionWithCount(position, vimState, count) {
        return __awaiter(this, void 0, void 0, function* () {
            return position.getDownByCount(Math.max(count - 1, 0)).getLineEnd();
        });
    }
};
MoveLineEnd = __decorate([
    base_2.RegisterAction
], MoveLineEnd);
let MoveLineBegin = class MoveLineBegin extends BaseMovement {
    constructor() {
        super(...arguments);
        this.keys = [['0'], ['<home>'], ['<D-left>']];
    }
    execAction(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            return position.getLineBegin();
        });
    }
    doesActionApply(vimState, keysPressed) {
        return super.doesActionApply(vimState, keysPressed) && vimState.recordedState.count === 0;
    }
    couldActionApply(vimState, keysPressed) {
        return super.couldActionApply(vimState, keysPressed) && vimState.recordedState.count === 0;
    }
};
MoveLineBegin = __decorate([
    base_2.RegisterAction
], MoveLineBegin);
let MoveScreenLineBegin = class MoveScreenLineBegin extends MoveByScreenLine {
    constructor() {
        super(...arguments);
        this.keys = ['g', '0'];
        this.movementType = 'wrappedLineStart';
    }
};
MoveScreenLineBegin = __decorate([
    base_2.RegisterAction
], MoveScreenLineBegin);
let MoveScreenNonBlank = class MoveScreenNonBlank extends MoveByScreenLine {
    constructor() {
        super(...arguments);
        this.keys = ['g', '^'];
        this.movementType = 'wrappedLineFirstNonWhitespaceCharacter';
    }
};
MoveScreenNonBlank = __decorate([
    base_2.RegisterAction
], MoveScreenNonBlank);
let MoveScreenLineEnd = class MoveScreenLineEnd extends MoveByScreenLine {
    constructor() {
        super(...arguments);
        this.keys = ['g', '$'];
        this.movementType = 'wrappedLineEnd';
    }
};
MoveScreenLineEnd = __decorate([
    base_2.RegisterAction
], MoveScreenLineEnd);
let MoveScreenLineEndNonBlank = class MoveScreenLineEndNonBlank extends MoveByScreenLine {
    constructor() {
        super(...arguments);
        this.keys = ['g', '_'];
        this.movementType = 'wrappedLineLastNonWhitespaceCharacter';
    }
    execActionWithCount(position, vimState, count) {
        return __awaiter(this, void 0, void 0, function* () {
            count = count || 1;
            const pos = yield this.execAction(position, vimState);
            const newPos = pos;
            // If in visual, return a selection
            if (pos instanceof position_1.Position) {
                return pos.getDownByCount(count - 1);
            }
            else if (isIMovement(pos)) {
                return { start: pos.start, stop: pos.stop.getDownByCount(count - 1).getLeft() };
            }
            return newPos.getDownByCount(count - 1);
        });
    }
};
MoveScreenLineEndNonBlank = __decorate([
    base_2.RegisterAction
], MoveScreenLineEndNonBlank);
let MoveScreenLineCenter = class MoveScreenLineCenter extends MoveByScreenLine {
    constructor() {
        super(...arguments);
        this.keys = ['g', 'm'];
        this.movementType = 'wrappedLineColumnCenter';
    }
};
MoveScreenLineCenter = __decorate([
    base_2.RegisterAction
], MoveScreenLineCenter);
let MoveUpByScreenLine = class MoveUpByScreenLine extends MoveByScreenLine {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Insert, mode_1.ModeName.Normal, mode_1.ModeName.Visual];
        this.keys = [['g', 'k'], ['g', '<up>']];
        this.movementType = 'up';
        this.by = 'wrappedLine';
        this.value = 1;
    }
};
MoveUpByScreenLine = __decorate([
    base_2.RegisterAction
], MoveUpByScreenLine);
exports.MoveUpByScreenLine = MoveUpByScreenLine;
let MoveDownByScreenLine = class MoveDownByScreenLine extends MoveByScreenLine {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Insert, mode_1.ModeName.Normal, mode_1.ModeName.Visual];
        this.keys = [['g', 'j'], ['g', '<down>']];
        this.movementType = 'down';
        this.by = 'wrappedLine';
        this.value = 1;
    }
};
MoveDownByScreenLine = __decorate([
    base_2.RegisterAction
], MoveDownByScreenLine);
// Because we can't support moving by screen line when in visualLine mode,
// we change to moving by regular line in visualLine mode. We can't move by
// screen line is that our ranges only support a start and stop attribute,
// and moving by screen line just snaps us back to the original position.
// Check PR #1600 for discussion.
let MoveUpByScreenLineVisualLine = class MoveUpByScreenLineVisualLine extends MoveByScreenLine {
    // Because we can't support moving by screen line when in visualLine mode,
    // we change to moving by regular line in visualLine mode. We can't move by
    // screen line is that our ranges only support a start and stop attribute,
    // and moving by screen line just snaps us back to the original position.
    // Check PR #1600 for discussion.
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.VisualLine];
        this.keys = [['g', 'k'], ['g', '<up>']];
        this.movementType = 'up';
        this.by = 'line';
        this.value = 1;
    }
};
MoveUpByScreenLineVisualLine = __decorate([
    base_2.RegisterAction
], MoveUpByScreenLineVisualLine);
let MoveDownByScreenLineVisualLine = class MoveDownByScreenLineVisualLine extends MoveByScreenLine {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.VisualLine];
        this.keys = [['g', 'j'], ['g', '<down>']];
        this.movementType = 'down';
        this.by = 'line';
        this.value = 1;
    }
};
MoveDownByScreenLineVisualLine = __decorate([
    base_2.RegisterAction
], MoveDownByScreenLineVisualLine);
let MoveUpByScreenLineVisualBlock = class MoveUpByScreenLineVisualBlock extends BaseMovement {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.VisualBlock];
        this.keys = [['g', 'k'], ['g', '<up>']];
        this.doesntChangeDesiredColumn = true;
    }
    execAction(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            return position.getUp(vimState.desiredColumn);
        });
    }
    execActionForOperator(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            vimState.currentRegisterMode = register_1.RegisterMode.LineWise;
            return position.getUp(position.getLineEnd().character);
        });
    }
};
MoveUpByScreenLineVisualBlock = __decorate([
    base_2.RegisterAction
], MoveUpByScreenLineVisualBlock);
let MoveDownByScreenLineVisualBlock = class MoveDownByScreenLineVisualBlock extends BaseMovement {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.VisualBlock];
        this.keys = [['g', 'j'], ['g', '<down>']];
        this.doesntChangeDesiredColumn = true;
    }
    execAction(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            return position.getDown(vimState.desiredColumn);
        });
    }
    execActionForOperator(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            vimState.currentRegisterMode = register_1.RegisterMode.LineWise;
            return position.getDown(position.getLineEnd().character);
        });
    }
};
MoveDownByScreenLineVisualBlock = __decorate([
    base_2.RegisterAction
], MoveDownByScreenLineVisualBlock);
let MoveScreenToRight = class MoveScreenToRight extends MoveByScreenLine {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Insert, mode_1.ModeName.Normal, mode_1.ModeName.Visual, mode_1.ModeName.VisualLine];
        this.keys = ['z', 'h'];
        this.movementType = 'right';
        this.by = 'character';
        this.value = 1;
    }
    doesActionApply(vimState, keysPressed) {
        // Don't run if there's an operator because the Sneak plugin uses <operator>z
        return (super.doesActionApply(vimState, keysPressed) && vimState.recordedState.operator === undefined);
    }
};
MoveScreenToRight = __decorate([
    base_2.RegisterAction
], MoveScreenToRight);
let MoveScreenToLeft = class MoveScreenToLeft extends MoveByScreenLine {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Insert, mode_1.ModeName.Normal, mode_1.ModeName.Visual, mode_1.ModeName.VisualLine];
        this.keys = ['z', 'l'];
        this.movementType = 'left';
        this.by = 'character';
        this.value = 1;
    }
    doesActionApply(vimState, keysPressed) {
        // Don't run if there's an operator because the Sneak plugin uses <operator>z
        return (super.doesActionApply(vimState, keysPressed) && vimState.recordedState.operator === undefined);
    }
};
MoveScreenToLeft = __decorate([
    base_2.RegisterAction
], MoveScreenToLeft);
let MoveScreenToRightHalf = class MoveScreenToRightHalf extends MoveByScreenLine {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Insert, mode_1.ModeName.Normal, mode_1.ModeName.Visual, mode_1.ModeName.VisualLine];
        this.keys = ['z', 'H'];
        this.movementType = 'right';
        this.by = 'halfLine';
        this.value = 1;
    }
    doesActionApply(vimState, keysPressed) {
        // Don't run if there's an operator because the Sneak plugin uses <operator>z
        return (super.doesActionApply(vimState, keysPressed) && vimState.recordedState.operator === undefined);
    }
};
MoveScreenToRightHalf = __decorate([
    base_2.RegisterAction
], MoveScreenToRightHalf);
let MoveScreenToLeftHalf = class MoveScreenToLeftHalf extends MoveByScreenLine {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Insert, mode_1.ModeName.Normal, mode_1.ModeName.Visual, mode_1.ModeName.VisualLine];
        this.keys = ['z', 'L'];
        this.movementType = 'left';
        this.by = 'halfLine';
        this.value = 1;
        this.isJump = true;
    }
    doesActionApply(vimState, keysPressed) {
        // Don't run if there's an operator because the Sneak plugin uses <operator>z
        return (super.doesActionApply(vimState, keysPressed) && vimState.recordedState.operator === undefined);
    }
};
MoveScreenToLeftHalf = __decorate([
    base_2.RegisterAction
], MoveScreenToLeftHalf);
let MoveToLineFromViewPortTop = class MoveToLineFromViewPortTop extends MoveByScreenLine {
    constructor() {
        super(...arguments);
        this.keys = ['H'];
        this.movementType = 'viewPortTop';
        this.by = 'line';
        this.value = 1;
        this.isJump = true;
    }
    execActionWithCount(position, vimState, count) {
        return __awaiter(this, void 0, void 0, function* () {
            this.value = count < 1 ? 1 : count;
            return yield this.execAction(position, vimState);
        });
    }
};
MoveToLineFromViewPortTop = __decorate([
    base_2.RegisterAction
], MoveToLineFromViewPortTop);
let MoveToLineFromViewPortBottom = class MoveToLineFromViewPortBottom extends MoveByScreenLine {
    constructor() {
        super(...arguments);
        this.keys = ['L'];
        this.movementType = 'viewPortBottom';
        this.by = 'line';
        this.value = 1;
        this.isJump = true;
    }
    execActionWithCount(position, vimState, count) {
        return __awaiter(this, void 0, void 0, function* () {
            this.value = count < 1 ? 1 : count;
            return yield this.execAction(position, vimState);
        });
    }
};
MoveToLineFromViewPortBottom = __decorate([
    base_2.RegisterAction
], MoveToLineFromViewPortBottom);
let MoveToMiddleLineInViewPort = class MoveToMiddleLineInViewPort extends MoveByScreenLine {
    constructor() {
        super(...arguments);
        this.keys = ['M'];
        this.movementType = 'viewPortCenter';
        this.by = 'line';
        this.isJump = true;
    }
};
MoveToMiddleLineInViewPort = __decorate([
    base_2.RegisterAction
], MoveToMiddleLineInViewPort);
let MoveNonBlank = class MoveNonBlank extends BaseMovement {
    constructor() {
        super(...arguments);
        this.keys = ['^'];
    }
    execAction(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            return position.getFirstLineNonBlankChar();
        });
    }
};
MoveNonBlank = __decorate([
    base_2.RegisterAction
], MoveNonBlank);
let MoveNextLineNonBlank = class MoveNextLineNonBlank extends BaseMovement {
    constructor() {
        super(...arguments);
        this.keys = ['\n'];
    }
    execActionWithCount(position, vimState, count) {
        return __awaiter(this, void 0, void 0, function* () {
            vimState.currentRegisterMode = register_1.RegisterMode.LineWise;
            // Count === 0 if just pressing enter in normal mode, need to still go down 1 line
            if (count === 0) {
                count++;
            }
            return position.getDownByCount(count).getFirstLineNonBlankChar();
        });
    }
};
MoveNextLineNonBlank = __decorate([
    base_2.RegisterAction
], MoveNextLineNonBlank);
let MoveNonBlankFirst = class MoveNonBlankFirst extends BaseMovement {
    constructor() {
        super(...arguments);
        this.keys = ['g', 'g'];
        this.isJump = true;
    }
    execActionWithCount(position, vimState, count) {
        return __awaiter(this, void 0, void 0, function* () {
            if (count === 0) {
                return position.getDocumentBegin().getFirstLineNonBlankChar();
            }
            return new position_1.Position(count - 1, 0).getFirstLineNonBlankChar();
        });
    }
};
MoveNonBlankFirst = __decorate([
    base_2.RegisterAction
], MoveNonBlankFirst);
let MoveNonBlankLast = class MoveNonBlankLast extends BaseMovement {
    constructor() {
        super(...arguments);
        this.keys = ['G'];
        this.isJump = true;
    }
    execActionWithCount(position, vimState, count) {
        return __awaiter(this, void 0, void 0, function* () {
            let stop;
            if (count === 0) {
                stop = new position_1.Position(textEditor_1.TextEditor.getLineCount() - 1, 0);
            }
            else {
                stop = new position_1.Position(Math.min(count, textEditor_1.TextEditor.getLineCount()) - 1, 0);
            }
            return {
                start: vimState.cursorStartPosition,
                stop: stop,
                registerMode: register_1.RegisterMode.LineWise,
            };
        });
    }
};
MoveNonBlankLast = __decorate([
    base_2.RegisterAction
], MoveNonBlankLast);
let MoveWordBegin = class MoveWordBegin extends BaseMovement {
    constructor() {
        super(...arguments);
        this.keys = ['w'];
    }
    execAction(position, vimState, isLastIteration = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (isLastIteration &&
                !configuration_1.configuration.changeWordIncludesWhitespace &&
                vimState.recordedState.operator instanceof operator_1.ChangeOperator) {
                if (textEditor_1.TextEditor.getLineAt(position).text.length < 1) {
                    return position;
                }
                const line = textEditor_1.TextEditor.getLineAt(position).text;
                const char = line[position.character];
                /*
                From the Vim manual:
          
                Special case: "cw" and "cW" are treated like "ce" and "cE" if the cursor is
                on a non-blank.  This is because "cw" is interpreted as change-word, and a
                word does not include the following white space.
                */
                if (' \t'.indexOf(char) >= 0) {
                    return position.getWordRight();
                }
                else {
                    return position.getCurrentWordEnd(true).getRight();
                }
            }
            else {
                return position.getWordRight();
            }
        });
    }
    execActionForOperator(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.execAction(position, vimState, true);
            /*
            From the Vim documentation:
        
            Another special case: When using the "w" motion in combination with an
            operator and the last word moved over is at the end of a line, the end of
            that word becomes the end of the operated text, not the first word in the
            next line.
            */
            if (result.line > position.line + 1 ||
                (result.line === position.line + 1 && result.isFirstWordOfLine())) {
                return position.getLineEnd();
            }
            if (result.isLineEnd()) {
                return new position_1.Position(result.line, result.character + 1);
            }
            return result;
        });
    }
};
MoveWordBegin = __decorate([
    base_2.RegisterAction
], MoveWordBegin);
exports.MoveWordBegin = MoveWordBegin;
let MoveFullWordBegin = class MoveFullWordBegin extends BaseMovement {
    constructor() {
        super(...arguments);
        this.keys = ['W'];
    }
    execAction(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!configuration_1.configuration.changeWordIncludesWhitespace &&
                vimState.recordedState.operator instanceof operator_1.ChangeOperator) {
                // TODO use execForOperator? Or maybe dont?
                // See note for w
                return position.getCurrentBigWordEnd().getRight();
            }
            else {
                return position.getBigWordRight();
            }
        });
    }
};
MoveFullWordBegin = __decorate([
    base_2.RegisterAction
], MoveFullWordBegin);
let MoveWordEnd = class MoveWordEnd extends BaseMovement {
    constructor() {
        super(...arguments);
        this.keys = ['e'];
    }
    execAction(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            return position.getCurrentWordEnd();
        });
    }
    execActionForOperator(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            let end = position.getCurrentWordEnd();
            return new position_1.Position(end.line, end.character + 1);
        });
    }
};
MoveWordEnd = __decorate([
    base_2.RegisterAction
], MoveWordEnd);
let MoveFullWordEnd = class MoveFullWordEnd extends BaseMovement {
    constructor() {
        super(...arguments);
        this.keys = ['E'];
    }
    execAction(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            return position.getCurrentBigWordEnd();
        });
    }
    execActionForOperator(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            return position.getCurrentBigWordEnd().getRight();
        });
    }
};
MoveFullWordEnd = __decorate([
    base_2.RegisterAction
], MoveFullWordEnd);
let MoveLastWordEnd = class MoveLastWordEnd extends BaseMovement {
    constructor() {
        super(...arguments);
        this.keys = ['g', 'e'];
    }
    execAction(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            return position.getLastWordEnd();
        });
    }
};
MoveLastWordEnd = __decorate([
    base_2.RegisterAction
], MoveLastWordEnd);
let MoveLastFullWordEnd = class MoveLastFullWordEnd extends BaseMovement {
    constructor() {
        super(...arguments);
        this.keys = ['g', 'E'];
    }
    execAction(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            return position.getLastBigWordEnd();
        });
    }
};
MoveLastFullWordEnd = __decorate([
    base_2.RegisterAction
], MoveLastFullWordEnd);
let MoveBeginningWord = class MoveBeginningWord extends BaseMovement {
    constructor() {
        super(...arguments);
        this.keys = ['b'];
    }
    execAction(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            return position.getWordLeft();
        });
    }
};
MoveBeginningWord = __decorate([
    base_2.RegisterAction
], MoveBeginningWord);
let MoveBeginningFullWord = class MoveBeginningFullWord extends BaseMovement {
    constructor() {
        super(...arguments);
        this.keys = ['B'];
    }
    execAction(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            return position.getBigWordLeft();
        });
    }
};
MoveBeginningFullWord = __decorate([
    base_2.RegisterAction
], MoveBeginningFullWord);
let MovePreviousSentenceBegin = class MovePreviousSentenceBegin extends BaseMovement {
    constructor() {
        super(...arguments);
        this.keys = ['('];
        this.isJump = true;
    }
    execAction(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            return position.getSentenceBegin({ forward: false });
        });
    }
};
MovePreviousSentenceBegin = __decorate([
    base_2.RegisterAction
], MovePreviousSentenceBegin);
let MoveNextSentenceBegin = class MoveNextSentenceBegin extends BaseMovement {
    constructor() {
        super(...arguments);
        this.keys = [')'];
        this.isJump = true;
    }
    execAction(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            return position.getSentenceBegin({ forward: true });
        });
    }
};
MoveNextSentenceBegin = __decorate([
    base_2.RegisterAction
], MoveNextSentenceBegin);
let MoveParagraphEnd = class MoveParagraphEnd extends BaseMovement {
    constructor() {
        super(...arguments);
        this.keys = ['}'];
        this.isJump = true;
    }
    execAction(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            const isLineWise = position.isLineBeginning() &&
                vimState.currentMode === mode_1.ModeName.Normal &&
                vimState.recordedState.operator;
            let paragraphEnd = position.getCurrentParagraphEnd();
            vimState.currentRegisterMode = isLineWise
                ? register_1.RegisterMode.LineWise
                : register_1.RegisterMode.AscertainFromCurrentMode;
            return isLineWise ? paragraphEnd.getLeftThroughLineBreaks(true) : paragraphEnd;
        });
    }
};
MoveParagraphEnd = __decorate([
    base_2.RegisterAction
], MoveParagraphEnd);
let MoveParagraphBegin = class MoveParagraphBegin extends BaseMovement {
    constructor() {
        super(...arguments);
        this.keys = ['{'];
        this.isJump = true;
    }
    execAction(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            return position.getCurrentParagraphBeginning();
        });
    }
};
MoveParagraphBegin = __decorate([
    base_2.RegisterAction
], MoveParagraphBegin);
class MoveSectionBoundary extends BaseMovement {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal, mode_1.ModeName.Visual, mode_1.ModeName.VisualLine];
        this.isJump = true;
    }
    execAction(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            return position.getSectionBoundary({
                forward: this.forward,
                boundary: this.boundary,
            });
        });
    }
}
let MoveNextSectionBegin = class MoveNextSectionBegin extends MoveSectionBoundary {
    constructor() {
        super(...arguments);
        this.keys = [']', ']'];
        this.boundary = '{';
        this.forward = true;
    }
};
MoveNextSectionBegin = __decorate([
    base_2.RegisterAction
], MoveNextSectionBegin);
let MoveNextSectionEnd = class MoveNextSectionEnd extends MoveSectionBoundary {
    constructor() {
        super(...arguments);
        this.keys = [']', '['];
        this.boundary = '}';
        this.forward = true;
    }
};
MoveNextSectionEnd = __decorate([
    base_2.RegisterAction
], MoveNextSectionEnd);
let MovePreviousSectionBegin = class MovePreviousSectionBegin extends MoveSectionBoundary {
    constructor() {
        super(...arguments);
        this.keys = ['[', '['];
        this.boundary = '{';
        this.forward = false;
    }
};
MovePreviousSectionBegin = __decorate([
    base_2.RegisterAction
], MovePreviousSectionBegin);
let MovePreviousSectionEnd = class MovePreviousSectionEnd extends MoveSectionBoundary {
    constructor() {
        super(...arguments);
        this.keys = ['[', ']'];
        this.boundary = '}';
        this.forward = false;
    }
};
MovePreviousSectionEnd = __decorate([
    base_2.RegisterAction
], MovePreviousSectionEnd);
let MoveToMatchingBracket = MoveToMatchingBracket_1 = class MoveToMatchingBracket extends BaseMovement {
    constructor() {
        super(...arguments);
        this.keys = ['%'];
        this.isJump = true;
    }
    execAction(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            position = position.getLeftIfEOL();
            const text = textEditor_1.TextEditor.getLineAt(position).text;
            const charToMatch = text[position.character];
            const toFind = matcher_1.PairMatcher.pairings[charToMatch];
            const failure = { start: position, stop: position, failed: true };
            if (!toFind || !toFind.matchesWithPercentageMotion) {
                // If we're not on a match, go right until we find a
                // pairable character or hit the end of line.
                for (let i = position.character; i < text.length; i++) {
                    if (matcher_1.PairMatcher.pairings[text[i]]) {
                        // We found an opening char, now move to the matching closing char
                        const openPosition = new position_1.Position(position.line, i);
                        return matcher_1.PairMatcher.nextPairedChar(openPosition, text[i]) || failure;
                    }
                }
                return failure;
            }
            return matcher_1.PairMatcher.nextPairedChar(position, charToMatch) || failure;
        });
    }
    execActionForOperator(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.execAction(position, vimState);
            if (isIMovement(result)) {
                if (result.failed) {
                    return result;
                }
                else {
                    throw new Error('Did not ever handle this case!');
                }
            }
            if (position.compareTo(result) > 0) {
                return {
                    start: result,
                    stop: position.getRight(),
                };
            }
            else {
                return result.getRight();
            }
        });
    }
    execActionWithCount(position, vimState, count) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            // % has a special mode that lets you use it to jump to a percentage of the file
            // However, some other bracket motions inherit from this so only do this behavior for % explicitly
            if (Object.getPrototypeOf(this) === MoveToMatchingBracket_1.prototype) {
                if (count === 0) {
                    if (vimState.recordedState.operator) {
                        return this.execActionForOperator(position, vimState);
                    }
                    else {
                        return this.execAction(position, vimState);
                    }
                }
                // Check to make sure this is a valid percentage
                if (count < 0 || count > 100) {
                    return { start: position, stop: position, failed: true };
                }
                const targetLine = Math.round((count * textEditor_1.TextEditor.getLineCount()) / 100);
                return new position_1.Position(targetLine - 1, 0).getFirstLineNonBlankChar();
            }
            else {
                return _super("execActionWithCount").call(this, position, vimState, count);
            }
        });
    }
};
MoveToMatchingBracket = MoveToMatchingBracket_1 = __decorate([
    base_2.RegisterAction
], MoveToMatchingBracket);
class MoveInsideCharacter extends ExpandingSelection {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal, mode_1.ModeName.Visual, mode_1.ModeName.VisualLine, mode_1.ModeName.VisualBlock];
        this.includeSurrounding = false;
        this.isJump = true;
    }
    execAction(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            const closingChar = matcher_1.PairMatcher.pairings[this.charToMatch].match;
            let cursorStartPos = new position_1.Position(vimState.cursorStartPosition.line, vimState.cursorStartPosition.character);
            // maintain current selection on failure
            const failure = { start: cursorStartPos, stop: position, failed: true };
            // when matching inside content of a pair, search for the next pair if
            // the inner content is already selected in full
            if (!this.includeSurrounding) {
                const adjacentPosLeft = cursorStartPos.getLeftThroughLineBreaks();
                let adjacentPosRight = position.getRightThroughLineBreaks();
                if (vimState.recordedState.operator) {
                    adjacentPosRight = adjacentPosRight.getLeftThroughLineBreaks();
                }
                const adjacentCharLeft = textEditor_1.TextEditor.getCharAt(adjacentPosLeft);
                const adjacentCharRight = textEditor_1.TextEditor.getCharAt(adjacentPosRight);
                if (adjacentCharLeft === this.charToMatch && adjacentCharRight === closingChar) {
                    cursorStartPos = adjacentPosLeft;
                    vimState.cursorStartPosition = adjacentPosLeft;
                    position = adjacentPosRight;
                    vimState.cursorPosition = adjacentPosRight;
                }
            }
            // First, search backwards for the opening character of the sequence
            let startPos = matcher_1.PairMatcher.nextPairedChar(cursorStartPos, closingChar, vimState);
            if (startPos === undefined) {
                return failure;
            }
            let startPlusOne;
            if (startPos.isAfterOrEqual(startPos.getLineEnd().getLeft())) {
                startPlusOne = new position_1.Position(startPos.line + 1, 0);
            }
            else {
                startPlusOne = new position_1.Position(startPos.line, startPos.character + 1);
            }
            let endPos = matcher_1.PairMatcher.nextPairedChar(position, this.charToMatch, vimState);
            if (endPos === undefined) {
                return failure;
            }
            if (this.includeSurrounding) {
                if (vimState.currentMode !== mode_1.ModeName.Visual) {
                    endPos = new position_1.Position(endPos.line, endPos.character + 1);
                }
            }
            else {
                startPos = startPlusOne;
                // If the closing character is the first on the line, don't swallow it.
                if (endPos.isInLeadingWhitespace()) {
                    endPos = endPos.getLineBegin();
                }
                if (vimState.currentMode === mode_1.ModeName.Visual) {
                    endPos = endPos.getLeftThroughLineBreaks();
                }
            }
            if (position.isBefore(startPos)) {
                vimState.recordedState.operatorPositionDiff = startPos.subtract(position);
            }
            vimState.cursorStartPosition = startPos;
            return {
                start: startPos,
                stop: endPos,
                diff: new position_1.PositionDiff(0, startPos === position ? 1 : 0),
            };
        });
    }
}
exports.MoveInsideCharacter = MoveInsideCharacter;
let MoveIParentheses = class MoveIParentheses extends MoveInsideCharacter {
    constructor() {
        super(...arguments);
        this.keys = ['i', '('];
        this.charToMatch = '(';
    }
};
MoveIParentheses = __decorate([
    base_2.RegisterAction
], MoveIParentheses);
let MoveIClosingParentheses = class MoveIClosingParentheses extends MoveInsideCharacter {
    constructor() {
        super(...arguments);
        this.keys = ['i', ')'];
        this.charToMatch = '(';
    }
};
MoveIClosingParentheses = __decorate([
    base_2.RegisterAction
], MoveIClosingParentheses);
let MoveIClosingParenthesesBlock = class MoveIClosingParenthesesBlock extends MoveInsideCharacter {
    constructor() {
        super(...arguments);
        this.keys = ['i', 'b'];
        this.charToMatch = '(';
    }
};
MoveIClosingParenthesesBlock = __decorate([
    base_2.RegisterAction
], MoveIClosingParenthesesBlock);
let MoveAParentheses = class MoveAParentheses extends MoveInsideCharacter {
    constructor() {
        super(...arguments);
        this.keys = ['a', '('];
        this.charToMatch = '(';
        this.includeSurrounding = true;
    }
};
MoveAParentheses = __decorate([
    base_2.RegisterAction
], MoveAParentheses);
exports.MoveAParentheses = MoveAParentheses;
let MoveAClosingParentheses = class MoveAClosingParentheses extends MoveInsideCharacter {
    constructor() {
        super(...arguments);
        this.keys = ['a', ')'];
        this.charToMatch = '(';
        this.includeSurrounding = true;
    }
};
MoveAClosingParentheses = __decorate([
    base_2.RegisterAction
], MoveAClosingParentheses);
let MoveAParenthesesBlock = class MoveAParenthesesBlock extends MoveInsideCharacter {
    constructor() {
        super(...arguments);
        this.keys = ['a', 'b'];
        this.charToMatch = '(';
        this.includeSurrounding = true;
    }
};
MoveAParenthesesBlock = __decorate([
    base_2.RegisterAction
], MoveAParenthesesBlock);
let MoveICurlyBrace = class MoveICurlyBrace extends MoveInsideCharacter {
    constructor() {
        super(...arguments);
        this.keys = ['i', '{'];
        this.charToMatch = '{';
    }
};
MoveICurlyBrace = __decorate([
    base_2.RegisterAction
], MoveICurlyBrace);
let MoveIClosingCurlyBrace = class MoveIClosingCurlyBrace extends MoveInsideCharacter {
    constructor() {
        super(...arguments);
        this.keys = ['i', '}'];
        this.charToMatch = '{';
    }
};
MoveIClosingCurlyBrace = __decorate([
    base_2.RegisterAction
], MoveIClosingCurlyBrace);
let MoveIClosingCurlyBraceBlock = class MoveIClosingCurlyBraceBlock extends MoveInsideCharacter {
    constructor() {
        super(...arguments);
        this.keys = ['i', 'B'];
        this.charToMatch = '{';
    }
};
MoveIClosingCurlyBraceBlock = __decorate([
    base_2.RegisterAction
], MoveIClosingCurlyBraceBlock);
let MoveACurlyBrace = class MoveACurlyBrace extends MoveInsideCharacter {
    constructor() {
        super(...arguments);
        this.keys = ['a', '{'];
        this.charToMatch = '{';
        this.includeSurrounding = true;
    }
};
MoveACurlyBrace = __decorate([
    base_2.RegisterAction
], MoveACurlyBrace);
exports.MoveACurlyBrace = MoveACurlyBrace;
let MoveAClosingCurlyBrace = class MoveAClosingCurlyBrace extends MoveInsideCharacter {
    constructor() {
        super(...arguments);
        this.keys = ['a', '}'];
        this.charToMatch = '{';
        this.includeSurrounding = true;
    }
};
MoveAClosingCurlyBrace = __decorate([
    base_2.RegisterAction
], MoveAClosingCurlyBrace);
exports.MoveAClosingCurlyBrace = MoveAClosingCurlyBrace;
let MoveAClosingCurlyBraceBlock = class MoveAClosingCurlyBraceBlock extends MoveInsideCharacter {
    constructor() {
        super(...arguments);
        this.keys = ['a', 'B'];
        this.charToMatch = '{';
        this.includeSurrounding = true;
    }
};
MoveAClosingCurlyBraceBlock = __decorate([
    base_2.RegisterAction
], MoveAClosingCurlyBraceBlock);
let MoveICaret = class MoveICaret extends MoveInsideCharacter {
    constructor() {
        super(...arguments);
        this.keys = ['i', '<'];
        this.charToMatch = '<';
    }
};
MoveICaret = __decorate([
    base_2.RegisterAction
], MoveICaret);
let MoveIClosingCaret = class MoveIClosingCaret extends MoveInsideCharacter {
    constructor() {
        super(...arguments);
        this.keys = ['i', '>'];
        this.charToMatch = '<';
    }
};
MoveIClosingCaret = __decorate([
    base_2.RegisterAction
], MoveIClosingCaret);
let MoveACaret = class MoveACaret extends MoveInsideCharacter {
    constructor() {
        super(...arguments);
        this.keys = ['a', '<'];
        this.charToMatch = '<';
        this.includeSurrounding = true;
    }
};
MoveACaret = __decorate([
    base_2.RegisterAction
], MoveACaret);
exports.MoveACaret = MoveACaret;
let MoveAClosingCaret = class MoveAClosingCaret extends MoveInsideCharacter {
    constructor() {
        super(...arguments);
        this.keys = ['a', '>'];
        this.charToMatch = '<';
        this.includeSurrounding = true;
    }
};
MoveAClosingCaret = __decorate([
    base_2.RegisterAction
], MoveAClosingCaret);
let MoveISquareBracket = class MoveISquareBracket extends MoveInsideCharacter {
    constructor() {
        super(...arguments);
        this.keys = ['i', '['];
        this.charToMatch = '[';
    }
};
MoveISquareBracket = __decorate([
    base_2.RegisterAction
], MoveISquareBracket);
let MoveIClosingSquareBraket = class MoveIClosingSquareBraket extends MoveInsideCharacter {
    constructor() {
        super(...arguments);
        this.keys = ['i', ']'];
        this.charToMatch = '[';
    }
};
MoveIClosingSquareBraket = __decorate([
    base_2.RegisterAction
], MoveIClosingSquareBraket);
let MoveASquareBracket = class MoveASquareBracket extends MoveInsideCharacter {
    constructor() {
        super(...arguments);
        this.keys = ['a', '['];
        this.charToMatch = '[';
        this.includeSurrounding = true;
    }
};
MoveASquareBracket = __decorate([
    base_2.RegisterAction
], MoveASquareBracket);
exports.MoveASquareBracket = MoveASquareBracket;
let MoveAClosingSquareBracket = class MoveAClosingSquareBracket extends MoveInsideCharacter {
    constructor() {
        super(...arguments);
        this.keys = ['a', ']'];
        this.charToMatch = '[';
        this.includeSurrounding = true;
    }
};
MoveAClosingSquareBracket = __decorate([
    base_2.RegisterAction
], MoveAClosingSquareBracket);
class MoveQuoteMatch extends BaseMovement {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal, mode_1.ModeName.Visual, mode_1.ModeName.VisualBlock];
        this.includeSurrounding = false;
        this.isJump = true;
    }
    execAction(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            const text = textEditor_1.TextEditor.getLineAt(position).text;
            const quoteMatcher = new quoteMatcher_1.QuoteMatcher(this.charToMatch, text);
            const start = quoteMatcher.findOpening(position.character);
            const end = quoteMatcher.findClosing(start + 1);
            if (start === -1 || end === -1 || end === start || end < position.character) {
                return {
                    start: position,
                    stop: position,
                    failed: true,
                };
            }
            let startPos = new position_1.Position(position.line, start);
            let endPos = new position_1.Position(position.line, end);
            if (!this.includeSurrounding) {
                startPos = startPos.getRight();
                endPos = endPos.getLeft();
            }
            if (position.isBefore(startPos)) {
                vimState.recordedState.operatorPositionDiff = startPos.subtract(position);
            }
            return {
                start: startPos,
                stop: endPos,
            };
        });
    }
    execActionForOperator(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.execAction(position, vimState);
            if (isIMovement(result)) {
                if (result.failed) {
                    vimState.recordedState.hasRunOperator = false;
                    vimState.recordedState.actionsRun = [];
                }
                else {
                    result.stop = result.stop.getRight();
                }
            }
            return result;
        });
    }
}
exports.MoveQuoteMatch = MoveQuoteMatch;
let MoveInsideSingleQuotes = class MoveInsideSingleQuotes extends MoveQuoteMatch {
    constructor() {
        super(...arguments);
        this.keys = ['i', "'"];
        this.charToMatch = "'";
        this.includeSurrounding = false;
    }
};
MoveInsideSingleQuotes = __decorate([
    base_2.RegisterAction
], MoveInsideSingleQuotes);
let MoveASingleQuotes = class MoveASingleQuotes extends MoveQuoteMatch {
    constructor() {
        super(...arguments);
        this.keys = ['a', "'"];
        this.charToMatch = "'";
        this.includeSurrounding = true;
    }
};
MoveASingleQuotes = __decorate([
    base_2.RegisterAction
], MoveASingleQuotes);
exports.MoveASingleQuotes = MoveASingleQuotes;
let MoveInsideDoubleQuotes = class MoveInsideDoubleQuotes extends MoveQuoteMatch {
    constructor() {
        super(...arguments);
        this.keys = ['i', '"'];
        this.charToMatch = '"';
        this.includeSurrounding = false;
    }
};
MoveInsideDoubleQuotes = __decorate([
    base_2.RegisterAction
], MoveInsideDoubleQuotes);
let MoveADoubleQuotes = class MoveADoubleQuotes extends MoveQuoteMatch {
    constructor() {
        super(...arguments);
        this.keys = ['a', '"'];
        this.charToMatch = '"';
        this.includeSurrounding = true;
    }
};
MoveADoubleQuotes = __decorate([
    base_2.RegisterAction
], MoveADoubleQuotes);
exports.MoveADoubleQuotes = MoveADoubleQuotes;
let MoveInsideBacktick = class MoveInsideBacktick extends MoveQuoteMatch {
    constructor() {
        super(...arguments);
        this.keys = ['i', '`'];
        this.charToMatch = '`';
        this.includeSurrounding = false;
    }
};
MoveInsideBacktick = __decorate([
    base_2.RegisterAction
], MoveInsideBacktick);
let MoveABacktick = class MoveABacktick extends MoveQuoteMatch {
    constructor() {
        super(...arguments);
        this.keys = ['a', '`'];
        this.charToMatch = '`';
        this.includeSurrounding = true;
    }
};
MoveABacktick = __decorate([
    base_2.RegisterAction
], MoveABacktick);
exports.MoveABacktick = MoveABacktick;
let MoveToUnclosedRoundBracketBackward = class MoveToUnclosedRoundBracketBackward extends MoveToMatchingBracket {
    constructor() {
        super(...arguments);
        this.keys = ['[', '('];
    }
    execAction(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            const failure = { start: position, stop: position, failed: true };
            const charToMatch = ')';
            const result = matcher_1.PairMatcher.nextPairedChar(position, charToMatch);
            if (!result) {
                return failure;
            }
            return result;
        });
    }
};
MoveToUnclosedRoundBracketBackward = __decorate([
    base_2.RegisterAction
], MoveToUnclosedRoundBracketBackward);
let MoveToUnclosedRoundBracketForward = class MoveToUnclosedRoundBracketForward extends MoveToMatchingBracket {
    constructor() {
        super(...arguments);
        this.keys = [']', ')'];
    }
    execAction(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            const failure = { start: position, stop: position, failed: true };
            const charToMatch = '(';
            const result = matcher_1.PairMatcher.nextPairedChar(position, charToMatch);
            if (!result) {
                return failure;
            }
            if (vimState.recordedState.operator instanceof operator_1.ChangeOperator ||
                vimState.recordedState.operator instanceof operator_1.DeleteOperator ||
                vimState.recordedState.operator instanceof operator_1.YankOperator) {
                return result.getLeftThroughLineBreaks();
            }
            return result;
        });
    }
};
MoveToUnclosedRoundBracketForward = __decorate([
    base_2.RegisterAction
], MoveToUnclosedRoundBracketForward);
let MoveToUnclosedCurlyBracketBackward = class MoveToUnclosedCurlyBracketBackward extends MoveToMatchingBracket {
    constructor() {
        super(...arguments);
        this.keys = ['[', '{'];
    }
    execAction(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            const failure = { start: position, stop: position, failed: true };
            const charToMatch = '}';
            const result = matcher_1.PairMatcher.nextPairedChar(position, charToMatch);
            if (!result) {
                return failure;
            }
            return result;
        });
    }
};
MoveToUnclosedCurlyBracketBackward = __decorate([
    base_2.RegisterAction
], MoveToUnclosedCurlyBracketBackward);
let MoveToUnclosedCurlyBracketForward = class MoveToUnclosedCurlyBracketForward extends MoveToMatchingBracket {
    constructor() {
        super(...arguments);
        this.keys = [']', '}'];
    }
    execAction(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            const failure = { start: position, stop: position, failed: true };
            const charToMatch = '{';
            const result = matcher_1.PairMatcher.nextPairedChar(position, charToMatch);
            if (!result) {
                return failure;
            }
            if (vimState.recordedState.operator instanceof operator_1.ChangeOperator ||
                vimState.recordedState.operator instanceof operator_1.DeleteOperator ||
                vimState.recordedState.operator instanceof operator_1.YankOperator) {
                return result.getLeftThroughLineBreaks();
            }
            return result;
        });
    }
};
MoveToUnclosedCurlyBracketForward = __decorate([
    base_2.RegisterAction
], MoveToUnclosedCurlyBracketForward);
class MoveTagMatch extends ExpandingSelection {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal, mode_1.ModeName.Visual, mode_1.ModeName.VisualBlock];
        this.includeTag = false;
        this.isJump = true;
    }
    execAction(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            const editorText = textEditor_1.TextEditor.getText();
            const offset = textEditor_1.TextEditor.getOffsetAt(position);
            const tagMatcher = new tagMatcher_1.TagMatcher(editorText, offset, vimState);
            const cursorStartPos = new position_1.Position(vimState.cursorStartPosition.line, vimState.cursorStartPosition.character);
            const start = tagMatcher.findOpening(this.includeTag);
            const end = tagMatcher.findClosing(this.includeTag);
            if (start === undefined || end === undefined) {
                return {
                    start: cursorStartPos,
                    stop: position,
                    failed: true,
                };
            }
            let startPosition = start >= 0 ? textEditor_1.TextEditor.getPositionAt(start) : cursorStartPos;
            let endPosition = end >= 0 ? textEditor_1.TextEditor.getPositionAt(end) : position;
            if (vimState.currentMode === mode_1.ModeName.Visual ||
                vimState.currentMode === mode_1.ModeName.SurroundInputMode) {
                endPosition = endPosition.getLeftThroughLineBreaks();
            }
            if (position.isAfter(endPosition)) {
                vimState.recordedState.transformations.push({
                    type: 'moveCursor',
                    diff: endPosition.subtract(position),
                });
            }
            else if (position.isBefore(startPosition)) {
                vimState.recordedState.transformations.push({
                    type: 'moveCursor',
                    diff: startPosition.subtract(position),
                });
            }
            // if (start === end) {
            //   if (vimState.recordedState.operator instanceof ChangeOperator) {
            //     vimState.currentMode = ModeName.Insert;
            //   }
            //   return {
            //     start: startPosition,
            //     stop: startPosition,
            //     failed: true,
            //   };
            // }
            vimState.cursorStartPosition = startPosition;
            return {
                start: startPosition,
                stop: endPosition,
            };
        });
    }
}
let MoveInsideTag = class MoveInsideTag extends MoveTagMatch {
    constructor() {
        super(...arguments);
        this.keys = ['i', 't'];
        this.includeTag = false;
    }
};
MoveInsideTag = __decorate([
    base_2.RegisterAction
], MoveInsideTag);
exports.MoveInsideTag = MoveInsideTag;
let MoveAroundTag = class MoveAroundTag extends MoveTagMatch {
    constructor() {
        super(...arguments);
        this.keys = ['a', 't'];
        this.includeTag = true;
    }
};
MoveAroundTag = __decorate([
    base_2.RegisterAction
], MoveAroundTag);
exports.MoveAroundTag = MoveAroundTag;
class ArrowsInInsertMode extends BaseMovement {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Insert];
    }
    execAction(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            // we are in Insert Mode and arrow keys will clear all other actions except the first action, which enters Insert Mode.
            // Please note the arrow key movement can be repeated while using `.` but it can't be repeated when using `<C-A>` in Insert Mode.
            vimState.recordedState.actionsRun = [
                vimState.recordedState.actionsRun.shift(),
                vimState.recordedState.actionsRun.pop(),
            ];
            let newPosition = position;
            switch (this.keys[0]) {
                case '<up>':
                    newPosition = (yield new MoveUpArrow().execAction(position, vimState));
                    break;
                case '<down>':
                    newPosition = (yield new MoveDownArrow().execAction(position, vimState));
                    break;
                case '<left>':
                    newPosition = yield new MoveLeftArrow(this.keysPressed).execAction(position, vimState);
                    break;
                case '<right>':
                    newPosition = yield new MoveRightArrow(this.keysPressed).execAction(position, vimState);
                    break;
                default:
                    break;
            }
            vimState.replaceState = new replaceState_1.ReplaceState(newPosition);
            return newPosition;
        });
    }
}
exports.ArrowsInInsertMode = ArrowsInInsertMode;
let UpArrowInInsertMode = class UpArrowInInsertMode extends ArrowsInInsertMode {
    constructor() {
        super(...arguments);
        this.keys = ['<up>'];
    }
};
UpArrowInInsertMode = __decorate([
    base_2.RegisterAction
], UpArrowInInsertMode);
let DownArrowInInsertMode = class DownArrowInInsertMode extends ArrowsInInsertMode {
    constructor() {
        super(...arguments);
        this.keys = ['<down>'];
    }
};
DownArrowInInsertMode = __decorate([
    base_2.RegisterAction
], DownArrowInInsertMode);
let LeftArrowInInsertMode = class LeftArrowInInsertMode extends ArrowsInInsertMode {
    constructor() {
        super(...arguments);
        this.keys = ['<left>'];
    }
};
LeftArrowInInsertMode = __decorate([
    base_2.RegisterAction
], LeftArrowInInsertMode);
let RightArrowInInsertMode = class RightArrowInInsertMode extends ArrowsInInsertMode {
    constructor() {
        super(...arguments);
        this.keys = ['<right>'];
    }
};
RightArrowInInsertMode = __decorate([
    base_2.RegisterAction
], RightArrowInInsertMode);

//# sourceMappingURL=motion.js.map
