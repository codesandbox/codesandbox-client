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
import { dispose } from '../../../base/common/lifecycle.js';
import { repeat } from '../../../base/common/strings.js';
import { EditorCommand, registerEditorCommand, registerEditorContribution } from '../../browser/editorExtensions.js';
import { Selection } from '../../common/core/selection.js';
import { EditorContextKeys } from '../../common/editorContextKeys.js';
import { showSimpleSuggestions } from '../suggest/suggest.js';
import { ContextKeyExpr, IContextKeyService, RawContextKey } from '../../../platform/contextkey/common/contextkey.js';
import { ILogService } from '../../../platform/log/common/log.js';
import { SnippetSession } from './snippetSession.js';
var SnippetController2 = /** @class */ (function () {
    function SnippetController2(_editor, _logService, contextKeyService) {
        this._editor = _editor;
        this._logService = _logService;
        this._snippetListener = [];
        this._inSnippet = SnippetController2.InSnippetMode.bindTo(contextKeyService);
        this._hasNextTabstop = SnippetController2.HasNextTabstop.bindTo(contextKeyService);
        this._hasPrevTabstop = SnippetController2.HasPrevTabstop.bindTo(contextKeyService);
    }
    SnippetController2.get = function (editor) {
        return editor.getContribution('snippetController2');
    };
    SnippetController2.prototype.dispose = function () {
        this._inSnippet.reset();
        this._hasPrevTabstop.reset();
        this._hasNextTabstop.reset();
        dispose(this._session);
    };
    SnippetController2.prototype.getId = function () {
        return 'snippetController2';
    };
    SnippetController2.prototype.insert = function (template, overwriteBefore, overwriteAfter, undoStopBefore, undoStopAfter, adjustWhitespace) {
        if (overwriteBefore === void 0) { overwriteBefore = 0; }
        if (overwriteAfter === void 0) { overwriteAfter = 0; }
        if (undoStopBefore === void 0) { undoStopBefore = true; }
        if (undoStopAfter === void 0) { undoStopAfter = true; }
        if (adjustWhitespace === void 0) { adjustWhitespace = true; }
        // this is here to find out more about the yet-not-understood
        // error that sometimes happens when we fail to inserted a nested
        // snippet
        try {
            this._doInsert(template, overwriteBefore, overwriteAfter, undoStopBefore, undoStopAfter, adjustWhitespace);
        }
        catch (e) {
            this.cancel();
            this._logService.error(e);
            this._logService.error('snippet_error');
            this._logService.error('insert_template=', template);
            this._logService.error('existing_template=', this._session ? this._session._logInfo() : '<no_session>');
        }
    };
    SnippetController2.prototype._doInsert = function (template, overwriteBefore, overwriteAfter, undoStopBefore, undoStopAfter, adjustWhitespace) {
        var _this = this;
        if (overwriteBefore === void 0) { overwriteBefore = 0; }
        if (overwriteAfter === void 0) { overwriteAfter = 0; }
        if (undoStopBefore === void 0) { undoStopBefore = true; }
        if (undoStopAfter === void 0) { undoStopAfter = true; }
        if (adjustWhitespace === void 0) { adjustWhitespace = true; }
        // don't listen while inserting the snippet
        // as that is the inflight state causing cancelation
        this._snippetListener = dispose(this._snippetListener);
        if (undoStopBefore) {
            this._editor.getModel().pushStackElement();
        }
        if (!this._session) {
            this._modelVersionId = this._editor.getModel().getAlternativeVersionId();
            this._session = new SnippetSession(this._editor, template, overwriteBefore, overwriteAfter, adjustWhitespace);
            this._session.insert();
        }
        else {
            this._session.merge(template, overwriteBefore, overwriteAfter, adjustWhitespace);
        }
        if (undoStopAfter) {
            this._editor.getModel().pushStackElement();
        }
        this._updateState();
        this._snippetListener = [
            this._editor.onDidChangeModelContent(function (e) { return e.isFlush && _this.cancel(); }),
            this._editor.onDidChangeModel(function () { return _this.cancel(); }),
            this._editor.onDidChangeCursorSelection(function () { return _this._updateState(); })
        ];
    };
    SnippetController2.prototype._updateState = function () {
        if (!this._session) {
            // canceled in the meanwhile
            return;
        }
        if (this._modelVersionId === this._editor.getModel().getAlternativeVersionId()) {
            // undo until the 'before' state happened
            // and makes use cancel snippet mode
            return this.cancel();
        }
        if (!this._session.hasPlaceholder) {
            // don't listen for selection changes and don't
            // update context keys when the snippet is plain text
            return this.cancel();
        }
        if (this._session.isAtLastPlaceholder || !this._session.isSelectionWithinPlaceholders()) {
            return this.cancel();
        }
        this._inSnippet.set(true);
        this._hasPrevTabstop.set(!this._session.isAtFirstPlaceholder);
        this._hasNextTabstop.set(!this._session.isAtLastPlaceholder);
        this._handleChoice();
    };
    SnippetController2.prototype._handleChoice = function () {
        var choice = this._session.choice;
        if (!choice) {
            this._currentChoice = undefined;
            return;
        }
        if (this._currentChoice !== choice) {
            this._currentChoice = choice;
            this._editor.setSelections(this._editor.getSelections()
                .map(function (s) { return Selection.fromPositions(s.getStartPosition()); }));
            var first_1 = choice.options[0];
            showSimpleSuggestions(this._editor, choice.options.map(function (option, i) {
                // let before = choice.options.slice(0, i);
                // let after = choice.options.slice(i);
                return {
                    kind: 13 /* Value */,
                    label: option.value,
                    insertText: option.value,
                    // insertText: `\${1|${after.concat(before).join(',')}|}$0`,
                    // snippetType: 'textmate',
                    sortText: repeat('a', i),
                    overwriteAfter: first_1.value.length
                };
            }));
        }
    };
    SnippetController2.prototype.finish = function () {
        while (this._inSnippet.get()) {
            this.next();
        }
    };
    SnippetController2.prototype.cancel = function () {
        this._inSnippet.reset();
        this._hasPrevTabstop.reset();
        this._hasNextTabstop.reset();
        dispose(this._snippetListener);
        dispose(this._session);
        this._session = undefined;
        this._modelVersionId = -1;
    };
    SnippetController2.prototype.prev = function () {
        this._session.prev();
        this._updateState();
    };
    SnippetController2.prototype.next = function () {
        this._session.next();
        this._updateState();
    };
    SnippetController2.prototype.isInSnippet = function () {
        return this._inSnippet.get();
    };
    SnippetController2.prototype.getSessionEnclosingRange = function () {
        if (this._session) {
            return this._session.getEnclosingRange();
        }
        return undefined;
    };
    SnippetController2.InSnippetMode = new RawContextKey('inSnippetMode', false);
    SnippetController2.HasNextTabstop = new RawContextKey('hasNextTabstop', false);
    SnippetController2.HasPrevTabstop = new RawContextKey('hasPrevTabstop', false);
    SnippetController2 = __decorate([
        __param(1, ILogService),
        __param(2, IContextKeyService)
    ], SnippetController2);
    return SnippetController2;
}());
export { SnippetController2 };
registerEditorContribution(SnippetController2);
var CommandCtor = EditorCommand.bindToContribution(SnippetController2.get);
registerEditorCommand(new CommandCtor({
    id: 'jumpToNextSnippetPlaceholder',
    precondition: ContextKeyExpr.and(SnippetController2.InSnippetMode, SnippetController2.HasNextTabstop),
    handler: function (ctrl) { return ctrl.next(); },
    kbOpts: {
        weight: 100 /* EditorContrib */ + 30,
        kbExpr: EditorContextKeys.editorTextFocus,
        primary: 2 /* Tab */
    }
}));
registerEditorCommand(new CommandCtor({
    id: 'jumpToPrevSnippetPlaceholder',
    precondition: ContextKeyExpr.and(SnippetController2.InSnippetMode, SnippetController2.HasPrevTabstop),
    handler: function (ctrl) { return ctrl.prev(); },
    kbOpts: {
        weight: 100 /* EditorContrib */ + 30,
        kbExpr: EditorContextKeys.editorTextFocus,
        primary: 1024 /* Shift */ | 2 /* Tab */
    }
}));
registerEditorCommand(new CommandCtor({
    id: 'leaveSnippet',
    precondition: SnippetController2.InSnippetMode,
    handler: function (ctrl) { return ctrl.cancel(); },
    kbOpts: {
        weight: 100 /* EditorContrib */ + 30,
        kbExpr: EditorContextKeys.editorTextFocus,
        primary: 9 /* Escape */,
        secondary: [1024 /* Shift */ | 9 /* Escape */]
    }
}));
registerEditorCommand(new CommandCtor({
    id: 'acceptSnippet',
    precondition: SnippetController2.InSnippetMode,
    handler: function (ctrl) { return ctrl.finish(); },
}));
