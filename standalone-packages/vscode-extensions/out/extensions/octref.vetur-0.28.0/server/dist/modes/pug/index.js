"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPugMode = void 0;
const vscode_languageserver_types_1 = require("vscode-languageserver-types");
const prettier_1 = require("../../utils/prettier");
const paths_1 = require("../../utils/paths");
function getPugMode(workspacePath) {
    let config = {};
    return {
        getId() {
            return 'pug';
        },
        configure(c) {
            config = c;
        },
        format(document, currRange, formattingOptions) {
            if (config.vetur.format.defaultFormatter['pug'] === 'none') {
                return [];
            }
            const { value, range } = getValueAndRange(document, currRange);
            const foo = prettier_1.prettierify(value, paths_1.getFileFsPath(document.uri), workspacePath, range, config.vetur.format, 'pug', false);
            return foo;
        },
        onDocumentRemoved() { },
        dispose() { }
    };
}
exports.getPugMode = getPugMode;
function getValueAndRange(document, currRange) {
    let value = document.getText();
    let range = currRange;
    if (currRange) {
        const startOffset = document.offsetAt(currRange.start);
        const endOffset = document.offsetAt(currRange.end);
        value = value.substring(startOffset, endOffset);
    }
    else {
        range = vscode_languageserver_types_1.Range.create(vscode_languageserver_types_1.Position.create(0, 0), document.positionAt(value.length));
    }
    return { value, range };
}
//# sourceMappingURL=index.js.map