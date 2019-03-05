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
const token = require("./token");
class LineRange {
    constructor() {
        this.left = [];
        this.right = [];
    }
    addToken(tok) {
        if (tok.type === token.TokenType.Comma) {
            this.separator = tok;
            return;
        }
        if (!this.separator) {
            if (this.left.length > 0) {
                switch (tok.type) {
                    case token.TokenType.Offset:
                    case token.TokenType.Plus:
                    case token.TokenType.Minus:
                        break;
                    default:
                        throw Error('Trailing characters');
                }
            }
            this.left.push(tok);
        }
        else {
            if (this.right.length > 0) {
                switch (tok.type) {
                    case token.TokenType.Offset:
                    case token.TokenType.Plus:
                    case token.TokenType.Minus:
                        break;
                    default:
                        throw Error('Trailing characters');
                }
            }
            this.right.push(tok);
        }
    }
    get isEmpty() {
        return this.left.length === 0 && this.right.length === 0 && !this.separator;
    }
    toString() {
        return this.left.toString() + this.separator.content + this.right.toString();
    }
    execute(document, vimState) {
        if (this.isEmpty) {
            return;
        }
        var lineRef = this.right.length === 0 ? this.left : this.right;
        var pos = this.lineRefToPosition(document, lineRef, vimState);
        vimState.cursorPosition = vimState.cursorPosition.setLocation(pos.line, pos.character);
        vimState.cursorStartPosition = vimState.cursorPosition;
    }
    lineRefToPosition(doc, toks, vimState) {
        let currentLineNum;
        let currentColumn = 0; // only mark does this differently
        let currentOperation = undefined;
        const firstToken = toks[0];
        // handle first-token special cases (e.g. %, inital line number is "." by default)
        switch (firstToken.type) {
            case token.TokenType.Percent:
                return new vscode.Position(doc.document.lineCount - 1, 0);
            case token.TokenType.Dollar:
                currentLineNum = doc.document.lineCount - 1;
                break;
            case token.TokenType.Plus:
            case token.TokenType.Minus:
            case token.TokenType.Dot:
                currentLineNum = doc.selection.active.line;
                // undocumented: if the first token is plus or minus, vim seems to behave as though there was a "."
                currentOperation = firstToken.type === token.TokenType.Dot ? undefined : firstToken.type;
                break;
            case token.TokenType.LineNumber:
                currentLineNum = Number.parseInt(firstToken.content, 10) - 1; // user sees 1-based - everything else is 0-based
                break;
            case token.TokenType.SelectionFirstLine:
                currentLineNum = Math.min.apply(null, doc.selections.map(selection => selection.start.isBeforeOrEqual(selection.end)
                    ? selection.start.line
                    : selection.end.line));
                break;
            case token.TokenType.SelectionLastLine:
                currentLineNum = Math.max.apply(null, doc.selections.map(selection => selection.start.isAfter(selection.end) ? selection.start.line : selection.end.line));
                break;
            case token.TokenType.Mark:
                currentLineNum = vimState.historyTracker.getMark(firstToken.content).position.line;
                currentColumn = vimState.historyTracker.getMark(firstToken.content).position.character;
                break;
            default:
                throw new Error('Not Implemented');
        }
        // now handle subsequent tokens, offsetting the current candidate line number
        for (let tokenIndex = 1; tokenIndex < toks.length; ++tokenIndex) {
            let currentToken = toks[tokenIndex];
            switch (currentOperation) {
                case token.TokenType.Plus:
                    switch (currentToken.type) {
                        case token.TokenType.Minus:
                        case token.TokenType.Plus:
                            // undocumented: when there's two operators in a row, vim behaves as though there's a "1" between them
                            currentLineNum += 1;
                            currentColumn = 0;
                            currentOperation = currentToken.type;
                            break;
                        case token.TokenType.Offset:
                            currentLineNum += Number.parseInt(currentToken.content, 10);
                            currentColumn = 0;
                            currentOperation = undefined;
                            break;
                        default:
                            throw Error('Trailing characters');
                    }
                    break;
                case token.TokenType.Minus:
                    switch (currentToken.type) {
                        case token.TokenType.Minus:
                        case token.TokenType.Plus:
                            // undocumented: when there's two operators in a row, vim behaves as though there's a "1" between them
                            currentLineNum -= 1;
                            currentColumn = 0;
                            currentOperation = currentToken.type;
                            break;
                        case token.TokenType.Offset:
                            currentLineNum -= Number.parseInt(currentToken.content, 10);
                            currentColumn = 0;
                            currentOperation = undefined;
                            break;
                        default:
                            throw Error('Trailing characters');
                    }
                    break;
                case undefined:
                    switch (currentToken.type) {
                        case token.TokenType.Minus:
                        case token.TokenType.Plus:
                            currentOperation = currentToken.type;
                            break;
                        default:
                            throw Error('Trailing characters');
                    }
                    break;
            }
        }
        // undocumented: when there's a trailing operation in the tank without an RHS, vim uses "1"
        switch (currentOperation) {
            case token.TokenType.Plus:
                currentLineNum += 1;
                currentColumn = 0;
                break;
            case token.TokenType.Minus:
                currentLineNum -= 1;
                currentColumn = 0;
                break;
        }
        // finally, make sure current position is in bounds :)
        currentLineNum = Math.max(0, currentLineNum);
        currentLineNum = Math.min(doc.document.lineCount - 1, currentLineNum);
        return new vscode.Position(currentLineNum, currentColumn);
    }
}
exports.LineRange = LineRange;
class CommandLine {
    constructor() {
        this.range = new LineRange();
    }
    get isEmpty() {
        return this.range.isEmpty && !this.command;
    }
    toString() {
        return ':' + this.range.toString() + ' ' + this.command.toString();
    }
    execute(document, vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.command) {
                this.range.execute(document, vimState);
                return;
            }
            if (this.range.isEmpty) {
                yield this.command.execute(vimState);
            }
            else {
                yield this.command.executeWithRange(vimState, this.range);
            }
        });
    }
}
exports.CommandLine = CommandLine;
class CommandBase {
    constructor() {
        this.neovimCapable = false;
    }
    get activeTextEditor() {
        return vscode.window.activeTextEditor;
    }
    get name() {
        return this._name;
    }
    get arguments() {
        return this._arguments;
    }
    executeWithRange(vimState, range) {
        throw new Error('Not implemented!');
    }
}
exports.CommandBase = CommandBase;

//# sourceMappingURL=node.js.map
