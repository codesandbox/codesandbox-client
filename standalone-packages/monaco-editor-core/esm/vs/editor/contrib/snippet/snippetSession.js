/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import './snippetSession.css';
import { getLeadingWhitespace } from '../../../base/common/strings';
import { TrackedRangeStickiness } from '../../common/model';
import { EditOperation } from '../../common/core/editOperation';
import { Placeholder, Choice, Text, SnippetParser } from './snippetParser';
import { Selection } from '../../common/core/selection';
import { Range } from '../../common/core/range';
import { groupBy } from '../../../base/common/arrays';
import { dispose } from '../../../base/common/lifecycle';
import { SelectionBasedVariableResolver, CompositeSnippetVariableResolver, ModelBasedVariableResolver, ClipboardBasedVariableResolver, TimeBasedVariableResolver } from './snippetVariables';
import { ModelDecorationOptions } from '../../common/model/textModel';
import { IClipboardService } from '../../../platform/clipboard/common/clipboardService';
import { optional } from '../../../platform/instantiation/common/instantiation';
var OneSnippet = /** @class */ (function () {
    function OneSnippet(editor, snippet, offset) {
        this._nestingLevel = 1;
        this._editor = editor;
        this._snippet = snippet;
        this._offset = offset;
        this._placeholderGroups = groupBy(snippet.placeholders, Placeholder.compareByIndex);
        this._placeholderGroupsIdx = -1;
    }
    OneSnippet.prototype.dispose = function () {
        if (this._placeholderDecorations) {
            var toRemove_1 = [];
            this._placeholderDecorations.forEach(function (handle) { return toRemove_1.push(handle); });
            this._editor.deltaDecorations(toRemove_1, []);
        }
        this._placeholderGroups.length = 0;
    };
    OneSnippet.prototype._initDecorations = function () {
        var _this = this;
        if (this._placeholderDecorations) {
            // already initialized
            return;
        }
        this._placeholderDecorations = new Map();
        var model = this._editor.getModel();
        this._editor.changeDecorations(function (accessor) {
            // create a decoration for each placeholder
            for (var _i = 0, _a = _this._snippet.placeholders; _i < _a.length; _i++) {
                var placeholder = _a[_i];
                var placeholderOffset = _this._snippet.offset(placeholder);
                var placeholderLen = _this._snippet.fullLen(placeholder);
                var range = Range.fromPositions(model.getPositionAt(_this._offset + placeholderOffset), model.getPositionAt(_this._offset + placeholderOffset + placeholderLen));
                var options = placeholder.isFinalTabstop ? OneSnippet._decor.inactiveFinal : OneSnippet._decor.inactive;
                var handle = accessor.addDecoration(range, options);
                _this._placeholderDecorations.set(placeholder, handle);
            }
        });
    };
    OneSnippet.prototype.move = function (fwd) {
        var _this = this;
        this._initDecorations();
        // Transform placeholder text if necessary
        if (this._placeholderGroupsIdx >= 0) {
            var operations = [];
            for (var _i = 0, _a = this._placeholderGroups[this._placeholderGroupsIdx]; _i < _a.length; _i++) {
                var placeholder = _a[_i];
                // Check if the placeholder has a transformation
                if (placeholder.transform) {
                    var id = this._placeholderDecorations.get(placeholder);
                    var range = this._editor.getModel().getDecorationRange(id);
                    var currentValue = this._editor.getModel().getValueInRange(range);
                    operations.push(EditOperation.replaceMove(range, placeholder.transform.resolve(currentValue)));
                }
            }
            if (operations.length > 0) {
                this._editor.executeEdits('snippet.placeholderTransform', operations);
            }
        }
        if (fwd === true && this._placeholderGroupsIdx < this._placeholderGroups.length - 1) {
            this._placeholderGroupsIdx += 1;
        }
        else if (fwd === false && this._placeholderGroupsIdx > 0) {
            this._placeholderGroupsIdx -= 1;
        }
        else {
            // the selection of the current placeholder might
            // not acurate any more -> simply restore it
        }
        return this._editor.getModel().changeDecorations(function (accessor) {
            var activePlaceholders = new Set();
            // change stickiness to always grow when typing at its edges
            // because these decorations represent the currently active
            // tabstop.
            // Special case #1: reaching the final tabstop
            // Special case #2: placeholders enclosing active placeholders
            var selections = [];
            for (var _i = 0, _a = _this._placeholderGroups[_this._placeholderGroupsIdx]; _i < _a.length; _i++) {
                var placeholder = _a[_i];
                var id = _this._placeholderDecorations.get(placeholder);
                var range = _this._editor.getModel().getDecorationRange(id);
                selections.push(new Selection(range.startLineNumber, range.startColumn, range.endLineNumber, range.endColumn));
                accessor.changeDecorationOptions(id, placeholder.isFinalTabstop ? OneSnippet._decor.activeFinal : OneSnippet._decor.active);
                activePlaceholders.add(placeholder);
                for (var _b = 0, _c = _this._snippet.enclosingPlaceholders(placeholder); _b < _c.length; _b++) {
                    var enclosingPlaceholder = _c[_b];
                    var id_1 = _this._placeholderDecorations.get(enclosingPlaceholder);
                    accessor.changeDecorationOptions(id_1, enclosingPlaceholder.isFinalTabstop ? OneSnippet._decor.activeFinal : OneSnippet._decor.active);
                    activePlaceholders.add(enclosingPlaceholder);
                }
            }
            // change stickness to never grow when typing at its edges
            // so that in-active tabstops never grow
            _this._placeholderDecorations.forEach(function (id, placeholder) {
                if (!activePlaceholders.has(placeholder)) {
                    accessor.changeDecorationOptions(id, placeholder.isFinalTabstop ? OneSnippet._decor.inactiveFinal : OneSnippet._decor.inactive);
                }
            });
            return selections;
        });
    };
    Object.defineProperty(OneSnippet.prototype, "isAtFirstPlaceholder", {
        get: function () {
            return this._placeholderGroupsIdx <= 0 || this._placeholderGroups.length === 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OneSnippet.prototype, "isAtLastPlaceholder", {
        get: function () {
            return this._placeholderGroupsIdx === this._placeholderGroups.length - 1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OneSnippet.prototype, "hasPlaceholder", {
        get: function () {
            return this._snippet.placeholders.length > 0;
        },
        enumerable: true,
        configurable: true
    });
    OneSnippet.prototype.computePossibleSelections = function () {
        var result = new Map();
        for (var _i = 0, _a = this._placeholderGroups; _i < _a.length; _i++) {
            var placeholdersWithEqualIndex = _a[_i];
            var ranges = void 0;
            for (var _b = 0, placeholdersWithEqualIndex_1 = placeholdersWithEqualIndex; _b < placeholdersWithEqualIndex_1.length; _b++) {
                var placeholder = placeholdersWithEqualIndex_1[_b];
                if (placeholder.isFinalTabstop) {
                    // ignore those
                    break;
                }
                if (!ranges) {
                    ranges = [];
                    result.set(placeholder.index, ranges);
                }
                var id = this._placeholderDecorations.get(placeholder);
                var range = this._editor.getModel().getDecorationRange(id);
                if (!range) {
                    // one of the placeholder lost its decoration and
                    // therefore we bail out and pretend the placeholder
                    // (with its mirrors) doesn't exist anymore.
                    result.delete(placeholder.index);
                    break;
                }
                ranges.push(range);
            }
        }
        return result;
    };
    Object.defineProperty(OneSnippet.prototype, "choice", {
        get: function () {
            return this._placeholderGroups[this._placeholderGroupsIdx][0].choice;
        },
        enumerable: true,
        configurable: true
    });
    OneSnippet.prototype.merge = function (others) {
        var _this = this;
        var model = this._editor.getModel();
        this._nestingLevel *= 10;
        this._editor.changeDecorations(function (accessor) {
            // For each active placeholder take one snippet and merge it
            // in that the placeholder (can be many for `$1foo$1foo`). Because
            // everything is sorted by editor selection we can simply remove
            // elements from the beginning of the array
            for (var _i = 0, _a = _this._placeholderGroups[_this._placeholderGroupsIdx]; _i < _a.length; _i++) {
                var placeholder = _a[_i];
                var nested = others.shift();
                console.assert(!nested._placeholderDecorations);
                // Massage placeholder-indicies of the nested snippet to be
                // sorted right after the insertion point. This ensures we move
                // through the placeholders in the correct order
                for (var _b = 0, _c = nested._snippet.placeholderInfo.all; _b < _c.length; _b++) {
                    var nestedPlaceholder = _c[_b];
                    if (nestedPlaceholder.isFinalTabstop) {
                        nestedPlaceholder.index = placeholder.index + ((nested._snippet.placeholderInfo.last.index + 1) / _this._nestingLevel);
                    }
                    else {
                        nestedPlaceholder.index = placeholder.index + (nestedPlaceholder.index / _this._nestingLevel);
                    }
                }
                _this._snippet.replace(placeholder, nested._snippet.children);
                // Remove the placeholder at which position are inserting
                // the snippet and also remove its decoration.
                var id = _this._placeholderDecorations.get(placeholder);
                accessor.removeDecoration(id);
                _this._placeholderDecorations.delete(placeholder);
                // For each *new* placeholder we create decoration to monitor
                // how and if it grows/shrinks.
                for (var _d = 0, _e = nested._snippet.placeholders; _d < _e.length; _d++) {
                    var placeholder_1 = _e[_d];
                    var placeholderOffset = nested._snippet.offset(placeholder_1);
                    var placeholderLen = nested._snippet.fullLen(placeholder_1);
                    var range = Range.fromPositions(model.getPositionAt(nested._offset + placeholderOffset), model.getPositionAt(nested._offset + placeholderOffset + placeholderLen));
                    var handle = accessor.addDecoration(range, OneSnippet._decor.inactive);
                    _this._placeholderDecorations.set(placeholder_1, handle);
                }
            }
            // Last, re-create the placeholder groups by sorting placeholders by their index.
            _this._placeholderGroups = groupBy(_this._snippet.placeholders, Placeholder.compareByIndex);
        });
    };
    OneSnippet.prototype.getEnclosingRange = function () {
        var result;
        var model = this._editor.getModel();
        this._placeholderDecorations.forEach(function (decorationId) {
            var placeholderRange = model.getDecorationRange(decorationId);
            if (!result) {
                result = placeholderRange;
            }
            else {
                result = result.plusRange(placeholderRange);
            }
        });
        return result;
    };
    OneSnippet._decor = {
        active: ModelDecorationOptions.register({ stickiness: TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges, className: 'snippet-placeholder' }),
        inactive: ModelDecorationOptions.register({ stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges, className: 'snippet-placeholder' }),
        activeFinal: ModelDecorationOptions.register({ stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges, className: 'finish-snippet-placeholder' }),
        inactiveFinal: ModelDecorationOptions.register({ stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges, className: 'finish-snippet-placeholder' }),
    };
    return OneSnippet;
}());
export { OneSnippet };
var SnippetSession = /** @class */ (function () {
    function SnippetSession(editor, template, overwriteBefore, overwriteAfter) {
        if (overwriteBefore === void 0) { overwriteBefore = 0; }
        if (overwriteAfter === void 0) { overwriteAfter = 0; }
        this._templateMerges = [];
        this._snippets = [];
        this._editor = editor;
        this._template = template;
        this._overwriteBefore = overwriteBefore;
        this._overwriteAfter = overwriteAfter;
    }
    SnippetSession.adjustWhitespace2 = function (model, position, snippet) {
        var line = model.getLineContent(position.lineNumber);
        var lineLeadingWhitespace = getLeadingWhitespace(line, 0, position.column - 1);
        snippet.walk(function (marker) {
            if (marker instanceof Text && !(marker.parent instanceof Choice)) {
                // adjust indentation of text markers, except for choise elements
                // which get adjusted when being selected
                var lines = marker.value.split(/\r\n|\r|\n/);
                for (var i = 1; i < lines.length; i++) {
                    var templateLeadingWhitespace = getLeadingWhitespace(lines[i]);
                    lines[i] = model.normalizeIndentation(lineLeadingWhitespace + templateLeadingWhitespace) + lines[i].substr(templateLeadingWhitespace.length);
                }
                var newValue = lines.join(model.getEOL());
                if (newValue !== marker.value) {
                    marker.parent.replace(marker, [new Text(newValue)]);
                }
            }
            return true;
        });
    };
    SnippetSession.adjustSelection = function (model, selection, overwriteBefore, overwriteAfter) {
        if (overwriteBefore !== 0 || overwriteAfter !== 0) {
            // overwrite[Before|After] is compute using the position, not the whole
            // selection. therefore we adjust the selection around that position
            var positionLineNumber = selection.positionLineNumber, positionColumn = selection.positionColumn;
            var positionColumnBefore = positionColumn - overwriteBefore;
            var positionColumnAfter = positionColumn + overwriteAfter;
            var range = model.validateRange({
                startLineNumber: positionLineNumber,
                startColumn: positionColumnBefore,
                endLineNumber: positionLineNumber,
                endColumn: positionColumnAfter
            });
            selection = Selection.createWithDirection(range.startLineNumber, range.startColumn, range.endLineNumber, range.endColumn, selection.getDirection());
        }
        return selection;
    };
    SnippetSession.createEditsAndSnippets = function (editor, template, overwriteBefore, overwriteAfter, enforceFinalTabstop) {
        var model = editor.getModel();
        var edits = [];
        var snippets = [];
        var modelBasedVariableResolver = new ModelBasedVariableResolver(model);
        var clipboardService = editor.invokeWithinContext(function (accessor) { return accessor.get(IClipboardService, optional); });
        var delta = 0;
        // know what text the overwrite[Before|After] extensions
        // of the primary curser have selected because only when
        // secondary selections extend to the same text we can grow them
        var firstBeforeText = model.getValueInRange(SnippetSession.adjustSelection(model, editor.getSelection(), overwriteBefore, 0));
        var firstAfterText = model.getValueInRange(SnippetSession.adjustSelection(model, editor.getSelection(), 0, overwriteAfter));
        // sort selections by their start position but remeber
        // the original index. that allows you to create correct
        // offset-based selection logic without changing the
        // primary selection
        var indexedSelections = editor.getSelections()
            .map(function (selection, idx) { return ({ selection: selection, idx: idx }); })
            .sort(function (a, b) { return Range.compareRangesUsingStarts(a.selection, b.selection); });
        for (var _i = 0, indexedSelections_1 = indexedSelections; _i < indexedSelections_1.length; _i++) {
            var _a = indexedSelections_1[_i], selection = _a.selection, idx = _a.idx;
            // extend selection with the `overwriteBefore` and `overwriteAfter` and then
            // compare if this matches the extensions of the primary selection
            var extensionBefore = SnippetSession.adjustSelection(model, selection, overwriteBefore, 0);
            var extensionAfter = SnippetSession.adjustSelection(model, selection, 0, overwriteAfter);
            if (firstBeforeText !== model.getValueInRange(extensionBefore)) {
                extensionBefore = selection;
            }
            if (firstAfterText !== model.getValueInRange(extensionAfter)) {
                extensionAfter = selection;
            }
            // merge the before and after selection into one
            var snippetSelection = selection
                .setStartPosition(extensionBefore.startLineNumber, extensionBefore.startColumn)
                .setEndPosition(extensionAfter.endLineNumber, extensionAfter.endColumn);
            var snippet = new SnippetParser().parse(template, true, enforceFinalTabstop);
            // adjust the template string to match the indentation and
            // whitespace rules of this insert location (can be different for each cursor)
            var start = snippetSelection.getStartPosition();
            SnippetSession.adjustWhitespace2(model, start, snippet);
            snippet.resolveVariables(new CompositeSnippetVariableResolver([
                modelBasedVariableResolver,
                new ClipboardBasedVariableResolver(clipboardService, idx, indexedSelections.length),
                new SelectionBasedVariableResolver(model, selection),
                new TimeBasedVariableResolver
            ]));
            var offset = model.getOffsetAt(start) + delta;
            delta += snippet.toString().length - model.getValueLengthInRange(snippetSelection);
            // store snippets with the index of their originating selection.
            // that ensures the primiary cursor stays primary despite not being
            // the one with lowest start position
            edits[idx] = EditOperation.replace(snippetSelection, snippet.toString());
            snippets[idx] = new OneSnippet(editor, snippet, offset);
        }
        return { edits: edits, snippets: snippets };
    };
    SnippetSession.prototype.dispose = function () {
        dispose(this._snippets);
    };
    SnippetSession.prototype._logInfo = function () {
        return "template=\"" + this._template + "\", merged_templates=\"" + this._templateMerges.join(' -> ') + "\"";
    };
    SnippetSession.prototype.insert = function () {
        var _this = this;
        var model = this._editor.getModel();
        // make insert edit and start with first selections
        var _a = SnippetSession.createEditsAndSnippets(this._editor, this._template, this._overwriteBefore, this._overwriteAfter, false), edits = _a.edits, snippets = _a.snippets;
        this._snippets = snippets;
        var selections = model.pushEditOperations(this._editor.getSelections(), edits, function (undoEdits) {
            if (_this._snippets[0].hasPlaceholder) {
                return _this._move(true);
            }
            else {
                return undoEdits.map(function (edit) { return Selection.fromPositions(edit.range.getEndPosition()); });
            }
        });
        this._editor.setSelections(selections);
        this._editor.revealRange(selections[0]);
    };
    SnippetSession.prototype.merge = function (template, overwriteBefore, overwriteAfter) {
        var _this = this;
        if (overwriteBefore === void 0) { overwriteBefore = 0; }
        if (overwriteAfter === void 0) { overwriteAfter = 0; }
        this._templateMerges.push([this._snippets[0]._nestingLevel, this._snippets[0]._placeholderGroupsIdx, template]);
        var _a = SnippetSession.createEditsAndSnippets(this._editor, template, overwriteBefore, overwriteAfter, true), edits = _a.edits, snippets = _a.snippets;
        this._editor.setSelections(this._editor.getModel().pushEditOperations(this._editor.getSelections(), edits, function (undoEdits) {
            for (var _i = 0, _a = _this._snippets; _i < _a.length; _i++) {
                var snippet = _a[_i];
                snippet.merge(snippets);
            }
            console.assert(snippets.length === 0);
            if (_this._snippets[0].hasPlaceholder) {
                return _this._move(undefined);
            }
            else {
                return undoEdits.map(function (edit) { return Selection.fromPositions(edit.range.getEndPosition()); });
            }
        }));
    };
    SnippetSession.prototype.next = function () {
        var newSelections = this._move(true);
        this._editor.setSelections(newSelections);
        this._editor.revealPositionInCenterIfOutsideViewport(newSelections[0].getPosition());
    };
    SnippetSession.prototype.prev = function () {
        var newSelections = this._move(false);
        this._editor.setSelections(newSelections);
        this._editor.revealPositionInCenterIfOutsideViewport(newSelections[0].getPosition());
    };
    SnippetSession.prototype._move = function (fwd) {
        var selections = [];
        for (var _i = 0, _a = this._snippets; _i < _a.length; _i++) {
            var snippet = _a[_i];
            var oneSelection = snippet.move(fwd);
            selections.push.apply(selections, oneSelection);
        }
        return selections;
    };
    Object.defineProperty(SnippetSession.prototype, "isAtFirstPlaceholder", {
        get: function () {
            return this._snippets[0].isAtFirstPlaceholder;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SnippetSession.prototype, "isAtLastPlaceholder", {
        get: function () {
            return this._snippets[0].isAtLastPlaceholder;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SnippetSession.prototype, "hasPlaceholder", {
        get: function () {
            return this._snippets[0].hasPlaceholder;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SnippetSession.prototype, "choice", {
        get: function () {
            return this._snippets[0].choice;
        },
        enumerable: true,
        configurable: true
    });
    SnippetSession.prototype.isSelectionWithinPlaceholders = function () {
        if (!this.hasPlaceholder) {
            return false;
        }
        var selections = this._editor.getSelections();
        if (selections.length < this._snippets.length) {
            // this means we started snippet mode with N
            // selections and have M (N > M) selections.
            // So one snippet is without selection -> cancel
            return false;
        }
        var allPossibleSelections;
        var _loop_1 = function (snippet) {
            var possibleSelections = snippet.computePossibleSelections();
            // for the first snippet find the placeholder (and its ranges)
            // that contain at least one selection. for all remaining snippets
            // the same placeholder (and their ranges) must be used.
            if (!allPossibleSelections) {
                allPossibleSelections = new Map();
                possibleSelections.forEach(function (ranges, index) {
                    ranges.sort(Range.compareRangesUsingStarts);
                    for (var _i = 0, selections_1 = selections; _i < selections_1.length; _i++) {
                        var selection = selections_1[_i];
                        if (ranges[0].containsRange(selection)) {
                            allPossibleSelections.set(index, []);
                            break;
                        }
                    }
                });
            }
            if (allPossibleSelections.size === 0) {
                return { value: false };
            }
            // add selections from 'this' snippet so that we know all
            // selections for this placeholder
            allPossibleSelections.forEach(function (array, index) {
                array.push.apply(array, possibleSelections.get(index));
            });
        };
        for (var _i = 0, _a = this._snippets; _i < _a.length; _i++) {
            var snippet = _a[_i];
            var state_1 = _loop_1(snippet);
            if (typeof state_1 === "object")
                return state_1.value;
        }
        // sort selections (and later placeholder-ranges). then walk both
        // arrays and make sure the placeholder-ranges contain the corresponding
        // selection
        selections.sort(Range.compareRangesUsingStarts);
        allPossibleSelections.forEach(function (ranges, index) {
            if (ranges.length !== selections.length) {
                allPossibleSelections.delete(index);
                return;
            }
            ranges.sort(Range.compareRangesUsingStarts);
            for (var i = 0; i < ranges.length; i++) {
                if (!ranges[i].containsRange(selections[i])) {
                    allPossibleSelections.delete(index);
                    return;
                }
            }
        });
        // from all possible selections we have deleted those
        // that don't match with the current selection. if we don't
        // have any left, we don't have a selection anymore
        return allPossibleSelections.size > 0;
    };
    SnippetSession.prototype.getEnclosingRange = function () {
        var result;
        for (var _i = 0, _a = this._snippets; _i < _a.length; _i++) {
            var snippet = _a[_i];
            var snippetRange = snippet.getEnclosingRange();
            if (!result) {
                result = snippetRange;
            }
            else {
                result = result.plusRange(snippetRange);
            }
        }
        return result;
    };
    return SnippetSession;
}());
export { SnippetSession };
