"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const vscode_languageserver_types_1 = require("vscode-languageserver-types");
class HoverAsserter {
    constructor(hover, document) {
        this.hover = hover;
        this.document = document;
    }
    hasNothing() {
        const contents = this.hover.contents;
        if (Array.isArray(contents) || typeof contents === 'string') {
            assert(contents.length === 0, 'expect nothing, but get hover: ' + contents);
        }
        else {
        }
    }
    hasHoverAt(label, offset) {
        const contents = this.hover.contents;
        if (Array.isArray(contents) || typeof contents === 'string') {
            assert(contents.length !== 0, 'expect hover, but get nothing');
        }
        else {
            assert(contents.value.length !== 0, 'expect hover, but get nothing');
        }
        const strOrMarked = Array.isArray(contents) ? contents[0] : contents;
        const str = typeof strOrMarked === 'string' ? strOrMarked : strOrMarked.value;
        assert.equal(str, label);
        const hover = this.hover;
        assert.equal(this.document.offsetAt(hover.range.start), offset);
    }
}
exports.HoverAsserter = HoverAsserter;
function hoverDSL(setup) {
    return function test([value]) {
        const offset = value.indexOf('|');
        value = value.substr(0, offset) + value.substr(offset + 1);
        const document = vscode_languageserver_types_1.TextDocument.create(setup.docUri, setup.langId, 0, value);
        const position = document.positionAt(offset);
        const hover = setup.doHover(document, position);
        return new HoverAsserter(hover, document);
    };
}
exports.hoverDSL = hoverDSL;
//# sourceMappingURL=hover-test-util.js.map