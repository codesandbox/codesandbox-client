/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import * as ls from './_deps/vscode-languageserver-types/main.js';
var Uri = monaco.Uri;
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
        this._disposables.push(monaco.editor.onWillDisposeModel(onModelRemoved));
        this._disposables.push(monaco.editor.onDidChangeModelLanguage(function (event) {
            onModelRemoved(event.model);
            onModelAdd(event.model);
        }));
        defaults.onDidChange(function (_) {
            monaco.editor.getModels().forEach(function (model) {
                if (model.getModeId() === _this._languageId) {
                    onModelRemoved(model);
                    onModelAdd(model);
                }
            });
        });
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
            return worker.doValidation(resource.toString());
        }).then(function (diagnostics) {
            var markers = diagnostics.map(function (d) { return toDiagnostics(resource, d); });
            var model = monaco.editor.getModel(resource);
            if (model.getModeId() === languageId) {
                monaco.editor.setModelMarkers(model, languageId, markers);
            }
        }).done(undefined, function (err) {
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
    return { start: { line: range.startLineNumber - 1, character: range.startColumn - 1 }, end: { line: range.endLineNumber - 1, character: range.endColumn - 1 } };
}
function toRange(range) {
    if (!range) {
        return void 0;
    }
    return new monaco.Range(range.start.line + 1, range.start.character + 1, range.end.line + 1, range.end.character + 1);
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
function toTextEdit(textEdit) {
    if (!textEdit) {
        return void 0;
    }
    return {
        range: toRange(textEdit.range),
        text: textEdit.newText
    };
}
var CompletionAdapter = /** @class */ (function () {
    function CompletionAdapter(_worker) {
        this._worker = _worker;
    }
    Object.defineProperty(CompletionAdapter.prototype, "triggerCharacters", {
        get: function () {
            return [' ', ':'];
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
                if (entry.additionalTextEdits) {
                    item.additionalTextEdits = entry.additionalTextEdits.map(toTextEdit);
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
// --- hover ------
var HoverAdapter = /** @class */ (function () {
    function HoverAdapter(_worker) {
        this._worker = _worker;
    }
    HoverAdapter.prototype.provideHover = function (model, position, token) {
        var resource = model.uri;
        return wireCancellationToken(token, this._worker(resource).then(function (worker) {
            return worker.doHover(resource.toString(), fromPosition(position));
        }).then(function (info) {
            if (!info) {
                return;
            }
            return {
                range: toRange(info.range),
                contents: toMarkedStringArray(info.contents)
            };
        }));
    };
    return HoverAdapter;
}());
export { HoverAdapter };
// --- document highlights ------
function toDocumentHighlightKind(kind) {
    switch (kind) {
        case ls.DocumentHighlightKind.Read: return monaco.languages.DocumentHighlightKind.Read;
        case ls.DocumentHighlightKind.Write: return monaco.languages.DocumentHighlightKind.Write;
        case ls.DocumentHighlightKind.Text: return monaco.languages.DocumentHighlightKind.Text;
    }
    return monaco.languages.DocumentHighlightKind.Text;
}
var DocumentHighlightAdapter = /** @class */ (function () {
    function DocumentHighlightAdapter(_worker) {
        this._worker = _worker;
    }
    DocumentHighlightAdapter.prototype.provideDocumentHighlights = function (model, position, token) {
        var resource = model.uri;
        return wireCancellationToken(token, this._worker(resource).then(function (worker) {
            return worker.findDocumentHighlights(resource.toString(), fromPosition(position));
        }).then(function (entries) {
            if (!entries) {
                return;
            }
            return entries.map(function (entry) {
                return {
                    range: toRange(entry.range),
                    kind: toDocumentHighlightKind(entry.kind)
                };
            });
        }));
    };
    return DocumentHighlightAdapter;
}());
export { DocumentHighlightAdapter };
// --- definition ------
function toLocation(location) {
    return {
        uri: Uri.parse(location.uri),
        range: toRange(location.range)
    };
}
var DefinitionAdapter = /** @class */ (function () {
    function DefinitionAdapter(_worker) {
        this._worker = _worker;
    }
    DefinitionAdapter.prototype.provideDefinition = function (model, position, token) {
        var resource = model.uri;
        return wireCancellationToken(token, this._worker(resource).then(function (worker) {
            return worker.findDefinition(resource.toString(), fromPosition(position));
        }).then(function (definition) {
            if (!definition) {
                return;
            }
            return [toLocation(definition)];
        }));
    };
    return DefinitionAdapter;
}());
export { DefinitionAdapter };
// --- references ------
var ReferenceAdapter = /** @class */ (function () {
    function ReferenceAdapter(_worker) {
        this._worker = _worker;
    }
    ReferenceAdapter.prototype.provideReferences = function (model, position, context, token) {
        var resource = model.uri;
        return wireCancellationToken(token, this._worker(resource).then(function (worker) {
            return worker.findReferences(resource.toString(), fromPosition(position));
        }).then(function (entries) {
            if (!entries) {
                return;
            }
            return entries.map(toLocation);
        }));
    };
    return ReferenceAdapter;
}());
export { ReferenceAdapter };
// --- rename ------
function toWorkspaceEdit(edit) {
    if (!edit || !edit.changes) {
        return void 0;
    }
    var resourceEdits = [];
    for (var uri in edit.changes) {
        var edits = [];
        for (var _i = 0, _a = edit.changes[uri]; _i < _a.length; _i++) {
            var e = _a[_i];
            edits.push({
                range: toRange(e.range),
                text: e.newText
            });
        }
        resourceEdits.push({ resource: Uri.parse(uri), edits: edits });
    }
    return {
        edits: resourceEdits
    };
}
var RenameAdapter = /** @class */ (function () {
    function RenameAdapter(_worker) {
        this._worker = _worker;
    }
    RenameAdapter.prototype.provideRenameEdits = function (model, position, newName, token) {
        var resource = model.uri;
        return wireCancellationToken(token, this._worker(resource).then(function (worker) {
            return worker.doRename(resource.toString(), fromPosition(position), newName);
        }).then(function (edit) {
            return toWorkspaceEdit(edit);
        }));
    };
    return RenameAdapter;
}());
export { RenameAdapter };
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
var DocumentSymbolAdapter = /** @class */ (function () {
    function DocumentSymbolAdapter(_worker) {
        this._worker = _worker;
    }
    DocumentSymbolAdapter.prototype.provideDocumentSymbols = function (model, token) {
        var resource = model.uri;
        return wireCancellationToken(token, this._worker(resource).then(function (worker) { return worker.findDocumentSymbols(resource.toString()); }).then(function (items) {
            if (!items) {
                return;
            }
            return items.map(function (item) { return ({
                name: item.name,
                containerName: item.containerName,
                kind: toSymbolKind(item.kind),
                location: toLocation(item.location)
            }); });
        }));
    };
    return DocumentSymbolAdapter;
}());
export { DocumentSymbolAdapter };
var DocumentColorAdapter = /** @class */ (function () {
    function DocumentColorAdapter(_worker) {
        this._worker = _worker;
    }
    DocumentColorAdapter.prototype.provideDocumentColors = function (model, token) {
        var resource = model.uri;
        return wireCancellationToken(token, this._worker(resource).then(function (worker) { return worker.findDocumentColors(resource.toString()); }).then(function (infos) {
            if (!infos) {
                return;
            }
            return infos.map(function (item) { return ({
                color: item.color,
                range: toRange(item.range)
            }); });
        }));
    };
    DocumentColorAdapter.prototype.provideColorPresentations = function (model, info, token) {
        var resource = model.uri;
        return wireCancellationToken(token, this._worker(resource).then(function (worker) { return worker.getColorPresentations(resource.toString(), info.color, fromRange(info.range)); }).then(function (presentations) {
            if (!presentations) {
                return;
            }
            return presentations.map(function (presentation) {
                var item = {
                    label: presentation.label,
                };
                if (presentation.textEdit) {
                    item.textEdit = toTextEdit(presentation.textEdit);
                }
                if (presentation.additionalTextEdits) {
                    item.additionalTextEdits = presentation.additionalTextEdits.map(toTextEdit);
                }
                return item;
            });
        }));
    };
    return DocumentColorAdapter;
}());
export { DocumentColorAdapter };
/**
 * Hook a cancellation token to a WinJS Promise
 */
function wireCancellationToken(token, promise) {
    token.onCancellationRequested(function () { return promise.cancel(); });
    return promise;
}
