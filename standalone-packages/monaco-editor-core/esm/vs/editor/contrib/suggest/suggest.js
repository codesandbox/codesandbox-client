/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { first2 } from '../../../base/common/async';
import { isFalsyOrEmpty } from '../../../base/common/arrays';
import { compareIgnoreCase } from '../../../base/common/strings';
import { assign } from '../../../base/common/objects';
import { onUnexpectedExternalError } from '../../../base/common/errors';
import { registerDefaultLanguageCommand } from '../../browser/editorExtensions';
import { SuggestRegistry, SuggestTriggerKind } from '../../common/modes';
import { RawContextKey } from '../../../platform/contextkey/common/contextkey';
import { CancellationToken } from '../../../base/common/cancellation';
export var Context = {
    Visible: new RawContextKey('suggestWidgetVisible', false),
    MultipleSuggestions: new RawContextKey('suggestWidgetMultipleSuggestions', false),
    MakesTextEdit: new RawContextKey('suggestionMakesTextEdit', true),
    AcceptOnKey: new RawContextKey('suggestionSupportsAcceptOnKey', true),
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
    position = position.clone();
    // get provider groups, always add snippet suggestion provider
    var supports = SuggestRegistry.orderedGroups(model);
    // add snippets provider unless turned off
    if (snippetConfig !== 'none' && _snippetSuggestSupport) {
        supports.unshift([_snippetSuggestSupport]);
    }
    var suggestConext = context || { triggerKind: SuggestTriggerKind.Invoke };
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
                            fixOverwriteBeforeAfter(suggestion, container);
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
    var result = first2(factory, function () { return hasResult; }).then(function () { return allSuggestions.sort(getSuggestionComparator(snippetConfig)); });
    // result.then(items => {
    // 	console.log(model.getWordUntilPosition(position), items.map(item => `${item.suggestion.label}, type=${item.suggestion.type}, incomplete?${item.container.incomplete}, overwriteBefore=${item.suggestion.overwriteBefore}`));
    // 	return items;
    // }, err => {
    // 	console.warn(model.getWordUntilPosition(position), err);
    // });
    return result;
}
function fixOverwriteBeforeAfter(suggestion, container) {
    if (typeof suggestion.overwriteBefore !== 'number') {
        suggestion.overwriteBefore = 0;
    }
    if (typeof suggestion.overwriteAfter !== 'number' || suggestion.overwriteAfter < 0) {
        suggestion.overwriteAfter = 0;
    }
}
function createSuggestionResolver(provider, suggestion, model, position) {
    return function (token) {
        if (typeof provider.resolveCompletionItem === 'function') {
            return Promise.resolve(provider.resolveCompletionItem(model, position, suggestion, token)).then(function (value) { assign(suggestion, value); });
        }
        else {
            return Promise.resolve(void 0);
        }
    };
}
function createSuggesionFilter(snippetConfig) {
    if (snippetConfig === 'none') {
        return function (suggestion) { return suggestion.type !== 'snippet'; };
    }
    else {
        return function () { return true; };
    }
}
function defaultComparator(a, b) {
    var ret = 0;
    // check with 'sortText'
    if (typeof a.suggestion.sortText === 'string' && typeof b.suggestion.sortText === 'string') {
        ret = compareIgnoreCase(a.suggestion.sortText, b.suggestion.sortText);
    }
    // check with 'label'
    if (ret === 0) {
        ret = compareIgnoreCase(a.suggestion.label, b.suggestion.label);
    }
    // check with 'type' and lower snippets
    if (ret === 0 && a.suggestion.type !== b.suggestion.type) {
        if (a.suggestion.type === 'snippet') {
            ret = 1;
        }
        else if (b.suggestion.type === 'snippet') {
            ret = -1;
        }
    }
    return ret;
}
function snippetUpComparator(a, b) {
    if (a.suggestion.type !== b.suggestion.type) {
        if (a.suggestion.type === 'snippet') {
            return -1;
        }
        else if (b.suggestion.type === 'snippet') {
            return 1;
        }
    }
    return defaultComparator(a, b);
}
function snippetDownComparator(a, b) {
    if (a.suggestion.type !== b.suggestion.type) {
        if (a.suggestion.type === 'snippet') {
            return 1;
        }
        else if (b.suggestion.type === 'snippet') {
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
var _suggestions;
var _provider = new /** @class */ (function () {
    function class_1() {
    }
    class_1.prototype.provideCompletionItems = function () {
        return _suggestions && { suggestions: _suggestions };
    };
    return class_1;
}());
SuggestRegistry.register('*', _provider);
export function showSimpleSuggestions(editor, suggestions) {
    setTimeout(function () {
        _suggestions = suggestions;
        editor.getContribution('editor.contrib.suggestController').triggerSuggest([_provider]);
        _suggestions = undefined;
    }, 0);
}
