/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { URI } from '../../../base/common/uri.js';
import { mixin } from '../../../base/common/objects.js';
import * as typeConvert from './extHostTypeConverters.js';
import { Range, Disposable, CompletionList, SnippetString, CodeActionKind, DocumentSymbol } from './extHostTypes.js';
import { asThenable } from '../../../base/common/async.js';
import { MainContext, ObjectIdentifier, IdObject } from './extHost.protocol.js';
import { regExpLeadsToEndlessLoop } from '../../../base/common/strings.js';
import { Range as EditorRange } from '../../../editor/common/core/range.js';
import { isFalsyOrEmpty } from '../../../base/common/arrays.js';
import { isObject } from '../../../base/common/types.js';
import { Selection } from '../../../editor/common/core/selection.js';
// --- adapter
var OutlineAdapter = /** @class */ (function () {
    function OutlineAdapter(documents, provider) {
        this._documents = documents;
        this._provider = provider;
    }
    OutlineAdapter.prototype.provideDocumentSymbols = function (resource, token) {
        var _this = this;
        var doc = this._documents.getDocumentData(resource).document;
        return asThenable(function () { return _this._provider.provideDocumentSymbols(doc, token); }).then(function (value) {
            if (isFalsyOrEmpty(value)) {
                return undefined;
            }
            if (value[0] instanceof DocumentSymbol) {
                return value.map(typeConvert.DocumentSymbol.from);
            }
            else {
                return OutlineAdapter._asDocumentSymbolTree(resource, value);
            }
        });
    };
    OutlineAdapter._asDocumentSymbolTree = function (resource, info) {
        // first sort by start (and end) and then loop over all elements
        // and build a tree based on containment.
        info = info.slice(0).sort(function (a, b) {
            var res = a.location.range.start.compareTo(b.location.range.start);
            if (res === 0) {
                res = b.location.range.end.compareTo(a.location.range.end);
            }
            return res;
        });
        var res = [];
        var parentStack = [];
        for (var i = 0; i < info.length; i++) {
            var element = {
                name: info[i].name,
                kind: typeConvert.SymbolKind.from(info[i].kind),
                containerName: info[i].containerName,
                range: typeConvert.Range.from(info[i].location.range),
                selectionRange: typeConvert.Range.from(info[i].location.range),
                children: []
            };
            while (true) {
                if (parentStack.length === 0) {
                    parentStack.push(element);
                    res.push(element);
                    break;
                }
                var parent_1 = parentStack[parentStack.length - 1];
                if (EditorRange.containsRange(parent_1.range, element.range) && !EditorRange.equalsRange(parent_1.range, element.range)) {
                    parent_1.children.push(element);
                    parentStack.push(element);
                    break;
                }
                parentStack.pop();
            }
        }
        return res;
    };
    return OutlineAdapter;
}());
var CodeLensAdapter = /** @class */ (function () {
    function CodeLensAdapter(_documents, _commands, _heapService, _provider) {
        this._documents = _documents;
        this._commands = _commands;
        this._heapService = _heapService;
        this._provider = _provider;
    }
    CodeLensAdapter.prototype.provideCodeLenses = function (resource, token) {
        var _this = this;
        var doc = this._documents.getDocumentData(resource).document;
        return asThenable(function () { return _this._provider.provideCodeLenses(doc, token); }).then(function (lenses) {
            if (Array.isArray(lenses)) {
                return lenses.map(function (lens) {
                    var id = _this._heapService.keep(lens);
                    return ObjectIdentifier.mixin({
                        range: typeConvert.Range.from(lens.range),
                        command: _this._commands.toInternal(lens.command)
                    }, id);
                });
            }
            return undefined;
        });
    };
    CodeLensAdapter.prototype.resolveCodeLens = function (resource, symbol, token) {
        var _this = this;
        var lens = this._heapService.get(ObjectIdentifier.of(symbol));
        if (!lens) {
            return undefined;
        }
        var resolve;
        if (typeof this._provider.resolveCodeLens !== 'function' || lens.isResolved) {
            resolve = Promise.resolve(lens);
        }
        else {
            resolve = asThenable(function () { return _this._provider.resolveCodeLens(lens, token); });
        }
        return resolve.then(function (newLens) {
            newLens = newLens || lens;
            symbol.command = _this._commands.toInternal(newLens.command || CodeLensAdapter._badCmd);
            return symbol;
        });
    };
    CodeLensAdapter._badCmd = { command: 'missing', title: '<<MISSING COMMAND>>' };
    return CodeLensAdapter;
}());
function convertToDefinitionLinks(value) {
    if (Array.isArray(value)) {
        return value.map(typeConvert.DefinitionLink.from);
    }
    else if (value) {
        return [typeConvert.DefinitionLink.from(value)];
    }
    return undefined;
}
var DefinitionAdapter = /** @class */ (function () {
    function DefinitionAdapter(_documents, _provider) {
        this._documents = _documents;
        this._provider = _provider;
    }
    DefinitionAdapter.prototype.provideDefinition = function (resource, position, token) {
        var _this = this;
        var doc = this._documents.getDocumentData(resource).document;
        var pos = typeConvert.Position.to(position);
        return asThenable(function () { return _this._provider.provideDefinition(doc, pos, token); }).then(convertToDefinitionLinks);
    };
    return DefinitionAdapter;
}());
var DeclarationAdapter = /** @class */ (function () {
    function DeclarationAdapter(_documents, _provider) {
        this._documents = _documents;
        this._provider = _provider;
    }
    DeclarationAdapter.prototype.provideDeclaration = function (resource, position, token) {
        var _this = this;
        var doc = this._documents.getDocumentData(resource).document;
        var pos = typeConvert.Position.to(position);
        return asThenable(function () { return _this._provider.provideDeclaration(doc, pos, token); }).then(convertToDefinitionLinks);
    };
    return DeclarationAdapter;
}());
var ImplementationAdapter = /** @class */ (function () {
    function ImplementationAdapter(_documents, _provider) {
        this._documents = _documents;
        this._provider = _provider;
    }
    ImplementationAdapter.prototype.provideImplementation = function (resource, position, token) {
        var _this = this;
        var doc = this._documents.getDocumentData(resource).document;
        var pos = typeConvert.Position.to(position);
        return asThenable(function () { return _this._provider.provideImplementation(doc, pos, token); }).then(convertToDefinitionLinks);
    };
    return ImplementationAdapter;
}());
var TypeDefinitionAdapter = /** @class */ (function () {
    function TypeDefinitionAdapter(_documents, _provider) {
        this._documents = _documents;
        this._provider = _provider;
    }
    TypeDefinitionAdapter.prototype.provideTypeDefinition = function (resource, position, token) {
        var _this = this;
        var doc = this._documents.getDocumentData(resource).document;
        var pos = typeConvert.Position.to(position);
        return asThenable(function () { return _this._provider.provideTypeDefinition(doc, pos, token); }).then(convertToDefinitionLinks);
    };
    return TypeDefinitionAdapter;
}());
var HoverAdapter = /** @class */ (function () {
    function HoverAdapter(_documents, _provider) {
        this._documents = _documents;
        this._provider = _provider;
    }
    HoverAdapter.prototype.provideHover = function (resource, position, token) {
        var _this = this;
        var doc = this._documents.getDocumentData(resource).document;
        var pos = typeConvert.Position.to(position);
        return asThenable(function () { return _this._provider.provideHover(doc, pos, token); }).then(function (value) {
            if (!value || isFalsyOrEmpty(value.contents)) {
                return undefined;
            }
            if (!value.range) {
                value.range = doc.getWordRangeAtPosition(pos);
            }
            if (!value.range) {
                value.range = new Range(pos, pos);
            }
            return typeConvert.Hover.from(value);
        });
    };
    return HoverAdapter;
}());
var DocumentHighlightAdapter = /** @class */ (function () {
    function DocumentHighlightAdapter(_documents, _provider) {
        this._documents = _documents;
        this._provider = _provider;
    }
    DocumentHighlightAdapter.prototype.provideDocumentHighlights = function (resource, position, token) {
        var _this = this;
        var doc = this._documents.getDocumentData(resource).document;
        var pos = typeConvert.Position.to(position);
        return asThenable(function () { return _this._provider.provideDocumentHighlights(doc, pos, token); }).then(function (value) {
            if (Array.isArray(value)) {
                return value.map(typeConvert.DocumentHighlight.from);
            }
            return undefined;
        });
    };
    return DocumentHighlightAdapter;
}());
var ReferenceAdapter = /** @class */ (function () {
    function ReferenceAdapter(_documents, _provider) {
        this._documents = _documents;
        this._provider = _provider;
    }
    ReferenceAdapter.prototype.provideReferences = function (resource, position, context, token) {
        var _this = this;
        var doc = this._documents.getDocumentData(resource).document;
        var pos = typeConvert.Position.to(position);
        return asThenable(function () { return _this._provider.provideReferences(doc, pos, context, token); }).then(function (value) {
            if (Array.isArray(value)) {
                return value.map(typeConvert.location.from);
            }
            return undefined;
        });
    };
    return ReferenceAdapter;
}());
var CodeActionAdapter = /** @class */ (function () {
    function CodeActionAdapter(_documents, _commands, _diagnostics, _provider, _logService, _extensionId) {
        this._documents = _documents;
        this._commands = _commands;
        this._diagnostics = _diagnostics;
        this._provider = _provider;
        this._logService = _logService;
        this._extensionId = _extensionId;
    }
    CodeActionAdapter.prototype.provideCodeActions = function (resource, rangeOrSelection, context, token) {
        var _this = this;
        var doc = this._documents.getDocumentData(resource).document;
        var ran = Selection.isISelection(rangeOrSelection)
            ? typeConvert.Selection.to(rangeOrSelection)
            : typeConvert.Range.to(rangeOrSelection);
        var allDiagnostics = [];
        for (var _i = 0, _a = this._diagnostics.getDiagnostics(resource); _i < _a.length; _i++) {
            var diagnostic = _a[_i];
            if (ran.intersection(diagnostic.range)) {
                allDiagnostics.push(diagnostic);
            }
        }
        var codeActionContext = {
            diagnostics: allDiagnostics,
            only: context.only ? new CodeActionKind(context.only) : undefined
        };
        return asThenable(function () { return _this._provider.provideCodeActions(doc, ran, codeActionContext, token); }).then(function (commandsOrActions) {
            if (isFalsyOrEmpty(commandsOrActions)) {
                return undefined;
            }
            var result = [];
            for (var _i = 0, commandsOrActions_1 = commandsOrActions; _i < commandsOrActions_1.length; _i++) {
                var candidate = commandsOrActions_1[_i];
                if (!candidate) {
                    continue;
                }
                if (CodeActionAdapter._isCommand(candidate)) {
                    // old school: synthetic code action
                    result.push({
                        _isSynthetic: true,
                        title: candidate.title,
                        command: _this._commands.toInternal(candidate),
                    });
                }
                else {
                    if (codeActionContext.only) {
                        if (!candidate.kind) {
                            _this._logService.warn(_this._extensionId + " - Code actions of kind '" + codeActionContext.only.value + " 'requested but returned code action does not have a 'kind'. Code action will be dropped. Please set 'CodeAction.kind'.");
                        }
                        else if (!codeActionContext.only.contains(candidate.kind)) {
                            _this._logService.warn(_this._extensionId + " -Code actions of kind '" + codeActionContext.only.value + " 'requested but returned code action is of kind '" + candidate.kind.value + "'. Code action will be dropped. Please check 'CodeActionContext.only' to only return requested code actions.");
                        }
                    }
                    // new school: convert code action
                    result.push({
                        title: candidate.title,
                        command: candidate.command && _this._commands.toInternal(candidate.command),
                        diagnostics: candidate.diagnostics && candidate.diagnostics.map(typeConvert.Diagnostic.from),
                        edit: candidate.edit && typeConvert.WorkspaceEdit.from(candidate.edit),
                        kind: candidate.kind && candidate.kind.value
                    });
                }
            }
            return result;
        });
    };
    CodeActionAdapter._isCommand = function (thing) {
        return typeof thing.command === 'string' && typeof thing.title === 'string';
    };
    return CodeActionAdapter;
}());
var DocumentFormattingAdapter = /** @class */ (function () {
    function DocumentFormattingAdapter(_documents, _provider) {
        this._documents = _documents;
        this._provider = _provider;
    }
    DocumentFormattingAdapter.prototype.provideDocumentFormattingEdits = function (resource, options, token) {
        var _this = this;
        var document = this._documents.getDocumentData(resource).document;
        return asThenable(function () { return _this._provider.provideDocumentFormattingEdits(document, options, token); }).then(function (value) {
            if (Array.isArray(value)) {
                return value.map(typeConvert.TextEdit.from);
            }
            return undefined;
        });
    };
    return DocumentFormattingAdapter;
}());
var RangeFormattingAdapter = /** @class */ (function () {
    function RangeFormattingAdapter(_documents, _provider) {
        this._documents = _documents;
        this._provider = _provider;
    }
    RangeFormattingAdapter.prototype.provideDocumentRangeFormattingEdits = function (resource, range, options, token) {
        var _this = this;
        var document = this._documents.getDocumentData(resource).document;
        var ran = typeConvert.Range.to(range);
        return asThenable(function () { return _this._provider.provideDocumentRangeFormattingEdits(document, ran, options, token); }).then(function (value) {
            if (Array.isArray(value)) {
                return value.map(typeConvert.TextEdit.from);
            }
            return undefined;
        });
    };
    return RangeFormattingAdapter;
}());
var OnTypeFormattingAdapter = /** @class */ (function () {
    function OnTypeFormattingAdapter(_documents, _provider) {
        this._documents = _documents;
        this._provider = _provider;
        this.autoFormatTriggerCharacters = []; // not here
    }
    OnTypeFormattingAdapter.prototype.provideOnTypeFormattingEdits = function (resource, position, ch, options, token) {
        var _this = this;
        var document = this._documents.getDocumentData(resource).document;
        var pos = typeConvert.Position.to(position);
        return asThenable(function () { return _this._provider.provideOnTypeFormattingEdits(document, pos, ch, options, token); }).then(function (value) {
            if (Array.isArray(value)) {
                return value.map(typeConvert.TextEdit.from);
            }
            return undefined;
        });
    };
    return OnTypeFormattingAdapter;
}());
var NavigateTypeAdapter = /** @class */ (function () {
    function NavigateTypeAdapter(provider) {
        this._symbolCache = Object.create(null);
        this._resultCache = Object.create(null);
        this._provider = provider;
    }
    NavigateTypeAdapter.prototype.provideWorkspaceSymbols = function (search, token) {
        var _this = this;
        var result = IdObject.mixin({ symbols: [] });
        return asThenable(function () { return _this._provider.provideWorkspaceSymbols(search, token); }).then(function (value) {
            if (!isFalsyOrEmpty(value)) {
                for (var _i = 0, value_1 = value; _i < value_1.length; _i++) {
                    var item = value_1[_i];
                    if (!item) {
                        // drop
                        continue;
                    }
                    if (!item.name) {
                        console.warn('INVALID SymbolInformation, lacks name', item);
                        continue;
                    }
                    var symbol = IdObject.mixin(typeConvert.WorkspaceSymbol.from(item));
                    _this._symbolCache[symbol._id] = item;
                    result.symbols.push(symbol);
                }
            }
        }).then(function () {
            if (result.symbols.length > 0) {
                _this._resultCache[result._id] = [result.symbols[0]._id, result.symbols[result.symbols.length - 1]._id];
            }
            return result;
        });
    };
    NavigateTypeAdapter.prototype.resolveWorkspaceSymbol = function (symbol, token) {
        var _this = this;
        if (typeof this._provider.resolveWorkspaceSymbol !== 'function') {
            return Promise.resolve(symbol);
        }
        var item = this._symbolCache[symbol._id];
        if (item) {
            return asThenable(function () { return _this._provider.resolveWorkspaceSymbol(item, token); }).then(function (value) {
                return value && mixin(symbol, typeConvert.WorkspaceSymbol.from(value), true);
            });
        }
        return undefined;
    };
    NavigateTypeAdapter.prototype.releaseWorkspaceSymbols = function (id) {
        var range = this._resultCache[id];
        if (range) {
            for (var from = range[0], to = range[1]; from <= to; from++) {
                delete this._symbolCache[from];
            }
            delete this._resultCache[id];
        }
    };
    return NavigateTypeAdapter;
}());
var RenameAdapter = /** @class */ (function () {
    function RenameAdapter(_documents, _provider) {
        this._documents = _documents;
        this._provider = _provider;
    }
    RenameAdapter.supportsResolving = function (provider) {
        return typeof provider.prepareRename === 'function';
    };
    RenameAdapter.prototype.provideRenameEdits = function (resource, position, newName, token) {
        var _this = this;
        var doc = this._documents.getDocumentData(resource).document;
        var pos = typeConvert.Position.to(position);
        return asThenable(function () { return _this._provider.provideRenameEdits(doc, pos, newName, token); }).then(function (value) {
            if (!value) {
                return undefined;
            }
            return typeConvert.WorkspaceEdit.from(value);
        }, function (err) {
            var rejectReason = RenameAdapter._asMessage(err);
            if (rejectReason) {
                return { rejectReason: rejectReason, edits: undefined };
            }
            else {
                // generic error
                return Promise.reject(err);
            }
        });
    };
    RenameAdapter.prototype.resolveRenameLocation = function (resource, position, token) {
        var _this = this;
        if (typeof this._provider.prepareRename !== 'function') {
            return Promise.resolve(undefined);
        }
        var doc = this._documents.getDocumentData(resource).document;
        var pos = typeConvert.Position.to(position);
        return asThenable(function () { return _this._provider.prepareRename(doc, pos, token); }).then(function (rangeOrLocation) {
            var range;
            var text;
            if (Range.isRange(rangeOrLocation)) {
                range = rangeOrLocation;
                text = doc.getText(rangeOrLocation);
            }
            else if (isObject(rangeOrLocation)) {
                range = rangeOrLocation.range;
                text = rangeOrLocation.placeholder;
            }
            if (!range) {
                return undefined;
            }
            if (range.start.line > pos.line || range.end.line < pos.line) {
                console.warn('INVALID rename location: position line must be within range start/end lines');
                return undefined;
            }
            return { range: typeConvert.Range.from(range), text: text };
        }, function (err) {
            var rejectReason = RenameAdapter._asMessage(err);
            if (rejectReason) {
                return { rejectReason: rejectReason, range: undefined, text: undefined };
            }
            else {
                return Promise.reject(err);
            }
        });
    };
    RenameAdapter._asMessage = function (err) {
        if (typeof err === 'string') {
            return err;
        }
        else if (err instanceof Error && typeof err.message === 'string') {
            return err.message;
        }
        else {
            return undefined;
        }
    };
    return RenameAdapter;
}());
var SuggestAdapter = /** @class */ (function () {
    function SuggestAdapter(documents, commands, provider) {
        this._cache = new Map();
        this._idPool = 0;
        this._documents = documents;
        this._commands = commands;
        this._provider = provider;
    }
    SuggestAdapter.supportsResolving = function (provider) {
        return typeof provider.resolveCompletionItem === 'function';
    };
    SuggestAdapter.prototype.provideCompletionItems = function (resource, position, context, token) {
        var _this = this;
        var doc = this._documents.getDocumentData(resource).document;
        var pos = typeConvert.Position.to(position);
        return asThenable(function () { return _this._provider.provideCompletionItems(doc, pos, token, typeConvert.CompletionContext.to(context)); }).then(function (value) {
            var _id = _this._idPool++;
            var result = {
                _id: _id,
                suggestions: [],
            };
            var list;
            if (!value) {
                // undefined and null are valid results
                return undefined;
            }
            else if (Array.isArray(value)) {
                list = new CompletionList(value);
            }
            else {
                list = value;
                result.incomplete = list.isIncomplete;
            }
            // the default text edit range
            var wordRangeBeforePos = (doc.getWordRangeAtPosition(pos) || new Range(pos, pos))
                .with({ end: pos });
            for (var i = 0; i < list.items.length; i++) {
                var suggestion = _this._convertCompletionItem(list.items[i], pos, wordRangeBeforePos, i, _id);
                // check for bad completion item
                // for the converter did warn
                if (suggestion) {
                    result.suggestions.push(suggestion);
                }
            }
            _this._cache.set(_id, list.items);
            return result;
        });
    };
    SuggestAdapter.prototype.resolveCompletionItem = function (resource, position, suggestion, token) {
        var _this = this;
        if (typeof this._provider.resolveCompletionItem !== 'function') {
            return Promise.resolve(suggestion);
        }
        var _a = suggestion, _parentId = _a._parentId, _id = _a._id;
        var item = this._cache.has(_parentId) && this._cache.get(_parentId)[_id];
        if (!item) {
            return Promise.resolve(suggestion);
        }
        return asThenable(function () { return _this._provider.resolveCompletionItem(item, token); }).then(function (resolvedItem) {
            if (!resolvedItem) {
                return suggestion;
            }
            var doc = _this._documents.getDocumentData(resource).document;
            var pos = typeConvert.Position.to(position);
            var wordRangeBeforePos = (doc.getWordRangeAtPosition(pos) || new Range(pos, pos)).with({ end: pos });
            var newSuggestion = _this._convertCompletionItem(resolvedItem, pos, wordRangeBeforePos, _id, _parentId);
            if (newSuggestion) {
                mixin(suggestion, newSuggestion, true);
            }
            return suggestion;
        });
    };
    SuggestAdapter.prototype.releaseCompletionItems = function (id) {
        this._cache.delete(id);
    };
    SuggestAdapter.prototype._convertCompletionItem = function (item, position, defaultRange, _id, _parentId) {
        if (typeof item.label !== 'string' || item.label.length === 0) {
            console.warn('INVALID text edit -> must have at least a label');
            return undefined;
        }
        var result = {
            //
            _id: _id,
            _parentId: _parentId,
            //
            label: item.label,
            kind: typeConvert.CompletionItemKind.from(item.kind),
            detail: item.detail,
            documentation: typeConvert.MarkdownString.from(item.documentation),
            filterText: item.filterText,
            sortText: item.sortText,
            preselect: item.preselect,
            //
            range: undefined,
            insertText: undefined,
            insertTextRules: typeConvert.CompletionItemInsertTextRule.from(item.insertTextRules),
            additionalTextEdits: item.additionalTextEdits && item.additionalTextEdits.map(typeConvert.TextEdit.from),
            command: this._commands.toInternal(item.command),
            commitCharacters: item.commitCharacters,
            // help with perf
            _labelLow: item.label.toLowerCase(),
            _filterTextLow: item.filterText && item.filterText.toLowerCase(),
            _sortTextLow: item.sortText && item.sortText.toLowerCase()
        };
        // 'insertText'-logic
        if (item.textEdit) {
            result.insertText = item.textEdit.newText;
        }
        else if (typeof item.insertText === 'string') {
            result.insertText = item.insertText;
        }
        else if (item.insertText instanceof SnippetString) {
            result.insertText = item.insertText.value;
            result.insertTextRules += 4 /* InsertAsSnippet */;
        }
        else {
            result.insertText = item.label;
        }
        // 'overwrite[Before|After]'-logic
        var range;
        if (item.textEdit) {
            range = item.textEdit.range;
        }
        else if (item.range) {
            range = item.range;
        }
        else {
            range = defaultRange;
        }
        result.range = typeConvert.Range.from(range);
        if (!range.isSingleLine || range.start.line !== position.line) {
            console.warn('INVALID text edit -> must be single line and on the same line');
            return undefined;
        }
        return result;
    };
    return SuggestAdapter;
}());
var SignatureHelpAdapter = /** @class */ (function () {
    function SignatureHelpAdapter(_documents, _provider) {
        this._documents = _documents;
        this._provider = _provider;
    }
    SignatureHelpAdapter.prototype.provideSignatureHelp = function (resource, position, context, token) {
        var _this = this;
        var doc = this._documents.getDocumentData(resource).document;
        var pos = typeConvert.Position.to(position);
        return asThenable(function () { return _this._provider.provideSignatureHelp(doc, pos, token, context); }).then(function (value) {
            if (value) {
                return typeConvert.SignatureHelp.from(value);
            }
            return undefined;
        });
    };
    return SignatureHelpAdapter;
}());
var LinkProviderAdapter = /** @class */ (function () {
    function LinkProviderAdapter(_documents, _heapService, _provider) {
        this._documents = _documents;
        this._heapService = _heapService;
        this._provider = _provider;
    }
    LinkProviderAdapter.prototype.provideLinks = function (resource, token) {
        var _this = this;
        var doc = this._documents.getDocumentData(resource).document;
        return asThenable(function () { return _this._provider.provideDocumentLinks(doc, token); }).then(function (links) {
            if (!Array.isArray(links)) {
                return undefined;
            }
            var result = [];
            for (var _i = 0, links_1 = links; _i < links_1.length; _i++) {
                var link = links_1[_i];
                var data = typeConvert.DocumentLink.from(link);
                var id = _this._heapService.keep(link);
                ObjectIdentifier.mixin(data, id);
                result.push(data);
            }
            return result;
        });
    };
    LinkProviderAdapter.prototype.resolveLink = function (link, token) {
        var _this = this;
        if (typeof this._provider.resolveDocumentLink !== 'function') {
            return undefined;
        }
        var id = ObjectIdentifier.of(link);
        var item = this._heapService.get(id);
        if (!item) {
            return undefined;
        }
        return asThenable(function () { return _this._provider.resolveDocumentLink(item, token); }).then(function (value) {
            if (value) {
                return typeConvert.DocumentLink.from(value);
            }
            return undefined;
        });
    };
    return LinkProviderAdapter;
}());
var ColorProviderAdapter = /** @class */ (function () {
    function ColorProviderAdapter(_documents, _provider) {
        this._documents = _documents;
        this._provider = _provider;
    }
    ColorProviderAdapter.prototype.provideColors = function (resource, token) {
        var _this = this;
        var doc = this._documents.getDocumentData(resource).document;
        return asThenable(function () { return _this._provider.provideDocumentColors(doc, token); }).then(function (colors) {
            if (!Array.isArray(colors)) {
                return [];
            }
            var colorInfos = colors.map(function (ci) {
                return {
                    color: typeConvert.Color.from(ci.color),
                    range: typeConvert.Range.from(ci.range)
                };
            });
            return colorInfos;
        });
    };
    ColorProviderAdapter.prototype.provideColorPresentations = function (resource, raw, token) {
        var _this = this;
        var document = this._documents.getDocumentData(resource).document;
        var range = typeConvert.Range.to(raw.range);
        var color = typeConvert.Color.to(raw.color);
        return asThenable(function () { return _this._provider.provideColorPresentations(color, { document: document, range: range }, token); }).then(function (value) {
            return value.map(typeConvert.ColorPresentation.from);
        });
    };
    return ColorProviderAdapter;
}());
var FoldingProviderAdapter = /** @class */ (function () {
    function FoldingProviderAdapter(_documents, _provider) {
        this._documents = _documents;
        this._provider = _provider;
    }
    FoldingProviderAdapter.prototype.provideFoldingRanges = function (resource, context, token) {
        var _this = this;
        var doc = this._documents.getDocumentData(resource).document;
        return asThenable(function () { return _this._provider.provideFoldingRanges(doc, context, token); }).then(function (ranges) {
            if (!Array.isArray(ranges)) {
                return void 0;
            }
            return ranges.map(typeConvert.FoldingRange.from);
        });
    };
    return FoldingProviderAdapter;
}());
var AdapterData = /** @class */ (function () {
    function AdapterData(adapter, extension) {
        this.adapter = adapter;
        this.extension = extension;
    }
    return AdapterData;
}());
var ExtHostLanguageFeatures = /** @class */ (function () {
    function ExtHostLanguageFeatures(mainContext, schemeTransformer, documents, commands, heapMonitor, diagnostics, logService) {
        this._adapter = new Map();
        this._schemeTransformer = schemeTransformer;
        this._proxy = mainContext.getProxy(MainContext.MainThreadLanguageFeatures);
        this._documents = documents;
        this._commands = commands;
        this._heapService = heapMonitor;
        this._diagnostics = diagnostics;
        this._logService = logService;
    }
    ExtHostLanguageFeatures.prototype._transformDocumentSelector = function (selector) {
        var _this = this;
        if (Array.isArray(selector)) {
            return selector.map(function (sel) { return _this._doTransformDocumentSelector(sel); });
        }
        return [this._doTransformDocumentSelector(selector)];
    };
    ExtHostLanguageFeatures.prototype._doTransformDocumentSelector = function (selector) {
        if (typeof selector === 'string') {
            return {
                $serialized: true,
                language: selector
            };
        }
        if (selector) {
            return {
                $serialized: true,
                language: selector.language,
                scheme: this._transformScheme(selector.scheme),
                pattern: selector.pattern,
                exclusive: selector.exclusive
            };
        }
        return undefined;
    };
    ExtHostLanguageFeatures.prototype._transformScheme = function (scheme) {
        if (this._schemeTransformer && typeof scheme === 'string') {
            return this._schemeTransformer.transformOutgoing(scheme);
        }
        return scheme;
    };
    ExtHostLanguageFeatures.prototype._createDisposable = function (handle) {
        var _this = this;
        return new Disposable(function () {
            _this._adapter.delete(handle);
            _this._proxy.$unregister(handle);
        });
    };
    ExtHostLanguageFeatures.prototype._nextHandle = function () {
        return ExtHostLanguageFeatures._handlePool++;
    };
    ExtHostLanguageFeatures.prototype._withAdapter = function (handle, ctor, callback) {
        var _this = this;
        var data = this._adapter.get(handle);
        if (data.adapter instanceof ctor) {
            var t1_1;
            if (data.extension) {
                t1_1 = Date.now();
                this._logService.trace("[" + data.extension.id + "] INVOKE provider '" + ctor.name + "'");
            }
            var p = callback(data.adapter);
            if (data.extension) {
                Promise.resolve(p).then(function () { return _this._logService.trace("[" + data.extension.id + "] provider DONE after " + (Date.now() - t1_1) + "ms"); }, function (err) { return _this._logService.trace("[" + data.extension.id + "] provider FAILED", err); });
            }
            return p;
        }
        return Promise.reject(new Error('no adapter found'));
    };
    ExtHostLanguageFeatures.prototype._addNewAdapter = function (adapter, extension) {
        var handle = this._nextHandle();
        this._adapter.set(handle, new AdapterData(adapter, extension));
        return handle;
    };
    // --- outline
    ExtHostLanguageFeatures.prototype.registerDocumentSymbolProvider = function (extension, selector, provider) {
        var handle = this._addNewAdapter(new OutlineAdapter(this._documents, provider), extension);
        this._proxy.$registerOutlineSupport(handle, this._transformDocumentSelector(selector), extension ? extension.displayName || extension.name : undefined);
        return this._createDisposable(handle);
    };
    ExtHostLanguageFeatures.prototype.$provideDocumentSymbols = function (handle, resource, token) {
        return this._withAdapter(handle, OutlineAdapter, function (adapter) { return adapter.provideDocumentSymbols(URI.revive(resource), token); });
    };
    // --- code lens
    ExtHostLanguageFeatures.prototype.registerCodeLensProvider = function (extension, selector, provider) {
        var _this = this;
        var handle = this._nextHandle();
        var eventHandle = typeof provider.onDidChangeCodeLenses === 'function' ? this._nextHandle() : undefined;
        this._adapter.set(handle, new AdapterData(new CodeLensAdapter(this._documents, this._commands.converter, this._heapService, provider), extension));
        this._proxy.$registerCodeLensSupport(handle, this._transformDocumentSelector(selector), eventHandle);
        var result = this._createDisposable(handle);
        if (eventHandle !== undefined) {
            var subscription = provider.onDidChangeCodeLenses(function (_) { return _this._proxy.$emitCodeLensEvent(eventHandle); });
            result = Disposable.from(result, subscription);
        }
        return result;
    };
    ExtHostLanguageFeatures.prototype.$provideCodeLenses = function (handle, resource, token) {
        return this._withAdapter(handle, CodeLensAdapter, function (adapter) { return adapter.provideCodeLenses(URI.revive(resource), token); });
    };
    ExtHostLanguageFeatures.prototype.$resolveCodeLens = function (handle, resource, symbol, token) {
        return this._withAdapter(handle, CodeLensAdapter, function (adapter) { return adapter.resolveCodeLens(URI.revive(resource), symbol, token); });
    };
    // --- declaration
    ExtHostLanguageFeatures.prototype.registerDefinitionProvider = function (extension, selector, provider) {
        var handle = this._addNewAdapter(new DefinitionAdapter(this._documents, provider), extension);
        this._proxy.$registerDefinitionSupport(handle, this._transformDocumentSelector(selector));
        return this._createDisposable(handle);
    };
    ExtHostLanguageFeatures.prototype.$provideDefinition = function (handle, resource, position, token) {
        return this._withAdapter(handle, DefinitionAdapter, function (adapter) { return adapter.provideDefinition(URI.revive(resource), position, token); });
    };
    ExtHostLanguageFeatures.prototype.registerDeclarationProvider = function (extension, selector, provider) {
        var handle = this._addNewAdapter(new DeclarationAdapter(this._documents, provider), extension);
        this._proxy.$registerDeclarationSupport(handle, this._transformDocumentSelector(selector));
        return this._createDisposable(handle);
    };
    ExtHostLanguageFeatures.prototype.$provideDeclaration = function (handle, resource, position, token) {
        return this._withAdapter(handle, DeclarationAdapter, function (adapter) { return adapter.provideDeclaration(URI.revive(resource), position, token); });
    };
    ExtHostLanguageFeatures.prototype.registerImplementationProvider = function (extension, selector, provider) {
        var handle = this._addNewAdapter(new ImplementationAdapter(this._documents, provider), extension);
        this._proxy.$registerImplementationSupport(handle, this._transformDocumentSelector(selector));
        return this._createDisposable(handle);
    };
    ExtHostLanguageFeatures.prototype.$provideImplementation = function (handle, resource, position, token) {
        return this._withAdapter(handle, ImplementationAdapter, function (adapter) { return adapter.provideImplementation(URI.revive(resource), position, token); });
    };
    ExtHostLanguageFeatures.prototype.registerTypeDefinitionProvider = function (extension, selector, provider) {
        var handle = this._addNewAdapter(new TypeDefinitionAdapter(this._documents, provider), extension);
        this._proxy.$registerTypeDefinitionSupport(handle, this._transformDocumentSelector(selector));
        return this._createDisposable(handle);
    };
    ExtHostLanguageFeatures.prototype.$provideTypeDefinition = function (handle, resource, position, token) {
        return this._withAdapter(handle, TypeDefinitionAdapter, function (adapter) { return adapter.provideTypeDefinition(URI.revive(resource), position, token); });
    };
    // --- extra info
    ExtHostLanguageFeatures.prototype.registerHoverProvider = function (extension, selector, provider, extensionId) {
        var handle = this._addNewAdapter(new HoverAdapter(this._documents, provider), extension);
        this._proxy.$registerHoverProvider(handle, this._transformDocumentSelector(selector));
        return this._createDisposable(handle);
    };
    ExtHostLanguageFeatures.prototype.$provideHover = function (handle, resource, position, token) {
        return this._withAdapter(handle, HoverAdapter, function (adapter) { return adapter.provideHover(URI.revive(resource), position, token); });
    };
    // --- occurrences
    ExtHostLanguageFeatures.prototype.registerDocumentHighlightProvider = function (extension, selector, provider) {
        var handle = this._addNewAdapter(new DocumentHighlightAdapter(this._documents, provider), extension);
        this._proxy.$registerDocumentHighlightProvider(handle, this._transformDocumentSelector(selector));
        return this._createDisposable(handle);
    };
    ExtHostLanguageFeatures.prototype.$provideDocumentHighlights = function (handle, resource, position, token) {
        return this._withAdapter(handle, DocumentHighlightAdapter, function (adapter) { return adapter.provideDocumentHighlights(URI.revive(resource), position, token); });
    };
    // --- references
    ExtHostLanguageFeatures.prototype.registerReferenceProvider = function (extension, selector, provider) {
        var handle = this._addNewAdapter(new ReferenceAdapter(this._documents, provider), extension);
        this._proxy.$registerReferenceSupport(handle, this._transformDocumentSelector(selector));
        return this._createDisposable(handle);
    };
    ExtHostLanguageFeatures.prototype.$provideReferences = function (handle, resource, position, context, token) {
        return this._withAdapter(handle, ReferenceAdapter, function (adapter) { return adapter.provideReferences(URI.revive(resource), position, context, token); });
    };
    // --- quick fix
    ExtHostLanguageFeatures.prototype.registerCodeActionProvider = function (extension, selector, provider, metadata) {
        var handle = this._addNewAdapter(new CodeActionAdapter(this._documents, this._commands.converter, this._diagnostics, provider, this._logService, extension.id), extension);
        this._proxy.$registerQuickFixSupport(handle, this._transformDocumentSelector(selector), metadata && metadata.providedCodeActionKinds ? metadata.providedCodeActionKinds.map(function (kind) { return kind.value; }) : undefined);
        return this._createDisposable(handle);
    };
    ExtHostLanguageFeatures.prototype.$provideCodeActions = function (handle, resource, rangeOrSelection, context, token) {
        return this._withAdapter(handle, CodeActionAdapter, function (adapter) { return adapter.provideCodeActions(URI.revive(resource), rangeOrSelection, context, token); });
    };
    // --- formatting
    ExtHostLanguageFeatures.prototype.registerDocumentFormattingEditProvider = function (extension, selector, provider) {
        var handle = this._addNewAdapter(new DocumentFormattingAdapter(this._documents, provider), extension);
        this._proxy.$registerDocumentFormattingSupport(handle, this._transformDocumentSelector(selector));
        return this._createDisposable(handle);
    };
    ExtHostLanguageFeatures.prototype.$provideDocumentFormattingEdits = function (handle, resource, options, token) {
        return this._withAdapter(handle, DocumentFormattingAdapter, function (adapter) { return adapter.provideDocumentFormattingEdits(URI.revive(resource), options, token); });
    };
    ExtHostLanguageFeatures.prototype.registerDocumentRangeFormattingEditProvider = function (extension, selector, provider) {
        var handle = this._addNewAdapter(new RangeFormattingAdapter(this._documents, provider), extension);
        this._proxy.$registerRangeFormattingSupport(handle, this._transformDocumentSelector(selector));
        return this._createDisposable(handle);
    };
    ExtHostLanguageFeatures.prototype.$provideDocumentRangeFormattingEdits = function (handle, resource, range, options, token) {
        return this._withAdapter(handle, RangeFormattingAdapter, function (adapter) { return adapter.provideDocumentRangeFormattingEdits(URI.revive(resource), range, options, token); });
    };
    ExtHostLanguageFeatures.prototype.registerOnTypeFormattingEditProvider = function (extension, selector, provider, triggerCharacters) {
        var handle = this._addNewAdapter(new OnTypeFormattingAdapter(this._documents, provider), extension);
        this._proxy.$registerOnTypeFormattingSupport(handle, this._transformDocumentSelector(selector), triggerCharacters);
        return this._createDisposable(handle);
    };
    ExtHostLanguageFeatures.prototype.$provideOnTypeFormattingEdits = function (handle, resource, position, ch, options, token) {
        return this._withAdapter(handle, OnTypeFormattingAdapter, function (adapter) { return adapter.provideOnTypeFormattingEdits(URI.revive(resource), position, ch, options, token); });
    };
    // --- navigate types
    ExtHostLanguageFeatures.prototype.registerWorkspaceSymbolProvider = function (extension, provider) {
        var handle = this._addNewAdapter(new NavigateTypeAdapter(provider), extension);
        this._proxy.$registerNavigateTypeSupport(handle);
        return this._createDisposable(handle);
    };
    ExtHostLanguageFeatures.prototype.$provideWorkspaceSymbols = function (handle, search, token) {
        return this._withAdapter(handle, NavigateTypeAdapter, function (adapter) { return adapter.provideWorkspaceSymbols(search, token); });
    };
    ExtHostLanguageFeatures.prototype.$resolveWorkspaceSymbol = function (handle, symbol, token) {
        return this._withAdapter(handle, NavigateTypeAdapter, function (adapter) { return adapter.resolveWorkspaceSymbol(symbol, token); });
    };
    ExtHostLanguageFeatures.prototype.$releaseWorkspaceSymbols = function (handle, id) {
        this._withAdapter(handle, NavigateTypeAdapter, function (adapter) { return adapter.releaseWorkspaceSymbols(id); });
    };
    // --- rename
    ExtHostLanguageFeatures.prototype.registerRenameProvider = function (extension, selector, provider) {
        var handle = this._addNewAdapter(new RenameAdapter(this._documents, provider), extension);
        this._proxy.$registerRenameSupport(handle, this._transformDocumentSelector(selector), RenameAdapter.supportsResolving(provider));
        return this._createDisposable(handle);
    };
    ExtHostLanguageFeatures.prototype.$provideRenameEdits = function (handle, resource, position, newName, token) {
        return this._withAdapter(handle, RenameAdapter, function (adapter) { return adapter.provideRenameEdits(URI.revive(resource), position, newName, token); });
    };
    ExtHostLanguageFeatures.prototype.$resolveRenameLocation = function (handle, resource, position, token) {
        return this._withAdapter(handle, RenameAdapter, function (adapter) { return adapter.resolveRenameLocation(URI.revive(resource), position, token); });
    };
    // --- suggestion
    ExtHostLanguageFeatures.prototype.registerCompletionItemProvider = function (extension, selector, provider, triggerCharacters) {
        var handle = this._addNewAdapter(new SuggestAdapter(this._documents, this._commands.converter, provider), extension);
        this._proxy.$registerSuggestSupport(handle, this._transformDocumentSelector(selector), triggerCharacters, SuggestAdapter.supportsResolving(provider));
        return this._createDisposable(handle);
    };
    ExtHostLanguageFeatures.prototype.$provideCompletionItems = function (handle, resource, position, context, token) {
        return this._withAdapter(handle, SuggestAdapter, function (adapter) { return adapter.provideCompletionItems(URI.revive(resource), position, context, token); });
    };
    ExtHostLanguageFeatures.prototype.$resolveCompletionItem = function (handle, resource, position, suggestion, token) {
        return this._withAdapter(handle, SuggestAdapter, function (adapter) { return adapter.resolveCompletionItem(URI.revive(resource), position, suggestion, token); });
    };
    ExtHostLanguageFeatures.prototype.$releaseCompletionItems = function (handle, id) {
        this._withAdapter(handle, SuggestAdapter, function (adapter) { return adapter.releaseCompletionItems(id); });
    };
    // --- parameter hints
    ExtHostLanguageFeatures.prototype.registerSignatureHelpProvider = function (extension, selector, provider, metadataOrTriggerChars) {
        var metadata = Array.isArray(metadataOrTriggerChars)
            ? { triggerCharacters: metadataOrTriggerChars, retriggerCharacters: [] }
            : metadataOrTriggerChars;
        var handle = this._addNewAdapter(new SignatureHelpAdapter(this._documents, provider), extension);
        this._proxy.$registerSignatureHelpProvider(handle, this._transformDocumentSelector(selector), metadata);
        return this._createDisposable(handle);
    };
    ExtHostLanguageFeatures.prototype.$provideSignatureHelp = function (handle, resource, position, context, token) {
        return this._withAdapter(handle, SignatureHelpAdapter, function (adapter) { return adapter.provideSignatureHelp(URI.revive(resource), position, context, token); });
    };
    // --- links
    ExtHostLanguageFeatures.prototype.registerDocumentLinkProvider = function (extension, selector, provider) {
        var handle = this._addNewAdapter(new LinkProviderAdapter(this._documents, this._heapService, provider), extension);
        this._proxy.$registerDocumentLinkProvider(handle, this._transformDocumentSelector(selector));
        return this._createDisposable(handle);
    };
    ExtHostLanguageFeatures.prototype.$provideDocumentLinks = function (handle, resource, token) {
        return this._withAdapter(handle, LinkProviderAdapter, function (adapter) { return adapter.provideLinks(URI.revive(resource), token); });
    };
    ExtHostLanguageFeatures.prototype.$resolveDocumentLink = function (handle, link, token) {
        return this._withAdapter(handle, LinkProviderAdapter, function (adapter) { return adapter.resolveLink(link, token); });
    };
    ExtHostLanguageFeatures.prototype.registerColorProvider = function (extension, selector, provider) {
        var handle = this._addNewAdapter(new ColorProviderAdapter(this._documents, provider), extension);
        this._proxy.$registerDocumentColorProvider(handle, this._transformDocumentSelector(selector));
        return this._createDisposable(handle);
    };
    ExtHostLanguageFeatures.prototype.$provideDocumentColors = function (handle, resource, token) {
        return this._withAdapter(handle, ColorProviderAdapter, function (adapter) { return adapter.provideColors(URI.revive(resource), token); });
    };
    ExtHostLanguageFeatures.prototype.$provideColorPresentations = function (handle, resource, colorInfo, token) {
        return this._withAdapter(handle, ColorProviderAdapter, function (adapter) { return adapter.provideColorPresentations(URI.revive(resource), colorInfo, token); });
    };
    ExtHostLanguageFeatures.prototype.registerFoldingRangeProvider = function (extension, selector, provider) {
        var handle = this._addNewAdapter(new FoldingProviderAdapter(this._documents, provider), extension);
        this._proxy.$registerFoldingRangeProvider(handle, this._transformDocumentSelector(selector));
        return this._createDisposable(handle);
    };
    ExtHostLanguageFeatures.prototype.$provideFoldingRanges = function (handle, resource, context, token) {
        return this._withAdapter(handle, FoldingProviderAdapter, function (adapter) { return adapter.provideFoldingRanges(URI.revive(resource), context, token); });
    };
    // --- configuration
    ExtHostLanguageFeatures._serializeRegExp = function (regExp) {
        if (typeof regExp === 'undefined') {
            return undefined;
        }
        if (regExp === null) {
            return null;
        }
        return {
            pattern: regExp.source,
            flags: (regExp.global ? 'g' : '') + (regExp.ignoreCase ? 'i' : '') + (regExp.multiline ? 'm' : ''),
        };
    };
    ExtHostLanguageFeatures._serializeIndentationRule = function (indentationRule) {
        if (typeof indentationRule === 'undefined') {
            return undefined;
        }
        if (indentationRule === null) {
            return null;
        }
        return {
            decreaseIndentPattern: ExtHostLanguageFeatures._serializeRegExp(indentationRule.decreaseIndentPattern),
            increaseIndentPattern: ExtHostLanguageFeatures._serializeRegExp(indentationRule.increaseIndentPattern),
            indentNextLinePattern: ExtHostLanguageFeatures._serializeRegExp(indentationRule.indentNextLinePattern),
            unIndentedLinePattern: ExtHostLanguageFeatures._serializeRegExp(indentationRule.unIndentedLinePattern),
        };
    };
    ExtHostLanguageFeatures._serializeOnEnterRule = function (onEnterRule) {
        return {
            beforeText: ExtHostLanguageFeatures._serializeRegExp(onEnterRule.beforeText),
            afterText: ExtHostLanguageFeatures._serializeRegExp(onEnterRule.afterText),
            oneLineAboveText: ExtHostLanguageFeatures._serializeRegExp(onEnterRule.oneLineAboveText),
            action: onEnterRule.action
        };
    };
    ExtHostLanguageFeatures._serializeOnEnterRules = function (onEnterRules) {
        if (typeof onEnterRules === 'undefined') {
            return undefined;
        }
        if (onEnterRules === null) {
            return null;
        }
        return onEnterRules.map(ExtHostLanguageFeatures._serializeOnEnterRule);
    };
    ExtHostLanguageFeatures.prototype.setLanguageConfiguration = function (languageId, configuration) {
        var wordPattern = configuration.wordPattern;
        // check for a valid word pattern
        if (wordPattern && regExpLeadsToEndlessLoop(wordPattern)) {
            throw new Error("Invalid language configuration: wordPattern '" + wordPattern + "' is not allowed to match the empty string.");
        }
        // word definition
        if (wordPattern) {
            this._documents.setWordDefinitionFor(languageId, wordPattern);
        }
        else {
            this._documents.setWordDefinitionFor(languageId, null);
        }
        var handle = this._nextHandle();
        var serializedConfiguration = {
            comments: configuration.comments,
            brackets: configuration.brackets,
            wordPattern: ExtHostLanguageFeatures._serializeRegExp(configuration.wordPattern),
            indentationRules: ExtHostLanguageFeatures._serializeIndentationRule(configuration.indentationRules),
            onEnterRules: ExtHostLanguageFeatures._serializeOnEnterRules(configuration.onEnterRules),
            __electricCharacterSupport: configuration.__electricCharacterSupport,
            __characterPairSupport: configuration.__characterPairSupport,
        };
        this._proxy.$setLanguageConfiguration(handle, languageId, serializedConfiguration);
        return this._createDisposable(handle);
    };
    ExtHostLanguageFeatures._handlePool = 0;
    return ExtHostLanguageFeatures;
}());
export { ExtHostLanguageFeatures };
