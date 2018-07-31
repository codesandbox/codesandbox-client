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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import * as nls from '../../../nls.js';
import { onUnexpectedError } from '../../../base/common/errors.js';
import { isFalsyOrEmpty } from '../../../base/common/arrays.js';
import { dispose } from '../../../base/common/lifecycle.js';
import { IInstantiationService } from '../../../platform/instantiation/common/instantiation.js';
import { ContextKeyExpr, IContextKeyService } from '../../../platform/contextkey/common/contextkey.js';
import { ICommandService } from '../../../platform/commands/common/commands.js';
import { EditorContextKeys } from '../../common/editorContextKeys.js';
import { registerEditorAction, registerEditorContribution, EditorAction, EditorCommand, registerEditorCommand } from '../../browser/editorExtensions.js';
import { alert } from '../../../base/browser/ui/aria/aria.js';
import { EditOperation } from '../../common/core/editOperation.js';
import { Range } from '../../common/core/range.js';
import { SnippetParser } from '../snippet/snippetParser.js';
import { SnippetController2 } from '../snippet/snippetController2.js';
import { Context as SuggestContext } from './suggest.js';
import { SuggestModel } from './suggestModel.js';
import { SuggestWidget } from './suggestWidget.js';
import { KeybindingsRegistry } from '../../../platform/keybinding/common/keybindingsRegistry.js';
import { SuggestMemories } from './suggestMemory.js';
var AcceptOnCharacterOracle = /** @class */ (function () {
    function AcceptOnCharacterOracle(editor, widget, accept) {
        var _this = this;
        this._disposables = [];
        this._activeAcceptCharacters = new Set();
        this._disposables.push(widget.onDidShow(function () { return _this._onItem(widget.getFocusedItem()); }));
        this._disposables.push(widget.onDidFocus(this._onItem, this));
        this._disposables.push(widget.onDidHide(this.reset, this));
        this._disposables.push(editor.onWillType(function (text) {
            if (_this._activeItem) {
                var ch = text[text.length - 1];
                if (_this._activeAcceptCharacters.has(ch) && editor.getConfiguration().contribInfo.acceptSuggestionOnCommitCharacter) {
                    accept(_this._activeItem);
                }
            }
        }));
    }
    AcceptOnCharacterOracle.prototype._onItem = function (selected) {
        if (!selected || isFalsyOrEmpty(selected.item.suggestion.commitCharacters)) {
            this.reset();
            return;
        }
        this._activeItem = selected;
        this._activeAcceptCharacters.clear();
        for (var _i = 0, _a = selected.item.suggestion.commitCharacters; _i < _a.length; _i++) {
            var ch = _a[_i];
            if (ch.length > 0) {
                this._activeAcceptCharacters.add(ch[0]);
            }
        }
    };
    AcceptOnCharacterOracle.prototype.reset = function () {
        this._activeItem = undefined;
    };
    AcceptOnCharacterOracle.prototype.dispose = function () {
        dispose(this._disposables);
    };
    return AcceptOnCharacterOracle;
}());
var SuggestController = /** @class */ (function () {
    function SuggestController(_editor, _commandService, _contextKeyService, _instantiationService) {
        var _this = this;
        this._editor = _editor;
        this._commandService = _commandService;
        this._contextKeyService = _contextKeyService;
        this._instantiationService = _instantiationService;
        this._toDispose = [];
        this._model = new SuggestModel(this._editor);
        this._memory = _instantiationService.createInstance(SuggestMemories, this._editor.getConfiguration().contribInfo.suggestSelection);
        this._toDispose.push(this._model.onDidTrigger(function (e) {
            if (!_this._widget) {
                _this._createSuggestWidget();
            }
            _this._widget.showTriggered(e.auto);
        }));
        this._toDispose.push(this._model.onDidSuggest(function (e) {
            var index = _this._memory.select(_this._editor.getModel(), _this._editor.getPosition(), e.completionModel.items);
            _this._widget.showSuggestions(e.completionModel, index, e.isFrozen, e.auto);
        }));
        this._toDispose.push(this._model.onDidCancel(function (e) {
            if (_this._widget && !e.retrigger) {
                _this._widget.hideWidget();
            }
        }));
        // Manage the acceptSuggestionsOnEnter context key
        var acceptSuggestionsOnEnter = SuggestContext.AcceptSuggestionsOnEnter.bindTo(_contextKeyService);
        var updateFromConfig = function () {
            var _a = _this._editor.getConfiguration().contribInfo, acceptSuggestionOnEnter = _a.acceptSuggestionOnEnter, suggestSelection = _a.suggestSelection;
            acceptSuggestionsOnEnter.set(acceptSuggestionOnEnter === 'on' || acceptSuggestionOnEnter === 'smart');
            _this._memory.setMode(suggestSelection);
        };
        this._toDispose.push(this._editor.onDidChangeConfiguration(function (e) { return updateFromConfig(); }));
        updateFromConfig();
    }
    SuggestController.get = function (editor) {
        return editor.getContribution(SuggestController.ID);
    };
    SuggestController.prototype._createSuggestWidget = function () {
        var _this = this;
        this._widget = this._instantiationService.createInstance(SuggestWidget, this._editor);
        this._toDispose.push(this._widget.onDidSelect(this._onDidSelectItem, this));
        // Wire up logic to accept a suggestion on certain characters
        var autoAcceptOracle = new AcceptOnCharacterOracle(this._editor, this._widget, function (item) { return _this._onDidSelectItem(item); });
        this._toDispose.push(autoAcceptOracle, this._model.onDidSuggest(function (e) {
            if (e.completionModel.items.length === 0) {
                autoAcceptOracle.reset();
            }
        }));
        var makesTextEdit = SuggestContext.MakesTextEdit.bindTo(this._contextKeyService);
        this._toDispose.push(this._widget.onDidFocus(function (_a) {
            var item = _a.item;
            var position = _this._editor.getPosition();
            var startColumn = item.position.column - item.suggestion.overwriteBefore;
            var endColumn = position.column;
            var value = true;
            if (_this._editor.getConfiguration().contribInfo.acceptSuggestionOnEnter === 'smart'
                && _this._model.state === 2 /* Auto */
                && !item.suggestion.command
                && !item.suggestion.additionalTextEdits
                && item.suggestion.snippetType !== 'textmate'
                && endColumn - startColumn === item.suggestion.insertText.length) {
                var oldText = _this._editor.getModel().getValueInRange({
                    startLineNumber: position.lineNumber,
                    startColumn: startColumn,
                    endLineNumber: position.lineNumber,
                    endColumn: endColumn
                });
                value = oldText !== item.suggestion.insertText;
            }
            makesTextEdit.set(value);
        }));
        this._toDispose.push({
            dispose: function () { makesTextEdit.reset(); }
        });
    };
    SuggestController.prototype.getId = function () {
        return SuggestController.ID;
    };
    SuggestController.prototype.dispose = function () {
        this._toDispose = dispose(this._toDispose);
        if (this._widget) {
            this._widget.dispose();
            this._widget = null;
        }
        if (this._model) {
            this._model.dispose();
            this._model = null;
        }
    };
    SuggestController.prototype._onDidSelectItem = function (event) {
        var _a;
        if (!event || !event.item) {
            this._model.cancel();
            return;
        }
        var _b = event.item, suggestion = _b.suggestion, position = _b.position;
        var editorColumn = this._editor.getPosition().column;
        var columnDelta = editorColumn - position.column;
        // pushing undo stops *before* additional text edits and
        // *after* the main edit
        this._editor.pushUndoStop();
        if (Array.isArray(suggestion.additionalTextEdits)) {
            this._editor.executeEdits('suggestController.additionalTextEdits', suggestion.additionalTextEdits.map(function (edit) { return EditOperation.replace(Range.lift(edit.range), edit.text); }));
        }
        // keep item in memory
        this._memory.memorize(this._editor.getModel(), this._editor.getPosition(), event.item);
        var insertText = suggestion.insertText;
        if (suggestion.snippetType !== 'textmate') {
            insertText = SnippetParser.escape(insertText);
        }
        SnippetController2.get(this._editor).insert(insertText, suggestion.overwriteBefore + columnDelta, suggestion.overwriteAfter, false, false);
        this._editor.pushUndoStop();
        if (!suggestion.command) {
            // done
            this._model.cancel();
        }
        else if (suggestion.command.id === TriggerSuggestAction.id) {
            // retigger
            this._model.trigger({ auto: true }, true);
        }
        else {
            // exec command, done
            (_a = this._commandService).executeCommand.apply(_a, [suggestion.command.id].concat(suggestion.command.arguments)).done(undefined, onUnexpectedError);
            this._model.cancel();
        }
        this._alertCompletionItem(event.item);
    };
    SuggestController.prototype._alertCompletionItem = function (_a) {
        var suggestion = _a.suggestion;
        var msg = nls.localize('arai.alert.snippet', "Accepting '{0}' did insert the following text: {1}", suggestion.label, suggestion.insertText);
        alert(msg);
    };
    SuggestController.prototype.triggerSuggest = function (onlyFrom) {
        this._model.trigger({ auto: false }, false, onlyFrom);
        this._editor.revealLine(this._editor.getPosition().lineNumber, 0 /* Smooth */);
        this._editor.focus();
    };
    SuggestController.prototype.acceptSelectedSuggestion = function () {
        if (this._widget) {
            var item = this._widget.getFocusedItem();
            this._onDidSelectItem(item);
        }
    };
    SuggestController.prototype.cancelSuggestWidget = function () {
        if (this._widget) {
            this._model.cancel();
            this._widget.hideWidget();
        }
    };
    SuggestController.prototype.selectNextSuggestion = function () {
        if (this._widget) {
            this._widget.selectNext();
        }
    };
    SuggestController.prototype.selectNextPageSuggestion = function () {
        if (this._widget) {
            this._widget.selectNextPage();
        }
    };
    SuggestController.prototype.selectLastSuggestion = function () {
        if (this._widget) {
            this._widget.selectLast();
        }
    };
    SuggestController.prototype.selectPrevSuggestion = function () {
        if (this._widget) {
            this._widget.selectPrevious();
        }
    };
    SuggestController.prototype.selectPrevPageSuggestion = function () {
        if (this._widget) {
            this._widget.selectPreviousPage();
        }
    };
    SuggestController.prototype.selectFirstSuggestion = function () {
        if (this._widget) {
            this._widget.selectFirst();
        }
    };
    SuggestController.prototype.toggleSuggestionDetails = function () {
        if (this._widget) {
            this._widget.toggleDetails();
        }
    };
    SuggestController.prototype.toggleSuggestionFocus = function () {
        if (this._widget) {
            this._widget.toggleDetailsFocus();
        }
    };
    SuggestController.ID = 'editor.contrib.suggestController';
    SuggestController = __decorate([
        __param(1, ICommandService),
        __param(2, IContextKeyService),
        __param(3, IInstantiationService)
    ], SuggestController);
    return SuggestController;
}());
export { SuggestController };
var TriggerSuggestAction = /** @class */ (function (_super) {
    __extends(TriggerSuggestAction, _super);
    function TriggerSuggestAction() {
        return _super.call(this, {
            id: TriggerSuggestAction.id,
            label: nls.localize('suggest.trigger.label', "Trigger Suggest"),
            alias: 'Trigger Suggest',
            precondition: ContextKeyExpr.and(EditorContextKeys.writable, EditorContextKeys.hasCompletionItemProvider),
            kbOpts: {
                kbExpr: EditorContextKeys.textInputFocus,
                primary: 2048 /* CtrlCmd */ | 10 /* Space */,
                mac: { primary: 256 /* WinCtrl */ | 10 /* Space */ }
            }
        }) || this;
    }
    TriggerSuggestAction.prototype.run = function (accessor, editor) {
        var controller = SuggestController.get(editor);
        if (!controller) {
            return;
        }
        controller.triggerSuggest();
    };
    TriggerSuggestAction.id = 'editor.action.triggerSuggest';
    return TriggerSuggestAction;
}(EditorAction));
export { TriggerSuggestAction };
registerEditorContribution(SuggestController);
registerEditorAction(TriggerSuggestAction);
var weight = KeybindingsRegistry.WEIGHT.editorContrib(90);
var SuggestCommand = EditorCommand.bindToContribution(SuggestController.get);
registerEditorCommand(new SuggestCommand({
    id: 'acceptSelectedSuggestion',
    precondition: SuggestContext.Visible,
    handler: function (x) { return x.acceptSelectedSuggestion(); },
    kbOpts: {
        weight: weight,
        kbExpr: EditorContextKeys.textInputFocus,
        primary: 2 /* Tab */
    }
}));
registerEditorCommand(new SuggestCommand({
    id: 'acceptSelectedSuggestionOnEnter',
    precondition: SuggestContext.Visible,
    handler: function (x) { return x.acceptSelectedSuggestion(); },
    kbOpts: {
        weight: weight,
        kbExpr: ContextKeyExpr.and(EditorContextKeys.textInputFocus, SuggestContext.AcceptSuggestionsOnEnter, SuggestContext.MakesTextEdit),
        primary: 3 /* Enter */
    }
}));
registerEditorCommand(new SuggestCommand({
    id: 'hideSuggestWidget',
    precondition: SuggestContext.Visible,
    handler: function (x) { return x.cancelSuggestWidget(); },
    kbOpts: {
        weight: weight,
        kbExpr: EditorContextKeys.textInputFocus,
        primary: 9 /* Escape */,
        secondary: [1024 /* Shift */ | 9 /* Escape */]
    }
}));
registerEditorCommand(new SuggestCommand({
    id: 'selectNextSuggestion',
    precondition: ContextKeyExpr.and(SuggestContext.Visible, SuggestContext.MultipleSuggestions),
    handler: function (c) { return c.selectNextSuggestion(); },
    kbOpts: {
        weight: weight,
        kbExpr: EditorContextKeys.textInputFocus,
        primary: 18 /* DownArrow */,
        secondary: [2048 /* CtrlCmd */ | 18 /* DownArrow */],
        mac: { primary: 18 /* DownArrow */, secondary: [2048 /* CtrlCmd */ | 18 /* DownArrow */, 256 /* WinCtrl */ | 44 /* KEY_N */] }
    }
}));
registerEditorCommand(new SuggestCommand({
    id: 'selectNextPageSuggestion',
    precondition: ContextKeyExpr.and(SuggestContext.Visible, SuggestContext.MultipleSuggestions),
    handler: function (c) { return c.selectNextPageSuggestion(); },
    kbOpts: {
        weight: weight,
        kbExpr: EditorContextKeys.textInputFocus,
        primary: 12 /* PageDown */,
        secondary: [2048 /* CtrlCmd */ | 12 /* PageDown */]
    }
}));
registerEditorCommand(new SuggestCommand({
    id: 'selectLastSuggestion',
    precondition: ContextKeyExpr.and(SuggestContext.Visible, SuggestContext.MultipleSuggestions),
    handler: function (c) { return c.selectLastSuggestion(); }
}));
registerEditorCommand(new SuggestCommand({
    id: 'selectPrevSuggestion',
    precondition: ContextKeyExpr.and(SuggestContext.Visible, SuggestContext.MultipleSuggestions),
    handler: function (c) { return c.selectPrevSuggestion(); },
    kbOpts: {
        weight: weight,
        kbExpr: EditorContextKeys.textInputFocus,
        primary: 16 /* UpArrow */,
        secondary: [2048 /* CtrlCmd */ | 16 /* UpArrow */],
        mac: { primary: 16 /* UpArrow */, secondary: [2048 /* CtrlCmd */ | 16 /* UpArrow */, 256 /* WinCtrl */ | 46 /* KEY_P */] }
    }
}));
registerEditorCommand(new SuggestCommand({
    id: 'selectPrevPageSuggestion',
    precondition: ContextKeyExpr.and(SuggestContext.Visible, SuggestContext.MultipleSuggestions),
    handler: function (c) { return c.selectPrevPageSuggestion(); },
    kbOpts: {
        weight: weight,
        kbExpr: EditorContextKeys.textInputFocus,
        primary: 11 /* PageUp */,
        secondary: [2048 /* CtrlCmd */ | 11 /* PageUp */]
    }
}));
registerEditorCommand(new SuggestCommand({
    id: 'selectFirstSuggestion',
    precondition: ContextKeyExpr.and(SuggestContext.Visible, SuggestContext.MultipleSuggestions),
    handler: function (c) { return c.selectFirstSuggestion(); }
}));
registerEditorCommand(new SuggestCommand({
    id: 'toggleSuggestionDetails',
    precondition: SuggestContext.Visible,
    handler: function (x) { return x.toggleSuggestionDetails(); },
    kbOpts: {
        weight: weight,
        kbExpr: EditorContextKeys.textInputFocus,
        primary: 2048 /* CtrlCmd */ | 10 /* Space */,
        mac: { primary: 256 /* WinCtrl */ | 10 /* Space */ }
    }
}));
registerEditorCommand(new SuggestCommand({
    id: 'toggleSuggestionFocus',
    precondition: SuggestContext.Visible,
    handler: function (x) { return x.toggleSuggestionFocus(); },
    kbOpts: {
        weight: weight,
        kbExpr: EditorContextKeys.textInputFocus,
        primary: 2048 /* CtrlCmd */ | 512 /* Alt */ | 10 /* Space */,
        mac: { primary: 256 /* WinCtrl */ | 512 /* Alt */ | 10 /* Space */ }
    }
}));
