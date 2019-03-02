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
const path = require("path");
const vscode = require("vscode");
const node = require("../node");
var Tab;
(function (Tab) {
    Tab[Tab["Next"] = 0] = "Next";
    Tab[Tab["Previous"] = 1] = "Previous";
    Tab[Tab["First"] = 2] = "First";
    Tab[Tab["Last"] = 3] = "Last";
    Tab[Tab["Absolute"] = 4] = "Absolute";
    Tab[Tab["New"] = 5] = "New";
    Tab[Tab["Close"] = 6] = "Close";
    Tab[Tab["Only"] = 7] = "Only";
    Tab[Tab["Move"] = 8] = "Move";
})(Tab = exports.Tab || (exports.Tab = {}));
//
//  Implements tab
//  http://vimdoc.sourceforge.net/htmldoc/tabpage.html
//
class TabCommand extends node.CommandBase {
    constructor(args) {
        super();
        this._name = 'tab';
        this._arguments = args;
    }
    get arguments() {
        return this._arguments;
    }
    executeCommandWithCount(count, command) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < count; i++) {
                yield vscode.commands.executeCommand(command);
            }
        });
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            switch (this._arguments.tab) {
                case Tab.Absolute:
                    if (this._arguments.count !== undefined && this._arguments.count >= 0) {
                        yield vscode.commands.executeCommand('workbench.action.openEditorAtIndex', this._arguments.count);
                    }
                    break;
                case Tab.Next:
                    if (this._arguments.count !== undefined && this._arguments.count <= 0) {
                        break;
                    }
                    yield this.executeCommandWithCount(this._arguments.count || 1, 'workbench.action.nextEditorInGroup');
                    break;
                case Tab.Previous:
                    if (this._arguments.count !== undefined && this._arguments.count <= 0) {
                        break;
                    }
                    yield this.executeCommandWithCount(this._arguments.count || 1, 'workbench.action.previousEditorInGroup');
                    break;
                case Tab.First:
                    yield vscode.commands.executeCommand('workbench.action.openEditorAtIndex1');
                    break;
                case Tab.Last:
                    yield vscode.commands.executeCommand('workbench.action.lastEditorInGroup');
                    break;
                case Tab.New: {
                    const hasFile = !(this.arguments.file === undefined || this.arguments.file === '');
                    if (hasFile) {
                        const isAbsolute = path.isAbsolute(this.arguments.file);
                        const isInWorkspace = vscode.workspace.workspaceFolders !== undefined &&
                            vscode.workspace.workspaceFolders.length > 0;
                        const currentFilePath = vscode.window.activeTextEditor.document.uri.fsPath;
                        let toOpenPath;
                        if (isAbsolute) {
                            toOpenPath = this.arguments.file;
                        }
                        else if (isInWorkspace) {
                            const workspacePath = vscode.workspace.workspaceFolders[0].uri.path;
                            toOpenPath = path.join(workspacePath, this.arguments.file);
                        }
                        else {
                            toOpenPath = path.join(path.dirname(currentFilePath), this.arguments.file);
                        }
                        if (toOpenPath !== currentFilePath) {
                            yield vscode.commands.executeCommand('vscode.open', vscode.Uri.file(toOpenPath));
                        }
                    }
                    else {
                        yield vscode.commands.executeCommand('workbench.action.files.newUntitledFile');
                    }
                    break;
                }
                case Tab.Close:
                    // Navigate the correct position
                    if (this._arguments.count === undefined) {
                        yield vscode.commands.executeCommand('workbench.action.closeActiveEditor');
                        break;
                    }
                    if (this._arguments.count === 0) {
                        // Wrong paramter
                        break;
                    }
                    // TODO: Close Page {count}. Page count is one-based.
                    break;
                case Tab.Only:
                    yield vscode.commands.executeCommand('workbench.action.closeOtherEditors');
                    break;
                case Tab.Move:
                    if (this.arguments.count === 0) {
                        yield vscode.commands.executeCommand('moveActiveEditor', { to: 'first' });
                    }
                    else if (this.arguments.count === undefined) {
                        yield vscode.commands.executeCommand('moveActiveEditor', { to: 'last' });
                    }
                    else {
                        yield vscode.commands.executeCommand('moveActiveEditor', {
                            to: 'position',
                            by: 'tab',
                            value: this.arguments.count + 1,
                        });
                    }
                    break;
                default:
                    break;
            }
        });
    }
}
exports.TabCommand = TabCommand;

//# sourceMappingURL=tab.js.map
