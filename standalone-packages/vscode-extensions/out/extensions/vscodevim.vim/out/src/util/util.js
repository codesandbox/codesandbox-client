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
const position_1 = require("../common/motion/position");
const range_1 = require("../common/motion/range");
const logger_1 = require("./logger");
const child_process_1 = require("child_process");
const AppDirectory = require('appdirectory');
/**
 * This is certainly quite janky! The problem we're trying to solve
 * is that writing editor.selection = new Position() won't immediately
 * update the position of the cursor. So we have to wait!
 */
function waitForCursorSync(timeout = 0, rejectOnTimeout = false) {
    return __awaiter(this, void 0, void 0, function* () {
        yield new Promise((resolve, reject) => {
            let timer = setTimeout(rejectOnTimeout ? reject : resolve, timeout);
            const disposable = vscode.window.onDidChangeTextEditorSelection(x => {
                disposable.dispose();
                clearTimeout(timer);
                resolve();
            });
        });
    });
}
exports.waitForCursorSync = waitForCursorSync;
function getCursorsAfterSync(timeout = 0) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield waitForCursorSync(timeout, true);
        }
        catch (e) {
            logger_1.logger.warn(`getCursorsAfterSync: selection not updated within ${timeout}ms. error=${e}.`);
        }
        return vscode.window.activeTextEditor.selections.map(x => new range_1.Range(position_1.Position.FromVSCodePosition(x.start), position_1.Position.FromVSCodePosition(x.end)));
    });
}
exports.getCursorsAfterSync = getCursorsAfterSync;
function getExtensionDirPath() {
    const dirs = new AppDirectory('VSCodeVim');
    logger_1.logger.debug('VSCodeVim Cache Directory: ' + dirs.userCache());
    return dirs.userCache();
}
exports.getExtensionDirPath = getExtensionDirPath;
/**
 * This function execute a shell command and return the standard output as string.
 */
function executeShell(cmd) {
    return new Promise((resolve, reject) => {
        try {
            child_process_1.exec(cmd, (err, stdout, stderr) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(stdout);
                }
            });
        }
        catch (error) {
            reject(error);
        }
    });
}
exports.executeShell = executeShell;

//# sourceMappingURL=util.js.map
