/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { isFalsyOrEmpty } from '../../../base/common/arrays.js';
import { TimeoutTimer } from '../../../base/common/async.js';
import { onUnexpectedError } from '../../../base/common/errors.js';
import { Emitter } from '../../../base/common/event.js';
import { dispose } from '../../../base/common/lifecycle.js';
import { values } from '../../../base/common/map.js';
import { Selection } from '../../common/core/selection.js';
import { CompletionProviderRegistry } from '../../common/modes.js';
import { CompletionModel } from './completionModel.js';
import { getSuggestionComparator, provideSuggestionItems, getSnippetSuggestSupport } from './suggest.js';
import { SnippetController2 } from '../snippet/snippetController2.js';
import { CancellationTokenSource } from '../../../base/common/cancellation.js';
import { WordDistance } from './wordDistance.js';
var LineContext = /** @class */ (function () {
    function LineContext(model, position, auto, shy) {
        this.leadingLineContent = model.getLineContent(position.lineNumber).substr(0, position.column - 1);
        this.leadingWord = model.getWordUntilPosition(position);
        this.lineNumber = position.lineNumber;
        this.column = position.column;
        this.auto = auto;
        this.shy = shy;
    }
    LineContext.shouldAutoTrigger = function (editor) {
        var model = editor.getModel();
        if (!model) {
            return false;
        }
        var pos = editor.getPosition();
        model.tokenizeIfCheap(pos.lineNumber);
        var word = model.getWordAtPosition(pos);
        if (!word) {
            return false;
        }
        if (word.endColumn !== pos.column) {
            return false;
        }
        if (!isNaN(Number(word.word))) {
            return false;
        }
        return true;
    };
    return LineContext;
}());
export { LineContext };
var SuggestModel = /** @class */ (function () {
    function SuggestModel(_editor, _editorWorker) {
        var _this = this;
        this._editor = _editor;
        this._editorWorker = _editorWorker;
        this._toDispose = [];
        this._triggerQuickSuggest = new TimeoutTimer();
        this._triggerRefilter = new TimeoutTimer();
        this._state = 0 /* Idle */;
        this._onDidCancel = new Emitter();
        this._onDidTrigger = new Emitter();
        this._onDidSuggest = new Emitter();
        this.onDidCancel = this._onDidCancel.event;
        this.onDidTrigger = this._onDidTrigger.event;
        this.onDidSuggest = this._onDidSuggest.event;
        this._completionModel = null;
        this._context = null;
        this._currentSelection = this._editor.getSelection() || new Selection(1, 1, 1, 1);
        // wire up various listeners
        this._toDispose.push(this._editor.onDidChangeModel(function () {
            _this._updateTriggerCharacters();
            _this.cancel();
        }));
        this._toDispose.push(this._editor.onDidChangeModelLanguage(function () {
            _this._updateTriggerCharacters();
            _this.cancel();
        }));
        this._toDispose.push(this._editor.onDidChangeConfiguration(function () {
            _this._updateTriggerCharacters();
            _this._updateQuickSuggest();
        }));
        this._toDispose.push(CompletionProviderRegistry.onDidChange(function () {
            _this._updateTriggerCharacters();
            _this._updateActiveSuggestSession();
        }));
        this._toDispose.push(this._editor.onDidChangeCursorSelection(function (e) {
            _this._onCursorChange(e);
        }));
        var editorIsComposing = false;
        this._toDispose.push(this._editor.onCompositionStart(function () {
            editorIsComposing = true;
        }));
        this._toDispose.push(this._editor.onCompositionEnd(function () {
            // refilter when composition ends
            editorIsComposing = false;
            _this._refilterCompletionItems();
        }));
        this._toDispose.push(this._editor.onDidChangeModelContent(function () {
            // only filter completions when the editor isn't
            // composing a character, e.g. ¨ + u makes ü but just
            // ¨ cannot be used for filtering
            if (!editorIsComposing) {
                _this._refilterCompletionItems();
            }
        }));
        this._updateTriggerCharacters();
        this._updateQuickSuggest();
    }
    SuggestModel.prototype.dispose = function () {
        dispose([this._onDidCancel, this._onDidSuggest, this._onDidTrigger, this._triggerCharacterListener, this._triggerQuickSuggest, this._triggerRefilter]);
        this._toDispose = dispose(this._toDispose);
        dispose(this._completionModel);
        this.cancel();
    };
    // --- handle configuration & precondition changes
    SuggestModel.prototype._updateQuickSuggest = function () {
        this._quickSuggestDelay = this._editor.getConfiguration().contribInfo.quickSuggestionsDelay;
        if (isNaN(this._quickSuggestDelay) || (!this._quickSuggestDelay && this._quickSuggestDelay !== 0) || this._quickSuggestDelay < 0) {
            this._quickSuggestDelay = 10;
        }
    };
    SuggestModel.prototype._updateTriggerCharacters = function () {
        var _this = this;
        dispose(this._triggerCharacterListener);
        if (this._editor.getConfiguration().readOnly
            || !this._editor.getModel()
            || !this._editor.getConfiguration().contribInfo.suggestOnTriggerCharacters) {
            return;
        }
        var supportsByTriggerCharacter = Object.create(null);
        for (var _i = 0, _a = CompletionProviderRegistry.all(this._editor.getModel()); _i < _a.length; _i++) {
            var support = _a[_i];
            if (isFalsyOrEmpty(support.triggerCharacters)) {
                continue;
            }
            for (var _b = 0, _c = support.triggerCharacters; _b < _c.length; _b++) {
                var ch = _c[_b];
                var set = supportsByTriggerCharacter[ch];
                if (!set) {
                    set = supportsByTriggerCharacter[ch] = new Set();
                    set.add(getSnippetSuggestSupport());
                }
                set.add(support);
            }
        }
        this._triggerCharacterListener = this._editor.onDidType(function (text) {
            var lastChar = text.charAt(text.length - 1);
            var supports = supportsByTriggerCharacter[lastChar];
            if (supports) {
                // keep existing items that where not computed by the
                // supports/providers that want to trigger now
                var items = _this._completionModel ? _this._completionModel.adopt(supports) : undefined;
                _this.trigger({ auto: true, triggerCharacter: lastChar }, Boolean(_this._completionModel), values(supports), items);
            }
        });
    };
    Object.defineProperty(SuggestModel.prototype, "state", {
        // --- trigger/retrigger/cancel suggest
        get: function () {
            return this._state;
        },
        enumerable: true,
        configurable: true
    });
    SuggestModel.prototype.cancel = function (retrigger) {
        if (retrigger === void 0) { retrigger = false; }
        this._triggerRefilter.cancel();
        if (this._triggerQuickSuggest) {
            this._triggerQuickSuggest.cancel();
        }
        if (this._requestToken) {
            this._requestToken.cancel();
        }
        this._state = 0 /* Idle */;
        dispose(this._completionModel);
        this._completionModel = null;
        this._context = null;
        this._onDidCancel.fire({ retrigger: retrigger });
    };
    SuggestModel.prototype._updateActiveSuggestSession = function () {
        if (this._state !== 0 /* Idle */) {
            if (!CompletionProviderRegistry.has(this._editor.getModel())) {
                this.cancel();
            }
            else {
                this.trigger({ auto: this._state === 2 /* Auto */ }, true);
            }
        }
    };
    SuggestModel.prototype._onCursorChange = function (e) {
        var _this = this;
        var prevSelection = this._currentSelection;
        this._currentSelection = this._editor.getSelection();
        if (!e.selection.isEmpty()
            || e.reason !== 0 /* NotSet */
            || (e.source !== 'keyboard' && e.source !== 'deleteLeft')) {
            // Early exit if nothing needs to be done!
            // Leave some form of early exit check here if you wish to continue being a cursor position change listener ;)
            if (this._state !== 0 /* Idle */) {
                this.cancel();
            }
            return;
        }
        if (!CompletionProviderRegistry.has(this._editor.getModel())) {
            return;
        }
        var model = this._editor.getModel();
        if (!model) {
            return;
        }
        if (this._state === 0 /* Idle */) {
            if (this._editor.getConfiguration().contribInfo.quickSuggestions === false) {
                // not enabled
                return;
            }
            if (!prevSelection.containsRange(this._currentSelection) && !prevSelection.getEndPosition().isBeforeOrEqual(this._currentSelection.getPosition())) {
                // cursor didn't move RIGHT
                return;
            }
            if (this._editor.getConfiguration().contribInfo.suggest.snippetsPreventQuickSuggestions && SnippetController2.get(this._editor).isInSnippet()) {
                // no quick suggestion when in snippet mode
                return;
            }
            this.cancel();
            this._triggerQuickSuggest.cancelAndSet(function () {
                if (!LineContext.shouldAutoTrigger(_this._editor)) {
                    return;
                }
                var model = _this._editor.getModel();
                var pos = _this._editor.getPosition();
                if (!model) {
                    return;
                }
                // validate enabled now
                var quickSuggestions = _this._editor.getConfiguration().contribInfo.quickSuggestions;
                if (quickSuggestions === false) {
                    return;
                }
                else if (quickSuggestions === true) {
                    // all good
                }
                else {
                    // Check the type of the token that triggered this
                    model.tokenizeIfCheap(pos.lineNumber);
                    var lineTokens = model.getLineTokens(pos.lineNumber);
                    var tokenType = lineTokens.getStandardTokenType(lineTokens.findTokenIndexAtOffset(Math.max(pos.column - 1 - 1, 0)));
                    var inValidScope = quickSuggestions.other && tokenType === 0 /* Other */
                        || quickSuggestions.comments && tokenType === 1 /* Comment */
                        || quickSuggestions.strings && tokenType === 2 /* String */;
                    if (!inValidScope) {
                        return;
                    }
                }
                // we made it till here -> trigger now
                _this.trigger({ auto: true });
            }, this._quickSuggestDelay);
        }
    };
    SuggestModel.prototype._refilterCompletionItems = function () {
        var _this = this;
        if (this._state === 0 /* Idle */) {
            return;
        }
        var model = this._editor.getModel();
        if (model) {
            // refine active suggestion
            this._triggerRefilter.cancelAndSet(function () {
                var position = _this._editor.getPosition();
                var ctx = new LineContext(model, position, _this._state === 2 /* Auto */, false);
                _this._onNewContext(ctx);
            }, 25);
        }
    };
    SuggestModel.prototype.trigger = function (context, retrigger, onlyFrom, existingItems) {
        var _this = this;
        if (retrigger === void 0) { retrigger = false; }
        var model = this._editor.getModel();
        if (!model) {
            return;
        }
        var auto = context.auto;
        var ctx = new LineContext(model, this._editor.getPosition(), auto, context.shy);
        // Cancel previous requests, change state & update UI
        this.cancel(retrigger);
        this._state = auto ? 2 /* Auto */ : 1 /* Manual */;
        this._onDidTrigger.fire({ auto: auto, shy: context.shy });
        // Capture context when request was sent
        this._context = ctx;
        // Build context for request
        var suggestCtx;
        if (context.triggerCharacter) {
            suggestCtx = {
                triggerKind: 1 /* TriggerCharacter */,
                triggerCharacter: context.triggerCharacter
            };
        }
        else if (onlyFrom && onlyFrom.length) {
            suggestCtx = { triggerKind: 2 /* TriggerForIncompleteCompletions */ };
        }
        else {
            suggestCtx = { triggerKind: 0 /* Invoke */ };
        }
        this._requestToken = new CancellationTokenSource();
        // TODO: Remove this workaround - https://github.com/Microsoft/vscode/issues/61917
        // let wordDistance = Promise.resolve().then(() => WordDistance.create(this._editorWorker, this._editor));
        var wordDistance = WordDistance.create(this._editorWorker, this._editor);
        var items = provideSuggestionItems(model, this._editor.getPosition(), this._editor.getConfiguration().contribInfo.suggest.snippets, onlyFrom, suggestCtx, this._requestToken.token);
        Promise.all([items, wordDistance]).then(function (_a) {
            var items = _a[0], wordDistance = _a[1];
            _this._requestToken.dispose();
            if (_this._state === 0 /* Idle */) {
                return;
            }
            var model = _this._editor.getModel();
            if (!model) {
                return;
            }
            if (!isFalsyOrEmpty(existingItems)) {
                var cmpFn = getSuggestionComparator(_this._editor.getConfiguration().contribInfo.suggest.snippets);
                items = items.concat(existingItems).sort(cmpFn);
            }
            var ctx = new LineContext(model, _this._editor.getPosition(), auto, context.shy);
            dispose(_this._completionModel);
            _this._completionModel = new CompletionModel(items, _this._context.column, {
                leadingLineContent: ctx.leadingLineContent,
                characterCountDelta: _this._context ? ctx.column - _this._context.column : 0
            }, wordDistance, _this._editor.getConfiguration().contribInfo.suggest);
            _this._onNewContext(ctx);
        }).catch(onUnexpectedError);
    };
    SuggestModel.prototype._onNewContext = function (ctx) {
        if (!this._context) {
            // happens when 24x7 IntelliSense is enabled and still in its delay
            return;
        }
        if (ctx.lineNumber !== this._context.lineNumber) {
            // e.g. happens when pressing Enter while IntelliSense is computed
            this.cancel();
            return;
        }
        if (ctx.leadingWord.startColumn < this._context.leadingWord.startColumn) {
            // happens when the current word gets outdented
            this.cancel();
            return;
        }
        if (ctx.column < this._context.column) {
            // typed -> moved cursor LEFT -> retrigger if still on a word
            if (ctx.leadingWord.word) {
                this.trigger({ auto: this._context.auto }, true);
            }
            else {
                this.cancel();
            }
            return;
        }
        if (!this._completionModel) {
            // happens when IntelliSense is not yet computed
            return;
        }
        if (ctx.column > this._context.column && this._completionModel.incomplete.size > 0 && ctx.leadingWord.word.length !== 0) {
            // typed -> moved cursor RIGHT & incomple model & still on a word -> retrigger
            var incomplete = this._completionModel.incomplete;
            var adopted = this._completionModel.adopt(incomplete);
            this.trigger({ auto: this._state === 2 /* Auto */ }, true, values(incomplete), adopted);
        }
        else {
            // typed -> moved cursor RIGHT -> update UI
            var oldLineContext = this._completionModel.lineContext;
            var isFrozen = false;
            this._completionModel.lineContext = {
                leadingLineContent: ctx.leadingLineContent,
                characterCountDelta: ctx.column - this._context.column
            };
            if (this._completionModel.items.length === 0) {
                if (LineContext.shouldAutoTrigger(this._editor) && this._context.leadingWord.endColumn < ctx.leadingWord.startColumn) {
                    // retrigger when heading into a new word
                    this.trigger({ auto: this._context.auto }, true);
                    return;
                }
                if (!this._context.auto) {
                    // freeze when IntelliSense was manually requested
                    this._completionModel.lineContext = oldLineContext;
                    isFrozen = this._completionModel.items.length > 0;
                    if (isFrozen && ctx.leadingWord.word.length === 0) {
                        // there were results before but now there aren't
                        // and also we are not on a word anymore -> cancel
                        this.cancel();
                        return;
                    }
                }
                else {
                    // nothing left
                    this.cancel();
                    return;
                }
            }
            this._onDidSuggest.fire({
                completionModel: this._completionModel,
                auto: this._context.auto,
                shy: this._context.shy,
                isFrozen: isFrozen,
            });
        }
    };
    return SuggestModel;
}());
export { SuggestModel };
