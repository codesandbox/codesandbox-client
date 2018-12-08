/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { onUnexpectedError } from '../../../base/common/errors.js';
import { Emitter } from '../../../base/common/event.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import * as mime from '../../../base/common/mime.js';
import * as strings from '../../../base/common/strings.js';
import { LanguageIdentifier } from '../modes.js';
import { ModesRegistry } from '../modes/modesRegistry.js';
import { NULL_LANGUAGE_IDENTIFIER, NULL_MODE_ID } from '../modes/nullMode.js';
import { Extensions } from '../../../platform/configuration/common/configurationRegistry.js';
import { Registry } from '../../../platform/registry/common/platform.js';
var hasOwnProperty = Object.prototype.hasOwnProperty;
var LanguagesRegistry = /** @class */ (function (_super) {
    __extends(LanguagesRegistry, _super);
    function LanguagesRegistry(useModesRegistry, warnOnOverwrite) {
        if (useModesRegistry === void 0) { useModesRegistry = true; }
        if (warnOnOverwrite === void 0) { warnOnOverwrite = false; }
        var _this = _super.call(this) || this;
        _this._onDidChange = _this._register(new Emitter());
        _this.onDidChange = _this._onDidChange.event;
        _this._nextLanguageId = 1;
        _this._languages = {};
        _this._mimeTypesMap = {};
        _this._nameMap = {};
        _this._lowercaseNameMap = {};
        _this._languageIds = [];
        _this._warnOnOverwrite = warnOnOverwrite;
        if (useModesRegistry) {
            _this._registerLanguages(ModesRegistry.getLanguages());
            _this._register(ModesRegistry.onDidAddLanguages(function (m) { return _this._registerLanguages(m); }));
        }
        return _this;
    }
    LanguagesRegistry.prototype._registerLanguages = function (desc) {
        var _this = this;
        if (desc.length === 0) {
            return;
        }
        for (var i = 0; i < desc.length; i++) {
            this._registerLanguage(desc[i]);
        }
        // Rebuild fast path maps
        this._mimeTypesMap = {};
        this._nameMap = {};
        this._lowercaseNameMap = {};
        Object.keys(this._languages).forEach(function (langId) {
            var language = _this._languages[langId];
            if (language.name) {
                _this._nameMap[language.name] = language.identifier;
            }
            language.aliases.forEach(function (alias) {
                _this._lowercaseNameMap[alias.toLowerCase()] = language.identifier;
            });
            language.mimetypes.forEach(function (mimetype) {
                _this._mimeTypesMap[mimetype] = language.identifier;
            });
        });
        Registry.as(Extensions.Configuration).registerOverrideIdentifiers(ModesRegistry.getLanguages().map(function (language) { return language.id; }));
        this._onDidChange.fire();
    };
    LanguagesRegistry.prototype._registerLanguage = function (lang) {
        var langId = lang.id;
        var resolvedLanguage;
        if (hasOwnProperty.call(this._languages, langId)) {
            resolvedLanguage = this._languages[langId];
        }
        else {
            var languageId = this._nextLanguageId++;
            resolvedLanguage = {
                identifier: new LanguageIdentifier(langId, languageId),
                name: null,
                mimetypes: [],
                aliases: [],
                extensions: [],
                filenames: [],
                configurationFiles: []
            };
            this._languageIds[languageId] = langId;
            this._languages[langId] = resolvedLanguage;
        }
        this._mergeLanguage(resolvedLanguage, lang);
    };
    LanguagesRegistry.prototype._mergeLanguage = function (resolvedLanguage, lang) {
        var _a;
        var langId = lang.id;
        var primaryMime = null;
        if (Array.isArray(lang.mimetypes) && lang.mimetypes.length > 0) {
            (_a = resolvedLanguage.mimetypes).push.apply(_a, lang.mimetypes);
            primaryMime = lang.mimetypes[0];
        }
        if (!primaryMime) {
            primaryMime = "text/x-" + langId;
            resolvedLanguage.mimetypes.push(primaryMime);
        }
        if (Array.isArray(lang.extensions)) {
            for (var _i = 0, _b = lang.extensions; _i < _b.length; _i++) {
                var extension = _b[_i];
                mime.registerTextMime({ id: langId, mime: primaryMime, extension: extension }, this._warnOnOverwrite);
                resolvedLanguage.extensions.push(extension);
            }
        }
        if (Array.isArray(lang.filenames)) {
            for (var _c = 0, _d = lang.filenames; _c < _d.length; _c++) {
                var filename = _d[_c];
                mime.registerTextMime({ id: langId, mime: primaryMime, filename: filename }, this._warnOnOverwrite);
                resolvedLanguage.filenames.push(filename);
            }
        }
        if (Array.isArray(lang.filenamePatterns)) {
            for (var _e = 0, _f = lang.filenamePatterns; _e < _f.length; _e++) {
                var filenamePattern = _f[_e];
                mime.registerTextMime({ id: langId, mime: primaryMime, filepattern: filenamePattern }, this._warnOnOverwrite);
            }
        }
        if (typeof lang.firstLine === 'string' && lang.firstLine.length > 0) {
            var firstLineRegexStr = lang.firstLine;
            if (firstLineRegexStr.charAt(0) !== '^') {
                firstLineRegexStr = '^' + firstLineRegexStr;
            }
            try {
                var firstLineRegex = new RegExp(firstLineRegexStr);
                if (!strings.regExpLeadsToEndlessLoop(firstLineRegex)) {
                    mime.registerTextMime({ id: langId, mime: primaryMime, firstline: firstLineRegex }, this._warnOnOverwrite);
                }
            }
            catch (err) {
                // Most likely, the regex was bad
                onUnexpectedError(err);
            }
        }
        resolvedLanguage.aliases.push(langId);
        var langAliases = null;
        if (typeof lang.aliases !== 'undefined' && Array.isArray(lang.aliases)) {
            if (lang.aliases.length === 0) {
                // signal that this language should not get a name
                langAliases = [null];
            }
            else {
                langAliases = lang.aliases;
            }
        }
        if (langAliases !== null) {
            for (var i = 0; i < langAliases.length; i++) {
                var langAlias = langAliases[i];
                if (!langAlias || langAlias.length === 0) {
                    continue;
                }
                resolvedLanguage.aliases.push(langAlias);
            }
        }
        var containsAliases = (langAliases !== null && langAliases.length > 0);
        if (containsAliases && langAliases[0] === null) {
            // signal that this language should not get a name
        }
        else {
            var bestName = (containsAliases ? langAliases[0] : null) || langId;
            if (containsAliases || !resolvedLanguage.name) {
                resolvedLanguage.name = bestName;
            }
        }
        if (lang.configuration) {
            resolvedLanguage.configurationFiles.push(lang.configuration);
        }
    };
    LanguagesRegistry.prototype.isRegisteredMode = function (mimetypeOrModeId) {
        // Is this a known mime type ?
        if (hasOwnProperty.call(this._mimeTypesMap, mimetypeOrModeId)) {
            return true;
        }
        // Is this a known mode id ?
        return hasOwnProperty.call(this._languages, mimetypeOrModeId);
    };
    LanguagesRegistry.prototype.getRegisteredModes = function () {
        return Object.keys(this._languages);
    };
    LanguagesRegistry.prototype.getRegisteredLanguageNames = function () {
        return Object.keys(this._nameMap);
    };
    LanguagesRegistry.prototype.getLanguageName = function (modeId) {
        if (!hasOwnProperty.call(this._languages, modeId)) {
            return null;
        }
        return this._languages[modeId].name;
    };
    LanguagesRegistry.prototype.getModeIdForLanguageNameLowercase = function (languageNameLower) {
        if (!hasOwnProperty.call(this._lowercaseNameMap, languageNameLower)) {
            return null;
        }
        return this._lowercaseNameMap[languageNameLower].language;
    };
    LanguagesRegistry.prototype.getConfigurationFiles = function (modeId) {
        if (!hasOwnProperty.call(this._languages, modeId)) {
            return [];
        }
        return this._languages[modeId].configurationFiles || [];
    };
    LanguagesRegistry.prototype.getMimeForMode = function (modeId) {
        if (!hasOwnProperty.call(this._languages, modeId)) {
            return null;
        }
        var language = this._languages[modeId];
        return (language.mimetypes[0] || null);
    };
    LanguagesRegistry.prototype.extractModeIds = function (commaSeparatedMimetypesOrCommaSeparatedIds) {
        var _this = this;
        if (!commaSeparatedMimetypesOrCommaSeparatedIds) {
            return [];
        }
        return (commaSeparatedMimetypesOrCommaSeparatedIds.
            split(',').
            map(function (mimeTypeOrId) { return mimeTypeOrId.trim(); }).
            map(function (mimeTypeOrId) {
            if (hasOwnProperty.call(_this._mimeTypesMap, mimeTypeOrId)) {
                return _this._mimeTypesMap[mimeTypeOrId].language;
            }
            return mimeTypeOrId;
        }).
            filter(function (modeId) {
            return hasOwnProperty.call(_this._languages, modeId);
        }));
    };
    LanguagesRegistry.prototype.getLanguageIdentifier = function (_modeId) {
        if (_modeId === NULL_MODE_ID || _modeId === 0 /* Null */) {
            return NULL_LANGUAGE_IDENTIFIER;
        }
        var modeId;
        if (typeof _modeId === 'string') {
            modeId = _modeId;
        }
        else {
            modeId = this._languageIds[_modeId];
            if (!modeId) {
                return null;
            }
        }
        if (!hasOwnProperty.call(this._languages, modeId)) {
            return null;
        }
        return this._languages[modeId].identifier;
    };
    LanguagesRegistry.prototype.getModeIdsFromLanguageName = function (languageName) {
        if (!languageName) {
            return [];
        }
        if (hasOwnProperty.call(this._nameMap, languageName)) {
            return [this._nameMap[languageName].language];
        }
        return [];
    };
    LanguagesRegistry.prototype.getModeIdsFromFilepathOrFirstLine = function (filepath, firstLine) {
        if (!filepath && !firstLine) {
            return [];
        }
        var mimeTypes = mime.guessMimeTypes(filepath, firstLine);
        return this.extractModeIds(mimeTypes.join(','));
    };
    LanguagesRegistry.prototype.getExtensions = function (languageName) {
        if (!hasOwnProperty.call(this._nameMap, languageName)) {
            return [];
        }
        var languageId = this._nameMap[languageName];
        return this._languages[languageId.language].extensions;
    };
    LanguagesRegistry.prototype.getFilenames = function (languageName) {
        if (!hasOwnProperty.call(this._nameMap, languageName)) {
            return [];
        }
        var languageId = this._nameMap[languageName];
        return this._languages[languageId.language].filenames;
    };
    return LanguagesRegistry;
}(Disposable));
export { LanguagesRegistry };
