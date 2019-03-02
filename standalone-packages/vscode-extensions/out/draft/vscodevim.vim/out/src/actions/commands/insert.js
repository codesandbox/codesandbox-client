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
const vscode = require("vscode");
const lineCompletionProvider_1 = require("../../completion/lineCompletionProvider");
const recordedState_1 = require("../../state/recordedState");
const position_1 = require("./../../common/motion/position");
const range_1 = require("./../../common/motion/range");
const configuration_1 = require("./../../configuration/configuration");
const mode_1 = require("./../../mode/mode");
const register_1 = require("./../../register/register");
const textEditor_1 = require("./../../textEditor");
const base_1 = require("./../base");
const motion_1 = require("./../motion");
const actions_1 = require("./actions");
const clipboard_1 = require("../../util/clipboard");
let CommandEscInsertMode = class CommandEscInsertMode extends actions_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Insert];
        this.keys = [['<Esc>'], ['<C-c>'], ['<C-[>']];
    }
    runsOnceForEveryCursor() {
        return false;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            vimState.allCursors = vimState.allCursors.map(x => x.withNewStop(x.stop.getLeft()));
            if (vimState.returnToInsertAfterCommand && position.character !== 0) {
                vimState.allCursors = vimState.allCursors.map(x => x.withNewStop(x.stop.getRight()));
            }
            // only remove leading spaces inserted by vscode.
            // vscode only inserts them when user enter a new line,
            // ie, o/O in Normal mode or \n in Insert mode.
            for (let i = 0; i < vimState.allCursors.length; i++) {
                const lastActionBeforeEsc = vimState.keyHistory[vimState.keyHistory.length - 2];
                if (['o', 'O', '\n'].indexOf(lastActionBeforeEsc) > -1 &&
                    vimState.editor.document.languageId !== 'plaintext' &&
                    /^\s+$/.test(textEditor_1.TextEditor.getLineAt(vimState.allCursors[i].stop).text)) {
                    vimState.recordedState.transformations.push({
                        type: 'deleteRange',
                        range: new range_1.Range(vimState.allCursors[i].stop.getLineBegin(), vimState.allCursors[i].stop.getLineEnd()),
                    });
                    vimState.allCursors[i] = vimState.allCursors[i].withNewStop(vimState.allCursors[i].stop.getLineBegin());
                }
            }
            vimState.currentMode = mode_1.ModeName.Normal;
            // If we wanted to repeat this insert (only for i and a), now is the time to do it. Insert
            // count amount of these strings before returning back to normal mode
            const typeOfInsert = vimState.recordedState.actionsRun[vimState.recordedState.actionsRun.length - 3];
            const isTypeToRepeatInsert = typeOfInsert instanceof actions_1.CommandInsertAtCursor ||
                typeOfInsert instanceof actions_1.CommandInsertAfterCursor ||
                typeOfInsert instanceof actions_1.CommandInsertAtLineEnd ||
                typeOfInsert instanceof actions_1.CommandInsertAtFirstCharacter;
            // If this is the type to repeat insert, do this now
            if (vimState.recordedState.count > 1 && isTypeToRepeatInsert) {
                const changeAction = vimState.recordedState.actionsRun[vimState.recordedState.actionsRun.length - 2];
                const changesArray = changeAction.contentChanges;
                let docChanges = [];
                for (let i = 0; i < changesArray.length; i++) {
                    docChanges.push(changesArray[i].textDiff);
                }
                let positionDiff = new position_1.PositionDiff(0, 0);
                // Add count amount of inserts in the case of 4i=<esc>
                for (let i = 0; i < vimState.recordedState.count - 1; i++) {
                    // If this is the last transform, move cursor back one character
                    if (i === vimState.recordedState.count - 2) {
                        positionDiff = new position_1.PositionDiff(0, -1);
                    }
                    // Add a transform containing the change
                    vimState.recordedState.transformations.push({
                        type: 'contentChange',
                        changes: docChanges,
                        diff: positionDiff,
                    });
                }
            }
            if (vimState.historyTracker.currentContentChanges.length > 0) {
                vimState.historyTracker.lastContentChanges = vimState.historyTracker.currentContentChanges;
                vimState.historyTracker.currentContentChanges = [];
            }
            if (vimState.isFakeMultiCursor) {
                vimState.allCursors = [vimState.allCursors[0]];
                vimState.isMultiCursor = false;
                vimState.isFakeMultiCursor = false;
            }
            return vimState;
        });
    }
};
CommandEscInsertMode = __decorate([
    base_1.RegisterAction
], CommandEscInsertMode);
let CommandInsertPreviousText = class CommandInsertPreviousText extends actions_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Insert];
        this.keys = ['<C-a>'];
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            let actions = (yield register_1.Register.getByKey('.')).text.actionsRun.slice(0);
            // let actions = Register.lastContentChange.actionsRun.slice(0);
            // The first action is entering Insert Mode, which is not necessary in this case
            actions.shift();
            // The last action is leaving Insert Mode, which is not necessary in this case
            // actions.pop();
            if (actions.length > 0 && actions[0] instanceof motion_1.ArrowsInInsertMode) {
                // Note, arrow keys are the only Insert action command that can't be repeated here as far as @rebornix knows.
                actions.shift();
            }
            for (let action of actions) {
                if (action instanceof actions_1.BaseCommand) {
                    vimState = yield action.execCount(vimState.cursorPosition, vimState);
                }
                if (action instanceof actions_1.DocumentContentChangeAction) {
                    vimState = yield action.exec(vimState.cursorPosition, vimState);
                }
            }
            vimState.cursorPosition = position_1.Position.FromVSCodePosition(vimState.editor.selection.end);
            vimState.cursorStartPosition = position_1.Position.FromVSCodePosition(vimState.editor.selection.start);
            vimState.currentMode = mode_1.ModeName.Insert;
            return vimState;
        });
    }
};
CommandInsertPreviousText = __decorate([
    base_1.RegisterAction
], CommandInsertPreviousText);
exports.CommandInsertPreviousText = CommandInsertPreviousText;
let CommandInsertPreviousTextAndQuit = class CommandInsertPreviousTextAndQuit extends actions_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Insert];
        this.keys = ['<C-shift+2>']; // <C-@>
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            vimState = yield new CommandInsertPreviousText().exec(position, vimState);
            vimState.currentMode = mode_1.ModeName.Normal;
            return vimState;
        });
    }
};
CommandInsertPreviousTextAndQuit = __decorate([
    base_1.RegisterAction
], CommandInsertPreviousTextAndQuit);
let CommandInsertBelowChar = class CommandInsertBelowChar extends actions_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Insert];
        this.keys = ['<C-e>'];
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            if (textEditor_1.TextEditor.isLastLine(position)) {
                return vimState;
            }
            const charBelowCursorPosition = position.getDownByCount(1);
            if (charBelowCursorPosition.isLineEnd()) {
                return vimState;
            }
            const char = textEditor_1.TextEditor.getText(new vscode.Range(charBelowCursorPosition, charBelowCursorPosition.getRight()));
            yield textEditor_1.TextEditor.insert(char, position);
            vimState.cursorStartPosition = position_1.Position.FromVSCodePosition(vimState.editor.selection.start);
            vimState.cursorPosition = position_1.Position.FromVSCodePosition(vimState.editor.selection.start);
            return vimState;
        });
    }
};
CommandInsertBelowChar = __decorate([
    base_1.RegisterAction
], CommandInsertBelowChar);
let CommandInsertIndentInCurrentLine = class CommandInsertIndentInCurrentLine extends actions_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Insert];
        this.keys = ['<C-t>'];
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            const originalText = textEditor_1.TextEditor.getLineAt(position).text;
            const indentationWidth = textEditor_1.TextEditor.getIndentationLevel(originalText);
            const tabSize = configuration_1.configuration.tabstop || Number(vimState.editor.options.tabSize);
            const newIndentationWidth = (indentationWidth / tabSize + 1) * tabSize;
            textEditor_1.TextEditor.replaceText(vimState, textEditor_1.TextEditor.setIndentationLevel(originalText, newIndentationWidth), position.getLineBegin(), position.getLineEnd(), new position_1.PositionDiff(0, newIndentationWidth - indentationWidth));
            return vimState;
        });
    }
};
CommandInsertIndentInCurrentLine = __decorate([
    base_1.RegisterAction
], CommandInsertIndentInCurrentLine);
// Upon thinking about it some more, I'm not really sure how to fix this
// elegantly. Tab is just used for so many things in the VSCode editor, and all
// of them happen to be overloaded. Sometimes tab does a tab, sometimes it does
// an emmet completion, sometimes a snippet completion, etc.
// @RegisterAction
// export class CommandInsertTabInInsertMode extends BaseCommand {
//   modes = [ModeName.Insert];
//   keys = ["<tab>"];
//   runsOnceForEveryCursor() { return false; }
//   public async exec(position: Position, vimState: VimState): Promise<VimState> {
//     vimState.recordedState.transformations.push({
//       type: "tab"
//     });
//     return vimState;
//   }
// }
let CommandInsertInInsertMode = class CommandInsertInInsertMode extends actions_1.BaseCommand {
    // Upon thinking about it some more, I'm not really sure how to fix this
    // elegantly. Tab is just used for so many things in the VSCode editor, and all
    // of them happen to be overloaded. Sometimes tab does a tab, sometimes it does
    // an emmet completion, sometimes a snippet completion, etc.
    // @RegisterAction
    // export class CommandInsertTabInInsertMode extends BaseCommand {
    //   modes = [ModeName.Insert];
    //   keys = ["<tab>"];
    //   runsOnceForEveryCursor() { return false; }
    //   public async exec(position: Position, vimState: VimState): Promise<VimState> {
    //     vimState.recordedState.transformations.push({
    //       type: "tab"
    //     });
    //     return vimState;
    //   }
    // }
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Insert];
        this.keys = ['<character>'];
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            const char = this.keysPressed[this.keysPressed.length - 1];
            const line = textEditor_1.TextEditor.getLineAt(position).text;
            if (char === '<BS>') {
                const selection = textEditor_1.TextEditor.getSelection();
                // Check if a selection is active
                if (!selection.isEmpty) {
                    vimState.recordedState.transformations.push({
                        type: 'deleteRange',
                        range: new range_1.Range(selection.start, selection.end),
                    });
                }
                else {
                    if (line.length > 0 && line.match(/^ +$/) && configuration_1.configuration.expandtab) {
                        // If the line is empty except whitespace, backspace should return to
                        // the next lowest level of indentation.
                        const tabSize = vimState.editor.options.tabSize;
                        const desiredLineLength = Math.floor((position.character - 1) / tabSize) * tabSize;
                        vimState.recordedState.transformations.push({
                            type: 'deleteRange',
                            range: new range_1.Range(new position_1.Position(position.line, desiredLineLength), new position_1.Position(position.line, line.length)),
                        });
                    }
                    else {
                        if (position.line !== 0 || position.character !== 0) {
                            vimState.recordedState.transformations.push({
                                type: 'deleteText',
                                position: position,
                            });
                        }
                    }
                }
                vimState.cursorPosition = vimState.cursorPosition.getLeft();
                vimState.cursorStartPosition = vimState.cursorStartPosition.getLeft();
            }
            else {
                if (vimState.isMultiCursor) {
                    vimState.recordedState.transformations.push({
                        type: 'insertText',
                        text: char,
                        position: vimState.cursorPosition,
                    });
                }
                else {
                    vimState.recordedState.transformations.push({
                        type: 'insertTextVSCode',
                        text: char,
                    });
                }
            }
            return vimState;
        });
    }
    toString() {
        return this.keysPressed[this.keysPressed.length - 1];
    }
};
CommandInsertInInsertMode = __decorate([
    base_1.RegisterAction
], CommandInsertInInsertMode);
exports.CommandInsertInInsertMode = CommandInsertInInsertMode;
let CommandInsertRegisterContent = class CommandInsertRegisterContent extends actions_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Insert];
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
                vimState.recordedState.transformations.push({
                    type: 'macro',
                    register: vimState.recordedState.registerName,
                    replay: 'keystrokes',
                });
                return vimState;
            }
            else {
                text = register.text;
            }
            if (register.registerMode === register_1.RegisterMode.LineWise) {
                text += '\n';
            }
            yield textEditor_1.TextEditor.insertAt(text, position);
            vimState.currentMode = mode_1.ModeName.Insert;
            vimState.cursorStartPosition = position_1.Position.FromVSCodePosition(vimState.editor.selection.start);
            vimState.cursorPosition = position_1.Position.FromVSCodePosition(vimState.editor.selection.start);
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
CommandInsertRegisterContent = __decorate([
    base_1.RegisterAction
], CommandInsertRegisterContent);
let CommandOneNormalCommandInInsertMode = class CommandOneNormalCommandInInsertMode extends actions_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Insert];
        this.keys = ['<C-o>'];
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            vimState.returnToInsertAfterCommand = true;
            return yield new CommandEscInsertMode().exec(position, vimState);
        });
    }
};
CommandOneNormalCommandInInsertMode = __decorate([
    base_1.RegisterAction
], CommandOneNormalCommandInInsertMode);
exports.CommandOneNormalCommandInInsertMode = CommandOneNormalCommandInInsertMode;
let CommandCtrlW = class CommandCtrlW extends actions_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Insert];
        this.keys = ['<C-w>'];
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            let wordBegin;
            if (position.isInLeadingWhitespace()) {
                wordBegin = position.getLineBegin();
            }
            else if (position.isLineBeginning()) {
                wordBegin = position.getPreviousLineBegin().getLineEnd();
            }
            else {
                wordBegin = position.getWordLeft();
            }
            yield textEditor_1.TextEditor.delete(new vscode.Range(wordBegin, position));
            vimState.cursorPosition = wordBegin;
            return vimState;
        });
    }
};
CommandCtrlW = __decorate([
    base_1.RegisterAction
], CommandCtrlW);
let CommandDeleteIndentInCurrentLine = class CommandDeleteIndentInCurrentLine extends actions_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Insert];
        this.keys = ['<C-d>'];
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            const originalText = textEditor_1.TextEditor.getLineAt(position).text;
            const indentationWidth = textEditor_1.TextEditor.getIndentationLevel(originalText);
            if (indentationWidth === 0) {
                return vimState;
            }
            const tabSize = configuration_1.configuration.tabstop;
            const newIndentationWidth = (indentationWidth / tabSize - 1) * tabSize;
            yield textEditor_1.TextEditor.replace(new vscode.Range(position.getLineBegin(), position.getLineEnd()), textEditor_1.TextEditor.setIndentationLevel(originalText, newIndentationWidth < 0 ? 0 : newIndentationWidth));
            const cursorPosition = position_1.Position.FromVSCodePosition(position.with(position.line, position.character + (newIndentationWidth - indentationWidth) / tabSize));
            vimState.cursorPosition = cursorPosition;
            vimState.cursorStartPosition = cursorPosition;
            vimState.currentMode = mode_1.ModeName.Insert;
            return vimState;
        });
    }
};
CommandDeleteIndentInCurrentLine = __decorate([
    base_1.RegisterAction
], CommandDeleteIndentInCurrentLine);
let CommandInsertAboveChar = class CommandInsertAboveChar extends actions_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Insert];
        this.keys = ['<C-y>'];
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            if (textEditor_1.TextEditor.isFirstLine(position)) {
                return vimState;
            }
            const charAboveCursorPosition = position.getUpByCount(1);
            if (charAboveCursorPosition.isLineEnd()) {
                return vimState;
            }
            const char = textEditor_1.TextEditor.getText(new vscode.Range(charAboveCursorPosition, charAboveCursorPosition.getRight()));
            yield textEditor_1.TextEditor.insert(char, position);
            vimState.cursorStartPosition = position_1.Position.FromVSCodePosition(vimState.editor.selection.start);
            vimState.cursorPosition = position_1.Position.FromVSCodePosition(vimState.editor.selection.start);
            return vimState;
        });
    }
};
CommandInsertAboveChar = __decorate([
    base_1.RegisterAction
], CommandInsertAboveChar);
let CommandCtrlHInInsertMode = class CommandCtrlHInInsertMode extends actions_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Insert];
        this.keys = ['<C-h>'];
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            vimState.recordedState.transformations.push({
                type: 'deleteText',
                position: position,
            });
            return vimState;
        });
    }
};
CommandCtrlHInInsertMode = __decorate([
    base_1.RegisterAction
], CommandCtrlHInInsertMode);
let CommandCtrlUInInsertMode = class CommandCtrlUInInsertMode extends actions_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Insert];
        this.keys = ['<C-u>'];
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            const start = position.isInLeadingWhitespace()
                ? position.getLineBegin()
                : position.getLineBeginRespectingIndent();
            yield textEditor_1.TextEditor.delete(new vscode.Range(start, position));
            vimState.cursorPosition = start;
            vimState.cursorStartPosition = start;
            return vimState;
        });
    }
};
CommandCtrlUInInsertMode = __decorate([
    base_1.RegisterAction
], CommandCtrlUInInsertMode);
let CommandNavigateAutocompleteDown = class CommandNavigateAutocompleteDown extends actions_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Insert];
        this.keys = [['<C-n>'], ['<C-j>']];
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            yield vscode.commands.executeCommand('selectNextSuggestion');
            return vimState;
        });
    }
};
CommandNavigateAutocompleteDown = __decorate([
    base_1.RegisterAction
], CommandNavigateAutocompleteDown);
let CommandNavigateAutocompleteUp = class CommandNavigateAutocompleteUp extends actions_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Insert];
        this.keys = [['<C-p>'], ['<C-k>']];
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            yield vscode.commands.executeCommand('selectPrevSuggestion');
            return vimState;
        });
    }
};
CommandNavigateAutocompleteUp = __decorate([
    base_1.RegisterAction
], CommandNavigateAutocompleteUp);
let CommandCtrlVInInsertMode = class CommandCtrlVInInsertMode extends actions_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Insert];
        this.keys = ['<C-v>'];
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            const textFromClipboard = clipboard_1.Clipboard.Paste();
            if (vimState.isMultiCursor) {
                vimState.recordedState.transformations.push({
                    type: 'insertText',
                    text: textFromClipboard,
                    position: vimState.cursorPosition,
                });
            }
            else {
                vimState.recordedState.transformations.push({
                    type: 'insertTextVSCode',
                    text: textFromClipboard,
                });
            }
            return vimState;
        });
    }
};
CommandCtrlVInInsertMode = __decorate([
    base_1.RegisterAction
], CommandCtrlVInInsertMode);
let CommandShowLineAutocomplete = class CommandShowLineAutocomplete extends actions_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.modes = [mode_1.ModeName.Insert];
        this.keys = ['<C-x>', '<C-l>'];
    }
    runsOnceForEveryCursor() {
        return false;
    }
    exec(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            yield lineCompletionProvider_1.lineCompletionProvider.showLineCompletionsQuickPick(position, vimState);
            return vimState;
        });
    }
};
CommandShowLineAutocomplete = __decorate([
    base_1.RegisterAction
], CommandShowLineAutocomplete);

//# sourceMappingURL=insert.js.map
