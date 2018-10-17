/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var _isWindows = false;
var _isMacintosh = false;
var _isLinux = false;
var _isNative = false;
var _isWeb = false;
var _locale = undefined;
var _language = undefined;
var _translationsConfigFile = undefined;
export var LANGUAGE_DEFAULT = 'en';
// OS detection
if (typeof process === 'object' && typeof process.nextTick === 'function' && typeof process.platform === 'string') {
    _isWindows = (process.platform === 'win32');
    _isMacintosh = (process.platform === 'darwin');
    _isLinux = (process.platform === 'linux');
    _locale = LANGUAGE_DEFAULT;
    _language = LANGUAGE_DEFAULT;
    var rawNlsConfig = process.env['VSCODE_NLS_CONFIG'];
    if (rawNlsConfig) {
        try {
            var nlsConfig = JSON.parse(rawNlsConfig);
            var resolved = nlsConfig.availableLanguages['*'];
            _locale = nlsConfig.locale;
            // VSCode's default language is 'en'
            _language = resolved ? resolved : LANGUAGE_DEFAULT;
            _translationsConfigFile = nlsConfig._translationsConfigFile;
        }
        catch (e) {
        }
    }
    _isNative = true;
}
else if (typeof navigator === 'object') {
    var userAgent = navigator.userAgent;
    _isWindows = userAgent.indexOf('Windows') >= 0;
    _isMacintosh = userAgent.indexOf('Macintosh') >= 0;
    _isLinux = userAgent.indexOf('Linux') >= 0;
    _isWeb = true;
    _locale = navigator.language;
    _language = _locale;
}
export var Platform;
(function (Platform) {
    Platform[Platform["Web"] = 0] = "Web";
    Platform[Platform["Mac"] = 1] = "Mac";
    Platform[Platform["Linux"] = 2] = "Linux";
    Platform[Platform["Windows"] = 3] = "Windows";
})(Platform || (Platform = {}));
var _platform = Platform.Web;
if (_isNative) {
    if (_isMacintosh) {
        _platform = Platform.Mac;
    }
    else if (_isWindows) {
        _platform = Platform.Windows;
    }
    else if (_isLinux) {
        _platform = Platform.Linux;
    }
}
export var isWindows = _isWindows;
export var isMacintosh = _isMacintosh;
export var isLinux = _isLinux;
export var isNative = _isNative;
export var isWeb = _isWeb;
export var platform = _platform;
export function isRootUser() {
    return _isNative && !_isWindows && (process.getuid() === 0);
}
/**
 * The language used for the user interface. The format of
 * the string is all lower case (e.g. zh-tw for Traditional
 * Chinese)
 */
export var language = _language;
/**
 * The OS locale or the locale specified by --locale. The format of
 * the string is all lower case (e.g. zh-tw for Traditional
 * Chinese). The UI is not necessarily shown in the provided locale.
 */
export var locale = _locale;
/**
 * The translatios that are available through language packs.
 */
export var translationsConfigFile = _translationsConfigFile;
var _globals = (typeof self === 'object' ? self : typeof global === 'object' ? global : {});
export var globals = _globals;
var _setImmediate = null;
export function setImmediate(callback) {
    if (_setImmediate === null) {
        if (globals.setImmediate) {
            _setImmediate = globals.setImmediate.bind(globals);
        }
        else if (typeof process !== 'undefined' && typeof process.nextTick === 'function') {
            _setImmediate = process.nextTick.bind(process);
        }
        else {
            _setImmediate = globals.setTimeout.bind(globals);
        }
    }
    return _setImmediate(callback);
}
export var OS = (_isMacintosh ? 2 /* Macintosh */ : (_isWindows ? 1 /* Windows */ : 3 /* Linux */));
