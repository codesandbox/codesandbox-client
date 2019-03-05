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
const error = require("../../error");
const node = require("../node");
//
//  Implements :quit
//  http://vimdoc.sourceforge.net/htmldoc/editing.html#:quit
//
class QuitCommand extends node.CommandBase {
    constructor(args) {
        super();
        this._name = 'quit';
        this._arguments = args;
    }
    get arguments() {
        return this._arguments;
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.activeTextEditor.document.isDirty && !this.arguments.bang) {
                throw error.VimError.fromCode(error.ErrorCode.E37);
            }
            if (this._arguments.quitAll) {
                yield vscode.commands.executeCommand('workbench.action.closeAllEditors');
            }
            else {
                let oldViewColumn = this.activeTextEditor.viewColumn;
                if (!this.arguments.bang) {
                    yield vscode.commands.executeCommand('workbench.action.closeActiveEditor');
                }
                else {
                    yield vscode.commands.executeCommand('workbench.action.revertAndCloseActiveEditor');
                }
                if (vscode.window.activeTextEditor !== undefined &&
                    vscode.window.activeTextEditor.viewColumn === oldViewColumn) {
                    yield vscode.commands.executeCommand('workbench.action.previousEditor');
                }
            }
        });
    }
}
exports.QuitCommand = QuitCommand;

//# sourceMappingURL=quit.js.map
