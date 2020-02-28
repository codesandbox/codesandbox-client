"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
//
// Original code forked from https://github.com/Quramy/ts-graphql-plugin
Object.defineProperty(exports, "__esModule", { value: true });
var vscode_css_languageservice_1 = require("vscode-css-languageservice");
var vscode_emmet_helper_1 = require("vscode-emmet-helper");
var vscode = require("vscode-languageserver-types");
var config = require("./_config");
var cssErrorCode = 9999;
function arePositionsEqual(left, right) {
    return left.line === right.line && left.character === right.character;
}
function isAfter(left, right) {
    return right.line > left.line || (right.line === left.line && right.character >= left.character);
}
function overlaps(a, b) {
    return !isAfter(a.end, b.start) && !isAfter(b.end, a.start);
}
var emptyCompletionList = {
    items: [],
    isIncomplete: false,
};
var CompletionsCache = /** @class */ (function () {
    function CompletionsCache() {
    }
    CompletionsCache.prototype.getCached = function (context, position) {
        if (this._completions
            && context.fileName === this._cachedCompletionsFile
            && this._cachedCompletionsPosition && arePositionsEqual(position, this._cachedCompletionsPosition)
            && context.text === this._cachedCompletionsContent) {
            return this._completions;
        }
        return undefined;
    };
    CompletionsCache.prototype.updateCached = function (context, position, completions) {
        this._cachedCompletionsFile = context.fileName;
        this._cachedCompletionsPosition = position;
        this._cachedCompletionsContent = context.text;
        this._completions = completions;
    };
    return CompletionsCache;
}());
var StyledTemplateLanguageService = /** @class */ (function () {
    function StyledTemplateLanguageService(typescript, configuration, virtualDocumentFactory, logger // tslint:disable-line
    ) {
        this.typescript = typescript;
        this.configuration = configuration;
        this.virtualDocumentFactory = virtualDocumentFactory;
        this.logger = logger;
        this._completionsCache = new CompletionsCache();
    }
    Object.defineProperty(StyledTemplateLanguageService.prototype, "cssLanguageService", {
        get: function () {
            if (!this._cssLanguageService) {
                this._cssLanguageService = vscode_css_languageservice_1.getCSSLanguageService();
                this._cssLanguageService.configure(this.configuration);
            }
            return this._cssLanguageService;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StyledTemplateLanguageService.prototype, "scssLanguageService", {
        get: function () {
            if (!this._scssLanguageService) {
                this._scssLanguageService = vscode_css_languageservice_1.getSCSSLanguageService();
                this._scssLanguageService.configure(this.configuration);
            }
            return this._scssLanguageService;
        },
        enumerable: true,
        configurable: true
    });
    StyledTemplateLanguageService.prototype.getCompletionsAtPosition = function (context, position) {
        var items = this.getCompletionItems(context, position);
        return translateCompletionItemsToCompletionInfo(this.typescript, items);
    };
    StyledTemplateLanguageService.prototype.getCompletionEntryDetails = function (context, position, name) {
        var item = this.getCompletionItems(context, position).items.find(function (x) { return x.label === name; });
        if (!item) {
            return {
                name: name,
                kind: this.typescript.ScriptElementKind.unknown,
                kindModifiers: '',
                tags: [],
                displayParts: toDisplayParts(name),
                documentation: [],
            };
        }
        return translateCompletionItemsToCompletionEntryDetails(this.typescript, item);
    };
    StyledTemplateLanguageService.prototype.getQuickInfoAtPosition = function (context, position) {
        var doc = this.virtualDocumentFactory.createVirtualDocument(context);
        var stylesheet = this.scssLanguageService.parseStylesheet(doc);
        var hover = this.scssLanguageService.doHover(doc, this.virtualDocumentFactory.toVirtualDocPosition(position), stylesheet);
        if (hover) {
            return this.translateHover(hover, this.virtualDocumentFactory.toVirtualDocPosition(position), context);
        }
        return undefined;
    };
    StyledTemplateLanguageService.prototype.getSemanticDiagnostics = function (context) {
        var doc = this.virtualDocumentFactory.createVirtualDocument(context);
        var stylesheet = this.scssLanguageService.parseStylesheet(doc);
        return this.translateDiagnostics(this.scssLanguageService.doValidation(doc, stylesheet), doc, context, context.text).filter(function (x) { return !!x; });
    };
    StyledTemplateLanguageService.prototype.getSupportedCodeFixes = function () {
        return [cssErrorCode];
    };
    StyledTemplateLanguageService.prototype.getCodeFixesAtPosition = function (context, start, end, _errorCodes, _format) {
        var doc = this.virtualDocumentFactory.createVirtualDocument(context);
        var stylesheet = this.scssLanguageService.parseStylesheet(doc);
        var range = this.toVsRange(context, start, end);
        var diagnostics = this.scssLanguageService.doValidation(doc, stylesheet)
            .filter(function (diagnostic) { return overlaps(diagnostic.range, range); });
        return this.translateCodeActions(context, this.scssLanguageService.doCodeActions(doc, range, { diagnostics: diagnostics }, stylesheet));
    };
    StyledTemplateLanguageService.prototype.getOutliningSpans = function (context) {
        var _this = this;
        var doc = this.virtualDocumentFactory.createVirtualDocument(context);
        var ranges = this.scssLanguageService.getFoldingRanges(doc);
        return ranges
            .filter(function (range) {
            // Filter out ranges outside on last line
            var end = context.toOffset({
                line: range.endLine,
                character: range.endCharacter || 0,
            });
            return end < context.text.length;
        })
            .map(function (range) { return _this.translateOutliningSpan(context, range); });
    };
    StyledTemplateLanguageService.prototype.toVsRange = function (context, start, end) {
        return {
            start: this.virtualDocumentFactory.toVirtualDocPosition(context.toPosition(start)),
            end: this.virtualDocumentFactory.toVirtualDocPosition(context.toPosition(end)),
        };
    };
    StyledTemplateLanguageService.prototype.getCompletionItems = function (context, position) {
        var _a;
        var cached = this._completionsCache.getCached(context, position);
        if (cached) {
            return cached;
        }
        var doc = this.virtualDocumentFactory.createVirtualDocument(context);
        var virtualPosition = this.virtualDocumentFactory.toVirtualDocPosition(position);
        var stylesheet = this.scssLanguageService.parseStylesheet(doc);
        var emmetResults = {
            isIncomplete: true,
            items: [],
        };
        this.cssLanguageService.setCompletionParticipants([vscode_emmet_helper_1.getEmmetCompletionParticipants(doc, virtualPosition, 'css', this.configuration.emmet, emmetResults)]);
        var completionsCss = this.cssLanguageService.doComplete(doc, virtualPosition, stylesheet) || emptyCompletionList;
        var completionsScss = this.scssLanguageService.doComplete(doc, virtualPosition, stylesheet) || emptyCompletionList;
        completionsScss.items = filterScssCompletionItems(completionsScss.items);
        var completions = {
            isIncomplete: false,
            items: completionsCss.items.concat(completionsScss.items),
        };
        if (emmetResults.items.length) {
            (_a = completions.items).push.apply(_a, emmetResults.items);
            completions.isIncomplete = true;
        }
        this._completionsCache.updateCached(context, position, completions);
        return completions;
    };
    StyledTemplateLanguageService.prototype.translateDiagnostics = function (diagnostics, doc, context, content) {
        var _this = this;
        var sourceFile = context.node.getSourceFile();
        return diagnostics.map(function (diag) {
            return _this.translateDiagnostic(diag, sourceFile, doc, context, content);
        });
    };
    StyledTemplateLanguageService.prototype.translateDiagnostic = function (diagnostic, file, doc, context, content) {
        // Make sure returned error is within the real document
        if (diagnostic.range.start.line === 0
            || diagnostic.range.start.line > doc.lineCount
            || diagnostic.range.start.character >= content.length) {
            return undefined;
        }
        var start = context.toOffset(this.virtualDocumentFactory.fromVirtualDocPosition(diagnostic.range.start));
        var length = context.toOffset(this.virtualDocumentFactory.fromVirtualDocPosition(diagnostic.range.end)) - start;
        var code = typeof diagnostic.code === 'number' ? diagnostic.code : cssErrorCode;
        return {
            code: code,
            messageText: diagnostic.message,
            category: translateSeverity(this.typescript, diagnostic.severity),
            file: file,
            start: start,
            length: length,
            source: config.pluginName,
        };
    };
    StyledTemplateLanguageService.prototype.translateHover = function (hover, position, context) {
        var contents = [];
        var convertPart = function (hoverContents) {
            if (typeof hoverContents === 'string') {
                contents.push({ kind: 'unknown', text: hoverContents });
            }
            else if (Array.isArray(hoverContents)) {
                hoverContents.forEach(convertPart);
            }
            else {
                contents.push({ kind: 'unknown', text: hoverContents.value });
            }
        };
        convertPart(hover.contents);
        var start = context.toOffset(this.virtualDocumentFactory.fromVirtualDocPosition(hover.range ? hover.range.start : position));
        return {
            kind: this.typescript.ScriptElementKind.unknown,
            kindModifiers: '',
            textSpan: {
                start: start,
                length: hover.range ? context.toOffset(this.virtualDocumentFactory.fromVirtualDocPosition(hover.range.end)) - start : 1,
            },
            displayParts: [],
            documentation: contents,
            tags: [],
        };
    };
    StyledTemplateLanguageService.prototype.translateCodeActions = function (context, codeActions) {
        var _this = this;
        var actions = [];
        for (var _i = 0, codeActions_1 = codeActions; _i < codeActions_1.length; _i++) {
            var vsAction = codeActions_1[_i];
            if (vsAction.command !== '_css.applyCodeAction') {
                continue;
            }
            var edits = vsAction.arguments && vsAction.arguments[2];
            if (edits) {
                actions.push({
                    description: vsAction.title,
                    changes: edits.map(function (edit) { return _this.translateTextEditToFileTextChange(context, edit); }),
                });
            }
        }
        return actions;
    };
    StyledTemplateLanguageService.prototype.translateTextEditToFileTextChange = function (context, textEdit) {
        var start = context.toOffset(this.virtualDocumentFactory.fromVirtualDocPosition(textEdit.range.start));
        var end = context.toOffset(this.virtualDocumentFactory.fromVirtualDocPosition(textEdit.range.end));
        return {
            fileName: context.fileName,
            textChanges: [{
                    newText: textEdit.newText,
                    span: {
                        start: start,
                        length: end - start,
                    },
                }],
        };
    };
    StyledTemplateLanguageService.prototype.translateOutliningSpan = function (context, range) {
        var startOffset = context.toOffset(this.virtualDocumentFactory.fromVirtualDocPosition({ line: range.startLine, character: range.startCharacter || 0 }));
        var endOffset = context.toOffset(this.virtualDocumentFactory.fromVirtualDocPosition({ line: range.endLine, character: range.endCharacter || 0 }));
        var span = {
            start: startOffset,
            length: endOffset - startOffset,
        };
        return {
            autoCollapse: false,
            kind: this.typescript.OutliningSpanKind.Code,
            bannerText: '',
            textSpan: span,
            hintSpan: span,
        };
    };
    return StyledTemplateLanguageService;
}());
exports.StyledTemplateLanguageService = StyledTemplateLanguageService;
function filterScssCompletionItems(items) {
    return items.filter(function (item) { return (item.kind === vscode.CompletionItemKind.Function && item.label.substr(0, 1) === ':'); });
}
function translateCompletionItemsToCompletionInfo(typescript, items) {
    return {
        isGlobalCompletion: false,
        isMemberCompletion: false,
        isNewIdentifierLocation: false,
        entries: items.items.map(function (x) { return translateCompetionEntry(typescript, x); }),
    };
}
function translateCompletionItemsToCompletionEntryDetails(typescript, item) {
    return {
        name: item.label,
        kind: item.kind ? translateCompletionItemKind(typescript, item.kind) : typescript.ScriptElementKind.unknown,
        kindModifiers: getKindModifiers(item),
        displayParts: toDisplayParts(item.detail),
        documentation: toDisplayParts(item.documentation),
        tags: [],
    };
}
function translateCompetionEntry(typescript, item) {
    return {
        name: item.label,
        kind: item.kind ? translateCompletionItemKind(typescript, item.kind) : typescript.ScriptElementKind.unknown,
        kindModifiers: getKindModifiers(item),
        sortText: item.sortText || item.label,
    };
}
function translateCompletionItemKind(typescript, kind) {
    switch (kind) {
        case vscode.CompletionItemKind.Method:
            return typescript.ScriptElementKind.memberFunctionElement;
        case vscode.CompletionItemKind.Function:
            return typescript.ScriptElementKind.functionElement;
        case vscode.CompletionItemKind.Constructor:
            return typescript.ScriptElementKind.constructorImplementationElement;
        case vscode.CompletionItemKind.Field:
        case vscode.CompletionItemKind.Variable:
            return typescript.ScriptElementKind.variableElement;
        case vscode.CompletionItemKind.Class:
            return typescript.ScriptElementKind.classElement;
        case vscode.CompletionItemKind.Interface:
            return typescript.ScriptElementKind.interfaceElement;
        case vscode.CompletionItemKind.Module:
            return typescript.ScriptElementKind.moduleElement;
        case vscode.CompletionItemKind.Property:
            return typescript.ScriptElementKind.memberVariableElement;
        case vscode.CompletionItemKind.Unit:
        case vscode.CompletionItemKind.Value:
            return typescript.ScriptElementKind.constElement;
        case vscode.CompletionItemKind.Enum:
            return typescript.ScriptElementKind.enumElement;
        case vscode.CompletionItemKind.Keyword:
            return typescript.ScriptElementKind.keyword;
        case vscode.CompletionItemKind.Color:
            return typescript.ScriptElementKind.constElement;
        case vscode.CompletionItemKind.Reference:
            return typescript.ScriptElementKind.alias;
        case vscode.CompletionItemKind.File:
            return typescript.ScriptElementKind.moduleElement;
        case vscode.CompletionItemKind.Snippet:
        case vscode.CompletionItemKind.Text:
        default:
            return typescript.ScriptElementKind.unknown;
    }
}
function getKindModifiers(item) {
    if (item.kind === vscode.CompletionItemKind.Color) {
        return 'color';
    }
    return '';
}
function translateSeverity(typescript, severity) {
    switch (severity) {
        case vscode.DiagnosticSeverity.Information:
        case vscode.DiagnosticSeverity.Hint:
            return typescript.DiagnosticCategory.Message;
        case vscode.DiagnosticSeverity.Warning:
            return typescript.DiagnosticCategory.Warning;
        case vscode.DiagnosticSeverity.Error:
        default:
            return typescript.DiagnosticCategory.Error;
    }
}
function toDisplayParts(text) {
    if (!text) {
        return [];
    }
    return [{
            kind: 'text',
            text: typeof text === 'string' ? text : text.value,
        }];
}
