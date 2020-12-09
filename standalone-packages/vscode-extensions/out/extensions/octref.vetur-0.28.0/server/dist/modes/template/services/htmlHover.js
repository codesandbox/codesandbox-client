"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doHover = void 0;
const htmlScanner_1 = require("../parser/htmlScanner");
const nullMode_1 = require("../../nullMode");
const strings_1 = require("../../../utils/strings");
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
                if (t !== tag) {
                    return;
                }
                hover = { contents: strings_1.toMarkupContent(documentation), range };
            });
            if (hover) {
                return hover;
            }
        }
        return nullMode_1.NULL_HOVER;
    }
    function getAttributeHover(tag, attribute, range) {
        for (const provider of tagProviders) {
            let hover = null;
            provider.collectAttributes(tag, (attr, type, documentation) => {
                if (attribute !== attr) {
                    return;
                }
                hover = { contents: strings_1.toMarkupContent(documentation), range };
            });
            if (hover) {
                return hover;
            }
        }
        return nullMode_1.NULL_HOVER;
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