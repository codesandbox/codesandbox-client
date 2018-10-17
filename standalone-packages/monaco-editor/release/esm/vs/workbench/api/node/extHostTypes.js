/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
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
import * as crypto from '../../../../crypto.js';
import { URI } from '../../../base/common/uri.js';
import { illegalArgument } from '../../../base/common/errors.js';
import { isMarkdownString } from '../../../base/common/htmlContent.js';
import { relative } from '../../../../path.js';
import { startsWith } from '../../../base/common/strings.js';
import { values } from '../../../base/common/map.js';
import { coalesce, equals } from '../../../base/common/arrays.js';
var Disposable = /** @class */ (function () {
    function Disposable(callOnDispose) {
        this._callOnDispose = callOnDispose;
    }
    Disposable.from = function () {
        var disposables = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            disposables[_i] = arguments[_i];
        }
        return new Disposable(function () {
            if (disposables) {
                for (var _i = 0, disposables_1 = disposables; _i < disposables_1.length; _i++) {
                    var disposable = disposables_1[_i];
                    if (disposable && typeof disposable.dispose === 'function') {
                        disposable.dispose();
                    }
                }
                disposables = undefined;
            }
        });
    };
    Disposable.prototype.dispose = function () {
        if (typeof this._callOnDispose === 'function') {
            this._callOnDispose();
            this._callOnDispose = undefined;
        }
    };
    return Disposable;
}());
export { Disposable };
var Position = /** @class */ (function () {
    function Position(line, character) {
        if (line < 0) {
            throw illegalArgument('line must be non-negative');
        }
        if (character < 0) {
            throw illegalArgument('character must be non-negative');
        }
        this._line = line;
        this._character = character;
    }
    Position.Min = function () {
        var positions = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            positions[_i] = arguments[_i];
        }
        var result = positions.pop();
        for (var _a = 0, positions_1 = positions; _a < positions_1.length; _a++) {
            var p = positions_1[_a];
            if (p.isBefore(result)) {
                result = p;
            }
        }
        return result;
    };
    Position.Max = function () {
        var positions = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            positions[_i] = arguments[_i];
        }
        var result = positions.pop();
        for (var _a = 0, positions_2 = positions; _a < positions_2.length; _a++) {
            var p = positions_2[_a];
            if (p.isAfter(result)) {
                result = p;
            }
        }
        return result;
    };
    Position.isPosition = function (other) {
        if (!other) {
            return false;
        }
        if (other instanceof Position) {
            return true;
        }
        var _a = other, line = _a.line, character = _a.character;
        if (typeof line === 'number' && typeof character === 'number') {
            return true;
        }
        return false;
    };
    Object.defineProperty(Position.prototype, "line", {
        get: function () {
            return this._line;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Position.prototype, "character", {
        get: function () {
            return this._character;
        },
        enumerable: true,
        configurable: true
    });
    Position.prototype.isBefore = function (other) {
        if (this._line < other._line) {
            return true;
        }
        if (other._line < this._line) {
            return false;
        }
        return this._character < other._character;
    };
    Position.prototype.isBeforeOrEqual = function (other) {
        if (this._line < other._line) {
            return true;
        }
        if (other._line < this._line) {
            return false;
        }
        return this._character <= other._character;
    };
    Position.prototype.isAfter = function (other) {
        return !this.isBeforeOrEqual(other);
    };
    Position.prototype.isAfterOrEqual = function (other) {
        return !this.isBefore(other);
    };
    Position.prototype.isEqual = function (other) {
        return this._line === other._line && this._character === other._character;
    };
    Position.prototype.compareTo = function (other) {
        if (this._line < other._line) {
            return -1;
        }
        else if (this._line > other.line) {
            return 1;
        }
        else {
            // equal line
            if (this._character < other._character) {
                return -1;
            }
            else if (this._character > other._character) {
                return 1;
            }
            else {
                // equal line and character
                return 0;
            }
        }
    };
    Position.prototype.translate = function (lineDeltaOrChange, characterDelta) {
        if (characterDelta === void 0) { characterDelta = 0; }
        if (lineDeltaOrChange === null || characterDelta === null) {
            throw illegalArgument();
        }
        var lineDelta;
        if (typeof lineDeltaOrChange === 'undefined') {
            lineDelta = 0;
        }
        else if (typeof lineDeltaOrChange === 'number') {
            lineDelta = lineDeltaOrChange;
        }
        else {
            lineDelta = typeof lineDeltaOrChange.lineDelta === 'number' ? lineDeltaOrChange.lineDelta : 0;
            characterDelta = typeof lineDeltaOrChange.characterDelta === 'number' ? lineDeltaOrChange.characterDelta : 0;
        }
        if (lineDelta === 0 && characterDelta === 0) {
            return this;
        }
        return new Position(this.line + lineDelta, this.character + characterDelta);
    };
    Position.prototype.with = function (lineOrChange, character) {
        if (character === void 0) { character = this.character; }
        if (lineOrChange === null || character === null) {
            throw illegalArgument();
        }
        var line;
        if (typeof lineOrChange === 'undefined') {
            line = this.line;
        }
        else if (typeof lineOrChange === 'number') {
            line = lineOrChange;
        }
        else {
            line = typeof lineOrChange.line === 'number' ? lineOrChange.line : this.line;
            character = typeof lineOrChange.character === 'number' ? lineOrChange.character : this.character;
        }
        if (line === this.line && character === this.character) {
            return this;
        }
        return new Position(line, character);
    };
    Position.prototype.toJSON = function () {
        return { line: this.line, character: this.character };
    };
    return Position;
}());
export { Position };
var Range = /** @class */ (function () {
    function Range(startLineOrStart, startColumnOrEnd, endLine, endColumn) {
        var start;
        var end;
        if (typeof startLineOrStart === 'number' && typeof startColumnOrEnd === 'number' && typeof endLine === 'number' && typeof endColumn === 'number') {
            start = new Position(startLineOrStart, startColumnOrEnd);
            end = new Position(endLine, endColumn);
        }
        else if (startLineOrStart instanceof Position && startColumnOrEnd instanceof Position) {
            start = startLineOrStart;
            end = startColumnOrEnd;
        }
        if (!start || !end) {
            throw new Error('Invalid arguments');
        }
        if (start.isBefore(end)) {
            this._start = start;
            this._end = end;
        }
        else {
            this._start = end;
            this._end = start;
        }
    }
    Range.isRange = function (thing) {
        if (thing instanceof Range) {
            return true;
        }
        if (!thing) {
            return false;
        }
        return Position.isPosition(thing.start)
            && Position.isPosition(thing.end);
    };
    Object.defineProperty(Range.prototype, "start", {
        get: function () {
            return this._start;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Range.prototype, "end", {
        get: function () {
            return this._end;
        },
        enumerable: true,
        configurable: true
    });
    Range.prototype.contains = function (positionOrRange) {
        if (positionOrRange instanceof Range) {
            return this.contains(positionOrRange._start)
                && this.contains(positionOrRange._end);
        }
        else if (positionOrRange instanceof Position) {
            if (positionOrRange.isBefore(this._start)) {
                return false;
            }
            if (this._end.isBefore(positionOrRange)) {
                return false;
            }
            return true;
        }
        return false;
    };
    Range.prototype.isEqual = function (other) {
        return this._start.isEqual(other._start) && this._end.isEqual(other._end);
    };
    Range.prototype.intersection = function (other) {
        var start = Position.Max(other.start, this._start);
        var end = Position.Min(other.end, this._end);
        if (start.isAfter(end)) {
            // this happens when there is no overlap:
            // |-----|
            //          |----|
            return undefined;
        }
        return new Range(start, end);
    };
    Range.prototype.union = function (other) {
        if (this.contains(other)) {
            return this;
        }
        else if (other.contains(this)) {
            return other;
        }
        var start = Position.Min(other.start, this._start);
        var end = Position.Max(other.end, this.end);
        return new Range(start, end);
    };
    Object.defineProperty(Range.prototype, "isEmpty", {
        get: function () {
            return this._start.isEqual(this._end);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Range.prototype, "isSingleLine", {
        get: function () {
            return this._start.line === this._end.line;
        },
        enumerable: true,
        configurable: true
    });
    Range.prototype.with = function (startOrChange, end) {
        if (end === void 0) { end = this.end; }
        if (startOrChange === null || end === null) {
            throw illegalArgument();
        }
        var start;
        if (!startOrChange) {
            start = this.start;
        }
        else if (Position.isPosition(startOrChange)) {
            start = startOrChange;
        }
        else {
            start = startOrChange.start || this.start;
            end = startOrChange.end || this.end;
        }
        if (start.isEqual(this._start) && end.isEqual(this.end)) {
            return this;
        }
        return new Range(start, end);
    };
    Range.prototype.toJSON = function () {
        return [this.start, this.end];
    };
    return Range;
}());
export { Range };
var Selection = /** @class */ (function (_super) {
    __extends(Selection, _super);
    function Selection(anchorLineOrAnchor, anchorColumnOrActive, activeLine, activeColumn) {
        var _this = this;
        var anchor;
        var active;
        if (typeof anchorLineOrAnchor === 'number' && typeof anchorColumnOrActive === 'number' && typeof activeLine === 'number' && typeof activeColumn === 'number') {
            anchor = new Position(anchorLineOrAnchor, anchorColumnOrActive);
            active = new Position(activeLine, activeColumn);
        }
        else if (anchorLineOrAnchor instanceof Position && anchorColumnOrActive instanceof Position) {
            anchor = anchorLineOrAnchor;
            active = anchorColumnOrActive;
        }
        if (!anchor || !active) {
            throw new Error('Invalid arguments');
        }
        _this = _super.call(this, anchor, active) || this;
        _this._anchor = anchor;
        _this._active = active;
        return _this;
    }
    Selection.isSelection = function (thing) {
        if (thing instanceof Selection) {
            return true;
        }
        if (!thing) {
            return false;
        }
        return Range.isRange(thing)
            && Position.isPosition(thing.anchor)
            && Position.isPosition(thing.active)
            && typeof thing.isReversed === 'boolean';
    };
    Object.defineProperty(Selection.prototype, "anchor", {
        get: function () {
            return this._anchor;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Selection.prototype, "active", {
        get: function () {
            return this._active;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Selection.prototype, "isReversed", {
        get: function () {
            return this._anchor === this._end;
        },
        enumerable: true,
        configurable: true
    });
    Selection.prototype.toJSON = function () {
        return {
            start: this.start,
            end: this.end,
            active: this.active,
            anchor: this.anchor
        };
    };
    return Selection;
}(Range));
export { Selection };
export var EndOfLine;
(function (EndOfLine) {
    EndOfLine[EndOfLine["LF"] = 1] = "LF";
    EndOfLine[EndOfLine["CRLF"] = 2] = "CRLF";
})(EndOfLine || (EndOfLine = {}));
var TextEdit = /** @class */ (function () {
    function TextEdit(range, newText) {
        this.range = range;
        this.newText = newText;
    }
    TextEdit.isTextEdit = function (thing) {
        if (thing instanceof TextEdit) {
            return true;
        }
        if (!thing) {
            return false;
        }
        return Range.isRange(thing)
            && typeof thing.newText === 'string';
    };
    TextEdit.replace = function (range, newText) {
        return new TextEdit(range, newText);
    };
    TextEdit.insert = function (position, newText) {
        return TextEdit.replace(new Range(position, position), newText);
    };
    TextEdit.delete = function (range) {
        return TextEdit.replace(range, '');
    };
    TextEdit.setEndOfLine = function (eol) {
        var ret = new TextEdit(undefined, undefined);
        ret.newEol = eol;
        return ret;
    };
    Object.defineProperty(TextEdit.prototype, "range", {
        get: function () {
            return this._range;
        },
        set: function (value) {
            if (value && !Range.isRange(value)) {
                throw illegalArgument('range');
            }
            this._range = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextEdit.prototype, "newText", {
        get: function () {
            return this._newText || '';
        },
        set: function (value) {
            if (value && typeof value !== 'string') {
                throw illegalArgument('newText');
            }
            this._newText = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextEdit.prototype, "newEol", {
        get: function () {
            return this._newEol;
        },
        set: function (value) {
            if (value && typeof value !== 'number') {
                throw illegalArgument('newEol');
            }
            this._newEol = value;
        },
        enumerable: true,
        configurable: true
    });
    TextEdit.prototype.toJSON = function () {
        return {
            range: this.range,
            newText: this.newText,
            newEol: this._newEol
        };
    };
    return TextEdit;
}());
export { TextEdit };
var WorkspaceEdit = /** @class */ (function () {
    function WorkspaceEdit() {
        this._edits = new Array();
    }
    WorkspaceEdit.prototype.renameFile = function (from, to, options) {
        this._edits.push({ _type: 1, from: from, to: to, options: options });
    };
    WorkspaceEdit.prototype.createFile = function (uri, options) {
        this._edits.push({ _type: 1, from: undefined, to: uri, options: options });
    };
    WorkspaceEdit.prototype.deleteFile = function (uri, options) {
        this._edits.push({ _type: 1, from: uri, to: undefined, options: options });
    };
    WorkspaceEdit.prototype.replace = function (uri, range, newText) {
        this._edits.push({ _type: 2, uri: uri, edit: new TextEdit(range, newText) });
    };
    WorkspaceEdit.prototype.insert = function (resource, position, newText) {
        this.replace(resource, new Range(position, position), newText);
    };
    WorkspaceEdit.prototype.delete = function (resource, range) {
        this.replace(resource, range, '');
    };
    WorkspaceEdit.prototype.has = function (uri) {
        for (var _i = 0, _a = this._edits; _i < _a.length; _i++) {
            var edit = _a[_i];
            if (edit._type === 2 && edit.uri.toString() === uri.toString()) {
                return true;
            }
        }
        return false;
    };
    WorkspaceEdit.prototype.set = function (uri, edits) {
        if (!edits) {
            // remove all text edits for `uri`
            for (var i = 0; i < this._edits.length; i++) {
                var element = this._edits[i];
                if (element._type === 2 && element.uri.toString() === uri.toString()) {
                    this._edits[i] = undefined;
                }
            }
            this._edits = coalesce(this._edits);
        }
        else {
            // append edit to the end
            for (var _i = 0, edits_1 = edits; _i < edits_1.length; _i++) {
                var edit = edits_1[_i];
                if (edit) {
                    this._edits.push({ _type: 2, uri: uri, edit: edit });
                }
            }
        }
    };
    WorkspaceEdit.prototype.get = function (uri) {
        var res = [];
        for (var _i = 0, _a = this._edits; _i < _a.length; _i++) {
            var candidate = _a[_i];
            if (candidate._type === 2 && candidate.uri.toString() === uri.toString()) {
                res.push(candidate.edit);
            }
        }
        if (res.length === 0) {
            return undefined;
        }
        return res;
    };
    WorkspaceEdit.prototype.entries = function () {
        var textEdits = new Map();
        for (var _i = 0, _a = this._edits; _i < _a.length; _i++) {
            var candidate = _a[_i];
            if (candidate._type === 2) {
                var textEdit = textEdits.get(candidate.uri.toString());
                if (!textEdit) {
                    textEdit = [candidate.uri, []];
                    textEdits.set(candidate.uri.toString(), textEdit);
                }
                textEdit[1].push(candidate.edit);
            }
        }
        return values(textEdits);
    };
    WorkspaceEdit.prototype._allEntries = function () {
        var res = [];
        for (var _i = 0, _a = this._edits; _i < _a.length; _i++) {
            var edit = _a[_i];
            if (edit._type === 1) {
                res.push([edit.from, edit.to, edit.options]);
            }
            else {
                res.push([edit.uri, [edit.edit]]);
            }
        }
        return res;
    };
    Object.defineProperty(WorkspaceEdit.prototype, "size", {
        get: function () {
            return this.entries().length;
        },
        enumerable: true,
        configurable: true
    });
    WorkspaceEdit.prototype.toJSON = function () {
        return this.entries();
    };
    return WorkspaceEdit;
}());
export { WorkspaceEdit };
var SnippetString = /** @class */ (function () {
    function SnippetString(value) {
        this._tabstop = 1;
        this.value = value || '';
    }
    SnippetString.isSnippetString = function (thing) {
        if (thing instanceof SnippetString) {
            return true;
        }
        if (!thing) {
            return false;
        }
        return typeof thing.value === 'string';
    };
    SnippetString._escape = function (value) {
        return value.replace(/\$|}|\\/g, '\\$&');
    };
    SnippetString.prototype.appendText = function (string) {
        this.value += SnippetString._escape(string);
        return this;
    };
    SnippetString.prototype.appendTabstop = function (number) {
        if (number === void 0) { number = this._tabstop++; }
        this.value += '$';
        this.value += number;
        return this;
    };
    SnippetString.prototype.appendPlaceholder = function (value, number) {
        if (number === void 0) { number = this._tabstop++; }
        if (typeof value === 'function') {
            var nested = new SnippetString();
            nested._tabstop = this._tabstop;
            value(nested);
            this._tabstop = nested._tabstop;
            value = nested.value;
        }
        else {
            value = SnippetString._escape(value);
        }
        this.value += '${';
        this.value += number;
        this.value += ':';
        this.value += value;
        this.value += '}';
        return this;
    };
    SnippetString.prototype.appendVariable = function (name, defaultValue) {
        if (typeof defaultValue === 'function') {
            var nested = new SnippetString();
            nested._tabstop = this._tabstop;
            defaultValue(nested);
            this._tabstop = nested._tabstop;
            defaultValue = nested.value;
        }
        else if (typeof defaultValue === 'string') {
            defaultValue = defaultValue.replace(/\$|}/g, '\\$&');
        }
        this.value += '${';
        this.value += name;
        if (defaultValue) {
            this.value += ':';
            this.value += defaultValue;
        }
        this.value += '}';
        return this;
    };
    return SnippetString;
}());
export { SnippetString };
export var DiagnosticTag;
(function (DiagnosticTag) {
    DiagnosticTag[DiagnosticTag["Unnecessary"] = 1] = "Unnecessary";
})(DiagnosticTag || (DiagnosticTag = {}));
export var DiagnosticSeverity;
(function (DiagnosticSeverity) {
    DiagnosticSeverity[DiagnosticSeverity["Hint"] = 3] = "Hint";
    DiagnosticSeverity[DiagnosticSeverity["Information"] = 2] = "Information";
    DiagnosticSeverity[DiagnosticSeverity["Warning"] = 1] = "Warning";
    DiagnosticSeverity[DiagnosticSeverity["Error"] = 0] = "Error";
})(DiagnosticSeverity || (DiagnosticSeverity = {}));
var Location = /** @class */ (function () {
    function Location(uri, rangeOrPosition) {
        this.uri = uri;
        if (!rangeOrPosition) {
            //that's OK
        }
        else if (rangeOrPosition instanceof Range) {
            this.range = rangeOrPosition;
        }
        else if (rangeOrPosition instanceof Position) {
            this.range = new Range(rangeOrPosition, rangeOrPosition);
        }
        else {
            throw new Error('Illegal argument');
        }
    }
    Location.isLocation = function (thing) {
        if (thing instanceof Location) {
            return true;
        }
        if (!thing) {
            return false;
        }
        return Range.isRange(thing.range)
            && URI.isUri(thing.uri);
    };
    Location.prototype.toJSON = function () {
        return {
            uri: this.uri,
            range: this.range
        };
    };
    return Location;
}());
export { Location };
var DiagnosticRelatedInformation = /** @class */ (function () {
    function DiagnosticRelatedInformation(location, message) {
        this.location = location;
        this.message = message;
    }
    DiagnosticRelatedInformation.is = function (thing) {
        if (!thing) {
            return false;
        }
        return typeof thing.message === 'string'
            && thing.location
            && Range.isRange(thing.location.range)
            && URI.isUri(thing.location.uri);
    };
    DiagnosticRelatedInformation.isEqual = function (a, b) {
        if (a === b) {
            return true;
        }
        if (!a || !b) {
            return false;
        }
        return a.message === b.message
            && a.location.range.isEqual(b.location.range)
            && a.location.uri.toString() === b.location.uri.toString();
    };
    return DiagnosticRelatedInformation;
}());
export { DiagnosticRelatedInformation };
var Diagnostic = /** @class */ (function () {
    function Diagnostic(range, message, severity) {
        if (severity === void 0) { severity = DiagnosticSeverity.Error; }
        this.range = range;
        this.message = message;
        this.severity = severity;
    }
    Diagnostic.prototype.toJSON = function () {
        return {
            severity: DiagnosticSeverity[this.severity],
            message: this.message,
            range: this.range,
            source: this.source,
            code: this.code,
        };
    };
    Diagnostic.isEqual = function (a, b) {
        if (a === b) {
            return true;
        }
        if (!a || !b) {
            return false;
        }
        return a.message === b.message
            && a.severity === b.severity
            && a.code === b.code
            && a.severity === b.severity
            && a.source === b.source
            && a.range.isEqual(b.range)
            && equals(a.tags, b.tags)
            && equals(a.relatedInformation, b.relatedInformation, DiagnosticRelatedInformation.isEqual);
    };
    return Diagnostic;
}());
export { Diagnostic };
var Hover = /** @class */ (function () {
    function Hover(contents, range) {
        if (!contents) {
            throw new Error('Illegal argument, contents must be defined');
        }
        if (Array.isArray(contents)) {
            this.contents = contents;
        }
        else if (isMarkdownString(contents)) {
            this.contents = [contents];
        }
        else {
            this.contents = [contents];
        }
        this.range = range;
    }
    return Hover;
}());
export { Hover };
export var DocumentHighlightKind;
(function (DocumentHighlightKind) {
    DocumentHighlightKind[DocumentHighlightKind["Text"] = 0] = "Text";
    DocumentHighlightKind[DocumentHighlightKind["Read"] = 1] = "Read";
    DocumentHighlightKind[DocumentHighlightKind["Write"] = 2] = "Write";
})(DocumentHighlightKind || (DocumentHighlightKind = {}));
var DocumentHighlight = /** @class */ (function () {
    function DocumentHighlight(range, kind) {
        if (kind === void 0) { kind = DocumentHighlightKind.Text; }
        this.range = range;
        this.kind = kind;
    }
    DocumentHighlight.prototype.toJSON = function () {
        return {
            range: this.range,
            kind: DocumentHighlightKind[this.kind]
        };
    };
    return DocumentHighlight;
}());
export { DocumentHighlight };
export var SymbolKind;
(function (SymbolKind) {
    SymbolKind[SymbolKind["File"] = 0] = "File";
    SymbolKind[SymbolKind["Module"] = 1] = "Module";
    SymbolKind[SymbolKind["Namespace"] = 2] = "Namespace";
    SymbolKind[SymbolKind["Package"] = 3] = "Package";
    SymbolKind[SymbolKind["Class"] = 4] = "Class";
    SymbolKind[SymbolKind["Method"] = 5] = "Method";
    SymbolKind[SymbolKind["Property"] = 6] = "Property";
    SymbolKind[SymbolKind["Field"] = 7] = "Field";
    SymbolKind[SymbolKind["Constructor"] = 8] = "Constructor";
    SymbolKind[SymbolKind["Enum"] = 9] = "Enum";
    SymbolKind[SymbolKind["Interface"] = 10] = "Interface";
    SymbolKind[SymbolKind["Function"] = 11] = "Function";
    SymbolKind[SymbolKind["Variable"] = 12] = "Variable";
    SymbolKind[SymbolKind["Constant"] = 13] = "Constant";
    SymbolKind[SymbolKind["String"] = 14] = "String";
    SymbolKind[SymbolKind["Number"] = 15] = "Number";
    SymbolKind[SymbolKind["Boolean"] = 16] = "Boolean";
    SymbolKind[SymbolKind["Array"] = 17] = "Array";
    SymbolKind[SymbolKind["Object"] = 18] = "Object";
    SymbolKind[SymbolKind["Key"] = 19] = "Key";
    SymbolKind[SymbolKind["Null"] = 20] = "Null";
    SymbolKind[SymbolKind["EnumMember"] = 21] = "EnumMember";
    SymbolKind[SymbolKind["Struct"] = 22] = "Struct";
    SymbolKind[SymbolKind["Event"] = 23] = "Event";
    SymbolKind[SymbolKind["Operator"] = 24] = "Operator";
    SymbolKind[SymbolKind["TypeParameter"] = 25] = "TypeParameter";
})(SymbolKind || (SymbolKind = {}));
var SymbolInformation = /** @class */ (function () {
    function SymbolInformation(name, kind, rangeOrContainer, locationOrUri, containerName) {
        this.name = name;
        this.kind = kind;
        this.containerName = containerName;
        if (typeof rangeOrContainer === 'string') {
            this.containerName = rangeOrContainer;
        }
        if (locationOrUri instanceof Location) {
            this.location = locationOrUri;
        }
        else if (rangeOrContainer instanceof Range) {
            this.location = new Location(locationOrUri, rangeOrContainer);
        }
    }
    SymbolInformation.prototype.toJSON = function () {
        return {
            name: this.name,
            kind: SymbolKind[this.kind],
            location: this.location,
            containerName: this.containerName
        };
    };
    return SymbolInformation;
}());
export { SymbolInformation };
var DocumentSymbol = /** @class */ (function () {
    function DocumentSymbol(name, detail, kind, range, selectionRange) {
        this.name = name;
        this.detail = detail;
        this.kind = kind;
        this.range = range;
        this.selectionRange = selectionRange;
        this.children = [];
        if (!this.range.contains(this.selectionRange)) {
            throw new Error('selectionRange must be contained in fullRange');
        }
    }
    return DocumentSymbol;
}());
export { DocumentSymbol };
export var CodeActionTrigger;
(function (CodeActionTrigger) {
    CodeActionTrigger[CodeActionTrigger["Automatic"] = 1] = "Automatic";
    CodeActionTrigger[CodeActionTrigger["Manual"] = 2] = "Manual";
})(CodeActionTrigger || (CodeActionTrigger = {}));
var CodeAction = /** @class */ (function () {
    function CodeAction(title, kind) {
        this.title = title;
        this.kind = kind;
    }
    return CodeAction;
}());
export { CodeAction };
var CodeActionKind = /** @class */ (function () {
    function CodeActionKind(value) {
        this.value = value;
    }
    CodeActionKind.prototype.append = function (parts) {
        return new CodeActionKind(this.value ? this.value + CodeActionKind.sep + parts : parts);
    };
    CodeActionKind.prototype.contains = function (other) {
        return this.value === other.value || startsWith(other.value, this.value + CodeActionKind.sep);
    };
    CodeActionKind.sep = '.';
    CodeActionKind.Empty = new CodeActionKind('');
    CodeActionKind.QuickFix = CodeActionKind.Empty.append('quickfix');
    CodeActionKind.Refactor = CodeActionKind.Empty.append('refactor');
    CodeActionKind.RefactorExtract = CodeActionKind.Refactor.append('extract');
    CodeActionKind.RefactorInline = CodeActionKind.Refactor.append('inline');
    CodeActionKind.RefactorRewrite = CodeActionKind.Refactor.append('rewrite');
    CodeActionKind.Source = CodeActionKind.Empty.append('source');
    CodeActionKind.SourceOrganizeImports = CodeActionKind.Source.append('organizeImports');
    return CodeActionKind;
}());
export { CodeActionKind };
var CodeLens = /** @class */ (function () {
    function CodeLens(range, command) {
        this.range = range;
        this.command = command;
    }
    Object.defineProperty(CodeLens.prototype, "isResolved", {
        get: function () {
            return !!this.command;
        },
        enumerable: true,
        configurable: true
    });
    return CodeLens;
}());
export { CodeLens };
var MarkdownString = /** @class */ (function () {
    function MarkdownString(value) {
        this.value = value || '';
    }
    MarkdownString.prototype.appendText = function (value) {
        // escape markdown syntax tokens: http://daringfireball.net/projects/markdown/syntax#backslash
        this.value += value.replace(/[\\`*_{}[\]()#+\-.!]/g, '\\$&');
        return this;
    };
    MarkdownString.prototype.appendMarkdown = function (value) {
        this.value += value;
        return this;
    };
    MarkdownString.prototype.appendCodeblock = function (code, language) {
        if (language === void 0) { language = ''; }
        this.value += '\n```';
        this.value += language;
        this.value += '\n';
        this.value += code;
        this.value += '\n```\n';
        return this;
    };
    return MarkdownString;
}());
export { MarkdownString };
var ParameterInformation = /** @class */ (function () {
    function ParameterInformation(label, documentation) {
        this.label = label;
        this.documentation = documentation;
    }
    return ParameterInformation;
}());
export { ParameterInformation };
var SignatureInformation = /** @class */ (function () {
    function SignatureInformation(label, documentation) {
        this.label = label;
        this.documentation = documentation;
        this.parameters = [];
    }
    return SignatureInformation;
}());
export { SignatureInformation };
var SignatureHelp = /** @class */ (function () {
    function SignatureHelp() {
        this.signatures = [];
    }
    return SignatureHelp;
}());
export { SignatureHelp };
export var SignatureHelpTriggerReason;
(function (SignatureHelpTriggerReason) {
    SignatureHelpTriggerReason[SignatureHelpTriggerReason["Invoke"] = 1] = "Invoke";
    SignatureHelpTriggerReason[SignatureHelpTriggerReason["TriggerCharacter"] = 2] = "TriggerCharacter";
    SignatureHelpTriggerReason[SignatureHelpTriggerReason["Retrigger"] = 3] = "Retrigger";
})(SignatureHelpTriggerReason || (SignatureHelpTriggerReason = {}));
export var CompletionTriggerKind;
(function (CompletionTriggerKind) {
    CompletionTriggerKind[CompletionTriggerKind["Invoke"] = 0] = "Invoke";
    CompletionTriggerKind[CompletionTriggerKind["TriggerCharacter"] = 1] = "TriggerCharacter";
    CompletionTriggerKind[CompletionTriggerKind["TriggerForIncompleteCompletions"] = 2] = "TriggerForIncompleteCompletions";
})(CompletionTriggerKind || (CompletionTriggerKind = {}));
export var CompletionItemKind;
(function (CompletionItemKind) {
    CompletionItemKind[CompletionItemKind["Text"] = 0] = "Text";
    CompletionItemKind[CompletionItemKind["Method"] = 1] = "Method";
    CompletionItemKind[CompletionItemKind["Function"] = 2] = "Function";
    CompletionItemKind[CompletionItemKind["Constructor"] = 3] = "Constructor";
    CompletionItemKind[CompletionItemKind["Field"] = 4] = "Field";
    CompletionItemKind[CompletionItemKind["Variable"] = 5] = "Variable";
    CompletionItemKind[CompletionItemKind["Class"] = 6] = "Class";
    CompletionItemKind[CompletionItemKind["Interface"] = 7] = "Interface";
    CompletionItemKind[CompletionItemKind["Module"] = 8] = "Module";
    CompletionItemKind[CompletionItemKind["Property"] = 9] = "Property";
    CompletionItemKind[CompletionItemKind["Unit"] = 10] = "Unit";
    CompletionItemKind[CompletionItemKind["Value"] = 11] = "Value";
    CompletionItemKind[CompletionItemKind["Enum"] = 12] = "Enum";
    CompletionItemKind[CompletionItemKind["Keyword"] = 13] = "Keyword";
    CompletionItemKind[CompletionItemKind["Snippet"] = 14] = "Snippet";
    CompletionItemKind[CompletionItemKind["Color"] = 15] = "Color";
    CompletionItemKind[CompletionItemKind["File"] = 16] = "File";
    CompletionItemKind[CompletionItemKind["Reference"] = 17] = "Reference";
    CompletionItemKind[CompletionItemKind["Folder"] = 18] = "Folder";
    CompletionItemKind[CompletionItemKind["EnumMember"] = 19] = "EnumMember";
    CompletionItemKind[CompletionItemKind["Constant"] = 20] = "Constant";
    CompletionItemKind[CompletionItemKind["Struct"] = 21] = "Struct";
    CompletionItemKind[CompletionItemKind["Event"] = 22] = "Event";
    CompletionItemKind[CompletionItemKind["Operator"] = 23] = "Operator";
    CompletionItemKind[CompletionItemKind["TypeParameter"] = 24] = "TypeParameter";
})(CompletionItemKind || (CompletionItemKind = {}));
var CompletionItem = /** @class */ (function () {
    function CompletionItem(label, kind) {
        this.label = label;
        this.kind = kind;
    }
    CompletionItem.prototype.toJSON = function () {
        return {
            label: this.label,
            kind: CompletionItemKind[this.kind],
            detail: this.detail,
            documentation: this.documentation,
            sortText: this.sortText,
            filterText: this.filterText,
            preselect: this.preselect,
            insertText: this.insertText,
            textEdit: this.textEdit
        };
    };
    return CompletionItem;
}());
export { CompletionItem };
var CompletionList = /** @class */ (function () {
    function CompletionList(items, isIncomplete) {
        if (items === void 0) { items = []; }
        if (isIncomplete === void 0) { isIncomplete = false; }
        this.items = items;
        this.isIncomplete = isIncomplete;
    }
    return CompletionList;
}());
export { CompletionList };
export var ViewColumn;
(function (ViewColumn) {
    ViewColumn[ViewColumn["Active"] = -1] = "Active";
    ViewColumn[ViewColumn["Beside"] = -2] = "Beside";
    ViewColumn[ViewColumn["One"] = 1] = "One";
    ViewColumn[ViewColumn["Two"] = 2] = "Two";
    ViewColumn[ViewColumn["Three"] = 3] = "Three";
    ViewColumn[ViewColumn["Four"] = 4] = "Four";
    ViewColumn[ViewColumn["Five"] = 5] = "Five";
    ViewColumn[ViewColumn["Six"] = 6] = "Six";
    ViewColumn[ViewColumn["Seven"] = 7] = "Seven";
    ViewColumn[ViewColumn["Eight"] = 8] = "Eight";
    ViewColumn[ViewColumn["Nine"] = 9] = "Nine";
})(ViewColumn || (ViewColumn = {}));
export var StatusBarAlignment;
(function (StatusBarAlignment) {
    StatusBarAlignment[StatusBarAlignment["Left"] = 1] = "Left";
    StatusBarAlignment[StatusBarAlignment["Right"] = 2] = "Right";
})(StatusBarAlignment || (StatusBarAlignment = {}));
export var TextEditorLineNumbersStyle;
(function (TextEditorLineNumbersStyle) {
    TextEditorLineNumbersStyle[TextEditorLineNumbersStyle["Off"] = 0] = "Off";
    TextEditorLineNumbersStyle[TextEditorLineNumbersStyle["On"] = 1] = "On";
    TextEditorLineNumbersStyle[TextEditorLineNumbersStyle["Relative"] = 2] = "Relative";
})(TextEditorLineNumbersStyle || (TextEditorLineNumbersStyle = {}));
export var TextDocumentSaveReason;
(function (TextDocumentSaveReason) {
    TextDocumentSaveReason[TextDocumentSaveReason["Manual"] = 1] = "Manual";
    TextDocumentSaveReason[TextDocumentSaveReason["AfterDelay"] = 2] = "AfterDelay";
    TextDocumentSaveReason[TextDocumentSaveReason["FocusOut"] = 3] = "FocusOut";
})(TextDocumentSaveReason || (TextDocumentSaveReason = {}));
export var TextEditorRevealType;
(function (TextEditorRevealType) {
    TextEditorRevealType[TextEditorRevealType["Default"] = 0] = "Default";
    TextEditorRevealType[TextEditorRevealType["InCenter"] = 1] = "InCenter";
    TextEditorRevealType[TextEditorRevealType["InCenterIfOutsideViewport"] = 2] = "InCenterIfOutsideViewport";
    TextEditorRevealType[TextEditorRevealType["AtTop"] = 3] = "AtTop";
})(TextEditorRevealType || (TextEditorRevealType = {}));
export var TextEditorSelectionChangeKind;
(function (TextEditorSelectionChangeKind) {
    TextEditorSelectionChangeKind[TextEditorSelectionChangeKind["Keyboard"] = 1] = "Keyboard";
    TextEditorSelectionChangeKind[TextEditorSelectionChangeKind["Mouse"] = 2] = "Mouse";
    TextEditorSelectionChangeKind[TextEditorSelectionChangeKind["Command"] = 3] = "Command";
})(TextEditorSelectionChangeKind || (TextEditorSelectionChangeKind = {}));
/**
 * These values match very carefully the values of `TrackedRangeStickiness`
 */
export var DecorationRangeBehavior;
(function (DecorationRangeBehavior) {
    /**
     * TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges
     */
    DecorationRangeBehavior[DecorationRangeBehavior["OpenOpen"] = 0] = "OpenOpen";
    /**
     * TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges
     */
    DecorationRangeBehavior[DecorationRangeBehavior["ClosedClosed"] = 1] = "ClosedClosed";
    /**
     * TrackedRangeStickiness.GrowsOnlyWhenTypingBefore
     */
    DecorationRangeBehavior[DecorationRangeBehavior["OpenClosed"] = 2] = "OpenClosed";
    /**
     * TrackedRangeStickiness.GrowsOnlyWhenTypingAfter
     */
    DecorationRangeBehavior[DecorationRangeBehavior["ClosedOpen"] = 3] = "ClosedOpen";
})(DecorationRangeBehavior || (DecorationRangeBehavior = {}));
(function (TextEditorSelectionChangeKind) {
    function fromValue(s) {
        switch (s) {
            case 'keyboard': return TextEditorSelectionChangeKind.Keyboard;
            case 'mouse': return TextEditorSelectionChangeKind.Mouse;
            case 'api': return TextEditorSelectionChangeKind.Command;
        }
        return undefined;
    }
    TextEditorSelectionChangeKind.fromValue = fromValue;
})(TextEditorSelectionChangeKind || (TextEditorSelectionChangeKind = {}));
var DocumentLink = /** @class */ (function () {
    function DocumentLink(range, target) {
        if (target && !(target instanceof URI)) {
            throw illegalArgument('target');
        }
        if (!Range.isRange(range) || range.isEmpty) {
            throw illegalArgument('range');
        }
        this.range = range;
        this.target = target;
    }
    return DocumentLink;
}());
export { DocumentLink };
var Color = /** @class */ (function () {
    function Color(red, green, blue, alpha) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
    }
    return Color;
}());
export { Color };
var ColorInformation = /** @class */ (function () {
    function ColorInformation(range, color) {
        if (color && !(color instanceof Color)) {
            throw illegalArgument('color');
        }
        if (!Range.isRange(range) || range.isEmpty) {
            throw illegalArgument('range');
        }
        this.range = range;
        this.color = color;
    }
    return ColorInformation;
}());
export { ColorInformation };
var ColorPresentation = /** @class */ (function () {
    function ColorPresentation(label) {
        if (!label || typeof label !== 'string') {
            throw illegalArgument('label');
        }
        this.label = label;
    }
    return ColorPresentation;
}());
export { ColorPresentation };
export var ColorFormat;
(function (ColorFormat) {
    ColorFormat[ColorFormat["RGB"] = 0] = "RGB";
    ColorFormat[ColorFormat["HEX"] = 1] = "HEX";
    ColorFormat[ColorFormat["HSL"] = 2] = "HSL";
})(ColorFormat || (ColorFormat = {}));
export var SourceControlInputBoxValidationType;
(function (SourceControlInputBoxValidationType) {
    SourceControlInputBoxValidationType[SourceControlInputBoxValidationType["Error"] = 0] = "Error";
    SourceControlInputBoxValidationType[SourceControlInputBoxValidationType["Warning"] = 1] = "Warning";
    SourceControlInputBoxValidationType[SourceControlInputBoxValidationType["Information"] = 2] = "Information";
})(SourceControlInputBoxValidationType || (SourceControlInputBoxValidationType = {}));
export var TaskRevealKind;
(function (TaskRevealKind) {
    TaskRevealKind[TaskRevealKind["Always"] = 1] = "Always";
    TaskRevealKind[TaskRevealKind["Silent"] = 2] = "Silent";
    TaskRevealKind[TaskRevealKind["Never"] = 3] = "Never";
})(TaskRevealKind || (TaskRevealKind = {}));
export var TaskPanelKind;
(function (TaskPanelKind) {
    TaskPanelKind[TaskPanelKind["Shared"] = 1] = "Shared";
    TaskPanelKind[TaskPanelKind["Dedicated"] = 2] = "Dedicated";
    TaskPanelKind[TaskPanelKind["New"] = 3] = "New";
})(TaskPanelKind || (TaskPanelKind = {}));
var TaskGroup = /** @class */ (function () {
    function TaskGroup(id, _label) {
        if (typeof id !== 'string') {
            throw illegalArgument('name');
        }
        if (typeof _label !== 'string') {
            throw illegalArgument('name');
        }
        this._id = id;
    }
    TaskGroup.from = function (value) {
        switch (value) {
            case 'clean':
                return TaskGroup.Clean;
            case 'build':
                return TaskGroup.Build;
            case 'rebuild':
                return TaskGroup.Rebuild;
            case 'test':
                return TaskGroup.Test;
            default:
                return undefined;
        }
    };
    Object.defineProperty(TaskGroup.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    TaskGroup.Clean = new TaskGroup('clean', 'Clean');
    TaskGroup.Build = new TaskGroup('build', 'Build');
    TaskGroup.Rebuild = new TaskGroup('rebuild', 'Rebuild');
    TaskGroup.Test = new TaskGroup('test', 'Test');
    return TaskGroup;
}());
export { TaskGroup };
var ProcessExecution = /** @class */ (function () {
    function ProcessExecution(process, varg1, varg2) {
        if (typeof process !== 'string') {
            throw illegalArgument('process');
        }
        this._process = process;
        if (varg1 !== void 0) {
            if (Array.isArray(varg1)) {
                this._args = varg1;
                this._options = varg2;
            }
            else {
                this._options = varg1;
            }
        }
        if (this._args === void 0) {
            this._args = [];
        }
    }
    Object.defineProperty(ProcessExecution.prototype, "process", {
        get: function () {
            return this._process;
        },
        set: function (value) {
            if (typeof value !== 'string') {
                throw illegalArgument('process');
            }
            this._process = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProcessExecution.prototype, "args", {
        get: function () {
            return this._args;
        },
        set: function (value) {
            if (!Array.isArray(value)) {
                value = [];
            }
            this._args = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProcessExecution.prototype, "options", {
        get: function () {
            return this._options;
        },
        set: function (value) {
            this._options = value;
        },
        enumerable: true,
        configurable: true
    });
    ProcessExecution.prototype.computeId = function () {
        var hash = crypto.createHash('md5');
        hash.update('process');
        if (this._process !== void 0) {
            hash.update(this._process);
        }
        if (this._args && this._args.length > 0) {
            for (var _i = 0, _a = this._args; _i < _a.length; _i++) {
                var arg = _a[_i];
                hash.update(arg);
            }
        }
        return hash.digest('hex');
    };
    return ProcessExecution;
}());
export { ProcessExecution };
var ShellExecution = /** @class */ (function () {
    function ShellExecution(arg0, arg1, arg2) {
        if (Array.isArray(arg1)) {
            if (!arg0) {
                throw illegalArgument('command can\'t be undefined or null');
            }
            if (typeof arg0 !== 'string' && typeof arg0.value !== 'string') {
                throw illegalArgument('command');
            }
            this._command = arg0;
            this._args = arg1;
            this._options = arg2;
        }
        else {
            if (typeof arg0 !== 'string') {
                throw illegalArgument('commandLine');
            }
            this._commandLine = arg0;
            this._options = arg1;
        }
    }
    Object.defineProperty(ShellExecution.prototype, "commandLine", {
        get: function () {
            return this._commandLine;
        },
        set: function (value) {
            if (typeof value !== 'string') {
                throw illegalArgument('commandLine');
            }
            this._commandLine = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShellExecution.prototype, "command", {
        get: function () {
            return this._command;
        },
        set: function (value) {
            if (typeof value !== 'string' && typeof value.value !== 'string') {
                throw illegalArgument('command');
            }
            this._command = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShellExecution.prototype, "args", {
        get: function () {
            return this._args;
        },
        set: function (value) {
            this._args = value || [];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShellExecution.prototype, "options", {
        get: function () {
            return this._options;
        },
        set: function (value) {
            this._options = value;
        },
        enumerable: true,
        configurable: true
    });
    ShellExecution.prototype.computeId = function () {
        var hash = crypto.createHash('md5');
        hash.update('shell');
        if (this._commandLine !== void 0) {
            hash.update(this._commandLine);
        }
        if (this._command !== void 0) {
            hash.update(typeof this._command === 'string' ? this._command : this._command.value);
        }
        if (this._args && this._args.length > 0) {
            for (var _i = 0, _a = this._args; _i < _a.length; _i++) {
                var arg = _a[_i];
                hash.update(typeof arg === 'string' ? arg : arg.value);
            }
        }
        return hash.digest('hex');
    };
    return ShellExecution;
}());
export { ShellExecution };
export var ShellQuoting;
(function (ShellQuoting) {
    ShellQuoting[ShellQuoting["Escape"] = 1] = "Escape";
    ShellQuoting[ShellQuoting["Strong"] = 2] = "Strong";
    ShellQuoting[ShellQuoting["Weak"] = 3] = "Weak";
})(ShellQuoting || (ShellQuoting = {}));
export var TaskScope;
(function (TaskScope) {
    TaskScope[TaskScope["Global"] = 1] = "Global";
    TaskScope[TaskScope["Workspace"] = 2] = "Workspace";
})(TaskScope || (TaskScope = {}));
var Task = /** @class */ (function () {
    function Task(definition, arg2, arg3, arg4, arg5, arg6) {
        this.definition = definition;
        var problemMatchers;
        if (typeof arg2 === 'string') {
            this.name = arg2;
            this.source = arg3;
            this.execution = arg4;
            problemMatchers = arg5;
        }
        else if (arg2 === TaskScope.Global || arg2 === TaskScope.Workspace) {
            this.target = arg2;
            this.name = arg3;
            this.source = arg4;
            this.execution = arg5;
            problemMatchers = arg6;
        }
        else {
            this.target = arg2;
            this.name = arg3;
            this.source = arg4;
            this.execution = arg5;
            problemMatchers = arg6;
        }
        if (typeof problemMatchers === 'string') {
            this._problemMatchers = [problemMatchers];
            this._hasDefinedMatchers = true;
        }
        else if (Array.isArray(problemMatchers)) {
            this._problemMatchers = problemMatchers;
            this._hasDefinedMatchers = true;
        }
        else {
            this._problemMatchers = [];
            this._hasDefinedMatchers = false;
        }
        this._isBackground = false;
    }
    Object.defineProperty(Task.prototype, "_id", {
        get: function () {
            return this.__id;
        },
        set: function (value) {
            this.__id = value;
        },
        enumerable: true,
        configurable: true
    });
    Task.prototype.clear = function () {
        if (this.__id === void 0) {
            return;
        }
        this.__id = undefined;
        this._scope = undefined;
        this._definition = undefined;
        if (this._execution instanceof ProcessExecution) {
            this._definition = {
                type: 'process',
                id: this._execution.computeId()
            };
        }
        else if (this._execution instanceof ShellExecution) {
            this._definition = {
                type: 'shell',
                id: this._execution.computeId()
            };
        }
    };
    Object.defineProperty(Task.prototype, "definition", {
        get: function () {
            return this._definition;
        },
        set: function (value) {
            if (value === void 0 || value === null) {
                throw illegalArgument('Kind can\'t be undefined or null');
            }
            this.clear();
            this._definition = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Task.prototype, "scope", {
        get: function () {
            return this._scope;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Task.prototype, "target", {
        set: function (value) {
            this.clear();
            this._scope = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Task.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (value) {
            if (typeof value !== 'string') {
                throw illegalArgument('name');
            }
            this.clear();
            this._name = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Task.prototype, "execution", {
        get: function () {
            return this._execution;
        },
        set: function (value) {
            if (value === null) {
                value = undefined;
            }
            this.clear();
            this._execution = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Task.prototype, "problemMatchers", {
        get: function () {
            return this._problemMatchers;
        },
        set: function (value) {
            if (!Array.isArray(value)) {
                this._problemMatchers = [];
                this._hasDefinedMatchers = false;
                return;
            }
            this.clear();
            this._problemMatchers = value;
            this._hasDefinedMatchers = true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Task.prototype, "hasDefinedMatchers", {
        get: function () {
            return this._hasDefinedMatchers;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Task.prototype, "isBackground", {
        get: function () {
            return this._isBackground;
        },
        set: function (value) {
            if (value !== true && value !== false) {
                value = false;
            }
            this.clear();
            this._isBackground = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Task.prototype, "source", {
        get: function () {
            return this._source;
        },
        set: function (value) {
            if (typeof value !== 'string' || value.length === 0) {
                throw illegalArgument('source must be a string of length > 0');
            }
            this.clear();
            this._source = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Task.prototype, "group", {
        get: function () {
            return this._group;
        },
        set: function (value) {
            if (value === void 0 || value === null) {
                this._group = undefined;
                return;
            }
            this.clear();
            this._group = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Task.prototype, "presentationOptions", {
        get: function () {
            return this._presentationOptions;
        },
        set: function (value) {
            if (value === null) {
                value = undefined;
            }
            this.clear();
            this._presentationOptions = value;
        },
        enumerable: true,
        configurable: true
    });
    return Task;
}());
export { Task };
export var ProgressLocation;
(function (ProgressLocation) {
    ProgressLocation[ProgressLocation["SourceControl"] = 1] = "SourceControl";
    ProgressLocation[ProgressLocation["Window"] = 10] = "Window";
    ProgressLocation[ProgressLocation["Notification"] = 15] = "Notification";
})(ProgressLocation || (ProgressLocation = {}));
var TreeItem = /** @class */ (function () {
    function TreeItem(arg1, collapsibleState) {
        if (collapsibleState === void 0) { collapsibleState = TreeItemCollapsibleState.None; }
        this.collapsibleState = collapsibleState;
        if (arg1 instanceof URI) {
            this.resourceUri = arg1;
        }
        else {
            this.label = arg1;
        }
    }
    return TreeItem;
}());
export { TreeItem };
export var TreeItemCollapsibleState;
(function (TreeItemCollapsibleState) {
    TreeItemCollapsibleState[TreeItemCollapsibleState["None"] = 0] = "None";
    TreeItemCollapsibleState[TreeItemCollapsibleState["Collapsed"] = 1] = "Collapsed";
    TreeItemCollapsibleState[TreeItemCollapsibleState["Expanded"] = 2] = "Expanded";
})(TreeItemCollapsibleState || (TreeItemCollapsibleState = {}));
var ThemeIcon = /** @class */ (function () {
    function ThemeIcon(id) {
        this.id = id;
    }
    ThemeIcon.File = new ThemeIcon('file');
    ThemeIcon.Folder = new ThemeIcon('folder');
    return ThemeIcon;
}());
export { ThemeIcon };
var ThemeColor = /** @class */ (function () {
    function ThemeColor(id) {
        this.id = id;
    }
    return ThemeColor;
}());
export { ThemeColor };
export var ConfigurationTarget;
(function (ConfigurationTarget) {
    ConfigurationTarget[ConfigurationTarget["Global"] = 1] = "Global";
    ConfigurationTarget[ConfigurationTarget["Workspace"] = 2] = "Workspace";
    ConfigurationTarget[ConfigurationTarget["WorkspaceFolder"] = 3] = "WorkspaceFolder";
})(ConfigurationTarget || (ConfigurationTarget = {}));
var RelativePattern = /** @class */ (function () {
    function RelativePattern(base, pattern) {
        if (typeof base !== 'string') {
            if (!base || !URI.isUri(base.uri)) {
                throw illegalArgument('base');
            }
        }
        if (typeof pattern !== 'string') {
            throw illegalArgument('pattern');
        }
        if (typeof base === 'string') {
            this.base = base;
        }
        else {
            this.baseFolder = base.uri;
            this.base = base.uri.fsPath;
        }
        this.pattern = pattern;
    }
    RelativePattern.prototype.pathToRelative = function (from, to) {
        return relative(from, to);
    };
    return RelativePattern;
}());
export { RelativePattern };
var Breakpoint = /** @class */ (function () {
    function Breakpoint(enabled, condition, hitCondition, logMessage) {
        this.enabled = typeof enabled === 'boolean' ? enabled : true;
        if (typeof condition === 'string') {
            this.condition = condition;
        }
        if (typeof hitCondition === 'string') {
            this.hitCondition = hitCondition;
        }
        if (typeof logMessage === 'string') {
            this.logMessage = logMessage;
        }
    }
    return Breakpoint;
}());
export { Breakpoint };
var SourceBreakpoint = /** @class */ (function (_super) {
    __extends(SourceBreakpoint, _super);
    function SourceBreakpoint(location, enabled, condition, hitCondition, logMessage) {
        var _this = _super.call(this, enabled, condition, hitCondition, logMessage) || this;
        if (location === null) {
            throw illegalArgument('location');
        }
        _this.location = location;
        return _this;
    }
    return SourceBreakpoint;
}(Breakpoint));
export { SourceBreakpoint };
var FunctionBreakpoint = /** @class */ (function (_super) {
    __extends(FunctionBreakpoint, _super);
    function FunctionBreakpoint(functionName, enabled, condition, hitCondition, logMessage) {
        var _this = _super.call(this, enabled, condition, hitCondition, logMessage) || this;
        if (!functionName) {
            throw illegalArgument('functionName');
        }
        _this.functionName = functionName;
        return _this;
    }
    return FunctionBreakpoint;
}(Breakpoint));
export { FunctionBreakpoint };
var DebugAdapterExecutable = /** @class */ (function () {
    function DebugAdapterExecutable(command, args, env, cwd) {
        this.type = 'executable';
        this.command = command;
        this.args = args;
        this.env = env;
        this.cwd = cwd;
    }
    return DebugAdapterExecutable;
}());
export { DebugAdapterExecutable };
var DebugAdapterServer = /** @class */ (function () {
    function DebugAdapterServer(port, host) {
        this.type = 'server';
        this.port = port;
        this.host = host;
    }
    return DebugAdapterServer;
}());
export { DebugAdapterServer };
var DebugAdapterImplementation = /** @class */ (function () {
    function DebugAdapterImplementation(transport) {
        this.type = 'implementation';
        this.implementation = transport;
    }
    return DebugAdapterImplementation;
}());
export { DebugAdapterImplementation };
export var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["Trace"] = 1] = "Trace";
    LogLevel[LogLevel["Debug"] = 2] = "Debug";
    LogLevel[LogLevel["Info"] = 3] = "Info";
    LogLevel[LogLevel["Warning"] = 4] = "Warning";
    LogLevel[LogLevel["Error"] = 5] = "Error";
    LogLevel[LogLevel["Critical"] = 6] = "Critical";
    LogLevel[LogLevel["Off"] = 7] = "Off";
})(LogLevel || (LogLevel = {}));
//#region file api
export var FileChangeType;
(function (FileChangeType) {
    FileChangeType[FileChangeType["Changed"] = 1] = "Changed";
    FileChangeType[FileChangeType["Created"] = 2] = "Created";
    FileChangeType[FileChangeType["Deleted"] = 3] = "Deleted";
})(FileChangeType || (FileChangeType = {}));
var FileSystemError = /** @class */ (function (_super) {
    __extends(FileSystemError, _super);
    function FileSystemError(uriOrMessage, code, terminator) {
        var _this = _super.call(this, URI.isUri(uriOrMessage) ? uriOrMessage.toString(true) : uriOrMessage) || this;
        _this.name = code ? code + " (FileSystemError)" : "FileSystemError";
        // workaround when extending builtin objects and when compiling to ES5, see:
        // https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
        if (typeof Object.setPrototypeOf === 'function') {
            Object.setPrototypeOf(_this, FileSystemError.prototype);
        }
        if (typeof Error.captureStackTrace === 'function' && typeof terminator === 'function') {
            // nice stack traces
            Error.captureStackTrace(_this, terminator);
        }
        return _this;
    }
    FileSystemError.FileExists = function (messageOrUri) {
        return new FileSystemError(messageOrUri, 'EntryExists', FileSystemError.FileExists);
    };
    FileSystemError.FileNotFound = function (messageOrUri) {
        return new FileSystemError(messageOrUri, 'EntryNotFound', FileSystemError.FileNotFound);
    };
    FileSystemError.FileNotADirectory = function (messageOrUri) {
        return new FileSystemError(messageOrUri, 'EntryNotADirectory', FileSystemError.FileNotADirectory);
    };
    FileSystemError.FileIsADirectory = function (messageOrUri) {
        return new FileSystemError(messageOrUri, 'EntryIsADirectory', FileSystemError.FileIsADirectory);
    };
    FileSystemError.NoPermissions = function (messageOrUri) {
        return new FileSystemError(messageOrUri, 'NoPermissions', FileSystemError.NoPermissions);
    };
    FileSystemError.Unavailable = function (messageOrUri) {
        return new FileSystemError(messageOrUri, 'Unavailable', FileSystemError.Unavailable);
    };
    return FileSystemError;
}(Error));
export { FileSystemError };
//#endregion
//#region folding api
var FoldingRange = /** @class */ (function () {
    function FoldingRange(start, end, kind) {
        this.start = start;
        this.end = end;
        this.kind = kind;
    }
    return FoldingRange;
}());
export { FoldingRange };
export var FoldingRangeKind;
(function (FoldingRangeKind) {
    FoldingRangeKind[FoldingRangeKind["Comment"] = 1] = "Comment";
    FoldingRangeKind[FoldingRangeKind["Imports"] = 2] = "Imports";
    FoldingRangeKind[FoldingRangeKind["Region"] = 3] = "Region";
})(FoldingRangeKind || (FoldingRangeKind = {}));
//#endregion
export var CommentThreadCollapsibleState;
(function (CommentThreadCollapsibleState) {
    /**
     * Determines an item is collapsed
     */
    CommentThreadCollapsibleState[CommentThreadCollapsibleState["Collapsed"] = 0] = "Collapsed";
    /**
     * Determines an item is expanded
     */
    CommentThreadCollapsibleState[CommentThreadCollapsibleState["Expanded"] = 1] = "Expanded";
})(CommentThreadCollapsibleState || (CommentThreadCollapsibleState = {}));
var QuickInputButtons = /** @class */ (function () {
    function QuickInputButtons() {
    }
    QuickInputButtons.Back = { iconPath: 'back.svg' };
    return QuickInputButtons;
}());
export { QuickInputButtons };
