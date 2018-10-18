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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import * as nls from '../../../nls';
import { Disposable } from '../../../base/common/lifecycle';
import { IContextKeyService } from '../../../platform/contextkey/common/contextkey';
import * as strings from '../../../base/common/strings';
import { registerEditorContribution, registerEditorAction, EditorAction, EditorCommand, registerEditorCommand } from '../../browser/editorExtensions';
import { FIND_IDS, FindModelBoundToEditorModel, ToggleCaseSensitiveKeybinding, ToggleRegexKeybinding, ToggleWholeWordKeybinding, ToggleSearchScopeKeybinding, CONTEXT_FIND_WIDGET_VISIBLE, CONTEXT_FIND_INPUT_FOCUSED } from './findModel';
import { FindReplaceState } from './findState';
import { Delayer } from '../../../base/common/async';
import { EditorContextKeys } from '../../common/editorContextKeys';
import { IStorageService } from '../../../platform/storage/common/storage';
import { IClipboardService } from '../../../platform/clipboard/common/clipboardService';
import { IContextViewService } from '../../../platform/contextview/browser/contextView';
import { IKeybindingService } from '../../../platform/keybinding/common/keybinding';
import { FindWidget } from './findWidget';
import { FindOptionsWidget } from './findOptionsWidget';
import { IThemeService } from '../../../platform/theme/common/themeService';
import { optional } from '../../../platform/instantiation/common/instantiation';
import { MenuId } from '../../../platform/actions/common/actions';
var SEARCH_STRING_MAX_LENGTH = 524288;
export function getSelectionSearchString(editor) {
    var selection = editor.getSelection();
    // if selection spans multiple lines, default search string to empty
    if (selection.startLineNumber === selection.endLineNumber) {
        if (selection.isEmpty()) {
            var wordAtPosition = editor.getModel().getWordAtPosition(selection.getStartPosition());
            if (wordAtPosition) {
                return wordAtPosition.word;
            }
        }
        else {
            if (editor.getModel().getValueLengthInRange(selection) < SEARCH_STRING_MAX_LENGTH) {
                return editor.getModel().getValueInRange(selection);
            }
        }
    }
    return null;
}
var CommonFindController = /** @class */ (function (_super) {
    __extends(CommonFindController, _super);
    function CommonFindController(editor, contextKeyService, storageService, clipboardService) {
        var _this = _super.call(this) || this;
        _this._editor = editor;
        _this._findWidgetVisible = CONTEXT_FIND_WIDGET_VISIBLE.bindTo(contextKeyService);
        _this._contextKeyService = contextKeyService;
        _this._storageService = storageService;
        _this._clipboardService = clipboardService;
        _this._updateHistoryDelayer = new Delayer(500);
        _this._state = _this._register(new FindReplaceState());
        _this.loadQueryState();
        _this._register(_this._state.onFindReplaceStateChange(function (e) { return _this._onStateChanged(e); }));
        _this._model = null;
        _this._register(_this._editor.onDidChangeModel(function () {
            var shouldRestartFind = (_this._editor.getModel() && _this._state.isRevealed);
            _this.disposeModel();
            _this._state.change({
                searchScope: null,
                matchCase: _this._storageService.getBoolean('editor.matchCase', 1 /* WORKSPACE */, false),
                wholeWord: _this._storageService.getBoolean('editor.wholeWord', 1 /* WORKSPACE */, false),
                isRegex: _this._storageService.getBoolean('editor.isRegex', 1 /* WORKSPACE */, false)
            }, false);
            if (shouldRestartFind) {
                _this._start({
                    forceRevealReplace: false,
                    seedSearchStringFromSelection: false && _this._editor.getConfiguration().contribInfo.find.seedSearchStringFromSelection,
                    seedSearchStringFromGlobalClipboard: false,
                    shouldFocus: 0 /* NoFocusChange */,
                    shouldAnimate: false,
                    updateSearchScope: false
                });
            }
        }));
        return _this;
    }
    CommonFindController.get = function (editor) {
        return editor.getContribution(CommonFindController.ID);
    };
    CommonFindController.prototype.dispose = function () {
        this.disposeModel();
        _super.prototype.dispose.call(this);
    };
    CommonFindController.prototype.disposeModel = function () {
        if (this._model) {
            this._model.dispose();
            this._model = null;
        }
    };
    CommonFindController.prototype.getId = function () {
        return CommonFindController.ID;
    };
    CommonFindController.prototype._onStateChanged = function (e) {
        this.saveQueryState(e);
        if (e.isRevealed) {
            if (this._state.isRevealed) {
                this._findWidgetVisible.set(true);
            }
            else {
                this._findWidgetVisible.reset();
                this.disposeModel();
            }
        }
        if (e.searchString) {
            this.setGlobalBufferTerm(this._state.searchString);
        }
    };
    CommonFindController.prototype.saveQueryState = function (e) {
        if (e.isRegex) {
            this._storageService.store('editor.isRegex', this._state.actualIsRegex, 1 /* WORKSPACE */);
        }
        if (e.wholeWord) {
            this._storageService.store('editor.wholeWord', this._state.actualWholeWord, 1 /* WORKSPACE */);
        }
        if (e.matchCase) {
            this._storageService.store('editor.matchCase', this._state.actualMatchCase, 1 /* WORKSPACE */);
        }
    };
    CommonFindController.prototype.loadQueryState = function () {
        this._state.change({
            matchCase: this._storageService.getBoolean('editor.matchCase', 1 /* WORKSPACE */, this._state.matchCase),
            wholeWord: this._storageService.getBoolean('editor.wholeWord', 1 /* WORKSPACE */, this._state.wholeWord),
            isRegex: this._storageService.getBoolean('editor.isRegex', 1 /* WORKSPACE */, this._state.isRegex)
        }, false);
    };
    CommonFindController.prototype.isFindInputFocused = function () {
        return CONTEXT_FIND_INPUT_FOCUSED.getValue(this._contextKeyService);
    };
    CommonFindController.prototype.getState = function () {
        return this._state;
    };
    CommonFindController.prototype.closeFindWidget = function () {
        this._state.change({
            isRevealed: false,
            searchScope: null
        }, false);
        this._editor.focus();
    };
    CommonFindController.prototype.toggleCaseSensitive = function () {
        this._state.change({ matchCase: !this._state.matchCase }, false);
        if (!this._state.isRevealed) {
            this.highlightFindOptions();
        }
    };
    CommonFindController.prototype.toggleWholeWords = function () {
        this._state.change({ wholeWord: !this._state.wholeWord }, false);
        if (!this._state.isRevealed) {
            this.highlightFindOptions();
        }
    };
    CommonFindController.prototype.toggleRegex = function () {
        this._state.change({ isRegex: !this._state.isRegex }, false);
        if (!this._state.isRevealed) {
            this.highlightFindOptions();
        }
    };
    CommonFindController.prototype.toggleSearchScope = function () {
        if (this._state.searchScope) {
            this._state.change({ searchScope: null }, true);
        }
        else {
            var selection = this._editor.getSelection();
            if (selection.endColumn === 1 && selection.endLineNumber > selection.startLineNumber) {
                selection = selection.setEndPosition(selection.endLineNumber - 1, this._editor.getModel().getLineMaxColumn(selection.endLineNumber - 1));
            }
            if (!selection.isEmpty()) {
                this._state.change({ searchScope: selection }, true);
            }
        }
    };
    CommonFindController.prototype.setSearchString = function (searchString) {
        if (this._state.isRegex) {
            searchString = strings.escapeRegExpCharacters(searchString);
        }
        this._state.change({ searchString: searchString }, false);
    };
    CommonFindController.prototype.highlightFindOptions = function () {
        // overwritten in subclass
    };
    CommonFindController.prototype._start = function (opts) {
        this.disposeModel();
        if (!this._editor.getModel()) {
            // cannot do anything with an editor that doesn't have a model...
            return;
        }
        var stateChanges = {
            isRevealed: true
        };
        if (opts.seedSearchStringFromSelection) {
            var selectionSearchString = getSelectionSearchString(this._editor);
            if (selectionSearchString) {
                if (this._state.isRegex) {
                    stateChanges.searchString = strings.escapeRegExpCharacters(selectionSearchString);
                }
                else {
                    stateChanges.searchString = selectionSearchString;
                }
            }
        }
        if (!stateChanges.searchString && opts.seedSearchStringFromGlobalClipboard) {
            var selectionSearchString = this.getGlobalBufferTerm();
            if (selectionSearchString) {
                stateChanges.searchString = selectionSearchString;
            }
        }
        // Overwrite isReplaceRevealed
        if (opts.forceRevealReplace) {
            stateChanges.isReplaceRevealed = true;
        }
        else if (!this._findWidgetVisible.get()) {
            stateChanges.isReplaceRevealed = false;
        }
        if (opts.updateSearchScope) {
            var currentSelection = this._editor.getSelection();
            if (!currentSelection.isEmpty()) {
                stateChanges.searchScope = currentSelection;
            }
        }
        this._state.change(stateChanges, false);
        if (!this._model) {
            this._model = new FindModelBoundToEditorModel(this._editor, this._state);
        }
    };
    CommonFindController.prototype.start = function (opts) {
        this._start(opts);
    };
    CommonFindController.prototype.moveToNextMatch = function () {
        if (this._model) {
            this._model.moveToNextMatch();
            return true;
        }
        return false;
    };
    CommonFindController.prototype.moveToPrevMatch = function () {
        if (this._model) {
            this._model.moveToPrevMatch();
            return true;
        }
        return false;
    };
    CommonFindController.prototype.replace = function () {
        if (this._model) {
            this._model.replace();
            return true;
        }
        return false;
    };
    CommonFindController.prototype.replaceAll = function () {
        if (this._model) {
            this._model.replaceAll();
            return true;
        }
        return false;
    };
    CommonFindController.prototype.selectAllMatches = function () {
        if (this._model) {
            this._model.selectAllMatches();
            this._editor.focus();
            return true;
        }
        return false;
    };
    CommonFindController.prototype.getGlobalBufferTerm = function () {
        if (this._editor.getConfiguration().contribInfo.find.globalFindClipboard
            && this._clipboardService
            && !this._editor.getModel().isTooLargeForSyncing()) {
            return this._clipboardService.readFindText();
        }
        return '';
    };
    CommonFindController.prototype.setGlobalBufferTerm = function (text) {
        if (this._editor.getConfiguration().contribInfo.find.globalFindClipboard
            && this._clipboardService
            && !this._editor.getModel().isTooLargeForSyncing()) {
            this._clipboardService.writeFindText(text);
        }
    };
    CommonFindController.ID = 'editor.contrib.findController';
    CommonFindController = __decorate([
        __param(1, IContextKeyService),
        __param(2, IStorageService),
        __param(3, IClipboardService)
    ], CommonFindController);
    return CommonFindController;
}(Disposable));
export { CommonFindController };
var FindController = /** @class */ (function (_super) {
    __extends(FindController, _super);
    function FindController(editor, _contextViewService, _contextKeyService, _keybindingService, _themeService, storageService, clipboardService) {
        var _this = _super.call(this, editor, _contextKeyService, storageService, clipboardService) || this;
        _this._contextViewService = _contextViewService;
        _this._keybindingService = _keybindingService;
        _this._themeService = _themeService;
        return _this;
    }
    FindController.prototype._start = function (opts) {
        if (!this._widget) {
            this._createFindWidget();
        }
        if (!this._widget.getPosition() && this._editor.getConfiguration().contribInfo.find.autoFindInSelection) {
            // not visible yet so we need to set search scope if `editor.find.autoFindInSelection` is `true`
            opts.updateSearchScope = true;
        }
        _super.prototype._start.call(this, opts);
        if (opts.shouldFocus === 2 /* FocusReplaceInput */) {
            this._widget.focusReplaceInput();
        }
        else if (opts.shouldFocus === 1 /* FocusFindInput */) {
            this._widget.focusFindInput();
        }
    };
    FindController.prototype.highlightFindOptions = function () {
        if (!this._widget) {
            this._createFindWidget();
        }
        if (this._state.isRevealed) {
            this._widget.highlightFindOptions();
        }
        else {
            this._findOptionsWidget.highlightFindOptions();
        }
    };
    FindController.prototype._createFindWidget = function () {
        this._widget = this._register(new FindWidget(this._editor, this, this._state, this._contextViewService, this._keybindingService, this._contextKeyService, this._themeService));
        this._findOptionsWidget = this._register(new FindOptionsWidget(this._editor, this._state, this._keybindingService, this._themeService));
    };
    FindController = __decorate([
        __param(1, IContextViewService),
        __param(2, IContextKeyService),
        __param(3, IKeybindingService),
        __param(4, IThemeService),
        __param(5, IStorageService),
        __param(6, optional(IClipboardService))
    ], FindController);
    return FindController;
}(CommonFindController));
export { FindController };
var StartFindAction = /** @class */ (function (_super) {
    __extends(StartFindAction, _super);
    function StartFindAction() {
        return _super.call(this, {
            id: FIND_IDS.StartFindAction,
            label: nls.localize('startFindAction', "Find"),
            alias: 'Find',
            precondition: null,
            kbOpts: {
                kbExpr: null,
                primary: 2048 /* CtrlCmd */ | 36 /* KEY_F */,
                weight: 100 /* EditorContrib */
            },
            menubarOpts: {
                menuId: MenuId.MenubarEditMenu,
                group: '3_find',
                title: nls.localize({ key: 'miFind', comment: ['&& denotes a mnemonic'] }, "&&Find"),
                order: 1
            }
        }) || this;
    }
    StartFindAction.prototype.run = function (accessor, editor) {
        var controller = CommonFindController.get(editor);
        if (controller) {
            controller.start({
                forceRevealReplace: false,
                seedSearchStringFromSelection: editor.getConfiguration().contribInfo.find.seedSearchStringFromSelection,
                seedSearchStringFromGlobalClipboard: editor.getConfiguration().contribInfo.find.globalFindClipboard,
                shouldFocus: 1 /* FocusFindInput */,
                shouldAnimate: true,
                updateSearchScope: false
            });
        }
    };
    return StartFindAction;
}(EditorAction));
export { StartFindAction };
var StartFindWithSelectionAction = /** @class */ (function (_super) {
    __extends(StartFindWithSelectionAction, _super);
    function StartFindWithSelectionAction() {
        return _super.call(this, {
            id: FIND_IDS.StartFindWithSelection,
            label: nls.localize('startFindWithSelectionAction', "Find With Selection"),
            alias: 'Find With Selection',
            precondition: null,
            kbOpts: {
                kbExpr: null,
                primary: null,
                mac: {
                    primary: 2048 /* CtrlCmd */ | 35 /* KEY_E */,
                },
                weight: 100 /* EditorContrib */
            }
        }) || this;
    }
    StartFindWithSelectionAction.prototype.run = function (accessor, editor) {
        var controller = CommonFindController.get(editor);
        if (controller) {
            controller.start({
                forceRevealReplace: false,
                seedSearchStringFromSelection: true,
                seedSearchStringFromGlobalClipboard: false,
                shouldFocus: 1 /* FocusFindInput */,
                shouldAnimate: true,
                updateSearchScope: false
            });
            controller.setGlobalBufferTerm(controller.getState().searchString);
        }
    };
    return StartFindWithSelectionAction;
}(EditorAction));
export { StartFindWithSelectionAction };
var MatchFindAction = /** @class */ (function (_super) {
    __extends(MatchFindAction, _super);
    function MatchFindAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MatchFindAction.prototype.run = function (accessor, editor) {
        var controller = CommonFindController.get(editor);
        if (controller && !this._run(controller)) {
            controller.start({
                forceRevealReplace: false,
                seedSearchStringFromSelection: (controller.getState().searchString.length === 0) && editor.getConfiguration().contribInfo.find.seedSearchStringFromSelection,
                seedSearchStringFromGlobalClipboard: true,
                shouldFocus: 0 /* NoFocusChange */,
                shouldAnimate: true,
                updateSearchScope: false
            });
            this._run(controller);
        }
    };
    return MatchFindAction;
}(EditorAction));
export { MatchFindAction };
var NextMatchFindAction = /** @class */ (function (_super) {
    __extends(NextMatchFindAction, _super);
    function NextMatchFindAction() {
        return _super.call(this, {
            id: FIND_IDS.NextMatchFindAction,
            label: nls.localize('findNextMatchAction', "Find Next"),
            alias: 'Find Next',
            precondition: null,
            kbOpts: {
                kbExpr: EditorContextKeys.focus,
                primary: 61 /* F3 */,
                mac: { primary: 2048 /* CtrlCmd */ | 37 /* KEY_G */, secondary: [61 /* F3 */] },
                weight: 100 /* EditorContrib */
            }
        }) || this;
    }
    NextMatchFindAction.prototype._run = function (controller) {
        return controller.moveToNextMatch();
    };
    return NextMatchFindAction;
}(MatchFindAction));
export { NextMatchFindAction };
var PreviousMatchFindAction = /** @class */ (function (_super) {
    __extends(PreviousMatchFindAction, _super);
    function PreviousMatchFindAction() {
        return _super.call(this, {
            id: FIND_IDS.PreviousMatchFindAction,
            label: nls.localize('findPreviousMatchAction', "Find Previous"),
            alias: 'Find Previous',
            precondition: null,
            kbOpts: {
                kbExpr: EditorContextKeys.focus,
                primary: 1024 /* Shift */ | 61 /* F3 */,
                mac: { primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 37 /* KEY_G */, secondary: [1024 /* Shift */ | 61 /* F3 */] },
                weight: 100 /* EditorContrib */
            }
        }) || this;
    }
    PreviousMatchFindAction.prototype._run = function (controller) {
        return controller.moveToPrevMatch();
    };
    return PreviousMatchFindAction;
}(MatchFindAction));
export { PreviousMatchFindAction };
var SelectionMatchFindAction = /** @class */ (function (_super) {
    __extends(SelectionMatchFindAction, _super);
    function SelectionMatchFindAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SelectionMatchFindAction.prototype.run = function (accessor, editor) {
        var controller = CommonFindController.get(editor);
        if (!controller) {
            return;
        }
        var selectionSearchString = getSelectionSearchString(editor);
        if (selectionSearchString) {
            controller.setSearchString(selectionSearchString);
        }
        if (!this._run(controller)) {
            controller.start({
                forceRevealReplace: false,
                seedSearchStringFromSelection: editor.getConfiguration().contribInfo.find.seedSearchStringFromSelection,
                seedSearchStringFromGlobalClipboard: false,
                shouldFocus: 0 /* NoFocusChange */,
                shouldAnimate: true,
                updateSearchScope: false
            });
            this._run(controller);
        }
    };
    return SelectionMatchFindAction;
}(EditorAction));
export { SelectionMatchFindAction };
var NextSelectionMatchFindAction = /** @class */ (function (_super) {
    __extends(NextSelectionMatchFindAction, _super);
    function NextSelectionMatchFindAction() {
        return _super.call(this, {
            id: FIND_IDS.NextSelectionMatchFindAction,
            label: nls.localize('nextSelectionMatchFindAction', "Find Next Selection"),
            alias: 'Find Next Selection',
            precondition: null,
            kbOpts: {
                kbExpr: EditorContextKeys.focus,
                primary: 2048 /* CtrlCmd */ | 61 /* F3 */,
                weight: 100 /* EditorContrib */
            }
        }) || this;
    }
    NextSelectionMatchFindAction.prototype._run = function (controller) {
        return controller.moveToNextMatch();
    };
    return NextSelectionMatchFindAction;
}(SelectionMatchFindAction));
export { NextSelectionMatchFindAction };
var PreviousSelectionMatchFindAction = /** @class */ (function (_super) {
    __extends(PreviousSelectionMatchFindAction, _super);
    function PreviousSelectionMatchFindAction() {
        return _super.call(this, {
            id: FIND_IDS.PreviousSelectionMatchFindAction,
            label: nls.localize('previousSelectionMatchFindAction', "Find Previous Selection"),
            alias: 'Find Previous Selection',
            precondition: null,
            kbOpts: {
                kbExpr: EditorContextKeys.focus,
                primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 61 /* F3 */,
                weight: 100 /* EditorContrib */
            }
        }) || this;
    }
    PreviousSelectionMatchFindAction.prototype._run = function (controller) {
        return controller.moveToPrevMatch();
    };
    return PreviousSelectionMatchFindAction;
}(SelectionMatchFindAction));
export { PreviousSelectionMatchFindAction };
var StartFindReplaceAction = /** @class */ (function (_super) {
    __extends(StartFindReplaceAction, _super);
    function StartFindReplaceAction() {
        return _super.call(this, {
            id: FIND_IDS.StartFindReplaceAction,
            label: nls.localize('startReplace', "Replace"),
            alias: 'Replace',
            precondition: null,
            kbOpts: {
                kbExpr: null,
                primary: 2048 /* CtrlCmd */ | 38 /* KEY_H */,
                mac: { primary: 2048 /* CtrlCmd */ | 512 /* Alt */ | 36 /* KEY_F */ },
                weight: 100 /* EditorContrib */
            },
            menubarOpts: {
                menuId: MenuId.MenubarEditMenu,
                group: '3_find',
                title: nls.localize({ key: 'miReplace', comment: ['&& denotes a mnemonic'] }, "&&Replace"),
                order: 2
            }
        }) || this;
    }
    StartFindReplaceAction.prototype.run = function (accessor, editor) {
        if (editor.getConfiguration().readOnly) {
            return;
        }
        var controller = CommonFindController.get(editor);
        var currentSelection = editor.getSelection();
        var findInputFocused = controller.isFindInputFocused();
        // we only seed search string from selection when the current selection is single line and not empty,
        // + the find input is not focused
        var seedSearchStringFromSelection = !currentSelection.isEmpty()
            && currentSelection.startLineNumber === currentSelection.endLineNumber && editor.getConfiguration().contribInfo.find.seedSearchStringFromSelection
            && !findInputFocused;
        /*
         * if the existing search string in find widget is empty and we don't seed search string from selection, it means the Find Input is still empty, so we should focus the Find Input instead of Replace Input.

         * findInputFocused true -> seedSearchStringFromSelection false, FocusReplaceInput
         * findInputFocused false, seedSearchStringFromSelection true FocusReplaceInput
         * findInputFocused false seedSearchStringFromSelection false FocusFindInput
         */
        var shouldFocus = (findInputFocused || seedSearchStringFromSelection) ?
            2 /* FocusReplaceInput */ : 1 /* FocusFindInput */;
        if (controller) {
            controller.start({
                forceRevealReplace: true,
                seedSearchStringFromSelection: seedSearchStringFromSelection,
                seedSearchStringFromGlobalClipboard: editor.getConfiguration().contribInfo.find.seedSearchStringFromSelection,
                shouldFocus: shouldFocus,
                shouldAnimate: true,
                updateSearchScope: false
            });
        }
    };
    return StartFindReplaceAction;
}(EditorAction));
export { StartFindReplaceAction };
registerEditorContribution(FindController);
registerEditorAction(StartFindAction);
registerEditorAction(StartFindWithSelectionAction);
registerEditorAction(NextMatchFindAction);
registerEditorAction(PreviousMatchFindAction);
registerEditorAction(NextSelectionMatchFindAction);
registerEditorAction(PreviousSelectionMatchFindAction);
registerEditorAction(StartFindReplaceAction);
var FindCommand = EditorCommand.bindToContribution(CommonFindController.get);
registerEditorCommand(new FindCommand({
    id: FIND_IDS.CloseFindWidgetCommand,
    precondition: CONTEXT_FIND_WIDGET_VISIBLE,
    handler: function (x) { return x.closeFindWidget(); },
    kbOpts: {
        weight: 100 /* EditorContrib */ + 5,
        kbExpr: EditorContextKeys.focus,
        primary: 9 /* Escape */,
        secondary: [1024 /* Shift */ | 9 /* Escape */]
    }
}));
registerEditorCommand(new FindCommand({
    id: FIND_IDS.ToggleCaseSensitiveCommand,
    precondition: null,
    handler: function (x) { return x.toggleCaseSensitive(); },
    kbOpts: {
        weight: 100 /* EditorContrib */ + 5,
        kbExpr: EditorContextKeys.focus,
        primary: ToggleCaseSensitiveKeybinding.primary,
        mac: ToggleCaseSensitiveKeybinding.mac,
        win: ToggleCaseSensitiveKeybinding.win,
        linux: ToggleCaseSensitiveKeybinding.linux
    }
}));
registerEditorCommand(new FindCommand({
    id: FIND_IDS.ToggleWholeWordCommand,
    precondition: null,
    handler: function (x) { return x.toggleWholeWords(); },
    kbOpts: {
        weight: 100 /* EditorContrib */ + 5,
        kbExpr: EditorContextKeys.focus,
        primary: ToggleWholeWordKeybinding.primary,
        mac: ToggleWholeWordKeybinding.mac,
        win: ToggleWholeWordKeybinding.win,
        linux: ToggleWholeWordKeybinding.linux
    }
}));
registerEditorCommand(new FindCommand({
    id: FIND_IDS.ToggleRegexCommand,
    precondition: null,
    handler: function (x) { return x.toggleRegex(); },
    kbOpts: {
        weight: 100 /* EditorContrib */ + 5,
        kbExpr: EditorContextKeys.focus,
        primary: ToggleRegexKeybinding.primary,
        mac: ToggleRegexKeybinding.mac,
        win: ToggleRegexKeybinding.win,
        linux: ToggleRegexKeybinding.linux
    }
}));
registerEditorCommand(new FindCommand({
    id: FIND_IDS.ToggleSearchScopeCommand,
    precondition: null,
    handler: function (x) { return x.toggleSearchScope(); },
    kbOpts: {
        weight: 100 /* EditorContrib */ + 5,
        kbExpr: EditorContextKeys.focus,
        primary: ToggleSearchScopeKeybinding.primary,
        mac: ToggleSearchScopeKeybinding.mac,
        win: ToggleSearchScopeKeybinding.win,
        linux: ToggleSearchScopeKeybinding.linux
    }
}));
registerEditorCommand(new FindCommand({
    id: FIND_IDS.ReplaceOneAction,
    precondition: CONTEXT_FIND_WIDGET_VISIBLE,
    handler: function (x) { return x.replace(); },
    kbOpts: {
        weight: 100 /* EditorContrib */ + 5,
        kbExpr: EditorContextKeys.focus,
        primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 22 /* KEY_1 */
    }
}));
registerEditorCommand(new FindCommand({
    id: FIND_IDS.ReplaceAllAction,
    precondition: CONTEXT_FIND_WIDGET_VISIBLE,
    handler: function (x) { return x.replaceAll(); },
    kbOpts: {
        weight: 100 /* EditorContrib */ + 5,
        kbExpr: EditorContextKeys.focus,
        primary: 2048 /* CtrlCmd */ | 512 /* Alt */ | 3 /* Enter */
    }
}));
registerEditorCommand(new FindCommand({
    id: FIND_IDS.SelectAllMatchesAction,
    precondition: CONTEXT_FIND_WIDGET_VISIBLE,
    handler: function (x) { return x.selectAllMatches(); },
    kbOpts: {
        weight: 100 /* EditorContrib */ + 5,
        kbExpr: EditorContextKeys.focus,
        primary: 512 /* Alt */ | 3 /* Enter */
    }
}));
