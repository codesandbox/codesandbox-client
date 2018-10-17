/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import * as Parser from '../parser/jsonParser.js';
import * as Json from '../../jsonc-parser/main.js';
import { stringifyObject } from '../utils/json.js';
import { endsWith } from '../utils/strings.js';
import { CompletionItem, CompletionItemKind, Range, TextEdit, InsertTextFormat } from '../../vscode-languageserver-types/main.js';
import * as nls from '../../../fillers/vscode-nls.js';
var localize = nls.loadMessageBundle();
var JSONCompletion = /** @class */ (function () {
    function JSONCompletion(schemaService, contributions, promiseConstructor) {
        if (contributions === void 0) { contributions = []; }
        this.templateVarIdCounter = 0;
        this.schemaService = schemaService;
        this.contributions = contributions;
        this.promise = promiseConstructor || Promise;
    }
    JSONCompletion.prototype.doResolve = function (item) {
        for (var i = this.contributions.length - 1; i >= 0; i--) {
            if (this.contributions[i].resolveCompletion) {
                var resolver = this.contributions[i].resolveCompletion(item);
                if (resolver) {
                    return resolver;
                }
            }
        }
        return this.promise.resolve(item);
    };
    JSONCompletion.prototype.doComplete = function (document, position, doc) {
        var _this = this;
        var result = {
            items: [],
            isIncomplete: false
        };
        var offset = document.offsetAt(position);
        var node = doc.getNodeFromOffsetEndInclusive(offset);
        if (this.isInComment(document, node ? node.offset : 0, offset)) {
            return Promise.resolve(result);
        }
        var currentWord = this.getCurrentWord(document, offset);
        var overwriteRange = null;
        if (node && (node.type === 'string' || node.type === 'number' || node.type === 'boolean' || node.type === 'null')) {
            overwriteRange = Range.create(document.positionAt(node.offset), document.positionAt(node.offset + node.length));
        }
        else {
            var overwriteStart = offset - currentWord.length;
            if (overwriteStart > 0 && document.getText()[overwriteStart - 1] === '"') {
                overwriteStart--;
            }
            overwriteRange = Range.create(document.positionAt(overwriteStart), position);
        }
        var proposed = {};
        var collector = {
            add: function (suggestion) {
                var existing = proposed[suggestion.label];
                if (!existing) {
                    proposed[suggestion.label] = suggestion;
                    if (overwriteRange) {
                        suggestion.textEdit = TextEdit.replace(overwriteRange, suggestion.insertText);
                    }
                    result.items.push(suggestion);
                }
                else if (!existing.documentation) {
                    existing.documentation = suggestion.documentation;
                }
            },
            setAsIncomplete: function () {
                result.isIncomplete = true;
            },
            error: function (message) {
                console.error(message);
            },
            log: function (message) {
                console.log(message);
            },
            getNumberOfProposals: function () {
                return result.items.length;
            }
        };
        return this.schemaService.getSchemaForResource(document.uri, doc).then(function (schema) {
            var collectionPromises = [];
            var addValue = true;
            var currentKey = '';
            var currentProperty = null;
            if (node) {
                if (node.type === 'string') {
                    var parent = node.parent;
                    if (parent && parent.type === 'property' && parent.keyNode === node) {
                        addValue = !parent.valueNode;
                        currentProperty = parent;
                        currentKey = document.getText().substr(node.offset + 1, node.length - 2);
                        if (parent) {
                            node = parent.parent;
                        }
                    }
                }
            }
            // proposals for properties
            if (node && node.type === 'object') {
                // don't suggest keys when the cursor is just before the opening curly brace
                if (node.offset === offset) {
                    return result;
                }
                // don't suggest properties that are already present
                var properties = node.properties;
                properties.forEach(function (p) {
                    if (!currentProperty || currentProperty !== p) {
                        proposed[p.keyNode.value] = CompletionItem.create('__');
                    }
                });
                var separatorAfter_1 = '';
                if (addValue) {
                    separatorAfter_1 = _this.evaluateSeparatorAfter(document, document.offsetAt(overwriteRange.end));
                }
                if (schema) {
                    // property proposals with schema
                    _this.getPropertyCompletions(schema, doc, node, addValue, separatorAfter_1, collector);
                }
                else {
                    // property proposals without schema
                    _this.getSchemaLessPropertyCompletions(doc, node, currentKey, collector);
                }
                var location_1 = Parser.getNodePath(node);
                _this.contributions.forEach(function (contribution) {
                    var collectPromise = contribution.collectPropertyCompletions(document.uri, location_1, currentWord, addValue, separatorAfter_1 === '', collector);
                    if (collectPromise) {
                        collectionPromises.push(collectPromise);
                    }
                });
                if ((!schema && currentWord.length > 0 && document.getText().charAt(offset - currentWord.length - 1) !== '"')) {
                    collector.add({
                        kind: CompletionItemKind.Property,
                        label: _this.getLabelForValue(currentWord),
                        insertText: _this.getInsertTextForProperty(currentWord, null, false, separatorAfter_1),
                        insertTextFormat: InsertTextFormat.Snippet, documentation: ''
                    });
                }
            }
            // proposals for values
            var types = {};
            if (schema) {
                // value proposals with schema
                _this.getValueCompletions(schema, doc, node, offset, document, collector, types);
            }
            else {
                // value proposals without schema
                _this.getSchemaLessValueCompletions(doc, node, offset, document, collector);
            }
            if (_this.contributions.length > 0) {
                _this.getContributedValueCompletions(doc, node, offset, document, collector, collectionPromises);
            }
            return _this.promise.all(collectionPromises).then(function () {
                if (collector.getNumberOfProposals() === 0) {
                    var offsetForSeparator = offset;
                    if (node && (node.type === 'string' || node.type === 'number' || node.type === 'boolean' || node.type === 'null')) {
                        offsetForSeparator = node.offset + node.length;
                    }
                    var separatorAfter = _this.evaluateSeparatorAfter(document, offsetForSeparator);
                    _this.addFillerValueCompletions(types, separatorAfter, collector);
                }
                return result;
            });
        });
    };
    JSONCompletion.prototype.getPropertyCompletions = function (schema, doc, node, addValue, separatorAfter, collector) {
        var _this = this;
        var matchingSchemas = doc.getMatchingSchemas(schema.schema, node.offset);
        matchingSchemas.forEach(function (s) {
            if (s.node === node && !s.inverted) {
                var schemaProperties_1 = s.schema.properties;
                if (schemaProperties_1) {
                    Object.keys(schemaProperties_1).forEach(function (key) {
                        var propertySchema = schemaProperties_1[key];
                        if (typeof propertySchema === 'object' && !propertySchema.deprecationMessage && !propertySchema.doNotSuggest) {
                            var proposal = {
                                kind: CompletionItemKind.Property,
                                label: key,
                                insertText: _this.getInsertTextForProperty(key, propertySchema, addValue, separatorAfter),
                                insertTextFormat: InsertTextFormat.Snippet,
                                filterText: _this.getFilterTextForValue(key),
                                documentation: propertySchema.description || '',
                            };
                            if (endsWith(proposal.insertText, "$1" + separatorAfter)) {
                                proposal.command = {
                                    title: 'Suggest',
                                    command: 'editor.action.triggerSuggest'
                                };
                            }
                            collector.add(proposal);
                        }
                    });
                }
            }
        });
    };
    JSONCompletion.prototype.getSchemaLessPropertyCompletions = function (doc, node, currentKey, collector) {
        var _this = this;
        var collectCompletionsForSimilarObject = function (obj) {
            obj.properties.forEach(function (p) {
                var key = p.keyNode.value;
                collector.add({
                    kind: CompletionItemKind.Property,
                    label: key,
                    insertText: _this.getInsertTextForValue(key, ''),
                    insertTextFormat: InsertTextFormat.Snippet,
                    filterText: _this.getFilterTextForValue(key),
                    documentation: ''
                });
            });
        };
        if (node.parent) {
            if (node.parent.type === 'property') {
                // if the object is a property value, check the tree for other objects that hang under a property of the same name
                var parentKey_1 = node.parent.keyNode.value;
                doc.visit(function (n) {
                    if (n.type === 'property' && n !== node.parent && n.keyNode.value === parentKey_1 && n.valueNode && n.valueNode.type === 'object') {
                        collectCompletionsForSimilarObject(n.valueNode);
                    }
                    return true;
                });
            }
            else if (node.parent.type === 'array') {
                // if the object is in an array, use all other array elements as similar objects
                node.parent.items.forEach(function (n) {
                    if (n.type === 'object' && n !== node) {
                        collectCompletionsForSimilarObject(n);
                    }
                });
            }
        }
        else if (node.type === 'object') {
            collector.add({
                kind: CompletionItemKind.Property,
                label: '$schema',
                insertText: this.getInsertTextForProperty('$schema', null, true, ''),
                insertTextFormat: InsertTextFormat.Snippet, documentation: '',
                filterText: this.getFilterTextForValue("$schema")
            });
        }
    };
    JSONCompletion.prototype.getSchemaLessValueCompletions = function (doc, node, offset, document, collector) {
        var _this = this;
        var offsetForSeparator = offset;
        if (node && (node.type === 'string' || node.type === 'number' || node.type === 'boolean' || node.type === 'null')) {
            offsetForSeparator = node.offset + node.length;
            node = node.parent;
        }
        if (!node) {
            collector.add({
                kind: this.getSuggestionKind('object'),
                label: 'Empty object',
                insertText: this.getInsertTextForValue({}, ''),
                insertTextFormat: InsertTextFormat.Snippet,
                documentation: ''
            });
            collector.add({
                kind: this.getSuggestionKind('array'),
                label: 'Empty array',
                insertText: this.getInsertTextForValue([], ''),
                insertTextFormat: InsertTextFormat.Snippet,
                documentation: ''
            });
            return;
        }
        var separatorAfter = this.evaluateSeparatorAfter(document, offsetForSeparator);
        var collectSuggestionsForValues = function (value) {
            if (!Parser.contains(value.parent, offset, true)) {
                collector.add({
                    kind: _this.getSuggestionKind(value.type),
                    label: _this.getLabelTextForMatchingNode(value, document),
                    insertText: _this.getInsertTextForMatchingNode(value, document, separatorAfter),
                    insertTextFormat: InsertTextFormat.Snippet, documentation: ''
                });
            }
            if (value.type === 'boolean') {
                _this.addBooleanValueCompletion(!value.value, separatorAfter, collector);
            }
        };
        if (node.type === 'property') {
            if (offset > node.colonOffset) {
                var valueNode = node.valueNode;
                if (valueNode && (offset > (valueNode.offset + valueNode.length) || valueNode.type === 'object' || valueNode.type === 'array')) {
                    return;
                }
                // suggest values at the same key
                var parentKey_2 = node.keyNode.value;
                doc.visit(function (n) {
                    if (n.type === 'property' && n.keyNode.value === parentKey_2 && n.valueNode) {
                        collectSuggestionsForValues(n.valueNode);
                    }
                    return true;
                });
                if (parentKey_2 === '$schema' && node.parent && !node.parent.parent) {
                    this.addDollarSchemaCompletions(separatorAfter, collector);
                }
            }
        }
        if (node.type === 'array') {
            if (node.parent && node.parent.type === 'property') {
                // suggest items of an array at the same key
                var parentKey_3 = node.parent.keyNode.value;
                doc.visit(function (n) {
                    var p = n;
                    if (n.type === 'property' && p.keyNode.value === parentKey_3 && p.valueNode && p.valueNode.type === 'array') {
                        p.valueNode.items.forEach(collectSuggestionsForValues);
                    }
                    return true;
                });
            }
            else {
                // suggest items in the same array
                node.items.forEach(collectSuggestionsForValues);
            }
        }
    };
    JSONCompletion.prototype.getValueCompletions = function (schema, doc, node, offset, document, collector, types) {
        var _this = this;
        var offsetForSeparator = offset;
        var parentKey = null;
        var valueNode = null;
        if (node && (node.type === 'string' || node.type === 'number' || node.type === 'boolean' || node.type === 'null')) {
            offsetForSeparator = node.offset + node.length;
            valueNode = node;
            node = node.parent;
        }
        if (!node) {
            this.addSchemaValueCompletions(schema.schema, '', collector, types);
            return;
        }
        if ((node.type === 'property') && offset > node.colonOffset) {
            var valueNode_1 = node.valueNode;
            if (valueNode_1 && offset > (valueNode_1.offset + valueNode_1.length)) {
                return; // we are past the value node
            }
            parentKey = node.keyNode.value;
            node = node.parent;
        }
        if (node && (parentKey !== null || node.type === 'array')) {
            var separatorAfter_2 = this.evaluateSeparatorAfter(document, offsetForSeparator);
            var matchingSchemas = doc.getMatchingSchemas(schema.schema, node.offset, valueNode);
            matchingSchemas.forEach(function (s) {
                if (s.node === node && !s.inverted && s.schema) {
                    if (node.type === 'array' && s.schema.items) {
                        if (Array.isArray(s.schema.items)) {
                            var index = _this.findItemAtOffset(node, document, offset);
                            if (index < s.schema.items.length) {
                                _this.addSchemaValueCompletions(s.schema.items[index], separatorAfter_2, collector, types);
                            }
                        }
                        else {
                            _this.addSchemaValueCompletions(s.schema.items, separatorAfter_2, collector, types);
                        }
                    }
                    if (s.schema.properties) {
                        var propertySchema = s.schema.properties[parentKey];
                        if (propertySchema) {
                            _this.addSchemaValueCompletions(propertySchema, separatorAfter_2, collector, types);
                        }
                    }
                }
            });
            if (parentKey === '$schema' && !node.parent) {
                this.addDollarSchemaCompletions(separatorAfter_2, collector);
            }
            if (types['boolean']) {
                this.addBooleanValueCompletion(true, separatorAfter_2, collector);
                this.addBooleanValueCompletion(false, separatorAfter_2, collector);
            }
            if (types['null']) {
                this.addNullValueCompletion(separatorAfter_2, collector);
            }
        }
    };
    JSONCompletion.prototype.getContributedValueCompletions = function (doc, node, offset, document, collector, collectionPromises) {
        if (!node) {
            this.contributions.forEach(function (contribution) {
                var collectPromise = contribution.collectDefaultCompletions(document.uri, collector);
                if (collectPromise) {
                    collectionPromises.push(collectPromise);
                }
            });
        }
        else {
            if (node.type === 'string' || node.type === 'number' || node.type === 'boolean' || node.type === 'null') {
                node = node.parent;
            }
            if ((node.type === 'property') && offset > node.colonOffset) {
                var parentKey_4 = node.keyNode.value;
                var valueNode = node.valueNode;
                if (!valueNode || offset <= (valueNode.offset + valueNode.length)) {
                    var location_2 = Parser.getNodePath(node.parent);
                    this.contributions.forEach(function (contribution) {
                        var collectPromise = contribution.collectValueCompletions(document.uri, location_2, parentKey_4, collector);
                        if (collectPromise) {
                            collectionPromises.push(collectPromise);
                        }
                    });
                }
            }
        }
    };
    JSONCompletion.prototype.addSchemaValueCompletions = function (schema, separatorAfter, collector, types) {
        var _this = this;
        if (typeof schema === 'object') {
            this.addEnumValueCompletions(schema, separatorAfter, collector);
            this.addDefaultValueCompletions(schema, separatorAfter, collector);
            this.collectTypes(schema, types);
            if (Array.isArray(schema.allOf)) {
                schema.allOf.forEach(function (s) { return _this.addSchemaValueCompletions(s, separatorAfter, collector, types); });
            }
            if (Array.isArray(schema.anyOf)) {
                schema.anyOf.forEach(function (s) { return _this.addSchemaValueCompletions(s, separatorAfter, collector, types); });
            }
            if (Array.isArray(schema.oneOf)) {
                schema.oneOf.forEach(function (s) { return _this.addSchemaValueCompletions(s, separatorAfter, collector, types); });
            }
        }
    };
    JSONCompletion.prototype.addDefaultValueCompletions = function (schema, separatorAfter, collector, arrayDepth) {
        var _this = this;
        if (arrayDepth === void 0) { arrayDepth = 0; }
        var hasProposals = false;
        if (schema.default) {
            var type = schema.type;
            var value = schema.default;
            for (var i = arrayDepth; i > 0; i--) {
                value = [value];
                type = 'array';
            }
            collector.add({
                kind: this.getSuggestionKind(type),
                label: this.getLabelForValue(value),
                insertText: this.getInsertTextForValue(value, separatorAfter),
                insertTextFormat: InsertTextFormat.Snippet,
                detail: localize('json.suggest.default', 'Default value'),
            });
            hasProposals = true;
        }
        if (Array.isArray(schema.defaultSnippets)) {
            schema.defaultSnippets.forEach(function (s) {
                var type = schema.type;
                var value = s.body;
                var label = s.label;
                var insertText;
                var filterText;
                if (typeof value !== 'undefined') {
                    var type_1 = schema.type;
                    for (var i = arrayDepth; i > 0; i--) {
                        value = [value];
                        type_1 = 'array';
                    }
                    insertText = _this.getInsertTextForSnippetValue(value, separatorAfter);
                    filterText = _this.getFilterTextForSnippetValue(value);
                    label = label || _this.getLabelForSnippetValue(value);
                }
                else if (typeof s.bodyText === 'string') {
                    var prefix = '', suffix = '', indent = '';
                    for (var i = arrayDepth; i > 0; i--) {
                        prefix = prefix + indent + '[\n';
                        suffix = suffix + '\n' + indent + ']';
                        indent += '\t';
                        type = 'array';
                    }
                    insertText = prefix + indent + s.bodyText.split('\n').join('\n' + indent) + suffix + separatorAfter;
                    label = label || insertText;
                    filterText = insertText.replace(/[\n]/g, ''); // remove new lines
                }
                collector.add({
                    kind: _this.getSuggestionKind(type),
                    label: label,
                    documentation: s.description,
                    insertText: insertText,
                    insertTextFormat: InsertTextFormat.Snippet,
                    filterText: filterText
                });
                hasProposals = true;
            });
        }
        if (!hasProposals && typeof schema.items === 'object' && !Array.isArray(schema.items)) {
            this.addDefaultValueCompletions(schema.items, separatorAfter, collector, arrayDepth + 1);
        }
    };
    JSONCompletion.prototype.addEnumValueCompletions = function (schema, separatorAfter, collector) {
        if (Array.isArray(schema.enum)) {
            for (var i = 0, length = schema.enum.length; i < length; i++) {
                var enm = schema.enum[i];
                var documentation = schema.description;
                if (schema.enumDescriptions && i < schema.enumDescriptions.length) {
                    documentation = schema.enumDescriptions[i];
                }
                collector.add({
                    kind: this.getSuggestionKind(schema.type),
                    label: this.getLabelForValue(enm),
                    insertText: this.getInsertTextForValue(enm, separatorAfter),
                    insertTextFormat: InsertTextFormat.Snippet,
                    documentation: documentation
                });
            }
        }
    };
    JSONCompletion.prototype.collectTypes = function (schema, types) {
        if (Array.isArray(schema.enum)) {
            return;
        }
        var type = schema.type;
        if (Array.isArray(type)) {
            type.forEach(function (t) { return types[t] = true; });
        }
        else {
            types[type] = true;
        }
    };
    JSONCompletion.prototype.addFillerValueCompletions = function (types, separatorAfter, collector) {
        if (types['object']) {
            collector.add({
                kind: this.getSuggestionKind('object'),
                label: '{}',
                insertText: this.getInsertTextForGuessedValue({}, separatorAfter),
                insertTextFormat: InsertTextFormat.Snippet,
                detail: localize('defaults.object', 'New object'),
                documentation: ''
            });
        }
        if (types['array']) {
            collector.add({
                kind: this.getSuggestionKind('array'),
                label: '[]',
                insertText: this.getInsertTextForGuessedValue([], separatorAfter),
                insertTextFormat: InsertTextFormat.Snippet,
                detail: localize('defaults.array', 'New array'),
                documentation: ''
            });
        }
    };
    JSONCompletion.prototype.addBooleanValueCompletion = function (value, separatorAfter, collector) {
        collector.add({
            kind: this.getSuggestionKind('boolean'),
            label: value ? 'true' : 'false',
            insertText: this.getInsertTextForValue(value, separatorAfter),
            insertTextFormat: InsertTextFormat.Snippet,
            documentation: ''
        });
    };
    JSONCompletion.prototype.addNullValueCompletion = function (separatorAfter, collector) {
        collector.add({
            kind: this.getSuggestionKind('null'),
            label: 'null',
            insertText: 'null' + separatorAfter,
            insertTextFormat: InsertTextFormat.Snippet,
            documentation: ''
        });
    };
    JSONCompletion.prototype.addDollarSchemaCompletions = function (separatorAfter, collector) {
        var _this = this;
        var schemaIds = this.schemaService.getRegisteredSchemaIds(function (schema) { return schema === 'http' || schema === 'https'; });
        schemaIds.forEach(function (schemaId) { return collector.add({
            kind: CompletionItemKind.Module,
            label: _this.getLabelForValue(schemaId),
            filterText: _this.getFilterTextForValue(schemaId),
            insertText: _this.getInsertTextForValue(schemaId, separatorAfter),
            insertTextFormat: InsertTextFormat.Snippet, documentation: ''
        }); });
    };
    JSONCompletion.prototype.getLabelForValue = function (value) {
        var label = JSON.stringify(value);
        if (label.length > 57) {
            return label.substr(0, 57).trim() + '...';
        }
        return label;
    };
    JSONCompletion.prototype.getFilterTextForValue = function (value) {
        return JSON.stringify(value);
    };
    JSONCompletion.prototype.getFilterTextForSnippetValue = function (value) {
        return JSON.stringify(value).replace(/\$\{\d+:([^}]+)\}|\$\d+/g, '$1');
    };
    JSONCompletion.prototype.getLabelForSnippetValue = function (value) {
        var label = JSON.stringify(value);
        label = label.replace(/\$\{\d+:([^}]+)\}|\$\d+/g, '$1');
        if (label.length > 57) {
            return label.substr(0, 57).trim() + '...';
        }
        return label;
    };
    JSONCompletion.prototype.getInsertTextForPlainText = function (text) {
        return text.replace(/[\\\$\}]/g, '\\$&'); // escape $, \ and } 
    };
    JSONCompletion.prototype.getInsertTextForValue = function (value, separatorAfter) {
        var text = JSON.stringify(value, null, '\t');
        if (text === '{}') {
            return '{\n\t$1\n}' + separatorAfter;
        }
        else if (text === '[]') {
            return '[\n\t$1\n]' + separatorAfter;
        }
        return this.getInsertTextForPlainText(text + separatorAfter);
    };
    JSONCompletion.prototype.getInsertTextForSnippetValue = function (value, separatorAfter) {
        var replacer = function (value) {
            if (typeof value === 'string') {
                if (value[0] === '^') {
                    return value.substr(1);
                }
            }
            return JSON.stringify(value);
        };
        return stringifyObject(value, '', replacer) + separatorAfter;
    };
    JSONCompletion.prototype.getInsertTextForGuessedValue = function (value, separatorAfter) {
        switch (typeof value) {
            case 'object':
                if (value === null) {
                    return '${1:null}' + separatorAfter;
                }
                return this.getInsertTextForValue(value, separatorAfter);
            case 'string':
                var snippetValue = JSON.stringify(value);
                snippetValue = snippetValue.substr(1, snippetValue.length - 2); // remove quotes
                snippetValue = this.getInsertTextForPlainText(snippetValue); // escape \ and }
                return '"${1:' + snippetValue + '}"' + separatorAfter;
            case 'number':
            case 'boolean':
                return '${1:' + JSON.stringify(value) + '}' + separatorAfter;
        }
        return this.getInsertTextForValue(value, separatorAfter);
    };
    JSONCompletion.prototype.getSuggestionKind = function (type) {
        if (Array.isArray(type)) {
            var array = type;
            type = array.length > 0 ? array[0] : null;
        }
        if (!type) {
            return CompletionItemKind.Value;
        }
        switch (type) {
            case 'string': return CompletionItemKind.Value;
            case 'object': return CompletionItemKind.Module;
            case 'property': return CompletionItemKind.Property;
            default: return CompletionItemKind.Value;
        }
    };
    JSONCompletion.prototype.getLabelTextForMatchingNode = function (node, document) {
        switch (node.type) {
            case 'array':
                return '[]';
            case 'object':
                return '{}';
            default:
                var content = document.getText().substr(node.offset, node.length);
                return content;
        }
    };
    JSONCompletion.prototype.getInsertTextForMatchingNode = function (node, document, separatorAfter) {
        switch (node.type) {
            case 'array':
                return this.getInsertTextForValue([], separatorAfter);
            case 'object':
                return this.getInsertTextForValue({}, separatorAfter);
            default:
                var content = document.getText().substr(node.offset, node.length) + separatorAfter;
                return this.getInsertTextForPlainText(content);
        }
    };
    JSONCompletion.prototype.getInsertTextForProperty = function (key, propertySchema, addValue, separatorAfter) {
        var propertyText = this.getInsertTextForValue(key, '');
        if (!addValue) {
            return propertyText;
        }
        var resultText = propertyText + ': ';
        var value;
        var nValueProposals = 0;
        if (propertySchema) {
            if (Array.isArray(propertySchema.defaultSnippets)) {
                if (propertySchema.defaultSnippets.length === 1) {
                    var body = propertySchema.defaultSnippets[0].body;
                    if (typeof body !== 'undefined') {
                        value = this.getInsertTextForSnippetValue(body, '');
                    }
                }
                nValueProposals += propertySchema.defaultSnippets.length;
            }
            if (propertySchema.enum) {
                if (!value && propertySchema.enum.length === 1) {
                    value = this.getInsertTextForGuessedValue(propertySchema.enum[0], '');
                }
                nValueProposals += propertySchema.enum.length;
            }
            if (typeof propertySchema.default !== 'undefined') {
                if (!value) {
                    value = this.getInsertTextForGuessedValue(propertySchema.default, '');
                }
                nValueProposals++;
            }
            if (nValueProposals === 0) {
                var type = Array.isArray(propertySchema.type) ? propertySchema.type[0] : propertySchema.type;
                if (!type) {
                    if (propertySchema.properties) {
                        type = 'object';
                    }
                    else if (propertySchema.items) {
                        type = 'array';
                    }
                }
                switch (type) {
                    case 'boolean':
                        value = '$1';
                        break;
                    case 'string':
                        value = '"$1"';
                        break;
                    case 'object':
                        value = '{\n\t$1\n}';
                        break;
                    case 'array':
                        value = '[\n\t$1\n]';
                        break;
                    case 'number':
                    case 'integer':
                        value = '${1:0}';
                        break;
                    case 'null':
                        value = '${1:null}';
                        break;
                    default:
                        return propertyText;
                }
            }
        }
        if (!value || nValueProposals > 1) {
            value = '$1';
        }
        return resultText + value + separatorAfter;
    };
    JSONCompletion.prototype.getCurrentWord = function (document, offset) {
        var i = offset - 1;
        var text = document.getText();
        while (i >= 0 && ' \t\n\r\v":{[,]}'.indexOf(text.charAt(i)) === -1) {
            i--;
        }
        return text.substring(i + 1, offset);
    };
    JSONCompletion.prototype.evaluateSeparatorAfter = function (document, offset) {
        var scanner = Json.createScanner(document.getText(), true);
        scanner.setPosition(offset);
        var token = scanner.scan();
        switch (token) {
            case 5 /* CommaToken */:
            case 2 /* CloseBraceToken */:
            case 4 /* CloseBracketToken */:
            case 17 /* EOF */:
                return '';
            default:
                return ',';
        }
    };
    JSONCompletion.prototype.findItemAtOffset = function (node, document, offset) {
        var scanner = Json.createScanner(document.getText(), true);
        var children = node.items;
        for (var i = children.length - 1; i >= 0; i--) {
            var child = children[i];
            if (offset > child.offset + child.length) {
                scanner.setPosition(child.offset + child.length);
                var token = scanner.scan();
                if (token === 5 /* CommaToken */ && offset >= scanner.getTokenOffset() + scanner.getTokenLength()) {
                    return i + 1;
                }
                return i;
            }
            else if (offset >= child.offset) {
                return i;
            }
        }
        return 0;
    };
    JSONCompletion.prototype.isInComment = function (document, start, offset) {
        var scanner = Json.createScanner(document.getText(), false);
        scanner.setPosition(start);
        var token = scanner.scan();
        while (token !== 17 /* EOF */ && (scanner.getTokenOffset() + scanner.getTokenLength() < offset)) {
            token = scanner.scan();
        }
        return (token === 12 /* LineCommentTrivia */ || token === 13 /* BlockCommentTrivia */) && scanner.getTokenOffset() <= offset;
    };
    return JSONCompletion;
}());
export { JSONCompletion };
//# sourceMappingURL=jsonCompletion.js.map