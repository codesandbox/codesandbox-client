/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { TPromise } from '../../../base/common/winjs.base';
import { ModesRegistry } from '../../common/modes/modesRegistry';
import { StaticServices } from './standaloneServices';
import * as modes from '../../common/modes';
import { IndentAction } from '../../common/modes/languageConfiguration';
import { Position } from '../../common/core/position';
import { Range } from '../../common/core/range';
import { toPromiseLike } from '../../../base/common/async';
import { compile } from '../common/monarch/monarchCompile';
import { createTokenizationSupport } from '../common/monarch/monarchLexer';
import { LanguageConfigurationRegistry } from '../../common/modes/languageConfigurationRegistry';
import { Token, TokenizationResult, TokenizationResult2 } from '../../common/core/token';
/**
 * Register information about a new language.
 */
export function register(language) {
    ModesRegistry.registerLanguage(language);
}
/**
 * Get the information of all the registered languages.
 */
export function getLanguages() {
    var result = [];
    result = result.concat(ModesRegistry.getLanguages());
    return result;
}
export function getEncodedLanguageId(languageId) {
    var lid = StaticServices.modeService.get().getLanguageIdentifier(languageId);
    return lid && lid.id;
}
/**
 * An event emitted when a language is first time needed (e.g. a model has it set).
 * @event
 */
export function onLanguage(languageId, callback) {
    var disposable = StaticServices.modeService.get().onDidCreateMode(function (mode) {
        if (mode.getId() === languageId) {
            // stop listening
            disposable.dispose();
            // invoke actual listener
            callback();
        }
    });
    return disposable;
}
/**
 * Set the editing configuration for a language.
 */
export function setLanguageConfiguration(languageId, configuration) {
    var languageIdentifier = StaticServices.modeService.get().getLanguageIdentifier(languageId);
    if (!languageIdentifier) {
        throw new Error("Cannot set configuration for unknown language " + languageId);
    }
    return LanguageConfigurationRegistry.register(languageIdentifier, configuration);
}
/**
 * @internal
 */
var EncodedTokenizationSupport2Adapter = /** @class */ (function () {
    function EncodedTokenizationSupport2Adapter(actual) {
        this._actual = actual;
    }
    EncodedTokenizationSupport2Adapter.prototype.getInitialState = function () {
        return this._actual.getInitialState();
    };
    EncodedTokenizationSupport2Adapter.prototype.tokenize = function (line, state, offsetDelta) {
        throw new Error('Not supported!');
    };
    EncodedTokenizationSupport2Adapter.prototype.tokenize2 = function (line, state) {
        var result = this._actual.tokenizeEncoded(line, state);
        return new TokenizationResult2(result.tokens, result.endState);
    };
    return EncodedTokenizationSupport2Adapter;
}());
export { EncodedTokenizationSupport2Adapter };
/**
 * @internal
 */
