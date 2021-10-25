"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompletionTriggerKind = exports.SymbolKind = exports.WorkspaceEdit = exports.TextEdit = exports.Location = exports.Position = exports.Range = void 0;
/**
 * Helpers for converting FROM vscode types TO ts types
 */
const vscode = require("vscode");
const PConst = require("../protocol.const");
var Range;
(function (Range) {
    Range.fromTextSpan = (span) => Range.fromLocations(span.start, span.end);
    Range.toTextSpan = (range) => ({
        start: Position.toLocation(range.start),
        end: Position.toLocation(range.end)
    });
    Range.fromLocations = (start, end) => new vscode.Range(Math.max(0, start.line - 1), Math.max(start.offset - 1, 0), Math.max(0, end.line - 1), Math.max(0, end.offset - 1));
    Range.toFileRangeRequestArgs = (file, range) => ({
        file,
        startLine: range.start.line + 1,
        startOffset: range.start.character + 1,
        endLine: range.end.line + 1,
        endOffset: range.end.character + 1
    });
    Range.toFormattingRequestArgs = (file, range) => ({
        file,
        line: range.start.line + 1,
        offset: range.start.character + 1,
        endLine: range.end.line + 1,
        endOffset: range.end.character + 1
    });
})(Range = exports.Range || (exports.Range = {}));
var Position;
(function (Position) {
    Position.fromLocation = (tslocation) => new vscode.Position(tslocation.line - 1, tslocation.offset - 1);
    Position.toLocation = (vsPosition) => ({
        line: vsPosition.line + 1,
        offset: vsPosition.character + 1,
    });
    Position.toFileLocationRequestArgs = (file, position) => ({
        file,
        line: position.line + 1,
        offset: position.character + 1,
    });
})(Position = exports.Position || (exports.Position = {}));
var Location;
(function (Location) {
    Location.fromTextSpan = (resource, tsTextSpan) => new vscode.Location(resource, Range.fromTextSpan(tsTextSpan));
})(Location = exports.Location || (exports.Location = {}));
var TextEdit;
(function (TextEdit) {
    TextEdit.fromCodeEdit = (edit) => new vscode.TextEdit(Range.fromTextSpan(edit), edit.newText);
})(TextEdit = exports.TextEdit || (exports.TextEdit = {}));
var WorkspaceEdit;
(function (WorkspaceEdit) {
    function fromFileCodeEdits(client, edits) {
        return withFileCodeEdits(new vscode.WorkspaceEdit(), client, edits);
    }
    WorkspaceEdit.fromFileCodeEdits = fromFileCodeEdits;
    function withFileCodeEdits(workspaceEdit, client, edits) {
        for (const edit of edits) {
            const resource = client.toResource(edit.fileName);
            for (const textChange of edit.textChanges) {
                workspaceEdit.replace(resource, Range.fromTextSpan(textChange), textChange.newText);
            }
        }
        return workspaceEdit;
    }
    WorkspaceEdit.withFileCodeEdits = withFileCodeEdits;
})(WorkspaceEdit = exports.WorkspaceEdit || (exports.WorkspaceEdit = {}));
var SymbolKind;
(function (SymbolKind) {
    function fromProtocolScriptElementKind(kind) {
        switch (kind) {
            case PConst.Kind.module: return vscode.SymbolKind.Module;
            case PConst.Kind.class: return vscode.SymbolKind.Class;
            case PConst.Kind.enum: return vscode.SymbolKind.Enum;
            case PConst.Kind.enumMember: return vscode.SymbolKind.EnumMember;
            case PConst.Kind.interface: return vscode.SymbolKind.Interface;
            case PConst.Kind.indexSignature: return vscode.SymbolKind.Method;
            case PConst.Kind.callSignature: return vscode.SymbolKind.Method;
            case PConst.Kind.method: return vscode.SymbolKind.Method;
            case PConst.Kind.memberVariable: return vscode.SymbolKind.Property;
            case PConst.Kind.memberGetAccessor: return vscode.SymbolKind.Property;
            case PConst.Kind.memberSetAccessor: return vscode.SymbolKind.Property;
            case PConst.Kind.variable: return vscode.SymbolKind.Variable;
            case PConst.Kind.let: return vscode.SymbolKind.Variable;
            case PConst.Kind.const: return vscode.SymbolKind.Variable;
            case PConst.Kind.localVariable: return vscode.SymbolKind.Variable;
            case PConst.Kind.alias: return vscode.SymbolKind.Variable;
            case PConst.Kind.function: return vscode.SymbolKind.Function;
            case PConst.Kind.localFunction: return vscode.SymbolKind.Function;
            case PConst.Kind.constructSignature: return vscode.SymbolKind.Constructor;
            case PConst.Kind.constructorImplementation: return vscode.SymbolKind.Constructor;
            case PConst.Kind.typeParameter: return vscode.SymbolKind.TypeParameter;
            case PConst.Kind.string: return vscode.SymbolKind.String;
            default: return vscode.SymbolKind.Variable;
        }
    }
    SymbolKind.fromProtocolScriptElementKind = fromProtocolScriptElementKind;
})(SymbolKind = exports.SymbolKind || (exports.SymbolKind = {}));
var CompletionTriggerKind;
(function (CompletionTriggerKind) {
    function toProtocolCompletionTriggerKind(kind) {
        switch (kind) {
            case vscode.CompletionTriggerKind.Invoke: return 1;
            case vscode.CompletionTriggerKind.TriggerCharacter: return 2;
            case vscode.CompletionTriggerKind.TriggerForIncompleteCompletions: return 3;
        }
    }
    CompletionTriggerKind.toProtocolCompletionTriggerKind = toProtocolCompletionTriggerKind;
})(CompletionTriggerKind = exports.CompletionTriggerKind || (exports.CompletionTriggerKind = {}));
//# sourceMappingURL=typeConverters.js.map