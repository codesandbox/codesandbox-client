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
const position_1 = require("./common/motion/position");
const configuration_1 = require("./configuration/configuration");
class TextEditor {
    // TODO: Refactor args
    /**
     * Verify that a tab is even open for the TextEditor to act upon.
     *
     * This class was designed assuming there will usually be an active editor
     * to act upon, which is usually true with editor hotkeys.
     *
     * But there are cases where an editor won't be active, such as running
     * code on VSCodeVim activation, where you might see the error:
     * > [Extension Host] Here is the error stack:
     * > TypeError: Cannot read property 'document' of undefined
     */
    static get isActive() {
        return vscode.window.activeTextEditor != null;
    }
    /**
     * Do not use this method! It has been deprecated. Use InsertTextTransformation
     * (or possibly InsertTextVSCodeTransformation) instead.
     */
    static insert(text, at = undefined, letVSCodeHandleKeystrokes = undefined) {
        return __awaiter(this, void 0, void 0, function* () {
            // If we insert "blah(" with default:type, VSCode will insert the closing ).
            // We *probably* don't want that to happen if we're inserting a lot of text.
            if (letVSCodeHandleKeystrokes === undefined) {
                letVSCodeHandleKeystrokes = text.length === 1;
            }
            if (!letVSCodeHandleKeystrokes) {
                // const selections = vscode.window.activeTextEditor!.selections.slice(0);
                yield vscode.window.activeTextEditor.edit(editBuilder => {
                    if (!at) {
                        at = position_1.Position.FromVSCodePosition(vscode.window.activeTextEditor.selection.active);
                    }
                    editBuilder.insert(at, text);
                });
                // maintain all selections in multi-cursor mode.
                // vscode.window.activeTextEditor!.selections = selections;
            }
            else {
                yield vscode.commands.executeCommand('default:type', { text });
            }
            return true;
        });
    }
    static insertAt(text, position) {
        return __awaiter(this, void 0, void 0, function* () {
            return vscode.window.activeTextEditor.edit(editBuilder => {
                editBuilder.insert(position, text);
            });
        });
    }
    static delete(range) {
        return __awaiter(this, void 0, void 0, function* () {
            return vscode.window.activeTextEditor.edit(editBuilder => {
                editBuilder.delete(range);
            });
        });
    }
    static getDocumentVersion() {
        return vscode.window.activeTextEditor.document.version;
    }
    static getDocumentName() {
        return vscode.window.activeTextEditor.document.fileName;
    }
    /**
     * Removes all text in the entire document.
     */
    static deleteDocument() {
        return __awaiter(this, void 0, void 0, function* () {
            const start = new vscode.Position(0, 0);
            const lastLine = vscode.window.activeTextEditor.document.lineCount - 1;
            const end = vscode.window.activeTextEditor.document.lineAt(lastLine).range.end;
            const range = new vscode.Range(start, end);
            return vscode.window.activeTextEditor.edit(editBuilder => {
                editBuilder.delete(range);
            });
        });
    }
    /**
     * Do not use this method! It has been deprecated. Use ReplaceTextTransformation.
     * instead.
     */
    static replace(range, text) {
        return __awaiter(this, void 0, void 0, function* () {
            return vscode.window.activeTextEditor.edit(editBuilder => {
                editBuilder.replace(range, text);
            });
        });
    }
    /**
     * This is the correct replace method to use. (Notice how it's not async? Yep)
     */
    static replaceText(vimState, text, start, end, diff = undefined) {
        const trans = {
            type: 'replaceText',
            text,
            start,
            end,
        };
        if (diff) {
            trans.diff = diff;
        }
        vimState.recordedState.transformations.push(trans);
    }
    static readLine() {
        const lineNo = vscode.window.activeTextEditor.selection.active.line;
        return vscode.window.activeTextEditor.document.lineAt(lineNo).text;
    }
    static readLineAt(lineNo) {
        if (lineNo === null) {
            lineNo = vscode.window.activeTextEditor.selection.active.line;
        }
        if (lineNo >= vscode.window.activeTextEditor.document.lineCount) {
            throw new RangeError();
        }
        return vscode.window.activeTextEditor.document.lineAt(lineNo).text;
    }
    static getLineCount() {
        return vscode.window.activeTextEditor.document.lineCount;
    }
    static getLineAt(position) {
        return vscode.window.activeTextEditor.document.lineAt(position);
    }
    static getCharAt(position) {
        const line = TextEditor.getLineAt(position);
        return line.text[position.character];
    }
    static getLineMaxColumn(lineNumber) {
        if (lineNumber < 0 || lineNumber > TextEditor.getLineCount()) {
            throw new Error('Illegal value ' + lineNumber + ' for `lineNumber`');
        }
        return TextEditor.readLineAt(lineNumber).length;
    }
    static getSelection() {
        return vscode.window.activeTextEditor.selection;
    }
    static getText(selection) {
        return vscode.window.activeTextEditor.document.getText(selection);
    }
    /**
     *  Retrieves the current word at position.
     *  If current position is whitespace, selects the right-closest word
     */
    static getWord(position) {
        let start = position;
        let end = position.getRight();
        const char = TextEditor.getText(new vscode.Range(start, end));
        if (this.whitespaceRegExp.test(char)) {
            start = position.getWordRight();
        }
        else {
            start = position.getWordLeft(true);
        }
        end = start.getCurrentWordEnd(true).getRight();
        const word = TextEditor.getText(new vscode.Range(start, end));
        if (this.whitespaceRegExp.test(word)) {
            return undefined;
        }
        return word;
    }
    static isFirstLine(position) {
        return position.line === 0;
    }
    static isLastLine(position) {
        return position.line === vscode.window.activeTextEditor.document.lineCount - 1;
    }
    static getIndentationLevel(line) {
        let tabSize = configuration_1.configuration.tabstop;
        let firstNonWhiteSpace = 0;
        let checkLine = line.match(/^\s*/);
        if (checkLine) {
            firstNonWhiteSpace = checkLine[0].length;
        }
        let visibleColumn = 0;
        if (firstNonWhiteSpace >= 0) {
            for (const char of line.substring(0, firstNonWhiteSpace)) {
                switch (char) {
                    case '\t':
                        visibleColumn += tabSize;
                        break;
                    case ' ':
                        visibleColumn += 1;
                        break;
                    default:
                        break;
                }
            }
        }
        else {
            return -1;
        }
        return visibleColumn;
    }
    static setIndentationLevel(line, screenCharacters) {
        let tabSize = configuration_1.configuration.tabstop;
        let insertTabAsSpaces = configuration_1.configuration.expandtab;
        if (screenCharacters < 0) {
            screenCharacters = 0;
        }
        let indentString = '';
        if (insertTabAsSpaces) {
            indentString += new Array(screenCharacters + 1).join(' ');
        }
        else {
            if (screenCharacters / tabSize > 0) {
                indentString += new Array(Math.floor(screenCharacters / tabSize) + 1).join('\t');
            }
            indentString += new Array((screenCharacters % tabSize) + 1).join(' ');
        }
        let firstNonWhiteSpace = 0;
        let lineCheck = line.match(/^\s*/);
        if (lineCheck) {
            firstNonWhiteSpace = lineCheck[0].length;
        }
        return indentString + line.substring(firstNonWhiteSpace, line.length);
    }
    static getPositionAt(offset) {
        const pos = vscode.window.activeTextEditor.document.positionAt(offset);
        return new position_1.Position(pos.line, pos.character);
    }
    static getOffsetAt(position) {
        return vscode.window.activeTextEditor.document.offsetAt(position);
    }
}
TextEditor.whitespaceRegExp = new RegExp('^ *$');
exports.TextEditor = TextEditor;

//# sourceMappingURL=textEditor.js.map
