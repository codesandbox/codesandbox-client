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
const fs = require("fs");
const path = require("path");
const vscode = require("vscode");
const statusBar_1 = require("../../statusBar");
const message_1 = require("../../util/message");
const node = require("../node");
//
//  Implements :write
//  http://vimdoc.sourceforge.net/htmldoc/editing.html#:write
//
class WriteCommand extends node.CommandBase {
    constructor(args) {
        super();
        this._name = 'write';
        this._arguments = args;
    }
    get arguments() {
        return this._arguments;
    }
    execute(vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.arguments.opt) {
                message_1.Message.ShowError('Not implemented.');
                return;
            }
            else if (this.arguments.file) {
                message_1.Message.ShowError('Not implemented.');
                return;
            }
            else if (this.arguments.append) {
                message_1.Message.ShowError('Not implemented.');
                return;
            }
            else if (this.arguments.cmd) {
                message_1.Message.ShowError('Not implemented.');
                return;
            }
            if (vimState.editor.document.isUntitled) {
                yield vscode.commands.executeCommand('workbench.action.files.save');
                return;
            }
            try {
                fs.accessSync(vimState.editor.document.fileName, fs.constants.W_OK);
                return this.save(vimState);
            }
            catch (accessErr) {
                if (this.arguments.bang) {
                    fs.chmod(vimState.editor.document.fileName, 666, e => {
                        if (!e) {
                            return this.save(vimState);
                        }
                        statusBar_1.StatusBar.SetText(e.message, vimState.currentMode, vimState.isRecordingMacro, true, true);
                        return;
                    });
                }
                else {
                    statusBar_1.StatusBar.SetText(accessErr.message, vimState.currentMode, vimState.isRecordingMacro, true, true);
                }
            }
        });
    }
    save(vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            yield vimState.editor.document.save().then(() => {
                let text = '"' +
                    path.basename(vimState.editor.document.fileName) +
                    '" ' +
                    vimState.editor.document.lineCount +
                    'L ' +
                    vimState.editor.document.getText().length +
                    'C written';
                statusBar_1.StatusBar.SetText(text, vimState.currentMode, vimState.isRecordingMacro, true, true);
            }, e => statusBar_1.StatusBar.SetText(e, vimState.currentMode, vimState.isRecordingMacro, true, true));
        });
    }
}
exports.WriteCommand = WriteCommand;

//# sourceMappingURL=write.js.map
