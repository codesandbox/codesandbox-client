var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
define(["require", "exports", "./lib/emmet/expand/languageserver-types"], function (require, exports, ls) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var Uri = monaco.Uri;
    var Range = monaco.Range;
    // @ts-ignore
    var Promise = monaco.Promise;
    //#region utils copied from typescript to prevent loading the entire typescriptServices ---
    var IndentStyle;
    (function (IndentStyle) {
        IndentStyle[IndentStyle["None"] = 0] = "None";
        IndentStyle[IndentStyle["Block"] = 1] = "Block";
        IndentStyle[IndentStyle["Smart"] = 2] = "Smart";
    })(IndentStyle || (IndentStyle = {}));
    var Priority;
    (function (Priority) {
        Priority[Priority["Emmet"] = 0] = "Emmet";
        Priority[Priority["Platform"] = 1] = "Platform";
    })(Priority = exports.Priority || (exports.Priority = {}));
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
    function toRange(range) {
        if (!range) {
            return void 0;
        }
        return new Range(range.start.line + 1, range.start.character + 1, range.end.line + 1, range.end.character + 1);
    }
    function flattenDiagnosticMessageText(messageText, newLine) {
        if (typeof messageText === 'string') {
            return messageText;
        }
        else {
            var diagnosticChain = messageText;
            var result = '';
            var indent = 0;
            while (diagnosticChain) {
                if (indent) {
                    result += newLine;
                    for (var i = 0; i < indent; i++) {
                        result += '  ';
                    }
                }
                result += diagnosticChain.messageText;
                indent++;
                diagnosticChain = diagnosticChain.next;
            }
            return result;
        }
    }
    function displayPartsToString(displayParts) {
        if (displayParts) {
            return displayParts.map(function (displayPart) { return displayPart.text; }).join('');
        }
        return '';
    }
    //#endregion
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
                    // @ts-ignore
                    handle = setTimeout(function () { return _this._doValidate(model.uri); }, 500);
                });
                _this._listener[model.uri.toString()] = {
                    dispose: function () {
                        changeSubscription.dispose();
                        clearTimeout(handle);
                    },
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
                    var e_1, _a;
                    try {
                        for (var _b = __values(monaco.editor.getModels()), _c = _b.next(); !_c.done; _c = _b.next()) {
                            var model = _c.value;
                            onModelRemoved(model);
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                },
            });
            _this._disposables.push(_this._defaults.onDidChange(function () {
                var e_2, _a;
                try {
                    // redo diagnostics when options change
                    for (var _b = __values(monaco.editor.getModels()), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var model = _c.value;
                        onModelRemoved(model);
                        onModelAdd(model);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_2) throw e_2.error; }
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
            this._worker(resource)
                .then(function (worker) {
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
            })
                .then(function (diagnostics) {
                if (!diagnostics || !monaco.editor.getModel(resource)) {
                    // model was disposed in the meantime
                    return null;
                }
                var markers = diagnostics
                    .reduce(function (p, c) { return c.concat(p); }, [])
                    .map(function (d) { return _this._convertDiagnostics(resource, d); });
                monaco.editor.setModelMarkers(monaco.editor.getModel(resource), _this._selector, markers);
            })
                .done(undefined, function (err) {
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
                message: flattenDiagnosticMessageText(diag.messageText, '\n'),
            };
        };
        return DiagnostcsAdapter;
    }(Adapter));
    exports.DiagnostcsAdapter = DiagnostcsAdapter;
    var emmetTriggerCharacters = ['!', '.', '}', ':', '*', '$', ']', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    var SuggestAdapter = /** @class */ (function (_super) {
        __extends(SuggestAdapter, _super);
        function SuggestAdapter() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(SuggestAdapter.prototype, "triggerCharacters", {
            get: function () {
                return __spread(emmetTriggerCharacters, ['.']);
            },
            enumerable: true,
            configurable: true
        });
        SuggestAdapter.prototype.provideCompletionItems = function (model, position, token) {
            var wordInfo = model.getWordUntilPosition(position);
            var resource = model.uri;
            var offset = this._positionToOffset(resource, position);
            return wireCancellationToken(token, this._worker(resource)
                .then(function (worker) {
                return worker.getCompletionsAtPosition(resource.toString(), offset);
            })
                .then(function (info) {
                if (!info) {
                    return;
                }
                var emmetItems = info.emmetCompletions ? info.emmetCompletions.items.map(function (i) {
                    var entry = __assign({}, i, { sortText: Priority.Emmet + i.label });
                    var item = {
                        label: entry.label,
                        insertText: entry.insertText,
                        sortText: entry.sortText,
                        filterText: entry.filterText,
                        documentation: entry.documentation,
                        detail: entry.detail,
                        uri: resource,
                        position: position,
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
                }) : [];
                var suggestions;
                if (info.languageCompletions) {
                    suggestions = info.languageCompletions.entries.map(function (entry) {
                        return {
                            uri: resource,
                            position: position,
                            label: entry.name,
                            sortText: entry.sortText,
                            kind: SuggestAdapter.convertKind(entry.kind),
                        };
                    });
                }
                else {
                    suggestions = [];
                }
                return {
                    isIncomplete: emmetItems.length !== 0,
                    items: emmetItems.concat(suggestions)
                };
            }));
        };
        SuggestAdapter.prototype.resolveCompletionItem = function (item, token) {
            var _this = this;
            var myItem = item;
            var resource = myItem.uri;
            var position = myItem.position;
            return wireCancellationToken(token, this._worker(resource)
                .then(function (worker) {
                return worker.getCompletionEntryDetails(resource.toString(), _this._positionToOffset(resource, position), myItem.label);
            })
                .then(function (details) {
                if (!details) {
                    return myItem;
                }
                return {
                    uri: resource,
                    position: position,
                    label: details.name,
                    kind: SuggestAdapter.convertKind(details.kind),
                    detail: displayPartsToString(details.displayParts),
                    documentation: {
                        value: displayPartsToString(details.documentation),
                    },
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
            return wireCancellationToken(token, this._worker(resource)
                .then(function (worker) {
                return worker.getSignatureHelpItems(resource.toString(), _this._positionToOffset(resource, position));
            })
                .then(function (info) {
                if (!info) {
                    return;
                }
                var ret = {
                    activeSignature: info.selectedItemIndex,
                    activeParameter: info.argumentIndex,
                    signatures: [],
                };
                info.items.forEach(function (item) {
                    var signature = {
                        label: '',
                        documentation: null,
                        parameters: [],
                    };
                    signature.label += displayPartsToString(item.prefixDisplayParts);
                    item.parameters.forEach(function (p, i, a) {
                        var label = displayPartsToString(p.displayParts);
                        var parameter = {
                            label: label,
                            documentation: displayPartsToString(p.documentation),
                        };
                        signature.label += label;
                        signature.parameters.push(parameter);
                        if (i < a.length - 1) {
                            signature.label += displayPartsToString(item.separatorDisplayParts);
                        }
                    });
                    signature.label += displayPartsToString(item.suffixDisplayParts);
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
            return wireCancellationToken(token, this._worker(resource)
                .then(function (worker) {
                return worker.getQuickInfoAtPosition(resource.toString(), _this._positionToOffset(resource, position));
            })
                .then(function (info) {
                if (!info) {
                    return;
                }
                var documentation = displayPartsToString(info.documentation);
                var tags = info.tags
                    ? info.tags
                        .map(function (tag) {
                        var label = "*@" + tag.name + "*";
                        if (!tag.text) {
                            return label;
                        }
                        return (label +
                            (tag.text.match(/\r\n|\n/g)
                                ? ' \n' + tag.text
                                : " - " + tag.text));
                    })
                        .join('  \n\n')
                    : '';
                var contents = displayPartsToString(info.displayParts);
                return {
                    range: _this._textSpanToRange(resource, info.textSpan),
                    contents: [
                        {
                            value: '```js\n' + contents + '\n```\n',
                        },
                        {
                            value: documentation + (tags ? '\n\n' + tags : ''),
                        },
                    ],
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
            return wireCancellationToken(token, this._worker(resource)
                .then(function (worker) {
                return worker.getOccurrencesAtPosition(resource.toString(), _this._positionToOffset(resource, position));
            })
                .then(function (entries) {
                if (!entries) {
                    return;
                }
                return entries.map(function (entry) {
                    return {
                        range: _this._textSpanToRange(resource, entry.textSpan),
                        kind: entry.isWriteAccess
                            ? monaco.languages.DocumentHighlightKind.Write
                            : monaco.languages.DocumentHighlightKind.Text,
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
            return wireCancellationToken(token, this._worker(resource)
                .then(function (worker) {
                return worker.getDefinitionAtPosition(resource.toString(), _this._positionToOffset(resource, position));
            })
                .then(function (entries) { return __awaiter(_this, void 0, void 0, function () {
                var e_3, _a, result, entries_1, entries_1_1, entry, uri, model_1, e_3_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!entries) {
                                return [2 /*return*/];
                            }
                            result = [];
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 7, 8, 9]);
                            entries_1 = __values(entries), entries_1_1 = entries_1.next();
                            _b.label = 2;
                        case 2:
                            if (!!entries_1_1.done) return [3 /*break*/, 6];
                            entry = entries_1_1.value;
                            uri = Uri.parse(entry.fileName);
                            model_1 = void 0;
                            if (!monaco.editor.resolveModel) return [3 /*break*/, 4];
                            return [4 /*yield*/, monaco.editor.resolveModel(uri)];
                        case 3:
                            // @ts-ignore
                            model_1 = _b.sent();
                            _b.label = 4;
                        case 4:
                            if (monaco.editor.getModel(uri)) {
                                result.push({
                                    uri: uri,
                                    range: this._textSpanToRange(uri, entry.textSpan),
                                });
                            }
                            if (model_1) {
                                model_1.dispose();
                            }
                            _b.label = 5;
                        case 5:
                            entries_1_1 = entries_1.next();
                            return [3 /*break*/, 2];
                        case 6: return [3 /*break*/, 9];
                        case 7:
                            e_3_1 = _b.sent();
                            e_3 = { error: e_3_1 };
                            return [3 /*break*/, 9];
                        case 8:
                            try {
                                if (entries_1_1 && !entries_1_1.done && (_a = entries_1.return)) _a.call(entries_1);
                            }
                            finally { if (e_3) throw e_3.error; }
                            return [7 /*endfinally*/];
                        case 9: return [2 /*return*/, result];
                    }
                });
            }); }));
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
            return wireCancellationToken(token, this._worker(resource)
                .then(function (worker) {
                return worker.getReferencesAtPosition(resource.toString(), _this._positionToOffset(resource, position));
            })
                .then(function (entries) { return __awaiter(_this, void 0, void 0, function () {
                var e_4, _a, result, entries_2, entries_2_1, entry, uri, model_2, e_4_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!entries) {
                                return [2 /*return*/];
                            }
                            result = [];
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 7, 8, 9]);
                            entries_2 = __values(entries), entries_2_1 = entries_2.next();
                            _b.label = 2;
                        case 2:
                            if (!!entries_2_1.done) return [3 /*break*/, 6];
                            entry = entries_2_1.value;
                            uri = Uri.parse(entry.fileName);
                            model_2 = void 0;
                            if (!monaco.editor.resolveModel) return [3 /*break*/, 4];
                            return [4 /*yield*/, monaco.editor.resolveModel(uri)];
                        case 3:
                            // @ts-ignore
                            model_2 = _b.sent();
                            _b.label = 4;
                        case 4:
                            if (monaco.editor.getModel(uri)) {
                                result.push({
                                    uri: uri,
                                    range: this._textSpanToRange(uri, entry.textSpan),
                                });
                            }
                            if (model_2) {
                                model_2.dispose();
                            }
                            _b.label = 5;
                        case 5:
                            entries_2_1 = entries_2.next();
                            return [3 /*break*/, 2];
                        case 6: return [3 /*break*/, 9];
                        case 7:
                            e_4_1 = _b.sent();
                            e_4 = { error: e_4_1 };
                            return [3 /*break*/, 9];
                        case 8:
                            try {
                                if (entries_2_1 && !entries_2_1.done && (_a = entries_2.return)) _a.call(entries_2);
                            }
                            finally { if (e_4) throw e_4.error; }
                            return [7 /*endfinally*/];
                        case 9: return [2 /*return*/, result];
                    }
                });
            }); }));
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
            return wireCancellationToken(token, this._worker(resource)
                .then(function (worker) { return worker.getNavigationBarItems(resource.toString()); })
                .then(function (items) {
                if (!items) {
                    return;
                }
                var convert = function (bucket, item, containerLabel) {
                    var e_5, _a;
                    var result = {
                        name: item.text,
                        detail: '',
                        kind: ((outlineTypeTable[item.kind] ||
                            monaco.languages.SymbolKind.Variable)),
                        range: _this._textSpanToRange(resource, item.spans[0]),
                        selectionRange: _this._textSpanToRange(resource, item.spans[0]),
                        containerName: containerLabel,
                    };
                    if (item.childItems && item.childItems.length > 0) {
                        try {
                            for (var _b = __values(item.childItems), _c = _b.next(); !_c.done; _c = _b.next()) {
                                var child = _c.value;
                                convert(bucket, child, result.name);
                            }
                        }
                        catch (e_5_1) { e_5 = { error: e_5_1 }; }
                        finally {
                            try {
                                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                            }
                            finally { if (e_5) throw e_5.error; }
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
                IndentStyle: IndentStyle.Smart,
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
                PlaceOpenBraceOnNewLineForFunctions: false,
            };
        };
        FormatHelper.prototype._convertTextChanges = function (uri, change) {
            return {
                text: change.newText,
                range: this._textSpanToRange(uri, change.span),
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
            return wireCancellationToken(token, this._worker(resource)
                .then(function (worker) {
                return worker.getFormattingEditsForRange(resource.toString(), _this._positionToOffset(resource, {
                    lineNumber: range.startLineNumber,
                    column: range.startColumn,
                }), _this._positionToOffset(resource, {
                    lineNumber: range.endLineNumber,
                    column: range.endColumn,
                }), FormatHelper._convertOptions(options));
            })
                .then(function (edits) {
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
            return wireCancellationToken(token, this._worker(resource)
                .then(function (worker) {
                return worker.getFormattingEditsAfterKeystroke(resource.toString(), _this._positionToOffset(resource, position), ch, FormatHelper._convertOptions(options));
            })
                .then(function (edits) {
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
