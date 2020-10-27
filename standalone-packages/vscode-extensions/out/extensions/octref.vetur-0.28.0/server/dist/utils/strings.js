"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toMarkupContent = exports.indentSection = exports.removeQuotes = exports.getWordAtText = void 0;
const vscode_languageserver_1 = require("vscode-languageserver");
function getWordAtText(text, offset, wordDefinition) {
    let lineStart = offset;
    while (lineStart > 0 && !isNewlineCharacter(text.charCodeAt(lineStart - 1))) {
        lineStart--;
    }
    const offsetInLine = offset - lineStart;
    const lineText = text.substr(lineStart);
    // make a copy of the regex as to not keep the state
    const flags = wordDefinition.ignoreCase ? 'gi' : 'g';
    wordDefinition = new RegExp(wordDefinition.source, flags);
    let match = wordDefinition.exec(lineText);
    while (match && match.index + match[0].length < offsetInLine) {
        match = wordDefinition.exec(lineText);
    }
    if (match && match.index <= offsetInLine) {
        return { start: match.index + lineStart, length: match[0].length };
    }
    return { start: offset, length: 0 };
}
exports.getWordAtText = getWordAtText;
function removeQuotes(str) {
    return str.replace(/["']/g, '');
}
exports.removeQuotes = removeQuotes;
const CR = '\r'.charCodeAt(0);
const NL = '\n'.charCodeAt(0);
function isNewlineCharacter(charCode) {
    return charCode === CR || charCode === NL;
}
const nonEmptyLineRE = /^(?!$)/gm;
/**
 *  wrap text in section tags like <template>, <style>
 *  add leading and trailing newline and optional indentation
 */
function indentSection(text, options) {
    const initialIndent = generateIndent(options);
    return text.replace(nonEmptyLineRE, initialIndent);
}
exports.indentSection = indentSection;
function generateIndent(options) {
    if (!options.options.useTabs) {
        return ' '.repeat(options.options.tabSize);
    }
    else {
        return '\t';
    }
}
function toMarkupContent(value) {
    if (!value) {
        return '';
    }
    return typeof value === 'string' ? { kind: vscode_languageserver_1.MarkupKind.Markdown, value } : value;
}
exports.toMarkupContent = toMarkupContent;
//# sourceMappingURL=strings.js.map