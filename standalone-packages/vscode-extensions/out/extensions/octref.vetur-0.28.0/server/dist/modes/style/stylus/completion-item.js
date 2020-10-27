"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.provideCompletionItems = exports.getValues = exports.getProperties = exports.getAtRules = exports.getAllSymbols = exports.findPropertySchema = exports.getPropertyName = exports.isValue = exports.isAtRule = exports.isClassOrId = void 0;
const vscode_languageserver_types_1 = require("vscode-languageserver-types");
const parser_1 = require("./parser");
const css_browser_data_1 = require("./css-browser-data");
const built_in_1 = require("./built-in");
const _ = require("lodash");
function prepareName(name) {
    return name.replace(/\{|\}/g, '').trim();
}
/**
 * Naive check whether currentWord is class or id
 * @param {String} currentWord
 * @return {Boolean}
 */
function isClassOrId(currentWord) {
    return /^[.#&]/.test(currentWord);
}
exports.isClassOrId = isClassOrId;
/**
 * Naive check whether currentWord is at rule
 * @param {String} currentWord
 * @return {Boolean}
 */
function isAtRule(currentWord) {
    return _.startsWith(currentWord, '@');
}
exports.isAtRule = isAtRule;
/**
 * Naive check whether currentWord is value for given property
 * @param {Object} data
 * @param {String} currentWord
 * @return {Boolean}
 */
function isValue(data, currentWord) {
    const property = getPropertyName(currentWord);
    return !!property && Boolean(findPropertySchema(data, property));
}
exports.isValue = isValue;
/**
 * Formats property name
 * @param {String} currentWord
 * @return {String}
 */
function getPropertyName(currentWord) {
    return currentWord.trim().replace(':', ' ').split(' ')[0];
}
exports.getPropertyName = getPropertyName;
/**
 * Search for property in cssSchema
 * @param {Object} data
 * @param {String} property
 * @return {Object}
 */
function findPropertySchema(data, property) {
    return _.find(data.properties, item => item.name === property);
}
exports.findPropertySchema = findPropertySchema;
/**
 * Handler for variables
 * @param {Object} node
 * @param {String[]} text - text editor content splitted by lines
 * @return {SymbolInformation}
 */
function _variableSymbol(node, text, currentWord) {
    const name = node.name;
    const lineno = Number(node.val.lineno) - 1;
    const completionItem = vscode_languageserver_types_1.CompletionItem.create(name);
    completionItem.detail = text[lineno].trim();
    completionItem.kind = vscode_languageserver_types_1.CompletionItemKind.Variable;
    return completionItem;
}
/**
 * Handler for function
 * @param {Object} node
 * @param {String[]} text - text editor content splitted by lines
 * @return {CompletionItem}
 */
function _functionSymbol(node, text) {
    const name = node.name;
    const completionItem = vscode_languageserver_types_1.CompletionItem.create(name);
    completionItem.kind = vscode_languageserver_types_1.CompletionItemKind.Function;
    return completionItem;
}
/**
 * Handler for selectors
 * @param {Object} node
 * @param {String[]} text - text editor content splitted by lines
 * @param {String} currentWord
 * @return {CompletionItem}
 */
function _selectorSymbol(node, text, currentWord) {
    const firstSegment = node.segments[0];
    const name = firstSegment.string
        ? node.segments.map(s => s.string).join('')
        : firstSegment.nodes.map(s => s.name).join('');
    const completionItem = vscode_languageserver_types_1.CompletionItem.create(name);
    completionItem.kind = vscode_languageserver_types_1.CompletionItemKind.Class;
    return completionItem;
}
/**
 * Handler for selector call symbols
 * @param {Object} node
 * @param {String[]} text - text editor content splitted by lines
 * @return {CompletionItem}
 */
function _selectorCallSymbol(node, text) {
    const lineno = Number(node.lineno) - 1;
    const name = prepareName(text[lineno]);
    const completionItem = vscode_languageserver_types_1.CompletionItem.create(name);
    completionItem.kind = vscode_languageserver_types_1.CompletionItemKind.Class;
    return completionItem;
}
function isVisible(useSite, defSite) {
    if (!useSite || !defSite) {
        return true;
    }
    if (useSite.length < defSite.length) {
        return false;
    }
    for (const [use, def] of _.zip(useSite, defSite)) {
        if (use && def && use > def) {
            return false;
        }
    }
    return true;
}
/**
 * Returns completion items lists from document symbols
 * @param {String} text
 * @param {String} currentWord
 * @return {CompletionItem}
 */
function getAllSymbols(text, currentWord, position) {
    const ast = parser_1.buildAst(text);
    if (!ast) {
        return [];
    }
    const node = parser_1.findNodeAtPosition(ast, position);
    const scope = node ? node.__scope : undefined;
    const splittedText = text.split('\n');
    const rawSymbols = parser_1.flattenAndFilterAst(ast).filter(item => ['Media', 'Keyframes', 'Atrule', 'Import', 'Require', 'Supports', 'Literal'].indexOf(item.__type) === -1);
    return _.compact(rawSymbols.map(item => {
        if (!isVisible(scope, item.__scope)) {
            return undefined;
        }
        if (parser_1.isVariableNode(item)) {
            return _variableSymbol(item, splittedText, currentWord);
        }
        if (parser_1.isFunctionNode(item)) {
            return _functionSymbol(item, splittedText);
        }
        if (parser_1.isSelectorNode(item)) {
            return _selectorSymbol(item, splittedText, currentWord);
        }
        if (parser_1.isSelectorCallNode(item)) {
            return _selectorCallSymbol(item, splittedText);
        }
    }));
}
exports.getAllSymbols = getAllSymbols;
/**
 * Returns at rules list for completion
 * @param {Object} data
 * @param {String} currentWord
 * @return {CompletionItem}
 */
function getAtRules(data, currentWord) {
    if (!isAtRule(currentWord)) {
        return [];
    }
    return data.atDirectives.map(property => {
        const completionItem = vscode_languageserver_types_1.CompletionItem.create(property.name);
        completionItem.documentation = property.description;
        completionItem.kind = vscode_languageserver_types_1.CompletionItemKind.Keyword;
        return completionItem;
    });
}
exports.getAtRules = getAtRules;
/**
 * Returns property list for completion
 * @param {Object} data
 * @param {String} currentWord
 * @return {CompletionItem}
 */
function getProperties(data, currentWord, useSeparator) {
    if (isClassOrId(currentWord) || isAtRule(currentWord)) {
        return [];
    }
    return data.properties.map(property => {
        const completionItem = vscode_languageserver_types_1.CompletionItem.create(property.name);
        completionItem.insertText = property.name + (useSeparator ? ': ' : ' ');
        completionItem.documentation = property.description;
        completionItem.kind = vscode_languageserver_types_1.CompletionItemKind.Property;
        return completionItem;
    });
}
exports.getProperties = getProperties;
/**
 * Returns values for current property for completion list
 * @param {Object} data
 * @param {String} currentWord
 * @return {CompletionItem}
 */
function getValues(data, currentWord) {
    const property = getPropertyName(currentWord);
    const result = findPropertySchema(data, property);
    const values = result && result.values;
    if (!values) {
        return [];
    }
    return values.map(property => {
        const completionItem = vscode_languageserver_types_1.CompletionItem.create(property.name);
        completionItem.documentation = property.description;
        completionItem.kind = vscode_languageserver_types_1.CompletionItemKind.Value;
        return completionItem;
    });
}
exports.getValues = getValues;
function provideCompletionItems(document, position) {
    const start = document.offsetAt(vscode_languageserver_types_1.Position.create(position.line, 0));
    const end = document.offsetAt(position);
    const text = document.getText();
    const currentWord = text.slice(start, end).trim();
    const value = isValue(css_browser_data_1.cssData, currentWord);
    let completions = [];
    if (value) {
        const values = getValues(css_browser_data_1.cssData, currentWord);
        const symbols = getAllSymbols(text, currentWord, position).filter(item => item.kind === vscode_languageserver_types_1.CompletionItemKind.Variable || item.kind === vscode_languageserver_types_1.CompletionItemKind.Function);
        completions = completions.concat(values, symbols, built_in_1.default);
    }
    else {
        const atRules = getAtRules(css_browser_data_1.cssData, currentWord);
        const properties = getProperties(css_browser_data_1.cssData, currentWord, false);
        const symbols = getAllSymbols(text, currentWord, position).filter(item => item.kind !== vscode_languageserver_types_1.CompletionItemKind.Variable);
        completions = completions.concat(properties, atRules, symbols);
    }
    return {
        isIncomplete: false,
        items: completions
    };
}
exports.provideCompletionItems = provideCompletionItems;
//# sourceMappingURL=completion-item.js.map