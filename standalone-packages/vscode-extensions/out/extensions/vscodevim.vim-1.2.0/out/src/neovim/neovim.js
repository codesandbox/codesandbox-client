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
const util = require("util");
const vscode = require("vscode");
const logger_1 = require("../util/logger");
const position_1 = require("./../common/motion/position");
const register_1 = require("../register/register");
const textEditor_1 = require("../textEditor");
const configuration_1 = require("../configuration/configuration");
const path_1 = require("path");
const fs_1 = require("fs");
const child_process_1 = require("child_process");
const neovim_1 = require("neovim");
class NeovimWrapper {
    constructor() {
        this.logger = logger_1.Logger.get('Neovim');
        this.processTimeoutInSeconds = 3;
    }
    run(vimState, command) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.nvim) {
                this.nvim = yield this.startNeovim();
                try {
                    const nvimAttach = this.nvim.uiAttach(80, 20, {
                        ext_cmdline: false,
                        ext_popupmenu: false,
                        ext_tabline: false,
                        ext_wildmenu: false,
                        rgb: false,
                    });
                    const timeout = new Promise((resolve, reject) => {
                        setTimeout(() => reject(new Error('Timeout')), this.processTimeoutInSeconds * 1000);
                    });
                    yield Promise.race([nvimAttach, timeout]);
                }
                catch (e) {
                    configuration_1.configuration.enableNeovim = false;
                    throw new Error(`Failed to attach to neovim process. ${e.message}`);
                }
                const apiInfo = yield this.nvim.apiInfo;
                const version = apiInfo[1].version;
                this.logger.debug(`version: ${version.major}.${version.minor}.${version.patch}`);
            }
            yield this.syncVSToVim(vimState);
            command = (':' + command + '\n').replace('<', '<lt>');
            // Clear the previous error and status messages.
            // API does not allow setVvar so do it manually
            yield this.nvim.command('let v:errmsg="" | let v:statusmsg=""');
            // Execute the command
            this.logger.debug(`Running ${command}.`);
            yield this.nvim.input(command);
            const mode = yield this.nvim.mode;
            if (mode.blocking) {
                yield this.nvim.input('<esc>');
            }
            // Check if an error occurred
            const errMsg = yield this.nvim.getVvar('errmsg');
            let statusBarText = '';
            if (errMsg && errMsg.toString() !== '') {
                statusBarText = errMsg.toString();
            }
            else {
                // Check to see if a status message was updated
                const statusMsg = yield this.nvim.getVvar('statusmsg');
                if (statusMsg && statusMsg.toString() !== '') {
                    statusBarText = statusMsg.toString();
                }
            }
            // Sync buffer back to vscode
            yield this.syncVimToVs(vimState);
            return statusBarText;
        });
    }
    startNeovim() {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.debug('Spawning Neovim process...');
            let dir = path_1.dirname(vscode.window.activeTextEditor.document.uri.fsPath);
            if (!(yield util.promisify(fs_1.exists)(dir))) {
                dir = __dirname;
            }
            this.process = child_process_1.spawn(configuration_1.configuration.neovimPath, ['-u', 'NONE', '-i', 'NONE', '-n', '--embed'], {
                cwd: dir,
            });
            this.process.on('error', err => {
                this.logger.error(`Error spawning neovim. ${err.message}.`);
                configuration_1.configuration.enableNeovim = false;
            });
            return neovim_1.attach({ proc: this.process });
        });
    }
    // Data flows from VS to Vim
    syncVSToVim(vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            const buf = yield this.nvim.buffer;
            if (configuration_1.configuration.expandtab) {
                yield vscode.commands.executeCommand('editor.action.indentationToTabs');
            }
            yield this.nvim.setOption('gdefault', configuration_1.configuration.substituteGlobalFlag === true);
            yield buf.setLines(textEditor_1.TextEditor.getText().split('\n'), {
                start: 0,
                end: -1,
                strictIndexing: true,
            });
            const [rangeStart, rangeEnd] = [
                position_1.Position.EarlierOf(vimState.cursorStopPosition, vimState.cursorStartPosition),
                position_1.Position.LaterOf(vimState.cursorStopPosition, vimState.cursorStartPosition),
            ];
            yield this.nvim.callFunction('setpos', [
                '.',
                [0, vimState.cursorStopPosition.line + 1, vimState.cursorStopPosition.character, false],
            ]);
            yield this.nvim.callFunction('setpos', [
                "'<",
                [0, rangeStart.line + 1, rangeEnd.character, false],
            ]);
            yield this.nvim.callFunction('setpos', [
                "'>",
                [0, rangeEnd.line + 1, rangeEnd.character, false],
            ]);
            for (const mark of vimState.historyTracker.getMarks()) {
                yield this.nvim.callFunction('setpos', [
                    `'${mark.name}`,
                    [0, mark.position.line + 1, mark.position.character, false],
                ]);
            }
            // We only copy over " register for now, due to our weird handling of macros.
            let reg = yield register_1.Register.get(vimState);
            let vsRegTovimReg = [undefined, 'c', 'l', 'b'];
            yield this.nvim.callFunction('setreg', [
                '"',
                reg.text,
                vsRegTovimReg[vimState.effectiveRegisterMode],
            ]);
        });
    }
    // Data flows from Vim to VS
    syncVimToVs(vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            const buf = yield this.nvim.buffer;
            const lines = yield buf.getLines({ start: 0, end: -1, strictIndexing: false });
            // one Windows, lines that went to nvim and back have a '\r' at the end,
            // which causes the issues exhibited in #1914
            const fixedLines = process.platform === 'win32' ? lines.map((line, index) => line.replace(/\r$/, '')) : lines;
            yield textEditor_1.TextEditor.replace(new vscode.Range(0, 0, textEditor_1.TextEditor.getLineCount() - 1, textEditor_1.TextEditor.getLineMaxColumn(textEditor_1.TextEditor.getLineCount() - 1)), fixedLines.join('\n'));
            this.logger.debug(`${lines.length} lines in nvim. ${textEditor_1.TextEditor.getLineCount()} in editor.`);
            let [row, character] = (yield this.nvim.callFunction('getpos', ['.'])).slice(1, 3);
            vimState.editor.selection = new vscode.Selection(new position_1.Position(row - 1, character), new position_1.Position(row - 1, character));
            if (configuration_1.configuration.expandtab) {
                yield vscode.commands.executeCommand('editor.action.indentationToSpaces');
            }
            // We're only syncing back the default register for now, due to the way we could
            // be storing macros in registers.
            const vimRegToVsReg = {
                v: register_1.RegisterMode.CharacterWise,
                V: register_1.RegisterMode.LineWise,
                '\x16': register_1.RegisterMode.BlockWise,
            };
            vimState.currentRegisterMode =
                vimRegToVsReg[(yield this.nvim.callFunction('getregtype', ['"']))];
            register_1.Register.put((yield this.nvim.callFunction('getreg', ['"'])), vimState);
        });
    }
    dispose() {
        if (this.nvim) {
            this.nvim.quit();
        }
        if (this.process) {
            this.process.kill();
        }
    }
}
exports.NeovimWrapper = NeovimWrapper;

//# sourceMappingURL=neovim.js.map
