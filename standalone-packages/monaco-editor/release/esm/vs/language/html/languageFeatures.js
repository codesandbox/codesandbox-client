/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import * as ls from './_deps/vscode-languageserver-types/main.js';
var Uri = monaco.Uri;
var Range = monaco.Range;
// --- diagnostics --- ---
var DiagnosticsAdapter = /** @class */ (function () {
    function DiagnosticsAdapter(_languageId, _worker, defaults) {
        var _this = this;
        this._languageId = _languageId;
        this._worker = _worker;
        this._disposables = [];
        this._listener = Object.create(null);
        var onModelAdd = function (model) {
            var modeId = model.getModeId();
            if (modeId !== _this._languageId) {
                return;
            }
            var handle;
            _this._listener[model.uri.toString()] = model.onDidChangeContent(function () {
                clearTimeout(handle);
                handle = setTimeout(function () { return _this._doValidate(model.uri, modeId); }, 500);
            });
            _this._doValidate(model.uri, modeId);
        };
        var onModelRemoved = function (model) {
            monaco.editor.setModelMarkers(model, _this._languageId, []);
            var uriStr = model.uri.toString();
            var listener = _this._listener[uriStr];
            if (listener) {
                listener.dispose();
                delete _this._listener[uriStr];
            }
        };
        this._disposables.push(monaco.editor.onDidCreateModel(onModelAdd));
        this._disposables.push(monaco.editor.onWillDisposeModel(function (model) {
            onModelRemoved(model);
        }));
        this._disposables.push(monaco.editor.onDidChangeModelLanguage(function (event) {
            onModelRemoved(event.model);
            onModelAdd(event.model);
        }));
        this._disposables.push(defaults.onDidChange(function (_) {
            monaco.editor.getModels().forEach(function (model) {
                if (model.getModeId() === _this._languageId) {
                    onModelRemoved(model);
                    onModelAdd(model);
                }
            });
        }));
        this._disposables.push({
            dispose: function () {
                for (var key in _this._listener) {
                    _this._listener[key].dispose();
                }
            }
        });
        monaco.editor.getModels().forEach(onModelAdd);
    }
    DiagnosticsAdapter.prototype.dispose = function () {
        this._disposables.forEach(function (d) { return d && d.dispose(); });
        this._disposables = [];
    };
    DiagnosticsAdapter.prototype._doValidate = function (resource, languageId) {
        this._worker(resource).then(function (worker) {
            return worker.doValidation(resource.toString()).then(function (diagnostics) {
                var markers = diagnostics.map(function (d) { return toDiagnostics(resource, d); });
                monaco.editor.setModelMarkers(monaco.editor.getModel(resource), languageId, markers);
            });
        }).then(undefined, function (err) {
            console.error(err);
        });
    };
    return DiagnosticsAdapter;
}());
export { DiagnosticsAdapter };
function toSeverity(lsSeverity) {
    switch (lsSeverity) {
        case ls.DiagnosticSeverity.Error: return monaco.MarkerSeverity.Error;
        case ls.DiagnosticSeverity.Warning: return monaco.MarkerSeverity.Warning;
        case ls.DiagnosticSeverity.Information: return monaco.MarkerSeverity.Info;
        case ls.DiagnosticSeverity.Hint: return monaco.MarkerSeverity.Hint;
        default:
            return monaco.MarkerSeverity.Info;
    }
}
function toDiagnostics(resource, diag) {
    var code = typeof diag.code === 'number' ? String(diag.code) : diag.code;
    return {
        severity: toSeverity(diag.severity),
        startLineNumber: diag.range.start.line + 1,
        startColumn: diag.range.start.character + 1,
        endLineNumber: diag.range.end.line + 1,
        endColumn: diag.range.end.character + 1,
        message: diag.message,
        code: code,
        source: diag.source
    };
}
// --- completion ------
function fromPosition(position) {
    if (!position) {
        return void 0;
    }
    return { character: position.column - 1, line: position.lineNumber - 1 };
}
function fromRange(range) {
    if (!range) {
        return void 0;
    }
    return { start: fromPosition(range.getStartPosition()), end: fromPosition(range.getEndPosition()) };
}
function toRange(range) {
    if (!range) {
        return void 0;
    }
    return new Range(range.start.line + 1, range.start.character + 1, range.end.line + 1, range.end.character + 1);
}
function toCompletionItemKind(kind) {
    var mItemKind = monaco.languages.CompletionItemKind;
    switch (kind) {
        case ls.CompletionItemKind.Text: return mItemKind.Text;
        case ls.CompletionItemKind.Method: return mItemKind.Method;
        case ls.CompletionItemKind.Function: return mItemKind.Function;
        case ls.CompletionItemKind.Constructor: return mItemKind.Constructor;
        case ls.CompletionItemKind.Field: return mItemKind.Field;
        case ls.CompletionItemKind.Variable: return mItemKind.Variable;
        case ls.CompletionItemKind.Class: return mItemKind.Class;
        case ls.CompletionItemKind.Interface: return mItemKind.Interface;
        case ls.CompletionItemKind.Module: return mItemKind.Module;
        case ls.CompletionItemKind.Property: return mItemKind.Property;
        case ls.CompletionItemKind.Unit: return mItemKind.Unit;
        case ls.CompletionItemKind.Value: return mItemKind.Value;
        case ls.CompletionItemKind.Enum: return mItemKind.Enum;
        case ls.CompletionItemKind.Keyword: return mItemKind.Keyword;
        case ls.CompletionItemKind.Snippet: return mItemKind.Snippet;
        case ls.CompletionItemKind.Color: return mItemKind.Color;
        case ls.CompletionItemKind.File: return mItemKind.File;
        case ls.CompletionItemKind.Reference: return mItemKind.Reference;
    }
    return mItemKind.Property;
}
function fromCompletionItemKind(kind) {
    var mItemKind = monaco.languages.CompletionItemKind;
    switch (kind) {
        case mItemKind.Text: return ls.CompletionItemKind.Text;
        case mItemKind.Method: return ls.CompletionItemKind.Method;
        case mItemKind.Function: return ls.CompletionItemKind.Function;
        case mItemKind.Constructor: return ls.CompletionItemKind.Constructor;
        case mItemKind.Field: return ls.CompletionItemKind.Field;
        case mItemKind.Variable: return ls.CompletionItemKind.Variable;
        case mItemKind.Class: return ls.CompletionItemKind.Class;
        case mItemKind.Interface: return ls.CompletionItemKind.Interface;
        case mItemKind.Module: return ls.CompletionItemKind.Module;
        case mItemKind.Property: return ls.CompletionItemKind.Property;
        case mItemKind.Unit: return ls.CompletionItemKind.Unit;
        case mItemKind.Value: return ls.CompletionItemKind.Value;
        case mItemKind.Enum: return ls.CompletionItemKind.Enum;
        case mItemKind.Keyword: return ls.CompletionItemKind.Keyword;
        case mItemKind.Snippet: return ls.CompletionItemKind.Snippet;
        case mItemKind.Color: return ls.CompletionItemKind.Color;
        case mItemKind.File: return ls.CompletionItemKind.File;
        case mItemKind.Reference: return ls.CompletionItemKind.Reference;
    }
    return ls.CompletionItemKind.Property;
}
function toTextEdit(textEdit) {
    if (!textEdit) {
        return void 0;
    }
    return {
        range: toRange(textEdit.range),
        text: textEdit.newText
    };
}
function toCompletionItem(entry) {
    return {
        label: entry.label,
        insertText: entry.insertText,
        sortText: entry.sortText,
        filterText: entry.filterText,
        documentation: entry.documentation,
        detail: entry.detail,
        kind: toCompletionItemKind(entry.kind),
        textEdit: toTextEdit(entry.textEdit),
        data: entry.data
    };
}
function fromMarkdownString(entry) {
    return {
        kind: (typeof entry === 'string' ? ls.MarkupKind.PlainText : ls.MarkupKind.Markdown),
        value: (typeof entry === 'string' ? entry : entry.value)
    };
}
function fromCompletionItem(entry) {
    var item = {
        label: entry.label,
        sortText: entry.sortText,
        filterText: entry.filterText,
        documentation: fromMarkdownString(entry.documentation),
        detail: entry.detail,
        kind: fromCompletionItemKind(entry.kind),
        data: entry.data
    };
    if (typeof entry.insertText === 'object' && typeof entry.insertText.value === 'string') {
        item.insertText = entry.insertText.value;
        item.insertTextFormat = ls.InsertTextFormat.Snippet;
    }
    else {
        item.insertText = entry.insertText;
    }
    if (entry.range) {
        item.textEdit = ls.TextEdit.replace(fromRange(entry.range), item.insertText);
    }
    return item;
}
var CompletionAdapter = /** @class */ (function () {
    function CompletionAdapter(_worker) {
        this._worker = _worker;
    }
    Object.defineProperty(CompletionAdapter.prototype, "triggerCharacters", {
        get: function () {
            return ['.', ':', '<', '"', '=', '/'];
        },
        enumerable: true,
        configurable: true
    });
    CompletionAdapter.prototype.provideCompletionItems = function (model, position, token) {
        var wordInfo = model.getWordUntilPosition(position);
        var resource = model.uri;
        return wireCancellationToken(token, this._worker(resource).then(function (worker) {
            return worker.doComplete(resource.toString(), fromPosition(position));
        }).then(function (info) {
            if (!info) {
                return;
            }
            var items = info.items.map(function (entry) {
                var item = {
                    label: entry.label,
                    insertText: entry.insertText,
                    sortText: entry.sortText,
                    filterText: entry.filterText,
                    documentation: entry.documentation,
                    detail: entry.detail,
                    kind: toCompletionItemKind(entry.kind),
                };
                if (entry.textEdit) {
                    item.range = toRange(entry.textEdit.range);
                    item.insertText = entry.textEdit.newText;
                }
                if (entry.insertTextFormat === ls.InsertTextFormat.Snippet) {
                    item.insertText = { value: item.insertText };
                }
                return item;
            });
            return {
                isIncomplete: info.isIncomplete,
                items: items
            };
        }));
    };
    return CompletionAdapter;
}());
export { CompletionAdapter };
function isMarkupContent(thing) {
    return thing && typeof thing === 'object' && typeof thing.kind === 'string';
}
function toMarkdownString(entry) {
    if (typeof entry === 'string') {
        return {
            value: entry
        };
    }
    if (isMarkupContent(entry)) {
        if (entry.kind === 'plaintext') {
            return {
                value: entry.value.replace(/[\\`*_{}[\]()#+\-.!]/g, '\\$&')
            };
        }
        return {
            value: entry.value
        };
    }
    return { value: '```' + entry.language + '\n' + entry.value + '\n```\n' };
}
function toMarkedStringArray(contents) {
    if (!contents) {
        return void 0;
    }
    if (Array.isArray(contents)) {
        return contents.map(toMarkdownString);
    }
    return [toMarkdownString(contents)];
}
// --- definition ------
function toLocation(location) {
    return {
        uri: Uri.parse(location.uri),
        range: toRange(location.range)
    };
}
// --- document symbols ------
function toSymbolKind(kind) {
    var mKind = monaco.languages.SymbolKind;
    switch (kind) {
        case ls.SymbolKind.File: return mKind.Array;
        case ls.SymbolKind.Module: return mKind.Module;
        case ls.SymbolKind.Namespace: return mKind.Namespace;
        case ls.SymbolKind.Package: return mKind.Package;
        case ls.SymbolKind.Class: return mKind.Class;
        case ls.SymbolKind.Method: return mKind.Method;
        case ls.SymbolKind.Property: return mKind.Property;
        case ls.SymbolKind.Field: return mKind.Field;
        case ls.SymbolKind.Constructor: return mKind.Constructor;
        case ls.SymbolKind.Enum: return mKind.Enum;
        case ls.SymbolKind.Interface: return mKind.Interface;
        case ls.SymbolKind.Function: return mKind.Function;
        case ls.SymbolKind.Variable: return mKind.Variable;
        case ls.SymbolKind.Constant: return mKind.Constant;
        case ls.SymbolKind.String: return mKind.String;
        case ls.SymbolKind.Number: return mKind.Number;
        case ls.SymbolKind.Boolean: return mKind.Boolean;
        case ls.SymbolKind.Array: return mKind.Array;
    }
    return mKind.Function;
}
function toHighlighKind(kind) {
    var mKind = monaco.languages.DocumentHighlightKind;
    switch (kind) {
        case ls.DocumentHighlightKind.Read: return mKind.Read;
        case ls.DocumentHighlightKind.Write: return mKind.Write;
        case ls.DocumentHighlightKind.Text: return mKind.Text;
    }
    return mKind.Text;
}
var DocumentHighlightAdapter = /** @class */ (function () {
    function DocumentHighlightAdapter(_worker) {
        this._worker = _worker;
    }
    DocumentHighlightAdapter.prototype.provideDocumentHighlights = function (model, position, token) {
        var resource = model.uri;
        return wireCancellationToken(token, this._worker(resource).then(function (worker) { return worker.findDocumentHighlights(resource.toString(), fromPosition(position)); }).then(function (items) {
            if (!items) {
                return;
            }
            return items.map(function (item) { return ({
                range: toRange(item.range),
                kind: toHighlighKind(item.kind)
            }); });
        }));
    };
    return DocumentHighlightAdapter;
}());
export { DocumentHighlightAdapter };
var DocumentLinkAdapter = /** @class */ (function () {
    function DocumentLinkAdapter(_worker) {
        this._worker = _worker;
    }
    DocumentLinkAdapter.prototype.provideLinks = function (model, token) {
        var resource = model.uri;
        return wireCancellationToken(token, this._worker(resource).then(function (worker) { return worker.findDocumentLinks(resource.toString()); }).then(function (items) {
            if (!items) {
                return;
            }
            return items.map(function (item) { return ({
                range: toRange(item.range),
                url: item.target
            }); });
        }));
    };
    return DocumentLinkAdapter;
}());
export { DocumentLinkAdapter };
function fromFormattingOptions(options) {
    return {
        tabSize: options.tabSize,
        insertSpaces: options.insertSpaces
    };
}
var DocumentFormattingEditProvider = /** @class */ (function () {
    function DocumentFormattingEditProvider(_worker) {
        this._worker = _worker;
    }
    DocumentFormattingEditProvider.prototype.provideDocumentFormattingEdits = function (model, options, token) {
        var resource = model.uri;
        return wireCancellationToken(token, this._worker(resource).then(function (worker) {
            return worker.format(resource.toString(), null, fromFormattingOptions(options)).then(function (edits) {
                if (!edits || edits.length === 0) {
                    return;
                }
                return edits.map(toTextEdit);
            });
        }));
    };
    return DocumentFormattingEditProvider;
}());
export { DocumentFormattingEditProvider };
var DocumentRangeFormattingEditProvider = /** @class */ (function () {
    function DocumentRangeFormattingEditProvider(_worker) {
        this._worker = _worker;
    }
    DocumentRangeFormattingEditProvider.prototype.provideDocumentRangeFormattingEdits = function (model, range, options, token) {
        var resource = model.uri;
        return wireCancellationToken(token, this._worker(resource).then(function (worker) {
            return worker.format(resource.toString(), fromRange(range), fromFormattingOptions(options)).then(function (edits) {
                if (!edits || edits.length === 0) {
                    return;
                }
                return edits.map(toTextEdit);
            });
        }));
    };
    return DocumentRangeFormattingEditProvider;
}());
export { DocumentRangeFormattingEditProvider };
/**
 * Hook a cancellation token to a WinJS Promise
 */
function wireCancellationToken(token, promise) {
    if (promise.cancel) {
        token.onCancellationRequested(function () { return promise.cancel(); });
    }
    return promise;
}
