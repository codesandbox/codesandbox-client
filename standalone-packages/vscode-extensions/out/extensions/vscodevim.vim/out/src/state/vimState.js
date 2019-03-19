"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mode_1 = require("../mode/mode");
const easymotion_1 = require("./../actions/plugins/easymotion/easymotion");
const position_1 = require("./../common/motion/position");
const range_1 = require("./../common/motion/range");
const editorIdentity_1 = require("./../editorIdentity");
const historyTracker_1 = require("./../history/historyTracker");
const register_1 = require("./../register/register");
const globalState_1 = require("./../state/globalState");
const recordedState_1 = require("./recordedState");
const neovim_1 = require("../neovim/neovim");
const imswitcher_1 = require("../actions/plugins/imswitcher");
const logger_1 = require("../util/logger");
/**
 * The VimState class holds permanent state that carries over from action
 * to action.
 *
 * Actions defined in actions.ts are only allowed to mutate a VimState in order to
 * indicate what they want to do.
 */
class VimState {
    constructor(editor, enableNeovim = false) {
        /**
         * The column the cursor wants to be at, or Number.POSITIVE_INFINITY if it should always
         * be the rightmost column.
         *
         * Example: If you go to the end of a 20 character column, this value
         * will be 20, even if you press j and the next column is only 5 characters.
         * This is because if the third column is 25 characters, the cursor will go
         * back to the 20th column.
         */
        this.desiredColumn = 0;
        /**
         * For timing out remapped keys like jj to esc.
         */
        this.lastKeyPressedTimestamp = 0;
        /**
         * Are multiple cursors currently present?
         */
        this.isMultiCursor = false;
        /**
         * Is the multicursor something like visual block "multicursor", where
         * natively in vim there would only be one cursor whose changes were applied
         * to all lines after edit.
         */
        this.isFakeMultiCursor = false;
        this.lastMovementFailed = false;
        this.alteredHistory = false;
        this.isRunningDotCommand = false;
        /**
         * The last visual selection before running the dot command
         */
        this.dotCommandPreviousVisualSelection = undefined;
        this.focusChanged = false;
        this.surround = undefined;
        /**
         * Used for command like <C-o> which allows you to return to insert after a command
         */
        this.returnToInsertAfterCommand = false;
        this.actionCount = 0;
        /**
         * Every time we invoke a VS Code command which might trigger Code's view update,
         * we should postpone its view updating phase to avoid conflicting with our internal view updating mechanism.
         * This array is used to cache every VS Code view updating event and they will be triggered once we run the inhouse `viewUpdate`.
         */
        this.postponedCodeViewChanges = [];
        /**
         * Used to prevent non-recursive remappings from looping.
         */
        this.isCurrentlyPerformingRemapping = false;
        /**
         * All the keys we've pressed so far.
         */
        this.keyHistory = [];
        this.globalState = new globalState_1.GlobalState();
        /**
         * In Multi Cursor Mode, the position of every cursor.
         */
        this._allCursors = [new range_1.Range(new position_1.Position(0, 0), new position_1.Position(0, 0))];
        this.cursorPositionJustBeforeAnythingHappened = [new position_1.Position(0, 0)];
        this.isRecordingMacro = false;
        this.isReplayingMacro = false;
        this.replaceState = undefined;
        /**
         * Was the previous mouse click past EOL
         */
        this.lastClickWasPastEol = false;
        /**
         * The mode Vim will be in once this action finishes.
         */
        this._currentMode = mode_1.ModeName.Normal;
        this.currentRegisterMode = register_1.RegisterMode.AscertainFromCurrentMode;
        this.registerName = '"';
        this.currentCommandlineText = '';
        this.statusBarCursorCharacterPos = 0;
        this.recordedState = new recordedState_1.RecordedState();
        this.recordedMacro = new recordedState_1.RecordedState();
        this.editor = editor;
        this.identity = new editorIdentity_1.EditorIdentity(editor);
        this.historyTracker = new historyTracker_1.HistoryTracker(this);
        this.easyMotion = new easymotion_1.EasyMotion();
        if (enableNeovim) {
            this.nvim = new neovim_1.Neovim();
        }
        this._inputMethodSwitcher = new imswitcher_1.InputMethodSwitcher();
    }
    /**
     * The position the cursor will be when this action finishes.
     */
    get cursorPosition() {
        return this.allCursors[0].stop;
    }
    set cursorPosition(value) {
        this.allCursors[0] = this.allCursors[0].withNewStop(value);
    }
    /**
     * The effective starting position of the movement, used along with cursorPosition to determine
     * the range over which to run an Operator. May rarely be different than where the cursor
     * actually starts e.g. if you use the "aw" text motion in the middle of a word.
     */
    get cursorStartPosition() {
        return this.allCursors[0].start;
    }
    set cursorStartPosition(value) {
        this.allCursors[0] = this.allCursors[0].withNewStart(value);
    }
    get allCursors() {
        return this._allCursors;
    }
    set allCursors(value) {
        for (const cursor of value) {
            if (!cursor.start.isValid() || !cursor.stop.isValid()) {
                logger_1.logger.debug('VimState: invalid value for set cursor position. This is probably bad?');
            }
        }
        this._allCursors = value;
        this.isMultiCursor = this._allCursors.length > 1;
    }
    get currentMode() {
        return this._currentMode;
    }
    set currentMode(value) {
        this._inputMethodSwitcher.switchInputMethod(this._currentMode, value);
        this._currentMode = value;
    }
    get effectiveRegisterMode() {
        if (this.currentRegisterMode !== register_1.RegisterMode.AscertainFromCurrentMode) {
            return this.currentRegisterMode;
        }
        switch (this.currentMode) {
            case mode_1.ModeName.VisualLine:
                return register_1.RegisterMode.LineWise;
            case mode_1.ModeName.VisualBlock:
                return register_1.RegisterMode.BlockWise;
            default:
                return register_1.RegisterMode.CharacterWise;
        }
    }
    dispose() {
        if (this.nvim) {
            this.nvim.dispose();
        }
    }
}
/**
 * Tracks movements that can be repeated with ; (e.g. t, T, f, and F).
 */
VimState.lastSemicolonRepeatableMovement = undefined;
/**
 * Tracks movements that can be repeated with , (e.g. t, T, f, and F).
 */
VimState.lastCommaRepeatableMovement = undefined;
exports.VimState = VimState;
class ViewChange {
}
exports.ViewChange = ViewChange;

//# sourceMappingURL=vimState.js.map
