/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Range } from '../../common/core/range.js';
import { Token, TokenizationResult, TokenizationResult2 } from '../../common/core/token.js';
import * as modes from '../../common/modes.js';
import { LanguageConfigurationRegistry } from '../../common/modes/languageConfigurationRegistry.js';
import { ModesRegistry } from '../../common/modes/modesRegistry.js';
import * as standaloneEnums from '../../common/standalone/standaloneEnums.js';
import { StaticServices } from './standaloneServices.js';
import { compile } from '../common/monarch/monarchCompile.js';
import { createTokenizationSupport } from '../common/monarch/monarchLexer.js';
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
    return lid ? lid.id : 0;
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
 * Register a signature help provider (used by e.g. parameter hints).
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
            return Promise.resolve(provider.provideHover(model, position, token)).then(function (value) {
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
    return modes.CompletionProviderRegistry.register(languageId, provider);
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
        DocumentHighlightKind: standaloneEnums.DocumentHighlightKind,
        CompletionItemKind: standaloneEnums.CompletionItemKind,
        CompletionItemInsertTextRule: standaloneEnums.CompletionItemInsertTextRule,
        SymbolKind: standaloneEnums.SymbolKind,
        IndentAction: standaloneEnums.IndentAction,
        CompletionTriggerKind: standaloneEnums.CompletionTriggerKind,
        SignatureHelpTriggerReason: standaloneEnums.SignatureHelpTriggerReason,
        // classes
        FoldingRangeKind: modes.FoldingRangeKind,
    };
}
