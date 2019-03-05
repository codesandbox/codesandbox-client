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
var PutCommand_1;
"use strict";
const vscode = require("vscode");
const recordedState_1 = require("../../state/recordedState");
const replaceState_1 = require("../../state/replaceState");
const util_1 = require("../../util/util");
const clipboard_1 = require("../../util/clipboard");
const file_1 = require("./../../cmd_line/commands/file");
const only_1 = require("./../../cmd_line/commands/only");
const quit_1 = require("./../../cmd_line/commands/quit");
const tab_1 = require("./../../cmd_line/commands/tab");
const position_1 = require("./../../common/motion/position");
const range_1 = require("./../../common/motion/range");
const numericString_1 = require("./../../common/number/numericString");
const configuration_1 = require("./../../configuration/configuration");
const mode_1 = require("./../../mode/mode");
const modes_1 = require("./../../mode/modes");
const register_1 = require("./../../register/register");
const searchState_1 = require("./../../state/searchState");
const textEditor_1 = require("./../../textEditor");
const transformations_1 = require("./../../transformations/transformations");
const base_1 = require("./../base");
const base_2 = require("./../base");
const commandLine_1 = require("./../../cmd_line/commandLine");
const operator = require("./../operator");
class DocumentContentChangeAction extends base_2.BaseAction {
    constructor() {
        super(...arguments);
        this.contentChanges = [];
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.contentChanges.length === 0) {
                return vimState;
            }
            let originalLeftBoundary;
            if (this.contentChanges[0].textDiff.text === '' &&
                this.contentChanges[0].textDiff.rangeLength === 1) {
                originalLeftBoundary = this.contentChanges[0].textDiff.range.end;
            }
            else {
                originalLeftBoundary = this.contentChanges[0].textDiff.range.start;
            }
            let rightBoundary = position;
            let newStart;
            let newEnd;
            for (let i = 0; i < this.contentChanges.length; i++) {
                let contentChange = this.contentChanges[i].textDiff;
                if (contentChange.range.start.line < originalLeftBoundary.line) {
                    // This change should be ignored
                    let linesEffected = contentChange.range.end.line - contentChange.range.start.line + 1;
                    let resultLines = contentChange.text.split('\n').length;
                    originalLeftBoundary = originalLeftBoundary.with(originalLeftBoundary.line + resultLines - linesEffected);
                    continue;
                }
                if (contentChange.range.start.line === originalLeftBoundary.line) {
                    newStart = position.with(position.line, position.character + contentChange.range.start.character - originalLeftBoundary.character);
                    if (contentChange.range.end.line === originalLeftBoundary.line) {
                        newEnd = position.with(position.line, position.character + contentChange.range.end.character - originalLeftBoundary.character);
                    }
                    else {
                        newEnd = position.with(position.line + contentChange.range.end.line - originalLeftBoundary.line, contentChange.range.end.character);
                    }
                }
                else {
                    newStart = position.with(position.line + contentChange.range.start.line - originalLeftBoundary.line, contentChange.range.start.character);
                    newEnd = position.with(position.line + contentChange.range.end.line - originalLeftBoundary.line, contentChange.range.end.character);
                }
                if (newStart.isAfter(rightBoundary)) {
                    // This change should be ignored as it's out of boundary
                    continue;
                }
                // Calculate new right boundary
                let newLineCount = contentChange.text.split('\n').length;
                let newRightBoundary;
                if (newLineCount === 1) {
                    newRightBoundary = newStart.with(newStart.line, newStart.character + contentChange.text.length);
                }
                else {
                    newRightBoundary = new vscode.Position(newStart.line + newLineCount - 1, contentChange.text.split('\n').pop().length);
                }
                if (newRightBoundary.isAfter(rightBoundary)) {
                    rightBoundary = newRightBoundary;
                }
                vimState.editor.selection = new vscode.Selection(newStart, newEnd);
                if (newStart.isEqual(newEnd)) {
                    yield textEditor_1.TextEditor.insert(contentChange.text, position_1.Position.FromVSCodePosition(newStart));
                }
                else {
                    yield textEditor_1.TextEditor.replace(vimState.editor.selection, contentChange.text);
                }
            }
            /**
             * We're making an assumption here that content changes are always in order, and I'm not sure
             * we're guaranteed that, but it seems to work well enough in practice.
             */
            if (newStart && newEnd) {
                const last = this.contentChanges[this.contentChanges.length - 1];
                vimState.cursorStartPosition = position_1.Position.FromVSCodePosition(newStart)
                    .advancePositionByText(last.textDiff.text)
                    .add(last.positionDiff);
                vimState.cursorPosition = position_1.Position.FromVSCodePosition(newEnd)
                    .advancePositionByText(last.textDiff.text)
                    .add(last.positionDiff);
            }
            vimState.currentMode = mode_1.ModeName.Insert;
            return vimState;
        });
    }
}
exports.DocumentContentChangeAction = DocumentContentChangeAction;
/**
 * A command is something like <Esc>, :, v, i, etc.
 */
