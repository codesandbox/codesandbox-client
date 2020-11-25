'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const hlslGlobals = require("./hlslGlobals");
const _NL = '\n'.charCodeAt(0);
const _TAB = '\t'.charCodeAt(0);
const _WSB = ' '.charCodeAt(0);
const _LBracket = '['.charCodeAt(0);
const _RBracket = ']'.charCodeAt(0);
const _LCurly = '{'.charCodeAt(0);
const _RCurly = '}'.charCodeAt(0);
const _LParent = '('.charCodeAt(0);
const _RParent = ')'.charCodeAt(0);
const _Comma = ','.charCodeAt(0);
const _Quote = '\''.charCodeAt(0);
const _DQuote = '"'.charCodeAt(0);
const _USC = '_'.charCodeAt(0);
const _a = 'a'.charCodeAt(0);
const _z = 'z'.charCodeAt(0);
const _A = 'A'.charCodeAt(0);
const _Z = 'Z'.charCodeAt(0);
const _0 = '0'.charCodeAt(0);
const _9 = '9'.charCodeAt(0);
const BOF = 0;
class BackwardIterator {
    constructor(model, offset, lineNumber) {
        this.lineNumber = lineNumber;
        this.offset = offset;
        this.line = model.lineAt(this.lineNumber).text;
        this.model = model;
    }
    hasNext() {
        return this.lineNumber >= 0;
    }
    next() {
        if (this.offset < 0) {
            if (this.lineNumber > 0) {
                this.lineNumber--;
                this.line = this.model.lineAt(this.lineNumber).text;
                this.offset = this.line.length - 1;
                return _NL;
            }
            this.lineNumber = -1;
            return BOF;
        }
        let ch = this.line.charCodeAt(this.offset);
        this.offset--;
        return ch;
    }
}
class HLSLSignatureHelperProvider {
    provideSignatureHelp(document, position, token) {
        let enable = vscode_1.workspace.getConfiguration('hlsl').get('suggest.basic', true);
        if (!enable) {
            return null;
        }
        let iterator = new BackwardIterator(document, position.character - 1, position.line);
        let paramCount = this.readArguments(iterator);
        if (paramCount < 0) {
            return null;
        }
        let ident = this.readIdent(iterator);
        if (!ident) {
            return null;
        }
        let entry = hlslGlobals.intrinsicfunctions[ident];
        if (!entry) {
            return null;
        }
        let infos = [];
        let signature = ident;
        signature += '(';
        if (entry.parameters && entry.parameters.length != 0) {
            let params = '';
            entry.parameters.forEach(p => {
                params += p.label + ',';
                infos.push({ label: p.label, documentation: p.documentation });
            });
            signature += params.slice(0, -1);
        }
        else {
            signature += 'void';
        }
        signature += ')';
        let signatureInfo = new vscode_1.SignatureInformation(signature, entry.description);
        signatureInfo.parameters = infos;
        let ret = new vscode_1.SignatureHelp();
        ret.signatures.push(signatureInfo);
        ret.activeSignature = 0;
        ret.activeParameter = Math.min(paramCount, signatureInfo.parameters.length - 1);
        return Promise.resolve(ret);
    }
    readArguments(iterator) {
        let parentNesting = 0;
        let bracketNesting = 0;
        let curlyNesting = 0;
        let paramCount = 0;
        while (iterator.hasNext()) {
            let ch = iterator.next();
            switch (ch) {
                case _LParent:
                    parentNesting--;
                    if (parentNesting < 0) {
                        return paramCount;
                    }
                    break;
                case _RParent:
                    parentNesting++;
                    break;
                case _LCurly:
                    curlyNesting--;
                    break;
                case _RCurly:
                    curlyNesting++;
                    break;
                case _LBracket:
                    bracketNesting--;
                    break;
                case _RBracket:
                    bracketNesting++;
                    break;
                case _DQuote:
                case _Quote:
                    while (iterator.hasNext() && ch !== iterator.next()) {
                        // find the closing quote or double quote
                    }
                    break;
                case _Comma:
                    if (!parentNesting && !bracketNesting && !curlyNesting) {
                        paramCount++;
                    }
                    break;
            }
        }
        return -1;
    }
    isIdentPart(ch) {
        if (ch === _USC || // _
            ch >= _a && ch <= _z || // a-z
            ch >= _A && ch <= _Z || // A-Z
            ch >= _0 && ch <= _9 || // 0/9
            ch >= 0x80 && ch <= 0xFFFF) {
            return true;
        }
        return false;
    }
    readIdent(iterator) {
        let identStarted = false;
        let ident = '';
        while (iterator.hasNext()) {
            let ch = iterator.next();
            if (!identStarted && (ch === _WSB || ch === _TAB || ch === _NL)) {
                continue;
            }
            if (this.isIdentPart(ch)) {
                identStarted = true;
                ident = String.fromCharCode(ch) + ident;
            }
            else if (identStarted) {
                return ident;
            }
        }
        return ident;
    }
}
exports.default = HLSLSignatureHelperProvider;
//# sourceMappingURL=signatureProvider.js.map