var TokenizationSupport2Adapter = /** @class */ (function () {
    function TokenizationSupport2Adapter(standaloneThemeService, languageIdentifier, actual) {
        this._standaloneThemeService = standaloneThemeService;
        this._languageIdentifier = languageIdentifier;
        this._actual = actual;
    }
    TokenizationSupport2Adapter.prototype.getInitialState = function () {
        return this._actual.getInitialState();
    };
    TokenizationSupport2Adapter.prototype._toClassicTokens = function (tokens, language, offsetDelta) {
        var result = [];
        var previousStartIndex = 0;
        for (var i = 0, len = tokens.length; i < len; i++) {
            var t = tokens[i];
            var startIndex = t.startIndex;
            // Prevent issues stemming from a buggy external tokenizer.
            if (i === 0) {
                // Force first token to start at first index!
                startIndex = 0;
            }
            else if (startIndex < previousStartIndex) {
                // Force tokens to be after one another!
                startIndex = previousStartIndex;
            }
            result[i] = new Token(startIndex + offsetDelta, t.scopes, language);
            previousStartIndex = startIndex;
        }
        return result;
    };
    TokenizationSupport2Adapter.prototype.tokenize = function (line, state, offsetDelta) {
        var actualResult = this._actual.tokenize(line, state);
        var tokens = this._toClassicTokens(actualResult.tokens, this._languageIdentifier.language, offsetDelta);
        var endState;
        // try to save an object if possible
        if (actualResult.endState.equals(state)) {
            endState = state;
        }
        else {
            endState = actualResult.endState;
        }
        return new TokenizationResult(tokens, endState);
    };
    TokenizationSupport2Adapter.prototype._toBinaryTokens = function (tokens, offsetDelta) {
        var languageId = this._languageIdentifier.id;
        var tokenTheme = this._standaloneThemeService.getTheme().tokenTheme;
        var result = [], resultLen = 0;
        var previousStartIndex = 0;
        for (var i = 0, len = tokens.length; i < len; i++) {
            var t = tokens[i];
            var metadata = tokenTheme.match(languageId, t.scopes);
            if (resultLen > 0 && result[resultLen - 1] === metadata) {
                // same metadata
                continue;
            }
            var startIndex = t.startIndex;
            // Prevent issues stemming from a buggy external tokenizer.
            if (i === 0) {
                // Force first token to start at first index!
                startIndex = 0;
            }
            else if (startIndex < previousStartIndex) {
                // Force tokens to be after one another!
                startIndex = previousStartIndex;
            }
            result[resultLen++] = startIndex + offsetDelta;
            result[resultLen++] = metadata;
            previousStartIndex = startIndex;
        }
        var actualResult = new Uint32Array(resultLen);
        for (var i = 0; i < resultLen; i++) {
            actualResult[i] = result[i];
        }
        return actualResult;
    };
    TokenizationSupport2Adapter.prototype.tokenize2 = function (line, state, offsetDelta) {
        var actualResult = this._actual.tokenize(line, state);
        var tokens = this._toBinaryTokens(actualResult.tokens, offsetDelta);
        var endState;
        // try to save an object if possible
        if (actualResult.endState.equals(state)) {
            endState = state;
        }
        else {
            endState = actualResult.endState;
        }
        return new TokenizationResult2(tokens, endState);
    };
    return TokenizationSupport2Adapter;
}());
export { TokenizationSupport2Adapter };
function isEncodedTokensProvider(provider) {
    return provider['tokenizeEncoded'];
}
/**
 * Set the tokens provider for a language (manual implementation).
 */
export function setTokensProvider(languageId, provider) {
    var languageIdentifier = StaticServices.modeService.get().getLanguageIdentifier(languageId);
    if (!languageIdentifier) {
        throw new Error("Cannot set tokens provider for unknown language " + languageId);
    }
    var adapter;
    if (isEncodedTokensProvider(provider)) {
        adapter = new EncodedTokenizationSupport2Adapter(provider);
    }
    else {
        adapter = new TokenizationSupport2Adapter(StaticServices.standaloneThemeService.get(), languageIdentifier, provider);
    }
    return modes.TokenizationRegistry.register(languageId, adapter);
}
/**
 * Set the tokens provider for a language (monarch implementation).
 */
export function setMonarchTokensProvider(languageId, languageDef) {
    var lexer = compile(languageId, languageDef);
    var adapter = createTokenizationSupport(StaticServices.modeService.get(), StaticServices.standaloneThemeService.get(), languageId, lexer);
    return modes.TokenizationRegistry.register(languageId, adapter);
}
/**
 * Register a reference provider (used by e.g. reference search).
 */
export function registerReferenceProvider(languageId, provider) {
    return modes.ReferenceProviderRegistry.register(languageId, provider);
}
/**
 * Register a rename provider (used by e.g. rename symbol).
 */
export function registerRenameProvider(languageId, provider) {
    return modes.RenameProviderRegistry.register(languageId, provider);
}
/**
 * Register a signature help provider (used by e.g. paremeter hints).
 */
export function registerSignatureHelpProvider(languageId, provider) {
    return modes.SignatureHelpProviderRegistry.register(languageId, provider);
}
/**
 * Register a hover provider (used by e.g. editor hover).
 */
