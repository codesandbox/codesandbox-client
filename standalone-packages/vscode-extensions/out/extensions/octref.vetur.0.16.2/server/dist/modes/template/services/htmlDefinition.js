"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const htmlScanner_1 = require("../parser/htmlScanner");
const vscode_languageserver_types_1 = require("vscode-languageserver-types");
const vscode_uri_1 = require("vscode-uri");
const TRIVIAL_TOKEN = [htmlScanner_1.TokenType.StartTagOpen, htmlScanner_1.TokenType.EndTagOpen, htmlScanner_1.TokenType.Whitespace];
function findDefinition(document, position, htmlDocument, vueFileInfo) {
    const offset = document.offsetAt(position);
    const node = htmlDocument.findNodeAt(offset);
    if (!node || !node.tag) {
        return [];
    }
    function getTagDefinition(tag, range, open) {
        tag = tag.toLowerCase();
        if (vueFileInfo && vueFileInfo.componentInfo.childComponents) {
            for (const cc of vueFileInfo.componentInfo.childComponents) {
                if (tag === cc.name) {
                    if (cc.definition) {
                        const loc = {
                            uri: vscode_uri_1.default.file(cc.definition.path).toString(),
                            // Todo: Resolve actual default export range
                            range: vscode_languageserver_types_1.Range.create(0, 0, 0, 0)
                        };
                        return loc;
                    }
                }
            }
        }
        return [];
    }
    const inEndTag = node.endTagStart && offset >= node.endTagStart; // <html></ht|ml>
    const startOffset = inEndTag ? node.endTagStart : node.start;
    const scanner = htmlScanner_1.createScanner(document.getText(), startOffset);
    let token = scanner.scan();
    function shouldAdvance() {
        if (token === htmlScanner_1.TokenType.EOS) {
            return false;
        }
        const tokenEnd = scanner.getTokenEnd();
        if (tokenEnd < offset) {
            return true;
        }
        if (tokenEnd === offset) {
            return TRIVIAL_TOKEN.includes(token);
        }
        return false;
    }
    while (shouldAdvance()) {
        token = scanner.scan();
    }
    if (offset > scanner.getTokenEnd()) {
        return [];
    }
    const tagRange = {
        start: document.positionAt(scanner.getTokenOffset()),
        end: document.positionAt(scanner.getTokenEnd())
    };
    switch (token) {
        case htmlScanner_1.TokenType.StartTag:
            return getTagDefinition(node.tag, tagRange, true);
        case htmlScanner_1.TokenType.EndTag:
            return getTagDefinition(node.tag, tagRange, false);
    }
    return [];
}
exports.findDefinition = findDefinition;
//# sourceMappingURL=htmlDefinition.js.map