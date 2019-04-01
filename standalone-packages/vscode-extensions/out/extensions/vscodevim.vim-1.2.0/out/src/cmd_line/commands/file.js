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
const node = require("../node");
const path = require("path");
const util = require("util");
const vscode = require("vscode");
const untildify = require("untildify");
const logger_1 = require("../../util/logger");
const doesFileExist = util.promisify(fs.exists);
var FilePosition;
(function (FilePosition) {
    FilePosition[FilePosition["NewWindowVerticalSplit"] = 0] = "NewWindowVerticalSplit";
    FilePosition[FilePosition["NewWindowHorizontalSplit"] = 1] = "NewWindowHorizontalSplit";
})(FilePosition = exports.FilePosition || (exports.FilePosition = {}));
class FileCommand extends node.CommandBase {
    constructor(args) {
        super();
        this._logger = logger_1.Logger.get('File');
        this._name = 'file';
        this._arguments = args;
        if (this.arguments.name) {
            this._arguments.name = untildify(this.arguments.name);
        }
    }
    get arguments() {
        return this._arguments;
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._arguments.bang) {
                yield vscode.commands.executeCommand('workbench.action.files.revert');
                return;
            }
            // Need to do this before the split since it loses the activeTextEditor
            let editorFilePath = vscode.window.activeTextEditor.document.uri.fsPath;
            // Do the split if requested
            let split = false;
            if (this._arguments.position === FilePosition.NewWindowVerticalSplit) {
                yield vscode.commands.executeCommand('workbench.action.splitEditorRight');
                split = true;
            }
            if (this._arguments.position === FilePosition.NewWindowHorizontalSplit) {
                yield vscode.commands.executeCommand('workbench.action.splitEditorDown');
                split = true;
            }
            let hidePreviousEditor = function () {
                return __awaiter(this, void 0, void 0, function* () {
                    if (split === true) {
                        yield vscode.commands.executeCommand('workbench.action.previousEditor');
                        yield vscode.commands.executeCommand('workbench.action.closeActiveEditor');
                    }
                });
            };
            // No name was specified
            if (this._arguments.name === undefined) {
                if (this._arguments.createFileIfNotExists === true) {
                    yield vscode.commands.executeCommand('workbench.action.files.newUntitledFile');
                    yield hidePreviousEditor();
                }
                return;
            }
            let filePath = '';
            // Using the empty string will request to open a file
            if (this._arguments.name === '') {
                // No name on split is fine and just return
                if (split === true) {
                    return;
                }
                const fileList = yield vscode.window.showOpenDialog({});
                if (fileList) {
                    filePath = fileList[0].fsPath;
                }
            }
            else {
                // Using a filename, open or create the file
                this._arguments.name = this._arguments.name.replace(/^file:\/\//, '');
                filePath = path.isAbsolute(this._arguments.name)
                    ? path.normalize(this._arguments.name)
                    : path.join(path.dirname(editorFilePath), this._arguments.name);
                if (filePath !== editorFilePath) {
                    let fileExists = yield doesFileExist(filePath);
                    if (!fileExists) {
                        // if file does not exist
                        // try to find it with the same extension as the current file
                        const pathWithExt = filePath + path.extname(editorFilePath);
                        fileExists = yield doesFileExist(pathWithExt);
                        if (fileExists) {
                            filePath = pathWithExt;
                        }
                    }
                    if (!fileExists) {
                        if (this._arguments.createFileIfNotExists) {
                            yield util.promisify(fs.close)(yield util.promisify(fs.open)(filePath, 'w'));
                        }
                        else {
                            this._logger.error(`${filePath} does not exist.`);
                            return;
                        }
                    }
                }
            }
            const doc = yield vscode.workspace.openTextDocument(filePath);
            vscode.window.showTextDocument(doc);
            if (this.arguments.lineNumber) {
                vscode.window.activeTextEditor.revealRange(new vscode.Range(new vscode.Position(this.arguments.lineNumber, 0), new vscode.Position(this.arguments.lineNumber, 0)));
            }
            yield hidePreviousEditor();
        });
    }
}
exports.FileCommand = FileCommand;

//# sourceMappingURL=file.js.map
