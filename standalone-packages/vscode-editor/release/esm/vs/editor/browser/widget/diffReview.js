/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
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
import './media/diffReview.css';
import * as nls from '../../../nls.js';
import * as dom from '../../../base/browser/dom.js';
import { createFastDomNode } from '../../../base/browser/fastDomNode.js';
import { ActionBar } from '../../../base/browser/ui/actionbar/actionbar.js';
import { DomScrollableElement } from '../../../base/browser/ui/scrollbar/scrollableElement.js';
import { Action } from '../../../base/common/actions.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { Configuration } from '../config/configuration.js';
import { EditorAction, registerEditorAction } from '../editorExtensions.js';
import { ICodeEditorService } from '../services/codeEditorService.js';
import { LineTokens } from '../../common/core/lineTokens.js';
import { Position } from '../../common/core/position.js';
import { editorLineNumbers } from '../../common/view/editorColorRegistry.js';
import { RenderLineInput, renderViewLine2 as renderViewLine } from '../../common/viewLayout/viewLineRenderer.js';
import { ViewLineRenderingData } from '../../common/viewModel/viewModel.js';
import { ContextKeyExpr } from '../../../platform/contextkey/common/contextkey.js';
import { scrollbarShadow } from '../../../platform/theme/common/colorRegistry.js';
import { registerThemingParticipant } from '../../../platform/theme/common/themeService.js';
var DIFF_LINES_PADDING = 3;
var DiffEntry = /** @class */ (function () {
    function DiffEntry(originalLineStart, originalLineEnd, modifiedLineStart, modifiedLineEnd) {
        this.originalLineStart = originalLineStart;
        this.originalLineEnd = originalLineEnd;
        this.modifiedLineStart = modifiedLineStart;
        this.modifiedLineEnd = modifiedLineEnd;
    }
    DiffEntry.prototype.getType = function () {
        if (this.originalLineStart === 0) {
            return 1 /* Insert */;
        }
        if (this.modifiedLineStart === 0) {
            return 2 /* Delete */;
        }
        return 0 /* Equal */;
    };
    return DiffEntry;
}());
var Diff = /** @class */ (function () {
    function Diff(entries) {
        this.entries = entries;
    }
    return Diff;
}());
var DiffReview = /** @class */ (function (_super) {
    __extends(DiffReview, _super);
    function DiffReview(diffEditor) {
        var _this = _super.call(this) || this;
        _this._width = 0;
        _this._diffEditor = diffEditor;
        _this._isVisible = false;
        _this.shadow = createFastDomNode(document.createElement('div'));
        _this.shadow.setClassName('diff-review-shadow');
        _this.actionBarContainer = createFastDomNode(document.createElement('div'));
        _this.actionBarContainer.setClassName('diff-review-actions');
        _this._actionBar = _this._register(new ActionBar(_this.actionBarContainer.domNode));
        _this._actionBar.push(new Action('diffreview.close', nls.localize('label.close', "Close"), 'close-diff-review', true, function () {
            _this.hide();
            return null;
        }), { label: false, icon: true });
        _this.domNode = createFastDomNode(document.createElement('div'));
        _this.domNode.setClassName('diff-review monaco-editor-background');
        _this._content = createFastDomNode(document.createElement('div'));
        _this._content.setClassName('diff-review-content');
        _this.scrollbar = _this._register(new DomScrollableElement(_this._content.domNode, {}));
        _this.domNode.domNode.appendChild(_this.scrollbar.getDomNode());
        _this._register(diffEditor.onDidUpdateDiff(function () {
            if (!_this._isVisible) {
                return;
            }
            _this._diffs = _this._compute();
            _this._render();
        }));
        _this._register(diffEditor.getModifiedEditor().onDidChangeCursorPosition(function () {
            if (!_this._isVisible) {
                return;
            }
            _this._render();
        }));
        _this._register(diffEditor.getOriginalEditor().onDidFocusEditorWidget(function () {
            if (_this._isVisible) {
                _this.hide();
            }
        }));
        _this._register(diffEditor.getModifiedEditor().onDidFocusEditorWidget(function () {
            if (_this._isVisible) {
                _this.hide();
            }
        }));
        _this._register(dom.addStandardDisposableListener(_this.domNode.domNode, 'click', function (e) {
            e.preventDefault();
            var row = dom.findParentWithClass(e.target, 'diff-review-row');
            if (row) {
                _this._goToRow(row);
            }
        }));
        _this._register(dom.addStandardDisposableListener(_this.domNode.domNode, 'keydown', function (e) {
            if (e.equals(18 /* DownArrow */)
                || e.equals(2048 /* CtrlCmd */ | 18 /* DownArrow */)
                || e.equals(512 /* Alt */ | 18 /* DownArrow */)) {
                e.preventDefault();
                _this._goToRow(_this._getNextRow());
            }
            if (e.equals(16 /* UpArrow */)
                || e.equals(2048 /* CtrlCmd */ | 16 /* UpArrow */)
                || e.equals(512 /* Alt */ | 16 /* UpArrow */)) {
                e.preventDefault();
                _this._goToRow(_this._getPrevRow());
            }
            if (e.equals(9 /* Escape */)
                || e.equals(2048 /* CtrlCmd */ | 9 /* Escape */)
                || e.equals(512 /* Alt */ | 9 /* Escape */)
                || e.equals(1024 /* Shift */ | 9 /* Escape */)) {
                e.preventDefault();
                _this.hide();
            }
            if (e.equals(10 /* Space */)
                || e.equals(3 /* Enter */)) {
                e.preventDefault();
                _this.accept();
            }
        }));
        _this._diffs = [];
        _this._currentDiff = null;
        return _this;
    }
    DiffReview.prototype.prev = function () {
        var index = 0;
        if (!this._isVisible) {
            this._diffs = this._compute();
        }
        if (this._isVisible) {
            var currentIndex = -1;
            for (var i = 0, len = this._diffs.length; i < len; i++) {
                if (this._diffs[i] === this._currentDiff) {
                    currentIndex = i;
                    break;
                }
            }
            index = (this._diffs.length + currentIndex - 1);
        }
        else {
            index = this._findDiffIndex(this._diffEditor.getPosition());
        }
        if (this._diffs.length === 0) {
            // Nothing to do
            return;
        }
        index = index % this._diffs.length;
        this._diffEditor.setPosition(new Position(this._diffs[index].entries[0].modifiedLineStart, 1));
        this._isVisible = true;
        this._diffEditor.doLayout();
        this._render();
        this._goToRow(this._getNextRow());
    };
    DiffReview.prototype.next = function () {
        var index = 0;
        if (!this._isVisible) {
            this._diffs = this._compute();
        }
        if (this._isVisible) {
            var currentIndex = -1;
            for (var i = 0, len = this._diffs.length; i < len; i++) {
                if (this._diffs[i] === this._currentDiff) {
                    currentIndex = i;
                    break;
                }
            }
            index = (currentIndex + 1);
        }
        else {
            index = this._findDiffIndex(this._diffEditor.getPosition());
        }
        if (this._diffs.length === 0) {
            // Nothing to do
            return;
        }
        index = index % this._diffs.length;
        this._diffEditor.setPosition(new Position(this._diffs[index].entries[0].modifiedLineStart, 1));
        this._isVisible = true;
        this._diffEditor.doLayout();
        this._render();
        this._goToRow(this._getNextRow());
    };
    DiffReview.prototype.accept = function () {
        var jumpToLineNumber = -1;
        var current = this._getCurrentFocusedRow();
        if (current) {
            var lineNumber = parseInt(current.getAttribute('data-line'), 10);
            if (!isNaN(lineNumber)) {
                jumpToLineNumber = lineNumber;
            }
        }
        this.hide();
        if (jumpToLineNumber !== -1) {
            this._diffEditor.setPosition(new Position(jumpToLineNumber, 1));
            this._diffEditor.revealPosition(new Position(jumpToLineNumber, 1), 1 /* Immediate */);
        }
    };
    DiffReview.prototype.hide = function () {
        this._isVisible = false;
        this._diffEditor.focus();
        this._diffEditor.doLayout();
        this._render();
    };
    DiffReview.prototype._getPrevRow = function () {
        var current = this._getCurrentFocusedRow();
        if (!current) {
            return this._getFirstRow();
        }
        if (current.previousElementSibling) {
            return current.previousElementSibling;
        }
        return current;
    };
    DiffReview.prototype._getNextRow = function () {
        var current = this._getCurrentFocusedRow();
        if (!current) {
            return this._getFirstRow();
        }
        if (current.nextElementSibling) {
            return current.nextElementSibling;
        }
        return current;
    };
    DiffReview.prototype._getFirstRow = function () {
        return this.domNode.domNode.querySelector('.diff-review-row');
    };
    DiffReview.prototype._getCurrentFocusedRow = function () {
        var result = document.activeElement;
        if (result && /diff-review-row/.test(result.className)) {
            return result;
        }
        return null;
    };
    DiffReview.prototype._goToRow = function (row) {
        var prev = this._getCurrentFocusedRow();
        row.tabIndex = 0;
        row.focus();
        if (prev && prev !== row) {
            prev.tabIndex = -1;
        }
        this.scrollbar.scanDomNode();
    };
    DiffReview.prototype.isVisible = function () {
        return this._isVisible;
    };
    DiffReview.prototype.layout = function (top, width, height) {
        this._width = width;
        this.shadow.setTop(top - 6);
        this.shadow.setWidth(width);
        this.shadow.setHeight(this._isVisible ? 6 : 0);
        this.domNode.setTop(top);
        this.domNode.setWidth(width);
        this.domNode.setHeight(height);
        this._content.setHeight(height);
        this._content.setWidth(width);
        if (this._isVisible) {
            this.actionBarContainer.setAttribute('aria-hidden', 'false');
            this.actionBarContainer.setDisplay('block');
        }
        else {
            this.actionBarContainer.setAttribute('aria-hidden', 'true');
            this.actionBarContainer.setDisplay('none');
        }
    };
    DiffReview.prototype._compute = function () {
        var lineChanges = this._diffEditor.getLineChanges();
        if (!lineChanges || lineChanges.length === 0) {
            return [];
        }
        var originalModel = this._diffEditor.getOriginalEditor().getModel();
        var modifiedModel = this._diffEditor.getModifiedEditor().getModel();
        if (!originalModel || !modifiedModel) {
            return [];
        }
        return DiffReview._mergeAdjacent(lineChanges, originalModel.getLineCount(), modifiedModel.getLineCount());
    };
    DiffReview._mergeAdjacent = function (lineChanges, originalLineCount, modifiedLineCount) {
        if (!lineChanges || lineChanges.length === 0) {
            return [];
        }
        var diffs = [], diffsLength = 0;
        for (var i = 0, len = lineChanges.length; i < len; i++) {
            var lineChange = lineChanges[i];
            var originalStart = lineChange.originalStartLineNumber;
            var originalEnd = lineChange.originalEndLineNumber;
            var modifiedStart = lineChange.modifiedStartLineNumber;
            var modifiedEnd = lineChange.modifiedEndLineNumber;
            var r_1 = [], rLength_1 = 0;
            // Emit before anchors
            {
                var originalEqualAbove = (originalEnd === 0 ? originalStart : originalStart - 1);
                var modifiedEqualAbove = (modifiedEnd === 0 ? modifiedStart : modifiedStart - 1);
                // Make sure we don't step into the previous diff
                var minOriginal = 1;
                var minModified = 1;
                if (i > 0) {
                    var prevLineChange = lineChanges[i - 1];
                    if (prevLineChange.originalEndLineNumber === 0) {
                        minOriginal = prevLineChange.originalStartLineNumber + 1;
                    }
                    else {
                        minOriginal = prevLineChange.originalEndLineNumber + 1;
                    }
                    if (prevLineChange.modifiedEndLineNumber === 0) {
                        minModified = prevLineChange.modifiedStartLineNumber + 1;
                    }
                    else {
                        minModified = prevLineChange.modifiedEndLineNumber + 1;
                    }
                }
                var fromOriginal = originalEqualAbove - DIFF_LINES_PADDING + 1;
                var fromModified = modifiedEqualAbove - DIFF_LINES_PADDING + 1;
                if (fromOriginal < minOriginal) {
                    var delta = minOriginal - fromOriginal;
                    fromOriginal = fromOriginal + delta;
                    fromModified = fromModified + delta;
                }
                if (fromModified < minModified) {
                    var delta = minModified - fromModified;
                    fromOriginal = fromOriginal + delta;
                    fromModified = fromModified + delta;
                }
                r_1[rLength_1++] = new DiffEntry(fromOriginal, originalEqualAbove, fromModified, modifiedEqualAbove);
            }
            // Emit deleted lines
            {
                if (originalEnd !== 0) {
                    r_1[rLength_1++] = new DiffEntry(originalStart, originalEnd, 0, 0);
                }
            }
            // Emit inserted lines
            {
                if (modifiedEnd !== 0) {
                    r_1[rLength_1++] = new DiffEntry(0, 0, modifiedStart, modifiedEnd);
                }
            }
            // Emit after anchors
            {
                var originalEqualBelow = (originalEnd === 0 ? originalStart + 1 : originalEnd + 1);
                var modifiedEqualBelow = (modifiedEnd === 0 ? modifiedStart + 1 : modifiedEnd + 1);
                // Make sure we don't step into the next diff
                var maxOriginal = originalLineCount;
                var maxModified = modifiedLineCount;
                if (i + 1 < len) {
                    var nextLineChange = lineChanges[i + 1];
                    if (nextLineChange.originalEndLineNumber === 0) {
                        maxOriginal = nextLineChange.originalStartLineNumber;
                    }
                    else {
                        maxOriginal = nextLineChange.originalStartLineNumber - 1;
                    }
                    if (nextLineChange.modifiedEndLineNumber === 0) {
                        maxModified = nextLineChange.modifiedStartLineNumber;
                    }
                    else {
                        maxModified = nextLineChange.modifiedStartLineNumber - 1;
                    }
                }
                var toOriginal = originalEqualBelow + DIFF_LINES_PADDING - 1;
                var toModified = modifiedEqualBelow + DIFF_LINES_PADDING - 1;
                if (toOriginal > maxOriginal) {
                    var delta = maxOriginal - toOriginal;
                    toOriginal = toOriginal + delta;
                    toModified = toModified + delta;
                }
                if (toModified > maxModified) {
                    var delta = maxModified - toModified;
                    toOriginal = toOriginal + delta;
                    toModified = toModified + delta;
                }
                r_1[rLength_1++] = new DiffEntry(originalEqualBelow, toOriginal, modifiedEqualBelow, toModified);
            }
            diffs[diffsLength++] = new Diff(r_1);
        }
        // Merge adjacent diffs
        var curr = diffs[0].entries;
        var r = [], rLength = 0;
        for (var i = 1, len = diffs.length; i < len; i++) {
            var thisDiff = diffs[i].entries;
            var currLast = curr[curr.length - 1];
            var thisFirst = thisDiff[0];
            if (currLast.getType() === 0 /* Equal */
                && thisFirst.getType() === 0 /* Equal */
                && thisFirst.originalLineStart <= currLast.originalLineEnd) {
                // We are dealing with equal lines that overlap
                curr[curr.length - 1] = new DiffEntry(currLast.originalLineStart, thisFirst.originalLineEnd, currLast.modifiedLineStart, thisFirst.modifiedLineEnd);
                curr = curr.concat(thisDiff.slice(1));
                continue;
            }
            r[rLength++] = new Diff(curr);
            curr = thisDiff;
        }
        r[rLength++] = new Diff(curr);
        return r;
    };
    DiffReview.prototype._findDiffIndex = function (pos) {
        var lineNumber = pos.lineNumber;
        for (var i = 0, len = this._diffs.length; i < len; i++) {
            var diff = this._diffs[i].entries;
            var lastModifiedLine = diff[diff.length - 1].modifiedLineEnd;
            if (lineNumber <= lastModifiedLine) {
                return i;
            }
        }
        return 0;
    };
    DiffReview.prototype._render = function () {
        var originalOpts = this._diffEditor.getOriginalEditor().getConfiguration();
        var modifiedOpts = this._diffEditor.getModifiedEditor().getConfiguration();
        var originalModel = this._diffEditor.getOriginalEditor().getModel();
        var modifiedModel = this._diffEditor.getModifiedEditor().getModel();
        var originalModelOpts = originalModel.getOptions();
        var modifiedModelOpts = modifiedModel.getOptions();
        if (!this._isVisible || !originalModel || !modifiedModel) {
            dom.clearNode(this._content.domNode);
            this._currentDiff = null;
            this.scrollbar.scanDomNode();
            return;
        }
        var pos = this._diffEditor.getPosition();
        var diffIndex = this._findDiffIndex(pos);
        if (this._diffs[diffIndex] === this._currentDiff) {
            return;
        }
        this._currentDiff = this._diffs[diffIndex];
        var diffs = this._diffs[diffIndex].entries;
        var container = document.createElement('div');
        container.className = 'diff-review-table';
        container.setAttribute('role', 'list');
        Configuration.applyFontInfoSlow(container, modifiedOpts.fontInfo);
        var minOriginalLine = 0;
        var maxOriginalLine = 0;
        var minModifiedLine = 0;
        var maxModifiedLine = 0;
        for (var i = 0, len = diffs.length; i < len; i++) {
            var diffEntry = diffs[i];
            var originalLineStart = diffEntry.originalLineStart;
            var originalLineEnd = diffEntry.originalLineEnd;
            var modifiedLineStart = diffEntry.modifiedLineStart;
            var modifiedLineEnd = diffEntry.modifiedLineEnd;
            if (originalLineStart !== 0 && ((minOriginalLine === 0 || originalLineStart < minOriginalLine))) {
                minOriginalLine = originalLineStart;
            }
            if (originalLineEnd !== 0 && ((maxOriginalLine === 0 || originalLineEnd > maxOriginalLine))) {
                maxOriginalLine = originalLineEnd;
            }
            if (modifiedLineStart !== 0 && ((minModifiedLine === 0 || modifiedLineStart < minModifiedLine))) {
                minModifiedLine = modifiedLineStart;
            }
            if (modifiedLineEnd !== 0 && ((maxModifiedLine === 0 || modifiedLineEnd > maxModifiedLine))) {
                maxModifiedLine = modifiedLineEnd;
            }
        }
        var header = document.createElement('div');
        header.className = 'diff-review-row';
        var cell = document.createElement('div');
        cell.className = 'diff-review-cell diff-review-summary';
        var originalChangedLinesCnt = maxOriginalLine - minOriginalLine + 1;
        var modifiedChangedLinesCnt = maxModifiedLine - minModifiedLine + 1;
        cell.appendChild(document.createTextNode(diffIndex + 1 + "/" + this._diffs.length + ": @@ -" + minOriginalLine + "," + originalChangedLinesCnt + " +" + minModifiedLine + "," + modifiedChangedLinesCnt + " @@"));
        header.setAttribute('data-line', String(minModifiedLine));
        var getAriaLines = function (lines) {
            if (lines === 0) {
                return nls.localize('no_lines', "no lines");
            }
            else if (lines === 1) {
                return nls.localize('one_line', "1 line");
            }
            else {
                return nls.localize('more_lines', "{0} lines", lines);
            }
        };
        var originalChangedLinesCntAria = getAriaLines(originalChangedLinesCnt);
        var modifiedChangedLinesCntAria = getAriaLines(modifiedChangedLinesCnt);
        header.setAttribute('aria-label', nls.localize({
            key: 'header',
            comment: [
                'This is the ARIA label for a git diff header.',
                'A git diff header looks like this: @@ -154,12 +159,39 @@.',
                'That encodes that at original line 154 (which is now line 159), 12 lines were removed/changed with 39 lines.',
                'Variables 0 and 1 refer to the diff index out of total number of diffs.',
                'Variables 2 and 4 will be numbers (a line number).',
                'Variables 3 and 5 will be "no lines", "1 line" or "X lines", localized separately.'
            ]
        }, "Difference {0} of {1}: original {2}, {3}, modified {4}, {5}", (diffIndex + 1), this._diffs.length, minOriginalLine, originalChangedLinesCntAria, minModifiedLine, modifiedChangedLinesCntAria));
        header.appendChild(cell);
        // @@ -504,7 +517,7 @@
        header.setAttribute('role', 'listitem');
        container.appendChild(header);
        var modLine = minModifiedLine;
        for (var i = 0, len = diffs.length; i < len; i++) {
            var diffEntry = diffs[i];
            DiffReview._renderSection(container, diffEntry, modLine, this._width, originalOpts, originalModel, originalModelOpts, modifiedOpts, modifiedModel, modifiedModelOpts);
            if (diffEntry.modifiedLineStart !== 0) {
                modLine = diffEntry.modifiedLineEnd;
            }
        }
        dom.clearNode(this._content.domNode);
        this._content.domNode.appendChild(container);
        this.scrollbar.scanDomNode();
    };
    DiffReview._renderSection = function (dest, diffEntry, modLine, width, originalOpts, originalModel, originalModelOpts, modifiedOpts, modifiedModel, modifiedModelOpts) {
        var type = diffEntry.getType();
        var rowClassName = 'diff-review-row';
        var lineNumbersExtraClassName = '';
        var spacerClassName = 'diff-review-spacer';
        switch (type) {
            case 1 /* Insert */:
                rowClassName = 'diff-review-row line-insert';
                lineNumbersExtraClassName = ' char-insert';
                spacerClassName = 'diff-review-spacer insert-sign';
                break;
            case 2 /* Delete */:
                rowClassName = 'diff-review-row line-delete';
                lineNumbersExtraClassName = ' char-delete';
                spacerClassName = 'diff-review-spacer delete-sign';
                break;
        }
        var originalLineStart = diffEntry.originalLineStart;
        var originalLineEnd = diffEntry.originalLineEnd;
        var modifiedLineStart = diffEntry.modifiedLineStart;
        var modifiedLineEnd = diffEntry.modifiedLineEnd;
        var cnt = Math.max(modifiedLineEnd - modifiedLineStart, originalLineEnd - originalLineStart);
        var originalLineNumbersWidth = originalOpts.layoutInfo.glyphMarginWidth + originalOpts.layoutInfo.lineNumbersWidth;
        var modifiedLineNumbersWidth = 10 + modifiedOpts.layoutInfo.glyphMarginWidth + modifiedOpts.layoutInfo.lineNumbersWidth;
        for (var i = 0; i <= cnt; i++) {
            var originalLine = (originalLineStart === 0 ? 0 : originalLineStart + i);
            var modifiedLine = (modifiedLineStart === 0 ? 0 : modifiedLineStart + i);
            var row = document.createElement('div');
            row.style.minWidth = width + 'px';
            row.className = rowClassName;
            row.setAttribute('role', 'listitem');
            if (modifiedLine !== 0) {
                modLine = modifiedLine;
            }
            row.setAttribute('data-line', String(modLine));
            var cell = document.createElement('div');
            cell.className = 'diff-review-cell';
            row.appendChild(cell);
            var originalLineNumber = document.createElement('span');
            originalLineNumber.style.width = (originalLineNumbersWidth + 'px');
            originalLineNumber.style.minWidth = (originalLineNumbersWidth + 'px');
            originalLineNumber.className = 'diff-review-line-number' + lineNumbersExtraClassName;
            if (originalLine !== 0) {
                originalLineNumber.appendChild(document.createTextNode(String(originalLine)));
            }
            else {
                originalLineNumber.innerHTML = '&nbsp;';
            }
            cell.appendChild(originalLineNumber);
            var modifiedLineNumber = document.createElement('span');
            modifiedLineNumber.style.width = (modifiedLineNumbersWidth + 'px');
            modifiedLineNumber.style.minWidth = (modifiedLineNumbersWidth + 'px');
            modifiedLineNumber.style.paddingRight = '10px';
            modifiedLineNumber.className = 'diff-review-line-number' + lineNumbersExtraClassName;
            if (modifiedLine !== 0) {
                modifiedLineNumber.appendChild(document.createTextNode(String(modifiedLine)));
            }
            else {
                modifiedLineNumber.innerHTML = '&nbsp;';
            }
            cell.appendChild(modifiedLineNumber);
            var spacer = document.createElement('span');
            spacer.className = spacerClassName;
            spacer.innerHTML = '&nbsp;&nbsp;';
            cell.appendChild(spacer);
            var lineContent = void 0;
            if (modifiedLine !== 0) {
                cell.insertAdjacentHTML('beforeend', this._renderLine(modifiedModel, modifiedOpts, modifiedModelOpts.tabSize, modifiedLine));
                lineContent = modifiedModel.getLineContent(modifiedLine);
            }
            else {
                cell.insertAdjacentHTML('beforeend', this._renderLine(originalModel, originalOpts, originalModelOpts.tabSize, originalLine));
                lineContent = originalModel.getLineContent(originalLine);
            }
            if (lineContent.length === 0) {
                lineContent = nls.localize('blankLine', "blank");
            }
            var ariaLabel = void 0;
            switch (type) {
                case 0 /* Equal */:
                    ariaLabel = nls.localize('equalLine', "original {0}, modified {1}: {2}", originalLine, modifiedLine, lineContent);
                    break;
                case 1 /* Insert */:
                    ariaLabel = nls.localize('insertLine', "+ modified {0}: {1}", modifiedLine, lineContent);
                    break;
                case 2 /* Delete */:
                    ariaLabel = nls.localize('deleteLine', "- original {0}: {1}", originalLine, lineContent);
                    break;
            }
            row.setAttribute('aria-label', ariaLabel);
            dest.appendChild(row);
        }
    };
    DiffReview._renderLine = function (model, config, tabSize, lineNumber) {
        var lineContent = model.getLineContent(lineNumber);
        var defaultMetadata = ((0 /* None */ << 11 /* FONT_STYLE_OFFSET */)
            | (1 /* DefaultForeground */ << 14 /* FOREGROUND_OFFSET */)
            | (2 /* DefaultBackground */ << 23 /* BACKGROUND_OFFSET */)) >>> 0;
        var tokens = new Uint32Array(2);
        tokens[0] = lineContent.length;
        tokens[1] = defaultMetadata;
        var lineTokens = new LineTokens(tokens, lineContent);
        var isBasicASCII = ViewLineRenderingData.isBasicASCII(lineContent, model.mightContainNonBasicASCII());
        var containsRTL = ViewLineRenderingData.containsRTL(lineContent, isBasicASCII, model.mightContainRTL());
        var r = renderViewLine(new RenderLineInput((config.fontInfo.isMonospace && !config.viewInfo.disableMonospaceOptimizations), config.fontInfo.canUseHalfwidthRightwardsArrow, lineContent, false, isBasicASCII, containsRTL, 0, lineTokens, [], tabSize, config.fontInfo.spaceWidth, config.viewInfo.stopRenderingLineAfter, config.viewInfo.renderWhitespace, config.viewInfo.renderControlCharacters, config.viewInfo.fontLigatures));
        return r.html;
    };
    return DiffReview;
}(Disposable));
export { DiffReview };
// theming
registerThemingParticipant(function (theme, collector) {
    var lineNumbers = theme.getColor(editorLineNumbers);
    if (lineNumbers) {
        collector.addRule(".monaco-diff-editor .diff-review-line-number { color: " + lineNumbers + "; }");
    }
    var shadow = theme.getColor(scrollbarShadow);
    if (shadow) {
        collector.addRule(".monaco-diff-editor .diff-review-shadow { box-shadow: " + shadow + " 0 -6px 6px -6px inset; }");
    }
});
var DiffReviewNext = /** @class */ (function (_super) {
    __extends(DiffReviewNext, _super);
    function DiffReviewNext() {
        return _super.call(this, {
            id: 'editor.action.diffReview.next',
            label: nls.localize('editor.action.diffReview.next', "Go to Next Difference"),
            alias: 'Go to Next Difference',
            precondition: ContextKeyExpr.has('isInDiffEditor'),
            kbOpts: {
                kbExpr: null,
                primary: 65 /* F7 */,
                weight: 100 /* EditorContrib */
            }
        }) || this;
    }
    DiffReviewNext.prototype.run = function (accessor, editor) {
        var diffEditor = findFocusedDiffEditor(accessor);
        if (diffEditor) {
            diffEditor.diffReviewNext();
        }
    };
    return DiffReviewNext;
}(EditorAction));
var DiffReviewPrev = /** @class */ (function (_super) {
    __extends(DiffReviewPrev, _super);
    function DiffReviewPrev() {
        return _super.call(this, {
            id: 'editor.action.diffReview.prev',
            label: nls.localize('editor.action.diffReview.prev', "Go to Previous Difference"),
            alias: 'Go to Previous Difference',
            precondition: ContextKeyExpr.has('isInDiffEditor'),
            kbOpts: {
                kbExpr: null,
                primary: 1024 /* Shift */ | 65 /* F7 */,
                weight: 100 /* EditorContrib */
            }
        }) || this;
    }
    DiffReviewPrev.prototype.run = function (accessor, editor) {
        var diffEditor = findFocusedDiffEditor(accessor);
        if (diffEditor) {
            diffEditor.diffReviewPrev();
        }
    };
    return DiffReviewPrev;
}(EditorAction));
function findFocusedDiffEditor(accessor) {
    var codeEditorService = accessor.get(ICodeEditorService);
    var diffEditors = codeEditorService.listDiffEditors();
    for (var i = 0, len = diffEditors.length; i < len; i++) {
        var diffEditor = diffEditors[i];
        if (diffEditor.hasWidgetFocus()) {
            return diffEditor;
        }
    }
    return null;
}
registerEditorAction(DiffReviewNext);
registerEditorAction(DiffReviewPrev);