class BaseCommand extends base_2.BaseAction {
    constructor() {
        super(...arguments);
        /**
         * If isCompleteAction is true, then triggering this command is a complete action -
         * that means that we'll go and try to run it.
         */
        this.isCompleteAction = true;
        /**
         * If isJump is true, then the cursor position will be added to the jump list on completion.
         */
        this.isJump = false;
        this.multicursorIndex = undefined;
        /**
         * If true, exec() will get called N times where N is the count.
         *
         * If false, exec() will only be called once, and you are expected to
         * handle count prefixes (e.g. the 3 in 3w) yourself.
         */
        this.runsOnceForEachCountPrefix = false;
        this.canBeRepeatedWithDot = false;
    }
    /**
     * In multi-cursor mode, do we run this command for every cursor, or just once?
     */
    runsOnceForEveryCursor() {
        return true;
    }
    /**
     * Run the command a single time.
     */
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('Not implemented!');
        });
    }
    /**
     * Run the command the number of times VimState wants us to.
     */
    execCount(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            let timesToRepeat = this.runsOnceForEachCountPrefix ? vimState.recordedState.count || 1 : 1;
            if (!this.runsOnceForEveryCursor()) {
                for (let i = 0; i < timesToRepeat; i++) {
                    vimState = yield this.exec(position, vimState);
                }
                for (const transformation of vimState.recordedState.transformations) {
                    if (transformations_1.isTextTransformation(transformation) && transformation.cursorIndex === undefined) {
                        transformation.cursorIndex = 0;
                    }
                }
                return vimState;
            }
            let resultingCursors = [];
            const cursorsToIterateOver = vimState.allCursors
                .map(x => new range_1.Range(x.start, x.stop))
                .sort((a, b) => a.start.line > b.start.line ||
                (a.start.line === b.start.line && a.start.character > b.start.character)
                ? 1
                : -1);
            let cursorIndex = 0;
            for (const { start, stop } of cursorsToIterateOver) {
                this.multicursorIndex = cursorIndex++;
                vimState.cursorPosition = stop;
                vimState.cursorStartPosition = start;
                for (let j = 0; j < timesToRepeat; j++) {
                    vimState = yield this.exec(stop, vimState);
                }
                resultingCursors.push(new range_1.Range(vimState.cursorStartPosition, vimState.cursorPosition));
                for (const transformation of vimState.recordedState.transformations) {
                    if (transformations_1.isTextTransformation(transformation) && transformation.cursorIndex === undefined) {
                        transformation.cursorIndex = this.multicursorIndex;
                    }
                }
            }
            vimState.allCursors = resultingCursors;
            return vimState;
        });
    }
}
exports.BaseCommand = BaseCommand;
// begin actions
let DisableExtension = class DisableExtension extends BaseCommand {
    // begin actions
    constructor() {
        super(...arguments);
        this.modes = [
            mode_1.ModeName.Normal,
            mode_1.ModeName.Insert,
            mode_1.ModeName.Visual,
            mode_1.ModeName.VisualBlock,
            mode_1.ModeName.VisualLine,
            mode_1.ModeName.SearchInProgressMode,
            mode_1.ModeName.CommandlineInProgress,
            mode_1.ModeName.Replace,
            mode_1.ModeName.EasyMotionMode,
            mode_1.ModeName.EasyMotionInputMode,
            mode_1.ModeName.SurroundInputMode,
        ];
        this.keys = ['<ExtensionDisable>'];
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            vimState.currentMode = mode_1.ModeName.Disabled;
            return vimState;
        });
    }
};
DisableExtension = __decorate([
    base_1.RegisterAction
], DisableExtension);
let EnableExtension = class EnableExtension extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Disabled];
        this.keys = ['<ExtensionEnable>'];
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            vimState.currentMode = mode_1.ModeName.Normal;
            return vimState;
        });
    }
};
EnableExtension = __decorate([
    base_1.RegisterAction
], EnableExtension);
let CommandNumber = class CommandNumber extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal, mode_1.ModeName.Visual, mode_1.ModeName.VisualLine, mode_1.ModeName.VisualBlock];
        this.keys = ['<number>'];
        this.isCompleteAction = false;
    }
    runsOnceForEveryCursor() {
        return false;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            const number = parseInt(this.keysPressed[0], 10);
            vimState.recordedState.count = vimState.recordedState.count * 10 + number;
            return vimState;
        });
    }
    doesActionApply(vimState, keysPressed) {
        const isZero = keysPressed[0] === '0';
        return (super.doesActionApply(vimState, keysPressed) &&
            ((isZero && vimState.recordedState.count > 0) || !isZero));
    }
    couldActionApply(vimState, keysPressed) {
        const isZero = keysPressed[0] === '0';
        return (super.couldActionApply(vimState, keysPressed) &&
            ((isZero && vimState.recordedState.count > 0) || !isZero));
    }
};
CommandNumber = __decorate([
    base_1.RegisterAction
], CommandNumber);
exports.CommandNumber = CommandNumber;
let CommandRegister = class CommandRegister extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal, mode_1.ModeName.Visual, mode_1.ModeName.VisualLine];
        this.keys = ['"', '<character>'];
        this.isCompleteAction = false;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            const register = this.keysPressed[1];
            vimState.recordedState.registerName = register;
            return vimState;
        });
    }
    doesActionApply(vimState, keysPressed) {
        const register = keysPressed[1];
        return super.doesActionApply(vimState, keysPressed) && register_1.Register.isValidRegister(register);
    }
    couldActionApply(vimState, keysPressed) {
        const register = keysPressed[1];
        return super.couldActionApply(vimState, keysPressed) && register_1.Register.isValidRegister(register);
    }
};
CommandRegister = __decorate([
    base_1.RegisterAction
], CommandRegister);
exports.CommandRegister = CommandRegister;
let CommandInsertRegisterContentInSearchMode = class CommandInsertRegisterContentInSearchMode extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.SearchInProgressMode];
        this.keys = ['<C-r>', '<character>'];
        this.isCompleteAction = false;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            vimState.recordedState.registerName = this.keysPressed[1];
            const register = yield register_1.Register.get(vimState);
            let text;
            if (register.text instanceof Array) {
                text = register.text.join('\n');
            }
            else if (register.text instanceof recordedState_1.RecordedState) {
                let keyStrokes = [];
                for (let action of register.text.actionsRun) {
                    keyStrokes = keyStrokes.concat(action.keysPressed);
                }
                text = keyStrokes.join('\n');
            }
            else {
                text = register.text;
            }
            if (register.registerMode === register_1.RegisterMode.LineWise) {
                text += '\n';
            }
            const searchState = vimState.globalState.searchState;
            searchState.searchString += text;
            return vimState;
        });
    }
};
CommandInsertRegisterContentInSearchMode = __decorate([
    base_1.RegisterAction
], CommandInsertRegisterContentInSearchMode);
let CommandRecordMacro = class CommandRecordMacro extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal, mode_1.ModeName.Visual, mode_1.ModeName.VisualLine];
        this.keys = [['q', '<alpha>'], ['q', '<number>'], ['q', '"']];
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            const register = this.keysPressed[1];
            vimState.recordedMacro = new recordedState_1.RecordedState();
            vimState.recordedMacro.registerName = register.toLocaleLowerCase();
            if (!/^[A-Z]+$/.test(register) || !register_1.Register.has(register)) {
                // If register name is upper case, it means we are appending commands to existing register instead of overriding.
                let newRegister = new recordedState_1.RecordedState();
                newRegister.registerName = register;
                register_1.Register.putByKey(newRegister, register);
            }
            vimState.isRecordingMacro = true;
            return vimState;
        });
    }
    doesActionApply(vimState, keysPressed) {
        const register = this.keysPressed[1];
        return (super.doesActionApply(vimState, keysPressed) && register_1.Register.isValidRegisterForMacro(register));
    }
    couldActionApply(vimState, keysPressed) {
        const register = this.keysPressed[1];
        return (super.couldActionApply(vimState, keysPressed) && register_1.Register.isValidRegisterForMacro(register));
    }
};
CommandRecordMacro = __decorate([
    base_1.RegisterAction
], CommandRecordMacro);
let CommandQuitRecordMacro = class CommandQuitRecordMacro extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal, mode_1.ModeName.Visual, mode_1.ModeName.VisualLine];
        this.keys = ['q'];
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            let existingMacro = (yield register_1.Register.getByKey(vimState.recordedMacro.registerName))
                .text;
            existingMacro.actionsRun = existingMacro.actionsRun.concat(vimState.recordedMacro.actionsRun);
            vimState.isRecordingMacro = false;
            return vimState;
        });
    }
    doesActionApply(vimState, keysPressed) {
        return super.doesActionApply(vimState, keysPressed) && vimState.isRecordingMacro;
    }
    couldActionApply(vimState, keysPressed) {
        return super.couldActionApply(vimState, keysPressed) && vimState.isRecordingMacro;
    }
};
CommandQuitRecordMacro = __decorate([
    base_1.RegisterAction
], CommandQuitRecordMacro);
exports.CommandQuitRecordMacro = CommandQuitRecordMacro;
let CommandExecuteMacro = class CommandExecuteMacro extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal, mode_1.ModeName.Visual, mode_1.ModeName.VisualLine];
        this.keys = ['@', '<character>'];
        this.runsOnceForEachCountPrefix = true;
        this.canBeRepeatedWithDot = true;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            const register = this.keysPressed[1];
            vimState.recordedState.transformations.push({
                type: 'macro',
                register: register,
                replay: 'contentChange',
            });
            return vimState;
        });
    }
    doesActionApply(vimState, keysPressed) {
        const register = keysPressed[1];
        return (super.doesActionApply(vimState, keysPressed) && register_1.Register.isValidRegisterForMacro(register));
    }
    couldActionApply(vimState, keysPressed) {
        const register = keysPressed[1];
        return (super.couldActionApply(vimState, keysPressed) && register_1.Register.isValidRegisterForMacro(register));
    }
};
CommandExecuteMacro = __decorate([
    base_1.RegisterAction
], CommandExecuteMacro);
let CommandExecuteLastMacro = class CommandExecuteLastMacro extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal, mode_1.ModeName.Visual, mode_1.ModeName.VisualLine];
        this.keys = ['@', '@'];
        this.runsOnceForEachCountPrefix = true;
        this.canBeRepeatedWithDot = true;
        this.isJump = true;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            let lastInvokedMacro = vimState.historyTracker.lastInvokedMacro;
            if (lastInvokedMacro) {
                vimState.recordedState.transformations.push({
                    type: 'macro',
                    register: lastInvokedMacro.registerName,
                    replay: 'contentChange',
                });
            }
            return vimState;
        });
    }
};
CommandExecuteLastMacro = __decorate([
    base_1.RegisterAction
], CommandExecuteLastMacro);
let CommandEsc = class CommandEsc extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [
            mode_1.ModeName.Visual,
            mode_1.ModeName.VisualLine,
            mode_1.ModeName.VisualBlock,
            mode_1.ModeName.Normal,
            mode_1.ModeName.SearchInProgressMode,
            mode_1.ModeName.SurroundInputMode,
            mode_1.ModeName.EasyMotionMode,
            mode_1.ModeName.EasyMotionInputMode,
        ];
        this.keys = [['<Esc>'], ['<C-c>'], ['<C-[>']];
    }
    runsOnceForEveryCursor() {
        return false;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            if (vimState.currentMode === mode_1.ModeName.Normal && !vimState.isMultiCursor) {
                // If there's nothing to do on the vim side, we might as well call some
                // of vscode's default "close notification" actions. I think we should
                // just add to this list as needed.
                yield vscode.commands.executeCommand('closeReferenceSearchEditor');
                return vimState;
            }
            if (vimState.currentMode !== mode_1.ModeName.Visual &&
                vimState.currentMode !== mode_1.ModeName.VisualLine &&
                vimState.currentMode !== mode_1.ModeName.EasyMotionMode) {
                // Normally, you don't have to iterate over all cursors,
                // as that is handled for you by the state machine. ESC is
                // a special case since runsOnceForEveryCursor is false.
                vimState.allCursors = vimState.allCursors.map(x => x.withNewStop(x.stop.getLeft()));
            }
            if (vimState.currentMode === mode_1.ModeName.SearchInProgressMode) {
                if (vimState.globalState.searchState) {
                    vimState.cursorPosition = vimState.globalState.searchState.searchCursorStartPosition;
                }
            }
            if (vimState.currentMode === mode_1.ModeName.Normal && vimState.isMultiCursor) {
                vimState.isMultiCursor = false;
            }
            if (vimState.currentMode === mode_1.ModeName.EasyMotionMode) {
                // Escape or other termination keys were pressed, exit mode
                vimState.easyMotion.clearDecorations();
                vimState.currentMode = mode_1.ModeName.Normal;
            }
            // Abort surround operation
            if (vimState.currentMode === mode_1.ModeName.SurroundInputMode) {
                vimState.surround = undefined;
            }
            vimState.currentMode = mode_1.ModeName.Normal;
            if (!vimState.isMultiCursor) {
                vimState.allCursors = [vimState.allCursors[0]];
            }
            return vimState;
        });
    }
};
CommandEsc = __decorate([
    base_1.RegisterAction
], CommandEsc);
let CommandEscReplaceMode = class CommandEscReplaceMode extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Replace];
        this.keys = [['<Esc>'], ['<C-c>'], ['<C-[>']];
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            const timesToRepeat = vimState.replaceState.timesToRepeat;
            let textToAdd = '';
            for (let i = 1; i < timesToRepeat; i++) {
                textToAdd += vimState.replaceState.newChars.join('');
            }
            vimState.recordedState.transformations.push({
                type: 'insertText',
                text: textToAdd,
                position: position,
                diff: new position_1.PositionDiff(0, -1),
            });
            vimState.currentMode = mode_1.ModeName.Normal;
            return vimState;
        });
    }
};
CommandEscReplaceMode = __decorate([
    base_1.RegisterAction
], CommandEscReplaceMode);
let CommandInsertReplaceMode = class CommandInsertReplaceMode extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Replace];
        this.keys = ['<insert>'];
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            vimState.currentMode = mode_1.ModeName.Insert;
            return vimState;
        });
    }
};
CommandInsertReplaceMode = __decorate([
    base_1.RegisterAction
], CommandInsertReplaceMode);
class CommandEditorScroll extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal, mode_1.ModeName.Visual, mode_1.ModeName.VisualLine, mode_1.ModeName.VisualBlock];
        this.runsOnceForEachCountPrefix = false;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            let timesToRepeat = vimState.recordedState.count || 1;
            vimState.postponedCodeViewChanges.push({
                command: 'editorScroll',
                args: {
                    to: this.to,
                    by: this.by,
                    value: timesToRepeat,
                    revealCursor: true,
                    select: [mode_1.ModeName.Visual, mode_1.ModeName.VisualBlock, mode_1.ModeName.VisualLine].indexOf(vimState.currentMode) >= 0,
                },
            });
            return vimState;
        });
    }
}
let CommandCtrlE = class CommandCtrlE extends CommandEditorScroll {
    constructor() {
        super(...arguments);
        this.keys = ['<C-e>'];
        this.to = 'down';
        this.by = 'line';
    }
};
CommandCtrlE = __decorate([
    base_1.RegisterAction
], CommandCtrlE);
let CommandCtrlY = class CommandCtrlY extends CommandEditorScroll {
    constructor() {
        super(...arguments);
        this.keys = ['<C-y>'];
        this.to = 'up';
        this.by = 'line';
    }
};
CommandCtrlY = __decorate([
    base_1.RegisterAction
], CommandCtrlY);
let CommandMoveFullPageUp = class CommandMoveFullPageUp extends CommandEditorScroll {
    constructor() {
        super(...arguments);
        this.keys = ['<C-b>'];
        this.to = 'up';
        this.by = 'page';
    }
};
CommandMoveFullPageUp = __decorate([
    base_1.RegisterAction
], CommandMoveFullPageUp);
let CommandMoveFullPageDown = class CommandMoveFullPageDown extends CommandEditorScroll {
    constructor() {
        super(...arguments);
        this.keys = ['<C-f>'];
        this.to = 'down';
        this.by = 'page';
    }
};
CommandMoveFullPageDown = __decorate([
    base_1.RegisterAction
], CommandMoveFullPageDown);
let CommandMoveHalfPageDown = class CommandMoveHalfPageDown extends CommandEditorScroll {
    constructor() {
        super(...arguments);
        this.keys = ['<C-d>'];
        this.to = 'down';
        this.by = 'halfPage';
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            let lineOffset = 0;
            let editor = vscode.window.activeTextEditor;
            let startColumn = vimState.cursorStartPosition.character;
            let firstLine = editor.visibleRanges[0].start.line;
            let currentSelectionLine = vimState.cursorPosition.line;
            lineOffset = currentSelectionLine - firstLine;
            let timesToRepeat = vimState.recordedState.count || 1;
            yield vscode.commands.executeCommand('editorScroll', {
                to: this.to,
                by: this.by,
                value: timesToRepeat,
                revealCursor: false,
                select: [mode_1.ModeName.Visual, mode_1.ModeName.VisualBlock, mode_1.ModeName.VisualLine].indexOf(vimState.currentMode) >= 0,
            });
            let newFirstLine = editor.visibleRanges[0].start.line;
            let newPosition = new position_1.Position(newFirstLine + lineOffset, startColumn);
            vimState.cursorPosition = newPosition;
            return vimState;
        });
    }
};
CommandMoveHalfPageDown = __decorate([
    base_1.RegisterAction
], CommandMoveHalfPageDown);
let CommandMoveHalfPageUp = class CommandMoveHalfPageUp extends CommandEditorScroll {
    constructor() {
        super(...arguments);
        this.keys = ['<C-u>'];
        this.to = 'up';
        this.by = 'halfPage';
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            let lineOffset = 0;
            let editor = vscode.window.activeTextEditor;
            let startColumn = vimState.cursorStartPosition.character;
            let firstLine = editor.visibleRanges[0].start.line;
            let currentSelectionLine = vimState.cursorPosition.line;
            lineOffset = currentSelectionLine - firstLine;
            let timesToRepeat = vimState.recordedState.count || 1;
            yield vscode.commands.executeCommand('editorScroll', {
                to: this.to,
                by: this.by,
                value: timesToRepeat,
                revealCursor: false,
                select: [mode_1.ModeName.Visual, mode_1.ModeName.VisualBlock, mode_1.ModeName.VisualLine].indexOf(vimState.currentMode) >= 0,
            });
            let newFirstLine = editor.visibleRanges[0].start.line;
            let newPosition = new position_1.Position(newFirstLine + lineOffset, startColumn);
            vimState.cursorPosition = newPosition;
            return vimState;
        });
    }
};
CommandMoveHalfPageUp = __decorate([
    base_1.RegisterAction
], CommandMoveHalfPageUp);
let CommandInsertAtCursor = class CommandInsertAtCursor extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal];
        this.keys = [['i'], ['<insert>']];
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            vimState.currentMode = mode_1.ModeName.Insert;
            return vimState;
        });
    }
    doesActionApply(vimState, keysPressed) {
        // Only allow this command to be prefixed with a count or nothing, no other
        // actions or operators before
        let previousActionsNumbers = true;
        for (const prevAction of vimState.recordedState.actionsRun) {
            if (!(prevAction instanceof CommandNumber)) {
                previousActionsNumbers = false;
                break;
            }
        }
        if (vimState.recordedState.actionsRun.length === 0 || previousActionsNumbers) {
            return super.couldActionApply(vimState, keysPressed);
        }
        return false;
    }
};
CommandInsertAtCursor = __decorate([
    base_1.RegisterAction
], CommandInsertAtCursor);
exports.CommandInsertAtCursor = CommandInsertAtCursor;
let CommandReplaceAtCursorFromNormalMode = class CommandReplaceAtCursorFromNormalMode extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal];
        this.keys = ['R'];
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            let timesToRepeat = vimState.recordedState.count || 1;
            vimState.currentMode = mode_1.ModeName.Replace;
            vimState.replaceState = new replaceState_1.ReplaceState(position, timesToRepeat);
            return vimState;
        });
    }
};
CommandReplaceAtCursorFromNormalMode = __decorate([
    base_1.RegisterAction
], CommandReplaceAtCursorFromNormalMode);
let CommandReplaceAtCursorFromInsertMode = class CommandReplaceAtCursorFromInsertMode extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Insert];
        this.keys = ['<insert>'];
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            let timesToRepeat = vimState.recordedState.count || 1;
            vimState.currentMode = mode_1.ModeName.Replace;
            vimState.replaceState = new replaceState_1.ReplaceState(position, timesToRepeat);
            return vimState;
        });
    }
};
CommandReplaceAtCursorFromInsertMode = __decorate([
    base_1.RegisterAction
], CommandReplaceAtCursorFromInsertMode);
let CommandReplaceInReplaceMode = class CommandReplaceInReplaceMode extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Replace];
        this.keys = ['<character>'];
        this.canBeRepeatedWithDot = true;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            const char = this.keysPressed[0];
            const replaceState = vimState.replaceState;
            if (char === '<BS>') {
                if (position.isBeforeOrEqual(replaceState.replaceCursorStartPosition)) {
                    // If you backspace before the beginning of where you started to replace,
                    // just move the cursor back.
                    vimState.cursorPosition = position.getLeft();
                    vimState.cursorStartPosition = position.getLeft();
                }
                else if (position.line > replaceState.replaceCursorStartPosition.line ||
                    position.character > replaceState.originalChars.length) {
                    vimState.recordedState.transformations.push({
                        type: 'deleteText',
                        position: position,
                    });
                }
                else {
                    vimState.recordedState.transformations.push({
                        type: 'replaceText',
                        text: replaceState.originalChars[position.character - 1],
                        start: position.getLeft(),
                        end: position,
                        diff: new position_1.PositionDiff(0, -1),
                    });
                }
                replaceState.newChars.pop();
            }
            else {
                if (!position.isLineEnd() && char !== '\n') {
                    vimState.recordedState.transformations.push({
                        type: 'replaceText',
                        text: char,
                        start: position,
                        end: position.getRight(),
                        diff: new position_1.PositionDiff(0, 1),
                    });
                }
                else {
                    vimState.recordedState.transformations.push({
                        type: 'insertText',
                        text: char,
                        position: position,
                    });
                }
                replaceState.newChars.push(char);
            }
            return vimState;
        });
    }
};
CommandReplaceInReplaceMode = __decorate([
    base_1.RegisterAction
], CommandReplaceInReplaceMode);
let CommandInsertInSearchMode = class CommandInsertInSearchMode extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.SearchInProgressMode];
        this.keys = [['<character>'], ['<up>'], ['<down>'], ['<C-h>']];
        this.isJump = true;
    }
    runsOnceForEveryCursor() {
        return this.keysPressed[0] === '\n';
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = this.keysPressed[0];
            const searchState = vimState.globalState.searchState;
            const prevSearchList = vimState.globalState.searchStatePrevious;
            // handle special keys first
            if (key === '<BS>' || key === '<shift+BS>' || key === '<C-h>') {
                searchState.searchString = searchState.searchString.slice(0, -1);
            }
            else if (key === '\n') {
                vimState.currentMode = vimState.globalState.searchState.previousMode;
                // Repeat the previous search if no new string is entered
                if (searchState.searchString === '') {
                    if (prevSearchList.length > 0) {
                        searchState.searchString = prevSearchList[prevSearchList.length - 1].searchString;
                    }
                }
                // Store this search if different than previous
                if (vimState.globalState.searchStatePrevious.length !== 0) {
                    let previousSearchState = vimState.globalState.searchStatePrevious;
                    if (searchState.searchString !==
                        previousSearchState[previousSearchState.length - 1].searchString) {
                        previousSearchState.push(searchState);
                        vimState.globalState.addNewSearchHistoryItem(searchState.searchString);
                    }
                }
                else {
                    vimState.globalState.searchStatePrevious.push(searchState);
                    vimState.globalState.addNewSearchHistoryItem(searchState.searchString);
                }
                // Make sure search history does not exceed configuration option
                if (vimState.globalState.searchStatePrevious.length > configuration_1.configuration.history) {
                    vimState.globalState.searchStatePrevious.splice(0, 1);
                }
                // Update the index to the end of the search history
                vimState.globalState.searchStateIndex = vimState.globalState.searchStatePrevious.length - 1;
                // Move cursor to next match
                vimState.cursorPosition = searchState.getNextSearchMatchPosition(vimState.cursorPosition).pos;
                return vimState;
            }
            else if (key === '<up>') {
                vimState.globalState.searchStateIndex -= 1;
                // Clamp the history index to stay within bounds of search history length
                vimState.globalState.searchStateIndex = Math.max(vimState.globalState.searchStateIndex, 0);
                if (prevSearchList[vimState.globalState.searchStateIndex] !== undefined) {
                    searchState.searchString =
                        prevSearchList[vimState.globalState.searchStateIndex].searchString;
                }
            }
            else if (key === '<down>') {
                vimState.globalState.searchStateIndex += 1;
                // If past the first history item, allow user to enter their own search string (not using history)
                if (vimState.globalState.searchStateIndex >
                    vimState.globalState.searchStatePrevious.length - 1) {
                    searchState.searchString = '';
                    vimState.globalState.searchStateIndex = vimState.globalState.searchStatePrevious.length;
                    return vimState;
                }
                if (prevSearchList[vimState.globalState.searchStateIndex] !== undefined) {
                    searchState.searchString =
                        prevSearchList[vimState.globalState.searchStateIndex].searchString;
                }
            }
            else {
                searchState.searchString += this.keysPressed[0];
            }
            return vimState;
        });
    }
};
CommandInsertInSearchMode = __decorate([
    base_1.RegisterAction
], CommandInsertInSearchMode);
let CommandEscInSearchMode = class CommandEscInSearchMode extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.SearchInProgressMode];
        this.keys = ['<Esc>'];
    }
    runsOnceForEveryCursor() {
        return this.keysPressed[0] === '\n';
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            vimState.currentMode = mode_1.ModeName.Normal;
            vimState.globalState.searchState = undefined;
            return vimState;
        });
    }
};
CommandEscInSearchMode = __decorate([
    base_1.RegisterAction
], CommandEscInSearchMode);
let CommandCtrlVInSearchMode = class CommandCtrlVInSearchMode extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.SearchInProgressMode];
        this.keys = ['<C-v>'];
    }
    runsOnceForEveryCursor() {
        return this.keysPressed[0] === '\n';
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchState = vimState.globalState.searchState;
            const textFromClipboard = clipboard_1.Clipboard.Paste();
            searchState.searchString += textFromClipboard;
            return vimState;
        });
    }
};
CommandCtrlVInSearchMode = __decorate([
    base_1.RegisterAction
], CommandCtrlVInSearchMode);
let CommandCmdVInSearchMode = class CommandCmdVInSearchMode extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.SearchInProgressMode];
        this.keys = ['<D-v>'];
    }
    runsOnceForEveryCursor() {
        return this.keysPressed[0] === '\n';
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchState = vimState.globalState.searchState;
            const textFromClipboard = clipboard_1.Clipboard.Paste();
            searchState.searchString += textFromClipboard;
            return vimState;
        });
    }
};
CommandCmdVInSearchMode = __decorate([
    base_1.RegisterAction
], CommandCmdVInSearchMode);
/**
 * Our Vim implementation selects up to but not including the final character
 * of a visual selection, instead opting to render a block cursor on the final
 * character. This works for everything except VSCode's native copy command,
 * which loses the final character because it's not selected. We override that
 * copy command here by default to include the final character.
 */
