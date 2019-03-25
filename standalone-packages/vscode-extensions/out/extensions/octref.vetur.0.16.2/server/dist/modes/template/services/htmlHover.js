"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const htmlScanner_1 = require("../parser/htmlScanner");
const vscode_languageserver_types_1 = require("vscode-languageserver-types");
const nullMode_1 = require("../../nullMode");
const TRIVIAL_TOKEN = [htmlScanner_1.TokenType.StartTagOpen, htmlScanner_1.TokenType.EndTagOpen, htmlScanner_1.TokenType.Whitespace];
function doHover(document, position, htmlDocument, tagProviders) {
    const offset = document.offsetAt(position);
    const node = htmlDocument.findNodeAt(offset);
    if (!node || !node.tag) {
        return nullMode_1.NULL_HOVER;
    }
    function getTagHover(tag, range, open) {
        tag = tag.toLowerCase();
        for (const provider of tagProviders) {
            let hover = null;
            provider.collectTags((t, documentation) => {
                if (t === tag) {
                    if (typeof documentation === 'string') {
                        const contents = [documentation ? vscode_languageserver_types_1.MarkedString.fromPlainText(documentation) : ''];
                        hover = { contents, range };
                    }
                    else {
                        const contents = documentation ? documentation : vscode_languageserver_types_1.MarkedString.fromPlainText('');
                        hover = { contents, range };
                    }
                }
            });
            if (hover) {
                return hover;
            }
        }
        return nullMode_1.NULL_HOVER;
    }
    function getAttributeHover(tag, attribute, range) {
        tag = tag.toLowerCase();
        let hover = nullMode_1.NULL_HOVER;
        for (const provider of tagProviders) {
            provider.collectAttributes(tag, (attr, type, documentation) => {
                if (attribute !== attr) {
                    return;
                }
                if (typeof documentation === 'string') {
                    const contents = [documentation ? vscode_languageserver_types_1.MarkedString.fromPlainText(documentation) : ''];
                    hover = { contents, range };
                }
                else {
                    const contents = documentation ? documentation : vscode_languageserver_types_1.MarkedString.fromPlainText('');
                    hover = { contents, range };
                }
            });
        }
        return hover;
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
        return nullMode_1.NULL_HOVER;
    }
    const tagRange = {
        start: document.positionAt(scanner.getTokenOffset()),
        end: document.positionAt(scanner.getTokenEnd())
    };
    switch (token) {
        case htmlScanner_1.TokenType.StartTag:
            return getTagHover(node.tag, tagRange, true);
        case htmlScanner_1.TokenType.EndTag:
            return getTagHover(node.tag, tagRange, false);
        case htmlScanner_1.TokenType.AttributeName:
            // TODO: treat : as special bind
            const attribute = scanner.getTokenText().replace(/^:/, '');
            return getAttributeHover(node.tag, attribute, tagRange);
    }
    return nullMode_1.NULL_HOVER;
}
exports.doHover = doHover;
//# sourceMappingURL=htmlHover.js.map