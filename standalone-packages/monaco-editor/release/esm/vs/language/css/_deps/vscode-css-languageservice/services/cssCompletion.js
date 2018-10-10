/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import * as nodes from '../parser/cssNodes.js';
import { Symbols } from '../parser/cssSymbolScope.js';
import * as languageFacts from './languageFacts.js';
import * as strings from '../utils/strings.js';
import { Position, CompletionItemKind, Range, TextEdit, InsertTextFormat } from '../../vscode-languageserver-types/main.js';
import * as nls from '../../../fillers/vscode-nls.js';
var localize = nls.loadMessageBundle();
var SnippetFormat = InsertTextFormat.Snippet;
var CSSCompletion = /** @class */ (function () {
    function CSSCompletion(variablePrefix) {
        if (variablePrefix === void 0) { variablePrefix = null; }
        this.completionParticipants = [];
        this.valueTypes = [
            nodes.NodeType.Identifier, nodes.NodeType.Value, nodes.NodeType.StringLiteral, nodes.NodeType.URILiteral, nodes.NodeType.NumericValue,
            nodes.NodeType.HexColorValue, nodes.NodeType.VariableName, nodes.NodeType.Prio
        ];
        this.variablePrefix = variablePrefix;
    }
    CSSCompletion.prototype.getSymbolContext = function () {
        if (!this.symbolContext) {
            this.symbolContext = new Symbols(this.styleSheet);
        }
        return this.symbolContext;
    };
    CSSCompletion.prototype.setCompletionParticipants = function (registeredCompletionParticipants) {
        this.completionParticipants = registeredCompletionParticipants || [];
    };
    CSSCompletion.prototype.doComplete = function (document, position, styleSheet) {
        this.offset = document.offsetAt(position);
        this.position = position;
        this.currentWord = getCurrentWord(document, this.offset);
        this.defaultReplaceRange = Range.create(Position.create(this.position.line, this.position.character - this.currentWord.length), this.position);
        this.textDocument = document;
        this.styleSheet = styleSheet;
        try {
            var result = { isIncomplete: false, items: [] };
            this.nodePath = nodes.getNodePath(this.styleSheet, this.offset);
            for (var i = this.nodePath.length - 1; i >= 0; i--) {
                var node = this.nodePath[i];
                if (node instanceof nodes.Property) {
                    this.getCompletionsForDeclarationProperty(node.getParent(), result);
                }
                else if (node instanceof nodes.Expression) {
                    this.getCompletionsForExpression(node, result);
                }
                else if (node instanceof nodes.SimpleSelector) {
                    var parentExtRef = node.findParent(nodes.NodeType.ExtendsReference);
                    if (parentExtRef) {
                        this.getCompletionsForExtendsReference(parentExtRef, node, result);
                    }
                    else {
                        var parentRuleSet = node.findParent(nodes.NodeType.Ruleset);
                        this.getCompletionsForSelector(parentRuleSet, parentRuleSet && parentRuleSet.isNested(), result);
                    }
                }
                else if (node instanceof nodes.FunctionArgument) {
                    this.getCompletionsForFunctionArgument(node, node.getParent(), result);
                }
                else if (node instanceof nodes.Declarations) {
                    this.getCompletionsForDeclarations(node, result);
                }
                else if (node instanceof nodes.VariableDeclaration) {
                    this.getCompletionsForVariableDeclaration(node, result);
                }
                else if (node instanceof nodes.RuleSet) {
                    this.getCompletionsForRuleSet(node, result);
                }
                else if (node instanceof nodes.Interpolation) {
                    this.getCompletionsForInterpolation(node, result);
                }
                else if (node instanceof nodes.FunctionDeclaration) {
                    this.getCompletionsForFunctionDeclaration(node, result);
                }
                else if (node instanceof nodes.MixinReference) {
                    this.getCompletionsForMixinReference(node, result);
                }
                else if (node instanceof nodes.Function) {
                    this.getCompletionsForFunctionArgument(null, node, result);
                }
                else if (node instanceof nodes.Supports) {
                    this.getCompletionsForSupports(node, result);
                }
                else if (node instanceof nodes.SupportsCondition) {
                    this.getCompletionsForSupportsCondition(node, result);
                }
                else if (node instanceof nodes.ExtendsReference) {
                    this.getCompletionsForExtendsReference(node, null, result);
                }
                if (result.items.length > 0) {
                    return this.finalize(result);
                }
            }
            this.getCompletionsForStylesheet(result);
            if (result.items.length === 0) {
                if (this.variablePrefix && this.currentWord.indexOf(this.variablePrefix) === 0) {
                    this.getVariableProposals(null, result);
                }
            }
            return this.finalize(result);
        }
        finally {
            // don't hold on any state, clear symbolContext
            this.position = null;
            this.currentWord = null;
            this.textDocument = null;
            this.styleSheet = null;
            this.symbolContext = null;
            this.defaultReplaceRange = null;
            this.nodePath = null;
        }
    };
    CSSCompletion.prototype.finalize = function (result) {
        var needsSortText = result.items.some(function (i) { return !!i.sortText; });
        if (needsSortText) {
            for (var _i = 0, _a = result.items; _i < _a.length; _i++) {
                var i = _a[_i];
                if (!i.sortText) {
                    i.sortText = 'd';
                }
            }
        }
        return result;
    };
    CSSCompletion.prototype.findInNodePath = function () {
        var types = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            types[_i] = arguments[_i];
        }
        for (var i = this.nodePath.length - 1; i >= 0; i--) {
            var node = this.nodePath[i];
            if (types.indexOf(node.type) !== -1) {
                return node;
            }
        }
        return null;
    };
    CSSCompletion.prototype.getCompletionsForDeclarationProperty = function (declaration, result) {
        return this.getPropertyProposals(declaration, result);
    };
    CSSCompletion.prototype.getPropertyProposals = function (declaration, result) {
        var _this = this;
        var properties = languageFacts.getProperties();
        for (var key in properties) {
            if (properties.hasOwnProperty(key)) {
                var entry = properties[key];
                if (entry.browsers.onCodeComplete) {
                    var range = void 0;
                    var insertText = void 0;
                    if (declaration) {
                        range = this.getCompletionRange(declaration.getProperty());
                        insertText = entry.name + (!isDefined(declaration.colonPosition) ? ': ' : '');
                    }
                    else {
                        range = this.getCompletionRange(null);
                        insertText = entry.name + ': ';
                    }
                    var item = {
                        label: entry.name,
                        documentation: languageFacts.getEntryDescription(entry),
                        textEdit: TextEdit.replace(range, insertText),
                        kind: CompletionItemKind.Property,
                        command: {
                            title: 'Suggest',
                            command: 'editor.action.triggerSuggest'
                        }
                    };
                    if (strings.startsWith(entry.name, '-')) {
                        item.sortText = 'x';
                    }
                    result.items.push(item);
                }
            }
        }
        this.completionParticipants.forEach(function (participant) {
            participant.onCssProperty({
                propertyName: _this.currentWord,
                range: _this.defaultReplaceRange
            });
        });
        return result;
    };
    CSSCompletion.prototype.getCompletionsForDeclarationValue = function (node, result) {
        var _this = this;
        var propertyName = node.getFullPropertyName();
        var entry = languageFacts.getProperties()[propertyName];
        var existingNode = node.getValue();
        while (existingNode && existingNode.hasChildren()) {
            existingNode = existingNode.findChildAtOffset(this.offset, false);
        }
        this.completionParticipants.forEach(function (participant) {
            participant.onCssPropertyValue({
                propertyName: propertyName,
                propertyValue: _this.currentWord,
                range: _this.getCompletionRange(existingNode)
            });
        });
        if (entry) {
            for (var _i = 0, _a = entry.restrictions; _i < _a.length; _i++) {
                var restriction = _a[_i];
                switch (restriction) {
                    case 'color':
                        this.getColorProposals(entry, existingNode, result);
                        break;
                    case 'position':
                        this.getPositionProposals(entry, existingNode, result);
                        break;
                    case 'repeat':
                        this.getRepeatStyleProposals(entry, existingNode, result);
                        break;
                    case 'line-style':
                        this.getLineStyleProposals(entry, existingNode, result);
                        break;
                    case 'line-width':
                        this.getLineWidthProposals(entry, existingNode, result);
                        break;
                    case 'geometry-box':
                        this.getGeometryBoxProposals(entry, existingNode, result);
                        break;
                    case 'box':
                        this.getBoxProposals(entry, existingNode, result);
                        break;
                    case 'image':
                        this.getImageProposals(entry, existingNode, result);
                        break;
                    case 'timing-function':
                        this.getTimingFunctionProposals(entry, existingNode, result);
                        break;
                    case 'shape':
                        this.getBasicShapeProposals(entry, existingNode, result);
                        break;
                }
            }
            this.getValueEnumProposals(entry, existingNode, result);
            this.getCSSWideKeywordProposals(entry, existingNode, result);
            this.getUnitProposals(entry, existingNode, result);
        }
        else {
            var existingValues = collectValues(this.styleSheet, node);
            for (var _b = 0, _c = existingValues.getEntries(); _b < _c.length; _b++) {
                var existingValue = _c[_b];
                result.items.push({
                    label: existingValue,
                    textEdit: TextEdit.replace(this.getCompletionRange(existingNode), existingValue),
                    kind: CompletionItemKind.Value
                });
            }
        }
        this.getVariableProposals(existingNode, result);
        this.getTermProposals(entry, existingNode, result);
        return result;
    };
    CSSCompletion.prototype.getValueEnumProposals = function (entry, existingNode, result) {
        if (entry.values) {
            for (var _i = 0, _a = entry.values; _i < _a.length; _i++) {
                var value = _a[_i];
                if (languageFacts.isCommonValue(value)) {
                    var insertString = value.name;
                    var insertTextFormat = void 0;
                    if (strings.endsWith(insertString, ')')) {
                        var from = insertString.lastIndexOf('(');
                        if (from !== -1) {
                            insertString = insertString.substr(0, from) + '($1)';
                            insertTextFormat = SnippetFormat;
                        }
                    }
                    var item = {
                        label: value.name,
                        documentation: languageFacts.getEntryDescription(value),
                        textEdit: TextEdit.replace(this.getCompletionRange(existingNode), insertString),
                        kind: CompletionItemKind.Value,
                        insertTextFormat: insertTextFormat
                    };
                    result.items.push(item);
                }
            }
        }
        return result;
    };
    CSSCompletion.prototype.getCSSWideKeywordProposals = function (entry, existingNode, result) {
        for (var keywords in languageFacts.cssWideKeywords) {
            result.items.push({
                label: keywords,
                documentation: languageFacts.cssWideKeywords[keywords],
                textEdit: TextEdit.replace(this.getCompletionRange(existingNode), keywords),
                kind: CompletionItemKind.Value
            });
        }
        return result;
    };
    CSSCompletion.prototype.getCompletionsForInterpolation = function (node, result) {
        if (this.offset >= node.offset + 2) {
            this.getVariableProposals(null, result);
        }
        return result;
    };
    CSSCompletion.prototype.getVariableProposals = function (existingNode, result) {
        var symbols = this.getSymbolContext().findSymbolsAtOffset(this.offset, nodes.ReferenceType.Variable);
        for (var _i = 0, symbols_1 = symbols; _i < symbols_1.length; _i++) {
            var symbol = symbols_1[_i];
            var insertText = strings.startsWith(symbol.name, '--') ? "var(" + symbol.name + ")" : symbol.name;
            var suggest = {
                label: symbol.name,
                documentation: symbol.value ? strings.getLimitedString(symbol.value) : symbol.value,
                textEdit: TextEdit.replace(this.getCompletionRange(existingNode), insertText),
                kind: CompletionItemKind.Variable,
                sortText: 'z'
            };
            if (symbol.node.type === nodes.NodeType.FunctionParameter) {
                var mixinNode = (symbol.node.getParent());
                if (mixinNode.type === nodes.NodeType.MixinDeclaration) {
                    suggest.detail = localize('completion.argument', 'argument from \'{0}\'', mixinNode.getName());
                }
            }
            result.items.push(suggest);
        }
        return result;
    };
    CSSCompletion.prototype.getVariableProposalsForCSSVarFunction = function (result) {
        var symbols = this.getSymbolContext().findSymbolsAtOffset(this.offset, nodes.ReferenceType.Variable);
        symbols = symbols.filter(function (symbol) {
            return strings.startsWith(symbol.name, '--');
        });
        for (var _i = 0, symbols_2 = symbols; _i < symbols_2.length; _i++) {
            var symbol = symbols_2[_i];
            result.items.push({
                label: symbol.name,
                documentation: symbol.value ? strings.getLimitedString(symbol.value) : symbol.value,
                textEdit: TextEdit.replace(this.getCompletionRange(null), symbol.name),
                kind: CompletionItemKind.Variable
            });
        }
        return result;
    };
    CSSCompletion.prototype.getUnitProposals = function (entry, existingNode, result) {
        var currentWord = '0';
        if (this.currentWord.length > 0) {
            var numMatch = this.currentWord.match(/^-?\d[\.\d+]*/);
            if (numMatch) {
                currentWord = numMatch[0];
                result.isIncomplete = currentWord.length === this.currentWord.length;
            }
        }
        else if (this.currentWord.length === 0) {
            result.isIncomplete = true;
        }
        if (existingNode && existingNode.parent && existingNode.parent.type === nodes.NodeType.Term) {
            existingNode = existingNode.getParent(); // include the unary operator
        }
        for (var _i = 0, _a = entry.restrictions; _i < _a.length; _i++) {
            var restriction = _a[_i];
            var units = languageFacts.units[restriction];
            if (units) {
                for (var _b = 0, units_1 = units; _b < units_1.length; _b++) {
                    var unit = units_1[_b];
                    var insertText = currentWord + unit;
                    result.items.push({
                        label: insertText,
                        textEdit: TextEdit.replace(this.getCompletionRange(existingNode), insertText),
                        kind: CompletionItemKind.Unit
                    });
                }
            }
        }
        return result;
    };
    CSSCompletion.prototype.getCompletionRange = function (existingNode) {
        if (existingNode && existingNode.offset <= this.offset) {
            var end = existingNode.end !== -1 ? this.textDocument.positionAt(existingNode.end) : this.position;
            return Range.create(this.textDocument.positionAt(existingNode.offset), end);
        }
        return this.defaultReplaceRange;
    };
    CSSCompletion.prototype.getColorProposals = function (entry, existingNode, result) {
        for (var color in languageFacts.colors) {
            result.items.push({
                label: color,
                documentation: languageFacts.colors[color],
                textEdit: TextEdit.replace(this.getCompletionRange(existingNode), color),
                kind: CompletionItemKind.Color
            });
        }
        for (var color in languageFacts.colorKeywords) {
            result.items.push({
                label: color,
                documentation: languageFacts.colorKeywords[color],
                textEdit: TextEdit.replace(this.getCompletionRange(existingNode), color),
                kind: CompletionItemKind.Value
            });
        }
        var colorValues = new Set();
        this.styleSheet.acceptVisitor(new ColorValueCollector(colorValues));
        for (var _i = 0, _a = colorValues.getEntries(); _i < _a.length; _i++) {
            var color = _a[_i];
            result.items.push({
                label: color,
                textEdit: TextEdit.replace(this.getCompletionRange(existingNode), color),
                kind: CompletionItemKind.Color
            });
        }
        var _loop_1 = function (p) {
            var tabStop = 1;
            var replaceFunction = function (match, p1) { return '${' + tabStop++ + ':' + p1 + '}'; };
            var insertText = p.func.replace(/\[?\$(\w+)\]?/g, replaceFunction);
            result.items.push({
                label: p.func.substr(0, p.func.indexOf('(')),
                detail: p.func,
                documentation: p.desc,
                textEdit: TextEdit.replace(this_1.getCompletionRange(existingNode), insertText),
                insertTextFormat: SnippetFormat,
                kind: CompletionItemKind.Function
            });
        };
        var this_1 = this;
        for (var _b = 0, _c = languageFacts.colorFunctions; _b < _c.length; _b++) {
            var p = _c[_b];
            _loop_1(p);
        }
        return result;
    };
    CSSCompletion.prototype.getPositionProposals = function (entry, existingNode, result) {
        for (var position in languageFacts.positionKeywords) {
            result.items.push({
                label: position,
                documentation: languageFacts.positionKeywords[position],
                textEdit: TextEdit.replace(this.getCompletionRange(existingNode), position),
                kind: CompletionItemKind.Value
            });
        }
        return result;
    };
    CSSCompletion.prototype.getRepeatStyleProposals = function (entry, existingNode, result) {
        for (var repeat in languageFacts.repeatStyleKeywords) {
            result.items.push({
                label: repeat,
                documentation: languageFacts.repeatStyleKeywords[repeat],
                textEdit: TextEdit.replace(this.getCompletionRange(existingNode), repeat),
                kind: CompletionItemKind.Value
            });
        }
        return result;
    };
    CSSCompletion.prototype.getLineStyleProposals = function (entry, existingNode, result) {
        for (var lineStyle in languageFacts.lineStyleKeywords) {
            result.items.push({
                label: lineStyle,
                documentation: languageFacts.lineStyleKeywords[lineStyle],
                textEdit: TextEdit.replace(this.getCompletionRange(existingNode), lineStyle),
                kind: CompletionItemKind.Value
            });
        }
        return result;
    };
    CSSCompletion.prototype.getLineWidthProposals = function (entry, existingNode, result) {
        for (var _i = 0, _a = languageFacts.lineWidthKeywords; _i < _a.length; _i++) {
            var lineWidth = _a[_i];
            result.items.push({
                label: lineWidth,
                textEdit: TextEdit.replace(this.getCompletionRange(existingNode), lineWidth),
                kind: CompletionItemKind.Value
            });
        }
        return result;
    };
    CSSCompletion.prototype.getGeometryBoxProposals = function (entry, existingNode, result) {
        for (var box in languageFacts.geometryBoxKeywords) {
            result.items.push({
                label: box,
                documentation: languageFacts.geometryBoxKeywords[box],
                textEdit: TextEdit.replace(this.getCompletionRange(existingNode), box),
                kind: CompletionItemKind.Value
            });
        }
        return result;
    };
    CSSCompletion.prototype.getBoxProposals = function (entry, existingNode, result) {
        for (var box in languageFacts.boxKeywords) {
            result.items.push({
                label: box,
                documentation: languageFacts.boxKeywords[box],
                textEdit: TextEdit.replace(this.getCompletionRange(existingNode), box),
                kind: CompletionItemKind.Value
            });
        }
        return result;
    };
    CSSCompletion.prototype.getImageProposals = function (entry, existingNode, result) {
        for (var image in languageFacts.imageFunctions) {
            var insertText = moveCursorInsideParenthesis(image);
            result.items.push({
                label: image,
                documentation: languageFacts.imageFunctions[image],
                textEdit: TextEdit.replace(this.getCompletionRange(existingNode), insertText),
                kind: CompletionItemKind.Function,
                insertTextFormat: image !== insertText ? SnippetFormat : void 0
            });
        }
        return result;
    };
    CSSCompletion.prototype.getTimingFunctionProposals = function (entry, existingNode, result) {
        for (var timing in languageFacts.transitionTimingFunctions) {
            var insertText = moveCursorInsideParenthesis(timing);
            result.items.push({
                label: timing,
                documentation: languageFacts.transitionTimingFunctions[timing],
                textEdit: TextEdit.replace(this.getCompletionRange(existingNode), insertText),
                kind: CompletionItemKind.Function,
                insertTextFormat: timing !== insertText ? SnippetFormat : void 0
            });
        }
        return result;
    };
    CSSCompletion.prototype.getBasicShapeProposals = function (entry, existingNode, result) {
        for (var shape in languageFacts.basicShapeFunctions) {
            var insertText = moveCursorInsideParenthesis(shape);
            result.items.push({
                label: shape,
                documentation: languageFacts.basicShapeFunctions[shape],
                textEdit: TextEdit.replace(this.getCompletionRange(existingNode), insertText),
                kind: CompletionItemKind.Function,
                insertTextFormat: shape !== insertText ? SnippetFormat : void 0
            });
        }
        return result;
    };
    CSSCompletion.prototype.getCompletionsForStylesheet = function (result) {
        var node = this.styleSheet.findFirstChildBeforeOffset(this.offset);
        if (!node) {
            return this.getCompletionForTopLevel(result);
        }
        if (node instanceof nodes.RuleSet) {
            return this.getCompletionsForRuleSet(node, result);
        }
        if (node instanceof nodes.Supports) {
            return this.getCompletionsForSupports(node, result);
        }
        return result;
    };
    CSSCompletion.prototype.getCompletionForTopLevel = function (result) {
        for (var _i = 0, _a = languageFacts.getAtDirectives(); _i < _a.length; _i++) {
            var entry = _a[_i];
            if (entry.browsers.count > 0) {
                result.items.push({
                    label: entry.name,
                    textEdit: TextEdit.replace(this.getCompletionRange(null), entry.name),
                    documentation: languageFacts.getEntryDescription(entry),
                    kind: CompletionItemKind.Keyword
                });
            }
        }
        this.getCompletionsForSelector(null, false, result);
        return result;
    };
    CSSCompletion.prototype.getCompletionsForRuleSet = function (ruleSet, result) {
        var declarations = ruleSet.getDeclarations();
        var isAfter = declarations && declarations.endsWith('}') && this.offset >= declarations.end;
        if (isAfter) {
            return this.getCompletionForTopLevel(result);
        }
        var isInSelectors = !declarations || this.offset <= declarations.offset;
        if (isInSelectors) {
            return this.getCompletionsForSelector(ruleSet, ruleSet.isNested(), result);
        }
        ruleSet.findParent(nodes.NodeType.Ruleset);
        return this.getCompletionsForDeclarations(ruleSet.getDeclarations(), result);
    };
    CSSCompletion.prototype.getCompletionsForSelector = function (ruleSet, isNested, result) {
        var _this = this;
        var existingNode = this.findInNodePath(nodes.NodeType.PseudoSelector, nodes.NodeType.IdentifierSelector, nodes.NodeType.ClassSelector, nodes.NodeType.ElementNameSelector);
        if (!existingNode && this.offset - this.currentWord.length > 0 && this.textDocument.getText()[this.offset - this.currentWord.length - 1] === ':') {
            // after the ':' of a pseudo selector, no node generated for just ':'
            this.currentWord = ':' + this.currentWord;
            this.defaultReplaceRange = Range.create(Position.create(this.position.line, this.position.character - this.currentWord.length), this.position);
        }
        for (var _i = 0, _a = languageFacts.getPseudoClasses(); _i < _a.length; _i++) {
            var entry = _a[_i];
            if (entry.browsers.onCodeComplete) {
                var insertText = moveCursorInsideParenthesis(entry.name);
                var item = {
                    label: entry.name,
                    textEdit: TextEdit.replace(this.getCompletionRange(existingNode), insertText),
                    documentation: languageFacts.getEntryDescription(entry),
                    kind: CompletionItemKind.Function,
                    insertTextFormat: entry.name !== insertText ? SnippetFormat : void 0
                };
                if (strings.startsWith(entry.name, ':-')) {
                    item.sortText = 'x';
                }
                result.items.push(item);
            }
        }
        for (var _b = 0, _c = languageFacts.getPseudoElements(); _b < _c.length; _b++) {
            var entry = _c[_b];
            if (entry.browsers.onCodeComplete) {
                var insertText = moveCursorInsideParenthesis(entry.name);
                var item = {
                    label: entry.name,
                    textEdit: TextEdit.replace(this.getCompletionRange(existingNode), insertText),
                    documentation: languageFacts.getEntryDescription(entry),
                    kind: CompletionItemKind.Function,
                    insertTextFormat: entry.name !== insertText ? SnippetFormat : void 0
                };
                if (strings.startsWith(entry.name, '::-')) {
                    item.sortText = 'x';
                }
                result.items.push(item);
            }
        }
        if (!isNested) {
            for (var _d = 0, _e = languageFacts.html5Tags; _d < _e.length; _d++) {
                var entry = _e[_d];
                result.items.push({
                    label: entry,
                    textEdit: TextEdit.replace(this.getCompletionRange(existingNode), entry),
                    kind: CompletionItemKind.Keyword
                });
            }
            for (var _f = 0, _g = languageFacts.svgElements; _f < _g.length; _f++) {
                var entry = _g[_f];
                result.items.push({
                    label: entry,
                    textEdit: TextEdit.replace(this.getCompletionRange(existingNode), entry),
                    kind: CompletionItemKind.Keyword
                });
            }
        }
        var visited = {};
        visited[this.currentWord] = true;
        var textProvider = this.styleSheet.getTextProvider();
        this.styleSheet.accept(function (n) {
            if (n.type === nodes.NodeType.SimpleSelector && n.length > 0) {
                var selector = textProvider(n.offset, n.length);
                if (selector.charAt(0) === '.' && !visited[selector]) {
                    visited[selector] = true;
                    result.items.push({
                        label: selector,
                        textEdit: TextEdit.replace(_this.getCompletionRange(existingNode), selector),
                        kind: CompletionItemKind.Keyword
                    });
                }
                return false;
            }
            return true;
        });
        if (ruleSet && ruleSet.isNested()) {
            var selector = ruleSet.getSelectors().findFirstChildBeforeOffset(this.offset);
            if (selector && ruleSet.getSelectors().getChildren().indexOf(selector) === 0) {
                this.getPropertyProposals(null, result);
            }
        }
        return result;
    };
    CSSCompletion.prototype.getCompletionsForDeclarations = function (declarations, result) {
        if (!declarations || this.offset === declarations.offset) {
            return result;
        }
        var node = declarations.findFirstChildBeforeOffset(this.offset);
        if (!node) {
            return this.getCompletionsForDeclarationProperty(null, result);
        }
        if (node instanceof nodes.AbstractDeclaration) {
            var declaration = node;
            if (!isDefined(declaration.colonPosition) || this.offset <= declaration.colonPosition) {
                // complete property
                return this.getCompletionsForDeclarationProperty(declaration, result);
            }
            else if ((isDefined(declaration.semicolonPosition) && declaration.semicolonPosition < this.offset)) {
                if (this.offset === declaration.semicolonPosition + 1) {
                    return result; // don't show new properties right after semicolon (see Bug 15421:[intellisense] [css] Be less aggressive when manually typing CSS)
                }
                // complete next property
                return this.getCompletionsForDeclarationProperty(null, result);
            }
            if (declaration instanceof nodes.Declaration) {
                // complete value
                return this.getCompletionsForDeclarationValue(declaration, result);
            }
        }
        else if (node instanceof nodes.ExtendsReference) {
            this.getCompletionsForExtendsReference(node, null, result);
        }
        return result;
    };
    CSSCompletion.prototype.getCompletionsForVariableDeclaration = function (declaration, result) {
        if (this.offset > declaration.colonPosition) {
            this.getVariableProposals(declaration.getValue(), result);
        }
        return result;
    };
    CSSCompletion.prototype.getCompletionsForExpression = function (expression, result) {
        if (expression.getParent() instanceof nodes.FunctionArgument) {
            this.getCompletionsForFunctionArgument(expression.getParent(), expression.getParent().getParent(), result);
            return result;
        }
        var declaration = expression.findParent(nodes.NodeType.Declaration);
        if (!declaration) {
            this.getTermProposals(null, null, result);
            return result;
        }
        var node = expression.findChildAtOffset(this.offset, true);
        if (!node) {
            return this.getCompletionsForDeclarationValue(declaration, result);
        }
        if (node instanceof nodes.NumericValue || node instanceof nodes.Identifier) {
            return this.getCompletionsForDeclarationValue(declaration, result);
        }
        return result;
    };
    CSSCompletion.prototype.getCompletionsForFunctionArgument = function (arg, func, result) {
        if (func.getIdentifier().getText() === 'var') {
            if (!func.getArguments().hasChildren() || func.getArguments().getChild(0) === arg) {
                this.getVariableProposalsForCSSVarFunction(result);
            }
        }
        return result;
    };
    CSSCompletion.prototype.getCompletionsForFunctionDeclaration = function (decl, result) {
        var declarations = decl.getDeclarations();
        if (declarations && this.offset > declarations.offset && this.offset < declarations.end) {
            this.getTermProposals(null, null, result);
        }
        return result;
    };
    CSSCompletion.prototype.getCompletionsForMixinReference = function (ref, result) {
        var allMixins = this.getSymbolContext().findSymbolsAtOffset(this.offset, nodes.ReferenceType.Mixin);
        for (var _i = 0, allMixins_1 = allMixins; _i < allMixins_1.length; _i++) {
            var mixinSymbol = allMixins_1[_i];
            if (mixinSymbol.node instanceof nodes.MixinDeclaration) {
                result.items.push(this.makeTermProposal(mixinSymbol, mixinSymbol.node.getParameters(), null));
            }
        }
        return result;
    };
    CSSCompletion.prototype.getTermProposals = function (entry, existingNode, result) {
        var allFunctions = this.getSymbolContext().findSymbolsAtOffset(this.offset, nodes.ReferenceType.Function);
        for (var _i = 0, allFunctions_1 = allFunctions; _i < allFunctions_1.length; _i++) {
            var functionSymbol = allFunctions_1[_i];
            if (functionSymbol.node instanceof nodes.FunctionDeclaration) {
                result.items.push(this.makeTermProposal(functionSymbol, functionSymbol.node.getParameters(), existingNode));
            }
        }
        return result;
    };
    CSSCompletion.prototype.makeTermProposal = function (symbol, parameters, existingNode) {
        var decl = symbol.node;
        var params = parameters.getChildren().map(function (c) {
            return (c instanceof nodes.FunctionParameter) ? c.getName() : c.getText();
        });
        var insertText = symbol.name + '(' + params.map(function (p, index) { return '${' + (index + 1) + ':' + p + '}'; }).join(', ') + ')';
        return {
            label: symbol.name,
            detail: symbol.name + '(' + params.join(', ') + ')',
            textEdit: TextEdit.replace(this.getCompletionRange(existingNode), insertText),
            insertTextFormat: SnippetFormat,
            kind: CompletionItemKind.Function,
            sortText: 'z'
        };
    };
    CSSCompletion.prototype.getCompletionsForSupportsCondition = function (supportsCondition, result) {
        var child = supportsCondition.findFirstChildBeforeOffset(this.offset);
        if (child) {
            if (child instanceof nodes.Declaration) {
                if (!isDefined(child.colonPosition || this.offset <= child.colonPosition)) {
                    return this.getCompletionsForDeclarationProperty(child, result);
                }
                else {
                    return this.getCompletionsForDeclarationValue(child, result);
                }
            }
            else if (child instanceof nodes.SupportsCondition) {
                return this.getCompletionsForSupportsCondition(child, result);
            }
        }
        if (isDefined(supportsCondition.lParent) && this.offset > supportsCondition.lParent && (!isDefined(supportsCondition.rParent) || this.offset <= supportsCondition.rParent)) {
            return this.getCompletionsForDeclarationProperty(null, result);
        }
        return result;
    };
    CSSCompletion.prototype.getCompletionsForSupports = function (supports, result) {
        var declarations = supports.getDeclarations();
        var inInCondition = !declarations || this.offset <= declarations.offset;
        if (inInCondition) {
            var child = supports.findFirstChildBeforeOffset(this.offset);
            if (child instanceof nodes.SupportsCondition) {
                return this.getCompletionsForSupportsCondition(child, result);
            }
            return result;
        }
        return this.getCompletionForTopLevel(result);
    };
    CSSCompletion.prototype.getCompletionsForExtendsReference = function (extendsRef, existingNode, result) {
        return result;
    };
    return CSSCompletion;
}());
export { CSSCompletion };
var Set = /** @class */ (function () {
    function Set() {
        this.entries = {};
    }
    Set.prototype.add = function (entry) {
        this.entries[entry] = true;
    };
    Set.prototype.getEntries = function () {
        return Object.keys(this.entries);
    };
    return Set;
}());
function moveCursorInsideParenthesis(text) {
    return text.replace(/\(\)$/, "($1)");
}
function collectValues(styleSheet, declaration) {
    var fullPropertyName = declaration.getFullPropertyName();
    var entries = new Set();
    function visitValue(node) {
        if (node instanceof nodes.Identifier || node instanceof nodes.NumericValue || node instanceof nodes.HexColorValue) {
            entries.add(node.getText());
        }
        return true;
    }
    function matchesProperty(decl) {
        var propertyName = decl.getFullPropertyName();
        return fullPropertyName === propertyName;
    }
    function vistNode(node) {
        if (node instanceof nodes.Declaration && node !== declaration) {
            if (matchesProperty(node)) {
                var value = node.getValue();
                if (value) {
                    value.accept(visitValue);
                }
            }
        }
        return true;
    }
    styleSheet.accept(vistNode);
    return entries;
}
var ColorValueCollector = /** @class */ (function () {
    function ColorValueCollector(entries) {
        this.entries = entries;
        // nothing to do
    }
    ColorValueCollector.prototype.visitNode = function (node) {
        if (node instanceof nodes.HexColorValue || (node instanceof nodes.Function && languageFacts.isColorConstructor(node))) {
            this.entries.add(node.getText());
        }
        return true;
    };
    return ColorValueCollector;
}());
function isDefined(obj) {
    return typeof obj !== 'undefined';
}
function getCurrentWord(document, offset) {
    var i = offset - 1;
    var text = document.getText();
    while (i >= 0 && ' \t\n\r":{[()]},*>+'.indexOf(text.charAt(i)) === -1) {
        i--;
    }
    return text.substring(i + 1, offset);
}
//# sourceMappingURL=cssCompletion.js.map