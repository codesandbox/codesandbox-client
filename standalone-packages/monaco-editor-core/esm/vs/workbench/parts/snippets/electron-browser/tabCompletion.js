/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { RawContextKey, IContextKeyService, ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey';
import { ISnippetsService } from './snippets.contribution';
import { getNonWhitespacePrefix, SnippetSuggestion } from './snippetsService';
import { endsWith } from '../../../../base/common/strings';
import { dispose } from '../../../../base/common/lifecycle';
import { Range } from '../../../../editor/common/core/range';
import { registerEditorContribution, EditorCommand, registerEditorCommand } from '../../../../editor/browser/editorExtensions';
import { SnippetController2 } from '../../../../editor/contrib/snippet/snippetController2';
import { showSimpleSuggestions } from '../../../../editor/contrib/suggest/suggest';
import { EditorContextKeys } from '../../../../editor/common/editorContextKeys';
var TabCompletionController = /** @class */ (function () {
    function TabCompletionController(_editor, _snippetService, contextKeyService) {
        var _this = this;
        this._editor = _editor;
        this._snippetService = _snippetService;
        this._activeSnippets = [];
        this._hasSnippets = TabCompletionController.ContextKey.bindTo(contextKeyService);
        this._configListener = this._editor.onDidChangeConfiguration(function (e) {
            if (e.contribInfo) {
                _this._update();
            }
        });
        this._update();
    }
    TabCompletionController.get = function (editor) {
        return editor.getContribution(TabCompletionController.ID);
    };
    TabCompletionController.prototype.getId = function () {
        return TabCompletionController.ID;
    };
    TabCompletionController.prototype.dispose = function () {
        dispose(this._configListener);
        dispose(this._selectionListener);
    };
    TabCompletionController.prototype._update = function () {
        var _this = this;
        var enabled = this._editor.getConfiguration().contribInfo.tabCompletion === 'onlySnippets';
        if (this._enabled !== enabled) {
            this._enabled = enabled;
            if (!this._enabled) {
                dispose(this._selectionListener);
            }
            else {
                this._selectionListener = this._editor.onDidChangeCursorSelection(function (e) { return _this._updateSnippets(); });
                if (this._editor.getModel()) {
                    this._updateSnippets();
                }
            }
        }
    };
    TabCompletionController.prototype._updateSnippets = function () {
        // reset first
        this._activeSnippets = [];
        // lots of dance for getting the
        var selection = this._editor.getSelection();
        var model = this._editor.getModel();
        model.tokenizeIfCheap(selection.positionLineNumber);
        var id = model.getLanguageIdAtPosition(selection.positionLineNumber, selection.positionColumn);
        var snippets = this._snippetService.getSnippetsSync(id);
        if (!snippets) {
            // nothing for this language
            this._hasSnippets.set(false);
            return;
        }
        if (Range.isEmpty(selection)) {
            // empty selection -> real text (no whitespace) left of cursor
            var prefix = getNonWhitespacePrefix(model, selection.getPosition());
            if (prefix) {
                for (var _i = 0, snippets_1 = snippets; _i < snippets_1.length; _i++) {
                    var snippet = snippets_1[_i];
                    if (endsWith(prefix, snippet.prefix)) {
                        this._activeSnippets.push(snippet);
                    }
                }
            }
        }
        else if (!Range.spansMultipleLines(selection) && model.getValueLengthInRange(selection) <= 100) {
            // actual selection -> snippet must be a full match
            var selected = model.getValueInRange(selection);
            if (selected) {
                for (var _a = 0, snippets_2 = snippets; _a < snippets_2.length; _a++) {
                    var snippet = snippets_2[_a];
                    if (selected === snippet.prefix) {
                        this._activeSnippets.push(snippet);
                    }
                }
            }
        }
        this._hasSnippets.set(this._activeSnippets.length > 0);
    };
    TabCompletionController.prototype.performSnippetCompletions = function () {
        var _this = this;
        if (this._activeSnippets.length === 1) {
            // one -> just insert
            var snippet = this._activeSnippets[0];
            SnippetController2.get(this._editor).insert(snippet.codeSnippet, snippet.prefix.length, 0);
        }
        else if (this._activeSnippets.length > 1) {
            // two or more -> show IntelliSense box
            showSimpleSuggestions(this._editor, this._activeSnippets.map(function (snippet) {
                var position = _this._editor.getPosition();
                var range = Range.fromPositions(position.delta(0, -snippet.prefix.length), position);
                return new SnippetSuggestion(snippet, range);
            }));
        }
    };
    TabCompletionController.ID = 'editor.tabCompletionController';
    TabCompletionController.ContextKey = new RawContextKey('hasSnippetCompletions', undefined);
    TabCompletionController = __decorate([
        __param(1, ISnippetsService),
        __param(2, IContextKeyService)
    ], TabCompletionController);
    return TabCompletionController;
}());
export { TabCompletionController };
registerEditorContribution(TabCompletionController);
var TabCompletionCommand = EditorCommand.bindToContribution(TabCompletionController.get);
registerEditorCommand(new TabCompletionCommand({
    id: 'insertSnippet',
    precondition: TabCompletionController.ContextKey,
    handler: function (x) { return x.performSnippetCompletions(); },
    kbOpts: {
        weight: 100 /* EditorContrib */,
        kbExpr: ContextKeyExpr.and(EditorContextKeys.editorTextFocus, EditorContextKeys.tabDoesNotMoveFocus, SnippetController2.InSnippetMode.toNegated()),
        primary: 2 /* Tab */
    }
}));
