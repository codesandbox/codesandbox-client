"use strict";
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
const modes = require("./modes");
const base_1 = require("./../actions/base");
const motion_1 = require("./../actions/motion");
const insert_1 = require("./../actions/commands/insert");
const jump_1 = require("../jumps/jump");
const logger_1 = require("../util/logger");
const mode_1 = require("./mode");
const matcher_1 = require("./../common/matching/matcher");
const position_1 = require("./../common/motion/position");
const range_1 = require("./../common/motion/range");
const recordedState_1 = require("./../state/recordedState");
const register_1 = require("./../register/register");
const remapper_1 = require("../configuration/remapper");
const statusBar_1 = require("../statusBar");
const textEditor_1 = require("./../textEditor");
const error_1 = require("./../error");
const vimState_1 = require("./../state/vimState");
const vscode_context_1 = require("../util/vscode-context");
const commandLine_1 = require("../cmd_line/commandLine");
const configuration_1 = require("../configuration/configuration");
const decoration_1 = require("../configuration/decoration");
const util_1 = require("../util/util");
const actions_1 = require("./../actions/commands/actions");
const transformations_1 = require("./../transformations/transformations");
class ModeHandler {
    constructor(textEditor) {
        this._disposables = [];
        this._logger = logger_1.Logger.get('ModeHandler');
        this._remappers = new remapper_1.Remappers();
        this._modes = [
            new modes.NormalMode(),
            new modes.InsertMode(),
            new modes.VisualMode(),
            new modes.VisualBlockMode(),
            new modes.VisualLineMode(),
            new modes.SearchInProgressMode(),
            new modes.CommandlineInProgress(),
            new modes.ReplaceMode(),
            new modes.EasyMotionMode(),
            new modes.EasyMotionInputMode(),
            new modes.SurroundInputMode(),
            new modes.DisabledMode(),
        ];
        this.vimState = new vimState_1.VimState(textEditor);
        this._disposables.push(this.vimState);
    }
    get currentMode() {
        return this._modes.find(mode => mode.isActive);
    }
    static Create(textEditor = vscode.window.activeTextEditor) {
        return __awaiter(this, void 0, void 0, function* () {
            const modeHandler = new ModeHandler(textEditor);
            yield modeHandler.setCurrentMode(configuration_1.configuration.startInInsertMode ? mode_1.ModeName.Insert : mode_1.ModeName.Normal);
            modeHandler.syncCursors();
            return modeHandler;
        });
    }
    /**
     * Syncs cursors between vscode representation and vim representation
     */
    syncCursors() {
        setImmediate(() => {
            if (this.vimState.editor) {
                this.vimState.cursorStartPosition = position_1.Position.FromVSCodePosition(this.vimState.editor.selection.start);
                this.vimState.cursorStopPosition = position_1.Position.FromVSCodePosition(this.vimState.editor.selection.start);
                this.vimState.desiredColumn = this.vimState.cursorStopPosition.character;
            }
        }, 0);
    }
    /**
     * This is easily the worst function in VSCodeVim.
     *
     * We need to know when VSCode has updated our selection, so that we can sync
     * that internally. Unfortunately, VSCode has a habit of calling this
     * function at weird times, or or with incomplete information, so we have to
     * do a lot of voodoo to make sure we're updating the cursors correctly.
     *
     * Even worse, we don't even know how to test this stuff.
     *
     * Anyone who wants to change the behavior of this method should make sure
     * all selection related test cases pass. Follow this spec
     * https://gist.github.com/rebornix/d21d1cc060c009d4430d3904030bd4c1 to
     * perform the manual testing.
     */
    handleSelectionChange(e) {
        return __awaiter(this, void 0, void 0, function* () {
            let selection = e.selections[0];
            if ((e.selections.length !== this.vimState.cursors.length || this.vimState.isMultiCursor) &&
                this.vimState.currentMode !== mode_1.ModeName.VisualBlock) {
                // Number of selections changed, make sure we know about all of them still
                this.vimState.cursors = e.textEditor.selections.map(sel => new range_1.Range(
                // Adjust the cursor positions because cursors & selections don't match exactly
                sel.anchor.compareTo(sel.active) > 0
                    ? position_1.Position.FromVSCodePosition(sel.anchor).getLeft()
                    : position_1.Position.FromVSCodePosition(sel.anchor), position_1.Position.FromVSCodePosition(sel.active)));
                return this.updateView(this.vimState);
            }
            /**
             * We only trigger our view updating process if it's a mouse selection.
             * Otherwise we only update our internal cursor positions accordingly.
             */
            if (e.kind !== vscode.TextEditorSelectionChangeKind.Mouse) {
                if (selection) {
                    if (this.currentMode.isVisualMode) {
                        /**
                         * In Visual Mode, our `cursorPosition` and `cursorStartPosition` can not reflect `active`,
                         * `start`, `end` and `anchor` information in a selection.
                         * See `Fake block cursor with text decoration` section of `updateView` method.
                         */
                        return;
                    }
                    this.vimState.cursorStopPosition = position_1.Position.FromVSCodePosition(selection.active);
                    this.vimState.cursorStartPosition = position_1.Position.FromVSCodePosition(selection.start);
                }
                return;
            }
            if (this.vimState.isMultiCursor && e.selections.length === 1) {
                this.vimState.isMultiCursor = false;
            }
            if (this.vimState.currentMode === mode_1.ModeName.SearchInProgressMode ||
                this.vimState.currentMode === mode_1.ModeName.CommandlineInProgress) {
                return;
            }
            let toDraw = false;
            if (selection) {
                let newPosition = new position_1.Position(selection.active.line, selection.active.character);
                // Only check on a click, not a full selection (to prevent clicking past EOL)
                if (newPosition.character >= newPosition.getLineEnd().character && selection.isEmpty) {
                    if (this.vimState.currentMode !== mode_1.ModeName.Insert) {
                        this.vimState.lastClickWasPastEol = true;
                        // This prevents you from mouse clicking past the EOL
                        newPosition = newPosition.withColumn(Math.max(newPosition.getLineEnd().character - 1, 0));
                        // Switch back to normal mode since it was a click not a selection
                        yield this.setCurrentMode(mode_1.ModeName.Normal);
                        toDraw = true;
                    }
                }
                else if (selection.isEmpty) {
                    this.vimState.lastClickWasPastEol = false;
                }
                this.vimState.cursorStopPosition = newPosition;
                this.vimState.cursorStartPosition = newPosition;
                this.vimState.desiredColumn = newPosition.character;
                // start visual mode?
                if (selection.anchor.line === selection.active.line &&
                    selection.anchor.character >= newPosition.getLineEnd().character - 1 &&
                    selection.active.character >= newPosition.getLineEnd().character - 1) {
                    // This prevents you from selecting EOL
                }
                else if (!selection.anchor.isEqual(selection.active)) {
                    var selectionStart = new position_1.Position(selection.anchor.line, selection.anchor.character);
                    if (selectionStart.character > selectionStart.getLineEnd().character) {
                        selectionStart = new position_1.Position(selectionStart.line, selectionStart.getLineEnd().character);
                    }
                    this.vimState.cursorStartPosition = selectionStart;
                    if (selectionStart.compareTo(newPosition) > 0) {
                        this.vimState.cursorStartPosition = this.vimState.cursorStartPosition.getLeft();
                    }
                    // If we prevented from clicking past eol but it is part of this selection, include the last char
                    if (this.vimState.lastClickWasPastEol) {
                        const newStart = new position_1.Position(selection.anchor.line, selection.anchor.character + 1);
                        this.vimState.editor.selection = new vscode.Selection(newStart, selection.end);
                        this.vimState.cursorStartPosition = selectionStart;
                        this.vimState.lastClickWasPastEol = false;
                    }
                    if (configuration_1.configuration.mouseSelectionGoesIntoVisualMode &&
                        !this.currentMode.isVisualMode &&
                        this.currentMode.name !== mode_1.ModeName.Insert) {
                        yield this.setCurrentMode(mode_1.ModeName.Visual);
                        // double click mouse selection causes an extra character to be selected so take one less character
                    }
                }
                else if (this.vimState.currentMode !== mode_1.ModeName.Insert) {
                    yield this.setCurrentMode(mode_1.ModeName.Normal);
                }
                return this.updateView(this.vimState, { drawSelection: toDraw, revealRange: true });
            }
        });
    }
    handleKeyEvent(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = Number(new Date());
            this._logger.debug(`handling key=${key}.`);
            // rewrite copy
            if (configuration_1.configuration.overrideCopy) {
                // The conditions when you trigger a "copy" rather than a ctrl-c are
                // too sophisticated to be covered by the "when" condition in package.json
                if (key === '<D-c>') {
                    key = '<copy>';
                }
                if (key === '<C-c>' && process.platform !== 'darwin') {
                    if (!configuration_1.configuration.useCtrlKeys ||
                        this.vimState.currentMode === mode_1.ModeName.Visual ||
                        this.vimState.currentMode === mode_1.ModeName.VisualBlock ||
                        this.vimState.currentMode === mode_1.ModeName.VisualLine) {
                        key = '<copy>';
                    }
                }
            }
            // <C-d> triggers "add selection to next find match" by default,
            // unless users explicity make <C-d>: true
            if (key === '<C-d>' && !(configuration_1.configuration.handleKeys['<C-d>'] === true)) {
                key = '<D-d>';
            }
            this.vimState.cursorsInitialState = this.vimState.cursors;
            this.vimState.recordedState.commandList.push(key);
            try {
                const isWithinTimeout = now - this.vimState.lastKeyPressedTimestamp < configuration_1.configuration.timeout;
                if (!isWithinTimeout) {
                    // sufficient time has elapsed since the prior keypress,
                    // only consider the last keypress for remapping
                    this.vimState.recordedState.commandList = [
                        this.vimState.recordedState.commandList[this.vimState.recordedState.commandList.length - 1],
                    ];
                }
                let handled = false;
                const isOperatorCombination = this.vimState.recordedState.operator;
                // Check for remapped keys if:
                // 1. We are not currently performing a non-recursive remapping
                // 2. We are not in normal mode performing on an operator
                //    Example: ciwjj should be remapped if jj -> <Esc> in insert mode
                //             dd should not remap the second "d", if d -> "_d in normal mode
                if (!this.vimState.isCurrentlyPerformingRemapping &&
                    (!isOperatorCombination || this.vimState.currentMode !== mode_1.ModeName.Normal)) {
                    handled = yield this._remappers.sendKey(this.vimState.recordedState.commandList, this, this.vimState);
                }
                if (handled) {
                    this.vimState.recordedState.resetCommandList();
                }
                else {
                    this.vimState = yield this.handleKeyEventHelper(key, this.vimState);
                }
            }
            catch (e) {
                if (e instanceof error_1.VimError) {
                    statusBar_1.StatusBar.Set(e.toString(), this.vimState.currentMode, this.vimState.isRecordingMacro, true);
                }
                else {
                    throw new Error(`Failed to handle key=${key}. ${e.message}`);
                }
            }
            this.vimState.lastKeyPressedTimestamp = now;
            this._renderStatusBar();
            return true;
        });
    }
    handleKeyEventHelper(key, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            if (vscode.window.activeTextEditor !== this.vimState.editor) {
                this._logger.warn('Current window is not active');
                return this.vimState;
            }
            // Catch any text change not triggered by us (example: tab completion).
            vimState.historyTracker.addChange(this.vimState.cursorsInitialState.map(c => c.stop));
            vimState.keyHistory.push(key);
            let recordedState = vimState.recordedState;
            recordedState.actionKeys.push(key);
            let result = base_1.Actions.getRelevantAction(recordedState.actionKeys, vimState);
            switch (result) {
                case base_1.KeypressState.NoPossibleMatch:
                    if (!this._remappers.isPotentialRemap) {
                        vimState.recordedState = new recordedState_1.RecordedState();
                    }
                    return vimState;
                case base_1.KeypressState.WaitingOnKeys:
                    return vimState;
            }
            let action = result;
            let actionToRecord = action;
            if (recordedState.actionsRun.length === 0) {
                recordedState.actionsRun.push(action);
            }
            else {
                let lastAction = recordedState.actionsRun[recordedState.actionsRun.length - 1];
                if (lastAction instanceof actions_1.DocumentContentChangeAction) {
                    lastAction.keysPressed.push(key);
                    if (action instanceof insert_1.CommandInsertInInsertMode ||
                        action instanceof insert_1.CommandInsertPreviousText) {
                        // delay the macro recording
                        actionToRecord = undefined;
                    }
                    else {
                        // Push document content change to the stack
                        lastAction.contentChanges = lastAction.contentChanges.concat(vimState.historyTracker.currentContentChanges.map(x => ({
                            textDiff: x,
                            positionDiff: new position_1.PositionDiff(0, 0),
                        })));
                        vimState.historyTracker.currentContentChanges = [];
                        recordedState.actionsRun.push(action);
                    }
                }
                else {
                    if (action instanceof insert_1.CommandInsertInInsertMode ||
                        action instanceof insert_1.CommandInsertPreviousText) {
                        // This means we are already in Insert Mode but there is still not DocumentContentChangeAction in stack
                        vimState.historyTracker.currentContentChanges = [];
                        let newContentChange = new actions_1.DocumentContentChangeAction();
                        newContentChange.keysPressed.push(key);
                        recordedState.actionsRun.push(newContentChange);
                        actionToRecord = newContentChange;
                    }
                    else {
                        recordedState.actionsRun.push(action);
                    }
                }
            }
            if (vimState.isRecordingMacro &&
                actionToRecord &&
                !(actionToRecord instanceof actions_1.CommandQuitRecordMacro)) {
                vimState.recordedMacro.actionsRun.push(actionToRecord);
            }
            vimState = yield this.runAction(vimState, recordedState, action);
            if (vimState.currentMode === mode_1.ModeName.Insert) {
                recordedState.isInsertion = true;
            }
            // Update view
            yield this.updateView(vimState);
            if (action.isJump) {
                vimState.globalState.jumpTracker.recordJump(jump_1.Jump.fromStateBefore(vimState), jump_1.Jump.fromStateNow(vimState));
            }
            return vimState;
        });
    }
    runAction(vimState, recordedState, action) {
        return __awaiter(this, void 0, void 0, function* () {
            let ranRepeatableAction = false;
            let ranAction = false;
            // If arrow keys or mouse was used prior to entering characters while in insert mode, create an undo point
            // this needs to happen before any changes are made
            /*
        
            TODO: This causes . to crash vscodevim for some reason.
        
            if (!vimState.isMultiCursor) {
              let prevPos = vimState.historyTracker.getLastHistoryEndPosition();
              if (prevPos !== undefined && !vimState.isRunningDotCommand) {
                if (vimState.cursorPositionJustBeforeAnythingHappened[0].line !== prevPos[0].line ||
                  vimState.cursorPositionJustBeforeAnythingHappened[0].character !== prevPos[0].character) {
                  vimState.globalState.previousFullAction = recordedState;
                  vimState.historyTracker.finishCurrentStep();
                }
              }
            }
            */
            if (vimState.currentMode === mode_1.ModeName.Visual) {
                vimState.cursors = vimState.cursors.map(x => x.start.isEarlierThan(x.stop) ? x.withNewStop(x.stop.getLeftThroughLineBreaks(true)) : x);
            }
            if (action instanceof motion_1.BaseMovement) {
                ({ vimState, recordedState } = yield this.executeMovement(vimState, action));
                ranAction = true;
            }
            if (action instanceof actions_1.BaseCommand) {
                vimState = yield action.execCount(vimState.cursorStopPosition, vimState);
                yield this.executeCommand(vimState);
                if (action.isCompleteAction) {
                    ranAction = true;
                }
                if (action.canBeRepeatedWithDot) {
                    ranRepeatableAction = true;
                }
            }
            if (action instanceof actions_1.DocumentContentChangeAction) {
                vimState = yield action.exec(vimState.cursorStopPosition, vimState);
            }
            // Update mode (note the ordering allows you to go into search mode,
            // then return and have the motion immediately applied to an operator).
            const prevState = this.currentMode.name;
            if (vimState.currentMode !== this.currentMode.name) {
                yield this.setCurrentMode(vimState.currentMode);
                // We don't want to mark any searches as a repeatable action
                if (vimState.currentMode === mode_1.ModeName.Normal &&
                    prevState !== mode_1.ModeName.SearchInProgressMode &&
                    prevState !== mode_1.ModeName.CommandlineInProgress &&
                    prevState !== mode_1.ModeName.EasyMotionInputMode &&
                    prevState !== mode_1.ModeName.EasyMotionMode) {
                    ranRepeatableAction = true;
                }
            }
            // Set context for overriding cmd-V, this is only done in search entry and
            // commandline modes
            if (this.IsModeWhereCmdVIsOverriden(vimState.currentMode) &&
                !this.IsModeWhereCmdVIsOverriden(prevState)) {
                yield vscode_context_1.VsCodeContext.Set('vim.overrideCmdV', true);
            }
            else if (this.IsModeWhereCmdVIsOverriden(prevState) &&
                !this.IsModeWhereCmdVIsOverriden(vimState.currentMode)) {
                yield vscode_context_1.VsCodeContext.Set('vim.overrideCmdV', false);
            }
            if (recordedState.operatorReadyToExecute(vimState.currentMode)) {
                if (vimState.recordedState.operator) {
                    vimState = yield this.executeOperator(vimState);
                    vimState.recordedState.hasRunOperator = true;
                    ranRepeatableAction = vimState.recordedState.operator.canBeRepeatedWithDot;
                    ranAction = true;
                }
            }
            if (vimState.currentMode === mode_1.ModeName.Visual) {
                vimState.cursors = vimState.cursors.map(x => x.start.isEarlierThan(x.stop)
                    ? x.withNewStop(x.stop.isLineEnd() ? x.stop.getRightThroughLineBreaks() : x.stop.getRight())
                    : x);
            }
            // And then we have to do it again because an operator could
            // have changed it as well. (TODO: do you even decomposition bro)
            if (vimState.currentMode !== this.currentMode.name) {
                yield this.setCurrentMode(vimState.currentMode);
                if (vimState.currentMode === mode_1.ModeName.Normal) {
                    ranRepeatableAction = true;
                }
            }
            if (ranAction && vimState.currentMode !== mode_1.ModeName.Insert) {
                vimState.recordedState.resetCommandList();
            }
            ranRepeatableAction =
                (ranRepeatableAction && vimState.currentMode === mode_1.ModeName.Normal) ||
                    this.createUndoPointForBrackets(vimState);
            ranAction = ranAction && vimState.currentMode === mode_1.ModeName.Normal;
            // Record down previous action and flush temporary state
            if (ranRepeatableAction) {
                vimState.globalState.previousFullAction = vimState.recordedState;
                if (recordedState.isInsertion) {
                    register_1.Register.putByKey(recordedState, '.');
                }
            }
            // Updated desired column
            const movement = action instanceof motion_1.BaseMovement ? action : undefined;
            if ((movement && !movement.doesntChangeDesiredColumn) ||
                (!movement && vimState.currentMode !== mode_1.ModeName.VisualBlock)) {
                // We check !operator here because e.g. d$ should NOT set the desired column to EOL.
                if (movement && movement.setsDesiredColumnToEOL && !recordedState.operator) {
                    vimState.desiredColumn = Number.POSITIVE_INFINITY;
                }
                else {
                    vimState.desiredColumn = vimState.cursorStopPosition.character;
                }
            }
            if (ranAction) {
                vimState.recordedState = new recordedState_1.RecordedState();
                // Return to insert mode after 1 command in this case for <C-o>
                if (vimState.returnToInsertAfterCommand) {
                    if (vimState.actionCount > 0) {
                        vimState.returnToInsertAfterCommand = false;
                        vimState.actionCount = 0;
                        yield this.setCurrentMode(mode_1.ModeName.Insert);
                    }
                    else {
                        vimState.actionCount++;
                    }
                }
            }
            // track undo history
            if (!this.vimState.focusChanged) {
                // important to ensure that focus didn't change, otherwise
                // we'll grab the text of the incorrect active window and assume the
                // whole document changed!
                if (this.vimState.alteredHistory) {
                    this.vimState.alteredHistory = false;
                    vimState.historyTracker.ignoreChange();
                }
                else {
                    vimState.historyTracker.addChange(this.vimState.cursorsInitialState.map(c => c.stop));
                }
            }
            // Don't record an undo point for every action of a macro, only at the very end
            if (ranRepeatableAction && !vimState.isReplayingMacro) {
                vimState.historyTracker.finishCurrentStep();
            }
            recordedState.actionKeys = [];
            vimState.currentRegisterMode = register_1.RegisterMode.AscertainFromCurrentMode;
            if (this.currentMode.name === mode_1.ModeName.Normal) {
                vimState.cursorStartPosition = vimState.cursorStopPosition;
            }
            // Ensure cursor is within bounds
            if (!vimState.editor.document.isClosed && vimState.editor === vscode.window.activeTextEditor) {
                const cursors = new Array();
                for (let { range } of range_1.Range.IterateRanges(vimState.cursors)) {
                    // adjust start/stop
                    const documentEndPosition = vimState.cursorStopPosition.getDocumentEnd(vimState.editor);
                    const documentLineCount = textEditor_1.TextEditor.getLineCount(vimState.editor);
                    if (range.start.line >= documentLineCount) {
                        range = range.withNewStart(documentEndPosition);
                    }
                    if (range.stop.line >= documentLineCount) {
                        range = range.withNewStop(documentEndPosition);
                    }
                    // adjust column
                    if (vimState.currentMode === mode_1.ModeName.Normal) {
                        const currentLineLength = textEditor_1.TextEditor.getLineAt(range.stop).text.length;
                        if (currentLineLength > 0) {
                            const lineEndPosition = range.start.getLineEnd().getLeftThroughLineBreaks(true);
                            if (range.start.character >= currentLineLength) {
                                range = range.withNewStart(lineEndPosition);
                            }
                            if (range.stop.character >= currentLineLength) {
                                range = range.withNewStop(lineEndPosition);
                            }
                        }
                    }
                    cursors.push(range);
                }
                vimState.cursors = cursors;
            }
            // Update the current history step to have the latest cursor position
            vimState.historyTracker.setLastHistoryEndPosition(vimState.cursors.map(x => x.stop));
            if (this.currentMode.isVisualMode && !this.vimState.isRunningDotCommand) {
                // Store selection for commands like gv
                this.vimState.lastVisualMode = this.vimState.currentMode;
                this.vimState.lastVisualSelectionStart = this.vimState.cursorStartPosition;
                this.vimState.lastVisualSelectionEnd = this.vimState.cursorStopPosition;
            }
            return vimState;
        });
    }
    executeMovement(vimState, movement) {
        return __awaiter(this, void 0, void 0, function* () {
            vimState.lastMovementFailed = false;
            let recordedState = vimState.recordedState;
            for (let i = 0; i < vimState.cursors.length; i++) {
                /**
                 * Essentially what we're doing here is pretending like the
                 * current VimState only has one cursor (the cursor that we just
                 * iterated to).
                 *
                 * We set the cursor position to be equal to the iterated one,
                 * and then set it back immediately after we're done.
                 *
                 * The slightly more complicated logic here allows us to write
                 * Action definitions without having to think about multiple
                 * cursors in almost all cases.
                 */
                let cursorPosition = vimState.cursors[i].stop;
                const old = vimState.cursorStopPosition;
                vimState.cursorStopPosition = cursorPosition;
                const result = yield movement.execActionWithCount(cursorPosition, vimState, recordedState.count);
                vimState.cursorStopPosition = old;
                if (result instanceof position_1.Position) {
                    vimState.cursors[i] = vimState.cursors[i].withNewStop(result);
                    if (!this.currentMode.isVisualMode && !vimState.recordedState.operator) {
                        vimState.cursors[i] = vimState.cursors[i].withNewStart(result);
                    }
                }
                else if (motion_1.isIMovement(result)) {
                    if (result.failed) {
                        vimState.recordedState = new recordedState_1.RecordedState();
                        vimState.lastMovementFailed = true;
                    }
                    vimState.cursors[i] = range_1.Range.FromIMovement(result);
                    if (result.registerMode) {
                        vimState.currentRegisterMode = result.registerMode;
                    }
                }
            }
            vimState.recordedState.count = 0;
            // Keep the cursor within bounds
            if (vimState.currentMode !== mode_1.ModeName.Normal || recordedState.operator) {
                let stop = vimState.cursorStopPosition;
                // Vim does this weird thing where it allows you to select and delete
                // the newline character, which it places 1 past the last character
                // in the line. This is why we use > instead of >=.
                if (stop.character > position_1.Position.getLineLength(stop.line)) {
                    vimState.cursorStopPosition = stop.getLineEnd();
                }
            }
            return { vimState, recordedState };
        });
    }
    executeOperator(vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            let recordedState = vimState.recordedState;
            if (!recordedState.operator) {
                this._logger.warn('recordedState.operator: ' + recordedState.operator);
                throw new Error("what in god's name. recordedState.operator is falsy.");
            }
            let resultVimState = vimState;
            // TODO - if actions were more pure, this would be unnecessary.
            const cachedMode = this.currentMode;
            const cachedRegister = vimState.currentRegisterMode;
            const resultingCursors = [];
            let i = 0;
            let startingModeName = vimState.currentMode;
            for (let { start, stop } of vimState.cursors) {
                if (start.compareTo(stop) > 0) {
                    [start, stop] = [stop, start];
                }
                if (!cachedMode.isVisualMode && cachedRegister !== register_1.RegisterMode.LineWise) {
                    stop = stop.getLeftThroughLineBreaks(true);
                }
                if (this.currentMode.name === mode_1.ModeName.VisualLine) {
                    start = start.getLineBegin();
                    stop = stop.getLineEnd();
                    vimState.currentRegisterMode = register_1.RegisterMode.LineWise;
                }
                recordedState.operator.multicursorIndex = i++;
                yield resultVimState.setCurrentMode(startingModeName);
                // We run the repeat version of an operator if the last 2 operators are the same.
                if (recordedState.operators.length > 1 &&
                    recordedState.operators.reverse()[0].constructor ===
                        recordedState.operators.reverse()[1].constructor) {
                    resultVimState = yield recordedState.operator.runRepeat(resultVimState, start, recordedState.count);
                }
                else {
                    resultVimState = yield recordedState.operator.run(resultVimState, start, stop);
                }
                for (const transformation of resultVimState.recordedState.transformations) {
                    if (transformations_1.isTextTransformation(transformation) && transformation.cursorIndex === undefined) {
                        transformation.cursorIndex = recordedState.operator.multicursorIndex;
                    }
                }
                let resultingRange = new range_1.Range(resultVimState.cursorStartPosition, resultVimState.cursorStopPosition);
                resultingCursors.push(resultingRange);
            }
            if (vimState.recordedState.transformations.length > 0) {
                yield this.executeCommand(vimState);
            }
            else {
                // Keep track of all cursors (in the case of multi-cursor).
                resultVimState.cursors = resultingCursors;
                this.vimState.editor.selections = vimState.cursors.map(cursor => new vscode.Selection(cursor.start, cursor.stop));
            }
            return resultVimState;
        });
    }
    executeCommand(vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            const transformations = vimState.recordedState.transformations;
            if (transformations.length === 0) {
                return;
            }
            const textTransformations = transformations.filter(x => transformations_1.isTextTransformation(x));
            const otherTransformations = transformations.filter(x => !transformations_1.isTextTransformation(x));
            let accumulatedPositionDifferences = {};
            const doTextEditorEdit = (command, edit) => {
                switch (command.type) {
                    case 'insertText':
                        edit.insert(command.position, command.text);
                        break;
                    case 'replaceText':
                        edit.replace(new vscode.Selection(command.end, command.start), command.text);
                        break;
                    case 'deleteText':
                        let matchRange = matcher_1.PairMatcher.immediateMatchingBracket(command.position);
                        if (matchRange) {
                            edit.delete(matchRange);
                        }
                        edit.delete(new vscode.Range(command.position, command.position.getLeftThroughLineBreaks()));
                        break;
                    case 'deleteRange':
                        edit.delete(new vscode.Selection(command.range.start, command.range.stop));
                        break;
                    case 'moveCursor':
                        break;
                    default:
                        this._logger.warn(`Unhandled text transformation type: ${command.type}.`);
                        break;
                }
                if (command.cursorIndex === undefined) {
                    throw new Error('No cursor index - this should never ever happen!');
                }
                if (command.diff) {
                    if (!accumulatedPositionDifferences[command.cursorIndex]) {
                        accumulatedPositionDifferences[command.cursorIndex] = [];
                    }
                    accumulatedPositionDifferences[command.cursorIndex].push(command.diff);
                }
            };
            if (textTransformations.length > 0) {
                if (transformations_1.areAnyTransformationsOverlapping(textTransformations)) {
                    this._logger.debug(`Text transformations are overlapping. Falling back to serial
           transformations. This is generally a very bad sign. Try to make
           your text transformations operate on non-overlapping ranges.`);
                    // TODO: Select one transformation for every cursor and run them all
                    // in parallel. Repeat till there are no more transformations.
                    for (const command of textTransformations) {
                        yield this.vimState.editor.edit(edit => doTextEditorEdit(command, edit));
                    }
                }
                else {
                    // This is the common case!
                    /**
                     * batch all text operations together as a single operation
                     * (this is primarily necessary for multi-cursor mode, since most
                     * actions will trigger at most one text operation).
                     */
                    yield this.vimState.editor.edit(edit => {
                        for (const command of textTransformations) {
                            doTextEditorEdit(command, edit);
                        }
                    });
                }
            }
            for (const command of otherTransformations) {
                switch (command.type) {
                    case 'insertTextVSCode':
                        yield textEditor_1.TextEditor.insert(command.text);
                        vimState.cursorStartPosition = position_1.Position.FromVSCodePosition(this.vimState.editor.selection.start);
                        vimState.cursorStopPosition = position_1.Position.FromVSCodePosition(this.vimState.editor.selection.end);
                        break;
                    case 'showCommandHistory':
                        let cmd = yield commandLine_1.commandLine.ShowHistory(vimState.currentCommandlineText, this.vimState);
                        if (cmd && cmd.length !== 0) {
                            yield commandLine_1.commandLine.Run(cmd, this.vimState);
                            this.updateView(this.vimState);
                        }
                        break;
                    case 'dot':
                        if (!vimState.globalState.previousFullAction) {
                            return vimState; // TODO(bell)
                        }
                        const clonedAction = vimState.globalState.previousFullAction.clone();
                        yield this.rerunRecordedState(vimState, vimState.globalState.previousFullAction);
                        vimState.globalState.previousFullAction = clonedAction;
                        break;
                    case 'macro':
                        let recordedMacro = (yield register_1.Register.getByKey(command.register)).text;
                        vimState.isReplayingMacro = true;
                        if (command.replay === 'contentChange') {
                            vimState = yield this.runMacro(vimState, recordedMacro);
                        }
                        else {
                            let keyStrokes = [];
                            for (let action of recordedMacro.actionsRun) {
                                keyStrokes = keyStrokes.concat(action.keysPressed);
                            }
                            this.vimState.recordedState = new recordedState_1.RecordedState();
                            yield this.handleMultipleKeyEvents(keyStrokes);
                        }
                        vimState.isReplayingMacro = false;
                        vimState.historyTracker.lastInvokedMacro = recordedMacro;
                        if (vimState.lastMovementFailed) {
                            // movement in last invoked macro failed then we should stop all following repeating macros.
                            // Besides, we should reset `lastMovementFailed`.
                            vimState.lastMovementFailed = false;
                            return;
                        }
                        break;
                    case 'contentChange':
                        for (const change of command.changes) {
                            yield textEditor_1.TextEditor.insert(change.text);
                            vimState.cursorStopPosition = position_1.Position.FromVSCodePosition(this.vimState.editor.selection.start);
                        }
                        const newPos = vimState.cursorStopPosition.add(command.diff);
                        this.vimState.editor.selection = new vscode.Selection(newPos, newPos);
                        break;
                    case 'tab':
                        yield vscode.commands.executeCommand('tab');
                        if (command.diff) {
                            if (command.cursorIndex === undefined) {
                                throw new Error('No cursor index - this should never ever happen!');
                            }
                            if (!accumulatedPositionDifferences[command.cursorIndex]) {
                                accumulatedPositionDifferences[command.cursorIndex] = [];
                            }
                            accumulatedPositionDifferences[command.cursorIndex].push(command.diff);
                        }
                        break;
                    case 'reindent':
                        yield vscode.commands.executeCommand('editor.action.reindentselectedlines');
                        if (command.diff) {
                            if (command.cursorIndex === undefined) {
                                throw new Error('No cursor index - this should never ever happen!');
                            }
                            if (!accumulatedPositionDifferences[command.cursorIndex]) {
                                accumulatedPositionDifferences[command.cursorIndex] = [];
                            }
                            accumulatedPositionDifferences[command.cursorIndex].push(command.diff);
                        }
                        break;
                    default:
                        this._logger.warn(`Unhandled text transformation type: ${command.type}.`);
                        break;
                }
            }
            const selections = this.vimState.editor.selections.map(x => {
                let y = range_1.Range.FromVSCodeSelection(x);
                y = y.start.isEarlierThan(y.stop) ? y.withNewStop(y.stop.getLeftThroughLineBreaks(true)) : y;
                return new vscode.Selection(new vscode.Position(y.start.line, y.start.character), new vscode.Position(y.stop.line, y.stop.character));
            });
            const firstTransformation = transformations[0];
            const manuallySetCursorPositions = (firstTransformation.type === 'deleteRange' ||
                firstTransformation.type === 'replaceText' ||
                firstTransformation.type === 'insertText') &&
                firstTransformation.manuallySetCursorPositions;
            // We handle multiple cursors in a different way in visual block mode, unfortunately.
            // TODO - refactor that out!
            if (vimState.currentMode !== mode_1.ModeName.VisualBlock && !manuallySetCursorPositions) {
                vimState.cursors = [];
                const resultingCursors = [];
                for (let i = 0; i < selections.length; i++) {
                    let sel = range_1.Range.FromVSCodeSelection(selections[i]);
                    let resultStart = position_1.Position.FromVSCodePosition(sel.start);
                    let resultEnd = position_1.Position.FromVSCodePosition(sel.stop);
                    if (accumulatedPositionDifferences[i] && accumulatedPositionDifferences[i].length > 0) {
                        for (const diff of accumulatedPositionDifferences[i]) {
                            resultStart = resultStart.add(diff);
                            resultEnd = resultEnd.add(diff);
                        }
                        sel = new range_1.Range(resultStart, resultEnd);
                    }
                    else {
                        sel = new range_1.Range(position_1.Position.FromVSCodePosition(sel.start), position_1.Position.FromVSCodePosition(sel.stop));
                    }
                    if (vimState.recordedState.operatorPositionDiff) {
                        sel = sel.add(vimState.recordedState.operatorPositionDiff);
                    }
                    resultingCursors.push(sel);
                }
                vimState.recordedState.operatorPositionDiff = undefined;
                vimState.cursors = resultingCursors;
            }
            else {
                if (accumulatedPositionDifferences[0] !== undefined) {
                    if (accumulatedPositionDifferences[0].length > 0) {
                        vimState.cursorStopPosition = vimState.cursorStopPosition.add(accumulatedPositionDifferences[0][0]);
                        vimState.cursorStartPosition = vimState.cursorStartPosition.add(accumulatedPositionDifferences[0][0]);
                    }
                }
            }
            /**
             * This is a bit of a hack because Visual Block Mode isn't fully on board with
             * the new text transformation style yet.
             *
             * (TODO)
             */
            if (firstTransformation.type === 'deleteRange') {
                if (firstTransformation.collapseRange) {
                    vimState.cursorStopPosition = new position_1.Position(vimState.cursorStopPosition.line, vimState.cursorStartPosition.character);
                }
            }
            vimState.recordedState.transformations = [];
            return;
        });
    }
    rerunRecordedState(vimState, recordedState) {
        return __awaiter(this, void 0, void 0, function* () {
            const actions = recordedState.actionsRun.slice(0);
            const hasRunSurround = recordedState.hasRunSurround;
            const surroundKeys = recordedState.surroundKeys;
            vimState.isRunningDotCommand = true;
            // If a previous visual selection exists, store it for use in replay of some
            // commands
            if (vimState.lastVisualSelectionStart && vimState.lastVisualSelectionEnd) {
                vimState.dotCommandPreviousVisualSelection = new vscode.Selection(vimState.lastVisualSelectionStart, vimState.lastVisualSelectionEnd);
            }
            recordedState = new recordedState_1.RecordedState();
            vimState.recordedState = recordedState;
            // Replay surround if applicable, otherwise rerun actions
            if (hasRunSurround) {
                yield this.handleMultipleKeyEvents(surroundKeys);
            }
            else {
                let i = 0;
                for (let action of actions) {
                    recordedState.actionsRun = actions.slice(0, ++i);
                    vimState = yield this.runAction(vimState, recordedState, action);
                    if (vimState.lastMovementFailed) {
                        return vimState;
                    }
                    yield this.updateView(vimState);
                }
                recordedState.actionsRun = actions;
            }
            vimState.isRunningDotCommand = false;
            return vimState;
        });
    }
    runMacro(vimState, recordedMacro) {
        return __awaiter(this, void 0, void 0, function* () {
            const actions = recordedMacro.actionsRun || [];
            let recordedState = new recordedState_1.RecordedState();
            vimState.recordedState = recordedState;
            vimState.isRunningDotCommand = true;
            for (let action of actions) {
                let originalLocation = jump_1.Jump.fromStateNow(vimState);
                recordedState.actionsRun.push(action);
                vimState.keyHistory = vimState.keyHistory.concat(action.keysPressed);
                vimState = yield this.runAction(vimState, recordedState, action);
                // We just finished a full action; let's clear out our current state.
                if (vimState.recordedState.actionsRun.length === 0) {
                    recordedState = new recordedState_1.RecordedState();
                    vimState.recordedState = recordedState;
                }
                if (vimState.lastMovementFailed) {
                    break;
                }
                yield this.updateView(vimState);
                if (action.isJump) {
                    vimState.globalState.jumpTracker.recordJump(originalLocation, jump_1.Jump.fromStateNow(vimState));
                }
            }
            vimState.isRunningDotCommand = false;
            vimState.cursorsInitialState = vimState.cursors;
            return vimState;
        });
    }
    updateView(vimState, args = {
        drawSelection: true,
        revealRange: true,
    }) {
        return __awaiter(this, void 0, void 0, function* () {
            // Draw selection (or cursor)
            if (args.drawSelection) {
                let selections;
                let selectionMode = vimState.currentMode;
                if (vimState.currentMode === mode_1.ModeName.SearchInProgressMode) {
                    selectionMode = vimState.globalState.searchState.previousMode;
                }
                if (vimState.currentMode === mode_1.ModeName.CommandlineInProgress) {
                    selectionMode = commandLine_1.commandLine.previousMode;
                }
                if (!vimState.isMultiCursor) {
                    let start = vimState.cursorStartPosition;
                    let stop = vimState.cursorStopPosition;
                    if (selectionMode === mode_1.ModeName.Visual) {
                        /**
                         * Always select the letter that we started visual mode on, no matter
                         * if we are in front or behind it. Imagine that we started visual mode
                         * with some text like this:
                         *
                         *   abc|def
                         *
                         * (The | represents the cursor.) If we now press w, we'll select def,
                         * but if we hit b we expect to select abcd, so we need to getRight() on the
                         * start of the selection when it precedes where we started visual mode.
                         */
                        if (start.compareTo(stop) > 0) {
                            start = start.getRightThroughLineBreaks();
                        }
                        selections = [new vscode.Selection(start, stop)];
                    }
                    else if (selectionMode === mode_1.ModeName.VisualLine) {
                        selections = [
                            new vscode.Selection(position_1.Position.EarlierOf(start, stop).getLineBegin(), position_1.Position.LaterOf(start, stop).getLineEnd()),
                        ];
                        // Maintain cursor position based on which direction the selection is going
                        if (start.line <= stop.line) {
                            vimState.cursorStartPosition = selections[0].start;
                            vimState.cursorStopPosition = selections[0].end;
                        }
                        else {
                            vimState.cursorStartPosition = selections[0].end;
                            vimState.cursorStopPosition = selections[0].start;
                        }
                        // Adjust the selection so that active and anchor are correct, this
                        // makes relative line numbers display correctly
                        if (selections[0].start.line <= selections[0].end.line &&
                            vimState.cursorStopPosition.line <= vimState.cursorStartPosition.line) {
                            selections = [new vscode.Selection(selections[0].end, selections[0].start)];
                        }
                    }
                    else if (selectionMode === mode_1.ModeName.VisualBlock) {
                        selections = [];
                        for (const { start: lineStart, end } of position_1.Position.IterateLine(vimState)) {
                            selections.push(new vscode.Selection(lineStart, end));
                        }
                    }
                    else {
                        selections = [new vscode.Selection(stop, stop)];
                    }
                }
                else {
                    // MultiCursor mode is active.
                    selections = [];
                    switch (selectionMode) {
                        case mode_1.ModeName.Visual: {
                            for (let { start: cursorStart, stop: cursorStop } of vimState.cursors) {
                                if (cursorStart.compareTo(cursorStop) > 0) {
                                    cursorStart = cursorStart.getRight();
                                }
                                selections.push(new vscode.Selection(cursorStart, cursorStop));
                            }
                            break;
                        }
                        case mode_1.ModeName.Normal:
                        case mode_1.ModeName.Insert: {
                            for (const { stop: cursorStop } of vimState.cursors) {
                                selections.push(new vscode.Selection(cursorStop, cursorStop));
                            }
                            break;
                        }
                        default: {
                            this._logger.error(`unexpected selection mode. selectionMode=${selectionMode}`);
                            break;
                        }
                    }
                }
                if (vimState.recordedState.actionsRun.filter(x => x instanceof actions_1.DocumentContentChangeAction)
                    .length === 0) {
                    this.vimState.editor.selections = selections;
                }
            }
            // Scroll to position of cursor
            if (this.vimState.currentMode === mode_1.ModeName.SearchInProgressMode) {
                const nextMatch = vimState.globalState.searchState.getNextSearchMatchPosition(vimState.cursorStopPosition).pos;
                this.vimState.editor.revealRange(new vscode.Range(nextMatch, nextMatch));
            }
            else {
                if (args.revealRange) {
                    this.vimState.editor.revealRange(new vscode.Range(vimState.cursorStopPosition, vimState.cursorStopPosition));
                }
            }
            // cursor style
            let cursorStyle = configuration_1.configuration.getCursorStyleForMode(this.currentMode.friendlyName);
            if (!cursorStyle) {
                let currentCursor = this.currentMode.cursorType;
                cursorStyle = mode_1.Mode.translateCursor(currentCursor);
                if (currentCursor === mode_1.VSCodeVimCursorType.Native &&
                    configuration_1.configuration.editorCursorStyle !== undefined) {
                    cursorStyle = configuration_1.configuration.editorCursorStyle;
                }
            }
            this.vimState.editor.options.cursorStyle = cursorStyle;
            // cursor block
            let cursorRange = [];
            if (this.currentMode.cursorType === mode_1.VSCodeVimCursorType.TextDecoration &&
                this.currentMode.name !== mode_1.ModeName.Insert) {
                // Fake block cursor with text decoration. Unfortunately we can't have a cursor
                // in the middle of a selection natively, which is what we need for Visual Mode.
                if (this.currentMode.name === mode_1.ModeName.Visual) {
                    for (const { start: cursorStart, stop: cursorStop } of vimState.cursors) {
                        if (cursorStart.isEarlierThan(cursorStop)) {
                            cursorRange.push(new vscode.Range(cursorStop.getLeft(), cursorStop));
                        }
                        else {
                            cursorRange.push(new vscode.Range(cursorStop, cursorStop.getRight()));
                        }
                    }
                }
                else {
                    for (const { stop: cursorStop } of vimState.cursors) {
                        cursorRange.push(new vscode.Range(cursorStop, cursorStop.getRight()));
                    }
                }
            }
            this.vimState.editor.setDecorations(decoration_1.decoration.Default, cursorRange);
            // Draw marks
            // I should re-enable this with a config setting at some point
            /*
        
            for (const mark of this.vimState.historyTracker.getMarks()) {
              rangesToDraw.push(new vscode.Range(mark.position, mark.position.getRight()));
            }
        
            */
            // Draw search highlight
            let searchRanges = [];
            if ((configuration_1.configuration.incsearch && this.currentMode.name === mode_1.ModeName.SearchInProgressMode) ||
                (configuration_1.configuration.hlsearch && vimState.globalState.hl && vimState.globalState.searchState)) {
                const searchState = vimState.globalState.searchState;
                searchRanges.push.apply(searchRanges, searchState.matchRanges);
                const { start, end, match } = searchState.getNextSearchMatchRange(vimState.cursorStopPosition);
                if (match) {
                    searchRanges.push(new vscode.Range(start, end));
                }
            }
            this.vimState.editor.setDecorations(decoration_1.decoration.SearchHighlight, searchRanges);
            const easyMotionHighlightRanges = this.currentMode.name === mode_1.ModeName.EasyMotionInputMode
                ? vimState.easyMotion.searchAction
                    .getMatches(vimState.cursorStopPosition, vimState)
                    .map(x => x.toRange())
                : [];
            this.vimState.editor.setDecorations(decoration_1.decoration.EasyMotion, easyMotionHighlightRanges);
            for (let i = 0; i < this.vimState.postponedCodeViewChanges.length; i++) {
                let viewChange = this.vimState.postponedCodeViewChanges[i];
                yield vscode.commands.executeCommand(viewChange.command, viewChange.args);
                vimState.cursors = yield util_1.getCursorsAfterSync();
            }
            this.vimState.postponedCodeViewChanges = [];
            if (this.currentMode.name === mode_1.ModeName.EasyMotionMode) {
                // Update all EasyMotion decorations
                this.vimState.easyMotion.updateDecorations();
            }
            this._renderStatusBar();
            yield vscode_context_1.VsCodeContext.Set('vim.mode', mode_1.ModeName[this.vimState.currentMode]);
        });
    }
    setCurrentMode(modeName) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.vimState.setCurrentMode(modeName);
            for (let mode of this._modes) {
                mode.isActive = mode.name === modeName;
            }
        });
    }
    _renderStatusBar() {
        let text = [];
        if (configuration_1.configuration.showmodename) {
            text.push(this.currentMode.getStatusBarText(this.vimState));
            if (this.vimState.isMultiCursor) {
                text.push(' MULTI CURSOR ');
            }
        }
        if (configuration_1.configuration.showcmd) {
            text.push(this.currentMode.getStatusBarCommandText(this.vimState));
        }
        if (this.vimState.isRecordingMacro) {
            const macroText = 'Recording @' + this.vimState.recordedMacro.registerName;
            text.push(macroText);
        }
        statusBar_1.StatusBar.Set(text.join(' '), this.currentMode.name, this.vimState.isRecordingMacro);
    }
    handleMultipleKeyEvents(keys) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const key of keys) {
                yield this.handleKeyEvent(key);
            }
        });
    }
    // Return true if a new undo point should be created based on brackets and parenthesis
    createUndoPointForBrackets(vimState) {
        // }])> keys all start a new undo state when directly next to an {[(< opening character
        const key = vimState.recordedState.actionKeys[vimState.recordedState.actionKeys.length - 1];
        if (key === undefined) {
            return false;
        }
        if (vimState.currentMode === mode_1.ModeName.Insert) {
            // Check if the keypress is a closing bracket to a corresponding opening bracket right next to it
            let result = matcher_1.PairMatcher.nextPairedChar(vimState.cursorStopPosition, key);
            if (result !== undefined) {
                if (vimState.cursorStopPosition.compareTo(result) === 0) {
                    return true;
                }
            }
            result = matcher_1.PairMatcher.nextPairedChar(vimState.cursorStopPosition.getLeft(), key);
            if (result !== undefined) {
                if (vimState.cursorStopPosition.getLeftByCount(2).compareTo(result) === 0) {
                    return true;
                }
            }
        }
        return false;
    }
    dispose() {
        this._disposables.map(d => d.dispose());
    }
    IsModeWhereCmdVIsOverriden(mode) {
        return mode === mode_1.ModeName.SearchInProgressMode || mode === mode_1.ModeName.CommandlineInProgress;
    }
}
exports.ModeHandler = ModeHandler;

//# sourceMappingURL=modeHandler.js.map
