"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findDocumentHighlights = void 0;
const htmlScanner_1 = require("../parser/htmlScanner");
const vscode_languageserver_types_1 = require("vscode-languageserver-types");
function findDocumentHighlights(document, position, htmlDocument) {
    const offset = document.offsetAt(position);
    const node = htmlDocument.findNodeAt(offset);
    if (!node.tag) {
        return [];
    }
    const result = [];
    const startTagRange = getTagNameRange(htmlScanner_1.TokenType.StartTag, document, node.start);
    const endTagRange = typeof node.endTagStart === 'number' && getTagNameRange(htmlScanner_1.TokenType.EndTag, document, node.endTagStart);
    if ((startTagRange && covers(startTagRange, position)) || (endTagRange && covers(endTagRange, position))) {
        if (startTagRange) {
            result.push({ kind: vscode_languageserver_types_1.DocumentHighlightKind.Read, range: startTagRange });
        }
        if (endTagRange) {
            result.push({ kind: vscode_languageserver_types_1.DocumentHighlightKind.Read, range: endTagRange });
        }
    }
    return result;
}
exports.findDocumentHighlights = findDocumentHighlights;
function isBeforeOrEqual(pos1, pos2) {
    return pos1.line < pos2.line || (pos1.line === pos2.line && pos1.character <= pos2.character);
}
function covers(range, position) {
    return isBeforeOrEqual(range.start, position) && isBeforeOrEqual(position, range.end);
}
function getTagNameRange(tokenType, document, startOffset) {
    const scanner = htmlScanner_1.createScanner(document.getText(), startOffset);
    let token = scanner.scan();
    while (token !== htmlScanner_1.TokenType.EOS && token !== tokenType) {
        token = scanner.scan();
    }
    if (token !== htmlScanner_1.TokenType.EOS) {
        return { start: document.positionAt(scanner.getTokenOffset()), end: document.positionAt(scanner.getTokenEnd()) };
    }
    return null;
}
//# sourceMappingURL=htmlHighlighting.js.map