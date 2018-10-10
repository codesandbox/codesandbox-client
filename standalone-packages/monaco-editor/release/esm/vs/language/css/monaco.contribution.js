import '../../editor/editor.api.js';
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var Emitter = monaco.Emitter;
// --- CSS configuration and defaults ---------
var LanguageServiceDefaultsImpl = /** @class */ (function () {
    function LanguageServiceDefaultsImpl(languageId, diagnosticsOptions) {
        this._onDidChange = new Emitter();
        this._languageId = languageId;
        this.setDiagnosticsOptions(diagnosticsOptions);
    }
    Object.defineProperty(LanguageServiceDefaultsImpl.prototype, "onDidChange", {
        get: function () {
            return this._onDidChange.event;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LanguageServiceDefaultsImpl.prototype, "languageId", {
        get: function () {
            return this._languageId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LanguageServiceDefaultsImpl.prototype, "diagnosticsOptions", {
        get: function () {
            return this._diagnosticsOptions;
        },
        enumerable: true,
        configurable: true
    });
    LanguageServiceDefaultsImpl.prototype.setDiagnosticsOptions = function (options) {
        this._diagnosticsOptions = options || Object.create(null);
        this._onDidChange.fire(this);
    };
    return LanguageServiceDefaultsImpl;
}());
export { LanguageServiceDefaultsImpl };
var diagnosticDefault = {
    validate: true,
    lint: {
        compatibleVendorPrefixes: 'ignore',
        vendorPrefix: 'warning',
        duplicateProperties: 'warning',
        emptyRules: 'warning',
        importStatement: 'ignore',
        boxModel: 'ignore',
        universalSelector: 'ignore',
        zeroUnits: 'ignore',
        fontFaceProperties: 'warning',
        hexColorLength: 'error',
        argumentsInColorFunction: 'error',
        unknownProperties: 'warning',
        ieHack: 'ignore',
        unknownVendorSpecificProperties: 'ignore',
        propertyIgnoredDueToDisplay: 'warning',
        important: 'ignore',
        float: 'ignore',
        idSelector: 'ignore'
    }
};
var cssDefaults = new LanguageServiceDefaultsImpl('css', diagnosticDefault);
var scssDefaults = new LanguageServiceDefaultsImpl('scss', diagnosticDefault);
var lessDefaults = new LanguageServiceDefaultsImpl('less', diagnosticDefault);
// Export API
function createAPI() {
    return {
        cssDefaults: cssDefaults,
        lessDefaults: lessDefaults,
        scssDefaults: scssDefaults
    };
}
monaco.languages.css = createAPI();
// --- Registration to monaco editor ---
function getMode() {
    return monaco.Promise.wrap(import('./cssMode.js'));
}
monaco.languages.onLanguage('less', function () {
    getMode().then(function (mode) { return mode.setupMode(lessDefaults); });
});
monaco.languages.onLanguage('scss', function () {
    getMode().then(function (mode) { return mode.setupMode(scssDefaults); });
});
monaco.languages.onLanguage('css', function () {
    getMode().then(function (mode) { return mode.setupMode(cssDefaults); });
});
