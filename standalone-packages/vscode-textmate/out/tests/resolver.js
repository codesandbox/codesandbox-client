/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var grammarReader_1 = require("../grammarReader");
var path = require("path");
var fs = require("fs");
var Resolver = /** @class */ (function () {
    function Resolver(grammars, languages, onigLibPromise, onigLibName) {
        this._grammars = grammars;
        this._languages = languages;
        this._onigLibPromise = onigLibPromise;
        this._onigLibName = onigLibName;
        this.language2id = Object.create(null);
        this._lastLanguageId = 0;
        this._id2language = [];
        for (var i = 0; i < this._languages.length; i++) {
            var languageId = ++this._lastLanguageId;
            this.language2id[this._languages[i].id] = languageId;
            this._id2language[languageId] = this._languages[i].id;
        }
    }
    Resolver.prototype.getOnigLib = function () {
        return this._onigLibPromise;
    };
    Resolver.prototype.getOnigLibName = function () {
        return this._onigLibName;
    };
    Resolver.prototype.findLanguageByExtension = function (fileExtension) {
        for (var i = 0; i < this._languages.length; i++) {
            var language = this._languages[i];
            if (!language.extensions) {
                continue;
            }
            for (var j = 0; j < language.extensions.length; j++) {
                var extension = language.extensions[j];
                if (extension === fileExtension) {
                    return language.id;
                }
            }
        }
        return null;
    };
    Resolver.prototype.findLanguageByFilename = function (filename) {
        for (var i = 0; i < this._languages.length; i++) {
            var language = this._languages[i];
            if (!language.filenames) {
                continue;
            }
            for (var j = 0; j < language.filenames.length; j++) {
                var lFilename = language.filenames[j];
                if (filename === lFilename) {
                    return language.id;
                }
            }
        }
        return null;
    };
    Resolver.prototype.findScopeByFilename = function (filename) {
        var language = this.findLanguageByExtension(path.extname(filename)) || this.findLanguageByFilename(filename);
        if (language) {
            var grammar = this.findGrammarByLanguage(language);
            if (grammar) {
                return grammar.scopeName;
            }
        }
        return null;
    };
    Resolver.prototype.findGrammarByLanguage = function (language) {
        for (var i = 0; i < this._grammars.length; i++) {
            var grammar = this._grammars[i];
            if (grammar.language === language) {
                return grammar;
            }
        }
        throw new Error('Could not findGrammarByLanguage for ' + language);
    };
    Resolver.prototype.loadGrammar = function (scopeName) {
        for (var i = 0; i < this._grammars.length; i++) {
            var grammar = this._grammars[i];
            if (grammar.scopeName === scopeName) {
                if (!grammar.grammar) {
                    grammar.grammar = readGrammarFromPath(grammar.path);
                }
                return grammar.grammar;
            }
        }
        //console.warn('test resolver: missing grammar for ' + scopeName);
        return null;
    };
    return Resolver;
}());
exports.Resolver = Resolver;
function readGrammarFromPath(path) {
    return new Promise(function (c, e) {
        fs.readFile(path, function (error, content) {
            if (error) {
                e(error);
            }
            else {
                c(grammarReader_1.parseRawGrammar(content.toString(), path));
            }
        });
    });
}
//# sourceMappingURL=resolver.js.map