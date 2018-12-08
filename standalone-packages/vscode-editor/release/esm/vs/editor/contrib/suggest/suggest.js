/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { first } from '../../../base/common/async.js';
import { isFalsyOrEmpty } from '../../../base/common/arrays.js';
import { assign } from '../../../base/common/objects.js';
import { onUnexpectedExternalError, canceled } from '../../../base/common/errors.js';
import { registerDefaultLanguageCommand } from '../../browser/editorExtensions.js';
import { CompletionProviderRegistry } from '../../common/modes.js';
import { RawContextKey } from '../../../platform/contextkey/common/contextkey.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { Range } from '../../common/core/range.js';
export var Context = {
    Visible: new RawContextKey('suggestWidgetVisible', false),
    MultipleSuggestions: new RawContextKey('suggestWidgetMultipleSuggestions', false),
    MakesTextEdit: new RawContextKey('suggestionMakesTextEdit', true),
    AcceptSuggestionsOnEnter: new RawContextKey('acceptSuggestionOnEnter', true)
};
var _snippetSuggestSupport;
export function getSnippetSuggestSupport() {
    return _snippetSuggestSupport;
}
export function setSnippetSuggestSupport(support) {
    var old = _snippetSuggestSupport;
    _snippetSuggestSupport = support;
    return old;
}
export function provideSuggestionItems(model, position, snippetConfig, onlyFrom, context, token) {
    if (snippetConfig === void 0) { snippetConfig = 'bottom'; }
    if (token === void 0) { token = CancellationToken.None; }
    var allSuggestions = [];
    var acceptSuggestion = createSuggesionFilter(snippetConfig);
    var wordUntil = model.getWordUntilPosition(position);
    var defaultRange = new Range(position.lineNumber, wordUntil.startColumn, position.lineNumber, wordUntil.endColumn);
    position = position.clone();
    // get provider groups, always add snippet suggestion provider
    var supports = CompletionProviderRegistry.orderedGroups(model);
    // add snippets provider unless turned off
    if (snippetConfig !== 'none' && _snippetSuggestSupport) {
        supports.unshift([_snippetSuggestSupport]);
    }
    var suggestConext = context || { triggerKind: 0 /* Invoke */ };
    // add suggestions from contributed providers - providers are ordered in groups of
    // equal score and once a group produces a result the process stops
    var hasResult = false;
    var factory = supports.map(function (supports) { return function () {
        // for each support in the group ask for suggestions
        return Promise.all(supports.map(function (support) {
            if (!isFalsyOrEmpty(onlyFrom) && onlyFrom.indexOf(support) < 0) {
                return undefined;
            }
            return Promise.resolve(support.provideCompletionItems(model, position, suggestConext, token)).then(function (container) {
                var len = allSuggestions.length;
                if (container && !isFalsyOrEmpty(container.suggestions)) {
                    for (var _i = 0, _a = container.suggestions; _i < _a.length; _i++) {
                        var suggestion = _a[_i];
                        if (acceptSuggestion(suggestion)) {
                            // fill in default range when missing
                            if (!suggestion.range) {
                                suggestion.range = defaultRange;
                            }
                            // fill in lower-case text
                            ensureLowerCaseVariants(suggestion);
                            allSuggestions.push({
                                position: position,
                                container: container,
                                suggestion: suggestion,
                                support: support,
                                resolve: createSuggestionResolver(support, suggestion, model, position)
                            });
                        }
                    }
                }
                if (len !== allSuggestions.length && support !== _snippetSuggestSupport) {
                    hasResult = true;
                }
            }, onUnexpectedExternalError);
        }));
    }; });
    var result = first(factory, function () {
        // stop on result or cancellation
        return false;
    }).then(function () {
        if (token.isCancellationRequested) {
            return Promise.reject(canceled());
        }
        return allSuggestions.sort(getSuggestionComparator(snippetConfig));
    });
    // result.then(items => {
    // 	console.log(model.getWordUntilPosition(position), items.map(item => `${item.suggestion.label}, type=${item.suggestion.type}, incomplete?${item.container.incomplete}, overwriteBefore=${item.suggestion.overwriteBefore}`));
    // 	return items;
    // }, err => {
    // 	console.warn(model.getWordUntilPosition(position), err);
    // });
    return result;
}
export function ensureLowerCaseVariants(suggestion) {
    if (!suggestion._labelLow) {
        suggestion._labelLow = suggestion.label.toLowerCase();
    }
    if (suggestion.sortText && !suggestion._sortTextLow) {
        suggestion._sortTextLow = suggestion.sortText.toLowerCase();
    }
    if (suggestion.filterText && !suggestion._filterTextLow) {
        suggestion._filterTextLow = suggestion.filterText.toLowerCase();
    }
}
function createSuggestionResolver(provider, suggestion, model, position) {
    var cached;
    return function (token) {
        if (!cached) {
            if (typeof provider.resolveCompletionItem === 'function') {
                cached = Promise.resolve(provider.resolveCompletionItem(model, position, suggestion, token)).then(function (value) { assign(suggestion, value); });
            }
            else {
                cached = Promise.resolve(void 0);
            }
        }
        return cached;
    };
}
function createSuggesionFilter(snippetConfig) {
    if (snippetConfig === 'none') {
        return function (suggestion) { return suggestion.kind !== 25 /* Snippet */; };
    }
    else {
        return function () { return true; };
    }
}
function defaultComparator(a, b) {
    // check with 'sortText'
    if (a.suggestion._sortTextLow && b.suggestion._sortTextLow) {
        if (a.suggestion._sortTextLow < b.suggestion._sortTextLow) {
            return -1;
        }
        else if (a.suggestion._sortTextLow > b.suggestion._sortTextLow) {
            return 1;
        }
    }
    // check with 'label'
    if (a.suggestion.label < b.suggestion.label) {
        return -1;
    }
    else if (a.suggestion.label > b.suggestion.label) {
        return 1;
    }
    // check with 'type'
    return a.suggestion.kind - b.suggestion.kind;
}
function snippetUpComparator(a, b) {
    if (a.suggestion.kind !== b.suggestion.kind) {
        if (a.suggestion.kind === 25 /* Snippet */) {
            return -1;
        }
        else if (b.suggestion.kind === 25 /* Snippet */) {
            return 1;
        }
    }
    return defaultComparator(a, b);
}
function snippetDownComparator(a, b) {
    if (a.suggestion.kind !== b.suggestion.kind) {
        if (a.suggestion.kind === 25 /* Snippet */) {
            return 1;
        }
        else if (b.suggestion.kind === 25 /* Snippet */) {
            return -1;
        }
    }
    return defaultComparator(a, b);
}
export function getSuggestionComparator(snippetConfig) {
    if (snippetConfig === 'top') {
        return snippetUpComparator;
    }
    else if (snippetConfig === 'bottom') {
        return snippetDownComparator;
    }
    else {
        return defaultComparator;
    }
}
registerDefaultLanguageCommand('_executeCompletionItemProvider', function (model, position, args) {
    var result = {
        incomplete: false,
        suggestions: []
    };
    var resolving = [];
    var maxItemsToResolve = args['maxItemsToResolve'] || 0;
    return provideSuggestionItems(model, position).then(function (items) {
        for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
            var item = items_1[_i];
            if (resolving.length < maxItemsToResolve) {
                resolving.push(item.resolve(CancellationToken.None));
            }
            result.incomplete = result.incomplete || item.container.incomplete;
            result.suggestions.push(item.suggestion);
        }
    }).then(function () {
        return Promise.all(resolving);
    }).then(function () {
        return result;
    });
});
var _provider = new /** @class */ (function () {
    function class_1() {
        this.onlyOnceSuggestions = [];
    }
    class_1.prototype.provideCompletionItems = function () {
        var suggestions = this.onlyOnceSuggestions.slice(0);
        var result = { suggestions: suggestions };
        this.onlyOnceSuggestions.length = 0;
        return result;
    };
    return class_1;
}());
CompletionProviderRegistry.register('*', _provider);
export function showSimpleSuggestions(editor, suggestions) {
    setTimeout(function () {
        var _a;
        (_a = _provider.onlyOnceSuggestions).push.apply(_a, suggestions);
        editor.getContribution('editor.contrib.suggestController').triggerSuggest([_provider]);
    }, 0);
}