export function registerHoverProvider(languageId, provider) {
    return modes.HoverProviderRegistry.register(languageId, {
        provideHover: function (model, position, token) {
            var word = model.getWordAtPosition(position);
            return toPromiseLike(provider.provideHover(model, position, token)).then(function (value) {
                if (!value) {
                    return undefined;
                }
                if (!value.range && word) {
                    value.range = new Range(position.lineNumber, word.startColumn, position.lineNumber, word.endColumn);
                }
                if (!value.range) {
                    value.range = new Range(position.lineNumber, position.column, position.lineNumber, position.column);
                }
                return value;
            });
        }
    });
}
/**
 * Register a document symbol provider (used by e.g. outline).
 */
export function registerDocumentSymbolProvider(languageId, provider) {
    return modes.DocumentSymbolProviderRegistry.register(languageId, provider);
}
/**
 * Register a document highlight provider (used by e.g. highlight occurrences).
 */
export function registerDocumentHighlightProvider(languageId, provider) {
    return modes.DocumentHighlightProviderRegistry.register(languageId, provider);
}
/**
 * Register a definition provider (used by e.g. go to definition).
 */
export function registerDefinitionProvider(languageId, provider) {
    return modes.DefinitionProviderRegistry.register(languageId, provider);
}
/**
 * Register a implementation provider (used by e.g. go to implementation).
 */
export function registerImplementationProvider(languageId, provider) {
    return modes.ImplementationProviderRegistry.register(languageId, provider);
}
/**
 * Register a type definition provider (used by e.g. go to type definition).
 */
export function registerTypeDefinitionProvider(languageId, provider) {
    return modes.TypeDefinitionProviderRegistry.register(languageId, provider);
}
/**
 * Register a code lens provider (used by e.g. inline code lenses).
 */
export function registerCodeLensProvider(languageId, provider) {
    return modes.CodeLensProviderRegistry.register(languageId, provider);
}
/**
 * Register a code action provider (used by e.g. quick fix).
 */
export function registerCodeActionProvider(languageId, provider) {
    return modes.CodeActionProviderRegistry.register(languageId, {
        provideCodeActions: function (model, range, context, token) {
            var markers = StaticServices.markerService.get().read({ resource: model.uri }).filter(function (m) {
                return Range.areIntersectingOrTouching(m, range);
            });
            return provider.provideCodeActions(model, range, { markers: markers, only: context.only }, token);
        }
    });
}
/**
 * Register a formatter that can handle only entire models.
 */
export function registerDocumentFormattingEditProvider(languageId, provider) {
    return modes.DocumentFormattingEditProviderRegistry.register(languageId, provider);
}
/**
 * Register a formatter that can handle a range inside a model.
 */
export function registerDocumentRangeFormattingEditProvider(languageId, provider) {
    return modes.DocumentRangeFormattingEditProviderRegistry.register(languageId, provider);
}
/**
 * Register a formatter than can do formatting as the user types.
 */
export function registerOnTypeFormattingEditProvider(languageId, provider) {
    return modes.OnTypeFormattingEditProviderRegistry.register(languageId, provider);
}
/**
 * Register a link provider that can find links in text.
 */
export function registerLinkProvider(languageId, provider) {
    return modes.LinkProviderRegistry.register(languageId, provider);
}
/**
 * Register a completion item provider (use by e.g. suggestions).
 */
export function registerCompletionItemProvider(languageId, provider) {
    var adapter = new SuggestAdapter(provider);
    return modes.SuggestRegistry.register(languageId, {
        triggerCharacters: provider.triggerCharacters,
        provideCompletionItems: function (model, position, context, token) {
            return adapter.provideCompletionItems(model, position, context, token);
        },
        resolveCompletionItem: function (model, position, suggestion, token) {
            return adapter.resolveCompletionItem(model, position, suggestion, token);
        }
    });
}
/**
 * Register a document color provider (used by Color Picker, Color Decorator).
 */
export function registerColorProvider(languageId, provider) {
    return modes.ColorProviderRegistry.register(languageId, provider);
}
/**
 * Register a folding range provider
 */
export function registerFoldingRangeProvider(languageId, provider) {
    return modes.FoldingRangeProviderRegistry.register(languageId, provider);
}
/**
 * Completion item kinds.
 */
