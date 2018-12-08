/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
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
import * as modes from '../../../editor/common/modes.js';
import * as types from './extHostTypes.js';
import { URI } from '../../../base/common/uri.js';
import * as htmlContent from '../../../base/common/htmlContent.js';
import { MarkerSeverity } from '../../../platform/markers/common/markers.js';
import { ACTIVE_GROUP, SIDE_GROUP } from '../../services/editor/common/editorService.js';
import { isString, isNumber } from '../../../base/common/types.js';
import * as marked from '../../../base/common/marked/marked.js';
export var Selection;
(function (Selection) {
    function to(selection) {
        var selectionStartLineNumber = selection.selectionStartLineNumber, selectionStartColumn = selection.selectionStartColumn, positionLineNumber = selection.positionLineNumber, positionColumn = selection.positionColumn;
        var start = new types.Position(selectionStartLineNumber - 1, selectionStartColumn - 1);
        var end = new types.Position(positionLineNumber - 1, positionColumn - 1);
        return new types.Selection(start, end);
    }
    Selection.to = to;
    function from(selection) {
        var anchor = selection.anchor, active = selection.active;
        return {
            selectionStartLineNumber: anchor.line + 1,
            selectionStartColumn: anchor.character + 1,
            positionLineNumber: active.line + 1,
            positionColumn: active.character + 1
        };
    }
    Selection.from = from;
})(Selection || (Selection = {}));
export var Range;
(function (Range) {
    function from(range) {
        if (!range) {
            return undefined;
        }
        var start = range.start, end = range.end;
        return {
            startLineNumber: start.line + 1,
            startColumn: start.character + 1,
            endLineNumber: end.line + 1,
            endColumn: end.character + 1
        };
    }
    Range.from = from;
    function to(range) {
        if (!range) {
            return undefined;
        }
        var startLineNumber = range.startLineNumber, startColumn = range.startColumn, endLineNumber = range.endLineNumber, endColumn = range.endColumn;
        return new types.Range(startLineNumber - 1, startColumn - 1, endLineNumber - 1, endColumn - 1);
    }
    Range.to = to;
})(Range || (Range = {}));
export var Position;
(function (Position) {
    function to(position) {
        return new types.Position(position.lineNumber - 1, position.column - 1);
    }
    Position.to = to;
    function from(position) {
        return { lineNumber: position.line + 1, column: position.character + 1 };
    }
    Position.from = from;
})(Position || (Position = {}));
export var DiagnosticTag;
(function (DiagnosticTag) {
    function from(value) {
        switch (value) {
            case types.DiagnosticTag.Unnecessary:
                return 1 /* Unnecessary */;
        }
        return undefined;
    }
    DiagnosticTag.from = from;
})(DiagnosticTag || (DiagnosticTag = {}));
export var Diagnostic;
(function (Diagnostic) {
    function from(value) {
        return __assign({}, Range.from(value.range), { message: value.message, source: value.source, code: isString(value.code) || isNumber(value.code) ? String(value.code) : void 0, severity: DiagnosticSeverity.from(value.severity), relatedInformation: value.relatedInformation && value.relatedInformation.map(DiagnosticRelatedInformation.from), tags: Array.isArray(value.tags) ? value.tags.map(DiagnosticTag.from) : undefined });
    }
    Diagnostic.from = from;
})(Diagnostic || (Diagnostic = {}));
export var DiagnosticRelatedInformation;
(function (DiagnosticRelatedInformation) {
    function from(value) {
        return __assign({}, Range.from(value.location.range), { message: value.message, resource: value.location.uri });
    }
    DiagnosticRelatedInformation.from = from;
    function to(value) {
        return new types.DiagnosticRelatedInformation(new types.Location(value.resource, Range.to(value)), value.message);
    }
    DiagnosticRelatedInformation.to = to;
})(DiagnosticRelatedInformation || (DiagnosticRelatedInformation = {}));
export var DiagnosticSeverity;
(function (DiagnosticSeverity) {
    function from(value) {
        switch (value) {
            case types.DiagnosticSeverity.Error:
                return MarkerSeverity.Error;
            case types.DiagnosticSeverity.Warning:
                return MarkerSeverity.Warning;
            case types.DiagnosticSeverity.Information:
                return MarkerSeverity.Info;
            case types.DiagnosticSeverity.Hint:
                return MarkerSeverity.Hint;
        }
        return MarkerSeverity.Error;
    }
    DiagnosticSeverity.from = from;
    function to(value) {
        switch (value) {
            case MarkerSeverity.Info:
                return types.DiagnosticSeverity.Information;
            case MarkerSeverity.Warning:
                return types.DiagnosticSeverity.Warning;
            case MarkerSeverity.Error:
                return types.DiagnosticSeverity.Error;
            case MarkerSeverity.Hint:
                return types.DiagnosticSeverity.Hint;
        }
        return types.DiagnosticSeverity.Error;
    }
    DiagnosticSeverity.to = to;
})(DiagnosticSeverity || (DiagnosticSeverity = {}));
export var ViewColumn;
(function (ViewColumn) {
    function from(column) {
        if (typeof column === 'number' && column >= types.ViewColumn.One) {
            return column - 1; // adjust zero index (ViewColumn.ONE => 0)
        }
        if (column === types.ViewColumn.Beside) {
            return SIDE_GROUP;
        }
        return ACTIVE_GROUP; // default is always the active group
    }
    ViewColumn.from = from;
    function to(position) {
        if (typeof position === 'number' && position >= 0) {
            return position + 1; // adjust to index (ViewColumn.ONE => 1)
        }
        return undefined;
    }
    ViewColumn.to = to;
})(ViewColumn || (ViewColumn = {}));
function isDecorationOptions(something) {
    return (typeof something.range !== 'undefined');
}
export function isDecorationOptionsArr(something) {
    if (something.length === 0) {
        return true;
    }
    return isDecorationOptions(something[0]) ? true : false;
}
export var MarkdownString;
(function (MarkdownString) {
    function fromMany(markup) {
        return markup.map(MarkdownString.from);
    }
    MarkdownString.fromMany = fromMany;
    function isCodeblock(thing) {
        return thing && typeof thing === 'object'
            && typeof thing.language === 'string'
            && typeof thing.value === 'string';
    }
    function from(markup) {
        var res;
        if (isCodeblock(markup)) {
            var language = markup.language, value = markup.value;
            res = { value: '```' + language + '\n' + value + '\n```\n' };
        }
        else if (htmlContent.isMarkdownString(markup)) {
            res = markup;
        }
        else if (typeof markup === 'string') {
            res = { value: markup };
        }
        else {
            res = { value: '' };
        }
        // extract uris into a separate object
        res.uris = Object.create(null);
        var renderer = new marked.Renderer();
        renderer.image = renderer.link = function (href) {
            try {
                res.uris[href] = URI.parse(href, true);
            }
            catch (e) {
                // ignore
            }
            return '';
        };
        marked(res.value, { renderer: renderer });
        return res;
    }
    MarkdownString.from = from;
    function to(value) {
        var ret = new htmlContent.MarkdownString(value.value);
        ret.isTrusted = value.isTrusted;
        return ret;
    }
    MarkdownString.to = to;
    function fromStrict(value) {
        if (!value) {
            return undefined;
        }
        return typeof value === 'string' ? value : MarkdownString.from(value);
    }
    MarkdownString.fromStrict = fromStrict;
})(MarkdownString || (MarkdownString = {}));
export function fromRangeOrRangeWithMessage(ranges) {
    if (isDecorationOptionsArr(ranges)) {
        return ranges.map(function (r) {
            return {
                range: Range.from(r.range),
                hoverMessage: Array.isArray(r.hoverMessage) ? MarkdownString.fromMany(r.hoverMessage) : r.hoverMessage && MarkdownString.from(r.hoverMessage),
                renderOptions: r.renderOptions
            };
        });
    }
    else {
        return ranges.map(function (r) {
            return {
                range: Range.from(r)
            };
        });
    }
}
function pathOrURIToURI(value) {
    if (typeof value === 'undefined') {
        return value;
    }
    if (typeof value === 'string') {
        return URI.file(value);
    }
    else {
        return value;
    }
}
export var ThemableDecorationAttachmentRenderOptions;
(function (ThemableDecorationAttachmentRenderOptions) {
    function from(options) {
        if (typeof options === 'undefined') {
            return options;
        }
        return {
            contentText: options.contentText,
            contentIconPath: pathOrURIToURI(options.contentIconPath),
            border: options.border,
            borderColor: options.borderColor,
            fontStyle: options.fontStyle,
            fontWeight: options.fontWeight,
            textDecoration: options.textDecoration,
            color: options.color,
            backgroundColor: options.backgroundColor,
            margin: options.margin,
            width: options.width,
            height: options.height,
        };
    }
    ThemableDecorationAttachmentRenderOptions.from = from;
})(ThemableDecorationAttachmentRenderOptions || (ThemableDecorationAttachmentRenderOptions = {}));
export var ThemableDecorationRenderOptions;
(function (ThemableDecorationRenderOptions) {
    function from(options) {
        if (typeof options === 'undefined') {
            return options;
        }
        return {
            backgroundColor: options.backgroundColor,
            outline: options.outline,
            outlineColor: options.outlineColor,
            outlineStyle: options.outlineStyle,
            outlineWidth: options.outlineWidth,
            border: options.border,
            borderColor: options.borderColor,
            borderRadius: options.borderRadius,
            borderSpacing: options.borderSpacing,
            borderStyle: options.borderStyle,
            borderWidth: options.borderWidth,
            fontStyle: options.fontStyle,
            fontWeight: options.fontWeight,
            textDecoration: options.textDecoration,
            cursor: options.cursor,
            color: options.color,
            opacity: options.opacity,
            letterSpacing: options.letterSpacing,
            gutterIconPath: pathOrURIToURI(options.gutterIconPath),
            gutterIconSize: options.gutterIconSize,
            overviewRulerColor: options.overviewRulerColor,
            before: ThemableDecorationAttachmentRenderOptions.from(options.before),
            after: ThemableDecorationAttachmentRenderOptions.from(options.after),
        };
    }
    ThemableDecorationRenderOptions.from = from;
})(ThemableDecorationRenderOptions || (ThemableDecorationRenderOptions = {}));
export var DecorationRangeBehavior;
(function (DecorationRangeBehavior) {
    function from(value) {
        if (typeof value === 'undefined') {
            return value;
        }
        switch (value) {
            case types.DecorationRangeBehavior.OpenOpen:
                return 0 /* AlwaysGrowsWhenTypingAtEdges */;
            case types.DecorationRangeBehavior.ClosedClosed:
                return 1 /* NeverGrowsWhenTypingAtEdges */;
            case types.DecorationRangeBehavior.OpenClosed:
                return 2 /* GrowsOnlyWhenTypingBefore */;
            case types.DecorationRangeBehavior.ClosedOpen:
                return 3 /* GrowsOnlyWhenTypingAfter */;
        }
    }
    DecorationRangeBehavior.from = from;
})(DecorationRangeBehavior || (DecorationRangeBehavior = {}));
export var DecorationRenderOptions;
(function (DecorationRenderOptions) {
    function from(options) {
        return {
            isWholeLine: options.isWholeLine,
            rangeBehavior: DecorationRangeBehavior.from(options.rangeBehavior),
            overviewRulerLane: options.overviewRulerLane,
            light: ThemableDecorationRenderOptions.from(options.light),
            dark: ThemableDecorationRenderOptions.from(options.dark),
            backgroundColor: options.backgroundColor,
            outline: options.outline,
            outlineColor: options.outlineColor,
            outlineStyle: options.outlineStyle,
            outlineWidth: options.outlineWidth,
            border: options.border,
            borderColor: options.borderColor,
            borderRadius: options.borderRadius,
            borderSpacing: options.borderSpacing,
            borderStyle: options.borderStyle,
            borderWidth: options.borderWidth,
            fontStyle: options.fontStyle,
            fontWeight: options.fontWeight,
            textDecoration: options.textDecoration,
            cursor: options.cursor,
            color: options.color,
            opacity: options.opacity,
            letterSpacing: options.letterSpacing,
            gutterIconPath: pathOrURIToURI(options.gutterIconPath),
            gutterIconSize: options.gutterIconSize,
            overviewRulerColor: options.overviewRulerColor,
            before: ThemableDecorationAttachmentRenderOptions.from(options.before),
            after: ThemableDecorationAttachmentRenderOptions.from(options.after),
        };
    }
    DecorationRenderOptions.from = from;
})(DecorationRenderOptions || (DecorationRenderOptions = {}));
export var TextEdit;
(function (TextEdit) {
    function from(edit) {
        return {
            text: edit.newText,
            eol: EndOfLine.from(edit.newEol),
            range: Range.from(edit.range)
        };
    }
    TextEdit.from = from;
    function to(edit) {
        var result = new types.TextEdit(Range.to(edit.range), edit.text);
        result.newEol = EndOfLine.to(edit.eol);
        return result;
    }
    TextEdit.to = to;
})(TextEdit || (TextEdit = {}));
export var WorkspaceEdit;
(function (WorkspaceEdit) {
    function from(value, documents) {
        var result = {
            edits: []
        };
        for (var _i = 0, _a = value._allEntries(); _i < _a.length; _i++) {
            var entry = _a[_i];
            var uri = entry[0], uriOrEdits = entry[1];
            if (Array.isArray(uriOrEdits)) {
                // text edits
                var doc = documents ? documents.getDocument(uri.toString()) : undefined;
                result.edits.push({ resource: uri, modelVersionId: doc && doc.version, edits: uriOrEdits.map(TextEdit.from) });
            }
            else {
                // resource edits
                result.edits.push({ oldUri: uri, newUri: uriOrEdits, options: entry[2] });
            }
        }
        return result;
    }
    WorkspaceEdit.from = from;
    function to(value) {
        var result = new types.WorkspaceEdit();
        for (var _i = 0, _a = value.edits; _i < _a.length; _i++) {
            var edit = _a[_i];
            if (Array.isArray(edit.edits)) {
                result.set(URI.revive(edit.resource), edit.edits.map(TextEdit.to));
            }
            else {
                result.renameFile(URI.revive(edit.oldUri), URI.revive(edit.newUri), edit.options);
            }
        }
        return result;
    }
    WorkspaceEdit.to = to;
})(WorkspaceEdit || (WorkspaceEdit = {}));
export var SymbolKind;
(function (SymbolKind) {
    var _fromMapping = Object.create(null);
    _fromMapping[types.SymbolKind.File] = 0 /* File */;
    _fromMapping[types.SymbolKind.Module] = 1 /* Module */;
    _fromMapping[types.SymbolKind.Namespace] = 2 /* Namespace */;
    _fromMapping[types.SymbolKind.Package] = 3 /* Package */;
    _fromMapping[types.SymbolKind.Class] = 4 /* Class */;
    _fromMapping[types.SymbolKind.Method] = 5 /* Method */;
    _fromMapping[types.SymbolKind.Property] = 6 /* Property */;
    _fromMapping[types.SymbolKind.Field] = 7 /* Field */;
    _fromMapping[types.SymbolKind.Constructor] = 8 /* Constructor */;
    _fromMapping[types.SymbolKind.Enum] = 9 /* Enum */;
    _fromMapping[types.SymbolKind.Interface] = 10 /* Interface */;
    _fromMapping[types.SymbolKind.Function] = 11 /* Function */;
    _fromMapping[types.SymbolKind.Variable] = 12 /* Variable */;
    _fromMapping[types.SymbolKind.Constant] = 13 /* Constant */;
    _fromMapping[types.SymbolKind.String] = 14 /* String */;
    _fromMapping[types.SymbolKind.Number] = 15 /* Number */;
    _fromMapping[types.SymbolKind.Boolean] = 16 /* Boolean */;
    _fromMapping[types.SymbolKind.Array] = 17 /* Array */;
    _fromMapping[types.SymbolKind.Object] = 18 /* Object */;
    _fromMapping[types.SymbolKind.Key] = 19 /* Key */;
    _fromMapping[types.SymbolKind.Null] = 20 /* Null */;
    _fromMapping[types.SymbolKind.EnumMember] = 21 /* EnumMember */;
    _fromMapping[types.SymbolKind.Struct] = 22 /* Struct */;
    _fromMapping[types.SymbolKind.Event] = 23 /* Event */;
    _fromMapping[types.SymbolKind.Operator] = 24 /* Operator */;
    _fromMapping[types.SymbolKind.TypeParameter] = 25 /* TypeParameter */;
    function from(kind) {
        return typeof _fromMapping[kind] === 'number' ? _fromMapping[kind] : 6 /* Property */;
    }
    SymbolKind.from = from;
    function to(kind) {
        for (var k in _fromMapping) {
            if (_fromMapping[k] === kind) {
                return Number(k);
            }
        }
        return types.SymbolKind.Property;
    }
    SymbolKind.to = to;
})(SymbolKind || (SymbolKind = {}));
export var WorkspaceSymbol;
(function (WorkspaceSymbol) {
    function from(info) {
        return {
            name: info.name,
            kind: SymbolKind.from(info.kind),
            containerName: info.containerName,
            location: location.from(info.location)
        };
    }
    WorkspaceSymbol.from = from;
    function to(info) {
        return new types.SymbolInformation(info.name, SymbolKind.to(info.kind), info.containerName, location.to(info.location));
    }
    WorkspaceSymbol.to = to;
})(WorkspaceSymbol || (WorkspaceSymbol = {}));
export var DocumentSymbol;
(function (DocumentSymbol) {
    function from(info) {
        var result = {
            name: info.name,
            detail: info.detail,
            range: Range.from(info.range),
            selectionRange: Range.from(info.selectionRange),
            kind: SymbolKind.from(info.kind)
        };
        if (info.children) {
            result.children = info.children.map(from);
        }
        return result;
    }
    DocumentSymbol.from = from;
    function to(info) {
        var result = new types.DocumentSymbol(info.name, info.detail, SymbolKind.to(info.kind), Range.to(info.range), Range.to(info.selectionRange));
        if (info.children) {
            result.children = info.children.map(to);
        }
        return result;
    }
    DocumentSymbol.to = to;
})(DocumentSymbol || (DocumentSymbol = {}));
export var location;
(function (location) {
    function from(value) {
        return {
            range: value.range && Range.from(value.range),
            uri: value.uri
        };
    }
    location.from = from;
    function to(value) {
        return new types.Location(value.uri, Range.to(value.range));
    }
    location.to = to;
})(location || (location = {}));
export var DefinitionLink;
(function (DefinitionLink) {
    function from(value) {
        var definitionLink = value;
        var location = value;
        return {
            origin: definitionLink.originSelectionRange
                ? Range.from(definitionLink.originSelectionRange)
                : undefined,
            uri: definitionLink.targetUri ? definitionLink.targetUri : location.uri,
            range: Range.from(definitionLink.targetRange ? definitionLink.targetRange : location.range),
            selectionRange: definitionLink.targetSelectionRange
                ? Range.from(definitionLink.targetSelectionRange)
                : undefined,
        };
    }
    DefinitionLink.from = from;
})(DefinitionLink || (DefinitionLink = {}));
export var Hover;
(function (Hover) {
    function from(hover) {
        return {
            range: Range.from(hover.range),
            contents: MarkdownString.fromMany(hover.contents)
        };
    }
    Hover.from = from;
    function to(info) {
        return new types.Hover(info.contents.map(MarkdownString.to), Range.to(info.range));
    }
    Hover.to = to;
})(Hover || (Hover = {}));
export var DocumentHighlight;
(function (DocumentHighlight) {
    function from(documentHighlight) {
        return {
            range: Range.from(documentHighlight.range),
            kind: documentHighlight.kind
        };
    }
    DocumentHighlight.from = from;
    function to(occurrence) {
        return new types.DocumentHighlight(Range.to(occurrence.range), occurrence.kind);
    }
    DocumentHighlight.to = to;
})(DocumentHighlight || (DocumentHighlight = {}));
export var CompletionTriggerKind;
(function (CompletionTriggerKind) {
    function to(kind) {
        switch (kind) {
            case 1 /* TriggerCharacter */:
                return types.CompletionTriggerKind.TriggerCharacter;
            case 2 /* TriggerForIncompleteCompletions */:
                return types.CompletionTriggerKind.TriggerForIncompleteCompletions;
            case 0 /* Invoke */:
            default:
                return types.CompletionTriggerKind.Invoke;
        }
    }
    CompletionTriggerKind.to = to;
})(CompletionTriggerKind || (CompletionTriggerKind = {}));
export var CompletionContext;
(function (CompletionContext) {
    function to(context) {
        return {
            triggerKind: CompletionTriggerKind.to(context.triggerKind),
            triggerCharacter: context.triggerCharacter
        };
    }
    CompletionContext.to = to;
})(CompletionContext || (CompletionContext = {}));
export var CompletionItemKind;
(function (CompletionItemKind) {
    function from(kind) {
        switch (kind) {
            case types.CompletionItemKind.Method: return 0 /* Method */;
            case types.CompletionItemKind.Function: return 1 /* Function */;
            case types.CompletionItemKind.Constructor: return 2 /* Constructor */;
            case types.CompletionItemKind.Field: return 3 /* Field */;
            case types.CompletionItemKind.Variable: return 4 /* Variable */;
            case types.CompletionItemKind.Class: return 5 /* Class */;
            case types.CompletionItemKind.Interface: return 7 /* Interface */;
            case types.CompletionItemKind.Struct: return 6 /* Struct */;
            case types.CompletionItemKind.Module: return 8 /* Module */;
            case types.CompletionItemKind.Property: return 9 /* Property */;
            case types.CompletionItemKind.Unit: return 12 /* Unit */;
            case types.CompletionItemKind.Value: return 13 /* Value */;
            case types.CompletionItemKind.Constant: return 14 /* Constant */;
            case types.CompletionItemKind.Enum: return 15 /* Enum */;
            case types.CompletionItemKind.EnumMember: return 16 /* EnumMember */;
            case types.CompletionItemKind.Keyword: return 17 /* Keyword */;
            case types.CompletionItemKind.Snippet: return 25 /* Snippet */;
            case types.CompletionItemKind.Text: return 18 /* Text */;
            case types.CompletionItemKind.Color: return 19 /* Color */;
            case types.CompletionItemKind.File: return 20 /* File */;
            case types.CompletionItemKind.Reference: return 21 /* Reference */;
            case types.CompletionItemKind.Folder: return 23 /* Folder */;
            case types.CompletionItemKind.Event: return 10 /* Event */;
            case types.CompletionItemKind.Operator: return 11 /* Operator */;
            case types.CompletionItemKind.TypeParameter: return 24 /* TypeParameter */;
        }
        return 9 /* Property */;
    }
    CompletionItemKind.from = from;
    function to(kind) {
        switch (kind) {
            case 0 /* Method */: return types.CompletionItemKind.Method;
            case 1 /* Function */: return types.CompletionItemKind.Function;
            case 2 /* Constructor */: return types.CompletionItemKind.Constructor;
            case 3 /* Field */: return types.CompletionItemKind.Field;
            case 4 /* Variable */: return types.CompletionItemKind.Variable;
            case 5 /* Class */: return types.CompletionItemKind.Class;
            case 7 /* Interface */: return types.CompletionItemKind.Interface;
            case 6 /* Struct */: return types.CompletionItemKind.Struct;
            case 8 /* Module */: return types.CompletionItemKind.Module;
            case 9 /* Property */: return types.CompletionItemKind.Property;
            case 12 /* Unit */: return types.CompletionItemKind.Unit;
            case 13 /* Value */: return types.CompletionItemKind.Value;
            case 14 /* Constant */: return types.CompletionItemKind.Constant;
            case 15 /* Enum */: return types.CompletionItemKind.Enum;
            case 16 /* EnumMember */: return types.CompletionItemKind.EnumMember;
            case 17 /* Keyword */: return types.CompletionItemKind.Keyword;
            case 25 /* Snippet */: return types.CompletionItemKind.Snippet;
            case 18 /* Text */: return types.CompletionItemKind.Text;
            case 19 /* Color */: return types.CompletionItemKind.Color;
            case 20 /* File */: return types.CompletionItemKind.File;
            case 21 /* Reference */: return types.CompletionItemKind.Reference;
            case 23 /* Folder */: return types.CompletionItemKind.Folder;
            case 10 /* Event */: return types.CompletionItemKind.Event;
            case 11 /* Operator */: return types.CompletionItemKind.Operator;
            case 24 /* TypeParameter */: return types.CompletionItemKind.TypeParameter;
        }
        return types.CompletionItemKind.Property;
    }
    CompletionItemKind.to = to;
})(CompletionItemKind || (CompletionItemKind = {}));
export var CompletionItemInsertTextRule;
(function (CompletionItemInsertTextRule) {
    function from(rule) {
        var result = 0;
        if ((rule & types.CompletionItemInsertTextRule.KeepWhitespace)) {
            result += 1 /* KeepWhitespace */;
        }
        return result;
    }
    CompletionItemInsertTextRule.from = from;
    function to(rule) {
        var result = 0;
        if ((rule & 1 /* KeepWhitespace */)) {
            result += types.CompletionItemInsertTextRule.KeepWhitespace;
        }
        return result;
    }
    CompletionItemInsertTextRule.to = to;
})(CompletionItemInsertTextRule || (CompletionItemInsertTextRule = {}));
export var CompletionItem;
(function (CompletionItem) {
    function to(suggestion) {
        var result = new types.CompletionItem(suggestion.label);
        result.insertText = suggestion.insertText;
        result.kind = CompletionItemKind.to(suggestion.kind);
        result.detail = suggestion.detail;
        result.documentation = htmlContent.isMarkdownString(suggestion.documentation) ? MarkdownString.to(suggestion.documentation) : suggestion.documentation;
        result.sortText = suggestion.sortText;
        result.filterText = suggestion.filterText;
        result.preselect = suggestion.preselect;
        result.commitCharacters = suggestion.commitCharacters;
        result.range = Range.to(suggestion.range);
        result.insertTextRules = CompletionItemInsertTextRule.to(suggestion.insertTextRules);
        // 'inserText'-logic
        if (suggestion.insertTextRules & 4 /* InsertAsSnippet */) {
            result.insertText = new types.SnippetString(suggestion.insertText);
        }
        else {
            result.insertText = suggestion.insertText;
            result.textEdit = new types.TextEdit(result.range, result.insertText);
        }
        // TODO additionalEdits, command
        return result;
    }
    CompletionItem.to = to;
})(CompletionItem || (CompletionItem = {}));
export var ParameterInformation;
(function (ParameterInformation) {
    function from(info) {
        return {
            label: info.label,
            documentation: MarkdownString.fromStrict(info.documentation)
        };
    }
    ParameterInformation.from = from;
    function to(info) {
        return {
            label: info.label,
            documentation: htmlContent.isMarkdownString(info.documentation) ? MarkdownString.to(info.documentation) : info.documentation
        };
    }
    ParameterInformation.to = to;
})(ParameterInformation || (ParameterInformation = {}));
export var SignatureInformation;
(function (SignatureInformation) {
    function from(info) {
        return {
            label: info.label,
            documentation: MarkdownString.fromStrict(info.documentation),
            parameters: info.parameters && info.parameters.map(ParameterInformation.from)
        };
    }
    SignatureInformation.from = from;
    function to(info) {
        return {
            label: info.label,
            documentation: htmlContent.isMarkdownString(info.documentation) ? MarkdownString.to(info.documentation) : info.documentation,
            parameters: info.parameters && info.parameters.map(ParameterInformation.to)
        };
    }
    SignatureInformation.to = to;
})(SignatureInformation || (SignatureInformation = {}));
export var SignatureHelp;
(function (SignatureHelp) {
    function from(help) {
        return {
            activeSignature: help.activeSignature,
            activeParameter: help.activeParameter,
            signatures: help.signatures && help.signatures.map(SignatureInformation.from)
        };
    }
    SignatureHelp.from = from;
    function to(help) {
        return {
            activeSignature: help.activeSignature,
            activeParameter: help.activeParameter,
            signatures: help.signatures && help.signatures.map(SignatureInformation.to)
        };
    }
    SignatureHelp.to = to;
})(SignatureHelp || (SignatureHelp = {}));
export var DocumentLink;
(function (DocumentLink) {
    function from(link) {
        return {
            range: Range.from(link.range),
            url: link.target && link.target.toString()
        };
    }
    DocumentLink.from = from;
    function to(link) {
        return new types.DocumentLink(Range.to(link.range), link.url && URI.parse(link.url));
    }
    DocumentLink.to = to;
})(DocumentLink || (DocumentLink = {}));
export var ColorPresentation;
(function (ColorPresentation) {
    function to(colorPresentation) {
        var cp = new types.ColorPresentation(colorPresentation.label);
        if (colorPresentation.textEdit) {
            cp.textEdit = TextEdit.to(colorPresentation.textEdit);
        }
        if (colorPresentation.additionalTextEdits) {
            cp.additionalTextEdits = colorPresentation.additionalTextEdits.map(function (value) { return TextEdit.to(value); });
        }
        return cp;
    }
    ColorPresentation.to = to;
    function from(colorPresentation) {
        return {
            label: colorPresentation.label,
            textEdit: colorPresentation.textEdit ? TextEdit.from(colorPresentation.textEdit) : undefined,
            additionalTextEdits: colorPresentation.additionalTextEdits ? colorPresentation.additionalTextEdits.map(function (value) { return TextEdit.from(value); }) : undefined
        };
    }
    ColorPresentation.from = from;
})(ColorPresentation || (ColorPresentation = {}));
export var Color;
(function (Color) {
    function to(c) {
        return new types.Color(c[0], c[1], c[2], c[3]);
    }
    Color.to = to;
    function from(color) {
        return [color.red, color.green, color.blue, color.alpha];
    }
    Color.from = from;
})(Color || (Color = {}));
export var TextDocumentSaveReason;
(function (TextDocumentSaveReason) {
    function to(reason) {
        switch (reason) {
            case 2 /* AUTO */:
                return types.TextDocumentSaveReason.AfterDelay;
            case 1 /* EXPLICIT */:
                return types.TextDocumentSaveReason.Manual;
            case 3 /* FOCUS_CHANGE */:
            case 4 /* WINDOW_CHANGE */:
                return types.TextDocumentSaveReason.FocusOut;
        }
    }
    TextDocumentSaveReason.to = to;
})(TextDocumentSaveReason || (TextDocumentSaveReason = {}));
export var EndOfLine;
(function (EndOfLine) {
    function from(eol) {
        if (eol === types.EndOfLine.CRLF) {
            return 1 /* CRLF */;
        }
        else if (eol === types.EndOfLine.LF) {
            return 0 /* LF */;
        }
        return undefined;
    }
    EndOfLine.from = from;
    function to(eol) {
        if (eol === 1 /* CRLF */) {
            return types.EndOfLine.CRLF;
        }
        else if (eol === 0 /* LF */) {
            return types.EndOfLine.LF;
        }
        return undefined;
    }
    EndOfLine.to = to;
})(EndOfLine || (EndOfLine = {}));
export var ProgressLocation;
(function (ProgressLocation) {
    function from(loc) {
        switch (loc) {
            case types.ProgressLocation.SourceControl: return 3 /* Scm */;
            case types.ProgressLocation.Window: return 10 /* Window */;
            case types.ProgressLocation.Notification: return 15 /* Notification */;
        }
        return undefined;
    }
    ProgressLocation.from = from;
})(ProgressLocation || (ProgressLocation = {}));
export var FoldingRange;
(function (FoldingRange) {
    function from(r) {
        var range = { start: r.start + 1, end: r.end + 1 };
        if (r.kind) {
            range.kind = FoldingRangeKind.from(r.kind);
        }
        return range;
    }
    FoldingRange.from = from;
})(FoldingRange || (FoldingRange = {}));
export var FoldingRangeKind;
(function (FoldingRangeKind) {
    function from(kind) {
        if (kind) {
            switch (kind) {
                case types.FoldingRangeKind.Comment:
                    return modes.FoldingRangeKind.Comment;
                case types.FoldingRangeKind.Imports:
                    return modes.FoldingRangeKind.Imports;
                case types.FoldingRangeKind.Region:
                    return modes.FoldingRangeKind.Region;
            }
        }
        return void 0;
    }
    FoldingRangeKind.from = from;
})(FoldingRangeKind || (FoldingRangeKind = {}));
export var TextEditorOptions;
(function (TextEditorOptions) {
    function from(options) {
        if (options) {
            return {
                pinned: typeof options.preview === 'boolean' ? !options.preview : undefined,
                preserveFocus: options.preserveFocus,
                selection: typeof options.selection === 'object' ? Range.from(options.selection) : undefined
            };
        }
        return undefined;
    }
    TextEditorOptions.from = from;
})(TextEditorOptions || (TextEditorOptions = {}));
export var GlobPattern;
(function (GlobPattern) {
    function from(pattern) {
        if (pattern instanceof types.RelativePattern) {
            return pattern;
        }
        if (typeof pattern === 'string') {
            return pattern;
        }
        if (isRelativePattern(pattern)) {
            return new types.RelativePattern(pattern.base, pattern.pattern);
        }
        return pattern; // preserve `undefined` and `null`
    }
    GlobPattern.from = from;
    function isRelativePattern(obj) {
        var rp = obj;
        return rp && typeof rp.base === 'string' && typeof rp.pattern === 'string';
    }
})(GlobPattern || (GlobPattern = {}));
export var LanguageSelector;
(function (LanguageSelector) {
    function from(selector) {
        if (!selector) {
            return undefined;
        }
        else if (Array.isArray(selector)) {
            return selector.map(from);
        }
        else if (typeof selector === 'string') {
            return selector;
        }
        else {
            return {
                language: selector.language,
                scheme: selector.scheme,
                pattern: GlobPattern.from(selector.pattern),
                exclusive: selector.exclusive
            };
        }
    }
    LanguageSelector.from = from;
})(LanguageSelector || (LanguageSelector = {}));
