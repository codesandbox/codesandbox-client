/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var registry_1 = require("./registry");
var grammarReader = require("./grammarReader");
var theme_1 = require("./theme");
var grammar_1 = require("./grammar");
// @ts-ignore
var StandardTokenType;
(function (StandardTokenType) {
    StandardTokenType[StandardTokenType["Other"] = 0] = "Other";
    StandardTokenType[StandardTokenType["Comment"] = 1] = "Comment";
    StandardTokenType[StandardTokenType["String"] = 2] = "String";
    StandardTokenType[StandardTokenType["RegEx"] = 4] = "RegEx";
})(StandardTokenType = exports.StandardTokenType || (exports.StandardTokenType = {}));
/**
 * The registry that will hold all grammars.
 */
var Registry = /** @class */ (function () {
    function Registry(locator) {
        if (locator === void 0) { locator = { loadGrammar: function () { return null; } }; }
        this._locator = locator;
        this._syncRegistry = new registry_1.SyncRegistry(theme_1.Theme.createFromRawTheme(locator.theme), locator.getOnigLib && locator.getOnigLib());
    }
    /**
     * Change the theme. Once called, no previous `ruleStack` should be used anymore.
     */
    Registry.prototype.setTheme = function (theme) {
        this._syncRegistry.setTheme(theme_1.Theme.createFromRawTheme(theme));
    };
    /**
     * Returns a lookup array for color ids.
     */
    Registry.prototype.getColorMap = function () {
        return this._syncRegistry.getColorMap();
    };
    /**
     * Load the grammar for `scopeName` and all referenced included grammars asynchronously.
     * Please do not use language id 0.
     */
    Registry.prototype.loadGrammarWithEmbeddedLanguages = function (initialScopeName, initialLanguage, embeddedLanguages) {
        return this.loadGrammarWithConfiguration(initialScopeName, initialLanguage, { embeddedLanguages: embeddedLanguages });
    };
    /**
     * Load the grammar for `scopeName` and all referenced included grammars asynchronously.
     * Please do not use language id 0.
     */
    Registry.prototype.loadGrammarWithConfiguration = function (initialScopeName, initialLanguage, configuration) {
        return this._loadGrammar(initialScopeName, initialLanguage, configuration.embeddedLanguages, configuration.tokenTypes);
    };
    /**
     * Load the grammar for `scopeName` and all referenced included grammars asynchronously.
     */
    Registry.prototype.loadGrammar = function (initialScopeName) {
        return this._loadGrammar(initialScopeName, 0, null, null);
    };
    Registry.prototype._loadGrammar = function (initialScopeName, initialLanguage, embeddedLanguages, tokenTypes) {
        return __awaiter(this, void 0, void 0, function () {
            var remainingScopeNames, seenScopeNames, scopeName, grammar, injections, deps;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        remainingScopeNames = [initialScopeName];
                        seenScopeNames = {};
                        seenScopeNames[initialScopeName] = true;
                        _a.label = 1;
                    case 1:
                        if (!(remainingScopeNames.length > 0)) return [3 /*break*/, 3];
                        scopeName = remainingScopeNames.shift();
                        if (this._syncRegistry.lookup(scopeName)) {
                            return [3 /*break*/, 1];
                        }
                        return [4 /*yield*/, this._locator.loadGrammar(scopeName)];
                    case 2:
                        grammar = _a.sent();
                        if (!grammar) {
                            if (scopeName === initialScopeName) {
                                throw new Error("No grammar provided for <" + initialScopeName);
                            }
                        }
                        else {
                            injections = typeof this._locator.getInjections === 'function' &&
                                this._locator.getInjections(scopeName);
                            deps = this._syncRegistry.addGrammar(grammar, injections);
                            deps.forEach(function (dep) {
                                if (!seenScopeNames[dep]) {
                                    seenScopeNames[dep] = true;
                                    remainingScopeNames.push(dep);
                                }
                            });
                        }
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/, this.grammarForScopeName(initialScopeName, initialLanguage, embeddedLanguages, tokenTypes)];
                }
            });
        });
    };
    /**
     * Adds a rawGrammar.
     */
    Registry.prototype.addGrammar = function (rawGrammar, injections, initialLanguage, embeddedLanguages) {
        if (injections === void 0) { injections = []; }
        if (initialLanguage === void 0) { initialLanguage = 0; }
        if (embeddedLanguages === void 0) { embeddedLanguages = null; }
        this._syncRegistry.addGrammar(rawGrammar, injections);
        return this.grammarForScopeName(rawGrammar.scopeName, initialLanguage, embeddedLanguages);
    };
    /**
     * Get the grammar for `scopeName`. The grammar must first be created via `loadGrammar` or `addGrammar`.
     */
    Registry.prototype.grammarForScopeName = function (scopeName, initialLanguage, embeddedLanguages, tokenTypes) {
        if (initialLanguage === void 0) { initialLanguage = 0; }
        if (embeddedLanguages === void 0) { embeddedLanguages = null; }
        if (tokenTypes === void 0) { tokenTypes = null; }
        return this._syncRegistry.grammarForScopeName(scopeName, initialLanguage, embeddedLanguages, tokenTypes);
    };
    return Registry;
}());
exports.Registry = Registry;
exports.INITIAL = grammar_1.StackElement.NULL;
exports.parseRawGrammar = grammarReader.parseRawGrammar;
//# sourceMappingURL=main.js.map