export var CompletionItemKind;
(function (CompletionItemKind) {
    CompletionItemKind[CompletionItemKind["Text"] = 0] = "Text";
    CompletionItemKind[CompletionItemKind["Method"] = 1] = "Method";
    CompletionItemKind[CompletionItemKind["Function"] = 2] = "Function";
    CompletionItemKind[CompletionItemKind["Constructor"] = 3] = "Constructor";
    CompletionItemKind[CompletionItemKind["Field"] = 4] = "Field";
    CompletionItemKind[CompletionItemKind["Variable"] = 5] = "Variable";
    CompletionItemKind[CompletionItemKind["Class"] = 6] = "Class";
    CompletionItemKind[CompletionItemKind["Interface"] = 7] = "Interface";
    CompletionItemKind[CompletionItemKind["Module"] = 8] = "Module";
    CompletionItemKind[CompletionItemKind["Property"] = 9] = "Property";
    CompletionItemKind[CompletionItemKind["Unit"] = 10] = "Unit";
    CompletionItemKind[CompletionItemKind["Value"] = 11] = "Value";
    CompletionItemKind[CompletionItemKind["Enum"] = 12] = "Enum";
    CompletionItemKind[CompletionItemKind["Keyword"] = 13] = "Keyword";
    CompletionItemKind[CompletionItemKind["Snippet"] = 14] = "Snippet";
    CompletionItemKind[CompletionItemKind["Color"] = 15] = "Color";
    CompletionItemKind[CompletionItemKind["File"] = 16] = "File";
    CompletionItemKind[CompletionItemKind["Reference"] = 17] = "Reference";
    CompletionItemKind[CompletionItemKind["Folder"] = 18] = "Folder";
})(CompletionItemKind || (CompletionItemKind = {}));
function convertKind(kind) {
    switch (kind) {
        case CompletionItemKind.Method: return 'method';
        case CompletionItemKind.Function: return 'function';
        case CompletionItemKind.Constructor: return 'constructor';
        case CompletionItemKind.Field: return 'field';
        case CompletionItemKind.Variable: return 'variable';
        case CompletionItemKind.Class: return 'class';
        case CompletionItemKind.Interface: return 'interface';
        case CompletionItemKind.Module: return 'module';
        case CompletionItemKind.Property: return 'property';
        case CompletionItemKind.Unit: return 'unit';
        case CompletionItemKind.Value: return 'value';
        case CompletionItemKind.Enum: return 'enum';
        case CompletionItemKind.Keyword: return 'keyword';
        case CompletionItemKind.Snippet: return 'snippet';
        case CompletionItemKind.Text: return 'text';
        case CompletionItemKind.Color: return 'color';
        case CompletionItemKind.File: return 'file';
        case CompletionItemKind.Reference: return 'reference';
        case CompletionItemKind.Folder: return 'folder';
    }
    return 'property';
}
var SuggestAdapter = /** @class */ (function () {
    function SuggestAdapter(provider) {
        this._provider = provider;
    }
    SuggestAdapter.from = function (item, position, wordStartPos) {
        var suggestion = {
            _actual: item,
            label: item.label,
            insertText: item.label,
            type: convertKind(item.kind),
            detail: item.detail,
            documentation: item.documentation,
            command: item.command,
            sortText: item.sortText,
            filterText: item.filterText,
            snippetType: 'internal',
            additionalTextEdits: item.additionalTextEdits,
            commitCharacters: item.commitCharacters
        };
        var editRange = item.textEdit ? item.textEdit.range : item.range;
        if (editRange) {
            var isSingleLine = (editRange.startLineNumber === editRange.endLineNumber);
            // invalid text edit
            if (!isSingleLine || editRange.startLineNumber !== position.lineNumber) {
                console.warn('INVALID range, must be single line and on the same line');
                return null;
            }
            // insert the text of the edit and create a dedicated
            // suggestion-container with overwrite[Before|After]
            suggestion.overwriteBefore = position.column - editRange.startColumn;
            suggestion.overwriteAfter = editRange.endColumn - position.column;
        }
        else {
            suggestion.overwriteBefore = position.column - wordStartPos.column;
            suggestion.overwriteAfter = 0;
        }
        if (item.textEdit) {
            suggestion.insertText = item.textEdit.text;
        }
        else if (typeof item.insertText === 'object' && typeof item.insertText.value === 'string') {
            suggestion.insertText = item.insertText.value;
            suggestion.snippetType = 'textmate';
        }
        else if (typeof item.insertText === 'string') {
            suggestion.insertText = item.insertText;
        }
        return suggestion;
    };
    SuggestAdapter.prototype.provideCompletionItems = function (model, position, context, token) {
        var result = this._provider.provideCompletionItems(model, position, token, context);
        return toPromiseLike(result).then(function (value) {
            var result = {
                suggestions: []
            };
            // default text edit start
            var wordStartPos = position;
            var word = model.getWordUntilPosition(position);
            if (word) {
                wordStartPos = new Position(wordStartPos.lineNumber, word.startColumn);
            }
            var list;
            if (Array.isArray(value)) {
                list = {
                    items: value,
                    isIncomplete: false
                };
            }
            else if (typeof value === 'object' && Array.isArray(value.items)) {
                list = value;
                result.incomplete = list.isIncomplete;
            }
            else if (!value) {
                // undefined and null are valid results
                return undefined;
            }
            else {
                // warn about everything else
                console.warn('INVALID result from completion provider. expected CompletionItem-array or CompletionList but got:', value);
            }
            for (var i = 0; i < list.items.length; i++) {
                var item = list.items[i];
                var suggestion = SuggestAdapter.from(item, position, wordStartPos);
                if (suggestion) {
                    result.suggestions.push(suggestion);
                }
            }
            return result;
        });
    };
    SuggestAdapter.prototype.resolveCompletionItem = function (model, position, suggestion, token) {
        if (typeof this._provider.resolveCompletionItem !== 'function') {
            return TPromise.as(suggestion);
        }
        var item = suggestion._actual;
        if (!item) {
            return TPromise.as(suggestion);
        }
        return toPromiseLike(this._provider.resolveCompletionItem(item, token)).then(function (resolvedItem) {
            var wordStartPos = position;
            var word = model.getWordUntilPosition(position);
            if (word) {
                wordStartPos = new Position(wordStartPos.lineNumber, word.startColumn);
            }
            return SuggestAdapter.from(resolvedItem, position, wordStartPos);
        });
    };
    return SuggestAdapter;
}());
/**
 * @internal
 */