let CommandOverrideCopy = class CommandOverrideCopy extends BaseCommand {
    /**
     * Our Vim implementation selects up to but not including the final character
     * of a visual selection, instead opting to render a block cursor on the final
     * character. This works for everything except VSCode's native copy command,
     * which loses the final character because it's not selected. We override that
     * copy command here by default to include the final character.
     */
    constructor() {
        super(...arguments);
        this.modes = [
            mode_1.ModeName.Visual,
            mode_1.ModeName.VisualLine,
            mode_1.ModeName.VisualBlock,
            mode_1.ModeName.Insert,
            mode_1.ModeName.Normal,
        ];
        this.keys = ['<copy>']; // A special key - see ModeHandler
    }
    runsOnceForEveryCursor() {
        return false;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            let text = '';
            if (vimState.currentMode === mode_1.ModeName.Visual || vimState.currentMode === mode_1.ModeName.Normal) {
                text = vimState.allCursors
                    .map(range => {
                    const start = position_1.Position.EarlierOf(range.start, range.stop);
                    const stop = position_1.Position.LaterOf(range.start, range.stop);
                    return vimState.editor.document.getText(new vscode.Range(start, stop.getRight()));
                })
                    .join('\n');
            }
            else if (vimState.currentMode === mode_1.ModeName.VisualLine) {
                text = vimState.allCursors
                    .map(range => {
                    return vimState.editor.document.getText(new vscode.Range(position_1.Position.EarlierOf(range.start.getLineBegin(), range.stop.getLineBegin()), position_1.Position.LaterOf(range.start.getLineEnd(), range.stop.getLineEnd())));
                })
                    .join('\n');
            }
            else if (vimState.currentMode === mode_1.ModeName.VisualBlock) {
                for (const { line } of position_1.Position.IterateLine(vimState)) {
                    text += line + '\n';
                }
            }
            else if (vimState.currentMode === mode_1.ModeName.Insert) {
                text = vimState.editor.selections
                    .map(selection => {
                    return vimState.editor.document.getText(new vscode.Range(selection.start, selection.end));
                })
                    .join('\n');
            }
            clipboard_1.Clipboard.Copy(text);
            // all vim yank operations return to normal mode.
            vimState.currentMode = mode_1.ModeName.Normal;
            return vimState;
        });
    }
};
CommandOverrideCopy = __decorate([
    base_1.RegisterAction
], CommandOverrideCopy);
let CommandCmdA = class CommandCmdA extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal, mode_1.ModeName.Visual, mode_1.ModeName.VisualLine, mode_1.ModeName.VisualBlock];
        this.keys = ['<D-a>'];
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            vimState.cursorStartPosition = new position_1.Position(0, vimState.desiredColumn);
            vimState.cursorPosition = new position_1.Position(textEditor_1.TextEditor.getLineCount() - 1, vimState.desiredColumn);
            vimState.currentMode = mode_1.ModeName.VisualLine;
            return vimState;
        });
    }
};
CommandCmdA = __decorate([
    base_1.RegisterAction
], CommandCmdA);
function searchCurrentWord(position, vimState, direction, isExact) {
    const currentWord = textEditor_1.TextEditor.getWord(position);
    // If the search is going left then use `getWordLeft()` on position to start
    // at the beginning of the word. This ensures that any matches happen
    // outside of the currently selected word.
    const searchStartCursorPosition = direction === searchState_1.SearchDirection.Backward
        ? vimState.cursorPosition.getWordLeft(true)
        : vimState.cursorPosition;
    return createSearchStateAndMoveToMatch({
        needle: currentWord,
        vimState,
        direction,
        isExact,
        searchStartCursorPosition,
    });
}
function searchCurrentSelection(vimState, direction) {
    const selection = textEditor_1.TextEditor.getSelection();
    const end = new position_1.Position(selection.end.line, selection.end.character);
    const currentSelection = textEditor_1.TextEditor.getText(selection.with(selection.start, end));
    // Go back to Normal mode, otherwise the selection grows to the next match.
    vimState.currentMode = mode_1.ModeName.Normal;
    // If the search is going left then use `getLeft()` on the selection start.
    // If going right then use `getRight()` on the selection end. This ensures
    // that any matches happen outside of the currently selected word.
    const searchStartCursorPosition = direction === searchState_1.SearchDirection.Backward
        ? vimState.lastVisualSelectionStart.getLeft()
        : vimState.lastVisualSelectionEnd.getRight();
    return createSearchStateAndMoveToMatch({
        needle: currentSelection,
        vimState,
        direction,
        isExact: false,
        searchStartCursorPosition,
    });
}
function createSearchStateAndMoveToMatch(args) {
    const { needle, vimState, isExact } = args;
    if (needle === undefined || needle.length === 0) {
        return vimState;
    }
    const searchString = isExact ? `\\b${needle}\\b` : needle;
    // Start a search for the given term.
    vimState.globalState.searchState = new searchState_1.SearchState(args.direction, vimState.cursorPosition, searchString, { isRegex: isExact }, vimState.currentMode);
    vimState.cursorPosition = vimState.globalState.searchState.getNextSearchMatchPosition(args.searchStartCursorPosition).pos;
    // Turn one of the highlighting flags back on (turned off with :nohl)
    vimState.globalState.hl = true;
    return vimState;
}
let CommandSearchCurrentWordExactForward = class CommandSearchCurrentWordExactForward extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal];
        this.keys = ['*'];
        this.isMotion = true;
        this.runsOnceForEachCountPrefix = true;
        this.isJump = true;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            return searchCurrentWord(position, vimState, searchState_1.SearchDirection.Forward, true);
        });
    }
};
CommandSearchCurrentWordExactForward = __decorate([
    base_1.RegisterAction
], CommandSearchCurrentWordExactForward);
let CommandSearchCurrentWordForward = class CommandSearchCurrentWordForward extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal, mode_1.ModeName.Visual, mode_1.ModeName.VisualLine];
        this.keys = ['g', '*'];
        this.isMotion = true;
        this.runsOnceForEachCountPrefix = true;
        this.isJump = true;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            return searchCurrentWord(position, vimState, searchState_1.SearchDirection.Forward, false);
        });
    }
};
CommandSearchCurrentWordForward = __decorate([
    base_1.RegisterAction
], CommandSearchCurrentWordForward);
let CommandSearchVisualForward = class CommandSearchVisualForward extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Visual, mode_1.ModeName.VisualLine];
        this.keys = ['*'];
        this.isMotion = true;
        this.runsOnceForEachCountPrefix = true;
        this.isJump = true;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            if (configuration_1.configuration.visualstar) {
                return searchCurrentSelection(vimState, searchState_1.SearchDirection.Forward);
            }
            else {
                return searchCurrentWord(position, vimState, searchState_1.SearchDirection.Forward, true);
            }
        });
    }
};
CommandSearchVisualForward = __decorate([
    base_1.RegisterAction
], CommandSearchVisualForward);
let CommandSearchCurrentWordExactBackward = class CommandSearchCurrentWordExactBackward extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal];
        this.keys = ['#'];
        this.isMotion = true;
        this.runsOnceForEachCountPrefix = true;
        this.isJump = true;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            return searchCurrentWord(position, vimState, searchState_1.SearchDirection.Backward, true);
        });
    }
};
CommandSearchCurrentWordExactBackward = __decorate([
    base_1.RegisterAction
], CommandSearchCurrentWordExactBackward);
let CommandSearchCurrentWordBackward = class CommandSearchCurrentWordBackward extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal, mode_1.ModeName.Visual, mode_1.ModeName.VisualLine];
        this.keys = ['g', '#'];
        this.isMotion = true;
        this.runsOnceForEachCountPrefix = true;
        this.isJump = true;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            return searchCurrentWord(position, vimState, searchState_1.SearchDirection.Backward, false);
        });
    }
};
CommandSearchCurrentWordBackward = __decorate([
    base_1.RegisterAction
], CommandSearchCurrentWordBackward);
let CommandSearchVisualBackward = class CommandSearchVisualBackward extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Visual, mode_1.ModeName.VisualLine];
        this.keys = ['#'];
        this.isMotion = true;
        this.runsOnceForEachCountPrefix = true;
        this.isJump = true;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            if (configuration_1.configuration.visualstar) {
                return searchCurrentSelection(vimState, searchState_1.SearchDirection.Backward);
            }
            else {
                return searchCurrentWord(position, vimState, searchState_1.SearchDirection.Backward, true);
            }
        });
    }
};
CommandSearchVisualBackward = __decorate([
    base_1.RegisterAction
], CommandSearchVisualBackward);
let CommandSearchForwards = class CommandSearchForwards extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal, mode_1.ModeName.Visual, mode_1.ModeName.VisualLine, mode_1.ModeName.VisualBlock];
        this.keys = ['/'];
        this.isMotion = true;
        this.isJump = true;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            vimState.globalState.searchState = new searchState_1.SearchState(searchState_1.SearchDirection.Forward, vimState.cursorPosition, '', { isRegex: true }, vimState.currentMode);
            vimState.currentMode = mode_1.ModeName.SearchInProgressMode;
            // Reset search history index
            vimState.globalState.searchStateIndex = vimState.globalState.searchStatePrevious.length;
            vimState.globalState.hl = true;
            return vimState;
        });
    }
};
CommandSearchForwards = __decorate([
    base_1.RegisterAction
], CommandSearchForwards);
exports.CommandSearchForwards = CommandSearchForwards;
let CommandSearchBackwards = class CommandSearchBackwards extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal, mode_1.ModeName.Visual, mode_1.ModeName.VisualLine, mode_1.ModeName.VisualBlock];
        this.keys = ['?'];
        this.isMotion = true;
        this.isJump = true;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            vimState.globalState.searchState = new searchState_1.SearchState(searchState_1.SearchDirection.Backward, vimState.cursorPosition, '', { isRegex: true }, vimState.currentMode);
            vimState.currentMode = mode_1.ModeName.SearchInProgressMode;
            // Reset search history index
            vimState.globalState.searchStateIndex = vimState.globalState.searchStatePrevious.length;
            vimState.globalState.hl = true;
            return vimState;
        });
    }
};
CommandSearchBackwards = __decorate([
    base_1.RegisterAction
], CommandSearchBackwards);
exports.CommandSearchBackwards = CommandSearchBackwards;
let MarkCommand = class MarkCommand extends BaseCommand {
    constructor() {
        super(...arguments);
        this.keys = ['m', '<character>'];
        this.modes = [mode_1.ModeName.Normal];
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            const markName = this.keysPressed[1];
            vimState.historyTracker.addMark(position, markName);
            return vimState;
        });
    }
};
MarkCommand = __decorate([
    base_1.RegisterAction
], MarkCommand);
exports.MarkCommand = MarkCommand;
let PutCommand = PutCommand_1 = class PutCommand extends BaseCommand {
    constructor(multicursorIndex) {
        super();
        this.keys = ['p'];
        this.modes = [mode_1.ModeName.Normal];
        this.runsOnceForEachCountPrefix = true;
        this.canBeRepeatedWithDot = true;
        this.multicursorIndex = multicursorIndex;
    }
    static GetText(vimState, multicursorIndex = undefined) {
        return __awaiter(this, void 0, void 0, function* () {
            const register = yield register_1.Register.get(vimState);
            if (vimState.isMultiCursor) {
                if (multicursorIndex === undefined) {
                    throw new Error('No multi-cursor index when calling PutCommand#getText');
                }
                if (vimState.isMultiCursor && typeof register.text === 'object') {
                    return register.text[multicursorIndex];
                }
            }
            return register.text;
        });
    }
    exec(position, vimState, after = false, adjustIndent = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const register = yield register_1.Register.get(vimState);
            const dest = after ? position : position.getRight();
            if (register.text instanceof recordedState_1.RecordedState) {
                /**
                 *  Paste content from recordedState. This one is actually complex as
                 *  Vim has internal key code for key strokes.For example, Backspace
                 *  is stored as `<80>kb`. So if you replay a macro, which is stored
                 *  in a register as `a1<80>kb2`, youshall just get `2` inserted as
                 *  `a` represents entering Insert Mode, `<80>bk` represents
                 *  Backspace. However here, we shall
                 *  insert the plain text content of the register, which is `a1<80>kb2`.
                 */
                vimState.recordedState.transformations.push({
                    type: 'macro',
                    register: vimState.recordedState.registerName,
                    replay: 'keystrokes',
                });
                return vimState;
            }
            else if (typeof register.text === 'object' && vimState.currentMode === mode_1.ModeName.VisualBlock) {
                return yield this.execVisualBlockPaste(register.text, position, vimState, after);
            }
            let text = yield PutCommand_1.GetText(vimState, this.multicursorIndex);
            let textToAdd;
            let whereToAddText;
            let diff = new position_1.PositionDiff(0, 0);
            const noPrevLine = vimState.cursorStartPosition.isAtDocumentBegin();
            const noNextLine = vimState.cursorPosition.isAtDocumentEnd();
            if (register.registerMode === register_1.RegisterMode.CharacterWise) {
                textToAdd = text;
                whereToAddText = dest;
            }
            else if (vimState.currentMode === mode_1.ModeName.Visual &&
                register.registerMode === register_1.RegisterMode.LineWise) {
                // in the specific case of linewise register data during visual mode,
                // we need extra newline feeds
                textToAdd = '\n' + text + '\n';
                whereToAddText = dest;
            }
            else if (vimState.currentMode === mode_1.ModeName.VisualLine &&
                register.registerMode === register_1.RegisterMode.LineWise) {
                // in the specific case of linewise register data during visual mode,
                // we need extra newline feeds
                const left = !noPrevLine && noNextLine ? '\n' : '';
                const right = noNextLine ? '' : '\n';
                textToAdd = left + text + right;
                whereToAddText = dest;
            }
            else {
                if (adjustIndent) {
                    // Adjust indent to current line
                    let indentationWidth = textEditor_1.TextEditor.getIndentationLevel(textEditor_1.TextEditor.getLineAt(position).text);
                    let firstLineIdentationWidth = textEditor_1.TextEditor.getIndentationLevel(text.split('\n')[0]);
                    text = text
                        .split('\n')
                        .map(line => {
                        let currentIdentationWidth = textEditor_1.TextEditor.getIndentationLevel(line);
                        let newIndentationWidth = currentIdentationWidth - firstLineIdentationWidth + indentationWidth;
                        return textEditor_1.TextEditor.setIndentationLevel(line, newIndentationWidth);
                    })
                        .join('\n');
                }
                if (after) {
                    // P insert before current line
                    textToAdd = text + '\n';
                    whereToAddText = dest.getLineBegin();
                }
                else {
                    // p paste after current line
                    textToAdd = '\n' + text;
                    whereToAddText = dest.getLineEnd();
                }
            }
            // After using "p" or "P" in Visual mode the text that was put will be
            // selected (from Vim's ":help gv").
            if (vimState.currentMode === mode_1.ModeName.Visual ||
                vimState.currentMode === mode_1.ModeName.VisualLine ||
                vimState.currentMode === mode_1.ModeName.VisualBlock) {
                vimState.lastVisualMode = vimState.currentMode;
                vimState.lastVisualSelectionStart = whereToAddText;
                let textToEnd = textToAdd;
                if (vimState.currentMode === mode_1.ModeName.VisualLine &&
                    textToAdd[textToAdd.length - 1] === '\n') {
                    // don't go next line
                    textToEnd = textToAdd.substring(0, textToAdd.length - 1);
                }
                vimState.lastVisualSelectionEnd = whereToAddText.advancePositionByText(textToEnd);
            }
            // More vim weirdness: If the thing you're pasting has a newline, the cursor
            // stays in the same place. Otherwise, it moves to the end of what you pasted.
            const numNewlines = text.split('\n').length - 1;
            const currentLineLength = textEditor_1.TextEditor.getLineAt(position).text.length;
            if (vimState.currentMode === mode_1.ModeName.VisualLine &&
                register.registerMode === register_1.RegisterMode.LineWise) {
                const numNewline = [...text].filter(c => c === '\n').length;
                diff = position_1.PositionDiff.NewBOLDiff(-numNewline - (noNextLine ? 0 : 1));
            }
            else if (register.registerMode === register_1.RegisterMode.LineWise) {
                const check = text.match(/^\s*/);
                let numWhitespace = 0;
                if (check) {
                    numWhitespace = check[0].length;
                }
                if (after) {
                    diff = position_1.PositionDiff.NewBOLDiff(-numNewlines - 1, numWhitespace);
                }
                else {
                    diff = position_1.PositionDiff.NewBOLDiff(currentLineLength > 0 ? 1 : -numNewlines, numWhitespace);
                }
            }
            else {
                if (text.indexOf('\n') === -1) {
                    if (!position.isLineEnd()) {
                        if (after) {
                            diff = new position_1.PositionDiff(0, -1);
                        }
                        else {
                            diff = new position_1.PositionDiff(0, textToAdd.length);
                        }
                    }
                }
                else {
                    if (position.isLineEnd()) {
                        diff = position_1.PositionDiff.NewBOLDiff(-numNewlines, position.character);
                    }
                    else {
                        if (after) {
                            diff = position_1.PositionDiff.NewBOLDiff(-numNewlines, position.character);
                        }
                        else {
                            diff = new position_1.PositionDiff(0, 1);
                        }
                    }
                }
            }
            vimState.recordedState.transformations.push({
                type: 'insertText',
                text: textToAdd,
                position: whereToAddText,
                diff: diff,
            });
            vimState.currentRegisterMode = register.registerMode;
            return vimState;
        });
    }
    execVisualBlockPaste(block, position, vimState, after) {
        return __awaiter(this, void 0, void 0, function* () {
            if (after) {
                position = position.getRight();
            }
            // Add empty lines at the end of the document, if necessary.
            let linesToAdd = Math.max(0, block.length - (textEditor_1.TextEditor.getLineCount() - position.line) + 1);
            if (linesToAdd > 0) {
                yield textEditor_1.TextEditor.insertAt(Array(linesToAdd).join('\n'), new position_1.Position(textEditor_1.TextEditor.getLineCount() - 1, textEditor_1.TextEditor.getLineAt(new position_1.Position(textEditor_1.TextEditor.getLineCount() - 1, 0)).text.length));
            }
            // paste the entire block.
            for (let lineIndex = position.line; lineIndex < position.line + block.length; lineIndex++) {
                const line = block[lineIndex - position.line];
                const insertPos = new position_1.Position(lineIndex, Math.min(position.character, textEditor_1.TextEditor.getLineAt(new position_1.Position(lineIndex, 0)).text.length));
                yield textEditor_1.TextEditor.insertAt(line, insertPos);
            }
            vimState.currentRegisterMode = register_1.RegisterMode.AscertainFromCurrentMode;
            return vimState;
        });
    }
    execCount(position, vimState) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield _super("execCount").call(this, position, vimState);
            if (vimState.effectiveRegisterMode === register_1.RegisterMode.LineWise &&
                vimState.recordedState.count > 0) {
                const numNewlines = (yield PutCommand_1.GetText(vimState, this.multicursorIndex)).split('\n').length *
                    vimState.recordedState.count;
                result.recordedState.transformations.push({
                    type: 'moveCursor',
                    diff: new position_1.PositionDiff(-numNewlines + 1, 0),
                    cursorIndex: this.multicursorIndex,
                });
            }
            return result;
        });
    }
};
PutCommand = PutCommand_1 = __decorate([
    base_1.RegisterAction
], PutCommand);
exports.PutCommand = PutCommand;
let GPutCommand = class GPutCommand extends BaseCommand {
    constructor() {
        super(...arguments);
        this.keys = ['g', 'p'];
        this.modes = [mode_1.ModeName.Normal, mode_1.ModeName.Visual, mode_1.ModeName.VisualLine];
        this.runsOnceForEachCountPrefix = true;
        this.canBeRepeatedWithDot = true;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield new PutCommand().exec(position, vimState);
            return result;
        });
    }
    execCount(position, vimState) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            const register = yield register_1.Register.get(vimState);
            let addedLinesCount;
            if (register.text instanceof recordedState_1.RecordedState) {
                vimState.recordedState.transformations.push({
                    type: 'macro',
                    register: vimState.recordedState.registerName,
                    replay: 'keystrokes',
                });
                return vimState;
            }
            if (typeof register.text === 'object') {
                // visual block mode
                addedLinesCount = register.text.length * vimState.recordedState.count;
            }
            else {
                addedLinesCount = register.text.split('\n').length;
            }
            const result = yield _super("execCount").call(this, position, vimState);
            if (vimState.effectiveRegisterMode === register_1.RegisterMode.LineWise) {
                const line = textEditor_1.TextEditor.getLineAt(position).text;
                const addAnotherLine = line.length > 0 && addedLinesCount > 1;
                result.recordedState.transformations.push({
                    type: 'moveCursor',
                    diff: position_1.PositionDiff.NewBOLDiff(1 + (addAnotherLine ? 1 : 0), 0),
                    cursorIndex: this.multicursorIndex,
                });
            }
            return result;
        });
    }
};
GPutCommand = __decorate([
    base_1.RegisterAction
], GPutCommand);
exports.GPutCommand = GPutCommand;
let PutWithIndentCommand = class PutWithIndentCommand extends BaseCommand {
    constructor() {
        super(...arguments);
        this.keys = [']', 'p'];
        this.modes = [mode_1.ModeName.Normal, mode_1.ModeName.Visual, mode_1.ModeName.VisualLine];
        this.runsOnceForEachCountPrefix = true;
        this.canBeRepeatedWithDot = true;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield new PutCommand().exec(position, vimState, false, true);
            return result;
        });
    }
    execCount(position, vimState) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return yield _super("execCount").call(this, position, vimState);
        });
    }
};
PutWithIndentCommand = __decorate([
    base_1.RegisterAction
], PutWithIndentCommand);
exports.PutWithIndentCommand = PutWithIndentCommand;
let PutCommandVisual = class PutCommandVisual extends BaseCommand {
    constructor() {
        super(...arguments);
        this.keys = [['p'], ['P']];
        this.modes = [mode_1.ModeName.Visual, mode_1.ModeName.VisualLine];
        this.runsOnceForEachCountPrefix = true;
        // TODO - execWithCount
    }
    exec(position, vimState, after = false) {
        return __awaiter(this, void 0, void 0, function* () {
            let start = vimState.cursorStartPosition;
            let end = vimState.cursorPosition;
            const isLineWise = vimState.currentMode === mode_1.ModeName.VisualLine;
            if (start.isAfter(end)) {
                [start, end] = [end, start];
            }
            // If the to be inserted text is linewise we have a seperate logic delete the
            // selection first than insert
            let oldMode = vimState.currentMode;
            let register = yield register_1.Register.get(vimState);
            if (register.registerMode === register_1.RegisterMode.LineWise) {
                const replaceRegister = yield register_1.Register.getByKey(vimState.recordedState.registerName);
                let deleteResult = yield new operator.DeleteOperator(this.multicursorIndex).run(vimState, start, end, true);
                const deletedRegister = yield register_1.Register.getByKey(vimState.recordedState.registerName);
                register_1.Register.putByKey(replaceRegister.text, vimState.recordedState.registerName, replaceRegister.registerMode);
                // to ensure, that the put command nows this is
                // an linewise register insertion in visual mode of
                // characterwise, linewise
                let resultMode = deleteResult.currentMode;
                deleteResult.currentMode = oldMode;
                deleteResult = yield new PutCommand().exec(start, deleteResult, true);
                deleteResult.currentMode = resultMode;
                register_1.Register.putByKey(deletedRegister.text, vimState.recordedState.registerName, deletedRegister.registerMode);
                return deleteResult;
            }
            // The reason we need to handle Delete and Yank separately is because of
            // linewise mode. If we're in visualLine mode, then we want to copy
            // linewise but not necessarily delete linewise.
            let putResult = yield new PutCommand(this.multicursorIndex).exec(start, vimState, true);
            putResult.currentRegisterMode = isLineWise ? register_1.RegisterMode.LineWise : register_1.RegisterMode.CharacterWise;
            putResult.recordedState.registerName = configuration_1.configuration.useSystemClipboard ? '*' : '"';
            putResult = yield new operator.YankOperator(this.multicursorIndex).run(putResult, start, end);
            putResult.currentRegisterMode = register_1.RegisterMode.CharacterWise;
            putResult = yield new operator.DeleteOperator(this.multicursorIndex).run(putResult, start, end.getLeftIfEOL(), false);
            putResult.currentRegisterMode = register_1.RegisterMode.AscertainFromCurrentMode;
            return putResult;
        });
    }
};
PutCommandVisual = __decorate([
    base_1.RegisterAction
], PutCommandVisual);
exports.PutCommandVisual = PutCommandVisual;
let PutBeforeCommand = class PutBeforeCommand extends BaseCommand {
    constructor() {
        super(...arguments);
        this.keys = ['P'];
        this.modes = [mode_1.ModeName.Normal];
        this.canBeRepeatedWithDot = true;
        this.runsOnceForEachCountPrefix = true;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            const command = new PutCommand();
            command.multicursorIndex = this.multicursorIndex;
            const result = yield command.exec(position, vimState, true);
            return result;
        });
    }
};
PutBeforeCommand = __decorate([
    base_1.RegisterAction
], PutBeforeCommand);
exports.PutBeforeCommand = PutBeforeCommand;
let GPutBeforeCommand = class GPutBeforeCommand extends BaseCommand {
    constructor() {
        super(...arguments);
        this.keys = ['g', 'P'];
        this.modes = [mode_1.ModeName.Normal];
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield new PutCommand().exec(position, vimState, true);
            const register = yield register_1.Register.get(vimState);
            let addedLinesCount;
            if (register.text instanceof recordedState_1.RecordedState) {
                vimState.recordedState.transformations.push({
                    type: 'macro',
                    register: vimState.recordedState.registerName,
                    replay: 'keystrokes',
                });
                return vimState;
            }
            else if (typeof register.text === 'object') {
                // visual block mode
                addedLinesCount = register.text.length * vimState.recordedState.count;
            }
            else {
                addedLinesCount = register.text.split('\n').length;
            }
            if (vimState.effectiveRegisterMode === register_1.RegisterMode.LineWise) {
                const line = textEditor_1.TextEditor.getLineAt(position).text;
                const addAnotherLine = line.length > 0 && addedLinesCount > 1;
                result.recordedState.transformations.push({
                    type: 'moveCursor',
                    diff: position_1.PositionDiff.NewBOLDiff(1 + (addAnotherLine ? 1 : 0), 0),
                    cursorIndex: this.multicursorIndex,
                });
            }
            return result;
        });
    }
};
GPutBeforeCommand = __decorate([
    base_1.RegisterAction
], GPutBeforeCommand);
exports.GPutBeforeCommand = GPutBeforeCommand;
let PutBeforeWithIndentCommand = class PutBeforeWithIndentCommand extends BaseCommand {
    constructor() {
        super(...arguments);
        this.keys = ['[', 'p'];
        this.modes = [mode_1.ModeName.Normal];
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield new PutCommand().exec(position, vimState, true, true);
            if (vimState.effectiveRegisterMode === register_1.RegisterMode.LineWise) {
                result.cursorPosition = result.cursorPosition
                    .getPreviousLineBegin()
                    .getFirstLineNonBlankChar();
            }
            return result;
        });
    }
};
PutBeforeWithIndentCommand = __decorate([
    base_1.RegisterAction
], PutBeforeWithIndentCommand);
exports.PutBeforeWithIndentCommand = PutBeforeWithIndentCommand;
let CommandShowCommandLine = class CommandShowCommandLine extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal, mode_1.ModeName.Visual, mode_1.ModeName.VisualLine, mode_1.ModeName.VisualBlock];
        this.keys = [':'];
    }
    runsOnceForEveryCursor() {
        return false;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            if (vimState.currentMode === mode_1.ModeName.Normal) {
                if (vimState.recordedState.count) {
                    vimState.currentCommandlineText = `.,.+${vimState.recordedState.count - 1}`;
                }
                else {
                    vimState.currentCommandlineText = '';
                }
            }
            else {
                vimState.currentCommandlineText = "'<,'>";
            }
            // Initialize the cursor position
            vimState.statusBarCursorCharacterPos = vimState.currentCommandlineText.length;
            // Store the current mode for use in retaining selection
            commandLine_1.commandLine.previousMode = vimState.currentMode;
            // Change to the new mode
            vimState.currentMode = mode_1.ModeName.CommandlineInProgress;
            // Reset history navigation index
            commandLine_1.commandLine.commandlineHistoryIndex = commandLine_1.commandLine.historyEntries.length;
            return vimState;
        });
    }
};
CommandShowCommandLine = __decorate([
    base_1.RegisterAction
], CommandShowCommandLine);
let CommandInsertInCommandline = class CommandInsertInCommandline extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.CommandlineInProgress];
        this.keys = [['<character>'], ['<up>'], ['<down>'], ['<left>'], ['<right>'], ['<C-h>']];
    }
    runsOnceForEveryCursor() {
        return this.keysPressed[0] === '\n';
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = this.keysPressed[0];
            // handle special keys first
            if (key === '<BS>' || key === '<shift+BS>' || key === '<C-h>') {
                if (vimState.statusBarCursorCharacterPos === 0) {
                    return vimState;
                }
                vimState.currentCommandlineText =
                    vimState.currentCommandlineText.slice(0, vimState.statusBarCursorCharacterPos - 1) +
                        vimState.currentCommandlineText.slice(vimState.statusBarCursorCharacterPos);
                vimState.statusBarCursorCharacterPos = Math.max(vimState.statusBarCursorCharacterPos - 1, 0);
            }
            else if (key === '\n') {
                yield commandLine_1.commandLine.Run(vimState.currentCommandlineText, vimState);
                vimState.currentMode = mode_1.ModeName.Normal;
                return vimState;
            }
            else if (key === '<up>') {
                commandLine_1.commandLine.commandlineHistoryIndex -= 1;
                // Clamp the history index to stay within bounds of command history length
                commandLine_1.commandLine.commandlineHistoryIndex = Math.max(commandLine_1.commandLine.commandlineHistoryIndex, 0);
                if (commandLine_1.commandLine.historyEntries[commandLine_1.commandLine.commandlineHistoryIndex] !== undefined) {
                    vimState.currentCommandlineText =
                        commandLine_1.commandLine.historyEntries[commandLine_1.commandLine.commandlineHistoryIndex];
                }
                vimState.statusBarCursorCharacterPos = vimState.currentCommandlineText.length;
            }
            else if (key === '<down>') {
                commandLine_1.commandLine.commandlineHistoryIndex += 1;
                // If past the first history item, allow user to enter their own new command string (not using history)
                if (commandLine_1.commandLine.commandlineHistoryIndex > commandLine_1.commandLine.historyEntries.length - 1) {
                    if (commandLine_1.commandLine.previousMode === mode_1.ModeName.Normal) {
                        vimState.currentCommandlineText = '';
                    }
                    else {
                        vimState.currentCommandlineText = "'<,'>";
                    }
                    commandLine_1.commandLine.commandlineHistoryIndex = commandLine_1.commandLine.historyEntries.length;
                    vimState.statusBarCursorCharacterPos = vimState.currentCommandlineText.length;
                    return vimState;
                }
                if (commandLine_1.commandLine.historyEntries[commandLine_1.commandLine.commandlineHistoryIndex] !== undefined) {
                    vimState.currentCommandlineText =
                        commandLine_1.commandLine.historyEntries[commandLine_1.commandLine.commandlineHistoryIndex];
                }
                vimState.statusBarCursorCharacterPos = vimState.currentCommandlineText.length;
            }
            else if (key === '<right>') {
                vimState.statusBarCursorCharacterPos = Math.min(vimState.statusBarCursorCharacterPos + 1, vimState.currentCommandlineText.length);
            }
            else if (key === '<left>') {
                vimState.statusBarCursorCharacterPos = Math.max(vimState.statusBarCursorCharacterPos - 1, 0);
            }
            else {
                let modifiedString = vimState.currentCommandlineText.split('');
                modifiedString.splice(vimState.statusBarCursorCharacterPos, 0, this.keysPressed[0]);
                vimState.currentCommandlineText = modifiedString.join('');
                vimState.statusBarCursorCharacterPos += 1;
            }
            return vimState;
        });
    }
};
CommandInsertInCommandline = __decorate([
    base_1.RegisterAction
], CommandInsertInCommandline);
let CommandEscInCommandline = class CommandEscInCommandline extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.CommandlineInProgress];
        this.keys = [['<Esc>'], ['<C-c>'], ['<C-[>']];
    }
    runsOnceForEveryCursor() {
        return this.keysPressed[0] === '\n';
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            vimState.currentMode = mode_1.ModeName.Normal;
            return vimState;
        });
    }
};
CommandEscInCommandline = __decorate([
    base_1.RegisterAction
], CommandEscInCommandline);
let CommandCtrlVInCommandline = class CommandCtrlVInCommandline extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.CommandlineInProgress];
        this.keys = ['<C-v>'];
    }
    runsOnceForEveryCursor() {
        return this.keysPressed[0] === '\n';
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            const textFromClipboard = clipboard_1.Clipboard.Paste();
            let modifiedString = vimState.currentCommandlineText.split('');
            modifiedString.splice(vimState.statusBarCursorCharacterPos, 0, textFromClipboard);
            vimState.currentCommandlineText = modifiedString.join('');
            vimState.statusBarCursorCharacterPos += textFromClipboard.length;
            return vimState;
        });
    }
};
CommandCtrlVInCommandline = __decorate([
    base_1.RegisterAction
], CommandCtrlVInCommandline);
let CommandCmdVInCommandline = class CommandCmdVInCommandline extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.CommandlineInProgress];
        this.keys = ['<D-v>'];
    }
    runsOnceForEveryCursor() {
        return this.keysPressed[0] === '\n';
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            const textFromClipboard = clipboard_1.Clipboard.Paste();
            let modifiedString = vimState.currentCommandlineText.split('');
            modifiedString.splice(vimState.statusBarCursorCharacterPos, 0, textFromClipboard);
            vimState.currentCommandlineText = modifiedString.join('');
            vimState.statusBarCursorCharacterPos += textFromClipboard.length;
            return vimState;
        });
    }
};
CommandCmdVInCommandline = __decorate([
    base_1.RegisterAction
], CommandCmdVInCommandline);
let CommandShowCommandHistory = class CommandShowCommandHistory extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal, mode_1.ModeName.Visual, mode_1.ModeName.VisualLine, mode_1.ModeName.VisualBlock];
        this.keys = ['q', ':'];
    }
    runsOnceForEveryCursor() {
        return false;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            vimState.recordedState.transformations.push({
                type: 'showCommandHistory',
            });
            if (vimState.currentMode === mode_1.ModeName.Normal) {
                vimState.currentCommandlineText = '';
            }
            else {
                vimState.currentCommandlineText = "'<,'>";
            }
            vimState.currentMode = mode_1.ModeName.Normal;
            return vimState;
        });
    }
};
CommandShowCommandHistory = __decorate([
    base_1.RegisterAction
], CommandShowCommandHistory);
let CommandDot = class CommandDot extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal];
        this.keys = ['.'];
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            vimState.recordedState.transformations.push({
                type: 'dot',
            });
            return vimState;
        });
    }
};
CommandDot = __decorate([
    base_1.RegisterAction
], CommandDot);
class CommandFold extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal, mode_1.ModeName.Visual, mode_1.ModeName.VisualLine];
    }
    doesActionApply(vimState, keysPressed) {
        // Don't run if there's an operator because the Sneak plugin uses <operator>z
        return (super.doesActionApply(vimState, keysPressed) && vimState.recordedState.operator === undefined);
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            yield vscode.commands.executeCommand(this.commandName);
            vimState.currentMode = mode_1.ModeName.Normal;
            return vimState;
        });
    }
}
let CommandCloseFold = class CommandCloseFold extends CommandFold {
    constructor() {
        super(...arguments);
        this.keys = ['z', 'c'];
        this.commandName = 'editor.fold';
        this.runsOnceForEachCountPrefix = true;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            let timesToRepeat = vimState.recordedState.count || 1;
            yield vscode.commands.executeCommand('editor.fold', { levels: timesToRepeat, direction: 'up' });
            vimState.allCursors = yield util_1.getCursorsAfterSync();
            return vimState;
        });
    }
};
CommandCloseFold = __decorate([
    base_1.RegisterAction
], CommandCloseFold);
let CommandCloseAllFolds = class CommandCloseAllFolds extends CommandFold {
    constructor() {
        super(...arguments);
        this.keys = ['z', 'M'];
        this.commandName = 'editor.foldAll';
    }
};
CommandCloseAllFolds = __decorate([
    base_1.RegisterAction
], CommandCloseAllFolds);
let CommandOpenFold = class CommandOpenFold extends CommandFold {
    constructor() {
        super(...arguments);
        this.keys = ['z', 'o'];
        this.commandName = 'editor.unfold';
        this.runsOnceForEachCountPrefix = true;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            let timesToRepeat = vimState.recordedState.count || 1;
            yield vscode.commands.executeCommand('editor.unfold', {
                levels: timesToRepeat,
                direction: 'down',
            });
            return vimState;
        });
    }
};
CommandOpenFold = __decorate([
    base_1.RegisterAction
], CommandOpenFold);
let CommandOpenAllFolds = class CommandOpenAllFolds extends CommandFold {
    constructor() {
        super(...arguments);
        this.keys = ['z', 'R'];
        this.commandName = 'editor.unfoldAll';
    }
};
CommandOpenAllFolds = __decorate([
    base_1.RegisterAction
], CommandOpenAllFolds);
let CommandCloseAllFoldsRecursively = class CommandCloseAllFoldsRecursively extends CommandFold {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal];
        this.keys = ['z', 'C'];
        this.commandName = 'editor.foldRecursively';
    }
};
CommandCloseAllFoldsRecursively = __decorate([
    base_1.RegisterAction
], CommandCloseAllFoldsRecursively);
let CommandOpenAllFoldsRecursively = class CommandOpenAllFoldsRecursively extends CommandFold {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal];
        this.keys = ['z', 'O'];
        this.commandName = 'editor.unfoldRecursively';
    }
};
CommandOpenAllFoldsRecursively = __decorate([
    base_1.RegisterAction
], CommandOpenAllFoldsRecursively);
let CommandCenterScroll = class CommandCenterScroll extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal, mode_1.ModeName.Visual, mode_1.ModeName.VisualLine, mode_1.ModeName.VisualBlock];
        this.keys = ['z', 'z'];
    }
    doesActionApply(vimState, keysPressed) {
        // Don't run if there's an operator because the Sneak plugin uses <operator>z
        return (super.doesActionApply(vimState, keysPressed) && vimState.recordedState.operator === undefined);
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            // In these modes you want to center on the cursor position
            vimState.editor.revealRange(new vscode.Range(vimState.cursorPosition, vimState.cursorPosition), vscode.TextEditorRevealType.InCenter);
            return vimState;
        });
    }
};
CommandCenterScroll = __decorate([
    base_1.RegisterAction
], CommandCenterScroll);
let CommandCenterScrollFirstChar = class CommandCenterScrollFirstChar extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal, mode_1.ModeName.Visual, mode_1.ModeName.VisualLine, mode_1.ModeName.VisualBlock];
        this.keys = ['z', '.'];
    }
    doesActionApply(vimState, keysPressed) {
        // Don't run if there's an operator because the Sneak plugin uses <operator>z
        return (super.doesActionApply(vimState, keysPressed) && vimState.recordedState.operator === undefined);
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            // In these modes you want to center on the cursor position
            // This particular one moves cursor to first non blank char though
            vimState.editor.revealRange(new vscode.Range(vimState.cursorPosition, vimState.cursorPosition), vscode.TextEditorRevealType.InCenter);
            // Move cursor to first char of line
            vimState.cursorPosition = vimState.cursorPosition.getFirstLineNonBlankChar();
            return vimState;
        });
    }
};
CommandCenterScrollFirstChar = __decorate([
    base_1.RegisterAction
], CommandCenterScrollFirstChar);
let CommandTopScroll = class CommandTopScroll extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal];
        this.keys = ['z', 't'];
    }
    doesActionApply(vimState, keysPressed) {
        // Don't run if there's an operator because the Sneak plugin uses <operator>z
        return (super.doesActionApply(vimState, keysPressed) && vimState.recordedState.operator === undefined);
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            vimState.postponedCodeViewChanges.push({
                command: 'revealLine',
                args: {
                    lineNumber: position.line,
                    at: 'top',
                },
            });
            return vimState;
        });
    }
};
CommandTopScroll = __decorate([
    base_1.RegisterAction
], CommandTopScroll);
let CommandTopScrollFirstChar = class CommandTopScrollFirstChar extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal, mode_1.ModeName.Visual, mode_1.ModeName.VisualLine, mode_1.ModeName.VisualBlock];
        this.keys = ['z', '\n'];
    }
    doesActionApply(vimState, keysPressed) {
        // Don't run if there's an operator because the Sneak plugin uses <operator>z
        return (super.doesActionApply(vimState, keysPressed) && vimState.recordedState.operator === undefined);
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            // In these modes you want to center on the cursor position
            // This particular one moves cursor to first non blank char though
            vimState.postponedCodeViewChanges.push({
                command: 'revealLine',
                args: {
                    lineNumber: position.line,
                    at: 'top',
                },
            });
            // Move cursor to first char of line
            vimState.cursorPosition = vimState.cursorPosition.getFirstLineNonBlankChar();
            return vimState;
        });
    }
};
CommandTopScrollFirstChar = __decorate([
    base_1.RegisterAction
], CommandTopScrollFirstChar);
let CommandBottomScroll = class CommandBottomScroll extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal];
        this.keys = ['z', 'b'];
    }
    doesActionApply(vimState, keysPressed) {
        // Don't run if there's an operator because the Sneak plugin uses <operator>z
        return (super.doesActionApply(vimState, keysPressed) && vimState.recordedState.operator === undefined);
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            vimState.postponedCodeViewChanges.push({
                command: 'revealLine',
                args: {
                    lineNumber: position.line,
                    at: 'bottom',
                },
            });
            return vimState;
        });
    }
};
CommandBottomScroll = __decorate([
    base_1.RegisterAction
], CommandBottomScroll);
let CommandBottomScrollFirstChar = class CommandBottomScrollFirstChar extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal, mode_1.ModeName.Visual, mode_1.ModeName.VisualLine, mode_1.ModeName.VisualBlock];
        this.keys = ['z', '-'];
    }
    doesActionApply(vimState, keysPressed) {
        // Don't run if there's an operator because the Sneak plugin uses <operator>z
        return (super.doesActionApply(vimState, keysPressed) && vimState.recordedState.operator === undefined);
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            // In these modes you want to center on the cursor position
            // This particular one moves cursor to first non blank char though
            vimState.postponedCodeViewChanges.push({
                command: 'revealLine',
                args: {
                    lineNumber: position.line,
                    at: 'bottom',
                },
            });
            // Move cursor to first char of line
            vimState.cursorPosition = vimState.cursorPosition.getFirstLineNonBlankChar();
            return vimState;
        });
    }
};
CommandBottomScrollFirstChar = __decorate([
    base_1.RegisterAction
], CommandBottomScrollFirstChar);
let CommandGoToOtherEndOfHighlightedText = class CommandGoToOtherEndOfHighlightedText extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Visual, mode_1.ModeName.VisualLine, mode_1.ModeName.VisualBlock];
        this.keys = ['o'];
        this.isJump = true;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            [vimState.cursorStartPosition, vimState.cursorPosition] = [
                vimState.cursorPosition,
                vimState.cursorStartPosition,
            ];
            return vimState;
        });
    }
};
CommandGoToOtherEndOfHighlightedText = __decorate([
    base_1.RegisterAction
], CommandGoToOtherEndOfHighlightedText);
let CommandUndo = class CommandUndo extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal];
        this.keys = ['u'];
        this.mustBeFirstKey = true;
    }
    runsOnceForEveryCursor() {
        return false;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            const newPositions = yield vimState.historyTracker.goBackHistoryStep();
            if (newPositions !== undefined) {
                vimState.allCursors = newPositions.map(x => new range_1.Range(x, x));
            }
            vimState.alteredHistory = true;
            return vimState;
        });
    }
};
CommandUndo = __decorate([
    base_1.RegisterAction
], CommandUndo);
let CommandUndoOnLine = class CommandUndoOnLine extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal];
        this.keys = ['U'];
        this.mustBeFirstKey = true;
    }
    runsOnceForEveryCursor() {
        return false;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            const newPositions = yield vimState.historyTracker.goBackHistoryStepsOnLine();
            if (newPositions !== undefined) {
                vimState.allCursors = newPositions.map(x => new range_1.Range(x, x));
            }
            vimState.alteredHistory = true;
            return vimState;
        });
    }
};
CommandUndoOnLine = __decorate([
    base_1.RegisterAction
], CommandUndoOnLine);
let CommandRedo = class CommandRedo extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal];
        this.keys = ['<C-r>'];
    }
    runsOnceForEveryCursor() {
        return false;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            const newPositions = yield vimState.historyTracker.goForwardHistoryStep();
            if (newPositions !== undefined) {
                vimState.allCursors = newPositions.map(x => new range_1.Range(x, x));
            }
            vimState.alteredHistory = true;
            return vimState;
        });
    }
};
CommandRedo = __decorate([
    base_1.RegisterAction
], CommandRedo);
let CommandDeleteToLineEnd = class CommandDeleteToLineEnd extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal];
        this.keys = ['D'];
        this.canBeRepeatedWithDot = true;
    }
    runsOnceForEveryCursor() {
        return true;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            if (position.isLineEnd()) {
                return vimState;
            }
            return yield new operator.DeleteOperator(this.multicursorIndex).run(vimState, position, position.getLineEnd().getLeft());
        });
    }
};
CommandDeleteToLineEnd = __decorate([
    base_1.RegisterAction
], CommandDeleteToLineEnd);
let CommandYankFullLine = class CommandYankFullLine extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal];
        this.keys = ['Y'];
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            const linesDown = (vimState.recordedState.count || 1) - 1;
            const start = position.getLineBegin();
            const end = new position_1.Position(position.line + linesDown, 0).getLineEnd().getLeft();
            vimState.currentRegisterMode = register_1.RegisterMode.LineWise;
            return yield new operator.YankOperator().run(vimState, start, end);
        });
    }
};
CommandYankFullLine = __decorate([
    base_1.RegisterAction
], CommandYankFullLine);
exports.CommandYankFullLine = CommandYankFullLine;
let CommandChangeToLineEnd = class CommandChangeToLineEnd extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal];
        this.keys = ['C'];
        this.runsOnceForEachCountPrefix = false;
        this.mustBeFirstKey = true;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            let count = vimState.recordedState.count || 1;
            return new operator.ChangeOperator().run(vimState, position, position
                .getDownByCount(Math.max(0, count - 1))
                .getLineEnd()
                .getLeft());
        });
    }
};
CommandChangeToLineEnd = __decorate([
    base_1.RegisterAction
], CommandChangeToLineEnd);
let CommandClearLine = class CommandClearLine extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal];
        this.keys = ['S'];
        this.runsOnceForEachCountPrefix = false;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            return new operator.ChangeOperator(this.multicursorIndex).runRepeat(vimState, position, vimState.recordedState.count || 1);
        });
    }
    // Don't clash with sneak
    doesActionApply(vimState, keysPressed) {
        return super.doesActionApply(vimState, keysPressed) && !configuration_1.configuration.sneak;
    }
    couldActionApply(vimState, keysPressed) {
        return super.couldActionApply(vimState, keysPressed) && !configuration_1.configuration.sneak;
    }
};
CommandClearLine = __decorate([
    base_1.RegisterAction
], CommandClearLine);
let CommandExitVisualMode = class CommandExitVisualMode extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Visual];
        this.keys = ['v'];
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            vimState.currentMode = mode_1.ModeName.Normal;
            return vimState;
        });
    }
};
CommandExitVisualMode = __decorate([
    base_1.RegisterAction
], CommandExitVisualMode);
let CommandVisualMode = class CommandVisualMode extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal, mode_1.ModeName.VisualLine, mode_1.ModeName.VisualBlock];
        this.keys = ['v'];
        this.isCompleteAction = false;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            vimState.currentMode = mode_1.ModeName.Visual;
            return vimState;
        });
    }
};
CommandVisualMode = __decorate([
    base_1.RegisterAction
], CommandVisualMode);
let CommandReselectVisual = class CommandReselectVisual extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal];
        this.keys = ['g', 'v'];
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            // Try to restore selection only if valid
            if (vimState.lastVisualSelectionEnd !== undefined &&
                vimState.lastVisualSelectionStart !== undefined &&
                vimState.lastVisualMode !== undefined) {
                if (vimState.lastVisualSelectionEnd.line <= textEditor_1.TextEditor.getLineCount() - 1) {
                    vimState.currentMode = vimState.lastVisualMode;
                    vimState.cursorStartPosition = vimState.lastVisualSelectionStart;
                    vimState.cursorPosition = vimState.lastVisualSelectionEnd.getLeft();
                }
            }
            return vimState;
        });
    }
};
CommandReselectVisual = __decorate([
    base_1.RegisterAction
], CommandReselectVisual);
function selectLastSearchWord(vimState, direction) {
    const searchState = vimState.globalState.searchState;
    if (!searchState || searchState.searchString === '') {
        return vimState;
    }
    const newSearchState = new searchState_1.SearchState(direction, vimState.cursorPosition, searchState.searchString, { isRegex: true }, vimState.currentMode);
    let result = {
        start: vimState.cursorPosition,
        end: vimState.cursorPosition,
        match: false,
    };
    // At first, try to search for current word, and stop searching if matched.
    // Try to search for the next word if not matched or
    // if the cursor is at the end of a match string in visual-mode.
    result = newSearchState.getSearchMatchRangeOf(vimState.cursorPosition);
    if (vimState.currentMode === mode_1.ModeName.Visual &&
        vimState.cursorPosition.isEqual(result.end.getLeftThroughLineBreaks())) {
        result.match = false;
    }
    if (!result.match) {
        // Try to search for the next word
        result = newSearchState.getNextSearchMatchRange(vimState.cursorPosition, 1);
        if (!result.match) {
            return vimState; // no match...
        }
    }
    vimState.cursorStartPosition =
        vimState.currentMode === mode_1.ModeName.Normal ? result.start : vimState.cursorPosition;
    vimState.cursorPosition = result.end.getLeftThroughLineBreaks(); // end is exclusive
    // Move the cursor, this is a bit hacky...
    vscode.window.activeTextEditor.selection = new vscode.Selection(vimState.cursorStartPosition, vimState.cursorPosition);
    vimState.currentMode = mode_1.ModeName.Visual;
    return vimState;
}
let CommandSelectNextLastSearchWord = class CommandSelectNextLastSearchWord extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal, mode_1.ModeName.Visual, mode_1.ModeName.VisualBlock];
        this.keys = ['g', 'n'];
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            return selectLastSearchWord(vimState, searchState_1.SearchDirection.Forward);
        });
    }
};
CommandSelectNextLastSearchWord = __decorate([
    base_1.RegisterAction
], CommandSelectNextLastSearchWord);
let CommandSelectPreviousLastSearchWord = class CommandSelectPreviousLastSearchWord extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal, mode_1.ModeName.Visual, mode_1.ModeName.VisualBlock];
        this.keys = ['g', 'N'];
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            return selectLastSearchWord(vimState, searchState_1.SearchDirection.Backward);
        });
    }
};
CommandSelectPreviousLastSearchWord = __decorate([
    base_1.RegisterAction
], CommandSelectPreviousLastSearchWord);
let CommandVisualBlockMode = class CommandVisualBlockMode extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal, mode_1.ModeName.Visual, mode_1.ModeName.VisualLine];
        this.keys = ['<C-v>'];
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            vimState.currentMode = mode_1.ModeName.VisualBlock;
            return vimState;
        });
    }
};
CommandVisualBlockMode = __decorate([
    base_1.RegisterAction
], CommandVisualBlockMode);
let CommandExitVisualBlockMode = class CommandExitVisualBlockMode extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.VisualBlock];
        this.keys = ['<C-v>'];
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            vimState.currentMode = mode_1.ModeName.Normal;
            return vimState;
        });
    }
};
CommandExitVisualBlockMode = __decorate([
    base_1.RegisterAction
], CommandExitVisualBlockMode);
let CommandVisualLineMode = class CommandVisualLineMode extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal, mode_1.ModeName.Visual, mode_1.ModeName.VisualBlock];
        this.keys = ['V'];
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            vimState.currentMode = mode_1.ModeName.VisualLine;
            return vimState;
        });
    }
};
CommandVisualLineMode = __decorate([
    base_1.RegisterAction
], CommandVisualLineMode);
let CommandExitVisualLineMode = class CommandExitVisualLineMode extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.VisualLine];
        this.keys = ['V'];
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            vimState.currentMode = mode_1.ModeName.Normal;
            return vimState;
        });
    }
};
CommandExitVisualLineMode = __decorate([
    base_1.RegisterAction
], CommandExitVisualLineMode);
let CommandOpenFile = class CommandOpenFile extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal, mode_1.ModeName.Visual];
        this.keys = ['g', 'f'];
        this.isJump = true;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            let fullFilePath = '';
            if (vimState.currentMode === mode_1.ModeName.Visual) {
                const selection = textEditor_1.TextEditor.getSelection();
                const end = new position_1.Position(selection.end.line, selection.end.character + 1);
                fullFilePath = textEditor_1.TextEditor.getText(selection.with(selection.start, end));
            }
            else {
                const start = position.getFilePathLeft(true);
                const end = position.getFilePathRight();
                const range = new vscode.Range(start, end);
                fullFilePath = textEditor_1.TextEditor.getText(range).trim();
            }
            const fileInfo = fullFilePath.match(/(.*?(?=:[0-9]+)|.*):?([0-9]*)$/);
            if (fileInfo) {
                const filePath = fileInfo[1];
                const lineNumber = parseInt(fileInfo[2], 10);
                const fileCommand = new file_1.FileCommand({
                    name: filePath,
                    lineNumber: lineNumber,
                    createFileIfNotExists: false,
                });
                fileCommand.execute();
            }
            return vimState;
        });
    }
};
CommandOpenFile = __decorate([
    base_1.RegisterAction
], CommandOpenFile);
let CommandGoToDefinition = class CommandGoToDefinition extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal];
        this.keys = [['g', 'd'], ['<C-]>']];
        this.isJump = true;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            const oldActiveEditor = vimState.editor;
            yield vscode.commands.executeCommand('editor.action.goToDeclaration');
            if (oldActiveEditor === vimState.editor) {
                vimState.cursorPosition = position_1.Position.FromVSCodePosition(vimState.editor.selection.start);
            }
            return vimState;
        });
    }
};
CommandGoToDefinition = __decorate([
    base_1.RegisterAction
], CommandGoToDefinition);
let CommandGoBackInChangelist = class CommandGoBackInChangelist extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal];
        this.keys = ['g', ';'];
        this.isJump = true;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            const originalIndex = vimState.historyTracker.changelistIndex;
            const prevPos = vimState.historyTracker.getChangePositionAtindex(originalIndex - 1);
            const currPos = vimState.historyTracker.getChangePositionAtindex(originalIndex);
            if (prevPos !== undefined) {
                vimState.cursorPosition = prevPos[0];
                vimState.historyTracker.changelistIndex = originalIndex - 1;
            }
            else if (currPos !== undefined) {
                vimState.cursorPosition = currPos[0];
            }
            return vimState;
        });
    }
};
CommandGoBackInChangelist = __decorate([
    base_1.RegisterAction
], CommandGoBackInChangelist);
let CommandGoForwardInChangelist = class CommandGoForwardInChangelist extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal];
        this.keys = ['g', ','];
        this.isJump = true;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            const originalIndex = vimState.historyTracker.changelistIndex;
            const nextPos = vimState.historyTracker.getChangePositionAtindex(originalIndex + 1);
            const currPos = vimState.historyTracker.getChangePositionAtindex(originalIndex);
            if (nextPos !== undefined) {
                vimState.cursorPosition = nextPos[0];
                vimState.historyTracker.changelistIndex = originalIndex + 1;
            }
            else if (currPos !== undefined) {
                vimState.cursorPosition = currPos[0];
            }
            return vimState;
        });
    }
};
CommandGoForwardInChangelist = __decorate([
    base_1.RegisterAction
], CommandGoForwardInChangelist);
let CommandGoLastChange = class CommandGoLastChange extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal];
        this.keys = [['`', '.'], ["'", '.']];
        this.isJump = true;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            const lastPos = vimState.historyTracker.getLastHistoryStartPosition();
            if (lastPos !== undefined) {
                vimState.cursorPosition = lastPos[0];
            }
            return vimState;
        });
    }
};
CommandGoLastChange = __decorate([
    base_1.RegisterAction
], CommandGoLastChange);
let CommandInsertAtLastChange = class CommandInsertAtLastChange extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal];
        this.keys = ['g', 'i'];
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            const lastPos = vimState.historyTracker.getLastChangeEndPosition();
            if (lastPos !== undefined) {
                vimState.cursorPosition = lastPos;
                vimState.currentMode = mode_1.ModeName.Insert;
            }
            return vimState;
        });
    }
};
CommandInsertAtLastChange = __decorate([
    base_1.RegisterAction
], CommandInsertAtLastChange);
let CommandInsertAtFirstCharacter = class CommandInsertAtFirstCharacter extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal];
        this.keys = ['I'];
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            vimState.currentMode = mode_1.ModeName.Insert;
            vimState.cursorPosition = position.getFirstLineNonBlankChar();
            return vimState;
        });
    }
};
CommandInsertAtFirstCharacter = __decorate([
    base_1.RegisterAction
], CommandInsertAtFirstCharacter);
exports.CommandInsertAtFirstCharacter = CommandInsertAtFirstCharacter;
let CommandInsertAtLineBegin = class CommandInsertAtLineBegin extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal];
        this.mustBeFirstKey = true;
        this.keys = ['g', 'I'];
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            vimState.currentMode = mode_1.ModeName.Insert;
            vimState.cursorPosition = position.getLineBegin();
            return vimState;
        });
    }
};
CommandInsertAtLineBegin = __decorate([
    base_1.RegisterAction
], CommandInsertAtLineBegin);
let CommandInsertAfterCursor = class CommandInsertAfterCursor extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal];
        this.keys = ['a'];
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            vimState.currentMode = mode_1.ModeName.Insert;
            vimState.cursorPosition = position.getRight();
            return vimState;
        });
    }
    doesActionApply(vimState, keysPressed) {
        // Only allow this command to be prefixed with a count or nothing, no other
        // actions or operators before
        let previousActionsNumbers = true;
        for (const prevAction of vimState.recordedState.actionsRun) {
            if (!(prevAction instanceof CommandNumber)) {
                previousActionsNumbers = false;
                break;
            }
        }
        if (vimState.recordedState.actionsRun.length === 0 || previousActionsNumbers) {
            return super.couldActionApply(vimState, keysPressed);
        }
        return false;
    }
};
CommandInsertAfterCursor = __decorate([
    base_1.RegisterAction
], CommandInsertAfterCursor);
exports.CommandInsertAfterCursor = CommandInsertAfterCursor;
let CommandInsertAtLineEnd = class CommandInsertAtLineEnd extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal];
        this.keys = ['A'];
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            vimState.currentMode = mode_1.ModeName.Insert;
            vimState.cursorPosition = position.getLineEnd();
            return vimState;
        });
    }
};
CommandInsertAtLineEnd = __decorate([
    base_1.RegisterAction
], CommandInsertAtLineEnd);
exports.CommandInsertAtLineEnd = CommandInsertAtLineEnd;
let CommandInsertNewLineAbove = class CommandInsertNewLineAbove extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal];
        this.keys = ['O'];
    }
    runsOnceForEveryCursor() {
        return false;
    }
    execCount(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            vimState.currentMode = mode_1.ModeName.Insert;
            let count = vimState.recordedState.count || 1;
            // Why do we do this? Who fucking knows??? If the cursor is at the
            // beginning of the line, then editor.action.insertLineBefore does some
            // weird things with following paste command. Refer to
            // https://github.com/VSCodeVim/Vim/pull/1663#issuecomment-300573129 for
            // more details.
            const tPos = position_1.Position.FromVSCodePosition(vscode.window.activeTextEditor.selection.active).getRight();
            vscode.window.activeTextEditor.selection = new vscode.Selection(tPos, tPos);
            for (let i = 0; i < count; i++) {
                yield vscode.commands.executeCommand('editor.action.insertLineBefore');
            }
            vimState.allCursors = yield util_1.getCursorsAfterSync();
            for (let i = 0; i < count; i++) {
                const newPos = new position_1.Position(vimState.allCursors[0].start.line + i, vimState.allCursors[0].start.character);
                vimState.allCursors.push(new range_1.Range(newPos, newPos));
            }
            vimState.allCursors = vimState.allCursors.reverse();
            vimState.isFakeMultiCursor = true;
            vimState.isMultiCursor = true;
            return vimState;
        });
    }
};
CommandInsertNewLineAbove = __decorate([
    base_1.RegisterAction
], CommandInsertNewLineAbove);
let CommandInsertNewLineBefore = class CommandInsertNewLineBefore extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal];
        this.keys = ['o'];
    }
    runsOnceForEveryCursor() {
        return false;
    }
    execCount(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            vimState.currentMode = mode_1.ModeName.Insert;
            let count = vimState.recordedState.count || 1;
            for (let i = 0; i < count; i++) {
                yield vscode.commands.executeCommand('editor.action.insertLineAfter');
            }
            vimState.allCursors = yield util_1.getCursorsAfterSync();
            for (let i = 1; i < count; i++) {
                const newPos = new position_1.Position(vimState.allCursors[0].start.line - i, vimState.allCursors[0].start.character);
                vimState.allCursors.push(new range_1.Range(newPos, newPos));
                // Ahhhhhh. We have to manually set cursor position here as we need text
                // transformations AND to set multiple cursors.
                vimState.recordedState.transformations.push({
                    type: 'insertText',
                    text: textEditor_1.TextEditor.setIndentationLevel('', newPos.character),
                    position: newPos,
                    cursorIndex: i,
                    manuallySetCursorPositions: true,
                });
            }
            vimState.allCursors = vimState.allCursors.reverse();
            vimState.isFakeMultiCursor = true;
            vimState.isMultiCursor = true;
            return vimState;
        });
    }
};
CommandInsertNewLineBefore = __decorate([
    base_1.RegisterAction
], CommandInsertNewLineBefore);
let CommandNavigateBack = class CommandNavigateBack extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal];
        this.keys = [['<C-o>'], ['<C-t>']];
    }
    runsOnceForEveryCursor() {
        return false;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            return vimState.globalState.jumpTracker.jumpBack(position, vimState);
        });
    }
};
CommandNavigateBack = __decorate([
    base_1.RegisterAction
], CommandNavigateBack);
let CommandNavigateForward = class CommandNavigateForward extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal];
        this.keys = ['<C-i>'];
    }
    runsOnceForEveryCursor() {
        return false;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            return vimState.globalState.jumpTracker.jumpForward(position, vimState);
        });
    }
};
CommandNavigateForward = __decorate([
    base_1.RegisterAction
], CommandNavigateForward);
let CommandNavigateLast = class CommandNavigateLast extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal];
        this.keys = ['`', '`'];
        this.isJump = true;
    }
    runsOnceForEveryCursor() {
        return false;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            const oldActiveEditor = vimState.editor;
            yield vscode.commands.executeCommand('workbench.action.navigateLast');
            if (oldActiveEditor === vimState.editor) {
                vimState.cursorPosition = position_1.Position.FromVSCodePosition(vimState.editor.selection.start);
            }
            return vimState;
        });
    }
};
CommandNavigateLast = __decorate([
    base_1.RegisterAction
], CommandNavigateLast);
let CommandNavigateLastBOL = class CommandNavigateLastBOL extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal];
        this.keys = ["'", "'"];
        this.isJump = true;
    }
    runsOnceForEveryCursor() {
        return false;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            const oldActiveEditor = vimState.editor;
            yield vscode.commands.executeCommand('workbench.action.navigateLast');
            if (oldActiveEditor === vimState.editor) {
                const pos = position_1.Position.FromVSCodePosition(vimState.editor.selection.start);
                vimState.cursorPosition = pos.getFirstLineNonBlankChar();
            }
            return vimState;
        });
    }
};
CommandNavigateLastBOL = __decorate([
    base_1.RegisterAction
], CommandNavigateLastBOL);
let CommandQuit = class CommandQuit extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal];
        this.keys = [['<C-w>', 'q'], ['<C-w>', '<C-q>'], ['<C-w>', 'c'], ['<C-w>', '<C-c>']];
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            new quit_1.QuitCommand({}).execute();
            return vimState;
        });
    }
};
CommandQuit = __decorate([
    base_1.RegisterAction
], CommandQuit);
let CommandOnly = class CommandOnly extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal];
        this.keys = [['<C-w>', 'o'], ['<C-w>', '<C-o>']];
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            new only_1.OnlyCommand({}).execute();
            return vimState;
        });
    }
};
CommandOnly = __decorate([
    base_1.RegisterAction
], CommandOnly);
let MoveToRightPane = class MoveToRightPane extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal, mode_1.ModeName.Visual, mode_1.ModeName.VisualLine];
        this.keys = [['<C-w>', 'l'], ['<C-w>', '<right>'], ['<C-w l>'], ['<C-w>', '<C-l>']];
        this.isJump = true;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            vimState.postponedCodeViewChanges.push({
                command: 'workbench.action.navigateRight',
                args: {},
            });
            return vimState;
        });
    }
};
MoveToRightPane = __decorate([
    base_1.RegisterAction
], MoveToRightPane);
let MoveToLowerPane = class MoveToLowerPane extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal, mode_1.ModeName.Visual, mode_1.ModeName.VisualLine];
        this.keys = [['<C-w>', 'j'], ['<C-w>', '<down>'], ['<C-w j>'], ['<C-w>', '<C-j>']];
        this.isJump = true;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            vimState.postponedCodeViewChanges.push({
                command: 'workbench.action.navigateDown',
                args: {},
            });
            return vimState;
        });
    }
};
MoveToLowerPane = __decorate([
    base_1.RegisterAction
], MoveToLowerPane);
let MoveToUpperPane = class MoveToUpperPane extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal, mode_1.ModeName.Visual, mode_1.ModeName.VisualLine];
        this.keys = [['<C-w>', 'k'], ['<C-w>', '<up>'], ['<C-w k>'], ['<C-w>', '<C-k>']];
        this.isJump = true;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            vimState.postponedCodeViewChanges.push({
                command: 'workbench.action.navigateUp',
                args: {},
            });
            return vimState;
        });
    }
};
MoveToUpperPane = __decorate([
    base_1.RegisterAction
], MoveToUpperPane);
let MoveToLeftPane = class MoveToLeftPane extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal, mode_1.ModeName.Visual, mode_1.ModeName.VisualLine];
        this.keys = [['<C-w>', 'h'], ['<C-w>', '<left>'], ['<C-w h>'], ['<C-w>', '<C-h>']];
        this.isJump = true;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            vimState.postponedCodeViewChanges.push({
                command: 'workbench.action.navigateLeft',
                args: {},
            });
            return vimState;
        });
    }
};
MoveToLeftPane = __decorate([
    base_1.RegisterAction
], MoveToLeftPane);
let CycleThroughPanes = class CycleThroughPanes extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal, mode_1.ModeName.Visual, mode_1.ModeName.VisualLine];
        this.keys = [['<C-w>', '<C-w>'], ['<C-w>', 'w']];
        this.isJump = true;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            vimState.postponedCodeViewChanges.push({
                command: 'workbench.action.navigateEditorGroups',
                args: {},
            });
            return vimState;
        });
    }
};
CycleThroughPanes = __decorate([
    base_1.RegisterAction
], CycleThroughPanes);
class BaseTabCommand extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal, mode_1.ModeName.Visual, mode_1.ModeName.VisualLine];
        this.runsOnceForEachCountPrefix = true;
    }
}
let VerticalSplit = class VerticalSplit extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal, mode_1.ModeName.Visual, mode_1.ModeName.VisualLine];
        this.keys = [['<C-w>', 'v'], ['<C-w>', '<C-v>']];
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            vimState.postponedCodeViewChanges.push({
                command: 'workbench.action.splitEditor',
                args: {},
            });
            return vimState;
        });
    }
};
VerticalSplit = __decorate([
    base_1.RegisterAction
], VerticalSplit);
let EvenPaneWidths = class EvenPaneWidths extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal, mode_1.ModeName.Visual, mode_1.ModeName.VisualLine];
        this.keys = ['<C-w>', '='];
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            vimState.postponedCodeViewChanges.push({
                command: 'workbench.action.evenEditorWidths',
                args: {},
            });
            return vimState;
        });
    }
};
EvenPaneWidths = __decorate([
    base_1.RegisterAction
], EvenPaneWidths);
let CommandTabNext = class CommandTabNext extends BaseTabCommand {
    constructor() {
        super(...arguments);
        this.keys = [['g', 't'], ['<C-pagedown>']];
        this.runsOnceForEachCountPrefix = false;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            // gt behaves differently than gT and goes to an absolute index tab
            // (1-based), it does NOT iterate over next tabs
            if (vimState.recordedState.count > 0) {
                new tab_1.TabCommand({
                    tab: tab_1.Tab.Absolute,
                    count: vimState.recordedState.count - 1,
                }).execute();
            }
            else {
                new tab_1.TabCommand({
                    tab: tab_1.Tab.Next,
                    count: 1,
                }).execute();
            }
            return vimState;
        });
    }
};
CommandTabNext = __decorate([
    base_1.RegisterAction
], CommandTabNext);
let CommandTabPrevious = class CommandTabPrevious extends BaseTabCommand {
    constructor() {
        super(...arguments);
        this.keys = [['g', 'T'], ['<C-pageup>']];
        this.runsOnceForEachCountPrefix = true;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            new tab_1.TabCommand({
                tab: tab_1.Tab.Previous,
                count: 1,
            }).execute();
            return vimState;
        });
    }
};
CommandTabPrevious = __decorate([
    base_1.RegisterAction
], CommandTabPrevious);
let ActionDeleteChar = class ActionDeleteChar extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal];
        this.keys = ['x'];
        this.canBeRepeatedWithDot = true;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            // If line is empty, do nothing
            if (textEditor_1.TextEditor.getLineAt(position).text.length < 1) {
                return vimState;
            }
            let timesToRepeat = vimState.recordedState.count || 1;
            const state = yield new operator.DeleteOperator(this.multicursorIndex).run(vimState, position, position.getRightByCount(timesToRepeat - 1));
            state.currentMode = mode_1.ModeName.Normal;
            return state;
        });
    }
};
ActionDeleteChar = __decorate([
    base_1.RegisterAction
], ActionDeleteChar);
let ActionDeleteCharWithDeleteKey = class ActionDeleteCharWithDeleteKey extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal];
        this.keys = ['<Del>'];
        this.runsOnceForEachCountPrefix = true;
        this.canBeRepeatedWithDot = true;
    }
    execCount(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            // If <del> has a count in front of it, then <del> deletes a character
            // off the count. Therefore, 100<del>x, would apply 'x' 10 times.
            // http://vimdoc.sourceforge.net/htmldoc/change.html#<Del>
            if (vimState.recordedState.count !== 0) {
                vimState.recordedState.count = Math.floor(vimState.recordedState.count / 10);
                vimState.recordedState.actionKeys = vimState.recordedState.count.toString().split('');
                vimState.recordedState.commandList = vimState.recordedState.count.toString().split('');
                this.isCompleteAction = false;
                return vimState;
            }
            return yield new ActionDeleteChar().execCount(position, vimState);
        });
    }
};
ActionDeleteCharWithDeleteKey = __decorate([
    base_1.RegisterAction
], ActionDeleteCharWithDeleteKey);
let ActionDeleteLastChar = class ActionDeleteLastChar extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal];
        this.keys = ['X'];
        this.canBeRepeatedWithDot = true;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            if (position.character === 0) {
                return vimState;
            }
            let timesToRepeat = vimState.recordedState.count || 1;
            const state = yield new operator.DeleteOperator(this.multicursorIndex).run(vimState, position.getLeftByCount(timesToRepeat), position.getLeft());
            return state;
        });
    }
};
ActionDeleteLastChar = __decorate([
    base_1.RegisterAction
], ActionDeleteLastChar);
let ActionJoin = class ActionJoin extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal];
        this.keys = ['J'];
        this.canBeRepeatedWithDot = true;
        this.runsOnceForEachCountPrefix = false;
    }
    firstNonWhitespaceIndex(str) {
        for (let i = 0, len = str.length; i < len; i++) {
            let chCode = str.charCodeAt(i);
            if (chCode !== 32 /** space */ && chCode !== 9 /** tab */) {
                return i;
            }
        }
        return -1;
    }
    execJoinLines(startPosition, position, vimState, count) {
        return __awaiter(this, void 0, void 0, function* () {
            count = count - 1 || 1;
            let startLineNumber, startColumn, endLineNumber, endColumn, columnDeltaOffset = 0;
            if (startPosition.isEqual(position) || startPosition.line === position.line) {
                if (position.line + 1 < textEditor_1.TextEditor.getLineCount()) {
                    startLineNumber = position.line;
                    startColumn = 0;
                    endLineNumber = startLineNumber + count;
                    endColumn = textEditor_1.TextEditor.getLineMaxColumn(endLineNumber);
                }
                else {
                    startLineNumber = position.line;
                    startColumn = 0;
                    endLineNumber = position.line;
                    endColumn = textEditor_1.TextEditor.getLineMaxColumn(endLineNumber);
                }
            }
            else {
                startLineNumber = startPosition.line;
                startColumn = 0;
                endLineNumber = position.line;
                endColumn = textEditor_1.TextEditor.getLineMaxColumn(endLineNumber);
            }
            let trimmedLinesContent = textEditor_1.TextEditor.getLineAt(startPosition).text;
            for (let i = startLineNumber + 1; i <= endLineNumber; i++) {
                let lineText = textEditor_1.TextEditor.getLineAt(new position_1.Position(i, 0)).text;
                let firstNonWhitespaceIdx = this.firstNonWhitespaceIndex(lineText);
                if (firstNonWhitespaceIdx >= 0) {
                    let insertSpace = true;
                    if (trimmedLinesContent === '' ||
                        trimmedLinesContent.charAt(trimmedLinesContent.length - 1) === ' ' ||
                        trimmedLinesContent.charAt(trimmedLinesContent.length - 1) === '\t') {
                        insertSpace = false;
                    }
                    let lineTextWithoutIndent = lineText.substr(firstNonWhitespaceIdx);
                    if (lineTextWithoutIndent.charAt(0) === ')') {
                        insertSpace = false;
                    }
                    trimmedLinesContent += (insertSpace ? ' ' : '') + lineTextWithoutIndent;
                    if (insertSpace) {
                        columnDeltaOffset = lineTextWithoutIndent.length + 1;
                    }
                    else {
                        columnDeltaOffset = lineTextWithoutIndent.length;
                    }
                }
                else {
                    if (trimmedLinesContent === '' ||
                        trimmedLinesContent.charAt(trimmedLinesContent.length - 1) === ' ' ||
                        trimmedLinesContent.charAt(trimmedLinesContent.length - 1) === '\t') {
                        columnDeltaOffset += 0;
                    }
                    else {
                        trimmedLinesContent += ' ';
                        columnDeltaOffset += 1;
                    }
                }
            }
            let deleteStartPosition = new position_1.Position(startLineNumber, startColumn);
            let deleteEndPosition = new position_1.Position(endLineNumber, endColumn);
            if (!deleteStartPosition.isEqual(deleteEndPosition)) {
                if (startPosition.isEqual(position)) {
                    vimState.recordedState.transformations.push({
                        type: 'replaceText',
                        text: trimmedLinesContent,
                        start: deleteStartPosition,
                        end: deleteEndPosition,
                        diff: new position_1.PositionDiff(0, trimmedLinesContent.length - columnDeltaOffset - position.character),
                    });
                }
                else {
                    vimState.recordedState.transformations.push({
                        type: 'replaceText',
                        text: trimmedLinesContent,
                        start: deleteStartPosition,
                        end: deleteEndPosition,
                        manuallySetCursorPositions: true,
                    });
                    vimState.cursorPosition = new position_1.Position(startPosition.line, trimmedLinesContent.length - columnDeltaOffset);
                    vimState.cursorStartPosition = vimState.cursorPosition;
                    vimState.currentMode = mode_1.ModeName.Normal;
                }
            }
            return vimState;
        });
    }
    execCount(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            let timesToRepeat = vimState.recordedState.count || 1;
            let resultingCursors = [];
            let i = 0;
            const cursorsToIterateOver = vimState.allCursors
                .map(x => new range_1.Range(x.start, x.stop))
                .sort((a, b) => a.start.line > b.start.line ||
                (a.start.line === b.start.line && a.start.character > b.start.character)
                ? 1
                : -1);
            for (const { start, stop } of cursorsToIterateOver) {
                this.multicursorIndex = i++;
                vimState.cursorPosition = stop;
                vimState.cursorStartPosition = start;
                vimState = yield this.execJoinLines(start, stop, vimState, timesToRepeat);
                resultingCursors.push(new range_1.Range(vimState.cursorStartPosition, vimState.cursorPosition));
                for (const transformation of vimState.recordedState.transformations) {
                    if (transformations_1.isTextTransformation(transformation) && transformation.cursorIndex === undefined) {
                        transformation.cursorIndex = this.multicursorIndex;
                    }
                }
            }
            vimState.allCursors = resultingCursors;
            return vimState;
        });
    }
};
ActionJoin = __decorate([
    base_1.RegisterAction
], ActionJoin);
let ActionJoinVisualMode = class ActionJoinVisualMode extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Visual, mode_1.ModeName.VisualLine];
        this.keys = ['J'];
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            let actionJoin = new ActionJoin();
            let start = position_1.Position.FromVSCodePosition(vimState.editor.selection.start);
            let end = position_1.Position.FromVSCodePosition(vimState.editor.selection.end);
            if (start.isAfter(end)) {
                [start, end] = [end, start];
            }
            /**
             * For joining lines, Visual Line behaves the same as Visual so we align the register mode here.
             */
            vimState.currentRegisterMode = register_1.RegisterMode.CharacterWise;
            vimState = yield actionJoin.execJoinLines(start, end, vimState, 1);
            return vimState;
        });
    }
};
ActionJoinVisualMode = __decorate([
    base_1.RegisterAction
], ActionJoinVisualMode);
let ActionJoinNoWhitespace = class ActionJoinNoWhitespace extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal];
        this.keys = ['g', 'J'];
        this.canBeRepeatedWithDot = true;
        this.runsOnceForEachCountPrefix = true;
    }
    // gJ is essentially J without the edge cases. ;-)
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            if (position.line === textEditor_1.TextEditor.getLineCount() - 1) {
                return vimState; // TODO: bell
            }
            let lineOne = textEditor_1.TextEditor.getLineAt(position).text;
            let lineTwo = textEditor_1.TextEditor.getLineAt(position.getNextLineBegin()).text;
            lineTwo = lineTwo.substring(position.getNextLineBegin().getFirstLineNonBlankChar().character);
            let resultLine = lineOne + lineTwo;
            let newState = yield new operator.DeleteOperator(this.multicursorIndex).run(vimState, position.getLineBegin(), lineTwo.length > 0
                ? position
                    .getNextLineBegin()
                    .getLineEnd()
                    .getLeft()
                : position.getLineEnd());
            vimState.recordedState.transformations.push({
                type: 'insertText',
                text: resultLine,
                position: position,
                diff: new position_1.PositionDiff(0, -lineTwo.length),
            });
            newState.cursorPosition = new position_1.Position(position.line, lineOne.length);
            return newState;
        });
    }
};
ActionJoinNoWhitespace = __decorate([
    base_1.RegisterAction
], ActionJoinNoWhitespace);
let ActionJoinNoWhitespaceVisualMode = class ActionJoinNoWhitespaceVisualMode extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Visual];
        this.keys = ['g', 'J'];
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            let actionJoin = new ActionJoinNoWhitespace();
            let start = position_1.Position.FromVSCodePosition(vimState.editor.selection.start);
            let end = position_1.Position.FromVSCodePosition(vimState.editor.selection.end);
            if (start.line === end.line) {
                return vimState;
            }
            if (start.isAfter(end)) {
                [start, end] = [end, start];
            }
            for (let i = start.line; i < end.line; i++) {
                vimState = yield actionJoin.exec(start, vimState);
            }
            return vimState;
        });
    }
};
ActionJoinNoWhitespaceVisualMode = __decorate([
    base_1.RegisterAction
], ActionJoinNoWhitespaceVisualMode);
let ActionReplaceCharacter = class ActionReplaceCharacter extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal];
        this.keys = ['r', '<character>'];
        this.canBeRepeatedWithDot = true;
        this.runsOnceForEachCountPrefix = false;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            let timesToRepeat = vimState.recordedState.count || 1;
            const toReplace = this.keysPressed[1];
            /**
             * <character> includes <BS>, <SHIFT+BS> and <TAB> but not any control keys,
             * so we ignore the former two keys and have a special handle for <tab>.
             */
            if (['<BS>', '<SHIFT+BS>'].indexOf(toReplace.toUpperCase()) >= 0) {
                return vimState;
            }
            if (position.character + timesToRepeat > position.getLineEnd().character) {
                return vimState;
            }
            let endPos = new position_1.Position(position.line, position.character + timesToRepeat);
            // Return if tried to repeat longer than linelength
            if (endPos.character > textEditor_1.TextEditor.getLineAt(endPos).text.length) {
                return vimState;
            }
            // If last char (not EOL char), add 1 so that replace selection is complete
            if (endPos.character > textEditor_1.TextEditor.getLineAt(endPos).text.length) {
                endPos = new position_1.Position(endPos.line, endPos.character + 1);
            }
            if (toReplace === '<tab>') {
                vimState.recordedState.transformations.push({
                    type: 'deleteRange',
                    range: new range_1.Range(position, endPos),
                });
                vimState.recordedState.transformations.push({
                    type: 'tab',
                    cursorIndex: this.multicursorIndex,
                    diff: new position_1.PositionDiff(0, -1),
                });
            }
            else {
                vimState.recordedState.transformations.push({
                    type: 'replaceText',
                    text: toReplace.repeat(timesToRepeat),
                    start: position,
                    end: endPos,
                    diff: new position_1.PositionDiff(0, timesToRepeat - 1),
                });
            }
            return vimState;
        });
    }
    execCount(position, vimState) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return _super("execCount").call(this, position, vimState);
        });
    }
};
ActionReplaceCharacter = __decorate([
    base_1.RegisterAction
], ActionReplaceCharacter);
let ActionReplaceCharacterVisual = class ActionReplaceCharacterVisual extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Visual, mode_1.ModeName.VisualLine];
        this.keys = ['r', '<character>'];
        this.canBeRepeatedWithDot = true;
    }
    runsOnceForEveryCursor() {
        return false;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            const toInsert = this.keysPressed[1];
            let visualSelectionOffset = 1;
            let start = vimState.cursorStartPosition;
            let end = vimState.cursorPosition;
            // If selection is reversed, reorganize it so that the text replace logic always works
            if (end.isBeforeOrEqual(start)) {
                [start, end] = [end, start];
            }
            // Limit to not replace EOL
            const textLength = textEditor_1.TextEditor.getLineAt(end).text.length;
            if (textLength <= 0) {
                visualSelectionOffset = 0;
            }
            end = new position_1.Position(end.line, Math.min(end.character, textLength > 0 ? textLength - 1 : 0));
            // Iterate over every line in the current selection
            for (var lineNum = start.line; lineNum <= end.line; lineNum++) {
                // Get line of text
                const lineText = textEditor_1.TextEditor.getLineAt(new position_1.Position(lineNum, 0)).text;
                if (start.line === end.line) {
                    // This is a visual section all on one line, only replace the part within the selection
                    vimState.recordedState.transformations.push({
                        type: 'replaceText',
                        text: Array(end.character - start.character + 2).join(toInsert),
                        start: start,
                        end: new position_1.Position(end.line, end.character + 1),
                        manuallySetCursorPositions: true,
                    });
                }
                else if (lineNum === start.line) {
                    // This is the first line of the selection so only replace after the cursor
                    vimState.recordedState.transformations.push({
                        type: 'replaceText',
                        text: Array(lineText.length - start.character + 1).join(toInsert),
                        start: start,
                        end: new position_1.Position(start.line, lineText.length),
                        manuallySetCursorPositions: true,
                    });
                }
                else if (lineNum === end.line) {
                    // This is the last line of the selection so only replace before the cursor
                    vimState.recordedState.transformations.push({
                        type: 'replaceText',
                        text: Array(end.character + 1 + visualSelectionOffset).join(toInsert),
                        start: new position_1.Position(end.line, 0),
                        end: new position_1.Position(end.line, end.character + visualSelectionOffset),
                        manuallySetCursorPositions: true,
                    });
                }
                else {
                    // Replace the entire line length since it is in the middle of the selection
                    vimState.recordedState.transformations.push({
                        type: 'replaceText',
                        text: Array(lineText.length + 1).join(toInsert),
                        start: new position_1.Position(lineNum, 0),
                        end: new position_1.Position(lineNum, lineText.length),
                        manuallySetCursorPositions: true,
                    });
                }
            }
            vimState.cursorPosition = start;
            vimState.cursorStartPosition = start;
            vimState.currentMode = mode_1.ModeName.Normal;
            return vimState;
        });
    }
};
ActionReplaceCharacterVisual = __decorate([
    base_1.RegisterAction
], ActionReplaceCharacterVisual);
let ActionReplaceCharacterVisualBlock = class ActionReplaceCharacterVisualBlock extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.VisualBlock];
        this.keys = ['r', '<character>'];
        this.canBeRepeatedWithDot = true;
    }
    runsOnceForEveryCursor() {
        return false;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            const toInsert = this.keysPressed[1];
            for (const { start, end } of position_1.Position.IterateLine(vimState)) {
                if (end.isBeforeOrEqual(start)) {
                    continue;
                }
                vimState.recordedState.transformations.push({
                    type: 'replaceText',
                    text: Array(end.character - start.character + 1).join(toInsert),
                    start: start,
                    end: end,
                    manuallySetCursorPositions: true,
                });
            }
            const topLeft = modes_1.VisualBlockMode.getTopLeftPosition(vimState.cursorPosition, vimState.cursorStartPosition);
            vimState.allCursors = [new range_1.Range(topLeft, topLeft)];
            vimState.currentMode = mode_1.ModeName.Normal;
            return vimState;
        });
    }
};
ActionReplaceCharacterVisualBlock = __decorate([
    base_1.RegisterAction
], ActionReplaceCharacterVisualBlock);
let ActionXVisualBlock = class ActionXVisualBlock extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.VisualBlock];
        this.keys = ['x'];
        this.canBeRepeatedWithDot = true;
    }
    runsOnceForEveryCursor() {
        return false;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const { start, end } of position_1.Position.IterateLine(vimState)) {
                vimState.recordedState.transformations.push({
                    type: 'deleteRange',
                    range: new range_1.Range(start, end),
                    manuallySetCursorPositions: true,
                });
            }
            const topLeft = modes_1.VisualBlockMode.getTopLeftPosition(vimState.cursorPosition, vimState.cursorStartPosition);
            vimState.allCursors = [new range_1.Range(topLeft, topLeft)];
            vimState.currentMode = mode_1.ModeName.Normal;
            return vimState;
        });
    }
};
ActionXVisualBlock = __decorate([
    base_1.RegisterAction
], ActionXVisualBlock);
let ActionDVisualBlock = class ActionDVisualBlock extends ActionXVisualBlock {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.VisualBlock];
        this.keys = ['d'];
        this.canBeRepeatedWithDot = true;
    }
    runsOnceForEveryCursor() {
        return false;
    }
};
ActionDVisualBlock = __decorate([
    base_1.RegisterAction
], ActionDVisualBlock);
let ActionShiftDVisualBlock = class ActionShiftDVisualBlock extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.VisualBlock];
        this.keys = ['D'];
        this.canBeRepeatedWithDot = true;
    }
    runsOnceForEveryCursor() {
        return false;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const { start } of position_1.Position.IterateLine(vimState)) {
                vimState.recordedState.transformations.push({
                    type: 'deleteRange',
                    range: new range_1.Range(start, start.getLineEnd()),
                    manuallySetCursorPositions: true,
                });
            }
            const topLeft = modes_1.VisualBlockMode.getTopLeftPosition(vimState.cursorPosition, vimState.cursorStartPosition);
            vimState.allCursors = [new range_1.Range(topLeft, topLeft)];
            vimState.currentMode = mode_1.ModeName.Normal;
            return vimState;
        });
    }
};
ActionShiftDVisualBlock = __decorate([
    base_1.RegisterAction
], ActionShiftDVisualBlock);
let ActionGoToInsertVisualBlockMode = class ActionGoToInsertVisualBlockMode extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.VisualBlock];
        this.keys = ['I'];
    }
    runsOnceForEveryCursor() {
        return false;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            vimState.currentMode = mode_1.ModeName.Insert;
            vimState.isMultiCursor = true;
            vimState.isFakeMultiCursor = true;
            for (const { line, start } of position_1.Position.IterateLine(vimState)) {
                if (line === '' && start.character !== 0) {
                    continue;
                }
                vimState.allCursors.push(new range_1.Range(start, start));
            }
            vimState.allCursors = vimState.allCursors.slice(1);
            return vimState;
        });
    }
};
ActionGoToInsertVisualBlockMode = __decorate([
    base_1.RegisterAction
], ActionGoToInsertVisualBlockMode);
let ActionChangeInVisualBlockMode = class ActionChangeInVisualBlockMode extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.VisualBlock];
        this.keys = [['c'], ['s']];
    }
    runsOnceForEveryCursor() {
        return false;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const { start, end } of position_1.Position.IterateLine(vimState)) {
                vimState.recordedState.transformations.push({
                    type: 'deleteRange',
                    range: new range_1.Range(start, end),
                    manuallySetCursorPositions: true,
                });
            }
            vimState.currentMode = mode_1.ModeName.Insert;
            vimState.isMultiCursor = true;
            vimState.isFakeMultiCursor = true;
            for (const { start } of position_1.Position.IterateLine(vimState)) {
                vimState.allCursors.push(new range_1.Range(start, start));
            }
            vimState.allCursors = vimState.allCursors.slice(1);
            return vimState;
        });
    }
};
ActionChangeInVisualBlockMode = __decorate([
    base_1.RegisterAction
], ActionChangeInVisualBlockMode);
let ActionChangeToEOLInVisualBlockMode = class ActionChangeToEOLInVisualBlockMode extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.VisualBlock];
        this.keys = [['C'], ['S']];
    }
    runsOnceForEveryCursor() {
        return false;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const { start } of position_1.Position.IterateLine(vimState)) {
                vimState.recordedState.transformations.push({
                    type: 'deleteRange',
                    range: new range_1.Range(start, start.getLineEnd()),
                    collapseRange: true,
                });
            }
            vimState.currentMode = mode_1.ModeName.Insert;
            vimState.isMultiCursor = true;
            vimState.isFakeMultiCursor = true;
            for (const { end } of position_1.Position.IterateLine(vimState)) {
                vimState.allCursors.push(new range_1.Range(end, end));
            }
            vimState.allCursors = vimState.allCursors.slice(1);
            return vimState;
        });
    }
};
ActionChangeToEOLInVisualBlockMode = __decorate([
    base_1.RegisterAction
], ActionChangeToEOLInVisualBlockMode);
class ActionGoToInsertVisualLineModeCommand extends BaseCommand {
    runsOnceForEveryCursor() {
        return false;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            vimState.currentMode = mode_1.ModeName.Insert;
            vimState.isMultiCursor = true;
            vimState.isFakeMultiCursor = true;
            let start = position_1.Position.FromVSCodePosition(vimState.editor.selection.start);
            let end = position_1.Position.FromVSCodePosition(vimState.editor.selection.end);
            if (start.isAfter(end)) {
                [start, end] = [end, start];
            }
            vimState.allCursors = [];
            for (let i = start.line; i <= end.line; i++) {
                const line = textEditor_1.TextEditor.getLineAt(new position_1.Position(i, 0));
                if (line.text.trim() !== '') {
                    vimState.allCursors.push(this.getCursorRangeForLine(line, start, end));
                }
            }
            return vimState;
        });
    }
}
let ActionGoToInsertVisualLineMode = class ActionGoToInsertVisualLineMode extends ActionGoToInsertVisualLineModeCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.VisualLine];
        this.keys = ['I'];
    }
    getCursorRangeForLine(line) {
        const startCharacterPosition = new position_1.Position(line.lineNumber, line.firstNonWhitespaceCharacterIndex);
        return new range_1.Range(startCharacterPosition, startCharacterPosition);
    }
};
ActionGoToInsertVisualLineMode = __decorate([
    base_1.RegisterAction
], ActionGoToInsertVisualLineMode);
exports.ActionGoToInsertVisualLineMode = ActionGoToInsertVisualLineMode;
let ActionGoToInsertVisualLineModeAppend = class ActionGoToInsertVisualLineModeAppend extends ActionGoToInsertVisualLineModeCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.VisualLine];
        this.keys = ['A'];
    }
    getCursorRangeForLine(line) {
        const endCharacterPosition = new position_1.Position(line.lineNumber, line.range.end.character);
        return new range_1.Range(endCharacterPosition, endCharacterPosition);
    }
};
ActionGoToInsertVisualLineModeAppend = __decorate([
    base_1.RegisterAction
], ActionGoToInsertVisualLineModeAppend);
exports.ActionGoToInsertVisualLineModeAppend = ActionGoToInsertVisualLineModeAppend;
let ActionGoToInsertVisualMode = class ActionGoToInsertVisualMode extends ActionGoToInsertVisualLineModeCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Visual];
        this.keys = ['I'];
    }
    getCursorRangeForLine(line, selectionStart, selectionEnd) {
        const startCharacterPosition = line.lineNumber === selectionStart.line
            ? selectionStart
            : new position_1.Position(line.lineNumber, line.firstNonWhitespaceCharacterIndex);
        return new range_1.Range(startCharacterPosition, startCharacterPosition);
    }
};
ActionGoToInsertVisualMode = __decorate([
    base_1.RegisterAction
], ActionGoToInsertVisualMode);
exports.ActionGoToInsertVisualMode = ActionGoToInsertVisualMode;
let ActionGoToInsertVisualModeAppend = class ActionGoToInsertVisualModeAppend extends ActionGoToInsertVisualLineModeCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Visual];
        this.keys = ['A'];
    }
    getCursorRangeForLine(line, selectionStart, selectionEnd) {
        const endCharacterPosition = line.lineNumber === selectionEnd.line
            ? selectionEnd
            : new position_1.Position(line.lineNumber, line.range.end.character);
        return new range_1.Range(endCharacterPosition, endCharacterPosition);
    }
};
ActionGoToInsertVisualModeAppend = __decorate([
    base_1.RegisterAction
], ActionGoToInsertVisualModeAppend);
exports.ActionGoToInsertVisualModeAppend = ActionGoToInsertVisualModeAppend;
let ActionGoToInsertVisualBlockModeAppend = class ActionGoToInsertVisualBlockModeAppend extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.VisualBlock];
        this.keys = ['A'];
    }
    runsOnceForEveryCursor() {
        return false;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            vimState.currentMode = mode_1.ModeName.Insert;
            vimState.isMultiCursor = true;
            vimState.isFakeMultiCursor = true;
            for (const { line, end } of position_1.Position.IterateLine(vimState)) {
                if (line.trim() === '') {
                    vimState.recordedState.transformations.push({
                        type: 'replaceText',
                        text: textEditor_1.TextEditor.setIndentationLevel(line, end.character),
                        start: new position_1.Position(end.line, 0),
                        end: new position_1.Position(end.line, end.character),
                    });
                }
                vimState.allCursors.push(new range_1.Range(end, end));
            }
            vimState.allCursors = vimState.allCursors.slice(1);
            return vimState;
        });
    }
};
ActionGoToInsertVisualBlockModeAppend = __decorate([
    base_1.RegisterAction
], ActionGoToInsertVisualBlockModeAppend);
let ActionDeleteLineVisualMode = class ActionDeleteLineVisualMode extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Visual, mode_1.ModeName.VisualLine];
        this.keys = ['X'];
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            if (vimState.currentMode === mode_1.ModeName.Visual) {
                return yield new operator.DeleteOperator(this.multicursorIndex).run(vimState, vimState.cursorStartPosition.getLineBegin(), vimState.cursorPosition.getLineEnd());
            }
            else {
                return yield new operator.DeleteOperator(this.multicursorIndex).run(vimState, position.getLineBegin(), position.getLineEnd());
            }
        });
    }
};
ActionDeleteLineVisualMode = __decorate([
    base_1.RegisterAction
], ActionDeleteLineVisualMode);
let ActionChangeLineVisualMode = class ActionChangeLineVisualMode extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Visual];
        this.keys = ['C'];
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new operator.DeleteOperator(this.multicursorIndex).run(vimState, vimState.cursorStartPosition.getLineBegin(), vimState.cursorPosition.getLineEndIncludingEOL());
        });
    }
};
ActionChangeLineVisualMode = __decorate([
    base_1.RegisterAction
], ActionChangeLineVisualMode);
let ActionRemoveLineVisualMode = class ActionRemoveLineVisualMode extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Visual];
        this.keys = ['R'];
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new operator.DeleteOperator(this.multicursorIndex).run(vimState, vimState.cursorStartPosition.getLineBegin(), vimState.cursorPosition.getLineEndIncludingEOL());
        });
    }
};
ActionRemoveLineVisualMode = __decorate([
    base_1.RegisterAction
], ActionRemoveLineVisualMode);
let ActionChangeChar = class ActionChangeChar extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal];
        this.keys = ['s'];
        this.runsOnceForEachCountPrefix = true;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            const state = yield new operator.ChangeOperator().run(vimState, position, position);
            state.currentMode = mode_1.ModeName.Insert;
            return state;
        });
    }
    // Don't clash with surround or sneak modes!
    doesActionApply(vimState, keysPressed) {
        return (super.doesActionApply(vimState, keysPressed) &&
            !configuration_1.configuration.sneak &&
            !vimState.recordedState.operator);
    }
    couldActionApply(vimState, keysPressed) {
        return (super.couldActionApply(vimState, keysPressed) &&
            !configuration_1.configuration.sneak &&
            !vimState.recordedState.operator);
    }
};
ActionChangeChar = __decorate([
    base_1.RegisterAction
], ActionChangeChar);
let ToggleCaseAndMoveForward = class ToggleCaseAndMoveForward extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal];
        this.keys = ['~'];
        this.canBeRepeatedWithDot = true;
        this.runsOnceForEachCountPrefix = true;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new operator.ToggleCaseOperator().run(vimState, vimState.cursorPosition, vimState.cursorPosition);
            vimState.cursorPosition = vimState.cursorPosition.getRight();
            return vimState;
        });
    }
};
ToggleCaseAndMoveForward = __decorate([
    base_1.RegisterAction
], ToggleCaseAndMoveForward);
class IncrementDecrementNumberAction extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal];
        this.canBeRepeatedWithDot = true;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            const text = textEditor_1.TextEditor.getLineAt(position).text;
            // Start looking to the right for the next word to increment, unless we're
            // already on a word to increment, in which case start at the beginning of
            // that word.
            const whereToStart = text[position.character].match(/\s/)
                ? position
                : position.getWordLeft(true);
            for (let { start, end, word } of position_1.Position.IterateWords(whereToStart)) {
                // '-' doesn't count as a word, but is important to include in parsing
                // the number, as long as it is not just part of the word (-foo2 for example)
                if (text[start.character - 1] === '-' && /\d/.test(text[start.character])) {
                    start = start.getLeft();
                    word = text[start.character] + word;
                }
                // Strict number parsing so "1a" doesn't silently get converted to "1"
                do {
                    const num = numericString_1.NumericString.parse(word);
                    if (num !== null &&
                        position.character < start.character + num.prefix.length + num.value.toString().length) {
                        vimState.cursorPosition = yield this.replaceNum(num, this.offset * (vimState.recordedState.count || 1), start, end);
                        vimState.cursorPosition = vimState.cursorPosition.getLeftByCount(num.suffix.length);
                        return vimState;
                    }
                    else if (num !== null) {
                        word = word.slice(num.prefix.length + num.value.toString().length);
                        start = new position_1.Position(start.line, start.character + num.prefix.length + num.value.toString().length);
                    }
                    else {
                        break;
                    }
                } while (true);
            }
            // No usable numbers, return the original position
            return vimState;
        });
    }
    replaceNum(start, offset, startPos, endPos) {
        return __awaiter(this, void 0, void 0, function* () {
            const oldWidth = start.toString().length;
            start.value += offset;
            const newNum = start.toString();
            const range = new vscode.Range(startPos, endPos.getRight());
            if (oldWidth === newNum.length) {
                yield textEditor_1.TextEditor.replace(range, newNum);
            }
            else {
                // Can't use replace, since new number is a different width than old
                yield textEditor_1.TextEditor.delete(range);
                yield textEditor_1.TextEditor.insertAt(newNum, startPos);
                // Adjust end position according to difference in width of number-string
                endPos = new position_1.Position(endPos.line, endPos.character + (newNum.length - oldWidth));
            }
            return endPos;
        });
    }
}
let IncrementNumberAction = class IncrementNumberAction extends IncrementDecrementNumberAction {
    constructor() {
        super(...arguments);
        this.keys = ['<C-a>'];
        this.offset = +1;
    }
};
IncrementNumberAction = __decorate([
    base_1.RegisterAction
], IncrementNumberAction);
let DecrementNumberAction = class DecrementNumberAction extends IncrementDecrementNumberAction {
    constructor() {
        super(...arguments);
        this.keys = ['<C-x>'];
        this.offset = -1;
    }
};
DecrementNumberAction = __decorate([
    base_1.RegisterAction
], DecrementNumberAction);
let ActionTriggerHover = class ActionTriggerHover extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal];
        this.keys = ['g', 'h'];
    }
    runsOnceForEveryCursor() {
        return false;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            yield vscode.commands.executeCommand('editor.action.showHover');
            return vimState;
        });
    }
};
ActionTriggerHover = __decorate([
    base_1.RegisterAction
], ActionTriggerHover);
/**
 * Multi-Cursor Command Overrides
 *
 * We currently have to override the vscode key commands that get us into multi-cursor mode.
 *
 * Normally, we'd just listen for another cursor to be added in order to go into multi-cursor
 * mode rather than rewriting each keybinding one-by-one. We can't currently do that because
 * Visual Block Mode also creates additional cursors, but will get confused if you're in
 * multi-cursor mode.
 */
