/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
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
import './bracketMatching.css';
import * as nls from '../../../nls.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { Position } from '../../common/core/position.js';
import { Selection } from '../../common/core/selection.js';
import { RunOnceScheduler } from '../../../base/common/async.js';
import { EditorAction, registerEditorAction, registerEditorContribution } from '../../browser/editorExtensions.js';
import { EditorContextKeys } from '../../common/editorContextKeys.js';
import { registerThemingParticipant, themeColorFromId } from '../../../platform/theme/common/themeService.js';
import { editorBracketMatchBackground, editorBracketMatchBorder } from '../../common/view/editorColorRegistry.js';
import { ModelDecorationOptions } from '../../common/model/textModel.js';
import { registerColor } from '../../../platform/theme/common/colorRegistry.js';
import { TrackedRangeStickiness, OverviewRulerLane } from '../../common/model.js';
var overviewRulerBracketMatchForeground = registerColor('editorOverviewRuler.bracketMatchForeground', { dark: '#A0A0A0', light: '#A0A0A0', hc: '#A0A0A0' }, nls.localize('overviewRulerBracketMatchForeground', 'Overview ruler marker color for matching brackets.'));
var JumpToBracketAction = /** @class */ (function (_super) {
    __extends(JumpToBracketAction, _super);
    function JumpToBracketAction() {
        return _super.call(this, {
            id: 'editor.action.jumpToBracket',
            label: nls.localize('smartSelect.jumpBracket', "Go to Bracket"),
            alias: 'Go to Bracket',
            precondition: null,
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 88 /* US_BACKSLASH */
            }
        }) || this;
    }
    JumpToBracketAction.prototype.run = function (accessor, editor) {
        var controller = BracketMatchingController.get(editor);
        if (!controller) {
            return;
        }
        controller.jumpToBracket();
    };
    return JumpToBracketAction;
}(EditorAction));
var SelectToBracketAction = /** @class */ (function (_super) {
    __extends(SelectToBracketAction, _super);
    function SelectToBracketAction() {
        return _super.call(this, {
            id: 'editor.action.selectToBracket',
            label: nls.localize('smartSelect.selectToBracket', "Select to Bracket"),
            alias: 'Select to Bracket',
            precondition: null
        }) || this;
    }
    SelectToBracketAction.prototype.run = function (accessor, editor) {
        var controller = BracketMatchingController.get(editor);
        if (!controller) {
            return;
        }
        controller.selectToBracket();
    };
    return SelectToBracketAction;
}(EditorAction));
var BracketsData = /** @class */ (function () {
    function BracketsData(position, brackets) {
        this.position = position;
        this.brackets = brackets;
    }
    return BracketsData;
}());
var BracketMatchingController = /** @class */ (function (_super) {
    __extends(BracketMatchingController, _super);
    function BracketMatchingController(editor) {
        var _this = _super.call(this) || this;
        _this._editor = editor;
        _this._lastBracketsData = [];
        _this._lastVersionId = 0;
        _this._decorations = [];
        _this._updateBracketsSoon = _this._register(new RunOnceScheduler(function () { return _this._updateBrackets(); }, 50));
        _this._matchBrackets = _this._editor.getConfiguration().contribInfo.matchBrackets;
        _this._updateBracketsSoon.schedule();
        _this._register(editor.onDidChangeCursorPosition(function (e) {
            if (!_this._matchBrackets) {
                // Early exit if nothing needs to be done!
                // Leave some form of early exit check here if you wish to continue being a cursor position change listener ;)
                return;
            }
            _this._updateBracketsSoon.schedule();
        }));
        _this._register(editor.onDidChangeModel(function (e) { _this._decorations = []; _this._updateBracketsSoon.schedule(); }));
        _this._register(editor.onDidChangeModelLanguageConfiguration(function (e) {
            _this._lastBracketsData = [];
            _this._updateBracketsSoon.schedule();
        }));
        _this._register(editor.onDidChangeConfiguration(function (e) {
            _this._matchBrackets = _this._editor.getConfiguration().contribInfo.matchBrackets;
            if (!_this._matchBrackets && _this._decorations.length > 0) {
                // Remove existing decorations if bracket matching is off
                _this._decorations = _this._editor.deltaDecorations(_this._decorations, []);
            }
            _this._updateBracketsSoon.schedule();
        }));
        return _this;
    }
    BracketMatchingController.get = function (editor) {
        return editor.getContribution(BracketMatchingController.ID);
    };
    BracketMatchingController.prototype.getId = function () {
        return BracketMatchingController.ID;
    };
    BracketMatchingController.prototype.jumpToBracket = function () {
        var model = this._editor.getModel();
        if (!model) {
            return;
        }
        var newSelections = this._editor.getSelections().map(function (selection) {
            var position = selection.getStartPosition();
            // find matching brackets if position is on a bracket
            var brackets = model.matchBracket(position);
            var newCursorPosition = null;
            if (brackets) {
                if (brackets[0].containsPosition(position)) {
                    newCursorPosition = brackets[1].getStartPosition();
                }
                else if (brackets[1].containsPosition(position)) {
                    newCursorPosition = brackets[0].getStartPosition();
                }
            }
            else {
                // find the next bracket if the position isn't on a matching bracket
                var nextBracket = model.findNextBracket(position);
                if (nextBracket && nextBracket.range) {
                    newCursorPosition = nextBracket.range.getStartPosition();
                }
            }
            if (newCursorPosition) {
                return new Selection(newCursorPosition.lineNumber, newCursorPosition.column, newCursorPosition.lineNumber, newCursorPosition.column);
            }
            return new Selection(position.lineNumber, position.column, position.lineNumber, position.column);
        });
        this._editor.setSelections(newSelections);
        this._editor.revealRange(newSelections[0]);
    };
    BracketMatchingController.prototype.selectToBracket = function () {
        var model = this._editor.getModel();
        if (!model) {
            return;
        }
        var newSelections = [];
        this._editor.getSelections().forEach(function (selection) {
            var position = selection.getStartPosition();
            var brackets = model.matchBracket(position);
            var openBracket = null;
            var closeBracket = null;
            if (!brackets) {
                var nextBracket = model.findNextBracket(position);
                if (nextBracket && nextBracket.range) {
                    brackets = model.matchBracket(nextBracket.range.getStartPosition());
                }
            }
            if (brackets) {
                if (brackets[0].startLineNumber === brackets[1].startLineNumber) {
                    openBracket = brackets[1].startColumn < brackets[0].startColumn ?
                        brackets[1].getStartPosition() : brackets[0].getStartPosition();
                    closeBracket = brackets[1].startColumn < brackets[0].startColumn ?
                        brackets[0].getEndPosition() : brackets[1].getEndPosition();
                }
                else {
                    openBracket = brackets[1].startLineNumber < brackets[0].startLineNumber ?
                        brackets[1].getStartPosition() : brackets[0].getStartPosition();
                    closeBracket = brackets[1].startLineNumber < brackets[0].startLineNumber ?
                        brackets[0].getEndPosition() : brackets[1].getEndPosition();
                }
            }
            if (openBracket && closeBracket) {
                newSelections.push(new Selection(openBracket.lineNumber, openBracket.column, closeBracket.lineNumber, closeBracket.column));
            }
        });
        if (newSelections.length > 0) {
            this._editor.setSelections(newSelections);
            this._editor.revealRange(newSelections[0]);
        }
    };
    BracketMatchingController.prototype._updateBrackets = function () {
        if (!this._matchBrackets) {
            return;
        }
        this._recomputeBrackets();
        var newDecorations = [], newDecorationsLen = 0;
        for (var i = 0, len = this._lastBracketsData.length; i < len; i++) {
            var brackets = this._lastBracketsData[i].brackets;
            if (brackets) {
                newDecorations[newDecorationsLen++] = { range: brackets[0], options: BracketMatchingController._DECORATION_OPTIONS };
                newDecorations[newDecorationsLen++] = { range: brackets[1], options: BracketMatchingController._DECORATION_OPTIONS };
            }
        }
        this._decorations = this._editor.deltaDecorations(this._decorations, newDecorations);
    };
    BracketMatchingController.prototype._recomputeBrackets = function () {
        var model = this._editor.getModel();
        if (!model) {
            // no model => no brackets!
            this._lastBracketsData = [];
            this._lastVersionId = 0;
            return;
        }
        var versionId = model.getVersionId();
        var previousData = [];
        if (this._lastVersionId === versionId) {
            // use the previous data only if the model is at the same version id
            previousData = this._lastBracketsData;
        }
        var selections = this._editor.getSelections();
        var positions = [], positionsLen = 0;
        for (var i = 0, len = selections.length; i < len; i++) {
            var selection = selections[i];
            if (selection.isEmpty()) {
                // will bracket match a cursor only if the selection is collapsed
                positions[positionsLen++] = selection.getStartPosition();
            }
        }
        // sort positions for `previousData` cache hits
        if (positions.length > 1) {
            positions.sort(Position.compare);
        }
        var newData = [], newDataLen = 0;
        var previousIndex = 0, previousLen = previousData.length;
        for (var i = 0, len = positions.length; i < len; i++) {
            var position = positions[i];
            while (previousIndex < previousLen && previousData[previousIndex].position.isBefore(position)) {
                previousIndex++;
            }
            if (previousIndex < previousLen && previousData[previousIndex].position.equals(position)) {
                newData[newDataLen++] = previousData[previousIndex];
            }
            else {
                var brackets = model.matchBracket(position);
                newData[newDataLen++] = new BracketsData(position, brackets);
            }
        }
        this._lastBracketsData = newData;
        this._lastVersionId = versionId;
    };
    BracketMatchingController.ID = 'editor.contrib.bracketMatchingController';
    BracketMatchingController._DECORATION_OPTIONS = ModelDecorationOptions.register({
        stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
        className: 'bracket-match',
        overviewRuler: {
            color: themeColorFromId(overviewRulerBracketMatchForeground),
            darkColor: themeColorFromId(overviewRulerBracketMatchForeground),
            position: OverviewRulerLane.Center
        }
    });
    return BracketMatchingController;
}(Disposable));
export { BracketMatchingController };
registerEditorContribution(BracketMatchingController);
registerEditorAction(SelectToBracketAction);
registerEditorAction(JumpToBracketAction);
registerThemingParticipant(function (theme, collector) {
    var bracketMatchBackground = theme.getColor(editorBracketMatchBackground);
    if (bracketMatchBackground) {
        collector.addRule(".monaco-editor .bracket-match { background-color: " + bracketMatchBackground + "; }");
    }
    var bracketMatchBorder = theme.getColor(editorBracketMatchBorder);
    if (bracketMatchBorder) {
        collector.addRule(".monaco-editor .bracket-match { border: 1px solid " + bracketMatchBorder + "; }");
    }
});