export function createMonacoLanguagesAPI() {
    return {
        register: register,
        getLanguages: getLanguages,
        onLanguage: onLanguage,
        getEncodedLanguageId: getEncodedLanguageId,
        // provider methods
        setLanguageConfiguration: setLanguageConfiguration,
        setTokensProvider: setTokensProvider,
        setMonarchTokensProvider: setMonarchTokensProvider,
        registerReferenceProvider: registerReferenceProvider,
        registerRenameProvider: registerRenameProvider,
        registerCompletionItemProvider: registerCompletionItemProvider,
        registerSignatureHelpProvider: registerSignatureHelpProvider,
        registerHoverProvider: registerHoverProvider,
        registerDocumentSymbolProvider: registerDocumentSymbolProvider,
        registerDocumentHighlightProvider: registerDocumentHighlightProvider,
        registerDefinitionProvider: registerDefinitionProvider,
        registerImplementationProvider: registerImplementationProvider,
        registerTypeDefinitionProvider: registerTypeDefinitionProvider,
        registerCodeLensProvider: registerCodeLensProvider,
        registerCodeActionProvider: registerCodeActionProvider,
        registerDocumentFormattingEditProvider: registerDocumentFormattingEditProvider,
        registerDocumentRangeFormattingEditProvider: registerDocumentRangeFormattingEditProvider,
        registerOnTypeFormattingEditProvider: registerOnTypeFormattingEditProvider,
        registerLinkProvider: registerLinkProvider,
        registerColorProvider: registerColorProvider,
        registerFoldingRangeProvider: registerFoldingRangeProvider,
        // enums
        DocumentHighlightKind: modes.DocumentHighlightKind,
        CompletionItemKind: CompletionItemKind,
        SymbolKind: modes.SymbolKind,
        IndentAction: IndentAction,
        SuggestTriggerKind: modes.SuggestTriggerKind,
        CommentThreadCollapsibleState: modes.CommentThreadCollapsibleState,
        FoldingRangeKind: modes.FoldingRangeKind
    };
}