let ActionOverrideCmdD = class ActionOverrideCmdD extends BaseCommand {
    /**
     * Multi-Cursor Command Overrides
     *
     * We currently have to override the vscode key commands that get us into multi-cursor mode.
     *
     * Normally, we'd just listen for another cursor to be added in order to go into multi-cursor
     * mode rather than rewriting each keybinding one-by-one. We can't currently do that because
     * Visual Block Mode also creates additional cursors, but will get confused if you're in
     * multi-cursor mode.
     */
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal, mode_1.ModeName.Visual];
        this.keys = [['<D-d>'], ['g', 'b']];
        this.runsOnceForEachCountPrefix = true;
    }
    runsOnceForEveryCursor() {
        return false;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            yield vscode.commands.executeCommand('editor.action.addSelectionToNextFindMatch');
            vimState.allCursors = yield util_1.getCursorsAfterSync();
            // If this is the first cursor, select 1 character less
            // so that only the word is selected, no extra character
            vimState.allCursors = vimState.allCursors.map(x => x.withNewStop(x.stop.getLeft()));
            vimState.currentMode = mode_1.ModeName.Visual;
            return vimState;
        });
    }
};
ActionOverrideCmdD = __decorate([
    base_1.RegisterAction
], ActionOverrideCmdD);
let ActionOverrideCmdDInsert = class ActionOverrideCmdDInsert extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Insert];
        this.keys = ['<D-d>'];
        this.runsOnceForEachCountPrefix = true;
    }
    runsOnceForEveryCursor() {
        return false;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            // Since editor.action.addSelectionToNextFindMatch uses the selection to
            // determine where to add a word, we need to do a hack and manually set the
            // selections to the word boundaries before we make the api call.
            vscode.window.activeTextEditor.selections = vscode.window.activeTextEditor.selections.map((x, idx) => {
                const curPos = position_1.Position.FromVSCodePosition(x.active);
                if (idx === 0) {
                    return new vscode.Selection(curPos.getWordLeft(false), curPos
                        .getLeft()
                        .getCurrentWordEnd(true)
                        .getRight());
                }
                else {
                    // Since we're adding the selections ourselves, we need to make sure
                    // that our selection is actually over what our original word is
                    const matchWordPos = position_1.Position.FromVSCodePosition(vscode.window.activeTextEditor.selections[0].active);
                    const matchWordLength = matchWordPos
                        .getLeft()
                        .getCurrentWordEnd(true)
                        .getRight().character - matchWordPos.getWordLeft(false).character;
                    const wordBegin = curPos.getLeftByCount(matchWordLength);
                    return new vscode.Selection(wordBegin, curPos);
                }
            });
            yield vscode.commands.executeCommand('editor.action.addSelectionToNextFindMatch');
            vimState.allCursors = yield util_1.getCursorsAfterSync();
            return vimState;
        });
    }
};
ActionOverrideCmdDInsert = __decorate([
    base_1.RegisterAction
], ActionOverrideCmdDInsert);
let ActionOverrideCmdAltDown = class ActionOverrideCmdAltDown extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal, mode_1.ModeName.Visual];
        this.keys = [
            ['<D-alt+down>'],
            ['<C-alt+down>'],
        ];
        this.runsOnceForEachCountPrefix = true;
    }
    runsOnceForEveryCursor() {
        return false;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            yield vscode.commands.executeCommand('editor.action.insertCursorBelow');
            vimState.allCursors = yield util_1.getCursorsAfterSync();
            return vimState;
        });
    }
};
ActionOverrideCmdAltDown = __decorate([
    base_1.RegisterAction
], ActionOverrideCmdAltDown);
let ActionOverrideCmdAltUp = class ActionOverrideCmdAltUp extends BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Normal, mode_1.ModeName.Visual];
        this.keys = [
            ['<D-alt+up>'],
            ['<C-alt+up>'],
        ];
        this.runsOnceForEachCountPrefix = true;
    }
    runsOnceForEveryCursor() {
        return false;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            yield vscode.commands.executeCommand('editor.action.insertCursorAbove');
            vimState.allCursors = yield util_1.getCursorsAfterSync();
            return vimState;
        });
    }
};
ActionOverrideCmdAltUp = __decorate([
    base_1.RegisterAction
], ActionOverrideCmdAltUp);

//# sourceMappingURL=actions.js.map
