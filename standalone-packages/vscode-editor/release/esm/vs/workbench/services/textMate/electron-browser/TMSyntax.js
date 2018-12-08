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
import * as nls from '../../../../nls.js';
import * as dom from '../../../../base/browser/dom.js';
import { Color } from '../../../../base/common/color.js';
import { onUnexpectedError } from '../../../../base/common/errors.js';
import { Emitter } from '../../../../base/common/event.js';
import * as resources from '../../../../base/common/resources.js';
import * as types from '../../../../base/common/types.js';
import { TokenizationResult2 } from '../../../../editor/common/core/token.js';
import { TokenMetadata, TokenizationRegistry } from '../../../../editor/common/modes.js';
import { nullTokenize2 } from '../../../../editor/common/modes/nullMode.js';
import { generateTokensCSSForColorMap } from '../../../../editor/common/modes/supports/tokenization.js';
import { IModeService } from '../../../../editor/common/services/modeService.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { IExtensionService } from '../../extensions/common/extensions.js';
import { grammarsExtPoint } from './TMGrammars.js';
import { IWorkbenchThemeService } from '../../themes/common/workbenchThemeService.js';
import { StandardTokenType } from '../../../../../vscode-textmate.js';
var TMScopeRegistry = /** @class */ (function () {
    function TMScopeRegistry() {
        this._onDidEncounterLanguage = new Emitter();
        this.onDidEncounterLanguage = this._onDidEncounterLanguage.event;
        this._scopeNameToLanguageRegistration = Object.create(null);
        this._encounteredLanguages = [];
    }
    TMScopeRegistry.prototype.register = function (scopeName, grammarLocation, embeddedLanguages, tokenTypes) {
        if (this._scopeNameToLanguageRegistration[scopeName]) {
            var existingRegistration = this._scopeNameToLanguageRegistration[scopeName];
            if (!resources.isEqual(existingRegistration.grammarLocation, grammarLocation)) {
                console.warn("Overwriting grammar scope name to file mapping for scope " + scopeName + ".\n" +
                    ("Old grammar file: " + existingRegistration.grammarLocation.toString() + ".\n") +
                    ("New grammar file: " + grammarLocation.toString()));
            }
        }
        this._scopeNameToLanguageRegistration[scopeName] = new TMLanguageRegistration(scopeName, grammarLocation, embeddedLanguages, tokenTypes);
    };
    TMScopeRegistry.prototype.getLanguageRegistration = function (scopeName) {
        return this._scopeNameToLanguageRegistration[scopeName] || null;
    };
    TMScopeRegistry.prototype.getGrammarLocation = function (scopeName) {
        var data = this.getLanguageRegistration(scopeName);
        return data ? data.grammarLocation : null;
    };
    /**
     * To be called when tokenization found/hit an embedded language.
     */
    TMScopeRegistry.prototype.onEncounteredLanguage = function (languageId) {
        if (!this._encounteredLanguages[languageId]) {
            this._encounteredLanguages[languageId] = true;
            this._onDidEncounterLanguage.fire(languageId);
        }
    };
    return TMScopeRegistry;
}());
export { TMScopeRegistry };
var TMLanguageRegistration = /** @class */ (function () {
    function TMLanguageRegistration(scopeName, grammarLocation, embeddedLanguages, tokenTypes) {
        this.scopeName = scopeName;
        this.grammarLocation = grammarLocation;
        // embeddedLanguages handling
        this.embeddedLanguages = Object.create(null);
        if (embeddedLanguages) {
            // If embeddedLanguages are configured, fill in `this._embeddedLanguages`
            var scopes = Object.keys(embeddedLanguages);
            for (var i = 0, len = scopes.length; i < len; i++) {
                var scope = scopes[i];
                var language = embeddedLanguages[scope];
                if (typeof language !== 'string') {
                    // never hurts to be too careful
                    continue;
                }
                this.embeddedLanguages[scope] = language;
            }
        }
        this.tokenTypes = Object.create(null);
        if (tokenTypes) {
            // If tokenTypes is configured, fill in `this._tokenTypes`
            var scopes = Object.keys(tokenTypes);
            for (var i = 0, len = scopes.length; i < len; i++) {
                var scope = scopes[i];
                var tokenType = tokenTypes[scope];
                switch (tokenType) {
                    case 'string':
                        this.tokenTypes[scope] = StandardTokenType.String;
                        break;
                    case 'other':
                        this.tokenTypes[scope] = StandardTokenType.Other;
                        break;
                    case 'comment':
                        this.tokenTypes[scope] = StandardTokenType.Comment;
                        break;
                }
            }
        }
    }
    return TMLanguageRegistration;
}());
export { TMLanguageRegistration };
var TextMateService = /** @class */ (function () {
    function TextMateService(modeService, themeService, fileService, notificationService, logService, extensionService) {
        var _this = this;
        this._styleElement = dom.createStyleSheet();
        this._styleElement.className = 'vscode-tokens-styles';
        this._modeService = modeService;
        this._themeService = themeService;
        this._fileService = fileService;
        this._logService = logService;
        this._scopeRegistry = new TMScopeRegistry();
        this.onDidEncounterLanguage = this._scopeRegistry.onDidEncounterLanguage;
        this._injections = {};
        this._injectedEmbeddedLanguages = {};
        this._languageToScope = new Map();
        this._notificationService = notificationService;
        this._grammarRegistry = null;
        grammarsExtPoint.setHandler(function (extensions) {
            for (var i = 0; i < extensions.length; i++) {
                var grammars = extensions[i].value;
                for (var j = 0; j < grammars.length; j++) {
                    _this._handleGrammarExtensionPointUser(extensions[i].description.extensionLocation, grammars[j], extensions[i].collector);
                }
            }
        });
        // Generate some color map until the grammar registry is loaded
        var colorTheme = this._themeService.getColorTheme();
        var defaultForeground = Color.transparent;
        var defaultBackground = Color.transparent;
        for (var i = 0, len = colorTheme.tokenColors.length; i < len; i++) {
            var rule = colorTheme.tokenColors[i];
            if (!rule.scope && rule.settings) {
                if (rule.settings.foreground) {
                    defaultForeground = Color.fromHex(rule.settings.foreground);
                }
                if (rule.settings.background) {
                    defaultBackground = Color.fromHex(rule.settings.background);
                }
            }
        }
        TokenizationRegistry.setColorMap([null, defaultForeground, defaultBackground]);
        this._modeService.onDidCreateMode(function (mode) {
            var modeId = mode.getId();
            // Modes can be instantiated before the extension points have finished registering
            extensionService.whenInstalledExtensionsRegistered().then(function () {
                if (_this._languageToScope.has(modeId)) {
                    _this.registerDefinition(modeId);
                }
            });
        });
    }
    TextMateService.prototype._getOrCreateGrammarRegistry = function () {
        var _this = this;
        if (!this._grammarRegistry) {
            this._grammarRegistry = import('vscode-textmate.js').then(function (_a) {
                var Registry = _a.Registry, INITIAL = _a.INITIAL, parseRawGrammar = _a.parseRawGrammar;
                var grammarRegistry = new Registry({
                    loadGrammar: function (scopeName) {
                        var location = _this._scopeRegistry.getGrammarLocation(scopeName);
                        if (!location) {
                            console.log("No grammar found for scope " + scopeName);
                            _this._logService.trace("No grammar found for scope " + scopeName);
                            return null;
                        }
                        return _this._fileService.resolveContent(location, { encoding: 'utf8' }).then(function (content) {
                            return parseRawGrammar(content.value, location.path);
                        }, function (e) {
                            console.log("Unable to load and parse grammar for scope " + scopeName + " from " + location, e);
                            _this._logService.error("Unable to load and parse grammar for scope " + scopeName + " from " + location, e);
                            return null;
                        });
                    },
                    getInjections: function (scopeName) {
                        var scopeParts = scopeName.split('.');
                        var injections = [];
                        for (var i = 1; i <= scopeParts.length; i++) {
                            var subScopeName = scopeParts.slice(0, i).join('.');
                            injections = injections.concat(_this._injections[subScopeName]);
                        }
                        return injections;
                    }
                });
                _this._updateTheme(grammarRegistry);
                _this._themeService.onDidColorThemeChange(function (e) { return _this._updateTheme(grammarRegistry); });
                return [grammarRegistry, INITIAL];
            });
        }
        return this._grammarRegistry;
    };
    TextMateService._toColorMap = function (colorMap) {
        var result = [null];
        for (var i = 1, len = colorMap.length; i < len; i++) {
            result[i] = Color.fromHex(colorMap[i]);
        }
        return result;
    };
    TextMateService.prototype._updateTheme = function (grammarRegistry) {
        var colorTheme = this._themeService.getColorTheme();
        if (!this.compareTokenRules(colorTheme.tokenColors)) {
            return;
        }
        grammarRegistry.setTheme({ name: colorTheme.label, settings: colorTheme.tokenColors });
        var colorMap = TextMateService._toColorMap(grammarRegistry.getColorMap());
        var cssRules = generateTokensCSSForColorMap(colorMap);
        this._styleElement.innerHTML = cssRules;
        TokenizationRegistry.setColorMap(colorMap);
    };
    TextMateService.prototype.compareTokenRules = function (newRules) {
        var currRules = this._currentTokenColors;
        this._currentTokenColors = newRules;
        if (!newRules || !currRules || newRules.length !== currRules.length) {
            return true;
        }
        for (var i = newRules.length - 1; i >= 0; i--) {
            var r1 = newRules[i];
            var r2 = currRules[i];
            if (r1.scope !== r2.scope) {
                return true;
            }
            var s1 = r1.settings;
            var s2 = r2.settings;
            if (s1 && s2) {
                if (s1.fontStyle !== s2.fontStyle || s1.foreground !== s2.foreground || s1.background !== s2.background) {
                    return true;
                }
            }
            else if (!s1 || !s2) {
                return true;
            }
        }
        return false;
    };
    TextMateService.prototype._handleGrammarExtensionPointUser = function (extensionLocation, syntax, collector) {
        if (syntax.language && ((typeof syntax.language !== 'string') || !this._modeService.isRegisteredMode(syntax.language))) {
            collector.error(nls.localize('invalid.language', "Unknown language in `contributes.{0}.language`. Provided value: {1}", grammarsExtPoint.name, String(syntax.language)));
            return;
        }
        if (!syntax.scopeName || (typeof syntax.scopeName !== 'string')) {
            collector.error(nls.localize('invalid.scopeName', "Expected string in `contributes.{0}.scopeName`. Provided value: {1}", grammarsExtPoint.name, String(syntax.scopeName)));
            return;
        }
        if (!syntax.path || (typeof syntax.path !== 'string')) {
            collector.error(nls.localize('invalid.path.0', "Expected string in `contributes.{0}.path`. Provided value: {1}", grammarsExtPoint.name, String(syntax.path)));
            return;
        }
        if (syntax.injectTo && (!Array.isArray(syntax.injectTo) || syntax.injectTo.some(function (scope) { return typeof scope !== 'string'; }))) {
            collector.error(nls.localize('invalid.injectTo', "Invalid value in `contributes.{0}.injectTo`. Must be an array of language scope names. Provided value: {1}", grammarsExtPoint.name, JSON.stringify(syntax.injectTo)));
            return;
        }
        if (syntax.embeddedLanguages && !types.isObject(syntax.embeddedLanguages)) {
            collector.error(nls.localize('invalid.embeddedLanguages', "Invalid value in `contributes.{0}.embeddedLanguages`. Must be an object map from scope name to language. Provided value: {1}", grammarsExtPoint.name, JSON.stringify(syntax.embeddedLanguages)));
            return;
        }
        if (syntax.tokenTypes && !types.isObject(syntax.tokenTypes)) {
            collector.error(nls.localize('invalid.tokenTypes', "Invalid value in `contributes.{0}.tokenTypes`. Must be an object map from scope name to token type. Provided value: {1}", grammarsExtPoint.name, JSON.stringify(syntax.tokenTypes)));
            return;
        }
        var grammarLocation = resources.joinPath(extensionLocation, syntax.path);
        if (!resources.isEqualOrParent(grammarLocation, extensionLocation)) {
            collector.warn(nls.localize('invalid.path.1', "Expected `contributes.{0}.path` ({1}) to be included inside extension's folder ({2}). This might make the extension non-portable.", grammarsExtPoint.name, grammarLocation.path, extensionLocation.path));
        }
        this._scopeRegistry.register(syntax.scopeName, grammarLocation, syntax.embeddedLanguages, syntax.tokenTypes);
        if (syntax.injectTo) {
            for (var _i = 0, _a = syntax.injectTo; _i < _a.length; _i++) {
                var injectScope = _a[_i];
                var injections = this._injections[injectScope];
                if (!injections) {
                    this._injections[injectScope] = injections = [];
                }
                injections.push(syntax.scopeName);
            }
            if (syntax.embeddedLanguages) {
                for (var _b = 0, _c = syntax.injectTo; _b < _c.length; _b++) {
                    var injectScope = _c[_b];
                    var injectedEmbeddedLanguages = this._injectedEmbeddedLanguages[injectScope];
                    if (!injectedEmbeddedLanguages) {
                        this._injectedEmbeddedLanguages[injectScope] = injectedEmbeddedLanguages = [];
                    }
                    injectedEmbeddedLanguages.push(syntax.embeddedLanguages);
                }
            }
        }
        var modeId = syntax.language;
        if (modeId) {
            this._languageToScope.set(modeId, syntax.scopeName);
        }
    };
    TextMateService.prototype._resolveEmbeddedLanguages = function (embeddedLanguages) {
        var scopes = Object.keys(embeddedLanguages);
        var result = Object.create(null);
        for (var i = 0, len = scopes.length; i < len; i++) {
            var scope = scopes[i];
            var language = embeddedLanguages[scope];
            var languageIdentifier = this._modeService.getLanguageIdentifier(language);
            if (languageIdentifier) {
                result[scope] = languageIdentifier.id;
            }
        }
        return result;
    };
    TextMateService.prototype.createGrammar = function (modeId) {
        return this._createGrammar(modeId).then(function (r) { return r.grammar; });
    };
    TextMateService.prototype._createGrammar = function (modeId) {
        var scopeName = this._languageToScope.get(modeId);
        var languageRegistration = this._scopeRegistry.getLanguageRegistration(scopeName);
        if (!languageRegistration) {
            // No TM grammar defined
            return Promise.reject(new Error(nls.localize('no-tm-grammar', "No TM Grammar registered for this language.")));
        }
        var embeddedLanguages = this._resolveEmbeddedLanguages(languageRegistration.embeddedLanguages);
        var rawInjectedEmbeddedLanguages = this._injectedEmbeddedLanguages[scopeName];
        if (rawInjectedEmbeddedLanguages) {
            var injectedEmbeddedLanguages = rawInjectedEmbeddedLanguages.map(this._resolveEmbeddedLanguages.bind(this));
            for (var _i = 0, injectedEmbeddedLanguages_1 = injectedEmbeddedLanguages; _i < injectedEmbeddedLanguages_1.length; _i++) {
                var injected = injectedEmbeddedLanguages_1[_i];
                for (var _a = 0, _b = Object.keys(injected); _a < _b.length; _a++) {
                    var scope = _b[_a];
                    embeddedLanguages[scope] = injected[scope];
                }
            }
        }
        var languageId = this._modeService.getLanguageIdentifier(modeId).id;
        var containsEmbeddedLanguages = (Object.keys(embeddedLanguages).length > 0);
        return this._getOrCreateGrammarRegistry().then(function (_res) {
            var grammarRegistry = _res[0], initialState = _res[1];
            return grammarRegistry.loadGrammarWithConfiguration(scopeName, languageId, { embeddedLanguages: embeddedLanguages, tokenTypes: languageRegistration.tokenTypes }).then(function (grammar) {
                return {
                    languageId: languageId,
                    grammar: grammar,
                    initialState: initialState,
                    containsEmbeddedLanguages: containsEmbeddedLanguages
                };
            });
        });
    };
    TextMateService.prototype.registerDefinition = function (modeId) {
        var _this = this;
        var promise = this._createGrammar(modeId).then(function (r) {
            return new TMTokenization(_this._scopeRegistry, r.languageId, r.grammar, r.initialState, r.containsEmbeddedLanguages, _this._notificationService);
        }, function (e) {
            onUnexpectedError(e);
            return null;
        });
        TokenizationRegistry.registerPromise(modeId, promise);
    };
    TextMateService = __decorate([
        __param(0, IModeService),
        __param(1, IWorkbenchThemeService),
        __param(2, IFileService),
        __param(3, INotificationService),
        __param(4, ILogService),
        __param(5, IExtensionService)
    ], TextMateService);
    return TextMateService;
}());
export { TextMateService };
var TMTokenization = /** @class */ (function () {
    function TMTokenization(scopeRegistry, languageId, grammar, initialState, containsEmbeddedLanguages, notificationService) {
        this.notificationService = notificationService;
        this._scopeRegistry = scopeRegistry;
        this._languageId = languageId;
        this._grammar = grammar;
        this._initialState = initialState;
        this._containsEmbeddedLanguages = containsEmbeddedLanguages;
        this._seenLanguages = [];
    }
    TMTokenization.prototype.getInitialState = function () {
        return this._initialState;
    };
    TMTokenization.prototype.tokenize = function (line, state, offsetDelta) {
        throw new Error('Not supported!');
    };
    TMTokenization.prototype.tokenize2 = function (line, state, offsetDelta) {
        if (offsetDelta !== 0) {
            console.log(offsetDelta);
            throw new Error('Unexpected: offsetDelta should be 0.');
        }
        // Do not attempt to tokenize if a line has over 20k
        if (line.length >= 20000) {
            if (!this._tokenizationWarningAlreadyShown) {
                this._tokenizationWarningAlreadyShown = true;
                this.notificationService.warn(nls.localize('too many characters', "Tokenization is skipped for lines longer than 20k characters for performance reasons."));
            }
            console.log("Line (" + line.substr(0, 15) + "...): longer than 20k characters, tokenization skipped.");
            return nullTokenize2(this._languageId, line, state, offsetDelta);
        }
        var textMateResult = this._grammar.tokenizeLine2(line, state);
        if (this._containsEmbeddedLanguages) {
            var seenLanguages = this._seenLanguages;
            var tokens = textMateResult.tokens;
            // Must check if any of the embedded languages was hit
            for (var i = 0, len = (tokens.length >>> 1); i < len; i++) {
                var metadata = tokens[(i << 1) + 1];
                var languageId = TokenMetadata.getLanguageId(metadata);
                if (!seenLanguages[languageId]) {
                    seenLanguages[languageId] = true;
                    this._scopeRegistry.onEncounteredLanguage(languageId);
                }
            }
        }
        var endState;
        // try to save an object if possible
        if (state.equals(textMateResult.ruleStack)) {
            endState = state;
        }
        else {
            endState = textMateResult.ruleStack;
        }
        return new TokenizationResult2(textMateResult.tokens, endState);
    };
    TMTokenization = __decorate([
        __param(5, INotificationService)
    ], TMTokenization);
    return TMTokenization;
}());
