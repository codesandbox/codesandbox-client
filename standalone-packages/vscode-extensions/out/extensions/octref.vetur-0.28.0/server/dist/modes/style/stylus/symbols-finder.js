"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.provideDocumentSymbols = void 0;
const vscode_languageserver_types_1 = require("vscode-languageserver-types");
const parser_1 = require("./parser");
const _ = require("lodash");
/**
 * Generates hash for symbol for comparison with other symbols
 * @param {SymbolInformation} symbol
 * @return {String}
 */
function _buildHashFromSymbol(symbol) {
    return `${symbol.kind}_${symbol.name}_${symbol.location.range.start.line}_${symbol.location.range.end.line}`;
}
/**
 * Removes useless characters from symbol name
 * @param {String} name
 * @return String
 */
function prepareName(name) {
    return name.replace(/\{|\}/g, '').trim();
}
/**
 * Handler for variables
 * @param {Object} node
 * @param {String[]} text - text editor content splitted by lines
 * @return {SymbolInformation}
 */
function _variableSymbol(node, text) {
    const name = node.name;
    const lineno = Number(node.val.lineno) - 1;
    const column = Math.max(text[lineno].indexOf(name), 0);
    const range = vscode_languageserver_types_1.Range.create(lineno, column, lineno, column + name.length);
    return vscode_languageserver_types_1.SymbolInformation.create(name, vscode_languageserver_types_1.SymbolKind.Variable, range);
}
/**
 * Handler for function
 * @param {Object} node
 * @param {String[]} text - text editor content splitted by lines
 * @return {SymbolInformation}
 */
function _functionSymbol(node, text) {
    const name = node.name;
    const lineno = Number(node.val.lineno) - 1;
    const column = Math.max(text[lineno].indexOf(name), 0);
    const posStart = vscode_languageserver_types_1.Position.create(lineno, column);
    const posEnd = vscode_languageserver_types_1.Position.create(lineno, column + name.length);
    const range = vscode_languageserver_types_1.Range.create(posStart, posEnd);
    return vscode_languageserver_types_1.SymbolInformation.create(name, vscode_languageserver_types_1.SymbolKind.Function, range);
}
/**
 * Handler for selectors
 * @param {Object} node
 * @param {String[]} text - text editor content splitted by lines
 * @return {SymbolInformation}
 */
function _selectorSymbol(node, text) {
    const firstSegment = node.segments[0];
    const name = firstSegment.string
        ? node.segments.map(s => s.string).join('')
        : firstSegment.nodes.map(s => s.name).join('');
    const lineno = Number(firstSegment.lineno) - 1;
    const column = node.column - 1;
    const posStart = vscode_languageserver_types_1.Position.create(lineno, column);
    const posEnd = vscode_languageserver_types_1.Position.create(lineno, column + name.length);
    const range = vscode_languageserver_types_1.Range.create(posStart, posEnd);
    return vscode_languageserver_types_1.SymbolInformation.create(name, vscode_languageserver_types_1.SymbolKind.Class, range);
}
/**
 * Handler for selector call symbols
 * @param {Object} node
 * @param {String[]} text - text editor content splitted by lines
 * @return {SymbolInformation}
 */
function _selectorCallSymbol(node, text) {
    const lineno = Number(node.lineno) - 1;
    const name = prepareName(text[lineno]);
    const column = Math.max(text[lineno].indexOf(name), 0);
    const posStart = vscode_languageserver_types_1.Position.create(lineno, column);
    const posEnd = vscode_languageserver_types_1.Position.create(lineno, column + name.length);
    return vscode_languageserver_types_1.SymbolInformation.create(name, vscode_languageserver_types_1.SymbolKind.Class, vscode_languageserver_types_1.Range.create(posStart, posEnd));
}
/**
 * Handler for at rules
 * @param {Object} node
 * @param {String[]} text - text editor content splitted by lines
 * @return {SymbolInformation}
 */
function _atRuleSymbol(node, text) {
    const lineno = Number(node.lineno) - 1;
    const name = prepareName(text[lineno]);
    const column = Math.max(text[lineno].indexOf(name), 0);
    const posStart = vscode_languageserver_types_1.Position.create(lineno, column);
    const posEnd = vscode_languageserver_types_1.Position.create(lineno, column + name.length);
    return vscode_languageserver_types_1.SymbolInformation.create(name, vscode_languageserver_types_1.SymbolKind.Namespace, vscode_languageserver_types_1.Range.create(posStart, posEnd));
}
/**
 * Iterates through raw symbols and choose appropriate handler for each one
 * @param {Array} rawSymbols
 * @param {String[]} text - text editor content splitted by lines
 * @return {SymbolInformation[]}
 */
function processRawSymbols(rawSymbols, text) {
    return _.compact(rawSymbols.map(symNode => {
        if (parser_1.isVariableNode(symNode)) {
            return _variableSymbol(symNode, text);
        }
        if (parser_1.isFunctionNode(symNode)) {
            return _functionSymbol(symNode, text);
        }
        if (parser_1.isSelectorNode(symNode)) {
            return _selectorSymbol(symNode, text);
        }
        if (parser_1.isSelectorCallNode(symNode)) {
            return _selectorCallSymbol(symNode, text);
        }
        if (parser_1.isAtRuleNode(symNode)) {
            return _atRuleSymbol(symNode, text);
        }
    }));
}
function provideDocumentSymbols(document) {
    const text = document.getText();
    const ast = parser_1.buildAst(text);
    if (!ast) {
        return [];
    }
    const rawSymbols = _.compact(parser_1.flattenAndFilterAst(ast));
    const symbolInfos = processRawSymbols(rawSymbols, text.split('\n'));
    return _.uniqBy(symbolInfos, _buildHashFromSymbol);
}
exports.provideDocumentSymbols = provideDocumentSymbols;
//# sourceMappingURL=symbols-finder.js.map