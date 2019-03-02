"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const vscode_languageserver_types_1 = require("vscode-languageserver-types");
function testDSL(setup) {
    return function test([value]) {
        const offset = value.indexOf('|');
        value = value.substr(0, offset) + value.substr(offset + 1);
        const document = vscode_languageserver_types_1.TextDocument.create(setup.docUri, setup.langId, 0, value);
        const position = document.positionAt(offset);
        const items = setup.doComplete(document, position).items;
        return new CompletionAsserter(items, document);
    };
}
exports.testDSL = testDSL;
class CompletionAsserter {
    constructor(items, doc) {
        this.items = items;
        this.doc = doc;
    }
    count(expect) {
        const actual = this.items.length;
        assert.equal(actual, expect, `Expect completions has length: ${expect}, actual: ${actual}`);
        return this;
    }
    has(label) {
        const items = this.items;
        const matches = items.filter(completion => completion.label === label);
        assert.equal(matches.length, 1, label + ' should only existing once: Actual: ' + items.map(c => c.label).join(', '));
        this.lastMatch = matches[0];
        return this;
    }
    withDoc(doc) {
        assert.equal(this.lastMatch.documentation, doc);
        return this;
    }
    withKind(kind) {
        assert.equal(this.lastMatch.kind, kind);
        return this;
    }
    become(resultText) {
        assert.equal(applyEdits(this.doc, [this.lastMatch.textEdit]), resultText);
        return this;
    }
    hasNo(label) {
        this.lastMatch = undefined;
        const items = this.items;
        const matches = items.filter(completion => completion.label === label);
        assert.equal(matches.length, 0, label + ' should not exist. Actual: ' + items.map(c => c.label).join(', '));
        return this;
    }
}
exports.CompletionAsserter = CompletionAsserter;
function applyEdits(document, edits) {
    let text = document.getText();
    const sortedEdits = edits.sort((a, b) => document.offsetAt(b.range.start) - document.offsetAt(a.range.start));
    let lastOffset = text.length;
    sortedEdits.forEach(e => {
        const startOffset = document.offsetAt(e.range.start);
        const endOffset = document.offsetAt(e.range.end);
        assert.ok(startOffset <= endOffset);
        assert.ok(endOffset <= lastOffset);
        text = text.substring(0, startOffset) + e.newText + text.substring(endOffset, text.length);
        lastOffset = startOffset;
    });
    return text;
}
//# sourceMappingURL=completion-test-util.js.map