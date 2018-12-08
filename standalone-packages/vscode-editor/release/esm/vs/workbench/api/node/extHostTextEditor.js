/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { ok } from '../../../base/common/assert.js';
import { illegalArgument, readonly } from '../../../base/common/errors.js';
import { IdGenerator } from '../../../base/common/idGenerator.js';
import * as TypeConverters from './extHostTypeConverters.js';
import { EndOfLine, Position, Range, Selection, TextEditorRevealType } from './extHostTypes.js';
var TextEditorDecorationType = /** @class */ (function () {
    function TextEditorDecorationType(proxy, options) {
        this.key = TextEditorDecorationType._Keys.nextId();
        this._proxy = proxy;
        this._proxy.$registerTextEditorDecorationType(this.key, TypeConverters.DecorationRenderOptions.from(options));
    }
    TextEditorDecorationType.prototype.dispose = function () {
        this._proxy.$removeTextEditorDecorationType(this.key);
    };
    TextEditorDecorationType._Keys = new IdGenerator('TextEditorDecorationType');
    return TextEditorDecorationType;
}());
export { TextEditorDecorationType };
var TextEditorEdit = /** @class */ (function () {
    function TextEditorEdit(document, options) {
        this._document = document;
        this._documentVersionId = document.version;
        this._collectedEdits = [];
        this._setEndOfLine = 0;
        this._undoStopBefore = options.undoStopBefore;
        this._undoStopAfter = options.undoStopAfter;
    }
    TextEditorEdit.prototype.finalize = function () {
        return {
            documentVersionId: this._documentVersionId,
            edits: this._collectedEdits,
            setEndOfLine: this._setEndOfLine,
            undoStopBefore: this._undoStopBefore,
            undoStopAfter: this._undoStopAfter
        };
    };
    TextEditorEdit.prototype.replace = function (location, value) {
        var range = null;
        if (location instanceof Position) {
            range = new Range(location, location);
        }
        else if (location instanceof Range) {
            range = location;
        }
        else {
            throw new Error('Unrecognized location');
        }
        this._pushEdit(range, value, false);
    };
    TextEditorEdit.prototype.insert = function (location, value) {
        this._pushEdit(new Range(location, location), value, true);
    };
    TextEditorEdit.prototype.delete = function (location) {
        var range = null;
        if (location instanceof Range) {
            range = location;
        }
        else {
            throw new Error('Unrecognized location');
        }
        this._pushEdit(range, null, true);
    };
    TextEditorEdit.prototype._pushEdit = function (range, text, forceMoveMarkers) {
        var validRange = this._document.validateRange(range);
        this._collectedEdits.push({
            range: validRange,
            text: text,
            forceMoveMarkers: forceMoveMarkers
        });
    };
    TextEditorEdit.prototype.setEndOfLine = function (endOfLine) {
        if (endOfLine !== EndOfLine.LF && endOfLine !== EndOfLine.CRLF) {
            throw illegalArgument('endOfLine');
        }
        this._setEndOfLine = endOfLine;
    };
    return TextEditorEdit;
}());
export { TextEditorEdit };
function deprecated(name, message) {
    if (message === void 0) { message = 'Refer to the documentation for further details.'; }
    return function (target, key, descriptor) {
        var originalMethod = descriptor.value;
        descriptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            console.warn("[Deprecation Warning] method '" + name + "' is deprecated and should no longer be used. " + message);
            return originalMethod.apply(this, args);
        };
        return descriptor;
    };
}
var ExtHostTextEditorOptions = /** @class */ (function () {
    function ExtHostTextEditorOptions(proxy, id, source) {
        this._proxy = proxy;
        this._id = id;
        this._accept(source);
    }
    ExtHostTextEditorOptions.prototype._accept = function (source) {
        this._tabSize = source.tabSize;
        this._insertSpaces = source.insertSpaces;
        this._cursorStyle = source.cursorStyle;
        this._lineNumbers = source.lineNumbers;
    };
    Object.defineProperty(ExtHostTextEditorOptions.prototype, "tabSize", {
        get: function () {
            return this._tabSize;
        },
        set: function (value) {
            var tabSize = this._validateTabSize(value);
            if (tabSize === null) {
                // ignore invalid call
                return;
            }
            if (typeof tabSize === 'number') {
                if (this._tabSize === tabSize) {
                    // nothing to do
                    return;
                }
                // reflect the new tabSize value immediately
                this._tabSize = tabSize;
            }
            warnOnError(this._proxy.$trySetOptions(this._id, {
                tabSize: tabSize
            }));
        },
        enumerable: true,
        configurable: true
    });
    ExtHostTextEditorOptions.prototype._validateTabSize = function (value) {
        if (value === 'auto') {
            return 'auto';
        }
        if (typeof value === 'number') {
            var r = Math.floor(value);
            return (r > 0 ? r : null);
        }
        if (typeof value === 'string') {
            var r = parseInt(value, 10);
            if (isNaN(r)) {
                return null;
            }
            return (r > 0 ? r : null);
        }
        return null;
    };
    Object.defineProperty(ExtHostTextEditorOptions.prototype, "insertSpaces", {
        get: function () {
            return this._insertSpaces;
        },
        set: function (value) {
            var insertSpaces = this._validateInsertSpaces(value);
            if (typeof insertSpaces === 'boolean') {
                if (this._insertSpaces === insertSpaces) {
                    // nothing to do
                    return;
                }
                // reflect the new insertSpaces value immediately
                this._insertSpaces = insertSpaces;
            }
            warnOnError(this._proxy.$trySetOptions(this._id, {
                insertSpaces: insertSpaces
            }));
        },
        enumerable: true,
        configurable: true
    });
    ExtHostTextEditorOptions.prototype._validateInsertSpaces = function (value) {
        if (value === 'auto') {
            return 'auto';
        }
        return (value === 'false' ? false : Boolean(value));
    };
    Object.defineProperty(ExtHostTextEditorOptions.prototype, "cursorStyle", {
        get: function () {
            return this._cursorStyle;
        },
        set: function (value) {
            if (this._cursorStyle === value) {
                // nothing to do
                return;
            }
            this._cursorStyle = value;
            warnOnError(this._proxy.$trySetOptions(this._id, {
                cursorStyle: value
            }));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostTextEditorOptions.prototype, "lineNumbers", {
        get: function () {
            return this._lineNumbers;
        },
        set: function (value) {
            if (this._lineNumbers === value) {
                // nothing to do
                return;
            }
            this._lineNumbers = value;
            warnOnError(this._proxy.$trySetOptions(this._id, {
                lineNumbers: value
            }));
        },
        enumerable: true,
        configurable: true
    });
    ExtHostTextEditorOptions.prototype.assign = function (newOptions) {
        var bulkConfigurationUpdate = {};
        var hasUpdate = false;
        if (typeof newOptions.tabSize !== 'undefined') {
            var tabSize = this._validateTabSize(newOptions.tabSize);
            if (tabSize === 'auto') {
                hasUpdate = true;
                bulkConfigurationUpdate.tabSize = tabSize;
            }
            else if (typeof tabSize === 'number' && this._tabSize !== tabSize) {
                // reflect the new tabSize value immediately
                this._tabSize = tabSize;
                hasUpdate = true;
                bulkConfigurationUpdate.tabSize = tabSize;
            }
        }
        if (typeof newOptions.insertSpaces !== 'undefined') {
            var insertSpaces = this._validateInsertSpaces(newOptions.insertSpaces);
            if (insertSpaces === 'auto') {
                hasUpdate = true;
                bulkConfigurationUpdate.insertSpaces = insertSpaces;
            }
            else if (this._insertSpaces !== insertSpaces) {
                // reflect the new insertSpaces value immediately
                this._insertSpaces = insertSpaces;
                hasUpdate = true;
                bulkConfigurationUpdate.insertSpaces = insertSpaces;
            }
        }
        if (typeof newOptions.cursorStyle !== 'undefined') {
            if (this._cursorStyle !== newOptions.cursorStyle) {
                this._cursorStyle = newOptions.cursorStyle;
                hasUpdate = true;
                bulkConfigurationUpdate.cursorStyle = newOptions.cursorStyle;
            }
        }
        if (typeof newOptions.lineNumbers !== 'undefined') {
            if (this._lineNumbers !== newOptions.lineNumbers) {
                this._lineNumbers = newOptions.lineNumbers;
                hasUpdate = true;
                bulkConfigurationUpdate.lineNumbers = newOptions.lineNumbers;
            }
        }
        if (hasUpdate) {
            warnOnError(this._proxy.$trySetOptions(this._id, bulkConfigurationUpdate));
        }
    };
    return ExtHostTextEditorOptions;
}());
export { ExtHostTextEditorOptions };
var ExtHostTextEditor = /** @class */ (function () {
    function ExtHostTextEditor(proxy, id, document, selections, options, visibleRanges, viewColumn) {
        this._disposed = false;
        this._proxy = proxy;
        this._id = id;
        this._documentData = document;
        this._selections = selections;
        this._options = new ExtHostTextEditorOptions(this._proxy, this._id, options);
        this._visibleRanges = visibleRanges;
        this._viewColumn = viewColumn;
        this._hasDecorationsForKey = Object.create(null);
    }
    Object.defineProperty(ExtHostTextEditor.prototype, "id", {
        get: function () { return this._id; },
        enumerable: true,
        configurable: true
    });
    ExtHostTextEditor.prototype.dispose = function () {
        ok(!this._disposed);
        this._disposed = true;
    };
    ExtHostTextEditor.prototype.show = function (column) {
        this._proxy.$tryShowEditor(this._id, TypeConverters.ViewColumn.from(column));
    };
    ExtHostTextEditor.prototype.hide = function () {
        this._proxy.$tryHideEditor(this._id);
    };
    Object.defineProperty(ExtHostTextEditor.prototype, "document", {
        // ---- the document
        get: function () {
            return this._documentData.document;
        },
        set: function (value) {
            throw readonly('document');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostTextEditor.prototype, "options", {
        // ---- options
        get: function () {
            return this._options;
        },
        set: function (value) {
            if (!this._disposed) {
                this._options.assign(value);
            }
        },
        enumerable: true,
        configurable: true
    });
    ExtHostTextEditor.prototype._acceptOptions = function (options) {
        ok(!this._disposed);
        this._options._accept(options);
    };
    Object.defineProperty(ExtHostTextEditor.prototype, "visibleRanges", {
        // ---- visible ranges
        get: function () {
            return this._visibleRanges;
        },
        set: function (value) {
            throw readonly('visibleRanges');
        },
        enumerable: true,
        configurable: true
    });
    ExtHostTextEditor.prototype._acceptVisibleRanges = function (value) {
        ok(!this._disposed);
        this._visibleRanges = value;
    };
    Object.defineProperty(ExtHostTextEditor.prototype, "viewColumn", {
        // ---- view column
        get: function () {
            return this._viewColumn;
        },
        set: function (value) {
            throw readonly('viewColumn');
        },
        enumerable: true,
        configurable: true
    });
    ExtHostTextEditor.prototype._acceptViewColumn = function (value) {
        ok(!this._disposed);
        this._viewColumn = value;
    };
    Object.defineProperty(ExtHostTextEditor.prototype, "selection", {
        // ---- selections
        get: function () {
            return this._selections && this._selections[0];
        },
        set: function (value) {
            if (!(value instanceof Selection)) {
                throw illegalArgument('selection');
            }
            this._selections = [value];
            this._trySetSelection();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExtHostTextEditor.prototype, "selections", {
        get: function () {
            return this._selections;
        },
        set: function (value) {
            if (!Array.isArray(value) || value.some(function (a) { return !(a instanceof Selection); })) {
                throw illegalArgument('selections');
            }
            this._selections = value;
            this._trySetSelection();
        },
        enumerable: true,
        configurable: true
    });
    ExtHostTextEditor.prototype.setDecorations = function (decorationType, ranges) {
        var _this = this;
        var willBeEmpty = (ranges.length === 0);
        if (willBeEmpty && !this._hasDecorationsForKey[decorationType.key]) {
            // avoid no-op call to the renderer
            return;
        }
        if (willBeEmpty) {
            delete this._hasDecorationsForKey[decorationType.key];
        }
        else {
            this._hasDecorationsForKey[decorationType.key] = true;
        }
        this._runOnProxy(function () {
            if (TypeConverters.isDecorationOptionsArr(ranges)) {
                return _this._proxy.$trySetDecorations(_this._id, decorationType.key, TypeConverters.fromRangeOrRangeWithMessage(ranges));
            }
            else {
                var _ranges = new Array(4 * ranges.length);
                for (var i = 0, len = ranges.length; i < len; i++) {
                    var range = ranges[i];
                    _ranges[4 * i] = range.start.line + 1;
                    _ranges[4 * i + 1] = range.start.character + 1;
                    _ranges[4 * i + 2] = range.end.line + 1;
                    _ranges[4 * i + 3] = range.end.character + 1;
                }
                return _this._proxy.$trySetDecorationsFast(_this._id, decorationType.key, _ranges);
            }
        });
    };
    ExtHostTextEditor.prototype.revealRange = function (range, revealType) {
        var _this = this;
        this._runOnProxy(function () { return _this._proxy.$tryRevealRange(_this._id, TypeConverters.Range.from(range), (revealType || TextEditorRevealType.Default)); });
    };
    ExtHostTextEditor.prototype._trySetSelection = function () {
        var _this = this;
        var selection = this._selections.map(TypeConverters.Selection.from);
        return this._runOnProxy(function () { return _this._proxy.$trySetSelections(_this._id, selection); });
    };
    ExtHostTextEditor.prototype._acceptSelections = function (selections) {
        ok(!this._disposed);
        this._selections = selections;
    };
    // ---- editing
    ExtHostTextEditor.prototype.edit = function (callback, options) {
        if (options === void 0) { options = { undoStopBefore: true, undoStopAfter: true }; }
        if (this._disposed) {
            return Promise.reject(new Error('TextEditor#edit not possible on closed editors'));
        }
        var edit = new TextEditorEdit(this._documentData.document, options);
        callback(edit);
        return this._applyEdit(edit);
    };
    ExtHostTextEditor.prototype._applyEdit = function (editBuilder) {
        var editData = editBuilder.finalize();
        // return when there is nothing to do
        if (editData.edits.length === 0 && !editData.setEndOfLine) {
            return Promise.resolve(true);
        }
        // check that the edits are not overlapping (i.e. illegal)
        var editRanges = editData.edits.map(function (edit) { return edit.range; });
        // sort ascending (by end and then by start)
        editRanges.sort(function (a, b) {
            if (a.end.line === b.end.line) {
                if (a.end.character === b.end.character) {
                    if (a.start.line === b.start.line) {
                        return a.start.character - b.start.character;
                    }
                    return a.start.line - b.start.line;
                }
                return a.end.character - b.end.character;
            }
            return a.end.line - b.end.line;
        });
        // check that no edits are overlapping
        for (var i = 0, count = editRanges.length - 1; i < count; i++) {
            var rangeEnd = editRanges[i].end;
            var nextRangeStart = editRanges[i + 1].start;
            if (nextRangeStart.isBefore(rangeEnd)) {
                // overlapping ranges
                return Promise.reject(new Error('Overlapping ranges are not allowed!'));
            }
        }
        // prepare data for serialization
        var edits = editData.edits.map(function (edit) {
            return {
                range: TypeConverters.Range.from(edit.range),
                text: edit.text,
                forceMoveMarkers: edit.forceMoveMarkers
            };
        });
        return this._proxy.$tryApplyEdits(this._id, editData.documentVersionId, edits, {
            setEndOfLine: editData.setEndOfLine,
            undoStopBefore: editData.undoStopBefore,
            undoStopAfter: editData.undoStopAfter
        });
    };
    ExtHostTextEditor.prototype.insertSnippet = function (snippet, where, options) {
        if (options === void 0) { options = { undoStopBefore: true, undoStopAfter: true }; }
        if (this._disposed) {
            return Promise.reject(new Error('TextEditor#insertSnippet not possible on closed editors'));
        }
        var ranges;
        if (!where || (Array.isArray(where) && where.length === 0)) {
            ranges = this._selections.map(TypeConverters.Range.from);
        }
        else if (where instanceof Position) {
            var _a = TypeConverters.Position.from(where), lineNumber = _a.lineNumber, column = _a.column;
            ranges = [{ startLineNumber: lineNumber, startColumn: column, endLineNumber: lineNumber, endColumn: column }];
        }
        else if (where instanceof Range) {
            ranges = [TypeConverters.Range.from(where)];
        }
        else {
            ranges = [];
            for (var _i = 0, where_1 = where; _i < where_1.length; _i++) {
                var posOrRange = where_1[_i];
                if (posOrRange instanceof Range) {
                    ranges.push(TypeConverters.Range.from(posOrRange));
                }
                else {
                    var _b = TypeConverters.Position.from(posOrRange), lineNumber = _b.lineNumber, column = _b.column;
                    ranges.push({ startLineNumber: lineNumber, startColumn: column, endLineNumber: lineNumber, endColumn: column });
                }
            }
        }
        return this._proxy.$tryInsertSnippet(this._id, snippet.value, ranges, options);
    };
    // ---- util
    ExtHostTextEditor.prototype._runOnProxy = function (callback) {
        var _this = this;
        if (this._disposed) {
            console.warn('TextEditor is closed/disposed');
            return Promise.resolve(undefined);
        }
        return callback().then(function () { return _this; }, function (err) {
            if (!(err instanceof Error && err.name === 'DISPOSED')) {
                console.warn(err);
            }
            return null;
        });
    };
    __decorate([
        deprecated('TextEditor.show')
    ], ExtHostTextEditor.prototype, "show", null);
    __decorate([
        deprecated('TextEditor.hide')
    ], ExtHostTextEditor.prototype, "hide", null);
    return ExtHostTextEditor;
}());
export { ExtHostTextEditor };
function warnOnError(promise) {
    promise.then(null, function (err) {
        console.warn(err);
    });
}
