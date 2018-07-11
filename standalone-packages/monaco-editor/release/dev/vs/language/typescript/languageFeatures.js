var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "./lib/typescriptServices"], function (require, exports, ts) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var Uri = monaco.Uri;
    var Promise = monaco.Promise;
    var Adapter = /** @class */ (function () {
        function Adapter(_worker) {
            this._worker = _worker;
        }
        Adapter.prototype._positionToOffset = function (uri, position) {
            var model = monaco.editor.getModel(uri);
            return model.getOffsetAt(position);
        };
        Adapter.prototype._offsetToPosition = function (uri, offset) {
            var model = monaco.editor.getModel(uri);
            return model.getPositionAt(offset);
        };
        Adapter.prototype._textSpanToRange = function (uri, span) {
            var p1 = this._offsetToPosition(uri, span.start);
            var p2 = this._offsetToPosition(uri, span.start + span.length);
            var startLineNumber = p1.lineNumber, startColumn = p1.column;
            var endLineNumber = p2.lineNumber, endColumn = p2.column;
            return { startLineNumber: startLineNumber, startColumn: startColumn, endLineNumber: endLineNumber, endColumn: endColumn };
        };
        return Adapter;
    }());
    exports.Adapter = Adapter;
    // --- diagnostics --- ---
    var DiagnostcsAdapter = /** @class */ (function (_super) {
        __extends(DiagnostcsAdapter, _super);
        function DiagnostcsAdapter(_defaults, _selector, worker) {
            var _this = _super.call(this, worker) || this;
            _this._defaults = _defaults;
            _this._selector = _selector;
            _this._disposables = [];
            _this._listener = Object.create(null);
            var onModelAdd = function (model) {
                if (model.getModeId() !== _selector) {
                    return;
                }
                var handle;
                var changeSubscription = model.onDidChangeContent(function () {
                    clearTimeout(handle);
                    handle = setTimeout(function () { return _this._doValidate(model.uri); }, 500);
                });
                _this._listener[model.uri.toString()] = {
                    dispose: function () {
                        changeSubscription.dispose();
                        clearTimeout(handle);
                    }
                };
                _this._doValidate(model.uri);
            };
            var onModelRemoved = function (model) {
                monaco.editor.setModelMarkers(model, _this._selector, []);
                var key = model.uri.toString();
                if (_this._listener[key]) {
                    _this._listener[key].dispose();
                    delete _this._listener[key];
                }
            };
            _this._disposables.push(monaco.editor.onDidCreateModel(onModelAdd));
            _this._disposables.push(monaco.editor.onWillDisposeModel(onModelRemoved));
            _this._disposables.push(monaco.editor.onDidChangeModelLanguage(function (event) {
                onModelRemoved(event.model);
                onModelAdd(event.model);
            }));
            _this._disposables.push({
                dispose: function () {
                    for (var _i = 0, _a = monaco.editor.getModels(); _i < _a.length; _i++) {
                        var model = _a[_i];
                        onModelRemoved(model);
                    }
                }
            });
            _this._disposables.push(_this._defaults.onDidChange(function () {
                // redo diagnostics when options change
                for (var _i = 0, _a = monaco.editor.getModels(); _i < _a.length; _i++) {
                    var model = _a[_i];
                    onModelRemoved(model);
                    onModelAdd(model);
                }
            }));
            monaco.editor.getModels().forEach(onModelAdd);
            return _this;
        }
        DiagnostcsAdapter.prototype.dispose = function () {
            this._disposables.forEach(function (d) { return d && d.dispose(); });
            this._disposables = [];
        };
        DiagnostcsAdapter.prototype._doValidate = function (resource) {
            var _this = this;
            this._worker(resource).then(function (worker) {
                if (!monaco.editor.getModel(resource)) {
                    // model was disposed in the meantime
                    return null;
                }
                var promises = [];
                var _a = _this._defaults.getDiagnosticsOptions(), noSyntaxValidation = _a.noSyntaxValidation, noSemanticValidation = _a.noSemanticValidation;
                if (!noSyntaxValidation) {
                    promises.push(worker.getSyntacticDiagnostics(resource.toString()));
                }
                if (!noSemanticValidation) {
                    promises.push(worker.getSemanticDiagnostics(resource.toString()));
                }
                return Promise.join(promises);
            }).then(function (diagnostics) {
                if (!diagnostics || !monaco.editor.getModel(resource)) {
                    // model was disposed in the meantime
                    return null;
                }
                var markers = diagnostics
                    .reduce(function (p, c) { return c.concat(p); }, [])
                    .map(function (d) { return _this._convertDiagnostics(resource, d); });
                monaco.editor.setModelMarkers(monaco.editor.getModel(resource), _this._selector, markers);
            }).done(undefined, function (err) {
                console.error(err);
            });
        };
        DiagnostcsAdapter.prototype._convertDiagnostics = function (resource, diag) {
            var _a = this._offsetToPosition(resource, diag.start), startLineNumber = _a.lineNumber, startColumn = _a.column;
            var _b = this._offsetToPosition(resource, diag.start + diag.length), endLineNumber = _b.lineNumber, endColumn = _b.column;
            return {
                severity: monaco.MarkerSeverity.Error,
                startLineNumber: startLineNumber,
                startColumn: startColumn,
                endLineNumber: endLineNumber,
                endColumn: endColumn,
                message: ts.flattenDiagnosticMessageText(diag.messageText, '\n')
            };
        };
        return DiagnostcsAdapter;
    }(Adapter));
    exports.DiagnostcsAdapter = DiagnostcsAdapter;
    var SuggestAdapter = /** @class */ (function (_super) {
        __extends(SuggestAdapter, _super);
        function SuggestAdapter() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(SuggestAdapter.prototype, "triggerCharacters", {
            get: function () {
                return ['.'];
            },
            enumerable: true,
            configurable: true
        });
        SuggestAdapter.prototype.provideCompletionItems = function (model, position, token) {
            var wordInfo = model.getWordUntilPosition(position);
            var resource = model.uri;
            var offset = this._positionToOffset(resource, position);
            return wireCancellationToken(token, this._worker(resource).then(function (worker) {
                return worker.getCompletionsAtPosition(resource.toString(), offset);
            }).then(function (info) {
                if (!info) {
                    return;
                }
                var suggestions = info.entries.map(function (entry) {
                    return {
                        uri: resource,
                        position: position,
                        label: entry.name,
                        sortText: entry.sortText,
                        kind: SuggestAdapter.convertKind(entry.kind)
                    };
                });
                return suggestions;
            }));
        };
        SuggestAdapter.prototype.resolveCompletionItem = function (item, token) {
            var _this = this;
            var myItem = item;
            var resource = myItem.uri;
            var position = myItem.position;
            return wireCancellationToken(token, this._worker(resource).then(function (worker) {
                return worker.getCompletionEntryDetails(resource.toString(), _this._positionToOffset(resource, position), myItem.label);
            }).then(function (details) {
                if (!details) {
                    return myItem;
                }
                return {
                    uri: resource,
                    position: position,
                    label: details.name,
                    kind: SuggestAdapter.convertKind(details.kind),
                    detail: ts.displayPartsToString(details.displayParts),
                    documentation: ts.displayPartsToString(details.documentation)
                };
            }));
        };
        SuggestAdapter.convertKind = function (kind) {
            switch (kind) {
                case Kind.primitiveType:
                case Kind.keyword:
                    return monaco.languages.CompletionItemKind.Keyword;
                case Kind.variable:
                case Kind.localVariable:
                    return monaco.languages.CompletionItemKind.Variable;
                case Kind.memberVariable:
                case Kind.memberGetAccessor:
                case Kind.memberSetAccessor:
                    return monaco.languages.CompletionItemKind.Field;
                case Kind.function:
                case Kind.memberFunction:
                case Kind.constructSignature:
                case Kind.callSignature:
                case Kind.indexSignature:
                    return monaco.languages.CompletionItemKind.Function;
                case Kind.enum:
                    return monaco.languages.CompletionItemKind.Enum;
                case Kind.module:
                    return monaco.languages.CompletionItemKind.Module;
                case Kind.class:
                    return monaco.languages.CompletionItemKind.Class;
                case Kind.interface:
                    return monaco.languages.CompletionItemKind.Interface;
                case Kind.warning:
                    return monaco.languages.CompletionItemKind.File;
            }
            return monaco.languages.CompletionItemKind.Property;
        };
        return SuggestAdapter;
    }(Adapter));
    exports.SuggestAdapter = SuggestAdapter;
    var SignatureHelpAdapter = /** @class */ (function (_super) {
        __extends(SignatureHelpAdapter, _super);
        function SignatureHelpAdapter() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.signatureHelpTriggerCharacters = ['(', ','];
            return _this;
        }
        SignatureHelpAdapter.prototype.provideSignatureHelp = function (model, position, token) {
            var _this = this;
            var resource = model.uri;
            return wireCancellationToken(token, this._worker(resource).then(function (worker) { return worker.getSignatureHelpItems(resource.toString(), _this._positionToOffset(resource, position)); }).then(function (info) {
                if (!info) {
                    return;
                }
                var ret = {
                    activeSignature: info.selectedItemIndex,
                    activeParameter: info.argumentIndex,
                    signatures: []
                };
                info.items.forEach(function (item) {
                    var signature = {
                        label: '',
                        documentation: null,
                        parameters: []
                    };
                    signature.label += ts.displayPartsToString(item.prefixDisplayParts);
                    item.parameters.forEach(function (p, i, a) {
                        var label = ts.displayPartsToString(p.displayParts);
                        var parameter = {
                            label: label,
                            documentation: ts.displayPartsToString(p.documentation)
                        };
                        signature.label += label;
                        signature.parameters.push(parameter);
                        if (i < a.length - 1) {
                            signature.label += ts.displayPartsToString(item.separatorDisplayParts);
                        }
                    });
                    signature.label += ts.displayPartsToString(item.suffixDisplayParts);
                    ret.signatures.push(signature);
                });
                return ret;
            }));
        };
        return SignatureHelpAdapter;
    }(Adapter));
    exports.SignatureHelpAdapter = SignatureHelpAdapter;
    // --- hover ------
    var QuickInfoAdapter = /** @class */ (function (_super) {
        __extends(QuickInfoAdapter, _super);
        function QuickInfoAdapter() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        QuickInfoAdapter.prototype.provideHover = function (model, position, token) {
            var _this = this;
            var resource = model.uri;
            return wireCancellationToken(token, this._worker(resource).then(function (worker) {
                return worker.getQuickInfoAtPosition(resource.toString(), _this._positionToOffset(resource, position));
            }).then(function (info) {
                if (!info) {
                    return;
                }
                var documentation = ts.displayPartsToString(info.documentation);
                var tags = info.tags ? info.tags.map(function (tag) {
                    var label = "*@" + tag.name + "*";
                    if (!tag.text) {
                        return label;
                    }
                    return label + (tag.text.match(/\r\n|\n/g) ? ' \n' + tag.text : " - " + tag.text);
                })
                    .join('  \n\n') : '';
                var contents = ts.displayPartsToString(info.displayParts);
                return {
                    range: _this._textSpanToRange(resource, info.textSpan),
                    contents: [{
                            value: contents
                        }, {
                            value: documentation + (tags ? '\n\n' + tags : '')
                        }]
                };
            }));
        };
        return QuickInfoAdapter;
    }(Adapter));
    exports.QuickInfoAdapter = QuickInfoAdapter;
    // --- occurrences ------
    var OccurrencesAdapter = /** @class */ (function (_super) {
        __extends(OccurrencesAdapter, _super);
        function OccurrencesAdapter() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OccurrencesAdapter.prototype.provideDocumentHighlights = function (model, position, token) {
            var _this = this;
            var resource = model.uri;
            return wireCancellationToken(token, this._worker(resource).then(function (worker) {
                return worker.getOccurrencesAtPosition(resource.toString(), _this._positionToOffset(resource, position));
            }).then(function (entries) {
                if (!entries) {
                    return;
                }
                return entries.map(function (entry) {
                    return {
                        range: _this._textSpanToRange(resource, entry.textSpan),
                        kind: entry.isWriteAccess ? monaco.languages.DocumentHighlightKind.Write : monaco.languages.DocumentHighlightKind.Text
                    };
                });
            }));
        };
        return OccurrencesAdapter;
    }(Adapter));
    exports.OccurrencesAdapter = OccurrencesAdapter;
    // --- definition ------
    var DefinitionAdapter = /** @class */ (function (_super) {
        __extends(DefinitionAdapter, _super);
        function DefinitionAdapter() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        DefinitionAdapter.prototype.provideDefinition = function (model, position, token) {
            var _this = this;
            var resource = model.uri;
            return wireCancellationToken(token, this._worker(resource).then(function (worker) {
                return worker.getDefinitionAtPosition(resource.toString(), _this._positionToOffset(resource, position));
            }).then(function (entries) {
                if (!entries) {
                    return;
                }
                var result = [];
                for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
                    var entry = entries_1[_i];
                    var uri = Uri.parse(entry.fileName);
                    if (monaco.editor.getModel(uri)) {
                        result.push({
                            uri: uri,
                            range: _this._textSpanToRange(uri, entry.textSpan)
                        });
                    }
                }
                return result;
            }));
        };
        return DefinitionAdapter;
    }(Adapter));
    exports.DefinitionAdapter = DefinitionAdapter;
    // --- references ------
    var ReferenceAdapter = /** @class */ (function (_super) {
        __extends(ReferenceAdapter, _super);
        function ReferenceAdapter() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ReferenceAdapter.prototype.provideReferences = function (model, position, context, token) {
            var _this = this;
            var resource = model.uri;
            return wireCancellationToken(token, this._worker(resource).then(function (worker) {
                return worker.getReferencesAtPosition(resource.toString(), _this._positionToOffset(resource, position));
            }).then(function (entries) {
                if (!entries) {
                    return;
                }
                var result = [];
                for (var _i = 0, entries_2 = entries; _i < entries_2.length; _i++) {
                    var entry = entries_2[_i];
                    var uri = Uri.parse(entry.fileName);
                    if (monaco.editor.getModel(uri)) {
                        result.push({
                            uri: uri,
                            range: _this._textSpanToRange(uri, entry.textSpan)
                        });
                    }
                }
                return result;
            }));
        };
        return ReferenceAdapter;
    }(Adapter));
    exports.ReferenceAdapter = ReferenceAdapter;
    // --- outline ------
    var OutlineAdapter = /** @class */ (function (_super) {
        __extends(OutlineAdapter, _super);
        function OutlineAdapter() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OutlineAdapter.prototype.provideDocumentSymbols = function (model, token) {
            var _this = this;
            var resource = model.uri;
            return wireCancellationToken(token, this._worker(resource).then(function (worker) { return worker.getNavigationBarItems(resource.toString()); }).then(function (items) {
                if (!items) {
                    return;
                }
                var convert = function (bucket, item, containerLabel) {
                    var result = {
                        name: item.text,
                        kind: (outlineTypeTable[item.kind] || monaco.languages.SymbolKind.Variable),
                        location: {
                            uri: resource,
                            range: _this._textSpanToRange(resource, item.spans[0])
                        },
                        containerName: containerLabel
                    };
                    if (item.childItems && item.childItems.length > 0) {
                        for (var _i = 0, _a = item.childItems; _i < _a.length; _i++) {
                            var child = _a[_i];
                            convert(bucket, child, result.name);
                        }
                    }
                    bucket.push(result);
                };
                var result = [];
                items.forEach(function (item) { return convert(result, item); });
                return result;
            }));
        };
        return OutlineAdapter;
    }(Adapter));
    exports.OutlineAdapter = OutlineAdapter;
    var Kind = /** @class */ (function () {
        function Kind() {
        }
        Kind.unknown = '';
        Kind.keyword = 'keyword';
        Kind.script = 'script';
        Kind.module = 'module';
        Kind.class = 'class';
        Kind.interface = 'interface';
        Kind.type = 'type';
        Kind.enum = 'enum';
        Kind.variable = 'var';
        Kind.localVariable = 'local var';
        Kind.function = 'function';
        Kind.localFunction = 'local function';
        Kind.memberFunction = 'method';
        Kind.memberGetAccessor = 'getter';
        Kind.memberSetAccessor = 'setter';
        Kind.memberVariable = 'property';
        Kind.constructorImplementation = 'constructor';
        Kind.callSignature = 'call';
        Kind.indexSignature = 'index';
        Kind.constructSignature = 'construct';
        Kind.parameter = 'parameter';
        Kind.typeParameter = 'type parameter';
        Kind.primitiveType = 'primitive type';
        Kind.label = 'label';
        Kind.alias = 'alias';
        Kind.const = 'const';
        Kind.let = 'let';
        Kind.warning = 'warning';
        return Kind;
    }());
    exports.Kind = Kind;
    var outlineTypeTable = Object.create(null);
    outlineTypeTable[Kind.module] = monaco.languages.SymbolKind.Module;
    outlineTypeTable[Kind.class] = monaco.languages.SymbolKind.Class;
    outlineTypeTable[Kind.enum] = monaco.languages.SymbolKind.Enum;
    outlineTypeTable[Kind.interface] = monaco.languages.SymbolKind.Interface;
    outlineTypeTable[Kind.memberFunction] = monaco.languages.SymbolKind.Method;
    outlineTypeTable[Kind.memberVariable] = monaco.languages.SymbolKind.Property;
    outlineTypeTable[Kind.memberGetAccessor] = monaco.languages.SymbolKind.Property;
    outlineTypeTable[Kind.memberSetAccessor] = monaco.languages.SymbolKind.Property;
    outlineTypeTable[Kind.variable] = monaco.languages.SymbolKind.Variable;
    outlineTypeTable[Kind.const] = monaco.languages.SymbolKind.Variable;
    outlineTypeTable[Kind.localVariable] = monaco.languages.SymbolKind.Variable;
    outlineTypeTable[Kind.variable] = monaco.languages.SymbolKind.Variable;
    outlineTypeTable[Kind.function] = monaco.languages.SymbolKind.Function;
    outlineTypeTable[Kind.localFunction] = monaco.languages.SymbolKind.Function;
    // --- formatting ----
    var FormatHelper = /** @class */ (function (_super) {
        __extends(FormatHelper, _super);
        function FormatHelper() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        FormatHelper._convertOptions = function (options) {
            return {
                ConvertTabsToSpaces: options.insertSpaces,
                TabSize: options.tabSize,
                IndentSize: options.tabSize,
                IndentStyle: ts.IndentStyle.Smart,
                NewLineCharacter: '\n',
                InsertSpaceAfterCommaDelimiter: true,
                InsertSpaceAfterSemicolonInForStatements: true,
                InsertSpaceBeforeAndAfterBinaryOperators: true,
                InsertSpaceAfterKeywordsInControlFlowStatements: true,
                InsertSpaceAfterFunctionKeywordForAnonymousFunctions: true,
                InsertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis: false,
                InsertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets: false,
                InsertSpaceAfterOpeningAndBeforeClosingTemplateStringBraces: false,
                PlaceOpenBraceOnNewLineForControlBlocks: false,
                PlaceOpenBraceOnNewLineForFunctions: false
            };
        };
        FormatHelper.prototype._convertTextChanges = function (uri, change) {
            return {
                text: change.newText,
                range: this._textSpanToRange(uri, change.span)
            };
        };
        return FormatHelper;
    }(Adapter));
    exports.FormatHelper = FormatHelper;
    var FormatAdapter = /** @class */ (function (_super) {
        __extends(FormatAdapter, _super);
        function FormatAdapter() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        FormatAdapter.prototype.provideDocumentRangeFormattingEdits = function (model, range, options, token) {
            var _this = this;
            var resource = model.uri;
            return wireCancellationToken(token, this._worker(resource).then(function (worker) {
                return worker.getFormattingEditsForRange(resource.toString(), _this._positionToOffset(resource, { lineNumber: range.startLineNumber, column: range.startColumn }), _this._positionToOffset(resource, { lineNumber: range.endLineNumber, column: range.endColumn }), FormatHelper._convertOptions(options));
            }).then(function (edits) {
                if (edits) {
                    return edits.map(function (edit) { return _this._convertTextChanges(resource, edit); });
                }
            }));
        };
        return FormatAdapter;
    }(FormatHelper));
    exports.FormatAdapter = FormatAdapter;
    var FormatOnTypeAdapter = /** @class */ (function (_super) {
        __extends(FormatOnTypeAdapter, _super);
        function FormatOnTypeAdapter() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(FormatOnTypeAdapter.prototype, "autoFormatTriggerCharacters", {
            get: function () {
                return [';', '}', '\n'];
            },
            enumerable: true,
            configurable: true
        });
        FormatOnTypeAdapter.prototype.provideOnTypeFormattingEdits = function (model, position, ch, options, token) {
            var _this = this;
            var resource = model.uri;
            return wireCancellationToken(token, this._worker(resource).then(function (worker) {
                return worker.getFormattingEditsAfterKeystroke(resource.toString(), _this._positionToOffset(resource, position), ch, FormatHelper._convertOptions(options));
            }).then(function (edits) {
                if (edits) {
                    return edits.map(function (edit) { return _this._convertTextChanges(resource, edit); });
                }
            }));
        };
        return FormatOnTypeAdapter;
    }(FormatHelper));
    exports.FormatOnTypeAdapter = FormatOnTypeAdapter;
    /**
     * Hook a cancellation token to a WinJS Promise
     */
    function wireCancellationToken(token, promise) {
        token.onCancellationRequested(function () { return promise.cancel(); });
        return promise;
    }
});
