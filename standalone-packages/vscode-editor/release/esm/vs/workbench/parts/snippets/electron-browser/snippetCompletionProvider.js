/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { MarkdownString } from '../../../../base/common/htmlContent.js';
import { compare } from '../../../../base/common/strings.js';
import { Range } from '../../../../editor/common/core/range.js';
import { IModeService } from '../../../../editor/common/services/modeService.js';
import { SnippetParser } from '../../../../editor/contrib/snippet/snippetParser.js';
import { localize } from '../../../../nls.js';
import { ISnippetsService } from './snippets.contribution.js';
var SnippetCompletion = /** @class */ (function () {
    function SnippetCompletion(snippet, range) {
        this.snippet = snippet;
        this.label = snippet.prefix;
        this.detail = localize('detail.snippet', "{0} ({1})", snippet.description || snippet.name, snippet.source);
        this.insertText = snippet.body;
        this.range = range;
        this.sortText = (snippet.snippetSource === 3 /* Extension */ ? 'z' : 'a') + "-" + snippet.prefix;
        this.kind = 25 /* Snippet */;
        this.insertTextRules = 4 /* InsertAsSnippet */;
    }
    SnippetCompletion.prototype.resolve = function () {
        this.documentation = new MarkdownString().appendCodeblock('', new SnippetParser().text(this.snippet.codeSnippet));
        this.insertText = this.snippet.codeSnippet;
        return this;
    };
    SnippetCompletion.compareByLabel = function (a, b) {
        return compare(a.label, b.label);
    };
    return SnippetCompletion;
}());
export { SnippetCompletion };
export function matches(pattern, patternStart, word, wordStart) {
    while (patternStart < pattern.length && wordStart < word.length) {
        if (pattern[patternStart] === word[wordStart]) {
            patternStart += 1;
        }
        wordStart += 1;
    }
    return patternStart === pattern.length;
}
var SnippetCompletionProvider = /** @class */ (function () {
    function SnippetCompletionProvider(_modeService, _snippets) {
        this._modeService = _modeService;
        this._snippets = _snippets;
        //
    }
    SnippetCompletionProvider.prototype.provideCompletionItems = function (model, position) {
        if (position.column >= SnippetCompletionProvider._maxPrefix) {
            return undefined;
        }
        var languageId = this._getLanguageIdAtPosition(model, position);
        return this._snippets.getSnippets(languageId).then(function (snippets) {
            var suggestions;
            var pos = { lineNumber: position.lineNumber, column: 1 };
            var lineOffsets = [];
            var linePrefixLow = model.getLineContent(position.lineNumber).substr(0, position.column - 1).toLowerCase();
            var endsInWhitespace = linePrefixLow.match(/\s$/);
            while (pos.column < position.column) {
                var word = model.getWordAtPosition(pos);
                if (word) {
                    // at a word
                    lineOffsets.push(word.startColumn - 1);
                    pos.column = word.endColumn + 1;
                    if (word.endColumn - 1 < linePrefixLow.length && !/\s/.test(linePrefixLow[word.endColumn - 1])) {
                        lineOffsets.push(word.endColumn - 1);
                    }
                }
                else if (!/\s/.test(linePrefixLow[pos.column - 1])) {
                    // at a none-whitespace character
                    lineOffsets.push(pos.column - 1);
                    pos.column += 1;
                }
                else {
                    // always advance!
                    pos.column += 1;
                }
            }
            var availableSnippets = new Set();
            snippets.forEach(availableSnippets.add, availableSnippets);
            suggestions = [];
            var _loop_1 = function (start) {
                availableSnippets.forEach(function (snippet) {
                    if (matches(linePrefixLow, start, snippet.prefixLow, 0)) {
                        suggestions.push(new SnippetCompletion(snippet, Range.fromPositions(position.delta(0, -(linePrefixLow.length - start)), position)));
                        availableSnippets.delete(snippet);
                    }
                });
            };
            for (var _i = 0, lineOffsets_1 = lineOffsets; _i < lineOffsets_1.length; _i++) {
                var start = lineOffsets_1[_i];
                _loop_1(start);
            }
            if (endsInWhitespace || lineOffsets.length === 0) {
                // add remaing snippets when the current prefix ends in whitespace or when no
                // interesting positions have been found
                availableSnippets.forEach(function (snippet) {
                    suggestions.push(new SnippetCompletion(snippet, Range.fromPositions(position)));
                });
            }
            // dismbiguate suggestions with same labels
            suggestions.sort(SnippetCompletion.compareByLabel);
            for (var i = 0; i < suggestions.length; i++) {
                var item = suggestions[i];
                var to = i + 1;
                for (; to < suggestions.length && item.label === suggestions[to].label; to++) {
                    suggestions[to].label = localize('snippetSuggest.longLabel', "{0}, {1}", suggestions[to].label, suggestions[to].snippet.name);
                }
                if (to > i + 1) {
                    suggestions[i].label = localize('snippetSuggest.longLabel', "{0}, {1}", suggestions[i].label, suggestions[i].snippet.name);
                    i = to;
                }
            }
            return { suggestions: suggestions };
        });
    };
    SnippetCompletionProvider.prototype.resolveCompletionItem = function (model, position, item) {
        return (item instanceof SnippetCompletion) ? item.resolve() : item;
    };
    SnippetCompletionProvider.prototype._getLanguageIdAtPosition = function (model, position) {
        // validate the `languageId` to ensure this is a user
        // facing language with a name and the chance to have
        // snippets, else fall back to the outer language
        model.tokenizeIfCheap(position.lineNumber);
        var languageId = model.getLanguageIdAtPosition(position.lineNumber, position.column);
        var language = this._modeService.getLanguageIdentifier(languageId).language;
        if (!this._modeService.getLanguageName(language)) {
            languageId = model.getLanguageIdentifier().id;
        }
        return languageId;
    };
    SnippetCompletionProvider._maxPrefix = 10000;
    SnippetCompletionProvider = __decorate([
        __param(0, IModeService),
        __param(1, ISnippetsService)
    ], SnippetCompletionProvider);
    return SnippetCompletionProvider;
}());
export { SnippetCompletionProvider };
