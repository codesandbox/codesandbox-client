/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { fuzzyScore, fuzzyScoreGracefulAggressive, anyScore } from '../../../base/common/filters.js';
import { isDisposable } from '../../../base/common/lifecycle.js';
import { EDITOR_DEFAULTS } from '../../common/config/editorOptions.js';
var LineContext = /** @class */ (function () {
    function LineContext() {
    }
    return LineContext;
}());
export { LineContext };
var CompletionModel = /** @class */ (function () {
    function CompletionModel(items, column, lineContext, options) {
        if (options === void 0) { options = EDITOR_DEFAULTS.contribInfo.suggest; }
        this._snippetCompareFn = CompletionModel._compareCompletionItems;
        this._items = items;
        this._column = column;
        this._options = options;
        this._refilterKind = 1 /* All */;
        this._lineContext = lineContext;
        if (options.snippets === 'top') {
            this._snippetCompareFn = CompletionModel._compareCompletionItemsSnippetsUp;
        }
        else if (options.snippets === 'bottom') {
            this._snippetCompareFn = CompletionModel._compareCompletionItemsSnippetsDown;
        }
    }
    CompletionModel.prototype.dispose = function () {
        var seen = new Set();
        for (var _i = 0, _a = this._items; _i < _a.length; _i++) {
            var container = _a[_i].container;
            if (!seen.has(container)) {
                seen.add(container);
                if (isDisposable(container)) {
                    container.dispose();
                }
            }
        }
    };
    Object.defineProperty(CompletionModel.prototype, "lineContext", {
        get: function () {
            return this._lineContext;
        },
        set: function (value) {
            if (this._lineContext.leadingLineContent !== value.leadingLineContent
                || this._lineContext.characterCountDelta !== value.characterCountDelta) {
                this._refilterKind = this._lineContext.characterCountDelta < value.characterCountDelta && this._filteredItems ? 2 /* Incr */ : 1 /* All */;
                this._lineContext = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CompletionModel.prototype, "items", {
        get: function () {
            this._ensureCachedState();
            return this._filteredItems;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CompletionModel.prototype, "incomplete", {
        get: function () {
            this._ensureCachedState();
            return this._isIncomplete;
        },
        enumerable: true,
        configurable: true
    });
    CompletionModel.prototype.adopt = function (except) {
        var res = new Array();
        for (var i = 0; i < this._items.length;) {
            if (!except.has(this._items[i].support)) {
                res.push(this._items[i]);
                // unordered removed
                this._items[i] = this._items[this._items.length - 1];
                this._items.pop();
            }
            else {
                // continue with next item
                i++;
            }
        }
        this._refilterKind = 1 /* All */;
        return res;
    };
    Object.defineProperty(CompletionModel.prototype, "stats", {
        get: function () {
            this._ensureCachedState();
            return this._stats;
        },
        enumerable: true,
        configurable: true
    });
    CompletionModel.prototype._ensureCachedState = function () {
        if (this._refilterKind !== 0 /* Nothing */) {
            this._createCachedState();
        }
    };
    CompletionModel.prototype._createCachedState = function () {
        this._isIncomplete = new Set();
        this._stats = { suggestionCount: 0, snippetCount: 0, textCount: 0 };
        var _a = this._lineContext, leadingLineContent = _a.leadingLineContent, characterCountDelta = _a.characterCountDelta;
        var word = '';
        // incrementally filter less
        var source = this._refilterKind === 1 /* All */ ? this._items : this._filteredItems;
        var target = [];
        // picks a score function based on the number of
        // items that we have to score/filter and based on the
        // user-configuration
        var scoreFn = (!this._options.filterGraceful || source.length > 2000) ? fuzzyScore : fuzzyScoreGracefulAggressive;
        for (var i = 0; i < source.length; i++) {
            var item = source[i];
            var suggestion = item.suggestion, container = item.container;
            // collect those supports that signaled having
            // an incomplete result
            if (container.incomplete) {
                this._isIncomplete.add(item.support);
            }
            // 'word' is that remainder of the current line that we
            // filter and score against. In theory each suggestion uses a
            // different word, but in practice not - that's why we cache
            var wordLen = suggestion.overwriteBefore + characterCountDelta - (item.position.column - this._column);
            if (word.length !== wordLen) {
                word = wordLen === 0 ? '' : leadingLineContent.slice(-wordLen);
            }
            // remember the word against which this item was
            // scored
            item.word = word;
            if (wordLen === 0) {
                // when there is nothing to score against, don't
                // event try to do. Use a const rank and rely on
                // the fallback-sort using the initial sort order.
                // use a score of `-100` because that is out of the
                // bound of values `fuzzyScore` will return
                item.score = -100;
                item.matches = undefined;
            }
            else if (typeof suggestion.filterText === 'string') {
                // when there is a `filterText` it must match the `word`.
                // if it matches we check with the label to compute highlights
                // and if that doesn't yield a result we have no highlights,
                // despite having the match
                var match = scoreFn(word, suggestion.filterText, suggestion.overwriteBefore);
                if (!match) {
                    continue;
                }
                item.score = match[0];
                item.matches = (fuzzyScore(word, suggestion.label) || anyScore(word, suggestion.label))[1];
            }
            else {
                // by default match `word` against the `label`
                var match = scoreFn(word, suggestion.label, suggestion.overwriteBefore);
                if (match) {
                    item.score = match[0];
                    item.matches = match[1];
                }
                else {
                    continue;
                }
            }
            item.idx = i;
            target.push(item);
            // update stats
            this._stats.suggestionCount++;
            switch (suggestion.type) {
                case 'snippet':
                    this._stats.snippetCount++;
                    break;
                case 'text':
                    this._stats.textCount++;
                    break;
            }
        }
        this._filteredItems = target.sort(this._snippetCompareFn);
        this._refilterKind = 0 /* Nothing */;
    };
    CompletionModel._compareCompletionItems = function (a, b) {
        if (a.score > b.score) {
            return -1;
        }
        else if (a.score < b.score) {
            return 1;
        }
        else if (a.idx < b.idx) {
            return -1;
        }
        else if (a.idx > b.idx) {
            return 1;
        }
        else {
            return 0;
        }
    };
    CompletionModel._compareCompletionItemsSnippetsDown = function (a, b) {
        if (a.suggestion.type !== b.suggestion.type) {
            if (a.suggestion.type === 'snippet') {
                return 1;
            }
            else if (b.suggestion.type === 'snippet') {
                return -1;
            }
        }
        return CompletionModel._compareCompletionItems(a, b);
    };
    CompletionModel._compareCompletionItemsSnippetsUp = function (a, b) {
        if (a.suggestion.type !== b.suggestion.type) {
            if (a.suggestion.type === 'snippet') {
                return -1;
            }
            else if (b.suggestion.type === 'snippet') {
                return 1;
            }
        }
        return CompletionModel._compareCompletionItems(a, b);
    };
    return CompletionModel;
}());
export { CompletionModel };
