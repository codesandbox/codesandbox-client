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
//  Implements :close
//  http://vimdoc.sourceforge.net/htmldoc/windows.html#:close
//
class CloseCommand extends node.CommandBase {
    constructor(args) {
        super();
        this._name = 'close';
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
            if (vscode.window.visibleTextEditors.length === 1) {
                throw error.VimError.fromCode(error.ErrorCode.E444);
            }
            let oldViewColumn = this.activeTextEditor.viewColumn;
            yield vscode.commands.executeCommand('workbench.action.closeActiveEditor');
            if (vscode.window.activeTextEditor !== undefined &&
                vscode.window.activeTextEditor.viewColumn === oldViewColumn) {
                yield vscode.commands.executeCommand('workbench.action.previousEditor');
            }
        });
    }
}
exports.CloseCommand = CloseCommand;

//# sourceMappingURL=close.js.map
