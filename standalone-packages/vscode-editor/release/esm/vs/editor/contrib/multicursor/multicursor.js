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
import * as nls from '../../../nls.js';
import { Disposable, dispose } from '../../../base/common/lifecycle.js';
import { KeyChord } from '../../../base/common/keyCodes.js';
import { RunOnceScheduler } from '../../../base/common/async.js';
import { TrackedRangeStickiness, OverviewRulerLane } from '../../common/model.js';
import { EditorContextKeys } from '../../common/editorContextKeys.js';
import { registerEditorAction, registerEditorContribution, EditorAction } from '../../browser/editorExtensions.js';
import { Range } from '../../common/core/range.js';
import { Selection } from '../../common/core/selection.js';
import { CursorChangeReason } from '../../common/controller/cursorEvents.js';
import { CursorMoveCommands } from '../../common/controller/cursorMoveCommands.js';
import { DocumentHighlightProviderRegistry } from '../../common/modes.js';
import { CommonFindController } from '../find/findController.js';
import { ModelDecorationOptions } from '../../common/model/textModel.js';
import { overviewRulerSelectionHighlightForeground } from '../../../platform/theme/common/colorRegistry.js';
import { themeColorFromId } from '../../../platform/theme/common/themeService.js';
import { MenuId } from '../../../platform/actions/common/actions.js';
var InsertCursorAbove = /** @class */ (function (_super) {
    __extends(InsertCursorAbove, _super);
    function InsertCursorAbove() {
        return _super.call(this, {
            id: 'editor.action.insertCursorAbove',
            label: nls.localize('mutlicursor.insertAbove', "Add Cursor Above"),
            alias: 'Add Cursor Above',
            precondition: null,
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: 2048 /* CtrlCmd */ | 512 /* Alt */ | 16 /* UpArrow */,
                linux: {
                    primary: 1024 /* Shift */ | 512 /* Alt */ | 16 /* UpArrow */,
                    secondary: [2048 /* CtrlCmd */ | 1024 /* Shift */ | 16 /* UpArrow */]
                },
                weight: 100 /* EditorContrib */
            },
            menubarOpts: {
                menuId: MenuId.MenubarSelectionMenu,
                group: '3_multi',
                title: nls.localize({ key: 'miInsertCursorAbove', comment: ['&& denotes a mnemonic'] }, "&&Add Cursor Above"),
                order: 2
            }
        }) || this;
    }
    InsertCursorAbove.prototype.run = function (accessor, editor, args) {
        var useLogicalLine = (args && args.logicalLine === true);
        var cursors = editor._getCursors();
        var context = cursors.context;
        if (context.config.readOnly) {
            return;
        }
        context.model.pushStackElement();
        cursors.setStates(args.source, CursorChangeReason.Explicit, CursorMoveCommands.addCursorUp(context, cursors.getAll(), useLogicalLine));
        cursors.reveal(true, 1 /* TopMost */, 0 /* Smooth */);
    };
    return InsertCursorAbove;
}(EditorAction));
export { InsertCursorAbove };
var InsertCursorBelow = /** @class */ (function (_super) {
    __extends(InsertCursorBelow, _super);
    function InsertCursorBelow() {
        return _super.call(this, {
            id: 'editor.action.insertCursorBelow',
            label: nls.localize('mutlicursor.insertBelow', "Add Cursor Below"),
            alias: 'Add Cursor Below',
            precondition: null,
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: 2048 /* CtrlCmd */ | 512 /* Alt */ | 18 /* DownArrow */,
                linux: {
                    primary: 1024 /* Shift */ | 512 /* Alt */ | 18 /* DownArrow */,
                    secondary: [2048 /* CtrlCmd */ | 1024 /* Shift */ | 18 /* DownArrow */]
                },
                weight: 100 /* EditorContrib */
            },
            menubarOpts: {
                menuId: MenuId.MenubarSelectionMenu,
                group: '3_multi',
                title: nls.localize({ key: 'miInsertCursorBelow', comment: ['&& denotes a mnemonic'] }, "A&&dd Cursor Below"),
                order: 3
            }
        }) || this;
    }
    InsertCursorBelow.prototype.run = function (accessor, editor, args) {
        var useLogicalLine = (args && args.logicalLine === true);
        var cursors = editor._getCursors();
        var context = cursors.context;
        if (context.config.readOnly) {
            return;
        }
        context.model.pushStackElement();
        cursors.setStates(args.source, CursorChangeReason.Explicit, CursorMoveCommands.addCursorDown(context, cursors.getAll(), useLogicalLine));
        cursors.reveal(true, 2 /* BottomMost */, 0 /* Smooth */);
    };
    return InsertCursorBelow;
}(EditorAction));
export { InsertCursorBelow };
var InsertCursorAtEndOfEachLineSelected = /** @class */ (function (_super) {
    __extends(InsertCursorAtEndOfEachLineSelected, _super);
    function InsertCursorAtEndOfEachLineSelected() {
        return _super.call(this, {
            id: 'editor.action.insertCursorAtEndOfEachLineSelected',
            label: nls.localize('mutlicursor.insertAtEndOfEachLineSelected', "Add Cursors to Line Ends"),
            alias: 'Add Cursors to Line Ends',
            precondition: null,
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: 1024 /* Shift */ | 512 /* Alt */ | 39 /* KEY_I */,
                weight: 100 /* EditorContrib */
            },
            menubarOpts: {
                menuId: MenuId.MenubarSelectionMenu,
                group: '3_multi',
                title: nls.localize({ key: 'miInsertCursorAtEndOfEachLineSelected', comment: ['&& denotes a mnemonic'] }, "Add C&&ursors to Line Ends"),
                order: 4
            }
        }) || this;
    }
    InsertCursorAtEndOfEachLineSelected.prototype.getCursorsForSelection = function (selection, model, result) {
        if (selection.isEmpty()) {
            return;
        }
        for (var i = selection.startLineNumber; i < selection.endLineNumber; i++) {
            var currentLineMaxColumn = model.getLineMaxColumn(i);
            result.push(new Selection(i, currentLineMaxColumn, i, currentLineMaxColumn));
        }
        if (selection.endColumn > 1) {
            result.push(new Selection(selection.endLineNumber, selection.endColumn, selection.endLineNumber, selection.endColumn));
        }
    };
    InsertCursorAtEndOfEachLineSelected.prototype.run = function (accessor, editor) {
        var _this = this;
        var model = editor.getModel();
        var selections = editor.getSelections();
        var newSelections = [];
        selections.forEach(function (sel) { return _this.getCursorsForSelection(sel, model, newSelections); });
        if (newSelections.length > 0) {
            editor.setSelections(newSelections);
        }
    };
    return InsertCursorAtEndOfEachLineSelected;
}(EditorAction));
var MultiCursorSessionResult = /** @class */ (function () {
    function MultiCursorSessionResult(selections, revealRange, revealScrollType) {
        this.selections = selections;
        this.revealRange = revealRange;
        this.revealScrollType = revealScrollType;
    }
    return MultiCursorSessionResult;
}());
export { MultiCursorSessionResult };
var MultiCursorSession = /** @class */ (function () {
    function MultiCursorSession(_editor, findController, isDisconnectedFromFindController, searchText, wholeWord, matchCase, currentMatch) {
        this._editor = _editor;
        this.findController = findController;
        this.isDisconnectedFromFindController = isDisconnectedFromFindController;
        this.searchText = searchText;
        this.wholeWord = wholeWord;
        this.matchCase = matchCase;
        this.currentMatch = currentMatch;
    }
    MultiCursorSession.create = function (editor, findController) {
        var findState = findController.getState();
        // Find widget owns entirely what we search for if:
        //  - focus is not in the editor (i.e. it is in the find widget)
        //  - and the search widget is visible
        //  - and the search string is non-empty
        if (!editor.hasTextFocus() && findState.isRevealed && findState.searchString.length > 0) {
            // Find widget owns what is searched for
            return new MultiCursorSession(editor, findController, false, findState.searchString, findState.wholeWord, findState.matchCase, null);
        }
        // Otherwise, the selection gives the search text, and the find widget gives the search settings
        // The exception is the find state disassociation case: when beginning with a single, collapsed selection
        var isDisconnectedFromFindController = false;
        var wholeWord;
        var matchCase;
        var selections = editor.getSelections();
        if (selections.length === 1 && selections[0].isEmpty()) {
            isDisconnectedFromFindController = true;
            wholeWord = true;
            matchCase = true;
        }
        else {
            wholeWord = findState.wholeWord;
            matchCase = findState.matchCase;
        }
        // Selection owns what is searched for
        var s = editor.getSelection();
        var searchText;
        var currentMatch = null;
        if (s.isEmpty()) {
            // selection is empty => expand to current word
            var word = editor.getModel().getWordAtPosition(s.getStartPosition());
            if (!word) {
                return null;
            }
            searchText = word.word;
            currentMatch = new Selection(s.startLineNumber, word.startColumn, s.startLineNumber, word.endColumn);
        }
        else {
            searchText = editor.getModel().getValueInRange(s).replace(/\r\n/g, '\n');
        }
        return new MultiCursorSession(editor, findController, isDisconnectedFromFindController, searchText, wholeWord, matchCase, currentMatch);
    };
    MultiCursorSession.prototype.addSelectionToNextFindMatch = function () {
        var nextMatch = this._getNextMatch();
        if (!nextMatch) {
            return null;
        }
        var allSelections = this._editor.getSelections();
        return new MultiCursorSessionResult(allSelections.concat(nextMatch), nextMatch, 0 /* Smooth */);
    };
    MultiCursorSession.prototype.moveSelectionToNextFindMatch = function () {
        var nextMatch = this._getNextMatch();
        if (!nextMatch) {
            return null;
        }
        var allSelections = this._editor.getSelections();
        return new MultiCursorSessionResult(allSelections.slice(0, allSelections.length - 1).concat(nextMatch), nextMatch, 0 /* Smooth */);
    };
    MultiCursorSession.prototype._getNextMatch = function () {
        if (this.currentMatch) {
            var result = this.currentMatch;
            this.currentMatch = null;
            return result;
        }
        this.findController.highlightFindOptions();
        var allSelections = this._editor.getSelections();
        var lastAddedSelection = allSelections[allSelections.length - 1];
        var nextMatch = this._editor.getModel().findNextMatch(this.searchText, lastAddedSelection.getEndPosition(), false, this.matchCase, this.wholeWord ? this._editor.getConfiguration().wordSeparators : null, false);
        if (!nextMatch) {
            return null;
        }
        return new Selection(nextMatch.range.startLineNumber, nextMatch.range.startColumn, nextMatch.range.endLineNumber, nextMatch.range.endColumn);
    };
    MultiCursorSession.prototype.addSelectionToPreviousFindMatch = function () {
        var previousMatch = this._getPreviousMatch();
        if (!previousMatch) {
            return null;
        }
        var allSelections = this._editor.getSelections();
        return new MultiCursorSessionResult(allSelections.concat(previousMatch), previousMatch, 0 /* Smooth */);
    };
    MultiCursorSession.prototype.moveSelectionToPreviousFindMatch = function () {
        var previousMatch = this._getPreviousMatch();
        if (!previousMatch) {
            return null;
        }
        var allSelections = this._editor.getSelections();
        return new MultiCursorSessionResult(allSelections.slice(0, allSelections.length - 1).concat(previousMatch), previousMatch, 0 /* Smooth */);
    };
    MultiCursorSession.prototype._getPreviousMatch = function () {
        if (this.currentMatch) {
            var result = this.currentMatch;
            this.currentMatch = null;
            return result;
        }
        this.findController.highlightFindOptions();
        var allSelections = this._editor.getSelections();
        var lastAddedSelection = allSelections[allSelections.length - 1];
        var previousMatch = this._editor.getModel().findPreviousMatch(this.searchText, lastAddedSelection.getStartPosition(), false, this.matchCase, this.wholeWord ? this._editor.getConfiguration().wordSeparators : null, false);
        if (!previousMatch) {
            return null;
        }
        return new Selection(previousMatch.range.startLineNumber, previousMatch.range.startColumn, previousMatch.range.endLineNumber, previousMatch.range.endColumn);
    };
    MultiCursorSession.prototype.selectAll = function () {
        this.findController.highlightFindOptions();
        return this._editor.getModel().findMatches(this.searchText, true, false, this.matchCase, this.wholeWord ? this._editor.getConfiguration().wordSeparators : null, false, 1073741824 /* MAX_SAFE_SMALL_INTEGER */);
    };
    return MultiCursorSession;
}());
export { MultiCursorSession };
var MultiCursorSelectionController = /** @class */ (function (_super) {
    __extends(MultiCursorSelectionController, _super);
    function MultiCursorSelectionController(editor) {
        var _this = _super.call(this) || this;
        _this._editor = editor;
        _this._ignoreSelectionChange = false;
        _this._session = null;
        _this._sessionDispose = [];
        return _this;
    }
    MultiCursorSelectionController.get = function (editor) {
        return editor.getContribution(MultiCursorSelectionController.ID);
    };
    MultiCursorSelectionController.prototype.dispose = function () {
        this._endSession();
        _super.prototype.dispose.call(this);
    };
    MultiCursorSelectionController.prototype.getId = function () {
        return MultiCursorSelectionController.ID;
    };
    MultiCursorSelectionController.prototype._beginSessionIfNeeded = function (findController) {
        var _this = this;
        if (!this._session) {
            // Create a new session
            var session = MultiCursorSession.create(this._editor, findController);
            if (!session) {
                return;
            }
            this._session = session;
            var newState = { searchString: this._session.searchText };
            if (this._session.isDisconnectedFromFindController) {
                newState.wholeWordOverride = 1 /* True */;
                newState.matchCaseOverride = 1 /* True */;
                newState.isRegexOverride = 2 /* False */;
            }
            findController.getState().change(newState, false);
            this._sessionDispose = [
                this._editor.onDidChangeCursorSelection(function (e) {
                    if (_this._ignoreSelectionChange) {
                        return;
                    }
                    _this._endSession();
                }),
                this._editor.onDidBlurEditorText(function () {
                    _this._endSession();
                }),
                findController.getState().onFindReplaceStateChange(function (e) {
                    if (e.matchCase || e.wholeWord) {
                        _this._endSession();
                    }
                })
            ];
        }
    };
    MultiCursorSelectionController.prototype._endSession = function () {
        this._sessionDispose = dispose(this._sessionDispose);
        if (this._session && this._session.isDisconnectedFromFindController) {
            var newState = {
                wholeWordOverride: 0 /* NotSet */,
                matchCaseOverride: 0 /* NotSet */,
                isRegexOverride: 0 /* NotSet */,
            };
            this._session.findController.getState().change(newState, false);
        }
        this._session = null;
    };
    MultiCursorSelectionController.prototype._setSelections = function (selections) {
        this._ignoreSelectionChange = true;
        this._editor.setSelections(selections);
        this._ignoreSelectionChange = false;
    };
    MultiCursorSelectionController.prototype._expandEmptyToWord = function (model, selection) {
        if (!selection.isEmpty()) {
            return selection;
        }
        var word = model.getWordAtPosition(selection.getStartPosition());
        if (!word) {
            return selection;
        }
        return new Selection(selection.startLineNumber, word.startColumn, selection.startLineNumber, word.endColumn);
    };
    MultiCursorSelectionController.prototype._applySessionResult = function (result) {
        if (!result) {
            return;
        }
        this._setSelections(result.selections);
        if (result.revealRange) {
            this._editor.revealRangeInCenterIfOutsideViewport(result.revealRange, result.revealScrollType);
        }
    };
    MultiCursorSelectionController.prototype.getSession = function (findController) {
        return this._session;
    };
    MultiCursorSelectionController.prototype.addSelectionToNextFindMatch = function (findController) {
        if (!this._session) {
            // If there are multiple cursors, handle the case where they do not all select the same text.
            var allSelections = this._editor.getSelections();
            if (allSelections.length > 1) {
                var findState = findController.getState();
                var matchCase = findState.matchCase;
                var selectionsContainSameText = modelRangesContainSameText(this._editor.getModel(), allSelections, matchCase);
                if (!selectionsContainSameText) {
                    var model = this._editor.getModel();
                    var resultingSelections = [];
                    for (var i = 0, len = allSelections.length; i < len; i++) {
                        resultingSelections[i] = this._expandEmptyToWord(model, allSelections[i]);
                    }
                    this._editor.setSelections(resultingSelections);
                    return;
                }
            }
        }
        this._beginSessionIfNeeded(findController);
        if (this._session) {
            this._applySessionResult(this._session.addSelectionToNextFindMatch());
        }
    };
    MultiCursorSelectionController.prototype.addSelectionToPreviousFindMatch = function (findController) {
        this._beginSessionIfNeeded(findController);
        if (this._session) {
            this._applySessionResult(this._session.addSelectionToPreviousFindMatch());
        }
    };
    MultiCursorSelectionController.prototype.moveSelectionToNextFindMatch = function (findController) {
        this._beginSessionIfNeeded(findController);
        if (this._session) {
            this._applySessionResult(this._session.moveSelectionToNextFindMatch());
        }
    };
    MultiCursorSelectionController.prototype.moveSelectionToPreviousFindMatch = function (findController) {
        this._beginSessionIfNeeded(findController);
        if (this._session) {
            this._applySessionResult(this._session.moveSelectionToPreviousFindMatch());
        }
    };
    MultiCursorSelectionController.prototype.selectAll = function (findController) {
        var matches = null;
        var findState = findController.getState();
        // Special case: find widget owns entirely what we search for if:
        // - focus is not in the editor (i.e. it is in the find widget)
        // - and the search widget is visible
        // - and the search string is non-empty
        // - and we're searching for a regex
        if (findState.isRevealed && findState.searchString.length > 0 && findState.isRegex) {
            matches = this._editor.getModel().findMatches(findState.searchString, true, findState.isRegex, findState.matchCase, findState.wholeWord ? this._editor.getConfiguration().wordSeparators : null, false, 1073741824 /* MAX_SAFE_SMALL_INTEGER */);
        }
        else {
            this._beginSessionIfNeeded(findController);
            if (!this._session) {
                return;
            }
            matches = this._session.selectAll();
        }
        if (matches.length > 0) {
            var editorSelection = this._editor.getSelection();
            // Have the primary cursor remain the one where the action was invoked
            for (var i = 0, len = matches.length; i < len; i++) {
                var match = matches[i];
                var intersection = match.range.intersectRanges(editorSelection);
                if (intersection) {
                    // bingo!
                    matches[i] = matches[0];
                    matches[0] = match;
                    break;
                }
            }
            this._setSelections(matches.map(function (m) { return new Selection(m.range.startLineNumber, m.range.startColumn, m.range.endLineNumber, m.range.endColumn); }));
        }
    };
    MultiCursorSelectionController.ID = 'editor.contrib.multiCursorController';
    return MultiCursorSelectionController;
}(Disposable));
export { MultiCursorSelectionController };
var MultiCursorSelectionControllerAction = /** @class */ (function (_super) {
    __extends(MultiCursorSelectionControllerAction, _super);
    function MultiCursorSelectionControllerAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MultiCursorSelectionControllerAction.prototype.run = function (accessor, editor) {
        var multiCursorController = MultiCursorSelectionController.get(editor);
        if (!multiCursorController) {
            return;
        }
        var findController = CommonFindController.get(editor);
        if (!findController) {
            return null;
        }
        this._run(multiCursorController, findController);
    };
    return MultiCursorSelectionControllerAction;
}(EditorAction));
export { MultiCursorSelectionControllerAction };
var AddSelectionToNextFindMatchAction = /** @class */ (function (_super) {
    __extends(AddSelectionToNextFindMatchAction, _super);
    function AddSelectionToNextFindMatchAction() {
        return _super.call(this, {
            id: 'editor.action.addSelectionToNextFindMatch',
            label: nls.localize('addSelectionToNextFindMatch', "Add Selection To Next Find Match"),
            alias: 'Add Selection To Next Find Match',
            precondition: null,
            kbOpts: {
                kbExpr: EditorContextKeys.focus,
                primary: 2048 /* CtrlCmd */ | 34 /* KEY_D */,
                weight: 100 /* EditorContrib */
            },
            menubarOpts: {
                menuId: MenuId.MenubarSelectionMenu,
                group: '3_multi',
                title: nls.localize({ key: 'miAddSelectionToNextFindMatch', comment: ['&& denotes a mnemonic'] }, "Add &&Next Occurrence"),
                order: 5
            }
        }) || this;
    }
    AddSelectionToNextFindMatchAction.prototype._run = function (multiCursorController, findController) {
        multiCursorController.addSelectionToNextFindMatch(findController);
    };
    return AddSelectionToNextFindMatchAction;
}(MultiCursorSelectionControllerAction));
export { AddSelectionToNextFindMatchAction };
var AddSelectionToPreviousFindMatchAction = /** @class */ (function (_super) {
    __extends(AddSelectionToPreviousFindMatchAction, _super);
    function AddSelectionToPreviousFindMatchAction() {
        return _super.call(this, {
            id: 'editor.action.addSelectionToPreviousFindMatch',
            label: nls.localize('addSelectionToPreviousFindMatch', "Add Selection To Previous Find Match"),
            alias: 'Add Selection To Previous Find Match',
            precondition: null,
            menubarOpts: {
                menuId: MenuId.MenubarSelectionMenu,
                group: '3_multi',
                title: nls.localize({ key: 'miAddSelectionToPreviousFindMatch', comment: ['&& denotes a mnemonic'] }, "Add P&&revious Occurrence"),
                order: 6
            }
        }) || this;
    }
    AddSelectionToPreviousFindMatchAction.prototype._run = function (multiCursorController, findController) {
        multiCursorController.addSelectionToPreviousFindMatch(findController);
    };
    return AddSelectionToPreviousFindMatchAction;
}(MultiCursorSelectionControllerAction));
export { AddSelectionToPreviousFindMatchAction };
var MoveSelectionToNextFindMatchAction = /** @class */ (function (_super) {
    __extends(MoveSelectionToNextFindMatchAction, _super);
    function MoveSelectionToNextFindMatchAction() {
        return _super.call(this, {
            id: 'editor.action.moveSelectionToNextFindMatch',
            label: nls.localize('moveSelectionToNextFindMatch', "Move Last Selection To Next Find Match"),
            alias: 'Move Last Selection To Next Find Match',
            precondition: null,
            kbOpts: {
                kbExpr: EditorContextKeys.focus,
                primary: KeyChord(2048 /* CtrlCmd */ | 41 /* KEY_K */, 2048 /* CtrlCmd */ | 34 /* KEY_D */),
                weight: 100 /* EditorContrib */
            }
        }) || this;
    }
    MoveSelectionToNextFindMatchAction.prototype._run = function (multiCursorController, findController) {
        multiCursorController.moveSelectionToNextFindMatch(findController);
    };
    return MoveSelectionToNextFindMatchAction;
}(MultiCursorSelectionControllerAction));
export { MoveSelectionToNextFindMatchAction };
var MoveSelectionToPreviousFindMatchAction = /** @class */ (function (_super) {
    __extends(MoveSelectionToPreviousFindMatchAction, _super);
    function MoveSelectionToPreviousFindMatchAction() {
        return _super.call(this, {
            id: 'editor.action.moveSelectionToPreviousFindMatch',
            label: nls.localize('moveSelectionToPreviousFindMatch', "Move Last Selection To Previous Find Match"),
            alias: 'Move Last Selection To Previous Find Match',
            precondition: null
        }) || this;
    }
    MoveSelectionToPreviousFindMatchAction.prototype._run = function (multiCursorController, findController) {
        multiCursorController.moveSelectionToPreviousFindMatch(findController);
    };
    return MoveSelectionToPreviousFindMatchAction;
}(MultiCursorSelectionControllerAction));
export { MoveSelectionToPreviousFindMatchAction };
var SelectHighlightsAction = /** @class */ (function (_super) {
    __extends(SelectHighlightsAction, _super);
    function SelectHighlightsAction() {
        return _super.call(this, {
            id: 'editor.action.selectHighlights',
            label: nls.localize('selectAllOccurrencesOfFindMatch', "Select All Occurrences of Find Match"),
            alias: 'Select All Occurrences of Find Match',
            precondition: null,
            kbOpts: {
                kbExpr: EditorContextKeys.focus,
                primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 42 /* KEY_L */,
                weight: 100 /* EditorContrib */
            },
            menubarOpts: {
                menuId: MenuId.MenubarSelectionMenu,
                group: '3_multi',
                title: nls.localize({ key: 'miSelectHighlights', comment: ['&& denotes a mnemonic'] }, "Select All &&Occurrences"),
                order: 7
            }
        }) || this;
    }
    SelectHighlightsAction.prototype._run = function (multiCursorController, findController) {
        multiCursorController.selectAll(findController);
    };
    return SelectHighlightsAction;
}(MultiCursorSelectionControllerAction));
export { SelectHighlightsAction };
var CompatChangeAll = /** @class */ (function (_super) {
    __extends(CompatChangeAll, _super);
    function CompatChangeAll() {
        return _super.call(this, {
            id: 'editor.action.changeAll',
            label: nls.localize('changeAll.label', "Change All Occurrences"),
            alias: 'Change All Occurrences',
            precondition: EditorContextKeys.writable,
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: 2048 /* CtrlCmd */ | 60 /* F2 */,
                weight: 100 /* EditorContrib */
            },
            menuOpts: {
                group: '1_modification',
                order: 1.2
            }
        }) || this;
    }
    CompatChangeAll.prototype._run = function (multiCursorController, findController) {
        multiCursorController.selectAll(findController);
    };
    return CompatChangeAll;
}(MultiCursorSelectionControllerAction));
export { CompatChangeAll };
var SelectionHighlighterState = /** @class */ (function () {
    function SelectionHighlighterState(searchText, matchCase, wordSeparators) {
        this.searchText = searchText;
        this.matchCase = matchCase;
        this.wordSeparators = wordSeparators;
    }
    /**
     * Everything equals except for `lastWordUnderCursor`
     */
    SelectionHighlighterState.softEquals = function (a, b) {
        if (!a && !b) {
            return true;
        }
        if (!a || !b) {
            return false;
        }
        return (a.searchText === b.searchText
            && a.matchCase === b.matchCase
            && a.wordSeparators === b.wordSeparators);
    };
    return SelectionHighlighterState;
}());
var SelectionHighlighter = /** @class */ (function (_super) {
    __extends(SelectionHighlighter, _super);
    function SelectionHighlighter(editor) {
        var _this = _super.call(this) || this;
        _this.editor = editor;
        _this._isEnabled = editor.getConfiguration().contribInfo.selectionHighlight;
        _this.decorations = [];
        _this.updateSoon = _this._register(new RunOnceScheduler(function () { return _this._update(); }, 300));
        _this.state = null;
        _this._register(editor.onDidChangeConfiguration(function (e) {
            _this._isEnabled = editor.getConfiguration().contribInfo.selectionHighlight;
        }));
        _this._register(editor.onDidChangeCursorSelection(function (e) {
            if (!_this._isEnabled) {
                // Early exit if nothing needs to be done!
                // Leave some form of early exit check here if you wish to continue being a cursor position change listener ;)
                return;
            }
            if (e.selection.isEmpty()) {
                if (e.reason === CursorChangeReason.Explicit) {
                    if (_this.state) {
                        // no longer valid
                        _this._setState(null);
                    }
                    _this.updateSoon.schedule();
                }
                else {
                    _this._setState(null);
                }
            }
            else {
                _this._update();
            }
        }));
        _this._register(editor.onDidChangeModel(function (e) {
            _this._setState(null);
        }));
        _this._register(CommonFindController.get(editor).getState().onFindReplaceStateChange(function (e) {
            _this._update();
        }));
        return _this;
    }
    SelectionHighlighter.prototype.getId = function () {
        return SelectionHighlighter.ID;
    };
    SelectionHighlighter.prototype._update = function () {
        this._setState(SelectionHighlighter._createState(this._isEnabled, this.editor));
    };
    SelectionHighlighter._createState = function (isEnabled, editor) {
        if (!isEnabled) {
            return null;
        }
        var model = editor.getModel();
        if (!model) {
            return null;
        }
        var s = editor.getSelection();
        if (s.startLineNumber !== s.endLineNumber) {
            // multiline forbidden for perf reasons
            return null;
        }
        var multiCursorController = MultiCursorSelectionController.get(editor);
        if (!multiCursorController) {
            return null;
        }
        var findController = CommonFindController.get(editor);
        if (!findController) {
            return null;
        }
        var r = multiCursorController.getSession(findController);
        if (!r) {
            var allSelections = editor.getSelections();
            if (allSelections.length > 1) {
                var findState_1 = findController.getState();
                var matchCase = findState_1.matchCase;
                var selectionsContainSameText = modelRangesContainSameText(editor.getModel(), allSelections, matchCase);
                if (!selectionsContainSameText) {
                    return null;
                }
            }
            r = MultiCursorSession.create(editor, findController);
        }
        if (!r) {
            return null;
        }
        if (r.currentMatch) {
            // This is an empty selection
            // Do not interfere with semantic word highlighting in the no selection case
            return null;
        }
        if (/^[ \t]+$/.test(r.searchText)) {
            // whitespace only selection
            return null;
        }
        if (r.searchText.length > 200) {
            // very long selection
            return null;
        }
        // TODO: better handling of this case
        var findState = findController.getState();
        var caseSensitive = findState.matchCase;
        // Return early if the find widget shows the exact same matches
        if (findState.isRevealed) {
            var findStateSearchString = findState.searchString;
            if (!caseSensitive) {
                findStateSearchString = findStateSearchString.toLowerCase();
            }
            var mySearchString = r.searchText;
            if (!caseSensitive) {
                mySearchString = mySearchString.toLowerCase();
            }
            if (findStateSearchString === mySearchString && r.matchCase === findState.matchCase && r.wholeWord === findState.wholeWord && !findState.isRegex) {
                return null;
            }
        }
        return new SelectionHighlighterState(r.searchText, r.matchCase, r.wholeWord ? editor.getConfiguration().wordSeparators : null);
    };
    SelectionHighlighter.prototype._setState = function (state) {
        if (SelectionHighlighterState.softEquals(this.state, state)) {
            this.state = state;
            return;
        }
        this.state = state;
        if (!this.state) {
            this.decorations = this.editor.deltaDecorations(this.decorations, []);
            return;
        }
        var model = this.editor.getModel();
        if (model.isTooLargeForTokenization()) {
            // the file is too large, so searching word under cursor in the whole document takes is blocking the UI.
            return;
        }
        var hasFindOccurrences = DocumentHighlightProviderRegistry.has(model);
        var allMatches = model.findMatches(this.state.searchText, true, false, this.state.matchCase, this.state.wordSeparators, false).map(function (m) { return m.range; });
        allMatches.sort(Range.compareRangesUsingStarts);
        var selections = this.editor.getSelections();
        selections.sort(Range.compareRangesUsingStarts);
        // do not overlap with selection (issue #64 and #512)
        var matches = [];
        for (var i = 0, j = 0, len = allMatches.length, lenJ = selections.length; i < len;) {
            var match = allMatches[i];
            if (j >= lenJ) {
                // finished all editor selections
                matches.push(match);
                i++;
            }
            else {
                var cmp = Range.compareRangesUsingStarts(match, selections[j]);
                if (cmp < 0) {
                    // match is before sel
                    if (selections[j].isEmpty() || !Range.areIntersecting(match, selections[j])) {
                        matches.push(match);
                    }
                    i++;
                }
                else if (cmp > 0) {
                    // sel is before match
                    j++;
                }
                else {
                    // sel is equal to match
                    i++;
                    j++;
                }
            }
        }
        var decorations = matches.map(function (r) {
            return {
                range: r,
                // Show in overviewRuler only if model has no semantic highlighting
                options: (hasFindOccurrences ? SelectionHighlighter._SELECTION_HIGHLIGHT : SelectionHighlighter._SELECTION_HIGHLIGHT_OVERVIEW)
            };
        });
        this.decorations = this.editor.deltaDecorations(this.decorations, decorations);
    };
    SelectionHighlighter.prototype.dispose = function () {
        this._setState(null);
        _super.prototype.dispose.call(this);
    };
    SelectionHighlighter.ID = 'editor.contrib.selectionHighlighter';
    SelectionHighlighter._SELECTION_HIGHLIGHT_OVERVIEW = ModelDecorationOptions.register({
        stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
        className: 'selectionHighlight',
        overviewRuler: {
            color: themeColorFromId(overviewRulerSelectionHighlightForeground),
            position: OverviewRulerLane.Center
        }
    });
    SelectionHighlighter._SELECTION_HIGHLIGHT = ModelDecorationOptions.register({
        stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
        className: 'selectionHighlight',
    });
    return SelectionHighlighter;
}(Disposable));
export { SelectionHighlighter };
function modelRangesContainSameText(model, ranges, matchCase) {
    var selectedText = getValueInRange(model, ranges[0], !matchCase);
    for (var i = 1, len = ranges.length; i < len; i++) {
        var range = ranges[i];
        if (range.isEmpty()) {
            return false;
        }
        var thisSelectedText = getValueInRange(model, range, !matchCase);
        if (selectedText !== thisSelectedText) {
            return false;
        }
    }
    return true;
}
function getValueInRange(model, range, toLowerCase) {
    var text = model.getValueInRange(range);
    return (toLowerCase ? text.toLowerCase() : text);
}
registerEditorContribution(MultiCursorSelectionController);
registerEditorContribution(SelectionHighlighter);
registerEditorAction(InsertCursorAbove);
registerEditorAction(InsertCursorBelow);
registerEditorAction(InsertCursorAtEndOfEachLineSelected);
registerEditorAction(AddSelectionToNextFindMatchAction);
registerEditorAction(AddSelectionToPreviousFindMatchAction);
registerEditorAction(MoveSelectionToNextFindMatchAction);
registerEditorAction(MoveSelectionToPreviousFindMatchAction);
registerEditorAction(SelectHighlightsAction);
registerEditorAction(CompatChangeAll);
