"use strict";
const vscode_1 = require('vscode');
const format_1 = require('./format');
function fullDocumentRange(document) {
    const lastLineId = document.lineCount - 1;
    return new vscode_1.Range(0, 0, lastLineId, document.lineAt(lastLineId).text.length);
}
exports.fullDocumentRange = fullDocumentRange;
class PrismaEditProvider {
    constructor(exec_path) {
        this.exec_path = exec_path;
    }
    provideDocumentFormattingEdits(document, options, token) {
        return format_1.default(this.exec_path, options.tabSize, document.getText()).then((formatted) => [vscode_1.TextEdit.replace(fullDocumentRange(document), formatted)]);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PrismaEditProvider;
//# sourceMappingURL=provider.js.map