"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.loadMessageBundle = void 0;
var path = require("path");
var fs = require("fs");
var ral_1 = require("../common/ral");
var common_1 = require("../common/common");
var common_2 = require("../common/common");
Object.defineProperty(exports, "MessageFormat", { enumerable: true, get: function () { return common_2.MessageFormat; } });
Object.defineProperty(exports, "BundleFormat", { enumerable: true, get: function () { return common_2.BundleFormat; } });
var toString = Object.prototype.toString;
function isNumber(value) {
    return toString.call(value) === '[object Number]';
}
function isString(value) {
    return toString.call(value) === '[object String]';
}
function isBoolean(value) {
    return value === true || value === false;
}
function readJsonFileSync(filename) {
    return JSON.parse(fs.readFileSync(filename, 'utf8'));
}
var resolvedBundles;
var options;
function initializeSettings() {
    options = { locale: undefined, language: undefined, languagePackSupport: false, cacheLanguageResolution: true, messageFormat: common_1.MessageFormat.bundle };
    if (isString(process.env.VSCODE_NLS_CONFIG)) {
        try {
            var vscodeOptions_1 = JSON.parse(process.env.VSCODE_NLS_CONFIG);
            var language = void 0;
            if (vscodeOptions_1.availableLanguages) {
                var value = vscodeOptions_1.availableLanguages['*'];
                if (isString(value)) {
                    language = value;
                }
            }
            if (isString(vscodeOptions_1.locale)) {
                options.locale = vscodeOptions_1.locale.toLowerCase();
            }
            if (language === undefined) {
                options.language = options.locale;
            }
            else if (language !== 'en') {
                options.language = language;
            }
            if (isBoolean(vscodeOptions_1._languagePackSupport)) {
                options.languagePackSupport = vscodeOptions_1._languagePackSupport;
            }
            if (isString(vscodeOptions_1._cacheRoot)) {
                options.cacheRoot = vscodeOptions_1._cacheRoot;
            }
            if (isString(vscodeOptions_1._languagePackId)) {
                options.languagePackId = vscodeOptions_1._languagePackId;
            }
            if (isString(vscodeOptions_1._translationsConfigFile)) {
                options.translationsConfigFile = vscodeOptions_1._translationsConfigFile;
                try {
                    options.translationsConfig = readJsonFileSync(options.translationsConfigFile);
                }
                catch (error) {
                    // We can't read the translation config file. Mark the cache as corrupted.
                    if (vscodeOptions_1._corruptedFile) {
                        var dirname = path.dirname(vscodeOptions_1._corruptedFile);
                        fs.exists(dirname, function (exists) {
                            if (exists) {
                                fs.writeFile(vscodeOptions_1._corruptedFile, 'corrupted', 'utf8', function (err) {
                                    console.error(err);
                                });
                            }
                        });
                    }
                }
            }
        }
        catch (_a) {
            // Do nothing.
        }
    }
    common_1.setPseudo(options.locale === 'pseudo');
    resolvedBundles = Object.create(null);
}
initializeSettings();
function supportsLanguagePack() {
    return options.languagePackSupport === true && options.cacheRoot !== undefined && options.languagePackId !== undefined && options.translationsConfigFile !== undefined
        && options.translationsConfig !== undefined;
}
function createScopedLocalizeFunction(messages) {
    return function (key, message) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        if (isNumber(key)) {
            if (key >= messages.length) {
                console.error("Broken localize call found. Index out of bounds. Stacktrace is\n: " + new Error('').stack);
                return;
            }
            return common_1.format(messages[key], args);
        }
        else {
            if (isString(message)) {
                console.warn("Message " + message + " didn't get externalized correctly.");
                return common_1.format(message, args);
            }
            else {
                console.error("Broken localize call found. Stacktrace is\n: " + new Error('').stack);
            }
        }
    };
}
function resolveLanguage(file) {
    var resolvedLanguage;
    if (options.cacheLanguageResolution && resolvedLanguage) {
        resolvedLanguage = resolvedLanguage;
    }
    else {
        if (common_1.isPseudo || !options.language) {
            resolvedLanguage = '.nls.json';
        }
        else {
            var locale = options.language;
            while (locale) {
                var candidate = '.nls.' + locale + '.json';
                if (fs.existsSync(file + candidate)) {
                    resolvedLanguage = candidate;
                    break;
                }
                else {
                    var index = locale.lastIndexOf('-');
                    if (index > 0) {
                        locale = locale.substring(0, index);
                    }
                    else {
                        resolvedLanguage = '.nls.json';
                        locale = null;
                    }
                }
            }
        }
        if (options.cacheLanguageResolution) {
            resolvedLanguage = resolvedLanguage;
        }
    }
    return file + resolvedLanguage;
}
function findInTheBoxBundle(root) {
    var language = options.language;
    while (language) {
        var candidate = path.join(root, "nls.bundle." + language + ".json");
        if (fs.existsSync(candidate)) {
            return candidate;
        }
        else {
            var index = language.lastIndexOf('-');
            if (index > 0) {
                language = language.substring(0, index);
            }
            else {
                language = undefined;
            }
        }
    }
    // Test if we can reslove the default bundle.
    if (language === undefined) {
        var candidate = path.join(root, 'nls.bundle.json');
        if (fs.existsSync(candidate)) {
            return candidate;
        }
    }
    return undefined;
}
function mkdir(directory) {
    try {
        fs.mkdirSync(directory);
    }
    catch (err) {
        if (err.code === 'EEXIST') {
            return;
        }
        else if (err.code === 'ENOENT') {
            var parent = path.dirname(directory);
            if (parent !== directory) {
                mkdir(parent);
                fs.mkdirSync(directory);
            }
        }
        else {
            throw err;
        }
    }
}
function createDefaultNlsBundle(folder) {
    var metaData = readJsonFileSync(path.join(folder, 'nls.metadata.json'));
    var result = Object.create(null);
    for (var module_1 in metaData) {
        var entry = metaData[module_1];
        result[module_1] = entry.messages;
    }
    return result;
}
function createNLSBundle(header, metaDataPath) {
    var languagePackLocation = options.translationsConfig[header.id];
    if (!languagePackLocation) {
        return undefined;
    }
    var languagePack = readJsonFileSync(languagePackLocation).contents;
    var metaData = readJsonFileSync(path.join(metaDataPath, 'nls.metadata.json'));
    var result = Object.create(null);
    for (var module_2 in metaData) {
        var entry = metaData[module_2];
        var translations = languagePack[header.outDir + "/" + module_2];
        if (translations) {
            var resultMessages = [];
            for (var i = 0; i < entry.keys.length; i++) {
                var messageKey = entry.keys[i];
                var key = isString(messageKey) ? messageKey : messageKey.key;
                var translatedMessage = translations[key];
                if (translatedMessage === undefined) {
                    translatedMessage = entry.messages[i];
                }
                resultMessages.push(translatedMessage);
            }
            result[module_2] = resultMessages;
        }
        else {
            result[module_2] = entry.messages;
        }
    }
    return result;
}
function touch(file) {
    var d = new Date();
    fs.utimes(file, d, d, function () {
        // Do nothing. Ignore
    });
}
function cacheBundle(key, bundle) {
    resolvedBundles[key] = bundle;
    return bundle;
}
function loadNlsBundleOrCreateFromI18n(header, bundlePath) {
    var result;
    var bundle = path.join(options.cacheRoot, header.id + "-" + header.hash + ".json");
    var useMemoryOnly = false;
    var writeBundle = false;
    try {
        result = JSON.parse(fs.readFileSync(bundle, { encoding: 'utf8', flag: 'r' }));
        touch(bundle);
        return result;
    }
    catch (err) {
        if (err.code === 'ENOENT') {
            writeBundle = true;
        }
        else if (err instanceof SyntaxError) {
            // We have a syntax error. So no valid JSON. Use
            console.log("Syntax error parsing message bundle: " + err.message + ".");
            fs.unlink(bundle, function (err) {
                if (err) {
                    console.error("Deleting corrupted bundle " + bundle + " failed.");
                }
            });
            useMemoryOnly = true;
        }
        else {
            throw err;
        }
    }
    result = createNLSBundle(header, bundlePath);
    if (!result || useMemoryOnly) {
        return result;
    }
    if (writeBundle) {
        try {
            fs.writeFileSync(bundle, JSON.stringify(result), { encoding: 'utf8', flag: 'wx' });
        }
        catch (err) {
            if (err.code === 'EEXIST') {
                return result;
            }
            throw err;
        }
    }
    return result;
}
function loadDefaultNlsBundle(bundlePath) {
    try {
        return createDefaultNlsBundle(bundlePath);
    }
    catch (err) {
        console.log("Generating default bundle from meta data failed.", err);
        return undefined;
    }
}
function loadNlsBundle(header, bundlePath) {
    var result;
    // Core decided to use a language pack. Do the same in the extension
    if (supportsLanguagePack()) {
        try {
            result = loadNlsBundleOrCreateFromI18n(header, bundlePath);
        }
        catch (err) {
            console.log("Load or create bundle failed ", err);
        }
    }
    if (!result) {
        // No language pack found, but core is running in language pack mode
        // Don't try to use old in the box bundles since the might be stale
        // Fall right back to the default bundle.
        if (options.languagePackSupport) {
            return loadDefaultNlsBundle(bundlePath);
        }
        var candidate = findInTheBoxBundle(bundlePath);
        if (candidate) {
            try {
                return readJsonFileSync(candidate);
            }
            catch (err) {
                console.log("Loading in the box message bundle failed.", err);
            }
        }
        result = loadDefaultNlsBundle(bundlePath);
    }
    return result;
}
function tryFindMetaDataHeaderFile(file) {
    var result;
    var dirname = path.dirname(file);
    while (true) {
        result = path.join(dirname, 'nls.metadata.header.json');
        if (fs.existsSync(result)) {
            break;
        }
        var parent = path.dirname(dirname);
        if (parent === dirname) {
            result = undefined;
            break;
        }
        else {
            dirname = parent;
        }
    }
    return result;
}
function loadMessageBundle(file) {
    if (!file) {
        // No file. We are in dev mode. Return the default
        // localize function.
        return common_1.localize;
    }
    // Remove extension since we load json files.
    var ext = path.extname(file);
    if (ext) {
        file = file.substr(0, file.length - ext.length);
    }
    if (options.messageFormat === common_1.MessageFormat.both || options.messageFormat === common_1.MessageFormat.bundle) {
        var headerFile = tryFindMetaDataHeaderFile(file);
        if (headerFile) {
            var bundlePath = path.dirname(headerFile);
            var bundle = resolvedBundles[bundlePath];
            if (bundle === undefined) {
                try {
                    var header = JSON.parse(fs.readFileSync(headerFile, 'utf8'));
                    try {
                        var nlsBundle = loadNlsBundle(header, bundlePath);
                        bundle = cacheBundle(bundlePath, nlsBundle ? { header: header, nlsBundle: nlsBundle } : null);
                    }
                    catch (err) {
                        console.error('Failed to load nls bundle', err);
                        bundle = cacheBundle(bundlePath, null);
                    }
                }
                catch (err) {
                    console.error('Failed to read header file', err);
                    bundle = cacheBundle(bundlePath, null);
                }
            }
            if (bundle) {
                var module_3 = file.substr(bundlePath.length + 1).replace(/\\/g, '/');
                var messages = bundle.nlsBundle[module_3];
                if (messages === undefined) {
                    console.error("Messages for file " + file + " not found. See console for details.");
                    return function () {
                        return 'Messages not found.';
                    };
                }
                return createScopedLocalizeFunction(messages);
            }
        }
    }
    if (options.messageFormat === common_1.MessageFormat.both || options.messageFormat === common_1.MessageFormat.file) {
        // Try to load a single file bundle
        try {
            var json = readJsonFileSync(resolveLanguage(file));
            if (Array.isArray(json)) {
                return createScopedLocalizeFunction(json);
            }
            else {
                if (common_1.isDefined(json.messages) && common_1.isDefined(json.keys)) {
                    return createScopedLocalizeFunction(json.messages);
                }
                else {
                    console.error("String bundle '" + file + "' uses an unsupported format.");
                    return function () {
                        return 'File bundle has unsupported format. See console for details';
                    };
                }
            }
        }
        catch (err) {
            if (err.code !== 'ENOENT') {
                console.error('Failed to load single file bundle', err);
            }
        }
    }
    console.error("Failed to load message bundle for file " + file);
    return function () {
        return 'Failed to load message bundle. See console for details.';
    };
}
exports.loadMessageBundle = loadMessageBundle;
function config(opts) {
    if (opts) {
        if (isString(opts.locale)) {
            options.locale = opts.locale.toLowerCase();
            options.language = options.locale;
            resolvedBundles = Object.create(null);
        }
        if (opts.messageFormat !== undefined) {
            options.messageFormat = opts.messageFormat;
        }
        if (opts.bundleFormat === common_1.BundleFormat.standalone && options.languagePackSupport === true) {
            options.languagePackSupport = false;
        }
    }
    common_1.setPseudo(options.locale === 'pseudo');
    return loadMessageBundle;
}
exports.config = config;
ral_1.default.install(Object.freeze({
    loadMessageBundle: loadMessageBundle,
    config: config
}));
//# sourceMappingURL=main.js.map