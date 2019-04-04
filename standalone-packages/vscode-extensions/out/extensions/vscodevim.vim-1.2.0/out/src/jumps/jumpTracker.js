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
const fs_1 = require("fs");
const util = require("util");
const vscode = require("vscode");
const file_1 = require("./../cmd_line/commands/file");
const position_1 = require("./../common/motion/position");
const jump_1 = require("./jump");
const util_1 = require("../util/util");
/**
 * JumpTracker is a handrolled version of vscode's TextEditorState
 * in relation to the 'workbench.action.navigateBack' command.
 */
class JumpTracker {
    constructor() {
        this._jumps = [];
        this._currentJumpNumber = 0;
        /**
         * When receiving vscode.window.onDidChangeActiveTextEditor messages,
         * don't record the jump if we initiated the command.
         *
         * Either the jump was added, or it was traversing jump history
         * and shouldn't count as a new jump.
         */
        this.isJumpingThroughHistory = false;
    }
    /**
     * All recorded jumps, in the order of occurrence.
     */
    get jumps() {
        return this._jumps;
    }
    /**
     * Current position in the list of jumps.
     * This will be past last index if not traveling through history.
     */
    get currentJumpNumber() {
        return this._currentJumpNumber;
    }
    /**
     * Current jump in the list of jumps.
     */
    get currentJump() {
        return this._jumps[this._currentJumpNumber] || null;
    }
    /**
     * Current jump in the list of jumps.
     */
    get hasJumps() {
        return this._jumps.length > 0;
    }
    /**
     * Last jump in list of jumps.
     */
    get end() {
        return this._jumps[this._jumps.length - 1];
    }
    /**
     * First jump in list of jumps.
     */
    get start() {
        return this._jumps[0];
    }
    /**
     * Record that a jump occurred.
     *
     * If the current position is back in history,
     * jumps after this position will be removed.
     *
     * @param from - File/position jumped from
     * @param to - File/position jumped to
     */
    recordJump(from, to) {
        if (from && to && from.isSamePosition(to)) {
            return;
        }
        this.pushJump(from, to);
    }
    /**
     * Record that a jump occurred from one file to another.
     * This is likely only needed on a handler for
     * vscode.window.onDidChangeActiveTextEditor.
     *
     * File jumps have extra checks in place, keeping in mind
     * whether this plugin initiated the jump, whether the new file is
     * a legitimate file.
     *
     * @param from - File/position jumped from
     * @param to - File/position jumped to
     */
    handleFileJump(from, to) {
        if (this.isJumpingThroughHistory) {
            this.isJumpingThroughHistory = false;
            return;
        }
        if (to.editor && to.editor.document && to.editor.document.isClosed) {
            // Wallaby.js seemed to be adding an extra file jump, named e.g. extension-output-#4
            // It was marked closed when jumping to it. Hopefully we can rely on checking isClosed
            // when extensions get all weird on us.
            return;
        }
        this.pushJump(from, to);
    }
    performFileJump(jump, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            this.isJumpingThroughHistory = true;
            if (jump.editor) {
                // Open jump file from stored editor
                yield vscode.window.showTextDocument(jump.editor.document);
            }
            else if (yield util.promisify(fs_1.exists)(jump.fileName)) {
                // Open jump file from disk
                yield new file_1.FileCommand({
                    name: jump.fileName,
                    lineNumber: jump.position.line,
                    createFileIfNotExists: false,
                }).execute();
            }
            else {
                // Get jump file from visible editors
                const editor = vscode.window.visibleTextEditors.filter(e => e.document.fileName === jump.fileName)[0];
                if (editor) {
                    yield vscode.window.showTextDocument(editor.document, jump.position.character, false);
                }
            }
            return vimState;
        });
    }
    /**
     * Jump forward, possibly resulting in a file jump
     */
    jumpForward(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.jumpThroughHistory(this.recordJumpForward.bind(this), position, vimState);
        });
    }
    /**
     * Jump back, possibly resulting in a file jump
     */
    jumpBack(position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.jumpThroughHistory(this.recordJumpBack.bind(this), position, vimState);
        });
    }
    jumpThroughHistory(getJump, position, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!vimState) {
                // Disposed? Don't attempt anything, but return whatever falsy value was given.
                return vimState;
            }
            let jump = new jump_1.Jump({
                editor: vimState.editor,
                fileName: vimState.editor.document.fileName,
                position,
            });
            const iterations = vimState.recordedState.count || 1;
            for (var i = 0; i < iterations; i++) {
                jump = getJump(jump_1.Jump.fromStateNow(vimState));
            }
            if (!jump) {
                return vimState;
            }
            const jumpedFiles = jump.fileName !== vimState.editor.document.fileName;
            if (jumpedFiles) {
                yield this.performFileJump(jump, vimState);
                vimState.cursors = yield util_1.getCursorsAfterSync();
            }
            else {
                vimState.cursorStopPosition = jump.position;
            }
            return vimState;
        });
    }
    /**
     * Get the previous jump in history.
     * Continues further back if the current line is on the same line.
     *
     * @param from - File/position jumped from
     */
    recordJumpBack(from) {
        if (!this.hasJumps) {
            return from;
        }
        if (this._currentJumpNumber <= 0) {
            return this._jumps[0];
        }
        const to = this._jumps[this._currentJumpNumber - 1];
        if (this._currentJumpNumber === this._jumps.length) {
            this.recordJump(from, to);
            this._currentJumpNumber = this._currentJumpNumber - 2;
        }
        else {
            this._currentJumpNumber = this._currentJumpNumber - 1;
        }
        return to;
    }
    /**
     * Get the next jump in history.
     * Continues further ahead if the current line is on the same line.
     *
     * @param from - File/position jumped from
     */
    recordJumpForward(from) {
        if (!this.hasJumps) {
            return from;
        }
        if (this._currentJumpNumber >= this._jumps.length) {
            return from;
        }
        this._currentJumpNumber = Math.min(this._currentJumpNumber + 1, this._jumps.length - 1);
        const jump = this._jumps[this._currentJumpNumber];
        return jump;
    }
    /**
     * Update existing jumps when lines were added to a document.
     *
     * @param document - Document that was changed, typically a vscode.TextDocument.
     * @param range - Location where the text was added.
     * @param text - Text containing one or more newline characters.
     */
    handleTextAdded(document, range, text) {
        // Get distance from newlines in the text added.
        // Unlike handleTextDeleted, the range parameter distance between start/end is generally zero,
        // just showing where the text was added.
        const distance = text.split('').filter(c => c === '\n').length;
        this._jumps.forEach((jump, i) => {
            const jumpIsAfterAddedText = jump.fileName === document.fileName && jump.position.line > range.start.line;
            if (jumpIsAfterAddedText) {
                const newPosition = new position_1.Position(jump.position.line + distance, jump.position.character);
                this.changePositionForJumpNumber(i, jump, newPosition);
            }
        });
    }
    /**
     * Update existing jumps when lines were removed from a document.
     *
     * Vim doesn't actually remove deleted lines. Instead, it seems to shift line numbers down
     * for any jumps after the deleted text, and preserves position for jumps on deleted lines or
     * lines above the deleted lines. After lines are shifted, if there are multiple jumps on a line,
     * the duplicates are removed, preserving the newest jumps (preserving latest column number).
     *
     * Lines are shifted based on number of lines deleted before the jump. So if e.g. the jump is on
     * a middle line #6, where the jump above and below it were also deleted, the jump position would
     * move down just one so it is now line #5, based on the line above it being deleted.
     *
     * @param document - Document that was changed, typically a vscode.TextDocument.
     * @param range - Location where the text was removed.
     */
    handleTextDeleted(document, range) {
        // Note that this is like Array.slice, such that range.end.line is one line AFTER a deleted line,
        // so distance is expected to be at least 1.
        const distance = range.end.line - range.start.line;
        for (let i = this._jumps.length - 1; i >= 0; i--) {
            const jump = this._jumps[i];
            if (jump.fileName !== document.fileName) {
                continue;
            }
            const jumpIsAfterDeletedText = jump.position.line > range.start.line;
            if (jumpIsAfterDeletedText) {
                const newLineShiftedUp = jump.position.line - Math.min(jump.position.line - range.start.line, distance);
                const newPosition = new position_1.Position(newLineShiftedUp, jump.position.character);
                this.changePositionForJumpNumber(i, jump, newPosition);
            }
        }
        this.removeDuplicateJumps();
    }
    /**
     * Clear existing jumps and reset jump position.
     */
    clearJumps() {
        this._jumps.splice(0, this._jumps.length);
        this._currentJumpNumber = 0;
    }
    pushJump(from, to) {
        if (from) {
            this.clearJumpsOnSamePosition(from);
        }
        if (from && !from.isSamePosition(to)) {
            this._jumps.push(from);
        }
        this._currentJumpNumber = this._jumps.length;
        this.clearOldJumps();
    }
    removeJump(index) {
        this._jumps.splice(index, 1);
    }
    changePositionForJumpNumber(index, jump, newPosition) {
        this._jumps.splice(index, 1, new jump_1.Jump({
            editor: jump.editor,
            fileName: jump.fileName,
            position: newPosition,
        }));
    }
    clearOldJumps() {
        if (this._jumps.length > 100) {
            this._jumps.splice(0, this._jumps.length - 100);
        }
    }
    clearJumpsOnSamePosition(jump) {
        this._jumps = this._jumps.filter(j => j === jump || !j.isSamePosition(jump));
    }
    removeDuplicateJumps() {
        const linesSeenPerFile = {};
        for (let i = this._jumps.length - 1; i >= 0; i--) {
            const jump = this._jumps[i];
            if (!linesSeenPerFile[jump.fileName]) {
                linesSeenPerFile[jump.fileName] = [];
            }
            if (linesSeenPerFile[jump.fileName].indexOf(jump.position.line) >= 0) {
                this._jumps.splice(i, 1);
            }
            else {
                linesSeenPerFile[jump.fileName].push(jump.position.line);
            }
        }
    }
}
exports.JumpTracker = JumpTracker;

//# sourceMappingURL=jumpTracker.js.map
